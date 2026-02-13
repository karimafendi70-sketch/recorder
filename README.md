# README

## FreeSurfCast

FreeSurfCast is een gratis, browser-only surf-forecast webapp met snelle uitleg per spot, gebaseerd op Open-Meteo data en een wereldwijde spotset.

## Live demo

Probeer FreeSurfCast op [GitHub Pages](https://karimafendi70-sketch.github.io/recorder/).

## Features

- Wereldwijde surfspots met regiozoekervaring via kaart en lijst.
- Meerdaags overzicht (3–4 dagen) met min–max golfhoogte en dominante conditie per dag.
- Tijdvakweergave met swell, wind, condities (Clean/Mixed/Choppy) en ratingcontext.
- Slotdetailpaneel met compacte uitleg en advies per geselecteerd tijdvak.
- Conditiefilters: minimaal surfbaar, geschikt voor beginners en voorkeur clean.
- Kaartweergave en lijstweergave met gedeelde dag- en slotselectie.
- Multi-spot overzicht met beste spots voor de actieve dag en kwaliteitsscore.
- Dagelijks surf report per spot/dag met korte tekstsamenvatting.
- PWA-basis: installable app-shell (manifest + service worker), forecasts blijven live.

## How to run

- Vereisten:
	- Node.js 18+ en npm.
	- Moderne browser (Chrome, Edge, Firefox of Safari).
- Installatie:
	- `npm install`
- Lokaal draaien:
	- `npm run serve` (start een static server op poort 4173)
	- Open daarna `http://localhost:4173`
- Tests en checks:
	- `npm run test-helpers`
	- `npm run lint`

## Tech stack

- Vanilla HTML, CSS en JavaScript.
- Leaflet voor kaartweergave en spot-markers.
- Open-Meteo marine + weather endpoints voor live forecast-data.
- PWA-basis met `manifest.json` en `service-worker.js`.
- Lichte tooling: ESLint + helper-tests via Node.

## Screenshots

- Plaats screenshots in `docs/screenshots/` met bijvoorbeeld:
	- `overview-map.png` (dagoverzicht + kaart)
	- `list-slot-detail.png` (lijstweergave + detailpaneel)
	- `multi-spot.png` (multi-spot overzicht)
	- `daily-report-dark.png` (dagrapport in dark mode)

## Project pitch

FreeSurfCast is gebouwd als leer- en portfolio-project: een snelle surf-forecast ervaring zonder zware stack.
De app combineert wereldwijde spots, condition-heuristiek en duidelijke dag/slot-samenvattingen in één compacte UI.
De focus ligt op direct bruikbare surfcontext (niet alleen ruwe data), met extra hulp via filters, detail en surf report.
Logische uitbreidingen zijn getij-data, meer spots/regio’s en aanvullende forecast-bronnen.

## Architectuur (kort)

- SURF_SPOTS is de bron voor wereldwijde spotdata, regio-indeling en marker-opbouw.
- selectSpot(...) is de centrale selectieflow voor kaart, zoekresultaten, favorieten, deep-link en restore.
- updateForecastForSpot(...) stuurt de forecast-update en UI-rendering aan.
- fetchLiveForecastForSpot(...) haalt live data op bij Open-Meteo en vult snapshots per tijdvak.
- Helpers voor conditieclassificatie bepalen per tijdvak een eenvoudige surf-tag op basis van windrichting, windsnelheid, swell en spotoriëntatie.
- Extra filter-state en view-state sturen zowel tijdvakknoppen als compacte lijstrendering op basis van dezelfde live snapshots/helpers.
- Helpers groeperen live slots per dag en dagdeel (`morning`/`afternoon`/`evening`) en voeden daaruit zowel day-overview als tijdvakweergave.
- Dagstate (`currentDayKey`) bepaalt de actieve dag zonder kaart/favorieten/deeplink-flow te breken.
- Centrale slotselectie (`currentSlotKey`) wordt gedeeld tussen tijdvakknoppen, lijstitems en detailpaneel, zodat kaartweergave en lijstweergave exact dezelfde geselecteerde slotcontext tonen.
- Score-helpers (`getSlotQualityScore` en `getSpotDayScore`) bouwen een lichte spotscore op bestaande signalen (condition-tag, swell, windrelatie, challenging-state en actieve filters).
- Multi-spot overzicht rendert top N spots bovenop bestaande forecast-cache/snapshot-helpers en hergebruikt bestaande selectieflow bij klik op een toplijst-item.
- Dagrapport-helpers bouwen per dag/spot een compacte tekstsamenvatting op dezelfde slot-, conditie- en scoredata zonder extra API-calls.
- Manifest (`manifest.json`) en service worker (`service-worker.js`) verzorgen lichte shell-caching van statische assets (geen zware offline forecast-cache).
- translations met t(...) en setLanguage(...) verzorgen alle meertalige UI-labels.
- localStorage bewaart taal, favorieten en last-used spot.
- forecastCache en pendingForecastRequests beperken onnodige API-calls en dubbele requests.
- resetView houdt de basisweergave consistent bij terugzetten van selectie, filters en kaart (met wereld-overzicht voor de map).

## Kleine helper-tests

- Run: `node tests/helpers.test.js`
- Deze testset controleert windrichting-formattering, windsnelheid-formattering, swell-intensiteitsklassen op grenswaarden en de helper voor niveau-/conditie-uitdaging.
- Via npm-script kan ook: `npm run test-helpers`.

## Developer scripts (licht)

- Met `npm run serve` start je snel een lokale static server op poort 4173.
- Met `npm run test` (of `npm run test-helpers`) draai je de helper-tests.
- Met `npm run lint` draai je een minimale ESLint-check op de belangrijkste JS-bestanden.
- Deze setup blijft bewust licht: geen bundler, geen grote toolchain.

## Quality & tests

- Basis-a11y is meegenomen: duidelijke focus-states en betekenisvolle aria-labels voor kerncontrols.
- Voor regressiechecks van kernhelpers kun je snel lokaal draaien met `node tests/helpers.test.js`.
- Voor een basis-lintcheck kun je optioneel `npm install` en daarna `npm run lint` draaien.

## Technische notities

- Open-Meteo endpoints:
	- `https://marine-api.open-meteo.com/v1/marine`
	- `https://api.open-meteo.com/v1/forecast`
- Forecast-caching gebruikt een in-memory `Map` met TTL in `app.js` (`FORECAST_CACHE_TTL_MS`).
- Pending request-dedupe voorkomt dubbele forecast-fetches voor dezelfde spot tijdens gelijktijdige requests.
- Favorieten worden in de UI alfabetisch gesorteerd voor consistente leesbaarheid.
- Zoeksuggesties worden gegroepeerd op regio (Europa, Afrika/Atlantisch, Amerika's, Azië/Oceanië).
- Bij een eerste bezoek zonder opgeslagen taalvoorkeur probeert de app te starten in je browsertaal (indien ondersteund); daarna blijft je eigen taalkeuze leidend.
- Theming gebruikt `data-theme` op de body en CSS-variabelen voor light/dark-styling.

## Contributing

- Richtlijnen voor bijdragen staan in CONTRIBUTING.md.
- Voor grotere wijzigingen of nieuwe features: open eerst een issue.
- Kijk ook naar de Backlog-sectie hieronder voor mogelijke ideeën.

## Ideeën / Backlog (niet gepland)

Deze lijst is een ideeënverzameling en geen harde roadmap.

- Meer wereldwijde surfspots (bijv. VS, Australië, Zuid-Amerika).
- Uitgebreidere swell-analyse (richting, meerdere swell-bronnen).
- Geavanceerdere filters (bijv. getij-info of uitgebreidere niveaufilters).
- Kleine PWA-verbeteringen (installable prompt, eenvoudige offline fallback).
- Eenvoudige end-to-end testflow (bijv. later met Playwright of Cypress).
- Extra accessibility-tuning (screenreader-flow, skip-links, focusroutines).
- Compacte spot-detailkaart met samenvatting per favoriet.

## Release notes

- Zie `CHANGELOG.md` voor de samenvatting van `v1.0.0`.
