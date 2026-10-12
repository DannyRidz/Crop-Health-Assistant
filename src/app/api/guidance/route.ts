import type { NextRequest } from "next/server";
import { z } from "zod";
import { regionSchema, REGISTRY_VERSION, type CheckedResult } from "@/lib/contracts";
import { guidanceEntries } from "@/content/registry";
import { selectGuidance } from "@/lib/guidance";
import { ApiError, assertOrigin, endpoint, readJson, success } from "@/lib/server/http";
import { acquire, assertScreening, getSession, sign, verify } from "@/lib/server/session";

const inputSchema = z.strictObject({ schemaVersion: z.literal(1), resultEnvelope: z.string().max(40000), contextRevision: z.number().int().positive(), region: regionSchema });
export async function POST(request: NextRequest) {
  return endpoint(async () => {
    assertOrigin(request); assertScreening();
    const sid = getSession(request);
    const allowance = acquire(request, sid, "guidance");
    try {
      const parsed = inputSchema.safeParse(await readJson(request));
      if (!parsed.success) throw new ApiError(422, "invalid_input");
      const input = parsed.data;
      const result = verify<CheckedResult>(input.resultEnvelope, "result", sid);
      if (result.registryVersion !== REGISTRY_VERSION) throw new ApiError(409, "expired", true);
      const data = selectGuidance(result, input.region, input.contextRevision, guidanceEntries);
      return success({ data, envelope: sign("guidance", sid, data) });
    } finally { allowance.release(); }
  });
}
