(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.FreeSurfLibHeatmap = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function buildDaypartHeatmapData(dayKey, candidateSpots, options = {}) {
    if (!dayKey || !Array.isArray(candidateSpots) || !candidateSpots.length) return [];

    const getSpotId = options.getSpotId;
    const getSpotName = options.getSpotName;
    const getSlotsForSpot = options.getSlotsForSpot;
    const getQualityNoFilters = options.getQualityNoFilters;
    const buildSlotKey = options.buildSlotKey;
    const dayPartOrder = Array.isArray(options.dayPartOrder) && options.dayPartOrder.length
      ? options.dayPartOrder
      : ['morning', 'afternoon', 'evening'];

    if (
      typeof getSpotId !== 'function' ||
      typeof getSpotName !== 'function' ||
      typeof getSlotsForSpot !== 'function' ||
      typeof getQualityNoFilters !== 'function' ||
      typeof buildSlotKey !== 'function'
    ) {
      return [];
    }

    return candidateSpots
      .map((spot) => {
        const spotId = getSpotId(spot);
        const slotsForDay = getSlotsForSpot(spot)
          .filter((slotContext) => slotContext?.dayKey === dayKey);

        const scoresByDayPart = dayPartOrder.reduce((accumulator, dayPart) => {
          const partSlots = slotsForDay
            .filter((slotContext) => slotContext?.dayPart === dayPart)
            .map((slotContext) => ({
              slotContext,
              quality: getQualityNoFilters(slotContext)
            }))
            .sort((left, right) => right.quality.score - left.quality.score);

          const best = partSlots[0] ?? null;
          accumulator[dayPart] = best
            ? {
              score: best.quality.score,
              slotOffset: best.slotContext.offsetHours,
              slotKey: buildSlotKey(best.slotContext)
            }
            : null;

          return accumulator;
        }, {});

        const hasAnyScore = dayPartOrder.some((dayPart) => Number.isFinite(scoresByDayPart[dayPart]?.score));

        return {
          spotId,
          spotName: getSpotName(spot),
          scoresByDayPart,
          hasAnyScore
        };
      })
      .filter((row) => row.hasAnyScore);
  }

  return {
    buildDaypartHeatmapData
  };
});
