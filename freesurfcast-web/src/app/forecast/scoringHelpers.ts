import {
  getScoreClassSuffix,
  getSlotQualityScore,
  type SlotContext,
  type SlotQuality,
} from "@/lib/scores";
import type { UserPreferences } from "@/lib/preferences";

export function toNumeric(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getWindDegreesForSpot(spot: Record<string, unknown>) {
  return toNumeric(spot.windDirectionDeg);
}

export function getCoastOrientationDeg(spot: Record<string, unknown>) {
  return toNumeric(spot.coastOrientationDeg);
}

export function getWindRelativeToCoast(
  coastDeg: number | null,
  windDeg: number | null
): "offshore" | "onshore" | "cross" {
  if (coastDeg === null || windDeg === null) return "cross";
  const normalized = (((windDeg - coastDeg) % 360) + 360) % 360;
  if (normalized <= 45 || normalized >= 315) return "onshore";
  if (normalized >= 135 && normalized <= 225) return "offshore";
  return "cross";
}

export function buildSlotKey(slotContext: SlotContext) {
  const slot = slotContext as SlotContext & { id?: string };
  return slot.id ?? null;
}

export function getUiScoreClass(score: number): "high" | "medium" | "low" {
  const suffix = getScoreClassSuffix(score);
  if (suffix === "good") return "high";
  if (suffix === "ok") return "medium";
  return "low";
}

export function buildQualityOptions(prefs: UserPreferences) {
  return {
    filters: {
      minSurfable: true,
      beginnerFriendly: prefs.skillLevel === "beginner",
      preferClean: prefs.likesClean,
    },
    userPreferences: prefs,
    getWindDegreesForSpot,
    getCoastOrientationDeg,
    getWindRelativeToCoast,
  };
}

export function makeQualityForSlot(prefs: UserPreferences) {
  const opts = buildQualityOptions(prefs);
  return (slotContext: SlotContext): SlotQuality =>
    getSlotQualityScore(slotContext, opts);
}
