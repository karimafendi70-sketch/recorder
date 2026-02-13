# README

## FreeSurfCast

FreeSurfCast is een gratis, browser-only surf-forecast webapp met snelle uitleg per spot, gebaseerd op Open-Meteo data.

## Live demo

Probeer FreeSurfCast op [GitHub Pages](https://karimafendi70-sketch.github.io/recorder/).

## Features (huidige staat)

- Kaart + forecast + rating + wind + swell: klik een spot op de kaart of via zoeken en bekijk tijdvakken, surf-rating, windrichting/-kracht en compacte swell-visualisatie.
- Meertaligheid + filters + persoonlijke state: NL/EN/FR/ES/PT/DE, niveau-filter (Alle niveaus/Beginner/Gevorderd), favorieten, last-used spot en reset-weergave.
- Performance + UX: eenvoudige forecast-caching per spot, responsive layout-polish voor mobiel en duidelijke statusfeedback.

## Lokale run

1. Open `index.html` direct in je browser, of
2. gebruik in VS Code **Open with Live Server**.

## Kleine helper-tests

- Run: `node tests/helpers.test.js`
- Deze testset controleert windrichting-formattering, windsnelheid-formattering, swell-intensiteitsklassen op grenswaarden en de helper voor niveau-/conditie-uitdaging.

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
