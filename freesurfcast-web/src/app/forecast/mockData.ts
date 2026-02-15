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

/* ── Generate ForecastSpot[] from the catalog (up to 16 days) ── */

function buildSlots(dayKey: string, spot: SurfSpot): ForecastSlot[] {
  const baseDate = new Date();
  const baseDateStr = dayKey !== "today" ? dayKey : baseDate.toISOString().split("T")[0];
  const base = new Date(baseDateStr);

  const slots: ForecastSlot[] = [];
  for (let d = 0; d < 16; d++) {
    const dayDate = new Date(base);
    dayDate.setDate(base.getDate() + d);
    const dateStr = dayDate.toISOString().split("T")[0];

    for (const tpl of SLOT_TEMPLATES) {
      slots.push({
        id: `${dateStr}-${spot.id}-${tpl.label.toLowerCase()}`,
        label: tpl.label,
        timeLabel: tpl.timeLabel,
        dayPart: tpl.dayPart,
        dayKey: dateStr,
        offsetHours: d * 24 + tpl.offsetHours,
        conditionTag: tpl.conditionTag,
        challenging: tpl.challenging || (spot.windSpeedKnots > 14 && tpl.offsetHours >= 14),
        tideSuitability: tpl.tideSuitability,
        minSurfable: spot.waveHeightM * tpl.waveFactor >= 0.3,
        mergedSpot: {
          golfHoogteMeter: Math.round(spot.waveHeightM * tpl.waveFactor * 10) / 10,
          golfPeriodeSeconden: Math.max(5, spot.wavePeriodS + tpl.periodDelta),
          windDirectionDeg: (spot.windDirectionDeg + tpl.windShift + 360) % 360,
          coastOrientationDeg: spot.coastOrientationDeg,
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
