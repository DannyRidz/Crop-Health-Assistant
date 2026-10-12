import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sharp from "sharp";
import { NextRequest } from "next/server";
import { POST as sessionRoute } from "../session/route";
import { POST as assessRoute } from "./route";
import { POST as guidanceRoute } from "../guidance/route";
import { POST as translationRoute } from "../translate/route";
import { modelFixture, PHOTO_ID } from "@/lib/test-fixtures";
import { UNKNOWN_REGION, type AssessResponse } from "@/lib/contracts";

const { createInteraction } = vi.hoisted(() => ({ createInteraction: vi.fn() }));
vi.mock("@google/genai", () => ({ GoogleGenAI: class { interactions = { create: createInteraction }; } }));
const origin = "http://localhost:3000";
let sequence = 0, jpeg: Buffer;
beforeEach(async () => {
  vi.useFakeTimers(); vi.setSystemTime(Date.UTC(2026, 9, 12) + ++sequence * 3600001);
  vi.stubEnv("SCREENING_ENABLED", "true"); vi.stubEnv("GEMINI_API_KEY", "synthetic-sdk-boundary-key");
  vi.stubEnv("SESSION_SIGNING_SECRET", "synthetic-test-signing-value-over-32-characters"); vi.stubEnv("GEMINI_SERVICE_TIER", "demo");
  createInteraction.mockReset().mockResolvedValue({ status: "completed", output_text: JSON.stringify(modelFixture()), usage: { total_input_tokens: 50, total_output_tokens: 50, total_tokens: 100 } });
  jpeg = await sharp({ create: { width: 100, height: 100, channels: 3, background: "green" } }).jpeg().toBuffer();
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
async function session(): Promise<string> {
  const response = await sessionRoute(new NextRequest(`${origin}/api/session`, { method: "POST", headers: { origin } }));
  expect(response.status).toBe(200);
  return response.headers.get("set-cookie")!.split(";")[0];
}
function request(phase: "preliminary" | "final", cookie: string, id: string, preliminaryEnvelope: string | null = null, extra: Record<string, unknown> = {}) {
  const form = new FormData();
  form.append("metadata", JSON.stringify({ schemaVersion: 1, assessmentId: id, inputRevision: phase === "final" ? 5 : 1, contextRevision: 1, phase,
    photos: [{ id: PHOTO_ID, side: "unknown" }], starterAnswers: phase === "final" ? ["onset", "spread", "symptoms", "care_change"].map((questionId) => ({ questionId, optionIds: ["not_sure"], detail: "" })) : [], followUpAnswers: [], preliminaryEnvelope, region: UNKNOWN_REGION, isDemo: true, ...extra }));
  form.append("photos", new Blob([new Uint8Array(jpeg)]), "synthetic.jpg");
  return new NextRequest(`${origin}/api/assess`, { method: "POST", headers: { origin, cookie }, body: form });
}
function jsonRequest(path: string, cookie: string, value: unknown) { return new NextRequest(`${origin}${path}`, { method: "POST", headers: { origin, cookie, "content-type": "application/json" }, body: JSON.stringify(value) }); }

describe("M1 route integration with mocked SDK boundary, AC-3, AC-6 through AC-11, AC-16 and AC-19", () => {
  it("completes preliminary and final phases and reselects regional guidance without an AI call", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    const preliminaryResponse = await assessRoute(request("preliminary", cookie, id));
    expect(preliminaryResponse.status).toBe(200);
    const preliminary = await preliminaryResponse.json() as Extract<AssessResponse, { phase: "preliminary" }>;
    const finalResponse = await assessRoute(request("final", cookie, id, preliminary.preliminary.envelope));
    expect(finalResponse.status).toBe(200);
    const final = await finalResponse.json() as Extract<AssessResponse, { phase: "final" }>;
    expect(final.result.data.status).toBe("unable_to_assess"); expect(final.result.data.conditionId).toBeNull();
    expect(final.guidance.data.guidanceAvailability).toBe("region_unknown");
    const changed = await guidanceRoute(jsonRequest("/api/guidance", cookie, { schemaVersion: 1, resultEnvelope: final.result.envelope, contextRevision: 2, region: { response: "known", countryCode: "BN", regionId: null } }));
    expect(changed.status).toBe(200); expect((await changed.json()).data.entries).toEqual([]); expect(createInteraction).toHaveBeenCalledTimes(2);
    const providerInput = createInteraction.mock.calls[1][0];
    expect(providerInput.store).toBe(false); expect(providerInput.previous_interaction_id).toBeUndefined();
    expect(JSON.stringify(providerInput.input)).not.toContain("countryCode");
    expect(providerInput.generation_config.max_output_tokens).toBe(2048);
  });
  it("rejects final requests without a valid sequence or with replaced photos", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    expect((await assessRoute(request("final", cookie, id))).status).toBe(422);
    const preliminary = await (await assessRoute(request("preliminary", cookie, id))).json();
    jpeg = await sharp({ create: { width: 110, height: 90, channels: 3, background: "red" } }).jpeg().toBuffer();
    expect((await assessRoute(request("final", cookie, id, preliminary.preliminary.envelope))).status).toBe(409);
    expect(createInteraction).toHaveBeenCalledTimes(1);
  });
  it("rejects forged crop fields, unknown answers and private uploads in demonstration mode", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    expect((await assessRoute(request("preliminary", cookie, id, null, { crop: "taro" }))).status).toBe(422);
    expect((await assessRoute(request("preliminary", cookie, id, null, { isDemo: false }))).status).toBe(422);
    expect(createInteraction).not.toHaveBeenCalled();
  });
  it("returns safe errors without a fabricated result when the provider fails or output is malformed", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    createInteraction.mockRejectedValueOnce(new Error("sensitive SDK request details must not escape"));
    const failed = await assessRoute(request("preliminary", cookie, id));
    expect(failed.status).toBe(503); const body = await failed.json(); expect(body.result).toBeUndefined(); expect(JSON.stringify(body)).not.toContain("sensitive");
    createInteraction.mockResolvedValueOnce({ status: "completed", output_text: JSON.stringify({ ...modelFixture(), treatment: "unexpected" }) });
    expect((await assessRoute(request("preliminary", cookie, id))).status).toBe(502);
  });
  it("rejects missing sessions and foreign origins before making provider calls", async () => {
    expect((await assessRoute(request("preliminary", "", crypto.randomUUID()))).status).toBe(409);
    const response = await sessionRoute(new NextRequest(`${origin}/api/session`, { method: "POST", headers: { origin: "https://other.example" } }));
    expect(response.status).toBe(400); expect(createInteraction).not.toHaveBeenCalled();
  });
  it("has no provider call when screening is disabled and sends secure cookie instructions", async () => {
    const response = await sessionRoute(new NextRequest(`${origin}/api/session`, { method: "POST", headers: { origin } }));
    expect(response.headers.get("set-cookie")).toContain("HttpOnly"); expect(response.headers.get("set-cookie")).toContain("SameSite=strict");
    vi.stubEnv("SCREENING_ENABLED", "false");
    const disabled = await sessionRoute(new NextRequest(`${origin}/api/session`, { method: "POST", headers: { origin } }));
    expect(disabled.status).toBe(503); expect((await disabled.json()).error.code).toBe("disabled"); expect(createInteraction).not.toHaveBeenCalled();
  });
  it("translates only signed canonical text, without resending photos or accepting extra fields", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    const preliminary = await (await assessRoute(request("preliminary", cookie, id))).json();
    createInteraction.mockResolvedValueOnce({ status: "completed", output_text: JSON.stringify({ "observation:visible_1": "Synthetic translated observation", "limitation:0": "Synthetic translated limitation" }) });
    const translated = await translationRoute(jsonRequest("/api/translate", cookie, { schemaVersion: 1, envelope: preliminary.preliminary.envelope, kind: "preliminary", target: "tpi", textHash: preliminary.preliminary.data.textHash }));
    expect(translated.status).toBe(200);
    const translationInput = JSON.parse(createInteraction.mock.calls[1][0].input);
    expect(Object.keys(translationInput)).toEqual(["observation:visible_1", "limitation:0"]);
    expect(translationInput.photos).toBeUndefined(); expect(translationInput.guidance).toBeUndefined();
    const invalid = await translationRoute(jsonRequest("/api/translate", cookie, { schemaVersion: 1, envelope: preliminary.preliminary.envelope, kind: "preliminary", target: "tpi", textHash: preliminary.preliminary.data.textHash, text: "user supplied advice" }));
    expect(invalid.status).toBe(422);
  });
});
