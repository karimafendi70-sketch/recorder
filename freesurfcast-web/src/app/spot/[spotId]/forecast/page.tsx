"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getSlotQualityScore,
  type SlotContext,
  type SlotQuality,
} from "@/lib/scores";
import { usePreferences } from "@/app/PreferencesProvider";
import { useLanguage } from "@/app/LanguageProvider";
import { useLiveForecast } from "@/app/forecast/useLiveForecast";
import { buildQualityOptions } from "@/app/forecast/scoringHelpers";
import { buildSurfWindows } from "@/lib/forecast/surfWindows";
import {
  buildDaySummaries,
  getBestWindowForDay,
} from "@/lib/forecast/dayWindows";
import { DayBar } from "./DayBar";
import { DayDetailPanel } from "./DayDetailPanel";
import { DataSourceBadge } from "@/app/forecast/components/DataSourceBadge";
import { SurfWindowsPanel } from "@/app/forecast/components/SurfWindowsPanel";
import styles from "../../spot.module.css";

export default function SpotForecastPage() {
  const params = useParams<{ spotId: string }>();
  const spotId = params.spotId;

  const { preferences: prefs } = usePreferences();
  const { t, lang } = useLanguage();

  const { spots, status, isLive, fetchedAt, errorMessage } = useLiveForecast("today");

  const qualityOptions = useMemo(() => buildQualityOptions(prefs), [prefs]);
  const qualityForSlot = useCallback(
    (slot: SlotContext): SlotQuality => getSlotQualityScore(slot, qualityOptions),
    [qualityOptions],
  );

  // Find this spot's data
  const activeSpot = useMemo(
    () => spots.find((s) => s.id === spotId) ?? spots[0],
    [spots, spotId],
  );

  // Build 16-day summaries
  const daySummaries = useMemo(
    () =>
      buildDaySummaries(
        activeSpot.slots,
        qualityForSlot,
        lang,
        t("forecast.days.today"),
        t("forecast.days.tomorrow"),
      ),
    [activeSpot.slots, qualityForSlot, lang, t],
  );

  // Selected day state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const activeDateKey = selectedDay && daySummaries.some((d) => d.dateKey === selectedDay)
    ? selectedDay
    : daySummaries[0]?.dateKey ?? "";

  // Day slots
  const daySlots = useMemo(
    () => activeSpot.slots.filter((s) => s.dayKey === activeDateKey),
    [activeSpot.slots, activeDateKey],
  );

  // Surf windows (full 16 days)
  const surfWindows = useMemo(
    () => buildSurfWindows(activeSpot.slots, activeSpot.id, qualityForSlot),
    [activeSpot, qualityForSlot],
  );

  // Best window for selected day
  const dayBest = useMemo(
    () => getBestWindowForDay(surfWindows, activeSpot.slots, activeDateKey),
    [surfWindows, activeSpot.slots, activeDateKey],
  );

  // Day-level avg score
  const dayAvgScore = useMemo(() => {
    const ds = daySummaries.find((d) => d.dateKey === activeDateKey);
    return ds?.avgScore ?? 0;
  }, [daySummaries, activeDateKey]);

  // Day labels
  const dayLabel = useMemo(() => {
    const ds = daySummaries.find((d) => d.dateKey === activeDateKey);
    return ds?.label ?? activeDateKey;
  }, [daySummaries, activeDateKey]);

  const fullDate = useMemo(() => {
    const d = new Date(activeDateKey + "T12:00:00");
    return d.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" });
  }, [activeDateKey, lang]);

  return (
    <>
      <DataSourceBadge status={status} isLive={isLive} fetchedAt={fetchedAt} />

      {status === "error" && errorMessage && (
        <div className="fallback-banner">
          <span>⚠️</span>
          <p>{t("forecast.fallbackBanner")}</p>
        </div>
      )}

      {/* ── 16-day DayBar ── */}
      <DayBar
        days={daySummaries}
        activeDateKey={activeDateKey}
        onSelect={setSelectedDay}
      />

      {/* ── Day detail ── */}
      <DayDetailPanel
        dateKey={activeDateKey}
        dayLabel={dayLabel}
        fullDate={fullDate}
        daySlots={daySlots}
        bestWindow={dayBest}
        avgScore={dayAvgScore}
        scoreFn={qualityForSlot}
      />

      {/* ── All surf windows (full 16-day overview) ── */}
      <SurfWindowsPanel windows={surfWindows} />
    </>
  );
}
