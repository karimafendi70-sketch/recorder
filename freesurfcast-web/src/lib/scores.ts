import type { UserPreferences } from "./preferences";

export type Filters = {
  minSurfable: boolean;
  beginnerFriendly: boolean;
  preferClean: boolean;
};

export type ScoreBreakdown = {
  base: number;
  conditionTag: number;
  waveHeightRange: number;
  wavePeriod: number;
  windDirection: number;
  challengingPenalty: number;
  tideEffect: number;
  filtersPreference: number;
  preferencesImpact: number;
};

export type SlotQuality = {
  score: number;
  reasons: string[];
  breakdown: ScoreBreakdown;
  rawScore: number;
};

export type SlotContext = {
  dayKey?: string;
  offsetHours?: number;
  conditionTag?: "clean" | "mixed" | "choppy" | string;
  challenging?: boolean;
  tideSuitability?: "good" | "less-ideal" | string | null;
  minSurfable?: boolean;
  mergedSpot?: Record<string, unknown>;
  values?: Record<string, unknown>;
};

type ScoreDeps = {
  getWindDegreesForSpot: (spot: Record<string, unknown>) => number | null;
  getCoastOrientationDeg: (spot: Record<string, unknown>) => number | null;
  getWindRelativeToCoast: (coastDeg: number | null, windDeg: number | null) => "offshore" | "onshore" | "cross" | string;
};

function emptyQuality(): SlotQuality {
  return {
    score: 0,
    reasons: [],
    breakdown: {
      base: 0,
      conditionTag: 0,
      waveHeightRange: 0,
      wavePeriod: 0,
      windDirection: 0,
      challengingPenalty: 0,
      tideEffect: 0,
      filtersPreference: 0,
      preferencesImpact: 0,
    },
    rawScore: 0,
  };
}

export function getSlotQualityScore(
  slotContext: SlotContext | null | undefined,
  options: {
    filters?: Partial<Filters>;
    userPreferences?: UserPreferences | null;
  } & Partial<ScoreDeps> = {}
): SlotQuality {
  if (!slotContext) return emptyQuality();

  const filters: Filters = {
    minSurfable: Boolean(options.filters?.minSurfable),
    beginnerFriendly: Boolean(options.filters?.beginnerFriendly),
    preferClean: Boolean(options.filters?.preferClean),
  };

  const userPreferences = options.userPreferences ?? null;
  const getWindDegreesForSpot = options.getWindDegreesForSpot;
  const getCoastOrientationDeg = options.getCoastOrientationDeg;
  const getWindRelativeToCoast = options.getWindRelativeToCoast;

  if (!getWindDegreesForSpot || !getCoastOrientationDeg || !getWindRelativeToCoast) return emptyQuality();

  let score = 0;
  const reasons: string[] = [];
  const breakdown: ScoreBreakdown = {
    base: 0,
    conditionTag: 0,
    waveHeightRange: 0,
    wavePeriod: 0,
    windDirection: 0,
    challengingPenalty: 0,
    tideEffect: 0,
    filtersPreference: 0,
    preferencesImpact: 0,
  };

  const spotValues = (slotContext.mergedSpot ?? slotContext.values ?? {}) as Record<string, unknown>;
  const waveHeight = Number(spotValues.golfHoogteMeter);
  const wavePeriod = Number(spotValues.golfPeriodeSeconden);

  if (slotContext.conditionTag === "clean") {
    score += 3;
    breakdown.conditionTag += 3;
    reasons.push("clean");
  } else if (slotContext.conditionTag === "mixed") {
    score += 1;
    breakdown.conditionTag += 1;
    reasons.push("mixed");
  } else {
    reasons.push("choppy");
  }

  if (Number.isFinite(waveHeight)) {
    if (waveHeight >= 0.9 && waveHeight <= 2.0) {
      score += 2;
      breakdown.waveHeightRange += 2;
      reasons.push("good-wave-height");
    } else if (waveHeight >= 0.7 && waveHeight <= 2.4) {
      score += 1;
      breakdown.waveHeightRange += 1;
      reasons.push("acceptable-wave-height");
    } else if (waveHeight > 2.8) {
      score -= 1;
      breakdown.waveHeightRange -= 1;
      reasons.push("heavy-wave-height");
    }
  }

  if (Number.isFinite(wavePeriod) && wavePeriod >= 8) {
    score += 1;
    breakdown.wavePeriod += 1;
    reasons.push("good-period");
  }

  const windDegrees = getWindDegreesForSpot(spotValues);
  const coastOrientation = getCoastOrientationDeg(spotValues);
  const windRelative = getWindRelativeToCoast(coastOrientation, windDegrees);

  if (windRelative === "offshore") {
    score += 1;
    breakdown.windDirection += 1;
    reasons.push("offshore");
  } else if (windRelative === "onshore") {
    score -= 1;
    breakdown.windDirection -= 1;
    reasons.push("onshore");
  } else {
    reasons.push("cross");
  }

  if (slotContext.challenging) {
    score -= 2;
    breakdown.challengingPenalty -= 2;
    reasons.push("challenging");
  }

  if (slotContext.tideSuitability === "good") {
    score += 1;
    breakdown.tideEffect += 1;
    reasons.push("tide-supportive");
  } else if (slotContext.tideSuitability === "less-ideal") {
    score -= 1;
    breakdown.tideEffect -= 1;
    reasons.push("tide-less-ideal");
  }

  if (filters.minSurfable && !slotContext.minSurfable) {
    score -= 2;
    breakdown.filtersPreference -= 2;
    reasons.push("below-min-surfable-filter");
  }

  if (filters.beginnerFriendly && slotContext.challenging) {
    score -= 3;
    breakdown.filtersPreference -= 3;
    reasons.push("beginner-filter-penalty");
  }

  if (filters.preferClean) {
    if (slotContext.conditionTag === "clean") {
      score += 1;
      breakdown.filtersPreference += 1;
      reasons.push("clean-preference-bonus");
    } else if (slotContext.conditionTag === "choppy") {
      score -= 2;
      breakdown.filtersPreference -= 2;
      reasons.push("clean-preference-penalty");
    }
  }

  if (userPreferences) {
    if (Number.isFinite(waveHeight)) {
      if (waveHeight >= userPreferences.preferredMinHeight && waveHeight <= userPreferences.preferredMaxHeight) {
        score += 0.5;
        breakdown.preferencesImpact += 0.5;
        reasons.push("prefs-range-match");
      } else if (waveHeight > userPreferences.preferredMaxHeight + 0.6) {
        score -= 0.5;
        breakdown.preferencesImpact -= 0.5;
        reasons.push("prefs-range-too-big");
      } else if (waveHeight < userPreferences.preferredMinHeight - 0.4) {
        score -= 0.5;
        breakdown.preferencesImpact -= 0.5;
        reasons.push("prefs-range-too-small");
      }
    }

    if (userPreferences.likesClean) {
      if (slotContext.conditionTag === "clean") {
        score += 0.5;
        breakdown.preferencesImpact += 0.5;
        reasons.push("prefs-clean-bonus");
      } else if (slotContext.conditionTag === "choppy") {
        score -= 0.5;
        breakdown.preferencesImpact -= 0.5;
        reasons.push("prefs-clean-penalty");
      }
    }

    if (!userPreferences.canHandleChallenging && slotContext.challenging) {
      score -= 0.5;
      breakdown.preferencesImpact -= 0.5;
      reasons.push("prefs-challenging-penalty");
    }
  }

  const rawScore = score;
  return {
    score: Math.max(0, Math.min(10, rawScore)),
    reasons,
    breakdown,
    rawScore,
  };
}

