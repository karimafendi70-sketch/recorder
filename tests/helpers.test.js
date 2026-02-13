function normalizeWindDegrees(degrees) {
  if (!Number.isFinite(degrees)) return null;
  const normalized = ((degrees % 360) + 360) % 360;
  return Math.round(normalized);
}

function formatWindDirection(directionOrDegrees) {
  const degrees = Number.isFinite(directionOrDegrees)
    ? normalizeWindDegrees(directionOrDegrees)
    : null;

  if (!Number.isFinite(degrees)) {
    if (typeof directionOrDegrees === 'string' && directionOrDegrees.trim()) {
      return directionOrDegrees.trim().toUpperCase();
    }
    return '-';
  }

  const compassDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return compassDirections[index];
}

function formatWindSpeed(speedValue) {
  if (!Number.isFinite(speedValue)) return '-';
  return `${Math.round(speedValue)} kn`;
}

function getSwellClassName(waveHeight) {
  if (!Number.isFinite(waveHeight)) return 'swell-low';
  if (waveHeight < 0.8) return 'swell-low';
  if (waveHeight < 1.6) return 'swell-med';
  if (waveHeight < 2.6) return 'swell-high';
  return 'swell-very-high';
}

function directionToDegrees(direction) {
  if (typeof direction !== 'string') return null;

  const normalizedDirection = direction.trim().toUpperCase();
  const degreesByDirection = {
    N: 0,
    NO: 45,
    NE: 45,
    O: 90,
    E: 90,
    ZO: 135,
    SE: 135,
    Z: 180,
    S: 180,
    ZW: 225,
    SW: 225,
    W: 270,
    NW: 315
  };

  return degreesByDirection[normalizedDirection] ?? null;
}

function getWindDegreesForSpot(spot) {
  if (!spot) return null;

  const directDegrees = normalizeWindDegrees(spot.windRichtingGraden);
  if (Number.isFinite(directDegrees)) return directDegrees;

  return directionToDegrees(spot.windRichting);
}

function getAngularDifferenceDegrees(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  const normalizedA = normalizeWindDegrees(a);
  const normalizedB = normalizeWindDegrees(b);
  const diff = Math.abs(normalizedA - normalizedB);
  return Math.min(diff, 360 - diff);
}

function getCoastOrientationDeg(spot) {
  const explicitOrientation = normalizeWindDegrees(spot?.coastOrientationDeg);
  if (Number.isFinite(explicitOrientation)) {
    return explicitOrientation;
  }
  return 270;
}

function getWindRelativeToCoast(coastOrientationDeg, windDirectionDeg) {
  if (!Number.isFinite(coastOrientationDeg) || !Number.isFinite(windDirectionDeg)) {
    return 'cross';
  }

  const onshoreCenter = normalizeWindDegrees(coastOrientationDeg);
  const offshoreCenter = normalizeWindDegrees(coastOrientationDeg + 180);
  const onshoreDiff = getAngularDifferenceDegrees(windDirectionDeg, onshoreCenter);
  const offshoreDiff = getAngularDifferenceDegrees(windDirectionDeg, offshoreCenter);

  if (offshoreDiff <= 45) return 'offshore';
  if (onshoreDiff <= 45) return 'onshore';
  return 'cross';
}

function isChallengingConditions(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;
  const windSpeed = conditions?.windSnelheidKnopen;

  return waveHeight > 2.3 || windSpeed >= 18 || wavePeriod >= 12;
}

function getSurfConditionTag(snapshot) {
  if (!snapshot) return 'mixed';

  const windDirectionDeg = getWindDegreesForSpot(snapshot);
  const windSpeed = snapshot.windSnelheidKnopen;
  const waveHeight = snapshot.golfHoogteMeter;
  const coastOrientation = getCoastOrientationDeg(snapshot);
  const windRelative = getWindRelativeToCoast(coastOrientation, windDirectionDeg);
  const hasSteadySwell = Number.isFinite(waveHeight) && waveHeight >= 0.8;
  const hardWind = Number.isFinite(windSpeed) && windSpeed >= 17;
  const moderateWind = Number.isFinite(windSpeed) && windSpeed <= 14;
  const challenging = isChallengingConditions(snapshot);

  if (windRelative === 'onshore' || hardWind) {
    return 'choppy';
  }

  if (windRelative === 'offshore' && moderateWind && hasSteadySwell && !challenging) {
    return 'clean';
  }

  return 'mixed';
}

function isMinSurfableConditions(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;

  return Number.isFinite(waveHeight) && Number.isFinite(wavePeriod) && waveHeight >= 0.9 && wavePeriod >= 7;
}

