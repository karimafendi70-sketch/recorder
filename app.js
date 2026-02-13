const spotNameEl = document.getElementById('spotName');
const waveHeightEl = document.getElementById('waveHeight');
const wavePeriodEl = document.getElementById('wavePeriod');
const windEl = document.getElementById('wind');
const temperatureEl = document.getElementById('temperature');
const forecastMetaEl = document.getElementById('forecastMeta');
const surfRatingEl = document.getElementById('surfRating');
const ratingExplanationEl = document.getElementById('ratingExplanation');
const legendToggleBtnEl = document.getElementById('legendToggleBtn');
const ratingLegendBodyEl = document.getElementById('ratingLegendBody');
const favoriteToggleBtnEl = document.getElementById('favoriteToggleBtn');
const favoritesListEl = document.getElementById('favoritesList');
const timeSelectorEl = document.getElementById('timeSelector');
const timeSlotButtons = Array.from(document.querySelectorAll('.time-slot-btn'));
const searchInputEl = document.getElementById('spotSearch');
const searchButtonEl = document.querySelector('.search-button');
const suggestionsListEl = document.getElementById('suggestionsList');
const searchMessageEl = document.getElementById('searchMessage');
const MAX_DISTANCE_RATIO = 0.35;
const MIN_ALLOWED_DISTANCE = 1;
const NAME_MATCH_WEIGHT = 1;
const LAND_MATCH_WEIGHT = 1;
const TIME_SLOT_OFFSETS = [0, 3, 6, 9];
const CACHE_TTL_MS = 10 * 60 * 1000;
const FAVORITES_STORAGE_KEY = 'freeSurfCastFavorites';
const OPEN_METEO_MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const OPEN_METEO_WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const RATING_CLASS_NAMES = ['rating-bad', 'rating-ok', 'rating-good', 'rating-neutral'];
const SLOT_CLASS_NAMES = ['slot-bad', 'slot-ok', 'slot-good', 'slot-neutral'];
let currentSuggestions = [];
let activeSuggestionIndex = -1;
let liveRequestId = 0;
let activeTimeOffset = 0;
let activeLiveCache = null;
const liveForecastCacheBySpot = new Map();
const favoriteSpotIds = new Set();
let activeSpot = null;

function buildRatingExplanation(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;
  const windSpeed = conditions?.windSnelheidKnopen;
  const windDirection = conditions?.windRichting;

  if (
    !Number.isFinite(waveHeight) ||
    !Number.isFinite(wavePeriod) ||
    !Number.isFinite(windSpeed)
  ) {
    return 'Geen nadere uitleg beschikbaar.';
  }

  const positives = [];
  const negatives = [];

  if (waveHeight >= 1.2 && waveHeight <= 2.8) {
    positives.push('+ goede golfhoogte');
  } else if ((waveHeight >= 0.7 && waveHeight < 1.2) || (waveHeight > 2.8 && waveHeight <= 3.5)) {
    positives.push('+ redelijke golfhoogte');
  } else if (waveHeight < 0.7) {
    negatives.push('- te kleine golfhoogte');
  } else {
    negatives.push('- te hoge golfhoogte');
  }

  if (wavePeriod >= 8) {
    positives.push('+ lange periode');
  } else if (wavePeriod >= 6) {
    positives.push('+ redelijke periode');
  } else {
    negatives.push('- korte periode');
  }

  if (windSpeed <= 12) {
    positives.push('+ niet te harde wind');
  } else if (windSpeed >= 22) {
    negatives.push('- harde wind');
  } else if (windSpeed >= 16) {
    negatives.push('- vrij stevige wind');
  }

  if (typeof windDirection === 'string') {
    const normalizedDirection = windDirection.toUpperCase();
    if (['O', 'NO', 'ZO'].includes(normalizedDirection)) {
      positives.push('+ gunstige windrichting');
    }
    if (['W', 'NW', 'ZW'].includes(normalizedDirection)) {
      negatives.push('- onshore windrichting');
    }
  }

  const shortPositives = positives.slice(0, 2);
  const shortNegatives = negatives.slice(0, 2);
  const parts = [...shortPositives, ...shortNegatives];

  if (!parts.length) {
    return 'Geen nadere uitleg beschikbaar.';
  }

  return parts.join(', ');
}

