"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { SlotContext } from "@/lib/scores";
import styles from "../../spot.module.css";

/* ── Helpers ──────────────────────────────────── */

function extractWind(slots: SlotContext[]) {
  return slots.map((s) => {
    const m = (s.mergedSpot ?? {}) as Record<string, unknown>;
    return {
      speed: m.windSpeedKnots as number | null | undefined,
      dir: m.windDirectionDeg as number | null | undefined,
    };
  });
}

function degToCompass(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

/* ── Props ────────────────────────────────────── */

export interface ForecastWindCardProps {
  daySlots: SlotContext[];
  windLabel?: string;
  surfaceLabel?: string;
}

/* ── Component ────────────────────────────────── */

export function ForecastWindCard({ daySlots, windLabel, surfaceLabel }: ForecastWindCardProps) {
  const { t } = useLanguage();

  const data = extractWind(daySlots);
  const speeds = data.map((d) => d.speed).filter((s): s is number => s != null);
  const dirs = data.map((d) => d.dir).filter((d): d is number => d != null);

  if (speeds.length === 0) return null;

  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const maxSpeed = Math.max(...speeds);
  const avgDir = dirs.length > 0 ? dirs.reduce((a, b) => a + b, 0) / dirs.length : null;

  return (
    <section className={styles.fcCard}>
      <header className={styles.fcCardHeader}>
        <h2 className={styles.fcCardTitle}>
          {t("forecast.cards.wind" as TranslationKey)}
        </h2>
        {windLabel && (
          <span className={styles.fcCardBadge}>{windLabel}</span>
        )}
      </header>

      <div className={styles.fcCardStats}>
        <div className={`${styles.fcStat} ${styles.fcStatPrimary}`}>
          <span className={styles.fcStatValue}>{avgSpeed.toFixed(0)}</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.avg" as TranslationKey)}</span>
        </div>
        <div className={styles.fcStat}>
          <span className={styles.fcStatValue}>{maxSpeed.toFixed(0)}</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.gust" as TranslationKey)}</span>
        </div>
        {avgDir != null && (
          <div className={styles.fcStat}>
            <span className={styles.fcStatValue}>{degToCompass(avgDir)}</span>
            <span className={styles.fcStatLabel}>{t("forecast.cards.dir" as TranslationKey)}</span>
          </div>
        )}
      </div>

      <div className={styles.fcCardFooter}>
        <span className={styles.fcCardUnit}>kn</span>
        {surfaceLabel && (
          <span className={styles.fcCardChip}>{surfaceLabel}</span>
        )}
      </div>
    </section>
  );
}
