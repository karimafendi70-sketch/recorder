import styles from "../insights.module.css";

type HeatmapCell = {
  score: number | null;
  scoreClass: "high" | "medium" | "low";
};

type HeatmapRowItem = {
  spotId: string;
  spotName: string;
  cells: Record<string, HeatmapCell>;
};

type DaypartHeatmapProps = {
  rows: HeatmapRowItem[];
  dayParts: string[];
};

export function DaypartHeatmap({ rows, dayParts }: DaypartHeatmapProps) {
  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Daypart heatmap</h2>
        <p>Score per spot &times; daypart</p>
      </div>

      <div className={styles.heatmapWrap}>
        <table className={styles.heatmapTable}>
          <thead>
            <tr>
              <th className={styles.heatmapCorner}>Spot</th>
              {dayParts.map((part) => (
                <th key={part} className={styles.heatmapColHeader}>
                  {part}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.spotId}>
                <td className={styles.heatmapRowHeader}>{row.spotName}</td>
                {dayParts.map((part) => {
                  const cell = row.cells[part];
                  const score = cell?.score;
                  return (
                    <td
                      key={`${row.spotId}-${part}`}
                      className={`${styles.heatmapCell} ${cell ? styles[`cell${capitalize(cell.scoreClass)}`] : ""}`}
                    >
                      {score !== null && score !== undefined ? score.toFixed(1) : "–"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
