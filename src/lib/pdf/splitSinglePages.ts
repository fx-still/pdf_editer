import type { PdfPart } from "./splitByRanges";
import { splitEveryN } from "./splitEveryN";

export async function splitSinglePages(
  arrayBuffer: ArrayBuffer,
  pageCount: number
): Promise<PdfPart[]> {
  return await splitEveryN(arrayBuffer, pageCount, 1);
}

