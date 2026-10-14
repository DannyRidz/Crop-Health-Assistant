import { describe, expect, it } from "vitest";
import { assertOrigin, limitedBody, readJson } from "./http";

describe("request boundary, AC-8 and AC-16", () => {
  it("accepts only the exact configured HTTPS Hosting origin without trusting forwarded hosts", () => {
    const previous = process.env.PUBLIC_APP_ORIGIN;
    process.env.PUBLIC_APP_ORIGIN = "https://coffee-leaf-check.web.app";
    try {
      const request = (origin: string, extra = {}) => new Request("https://backend.run.app/api/session", { headers: { origin, host: "backend.run.app", ...extra } });
      expect(() => assertOrigin(request("https://coffee-leaf-check.web.app"))).not.toThrow();
      for (const origin of ["http://coffee-leaf-check.web.app", "https://coffee-leaf-check.web.app.evil.example", "https://another.web.app", "https://coffee-leaf-check.web.app/"]) {
        expect(() => assertOrigin(request(origin, { "x-forwarded-host": "coffee-leaf-check.web.app" }))).toThrow("origin");
      }
      expect(() => assertOrigin(request("https://coffee-leaf-check.web.app", { "sec-fetch-site": "cross-site" }))).toThrow("origin");
    } finally {
      if (previous === undefined) delete process.env.PUBLIC_APP_ORIGIN;
      else process.env.PUBLIC_APP_ORIGIN = previous;
    }
  });
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
