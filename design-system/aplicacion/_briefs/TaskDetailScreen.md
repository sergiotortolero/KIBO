# Detalle de tarea

- **Artboard:** `TaskDetailScreen.dc.html`
- **Módulo:** tarea-detalle.jsx
- **Origen:** `tarea-detalle.jsx` líneas 104-322
- **Propósito:** La tarea como pantalla y no como modal: destino canónico de cualquier enlace a una tarea (tablero, proyecto, buscador y KIBO). Reúne ficha, recompensa, pasos/subtareas e histórico de cambios.

## Secciones, de arriba abajo

- Botón de regreso «Todas las tareas» (154-156)
- Encabezado tintado con el color del área: glifo, migas (área → proyecto), título, descripción y bloque «Al cerrar» con XP y monedas (159-180)
- Tarjeta de pulso: 5 celdas (Estado, Prioridad, Energía, Tiempo, Pasos) + conmutador de estado (Por hacer/En curso/Bloqueado/Hecho) + acciones Editar y Marcar hecha (183-208)
- Tabs: Detalle · Pasos · Histórico (210-216)
- Tab Detalle: tarjeta «Ficha» (estado, prioridad, energía, tiempo estimado, área enlazada, proyecto enlazado) y tarjeta «Lo que mueve» (XP y monedas al cerrar) (218-259)
- Tab Pasos: tarjeta «Pasos» (checklist) y tarjeta «Subtareas» (261-294)
- Tab Histórico: <TaskHistory> + tarjeta «Añadir una nota» (296-314)
- Modal de edición y toast (316-319)

## Estados que debe mostrar

- Tarea inexistente → <EmptyState> «Esa tarea ya no existe» con acción «Ir a Tareas» (113-121)
- Tab activo: detalle | pasos | historico (107)
- Estado de la tarea: todo | doing | blocked | done; con done se oculta «Marcar hecha» (193-205)
- Sin descripción → copia de relleno «Sin descripción todavía…» (173)
- Sin pasos → «Divide la tarea en pasos para no perder el hilo al retomarla.» (266)
- Sin subtareas → «Una subtarea es trabajo que podría vivir solo; un paso, no.» (281)
- Sin área / sin proyecto (fallbacks 'Sin área' / 'Sin proyecto') (164, 234, 244)
- Toast efímero (2.2 s) tras cambiar estado, guardar cambios o añadir nota (110-111, 319)
- Modal de edición abierto, solo si existe TaskDetailModal (316)
- Botón «Añadir» deshabilitado con la nota vacía (304)

## Comportamientos que hay que representar

- Cambiar de estado con el conmutador; al cerrar avisa «Cerrada ✓ +{xp} XP · {coins} monedas», si no «Movida a «{estado}»» (139-142, 194-196)
- «Marcar hecha» directo desde las acciones (201-205)
- Marcar/desmarcar pasos de la checklist y subtareas (136-138, 270-274, 285-289)
- Saltar al área en la pestaña «proyectos» — dispara el evento window `kibo:navigate` con {screen:'areas', area, tab} (94-96, 163-165, 231-233)
- Saltar al proyecto vía onNavigate('projects', {project}) (167-169, 241-243)
- Abrir TaskDetailModal para editar y recibir el resultado con onSave (198-200, 316-318)
- Escribir una nota que se antepone al histórico como evento kind 'note' con autor «Tú» (300-311)
- Filtrar el histórico por tipo de evento dentro de <TaskHistory> (57-72)
- Volver al tablero de tareas (onBack) (154-156, 118)

## Lee de

- window.DEMO_TASKS_FULL (la tarea por taskId)
- window.DEMO_PROJECTS_FOR_FILTER (proyecto ligado)
- KIBO_AREAS_V2 (color, glifo y nombre del área)
- PRIORITY_DEFS (etiqueta y color de prioridad), curLabel('coin')
- taskHistory(task) — histórico real o derivado del estado de la tarea

## Escribe

- Estado local de la tarea (status, checklist, subtasks, history)
- Evento de histórico kind 'note' (fact record)
- Evento de ventana `kibo:navigate` (navegación a Áreas)

## Conceptos del núcleo que toca

- task
- project
- identity
- progression engine
- economy/ledger
- fact record
- shell
- KIBO
