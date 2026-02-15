/* ──────────────────────────────────────────────
 *  Day Windows — per-dag "best time" picker
 *
 *  Filters the global SurfWindows list to a single
 *  calendar day and selects the best window (highest
 *  avgScore, then peakScore as tie-break).
 *
 *  Also exposes a helper that grabs the top-N windows
 *  for a day, and a "next 2 days" micro-summary.
 * ────────────────────────────────────────────── */

import type { SurfWindow } from "@/lib/forecast/surfWindows";
import type { SlotContext, SlotQuality } from "@/lib/scores";

/* Re-export the slot type used by the forecast page */
import type { ForecastSlot } from "@/app/forecast/mockData";

/* ── Public types ────────────────────────────── */

export interface DayBestWindow {
  dateKey: string;                       // "YYYY-MM-DD"
  window: SurfWindow | null;
  /** The slot that is closest to the window's start hour */
  representativeSlot: ForecastSlot | null;
}

export interface DayWindowSummary {
  dateKey: string;
  windows: SurfWindow[];                 // up to topN
  topSlot: ForecastSlot | null;          // highest-scoring slot of the day
  avgScore: number;                      // day-level average score
}

/* ── Helpers ──────────────────────────────────── */

/**
 * Filter surf-windows to a specific dateKey.
 */
function windowsForDay(windows: SurfWindow[], dateKey: string): SurfWindow[] {
  return windows.filter((w) => w.dateKey === dateKey);
}

/**
 * Given a SurfWindow, find the slot that is closest to the
 * window's start hour within that day.
 */
function findRepresentativeSlot(
  slots: ForecastSlot[],
  win: SurfWindow,
): ForecastSlot | null {
  const daySlots = slots.filter((s) => s.dayKey === win.dateKey);
  if (daySlots.length === 0) return null;

  let best: ForecastSlot | null = null;
  let bestDiff = Infinity;

  for (const s of daySlots) {
    const diff = Math.abs((s.offsetHours ?? 0) - win.startHour);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = s;
    }
  }
  return best;
}

/* ── Main API ────────────────────────────────── */

/**
 * Get the single best SurfWindow for a given day.
 *
 * Selection: highest averageScore; tie-break on peakScore.
 */
export function getBestWindowForDay(
  windows: SurfWindow[],
  slots: ForecastSlot[],
  dateKey: string,
): DayBestWindow {
  const dayWins = windowsForDay(windows, dateKey);

  if (dayWins.length === 0) {
    return { dateKey, window: null, representativeSlot: null };
  }

  // Already sorted by averageScore desc from buildSurfWindows,
  // but re-sort to be safe + add peakScore tie-break.
  const sorted = [...dayWins].sort((a, b) => {
    const diff = b.averageScore - a.averageScore;
    if (diff !== 0) return diff;
    return b.peakScore - a.peakScore;
  });

  const best = sorted[0];
  return {
    dateKey,
    window: best,
    representativeSlot: findRepresentativeSlot(slots, best),
  };
}

/**
 * Get top-N windows for a day (for displaying a ranked list).
 */
export function getTopWindowsForDay(
  windows: SurfWindow[],
  slots: ForecastSlot[],
  dateKey: string,
  topN = 2,
): DayWindowSummary {
  const dayWins = windowsForDay(windows, dateKey)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, topN);

  const daySlots = slots.filter((s) => s.dayKey === dateKey);

  // Find the slot with the highest score (by offsetHours proxy — use
  // highest-scored window's representative slot if available)
  let topSlot: ForecastSlot | null = null;
  if (dayWins.length > 0) {
    topSlot = findRepresentativeSlot(slots, dayWins[0]);
  } else if (daySlots.length > 0) {
    topSlot = daySlots[0]; // first slot of the day as fallback
  }

  // Day-level average: average of all windows' avgScores (or 0)
  const avgScore =
    dayWins.length > 0
      ? Math.round(
          (dayWins.reduce((s, w) => s + w.averageScore, 0) / dayWins.length) * 10,
        ) / 10
      : 0;

  return { dateKey, windows: dayWins, topSlot, avgScore };
}

/**
 * Build micro-summaries for the next N days after `baseDate`.
 * Useful for the "Coming 2 days" preview block.
 */
