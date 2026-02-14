import styles from "../insights.module.css";

type RankedSpot = {
  rank: number;
  spotId: string;
  spotName: string;
  score: number;
  scoreClass: "high" | "medium" | "low";
  bestSlotLabel: string;
  reasons: string[];
};

type MultiSpotRankingProps = {
  spots: RankedSpot[];
};

export function MultiSpotRanking({ spots }: MultiSpotRankingProps) {
  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Multi-spot ranking</h2>
        <p>Today&rsquo;s top spots by overall score</p>
      </div>

      <ol className={styles.rankingList}>
        {spots.map((spot) => (
          <li
            key={spot.spotId}
            className={`${styles.rankingRow} ${styles[`row${capitalize(spot.scoreClass)}`]}`}
          >
            <span className={styles.rankBadge}>#{spot.rank}</span>

            <div className={styles.rankingInfo}>
              <p className={styles.spotName}>{spot.spotName}</p>
              <p className={styles.spotHint}>
                Best slot: <strong>{spot.bestSlotLabel}</strong>
              </p>
            </div>

            <div className={styles.rankingRight}>
              <span className={`${styles.scorePill} ${styles[`pill${capitalize(spot.scoreClass)}`]}`}>
                {spot.score.toFixed(1)}
              </span>
              <div className={styles.reasonRow}>
                {spot.reasons.map((reason) => (
                  <span key={`${spot.spotId}-${reason}`} className={styles.reasonChip}>
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function capitalize(value: string) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
