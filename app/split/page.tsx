"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/src/components/layout/Shell";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Dropzone } from "@/src/components/uploader/Dropzone";
import { useToast } from "@/src/components/toast/useToast";
import { FILE_LIMITS } from "@/src/lib/config/limits";
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
  const [busy, setBusy] = useState<string | null>(null);

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
      toast.error("仅支持 PDF 文件。");
      return;
    }
    if (f.size > FILE_LIMITS.maxFileBytes) {
      toast.error(`文件过大：上限 ${FILE_LIMITS.maxFileMB}MB`);
      return;
    }

    setBusy("读取 PDF 页数…");
    try {
      const buf = await f.arrayBuffer();
      const meta = await readPdfMeta(buf);
      setFileName(f.name);
      setArrayBuffer(buf);
      setPageCount(meta.pageCount);
      toast.success(`已加载：${f.name}（${meta.pageCount} 页）`);
    } catch {
      toast.error("读取 PDF 失败：请确认文件未损坏或受密码保护。");
      setFileName(null);
      setArrayBuffer(null);
      setPageCount(null);
    } finally {
      setBusy(null);
    }
  }

  async function handleSplit() {
    if (!arrayBuffer || !pageCount || !fileName) {
      toast.error("请先上传一个 PDF。");
      return;
    }

    setBusy("拆分中…");
    try {
      if (mode === "range") {
        const ranges = parsePageRanges(rangeText, pageCount);
        const parts = await splitByRanges(arrayBuffer, ranges);
        setBusy("打包 zip…");
        const zipBlob = await zipPdfParts(parts, (r) => `${base}_p${r.start + 1}-${r.end + 1}.pdf`);
        downloadBlob(zipBlob, `${base}_ranges.zip`);
        toast.success("已生成 ranges.zip");
        return;
      }

      if (mode === "everyN") {
        const n = Number.parseInt(everyN, 10);
        if (!Number.isFinite(n) || n <= 0) {
          toast.error("请输入有效的 N（正整数）。");
          return;
        }
        const parts = await splitEveryN(arrayBuffer, pageCount, n);
        setBusy("打包 zip…");
        const zipBlob = await zipPdfParts(parts, (r) => `${base}_p${r.start + 1}-${r.end + 1}.pdf`);
        downloadBlob(zipBlob, `${base}_every${n}.zip`);
        toast.success("已生成 zip");
        return;
      }

      // single
      const parts = await splitSinglePages(arrayBuffer, pageCount);
      setBusy("打包 zip…");
      const zipBlob = await zipPdfParts(parts, (r) => `${base}_p${String(r.start + 1).padStart(3, "0")}.pdf`);
      downloadBlob(zipBlob, `${base}_single_pages.zip`);
      toast.success("已生成 single_pages.zip");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "拆分失败：可能是文件损坏或内存不足。";
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">拆分 PDF</h2>
          <p className="mt-1 text-sm text-zinc-300">
            上传 1 个 PDF，选择拆分方式后导出 zip。全程本地处理。
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <Dropzone
              accept="application/pdf"
              multiple={false}
              helperText={`单文件上限 ${FILE_LIMITS.maxFileMB}MB`}
              onFiles={handleFile}
            />
            <div className="mt-3 text-sm text-zinc-300">
              当前文件：{" "}
              <span className="font-medium text-zinc-50">
                {fileName ? fileName : "未选择"}
              </span>
              {pageCount ? (
                <span className="ml-2 text-zinc-400">({pageCount} 页)</span>
              ) : null}
            </div>
          </Card>

          <Card>
            <div className="grid gap-4">
              <RadioGroup<Mode>
                value={mode}
                onChange={setMode}
                options={[
                  { value: "range", label: "Range（按页范围）" },
                  { value: "everyN", label: "Every N（每 N 页）" },
                  { value: "single", label: "Single pages（单页）" },
                ]}
              />

              {mode === "range" ? (
                <div className="grid gap-2">
                  <div className="text-sm text-zinc-200">页范围（例：1-3,5,8-10）</div>
                  <Input
                    value={rangeText}
                    onChange={(e) => setRangeText(e.target.value)}
                    placeholder="1-3,5,8-10"
                    inputMode="text"
                    disabled={!!busy}
                  />
                  <div className="text-xs text-zinc-400">
                    规则：逗号分隔；支持单页与区间（含空格、反向区间）；校验越界与重叠。
                  </div>
                </div>
              ) : null}

              {mode === "everyN" ? (
                <div className="grid gap-2">
                  <div className="text-sm text-zinc-200">每 N 页拆一个</div>
                  <Input
                    value={everyN}
                    onChange={(e) => setEveryN(e.target.value)}
                    placeholder="例如 5"
                    inputMode="numeric"
                    disabled={!!busy}
                  />
                </div>
              ) : null}

              {mode === "single" ? (
                <div className="text-sm text-zinc-300">
                  将每一页单独输出为一个 PDF，并打包为 zip。
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
                  清空
                </Button>
                <Button disabled={!arrayBuffer || !!busy} onClick={handleSplit}>
                  导出 zip
                </Button>
              </div>
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

