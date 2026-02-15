/* ── Profile Insights types ──────────────────── */

import type { RatingBucket, SizeBand } from "@/lib/alerts/types";

/**
 * A snapshot of conditions at the time a session was surfed.
 * Built by cross-referencing session data with spot catalog info.
 */
export interface ConditionSnapshot {
  spotId: string;
  spotName: string;
  dayKey: string;
  sizeBand?: SizeBand;
  ratingBucket: RatingBucket;
  avgScore: number;
  windComfort?: "offshore" | "crossOffshore" | "onshore" | "variable";
  surface?: "glassy" | "clean" | "bumpy" | "messy";
  sessionRating: number; // user's 1-5
}

/**
 * Aggregated profile insights derived from session history.
 */
export interface ProfileInsights {
  totalSessions: number;
  avgSessionRating: number;
  totalMinutes: number;
  preferredSizeBands: { sizeBand: SizeBand; score: number }[];
  avoidedSizeBands: { sizeBand: SizeBand; score: number }[];
  preferredRatingBuckets: { bucket: RatingBucket; score: number }[];
  windPreference: {
    offshoreScore: number;
    onshoreScore: number;
  };
  surfacePreference: {
    cleanScore: number;
    messyScore: number;
  };
  /** Top-rated spot IDs by average session rating */
  topSpots: { spotId: string; spotName: string; avgRating: number; count: number }[];
  /** i18n suggestion keys to show the user */
  suggestions: string[];
}

/**
 * A concrete suggestion for adjusting alert settings.
 */
export interface AlertSuggestion {
  /** i18n key for the suggestion label */
  labelKey: string;
  /** What the suggestion changes */
  field: "minRatingBucket" | "minSizeBand" | "maxSizeBand" | "preferOffshore";
  /** Suggested new value */
  value: RatingBucket | SizeBand | boolean;
  /** Confidence 0-1 */
  confidence: number;
}
