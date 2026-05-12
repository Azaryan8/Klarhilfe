"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useI18n } from "@/context/I18nProvider";
import { FREE_LIMIT, getFreeRemaining } from "@/lib/usage";
import { useState } from "react";

export default function DashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  useEffect(() => {
    setRemaining(getFreeRemaining());
  }, [user]);

  useEffect(() => {
    const refresh = () => setRemaining(getFreeRemaining());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-surface2/60 p-8 shadow-gold backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{t.brand}</p>
        <h1 className="mt-2 font-display text-4xl text-cream">{t.dashboardWelcome}</h1>
        <p className="mt-2 text-muted">{t.dashboardSubtitle}</p>
        <p className="mt-4 text-sm text-muted">{user.email}</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-background p-6">
          <h2 className="font-display text-xl text-cream">{t.dashboardUsage}</h2>
          <p className="mt-4 font-display text-4xl text-gold">
            {remaining} / {FREE_LIMIT}
          </p>
          <p className="mt-2 text-sm text-muted">{t.dashboardUsageHint}</p>
        </div>
        <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-background p-6">
          <h2 className="font-display text-xl text-cream">{t.dashboardQuick}</h2>
          <Link
            href="/analyze"
            className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background transition hover:bg-gold-dim"
          >
            {t.dashboardAnalyzeCta}
          </Link>
          <p className="mt-4 text-sm text-muted">{t.dashboardCardAnalyzeDesc}</p>
        </div>
      </div>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted">{t.footerDisclaimer}</p>
    </div>
  );
}
