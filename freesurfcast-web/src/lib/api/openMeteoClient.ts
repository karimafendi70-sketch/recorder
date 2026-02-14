/* ──────────────────────────────────────────────
 *  Open-Meteo API client  (server-side only)
 *
 *  Combines the Marine API (wave / swell) with
 *  the Weather API (wind / temperature) to build
 *  a unified hourly forecast for a single spot.
 *
 *  Both endpoints are free, no key required.
 *  Docs: https://open-meteo.com/en/docs
 *        https://open-meteo.com/en/docs/marine-weather-api
 * ────────────────────────────────────────────── */

import type { SurfSpot } from "@/lib/spots/catalog";

/* ── Public types ────────────────────────────── */

export interface RawForecastPoint {
  /** ISO-8601 local time, e.g. "2026-02-14T06:00" */
  time: string;
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  swellHeight: number | null;
  swellPeriod: number | null;
  swellDirection: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  temperature: number | null;
  cloudCover: number | null;
}

export interface RawForecastResponse {
  spotId: string;
  spotName: string;
  latitude: number;
  longitude: number;
  fetchedAt: string;
  points: RawForecastPoint[];
}

/* ── Open-Meteo response shapes (partial) ──── */

interface HourlyBlock {
  time: string[];
  [key: string]: (number | null)[] | string[];
}

interface OMResponse {
  hourly?: HourlyBlock;
  error?: boolean;
  reason?: string;
}

/* ── Marine API ──────────────────────────────── */

const MARINE_BASE = "https://marine-api.open-meteo.com/v1/marine";
const MARINE_HOURLY = [
  "wave_height",
  "wave_period",
  "wave_direction",
  "swell_wave_height",
  "swell_wave_period",
  "swell_wave_direction",
].join(",");

async function fetchMarine(lat: number, lon: number): Promise<OMResponse> {
  const url =
    `${MARINE_BASE}?latitude=${lat}&longitude=${lon}` +
    `&hourly=${MARINE_HOURLY}` +
    `&forecast_days=2&timezone=auto`;

  const res = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
  if (!res.ok) throw new Error(`Marine API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<OMResponse>;
}

/* ── Weather API ─────────────────────────────── */

const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";
const WEATHER_HOURLY = [
  "wind_speed_10m",
  "wind_direction_10m",
  "temperature_2m",
  "cloud_cover",
].join(",");

async function fetchWeather(lat: number, lon: number): Promise<OMResponse> {
  const url =
    `${WEATHER_BASE}?latitude=${lat}&longitude=${lon}` +
    `&hourly=${WEATHER_HOURLY}` +
    `&forecast_days=2&timezone=auto` +
    `&wind_speed_unit=kn`; // knots to match our catalog convention

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Weather API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<OMResponse>;
}

/* ── Merge both responses into RawForecastPoint[] ── */

function mergeHourly(marine: OMResponse, weather: OMResponse): RawForecastPoint[] {
  const mh = marine.hourly;
  const wh = weather.hourly;
  if (!mh || !wh) return [];

  // Use weather timestamps as the base (they always exist)
  const times = wh.time as string[];

  // Build a quick lookup from marine times → index
  const marineTimes = mh.time as string[];
  const marineIdx = new Map<string, number>();
  for (let i = 0; i < marineTimes.length; i++) {
    marineIdx.set(marineTimes[i], i);
  }

  const arr = (key: string, block: HourlyBlock): (number | null)[] =>
    (block[key] as (number | null)[] | undefined) ?? [];

  const mWaveHeight = arr("wave_height", mh);
  const mWavePeriod = arr("wave_period", mh);
  const mWaveDir = arr("wave_direction", mh);
  const mSwellHeight = arr("swell_wave_height", mh);
  const mSwellPeriod = arr("swell_wave_period", mh);
  const mSwellDir = arr("swell_wave_direction", mh);

  const wWindSpeed = arr("wind_speed_10m", wh);
  const wWindDir = arr("wind_direction_10m", wh);
  const wTemp = arr("temperature_2m", wh);
  const wCloud = arr("cloud_cover", wh);

  return times.map((time, i): RawForecastPoint => {
    const mi = marineIdx.get(time); // matching marine index (may differ near coast)
    return {
      time,
      waveHeight: mi != null ? mWaveHeight[mi] ?? null : null,
      wavePeriod: mi != null ? mWavePeriod[mi] ?? null : null,
      waveDirection: mi != null ? mWaveDir[mi] ?? null : null,
      swellHeight: mi != null ? mSwellHeight[mi] ?? null : null,
      swellPeriod: mi != null ? mSwellPeriod[mi] ?? null : null,
      swellDirection: mi != null ? mSwellDir[mi] ?? null : null,
      windSpeed: wWindSpeed[i] ?? null,
      windDirection: wWindDir[i] ?? null,
      temperature: wTemp[i] ?? null,
      cloudCover: wCloud[i] ?? null,
    };
  });
}

/* ── Public entry point ──────────────────────── */

/**
 * Fetch a combined marine + weather forecast for a single surf spot.
 * Intended to run **server-side only** (API route / RSC).
 */
export async function fetchSpotForecast(spot: SurfSpot): Promise<RawForecastResponse> {
  const [marine, weather] = await Promise.all([
    fetchMarine(spot.latitude, spot.longitude),
    fetchWeather(spot.latitude, spot.longitude),
  ]);

  if (marine.error) throw new Error(`Marine API error: ${marine.reason}`);
  if (weather.error) throw new Error(`Weather API error: ${weather.reason}`);

  return {
    spotId: spot.id,
    spotName: spot.name,
    latitude: spot.latitude,
    longitude: spot.longitude,
    fetchedAt: new Date().toISOString(),
    points: mergeHourly(marine, weather),
  };
}

/**
 * Fetch forecasts for multiple spots in parallel (with concurrency limit).
 */
export async function fetchMultiSpotForecast(
  spots: SurfSpot[],
  concurrency = 4,
): Promise<RawForecastResponse[]> {
  const results: RawForecastResponse[] = [];

  for (let i = 0; i < spots.length; i += concurrency) {
    const batch = spots.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((spot) => fetchSpotForecast(spot)),
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      }
      // Silently skip failed spots — caller will notice missing spotIds
    }
  }

  return results;
}
