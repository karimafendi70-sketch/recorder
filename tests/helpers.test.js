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
  console.log('All tests passed');
}

runAll();
