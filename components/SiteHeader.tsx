"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthProvider";
import { useI18n } from "@/context/I18nProvider";

const navLink =
  "text-sm tracking-wide text-muted transition hover:text-cream relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:scale-x-0 after:bg-gold after:transition hover:after:scale-x-100";

export function SiteHeader() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const linkCls = (href: string) =>
    `${navLink} ${pathname === href ? "text-cream after:scale-x-100" : ""}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-tight text-cream sm:text-2xl">
          {t.brand}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link className={linkCls("/")} href="/">
            {t.navHome}
          </Link>
          {user ? (
            <>
              <Link className={linkCls("/dashboard")} href="/dashboard">
                {t.navDashboard}
              </Link>
              <Link className={linkCls("/analyze")} href="/analyze">
                {t.navAnalyze}
              </Link>
            </>
          ) : (
            <Link className={linkCls("/login")} href="/login">
              {t.navLogin}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          {user && (
            <button
              type="button"
              onClick={() => logout()}
              className="hidden text-sm text-muted hover:text-cream sm:inline"
            >
              {t.navLogout}
            </button>
          )}
          <LanguageSwitcher />
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-2 md:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 text-sm">
          <Link className={linkCls("/")} href="/">
            {t.navHome}
          </Link>
          {user ? (
            <>
              <Link className={linkCls("/dashboard")} href="/dashboard">
                {t.navDashboard}
              </Link>
              <Link className={linkCls("/analyze")} href="/analyze">
                {t.navAnalyze}
              </Link>
              <button type="button" onClick={() => logout()} className="text-muted">
                {t.navLogout}
              </button>
            </>
          ) : (
            <Link className={linkCls("/login")} href="/login">
              {t.navLogin}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
