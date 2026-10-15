import type { NextRequest } from "next/server";
import { z } from "zod";
import { GLOSSARY_VERSION, SCHEMA_VERSION, type Preliminary, type CheckedResult } from "@/lib/contracts";
import { ApiError, assertOrigin, endpoint, readJson, success } from "@/lib/server/http";
import { acquire, assertScreening, getSession, verify } from "@/lib/server/session";
import { assertCurrentVersions, canonicalTextHash, textValues } from "@/lib/server/policy";
import { translate } from "@/lib/server/gemini";

const inputSchema = z.strictObject({ schemaVersion: z.literal(SCHEMA_VERSION), envelope: z.string().max(40000), kind: z.enum(["preliminary", "result"]), target: z.literal("tpi"), textHash: z.string().length(64) });
export const runtime = "nodejs";
export const maxDuration = 55;
export async function POST(request: NextRequest) {
  return endpoint(async (requestId) => {
    assertOrigin(request); assertScreening();
    const sid = getSession(request);
    const allowance = acquire(request, sid, "translate");
    try {
      const raw = await readJson(request);
      if (typeof raw === "object" && raw !== null && "schemaVersion" in raw && raw.schemaVersion !== SCHEMA_VERSION) throw new ApiError(409, "assessment_version_changed");
      const parsed = inputSchema.safeParse(raw);
      if (!parsed.success) throw new ApiError(422, "invalid_input");
      const input = parsed.data;
      const value = input.kind === "preliminary" ? verify<{ preliminary: Preliminary }>(input.envelope, "preliminary", sid).preliminary : verify<CheckedResult>(input.envelope, "result", sid);
      assertCurrentVersions(value);
      const values = textValues(value);
      if (canonicalTextHash(value) !== input.textHash || value.textHash !== input.textHash) throw new ApiError(409, "expired", true);
      return success({ hash: input.textHash, values: await translate(values, requestId), glossaryVersion: GLOSSARY_VERSION });
    } finally { allowance.release(); }
  });
}
