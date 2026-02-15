"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { SPOT_CATALOG } from "@/lib/spots/catalog";
import { useCompareForecast } from "@/lib/compare/useCompareForecast";
import type { SpotDayColumn } from "@/lib/compare/types";
import styles from "./compare.module.css";

/* ── Rating colours (same as DayBar / Discover) ── */

const RATING_COLOR: Record<string, string> = {
  epic:        "var(--rating-epic)",
  goodToEpic:  "var(--rating-goodToEpic)",
  good:        "var(--rating-good)",
  fairToGood:  "var(--rating-fairToGood)",
  fair:        "var(--rating-fair)",
  poorToFair:  "var(--rating-poorToFair)",
  poor:        "var(--rating-poor)",
};

/* ── Day options builder ─────────────────────── */

function buildDayOptions(locale: string, todayLabel: string, tomorrowLabel: string) {
  const now = Date.now();
  const opts: { key: string; label: string }[] = [];
  for (let i = 0; i < 16; i++) {
    const d = new Date(now + i * 86_400_000);
    const key = d.toISOString().split("T")[0];
    let label: string;
    if (i === 0) label = todayLabel;
    else if (i === 1) label = tomorrowLabel;
    else {
      const wd = d.toLocaleDateString(locale, { weekday: "short" });
      label = `${wd} ${d.getDate()}`;
    }
    opts.push({ key, label });
  }
  return opts;
}

/* ── Wind arrow helper ───────────────────────── */

