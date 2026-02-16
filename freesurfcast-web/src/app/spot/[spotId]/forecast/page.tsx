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
import { SurfWindowsPanel } from "@/app/forecast/components/SurfWindowsPanel";
import { ScoreExplainer } from "@/app/forecast/components/ScoreExplainer";
import { ProGraphsSection } from "./ProGraphsSection";
import { AlertConfigPanel } from "./AlertConfigPanel";
import { ForecastTldrCard } from "./ForecastTldrCard";
import { ForecastConditionCard } from "./ForecastConditionCard";
import { ForecastSurfHeightCard } from "./ForecastSurfHeightCard";
import { ForecastWindCard } from "./ForecastWindCard";
import { ForecastSwellCard } from "./ForecastSwellCard";
import { ForecastTideCard } from "./ForecastTideCard";
import { ForecastTemperatureCard } from "./ForecastTemperatureCard";
import { ForecastDetailsSection } from "./ForecastDetailsSection";
import { ForecastActionsRow } from "./ForecastActionsRow";
import { ForecastFilterStatusBar } from "./ForecastFilterStatusBar";
import { DayStrip24h } from "./DayStrip24h";
import { TrendBadges } from "./TrendBadges";
import { DaySummaryLine } from "./DaySummaryLine";
import { getSlotsForDay } from "@/lib/forecast/daySlots";
import { analyseDayTrends, buildStripBlocks, pickDaySummaryKey } from "@/lib/forecast/dayTrends";
import { summarizeConditions } from "@/lib/forecast/conditions";
import { useAlertProfile } from "@/lib/alerts/useAlertProfile";
import { buildAlertMap } from "@/lib/alerts/matchDayAlert";
import { buildForecastShareText, buildForecastShareUrl } from "@/lib/share/forecastShare";
import { useUiPreferences } from "@/app/UiPreferencesProvider";
import type { TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

export default function SpotForecastPage() {
  const params = useParams<{ spotId: string }>();
  const spotId = params.spotId;

  const { preferences: prefs, isUsingDefaults: prefsDefaults } = usePreferences();
  const { t, lang } = useLanguage();
  const { uiPrefs } = useUiPreferences();

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

  // Day slots — canonical sorted subset via helper
  const daySlots = useMemo(
    () => getSlotsForDay(activeSpot.slots, activeDateKey),
    [activeSpot.slots, activeDateKey],
  );

  // Day-level trend analysis
  const dayTrends = useMemo(
    () => analyseDayTrends(daySlots),
    [daySlots],
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

  // ── Rating bucket + card data ──
  const ratingBucket = useMemo(() => {
    if (dayAvgScore >= 8.5) return "epic";
    if (dayAvgScore >= 7)   return "goodToEpic";
    if (dayAvgScore >= 5.5) return "good";
    if (dayAvgScore >= 4.5) return "fairToGood";
    if (dayAvgScore >= 3)   return "fair";
    if (dayAvgScore >= 1.5) return "poorToFair";
    return "poor";
  }, [dayAvgScore]);

  const ratingLabel = useMemo(
    () => t(`rating.${ratingBucket}` as TranslationKey),
    [ratingBucket, t],
  );

  // Summary text for condition card (reuses DaySummaryLine logic)
  const summaryText = useMemo(() => {
    if (daySlots.length === 0) return "";
    const blocks = buildStripBlocks(daySlots, qualityForSlot);
    const trends = analyseDayTrends(daySlots);
    const key = pickDaySummaryKey(blocks, dayAvgScore, trends);
    return t(key as TranslationKey);
  }, [daySlots, dayAvgScore, qualityForSlot, t]);

  // ── TL;DR card data ──
  const tldrData = useMemo(() => {
    const RATING_COLORS: Record<string, string> = {
      epic: "#00acc1", goodToEpic: "#26a69a", good: "#43a047",
      fairToGood: "#c0ca33", fair: "#fdd835", poorToFair: "#fb8c00", poor: "#e53935",
    };

    const heights = daySlots
      .map((s) => (s.mergedSpot as Record<string, unknown> | undefined)?.golfHoogteMeter as number | undefined)
      .filter((h): h is number => h != null);
    const minH = heights.length > 0 ? Math.min(...heights) : 0;
    const maxH = heights.length > 0 ? Math.max(...heights) : 0;

    const bestLabel = dayBest?.window
      ? `${dayBest.window.startLabel} – ${dayBest.window.endLabel}`
      : undefined;

    return {
      ratingLabel,
      ratingColor: RATING_COLORS[ratingBucket] ?? "#e53935",
      minHeight: minH,
      maxHeight: maxH,
      sizeBandLabel: explainerData?.sizeKey ? t(explainerData.sizeKey) : undefined,
      bestWindowLabel: bestLabel,
      windLabel: explainerData?.windKey ? t(explainerData.windKey) : undefined,
      surfaceLabel: explainerData?.surfaceKey ? t(explainerData.surfaceKey) : undefined,
    };
  }, [ratingBucket, ratingLabel, daySlots, dayBest, explainerData, t]);

  // Share state
  const [showShare, setShowShare] = useState(false);

  const shareUrl = useMemo(
    () => buildForecastShareUrl(spotId, activeDateKey),
    [spotId, activeDateKey],
  );

  const shareText = useMemo(() => {
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
      ratingLabel,
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
  }, [activeSpot.name, spotId, dayLabel, activeDateKey, dayAvgScore, ratingLabel, dayBest, explainerData, shareUrl, t]);

  // Determine if user has active filters / alerts
  const hasActiveFilters = !prefsDefaults;
  const hasAlerts = alertProfile != null;

  return (
    <>
      {/* ── Filter status bar ── */}
      {!isLoading && (
        <ForecastFilterStatusBar
          hasActiveFilters={hasActiveFilters}
          hasAlerts={hasAlerts}
          onToggleFilters={() => {
            // Placeholder — could reset prefs or toggle
          }}
          onOpenSettings={() => router.push("/settings")}
        />
      )}

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

      {/* ── 16-day DayBar ── */}
      {isLoading ? (
        <DayBarSkeleton />
      ) : (
        <DayBar
          days={daySummaries}
          activeDateKey={activeDateKey}
          onSelect={handleSelectDay}
          alertDays={alertDays}
        />
      )}

      {/* ── Condition + data cards ── */}
      {!isLoading && (
        <div className={styles.fcCardGrid}>
          <ForecastConditionCard
            ratingBucket={ratingBucket}
            ratingLabel={ratingLabel}
            avgScore={dayAvgScore}
            summaryText={summaryText}
          />
          <ForecastSurfHeightCard
            daySlots={daySlots}
            sizeBandLabel={tldrData.sizeBandLabel}
          />
          <ForecastWindCard
            daySlots={daySlots}
            windLabel={tldrData.windLabel}
            surfaceLabel={tldrData.surfaceLabel}
          />
          <ForecastSwellCard daySlots={daySlots} />
          <ForecastTideCard daySlots={daySlots} />
          <ForecastTemperatureCard daySlots={daySlots} />
        </div>
      )}

      {/* ── 24h strip + trends ── */}
      {!isLoading && daySlots.length > 0 && uiPrefs.dayStripEnabled && (
        <>
          <DayStrip24h
            dateKey={activeDateKey}
            daySlots={daySlots}
            scoreFn={qualityForSlot}
          />
          <TrendBadges trends={dayTrends} />
        </>
      )}

      {/* ── Day detail — timeline & conditions ── */}
      {isLoading ? (
        <DayDetailSkeleton />
      ) : (
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
      )}

      {/* ── Collapsible pro details ── */}
      {!isLoading && !uiPrefs.simpleMode && (
        <ForecastDetailsSection defaultOpen={uiPrefs.proDetailsDefaultOpen}>
          <ProGraphsSection daySlots={daySlots} locale={lang} />
          <SurfWindowsPanel windows={surfWindows} />
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
        </ForecastDetailsSection>
      )}

      {/* ── Compact action row ── */}
      {!isLoading && (
        <ForecastActionsRow
          showBackToToday={!isToday && hasTodayInRange}
          onBackToToday={selectToday}
          showShare
          onToggleShare={() => setShowShare((v) => !v)}
          shareOpen={showShare}
          shareUrl={shareUrl}
          shareText={shareText}
          spotId={spotId}
          shortcutHint={t("forecast.shortcuts.hint" as TranslationKey)}
        />
      )}

      {/* ── Alert config (end of page) ── */}
      {!isLoading && <AlertConfigPanel spotId={spotId} />}
    </>
  );
}
