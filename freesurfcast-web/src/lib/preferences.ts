export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type UserPreferences = {
  skillLevel: SkillLevel;
  preferredMinHeight: number;
  preferredMaxHeight: number;
  likesClean: boolean;
  canHandleChallenging: boolean;
  autoBeginnerFilter: boolean;
};

export function getDefaultUserPreferences(skillLevel: SkillLevel | string = "intermediate"): UserPreferences {
  const normalizedSkill: SkillLevel = ["beginner", "intermediate", "advanced"].includes(skillLevel)
    ? (skillLevel as SkillLevel)
    : "intermediate";

  const defaultsBySkill: Record<SkillLevel, UserPreferences> = {
    beginner: {
      skillLevel: "beginner",
      preferredMinHeight: 0.6,
      preferredMaxHeight: 1.6,
      likesClean: true,
      canHandleChallenging: false,
      autoBeginnerFilter: true,
    },
    intermediate: {
      skillLevel: "intermediate",
      preferredMinHeight: 0.8,
      preferredMaxHeight: 2.2,
      likesClean: true,
      canHandleChallenging: false,
      autoBeginnerFilter: false,
    },
    advanced: {
      skillLevel: "advanced",
      preferredMinHeight: 1.2,
      preferredMaxHeight: 3.0,
      likesClean: false,
      canHandleChallenging: true,
      autoBeginnerFilter: false,
    },
  };

  return { ...defaultsBySkill[normalizedSkill] };
}

export function normalizeUserPreferences(rawPreferences: unknown): UserPreferences {
  const input = rawPreferences && typeof rawPreferences === "object"
    ? (rawPreferences as Partial<UserPreferences>)
    : {};
  const base = getDefaultUserPreferences(input.skillLevel);

  const preferredMinHeight = Number.isFinite(input.preferredMinHeight)
    ? Math.max(0.3, Math.min(3.5, Number(input.preferredMinHeight)))
    : base.preferredMinHeight;
  const preferredMaxHeight = Number.isFinite(input.preferredMaxHeight)
    ? Math.max(0.5, Math.min(4.0, Number(input.preferredMaxHeight)))
    : base.preferredMaxHeight;

  return {
    skillLevel: base.skillLevel,
    preferredMinHeight: Math.min(preferredMinHeight, preferredMaxHeight - 0.1),
    preferredMaxHeight: Math.max(preferredMaxHeight, preferredMinHeight + 0.1),
    likesClean: typeof input.likesClean === "boolean" ? input.likesClean : base.likesClean,
    canHandleChallenging: typeof input.canHandleChallenging === "boolean"
      ? input.canHandleChallenging
      : base.canHandleChallenging,
    autoBeginnerFilter: typeof input.autoBeginnerFilter === "boolean"
      ? input.autoBeginnerFilter
      : base.autoBeginnerFilter,
  };
}

export function getWaveRangeBoundsFromPreset(preset: string): Pick<UserPreferences, "preferredMinHeight" | "preferredMaxHeight"> {
  if (preset === "small") return { preferredMinHeight: 0.6, preferredMaxHeight: 1.6 };
  if (preset === "big") return { preferredMinHeight: 1.2, preferredMaxHeight: 3.0 };
  return { preferredMinHeight: 0.8, preferredMaxHeight: 2.2 };
}

export function getWaveRangePresetForPreferences(preferences?: Pick<UserPreferences, "preferredMinHeight" | "preferredMaxHeight"> | null): "small" | "medium" | "big" {
  if (!preferences) return "medium";
  if (preferences.preferredMaxHeight <= 1.8) return "small";
  if (preferences.preferredMinHeight >= 1.1 || preferences.preferredMaxHeight >= 2.8) return "big";
  return "medium";
}

export type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

export function saveUserPreferences(
  preferences: unknown,
  options: { storage?: StorageAdapter; storageKey?: string } = {}
): boolean {
  const { storage, storageKey } = options;
  if (!storage || !storageKey) return false;

  try {
    storage.setItem(storageKey, JSON.stringify(normalizeUserPreferences(preferences)));
    return true;
  } catch {
    return false;
  }
}

export function loadUserPreferences(options: { storage?: Pick<Storage, "getItem">; storageKey?: string } = {}): UserPreferences {
  const { storage, storageKey } = options;
  if (!storage || !storageKey) return getDefaultUserPreferences("intermediate");

  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return getDefaultUserPreferences("intermediate");
    return normalizeUserPreferences(JSON.parse(raw));
  } catch {
    return getDefaultUserPreferences("intermediate");
  }
}
