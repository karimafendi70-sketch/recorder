/* ──────────────────────────────────────────────
 *  SpotBrowser — Country → Spot browse + filter
 *
 *  Sits alongside SpotSearchBar in the Forecast
 *  page. Users can:
 *    1. Pick a country from a pill row
 *    2. Optionally filter by difficulty / spot type
 *    3. Select a spot from the filtered list
 * ────────────────────────────────────────────── */

"use client";

import { useState, useMemo } from "react";
import {
  SPOT_CATALOG,
  getCountries,
  filterSpots,
  getDifficultyTags,
  getSpotTypes,
  type DifficultyTag,
  type SpotType,
} from "@/lib/spots/catalog";
import { useFavorites } from "../../FavoritesProvider";
import { useLanguage, type TranslationKey } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type SpotBrowserProps = {
  activeSpotId: string;
  scoreBySpotId: Record<string, number>;
  onSelect: (spotId: string) => void;
};

/* ── Label helpers ───────────────────────────── */

const DIFFICULTY_I18N: Record<DifficultyTag, TranslationKey> = {
  beginner: "filter.beginner",
  intermediate: "filter.intermediate",
  advanced: "filter.advanced",
  mixed: "filter.mixed",
};

const SPOT_TYPE_I18N: Record<SpotType, TranslationKey> = {
  beach: "filter.beach",
  reef: "filter.reef",
  point: "filter.point",
  mixed: "filter.mixedType",
};

export function SpotBrowser({ activeSpotId, scoreBySpotId, onSelect }: SpotBrowserProps) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite, addRecent } = useFavorites();

  const countries = useMemo(() => getCountries(), []);
  const difficulties = useMemo(() => getDifficultyTags(), []);
  const spotTypes = useMemo(() => getSpotTypes(), []);
  const hasMorocco = useMemo(() => SPOT_CATALOG.some((s) => s.country === "Morocco"), []);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTag | null>(null);
  const [selectedSpotType, setSelectedSpotType] = useState<SpotType | null>(null);
  const [expanded, setExpanded] = useState(false);

  const moroccoActive = selectedCountry === "Morocco" && !selectedDifficulty && !selectedSpotType;

  const filteredSpots = useMemo(() => {
    if (!selectedCountry && !selectedDifficulty && !selectedSpotType) return [];
    return filterSpots({
      country: selectedCountry,
      difficulty: selectedDifficulty,
      spotType: selectedSpotType,
    });
  }, [selectedCountry, selectedDifficulty, selectedSpotType]);

  function handleSelect(spotId: string) {
    onSelect(spotId);
    addRecent(spotId);
  }

  function toggleCountry(c: string) {
    setSelectedCountry((prev) => (prev === c ? null : c));
  }

  function activateMorocco() {
    if (moroccoActive) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry("Morocco");
      setSelectedDifficulty(null);
      setSelectedSpotType(null);
    }
  }

  function toggleDifficulty(d: DifficultyTag) {
    setSelectedDifficulty((prev) => (prev === d ? null : d));
  }

  function toggleSpotType(t: SpotType) {
    setSelectedSpotType((prev) => (prev === t ? null : t));
  }

  return (
    <section className={styles.browserSection}>
      {/* Toggle button */}
      <button
        type="button"
        className={styles.browserToggle}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? t("browse.hide") : t("browse.show")}
        <span className={styles.browserToggleIcon}>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className={styles.browserPanel}>
          {/* Morocco preset */}
          {hasMorocco && (
            <div className={styles.browserFilterGroup}>
              <button
                type="button"
                className={`${styles.browserChip} ${styles.presetChip} ${moroccoActive ? styles.browserChipActive : ""}`}
                onClick={activateMorocco}
              >
                🇲🇦 {t("browser.preset.morocco")}
              </button>
            </div>
          )}

          {/* Country pills */}
          <div className={styles.browserFilterGroup}>
            <span className={styles.browserFilterLabel}>{t("browse.country")}</span>
            <div className={styles.browserFilterRow}>
              {countries.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.browserChip} ${selectedCountry === c ? styles.browserChipActive : ""}`}
                  onClick={() => toggleCountry(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty filter chips */}
          <div className={styles.browserFilterGroup}>
            <span className={styles.browserFilterLabel}>{t("browse.difficulty")}</span>
            <div className={styles.browserFilterRow}>
              {difficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.browserChip} ${selectedDifficulty === d ? styles.browserChipActive : ""}`}
                  onClick={() => toggleDifficulty(d)}
                >
                  {t(DIFFICULTY_I18N[d])}
                </button>
              ))}
            </div>
          </div>

          {/* Spot type filter chips */}
          <div className={styles.browserFilterGroup}>
            <span className={styles.browserFilterLabel}>{t("browse.spotType")}</span>
            <div className={styles.browserFilterRow}>
              {spotTypes.map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`${styles.browserChip} ${selectedSpotType === st ? styles.browserChipActive : ""}`}
                  onClick={() => toggleSpotType(st)}
                >
                  {t(SPOT_TYPE_I18N[st])}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered spot list */}
          {filteredSpots.length > 0 && (
            <div className={styles.browserResults}>
              <span className={styles.browserResultCount}>
                {filteredSpots.length} {filteredSpots.length === 1 ? "spot" : "spots"}
              </span>
              <ul className={styles.browserResultList}>
                {filteredSpots.map((spot) => (
                  <li key={spot.id}>
                    <button
                      type="button"
                      className={`${styles.browserResultItem} ${spot.id === activeSpotId ? styles.browserResultActive : ""}`}
                      onClick={() => handleSelect(spot.id)}
                    >
                      <span className={styles.browserResultName}>
                        {spot.name}
                        <span className={styles.browserResultMeta}>
                          {spot.country} · {t(DIFFICULTY_I18N[spot.difficultyTag])} · {t(SPOT_TYPE_I18N[spot.spotType])}
                        </span>
                      </span>
                      <span className={styles.browserResultScore}>
                        {Number.isFinite(scoreBySpotId[spot.id]) ? scoreBySpotId[spot.id].toFixed(1) : "–"}
                      </span>
                      <button
                        type="button"
                        className={styles.favBtn}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(spot.id); }}
                        aria-label={isFavorite(spot.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isFavorite(spot.id) ? "★" : "☆"}
                      </button>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Empty state */}
          {(selectedCountry || selectedDifficulty || selectedSpotType) && filteredSpots.length === 0 && (
            <p className={styles.browserEmpty}>{t("browse.noResults")}</p>
          )}
        </div>
      )}
    </section>
  );
}
