"use client";

import { useCallback, useMemo, useState } from "react";
import { buildDaypartHeatmapData } from "@/lib/heatmap";
import { buildMultiSpotOverview } from "@/lib/spots";
import {
  getSlotQualityScore,
  getSpotDayScore,
  type SlotContext,
  type SlotQuality,
} from "@/lib/scores";
import { buildTimelineDataForDay } from "@/lib/timeline";
import { ProtectedRoute } from "../ProtectedRoute";
import { usePreferences } from "../PreferencesProvider";
import { useFavorites } from "../FavoritesProvider";
import { useLanguage } from "../LanguageProvider";
import { DaypartOverview } from "./components/DaypartOverview";
import { ForecastHeader } from "./components/ForecastHeader";
import { SpotSearchBar } from "./components/SpotSearchBar";
import { SlotCards } from "./components/SlotCards";
import { ScoreExplainer } from "./components/ScoreExplainer";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { SpotBrowser } from "./components/SpotBrowser";
import { type DayPart, type ForecastSlot } from "./mockData";
import { useLiveForecast } from "./useLiveForecast";
import {
  buildQualityOptions,
  buildSlotKey,
  getUiScoreClass,
  getWindRelativeToCoast,
} from "./scoringHelpers";

export default function ForecastPage() {
  const { preferences: prefs, isUsingDefaults } = usePreferences();
  const { addRecent } = useFavorites();
  const { t } = useLanguage();
  const dayKey = "today";
  const dayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(new Date()),
    []
  );

  const { spots, source, fetchedAt } = useLiveForecast(dayKey);

  const qualityOptions = useMemo(() => buildQualityOptions(prefs), [prefs]);

  const qualityForSlot = useCallback(
    (slotContext: SlotContext): SlotQuality => getSlotQualityScore(slotContext, qualityOptions),
    [qualityOptions]
  );

  const spotRankings = useMemo(
    () =>
      buildMultiSpotOverview(dayKey, spots, {
        getSlotsForSpot: (spot) => spot.slots,
        getSpotDayScore: (spot, key, slots) =>
          getSpotDayScore(spot, key, slots as SlotContext[], {
            passesHardConditionFilters: (slotContext) => Boolean(slotContext.minSurfable),
            getScore: qualityForSlot,
            buildSlotKey,
            getSpotKey: (inputSpot) => inputSpot.id,
          }),
        topLimit: spots.length,
      }),
    [dayKey, spots, qualityForSlot]
  );

  const defaultSpotId = spotRankings[0]?.spotId ?? spots[0]?.id ?? "";

  const [activeSpotId, setActiveSpotIdRaw] = useState(defaultSpotId);

  const handleSpotChange = useCallback(
    (spotId: string) => {
      setActiveSpotIdRaw(spotId);
      addRecent(spotId);
    },
    [addRecent]
  );

  const resolvedSpotId = useMemo(
    () => (spots.some((spot) => spot.id === activeSpotId) ? activeSpotId : defaultSpotId),
    [spots, activeSpotId, defaultSpotId]
  );

  const activeSpot = spots.find((spot) => spot.id === resolvedSpotId) ?? spots[0];

  const scoreBySpotId = useMemo(
    () =>
      spotRankings.reduce<Record<string, number>>((accumulator, item) => {
        accumulator[item.spotId] = item.score;
        return accumulator;
      }, {}),
    [spotRankings]
  );

  const timelineRows = useMemo(
    () =>
      buildTimelineDataForDay<ForecastSlot, SlotQuality>(activeSpot.id, dayKey, activeSpot.slots, {
        passesHardConditionFilters: (slotContext) => Boolean(slotContext.minSurfable),
        getScore: qualityForSlot,
        buildSlotKey,
        formatTime: (slotContext) => slotContext.timeLabel,
      }),
    [activeSpot, dayKey, qualityForSlot]
  );

  const slotCards = useMemo(
    () =>
      timelineRows.map((row) => {
        const slot = activeSpot.slots.find((item) => item.id === row.slotKey);

        return {
          id: row.slotKey ?? `${activeSpot.id}-${row.slotOffset}`,
          label: slot?.label ?? "Slot",
          timeLabel: row.time,
          score: row.score,
          scoreClass: getUiScoreClass(row.score),
          condition: row.dayPart ?? "daypart",
          reasons: row.quality.reasons.slice(0, 2),
        };
      }),
    [timelineRows, activeSpot]
  );

  const heatmapRows = useMemo(
    () =>
      buildDaypartHeatmapData(dayKey, [activeSpot], {
        getSpotId: (spot) => spot.id,
        getSpotName: (spot) => spot.name,
        getSlotsForSpot: (spot) => spot.slots,
        getQualityNoFilters: (slotContext) => ({ score: qualityForSlot(slotContext).score }),
        buildSlotKey,
        dayPartOrder: ["morning", "afternoon", "evening"],
      }),
    [dayKey, activeSpot, qualityForSlot]
  );

  const overviewData = useMemo(() => {
    const daypartOrder: DayPart[] = ["morning", "afternoon", "evening"];
    return daypartOrder.map((part) => {
      const cell = heatmapRows[0]?.scoresByDayPart[part] ?? null;
      const relatedSlot = activeSpot.slots.find((slot) => slot.id === cell?.slotKey);
      const score = cell?.score ?? null;

      return {
        key: part,
        label: part,
        timeLabel: relatedSlot?.timeLabel ?? "--",
        score,
        scoreClass: score !== null ? getUiScoreClass(score) : "low",
      };
    });
  }, [heatmapRows, activeSpot]);

  /* -- Explainer data for active spot -- */
  const explainerData = useMemo(() => {
    const ranking = spotRankings.find((r) => r.spotId === activeSpot.id);
    const bestSlot = ranking?.bestSlotKey
      ? activeSpot.slots.find((s) => s.id === ranking.bestSlotKey)
      : activeSpot.slots[0];
    const merged = bestSlot?.mergedSpot as Record<string, unknown> | undefined;
    const coastDeg = merged?.coastOrientationDeg as number | undefined;
    const windDeg = merged?.windDirectionDeg as number | undefined;
    const windLabel =
      coastDeg != null && windDeg != null
        ? getWindRelativeToCoast(coastDeg, windDeg)
        : undefined;

    return {
      score: ranking?.score ?? 0,
      scoreClass: getUiScoreClass(ranking?.score ?? 0),
      reasons: ranking?.reasons ?? [],
      waveHeight: merged?.golfHoogteMeter as number | undefined,
      wavePeriod: merged?.golfPeriodeSeconden as number | undefined,
      windDirection: windLabel,
    };
  }, [spotRankings, activeSpot]);

  return (
    <ProtectedRoute>
      <section className="stack-lg">
        <DataSourceBadge source={source} fetchedAt={fetchedAt} />

        {isUsingDefaults && (
          <div className="defaults-banner">
            <span>{"\ud83e\udded"}</span>
            <p>
              {t("forecast.defaultsBanner")}{" "}
              <a href="/profile">{t("forecast.editProfile")}</a>
            </p>
          </div>
        )}

        <SpotSearchBar
          activeSpotId={activeSpot.id}
          scoreBySpotId={scoreBySpotId}
          onSelect={handleSpotChange}
        />

        <SpotBrowser
          activeSpotId={activeSpot.id}
          scoreBySpotId={scoreBySpotId}
          onSelect={handleSpotChange}
        />

        <ForecastHeader
          title={t("forecast.title")}
          dayLabel={dayLabel}
          activeSpot={activeSpot.name}
          skillLevel={prefs.skillLevel}
          preferredRange={`${prefs.preferredMinHeight}m \u2013 ${prefs.preferredMaxHeight}m`}
          cleanPreference={prefs.likesClean ? t("forecast.prefersClean") : t("forecast.mixedOk")}
        />

        <ScoreExplainer
          spotName={activeSpot.name}
          score={explainerData.score}
          scoreClass={explainerData.scoreClass}
          reasons={explainerData.reasons}
          waveHeight={explainerData.waveHeight}
          wavePeriod={explainerData.wavePeriod}
          windDirection={explainerData.windDirection}
        />

        <SlotCards slots={slotCards} />

        <DaypartOverview items={overviewData} />
      </section>
    </ProtectedRoute>
  );
}
