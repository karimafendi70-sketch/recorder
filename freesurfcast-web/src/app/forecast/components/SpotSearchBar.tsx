"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { searchSpotsByName, SPOT_CATALOG } from "@/lib/spots/catalog";
import { useFavorites } from "../../FavoritesProvider";
import { useLanguage } from "../../LanguageProvider";
import styles from "../forecast.module.css";

type SpotSearchBarProps = {
  activeSpotId: string;
  scoreBySpotId: Record<string, number>;
  onSelect: (spotId: string) => void;
};

export function SpotSearchBar({ activeSpotId, scoreBySpotId, onSelect }: SpotSearchBarProps) {
  const { t } = useLanguage();
  const { favoriteIds, toggleFavorite, isFavorite, recentIds, addRecent } = useFavorites();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchSpotsByName(query, 8);
  }, [query]);

  const favoriteSpots = useMemo(
    () => SPOT_CATALOG.filter((s) => favoriteIds.has(s.id)),
    [favoriteIds]
  );

  const recentSpots = useMemo(
    () => recentIds
      .map((id) => SPOT_CATALOG.find((s) => s.id === id))
      .filter(Boolean) as typeof SPOT_CATALOG,
    [recentIds]
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(spotId: string) {
    onSelect(spotId);
    addRecent(spotId);
    setQuery("");
    setOpen(false);
  }

  return (
    <section className={styles.searchSection}>
      {/* Search input */}
      <div className={styles.searchWrap} ref={wrapRef}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t("forecast.searchPlaceholder")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {open && results.length > 0 && (
          <ul className={styles.searchDropdown}>
            {results.map((spot) => (
              <li key={spot.id}>
                <button
                  type="button"
                  className={`${styles.searchResult} ${spot.id === activeSpotId ? styles.searchResultActive : ""}`}
                  onClick={() => handleSelect(spot.id)}
                >
                  <span className={styles.searchResultName}>
                    {spot.name}
                    <span className={styles.searchResultCountry}>{spot.country}</span>
                  </span>
                  <span className={styles.searchResultScore}>
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
        )}
      </div>

      {/* Favorite pills */}
      {favoriteSpots.length > 0 && (
        <div className={styles.pillGroup}>
          <span className={styles.pillGroupLabel}>{t("forecast.favorites")}</span>
          <div className={styles.pillRow}>
            {favoriteSpots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                className={`${styles.spotPill} ${spot.id === activeSpotId ? styles.spotPillActive : ""}`}
                onClick={() => handleSelect(spot.id)}
              >
                ★ {spot.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent pills */}
      {recentSpots.length > 0 && (
        <div className={styles.pillGroup}>
          <span className={styles.pillGroupLabel}>{t("forecast.recent")}</span>
          <div className={styles.pillRow}>
            {recentSpots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                className={`${styles.spotPill} ${spot.id === activeSpotId ? styles.spotPillActive : ""}`}
                onClick={() => handleSelect(spot.id)}
              >
                {spot.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
