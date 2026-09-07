# Entretenimiento

- **Artboard:** `EntretenimientoScreen.dc.html`
- **Módulo:** personal-screens.jsx
- **Origen:** `personal-screens.jsx` líneas 1236-1395
- **Propósito:** Registro propio de pelis y series: estado (viendo/visto/en pausa/wishlist), rating, progreso de episodios, plataformas con su precio y horas en pantalla — sin depender de apps externas.

## Secciones, de arriba abajo

- Page head: crumb('watch','Entretenimiento') + H1 «Entretenimiento.» con InfoDot + botones «Agregar a lista» y «Registrar vista» (1270-1279)
- Selector de periodo de indicadores: Este año / Personalizado / Todo el tiempo, con nota del periodo (1282-1290)
- KPI grid de 6: En curso, Terminados, Episodios vistos, Rating promedio, Horas totales, Veces al cine (1293-1324)
- Barra de filtros v2: bloque Estado (Todos/Viendo/Vistos/En pausa/Wishlist con conteos) y bloque Tipo (Todo/Series/Pelis) (1327-1346)
- Grid de tarjetas: portada con pip de tipo y título, estado, estrellas, progreso T/E, chips de plataforma y fila de acciones rápidas (1348-1392)

## Estados que debe mostrar

- Filtro de estado: all | watching | watched | paused | wishlist (1238, 1244-1248)
- Filtro de tipo: all | series | movie (1239)
- Periodo: year | custom | all — cambia la nota y la leyenda de «Veces al cine» (1241, 1285-1289, 1322)
- Sin rating (rating 0): no se dibujan estrellas (1362)
- Serie con progreso: barra T{n}·E{n} sobre el total de episodios (1368-1375)
- Selección: al elegir una tarjeta la pantalla se sustituye por <ShowDetail> (1263-1266)

## Comportamientos que hay que representar

- Filtrar por estado y por tipo (1331-1343)
- Cambiar el periodo de los indicadores (1285-1287)
- Abrir el detalle de una peli o serie (1350)
- Acciones rápidas por tarjeta: «Capítulo» / «Vista», «Calificar», «Comentar» — botones presentes sin handler, con stopPropagation para no abrir el detalle (1382-1388)
- Botones del head «Agregar a lista» y «Registrar vista» — presentes sin handler (1276-1277)
- Recibe actualizaciones del detalle vía onUpdate (rating) (1265)

## Lee de

- SHOWS_DEMO (kind, title, meta, cover, status, rating, currentSeason, currentEpisode, totalEpisodes, lastWatched, platforms, hours)
- PLATFORM_PRICES (precio mensual y color por plataforma)

## Escribe

- Estado local de items (rating actualizado desde ShowDetail)

## Conceptos del núcleo que toca

- fact record
- identity
- economy/ledger
- shell
