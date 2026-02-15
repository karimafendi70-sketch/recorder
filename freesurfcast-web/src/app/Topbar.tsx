"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLanguage, type TranslationKey } from "./LanguageProvider";
import { SpotSearch } from "./components/SpotSearch";

const NAV_ITEMS: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/discover", labelKey: "nav.discover" },
  { href: "/forecast", labelKey: "nav.forecast" },
  { href: "/map", labelKey: "nav.map" },
  { href: "/insights", labelKey: "nav.insights" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/trip", labelKey: "nav.trip" },
  { href: "/profile", labelKey: "nav.profile" },
];

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="topbar-wrap">
      <div className="topbar">
        <div className="brand-block">
          <div className="logo-circle" aria-hidden>
            FS
          </div>
          <p className="brand-title">FreeSurfCast</p>
        </div>

        {/* ── Compact spot search ── */}
        <SpotSearch compact />

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href} className={isActive ? "nav-link active" : "nav-link"}>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="auth-indicator">
          <Link href="/settings" className="topbar-settings-btn" aria-label="Settings" title={t("settings.title" as TranslationKey)}>
            ⚙
          </Link>
          {user ? (
            <span className="avatar-chip" title={user.email}>
              {user.email.charAt(0).toUpperCase()}
            </span>
          ) : (
            <Link href="/login" className="btn btn-ghost btn-sm">
              {t("nav.login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
