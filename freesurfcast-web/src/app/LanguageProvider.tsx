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
  "home.eyebrow": { en: "Coastal Forecasting 2026", nl: "Kustvoorspelling 2026" },
  "home.title": { en: "FreeSurfCast", nl: "FreeSurfCast" },
  "home.subtitle": {
    en: "See when and where to surf — personalised scores powered by live conditions and your preferences.",
    nl: "Zie wanneer en waar je kunt surfen — persoonlijke scores op basis van actuele condities en jouw voorkeuren.",
  },
  "home.openForecast": { en: "Open forecast →", nl: "Open voorspelling →" },
  "home.setupProfile": { en: "Set up your surf profile", nl: "Stel je surfprofiel in" },
  "home.profileHint": {
    en: "Your profile personalises all scores and insights.",
    nl: "Je profiel personaliseert alle scores en inzichten.",
  },
  "home.stepsTitle": { en: "How it works", nl: "Zo werkt het" },
  "home.step1": { en: "Pick a spot — search, browse by country or tap a pin on the map.", nl: "Kies een spot — zoek, blader per land of tik op een pin op de kaart." },
  "home.step2": { en: "Set your profile — skill level, wave range and condition weights.", nl: "Stel je profiel in — niveau, golfbereik en conditiegewichten." },
  "home.step3": { en: "Read the score — per time slot, per spot, tuned to you.", nl: "Lees de score — per tijdslot, per spot, afgestemd op jou." },
  "home.aboutTitle": { en: "About FreeSurfCast", nl: "Over FreeSurfCast" },
  "home.aboutP1": {
    en: "FreeSurfCast turns raw forecast data into personalised surf scores. Set your skill level, wave preferences and condition weights — then instantly see when and where to paddle out.",
    nl: "FreeSurfCast vertaalt ruwe voorspellingsdata naar persoonlijke surfscores. Stel je niveau, golfvoorkeuren en conditiegewichten in — en zie direct wanneer en waar je het water in kunt.",
  },
  "home.aboutP2": {
    en: "Use Forecast for time-slot scores per spot, Map to explore spots visually, Insights to compare side-by-side, and Profile to fine-tune your weights.",
    nl: "Gebruik Voorspelling voor tijdslot-scores per spot, Kaart om spots visueel te verkennen, Inzichten om spots naast elkaar te vergelijken, en Profiel om je gewichten af te stemmen.",
  },
  "home.aboutMock": {
    en: "Live data from Open-Meteo — with automatic fallback to mock data if the API is unavailable.",
    nl: "Live data via Open-Meteo — met automatische fallback naar mockdata als de API niet beschikbaar is.",
  },
  "home.keyIdeas": { en: "Key ideas", nl: "Kernpunten" },
  "home.idea1": {
    en: "Profile-driven scoring — conditions weighted to your preferences.",
    nl: "Profielgestuurde scoring — condities gewogen op jouw voorkeuren.",
  },
  "home.idea2": {
    en: "Daypart intelligence — morning, midday, afternoon and evening scored separately.",
    nl: "Dagdeelintelligentie — ochtend, middag, namiddag en avond apart beoordeeld.",
  },
  "home.idea3": {
    en: "Multi-spot comparison — rank and compare your favourite breaks at a glance.",
    nl: "Multi-spotvergelijking — rangschik en vergelijk je favoriete spots in één oogopslag.",
  },
  "home.feedbackTitle": { en: "Help improve FreeSurfCast", nl: "Help FreeSurfCast verbeteren" },
  "home.feedbackBody": {
    en: "Spotted a bug, have a feature idea, or want to share your thoughts? Your feedback makes a real difference.",
    nl: "Bug gevonden, feature-idee, of wil je je mening delen? Jouw feedback maakt echt verschil.",
  },
  "home.sendFeedback": { en: "Send feedback ✉", nl: "Stuur feedback ✉" },
  "home.githubIssue": { en: "Open GitHub issue →", nl: "Open GitHub issue →" },

  // Forecast
  "forecast.title": { en: "Today's forecast", nl: "Voorspelling vandaag" },
  "forecast.lead": {
    en: "Spot-based scores per time slot, tuned to your profile. Search by name, browse by country, or pick a spot on the map.",
    nl: "Scores per spot per tijdslot, afgestemd op je profiel. Zoek op naam, blader per land, of kies een spot op de kaart.",
  },
  "forecast.spotLabel": { en: "Spot", nl: "Spot" },
  "forecast.spotHint": { en: "Pick a spot to update the forecast cards", nl: "Kies een spot om de voorspellingskaarten bij te werken" },
  "forecast.searchPlaceholder": { en: "Search a surf spot…", nl: "Zoek een surfspot…" },
  "forecast.favorites": { en: "Favorites", nl: "Favorieten" },
  "forecast.recent": { en: "Recent", nl: "Recent" },
  "forecast.allSpots": { en: "All spots", nl: "Alle spots" },
  "forecast.whyTitle": { en: "Why this score?", nl: "Waarom deze score?" },
  "forecast.whyLead": {
    en: "We combine wave height, wind direction, swell period and your profile preferences into a single score.",
    nl: "We combineren golfhoogte, windrichting, swellperiode en jouw profielvoorkeuren tot één score.",
  },
  "forecast.prefersClean": { en: "Prefers clean", nl: "Liever clean" },
  "forecast.mixedOk": { en: "Mixed ok", nl: "Mixed ok" },
  "forecast.defaultsBanner": {
    en: "You're using default preferences — scores are generic.",
    nl: "Je gebruikt standaardvoorkeuren — scores zijn generiek.",
  },
  "forecast.editProfile": { en: "Edit profile →", nl: "Profiel bewerken →" },
  "forecast.noResults": { en: "No spots found", nl: "Geen spots gevonden" },
  "forecast.searchHint": { en: "Search a spot and tap ★ to save it as a favourite", nl: "Zoek een spot en tik op ★ om als favoriet op te slaan" },
  "forecast.liveData": { en: "Live data", nl: "Live data" },
  "forecast.mockData": { en: "Mock data (API unavailable)", nl: "Mock data (API onbereikbaar)" },

  // Browse / filter
  "browse.show": { en: "Browse spots by country & filter", nl: "Blader per land & filter" },
  "browse.hide": { en: "Hide browser", nl: "Verberg browser" },
  "browse.country": { en: "Country", nl: "Land" },
  "browse.difficulty": { en: "Difficulty", nl: "Niveau" },
  "browse.spotType": { en: "Spot type", nl: "Spottype" },
  "browse.noResults": { en: "No spots match these filters — try removing one.", nl: "Geen spots gevonden met deze filters — probeer er een te verwijderen." },
  "filter.beginner": { en: "Beginner", nl: "Beginner" },
  "filter.intermediate": { en: "Intermediate", nl: "Gevorderd" },
  "filter.advanced": { en: "Advanced", nl: "Expert" },
  "filter.mixed": { en: "Mixed", nl: "Gemengd" },
  "filter.beach": { en: "Beach break", nl: "Strandbreak" },
  "filter.reef": { en: "Reef break", nl: "Rifbreak" },
  "filter.point": { en: "Point break", nl: "Pointbreak" },
  "filter.mixedType": { en: "Mixed", nl: "Gemengd" },

  // Map
  "nav.map": { en: "Map", nl: "Kaart" },
  "map.title": { en: "Spot Map", nl: "Spotkaart" },
  "map.subtitle": {
    en: "All 31 surf spots on one map. Click a pin, then tap \"Open forecast\" to see scores.",
    nl: "Alle 31 surfspots op één kaart. Klik op een pin en tik op \"Open voorspelling\" om scores te zien.",
  },
  "map.openForecast": { en: "Open forecast →", nl: "Open voorspelling →" },

  // Insights
  "insights.eyebrow": { en: "Insights", nl: "Inzichten" },
  "insights.title": { en: "Multi-spot overview", nl: "Multi-spot overzicht" },
  "insights.subtitle": {
    en: "Compare spots side-by-side — rankings, heatmap and timeline, all driven by your profile.",
    nl: "Vergelijk spots naast elkaar — rankings, heatmap en tijdlijn, allemaal op basis van je profiel.",
  },
  "insights.bestSpot": { en: "👑 Best spot right now", nl: "👑 Beste spot nu" },
  "insights.viewForecast": { en: "View forecast →", nl: "Bekijk voorspelling →" },
  "insights.whyBest": { en: "Why this spot is best", nl: "Waarom deze spot het beste is" },

  // Login
  "login.heading": { en: "Sign in to FreeSurfCast", nl: "Log in bij FreeSurfCast" },
  "login.subtitle": { en: "Access your personalised surf forecast dashboard.", nl: "Toegang tot je persoonlijke surfvoorspellingen." },
  "login.email": { en: "Email", nl: "E-mail" },
  "login.password": { en: "Password", nl: "Wachtwoord" },
  "login.submit": { en: "Sign in", nl: "Inloggen" },
  "login.guest": { en: "Continue as guest", nl: "Ga door als gast" },

  // Profile
  "profile.title": { en: "Your Surf Profile", nl: "Jouw Surfprofiel" },
  "profile.lead": {
    en: "Tell FreeSurfCast how and where you like to surf — all scores and insights adapt automatically.",
    nl: "Vertel FreeSurfCast hoe en waar je graag surft — alle scores en inzichten passen zich automatisch aan.",
  },
  "profile.skill": { en: "Skill level", nl: "Surfniveau" },
  "profile.skillDesc": { en: "Affects default wave range and safety filters.", nl: "Bepaalt standaard golfbereik en veiligheidsfilters." },
  "profile.beginner": { en: "Beginner", nl: "Beginner" },
  "profile.intermediate": { en: "Intermediate", nl: "Gevorderd" },
  "profile.advanced": { en: "Advanced", nl: "Expert" },
  "profile.waveTitle": { en: "Wave preferences", nl: "Golfvoorkeuren" },
  "profile.waveDesc": { en: "Choose the wave range you're most comfortable with.", nl: "Kies het golfbereik dat bij je past." },
  "profile.small": { en: "Smaller waves", nl: "Kleinere golven" },
  "profile.medium": { en: "Medium range", nl: "Gemiddeld bereik" },
  "profile.big": { en: "Bigger waves", nl: "Grotere golven" },
  "profile.condTitle": { en: "Conditions", nl: "Condities" },
  "profile.condDesc": { en: "Fine-tune how the scoring engine rates conditions.", nl: "Stel in hoe de scoring-engine condities beoordeelt." },
  "profile.likesClean": { en: "Prefer clean conditions", nl: "Liever schone condities" },
  "profile.likesCleanHint": { en: "Lower score when conditions are choppy", nl: "Lagere score bij rommige condities" },
  "profile.challenging": { en: "Comfortable with challenging conditions", nl: "Comfortabel met uitdagende condities" },
  "profile.challengingHint": { en: "Don't penalise strong currents or offshore wind", nl: "Geen straf voor sterke stroming of offshore wind" },
  "profile.beginnerFilter": { en: "Beginner safety auto-balance", nl: "Automatische beginnersveiligheid" },
  "profile.beginnerFilterHint": { en: "Filter spots that exceed safe thresholds", nl: "Filter spots boven veilige drempelwaarden" },
  "profile.save": { en: "Save preferences", nl: "Voorkeuren opslaan" },
  "profile.saved": { en: "✓ Preferences saved", nl: "✓ Voorkeuren opgeslagen" },

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
