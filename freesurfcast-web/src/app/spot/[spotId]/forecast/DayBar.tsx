"use client";

import type { DaySummary, RatingColor } from "@/lib/forecast/dayWindows";
import type { AlertMap } from "@/lib/alerts/matchDayAlert";
import styles from "../../spot.module.css";

type Props = {
  days: DaySummary[];
  activeDateKey: string;
  onSelect: (dateKey: string) => void;
  /** Optional map of dateKey → alert-match for the current spot profile. */
  alertDays?: AlertMap;
};

/** Maps the 7-band rating to CSS class names for the stripe colour. */
const RATING_CLASS: Record<RatingColor, string> = {
  epic:        styles.dayBarRatingEpic,
  goodToEpic:  styles.dayBarRatingGoodToEpic,
  good:        styles.dayBarRatingGood,
  fairToGood:  styles.dayBarRatingFairToGood,
  fair:        styles.dayBarRatingFair,
  poorToFair:  styles.dayBarRatingPoorToFair,
  poor:        styles.dayBarRatingPoor,
};

/** Rough cardinal arrow from wind degrees. */
function windArrow(deg: number): string {
  const arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return arrows[idx];
}

export function DayBar({ days, activeDateKey, onSelect, alertDays }: Props) {
  return (
    <div className={styles.dayBar} role="tablist" aria-label="16-day forecast">
      {days.map((day) => {
        const isActive = day.dateKey === activeDateKey;
        const isAlert = alertDays?.[day.dateKey] ?? false;
        return (
          <button
            key={day.dateKey}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.dayBarCard} ${isActive ? styles.dayBarCardActive : ""} ${isAlert ? styles.dayBarCardAlert : ""}`}
            onClick={() => onSelect(day.dateKey)}
          >
            {isAlert && <span className={styles.dayBarAlertDot} aria-label="Alert" />}
            <span className={styles.dayBarLabel}>{day.shortLabel}</span>
            <span className={`${styles.dayBarRating} ${RATING_CLASS[day.ratingColor]}`} />
            <span className={styles.dayBarHeight}>
              {day.minHeight.toFixed(1)}–{day.maxHeight.toFixed(1)}m
            </span>
            <span className={styles.dayBarWind}>{windArrow(day.primaryWindDir)}</span>
          </button>
        );
      })}
    </div>
  );
}
