# Anatomía de componentes

Cómo se descompone cada dominio de Kibo antes de construir una pantalla. El objetivo es que una
pantalla **no invente piezas**: solo acomoda lo que ya está aquí.

**Todo lo de este documento se lee del CSS real** (`reference/styles-extras.css`).

## Cómo está ordenado el design system

La pestaña se lee **de lo más genérico a lo más específico**. Los grupos van numerados para que ese
orden no dependa del alfabeto:

| Grupo | Qué contiene |
|---|---|
| `01 · Tipografía` | Las dos familias, la escala de 9 pasos y el piso de 10 px |
| `02 · Color` | Base y marca · color del sistema · familias especiales. Cada paleta es su propia tarjeta |
| `03 · Medidas y movimiento` | Radios, sombras, espaciado, escalas 1–5, duraciones y easings |
| `04 · Íconos` | Reglas y tamaños, y el set partido por dominio — una tarjeta cada dos dominios |
| `05 · Datos` | Gráficas, KPI e indicadores. Lo que existe y lo que falta |
| `06 · Átomos` | Botones, chips, campos, escalas |
| `07 · Moléculas` | Tarjetas, componentes del bundle |
| `08 · KIBO` | La mascota y su guardarropa |
| `09 · Gamificación` | Divisas, niveles, prestigio, rangos, rachas, logros, vitrina |
| `10 · Hábitos` | Primer dominio desglosado |
| `11 · Retos` | Segundo dominio |
| `12 · UI Kit` | Recreaciones navegables |
| `13 · Glosario` | Consulta, no lectura — va al final |

**Ninguna tarjeta es puro texto.** Una tarjeta existe para **mostrar una pieza**. Si solo lleva
reglas escritas, va en `docs/`, no en la pestaña — ahí se ve diminuta y hay que abrirla para leer lo
que el propio subtítulo podía decir. Por eso se retiró la tarjeta *Inventario y reglas* (1691 px de
prosa) y su contenido vive abajo.
| `07 · KIBO` | La mascota: ánimos, animación, travesuras, rueda y su guardarropa |
| `08 · Gamificación` | Divisas, niveles, prestigio, rangos, rachas, logros, vitrina |
| `09 · Hábitos` | Primer dominio desglosado: átomos → moléculas → organismo |
| `10 · Retos` | Segundo dominio |
| `11 · UI Kit` | Recreaciones navegables del producto |
| `12 · Glosario` | Qué significa cada palabra del sistema. Al final, es consulta, no lectura |

**Regla de tamaño de tarjeta.** Ninguna tarjeta pasa de ~800 px de alto, y **lo ideal es 300–500**.
Arriba de eso se ve diminuta en la pestaña y hay que abrirla para leerla. Mejor **muchas tarjetas
chicas** que pocas densas: si una tarjeta cubre dos conceptos, son dos tarjetas.

**Piso de 10 px, también en las tarjetas del DS.** Las etiquetas de espécimen también obedecen el
piso — nada de 7.5 px para que quepan más cosas. Si no cabe con 10 px, la tarjeta lleva demasiado.

**Trampa de rejilla.** Un `display:grid` de varias columnas estira sus hijos al alto de la fila más
alta, y si el hijo no llena ese alto queda fondo vacío abajo. Dos arreglos, siempre juntos:
`align-items:start` en la rejilla, y **emparejar los hijos por alto** (los dos altos en una fila, los
dos bajos en la otra) — porque el alto de la fila lo sigue fijando el hijo más alto. En
`Hábitos · moléculas` esto quitó 79 px de blanco muerto.

## Los cuatro niveles

| Nivel | Qué es | Regla |
|---|---|---|
| **Átomo** | Una sola decisión visual. No se parte más. | Si dos pantallas usan medidas distintas, son **dos átomos**, no uno. |
| **Molécula** | Dos o más átomos que ya dicen algo. | Es la unidad que se repite en una lista. No lleva encabezado propio. |
| **Organismo** | Moléculas dentro de un contenedor con encabezado. | Aquí entra la banda de acento. No inventa átomos nuevos. |
| **Pantalla** | Organismos en la rejilla de 4 pistas. | Solo acomoda. Cero CSS propio. |

**Dos pruebas antes de agregar un átomo a un dominio:**

1. **¿Existe en el CSS?** Si no hay selector, el átomo no existe — no se dibuja de memoria.
2. **¿Es de este dominio?** Un átomo que solo aparece bajo `.kbv-kanban-card` es de tareas, aunque
   se parezca a algo que hábitos podría usar.

