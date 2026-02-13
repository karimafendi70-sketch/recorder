# FreeSurfCast

FreeSurfCast is a custom surf forecast web app inspired by surf-forecast.com, built to turn raw marine/weather data into practical surf decisions.

## Live demo

Try FreeSurfCast on [GitHub Pages](https://karimafendi70-sketch.github.io/recorder/).

## Project pitch

### English

FreeSurfCast is a custom surf forecast web app inspired by surf-forecast.com, focused on turning raw weather signals into actionable surf decisions. It combines a 4-day multi-day overview, condition tags (Clean / Mixed / Choppy), beginner-vs-advanced filters, a multi-spot “best spots today” view, and an automatic daily surf report for each day/spot. The project is built with vanilla JavaScript, browser APIs, API-based forecast integration, and a lightweight PWA setup (manifest + service worker), with helper tests and linting for reliability. It showcases my ability to manage complex front-end state while keeping UI/UX clear and data interpretation practical.

### Nederlands (kort)

FreeSurfCast is een custom surf forecast webapp, geïnspireerd door surf-forecast.com, die ruwe forecast-data omzet in direct bruikbare surfkeuzes. De app combineert een 4-daags overzicht, condition tags (Clean / Mixed / Choppy), filters voor beginners en gevorderden, een multi-spot “best spots today”-overzicht en een automatisch daily surf report. Hiermee laat ik zien dat ik complexe front-end state, UX en data-heuristieken in één consistente applicatie kan samenbrengen.

## Project overview

FreeSurfCast started as both a practical surfer tool and a portfolio project. Instead of building another generic weather dashboard, the goal was to create a focused surf experience inspired by surf-forecast-style workflows: quickly compare spots, understand conditions at a glance, and decide where/when to surf next.

The app solves three common decision problems for surfers: where conditions are best now or later today, whether the session is likely beginner-friendly or more demanding, and how to get a readable daily summary without manually parsing every chart and metric. Condition tags, multi-day cards, day-part grouping, and per-slot detail/advice reduce the “data-to-decision” gap.

From an engineering perspective, the interesting part is state consistency across multiple views and summaries. The app combines forecast inputs into per-slot and per-day heuristics, then reuses the same core state for map view, list view, multi-spot ranking, and daily surf report text. This keeps UI behavior predictable while still supporting richer analysis.

## Features

- Global spot browsing with region-aware search, map and list views.
- Multi-day overview (up to 4 days) with min/max wave range and dominant condition tags.
- Slot-level forecast context with swell, wind, and condition tags (Clean / Mixed / Choppy).
- Approximate tide/water-level context per slot (Low / Mid / High) with spot-profile hints.
- Slot detail panel with concise surf advice per selected time slot.
- “Why this score?” breakdown in the slot detail panel (swell, wind, conditions, tide, and active preferences).
- Score-over-time timeline per active spot/day, based on existing slot scores.
- Mini heatmap that compares spots across morning/afternoon/evening score windows.
- Local user preferences panel (skill profile + condition preferences) with subtle score and advice personalization.
- Condition filters for minimally surfable, beginner friendly, and prefer clean.
- Shared day/slot selection model across map view, list view, detail panel, and reports.
- Multi-spot “best spots today” overview with score and best time guidance.
- Automatic daily surf report text per active day and spot.
- Installable PWA shell (manifest + service worker), with live forecast fetching.

## How to run

- Requirements:
	- Node.js 18+ and npm.
	- Modern browser (Chrome, Edge, Firefox, or Safari).
- Install:
	- `npm install`
- Local run:
	- `npm run serve` (starts a static server on port 4173)
	- Open `http://localhost:4173`
- Validation:
	- `npm run test-helpers`
	- `npm run lint`

## Tech stack

- Vanilla HTML, CSS, and JavaScript.
- Browser APIs (Fetch, localStorage, Clipboard, URL state).
- Leaflet for map rendering and spot markers.
- Open-Meteo marine + weather endpoints for forecast inputs.
- PWA setup with `manifest.json` and `service-worker.js`.
- Lightweight tooling: ESLint + helper tests.

## Screenshots

- Add screenshots in `docs/screenshots/`, for example:
	- `overview-map.png` (multi-day overview + map)
	- `list-slot-detail.png` (list view + slot detail panel)
	- `multi-spot.png` (multi-spot best spots overview)
	- `daily-report-dark.png` (daily surf report in dark mode)

## Architecture (short)

- `SURF_SPOTS` is the source for global spot metadata, region grouping, and map markers.
- `selectSpot(...)` is the central selection flow for map, search, favorites, deep-link, and restore.
- `updateForecastForSpot(...)` controls forecast refresh and dependent UI rendering.
- `fetchLiveForecastForSpot(...)` requests live Open-Meteo forecast snapshots.
- Condition heuristics classify slots with simple tags using wind relation, wind speed, swell, and spot orientation.
- Day/slot state (`currentDayKey`, `currentSlotKey`) is shared across map view, list view, detail panel, and summaries.
- Score helpers (`getSlotQualityScore`, `getSpotDayScore`) power the multi-spot ranking and day-level interpretation.
- Score helpers return both final score and component breakdown so UI explainability and optional debug view reuse the same data.
- User preference helpers persist profile settings in localStorage and feed subtle scoring/advice adjustments.
- Tide helpers map spot/region profiles to day-part tide levels and suitability hints.
- Timeline and heatmap helpers reuse slot/day score state and forecast caches (no extra API requests).
- Daily report helpers generate compact text summaries from the same slot/day state, without extra endpoints.
- Translation keys + `setLanguage(...)` keep UI labels and feature text consistent across supported languages.

## Quality & tests

- Run helper regression tests: `node tests/helpers.test.js` or `npm run test-helpers`.
- Run lint checks: `npm run lint`.
- Accessibility baseline includes keyboard focus states and meaningful ARIA labels on key controls.

## Technical notes

- Open-Meteo endpoints:
	- `https://marine-api.open-meteo.com/v1/marine`
	- `https://api.open-meteo.com/v1/forecast`
- Forecast caching uses an in-memory `Map` with TTL (`FORECAST_CACHE_TTL_MS`).
- Pending request dedupe prevents duplicate fetches for the same spot.
- Tide context is heuristic (region/spot profile based), not real-time tide API data.
- Personalization is local-only (browser localStorage), no backend profile sync.
- Theme system uses `data-theme` on `body` with CSS variables for light/dark styling.

## Contributing

- See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
- For larger changes or new features, open an issue first.

## Roadmap & ideas

These are future-work ideas, not currently implemented promises.

- Tide integration per spot, including tide curves and impact hints in surf advice.
- Advanced multi-swell analysis (primary/secondary swell breakdown + direction quality).
- Surf alerts (email/push/in-app) when your preferred conditions become “good”.
- Extra view modes, such as regional heatmaps or score-over-time trend charts.
- Light offline mode: cache latest forecast snapshots for favorite spots.
- Smarter explainability layer for score changes between morning/afternoon/evening.
- Optional mobile app wrapper path (e.g. Capacitor) after web-first maturity.

## Release notes

- See [CHANGELOG.md](CHANGELOG.md) for `v1.0.0`.