function calculateSurfRating(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;
  const windSpeed = conditions?.windSnelheidKnopen;
  const windDirection = conditions?.windRichting;

  if (
    !Number.isFinite(waveHeight) ||
    !Number.isFinite(wavePeriod) ||
    !Number.isFinite(windSpeed)
  ) {
    return {
      explanation: 'Geen nadere uitleg beschikbaar.'
    };
  }

  let score = 1;

  if (waveHeight >= 1.2 && waveHeight <= 2.8) {
    score += 2;
  } else if ((waveHeight >= 0.7 && waveHeight < 1.2) || (waveHeight > 2.8 && waveHeight <= 3.5)) {
    score += 1;
  }

  if (wavePeriod >= 8 && wavePeriod <= 14) {
    score += 1;
  } else if (wavePeriod >= 6 && wavePeriod < 8) {
    score += 0.5;
  }

  if (windSpeed <= 12) {
    score += 1;
  } else if (windSpeed >= 22) {
    score -= 1;
  }

  if (typeof windDirection === 'string') {
    const normalizedDirection = windDirection.toUpperCase();
    if (['O', 'NO', 'ZO'].includes(normalizedDirection)) score += 0.5;
    if (['W', 'NW', 'ZW'].includes(normalizedDirection)) score -= 0.5;
  }

  const clampedScore = Math.max(1, Math.min(5, Math.round(score)));
  let ratingClass = 'rating-ok';
  if (clampedScore <= 2) ratingClass = 'rating-bad';
  if (clampedScore >= 4) ratingClass = 'rating-good';

  const labels = {
    1: 'Slecht',
    2: 'Matig',
    3: 'OK',
    4: 'Goed',
    5: 'Top'
  };

  return {
    score: clampedScore,
    label: labels[clampedScore],
    stars: `${'★'.repeat(clampedScore)}${'☆'.repeat(5 - clampedScore)}`,
    ratingClass,
    explanation: buildRatingExplanation(conditions)
  };
}

function renderSurfRating(conditions) {
  surfRatingEl.classList.remove(...RATING_CLASS_NAMES);

  const rating = calculateSurfRating(conditions);

  if (!rating?.score) {
    surfRatingEl.textContent = 'Surf rating: n.v.t.';
    surfRatingEl.classList.add('rating-neutral');
    ratingExplanationEl.textContent = 'Waarom deze rating? Geen nadere uitleg beschikbaar.';
    return;
  }

  surfRatingEl.textContent = `Surf rating: ${rating.stars} ${rating.score}/5 – ${rating.label}`;
  surfRatingEl.classList.add(rating.ratingClass);
  ratingExplanationEl.textContent = `Waarom deze rating? ${rating.explanation}`;
}

function renderSpot(spot, ratingConditions = spot) {
  spotNameEl.textContent = `${spot.naam} (${spot.land})`;
  waveHeightEl.textContent = `${spot.golfHoogteMeter.toFixed(1)} m`;
  wavePeriodEl.textContent = `${spot.golfPeriodeSeconden} s`;
  windEl.textContent = `${spot.windSnelheidKnopen} kn ${spot.windRichting}`;
  temperatureEl.textContent = `${spot.watertemperatuurC} °C`;
  renderSurfRating(ratingConditions);
}

function setLegendExpanded(isExpanded) {
  if (!legendToggleBtnEl || !ratingLegendBodyEl) return;
  legendToggleBtnEl.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  legendToggleBtnEl.textContent = isExpanded ? 'Verberg uitleg' : 'Toon uitleg';
  ratingLegendBodyEl.hidden = !isExpanded;
}

function setForecastMeta(message, type = 'default') {
  forecastMetaEl.textContent = message;
  forecastMetaEl.classList.remove('is-live', 'is-error');

  if (type === 'live') forecastMetaEl.classList.add('is-live');
  if (type === 'error') forecastMetaEl.classList.add('is-error');
}

