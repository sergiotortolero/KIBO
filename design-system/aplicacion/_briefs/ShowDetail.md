# Detalle de peli / serie

- **Artboard:** `ShowDetail.dc.html`
- **Módulo:** personal-screens.jsx
- **Origen:** `personal-screens.jsx` líneas 1397-1557
- **Propósito:** Vista de página completa de un título: progreso por temporada/episodio, rating interactivo, horas, disponibilidad con precio por plataforma, y el cuaderno de comentarios y reflexiones.

## Secciones, de arriba abajo

- Page head con botón «Volver a Entretenimiento», eyebrow Serie/Película, pip de estado, título, meta y acciones (1413-1434)
- Hero compacto: portada + bloques PROGRESO (T/E), RATING (5 estrellas clicables), HORAS y DISPONIBLE EN (chips plataforma · precio) (1437-1482)
- Temporadas y episodios (solo series): rejilla de botones E1..En por temporada con conteo y % visto (1485-1510)
- Comentarios y reflexiones: botón «Nueva reflexión», compositor inline (textarea + Cancelar/Guardar) y lista de notas etiquetadas Reflexión/Opinión (1513-1554)

## Estados que debe mostrar

- Serie vs película (secciones y acciones distintas) (1419, 1426-1431, 1485)
- Estado del título: Viendo / Visto / En pausa / Wishlist (1420)
- Compositor de reflexión abierto / cerrado (1398, 1521)
- Sin reflexiones → <EmptyState> «Sin reflexiones · Cuando algo te marque, déjalo escrito.» (1541-1542)
- Episodio visto vs no visto (clase .watched) (1500)

## Comportamientos que hay que representar

- Volver a la lista (onBack) (1415-1417)
- Calificar 1–5 estrellas → actualiza el rating y lo propaga con onUpdate (1453-1459)
- Escribir y guardar una reflexión (se etiqueta con T{n}·E{n} en series o «Reflexión» en pelis y se antepone a la lista) (1530-1537)
- Cancelar el compositor (limpia el texto) (1529)
- «Marcar siguiente ep» / «Marcar como vista» / «Editar» — botones presentes sin handler (1427-1432)
- Clic en un episodio para marcarlo — la copia lo anuncia (1489) pero los botones no tienen handler (1500-1503)

## Lee de

- El objeto show recibido por props (kind, title, meta, cover, status, rating, currentSeason, currentEpisode, totalEpisodes, platforms, hours)
- PLATFORM_PRICES
- Comentarios semilla locales (1401-1404)

## Escribe

- onUpdate({...show, rating}) hacia EntretenimientoScreen
- Lista local de comentarios/reflexiones

## Conceptos del núcleo que toca

- fact record
- identity
- shell
