import { PDFDocument } from "pdf-lib";
import type { PageRange } from "@/src/types/pdf";

export type PdfPart = {
  range: PageRange;
  bytes: Uint8Array;
};

export async function splitByRanges(
  arrayBuffer: ArrayBuffer,
  ranges: PageRange[]
): Promise<PdfPart[]> {
  const src = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });

  const parts: PdfPart[] = [];
  for (const r of ranges) {
    const out = await PDFDocument.create();
    const indices = Array.from({ length: r.end - r.start + 1 }, (_, i) => r.start + i);
    const pages = await out.copyPages(src, indices);
    for (const p of pages) out.addPage(p);
    const bytes = await out.save();
    parts.push({ range: r, bytes });
  }

  return parts;
}

