export class RequestFailure extends Error {
  constructor(public code: string, public retryable: boolean, public retryAfter = 0, public requestId?: string) { super(code); }
}
export async function api<T>(url: string, body?: BodyInit, json = false): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { method: "POST", body, credentials: "same-origin", cache: "no-store",
      ...(json ? { headers: { "Content-Type": "application/json" } } : {}), signal: AbortSignal.timeout(55000) });
  } catch (error) {
    throw new RequestFailure(error instanceof Error && /timeout|abort/i.test(error.name) ? "timeout" : "network", true);
  }
  let value;
  try { value = await response.json(); } catch { throw new RequestFailure("unavailable", true); }
  if (!response.ok) throw new RequestFailure(value.error?.code ?? "unavailable", !!value.error?.retryable, Number(response.headers.get("Retry-After")) || 0, value.error?.requestId);
  return value as T;
}
