# Tutorial guiado sobre el dashboard

- **Artboard:** `TutorialOverlay.dc.html`
- **Módulo:** dashboard
- **Origen:** `dashboard-v2.jsx` líneas 1222-1382
- **Propósito:** Paso final del onboarding: monta un shell REAL (Sidebar + Header + TodayDashboard con reto activo + QuickFab) como telón de fondo, lo oscurece y va iluminando con un recorte (spotlight) las 5 zonas que explica.

## Secciones, de arriba abajo

- Barra de pasos superior `.kbv-stepbar` con 4 segmentos (1309-1313)
- Backdrop vivo: `.kbv-shell` con Sidebar, Header, TodayDashboard(bossActive=true) y QuickFab (1315-1326)
- Velo oscuro con blur sobre todo (1328-1335)
- Recorte/spotlight con borde primario y sombra de 9999px alrededor del elemento medido (1337-1349)
- Tarjeta del tutorial `.kbv-tut-card`: badge «Paso n de 5 · Tutorial», título, cuerpo, puntos, botones y «Saltar tutorial» (1351-1379)

## Estados que debe mostrar

- 5 pasos: sidebar (align right), header (bottom), habits (bottom), tasks (top), fab (top) (1232-1252)
- box medido → spotlight visible; box null → sin recorte y tarjeta en posición fallback {top:200,left:200} (1258-1282)
- Primer paso: sin botón «Atrás» (1360-1364)
- Último paso: el botón primario es «Empezar» en lugar de «Siguiente» (1365-1373)

## Comportamientos que hay que representar

- Siguiente / Atrás cambian stepIdx (1361, 1366)
- «Empezar» y «Saltar tutorial» llaman onNavigate('dashboard') (1370, 1376)
- Mide el objetivo relativo a `.kbv-window` al montar, 80 ms después y en cada resize (1259-1279)
- Posiciona la tarjeta según step.align (right/left/top/bottom) con clamp a los bordes de la ventana (1281-1305)
- Los pasos «habits» y «tasks» NO tienen destino real: refs.habits y refs.tasks se crean (1227-1228) pero nunca se adjuntan a ningún nodo — solo sidebar, header y fab llevan ref (1316, 1320, 1322); `refs` se pasa a TodayDashboard que únicamente lee refs.onNavigate (1148). En esos dos pasos el spotlight desaparece y la tarjeta cae al fallback.
- La barra de pasos es estática: siempre pinta 4 segmentos con los dos primeros «done» y el tercero «active», sin relación con stepIdx (1311)

## Lee de

- user, stats (los mismos del shell)
- DOM: getBoundingClientRect del objetivo y de `.kbv-window`

## Escribe

- ninguno (no persiste nada; solo navega a 'dashboard')

## Conceptos del núcleo que toca

- shell
- habit
- task
- KIBO
- progression engine
- identity
