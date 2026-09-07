# Detalle de libro

- **Artboard:** `BookDetail.dc.html`
- **Módulo:** Lectura
- **Origen:** `screens-v2.jsx` líneas 2729-3037
- **Propósito:** Pantalla dedicada de un libro (push-replace dentro de Lectura), con las NOTAS como sección principal: aprendizajes, citas, ideas y opiniones; más sesiones, ritmo y proyección de término.

## Secciones, de arriba abajo

- Page head: botón «Volver a Lectura», eyebrow 'Lectura · Libro' + chip de formato, título, línea de autor·páginas·fechas según estado; acciones: enlace rápido 'Abrir/Escuchar en <ubicación>' (si la ubicación tiene link), «Iniciar sesión de lectura» (leyendo/en pausa) o «Empezar a leer» (wishlist), y «Editar libro»
- Hero compacto: portada + bloques PROGRESO (página/total y %, barra), RATING (si terminado), SESIONES (N · Xh), RITMO (pp/h)
- Tarjeta grande de Notas: cabecera con contador 'N de M · busca, filtra y registra desde aquí' + botón «Nueva nota o transcripción»
- Tira de KPIs de notas: Aprendizajes, Citas, Ideas, Opiniones
- Bloque 'Densidad de conocimiento · por capítulo' (barras top 6 de notas por capítulo)
- Barra de herramientas de notas: filtros con conteo (Todas/Aprendizajes/Citas/Ideas/Opiniones) + buscador de texto o capítulo
- Lista de notas (tarjeta clicable con tag, foto si es cita, cuerpo y 'when')
- Columna derecha — tarjeta 'Sesiones': log compacto (fecha, min, pp, +XP) y totales (Total leído pp·h, XP otorgado)
- Columna derecha — tarjeta 'Ritmo y meta': pp restantes, % leído, mejor sesión, ritmo medio, días con lectura, sesiones para terminar (o ✓)
- Modales: ReadingSessionModal, NoteComposerModal, NoteDetailModal, BookEditModal

## Estados que debe mostrar

- Estado del libro: reading / paused / done / wishlist (cambia la línea de fechas y el botón de acción)
- Sin notas: EmptyState 'Sin notas' («Cuando vuelvas a leer, anota lo que te marque — frase, idea, contradicción.»)
- Con notas pero sin resultados tras filtro/búsqueda: EmptyState compacto 'Sin resultados'
- Sin sesiones: EmptyState 'Sin sesiones' («Inicia una para empezar a sumar tiempo y XP.»)
- Densidad de conocimiento oculta si no hay notas
- Enlace rápido visible solo si la ubicación del libro tiene link
- Sesión abierta / compositor de notas abierto / detalle de nota abierto / editor abierto

## Comportamientos que hay que representar

- Volver a Lectura
- Iniciar sesión de lectura (abre el cronómetro); al cerrarla se registra la sesión y, si el usuario eligió registrar nota, se encadena el compositor
- Registrar nota nueva o transcripción (varias en una tanda)
- Abrir el detalle de una nota
- Filtrar notas por tipo y buscar por texto o capítulo
- Editar el libro completo
- Abrir/escuchar el libro en su ubicación digital (enlace externo, target _blank)

## Lee de

- book (sesiones, notas, páginas, página, estado, rating, formato, portada, ubicación)
- locations (para resolver el enlace rápido)
- BOOK_FORMATS, NOTE_KIND_LABELS, NOTE_KIND_META

## Escribe

- onStartSession(book, {mins, pageFrom, pageTo, xp, addNotes}) → nueva sesión + página actual
- onUpdateBook(book) → edición del libro y notas nuevas prepend

## Conceptos del núcleo que toca

- fact record (sesiones y notas)
- progression engine (XP por sesión y por página)
- habit (constancia de lectura)
- identity

## Modales que se dibujan sobre esta pantalla

