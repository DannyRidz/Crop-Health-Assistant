import { z } from "zod";
import { COUNTRY_CODES } from "./countries";

export const REGISTRY_VERSION = "coffee-pending-1";
export const PROMPT_VERSION = "coffee-observations-1";
export const GLOSSARY_VERSION = "draft-1";
export const STARTER_IDS = ["onset", "spread", "symptoms", "care_change"] as const;
export const ANSWER_OPTIONS = {
  onset: ["today", "days_2_7", "over_week", "not_sure"],
  spread: ["one", "several", "not_sure"],
  symptoms: ["spots", "yellowing", "falling", "other", "not_sure"],
  care_change: ["yes", "no", "not_sure"],
} as const;

const plainText = (max: number) => z.string().min(1).max(max)
  .refine((value) => !/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value));
export const regionSchema = z.strictObject({
  response: z.enum(["known", "not_sure", "not_provided"]),
  countryCode: z.string().nullable(),
  regionId: z.string().nullable(),
}).superRefine((value, ctx) => {
  if (value.response === "known") {
    if (!value.countryCode || !COUNTRY_CODES.includes(value.countryCode)) ctx.addIssue({ code: "custom", message: "Unknown country" });
  } else if (value.countryCode !== null || value.regionId !== null) {
    ctx.addIssue({ code: "custom", message: "Unknown geography must be null" });
  }
  // No reviewed broad regions exist yet. New entries must add their parent country rules.
  if (value.regionId !== null) ctx.addIssue({ code: "custom", message: "No reviewed broad region" });
});
export const UNKNOWN_REGION: RegionContext = { response: "not_provided", countryCode: null, regionId: null };
export type RegionContext = z.infer<typeof regionSchema>;

export const answerSchema = z.strictObject({
  questionId: z.enum(STARTER_IDS),
  optionIds: z.array(z.string()).min(1).max(4),
  detail: z.string().max(300),
}).superRefine((answer, ctx) => {
  const allowed: readonly string[] = ANSWER_OPTIONS[answer.questionId];
  if (answer.optionIds.some((id) => !allowed.includes(id)) || new Set(answer.optionIds).size !== answer.optionIds.length)
    ctx.addIssue({ code: "custom", message: "Invalid option" });
  if ((answer.questionId !== "symptoms" && answer.optionIds.length !== 1) || (answer.optionIds.includes("not_sure") && answer.optionIds.length !== 1))
    ctx.addIssue({ code: "custom", message: "Exclusive answer" });
  if (answer.questionId !== "care_change" && answer.detail !== "") ctx.addIssue({ code: "custom", message: "Unexpected detail" });
});
export type StarterAnswer = z.infer<typeof answerSchema>;
export const photoMetaSchema = z.strictObject({ id: z.uuid(), side: z.enum(["upper", "underside", "unknown"]) });
export type PhotoMeta = z.infer<typeof photoMetaSchema>;
export const assessInputSchema = z.strictObject({
  schemaVersion: z.literal(1), assessmentId: z.uuid(), inputRevision: z.number().int().positive(),
  contextRevision: z.number().int().positive(), phase: z.enum(["preliminary", "final"]),
  photos: z.array(photoMetaSchema).min(1).max(2),
  starterAnswers: z.array(answerSchema).max(4),
  followUpAnswers: z.array(z.never()).max(0),
  preliminaryEnvelope: z.string().max(24000).nullable(),
  region: regionSchema, isDemo: z.boolean(),
}).superRefine((value, ctx) => {
  if (new Set(value.photos.map((photo) => photo.id)).size !== value.photos.length) ctx.addIssue({ code: "custom", message: "Duplicate photo" });
  if (value.phase === "preliminary" && (value.starterAnswers.length !== 0 || value.preliminaryEnvelope !== null)) ctx.addIssue({ code: "custom", message: "Invalid preliminary sequence" });
  if (value.phase === "final" && (new Set(value.starterAnswers.map((answer) => answer.questionId)).size !== 4 || !value.preliminaryEnvelope)) ctx.addIssue({ code: "custom", message: "Incomplete final sequence" });
  if (new TextEncoder().encode(JSON.stringify(value.starterAnswers)).length > 2048) ctx.addIssue({ code: "custom", message: "Answers too large" });
});
export type AssessInput = z.infer<typeof assessInputSchema>;

