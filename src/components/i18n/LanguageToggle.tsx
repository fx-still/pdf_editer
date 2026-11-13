"use client";

import type { Locale } from "@/src/lib/i18n/messages";
import { useI18n } from "./I18nProvider";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const OPTIONS: Array<{ value: Locale; label: string }> = [
  { value: "en", label: "Eng" },
  { value: "zh", label: "中文" },
];

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("lang.switch")}
      className="flex items-center rounded-md border border-white/10 bg-white/5 p-0.5 text-xs"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={locale === opt.value}
          onClick={() => setLocale(opt.value)}
          className={cx(
            "rounded px-2 py-0.5 transition",
            locale === opt.value
              ? "bg-white/15 font-medium text-zinc-50"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
