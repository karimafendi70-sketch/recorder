import styles from "../../spot.module.css";

/** Shimmer placeholder for the 16-day DayBar while loading. */
export function DayBarSkeleton() {
  return (
    <div className={styles.dayBarScroll} aria-busy="true">
      <div className={styles.dayBarTrack}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`${styles.dayBarCard} ${styles.skeleton}`}>
            <span className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
            <span className={`${styles.skeletonLine} ${styles.skeletonWide}`} />
            <span className={styles.skeletonStripe} />
          </div>
        ))}
      </div>
    </div>
  );
}
