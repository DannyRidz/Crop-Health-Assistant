import { afterEach, describe, expect, it, vi } from "vitest";
import { chemicalProducts } from "@/content/chemical-products";
import { buildAdvice, chemicalEligibility, chemicalReportProduct, hasRustEvidence, labelDeadline, sanitizeAdvice, verifiedProduct } from "./ai-advice";
import { CONDITION_IDS, PRODUCT_VERSION, chemicalContextKey, type ChemicalContext, type ChemicalProduct } from "./advice-contracts";
import { assessmentFixture, modelFixture, PHOTO_ID, resultFixture, withResult } from "./test-fixtures";
import { parseModelOutput } from "./server/model-output";
import { makeReport } from "./report";
import { selectGuidance } from "./guidance";
import english from "@/content/locales/en.json";

const now = Date.parse("2026-10-15T08:00:00Z");
const pg = { response: "known" as const, countryCode: "PG", regionId: null };
// Controlled product and label facts are software fixtures only. They are never farmer advice.
function productFixture(): ChemicalProduct {
  return { id: "synthetic-only", version: "test-1", countryCode: "PG", crop: "coffee", targetId: "coffee_leaf_rust", name: "Synthetic test product", activeIngredient: "Synthetic ingredient", concentration: "Synthetic concentration", formulation: "Synthetic formulation", registrationId: "TEST ONLY", registrationStatus: "verified", registrationUrl: "https://example.com/test-registration", verifiedBy: "Test fixture", verifiedAt: new Date(now - 1000).toISOString(), officialExpiresAt: null, withdrawnAt: null, labelUrl: "https://example.com/test-label", labelRevision: "Synthetic revision", labelSection: "Synthetic section", labelHash: "b".repeat(64), sourceUse: "verified", rateKind: "single", rate: "SYNTHETIC RATE", units: "TEST UNITS", method: "Synthetic method", plantStage: "Synthetic stage", timing: "Synthetic timing", frequency: "Synthetic frequency", harvestInterval: "Synthetic harvest interval", reentryInterval: "Synthetic reentry interval", protectiveEquipment: "Synthetic PPE", environmentalRestrictions: "Synthetic environment", otherPrecautions: "Synthetic precautions", applicability: "Synthetic applicability", requiredConditions: [{ id: "crop_stage", questionEn: "Synthetic condition?", labelRequirement: "Synthetic requirement", sourceSection: "Test section" }], notApplicableConditions: Object.fromEntries(CONDITION_IDS.filter((id) => id !== "crop_stage").map((id) => [id, "Synthetic explicit N/A source section"])) };
}
function rustFixture() {
  const result = resultFixture(assessmentFixture());
  result.observations[0].feature = "surface_material";
  result.photoSides = [{ id: PHOTO_ID, side: "underside" }];
  result.careSelections = [{ actionId: "pg_check_drainage", observationIds: ["visible_1"] }];
  result.possibleCauses = [{ nameEn: "Synthetic possible rust", whyEn: "Synthetic signs", uncertaintyEn: "Synthetic uncertainty", nextCheckEn: "Synthetic check", observationIds: ["visible_1"], sourceIds: ["aps_coffee_rust"], targetId: "coffee_leaf_rust", targetEvidence: [{ signId: "orange_yellow_powder_underside", observationIds: ["visible_1"] }] }];
  return result;
}
function contextFixture(): ChemicalContext { return { resultId: rustFixture().id, contextRevision: 1, productId: "synthetic-only", labelHash: "b".repeat(64), catalogueVersion: PRODUCT_VERSION, answers: { crop_stage: "yes" }, identityConfirmed: true, locale: "en", englishAccepted: false }; }
function decide(product = productFixture(), context: ChemicalContext | null = contextFixture(), result = rustFixture()) {
  return chemicalEligibility({ result, region: pg, contextRevision: 1, context, locale: "en", now, products: [product] });
}
afterEach(() => { chemicalProducts.splice(0); vi.useRealTimers(); });
describe("sourced care and isolated optional model advice", () => {
  it("shows selected PNG care only where the source applies", () => {
    const result = rustFixture();
    expect(buildAdvice(result, pg, 1).careIds).toEqual(["pg_check_drainage"]);
    expect(buildAdvice(result, { ...pg, countryCode: "BN" }, 2).careIds).toEqual([]);
    expect(buildAdvice(result, { response: "not_sure", countryCode: null, regionId: null }, 3).careAvailability).toBe("region_unknown");
    result.visualFinding = "no_clear_changes";
    expect(buildAdvice(result, pg, 1).careIds).toEqual([]);
  });
  it("drops invalid optional fields while retaining valid core findings", () => {
    const raw = { ...modelFixture(), careSelections: [{ actionId: "invented_action", observationIds: ["visible_1"] }], possibleCauses: [{ ...rustFixture().possibleCauses[0], targetId: "invented_target", targetEvidence: "bad" }] };
    const parsed = parseModelOutput(raw);
    expect(parsed.observations).toEqual(raw.observations); expect(parsed.careSelections).toEqual([]); expect(parsed.adviceIssues).toContain("invalid_selection"); expect(parsed.possibleCauses[0].targetId).toBeNull();
    expect(() => parseModelOutput({ ...raw, photoChecks: "broken" })).toThrow();
  });
  it("rejects unknown observation references and duplicate care choices without losing findings", () => {
    const result = sanitizeAdvice({ ...modelFixture(), careSelections: [{ actionId: "pg_check_weeds", observationIds: ["missing"] }, { actionId: "pg_check_drainage", observationIds: ["visible_1"] }, { actionId: "pg_check_drainage", observationIds: ["visible_1"] }] });
    expect(result.careSelections).toHaveLength(1); expect(result.observations).toHaveLength(1); expect(result.adviceIssues).toContain("invalid_selection");
  });
  it("includes care, scope and source in both report languages without claiming review", () => {
    const state = withResult({ ...assessmentFixture(), region: pg }); state.result!.data = rustFixture();
    state.guidance!.data = selectGuidance(state.result!.data, pg, 1, []);
    for (const locale of ["en", "tpi"] as const) {
      const report = makeReport(state, locale, undefined, true);
      expect(report.sections.some((section) => section.lines.includes("https://www.aciar.gov.au/sites/default/files/2024-08/05_FTG_Unit2-M5-pests-diseases.pdf"))).toBe(true);
      expect(report.sections.some((section) => section.chemical)).toBe(false);
    }
    expect(JSON.stringify(makeReport(state, "en", undefined, false))).toContain(english.assessment.careActions.pg_check_drainage);
    expect(state.guidance!.data.entries).toEqual([]);
  });
});
describe("chemical label eligibility, controlled fixtures only", () => {
  it("allows the fully matching label and explicit conditions, without enabling live products", () => { expect(decide().reason).toBeNull(); expect(chemicalProducts).toEqual([]); expect(buildAdvice(rustFixture(), pg, 1).chemical.reason).toBe("no_local_record"); });
  it.each(["unknown", "upper"] as const)("requires underside evidence rather than %s metadata", (side) => { const result = rustFixture(); result.photoSides[0].side = side; expect(hasRustEvidence(result)).toBe(false); expect(decide(undefined, undefined, result).reason).toBe("insufficient_evidence"); });
  it("requires surface material evidence and no conflicting findings", () => {
    const result = rustFixture(); result.observations[0].feature = "spots_or_patches"; expect(hasRustEvidence(result)).toBe(false);
    result.observations[0].feature = "surface_material"; result.contradictions = [{ textEn: "Synthetic conflict", observationIds: ["visible_1"] }]; expect(hasRustEvidence(result)).toBe(false);
  });
  it.each(["rateKind", "registrationStatus", "sourceUse", "concentration", "formulation", "labelHash", "verifiedAt", "requiredConditions", "notApplicableConditions"])("withholds an invalid %s record", (field) => {
    const product = productFixture();
    const invalid: Record<string, unknown> = { rateKind: "range", registrationStatus: "withdrawn", sourceUse: "pending", concentration: "", formulation: "", labelHash: "invalid", verifiedAt: new Date(now + 1000).toISOString(), requiredConditions: Array(9).fill(product.requiredConditions[0]), notApplicableConditions: {} };
    Object.assign(product, { [field]: invalid[field] }); expect(verifiedProduct(product, now)).toBe(false); expect(decide(product).product).toBeNull();
  });
  it.each(["resultId", "contextRevision", "productId", "labelHash", "catalogueVersion", "identityConfirmed", "locale"])("binds confirmation to %s", (field) => {
    const context = contextFixture(); const invalid: Record<string, unknown> = { resultId: crypto.randomUUID(), contextRevision: 2, productId: "another", labelHash: "a".repeat(64), catalogueVersion: "old", identityConfirmed: false, locale: "tpi" };
    Object.assign(context, { [field]: invalid[field] }); expect(decide(undefined, context).product).toBeNull();
  });
  it.each(["no", "not_sure", undefined] as const)("withholds rates for condition answer %s", (answer) => { const context = contextFixture(); context.answers.crop_stage = answer; expect(decide(undefined, context).product).toBeNull(); });
  it("requires English label consent in Tok Pisin and never infers a country", () => {
    const context = { ...contextFixture(), locale: "tpi" as const };
    expect(chemicalEligibility({ result: rustFixture(), region: pg, contextRevision: 1, context, locale: "tpi", now, products: [productFixture()] }).reason).toBe("english_not_accepted");
    expect(chemicalEligibility({ result: rustFixture(), region: { response: "not_sure", countryCode: null, regionId: null }, contextRevision: 1, context, locale: "tpi", now, products: [productFixture()] }).reason).toBe("region_unknown");
    expect(chemicalEligibility({ result: rustFixture(), region: { ...pg, countryCode: "BN" }, contextRevision: 1, context, locale: "en", now, products: [productFixture()] }).reason).toBe("no_local_record");
  });
  it("expires verification after seven days or earlier withdrawal, label or session deadline", () => {
    const product = productFixture(); product.withdrawnAt = new Date(now + 100).toISOString(); expect(labelDeadline(product)).toBe(now + 100);
    expect(buildAdvice(rustFixture(), pg, 1, { now, context: contextFixture(), products: [product], sessionExpiresAt: now + 50 }).validUntil).toBe(now + 50);
    product.withdrawnAt = new Date(now - 100).toISOString(); expect(decide(product).product).toBeNull();
    product.withdrawnAt = null; product.verifiedAt = new Date(now - 7 * 86400000).toISOString(); expect(decide(product).reason).toBe("label_expired");
  });
  it("exports the complete English label group only with fresh matching proof, including in Tok Pisin", () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    chemicalProducts.push(productFixture());
    for (const locale of ["en", "tpi"] as const) {
      const state = withResult({ ...assessmentFixture(), region: pg }); state.result!.data = rustFixture();
      const context = { ...contextFixture(), locale, englishAccepted: locale === "tpi" };
      state.guidance!.data = selectGuidance(state.result!.data, pg, 1, []);
      state.guidance!.data.aiAdvice = buildAdvice(state.result!.data, pg, 1, { now, context, locale });
      state.guidance!.data.aiAdvice.contextDigest = "controlled-digest";
      const report = makeReport(state, locale, undefined, true, context, "controlled-digest");
      const group = report.sections.find((section) => section.chemical)!;
      expect(group.language).toBe("en");
      for (const field of ["rate", "units", "method", "timing", "frequency", "harvestInterval", "reentryInterval", "protectiveEquipment", "environmentalRestrictions", "otherPrecautions", "labelRevision", "labelUrl"] as const) expect(group.lines.join(" ")).toContain(chemicalProducts[0][field]);
      expect(makeReport(state, locale, undefined, true, context, "wrong-digest").sections.some((section) => section.chemical)).toBe(false);
      vi.setSystemTime(now + 600001);
      expect(makeReport(state, locale, undefined, true, context, "controlled-digest").sections.some((section) => section.chemical)).toBe(false);
      vi.setSystemTime(now);
    }
  });
  it("rechecks rates in the report helper and invalidates edits, expiry and withdrawals", () => {
    chemicalProducts.push(productFixture()); const result = rustFixture(), context = contextFixture();
    const snapshot = buildAdvice(result, pg, 1, { now, context }); snapshot.contextDigest = "controlled-digest";
    expect(chemicalReportProduct(result, snapshot, context, pg, 1, "en", now, "controlled-digest")?.id).toBe("synthetic-only");
    expect(chemicalReportProduct(result, snapshot, { ...context, answers: { crop_stage: "no" } }, pg, 1, "en", now, "controlled-digest")).toBeNull();
    expect(chemicalReportProduct(result, snapshot, context, pg, 1, "en", snapshot.validUntil, "controlled-digest")).toBeNull();
    chemicalProducts[0].registrationStatus = "withdrawn"; expect(chemicalReportProduct(result, snapshot, context, pg, 1, "en", now, "controlled-digest")).toBeNull();
    expect(chemicalReportProduct(result, snapshot, context, pg, 1, "en", now, "wrong-digest")).toBeNull();
    expect(snapshot.contextKey).toBe(chemicalContextKey(context));
  });
});
