# Detalle de proyecto

- **Artboard:** `ProjectDetail.dc.html`
- **Módulo:** Proyectos
- **Origen:** `screens-v2.jsx` líneas 1296-1439
- **Propósito:** Vista de página completa de un proyecto (push-replace dentro de Proyectos): ficha, pulso de métricas, hitos, tareas ligadas, cronograma propio y configuración.

## Secciones, de arriba abajo

- Botón de vuelta «Todos los proyectos»
- Cabecera: glifo del área, migas (chip de área → goToArea + pip de estado), nombre, meta/descripción, bloque de recompensa a la derecha (Avance % y N/N tareas ligadas)
- Tarjeta de pulso: 5 celdas (Avance, Tareas ligadas/Tareas, Complejidad, Prioridad, Estimado en días) + barra de progreso
- Tabs PROJECT_TABS: Resumen · Tareas · Cronograma · Configuración
- Tab Resumen: tarjeta 'Ficha' (Área, Estado, Inicio, Fin objetivo, Etiquetas, descripción) + tarjeta 'Hitos del proyecto' (Arranque, Primer tercio, Mitad, Revisión, Cierre con estado done/next/todo)
- Tab Tareas: 'Tareas ligadas' con contador y lista de related-task (prioridad, título, esfuerzo, pip de estatus, flecha)
- Tab Cronograma: <ProjectScheduleCard> (KbGantt de las tareas del proyecto)
- Tab Configuración: <ProjectConfig>

## Estados que debe mostrar

- 4 tabs (resumen por defecto)
- Sin tareas ligadas: EmptyState 'Sin tareas ligadas' / «Crea una tarea y asígnala a este proyecto para verla aquí.»
- Conteo 'ligadas' (hay vínculo real por PROJECT_TASK_KEYS) vs conteo propio del proyecto
- Cronograma sin tareas: 'Este proyecto todavía no tiene tareas ligadas.'
- Proyecto sin área (usa el color de la complejidad y 'Sin área')

## Comportamientos que hay que representar

- Volver al tablero de proyectos
- Cambiar de tab
- Ir al área del proyecto desde la miga o la ficha (goToArea(areaId,'proyectos'))
- Abrir una tarea ligada → onOpenTask → CustomEvent 'kibo:navigate' {screen:'tarea', taskId}
- Mover fechas de las tareas arrastrando en el cronograma del proyecto (estado local del card)
- Guardar / archivar / borrar el proyecto desde la pestaña Configuración

## Lee de

- projectTaskCount / projectPct (fuente única de avance y conteo)
- DEMO_TASKS_FULL filtradas por PROJECT_TASK_KEYS[project.name]
- COMPLEXITY_DEFS, PRIORITY_DEFS, PROJECT_STATUS_LABELS, TASK_STATUS_LABELS_V2, KIBO_AREAS_V2, MS_KIND, kgFmt
- projectMilestones(p)

## Escribe

- onSave del proyecto (campos editados, archived:true, deleted:true)
- CustomEvent 'kibo:navigate'

## Conceptos del núcleo que toca

- project
- task
- identity (áreas)
- progression engine (hitos y XP al cerrar)
- shell
