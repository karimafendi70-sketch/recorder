"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Props ────────────────────────────────────── */

interface Props {
  hasActiveFilters: boolean;
  hasAlerts: boolean;
  onToggleFilters: () => void;
  onOpenSettings: () => void;
}

/* ── Component ────────────────────────────────── */

export function ForecastFilterStatusBar({
  hasActiveFilters,
  hasAlerts,
  onToggleFilters,
  onOpenSettings,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className={styles.filterStatusBar}>
      <span className={styles.filterStatusLabel}>
        <span
          className={`${styles.filterStatusDot} ${hasActiveFilters ? styles.filterStatusDotOn : styles.filterStatusDotOff}`}
        />
        {hasActiveFilters
          ? t("forecast.filters.active" as TranslationKey)
          : t("forecast.filters.inactive" as TranslationKey)}
        {hasAlerts && (
          <span className={styles.filterStatusAlertChip}>
            🔔 {t("forecast.filters.alertsOn" as TranslationKey)}
          </span>
        )}
      </span>

      <div className={styles.filterStatusActions}>
        <button
          type="button"
          className={styles.filterStatusBtn}
          onClick={onToggleFilters}
        >
          {hasActiveFilters
            ? t("forecast.filters.clearAll" as TranslationKey)
            : t("forecast.filters.enableAll" as TranslationKey)}
        </button>
        <button
          type="button"
          className={styles.filterStatusBtn}
          onClick={onOpenSettings}
        >
          ⚙ {t("forecast.filters.openSettings" as TranslationKey)}
        </button>
      </div>
    </div>
  );
}
