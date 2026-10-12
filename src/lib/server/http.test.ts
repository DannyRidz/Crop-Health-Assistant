import { describe, expect, it } from "vitest";
import { assertOrigin, limitedBody, readJson } from "./http";

describe("request boundary, AC-8 and AC-16", () => {
  it("rejects cross origin and missing origin mutations", () => {
    for (const origin of [null, "https://another.example"]) expect(() => assertOrigin(new Request("http://localhost:3000/api/assess", { headers: origin ? { origin } : {} }))).toThrow("origin");
    expect(() => assertOrigin(new Request("http://localhost:3000/api/assess", { headers: { origin: "http://localhost:3000" } }))).not.toThrow();
  });
  it("accepts the real incoming host when the standalone adapter uses an internal hostname", () => {
    expect(() => assertOrigin(new Request("http://localhost:3100/api/session", { headers: { origin: "http://127.0.0.1:3100", host: "127.0.0.1:3100" } }))).not.toThrow();
    expect(() => assertOrigin(new Request("https://localhost/api/session", { headers: { origin: "http://example.com", host: "example.com" } }))).toThrow("origin");
  });
  it("limits streaming bytes even without Content-Length", async () => {
    const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(4)); controller.enqueue(new Uint8Array(4)); controller.close(); } });
    const request = new Request("http://localhost", { method: "POST", body: stream, duplex: "half" } as RequestInit);
    await expect(limitedBody(request, 6)).rejects.toThrow("too_large");
  });
  it("accepts the exact byte limit but rejects misleading declared sizes", async () => {
    expect((await limitedBody(new Request("http://localhost", { method: "POST", body: "1234" }), 4)).length).toBe(4);
    await expect(limitedBody(new Request("http://localhost", { method: "POST", body: "x", headers: { "content-length": "100" } }), 4)).rejects.toThrow("too_large");
  });
  it("rejects malformed JSON with a safe error", async () => {
    await expect(readJson(new Request("http://localhost", { method: "POST", body: "{", headers: { "content-type": "application/json" } }))).rejects.toThrow("invalid_input");
  });
});
