"use client";

import type { DayWindowSummary } from "@/lib/forecast/dayWindows";
import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type Props = {
  days: DayWindowSummary[];
  locale: string;
  onDayClick?: (dateKey: string) => void;
};

function formatDate(
  dateKey: string,
  locale: string,
  todayStr: string,
  tomStr: string,
  todayLabel: string,
  tomLabel: string,
): string {
  if (dateKey === todayStr) return todayLabel;
  if (dateKey === tomStr) return tomLabel;
  const d = new Date(dateKey + "T12:00:00");
  return d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" });
}

function scoreClass(score: number): "high" | "medium" | "low" {
  if (score >= 7) return "high";
  if (score >= 4.5) return "medium";
  return "low";
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function Next2DaysSummary({ days, locale, onDayClick }: Props) {
  const { t } = useLanguage();

  const now = new Date();
  const tom = new Date(now);
  tom.setDate(now.getDate() + 1);
  const todayStr = now.toISOString().split("T")[0];
  const tomStr = tom.toISOString().split("T")[0];

  if (days.length === 0) return null;

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>{t("dayView.upcoming.title")}</h2>
        <p>{t("dayView.upcoming.subtitle")}</p>
      </div>

      <div className={styles.upcomingGrid}>
        {days.map((day) => {
          const label = formatDate(day.dateKey, locale, todayStr, tomStr, t("forecast.days.today"), t("forecast.days.tomorrow"));
          const sc = scoreClass(day.avgScore);
          const bestWin = day.windows[0] ?? null;

          return (
            <button
              key={day.dateKey}
              type="button"
              className={`${styles.upcomingCard} ${styles[`slotCard${capitalise(sc)}`]}`}
              onClick={() => onDayClick?.(day.dateKey)}
            >
              <div className={styles.upcomingTopRow}>
                <span className={styles.upcomingDay}>{label}</span>
                <span className={`${styles.scoreBadge} ${styles[`score${capitalise(sc)}`]}`}>
                  {day.avgScore.toFixed(1)}
                </span>
              </div>

              {bestWin ? (
                <p className={styles.upcomingMeta}>
                  {t("dayView.upcoming.bestBlock")}: {bestWin.startLabel} – {bestWin.endLabel}
                  {bestWin.waveHeight != null && ` · ${bestWin.waveHeight.toFixed(1)}m`}
                </p>
              ) : (
                <p className={styles.upcomingMeta}>{t("dayView.upcoming.noWindow")}</p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
