import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { processPhoto } from "./images";
import { PHOTO_ID } from "../test-fixtures";

describe("safe image processing, AC-2 and AC-16", () => {
  it("verifies decoded content and removes original metadata", async () => {
    const input = await sharp({ create: { width: 120, height: 90, channels: 3, background: "green" } }).withMetadata({ orientation: 6 }).jpeg().toBuffer();
    const processed = await processPhoto(PHOTO_ID, new File([input], "synthetic.jpg", { type: "image/jpeg" }));
    const metadata = await sharp(processed.bytes).metadata();
    expect(processed.width).toBe(90); expect(processed.height).toBe(120);
    expect(metadata.exif).toBeUndefined(); expect(metadata.orientation).toBeUndefined();
  });
  it("rejects corrupt content disguised as an image", async () => {
    await expect(processPhoto(PHOTO_ID, new File(["not an image"], "leaf.jpg", { type: "image/jpeg" }))).rejects.toThrow("invalid_image");
  });
  it("rejects oversized decoded dimensions and unsupported real formats", async () => {
    const large = await sharp({ create: { width: 1601, height: 2, channels: 3, background: "green" } }).jpeg().toBuffer();
    await expect(processPhoto(PHOTO_ID, new File([large], "small.jpg"))).rejects.toThrow("invalid_image");
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>';
    await expect(processPhoto(PHOTO_ID, new File([svg], "leaf.jpg", { type: "image/jpeg" }))).rejects.toThrow("format");
  });
});
