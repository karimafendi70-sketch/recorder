"use client";

import { useMemo } from "react";
import type { WeekSummary } from "@/lib/forecast/weekOverview";
import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type Props = {
  summary: WeekSummary;
  locale: string;
  /** Callback when the user clicks the best-day card to jump to that tab */
  onDayClick?: (dateKey: string) => void;
};

/** Format dateKey to a human-readable label (Today / Tomorrow / weekday + date). */
function formatDate(dateKey: string, todayStr: string, tomStr: string, locale: string, todayLabel: string, tomLabel: string): string {
  if (dateKey === todayStr) return todayLabel;
  if (dateKey === tomStr) return tomLabel;
  const d = new Date(dateKey + "T12:00:00");
  return d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" });
}

export function WeekSummaryCard({ summary, locale, onDayClick }: Props) {
  const { t } = useLanguage();

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

  if (!summary.bestDay) return null;

  const best = summary.bestDay;
  const dayLabel = formatDate(best.dateKey, todayStr, tomStr, locale, todayLabel, tomLabel);

  const sizeLabel = t(best.conditions.sizeKey as TranslationKey);
  const windLabel = t(best.conditions.windKey as TranslationKey);
  const surfaceLabel = t(best.conditions.surfaceKey as TranslationKey);

  return (
    <div
      className={styles.weekSummary}
      role="button"
      tabIndex={0}
      onClick={() => onDayClick?.(best.dateKey)}
      onKeyDown={(e) => { if (e.key === "Enter") onDayClick?.(best.dateKey); }}
    >
      <div className={styles.weekSummaryIcon} aria-hidden>🏆</div>
      <div className={styles.weekSummaryBody}>
        <p className={styles.weekSummaryTitle}>
          {t("weekSummary.bestDay")}
        </p>
        <p className={styles.weekSummaryDay}>
          <strong>{dayLabel}</strong>
          <span className={styles.weekSummaryScore}>
            {best.avgScore.toFixed(1)} / 10
          </span>
        </p>
        <p className={styles.weekSummaryConditions}>
          {sizeLabel} · {windLabel} · {surfaceLabel}
        </p>
      </div>
      <span className={styles.weekSummaryArrow} aria-hidden>→</span>
    </div>
  );
}
