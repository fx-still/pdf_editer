"use client";

import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MESSAGES,
  resolveMessage,
  type Locale,
  type MessageKey,
  type MessageParams,
} from "@/src/lib/i18n/messages";

const STORAGE_KEY = "pdf-toolkit.locale";

type I18nApi = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, params?: MessageParams) => string;
  /** Like `t`, but placeholders can be filled with React nodes. */
  rich: (key: MessageKey, params: Record<string, React.ReactNode>) => React.ReactNode;
};

const I18nContext = createContext<I18nApi | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = MESSAGES[locale]["app.title"];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const api = useMemo<I18nApi>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => resolveMessage(locale, key, params),
      rich: (key, params) =>
        MESSAGES[locale][key].split(/(\{\w+\})/).map((part, i) => {
          const name = part.match(/^\{(\w+)\}$/)?.[1];
          return <Fragment key={i}>{name && name in params ? params[name] : part}</Fragment>;
        }),
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider missing");
  return ctx;
}
