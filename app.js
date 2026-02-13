const spotNameEl = document.getElementById('spotName');
const waveHeightEl = document.getElementById('waveHeight');
const wavePeriodEl = document.getElementById('wavePeriod');
const windEl = document.getElementById('wind');
const temperatureEl = document.getElementById('temperature');
const forecastMetaEl = document.getElementById('forecastMeta');
const surfRatingEl = document.getElementById('surfRating');
const ratingExplanationEl = document.getElementById('ratingExplanation');
const appTitleHeadingEl = document.getElementById('appTitleHeading');
const appSubtitleEl = document.getElementById('appSubtitle');
const languageLabelEl = document.getElementById('languageLabel');
const languageSelectEl = document.getElementById('languageSelect');
const searchSectionEl = document.getElementById('searchSection');
const searchLabelEl = document.getElementById('searchLabel');
const searchButtonTextEl = document.getElementById('searchButton');
const spotMapSectionEl = document.getElementById('spotMapSection');
const spotMapTitleEl = document.getElementById('spotMapTitle');
const spotMapNoteEl = document.getElementById('spotMapNote');
const levelFilterLabelEl = document.getElementById('levelFilterLabel');
const levelFilterContainerEl = document.getElementById('levelFilterContainer');
const levelOptionAllEl = document.getElementById('levelOptionAll');
const levelOptionBeginnerEl = document.getElementById('levelOptionBeginner');
const levelOptionAdvancedEl = document.getElementById('levelOptionAdvanced');
const ratingLegendEl = document.getElementById('ratingLegend');
const legendTitleEl = document.getElementById('legendTitle');
const legendItemGoodEl = document.getElementById('legendItemGood');
const legendItemMediumEl = document.getElementById('legendItemMedium');
const legendItemBadEl = document.getElementById('legendItemBad');
const legendItemOnshoreEl = document.getElementById('legendItemOnshore');
const legendItemOffshoreEl = document.getElementById('legendItemOffshore');
const forecastLabelWaveHeightEl = document.getElementById('forecastLabelWaveHeight');
const forecastLabelWavePeriodEl = document.getElementById('forecastLabelWavePeriod');
const forecastLabelWindEl = document.getElementById('forecastLabelWind');
const forecastLabelTemperatureEl = document.getElementById('forecastLabelTemperature');
const favoritesHeadingEl = document.getElementById('favoritesHeading');
const favoritesSectionEl = document.getElementById('favoritesSection');
const infoSectionEl = document.getElementById('infoSection');
const infoHeadingEl = document.getElementById('infoHeading');
const infoLine1El = document.getElementById('infoLine1');
const infoLine2El = document.getElementById('infoLine2');
const infoLine3El = document.getElementById('infoLine3');
const infoLine4El = document.getElementById('infoLine4');
const levelSelectEl = document.getElementById('levelSelect');
const legendToggleBtnEl = document.getElementById('legendToggleBtn');
const ratingLegendBodyEl = document.getElementById('ratingLegendBody');
const spotMapEl = document.getElementById('spotMap');
const favoriteToggleBtnEl = document.getElementById('favoriteToggleBtn');
const favoritesListEl = document.getElementById('favoritesList');
const timeSelectorEl = document.getElementById('timeSelector');
const timeSlotNowEl = document.getElementById('timeSlotNow');
const timeSlot3hEl = document.getElementById('timeSlot3h');
const timeSlot6hEl = document.getElementById('timeSlot6h');
const timeSlot9hEl = document.getElementById('timeSlot9h');
const timeSlotButtons = Array.from(document.querySelectorAll('.time-slot-btn'));
const searchInputEl = document.getElementById('spotSearch');
const searchButtonEl = document.querySelector('.search-button');
const suggestionsListEl = document.getElementById('suggestionsList');
const searchMessageEl = document.getElementById('searchMessage');
const MAX_DISTANCE_RATIO = 0.35;
const MIN_ALLOWED_DISTANCE = 1;
const NAME_MATCH_WEIGHT = 1;
const LAND_MATCH_WEIGHT = 1;
const TIME_SLOT_OFFSETS = [0, 3, 6, 9];
const FORECAST_CACHE_TTL_MS = 5 * 60 * 1000;
const FAVORITES_STORAGE_KEY = 'freeSurfCastFavorites';
const LAST_SPOT_STORAGE_KEY = 'freesurfcastLastSpotId';
const OPEN_METEO_MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const OPEN_METEO_WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const LANGUAGE_STORAGE_KEY = 'freesurfcastLanguage';
const SUPPORTED_LANGUAGES = ['nl', 'en', 'fr', 'es', 'pt', 'de'];
const RATING_CLASS_NAMES = ['rating-bad', 'rating-ok', 'rating-good', 'rating-neutral'];
const SLOT_CLASS_NAMES = ['slot-bad', 'slot-ok', 'slot-good', 'slot-neutral'];
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

