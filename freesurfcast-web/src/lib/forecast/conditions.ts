/* ──────────────────────────────────────────────
 *  Condition Indicators
 *
 *  Professional labels derived from raw slot data:
 *    • WindComfort  – offshore / cross-off / cross-shore / onshore / light-variable
 *    • SizeBand    – tiny / knee / waist / shoulder / head / overhead
 *    • SurfaceQuality – glassy / clean / bumpy / messy
 *
 *  Each indicator comes with an i18n key so the UI
 *  can render localised labels.
 * ────────────────────────────────────────────── */

import type { SlotContext } from "@/lib/scores";

/* ── Type definitions ────────────────────────── */

export type WindComfort =
  | "offshore"
  | "cross-off"
  | "cross-shore"
  | "onshore"
  | "light-variable";

export type SizeBand =
  | "tiny"
  | "knee"
  | "waist"
  | "shoulder"
  | "head"
  | "overhead";

export type SurfaceQuality =
  | "glassy"
  | "clean"
  | "bumpy"
  | "messy";

export interface ConditionSummary {
  wind: WindComfort;
  size: SizeBand;
  surface: SurfaceQuality;
  /** Pre-computed i18n key for each indicator */
  windKey: `cond.wind.${WindComfort}`;
  sizeKey: `cond.size.${SizeBand}`;
  surfaceKey: `cond.surface.${SurfaceQuality}`;
}

/* ── Helpers ──────────────────────────────────── */

function getMerged(slot: SlotContext): Record<string, unknown> {
  return (slot.mergedSpot ?? {}) as Record<string, unknown>;
}

function num(value: unknown, fallback: number): number {
  return typeof value === "number" ? value : fallback;
}

/* ── Wind comfort ────────────────────────────── */

export function getWindComfort(slot: SlotContext): WindComfort {
  const merged = getMerged(slot);
  const windDeg = num(merged.windDirectionDeg, -1);
  const coastDeg = num(merged.coastOrientationDeg, -1);
  const windSpd = num(merged.windSpeedKnots, 0);

  // Light / variable wind → special case
  if (windSpd < 5) return "light-variable";

  if (windDeg < 0 || coastDeg < 0) return "cross-shore";

  const diff = (((windDeg - coastDeg) % 360) + 360) % 360;

  // Offshore: blowing from land out to sea (150-210°)
  if (diff >= 150 && diff <= 210) return "offshore";
  // Cross-offshore (110-150° or 210-250°)
  if ((diff >= 110 && diff < 150) || (diff > 210 && diff <= 250)) return "cross-off";
  // Onshore: blowing straight onto shore (0-30° or 330-360°)
  if (diff <= 30 || diff >= 330) return "onshore";
  // Everything else is cross-shore
  return "cross-shore";
}

/* ── Size band ───────────────────────────────── */

export function getSizeBand(slot: SlotContext): SizeBand {
  const merged = getMerged(slot);
  const height = num(merged.golfHoogteMeter, 0);

  if (height < 0.3) return "tiny";
  if (height < 0.6) return "knee";
  if (height < 1.0) return "waist";
  if (height < 1.5) return "shoulder";
  if (height < 2.0) return "head";
  return "overhead";
}

/* ── Surface quality ─────────────────────────── */

/**
 * Derive surface quality from wind comfort + wind speed.
 *
 * Thresholds (knots) — tune these constants to adjust:
 *   GLASSY_MAX    =  4 kn  (near-calm cutoff for any direction)
 *   GLASSY_OFF    =  8 kn  (offshore-only glassy ceiling)
 *   CLEAN_OFF_MAX = 14 kn  (offshore / cross-off stays clean)
 *   CLEAN_GEN_MAX = 10 kn  (general "clean" ceiling when tag = clean)
 *   BUMPY_MAX     = 18 kn  (cross-shore / light-onshore upper bound)
 *   > BUMPY_MAX + onshore  → messy
 *
 * TODO: consider swell period as an extra input — long-period
 * swell can keep a surface cleaner even in moderate wind.
 */
export function getSurfaceQuality(slot: SlotContext): SurfaceQuality {
  const merged = getMerged(slot);
  const windSpd = num(merged.windSpeedKnots, 0);
  const condition = slot.conditionTag ?? "mixed";
  const wind = getWindComfort(slot);

  /* ── Thresholds (knots) ── */
  const GLASSY_MAX    =  4;  // any direction: near-calm
  const GLASSY_OFF    =  8;  // offshore only: still glassy
  const CLEAN_OFF_MAX = 14;  // offshore / cross-off: clean ceiling
  const CLEAN_GEN_MAX = 10;  // general clean (when conditionTag = clean)
  const BUMPY_MAX     = 18;  // hard ceiling before messy (onshore)

  // ── Glassy: very light wind, or light offshore ──
  if (windSpd < GLASSY_MAX) return "glassy";
  if ((wind === "offshore" || wind === "light-variable") && windSpd < GLASSY_OFF) return "glassy";

  // ── Clean: offshore / cross-off with low-to-moderate wind ──
  if ((wind === "offshore" || wind === "cross-off") && windSpd < CLEAN_OFF_MAX) return "clean";
  if (condition === "clean" && windSpd < CLEAN_GEN_MAX) return "clean";

  // ── Bumpy: cross-shore at moderate wind, or onshore below threshold ──
  if (wind === "cross-shore" && windSpd < BUMPY_MAX) return "bumpy";
  if (wind === "cross-off"   && windSpd < BUMPY_MAX) return "bumpy";
  if (wind === "onshore"     && windSpd < BUMPY_MAX) return "bumpy";
  if (wind === "light-variable") return "bumpy";           // light but mixed direction
  if (wind === "offshore" && windSpd < BUMPY_MAX) return "bumpy";

  // ── Messy: only when clearly onshore + strong wind ──
  return "messy";
}

/* ── Combined summary ────────────────────────── */

export function summarizeConditions(slot: SlotContext): ConditionSummary {
  const wind = getWindComfort(slot);
  const size = getSizeBand(slot);
  const surface = getSurfaceQuality(slot);

  return {
    wind,
    size,
    surface,
    windKey: `cond.wind.${wind}`,
    sizeKey: `cond.size.${size}`,
    surfaceKey: `cond.surface.${surface}`,
  };
}
