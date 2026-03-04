import type { PageRange } from "@/src/types/pdf";
import { splitByRanges, type PdfPart } from "./splitByRanges";

export async function splitEveryN(
  arrayBuffer: ArrayBuffer,
  pageCount: number,
  n: number
): Promise<PdfPart[]> {
  if (!Number.isFinite(pageCount) || pageCount <= 0) {
    throw new Error("无法获取 PDF 页数。");
  }
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("N 必须是正整数。");
  }

  const ranges: PageRange[] = [];
  for (let start = 0; start < pageCount; start += n) {
    ranges.push({ start, end: Math.min(start + n - 1, pageCount - 1) });
  }
  return await splitByRanges(arrayBuffer, ranges);
}