## Qué es personalizable

Lo comprable son **ranuras**, no piezas nuevas. **Nada comprable cambia la medida, la posición ni el
significado** — así una cuenta nueva se ve igual de ordenada que una con todo desbloqueado.

## Estado por dominio

| Dominio | Átomos | Moléculas | Organismos | Estado |
|---|---|---|---|---|
| **Hábitos** | 10 | 4 | 1 | Listo y migrado |
| **Retos y boss** | — | — | — | Pendiente |
| **Tareas y proyectos** | — | — | — | Pendiente · ya localizados `.pri` y `.area-chip` |
| **Datos: KPI, gráficas, indicadores** | — | — | — | Pendiente |
| **Lectura y acervo** | — | — | — | Pendiente |
| **Salud** | — | — | — | Pendiente |
| **Finanzas** | — | — | — | Pendiente |
| **Economía: tienda, cofres** | — | — | — | Pendiente |
| **Perfil y social** | — | — | — | Pendiente |
| **Áreas de vida** | — | — | — | Pendiente |
| **Diario y foco** | — | — | — | Pendiente |

---

## Hábitos

Fuentes: `.kbv-habits-clean` (widget del tablero, ~6488) · `.kbv-habit-mgr-card` (catálogo, ~3707) ·
`.kbv-habit-add-card` (~3806) · `.kbv-habit-detail` (modal, ~3840).

Tarjetas: `preview/habitos-atomos.html` · `preview/habitos-moleculas.html`.

### Átomos (10)

| Átomo | Medida | Notas |
|---|---|---|
| Casilla · marcar ⬦ | `22 · r7 · borde 2px` | El borde se tiñe del área al 40 %; al completar, relleno sólido del área |
| Casilla · día | `22 · r6` | Fondo `--kb-surface-2`, lleva la inicial del día; al cumplir, relleno del área |
| Glifo · tarjeta ⬦ | `36 · r10` | Fondo tinte del área al 14 %, glifo en el color del área |
| Glifo · detalle ⬦ | `60 · r14` | Relleno sólido del área, glifo blanco |
| Tipo de hábito | `r8 · 10.5px` | `positive` verde `#2A6F4A` · `negative` rojo `#A92020` |
| Burbuja de racha | `r999 · 12px` | Tintada de moneda al 18 %, Jakarta tabular. No lleva llama |
| Premio | `11.5px` | Jakarta tabular en el **color del área** |
| Total del día | `r999 · 13px` | Píldora `--kb-primary-soft`, con `/ 60 XP` en gris |
| Frecuencia | `11px` | Glifo de reloj + texto |
| Botón de ícono | `24 · r6` | Hover a primary; variante `danger` a rojo con fondo `--kb-hp-soft` |

⬦ = tiene ranura personalizable (se compra la forma / el glifo, nunca la medida).

**Dos casillas y dos glifos, no uno de cada.** La casilla de marcar (r7, borde teñido) y la del
calendario (r6, con inicial) viven en pantallas distintas y dicen cosas distintas. Igual los glifos.

**Hábitos no maneja prioridad.** No hay selector de prioridad bajo hábitos, ni en su CSS ni en sus
`.jsx`. La prioridad y la pastilla de área son de **tareas**.

### Moléculas (4)

| Molécula | Selector |
|---|---|
| Fila del widget | `.kbv-habits-clean .card` — casilla + nombre + frecuencia + premio; estado `done` tintado al 7 % |
| Semana | `.weekly` — 7 casillas de día + resumen `3 / 7` sobre `--kb-surface` |
| Encabezado | `.kbv-habits-clean .head` — título + total del día + botón de alta punteado (`30 · r9`) |
| Alta | `.kbv-habit-add-card` — `1.5px dashed`, glifo de 40 px en círculo, `min-height 160px` |

### Organismo (1)

`.kbv-habit-mgr-card` — banda de área con la racha, glifo + nombre + tipo + frecuencia, semana, y pie
con premio y acciones.

### Migración aplicada

| Antes | Ahora | Por qué |
|---|---|---|
| `border-left: 4px solid var(--c)` | Banda de encabezado tintada al 11 % | La franja lateral está prohibida en el DS |
| `--kb-f-mono` en mayúscula con tracking, en `.kind-pip` y `.schedule` | Jakarta en minúscula | Decisión vigente de etiquetas |
| Premio en `--area-wisdom` fijo en catálogo, color del área en widget | Solo el color del área | El mismo dato no se pinta distinto en dos pantallas |

