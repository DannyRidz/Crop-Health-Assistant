import sharp from "sharp";
import { ApiError } from "./http";

export type ProcessedPhoto = { id: string; bytes: Buffer; width: number; height: number };
export async function processPhoto(id: string, file: File): Promise<ProcessedPhoto> {
  if (!file.size || file.size > 2 * 1024 * 1024) throw new ApiError(413, "too_large");
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(bytes, { limitInputPixels: 2560000, failOn: "warning", animated: true }).metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format ?? "") || (metadata.pages ?? 1) > 1) throw new ApiError(415, "format");
    if (!metadata.width || !metadata.height || Math.max(metadata.width, metadata.height) > 1600) throw new ApiError(422, "invalid_image");
    const result = await sharp(bytes, { limitInputPixels: 2560000, failOn: "warning" }).rotate().jpeg({ quality: 82 }).toBuffer({ resolveWithObject: true });
    return { id, bytes: result.data, width: result.info.width, height: result.info.height };
  } catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(422, "invalid_image"); }
}
