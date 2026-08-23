# Auditoría de adherencia al Design System — Kibo (iteración 1)

Fecha: 1 ago 2026 · Alcance: toda la plataforma (`app/*.jsx`, `styles-v2.css`, `styles-extras.css`).
Fuente de verdad: `_ds/kibo-design-system-…/colors_and_type.css` + guía del DS.

---

## 1 · Lo que ya se aplicó en esta iteración

### Marca y tokens
| Antes | Ahora | Dónde |
|---|---|---|
| Primario verde `#4CAF82` (+ hover `#3F9C72`, soft `#E7F5EE`, ink `#1F6B47`) | **Teal canónico `#1CA4A0`** / `#178F8B` / `#E4F4F3` / `#0F6E6B` | 58 literales en CSS, 32 rgba verdes y 23 archivos JSX |
| `--kb-xp` verde | XP espeja el primario (teal) | tokens |
| `--kb-text-3: #9CA3AF` (sub-AA) | `#6B7280` (AA 4.83:1) | tokens |
| Radios 8/12/16/20 | Escala suave canónica **8/10/14/18/24** + `--kb-r-xs` | tokens |
| Sin tokens de espaciado, escala tipográfica, motion ni z-index | `--kb-sp-1…9`, `--kb-fs-2xs…4xl` (+ fluidos), `--kb-dur-*`, `--kb-ease-*`, `--kb-z-*` | `kibo-ds-align.css` |
| Lienzo con lavados radiales verde + índigo | Lienzo plano (`--kb-canvas`) — el DS prohíbe degradados azul-morado y lavados de caramelo | `.kbv-app` |
| Foco heredado del navegador | Halo de marca `:focus-visible` (3px al 28%) | global |
| Sin `prefers-reduced-motion` | Respetado en todo el sistema | global |

### Mascota — KIBO (RF-19)
- La mascota canónica del DS (**blob de gel translúcido**) sustituye al ajolote de imagen en **todo** el sistema: `KiboMascot`, `KiboMark` (logo de sidebar) y `KibPopup` ahora renderizan el blob, así que las ~14 llamadas existentes (onboarding, coach IA, tips de estudio, áreas, auth) se actualizaron sin tocarlas una por una.
- 8 ánimos canónicos con **color + expresión** (Tranquilo · Feliz · Celebra · Travieso · Enfocado · Sorpresa · Cansado · Triste); los ánimos viejos (`happy`, `thinking`, `worried`…) se mapean automáticamente.
- Respira, parpadea, mira alrededor y hace **travesuras** aleatorias cada 6–12 s (flip, aplastarse, globo, gota, saludo, señalar, chocar, aplaudir).
- **KIBO es ahora la acción rápida**: reemplaza el FAB verde `+`. Al tocarlo abre la **rueda radial estilo GTA-V** (Diario · Leer · Foco · Dinero · Léeme · Travesura) y **Léeme** lo morfa en losa de mensaje que teclea el resumen del día.

### Reutilización aplicada
- **Retos compartidos (Amigos) → misma tarjeta que Retos personales.** Antes era un bloque propio (`.kbv-shared` con barra y chips inventados). Ahora usa `.kbv-reto-card`, `RetoDifficultyMeter`, `RETO_DIFFICULTY`, `RETO_KIND_LABELS`, `retoPeriod`, la barra `kbv-progress` y la fila de stats — y solo añade lo social (quién registró hoy, consecuencia de HP, "con Lucía"). Los datos demo se normalizaron al **mismo modelo de reto** (dificultad, tipo, periodicidad, días, fallos, XP).

---

## 2 · Rubros reutilizables — estado

Decididos en la hoja *Kibo Opciones de componentes* (1c · 1d · 1g · 1i) y **ya aplicados**:

