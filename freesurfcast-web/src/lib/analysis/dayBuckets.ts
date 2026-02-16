import type { ForecastSlot } from "@/app/forecast/mockData";

/* ── Types ───────────────────────────────────── */

export interface DayBucket {
  /** Zero-based index within the day (0..n-1) */
  index: number;
  /** Bucket start hour (inclusive), e.g. 0, 3, 6 … */
  startHour: number;
  /** Bucket end hour (exclusive), e.g. 3, 6, 9 … */
  endHour: number;
  /** Display label, e.g. "06:00", "09:00" */
  label: string;
  /** Slots whose hour falls within [startHour, endHour) */
  slots: ForecastSlot[];
}

/* ── Helpers ─────────────────────────────────── */

/**
 * Extract the hour-of-day from a ForecastSlot.
 * Prefers `timeLabel` ("HH:MM"), falls back to `offsetHours % 24`.
 */
function parseHour(slot: ForecastSlot): number | null {
  if (slot.timeLabel) {
    const m = slot.timeLabel.match(/^(\d{1,2}):/);
    if (m) return parseInt(m[1], 10);
  }
  if (slot.offsetHours != null) return slot.offsetHours % 24;
  return null;
}

/* ── Main builder ────────────────────────────── */

/**
 * Build canonical day buckets of `bucketSizeHours` hours.
 *
 * Returns `24 / bucketSizeHours` buckets (default 8 for 3 h).
 * Each `ForecastSlot` is assigned to the bucket whose time range
 * covers its hour-of-day.
 *
 * @example
 * ```ts
 * const buckets = buildDayBuckets(daySlots);
 * // → 8 buckets: 00:00, 03:00, 06:00, …, 21:00
 * ```
 */
export function buildDayBuckets(
  slots: ForecastSlot[],
  bucketSizeHours = 3,
): DayBucket[] {
  const count = Math.ceil(24 / bucketSizeHours);

  const buckets: DayBucket[] = Array.from({ length: count }, (_, i) => {
    const startHour = i * bucketSizeHours;
    return {
      index: i,
      startHour,
      endHour: startHour + bucketSizeHours,
      label: `${String(startHour).padStart(2, "0")}:00`,
      slots: [],
    };
  });

  for (const slot of slots) {
    const hour = parseHour(slot);
    if (hour == null) continue;
    // clamp to last bucket if hour overshoots (shouldn't, but safety)
    const idx = Math.min(Math.floor(hour / bucketSizeHours), count - 1);
    buckets[idx].slots.push(slot);
  }

  return buckets;
}
