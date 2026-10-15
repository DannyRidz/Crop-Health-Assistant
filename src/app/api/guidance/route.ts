import { chemicalContextSchema } from "@/lib/advice-contracts";
import { buildAdvice } from "@/lib/ai-advice";
import { chemicalProducts } from "@/content/chemical-products";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { regionSchema, SCHEMA_VERSION, type CheckedResult } from "@/lib/contracts";
import { assertCurrentVersions } from "@/lib/server/policy";
import { guidanceEntries } from "@/content/registry";
import { selectGuidance } from "@/lib/guidance";
import { ApiError, assertOrigin, endpoint, readJson, success } from "@/lib/server/http";
import { digest, sessionExpiresAt, acquire, assertScreening, getSession, sign, verify } from "@/lib/server/session";

const inputSchema = z.strictObject({ schemaVersion: z.literal(SCHEMA_VERSION), resultEnvelope: z.string().max(40000), contextRevision: z.number().int().positive(), region: regionSchema, locale: z.enum(["en", "tpi"]).optional(), chemicalContext: chemicalContextSchema.nullable().optional() });
export async function POST(request: NextRequest) {
  return endpoint(async () => {
    assertOrigin(request); assertScreening();
    const sid = getSession(request);
    const allowance = acquire(request, sid, "guidance");
    try {
      const raw = await readJson(request);
      if (typeof raw === "object" && raw !== null && "schemaVersion" in raw && raw.schemaVersion !== SCHEMA_VERSION) throw new ApiError(409, "assessment_version_changed");
      const parsed = inputSchema.safeParse(raw);
      if (!parsed.success) throw new ApiError(422, "invalid_input");
      const input = parsed.data;
      const result = verify<CheckedResult>(input.resultEnvelope, "result", sid);
      assertCurrentVersions(result);
      const context = input.chemicalContext ?? null;
      const locale = input.locale ?? "en";
      if (context && (context.resultId !== result.id || context.contextRevision !== input.contextRevision || context.locale !== locale ||
        !chemicalProducts.some((product) => product.id === context.productId && product.labelHash === context.labelHash && Object.keys(context.answers).every((id) => product.requiredConditions.some((condition) => condition.id === id))))) throw new ApiError(422, "invalid_input");
      const data = selectGuidance(result, input.region, input.contextRevision, guidanceEntries);
      data.aiAdvice = buildAdvice(result, input.region, input.contextRevision, { context, locale, sessionExpiresAt: sessionExpiresAt(sid) });
      if (data.aiAdvice.contextKey) data.aiAdvice.contextDigest = digest(data.aiAdvice.contextKey);
      return success({ data, envelope: sign("guidance", sid, data) });
    } finally { allowance.release(); }
  });
}
