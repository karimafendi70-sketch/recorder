"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSpotById } from "@/lib/spots/catalog";
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
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { usePageView, trackSpotSelected } from "@/lib/trackClient";
import { buildSurfWindows } from "@/lib/forecast/surfWindows";
import { summarizeConditions } from "@/lib/forecast/conditions";
import { SurfWindowsPanel } from "./components/SurfWindowsPanel";
import styles from "./forecast.module.css";

/* ── Day-tab helpers ─────────────────────────── */

interface DayTab {
  dateKey: string;       // YYYY-MM-DD
  label: string;         // "Today", "Tomorrow", "Wed 19", etc.
  shortLabel: string;    // For narrow screens: "Today", "Tom", "We 19"
}

function buildDayTabs(
  slots: ForecastSlot[],
  todayLabel: string,
  tomorrowLabel: string,
  locale: string,
): DayTab[] {
  // Collect unique dateKeys from slots
  const dateSet = new Set<string>();
  for (const s of slots) {
    if (s.dayKey) dateSet.add(s.dayKey);
  }
  const dates = [...dateSet].sort();
  if (dates.length === 0) return [];

  const today = new Date().toISOString().split("T")[0];
  const tom = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return dates.map((dateKey) => {
    if (dateKey === today) {
      return { dateKey, label: todayLabel, shortLabel: todayLabel };
    }
    if (dateKey === tom) {
      return { dateKey, label: tomorrowLabel, shortLabel: tomorrowLabel.slice(0, 3) };
    }
    const d = new Date(dateKey + "T12:00:00");
    const weekday = d.toLocaleDateString(locale, { weekday: "short" });
    const day = d.getDate();
    return { dateKey, label: `${weekday} ${day}`, shortLabel: `${weekday} ${day}` };
  });
}

export default function ForecastPage() {
  return (
    <Suspense>
      <ForecastContent />
    </Suspense>
  );
}

