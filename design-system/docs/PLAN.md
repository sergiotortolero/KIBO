# Plan del Design System de Kibo

Documento único de control. Recorre el **índice tal como se ve en la pestaña Design System**, con tu
retroalimentación textual registrada donde la diste, y el trabajo pendiente en orden.

**Estado:** ✅ cerrado · 🔄 en curso · ⬜ pendiente

---

## Retro · 23 ago

| Punto | Qué se hizo |
|---|---|
| Las 5 decisiones abiertas | **Cerradas.** Piso táctil → subir a 44px, nombre a 15px y premio recortado · casilla parcial → solo con meta numérica · protector → átomo propio · conjunto → **Divisas** · cronograma → los cuatro niveles |
| «El prestigio de área y el del héroe son distintos» | Confirmado y documentado aparte: área = **5 estrellas** + Maestro; héroe = **16 grados** con familias temáticas |
| «Las monedas especiales necesitan su propio nombre» | Abierto: ninguna de las 5 opciones sirvió. La colisión está confirmada — el código llama `dark` a la categoría y su piel de fábrica se llama «Materia oscura», así que categoría y piel comparten nombre |
| «Necesito un inventario de todo el proyecto para llevarlo a Claude Code» | **`docs/INVENTARIO.md`** — generado del proyecto: 68 tarjetas con su fuente citada, orden de lectura, las reglas, el método de búsqueda en `reference/`, cómo se hace una tarjeta y qué falta |
| 13 · Áreas de vida | Arrancado: `areas-atomos` con selector de ícono (16), paleta (10 entradas, 9 únicas), dificultad en sus dos formas, prestigio de área y nivel |

**Hallazgo en la paleta de áreas.** `COLORS` (`areas-screen.jsx:140`) trae **10 entradas pero
`var(--area-community)` aparece dos veces** (índices 5 y 9): son 9 colores únicos presentados como 10.
La tarjeta rinde las 10 y marca la repetida, porque corregirlo es decisión de producto.

## Retro · 17 ago

| Punto | Qué se hizo |
|---|---|
| «Proyectos es una sección aparte de tareas, sepáralo» | Índice **11 · Proyectos** propio, separado de **12 · Tareas** |
| «Empezar por proyectos, de ahí tareas, después áreas, y hábitos» | Renumerado en ese orden: 11 Proyectos · 12 Tareas · **13 Áreas de vida** (pendiente) · 14 Hábitos · 15 Retos · 16 Glosario · 17 UI Kit |
| «Esa parte es la espina dorsal de la gamificación» | Los cuatro quedan contiguos, antes de Retos |
| «A hábitos le faltan botones de acción rápida para registrar» | `habitos-registro`: cuatro formas de marcar según el tipo, y el botón entra al pie de la tarjeta |
| «Termina de detallar los átomos, organismos y más niveles de proyectos» | `proyectos-moleculas`: ficha, hitos, roll-up del área, proyectos del área y zona de peligro — cada medida con su línea del código |

Y una corrección de T-2 que se me había pasado: **14 estaba duplicado** entre Hábitos y UI Kit.
UI Kit pasa a **17**, porque es consumo del sistema, no un dominio.

## Hallazgo · `kbv-components.css` seguía pintando el verde retirado

Quitar el `:root` verde **no bastó**: quedaban **12 literales** del verde `#4CAF82` dentro de las
reglas, en la hoja que **todas** las tarjetas cargan.

| Regla | Literal | Efecto visible |
|---|---|---|
| `.kbv-btn-primary` | `box-shadow: 0 2px 0 #2B7E5B` | el botón primario salía con **cara teal y labio verde** |
| `.kbv-fab` y su `:hover` | `#2B7E5B` + `rgba(76,175,130,.40/.45)` | el FAB brillaba **verde** al pasar el cursor |
| `.kbv-input:focus`, `.kbv-prompt textarea:focus`, `.kbv-page-input input:focus` | `rgba(76,175,130,.15/.16)` | el halo de foco era verde |
| `.kbv-stepbar .seg.active` y su `::after` | `rgba(76,175,130,.15/.30)` | el destello de la barra de pasos |
| `.kbv-avatar-stage` | `rgba(76,175,130,.12)` | el aura del escenario de avatar |
| `.kbv-hero-*` | `linear-gradient(160deg, #4CAF82, #6FCC9C)` | el degradado del héroe |

