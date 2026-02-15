/* ──────────────────────────────────────────────
 *  Week Overview — Best-Day Summary
 *
 *  Aggregates all forecast slots per calendar day,
 *  picks the highest-scoring day, and returns a
 *  compact summary with representative conditions.
 *
 *  Used by the WeekSummaryCard that sits above the
 *  day-tab strip on the forecast page.
 * ────────────────────────────────────────────── */

import type { SlotContext, SlotQuality } from "@/lib/scores";
import { summarizeConditions, type ConditionSummary } from "./conditions";

/* ── Public types ────────────────────────────── */

export interface DayOverview {
  /** Calendar date key "YYYY-MM-DD" */
  dateKey: string;
  /** Average quality score across the day's slots */
  avgScore: number;
  /** Highest individual slot score for this day */
  peakScore: number;
  /** Number of scored slots */
  slotCount: number;
  /** The slot that scored highest (used as "representative") */
  representativeSlot: SlotContext & { id?: string; dayKey?: string };
  /** Condition indicators derived from the representative slot */
  conditions: ConditionSummary;
}

export interface WeekSummary {
  /** The single best day in the forecast horizon (null if no slots) */
  bestDay: DayOverview | null;
  /** Runner-up day, if available */
  runnerUp: DayOverview | null;
}

/* ── Builder ─────────────────────────────────── */

/**
 * Compute a week-level summary from all forecast slots.
 *
 * @param slots    All slots for the active spot (across 16 days)
 * @param scoreFn  Scoring function (same one used elsewhere)
 */
export function buildWeekSummary(
  slots: (SlotContext & { id?: string; dayKey?: string })[],
  scoreFn: (slot: SlotContext) => SlotQuality,
): WeekSummary {
  if (slots.length === 0) return { bestDay: null, runnerUp: null };

  // 1) Group slots by dayKey
  const byDay = new Map<string, { slot: SlotContext & { id?: string; dayKey?: string }; quality: SlotQuality }[]>();

  for (const slot of slots) {
    const key = slot.dayKey ?? "unknown";
    const quality = scoreFn(slot);
    let arr = byDay.get(key);
    if (!arr) {
      arr = [];
      byDay.set(key, arr);
    }
    arr.push({ slot, quality });
  }

  // 2) Build DayOverview per day
  const days: DayOverview[] = [];

  for (const [dateKey, entries] of byDay) {
    const scores = entries.map((e) => e.quality.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const peakScore = Math.max(...scores);

    // Representative = highest-scoring slot
    let best = entries[0];
    for (const e of entries) {
      if (e.quality.score > best.quality.score) best = e;
    }

    days.push({
      dateKey,
      avgScore: Math.round(avgScore * 10) / 10,
      peakScore: Math.round(peakScore * 10) / 10,
      slotCount: entries.length,
      representativeSlot: best.slot,
      conditions: summarizeConditions(best.slot),
    });
  }

  // 3) Sort by avgScore desc, then by dateKey asc (earlier wins ties)
  days.sort((a, b) => {
    const diff = b.avgScore - a.avgScore;
    if (diff !== 0) return diff;
    return a.dateKey.localeCompare(b.dateKey);
  });

  return {
    bestDay: days[0] ?? null,
    runnerUp: days[1] ?? null,
  };
}