| # | Rubro | Decisión | Componente canónico | Dónde se usa |
|---|---|---|---|---|
| 1 | Reto en el tablero | **1d** mini-tarjeta | `RetoCard` con prop `compact` | Retos, Áreas, widget de reto (todas las medidas) |
| 2 | Tarjeta de hábito | **1c** híbrida | `KbHabitCard` (`app/kbv-shared.jsx`) | Hábitos, Áreas → Voluntad, "Hábitos de hoy", widget de hábitos |
| 3 | Barra de meta | **1i** solo donde hay dinero | `GoalBar` | deseos de amigos, ahorro de Finanzas (cursos e hitos siguen con barra simple) |
| 5 | Tarjeta de item | **1g** base Vitrina | `ItemCard` | Tienda (recompensas, catálogo de widgets), regalos a amigos, Tienda legacy |

Pendientes de decidir (no se tocaron):

1. ~~**Reto = una sola entidad.**~~ **RESUELTO (9 ago 2026).** `RetoWidgetLegacy` eliminado; el widget del tablero monta `RetoCard compact` (decisión 1d); `WRetoDays` y el widget leen `kbActiveReto()`, el store único que vive con la pantalla de Retos. `SharedRetoCard` se queda aparte a propósito: un reto compartido lleva participantes y aporte por persona, y su alta ya está fundida en `CreateRetoModal`.
2. **Hábito = una sola tarjeta.** `HabitCatalogCard` ya se reusa entre Hábitos y Áreas (buen patrón, es el modelo a seguir), pero `HabitsBig`, `HabitsWidget` y `WNextHabit` mantienen su propio marcado y sus propios datos demo (`DEMO_HABITS`, `DEMO_HABITS_CLEAN`). Unificar marcado + un único `HabitsStore`.
3. **Listas de progreso con meta** (lista de deseos de amigos, ahorro en Finanzas, avance de curso en Estudio, hito de proyecto): son la misma barra con tope y porcentaje. Un `GoalBar` cubre las cuatro.
4. **Fichas de persona** (`FriendRow` en Amigos, ranking de Liga, aportantes, ranking de conocimiento en Estudio): mismo avatar + nivel + racha + métrica semanal. Un `PersonRow` con `metric` configurable.
5. **Rejilla de recompensas / items** (Tienda, regalos a amigos, Vitrina, catálogo de widgets): misma tarjeta ícono + nombre + descripción + precio en moneda/gema. Un `ItemCard` con `currency`.
6. **Encabezado de sección** (`kbv-char-section-head` aparece copiado en social, personaje, salud, estudio): extraer `SectionHead` con título, meta y acción a la derecha.
7. **Modales de creación**: `CreateTask/Project/Habit/Entry/Book/Watch/Reward/Reto` repiten estructura de formulario, fila de prioridad y fila de 1–5. Extraer `PriorityRow` y `RateRow` (hoy con hex sueltos `#F4B740`, `#F4811F`, `#A855F7` en línea).
8. **Paleta de colores de usuario** (`REWARD_PALETTE`, colores de amigo, color de ropa del héroe): deben salir de los tokens de áreas/prioridades del DS, no de listas hex propias.

---

## 3 · Deuda de DS que sigue abierta

- **Hex sueltos en JSX**: quedan ~40 (poster/portada de libros y series, tonos de piel/pelo del héroe pixel, colores de marca Google/Microsoft). Los de marca externa y arte pixel son legítimos; los de UI deberían pasar a tokens.
- **Tipografía**: el sistema usa las tres familias correctas, pero hay tamaños ad-hoc (`fontSize: 12.5`) fuera de la escala nombrada-9.
- **Números**: el DS pide Plus Jakarta con `tabular-nums` para stats; varias métricas siguen en la familia de UI.
- **Iconografía**: `KIcon` (set propio) convive con el criterio del DS (Lucide como estándar). Recomiendo mantener KIcon —es más específico del producto— y documentarlo como sustitución oficial.
- **Texto sobre color**: revisar chips y píldoras que ponen texto pequeño sobre relleno saturado (el DS solo lo permite en tamaños grandes y en HP/boss/gema/comunidad).


