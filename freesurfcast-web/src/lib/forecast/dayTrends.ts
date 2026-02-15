/* ──────────────────────────────────────────────
 *  Day Trend Analysis
 *
 *  Analyses a day's slots to detect directional
 *  trends in swell, wind and surface quality.
 *  Also builds per-slot "block" data used by
 *  the 24h strip visualisation.
 * ────────────────────────────────────────────── */

import type { SlotContext, SlotQuality } from "@/lib/scores";
import {
  summarizeConditions,
  type SurfaceQuality,
} from "@/lib/forecast/conditions";

/* ── Numeric helpers ─────────────────────────── */

function num(slot: SlotContext, key: string): number | null {
  const m = (slot.mergedSpot ?? {}) as Record<string, unknown>;
  const v = m[key];
  return typeof v === "number" ? v : null;
}

/* ── Types ───────────────────────────────────── */

/** Arrow direction for a trend. */
export type TrendDir = "rising" | "falling" | "steady";

export interface DayTrends {
  swell: TrendDir;
  wind: TrendDir;
  surface: TrendDir; // "rising" = getting cleaner, "falling" = messier
}

/** One block in the 24h strip. */
export interface StripBlock {
  hour: number;
  timeLabel: string;
  score: number;
  scoreClass: "high" | "medium" | "low";
  waveHeight: number | null;
  windSpeed: number | null;
  windDeg: number | null;
  swellDeg: number | null;
  surface: SurfaceQuality | null;
}

/* ── Trend detection ─────────────────────────── */

/**
 * Compute directional trend from two halves of the day.
 * Compares the average of the first half to the second half.
 * A relative change > 12 % counts as rising / falling.
 */
function halfTrend(values: (number | null)[]): TrendDir {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length < 2) return "steady";
  const mid = Math.floor(nums.length / 2);
  const firstAvg = nums.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
  const secondAvg = nums.slice(mid).reduce((a, b) => a + b, 0) / (nums.length - mid);
  const base = Math.max(firstAvg, 0.1);
  const pct = (secondAvg - firstAvg) / base;
  if (pct > 0.12) return "rising";
  if (pct < -0.12) return "falling";
  return "steady";
}

const SURFACE_RANK: Record<SurfaceQuality, number> = {
  glassy: 4,
  clean: 3,
  bumpy: 2,
  messy: 1,
};

/**
 * Analyse the day's slots and return directional trends.
 */
export function analyseDayTrends(slots: SlotContext[]): DayTrends {
  const sorted = [...slots].sort(
    (a, b) => (a.offsetHours ?? 0) - (b.offsetHours ?? 0),
  );

  const swellValues = sorted.map((s) => num(s, "golfHoogteMeter"));
  const windValues = sorted.map((s) => num(s, "windSpeedKnots"));
  const surfaceValues = sorted.map((s) => {
    const cond = summarizeConditions(s);
    return SURFACE_RANK[cond.surface] ?? null;
  });

  return {
    swell: halfTrend(swellValues),
    wind: halfTrend(windValues),
    surface: halfTrend(surfaceValues), // rising = getting cleaner
  };
}

/* ── 24h strip blocks ────────────────────────── */

function toScoreClass(score: number): "high" | "medium" | "low" {
  if (score >= 7) return "high";
  if (score >= 4.5) return "medium";
  return "low";
}

/**
 * Build the block array for the 24h strip from day slots + scores.
 */
export function buildStripBlocks(
  slots: SlotContext[],
  scoreFn: (slot: SlotContext) => SlotQuality,
): StripBlock[] {
  const sorted = [...slots].sort(
    (a, b) => (a.offsetHours ?? 0) - (b.offsetHours ?? 0),
  );

  return sorted.map((s) => {
    const q = scoreFn(s);
    const hour = (s.offsetHours ?? 0) % 24;
    const hh = hour.toString().padStart(2, "0");

    // extract numeric fields
    const waveH = num(s, "golfHoogteMeter");
    const windSpd = num(s, "windSpeedKnots");
    const windDeg = num(s, "windDirectionDeg");
    // swell direction may be a separate field, fallback to wind dir
    const swellDeg = num(s, "swellDirectionDeg") ?? num(s, "windDirectionDeg");

    const cond = summarizeConditions(s);

    return {
      hour,
      timeLabel: `${hh}:00`,
      score: q.score,
      scoreClass: toScoreClass(q.score),
      waveHeight: waveH,
      windSpeed: windSpd,
      windDeg,
      swellDeg,
      surface: cond.surface,
    };
  });
}

/* ── Dynamic day summary text ────────────────── */

export type DaySummaryTextKey =
  | "daySummary.epicAllDay"
  | "daySummary.bestMorning"
  | "daySummary.bestAfternoon"
  | "daySummary.bestEvening"
  | "daySummary.steadyDecent"
  | "daySummary.deteriorating"
  | "daySummary.improving"
  | "daySummary.flat"
  | "daySummary.poor";

/**
 * Pick the most fitting i18n key for a one-line sentence
 * that actually changes per day.
 */
export function pickDaySummaryKey(
  blocks: StripBlock[],
  avgScore: number,
  trends: DayTrends,
): DaySummaryTextKey {
  if (blocks.length === 0) return "daySummary.flat";

  // All-day epic?
  const allHigh = blocks.every((b) => b.score >= 7);
  if (allHigh && avgScore >= 7) return "daySummary.epicAllDay";

  // Identify best third of day
  const third = Math.max(1, Math.floor(blocks.length / 3));
  const morningAvg =
    blocks.slice(0, third).reduce((s, b) => s + b.score, 0) / third;
  const midAvg =
    blocks.slice(third, third * 2).reduce((s, b) => s + b.score, 0) / Math.max(blocks.slice(third, third * 2).length, 1);
  const eveAvg =
    blocks.slice(third * 2).reduce((s, b) => s + b.score, 0) / Math.max(blocks.slice(third * 2).length, 1);

  // Improving / deteriorating from trends
  if (trends.swell === "falling" && trends.wind === "rising" && avgScore < 5) {
    return "daySummary.deteriorating";
  }
  if (trends.swell === "rising" && trends.surface === "rising" && avgScore >= 4) {
    return "daySummary.improving";
  }

  // Best part of day
  const max = Math.max(morningAvg, midAvg, eveAvg);
  if (max < 2) return "daySummary.flat";
  if (avgScore < 3) return "daySummary.poor";

  if (morningAvg === max && morningAvg - midAvg > 1) return "daySummary.bestMorning";
  if (eveAvg === max && eveAvg - midAvg > 1) return "daySummary.bestEvening";
  if (midAvg === max && midAvg - morningAvg > 1) return "daySummary.bestAfternoon";

  return "daySummary.steadyDecent";
}
