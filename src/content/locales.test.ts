import { describe, expect, it } from "vitest";
import english from "./locales/en.json";
import tokPisin from "./locales/tpi.json";
import review from "./translation-review.json";

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
});
