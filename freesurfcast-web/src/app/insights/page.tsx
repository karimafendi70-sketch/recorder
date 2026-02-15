"use client";

import { useMemo } from "react";
import { buildDaypartHeatmapData } from "@/lib/heatmap";
import { buildMultiSpotOverview } from "@/lib/spots";
import { getSpotById } from "@/lib/spots/catalog";
import {
  getSpotDayScore,
  type SlotContext,
  type SlotQuality,
} from "@/lib/scores";
import { buildTimelineDataForDay } from "@/lib/timeline";
import { ProtectedRoute } from "../ProtectedRoute";
import { usePreferences } from "../PreferencesProvider";
import { useLanguage, type TranslationKey } from "../LanguageProvider";
import { type ForecastSlot } from "../forecast/mockData";
import { useLiveForecast } from "../forecast/useLiveForecast";
import {
  buildSlotKey,
  getUiScoreClass,
  getWindRelativeToCoast,
  makeQualityForSlot,
} from "../forecast/scoringHelpers";
import { MultiSpotRanking } from "./components/MultiSpotRanking";
import { DaypartHeatmap } from "./components/DaypartHeatmap";
import { TimelinePreview } from "./components/TimelinePreview";
import { ProfileInsightsPanel } from "./components/ProfileInsightsPanel";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { usePageView } from "@/lib/trackClient";
import styles from "./insights.module.css";

const DAY_PARTS = ["morning", "afternoon", "evening"] as const;

export default function InsightsPage() {
  const { preferences: prefs, isUsingDefaults } = usePreferences();
  const { t } = useLanguage();
  usePageView();
  const dayKey = "today";
  const { spots, status } = useLiveForecast(dayKey);

  const qualityForSlot = useMemo(() => makeQualityForSlot(prefs), [prefs]);

  /* -- 1) Multi-spot ranking -- */
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
          bestSlotLabel: bestSlot ? `${bestSlot.label} (${bestSlot.timeLabel})` : "\u2013",
          reasons: (entry.reasons ?? []).slice(0, 2),
        };
      }),
    [rankings, spots]
  );

  /* -- 2) Daypart heatmap -- */
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

  /* -- 3) Timeline (best spot) -- */
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
        dayPart: row.dayPart ?? "\u2013",
        score: row.score,
        scoreClass: getUiScoreClass(row.score),
      })),
    [timelineRows]
  );

  /* -- Best spot summary -- */
  const bestSummary = useMemo(() => {
    if (rankedSpots.length === 0) return null;
    const top = rankedSpots[0];
    const catalogSpot = getSpotById(top.spotId);
    const forecastSpot = spots.find((s) => s.id === top.spotId);
    const bestSlot = forecastSpot?.slots[0];
    const merged = bestSlot?.mergedSpot as Record<string, unknown> | undefined;
    const coastDeg = merged?.coastOrientationDeg as number | undefined;
    const windDeg = merged?.windDirectionDeg as number | undefined;
    const windLabel =
      coastDeg != null && windDeg != null
        ? getWindRelativeToCoast(coastDeg, windDeg)
        : null;

    return {
      name: top.spotName,
      country: catalogSpot?.country ?? "",
      score: top.score,
      scoreClass: top.scoreClass,
      reasons: top.reasons,
      waveHeight: merged?.golfHoogteMeter as number | undefined,
      wavePeriod: merged?.golfPeriodeSeconden as number | undefined,
      windLabel,
      difficulty: catalogSpot?.difficultyTag ?? null,
      notes: catalogSpot?.notes ?? null,
    };
  }, [rankedSpots, spots]);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <ProtectedRoute>
      <section className="stack-lg">
        {status === "error" && (
          <div className="fallback-banner">
            <span>⚠️</span>
            <p>{t("forecast.fallbackBanner")}</p>
          </div>
        )}

        {status === "loading" && (
          <p className="page-lead loading-pulse">{t("forecast.loadingLive")}</p>
        )}

        {isUsingDefaults && (
          <div className="defaults-banner">
            <span>{"\ud83e\udded"}</span>
            <p>
              {t("forecast.defaultsBanner")}{" "}
              <a href="/profile">{t("forecast.editProfile")}</a>
            </p>
          </div>
        )}

        <header className={styles.heroCard}>
          <p className={styles.heroEyebrow}>{t("insights.eyebrow")}</p>
          <h1 className={styles.heroTitle}>{t("insights.title")}</h1>
          <p className={styles.heroSubtitle}>
            {t("insights.subtitle")}
          </p>
        </header>

        {bestSummary && (
          <div className={`${styles.bestSpotCard} ${styles[`bestSpot${capitalize(bestSummary.scoreClass)}`]}`}>
            <p className={styles.bestSpotEyebrow}>{t("insights.bestSpot")}</p>
            <p className={styles.bestSpotName}>
              {bestSummary.name}
              {bestSummary.country && <span className={styles.bestSpotCountry}> \u2014 {bestSummary.country}</span>}
            </p>
            <p className={styles.bestSpotMeta}>
              {t("general.score")}: <strong>{bestSummary.score.toFixed(1)}</strong>
              {bestSummary.reasons.length > 0 && (
                <> \u2014 {bestSummary.reasons.join(", ")}</>
              )}
            </p>

            {/* Mini stats */}
            <div className={styles.bestSpotStats}>
              {bestSummary.waveHeight != null && (
                <span className={styles.bestSpotStat}>{"\ud83c\udf0a"} {bestSummary.waveHeight.toFixed(1)}m</span>
              )}
              {bestSummary.wavePeriod != null && (
                <span className={styles.bestSpotStat}>{"\u23f1"} {bestSummary.wavePeriod}s</span>
              )}
              {bestSummary.windLabel && (
                <span className={styles.bestSpotStat}>{"\ud83d\udca8"} {bestSummary.windLabel}</span>
              )}
              {bestSummary.difficulty && (
                <span className={styles.bestSpotStat}>{"\ud83c\udfaf"} {bestSummary.difficulty}</span>
              )}
            </div>

            {/* Why best text */}
            {bestSummary.notes && (
              <div className={styles.whyBestBlock}>
                <p className={styles.whyBestTitle}>{t("insights.whyBest")}</p>
                <p className={styles.whyBestText}>{bestSummary.notes}</p>
              </div>
            )}

            <a href="/forecast" className={styles.bestSpotLink}>{t("insights.viewForecast")}</a>
          </div>
        )}

        <MultiSpotRanking spots={rankedSpots} />

        <DaypartHeatmap rows={heatmapItems} dayParts={[...DAY_PARTS]} />

        <TimelinePreview spotName={bestSpot.name} entries={timelineEntries} />

        {/* ── P5: Profile Insights (session-based ML-light) ── */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>🧬 {t("profile.insights.title" as TranslationKey)}</h2>
            <p>{t("profile.insights.subtitle" as TranslationKey)}</p>
          </div>
        </div>
        <ProfileInsightsPanel />

        <FeedbackWidget />
      </section>
    </ProtectedRoute>
  );
}
