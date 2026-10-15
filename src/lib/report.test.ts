import { describe, expect, it } from "vitest";
import { makeReport } from "./report";
import { assessmentReducer } from "./assessment";
import { withResult, assessmentFixture } from "./test-fixtures";
import english from "@/content/locales/en.json";
import tokPisin from "@/content/locales/tpi.json";
import { diagnosticReferences } from "@/content/diagnostic-references";

describe("honest report snapshots, AC-10, AC-11, AC-13 and AC-19", () => {
  it("includes farmer region, uncertainty, local referral and exact farmer text", () => {
    const state = withResult({ ...assessmentFixture(), region: { response: "known", countryCode: "BN", regionId: null }, answers: [{ questionId: "care_change", optionIds: ["yes"], detail: "My own wording: café, 12 pots." }] });
    const text = JSON.stringify(makeReport(state, "en", undefined, false));
    expect(text).toContain("Brunei"); expect(text).toContain("My own wording: café, 12 pots."); expect(text).toContain("local agricultural officer");
    expect(text).toContain(english.assessment.findings.changes_visible); expect(text).toContain(english.assessment.noCauseStatus); expect(text).toContain(state.result!.data.causeAssessmentEn); expect(text).not.toContain("confirmed healthy");
  });
  it("separates the country record from the result and its limits in both languages", () => {
    for (const locale of ["en", "tpi"] as const) {
      const t = (locale === "en" ? english : tokPisin).assessment;
      const base = { ...assessmentFixture(), region: { response: "known" as const, countryCode: "BN", regionId: null } };
      for (const state of [base, withResult(base)]) {
        const report = makeReport(state, locale, undefined, true);
        const summary = report.sections.find((section) => section.title === t.caseSummary)!;
        expect(summary.lines.at(-1)).toBe(`${t.countryValue}: Brunei (BN)`);
        const result = report.sections.find((section) => section.title === t.result)!;
        expect(result.lines).toContain(state.result ? t.visualCaveat : t.noResult);
        expect(summary.lines).not.toContain(result.lines[0]);
      }
    }
  });
  it("distinguishes skipped region from Not sure", () => {
    expect(JSON.stringify(makeReport(assessmentFixture(), "en", undefined, false))).toContain(`${english.assessment.countryValue}: ${english.assessment.notProvided}`);
    expect(JSON.stringify(makeReport({ ...assessmentFixture(), region: { response: "not_sure", countryCode: null, regionId: null } }, "en", undefined, false))).toContain(`${english.assessment.countryValue}: ${english.assessment.unknown}`);
  });
  it("refuses stale regional snapshots and rejects unaccepted translation fallback", () => {
    const state = withResult();
    expect(() => makeReport(assessmentReducer(state, { type: "region", region: { response: "not_sure", countryCode: null, regionId: null } }), "en", undefined, false)).toThrow("regionStale");
    expect(() => makeReport(state, "tpi", undefined, false)).toThrow("noTranslationExport");
    const fallback = JSON.stringify(makeReport(state, "tpi", undefined, true));
    expect(fallback).toContain("Inglis");
    expect(fallback.split(tokPisin.assessment.englishFallback)).toHaveLength(2);
  });
  it("marks an incomplete attempt without inserting preliminary or old results", () => {
    const report = makeReport(assessmentFixture(), "en", undefined, false);
    expect(JSON.stringify(report)).toContain("No screening result was produced");
    expect(JSON.stringify(report)).not.toContain("A pale patch");
  });
  it("puts specific findings before the officer record and includes all evidence, UR-2, UR-3 and UR-9", () => {
    const state = withResult(), result = state.result!.data;
    result.observations = Array.from({ length: 6 }, (_, i) => ({ ...result.observations[0], id: `item_${i}`, textEn: `Synthetic visible detail ${i}` }));
    result.keyObservationIds = ["item_0", "item_1", "item_2"];
    result.contradictions = [{ textEn: "Synthetic uncertainty", observationIds: ["item_1"] }];
    const report = makeReport(state, "en", undefined, false), text = JSON.stringify(report);
    expect(report.sections[0].title).toBe(english.assessment.caseSummary);
    expect(report.sections.find((section) => section.title === english.assessment.keyFindings)!.lines.join(" ")).toContain("Synthetic visible detail 0");
    expect(report.sections.find((section) => section.title === english.assessment.keyFindings)!.lines.join(" ")).not.toContain("Synthetic visible detail 3");
    for (let i = 0; i < 6; i++) expect(text).toContain(`Synthetic visible detail ${i}`);
    expect(text).toContain("Synthetic uncertainty"); expect(text).toContain(english.assessment.usable);
    expect(report.sections.filter((item) => item.includePhotos)).toHaveLength(1);
    expect(report.photoCaptions![0]).toContain(english.assessment.unknown);
  });
  it("includes the tentative cause, evidence, next check and source scope without inventing reviewed guidance", () => {
    const state = withResult();
    state.result!.data.possibleCauses = [{ nameEn: "Synthetic tentative cause", whyEn: "Synthetic visible pattern", uncertaintyEn: "Synthetic uncertainty", nextCheckEn: "Inspect the underside.", observationIds: ["visible_1"], sourceIds: ["hawaii_leaf_identification"] }];
    const text = JSON.stringify(makeReport(state, "en", undefined, false));
    for (const expected of ["Synthetic tentative cause", "Synthetic visible pattern", "Inspect the underside.", "Photo 1", "Hawaii diagnostic publication", english.assessment.causeIntro]) expect(text).toContain(expected);
    expect(state.guidance!.data.entries).toEqual([]);
    expect(text.split(diagnosticReferences.hawaii_leaf_identification.title)).toHaveLength(2);
    expect(text).toContain(`${english.assessment.source}: 1`);
    expect(text).toContain(english.assessment.possibleCauseLabel);
  });
  it("marks findings as key points and keeps farmer answers separate from AI findings", () => {
    const report = makeReport(withResult(), "en", undefined, false);
    expect(report.sections.find((section) => section.title === english.assessment.keyFindings)?.layout).toBe("bullets");
    expect(report.sections.find((section) => section.title === english.assessment.farmerRecord)?.layout).toBe("answers");
    expect(report.sections[0].labels).toContain(english.assessment.countryValue);
  });

});
