"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDefaultUserPreferences,
  loadUserPreferences,
  saveUserPreferences,
  type UserPreferences,
} from "@/lib/preferences";

const STORAGE_KEY = "freesurfcast:prefs";

/* ── Context shape ─────────────────────────── */

interface PreferencesContextValue {
  /** Current (possibly unsaved) preferences */
  preferences: UserPreferences;
  /** Whether preferences have been loaded from storage */
  ready: boolean;
  /** Replace preferences in memory AND persist to localStorage */
  setPreferences: (next: UserPreferences) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

/* ── Provider ──────────────────────────────── */

function loadFromStorage(): UserPreferences {
  if (typeof window === "undefined") return getDefaultUserPreferences("intermediate");
  return loadUserPreferences({ storage: localStorage, storageKey: STORAGE_KEY });
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setRaw] = useState<UserPreferences>(loadFromStorage);

  const setPreferences = useCallback((next: UserPreferences) => {
    setRaw(next);
    saveUserPreferences(next, { storage: localStorage, storageKey: STORAGE_KEY });
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({ preferences, ready: true, setPreferences }),
    [preferences, setPreferences]
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
