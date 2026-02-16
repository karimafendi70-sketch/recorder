"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { SlotContext } from "@/lib/scores";
import styles from "../../spot.module.css";

/* ── Props ────────────────────────────────────── */

export interface ForecastTemperatureCardProps {
  daySlots: SlotContext[];
}

/* ── Component ────────────────────────────────── */

export function ForecastTemperatureCard({ daySlots }: ForecastTemperatureCardProps) {
  const { t } = useLanguage();

  const temps = daySlots
    .map((s) => (s.mergedSpot as Record<string, unknown> | undefined)?.temperature as number | null | undefined)
    .filter((v): v is number => v != null);

  if (temps.length === 0) return null;

  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const avgT = temps.reduce((a, b) => a + b, 0) / temps.length;

  return (
    <section className={styles.fcCard}>
      <header className={styles.fcCardHeader}>
        <h2 className={styles.fcCardTitle}>
          {t("forecast.cards.temperature" as TranslationKey)}
        </h2>
      </header>

      <div className={styles.fcCardStats}>
        <div className={styles.fcStat}>
          <span className={styles.fcStatValue}>{minT.toFixed(0)}°</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.min" as TranslationKey)}</span>
        </div>
        <div className={`${styles.fcStat} ${styles.fcStatPrimary}`}>
          <span className={styles.fcStatValue}>{avgT.toFixed(0)}°</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.avg" as TranslationKey)}</span>
        </div>
        <div className={styles.fcStat}>
          <span className={styles.fcStatValue}>{maxT.toFixed(0)}°</span>
          <span className={styles.fcStatLabel}>{t("forecast.cards.max" as TranslationKey)}</span>
        </div>
      </div>

      <span className={styles.fcCardUnit}>°C</span>
    </section>
  );
}