function ForecastContent() {
  const { preferences: prefs, isUsingDefaults } = usePreferences();
  const { addRecent } = useFavorites();
  const { t, lang } = useLanguage();
  usePageView();

  const { spots, status, isLive, fetchedAt, errorMessage } = useLiveForecast("today");

  const qualityOptions = useMemo(() => buildQualityOptions(prefs), [prefs]);

  const qualityForSlot = useCallback(
    (slotContext: SlotContext): SlotQuality => getSlotQualityScore(slotContext, qualityOptions),
    [qualityOptions]
  );

  /* ── Spot selection ── */
  const searchParams = useSearchParams();
  const urlSpotId = searchParams.get("spotId");
  const validUrlSpot = urlSpotId && getSpotById(urlSpotId) ? urlSpotId : null;

  const defaultSpotId = spots[0]?.id ?? "";

  const [activeSpotId, setActiveSpotIdRaw] = useState(defaultSpotId);

  const handleSpotChange = useCallback(
    (spotId: string) => {
      setActiveSpotIdRaw(spotId);
      addRecent(spotId);
      trackSpotSelected(spotId, "/forecast", lang);
    },
    [addRecent, lang]
  );

  const resolvedSpotId = useMemo(() => {
    if (validUrlSpot) return validUrlSpot;
    return spots.some((spot) => spot.id === activeSpotId) ? activeSpotId : defaultSpotId;
  }, [validUrlSpot, spots, activeSpotId, defaultSpotId]);

  const activeSpot = spots.find((spot) => spot.id === resolvedSpotId) ?? spots[0];

  /* ── Day tabs ── */
  const dayTabs = useMemo(
    () => buildDayTabs(activeSpot.slots, t("forecast.days.today"), t("forecast.days.tomorrow"), lang),
    [activeSpot.slots, t, lang]
  );

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const activeDayKey = selectedDay && dayTabs.some((dt) => dt.dateKey === selectedDay)
    ? selectedDay
    : dayTabs[0]?.dateKey ?? "";

  // Slots filtered to the selected day
  const daySlots = useMemo(
    () => activeSpot.slots.filter((s) => s.dayKey === activeDayKey),
    [activeSpot.slots, activeDayKey]
  );

  const dayLabel = useMemo(() => {
    const tab = dayTabs.find((dt) => dt.dateKey === activeDayKey);
    if (tab) return tab.label;
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long", month: "short", day: "numeric",
    }).format(new Date());
  }, [dayTabs, activeDayKey]);

  /* ── Spot rankings (using today-only slots for ranking) ── */
  const todayKey = dayTabs[0]?.dateKey ?? "";
  const spotRankings = useMemo(
    () => {
      // For rankings, use just first-day slots per spot
      const spotsFirstDay = spots.map((sp) => ({
        ...sp,
        slots: sp.slots.filter((s) => s.dayKey === todayKey),
      }));
      return buildMultiSpotOverview(todayKey, spotsFirstDay, {
        getSlotsForSpot: (spot) => spot.slots,
        getSpotDayScore: (spot, key, slotsArr) =>
          getSpotDayScore(spot, key, slotsArr as SlotContext[], {
            passesHardConditionFilters: (slotContext) => Boolean(slotContext.minSurfable),
            getScore: qualityForSlot,
            buildSlotKey,
            getSpotKey: (inputSpot) => inputSpot.id,
          }),
        topLimit: spots.length,
      });
    },
    [todayKey, spots, qualityForSlot]
  );

  const scoreBySpotId = useMemo(
    () =>
      spotRankings.reduce<Record<string, number>>((accumulator, item) => {
        accumulator[item.spotId] = item.score;
        return accumulator;
      }, {}),
    [spotRankings]
  );

  /* ── Timeline rows for selected day ── */
  const timelineRows = useMemo(
    () =>
      buildTimelineDataForDay<ForecastSlot, SlotQuality>(activeSpot.id, activeDayKey, daySlots, {
        passesHardConditionFilters: (slotContext) => Boolean(slotContext.minSurfable),
        getScore: qualityForSlot,
        buildSlotKey,
        formatTime: (slotContext) => slotContext.timeLabel,
      }),
    [activeSpot, activeDayKey, daySlots, qualityForSlot]
  );

  const slotCards = useMemo(
    () =>
      timelineRows.map((row) => {
        const slot = daySlots.find((item) => item.id === row.slotKey);
        const cond = slot ? summarizeConditions(slot) : undefined;

        return {
          id: row.slotKey ?? `${activeSpot.id}-${row.slotOffset}`,
          label: slot?.label ?? "Slot",
          timeLabel: row.time,
          score: row.score,
          scoreClass: getUiScoreClass(row.score),
          condition: row.dayPart ?? "daypart",
          reasons: row.quality.reasons.slice(0, 2),
          windKey: cond?.windKey,
          sizeKey: cond?.sizeKey,
          surfaceKey: cond?.surfaceKey,
        };
      }),
    [timelineRows, activeSpot, daySlots]
  );

  /* ── Surf Windows (all 16 days, premium only) ── */
  const surfWindows = useMemo(
    () =>
      buildSurfWindows(
        activeSpot.slots,
        activeSpot.id,
        qualityForSlot,
      ),
    [activeSpot, qualityForSlot]
  );

  /* ── Heatmap / daypart overview (selected day) ── */
  const daySpot = useMemo(
    () => ({ ...activeSpot, slots: daySlots }),
    [activeSpot, daySlots]
  );

  const heatmapRows = useMemo(
    () =>
      buildDaypartHeatmapData(activeDayKey, [daySpot], {
        getSpotId: (spot) => spot.id,
        getSpotName: (spot) => spot.name,
        getSlotsForSpot: (spot) => spot.slots,
        getQualityNoFilters: (slotContext) => ({ score: qualityForSlot(slotContext).score }),
        buildSlotKey,
        dayPartOrder: ["morning", "afternoon", "evening"],
      }),
    [activeDayKey, daySpot, qualityForSlot]
  );

  const overviewData = useMemo(() => {
    const daypartOrder: DayPart[] = ["morning", "afternoon", "evening"];
    return daypartOrder.map((part) => {
      const cell = heatmapRows[0]?.scoresByDayPart[part] ?? null;
      const relatedSlot = daySlots.find((slot) => slot.id === cell?.slotKey);
      const score = cell?.score ?? null;

      return {
        key: part,
        label: part,
        timeLabel: relatedSlot?.timeLabel ?? "--",
        score,
        scoreClass: score !== null ? getUiScoreClass(score) : "low",
      };
    });
  }, [heatmapRows, daySlots]);

  /* -- Explainer data for active spot -- */
  const explainerData = useMemo(() => {
    const ranking = spotRankings.find((r) => r.spotId === activeSpot.id);
    const bestSlot = ranking?.bestSlotKey
      ? daySlots.find((s) => s.id === ranking.bestSlotKey)
      : daySlots[0];
    const merged = bestSlot?.mergedSpot as Record<string, unknown> | undefined;
    const coastDeg = merged?.coastOrientationDeg as number | undefined;
    const windDeg = merged?.windDirectionDeg as number | undefined;
    const windLabel =
      coastDeg != null && windDeg != null
        ? getWindRelativeToCoast(coastDeg, windDeg)
        : undefined;

    const cond = bestSlot ? summarizeConditions(bestSlot) : undefined;

    return {
      score: ranking?.score ?? 0,
      scoreClass: getUiScoreClass(ranking?.score ?? 0),
      reasons: ranking?.reasons ?? [],
      waveHeight: merged?.golfHoogteMeter as number | undefined,
      wavePeriod: merged?.golfPeriodeSeconden as number | undefined,
      windDirection: windLabel,
      windKey: cond?.windKey,
      sizeKey: cond?.sizeKey,
      surfaceKey: cond?.surfaceKey,
    };
  }, [spotRankings, activeSpot, daySlots]);

  return (
    <ProtectedRoute>
      <section className="stack-lg">
        <DataSourceBadge status={status} isLive={isLive} fetchedAt={fetchedAt} />

        {status === "error" && errorMessage && (
          <div className="fallback-banner">
            <span>⚠️</span>
            <p>{t("forecast.fallbackBanner")}</p>
          </div>
        )}

        {status === "loading" && (
          <p className="page-lead loading-pulse">{t("forecast.loadingLive")}</p>
        )}

        {status !== "loading" && <p className="page-lead">{t("forecast.lead")}</p>}

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

        {/* ── Day tabs (up to 16 days) ── */}
        {dayTabs.length > 1 && (
          <div className={styles.forecastDayTabs} role="tablist" aria-label={t("forecast.days.horizon")}>
            {dayTabs.map((tab) => (
              <button
                key={tab.dateKey}
                type="button"
                role="tab"
                aria-selected={tab.dateKey === activeDayKey}
                className={`${styles.forecastDayTab} ${tab.dateKey === activeDayKey ? styles.forecastDayTabActive : ""}`}
                onClick={() => setSelectedDay(tab.dateKey)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <ScoreExplainer
          spotName={activeSpot.name}
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

        <SurfWindowsPanel windows={surfWindows} />

        <SlotCards slots={slotCards} />

        <DaypartOverview items={overviewData} />

        <FeedbackWidget spotId={resolvedSpotId} />
      </section>
    </ProtectedRoute>
  );
}
