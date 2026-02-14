/* ──────────────────────────────────────────────
 *  useLiveForecast – client hook
 *
 *  Fetches /api/forecast and returns ForecastSpot[].
 *  Falls back to mock/catalog data on error or
 *  while loading, so the page always renders.
 *
 *  State machine:
 *    idle → loading → success | error
 *    (on dayKey change: loading again)
 *
 *  Includes a 300 ms debounce so rapid spot switches
 *  don't trigger a fetch-storm.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ForecastSpot } from "./mockData";
import { createCatalogSpots } from "./mockData";

export type LiveStatus = "idle" | "loading" | "success" | "error";

export interface UseLiveForecastResult {
  spots: ForecastSpot[];
  status: LiveStatus;
  isLive: boolean;
  fetchedAt: string | null;
  errorMessage: string | null;
}

interface ApiSuccessResponse {
  source: "live";
  fetchedAt: string;
  spots: ForecastSpot[];
}

const DEBOUNCE_MS = 300;

export function useLiveForecast(dayKey: string): UseLiveForecastResult {
  const mockSpots = useMemo(() => createCatalogSpots(dayKey), [dayKey]);

  const [spots, setSpots] = useState<ForecastSpot[]>(mockSpots);
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [isLive, setIsLive] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Clear any pending debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set loading after debounce delay (avoids flicker on rapid switches)
    timerRef.current = setTimeout(() => {
      if (!cancelled) setStatus("loading");
    }, DEBOUNCE_MS);

    async function load() {
      try {
        const res = await fetch("/api/forecast", { cache: "no-store" });

        if (!res.ok) throw new Error(`API returned ${res.status}`);

        const json = (await res.json()) as ApiSuccessResponse;

        if (!cancelled && Array.isArray(json.spots) && json.spots.length > 0) {
          setSpots(json.spots);
          setIsLive(true);
          setFetchedAt(json.fetchedAt ?? new Date().toISOString());
          setErrorMessage(null);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn("[useLiveForecast] Falling back to mock data:", msg);
          setSpots(mockSpots);
          setIsLive(false);
          setFetchedAt(null);
          setErrorMessage(msg);
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dayKey, mockSpots]);

  return { spots, status, isLive, fetchedAt, errorMessage };
}