Todos migrados a `var(--kb-primary-ink)` y `color-mix` del primario. **El encabezado del archivo
afirmaba que los tokens ya estaban re-apuntados** — era falso, y es exactamente el modo de falla que
venimos corrigiendo: el DS divergiendo del proyecto en silencio. Si vuelve a aparecer un hex de marca
ahí, es una regresión.

## Hallazgo · el piso táctil en los botones de la v1

`--kb-touch-min` es **44px**, pero los botones de la tarjeta de hábito quedan debajo:

| Botón | Código | Medida | Contra 44px |
|---|---|---|---|
| Registro (`.kp-ok`, `styles-extras.css:11095`) | 32×32 | 32px | **−12px** |
| Corregir (`.kp-fix`, `:11056`) | 28×28 circular | 28px | **−16px** |
| Editar y borrar (`.ic-btn`, `:3796`) | 28×28 | 28px | **−16px** |

Las tarjetas los recrean fieles al código, así que la deuda es de la v1, no del sistema. Los
controles de **captura** sí van al alto canónico de 46px (stepper y atajos de valor).

**La técnica ya está demostrada.** «Caí hoy» —que es nuevo, no heredado— mide 27px de dibujo y
amplía su zona de toque a 44px con un `::after` transparente centrado. Los tres botones de arriba
pueden hacer lo mismo **sin cambiar el dibujo**. Falta tu decisión: aplicarlo así, o subirlos a 44px.

## Lecciones de método

Cada una salió de un defecto real. Están aquí para no repetirlas.

