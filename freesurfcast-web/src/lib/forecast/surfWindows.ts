/* ──────────────────────────────────────────────
 *  FreeSurfCast – Surf Windows
 *
 *  Groups consecutive high-scoring forecast slots
 *  into "surf windows": clear, actionable time
 *  blocks when conditions are best.
 *
 *  Works on top of the existing scoring pipeline
 *  without new API calls.
 * ────────────────────────────────────────────── */

import type { SlotContext, SlotQuality } from "@/lib/scores";

/* ── Public types ────────────────────────────── */

export interface SurfWindow {
  spotId: string;
  /** YYYY-MM-DD date of the window (first slot's dayKey) */
  dateKey: string;
  /** Window start (Date or ISO string proxy) */
  startHour: number;
  endHour: number;
  startLabel: string;
  endLabel: string;
  averageScore: number;
  peakScore: number;
  slotCount: number;
  /** Dominant wave height (m) across the window */
  waveHeight: number | null;
  /** Dominant wind direction (°) across the window */
  windDirection: number | null;
  /** Best condition tag in the window */
  condition: string;
  /** UI-friendly quality class */
  scoreClass: "high" | "medium" | "low";
}

export interface BuildSurfWindowsOptions {
  /** Minimum score (0-10) for a slot to be considered "good". */
  minScore: number;
  /** Minimum number of slots to form a window. */
  minSlots: number;
  /** Max gap in hours between slots to merge into one window. */
  maxGapHours: number;
  /** Maximum windows to return. */
  maxWindows: number;
}

/**
 * Defaults tuned for a 16-day forecast horizon.
 *
 * Goal: surface only 3–6 genuinely premium surf windows instead
 * of a long list of mediocre blocks.  The higher minScore (6.5)
 * eliminates "ok-ish" slots, tighter maxGapHours (4) prevents
 * merging across large lulls, and maxWindows (6) caps the list
 * so the user immediately sees "these are THE moments".
 *
 * TODO: consider making minScore user-adjustable (e.g. via
 * preferences) so advanced surfers can lower the bar.
 */
const DEFAULTS: BuildSurfWindowsOptions = {
  minScore: 6.5,
  minSlots: 2,
  maxGapHours: 4,
  maxWindows: 6,
};

/* ── Slot scoring interface ──────────────────── */

/**
 * A scored slot: the original SlotContext enriched with
 * score information and a time label.
 */
interface ScoredSlot {
  slot: SlotContext & { id?: string; timeLabel?: string; offsetHours?: number; dayKey?: string };
  quality: SlotQuality;
}

/* ── Builder ─────────────────────────────────── */

/**
 * Build surf windows for a single spot by grouping
 * consecutive high-scoring slots.
 *
 * @param slots  Forecast slots (must have offsetHours & mergedSpot)
 * @param spotId The spot these slots belong to
 * @param scoreFn A function that scores a SlotContext → SlotQuality
 * @param options Tuning knobs (all optional)
 */
export function buildSurfWindows(
  slots: (SlotContext & { id?: string; timeLabel?: string })[],
  spotId: string,
  scoreFn: (slot: SlotContext) => SlotQuality,
  options?: Partial<BuildSurfWindowsOptions>,
): SurfWindow[] {
  const opts = { ...DEFAULTS, ...options };

  // 1) Score every slot and filter by minScore
  const scored: ScoredSlot[] = [];
  for (const slot of slots) {
    const quality = scoreFn(slot);
    if (quality.score >= opts.minScore) {
      scored.push({ slot, quality });
    }
  }

  // Sort by offsetHours ascending
  scored.sort(
    (a, b) => (a.slot.offsetHours ?? 0) - (b.slot.offsetHours ?? 0),
  );

  if (scored.length === 0) return [];

  // 2) Group consecutive slots into windows
  const groups: ScoredSlot[][] = [];
  let currentGroup: ScoredSlot[] = [scored[0]];

  for (let i = 1; i < scored.length; i++) {
    const prev = currentGroup[currentGroup.length - 1];
    const prevHour = prev.slot.offsetHours ?? 0;
    const currHour = scored[i].slot.offsetHours ?? 0;

    if (currHour - prevHour <= opts.maxGapHours) {
      currentGroup.push(scored[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [scored[i]];
    }
  }
  groups.push(currentGroup);

  // 3) Filter groups that meet minimum slot count
  const validGroups = groups.filter((g) => g.length >= opts.minSlots);

  // 4) Convert groups → SurfWindow[], sorted by averageScore desc
  const windows: SurfWindow[] = validGroups.map((group) => {
    const scores = group.map((s) => s.quality.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const peakScore = Math.max(...scores);

    const startHour = group[0].slot.offsetHours ?? 0;
    const lastSlot = group[group.length - 1];
    const endHour = (lastSlot.slot.offsetHours ?? 0) + 4; // each slot covers ~4h

    const startLabel = group[0].slot.timeLabel ?? `${String(startHour % 24).padStart(2, "0")}:00`;
    const endLabel = `${String(endHour % 24).padStart(2, "0")}:00`;

    // Use the first slot's dayKey as the dateKey for this window
    const dateKey = group[0].slot.dayKey ?? "";

    // Aggregate wave height and wind direction from mergedSpot
    const waveHeights: number[] = [];
    const windDirs: number[] = [];
    const conditionTags: string[] = [];

    for (const s of group) {
      const merged = s.slot.mergedSpot ?? {};
      const wh = merged.golfHoogteMeter as number | undefined;
      const wd = merged.windDirectionDeg as number | undefined;
      if (wh != null) waveHeights.push(wh);
      if (wd != null) windDirs.push(wd);
      if (s.slot.conditionTag) conditionTags.push(s.slot.conditionTag);
    }

    const avgWave = waveHeights.length > 0
      ? Math.round((waveHeights.reduce((a, b) => a + b, 0) / waveHeights.length) * 10) / 10
      : null;

    const avgWind = windDirs.length > 0
      ? Math.round(windDirs.reduce((a, b) => a + b, 0) / windDirs.length)
      : null;

    // Best condition: clean > mixed > choppy
    const condPriority: Record<string, number> = { clean: 3, mixed: 2, choppy: 1 };
    const bestCond = conditionTags.sort(
      (a, b) => (condPriority[b] ?? 0) - (condPriority[a] ?? 0),
    )[0] ?? "mixed";

    const scoreClass: SurfWindow["scoreClass"] =
      avgScore >= 7 ? "high" : avgScore >= 4.5 ? "medium" : "low";

    return {
      spotId,
      dateKey,
      startHour,
      endHour,
      startLabel,
      endLabel,
      averageScore: Math.round(avgScore * 10) / 10,
      peakScore: Math.round(peakScore * 10) / 10,
      slotCount: group.length,
      waveHeight: avgWave,
      windDirection: avgWind,
      condition: bestCond,
      scoreClass,
    };
  });

  // Sort by averageScore descending; break ties by earliest start time
  windows.sort((a, b) => {
    const scoreDiff = b.averageScore - a.averageScore;
    if (scoreDiff !== 0) return scoreDiff;
    return a.startHour - b.startHour;
  });
  return windows.slice(0, opts.maxWindows);
}
