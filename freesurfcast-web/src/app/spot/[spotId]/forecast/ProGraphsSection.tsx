"use client";

import { useState, useMemo, useCallback } from "react";
import type { ForecastSlot } from "@/app/forecast/mockData";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { buildDayBuckets, type DayBucket } from "@/lib/analysis/dayBuckets";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

interface ProGraphsSectionProps {
  daySlots: ForecastSlot[];
  locale: string;
  /** Current spot id — used to key graphs per spot */
  spotId: string;
  /** Selected day key (YYYY-MM-DD) — used to key & seed graphs */
  dateKey: string;
}

/* ── Tiny helpers ────────────────────────────── */

/** Extract numeric field from mergedSpot safely. */
function num(slot: ForecastSlot, key: string): number | null {
  const m = (slot.mergedSpot ?? {}) as Record<string, unknown>;
  const v = m[key];
  return typeof v === "number" ? v : null;
}

/** Average numeric field across slots, or null if no data. */
function avgNum(slots: ForecastSlot[], key: string): number | null {
  const vals = slots
    .map((s) => num(s, key))
    .filter((v): v is number => v != null);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** Map cloud cover (0-100) → weather icon. */
function weatherIcon(cloud: number | null): string {
  if (cloud == null) return "☀️";
  if (cloud < 20) return "☀️";
  if (cloud < 50) return "⛅";
  if (cloud < 80) return "🌥️";
  return "☁️";
}

/** Simple numeric hash from a string (for seeding day-specific variation). */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Synthetic tide value 0..1, seeded by dayHash so it differs per day/spot. */
function tideValueForBucket(
  bucketIdx: number,
  totalBuckets: number,
  dayHash: number,
): number {
  const phaseShift = ((dayHash % 100) / 100) * Math.PI * 2;
  const freqMultiplier = 1.5 + ((dayHash % 50) / 50) * 1.0;
  const phase =
    (bucketIdx / Math.max(totalBuckets - 1, 1)) * Math.PI * freqMultiplier +
    phaseShift;
  return 0.5 + 0.45 * Math.sin(phase);
}

/** Wave energy ∝ H² · T (simplified). */
function waveEnergy(slot: ForecastSlot): number {
  const h = num(slot, "golfHoogteMeter") ?? 0;
  const p = num(slot, "golfPeriodeSeconden") ?? 8;
  return h * h * p;
}

/* ── Per-bucket metric aggregation ───────────── */

interface BucketMetrics {
  tide: number | null;
  energy: number | null;
  consistency: number | null;
  weather: { icon: string; temp: number | null } | null;
  wind: { speed: number | null; dir: number | null } | null;
}

function computeAllMetrics(
  buckets: DayBucket[],
  dayHash: number,
): BucketMetrics[] {
  const allSlots = buckets.flatMap((b) => b.slots);
  const allHeights = allSlots.map((s) => num(s, "golfHoogteMeter") ?? 0);
  const globalMean =
    allHeights.length > 0
      ? allHeights.reduce((a, b) => a + b, 0) / allHeights.length
      : 0;

  return buckets.map((bucket, i) => {
    const { slots } = bucket;
    if (slots.length === 0) {
      return {
        tide: null,
        energy: null,
        consistency: null,
        weather: null,
        wind: null,
      };
    }

    // Tide – synthetic curve seeded by dayHash, nudged by suitability
    let tide = tideValueForBucket(i, buckets.length, dayHash);
    const goodCount = slots.filter(
      (s) => s.tideSuitability === "good",
    ).length;
    const lessCount = slots.filter(
      (s) => s.tideSuitability === "less-ideal",
    ).length;
    if (goodCount > lessCount) tide = Math.min(1, tide + 0.05);
    else if (lessCount > goodCount) tide = Math.max(0, tide - 0.05);

    // Energy – average H²·T across bucket slots
    const energy =
      slots.reduce((sum, s) => sum + waveEnergy(s), 0) / slots.length;

    // Consistency – inverse deviation from global mean
    const heights = slots.map((s) => num(s, "golfHoogteMeter") ?? 0);
    const avgDev =
      heights.reduce((sum, h) => sum + Math.abs(h - globalMean), 0) /
      heights.length;
    const consistency = Math.max(0, 1 - avgDev / Math.max(globalMean, 0.5));

    // Weather
    const cloud = avgNum(slots, "cloudCover");
    const temp = avgNum(slots, "temperature");

    // Wind
    const speed = avgNum(slots, "windSpeedKnots");
    const dir = avgNum(slots, "windDirectionDeg");

    return {
      tide,
      energy,
      consistency,
      weather: { icon: weatherIcon(cloud), temp },
      wind: { speed, dir },
    };
  });
}

/* ── Wind arrow helper ───────────────────────── */

function WindArrow({ deg }: { deg: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={styles.analysisWindArrow}
      style={{ transform: `rotate(${deg}deg)` }}
      aria-hidden="true"
    >
      <path d="M8 2 L12 12 L8 9 L4 12 Z" fill="currentColor" />
    </svg>
  );
}

/* ── Lane components ─────────────────────────── */

interface LaneProps {
  buckets: DayBucket[];
  metrics: BucketMetrics[];
  activeBucket: number | null;
  onHover: (idx: number | null) => void;
}

/** Tide lane – SVG area chart spanning all bucket columns. */
function TideLane({ buckets, metrics, activeBucket, onHover }: LaneProps) {
  const { t } = useLanguage();
  const W = buckets.length * 40;
  const H = 44;
  const colW = W / buckets.length;

  const dataPoints = metrics.map((m, i) => ({
    x: colW * i + colW / 2,
    y: m.tide != null ? H - 4 - m.tide * (H - 8) : null,
  }));

  const validPts = dataPoints.filter(
    (p): p is { x: number; y: number } => p.y != null,
  );
  const pathD =
    validPts.length > 1
      ? `M ${validPts[0].x},${validPts[0].y} ` +
        validPts
          .slice(1)
          .map((p) => `L ${p.x},${p.y}`)
          .join(" ")
      : "";
  const fillD = pathD
    ? `${pathD} L ${validPts[validPts.length - 1].x},${H - 4} L ${validPts[0].x},${H - 4} Z`
    : "";

  return (
    <div className={styles.analysisLane}>
      <span className={styles.analysisLaneLabel}>
        {t("proGraph.tide" as TranslationKey)}
      </span>
      <div className={styles.analysisLaneContent}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={styles.analysisTideSvg}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {fillD && (
            <path
              d={fillD}
              fill="var(--color-graph-tide, #38bdf8)"
              opacity="0.15"
            />
          )}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-graph-tide, #38bdf8)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {activeBucket != null && (
            <rect
              x={colW * activeBucket}
              y={0}
              width={colW}
              height={H}
              fill="var(--color-wave-primary, #22d3ee)"
              opacity="0.1"
              rx="4"
            />
          )}
          {dataPoints.map(
            (p, i) =>
              p.y != null && (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={activeBucket === i ? 4 : 2.5}
                  fill="var(--color-graph-tide, #38bdf8)"
                  opacity={activeBucket === i ? 1 : 0.7}
                />
              ),
          )}
        </svg>
        {/* Invisible hover/tap targets overlaying each column */}
        <div className={styles.analysisHitLayer}>
          {buckets.map((_, i) => (
            <div
              key={i}
              className={styles.analysisHitCol}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              onTouchStart={() => onHover(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Generic bar lane (Energy / Consistency). */
function BarLane({
  buckets,
  metrics,
  activeBucket,
  onHover,
  field,
  label,
  color,
  showValue,
}: LaneProps & {
  field: "energy" | "consistency";
  label: string;
  color?: string;
  showValue?: boolean;
}) {
  const values = metrics.map((m) => m[field]);
  const maxVal = Math.max(
    ...values.filter((v): v is number => v != null),
    1,
  );

  return (
    <div className={styles.analysisLane}>
      <span className={styles.analysisLaneLabel}>{label}</span>
      <div className={styles.analysisLaneBars}>
        {buckets.map((_, i) => {
          const val = values[i];
          const pct = val != null ? (val / maxVal) * 100 : 0;
          const isEmpty = val == null;
          const isActive = activeBucket === i;
          return (
            <div
              key={i}
              className={`${styles.analysisBucketCol} ${isActive ? styles.analysisBucketActive : ""}`}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              onTouchStart={() => onHover(i)}
            >
              {showValue && val != null && (
                <span className={styles.analysisBarValue}>
                  {Math.round(val)}
                </span>
              )}
              <div className={styles.analysisBarTrack}>
                {!isEmpty && (
                  <div
                    className={styles.analysisBar}
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      ...(color ? { background: color } : {}),
                    }}
                  />
                )}
                {isEmpty && <div className={styles.analysisBarEmpty} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Weather + wind lane. */
function WeatherLane({ buckets, metrics, activeBucket, onHover }: LaneProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.analysisLane}>
      <span className={styles.analysisLaneLabel}>
        {t("proGraph.weather" as TranslationKey)}
      </span>
      <div className={styles.analysisLaneBars}>
        {buckets.map((_, i) => {
          const w = metrics[i].weather;
          const wind = metrics[i].wind;
          const isEmpty = w == null;
          const isActive = activeBucket === i;
          return (
            <div
              key={i}
              className={`${styles.analysisBucketCol} ${styles.analysisWeatherCol} ${isActive ? styles.analysisBucketActive : ""}`}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              onTouchStart={() => onHover(i)}
            >
              {!isEmpty ? (
                <>
                  <span className={styles.analysisWeatherIcon}>{w.icon}</span>
                  <span className={styles.analysisWeatherTemp}>
                    {w.temp != null ? `${Math.round(w.temp)}°` : "—"}
                  </span>
                  {wind?.dir != null && <WindArrow deg={wind.dir} />}
                  {wind?.speed != null && (
                    <span className={styles.analysisWindSpeed}>
                      {Math.round(wind.speed)}kn
                    </span>
                  )}
                </>
              ) : (
                <span className={styles.analysisEmptyDash}>—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Shared time axis ────────────────────────── */

function TimeAxis({
  buckets,
  activeBucket,
  onHover,
}: {
  buckets: DayBucket[];
  activeBucket: number | null;
  onHover: (idx: number | null) => void;
}) {
  return (
    <div className={styles.analysisTimeAxis}>
      {buckets.map((b, i) => (
        <span
          key={i}
          className={`${styles.analysisTimeTick} ${activeBucket === i ? styles.analysisTimeTickActive : ""}`}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
          onTouchStart={() => onHover(i)}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}

/* ── Main Component ──────────────────────────── */

export function ProGraphsSection({
  daySlots,
  locale,
  spotId,
  dateKey,
}: ProGraphsSectionProps) {
  const { t } = useLanguage();
  const dayHash = hashStr(spotId + dateKey);

  const [activeBucket, setActiveBucket] = useState<number | null>(null);

  const buckets = useMemo(() => buildDayBuckets(daySlots), [daySlots]);
  const metrics = useMemo(
    () => computeAllMetrics(buckets, dayHash),
    [buckets, dayHash],
  );

  const handleHover = useCallback((idx: number | null) => {
    setActiveBucket(idx);
  }, []);

  if (!daySlots.length) return null;

  if (daySlots.length < 2) {
    return (
      <section className={styles.proGraphsSection}>
        <h3 className={styles.proGraphsSectionTitle}>
          {t("proGraph.title" as TranslationKey)}
        </h3>
        <div className={styles.emptyState}>
          <span className={styles.emptyStateIcon}>📊</span>
          <p className={styles.emptyStateText}>
            {t("proGraph.empty.notEnoughData" as TranslationKey)}
          </p>
        </div>
      </section>
    );
  }

  const laneProps: LaneProps = {
    buckets,
    metrics,
    activeBucket,
    onHover: handleHover,
  };

  return (
    <section className={styles.proGraphsSection}>
      <h3 className={styles.proGraphsSectionTitle}>
        {t("proGraph.title" as TranslationKey)}
      </h3>
      <div className={styles.analysisStack}>
        <TideLane {...laneProps} />
        <BarLane
          {...laneProps}
          field="energy"
          label={t("proGraph.energy" as TranslationKey)}
          showValue
        />
        <BarLane
          {...laneProps}
          field="consistency"
          label={t("proGraph.consistency" as TranslationKey)}
          color="var(--color-graph-consistency, #a855f7)"
        />
        <WeatherLane {...laneProps} />
        <TimeAxis
          buckets={buckets}
          activeBucket={activeBucket}
          onHover={handleHover}
        />
      </div>
    </section>
  );
}
