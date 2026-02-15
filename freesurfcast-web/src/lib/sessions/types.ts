/* ── Surf Session data model ───────────────────
 *  Stored per-spot in localStorage.
 * ────────────────────────────────────────────── */

export interface SurfSession {
  id: string;
  spotId: string;
  /** ISO date — YYYY-MM-DD */
  date: string;
  /** HH:MM (24h) */
  startTime: string;
  /** Duration in minutes */
  durationMinutes: number;
  /** Board / equipment — free text */
  board: string;
  /** Personal rating 1–5 */
  rating: number;
  /** Free-form notes */
  notes: string;
  /** ISO datetime — when the entry was created */
  createdAt: string;
}

export interface SessionStats {
  totalSessions: number;
  avgRating: number | null;
  lastSessionDate: string | null;
  totalMinutes: number;
}
