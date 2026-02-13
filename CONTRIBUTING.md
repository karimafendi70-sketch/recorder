# Contributing

Bedankt voor je interesse in FreeSurfCast.

## Eerst afstemmen

- Open bij grotere wijzigingen of nieuwe features eerst een issue.
- Kleine bugfixes en duidelijke documentatieverbeteringen kun je direct als PR voorstellen.

## Pull requests

- Houd PR's klein, gericht en makkelijk te reviewen.
- Beschrijf duidelijk wat je verandert en waarom.
- Vermijd het combineren van meerdere losse onderwerpen in één PR.

## Code-afspraken

- Geen grote refactors zonder voorafgaand overleg.
- Behoud de bestaande i18n-structuur met translations, t(...) en setLanguage(...).
- Respecteer bestaande UX-flow en patronen zoals selectSpot(...), updateForecastForSpot(...) en resetView(...).
- Volg bestaande naamgeving en patronen in app.js.
- Voeg geen zware nieuwe dependencies toe zonder sterke onderbouwing.

## Validatie

- Draai helper-tests vóór je een PR indient:
  - node tests/helpers.test.js

## Ideeën

- Zoek inspiratie in de Backlog-sectie in README.md.
- Backlog-items zijn ideeën, geen gegarandeerde roadmap.