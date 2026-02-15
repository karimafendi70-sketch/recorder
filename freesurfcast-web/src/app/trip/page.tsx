"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { SPOT_CATALOG, type Region } from "@/lib/spots/catalog";
import { useTripPlanner } from "@/lib/trip/useTripPlanner";
import type { TripCombo } from "@/lib/trip/types";
import styles from "./trip.module.css";

/* ── Rating colours ──────────────────────────── */

const RATING_COLOR: Record<string, string> = {
  epic:        "var(--rating-epic)",
  goodToEpic:  "var(--rating-goodToEpic)",
  good:        "var(--rating-good)",
  fairToGood:  "var(--rating-fairToGood)",
  fair:        "var(--rating-fair)",
  poorToFair:  "var(--rating-poorToFair)",
  poor:        "var(--rating-poor)",
};

/* ── Date helpers ────────────────────────────── */

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateKey: string, days: number) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function maxForecastDate() {
  return addDays(todayKey(), 15);
}

function formatDateShort(dateKey: string, locale: string) {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

/* ── Wind arrow ──────────────────────────────── */

function windArrow(deg: number): string {
  const arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  return arrows[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/* ── Region helpers ──────────────────────────── */

const REGION_LABELS: Record<Region, string> = {
  eu: "🇪🇺 Europe",
  am: "🌎 Americas",
  af: "🌍 Africa",
  ap: "🌏 Asia-Pacific",
};

/* ── Combo Card ──────────────────────────────── */

function ComboCard({ combo, rank, lang }: { combo: TripCombo; rank: number; lang: string }) {
  const { t } = useLanguage();
  const rColor = RATING_COLOR[combo.ratingBucket] ?? RATING_COLOR.poor;
  const isEpic = combo.ratingBucket === "epic" || combo.ratingBucket === "goodToEpic";

  return (
    <Link
      href={`/spot/${combo.spotId}/forecast`}
      className={`${styles.comboCard} ${isEpic ? styles.comboCardEpic : ""}`}
      style={{ animationDelay: `${rank * 0.04}s` }}
    >
      {/* Rank badge */}
      <span className={styles.comboRank}>#{rank + 1}</span>

      {/* Rating stripe */}
      <span className={styles.comboStripe} style={{ background: rColor }} />

      <div className={styles.comboBody}>
        {/* Header row: spot + day */}
        <div className={styles.comboHeader}>
          <div className={styles.comboSpotWrap}>
            <span className={styles.comboSpot}>{combo.spotName}</span>
            <span className={styles.comboCountry}>{combo.country}</span>
          </div>
          <span className={styles.comboDay}>{combo.dayLabel}</span>
        </div>

        {/* Score + rating */}
        <div className={styles.comboScoreRow}>
          <span className={styles.comboScoreValue}>{combo.avgScore.toFixed(1)}</span>
          <span className={styles.comboRatingPill} style={{ background: rColor }}>
            {t(`rating.${combo.ratingBucket}` as TranslationKey)}
          </span>
          {combo.sizeBand && (
            <span className={styles.comboSizeBadge}>
              {t(`cond.size.${combo.sizeBand}` as TranslationKey)}
            </span>
          )}
        </div>

        {/* Best window */}
        {combo.bestWindow && (
          <div className={styles.comboWindow}>
            <div className={styles.comboWindowTrack}>
              <div
                className={styles.comboWindowSeg}
                style={{
                  left: `${(combo.bestWindow.startHour / 24) * 100}%`,
                  width: `${((combo.bestWindow.endHour - combo.bestWindow.startHour) / 24) * 100}%`,
                  background: rColor,
                }}
              />
            </div>
            <span className={styles.comboWindowLabel}>
              {combo.bestWindow.startLabel}–{combo.bestWindow.endLabel}
            </span>
          </div>
        )}

        {/* Conditions row */}
        <div className={styles.comboConditions}>
          {combo.waveHeightM != null && (
            <span className={styles.comboTag}>
              🌊 {combo.waveHeightM.toFixed(1)}m
            </span>
          )}
          {combo.wavePeriodS != null && (
            <span className={styles.comboTag}>
              ⏱ {combo.wavePeriodS.toFixed(0)}s
            </span>
          )}
          {combo.windSpeedKn != null && (
            <span className={styles.comboTag}>
              💨 {Math.round(combo.windSpeedKn)}kn
              {combo.windDirDeg != null && ` ${windArrow(combo.windDirDeg)}`}
            </span>
          )}
          {combo.conditions && (
            <span className={styles.comboTag}>
              {t(combo.conditions.windKey as TranslationKey)}
            </span>
          )}
        </div>

        {/* Reason */}
        <p className={styles.comboReason}>
          {t(combo.reasonKey as TranslationKey)}
        </p>
      </div>
    </Link>
  );
}

/* ── TripPlannerInner (uses searchParams) ────── */

function TripPlannerInner() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = todayKey();
  const maxDate = maxForecastDate();

  // URL state
  const paramStart = searchParams.get("from") ?? today;
  const paramEnd = searchParams.get("to") ?? maxDate;
  const paramRegion = searchParams.get("region") ?? "";
  const paramCountry = searchParams.get("country") ?? "";

  const [startDate, setStartDate] = useState(paramStart < today ? today : paramStart);
  const [endDate, setEndDate] = useState(paramEnd > maxDate ? maxDate : paramEnd);
  const [regionFilter, setRegionFilter] = useState<string>(paramRegion);
  const [countryFilter, setCountryFilter] = useState<string>(paramCountry);

  // Build filtered spot list
  const spotIds = useMemo(() => {
    let filtered = SPOT_CATALOG;
    if (regionFilter) {
      filtered = filtered.filter((s) => s.region === regionFilter);
    }
    if (countryFilter) {
      filtered = filtered.filter((s) => s.country === countryFilter);
    }
    return filtered.map((s) => s.id);
  }, [regionFilter, countryFilter]);

  // Countries for current region
  const countries = useMemo(() => {
    let base = SPOT_CATALOG;
    if (regionFilter) base = base.filter((s) => s.region === regionFilter);
    return [...new Set(base.map((s) => s.country))].sort();
  }, [regionFilter]);

  // Push URL
  const pushQuery = useCallback(
    (from: string, to: string, region: string, country: string) => {
      const p = new URLSearchParams();
      if (from !== today) p.set("from", from);
      if (to !== maxDate) p.set("to", to);
      if (region) p.set("region", region);
      if (country) p.set("country", country);
      const qs = p.toString();
      router.replace(`/trip${qs ? `?${qs}` : ""}`);
    },
    [router, today, maxDate],
  );

  const handleStart = useCallback((v: string) => {
    const clamped = v < today ? today : v > maxDate ? maxDate : v;
    setStartDate(clamped);
    if (clamped > endDate) setEndDate(clamped);
    pushQuery(clamped, clamped > endDate ? clamped : endDate, regionFilter, countryFilter);
  }, [today, maxDate, endDate, regionFilter, countryFilter, pushQuery]);

  const handleEnd = useCallback((v: string) => {
    const clamped = v < startDate ? startDate : v > maxDate ? maxDate : v;
    setEndDate(clamped);
    pushQuery(startDate, clamped, regionFilter, countryFilter);
  }, [startDate, maxDate, regionFilter, countryFilter, pushQuery]);

  const handleRegion = useCallback((v: string) => {
    setRegionFilter(v);
    setCountryFilter("");
    pushQuery(startDate, endDate, v, "");
  }, [startDate, endDate, pushQuery]);

  const handleCountry = useCallback((v: string) => {
    setCountryFilter(v);
    pushQuery(startDate, endDate, regionFilter, v);
  }, [startDate, endDate, regionFilter, pushQuery]);

  // "This week" quick-set
  const handleThisWeek = useCallback(() => {
    const t = todayKey();
    const end7 = addDays(t, 7);
    const mx = maxForecastDate();
    const clamped = end7 > mx ? mx : end7;
    setStartDate(t);
    setEndDate(clamped);
    pushQuery(t, clamped, regionFilter, countryFilter);
  }, [regionFilter, countryFilter, pushQuery]);

  // Trip data
  const { combos, isLoading } = useTripPlanner(startDate, endDate, spotIds);

  // Date range label
  const rangeLabel = `${formatDateShort(startDate, lang)} – ${formatDateShort(endDate, lang)}`;

  return (
    <section className="stack-lg">
      {/* Header */}
      <header className={styles.tripHeader}>
        <h1 className={styles.tripTitle}>
          {t("trip.title" as TranslationKey)}
        </h1>
        <p className={styles.tripSubtitle}>
          {t("trip.subtitle" as TranslationKey)}
        </p>
      </header>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Date range */}
        <div className={styles.controlRow}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              {t("trip.from" as TranslationKey)}
            </label>
            <input
              type="date"
              className={styles.controlInput}
              value={startDate}
              min={today}
              max={maxDate}
              onChange={(e) => handleStart(e.target.value)}
            />
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              {t("trip.to" as TranslationKey)}
            </label>
            <input
              type="date"
              className={styles.controlInput}
              value={endDate}
              min={startDate}
              max={maxDate}
              onChange={(e) => handleEnd(e.target.value)}
            />
          </div>
        </div>

        {/* Quick date button */}
        <button className={styles.thisWeekBtn} onClick={handleThisWeek}>
          📅 {t("trip.actions.thisWeek" as TranslationKey)}
        </button>

        {/* Spot filters */}
        <div className={styles.controlRow}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              {t("trip.region" as TranslationKey)}
            </label>
            <select
              className={styles.controlSelect}
              value={regionFilter}
              onChange={(e) => handleRegion(e.target.value)}
            >
              <option value="">{t("trip.allRegions" as TranslationKey)}</option>
              {(Object.keys(REGION_LABELS) as Region[]).map((r) => (
                <option key={r} value={r}>{REGION_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              {t("trip.country" as TranslationKey)}
            </label>
            <select
              className={styles.controlSelect}
              value={countryFilter}
              onChange={(e) => handleCountry(e.target.value)}
            >
              <option value="">{t("trip.allCountries" as TranslationKey)}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Range badge */}
      <div className={styles.rangeBadge}>
        📅 {rangeLabel} · {spotIds.length} {t("trip.spots" as TranslationKey)}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className={styles.skeletonWrap}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : combos.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🧳</span>
          <p className={styles.emptyText}>
            {t("trip.noResults" as TranslationKey)}
          </p>
        </div>
      ) : (
        <div className={styles.comboList}>
          {combos.map((combo, i) => (
            <ComboCard
              key={`${combo.spotId}-${combo.dateKey}`}
              combo={combo}
              rank={i}
              lang={lang}
            />
          ))}
          <p className={styles.scoreHint}>
            {t("trip.scoreHint" as TranslationKey)}
          </p>
        </div>
      )}
    </section>
  );
}

/* ── Default export with Suspense ────────────── */

export default function TripPlannerPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.skeletonWrap}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      }
    >
      <TripPlannerInner />
    </Suspense>
  );
}
