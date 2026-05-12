"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n";
import { getMessages, type Messages } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "klarhilfe_locale";

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "en" || v === "de" || v === "ru" || v === "ar") return v;
  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang =
      locale === "ar" ? "ar" : locale === "de" ? "de" : locale === "ru" ? "ru" : "en";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: getMessages(locale),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
