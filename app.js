const spotNameEl = document.getElementById('spotName');
const waveHeightEl = document.getElementById('waveHeight');
const wavePeriodEl = document.getElementById('wavePeriod');
const windEl = document.getElementById('wind');
const windIconEl = document.getElementById('windIcon');
const windTextEl = document.getElementById('windText');
const swellBarEl = document.getElementById('swellBar');
const swellTextEl = document.getElementById('swellText');
const conditionTagEl = document.getElementById('conditionTag');
const temperatureEl = document.getElementById('temperature');
const forecastMetaEl = document.getElementById('forecastMeta');
const surfRatingEl = document.getElementById('surfRating');
const ratingExplanationEl = document.getElementById('ratingExplanation');
const appTitleHeadingEl = document.getElementById('appTitleHeading');
const appSubtitleEl = document.getElementById('appSubtitle');
const languageLabelEl = document.getElementById('languageLabel');
const languageSelectEl = document.getElementById('languageSelect');
const languageSwitchEl = document.getElementById('languageSwitch');
const languageCurrentBadgeEl = document.getElementById('languageCurrentBadge');
const themeSwitchEl = document.getElementById('themeSwitch');
const themeLabelEl = document.getElementById('themeLabel');
const themeToggleBtnEl = document.getElementById('themeToggleBtn');
const helpSwitchEl = document.getElementById('helpSwitch');
const helpToggleBtnEl = document.getElementById('helpToggleBtn');
const helpPanelEl = document.getElementById('helpPanel');
const helpIntroLine1El = document.getElementById('helpIntroLine1');
const helpIntroLine2El = document.getElementById('helpIntroLine2');
const helpIntroLine3El = document.getElementById('helpIntroLine3');
const searchSectionEl = document.getElementById('searchSection');
const searchLabelEl = document.getElementById('searchLabel');
const searchButtonTextEl = document.getElementById('searchButton');
const spotMapSectionEl = document.getElementById('spotMapSection');
const spotMapTitleEl = document.getElementById('spotMapTitle');
const spotMapNoteEl = document.getElementById('spotMapNote');
const levelFilterLabelEl = document.getElementById('levelFilterLabel');
const levelFilterContainerEl = document.getElementById('levelFilterContainer');
const levelCurrentBadgeEl = document.getElementById('levelCurrentBadge');
const levelOptionAllEl = document.getElementById('levelOptionAll');
const levelOptionBeginnerEl = document.getElementById('levelOptionBeginner');
const levelOptionAdvancedEl = document.getElementById('levelOptionAdvanced');
const conditionFiltersEl = document.getElementById('conditionFilters');
const filterConditionsTitleEl = document.getElementById('filterConditionsTitle');
const filterMinSurfableEl = document.getElementById('filterMinSurfable');
const filterMinSurfableLabelEl = document.getElementById('filterMinSurfableLabel');
const filterBeginnerFriendlyEl = document.getElementById('filterBeginnerFriendly');
const filterBeginnerFriendlyLabelEl = document.getElementById('filterBeginnerFriendlyLabel');
const filterPreferCleanEl = document.getElementById('filterPreferClean');
const filterPreferCleanLabelEl = document.getElementById('filterPreferCleanLabel');
const noResultsWithFiltersEl = document.getElementById('noResultsWithFilters');
const viewModeContainerEl = document.getElementById('viewModeContainer');
const viewModeLabelEl = document.getElementById('viewModeLabel');
const viewMapBtnEl = document.getElementById('viewMapBtn');
const viewListBtnEl = document.getElementById('viewListBtn');
const forecastListViewEl = document.getElementById('forecastListView');
const forecastSummaryListEl = document.getElementById('forecastSummaryList');
const ratingLegendEl = document.getElementById('ratingLegend');
const legendTitleEl = document.getElementById('legendTitle');
const legendItemGoodEl = document.getElementById('legendItemGood');
const legendItemMediumEl = document.getElementById('legendItemMedium');
const legendItemBadEl = document.getElementById('legendItemBad');
const legendItemOnshoreEl = document.getElementById('legendItemOnshore');
const legendItemOffshoreEl = document.getElementById('legendItemOffshore');
const legendWindExplanationEl = document.getElementById('legendWindExplanation');
const legendSwellExplanationEl = document.getElementById('legendSwellExplanation');
const legendConditionExplanationEl = document.getElementById('legendConditionExplanation');
const forecastLabelWaveHeightEl = document.getElementById('forecastLabelWaveHeight');
const forecastLabelWavePeriodEl = document.getElementById('forecastLabelWavePeriod');
const forecastLabelSwellEl = document.getElementById('forecastLabelSwell');
const forecastLabelWindEl = document.getElementById('forecastLabelWind');
const forecastLabelTemperatureEl = document.getElementById('forecastLabelTemperature');
const favoritesHeadingEl = document.getElementById('favoritesHeading');
const favoritesIntroEl = document.getElementById('favoritesIntro');
const favoritesSectionEl = document.getElementById('favoritesSection');
const infoSectionEl = document.getElementById('infoSection');
const infoHeadingEl = document.getElementById('infoHeading');
const infoLine1El = document.getElementById('infoLine1');
const infoLine2El = document.getElementById('infoLine2');
const infoLine3El = document.getElementById('infoLine3');
const infoLine4El = document.getElementById('infoLine4');
const levelSelectEl = document.getElementById('levelSelect');
const resetViewButtonEl = document.getElementById('resetViewButton');
const legendToggleBtnEl = document.getElementById('legendToggleBtn');
const ratingLegendBodyEl = document.getElementById('ratingLegendBody');
const spotMapEl = document.getElementById('spotMap');
const favoriteToggleBtnEl = document.getElementById('favoriteToggleBtn');
const shareLinkBtnEl = document.getElementById('shareLinkBtn');
const favoritesListEl = document.getElementById('favoritesList');
const dayOverviewEl = document.getElementById('dayOverview');
const dayOverviewTitleEl = document.getElementById('dayOverviewTitle');
const dayOverviewCardsEl = document.getElementById('dayOverviewCards');
const timeSelectorEl = document.getElementById('timeSelector');
const multiSpotOverviewEl = document.getElementById('multiSpotOverview');
const slotDetailEl = document.getElementById('slotDetail');
const dailySurfReportEl = document.getElementById('dailySurfReport');
const timeSlotNowEl = document.getElementById('timeSlotNow');
const timeSlot3hEl = document.getElementById('timeSlot3h');
const timeSlot6hEl = document.getElementById('timeSlot6h');
const timeSlot9hEl = document.getElementById('timeSlot9h');
const timeSlotButtons = Array.from(document.querySelectorAll('.time-slot-btn'));
const searchInputEl = document.getElementById('spotSearch');
const searchButtonEl = document.querySelector('.search-button');
const suggestionsListEl = document.getElementById('suggestionsList');
const searchMessageEl = document.getElementById('searchMessage');
const firstRunHintEl = document.getElementById('firstRunHint');
const statusBarEl = document.getElementById('statusBar');
const MAX_DISTANCE_RATIO = 0.35;
const MIN_ALLOWED_DISTANCE = 1;
const NAME_MATCH_WEIGHT = 1;
const LAND_MATCH_WEIGHT = 1;
const TIME_SLOT_OFFSETS = [0, 3, 6, 9];
const SLOT_STEP_HOURS = 3;
const DAY_OVERVIEW_LIMIT = 4;
const DAY_PART_ORDER = ['morning', 'afternoon', 'evening'];
const DEFAULT_TIME_OFFSET = 0;
const MULTI_SPOT_TOP_LIMIT = 5;
const FORECAST_CACHE_TTL_MS = 5 * 60 * 1000;
const FAVORITES_STORAGE_KEY = 'freeSurfCastFavorites';
const LAST_SPOT_STORAGE_KEY = 'freesurfcastLastSpotId';
const OPEN_METEO_MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const OPEN_METEO_WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const LANGUAGE_STORAGE_KEY = 'freesurfcastLanguage';
const THEME_STORAGE_KEY = 'freesurfcastTheme';
const SUPPORTED_LANGUAGES = ['nl', 'en', 'fr', 'es', 'pt', 'de'];
const SUPPORTED_THEMES = ['light', 'dark'];
const REGION_ORDER = ['eu', 'af', 'am', 'ap'];
const DEFAULT_REGION = 'eu';
const RATING_CLASS_NAMES = ['rating-bad', 'rating-ok', 'rating-good', 'rating-neutral'];
const SLOT_CLASS_NAMES = ['slot-bad', 'slot-ok', 'slot-good', 'slot-neutral'];
const VIEW_MODES = ['map', 'list'];
const TIDE_REGION_BY_APP_REGION = {
  eu: 'north-sea-atlantic',
  af: 'atlantic-open',
  am: 'pacific-mixed',
  ap: 'reef-tropical'
};

const TIDE_REGION_BY_SPOT_ID = {
  'scheveningen-nl': 'north-sea-atlantic',
  'newquay-uk': 'north-sea-atlantic',
  'ericeira-pt': 'atlantic-open',
  'peniche-pt': 'atlantic-open',
  'nazare-pt': 'atlantic-open',
  'pipeline-us-hi': 'pacific-mixed',
  'uluwatu-id': 'reef-tropical'
};

const TIDE_PROFILES_BY_REGION = {
  'north-sea-atlantic': {
    dayPartTideLevel: {
      morning: 'mid',
      afternoon: 'high',
      evening: 'mid'
    },
    preferredLevels: ['mid', 'high']
  },
  'atlantic-open': {
    dayPartTideLevel: {
      morning: 'mid',
      afternoon: 'high',
      evening: 'low'
    },
    preferredLevels: ['mid', 'high']
  },
  'pacific-mixed': {
    dayPartTideLevel: {
      morning: 'high',
      afternoon: 'mid',
      evening: 'low'
    },
    preferredLevels: ['mid', 'high']
  },
  'reef-tropical': {
    dayPartTideLevel: {
      morning: 'mid',
      afternoon: 'mid',
      evening: 'high'
    },
    preferredLevels: ['mid']
  }
};

// Heuristic tide model only: this approximates tide context per region/day-part and is not real-time tide data.
const translations = {
  nl: {
    appTitle: 'FreeSurfCast',
    appSubtitle: 'Gratis surf-forecast met snelle, heldere uitleg.',
    languageLabel: 'Taal / Language',
    searchSectionAria: 'Zoek surfspot',
    searchLabel: 'Zoek een surfspot',
    searchPlaceholder: 'Bijv. Scheveningen of Portugal',
    searchButton: 'Zoeken',
    searchHintDefault: 'Typ een spotnaam en druk op Enter of klik op Zoeken.',
    searchHintNoDirect: 'Geen directe match. Druk op Enter voor een slimme match.',
    searchHintNotFound: 'Geen surfspot gevonden',
    searchSuggestionsCount: '{count} suggestie(s) gevonden.',
    mapSectionAria: 'Kaartweergave surfspots',
    mapTitle: 'Kaartweergave',
    mapNote: 'Klik op een marker om direct die spot te laden.',
    mapAria: 'Kaart met surfspots',
    mapLoadError: 'Kaart kon niet geladen worden.',
    ratingPrefix: 'Surf rating',
    ratingNotAvailable: 'n.v.t.',
    ratingWhyPrefix: 'Waarom deze score?',
    ratingNoDetails: 'Nog geen extra uitleg beschikbaar.',
    ratingLabel1: 'Slecht',
    ratingLabel2: 'Matig',
    ratingLabel3: 'OK',
    ratingLabel4: 'Goed',
    ratingLabel5: 'Top',
    expGoodHeight: '+ goede golfhoogte',
    expDecentHeight: '+ redelijke golfhoogte',
    expTooSmallHeight: '- te kleine golfhoogte',
    expTooHighHeight: '- te hoge golfhoogte',
    expLongPeriod: '+ lange periode',
    expDecentPeriod: '+ redelijke periode',
    expShortPeriod: '- korte periode',
    expLightWind: '+ niet te harde wind',
    expHardWind: '- harde wind',
    expStrongWind: '- vrij stevige wind',
    expGoodWindDir: '+ gunstige windrichting',
    expOnshoreWind: '- onshore windrichting',
    levelLabel: 'Niveau',
    levelAll: 'Alle niveaus',
    levelBeginner: 'Beginner',
    levelAdvanced: 'Gevorderd',
    levelBeginnerChallenging: 'Let op: voor beginners kan dit pittig zijn.',
    levelBeginnerCalm: 'Voor beginners oogt dit meestal vriendelijk.',
    levelAdvancedChallenging: 'Voor gevorderden kan dit juist een mooie uitdaging zijn.',
    levelAdvancedCalm: 'Voor gevorderden zijn dit eerder rustige condities.',
    legendAria: 'Uitleg surfscore en windtermen',
    legendToggleShow: 'Toon uitleg',
    legendToggleHide: 'Verberg uitleg',
    legendTitle: 'Korte legenda',
    legendItemGood: 'Groen (4–5/5): vaak goede surf met gunstige condities.',
    legendItemMedium: 'Oranje (3/5): surfbaar, maar niet op z\'n best.',
    legendItemBad: 'Rood (1–2/5): meestal lastige of mindere condities.',
    legendItemOnshore: 'Onshore: wind richting strand, golven worden vaak rommeliger.',
    legendItemOffshore: 'Offshore: wind van land naar zee, golven worden vaak cleaner.',
    timeSelectorAria: 'Selecteer tijdvak',
    timeNow: 'Nu',
    timePlus3h: '+3u',
    timePlus6h: '+6u',
    timePlus9h: '+9u',
    timeSlotUnavailable: 'Niet beschikbaar voor dit tijdvak',
    forecastWaveHeight: 'Golfhoogte',
    forecastWavePeriod: 'Periode',
    forecastWind: 'Wind',
    forecastTemperature: 'Temperatuur',
    favoritesHeading: 'Jouw favorieten',
    favoritesEmpty: 'Nog geen favorieten',
    favoriteButtonOff: '☆ Favoriet',
    favoriteButtonOn: '★ Favoriet',
    favoriteOpened: 'Favoriet geopend: {spot} ({country})',
    favoriteAdded: 'Favoriet toegevoegd: {spot}',
    favoriteRemoved: 'Favoriet verwijderd: {spot}',
    mapSelected: 'Spot gekozen via kaart: {spot} ({country})',
    searchLoadedVia: 'Forecast geladen via {via}: {spot} ({country})',
    searchBestVia: 'Geen exacte match, beste resultaat via {via}: {spot} ({country})',
    viaName: 'naam',
    viaCountry: 'land',
    liveNoTimeslot: 'Dit tijdvak heeft geen beschikbare live data.',
    forecastMetaMock: 'Bron: mock-data',
    forecastMetaMissingCoords: 'Bron: mock-data (spot mist coördinaten).',
    forecastMetaLoading: 'Live data laden via Open-Meteo voor {spot}...',
    forecastMetaLive: 'Live via Open-Meteo · {timeLabel}',
    forecastMetaError: 'Live API fout voor {spot}, fallback naar mock-data.',
    searchApiError: 'Live API fout voor {spot}. Mock-data gebruikt.',
    fallbackUnknownTime: 'onbekend tijdstip'
  },
  en: {
    appTitle: 'FreeSurfCast', appSubtitle: 'Free surf forecast with fast, clear explanations.', languageLabel: 'Language',
    searchSectionAria: 'Search surf spot', searchLabel: 'Search a surf spot', searchPlaceholder: 'E.g. Scheveningen or Portugal', searchButton: 'Search',
    searchHintDefault: 'Type a spot name and press Enter or click Search.', searchHintNoDirect: 'No direct match. Press Enter for smart matching.', searchHintNotFound: 'No surf spot found', searchSuggestionsCount: '{count} suggestion(s) found.',
    mapSectionAria: 'Surf spot map', mapTitle: 'Map view', mapNote: 'Click a marker to load that spot.', mapAria: 'Map with surf spots', mapLoadError: 'Map could not be loaded.',
    ratingPrefix: 'Surf rating', ratingNotAvailable: 'n/a', ratingWhyPrefix: 'Why this score?', ratingNoDetails: 'No additional explanation available yet.',
    ratingLabel1: 'Poor', ratingLabel2: 'Fair', ratingLabel3: 'OK', ratingLabel4: 'Good', ratingLabel5: 'Great',
    expGoodHeight: '+ good wave height', expDecentHeight: '+ decent wave height', expTooSmallHeight: '- waves too small', expTooHighHeight: '- waves too high', expLongPeriod: '+ long period', expDecentPeriod: '+ decent period', expShortPeriod: '- short period', expLightWind: '+ not too much wind', expHardWind: '- strong wind', expStrongWind: '- fairly strong wind', expGoodWindDir: '+ favorable wind direction', expOnshoreWind: '- onshore wind direction',
    levelLabel: 'Level', levelAll: 'All levels', levelBeginner: 'Beginner', levelAdvanced: 'Advanced', levelBeginnerChallenging: 'Note: this may feel challenging for beginners.', levelBeginnerCalm: 'For beginners, these conditions look manageable.', levelAdvancedChallenging: 'For advanced surfers, this can be a nice challenge.', levelAdvancedCalm: 'For advanced surfers, these are rather mellow conditions.',
    legendAria: 'Surf score and wind legend', legendToggleShow: 'Show explanation', legendToggleHide: 'Hide explanation', legendTitle: 'Quick legend', legendItemGood: 'Green (4–5/5): often good surf with favorable conditions.', legendItemMedium: 'Orange (3/5): surfable, but not at its best.', legendItemBad: 'Red (1–2/5): often tricky or weak conditions.', legendItemOnshore: 'Onshore: wind blows toward shore, waves often get messier.', legendItemOffshore: 'Offshore: wind blows from land to sea, waves are often cleaner.',
    timeSelectorAria: 'Select time slot', timeNow: 'Now', timePlus3h: '+3h', timePlus6h: '+6h', timePlus9h: '+9h', timeSlotUnavailable: 'Not available for this time slot', forecastWaveHeight: 'Wave height', forecastWavePeriod: 'Period', forecastWind: 'Wind', forecastTemperature: 'Temperature', favoritesHeading: 'Your favorites', favoritesEmpty: 'No favorites yet', favoriteButtonOff: '☆ Favorite', favoriteButtonOn: '★ Favorite', favoriteOpened: 'Favorite opened: {spot} ({country})', favoriteAdded: 'Favorite added: {spot}', favoriteRemoved: 'Favorite removed: {spot}', mapSelected: 'Spot selected via map: {spot} ({country})', searchLoadedVia: 'Forecast loaded via {via}: {spot} ({country})', searchBestVia: 'No exact match, best result via {via}: {spot} ({country})', viaName: 'name', viaCountry: 'country', liveNoTimeslot: 'This time slot has no live data available.', forecastMetaMock: 'Source: mock data', forecastMetaMissingCoords: 'Source: mock data (spot has no coordinates).', forecastMetaLoading: 'Loading live data from Open-Meteo for {spot}...', forecastMetaLive: 'Live via Open-Meteo · {timeLabel}', forecastMetaError: 'Live API error for {spot}, fallback to mock data.', searchApiError: 'Live API error for {spot}. Using mock data.', fallbackUnknownTime: 'unknown time'
  },
  fr: {
    appTitle: 'FreeSurfCast', appSubtitle: 'Prévision surf gratuite avec explications claires.', languageLabel: 'Langue', searchSectionAria: 'Recherche spot de surf', searchLabel: 'Rechercher un spot', searchPlaceholder: 'Ex. Scheveningen ou Portugal', searchButton: 'Rechercher', searchHintDefault: 'Tapez un spot puis Entrée ou Rechercher.', searchHintNoDirect: 'Pas de correspondance directe. Appuyez sur Entrée pour une recherche intelligente.', searchHintNotFound: 'Aucun spot trouvé', searchSuggestionsCount: '{count} suggestion(s) trouvée(s).', mapSectionAria: 'Carte des spots', mapTitle: 'Vue carte', mapNote: 'Cliquez sur un marqueur pour charger ce spot.', mapAria: 'Carte avec spots de surf', mapLoadError: 'Carte indisponible.', ratingPrefix: 'Score surf', ratingNotAvailable: 'n.d.', ratingWhyPrefix: 'Pourquoi ce score ?', ratingNoDetails: 'Pas encore d\'explication supplémentaire.', ratingLabel1: 'Faible', ratingLabel2: 'Moyen', ratingLabel3: 'OK', ratingLabel4: 'Bon', ratingLabel5: 'Top', expGoodHeight: '+ bonne hauteur de vagues', expDecentHeight: '+ hauteur correcte', expTooSmallHeight: '- vagues trop petites', expTooHighHeight: '- vagues trop hautes', expLongPeriod: '+ longue période', expDecentPeriod: '+ période correcte', expShortPeriod: '- période courte', expLightWind: '+ vent modéré', expHardWind: '- vent fort', expStrongWind: '- vent assez fort', expGoodWindDir: '+ direction favorable', expOnshoreWind: '- vent onshore', levelLabel: 'Niveau', levelAll: 'Tous niveaux', levelBeginner: 'Débutant', levelAdvanced: 'Avancé', levelBeginnerChallenging: 'Attention : cela peut être exigeant pour un débutant.', levelBeginnerCalm: 'Pour un débutant, ces conditions restent accessibles.', levelAdvancedChallenging: 'Pour un surfeur avancé, c\'est un bon défi.', levelAdvancedCalm: 'Pour un surfeur avancé, c\'est plutôt calme.', legendAria: 'Légende score surf et vent', legendToggleShow: 'Afficher l\'explication', legendToggleHide: 'Masquer l\'explication', legendTitle: 'Légende rapide', legendItemGood: 'Vert (4–5/5) : souvent de bonnes conditions.', legendItemMedium: 'Orange (3/5) : surfable, sans être optimal.', legendItemBad: 'Rouge (1–2/5) : conditions souvent faibles ou difficiles.', legendItemOnshore: 'Onshore : vent vers la plage, vagues plus désordonnées.', legendItemOffshore: 'Offshore : vent de la terre vers la mer, vagues plus propres.', timeSelectorAria: 'Choisir un créneau', timeNow: 'Maintenant', timePlus3h: '+3h', timePlus6h: '+6h', timePlus9h: '+9h', timeSlotUnavailable: 'Indisponible pour ce créneau', forecastWaveHeight: 'Hauteur', forecastWavePeriod: 'Période', forecastWind: 'Vent', forecastTemperature: 'Température', favoritesHeading: 'Vos favoris', favoritesEmpty: 'Aucun favori', favoriteButtonOff: '☆ Favori', favoriteButtonOn: '★ Favori', favoriteOpened: 'Favori ouvert : {spot} ({country})', favoriteAdded: 'Favori ajouté : {spot}', favoriteRemoved: 'Favori retiré : {spot}', mapSelected: 'Spot choisi via la carte : {spot} ({country})', searchLoadedVia: 'Prévision chargée via {via} : {spot} ({country})', searchBestVia: 'Pas de correspondance exacte, meilleur résultat via {via} : {spot} ({country})', viaName: 'nom', viaCountry: 'pays', liveNoTimeslot: 'Aucune donnée live pour ce créneau.', forecastMetaMock: 'Source : données mock', forecastMetaMissingCoords: 'Source : données mock (coordonnées manquantes).', forecastMetaLoading: 'Chargement live Open-Meteo pour {spot}...', forecastMetaLive: 'Live via Open-Meteo · {timeLabel}', forecastMetaError: 'Erreur API live pour {spot}, retour aux données mock.', searchApiError: 'Erreur API live pour {spot}. Données mock utilisées.', fallbackUnknownTime: 'heure inconnue'
  },
  es: {
    appTitle: 'FreeSurfCast', appSubtitle: 'Pronóstico de surf gratis con explicaciones claras.', languageLabel: 'Idioma', searchSectionAria: 'Buscar spot de surf', searchLabel: 'Buscar un spot', searchPlaceholder: 'Ej. Scheveningen o Portugal', searchButton: 'Buscar', searchHintDefault: 'Escribe un spot y pulsa Enter o Buscar.', searchHintNoDirect: 'Sin coincidencia directa. Pulsa Enter para coincidencia inteligente.', searchHintNotFound: 'No se encontró ningún spot', searchSuggestionsCount: '{count} sugerencia(s) encontrada(s).', mapSectionAria: 'Mapa de spots', mapTitle: 'Vista de mapa', mapNote: 'Haz clic en un marcador para cargar ese spot.', mapAria: 'Mapa con spots de surf', mapLoadError: 'No se pudo cargar el mapa.', ratingPrefix: 'Valoración surf', ratingNotAvailable: 'n/d', ratingWhyPrefix: '¿Por qué esta puntuación?', ratingNoDetails: 'Aún no hay explicación adicional.', ratingLabel1: 'Malo', ratingLabel2: 'Regular', ratingLabel3: 'OK', ratingLabel4: 'Bueno', ratingLabel5: 'Top', expGoodHeight: '+ buena altura', expDecentHeight: '+ altura aceptable', expTooSmallHeight: '- olas muy pequeñas', expTooHighHeight: '- olas muy grandes', expLongPeriod: '+ período largo', expDecentPeriod: '+ período aceptable', expShortPeriod: '- período corto', expLightWind: '+ viento moderado', expHardWind: '- viento fuerte', expStrongWind: '- viento bastante fuerte', expGoodWindDir: '+ dirección favorable', expOnshoreWind: '- viento onshore', levelLabel: 'Nivel', levelAll: 'Todos los niveles', levelBeginner: 'Principiante', levelAdvanced: 'Avanzado', levelBeginnerChallenging: 'Ojo: para principiantes puede ser exigente.', levelBeginnerCalm: 'Para principiantes, suele verse manejable.', levelAdvancedChallenging: 'Para avanzados, puede ser un buen reto.', levelAdvancedCalm: 'Para avanzados, son condiciones más tranquilas.', legendAria: 'Leyenda de puntuación y viento', legendToggleShow: 'Mostrar explicación', legendToggleHide: 'Ocultar explicación', legendTitle: 'Leyenda rápida', legendItemGood: 'Verde (4–5/5): condiciones normalmente buenas.', legendItemMedium: 'Naranja (3/5): surfeable, pero no ideal.', legendItemBad: 'Rojo (1–2/5): condiciones flojas o difíciles.', legendItemOnshore: 'Onshore: viento hacia la costa, olas más desordenadas.', legendItemOffshore: 'Offshore: viento de tierra al mar, olas más limpias.', timeSelectorAria: 'Seleccionar franja horaria', timeNow: 'Ahora', timePlus3h: '+3h', timePlus6h: '+6h', timePlus9h: '+9h', timeSlotUnavailable: 'No disponible para esta franja', forecastWaveHeight: 'Altura de ola', forecastWavePeriod: 'Período', forecastWind: 'Viento', forecastTemperature: 'Temperatura', favoritesHeading: 'Tus favoritos', favoritesEmpty: 'Aún no hay favoritos', favoriteButtonOff: '☆ Favorito', favoriteButtonOn: '★ Favorito', favoriteOpened: 'Favorito abierto: {spot} ({country})', favoriteAdded: 'Favorito añadido: {spot}', favoriteRemoved: 'Favorito eliminado: {spot}', mapSelected: 'Spot elegido en el mapa: {spot} ({country})', searchLoadedVia: 'Pronóstico cargado por {via}: {spot} ({country})', searchBestVia: 'Sin coincidencia exacta, mejor resultado por {via}: {spot} ({country})', viaName: 'nombre', viaCountry: 'país', liveNoTimeslot: 'Esta franja no tiene datos en vivo.', forecastMetaMock: 'Fuente: datos mock', forecastMetaMissingCoords: 'Fuente: datos mock (spot sin coordenadas).', forecastMetaLoading: 'Cargando datos en vivo de Open-Meteo para {spot}...', forecastMetaLive: 'En vivo vía Open-Meteo · {timeLabel}', forecastMetaError: 'Error de API en vivo para {spot}, usando mock.', searchApiError: 'Error de API en vivo para {spot}. Usando mock.', fallbackUnknownTime: 'hora desconocida'
  },
  pt: {
    appTitle: 'FreeSurfCast', appSubtitle: 'Previsão de surf gratuita com explicações claras.', languageLabel: 'Idioma', searchSectionAria: 'Pesquisar pico de surf', searchLabel: 'Pesquisar um pico', searchPlaceholder: 'Ex.: Scheveningen ou Portugal', searchButton: 'Pesquisar', searchHintDefault: 'Digite um pico e pressione Enter ou Pesquisar.', searchHintNoDirect: 'Sem correspondência direta. Pressione Enter para busca inteligente.', searchHintNotFound: 'Nenhum pico encontrado', searchSuggestionsCount: '{count} sugestão(ões) encontrada(s).', mapSectionAria: 'Mapa de picos', mapTitle: 'Mapa', mapNote: 'Clique num marcador para carregar esse pico.', mapAria: 'Mapa com picos de surf', mapLoadError: 'Não foi possível carregar o mapa.', ratingPrefix: 'Classificação do surf', ratingNotAvailable: 'n/d', ratingWhyPrefix: 'Por que esta pontuação?', ratingNoDetails: 'Sem explicação adicional no momento.', ratingLabel1: 'Fraco', ratingLabel2: 'Médio', ratingLabel3: 'OK', ratingLabel4: 'Bom', ratingLabel5: 'Ótimo', expGoodHeight: '+ boa altura de onda', expDecentHeight: '+ altura razoável', expTooSmallHeight: '- ondas muito pequenas', expTooHighHeight: '- ondas muito grandes', expLongPeriod: '+ período longo', expDecentPeriod: '+ período razoável', expShortPeriod: '- período curto', expLightWind: '+ vento moderado', expHardWind: '- vento forte', expStrongWind: '- vento relativamente forte', expGoodWindDir: '+ direção favorável', expOnshoreWind: '- vento onshore', levelLabel: 'Nível', levelAll: 'Todos os níveis', levelBeginner: 'Iniciante', levelAdvanced: 'Avançado', levelBeginnerChallenging: 'Atenção: para iniciantes pode ser puxado.', levelBeginnerCalm: 'Para iniciantes, tende a ser mais tranquilo.', levelAdvancedChallenging: 'Para avançados, pode ser um bom desafio.', levelAdvancedCalm: 'Para avançados, são condições mais calmas.', legendAria: 'Legenda de pontuação e vento', legendToggleShow: 'Mostrar explicação', legendToggleHide: 'Ocultar explicação', legendTitle: 'Legenda rápida', legendItemGood: 'Verde (4–5/5): normalmente boas condições.', legendItemMedium: 'Laranja (3/5): surfável, mas não ideal.', legendItemBad: 'Vermelho (1–2/5): condições fracas ou difíceis.', legendItemOnshore: 'Onshore: vento para a praia, ondas mais mexidas.', legendItemOffshore: 'Offshore: vento da terra para o mar, ondas mais limpas.', timeSelectorAria: 'Selecionar horário', timeNow: 'Agora', timePlus3h: '+3h', timePlus6h: '+6h', timePlus9h: '+9h', timeSlotUnavailable: 'Indisponível para este horário', forecastWaveHeight: 'Altura da onda', forecastWavePeriod: 'Período', forecastWind: 'Vento', forecastTemperature: 'Temperatura', favoritesHeading: 'Seus favoritos', favoritesEmpty: 'Ainda sem favoritos', favoriteButtonOff: '☆ Favorito', favoriteButtonOn: '★ Favorito', favoriteOpened: 'Favorito aberto: {spot} ({country})', favoriteAdded: 'Favorito adicionado: {spot}', favoriteRemoved: 'Favorito removido: {spot}', mapSelected: 'Pico escolhido no mapa: {spot} ({country})', searchLoadedVia: 'Previsão carregada por {via}: {spot} ({country})', searchBestVia: 'Sem correspondência exata, melhor resultado por {via}: {spot} ({country})', viaName: 'nome', viaCountry: 'país', liveNoTimeslot: 'Este horário não tem dados ao vivo.', forecastMetaMock: 'Fonte: dados mock', forecastMetaMissingCoords: 'Fonte: dados mock (pico sem coordenadas).', forecastMetaLoading: 'Carregando dados ao vivo do Open-Meteo para {spot}...', forecastMetaLive: 'Ao vivo via Open-Meteo · {timeLabel}', forecastMetaError: 'Erro da API ao vivo para {spot}, usando mock.', searchApiError: 'Erro da API ao vivo para {spot}. Usando mock.', fallbackUnknownTime: 'horário desconhecido'
  },
  de: {
    appTitle: 'FreeSurfCast', appSubtitle: 'Kostenlose Surf-Vorhersage mit klaren Erklärungen.', languageLabel: 'Sprache', searchSectionAria: 'Surfspot suchen', searchLabel: 'Einen Surfspot suchen', searchPlaceholder: 'Z. B. Scheveningen oder Portugal', searchButton: 'Suchen', searchHintDefault: 'Spot eingeben und Enter drücken oder Suchen klicken.', searchHintNoDirect: 'Keine direkte Übereinstimmung. Enter für smarte Suche drücken.', searchHintNotFound: 'Kein Surfspot gefunden', searchSuggestionsCount: '{count} Vorschlag/Vorschläge gefunden.', mapSectionAria: 'Surfspot-Karte', mapTitle: 'Kartenansicht', mapNote: 'Marker anklicken, um den Spot zu laden.', mapAria: 'Karte mit Surfspots', mapLoadError: 'Karte konnte nicht geladen werden.', ratingPrefix: 'Surf-Bewertung', ratingNotAvailable: 'k. A.', ratingWhyPrefix: 'Warum diese Bewertung?', ratingNoDetails: 'Noch keine zusätzliche Erklärung verfügbar.', ratingLabel1: 'Schlecht', ratingLabel2: 'Mäßig', ratingLabel3: 'OK', ratingLabel4: 'Gut', ratingLabel5: 'Top', expGoodHeight: '+ gute Wellenhöhe', expDecentHeight: '+ ordentliche Wellenhöhe', expTooSmallHeight: '- Wellen zu klein', expTooHighHeight: '- Wellen zu hoch', expLongPeriod: '+ lange Periode', expDecentPeriod: '+ ordentliche Periode', expShortPeriod: '- kurze Periode', expLightWind: '+ nicht zu starker Wind', expHardWind: '- starker Wind', expStrongWind: '- recht kräftiger Wind', expGoodWindDir: '+ günstige Windrichtung', expOnshoreWind: '- onshore Windrichtung', levelLabel: 'Niveau', levelAll: 'Alle Niveaus', levelBeginner: 'Anfänger', levelAdvanced: 'Fortgeschritten', levelBeginnerChallenging: 'Hinweis: Für Anfänger kann das anspruchsvoll sein.', levelBeginnerCalm: 'Für Anfänger wirken die Bedingungen meist machbar.', levelAdvancedChallenging: 'Für Fortgeschrittene kann das eine gute Herausforderung sein.', levelAdvancedCalm: 'Für Fortgeschrittene sind das eher ruhige Bedingungen.', legendAria: 'Legende für Surfscore und Wind', legendToggleShow: 'Erklärung anzeigen', legendToggleHide: 'Erklärung ausblenden', legendTitle: 'Kurze Legende', legendItemGood: 'Grün (4–5/5): oft gute Bedingungen.', legendItemMedium: 'Orange (3/5): surfbar, aber nicht optimal.', legendItemBad: 'Rot (1–2/5): oft schwierig oder schwach.', legendItemOnshore: 'Onshore: Wind Richtung Strand, Wellen oft unruhiger.', legendItemOffshore: 'Offshore: Wind von Land aufs Meer, Wellen oft sauberer.', timeSelectorAria: 'Zeitfenster wählen', timeNow: 'Jetzt', timePlus3h: '+3h', timePlus6h: '+6h', timePlus9h: '+9h', timeSlotUnavailable: 'Für dieses Zeitfenster nicht verfügbar', forecastWaveHeight: 'Wellenhöhe', forecastWavePeriod: 'Periode', forecastWind: 'Wind', forecastTemperature: 'Temperatur', favoritesHeading: 'Deine Favoriten', favoritesEmpty: 'Noch keine Favoriten', favoriteButtonOff: '☆ Favorit', favoriteButtonOn: '★ Favorit', favoriteOpened: 'Favorit geöffnet: {spot} ({country})', favoriteAdded: 'Favorit hinzugefügt: {spot}', favoriteRemoved: 'Favorit entfernt: {spot}', mapSelected: 'Spot über Karte gewählt: {spot} ({country})', searchLoadedVia: 'Vorhersage geladen über {via}: {spot} ({country})', searchBestVia: 'Keine exakte Übereinstimmung, bestes Ergebnis über {via}: {spot} ({country})', viaName: 'Name', viaCountry: 'Land', liveNoTimeslot: 'Für dieses Zeitfenster sind keine Live-Daten verfügbar.', forecastMetaMock: 'Quelle: Mock-Daten', forecastMetaMissingCoords: 'Quelle: Mock-Daten (Spot ohne Koordinaten).', forecastMetaLoading: 'Live-Daten von Open-Meteo für {spot} werden geladen ...', forecastMetaLive: 'Live über Open-Meteo · {timeLabel}', forecastMetaError: 'Live-API-Fehler für {spot}, Fallback auf Mock-Daten.', searchApiError: 'Live-API-Fehler für {spot}. Mock-Daten werden verwendet.', fallbackUnknownTime: 'unbekannte Zeit'
  }
};

