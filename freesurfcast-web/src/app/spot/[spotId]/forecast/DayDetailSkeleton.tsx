import styles from "../../spot.module.css";

/** Shimmer placeholder for DayDetailPanel + ProGraphsSection while loading. */
export function DayDetailSkeleton() {
  return (
    <div className={styles.dayDetail} aria-busy="true">
      {/* Day header skeleton */}
      <div className={styles.dayHeader}>
        <span className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
        <span className={`${styles.skeletonLine} ${styles.skeletonWide}`} />
        <span className={`${styles.skeletonPill}`} />
      </div>

      {/* Rating row skeleton */}
      <div className={styles.ratingRow}>
        <span className={`${styles.skeletonDot}`} />
        <span className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
      </div>

      {/* Timeline skeleton */}
      <div className={styles.timelineWrap}>
        <div className={`${styles.timelineTrack} ${styles.skeleton}`} />
      </div>

      {/* Pro blocks skeleton */}
      <section className={styles.proBlocks}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${styles.proCard} ${styles.skeleton}`}>
            <span className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
            <span className={`${styles.skeletonLine} ${styles.skeletonWide}`} />
            <span className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
          </div>
        ))}
      </section>

      {/* Pro graphs skeleton */}
      <section className={styles.proGraphsSection}>
        <span className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
        <div className={styles.proGraphsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.proGraphCard} ${styles.skeleton}`}>
              <span className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
              <span className={`${styles.skeletonBlock}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
