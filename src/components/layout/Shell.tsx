"use client";

import Link from "next/link";
import { useI18n } from "@/src/components/i18n/I18nProvider";
import { LanguageToggle } from "@/src/components/i18n/LanguageToggle";

export function Shell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {t("app.brand")}
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/merge"
                className="rounded-md px-2 py-1 text-zinc-200 hover:bg-white/10"
              >
                Merge
              </Link>
              <Link
                href="/split"
                className="rounded-md px-2 py-1 text-zinc-200 hover:bg-white/10"
              >
                Split
              </Link>
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 text-xs text-zinc-500">
        <div className="flex items-center justify-start">
          <div className="text-left">
            <span className="font-medium text-zinc-300">{t("footer.privacyLabel")}</span>
            <span className="ml-1 text-zinc-400">
              {t("footer.privacyText")}
              <Link
                href="/merge"
                className="ml-1 underline underline-offset-4 text-zinc-400 hover:text-zinc-200"
              >
                {t("footer.getStarted")}
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
