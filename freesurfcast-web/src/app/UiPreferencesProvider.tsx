"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ── Types ─────────────────────────────────── */

export interface UiPreferences {
  /** Open pro-details (ForecastDetailsSection) by default */
  proDetailsDefaultOpen: boolean;
  /** Show DayStrip24h + TrendBadges + DaySummaryLine */
  dayStripEnabled: boolean;
  /** Hide some advanced blocks for a cleaner interface */
  simpleMode: boolean;
}

const DEFAULTS: UiPreferences = {
  proDetailsDefaultOpen: false,
  dayStripEnabled: true,
  simpleMode: false,
};

const STORAGE_KEY = "freesurfcast:ui-prefs";

/* ── Helpers ───────────────────────────────── */

function loadFromStorage(): UiPreferences {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<UiPreferences>;
    return {
      proDetailsDefaultOpen: typeof parsed.proDetailsDefaultOpen === "boolean" ? parsed.proDetailsDefaultOpen : DEFAULTS.proDetailsDefaultOpen,
      dayStripEnabled: typeof parsed.dayStripEnabled === "boolean" ? parsed.dayStripEnabled : DEFAULTS.dayStripEnabled,
      simpleMode: typeof parsed.simpleMode === "boolean" ? parsed.simpleMode : DEFAULTS.simpleMode,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveToStorage(prefs: UiPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* quota exceeded — ignore */ }
}

/* ── Context ───────────────────────────────── */

interface UiPreferencesContextValue {
  uiPrefs: UiPreferences;
  setUiPrefs: (next: UiPreferences) => void;
  toggleUiPref: (key: keyof UiPreferences) => void;
}

const UiPreferencesContext = createContext<UiPreferencesContextValue | null>(null);

/* ── Provider ──────────────────────────────── */

export function UiPreferencesProvider({ children }: { children: ReactNode }) {
  const [uiPrefs, setRaw] = useState<UiPreferences>(loadFromStorage);

  const setUiPrefs = useCallback((next: UiPreferences) => {
    setRaw(next);
    saveToStorage(next);
  }, []);

  const toggleUiPref = useCallback((key: keyof UiPreferences) => {
    setRaw((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveToStorage(next);
      return next;
    });
  }, []);

  const value = useMemo<UiPreferencesContextValue>(
    () => ({ uiPrefs, setUiPrefs, toggleUiPref }),
    [uiPrefs, setUiPrefs, toggleUiPref],
  );

  return (
    <UiPreferencesContext.Provider value={value}>
      {children}
    </UiPreferencesContext.Provider>
  );
}

/* ── Hook ──────────────────────────────────── */

export function useUiPreferences(): UiPreferencesContextValue {
  const ctx = useContext(UiPreferencesContext);
  if (!ctx) {
    throw new Error("useUiPreferences() must be used within <UiPreferencesProvider>");
  }
  return ctx;
}
