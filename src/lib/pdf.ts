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
  const margin = 48, pageWidth = 595.28, pageHeight = 841.89, width = pageWidth - margin * 2;
  const earth = rgb(40 / 255, 51 / 255, 34 / 255);
  const rule = rgb(139 / 255, 157 / 255, 131 / 255);
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
  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;
  let contentTop = y;
  function pageHeader(first: boolean) {
    const size = first ? 18 : 10.5;
    for (const line of wrap(report.title, size)) {
      y -= size * 1.4;
      page.drawText(line, { x: margin, y, size, font, color: earth });
    }
    y -= 12;
    page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: first ? 2 : 1, color: earth });
    y -= 18;
    contentTop = y;
  }
  pageHeader(true);
  const room = (height: number) => {
    if (y - height < margin + 24) {
      page = pdf.addPage([pageWidth, pageHeight]); y = pageHeight - margin; pageHeader(false);
    }
  };
  const blockHeight = (text: string, size: number) => wrap(text, size).length * size * 1.45 + 6;
  function draw(text: string, size = 12) {
    const lineHeight = size * 1.45;
    const link = text.match(/https:\/\/[^\s,]+/)?.[0];
    const lines = wrap(text, size);
    const height = lines.length * lineHeight + 6;
    // Keep short question and answer blocks together across page boundaries.
    if (height <= contentTop - margin - 24) room(height);
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
  const images = await Promise.all(report.photos.map(async (photo) => pdf.embedJpg(await photo.blob.arrayBuffer())));
  const columnWidth = images.length === 2 ? (width - 16) / 2 : width;
  const sizes = images.map((image) => {
    const ratio = Math.min(columnWidth / image.width, (images.length === 2 ? 180 : 200) / image.height, 1);
    return { width: image.width * ratio, height: image.height * ratio };
  });
  const rowHeight = images.length ? Math.max(...sizes.map((size) => size.height)) : 0;
  for (const section of report.sections) {
    const headingHeight = blockHeight(section.title, 14) + 8;
    const firstHeight = section.lines.length ? blockHeight(section.lines[0], 12) : 0;
    const keepHeight = headingHeight + firstHeight;
    const sectionHeight = headingHeight + section.lines.reduce((height, text) => height + blockHeight(text, 12), 0) + (section.includePhotos && images.length ? rowHeight + 42 : 0);
    if ((sectionHeight <= 240 || section.includePhotos) && sectionHeight <= contentTop - margin - 24) room(sectionHeight);
    else room(keepHeight <= contentTop - margin - 24 ? keepHeight : headingHeight + 36);
    y -= 8; draw(section.title, 14);
    for (const text of section.lines) draw(text);
    if (section.includePhotos) {
      if (images.length) {
        room(rowHeight + 42);
        const labelY = y - 17;
        for (const [photoIndex, image] of images.entries()) {
          const x = margin + photoIndex * (columnWidth + 16);
          page.drawText(checkText(report.photoCaptions?.[photoIndex] ?? `${report.photoLabel} ${photoIndex + 1}`), { x, y: labelY, size: 11.5, font, color: earth });
          const imageY = labelY - 8 - sizes[photoIndex].height;
          page.drawImage(image, { x, y: imageY, width: sizes[photoIndex].width, height: sizes[photoIndex].height });
          page.drawRectangle({ x, y: imageY, width: sizes[photoIndex].width, height: sizes[photoIndex].height, borderColor: rule, borderWidth: .5 });
        }
        y = labelY - 8 - rowHeight - 12;
      }
    }
  }
  const pages = pdf.getPages();
  for (const [index, item] of pages.entries()) {
    item.drawLine({ start: { x: margin, y: 36 }, end: { x: pageWidth - margin, y: 36 }, thickness: .5, color: rule });
    item.drawText(checkText(`Crop Health Assistant | ${report.reference.slice(0, 8)}`), { x: margin, y: 22, size: 9, font, color: earth });
    const number = `${index + 1} / ${pages.length}`;
    item.drawText(number, { x: pageWidth - margin - font.widthOfTextAtSize(number, 9), y: 22, size: 9, font, color: earth });
  }
  // Keep the file as a report, never an executable form or an automatic share action.
  pdf.catalog.delete(PDFName.of("OpenAction"));
  const bytes = await pdf.save();
  if (bytes.byteLength > 3 * 1024 * 1024) throw new Error("report_too_large");
  return bytes;
}
