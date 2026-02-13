(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.FreeSurfLibScores = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function emptyQuality() {
    return {
      score: 0,
      reasons: [],
      breakdown: {
        base: 0,
        conditionTag: 0,
        waveHeightRange: 0,
        wavePeriod: 0,
        windDirection: 0,
        challengingPenalty: 0,
        tideEffect: 0,
        filtersPreference: 0,
        preferencesImpact: 0
      },
      rawScore: 0
    };
  }

  function getSlotQualityScore(slotContext, options = {}) {
    if (!slotContext) {
      return emptyQuality();
    }

    const filters = options.filters ?? {
      minSurfable: false,
      beginnerFriendly: false,
      preferClean: false
    };
    const userPreferences = options.userPreferences ?? null;
    const getWindDegreesForSpot = options.getWindDegreesForSpot;
    const getCoastOrientationDeg = options.getCoastOrientationDeg;
    const getWindRelativeToCoast = options.getWindRelativeToCoast;

    if (
      typeof getWindDegreesForSpot !== 'function' ||
      typeof getCoastOrientationDeg !== 'function' ||
      typeof getWindRelativeToCoast !== 'function'
    ) {
      return emptyQuality();
    }

    let score = 0;
    const reasons = [];
    const breakdown = {
      base: 0,
      conditionTag: 0,
      waveHeightRange: 0,
      wavePeriod: 0,
      windDirection: 0,
      challengingPenalty: 0,
      tideEffect: 0,
      filtersPreference: 0,
      preferencesImpact: 0
    };
    const spotValues = slotContext.mergedSpot ?? slotContext.values ?? {};

    if (slotContext.conditionTag === 'clean') {
      score += 3;
      breakdown.conditionTag += 3;
      reasons.push('clean');
    } else if (slotContext.conditionTag === 'mixed') {
      score += 1;
      breakdown.conditionTag += 1;
      reasons.push('mixed');
    } else {
      reasons.push('choppy');
    }

    const waveHeight = spotValues.golfHoogteMeter;
    if (Number.isFinite(waveHeight)) {
      if (waveHeight >= 0.9 && waveHeight <= 2.0) {
        score += 2;
        breakdown.waveHeightRange += 2;
        reasons.push('good-wave-height');
      } else if (waveHeight >= 0.7 && waveHeight <= 2.4) {
        score += 1;
        breakdown.waveHeightRange += 1;
        reasons.push('acceptable-wave-height');
      } else if (waveHeight > 2.8) {
        score -= 1;
        breakdown.waveHeightRange -= 1;
        reasons.push('heavy-wave-height');
      }
    }

    const wavePeriod = spotValues.golfPeriodeSeconden;
    if (Number.isFinite(wavePeriod) && wavePeriod >= 8) {
      score += 1;
      breakdown.wavePeriod += 1;
      reasons.push('good-period');
    }

    const windDegrees = getWindDegreesForSpot(spotValues);
    const coastOrientation = getCoastOrientationDeg(spotValues);
    const windRelative = getWindRelativeToCoast(coastOrientation, windDegrees);

    if (windRelative === 'offshore') {
      score += 1;
      breakdown.windDirection += 1;
      reasons.push('offshore');
    } else if (windRelative === 'onshore') {
      score -= 1;
      breakdown.windDirection -= 1;
      reasons.push('onshore');
    } else {
      reasons.push('cross');
    }

    if (slotContext.challenging) {
      score -= 2;
      breakdown.challengingPenalty -= 2;
      reasons.push('challenging');
    }

    if (slotContext.tideSuitability === 'good') {
      score += 1;
      breakdown.tideEffect += 1;
      reasons.push('tide-supportive');
    } else if (slotContext.tideSuitability === 'less-ideal') {
      score -= 1;
      breakdown.tideEffect -= 1;
      reasons.push('tide-less-ideal');
    }

    if (filters.minSurfable && !slotContext.minSurfable) {
      score -= 2;
      breakdown.filtersPreference -= 2;
      reasons.push('below-min-surfable-filter');
    }

    if (filters.beginnerFriendly && slotContext.challenging) {
      score -= 3;
      breakdown.filtersPreference -= 3;
      reasons.push('beginner-filter-penalty');
    }

    if (filters.preferClean) {
      if (slotContext.conditionTag === 'clean') {
        score += 1;
        breakdown.filtersPreference += 1;
        reasons.push('clean-preference-bonus');
      } else if (slotContext.conditionTag === 'choppy') {
        score -= 2;
        breakdown.filtersPreference -= 2;
        reasons.push('clean-preference-penalty');
      }
    }

    if (userPreferences) {
      if (Number.isFinite(waveHeight)) {
        if (waveHeight >= userPreferences.preferredMinHeight && waveHeight <= userPreferences.preferredMaxHeight) {
          score += 0.5;
          breakdown.preferencesImpact += 0.5;
          reasons.push('prefs-range-match');
        } else if (waveHeight > userPreferences.preferredMaxHeight + 0.6) {
          score -= 0.5;
          breakdown.preferencesImpact -= 0.5;
          reasons.push('prefs-range-too-big');
        } else if (waveHeight < userPreferences.preferredMinHeight - 0.4) {
          score -= 0.5;
          breakdown.preferencesImpact -= 0.5;
          reasons.push('prefs-range-too-small');
        }
      }

      if (userPreferences.likesClean) {
        if (slotContext.conditionTag === 'clean') {
          score += 0.5;
          breakdown.preferencesImpact += 0.5;
          reasons.push('prefs-clean-bonus');
        } else if (slotContext.conditionTag === 'choppy') {
          score -= 0.5;
          breakdown.preferencesImpact -= 0.5;
          reasons.push('prefs-clean-penalty');
        }
      }

      if (!userPreferences.canHandleChallenging && slotContext.challenging) {
        score -= 0.5;
        breakdown.preferencesImpact -= 0.5;
        reasons.push('prefs-challenging-penalty');
      }
    }

    const rawScore = score;
    return {
      score: Math.max(0, Math.min(10, rawScore)),
      reasons,
      breakdown,
      rawScore
    };
  }

  function getSpotDayScore(spot, dayKey, allSlotContextsForSpotAndDay, options = {}) {
    if (!spot || !dayKey || !Array.isArray(allSlotContextsForSpotAndDay) || !allSlotContextsForSpotAndDay.length) {
      return null;
    }

    const useActiveFilters = options.useActiveFilters !== false;
    const passesHardConditionFilters = options.passesHardConditionFilters;
    const getScore = options.getScore;
    const buildSlotKey = options.buildSlotKey;
    const getSpotKey = options.getSpotKey;

    if (
      typeof passesHardConditionFilters !== 'function' ||
      typeof getScore !== 'function' ||
      typeof buildSlotKey !== 'function' ||
      typeof getSpotKey !== 'function'
    ) {
      return null;
    }

    const filteredSlots = allSlotContextsForSpotAndDay
      .filter((slotContext) => slotContext?.dayKey === dayKey)
      .filter((slotContext) => (useActiveFilters ? passesHardConditionFilters(slotContext) : true));

    if (!filteredSlots.length) return null;

    const scoredSlots = filteredSlots
      .map((slotContext) => {
        const quality = getScore(slotContext);
        return {
          slotContext,
          score: quality.score,
          reasons: quality.reasons
        };
      })
      .sort((left, right) => right.score - left.score);

    const best = scoredSlots[0];
    const secondary = scoredSlots[1] ?? best;
    const aggregateScore = Math.round((((best.score + secondary.score) / 2) + Number.EPSILON) * 10) / 10;
    const bestSlot = best.slotContext;

    return {
      spotId: getSpotKey(spot),
      spot,
      dayKey,
      score: aggregateScore,
      bestSlotKey: buildSlotKey(bestSlot),
      bestSlotOffset: bestSlot.offsetHours,
      bestSlotContext: bestSlot,
      reasons: best.reasons
    };
  }

  function getScoreClassSuffix(score) {
    if (!Number.isFinite(score)) return 'neutral';
    if (score >= 7) return 'good';
    if (score >= 4.5) return 'ok';
    return 'poor';
  }

  return {
    getSlotQualityScore,
    getSpotDayScore,
    getScoreClassSuffix
  };
});
