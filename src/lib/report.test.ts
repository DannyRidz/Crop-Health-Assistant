import { describe, expect, it } from "vitest";
import { makeReport } from "./report";
import { assessmentReducer } from "./assessment";
import { withResult, assessmentFixture } from "./test-fixtures";
import english from "@/content/locales/en.json";

describe("honest report snapshots, AC-10, AC-11, AC-13 and AC-19", () => {
  it("includes farmer region, uncertainty, local referral and exact farmer text", () => {
    const state = withResult({ ...assessmentFixture(), region: { response: "known", countryCode: "BN", regionId: null }, answers: [{ questionId: "care_change", optionIds: ["yes"], detail: "My own wording: café, 12 pots." }] });
    const text = JSON.stringify(makeReport(state, "en", undefined, false));
    expect(text).toContain("Brunei"); expect(text).toContain("My own wording: café, 12 pots."); expect(text).toContain("local agricultural officer");
    expect(text).toContain(english.assessment.unable_to_assess); expect(text).toContain(english.assessment.coverage); expect(text).not.toContain("confirmed healthy");
  });
  it("distinguishes skipped region from Not sure", () => {
    expect(JSON.stringify(makeReport(assessmentFixture(), "en", undefined, false))).toContain(`${english.assessment.countryValue}: ${english.assessment.notProvided}`);
    expect(JSON.stringify(makeReport({ ...assessmentFixture(), region: { response: "not_sure", countryCode: null, regionId: null } }, "en", undefined, false))).toContain(`${english.assessment.countryValue}: ${english.assessment.unknown}`);
  });
  it("refuses stale regional snapshots and rejects unaccepted translation fallback", () => {
    const state = withResult();
    expect(() => makeReport(assessmentReducer(state, { type: "region", region: { response: "not_sure", countryCode: null, regionId: null } }), "en", undefined, false)).toThrow("regionStale");
    expect(() => makeReport(state, "tpi", undefined, false)).toThrow("noTranslationExport");
    expect(JSON.stringify(makeReport(state, "tpi", undefined, true))).toContain("Inglis");
  });
  it("marks an incomplete attempt without inserting preliminary or old results", () => {
    const report = makeReport(assessmentFixture(), "en", undefined, false);
    expect(JSON.stringify(report)).toContain("No screening result was produced");
    expect(JSON.stringify(report)).not.toContain("A pale patch");
  });
});