export function getUpcomingDaysSummary(
  windows: SurfWindow[],
  slots: ForecastSlot[],
  baseDateKey: string,
  count = 2,
  scoreFn?: (slot: SlotContext) => SlotQuality,
): DayWindowSummary[] {
  // Collect all unique dateKeys from slots, sorted ascending
  const dateSet = new Set<string>();
  for (const s of slots) {
    if (s.dayKey && s.dayKey > baseDateKey) dateSet.add(s.dayKey);
  }
  const upcoming = [...dateSet].sort().slice(0, count);

  return upcoming.map((dateKey) => {
    const summary = getTopWindowsForDay(windows, slots, dateKey, 2);

    // If a scoring function is provided, compute a real avg score
    // across all slots of the day (not just windows).
    if (scoreFn) {
      const daySlots = slots.filter((s) => s.dayKey === dateKey);
      if (daySlots.length > 0) {
        const scores = daySlots.map((s) => scoreFn(s).score);
        summary.avgScore =
          Math.round(
            (scores.reduce((a, b) => a + b, 0) / scores.length) * 10,
          ) / 10;
      }
    }

    return summary;
  });
}

/* ── DaySummary — compact per-day card data ── */

export type RatingColor = "poor" | "fair" | "good" | "epic";

export interface DaySummary {
  dateKey: string;
  label: string;               // "Today" / "Tomorrow" / "di 17"
  shortLabel: string;           // 2-char weekday + date
  minHeight: number;
  maxHeight: number;
  avgScore: number;
  primaryWindDir: number;       // average wind direction (°)
  ratingColor: RatingColor;
}

function toRatingColor(avgScore: number): RatingColor {
  if (avgScore >= 7.5) return "epic";
  if (avgScore >= 5.5) return "good";
  if (avgScore >= 3.5) return "fair";
  return "poor";
}

/**
 * Build a compact DaySummary per calendar day from all slots.
 *
 * @param slots    Full 16-day slot array
 * @param scoreFn  Scoring function
 * @param locale   e.g. "en", "nl"
 * @param todayLabel  Translated "Today"
 * @param tomorrowLabel  Translated "Tomorrow"
 */
export function buildDaySummaries(
  slots: ForecastSlot[],
  scoreFn: (slot: SlotContext) => SlotQuality,
  locale: string,
  todayLabel: string,
  tomorrowLabel: string,
): DaySummary[] {
  // Group slots by dateKey
  const byDay = new Map<string, ForecastSlot[]>();
  for (const s of slots) {
    const key = s.dayKey ?? "unknown";
    let arr = byDay.get(key);
    if (!arr) { arr = []; byDay.set(key, arr); }
    arr.push(s);
  }

  const today = new Date().toISOString().split("T")[0];
  const tom = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const days: DaySummary[] = [];
  const sortedKeys = [...byDay.keys()].sort();

  for (const dateKey of sortedKeys) {
    const daySlots = byDay.get(dateKey)!;

    // Heights
    const heights: number[] = [];
    const windDirs: number[] = [];
    const scores: number[] = [];

    for (const s of daySlots) {
      const m = (s.mergedSpot ?? {}) as Record<string, unknown>;
      const h = m.golfHoogteMeter as number | undefined;
      const wd = m.windDirectionDeg as number | undefined;
      if (h != null) heights.push(h);
      if (wd != null) windDirs.push(wd);
      scores.push(scoreFn(s).score);
    }

    const minH = heights.length > 0 ? Math.min(...heights) : 0;
    const maxH = heights.length > 0 ? Math.max(...heights) : 0;
    const avgScore = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
    const avgWind = windDirs.length > 0
      ? Math.round(windDirs.reduce((a, b) => a + b, 0) / windDirs.length)
      : 0;

    // Labels
    let label: string;
    let shortLabel: string;
    if (dateKey === today) {
      label = todayLabel;
      shortLabel = todayLabel;
    } else if (dateKey === tom) {
      label = tomorrowLabel;
      shortLabel = tomorrowLabel.slice(0, 3);
    } else {
      const d = new Date(dateKey + "T12:00:00");
      const wd = d.toLocaleDateString(locale, { weekday: "short" });
      const day = d.getDate();
      label = `${wd} ${day}`;
      shortLabel = `${wd} ${day}`;
    }

    days.push({
      dateKey,
      label,
      shortLabel,
      minHeight: Math.round(minH * 10) / 10,
      maxHeight: Math.round(maxH * 10) / 10,
      avgScore,
      primaryWindDir: avgWind,
      ratingColor: toRatingColor(avgScore),
    });
  }

  return days;
}
