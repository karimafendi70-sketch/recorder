"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { SPOT_CATALOG } from "@/lib/spots/catalog";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { useAllSessions } from "@/lib/profile/useAllSessions";
import { analyzeProfile } from "@/lib/profile/analyze";
import { suggestAlertChanges, applySuggestion } from "@/lib/profile/suggestions";
import { useAlertProfile, defaultProfile } from "@/lib/alerts/useAlertProfile";
import type { AlertSuggestion } from "@/lib/profile/types";
import styles from "../insights.module.css";

/* ── Mini bar (CSS-only) ─────────────────────── */

function MiniBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={styles.miniBarRow}>
      <span className={styles.miniBarLabel}>{label}</span>
      <div className={styles.miniBarTrack}>
        <div
          className={styles.miniBarFill}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={styles.miniBarValue}>{value.toFixed(1)}</span>
    </div>
  );
}

/* ── Duration formatter ──────────────────────── */

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/* ── Suggestion Card ─────────────────────────── */

function SuggestionCard({
  suggestion,
  onApply,
  applied,
}: {
  suggestion: AlertSuggestion;
  onApply: (s: AlertSuggestion) => void;
  applied: boolean;
}) {
  const { t } = useLanguage();
  const confidence = Math.round(suggestion.confidence * 100);

  return (
    <div className={styles.suggestionCard}>
      <div className={styles.suggestionBody}>
        <span className={styles.suggestionIcon}>💡</span>
        <div>
          <p className={styles.suggestionText}>
            {t(suggestion.labelKey as TranslationKey)}
          </p>
          <p className={styles.suggestionMeta}>
            {t("profile.confidence" as TranslationKey)}: {confidence}%
            {" · "}
            {suggestion.field}: <strong>{String(suggestion.value)}</strong>
          </p>
        </div>
      </div>
      <button
        className={`${styles.suggestionBtn} ${applied ? styles.suggestionBtnDone : ""}`}
        onClick={() => onApply(suggestion)}
        disabled={applied}
      >
        {applied
          ? `✅ ${t("profile.applied" as TranslationKey)}`
          : `⚡ ${t("profile.applyAlert" as TranslationKey)}`}
      </button>
    </div>
  );
}

/* ── Main Panel ──────────────────────────────── */

