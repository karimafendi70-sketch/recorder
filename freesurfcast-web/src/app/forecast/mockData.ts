import type { SlotContext } from "@/lib/scores";
import { SPOT_CATALOG, type SurfSpot } from "@/lib/spots/catalog";

export type DayPart = "morning" | "afternoon" | "evening";

export type ForecastSlot = SlotContext & {
  id: string;
  label: "Early" | "Mid" | "Late" | "Evening";
  timeLabel: string;
  dayPart: DayPart;
};

export type ForecastSpot = {
  id: string;
  name: string;
  slots: ForecastSlot[];
};

/* ── Slot templates: each daypart gets realistic variation ── */

type SlotTemplate = {
  label: ForecastSlot["label"];
  timeLabel: string;
  dayPart: DayPart;
  offsetHours: number;
  /** Multiplier applied to baseline wave height */
  waveFactor: number;
  /** Offset added to baseline wave period */
  periodDelta: number;
  /** Degrees added to baseline wind direction (simulates shift) */
  windShift: number;
  conditionTag: NonNullable<SlotContext["conditionTag"]>;
  challenging: boolean;
  tideSuitability: NonNullable<SlotContext["tideSuitability"]>;
};

const SLOT_TEMPLATES: SlotTemplate[] = [
  {
    label: "Early",
    timeLabel: "06:00",
    dayPart: "morning",
    offsetHours: 6,
    waveFactor: 0.9,
    periodDelta: 1,
    windShift: -10,
    conditionTag: "clean",
    challenging: false,
    tideSuitability: "good",
  },
  {
    label: "Mid",
    timeLabel: "10:00",
    dayPart: "morning",
    offsetHours: 10,
    waveFactor: 1.0,
    periodDelta: 0,
    windShift: 0,
    conditionTag: "clean",
    challenging: false,
    tideSuitability: "good",
  },
  {
    label: "Late",
    timeLabel: "14:00",
    dayPart: "afternoon",
    offsetHours: 14,
    waveFactor: 1.15,
    periodDelta: -1,
    windShift: 25,
    conditionTag: "mixed",
    challenging: false,
    tideSuitability: "less-ideal",
  },
  {
    label: "Evening",
    timeLabel: "18:00",
    dayPart: "evening",
    offsetHours: 18,
    waveFactor: 0.85,
    periodDelta: 0,
    windShift: 10,
    conditionTag: "mixed",
    challenging: false,
    tideSuitability: "good",
  },
];

/* ── Generate ForecastSpot[] from the catalog (up to 16 days) ──
 *
 *  Each day uses a day-index `d` to apply sinusoidal variation
 *  so the 16 days show realistically different conditions.
 *  Without this, every day would be identical (same catalog
 *  baselines × same template factors).
 * ────────────────────────────────────────────────────────────── */

function buildSlots(dayKey: string, spot: SurfSpot): ForecastSlot[] {
  const baseDate = new Date();
  const baseDateStr = dayKey !== "today" ? dayKey : baseDate.toISOString().split("T")[0];
  const base = new Date(baseDateStr);

  const slots: ForecastSlot[] = [];
  for (let d = 0; d < 16; d++) {
    const dayDate = new Date(base);
    dayDate.setDate(base.getDate() + d);
    const dateStr = dayDate.toISOString().split("T")[0];

    // ── Day-dependent variation (d = 0..15) ──
    // Each array index corresponds to a unique day;
    // we use d to modulate wave height, wind, period and conditions.
    const waveMod   = 1.0 + 0.3 * Math.sin((d / 15) * Math.PI * 2);
    const windDrift  = Math.round(20 * Math.sin((d / 15) * Math.PI * 1.5));
    const windFactor = 1.0 + 0.25 * Math.cos((d / 15) * Math.PI * 2.5);
    const periodMod  = Math.round(1.5 * Math.sin((d / 15) * Math.PI * 1.8));
    const dayCondBase: NonNullable<SlotContext["conditionTag"]> =
      waveMod > 1.15 ? "clean" : windFactor > 1.15 ? "choppy" : "mixed";
    const dayTide: NonNullable<SlotContext["tideSuitability"]> =
      d % 3 === 2 ? "less-ideal" : "good";

    for (const tpl of SLOT_TEMPLATES) {
      const waveH  = spot.waveHeightM * tpl.waveFactor * waveMod;
      const waveP  = Math.max(5, spot.wavePeriodS + tpl.periodDelta + periodMod);
      const windDir = (spot.windDirectionDeg + tpl.windShift + windDrift + 360) % 360;
      const windSpd = (spot.windSpeedKnots ?? 10) * windFactor;
      const cond    = tpl.conditionTag === "clean" ? dayCondBase : tpl.conditionTag;
      const tide    = tpl.tideSuitability === "good" ? dayTide : tpl.tideSuitability;

      slots.push({
        id: `${dateStr}-${spot.id}-${tpl.label.toLowerCase()}`,
        label: tpl.label,
        timeLabel: tpl.timeLabel,
        dayPart: tpl.dayPart,
        dayKey: dateStr,
        offsetHours: d * 24 + tpl.offsetHours,
        conditionTag: cond,
        challenging: tpl.challenging || (windSpd > 14 && tpl.offsetHours >= 14),
        tideSuitability: tide,
        minSurfable: waveH >= 0.3,
        mergedSpot: {
          golfHoogteMeter: Math.round(waveH * 10) / 10,
          golfPeriodeSeconden: waveP,
          windDirectionDeg: Math.round(windDir),
          coastOrientationDeg: spot.coastOrientationDeg,
          windSpeedKnots: Math.round(windSpd * 10) / 10,
        },
      });
    }
  }

  return slots;
}

/**
 * Build ForecastSpot[] from the full catalog.
 * Drop-in replacement for the old `createMockSpots`.
 */
export function createCatalogSpots(dayKey: string): ForecastSpot[] {
  return SPOT_CATALOG.map((spot) => ({
    id: spot.id,
    name: spot.name,
    slots: buildSlots(dayKey, spot),
  }));
}

/**
 * @deprecated Use `createCatalogSpots` instead.
 * Kept temporarily so existing call-sites work without changes.
 */
export const createMockSpots = createCatalogSpots;
