# Pestaña Proyectos del área (jerarquía hacia abajo)

- **Artboard:** `AreaProjectsV3.dc.html`
- **Módulo:** areas
- **Origen:** `areas-v2.jsx` líneas 716-877
- **Propósito:** Shows what hangs off the area, in the shape that area actually uses: retos+hábitos (Voluntad), financial KPIs+goals (Riqueza), materias+cursos (Sabiduría) or projects with task rollups (Vigor / Comunidad / custom). Analysis only — every row hyperlinks out to the executing module.

## Secciones, de arriba abajo

- WILL branch → returns <AreaWillTab> (723-725)
- FINANCE branch: actnote 'Riqueza se gestiona en Finanzas…'; kbv-area-rollup of 4 KPIs (saldo total, patrimonio neto, deuda activa, ahorro·mes); feedback line about the emergency fund at 78%; card 'Metas financieras (3)' with amount / target / % bars (728-756)
- STUDY branch: actnote about materias vs cursos; rollup (materias y cursos, actividades abiertas, en progreso, bloqueadas); feedback naming the busiest item; card 'Materias (n)'; card 'Cursos (n)'; each row shows task counts todo/doing/blocked/done and % (759-811)
- DEFAULT branch: actnote naming the hierarchy label; rollup (proyectos, actividades abiertas, en progreso, bloqueadas); feedback line; card 'Proyectos (n)' with per-project bar and status chips (813-876)

## Estados que debe mostrar

- will → delegated
- finance → KPI + goals, no tasks
- study → materias and cursos lists, each possibly empty ('Sin materias registradas.' / 'Sin cursos registrados.')
- projects → list or empty ('Aún no hay nada en esta área. Crea el primero para que empiece a subir.')
- blocked > 0 → feedback switches to 'Tienes N tarea(s) bloqueada(s)… detienen el avance de toda el área'
- balanced → 'Buen balance de carga en {área}'

## Comportamientos que hay que representar

- Tap a financial goal → nav('finanzas', {project: id}) (743)
- 'Abrir Finanzas' → nav('finanzas', {section:'projects'}) (740)
- Tap a materia/curso → CourseAreaModal (771)
- 'Abrir Estudio' → nav('estudio', {area}) (800, 804)
- Tap a project → nav(screen, {area, project}) where screen comes from AREA_HIER_V3 (salud / estudio / finanzas / habits / projects) (855)
- Header CTA label is 'Abrir {hier.home}' or 'Abrir Proyectos' (828, 851)
- Percentages/counts derived from tasksOfProject + statusCounts — never invented locally (761, 818)

## Lee de

- AREA_HIER_V3
- DEMO_PROJECTS_BY_AREA
- DEMO_PROJECTS_FOR_FILTER
- DEMO_TASKS_FULL (via tasksOfProject)
- FINANCE_KPIS_V3
- FINANCE_GOALS_V3
- STUDY_MATERIA_IDS
- PULSE_TONE

## Escribe

- kibo:navigate CustomEvent → finanzas, estudio, projects, salud, tareas

## Conceptos del núcleo que toca

- project
- task
- economy/ledger
- shell

## Modales que se dibujan sobre esta pantalla

### Detalle de curso / materia (Sabiduría)
- Se abre desde: AreaProjectsV3 → study branch → materia or curso card (areas-v2.jsx:771, 808)
- Propósito: Detail of one curso or materia hanging off Sabiduría: completion %, task status breakdown and up to 6 of its tasks, each linking into the Tareas screen. Size 'lg'.
- Campos: Type pill 'Materia' (graduation icon) or 'Curso' (layers icon) · Area pill 'Sabiduría' · Chip '{n} tareas · {pct}% completado' · Progress bar · Detail rows: Por hacer / En curso / Bloqueadas (only when > 0) / Hechas · Task list (up to 6 <ActivityLink> rows with status label and ✓ badge when done)
- Acciones: Cerrar · Abrir en Estudio → nav('estudio', {project: item.id}) · Per-task row → nav('tareas', {area:'wisdom', taskId})
- Estados: materia vs curso (different pill, icon and accent colour) · no blocked tasks → the Bloqueadas row is hidden · zero tasks → the task list block is omitted
- Origen: `areas-v2.jsx` 609-642
