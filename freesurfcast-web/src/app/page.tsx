"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useLanguage, SUPPORTED_LANGS, LANG_LABELS, type TranslationKey } from "./LanguageProvider";
import { useFavorites } from "./FavoritesProvider";
import { searchSpotsByName, getSpotById } from "@/lib/spots/catalog";
import { usePageView } from "@/lib/trackClient";

/* ═══════════════════════════════════════════════
   P18 – Home / Start screen
   Search → pick spot → go to forecast
   ═══════════════════════════════════════════════ */

export default function Home() {
  const { t, lang, setLang } = useLanguage();
  const { recentIds, addRecent } = useFavorites();
  const router = useRouter();
  usePageView();

  /* ── Search state ───────────────────── */
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchSpotsByName(query, 6);
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToSpot = useCallback(
    (spotId: string) => {
      addRecent(spotId);
      router.push(`/spot/${spotId}/forecast`);
    },
    [addRecent, router],
  );

  /* ── Recent spots (max 3, resolved to name) ── */
  const recentSpots = useMemo(
    () =>
      recentIds
        .slice(0, 3)
        .map((id) => {
          const s = getSpotById(id);
          return s ? { id: s.id, name: s.name, country: s.country } : null;
        })
        .filter(Boolean) as { id: string; name: string; country: string }[],
    [recentIds],
  );

  return (
    <section className="homeStart">
      {/* ── Header ────────────────────── */}
      <header className="homeStartHeader">
        <div className="homeStartLogo">🌊</div>
        <h1 className="homeStartTitle">
          {t("home.start.title" as TranslationKey)}
        </h1>
        <p className="homeStartSubtitle">
          {t("home.start.subtitle" as TranslationKey)}
        </p>
      </header>

      {/* ── Search ────────────────────── */}
      <section className="homeStartSection">
        <h2 className="homeStartSectionTitle">
          {t("home.start.searchTitle" as TranslationKey)}
        </h2>

        <div className="homeSearchWrap" ref={wrapRef}>
          <input
            type="search"
            className="homeSearchInput"
            placeholder={t("home.start.searchPlaceholder" as TranslationKey)}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />

          {open && results.length > 0 && (
            <ul className="homeSearchDropdown">
              {results.map((spot) => (
                <li key={spot.id}>
                  <button
                    type="button"
                    className="homeSearchResult"
                    onClick={() => { setQuery(""); setOpen(false); goToSpot(spot.id); }}
                  >
                    <span className="homeSearchName">{spot.name}</span>
                    <span className="homeSearchCountry">{spot.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {open && query.trim().length > 0 && results.length === 0 && (
            <div className="homeSearchEmpty">
              {t("spotSearch.noResults" as TranslationKey)}
            </div>
          )}
        </div>

        <button
          type="button"
          className="homeMapButton"
          onClick={() => router.push("/map")}
        >
          🗺️ {t("home.start.openMap" as TranslationKey)}
        </button>
      </section>

      {/* ── Recent spots ──────────────── */}
      {recentSpots.length > 0 && (
        <section className="homeStartSection">
          <h2 className="homeStartSectionTitle">
            {t("home.start.recentTitle" as TranslationKey)}
          </h2>
          <div className="homeRecentList">
            {recentSpots.map((s) => (
              <button
                key={s.id}
                type="button"
                className="homeRecentChip"
                onClick={() => goToSpot(s.id)}
              >
                <span className="homeRecentName">{s.name}</span>
                <span className="homeRecentCountry">{s.country}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Language ──────────────────── */}
      <section className="homeStartSection">
        <h2 className="homeStartSectionTitle">
          {t("home.start.languageTitle" as TranslationKey)}
        </h2>
        <div className="homeLangRow">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={`homeLangPill ${lang === l ? "homeLangPillActive" : ""}`}
              onClick={() => setLang(l)}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
