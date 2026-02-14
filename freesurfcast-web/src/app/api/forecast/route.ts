/* ──────────────────────────────────────────────
 *  GET /api/forecast?spotId=hossegor-fr
 *  GET /api/forecast               (all catalog spots)
 *
 *  Server-side Route Handler — fetches live data
 *  from Open-Meteo and returns adapted ForecastSpot[].
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { SPOT_CATALOG, getSpotById } from "@/lib/spots/catalog";
import {
  fetchSpotForecast,
  fetchMultiSpotForecast,
} from "@/lib/api/openMeteoClient";
import {
  adaptToForecastSpot,
  adaptMultiSpot,
} from "@/lib/api/forecastAdapter";

export const runtime = "nodejs";
export const revalidate = 1800; // ISR: 30 minutes

export async function GET(req: NextRequest) {
  const spotId = req.nextUrl.searchParams.get("spotId");
  const dayKey = "today";

  try {
    if (spotId) {
      /* ── Single spot ─────────────────────── */
      const catalogSpot = getSpotById(spotId);
      if (!catalogSpot) {
        return NextResponse.json(
          { error: "Spot not found", spotId },
          { status: 404 },
        );
      }

      const raw = await fetchSpotForecast(catalogSpot);
      const adapted = adaptToForecastSpot(raw, catalogSpot, dayKey);

      return NextResponse.json({
        source: "live" as const,
        fetchedAt: raw.fetchedAt,
        spots: [adapted],
      });
    }

    /* ── All spots (batch) ─────────────────── */
    const raws = await fetchMultiSpotForecast(SPOT_CATALOG, 6);
    const adapted = adaptMultiSpot(raws, SPOT_CATALOG, dayKey);

    return NextResponse.json({
      source: "live" as const,
      fetchedAt: new Date().toISOString(),
      spots: adapted,
    });
  } catch (err) {
    console.error("[/api/forecast] Open-Meteo fetch failed:", err);

    return NextResponse.json(
      {
        error: "Failed to fetch live forecast",
        detail: err instanceof Error ? err.message : String(err),
        source: "error" as const,
      },
      { status: 502 },
    );
  }
}
