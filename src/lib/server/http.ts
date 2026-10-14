import { randomUUID } from "node:crypto";

export class ApiError extends Error {
  constructor(public status: number, public code: string, public retryable = false, public retryAfter?: number) {
    super(code);
  }
}

export function assertOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const target = new URL(request.url);
  // The standalone adapter can use its internal hostname in request.url.
  // Browsers bind Origin to the actual incoming Host, including its port.
  const host = request.headers.get("host") ?? target.host;
  let source: URL;
  try { source = new URL(origin ?? ""); } catch { throw new ApiError(400, "origin"); }
  const configuredOrigin = process.env.PUBLIC_APP_ORIGIN;
  const hostingOrigin = configuredOrigin === source.origin && source.protocol === "https:";
  const incomingOrigin = source.host === host && source.protocol === target.protocol;
  if (source.origin !== origin || (!hostingOrigin && !incomingOrigin) || request.headers.get("sec-fetch-site") === "cross-site") throw new ApiError(400, "origin");
}

export async function limitedBody(request: Request, limit: number): Promise<Uint8Array> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > limit)) throw new ApiError(413, "too_large");
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timedOut = false;
  const deadline = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 8000);
  try {
    while (true) {
      const item = await reader.read();
      if (timedOut) throw new ApiError(504, "timeout", true);
      if (item.done) break;
      size += item.value.byteLength;
      if (size > limit) { await reader.cancel(); throw new ApiError(413, "too_large"); }
      chunks.push(item.value);
    }
  } finally { clearTimeout(deadline); reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

export async function readJson(request: Request, limit = 48000): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw new ApiError(415, "format");
  try { return JSON.parse(new TextDecoder().decode(await limitedBody(request, limit))); }
  catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(400, "invalid_input"); }
}

export function success(value: unknown): Response {
  return Response.json(value, { headers: { "Cache-Control": "no-store" } });
}

export async function endpoint(operation: (requestId: string) => Promise<Response>): Promise<Response> {
  const requestId = randomUUID();
  const start = Date.now();
  try {
    const response = await operation(requestId);
    response.headers.set("X-Request-Id", requestId);
    return response;
  } catch (error) {
    const failure = error instanceof ApiError ? error : new ApiError(503, "unavailable", true);
    console.info(JSON.stringify({ requestId, status: failure.status, code: failure.code, durationMs: Date.now() - start }));
    return Response.json({ error: { code: failure.code, messageKey: failure.code, retryable: failure.retryable, requestId } },
      { status: failure.status, headers: { "Cache-Control": "no-store", ...(failure.retryAfter ? { "Retry-After": String(failure.retryAfter) } : {}) } });
  }
}
