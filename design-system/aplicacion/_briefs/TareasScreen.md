# Tareas (backlog general)

- **Artboard:** `TareasScreen.dc.html`
- **Módulo:** Tareas
- **Origen:** `screens-v2.jsx` líneas 611-958
- **Propósito:** El BACKLOG general: todo lo que el usuario debe hacer, venga de un proyecto, una materia, un área o suelto, ordenado por CUÁNDO lo va a hacer (momento), no por columna. Responde «¿qué sigue?». Tablero kanban y cronograma son lecturas alternas de la misma lista. Los hábitos viven aparte.

## Secciones, de arriba abajo

- Page head: eyebrow crumb('tareas','Tu backlog') + H1 «Tareas.» + InfoDot explicativo; acciones = botón icono 'Configurar las columnas' (solo en vista Tablero, alterna colEditMode) + botón primario «Nueva tarea»
- Tabs de vista (TAREAS_TABS): Backlog (list) · Tablero (layers) · Cronograma (calendar)
- KPI grid de 4: en Backlog cuenta MOMENTOS (Hoy / Esta semana / Después / Algún día con su hint); en Tablero/Cronograma cuenta COLUMNAS (nombre, count, 'de N en pantalla')
- Barra de filtros v2: Filtros (select Área, select Proyecto con opción 'Sin proyecto'), Prioridad (grupo de iconos PriorityIcon + 'Todas'), Esfuerzo (grupo EnergyMeter 1–5 + 'Cualquiera'), botón link 'Limpiar'
- Vista Backlog: <TaskBacklog> — barra de alta rápida + selector de agrupador (Cuándo/Proyecto/Área/Prioridad), secciones agrupadas con drop-zones, sección 'Hechas'
- Vista Tablero: línea meta ('N tareas filtradas · N columnas' + pista de edición), kanban de columnas editables con KanbanCard y botón 'Tarea aquí' por columna, más tile 'Nueva columna' en modo edición
- Vista Cronograma: <KbGantt> 'Cronograma · cuándo cae cada cosa' (initialDays 35, filtro de estatus por columna)
- Diálogo de confirmación de columnas (useConfirm) + modales

## Estados que debe mostrar

- Vista backlog (default) / board / time
- colEditMode on/off (renombrar, recolorear, reordenar, borrar columnas)
- Agrupador del backlog: bucket (Cuándo) / project / area / priority
- Bucket vacío con drop-zone: 'Arrastra aquí lo que caiga en este momento'
- Sección agrupada vacía: 'Nada por aquí' (se ocultan las secciones sin drop y sin items)
- Sección 'Hechas' solo visible si hay tareas cerradas
- Gantt vacío: 'Sin tareas en este periodo o estatus.'
- Arrastrando tarea (fila o tarjeta) / arrastrando columna / columna en over
- Editando el nombre de una columna (input inline con Enter/Escape/blur)
- Columnas fijas (locked: 'Por hacer' primera, 'Hecho' última) con lock-pip y bloqueo de mover/borrar
- Bloqueo por mínimo de 2 columnas (diálogo 'Necesitas al menos 2 columnas')
- Deep-link entrante (navDetail) con filtro de proyecto/área, tarea abierta o alta abierta

## Comportamientos que hay que representar

- Cambiar entre Backlog / Tablero / Cronograma
- Alta rápida desde el backlog: escribir título + Enter, con select de momento (Hoy/Esta semana/Después/Algún día); hereda área y proyecto del filtro activo y deriva prioridad del bucket
- Arrastrar una fila del backlog a otro momento (moveBucket; si estaba hecha vuelve a 'todo')
- Marcar hecha / reabrir desde la fila (toggleDone: al cerrar bucket='hecho', al reabrir re-siembra bucket con seedBucket)
- Abrir el detalle de la tarea (TaskDetailModal) desde fila, tarjeta kanban o barra del cronograma
- Arrastrar tarjetas entre columnas del kanban → cambia t.status
- Modo edición de columnas: agregar columna (se inserta antes de la última fija), renombrar, ciclar color (COL_COLORS), reordenar arrastrando (las fijas quedan ancladas), quitar columna con confirmación — sus tareas se mueven a 'Por hacer'
- Filtrar por área, proyecto, prioridad y esfuerzo; 'Limpiar' resetea los cuatro
- Cronograma: zoom con la rueda, arrastre del lienzo, mini-mapa, abrir fila, mover fechas (se guardan en tlDates) y filtrar por estatus
- Deep-link vía prop navDetail: {project, area, taskId, create} aplica filtros y abre detalle o alta
- Desde el detalle: 'Ver pantalla completa' emite CustomEvent('kibo:navigate', {screen:'tarea', taskId})
- Chip de área en tarjetas/detalle → goToArea(areaId,'proyectos')

