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

export interface FeatureFlags {
  enableTrip: boolean;
  enableCompare: boolean;
  enableDiscover: boolean;
  enableProfileInsights: boolean; // Surf DNA
}

const DEFAULTS: FeatureFlags = {
  enableTrip: true,
  enableCompare: true,
  enableDiscover: true,
  enableProfileInsights: true,
};

const STORAGE_KEY = "freesurfcast:feature-flags";

/* ── Helpers ───────────────────────────────── */

function loadFromStorage(): FeatureFlags {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<FeatureFlags>;
    return {
      enableTrip: typeof parsed.enableTrip === "boolean" ? parsed.enableTrip : DEFAULTS.enableTrip,
      enableCompare: typeof parsed.enableCompare === "boolean" ? parsed.enableCompare : DEFAULTS.enableCompare,
      enableDiscover: typeof parsed.enableDiscover === "boolean" ? parsed.enableDiscover : DEFAULTS.enableDiscover,
      enableProfileInsights: typeof parsed.enableProfileInsights === "boolean" ? parsed.enableProfileInsights : DEFAULTS.enableProfileInsights,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveToStorage(flags: FeatureFlags) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch { /* quota exceeded — ignore */ }
}

/* ── Context ───────────────────────────────── */

interface FeatureFlagsContextValue {
  flags: FeatureFlags;
  setFlags: (next: FeatureFlags) => void;
  toggleFlag: (key: keyof FeatureFlags) => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null);

/* ── Provider ──────────────────────────────── */

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setRaw] = useState<FeatureFlags>(loadFromStorage);

  const setFlags = useCallback((next: FeatureFlags) => {
    setRaw(next);
    saveToStorage(next);
  }, []);

  const toggleFlag = useCallback((key: keyof FeatureFlags) => {
    setRaw((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveToStorage(next);
      return next;
    });
  }, []);

  const value = useMemo<FeatureFlagsContextValue>(
    () => ({ flags, setFlags, toggleFlag }),
    [flags, setFlags, toggleFlag],
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

/* ── Hook ──────────────────────────────────── */

export function useFeatureFlags(): FeatureFlagsContextValue {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) {
    throw new Error("useFeatureFlags() must be used within <FeatureFlagsProvider>");
  }
  return ctx;
}
