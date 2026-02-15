"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { getSpotById } from "@/lib/spots/catalog";
import { useFavorites } from "@/app/FavoritesProvider";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../spot.module.css";

/* ── Sub-tab definitions ─────────────────────── */

interface SubTab {
  key: string;
  labelKey: TranslationKey;
  segment: string;          // URL segment appended to /spot/[id]/
  enabled: boolean;
}

const SUB_TABS: SubTab[] = [
  { key: "forecast",  labelKey: "spot.tabs.forecast",  segment: "forecast",  enabled: true },
  { key: "sessions",  labelKey: "spot.tabs.sessions",  segment: "sessions",  enabled: true },
  { key: "live",      labelKey: "spot.tabs.live",      segment: "live",      enabled: false },
  { key: "analysis",  labelKey: "spot.tabs.analysis",  segment: "analysis",  enabled: false },
  { key: "charts",    labelKey: "spot.tabs.charts",    segment: "charts",    enabled: false },
];

/* ── Component ───────────────────────────────── */

export default function SpotLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ spotId: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite, addRecent } = useFavorites();

  const spotId = params.spotId;
  const spot = getSpotById(spotId);

  if (!spot) {
    return (
      <section className="stack-lg">
        <p>Spot not found.</p>
      </section>
    );
  }

  const isFav = isFavorite(spotId);

  // Active sub-tab detection
  const activeSegment = SUB_TABS.find((tab) =>
    pathname.endsWith(`/${tab.segment}`) || pathname.includes(`/${tab.segment}/`),
  )?.key ?? "forecast";

  function handleTabClick(tab: SubTab) {
    if (!tab.enabled) return;
    addRecent(spotId);
    router.push(`/spot/${spotId}/${tab.segment}`);
  }

  return (
    <section className="stack-lg">
      {/* ── Spot Header ── */}
      <header className={styles.spotHeader}>
        <div className={styles.spotHeaderTopRow}>
          <div>
            <h1 className={styles.spotName}>{spot.name}</h1>
            <p className={styles.spotCountry}>{spot.country}</p>
          </div>
          <button
            type="button"
            className={styles.spotFavBtn}
            aria-label={isFav ? "Remove favorite" : "Add favorite"}
            onClick={() => toggleFavorite(spotId)}
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>

        <div className={styles.spotTags}>
          <span className={styles.spotTag}>{spot.spotType}</span>
          <span className={styles.spotTag}>{spot.orientation}</span>
          <span className={styles.spotTag}>{spot.difficultyTag}</span>
        </div>
      </header>

      {/* ── Sub-tab bar ── */}
      <nav className={styles.subTabBar} aria-label="Spot sections">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`${styles.subTab} ${tab.key === activeSegment ? styles.subTabActive : ""} ${!tab.enabled ? styles.subTabDisabled : ""}`}
            onClick={() => handleTabClick(tab)}
            disabled={!tab.enabled}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </nav>

      {/* ── Child page (forecast / live / …) ── */}
      {children}
    </section>
  );
}
