"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/src/components/layout/Shell";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Dropzone } from "@/src/components/uploader/Dropzone";
import { PdfSortableList } from "@/src/components/pdf/PdfSortableList";
import { useToast } from "@/src/components/toast/useToast";
import { FILE_LIMITS } from "@/src/lib/config/limits";
import type { PdfItem } from "@/src/types/pdf";
import { readPdfMeta } from "@/src/lib/pdf/meta";
import { mergePdfs } from "@/src/lib/pdf/merge";
import { downloadBlob } from "@/src/lib/download/downloadBlob";

export default function MergePage() {
  const toast = useToast();
  const [items, setItems] = useState<PdfItem[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const totalPages = useMemo(
    () => items.reduce((sum, it) => sum + (it.pageCount ?? 0), 0),
    [items]
  );

  async function handleAddFiles(files: File[]) {
    const pdfs = files.filter((f) => f.type === "application/pdf");
    if (pdfs.length !== files.length) {
      toast.error("仅支持 PDF 文件。");
    }
    if (pdfs.length === 0) return;

    const tooLarge = pdfs.find((f) => f.size > FILE_LIMITS.maxFileBytes);
    if (tooLarge) {
      toast.error(
        `文件过大：${tooLarge.name}（上限 ${FILE_LIMITS.maxFileMB}MB）`
      );
      return;
    }

    setBusy("读取 PDF 页数…");
    try {
      const metas = await Promise.all(
        pdfs.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const meta = await readPdfMeta(arrayBuffer);
          const id = crypto.randomUUID();
          return {
            id,
            fileName: file.name,
            fileSize: file.size,
            arrayBuffer,
            pageCount: meta.pageCount,
          } satisfies PdfItem;
        })
      );
      setItems((prev) => [...prev, ...metas]);
    } catch {
      toast.error("读取 PDF 失败：请确认文件未损坏或受密码保护。");
    } finally {
      setBusy(null);
    }
  }

  async function handleMerge() {
    if (items.length < 2) {
      toast.error("请至少上传 2 个 PDF。");
      return;
    }
    setBusy("合并中…");
    try {
      const mergedBytes = await mergePdfs(items.map((i) => i.arrayBuffer));
      // pdf-lib 返回的是 Uint8Array<ArrayBufferLike>，这里通过断言显式转为 BlobPart 以通过类型检查
      const blob = new Blob([mergedBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      downloadBlob(blob, "merged.pdf");
      toast.success("已生成 merged.pdf");
    } catch {
      toast.error("合并失败：可能是文件损坏或内存不足。");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">合并 PDF</h2>
          <p className="mt-1 text-sm text-zinc-300">
            拖拽上传多个 PDF，支持排序。全程本地处理。
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <Dropzone
              accept="application/pdf"
              multiple
              helperText={`单文件上限 ${FILE_LIMITS.maxFileMB}MB`}
              onFiles={handleAddFiles}
            />
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-zinc-300">
                已添加{" "}
                <span className="font-medium text-zinc-50">{items.length}</span>{" "}
                个文件 · 总页数{" "}
                <span className="font-medium text-zinc-50">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  disabled={items.length === 0 || !!busy}
                  onClick={() => setItems([])}
                >
                  清空
                </Button>
                <Button disabled={items.length < 2 || !!busy} onClick={handleMerge}>
                  一键导出 merged.pdf
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <PdfSortableList
                items={items}
                onChange={setItems}
                disabled={!!busy}
              />
            </div>
          </Card>

          {busy ? (
            <div className="text-sm text-zinc-300">处理中：{busy}</div>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}

