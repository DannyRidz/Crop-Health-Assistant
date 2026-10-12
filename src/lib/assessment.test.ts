import { describe, expect, it } from "vitest";
import { assessmentReducer, reportCurrent } from "./assessment";
import { selectGuidance } from "./guidance";
import { withResult, assessmentFixture, modelFixture } from "./test-fixtures";

describe("temporary assessment revisions, AC-5, AC-10, AC-13 and AC-19", () => {
  it("preserves evidence and answers while region changes invalidate the report", () => {
    const state = withResult();
    const updated = assessmentReducer(state, { type: "region", region: { response: "known", countryCode: "BN", regionId: null } });
    expect(updated.result).toBe(state.result); expect(updated.photos).toBe(state.photos); expect(updated.answers).toBe(state.answers);
    expect(updated.inputRevision).toBe(state.inputRevision); expect(updated.contextRevision).toBe(state.contextRevision + 1);
    expect(reportCurrent(updated)).toBe(false);
    const selected = { data: selectGuidance(state.result!.data, updated.region, updated.contextRevision, []), envelope: "test" };
    expect(reportCurrent(assessmentReducer(updated, { type: "guidance", guidance: selected }))).toBe(true);
    expect(assessmentReducer(updated, { type: "guidance", guidance: state.guidance! }).guidance).toBeNull();
  });
  it("clears result eligibility after an answer or photo edit", () => {
    const state = withResult();
    const answer = assessmentReducer(state, { type: "answer", answer: { questionId: "onset", optionIds: ["not_sure"], detail: "" } });
    expect(answer.result).toBeNull(); expect(answer.guidance).toBeNull(); expect(answer.inputRevision).toBeGreaterThan(state.inputRevision);
    const photo = assessmentReducer(state, { type: "photos", photos: state.photos });
    expect(photo.preliminary).toBeNull(); expect(photo.result).toBeNull(); expect(photo.stage).toBe("photos");
  });
  it("ignores old screening responses and results from another assessment", () => {
    const state = withResult(), updated = assessmentReducer(state, { type: "photos", photos: [] });
    expect(assessmentReducer(updated, { type: "result", assessmentId: state.id, revision: state.inputRevision, result: state.result!, guidance: state.guidance! })).toBe(updated);
    expect(assessmentReducer(state, { type: "result", assessmentId: crypto.randomUUID(), revision: state.inputRevision, result: state.result!, guidance: state.guidance! })).toBe(state);
  });
  it("allows returning to photos without losing inputs and rejects unperformed preliminary navigation", () => {
    const state = withResult(); expect(assessmentReducer(state, { type: "stage", stage: "photos" }).photos).toBe(state.photos);
    const empty = assessmentFixture(); expect(assessmentReducer(empty, { type: "stage", stage: "questions" })).toBe(empty);
  });
  it("accepts only the current preliminary revision", () => {
    const state = assessmentFixture();
    const preliminary = { data: { ...modelFixture(), assessmentId: state.id, inputRevision: state.inputRevision, textHash: "test" }, envelope: "test" };
    expect(assessmentReducer(state, { type: "preliminary", assessmentId: state.id, revision: state.inputRevision + 1, preliminary })).toBe(state);
    expect(assessmentReducer(state, { type: "preliminary", assessmentId: state.id, revision: state.inputRevision, preliminary }).stage).toBe("questions");
  });
  it("withholds export when a chosen country is incomplete", () => {
    expect(reportCurrent({ ...assessmentFixture(), region: { response: "known", countryCode: null, regionId: null } })).toBe(false);
  });
});
