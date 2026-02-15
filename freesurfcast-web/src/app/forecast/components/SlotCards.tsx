import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type SlotCardItem = {
  id: string;
  label: string;
  timeLabel: string;
  score: number;
  scoreClass: "high" | "medium" | "low";
  condition: string;
  reasons: string[];
  /** Condition indicator i18n keys (optional – gracefully hidden when absent) */
  windKey?: TranslationKey;
  sizeKey?: TranslationKey;
  surfaceKey?: TranslationKey;
};

type SlotCardsProps = {
  slots: SlotCardItem[];
};

export function SlotCards({ slots }: SlotCardsProps) {
  const { t } = useLanguage();

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Day slots</h2>
        <p>Scored with profile-aware surf logic</p>
      </div>

      <div className={styles.slotGrid}>
        {slots.map((slot) => (
          <article key={slot.id} className={`${styles.slotCard} ${styles[`slotCard${capitalize(slot.scoreClass)}`]}`}>
            <div className={styles.slotTopRow}>
              <div>
                <p className={styles.slotLabel}>{slot.label}</p>
                <p className={styles.slotMeta}>{slot.timeLabel}</p>
              </div>
              <span className={`${styles.scoreBadge} ${styles[`score${capitalize(slot.scoreClass)}`]}`}>
                {slot.scoreClass}
              </span>
            </div>

            <p className={styles.scoreValue}>{slot.score.toFixed(1)} / 10</p>
            <p className={styles.slotMeta}>{slot.condition}</p>

            {/* Condition indicator chips */}
            {(slot.windKey || slot.sizeKey || slot.surfaceKey) && (
              <div className={styles.conditionRow}>
                {slot.sizeKey && (
                  <span className={`${styles.condChip} ${styles.condChipSize}`}>
                    🌊 {t(slot.sizeKey)}
                  </span>
                )}
                {slot.windKey && (
                  <span className={`${styles.condChip} ${styles.condChipWind}`}>
                    💨 {t(slot.windKey)}
                  </span>
                )}
                {slot.surfaceKey && (
                  <span className={`${styles.condChip} ${styles.condChipSurface}`}>
                    {t(slot.surfaceKey)}
                  </span>
                )}
              </div>
            )}

            <div className={styles.reasonRow}>
              {slot.reasons.map((reason) => (
                <span key={`${slot.id}-${reason}`} className={styles.reasonChip}>
                  {reason}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function capitalize(value: "high" | "medium" | "low") {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