const infoTranslations = {
  nl: {
    infoSectionAria: 'Over FreeSurfCast en disclaimer',
    infoHeading: 'Over FreeSurfCast',
    infoLine1: 'FreeSurfCast helpt surfers snel een gevoel te krijgen bij de verwachte condities.',
    infoLine2: 'Forecasts en ratings zijn indicatief en geen officiële waarschuwing.',
    infoLine3: 'Controleer altijd lokale omstandigheden, weerberichten en veiligheidsinformatie.',
    infoLine4: 'Gebruik van deze app en surfen gebeurt op eigen risico; dit is een hobbyproject.'
  },
  en: {
    infoSectionAria: 'About FreeSurfCast and disclaimer',
    infoHeading: 'About FreeSurfCast',
    infoLine1: 'FreeSurfCast helps surfers quickly get a feel for expected conditions.',
    infoLine2: 'Forecasts and ratings are indicative and not an official warning.',
    infoLine3: 'Always check local conditions, weather updates, and safety information.',
    infoLine4: 'Using this app and surfing are at your own risk; this is a hobby project.'
  },
  fr: {
    infoSectionAria: 'À propos de FreeSurfCast et avertissement',
    infoHeading: 'À propos de FreeSurfCast',
    infoLine1: 'FreeSurfCast aide les surfeurs à évaluer rapidement les conditions attendues.',
    infoLine2: 'Les prévisions et notes sont indicatives et ne sont pas une alerte officielle.',
    infoLine3: 'Vérifiez toujours les conditions locales, la météo et les infos de sécurité.',
    infoLine4: 'L\'usage de cette app et le surf se font à vos risques; c\'est un projet hobby.'
  },
  es: {
    infoSectionAria: 'Acerca de FreeSurfCast y descargo de responsabilidad',
    infoHeading: 'Acerca de FreeSurfCast',
    infoLine1: 'FreeSurfCast ayuda a los surfistas a hacerse una idea rápida de las condiciones.',
    infoLine2: 'Las previsiones y valoraciones son orientativas y no son una alerta oficial.',
    infoLine3: 'Consulta siempre condiciones locales, partes meteorológicos y seguridad.',
    infoLine4: 'Usar esta app y surfear es bajo tu propio riesgo; es un proyecto hobby.'
  },
  pt: {
    infoSectionAria: 'Sobre o FreeSurfCast e aviso',
    infoHeading: 'Sobre o FreeSurfCast',
    infoLine1: 'O FreeSurfCast ajuda surfistas a ter uma leitura rápida das condições esperadas.',
    infoLine2: 'Previsões e classificações são indicativas e não são aviso oficial.',
    infoLine3: 'Verifique sempre condições locais, meteorologia e informação de segurança.',
    infoLine4: 'O uso desta app e o surf são por sua conta e risco; é um projeto hobby.'
  },
  de: {
    infoSectionAria: 'Über FreeSurfCast und Haftungsausschluss',
    infoHeading: 'Über FreeSurfCast',
    infoLine1: 'FreeSurfCast hilft Surfern, die erwarteten Bedingungen schnell einzuschätzen.',
    infoLine2: 'Vorhersagen und Bewertungen sind Richtwerte und keine offizielle Warnung.',
    infoLine3: 'Prüfe immer lokale Bedingungen, Wetterinfos und Sicherheitsmeldungen.',
    infoLine4: 'Nutzung dieser App und Surfen erfolgen auf eigenes Risiko; dies ist ein Hobbyprojekt.'
  }
};

const windTranslations = {
  nl: { windLabel: 'Wind' },
  en: { windLabel: 'Wind' },
  fr: { windLabel: 'Vent' },
  es: { windLabel: 'Viento' },
  pt: { windLabel: 'Vento' },
  de: { windLabel: 'Wind' }
};

const favoritesTranslations = {
  nl: {
    favoritesIntro: 'Markeer spots als favoriet; ze verschijnen hier automatisch.',
    favoritesEmptyHint: 'Tik op ☆ Favoriet bij een spot om je lijst op te bouwen.'
  },
  en: {
    favoritesIntro: 'Mark spots as favorites; they appear here automatically.',
    favoritesEmptyHint: 'Use ☆ Favorite on a spot to build your list.'
  },
  fr: {
    favoritesIntro: 'Ajoutez des spots en favoris; ils apparaissent ici automatiquement.',
    favoritesEmptyHint: 'Utilisez ☆ Favori sur un spot pour créer votre liste.'
  },
  es: {
    favoritesIntro: 'Marca spots como favoritos; aparecerán aquí automáticamente.',
    favoritesEmptyHint: 'Usa ☆ Favorito en un spot para crear tu lista.'
  },
  pt: {
    favoritesIntro: 'Marque picos como favoritos; eles aparecem aqui automaticamente.',
    favoritesEmptyHint: 'Use ☆ Favorito num pico para montar sua lista.'
  },
  de: {
    favoritesIntro: 'Markiere Spots als Favoriten; sie erscheinen hier automatisch.',
    favoritesEmptyHint: 'Nutze ☆ Favorit bei einem Spot, um deine Liste aufzubauen.'
  }
};

const swellTranslations = {
  nl: {
    swellLabel: 'Golven',
    resetViewLabel: 'Reset weergave',
    resetViewAria: 'Reset spot, tijdvak, niveau en kaartweergave',
    resetViewDone: 'Weergave teruggezet naar basisstand.'
  },
  en: {
    swellLabel: 'Swell',
    resetViewLabel: 'Reset view',
    resetViewAria: 'Reset spot, time slot, level, and map view',
    resetViewDone: 'View reset to default state.'
  },
  fr: {
    swellLabel: 'Vagues',
    resetViewLabel: 'Réinitialiser la vue',
    resetViewAria: 'Réinitialiser spot, créneau, niveau et carte',
    resetViewDone: 'Vue réinitialisée à l\'état par défaut.'
  },
  es: {
    swellLabel: 'Oleaje',
    resetViewLabel: 'Restablecer vista',
    resetViewAria: 'Restablecer spot, franja, nivel y mapa',
    resetViewDone: 'Vista restablecida al estado base.'
  },
  pt: {
    swellLabel: 'Ondulação',
    resetViewLabel: 'Repor vista',
    resetViewAria: 'Repor pico, horário, nível e mapa',
    resetViewDone: 'Vista reposta ao estado base.'
  },
  de: {
    swellLabel: 'Wellen',
    resetViewLabel: 'Ansicht zurücksetzen',
    resetViewAria: 'Spot, Zeitfenster, Niveau und Karte zurücksetzen',
    resetViewDone: 'Ansicht auf Standard zurückgesetzt.'
  }
};

const accessibilityTranslations = {
  nl: {
    favoriteToggleAriaAdd: 'Markeer {spot} als favoriet',
    favoriteToggleAriaRemove: 'Verwijder {spot} uit favorieten'
  },
  en: {
    favoriteToggleAriaAdd: 'Mark {spot} as favorite',
    favoriteToggleAriaRemove: 'Remove {spot} from favorites'
  },
  fr: {
    favoriteToggleAriaAdd: 'Marquer {spot} en favori',
    favoriteToggleAriaRemove: 'Retirer {spot} des favoris'
  },
  es: {
    favoriteToggleAriaAdd: 'Marcar {spot} como favorito',
    favoriteToggleAriaRemove: 'Quitar {spot} de favoritos'
  },
  pt: {
    favoriteToggleAriaAdd: 'Marcar {spot} como favorito',
    favoriteToggleAriaRemove: 'Remover {spot} dos favoritos'
  },
  de: {
    favoriteToggleAriaAdd: '{spot} als Favorit markieren',
    favoriteToggleAriaRemove: '{spot} aus Favoriten entfernen'
  }
};

const shareTranslations = {
  nl: {
    shareLinkLabel: 'Kopieer link',
    shareLinkCopied: 'Link gekopieerd'
  },
  en: {
    shareLinkLabel: 'Copy link',
    shareLinkCopied: 'Link copied'
  },
  fr: {
    shareLinkLabel: 'Copier le lien',
    shareLinkCopied: 'Lien copié'
  },
  es: {
    shareLinkLabel: 'Copiar enlace',
    shareLinkCopied: 'Enlace copiado'
  },
  pt: {
    shareLinkLabel: 'Copiar link',
    shareLinkCopied: 'Link copiado'
  },
  de: {
    shareLinkLabel: 'Link kopieren',
    shareLinkCopied: 'Link kopiert'
  }
};

const legendHelpTranslations = {
  nl: {
    legendWindExplanation: 'Pijl = windrichting (wijst waar de wind naartoe waait).',
    legendSwellExplanation: 'Swellbalk = relatieve golfhoogte (laag/medium/hoog/zeer hoog).'
  },
  en: {
    legendWindExplanation: 'Arrow = wind direction (shows where the wind is blowing to).',
    legendSwellExplanation: 'Swell bar = relative wave height (low/medium/high/very high).'
  },
  fr: {
    legendWindExplanation: 'Flèche = direction du vent (indique où le vent souffle).',
    legendSwellExplanation: 'Barre de houle = hauteur relative des vagues (faible/moyenne/haute/très haute).'
  },
  es: {
    legendWindExplanation: 'Flecha = dirección del viento (indica hacia dónde sopla).',
    legendSwellExplanation: 'Barra de oleaje = altura relativa de ola (baja/media/alta/muy alta).'
  },
  pt: {
    legendWindExplanation: 'Seta = direção do vento (mostra para onde o vento sopra).',
    legendSwellExplanation: 'Barra de ondulação = altura relativa da onda (baixa/média/alta/muito alta).'
  },
  de: {
    legendWindExplanation: 'Pfeil = Windrichtung (zeigt, wohin der Wind weht).',
    legendSwellExplanation: 'Swell-Balken = relative Wellenhöhe (niedrig/mittel/hoch/sehr hoch).'
  }
};

const conditionTranslations = {
  nl: {
    conditionClean: 'Clean',
    conditionMixed: 'Mixed',
    conditionChoppy: 'Choppy',
    legendConditionExplanation: 'Condities: Clean = vaker offshore/rustiger, Choppy = vaker onshore/rommeliger, Mixed = ertussenin.'
  },
  en: {
    conditionClean: 'Clean',
    conditionMixed: 'Mixed',
    conditionChoppy: 'Choppy',
    legendConditionExplanation: 'Conditions: Clean = more often offshore/calmer, Choppy = more often onshore/messier, Mixed = in-between.'
  },
  fr: {
    conditionClean: 'Clean',
    conditionMixed: 'Mixed',
    conditionChoppy: 'Choppy',
    legendConditionExplanation: 'Conditions : Clean = plutôt offshore/calme, Choppy = plutôt onshore/désordonné, Mixed = intermédiaire.'
  },
  es: {
    conditionClean: 'Clean',
    conditionMixed: 'Mixed',
    conditionChoppy: 'Choppy',
    legendConditionExplanation: 'Condiciones: Clean = más offshore/calma, Choppy = más onshore/revuelto, Mixed = intermedio.'
  },
  pt: {
    conditionClean: 'Clean',
    conditionMixed: 'Mixed',
    conditionChoppy: 'Choppy',
    legendConditionExplanation: 'Condições: Clean = mais offshore/calmo, Choppy = mais onshore/mexido, Mixed = intermédio.'
  },
  de: {
    conditionClean: 'Clean',
    conditionMixed: 'Mixed',
    conditionChoppy: 'Choppy',
    legendConditionExplanation: 'Bedingungen: Clean = eher offshore/ruhiger, Choppy = eher onshore/unruhiger, Mixed = dazwischen.'
  }
};

