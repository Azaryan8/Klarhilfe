"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useI18n } from "@/context/I18nProvider";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Spinner } from "@/components/Spinner";
import { canAnalyzeFree, incrementUsage } from "@/lib/usage";
import { extractTextFromPdf } from "@/lib/extractPdfText";
import type { Locale } from "@/lib/i18n";

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result;
      if (typeof res !== "string") {
        reject(new Error("read"));
        return;
      }
      const i = res.indexOf(",");
      resolve(i >= 0 ? res.slice(i + 1) : res);
    };
    reader.onerror = () => reject(reader.error ?? new Error("read"));
    reader.readAsDataURL(file);
  });
}

export default function AnalyzePage() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();

  const [explainLocale, setExplainLocale] = useState<Locale>(locale);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    setExplainLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setError(null);
    setResult(null);
  };

  const analyze = async () => {
    if (!user) return;
    setError(null);
    setResult(null);

    if (!canAnalyzeFree()) {
      setUpgradeOpen(true);
      return;
    }

    let documentText = text.trim();
    let imageBase64: string | undefined;
    let mediaType: string | undefined;

    try {
      if (file) {
        const type = file.type;
        if (type === "application/pdf") {
          const extracted = (await extractTextFromPdf(file)).trim();
          const userNotes = text.trim();
          documentText = [extracted, userNotes].filter(Boolean).join("\n\n---\n\n");
          if (!documentText) {
            setError(t.errorPdf);
            return;
          }
        } else if (IMAGE_TYPES.has(type)) {
          imageBase64 = await fileToBase64(file);
          mediaType = type;
          if (!documentText) {
            documentText = "Please analyze the attached German official document image.";
          }
        } else {
          setError(t.errorImage);
          return;
        }
      }
    } catch {
      setError(t.errorPdf);
      return;
    }

    if (!documentText && !imageBase64) {
      setError(t.errorNoInput);
      return;
    }

    if (documentText.length > 100_000) {
      documentText = documentText.slice(0, 100_000);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale: explainLocale,
          documentText,
          imageBase64,
          mediaType,
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string; details?: string };
      if (!res.ok) {
        setError(data.details || data.error || t.errorApi);
        return;
      }
      if (!data.text) {
        setError(t.errorApi);
        return;
      }
      incrementUsage();
      setResult(data.text);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{t.brand}</p>
        <h1 className="font-display text-4xl text-cream">{t.analyzeTitle}</h1>
        <p className="text-sm leading-relaxed text-muted">{t.analyzeIntro}</p>
      </header>

      <div className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-surface2/70 p-6 shadow-gold backdrop-blur sm:p-8">
        <div>
          <label className="text-xs uppercase tracking-wider text-gold/90">{t.analyzeUpload}</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/webp,image/gif"
              onChange={onPickFile}
              className="text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-gold/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold hover:file:bg-gold/25"
            />
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs text-gold underline-offset-4 hover:underline"
              >
                {t.analyzeClearFile}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-gold/90">{t.analyzeOr}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={t.analyzePlaceholder}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm leading-relaxed text-cream outline-none ring-gold/30 focus:ring-2"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-gold/90">{t.analyzeLanguage}</label>
          <select
            value={explainLocale}
            onChange={(e) => setExplainLocale(e.target.value as Locale)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-cream outline-none ring-gold/30 focus:ring-2 sm:max-w-xs"
          >
            <option value="ru">{t.langRu}</option>
            <option value="en">{t.langEn}</option>
            <option value="de">{t.langDe}</option>
            <option value="ar">{t.langAr}</option>
          </select>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void analyze()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-background transition enabled:hover:bg-gold-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading ? t.analyzeLoading : t.analyzeSubmit}
        </button>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <p className="text-xs leading-relaxed text-muted">{t.footerDisclaimer}</p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-background/80 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-cream">{t.analyzeResultTitle}</h2>
        <div className="prose prose-invert mt-4 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-cream/90">
          {result ?? <span className="text-muted">{t.analyzeEmpty}</span>}
        </div>
      </section>
    </div>
  );
}
