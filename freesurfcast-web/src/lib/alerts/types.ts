/* ── Alert-profile types ─────────────────────── */

export type RatingBucket =
  | "poor"
  | "poorToFair"
  | "fair"
  | "fairToGood"
  | "good"
  | "goodToEpic"
  | "epic";

export type SizeBand =
  | "tiny"
  | "knee"
  | "waist"
  | "chest"
  | "shoulder"
  | "head"
  | "overhead"
  | "doubleOverhead";

export interface SpotAlertProfile {
  spotId: string;
  /** Minimum day-average rating that triggers an alert. */
  minRatingBucket: RatingBucket;
  /** Minimum acceptable wave size (inclusive). */
  minSizeBand?: SizeBand;
  /** Maximum acceptable wave size (inclusive). */
  maxSizeBand?: SizeBand;
  /** When true, only alert if there is at least one offshore / cross-off slot. */
  preferOffshore?: boolean;
}

/** Ordered from worst → best for comparison helpers. */
export const RATING_ORDER: RatingBucket[] = [
  "poor",
  "poorToFair",
  "fair",
  "fairToGood",
  "good",
  "goodToEpic",
  "epic",
];

/** Ordered from smallest → largest for comparison helpers. */
export const SIZE_ORDER: SizeBand[] = [
  "tiny",
  "knee",
  "waist",
  "chest",
  "shoulder",
  "head",
  "overhead",
  "doubleOverhead",
];
