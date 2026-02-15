/**
 * matchDayAlert  –  check whether a day's forecast satisfies an alert profile.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  Uses:                                                             │
 * │  • DaySummary.ratingColor  → compared against profile.minRating    │
 * │  • Per-slot size bands     → at least one slot within range        │
 * │  • Per-slot wind comfort   → at least one offshore/cross-off slot  │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import type { SlotContext } from "@/lib/scores";
import { getSizeBand, getWindComfort } from "@/lib/forecast/conditions";
import type { RatingColor } from "@/lib/forecast/dayWindows";
import {
  RATING_ORDER,
  SIZE_ORDER,
  type RatingBucket,
  type SizeBand,
  type SpotAlertProfile,
} from "./types";

/* ── Order helpers ───────────────────────────── */

function ratingIdx(r: RatingBucket | RatingColor): number {
  return RATING_ORDER.indexOf(r as RatingBucket);
}

function sizeIdx(s: SizeBand): number {
  return SIZE_ORDER.indexOf(s);
}

/* ── Match logic ─────────────────────────────── */

export interface DayAlertInput {
  ratingColor: RatingColor;
  daySlots: SlotContext[];
}

/**
 * Returns `true` when the day meets **all** active criteria in the profile.
 *
 * 1. Rating: day's ratingColor ≥ profile.minRatingBucket
 * 2. Size range (optional): at least one slot's size band falls within
 *    [minSizeBand, maxSizeBand] (inclusive).
 * 3. Offshore preference (optional): at least one slot is "offshore" or
 *    "cross-off".
 */
export function matchDayAlert(
  profile: SpotAlertProfile,
  day: DayAlertInput,
): boolean {
  // 1 ── Rating gate ──
  if (ratingIdx(day.ratingColor) < ratingIdx(profile.minRatingBucket)) {
    return false;
  }

  // 2 ── Size range gate ──
  if (profile.minSizeBand || profile.maxSizeBand) {
    const minI = profile.minSizeBand ? sizeIdx(profile.minSizeBand) : 0;
    const maxI = profile.maxSizeBand
      ? sizeIdx(profile.maxSizeBand)
      : SIZE_ORDER.length - 1;

    const sizeMatch = day.daySlots.some((slot) => {
      const i = sizeIdx(getSizeBand(slot));
      return i >= minI && i <= maxI;
    });

    if (!sizeMatch) return false;
  }

  // 3 ── Offshore preference gate ──
  if (profile.preferOffshore) {
    const offshoreMatch = day.daySlots.some((slot) => {
      const w = getWindComfort(slot);
      return w === "offshore" || w === "cross-off";
    });
    if (!offshoreMatch) return false;
  }

  return true;
}

/* ── Batch helper ────────────────────────────── */

export type AlertMap = Record<string, boolean>;

/**
 * Build a dateKey → boolean map for all summaries at once.
 * The caller groups slots by dateKey and passes them alongside summaries.
 */
export function buildAlertMap(
  profile: SpotAlertProfile | null,
  summaries: { dateKey: string; ratingColor: RatingColor }[],
  slotsByDay: Map<string, SlotContext[]>,
): AlertMap {
  const map: AlertMap = {};
  if (!profile) return map;

  for (const s of summaries) {
    map[s.dateKey] = matchDayAlert(profile, {
      ratingColor: s.ratingColor,
      daySlots: slotsByDay.get(s.dateKey) ?? [],
    });
  }
  return map;
}
