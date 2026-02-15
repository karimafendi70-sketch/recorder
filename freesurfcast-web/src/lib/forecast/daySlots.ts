/* ──────────────────────────────────────────────
 *  Day-slot helpers
 *
 *  Canonical way to extract & sort the forecast
 *  slots belonging to a single calendar day.
 * ────────────────────────────────────────────── */

import type { SlotContext } from "@/lib/scores";

/**
 * Return the slots for a given dayKey, sorted by offsetHours ascending.
 * This guarantees a stable, chronological order that all day-level
 * components can rely on.
 */
export function getSlotsForDay<T extends SlotContext>(
  allSlots: T[],
  dayKey: string,
): T[] {
  return allSlots
    .filter((s) => s.dayKey === dayKey)
    .sort((a, b) => (a.offsetHours ?? 0) - (b.offsetHours ?? 0));
}
