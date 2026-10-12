import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { ApiError } from "./http";

export const COOKIE_NAME = "crop_session";
export const SESSION_MS = 60 * 60 * 1000;
export const ENVELOPE_MS = 30 * 60 * 1000;
type Kind = "session" | "preliminary" | "result" | "guidance";
type Token = { kind: Kind; sid: string; expiresAt: number; data: unknown };
type Counter = { expiresAt: number; assess: number; translate: number; guidance: number; busy: boolean };
type Bucket = { expiresAt: number; count: number };
const globalState = globalThis as typeof globalThis & { cropQuota?: { sessions: Map<string, Counter>; addresses: Map<string, Bucket>; active: number } };
const state = globalState.cropQuota ??= { sessions: new Map(), addresses: new Map(), active: 0 };

function secret(): string {
  const value = process.env.SESSION_SIGNING_SECRET;
  if (!value || value.length < 32) throw new ApiError(503, "unavailable");
  return value;
}
export function digest(value: string | Uint8Array): string { return createHash("sha256").update(value).digest("hex"); }
export function sign(kind: Kind, sid: string, data: unknown, lifetime = ENVELOPE_MS): string {
  const body = Buffer.from(JSON.stringify({ kind, sid, expiresAt: Date.now() + lifetime, data })).toString("base64url");
  return `${body}.${createHmac("sha256", secret()).update(body).digest("base64url")}`;
}
export function verify<T>(value: string, kind: Kind, sid?: string): T {
  if (value.length > 40000) throw new ApiError(409, "expired", true);
  const [body, signature, extra] = value.split(".");
  if (!body || !signature || extra) throw new ApiError(409, "expired", true);
  const expected = createHmac("sha256", secret()).update(body).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new ApiError(409, "expired", true);
  let token: Token;
  try { token = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch { throw new ApiError(409, "expired", true); }
  if (token.kind !== kind || !Number.isFinite(token.expiresAt) || token.expiresAt <= Date.now() || (sid && token.sid !== sid)) throw new ApiError(409, "expired", true);
  return token.data as T;
}
function prune() {
  const now = Date.now();
  for (const [key, item] of state.sessions) if (item.expiresAt <= now && !item.busy) state.sessions.delete(key);
  for (const [key, item] of state.addresses) if (item.expiresAt <= now) state.addresses.delete(key);
  if (state.sessions.size >= 10000 || state.addresses.size >= 10000) throw new ApiError(429, "quota", true, 600);
}
function addressLimit(request: Request, purpose: string) {
  prune();
  // Forwarded addresses are trusted only when configured behind the selected ingress.
  const address = process.env.TRUST_PROXY === "true" ? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown" : "local";
  const key = `${purpose}:${createHmac("sha256", secret()).update(address).digest("hex")}`;
  const bucket = state.addresses.get(key) ?? { count: 0, expiresAt: Date.now() + 600000 };
  if (bucket.count >= 10) throw new ApiError(429, "quota", true, Math.ceil((bucket.expiresAt - Date.now()) / 1000));
  bucket.count++;
  state.addresses.set(key, bucket);
}
export function issueSession(request: NextRequest): { sid: string; cookie: string; remaining: number } {
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing) {
    try {
      const data = verify<{ sid: string }>(existing, "session");
      const counter = state.sessions.get(data.sid);
      if (counter && counter.expiresAt > Date.now()) return { sid: data.sid, cookie: existing, remaining: 6 - counter.assess };
    } catch (error) { if (error instanceof ApiError && error.status === 503) throw error; }
  }
  addressLimit(request, "issue");
  const sid = randomUUID();
  state.sessions.set(sid, { expiresAt: Date.now() + SESSION_MS, assess: 0, translate: 0, guidance: 0, busy: false });
  return { sid, cookie: sign("session", sid, { sid }, SESSION_MS), remaining: 6 };
}
export function getSession(request: NextRequest): string {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) throw new ApiError(409, "expired", true);
  const { sid } = verify<{ sid: string }>(cookie, "session");
  const counter = state.sessions.get(sid);
  if (!counter || counter.expiresAt <= Date.now()) throw new ApiError(409, "expired", true);
  return sid;
}
export function acquire(request: Request, sid: string, kind: "assess" | "translate" | "guidance"): { remaining: number; release: () => void } {
  const counter = state.sessions.get(sid);
  if (!counter) throw new ApiError(409, "expired", true);
  const cap = kind === "assess" ? 6 : kind === "translate" ? 2 : 20;
  if (counter.busy) throw new ApiError(409, "busy", true, 2);
  if (counter[kind] >= cap) throw new ApiError(429, "quota", true, Math.ceil((counter.expiresAt - Date.now()) / 1000));
  if (kind !== "guidance") {
    if (state.active >= 2) throw new ApiError(429, "busy", true, 5);
    addressLimit(request, "model");
    state.active++;
  }
  counter[kind]++;
  counter.busy = true;
  let released = false;
  return { remaining: cap - counter[kind], release: () => {
    if (released) return;
    released = true; counter.busy = false;
    if (kind !== "guidance") state.active--;
  } };
}
export function assertScreening() {
  if (process.env.SCREENING_ENABLED !== "true" || !process.env.GEMINI_API_KEY ||
      !["demo", "paid"].includes(process.env.GEMINI_SERVICE_TIER ?? "")) throw new ApiError(503, "disabled");
  secret();
}