### Registrar / Editar libro
- Se abre desde: BookDetail — botón «Editar libro», modals-v2.jsx — se consume como window.BookEditModal (EditForm, línea 500)
- Propósito: Ficha completa de un libro — mismos campos al dar de alta que al editar: portada, datos de catálogo, estado, formato, dónde lo tienes, páginas, fechas, rating, etiquetas, ganas y por qué leerlo.
- Campos: Portada (subir/cambiar foto, quitar; si no hay, gradiente con las 2 primeras palabras del título) · Título (con botón 'Buscar' en catálogo público Open Library) · Año · Autor(es) · Editorial · ISBN · Género · ¿Cuántas ganas tienes de leerlo? (1–5 llamas, anticipation) · Estado (5 tiles: Wishlist, Leyendo, En pausa, Abandonado, Terminado) · Motivo de abandono (textarea, solo si estado = abandonado) · Formato — dónde lo lees (4 tiles BOOK_FORMATS: Físico, Digital, Lector electrónico, Audiolibro) · Total páginas (KbStepper) · Página actual (KbStepper, máximo = total) · Veces releído (KbStepper) · Iniciado (date) · Terminado (date, deshabilitado salvo estado = done) · Rating (5 estrellas + 'Limpiar', solo si estado = done) · Etiquetas (chips con × + input 'Agregar etiqueta…') · Ubicación (select filtrado por formato vía FORMAT_LOCATION + opción '+ Otro / nuevo …' que abre input libre; hint remite a El Acervo) · Resumen / sinopsis personal (textarea) · ¿Por qué este libro? (textarea)
- Acciones: Subir foto / Cambiar foto / Quitar · Buscar (o 'Buscar de nuevo' si los datos vienen del catálogo) · Agregar etiqueta / quitar etiqueta · Cancelar · Registrar libro (alta) / Guardar cambios (edición) — deshabilitado sin título
- Estados: isNew (Registrar libro) vs edición ('Editar: <título>') · apiLocked: datos del catálogo (título, autor, editorial, ISBN, género, año) deshabilitados con banner explicativo; se desbloquean con 'Buscar de nuevo' · Estado abandonado → aparece el textarea de motivo · Estado terminado → se habilita 'Terminado' y aparece Rating · Ubicación conocida (select) vs personalizada (input libre) · Tamaño lg
- Origen: `screens-v2.jsx` 2108-2385

### Sesión de lectura
- Se abre desde: BookDetail — botón «Iniciar sesión de lectura»
- Propósito: Cronómetro de lectura en dos fases: durante la sesión solo se cuenta el tiempo (con reproductor de música de fondo), y al terminar se pregunta hasta qué página se llegó y se resume tiempo, páginas, ritmo y XP.
- Campos: Fase resumen: '¿Hasta qué página llegaste?' (KbStepper, mínimo = página de inicio, máximo = total, paso 5, sufijo 'pág.')
- Acciones: Pausar / Reanudar · Terminar sesión · Guardar sin notas · Guardar y registrar nota (encadena el compositor de notas)
- Estados: Fase 'active': cronómetro mm:ss, etiqueta 'En sesión' / 'Sesión pausada', aviso de página de inicio, bloque 'XP estimado al cerrar (+X XP + páginas · en Sabiduría)' y <ReadingMusicPlayer> · Fase 'summary': stepper de página final y 4 KPIs (Tiempo min, Páginas, Ritmo pp/h, XP ganado) + nota sobre registrar aprendizajes, citas, ideas u opiniones · Pausado (el cronómetro deja de avanzar)
- Origen: `screens-v2.jsx` 2441-2541

### Nueva nota (compositor)
- Se abre desde: BookDetail — botón «Nueva nota o transcripción», BookDetail — automáticamente tras una sesión de lectura si se eligió «Guardar y registrar nota»
- Propósito: Registrar aprendizajes, opiniones, citas e ideas de un libro, con dictado de voz emulado y, para las citas, foto de la página; permite encadenar varias notas en una sola tanda.
- Campos: Tipo de nota (4 opciones NOTE_KIND_META: Aprendizaje, Opinión, Cita, Idea) · Cuerpo (textarea; la etiqueta cambia a 'Cita textual' cuando el tipo es cita) · Foto de la cita (solo tipo cita; cámara o archivo, con vista previa y botón de quitar) · Capítulo / sección (texto, p. ej. 'Cap. 3, Intro') · Página (texto, p. ej. '87') · Referencia (texto, p. ej. '§12, ed. Gredos, Bekker 1094a')
- Acciones: Dictar / Dictando… (dictado emulado que va escribiendo palabras; se puede detener) · Tomar o subir foto de la página / quitar foto · Cancelar · Guardar nota (deshabilitado sin cuerpo y sin foto) · Paso guardado: «Sí, añadir otra» · Paso guardado: «No, listo» (guarda toda la tanda y cierra)
- Estados: Paso 'form' (compositor) vs paso 'saved' (confirmación con icono de check, pregunta '¿Quieres añadir otra nota, cita o idea de este libro?', vista previa de la nota y contador 'N notas registradas en esta tanda') · Grabando voz (botón en estado recording, aviso 'Reconocimiento on-device · solo guarda texto') · Tipo cita → aparece el bloque de foto · Foto presente vs zona vacía · startVoice: puede abrirse ya dictando
- Origen: `screens-v2.jsx` 2559-2700

### Detalle de la nota
- Se abre desde: BookDetail — clic en una tarjeta de la lista de notas
- Propósito: Vista completa de solo lectura de una nota: su tipo, la foto si es una cita, el cuerpo con tratamiento de cita y las referencias de dónde se encontró.
- Acciones: Cerrar
- Estados: Con foto (cita) vs sin foto · Cuerpo vacío → '(sin texto)' · Con chips de procedencia (capítulo, pág. N, referencia) vs solo el campo 'when' · Cuerpo con estilo de cita cuando kind = quote
- Origen: `screens-v2.jsx` 2705-2724
