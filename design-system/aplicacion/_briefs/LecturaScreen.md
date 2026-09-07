# Lectura (registro de libros)

- **Artboard:** `LecturaScreen.dc.html`
- **Módulo:** Lectura
- **Origen:** `screens-v2.jsx` líneas 3167-3396
- **Propósito:** Registro de todo lo que se lee, con notas y aprendizajes: «el libro es el medio; lo que queda en ti es lo importante». Incluye tendencias de lectura y El Acervo (mapa de dónde vive cada libro).

## Secciones, de arriba abajo

- Page head: eyebrow crumb('lectura','Registro de lectura') + H1 «Lectura.» + InfoDot; acción primaria «Registrar libro»
- KPI grid de 5: Terminados este año, En curso (+N en pausa), Notas capturadas, Rating promedio /5, Horas leídas (sumadas de sesiones)
- Barra de filtros por Estado con conteos: Todos / Leyendo / Terminados / En pausa / Wishlist
- Rejilla de libros (<BookCard>: portada con pip de formato, título, autor·páginas, pip de estado, chip de formato, estrellas si terminado, barra de progreso si leyendo/en pausa, resumen de sesiones y horas)
- Bloque 'Tendencias de lectura': géneros que más lees (barras top 5), tasa de término (anillo % y 'N de M empezados'), expectativa vs realidad (Ganas antes vs Rating después con veredicto)
- Bloque 'El Acervo': cabecera con descripción y contador 'N lugares · N libros ubicados', rejilla de ubicaciones (icono, nombre, meta: enlace listo / lugar / N libros, tipo, botón eliminar) y botón 'Agregar lugar o dispositivo'
- Modales: AcervoModal (alta), AcervoModal (edición), CreateBookModal

## Estados que debe mostrar

- Filtro de estado: all / reading / done / paused / wishlist
- Libro seleccionado → BookDetail REEMPLAZA la pantalla
- Sin géneros registrados: 'Aún sin géneros registrados.'
- Modal de Acervo en alta vs en edición
- Estado muerto dentro de la pantalla: search/showCatalog/catalogFiltered/addFromCatalog existen pero ningún JSX los renderiza — el buscador de catálogo público no es alcanzable desde aquí

## Comportamientos que hay que representar

- Filtrar la rejilla por estado de lectura
- Abrir el detalle de un libro
- Registrar libro (CreateBookModal) — nace con notas y sesiones vacías, fecha de inicio hoy
- Registrar una sesión de lectura desde el detalle: crea la sesión (fecha, from/to, mins, xp) y actualiza la página actual del libro
- Actualizar un libro completo (edición o notas nuevas)
- Acervo: agregar lugar o dispositivo, abrir una ubicación para ver/editar, eliminar una ubicación (botón × en la tarjeta o desde el modal)

## Lee de

- DEMO_BOOKS (título, autor, páginas, página, estado, rating, portada, formato, editorial, ISBN, género, año, anticipación, sesiones, notas)
- READING_LOCATIONS + LOC_TYPE_LABEL/COLOR/ICON
- CATALOG_RESULTS (definido, sin UI que lo muestre en esta pantalla)
- BOOK_FORMATS

## Escribe

- Estado local de libros: alta, actualización, sesión registrada (páginas, mins, XP) y notas añadidas
- Estado local de ubicaciones del Acervo: alta, edición y borrado

## Conceptos del núcleo que toca

- fact record (sesiones y notas de lectura)
- progression engine (XP por sesión, área Sabiduría)
- identity
- shell

## Modales que se dibujan sobre esta pantalla

### Acervo — lugar o dispositivo
- Se abre desde: LecturaScreen — botón «Agregar lugar o dispositivo» (alta), LecturaScreen — clic en una tarjeta de ubicación del Acervo (edición/detalle)
- Propósito: Alta y edición de un sitio donde viven los libros. Paso 1 elige el tipo; paso 2 pide solo lo que aplica a su naturaleza: mini-mapa con pin para lo físico, hipervínculo para lo digital, y solo nombre/descripción para dispositivos.
- Campos: Paso 1 — tipo (5 tarjetas ACERVO_TYPES): Lugar físico, Lector electrónico, Equipo, Nube / archivo, Plataforma de audio · Icono (8 opciones ACERVO_ICONS) · Color (8 opciones ACERVO_COLORS) · Nombre * (obligatorio, placeholder según naturaleza) · Descripción (opcional) · Lugar (ciudad / dirección) — solo naturaleza física · Mini-mapa con pin colocable por clic — solo naturaleza física · Hipervínculo (url) — solo naturaleza digital; el enlace aparece como botón rápido en el detalle del libro
- Acciones: Elegir tipo (paso 1) · Tipo (volver al paso 1, solo en alta) · Clic en el mapa para fijar el pin · Cancelar · Guardar / Guardar cambios (deshabilitado sin nombre) · Eliminar (solo en edición)
- Estados: Paso 1 selector de tipo (solo si no hay tipo, es decir en alta) vs paso 2 formulario · Alta ('Nuevo · <tipo>') vs edición (título = nombre, subtítulo 'Edita el nombre, la descripción o personalízalo.') · Naturaleza physical (mapa) / digital (enlace) / device (aviso 'Los dispositivos no llevan mapa…') · Vista previa del icono con el color elegido
- Origen: `screens-v2.jsx` 3055-3165
