/* ──────────────────────────────────────────────
 *  FreeSurfCast – Favorites Provider
 *  Stores favourite spot IDs in localStorage.
 * ────────────────────────────────────────────── */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "freesurfcast:favorites";
const RECENT_KEY = "freesurfcast:recentSpots";
const MAX_RECENT = 6;

/* ── Context shape ─────────────────────────── */

interface FavoritesContextValue {
  /** Set of favourite spot IDs */
  favoriteIds: Set<string>;
  /** Toggle a spot in/out of favourites */
  toggleFavorite: (spotId: string) => void;
  /** Check if a spot is a favourite */
  isFavorite: (spotId: string) => boolean;
  /** Recently selected spot IDs (most recent first) */
  recentIds: string[];
  /** Record a spot as recently selected */
  addRecent: (spotId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/* ── Helpers ───────────────────────────────── */

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((v: unknown) => typeof v === "string"));
  } catch { /* corrupt data */ }
  return new Set();
}

function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((v: unknown) => typeof v === "string").slice(0, MAX_RECENT);
  } catch { /* corrupt data */ }
  return [];
}

function saveRecent(ids: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
}

/* ── Provider ──────────────────────────────── */

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => loadSet(STORAGE_KEY));
  const [recentIds, setRecentIds] = useState<string[]>(loadRecent);

  const toggleFavorite = useCallback((spotId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(spotId)) {
        next.delete(spotId);
      } else {
        next.add(spotId);
      }
      saveSet(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (spotId: string) => favoriteIds.has(spotId),
    [favoriteIds]
  );

  const addRecent = useCallback((spotId: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== spotId);
      const next = [spotId, ...filtered].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favoriteIds, toggleFavorite, isFavorite, recentIds, addRecent }),
    [favoriteIds, toggleFavorite, isFavorite, recentIds, addRecent]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/* ── Hook ──────────────────────────────────── */

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites() must be used within <FavoritesProvider>");
  }
  return ctx;
}
