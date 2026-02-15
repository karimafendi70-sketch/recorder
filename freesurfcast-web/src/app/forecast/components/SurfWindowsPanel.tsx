"use client";

import { useMemo } from "react";
import type { SurfWindow } from "@/lib/forecast/surfWindows";
import { getSizeBand, getWindComfort, getSurfaceQuality } from "@/lib/forecast/conditions";
import type { SlotContext } from "@/lib/scores";
import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type Props = {
  windows: SurfWindow[];
};

const CONDITION_KEY: Record<string, TranslationKey> = {
  clean: "surfWindows.condClean",
  mixed: "surfWindows.condMixed",
  choppy: "surfWindows.condChoppy",
};

function capitalize(value: "high" | "medium" | "low") {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

/** Build a synthetic SlotContext from a SurfWindow's aggregated data. */
function windowToSlotContext(win: SurfWindow): SlotContext {
  return {
    conditionTag: win.condition,
    mergedSpot: {
      golfHoogteMeter: win.waveHeight ?? 0,
      windDirectionDeg: win.windDirection ?? 0,
      coastOrientationDeg: 0, // not available on window; wind comfort will fall back gracefully
      windSpeedKnots: 0,
    },
  };
}

/** Format a dateKey (YYYY-MM-DD) into a human-readable day label. */
function formatWindowDate(dateKey: string, todayStr: string, tomStr: string, locale: string, todayLabel: string, tomLabel: string): string {
  if (dateKey === todayStr) return todayLabel;
  if (dateKey === tomStr) return tomLabel;
  const d = new Date(dateKey + "T12:00:00");
  const weekday = d.toLocaleDateString(locale, { weekday: "short" });
  const day = d.getDate();
  return `${weekday} ${day}`;
}

export function SurfWindowsPanel({ windows }: Props) {
  const { t, lang } = useLanguage();

  const { todayStr, tomStr } = useMemo(() => {
    const now = new Date();
    const tom = new Date(now);
    tom.setDate(now.getDate() + 1);
    return {
      todayStr: now.toISOString().split("T")[0],
      tomStr: tom.toISOString().split("T")[0],
    };
  }, []);
  const todayLabel = t("forecast.days.today");
  const tomLabel = t("forecast.days.tomorrow");

  if (windows.length === 0) {
    return (
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("surfWindows.title")}</h2>
          <p>{t("surfWindows.subtitle")}</p>
        </div>
        <p className={styles.noWindows}>{t("surfWindows.none")}</p>
      </section>
    );
  }

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>{t("surfWindows.title")}</h2>
        <p>{t("surfWindows.subtitle")}</p>
      </div>

      <div className={styles.windowsGrid}>
        {windows.map((win, i) => {
          const dayLabel = win.dateKey
            ? formatWindowDate(win.dateKey, todayStr, tomStr, lang, todayLabel, tomLabel)
            : "";

          const ctx = windowToSlotContext(win);
          const sizeBand = getSizeBand(ctx);
          const windComfort = getWindComfort(ctx);
          const surface = getSurfaceQuality(ctx);

          return (
            <article
              key={`${win.spotId}-${win.startHour}-${i}`}
              className={`${styles.windowCard} ${styles[`slotCard${capitalize(win.scoreClass)}`]}`}
            >
              <div className={styles.windowTopRow}>
                <span className={styles.windowTime}>
                  {dayLabel && <span className={styles.windowDateLabel}>{dayLabel}, </span>}
                  {win.startLabel} – {win.endLabel}
                </span>
                <span
                  className={`${styles.scoreBadge} ${styles[`score${capitalize(win.scoreClass)}`]}`}
                >
                  {win.scoreClass}
                </span>
              </div>

              <p className={styles.windowScore}>
                {win.averageScore.toFixed(1)} / 10
                <span className={styles.windowPeak}>
                  {t("surfWindows.peak")} {win.peakScore.toFixed(1)}
                </span>
              </p>

              <div className={styles.windowMeta}>
                {win.waveHeight != null && (
                  <span className={styles.windowChip}>
                    {win.waveHeight}m
                  </span>
                )}
                <span className={styles.windowChip}>
                  {t(CONDITION_KEY[win.condition] ?? "surfWindows.condMixed")}
                </span>
                <span className={styles.windowChip}>
                  {win.slotCount} {win.slotCount === 1 ? "slot" : "slots"}
                </span>
              </div>

              {/* Pro condition indicators */}
              <div className={styles.conditionRow}>
                <span className={`${styles.condChip} ${styles.condChipSize}`}>
                  🌊 {t(`cond.size.${sizeBand}`)}
                </span>
                <span className={`${styles.condChip} ${styles.condChipWind}`}>
                  💨 {t(`cond.wind.${windComfort}`)}
                </span>
                <span className={`${styles.condChip} ${styles.condChipSurface}`}>
                  {t(`cond.surface.${surface}`)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
