"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useLanguage, type TranslationKey } from "./LanguageProvider";
import { useFeatureFlags } from "./FeatureFlagsProvider";

/* ── Tab definitions ─────────────────────────── */

interface TabDef {
  href: string;
  labelKey: TranslationKey;
  icon: string; // emoji for now — swap for SVG icons later
  /** Optional feature-flag key — tab hidden when flag is false */
  flagKey?: "enableDiscover" | "enableCompare" | "enableTrip" | "enableProfileInsights";
}

const ALL_TABS: TabDef[] = [
  { href: "/",          labelKey: "tab.home",      icon: "🏠" },
  { href: "/discover",  labelKey: "tab.discover",  icon: "🔍",  flagKey: "enableDiscover" },
  { href: "/forecast",  labelKey: "tab.forecast",  icon: "🌊" },
  { href: "/map",       labelKey: "tab.map",       icon: "🗺️" },
  { href: "/insights",  labelKey: "tab.insights",  icon: "📊",  flagKey: "enableProfileInsights" },
  { href: "/compare",   labelKey: "tab.compare",   icon: "⚖️",  flagKey: "enableCompare" },
  { href: "/trip",      labelKey: "tab.trip",      icon: "✈️",  flagKey: "enableTrip" },
  { href: "/settings",  labelKey: "tab.settings",  icon: "⚙️" },
];

/* ── Component ───────────────────────────────── */

export function BottomTabBar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { flags } = useFeatureFlags();

  const visibleTabs = useMemo(
    () => ALL_TABS.filter((tab) => !tab.flagKey || flags[tab.flagKey]),
    [flags],
  );

  return (
    <nav className="bottom-tabs" aria-label="Main navigation">
      {visibleTabs.map((tab) => {
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
