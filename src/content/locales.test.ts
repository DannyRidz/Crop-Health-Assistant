import { describe, expect, it } from "vitest";
import english from "./locales/en.json";
import tokPisin from "./locales/tpi.json";
import review from "./translation-review.json";
import keyReview from "./translation-keys.json";

function textShape(value: unknown): unknown {
  if (typeof value === "string") {
    expect(value.trim().length).toBeGreaterThan(0);
    return "text";
  }
  if (Array.isArray(value)) return value.map(textShape);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, textShape(item)]));
  }
  throw new Error("Translation collections must contain text, arrays or objects");
}

describe("translation collection, AC-12 foundation", () => {
  it("provides the same nonempty interface fields and steps in both languages", () => {
    expect(textShape(tokPisin)).toEqual(textShape(english));
  });

  it("keeps the unreviewed Tok Pisin collection labelled as draft", () => {
    expect(review.tpi).toEqual({ status: "draft", reviewer: null, reviewDate: null });
  });
  it("records draft status for every fixed text key, including errors and reports", () => {
    function paths(value: unknown, prefix = ""): string[] {
      if (typeof value === "string") return [prefix];
      return Object.entries(value as object).flatMap(([key, item]) => paths(item, prefix ? `${prefix}.${key}` : key));
    }
    expect(Object.keys(keyReview).sort()).toEqual(paths(english).sort());
    expect(Object.values(keyReview).every((value) => value.en === "authored" && value.tpi === "draft")).toBe(true);
  });
});
