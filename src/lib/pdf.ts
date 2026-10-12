import { PDFDocument, PDFName, PDFString, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { ReportData } from "./report";

export async function createPdf(report: ReportData, fontBytes: Uint8Array): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(report.title); pdf.setAuthor("Crop Health Assistant"); pdf.setSubject("Initial coffee leaf screening, not a confirmed diagnosis");
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(fontBytes, { subset: true });
  const characters = new Set(font.getCharacterSet());
  const checkText = (text: string) => {
    for (const char of text) if (char !== "\n" && char !== "\t" && !characters.has(char.codePointAt(0)!)) throw new Error("unsupported_font_character");
    return text.replaceAll("\t", "    ");
  };
  const margin = 42, pageWidth = 595.28, pageHeight = 841.89, width = pageWidth - margin * 2;
  const earth = rgb(40 / 255, 51 / 255, 34 / 255);
  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;
  const room = (height: number) => { if (y - height < margin + 18) { page = pdf.addPage([pageWidth, pageHeight]); y = pageHeight - margin; } };
  function wrap(text: string, size: number): string[] {
    const lines: string[] = [];
    for (const paragraph of checkText(text).split("\n")) {
      let line = "";
      for (const word of paragraph.split(" ")) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= width) { line = candidate; continue; }
        if (line) { lines.push(line); line = ""; }
        for (const character of word) {
          if (font.widthOfTextAtSize(line + character, size) > width && line) { lines.push(line); line = ""; }
          line += character;
        }
      }
      lines.push(line);
    }
    return lines;
  }
  function draw(text: string, size = 12.5) {
    const lineHeight = size * 1.5;
    const link = text.match(/https:\/\/[^\s,]+/)?.[0];
    const lines = wrap(text, size);
    const blockHeight = lines.length * lineHeight + 6;
    // Keep short question and answer blocks together across page boundaries.
    if (blockHeight <= pageHeight - margin * 2 - 18) room(blockHeight);
    for (const line of lines) {
      room(lineHeight); y -= lineHeight;
      page.drawText(line, { x: margin, y, size, font, color: earth });
      if (link) {
        const annotation = pdf.context.obj({ Type: "Annot", Subtype: "Link", Rect: [margin, y - 2, margin + font.widthOfTextAtSize(line, size), y + size], Border: [0, 0, 0], A: { S: "URI", URI: PDFString.of(link) } });
        page.node.addAnnot(pdf.context.register(annotation));
      }
    }
    y -= 6;
  }
  draw(report.title, 18);
  for (const [index, section] of report.sections.entries()) {
    room(60); y -= 8; draw(section.title, 15);
    for (const text of section.lines) draw(text);
    if (index === 1) {
      for (const [photoIndex, photo] of report.photos.entries()) {
        const image = await pdf.embedJpg(await photo.blob.arrayBuffer());
        const ratio = Math.min(width / image.width, 240 / image.height, 1);
        const imageWidth = image.width * ratio, imageHeight = image.height * ratio;
        room(imageHeight + 42); draw(`${report.photoLabel} ${photoIndex + 1}`, 12.5);
        y -= imageHeight;
        page.drawImage(image, { x: margin, y, width: imageWidth, height: imageHeight }); y -= 12;
      }
    }
  }
  const pages = pdf.getPages();
  for (const [index, item] of pages.entries()) item.drawText(`${index + 1} / ${pages.length}`, { x: margin, y: 24, size: 10, font, color: earth });
  // Keep the file as a report, never an executable form or an automatic share action.
  pdf.catalog.delete(PDFName.of("OpenAction"));
  const bytes = await pdf.save();
  if (bytes.byteLength > 3 * 1024 * 1024) throw new Error("report_too_large");
  return bytes;
}