| # | Lección |
|---|---|
| M-1 | **Medir contraste rasterizando por canvas.** `getComputedStyle` serializa `color-mix`/`oklab` como floats 0–1, no bytes 0–255 — una función de luminancia que asume bytes devuelve verde falso. Hay que pintar el color computado en un canvas de 1×1 y leer el `ImageData`. Me dio 5.29 donde había 3.43. |
| M-2 | **La familia amarilla no admite mezcla porcentual.** `--kb-coin` y `--area-wealth` son tan claras que `color-mix(… 66–74%, var(--kb-text))` cae en un ocre medio que **nunca** alcanza 4.5:1 contra un tinte de sí misma: aclarar el fondo aclara la diferencia igual. Ahí va la **tinta** del sistema (`--kb-coin-ink`, 5.20:1). El `textOnColor.alwaysDark` del README ya nombraba esas tres. |
| M-3 | **Un átomo pertenece al dominio que lo consume, no al que se le parece.** Un átomo que solo aparece bajo `.kbv-kanban-card` es de tareas, aunque hábitos pudiera usarlo. Y si dos dominios lo usan idéntico, se declara **compartido** una vez y se cita — no se duplica ni se niega. |
| M-14 | **Un glifo de texto que hace de medidor no se mide como texto.** La ★ del prestigio de área es un indicador —igual que las barras de `.kbv-diff-meter`—, pero al ser un carácter el arnés la mide con el piso de 4,5:1 y marca falla. Su piso real es **3:1**, y las apagadas son **pista** (como el fondo de una barra), sin piso. Se marcan `aria-hidden` con el dato en el `title`, y el arnés debe saltar `aria-hidden`. Lo que sí salió de aquí: la familia ámbar da **1,92:1** en color pleno, o sea que no alcanza ni el piso de indicador — ahí va `--kb-coin-ink`, el mismo caso que M-2. |
| M-4 | **Leer el valor, nunca teclearlo.** Al corregir un selector, reemitir la declaración leída del código; un valor de memoria mete deriva silenciosa (`l3` era 74% y escribí 72%). |
| M-8 | **No escribir «el X real» sin haber leído X.** Puse «el KbStepper real, en su variante de fila» y esa variante no existe: el código solo tiene `.kbv-stepper-row` (un contenedor), `.tone-danger` (color) y un tope de ancho. Inventé una variante y la firmé como del código, teniendo el token `--kb-ctl-h` ya decidido en 46px. Si una medida no sale de una línea que pueda citar, va como **propuesta** declarada, no como hallazgo. |
| M-9 | **Un grep vacío no prueba que algo no exista.** Busqué `hito-` y `milestone` y concluí que los hitos no tenían componente, así que inventé uno — cuando `hito` a secas lo encuentra en `:8788` con su comentario literal `/* Línea del tiempo de hitos */`. Antes de dar algo por inexistente hay que buscar la **raíz** del término, en español y sin guion, y en los comentarios. Y peor: cité una línea que decía lo contrario de mi afirmación. |
| M-10 | **Si el plan nombra un archivo, hay que ABRIR ese archivo — el CSS no basta.** Dos veces en el mismo turno: primero construí el Gantt sobre `.kbv-timeline-grid` (el widget del tablero) sin grepear `kg-`; luego leí `.kg-*` del CSS pero **nunca abrí `kb-gantt.jsx`**, y por eso inventé una barra de pestañas de rango que no existe, omití `.kg-hint`, bauticé `.kg-corner` como `.kg-labels-head` y saqué `.kg-today` de `.kg-grid`. **El CSS da los valores; el JSX da la estructura, los nombres de clase y qué controles existen.** Ninguno de los dos solo. |
| M-13 | **El estado vacío no es un lienzo en blanco: es la misma estructura sin filas.** Puse `.kg-empty` como `<p>` suelto en `.kg-canvas`; la fuente (`kb-gantt.jsx:288`) siempre dibuja `.kg-grid` con sus líneas y mete el vacío **dentro**, porque lo condicional son las *filas*, no la rejilla. Y como `<p>` heredaba 24px de margen del navegador sobre el `padding: 30px` propio. Al recrear un vacío hay que leer **qué se conserva**, no solo qué desaparece. |
| M-12 | **Componer la clase del sistema, no re-estilarla.** Escribí `class="kg-btn"` con borde, fondo, radio y peso a mano, e inventé un estado `.on`. Pero `.kg-btn` es solo un **modificador de tamaño** (`:12900`): el JSX compone `kbv-btn kbv-btn-secondary kg-btn`, y el estado encendido es `kbv-btn-primary`. Mi versión derivó en radio (10 contra 12px) y fondo (blanco contra `--kb-surface`), y un consumidor que copiara `kg-btn on` no encuentra nada. Igual con `.kbv-meta`: lo re-estilé a 11px cuando el real es 12px. **Si la clase existe en el sistema, se compone.** |
| M-11 | **Un `read_file` con `offset` puede empezar a media regla.** Leí desde `:12921` y obtuve el cuerpo de `.kg-corner` sin ver su selector —que está en `:12920`— así que copié los estilos correctos con un nombre inventado. Al leer por desplazamiento, arrancar unas líneas antes o confirmar el selector con un grep. |
| M-6 | **El contraste se mide sobre el fondo COMPUESTO.** Un fondo `rgba(…, .14)` sobre un canvas limpiado en negro se mide como si fuera oscuro: da 3.04:1 donde hay 5.35:1. Hay que componer cada capa translúcida sobre la de abajo hasta llegar a blanco. Y no medir como texto lo que no lo es: un badge sin texto, un bloque de esqueleto (texto transparente) y un marcador de estado vacío son falsos positivos. |
| M-7 | **Una receta, no una mezcla por tarjeta.** Cada tarjeta tenía su propio `color-mix(… 72–76%, var(--kb-text))`, así que el mismo error se repetía en ocho lugares. Ahora hay `--kb-ink-on-tint`, que se resuelve con el `--c` de la pieza: una sola definición sirve para áreas, rarezas y materiales. |
| M-5 | **Medir el alto después de editar**, con el iframe en 200px y el `bottom` del último hijo visible — no `scrollHeight` con el iframe forzado, que devuelve el alto forzado. |

## Reglas transversales

