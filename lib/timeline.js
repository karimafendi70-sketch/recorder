(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.FreeSurfLibTimeline = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function buildTimelineDataForDay(spotId, dayKey, allSlotsForSpotAndDay, options = {}) {
    if (!spotId || !dayKey || !Array.isArray(allSlotsForSpotAndDay)) return [];

    const passesHardConditionFilters = options.passesHardConditionFilters;
    const getScore = options.getScore;
    const buildSlotKey = options.buildSlotKey;
    const formatTime = options.formatTime;

    if (
      typeof passesHardConditionFilters !== 'function' ||
      typeof getScore !== 'function' ||
      typeof buildSlotKey !== 'function' ||
      typeof formatTime !== 'function'
    ) {
      return [];
    }

    return allSlotsForSpotAndDay
      .filter((slotContext) => slotContext?.dayKey === dayKey)
      .filter((slotContext) => passesHardConditionFilters(slotContext))
      .sort((left, right) => left.offsetHours - right.offsetHours)
      .map((slotContext) => {
        const quality = getScore(slotContext);

        return {
          time: formatTime(slotContext),
          dayPart: slotContext.dayPart,
          score: quality.score,
          quality,
          slotKey: buildSlotKey(slotContext),
          slotOffset: slotContext.offsetHours
        };
      });
  }

  return {
    buildTimelineDataForDay
  };
});
