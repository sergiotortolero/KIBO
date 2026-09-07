# Detalle de materia (6 pestañas)

- **Artboard:** `SubjectDetail.dc.html`
- **Módulo:** Estudio › Escuela
- **Origen:** `estudio-escuela.jsx` líneas 70-268
- **Propósito:** Vista completa de una materia, en el orden en que se pregunta: cómo voy, cómo me califican, qué debo, cuándo es, qué apunté y quién la da. Sustituye el contenido de la pestaña Escuela.

## Secciones, de arriba abajo

- sd-head: botón volver, semestre y créditos, nombre, profesor·modalidad·días/hora·salón, y bloque de calificación proyectada con «N% calificado» (90-105)
- kbv-seg con 6 pestañas: Resumen, Calificaciones, Pendientes (contador), Calendario, Apuntes (contador), Profesor (107-113)
- Resumen: 4 KPIs (Temario %, Pendientes, Por calificar %, Interés /5 con esfuerzo) + tarjeta «Cómo vas» con barra y el cálculo de «para cerrar en 70 necesitas al menos X» (115-135)
- Calificaciones: por rubro — peso, calificación, barra y desglose de items (137-165)
- Pendientes: tareas de la materia filtradas del tablero, con tipo, prioridad, estimación, descripción y vencimiento (167-192)
- Calendario: semana Lun–Sáb con la clase ubicada, más fechas de exámenes y tareas no hechas (194-220)
- Apuntes: artículos con título, fecha y cuerpo; nota de que se guardan en la Bóveda (222-241)
- Profesor: avatar de iniciales, estrellas, correo, horario de asesoría y descripción de su estilo (243-265)

## Estados que debe mostrar

- Pestaña por defecto 'resumen'
- Pendientes vacío → EmptyState «Nada pendiente» (172)
- Sin apuntes → EmptyState «Sin apuntes» (228)
- Sin profesor → EmptyState «Sin profesor asignado» (248)
- Calificación proyectada '—' cuando no hay nada calificado
- Vencimiento 'hoy'/'mañana'/'en N días' y clase 'soon' si dleft<=1 (183)

## Comportamientos que hay que representar

- Cambiar de pestaña
- Volver al listado (onBack, 91-93)
- «Registrar tarea de esta materia» desde Pendientes (189) → emite navegación
- «+ Nuevo apunte» sin handler (226)
- Cálculo paraPasar = mínimo necesario en el % restante para cerrar en 70 (78-79)

## Lee de

- subject (materia), ACADEMIC_TASKS filtradas por subjectId, SCHOOL_PROFESSORS_V2, SCHOOL_SEMESTER_V2, ATASK_TYPE/ATASK_PRIORITY (56-57), schemeGrade()

## Escribe

- CustomEvent kibo:navigate {screen:'tareas', create:true, area:'wisdom', subject} vía onAddTask

## Conceptos del núcleo que toca

- fact record
- task
- identity
- progression engine
