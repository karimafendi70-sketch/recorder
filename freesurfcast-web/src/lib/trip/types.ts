/* ── Trip Planner types ───────────────────────── */

import type { RatingBucket, SizeBand } from "@/lib/alerts/types";
import type { SurfWindow } from "@/lib/forecast/surfWindows";
import type { ConditionSummary } from "@/lib/forecast/conditions";

/**
 * One ranked spot+day combination returned by the trip planner.
 */
export interface TripCombo {
  spotId: string;
  spotName: string;
  country: string;
  region: string;

  dateKey: string;         // YYYY-MM-DD
  dayLabel: string;        // "Today" / "zo 15" etc.

  avgScore: number;        // 0-10
  ratingBucket: RatingBucket;

  waveHeightM: number | null;
  wavePeriodS: number | null;
  windSpeedKn: number | null;
  windDirDeg: number | null;
  sizeBand: SizeBand | null;
  conditions: ConditionSummary | null;

  bestWindow: SurfWindow | null;
  slotCount: number;

  /** Short i18n-friendly reason tag explaining why this combo ranks high */
  reasonKey: string;
}
