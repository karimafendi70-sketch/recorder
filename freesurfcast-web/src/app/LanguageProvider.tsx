/* ──────────────────────────────────────────────
 *  FreeSurfCast – Language / i18n context
 *  Supports EN, NL, DE, FR and ES.
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

import { dict, SUPPORTED_LANGS, LANG_LABELS } from "./translations";
import type { Lang, TranslationKey } from "./translations";

export type { Lang, TranslationKey };
export { SUPPORTED_LANGS, LANG_LABELS };

const STORAGE_KEY = "freesurfcast:lang";

/* ── Context ───────────────────────────────── */

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function loadLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored as Lang)) return stored as Lang;
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = useState<Lang>(loadLang);

  const setLang = useCallback((l: Lang) => {
    setLangRaw(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const entry = dict[key];
      return entry?.[lang] ?? key;
    },
    [lang]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() must be used within <LanguageProvider>");
  }
  return ctx;
}
