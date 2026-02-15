"use client";

import type { DayBestWindow } from "@/lib/forecast/dayWindows";
import type { ForecastSlot } from "@/app/forecast/mockData";
import type { SlotQuality, SlotContext } from "@/lib/scores";
import {
  summarizeConditions,
  getWindComfort,
} from "@/lib/forecast/conditions";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { SurfWindow } from "@/lib/forecast/surfWindows";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

type Props = {
  dateKey: string;
  dayLabel: string;
  fullDate: string;
  daySlots: ForecastSlot[];
  bestWindow: DayBestWindow;
  avgScore: number;
  scoreFn: (slot: SlotContext) => SlotQuality;
};

/* ── Rating helpers ──────────────────────────── */

type RatingBand =
  | "epic"
  | "goodToEpic"
  | "good"
  | "fairToGood"
  | "fair"
  | "poorToFair"
  | "poor";

function ratingBand(score: number): RatingBand {
  if (score >= 8) return "epic";
  if (score >= 7) return "goodToEpic";
  if (score >= 6) return "good";
  if (score >= 5) return "fairToGood";
  if (score >= 4) return "fair";
  if (score >= 3) return "poorToFair";
  return "poor";
}

const RATING_COLORS: Record<RatingBand, string> = {
  epic: "#2d9e6a",
  goodToEpic: "#4db87a",
  good: "#7ac068",
  fairToGood: "#9cba54",
  fair: "#d4b44a",
  poorToFair: "#d49055",
  poor: "#c06060",
};

function scoreClass(score: number): "high" | "medium" | "low" {
  if (score >= 7) return "high";
  if (score >= 4.5) return "medium";
  return "low";
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Compass arrow from degrees (meteorological convention). */
function windArrow(deg: number): string {
  const arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  return arrows[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/** Compass cardinal from degrees. */
function windCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/* ── 24 h Timeline Bar ──────────────────────── */

function TimelineBar({ window }: { window: SurfWindow | null }) {
  const startPct = window ? Math.max(0, (window.startHour % 24) / 24) * 100 : 0;
  const endH = window ? window.endHour % 24 || 24 : 0;
  const endPct = window ? Math.min(100, endH / 24 * 100) : 0;
  const widthPct = endPct - startPct;

  return (
    <div className={styles.timelineWrap}>
      <div className={styles.timelineTrack}>
        {/* highlighted window */}
        {window && widthPct > 0 && (
          <div
            className={styles.timelineSegment}
            style={{ left: `${startPct}%`, width: `${widthPct}%` }}
            title={`${window.startLabel} – ${window.endLabel}`}
          />
        )}
        {/* hour ticks */}
        {[0, 6, 12, 18, 24].map((h) => (
          <span
            key={h}
            className={styles.timelineTick}
            style={{ left: `${(h / 24) * 100}%` }}
          />
        ))}
      </div>
      <div className={styles.timelineLabels}>
        {["12am", "6am", "12pm", "6pm", "12am"].map((l, i) => (
          <span key={i} className={styles.timelineLabel}>{l}</span>
        ))}
      </div>
    </div>
  );
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
  const band = ratingBand(avgScore);
  const ratingColor = RATING_COLORS[band];
  const ratingKey = `rating.${band}` as TranslationKey;

  // Representative slot: highest scoring
  const scoredSlots = daySlots.map((s) => ({
    slot: s,
    quality: scoreFn(s),
  }));
  const bestSlot = scoredSlots.length > 0
    ? scoredSlots.reduce((a, b) => (b.quality.score > a.quality.score ? b : a)).slot
    : null;

  const cond = bestSlot ? summarizeConditions(bestSlot) : null;
  const merged = bestSlot?.mergedSpot as Record<string, unknown> | undefined;
  const windComfort = bestSlot ? getWindComfort(bestSlot) : null;

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

      {/* ── Rating text ── */}
      <div className={styles.ratingRow}>
        <span className={styles.ratingDot} style={{ background: ratingColor }} />
        <span className={styles.ratingText} style={{ color: ratingColor }}>
          {t(ratingKey)}
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

      {/* ── 24h timeline bar ── */}
      <TimelineBar window={bestWindow.window} />

      {/* ── Pro condition blocks ── */}
      {bestSlot && cond && (
        <div className={styles.condBlocks}>
          {/* Surf height */}
          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("spot.detail.surfHeight")}</p>
            <p className={styles.condBlockValue}>
              🌊 {merged?.golfHoogteMeter != null
                ? `${(merged.golfHoogteMeter as number).toFixed(1)}m`
                : "—"}
            </p>
            <p className={styles.condBlockSub}>
              {t(cond.sizeKey as TranslationKey)}
            </p>
          </div>

          {/* Swell */}
          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("spot.detail.swell")}</p>
            <p className={styles.condBlockValue}>
              🌊 {merged?.golfHoogteMeter != null
                ? `${(merged.golfHoogteMeter as number).toFixed(1)}m`
                : "—"}
              {merged?.golfPeriodeSeconden != null && (
                <span className={styles.condBlockInline}>
                  {" "}@ {merged.golfPeriodeSeconden as number}s
                </span>
              )}
            </p>
            <p className={styles.condBlockSub}>
              {merged?.windDirectionDeg != null && (
                <>
                  {windArrow(merged.windDirectionDeg as number)}{" "}
                  {windCardinal(merged.windDirectionDeg as number)}
                </>
              )}
            </p>
          </div>

          {/* Wind */}
          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("cond.label.wind")}</p>
            <p className={styles.condBlockValue}>
              💨 {merged?.windSpeedKnots != null
                ? `${Math.round(merged.windSpeedKnots as number)} kn`
                : "—"}
            </p>
            <p className={styles.condBlockSub}>
              {merged?.windDirectionDeg != null && (
                <>
                  {windArrow(merged.windDirectionDeg as number)}{" "}
                  {windCardinal(merged.windDirectionDeg as number)}
                </>
              )}
              {windComfort && (
                <span className={styles.condBlockTag}>
                  {" · "}{t(cond.windKey as TranslationKey)}
                </span>
              )}
            </p>
          </div>

          {/* Surface */}
          <div className={styles.condBlock}>
            <p className={styles.condBlockLabel}>{t("cond.label.surface")}</p>
            <p className={styles.condBlockValue}>🪟 {t(cond.surfaceKey as TranslationKey)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