Object.entries(infoTranslations).forEach(([lang, extraKeys]) => {
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
let activeMapMarker = null;
let activeSpot = null;
let currentLevel = 'all';
let latestRatingConditions = null;
let currentLanguage = 'nl';

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

  const isChallenging = waveHeight > 2.3 || windSpeed >= 18 || wavePeriod >= 12;
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
  windEl.textContent = `${spot.windSnelheidKnopen} kn ${spot.windRichting}`;
  temperatureEl.textContent = `${spot.watertemperatuurC} °C`;
  renderSurfRating(ratingConditions);
}

function setLegendExpanded(isExpanded) {
  if (!legendToggleBtnEl || !ratingLegendBodyEl) return;
  legendToggleBtnEl.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  legendToggleBtnEl.textContent = isExpanded ? t('legendToggleHide') : t('legendToggleShow');
  ratingLegendBodyEl.hidden = !isExpanded;
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
  if (ratingLegendEl) ratingLegendEl.setAttribute('aria-label', t('legendAria'));
  if (legendTitleEl) legendTitleEl.textContent = t('legendTitle');
  if (legendItemGoodEl) legendItemGoodEl.innerHTML = `<span class="legend-dot legend-dot-good" aria-hidden="true"></span>${t('legendItemGood')}`;
  if (legendItemMediumEl) legendItemMediumEl.innerHTML = `<span class="legend-dot legend-dot-ok" aria-hidden="true"></span>${t('legendItemMedium')}`;
  if (legendItemBadEl) legendItemBadEl.innerHTML = `<span class="legend-dot legend-dot-bad" aria-hidden="true"></span>${t('legendItemBad')}`;
  if (legendItemOnshoreEl) legendItemOnshoreEl.textContent = t('legendItemOnshore');
  if (legendItemOffshoreEl) legendItemOffshoreEl.textContent = t('legendItemOffshore');
  if (timeSelectorEl) timeSelectorEl.setAttribute('aria-label', t('timeSelectorAria'));
  if (timeSlotNowEl) timeSlotNowEl.textContent = t('timeNow');
  if (timeSlot3hEl) timeSlot3hEl.textContent = t('timePlus3h');
  if (timeSlot6hEl) timeSlot6hEl.textContent = t('timePlus6h');
  if (timeSlot9hEl) timeSlot9hEl.textContent = t('timePlus9h');
  if (forecastLabelWaveHeightEl) forecastLabelWaveHeightEl.textContent = t('forecastWaveHeight');
  if (forecastLabelWavePeriodEl) forecastLabelWavePeriodEl.textContent = t('forecastWavePeriod');
  if (forecastLabelWindEl) forecastLabelWindEl.textContent = t('forecastWind');
  if (forecastLabelTemperatureEl) forecastLabelTemperatureEl.textContent = t('forecastTemperature');
  if (favoritesHeadingEl) favoritesHeadingEl.textContent = t('favoritesHeading');
  if (favoritesSectionEl) favoritesSectionEl.setAttribute('aria-label', t('favoritesHeading'));
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
    renderLiveOffset(activeTimeOffset);
  } else {
    setForecastMeta(t('forecastMetaMock'));
  }
  if (latestRatingConditions) {
    renderSurfRating(latestRatingConditions);
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

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap-bijdragers'
  }).addTo(map);

  const spotsWithCoordinates = SURF_SPOTS.filter(
    (spot) => Number.isFinite(spot.latitude) && Number.isFinite(spot.longitude)
  );

  const markerBounds = [];
  spotsWithCoordinates.forEach((spot) => {
    const markerPosition = [spot.latitude, spot.longitude];
    markerBounds.push(markerPosition);

    const marker = window.L.marker(markerPosition).addTo(map);
    mapMarkersBySpotKey.set(getSpotKey(spot), marker);
    marker.bindPopup(`<strong>${spot.naam}</strong><br>${spot.land}`);
    marker.bindTooltip(`${spot.naam} (${spot.land})`, {
      direction: 'top',
      offset: [0, -10]
    });
    marker.on('click', () => {
      map.flyTo(markerPosition, 8, {
        animate: true,
        duration: 0.9
      });
      setActiveMapMarker(marker);
      selectSpot(spot, 'map', spot.naam);
    });
  });

  if (markerBounds.length === 1) {
    map.setView(markerBounds[0], 6);
  } else if (markerBounds.length > 1) {
    map.fitBounds(markerBounds, {
      padding: [24, 24],
      maxZoom: 4
    });
  }

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
    const buttonOffset = Number(button.dataset.offset);
    button.classList.toggle('is-active', buttonOffset === offset);
  });
}