function setSearchMessage(message, type) {
  searchMessageEl.textContent = message;
  searchMessageEl.classList.remove('is-error', 'is-success');

  if (type === 'error') searchMessageEl.classList.add('is-error');
  if (type === 'success') searchMessageEl.classList.add('is-success');
}

function setActiveTimeSlotButton(offset) {
  timeSlotButtons.forEach((button) => {
    const buttonOffset = Number(button.dataset.offset);
    button.classList.toggle('is-active', buttonOffset === offset);
  });
}

function clearActiveLiveCache() {
  activeLiveCache = null;
  activeTimeOffset = 0;
  timeSelectorEl.hidden = true;
  timeSlotButtons.forEach((button) => {
    button.disabled = true;
    button.classList.remove('is-active');
  });
}

function hideSuggestions() {
  suggestionsListEl.innerHTML = '';
  suggestionsListEl.hidden = true;
  currentSuggestions = [];
  activeSuggestionIndex = -1;
}

function normalizeText(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getSpotKey(spot) {
  if (spot.id) return spot.id;
  return `${normalizeText(spot.naam)}-${normalizeText(spot.land)}`;
}

function getSpotById(spotId) {
  return SURF_SPOTS.find((spot) => getSpotKey(spot) === spotId) ?? null;
}

function loadFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    parsed.forEach((spotId) => {
      if (typeof spotId === 'string' && getSpotById(spotId)) {
        favoriteSpotIds.add(spotId);
      }
    });
  } catch {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }
}

function saveFavoritesToStorage() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteSpotIds)));
}

function isFavoriteSpot(spot) {
  return favoriteSpotIds.has(getSpotKey(spot));
}

function updateFavoriteToggleForSpot(spot) {
  if (!spot) {
    favoriteToggleBtnEl.textContent = '☆ Favoriet';
    favoriteToggleBtnEl.setAttribute('aria-pressed', 'false');
    favoriteToggleBtnEl.classList.remove('is-active');
    return;
  }

  const isFavorite = isFavoriteSpot(spot);
  favoriteToggleBtnEl.textContent = isFavorite ? '★ Favoriet' : '☆ Favoriet';
  favoriteToggleBtnEl.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
  favoriteToggleBtnEl.classList.toggle('is-active', isFavorite);
}

function renderFavoritesList() {
  const favorites = SURF_SPOTS.filter((spot) => favoriteSpotIds.has(getSpotKey(spot)));

  if (!favorites.length) {
    favoritesListEl.innerHTML = '<li class="favorites-empty">Nog geen favorieten</li>';
    return;
  }

  favoritesListEl.innerHTML = favorites
    .map(
      (spot) =>
        `<li><button type="button" class="favorite-item-btn" data-spot-id="${getSpotKey(spot)}">${spot.naam} (${spot.land})</button></li>`
    )
    .join('');
}

function isCacheEntryFresh(cacheEntry) {
  if (!cacheEntry || !cacheEntry.fetchedAt || !cacheEntry.data) return false;
  return Date.now() - cacheEntry.fetchedAt <= CACHE_TTL_MS;
}

function buildMarineApiUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'wave_height,wave_period,sea_surface_temperature',
    forecast_days: '1',
    timezone: 'auto'
  });

  return `${OPEN_METEO_MARINE_BASE_URL}?${params.toString()}`;
}

function buildWeatherApiUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'wind_speed_10m,wind_direction_10m,temperature_2m',
    wind_speed_unit: 'kn',
    forecast_days: '1',
    timezone: 'auto'
  });

  return `${OPEN_METEO_WEATHER_BASE_URL}?${params.toString()}`;
}

