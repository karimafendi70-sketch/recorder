"use client";

import { useMemo } from "react";
import { useLanguage } from "@/app/LanguageProvider";
import { usePreferences } from "@/app/PreferencesProvider";
import { useFavorites } from "@/app/FavoritesProvider";
import { useLiveForecast } from "@/app/forecast/useLiveForecast";
import { makeQualityForSlot } from "@/app/forecast/scoringHelpers";
import { buildDaySummaries } from "@/lib/forecast/dayWindows";
import { getSizeBand } from "@/lib/forecast/conditions";
import { buildAlertMap } from "@/lib/alerts/matchDayAlert";
import { RATING_ORDER, type RatingBucket } from "@/lib/alerts/types";
import type { SpotAlertProfile } from "@/lib/alerts/types";
import type { SlotContext } from "@/lib/scores";
import type { DayHighlight, SpotDiscoverSummary } from "./types";

/* ── LocalStorage read for alert profiles ────── */

const ALERT_PREFIX = "freesurfcast:alerts:";

function readAlertProfile(spotId: string): SpotAlertProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${ALERT_PREFIX}${spotId}`);
    return raw ? (JSON.parse(raw) as SpotAlertProfile) : null;
  } catch {
    return null;
  }
}

/* ── RatingColor → RatingBucket (same string set) ── */

function asRatingBucket(ratingColor: string): RatingBucket {
  return (RATING_ORDER.includes(ratingColor as RatingBucket)
    ? ratingColor
    : "poor") as RatingBucket;
}

/* ── Hook ────────────────────────────────────── */

export function useDiscoverData() {
  const { preferences: prefs } = usePreferences();
  const { t, lang } = useLanguage();
  const { favoriteIds } = useFavorites();

  const { spots, status } = useLiveForecast("today");
  const isLoading = status === "idle" || status === "loading";

  const qualityForSlot = useMemo(() => makeQualityForSlot(prefs), [prefs]);

  const todayLabel = t("forecast.days.today");
  const tomorrowLabel = t("forecast.days.tomorrow");

  const { topDays, spotSummaries } = useMemo(() => {
    const allHighlights: DayHighlight[] = [];
    const summaries: SpotDiscoverSummary[] = [];

    for (const spot of spots) {
      // 1 — Build day summaries for this spot
      const daySums = buildDaySummaries(
        spot.slots,
        qualityForSlot,
        lang,
        todayLabel,
        tomorrowLabel,
      );

      // 2 — Group slots by day
      const slotsByDay = new Map<string, SlotContext[]>();
      for (const s of spot.slots) {
        const key = s.dayKey ?? "unknown";
        let arr = slotsByDay.get(key);
        if (!arr) { arr = []; slotsByDay.set(key, arr); }
        arr.push(s);
      }

      // 3 — Check alert profile
      const alertProfile = readAlertProfile(spot.id);
      const alertMap = buildAlertMap(alertProfile, daySums, slotsByDay);

      let alertDayCount = 0;
      let bestHighlight: DayHighlight | null = null;

      for (const ds of daySums) {
        const daySlots = slotsByDay.get(ds.dateKey) ?? [];

        // Representative size band (from the best slot of the day)
        let bestSlotSize: string | undefined;
        if (daySlots.length > 0) {
          const bestSlot = daySlots.reduce((a, b) =>
            qualityForSlot(b).score > qualityForSlot(a).score ? b : a,
          );
          bestSlotSize = getSizeBand(bestSlot);
        }

        const matched = alertMap[ds.dateKey] ?? false;
        if (matched) alertDayCount++;

        const highlight: DayHighlight = {
          spotId: spot.id,
          spotName: spot.name,
          country: "", // will be filled from catalog if available
          dateKey: ds.dateKey,
          dayLabel: ds.label,
          ratingBucket: asRatingBucket(ds.ratingColor),
          avgScore: ds.avgScore,
          sizeBand: bestSlotSize as DayHighlight["sizeBand"],
          alertMatched: matched,
        };

        allHighlights.push(highlight);

        if (!bestHighlight || ds.avgScore > bestHighlight.avgScore) {
          bestHighlight = highlight;
        }
      }

      summaries.push({
        spotId: spot.id,
        spotName: spot.name,
        country: "",
        bestDay: bestHighlight,
        alertDayCount,
      });
    }

    // Sort top days: alert-matched first, then by avgScore descending
    const sorted = [...allHighlights].sort((a, b) => {
      if (a.alertMatched !== b.alertMatched) return a.alertMatched ? -1 : 1;
      return b.avgScore - a.avgScore;
    });

    // Deduplicate: keep only the best day per spot (for Top Days)
    const seenSpots = new Set<string>();
    const topDays: DayHighlight[] = [];
    for (const h of sorted) {
      if (seenSpots.has(h.spotId)) continue;
      seenSpots.add(h.spotId);
      topDays.push(h);
    }

    return { topDays: topDays.slice(0, 12), spotSummaries: summaries };
  }, [spots, qualityForSlot, lang, todayLabel, tomorrowLabel]);

  // Enrich with country from catalog (client-side only)
  const enrichedTopDays = useMemo(() => {
    // Dynamic import would be cleaner, but catalog is a sync module
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getSpotById } = require("@/lib/spots/catalog") as {
      getSpotById: (id: string) => { country: string } | undefined;
    };
    return topDays.map((h) => ({
      ...h,
      country: getSpotById(h.spotId)?.country ?? "",
    }));
  }, [topDays]);

  const enrichedSummaries = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getSpotById } = require("@/lib/spots/catalog") as {
      getSpotById: (id: string) => { country: string } | undefined;
    };
    return spotSummaries.map((s) => ({
      ...s,
      country: getSpotById(s.spotId)?.country ?? "",
    }));
  }, [spotSummaries]);

  // Split summaries by favorites
  const favoriteSummaries = useMemo(
    () => enrichedSummaries.filter((s) => favoriteIds.has(s.spotId)),
    [enrichedSummaries, favoriteIds],
  );

  return {
    topDays: enrichedTopDays,
    favoriteSummaries,
    allSummaries: enrichedSummaries,
    isLoading,
    status,
  };
}