---

## Ronda 3 · Homologación de escalas, iconografía y Amigos (1 ago 2026)

### El hallazgo
El mismo dato —"lo que cuesta"— se capturaba con **cuatro controles distintos**:

| Dónde | Control | Ícono | Color |
|---|---|---|---|
| Nueva tarea | `kbv-rate-row` | `vigor` | `#F4B740` suelto |
| Nuevo hábito | `kbv-rate-row` | `flame` | `#F4811F` suelto |
| Detalle de tarea | `kbv-cat-grid` de 5 fichas | rayos | `#F4B740` suelto |
| Nuevo reto | `kbv-cat-grid` de 5 fichas con ★ | estrellas | por nivel |

Y de solo lectura había tres medidores: rayos (`EnergyMeter`), barras
ascendentes (`RetoDifficultyMeter`) y pips (`StudyRubric`).

### El sistema, ahora
**Un control por rol, un ícono por concepto.**

- **Capturar 1–5 ⇒ `RateRow`** (`kbv-rate-scale`). Variante `compact` para
  espacios apretados.
- **Leer 1–5 ⇒ `Scale5`** (5 barras ascendentes). `EnergyMeter` y
  `RetoDifficultyMeter` ahora delegan en él: tarjetas de tarea, filtros,
  tarjetas de reto y estandartes de Logros muestran el mismo gráfico.
- **Prioridad ⇒ `PriorityRow`**, que adoptó los glifos reales de
  `PriorityIcon` (antes un punto de color). Mismo control en el alta de tarea,
  el alta de hábito y las pantallas que ya lo usaban.

Mapa semántico (`KB_SCALES` en `kbv-shared.jsx`):

| Concepto | Ícono | Color |
|---|---|---|
| Esfuerzo / energía | `flame` | `--kb-streak` |
| Dificultad de reto | `sword` | color del nivel |
| Esfuerzo cognitivo | `wisdom` | `--area-wisdom` |
| Conocimiento previo | `graduation` | `--area-community` |

El ícono `vigor` deja de usarse para esfuerzo: está reservado al área Vigor.
Las etiquetas también se homologaron — todo dice **"Esfuerzo"** (antes
"Esfuerzo / energía", "Esfuerzo que requiere", "Energía"), con los peldaños
`KB_EFFORT_LABELS` (1 Trivial → 5 Te cuesta) como tooltip.

`RETO_DIFFICULTY` perdió sus cinco hex sueltos: ahora `--kb-primary`,
`--kb-gem`, `--kb-coin`, `--kb-streak`, `--kb-hp`.

### Amigos · recomposición
La pantalla eran dos columnas angostas con huecos y las pestañas apretadas
dentro del encabezado de una tarjeta. Ahora son bandas de ancho completo:

1. **Pulso del círculo** — cinco indicadores (amigos, tu lugar en la liga,
   rachas en riesgo, retos compartidos, XP del círculo).
2. **Empujones pendientes** — tira que solo aparece si alguien va a perder
   su racha, con un botón por persona.
3. **Tu círculo** — las pestañas pasan a un control segmentado en **fila
   propia** bajo el encabezado; las tarjetas van a cuatro por fila y abren
   un perfil.
4. **Liga de la semana** — podio de los tres primeros a ancho completo y el
   resto del ranking en dos columnas.
5. **Retos compartidos** — fila de fichas + ficha de alta.
6. **Metas de amigos** — sin cambios.
7. **Actividad del círculo** *(nuevo)* — feed de lo que hicieron tus amigos,
   con aplausos y empujón directo desde el evento.

Nuevo: **`FriendProfileModal`** — perfil rápido con sus indicadores, la
comparación de XP contra ti, los retos que comparten, su lista de deseos con
aporte directo, y las acciones de animar / regalar / proponer reto.