function toCompassDirection(degrees) {
  if (!Number.isFinite(degrees)) return '-';
  const directions = ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function findNearestTimeIndex(times) {
  if (!Array.isArray(times) || !times.length) return 0;

  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const timestamp = new Date(time).getTime();
    const diff = timestamp - now;
    if (diff >= 0 && diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return bestDiff === Number.POSITIVE_INFINITY ? 0 : bestIndex;
}

async function fetchLiveForecastForSpot(spot) {
  if (!Number.isFinite(spot.latitude) || !Number.isFinite(spot.longitude)) {
    throw new Error('Spot mist geldige coördinaten');
  }

  const marineUrl = buildMarineApiUrl(spot.latitude, spot.longitude);
  const weatherUrl = buildWeatherApiUrl(spot.latitude, spot.longitude);

  const [marineResponse, weatherResponse] = await Promise.all([
    fetch(marineUrl),
    fetch(weatherUrl)
  ]);

  if (!marineResponse.ok || !weatherResponse.ok) {
    throw new Error('API response niet ok');
  }

  const marineData = await marineResponse.json();
  const weatherData = await weatherResponse.json();

  const marineTimes = marineData?.hourly?.time ?? [];
  const weatherTimes = weatherData?.hourly?.time ?? [];

  return {
    spot,
    spotKey: getSpotKey(spot),
    marineUrl,
    weatherUrl,
    marineData,
    weatherData,
    marineTimes,
    weatherTimes,
    baseMarineIndex: findNearestTimeIndex(marineTimes),
    baseWeatherIndex: findNearestTimeIndex(weatherTimes)
  };
}

function getLiveSnapshotForOffset(offsetHours) {
  if (!activeLiveCache) return null;

  const marineIndex = activeLiveCache.baseMarineIndex + offsetHours;
  const weatherIndex = activeLiveCache.baseWeatherIndex + offsetHours;

  const marineTimes = activeLiveCache.marineTimes;
  const weatherTimes = activeLiveCache.weatherTimes;
  const marineHourly = activeLiveCache.marineData?.hourly;
  const weatherHourly = activeLiveCache.weatherData?.hourly;

  if (
    marineIndex < 0 ||
    weatherIndex < 0 ||
    marineIndex >= marineTimes.length ||
    weatherIndex >= weatherTimes.length
  ) {
    return null;
  }

  return {
    time: marineTimes[marineIndex] ?? weatherTimes[weatherIndex] ?? null,
    values: {
      golfHoogteMeter: marineHourly?.wave_height?.[marineIndex],
      golfPeriodeSeconden: marineHourly?.wave_period?.[marineIndex],
      windSnelheidKnopen: weatherHourly?.wind_speed_10m?.[weatherIndex],
      windRichting: toCompassDirection(weatherHourly?.wind_direction_10m?.[weatherIndex]),
      watertemperatuurC:
        marineHourly?.sea_surface_temperature?.[marineIndex] ??
        weatherHourly?.temperature_2m?.[weatherIndex]
    }
  };
}

function updateTimeSelectorButtons() {
  if (!activeLiveCache) {
    clearActiveLiveCache();
    return;
  }

  timeSelectorEl.hidden = false;

  timeSlotButtons.forEach((button) => {
    const offset = Number(button.dataset.offset);
    const snapshot = getLiveSnapshotForOffset(offset);
    const isAvailable = Boolean(snapshot);

    button.classList.remove(...SLOT_CLASS_NAMES);

    if (!isAvailable) {
      button.classList.add('slot-neutral');
    } else {
      const slotRating = calculateSurfRating(snapshot.values);
      if (!slotRating?.score) {
        button.classList.add('slot-neutral');
      } else if (slotRating.ratingClass === 'rating-good') {
        button.classList.add('slot-good');
      } else if (slotRating.ratingClass === 'rating-ok') {
        button.classList.add('slot-ok');
      } else {
        button.classList.add('slot-bad');
      }
    }

    button.disabled = !isAvailable;
    button.classList.toggle('is-active', offset === activeTimeOffset && isAvailable);
    button.title = isAvailable ? '' : 'Niet beschikbaar voor dit tijdvak';
  });
}

function mergeWithFallbackSpot(spot, liveValues) {
  return {
    ...spot,
    golfHoogteMeter: Number.isFinite(liveValues.golfHoogteMeter)
      ? liveValues.golfHoogteMeter
      : spot.golfHoogteMeter,
    golfPeriodeSeconden: Number.isFinite(liveValues.golfPeriodeSeconden)
      ? liveValues.golfPeriodeSeconden
      : spot.golfPeriodeSeconden,
    windSnelheidKnopen: Number.isFinite(liveValues.windSnelheidKnopen)
      ? liveValues.windSnelheidKnopen
      : spot.windSnelheidKnopen,
    windRichting: liveValues.windRichting && liveValues.windRichting !== '-'
      ? liveValues.windRichting
      : spot.windRichting,
    watertemperatuurC: Number.isFinite(liveValues.watertemperatuurC)
      ? liveValues.watertemperatuurC
      : spot.watertemperatuurC
  };
}

function findFirstAvailableOffset() {
  return TIME_SLOT_OFFSETS.find((offset) => Boolean(getLiveSnapshotForOffset(offset)));
}

function renderLiveOffset(offsetHours) {
  const snapshot = getLiveSnapshotForOffset(offsetHours);
  if (!snapshot || !activeLiveCache) return false;

  activeTimeOffset = offsetHours;
  updateTimeSelectorButtons();

  const mergedSpot = mergeWithFallbackSpot(activeLiveCache.spot, snapshot.values);
  renderSpot(mergedSpot, snapshot.values);

  const tijdLabel = snapshot.time
    ? new Date(snapshot.time).toLocaleString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      })
    : 'onbekend tijdstip';

  setForecastMeta(`Live via Open-Meteo · ${tijdLabel}`, 'live');
  setActiveTimeSlotButton(offsetHours);
  return true;
}

