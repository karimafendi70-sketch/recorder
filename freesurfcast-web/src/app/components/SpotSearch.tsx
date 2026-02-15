"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { searchSpotsByName } from "@/lib/spots/catalog";
import { useFavorites } from "@/app/FavoritesProvider";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";

/* ── Props ────────────────────────────────────── */

interface SpotSearchProps {
  /** Compact mode hides the favorites/recent pills */
  compact?: boolean;
}

/* ── Component ────────────────────────────────── */

export function SpotSearch({ compact = true }: SpotSearchProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { recentIds, addRecent, favoriteIds } = useFavorites();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchSpotsByName(query, 6);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (spotId: string) => {
      addRecent(spotId);
      setQuery("");
      setOpen(false);
      router.push(`/spot/${spotId}/forecast`);
    },
    [addRecent, router],
  );

  return (
    <div className="spot-search-wrap" ref={wrapRef}>
      <input
        type="search"
        className="spot-search-input"
        placeholder={t("spotSearch.placeholder" as TranslationKey)}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && results.length > 0 && (
        <ul className="spot-search-dropdown">
          {results.map((spot) => (
            <li key={spot.id}>
              <button
                type="button"
                className="spot-search-result"
                onClick={() => handleSelect(spot.id)}
              >
                <span className="spot-search-name">
                  {spot.name}
                  <span className="spot-search-country">{spot.country}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="spot-search-empty">
          {t("spotSearch.noResults" as TranslationKey)}
        </div>
      )}
    </div>
  );
}
