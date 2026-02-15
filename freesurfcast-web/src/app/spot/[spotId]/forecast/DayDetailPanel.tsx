"use client";

import type { DayBestWindow } from "@/lib/forecast/dayWindows";
import type { ForecastSlot } from "@/app/forecast/mockData";
import type { SlotQuality, SlotContext } from "@/lib/scores";
import {
  summarizeConditions,
  getWindComfort,
  getSizeBand,
} from "@/lib/forecast/conditions";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { SurfWindow } from "@/lib/forecast/surfWindows";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

type Props = {
  dateKey: string;
  dayLabel: string;        // "Today" / "di 17"
  fullDate: string;        // "dinsdag 17 februari"
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
  epic:        "#00acc1",
  goodToEpic:  "#26a69a",
  good:        "#43a047",
  fairToGood:  "#c0ca33",
  fair:        "#fdd835",
  poorToFair:  "#fb8c00",
  poor:        "#e53935",
};

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function scoreClass(score: number): "high" | "medium" | "low" {
  if (score >= 7) return "high";
  if (score >= 4.5) return "medium";
  return "low";
}

/** Compass arrow for wind. */
function windArrow(deg: number): string {
  const arr = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  return arr[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}
/** Compass cardinal. */
function windCardinal(deg: number): string {
  const d = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return d[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/** Format hour (0-24) as locale time string e.g. "3:00 PM". */
function formatHour(h: number): string {
  const clamped = ((h % 24) + 24) % 24;
  const ampm = clamped >= 12 ? "PM" : "AM";
  const h12 = clamped === 0 ? 12 : clamped > 12 ? clamped - 12 : clamped;
  return `${h12}:00 ${ampm}`;
}

/* ── Day-level aggregates (min / max heights) ── */

function dayHeightRange(slots: ForecastSlot[]): { min: number; max: number } {
  const heights: number[] = [];
  for (const s of slots) {
    const m = (s.mergedSpot ?? {}) as Record<string, unknown>;
    const h = m.golfHoogteMeter as number | undefined;
    if (h != null) heights.push(h);
  }
  return {
    min: heights.length > 0 ? Math.min(...heights) : 0,
    max: heights.length > 0 ? Math.max(...heights) : 0,
  };
}

/* ── 24h Timeline Bar with best-hour marker ── */

function TimelineBar({
  window,
  bestHour,
  ratingColor,
  ratingLabel,
}: {
  window: SurfWindow | null;
  bestHour: number | null;
  ratingColor: string;
  ratingLabel: string;
}) {
  // Window segment
  const startPct = window ? Math.max(0, (window.startHour % 24) / 24) * 100 : 0;
  const endH     = window ? (window.endHour % 24 || 24) : 0;
  const endPct   = window ? Math.min(100, (endH / 24) * 100) : 0;
  const widthPct = endPct - startPct;

  // Best-hour marker
  const markerPct = bestHour != null ? ((bestHour % 24) / 24) * 100 : null;

  return (
    <div className={styles.timelineWrap}>
      {/* Caption: best hour + rating word */}
      {bestHour != null && (
        <div className={styles.timelineCaption}>
          <span className={styles.timelineCaptionTime}>{formatHour(bestHour)}</span>
          <span className={styles.timelineCaptionRating} style={{ color: ratingColor }}>
            {ratingLabel}
          </span>
        </div>
      )}

      {/* Track */}
      <div className={styles.timelineTrack}>
        {/* Highlighted window segment */}
        {window && widthPct > 0 && (
          <div
            className={styles.timelineSegment}
            style={{ left: `${startPct}%`, width: `${widthPct}%`, background: ratingColor }}
          />
        )}
        {/* Best-hour dot */}
        {markerPct != null && (
          <span
            className={styles.timelineMarker}
            style={{ left: `${markerPct}%`, background: ratingColor }}
          />
        )}
        {/* Hour ticks: 0, 6, 12, 18, 24 */}
        {[0, 6, 12, 18, 24].map((h) => (
          <span
            key={h}
            className={styles.timelineTick}
            style={{ left: `${(h / 24) * 100}%` }}
          />
        ))}
      </div>

      {/* Labels */}
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

  /* ── Empty state: no slots for this day ── */
  if (daySlots.length === 0) {
    return (
      <div className={styles.dayDetail}>
        <div className={styles.dayHeader}>
          <span className={styles.dayHeaderLabel}>{dayLabel}</span>
          <span className={styles.dayHeaderDate}>{fullDate}</span>
        </div>
        <div className={styles.emptyState}>
          <span className={styles.emptyStateIcon}>🌊</span>
          <p className={styles.emptyStateText}>
            {t("forecast.empty.dayNoData")}
          </p>
          <p className={styles.emptyStateHint}>
            {t("forecast.empty.dayNoDataHint")}
          </p>
        </div>
      </div>
    );
  }

  const band = ratingBand(avgScore);
  const ratingColor = RATING_COLORS[band];
  const ratingKey = `rating.${band}` as TranslationKey;
  const sc = scoreClass(avgScore);

  // Score every slot — find best slot
  const scoredSlots = daySlots.map((s) => ({
    slot: s,
    quality: scoreFn(s),
  }));
  const bestSlot = scoredSlots.length > 0
    ? scoredSlots.reduce((a, b) => (b.quality.score > a.quality.score ? b : a)).slot
    : null;

  // Best hour = offsetHours of the best-scoring slot within the window
  const bestHour: number | null = (() => {
    if (!bestWindow.window) return null;
    const winStart = bestWindow.window.startHour;
    const winEnd   = bestWindow.window.endHour;
    const windowSlots = scoredSlots.filter(({ slot }) => {
      const oh = slot.offsetHours ?? 0;
      return slot.dayKey === dateKey && oh >= winStart && oh <= winEnd;
    });
    if (windowSlots.length === 0) {
      return bestSlot ? (bestSlot.offsetHours ?? 0) % 24 : null;
    }
    const best = windowSlots.reduce((a, b) =>
      b.quality.score > a.quality.score ? b : a,
    );
    return (best.slot.offsetHours ?? 0) % 24;
  })();

  // Conditions from best slot
  const cond       = bestSlot ? summarizeConditions(bestSlot) : null;
  const merged     = bestSlot?.mergedSpot as Record<string, unknown> | undefined;
  const windComf   = bestSlot ? getWindComfort(bestSlot) : null;
  const sizeBand   = bestSlot ? getSizeBand(bestSlot) : null;

  // Day-level height range across ALL day slots
  const { min: dayMinH, max: dayMaxH } = dayHeightRange(daySlots);

  return (
    <div className={styles.dayDetail}>
      {/* ── Day header ────────────────────── */}
      <div className={styles.dayHeader}>
        <span className={styles.dayHeaderLabel}>{dayLabel}</span>
        <span className={styles.dayHeaderDate}>{fullDate}</span>
        <span className={`${styles.dayDetailScore} ${styles[`score${capitalise(sc)}`]}`}>
          {avgScore.toFixed(1)}
        </span>
      </div>

      {/* Animated content — re-plays on dateKey change */}
      <div key={dateKey} className={styles.dayDetailAnimated}>

      {/* ── Rating row ────────────────────── */}
      <div className={styles.ratingRow}>
        <span className={styles.ratingDot} style={{ background: ratingColor }} />
        <span className={styles.ratingText} style={{ color: ratingColor }}>
          {t(ratingKey)}
        </span>
      </div>

      {/* ── 24h timeline with best hour ── */}
      <TimelineBar
        window={bestWindow.window}
        bestHour={bestHour}
        ratingColor={ratingColor}
        ratingLabel={t(ratingKey)}
      />
      <p className={styles.timelineHint}>
        {bestWindow.window
          ? t("forecast.bestTime.caption")
          : t("forecast.bestTime.noBest")}
      </p>

      {/* ── Pro blocks (Surf / Swell / Wind / Surface) ── */}
      <section className={styles.proBlocks}>
        {/* Surf height */}
        <div className={styles.proCard}>
          <p className={styles.proCardLabel}>{t("spot.detail.surfHeight")}</p>
          <p className={styles.proCardValue}>
            🌊 {dayMinH.toFixed(1)}–{dayMaxH.toFixed(1)} m
          </p>
          {sizeBand && (
            <p className={styles.proCardSub}>
              {t(cond!.sizeKey as TranslationKey)}
            </p>
          )}
        </div>

        {/* Swell */}
        <div className={styles.proCard}>
          <p className={styles.proCardLabel}>{t("spot.detail.swell")}</p>
          <p className={styles.proCardValue}>
            🌊{" "}
            {merged?.golfHoogteMeter != null
              ? `${(merged.golfHoogteMeter as number).toFixed(1)} m`
              : "—"}
            {merged?.golfPeriodeSeconden != null && (
              <span className={styles.proCardInline}>
                {" · "}{merged.golfPeriodeSeconden as number}s
              </span>
            )}
          </p>
          <p className={styles.proCardSub}>
            {merged?.windDirectionDeg != null
              ? `${t("spot.detail.swellFrom")} ${Math.round(merged.windDirectionDeg as number)}°`
              : "—"}
          </p>
        </div>

        {/* Wind */}
        <div className={styles.proCard}>
          <p className={styles.proCardLabel}>{t("cond.label.wind")}</p>
          <p className={styles.proCardValue}>
            💨{" "}
            {merged?.windSpeedKnots != null
              ? `${Math.round(merged.windSpeedKnots as number)} kn`
              : "—"}
          </p>
          <p className={styles.proCardSub}>
            {merged?.windDirectionDeg != null && (
              <>
                {windArrow(merged.windDirectionDeg as number)}{" "}
                {windCardinal(merged.windDirectionDeg as number)}
              </>
            )}
            {windComf && cond && (
              <span className={styles.proCardTag}>
                {" · "}{t(cond.windKey as TranslationKey)}
              </span>
            )}
          </p>
        </div>

        {/* Surface */}
        <div className={styles.proCard}>
          <p className={styles.proCardLabel}>{t("cond.label.surface")}</p>
          <p className={styles.proCardValue}>
            🪟 {cond ? t(cond.surfaceKey as TranslationKey) : "—"}
          </p>
        </div>
      </section>
      </div>{/* end dayDetailAnimated */}
    </div>
  );
}
