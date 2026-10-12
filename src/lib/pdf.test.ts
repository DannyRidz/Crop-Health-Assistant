import { readFile, writeFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { createPdf } from "./pdf";
import { makeReport } from "./report";
import { assessmentFixture, withResult } from "./test-fixtures";

describe("real PDF export, AC-13", () => {
  it("creates a readable multipage PDF with an embedded font and processed photo", async () => {
    const state = withResult(assessmentFixture());
    const jpeg = await sharp({ create: { width: 120, height: 90, channels: 3, background: "green" } }).jpeg().toBuffer();
    state.photos[0].blob = new Blob([jpeg]);
    state.answers = [{ questionId: "care_change", optionIds: ["not_sure"], detail: "Café " + "a".repeat(290) }];
    const font = await readFile(new URL("../../public/fonts/NotoSans-Regular.ttf", import.meta.url));
    const bytes = await createPdf(makeReport(state, "tpi", undefined, true), font);
    if (process.env.CROP_REPORT_VERIFICATION_OUTPUT) await writeFile(process.env.CROP_REPORT_VERIFICATION_OUTPUT, bytes);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    expect(bytes.byteLength).toBeLessThan(3 * 1024 * 1024);
    const document = await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBeGreaterThan(1);
    expect(document.getTitle()).toContain("ripoti");
  });
  it("fails clearly instead of silently replacing unsupported farmer characters", async () => {
    const font = await readFile(new URL("../../public/fonts/NotoSans-Regular.ttf", import.meta.url));
    await expect(createPdf({ reference: "test", title: "Test", sections: [{ title: "Farmer answer", lines: ["漢字"] }], photos: [], photoLabel: "Photo", filename: "test.pdf" }, font)).rejects.toThrow("unsupported_font_character");
  });
});
