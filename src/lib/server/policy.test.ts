import { describe, expect, it } from "vitest";
import { canonicalTextHash, checkedResult, validateReferences } from "./policy";
import { modelSchema } from "../contracts";
import { modelFixture, PHOTO_ID } from "../test-fixtures";

describe("checked observations, AC-4 and AC-6", () => {
  it("cannot claim healthy plants or supported conditions while coverage is disabled", () => {
    const result = checkedResult(modelFixture(), crypto.randomUUID(), 1, "gemini-3.8-flash");
    expect(result.status).toBe("unable_to_assess"); expect(result.conditionId).toBeNull(); expect(result.coverageUnavailable).toBe(true);
    expect(result.observations).toEqual(modelFixture().observations);
  });
  it("rejects unknown references, duplicates, extra fields and invented conditions", () => {
    expect(() => validateReferences({ ...modelFixture(), evidenceObservationIds: ["made-up"] }, [PHOTO_ID])).toThrow();
    expect(() => validateReferences(modelFixture(), [crypto.randomUUID()])).toThrow();
    expect(() => validateReferences({ ...modelFixture(), observations: [...modelFixture().observations, ...modelFixture().observations] }, [PHOTO_ID])).toThrow();
    expect(modelSchema.safeParse({ ...modelFixture(), treatment: "made-up" }).success).toBe(false);
    expect(modelSchema.safeParse({ ...modelFixture(), candidateStatus: "possible_supported_issue", candidateConditionId: "coffee_leaf_rust" }).success).toBe(false);
    expect(modelSchema.safeParse({ ...modelFixture(), followUpQuestionIds: ["unreviewed"] }).success).toBe(false);
  });
  it("rejects treatment text or certainty percentages rather than displaying raw model prose", () => {
    for (const textEn of ["Apply fungicide.", "95% certain.", "See https://example.com"]) expect(() => validateReferences({ ...modelFixture(), observations: [{ id: "x", photoIds: [PHOTO_ID], textEn, feature: "unclear" }] }, [PHOTO_ID])).toThrow();
  });
  it("uses the revision as part of the translation cache key", () => {
    const base = { ...modelFixture(), inputRevision: 1 };
    expect(canonicalTextHash(base)).not.toBe(canonicalTextHash({ ...base, inputRevision: 2 }));
  });
});


describe("M2 unreviewed coverage boundaries, AC-5 and AC-6", () => {
  it("allows tentative AI causes with traceable evidence without claiming reviewed diagnosis", () => {
    const output = modelFixture();
    output.possibleCauses = [{ nameEn: "Synthetic possible cause", whyEn: "The visible patch may fit.", uncertaintyEn: "Other causes can look similar.", nextCheckEn: "Look at the other side.", observationIds: ["visible_1"], sourceIds: [] }];
    expect(() => validateReferences(output, [PHOTO_ID])).not.toThrow();
    const result = checkedResult(output, crypto.randomUUID(), 1, "gemini-3.8-flash");
    expect(result.possibleCauses).toEqual(output.possibleCauses); expect(result.conditionId).toBeNull(); expect(result.coverageUnavailable).toBe(true);
    const hash = result.textHash; result.possibleCauses[0].uncertaintyEn = "Changed uncertainty";
    expect(canonicalTextHash(result)).not.toBe(hash);
  });
  it("rejects invented references and cause evidence from an unusable photo", () => {
    const output = modelFixture();
    const cause = { nameEn: "Synthetic possible cause", whyEn: "Synthetic reason", uncertaintyEn: "Synthetic uncertainty", nextCheckEn: "Inspect the other side.", observationIds: ["visible_1"], sourceIds: [] };
    output.possibleCauses = [cause]; output.photoChecks[0].quality = "blurry";
    expect(() => validateReferences(output, [PHOTO_ID])).toThrow("invalid_output");
    output.photoChecks[0].quality = "usable"; cause.observationIds = ["invented"];
    expect(() => validateReferences(output, [PHOTO_ID])).toThrow("invalid_output");
    expect(modelSchema.safeParse({ ...modelFixture(), possibleCauses: [{ ...cause, sourceIds: ["invented-source"] }] }).success).toBe(false);
  });
  it("allows a possible chemical injury explanation without permitting a chemical prescription", () => {
    const output = modelFixture();
    output.possibleCauses = [{ nameEn: "Possible pesticide injury", whyEn: "Recent spraying could be relevant to the visible patch.", uncertaintyEn: "The farmer has not provided a spray history.", nextCheckEn: "Record any recent care changes.", observationIds: ["visible_1"], sourceIds: [] }];
    expect(() => validateReferences(output, [PHOTO_ID])).not.toThrow();
    for (const nextCheckEn of ["Apply fungicide.", "Use copper on affected leaves.", "Mix 2 g/L."]) {
      output.possibleCauses[0].nextCheckEn = nextCheckEn;
      expect(() => validateReferences(output, [PHOTO_ID])).toThrow("invalid_output");
    }
  });
  it("preserves contradictions without promoting any unreviewed candidate status", () => {
    for (const candidateStatus of ["more_information_needed", "unable_to_assess", "no_clear_supported_signs"] as const) {
      const result = checkedResult({ ...modelFixture(), candidateStatus, contradictions: [{ textEn: "Synthetic contradictory evidence", observationIds: ["visible_1"] }] }, crypto.randomUUID(), 1, "gemini-3.8-flash");
      expect(result.status).toBe("unable_to_assess");
      expect(result.conditionId).toBeNull();
      expect(result.contradictions[0].textEn).toBe("Synthetic contradictory evidence"); expect(result.limitations).not.toContain("Synthetic contradictory evidence");
    }
  });
  it("marks unsupported crops and plant parts without adding a condition", () => {
    for (const check of [{ crop: "other" as const, part: "leaf" as const }, { crop: "coffee" as const, part: "other" as const }]) {
      const output = modelFixture(); output.photoChecks[0] = { ...output.photoChecks[0], ...check };
      const result = checkedResult(output, crypto.randomUUID(), 1, "gemini-3.8-flash");
      expect(result.unsupported).toBe(true); expect(result.conditionId).toBeNull(); expect(result.status).toBe("unable_to_assess");
    }
  });
});
