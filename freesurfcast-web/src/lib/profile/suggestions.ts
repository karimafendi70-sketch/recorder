/* ── Alert suggestion engine ─────────────────── */

import type { SpotAlertProfile, RatingBucket, SizeBand } from "@/lib/alerts/types";
import { RATING_ORDER, SIZE_ORDER } from "@/lib/alerts/types";
import type { ProfileInsights, AlertSuggestion } from "./types";

/**
 * Generate concrete alert adjustment suggestions from profile insights.
 * Returns an array of suggestions the user can accept/reject.
 */
export function suggestAlertChanges(
  insights: ProfileInsights,
  currentProfile: SpotAlertProfile | null,
): AlertSuggestion[] {
  const suggestions: AlertSuggestion[] = [];

  if (insights.totalSessions < 3) return suggestions;

  // ── Rating suggestion ──
  // If user consistently rates sessions 4+ at certain conditions,
  // suggest lowering the alert threshold to catch more sessions
  if (insights.preferredRatingBuckets.length > 0) {
    const bestBucket = insights.preferredRatingBuckets[0].bucket;
    const bestIdx = RATING_ORDER.indexOf(bestBucket);
    // Suggest one level below the preferred bucket for wider alerts
    const suggestedIdx = Math.max(0, bestIdx - 1);
    const suggestedBucket = RATING_ORDER[suggestedIdx];

    const currentIdx = currentProfile
      ? RATING_ORDER.indexOf(currentProfile.minRatingBucket)
      : RATING_ORDER.indexOf("fairToGood");

    if (suggestedIdx !== currentIdx) {
      suggestions.push({
        labelKey: suggestedIdx < currentIdx
          ? "profile.alertSuggest.lowerRating"
          : "profile.alertSuggest.raiseRating",
        field: "minRatingBucket",
        value: suggestedBucket,
        confidence: Math.min(1, insights.preferredRatingBuckets[0].score / 2),
      });
    }
  }

  // ── Size band suggestions ──
  if (insights.preferredSizeBands.length > 0) {
    const preferred = insights.preferredSizeBands.map((p) => p.sizeBand);
    const minPreferred = preferred.reduce(
      (min, band) => (SIZE_ORDER.indexOf(band) < SIZE_ORDER.indexOf(min) ? band : min),
      preferred[0],
    );
    const maxPreferred = preferred.reduce(
      (max, band) => (SIZE_ORDER.indexOf(band) > SIZE_ORDER.indexOf(max) ? band : max),
      preferred[0],
    );

    const currentMin = currentProfile?.minSizeBand ?? "waist";
    const currentMax = currentProfile?.maxSizeBand ?? "overhead";

    if (minPreferred !== currentMin) {
      suggestions.push({
        labelKey: "profile.alertSuggest.adjustMinSize",
        field: "minSizeBand",
        value: minPreferred,
        confidence: Math.min(1, insights.preferredSizeBands[0].score / 2),
      });
    }
    if (maxPreferred !== currentMax) {
      suggestions.push({
        labelKey: "profile.alertSuggest.adjustMaxSize",
        field: "maxSizeBand",
        value: maxPreferred,
        confidence: Math.min(1, insights.preferredSizeBands[0].score / 2),
      });
    }
  }

  // ── Offshore preference ──
  if (insights.windPreference.offshoreScore > 0.5) {
    const currentPref = currentProfile?.preferOffshore ?? false;
    if (!currentPref) {
      suggestions.push({
        labelKey: "profile.alertSuggest.enableOffshore",
        field: "preferOffshore",
        value: true,
        confidence: Math.min(1, insights.windPreference.offshoreScore),
      });
    }
  }

  return suggestions;
}

/**
 * Apply a suggestion to an existing alert profile, returning a new copy.
 */
export function applySuggestion(
  profile: SpotAlertProfile,
  suggestion: AlertSuggestion,
): SpotAlertProfile {
  const updated = { ...profile };
  switch (suggestion.field) {
    case "minRatingBucket":
      updated.minRatingBucket = suggestion.value as RatingBucket;
      break;
    case "minSizeBand":
      updated.minSizeBand = suggestion.value as SizeBand;
      break;
    case "maxSizeBand":
      updated.maxSizeBand = suggestion.value as SizeBand;
      break;
    case "preferOffshore":
      updated.preferOffshore = suggestion.value as boolean;
      break;
  }
  return updated;
}
