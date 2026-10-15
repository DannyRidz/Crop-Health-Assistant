import { randomUUID } from "node:crypto";
import type { CheckedResult, ModelOutput } from "../contracts";
import { PROMPT_VERSION, REGISTRY_VERSION, POLICY_VERSION, SCHEMA_VERSION, type ContentVersions } from "../contracts";
import { visualFindings } from "../visual-findings";
import { ApiError } from "./http";
import { digest } from "./session";

export function validateReferences(output: ModelOutput, photoIds: string[]) {
  const checks = output.photoChecks.map((photo) => photo.photoId);
  const ids = output.observations.map((observation) => observation.id);
  const eligible = new Set(output.photoChecks.filter((photo) => photo.quality === "usable" && photo.crop === "coffee" && photo.part === "leaf").map((photo) => photo.photoId));
  const eligibleObservations = new Set(output.observations.filter((item) => item.photoIds.every((id) => eligible.has(id))).map((item) => item.id));
  if (checks.length !== photoIds.length || new Set(checks).size !== checks.length || checks.some((id) => !photoIds.includes(id)) ||
      new Set(ids).size !== ids.length || output.observations.some((observation) => new Set(observation.photoIds).size !== observation.photoIds.length || observation.photoIds.some((id) => !photoIds.includes(id))) ||
      new Set(output.evidenceObservationIds).size !== output.evidenceObservationIds.length || output.evidenceObservationIds.some((id) => !ids.includes(id)) ||
      output.contradictions.some((item) => new Set(item.observationIds).size !== item.observationIds.length || item.observationIds.some((id) => !ids.includes(id))) ||
      output.possibleCauses.some((cause) => new Set(cause.observationIds).size !== cause.observationIds.length || cause.observationIds.some((id) => !eligibleObservations.has(id)) || new Set(cause.sourceIds).size !== cause.sourceIds.length)) throw new ApiError(502, "invalid_output", true);
  const texts = [...output.observations.map((item) => item.textEn), ...output.limitations, ...output.missingInfo, ...output.contradictions.map((item) => item.textEn),
    output.causeAssessmentEn, ...output.possibleCauses.flatMap((cause) => [cause.nameEn, cause.whyEn, cause.uncertaintyEn, cause.nextCheckEn])];
  // Defence in depth. Structural validation cannot establish agricultural correctness.
  const certaintyOrLink = /https?:|\b\d+(?:\.\d+)?\s*%|\b(?:confirmed diagnosis|definitely healthy)\b/i;
  const chemicalInstruction = /\b(?:spray|apply|use|mix|try|treat\s+with)\b.{0,60}\b(?:pesticide|fungicide|insecticide|herbicide|copper|sulfur|sulphur)\b|\b(?:pesticide|fungicide|insecticide|herbicide)\b.{0,40}\b(?:should|must)\s+be\s+(?:applied|sprayed)\b|\b\d+(?:\.\d+)?\s*(?:ml|mg|g|kg)\s*(?:\/|per)\s*(?:l|litre|liter|ha)\b/i;
  if (texts.some((text) => certaintyOrLink.test(text) || chemicalInstruction.test(text))) throw new ApiError(502, "invalid_output", true);
}
export function textValues(value: { observations: { id: string; textEn: string }[]; limitations: string[]; missingInfo: string[]; contradictions?: ModelOutput["contradictions"]; possibleCauses?: ModelOutput["possibleCauses"]; causeAssessmentEn?: string }): Record<string, string> {
  return Object.fromEntries([
    ...value.observations.map((item) => [`observation:${item.id}`, item.textEn]),
    ...value.limitations.map((text, index) => [`limitation:${index}`, text]),
    ...value.missingInfo.map((text, index) => [`missing:${index}`, text]),
    ...(value.contradictions ?? []).map((item, index) => [`conflict:${index}`, item.textEn]),
    ...(value.causeAssessmentEn ? [["causeAssessment", value.causeAssessmentEn]] : []),
    ...(value.possibleCauses ?? []).flatMap((cause, index) => (["nameEn", "whyEn", "uncertaintyEn", "nextCheckEn"] as const).map((key) => [`cause:${index}:${key}`, cause[key]])),
  ]);
}
export function canonicalTextHash(value: Parameters<typeof textValues>[0] & { inputRevision: number }): string {
  return digest(JSON.stringify({ revision: value.inputRevision, schema: SCHEMA_VERSION, prompt: PROMPT_VERSION, policy: POLICY_VERSION, registry: REGISTRY_VERSION, values: textValues(value) }));
}
export function assertCurrentVersions(value: Partial<ContentVersions>) {
  if (value.schemaVersion !== SCHEMA_VERSION || value.promptVersion !== PROMPT_VERSION || value.policyVersion !== POLICY_VERSION || value.registryVersion !== REGISTRY_VERSION)
    throw new ApiError(409, "assessment_version_changed");
}
export function checkedResult(output: ModelOutput, assessmentId: string, inputRevision: number, modelId: string): CheckedResult {
  const limitations = output.limitations;
  const result: CheckedResult = { id: randomUUID(), assessmentId, assessedAt: new Date().toISOString(), inputRevision,
    status: "unable_to_assess", conditionId: null, observations: output.observations, evidenceIds: output.evidenceObservationIds,
    limitations, missingInfo: output.missingInfo, coverageUnavailable: true,
    unsupported: output.photoChecks.some((item) => item.crop === "other" || item.part === "other"),
    registryVersion: REGISTRY_VERSION, promptVersion: PROMPT_VERSION, schemaVersion: SCHEMA_VERSION, policyVersion: POLICY_VERSION,
    modelId, textHash: "", photoChecks: output.photoChecks, contradictions: output.contradictions,
    ...visualFindings(output), coverageReason: "not_available", collectionPrompts: [], possibleCauses: output.possibleCauses, causeAssessmentEn: output.causeAssessmentEn };
  // AI hypotheses are separate from independently evaluated condition screening.
  result.textHash = canonicalTextHash(result);
  return result;
}
