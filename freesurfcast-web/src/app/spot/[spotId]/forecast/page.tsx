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
import { DayBarSkeleton } from "./DayBarSkeleton";
import { DayDetailPanel } from "./DayDetailPanel";
import { DayDetailSkeleton } from "./DayDetailSkeleton";
import { DataSourceBadge } from "@/app/forecast/components/DataSourceBadge";
import { SurfWindowsPanel } from "@/app/forecast/components/SurfWindowsPanel";
import { ScoreExplainer } from "@/app/forecast/components/ScoreExplainer";
import { ProGraphsSection } from "./ProGraphsSection";
import { AlertConfigPanel } from "./AlertConfigPanel";
import { summarizeConditions } from "@/lib/forecast/conditions";
import { useAlertProfile } from "@/lib/alerts/useAlertProfile";
import { buildAlertMap } from "@/lib/alerts/matchDayAlert";
import type { TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

export default function SpotForecastPage() {
  const params = useParams<{ spotId: string }>();
  const spotId = params.spotId;

  const { preferences: prefs } = usePreferences();
  const { t, lang } = useLanguage();

  const { spots, status, isLive, fetchedAt, errorMessage } = useLiveForecast("today");
  const isLoading = status === "idle" || status === "loading";

  // Alert profile for this spot
  const { profile: alertProfile } = useAlertProfile(spotId);

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

  // Slots grouped by day (used by alerts + day detail)
  const slotsByDay = useMemo(() => {
    const map = new Map<string, SlotContext[]>();
    for (const s of activeSpot.slots) {
      const key = s.dayKey ?? "unknown";
      let arr = map.get(key);
      if (!arr) { arr = []; map.set(key, arr); }
      arr.push(s);
    }
    return map;
  }, [activeSpot.slots]);

  // Alert matching
  const alertDays = useMemo(
    () => buildAlertMap(alertProfile, daySummaries, slotsByDay),
    [alertProfile, daySummaries, slotsByDay],
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

  // ScoreExplainer data — from best slot of active day
  const explainerData = useMemo(() => {
    const scored = daySlots.map((s) => ({ s, q: qualityForSlot(s) }));
    if (scored.length === 0) return null;
    const best = scored.reduce((a, b) => (b.q.score > a.q.score ? b : a));
    const slot = best.s;
    const quality = best.q;
    const merged = (slot.mergedSpot ?? {}) as Record<string, unknown>;
    const cond = summarizeConditions(slot);
    return {
      spotName: activeSpot.name,
      score: quality.score,
      scoreClass: (quality.score >= 7 ? "high" : quality.score >= 4.5 ? "medium" : "low") as "high" | "medium" | "low",
      reasons: quality.reasons ?? [],
      waveHeight: merged.golfHoogteMeter as number | undefined,
      wavePeriod: merged.golfPeriodeSeconden as number | undefined,
      windDirection: merged.windDirectionDeg != null ? `${Math.round(merged.windDirectionDeg as number)}°` : undefined,
      windKey: cond.windKey as TranslationKey,
      sizeKey: cond.sizeKey as TranslationKey,
      surfaceKey: cond.surfaceKey as TranslationKey,
    };
  }, [daySlots, qualityForSlot, activeSpot.name]);

  return (
    <>
      <DataSourceBadge status={status} isLive={isLive} fetchedAt={fetchedAt} />

      {/* ── Error banner ── */}
      {status === "error" && (
        <div className={styles.errorBanner}>
          <span className={styles.errorBannerIcon}>⚠️</span>
          <p className={styles.errorBannerText}>
            {t("forecast.error.loadFailed")}
          </p>
          <button
            className={styles.errorBannerRetry}
            onClick={() => window.location.reload()}
          >
            {t("forecast.error.retry")}
          </button>
        </div>
      )}

      {/* ── Alert config toggle ── */}
      {!isLoading && <AlertConfigPanel spotId={spotId} />}

      {/* ── 16-day DayBar ── */}
      {isLoading ? (
        <DayBarSkeleton />
      ) : (
        <DayBar
          days={daySummaries}
          activeDateKey={activeDateKey}
          onSelect={setSelectedDay}
          alertDays={alertDays}
        />
      )}

      {/* ── Day detail ── */}
      {isLoading ? (
        <DayDetailSkeleton />
      ) : (
        <>
          <DayDetailPanel
            dateKey={activeDateKey}
            dayLabel={dayLabel}
            fullDate={fullDate}
            daySlots={daySlots}
            bestWindow={dayBest}
            avgScore={dayAvgScore}
            scoreFn={qualityForSlot}
          />

          {/* ── Extra sections (below day detail) ── */}
          <section className={styles.moreSection}>
            {/* Pro graphs for selected day */}
            <ProGraphsSection daySlots={daySlots} locale={lang} />

            {/* All surf windows (full 16-day overview) */}
            <SurfWindowsPanel windows={surfWindows} />

            {/* Score explainer */}
            {explainerData && (
              <ScoreExplainer
                spotName={explainerData.spotName}
                score={explainerData.score}
                scoreClass={explainerData.scoreClass}
                reasons={explainerData.reasons}
                waveHeight={explainerData.waveHeight}
                wavePeriod={explainerData.wavePeriod}
                windDirection={explainerData.windDirection}
                windKey={explainerData.windKey}
                sizeKey={explainerData.sizeKey}
                surfaceKey={explainerData.surfaceKey}
              />
            )}
          </section>
        </>
      )}
    </>
  );
}