### Decisiones abiertas

- Si existe un estado **parcial** de la casilla de marcar y si aplica a todo hábito o solo a los de
  meta numérica.
- Si el **protector de racha** es átomo propio o un estado de la burbuja.

---

## Tareas · átomos ya localizados

Pendiente de armar la tarjeta, pero estos dos ya están leídos y **no pertenecen a hábitos**:

| Átomo | Selector | Medida real |
|---|---|---|
| Prioridad | `.kbv-kanban-card .pri` (~742) | Píldora `r999`, mono `10px/800`, `letter-spacing .08em`, mayúscula. Color `--p`, fondo `color-mix(--p 12%, #FFF)`. **Deuda: mono en mayúscula** |
| Pastilla de área | `.kbv-kanban-card .area-chip` (~754) | `inline-flex`, `gap 4px`, `11px/600`, color `--c` del área, con punto de `6px` circular al frente |

**Ojo, no confundir:** lo que sí tiene forma escalonada de barras es `.kbv-energy-meter` (~3188,
5 rayos), pero mide **energía / esfuerzo**, no prioridad.


---

## Personalización · inventario y reglas

Esto vivía como tarjeta de 1691 px de puro texto. Las piezas **se ven** en las tarjetas de
`07 · KIBO` (pieles, marcas, auras) y `08 · Gamificación` (divisas); las reglas van aquí.

### Qué se cambia

| Rubro | Opciones | Fuente |
|---|---|---|
| Piel de KIBO | 10 (6 con moneda, 4 con materia oscura; 3 animadas) | `kibo-style.jsx` |
| Marca | 9 (5 moneda, 4 materia) | `kibo-style.jsx` |
| Aura | 7 (1 gratis, 6 materia) | `kibo-style.jsx` |
| Accesorio | 6 (5 moneda, 1 materia) | `kibo-style.jsx` |
| Personalidad | 6 — cambian `idleMs` y el repertorio de travesuras | `kibo-style.jsx` |
| Juguete | 5 (3 moneda, 2 materia) | `kibo-style.jsx` |
| Divisas | 7 skins — nombre, glifo y color | `prestigio-nombres.jsx` + `personalizacion.jsx` |
| Familias de prestigio | 7 — renombran los 16 grados | `prestigio-nombres.jsx` |
| Áreas de vida | Nombre, color y glifo. Solo Comunidad es 100 % editable | `areas-screen.jsx` |

### La regla que lo sostiene

**Lo comprable son ranuras, no piezas nuevas.** La medida, la posición y el significado no se tocan.
La casilla siempre mide 22 px y comunica los mismos 4 estados; lo que se compra es su forma. El
glifo de hábito siempre mide 36 px en tarjeta y 60 px en detalle. Las divisas cambian nombre, glifo y
color — **lo que valen, no**.

Así una cuenta nueva se ve igual de ordenada que una con todo desbloqueado, y agregar cosméticos a la
tienda nunca obliga a rediseñar una pantalla.

### Persistencia

Cada rubro guarda en su propia llave de `localStorage` y avisa por un evento propio, para que toda
la app se actualice junta sin recargar:

`kibo:kb-skin` · `kibo:kb-mark` · `kibo:kb-acc` · `kibo:kb-aura` · `kibo:kb-pers` ·
`kibo:kb-toy` · `kibo:currency-skin` · `kibo:currency-names` · `kibo:equippedEmblem` ·
`kibo:cardOwned`

Eventos: `kibo:currency-change` · `kibo:emblem-change` · `kibo:card-change`

---

## Datos · estado

El inventario completo —los 38 tipos del catálogo con veredicto, los 23 disponibles y los 15
descartados con su razón— vive en **`docs/visualizaciones.md`**.

| Fuente | Cuántas |
|---|---|
| `progress-charts.jsx` + `kb-gantt.jsx` (del código) | 6 |
| `charts-nuevas.jsx` (aporte del DS) | 6 |
| `charts-catalogo.jsx` (aporte del DS) | 11 |

Todas las que existen comparten `PeriodFilter` y la serie sintética de `genSeries`, que lleva
semilla: el mismo periodo siempre dibuja lo mismo. **Ojo:** `genSeries` devuelve
`{ points, max, total, meta }`, no un arreglo.
