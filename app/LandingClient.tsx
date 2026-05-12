"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nProvider";
import { useAuth } from "@/context/AuthProvider";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl tracking-tight text-cream sm:text-4xl md:text-5xl">{children}</h2>
  );
}

export function LandingClient() {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 md:flex-row md:items-end md:justify-between md:py-28">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">{t.brand}</p>
            <h1 className="font-display text-4xl leading-tight text-cream sm:text-5xl md:text-6xl">{t.heroTitle}</h1>
            <p className="text-lg leading-relaxed text-muted md:text-xl">{t.heroSubtitle}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={user ? "/analyze" : "/login"}
                className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-background shadow-gold transition hover:bg-gold-dim"
              >
                {t.heroCtaPrimary}
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 text-sm font-medium text-cream transition hover:border-gold/50 hover:text-gold"
              >
                {t.heroCtaSecondary}
              </a>
            </div>
            <p className="text-xs leading-relaxed text-muted/90">{t.footerDisclaimer}</p>
          </div>
          <div className="grid w-full max-w-md grid-cols-3 gap-3 md:gap-4">
            {[
              { label: t.statDocs, value: t.statDocsVal },
              { label: t.statUsers, value: t.statUsersVal },
              { label: t.statLangs, value: t.statLangsVal },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-surface/60 p-4 text-center shadow-gold backdrop-blur"
              >
                <div className="font-display text-2xl text-gold">{s.value}</div>
                <div className="mt-1 text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle>{t.servicesTitle}</SectionTitle>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { title: t.service1Title, desc: t.service1Desc },
              { title: t.service2Title, desc: t.service2Desc },
              { title: t.service3Title, desc: t.service3Desc },
              { title: t.service4Title, desc: t.service4Desc },
            ].map((card) => (
              <article
                key={card.title}
                className="group rounded-2xl border border-white/10 bg-surface2/80 p-6 transition hover:border-gold/30 hover:shadow-gold"
              >
                <div className="h-px w-12 bg-gold/60 transition group-hover:w-20" />
                <h3 className="mt-4 font-display text-xl text-cream">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle>{t.howTitle}</SectionTitle>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", title: t.step1Title, desc: t.step1Desc },
              { n: "02", title: t.step2Title, desc: t.step2Desc },
              { n: "03", title: t.step3Title, desc: t.step3Desc },
            ].map((step) => (
              <li key={step.n} className="relative rounded-2xl border border-white/10 bg-background p-6">
                <span className="font-display text-sm text-gold/80">{step.n}</span>
                <h3 className="mt-2 font-display text-2xl text-cream">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="border-b border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle>{t.pricingTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-sm text-muted">{t.pricingNote}</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: t.tierFreeName,
                price: t.tierFreePrice,
                desc: t.tierFreeDesc,
                features: [t.tierFreeF1, t.tierFreeF2, t.tierFreeF3],
                highlight: true,
              },
              {
                name: t.tierPlusName,
                price: t.tierPlusPrice,
                desc: t.tierPlusDesc,
                features: [t.tierPlusF1, t.tierPlusF2, t.tierPlusF3],
              },
              {
                name: t.tierProName,
                price: t.tierProPrice,
                desc: t.tierProDesc,
                features: [t.tierProF1, t.tierProF2, t.tierProF3],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  tier.highlight
                    ? "border-gold/40 bg-gradient-to-b from-gold/10 to-surface2 shadow-gold"
                    : "border-white/10 bg-surface2/60"
                }`}
              >
                <h3 className="font-display text-2xl text-cream">{tier.name}</h3>
                <p className="mt-2 text-3xl font-semibold text-gold">{tier.price}</p>
                <p className="mt-2 text-sm text-muted">{tier.desc}</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm text-cream/90">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-gold">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className={`mt-8 inline-flex justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                    tier.highlight
                      ? "bg-gold text-background hover:bg-gold-dim"
                      : "border border-white/20 text-cream hover:border-gold/50"
                  }`}
                >
                  {user ? t.ctaBandButton : t.navLogin}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-surface via-background to-surface py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-3xl text-cream sm:text-4xl">{t.ctaBandTitle}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">{t.footerDisclaimer}</p>
          </div>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex rounded-full bg-cream px-8 py-3 text-sm font-semibold text-background transition hover:bg-gold"
          >
            {t.ctaBandButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
