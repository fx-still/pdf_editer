"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/src/components/layout/Shell";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Dropzone } from "@/src/components/uploader/Dropzone";
import { useToast } from "@/src/components/toast/useToast";
import { useI18n } from "@/src/components/i18n/I18nProvider";
import { FILE_LIMITS } from "@/src/lib/config/limits";
import { I18nError, type MessageKey } from "@/src/lib/i18n/messages";
import { readPdfMeta } from "@/src/lib/pdf/meta";
import { parsePageRanges } from "@/src/lib/pdf/pageRanges";
import { splitByRanges } from "@/src/lib/pdf/splitByRanges";
import { splitEveryN } from "@/src/lib/pdf/splitEveryN";
import { splitSinglePages } from "@/src/lib/pdf/splitSinglePages";
import { zipPdfParts } from "@/src/lib/zip/zipPdfParts";
import { downloadBlob } from "@/src/lib/download/downloadBlob";
import { RadioGroup } from "@/src/components/ui/RadioGroup";
import { Input } from "@/src/components/ui/Input";
import { fileBaseName } from "@/src/lib/utils/format";

type Mode = "range" | "everyN" | "single";

export default function SplitPage() {
  const toast = useToast();
  const { t } = useI18n();
  const [busy, setBusy] = useState<MessageKey | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const [mode, setMode] = useState<Mode>("range");
  const [rangeText, setRangeText] = useState("1-3,5,8-10");
  const [everyN, setEveryN] = useState("5");

  const base = useMemo(() => fileBaseName(fileName ?? "original.pdf"), [fileName]);

  async function handleFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error(t("error.onlyPdf"));
      return;
    }
    if (f.size > FILE_LIMITS.maxFileBytes) {
      toast.error(t("error.fileTooLarge", { mb: FILE_LIMITS.maxFileMB }));
      return;
    }

    setBusy("busy.readingPages");
    try {
      const buf = await f.arrayBuffer();
      const meta = await readPdfMeta(buf);
      setFileName(f.name);
      setArrayBuffer(buf);
      setPageCount(meta.pageCount);
      toast.success(t("split.loaded", { name: f.name, count: meta.pageCount }));
    } catch {
      toast.error(t("error.readFailed"));
      setFileName(null);
      setArrayBuffer(null);
      setPageCount(null);
    } finally {
      setBusy(null);
    }
  }

  async function handleSplit() {
    if (!arrayBuffer || !pageCount || !fileName) {
      toast.error(t("split.needFile"));
      return;
    }

    setBusy("busy.splitting");
    try {
      if (mode === "range") {
        const ranges = parsePageRanges(rangeText, pageCount);
        const parts = await splitByRanges(arrayBuffer, ranges);
        setBusy("busy.zipping");
        const zipBlob = await zipPdfParts(parts, (r) => `${base}_p${r.start + 1}-${r.end + 1}.pdf`);
        downloadBlob(zipBlob, `${base}_ranges.zip`);
        toast.success(t("split.doneRanges"));
        return;
      }

      if (mode === "everyN") {
        const n = Number.parseInt(everyN, 10);
        if (!Number.isFinite(n) || n <= 0) {
          toast.error(t("split.invalidN"));
          return;
        }
        const parts = await splitEveryN(arrayBuffer, pageCount, n);
        setBusy("busy.zipping");
        const zipBlob = await zipPdfParts(parts, (r) => `${base}_p${r.start + 1}-${r.end + 1}.pdf`);
        downloadBlob(zipBlob, `${base}_every${n}.zip`);
        toast.success(t("split.doneZip"));
        return;
      }

      // single
      const parts = await splitSinglePages(arrayBuffer, pageCount);
      setBusy("busy.zipping");
      const zipBlob = await zipPdfParts(parts, (r) => `${base}_p${String(r.start + 1).padStart(3, "0")}.pdf`);
      downloadBlob(zipBlob, `${base}_single_pages.zip`);
      toast.success(t("split.doneSingle"));
    } catch (e) {
      const msg =
        e instanceof I18nError
          ? t(e.key, e.params)
          : e instanceof Error
            ? e.message
            : t("split.failed");
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">{t("split.title")}</h2>
          <p className="mt-1 text-sm text-zinc-300">
            {t("split.subtitle")}
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <Dropzone
              accept="application/pdf"
              multiple={false}
              helperText={t("common.fileLimit", { mb: FILE_LIMITS.maxFileMB })}
              onFiles={handleFile}
            />
            <div className="mt-3 text-sm text-zinc-300">
              {t("split.currentFile")}{" "}
              <span className="font-medium text-zinc-50">
                {fileName ? fileName : t("split.noFile")}
              </span>
              {pageCount ? (
                <span className="ml-2 text-zinc-400">
                  ({t("common.pages", { count: pageCount })})
                </span>
              ) : null}
            </div>
          </Card>

          <Card>
            <div className="grid gap-4">
              <RadioGroup<Mode>
                value={mode}
                onChange={setMode}
                options={[
                  { value: "range", label: t("split.modeRange") },
                  { value: "everyN", label: t("split.modeEveryN") },
                  { value: "single", label: t("split.modeSingle") },
                ]}
              />

              {mode === "range" ? (
                <div className="grid gap-2">
                  <div className="text-sm text-zinc-200">{t("split.rangeLabel")}</div>
                  <Input
                    value={rangeText}
                    onChange={(e) => setRangeText(e.target.value)}
                    placeholder="1-3,5,8-10"
                    inputMode="text"
                    disabled={!!busy}
                  />
                  <div className="text-xs text-zinc-400">
                    {t("split.rangeHint")}
                  </div>
                </div>
              ) : null}

              {mode === "everyN" ? (
                <div className="grid gap-2">
                  <div className="text-sm text-zinc-200">{t("split.everyNLabel")}</div>
                  <Input
                    value={everyN}
                    onChange={(e) => setEveryN(e.target.value)}
                    placeholder={t("split.everyNPlaceholder")}
                    inputMode="numeric"
                    disabled={!!busy}
                  />
                </div>
              ) : null}

              {mode === "single" ? (
                <div className="text-sm text-zinc-300">
                  {t("split.singleHint")}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  disabled={!arrayBuffer || !!busy}
                  onClick={() => {
                    setFileName(null);
                    setArrayBuffer(null);
                    setPageCount(null);
                  }}
                >
                  {t("common.clear")}
                </Button>
                <Button disabled={!arrayBuffer || !!busy} onClick={handleSplit}>
                  {t("split.export")}
                </Button>
              </div>
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
