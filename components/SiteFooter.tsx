"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nProvider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/10 bg-surface py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{t.footerDisclaimer}</p>
        <div className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-cream">{t.brand}</span>
          <span>
            © {new Date().getFullYear()} {t.brand}. {t.footerRights}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/#pricing" className="text-gold hover:underline">
            {t.pricingTitle}
          </Link>
          <Link href="/analyze" className="text-gold hover:underline">
            {t.navAnalyze}
          </Link>
          <Link href="/login" className="text-gold hover:underline">
            {t.navLogin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
