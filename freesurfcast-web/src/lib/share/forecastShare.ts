/* ── Forecast share: link + text builder ──────── */

export interface ForecastShareInput {
  spotName: string;
  country?: string;
  dayLabel: string;        // "Today" / "zo 15" etc.
  dateISO: string;         // YYYY-MM-DD
  avgScore: number;
  ratingLabel: string;     // translated rating ("Epic", "Goed", …)
  sizeBand?: string;       // translated size band
  bestWindowLabel?: string; // "06:00–09:00"
  windSummary?: string;    // "Offshore 8 kn ↗"
  swellSummary?: string;   // "1.8m @ 12s"
  surfaceSummary?: string; // "Clean"
  url: string;
}

/**
 * Build a short multi-line share text for a spot forecast day.
 * Designed for WhatsApp / Signal / copy-paste.
 */
export function buildForecastShareText(input: ForecastShareInput): string {
  const lines: string[] = [];

  // Header
  lines.push(`🏄 ${input.spotName}${input.country ? ` (${input.country})` : ""}`);
  lines.push(`📅 ${input.dayLabel}`);
  lines.push(`⭐ ${input.avgScore.toFixed(1)} — ${input.ratingLabel}`);

  // Conditions
  if (input.sizeBand) lines.push(`🌊 ${input.sizeBand}`);
  if (input.swellSummary) lines.push(`〰️ ${input.swellSummary}`);
  if (input.windSummary) lines.push(`💨 ${input.windSummary}`);
  if (input.surfaceSummary) lines.push(`✨ ${input.surfaceSummary}`);
  if (input.bestWindowLabel) lines.push(`⏰ ${input.bestWindowLabel}`);

  // Link
  lines.push("");
  lines.push(input.url);

  return lines.join("\n");
}

/**
 * Build the shareable URL for a spot forecast day.
 */
export function buildForecastShareUrl(
  spotId: string,
  dateKey: string,
): string {
  if (typeof window === "undefined") return "";
  const base = window.location.origin;
  return `${base}/spot/${spotId}/forecast?day=${dateKey}`;
}
