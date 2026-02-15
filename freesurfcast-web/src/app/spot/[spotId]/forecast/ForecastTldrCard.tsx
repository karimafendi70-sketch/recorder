"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

export interface TldrCardProps {
  avgScore: number;
  ratingLabel: string;
  ratingColor: string;
  /** Wave height range — metres */
  minHeight: number;
  maxHeight: number;
  /** i18n-translated size band, e.g. "Knee-to-waist" */
  sizeBandLabel?: string;
  /** Formatted best-window label, e.g. "9:00 AM – 2:00 PM" */
  bestWindowLabel?: string;
  /** Translated wind comfort, e.g. "Offshore" */
  windLabel?: string;
  /** Translated surface quality, e.g. "Glassy" */
  surfaceLabel?: string;
}

/* ── Component ───────────────────────────────── */

export function ForecastTldrCard({
  avgScore,
  ratingLabel,
  ratingColor,
  minHeight,
  maxHeight,
  sizeBandLabel,
  bestWindowLabel,
  windLabel,
  surfaceLabel,
}: TldrCardProps) {
  const { t } = useLanguage();

  const scoreClass =
    avgScore >= 7 ? "High" : avgScore >= 4.5 ? "Medium" : "Low";

  return (
    <div className={styles.tldrCard}>
      {/* ── Left: rating badge ── */}
      <div className={styles.tldrRating}>
        <span
          className={`${styles.tldrScoreBadge} ${styles[`tldrScore${scoreClass}`]}`}
          style={{ borderColor: ratingColor }}
        >
          {avgScore.toFixed(1)}
        </span>
        <span className={styles.tldrRatingLabel} style={{ color: ratingColor }}>
          {ratingLabel}
        </span>
      </div>

      {/* ── Right: key facts ── */}
      <div className={styles.tldrFacts}>
        {/* Wave size */}
        <p className={styles.tldrFact}>
          <span className={styles.tldrFactIcon}>🌊</span>
          <span>
            {minHeight.toFixed(1)}–{maxHeight.toFixed(1)} m
          </span>
          {sizeBandLabel && (
            <span className={styles.tldrFactSub}>{sizeBandLabel}</span>
          )}
        </p>

        {/* Best window */}
        {bestWindowLabel && (
          <p className={styles.tldrFact}>
            <span className={styles.tldrFactIcon}>🕐</span>
            <span>{bestWindowLabel}</span>
          </p>
        )}

        {/* Condition chips */}
        {(windLabel || surfaceLabel) && (
          <div className={styles.tldrChips}>
            {windLabel && (
              <span className={styles.tldrChip}>💨 {windLabel}</span>
            )}
            {surfaceLabel && (
              <span className={styles.tldrChip}>🪟 {surfaceLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
