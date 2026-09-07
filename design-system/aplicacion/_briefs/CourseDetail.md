# Detalle de curso (homologado con Proyectos)

- **Artboard:** `CourseDetail.dc.html`
- **Módulo:** Estudio › Cursos
- **Origen:** `estudio-cursos.jsx` líneas 194-283
- **Propósito:** Vista a pantalla completa de un curso: KPIs, ficha de detalle y las actividades ligadas, que viven también en Tareas.

## Secciones, de arriba abajo

- kbv-page-head: botón «Volver a Cursos», eyebrow «tipo · plataforma», pip «Terminado», título y área (203-214)
- Acción de cabecera «Actividad → Tareas» (213)
- kbv-kpi-grid de 4: Avance % con n/m actividades, Tiempo hechas/totales h, Al completar (+XP, monedas, fragmentos), XP ganado en Sabiduría (217-234)
- Tarjeta «Detalle»: tipo, plataforma/fuente, área, última sesión, campos de taller (dónde, frecuencia, qué llevar), esfuerzo como rúbrica de solo lectura, temas como tags, botón «Abrir curso» si hay URL, barra de progreso (238-256)
- Tarjeta «Actividades»: lista de tareas ligadas con rúbrica de energía, estimación y pip de estado, más «Nueva actividad» (259-279)

## Estados que debe mostrar

- Curso terminado → pip «Terminado» (208)
- Sin actividades → EmptyState «Sin actividades» (265)
- Sin URL → no se muestra el botón de abrir
- Recompensa: usa course.reward o la recalcula con studyReward (197)

## Comportamientos que hay que representar

- Volver al listado (onBack)
- «Actividad → Tareas» y «Nueva actividad» emiten navegación a Tareas en modo creación ligada al curso (199, 213, 278)
- Abrir la URL del curso en pestaña nueva (251)

## Lee de

- course (curso vivo, resuelto por id en estudio-screen.jsx:715)
- COURSE_DEMO_TASKS por id de curso (181-191)
- COURSE_TASK_STATUS (192), studyReward()

## Escribe

- CustomEvent kibo:navigate {screen:'tareas', create:true, area:'wisdom', course:id} (199)

## Conceptos del núcleo que toca

- project
- task
- progression engine
- economy/ledger (monedas y fragmentos al completar)
