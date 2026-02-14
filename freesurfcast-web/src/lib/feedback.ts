/* ──────────────────────────────────────────────
 *  FreeSurfCast – Feedback types & helpers
 *
 *  Privacy: the only PII stored is the optional
 *  email field the user explicitly fills in.
 *  No IP, user-agent or user-id is recorded.
 * ────────────────────────────────────────────── */

export type FeedbackType = "idea" | "bug" | "question";

export interface FeedbackEntry {
  type: FeedbackType;
  message: string;
  /** Only present if the user voluntarily provides it. */
  email?: string;
  /** Page route where the form was submitted. */
  pagePath: string;
  /** Active UI language at time of submission. */
  language: string;
  /** Selected spot id, if on Forecast / Insights / Map. */
  spotId?: string;
  /** Server-assigned ISO timestamp. */
  ts: string;
}

/**
 * Validate the raw body from the client.
 * Returns a clean FeedbackEntry or null if invalid.
 */
export function parseFeedbackBody(
  raw: Record<string, unknown>
): FeedbackEntry | null {
  const validTypes: FeedbackType[] = ["idea", "bug", "question"];

  const type = String(raw.type ?? "").trim() as FeedbackType;
  const message = String(raw.message ?? "").trim();

  if (!validTypes.includes(type) || message.length === 0) return null;

  return {
    type,
    message: message.slice(0, 2000), // cap length
    email: raw.email ? String(raw.email).trim().slice(0, 200) : undefined,
    pagePath: String(raw.pagePath ?? "/").slice(0, 200),
    language: String(raw.language ?? "en").slice(0, 5),
    spotId: raw.spotId ? String(raw.spotId).slice(0, 100) : undefined,
    ts: new Date().toISOString(),
  };
}
