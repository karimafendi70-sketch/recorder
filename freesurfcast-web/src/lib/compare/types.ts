/* ── Compare types ────────────────────────────── */

import type { RatingBucket, SizeBand } from "@/lib/alerts/types";
import type { SurfWindow } from "@/lib/forecast/surfWindows";
import type { ConditionSummary } from "@/lib/forecast/conditions";

/**
 * Fully-resolved forecast summary for one (spot + day) combo
 * that the compare view can render as a column.
 */
export interface SpotDayColumn {
  spotId: string;
  spotName: string;
  country: string;
  dayKey: string;
  dayLabel: string;

  /* ── Scores ── */
  avgScore: number;
  ratingBucket: RatingBucket;

  /* ── Wave / conditions snapshot (from best slot) ── */
  waveHeightM: number | null;
  wavePeriodS: number | null;
  windSpeedKn: number | null;
  windDirDeg: number | null;
  sizeBand: SizeBand | null;
  conditions: ConditionSummary | null;

  /* ── Best window ── */
  bestWindow: SurfWindow | null;

  /* ── Raw slot count ── */
  slotCount: number;
}
