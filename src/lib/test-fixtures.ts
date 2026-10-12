// Synthetic policy fixtures, never agricultural evidence or shipped sample cases.
import { newAssessment, type Assessment } from "./assessment";
import { REGISTRY_VERSION, PROMPT_VERSION, type CheckedResult, type ModelOutput, type GuidanceEntry } from "./contracts";
import { selectGuidance } from "./guidance";
export const PHOTO_ID = "ba6a90d0-7d9c-47bf-a1c5-d84a28750bcb";
export function modelFixture(): ModelOutput {
  return { schemaVersion: 1, photoChecks: [{ photoId: PHOTO_ID, quality: "usable", crop: "coffee", part: "leaf" }],
    observations: [{ id: "visible_1", photoIds: [PHOTO_ID], textEn: "A pale patch is visible." }], candidateStatus: "no_clear_supported_signs", candidateConditionId: null,
    evidenceObservationIds: ["visible_1"], limitations: ["The cause cannot be determined from this image."], missingInfo: [], followUpQuestionIds: [], contradictions: [] };
}
export function assessmentFixture(): Assessment {
  const state = newAssessment();
  state.createdAt = "2026-10-12T04:00:00.000Z"; state.timezone = "Asia/Brunei";
  state.photos = [{ id: PHOTO_ID, side: "unknown", blob: new Blob(), url: "blob:synthetic", width: 100, height: 100 }];
  return state;
}
export function resultFixture(state: Assessment): CheckedResult {
  return { id: "238ba37b-83b3-4d71-85d4-7562ace070de", assessmentId: state.id, assessedAt: "2026-10-12T04:01:00.000Z", inputRevision: state.inputRevision,
    status: "unable_to_assess", conditionId: null, observations: modelFixture().observations, evidenceIds: ["visible_1"], limitations: modelFixture().limitations,
    missingInfo: [], coverageUnavailable: true, unsupported: false, registryVersion: REGISTRY_VERSION, promptVersion: PROMPT_VERSION, modelId: "gemini-3.8-flash", textHash: "a".repeat(64) };
}
export function withResult(state = assessmentFixture()): Assessment {
  const result = resultFixture(state);
  return { ...state, stage: "result", result: { data: result, envelope: "synthetic-result" }, guidance: { data: selectGuidance(result, state.region, state.contextRevision, []), envelope: "synthetic-guidance" } };
}
export function guidanceFixture(): GuidanceEntry {
  return { id: "test-pg", version: "test-1", crop: "coffee", plantPart: "leaf", conditionId: "test-condition",
    applicableCountryCodes: ["PG"], applicableRegionIds: [], regionalApplicabilityStatus: "approved", regionalLimitations: ["Synthetic policy fixture"],
    reviewGeography: "PNG", regionalReviewer: "test reviewer", regionalReviewDate: "2026-10-12", language: "en", text: "Synthetic guidance fixture",
    sourceTitle: "Synthetic test source", sourceUrl: "https://example.com/test-source", sectionOrPage: "test section", publicationDate: null,
    agriculturalReviewStatus: "approved", agriculturalReviewer: "test reviewer", agriculturalReviewDate: "2026-10-12", translationReviewStatus: "not_applicable", translationReviewer: null, translationReviewDate: null,
    permissionStatus: "verified", licence: "test fixture", attribution: "Synthetic test only", contentMode: "farmer_guidance" };
}
