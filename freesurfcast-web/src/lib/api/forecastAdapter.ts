/* ──────────────────────────────────────────────
 *  Forecast Adapter
 *
 *  Converts Open-Meteo raw data → ForecastSlot[]
 *  so the existing scoring engine works without
 *  any changes.
 *
 *  Key mappings:
 *    mergedSpot.golfHoogteMeter   ← waveHeight (m)
 *    mergedSpot.golfPeriodeSeconden ← wavePeriod (s)
 *    mergedSpot.windDirectionDeg  ← windDirection (°)
 *    mergedSpot.coastOrientationDeg ← catalog value
 * ────────────────────────────────────────────── */

import type { RawForecastPoint, RawForecastResponse } from "./openMeteoClient";
import type { SurfSpot } from "@/lib/spots/catalog";
import type {
  ForecastSlot,
  ForecastSpot,
  DayPart,
} from "@/app/forecast/mockData";

/* ── Daypart assignment ──────────────────────── */

/** Slot template with fixed hours. We pick the closest data point. */
interface SlotDef {
  label: ForecastSlot["label"];
  targetHour: number;
  dayPart: DayPart;
  timeLabel: string;
}

const SLOT_DEFS: SlotDef[] = [
  { label: "Early",   targetHour: 6,  dayPart: "morning",   timeLabel: "06:00" },
  { label: "Mid",     targetHour: 10, dayPart: "morning",   timeLabel: "10:00" },
  { label: "Late",    targetHour: 14, dayPart: "afternoon",  timeLabel: "14:00" },
  { label: "Evening", targetHour: 18, dayPart: "evening",    timeLabel: "18:00" },
];

/* ── Condition tag heuristic ─────────────────── */

function deriveConditionTag(
  point: RawForecastPoint,
  coastDeg: number,
): "clean" | "mixed" | "choppy" {
  const windSpeed = point.windSpeed ?? 0;
  const windDir = point.windDirection ?? 0;

  // Offshore / cross-offshore → prefer clean
  const diff = (((windDir - coastDeg) % 360) + 360) % 360;
  const isOffshore = diff >= 135 && diff <= 225;
  const isCross = (diff > 45 && diff < 135) || (diff > 225 && diff < 315);

  if (isOffshore && windSpeed < 20) return "clean";
  if (isCross && windSpeed < 15) return "mixed";
  if (windSpeed > 25) return "choppy";
  if (isOffshore) return "mixed";
  return windSpeed < 12 ? "mixed" : "choppy";
}

/* ── Find the best data point for a target hour ── */

function pickPointForHour(
  points: RawForecastPoint[],
  todayDateStr: string,
  targetHour: number,
): RawForecastPoint | null {
  // Points are ISO strings like "2026-02-14T06:00"
  const target = `${todayDateStr}T${String(targetHour).padStart(2, "0")}:00`;
  const exact = points.find((p) => p.time === target);
  if (exact) return exact;

  // Fallback: closest hour on the same day
  let best: RawForecastPoint | null = null;
  let bestDist = Infinity;
  for (const p of points) {
    if (!p.time.startsWith(todayDateStr)) continue;
    const hour = parseInt(p.time.split("T")[1], 10);
    const dist = Math.abs(hour - targetHour);
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }
  return best;
}

/* ── Main adapter ────────────────────────────── */

/**
 * Convert a raw API response into the existing `ForecastSpot` shape
 * so the scoring pipeline stays untouched.
 */
