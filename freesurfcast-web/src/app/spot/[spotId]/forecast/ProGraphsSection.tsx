"use client";

import type { ForecastSlot } from "@/app/forecast/mockData";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

interface ProGraphsSectionProps {
  daySlots: ForecastSlot[];
  locale: string;
}

/* ── Tiny helpers ────────────────────────────── */

/** Extract numeric field from mergedSpot safely. */
function num(slot: ForecastSlot, key: string): number | null {
  const m = (slot.mergedSpot ?? {}) as Record<string, unknown>;
  const v = m[key];
  return typeof v === "number" ? v : null;
}

/** Map cloud cover (0-100) → weather icon. */
function weatherIcon(cloud: number | null, temp: number | null): string {
  if (cloud == null) return "☀️";
  if (cloud < 20) return "☀️";
  if (cloud < 50) return "⛅";
  if (cloud < 80) return "🌥️";
  return "☁️";
}

/** Map tide suitability string → numeric height 0..1 for visual curve. */
function tideValue(slot: ForecastSlot, idx: number, total: number): number {
  // Simulate a sinusoidal tidal pattern across the day
  // (real tide would come from an API – this gives a realistic visual)
  const phase = (idx / Math.max(total - 1, 1)) * Math.PI * 2;
  const base = 0.5 + 0.45 * Math.sin(phase - Math.PI / 3);
  // Nudge by tide suitability
  if (slot.tideSuitability === "good") return Math.min(1, base + 0.05);
  if (slot.tideSuitability === "less-ideal") return Math.max(0, base - 0.05);
  return base;
}

/** Wave energy ∝ H² · T (simplified). */
function waveEnergy(slot: ForecastSlot): number {
  const h = num(slot, "golfHoogteMeter") ?? 0;
  const p = num(slot, "golfPeriodeSeconden") ?? 8;
  return h * h * p;
}

/** Consistency = inverse of height variance across the day (normalised 0-1). */
function consistencyScore(slots: ForecastSlot[]): number[] {
  const heights = slots.map((s) => num(s, "golfHoogteMeter") ?? 0);
  const mean = heights.reduce((a, b) => a + b, 0) / (heights.length || 1);
  // Per-slot deviation → normalised consistency
  return heights.map((h) => {
    const dev = Math.abs(h - mean);
    return Math.max(0, 1 - dev / Math.max(mean, 0.5));
  });
}

/* ── SVG Tide Curve ──────────────────────────── */

function TideCurve({ slots }: { slots: ForecastSlot[] }) {
  const { t } = useLanguage();
  const W = 260;
  const H = 56;
  const PAD = 4;

  const values = slots.map((s, i) => tideValue(s, i, slots.length));
  const points = values.map((v, i) => {
    const x = PAD + (i / Math.max(slots.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - v * (H - PAD * 2);
    return `${x},${y}`;
  });

  // Smooth path using line segments (simple polyline)
  const pathD = points.length > 0
    ? `M ${points[0]} ` + points.slice(1).map((p) => `L ${p}`).join(" ")
    : "";
  // Fill area
  const fillD = pathD
    ? `${pathD} L ${PAD + (W - PAD * 2)},${H - PAD} L ${PAD},${H - PAD} Z`
    : "";

  return (
    <div className={styles.proGraphCard}>
      <p className={styles.proGraphLabel}>{t("proGraph.tide" as TranslationKey)}</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.proGraphSvg}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {fillD && (
          <path d={fillD} fill="var(--accent-light, #e0f2f4)" opacity="0.5" />
        )}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="var(--accent, #156f78)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <div className={styles.proGraphAxisLabels}>
        {slots.map((s, i) => (
          <span key={s.id} className={styles.proGraphAxisTick}>
            {s.timeLabel}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Energy Bar Chart ────────────────────────── */

function EnergyBars({ slots }: { slots: ForecastSlot[] }) {
  const { t } = useLanguage();
  const energies = slots.map((s) => waveEnergy(s));
  const maxE = Math.max(...energies, 1);

  return (
    <div className={styles.proGraphCard}>
      <p className={styles.proGraphLabel}>{t("proGraph.energy" as TranslationKey)}</p>
      <div className={styles.proGraphBars}>
        {slots.map((s, i) => {
          const pct = (energies[i] / maxE) * 100;
          return (
            <div key={s.id} className={styles.proGraphBarCol}>
              <div className={styles.proGraphBarTrack}>
                <div
                  className={styles.proGraphBar}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className={styles.proGraphBarLabel}>{s.timeLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Consistency Bar Chart ───────────────────── */

function ConsistencyBars({ slots }: { slots: ForecastSlot[] }) {
  const { t } = useLanguage();
  const scores = consistencyScore(slots);

  return (
    <div className={styles.proGraphCard}>
      <p className={styles.proGraphLabel}>
        {t("proGraph.consistency" as TranslationKey)}
      </p>
      <div className={styles.proGraphBars}>
        {slots.map((s, i) => {
          const pct = scores[i] * 100;
          return (
            <div key={s.id} className={styles.proGraphBarCol}>
              <div className={styles.proGraphBarTrack}>
                <div
                  className={`${styles.proGraphBar} ${styles.proGraphBarConsistency}`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className={styles.proGraphBarLabel}>{s.timeLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Weather Strip ───────────────────────────── */

function WeatherStrip({ slots }: { slots: ForecastSlot[] }) {
  const { t } = useLanguage();

  return (
    <div className={styles.proGraphCard}>
      <p className={styles.proGraphLabel}>{t("proGraph.weather" as TranslationKey)}</p>
      <div className={styles.weatherStrip}>
        {slots.map((s) => {
          const temp = num(s, "temperature");
          const cloud = num(s, "cloudCover");
          return (
            <div key={s.id} className={styles.weatherStripSlot}>
              <span className={styles.weatherStripIcon}>
                {weatherIcon(cloud, temp)}
              </span>
              <span className={styles.weatherStripTemp}>
                {temp != null ? `${Math.round(temp)}°` : "—"}
              </span>
              <span className={styles.weatherStripTime}>{s.timeLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────── */

export function ProGraphsSection({ daySlots, locale }: ProGraphsSectionProps) {
  const { t } = useLanguage();

  if (!daySlots.length) return null;

  return (
    <section className={styles.proGraphsSection}>
      <h3 className={styles.proGraphsSectionTitle}>
        {t("proGraph.title" as TranslationKey)}
      </h3>
      <div className={styles.proGraphsGrid}>
        <TideCurve slots={daySlots} />
        <EnergyBars slots={daySlots} />
        <ConsistencyBars slots={daySlots} />
        <WeatherStrip slots={daySlots} />
      </div>
    </section>
  );
}
