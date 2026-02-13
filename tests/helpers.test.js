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

function isChallengingConditions(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;
  const windSpeed = conditions?.windSnelheidKnopen;

  return waveHeight > 2.3 || windSpeed >= 18 || wavePeriod >= 12;
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
    [{ golfHoogteMeter: 2.0, golfPeriodeSeconden: null, windSnelheidKnopen: 10 }, false]
  ];

  cases.forEach(([input, expected], index) => {
    assertEqual(
      isChallengingConditions(input),
      expected,
      `isChallengingConditions(case ${index + 1})`
    );
  });
}

function runAll() {
  runWindDirectionTests();
  runWindSpeedTests();
  runSwellClassTests();
  runChallengingConditionsTests();
  console.log('All tests passed');
}

runAll();
