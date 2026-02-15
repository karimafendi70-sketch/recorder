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

export function getSurfaceQuality(slot: SlotContext): SurfaceQuality {
  const merged = getMerged(slot);
  const windSpd = num(merged.windSpeedKnots, 0);
  const condition = slot.conditionTag ?? "mixed";
  const wind = getWindComfort(slot);

  // Glassy: very light wind or perfect offshore + low wind
  if (windSpd < 4) return "glassy";
  if (wind === "offshore" && windSpd < 10) return "glassy";

  // Clean: offshore/cross-off with moderate wind
  if ((wind === "offshore" || wind === "cross-off") && windSpd < 18) return "clean";
  if (condition === "clean" && windSpd < 14) return "clean";

  // Bumpy: moderate onshore or cross-shore
  if (windSpd < 20) return "bumpy";

  // Messy: strong wind or explicitly choppy
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
