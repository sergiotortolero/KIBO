# Mi progreso

- **Artboard:** `CharacterScreen.dc.html`
- **Módulo:** economia
- **Origen:** `character-screen.jsx` líneas 341-544
- **Propósito:** Lectura honesta del avance: carta de presentacion en modo lectura, prestigio y emblemas, logros, indicadores con filtro de periodo, graficos de tendencia y proyeccion, consistencia, ritmo por dia y desglose por area de vida. Ruta 'progreso' del shell (dashboard-v2.jsx:1557-1561).

## Secciones, de arriba abajo

- Page head: eyebrow 'Perfil · Indicadores personales', h1 'Mi progreso.' con InfoDot (430-435)
- VITRINA: <CallingCard readOnly> — identidad, nivel/paragon, titulo honorifico, companero y casillas que presume (438)
- PROGRESION: SectionHead 'Prestigio y emblemas' o 'Rango y progresion' + <ProgressPanel> (441-444)
- LOGROS: SectionHead + <AchievementsPanel> (447-450)
- PeriodFilter — gobierna todos los graficos de abajo (453)
- 'Tus numeros': grid .kbv-char-bench-grid con los 8 CHAR_BENCH (XP ganado, XP por dia, Tareas cerradas, Cumplimiento habitos, Retos ganados, Horas en foco, Racha actual, Dias activos), cada uno con valor, delta y Sparkline (456-472)
- Graficos de tendencia: 'XP a lo largo del tiempo' (LineChart) y 'XP acumulado + proyeccion' (LineChart cumulative con proyeccion) (475-490)
- Callout de proyeccion .kbv-proj-callout con ETA al siguiente nivel, ETA al proximo prestigio y proximo destino (493-508)
- Consistencia (<ConsistencyHeatmap>) y Tu ritmo por dia (<WeekdayBars>) (511-520)
- Por area de vida: barra de distribucion de XP + leyenda + grid de AreaBench, con accion 'Ver areas' (523-540)

## Estados que debe mostrar

- Prestigiado (pres.prestiged) vs rango normal — cambia el titulo de la seccion de progresion
- Maestro / Leyenda (pres.master): la carta muestra nivel paragon, barra rainbow y ETA a hito de paragon en vez de ETA a prestigio
- period del filtro (usePeriod('30d')) reescala benchmarks, series y proyecciones
- Area prioritaria (mayor XP acumulado) resaltada con sello 'Prioridad'; area maestra con estrellas
- Fallbacks: si AchievementsPanel o KIBO_AREAS_V2 no existen, esas piezas no se dibujan

## Comportamientos que hay que representar

- Cambiar el periodo con PeriodFilter y ver reescalar todos los indicadores y graficos
- Abrir un area concreta: openArea despacha 'kibo:navigate' {screen:'areas', area:id} con fallback a onNavigate('areas')
- Accion 'Ver areas' del SectionHead → onNavigate('areas')
- Desde la CallingCard readOnly, el boton 'Personalizar' salta a Personalizacion → Carta (goVitrinaTienda)
- Escucha 'kibo:emblem-change' para repintar el emblema equipado; usePrestigeRepaint para los nombres de prestigio
- CODIGO MUERTO EN LA PANTALLA: goals/slots/contribute/withdraw/reservedGems/reservedCoins/friendGems (364-381) se calculan pero no se renderizan — la lista de deseos se mudo a la Tienda (WishlistTab); el array WISHLIST solo sobrevive aqui como semilla exportada a window

## Lee de

- stats.level, xp, xpMax, prestigeCompleted, prestigeMaster, paragonLevel
- user.areas, KIBO_AREAS_V2, AREA_LEVELS_V2, DEMO_PROJECTS_BY_AREA
- CHAR_BENCH + genSeries/mulberry/periodMeta para las series simuladas
- CELESTIAL y prestigeName() para el proximo destino
- window.ACHIEVEMENTS, window.MONTHLY_EMBLEMS (a traves de CallingCard)
- Cosmeticos de carta via useCardCosmetics/CardBackdrop/frameRingStyle

## Escribe

- CustomEvent 'kibo:navigate' ({screen:'areas', area}) y ({screen:'personalizar', tab:'carta'})
- localStorage 'kibo:cardPins' y 'kibo:cardTagline' (a traves de CallingCard, pero readOnly aqui no los edita)

## Conceptos del núcleo que toca

- progression engine
- identity
- economy/ledger
- fact record
- task
- project
- reto
- habit
- shell

## Modales que se dibujan sobre esta pantalla

### Selector de lo que presumes
- Se abre desde: CallingCard (modo editable, no readOnly) — click en una casilla .cc-pin (254)
- Propósito: Popover .cc-picker sobre una casilla de la vitrina para elegir que logro o estandarte mensual se presume en ella.
- Campos: Lista de opciones del pool: emblemas mensuales (MONTHLY_EMBLEMS) primero y luego logros conseguidos (ACHIEVEMENTS con fecha o progreso completo), cada uno con su icono, nombre y color de rareza
- Acciones: Elegir una opcion → setPinAt(indice, key) y cierra el picker · Salir con el mouse (onMouseLeave) cierra el picker · Volver a hacer click en la misma casilla alterna cerrado
- Estados: Cerrado (picking == null) · Abierto sobre la casilla i · Opcion ya fijada en esa casilla marcada con clase 'on' · No existe en modo readOnly: ahi las casillas son estaticas y las vacias ni se dibujan
- Origen: `character-screen.jsx` 259-268
