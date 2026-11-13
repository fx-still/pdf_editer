"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { useI18n } from "@/src/components/i18n/I18nProvider";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Dropzone({
  accept,
  multiple,
  helperText,
  onFiles,
}: {
  accept: string;
  multiple: boolean;
  helperText?: string;
  onFiles: (files: File[]) => void | Promise<void>;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const { t } = useI18n();

  const pick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div
      className={cx(
        "rounded-xl border border-dashed p-4 transition",
        dragging ? "border-white/40 bg-white/10" : "border-white/15 bg-white/5"
      )}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) void onFiles(files);
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium">{t("dropzone.title")}</div>
          <div className="mt-1 text-xs text-zinc-400">
            {t("dropzone.hint")}{helperText ? ` · ${helperText}` : ""}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={pick}>
            {t("dropzone.pick")}
          </Button>
        </div>
      </div>

      <input
        id={inputId}
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = "";
          if (files.length) void onFiles(files);
        }}
      />
    </div>
  );
}

