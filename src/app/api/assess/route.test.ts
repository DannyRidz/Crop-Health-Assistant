import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sharp from "sharp";
import { NextRequest } from "next/server";
import { POST as sessionRoute } from "../session/route";
import { POST as assessRoute } from "./route";
import { POST as guidanceRoute } from "../guidance/route";
import { POST as translationRoute } from "../translate/route";
import { modelFixture, PHOTO_ID } from "@/lib/test-fixtures";
import { UNKNOWN_REGION, SCHEMA_VERSION, type AssessResponse } from "@/lib/contracts";

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
  form.append("metadata", JSON.stringify({ schemaVersion: SCHEMA_VERSION, assessmentId: id, inputRevision: phase === "final" ? 5 : 1, contextRevision: 1, photoRevision: 1, phase,
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
    const changed = await guidanceRoute(jsonRequest("/api/guidance", cookie, { schemaVersion: SCHEMA_VERSION, resultEnvelope: final.result.envelope, contextRevision: 2, region: { response: "known", countryCode: "BN", regionId: null } }));
    expect(changed.status).toBe(200); expect((await changed.json()).data.entries).toEqual([]); expect(createInteraction).toHaveBeenCalledTimes(2);
    const providerInput = createInteraction.mock.calls[1][0];
    expect(providerInput.store).toBe(false); expect(providerInput.previous_interaction_id).toBeUndefined();
    expect(JSON.stringify(providerInput.input)).not.toContain("countryCode");
    expect(providerInput.generation_config.max_output_tokens).toBe(3072);
  });
  it("preserves findings after malformed optional advice and reselects sourced care without another model call", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    const preliminary = await (await assessRoute(request("preliminary", cookie, id))).json();
    createInteraction.mockResolvedValueOnce({ status: "completed", output_text: JSON.stringify({ ...modelFixture(), careSelections: [{ actionId: "pg_check_drainage", observationIds: ["visible_1"] }, { actionId: "invented", observationIds: ["visible_1"] }] }) });
    const response = await assessRoute(request("final", cookie, id, preliminary.preliminary.envelope, { region: { response: "known", countryCode: "PG", regionId: null } }));
    expect(response.status).toBe(200);
    const final = await response.json() as Extract<AssessResponse, { phase: "final" }>;
    expect(final.guidance.data.aiAdvice.careIds).toEqual(["pg_check_drainage"]);
    expect(final.result.data.adviceIssues).toContain("invalid_selection"); expect(final.result.data.observations).toHaveLength(1);
    expect(final.guidance.data.entries).toEqual([]); expect(final.guidance.data.aiAdvice.chemical.product).toBeNull();
    const changed = await guidanceRoute(jsonRequest("/api/guidance", cookie, { schemaVersion: SCHEMA_VERSION, resultEnvelope: final.result.envelope, contextRevision: 2, region: { response: "known", countryCode: "BN", regionId: null }, locale: "tpi" }));
    expect(changed.status).toBe(200); expect((await changed.json()).data.aiAdvice.careIds).toEqual([]); expect(createInteraction).toHaveBeenCalledTimes(2);
  });
  it("rejects invented chemical form data as a local error while keeping the signed case usable", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    const preliminary = await (await assessRoute(request("preliminary", cookie, id))).json();
    const final = await (await assessRoute(request("final", cookie, id, preliminary.preliminary.envelope))).json();
    const value = { schemaVersion: SCHEMA_VERSION, resultEnvelope: final.result.envelope, contextRevision: 1, region: UNKNOWN_REGION, locale: "en" };
    const rejected = await guidanceRoute(jsonRequest("/api/guidance", cookie, { ...value, chemicalContext: { productId: "invented" } }));
    expect(rejected.status).toBe(422);
    expect((await guidanceRoute(jsonRequest("/api/guidance", cookie, value))).status).toBe(200);
    expect(createInteraction).toHaveBeenCalledTimes(2);
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
  it("preserves provider quota errors and logs only safe status metadata", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    const log = vi.spyOn(console, "info");
    createInteraction.mockRejectedValueOnce(Object.assign(new Error("private provider request and credential details"), { status: 429 }));
    const response = await assessRoute(request("preliminary", cookie, id));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    const body = await response.json();
    expect(body.error.code).toBe("quota"); expect(body.error.retryable).toBe(true);
    expect(body.result).toBeUndefined();
    expect(log.mock.calls.some(([value]) => JSON.parse(String(value)).providerStatus === 429)).toBe(true);
    expect(JSON.stringify(log.mock.calls)).not.toContain("private provider");
    expect(JSON.stringify(body)).not.toContain("credential");
  });
  it("recognises SDK timeouts described in the message and retains a safe retry error", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    createInteraction.mockRejectedValueOnce(new Error("Request timed out: TimeoutError: operation aborted"));
    const response = await assessRoute(request("preliminary", cookie, id));
    expect(response.status).toBe(504);
    const body = await response.json();
    expect(body.error.code).toBe("timeout"); expect(body.error.retryable).toBe(true);
    expect(body.result).toBeUndefined();
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
    const translated = await translationRoute(jsonRequest("/api/translate", cookie, { schemaVersion: SCHEMA_VERSION, envelope: preliminary.preliminary.envelope, kind: "preliminary", target: "tpi", textHash: preliminary.preliminary.data.textHash }));
    expect(translated.status).toBe(200);
    const translationInput = JSON.parse(createInteraction.mock.calls[1][0].input);
    expect(Object.keys(translationInput)).toEqual(["observation:visible_1", "limitation:0"]);
    expect(translationInput.photos).toBeUndefined(); expect(translationInput.guidance).toBeUndefined();
    const invalid = await translationRoute(jsonRequest("/api/translate", cookie, { schemaVersion: SCHEMA_VERSION, envelope: preliminary.preliminary.envelope, kind: "preliminary", target: "tpi", textHash: preliminary.preliminary.data.textHash, text: "user supplied advice" }));
    expect(invalid.status).toBe(422);
  });
});


