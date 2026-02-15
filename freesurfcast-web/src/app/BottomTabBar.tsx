"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, type TranslationKey } from "./LanguageProvider";

/* ── Tab definitions ─────────────────────────── */

interface TabDef {
  href: string;
  labelKey: TranslationKey;
  icon: string; // emoji for now — swap for SVG icons later
}

const TABS: TabDef[] = [
  { href: "/",          labelKey: "tab.home",      icon: "🏠" },
  { href: "/discover",  labelKey: "tab.discover",   icon: "🔍" },
  { href: "/forecast",  labelKey: "tab.forecast",   icon: "🌊" },
  { href: "/map",       labelKey: "tab.map",        icon: "🗺️" },
  { href: "/insights",  labelKey: "tab.insights",   icon: "📊" },
  { href: "/compare",   labelKey: "tab.compare",    icon: "⚖️" },
  { href: "/trip",      labelKey: "tab.trip",       icon: "✈️" },
  { href: "/settings",  labelKey: "tab.settings",   icon: "⚙️" },
];

/* ── Component ───────────────────────────────── */

export function BottomTabBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="bottom-tabs" aria-label="Main navigation">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href) ||
              (tab.href === "/forecast" && pathname.startsWith("/spot/"));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`bottom-tab ${isActive ? "bottom-tab-active" : ""}`}
          >
            <span className="bottom-tab-icon" aria-hidden>{tab.icon}</span>
            <span className="bottom-tab-label">{t(tab.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