const powerUserTranslations = {
  nl: {
    filterConditionsTitle: 'Condities',
    filterMinSurfable: 'Minimaal surfbaar',
    filterBeginnerFriendly: 'Geschikt voor beginners',
    filterPreferClean: 'Voorkeur clean',
    noResultsWithFilters: 'Geen tijdvakken voldoen aan deze filters.',
    viewModeLabel: 'Weergave',
    viewMap: 'Kaartweergave',
    viewList: 'Lijstweergave',
    dayOverviewTitle: 'Overzicht komende dagen',
    dayPartMorning: 'Ochtend',
    dayPartAfternoon: 'Middag',
    dayPartEvening: 'Avond',
    dayToday: 'Vandaag',
    dayTomorrow: 'Morgen',
    detailTitle: 'Slotdetails',
    detailSwellLabel: 'Swell',
    detailWindLabel: 'Wind',
    detailConditionsLabel: 'Condities',
    detailAdviceLabel: 'Advies',
    detailSelectPrompt: 'Selecteer een tijdvak voor extra detail.',
    detailNoResults: 'Geen details beschikbaar met de huidige filters. Pas filters aan.',
    detailSummaryLine: '{windText} met {swellText}, overwegend {conditionText}.',
    detailAdviceBeginner: 'Meestal geschikt voor beginners.',
    detailAdviceIntermediate: 'Geschikter voor intermediate surfers.',
    detailAdviceAdvanced: 'Vooral geschikt voor gevorderde surfers.',
    detailWindLight: 'lichte',
    detailWindModerate: 'matige',
    detailWindStrong: 'sterke',
    detailWindOffshore: 'offshore',
    detailWindOnshore: 'onshore',
    detailWindCross: 'cross',
    multiSpotOverviewTitle: 'Beste spots voor deze dag',
    multiSpotScoreLabel: 'Score',
    multiSpotBestTimeLabel: 'Beste tijd',
    multiSpotHint: 'Gebaseerd op swell, wind en condities (Clean/Mixed/Choppy). Actieve filters tellen mee.',
    multiSpotNoData: 'Nog geen vergelijkbare spots met voldoende data.',
    multiSpotLoading: 'Spots vergelijken...'
  },
  en: {
    filterConditionsTitle: 'Conditions',
    filterMinSurfable: 'Minimally surfable',
    filterBeginnerFriendly: 'Beginner friendly',
    filterPreferClean: 'Prefer clean',
    noResultsWithFilters: 'No time slots match these filters.',
    viewModeLabel: 'View',
    viewMap: 'Map view',
    viewList: 'List view',
    dayOverviewTitle: 'Upcoming days',
    dayPartMorning: 'Morning',
    dayPartAfternoon: 'Afternoon',
    dayPartEvening: 'Evening',
    dayToday: 'Today',
    dayTomorrow: 'Tomorrow',
    detailTitle: 'Slot details',
    detailSwellLabel: 'Swell',
    detailWindLabel: 'Wind',
    detailConditionsLabel: 'Conditions',
    detailAdviceLabel: 'Advice',
    detailSelectPrompt: 'Select a time slot to see more detail.',
    detailNoResults: 'No details available with current filters. Adjust filters to continue.',
    detailSummaryLine: '{windText} with {swellText}, mostly {conditionText}.',
    detailAdviceBeginner: 'Usually suitable for beginners.',
    detailAdviceIntermediate: 'Better suited for intermediate surfers.',
    detailAdviceAdvanced: 'Mostly suitable for advanced surfers.',
    detailWindLight: 'light',
    detailWindModerate: 'moderate',
    detailWindStrong: 'strong',
    detailWindOffshore: 'offshore',
    detailWindOnshore: 'onshore',
    detailWindCross: 'cross',
    multiSpotOverviewTitle: 'Best spots for this day',
    multiSpotScoreLabel: 'Score',
    multiSpotBestTimeLabel: 'Best time',
    multiSpotHint: 'Based on swell, wind, and conditions (Clean/Mixed/Choppy). Active filters are included.',
    multiSpotNoData: 'No comparable spots with enough data yet.',
    multiSpotLoading: 'Comparing spots...'
  },
  fr: {
    filterConditionsTitle: 'Conditions',
    filterMinSurfable: 'Minimum surfable',
    filterBeginnerFriendly: 'Adapté débutant',
    filterPreferClean: 'Préférence clean',
    noResultsWithFilters: 'Aucun créneau ne correspond à ces filtres.',
    viewModeLabel: 'Affichage',
    viewMap: 'Vue carte',
    viewList: 'Vue liste',
    dayOverviewTitle: 'Aperçu des prochains jours',
    dayPartMorning: 'Matin',
    dayPartAfternoon: 'Après-midi',
    dayPartEvening: 'Soir',
    dayToday: 'Aujourd\'hui',
    dayTomorrow: 'Demain',
    detailTitle: 'Détails du créneau',
    detailSwellLabel: 'Houle',
    detailWindLabel: 'Vent',
    detailConditionsLabel: 'Condition',
    detailAdviceLabel: 'Conseil',
    detailSelectPrompt: 'Sélectionnez un créneau pour plus de détails.',
    detailNoResults: 'Aucun détail disponible avec ces filtres. Ajustez les filtres.',
    detailSummaryLine: '{windText} avec {swellText}, plutôt {conditionText}.',
    detailAdviceBeginner: 'Souvent adapté aux débutants.',
    detailAdviceIntermediate: 'Plutôt pour niveau intermédiaire.',
    detailAdviceAdvanced: 'Surtout adapté aux surfeurs avancés.',
    detailWindLight: 'vent léger',
    detailWindModerate: 'vent modéré',
    detailWindStrong: 'vent fort',
    detailWindOffshore: 'offshore',
    detailWindOnshore: 'onshore',
    detailWindCross: 'cross',
    multiSpotOverviewTitle: 'Meilleurs spots pour ce jour',
    multiSpotScoreLabel: 'Score',
    multiSpotBestTimeLabel: 'Meilleure heure',
    multiSpotHint: 'Basé sur la houle, le vent et les conditions (Clean/Mixed/Choppy). Filtres actifs inclus.',
    multiSpotNoData: 'Pas encore de spots comparables avec assez de données.',
    multiSpotLoading: 'Comparaison des spots...'
  },
  es: {
    filterConditionsTitle: 'Condiciones',
    filterMinSurfable: 'Mínimo surfeable',
    filterBeginnerFriendly: 'Apto para principiantes',
    filterPreferClean: 'Preferir clean',
    noResultsWithFilters: 'Ninguna franja coincide con estos filtros.',
    viewModeLabel: 'Vista',
    viewMap: 'Vista de mapa',
    viewList: 'Vista de lista',
    dayOverviewTitle: 'Resumen próximos días',
    dayPartMorning: 'Mañana',
    dayPartAfternoon: 'Tarde',
    dayPartEvening: 'Noche',
    dayToday: 'Hoy',
    dayTomorrow: 'Mañana',
    detailTitle: 'Detalle del slot',
    detailSwellLabel: 'Oleaje',
    detailWindLabel: 'Viento',
    detailConditionsLabel: 'Condición',
    detailAdviceLabel: 'Consejo',
    detailSelectPrompt: 'Selecciona una franja para ver más detalle.',
    detailNoResults: 'No hay detalles disponibles con estos filtros. Ajusta los filtros.',
    detailSummaryLine: '{windText} con {swellText}, mayormente {conditionText}.',
    detailAdviceBeginner: 'Normalmente apto para principiantes.',
    detailAdviceIntermediate: 'Más adecuado para nivel intermedio.',
    detailAdviceAdvanced: 'Principalmente para surfistas avanzados.',
    detailWindLight: 'viento suave',
    detailWindModerate: 'viento moderado',
    detailWindStrong: 'viento fuerte',
    detailWindOffshore: 'offshore',
    detailWindOnshore: 'onshore',
    detailWindCross: 'cross',
    multiSpotOverviewTitle: 'Mejores spots para este día',
    multiSpotScoreLabel: 'Puntuación',
    multiSpotBestTimeLabel: 'Mejor hora',
    multiSpotHint: 'Basado en oleaje, viento y condiciones (Clean/Mixed/Choppy). Incluye filtros activos.',
    multiSpotNoData: 'Aún no hay spots comparables con datos suficientes.',
    multiSpotLoading: 'Comparando spots...'
  },
  pt: {
    filterConditionsTitle: 'Condições',
    filterMinSurfable: 'Minimamente surfável',
    filterBeginnerFriendly: 'Adequado a iniciantes',
    filterPreferClean: 'Preferir clean',
    noResultsWithFilters: 'Nenhum horário corresponde a estes filtros.',
    viewModeLabel: 'Visualização',
    viewMap: 'Vista de mapa',
    viewList: 'Vista de lista',
    dayOverviewTitle: 'Resumo dos próximos dias',
    dayPartMorning: 'Manhã',
    dayPartAfternoon: 'Tarde',
    dayPartEvening: 'Noite',
    dayToday: 'Hoje',
    dayTomorrow: 'Amanhã',
    detailTitle: 'Detalhe do slot',
    detailSwellLabel: 'Ondulação',
    detailWindLabel: 'Vento',
    detailConditionsLabel: 'Condição',
    detailAdviceLabel: 'Conselho',
    detailSelectPrompt: 'Selecione um horário para ver mais detalhe.',
    detailNoResults: 'Sem detalhes disponíveis com estes filtros. Ajuste os filtros.',
    detailSummaryLine: '{windText} com {swellText}, maioritariamente {conditionText}.',
    detailAdviceBeginner: 'Normalmente adequado para iniciantes.',
    detailAdviceIntermediate: 'Mais adequado para nível intermédio.',
    detailAdviceAdvanced: 'Principalmente para surfistas avançados.',
    detailWindLight: 'vento fraco',
    detailWindModerate: 'vento moderado',
    detailWindStrong: 'vento forte',
    detailWindOffshore: 'offshore',
    detailWindOnshore: 'onshore',
    detailWindCross: 'cross',
    multiSpotOverviewTitle: 'Melhores spots para este dia',
    multiSpotScoreLabel: 'Pontuação',
    multiSpotBestTimeLabel: 'Melhor horário',
    multiSpotHint: 'Baseado em ondulação, vento e condições (Clean/Mixed/Choppy). Inclui filtros ativos.',
    multiSpotNoData: 'Ainda sem spots comparáveis com dados suficientes.',
    multiSpotLoading: 'Comparando spots...'
  },
  de: {
    filterConditionsTitle: 'Bedingungen',
    filterMinSurfable: 'Mindestens surfbar',
    filterBeginnerFriendly: 'Anfängerfreundlich',
    filterPreferClean: 'Clean bevorzugen',
    noResultsWithFilters: 'Keine Zeitfenster passen zu diesen Filtern.',
    viewModeLabel: 'Ansicht',
    viewMap: 'Kartenansicht',
    viewList: 'Listenansicht',
    dayOverviewTitle: 'Übersicht der nächsten Tage',
    dayPartMorning: 'Morgen',
    dayPartAfternoon: 'Nachmittag',
    dayPartEvening: 'Abend',
    dayToday: 'Heute',
    dayTomorrow: 'Morgen',
    detailTitle: 'Slot-Details',
    detailSwellLabel: 'Swell',
    detailWindLabel: 'Wind',
    detailConditionsLabel: 'Bedingung',
    detailAdviceLabel: 'Hinweis',
    detailSelectPrompt: 'Wähle ein Zeitfenster für mehr Details.',
    detailNoResults: 'Keine Details mit den aktuellen Filtern verfügbar. Filter anpassen.',
    detailSummaryLine: '{windText} mit {swellText}, überwiegend {conditionText}.',
    detailAdviceBeginner: 'Meist für Anfänger geeignet.',
    detailAdviceIntermediate: 'Eher für Fortgeschrittene geeignet.',
    detailAdviceAdvanced: 'Vor allem für erfahrene Surfer geeignet.',
    detailWindLight: 'leichter',
    detailWindModerate: 'mäßiger',
    detailWindStrong: 'starker',
    detailWindOffshore: 'offshore',
    detailWindOnshore: 'onshore',
    detailWindCross: 'cross',
    multiSpotOverviewTitle: 'Beste Spots für diesen Tag',
    multiSpotScoreLabel: 'Score',
    multiSpotBestTimeLabel: 'Beste Zeit',
    multiSpotHint: 'Basiert auf Swell, Wind und Bedingungen (Clean/Mixed/Choppy). Aktive Filter zählen mit.',
    multiSpotNoData: 'Noch keine vergleichbaren Spots mit ausreichenden Daten.',
    multiSpotLoading: 'Spots werden verglichen...'
  }
};

const themeTranslations = {
  nl: {
    themeToggleLabel: 'Thema',
    themeLight: 'Licht',
    themeDark: 'Donker',
    themeToggleAria: 'Wissel tussen licht en donker thema'
  },
  en: {
    themeToggleLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeToggleAria: 'Switch between light and dark theme'
  },
  fr: {
    themeToggleLabel: 'Thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeToggleAria: 'Basculer entre thème clair et sombre'
  },
  es: {
    themeToggleLabel: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeToggleAria: 'Cambiar entre tema claro y oscuro'
  },
  pt: {
    themeToggleLabel: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    themeToggleAria: 'Alternar entre tema claro e escuro'
  },
  de: {
    themeToggleLabel: 'Thema',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    themeToggleAria: 'Zwischen hellem und dunklem Thema wechseln'
  }
};

const dailyReportTranslations = {
  nl: {
    dailyReportHeading: 'Surfverslag',
    dailyReportInsufficient: 'Onvoldoende data voor een dagrapport.',
    dailyReportScorePrefix: 'Dagscore',
    dailyReportWindPrefix: 'Wind',
    skillAdviceBeginner: 'meestal geschikt voor beginners',
    skillAdviceIntermediate: 'het beste voor intermediate surfers',
    skillAdviceAdvanced: 'vooral geschikt voor gevorderden'
  },
  en: {
    dailyReportHeading: 'Surf report',
    dailyReportInsufficient: 'Not enough data for a daily surf report.',
    dailyReportScorePrefix: 'Day score',
    dailyReportWindPrefix: 'Wind',
    skillAdviceBeginner: 'usually suitable for beginners',
    skillAdviceIntermediate: 'best for intermediate surfers',
    skillAdviceAdvanced: 'mostly suitable for advanced surfers'
  },
  fr: {
    dailyReportHeading: 'Surf report',
    dailyReportInsufficient: 'Not enough data for a daily surf report.',
    dailyReportScorePrefix: 'Day score',
    dailyReportWindPrefix: 'Wind',
    skillAdviceBeginner: 'usually suitable for beginners',
    skillAdviceIntermediate: 'best for intermediate surfers',
    skillAdviceAdvanced: 'mostly suitable for advanced surfers'
  },
  es: {
    dailyReportHeading: 'Surf report',
    dailyReportInsufficient: 'Not enough data for a daily surf report.',
    dailyReportScorePrefix: 'Day score',
    dailyReportWindPrefix: 'Wind',
    skillAdviceBeginner: 'usually suitable for beginners',
    skillAdviceIntermediate: 'best for intermediate surfers',
    skillAdviceAdvanced: 'mostly suitable for advanced surfers'
  },
  pt: {
    dailyReportHeading: 'Surf report',
    dailyReportInsufficient: 'Not enough data for a daily surf report.',
    dailyReportScorePrefix: 'Day score',
    dailyReportWindPrefix: 'Wind',
    skillAdviceBeginner: 'usually suitable for beginners',
    skillAdviceIntermediate: 'best for intermediate surfers',
    skillAdviceAdvanced: 'mostly suitable for advanced surfers'
  },
  de: {
    dailyReportHeading: 'Surf report',
    dailyReportInsufficient: 'Not enough data for a daily surf report.',
    dailyReportScorePrefix: 'Day score',
    dailyReportWindPrefix: 'Wind',
    skillAdviceBeginner: 'usually suitable for beginners',
    skillAdviceIntermediate: 'best for intermediate surfers',
    skillAdviceAdvanced: 'mostly suitable for advanced surfers'
  }
};

const tideTranslations = {
  nl: {
    detailTideLabel: 'Getij',
    tideLow: 'Laag',
    tideMid: 'Mid',
    tideHigh: 'Hoog',
    tideBestMidHigh: 'Werkt meestal het best van mid tot hoog water.',
    tideLessIdealNow: 'Het huidige getij is mogelijk minder ideaal voor deze spot.',
    tideNoContext: 'Geen getijcontext beschikbaar.',
    detailTideSupportive: 'Getij ondersteunt dit tijdvak meestal voor de meeste surfers.',
    detailTideTrickier: 'Getij kan dit tijdvak lastiger maken, vooral in de shorebreak.',
    dailyReportTideMostly: 'Getij: vooral {tideLabel} water tijdens de belangrijkste surfmomenten.',
    dailyReportTideSupportive: 'De meeste sessies vallen in het voorkeurvenster van dit spot-profiel.',
    dailyReportTideLessIdeal: 'Een deel van de sessies valt buiten het voorkeurvenster van dit spot-profiel.'
  },
  en: {
    detailTideLabel: 'Tide',
    tideLow: 'Low',
    tideMid: 'Mid',
    tideHigh: 'High',
    tideBestMidHigh: 'Works best from mid to high tide.',
    tideLessIdealNow: 'Current tide may be less ideal for this spot.',
    tideNoContext: 'No tide context available.',
    detailTideSupportive: 'Tide conditions are supportive for this time slot.',
    detailTideTrickier: 'Tide might make this time slot trickier near shorebreak.',
    dailyReportTideMostly: 'Tide: mostly {tideLabel} water during the main surf windows.',
    dailyReportTideSupportive: 'Most sessions align with this spot profile\'s preferred tide window.',
    dailyReportTideLessIdeal: 'Some sessions fall outside this spot profile\'s preferred tide window.'
  },
  fr: {
    detailTideLabel: 'Tide',
    tideLow: 'Low',
    tideMid: 'Mid',
    tideHigh: 'High',
    tideBestMidHigh: 'Works best from mid to high tide.',
    tideLessIdealNow: 'Current tide may be less ideal for this spot.',
    tideNoContext: 'No tide context available.',
    detailTideSupportive: 'Tide conditions are supportive for this time slot.',
    detailTideTrickier: 'Tide might make this time slot trickier near shorebreak.',
    dailyReportTideMostly: 'Tide: mostly {tideLabel} water during the main surf windows.',
    dailyReportTideSupportive: 'Most sessions align with this spot profile\'s preferred tide window.',
    dailyReportTideLessIdeal: 'Some sessions fall outside this spot profile\'s preferred tide window.'
  },
  es: {
    detailTideLabel: 'Tide',
    tideLow: 'Low',
    tideMid: 'Mid',
    tideHigh: 'High',
    tideBestMidHigh: 'Works best from mid to high tide.',
    tideLessIdealNow: 'Current tide may be less ideal for this spot.',
    tideNoContext: 'No tide context available.',
    detailTideSupportive: 'Tide conditions are supportive for this time slot.',
    detailTideTrickier: 'Tide might make this time slot trickier near shorebreak.',
    dailyReportTideMostly: 'Tide: mostly {tideLabel} water during the main surf windows.',
    dailyReportTideSupportive: 'Most sessions align with this spot profile\'s preferred tide window.',
    dailyReportTideLessIdeal: 'Some sessions fall outside this spot profile\'s preferred tide window.'
  },
  pt: {
    detailTideLabel: 'Tide',
    tideLow: 'Low',
    tideMid: 'Mid',
    tideHigh: 'High',
    tideBestMidHigh: 'Works best from mid to high tide.',
    tideLessIdealNow: 'Current tide may be less ideal for this spot.',
    tideNoContext: 'No tide context available.',
    detailTideSupportive: 'Tide conditions are supportive for this time slot.',
    detailTideTrickier: 'Tide might make this time slot trickier near shorebreak.',
    dailyReportTideMostly: 'Tide: mostly {tideLabel} water during the main surf windows.',
    dailyReportTideSupportive: 'Most sessions align with this spot profile\'s preferred tide window.',
    dailyReportTideLessIdeal: 'Some sessions fall outside this spot profile\'s preferred tide window.'
  },
  de: {
    detailTideLabel: 'Tide',
    tideLow: 'Low',
    tideMid: 'Mid',
    tideHigh: 'High',
    tideBestMidHigh: 'Works best from mid to high tide.',
    tideLessIdealNow: 'Current tide may be less ideal for this spot.',
    tideNoContext: 'No tide context available.',
    detailTideSupportive: 'Tide conditions are supportive for this time slot.',
    detailTideTrickier: 'Tide might make this time slot trickier near shorebreak.',
    dailyReportTideMostly: 'Tide: mostly {tideLabel} water during the main surf windows.',
    dailyReportTideSupportive: 'Most sessions align with this spot profile\'s preferred tide window.',
    dailyReportTideLessIdeal: 'Some sessions fall outside this spot profile\'s preferred tide window.'
  }
};

const helpTranslations = {
  nl: {
    helpToggleLabel: 'Help',
    helpToggleHide: 'Sluit help',
    helpIntroLine1: '1. Kies een spot via kaart, zoeken of favorieten.',
    helpIntroLine2: '2. Bekijk forecast, wind en swell per tijdvak.',
    helpIntroLine3: '3. Gebruik niveau, taal, thema, reset en deel-link voor je flow.',
    firstRunHint: 'Tip: kies een spot op de kaart of via zoeken om snel te starten.'
  },
  en: {
    helpToggleLabel: 'Help',
    helpToggleHide: 'Close help',
    helpIntroLine1: '1. Pick a spot via map, search, or favorites.',
    helpIntroLine2: '2. Check forecast, wind, and swell per time slot.',
    helpIntroLine3: '3. Use level, language, theme, reset, and share-link for your flow.',
    firstRunHint: 'Tip: pick a spot via the map or search to get started quickly.'
  },
  fr: {
    helpToggleLabel: 'Aide',
    helpToggleHide: 'Fermer l\'aide',
    helpIntroLine1: '1. Choisissez un spot via la carte, la recherche ou les favoris.',
    helpIntroLine2: '2. Consultez prévision, vent et houle par créneau.',
    helpIntroLine3: '3. Utilisez niveau, langue, thème, reset et lien de partage.',
    firstRunHint: 'Astuce : choisissez un spot via la carte ou la recherche pour commencer vite.'
  },
  es: {
    helpToggleLabel: 'Ayuda',
    helpToggleHide: 'Cerrar ayuda',
    helpIntroLine1: '1. Elige un spot por mapa, búsqueda o favoritos.',
    helpIntroLine2: '2. Revisa pronóstico, viento y oleaje por franja.',
    helpIntroLine3: '3. Usa nivel, idioma, tema, reset y enlace compartible.',
    firstRunHint: 'Consejo: elige un spot en el mapa o con búsqueda para empezar rápido.'
  },
  pt: {
    helpToggleLabel: 'Ajuda',
    helpToggleHide: 'Fechar ajuda',
    helpIntroLine1: '1. Escolha um pico pelo mapa, busca ou favoritos.',
    helpIntroLine2: '2. Veja previsão, vento e ondulação por horário.',
    helpIntroLine3: '3. Use nível, idioma, tema, reset e link de partilha.',
    firstRunHint: 'Dica: escolha um pico no mapa ou na busca para começar rápido.'
  },
  de: {
    helpToggleLabel: 'Hilfe',
    helpToggleHide: 'Hilfe schließen',
    helpIntroLine1: '1. Wähle einen Spot über Karte, Suche oder Favoriten.',
    helpIntroLine2: '2. Sieh Vorhersage, Wind und Swell pro Zeitfenster.',
    helpIntroLine3: '3. Nutze Niveau, Sprache, Thema, Reset und Share-Link.',
    firstRunHint: 'Tipp: Wähle einen Spot über Karte oder Suche für einen schnellen Start.'
  }
};

const statusTranslations = {
  nl: {
    statusLinkCopied: 'Link gekopieerd',
    statusViewReset: 'Weergave teruggezet naar basisstand.'
  },
  en: {
    statusLinkCopied: 'Link copied',
    statusViewReset: 'View reset to default state.'
  },
  fr: {
    statusLinkCopied: 'Lien copié',
    statusViewReset: 'Vue réinitialisée à l\'état par défaut.'
  },
  es: {
    statusLinkCopied: 'Enlace copiado',
    statusViewReset: 'Vista restablecida al estado base.'
  },
  pt: {
    statusLinkCopied: 'Link copiado',
    statusViewReset: 'Vista reposta ao estado base.'
  },
  de: {
    statusLinkCopied: 'Link kopiert',
    statusViewReset: 'Ansicht auf Standard zurückgesetzt.'
  }
};

const regionTranslations = {
  nl: {
    regionEurope: 'Europa',
    regionAfricaAtlantic: 'Afrika/Atlantisch',
    regionAmericas: 'Amerika\'s',
    regionAsiaPacific: 'Azië/Oceanië'
  },
  en: {
    regionEurope: 'Europe',
    regionAfricaAtlantic: 'Africa/Atlantic',
    regionAmericas: 'Americas',
    regionAsiaPacific: 'Asia/Oceania'
  },
  fr: {
    regionEurope: 'Europe',
    regionAfricaAtlantic: 'Afrique/Atlantique',
    regionAmericas: 'Amériques',
    regionAsiaPacific: 'Asie/Océanie'
  },
  es: {
    regionEurope: 'Europa',
    regionAfricaAtlantic: 'África/Atlántico',
    regionAmericas: 'Américas',
    regionAsiaPacific: 'Asia/Oceanía'
  },
  pt: {
    regionEurope: 'Europa',
    regionAfricaAtlantic: 'África/Atlântico',
    regionAmericas: 'Américas',
    regionAsiaPacific: 'Ásia/Oceania'
  },
  de: {
    regionEurope: 'Europa',
    regionAfricaAtlantic: 'Afrika/Atlantik',
    regionAmericas: 'Amerika',
    regionAsiaPacific: 'Asien/Ozeanien'
  }
};

