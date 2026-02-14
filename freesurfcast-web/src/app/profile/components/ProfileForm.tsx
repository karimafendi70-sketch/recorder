"use client";

import { useCallback, useState } from "react";
import {
  getWaveRangeBoundsFromPreset,
  getWaveRangePresetForPreferences,
  type SkillLevel,
  type UserPreferences,
} from "@/lib/preferences";
import { usePreferences } from "../../PreferencesProvider";
import styles from "../profile.module.css";

const SKILL_OPTIONS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const WAVE_PRESETS: { value: string; label: string; hint: string }[] = [
  { value: "small", label: "Smaller waves", hint: "0.6 – 1.6 m" },
  { value: "medium", label: "Medium range", hint: "0.8 – 2.2 m" },
  { value: "big", label: "Bigger waves", hint: "1.2 – 3.0 m" },
];

const CONDITION_TOGGLES: { key: keyof Pick<UserPreferences, "likesClean" | "canHandleChallenging" | "autoBeginnerFilter">; label: string; hint: string }[] = [
  { key: "likesClean", label: "Prefer clean conditions", hint: "Score lower when conditions are choppy or messy" },
  { key: "canHandleChallenging", label: "Comfortable with challenging conditions", hint: "Don't penalise strong currents or offshore wind" },
  { key: "autoBeginnerFilter", label: "Auto-balance for beginner safety", hint: "Filter out spots that exceed safe thresholds" },
];

export function ProfileForm() {
  const { preferences, setPreferences } = usePreferences();
  const [prefs, setPrefs] = useState<UserPreferences>(preferences);
  const [saved, setSaved] = useState(false);

  /* ── Derived wave preset ─────────────────── */
  const wavePreset = getWaveRangePresetForPreferences(prefs);

  /* ── Handlers ────────────────────────────── */
  const updateField = useCallback(<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleSkillChange = useCallback(
    (level: SkillLevel) => {
      setPrefs((prev) => {
        return { ...prev, skillLevel: level, ...getWaveRangeBoundsFromPreset(getWaveRangePresetForPreferences(prev)) };
      });
      setSaved(false);
    },
    []
  );

  const handleWavePreset = useCallback(
    (preset: string) => {
      const bounds = getWaveRangeBoundsFromPreset(preset);
      setPrefs((prev) => ({ ...prev, ...bounds }));
      setSaved(false);
    },
    []
  );

  const handleSave = useCallback(() => {
    setPreferences(prefs);
    setSaved(true);
  }, [prefs, setPreferences]);

  return (
    <>
      {/* ── Skill level ────────────────────── */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Skill level</h2>
        <p className={styles.sectionDesc}>Affects default wave range and safety filters.</p>

        <div className={styles.radioGroup}>
          {SKILL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`${styles.radioLabel} ${prefs.skillLevel === opt.value ? styles.radioLabelActive : ""}`}
            >
              <input
                type="radio"
                name="skillLevel"
                value={opt.value}
                checked={prefs.skillLevel === opt.value}
                onChange={() => handleSkillChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      {/* ── Wave preferences ───────────────── */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Wave preferences</h2>
        <p className={styles.sectionDesc}>Choose the wave height range you&apos;re most comfortable with.</p>

        <div className={styles.pillGroup}>
          {WAVE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={`${styles.pill} ${wavePreset === preset.value ? styles.pillActive : ""}`}
              onClick={() => handleWavePreset(preset.value)}
            >
              {preset.label}
              <span className={styles.pillHint}>{preset.hint}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Condition toggles ──────────────── */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Conditions</h2>
        <p className={styles.sectionDesc}>Fine-tune how the scoring engine evaluates surf conditions.</p>

        <div className={styles.toggleList}>
          {CONDITION_TOGGLES.map((toggle) => (
            <div key={toggle.key} className={styles.toggleRow}>
              <div className={styles.toggleText}>
                <span className={styles.toggleLabel}>{toggle.label}</span>
                <span className={styles.toggleHint}>{toggle.hint}</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={prefs[toggle.key]}
                  onChange={(e) => updateField(toggle.key, e.target.checked)}
                />
                <span className={styles.toggleTrack} />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* ── Save bar ───────────────────────── */}
      <div className={styles.saveBar}>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save preferences
        </button>
        {saved && <span className={styles.savedBadge}>✓ Preferences saved</span>}
      </div>
    </>
  );
}
