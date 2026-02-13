# README

## FreeSurfCast

FreeSurfCast is een gratis, browser-only surf-forecast webapp met snelle uitleg per spot, gebaseerd op Open-Meteo data.

## Live demo

Probeer FreeSurfCast op [GitHub Pages](https://karimafendi70-sketch.github.io/recorder/).

## Features (huidige staat)

- Kaart + forecast + rating + wind + swell: klik een spot op de kaart of via zoeken en bekijk tijdvakken, surf-rating, windrichting/-kracht en compacte swell-visualisatie.
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
	- Aanbevolen tijdens ontwikkeling: gebruik een kleine lokale dev-server, bijvoorbeeld VS Code Live Server of npx serve.
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

- SURF_SPOTS is de bron voor spotdata en marker-opbouw.
- selectSpot(...) is de centrale selectieflow voor kaart, zoekresultaten, favorieten, deep-link en restore.
- updateForecastForSpot(...) stuurt de forecast-update en UI-rendering aan.
- fetchLiveForecastForSpot(...) haalt live data op bij Open-Meteo en vult snapshots per tijdvak.
- translations met t(...) en setLanguage(...) verzorgen alle meertalige UI-labels.
- localStorage bewaart taal, favorieten en last-used spot.
- forecastCache en pendingForecastRequests beperken onnodige API-calls en dubbele requests.
- resetView houdt de basisweergave consistent bij terugzetten van selectie, filters en kaart.

## Kleine helper-tests

- Run: `node tests/helpers.test.js`
- Deze testset controleert windrichting-formattering, windsnelheid-formattering, swell-intensiteitsklassen op grenswaarden en de helper voor niveau-/conditie-uitdaging.

## Developer scripts (licht)

- Met `npm run serve` start je snel een lokale static server op poort 4173.
- Met `npm run test` draai je de helper-tests.
- Met `npm run lint:js` doe je een lichte JS-syntax-check (`node --check`) op de belangrijkste scripts.
- Deze setup blijft bewust licht: geen bundler, geen zware lint-toolchain.

## Quality & tests

- Basis-a11y is meegenomen: duidelijke focus-states en betekenisvolle aria-labels voor kerncontrols.
- Voor regressiechecks van kernhelpers kun je snel lokaal draaien met `node tests/helpers.test.js`.

## Technische notities

- Open-Meteo endpoints:
	- `https://marine-api.open-meteo.com/v1/marine`
	- `https://api.open-meteo.com/v1/forecast`
- Forecast-caching gebruikt een in-memory `Map` met TTL in `app.js` (`FORECAST_CACHE_TTL_MS`).
- Favorieten worden in de UI alfabetisch gesorteerd voor consistente leesbaarheid.
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
