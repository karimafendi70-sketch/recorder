import styles from "../forecast.module.css";

type OverviewItem = {
  key: string;
  label: string;
  timeLabel: string;
  score: number | null;
  scoreClass: "high" | "medium" | "low";
};

type DaypartOverviewProps = {
  items: OverviewItem[];
};

export function DaypartOverview({ items }: DaypartOverviewProps) {
  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Mini daypart overview</h2>
        <p>Best slot per morning / afternoon / evening</p>
      </div>

      <div className={styles.daypartGrid}>
        {items.map((item) => (
          <article key={item.key} className={`${styles.daypartCard} ${styles[`slotCard${capitalize(item.scoreClass)}`]}`}>
            <p className={styles.daypartLabel}>{item.label}</p>
            <p className={styles.scoreValue}>{item.score !== null ? item.score.toFixed(1) : "--"}</p>
            <p className={styles.slotMeta}>Best at {item.timeLabel}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function capitalize(value: "high" | "medium" | "low") {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
