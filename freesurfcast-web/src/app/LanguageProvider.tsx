/* ──────────────────────────────────────────────
 *  FreeSurfCast – Language / i18n context
 *  Supports EN and NL with a simple dictionary.
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

export type Lang = "en" | "nl";

const STORAGE_KEY = "freesurfcast:lang";

/* ── Translation dictionary ────────────────── */

const dict = {
  // Topbar / nav
  "nav.home": { en: "Home", nl: "Home" },
  "nav.forecast": { en: "Forecast", nl: "Voorspelling" },
  "nav.insights": { en: "Insights", nl: "Inzichten" },
  "nav.profile": { en: "Profile", nl: "Profiel" },
  "nav.login": { en: "Login", nl: "Inloggen" },
  "nav.logout": { en: "Logout", nl: "Uitloggen" },
  "nav.loggedInAs": { en: "Logged in as", nl: "Ingelogd als" },

  // Home
  "home.eyebrow": { en: "2026 Coastal Forecasting", nl: "2026 Kustweervoorspelling" },
  "home.title": { en: "FreeSurfCast", nl: "FreeSurfCast" },
  "home.subtitle": {
    en: "Personal surf guidance built around your profile, conditions, and smart daypart scoring. Start with a quick forecast view and grow into deeper insights.",
    nl: "Persoonlijke surfgids op basis van je profiel, condities en slimme dagdeelscores. Begin met een snelle voorspelling en ontdek diepere inzichten.",
  },
  "home.openForecast": { en: "Open Forecast →", nl: "Open Voorspelling →" },
  "home.setupProfile": { en: "Set up your surf profile", nl: "Stel je surfprofiel in" },
  "home.profileHint": {
    en: "Your profile will personalise all scores and insights.",
    nl: "Je profiel personaliseert alle scores en inzichten.",
  },
  "home.aboutTitle": { en: "About FreeSurfCast", nl: "Over FreeSurfCast" },
  "home.aboutP1": {
    en: "FreeSurfCast is a profile-driven coastal surf forecasting tool. It takes your skill level, wave preferences and condition weights and translates raw forecast data into personalised scores — so you instantly know when and where to paddle out.",
    nl: "FreeSurfCast is een profielgestuurd kustsurfvoorspellingstool. Het neemt je surfniveau, golfvoorkeuren en conditiegewichten en vertaalt ruwe voorspellingsdata naar gepersonaliseerde scores — zodat je direct weet wanneer en waar je het water in kunt.",
  },
  "home.aboutP2En": {
    en: "Use Forecast to see time-slot scores for a single spot, Insights to compare multiple spots side-by-side with heatmaps and timelines, and Profile to fine-tune how conditions are weighted.",
    nl: "Gebruik Voorspelling om tijdslot-scores per spot te zien, Inzichten om meerdere spots naast elkaar te vergelijken met heatmaps en tijdlijnen, en Profiel om de conditiegewichten te verfijnen.",
  },
  "home.aboutMock": {
    en: "The app currently runs on mock forecast data — but the scoring engine, daypart logic and multi-spot comparison are fully functional.",
    nl: "De app draait momenteel op mock-voorspellingsdata — maar de scoring-engine, dagdeellogica en multi-spotvergelijking zijn volledig functioneel.",
  },
  "home.keyIdeas": { en: "Key ideas", nl: "Kernpunten" },
  "home.idea1": {
    en: "Profile-driven scoring — conditions are weighted to your personal preferences.",
    nl: "Profielgestuurde scoring — condities worden gewogen op basis van je persoonlijke voorkeuren.",
  },
  "home.idea2": {
    en: "Daypart intelligence — morning, midday, afternoon and evening scored separately.",
    nl: "Dagdeelintelligentie — ochtend, middag, namiddag en avond apart beoordeeld.",
  },
  "home.idea3": {
    en: "Multi-spot comparison — rank and compare your favourite breaks at a glance.",
    nl: "Multi-spotvergelijking — rangschik en vergelijk je favoriete surfplekken in één oogopslag.",
  },
  "home.feedbackTitle": { en: "Help improve FreeSurfCast", nl: "Help FreeSurfCast verbeteren" },
  "home.feedbackBody": {
    en: "This project is actively evolving. Spotted a bug, have a feature idea, or just want to share your thoughts? Your feedback makes a real difference.",
    nl: "Dit project evolueert continu. Fout gevonden, feature-idee, of gewoon je mening delen? Jouw feedback maakt echt verschil.",
  },
  "home.sendFeedback": { en: "Send feedback ✉", nl: "Stuur feedback ✉" },
  "home.githubIssue": { en: "Open a GitHub issue →", nl: "Open een GitHub issue →" },

  // Forecast
  "forecast.title": { en: "Today's forecast", nl: "Voorspelling vandaag" },
  "forecast.spotLabel": { en: "Spot", nl: "Spot" },
  "forecast.spotHint": { en: "Pick a spot to update forecast cards", nl: "Kies een spot om de voorspellingskaarten bij te werken" },
  "forecast.searchPlaceholder": { en: "Search a surf spot…", nl: "Zoek een surfspot…" },
  "forecast.favorites": { en: "Favorites", nl: "Favorieten" },
  "forecast.recent": { en: "Recent", nl: "Recent" },
  "forecast.allSpots": { en: "All spots", nl: "Alle spots" },
  "forecast.whyTitle": { en: "Why this score?", nl: "Waarom deze score?" },
  "forecast.prefersClean": { en: "Prefers clean", nl: "Liever clean" },
  "forecast.mixedOk": { en: "Mixed ok", nl: "Mixed ok" },
  "forecast.defaultsBanner": {
    en: "You're using default preferences.",
    nl: "Je gebruikt standaardvoorkeuren.",
  },
  "forecast.editProfile": { en: "Edit profile", nl: "Profiel bewerken" },

  // Insights
  "insights.eyebrow": { en: "Insights", nl: "Inzichten" },
  "insights.title": { en: "Multi-spot overview", nl: "Multi-spot overzicht" },
  "insights.subtitle": {
    en: "Rankings, daypart heatmap and timeline — powered by your profile preferences.",
    nl: "Rankings, dagdeel-heatmap en tijdlijn — op basis van je profielvoorkeuren.",
  },
  "insights.bestSpot": { en: "👑 Best spot right now", nl: "👑 Beste spot nu" },
  "insights.viewForecast": { en: "View forecast →", nl: "Bekijk voorspelling →" },
  "insights.whyBest": { en: "Why this spot is best", nl: "Waarom deze spot het beste is" },

  // Profile
  "profile.title": { en: "Your Surf Profile", nl: "Jouw Surfprofiel" },

  // Login
  "login.title": { en: "Log in", nl: "Inloggen" },

  // General
  "general.score": { en: "Score", nl: "Score" },
  "general.morning": { en: "Morning", nl: "Ochtend" },
  "general.afternoon": { en: "Afternoon", nl: "Middag" },
  "general.evening": { en: "Evening", nl: "Avond" },
  "keywords.forecast": { en: "Forecast", nl: "Voorspelling" },
  "keywords.heatmap": { en: "Heatmap", nl: "Heatmap" },
  "keywords.timeline": { en: "Timeline", nl: "Tijdlijn" },
  "keywords.profileDriven": { en: "Profile-driven", nl: "Profielgestuurd" },
} as const;

export type TranslationKey = keyof typeof dict;

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
  if (stored === "nl") return "nl";
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
