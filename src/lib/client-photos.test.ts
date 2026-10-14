import { afterEach, describe, expect, it, vi } from "vitest";
import { preparePhoto } from "./client-photos";

afterEach(() => vi.unstubAllGlobals());

describe("local photo decoding errors, AC-2 and AC-7", () => {
  it("reports a damaged image as invalid rather than a screening outage", async () => {
    const decode = vi.fn().mockRejectedValue(new DOMException("The source image could not be decoded.", "InvalidStateError"));
    vi.stubGlobal("createImageBitmap", decode);
    const bytes = Uint8Array.from([255, 216, 255, 192, 0, 11, 8, 0, 10, 0, 10, 1, 1, 17, 0, 255, 217]);
    await expect(preparePhoto(new File([bytes], "damaged.jpg", { type: "image/jpeg" }))).rejects.toThrow("invalid_image");
    expect(decode).toHaveBeenCalledOnce();
  });
  it("rejects a disguised unsupported format before requesting browser decoding", async () => {
    const decode = vi.fn(); vi.stubGlobal("createImageBitmap", decode);
    await expect(preparePhoto(new File(["<svg></svg>"], "leaf.jpg", { type: "image/jpeg" }))).rejects.toThrow("format");
    expect(decode).not.toHaveBeenCalled();
  });
});
