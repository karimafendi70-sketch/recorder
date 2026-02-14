# FreeSurfCast — Demo Script (3–5 minutes)

> Intended for a live walkthrough or screen recording. Speak in a natural, confident tone — no filler words, but keep it conversational.

---

## Opening (~30 seconds)

FreeSurfCast is a personal project I built to solve a simple question every coastal surfer asks: "Is it worth going out today?" It pulls live wave, wind and weather data from the Open-Meteo API, feeds it through a scoring engine that's tuned to your personal surf profile, and gives you a clear 0–100 answer for every time slot. The stack is Next.js with the App Router, TypeScript, pure CSS, Leaflet for the map, and React on the client side. Everything runs without an API key — Open-Meteo is completely free.

---

## Flow

### 1. Home (~30 seconds)

Start on the landing page. Point out:

- The **hero section** with a one-line value proposition.
- The **language toggle** in the top-right corner — click it to switch from English to Dutch and back. The entire interface updates instantly; there's no page reload.
- The **"How it works" steps** below the hero: Pick a spot → Set your profile → Read the score. This is the mental model for the rest of the demo.

### 2. Profile (~45 seconds)

Navigate to **Profile** from the Topbar.

- Show the three preference groups: **skill level** (beginner / intermediate / advanced), **wave-height range** (min and max in meters), and **condition weights** (sliders for wind, swell period, temperature).
- Change the skill level from intermediate to beginner — explain that this shifts the ideal wave range down and adjusts how the scoring engine weighs conditions.
- Emphasize: "Everything you see from here on — scores, rankings, the best-spot pick — is shaped by this profile."

### 3. Forecast (~60 seconds)

Navigate to **Forecast**.

- Use the **SpotSearchBar** to search for a well-known spot (e.g., "Scheveningen" or "Hossegor"). Or open the **SpotBrowser** panel and filter by country and difficulty.
- Once a spot loads, point out:
  - The **DataSourceBadge** — if live data loaded successfully it shows a green "Live data" pill with a timestamp. If the API was unreachable, it gracefully falls back to mock data with a yellow banner. During loading you'll see a brief spinner.
  - The **score cards** for the upcoming time slots — tap one to expand the **ScoreExplainer**, which tells you in plain language why that slot scored the way it did: "Wave height is in your sweet spot, but offshore wind is pushing the score down."
- **Star** the spot to add it to favorites. Show that it now appears in the quick-access list.
- Mention **recent spots**: every spot you view is remembered so you can jump back without searching again.

### 4. Map (~45 seconds)

Navigate to **Map**.

- The map loads with **31 pins** spread across the European Atlantic and North Sea coasts.
- Zoom and pan to show coverage — Portugal, Spain, France, Netherlands, UK, Ireland, and more.
- Click a pin to open its **popup**: spot name, difficulty badge, and an "Open forecast →" button.
- Click that button — it navigates to the Forecast page with the `?spotId=` query parameter pre-filled, and the forecast for that specific spot loads immediately. This is the deep-link between Map and Forecast.

### 5. Insights (~45 seconds)

Navigate to **Insights**.

- The page uses the same live (or fallback) data but compares **all 31 spots at once**.
- Point out the **best-spot badge** at the top — it highlights the single spot that scores highest for your profile right now.
- Scroll to the **ranking table** — every spot sorted by score, so you can quickly scan alternatives.
- Show the **heatmap** — a color grid where rows are spots and columns are time slots. Green cells are high-scoring windows; red cells are poor.
- Mention the **timeline** for individual spots — useful if you want to see how conditions evolve hour by hour.
- Change a profile setting (e.g., increase preferred wave height) and show how the ranking and best-spot pick update in response.

---

## Closing (~30 seconds)

That's FreeSurfCast as it stands today — 31 spots, live data, profile-driven scoring, and a set of views designed to answer "where and when?" as fast as possible. There's plenty of room to grow: push notifications when your favorite spot hits a threshold, user accounts so profiles persist across devices, additional data sources like tide charts and webcam links, and expanding the catalog beyond Europe. Building this taught me a lot about designing scoring systems that feel transparent, handling live-data UX gracefully — loading states, fallbacks, caching — and integrating maps with deep-linked navigation. Thanks for watching.
