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

  it("records the user confirmed language scope without approving agricultural guidance", () => {
    expect(review.tpi.status).toBe("reviewed");
    expect(review.tpi.scope).toContain("ai_generated_sample_reports");
    expect(review.tpi.futureGeneratedReports).toBe("automatic_translation_not_individually_reviewed");
    expect(review.tpi.reviewer).toBeNull();
    expect(review.agriculturalReview.status).toBe("pending");
  });
  it("records reviewed fixed text separately from future generated reports", () => {
    function paths(value: unknown, prefix = ""): string[] {
      if (typeof value === "string") return [prefix];
      return Object.entries(value as object).flatMap(([key, item]) => paths(item, prefix ? `${prefix}.${key}` : key));
    }
    expect(Object.keys(keyReview).sort()).toEqual(paths(english).sort());
    expect(Object.values(keyReview).every((value) => value.en === "authored" && value.tpi === "reviewed")).toBe(true);
  });
});
