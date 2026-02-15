"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLanguage, SUPPORTED_LANGS, LANG_LABELS, type Lang, type TranslationKey } from "./LanguageProvider";

const NAV_ITEMS: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/discover", labelKey: "nav.discover" },
  { href: "/forecast", labelKey: "nav.forecast" },
  { href: "/map", labelKey: "nav.map" },
  { href: "/insights", labelKey: "nav.insights" },
  { href: "/profile", labelKey: "nav.profile" },
];

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="topbar-wrap">
      <div className="topbar">
        <div className="brand-block">
          <div className="logo-circle" aria-hidden>
            FS
          </div>
          <div>
            <p className="brand-title">FreeSurfCast</p>
            <p className="brand-subtitle">Coastal forecast intelligence</p>
          </div>
        </div>

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
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label="Select language"
          >
            {SUPPORTED_LANGS.map((l) => (
              <option key={l} value={l}>
                {LANG_LABELS[l]}
              </option>
            ))}
          </select>

          {!user ? (
            <Link href="/login" className="btn btn-ghost">
              {t("nav.login")}
            </Link>
          ) : (
            <div className="user-menu">
              <span className="avatar-chip" title={user.email}>
                {user.email.charAt(0).toUpperCase()}
              </span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                {t("nav.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