export const observationSchema = z.strictObject({ id: plainText(40), photoIds: z.array(z.uuid()).min(1).max(2), textEn: plainText(240) });
export const modelSchema = z.strictObject({
  schemaVersion: z.literal(1),
  photoChecks: z.array(z.strictObject({ photoId: z.uuid(), quality: z.enum(["usable", "blurry", "dark", "incomplete"]), crop: z.enum(["coffee", "other", "unclear"]), part: z.enum(["leaf", "other", "unclear"]) })).min(1).max(2),
  observations: z.array(observationSchema).max(6),
  candidateStatus: z.enum(["more_information_needed", "unable_to_assess", "no_clear_supported_signs"]),
  candidateConditionId: z.null(), evidenceObservationIds: z.array(plainText(40)).max(6),
  limitations: z.array(plainText(240)).max(4), missingInfo: z.array(plainText(240)).max(3),
  followUpQuestionIds: z.array(z.string()).max(0), contradictions: z.array(plainText(240)).max(3),
});
export type ModelOutput = z.infer<typeof modelSchema>;
export type Observation = z.infer<typeof observationSchema>;
export type ScreeningStatus = "possible_supported_issue" | "more_information_needed" | "unable_to_assess" | "no_clear_supported_signs";
export type Preliminary = { assessmentId: string; inputRevision: number; photoChecks: ModelOutput["photoChecks"]; observations: Observation[]; limitations: string[]; missingInfo: string[]; followUpQuestionIds: string[]; textHash: string };
export type CheckedResult = {
  id: string; assessmentId: string; assessedAt: string; inputRevision: number; status: ScreeningStatus;
  conditionId: string | null; observations: Observation[]; evidenceIds: string[]; limitations: string[];
  missingInfo: string[]; coverageUnavailable: boolean; unsupported: boolean; registryVersion: string;
  promptVersion: string; modelId: string; textHash: string;
};
export type GuidanceEntry = {
  id: string; version: string; crop: "coffee"; plantPart: "leaf"; conditionId: string;
  applicableCountryCodes: string[]; applicableRegionIds: string[];
  regionalApplicabilityStatus: "pending" | "approved" | "rejected"; regionalLimitations: string[];
  reviewGeography: string; regionalReviewer: string | null; regionalReviewDate: string | null;
  language: "en" | "tpi"; text: string; sourceTitle: string; sourceUrl: string; sectionOrPage: string;
  publicationDate: string | null; agriculturalReviewStatus: "pending" | "approved" | "rejected";
  agriculturalReviewer: string | null; agriculturalReviewDate: string | null;
  translationReviewStatus: "not_applicable" | "pending" | "approved" | "rejected";
  translationReviewer: string | null; translationReviewDate: string | null;
  permissionStatus: "verified" | "pending" | "restricted"; licence: string; attribution: string;
  contentMode: "demonstration" | "farmer_guidance";
};
export type GuidanceSnapshot = {
  resultId: string; contextRevision: number; region: RegionContext; guidanceIds: string[];
  guidanceAvailability: "available" | "region_unknown" | "no_regional_match" | "no_approved_content";
  guidanceLimitations: string[]; entries: GuidanceEntry[]; registryVersion: string;
};
export type Signed<T> = { data: T; envelope: string };
export type AssessResponse = { phase: "preliminary"; preliminary: Signed<Preliminary>; remaining: number } |
  { phase: "final"; result: Signed<CheckedResult>; guidance: Signed<GuidanceSnapshot>; remaining: number };
export type TextVariant = { hash: string; values: Record<string, string>; glossaryVersion: string };
export type LocalPhoto = PhotoMeta & { blob: Blob; url: string; width: number; height: number };
