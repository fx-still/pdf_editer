"use client";

import { Shell } from "@/src/components/layout/Shell";
import { Card } from "@/src/components/ui/Card";
import { ButtonLink } from "@/src/components/ui/Button";
import { useI18n } from "@/src/components/i18n/I18nProvider";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <Shell>
      <div className="mx-auto w-full max-w-xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("app.title")}
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            {t("app.tagline")}
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-medium">{t("home.mergeTitle")}</div>
                <div className="mt-1 text-sm text-zinc-300">
                  {t("home.mergeDesc")}
                </div>
              </div>
              <ButtonLink href="/merge">{t("home.enter")}</ButtonLink>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-medium">{t("home.splitTitle")}</div>
                <div className="mt-1 text-sm text-zinc-300">
                  {t("home.splitDesc")}
                </div>
              </div>
              <ButtonLink href="/split">{t("home.enter")}</ButtonLink>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
