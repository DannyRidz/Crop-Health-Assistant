import { describe, expect, it } from "vitest";
import { visualFindings } from "./visual-findings";
import { modelFixture } from "./test-fixtures";

describe("visual evidence policy, UR-1, UR-2 and UR-6", () => {
  it("keeps visible changes separate from disabled cause screening", () => {
    expect(visualFindings(modelFixture()).visualFinding).toBe("changes_visible");
  });
  it("requires usable supported evidence for a change and never uses an excluded observation", () => {
    for (const change of [{ quality: "blurry" }, { crop: "other" }, { part: "unclear" }] as const) {
      const output = modelFixture(); Object.assign(output.photoChecks[0], change);
      expect(visualFindings(output).visualFinding).toBe("insufficient_evidence");
      expect(visualFindings(output).keyObservationIds).toEqual([]);
    }
  });
  it("requires explicit unchanged observations for every photo before a reassuring summary", () => {
    const output = modelFixture(); output.observations[0].feature = "no_distinct_change";
    expect(visualFindings(output).visualFinding).toBe("no_clear_changes");
    output.photoChecks.push({ ...output.photoChecks[0], photoId: crypto.randomUUID() });
    expect(visualFindings(output).visualFinding).toBe("insufficient_evidence");
    output.observations[0].photoIds.push(output.photoChecks[1].photoId);
    expect(visualFindings(output).visualFinding).toBe("no_clear_changes");
    output.contradictions = [{ textEn: "Synthetic uncertainty", observationIds: ["visible_1"] }];
    expect(visualFindings(output).visualFinding).toBe("insufficient_evidence");
  });
  it("does not invent poor photo quality when observations are absent or unclear", () => {
    const output = modelFixture(); output.observations = [];
    expect(visualFindings(output).visualReason).toBe("unclear_observations");
    output.observations = [{ ...modelFixture().observations[0], feature: "unclear" }];
    expect(visualFindings(output).visualFinding).toBe("insufficient_evidence");
  });
  it("preserves usable findings alongside explicit excluded photos", () => {
    const output = modelFixture(), secondId = crypto.randomUUID();
    output.photoChecks.push({ photoId: secondId, crop: "other", part: "other", quality: "usable" });
    output.observations.unshift({ id: "excluded", photoIds: [secondId], textEn: "Synthetic other subject", feature: "spots_or_patches" });
    expect(visualFindings(output)).toMatchObject({ visualFinding: "changes_visible", keyObservationIds: ["visible_1"], excludedPhotoIds: [secondId] });
  });
  it("selects the first three eligible observations without inventing a severity order", () => {
    const output = modelFixture();
    output.observations = Array.from({ length: 6 }, (_, i) => ({ ...output.observations[0], id: `item_${i}` }));
    expect(visualFindings(output).keyObservationIds).toEqual(["item_0", "item_1", "item_2"]);
  });
});
