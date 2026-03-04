import JSZip from "jszip";
import type { PageRange } from "@/src/types/pdf";
import type { PdfPart } from "@/src/lib/pdf/splitByRanges";

export async function zipPdfParts(
  parts: PdfPart[],
  fileNameForRange: (range: PageRange) => string
) {
  const zip = new JSZip();
  for (const p of parts) {
    zip.file(fileNameForRange(p.range), p.bytes);
  }
  return await zip.generateAsync({ type: "blob" });
}

