"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useI18n } from "@/context/I18nProvider";

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-surface2/80 p-8 shadow-gold backdrop-blur">
        <h1 className="font-display text-3xl text-cream">{t.loginTitle}</h1>
        <p className="mt-2 text-sm text-muted">{t.loginSubtitle}</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gold/90">{t.loginEmail}</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-cream outline-none ring-gold/40 focus:ring-2"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gold/90">{t.loginPassword}</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-cream outline-none ring-gold/40 focus:ring-2"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-gold py-3 text-sm font-semibold text-background transition hover:bg-gold-dim"
          >
            {t.loginSubmit}
          </button>
        </form>
        <p className="mt-4 text-xs text-muted">{t.loginDemo}</p>
      </div>
    </div>
  );
}
