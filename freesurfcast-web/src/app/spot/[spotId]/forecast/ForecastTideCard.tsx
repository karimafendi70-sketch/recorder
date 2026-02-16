"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { SlotContext } from "@/lib/scores";
import styles from "../../spot.module.css";

/* ── Props ────────────────────────────────────── */

export interface ForecastTideCardProps {
  daySlots: SlotContext[];
}

/* ── Component ────────────────────────────────── */

export function ForecastTideCard({ daySlots }: ForecastTideCardProps) {
  const { t } = useLanguage();

  // Collect tide suitability from slot-level tags
  const tideSlots = daySlots
    .filter((s) => s.tideSuitability != null)
    .map((s) => ({
      label: s.offsetHours != null ? `${String(s.offsetHours).padStart(2, "0")}:00` : "–",
      suit: s.tideSuitability as string,
    }));

  if (tideSlots.length === 0) return null;

  const goodCount = tideSlots.filter((s) => s.suit === "good").length;
  const totalCount = tideSlots.length;
  const pct = Math.round((goodCount / totalCount) * 100);

  return (
    <section className={styles.fcCard}>
      <header className={styles.fcCardHeader}>
        <h2 className={styles.fcCardTitle}>
          {t("forecast.cards.tide" as TranslationKey)}
        </h2>
      </header>

      <div className={styles.tideMain}>
        <div className={styles.tideBar}>
          <div
            className={styles.tideBarFill}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.tidePct}>
          {pct}% {t("forecast.cards.tideGood" as TranslationKey)}
        </span>
      </div>

      <div className={styles.tideDots}>
        {tideSlots.map((s, i) => (
          <span
            key={i}
            className={`${styles.tideDot} ${s.suit === "good" ? styles.tideDotGood : styles.tideDotFair}`}
            title={`${s.label} — ${s.suit}`}
          />
        ))}
      </div>
    </section>
  );
}
