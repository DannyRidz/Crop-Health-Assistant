import { CARE_VERSION, PRODUCT_VERSION } from "./advice-contracts";
import type { CheckedResult, GuidanceSnapshot, LocalPhoto, Preliminary, RegionContext, Signed, StarterAnswer } from "./contracts";
import { GUIDANCE_VERSION, REGISTRY_VERSION, UNKNOWN_REGION, currentContent, regionSchema } from "./contracts";

export type Stage = "photos" | "questions" | "result" | "report";
export type Assessment = {
  id: string; createdAt: string; timezone: string; isDemo: boolean; inputRevision: number; photoRevision: number; contextRevision: number;
  photos: LocalPhoto[]; answers: StarterAnswer[]; region: RegionContext; stage: Stage;
  preliminary: Signed<Preliminary> | null; result: Signed<CheckedResult> | null; guidance: Signed<GuidanceSnapshot> | null;
};
export function newAssessment(): Assessment {
  return { id: crypto.randomUUID(), createdAt: new Date().toISOString(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    isDemo: true, inputRevision: 1, photoRevision: 1, contextRevision: 1, photos: [], answers: [], region: { ...UNKNOWN_REGION }, stage: "photos", preliminary: null, result: null, guidance: null };
}
export type AssessmentAction =
  | { type: "photos"; photos: LocalPhoto[] }
  | { type: "answer"; answer: StarterAnswer }
  | { type: "region"; region: RegionContext }
  | { type: "stage"; stage: Stage }
  | { type: "preliminary"; assessmentId: string; revision: number; preliminary: Signed<Preliminary> }
  | { type: "result"; assessmentId: string; revision: number; result: Signed<CheckedResult>; guidance: Signed<GuidanceSnapshot> }
  | { type: "guidance"; guidance: Signed<GuidanceSnapshot> }
  | { type: "incompatible" };
export function assessmentReducer(state: Assessment, action: AssessmentAction): Assessment {
  switch (action.type) {
    case "incompatible": return { ...state, preliminary: null, result: null, guidance: null, stage: "photos" };
    case "photos": return { ...state, photos: action.photos, inputRevision: state.inputRevision + 1, photoRevision: state.photoRevision + 1, preliminary: null, result: null, guidance: null, stage: "photos" };
    case "answer": return { ...state, answers: [...state.answers.filter((answer) => answer.questionId !== action.answer.questionId), action.answer], inputRevision: state.inputRevision + 1, result: null, guidance: null, stage: "questions" };
    case "region": return { ...state, region: action.region, contextRevision: state.contextRevision + 1, guidance: null };
    case "stage":
      if (action.stage === "questions" && !state.preliminary) return state;
      if (action.stage === "result" && !state.result) return state;
      return { ...state, stage: action.stage };
    case "preliminary": return action.assessmentId === state.id && action.revision === state.inputRevision ? { ...state, preliminary: action.preliminary, result: null, guidance: null, stage: "questions" } : state;
    case "result": return action.assessmentId === state.id && action.revision === state.inputRevision ?
      { ...state, result: action.result, guidance: action.guidance.data.contextRevision === state.contextRevision && JSON.stringify(action.guidance.data.region) === JSON.stringify(state.region) ? action.guidance : null, stage: "result" } : state;
    case "guidance": return state.result?.data.id === action.guidance.data.resultId && action.guidance.data.contextRevision === state.contextRevision && JSON.stringify(action.guidance.data.region) === JSON.stringify(state.region) ? { ...state, guidance: action.guidance } : state;
  }
}
export function reportCurrent(state: Assessment): boolean {
  return regionSchema.safeParse(state.region).success && (!state.result || (currentContent(state.result.data) && state.result.data.inputRevision === state.inputRevision &&
    state.guidance?.data.resultId === state.result.data.id && state.guidance.data.contextRevision === state.contextRevision &&
    state.guidance.data.registryVersion === REGISTRY_VERSION && state.guidance.data.guidanceVersion === GUIDANCE_VERSION && state.guidance.data.aiAdvice.careVersion === CARE_VERSION && state.guidance.data.aiAdvice.productVersion === PRODUCT_VERSION && JSON.stringify(state.guidance.data.region) === JSON.stringify(state.region)));
}