describe("M2 route boundaries with mocked SDK, AC-2, AC-3, AC-7 and AC-8", () => {
  it("rejects legacy schemas without an AI request and binds the photo revision, UR-10", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    const legacy = await assessRoute(request("preliminary", cookie, id, null, { schemaVersion: 1 }));
    expect(legacy.status).toBe(409); expect((await legacy.json()).error.code).toBe("assessment_version_changed");
    expect(createInteraction).not.toHaveBeenCalled();
    const preliminary = await (await assessRoute(request("preliminary", cookie, id))).json();
    const changed = await assessRoute(request("final", cookie, id, preliminary.preliminary.envelope, { photoRevision: 2 }));
    expect(changed.status).toBe(409); expect(createInteraction).toHaveBeenCalledTimes(1);
  });
  it("processes both photos and rejects an incomplete model photo check", async () => {
    const cookie = await session(), id = crypto.randomUUID(), secondId = crypto.randomUUID();
    const base = request("preliminary", cookie, id);
    const form = await base.formData();
    const metadata = JSON.parse(String(form.get("metadata")));
    metadata.photos.push({ id: secondId, side: "underside" });
    form.set("metadata", JSON.stringify(metadata));
    form.append("photos", new Blob([new Uint8Array(jpeg)]), "second.jpg");
    const makeRequest = () => new NextRequest(`${origin}/api/assess`, { method: "POST", headers: { origin, cookie }, body: form });
    const incomplete = await assessRoute(makeRequest());
    expect(incomplete.status).toBe(502);
    const output = modelFixture();
    output.photoChecks.push({ photoId: secondId, quality: "usable", crop: "coffee", part: "leaf" });
    output.observations[0].photoIds.push(secondId);
    createInteraction.mockResolvedValueOnce({ status: "completed", output_text: JSON.stringify(output) });
    const response = await assessRoute(makeRequest());
    expect(response.status).toBe(200);
    expect((await response.json()).preliminary.data.photoChecks).toHaveLength(2);
    expect(createInteraction.mock.calls[1][0].input.filter((part: { type: string }) => part.type === "image")).toHaveLength(2);
  });
  it("counts rejected dispatches and returns quota without another provider request", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    for (let index = 0; index < 6; index++) {
      const response = await assessRoute(request("preliminary", cookie, id, null, { unexpected: true }));
      expect(response.status).toBe(422);
    }
    const exhausted = await assessRoute(request("preliminary", cookie, id));
    expect(exhausted.status).toBe(429);
    expect(Number(exhausted.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect((await exhausted.json()).error.code).toBe("quota");
    expect(createInteraction).not.toHaveBeenCalled();
  });
  it("rejects changed leaf side and another session using a preliminary envelope", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    const preliminary = await (await assessRoute(request("preliminary", cookie, id))).json();
    const sideChanged = await assessRoute(request("final", cookie, id, preliminary.preliminary.envelope, { photos: [{ id: PHOTO_ID, side: "upper" }] }));
    expect(sideChanged.status).toBe(409);
    const otherCookie = await session();
    expect((await assessRoute(request("final", otherCookie, id, preliminary.preliminary.envelope))).status).toBe(409);
    expect(createInteraction).toHaveBeenCalledTimes(1);
  });
  it("allows retry after a provider failure with the same preserved input", async () => {
    const cookie = await session(), id = crypto.randomUUID();
    createInteraction.mockRejectedValueOnce(new Error("temporary provider failure"));
    expect((await assessRoute(request("preliminary", cookie, id))).status).toBe(503);
    const retry = await assessRoute(request("preliminary", cookie, id));
    expect(retry.status).toBe(200);
    expect((await retry.json()).remaining).toBe(4);
    expect(createInteraction).toHaveBeenCalledTimes(2);
  });
});