Object.entries(infoTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(windTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(favoritesTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(swellTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(accessibilityTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(shareTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(legendHelpTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(conditionTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(powerUserTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(themeTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(helpTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(dailyReportTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(tideTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(statusTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

Object.entries(regionTranslations).forEach(([lang, extraKeys]) => {
  if (translations[lang]) {
    Object.assign(translations[lang], extraKeys);
  }
});

let currentSuggestions = [];
let activeSuggestionIndex = -1;
let liveRequestId = 0;
let activeTimeOffset = 0;
let activeLiveCache = null;
const forecastCache = new Map();
const pendingForecastRequests = new Map();
const favoriteSpotIds = new Set();
const mapMarkersBySpotKey = new Map();
let spotMapInstance = null;
let activeMapMarker = null;
let activeSpot = null;
let currentLevel = 'all';
let latestRatingConditions = null;
let currentLanguage = 'nl';
let currentTheme = 'light';
let statusMessageTimeoutId = null;
let shouldShowFirstRunHint = false;
let currentView = 'map';
let activeConditionFilters = {
  minSurfable: false,
  beginnerFriendly: false,
  preferClean: false
};
let currentDayKey = null;
let preferredInitialOffset = null;
let currentSlotKey = null;
let preferredSlotOffset = null;
let multiSpotRenderRequestId = 0;

function t(key, vars = {}) {
  const languagePack = translations[currentLanguage] ?? translations.nl;
  const fallbackPack = translations.nl;
  let template = languagePack[key] ?? fallbackPack[key] ?? key;

  Object.entries(vars).forEach(([variable, value]) => {
    template = template.replaceAll(`{${variable}}`, String(value));
  });

  return template;
}

function getLocaleForLanguage() {
  const localeByLanguage = {
    nl: 'nl-NL',
    en: 'en-GB',
    fr: 'fr-FR',
    es: 'es-ES',
    pt: 'pt-PT',
    de: 'de-DE'
  };

  return localeByLanguage[currentLanguage] ?? 'nl-NL';
}

function normalizeWindDegrees(degrees) {
  if (!Number.isFinite(degrees)) return null;
  const normalized = ((degrees % 360) + 360) % 360;
  return Math.round(normalized);
}

function directionToDegrees(direction) {
  if (typeof direction !== 'string') return null;

  const normalizedDirection = direction.trim().toUpperCase();
  const degreesByDirection = {
    N: 0,
    NO: 45,
    NE: 45,
    O: 90,
    E: 90,
    ZO: 135,
    SE: 135,
    Z: 180,
    S: 180,
    ZW: 225,
    SW: 225,
    W: 270,
    NW: 315
  };

  return degreesByDirection[normalizedDirection] ?? null;
}

function formatWindDirection(directionOrDegrees) {
  const degrees = Number.isFinite(directionOrDegrees)
    ? normalizeWindDegrees(directionOrDegrees)
    : directionToDegrees(directionOrDegrees);

  if (!Number.isFinite(degrees)) {
    if (typeof directionOrDegrees === 'string' && directionOrDegrees.trim()) {
      return directionOrDegrees.trim().toUpperCase();
    }
    return '-';
  }

  const compassDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return compassDirections[index];
}

function formatWindSpeed(speedValue) {
  if (!Number.isFinite(speedValue)) return '-';
  return `${Math.round(speedValue)} kn`;
}

function getSwellClassName(waveHeight) {
  if (!Number.isFinite(waveHeight)) return 'swell-low';
  if (waveHeight < 0.8) return 'swell-low';
  if (waveHeight < 1.6) return 'swell-med';
  if (waveHeight < 2.6) return 'swell-high';
  return 'swell-very-high';
}

function getAngularDifferenceDegrees(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  const normalizedA = normalizeWindDegrees(a);
  const normalizedB = normalizeWindDegrees(b);
  const diff = Math.abs(normalizedA - normalizedB);
  return Math.min(diff, 360 - diff);
}

function getCoastOrientationDeg(spot) {
  const explicitOrientation = normalizeWindDegrees(spot?.coastOrientationDeg);
  if (Number.isFinite(explicitOrientation)) {
    return explicitOrientation;
  }

  const regionDefaults = {
    eu: 270,
    af: 300,
    am: 240,
    ap: 135
  };

  const region = getSpotRegion(spot);
  return regionDefaults[region] ?? 270;
}

function getWindRelativeToCoast(coastOrientationDeg, windDirectionDeg) {
  if (!Number.isFinite(coastOrientationDeg) || !Number.isFinite(windDirectionDeg)) {
    return 'cross';
  }

  const onshoreCenter = normalizeWindDegrees(coastOrientationDeg);
  const offshoreCenter = normalizeWindDegrees(coastOrientationDeg + 180);
  const onshoreDiff = getAngularDifferenceDegrees(windDirectionDeg, onshoreCenter);
  const offshoreDiff = getAngularDifferenceDegrees(windDirectionDeg, offshoreCenter);

  if (offshoreDiff <= 45) return 'offshore';
  if (onshoreDiff <= 45) return 'onshore';
  return 'cross';
}

function getSurfConditionTag(snapshot) {
  if (!snapshot) return 'mixed';

  const windDirectionDeg = getWindDegreesForSpot(snapshot);
  const windSpeed = snapshot.windSnelheidKnopen;
  const waveHeight = snapshot.golfHoogteMeter;
  const coastOrientation = getCoastOrientationDeg(snapshot);
  const windRelative = getWindRelativeToCoast(coastOrientation, windDirectionDeg);
  const hasSteadySwell = Number.isFinite(waveHeight) && waveHeight >= 0.8;
  const hardWind = Number.isFinite(windSpeed) && windSpeed >= 17;
  const moderateWind = Number.isFinite(windSpeed) && windSpeed <= 14;
  const challenging = isChallengingConditions(snapshot);

  if (windRelative === 'onshore' || hardWind) {
    return 'choppy';
  }

  if (windRelative === 'offshore' && moderateWind && hasSteadySwell && !challenging) {
    return 'clean';
  }

  return 'mixed';
}

function getConditionLabelKey(tag) {
  if (tag === 'clean') return 'conditionClean';
  if (tag === 'choppy') return 'conditionChoppy';
  return 'conditionMixed';
}

function isMinSurfableConditions(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;

  return Number.isFinite(waveHeight) && Number.isFinite(wavePeriod) && waveHeight >= 0.9 && wavePeriod >= 7;
}

function getLiveSlotContext(offsetHours) {
  if (!activeLiveCache) return null;

  const snapshot = getLiveSnapshotForOffset(offsetHours);
  if (!snapshot) return null;

  const mergedSpot = mergeWithFallbackSpot(activeLiveCache.spot, snapshot.values);
  const conditionTag = getSurfConditionTag(mergedSpot);
  const tideLevel = getTideLevelForSlot(activeLiveCache.spot, {
    time: snapshot.time,
    dayPart: getDayPart(snapshot.time)
  });
  const tideSuitability = getTideSuitabilityForSlot(activeLiveCache.spot, {
    time: snapshot.time,
    dayPart: getDayPart(snapshot.time)
  });

  return {
    offsetHours,
    time: snapshot.time,
    dayKey: getLocalDateKey(snapshot.time),
    dayPart: getDayPart(snapshot.time),
    values: snapshot.values,
    mergedSpot,
    conditionTag,
    tideLevel,
    tideSuitability,
    minSurfable: isMinSurfableConditions(snapshot.values),
    challenging: isChallengingConditions(snapshot.values)
  };
}

function getLocalDateKey(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayPart(timestamp) {
  if (!timestamp) return 'evening';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'evening';

  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

function getMaxAvailableOffsetHours() {
  if (!activeLiveCache) return 0;

  const maxMarineOffset = activeLiveCache.marineTimes.length - activeLiveCache.baseMarineIndex - 1;
  const maxWeatherOffset = activeLiveCache.weatherTimes.length - activeLiveCache.baseWeatherIndex - 1;
  return Math.max(0, Math.min(maxMarineOffset, maxWeatherOffset));
}

function getAllLiveSlotContexts() {
  if (!activeLiveCache) return [];

  const maxOffset = getMaxAvailableOffsetHours();
  const offsets = [];

  for (let offset = 0; offset <= maxOffset; offset += SLOT_STEP_HOURS) {
    offsets.push(offset);
  }

  return offsets
    .map((offset) => getLiveSlotContext(offset))
    .filter((slotContext) => Boolean(slotContext));
}

function groupSlotsByDayAndPart(allSlots) {
  return allSlots.reduce((accumulator, slotContext) => {
    if (!slotContext?.dayKey) return accumulator;

    if (!accumulator[slotContext.dayKey]) {
      accumulator[slotContext.dayKey] = {
        morning: [],
        afternoon: [],
        evening: []
      };
    }

    const dayPart = DAY_PART_ORDER.includes(slotContext.dayPart) ? slotContext.dayPart : 'evening';
    accumulator[slotContext.dayKey][dayPart].push(slotContext);
    return accumulator;
  }, {});
}

function getOrderedDayKeys(groupedByDay) {
  return Object.keys(groupedByDay).sort((left, right) => new Date(left).getTime() - new Date(right).getTime());
}

function getPartLabelKey(dayPart) {
  const keys = {
    morning: 'dayPartMorning',
    afternoon: 'dayPartAfternoon',
    evening: 'dayPartEvening'
  };

  return keys[dayPart] ?? 'dayPartEvening';
}

function formatDayLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;

  const todayKey = getLocalDateKey(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = getLocalDateKey(tomorrowDate);

  if (dateKey === todayKey) return t('dayToday');
  if (dateKey === tomorrowKey) return t('dayTomorrow');

  return new Intl.DateTimeFormat(getLocaleForLanguage(), {
    weekday: 'short',
    day: '2-digit'
  }).format(date);
}

function buildDaySummaries(groupedByDay) {
  const dayKeys = getOrderedDayKeys(groupedByDay).slice(0, DAY_OVERVIEW_LIMIT);

  return dayKeys.map((dayKey) => {
    const groupedSlots = groupedByDay[dayKey];
    const slots = DAY_PART_ORDER.flatMap((dayPart) => groupedSlots[dayPart] ?? []);
    const heights = slots
      .map((slotContext) => slotContext?.mergedSpot?.golfHoogteMeter)
      .filter((height) => Number.isFinite(height));
    const minHeight = heights.length ? Math.min(...heights) : null;
    const maxHeight = heights.length ? Math.max(...heights) : null;

    const conditionCounts = slots.reduce((accumulator, slotContext) => {
      const tag = slotContext.conditionTag ?? 'mixed';
      accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      return accumulator;
    }, {});

    const dominantConditionTag = ['clean', 'mixed', 'choppy'].reduce((bestTag, tag) => {
      const currentCount = conditionCounts[tag] ?? 0;
      const bestCount = conditionCounts[bestTag] ?? -1;
      return currentCount > bestCount ? tag : bestTag;
    }, 'mixed');

    return {
      dateKey: dayKey,
      label: formatDayLabel(dayKey),
      minHeight,
      maxHeight,
      dominantConditionTag
    };
  });
}

function renderDayOverview(groupedByDay, selectedDateKey) {
  if (!dayOverviewEl || !dayOverviewCardsEl) return;

  const summaries = buildDaySummaries(groupedByDay);
  if (!summaries.length) {
    dayOverviewCardsEl.innerHTML = '';
    dayOverviewEl.hidden = true;
    return;
  }

  dayOverviewCardsEl.innerHTML = summaries
    .map((summary) => {
      const isActive = summary.dateKey === selectedDateKey;
      const rangeLabel = Number.isFinite(summary.minHeight) && Number.isFinite(summary.maxHeight)
        ? `${summary.minHeight.toFixed(1)}–${summary.maxHeight.toFixed(1)} m`
        : '-';

      return `
        <button
          type="button"
          class="day-overview-card${isActive ? ' is-active' : ''}"
          data-day-key="${summary.dateKey}"
          aria-pressed="${isActive ? 'true' : 'false'}"
        >
          <span class="day-overview-date">${summary.label}</span>
          <span class="day-overview-range">${rangeLabel}</span>
          <span class="condition-tag condition-tag-${summary.dominantConditionTag} day-overview-condition">
            ${t(getConditionLabelKey(summary.dominantConditionTag))}
          </span>
        </button>
      `;
    })
    .join('');

  dayOverviewEl.hidden = false;
}

function ensureCurrentDayKey(groupedByDay) {
  const orderedDayKeys = getOrderedDayKeys(groupedByDay);
  if (!orderedDayKeys.length) {
    currentDayKey = null;
    return null;
  }

  if (Number.isFinite(preferredInitialOffset)) {
    const preferredSlot = getLiveSlotContext(preferredInitialOffset);
    if (preferredSlot?.dayKey && groupedByDay[preferredSlot.dayKey]) {
      currentDayKey = preferredSlot.dayKey;
      preferredInitialOffset = null;
      return currentDayKey;
    }
    preferredInitialOffset = null;
  }

  if (currentDayKey && groupedByDay[currentDayKey]) {
    return currentDayKey;
  }

  [currentDayKey] = orderedDayKeys;
  return currentDayKey;
}

function getSlotsForCurrentDay(groupedByDay) {
  if (!currentDayKey || !groupedByDay[currentDayKey]) return [];
  const dayGroup = groupedByDay[currentDayKey];

  return DAY_PART_ORDER.flatMap((dayPart) => dayGroup[dayPart] ?? []);
}

function getDisplaySlotsForCurrentDay(groupedByDay) {
  const dayGroup = groupedByDay[currentDayKey];
  if (!dayGroup) return [];

  const selectedSlots = [];
  const seenOffsets = new Set();

  DAY_PART_ORDER.forEach((dayPart) => {
    const firstSlot = dayGroup[dayPart]?.[0];
    if (!firstSlot || seenOffsets.has(firstSlot.offsetHours)) return;
    selectedSlots.push(firstSlot);
    seenOffsets.add(firstSlot.offsetHours);
  });

  const fallbackSlots = getSlotsForCurrentDay(groupedByDay);
  fallbackSlots.forEach((slotContext) => {
    if (selectedSlots.length >= TIME_SLOT_OFFSETS.length) return;
    if (seenOffsets.has(slotContext.offsetHours)) return;
    selectedSlots.push(slotContext);
    seenOffsets.add(slotContext.offsetHours);
  });

  return selectedSlots.slice(0, TIME_SLOT_OFFSETS.length);
}

function passesHardConditionFilters(slotContext) {
  if (!slotContext) return false;

  if (activeConditionFilters.minSurfable && !slotContext.minSurfable) {
    return false;
  }

  if (activeConditionFilters.beginnerFriendly && slotContext.challenging) {
    return false;
  }

  return true;
}

function isPreferredCleanSlot(slotContext) {
  if (!activeConditionFilters.preferClean || !slotContext) return false;
  return slotContext.conditionTag !== 'choppy';
}

function getFirstFilteredAvailableOffset() {
  const groupedByDay = groupSlotsByDayAndPart(getAllLiveSlotContexts());
  ensureCurrentDayKey(groupedByDay);
  const firstMatch = getSlotsForCurrentDay(groupedByDay).find((slotContext) => passesHardConditionFilters(slotContext));
  return firstMatch?.offsetHours;
}

function updateNoResultsWithFiltersMessage(hasFilteredResults) {
  if (!noResultsWithFiltersEl) return;

  const hasActiveFilter = Object.values(activeConditionFilters).some(Boolean);
  noResultsWithFiltersEl.textContent = t('noResultsWithFilters');
  noResultsWithFiltersEl.hidden = !hasActiveFilter || hasFilteredResults;
}

function getTimeSlotLabel(slotContext) {
  if (!slotContext?.time) return t('fallbackUnknownTime');

  const timeLabel = new Date(slotContext.time).toLocaleTimeString(getLocaleForLanguage(), {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${t(getPartLabelKey(slotContext.dayPart))} ${timeLabel}`;
}

function buildSlotKey(slotContext) {
  if (!slotContext?.dayKey || !Number.isFinite(slotContext.offsetHours)) return null;
  return `${slotContext.dayKey}-${slotContext.offsetHours}`;
}

function getSelectedSlotContext(allSlotContexts, selectedSlotKey) {
  if (!Array.isArray(allSlotContexts) || !allSlotContexts.length) return null;

  if (selectedSlotKey) {
    const match = allSlotContexts.find((slotContext) => buildSlotKey(slotContext) === selectedSlotKey);
    if (match) return match;
  }

  return allSlotContexts[0] ?? null;
}

function getWindStrengthLabel(speed) {
  if (!Number.isFinite(speed)) return t('detailWindModerate');
  if (speed <= 11) return t('detailWindLight');
  if (speed >= 18) return t('detailWindStrong');
  return t('detailWindModerate');
}

function getSwellHeightRangeText(spotValues) {
  const heights = [
    spotValues?.primaireGolfHoogteMeter,
    spotValues?.golfHoogteMeter,
    spotValues?.secundaireGolfHoogteMeter
  ].filter((value) => Number.isFinite(value));

  if (!heights.length) return '-';

  const minHeight = Math.min(...heights);
  const maxHeight = Math.max(...heights);
  if (Math.abs(maxHeight - minHeight) < 0.05) {
    return `${maxHeight.toFixed(1)} m`;
  }

  return `${minHeight.toFixed(1)}–${maxHeight.toFixed(1)} m`;
}

function getWindRelationLabel(slotContext) {
  const windDegrees = getWindDegreesForSpot(slotContext?.mergedSpot ?? slotContext?.values);
  const coastOrientation = getCoastOrientationDeg(slotContext?.mergedSpot);
  const relation = getWindRelativeToCoast(coastOrientation, windDegrees);

  if (relation === 'offshore') return t('detailWindOffshore');
  if (relation === 'onshore') return t('detailWindOnshore');
  return t('detailWindCross');
}

function formatWindDescription(slotContext) {
  const spotValues = slotContext?.mergedSpot ?? slotContext?.values ?? {};
  const windDegrees = getWindDegreesForSpot(spotValues);
  const windCompass = formatWindDirection(
    Number.isFinite(windDegrees) ? windDegrees : spotValues.windRichting
  );
  const windSpeed = formatWindSpeed(spotValues.windSnelheidKnopen);
  const windStrength = getWindStrengthLabel(spotValues.windSnelheidKnopen);
  const windRelation = getWindRelationLabel(slotContext);

  return `${windStrength} ${windCompass} ${windRelation} wind (${windSpeed})`;
}

function formatSwellDescription(slotContext) {
  const spotValues = slotContext?.mergedSpot ?? slotContext?.values ?? {};
  const waveHeight = getSwellHeightRangeText(spotValues);
  const wavePeriod = Number.isFinite(spotValues.golfPeriodeSeconden)
    ? `${Math.round(spotValues.golfPeriodeSeconden)} s`
    : '-';
  const swellDirection = getSwellDirectionDegrees(spotValues);
  const directionSegment = Number.isFinite(swellDirection)
    ? `${formatWindDirection(swellDirection)} (${Math.round(swellDirection)}°)`
    : '-';

  return `${waveHeight} ${directionSegment} swell @ ${wavePeriod}`;
}

function formatSkillAdvice(slotContext, options = {}) {
  const includeTide = options.includeTide === true;

  if (!slotContext) return t('detailAdviceIntermediate');

  let baseAdvice = t('detailAdviceIntermediate');
  if (slotContext.challenging || slotContext.conditionTag === 'choppy') {
    baseAdvice = t('detailAdviceAdvanced');
  } else if (slotContext.conditionTag === 'clean' && !slotContext.challenging) {
    baseAdvice = t('detailAdviceBeginner');
  }

  if (!includeTide || !slotContext.tideSuitability) {
    return baseAdvice;
  }

  if (slotContext.tideSuitability === 'good') {
    return `${baseAdvice} ${t('detailTideSupportive')}`;
  }

  return `${baseAdvice} ${t('detailTideTrickier')}`;
}

function buildSlotDetailLines(slotContext) {
  const windText = formatWindDescription(slotContext);
  const swellText = formatSwellDescription(slotContext);
  const conditionText = t(getConditionLabelKey(slotContext?.conditionTag ?? 'mixed'));
  const tideLabel = slotContext?.tideLevel
    ? t(getTideLabelKey(slotContext.tideLevel))
    : null;

  return {
    windText,
    swellText,
    conditionText,
    tideText: tideLabel,
    tideHintText: getTideHintText(slotContext),
    adviceText: formatSkillAdvice(slotContext, { includeTide: true }),
    summaryText: t('detailSummaryLine', {
      windText,
      swellText,
      conditionText
    })
  };
}

function getSlotQualityScore(slotContext, options = {}) {
  if (!slotContext) {
    return {
      score: 0,
      reasons: []
    };
  }

  const includeActiveFilters = options.includeActiveFilters !== false;

  let score = 0;
  const reasons = [];
  const spotValues = slotContext.mergedSpot ?? slotContext.values ?? {};

  if (slotContext.conditionTag === 'clean') {
    score += 3;
    reasons.push('clean');
  } else if (slotContext.conditionTag === 'mixed') {
    score += 1;
    reasons.push('mixed');
  } else {
    reasons.push('choppy');
  }

  const waveHeight = spotValues.golfHoogteMeter;
  if (Number.isFinite(waveHeight)) {
    if (waveHeight >= 0.9 && waveHeight <= 2.0) {
      score += 2;
      reasons.push('good-wave-height');
    } else if (waveHeight >= 0.7 && waveHeight <= 2.4) {
      score += 1;
      reasons.push('acceptable-wave-height');
    } else if (waveHeight > 2.8) {
      score -= 1;
      reasons.push('heavy-wave-height');
    }
  }

  const wavePeriod = spotValues.golfPeriodeSeconden;
  if (Number.isFinite(wavePeriod) && wavePeriod >= 8) {
    score += 1;
    reasons.push('good-period');
  }

  const windDegrees = getWindDegreesForSpot(spotValues);
  const coastOrientation = getCoastOrientationDeg(spotValues);
  const windRelative = getWindRelativeToCoast(coastOrientation, windDegrees);

  if (windRelative === 'offshore') {
    score += 1;
    reasons.push('offshore');
  } else if (windRelative === 'onshore') {
    score -= 1;
    reasons.push('onshore');
  } else {
    reasons.push('cross');
  }

  if (slotContext.challenging) {
    score -= 2;
    reasons.push('challenging');
  }

  if (slotContext.tideSuitability === 'good') {
    score += 1;
    reasons.push('tide-supportive');
  } else if (slotContext.tideSuitability === 'less-ideal') {
    score -= 1;
    reasons.push('tide-less-ideal');
  }

  if (includeActiveFilters && activeConditionFilters.minSurfable && !slotContext.minSurfable) {
    score -= 2;
    reasons.push('below-min-surfable-filter');
  }

  if (includeActiveFilters && activeConditionFilters.beginnerFriendly && slotContext.challenging) {
    score -= 3;
    reasons.push('beginner-filter-penalty');
  }

  if (includeActiveFilters && activeConditionFilters.preferClean) {
    if (slotContext.conditionTag === 'clean') {
      score += 1;
      reasons.push('clean-preference-bonus');
    } else if (slotContext.conditionTag === 'choppy') {
      score -= 2;
      reasons.push('clean-preference-penalty');
    }
  }

  const clamped = Math.max(0, Math.min(10, score));
  return {
    score: clamped,
    reasons
  };
}

function getSpotDayScore(spot, dayKey, allSlotContextsForSpotAndDay, options = {}) {
  if (!spot || !dayKey || !Array.isArray(allSlotContextsForSpotAndDay) || !allSlotContextsForSpotAndDay.length) {
    return null;
  }

  const useActiveFilters = options.useActiveFilters !== false;
  const includeActiveFilters = options.includeActiveFilters !== false;

  const filteredSlots = allSlotContextsForSpotAndDay
    .filter((slotContext) => slotContext?.dayKey === dayKey)
    .filter((slotContext) => (useActiveFilters ? passesHardConditionFilters(slotContext) : true));

  if (!filteredSlots.length) return null;

  // Tide influence is already applied in getSlotQualityScore via tideSuitability.

  const scoredSlots = filteredSlots
    .map((slotContext) => {
      const quality = getSlotQualityScore(slotContext, { includeActiveFilters });
      return {
        slotContext,
        score: quality.score,
        reasons: quality.reasons
      };
    })
    .sort((left, right) => right.score - left.score);

  const best = scoredSlots[0];
  const secondary = scoredSlots[1] ?? best;
  const aggregateScore = Math.round((((best.score + secondary.score) / 2) + Number.EPSILON) * 10) / 10;
  const bestSlot = best.slotContext;

  return {
    spotId: getSpotKey(spot),
    spot,
    dayKey,
    score: aggregateScore,
    bestSlotKey: buildSlotKey(bestSlot),
    bestSlotOffset: bestSlot.offsetHours,
    bestSlotContext: bestSlot,
    reasons: best.reasons
  };
}

function getMaxAvailableOffsetHoursForCache(liveCache) {
  if (!liveCache) return 0;

  const maxMarineOffset = liveCache.marineTimes.length - liveCache.baseMarineIndex - 1;
  const maxWeatherOffset = liveCache.weatherTimes.length - liveCache.baseWeatherIndex - 1;
  return Math.max(0, Math.min(maxMarineOffset, maxWeatherOffset));
}

function getLiveSnapshotForOffsetFromCache(liveCache, offsetHours) {
  if (!liveCache) return null;

  const marineIndex = liveCache.baseMarineIndex + offsetHours;
  const weatherIndex = liveCache.baseWeatherIndex + offsetHours;

  const marineTimes = liveCache.marineTimes;
  const weatherTimes = liveCache.weatherTimes;
  const marineHourly = liveCache.marineData?.hourly;
  const weatherHourly = liveCache.weatherData?.hourly;

  if (
    marineIndex < 0 ||
    weatherIndex < 0 ||
    marineIndex >= marineTimes.length ||
    weatherIndex >= weatherTimes.length
  ) {
    return null;
  }

  return {
    time: marineTimes[marineIndex] ?? weatherTimes[weatherIndex] ?? null,
    values: {
      golfHoogteMeter: marineHourly?.wave_height?.[marineIndex],
      golfPeriodeSeconden: marineHourly?.wave_period?.[marineIndex],
      golfRichtingGraden: marineHourly?.wave_direction?.[marineIndex],
      swellRichtingGraden: marineHourly?.swell_wave_direction?.[marineIndex],
      primaireGolfHoogteMeter: marineHourly?.swell_wave_height?.[marineIndex],
      secundaireGolfHoogteMeter: marineHourly?.wind_wave_height?.[marineIndex],
      windSnelheidKnopen: weatherHourly?.wind_speed_10m?.[weatherIndex],
      windRichtingGraden: weatherHourly?.wind_direction_10m?.[weatherIndex],
      windRichting: toCompassDirection(weatherHourly?.wind_direction_10m?.[weatherIndex]),
      watertemperatuurC:
        marineHourly?.sea_surface_temperature?.[marineIndex] ??
        weatherHourly?.temperature_2m?.[weatherIndex]
    }
  };
}

function getSlotContextsForLiveCache(liveCache) {
  if (!liveCache) return [];

  const maxOffset = getMaxAvailableOffsetHoursForCache(liveCache);
  const slotContexts = [];

  for (let offsetHours = 0; offsetHours <= maxOffset; offsetHours += SLOT_STEP_HOURS) {
    const snapshot = getLiveSnapshotForOffsetFromCache(liveCache, offsetHours);
    if (!snapshot) continue;

    const mergedSpot = mergeWithFallbackSpot(liveCache.spot, snapshot.values);
    const dayPart = getDayPart(snapshot.time);
    const tideLevel = getTideLevelForSlot(liveCache.spot, {
      time: snapshot.time,
      dayPart
    });
    const tideSuitability = getTideSuitabilityForSlot(liveCache.spot, {
      time: snapshot.time,
      dayPart
    });

    slotContexts.push({
      offsetHours,
      time: snapshot.time,
      dayKey: getLocalDateKey(snapshot.time),
      dayPart,
      values: snapshot.values,
      mergedSpot,
      conditionTag: getSurfConditionTag(mergedSpot),
      tideLevel,
      tideSuitability,
      minSurfable: isMinSurfableConditions(snapshot.values),
      challenging: isChallengingConditions(snapshot.values)
    });
  }

  return slotContexts;
}

function getConditionTagFromSlots(slots) {
  const counts = slots.reduce((accumulator, slotContext) => {
    const tag = slotContext?.conditionTag ?? 'mixed';
    accumulator[tag] = (accumulator[tag] ?? 0) + 1;
    return accumulator;
  }, {});

  return ['clean', 'mixed', 'choppy'].reduce((bestTag, tag) => {
    const current = counts[tag] ?? 0;
    const best = counts[bestTag] ?? -1;
    return current > best ? tag : bestTag;
  }, 'mixed');
}

function getDominantSwellDirectionFromSlots(slots) {
  const countsByDirection = slots.reduce((accumulator, slotContext) => {
    const degrees = getSwellDirectionDegrees(slotContext?.mergedSpot ?? slotContext?.values);
    if (!Number.isFinite(degrees)) return accumulator;

    const direction = formatWindDirection(degrees);
    if (!direction || direction === '-') return accumulator;
    accumulator[direction] = (accumulator[direction] ?? 0) + 1;
    return accumulator;
  }, {});

  const [direction] = Object.entries(countsByDirection)
    .sort((left, right) => right[1] - left[1])[0] ?? [];

  return direction ?? '-';
}

function getBestSlotFromPartSlots(partSlots) {
  if (!Array.isArray(partSlots) || !partSlots.length) return null;

  return partSlots
    .map((slotContext) => ({
      slotContext,
      score: getSlotQualityScore(slotContext, { includeActiveFilters: false }).score
    }))
    .sort((left, right) => right.score - left.score)[0]?.slotContext ?? null;
}

function buildDaySummaryStats(spotId, dayKey, groupedSlotsForDay) {
  const daySlots = DAY_PART_ORDER.flatMap((dayPart) => groupedSlotsForDay?.[dayPart] ?? []);
  if (!daySlots.length) {
    return {
      spotId,
      dayKey,
      hasData: false
    };
  }

  const heights = daySlots
    .map((slotContext) => slotContext?.mergedSpot?.golfHoogteMeter)
    .filter((value) => Number.isFinite(value));
  const periods = daySlots
    .map((slotContext) => slotContext?.mergedSpot?.golfPeriodeSeconden)
    .filter((value) => Number.isFinite(value));

  const minHeight = heights.length ? Math.min(...heights) : null;
  const maxHeight = heights.length ? Math.max(...heights) : null;
  const minPeriod = periods.length ? Math.min(...periods) : null;
  const maxPeriod = periods.length ? Math.max(...periods) : null;

  const dominantSwellDirText = getDominantSwellDirectionFromSlots(daySlots);
  const dominantConditionTag = getConditionTagFromSlots(daySlots);

  const bestPartSlots = DAY_PART_ORDER.reduce((accumulator, dayPart) => {
    accumulator[dayPart] = getBestSlotFromPartSlots(groupedSlotsForDay?.[dayPart] ?? []);
    return accumulator;
  }, {});

  const morningSlot = bestPartSlots.morning;
  const afternoonSlot = bestPartSlots.afternoon;
  const eveningSlot = bestPartSlots.evening;

  const tideKnownSlots = daySlots.filter((slotContext) => Boolean(slotContext?.tideLevel));
  const tideCounts = tideKnownSlots.reduce((accumulator, slotContext) => {
    const key = slotContext.tideLevel;
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
  const dominantTideLevel = ['mid', 'high', 'low'].reduce((bestLevel, level) => {
    const bestCount = tideCounts[bestLevel] ?? -1;
    const levelCount = tideCounts[level] ?? 0;
    return levelCount > bestCount ? level : bestLevel;
  }, 'mid');
  const supportiveTideRatio = tideKnownSlots.length
    ? tideKnownSlots.filter((slotContext) => slotContext.tideSuitability === 'good').length / tideKnownSlots.length
    : 0;

  const challengingRatio = daySlots.filter((slotContext) => slotContext.challenging).length / daySlots.length;
  let overallSkillLevel = 'intermediate';
  if (challengingRatio >= 0.5 || dominantConditionTag === 'choppy') {
    overallSkillLevel = 'advanced';
  } else if (dominantConditionTag === 'clean' && challengingRatio <= 0.2) {
    overallSkillLevel = 'beginner';
  }

  const spot = getSpotById(spotId) ?? activeSpot;
  const dayScore = spot
    ? getSpotDayScore(spot, dayKey, daySlots, {
      useActiveFilters: false,
      includeActiveFilters: false
    })
    : null;

  return {
    spotId,
    dayKey,
    hasData: true,
    slotCount: daySlots.length,
    minHeight,
    maxHeight,
    minPeriod,
    maxPeriod,
    dominantSwellDirText,
    dominantConditionTag,
    morningConditionTag: morningSlot?.conditionTag ?? null,
    afternoonConditionTag: afternoonSlot?.conditionTag ?? null,
    eveningConditionTag: eveningSlot?.conditionTag ?? null,
    morningWindDesc: morningSlot ? formatWindDescription(morningSlot) : null,
    afternoonWindDesc: afternoonSlot ? formatWindDescription(afternoonSlot) : null,
    eveningWindDesc: eveningSlot ? formatWindDescription(eveningSlot) : null,
    overallSkillLevel,
    overallScore: dayScore?.score ?? null,
    hasTideContext: tideKnownSlots.length > 0,
    dominantTideLevel: tideKnownSlots.length ? dominantTideLevel : null,
    supportiveTideRatio
  };
}

function getDayPartLabelForLanguage(dayPart, language) {
  const labels = {
    nl: {
      morning: 'ochtend',
      afternoon: 'middag',
      evening: 'avond'
    },
    en: {
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening'
    }
  };

  const languageCode = language === 'nl' ? 'nl' : 'en';
  return labels[languageCode][dayPart] ?? labels[languageCode].evening;
}

function getConditionTagTextForLanguage(conditionTag, language) {
  const labels = {
    nl: {
      clean: 'clean',
      mixed: 'mixed',
      choppy: 'choppy'
    },
    en: {
      clean: 'clean',
      mixed: 'mixed',
      choppy: 'choppy'
    }
  };

  const languageCode = language === 'nl' ? 'nl' : 'en';
  const normalizedTag = ['clean', 'mixed', 'choppy'].includes(conditionTag) ? conditionTag : 'mixed';
  return labels[languageCode][normalizedTag];
}

function buildDailySurfReportLines(dayStats, dayKey, language = currentLanguage) {
  const languageCode = language === 'nl' ? 'nl' : 'en';

  if (!dayStats?.hasData) {
    return [
      languageCode === 'nl'
        ? 'Onvoldoende data voor een dagrapport.'
        : 'Not enough data for a daily surf report.'
    ];
  }

  const dayLabel = formatDayLabel(dayKey);
  const heightRange = Number.isFinite(dayStats.minHeight) && Number.isFinite(dayStats.maxHeight)
    ? `${dayStats.minHeight.toFixed(1)}–${dayStats.maxHeight.toFixed(1)} m`
    : '-';
  const periodRange = Number.isFinite(dayStats.minPeriod) && Number.isFinite(dayStats.maxPeriod)
    ? `${Math.round(dayStats.minPeriod)}–${Math.round(dayStats.maxPeriod)} s`
    : '-';
  const conditionText = getConditionTagTextForLanguage(dayStats.dominantConditionTag, languageCode);

  const lineOne = languageCode === 'nl'
    ? `${dayLabel}: ${heightRange} ${dayStats.dominantSwellDirText}-swell met ${periodRange} periode, overwegend ${conditionText}.`
    : `${dayLabel}: ${heightRange} ${dayStats.dominantSwellDirText} swell with ${periodRange} period, mostly ${conditionText}.`;

  const dayPartWindSegments = DAY_PART_ORDER
    .map((dayPart) => {
      const windValue = dayStats[`${dayPart}WindDesc`];
      if (!windValue) return null;
      const partLabel = getDayPartLabelForLanguage(dayPart, languageCode);
      return `${partLabel} ${windValue}`;
    })
    .filter((segment) => Boolean(segment));

  const lineTwo = dayPartWindSegments.length
    ? `${languageCode === 'nl' ? 'Wind' : 'Wind'}: ${dayPartWindSegments.join(languageCode === 'nl' ? ', ' : ', ')}.`
    : null;

  const tideLine = dayStats?.hasTideContext && dayStats?.dominantTideLevel
    ? t('dailyReportTideMostly', {
      tideLabel: t(getTideLabelKey(dayStats.dominantTideLevel)).toLowerCase()
    })
    : null;

  const skillAdviceByLevel = {
    beginner: languageCode === 'nl' ? 'meestal geschikt voor beginners' : 'usually suitable for beginners',
    intermediate: languageCode === 'nl' ? 'het beste voor intermediate surfers' : 'best for intermediate surfers',
    advanced: languageCode === 'nl' ? 'vooral geschikt voor gevorderden' : 'mostly suitable for advanced surfers'
  };

  const scoreSegment = Number.isFinite(dayStats.overallScore)
    ? `${languageCode === 'nl' ? 'Dagscore' : 'Day score'} ${dayStats.overallScore.toFixed(1)}/10.`
    : '';
  const lineThree = languageCode === 'nl'
    ? `Advies: ${skillAdviceByLevel[dayStats.overallSkillLevel] ?? skillAdviceByLevel.intermediate}. ${scoreSegment}`
    : `Advice: ${skillAdviceByLevel[dayStats.overallSkillLevel] ?? skillAdviceByLevel.intermediate}. ${scoreSegment}`;

  const tideAdvice = dayStats?.hasTideContext
    ? (dayStats.supportiveTideRatio >= 0.5 ? t('dailyReportTideSupportive') : t('dailyReportTideLessIdeal'))
    : null;

  return [lineOne, lineTwo, tideLine, lineThree, tideAdvice].filter((line) => Boolean(line));
}

function renderDailySurfReport(spotId = getSpotKey(activeSpot), dayKey = currentDayKey) {
  if (!dailySurfReportEl) return;

  if (!spotId || !activeLiveCache) {
    dailySurfReportEl.innerHTML = `
      <h3 class="daily-surf-report-title">${t('dailyReportHeading')}</h3>
      <p class="daily-surf-report-line">${t('dailyReportInsufficient')}</p>
    `;
    return;
  }

  const groupedByDay = groupSlotsByDayAndPart(getAllLiveSlotContexts());
  const resolvedDayKey = dayKey && groupedByDay[dayKey]
    ? dayKey
    : getOrderedDayKeys(groupedByDay)[0];

  if (!resolvedDayKey || !groupedByDay[resolvedDayKey]) {
    dailySurfReportEl.innerHTML = `
      <h3 class="daily-surf-report-title">${t('dailyReportHeading')}</h3>
      <p class="daily-surf-report-line">${t('dailyReportInsufficient')}</p>
    `;
    return;
  }

  const dayStats = buildDaySummaryStats(spotId, resolvedDayKey, groupedByDay[resolvedDayKey]);
  const reportLines = buildDailySurfReportLines(dayStats, resolvedDayKey, currentLanguage);

  dailySurfReportEl.innerHTML = `
    <h3 class="daily-surf-report-title">${t('dailyReportHeading')}</h3>
    ${reportLines
      .map((line) => `<p class="daily-surf-report-line">${line}</p>`)
      .join('')}
  `;
}

function getMultiSpotCandidateSpots() {
  const candidateSpotIds = new Set();

  if (activeSpot) {
    candidateSpotIds.add(getSpotKey(activeSpot));
  }

  favoriteSpotIds.forEach((spotId) => {
    candidateSpotIds.add(spotId);
  });

  return Array.from(candidateSpotIds)
    .map((spotId) => getSpotById(spotId))
    .filter((spot) => Boolean(spot));
}

async function ensureMultiSpotForecastData(spots) {
  const fetchJobs = spots
    .filter((spot) => Number.isFinite(spot.latitude) && Number.isFinite(spot.longitude))
    .filter((spot) => {
      const cacheEntry = forecastCache.get(getSpotKey(spot));
      return !cacheEntry?.data;
    })
    .map(async (spot) => {
      const spotKey = getSpotKey(spot);
      try {
        const liveForecast = await getOrCreatePendingForecastRequest(spotKey, spot);
        pendingForecastRequests.delete(spotKey);
        forecastCache.set(spotKey, {
          fetchedAt: Date.now(),
          data: liveForecast
        });
      } catch {
        pendingForecastRequests.delete(spotKey);
      }
    });

  await Promise.all(fetchJobs);
}

function buildMultiSpotOverviewForDay(dayKey) {
  if (!dayKey) return [];

  return getMultiSpotCandidateSpots()
    .map((spot) => {
      const spotKey = getSpotKey(spot);
      const cacheEntry = forecastCache.get(spotKey);
      const liveCache = cacheEntry?.data;
      if (!liveCache) return null;

      const spotSlots = getSlotContextsForLiveCache(liveCache);
      const dayScore = getSpotDayScore(spot, dayKey, spotSlots);
      return dayScore;
    })
    .filter((item) => Boolean(item))
    .sort((left, right) => right.score - left.score)
    .slice(0, MULTI_SPOT_TOP_LIMIT);
}

function renderMultiSpotOverviewState(contentHtml) {
  if (!multiSpotOverviewEl) return;
  multiSpotOverviewEl.innerHTML = contentHtml;
  multiSpotOverviewEl.hidden = false;
}

async function renderMultiSpotOverview(dayKey = currentDayKey) {
  if (!multiSpotOverviewEl) return;

  const candidateSpots = getMultiSpotCandidateSpots();
  if (!candidateSpots.length || !dayKey) {
    multiSpotOverviewEl.innerHTML = '';
    multiSpotOverviewEl.hidden = true;
    return;
  }

  const requestId = ++multiSpotRenderRequestId;
  renderMultiSpotOverviewState(`
    <h3 class="multi-spot-title">${t('multiSpotOverviewTitle')}</h3>
    <p class="multi-spot-hint">${t('multiSpotHint')}</p>
    <p class="multi-spot-empty">${t('multiSpotLoading')}</p>
  `);

  await ensureMultiSpotForecastData(candidateSpots);
  if (requestId !== multiSpotRenderRequestId) return;

  const topSpots = buildMultiSpotOverviewForDay(dayKey);

  if (!topSpots.length) {
    renderMultiSpotOverviewState(`
      <h3 class="multi-spot-title">${t('multiSpotOverviewTitle')}</h3>
      <p class="multi-spot-hint">${t('multiSpotHint')}</p>
      <p class="multi-spot-empty">${t('multiSpotNoData')}</p>
    `);
    return;
  }

  const rowsHtml = topSpots
    .map((item) => {
      const spot = item.spot;
      const bestSlot = item.bestSlotContext;
      const slotLabel = getTimeSlotLabel(bestSlot);
      const mergedSpot = bestSlot?.mergedSpot ?? {};
      const waveHeight = Number.isFinite(mergedSpot.golfHoogteMeter)
        ? `${mergedSpot.golfHoogteMeter.toFixed(1)} m`
        : '-';
      const wavePeriod = Number.isFinite(mergedSpot.golfPeriodeSeconden)
        ? `${Math.round(mergedSpot.golfPeriodeSeconden)} s`
        : '-';
      const conditionText = t(getConditionLabelKey(bestSlot?.conditionTag ?? 'mixed'));
      const adviceText = formatSkillAdvice(bestSlot);

      return `
        <li>
          <button
            type="button"
            class="multi-spot-item"
            data-spot-id="${item.spotId}"
            data-best-offset="${item.bestSlotOffset}"
            data-day-key="${item.dayKey}"
          >
            <span class="multi-spot-top">
              <span class="multi-spot-name">${spot.naam} (${spot.land})</span>
              <span class="multi-spot-score">${t('multiSpotScoreLabel')}: ${item.score.toFixed(1)}/10</span>
            </span>
            <span class="multi-spot-meta">${t('multiSpotBestTimeLabel')}: ${slotLabel}</span>
            <span class="multi-spot-meta">${waveHeight} · ${wavePeriod} · ${conditionText}</span>
            <span class="multi-spot-meta">${adviceText}</span>
          </button>
        </li>
      `;
    })
    .join('');

  renderMultiSpotOverviewState(`
    <h3 class="multi-spot-title">${t('multiSpotOverviewTitle')}</h3>
    <p class="multi-spot-hint">${t('multiSpotHint')}</p>
    <ul class="multi-spot-list">${rowsHtml}</ul>
  `);
}

function renderSlotDetail(selectedSlotContext, options = {}) {
  if (!slotDetailEl) return;

  const noResults = Boolean(options.noResults);

  if (!selectedSlotContext) {
    slotDetailEl.innerHTML = `
      <p class="slot-detail-empty">${noResults ? t('detailNoResults') : t('detailSelectPrompt')}</p>
    `;
    return;
  }

  const detailLines = buildSlotDetailLines(selectedSlotContext);
  const dateLabel = formatCompactSlotTimeLabel(selectedSlotContext.time);
  const slotLabel = getTimeSlotLabel(selectedSlotContext);

  slotDetailEl.innerHTML = `
    <h3 class="slot-detail-title">${t('detailTitle')} · ${slotLabel}</h3>
    <p class="slot-detail-subtitle">${dateLabel}</p>
    <div class="slot-detail-grid">
      <div class="slot-detail-row">
        <span class="slot-detail-label">${t('detailSwellLabel')}</span>
        <span class="slot-detail-value">${detailLines.swellText}</span>
      </div>
      <div class="slot-detail-row">
        <span class="slot-detail-label">${t('detailWindLabel')}</span>
        <span class="slot-detail-value">${detailLines.windText}</span>
      </div>
      <div class="slot-detail-row">
        <span class="slot-detail-label">${t('detailConditionsLabel')}</span>
        <span class="slot-detail-value">
          <span class="condition-tag condition-tag-${selectedSlotContext.conditionTag}">${detailLines.conditionText}</span>
        </span>
      </div>
      <div class="slot-detail-row slot-detail-tide">
        <span class="slot-detail-label">${t('detailTideLabel')}</span>
        <span class="slot-detail-value">
          ${detailLines.tideText
    ? `<span class="tide-badge tide-${selectedSlotContext.tideLevel}">${detailLines.tideText}</span> · ${detailLines.tideHintText}`
    : detailLines.tideHintText}
        </span>
      </div>
      <div class="slot-detail-row">
        <span class="slot-detail-label">${t('detailAdviceLabel')}</span>
        <span class="slot-detail-value">${detailLines.adviceText}</span>
      </div>
    </div>
    <p class="slot-detail-summary">${detailLines.summaryText}</p>
  `;
}

function formatCompactSlotTimeLabel(time) {
  if (!time) return t('fallbackUnknownTime');

  return new Date(time).toLocaleString(getLocaleForLanguage(), {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
}

function renderCompactForecastList() {
  if (!forecastListViewEl) return;

  if (currentView !== 'list') {
    forecastListViewEl.hidden = true;
    return;
  }

  if (!activeSpot || !activeLiveCache) {
    forecastListViewEl.innerHTML = '';
    forecastListViewEl.hidden = true;
    return;
  }

  const groupedByDay = groupSlotsByDayAndPart(getAllLiveSlotContexts());
  ensureCurrentDayKey(groupedByDay);
  renderDayOverview(groupedByDay, currentDayKey);

  const filteredSlots = getSlotsForCurrentDay(groupedByDay)
    .filter((slotContext) => passesHardConditionFilters(slotContext));
  const selectedSlot = getSelectedSlotContext(filteredSlots, currentSlotKey);
  if (selectedSlot) {
    currentSlotKey = buildSlotKey(selectedSlot);
  }

  updateNoResultsWithFiltersMessage(filteredSlots.length > 0);

  if (!filteredSlots.length) {
    forecastListViewEl.innerHTML = `<p class="compact-forecast-empty">${t('noResultsWithFilters')}</p>`;
    forecastListViewEl.hidden = false;
    renderSlotDetail(null, { noResults: true });
    return;
  }

  const rows = filteredSlots
    .map((slotContext) => {
      const slot = slotContext.mergedSpot;
      const conditionText = t(getConditionLabelKey(slotContext.conditionTag));
      const waveHeight = Number.isFinite(slot.golfHoogteMeter) ? `${slot.golfHoogteMeter.toFixed(1)} m` : '-';
      const wavePeriod = Number.isFinite(slot.golfPeriodeSeconden) ? `${Math.round(slot.golfPeriodeSeconden)} s` : '-';
      const windSpeed = formatWindSpeed(slot.windSnelheidKnopen);
      const windDirection = formatWindDirection(
        Number.isFinite(slot.windRichtingGraden) ? slot.windRichtingGraden : slot.windRichting
      );
      const tideText = slotContext.tideLevel ? t(getTideLabelKey(slotContext.tideLevel)) : null;
      const preferredClass = isPreferredCleanSlot(slotContext) ? ' is-preferred' : '';
      const isSelected = buildSlotKey(slotContext) === currentSlotKey;
      const selectedClass = isSelected ? ' is-selected' : '';

      return `
        <li
          class="compact-forecast-item${preferredClass}${selectedClass}"
          data-slot-key="${buildSlotKey(slotContext)}"
          data-slot-offset="${slotContext.offsetHours}"
          tabindex="0"
          role="button"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          aria-label="${getTimeSlotLabel(slotContext)}${tideText ? ` · ${t('detailTideLabel')}: ${tideText}` : ''}"
        >
          <div class="compact-forecast-top">
            <span class="compact-forecast-time">${getTimeSlotLabel(slotContext)}</span>
            <span class="compact-forecast-time-meta">${formatCompactSlotTimeLabel(slotContext.time)}</span>
          </div>
          <div class="compact-forecast-meta">
            <span>${waveHeight} · ${wavePeriod}</span>
            <span>${windSpeed} ${windDirection}</span>
            ${tideText ? `<span class="tide-badge tide-${slotContext.tideLevel}">${tideText}</span>` : ''}
            <span class="condition-tag condition-tag-${slotContext.conditionTag}">${conditionText}</span>
          </div>
        </li>
      `;
    })
    .join('');

  forecastListViewEl.innerHTML = `
    <p class="compact-forecast-header">${activeSpot.naam} (${activeSpot.land})</p>
    <ul class="compact-forecast-list">${rows}</ul>
  `;
  forecastListViewEl.hidden = false;
  renderSlotDetail(selectedSlot, { noResults: false });
}

function updateViewModeUI() {
  const isListView = currentView === 'list';

  if (spotMapSectionEl) {
    spotMapSectionEl.hidden = isListView;
  }

  if (forecastSummaryListEl) {
    forecastSummaryListEl.hidden = isListView;
  }

  if (viewMapBtnEl) {
    const mapActive = !isListView;
    viewMapBtnEl.classList.toggle('is-active', mapActive);
    viewMapBtnEl.setAttribute('aria-pressed', mapActive ? 'true' : 'false');
  }

  if (viewListBtnEl) {
    viewListBtnEl.classList.toggle('is-active', isListView);
    viewListBtnEl.setAttribute('aria-pressed', isListView ? 'true' : 'false');
  }

  renderCompactForecastList();

  if (!isListView && spotMapInstance) {
    requestAnimationFrame(() => spotMapInstance.invalidateSize());
  }
}

function setCurrentView(viewMode) {
  currentView = VIEW_MODES.includes(viewMode) ? viewMode : 'map';
  updateViewModeUI();
}

function setCurrentDayKey(nextDayKey) {
  if (!activeLiveCache || !nextDayKey) return;

  const groupedByDay = groupSlotsByDayAndPart(getAllLiveSlotContexts());
  if (!groupedByDay[nextDayKey]) return;

  currentDayKey = nextDayKey;
  updateTimeSelectorButtons();

  const currentContext = getLiveSlotContext(activeTimeOffset);
  if (
    currentContext &&
    currentContext.dayKey === currentDayKey &&
    passesHardConditionFilters(currentContext)
  ) {
    renderLiveOffset(activeTimeOffset);
    return;
  }

  const fallbackOffset = getFirstFilteredAvailableOffset();
  if (fallbackOffset !== undefined) {
    renderLiveOffset(fallbackOffset);
    return;
  }

  const firstDaySlot = getSlotsForCurrentDay(groupedByDay)[0];
  if (firstDaySlot) {
    currentSlotKey = buildSlotKey(firstDaySlot);
    activeTimeOffset = firstDaySlot.offsetHours;
    renderSpot(firstDaySlot.mergedSpot, firstDaySlot.values);
    setForecastMeta(t('forecastMetaLive', { timeLabel: formatCompactSlotTimeLabel(firstDaySlot.time) }), 'live');
  }

  renderCompactForecastList();
  void renderMultiSpotOverview(currentDayKey);
  renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
}

function setActiveConditionFilters(nextFilters) {
  activeConditionFilters = {
    minSurfable: Boolean(nextFilters?.minSurfable),
    beginnerFriendly: Boolean(nextFilters?.beginnerFriendly),
    preferClean: Boolean(nextFilters?.preferClean)
  };

  if (filterMinSurfableEl) filterMinSurfableEl.checked = activeConditionFilters.minSurfable;
  if (filterBeginnerFriendlyEl) filterBeginnerFriendlyEl.checked = activeConditionFilters.beginnerFriendly;
  if (filterPreferCleanEl) filterPreferCleanEl.checked = activeConditionFilters.preferClean;

  if (!activeLiveCache) {
    updateNoResultsWithFiltersMessage(true);
    renderCompactForecastList();
    void renderMultiSpotOverview(currentDayKey);
    renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
    return;
  }

  const currentContext = getLiveSlotContext(activeTimeOffset);
  if (
    currentContext &&
    currentContext.dayKey === currentDayKey &&
    passesHardConditionFilters(currentContext)
  ) {
    updateTimeSelectorButtons();
    renderCompactForecastList();
    void renderMultiSpotOverview(currentDayKey);
    renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
    return;
  }

  const fallbackOffset = getFirstFilteredAvailableOffset();
  if (fallbackOffset !== undefined) {
    renderLiveOffset(fallbackOffset);
    return;
  }

  updateTimeSelectorButtons();
  renderCompactForecastList();
  void renderMultiSpotOverview(currentDayKey);
  renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
}

function renderConditionTag(baseSpot, conditions) {
  if (!conditionTagEl) return;

  const conditionSnapshot = {
    ...baseSpot,
    ...conditions
  };
  const conditionTag = getSurfConditionTag(conditionSnapshot);
  const conditionKey = getConditionLabelKey(conditionTag);

  conditionTagEl.textContent = t(conditionKey);
  conditionTagEl.classList.remove('condition-tag-clean', 'condition-tag-mixed', 'condition-tag-choppy');
  conditionTagEl.classList.add(`condition-tag-${conditionTag}`);
}

function getSwellDirectionDegrees(spot) {
  const swellDirection = normalizeWindDegrees(spot?.swellRichtingGraden);
  if (Number.isFinite(swellDirection)) {
    return swellDirection;
  }

  const waveDirection = normalizeWindDegrees(spot?.golfRichtingGraden);
  if (Number.isFinite(waveDirection)) {
    return waveDirection;
  }

  return null;
}

function formatSwellText(spot) {
  const waveHeight = Number.isFinite(spot?.golfHoogteMeter)
    ? `${spot.golfHoogteMeter.toFixed(1)} m`
    : '-';
  const wavePeriod = Number.isFinite(spot?.golfPeriodeSeconden)
    ? `${Math.round(spot.golfPeriodeSeconden)} s`
    : '-';
  const swellDirection = getSwellDirectionDegrees(spot);
  const directionSegment = Number.isFinite(swellDirection)
    ? ` · ${Math.round(swellDirection)}°`
    : '';
  const secondarySwell = Number.isFinite(spot?.secundaireGolfHoogteMeter)
    ? ` · +${spot.secundaireGolfHoogteMeter.toFixed(1)}m`
    : '';
  return `${waveHeight} · ${wavePeriod}${directionSegment}${secondarySwell}`;
}

function renderSwellInfo(spot) {
  if (!swellBarEl || !swellTextEl) return;

  const swellClass = getSwellClassName(spot?.golfHoogteMeter);
  swellBarEl.classList.remove('swell-low', 'swell-med', 'swell-high', 'swell-very-high');
  swellBarEl.classList.add(swellClass);
  swellTextEl.textContent = formatSwellText(spot);
}

function getWindDegreesForSpot(spot) {
  if (!spot) return null;

  const directDegrees = normalizeWindDegrees(spot.windRichtingGraden);
  if (Number.isFinite(directDegrees)) return directDegrees;

  return directionToDegrees(spot.windRichting);
}

function renderWindInfo(spot) {
  const windDegrees = getWindDegreesForSpot(spot);
  const windDirection = formatWindDirection(
    Number.isFinite(windDegrees) ? windDegrees : spot?.windRichting
  );
  const windSpeed = formatWindSpeed(spot?.windSnelheidKnopen);
  const windText = `${windSpeed} ${windDirection}`;

  if (windTextEl) {
    windTextEl.textContent = windText;
  } else {
    windEl.textContent = windText;
  }

  if (!windIconEl) return;

  if (Number.isFinite(windDegrees)) {
    windIconEl.style.setProperty('--wind-rotation', `${windDegrees}deg`);
    windIconEl.classList.remove('is-unknown');
  } else {
    windIconEl.style.setProperty('--wind-rotation', '0deg');
    windIconEl.classList.add('is-unknown');
  }
}

function updateControlBadges() {
  if (languageSelectEl && languageCurrentBadgeEl) {
    const activeLanguageOption = languageSelectEl.options[languageSelectEl.selectedIndex];
    languageCurrentBadgeEl.textContent = activeLanguageOption?.textContent?.trim() || currentLanguage.toUpperCase();
  }

  if (levelSelectEl && levelCurrentBadgeEl) {
    const activeLevelOption = levelSelectEl.options[levelSelectEl.selectedIndex];
    levelCurrentBadgeEl.textContent = activeLevelOption?.textContent?.trim() || t('levelAll');
  }

  if (languageSwitchEl) {
    languageSwitchEl.classList.toggle('is-active', Boolean(languageSelectEl?.value));
  }

  if (levelFilterContainerEl) {
    levelFilterContainerEl.classList.toggle('is-active', Boolean(levelSelectEl?.value));
  }

  if (themeSwitchEl) {
    themeSwitchEl.classList.toggle('is-active', currentTheme === 'dark');
  }
}

function isChallengingConditions(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;
  const windSpeed = conditions?.windSnelheidKnopen;

  return waveHeight > 2.3 || windSpeed >= 18 || wavePeriod >= 12;
}

function buildRatingExplanation(conditions, level = 'all') {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;
  const windSpeed = conditions?.windSnelheidKnopen;
  const windDirection = conditions?.windRichting;

  if (
    !Number.isFinite(waveHeight) ||
    !Number.isFinite(wavePeriod) ||
    !Number.isFinite(windSpeed)
  ) {
    return t('ratingNoDetails');
  }

  const positives = [];
  const negatives = [];

  if (waveHeight >= 1.2 && waveHeight <= 2.8) {
    positives.push(t('expGoodHeight'));
  } else if ((waveHeight >= 0.7 && waveHeight < 1.2) || (waveHeight > 2.8 && waveHeight <= 3.5)) {
    positives.push(t('expDecentHeight'));
  } else if (waveHeight < 0.7) {
    negatives.push(t('expTooSmallHeight'));
  } else {
    negatives.push(t('expTooHighHeight'));
  }

  if (wavePeriod >= 8) {
    positives.push(t('expLongPeriod'));
  } else if (wavePeriod >= 6) {
    positives.push(t('expDecentPeriod'));
  } else {
    negatives.push(t('expShortPeriod'));
  }

  if (windSpeed <= 12) {
    positives.push(t('expLightWind'));
  } else if (windSpeed >= 22) {
    negatives.push(t('expHardWind'));
  } else if (windSpeed >= 16) {
    negatives.push(t('expStrongWind'));
  }

  if (typeof windDirection === 'string') {
    const normalizedDirection = windDirection.toUpperCase();
    if (['O', 'NO', 'ZO'].includes(normalizedDirection)) {
      positives.push(t('expGoodWindDir'));
    }
    if (['W', 'NW', 'ZW'].includes(normalizedDirection)) {
      negatives.push(t('expOnshoreWind'));
    }
  }

  const shortPositives = positives.slice(0, 2);
  const shortNegatives = negatives.slice(0, 2);
  const parts = [...shortPositives, ...shortNegatives];

  if (!parts.length) {
    return t('ratingNoDetails');
  }

  const isChallenging = isChallengingConditions(conditions);
  let levelNote = '';

  if (level === 'beginner') {
    levelNote = isChallenging
      ? t('levelBeginnerChallenging')
      : t('levelBeginnerCalm');
  }

  if (level === 'advanced') {
    levelNote = isChallenging
      ? t('levelAdvancedChallenging')
      : t('levelAdvancedCalm');
  }

  if (!levelNote) {
    return parts.join(', ');
  }

  return `${parts.join(', ')} ${levelNote}`;
}

function calculateSurfRating(conditions) {
  const waveHeight = conditions?.golfHoogteMeter;
  const wavePeriod = conditions?.golfPeriodeSeconden;
  const windSpeed = conditions?.windSnelheidKnopen;
  const windDirection = conditions?.windRichting;

  if (
    !Number.isFinite(waveHeight) ||
    !Number.isFinite(wavePeriod) ||
    !Number.isFinite(windSpeed)
  ) {
    return {
      explanation: t('ratingNoDetails')
    };
  }

  let score = 1;

  if (waveHeight >= 1.2 && waveHeight <= 2.8) {
    score += 2;
  } else if ((waveHeight >= 0.7 && waveHeight < 1.2) || (waveHeight > 2.8 && waveHeight <= 3.5)) {
    score += 1;
  }

  if (wavePeriod >= 8 && wavePeriod <= 14) {
    score += 1;
  } else if (wavePeriod >= 6 && wavePeriod < 8) {
    score += 0.5;
  }

  if (windSpeed <= 12) {
    score += 1;
  } else if (windSpeed >= 22) {
    score -= 1;
  }

  if (typeof windDirection === 'string') {
    const normalizedDirection = windDirection.toUpperCase();
    if (['O', 'NO', 'ZO'].includes(normalizedDirection)) score += 0.5;
    if (['W', 'NW', 'ZW'].includes(normalizedDirection)) score -= 0.5;
  }

  const clampedScore = Math.max(1, Math.min(5, Math.round(score)));
  let ratingClass = 'rating-ok';
  if (clampedScore <= 2) ratingClass = 'rating-bad';
  if (clampedScore >= 4) ratingClass = 'rating-good';

  const labels = {
    1: t('ratingLabel1'),
    2: t('ratingLabel2'),
    3: t('ratingLabel3'),
    4: t('ratingLabel4'),
    5: t('ratingLabel5')
  };

  return {
    score: clampedScore,
    label: labels[clampedScore],
    stars: `${'★'.repeat(clampedScore)}${'☆'.repeat(5 - clampedScore)}`,
    ratingClass,
    explanation: buildRatingExplanation(conditions, currentLevel)
  };
}

function renderSurfRating(conditions) {
  latestRatingConditions = conditions;
  surfRatingEl.classList.remove(...RATING_CLASS_NAMES);

  const rating = calculateSurfRating(conditions);

  if (!rating?.score) {
    surfRatingEl.textContent = `${t('ratingPrefix')}: ${t('ratingNotAvailable')}`;
    surfRatingEl.classList.add('rating-neutral');
    ratingExplanationEl.textContent = `${t('ratingWhyPrefix')} ${t('ratingNoDetails')}`;
    return;
  }

  surfRatingEl.textContent = `${t('ratingPrefix')}: ${rating.stars} ${rating.score}/5 – ${rating.label}`;
  surfRatingEl.classList.add(rating.ratingClass);
  ratingExplanationEl.textContent = `${t('ratingWhyPrefix')} ${rating.explanation}`;
}

function renderSpot(spot, ratingConditions = spot) {
  spotNameEl.textContent = `${spot.naam} (${spot.land})`;
  waveHeightEl.textContent = `${spot.golfHoogteMeter.toFixed(1)} m`;
  wavePeriodEl.textContent = `${spot.golfPeriodeSeconden} s`;
  renderSwellInfo(spot);
  renderWindInfo(spot);
  renderConditionTag(spot, ratingConditions);
  temperatureEl.textContent = `${spot.watertemperatuurC} °C`;
  renderSurfRating(ratingConditions);
}

function setLegendExpanded(isExpanded) {
  if (!legendToggleBtnEl || !ratingLegendBodyEl) return;
  legendToggleBtnEl.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  legendToggleBtnEl.textContent = isExpanded ? t('legendToggleHide') : t('legendToggleShow');
  ratingLegendBodyEl.hidden = !isExpanded;
}

function updateThemeToggleUI() {
  if (themeLabelEl) {
    themeLabelEl.textContent = t('themeToggleLabel');
  }

  if (themeSwitchEl) {
    themeSwitchEl.setAttribute('aria-label', t('themeToggleLabel'));
  }

  if (!themeToggleBtnEl) return;

  const isDarkTheme = currentTheme === 'dark';
  themeToggleBtnEl.textContent = isDarkTheme ? t('themeDark') : t('themeLight');
  themeToggleBtnEl.setAttribute('aria-pressed', isDarkTheme ? 'true' : 'false');
  themeToggleBtnEl.setAttribute('aria-label', t('themeToggleAria'));
}

function setTheme(theme, persist = false) {
  currentTheme = SUPPORTED_THEMES.includes(theme) ? theme : 'light';
  document.body.setAttribute('data-theme', currentTheme);
  updateThemeToggleUI();

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch {
      // storage kan geblokkeerd zijn; dan stil overslaan
    }
  }

  updateControlBadges();
}

function detectPreferredTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function getStoredTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return SUPPORTED_THEMES.includes(savedTheme) ? savedTheme : null;
  } catch {
    return null;
  }
}

function setLanguage(lang, persist = true) {
  currentLanguage = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'nl';

  if (persist) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  }

  document.documentElement.lang = currentLanguage;
  document.title = t('appTitle');

  if (appTitleHeadingEl) appTitleHeadingEl.textContent = t('appTitle');
  if (appSubtitleEl) appSubtitleEl.textContent = t('appSubtitle');
  if (languageLabelEl) languageLabelEl.textContent = t('languageLabel');
  if (languageSelectEl) {
    languageSelectEl.value = currentLanguage;
    languageSelectEl.setAttribute('aria-label', t('languageLabel'));
  }
  if (themeSwitchEl) themeSwitchEl.setAttribute('aria-label', t('themeToggleLabel'));
  if (helpSwitchEl) helpSwitchEl.setAttribute('aria-label', t('helpToggleLabel'));
  if (searchSectionEl) searchSectionEl.setAttribute('aria-label', t('searchSectionAria'));
  if (searchLabelEl) searchLabelEl.textContent = t('searchLabel');
  if (searchInputEl) searchInputEl.placeholder = t('searchPlaceholder');
  if (searchButtonTextEl) searchButtonTextEl.textContent = t('searchButton');
  if (spotMapSectionEl) spotMapSectionEl.setAttribute('aria-label', t('mapSectionAria'));
  if (spotMapTitleEl) spotMapTitleEl.textContent = t('mapTitle');
  if (spotMapNoteEl) spotMapNoteEl.textContent = t('mapNote');
  if (spotMapEl) spotMapEl.setAttribute('aria-label', t('mapAria'));
  if (levelFilterLabelEl) levelFilterLabelEl.textContent = t('levelLabel');
  if (levelFilterContainerEl) levelFilterContainerEl.setAttribute('aria-label', t('levelLabel'));
  if (levelOptionAllEl) levelOptionAllEl.textContent = t('levelAll');
  if (levelOptionBeginnerEl) levelOptionBeginnerEl.textContent = t('levelBeginner');
  if (levelOptionAdvancedEl) levelOptionAdvancedEl.textContent = t('levelAdvanced');
  if (conditionFiltersEl) conditionFiltersEl.setAttribute('aria-label', t('filterConditionsTitle'));
  if (filterConditionsTitleEl) filterConditionsTitleEl.textContent = t('filterConditionsTitle');
  if (filterMinSurfableLabelEl) filterMinSurfableLabelEl.textContent = t('filterMinSurfable');
  if (filterBeginnerFriendlyLabelEl) filterBeginnerFriendlyLabelEl.textContent = t('filterBeginnerFriendly');
  if (filterPreferCleanLabelEl) filterPreferCleanLabelEl.textContent = t('filterPreferClean');
  if (filterMinSurfableEl) filterMinSurfableEl.setAttribute('aria-label', t('filterMinSurfable'));
  if (filterBeginnerFriendlyEl) filterBeginnerFriendlyEl.setAttribute('aria-label', t('filterBeginnerFriendly'));
  if (filterPreferCleanEl) filterPreferCleanEl.setAttribute('aria-label', t('filterPreferClean'));
  if (viewModeContainerEl) viewModeContainerEl.setAttribute('aria-label', t('viewModeLabel'));
  if (viewModeLabelEl) viewModeLabelEl.textContent = t('viewModeLabel');
  if (viewMapBtnEl) viewMapBtnEl.textContent = t('viewMap');
  if (viewListBtnEl) viewListBtnEl.textContent = t('viewList');
  if (dayOverviewTitleEl) dayOverviewTitleEl.textContent = t('dayOverviewTitle');
  if (dayOverviewEl) dayOverviewEl.setAttribute('aria-label', t('dayOverviewTitle'));
  if (noResultsWithFiltersEl) noResultsWithFiltersEl.textContent = t('noResultsWithFilters');
  if (slotDetailEl) slotDetailEl.setAttribute('aria-label', t('detailTitle'));
  if (multiSpotOverviewEl) multiSpotOverviewEl.setAttribute('aria-label', t('multiSpotOverviewTitle'));
  if (dailySurfReportEl) dailySurfReportEl.setAttribute('aria-label', t('dailyReportHeading'));
  if (ratingLegendEl) ratingLegendEl.setAttribute('aria-label', t('legendAria'));
  if (legendTitleEl) legendTitleEl.textContent = t('legendTitle');
  if (legendItemGoodEl) legendItemGoodEl.innerHTML = `<span class="legend-dot legend-dot-good" aria-hidden="true"></span>${t('legendItemGood')}`;
  if (legendItemMediumEl) legendItemMediumEl.innerHTML = `<span class="legend-dot legend-dot-ok" aria-hidden="true"></span>${t('legendItemMedium')}`;
  if (legendItemBadEl) legendItemBadEl.innerHTML = `<span class="legend-dot legend-dot-bad" aria-hidden="true"></span>${t('legendItemBad')}`;
  if (legendItemOnshoreEl) legendItemOnshoreEl.textContent = t('legendItemOnshore');
  if (legendItemOffshoreEl) legendItemOffshoreEl.textContent = t('legendItemOffshore');
  if (legendWindExplanationEl) legendWindExplanationEl.textContent = t('legendWindExplanation');
  if (legendSwellExplanationEl) legendSwellExplanationEl.textContent = t('legendSwellExplanation');
  if (legendConditionExplanationEl) legendConditionExplanationEl.textContent = t('legendConditionExplanation');
  if (timeSelectorEl) timeSelectorEl.setAttribute('aria-label', t('timeSelectorAria'));
  if (timeSlotNowEl) timeSlotNowEl.textContent = t('timeNow');
  if (timeSlot3hEl) timeSlot3hEl.textContent = t('timePlus3h');
  if (timeSlot6hEl) timeSlot6hEl.textContent = t('timePlus6h');
  if (timeSlot9hEl) timeSlot9hEl.textContent = t('timePlus9h');
  if (forecastLabelWaveHeightEl) forecastLabelWaveHeightEl.textContent = t('forecastWaveHeight');
  if (forecastLabelWavePeriodEl) forecastLabelWavePeriodEl.textContent = t('forecastWavePeriod');
  if (forecastLabelSwellEl) forecastLabelSwellEl.textContent = t('swellLabel');
  if (forecastLabelWindEl) forecastLabelWindEl.textContent = t('windLabel');
  if (forecastLabelTemperatureEl) forecastLabelTemperatureEl.textContent = t('forecastTemperature');
  if (resetViewButtonEl) {
    resetViewButtonEl.textContent = t('resetViewLabel');
    resetViewButtonEl.setAttribute('aria-label', t('resetViewAria'));
  }
  if (favoritesHeadingEl) favoritesHeadingEl.textContent = t('favoritesHeading');
  if (favoritesIntroEl) favoritesIntroEl.textContent = t('favoritesIntro');
  if (favoritesSectionEl) favoritesSectionEl.setAttribute('aria-label', t('favoritesHeading'));
  if (shareLinkBtnEl) {
    shareLinkBtnEl.textContent = t('shareLinkLabel');
    shareLinkBtnEl.setAttribute('aria-label', t('shareLinkLabel'));
  }
  if (helpToggleBtnEl) {
    const isExpanded = helpToggleBtnEl.getAttribute('aria-expanded') === 'true';
    helpToggleBtnEl.setAttribute('aria-label', isExpanded ? t('helpToggleHide') : t('helpToggleLabel'));
    helpToggleBtnEl.textContent = t('helpToggleLabel');
  }
  if (helpIntroLine1El) helpIntroLine1El.textContent = t('helpIntroLine1');
  if (helpIntroLine2El) helpIntroLine2El.textContent = t('helpIntroLine2');
  if (helpIntroLine3El) helpIntroLine3El.textContent = t('helpIntroLine3');
  if (firstRunHintEl) firstRunHintEl.textContent = t('firstRunHint');
  if (infoSectionEl) infoSectionEl.setAttribute('aria-label', t('infoSectionAria'));
  if (infoHeadingEl) infoHeadingEl.textContent = t('infoHeading');
  if (infoLine1El) infoLine1El.textContent = t('infoLine1');
  if (infoLine2El) infoLine2El.textContent = t('infoLine2');
  if (infoLine3El) infoLine3El.textContent = t('infoLine3');
  if (infoLine4El) infoLine4El.textContent = t('infoLine4');

  setLegendExpanded(legendToggleBtnEl?.getAttribute('aria-expanded') === 'true');
  updateFavoriteToggleForSpot(activeSpot);
  renderFavoritesList();
  if (activeLiveCache) {
    const rendered = renderLiveOffset(activeTimeOffset);
    if (!rendered) {
      updateTimeSelectorButtons();
      renderSlotDetail(getSelectedSlotContext(getAllLiveSlotContexts(), currentSlotKey));
    }
  } else if (activeSpot) {
    renderSpot(activeSpot, latestRatingConditions ?? activeSpot);
    renderSlotDetail(null);
  } else {
    setForecastMeta(t('forecastMetaMock'));
    renderSlotDetail(null);
  }
  renderCompactForecastList();
  void renderMultiSpotOverview(currentDayKey);
  renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
  if (latestRatingConditions) {
    renderSurfRating(latestRatingConditions);
  }

  updateThemeToggleUI();
  updateShareButtonForSpot(activeSpot);
  updateFirstRunHintVisibility();
  updateControlBadges();
}

function addTemporaryClass(element, className, durationMs = 220) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => {
    element.classList.remove(className);
  }, durationMs);
}

function setHelpExpanded(isExpanded) {
  if (!helpToggleBtnEl || !helpPanelEl) return;
  helpToggleBtnEl.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  helpToggleBtnEl.setAttribute('aria-label', isExpanded ? t('helpToggleHide') : t('helpToggleLabel'));
  helpToggleBtnEl.textContent = t('helpToggleLabel');
  helpPanelEl.hidden = !isExpanded;
  if (helpSwitchEl) {
    helpSwitchEl.classList.toggle('is-active', isExpanded);
  }
}

function showStatusMessage(messageKey, vars = {}, timeoutMs = 2600) {
  if (!statusBarEl) return;

  const message = t(messageKey, vars);
  statusBarEl.textContent = message;
  statusBarEl.hidden = false;
  addTemporaryClass(statusBarEl, 'is-visible', 220);

  if (statusMessageTimeoutId) {
    clearTimeout(statusMessageTimeoutId);
  }

  statusMessageTimeoutId = window.setTimeout(() => {
    statusBarEl.hidden = true;
    statusBarEl.textContent = '';
  }, timeoutMs);
}

function updateFirstRunHintVisibility() {
  if (!firstRunHintEl) return;
  firstRunHintEl.hidden = !shouldShowFirstRunHint;
}

function updateShareButtonForSpot(spot) {
  if (!shareLinkBtnEl) return;

  const hasActiveSpot = Boolean(spot);
  shareLinkBtnEl.disabled = !hasActiveSpot;
  shareLinkBtnEl.setAttribute('aria-disabled', hasActiveSpot ? 'false' : 'true');
  shareLinkBtnEl.setAttribute('aria-label', t('shareLinkLabel'));

  if (!hasActiveSpot) {
    return;
  }
}

function setCurrentLevel(level) {
  if (!['all', 'beginner', 'advanced'].includes(level)) {
    currentLevel = 'all';
  } else {
    currentLevel = level;
  }

  if (latestRatingConditions) {
    renderSurfRating(latestRatingConditions);
  }
}

function setActiveMapMarker(marker) {
  if (!marker) return;
  if (activeMapMarker && activeMapMarker !== marker) {
    activeMapMarker.setZIndexOffset(0);
  }
  activeMapMarker = marker;
  activeMapMarker.setZIndexOffset(400);
}

function highlightMapMarkerForSpot(spot) {
  if (!spot) return;
  const marker = mapMarkersBySpotKey.get(getSpotKey(spot));
  if (!marker) return;
  setActiveMapMarker(marker);
}

function centerMapOnSpot(spot, options = {}) {
  if (!spotMapInstance) return;

  if (!Number.isFinite(spot?.latitude) || !Number.isFinite(spot?.longitude)) {
    return;
  }

  const zoomLevel = Number.isFinite(options.zoom) ? options.zoom : 8;
  const shouldAnimate = options.animate !== false;
  const targetPosition = [spot.latitude, spot.longitude];

  if (shouldAnimate) {
    spotMapInstance.flyTo(targetPosition, zoomLevel, {
      animate: true,
      duration: 0.75
    });
    return;
  }

  spotMapInstance.setView(targetPosition, zoomLevel, {
    animate: false
  });
}

function resetMapViewToDefault() {
  if (!spotMapInstance) return;

  if (activeMapMarker) {
    activeMapMarker.setZIndexOffset(0);
    activeMapMarker = null;
  }

  const spotsWithCoordinates = SURF_SPOTS.filter(
    (spot) => Number.isFinite(spot.latitude) && Number.isFinite(spot.longitude)
  );

  if (spotsWithCoordinates.length === 1) {
    const singleSpot = spotsWithCoordinates[0];
    spotMapInstance.setView([singleSpot.latitude, singleSpot.longitude], 4, {
      animate: false
    });
    return;
  }

  if (spotsWithCoordinates.length > 1) {
    const bounds = window.L.latLngBounds(
      spotsWithCoordinates.map((spot) => [spot.latitude, spot.longitude])
    );
    spotMapInstance.fitBounds(bounds, {
      padding: [24, 24],
      maxZoom: 3,
      animate: false
    });
    return;
  }

  spotMapInstance.setView([20, 0], 2, {
    animate: false
  });
}

function initSpotMap() {
  if (!spotMapEl) return;

  if (typeof window.L === 'undefined') {
    spotMapEl.textContent = t('mapLoadError');
    return;
  }

  // Leaflet wordt gebruikt als lichte kaartlibrary voor de eerste mapstap.
  const map = window.L.map(spotMapEl, {
    scrollWheelZoom: false
  }).setView([44, 2], 2);
  spotMapInstance = map;

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap-bijdragers'
  }).addTo(map);

  const spotsWithCoordinates = SURF_SPOTS.filter(
    (spot) => Number.isFinite(spot.latitude) && Number.isFinite(spot.longitude)
  );

  spotsWithCoordinates.forEach((spot) => {
    const markerPosition = [spot.latitude, spot.longitude];

    const marker = window.L.marker(markerPosition).addTo(map);
    mapMarkersBySpotKey.set(getSpotKey(spot), marker);
    marker.bindPopup(`<strong>${spot.naam}</strong><br>${spot.land}`);
    marker.bindTooltip(`${spot.naam} (${spot.land})`, {
      direction: 'top',
      offset: [0, -10]
    });
    marker.on('click', () => {
      selectSpot(spot, 'map', spot.naam, {
        centerMap: true,
        animateMap: true,
        mapZoom: 8
      });
    });
  });

  resetMapViewToDefault();

  requestAnimationFrame(() => map.invalidateSize());
}

function setForecastMeta(message, type = 'default') {
  forecastMetaEl.textContent = message;
  forecastMetaEl.classList.remove('is-live', 'is-error');

  if (type === 'live') forecastMetaEl.classList.add('is-live');
  if (type === 'error') forecastMetaEl.classList.add('is-error');
}

function setSearchMessage(message, type) {
  searchMessageEl.textContent = message;
  searchMessageEl.classList.remove('is-error', 'is-success');

  if (type === 'error') searchMessageEl.classList.add('is-error');
  if (type === 'success') searchMessageEl.classList.add('is-success');
}

function setActiveTimeSlotButton(offset) {
  timeSlotButtons.forEach((button) => {
    const buttonOffset = Number(button.dataset.slotOffset ?? button.dataset.offset);
    button.classList.toggle('is-active', buttonOffset === offset);
  });
}

function clearActiveLiveCache() {
  activeLiveCache = null;
  activeTimeOffset = 0;
  currentDayKey = null;
  currentSlotKey = null;
  timeSelectorEl.hidden = true;
  timeSlotButtons.forEach((button) => {
    button.disabled = true;
    button.hidden = false;
    button.dataset.slotOffset = '';
    button.classList.remove('is-active');
  });
  if (dayOverviewEl && dayOverviewCardsEl) {
    dayOverviewCardsEl.innerHTML = '';
    dayOverviewEl.hidden = true;
  }
  updateNoResultsWithFiltersMessage(true);
  renderCompactForecastList();
  renderSlotDetail(null);
  void renderMultiSpotOverview(null);
  renderDailySurfReport(null, null);
}

function hideSuggestions() {
  suggestionsListEl.innerHTML = '';
  suggestionsListEl.hidden = true;
  currentSuggestions = [];
  activeSuggestionIndex = -1;
}

function normalizeText(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getSpotRegion(spot) {
  if (!spot?.region || typeof spot.region !== 'string') return DEFAULT_REGION;
  return REGION_ORDER.includes(spot.region) ? spot.region : DEFAULT_REGION;
}

function getRegionLabelKey(region) {
  const regionLabelByCode = {
    eu: 'regionEurope',
    af: 'regionAfricaAtlantic',
    am: 'regionAmericas',
    ap: 'regionAsiaPacific'
  };

  return regionLabelByCode[region] ?? 'regionEurope';
}

function sortSpotsByRegionAndName(spots) {
  const regionIndexByCode = REGION_ORDER.reduce((accumulator, region, index) => {
    accumulator[region] = index;
    return accumulator;
  }, {});

  return [...spots].sort((leftSpot, rightSpot) => {
    const leftRegion = getSpotRegion(leftSpot);
    const rightRegion = getSpotRegion(rightSpot);
    const leftIndex = regionIndexByCode[leftRegion] ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = regionIndexByCode[rightRegion] ?? Number.MAX_SAFE_INTEGER;

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    const byName = leftSpot.naam.localeCompare(rightSpot.naam, 'nl', {
      sensitivity: 'base'
    });
    if (byName !== 0) return byName;

    return leftSpot.land.localeCompare(rightSpot.land, 'nl', {
      sensitivity: 'base'
    });
  });
}

function getSpotKey(spot) {
  if (spot.id) return spot.id;
  return `${normalizeText(spot.naam)}-${normalizeText(spot.land)}`;
}

function getSpotById(spotId) {
  return SURF_SPOTS.find((spot) => getSpotKey(spot) === spotId) ?? null;
}

function getTideLabelKey(tideLevel) {
  if (tideLevel === 'low') return 'tideLow';
  if (tideLevel === 'high') return 'tideHigh';
  return 'tideMid';
}

function getTideRegionKeyForSpot(spotOrId) {
  const spot = typeof spotOrId === 'string' ? getSpotById(spotOrId) : spotOrId;
  if (!spot) return null;

  const spotId = getSpotKey(spot);
  if (TIDE_REGION_BY_SPOT_ID[spotId]) {
    return TIDE_REGION_BY_SPOT_ID[spotId];
  }

  const appRegion = getSpotRegion(spot);
  return TIDE_REGION_BY_APP_REGION[appRegion] ?? null;
}

function getTideProfileForSpot(spotOrId) {
  const tideRegionKey = getTideRegionKeyForSpot(spotOrId);
  if (!tideRegionKey) return null;
  return TIDE_PROFILES_BY_REGION[tideRegionKey] ?? null;
}

function getTideLevelForSlot(spotOrId, slotContext) {
  const tideProfile = getTideProfileForSpot(spotOrId);
  if (!tideProfile || !slotContext) return null;

  const dayPart = DAY_PART_ORDER.includes(slotContext.dayPart) ? slotContext.dayPart : 'evening';
  const tideLevel = tideProfile.dayPartTideLevel?.[dayPart] ?? null;
  return ['low', 'mid', 'high'].includes(tideLevel) ? tideLevel : null;
}

function getTideSuitabilityForSlot(spotOrId, slotContext) {
  const tideProfile = getTideProfileForSpot(spotOrId);
  const tideLevel = getTideLevelForSlot(spotOrId, slotContext);
  if (!tideProfile || !tideLevel) return null;

  return tideProfile.preferredLevels?.includes(tideLevel) ? 'good' : 'less-ideal';
}

function getTideHintText(slotContext) {
  if (!slotContext?.tideLevel) return t('tideNoContext');
  if (slotContext.tideSuitability === 'good') return t('tideBestMidHigh');
  if (slotContext.tideSuitability === 'less-ideal') return t('tideLessIdealNow');
  return t('tideNoContext');
}

function getDeepLinkedSpotFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const deepLinkedSpotId = params.get('spot');
    if (!deepLinkedSpotId) return null;
    return getSpotById(deepLinkedSpotId);
  } catch {
    return null;
  }
}

function getDeepLinkedOffsetFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const offsetParam = Number(params.get('offset'));
    if (!Number.isFinite(offsetParam) || offsetParam < 0) return null;
    return Math.floor(offsetParam);
  } catch {
    return null;
  }
}

function buildDeepLinkForSpot(spot) {
  const spotId = getSpotKey(spot);
  const url = new URL(window.location.href);
  url.searchParams.set('spot', spotId);
  if (Number.isFinite(activeTimeOffset)) {
    url.searchParams.set('offset', String(activeTimeOffset));
  }
  return url.toString();
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const fallbackInput = document.createElement('textarea');
  fallbackInput.value = text;
  fallbackInput.setAttribute('readonly', '');
  fallbackInput.style.position = 'absolute';
  fallbackInput.style.left = '-9999px';
  document.body.appendChild(fallbackInput);
  fallbackInput.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(fallbackInput);
  }
}

function saveLastSpotToStorage(spot) {
  if (!spot) return;

  try {
    localStorage.setItem(LAST_SPOT_STORAGE_KEY, getSpotKey(spot));
  } catch {
    // storage kan geblokkeerd zijn; dan stil overslaan
  }
}

function getLastSpotFromStorage() {
  try {
    const savedSpotId = localStorage.getItem(LAST_SPOT_STORAGE_KEY);
    if (!savedSpotId) return null;
    return getSpotById(savedSpotId);
  } catch {
    return null;
  }
}

function loadFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    parsed.forEach((spotId) => {
      if (typeof spotId === 'string' && getSpotById(spotId)) {
        favoriteSpotIds.add(spotId);
      }
    });
  } catch {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }
}

function saveFavoritesToStorage() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteSpotIds)));
}

function isFavoriteSpot(spot) {
  return favoriteSpotIds.has(getSpotKey(spot));
}

function updateFavoriteToggleForSpot(spot) {
  if (!spot) {
    favoriteToggleBtnEl.textContent = t('favoriteButtonOff');
    favoriteToggleBtnEl.setAttribute('aria-pressed', 'false');
    favoriteToggleBtnEl.setAttribute('aria-label', t('favoriteButtonOff'));
    favoriteToggleBtnEl.classList.remove('is-active');
    return;
  }

  const isFavorite = isFavoriteSpot(spot);
  favoriteToggleBtnEl.textContent = isFavorite ? t('favoriteButtonOn') : t('favoriteButtonOff');
  favoriteToggleBtnEl.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
  favoriteToggleBtnEl.setAttribute(
    'aria-label',
    isFavorite
      ? t('favoriteToggleAriaRemove', { spot: spot.naam })
      : t('favoriteToggleAriaAdd', { spot: spot.naam })
  );
  favoriteToggleBtnEl.classList.toggle('is-active', isFavorite);
}

function renderFavoritesList() {
  const favorites = SURF_SPOTS
    .map((spot, originalIndex) => ({
      spot,
      originalIndex
    }))
    .filter(({ spot }) => favoriteSpotIds.has(getSpotKey(spot)))
    .sort((left, right) => {
      const byName = left.spot.naam.localeCompare(right.spot.naam, 'nl', {
        sensitivity: 'base'
      });
      if (byName !== 0) return byName;

      const byLand = left.spot.land.localeCompare(right.spot.land, 'nl', {
        sensitivity: 'base'
      });
      if (byLand !== 0) return byLand;

      return left.originalIndex - right.originalIndex;
    })
    .map(({ spot }) => spot);

  if (!favorites.length) {
    favoritesListEl.innerHTML = `
      <li class="favorites-empty">
        <span class="favorites-empty-title">${t('favoritesEmpty')}</span>
        <span class="favorites-empty-hint">${t('favoritesEmptyHint')}</span>
      </li>
    `;
    return;
  }

  favoritesListEl.innerHTML = favorites
    .map(
      (spot) =>
        `
          <li>
            <button type="button" class="favorite-item-btn" data-spot-id="${getSpotKey(spot)}">
              <span class="favorite-item-main">
                <span class="favorite-item-star" aria-hidden="true">★</span>
                <span class="favorite-item-spot">${spot.naam}</span>
                <span class="favorite-item-land">(${spot.land})</span>
              </span>
              <span class="favorite-item-arrow" aria-hidden="true">›</span>
            </button>
          </li>
        `
    )
    .join('');
}

function isCacheEntryFresh(cacheEntry) {
  if (!cacheEntry || !cacheEntry.fetchedAt || !cacheEntry.data) return false;
  return Date.now() - cacheEntry.fetchedAt <= FORECAST_CACHE_TTL_MS;
}

function getOrCreatePendingForecastRequest(spotKey, spot) {
  let pendingRequest = pendingForecastRequests.get(spotKey);
  if (!pendingRequest) {
    pendingRequest = fetchLiveForecastForSpot(spot);
    pendingForecastRequests.set(spotKey, pendingRequest);
  }

  return pendingRequest;
}

function buildMarineApiUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_direction,wind_wave_height,sea_surface_temperature',
    forecast_days: '4',
    timezone: 'auto'
  });

  return `${OPEN_METEO_MARINE_BASE_URL}?${params.toString()}`;
}

function buildWeatherApiUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'wind_speed_10m,wind_direction_10m,temperature_2m',
    wind_speed_unit: 'kn',
    forecast_days: '4',
    timezone: 'auto'
  });

  return `${OPEN_METEO_WEATHER_BASE_URL}?${params.toString()}`;
}

function toCompassDirection(degrees) {
  if (!Number.isFinite(degrees)) return '-';
  const directions = ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function findNearestTimeIndex(times) {
  if (!Array.isArray(times) || !times.length) return 0;

  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const timestamp = new Date(time).getTime();
    const diff = timestamp - now;
    if (diff >= 0 && diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return bestDiff === Number.POSITIVE_INFINITY ? 0 : bestIndex;
}

async function fetchLiveForecastForSpot(spot) {
  if (!Number.isFinite(spot.latitude) || !Number.isFinite(spot.longitude)) {
    throw new Error('Spot mist geldige coördinaten');
  }

  const marineUrl = buildMarineApiUrl(spot.latitude, spot.longitude);
  const weatherUrl = buildWeatherApiUrl(spot.latitude, spot.longitude);

  const [marineResponse, weatherResponse] = await Promise.all([
    fetch(marineUrl),
    fetch(weatherUrl)
  ]);

  if (!marineResponse.ok || !weatherResponse.ok) {
    throw new Error('API response niet ok');
  }

  const marineData = await marineResponse.json();
  const weatherData = await weatherResponse.json();

  const marineTimes = marineData?.hourly?.time ?? [];
  const weatherTimes = weatherData?.hourly?.time ?? [];

  return {
    spot,
    spotKey: getSpotKey(spot),
    marineUrl,
    weatherUrl,
    marineData,
    weatherData,
    marineTimes,
    weatherTimes,
    baseMarineIndex: findNearestTimeIndex(marineTimes),
    baseWeatherIndex: findNearestTimeIndex(weatherTimes)
  };
}

function getLiveSnapshotForOffset(offsetHours) {
  if (!activeLiveCache) return null;

  const marineIndex = activeLiveCache.baseMarineIndex + offsetHours;
  const weatherIndex = activeLiveCache.baseWeatherIndex + offsetHours;

  const marineTimes = activeLiveCache.marineTimes;
  const weatherTimes = activeLiveCache.weatherTimes;
  const marineHourly = activeLiveCache.marineData?.hourly;
  const weatherHourly = activeLiveCache.weatherData?.hourly;

  if (
    marineIndex < 0 ||
    weatherIndex < 0 ||
    marineIndex >= marineTimes.length ||
    weatherIndex >= weatherTimes.length
  ) {
    return null;
  }

  return {
    time: marineTimes[marineIndex] ?? weatherTimes[weatherIndex] ?? null,
    values: {
      golfHoogteMeter: marineHourly?.wave_height?.[marineIndex],
      golfPeriodeSeconden: marineHourly?.wave_period?.[marineIndex],
      golfRichtingGraden: marineHourly?.wave_direction?.[marineIndex],
      swellRichtingGraden:
        marineHourly?.swell_wave_direction?.[marineIndex] ?? marineHourly?.wave_direction?.[marineIndex],
      primaireGolfHoogteMeter:
        marineHourly?.swell_wave_height?.[marineIndex] ?? marineHourly?.wave_height?.[marineIndex],
      secundaireGolfHoogteMeter: marineHourly?.wind_wave_height?.[marineIndex],
      windSnelheidKnopen: weatherHourly?.wind_speed_10m?.[weatherIndex],
      windRichtingGraden: weatherHourly?.wind_direction_10m?.[weatherIndex],
      windRichting: toCompassDirection(weatherHourly?.wind_direction_10m?.[weatherIndex]),
      watertemperatuurC:
        marineHourly?.sea_surface_temperature?.[marineIndex] ??
        weatherHourly?.temperature_2m?.[weatherIndex]
    }
  };
}

function updateTimeSelectorButtons() {
  if (!activeLiveCache) {
    clearActiveLiveCache();
    return;
  }

  const allSlots = getAllLiveSlotContexts();
  const groupedByDay = groupSlotsByDayAndPart(allSlots);
  ensureCurrentDayKey(groupedByDay);
  renderDayOverview(groupedByDay, currentDayKey);

  timeSelectorEl.hidden = false;
  let hasFilteredResults = false;
  const visibleSlots = [];
  const displaySlots = getDisplaySlotsForCurrentDay(groupedByDay);

  timeSlotButtons.forEach((button, index) => {
    const slotContext = displaySlots[index] ?? null;
    const isAvailable = Boolean(slotContext);
    const isVisibleByFilters = isAvailable && passesHardConditionFilters(slotContext);

    button.classList.remove(...SLOT_CLASS_NAMES, 'slot-preferred');
    button.hidden = !isAvailable;
    button.dataset.slotOffset = slotContext ? String(slotContext.offsetHours) : '';
    button.dataset.slotKey = slotContext ? buildSlotKey(slotContext) : '';
    if (slotContext) {
      const timeLabel = getTimeSlotLabel(slotContext);
      const tideLabel = slotContext.tideLevel ? t(getTideLabelKey(slotContext.tideLevel)) : null;
      button.innerHTML = `
        <span class="time-slot-main">${timeLabel}</span>
        ${tideLabel ? `<span class="tide-badge tide-${slotContext.tideLevel}">${tideLabel}</span>` : ''}
      `;
      button.setAttribute('aria-label', tideLabel ? `${timeLabel} · ${t('detailTideLabel')}: ${tideLabel}` : timeLabel);
    } else {
      button.textContent = t('timeSlotUnavailable');
      button.setAttribute('aria-label', t('timeSlotUnavailable'));
    }

    if (!isVisibleByFilters) {
      button.classList.add('slot-neutral');
    } else {
      hasFilteredResults = true;
      visibleSlots.push(slotContext);
      const slotRating = calculateSurfRating(slotContext.values);
      if (!slotRating?.score) {
        button.classList.add('slot-neutral');
      } else if (slotRating.ratingClass === 'rating-good') {
        button.classList.add('slot-good');
      } else if (slotRating.ratingClass === 'rating-ok') {
        button.classList.add('slot-ok');
      } else {
        button.classList.add('slot-bad');
      }

      if (isPreferredCleanSlot(slotContext)) {
        button.classList.add('slot-preferred');
      }
    }

    button.disabled = !isVisibleByFilters;
    button.classList.toggle('is-active', slotContext?.offsetHours === activeTimeOffset && isVisibleByFilters);
    button.title = isAvailable ? '' : t('timeSlotUnavailable');
  });

  const selectedVisibleSlot = getSelectedSlotContext(visibleSlots, currentSlotKey);
  if (selectedVisibleSlot) {
    currentSlotKey = buildSlotKey(selectedVisibleSlot);
  }

  updateNoResultsWithFiltersMessage(hasFilteredResults);
  renderSlotDetail(selectedVisibleSlot, {
    noResults: !hasFilteredResults && Object.values(activeConditionFilters).some(Boolean)
  });
}

function mergeWithFallbackSpot(spot, liveValues) {
  return {
    ...spot,
    golfHoogteMeter: Number.isFinite(liveValues.golfHoogteMeter)
      ? liveValues.golfHoogteMeter
      : spot.golfHoogteMeter,
    golfPeriodeSeconden: Number.isFinite(liveValues.golfPeriodeSeconden)
      ? liveValues.golfPeriodeSeconden
      : spot.golfPeriodeSeconden,
    golfRichtingGraden: Number.isFinite(liveValues.golfRichtingGraden)
      ? liveValues.golfRichtingGraden
      : spot.golfRichtingGraden,
    swellRichtingGraden: Number.isFinite(liveValues.swellRichtingGraden)
      ? liveValues.swellRichtingGraden
      : spot.swellRichtingGraden,
    primaireGolfHoogteMeter: Number.isFinite(liveValues.primaireGolfHoogteMeter)
      ? liveValues.primaireGolfHoogteMeter
      : spot.primaireGolfHoogteMeter,
    secundaireGolfHoogteMeter: Number.isFinite(liveValues.secundaireGolfHoogteMeter)
      ? liveValues.secundaireGolfHoogteMeter
      : spot.secundaireGolfHoogteMeter,
    windSnelheidKnopen: Number.isFinite(liveValues.windSnelheidKnopen)
      ? liveValues.windSnelheidKnopen
      : spot.windSnelheidKnopen,
    windRichtingGraden: Number.isFinite(liveValues.windRichtingGraden)
      ? liveValues.windRichtingGraden
      : spot.windRichtingGraden,
    windRichting: liveValues.windRichting && liveValues.windRichting !== '-'
      ? liveValues.windRichting
      : spot.windRichting,
    watertemperatuurC: Number.isFinite(liveValues.watertemperatuurC)
      ? liveValues.watertemperatuurC
      : spot.watertemperatuurC
  };
}

function getPreferredTimeOffset() {
  if (Number.isFinite(preferredSlotOffset)) {
    const preferredContext = getLiveSlotContext(preferredSlotOffset);
    if (preferredContext && passesHardConditionFilters(preferredContext)) {
      const preferred = preferredSlotOffset;
      preferredSlotOffset = null;
      return preferred;
    }
    preferredSlotOffset = null;
  }

  return getFirstFilteredAvailableOffset();
}

function renderFirstAvailableSlotForCurrentDay() {
  const groupedByDay = groupSlotsByDayAndPart(getAllLiveSlotContexts());
  ensureCurrentDayKey(groupedByDay);
  const firstSlot = getSlotsForCurrentDay(groupedByDay)[0];
  if (!firstSlot) return false;

  currentSlotKey = buildSlotKey(firstSlot);
  activeTimeOffset = firstSlot.offsetHours;
  updateTimeSelectorButtons();
  renderSpot(firstSlot.mergedSpot, firstSlot.values);
  setForecastMeta(t('forecastMetaLive', { timeLabel: formatCompactSlotTimeLabel(firstSlot.time) }), 'live');
  renderCompactForecastList();
  return true;
}

function renderLiveOffset(offsetHours) {
  const slotContext = getLiveSlotContext(offsetHours);
  if (!slotContext || !activeLiveCache) return false;
  if (!passesHardConditionFilters(slotContext)) return false;

  currentDayKey = slotContext.dayKey ?? currentDayKey;
  currentSlotKey = buildSlotKey(slotContext);
  activeTimeOffset = offsetHours;
  updateTimeSelectorButtons();

  renderSpot(slotContext.mergedSpot, slotContext.values);

  const tijdLabel = formatCompactSlotTimeLabel(slotContext.time);

  setForecastMeta(t('forecastMetaLive', { timeLabel: tijdLabel }), 'live');
  setActiveTimeSlotButton(offsetHours);
  renderCompactForecastList();
  void renderMultiSpotOverview(currentDayKey);
  renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
  return true;
}

async function updateForecastForSpot(spot) {
  const isDifferentSpot = !activeSpot || getSpotKey(activeSpot) !== getSpotKey(spot);
  activeSpot = spot;
  if (isDifferentSpot) {
    currentDayKey = null;
    currentSlotKey = null;
  }
  updateFavoriteToggleForSpot(spot);
  updateShareButtonForSpot(spot);
  renderSpot(spot, spot);

  const spotKey = getSpotKey(spot);
  const hasCoordinates = Number.isFinite(spot.latitude) && Number.isFinite(spot.longitude);

  if (!hasCoordinates) {
    clearActiveLiveCache();
    setForecastMeta(t('forecastMetaMissingCoords'));
    return;
  }

  const cacheEntry = forecastCache.get(spotKey);
  if (isCacheEntryFresh(cacheEntry)) {
    activeLiveCache = cacheEntry.data;
    activeTimeOffset = DEFAULT_TIME_OFFSET;
    updateTimeSelectorButtons();

    const firstAvailableOffset = getPreferredTimeOffset();
    if (firstAvailableOffset !== undefined) {
      renderLiveOffset(firstAvailableOffset);
      return;
    }

    if (renderFirstAvailableSlotForCurrentDay()) {
      void renderMultiSpotOverview(currentDayKey);
      renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
      return;
    }
  }

  const requestId = ++liveRequestId;
  clearActiveLiveCache();
  setForecastMeta(t('forecastMetaLoading', { spot: spot.naam }));

  try {
    const fetchPromise = getOrCreatePendingForecastRequest(spotKey, spot);
    const liveForecast = await fetchPromise;

    pendingForecastRequests.delete(spotKey);
    if (requestId !== liveRequestId) return;

    forecastCache.set(spotKey, {
      fetchedAt: Date.now(),
      data: liveForecast
    });
    activeLiveCache = liveForecast;
    activeTimeOffset = DEFAULT_TIME_OFFSET;
    updateTimeSelectorButtons();

    const firstAvailableOffset = getPreferredTimeOffset();
    if (firstAvailableOffset !== undefined) {
      renderLiveOffset(firstAvailableOffset);
      return;
    }

    if (!renderFirstAvailableSlotForCurrentDay()) {
      throw new Error('Geen bruikbare tijdvakken beschikbaar');
    }
    void renderMultiSpotOverview(currentDayKey);
    renderDailySurfReport(activeSpot ? getSpotKey(activeSpot) : null, currentDayKey);
  } catch (error) {
    pendingForecastRequests.delete(spotKey);
    if (requestId !== liveRequestId) return;

    clearActiveLiveCache();
    renderSpot(spot, spot);
    setForecastMeta(t('forecastMetaError', { spot: spot.naam }), 'error');
    setSearchMessage(t('searchApiError', { spot: spot.naam }), 'error');
    void renderMultiSpotOverview(null);
    renderDailySurfReport(null, null);
  }
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let col = 0; col < cols; col += 1) matrix[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function findSpotsBySubstring(name) {
  const normalizedQuery = normalizeText(name);
  if (!normalizedQuery) return [];

  return SURF_SPOTS.filter((spot) => {
    const normalizedSpotName = normalizeText(spot.naam);
    const normalizedLand = normalizeText(spot.land);
    return (
      normalizedSpotName.includes(normalizedQuery) ||
      normalizedLand.includes(normalizedQuery)
    );
  });
}

function renderSuggestions(matches) {
  if (!matches.length) {
    hideSuggestions();
    return;
  }

  const sortedMatches = sortSpotsByRegionAndName(matches);
  currentSuggestions = sortedMatches;
  activeSuggestionIndex = -1;

  const groupedMatches = REGION_ORDER
    .map((regionCode) => ({
      regionCode,
      spots: sortedMatches.filter((spot) => getSpotRegion(spot) === regionCode)
    }))
    .filter((group) => group.spots.length > 0);

  let suggestionIndex = 0;

  suggestionsListEl.innerHTML = groupedMatches
    .map((group) => {
      const headingHtml = `
        <li class="suggestion-group-heading" role="presentation">
          ${t(getRegionLabelKey(group.regionCode))}
        </li>
      `;

      const spotItemsHtml = group.spots
        .map((spot) => {
          const currentIndex = suggestionIndex;
          suggestionIndex += 1;

          return `
            <li>
              <button class="suggestion-item" type="button" data-index="${currentIndex}">
                <span class="suggestion-name">${spot.naam}</span>
                <span class="suggestion-land">${spot.land}</span>
              </button>
            </li>
          `;
        })
        .join('');

      return `${headingHtml}${spotItemsHtml}`;
    })
    .join('');

  suggestionsListEl.hidden = false;
}

function getSuggestionButtons() {
  return suggestionsListEl.querySelectorAll('.suggestion-item');
}

function setActiveSuggestion(index) {
  const buttons = getSuggestionButtons();
  if (!buttons.length) return;

  buttons.forEach((button) => button.classList.remove('is-active'));

  if (index < 0 || index >= buttons.length) {
    activeSuggestionIndex = -1;
    return;
  }

  activeSuggestionIndex = index;
  const activeButton = buttons[activeSuggestionIndex];
  activeButton.classList.add('is-active');
  activeButton.scrollIntoView({ block: 'nearest' });
}

function moveActiveSuggestion(step) {
  if (suggestionsListEl.hidden || !currentSuggestions.length) return;

  const nextIndex =
    activeSuggestionIndex < 0
      ? step > 0
        ? 0
        : currentSuggestions.length - 1
      : (activeSuggestionIndex + step + currentSuggestions.length) % currentSuggestions.length;

  setActiveSuggestion(nextIndex);
}

function detectSubstringMatchField(spot, query) {
  const normalizedQuery = normalizeText(query);
  const normalizedSpotName = normalizeText(spot.naam);
  const normalizedLand = normalizeText(spot.land);

  if (normalizedSpotName.includes(normalizedQuery)) return 'naam';
  if (normalizedLand.includes(normalizedQuery)) return 'land';
  return 'naam';
}

function getAllowedDistance(query) {
  return Math.max(
    MIN_ALLOWED_DISTANCE,
    Math.floor(query.length * MAX_DISTANCE_RATIO)
  );
}

function findBestMatchingSpot(query, spots) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return null;

  let bestSpot = null;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestField = 'naam';

  for (const spot of spots) {
    const normalizedSpotName = normalizeText(spot.naam);
    const normalizedLand = normalizeText(spot.land);

    const nameDistance = levenshteinDistance(normalizedQuery, normalizedSpotName);
    const landDistance = levenshteinDistance(normalizedQuery, normalizedLand);

    const weightedNameScore = nameDistance * NAME_MATCH_WEIGHT;
    const weightedLandScore = landDistance * LAND_MATCH_WEIGHT;

    const score = Math.min(weightedNameScore, weightedLandScore);
    const field = weightedLandScore < weightedNameScore ? 'land' : 'naam';

    if (score < bestScore) {
      bestScore = score;
      bestSpot = spot;
      bestField = field;
    }
  }

  const allowedDistance = getAllowedDistance(normalizedQuery);

  if (bestScore <= allowedDistance) {
    return { spot: bestSpot, matchBy: bestField };
  }

  return null;
}

function buildSuccessMessage(spot, method, matchBy) {
  if (method === 'favorite') {
    return t('favoriteOpened', { spot: spot.naam, country: spot.land });
  }

  if (method === 'map') {
    return t('mapSelected', { spot: spot.naam, country: spot.land });
  }

  const via = matchBy === 'land' ? t('viaCountry') : t('viaName');

  if (method === 'fuzzy') {
    return t('searchBestVia', { via, spot: spot.naam, country: spot.land });
  }

  return t('searchLoadedVia', { via, spot: spot.naam, country: spot.land });
}

function selectSpot(spot, method, query, options = {}) {
  if (!spot) return false;

  const stableSpot = getSpotById(getSpotKey(spot));
  if (!stableSpot) return false;

  const matchBy = method === 'substring' ? detectSubstringMatchField(stableSpot, query) : 'name';

  if (method !== 'restore' && shouldShowFirstRunHint) {
    shouldShowFirstRunHint = false;
    updateFirstRunHintVisibility();
  }

  updateForecastForSpot(stableSpot);
  highlightMapMarkerForSpot(stableSpot);

  const shouldCenterMap = options.centerMap !== false;
  if (shouldCenterMap) {
    const shouldAnimateMap = options.animateMap ?? method !== 'restore';
    centerMapOnSpot(stableSpot, {
      animate: shouldAnimateMap,
      zoom: options.mapZoom
    });
  }

  if (!options.silent) {
    setSearchMessage(buildSuccessMessage(stableSpot, method, matchBy), 'success');
  }

  searchInputEl.value = stableSpot.naam;
  hideSuggestions();
  if (options.persistLastSpot !== false) {
    saveLastSpotToStorage(stableSpot);
  }
  return true;
}

function resetView() {
  liveRequestId += 1;
  activeTimeOffset = DEFAULT_TIME_OFFSET;
  currentDayKey = null;
  preferredSlotOffset = null;
  setActiveTimeSlotButton(DEFAULT_TIME_OFFSET);

  setCurrentView('map');
  setActiveConditionFilters({
    minSurfable: false,
    beginnerFriendly: false,
    preferClean: false
  });

  if (levelSelectEl) {
    levelSelectEl.value = 'all';
  }
  setCurrentLevel('all');
  updateControlBadges();

  try {
    localStorage.removeItem(LAST_SPOT_STORAGE_KEY);
  } catch {
    // storage kan geblokkeerd zijn; reset gaat verder
  }

  const defaultSpot = SURF_SPOTS[0] ?? null;
  if (defaultSpot) {
    // Reset-strategie B: behoud een vaste default-spot, maar toon de kaart in wereld-overzicht.
    selectSpot(defaultSpot, 'restore', defaultSpot.naam, {
      silent: true,
      centerMap: false,
      animateMap: false,
      mapZoom: 7,
      persistLastSpot: false
    });
    resetMapViewToDefault();
  } else {
    resetMapViewToDefault();
    clearActiveLiveCache();
    setForecastMeta(t('forecastMetaMock'));
  }

  setSearchMessage(t('resetViewDone'), '');
  showStatusMessage('statusViewReset');
}

function handleSearch() {
  const query = searchInputEl.value;
  const substringMatches = findSpotsBySubstring(query);

  if (substringMatches.length > 0) {
    selectSpot(substringMatches[0], 'substring', query);
    return;
  }

  const fuzzyMatch = findBestMatchingSpot(query, SURF_SPOTS);

  if (fuzzyMatch?.spot) {
    selectSpot(fuzzyMatch.spot, 'fuzzy', query);
    return;
  }

  hideSuggestions();
  setSearchMessage(t('searchHintNotFound'), 'error');
}

function selectSuggestionByIndex(index) {
  const selectedSpot = currentSuggestions[index];
  if (!selectedSpot) return false;

  selectSpot(selectedSpot, 'substring', searchInputEl.value);
  return true;
}

function handleInputSuggestions() {
  const query = searchInputEl.value;
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    hideSuggestions();
    setSearchMessage(t('searchHintDefault'), '');
    return;
  }

  const matches = findSpotsBySubstring(query);
  renderSuggestions(matches);

  if (!matches.length) {
    setSearchMessage(t('searchHintNoDirect'), '');
  } else {
    setSearchMessage(t('searchSuggestionsCount', { count: matches.length }), '');
  }
}

searchButtonEl.addEventListener('click', handleSearch);

searchInputEl.addEventListener('input', handleInputSuggestions);

searchInputEl.addEventListener('keydown', (event) => {
  if (!suggestionsListEl.hidden && event.key === 'ArrowDown') {
    event.preventDefault();
    moveActiveSuggestion(1);
    return;
  }

  if (!suggestionsListEl.hidden && event.key === 'ArrowUp') {
    event.preventDefault();
    moveActiveSuggestion(-1);
    return;
  }

  if (event.key === 'Enter') {
    if (!suggestionsListEl.hidden && activeSuggestionIndex >= 0) {
      event.preventDefault();
      selectSuggestionByIndex(activeSuggestionIndex);
      return;
    }

    event.preventDefault();
    handleSearch();
  }
});

suggestionsListEl.addEventListener('click', (event) => {
  const button = event.target.closest('.suggestion-item');
  if (!button) return;
  const matchIndex = Number(button.dataset.index);
  selectSuggestionByIndex(matchIndex);
});

document.addEventListener('click', (event) => {
  const clickedInsideSearch = event.target.closest('.search-section');
  if (!clickedInsideSearch) {
    hideSuggestions();
  }
});

timeSelectorEl.addEventListener('click', (event) => {
  const button = event.target.closest('.time-slot-btn');
  if (!button || button.disabled) return;

  const offset = Number(button.dataset.slotOffset ?? button.dataset.offset);
  const rendered = renderLiveOffset(offset);
  if (!rendered) {
    setSearchMessage(t('noResultsWithFilters'), 'error');
  }
});

if (dayOverviewCardsEl) {
  dayOverviewCardsEl.addEventListener('click', (event) => {
    const card = event.target.closest('.day-overview-card');
    if (!card) return;

    const selectedDay = card.dataset.dayKey;
    setCurrentDayKey(selectedDay);
  });
}

if (filterMinSurfableEl && filterBeginnerFriendlyEl && filterPreferCleanEl) {
  const handleConditionFilterChange = () => {
    setActiveConditionFilters({
      minSurfable: filterMinSurfableEl.checked,
      beginnerFriendly: filterBeginnerFriendlyEl.checked,
      preferClean: filterPreferCleanEl.checked
    });
  };

  filterMinSurfableEl.addEventListener('change', handleConditionFilterChange);
  filterBeginnerFriendlyEl.addEventListener('change', handleConditionFilterChange);
  filterPreferCleanEl.addEventListener('change', handleConditionFilterChange);
}

if (viewMapBtnEl && viewListBtnEl) {
  viewMapBtnEl.addEventListener('click', () => {
    setCurrentView('map');
  });

  viewListBtnEl.addEventListener('click', () => {
    setCurrentView('list');
  });
}

if (forecastListViewEl) {
  forecastListViewEl.addEventListener('click', (event) => {
    const item = event.target.closest('.compact-forecast-item');
    if (!item) return;

    const offset = Number(item.dataset.slotOffset);
    if (!Number.isFinite(offset)) return;
    renderLiveOffset(offset);
  });

  forecastListViewEl.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const item = event.target.closest('.compact-forecast-item');
    if (!item) return;

    event.preventDefault();
    const offset = Number(item.dataset.slotOffset);
    if (!Number.isFinite(offset)) return;
    renderLiveOffset(offset);
  });
}

if (multiSpotOverviewEl) {
  multiSpotOverviewEl.addEventListener('click', (event) => {
    const item = event.target.closest('.multi-spot-item');
    if (!item) return;

    const selectedSpot = getSpotById(item.dataset.spotId);
    const bestOffset = Number(item.dataset.bestOffset);
    const bestDayKey = item.dataset.dayKey;
    if (!selectedSpot || !Number.isFinite(bestOffset)) return;

    const activeSpotKey = activeSpot ? getSpotKey(activeSpot) : null;
    if (activeSpotKey && activeSpotKey === getSpotKey(selectedSpot) && activeLiveCache) {
      if (bestDayKey) {
        currentDayKey = bestDayKey;
      }
      renderLiveOffset(bestOffset);
      return;
    }

    preferredInitialOffset = bestOffset;
    preferredSlotOffset = bestOffset;
    selectSpot(selectedSpot, 'favorite', selectedSpot.naam);
  });
}

favoriteToggleBtnEl.addEventListener('click', () => {
  if (!activeSpot) return;

  const activeSpotId = getSpotKey(activeSpot);
  if (favoriteSpotIds.has(activeSpotId)) {
    favoriteSpotIds.delete(activeSpotId);
    setSearchMessage(t('favoriteRemoved', { spot: activeSpot.naam }), '');
  } else {
    favoriteSpotIds.add(activeSpotId);
    setSearchMessage(t('favoriteAdded', { spot: activeSpot.naam }), 'success');
  }

  saveFavoritesToStorage();
  updateFavoriteToggleForSpot(activeSpot);
  renderFavoritesList();
  void renderMultiSpotOverview(currentDayKey);
  addTemporaryClass(favoriteToggleBtnEl, 'is-soft-pulse');
});

if (shareLinkBtnEl) {
  shareLinkBtnEl.addEventListener('click', async () => {
    if (!activeSpot) return;

    const deepLink = buildDeepLinkForSpot(activeSpot);

    try {
      const copied = await copyTextToClipboard(deepLink);
      if (!copied) return;

      addTemporaryClass(shareLinkBtnEl, 'is-soft-pulse');
      showStatusMessage('statusLinkCopied');
    } catch {
      // Geen status tonen bij copy-fout om ruis te beperken.
    }
  });
}

favoritesListEl.addEventListener('click', (event) => {
  const button = event.target.closest('.favorite-item-btn');
  if (!button) return;

  const spotId = button.dataset.spotId;
  const spot = getSpotById(spotId);
  if (!spot) return;

  selectSpot(spot, 'favorite', spot.naam);
});

if (legendToggleBtnEl && ratingLegendBodyEl) {
  setLegendExpanded(false);
  legendToggleBtnEl.addEventListener('click', () => {
    const isExpanded = legendToggleBtnEl.getAttribute('aria-expanded') === 'true';
    setLegendExpanded(!isExpanded);
  });
}

if (levelSelectEl) {
  levelSelectEl.value = 'all';
  updateControlBadges();
  levelSelectEl.addEventListener('change', () => {
    setCurrentLevel(levelSelectEl.value);
    updateControlBadges();
  });
}

if (languageSelectEl) {
  languageSelectEl.addEventListener('change', () => {
    setLanguage(languageSelectEl.value);
    updateControlBadges();
    if (!searchInputEl.value.trim()) {
      setSearchMessage(t('searchHintDefault'), '');
    }
  });
}

if (helpToggleBtnEl && helpPanelEl) {
  setHelpExpanded(false);
  helpToggleBtnEl.addEventListener('click', () => {
    const isExpanded = helpToggleBtnEl.getAttribute('aria-expanded') === 'true';
    setHelpExpanded(!isExpanded);
  });
}

if (themeToggleBtnEl) {
  themeToggleBtnEl.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, true);
    addTemporaryClass(themeToggleBtnEl, 'is-soft-pulse');
  });
}

if (resetViewButtonEl) {
  resetViewButtonEl.addEventListener('click', () => {
    resetView();
    addTemporaryClass(resetViewButtonEl, 'is-soft-pulse');
  });
}

const storedTheme = getStoredTheme();
setTheme(storedTheme ?? detectPreferredTheme(), false);
setCurrentView('map');
setActiveConditionFilters({
  minSurfable: false,
  beginnerFriendly: false,
  preferClean: false
});

function detectPreferredLanguage() {
  const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language];

  for (const language of browserLanguages) {
    if (typeof language !== 'string' || !language.trim()) continue;
    const normalizedLanguage = language.toLowerCase();
    const baseLanguage = normalizedLanguage.split('-')[0];

    if (SUPPORTED_LANGUAGES.includes(normalizedLanguage)) {
      return normalizedLanguage;
    }

    if (SUPPORTED_LANGUAGES.includes(baseLanguage)) {
      return baseLanguage;
    }
  }

  return 'nl';
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const isSecureProtocol = window.location.protocol === 'https:';
  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (!isSecureProtocol && !isLocalHost) {
    return;
  }

  const serviceWorkerUrl = new URL('service-worker.js', window.location.href);
  navigator.serviceWorker.register(serviceWorkerUrl.href).catch((error) => {
    console.error('Service worker registratie mislukt:', error);
  });
}

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage)
  ? savedLanguage
  : detectPreferredLanguage();
setLanguage(initialLanguage, false);

initSpotMap();

loadFavoritesFromStorage();
renderFavoritesList();
void renderMultiSpotOverview(currentDayKey);
updateFavoriteToggleForSpot(null);
updateShareButtonForSpot(null);

const deepLinkedSpot = getDeepLinkedSpotFromUrl();
const deepLinkedOffset = getDeepLinkedOffsetFromUrl();
preferredInitialOffset = Number.isFinite(deepLinkedOffset) ? deepLinkedOffset : null;
preferredSlotOffset = Number.isFinite(deepLinkedOffset) ? deepLinkedOffset : null;
const restoredSpot = getLastSpotFromStorage();
const initialSpot = deepLinkedSpot ?? restoredSpot ?? SURF_SPOTS[0];
const shouldCenterOnInitialSpot = Boolean(deepLinkedSpot || restoredSpot);
shouldShowFirstRunHint = !deepLinkedSpot && !restoredSpot;
updateFirstRunHintVisibility();

setForecastMeta(t('forecastMetaMock'));
setSearchMessage(t('searchHintDefault'), '');
if (initialSpot) {
  selectSpot(initialSpot, 'restore', initialSpot.naam, {
    silent: true,
    centerMap: shouldCenterOnInitialSpot,
    animateMap: false,
    mapZoom: 7
  });
}

registerServiceWorker();
