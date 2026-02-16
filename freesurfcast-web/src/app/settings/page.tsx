"use client";

import { useLanguage, SUPPORTED_LANGS, LANG_LABELS, type TranslationKey } from "@/app/LanguageProvider";
import { useUiPreferences, type UiPreferences } from "@/app/UiPreferencesProvider";
import { useFeatureFlags, type FeatureFlags } from "@/app/FeatureFlagsProvider";
import { useAuth } from "@/app/AuthProvider";

/* ── Toggle row helper ───────────────────────── */

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="settings-field">
      <label className="settings-toggle-row">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(!checked)}
        />
        <span className="settings-toggle-text">
          <span>{label}</span>
          {description && <span className="settings-toggle-desc">{description}</span>}
        </span>
      </label>
    </div>
  );
}

/* ── Component ───────────────────────────────── */

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const { uiPrefs, toggleUiPref } = useUiPreferences();
  const { flags, toggleFlag } = useFeatureFlags();
  const { user, logout } = useAuth();

  return (
    <section className="stack-lg">
      <h1>{t("settings.title" as TranslationKey)}</h1>

      {/* ── Interface ────────────────────── */}
      <div className="settings-card">
        <h2>{t("settings.ui.title" as TranslationKey)}</h2>
        <p className="settings-hint">{t("settings.ui.description" as TranslationKey)}</p>

        <ToggleRow
          label={t("settings.ui.proDetails" as TranslationKey)}
          description={t("settings.ui.proDetails.description" as TranslationKey)}
          checked={uiPrefs.proDetailsDefaultOpen}
          onChange={() => toggleUiPref("proDetailsDefaultOpen")}
        />

        <ToggleRow
          label={t("settings.ui.dayStrip" as TranslationKey)}
          description={t("settings.ui.dayStrip.description" as TranslationKey)}
          checked={uiPrefs.dayStripEnabled}
          onChange={() => toggleUiPref("dayStripEnabled")}
        />

        <ToggleRow
          label={t("settings.ui.simpleMode" as TranslationKey)}
          description={t("settings.ui.simpleMode.description" as TranslationKey)}
          checked={uiPrefs.simpleMode}
          onChange={() => toggleUiPref("simpleMode")}
        />
      </div>

      {/* ── Features ─────────────────────── */}
      <div className="settings-card">
        <h2>{t("settings.features.title" as TranslationKey)}</h2>
        <p className="settings-hint">{t("settings.features.description" as TranslationKey)}</p>

        <ToggleRow
          label={t("settings.features.discover" as TranslationKey)}
          checked={flags.enableDiscover}
          onChange={() => toggleFlag("enableDiscover")}
        />

        <ToggleRow
          label={t("settings.features.compare" as TranslationKey)}
          checked={flags.enableCompare}
          onChange={() => toggleFlag("enableCompare")}
        />

        <ToggleRow
          label={t("settings.features.trip" as TranslationKey)}
          checked={flags.enableTrip}
          onChange={() => toggleFlag("enableTrip")}
        />

        <ToggleRow
          label={t("settings.features.surfDna" as TranslationKey)}
          checked={flags.enableProfileInsights}
          onChange={() => toggleFlag("enableProfileInsights")}
        />
      </div>

      {/* ── Language ─────────────────────── */}
      <div className="settings-card">
        <h2>{t("settings.language" as TranslationKey)}</h2>
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
