# FreeSurfCast — Product Overview

## Elevator Pitch

FreeSurfCast is a surf-forecast web app that tells coastal surfers whether it's worth paddling out — right now and in the hours ahead. It combines live marine and weather data from Open-Meteo with a personal surf profile (skill, wave preferences, condition weights) to produce a single 0–100 score for every time slot. With 31 European spots, multi-spot insights and an interactive map, it turns raw swell data into an immediate, actionable answer.

---

## Why It's Interesting (for developers & designers)

- **Next.js App Router composition** — Server pages for metadata and layout, client components for interactivity, Route Handlers for API proxying with ISR caching.
- **Live Open-Meteo adapter layer** — Server-side fetch of two separate APIs (Marine + Weather), merged and transformed into a unified forecast shape consumed by the scoring engine.
- **Profile-driven scoring engine** — A pure function that maps wave height, period, direction, wind and temperature onto a weighted 0–100 score, personalized per user profile.
- **State-machine data hook** — `useLiveForecast` manages `idle → loading → success | error` with a 300 ms debounce, automatic mock fallback, and a three-state DataSourceBadge.
- **SpotBrowser + SpotMap interaction** — Browse or filter 31 spots, click a map pin, and deep-link straight into the forecast page for that spot.
- **Multi-spot Insights** — Best-spot badge, ranking table, color heatmap and per-spot timeline, all recalculated when the profile changes.
- **Full EN/NL i18n** — 145+ keys served through a lightweight LanguageProvider, toggled from the Topbar without a page reload.
- **Responsive, mobile-first layout** — Pure CSS + CSS Modules (no Tailwind), teal coastal palette, smooth transitions and loading-pulse animations.
- **Favorites & recent spots** — Client-side persistence so users can jump back to their preferred spots instantly.
- **Graceful degradation** — If live data is unavailable, the app silently falls back to deterministic mock data with a subtle banner — no blank screens, no error walls.

---

## How to Use It (user flow)

1. **Pick a spot** — Use the search bar, browse by country/difficulty/type, or tap a pin on the interactive map.
2. **Set up your surf profile** — Choose your skill level, preferred wave-height range, and how much you care about wind, swell period and temperature.
3. **Read the forecast** — Each time slot shows a 0–100 score plus a plain-language explainer of why the score is what it is.
4. **Compare spots in Insights** — See which spot scores best right now, scan the ranking table, and explore the heatmap for patterns across the day.
5. **Save favorites & switch language** — Star the spots you visit often and toggle between English and Dutch from the Topbar.
