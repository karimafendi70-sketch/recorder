/* ──────────────────────────────────────────────
 *  FreeSurfCast – Lightweight first-party analytics
 *
 *  Privacy notice:
 *  This module logs aggregated, anonymous events
 *  for product-improvement purposes only.
 *  NO IP addresses, user-agents, cookies or
 *  user-identifiers are recorded. Only page paths,
 *  language codes, spot identifiers and timestamps.
 * ────────────────────────────────────────────── */

import type { Lang } from "@/app/translations";

/* ── Event types ─────────────────────────────── */

export type AnalyticsEvent =
  | { type: "page_view"; path: string; language: Lang; ts: string }
  | {
      type: "spot_selected";
      spotId: string;
      path: string;
      language: Lang;
      ts: string;
    }
  | { type: "language_changed"; from: Lang; to: Lang; ts: string };

const VALID_TYPES = new Set(["page_view", "spot_selected", "language_changed"]);

/**
 * Validate a raw analytics payload from the client.
 * Returns a typed event or null.
 */
export function parseAnalyticsBody(
  raw: Record<string, unknown>
): AnalyticsEvent | null {
  const eventType = String(raw.type ?? "");
  if (!VALID_TYPES.has(eventType)) return null;

  const ts = new Date().toISOString();

  switch (eventType) {
    case "page_view":
      return {
        type: "page_view",
        path: String(raw.path ?? "/").slice(0, 200),
        language: String(raw.language ?? "en").slice(0, 5) as Lang,
        ts,
      };
    case "spot_selected":
      if (!raw.spotId) return null;
      return {
        type: "spot_selected",
        spotId: String(raw.spotId).slice(0, 100),
        path: String(raw.path ?? "/").slice(0, 200),
        language: String(raw.language ?? "en").slice(0, 5) as Lang,
        ts,
      };
    case "language_changed":
      if (!raw.from || !raw.to) return null;
      return {
        type: "language_changed",
        from: String(raw.from).slice(0, 5) as Lang,
        to: String(raw.to).slice(0, 5) as Lang,
        ts,
      };
    default:
      return null;
  }
}

/**
 * Persist an analytics event.
 *
 * Current implementation: console.log with a prefix.
 * TODO: Replace with a database insert, file append, or
 *       external analytics endpoint when needed.
 */
export async function logEvent(event: AnalyticsEvent): Promise<void> {
  console.log("[analytics]", JSON.stringify(event));
}
