# Estudio (centro académico, 5 pestañas)

- **Artboard:** `EstudioScreenV2.dc.html`
- **Módulo:** Estudio
- **Origen:** `estudio-screen.jsx` líneas 691-767 (registro window 769)
- **Propósito:** Pantalla raíz del módulo Estudio: cabecera, barra de pestañas (Agenda, Cursos, Escuela, Trayectoria, Foco), montaje del detalle de curso a pantalla completa, tip flotante de KIBO y el alta de curso. Ruta del shell: case 'estudio' en dashboard-v2.jsx:1548-1549.

## Secciones, de arriba abajo

- kbv-page-head: eyebrow crumb('estudio','Aprendizaje') + h1 «Estudio.» + InfoDot explicativo (732-734)
- kbv-store-tabs-v2: 5 pestañas con icono — agenda/calendar, cursos/layers, escuela/graduation, trayectoria/trending-up, foco/clock (719-743)
- Cuerpo de la pestaña activa (745-749)
- KiboTip flotante con recomendación calculada (751-760)
- Modal de alta de curso montado condicionalmente (762-764)
- textDialog de usePrompt montado al inicio (729)

## Estados que debe mostrar

- Pestaña por defecto = 'agenda' (692)
- Toma-de-pantalla: si openCourse y existe CourseDetail, retorna CourseDetail y NO renderiza tabs ni cabecera (714-717)
- courseOpen=true → modal de alta
- Fallback por función ausente en cada tab (V2 vs v1) — en la práctica siempre V2
- Tono del tip: warn si >=4 cursos activos, ok si 0 (bandeja limpia), ok normal en otro caso (752-759)

## Comportamientos que hay que representar

- Cambiar de pestaña (739)
- Abrir un curso desde la rejilla → detalle a pantalla completa (746 onOpenCourse=setOpenCourse; regreso con onBack)
- «Agregar curso» abre CreateCourseModalV2 y addCourse() inserta el curso en estado local con id aleatorio 'c'+rand (709-711)
- «+ Agregar» al backlog abre el prompt de texto y añade item con prioridad media / kind project (705-708)
- promote(id): saca del backlog y lo convierte en curso con progreso 0, 0 h, 0 XP, lastSessionAt 'Nuevo' (699-704)
- El tip se puede descartar y persiste por storageKey='estudio' (759)

## Lee de

- STUDY_COURSES (global de personal-screens.jsx) como semilla de cursos (693)
- STUDY_BACKLOG local (694, 7-13)
- AREA_LEVELS_V2.wisdom (a través de AnimatedWisdomKpi, muerto)
- Conteo de cursos activos para la recomendación

## Escribe

- Solo estado local (courses, backlog). No emite eventos del bus; sus hijos sí (kibo:navigate a 'tareas')

## Conceptos del núcleo que toca

- shell
- progression engine (XP a Sabiduría)
- economy/ledger (monedas y fragmentos estimados por curso)
- task
- project
- KIBO

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
