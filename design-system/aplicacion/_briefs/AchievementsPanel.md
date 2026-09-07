# Logros y trofeos (vitrina, estandartes y catálogo)

- **Artboard:** `AchievementsPanel.dc.html`
- **Módulo:** progreso
- **Origen:** `achievements.jsx` líneas 133-279
- **Propósito:** Vitrina completa de logros estilo videojuego: cuánto llevas desbloqueado, los trofeos mensuales, los estandartes de retos cumplidos, los últimos conseguidos y el catálogo filtrable. Distingue tres clases: normales (públicos), secretos (visibles pero enmascarados) y ocultos (sin evidencia previa: solo aparecen ya ganados).

## Secciones, de arriba abajo

- 1 · kbv-ach-hero → ah-sum: eyebrow 'Tu vitrina', contador grande earned/publicTotal, barra de avance, tally ('N retos cumplidos' · 'N trofeos')
- 1b · ah-tro 'Trofeos del mes': fila de kbv-month-emblem (4 emblemas mensuales: medalla, mes, nombre, tag 'En curso' para el actual)
- 2a · kbv-ach-split / 'Retos cumplidos': banners kbv-challenge-banner (5) con icono, nombre, medidor de dificultad (RetoDifficultyMeter) + etiqueta, fecha, y sello 'Hito' si dificultad >= 4
- 2b · 'Últimos conseguidos': los 10 logros ganados más recientes ordenados por achDateVal (icono, nombre, rareza, fecha; marca OCULTO)
- 3 · kbv-ach-catalog: cabecera con conteo, fila de pestañas + filtros, y kbv-ach-grid con un AchievementTile por logro

## Estados que debe mostrar

- Pestaña 'Todos' (incluye secretos enmascarados y ocultos ya ganados)
- Pestaña 'Desbloqueados' (solo ganados, sin secretos ni ocultos)
- Pestaña 'En progreso' (no ganados con progress > 0)
- Pestaña 'Bloqueados' (no ganados con progress === 0)
- Filtro de rareza: Toda rareza / Común / Raro / Épico / Legendario (los secretos y ocultos se cuelan siempre por la condición de la línea 157)
- Orden 'Más raros' activado/desactivado (ordena por freq ascendente)
- Por tarjeta: earned, en progreso (con barra y N/M), secret-locked (enmascarado), secret-unlocked (revelado), hidden-unlocked (OCULTO), open/cerrado

## Comportamientos que hay que representar

- Cambiar de pestaña (setTab) filtra la lista del catálogo
- Elegir rareza en el <select> (setRar)
- Alternar el botón 'Más raros' (setByFreq) para ordenar por frecuencia entre usuarios
- Expandir/contraer cualquier tarjeta (estado open local en AchievementTile) para ver 'Cómo se obtiene / Cómo lo conseguiste', chips de rareza, % de usuarios que lo tienen y progreso
- La tarjeta de un logro secreto no ganado solo revela la pista (a.hint) y, al abrirse, un aviso de que la forma de obtenerlo se revela al desbloquearlo
- Los logros ocultos NO se listan si no están ganados (filtro línea 149)
- Hover/title en cada trofeo mensual y estandarte de reto

## Lee de

- ACHIEVEMENTS (14 entradas: 11 públicas, 2 secretas, 1 oculta) con progress/goal/date/freq
- MONTHLY_EMBLEMS (4 trofeos mensuales)
- CHALLENGES_DONE (5 retos cumplidos, con difficulty 1–5)
- RETO_DIFFICULTY y RetoDifficultyMeter del módulo de Retos (acceso guardado con typeof; fallback 'Reto' / --kb-primary)

## Conceptos del núcleo que toca

- progression engine
- reto
- identity
- habit
- task
- shell
