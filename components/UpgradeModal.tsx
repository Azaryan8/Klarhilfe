"use client";

import { useI18n } from "@/context/I18nProvider";

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-gold/30 bg-surface2 p-6 shadow-gold"
      >
        <h2 className="font-display text-2xl text-cream">{t.upgradeTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t.upgradeBody}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-gold/40 bg-gold/10 py-3 text-sm font-medium text-gold transition hover:bg-gold/20"
        >
          {t.upgradeClose}
        </button>
      </div>
    </div>
  );
}
