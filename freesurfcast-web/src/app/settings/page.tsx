"use client";

import { useLanguage, SUPPORTED_LANGS, LANG_LABELS, type Lang, type TranslationKey } from "@/app/LanguageProvider";
import { usePreferences } from "@/app/PreferencesProvider";
import { useAuth } from "@/app/AuthProvider";
import { getDefaultUserPreferences, type UserPreferences } from "@/lib/preferences";
import { useState } from "react";

/* ── Skill options ───────────────────────────── */

const SKILL_OPTIONS: { value: UserPreferences["skillLevel"]; labelKey: TranslationKey }[] = [
  { value: "beginner",     labelKey: "settings.skill.beginner" as TranslationKey },
  { value: "intermediate", labelKey: "settings.skill.intermediate" as TranslationKey },
  { value: "advanced",     labelKey: "settings.skill.advanced" as TranslationKey },
];

/* ── Component ───────────────────────────────── */

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const { preferences, setPreferences, isUsingDefaults } = usePreferences();
  const { user, logout } = useAuth();

  const [showAdvanced, setShowAdvanced] = useState(false);

  /* ── Handlers ──────────────────────────────── */

  function handleSkillChange(skill: UserPreferences["skillLevel"]) {
    setPreferences({ ...preferences, skillLevel: skill });
  }

  function handleToggle(key: keyof UserPreferences) {
    setPreferences({
      ...preferences,
      [key]: !preferences[key as keyof UserPreferences],
    } as UserPreferences);
  }

  function handleResetDefaults() {
    setPreferences(getDefaultUserPreferences("intermediate"));
  }

  return (
    <section className="stack-lg">
      <h1>{t("settings.title" as TranslationKey)}</h1>

      {/* ── Language ─────────────────────── */}
      <div className="settings-card">
        <h2>{t("settings.language" as TranslationKey)}</h2>
        <p className="settings-hint">{t("settings.languageHint" as TranslationKey)}</p>
        <div className="settings-row">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={`settings-pill ${lang === l ? "settings-pill-active" : ""}`}
              onClick={() => setLang(l)}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Surf preferences ─────────────── */}
      <div className="settings-card">
        <h2>{t("settings.surfPrefs" as TranslationKey)}</h2>

        {/* Skill level */}
        <div className="settings-field">
          <label className="settings-label">{t("settings.skillLevel" as TranslationKey)}</label>
          <div className="settings-row">
            {SKILL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`settings-pill ${preferences.skillLevel === opt.value ? "settings-pill-active" : ""}`}
                onClick={() => handleSkillChange(opt.value)}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Height range */}
        <div className="settings-field">
          <label className="settings-label">{t("settings.heightRange" as TranslationKey)}</label>
          <p className="settings-value">
            {preferences.preferredMinHeight?.toFixed(1) ?? "0.3"} –{" "}
            {preferences.preferredMaxHeight?.toFixed(1) ?? "2.0"} m
          </p>
        </div>

        {/* Toggles */}
        <div className="settings-field">
          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={preferences.likesClean ?? true}
              onChange={() => handleToggle("likesClean")}
            />
            <span>{t("settings.likesClean" as TranslationKey)}</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={preferences.canHandleChallenging ?? false}
              onChange={() => handleToggle("canHandleChallenging")}
            />
            <span>{t("settings.canHandleChallenging" as TranslationKey)}</span>
          </label>
        </div>

        {isUsingDefaults && (
          <p className="settings-defaults-hint">
            {t("settings.usingDefaults" as TranslationKey)}
          </p>
        )}
      </div>

      {/* ── Advanced ─────────────────────── */}
      <div className="settings-card">
        <button
          type="button"
          className="settings-advanced-toggle"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced ? "▾" : "▸"}{" "}
          {t("settings.advanced" as TranslationKey)}
        </button>

        {showAdvanced && (
          <div className="settings-advanced-content">
            <div className="settings-field">
              <label className="settings-toggle-row">
                <input
                  type="checkbox"
                  checked={preferences.autoBeginnerFilter ?? false}
                  onChange={() => handleToggle("autoBeginnerFilter")}
                />
                <span>{t("settings.autoBeginnerFilter" as TranslationKey)}</span>
              </label>
            </div>

            <button
              type="button"
              className="settings-reset-btn"
              onClick={handleResetDefaults}
            >
              {t("settings.resetDefaults" as TranslationKey)}
            </button>
          </div>
        )}
      </div>

      {/* ── Account ──────────────────────── */}
      <div className="settings-card">
        <h2>{t("settings.account" as TranslationKey)}</h2>
        {user ? (
          <div className="settings-row">
            <span className="settings-email">{user.email}</span>
            <button type="button" className="settings-pill" onClick={logout}>
              {t("nav.logout")}
            </button>
          </div>
        ) : (
          <p className="settings-hint">
            {t("settings.notLoggedIn" as TranslationKey)}
          </p>
        )}
      </div>
    </section>
  );
}
