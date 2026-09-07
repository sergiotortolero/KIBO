# Pestaña Agenda — línea del tiempo semanal + entregas

- **Artboard:** `EstudioAgendaV2.dc.html`
- **Módulo:** Estudio
- **Origen:** `estudio-escuela.jsx` líneas 468-514
- **Propósito:** Horario de materias como calendario Lun–Sáb con eje de horas, y la lista de entregas que son literalmente las tareas del tablero de Sabiduría, con su mismo detalle.

## Secciones, de arriba abajo

- Encabezado «Horario de materias» con meta explicativa (484-487)
- AgendaTimeline (488)
- Encabezado «Entregas y tareas» + botón «Nueva tarea» (491-494)
- kbv-deadlines: filas clicables con check, pill de tipo, título + proyecto y vencimiento (495-508)
- TaskDetailModal montado al seleccionar una fila (509-511)

## Estados que debe mostrar

- Fila done (clase 'done') vs urgente (dleft<=3)
- openTaskId → modal de detalle abierto
- Fuente académica vacía si DEMO_TASKS_FULL no existe (472)

## Comportamientos que hay que representar

- Calificar esfuerzo e interés de cada materia desde la tarjeta de clase (rate(), 475)
- Alternar hecha/por hacer con el check, sin abrir el detalle (stopPropagation, 500)
- Clic en la fila abre TaskDetailModal; al guardar reemplaza la tarea en la lista (509-511)
- «Nueva tarea» emite navegación a Tareas en modo creación con área wisdom (493)
- Orden: no hechas primero, luego por días restantes (478)

## Lee de

- DEMO_TASKS_FULL filtradas por t.taskType (472)
- DEMO_PROJECTS_FOR_FILTER para el nombre del proyecto (477)
- SCHOOL_SUBJECTS_V2 y SCHOOL_PROFESSORS_V2 vía AgendaTimeline
- ATASK_TYPE (56)

## Escribe

- CustomEvent kibo:navigate {screen:'tareas', create:true, area:'wisdom'} (493)
- Estado local de tareas (toggle y onSave del modal) y de materias (esfuerzo/interés)

## Conceptos del núcleo que toca

- task
- fact record
- shell
- progression engine

## Modales que se dibujan sobre esta pantalla

### Detalle de tarea (compartido con Tareas)
- Se abre desde: EstudioAgendaV2 → clic en una fila de «Entregas y tareas» (estudio-escuela.jsx:499)
- Propósito: Abrir el detalle completo de una entrega académica sin duplicar componente: la Agenda usa el mismo modal que el tablero de Tareas.
- Campos: Los del detalle de tarea del tablero (definidos fuera de este grupo)
- Acciones: Guardar → reemplaza la tarea en la lista local (510) · Cerrar → setOpenTaskId(null)
- Estados: Montado solo si openTask existe y TaskDetailModal es función (509)
- Origen: `estudio-escuela.jsx` 509-511 (componente definido en screens-v2.jsx)
