"use client";

import type { Locale } from "@/lib/i18n";
import { useI18n } from "@/context/I18nProvider";

const FLAGS: Record<Locale, string> = {
  ru: "🇷🇺",
  en: "🇬🇧",
  de: "🇩🇪",
  ar: "🇸🇦",
};

const ORDER: Locale[] = ["ru", "en", "de", "ar"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-gold/25 bg-surface/80 p-1 shadow-gold backdrop-blur"
      role="group"
      aria-label="Language"
    >
      {ORDER.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          title={
            code === "ru"
              ? t.langRu
              : code === "de"
                ? t.langDe
                : code === "ar"
                  ? t.langAr
                  : t.langEn
          }
          className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
            locale === code
              ? "bg-gold/20 text-cream ring-1 ring-gold/50"
              : "text-muted hover:bg-white/5 hover:text-cream"
          }`}
        >
          <span aria-hidden>{FLAGS[code]}</span>
          <span className="sr-only">
            {code === "ru"
              ? t.langRu
              : code === "de"
                ? t.langDe
                : code === "ar"
                  ? t.langAr
                  : t.langEn}
          </span>
        </button>
      ))}
    </div>
  );
}
