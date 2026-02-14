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
import { DaypartOverview } from "./components/DaypartOverview";
import { ForecastHeader } from "./components/ForecastHeader";
import { SpotSelector } from "./components/SpotSelector";
import { SlotCards } from "./components/SlotCards";
import { createMockSpots, type DayPart, type ForecastSlot } from "./mockData";
import {
  buildQualityOptions,
  buildSlotKey,
  getUiScoreClass,
} from "./scoringHelpers";

export default function ForecastPage() {
  const { preferences: prefs, isUsingDefaults } = usePreferences();
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

  const spots = useMemo(() => createMockSpots(dayKey), [dayKey]);

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

  const [activeSpotId, setActiveSpotId] = useState(defaultSpotId);

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

  const overviewData = useMemo(
    () => {
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
    },
    [heatmapRows, activeSpot]
  );

  return (
    <ProtectedRoute>
      <section className="stack-lg">
        {isUsingDefaults && (
          <div className="defaults-banner">
            <span>🧭</span>
            <p>
              You&apos;re using default preferences.{" "}
              <a href="/profile">Edit&nbsp;profile</a> to get more accurate guidance.
            </p>
          </div>
        )}

        <SpotSelector
          spots={spots.map((spot) => ({ id: spot.id, name: spot.name }))}
          activeSpotId={activeSpot.id}
          scoreBySpotId={scoreBySpotId}
          onChange={setActiveSpotId}
        />

        <ForecastHeader
          title="Today’s forecast"
          dayLabel={dayLabel}
          activeSpot={activeSpot.name}
          skillLevel={prefs.skillLevel}
          preferredRange={`${prefs.preferredMinHeight}m – ${prefs.preferredMaxHeight}m`}
          cleanPreference={prefs.likesClean ? "Prefers clean" : "Mixed ok"}
        />

        <SlotCards slots={slotCards} />

        <DaypartOverview items={overviewData} />
      </section>
    </ProtectedRoute>
  );
}
