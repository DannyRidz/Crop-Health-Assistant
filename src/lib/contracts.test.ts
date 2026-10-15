import { describe, expect, it } from "vitest";
import { answerSchema, regionSchema, UNKNOWN_REGION } from "./contracts";
import { COUNTRY_CODES, CARE_COUNTRIES } from "./countries";

describe("M1 input boundaries, AC-3 and AC-19", () => {
  it("accepts PNG, Brunei and other ISO countries without treating country as admission", () => {
    expect(COUNTRY_CODES).toHaveLength(249);
    for (const countryCode of ["PG", "BN", "BR", "KE", "US"]) expect(regionSchema.safeParse({ response: "known", countryCode, regionId: null }).success).toBe(true);
  });
  it("offers only the four agreed pilot countries without restricting ISO contexts", () => {
    expect(CARE_COUNTRIES.map((country) => country.code)).toEqual(["PG", "ID", "KE", "BR"]);
    expect(CARE_COUNTRIES.map((country) => country.name)).toEqual(["Papua New Guinea", "Indonesia", "Kenya", "Brazil"]);
    expect(regionSchema.safeParse({ response: "known", countryCode: "BN", regionId: null }).success).toBe(true);
  });
  it("accepts unknown or skipped geography and rejects inferred or mismatched context", () => {
    expect(regionSchema.safeParse(UNKNOWN_REGION).success).toBe(true);
    expect(regionSchema.safeParse({ response: "not_sure", countryCode: null, regionId: null }).success).toBe(true);
    for (const value of [
      { response: "known", countryCode: null, regionId: null }, { response: "known", countryCode: "ZZ", regionId: null },
      { response: "not_sure", countryCode: "PG", regionId: null }, { response: "known", countryCode: "PG", regionId: "invented" },
      { ...UNKNOWN_REGION, exactAddress: "private" },
    ]) expect(regionSchema.safeParse(value).success).toBe(false);
  });
  it("keeps Not sure exclusive and rejects unknown or duplicate options", () => {
    expect(answerSchema.safeParse({ questionId: "symptoms", optionIds: ["spots", "yellowing"], detail: "" }).success).toBe(true);
    for (const optionIds of [["spots", "not_sure"], ["spots", "spots"], ["invented"], []])
      expect(answerSchema.safeParse({ questionId: "symptoms", optionIds, detail: "" }).success).toBe(false);
    expect(answerSchema.safeParse({ questionId: "onset", optionIds: ["today", "over_week"], detail: "" }).success).toBe(false);
  });
  it("bounds optional farmer text without changing its wording", () => {
    const answer = { questionId: "care_change", optionIds: ["not_sure"], detail: "é".repeat(300) };
    expect(answerSchema.parse(answer).detail).toBe(answer.detail);
    expect(answerSchema.safeParse({ ...answer, detail: "x".repeat(301) }).success).toBe(false);
  });
});
