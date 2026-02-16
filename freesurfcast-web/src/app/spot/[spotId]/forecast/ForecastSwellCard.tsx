"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { SlotContext } from "@/lib/scores";
import styles from "../../spot.module.css";

/* ── Helpers ──────────────────────────────────── */

function degToCompass(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function extractSwell(slots: SlotContext[]) {
  return slots.map((s) => {
    const m = (s.mergedSpot ?? {}) as Record<string, unknown>;
    return {
      height: (m.swellHeight ?? m.golfHoogteMeter) as number | null | undefined,
      period: (m.swellPeriod ?? m.golfPeriodeSeconden) as number | null | undefined,
      dir: (m.swellDirection ?? m.waveDirection) as number | null | undefined,
    };
  });
}

/* ── Props ────────────────────────────────────── */

export interface ForecastSwellCardProps {
  daySlots: SlotContext[];
}

/* ── Component ────────────────────────────────── */

export function ForecastSwellCard({ daySlots }: ForecastSwellCardProps) {
  const { t } = useLanguage();

  const data = extractSwell(daySlots);
  const heights = data.map((d) => d.height).filter((h): h is number => h != null);
  const periods = data.map((d) => d.period).filter((p): p is number => p != null);
  const dirs = data.map((d) => d.dir).filter((d): d is number => d != null);

  if (heights.length === 0 && periods.length === 0) return null;

  const avgH = heights.length > 0 ? heights.reduce((a, b) => a + b, 0) / heights.length : null;
  const avgP = periods.length > 0 ? periods.reduce((a, b) => a + b, 0) / periods.length : null;
  const avgDir = dirs.length > 0 ? dirs.reduce((a, b) => a + b, 0) / dirs.length : null;

  return (
    <section className={styles.fcCard}>
      <header className={styles.fcCardHeader}>
        <h2 className={styles.fcCardTitle}>
          {t("forecast.cards.swell" as TranslationKey)}
        </h2>
      </header>

      <div className={styles.fcCardStats}>
        {avgH != null && (
          <div className={`${styles.fcStat} ${styles.fcStatPrimary}`}>
            <span className={styles.fcStatValue}>{avgH.toFixed(1)}<small>m</small></span>
            <span className={styles.fcStatLabel}>{t("forecast.cards.height" as TranslationKey)}</span>
          </div>
        )}
        {avgP != null && (
          <div className={styles.fcStat}>
            <span className={styles.fcStatValue}>{avgP.toFixed(0)}<small>s</small></span>
            <span className={styles.fcStatLabel}>{t("forecast.cards.period" as TranslationKey)}</span>
          </div>
        )}
        {avgDir != null && (
          <div className={styles.fcStat}>
            <span className={styles.fcStatValue}>{degToCompass(avgDir)}</span>
            <span className={styles.fcStatLabel}>{t("forecast.cards.dir" as TranslationKey)}</span>
          </div>
        )}
      </div>
    </section>
  );
}
