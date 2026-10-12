import { describe, expect, it } from "vitest";
import { approvedEntry, selectGuidance } from "./guidance";
import { UNKNOWN_REGION, type RegionContext } from "./contracts";
import { guidanceFixture, resultFixture, assessmentFixture } from "./test-fixtures";
import { conditions, guidanceEntries, reviewedFollowUpQuestions } from "@/content/registry";

describe("regional eligibility, AC-9 and AC-19", () => {
  const context = (countryCode: string): RegionContext => ({ response: "known", countryCode, regionId: null });
  it("keeps real content disabled while resources are pending", () => {
    expect(conditions.every((condition) => !condition.enabled)).toBe(true);
    expect(guidanceEntries).toEqual([]); expect(reviewedFollowUpQuestions).toEqual([]);
  });
  it("allows a synthetic approved PNG match but withholds it outside PNG or for unknown geography", () => {
    const result = { ...resultFixture(assessmentFixture()), status: "possible_supported_issue" as const, conditionId: "test-condition" };
    expect(selectGuidance(result, context("PG"), 1, [guidanceFixture()]).guidanceAvailability).toBe("available");
    expect(selectGuidance(result, context("BN"), 2, [guidanceFixture()]).entries).toEqual([]);
    expect(selectGuidance(result, context("BN"), 2, [guidanceFixture()]).guidanceAvailability).toBe("no_regional_match");
    expect(selectGuidance(result, UNKNOWN_REGION, 3, [guidanceFixture()]).guidanceAvailability).toBe("region_unknown");
  });
  it("requires an exact reviewed broad region when content has a narrower restriction", () => {
    const result = { ...resultFixture(assessmentFixture()), status: "possible_supported_issue" as const, conditionId: "test-condition" };
    const entry = { ...guidanceFixture(), applicableRegionIds: ["test-broad-region"] };
    expect(selectGuidance(result, context("PG"), 1, [entry]).entries).toEqual([]);
    expect(selectGuidance(result, { ...context("PG"), regionId: "test-broad-region" }, 2, [entry]).entries).toHaveLength(1);
  });
  it("rejects pending, demonstration, missing provenance and unreviewed translated content", () => {
    const base = guidanceFixture();
    for (const entry of [
      { ...base, agriculturalReviewStatus: "pending" as const }, { ...base, regionalApplicabilityStatus: "pending" as const },
      { ...base, permissionStatus: "restricted" as const }, { ...base, contentMode: "demonstration" as const },
      { ...base, sectionOrPage: "" }, { ...base, applicableCountryCodes: [] }, { ...base, regionalReviewer: null },
      { ...base, language: "tpi" as const, translationReviewStatus: "pending" as const },
    ]) expect(approvedEntry(entry)).toBe(false);
  });
  it("does not select guidance for an unsupported status or mismatched condition", () => {
    expect(selectGuidance(resultFixture(assessmentFixture()), context("PG"), 1, [guidanceFixture()]).entries).toEqual([]);
  });
});