**R-13 · Tinta, no color crudo, para texto pequeño.** Un color de marca o de área como texto queda
entre 2.9 y 4.3:1 sobre blanco o sobre su propio tinte. El texto usa `--kb-ink-on-tint` (o la tinta
del token: `--kb-coin-ink`, `--kb-hp-ink`, `--area-*-ink`). Un relleno marcado —día de la semana,
chip lleno— también usa la tinta como fondo, porque blanco sobre color pleno da 2.4–3.8:1.
Único caso de blanco sobre color: a **14px negrita o más**, donde el umbral baja a 3:1.

**R-14 · En superficie tintada el neutro secundario no alcanza.** `--kb-text-2` está calibrado para
blanco (4.83:1); sobre `--kb-surface-2` o un tinte cae a 4.27:1. El sistema solo tiene dos neutros,
así que la elección es binaria: ahí va `--kb-text`. La jerarquía la cargan el tamaño y el peso.
 — decididas, aplican a todo

| # | Regla | Estado |
|---|---|---|
| T-1 | Solo la **decisión canónica**. Nada de «antes vs. ahora», nada de historia | ✅ |
| T-2 | Índice con números **únicos** (01–15) | ✅ |
| T-3 | Documentar lo que **es**, no cómo se llegó | ✅ |
| T-4 | Ninguna tarjeta pasa de **~800px**; el ideal es 300–500. Si cubre dos conceptos, son dos tarjetas | 🔄 falta partir `glosario` (1127) y `trofeos` |
| T-5 | Todo texto chico sobre color va en **tinta** (`color-mix 72% con --kb-text`), nunca color pleno | ✅ |
| T-6 | Piso duro de **10px**, sin excepción — incluidas las etiquetas de espécimen | ✅ |
| T-7 | Las **cejillas en MAYÚSCULAS** con tracking `.09em`. La mono se retiró; la familia es Jakarta | ✅ |
| T-8 | Los **literales de código** (`--kb-*`, `.kbv-*`) nunca en mayúsculas: son código, no etiqueta | ✅ |
| T-9 | El **halo de foco** es al **10 %** | ✅ |
| T-10 | Medir el alto **después** de editar y declararlo en la misma pasada | ✅ regla de proceso |
| T-11 | Los íconos vienen de `reference/app/icons.jsx` **real**, nunca de una librería externa | ✅ |
| T-12 | No brincarse dominios: cerrar cada uno antes de seguir | 🔄 |

---

## Índice, con tu retro

### 01 · Tipografía — 1 tarjeta ✅

> «Las etiquetas no van a ir en minúscula, mantendremos las mayúsculas como antes, solo eliminaremos
> la mono, y recuerda solo dejar solo lo que ya está definido, la historia no me sirve.»

Dos familias (Jakarta, Inter), escala de 9 pasos, tres roles. Cejillas en MAYÚSCULAS. Sin historia.

### 02 · Color — 3 tarjetas ✅

> «El halo de foco es muy alto, cámbialo a un 10 %»

`color-base` · `color-sistema` · `token-familias`. Halo al 10 % en todo el sistema.

### 03 · Medidas y movimiento — 2 tarjetas ✅
`medidas` (espaciado, radios, sombras) · `animaciones` (12 animaciones nombradas).

### 04 · Íconos — 5 tarjetas ✅

> «Necesito que se le pongan nombre, apellido y caso de uso para cada caso.»

Convención `dominio/nombre/variante`. 77 de 77 con dominio, cero huérfanos. 6 declarados sin dibujo
salen marcados en rojo a propósito.

### 05 · Átomos — 4 tarjetas ✅
Los átomos transversales: casilla, pastilla, punto, glifo.

### 06 · Moléculas — 2 tarjetas ✅

### 07 · Modales y formularios — 3 tarjetas 🔄

> «Faltan muchos campos que ya están en la versión que te compartí, esas opciones sí necesitaría que
> se respetaran.»

Hecho: `modal-alta`, `formulario-campos`, `formulario-estados`.
**Pendiente (M-2):** los controles especializados que sí existen en tu código y no están en la
tarjeta — `kbv-priority-row.glyphs` (prioridad con glifos reales), `kbv-rate-scale` (escala 1–5,
normal y compacta), `kbv-stepper` (rejilla `38px 1fr 38px`), `kbv-amount-input` (monto con prefijo y
sufijo), `kbv-daterange`, `kbv-energy-meter` (5 rayos).
**Pendiente (M-3):** modal de confirmación y modal de detalle.

