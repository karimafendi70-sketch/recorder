# README

## FreeSurfCast (MVP)

FreeSurfCast is een simpele, gratis surf-forecast webapp met focus op UX, geïnspireerd op surf-forecast.com.  
De app draait volledig in de browser op plain HTML/CSS/JavaScript en gebruikt gratis Open-Meteo data.

## Live demo

Probeer FreeSurfCast direct op [GitHub Pages](https://karimafendi70-sketch.github.io/recorder/).

## Belangrijkste features

- Multi-spot surf forecast via Open-Meteo (marine + weer endpoints), zonder API-key.
- Zoekfunctie met:
	- fuzzy zoeken op spotnaam én land,
	- dropdown-suggesties,
	- toetsenbordnavigatie (↑/↓ + Enter).
- Tijdvak-selector:
	- `Nu`, `+3u`, `+6u`, `+9u`,
	- hergebruikt dezelfde opgehaalde API-response (geen extra calls per klik),
	- caching per spot met TTL (standaard 10 minuten).
- Surf-rating:
	- 1–5 sterren,
	- kleurcodes (rood/oranje/groen),
	- korte uitleg: **Waarom deze rating?** met plus- en minpunten.
- Favorieten:
	- spots markeren als favoriet,
	- overzichtslijst met favorieten,
	- opslag in `localStorage` (blijft bewaard na reload).

## Installatie / gebruik

### Voorwaarden

- Alleen een moderne browser (Chrome, Edge, Firefox, Safari).
- Geen backend of server-configuratie nodig.

### Lokaal draaien

1. **Optie 1 (snel):** open `index.html` door te dubbelklikken.
2. **Optie 2 (aanrader in VS Code):**
	 - installeer de Live Server extensie,
	 - rechtsklik op `index.html`,
	 - kies **Open with Live Server**.

Alles draait client-side en werkt direct zodra de pagina opent.

## Technische details (kort)

- Open-Meteo endpoints (globaal):
	- Marine data via `https://marine-api.open-meteo.com/v1/marine`
	- Weerdata via `https://api.open-meteo.com/v1/forecast`
- Surfspots + fallbackdata staan in `spots.js`, met o.a. `id`, `naam`, `land`, `latitude`, `longitude`.
- Caching per spot gebeurt in `app.js` met een `Map` en TTL-constante (`CACHE_TTL_MS`).
- Surf-rating en uitleg worden centraal opgebouwd in:
	- `calculateSurfRating(...)`
	- `buildRatingExplanation(...)`

## Toekomst-ideeën

- Meer surfspots toevoegen.
- Issue #1: kaart met spot-markers staat live en marker-click selecteert nu direct de forecast van die spot.
- Kaartweergave toevoegen (bijv. Leaflet of eenvoudige embed).
- Geavanceerdere surf-rating (extra parameters, per type surfer).
- Responsieve layout verder finetunen.
- Deployen naar GitHub Pages of Vercel.

## Changelog

- **v0.1.1 – Patch**
	- Inklapbare legend toegevoegd onder de surf-rating met toggle **Toon uitleg / Verberg uitleg**.
	- Forecastkaart blijft compacter op kleinere schermen, terwijl alle uitleg beschikbaar blijft.
	- Kleine mobile polish: compactere spacing en kortere NL-teksten voor snellere scanbaarheid.

- **v0.1 – MVP**
	- Eerste werkende versie met:
		- multi-spot live forecast via Open-Meteo (marine + weer);
		- fuzzy zoek + dropdown-suggesties + toetsenbordnavigatie;
		- tijdvak-selector (Nu, +3u, +6u, +9u) met caching en TTL per spot;
		- surf-rating (1–5) met kleurcodes en uitleg “waarom deze rating”;
		- favorieten met localStorage;
		- legend met uitleg van kleurcodes en onshore/offshore.
