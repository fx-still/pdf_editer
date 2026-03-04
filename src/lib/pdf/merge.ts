import { PDFDocument } from "pdf-lib";

export async function mergePdfs(buffers: ArrayBuffer[]) {
  const merged = await PDFDocument.create();

  for (const buf of buffers) {
    const src = await PDFDocument.load(buf, { ignoreEncryption: false });
    const indices = Array.from({ length: src.getPageCount() }, (_, i) => i);
    const pages = await merged.copyPages(src, indices);
    for (const p of pages) merged.addPage(p);
  }

  return await merged.save();
}

