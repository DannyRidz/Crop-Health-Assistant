import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { acquire, issueSession, sign, verify } from "./session";

let sequence = 0;
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(Date.UTC(2026, 9, 12) + ++sequence * 3600001); vi.stubEnv("SESSION_SIGNING_SECRET", "synthetic-test-signing-value-over-32-characters"); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe("anonymous request allowance, AC-8 and AC-16", () => {
  it("binds envelopes to their session and purpose and rejects tampering or expiry", () => {
    const token = sign("result", "session-a", { value: 1 }, 1000);
    expect(verify(token, "result", "session-a")).toEqual({ value: 1 });
    expect(() => verify(token, "guidance", "session-a")).toThrow("expired");
    expect(() => verify(token, "result", "session-b")).toThrow("expired");
    expect(() => verify(token.slice(0, -4) + "xxxx", "result", "session-a")).toThrow("expired");
    vi.advanceTimersByTime(1001); expect(() => verify(token, "result", "session-a")).toThrow("expired");
  });
  it("counts failed attempts and refuses more than six screening dispatches", () => {
    const request = new NextRequest("http://localhost:3000/api/session");
    const { sid } = issueSession(request);
    for (let index = 0; index < 6; index++) { const allowance = acquire(request, sid, "assess"); expect(allowance.remaining).toBe(5 - index); allowance.release(); }
    expect(() => acquire(request, sid, "assess")).toThrow("quota");
  });
  it("rejects concurrent requests in one session and releases allowance exactly once", () => {
    const request = new NextRequest("http://localhost:3000/api/session");
    const { sid } = issueSession(request), first = acquire(request, sid, "assess");
    expect(() => acquire(request, sid, "guidance")).toThrow("busy");
    first.release(); first.release(); const next = acquire(request, sid, "guidance"); next.release();
  });
  it("limits translation and lightweight guidance calls independently", () => {
    const request = new NextRequest("http://localhost:3000/api/session"), { sid } = issueSession(request);
    for (let index = 0; index < 2; index++) acquire(request, sid, "translate").release();
    expect(() => acquire(request, sid, "translate")).toThrow("quota");
    for (let index = 0; index < 20; index++) acquire(request, sid, "guidance").release();
    expect(() => acquire(request, sid, "guidance")).toThrow("quota");
  });
});


describe("M2 capacity boundaries, AC-8", () => {
  it("limits model work across sessions without charging rejected concurrency", () => {
    const request = new NextRequest("http://localhost:3000/api/session");
    const sessions = [issueSession(request), issueSession(request), issueSession(request)];
    const first = acquire(request, sessions[0].sid, "assess");
    const second = acquire(request, sessions[1].sid, "translate");
    expect(() => acquire(request, sessions[2].sid, "assess")).toThrow("busy");
    first.release();
    const admitted = acquire(request, sessions[2].sid, "assess");
    expect(admitted.remaining).toBe(5);
    admitted.release(); second.release();
  });
  it("limits new session issuance and permits it after the address window", () => {
    const request = new NextRequest("http://localhost:3000/api/session");
    for (let index = 0; index < 10; index++) issueSession(request);
    expect(() => issueSession(request)).toThrow("quota");
    vi.advanceTimersByTime(600001);
    expect(issueSession(request).remaining).toBe(6);
  });
});