### 08 · Datos — 14 tarjetas ✅

> «Igual necesito mejorar y estandarizar todos los gráficos, KPIs, indicadores y elementos de
> visualización de datos.»

Las 12 gráficas del catálogo más KPI y barras de progreso. Lenguaje *blocky*, dato dentro de la forma
y al lado en gráficas delgadas.

### 09 · KIBO — 11 tarjetas 🔄

> **Rueda de acción:** «No debe existir ninguna canaleta o sangría sobre la que Kibo se sobreponga.
> Elimina la referencia del GTA V, dejémoslo como Rueda de acción. Hay algunas animaciones que están
> aquí, pero no en la sección de animaciones, revisa cuál pudiera ser y agrégala por allá. Y también
> la animación de deformar a Kibo, cuando se regresa ya se ve un poco mejor animado ese efecto como
> de gota.»

| # | Punto | Estado |
|---|---|---|
| R-1 | Se llama **Rueda de acción**; fuera la referencia a GTA V | ✅ |
| R-2 | Sin canaleta ni sangría | ✅ |
| R-3 | Las animaciones de la rueda faltan en el catálogo — identificarlas y agregarlas | ⬜ |
| R-4 | Documentar el efecto de gota al volver de la deformación | ⬜ |

> **Travesuras:** «El juguete dejó de existir, dejaremos la acción de voltear a ver y de cantar…»
> (retro completa registrada abajo)

| # | Punto | Estado |
|---|---|---|
| K-15 | **Separar en grupos**: ojos, boca, cuerpo y manopies por su lado, y luego ensamblar en las acciones | ⬜ **va primero** — es decisión de arquitectura |
| K-1 | El juguete dejó de existir: eliminar todas las acciones con juguete | ⬜ |
| K-2 | Conservar **voltear a ver** y **cantar** | ⬜ |
| K-3 | Cantar: boca **circular** y ojos que cambian — hoy no se animan | ⬜ |
| K-4 | Zumbido: ojos y boca deben vibrar **desfasados del cuerpo** | ⬜ |
| K-5 | Zumbido: la pupila se dilata pero **nunca toca el borde**; más centrada, dejando aro negro visible | ⬜ |
| K-6 | Voltereta: **de golpe**, sin pausa de cabeza | ⬜ |
| K-7 | Aplastarse: los ojos deben **cerrarse un poco**. El regreso ya está bien | ⬜ |
| K-8 | Globo: como un **niño inflando los cachetes**, con presión en los labios | ⬜ |
| K-9 | Los gestos con manos **no alcanzan el espacio**: señalar y chocar los cinco no se ven | ⬜ |
| K-10 | Saludo: la cara **voltea hacia la manopie**; la mano sale y regresa con ternura, **sin verse por detrás** | ⬜ |
| K-11 | Guiño y beso: **recortar** la forma del ojo para emular el párpado, no comprimir el óvalo | ⬜ |
| K-12 | La **boca más grande** en general | ⬜ |
| K-13 | Mueca: la boca **no siempre** debe ser una «w» | ⬜ |
| K-14 | **Rehacer por completo**: bostezo, guiño, mareo | ⬜ |

### 10 · Gamificación — 9 tarjetas 🔄

> **Divisas:** «Necesito que me des 5 opciones para cada uno… nombrar este conjunto de elementos…
> quitarle el título de "Materia oscura" y "Monedas"… temáticas que puedan caber en personas que
> sean "pacha mamas" o "hipies" y consuman cosas como el tarot… pero también tener cosas más "gamer"
> o "rangos militares"… otro rubro puede ser la ciencia o tecnología.»

