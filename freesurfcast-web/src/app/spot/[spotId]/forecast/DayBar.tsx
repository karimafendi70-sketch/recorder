"use client";

import type { DaySummary, RatingColor } from "@/lib/forecast/dayWindows";
import styles from "../../spot.module.css";

type Props = {
  days: DaySummary[];
  activeDateKey: string;
  onSelect: (dateKey: string) => void;
};

const RATING_CLASS: Record<RatingColor, string> = {
  epic: styles.dayBarRatingEpic,
  good: styles.dayBarRatingGood,
  fair: styles.dayBarRatingFair,
  poor: styles.dayBarRatingPoor,
};

/** Rough cardinal arrow from wind degrees. */
function windArrow(deg: number): string {
  const arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return arrows[idx];
}

export function DayBar({ days, activeDateKey, onSelect }: Props) {
  return (
    <div className={styles.dayBar} role="tablist" aria-label="16-day forecast">
      {days.map((day) => {
        const isActive = day.dateKey === activeDateKey;
        return (
          <button
            key={day.dateKey}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.dayBarCard} ${isActive ? styles.dayBarCardActive : ""}`}
            onClick={() => onSelect(day.dateKey)}
          >
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
