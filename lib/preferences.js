(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.FreeSurfLibPreferences = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function getDefaultUserPreferences(skillLevel = 'intermediate') {
    const normalizedSkill = ['beginner', 'intermediate', 'advanced'].includes(skillLevel)
      ? skillLevel
      : 'intermediate';

    const defaultsBySkill = {
      beginner: {
        skillLevel: 'beginner',
        preferredMinHeight: 0.6,
        preferredMaxHeight: 1.6,
        likesClean: true,
        canHandleChallenging: false,
        autoBeginnerFilter: true
      },
      intermediate: {
        skillLevel: 'intermediate',
        preferredMinHeight: 0.8,
        preferredMaxHeight: 2.2,
        likesClean: true,
        canHandleChallenging: false,
        autoBeginnerFilter: false
      },
      advanced: {
        skillLevel: 'advanced',
        preferredMinHeight: 1.2,
        preferredMaxHeight: 3.0,
        likesClean: false,
        canHandleChallenging: true,
        autoBeginnerFilter: false
      }
    };

    return {
      ...defaultsBySkill[normalizedSkill]
    };
  }

  function normalizeUserPreferences(rawPreferences) {
    const input = rawPreferences && typeof rawPreferences === 'object' ? rawPreferences : {};
    const base = getDefaultUserPreferences(input.skillLevel);

    const preferredMinHeight = Number.isFinite(input.preferredMinHeight)
      ? Math.max(0.3, Math.min(3.5, input.preferredMinHeight))
      : base.preferredMinHeight;
    const preferredMaxHeight = Number.isFinite(input.preferredMaxHeight)
      ? Math.max(0.5, Math.min(4.0, input.preferredMaxHeight))
      : base.preferredMaxHeight;

    return {
      skillLevel: base.skillLevel,
      preferredMinHeight: Math.min(preferredMinHeight, preferredMaxHeight - 0.1),
      preferredMaxHeight: Math.max(preferredMaxHeight, preferredMinHeight + 0.1),
      likesClean: typeof input.likesClean === 'boolean' ? input.likesClean : base.likesClean,
      canHandleChallenging: typeof input.canHandleChallenging === 'boolean'
        ? input.canHandleChallenging
        : base.canHandleChallenging,
      autoBeginnerFilter: typeof input.autoBeginnerFilter === 'boolean'
        ? input.autoBeginnerFilter
        : base.autoBeginnerFilter
    };
  }

  function getWaveRangeBoundsFromPreset(preset) {
    if (preset === 'small') {
      return { preferredMinHeight: 0.6, preferredMaxHeight: 1.6 };
    }
    if (preset === 'big') {
      return { preferredMinHeight: 1.2, preferredMaxHeight: 3.0 };
    }
    return { preferredMinHeight: 0.8, preferredMaxHeight: 2.2 };
  }

  function getWaveRangePresetForPreferences(preferences) {
    if (!preferences) return 'medium';
    if (preferences.preferredMaxHeight <= 1.8) return 'small';
    if (preferences.preferredMinHeight >= 1.1 || preferences.preferredMaxHeight >= 2.8) return 'big';
    return 'medium';
  }

  function saveUserPreferences(preferences, options = {}) {
    const storage = options.storage;
    const storageKey = options.storageKey;
    if (!storage || !storageKey) return false;

    try {
      storage.setItem(storageKey, JSON.stringify(normalizeUserPreferences(preferences)));
      return true;
    } catch {
      return false;
    }
  }

  function loadUserPreferences(options = {}) {
    const storage = options.storage;
    const storageKey = options.storageKey;

    if (!storage || !storageKey) {
      return getDefaultUserPreferences('intermediate');
    }

    try {
      const raw = storage.getItem(storageKey);
      if (!raw) {
        return getDefaultUserPreferences('intermediate');
      }

      return normalizeUserPreferences(JSON.parse(raw));
    } catch {
      return getDefaultUserPreferences('intermediate');
    }
  }

  return {
    getDefaultUserPreferences,
    normalizeUserPreferences,
    getWaveRangeBoundsFromPreset,
    getWaveRangePresetForPreferences,
    saveUserPreferences,
    loadUserPreferences
  };
});