| # | Punto | Estado |
|---|---|---|
| D-1 | **5 opciones mínimo** por categoría — hoy hay 4 de materia y 3 de moneda | ⬜ |
| D-2 | Quitar los títulos «Materia oscura» y «Monedas» de la tarjeta | ⬜ |
| D-3 | **Nombrar el conjunto** — antes gemas, luego materia oscura; es un insumo de transacción | ⬜ |
| D-4 | Temáticas: **tarot y naturaleza**, **gamer y rangos militares**, **ciencia y tecnología** | ⬜ |
| D-5 | Mejorar los glifos de cada opción | ⬜ |

> **Logros:** «Regenera todo logros y rarezas porque no siguen nada del design system, los veo
> horribles. Se rompió algo.» → ✅ **estaba roto de verdad**: el `<style>` había perdido todas sus
> reglas `.ach-*` y tenía pegado el CSS de trofeos. Reescrito completo.

> **Niveles · héroe y área:** «Está muy simple y la verdad no entiendo bien qué es lo que estoy
> viendo, si son las recompensas que voy a obtener, deben seguir los mismos íconos que se asignen
> como moneda/recompensa.» → ✅ ahora es una **ruta de hitos** con el `CurrencyGlyph` real.

> **Niveles · las escalas:** «Esto necesito que venga de forma gráfica.» → ✅ las cinco escalas con su
> forma visual real, más el ciclo de Maestro como línea de hitos.

> **Trofeos:** «Los estandartes me gustan, pero hay que mejorar su diseño. Se corta mucho.»
> ⬜ pendiente: `.bn` tenía `min-height:511px` (corregido a 51), pero la tarjeta sigue midiendo de más.

### 14 · Hábitos — 2 tarjetas ✅

> «A este punto le faltan las monedas que dan (si aplica) para cada acción, no se ve de forma clara.»

Resuelto en átomos y moléculas: cada premio muestra **XP y monedas**, con el glifo real. La fórmula
queda documentada: `xp = base·2+4`, `monedas = max(1, base·0,8)`, con `base = energía × esfuerzo`.

### 11 · Proyectos — 5 tarjetas ✅

> «Termina de detallar los átomos, organismos y más niveles de proyectos, falta detalle desde mi
> perspectiva» · «Un punto que falta de ese lado es el cronograma, esa funcionalidad puede usarse en
> diferentes niveles»

Separado por nivel, como pediste:

| Tarjeta | Qué contiene | Fuente |
|---|---|---|
| **`proyectos-atomos`** | 3 átomos propios (estado de 3 valores, avance calculado, conteo) + `plazo` compartido con tarea, y el tablero | — |
| **`proyectos-moleculas`** | Ficha y línea del tiempo de hitos | `.kbv-detail-rows` `:6808` · `.kbv-area-timeline` `:8788` |
| **`proyectos-organismos`** | Roll-up de 4 celdas, lista de proyectos del área, zona de peligro | `:8903` · `:8912` · `:13059` |
| **`cronograma`** | Nivel área: herramientas, tareas sangradas, mini-mapa y estado vacío | `kb-gantt.jsx:228-308` + `.kg-*` `:12884-13020` |
| **`cronograma-dia`** | Nivel día y la tabla de los 4 niveles | mismo `.kb-gantt` |

**El cronograma es `.kb-gantt` (`kb-gantt.jsx`), no el widget de tablero.** Son dos componentes
distintos: `.kbv-timeline-grid` (`.tl-*`) es la tarjeta de cronograma del **tablero**, con columnas
de rejilla fijas; `.kb-gantt` (`.kg-*`) es el **Gantt** del módulo. El comentario de la fuente
(`:12882`) explica por qué son distintos: el Gantt posiciona en un **lienzo absoluto**, no en pistas
de rejilla, «con cubetas fijas no hay aritmética que hacer» — y sin aritmética no hay **zoom continuo**
ni **arrastre**.

| Nivel | Una fila es | El eje mide | Llega desde |
|---|---|---|---|
| Área | un proyecto, con sus tareas sangradas | meses | la pantalla del área |
| Proyecto | un hito o entregable | semanas | el detalle del proyecto |
| Tarea | una subtarea | días | el detalle de la tarea ⬜ falta |
| Día | un bloque de agenda | horas | Hoy y la agenda |

