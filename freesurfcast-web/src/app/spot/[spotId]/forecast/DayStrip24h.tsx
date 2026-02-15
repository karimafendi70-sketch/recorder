"use client";

import { useMemo } from "react";
import type { SlotContext, SlotQuality } from "@/lib/scores";
import { buildStripBlocks, type StripBlock } from "@/lib/forecast/dayTrends";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Helpers ──────────────────────────────────── */

const SCORE_COLORS: Record<string, string> = {
  high:   "var(--score-high, #43a047)",
  medium: "var(--score-medium, #fdd835)",
  low:    "var(--score-low, #e53935)",
};

function windArrow(deg: number): string {
  const arr = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  return arr[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/* ── Props ────────────────────────────────────── */

interface Props {
  dateKey: string;
  daySlots: SlotContext[];
  scoreFn: (slot: SlotContext) => SlotQuality;
}

/* ── Component ────────────────────────────────── */

export function DayStrip24h({ dateKey, daySlots, scoreFn }: Props) {
  const { t } = useLanguage();

  const blocks: StripBlock[] = useMemo(
    () => buildStripBlocks(daySlots, scoreFn),
    [daySlots, scoreFn],
  );

  if (blocks.length === 0) return null;

  const maxWave = Math.max(...blocks.map((b) => b.waveHeight ?? 0), 0.1);

  return (
    <div className={styles.strip24} key={dateKey}>
      <p className={styles.strip24Title}>
        {t("dayStrip.title" as TranslationKey)}
      </p>

      <div className={styles.strip24Grid}>
        {blocks.map((b, i) => (
          <div key={i} className={styles.strip24Col}>
            {/* Score bar */}
            <div className={styles.strip24BarWrap}>
              <div
                className={styles.strip24Bar}
                style={{
                  height: `${Math.max(8, (b.score / 10) * 100)}%`,
                  background: SCORE_COLORS[b.scoreClass],
                }}
              />
            </div>

            {/* Wave height mini-bar */}
            <div className={styles.strip24WaveWrap}>
              <div
                className={styles.strip24Wave}
                style={{
                  height: b.waveHeight != null
                    ? `${Math.max(6, (b.waveHeight / maxWave) * 100)}%`
                    : "0%",
                }}
              />
            </div>

            {/* Wind arrow */}
            <span className={styles.strip24Wind}>
              {b.windDeg != null ? windArrow(b.windDeg) : "·"}
            </span>

            {/* Hour label */}
            <span className={styles.strip24Hour}>{b.timeLabel}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.strip24Legend}>
        <span className={styles.strip24LegendItem}>
          <span className={styles.strip24LegendDot} style={{ background: "var(--score-high, #43a047)" }} />
          {t("dayStrip.legend.score" as TranslationKey)}
        </span>
        <span className={styles.strip24LegendItem}>
          <span className={styles.strip24LegendDot} style={{ background: "var(--accent, #156f78)" }} />
          {t("dayStrip.legend.wave" as TranslationKey)}
        </span>
        <span className={styles.strip24LegendItem}>
          💨 {t("dayStrip.legend.wind" as TranslationKey)}
        </span>
      </div>
    </div>
  );
}
