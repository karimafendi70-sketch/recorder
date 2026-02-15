"use client";

import { useMemo } from "react";
import { useLanguage } from "@/app/LanguageProvider";
import { usePreferences } from "@/app/PreferencesProvider";
import { useLiveForecast } from "@/app/forecast/useLiveForecast";
import { makeQualityForSlot } from "@/app/forecast/scoringHelpers";
import { buildDaySummaries, getBestWindowForDay } from "@/lib/forecast/dayWindows";
import { buildSurfWindows } from "@/lib/forecast/surfWindows";
import { getSizeBand, summarizeConditions } from "@/lib/forecast/conditions";
import { SPOT_CATALOG } from "@/lib/spots/catalog";
import { RATING_ORDER, type RatingBucket } from "@/lib/alerts/types";
import type { SlotContext } from "@/lib/scores";
import type { TripCombo } from "./types";

/* ── Helpers ─────────────────────────────────── */

function asRatingBucket(color: string): RatingBucket {
  return (RATING_ORDER.includes(color as RatingBucket) ? color : "poor") as RatingBucket;
}

function num(v: unknown): number | null {
  return typeof v === "number" ? v : null;
}

/** Pick an i18n reason key based on the combo's conditions. */
function pickReasonKey(combo: TripCombo): string {
  const r = combo.ratingBucket;
  const ridx = RATING_ORDER.indexOf(r);
  const wind = combo.conditions?.wind;
  const size = combo.sizeBand;

  if (ridx >= 6 && wind === "offshore")        return "trip.reason.epicOffshore";
  if (ridx >= 5 && wind === "offshore")         return "trip.reason.cleanSwell";
  if (ridx >= 5)                                return "trip.reason.solidScore";
  if (wind === "offshore" || wind === "cross-off") return "trip.reason.lightWind";
  if (size === "overhead" || size === "doubleOverhead") return "trip.reason.bigSwell";
  if (combo.bestWindow)                         return "trip.reason.goodWindow";
  return "trip.reason.decentCombo";
}

/* ── Hook ────────────────────────────────────── */

export function useTripPlanner(
  startDate: string,      // YYYY-MM-DD
  endDate: string,        // YYYY-MM-DD
  spotFilter: string[],   // empty = all spots
  maxResults = 20,
) {
  const { preferences: prefs } = usePreferences();
  const { t, lang } = useLanguage();
  const { spots, status } = useLiveForecast("today");
  const isLoading = status === "idle" || status === "loading";

  const qualityForSlot = useMemo(() => makeQualityForSlot(prefs), [prefs]);

  const todayLabel = t("forecast.days.today");
  const tomorrowLabel = t("forecast.days.tomorrow");

  const combos = useMemo<TripCombo[]>(() => {
    if (isLoading || spots.length === 0) return [];

    const results: TripCombo[] = [];

    // Determine which spots to scan
    const spotSet = spotFilter.length > 0
      ? spots.filter((s) => spotFilter.includes(s.id))
      : spots;

    for (const spotData of spotSet) {
      const catalogSpot = SPOT_CATALOG.find((c) => c.id === spotData.id);
      if (!catalogSpot) continue;

      // Build summaries to get dayLabel + avgScore + ratingColor
      const daySums = buildDaySummaries(
        spotData.slots,
        qualityForSlot,
        lang,
        todayLabel,
        tomorrowLabel,
      );

      // Build all surf windows for this spot
      const allWindows = buildSurfWindows(spotData.slots, spotData.id, qualityForSlot);

      for (const daySum of daySums) {
        // Filter to date range
        if (daySum.dateKey < startDate || daySum.dateKey > endDate) continue;
        // Skip very poor days (score < 2) to keep results useful
        if (daySum.avgScore < 2) continue;

        const daySlots = spotData.slots.filter(
          (s: SlotContext) => s.dayKey === daySum.dateKey,
        );
        if (daySlots.length === 0) continue;

        // Best slot for condition snapshot
        const scored = daySlots.map((s: SlotContext) => ({ s, q: qualityForSlot(s) }));
        const best = scored.reduce((a, b) => (b.q.score > a.q.score ? b : a));
        const bestSlot = best.s;
        const merged = (bestSlot.mergedSpot ?? {}) as Record<string, unknown>;

        // Best window
        const dayBest = getBestWindowForDay(allWindows, spotData.slots, daySum.dateKey);

        const combo: TripCombo = {
          spotId: spotData.id,
          spotName: spotData.name,
          country: catalogSpot.country,
          region: catalogSpot.region,
          dateKey: daySum.dateKey,
          dayLabel: daySum.label,
          avgScore: daySum.avgScore,
          ratingBucket: asRatingBucket(daySum.ratingColor),
          waveHeightM: num(merged.golfHoogteMeter),
          wavePeriodS: num(merged.golfPeriodeSeconden),
          windSpeedKn: num(merged.windSpeedKnots),
          windDirDeg: num(merged.windDirectionDeg),
          sizeBand: (getSizeBand(bestSlot) ?? null) as TripCombo["sizeBand"],
          conditions: summarizeConditions(bestSlot),
          bestWindow: dayBest.window,
          slotCount: daySlots.length,
          reasonKey: "",  // filled after construction
        };
        combo.reasonKey = pickReasonKey(combo);

        results.push(combo);
      }
    }

    // Sort: highest avgScore first, then by date
    results.sort((a, b) => b.avgScore - a.avgScore || a.dateKey.localeCompare(b.dateKey));

    return results.slice(0, maxResults);
  }, [spots, isLoading, spotFilter, startDate, endDate, qualityForSlot, lang, todayLabel, tomorrowLabel, maxResults]);

  return { combos, isLoading, status };
}
