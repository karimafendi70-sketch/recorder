export function buildMultiSpotOverview<TSpot, TScore>(
  dayKey: string,
  candidateSpots: TSpot[],
  options: {
    getSlotsForSpot: (spot: TSpot) => unknown[];
    getSpotDayScore: (spot: TSpot, dayKey: string, slots: unknown[]) => TScore | null;
    topLimit?: number;
  }
): TScore[] {
  if (!dayKey || !Array.isArray(candidateSpots) || !candidateSpots.length) return [];

  const topLimit = Number.isFinite(options.topLimit) ? Number(options.topLimit) : 5;

  return candidateSpots
    .map((spot) => {
      const spotSlots = options.getSlotsForSpot(spot);
      if (!Array.isArray(spotSlots) || !spotSlots.length) return null;
      return options.getSpotDayScore(spot, dayKey, spotSlots);
    })
    .filter((item): item is TScore => Boolean(item))
    .sort((left, right) => {
      const leftScore = Number((left as { score?: number }).score ?? 0);
      const rightScore = Number((right as { score?: number }).score ?? 0);
      return rightScore - leftScore;
    })
    .slice(0, topLimit);
}
