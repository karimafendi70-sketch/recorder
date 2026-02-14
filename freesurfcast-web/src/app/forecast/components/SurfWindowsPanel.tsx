"use client";

import type { SurfWindow } from "@/lib/forecast/surfWindows";
import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type Props = {
  windows: SurfWindow[];
};

const CONDITION_KEY: Record<string, TranslationKey> = {
  clean: "surfWindows.condClean",
  mixed: "surfWindows.condMixed",
  choppy: "surfWindows.condChoppy",
};

function capitalize(value: "high" | "medium" | "low") {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

export function SurfWindowsPanel({ windows }: Props) {
  const { t } = useLanguage();

  if (windows.length === 0) {
    return (
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("surfWindows.title")}</h2>
          <p>{t("surfWindows.subtitle")}</p>
        </div>
        <p className={styles.noWindows}>{t("surfWindows.none")}</p>
      </section>
    );
  }

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>{t("surfWindows.title")}</h2>
        <p>{t("surfWindows.subtitle")}</p>
      </div>

      <div className={styles.windowsGrid}>
        {windows.map((win, i) => (
          <article
            key={`${win.spotId}-${win.startHour}-${i}`}
            className={`${styles.windowCard} ${styles[`slotCard${capitalize(win.scoreClass)}`]}`}
          >
            <div className={styles.windowTopRow}>
              <span className={styles.windowTime}>
                {win.startLabel} – {win.endLabel}
              </span>
              <span
                className={`${styles.scoreBadge} ${styles[`score${capitalize(win.scoreClass)}`]}`}
              >
                {win.scoreClass}
              </span>
            </div>

            <p className={styles.windowScore}>
              {win.averageScore.toFixed(1)} / 10
              <span className={styles.windowPeak}>
                {t("surfWindows.peak")} {win.peakScore.toFixed(1)}
              </span>
            </p>

            <div className={styles.windowMeta}>
              {win.waveHeight != null && (
                <span className={styles.windowChip}>
                  {win.waveHeight}m
                </span>
              )}
              <span className={styles.windowChip}>
                {t(CONDITION_KEY[win.condition] ?? "surfWindows.condMixed")}
              </span>
              <span className={styles.windowChip}>
                {win.slotCount} {win.slotCount === 1 ? "slot" : "slots"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
