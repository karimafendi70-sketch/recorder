const {
  getDefaultUserPreferences,
  normalizeUserPreferences,
  getWaveRangeBoundsFromPreset,
  saveUserPreferences,
  loadUserPreferences
} = require('../lib/preferences.js');
const {
  getSlotQualityScore,
  getSpotDayScore,
  getScoreClassSuffix
} = require('../lib/scores.js');
const { buildTimelineDataForDay } = require('../lib/timeline.js');
const { buildDaypartHeatmapData } = require('../lib/heatmap.js');
const { buildMultiSpotOverview } = require('../lib/spots.js');

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label} failed: expected "${expected}", got "${actual}"`);
  }
}

function assertTrue(value, label) {
  if (!value) {
    throw new Error(`${label} failed: expected truthy, got ${value}`);
  }
}

function normalizeWindDegrees(degrees) {
  if (!Number.isFinite(degrees)) return null;
  const normalized = ((degrees % 360) + 360) % 360;
  return Math.round(normalized);
}

function getWindDegreesForSpot(spot) {
  return normalizeWindDegrees(spot?.windRichtingGraden);
}

function getCoastOrientationDeg(spot) {
  const explicitOrientation = normalizeWindDegrees(spot?.coastOrientationDeg);
  if (Number.isFinite(explicitOrientation)) {
    return explicitOrientation;
  }
  return 270;
}

function getAngularDifferenceDegrees(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  const normalizedA = normalizeWindDegrees(a);
  const normalizedB = normalizeWindDegrees(b);
  const diff = Math.abs(normalizedA - normalizedB);
  return Math.min(diff, 360 - diff);
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

function createQuality(slotContext, filters, userPreferences) {
  return getSlotQualityScore(slotContext, {
    filters,
    userPreferences,
    getWindDegreesForSpot,
    getCoastOrientationDeg,
    getWindRelativeToCoast
  });
}

function runPreferencesTests() {
  const beginner = getDefaultUserPreferences('beginner');
  assertEqual(beginner.skillLevel, 'beginner', 'default beginner skill');

  const normalized = normalizeUserPreferences({
    skillLevel: 'advanced',
    preferredMinHeight: 5,
    preferredMaxHeight: -1,
    likesClean: true,
    canHandleChallenging: true,
    autoBeginnerFilter: false
  });
  assertTrue(normalized.preferredMinHeight <= normalized.preferredMaxHeight, 'normalized range order');

  assertEqual(getWaveRangeBoundsFromPreset('small').preferredMaxHeight, 1.6, 'small range max');

  const mockStorage = {
    values: {},
    getItem(key) {
      return this.values[key] ?? null;
    },
    setItem(key, value) {
      this.values[key] = value;
    }
  };

  const key = 'prefs';
  saveUserPreferences(beginner, { storage: mockStorage, storageKey: key });
  const loaded = loadUserPreferences({ storage: mockStorage, storageKey: key });
  assertEqual(loaded.skillLevel, 'beginner', 'load/save storage skill level');
}

function runScoreTests() {
  const cleanSlot = {
    dayKey: '2026-02-13',
    offsetHours: 3,
    conditionTag: 'clean',
    challenging: false,
    tideSuitability: 'good',
    minSurfable: true,
    mergedSpot: {
      coastOrientationDeg: 270,
      windRichtingGraden: 90,
      windSnelheidKnopen: 11,
      golfHoogteMeter: 1.4,
      golfPeriodeSeconden: 9
    }
  };

  const choppySlot = {
    ...cleanSlot,
    conditionTag: 'choppy',
    challenging: true,
    tideSuitability: 'less-ideal',
    mergedSpot: {
      ...cleanSlot.mergedSpot,
      windRichtingGraden: 270,
      golfHoogteMeter: 2.9
    }
  };

  const filters = { minSurfable: false, beginnerFriendly: false, preferClean: false };
  const cleanScore = createQuality(cleanSlot, filters, null);
  const choppyScore = createQuality(choppySlot, filters, null);

  assertTrue(cleanScore.score > choppyScore.score, 'clean outranks choppy');
  assertEqual(getScoreClassSuffix(8.2), 'good', 'score class good');

  const dayScore = getSpotDayScore(
    { id: 'spot-a' },
    '2026-02-13',
    [cleanSlot, choppySlot],
    {
      useActiveFilters: true,
      passesHardConditionFilters: () => true,
      getScore: (slotContext) => createQuality(slotContext, filters, null),
      buildSlotKey: (slotContext) => `${slotContext.dayKey}-${slotContext.offsetHours}`,
      getSpotKey: (spot) => spot.id
    }
  );

  assertEqual(dayScore.bestSlotKey, '2026-02-13-3', 'best slot key');
}

function runTimelineAndHeatmapTests() {
  const slots = [
    {
      dayKey: '2026-02-13',
      dayPart: 'afternoon',
      offsetHours: 6,
      time: '2026-02-13T12:00:00Z',
      quality: { score: 5.5 }
    },
    {
      dayKey: '2026-02-13',
      dayPart: 'morning',
      offsetHours: 0,
      time: '2026-02-13T06:00:00Z',
      quality: { score: 7.1 }
    }
  ];

  const timeline = buildTimelineDataForDay('spot-a', '2026-02-13', slots, {
    passesHardConditionFilters: () => true,
    getScore: (slotContext) => slotContext.quality,
    buildSlotKey: (slotContext) => `${slotContext.dayKey}-${slotContext.offsetHours}`,
    formatTime: (slotContext) => slotContext.time.slice(11, 16)
  });

  assertEqual(timeline.length, 2, 'timeline rows');
  assertEqual(timeline[0].slotOffset, 0, 'timeline order');

  const candidateSpots = [
    { id: 'spot-a', name: 'Spot A' },
    { id: 'spot-b', name: 'Spot B' }
  ];

  const slotsBySpotId = {
    'spot-a': [
      { dayKey: '2026-02-13', dayPart: 'morning', offsetHours: 0, qualityNoFilters: { score: 6.0 } },
      { dayKey: '2026-02-13', dayPart: 'morning', offsetHours: 3, qualityNoFilters: { score: 7.2 } }
    ],
    'spot-b': [
      { dayKey: '2026-02-13', dayPart: 'evening', offsetHours: 9, qualityNoFilters: { score: 8.3 } }
    ]
  };

  const heatmap = buildDaypartHeatmapData('2026-02-13', candidateSpots, {
    getSpotId: (spot) => spot.id,
    getSpotName: (spot) => spot.name,
    getSlotsForSpot: (spot) => slotsBySpotId[spot.id] ?? [],
    getQualityNoFilters: (slotContext) => slotContext.qualityNoFilters,
    buildSlotKey: (slotContext) => `${slotContext.dayKey}-${slotContext.offsetHours}`,
    dayPartOrder: ['morning', 'afternoon', 'evening']
  });

  assertEqual(heatmap.length, 2, 'heatmap rows');
  assertEqual(heatmap[0].scoresByDayPart.morning.score, 7.2, 'heatmap best morning score');
}

function runSpotsTests() {
  const spots = [{ id: 'spot-a' }, { id: 'spot-b' }];
  const slotMap = {
    'spot-a': [{ dayKey: '2026-02-13', offsetHours: 3 }],
    'spot-b': [{ dayKey: '2026-02-13', offsetHours: 6 }]
  };

  const rows = buildMultiSpotOverview('2026-02-13', spots, {
    topLimit: 5,
    getSlotsForSpot: (spot) => slotMap[spot.id] ?? [],
    getSpotDayScore: (spot) => ({
      spotId: spot.id,
      dayKey: '2026-02-13',
      score: spot.id === 'spot-a' ? 8.1 : 6.2,
      bestSlotOffset: 3,
      bestSlotContext: { offsetHours: 3 }
    })
  });

  assertEqual(rows[0].spotId, 'spot-a', 'multi-spot ranking');
}

function runAll() {
  runPreferencesTests();
  runScoreTests();
  runTimelineAndHeatmapTests();
  runSpotsTests();
  console.log('All tests passed');
}

runAll();
