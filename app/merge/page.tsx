"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/src/components/layout/Shell";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Dropzone } from "@/src/components/uploader/Dropzone";
import { PdfSortableList } from "@/src/components/pdf/PdfSortableList";
import { useToast } from "@/src/components/toast/useToast";
import { useI18n } from "@/src/components/i18n/I18nProvider";
import { FILE_LIMITS } from "@/src/lib/config/limits";
import type { MessageKey } from "@/src/lib/i18n/messages";
import type { PdfItem } from "@/src/types/pdf";
import { readPdfMeta } from "@/src/lib/pdf/meta";
import { mergePdfs } from "@/src/lib/pdf/merge";
import { downloadBlob } from "@/src/lib/download/downloadBlob";

export default function MergePage() {
  const toast = useToast();
  const { t, rich } = useI18n();
  const [items, setItems] = useState<PdfItem[]>([]);
  const [busy, setBusy] = useState<MessageKey | null>(null);

  const totalPages = useMemo(
    () => items.reduce((sum, it) => sum + (it.pageCount ?? 0), 0),
    [items]
  );

  async function handleAddFiles(files: File[]) {
    const pdfs = files.filter((f) => f.type === "application/pdf");
    if (pdfs.length !== files.length) {
      toast.error(t("error.onlyPdf"));
    }
    if (pdfs.length === 0) return;

    const tooLarge = pdfs.find((f) => f.size > FILE_LIMITS.maxFileBytes);
    if (tooLarge) {
      toast.error(
        t("error.fileTooLargeNamed", { name: tooLarge.name, mb: FILE_LIMITS.maxFileMB })
      );
      return;
    }

    setBusy("busy.readingPages");
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
      toast.error(t("error.readFailed"));
    } finally {
      setBusy(null);
    }
  }

  async function handleMerge() {
    if (items.length < 2) {
      toast.error(t("merge.needTwo"));
      return;
    }
    setBusy("busy.merging");
    try {
      const mergedBytes = await mergePdfs(items.map((i) => i.arrayBuffer));
      // pdf-lib 返回的是 Uint8Array<ArrayBufferLike>，这里通过断言显式转为 BlobPart 以通过类型检查
      const blob = new Blob([mergedBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      downloadBlob(blob, "merged.pdf");
      toast.success(t("merge.done"));
    } catch {
      toast.error(t("merge.failed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">{t("merge.title")}</h2>
          <p className="mt-1 text-sm text-zinc-300">
            {t("merge.subtitle")}
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <Dropzone
              accept="application/pdf"
              multiple
              helperText={t("common.fileLimit", { mb: FILE_LIMITS.maxFileMB })}
              onFiles={handleAddFiles}
            />
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-zinc-300">
                {rich("merge.summary", {
                  count: <span className="font-medium text-zinc-50">{items.length}</span>,
                  pages: <span className="font-medium text-zinc-50">{totalPages}</span>,
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  disabled={items.length === 0 || !!busy}
                  onClick={() => setItems([])}
                >
                  {t("common.clear")}
                </Button>
                <Button disabled={items.length < 2 || !!busy} onClick={handleMerge}>
                  {t("merge.export")}
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
            <div className="text-sm text-zinc-300">
              {t("common.processing", { task: t(busy) })}
            </div>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}
