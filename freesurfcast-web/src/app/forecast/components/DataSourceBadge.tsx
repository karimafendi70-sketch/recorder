/* ──────────────────────────────────────────────
 *  DataSourceBadge – shows whether Forecast is
 *  running on live data, mock data, or still loading.
 * ────────────────────────────────────────────── */

"use client";

import type { DataSource } from "../useLiveForecast";
import { useLanguage } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type DataSourceBadgeProps = {
  source: DataSource;
  fetchedAt: string | null;
};

export function DataSourceBadge({ source, fetchedAt }: DataSourceBadgeProps) {
  const { lang, t } = useLanguage();

  if (source === "loading") return null;

  const isLive = source === "live";
  const label = isLive ? t("forecast.liveData") : t("forecast.mockData");

  const timeStr = fetchedAt
    ? new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(fetchedAt))
    : null;

  return (
    <div className={`${styles.dataSourceBadge} ${isLive ? styles.dataSourceLive : styles.dataSourceMock}`}>
      <span className={styles.dataSourceDot} />
      <span>{label}</span>
      {timeStr && <span className={styles.dataSourceTime}>({timeStr})</span>}
    </div>
  );
}
