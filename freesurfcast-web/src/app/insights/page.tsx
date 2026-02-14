"use client";

import { useMemo } from "react";
import { buildDaypartHeatmapData } from "@/lib/heatmap";
import { buildMultiSpotOverview } from "@/lib/spots";
import {
  getSpotDayScore,
  type SlotContext,
  type SlotQuality,
} from "@/lib/scores";
import { buildTimelineDataForDay } from "@/lib/timeline";
import { ProtectedRoute } from "../ProtectedRoute";
import { usePreferences } from "../PreferencesProvider";
import { createMockSpots, type ForecastSlot } from "../forecast/mockData";
import {
  buildSlotKey,
  getUiScoreClass,
  makeQualityForSlot,
} from "../forecast/scoringHelpers";
import { MultiSpotRanking } from "./components/MultiSpotRanking";
import { DaypartHeatmap } from "./components/DaypartHeatmap";
import { TimelinePreview } from "./components/TimelinePreview";
import styles from "./insights.module.css";

const DAY_PARTS = ["morning", "afternoon", "evening"] as const;

export default function InsightsPage() {
  const { preferences: prefs } = usePreferences();
  const dayKey = "today";
  const spots = useMemo(() => createMockSpots(dayKey), [dayKey]);

  const qualityForSlot = useMemo(() => makeQualityForSlot(prefs), [prefs]);

  /* ── 1) Multi-spot ranking ───────────────────── */
  const rankings = useMemo(
    () =>
      buildMultiSpotOverview(dayKey, spots, {
        getSlotsForSpot: (spot) => spot.slots,
        getSpotDayScore: (spot, key, slots) =>
          getSpotDayScore(spot, key, slots as SlotContext[], {
            passesHardConditionFilters: (ctx) => Boolean(ctx.minSurfable),
            getScore: qualityForSlot,
            buildSlotKey,
            getSpotKey: (s) => s.id,
          }),
        topLimit: spots.length,
      }),
    [dayKey, spots, qualityForSlot]
  );

  const rankedSpots = useMemo(
    () =>
      rankings.map((entry, index) => {
        const spot = spots.find((s) => s.id === entry.spotId);
        const bestSlot = spot?.slots.find((s) => s.id === entry.bestSlotKey);

        return {
          rank: index + 1,
          spotId: entry.spotId,
          spotName: spot?.name ?? entry.spotId,
          score: entry.score,
          scoreClass: getUiScoreClass(entry.score),
          bestSlotLabel: bestSlot ? `${bestSlot.label} (${bestSlot.timeLabel})` : "–",
          reasons: (entry.reasons ?? []).slice(0, 2),
        };
      }),
    [rankings, spots]
  );

  /* ── 2) Daypart heatmap ──────────────────────── */
  const heatmapRows = useMemo(
    () =>
      buildDaypartHeatmapData(dayKey, spots, {
        getSpotId: (spot) => spot.id,
        getSpotName: (spot) => spot.name,
        getSlotsForSpot: (spot) => spot.slots,
        getQualityNoFilters: (slotCtx) => ({ score: qualityForSlot(slotCtx).score }),
        buildSlotKey,
        dayPartOrder: [...DAY_PARTS],
      }),
    [dayKey, spots, qualityForSlot]
  );

  const heatmapItems = useMemo(
    () =>
      heatmapRows.map((row) => ({
        spotId: row.spotId,
        spotName: row.spotName,
        cells: Object.fromEntries(
          DAY_PARTS.map((part) => {
            const cell = row.scoresByDayPart[part];
            const score = cell?.score ?? null;
            return [
              part,
              { score, scoreClass: score !== null ? getUiScoreClass(score) : ("low" as const) },
            ];
          })
        ),
      })),
    [heatmapRows]
  );

  /* ── 3) Timeline (best spot) ─────────────────── */
  const bestSpot = useMemo(
    () => spots.find((s) => s.id === rankings[0]?.spotId) ?? spots[0],
    [spots, rankings]
  );

  const timelineRows = useMemo(
    () =>
      buildTimelineDataForDay<ForecastSlot, SlotQuality>(
        bestSpot.id,
        dayKey,
        bestSpot.slots,
        {
          passesHardConditionFilters: (ctx) => Boolean(ctx.minSurfable),
          getScore: qualityForSlot,
          buildSlotKey,
          formatTime: (ctx) => ctx.timeLabel,
        }
      ),
    [bestSpot, dayKey, qualityForSlot]
  );

  const timelineEntries = useMemo(
    () =>
      timelineRows.map((row) => ({
        time: row.time,
        dayPart: row.dayPart ?? "–",
        score: row.score,
        scoreClass: getUiScoreClass(row.score),
      })),
    [timelineRows]
  );

  return (
    <ProtectedRoute>
      <section className="stack-lg">
        <header className={styles.heroCard}>
          <p className={styles.heroEyebrow}>Insights</p>
          <h1 className={styles.heroTitle}>Multi-spot overview</h1>
          <p className={styles.heroSubtitle}>
            Rankings, daypart heatmap and timeline — powered by your profile preferences.
          </p>
        </header>

        <MultiSpotRanking spots={rankedSpots} />

        <DaypartHeatmap rows={heatmapItems} dayParts={[...DAY_PARTS]} />

        <TimelinePreview spotName={bestSpot.name} entries={timelineEntries} />
      </section>
    </ProtectedRoute>
  );
}
