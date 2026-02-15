"use client";

import { useState, useCallback } from "react";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { useAlertProfile, defaultProfile } from "@/lib/alerts/useAlertProfile";
import {
  RATING_ORDER,
  SIZE_ORDER,
  type RatingBucket,
  type SizeBand,
  type SpotAlertProfile,
} from "@/lib/alerts/types";
import styles from "../../spot.module.css";

/* ── AlertConfigPanel ────────────────────────── */

export function AlertConfigPanel({ spotId }: { spotId: string }) {
  const { t } = useLanguage();
  const { profile, save, remove } = useAlertProfile(spotId);

  const [open, setOpen] = useState(false);

  // Local draft state (only when editing)
  const [draft, setDraft] = useState<SpotAlertProfile>(
    () => profile ?? defaultProfile(spotId),
  );

  const isActive = profile !== null;

  const handleToggle = useCallback(() => {
    if (!open) {
      // Opening: sync draft from saved profile (or defaults)
      setDraft(profile ?? defaultProfile(spotId));
    }
    setOpen((v) => !v);
  }, [open, profile, spotId]);

  const handleSave = useCallback(() => {
    save(draft);
    setOpen(false);
  }, [draft, save]);

  const handleRemove = useCallback(() => {
    remove();
    setDraft(defaultProfile(spotId));
    setOpen(false);
  }, [remove, spotId]);

  const set = useCallback(
    <K extends keyof SpotAlertProfile>(key: K, value: SpotAlertProfile[K]) =>
      setDraft((d) => ({ ...d, [key]: value })),
    [],
  );

  /* ── Collapsed state ── */
  if (!open) {
    return (
      <button
        type="button"
        className={`${styles.alertToggleBtn} ${isActive ? styles.alertToggleBtnActive : ""}`}
        onClick={handleToggle}
      >
        <span className={styles.alertToggleIcon}>🔔</span>
        {isActive
          ? t("alerts.config.active" as TranslationKey)
          : t("alerts.config.setup" as TranslationKey)}
      </button>
    );
  }

  /* ── Expanded form ── */
  return (
    <div className={styles.alertPanel}>
      <div className={styles.alertPanelHeader}>
        <span className={styles.alertPanelIcon}>🔔</span>
        <h3 className={styles.alertPanelTitle}>
          {t("alerts.config.title" as TranslationKey)}
        </h3>
      </div>

      {/* ── Min rating ── */}
      <div className={styles.alertField}>
        <label className={styles.alertFieldLabel}>
          {t("alerts.config.minRating" as TranslationKey)}
        </label>
        <div className={styles.alertChips}>
          {RATING_ORDER.map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.alertChip} ${r === draft.minRatingBucket ? styles.alertChipSelected : ""}`}
              onClick={() => set("minRatingBucket", r)}
            >
              {t(`rating.${r}` as TranslationKey)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Size range ── */}
      <div className={styles.alertField}>
        <label className={styles.alertFieldLabel}>
          {t("alerts.config.sizeRange" as TranslationKey)}
        </label>
        <div className={styles.alertSizeRow}>
          <select
            className={styles.alertSelect}
            value={draft.minSizeBand ?? ""}
            onChange={(e) =>
              set("minSizeBand", (e.target.value || undefined) as SizeBand | undefined)
            }
          >
            <option value="">{t("alerts.config.any" as TranslationKey)}</option>
            {SIZE_ORDER.map((s) => (
              <option key={s} value={s}>
                {t(`cond.size.${s}` as TranslationKey)}
              </option>
            ))}
          </select>
          <span className={styles.alertSizeSep}>–</span>
          <select
            className={styles.alertSelect}
            value={draft.maxSizeBand ?? ""}
            onChange={(e) =>
              set("maxSizeBand", (e.target.value || undefined) as SizeBand | undefined)
            }
          >
            <option value="">{t("alerts.config.any" as TranslationKey)}</option>
            {SIZE_ORDER.map((s) => (
              <option key={s} value={s}>
                {t(`cond.size.${s}` as TranslationKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Offshore preference ── */}
      <label className={styles.alertCheckRow}>
        <input
          type="checkbox"
          checked={draft.preferOffshore ?? false}
          onChange={(e) => set("preferOffshore", e.target.checked)}
          className={styles.alertCheckbox}
        />
        <span>{t("alerts.config.preferOffshore" as TranslationKey)}</span>
      </label>

      {/* ── Actions ── */}
      <div className={styles.alertActions}>
        <button type="button" className={styles.alertSaveBtn} onClick={handleSave}>
          {t("alerts.config.save" as TranslationKey)}
        </button>
        {isActive && (
          <button type="button" className={styles.alertRemoveBtn} onClick={handleRemove}>
            {t("alerts.config.remove" as TranslationKey)}
          </button>
        )}
        <button type="button" className={styles.alertCancelBtn} onClick={() => setOpen(false)}>
          {t("alerts.config.cancel" as TranslationKey)}
        </button>
      </div>
    </div>
  );
}
