import { buildAdvice } from "./ai-advice";
import type { CheckedResult, GuidanceEntry, GuidanceSnapshot, RegionContext } from "./contracts";
import { GUIDANCE_VERSION, REGISTRY_VERSION } from "./contracts";

export function approvedEntry(entry: GuidanceEntry): boolean {
  return entry.contentMode === "farmer_guidance" && entry.permissionStatus === "verified" &&
    entry.agriculturalReviewStatus === "approved" && entry.regionalApplicabilityStatus === "approved" &&
    !!entry.agriculturalReviewer && !!entry.agriculturalReviewDate && !!entry.regionalReviewer && !!entry.regionalReviewDate &&
    !!entry.reviewGeography && !!entry.sectionOrPage && !!entry.sourceTitle && /^https:\/\//.test(entry.sourceUrl) &&
    !!entry.licence && entry.applicableCountryCodes.length > 0 &&
    (entry.language === "en" ? entry.translationReviewStatus === "not_applicable" :
      entry.translationReviewStatus === "approved" && !!entry.translationReviewer && !!entry.translationReviewDate);
}

export function selectGuidance(result: CheckedResult, region: RegionContext, contextRevision: number, entries: GuidanceEntry[]): GuidanceSnapshot {
  const approved = entries.filter((entry) => approvedEntry(entry) && entry.crop === "coffee" && entry.plantPart === "leaf" &&
    result.status === "possible_supported_issue" && result.conditionId === entry.conditionId);
  const selected = region.response === "known" ? approved.filter((entry) =>
    entry.applicableCountryCodes.includes(region.countryCode!) &&
    (entry.applicableRegionIds.length === 0 || (!!region.regionId && entry.applicableRegionIds.includes(region.regionId)))) : [];
  const availability = region.response !== "known" ? "region_unknown" :
    selected.length ? "available" : approved.length ? "no_regional_match" : "no_approved_content";
  return { aiAdvice: buildAdvice(result, region, contextRevision), resultId: result.id, contextRevision, region, guidanceIds: selected.map((entry) => entry.id),
    guidanceAvailability: availability, guidanceLimitations: selected.flatMap((entry) => entry.regionalLimitations), entries: selected, registryVersion: REGISTRY_VERSION, guidanceVersion: GUIDANCE_VERSION };
}
