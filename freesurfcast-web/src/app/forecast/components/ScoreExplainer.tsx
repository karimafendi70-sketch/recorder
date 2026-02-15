"use client";

import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type ScoreExplainerProps = {
  spotName: string;
  score: number;
  scoreClass: "high" | "medium" | "low";
  reasons: string[];
  waveHeight?: number;
  wavePeriod?: number;
  windDirection?: string;
  /** Condition indicator i18n keys (optional) */
  windKey?: TranslationKey;
  sizeKey?: TranslationKey;
  surfaceKey?: TranslationKey;
};

export function ScoreExplainer({
  spotName,
  score,
  scoreClass,
  reasons,
  waveHeight,
  wavePeriod,
  windDirection,
  windKey,
  sizeKey,
  surfaceKey,
}: ScoreExplainerProps) {
  const { t } = useLanguage();

  return (
    <div className={`${styles.explainerCard} ${styles[`explainer${capitalize(scoreClass)}`]}`}>
      <h3 className={styles.explainerTitle}>{t("forecast.whyTitle")}</h3>
      <p className={styles.explainerLead}>{t("forecast.whyLead")}</p>
      <p className={styles.explainerSpot}>
        <strong>{spotName}</strong> — {score.toFixed(1)} / 10
      </p>

      {(waveHeight != null || wavePeriod != null || windDirection != null) && (
        <div className={styles.explainerStats}>
          {waveHeight != null && (
            <span className={styles.explainerStat}>🌊 {waveHeight.toFixed(1)}m</span>
          )}
          {wavePeriod != null && (
            <span className={styles.explainerStat}>⏱ {wavePeriod}s</span>
          )}
          {windDirection != null && (
            <span className={styles.explainerStat}>💨 {windDirection}</span>
          )}
        </div>
      )}

      {/* Pro condition indicators */}
      {(windKey || sizeKey || surfaceKey) && (
        <div className={styles.conditionRow} style={{ marginTop: "0.5rem" }}>
          {sizeKey && (
            <span className={`${styles.condChip} ${styles.condChipSize}`}>
              {t("cond.label.size")}: {t(sizeKey)}
            </span>
          )}
          {windKey && (
            <span className={`${styles.condChip} ${styles.condChipWind}`}>
              {t("cond.label.wind")}: {t(windKey)}
            </span>
          )}
          {surfaceKey && (
            <span className={`${styles.condChip} ${styles.condChipSurface}`}>
              {t("cond.label.surface")}: {t(surfaceKey)}
            </span>
          )}
        </div>
      )}

      {reasons.length > 0 && (
        <ul className={styles.explainerReasons}>
          {reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
