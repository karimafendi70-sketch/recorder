export type HeatmapCell = {
  score: number;
  slotOffset: number | undefined;
  slotKey: string | null;
} | null;

export type HeatmapRow = {
  spotId: string;
  spotName: string;
  scoresByDayPart: Record<string, HeatmapCell>;
  hasAnyScore: boolean;
};

export function buildDaypartHeatmapData<TSpot, TSlotContext>(
  dayKey: string,
  candidateSpots: TSpot[],
  options: {
    getSpotId: (spot: TSpot) => string;
    getSpotName: (spot: TSpot) => string;
    getSlotsForSpot: (spot: TSpot) => TSlotContext[];
    getQualityNoFilters: (slotContext: TSlotContext) => { score: number };
    buildSlotKey: (slotContext: TSlotContext) => string | null;
    dayPartOrder?: string[];
  }
): HeatmapRow[] {
  if (!dayKey || !Array.isArray(candidateSpots) || !candidateSpots.length) return [];

  const dayPartOrder = Array.isArray(options.dayPartOrder) && options.dayPartOrder.length
    ? options.dayPartOrder
    : ["morning", "afternoon", "evening"];

  return candidateSpots
    .map((spot) => {
      const slotsForDay = options
        .getSlotsForSpot(spot)
        .filter((slotContext) => (slotContext as { dayKey?: string })?.dayKey === dayKey);

      const scoresByDayPart = dayPartOrder.reduce<Record<string, HeatmapCell>>((accumulator, dayPart) => {
        const partSlots = slotsForDay
          .filter((slotContext) => (slotContext as { dayPart?: string })?.dayPart === dayPart)
          .map((slotContext) => ({
            slotContext,
            quality: options.getQualityNoFilters(slotContext),
          }))
          .sort((left, right) => right.quality.score - left.quality.score);

        const best = partSlots[0] ?? null;
        accumulator[dayPart] = best
          ? {
            score: best.quality.score,
            slotOffset: (best.slotContext as { offsetHours?: number }).offsetHours,
            slotKey: options.buildSlotKey(best.slotContext),
          }
          : null;

        return accumulator;
      }, {});

      const hasAnyScore = dayPartOrder.some((dayPart) => Number.isFinite(scoresByDayPart[dayPart]?.score));

      return {
        spotId: options.getSpotId(spot),
        spotName: options.getSpotName(spot),
        scoresByDayPart,
        hasAnyScore,
      };
    })
    .filter((row) => row.hasAnyScore);
}
