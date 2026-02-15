"use client";

import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { SharePanel } from "@/app/share/SharePanel";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

export interface ActionsRowProps {
  /** Navigate to today */
  onBackToToday?: () => void;
  showBackToToday: boolean;
  /** Share */
  showShare: boolean;
  onToggleShare: () => void;
  shareOpen: boolean;
  shareUrl: string;
  shareText: string;
  /** Spot id — for session/compare links */
  spotId: string;
  /** Keyboard shortcut hint */
  shortcutHint: string;
}

/* ── Component ───────────────────────────────── */

export function ForecastActionsRow({
  onBackToToday,
  showBackToToday,
  showShare,
  onToggleShare,
  shareOpen,
  shareUrl,
  shareText,
  spotId,
  shortcutHint,
}: ActionsRowProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.actionsRow}>
      <div className={styles.actionsLeft}>
        {showBackToToday && onBackToToday && (
          <button className={styles.actionBtn} onClick={onBackToToday}>
            ← {t("forecast.actions.backToToday" as TranslationKey)}
          </button>
        )}
        <button className={styles.actionBtn} onClick={onToggleShare}>
          📤 {t("share.button" as TranslationKey)}
        </button>
        <a
          className={styles.actionBtn}
          href={`/spot/${spotId}/sessions`}
        >
          📝 {t("forecast.actions.logSession" as TranslationKey)}
        </a>
      </div>

      <span className={styles.actionsHint}>{shortcutHint}</span>

      {shareOpen && (
        <SharePanel
          link={shareUrl}
          text={shareText}
          className={styles.actionsSharePanel}
        />
      )}
    </div>
  );
}