## Lee de

- DEMO_TASKS_FULL (tareas demo, incluidas las académicas con taskType/checklist/subtasks/dueLabel/dleft)
- DEMO_PROJECTS_FOR_FILTER (proyectos y materias filtrables)
- KIBO_AREAS_V2 (áreas, color y glifo)
- PRIORITY_DEFS / PRIORITY_ORDER
- prop navDetail (deep-link del shell) y prop hero

## Escribe

- Estado local de tareas: status (columna), bucket (momento), campos editados desde TaskDetailModal, altas por quickAdd y por CreateTaskModal
- Estado local de columnas del tablero (alta/renombrado/color/orden/borrado)
- tlDates: fechas movidas a mano en el cronograma
- CustomEvent 'kibo:navigate' {screen:'tarea', taskId} hacia el shell

## Conceptos del núcleo que toca

- task
- project
- identity (áreas)
- progression engine (XP al cerrar)
- economy/ledger (monedas al cerrar)
- shell (navegación por evento y deep-link)

## Modales que se dibujan sobre esta pantalla

### Detalle de tarea
- Se abre desde: TareasScreen — fila del backlog (BacklogRow), TareasScreen — tarjeta del kanban (KanbanCard), TareasScreen — barra del cronograma (KbGantt onOpenRow), tarea-detalle.jsx TaskDetailScreen (botón editar), estudio-escuela.jsx (tareas académicas)
- Propósito: Ficha completa y editable de una tarea: meta (prioridad, esfuerzo, tiempo, área, proyecto), fechas, descripción, checklist, sub-actividades y notas, con la recompensa al cerrar siempre a la vista. Es el detalle homologado que usan también Estudio y la pantalla de tarea.
- Campos: Título (texto, solo en modo edición) · Prioridad (5 tiles PRIORITY_ORDER con PriorityIcon) · Esfuerzo (RateRow 1–5, escala KB_SCALES.esfuerzo con KB_EFFORT_LABELS) · Área (select KIBO_AREAS_V2) · Proyecto (select DEMO_PROJECTS_FOR_FILTER + 'Sin proyecto') · Tiempo estimado (texto, '45m · 1.5h…') · Fecha inicio (date) · Fecha objetivo (date) · Duración (calculada en días, solo lectura) · Descripción (textarea) · Checklist: ítems con check y texto + input 'Nuevo ítem del checklist…' · Sub-actividades: ítems con check y texto + input 'Nueva sub-actividad (se convierte en tarea propia)…' · Notas adicionales (textarea)
- Acciones: Editar / Listo (alterna el bloque de edición de meta) · Marcar/desmarcar ítem del checklist · Eliminar ítem del checklist · Agregar ítem del checklist (botón + o Enter) · Marcar/desmarcar sub-actividad · Eliminar sub-actividad · Agregar sub-actividad (botón + o Enter) · Chip de área → goToArea(area,'proyectos') · «Ver pantalla completa» → cierra y emite kibo:navigate {screen:'tarea', taskId} · Cancelar · Guardar
- Estados: Meta plegada (tira de solo lectura) vs desplegada (task-edit-grid) · Checklist y subtareas con valores sembrados por defecto cuando la tarea no los trae · Progreso del checklist (barra + 'N/M completados') y contador de sub-actividades ('N/M hechas') · Píldora de recompensa en el pie: '+X XP · Y monedas' calculada como peso de prioridad × esfuerzo (×5 XP, ×3 monedas) · Tamaño lg
- Origen: `screens-v2.jsx` 191-435
