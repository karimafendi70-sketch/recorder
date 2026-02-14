/* ──────────────────────────────────────────────
 *  FreeSurfCast – Surf Spot Catalog
 *  31 spots migrated from the vanilla app (spots.js)
 *  All field names are in English.
 * ────────────────────────────────────────────── */

export type Region = "eu" | "am" | "af" | "ap";

export type DifficultyTag = "beginner" | "intermediate" | "advanced" | "mixed";

export type SpotType = "beach" | "reef" | "point" | "mixed";

export type Orientation = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

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
  /** Difficulty tag for the spot */
  difficultyTag: DifficultyTag;
  /** Short description / notes */
  notes: string;
  /** Whether this spot is featured / highlighted in the UI */
  featured?: boolean;
  /** Break type */
  spotType: SpotType;
  /** Cardinal orientation the coast faces */
  orientation: Orientation;
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

/** Derive cardinal orientation from degrees */
function orient(deg: number): Orientation {
  const DIRS: Orientation[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return DIRS[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
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
    difficultyTag: "beginner",
    notes: "Most popular Dutch beach break; consistent but cold.",
    spotType: "beach",
    orientation: orient(270),
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
    difficultyTag: "advanced",
    notes: "Heavy sand-bottom barrels; hosts WSL events.",
    featured: true,
    spotType: "beach",
    orientation: orient(270),
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
    difficultyTag: "intermediate",
    notes: "World Surfing Reserve with multiple reef and point breaks.",
    featured: true,
    spotType: "mixed",
    orientation: orient(270),
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
    difficultyTag: "mixed",
    notes: "Peninsula with breaks for all levels; Supertubos is world-class.",
    featured: true,
    spotType: "beach",
    orientation: orient(260),
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
    difficultyTag: "advanced",
    notes: "Big-wave capital of Europe; underwater canyon creates giants.",
    spotType: "beach",
    orientation: orient(270),
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
    difficultyTag: "beginner",
    notes: "Sandy beach near Lisbon; mellow waves, easy access.",
    spotType: "beach",
    orientation: orient(240),
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
    difficultyTag: "advanced",
    notes: "Legendary left-hand river-mouth barrel in the Basque Country.",
    spotType: "point",
    orientation: orient(350),
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
    difficultyTag: "beginner",
    notes: "Long sandy beach; great for learning in summer.",
    spotType: "beach",
    orientation: orient(355),
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
    difficultyTag: "intermediate",
    notes: "Cliff-backed beach break near Bilbao; consistent swell.",
    spotType: "beach",
    orientation: orient(350),
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
    difficultyTag: "mixed",
    notes: "Birthplace of European surfing; multiple peaks for all levels.",
    featured: true,
    spotType: "beach",
    orientation: orient(300),
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
    difficultyTag: "intermediate",
    notes: "Punchy beach break on the Atlantic coast; competition-grade.",
    spotType: "beach",
    orientation: orient(270),
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
    difficultyTag: "intermediate",
    notes: "Exposed Brittany point break; windy but reliable.",
    spotType: "point",
    orientation: orient(260),
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
    difficultyTag: "beginner",
    notes: "UK surf capital; Fistral Beach is the main break.",
    spotType: "beach",
    orientation: orient(300),
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
    difficultyTag: "advanced",
    notes: "Cold-water right-hand reef; Scotland's premier wave.",
    spotType: "reef",
    orientation: orient(60),
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
    difficultyTag: "advanced",
    notes: "One of the world's best right-hand point breaks.",
    featured: true,
    spotType: "point",
    orientation: orient(140),
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
    difficultyTag: "intermediate",
    notes: "Long right-hand point break; best in winter swells.",
    spotType: "point",
    orientation: orient(320),
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
    difficultyTag: "mixed",
    notes: "Surf village with multiple breaks for different levels.",
    spotType: "mixed",
    orientation: orient(320),
  },
  {
    id: "killer-point-ma",
    region: "af",
    coastOrientationDeg: 310,
    name: "Killer Point",
    country: "Morocco",
    latitude: 30.552,
    longitude: -9.726,
    waveHeightM: 2.5,
    wavePeriodS: 12,
    windSpeedKnots: 10,
    windDirectionDeg: w("NO"),
    waterTempC: 19,
    difficultyTag: "advanced",
    notes: "Heavy right-hand reef break near Taghazout; named after orca sightings.",
    spotType: "reef",
    orientation: orient(310),
  },
  {
    id: "boilers-ma",
    region: "af",
    coastOrientationDeg: 310,
    name: "Boilers",
    country: "Morocco",
    latitude: 30.541,
    longitude: -9.722,
    waveHeightM: 2.2,
    wavePeriodS: 12,
    windSpeedKnots: 10,
    windDirectionDeg: w("NO"),
    waterTempC: 19,
    difficultyTag: "advanced",
    notes: "Powerful right breaking over a shallow reef; shipwreck marker.",
    spotType: "reef",
    orientation: orient(310),
  },
  {
    id: "panoramas-ma",
    region: "af",
    coastOrientationDeg: 320,
    name: "Panoramas",
    country: "Morocco",
    latitude: 30.557,
    longitude: -9.718,
    waveHeightM: 1.4,
    wavePeriodS: 9,
    windSpeedKnots: 11,
    windDirectionDeg: w("NO"),
    waterTempC: 19,
    difficultyTag: "beginner",
    notes: "Gentle beach break north of Taghazout; ideal for learners.",
    spotType: "beach",
    orientation: orient(320),
  },
  {
    id: "tamri-ma",
    region: "af",
    coastOrientationDeg: 300,
    name: "Tamri",
    country: "Morocco",
    latitude: 30.693,
    longitude: -9.824,
    waveHeightM: 2.0,
    wavePeriodS: 11,
    windSpeedKnots: 12,
    windDirectionDeg: w("NO"),
    waterTempC: 18,
    difficultyTag: "advanced",
    notes: "Remote river-mouth break with Devil's Rock offshore; big swells.",
    spotType: "reef",
    orientation: orient(300),
  },
  {
    id: "imsouane-bay-ma",
    region: "af",
    coastOrientationDeg: 300,
    name: "Imsouane Bay",
    country: "Morocco",
    latitude: 30.842,
    longitude: -9.826,
    waveHeightM: 1.3,
    wavePeriodS: 10,
    windSpeedKnots: 10,
    windDirectionDeg: w("NO"),
    waterTempC: 18,
    difficultyTag: "beginner",
    notes: "Famous for Africa's longest right-hand wave; mellow and fun.",
    spotType: "point",
    orientation: orient(300),
  },
  {
    id: "imsouane-cathedral-ma",
    region: "af",
    coastOrientationDeg: 290,
    name: "Imsouane Cathedral",
    country: "Morocco",
    latitude: 30.833,
    longitude: -9.833,
    waveHeightM: 2.0,
    wavePeriodS: 11,
    windSpeedKnots: 11,
    windDirectionDeg: w("NO"),
    waterTempC: 18,
    difficultyTag: "intermediate",
    notes: "Fast reef break south of Imsouane; more power, shorter ride.",
    spotType: "reef",
    orientation: orient(290),
  },
  {
    id: "essaouira-ma",
    region: "af",
    coastOrientationDeg: 310,
    name: "Essaouira",
    country: "Morocco",
    latitude: 31.508,
    longitude: -9.770,
    waveHeightM: 1.6,
    wavePeriodS: 10,
    windSpeedKnots: 18,
    windDirectionDeg: w("N"),
    waterTempC: 19,
    difficultyTag: "intermediate",
    notes: "Windy Atlantic port city; Moulay Bouzerktoune beach break nearby.",
    spotType: "beach",
    orientation: orient(310),
  },
  {
    id: "safi-ma",
    region: "af",
    coastOrientationDeg: 290,
    name: "Safi",
    country: "Morocco",
    latitude: 32.283,
    longitude: -9.247,
    waveHeightM: 2.2,
    wavePeriodS: 12,
    windSpeedKnots: 12,
    windDirectionDeg: w("NO"),
    waterTempC: 19,
    difficultyTag: "advanced",
    notes: "The Garden – world-class right point break in the harbour.",
    spotType: "point",
    orientation: orient(290),
  },
  {
    id: "mirleft-ma",
    region: "af",
    coastOrientationDeg: 300,
    name: "Mirleft",
    country: "Morocco",
    latitude: 29.580,
    longitude: -10.040,
    waveHeightM: 1.7,
    wavePeriodS: 10,
    windSpeedKnots: 13,
    windDirectionDeg: w("NO"),
    waterTempC: 20,
    difficultyTag: "intermediate",
    notes: "Scenic cliffside beach breaks; uncrowded southern coast gem.",
    spotType: "beach",
    orientation: orient(300),
  },
  {
    id: "sidi-ifni-ma",
    region: "af",
    coastOrientationDeg: 290,
    name: "Sidi Ifni",
    country: "Morocco",
    latitude: 29.383,
    longitude: -10.173,
    waveHeightM: 1.8,
    wavePeriodS: 11,
    windSpeedKnots: 14,
    windDirectionDeg: w("N"),
    waterTempC: 20,
    difficultyTag: "mixed",
    notes: "Former Spanish enclave; exposed beach break with consistent swell.",
    spotType: "beach",
    orientation: orient(290),
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
    difficultyTag: "intermediate",
    notes: "Volcanic reef breaks; windy but warm year-round.",
    spotType: "reef",
    orientation: orient(0),
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
    difficultyTag: "intermediate",
    notes: "Powerful reef breaks; La Santa Left is the stand-out.",
    spotType: "reef",
    orientation: orient(330),
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
    difficultyTag: "advanced",
    notes: "The most famous wave in the world; shallow reef barrels.",
    featured: true,
    spotType: "reef",
    orientation: orient(10),
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
    difficultyTag: "mixed",
    notes: "Steamer Lane and Pleasure Point; NorCal surf hub.",
    spotType: "point",
    orientation: orient(240),
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
    difficultyTag: "beginner",
    notes: "Surf City USA; long pier break, gentle for beginners.",
    spotType: "beach",
    orientation: orient(220),
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
    difficultyTag: "beginner",
    notes: "Scenic SoCal reef and beach breaks; warm water.",
    spotType: "reef",
    orientation: orient(250),
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
    difficultyTag: "intermediate",
    notes: "Barrier island chain; picks up East-coast hurricane swells.",
    spotType: "beach",
    orientation: orient(95),
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
    difficultyTag: "beginner",
    notes: "Rio's iconic city surf, between Ipanema and Copacabana.",
    spotType: "beach",
    orientation: orient(160),
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
    difficultyTag: "advanced",
    notes: "Powerful big-wave left; Chile's most famous break.",
    spotType: "point",
    orientation: orient(250),
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
    difficultyTag: "advanced",
    notes: "Clifftop temple reef break; long barrels on the Indian Ocean.",
    featured: true,
    spotType: "reef",
    orientation: orient(200),
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
    difficultyTag: "mixed",
    notes: "Trendy beach break area; Old Man's suits all levels.",
    spotType: "beach",
    orientation: orient(220),
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
    difficultyTag: "mixed",
    notes: "Superbank to Snapper Rocks; world-class sand-bottom points.",
    featured: true,
    spotType: "point",
    orientation: orient(110),
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
    difficultyTag: "beginner",
    notes: "Sydney's ferry-accessible beach; great for learners.",
    spotType: "beach",
    orientation: orient(100),
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
    difficultyTag: "intermediate",
    notes: "Long left-hand point break; NZ's most consistent wave.",
    spotType: "point",
    orientation: orient(270),
  },
];

/* ── Helpers ─────────────────────────────────── */

/** Return the 8 featured/highlighted spots. */
export function getFeaturedSpots(): SurfSpot[] {
  return SPOT_CATALOG.filter((s) => s.featured);
}

/** Return a sorted list of unique country names in the catalog. */
export function getCountries(): string[] {
  const set = new Set(SPOT_CATALOG.map((s) => s.country));
  return [...set].sort((a, b) => a.localeCompare(b));
}

/** Return all spots for a given country (exact match). */
export function getSpotsByCountry(country: string): SurfSpot[] {
  return SPOT_CATALOG.filter((s) => s.country === country);
}

/** Return unique spot types present in the catalog. */
export function getSpotTypes(): SpotType[] {
  return [...new Set(SPOT_CATALOG.map((s) => s.spotType))];
}

/** Return unique difficulty tags present in the catalog. */
export function getDifficultyTags(): DifficultyTag[] {
  return [...new Set(SPOT_CATALOG.map((s) => s.difficultyTag))];
}

/** Filter spots by optional country, difficulty, and spot type. */
export function filterSpots(opts: {
  country?: string | null;
  difficulty?: DifficultyTag | null;
  spotType?: SpotType | null;
}): SurfSpot[] {
  return SPOT_CATALOG.filter((s) => {
    if (opts.country && s.country !== opts.country) return false;
    if (opts.difficulty && s.difficultyTag !== opts.difficulty) return false;
    if (opts.spotType && s.spotType !== opts.spotType) return false;
    return true;
  });
}

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
