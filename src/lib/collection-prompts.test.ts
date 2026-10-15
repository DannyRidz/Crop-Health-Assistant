import { describe, expect, it } from "vitest";
import { collectionPrompts } from "./collection-prompts";
import { modelFixture, PHOTO_ID } from "./test-fixtures";

describe("optional collection notes, UR-4", () => {
  it("prioritises one replacement note and suppresses duplicate missing view requests", () => {
    const checks = modelFixture().photoChecks; checks[0].quality = "blurry";
    checks.push({ ...checks[0], photoId: crypto.randomUUID() });
    const notes = collectionPrompts(checks, [{ id: PHOTO_ID, side: "upper" }], []);
    expect(notes.map((note) => note.id)).toEqual(["replace_unclear_photos", "record_onset"]);
    expect(notes[0].photoIds).toHaveLength(2);
  });
  it("does not assume an unknown side is an underside or upper view", () => {
    expect(collectionPrompts(modelFixture().photoChecks, [{ id: PHOTO_ID, side: "unknown" }], [])[0].id).toBe("identify_sides");
    expect(collectionPrompts(modelFixture().photoChecks, [{ id: PHOTO_ID, side: "upper" }], [])[0].id).toBe("add_underside");
    expect(collectionPrompts(modelFixture().photoChecks, [{ id: PHOTO_ID, side: "underside" }], [])[0].id).toBe("add_upper");
  });
  it("requests no extra information when both views and onset and spread are known", () => {
    const checks = modelFixture().photoChecks, secondId = crypto.randomUUID(); checks.push({ ...checks[0], photoId: secondId });
    expect(collectionPrompts(checks, [{ id: PHOTO_ID, side: "upper" }, { id: secondId, side: "underside" }], [
      { questionId: "onset", optionIds: ["today"], detail: "" }, { questionId: "spread", optionIds: ["one"], detail: "" },
    ])).toEqual([]);
  });
  it("does not recommend photography for explicitly unsupported subjects", () => {
    const checks = modelFixture().photoChecks; checks[0].crop = "other"; checks[0].quality = "blurry";
    expect(collectionPrompts(checks, [{ id: PHOTO_ID, side: "unknown" }], []).every((note) => note.photoIds.length === 0)).toBe(true);
  });
});
