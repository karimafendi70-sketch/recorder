/* ── Trip share: link + text builder ──────── */

import type { TripCombo } from "@/lib/trip/types";

export interface TripShareInput {
  rangeLabel: string;       // "15 jun – 22 jun"
  combos: TripCombo[];      // full list (we pick top-N)
  url: string;
  ratingLabel: (bucket: string) => string; // translator for rating bucket
}

const MAX_COMBOS = 5;

/**
 * Build a multi-line share text for a trip plan.
 */
export function buildTripShareText(input: TripShareInput): string {
  const lines: string[] = [];

  lines.push(`🗺️ FreeSurfCast Trip — ${input.rangeLabel}`);
  lines.push("");

  const top = input.combos.slice(0, MAX_COMBOS);

  top.forEach((c, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
    const rating = input.ratingLabel(c.ratingBucket);
    lines.push(
      `${medal} ${c.spotName} (${c.country}) — ${c.dayLabel}`,
    );
    lines.push(
      `   ⭐ ${c.avgScore.toFixed(1)} ${rating} · 🌊 ${c.sizeBand ?? ""}`,
    );
  });

  lines.push("");
  lines.push(input.url);

  return lines.join("\n");
}

/**
 * Build the shareable URL for a trip plan, preserving filters.
 */
export function buildTripShareUrl(
  startDate: string,
  endDate: string,
  region?: string,
  country?: string,
): string {
  if (typeof window === "undefined") return "";
  const base = window.location.origin;
  const params = new URLSearchParams();
  if (startDate) params.set("from", startDate);
  if (endDate) params.set("to", endDate);
  if (region) params.set("region", region);
  if (country) params.set("country", country);
  return `${base}/trip?${params.toString()}`;
}
