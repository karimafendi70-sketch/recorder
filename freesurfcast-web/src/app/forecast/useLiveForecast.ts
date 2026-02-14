/* ──────────────────────────────────────────────
 *  useLiveForecast – client hook
 *
 *  Fetches /api/forecast and returns ForecastSpot[].
 *  Falls back to mock/catalog data on error or
 *  while loading, so the page always renders.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ForecastSpot } from "./mockData";
import { createCatalogSpots } from "./mockData";

export type DataSource = "live" | "mock" | "loading";

interface LiveForecastState {
  spots: ForecastSpot[];
  source: DataSource;
  error: string | null;
  fetchedAt: string | null;
}

interface ApiSuccessResponse {
  source: "live";
  fetchedAt: string;
  spots: ForecastSpot[];
}

export function useLiveForecast(dayKey: string): LiveForecastState {
  const mockSpots = useMemo(() => createCatalogSpots(dayKey), [dayKey]);

  const [state, setState] = useState<LiveForecastState>({
    spots: mockSpots,
    source: "loading",
    error: null,
    fetchedAt: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/forecast", {
          // Don't cache in the browser — let the server do ISR caching
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const json = (await res.json()) as ApiSuccessResponse;

        if (!cancelled && Array.isArray(json.spots) && json.spots.length > 0) {
          setState({
            spots: json.spots,
            source: "live",
            error: null,
            fetchedAt: json.fetchedAt ?? new Date().toISOString(),
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useLiveForecast] Falling back to mock data:", err);
          setState({
            spots: mockSpots,
            source: "mock",
            error: err instanceof Error ? err.message : String(err),
            fetchedAt: null,
          });
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [dayKey, mockSpots]);

  return state;
}
