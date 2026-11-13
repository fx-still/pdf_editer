import type { PageRange } from "@/src/types/pdf";
import { I18nError } from "@/src/lib/i18n/messages";
import { splitByRanges, type PdfPart } from "./splitByRanges";

export async function splitEveryN(
  arrayBuffer: ArrayBuffer,
  pageCount: number,
  n: number
): Promise<PdfPart[]> {
  if (!Number.isFinite(pageCount) || pageCount <= 0) {
    throw new I18nError("error.noPageCount");
  }
  if (!Number.isFinite(n) || n <= 0) {
    throw new I18nError("error.nInvalid");
  }

  const ranges: PageRange[] = [];
  for (let start = 0; start < pageCount; start += n) {
    ranges.push({ start, end: Math.min(start + n - 1, pageCount - 1) });
  }
  return await splitByRanges(arrayBuffer, ranges);
}

