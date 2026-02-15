/* ── Discover data types ──────────────────────── */

import type { RatingBucket, SizeBand } from "@/lib/alerts/types";

/**
 * One "highlight" row — a single (spot + day) combination
 * that the Discover page can render and rank.
 */
export interface DayHighlight {
  spotId: string;
  spotName: string;
  country: string;
  dateKey: string;          // "YYYY-MM-DD"
  dayLabel: string;         // "Today", "Tomorrow", "Mon 17"
  ratingBucket: RatingBucket;
  avgScore: number;
  sizeBand?: SizeBand;
  alertMatched: boolean;
}

/**
 * Per-spot summary used by the "Your Spots" block.
 */
export interface SpotDiscoverSummary {
  spotId: string;
  spotName: string;
  country: string;
  /** Best day for this spot (highest avgScore). */
  bestDay: DayHighlight | null;
  /** Number of days that match the spot's alert profile. */
  alertDayCount: number;
}
