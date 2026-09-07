# Pestaña Escuela — semestre, materias y profesores (v2)

- **Artboard:** `EstudioEscuelaV2.dc.html`
- **Módulo:** Estudio
- **Origen:** `estudio-escuela.jsx` líneas 271-405
- **Propósito:** Escuela formal viva: tarjeta de semestre, cuatro indicadores académicos, rejilla de materias abribles, profesores de la escuela y métodos de evaluación (movidos aquí desde Agenda).

## Secciones, de arriba abajo

- kbv-semester-card: escuela, nombre del semestre, fechas, créditos, nº de materias y barra de % transcurrido (305-313)
- kbv-kpi-grid de 4: Promedio en vivo, Avance general (% de temario), Créditos, Pendientes (314-322)
- Encabezado «Materias (N)» + botón «Agregar materia» (324-327)
- kbv-subjects-grid: tarjeta por materia — nombre, profesor, calificación proyectada /100, pills (modalidad, créditos, días+hora, salón), barra de avance de temario, esquema de evaluación por rubro, botón «Registrar tarea de esta materia» (328-369)
- kbv-study-cols: «Profesores de esta escuela» (+ Registrar) y «Métodos de evaluación» con barra segmentada (371-402)

## Estados que debe mostrar

- Vista listado vs vista detalle: si openSubject, retorna solo SubjectDetail (290-299)
- Materia sin profesor → «Sin profesor»
- Rubro sin calificar → 'pend.'; promedio sin datos → '—'
- Materia recién creada: sin días/hora/salón, progreso 0, esquema por defecto 60/40 (286)

## Comportamientos que hay que representar

- Clic o Enter/Espacio en la tarjeta abre la materia (333-336) — accesible con role=button y tabIndex
- «Agregar materia» abre el prompt de texto y crea la materia con id 'm'+rand, modalidad presencial, 6 créditos, esfuerzo/interés 3 (281-287)
- «Registrar tarea de esta materia» emite navegación a Tareas (288, 365 con stopPropagation)

## Lee de

- SCHOOL_SUBJECTS_V2 (13-38), SCHOOL_SEMESTER_V2 (11), SCHOOL_PROFESSORS_V2 (40-44), ACADEMIC_TASKS para contar pendientes (49-55, 278), schemeGrade() (59-63), MODALITY_PILL_V2 (46)

## Escribe

- CustomEvent kibo:navigate {screen:'tareas', create:true, area:'wisdom', subject:id} (288)

## Conceptos del núcleo que toca

- fact record (calificaciones y esquema de evaluación)
- task
- progression engine
- identity (semestre/escuela)

## Modales que se dibujan sobre esta pantalla

### Agregar materia
- Se abre desde: EstudioEscuelaV2 → botón «Agregar materia» (estudio-escuela.jsx:326)
- Propósito: Alta rápida de una materia del semestre; el profesor, horario y método de evaluación se asignan después.
- Campos: Nombre de la materia (texto) — placeholder «p. ej. Álgebra lineal, Historia del arte, Bases de datos…»
- Acciones: Confirmar → crea la materia con modalidad presencial, 6 créditos, progreso 0, esfuerzo/interés 3 y esquema por defecto Exámenes 60% / Tareas 40% · Cancelar/cerrar
- Estados: Ignora nombres vacíos (285)
- Origen: `estudio-escuela.jsx` 280-287 (componente en kbv-shared.jsx:459-464)
