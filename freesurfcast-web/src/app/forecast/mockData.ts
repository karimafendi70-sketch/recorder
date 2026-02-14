import type { SlotContext } from "@/lib/scores";

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

export function createMockSpots(dayKey: string): ForecastSpot[] {
  return [
    {
      id: "beach-a",
      name: "Beach A",
      slots: [
        slot(dayKey, "beach-a", "Early", "06:00", "morning", 6, "clean", false, "good", 1.2, 10, 210, 20),
        slot(dayKey, "beach-a", "Mid", "10:00", "morning", 10, "mixed", false, "good", 1.4, 9, 185, 20),
        slot(dayKey, "beach-a", "Late", "14:00", "afternoon", 14, "choppy", true, "less-ideal", 2.4, 8, 30, 20),
        slot(dayKey, "beach-a", "Evening", "18:00", "evening", 18, "mixed", false, "good", 1.0, 9, 155, 20),
      ],
    },
    {
      id: "point-b",
      name: "Point B",
      slots: [
        slot(dayKey, "point-b", "Early", "06:00", "morning", 6, "mixed", false, "good", 0.9, 8, 170, 25),
        slot(dayKey, "point-b", "Mid", "10:00", "morning", 10, "clean", false, "good", 1.1, 9, 190, 25),
        slot(dayKey, "point-b", "Late", "14:00", "afternoon", 14, "mixed", false, "less-ideal", 1.6, 8, 70, 25),
        slot(dayKey, "point-b", "Evening", "18:00", "evening", 18, "choppy", true, "less-ideal", 1.9, 7, 15, 25),
      ],
    },
    {
      id: "reef-c",
      name: "Reef C",
      slots: [
        slot(dayKey, "reef-c", "Early", "06:00", "morning", 6, "clean", false, "good", 1.6, 11, 200, 35),
        slot(dayKey, "reef-c", "Mid", "10:00", "morning", 10, "clean", false, "good", 1.8, 10, 215, 35),
        slot(dayKey, "reef-c", "Late", "14:00", "afternoon", 14, "mixed", true, "less-ideal", 2.5, 9, 40, 35),
        slot(dayKey, "reef-c", "Evening", "18:00", "evening", 18, "mixed", false, "good", 1.4, 9, 165, 35),
      ],
    },
    {
      id: "cove-d",
      name: "Cove D",
      slots: [
        slot(dayKey, "cove-d", "Early", "06:00", "morning", 6, "mixed", false, "good", 0.8, 8, 160, 10),
        slot(dayKey, "cove-d", "Mid", "10:00", "morning", 10, "mixed", false, "good", 1.0, 8, 170, 10),
        slot(dayKey, "cove-d", "Late", "14:00", "afternoon", 14, "mixed", false, "good", 1.2, 8, 145, 10),
        slot(dayKey, "cove-d", "Evening", "18:00", "evening", 18, "clean", false, "good", 0.9, 9, 190, 10),
      ],
    },
  ];
}

function slot(
  dayKey: string,
  spotId: string,
  label: ForecastSlot["label"],
  timeLabel: string,
  dayPart: DayPart,
  offsetHours: number,
  conditionTag: NonNullable<SlotContext["conditionTag"]>,
  challenging: boolean,
  tideSuitability: NonNullable<SlotContext["tideSuitability"]>,
  golfHoogteMeter: number,
  golfPeriodeSeconden: number,
  windDirectionDeg: number,
  coastOrientationDeg: number
): ForecastSlot {
  return {
    id: `${dayKey}-${spotId}-${label.toLowerCase()}`,
    label,
    timeLabel,
    dayPart,
    dayKey,
    offsetHours,
    conditionTag,
    challenging,
    tideSuitability,
    minSurfable: true,
    mergedSpot: {
      golfHoogteMeter,
      golfPeriodeSeconden,
      windDirectionDeg,
      coastOrientationDeg,
    },
  };
}