async function updateForecastForSpot(spot) {
  activeSpot = spot;
  updateFavoriteToggleForSpot(spot);
  renderSpot(spot, spot);

  const spotKey = getSpotKey(spot);
  const hasCoordinates = Number.isFinite(spot.latitude) && Number.isFinite(spot.longitude);

  if (!hasCoordinates) {
    clearActiveLiveCache();
    setForecastMeta('Bron: mock-data (spot mist coördinaten).');
    return;
  }

  const cacheEntry = liveForecastCacheBySpot.get(spotKey);
  if (isCacheEntryFresh(cacheEntry)) {
    activeLiveCache = cacheEntry.data;
    activeTimeOffset = TIME_SLOT_OFFSETS[0];
    updateTimeSelectorButtons();

    const firstAvailableOffset = findFirstAvailableOffset();
    if (firstAvailableOffset !== undefined) {
      renderLiveOffset(firstAvailableOffset);
      return;
    }
  }

  const requestId = ++liveRequestId;
  clearActiveLiveCache();
  setForecastMeta(`Live data laden via Open-Meteo voor ${spot.naam}...`);

  try {
    const liveForecast = await fetchLiveForecastForSpot(spot);
    if (requestId !== liveRequestId) return;

    liveForecastCacheBySpot.set(spotKey, {
      fetchedAt: Date.now(),
      data: liveForecast
    });
    activeLiveCache = liveForecast;
    activeTimeOffset = TIME_SLOT_OFFSETS[0];
    updateTimeSelectorButtons();

    const firstAvailableOffset = findFirstAvailableOffset();
    if (firstAvailableOffset === undefined) {
      throw new Error('Geen bruikbare tijdvakken beschikbaar');
    }

    renderLiveOffset(firstAvailableOffset);
  } catch (error) {
    if (requestId !== liveRequestId) return;

    clearActiveLiveCache();
    renderSpot(spot, spot);
    setForecastMeta(`Live API fout voor ${spot.naam}, fallback naar mock-data.`, 'error');
    setSearchMessage(`Live API fout voor ${spot.naam}. Mock-data gebruikt.`, 'error');
  }
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let col = 0; col < cols; col += 1) matrix[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function findSpotsBySubstring(name) {
  const normalizedQuery = normalizeText(name);
  if (!normalizedQuery) return [];

  return SURF_SPOTS.filter((spot) => {
    const normalizedSpotName = normalizeText(spot.naam);
    const normalizedLand = normalizeText(spot.land);
    return (
      normalizedSpotName.includes(normalizedQuery) ||
      normalizedLand.includes(normalizedQuery)
    );
  });
}

function renderSuggestions(matches) {
  if (!matches.length) {
    hideSuggestions();
    return;
  }

  currentSuggestions = matches;
  activeSuggestionIndex = -1;

  suggestionsListEl.innerHTML = matches
    .map(
      (spot, index) => `
        <li>
          <button class="suggestion-item" type="button" data-index="${index}">
            <span class="suggestion-name">${spot.naam}</span>
            <span class="suggestion-land">${spot.land}</span>
          </button>
        </li>
      `
    )
    .join('');

  suggestionsListEl.hidden = false;
}

function getSuggestionButtons() {
  return suggestionsListEl.querySelectorAll('.suggestion-item');
}

function setActiveSuggestion(index) {
  const buttons = getSuggestionButtons();
  if (!buttons.length) return;

  buttons.forEach((button) => button.classList.remove('is-active'));

  if (index < 0 || index >= buttons.length) {
    activeSuggestionIndex = -1;
    return;
  }

  activeSuggestionIndex = index;
  const activeButton = buttons[activeSuggestionIndex];
  activeButton.classList.add('is-active');
  activeButton.scrollIntoView({ block: 'nearest' });
}

function moveActiveSuggestion(step) {
  if (suggestionsListEl.hidden || !currentSuggestions.length) return;

  const nextIndex =
    activeSuggestionIndex < 0
      ? step > 0
        ? 0
        : currentSuggestions.length - 1
      : (activeSuggestionIndex + step + currentSuggestions.length) % currentSuggestions.length;

  setActiveSuggestion(nextIndex);
}

function detectSubstringMatchField(spot, query) {
  const normalizedQuery = normalizeText(query);
  const normalizedSpotName = normalizeText(spot.naam);
  const normalizedLand = normalizeText(spot.land);

  if (normalizedSpotName.includes(normalizedQuery)) return 'naam';
  if (normalizedLand.includes(normalizedQuery)) return 'land';
  return 'naam';
}

function getAllowedDistance(query) {
  return Math.max(
    MIN_ALLOWED_DISTANCE,
    Math.floor(query.length * MAX_DISTANCE_RATIO)
  );
}

function findBestMatchingSpot(query, spots) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return null;

  let bestSpot = null;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestField = 'naam';

  for (const spot of spots) {
    const normalizedSpotName = normalizeText(spot.naam);
    const normalizedLand = normalizeText(spot.land);

    const nameDistance = levenshteinDistance(normalizedQuery, normalizedSpotName);
    const landDistance = levenshteinDistance(normalizedQuery, normalizedLand);

    const weightedNameScore = nameDistance * NAME_MATCH_WEIGHT;
    const weightedLandScore = landDistance * LAND_MATCH_WEIGHT;

    const score = Math.min(weightedNameScore, weightedLandScore);
    const field = weightedLandScore < weightedNameScore ? 'land' : 'naam';

    if (score < bestScore) {
      bestScore = score;
      bestSpot = spot;
      bestField = field;
    }
  }

  const allowedDistance = getAllowedDistance(normalizedQuery);

  if (bestScore <= allowedDistance) {
    return { spot: bestSpot, matchBy: bestField };
  }

  return null;
}