export function ProfileInsightsPanel() {
  const { t } = useLanguage();
  const { sessions } = useAllSessions();
  const insights = useMemo(
    () => analyzeProfile(sessions, SPOT_CATALOG),
    [sessions],
  );

  // For alert suggestions, we use the first top spot (if any)
  const topSpotId = insights.topSpots[0]?.spotId ?? "";
  const { profile: alertProfile, save: saveAlert } = useAlertProfile(topSpotId);

  const alertSuggestions = useMemo(
    () => suggestAlertChanges(insights, alertProfile),
    [insights, alertProfile],
  );

  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleApply = useCallback(
    (suggestion: AlertSuggestion) => {
      if (!topSpotId) return;
      const current = alertProfile ?? defaultProfile(topSpotId);
      const updated = applySuggestion(current, suggestion);
      saveAlert(updated);
      setAppliedIds((prev) => new Set([...prev, suggestion.labelKey]));
    },
    [topSpotId, alertProfile, saveAlert],
  );

  // Nothing to show if no sessions
  if (insights.totalSessions === 0) {
    return (
      <div className={styles.profileEmpty}>
        <span className={styles.profileEmptyIcon}>📝</span>
        <p className={styles.profileEmptyText}>
          {t("profile.noSessions" as TranslationKey)}
        </p>
        <p className={styles.profileEmptyHint}>
          {t("profile.noSessionsHint" as TranslationKey)}
        </p>
      </div>
    );
  }

  const maxSizeScore = Math.max(
    ...insights.preferredSizeBands.map((p) => Math.abs(p.score)),
    ...insights.avoidedSizeBands.map((p) => Math.abs(p.score)),
    1,
  );

  return (
    <>
      {/* ── Stats overview ── */}
      <div className={styles.profileStats}>
        <div className={styles.profileStat}>
          <span className={styles.profileStatValue}>{insights.totalSessions}</span>
          <span className={styles.profileStatLabel}>
            {t("profile.stat.sessions" as TranslationKey)}
          </span>
        </div>
        <div className={styles.profileStat}>
          <span className={styles.profileStatValue}>
            {insights.avgSessionRating.toFixed(1)} ★
          </span>
          <span className={styles.profileStatLabel}>
            {t("profile.stat.avgRating" as TranslationKey)}
          </span>
        </div>
        <div className={styles.profileStat}>
          <span className={styles.profileStatValue}>
            {fmtDuration(insights.totalMinutes)}
          </span>
          <span className={styles.profileStatLabel}>
            {t("profile.stat.waterTime" as TranslationKey)}
          </span>
        </div>
        <div className={styles.profileStat}>
          <span className={styles.profileStatValue}>
            {insights.topSpots.length}
          </span>
          <span className={styles.profileStatLabel}>
            {t("profile.stat.spots" as TranslationKey)}
          </span>
        </div>
      </div>

      {/* ── Top spots ── */}
      {insights.topSpots.length > 0 && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>🏆 {t("profile.topSpots" as TranslationKey)}</h2>
          </div>
          <div className={styles.profileTopList}>
            {insights.topSpots.map((spot, i) => (
              <Link
                key={spot.spotId}
                href={`/spot/${spot.spotId}/forecast`}
                className={styles.profileTopRow}
              >
                <span className={styles.profileTopRank}>#{i + 1}</span>
                <span className={styles.profileTopName}>{spot.spotName}</span>
                <span className={styles.profileTopMeta}>
                  {spot.avgRating.toFixed(1)} ★ · {spot.count}×
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Size preference bars ── */}
      {(insights.preferredSizeBands.length > 0 || insights.avoidedSizeBands.length > 0) && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>🌊 {t("profile.sizePreference" as TranslationKey)}</h2>
          </div>
          {insights.preferredSizeBands.map((p) => (
            <MiniBar
              key={p.sizeBand}
              label={t(`cond.size.${p.sizeBand}` as TranslationKey)}
              value={p.score}
              max={maxSizeScore}
            />
          ))}
          {insights.avoidedSizeBands.map((p) => (
            <MiniBar
              key={p.sizeBand}
              label={`⛔ ${t(`cond.size.${p.sizeBand}` as TranslationKey)}`}
              value={Math.abs(p.score)}
              max={maxSizeScore}
            />
          ))}
        </div>
      )}

      {/* ── Wind preference ── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>💨 {t("profile.windPreference" as TranslationKey)}</h2>
        </div>
        <div className={styles.profileWindRow}>
          <div className={styles.profileWindItem}>
            <span className={styles.profileWindLabel}>
              {t("profile.wind.offshore" as TranslationKey)}
            </span>
            <span className={styles.profileWindScore}>
              {insights.windPreference.offshoreScore > 0 ? "👍" : "—"}
              {" "}
              {insights.windPreference.offshoreScore.toFixed(2)}
            </span>
          </div>
          <div className={styles.profileWindItem}>
            <span className={styles.profileWindLabel}>
              {t("profile.wind.onshore" as TranslationKey)}
            </span>
            <span className={styles.profileWindScore}>
              {insights.windPreference.onshoreScore > 0 ? "👍" : "—"}
              {" "}
              {insights.windPreference.onshoreScore.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Suggestions ── */}
      {insights.suggestions.length > 0 && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>🧠 {t("profile.suggestionsTitle" as TranslationKey)}</h2>
          </div>
          <ul className={styles.profileSuggestList}>
            {insights.suggestions.map((key) => (
              <li key={key} className={styles.profileSuggestItem}>
                {t(key as TranslationKey)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Alert suggestions ── */}
      {alertSuggestions.length > 0 && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>🔔 {t("profile.alertSuggestTitle" as TranslationKey)}</h2>
            <p>{t("profile.alertSuggestDesc" as TranslationKey)}</p>
          </div>
          {alertSuggestions.map((s) => (
            <SuggestionCard
              key={s.labelKey}
              suggestion={s}
              onApply={handleApply}
              applied={appliedIds.has(s.labelKey)}
            />
          ))}
        </div>
      )}
    </>
  );
}
