import type { NextRequest } from "next/server";
import { assessInputSchema, SCHEMA_VERSION, POLICY_VERSION, PROMPT_VERSION, REGISTRY_VERSION, QUESTION_BANK_VERSION, type Preliminary, type CheckedResult } from "@/lib/contracts";
import { guidanceEntries } from "@/content/registry";
import { selectGuidance } from "@/lib/guidance";
import { collectionPrompts } from "@/lib/collection-prompts";
import { ApiError, assertOrigin, endpoint, limitedBody, success } from "@/lib/server/http";
import { acquire, assertScreening, digest, getSession, sign, verify } from "@/lib/server/session";
import { processPhoto } from "@/lib/server/images";
import { screen } from "@/lib/server/gemini";
import { assertCurrentVersions, canonicalTextHash, checkedResult, validateReferences } from "@/lib/server/policy";

export const runtime = "nodejs";
export const maxDuration = 55;
type PreliminaryToken = { preliminary: Preliminary; photoDigest: string; isDemo: boolean };

export async function POST(request: NextRequest) {
  return endpoint(async (requestId) => {
    assertOrigin(request); assertScreening();
    const sid = getSession(request);
    const allowance = acquire(request, sid, "assess");
    try {
      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.startsWith("multipart/form-data;")) throw new ApiError(415, "format");
      const body = await limitedBody(request, 6 * 1024 * 1024);
      let form: FormData;
      try { form = await new Response(body as BodyInit, { headers: { "Content-Type": contentType } }).formData(); }
      catch { throw new ApiError(400, "invalid_input"); }
      if (form.getAll("metadata").length !== 1 || [...form.keys()].some((key) => key !== "metadata" && key !== "photos")) throw new ApiError(422, "invalid_input");
      const metadata = form.get("metadata");
      if (typeof metadata !== "string" || metadata.length > 30000) throw new ApiError(422, "invalid_input");
      let input;
      try {
        const raw = JSON.parse(metadata);
        if (raw?.schemaVersion === 1) throw new ApiError(409, "assessment_version_changed");
        input = assessInputSchema.parse(raw);
      } catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(422, "invalid_input"); }
      if (process.env.GEMINI_SERVICE_TIER !== "paid" && !input.isDemo) throw new ApiError(422, "demo_only");
      const files = form.getAll("photos");
      if (files.length !== input.photos.length || files.some((file) => !(file instanceof File))) throw new ApiError(422, "invalid_input");
      const photos = [];
      for (const [index, file] of files.entries()) photos.push(await processPhoto(input.photos[index].id, file as File));
      const photoDigest = digest(JSON.stringify(photos.map((photo, index) => ({ id: photo.id, side: input.photos[index].side, hash: digest(photo.bytes) }))));
      if (input.phase === "final") {
        const previous = verify<PreliminaryToken>(input.preliminaryEnvelope!, "preliminary", sid);
        assertCurrentVersions(previous.preliminary);
        if (previous.photoDigest !== photoDigest || previous.preliminary.assessmentId !== input.assessmentId ||
            previous.preliminary.photoRevision !== input.photoRevision || previous.preliminary.questionBankVersion !== QUESTION_BANK_VERSION ||
            previous.preliminary.inputRevision > input.inputRevision || previous.isDemo !== input.isDemo) throw new ApiError(409, "expired", true);
      }
      const output = await screen(input, photos, requestId);
      validateReferences(output, photos.map((photo) => photo.id));
      if (input.phase === "preliminary") {
        if (output.possibleCauses.length) throw new ApiError(502, "invalid_output", true);
        const preliminary: Preliminary = { assessmentId: input.assessmentId, inputRevision: input.inputRevision, photoRevision: input.photoRevision,
          schemaVersion: SCHEMA_VERSION, promptVersion: PROMPT_VERSION, policyVersion: POLICY_VERSION, registryVersion: REGISTRY_VERSION, questionBankVersion: QUESTION_BANK_VERSION,
          photoChecks: output.photoChecks, observations: output.observations, limitations: output.limitations, contradictions: output.contradictions,
          missingInfo: output.missingInfo, followUpQuestionIds: [], textHash: "" };
        preliminary.textHash = canonicalTextHash(preliminary);
        return success({ phase: "preliminary", preliminary: { data: preliminary, envelope: sign("preliminary", sid, { preliminary, photoDigest, isDemo: input.isDemo }) }, remaining: allowance.remaining });
      }
      const result: CheckedResult = checkedResult(output, input.assessmentId, input.inputRevision, process.env.GEMINI_MODEL || "gemini-3.8-flash");
      result.collectionPrompts = collectionPrompts(output.photoChecks, input.photos, input.starterAnswers);
      const guidance = selectGuidance(result, input.region, input.contextRevision, guidanceEntries);
      return success({ phase: "final", result: { data: result, envelope: sign("result", sid, result) }, guidance: { data: guidance, envelope: sign("guidance", sid, guidance) }, remaining: allowance.remaining });
    } finally { allowance.release(); }
  });
}
