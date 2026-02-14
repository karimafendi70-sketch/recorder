import styles from "../forecast.module.css";

type ForecastHeaderProps = {
  title: string;
  dayLabel: string;
  activeSpot: string;
  skillLevel: string;
  preferredRange: string;
  cleanPreference: string;
};

export function ForecastHeader({
  title,
  dayLabel,
  activeSpot,
  skillLevel,
  preferredRange,
  cleanPreference,
}: ForecastHeaderProps) {
  return (
    <header className={styles.headerCard}>
      <div className={styles.headerTopRow}>
        <div>
          <p className={styles.eyebrow}>Forecast</p>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.spotMeta}>
          <p>{activeSpot}</p>
          <p>{dayLabel}</p>
        </div>
      </div>

      <div className={styles.preferenceRow}>
        <span className={styles.preferencePill}>Skill: {skillLevel}</span>
        <span className={styles.preferencePill}>Range: {preferredRange}</span>
        <span className={styles.preferencePill}>{cleanPreference}</span>
      </div>
    </header>
  );
}
