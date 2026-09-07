# Pestaña Trayectoria — indicadores y gráficos de evolución

- **Artboard:** `EstudioTrayectoriaV2.dc.html`
- **Módulo:** Estudio
- **Origen:** `estudio-escuela.jsx` líneas 517-609
- **Propósito:** Cúmulo de indicadores de tu evolución académica: horas, cursos completados, foco, ranking de XP por disciplina, distribución de esfuerzo por interés, tendencia de horas y escuelas.

## Secciones, de arriba abajo

- kbv-kpi-grid de 4: Horas totales, Cursos completados (+ en curso), Más foco en (curso con más horas), Disciplina top (541-546)
- kbv-study-cols tri → «Ranking de conocimiento» con barras por disciplina (549-560)
- «¿Dónde pones el esfuerzo?» — barras por área de interés (562-574)
- «Horas de estudio» — barras de las últimas 7 semanas + celdas «esta semana» y «% vs semana previa» (576-591)
- «Escuelas e instituciones» en rejilla auto-fit con «+ Agregar» (594-606)

## Estados que debe mostrar

- Sin cursos → topByTime undefined y se muestra '—' (544)
- Escuelas ausentes si STUDY_SCHOOLS no está definido (598)

## Comportamientos que hay que representar

- Solo lectura; «+ Agregar» sin handler (596)

## Lee de

- courses (props) para horas/completados/activos
- ranking, effortAreas y hoursTrend hardcodeados (523-536)
- STUDY_SCHOOLS global de estudio-screen.jsx (598)

## Conceptos del núcleo que toca

- progression engine (XP por disciplina)
- identity
- fact record