function getLocalDateKey(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayPart(timestamp) {
  if (!timestamp) return 'evening';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'evening';

  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

function buildSlotKey(slotContext) {
  if (!slotContext?.dayKey || !Number.isFinite(slotContext.offsetHours)) return null;
  return `${slotContext.dayKey}-${slotContext.offsetHours}`;
}

function getSelectedSlotContext(allSlotContexts, selectedSlotKey) {
  if (!Array.isArray(allSlotContexts) || !allSlotContexts.length) return null;

  if (selectedSlotKey) {
    const match = allSlotContexts.find((slotContext) => buildSlotKey(slotContext) === selectedSlotKey);
    if (match) return match;
  }

  return allSlotContexts[0] ?? null;
}

function getWindStrengthLabel(speed) {
  if (!Number.isFinite(speed)) return 'moderate';
  if (speed <= 11) return 'light';
  if (speed >= 18) return 'strong';
  return 'moderate';
}

function getSwellHeightRangeText(spotValues) {
  const heights = [
    spotValues?.primaireGolfHoogteMeter,
    spotValues?.golfHoogteMeter,
    spotValues?.secundaireGolfHoogteMeter
  ].filter((value) => Number.isFinite(value));

  if (!heights.length) return '-';

  const minHeight = Math.min(...heights);
  const maxHeight = Math.max(...heights);
  if (Math.abs(maxHeight - minHeight) < 0.05) {
    return `${maxHeight.toFixed(1)} m`;
  }

  return `${minHeight.toFixed(1)}–${maxHeight.toFixed(1)} m`;
}

function getSwellDirectionDegrees(spot) {
  const swellDirection = normalizeWindDegrees(spot?.swellRichtingGraden);
  if (Number.isFinite(swellDirection)) return swellDirection;

  const waveDirection = normalizeWindDegrees(spot?.golfRichtingGraden);
  if (Number.isFinite(waveDirection)) return waveDirection;

  return null;
}

function getWindRelationLabel(slotContext) {
  const windDegrees = getWindDegreesForSpot(slotContext?.mergedSpot ?? slotContext?.values);
  const coastOrientation = getCoastOrientationDeg(slotContext?.mergedSpot);
  const relation = getWindRelativeToCoast(coastOrientation, windDegrees);

  if (relation === 'offshore') return 'offshore';
  if (relation === 'onshore') return 'onshore';
  return 'cross';
}

function formatWindDescription(slotContext) {
  const spotValues = slotContext?.mergedSpot ?? slotContext?.values ?? {};
  const windDegrees = getWindDegreesForSpot(spotValues);
  const windCompass = formatWindDirection(
    Number.isFinite(windDegrees) ? windDegrees : spotValues.windRichting
  );
  const windSpeed = formatWindSpeed(spotValues.windSnelheidKnopen);
  const windStrength = getWindStrengthLabel(spotValues.windSnelheidKnopen);
  const windRelation = getWindRelationLabel(slotContext);

  return `${windStrength} ${windCompass} ${windRelation} wind (${windSpeed})`;
}

function formatSwellDescription(slotContext) {
  const spotValues = slotContext?.mergedSpot ?? slotContext?.values ?? {};
  const waveHeight = getSwellHeightRangeText(spotValues);
  const wavePeriod = Number.isFinite(spotValues.golfPeriodeSeconden)
    ? `${Math.round(spotValues.golfPeriodeSeconden)} s`
    : '-';
  const swellDirection = getSwellDirectionDegrees(spotValues);
  const directionSegment = Number.isFinite(swellDirection)
    ? `${formatWindDirection(swellDirection)} (${Math.round(swellDirection)}°)`
    : '-';

  return `${waveHeight} ${directionSegment} swell @ ${wavePeriod}`;
}

function formatSkillAdvice(slotContext) {
  if (!slotContext) return 'intermediate';
  if (slotContext.challenging || slotContext.conditionTag === 'choppy') return 'advanced';
  if (slotContext.conditionTag === 'clean' && !slotContext.challenging) return 'beginner';
  return 'intermediate';
}

const TIDE_REGION_BY_APP_REGION = {
  eu: 'north-sea-atlantic',
  af: 'atlantic-open',
  am: 'pacific-mixed',
  ap: 'reef-tropical'
};

const TIDE_REGION_BY_SPOT_ID = {
  'scheveningen-nl': 'north-sea-atlantic',
  'ericeira-pt': 'atlantic-open',
  'pipeline-us-hi': 'pacific-mixed',
  'uluwatu-id': 'reef-tropical'
};

const TIDE_PROFILES_BY_REGION = {
  'north-sea-atlantic': {
    dayPartTideLevel: { morning: 'mid', afternoon: 'high', evening: 'mid' },
    preferredLevels: ['mid', 'high']
  },
  'atlantic-open': {
    dayPartTideLevel: { morning: 'mid', afternoon: 'high', evening: 'low' },
    preferredLevels: ['mid', 'high']
  },
  'pacific-mixed': {
    dayPartTideLevel: { morning: 'high', afternoon: 'mid', evening: 'low' },
    preferredLevels: ['mid', 'high']
  },
  'reef-tropical': {
    dayPartTideLevel: { morning: 'mid', afternoon: 'mid', evening: 'high' },
    preferredLevels: ['mid']
  }
};

function getSpotRegionForTests(spotOrId) {
  if (!spotOrId) return 'eu';
  if (typeof spotOrId === 'string') return 'eu';
  return spotOrId.region ?? 'eu';
}

function getTideRegionKeyForSpot(spotOrId) {
  if (!spotOrId) return null;
  const spotId = typeof spotOrId === 'string' ? spotOrId : spotOrId.id;
  if (spotId && TIDE_REGION_BY_SPOT_ID[spotId]) {
    return TIDE_REGION_BY_SPOT_ID[spotId];
  }

  const appRegion = getSpotRegionForTests(spotOrId);
  return TIDE_REGION_BY_APP_REGION[appRegion] ?? null;
}

function getTideProfileForSpot(spotOrId) {
  const key = getTideRegionKeyForSpot(spotOrId);
  return key ? (TIDE_PROFILES_BY_REGION[key] ?? null) : null;
}

function getTideLevelForSlot(spotOrId, slotContext) {
  const profile = getTideProfileForSpot(spotOrId);
  if (!profile || !slotContext) return null;
  const part = ['morning', 'afternoon', 'evening'].includes(slotContext.dayPart) ? slotContext.dayPart : 'evening';
  return profile.dayPartTideLevel?.[part] ?? null;
}

function getTideSuitabilityForSlot(spotOrId, slotContext) {
  const profile = getTideProfileForSpot(spotOrId);
  const level = getTideLevelForSlot(spotOrId, slotContext);
  if (!profile || !level) return null;
  return profile.preferredLevels.includes(level) ? 'good' : 'less-ideal';
}

function getSlotQualityScore(slotContext, filters = { minSurfable: false, beginnerFriendly: false, preferClean: false }) {
  if (!slotContext) {
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
        filtersPreference: 0
      },
      rawScore: 0
    };
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
    filtersPreference: 0
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

  if (Number.isFinite(spotValues.golfPeriodeSeconden) && spotValues.golfPeriodeSeconden >= 8) {
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
  }

  if (filters.beginnerFriendly && slotContext.challenging) {
    score -= 3;
    breakdown.filtersPreference -= 3;
  }

  if (filters.preferClean) {
    if (slotContext.conditionTag === 'clean') {
      score += 1;
      breakdown.filtersPreference += 1;
    }
    if (slotContext.conditionTag === 'choppy') {
      score -= 2;
      breakdown.filtersPreference -= 2;
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

function getSpotDayScore(spotId, dayKey, allSlotContextsForSpotAndDay, filters = {}) {
  if (!spotId || !dayKey || !Array.isArray(allSlotContextsForSpotAndDay) || !allSlotContextsForSpotAndDay.length) {
    return null;
  }

  const filteredSlots = allSlotContextsForSpotAndDay
    .filter((slotContext) => slotContext?.dayKey === dayKey)
    .filter((slotContext) => passesHardConditionFilters(slotContext, filters));

  if (!filteredSlots.length) return null;

  const scoredSlots = filteredSlots
    .map((slotContext) => ({
      slotContext,
      score: getSlotQualityScore(slotContext, filters).score
    }))
    .sort((left, right) => right.score - left.score);

  const best = scoredSlots[0];
  const secondary = scoredSlots[1] ?? best;
  const aggregateScore = Math.round((((best.score + secondary.score) / 2) + Number.EPSILON) * 10) / 10;

  return {
    spotId,
    dayKey,
    score: aggregateScore,
    bestSlotKey: buildSlotKey(best.slotContext)
  };
}

function getConditionTagFromSlots(slots) {
  const counts = slots.reduce((accumulator, slotContext) => {
    const tag = slotContext?.conditionTag ?? 'mixed';
    accumulator[tag] = (accumulator[tag] ?? 0) + 1;
    return accumulator;
  }, {});

  return ['clean', 'mixed', 'choppy'].reduce((bestTag, tag) => {
    const current = counts[tag] ?? 0;
    const best = counts[bestTag] ?? -1;
    return current > best ? tag : bestTag;
  }, 'mixed');
}

function getDominantSwellDirectionFromSlots(slots) {
  const countsByDirection = slots.reduce((accumulator, slotContext) => {
    const degrees = getSwellDirectionDegrees(slotContext?.mergedSpot ?? slotContext?.values);
    if (!Number.isFinite(degrees)) return accumulator;

    const direction = formatWindDirection(degrees);
    if (!direction || direction === '-') return accumulator;
    accumulator[direction] = (accumulator[direction] ?? 0) + 1;
    return accumulator;
  }, {});

  const [direction] = Object.entries(countsByDirection)
    .sort((left, right) => right[1] - left[1])[0] ?? [];

  return direction ?? '-';
}

function getBestSlotFromPartSlots(partSlots) {
  if (!Array.isArray(partSlots) || !partSlots.length) return null;

  return partSlots
    .map((slotContext) => ({
      slotContext,
      score: getSlotQualityScore(slotContext, { includeActiveFilters: false }).score
    }))
    .sort((left, right) => right.score - left.score)[0]?.slotContext ?? null;
}

function buildDaySummaryStats(spotId, dayKey, groupedSlotsForDay) {
  const dayParts = ['morning', 'afternoon', 'evening'];
  const daySlots = dayParts.flatMap((dayPart) => groupedSlotsForDay?.[dayPart] ?? []);

  if (!daySlots.length) {
    return {
      spotId,
      dayKey,
      hasData: false
    };
  }

  const heights = daySlots
    .map((slotContext) => slotContext?.mergedSpot?.golfHoogteMeter)
    .filter((value) => Number.isFinite(value));
  const periods = daySlots
    .map((slotContext) => slotContext?.mergedSpot?.golfPeriodeSeconden)
    .filter((value) => Number.isFinite(value));

  const challengingRatio = daySlots.filter((slotContext) => slotContext.challenging).length / daySlots.length;
  const dominantConditionTag = getConditionTagFromSlots(daySlots);
  let overallSkillLevel = 'intermediate';
  if (challengingRatio >= 0.5 || dominantConditionTag === 'choppy') {
    overallSkillLevel = 'advanced';
  } else if (dominantConditionTag === 'clean' && challengingRatio <= 0.2) {
    overallSkillLevel = 'beginner';
  }

  const morningSlot = getBestSlotFromPartSlots(groupedSlotsForDay?.morning ?? []);
  const afternoonSlot = getBestSlotFromPartSlots(groupedSlotsForDay?.afternoon ?? []);
  const eveningSlot = getBestSlotFromPartSlots(groupedSlotsForDay?.evening ?? []);

  const tideKnownSlots = daySlots.filter((slotContext) => Boolean(slotContext?.tideLevel));
  const tideCounts = tideKnownSlots.reduce((accumulator, slotContext) => {
    accumulator[slotContext.tideLevel] = (accumulator[slotContext.tideLevel] ?? 0) + 1;
    return accumulator;
  }, {});
  const dominantTideLevel = ['mid', 'high', 'low'].reduce((bestLevel, level) => {
    const bestCount = tideCounts[bestLevel] ?? -1;
    const levelCount = tideCounts[level] ?? 0;
    return levelCount > bestCount ? level : bestLevel;
  }, 'mid');
  const supportiveTideRatio = tideKnownSlots.length
    ? tideKnownSlots.filter((slotContext) => slotContext.tideSuitability === 'good').length / tideKnownSlots.length
    : 0;

  return {
    spotId,
    dayKey,
    hasData: true,
    minHeight: heights.length ? Math.min(...heights) : null,
    maxHeight: heights.length ? Math.max(...heights) : null,
    minPeriod: periods.length ? Math.min(...periods) : null,
    maxPeriod: periods.length ? Math.max(...periods) : null,
    dominantSwellDirText: getDominantSwellDirectionFromSlots(daySlots),
    dominantConditionTag,
    morningConditionTag: morningSlot?.conditionTag ?? null,
    afternoonConditionTag: afternoonSlot?.conditionTag ?? null,
    eveningConditionTag: eveningSlot?.conditionTag ?? null,
    morningWindDesc: morningSlot ? formatWindDescription(morningSlot) : null,
    afternoonWindDesc: afternoonSlot ? formatWindDescription(afternoonSlot) : null,
    eveningWindDesc: eveningSlot ? formatWindDescription(eveningSlot) : null,
    overallSkillLevel,
    hasTideContext: tideKnownSlots.length > 0,
    dominantTideLevel: tideKnownSlots.length ? dominantTideLevel : null,
    supportiveTideRatio
  };
}

function buildDailySurfReportLines(dayStats, dayKey, language = 'en') {
  const languageCode = language === 'nl' ? 'nl' : 'en';

  if (!dayStats?.hasData) {
    return [languageCode === 'nl' ? 'Onvoldoende data voor een dagrapport.' : 'Not enough data for a daily surf report.'];
  }

  const heightRange = Number.isFinite(dayStats.minHeight) && Number.isFinite(dayStats.maxHeight)
    ? `${dayStats.minHeight.toFixed(1)}–${dayStats.maxHeight.toFixed(1)} m`
    : '-';
  const periodRange = Number.isFinite(dayStats.minPeriod) && Number.isFinite(dayStats.maxPeriod)
    ? `${Math.round(dayStats.minPeriod)}–${Math.round(dayStats.maxPeriod)} s`
    : '-';

  const lineOne = languageCode === 'nl'
    ? `${dayKey}: ${heightRange} ${dayStats.dominantSwellDirText}-swell met ${periodRange} periode, overwegend ${dayStats.dominantConditionTag}.`
    : `${dayKey}: ${heightRange} ${dayStats.dominantSwellDirText} swell with ${periodRange} period, mostly ${dayStats.dominantConditionTag}.`;

  const dayPartWindSegments = [
    ['morning', dayStats.morningWindDesc],
    ['afternoon', dayStats.afternoonWindDesc],
    ['evening', dayStats.eveningWindDesc]
  ]
    .filter(([, value]) => Boolean(value))
    .map(([part, value]) => `${part} ${value}`);

  const lineTwo = dayPartWindSegments.length ? `Wind: ${dayPartWindSegments.join(', ')}.` : null;
  const tideLabelByLevel = {
    low: languageCode === 'nl' ? 'laag' : 'low',
    mid: languageCode === 'nl' ? 'mid' : 'mid',
    high: languageCode === 'nl' ? 'hoog' : 'high'
  };
  const tideLine = dayStats?.hasTideContext && dayStats?.dominantTideLevel
    ? (languageCode === 'nl'
      ? `Getij: vooral ${tideLabelByLevel[dayStats.dominantTideLevel]} water tijdens de belangrijkste surfmomenten.`
      : `Tide: mostly ${tideLabelByLevel[dayStats.dominantTideLevel]} water during the main surf windows.`)
    : null;
  const adviceByLevel = {
    beginner: languageCode === 'nl' ? 'meestal geschikt voor beginners' : 'usually suitable for beginners',
    intermediate: languageCode === 'nl' ? 'het beste voor intermediate surfers' : 'best for intermediate surfers',
    advanced: languageCode === 'nl' ? 'vooral geschikt voor gevorderden' : 'mostly suitable for advanced surfers'
  };
  const lineThree = `${languageCode === 'nl' ? 'Advies' : 'Advice'}: ${adviceByLevel[dayStats.overallSkillLevel] ?? adviceByLevel.intermediate}.`;
  const tideAdvice = dayStats?.hasTideContext
    ? (dayStats.supportiveTideRatio >= 0.5
      ? (languageCode === 'nl'
        ? 'De meeste sessies vallen in het voorkeurvenster van dit spot-profiel.'
        : 'Most sessions align with this spot profile\'s preferred tide window.')
      : (languageCode === 'nl'
        ? 'Een deel van de sessies valt buiten het voorkeurvenster van dit spot-profiel.'
        : 'Some sessions fall outside this spot profile\'s preferred tide window.'))
    : null;

  return [lineOne, lineTwo, tideLine, lineThree, tideAdvice].filter((line) => Boolean(line));
}

function passesHardConditionFilters(slotContext, filters) {
  if (!slotContext) return false;

  if (filters?.minSurfable && !slotContext.minSurfable) {
    return false;
  }

  if (filters?.beginnerFriendly && slotContext.challenging) {
    return false;
  }

  return true;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label} failed: expected "${expected}", got "${actual}"`);
  }
}

function runWindDirectionTests() {
  const cases = [
    [0, 'N'],
    [45, 'NE'],
    [90, 'E'],
    [135, 'SE'],
    [180, 'S'],
    [225, 'SW'],
    [270, 'W'],
    [315, 'NW'],
    [360, 'N'],
    [-10, 'N'],
    [' zo ', 'ZO'],
    ['', '-'],
    [null, '-']
  ];

  cases.forEach(([input, expected]) => {
    assertEqual(formatWindDirection(input), expected, `formatWindDirection(${input})`);
  });
}

function runWindSpeedTests() {
  assertEqual(formatWindSpeed(12), '12 kn', 'formatWindSpeed(12)');
  assertEqual(formatWindSpeed(12.6), '13 kn', 'formatWindSpeed(12.6)');
  assertEqual(formatWindSpeed(NaN), '-', 'formatWindSpeed(NaN)');
  assertEqual(formatWindSpeed(Infinity), '-', 'formatWindSpeed(Infinity)');
}

function runSwellClassTests() {
  const cases = [
    [Number.NaN, 'swell-low'],
    [0.3, 'swell-low'],
    [0.79, 'swell-low'],
    [0.8, 'swell-med'],
    [1.0, 'swell-med'],
    [1.59, 'swell-med'],
    [1.6, 'swell-high'],
    [2.0, 'swell-high'],
    [2.59, 'swell-high'],
    [2.6, 'swell-very-high'],
    [3.4, 'swell-very-high']
  ];

  cases.forEach(([input, expected]) => {
    assertEqual(getSwellClassName(input), expected, `getSwellClassName(${input})`);
  });
}

function runChallengingConditionsTests() {
  const cases = [
    [{ golfHoogteMeter: 2.31, golfPeriodeSeconden: 8, windSnelheidKnopen: 10 }, true],
    [{ golfHoogteMeter: 2.2, golfPeriodeSeconden: 12, windSnelheidKnopen: 10 }, true],
    [{ golfHoogteMeter: 2.2, golfPeriodeSeconden: 8, windSnelheidKnopen: 18 }, true],
    [{ golfHoogteMeter: 2.3, golfPeriodeSeconden: 11, windSnelheidKnopen: 17 }, false],
    [{ golfHoogteMeter: NaN, golfPeriodeSeconden: 8, windSnelheidKnopen: 10 }, false],
    [{ golfHoogteMeter: 2.0, golfPeriodeSeconden: null, windSnelheidKnopen: 10 }, false],
    [{ golfHoogteMeter: 2.29, golfPeriodeSeconden: 11.9, windSnelheidKnopen: 17.9 }, false],
    [undefined, false]
  ];

  cases.forEach(([input, expected], index) => {
    assertEqual(
      isChallengingConditions(input),
      expected,
      `isChallengingConditions(case ${index + 1})`
    );
  });
}

function runWindRelativeToCoastTests() {
  const cases = [
    [{ coast: 270, wind: 90 }, 'offshore'],
    [{ coast: 270, wind: 60 }, 'offshore'],
    [{ coast: 270, wind: 270 }, 'onshore'],
    [{ coast: 270, wind: 20 }, 'cross']
  ];

  cases.forEach(([input, expected], index) => {
    assertEqual(
      getWindRelativeToCoast(input.coast, input.wind),
      expected,
      `getWindRelativeToCoast(case ${index + 1})`
    );
  });
}

function runSurfConditionTagTests() {
  const cleanCase = {
    coastOrientationDeg: 270,
    windRichtingGraden: 90,
    windSnelheidKnopen: 12,
    golfHoogteMeter: 1.4,
    golfPeriodeSeconden: 9
  };

  const choppyCase = {
    coastOrientationDeg: 270,
    windRichtingGraden: 275,
    windSnelheidKnopen: 19,
    golfHoogteMeter: 1.8,
    golfPeriodeSeconden: 10
  };

  const mixedCase = {
    coastOrientationDeg: 270,
    windRichtingGraden: 20,
    windSnelheidKnopen: 14,
    golfHoogteMeter: 1.2,
    golfPeriodeSeconden: 8
  };

  assertEqual(getSurfConditionTag(cleanCase), 'clean', 'getSurfConditionTag(clean)');
  assertEqual(getSurfConditionTag(choppyCase), 'choppy', 'getSurfConditionTag(choppy)');
  assertEqual(getSurfConditionTag(mixedCase), 'mixed', 'getSurfConditionTag(mixed)');
}

function runMinSurfableTests() {
  const cases = [
    [{ golfHoogteMeter: 0.8, golfPeriodeSeconden: 7 }, false],
    [{ golfHoogteMeter: 0.9, golfPeriodeSeconden: 6.9 }, false],
    [{ golfHoogteMeter: 0.9, golfPeriodeSeconden: 7 }, true],
    [{ golfHoogteMeter: 1.4, golfPeriodeSeconden: 9 }, true],
    [{ golfHoogteMeter: Number.NaN, golfPeriodeSeconden: 8 }, false]
  ];

  cases.forEach(([input, expected], index) => {
    assertEqual(
      isMinSurfableConditions(input),
      expected,
      `isMinSurfableConditions(case ${index + 1})`
    );
  });
}

function runHardFilterCombinationTests() {
  const surfableCalm = {
    minSurfable: true,
    challenging: false
  };

  const unsurfableCalm = {
    minSurfable: false,
    challenging: false
  };

  const surfableChallenging = {
    minSurfable: true,
    challenging: true
  };

  assertEqual(
    passesHardConditionFilters(surfableCalm, { minSurfable: true, beginnerFriendly: true }),
    true,
    'passesHardConditionFilters(surfableCalm)'
  );
  assertEqual(
    passesHardConditionFilters(unsurfableCalm, { minSurfable: true, beginnerFriendly: false }),
    false,
    'passesHardConditionFilters(unsurfableCalm)'
  );
  assertEqual(
    passesHardConditionFilters(surfableChallenging, { minSurfable: false, beginnerFriendly: true }),
    false,
    'passesHardConditionFilters(surfableChallenging)'
  );
}

function runLocalDateKeyTests() {
  const iso = '2026-02-13T10:45:00Z';
  const key = getLocalDateKey(iso);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
    throw new Error(`getLocalDateKey format failed: got "${key}"`);
  }

  assertEqual(getLocalDateKey(null), null, 'getLocalDateKey(null)');
  assertEqual(getLocalDateKey('not-a-date'), null, 'getLocalDateKey(invalid)');
}

function runDayPartTests() {
  assertEqual(getDayPart('2026-02-13T06:00:00'), 'morning', 'getDayPart(morning)');
  assertEqual(getDayPart('2026-02-13T13:00:00'), 'afternoon', 'getDayPart(afternoon)');
  assertEqual(getDayPart('2026-02-13T20:00:00'), 'evening', 'getDayPart(evening)');
  assertEqual(getDayPart('invalid'), 'evening', 'getDayPart(invalid)');
}

function runSlotSelectionTests() {
  const slots = [
    { dayKey: '2026-02-13', offsetHours: 0 },
    { dayKey: '2026-02-13', offsetHours: 3 },
    { dayKey: '2026-02-14', offsetHours: 6 }
  ];

  assertEqual(buildSlotKey(slots[1]), '2026-02-13-3', 'buildSlotKey(valid)');
  assertEqual(buildSlotKey({ dayKey: null, offsetHours: 3 }), null, 'buildSlotKey(invalid)');

  const selected = getSelectedSlotContext(slots, '2026-02-14-6');
  assertEqual(selected.offsetHours, 6, 'getSelectedSlotContext(match)');

  const fallback = getSelectedSlotContext(slots, 'missing-key');
  assertEqual(fallback.offsetHours, 0, 'getSelectedSlotContext(fallback)');

  assertEqual(getSelectedSlotContext([], 'x'), null, 'getSelectedSlotContext(empty)');
}

function runSlotDetailHelperTests() {
  const offshoreSlot = {
    mergedSpot: {
      coastOrientationDeg: 270,
      windRichtingGraden: 90,
      windSnelheidKnopen: 10,
      golfHoogteMeter: 1.2,
      primaireGolfHoogteMeter: 1.0,
      secundaireGolfHoogteMeter: 1.5,
      golfPeriodeSeconden: 9,
      swellRichtingGraden: 290
    },
    conditionTag: 'clean',
    challenging: false
  };

  const onshoreSlot = {
    mergedSpot: {
      coastOrientationDeg: 270,
      windRichtingGraden: 270,
      windSnelheidKnopen: 22,
      golfHoogteMeter: 2.5,
      golfPeriodeSeconden: 11,
      swellRichtingGraden: 275
    },
    conditionTag: 'choppy',
    challenging: true
  };

  assertEqual(getWindStrengthLabel(9), 'light', 'getWindStrengthLabel(light)');
  assertEqual(getWindStrengthLabel(14), 'moderate', 'getWindStrengthLabel(moderate)');
  assertEqual(getWindStrengthLabel(20), 'strong', 'getWindStrengthLabel(strong)');

  assertEqual(getSwellHeightRangeText({ golfHoogteMeter: 1.2 }), '1.2 m', 'getSwellHeightRangeText(single)');
  assertEqual(
    getSwellHeightRangeText({ primaireGolfHoogteMeter: 1.0, golfHoogteMeter: 1.2, secundaireGolfHoogteMeter: 1.5 }),
    '1.0–1.5 m',
    'getSwellHeightRangeText(range)'
  );

  assertEqual(
    formatWindDescription(offshoreSlot),
    'light E offshore wind (10 kn)',
    'formatWindDescription(offshore)'
  );

  assertEqual(
    formatSwellDescription(offshoreSlot),
    '1.0–1.5 m W (290°) swell @ 9 s',
    'formatSwellDescription(with range)'
  );

  assertEqual(formatSkillAdvice(offshoreSlot), 'beginner', 'formatSkillAdvice(beginner)');
  assertEqual(formatSkillAdvice(onshoreSlot), 'advanced', 'formatSkillAdvice(advanced)');
  assertEqual(formatSkillAdvice({ conditionTag: 'mixed', challenging: false }), 'intermediate', 'formatSkillAdvice(intermediate)');
}

function runMultiSpotScoreTests() {
  const cleanOffshore = {
    dayKey: '2026-02-13',
    offsetHours: 3,
    conditionTag: 'clean',
    challenging: false,
    tideSuitability: 'good',
    tideLevel: 'mid',
    minSurfable: true,
    mergedSpot: {
      coastOrientationDeg: 270,
      windRichtingGraden: 90,
      windSnelheidKnopen: 11,
      golfHoogteMeter: 1.4,
      golfPeriodeSeconden: 9
    }
  };

  const choppyOnshore = {
    dayKey: '2026-02-13',
    offsetHours: 6,
    conditionTag: 'choppy',
    challenging: true,
    tideSuitability: 'less-ideal',
    tideLevel: 'low',
    minSurfable: true,
    mergedSpot: {
      coastOrientationDeg: 270,
      windRichtingGraden: 270,
      windSnelheidKnopen: 24,
      golfHoogteMeter: 2.9,
      golfPeriodeSeconden: 7
    }
  };

  const cleanScore = getSlotQualityScore(cleanOffshore).score;
  const choppyScore = getSlotQualityScore(choppyOnshore).score;
  const cleanBreakdown = getSlotQualityScore(cleanOffshore).breakdown;
  const choppyBreakdown = getSlotQualityScore(choppyOnshore).breakdown;

  if (!(cleanScore > choppyScore)) {
    throw new Error(`getSlotQualityScore ranking failed: cleanScore=${cleanScore}, choppyScore=${choppyScore}`);
  }

  if (!(cleanBreakdown.conditionTag > 0 && cleanBreakdown.windDirection > 0)) {
    throw new Error(`clean breakdown missing expected positives: ${JSON.stringify(cleanBreakdown)}`);
  }

  if (!(choppyBreakdown.challengingPenalty < 0 && choppyBreakdown.windDirection < 0)) {
    throw new Error(`choppy breakdown missing expected negatives: ${JSON.stringify(choppyBreakdown)}`);
  }

  const penalizedScore = getSlotQualityScore(cleanOffshore, { preferClean: true, minSurfable: true, beginnerFriendly: true }).score;
  if (!(penalizedScore >= cleanScore)) {
    throw new Error(`getSlotQualityScore filter bonus failed: penalizedScore=${penalizedScore}, cleanScore=${cleanScore}`);
  }

  const spotDay = getSpotDayScore('spot-a', '2026-02-13', [cleanOffshore, choppyOnshore], {
    minSurfable: false,
    beginnerFriendly: false,
    preferClean: false
  });

  if (!spotDay) {
    throw new Error('getSpotDayScore returned null unexpectedly');
  }

  assertEqual(spotDay.bestSlotKey, '2026-02-13-3', 'getSpotDayScore(bestSlotKey)');
}

function runTideHelpersTests() {
  const spot = { id: 'ericeira-pt', region: 'eu' };

  const morningSlot = { dayPart: 'morning' };
  const eveningSlot = { dayPart: 'evening' };

  assertEqual(getTideLevelForSlot(spot, morningSlot), 'mid', 'getTideLevelForSlot(morning)');
  assertEqual(getTideLevelForSlot(spot, eveningSlot), 'low', 'getTideLevelForSlot(evening)');
  assertEqual(getTideSuitabilityForSlot(spot, morningSlot), 'good', 'getTideSuitabilityForSlot(good)');
  assertEqual(getTideSuitabilityForSlot(spot, eveningSlot), 'less-ideal', 'getTideSuitabilityForSlot(less-ideal)');
  assertEqual(getTideLevelForSlot({ id: 'unknown-spot', region: 'xx' }, morningSlot), null, 'getTideLevelForSlot(unknown)');
}

function runTideScoreImpactTests() {
  const baseSlot = {
    dayKey: '2026-02-13',
    offsetHours: 3,
    conditionTag: 'clean',
    challenging: false,
    minSurfable: true,
    mergedSpot: {
      coastOrientationDeg: 270,
      windRichtingGraden: 90,
      windSnelheidKnopen: 11,
      golfHoogteMeter: 1.4,
      golfPeriodeSeconden: 9
    }
  };

  const scoreGoodTide = getSlotQualityScore({ ...baseSlot, tideSuitability: 'good' }).score;
  const scoreBadTide = getSlotQualityScore({ ...baseSlot, tideSuitability: 'less-ideal' }).score;
  const breakdownGoodTide = getSlotQualityScore({ ...baseSlot, tideSuitability: 'good' }).breakdown;
  const breakdownBadTide = getSlotQualityScore({ ...baseSlot, tideSuitability: 'less-ideal' }).breakdown;

  if (!(scoreGoodTide > scoreBadTide)) {
    throw new Error(`tide score impact failed: good=${scoreGoodTide}, lessIdeal=${scoreBadTide}`);
  }

  assertEqual(breakdownGoodTide.tideEffect, 1, 'breakdown tide bonus');
  assertEqual(breakdownBadTide.tideEffect, -1, 'breakdown tide penalty');
}

function runDailyReportTests() {
  const groupedSlotsForDay = {
    morning: [
      {
        conditionTag: 'clean',
        challenging: false,
        tideLevel: 'mid',
        tideSuitability: 'good',
        mergedSpot: {
          coastOrientationDeg: 270,
          windRichtingGraden: 90,
          windSnelheidKnopen: 10,
          golfHoogteMeter: 1.1,
          golfPeriodeSeconden: 8,
          swellRichtingGraden: 300
        }
      }
    ],
    afternoon: [
      {
        conditionTag: 'mixed',
        challenging: false,
        tideLevel: 'high',
        tideSuitability: 'good',
        mergedSpot: {
          coastOrientationDeg: 270,
          windRichtingGraden: 80,
          windSnelheidKnopen: 12,
          golfHoogteMeter: 1.4,
          golfPeriodeSeconden: 9,
          swellRichtingGraden: 295
        }
      }
    ],
    evening: [
      {
        conditionTag: 'choppy',
        challenging: true,
        tideLevel: 'low',
        tideSuitability: 'less-ideal',
        mergedSpot: {
          coastOrientationDeg: 270,
          windRichtingGraden: 270,
          windSnelheidKnopen: 22,
          golfHoogteMeter: 2.6,
          golfPeriodeSeconden: 10,
          swellRichtingGraden: 290
        }
      }
    ]
  };

  const stats = buildDaySummaryStats('spot-a', '2026-02-13', groupedSlotsForDay);
  assertEqual(stats.hasData, true, 'buildDaySummaryStats(hasData)');
  assertEqual(stats.minHeight, 1.1, 'buildDaySummaryStats(minHeight)');
  assertEqual(stats.maxHeight, 2.6, 'buildDaySummaryStats(maxHeight)');

  const reportLinesEn = buildDailySurfReportLines(stats, '2026-02-13', 'en').join(' ').toLowerCase();
  if (!reportLinesEn.includes('swell') || !reportLinesEn.includes('advice') || !reportLinesEn.includes('tide')) {
    throw new Error(`buildDailySurfReportLines(en) missing expected keywords: ${reportLinesEn}`);
  }

  const advancedStats = {
    ...stats,
    overallSkillLevel: 'advanced'
  };
  const reportLinesNl = buildDailySurfReportLines(advancedStats, '2026-02-13', 'nl').join(' ').toLowerCase();
  if (!reportLinesNl.includes('gevorderden')) {
    throw new Error(`buildDailySurfReportLines(nl advanced) missing expected keyword: ${reportLinesNl}`);
  }

  const fallback = buildDailySurfReportLines({ hasData: false }, '2026-02-13', 'en')[0];
  assertEqual(fallback, 'Not enough data for a daily surf report.', 'buildDailySurfReportLines(fallback)');
}

function runAll() {
  runWindDirectionTests();
  runWindSpeedTests();
  runSwellClassTests();
  runChallengingConditionsTests();
  runWindRelativeToCoastTests();
  runSurfConditionTagTests();
  runMinSurfableTests();
  runHardFilterCombinationTests();
  runLocalDateKeyTests();
  runDayPartTests();
  runSlotSelectionTests();
  runSlotDetailHelperTests();
  runTideHelpersTests();
  runMultiSpotScoreTests();
  runTideScoreImpactTests();
  runDailyReportTests();
  console.log('All tests passed');
}

runAll();
