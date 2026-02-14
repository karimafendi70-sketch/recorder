"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getDefaultUserPreferences,
  loadUserPreferences,
  normalizeUserPreferences,
  saveUserPreferences,
  type UserPreferences,
} from "@/lib/preferences";
import { useAuth } from "./AuthProvider";

const STORAGE_KEY = "freesurfcast:prefs";

/* ── Defaults check ────────────────────────── */

function isDefaultPreferences(prefs: UserPreferences): boolean {
  const defaults = getDefaultUserPreferences("intermediate");
  return (
    prefs.skillLevel === defaults.skillLevel &&
    prefs.preferredMinHeight === defaults.preferredMinHeight &&
    prefs.preferredMaxHeight === defaults.preferredMaxHeight &&
    prefs.likesClean === defaults.likesClean &&
    prefs.canHandleChallenging === defaults.canHandleChallenging &&
    prefs.autoBeginnerFilter === defaults.autoBeginnerFilter
  );
}

/* ── Context shape ─────────────────────────── */

interface PreferencesContextValue {
  /** Current (possibly unsaved) preferences */
  preferences: UserPreferences;
  /** Whether preferences have been loaded from storage */
  ready: boolean;
  /** True when preferences still equal the out-of-the-box defaults */
  isUsingDefaults: boolean;
  /** Replace preferences in memory AND persist to localStorage / profile */
  setPreferences: (next: UserPreferences) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

/* ── Provider ──────────────────────────────── */

function loadFromStorage(): UserPreferences {
  if (typeof window === "undefined") return getDefaultUserPreferences("intermediate");
  return loadUserPreferences({ storage: localStorage, storageKey: STORAGE_KEY });
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user, profile, updateProfile } = useAuth();
  const [preferences, setRaw] = useState<UserPreferences>(loadFromStorage);

  // Track the last JSON we synced from profile to avoid write-back loops
  const lastProfileSync = useRef<string>("");

  /* ── Load from profile when logged-in user has prefs ──── */
  useEffect(() => {
    if (!user || user.id === "mock" || !profile) return;

    if (profile.preferences) {
      const normalized = normalizeUserPreferences(profile.preferences);
      const json = JSON.stringify(normalized);
      if (json !== lastProfileSync.current) {
        lastProfileSync.current = json;
        queueMicrotask(() => setRaw(normalized));
        saveUserPreferences(normalized, { storage: localStorage, storageKey: STORAGE_KEY });
      }
    } else {
      // Profile exists but has no preferences yet → seed from localStorage
      const current = loadFromStorage();
      lastProfileSync.current = JSON.stringify(current);
      updateProfile({ preferences: current });
    }
  }, [user, profile, updateProfile]);

  /* ── Debounced write-back to Supabase profile on change ── */
  const syncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!user || user.id === "mock") return;
    const json = JSON.stringify(preferences);
    if (json === lastProfileSync.current) return;
    lastProfileSync.current = json;

    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      updateProfile({ preferences });
    }, 800);

    return () => clearTimeout(syncTimer.current);
  }, [preferences, user, updateProfile]);

  const setPreferences = useCallback((next: UserPreferences) => {
    setRaw(next);
    saveUserPreferences(next, { storage: localStorage, storageKey: STORAGE_KEY });
  }, []);

  const isUsingDefaults = useMemo(() => isDefaultPreferences(preferences), [preferences]);

  const value = useMemo<PreferencesContextValue>(
    () => ({ preferences, ready: true, isUsingDefaults, setPreferences }),
    [preferences, isUsingDefaults, setPreferences]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

/* ── Hook ──────────────────────────────────── */

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences() must be used within <PreferencesProvider>");
  }
  return ctx;
}
