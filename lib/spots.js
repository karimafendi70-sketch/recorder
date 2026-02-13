(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.FreeSurfLibSpots = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function buildMultiSpotOverview(dayKey, candidateSpots, options = {}) {
    if (!dayKey || !Array.isArray(candidateSpots) || !candidateSpots.length) {
      return [];
    }

    const getSlotsForSpot = options.getSlotsForSpot;
    const getSpotDayScore = options.getSpotDayScore;
    const topLimit = Number.isFinite(options.topLimit) ? options.topLimit : 5;

    if (typeof getSlotsForSpot !== 'function' || typeof getSpotDayScore !== 'function') {
      return [];
    }

    return candidateSpots
      .map((spot) => {
        const spotSlots = getSlotsForSpot(spot);
        if (!Array.isArray(spotSlots) || !spotSlots.length) return null;
        return getSpotDayScore(spot, dayKey, spotSlots);
      })
      .filter((item) => Boolean(item))
      .sort((left, right) => right.score - left.score)
      .slice(0, topLimit);
  }

  return {
    buildMultiSpotOverview
  };
});
