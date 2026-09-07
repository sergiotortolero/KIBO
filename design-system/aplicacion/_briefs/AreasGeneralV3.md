# Áreas · Vista general (balance, patrones, prioridades)

- **Artboard:** `AreasGeneralV3.dc.html`
- **Módulo:** areas
- **Origen:** `areas-v2.jsx` líneas 237-347
- **Propósito:** The panorama: three derived insight cards, a card per area with sparkline, and a ranked comparison table of all areas by prestige and level.

## Secciones, de arriba abajo

- kbv-area-insights — three ai-cards: 'Patrón · 30 días' (strongest by momentum, +XP30 and +levels), 'Oportunidad · 8 sem' (weakest by decline, −% or 'estable'), 'Prioridad · ahora' (most open tasks, N abiertas / M en curso); each has an ai-link CTA: Analizar / Revisar / Ver proyectos (262-281)
- Section head 'Tus áreas (N)' + hint 'Toca un área para ver su detalle' (284-287)
- kbv-area-cards — per area: glyph, name, AreaRankStars, 'Nv {level}', AreaSparkline of the 8-week trend, first pulse metric, '{activeProjects} proy · {openTasks} tareas' (288-309)
- kbv-fin-card 'Balance entre áreas' + InfoDot — ranked table with columns #, Área, Rango, Progreso general, En el puesto, Mov. (312-343)

## Estados que debe mostrar

- master area (kbv-area-mini.master, rank cell reads 'Maestro' instead of 'P{n} · Nv {lvl}')
- rank movement up / down / flat (▲ n / ▼ n / –)
- normal

## Comportamientos que hay que representar

- Click any insight CTA, area card or ranking row → onOpen(areaId) → area detail
- Ranking is computed live: sort by (prestige desc, level desc); overall progress bar = ((master ? tiers-1 : prestige) * 50 + (master ? 50 : level)) / (5*50) * 100 (330)
- strongest = max momentum; weakest = max areaDecline; priority = max open tasks (253-255)

## Lee de

- AREA_PROG_V3 (prestige, level)
- AREA_TREND_V3 (8-week activity index)
- AREA_PERIOD_V3 (xp30, lvlUp)
- AREA_RANKHIST_V3 (weeks in position, moved)
- AREA_PULSE_V3 (first metric)
- DEMO_TASKS_FULL (open / doing per area)
- DEMO_PROJECTS_BY_AREA
- areaIsMaster / areaPrestige

## Conceptos del núcleo que toca

- progression engine
- project
- task
- identity
- shell
