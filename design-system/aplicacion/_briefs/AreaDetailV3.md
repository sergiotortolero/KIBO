# Detalle de área (Progreso · Proyectos · Configuración)

- **Artboard:** `AreaDetailV3.dc.html`
- **Módulo:** areas
- **Origen:** `areas-v2.jsx` líneas 418-527
- **Propósito:** Everything about one area: its rank/prestige panel, its strategic pulse and 8-week trend, its milestone/achievement timeline, then the hierarchy below it and its configuration. Tab labels adapt to the area type.

## Secciones, de arriba abajo

- Back link 'Todas las áreas' (436)
- kbv-area-detail-head — area glyph (master-ring if Maestro), name + AreaRankStars, subtitle '{rank} · Prestigio n/5 — {desc}' or 'Grado supremo · ascenso infinito', level badge 'Nv {n}' + 'de 50' or 'sin tope'; header background tinted by area.bgTint (439-452)
- Sub-tabs: Progreso (trending-up) · Proyectos|Retos y hábitos|Aprendizaje|Finanzas (layers) · Configuración (settings) (428-432, 454-460)
- PROGRESO: <AreaRankPanel> (465)
- PROGRESO: card 'Pulso del área' + InfoDot — 6-cell kbv-area-pulsegrid with tone flag (▲ good / ▼ bad / ! warn / – neutral) + 'Tendencia · 8 semanas' sparkline and a week-over-week delta stat (467-489)
- PROGRESO: card 'Hitos y logros' + InfoDot — kbv-area-timeline of milestones, each with kind pill (Nivel/Récord/Proyecto/Racha/Prestigio/Meta/Logro), date, title, detail; 'Próximo' state for upcoming goals (492-513)
- PROYECTOS tab → <AreaProjectsV3> (519)
- CONFIG tab → <AreaConfigV3> (522-524)

## Estados que debe mostrar

- sub = progreso | proyectos | config (initialTab from navDetail.tab)
- master (rainbow ring, 'sin tope' level, 'Grado supremo')
- non-master (shows rank name + Prestigio n/5)
- milestone state: done | next
- area.bgTint 0|1|2 changes the header wash

## Comportamientos que hay que representar

- Switch sub-tab (456)
- Back to panorama (436)
- Tap a milestone → HitoModal (498, 514)
- Tab label morphs by hier.kind: will → 'Retos y hábitos', study → 'Aprendizaje', finance → 'Finanzas', else 'Proyectos' (430)

## Lee de

- AREA_PROG_V3
- AREA_RULES
- AREA_HIER_V3
- AREA_PULSE_V3 (metrics + period)
- AREA_TREND_V3
- AREA_MILESTONES_V3
- RANK_NAMES (via areaRankName)
- areaIsMaster

## Escribe

- onSave → area patch (delegated to AreaConfigV3)

## Conceptos del núcleo que toca

- identity
- progression engine
- habit
- reto
- project
- task
- fact record
- shell

## Modales que se dibujan sobre esta pantalla

### Detalle de hito / logro
- Se abre desde: AreaDetailV3 → Progreso tab → 'Hitos y logros' timeline item (areas-v2.jsx:498, 514)
- Propósito: Read-only detail of one milestone from the area timeline — what it was, when, and whether it is already recorded in the area's trajectory.
- Campos: Kind pill (Nivel / Récord / Proyecto / Racha / Prestigio / Meta / Logro) with its icon and colour · Date chip · 'Logro' trophy pill when hito.achievement · Detail paragraph · Closing note
- Acciones: Listo (closes)
- Estados: done → 'Logrado y guardado en tu trayectoria de esta área.' · next → subtitle 'Próximo' and 'Meta próxima — al cumplirla quedará registrada en tu trayectoria.' · achievement → extra trophy pill
- Origen: `areas-v2.jsx` 591-605