function clearActiveLiveCache() {
  activeLiveCache = null;
  activeTimeOffset = 0;
  timeSelectorEl.hidden = true;
  timeSlotButtons.forEach((button) => {
    button.disabled = true;
    button.classList.remove('is-active');
  });
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

function getSpotKey(spot) {
  if (spot.id) return spot.id;
  return `${normalizeText(spot.naam)}-${normalizeText(spot.land)}`;
}

function getSpotById(spotId) {
  return SURF_SPOTS.find((spot) => getSpotKey(spot) === spotId) ?? null;
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
    favoriteToggleBtnEl.classList.remove('is-active');
    return;
  }

  const isFavorite = isFavoriteSpot(spot);
  favoriteToggleBtnEl.textContent = isFavorite ? t('favoriteButtonOn') : t('favoriteButtonOff');
  favoriteToggleBtnEl.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
  favoriteToggleBtnEl.classList.toggle('is-active', isFavorite);
}

function renderFavoritesList() {
  const favorites = SURF_SPOTS.filter((spot) => favoriteSpotIds.has(getSpotKey(spot)));

  if (!favorites.length) {
    favoritesListEl.innerHTML = `<li class="favorites-empty">${t('favoritesEmpty')}</li>`;
    return;
  }

  favoritesListEl.innerHTML = favorites
    .map(
      (spot) =>
        `<li><button type="button" class="favorite-item-btn" data-spot-id="${getSpotKey(spot)}">${spot.naam} (${spot.land})</button></li>`
    )
    .join('');
}

function isCacheEntryFresh(cacheEntry) {
  if (!cacheEntry || !cacheEntry.fetchedAt || !cacheEntry.data) return false;
  return Date.now() - cacheEntry.fetchedAt <= FORECAST_CACHE_TTL_MS;
}

function buildMarineApiUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'wave_height,wave_period,sea_surface_temperature',
    forecast_days: '1',
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
    forecast_days: '1',
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
      windSnelheidKnopen: weatherHourly?.wind_speed_10m?.[weatherIndex],
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

  timeSelectorEl.hidden = false;

  timeSlotButtons.forEach((button) => {
    const offset = Number(button.dataset.offset);
    const snapshot = getLiveSnapshotForOffset(offset);
    const isAvailable = Boolean(snapshot);

    button.classList.remove(...SLOT_CLASS_NAMES);

    if (!isAvailable) {
      button.classList.add('slot-neutral');
    } else {
      const slotRating = calculateSurfRating(snapshot.values);
      if (!slotRating?.score) {
        button.classList.add('slot-neutral');
      } else if (slotRating.ratingClass === 'rating-good') {
        button.classList.add('slot-good');
      } else if (slotRating.ratingClass === 'rating-ok') {
        button.classList.add('slot-ok');
      } else {
        button.classList.add('slot-bad');
      }
    }

    button.disabled = !isAvailable;
    button.classList.toggle('is-active', offset === activeTimeOffset && isAvailable);
    button.title = isAvailable ? '' : t('timeSlotUnavailable');
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
    windSnelheidKnopen: Number.isFinite(liveValues.windSnelheidKnopen)
      ? liveValues.windSnelheidKnopen
      : spot.windSnelheidKnopen,
    windRichting: liveValues.windRichting && liveValues.windRichting !== '-'
      ? liveValues.windRichting
      : spot.windRichting,
    watertemperatuurC: Number.isFinite(liveValues.watertemperatuurC)
      ? liveValues.watertemperatuurC
      : spot.watertemperatuurC
  };
}

function findFirstAvailableOffset() {
  return TIME_SLOT_OFFSETS.find((offset) => Boolean(getLiveSnapshotForOffset(offset)));
}

