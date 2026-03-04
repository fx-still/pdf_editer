import { PDFDocument } from "pdf-lib";

export async function readPdfMeta(arrayBuffer: ArrayBuffer) {
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
  return {
    pageCount: doc.getPageCount(),
  };
}

