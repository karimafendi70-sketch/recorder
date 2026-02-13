# README

## FreeSurfCast

FreeSurfCast is een gratis, browser-only surf-forecast webapp met snelle uitleg per spot, gebaseerd op Open-Meteo data en een wereldwijde spotset.

## Live demo

Probeer FreeSurfCast op [GitHub Pages](https://karimafendi70-sketch.github.io/recorder/).

## Features (huidige staat)

- Kaart + forecast + rating + wind + swell: klik een spot op de kaart of via zoeken en bekijk tijdvakken, surf-rating, windrichting/-kracht en compacte swell-visualisatie.
- Condition-tags per tijdvak: compacte labels (Clean/Choppy/Mixed) op basis van swell + wind versus (ruwe) kustoriëntatie per spot.
- Power-user condities-filters: optionele toggles voor minimaal surfbaar, beginner-vriendelijk en clean-voorkeur zonder de basisflow te verbergen.
- Meerdaags dagoverzicht: compacte 3–4 daagse cards met dagrange (min/max hoogte) en dominante conditie-tag.
- Dagselectie + dagdelen: wissel snel tussen dagen; tijdvakken en lijstweergave tonen dan alleen slots binnen de gekozen dag (ochtend/middag/avond).
- Compacte lijstweergave: naast kaartweergave is er een lijstmodus die per tijdvak snel hoogte/periode, wind en condition-tag toont.
- Rijk slotdetailpaneel: extra laag onder de slots/lijst met uitgebreide swell-, wind- en conditie-uitleg plus korte advieszin per geselecteerd tijdvak (surf-forecast-achtige full-report stijl).
- Multi-spot vergelijking: compact overzicht met topspots voor de actieve dag (huidige spot + favorieten), inclusief eenvoudige 0–10 kwaliteitsscore, beste tijdvak en kerncondities.
- Automatisch dagrapport per spot: korte surf report-tekst per actieve dag/spot met hoogte-range, dominante swell/wind en skill-advies, geïnspireerd op surf-forecast-achtige samenvattingen.
- Installable PWA-basis: manifest + service worker voor app-shell, zodat moderne browsers een install-optie tonen.
- Wereldwijde spots + regiozoekervaring: spots uit Europa, Afrika/Atlantisch, Amerika's en Azië/Oceanië met regio-groepering in suggesties.
- Meertaligheid + filters + persoonlijke state: NL/EN/FR/ES/PT/DE, niveau-filter (Alle niveaus/Beginner/Gevorderd), favorieten, last-used spot en reset-weergave.
- Eenvoudige theme-keuze: handmatige light/dark toggle met behoud van keuze in localStorage.
- UX-details: compacte help-uitleg, subtiele micro-interacties en korte statusmeldingen bij acties.
- Performance + UX: eenvoudige forecast-caching per spot, responsive layout-polish voor mobiel en duidelijke statusfeedback.

## Getting started

- Vereisten:
	- Moderne browser (Chrome, Edge, Firefox, Safari).
	- Optioneel Node.js als je lokale helper-tests wilt draaien.
- Lokaal draaien:
	- Snelste optie: open index.html in je browser.
	- Optioneel via script: `npm run serve` start een kleine lokale dev-server op poort 4173.
	- Aanbevolen tijdens ontwikkeling: gebruik een kleine lokale dev-server (bijv. via `npm run serve` of VS Code Live Server).
- Externe services:
	- De app gebruikt Open-Meteo endpoints direct vanuit de client.
	- Er is geen aparte API-key nodig voor de huidige setup.

## Tech stack

- Frontend:
	- Plain HTML, CSS en JavaScript (geen framework).
	- Leaflet voor kaartweergave en spot-markers.
	- Fetch API voor live data-opvraging.
- Interne structuur:
	- app.js bevat de centrale app-flow (spots, forecast, i18n, state, opslag).
	- style.css bevat layout, component-styling en responsive gedrag.
	- tests/helpers.test.js bevat snelle helper-regressietests.

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
- Donker thema (dark mode) als optionele weergave.
- Kleine PWA-verbeteringen (installable prompt, eenvoudige offline fallback).
- Eenvoudige end-to-end testflow (bijv. later met Playwright of Cypress).
- Extra accessibility-tuning (screenreader-flow, skip-links, focusroutines).
- Compacte spot-detailkaart met samenvatting per favoriet.

## Changelog

- **v0.2.0 – release cleanup & UX maturity**
	- Kaartintegratie afgerond met meerdere Europese spots.
	- Niveau-filter toegevoegd (Beginner/Gevorderd) met context in rating-uitleg.
	- Volledige meertalige UI (NL/EN/FR/ES/PT/DE).
	- Windvisualisatie toegevoegd (richting + kracht met visuele pijl).
	- Swell-/golfvisualisatie toegevoegd (hoogte + periode + compacte intensiteitsbalk).
	- Favorieten, last-used spot en reset-weergave samengebracht in één consistente flow.
	- Eenvoudige forecast-caching per spot geactiveerd voor snellere herselectie.

- **v0.1.x (compact historisch)**
	- v0.1.6: swell + reset-view basis.
	- v0.1.5: meertalige info/disclaimer-sectie.
	- v0.1.4: i18n taal-toggle en vertaalde kern-UI.
	- v0.1.3: niveau-filter in rating-uitleg.
	- v0.1.2: uitbreiding Europese spots.
	- v0.1.1: legend-toggle en mobile polish.
	- v0.1.0: eerste MVP (zoek/suggesties/tijdvakken/rating/favorieten).
