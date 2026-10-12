import { randomUUID } from "node:crypto";
import type { CheckedResult, ModelOutput } from "../contracts";
import { PROMPT_VERSION, REGISTRY_VERSION } from "../contracts";
import { ApiError } from "./http";
import { digest } from "./session";

export function validateReferences(output: ModelOutput, photoIds: string[]) {
  const checks = output.photoChecks.map((photo) => photo.photoId);
  const ids = output.observations.map((observation) => observation.id);
  if (checks.length !== photoIds.length || new Set(checks).size !== checks.length || checks.some((id) => !photoIds.includes(id)) ||
      new Set(ids).size !== ids.length || output.observations.some((observation) => new Set(observation.photoIds).size !== observation.photoIds.length || observation.photoIds.some((id) => !photoIds.includes(id))) ||
      new Set(output.evidenceObservationIds).size !== output.evidenceObservationIds.length || output.evidenceObservationIds.some((id) => !ids.includes(id))) throw new ApiError(502, "invalid_output", true);
  const texts = [...output.observations.map((item) => item.textEn), ...output.limitations, ...output.missingInfo, ...output.contradictions];
  // Defence in depth. Structural validation cannot establish agricultural correctness.
  if (texts.some((text) => /https?:|\b\d+(?:\.\d+)?\s*%|\b(?:spray|pesticide|fungicide|dosage|apply|treat with|confirmed diagnosis|definitely healthy)\b/i.test(text))) throw new ApiError(502, "invalid_output", true);
}
export function textValues(value: { observations: { id: string; textEn: string }[]; limitations: string[]; missingInfo: string[] }): Record<string, string> {
  return Object.fromEntries([
    ...value.observations.map((item) => [`observation:${item.id}`, item.textEn]),
    ...value.limitations.map((text, index) => [`limitation:${index}`, text]),
    ...value.missingInfo.map((text, index) => [`missing:${index}`, text]),
  ]);
}
export function canonicalTextHash(value: Parameters<typeof textValues>[0] & { inputRevision: number }): string {
  return digest(JSON.stringify({ revision: value.inputRevision, prompt: PROMPT_VERSION, values: textValues(value) }));
}
export function checkedResult(output: ModelOutput, assessmentId: string, inputRevision: number, modelId: string): CheckedResult {
  const limitations = [...output.limitations, ...output.contradictions];
  const result: CheckedResult = { id: randomUUID(), assessmentId, assessedAt: new Date().toISOString(), inputRevision,
    status: "unable_to_assess", conditionId: null, observations: output.observations, evidenceIds: output.evidenceObservationIds,
    limitations, missingInfo: output.missingInfo, coverageUnavailable: true,
    unsupported: output.photoChecks.some((item) => item.crop === "other" || item.part === "other"),
    registryVersion: REGISTRY_VERSION, promptVersion: PROMPT_VERSION, modelId, textHash: "" };
  // Registry coverage is disabled. Never promote a candidate into a disease or health claim.
  result.textHash = canonicalTextHash(result);
  return result;
}
