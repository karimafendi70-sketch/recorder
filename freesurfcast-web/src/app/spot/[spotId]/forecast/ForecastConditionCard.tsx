"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Rating colour map ───────────────────────── */

const RATING_COLORS: Record<string, string> = {
  epic: "#00acc1",
  goodToEpic: "#26a69a",
  good: "#43a047",
  fairToGood: "#c0ca33",
  fair: "#fdd835",
  poorToFair: "#fb8c00",
  poor: "#e53935",
};

/* ── Props ────────────────────────────────────── */

export interface ForecastConditionCardProps {
  ratingBucket: string;
  ratingLabel: string;
  avgScore: number;
  summaryText?: string;
}

/* ── Component ────────────────────────────────── */

export function ForecastConditionCard({
  ratingBucket,
  ratingLabel,
  avgScore,
  summaryText,
}: ForecastConditionCardProps) {
  const { t } = useLanguage();
  const color = RATING_COLORS[ratingBucket] ?? RATING_COLORS.poor;

  return (
    <section className={styles.fcCard}>
      <header className={styles.fcCardHeader}>
        <h2 className={styles.fcCardTitle}>
          {t("forecast.cards.condition" as TranslationKey)}
        </h2>
      </header>

      <div className={styles.conditionMain}>
        {/* Score badge */}
        <span className={styles.conditionScore} style={{ background: color }}>
          {avgScore.toFixed(1)}
        </span>

        {/* Rating label + bar */}
        <div className={styles.conditionBody}>
          <span className={styles.conditionLabel} style={{ color }}>
            {ratingLabel}
          </span>
          <div className={styles.conditionBar}>
            <div
              className={styles.conditionBarFill}
              style={{ width: `${Math.min(avgScore * 10, 100)}%`, background: color }}
            />
          </div>
        </div>
      </div>

      {summaryText && (
        <p className={styles.conditionSummary}>
          <em>{summaryText}</em>
        </p>
      )}
    </section>
  );
}
