/* ──────────────────────────────────────────────
 *  FreeSurfCast – Surf Spot Catalog
 *  31 spots migrated from the vanilla app (spots.js)
 *  All field names are in English.
 * ────────────────────────────────────────────── */

export type Region = "eu" | "am" | "af" | "ap";

export interface SurfSpot {
  id: string;
  region: Region;
  coastOrientationDeg: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  /** Baseline wave height in metres */
  waveHeightM: number;
  /** Baseline wave period in seconds */
  wavePeriodS: number;
  /** Baseline wind speed in knots */
  windSpeedKnots: number;
  /** Wind direction in degrees (0 = N, 90 = E, 180 = S, 270 = W) */
  windDirectionDeg: number;
  /** Water temperature in °C */
  waterTempC: number;
}

/* ── Dutch abbreviation → degrees mapping ──── */
const WIND_DEG: Record<string, number> = {
  N: 0,
  NO: 45,
  O: 90,
  ZO: 135,
  Z: 180,
  ZW: 225,
  W: 270,
  NW: 315,
};

function w(dir: string): number {
  return WIND_DEG[dir] ?? 0;
}

export const SPOT_CATALOG: SurfSpot[] = [
  // ───── Europe ─────────────────────────────────
  {
    id: "scheveningen-nl",
    region: "eu",
    coastOrientationDeg: 270,
    name: "Scheveningen",
    country: "Netherlands",
    latitude: 52.11,
    longitude: 4.26,
    waveHeightM: 1.2,
    wavePeriodS: 8,
    windSpeedKnots: 14,
    windDirectionDeg: w("NO"),
    waterTempC: 17,
  },
  {
    id: "hossegor-fr",
    region: "eu",
    coastOrientationDeg: 270,
    name: "Hossegor",
    country: "France",
    latitude: 43.665,
    longitude: -1.443,
    waveHeightM: 1.9,
    wavePeriodS: 11,
    windSpeedKnots: 12,
    windDirectionDeg: w("W"),
    waterTempC: 19,
  },
  {
    id: "ericeira-pt",
    region: "eu",
    coastOrientationDeg: 270,
    name: "Ericeira",
    country: "Portugal",
    latitude: 38.963,
    longitude: -9.417,
    waveHeightM: 1.7,
    wavePeriodS: 10,
    windSpeedKnots: 11,
    windDirectionDeg: w("NW"),
    waterTempC: 18,
  },
  {
    id: "peniche-pt",
    region: "eu",
    coastOrientationDeg: 260,
    name: "Peniche",
    country: "Portugal",
    latitude: 39.355,
    longitude: -9.381,
    waveHeightM: 1.8,
    wavePeriodS: 11,
    windSpeedKnots: 13,
    windDirectionDeg: w("NW"),
    waterTempC: 18,
  },
  {
    id: "nazare-pt",
    region: "eu",
    coastOrientationDeg: 270,
    name: "Nazaré",
    country: "Portugal",
    latitude: 39.602,
    longitude: -9.07,
    waveHeightM: 2.6,
    wavePeriodS: 13,
    windSpeedKnots: 15,
    windDirectionDeg: w("W"),
    waterTempC: 17,
  },
  {
    id: "carcavelos-pt",
    region: "eu",
    coastOrientationDeg: 240,
    name: "Carcavelos",
    country: "Portugal",
    latitude: 38.676,
    longitude: -9.337,
    waveHeightM: 1.4,
    wavePeriodS: 9,
    windSpeedKnots: 12,
    windDirectionDeg: w("NW"),
    waterTempC: 18,
  },
  {
    id: "mundaka-es",
    region: "eu",
    coastOrientationDeg: 350,
    name: "Mundaka",
    country: "Spain",
    latitude: 43.408,
    longitude: -2.697,
    waveHeightM: 1.6,
    wavePeriodS: 10,
    windSpeedKnots: 11,
    windDirectionDeg: w("W"),
    waterTempC: 17,
  },
  {
    id: "zarautz-es",
    region: "eu",
    coastOrientationDeg: 355,
    name: "Zarautz",
    country: "Spain",
    latitude: 43.287,
    longitude: -2.173,
    waveHeightM: 1.5,
    wavePeriodS: 9,
    windSpeedKnots: 14,
    windDirectionDeg: w("NW"),
    waterTempC: 18,
  },
  {
    id: "sopelana-es",
    region: "eu",
    coastOrientationDeg: 350,
    name: "Sopelana",
    country: "Spain",
    latitude: 43.379,
    longitude: -2.997,
    waveHeightM: 1.7,
    wavePeriodS: 10,
    windSpeedKnots: 13,
    windDirectionDeg: w("W"),
    waterTempC: 17,
  },
  {
    id: "biarritz-fr",
    region: "eu",
    coastOrientationDeg: 300,
    name: "Biarritz",
    country: "France",
    latitude: 43.483,
    longitude: -1.558,
    waveHeightM: 1.8,
    wavePeriodS: 11,
    windSpeedKnots: 12,
    windDirectionDeg: w("W"),
    waterTempC: 19,
  },
  {
    id: "lacanau-fr",
    region: "eu",
    coastOrientationDeg: 270,
    name: "Lacanau",
    country: "France",
    latitude: 45.0,
    longitude: -1.202,
    waveHeightM: 1.7,
    wavePeriodS: 10,
    windSpeedKnots: 13,
    windDirectionDeg: w("NW"),
    waterTempC: 18,
  },
  {
    id: "la-torche-fr",
    region: "eu",
    coastOrientationDeg: 260,
    name: "La Torche",
    country: "France",
    latitude: 47.84,
    longitude: -4.368,
    waveHeightM: 1.9,
    wavePeriodS: 11,
    windSpeedKnots: 14,
    windDirectionDeg: w("W"),
    waterTempC: 16,
  },
  {
    id: "newquay-uk",
    region: "eu",
    coastOrientationDeg: 300,
    name: "Newquay",
    country: "United Kingdom",
    latitude: 50.416,
    longitude: -5.073,
    waveHeightM: 1.6,
    wavePeriodS: 9,
    windSpeedKnots: 15,
    windDirectionDeg: w("ZW"),
    waterTempC: 15,
  },
  {
    id: "thurso-east-uk",
    region: "eu",
    coastOrientationDeg: 60,
    name: "Thurso East",
    country: "United Kingdom",
    latitude: 58.595,
    longitude: -3.522,
    waveHeightM: 2.0,
    wavePeriodS: 12,
    windSpeedKnots: 16,
    windDirectionDeg: w("W"),
    waterTempC: 12,
  },

  // ───── Africa ─────────────────────────────────
  {
    id: "jeffreys-bay-za",
    region: "af",
    coastOrientationDeg: 140,
    name: "Jeffreys Bay",
    country: "South Africa",
    latitude: -34.05,
    longitude: 24.93,
    waveHeightM: 2.4,
    wavePeriodS: 13,
    windSpeedKnots: 10,
    windDirectionDeg: w("ZW"),
    waterTempC: 21,
  },
  {
    id: "anchor-point-ma",
    region: "af",
    coastOrientationDeg: 320,
    name: "Anchor Point",
    country: "Morocco",
    latitude: 30.544,
    longitude: -9.709,
    waveHeightM: 1.9,
    wavePeriodS: 11,
    windSpeedKnots: 12,
    windDirectionDeg: w("NO"),
    waterTempC: 19,
  },
  {
    id: "taghazout-ma",
    region: "af",
    coastOrientationDeg: 320,
    name: "Taghazout",
    country: "Morocco",
    latitude: 30.545,
    longitude: -9.711,
    waveHeightM: 1.8,
    wavePeriodS: 10,
    windSpeedKnots: 11,
    windDirectionDeg: w("NO"),
    waterTempC: 19,
  },
  {
    id: "fuerteventura-es",
    region: "af",
    coastOrientationDeg: 0,
    name: "Fuerteventura",
    country: "Canary Islands",
    latitude: 28.357,
    longitude: -14.053,
    waveHeightM: 1.7,
    wavePeriodS: 10,
    windSpeedKnots: 15,
    windDirectionDeg: w("N"),
    waterTempC: 22,
  },
  {
    id: "lanzarote-es",
    region: "af",
    coastOrientationDeg: 330,
    name: "Lanzarote",
    country: "Canary Islands",
    latitude: 29.047,
    longitude: -13.589,
    waveHeightM: 1.9,
    wavePeriodS: 11,
    windSpeedKnots: 14,
    windDirectionDeg: w("N"),
    waterTempC: 22,
  },

  // ───── Americas ───────────────────────────────
  {
    id: "pipeline-us-hi",
    region: "am",
    coastOrientationDeg: 10,
    name: "Pipeline",
    country: "Hawaii",
    latitude: 21.665,
    longitude: -158.051,
    waveHeightM: 2.8,
    wavePeriodS: 14,
    windSpeedKnots: 16,
    windDirectionDeg: w("NO"),
    waterTempC: 25,
  },
  {
    id: "santa-cruz-us",
    region: "am",
    coastOrientationDeg: 240,
    name: "Santa Cruz",
    country: "United States",
    latitude: 36.951,
    longitude: -122.026,
    waveHeightM: 1.8,
    wavePeriodS: 11,
    windSpeedKnots: 10,
    windDirectionDeg: w("NW"),
    waterTempC: 15,
  },
  {
    id: "huntington-beach-us",
    region: "am",
    coastOrientationDeg: 220,
    name: "Huntington Beach",
    country: "United States",
    latitude: 33.659,
    longitude: -117.998,
    waveHeightM: 1.4,
    wavePeriodS: 9,
    windSpeedKnots: 9,
    windDirectionDeg: w("W"),
    waterTempC: 18,
  },
  {
    id: "la-jolla-us",
    region: "am",
    coastOrientationDeg: 250,
    name: "La Jolla",
    country: "United States",
    latitude: 32.832,
    longitude: -117.271,
    waveHeightM: 1.3,
    wavePeriodS: 9,
    windSpeedKnots: 8,
    windDirectionDeg: w("W"),
    waterTempC: 19,
  },
  {
    id: "outer-banks-us",
    region: "am",
    coastOrientationDeg: 95,
    name: "Outer Banks",
    country: "United States",
    latitude: 35.558,
    longitude: -75.466,
    waveHeightM: 1.9,
    wavePeriodS: 10,
    windSpeedKnots: 14,
    windDirectionDeg: w("ZW"),
    waterTempC: 20,
  },
  {
    id: "arpoador-br",
    region: "am",
    coastOrientationDeg: 160,
    name: "Arpoador",
    country: "Brazil",
    latitude: -22.987,
    longitude: -43.191,
    waveHeightM: 1.5,
    wavePeriodS: 9,
    windSpeedKnots: 12,
    windDirectionDeg: w("ZO"),
    waterTempC: 24,
  },
  {
    id: "punta-de-lobos-cl",
    region: "am",
    coastOrientationDeg: 250,
    name: "Punta de Lobos",
    country: "Chile",
    latitude: -34.416,
    longitude: -72.034,
    waveHeightM: 2.2,
    wavePeriodS: 12,
    windSpeedKnots: 13,
    windDirectionDeg: w("Z"),
    waterTempC: 15,
  },

  // ───── Asia-Pacific ───────────────────────────
  {
    id: "uluwatu-id",
    region: "ap",
    coastOrientationDeg: 200,
    name: "Uluwatu",
    country: "Indonesia",
    latitude: -8.829,
    longitude: 115.084,
    waveHeightM: 2.1,
    wavePeriodS: 12,
    windSpeedKnots: 9,
    windDirectionDeg: w("ZO"),
    waterTempC: 27,
  },
  {
    id: "canggu-id",
    region: "ap",
    coastOrientationDeg: 220,
    name: "Canggu",
    country: "Indonesia",
    latitude: -8.648,
    longitude: 115.136,
    waveHeightM: 1.8,
    wavePeriodS: 10,
    windSpeedKnots: 10,
    windDirectionDeg: w("ZO"),
    waterTempC: 28,
  },
  {
    id: "gold-coast-au",
    region: "ap",
    coastOrientationDeg: 110,
    name: "Gold Coast",
    country: "Australia",
    latitude: -28.016,
    longitude: 153.43,
    waveHeightM: 1.6,
    wavePeriodS: 10,
    windSpeedKnots: 12,
    windDirectionDeg: w("O"),
    waterTempC: 24,
  },
  {
    id: "manly-au",
    region: "ap",
    coastOrientationDeg: 100,
    name: "Manly",
    country: "Australia",
    latitude: -33.797,
    longitude: 151.288,
    waveHeightM: 1.5,
    wavePeriodS: 9,
    windSpeedKnots: 13,
    windDirectionDeg: w("ZO"),
    waterTempC: 22,
  },
  {
    id: "raglan-nz",
    region: "ap",
    coastOrientationDeg: 270,
    name: "Raglan",
    country: "New Zealand",
    latitude: -37.808,
    longitude: 174.816,
    waveHeightM: 1.9,
    wavePeriodS: 11,
    windSpeedKnots: 11,
    windDirectionDeg: w("ZW"),
    waterTempC: 18,
  },
];

/* ── Search helper ───────────────────────────── */

/**
 * Case-insensitive search on spot name and country.
 * Returns matching spots, capped at `limit` (default 10).
 */
export function searchSpotsByName(
  query: string,
  limit = 10
): SurfSpot[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return SPOT_CATALOG.filter(
    (s) => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
  ).slice(0, limit);
}

/**
 * Look up a single spot by ID. Returns `undefined` when not found.
 */
export function getSpotById(id: string): SurfSpot | undefined {
  return SPOT_CATALOG.find((s) => s.id === id);
}

/**
 * Return all spots belonging to a given region.
 */
export function getSpotsByRegion(region: Region): SurfSpot[] {
  return SPOT_CATALOG.filter((s) => s.region === region);
}
