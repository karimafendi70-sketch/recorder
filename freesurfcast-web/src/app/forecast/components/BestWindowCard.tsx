"use client";

import { useMemo } from "react";
import type { DayBestWindow } from "@/lib/forecast/dayWindows";
import type { SurfWindow } from "@/lib/forecast/surfWindows";
import {
  getSizeBand,
  getWindComfort,
  getSurfaceQuality,
} from "@/lib/forecast/conditions";
import type { SlotContext } from "@/lib/scores";
import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

/* ── Props ───────────────────────────────────── */

type Props = {
  best: DayBestWindow;
  /** Optional second-best window for the same day */
  runnerUp?: SurfWindow | null;
  dayLabel: string;
};

/* ── Helpers ──────────────────────────────────── */

function windowToSlotCtx(win: SurfWindow): SlotContext {
  return {
    conditionTag: win.condition,
    mergedSpot: {
      golfHoogteMeter: win.waveHeight ?? 0,
      windDirectionDeg: win.windDirection ?? 0,
      coastOrientationDeg: 0,
      windSpeedKnots: 0,
    },
  };
}

function scoreClass(avg: number): "high" | "medium" | "low" {
  if (avg >= 7) return "high";
  if (avg >= 4.5) return "medium";
  return "low";
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ── Component ───────────────────────────────── */

export function BestWindowCard({ best, runnerUp, dayLabel }: Props) {
  const { t } = useLanguage();

  if (!best.window) {
    return (
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("dayView.bestTime.title")}</h2>
          <p>{dayLabel}</p>
        </div>
        <p className={styles.noWindows}>{t("dayView.bestTime.none")}</p>
      </section>
    );
  }

  const win = best.window;
  const sc = scoreClass(win.averageScore);
  const ctx = windowToSlotCtx(win);
  const size = getSizeBand(ctx);
  const wind = getWindComfort(ctx);
  const surface = getSurfaceQuality(ctx);

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>{t("dayView.bestTime.title")}</h2>
        <p>{dayLabel}</p>
      </div>

      {/* ── Primary best-window card ── */}
      <article className={`${styles.bestWindowHero} ${styles[`slotCard${capitalise(sc)}`]}`}>
        <div className={styles.bestWindowTop}>
          <span className={styles.bestWindowBadge}>🏄 {t("dayView.bestTime.badge")}</span>
          <span className={`${styles.scoreBadge} ${styles[`score${capitalise(sc)}`]}`}>
            {win.averageScore.toFixed(1)}
          </span>
        </div>

        <p className={styles.bestWindowTime}>
          {win.startLabel} – {win.endLabel}
        </p>

        {/* Pro indicators */}
        <div className={styles.bestWindowIndicators}>
          <span className={`${styles.condChip} ${styles.condChipSize}`}>
            🌊 {t(`cond.size.${size}` as TranslationKey)}
          </span>
          <span className={`${styles.condChip} ${styles.condChipWind}`}>
            💨 {t(`cond.wind.${wind}` as TranslationKey)}
          </span>
          <span className={`${styles.condChip} ${styles.condChipSurface}`}>
            🪟 {t(`cond.surface.${surface}` as TranslationKey)}
          </span>
        </div>

        {win.waveHeight != null && (
          <p className={styles.bestWindowStats}>
            🌊 {win.waveHeight.toFixed(1)}m &nbsp;·&nbsp;
            {t("surfWindows.peak")} {win.peakScore.toFixed(1)}
          </p>
        )}
      </article>

      {/* ── Optional runner-up ── */}
      {runnerUp && (
        <article className={`${styles.windowCard} ${styles[`slotCard${capitalise(scoreClass(runnerUp.averageScore))}`]}`}>
          <div className={styles.windowTopRow}>
            <span className={styles.windowTime}>
              {runnerUp.startLabel} – {runnerUp.endLabel}
            </span>
            <span className={`${styles.scoreBadge} ${styles[`score${capitalise(scoreClass(runnerUp.averageScore))}`]}`}>
              {runnerUp.averageScore.toFixed(1)}
            </span>
          </div>
          <div className={styles.windowMeta}>
            {(() => {
              const c2 = windowToSlotCtx(runnerUp);
              return (
                <>
                  <span className={styles.windowChip}>
                    {t(`cond.size.${getSizeBand(c2)}` as TranslationKey)}
                  </span>
                  <span className={styles.windowChip}>
                    {t(`cond.wind.${getWindComfort(c2)}` as TranslationKey)}
                  </span>
                  <span className={styles.windowChip}>
                    {t(`cond.surface.${getSurfaceQuality(c2)}` as TranslationKey)}
                  </span>
                </>
              );
            })()}
          </div>
        </article>
      )}
    </section>
  );
}
