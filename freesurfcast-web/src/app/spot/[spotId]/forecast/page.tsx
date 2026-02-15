"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getSlotQualityScore,
  type SlotContext,
  type SlotQuality,
} from "@/lib/scores";
import { usePreferences } from "@/app/PreferencesProvider";
import { useLanguage } from "@/app/LanguageProvider";
import { SPOT_CATALOG } from "@/lib/spots/catalog";
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
import { buildForecastShareText, buildForecastShareUrl } from "@/lib/share/forecastShare";
import { SharePanel } from "@/app/share/SharePanel";
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

  // Ref for smooth scroll on mobile
  const detailRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Today key for back-to-today
  const todayKey = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isToday = activeDateKey === todayKey;
  const hasTodayInRange = daySummaries.some((d) => d.dateKey === todayKey);

  // Day select handler with smooth scroll on mobile
  const handleSelectDay = useCallback((dayKey: string) => {
    setSelectedDay(dayKey);
    if (window.innerWidth < 768 && detailRef.current) {
      const top = detailRef.current.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Keyboard shortcuts
  const selectPreviousDay = useCallback(() => {
    const idx = daySummaries.findIndex((d) => d.dateKey === activeDateKey);
    if (idx > 0) handleSelectDay(daySummaries[idx - 1].dateKey);
  }, [daySummaries, activeDateKey, handleSelectDay]);

  const selectNextDay = useCallback(() => {
    const idx = daySummaries.findIndex((d) => d.dateKey === activeDateKey);
    if (idx >= 0 && idx < daySummaries.length - 1) handleSelectDay(daySummaries[idx + 1].dateKey);
  }, [daySummaries, activeDateKey, handleSelectDay]);

  const selectToday = useCallback(() => {
    if (hasTodayInRange) handleSelectDay(todayKey);
  }, [hasTodayInRange, todayKey, handleSelectDay]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag && ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      if (e.key === "ArrowLeft") { e.preventDefault(); selectPreviousDay(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); selectNextDay(); }
      else if (e.key.toLowerCase() === "t") { e.preventDefault(); selectToday(); }
      else if (e.key.toLowerCase() === "s") { e.preventDefault(); router.push(`/spot/${spotId}/sessions`); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectPreviousDay, selectNextDay, selectToday, router, spotId]);

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

  // Share state
  const [showShare, setShowShare] = useState(false);

  const shareUrl = useMemo(
    () => buildForecastShareUrl(spotId, activeDateKey),
    [spotId, activeDateKey],
  );

  const shareText = useMemo(() => {
    const ratingKey = `rating.${
      dayAvgScore >= 8.5 ? "epic"
        : dayAvgScore >= 7 ? "goodToEpic"
        : dayAvgScore >= 5.5 ? "good"
        : dayAvgScore >= 4.5 ? "fairToGood"
        : dayAvgScore >= 3 ? "fair"
        : dayAvgScore >= 1.5 ? "poorToFair"
        : "poor"
    }` as TranslationKey;
    const bestLabel = dayBest?.window
      ? `${dayBest.window.startLabel}–${dayBest.window.endLabel}`
      : undefined;
    const cond = explainerData;
    return buildForecastShareText({
      spotName: activeSpot.name,
      country: (SPOT_CATALOG.find((s) => s.id === spotId))?.country,
      dayLabel,
      dateISO: activeDateKey,
      avgScore: dayAvgScore,
      ratingLabel: t(ratingKey),
      sizeBand: cond?.sizeKey ? t(cond.sizeKey) : undefined,
      bestWindowLabel: bestLabel,
      windSummary: cond?.windKey ? t(cond.windKey) : undefined,
      surfaceSummary: cond?.surfaceKey ? t(cond.surfaceKey) : undefined,
      swellSummary:
        cond?.waveHeight != null && cond?.wavePeriod != null
          ? `${cond.waveHeight.toFixed(1)}m @ ${cond.wavePeriod.toFixed(0)}s`
          : undefined,
      url: shareUrl,
    });
  }, [activeSpot.name, spotId, dayLabel, activeDateKey, dayAvgScore, dayBest, explainerData, shareUrl, t]);

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
        <>
          <DayBar
            days={daySummaries}
            activeDateKey={activeDateKey}
            onSelect={handleSelectDay}
            alertDays={alertDays}
          />
          <div className={styles.dayBarExtras}>
            {!isToday && hasTodayInRange && (
              <button className={styles.backToTodayBtn} onClick={selectToday}>
                ← {t("forecast.actions.backToToday" as TranslationKey)}
              </button>
            )}
            <button
              className={styles.shareToggle}
              onClick={() => setShowShare((v) => !v)}
            >
              📤 {t("share.button" as TranslationKey)}
            </button>
            {showShare && (
              <SharePanel
                link={shareUrl}
                text={shareText}
                className={styles.sharePanel}
              />
            )}
            <span className={styles.shortcutHint}>
              {t("forecast.shortcuts.hint" as TranslationKey)}
            </span>
          </div>
        </>
      )}

      {/* ── Day detail ── */}
      {isLoading ? (
        <DayDetailSkeleton />
      ) : (
        <>
          <div ref={detailRef}>
            <DayDetailPanel
              dateKey={activeDateKey}
              dayLabel={dayLabel}
              fullDate={fullDate}
              daySlots={daySlots}
              bestWindow={dayBest}
              avgScore={dayAvgScore}
              scoreFn={qualityForSlot}
            />
          </div>

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
