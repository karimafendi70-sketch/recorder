"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { SlotContext } from "@/lib/scores";
import styles from "../../spot.module.css";

/* ── Props ────────────────────────────────────── */

export interface ForecastSurfHeightCardProps {
  daySlots: SlotContext[];
  sizeBandLabel?: string;
}

/* ── Helpers ──────────────────────────────────── */

function extractHeights(slots: SlotContext[]) {
  return slots
    .map((s) => (s.mergedSpot as Record<string, unknown> | undefined)?.golfHoogteMeter as number | undefined)
    .filter((h): h is number => h != null);
}

/* ── Component ────────────────────────────────── */

export function ForecastSurfHeightCard({ daySlots, sizeBandLabel }: ForecastSurfHeightCardProps) {
  const { t } = useLanguage();

  const heights = extractHeights(daySlots);
  if (heights.length === 0) return null;

  const minH = Math.min(...heights);
  const maxH = Math.max(...heights);
  const avgH = heights.reduce((a, b) => a + b, 0) / heights.length;

  return (
    <section className={styles.fcCard}>
      <header className={styles.fcCardHeader}>
        <h2 className={styles.fcCardTitle}>
          {t("forecast.cards.surfHeight" as TranslationKey)}
        </h2>
        {sizeBandLabel && (
          <span className={styles.fcCardBadge}>{sizeBandLabel}</span>
        )}
      </header>

      <div className={styles.fcCardStats}>
        <div className={styles.fcStat}>
          <span className={styles.fcStatValue}>{minH.toFixed(1)}</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.min" as TranslationKey)}</span>
        </div>
        <div className={`${styles.fcStat} ${styles.fcStatPrimary}`}>
          <span className={styles.fcStatValue}>{avgH.toFixed(1)}</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.avg" as TranslationKey)}</span>
        </div>
        <div className={styles.fcStat}>
          <span className={styles.fcStatValue}>{maxH.toFixed(1)}</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.max" as TranslationKey)}</span>
        </div>
      </div>

      <span className={styles.fcCardUnit}>m</span>
    </section>
  );
}