function buildSuccessMessage(spot, method, matchBy) {
  if (method === 'favorite') {
    return `Favoriet geopend: ${spot.naam} (${spot.land})`;
  }

  const via = matchBy === 'land' ? 'land' : 'naam';

  if (method === 'fuzzy') {
    return `Geen exacte match, dichtstbij via ${via}: ${spot.naam} (${spot.land})`;
  }

  return `Forecast geladen via ${via}: ${spot.naam} (${spot.land})`;
}

function selectSpot(spot, method, query) {
  const matchBy = method === 'substring' ? detectSubstringMatchField(spot, query) : 'naam';
  updateForecastForSpot(spot);
  setSearchMessage(buildSuccessMessage(spot, method, matchBy), 'success');
  searchInputEl.value = spot.naam;
  hideSuggestions();
}

function handleSearch() {
  const query = searchInputEl.value;
  const substringMatches = findSpotsBySubstring(query);

  if (substringMatches.length > 0) {
    selectSpot(substringMatches[0], 'substring', query);
    return;
  }

  const fuzzyMatch = findBestMatchingSpot(query, SURF_SPOTS);

  if (fuzzyMatch?.spot) {
    updateForecastForSpot(fuzzyMatch.spot);
    setSearchMessage(
      buildSuccessMessage(fuzzyMatch.spot, 'fuzzy', fuzzyMatch.matchBy),
      'success'
    );
    hideSuggestions();
    return;
  }

  hideSuggestions();
  setSearchMessage('Geen surfspot gevonden', 'error');
}

