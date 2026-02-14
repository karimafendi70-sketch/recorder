# FreeSurfCast — Changelog

---

## v1.5 – Live forecasts, spot catalog & map

_The app now runs on real data and covers 31 surf spots across Europe._

- **Live Open-Meteo integration** — Marine (wave height, period, direction) and Weather (wind, temperature, cloud cover) data fetched server-side via a Route Handler with 30-minute ISR caching.
- **31-spot catalog** with latitude/longitude, difficulty rating, spot type (beach break, reef, point break) and swell orientation for each location.
- **SpotSearchBar + SpotBrowser** — Find spots by name, filter by country, difficulty or type; results update instantly.
- **Favorites & recent spots** — Star any spot for quick access; recently viewed spots are remembered across sessions.
- **Insights page** — Best-spot badge, multi-spot ranking table, color-coded heatmap and per-spot timeline, all driven by your personal profile.
- **Interactive SpotMap** — Leaflet map with 31 pins, popups with key info, and a deep-link button that opens the forecast for the selected spot.
- **EN/NL language switch** — Full bilingual interface (145+ translation keys) toggled from the Topbar.
- **Robust loading & error handling** — `useLiveForecast` state-machine with 300 ms debounce, three-state DataSourceBadge (loading → live → fallback), and a non-intrusive fallback banner when the API is unreachable.
- **ScoreExplainer** — Plain-language breakdown of how the score was calculated for the current time slot.
- **UX micro-copy polish** — Sharper hero subtitle, 3-step "How it works" onboarding, actionable map subtitle, improved About page explaining the live-data pipeline.

---

## v1.0 – First Next.js prototype

_Static prototype establishing the page structure, scoring concept and coastal design language._

- **App Router layout** with Home, Forecast, Insights and Profile pages, plus a custom 404 page.
- **Profile-based mock scoring** — Skill level, preferred wave range and condition weights fed into a scoring engine that rates every time slot 0–100.
- **Mock data generator** — Deterministic fake forecasts derived from each spot's baseline parameters, used during development and as a live-data fallback.
- **Coastal design system** — Teal accent palette, responsive panels, CSS Modules, and a consistent Topbar with navigation and auth stub.
- **About & Feedback** pages with project context and a placeholder feedback form.
- **Favicon & metadata** — Custom wave icon and OpenGraph tags.