export function getSpotDayScore<TSpot>(
  spot: TSpot | null | undefined,
  dayKey: string,
  allSlotContextsForSpotAndDay: SlotContext[],
  options: {
    useActiveFilters?: boolean;
    passesHardConditionFilters: (slotContext: SlotContext) => boolean;
    getScore: (slotContext: SlotContext) => SlotQuality;
    buildSlotKey: (slotContext: SlotContext) => string | null;
    getSpotKey: (spot: TSpot) => string;
  }
) {
  if (!spot || !dayKey || !Array.isArray(allSlotContextsForSpotAndDay) || !allSlotContextsForSpotAndDay.length) {
    return null;
  }

  const filteredSlots = allSlotContextsForSpotAndDay
    .filter((slotContext) => slotContext?.dayKey === dayKey)
    .filter((slotContext) => (options.useActiveFilters !== false ? options.passesHardConditionFilters(slotContext) : true));

  if (!filteredSlots.length) return null;

  const scoredSlots = filteredSlots
    .map((slotContext) => {
      const quality = options.getScore(slotContext);
      return { slotContext, score: quality.score, reasons: quality.reasons };
    })
    .sort((left, right) => right.score - left.score);

  const best = scoredSlots[0];
  const secondary = scoredSlots[1] ?? best;
  const aggregateScore = Math.round((((best.score + secondary.score) / 2) + Number.EPSILON) * 10) / 10;

  return {
    spotId: options.getSpotKey(spot),
    spot,
    dayKey,
    score: aggregateScore,
    bestSlotKey: options.buildSlotKey(best.slotContext),
    bestSlotOffset: best.slotContext.offsetHours,
    bestSlotContext: best.slotContext,
    reasons: best.reasons,
  };
}

export function getScoreClassSuffix(score: number): "neutral" | "good" | "ok" | "poor" {
  if (!Number.isFinite(score)) return "neutral";
  if (score >= 7) return "good";
  if (score >= 4.5) return "ok";
  return "poor";
}