function windArrow(deg: number): string {
  const arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  return arrows[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/* ── CompareColumn ───────────────────────────── */

function CompareColumn({ col }: { col: SpotDayColumn }) {
  const { t } = useLanguage();
  const rColor = RATING_COLOR[col.ratingBucket] ?? RATING_COLOR.poor;

  if (col.slotCount === 0) {
    return (
      <div className={styles.column}>
        <div className={styles.colHeader}>
          <span className={styles.colSpot}>{col.spotName}</span>
          <span className={styles.colCountry}>{col.country}</span>
        </div>
        <div className={styles.colEmpty}>
          {t("compare.noData" as TranslationKey)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.column}>
      {/* Header */}
      <div className={styles.colHeader}>
        <span className={styles.colSpot}>{col.spotName}</span>
        <span className={styles.colCountry}>{col.country}</span>
      </div>

      {/* Score + Rating */}
      <div className={styles.colScore}>
        <span className={styles.colScoreValue}>{col.avgScore.toFixed(1)}</span>
        <span className={styles.colRatingPill} style={{ background: rColor }}>
          {t(`rating.${col.ratingBucket}` as TranslationKey)}
        </span>
      </div>

      {/* Best window bar */}
      {col.bestWindow && (
        <div className={styles.colWindow}>
          <div className={styles.colWindowTrack}>
            <div
              className={styles.colWindowSegment}
              style={{
                left: `${(col.bestWindow.startHour / 24) * 100}%`,
                width: `${((col.bestWindow.endHour - col.bestWindow.startHour) / 24) * 100}%`,
                background: rColor,
              }}
            />
          </div>
          <span className={styles.colWindowLabel}>
            {col.bestWindow.startLabel}–{col.bestWindow.endLabel}
          </span>
        </div>
      )}

      {/* Condition blocks */}
      <div className={styles.colBlocks}>
        {/* Surf */}
        <div className={styles.colBlock}>
          <span className={styles.colBlockLabel}>
            {t("compare.surf" as TranslationKey)}
          </span>
          <span className={styles.colBlockValue}>
            {col.waveHeightM != null ? `${col.waveHeightM.toFixed(1)}m` : "—"}
          </span>
          {col.sizeBand && (
            <span className={styles.colBlockSub}>
              {t(`cond.size.${col.sizeBand}` as TranslationKey)}
            </span>
          )}
        </div>

        {/* Swell */}
        <div className={styles.colBlock}>
          <span className={styles.colBlockLabel}>
            {t("compare.swell" as TranslationKey)}
          </span>
          <span className={styles.colBlockValue}>
            {col.wavePeriodS != null ? `${col.wavePeriodS.toFixed(0)}s` : "—"}
          </span>
        </div>

        {/* Wind */}
        <div className={styles.colBlock}>
          <span className={styles.colBlockLabel}>
            {t("compare.wind" as TranslationKey)}
          </span>
          <span className={styles.colBlockValue}>
            {col.windSpeedKn != null ? `${Math.round(col.windSpeedKn)} kn` : "—"}
            {col.windDirDeg != null && ` ${windArrow(col.windDirDeg)}`}
          </span>
          {col.conditions && (
            <span className={styles.colBlockSub}>
              {t(col.conditions.windKey as TranslationKey)}
            </span>
          )}
        </div>

        {/* Surface */}
        <div className={styles.colBlock}>
          <span className={styles.colBlockLabel}>
            {t("compare.surface" as TranslationKey)}
          </span>
          {col.conditions && (
            <span className={styles.colBlockValue}>
              {t(col.conditions.surfaceKey as TranslationKey)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────── */

function ComparePageInner() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse query
  const spotsParam = searchParams.get("spots") ?? "";
  const dayParam = searchParams.get("day") ?? new Date().toISOString().split("T")[0];

  const initialSpots = useMemo(() => {
    const ids = spotsParam.split(",").filter(Boolean);
    return [ids[0] ?? "", ids[1] ?? ""];
  }, [spotsParam]);

  const [spotA, setSpotA] = useState(initialSpots[0]);
  const [spotB, setSpotB] = useState(initialSpots[1]);
  const [dayKey, setDayKey] = useState(dayParam);

  const todayLabel = t("forecast.days.today");
  const tomorrowLabel = t("forecast.days.tomorrow");
  const dayOptions = useMemo(
    () => buildDayOptions(lang, todayLabel, tomorrowLabel),
    [lang, todayLabel, tomorrowLabel],
  );

  // Sync URL
  const pushQuery = useCallback(
    (a: string, b: string, d: string) => {
      const ids = [a, b].filter(Boolean).join(",");
      const params = new URLSearchParams();
      if (ids) params.set("spots", ids);
      if (d) params.set("day", d);
      router.replace(`/compare?${params.toString()}`);
    },
    [router],
  );

  const handleSpotA = useCallback((id: string) => { setSpotA(id); pushQuery(id, spotB, dayKey); }, [spotB, dayKey, pushQuery]);
  const handleSpotB = useCallback((id: string) => { setSpotB(id); pushQuery(spotA, id, dayKey); }, [spotA, dayKey, pushQuery]);
  const handleDay = useCallback((d: string) => { setDayKey(d); pushQuery(spotA, spotB, d); }, [spotA, spotB, pushQuery]);

  // Today helpers
  const todayKey = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isToday = dayKey === todayKey;

  // Same-spot warning
  const sameSpot = spotA !== "" && spotA === spotB;

  // Keyboard shortcuts: ← → switch day, T = today
  const selectPrevDay = useCallback(() => {
    const idx = dayOptions.findIndex((o) => o.key === dayKey);
    if (idx > 0) handleDay(dayOptions[idx - 1].key);
  }, [dayOptions, dayKey, handleDay]);

  const selectNextDay = useCallback(() => {
    const idx = dayOptions.findIndex((o) => o.key === dayKey);
    if (idx >= 0 && idx < dayOptions.length - 1) handleDay(dayOptions[idx + 1].key);
  }, [dayOptions, dayKey, handleDay]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag && ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); selectPrevDay(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); selectNextDay(); }
      else if (e.key.toLowerCase() === "t") { e.preventDefault(); handleDay(todayKey); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectPrevDay, selectNextDay, handleDay, todayKey]);

  // Data
  const activeIds = useMemo(() => [spotA, spotB].filter(Boolean), [spotA, spotB]);
  const { columns, isLoading } = useCompareForecast(activeIds, dayKey);

  // Sorted catalog for selects
  const catalogSorted = useMemo(
    () => [...SPOT_CATALOG].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  return (
    <section className="stack-lg">
      {/* Header */}
      <header className={styles.compareHeader}>
        <h1 className={styles.compareTitle}>
          {t("compare.title" as TranslationKey)}
        </h1>
        <p className={styles.compareSubtitle}>
          {t("compare.subtitle" as TranslationKey)}
        </p>
      </header>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Spot A</label>
          <select
            className={styles.controlSelect}
            value={spotA}
            onChange={(e) => handleSpotA(e.target.value)}
          >
            <option value="">{t("compare.selectSpot" as TranslationKey)}</option>
            {catalogSorted.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.country}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Spot B</label>
          <select
            className={styles.controlSelect}
            value={spotB}
            onChange={(e) => handleSpotB(e.target.value)}
          >
            <option value="">{t("compare.selectSpot" as TranslationKey)}</option>
            {catalogSorted.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.country}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            {t("compare.day" as TranslationKey)}
          </label>
          <select
            className={styles.controlSelect}
            value={dayKey}
            onChange={(e) => handleDay(e.target.value)}
          >
            {dayOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Same-spot warning */}
      {sameSpot && (
        <p className={styles.sameSpotWarning}>
          ⚠️ {t("compare.warning.sameSpot" as TranslationKey)}
        </p>
      )}

      {/* Today + shortcut hint row */}
      <div className={styles.compareExtras}>
        {!isToday && (
          <button className={styles.todayBtn} onClick={() => handleDay(todayKey)}>
            ← {t("compare.actions.today" as TranslationKey)}
          </button>
        )}
        <span className={styles.shortcutHint}>
          {t("compare.shortcuts.hint" as TranslationKey)}
        </span>
      </div>

      {/* Columns */}
      {activeIds.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>⚖️</span>
          <p className={styles.emptyText}>
            {t("compare.empty" as TranslationKey)}
          </p>
        </div>
      ) : isLoading ? (
        <div className={styles.columnsWrap}>
          {activeIds.map((id) => (
            <div key={id} className={styles.skeletonCol} />
          ))}
        </div>
      ) : (
        <div className={styles.columnsWrap}>
          {columns.map((col) => (
            <CompareColumn key={col.spotId} col={col} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Default export with Suspense boundary ─── */

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className={styles.columnsWrap}>
          <div className={styles.skeletonCol} />
          <div className={styles.skeletonCol} />
        </div>
      }
    >
      <ComparePageInner />
    </Suspense>
  );
}
