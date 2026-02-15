"use client";

import type { DayTrends, TrendDir } from "@/lib/forecast/dayTrends";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Arrow icon per direction ────────────────── */

const TREND_ICON: Record<TrendDir, string> = {
  rising:  "▲",
  falling: "▼",
  steady:  "●",
};

const TREND_CLS: Record<TrendDir, string> = {
  rising:  "trendRising",
  falling: "trendFalling",
  steady:  "trendSteady",
};

/* ── Props ────────────────────────────────────── */

interface Props {
  trends: DayTrends;
}

/* ── Component ────────────────────────────────── */

export function TrendBadges({ trends }: Props) {
  const { t } = useLanguage();

  const items: { label: string; dir: TrendDir; key: TranslationKey }[] = [
    {
      label: t("trend.swell" as TranslationKey),
      dir: trends.swell,
      key: `trend.swell.${trends.swell}` as TranslationKey,
    },
    {
      label: t("trend.wind" as TranslationKey),
      dir: trends.wind,
      key: `trend.wind.${trends.wind}` as TranslationKey,
    },
    {
      label: t("trend.surface" as TranslationKey),
      dir: trends.surface,
      key: `trend.surface.${trends.surface}` as TranslationKey,
    },
  ];

  return (
    <div className={styles.trendRow}>
      {items.map((item) => (
        <span
          key={item.label}
          className={`${styles.trendBadge} ${styles[TREND_CLS[item.dir]]}`}
        >
          <span className={styles.trendIcon}>{TREND_ICON[item.dir]}</span>
          <span className={styles.trendLabel}>{item.label}</span>
          <span className={styles.trendValue}>{t(item.key)}</span>
        </span>
      ))}
    </div>
  );
}
