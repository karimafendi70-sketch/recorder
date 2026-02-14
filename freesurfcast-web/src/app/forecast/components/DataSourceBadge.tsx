/* ──────────────────────────────────────────────
 *  DataSourceBadge – shows whether Forecast is
 *  running on live data, mock data, or still loading.
 * ────────────────────────────────────────────── */

"use client";

import type { LiveStatus } from "../useLiveForecast";
import { useLanguage } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type DataSourceBadgeProps = {
  status: LiveStatus;
  isLive: boolean;
  fetchedAt: string | null;
};

export function DataSourceBadge({ status, isLive, fetchedAt }: DataSourceBadgeProps) {
  const { lang, t } = useLanguage();

  if (status === "idle") return null;

  if (status === "loading") {
    return (
      <div className={`${styles.dataSourceBadge} ${styles.dataSourceLoading}`}>
        <span className={styles.dataSourceSpinner} />
        <span>{t("forecast.loadingData")}</span>
      </div>
    );
  }

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
