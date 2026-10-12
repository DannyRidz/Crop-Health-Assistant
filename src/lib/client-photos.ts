import type { LocalPhoto, PhotoMeta } from "./contracts";

function dimensions(bytes: Uint8Array): { width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length > 24 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) {
    let offset = 8;
    while (offset + 12 <= bytes.length) {
      const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
      if (type === "acTL") throw new Error("format");
      const length = view.getUint32(offset);
      offset += length + 12;
    }
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }
  if (bytes.length > 30 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") {
    const type = String.fromCharCode(...bytes.slice(12, 16));
    if (type === "VP8X") {
      if (bytes[20] & 2) throw new Error("format");
      return { width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
    }
    if (type === "VP8 ") return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    if (type === "VP8L") {
      const packed = view.getUint32(21, true);
      return { width: (packed & 0x3fff) + 1, height: ((packed >>> 14) & 0x3fff) + 1 };
    }
  }
  if (bytes[0] === 255 && bytes[1] === 216) {
    let offset = 2;
    while (offset + 9 <= bytes.length) {
      if (bytes[offset] !== 255) break;
      const marker = bytes[offset + 1];
      if (marker === 255) { offset++; continue; }
      if (marker === 0xda || marker === 0xd9) break;
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      const length = view.getUint16(offset + 2);
      if (length < 2) break;
      offset += length + 2;
    }
  }
  throw new Error("format");
}
export async function preparePhoto(file: File, previous?: PhotoMeta): Promise<LocalPhoto> {
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error("too_large");
  const original = dimensions(new Uint8Array(await file.arrayBuffer()));
  if (original.width <= 0 || original.height <= 0 || original.width * original.height > 40000000) throw new Error("too_large");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const ratio = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio)); canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("photo_failed");
    context.fillStyle = "#e8dcc7"; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("photo_failed")), "image/jpeg", 0.82));
    if (blob.size > 2 * 1024 * 1024) throw new Error("too_large");
    return { id: previous?.id ?? crypto.randomUUID(), side: previous?.side ?? "unknown", blob, url: URL.createObjectURL(blob), width: canvas.width, height: canvas.height };
  } finally { bitmap.close(); }
}
