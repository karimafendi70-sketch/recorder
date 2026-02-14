import styles from "../insights.module.css";

type TimelineEntry = {
  time: string;
  dayPart: string;
  score: number;
  scoreClass: "high" | "medium" | "low";
};

type TimelinePreviewProps = {
  spotName: string;
  entries: TimelineEntry[];
};

export function TimelinePreview({ spotName, entries }: TimelinePreviewProps) {
  const maxScore = 10;

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Timeline &mdash; {spotName}</h2>
        <p>Score progression through the day</p>
      </div>

      <div className={styles.timelineGrid}>
        {entries.map((entry, index) => (
          <div key={`${entry.time}-${index}`} className={styles.timelineRow}>
            <span className={styles.timelineTime}>{entry.time}</span>

            <div className={styles.barTrack}>
              <div
                className={`${styles.barFill} ${styles[`bar${capitalize(entry.scoreClass)}`]}`}
                style={{ width: `${Math.max(4, (entry.score / maxScore) * 100)}%` }}
              />
            </div>

            <span className={`${styles.timelineScore} ${styles[`pill${capitalize(entry.scoreClass)}`]}`}>
              {entry.score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
