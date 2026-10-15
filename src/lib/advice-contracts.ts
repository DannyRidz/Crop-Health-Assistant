import { z } from "zod";
import type { RegionContext } from "./contracts";

export const CARE_VERSION = "coffee-care-pg-1";
export const PRODUCT_VERSION = "coffee-products-empty-1";
export const CARE_IDS = ["pg_check_drainage", "pg_check_weeds", "pg_review_garden_management"] as const;
export const TARGET_IDS = ["coffee_leaf_rust", "brown_eye_spot"] as const;
export const CONDITION_IDS = ["crop_stage", "application_method", "harvest_interval", "reentry_interval", "weather_window", "application_history", "protective_equipment", "environmental_restrictions"] as const;
export const careSelectionSchema = z.strictObject({ actionId: z.enum(CARE_IDS), observationIds: z.array(z.string().min(1).max(40)).min(1).max(6) });
export const targetEvidenceSchema = z.strictObject({ signId: z.literal("orange_yellow_powder_underside"), observationIds: z.array(z.string().min(1).max(40)).min(1).max(6) });
export const chemicalContextSchema = z.strictObject({
  resultId: z.uuid(), contextRevision: z.number().int().positive(), productId: z.string().min(1).max(80),
  labelHash: z.string().regex(/^[a-f0-9]{64}$/), catalogueVersion: z.string().min(1).max(80),
  answers: z.partialRecord(z.enum(CONDITION_IDS), z.enum(["yes", "no", "not_sure"])).refine((value) => Object.keys(value).length <= 8),
  identityConfirmed: z.boolean(), locale: z.enum(["en", "tpi"]), englishAccepted: z.boolean(),
});
export type CareSelection = z.infer<typeof careSelectionSchema>;
export type TargetEvidence = z.infer<typeof targetEvidenceSchema>;
export type ChemicalContext = z.infer<typeof chemicalContextSchema>;
export type AdviceIssue = "invalid_selection" | "insufficient_evidence";
export type CareAction = {
  id: typeof CARE_IDS[number]; version: string; textKey: typeof CARE_IDS[number]; countryCodes: string[];
  crop: "coffee"; plantPart: "leaf"; reviewStatus: "unreviewed"; translationStatus: "draft";
  sourceTitle: string; sourceUrl: string; section: string; publicationDate: string; publicationReleaseDate: string;
  sourceUseBasis: "original_text_with_citation"; copiedSourceAssets: false; permissionStatus: "verified";
};
export type LabelCondition = { id: typeof CONDITION_IDS[number]; questionEn: string; labelRequirement: string; sourceSection: string };
export type ChemicalProduct = {
  id: string; version: string; countryCode: string; crop: "coffee"; targetId: "coffee_leaf_rust";
  name: string; activeIngredient: string; concentration: string; formulation: string; registrationId: string;
  registrationStatus: "verified" | "pending" | "withdrawn"; registrationUrl: string; verifiedBy: string; verifiedAt: string;
  officialExpiresAt: string | null; withdrawnAt: string | null;
  labelUrl: string; labelRevision: string; labelSection: string; labelHash: string; sourceUse: "verified" | "pending";
  rateKind: "single" | "range" | "conditional"; rate: string; units: string; method: string; plantStage: string;
  timing: string; frequency: string; harvestInterval: string; reentryInterval: string; protectiveEquipment: string;
  environmentalRestrictions: string; otherPrecautions: string; applicability: string;
  requiredConditions: LabelCondition[];
  notApplicableConditions: Partial<Record<typeof CONDITION_IDS[number], string>>;
};
export type ChemicalReason = "no_target" | "insufficient_evidence" | "region_unknown" | "no_local_record" | "label_unverified" | "label_expired" | "identity_unconfirmed" | "conditions_unanswered" | "conditions_not_met" | "english_not_accepted";
export type ChemicalDecision = { reason: ChemicalReason | null; product: ChemicalProduct | null; unmetCondition: string | null };
export type AdviceSnapshot = {
  resultId: string; contextRevision: number; region: RegionContext; careVersion: string; productVersion: string;
  careIds: CareAction["id"][]; careAvailability: "available" | "region_unknown" | "no_regional_source" | "no_selection";
  issues: AdviceIssue[]; products: ChemicalProduct[]; chemical: ChemicalDecision; checkedAt: number; validUntil: number;
  contextKey: string | null; contextDigest: string | null; locale: "en" | "tpi";
};
export function chemicalContextKey(context: ChemicalContext): string {
  return JSON.stringify({ resultId: context.resultId, contextRevision: context.contextRevision, productId: context.productId, labelHash: context.labelHash, catalogueVersion: context.catalogueVersion, identityConfirmed: context.identityConfirmed, locale: context.locale, englishAccepted: context.englishAccepted, answers: Object.fromEntries(CONDITION_IDS.filter((id) => context.answers[id] !== undefined).map((id) => [id, context.answers[id]])) });
}
