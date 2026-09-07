# Pestaña Cursos — catálogo + backlog/plan de carrera

- **Artboard:** `EstudioCursos.dc.html`
- **Módulo:** Estudio
- **Origen:** `estudio-screen.jsx` líneas 504-526
- **Propósito:** Rejilla de cursos en curso y terminados, más las dos columnas transversales: backlog (plan de carrera) y temas de interés.

## Secciones, de arriba abajo

- SectionHead «En curso» con meta «N cursos activos» + botón «Agregar curso» (509-511)
- kbv-courses-grid: CourseCard de activos y luego de terminados (512-515)
- kbv-study-cols: EstudioBacklog + EstudioIntereses (518-523)

## Estados que debe mostrar

- Cursos activos vs done (tarjeta con clase 'done' y badge de check)
- Backlog vacío → EmptyState «Backlog vacío» (estudio-cursos.jsx:323)
- Renderizado condicional si EstudioBacklog/EstudioIntereses no existen (519-522)

## Comportamientos que hay que representar

- Clic en tarjeta → abre CourseDetail
- «Agregar curso» → CreateCourseModalV2
- Desde la tarjeta: «Ver tareas del curso» y «Nueva tarea» sin abrir el curso (stopPropagation)
- Promover un item del backlog a curso; agregar item al backlog; agregar/quitar temas de interés

## Lee de

- courses, backlog
- COURSE_TO_PROJECT para mapear curso→proyecto filtrable en Tareas (464)

## Escribe

- CustomEvent kibo:navigate {screen:'tareas', area:'wisdom', project} (491)
- CustomEvent kibo:navigate {screen:'tareas', create:true, area:'wisdom', project} (494)

## Conceptos del núcleo que toca

- project
- task
- progression engine (XP por curso)
- shell

## Modales que se dibujan sobre esta pantalla

### Agregar curso o estudio
- Se abre desde: EstudioScreenV2 → botón «Agregar curso» de la pestaña Cursos (estudio-screen.jsx:510, montaje 762-764)
- Propósito: Alta de curso tipo-dependiente (online / proyecto personal / taller presencial / otro) con rúbricas 1–5 que estiman la recompensa al completarlo. Subtítulo aclara que la escuela formal se gestiona en su propia pestaña.
- Campos: Tipo de estudio: 4 tiles COURSE_KINDS_V2 — online / project / taller / otro (80-90) · Nombre (autoFocus, placeholder según tipo) · Plataforma | Escuela/instructor | Fuente (etiqueta y placeholder según tipo) · Área de conocimiento · URL del curso (solo online) o Instructor/mentor (resto) · Taller presencial: ¿Dónde es?, ¿Cada cuándo?, Duración por sesión, Prerrequisitos/qué llevar (122-132) · Inicio (date) y Meta de término / Fin del taller (date) · «¿Continúa otro curso?» — select de serie, solo si hay cursos activos (140-148) · Temas / etiquetas — tag input con Enter y chips removibles (151-157) · Rúbricas 1–5: Energía que pide, Esfuerzo cognitivo, Conocimiento previo (161-165)
- Acciones: Cancelar (cierra) · Agregar — deshabilitado si el nombre está vacío; construye el objeto y llama onSave + onClose (59-66, 77) · Quitar un tema (chip x)
- Estados: kind='online' por defecto → muestra URL · kind='taller' → despliega el bloque de taller y cambia etiquetas · Botón Agregar deshabilitado sin nombre · Bloque de serie oculto si allCourses está vacío · Caja de recompensa recalculada en vivo: XP = redondeo a 10 de ((energía+esfuerzo)*38 + (6-previo)*34)/10*10, monedas = XP/4, fragmentos = max(1,(esfuerzo+(6-previo))/3) (18-22, 166-174)
- Origen: `estudio-cursos.jsx` 31-178

### Agregar al backlog
- Se abre desde: EstudioBacklog → «+ Agregar» (estudio-cursos.jsx:297) vía onAdd=addBacklog
- Propósito: Capturar de un renglón lo que quieres aprender después; luego se convierte en curso cuando arranque.
- Campos: Curso o tema (texto) — placeholder «p. ej. Rust desde cero, teoría musical, SQL avanzado…»
- Acciones: Confirmar → agrega al backlog con platform 'Plan propio', priority 'media', kind 'project' · Cancelar/cerrar
- Estados: Abierto/cerrado según el estado del hook usePrompt
- Origen: `estudio-screen.jsx` 705-708 (componente en kbv-shared.jsx:459-464)
