import styles from "../forecast.module.css";

type SpotItem = {
  id: string;
  name: string;
};

type SpotSelectorProps = {
  spots: SpotItem[];
  activeSpotId: string;
  scoreBySpotId: Record<string, number>;
  onChange: (spotId: string) => void;
};

export function SpotSelector({ spots, activeSpotId, scoreBySpotId, onChange }: SpotSelectorProps) {
  return (
    <section className={styles.selectorCard}>
      <div className={styles.selectorHeaderRow}>
        <h2 className={styles.selectorTitle}>Spot</h2>
        <p className={styles.selectorHint}>Pick a spot to update forecast cards</p>
      </div>

      <div className={styles.selectorPills}>
        {spots.map((spot) => {
          const isActive = spot.id === activeSpotId;
          const rankingScore = scoreBySpotId[spot.id];

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => onChange(spot.id)}
              className={isActive ? `${styles.selectorPill} ${styles.selectorPillActive}` : styles.selectorPill}
              aria-pressed={isActive}
            >
              <span>{spot.name}</span>
              <span className={styles.selectorPillScore}>{Number.isFinite(rankingScore) ? rankingScore.toFixed(1) : "--"}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
