# Proyectos (tablero + roadmap)

- **Artboard:** `ProjectsScreen.dc.html`
- **Módulo:** Proyectos
- **Origen:** `screens-v2.jsx` líneas 1485-1678
- **Propósito:** Tablero kanban de 5 columnas para gestionar proyectos, con límite de trabajo en curso (WIP) para forzar foco, KPIs de cartera y un roadmap/cronograma explorable donde cada proyecto despliega sus tareas. Proyectos AGRUPA (dice de qué es cada cosa); Tareas decide qué sigue.

## Secciones, de arriba abajo

- Page head: eyebrow crumb('projects','Vista completa') + H1 «Proyectos.» + InfoDot; acciones = botón icono 'Configurar el tablero' + botón primario «Nuevo proyecto»
- KPI grid de 4: En progreso (WIP) con límite, Avance promedio (+8% vs 30 días), Completados este trim. (Q2 2026), Ritmo de cierre (1.4/sem)
- Barra de filtros: select Área (con 'Sin área'), grupo Complejidad (Todas + Simple/Media/Compleja/Épica), botón link 'Limpiar'
- Kanban de 5 columnas fijas (PROJECT_COLUMNS: Por hacer/idea, Planeación, En progreso, Revisión, Terminado) con contador y contador en rojo al pasarse del límite; botón 'Anotar idea' solo en la primera columna
- Roadmap / cronograma: <ProjectTimeline> con filtros propios (área, prioridad, avance ≥ %)
- Modales: CreateProjectModal y BoardConfigModal

## Estados que debe mostrar

- Lista (tablero + roadmap) vs detalle: si openProject está definido, ProjectDetail REEMPLAZA toda la pantalla
- Columna sobre el límite WIP (count con clase over-wip) / bajo el límite / sin tope ('Sin tope — ponle uno en el engrane')
- Arrastrando proyecto / columna en over
- Filtros por área y complejidad activos
- Config del tablero cargada desde localStorage 'kibo:board-proyectos' o por defecto {wip:{wip:3}, fields:{area,complexity,tasks,due}}
- Deep-link navDetail: con destino abre el proyecto, SIN destino cierra el detalle

## Comportamientos que hay que representar

- Arrastrar tarjetas de proyecto entre las 5 columnas → cambia p.status
- Abrir el detalle de un proyecto (ProjectDetail) al tocar la tarjeta
- Crear proyecto ('Nuevo proyecto' o 'Anotar idea') — nace en status 'idea'
- Configurar el tablero: límites WIP por columna, qué campos muestra la tarjeta y consulta de tiempo promedio por complejidad; se persiste en localStorage
- Filtrar por área y complejidad; limpiar filtros
- Roadmap: filtrar por área/prioridad/avance mínimo, desplegar las tareas hijas de un proyecto, mover fechas arrastrando (onDates → tlStart/tlEnd), abrir proyecto o tarea desde una barra
- Abrir una tarea desde el roadmap o el detalle emite CustomEvent('kibo:navigate',{screen:'tarea',taskId})
- Guardar / archivar / borrar proyecto desde la pestaña Configuración del detalle (borrado quita el proyecto de la lista)
- Deep-link vía navDetail {area, project, create}

## Lee de

- DEMO_PROJECTS_KANBAN sembrado con seedProjectDates (fechas deterministas por complejidad)
- window.DEMO_TASKS_FULL + PROJECT_TASK_KEYS para contar tareas ligadas
- COMPLEXITY_DEFS (label, expectedDays, xpReward), PRIORITY_DEFS/PRIORITY_ORDER, KIBO_AREAS_V2
- localStorage 'kibo:board-proyectos'
- prop navDetail y prop hero

## Escribe

- Estado local de proyectos: status, tlStart/tlEnd (fechas del roadmap), altas, edición completa y borrado
- localStorage 'kibo:board-proyectos' (límites WIP + campos visibles de la tarjeta)
- CustomEvent 'kibo:navigate' {screen:'tarea', taskId}

## Conceptos del núcleo que toca

- project
- task
- identity (áreas)
- progression engine (XP por complejidad)
- shell (navegación y persistencia local)

## Modales que se dibujan sobre esta pantalla

### Configurar el tablero
- Se abre desde: ProjectsScreen — botón icono 'Configurar el tablero' en la cabecera
- Propósito: Ajustes que se tocan una vez cada tanto: límite de trabajo en curso por columna, qué datos muestra cada tarjeta y consulta del tiempo promedio de cierre por complejidad. Vive en modal para no ocupar una banda permanente sobre el tablero.
- Campos: Por columna: stepper de límite WIP (−/+, tope 20, 0 = sin tope mostrado como '—'), con punto de color, nombre y marca 'Fija' si la columna es locked · Qué enseña cada tarjeta: 4 interruptores BOARD_CARD_FIELDS — Área ('Punto de color y nombre del área'), Complejidad ('Etiqueta y XP al cerrar'), Avance de tareas ('Cuántas van de cuántas'), Fecha objetivo ('Cuándo debería terminar') · Tiempo promedio para terminar: KPIs de solo lectura por complejidad (días promedio + '+X XP al cerrar')
- Acciones: − / + en el stepper de cada columna · Activar/desactivar cada campo de la tarjeta · Cancelar · Guardar
- Estados: Columna con límite vs sin tope ('—') · Columna fija (etiqueta 'Fija') · Campo activo (check) vs inactivo · Tamaño lg; el guardado persiste en localStorage 'kibo:board-proyectos'
- Origen: `screens-v2.jsx` 972-1040
