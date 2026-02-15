"use client";

import type { DayBestWindow } from "@/lib/forecast/dayWindows";
import type { ForecastSlot } from "@/app/forecast/mockData";
import type { SlotQuality, SlotContext } from "@/lib/scores";
import {
  getSizeBand,
  getWindComfort,
  getSurfaceQuality,
  summarizeConditions,
} from "@/lib/forecast/conditions";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

type Props = {
  dateKey: string;
  dayLabel: string;                          // "Today" / "di 17-feb"
  fullDate: string;                          // "dinsdag 17 februari"
  daySlots: ForecastSlot[];
  bestWindow: DayBestWindow;
  avgScore: number;
  scoreFn: (slot: SlotContext) => SlotQuality;
};

/* ── Helpers ──────────────────────────────────── */

function scoreClass(score: number): "high" | "medium" | "low" {
  if (score >= 7) return "high";
  if (score >= 4.5) return "medium";
  return "low";
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ── Component ───────────────────────────────── */

export function DayDetailPanel({
  dateKey,
  dayLabel,
  fullDate,
  daySlots,
  bestWindow,
  avgScore,
  scoreFn,
}: Props) {
  const { t } = useLanguage();
  const sc = scoreClass(avgScore);

  // Score each slot for the time bar
  const scoredSlots = daySlots.map((s) => ({
    slot: s,
    quality: scoreFn(s),
  }));

  // Representative slot (highest scoring)
  const bestSlot = scoredSlots.length > 0
    ? scoredSlots.reduce((a, b) => (b.quality.score > a.quality.score ? b : a)).slot
    : null;

  const cond = bestSlot ? summarizeConditions(bestSlot) : null;
  const merged = bestSlot?.mergedSpot as Record<string, unknown> | undefined;

  return (
    <div className={styles.dayDetail}>
      {/* ── Header row ── */}
      <div className={styles.dayDetailHeader}>
        <div>
          <h2 className={styles.dayDetailTitle}>{dayLabel}</h2>
          <p className={styles.dayDetailDate}>{fullDate}</p>
        </div>
        <span className={`${styles.dayDetailScore} ${styles[`score${capitalise(sc)}`]}`}>
          {avgScore.toFixed(1)}
        </span>
      </div>

      {/* ── Best-time hero strip ── */}
      {bestWindow.window ? (
        <div className={styles.bestTimeStrip}>
          <span className={styles.bestTimeIcon}>🏄</span>
          <div className={styles.bestTimeBody}>
            <p className={styles.bestTimeLabel}>{t("spot.detail.bestMoment")}</p>
            <p className={styles.bestTimeValue}>
              {bestWindow.window.startLabel} – {bestWindow.window.endLabel}
            </p>
            <p className={styles.bestTimeMeta}>
              {bestWindow.window.waveHeight != null && `${bestWindow.window.waveHeight.toFixed(1)}m · `}
              {t("surfWindows.peak")} {bestWindow.window.peakScore.toFixed(1)}
            </p>
          </div>
          <span className={styles.bestTimeScore}>
            {bestWindow.window.averageScore.toFixed(1)}
          </span>
        </div>
      ) : (
        <p style={{ color: "var(--muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
          {t("dayView.bestTime.none")}
        </p>
      )}

      {/* ── Slot time bar ── */}
      <div className={styles.slotTimeBar}>
        {scoredSlots.map(({ slot, quality }) => {
          const slotSc = scoreClass(quality.score);
          return (
            <div
              key={slot.id}
              className={`${styles.timeBlock} ${styles[`timeBlock${capitalise(slotSc)}`]}`}
            >
              <span className={styles.timeBlockTime}>{slot.timeLabel}</span>
              <span className={`${styles.timeBlockScore} ${styles[`score${capitalise(slotSc)}`]}`}>
                {quality.score.toFixed(1)}
              </span>
              <span className={styles.timeBlockLabel}>{slot.dayPart}</span>
            </div>
          );
        })}
      </div>

      {/* ── Condition blocks ── */}
      {bestSlot && cond && (
        <div className={styles.condBlocks}>
          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("cond.label.size")}</p>
            <p className={styles.condBlockValue}>🌊 {t(cond.sizeKey as TranslationKey)}</p>
            {merged?.golfHoogteMeter != null && (
              <p className={styles.condBlockSub}>{(merged.golfHoogteMeter as number).toFixed(1)}m</p>
            )}
          </div>

          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("cond.label.wind")}</p>
            <p className={styles.condBlockValue}>💨 {t(cond.windKey as TranslationKey)}</p>
            {merged?.windSpeedKnots != null && (
              <p className={styles.condBlockSub}>{Math.round(merged.windSpeedKnots as number)} kn</p>
            )}
          </div>

          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("cond.label.surface")}</p>
            <p className={styles.condBlockValue}>🪟 {t(cond.surfaceKey as TranslationKey)}</p>
          </div>

          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("spot.detail.period")}</p>
            <p className={styles.condBlockValue}>
              ⏱ {merged?.golfPeriodeSeconden != null ? `${merged.golfPeriodeSeconden}s` : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