function selectSuggestionByIndex(index) {
  const selectedSpot = currentSuggestions[index];
  if (!selectedSpot) return false;

  selectSpot(selectedSpot, 'substring', searchInputEl.value);
  return true;
}

function handleInputSuggestions() {
  const query = searchInputEl.value;
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    hideSuggestions();
    setSearchMessage('Typ een spotnaam en druk op Enter of Zoeken.', '');
    return;
  }

  const matches = findSpotsBySubstring(query);
  renderSuggestions(matches);

  if (!matches.length) {
    setSearchMessage('Geen directe substring-match. Druk op Enter voor typo-zoeking.', '');
  } else {
    setSearchMessage(`${matches.length} suggestie(s) gevonden.`, '');
  }
}

searchButtonEl.addEventListener('click', handleSearch);

searchInputEl.addEventListener('input', handleInputSuggestions);

searchInputEl.addEventListener('keydown', (event) => {
  if (!suggestionsListEl.hidden && event.key === 'ArrowDown') {
    event.preventDefault();
    moveActiveSuggestion(1);
    return;
  }

  if (!suggestionsListEl.hidden && event.key === 'ArrowUp') {
    event.preventDefault();
    moveActiveSuggestion(-1);
    return;
  }

  if (event.key === 'Enter') {
    if (!suggestionsListEl.hidden && activeSuggestionIndex >= 0) {
      event.preventDefault();
      selectSuggestionByIndex(activeSuggestionIndex);
      return;
    }

    event.preventDefault();
    handleSearch();
  }
});

suggestionsListEl.addEventListener('click', (event) => {
  const button = event.target.closest('.suggestion-item');
  if (!button) return;
  const matchIndex = Number(button.dataset.index);
  selectSuggestionByIndex(matchIndex);
});

document.addEventListener('click', (event) => {
  const clickedInsideSearch = event.target.closest('.search-section');
  if (!clickedInsideSearch) {
    hideSuggestions();
  }
});

timeSelectorEl.addEventListener('click', (event) => {
  const button = event.target.closest('.time-slot-btn');
  if (!button || button.disabled) return;

  const offset = Number(button.dataset.offset);
  const rendered = renderLiveOffset(offset);
  if (!rendered) {
    setSearchMessage('Dit tijdvak heeft geen beschikbare live data.', 'error');
  }
});

favoriteToggleBtnEl.addEventListener('click', () => {
  if (!activeSpot) return;

  const activeSpotId = getSpotKey(activeSpot);
  if (favoriteSpotIds.has(activeSpotId)) {
    favoriteSpotIds.delete(activeSpotId);
    setSearchMessage(`Favoriet verwijderd: ${activeSpot.naam}`, '');
  } else {
    favoriteSpotIds.add(activeSpotId);
    setSearchMessage(`Favoriet toegevoegd: ${activeSpot.naam}`, 'success');
  }

  saveFavoritesToStorage();
  updateFavoriteToggleForSpot(activeSpot);
  renderFavoritesList();
});

favoritesListEl.addEventListener('click', (event) => {
  const button = event.target.closest('.favorite-item-btn');
  if (!button) return;

  const spotId = button.dataset.spotId;
  const spot = getSpotById(spotId);
  if (!spot) return;

  selectSpot(spot, 'favorite', spot.naam);
});

if (legendToggleBtnEl && ratingLegendBodyEl) {
  setLegendExpanded(false);
  legendToggleBtnEl.addEventListener('click', () => {
    const isExpanded = legendToggleBtnEl.getAttribute('aria-expanded') === 'true';
    setLegendExpanded(!isExpanded);
  });
}

loadFavoritesFromStorage();
renderFavoritesList();
updateFavoriteToggleForSpot(null);

renderSpot(SURF_SPOTS[0], SURF_SPOTS[0]);
setSearchMessage('Typ een spotnaam en druk op Enter of Zoeken.', '');
updateForecastForSpot(SURF_SPOTS[0]);