### Barrido de hex — cerrado (9 ago 2026)
El conteo real al abrirlo era **345**, no ~1,150 (la cifra venía de antes de
los barridos por patrón). Los literales que eran **UI** ya son tokens, más un
`var(--kb-canvas)7FA` roto en el onboarding que ningún barrido había visto.
Se conservan a propósito: marcas externas (BBVA, Nu, Netflix, Spotify,
Coursera, Udemy, Platzi, Google, Microsoft), el arte de portadas, pósters y
carátulas, el arte de KIBO y de la vitrina, y el héroe pixel. Token nuevo:
`--kb-media`, el acento de Entretenimiento, derivado de la paleta.
Muchos son valores que ya existen como token (`#1CA4A0`, `#6E8CF2`,
`#A855F7`, `#E64545`, `#F4B740`) y se pueden sustituir de forma mecánica.


---

## Ronda 4 · Auditoría tipográfica (6 ago 2026)

### El hallazgo: los roles estaban invertidos
El DS canónico (`colors_and_type.css`) y el proyecto no coincidían en las
cuatro clases base de tipografía. Peor: **`.kbv-eyebrow` y `.kbv-meta` estaban
cambiadas de lugar**.

| Clase | DS canónico | Tenía el proyecto |
|---|---|---|
| `.kbv-eyebrow` | JetBrains Mono, 10px, `.14em`, ALL-CAPS | Plus Jakarta, 11px, `.10em` |
| `.kbv-meta` | **Inter**, 12px | **JetBrains Mono**, 11px |
| `.kbv-num` | **Plus Jakarta** + `tabular-nums` | **JetBrains Mono**, peso 600 |
| `.kbv-body` | Inter, 13px (`--kb-fs-md`) | 14px sin familia declarada |

Por eso la mono aparecía "a lo largo y ancho de la plataforma en diferentes
niveles": `.kbv-meta` es la clase de todo el texto descriptivo —subtítulos de
sección, ayudas, pies de tarjeta— y estaba puesta en una monoespaciada.
El README del DS es explícito: la mono es para **etiquetas, eyebrows e
índices** en ALL-CAPS y nada más; *"Numbers and stats are NOT set in mono"*.

### Correcciones aplicadas
1. **Las cuatro clases base**, a los valores canónicos. Un solo cambio en
   `styles-v2.css` propaga a toda la plataforma, porque son las clases que
   usan todas las pantallas.
2. **36 selectores de cifras** que usaban mono a mano
   (`.kbv-bar .num`, `.kbv-hero-id .lvl-chip`, `.kbv-task .time`,
   `.kbv-habit .streak`, `.kbv-reto-card .pct`, `.holding-row .amount`,
   `.kbv-store-item .price`, `.bolsa-row .val`…) → Plus Jakarta con
   `font-variant-numeric: tabular-nums`. Los contadores siguen alineados,
   pero se sienten amables y no «gamer».
3. **Piso de legibilidad**: el DS prohíbe texto bajo 10px y había **129
   tamaños** entre 7px y 9.5px. Todos a 10px.
4. **Overrides retirados**: `.kbv-reto-section-head .kbv-meta` volvía a poner
   mono en texto descriptivo.

### Se conserva la mono (rol legítimo)
Índices de catálogo (`.kbv-ach .ach-num`, tipo `EXP—014`), etiquetas de barra
(`.hp-bar-l`, `.pct-lbl`, `.hp-mini .label`) y todo `.kbv-eyebrow`. La
etiqueta mono en ALL-CAPS es la firma verbal del sistema y ahora sí es su
**único** uso.

### Nota sobre la cascada
`kbv-components.css` (la capa heredada del prototipo) todavía trae los valores
viejos —`.kbv-meta` en mono, `.kbv-num` en mono, `.kbv-eyebrow` en display—.
Carga **antes** de `styles-v2.css`, así que los valores canónicos ganan. Es la
misma desincronización que el README del DS marca como pendiente (SAN-14 /
SAN-29): no se editó porque es un archivo del sistema, no del proyecto.