**No hay pestañas de rango.** El control real es **zoom continuo** —rueda o botones `±` de 34px— más
un letrero `.kg-range` con el rango visible y su unidad, y dos atajos: **Todo** (encuadra todo) y
**Hoy**. **Editar fechas** es un **interruptor**: apagado, arrastrar mueve el lienzo; encendido,
arrastrar mueve barras y aparecen las manijas. La línea `.kg-hint` **cambia con ese interruptor** y
enseña el gesto dentro del producto, sin manual.

Lo que **no** cambia entre niveles: etiquetas de **232px** (150px bajo 760px de contenedor), fila de
**38px**, barra de **24px** en pastilla con el avance al 62 % (`.kg-fill`) y contorno interno de 1px
que engorda a 2px al pasar el cursor, y mini-mapa de **34px**. La barra es **arrastrable**
(`cursor: grab` en modo edición) con dos **manijas de 9px** `ew-resize` en los extremos: reagendar se
hace ahí, no en un formulario. La **sangría** es la jerarquía (`.kg-label.d1`: 26px y tinte al 3 %),
así una tarea se lee como hija de su proyecto sin líneas de conexión.

**El nivel tarea no se puede documentar todavía:** `tarea-detalle.jsx` no le da fecha a las
subtareas, así que no hay nada que colocar en el eje.

**Proyectos es sección aparte de tareas**: tiene avance, plazo e hitos, y no lleva prioridad ni
casilla.

**Cuatro migraciones aplicadas.** `.kbv-area-projcard` tenía `border-left: 3px` (R-1) · `.status-pip`
usaba `--kb-text-2` sobre `--kb-surface-2` = 4.27:1 (R-14) · la pastilla «siguiente» del hito y la de
«hoy» del Gantt llevan texto blanco sobre color pleno en la fuente, que a 10px da 3.06–3.68:1 — van
sobre la tinta (R-13).

### 13 · Áreas de vida — 1 tarjeta 🔄 ← **AQUÍ VAMOS**

`areas-atomos`: selector de ícono (16 de `ICON_PALETTE`), paleta de color (10 entradas, 9 únicas),
dificultad en sus dos formas —reja de cuatro al configurar y medidor de 4 barras en tarjeta, siempre
con el multiplicador—, prestigio de área con Maestro, nivel y XP, y el campo no editable.

**Pendiente:** molécula (tarjeta de área, panel de reglas) y organismo (proyectos del área, hábitos y
retos, ranura de área nueva, zona de peligro).

### 12 · Tareas — 2 tarjetas 🔄

> «Reacomoda todo conforme a tareas, faltan todavía los proyectos, tú ya te quieres brincar.»

| # | Punto | Estado |
|---|---|---|
| K-1 | Átomos y moléculas de **tarea** en forma canónica | ✅ |
| K-2 | **Faltan los proyectos** — el dominio no está cerrado | ✅ `proyectos-atomos`: 3 átomos propios + `plazo` compartido con tarea, y tablero por área con estado vacío. 38/38 etiquetas pasan AA |
| K-3 | Falta el **detalle de tarea** (`tarea-detalle.jsx`) | ⬜ **siguiente** |
| K-4 | Falta el **cronograma / Gantt** (`kb-gantt.jsx`) | ✅ sobre `.kb-gantt` / `.kg-*` real: 3 de 4 niveles. El nivel tarea espera a K-3 |

### 15 · Retos — 1 tarjeta ✅

> «En general la tarjeta de retos está espantosa, necesito una versión 2 por completo, no sigue nada
> del DS.»

Reescrita: banda de encabezado en vez de franja superior, medidor de 5 barras en vez de estrellas,
texto en tinta, premio de dos cifras, cuatro estados.
**Pendiente:** el desglose atómico del dominio (boss, HP, reencauce).

### 17 · UI Kit — 2 tarjetas ✅
`app/index.html` y `web/index.html`.

### 16 · Glosario — 2 tarjetas 🔄
Pendiente partir `glosario` (1127px, viola T-4).

---

## Dónde estamos

**70 tarjetas en 17 índices.** Cerrados 10 de 17.