export function adaptToForecastSpot(
  raw: RawForecastResponse,
  catalogSpot: SurfSpot,
  dayKey: string,
): ForecastSpot {
  // Derive the date string from the first data point (timezone-aware)
  const todayDateStr =
    raw.points.length > 0
      ? raw.points[0].time.split("T")[0]
      : new Date().toISOString().split("T")[0];

  const slots: ForecastSlot[] = SLOT_DEFS.map((def) => {
    const point = pickPointForHour(raw.points, todayDateStr, def.targetHour);

    const waveH = point?.waveHeight ?? point?.swellHeight ?? catalogSpot.waveHeightM;
    const waveP = point?.wavePeriod ?? point?.swellPeriod ?? catalogSpot.wavePeriodS;
    const windDir = point?.windDirection ?? catalogSpot.windDirectionDeg;
    const windSpd = point?.windSpeed ?? catalogSpot.windSpeedKnots;

    const conditionTag = point
      ? deriveConditionTag(point, catalogSpot.coastOrientationDeg)
      : "mixed";

    const challenging = windSpd > 14 && def.targetHour >= 14;

    return {
      id: `${dayKey}-${raw.spotId}-${def.label.toLowerCase()}`,
      label: def.label,
      timeLabel: point ? point.time.split("T")[1].slice(0, 5) : def.timeLabel,
      dayPart: def.dayPart,
      dayKey,
      offsetHours: def.targetHour,
      conditionTag,
      challenging,
      tideSuitability: "good" as const,
      minSurfable: waveH >= 0.3,
      mergedSpot: {
        golfHoogteMeter: Math.round(waveH * 10) / 10,
        golfPeriodeSeconden: Math.max(5, Math.round(waveP)),
        windDirectionDeg: Math.round(windDir),
        coastOrientationDeg: catalogSpot.coastOrientationDeg,
        // Extra fields for future use
        windSpeedKnots: windSpd != null ? Math.round(windSpd * 10) / 10 : null,
        temperature: point?.temperature ?? null,
        cloudCover: point?.cloudCover ?? null,
        swellHeight: point?.swellHeight ?? null,
        swellPeriod: point?.swellPeriod ?? null,
        swellDirection: point?.swellDirection ?? null,
        waveDirection: point?.waveDirection ?? null,
      },
    };
  });

  return {
    id: raw.spotId,
    name: raw.spotName,
    slots,
  };
}

/**
 * Adapt multiple raw responses into ForecastSpot[].
 * If a spot's live data is missing, falls back to catalog baselines.
 */
export function adaptMultiSpot(
  raws: RawForecastResponse[],
  catalog: SurfSpot[],
  dayKey: string,
): ForecastSpot[] {
  const rawMap = new Map(raws.map((r) => [r.spotId, r]));

  return catalog.map((spot) => {
    const raw = rawMap.get(spot.id);
    if (raw) {
      return adaptToForecastSpot(raw, spot, dayKey);
    }
    // Fallback: build from catalog baselines (same as old mock logic)
    return buildFallbackSpot(spot, dayKey);
  });
}

/* ── Fallback (replicates old mock behaviour) ── */

function buildFallbackSpot(spot: SurfSpot, dayKey: string): ForecastSpot {
  const TEMPLATES = [
    { label: "Early" as const,   timeLabel: "06:00", dayPart: "morning" as const,   hour: 6,  waveFactor: 0.9,  periodDelta: 1,  windShift: -10, cond: "clean" as const, challenging: false, tide: "good" as const },
    { label: "Mid" as const,     timeLabel: "10:00", dayPart: "morning" as const,   hour: 10, waveFactor: 1.0,  periodDelta: 0,  windShift: 0,   cond: "clean" as const, challenging: false, tide: "good" as const },
    { label: "Late" as const,    timeLabel: "14:00", dayPart: "afternoon" as const, hour: 14, waveFactor: 1.15, periodDelta: -1, windShift: 25,  cond: "mixed" as const, challenging: false, tide: "less-ideal" as const },
    { label: "Evening" as const, timeLabel: "18:00", dayPart: "evening" as const,   hour: 18, waveFactor: 0.85, periodDelta: 0,  windShift: 10,  cond: "mixed" as const, challenging: false, tide: "good" as const },
  ];

  const slots: ForecastSlot[] = TEMPLATES.map((tpl) => ({
    id: `${dayKey}-${spot.id}-${tpl.label.toLowerCase()}`,
    label: tpl.label,
    timeLabel: tpl.timeLabel,
    dayPart: tpl.dayPart,
    dayKey,
    offsetHours: tpl.hour,
    conditionTag: tpl.cond,
    challenging: tpl.challenging || (spot.windSpeedKnots > 14 && tpl.hour >= 14),
    tideSuitability: tpl.tide,
    minSurfable: spot.waveHeightM * tpl.waveFactor >= 0.3,
    mergedSpot: {
      golfHoogteMeter: Math.round(spot.waveHeightM * tpl.waveFactor * 10) / 10,
      golfPeriodeSeconden: Math.max(5, spot.wavePeriodS + tpl.periodDelta),
      windDirectionDeg: (spot.windDirectionDeg + tpl.windShift + 360) % 360,
      coastOrientationDeg: spot.coastOrientationDeg,
    },
  }));

  return { id: spot.id, name: spot.name, slots };
}