function renderLiveOffset(offsetHours) {
  const snapshot = getLiveSnapshotForOffset(offsetHours);
  if (!snapshot || !activeLiveCache) return false;

  activeTimeOffset = offsetHours;
  updateTimeSelectorButtons();

  const mergedSpot = mergeWithFallbackSpot(activeLiveCache.spot, snapshot.values);
  renderSpot(mergedSpot, snapshot.values);

  const tijdLabel = snapshot.time
    ? new Date(snapshot.time).toLocaleString(getLocaleForLanguage(), {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      })
    : t('fallbackUnknownTime');

  setForecastMeta(t('forecastMetaLive', { timeLabel: tijdLabel }), 'live');
  setActiveTimeSlotButton(offsetHours);
  return true;
}

async function updateForecastForSpot(spot) {
  activeSpot = spot;
  updateFavoriteToggleForSpot(spot);
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
    activeTimeOffset = TIME_SLOT_OFFSETS[0];
    updateTimeSelectorButtons();

    const firstAvailableOffset = findFirstAvailableOffset();
    if (firstAvailableOffset !== undefined) {
      renderLiveOffset(firstAvailableOffset);
      return;
    }
  }

  const requestId = ++liveRequestId;
  clearActiveLiveCache();
  setForecastMeta(t('forecastMetaLoading', { spot: spot.naam }));

  try {
    let fetchPromise = pendingForecastRequests.get(spotKey);
    if (!fetchPromise) {
      fetchPromise = fetchLiveForecastForSpot(spot);
      pendingForecastRequests.set(spotKey, fetchPromise);
    }

    const liveForecast = await fetchPromise;

    pendingForecastRequests.delete(spotKey);
    if (requestId !== liveRequestId) return;

    forecastCache.set(spotKey, {
      fetchedAt: Date.now(),
      data: liveForecast
    });
    activeLiveCache = liveForecast;
    activeTimeOffset = TIME_SLOT_OFFSETS[0];
    updateTimeSelectorButtons();

    const firstAvailableOffset = findFirstAvailableOffset();
    if (firstAvailableOffset === undefined) {
      throw new Error('Geen bruikbare tijdvakken beschikbaar');
    }

    renderLiveOffset(firstAvailableOffset);
  } catch (error) {
    pendingForecastRequests.delete(spotKey);
    if (requestId !== liveRequestId) return;

    clearActiveLiveCache();
    renderSpot(spot, spot);
    setForecastMeta(t('forecastMetaError', { spot: spot.naam }), 'error');
    setSearchMessage(t('searchApiError', { spot: spot.naam }), 'error');
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

  currentSuggestions = matches;
  activeSuggestionIndex = -1;

  suggestionsListEl.innerHTML = matches
    .map(
      (spot, index) => `
        <li>
          <button class="suggestion-item" type="button" data-index="${index}">
            <span class="suggestion-name">${spot.naam}</span>
            <span class="suggestion-land">${spot.land}</span>
          </button>
        </li>
      `
    )
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
  updateForecastForSpot(stableSpot);
  highlightMapMarkerForSpot(stableSpot);

  if (!options.silent) {
    setSearchMessage(buildSuccessMessage(stableSpot, method, matchBy), 'success');
  }

  searchInputEl.value = stableSpot.naam;
  hideSuggestions();
  saveLastSpotToStorage(stableSpot);
  return true;
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

  const offset = Number(button.dataset.offset);
  const rendered = renderLiveOffset(offset);
  if (!rendered) {
    setSearchMessage(t('liveNoTimeslot'), 'error');
  }
});

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
});

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
  levelSelectEl.addEventListener('change', () => {
    setCurrentLevel(levelSelectEl.value);
  });
}

if (languageSelectEl) {
  languageSelectEl.addEventListener('change', () => {
    setLanguage(languageSelectEl.value);
    if (!searchInputEl.value.trim()) {
      setSearchMessage(t('searchHintDefault'), '');
    }
  });
}

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
setLanguage(savedLanguage ?? 'nl', false);

initSpotMap();

loadFavoritesFromStorage();
renderFavoritesList();
updateFavoriteToggleForSpot(null);

const restoredSpot = getLastSpotFromStorage();
const initialSpot = restoredSpot ?? SURF_SPOTS[0];

setForecastMeta(t('forecastMetaMock'));
setSearchMessage(t('searchHintDefault'), '');
if (initialSpot) {
  selectSpot(initialSpot, 'restore', initialSpot.naam, { silent: true });
}