| Índice | Tarjetas | Estado |
|---|---|---|
| 01 Tipografía · 02 Color · 03 Medidas · 04 Íconos | 11 | ✅ los fundamentos |
| 05 Átomos · 06 Moléculas | 7 | ✅ lo transversal |
| 07 Modales y formularios | 3 | 🔄 faltan 6 controles especializados |
| 08 Datos | 14 | ✅ |
| 09 KIBO | 11 | 🔄 18 puntos abiertos |
| 10 Gamificación | 9 | 🔄 5 de divisas + trofeos |
| **11 Proyectos** | **5** | ✅ separado por nivel + cronograma |
| 12 Tareas | 2 | 🔄 faltan detalle de tarea y Gantt |
| 13 Áreas de vida | 0 | ⬜ sin empezar |
| 14 Hábitos | 3 | ✅ |
| 15 Retos | 1 | 🔄 falta el desglose atómico |
| 16 Glosario | 2 | 🔄 deuda de T-4 |
| 17 UI Kit | 2 | ✅ |

## Siguientes pasos

La espina dorsal que definiste es **Proyectos → Tareas → Áreas → Hábitos**. Van 2 de 4: Proyectos y
Hábitos cerrados, Tareas a medias y Áreas sin empezar.

1. **13 · Áreas de vida** — el único índice en cero, y el que amarra la gamificación. Ya tengo leído
   que solo Comunidad es totalmente editable (`areas-screen.jsx:73`) y que las demás tienen
   `editable: 'icon-name-color'` — o sea el desglose sale de ahí. **Mi recomendación.**
2. **Detalle de tarea** (K-3) — `tarea-detalle.jsx` con checklist, subtareas e histórico. Cierra 12,
   y desbloquea el **nivel tarea** del cronograma, que hoy no se puede documentar porque las
   subtareas no tienen fecha.
4. **Controles de formulario faltantes** (M-2) — los necesitan 2 y 3.
5. **KIBO: grupos de animación** (K-15) — arquitectura antes de las 14 correcciones, si no las haría
   dos veces.
6. **KIBO: las 14 correcciones** (K-1 a K-14) y las 2 de la rueda (R-3, R-4).
7. **Divisas** (D-1 a D-5).
8. **Dominios sin desglose:** economía y tienda, perfil y social, lectura y acervo, salud, finanzas,
   diario y foco.
9. **Deuda de T-4:** partir `glosario` (1127px) y `trofeos`.

## Decisiones · cerradas el 23 ago

| # | Decisión | Falta aplicar en |
|---|---|---|
| 1 | **Piso táctil:** subir los botones de ícono a 44px; el nombre sube a 15px y el premio se recorta | `habitos-atomos`, `habitos-moleculas`, `habitos-registro` |
| 2 | **Casilla parcial ½:** solo en hábitos con meta numérica; los de sí-o-no tienen 3 estados | `habitos-atomos` |
| 3 | **Protector de racha:** átomo propio | `rachas` |
| 4 | **El conjunto se llama Divisas** | ✅ ya aplicado |
| 5 | **Cronograma:** los cuatro niveles | falta el de tarea, bloqueado por `tarea-detalle.jsx` |
| 6 | **Prestigio:** área (5 estrellas) y héroe (16 grados) son sistemas distintos | ✅ documentado en `areas-atomos` |
| 7 | **Campo no editable:** borde discontinuo — *propuesta*, el código usa `opacity .45 + grayscale(.4)` (`:9083`) | `areas-atomos` |

### Única abierta

**Cómo se llama la moneda especial, como categoría.** «Divisas» sirve para el conjunto, pero la
premium sigue sin nombre propio: el código la llama `dark` y su piel de fábrica se llama «Materia
oscura», así que hoy la categoría y una de sus siete pieles comparten nombre, y las otras (Magia,
Esencia, Núcleo) quedan huérfanas de categoría.

---

## Cómo mandarme retro

1. **El nombre de la tarjeta + qué está mal.** «En *Tareas · átomos*, la casilla debería medir 18.»
2. **Una captura** con lo que no cuadra.
3. **El archivo actualizado** de tu proyecto, si cambiaste el código fuente.

Un link de `claude.ai/design` **no** me sirve: pide sesión y no lo puedo abrir.
