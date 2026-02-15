"use client";

import { useMemo } from "react";
import { useLanguage } from "@/app/LanguageProvider";
import { usePreferences } from "@/app/PreferencesProvider";
import { useLiveForecast } from "@/app/forecast/useLiveForecast";
import { makeQualityForSlot } from "@/app/forecast/scoringHelpers";
import { buildDaySummaries, getBestWindowForDay } from "@/lib/forecast/dayWindows";
import { buildSurfWindows } from "@/lib/forecast/surfWindows";
import { getSizeBand, summarizeConditions } from "@/lib/forecast/conditions";
import { getSpotById } from "@/lib/spots/catalog";
import { RATING_ORDER, type RatingBucket, type SizeBand } from "@/lib/alerts/types";
import type { SlotContext } from "@/lib/scores";
import type { SpotDayColumn } from "./types";

/* ── Helper ──────────────────────────────────── */

function asRatingBucket(color: string): RatingBucket {
  return (RATING_ORDER.includes(color as RatingBucket) ? color : "poor") as RatingBucket;
}

function num(v: unknown, fb: number | null = null): number | null {
  return typeof v === "number" ? v : fb;
}

/* ── Hook ────────────────────────────────────── */

export function useCompareForecast(spotIds: string[], dayKey: string) {
  const { preferences: prefs } = usePreferences();
  const { t, lang } = useLanguage();

  const { spots, status } = useLiveForecast("today");
  const isLoading = status === "idle" || status === "loading";

  const qualityForSlot = useMemo(() => makeQualityForSlot(prefs), [prefs]);

  const todayLabel = t("forecast.days.today");
  const tomorrowLabel = t("forecast.days.tomorrow");

  const columns = useMemo<SpotDayColumn[]>(() => {
    return spotIds.map((sid) => {
      const spotData = spots.find((s) => s.id === sid);
      const catalogSpot = getSpotById(sid);

      if (!spotData) {
        return emptyColumn(sid, catalogSpot?.name ?? sid, catalogSpot?.country ?? "", dayKey);
      }

      // Day summaries for label lookup
      const daySums = buildDaySummaries(
        spotData.slots,
        qualityForSlot,
        lang,
        todayLabel,
        tomorrowLabel,
      );

      const daySum = daySums.find((d) => d.dateKey === dayKey);
      const dayLabel = daySum?.label ?? dayKey;

      // Filter slots for this day
      const daySlots = spotData.slots.filter((s) => s.dayKey === dayKey);

      if (daySlots.length === 0) {
        return emptyColumn(sid, spotData.name, catalogSpot?.country ?? "", dayKey, dayLabel);
      }

      // Best slot (highest score)
      const scored = daySlots.map((s) => ({ s, q: qualityForSlot(s) }));
      const best = scored.reduce((a, b) => (b.q.score > a.q.score ? b : a));
      const bestSlot = best.s;
      const merged = (bestSlot.mergedSpot ?? {}) as Record<string, unknown>;

      // Surf windows for this spot
      const windows = buildSurfWindows(spotData.slots, sid, qualityForSlot);
      const dayBest = getBestWindowForDay(windows, spotData.slots, dayKey);

      const avgScore = daySum?.avgScore ?? 0;

      return {
        spotId: sid,
        spotName: spotData.name,
        country: catalogSpot?.country ?? "",
        dayKey,
        dayLabel,
        avgScore,
        ratingBucket: asRatingBucket(daySum?.ratingColor ?? "poor"),
        waveHeightM: num(merged.golfHoogteMeter),
        wavePeriodS: num(merged.golfPeriodeSeconden),
        windSpeedKn: num(merged.windSpeedKnots),
        windDirDeg: num(merged.windDirectionDeg),
        sizeBand: getSizeBand(bestSlot) as SizeBand,
        conditions: summarizeConditions(bestSlot),
        bestWindow: dayBest.window,
        slotCount: daySlots.length,
      } satisfies SpotDayColumn;
    });
  }, [spotIds, dayKey, spots, qualityForSlot, lang, todayLabel, tomorrowLabel]);

  return { columns, isLoading, status };
}

/* ── Empty column factory ────────────────────── */

function emptyColumn(
  spotId: string,
  spotName: string,
  country: string,
  dayKey: string,
  dayLabel?: string,
): SpotDayColumn {
  return {
    spotId,
    spotName,
    country,
    dayKey,
    dayLabel: dayLabel ?? dayKey,
    avgScore: 0,
    ratingBucket: "poor",
    waveHeightM: null,
    wavePeriodS: null,
    windSpeedKn: null,
    windDirDeg: null,
    sizeBand: null,
    conditions: null,
    bestWindow: null,
    slotCount: 0,
  };
}
