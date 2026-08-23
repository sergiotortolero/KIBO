# Auditoría de duplicación

Qué está definido varias veces en el proyecto, y cuál es la pieza única que lo reemplaza.
Extraído de `reference/app/*.jsx` y `reference/styles-*.css`.

---

## 1 · Barras · **14 clases + 26 alturas en línea**

La misma barra de progreso está implementada catorce veces, y la clase compartida
(`kbv-progress`) recibe su altura **en línea** en cinco valores distintos.

| Clases que existen hoy | Dónde |
|---|---|
| `kbv-progress` | 26 usos, con `height` en línea de **4, 5, 6, 8 y 10px** |
| `kbv-bar` | HUD de XP |
| `kbv-hpbar` | HP del héroe |
| `kbv-stepbar` | Onboarding y tutorial |
| `kbv-bl-bar` | Lista de libros |
| `w4-bar` | Widgets v4 |
| `kg-bar` | Barras del cronograma |
| `qa-opt-bar` | Opciones de la rueda |
| `opc-legacy-bar` · `opc-size-bar` | Hoja de decisiones |
| `kbv-weekly-bars` · `kbv-weekday-bars` · `kbv-bars-chart` | Gráficas de barras (3 implementaciones) |
| `kbv-diario-entry-bar` | Diario |
| `.progress` · `.ach-bar` · `.ah-bar` · `.ab-bar` · `.wi-bar` · `.sem-bar` · `.apc-bar` · `.rk-bar` · `.ev-bar` · `.weight-bar` · `.ht-bar` · `.og-bar` | Clases locales por pantalla |

**El estándar:** una sola barra, `kbv-progress`, con la altura **como variante de clase** y no en línea.

| Variante | Alto | Cuándo |
|---|---|---|
| `xs` | 4px | Dentro de una fila apretada o un widget chico |
| `sm` | 6px | Dentro de una tarjeta, bajo un título |
| `md` | 8px | Progreso principal de una entidad (por defecto) |
| `lg` | 10px | Progreso protagonista de la pantalla |

Las gráficas de barras **no son barras de progreso**: van a las primitivas de
`progress-charts.jsx`, que ya existen y ya tienen ejes.

---

## 2 · Chips, pastillas y badges · **18 clases**

`kbv-chip` · `kbv-tag` · `kbv-stat-pill` · `kbv-reward-pill` · `kbv-chart-pill` · `kbv-trakt-tag` ·
`voice-chip` · `format-chip` · `platform-chip` · `book-tag` · `ssb-chip` · `opc-legacy-chip` ·
`qa-chip` · `pf-chip` · `w4-chip` · `tab-badge` · `ad-chip` · `am-pill`

Más locales por pantalla: `ai-tag` · `al-badge` · `me-tag` · `subj-pill` · `subj-tag` · `mod-pill` ·
`src-pill` · `interest-chip` · `or-tag` · `ml-badge` · `done-badge` · `kt-badge`.

**El estándar:** tres piezas, elegidas por lo que **hacen** (ver la tarjeta *Chips, pastillas y badges*).

| Pieza | Hace | Tocable | Color |
|---|---|---|---|
| **Chip** | Filtra o cambia de vista | Sí, 30px de alto | Neutro; teal cuando está activo |
| **Pastilla** | Etiqueta de dónde viene algo | No | Lavado del área al 15% + tinta |
| **Badge** | Clasifica en una escala cerrada (rareza) | No | Color pleno |

`kbv-stat-pill` sobrevive aparte: es el contador de divisa del HUD, no una etiqueta.

---

## 3 · KPI · **5 clases + 14 rejillas en línea**

| Clase | Dónde |
|---|---|
| `kbv-kpi` | La principal — 40+ usos |
| `kbv-gallery-kpi` | Galería de widgets |
| `kbv-reto-kpis` | Pantalla de Retos |
| `note-kpi-strip` | Bóveda de notas |
| `bc-kpi` | Tarjetas de balance |

Y la rejilla `kbv-kpi-grid` recibe `gridTemplateColumns` **en línea** en 14 lugares, con
**4, 5 y 6 columnas** — nunca la misma decisión dos veces.

Peor: el interior de `kbv-kpi` varía. Unos traen `kbv-kpi-icon`, otros no; unos `label/val/delta`,
otros `label/val` sin comparativa; hay una variante `anim` con `kbv-kpi-anim-stack`.

**El estándar:** un solo `kbv-kpi` con la anatomía cerrada (etiqueta con glifo → valor → pie con
comparativa y estado) y la rejilla en **clases de columnas**, no en línea. Ver la tarjeta
*KPI e indicadores*, que además define los 4 estados obligatorios (cargando, error, vacío,
sin permiso).

---

## 4 · Barras de herramientas · **5 clases**

`kbv-filter-bar` · `kbv-kanban-toolbar` · `notes-toolbar` · `kbv-wip-toolbar` · `salud-toolbar`

Todas son lo mismo: una fila con chips de filtro a la izquierda y acciones a la derecha, que envuelve
en pantallas angostas.

**El estándar:** una sola `kbv-toolbar`, con `SectionHead` encima cuando la sección lleva título.

---

## 5 · Escenarios · **6 clases**

`kbv-avatar-stage` · `kw-stage` · `kbw-stage` · `kc-stage` · `cg-stage` · `opc-anim-stage`

Todas son una caja que centra algo y le da alto fijo.

**El estándar:** una sola `kbv-stage` con la altura como variante.

---

## 6 · Hojas de estilo duplicadas

| Archivo | Copias |
|---|---|
| `styles-extras.css` | `reference/` **y** `reference/uploads/Kibo/` |
| `styles-v2.css` | `reference/` **y** `reference/uploads/Kibo/` |
| `kbv-components.css` | `reference/_ds/…/` **y** `reference/uploads/Kibo/_ds/…/` |
| `kds.css` | Un design system anterior completo, sin uso |

Además `reference/uploads/Kibo/styles.css` trae un tercer set de clases (`kb-chip`, `kb-stat-bar`,
`kb-tabbar`, `kibo-stage`) — el prefijo `kb-` de una versión anterior al `kbv-` actual.

**El estándar:** una sola copia por hoja. El prefijo es **`kbv-`**; `kb-` está muerto.

---

## 7 · Escalas 1–5 · resuelto, documentar

Ya se cerró en el proyecto pero conviene dejarlo escrito, porque es el patrón a seguir:
el mismo dato «lo que cuesta» se capturaba con **4 controles** (`kbv-rate-row` con ícono `vigor`,
otro con `flame`, y dos `kbv-cat-grid` distintos) y se leía con **3 medidores** (`EnergyMeter`,
`RetoDifficultyMeter`, `StudyRubric`).

Hoy: **`RateRow`** captura, **`Scale5`** lee, y `KB_SCALES` decide ícono y color por concepto.

---

## 8 · Glifos declarados sin dibujo

Siete nombres se usan en el código pero KIcon no los dibuja, así que salen **vacíos** en la interfaz:
`play` · `mood-neutral` · `mood-bad` · `swords` · `medal` · `star` · `scissors`.

Ojo con dos de ellos, porque el nombre parecido ya existe para **otra cosa**:

| Nombre inexistente | El que sí existe | No son lo mismo |
|---|---|---|
| `swords` (par cruzado) | `sword` | Una sola hoja con guarda |
| `mood-neutral` / `mood-bad` | `mood-meh` / `mood-low` | La escala de ánimo es de **5**, no de 7 |

Y tres nombres del set se prestan a mal cableado, porque el glifo no es lo que el nombre sugiere:

| Nombre | Qué dibuja de verdad | Con qué se confunde |
|---|---|---|
| `vigor` | Una **llama** | No es un pulso de actividad |
| `wealth` | Una **moneda** | `piggy` es el de ahorro, y es otro |
| `will` | **Escudo + rayo** | `moon` existe aparte, para el preset de noche |

---

## Orden de ataque

1. **Barras** — 14 clases y 26 alturas en línea. Es el más repetido y el más mecánico de arreglar.
2. **KPI** — 5 clases y 14 rejillas en línea. Es el que más se ve.
3. **Chips** — 18 clases. Requiere decidir el rol de cada uso, uno por uno.
4. **Toolbars y stages** — 11 clases, mecánico.
5. **Hojas duplicadas** — borrar las copias de `uploads/`.
6. **Glifos faltantes** — dibujar los 7, o cambiar cada uso al nombre que sí existe.


## Clases de tipo definidas dos veces · CERRADO

`colors_and_type.css` y `kbv-components.css` definían **las mismas tres clases con valores
distintos**. Como la segunda se importa después, ganaba en cascada: el sistema documentaba una cosa
y pintaba otra.

| Clase | Decía el sistema | Pintaba de verdad |
|---|---|---|
| `.kbv-eyebrow` | Jakarta 11px minúscula, tracking .01em | Jakarta 11px **MAYÚSCULAS**, tracking .10em |
| `.kbv-meta` | **Inter** 12px | **mono** 11px |
| `.kbv-num` | **Jakarta** 700 + `tabular-nums` | **mono** 600 |

**Resuelto:** las clases de tipo las define **una sola hoja** (`colors_and_type.css`). Se quitaron
las copias de `kbv-components.css`.

**La regla:** una clase, una hoja. Si aparece en dos, la que se importa después gana y el sistema
se vuelve mentira.

## La fuente de etiquetas · CERRADO

**JetBrains Mono se retiró.** Su trazo cuadrado peleaba con los radios suaves del sistema.

| | Antes | Ahora |
|---|---|---|
| Familias | 3 | **2** |
| Rol etiqueta | JetBrains Mono | Plus Jakarta Sans (`--kb-f-label`) |
| Caja | MAYÚSCULAS | **minúscula** |
| Tracking | `.14em` | `.01em` |
| Tamaño | 10px | 11px |
| Peso | 500 | **700** |

`--kb-f-mono` queda como alias de `--kb-f-label` para que el código viejo no se rompa, pero el
nombre canónico es `--kb-f-label`. Se quitaron las 24 declaraciones `@font-face` de JetBrains
(los woff2 siguen en `fonts/` por si un archivo viejo los pide).

## Capas de KIBO repartidas en dos hojas · CERRADO

El CSS de KIBO vivía partido: `kibo-blob.css` traía cuerpo, cara y travesuras, pero **auras,
marcas, accesorios, juguetes y fichas estaban en `styles-extras.css`** (11 400 líneas). Una tarjeta
que solo cargara `kibo-blob.css` mostraba KIBO **sin aura y sin marcas** — y eso es justo lo que
pasaba.

**Resuelto:** `reference/kibo-blob-extras.css` — extraído del código real, solo las 146 reglas
`.kbb-*` / `.kbs-*` y sus 17 `@keyframes kbb-*`. Cualquier tarjeta monta el KIBO completo con
dos hojas y sin arrastrar la app entera.


## La rueda vivía en tres archivos · CERRADO

El `KiboQuickWheel` real necesita cuatro piezas que estaban repartidas:

| Pieza | Dónde vive | Qué aporta |
|---|---|---|
| `kibo-quick.jsx` | `reference/app/` | El componente, los 13 rubros y sus acciones |
| `kibo-style.jsx` | `reference/app/` | El guardarropa (piel, marca, aura, personalidad, juguete) |
| `kibo-blob.jsx` | `reference/app/` | KIBO, que la rueda pone en su centro |
| reglas `.kbw-*` | `styles-extras.css`, línea ~10 000 | El disco, las etiquetas, el hub y el jalón |

**Resuelto:** `reference/kibo-wheel.css` — extraído del código real, 133 reglas `.kbw-*` y sus 3
`@keyframes`. Con eso la tarjeta monta la rueda completa sin cargar la hoja de 11 400 líneas.

**Hallazgo de interacción.** La rueda **no son nueve botones**: se **apunta** con el cursor y se
suelta, como cambiar de arma en GTA V. Un clic sintético sobre un sector no la activa — hace falta
dirección. Documentarla como «toca el sector» era describir mal el gesto.

**Estructura real del disco**, para no reinventarla:

```
.kbw-stage      velo + captura del puntero
  .kbw-wrap     ancla al origin (KIBO), no al centro de la ventana
    .kbw-disc   <svg> · 1 circle + 9 path.sec (el primero lleva .hero)
    .kbw-labels 9 .kbw-lab, entran escalonadas a 22ms
    .kbw-hub    KIBO viajado, con .kbw-pull para el jalón del gel
    .kbw-hubbar 2 .kbw-hb — solo «Cerrar» y «Editar la rueda»
  .kbw-foot     .kbw-cap con el letrero de estado
```


## Defecto de cascada · heatmap todo gris

**Encontrado por el DS, existe en la app.** El heatmap de constancia dibuja sus 182 celdas **todas
grises**, aunque el componente sí calcula la intensidad de cada día.

| | |
|---|---|
| `.hc.l0`…`.hc.l4` | pos ~241 700 de `styles-extras.css` — definen el tinte por nivel |
| `.kbv-heatmap-scroll .hc` | pos ~310 000 — repone `background: var(--kb-surface-2)` |

Las dos reglas tienen **la misma especificidad** (dos clases), así que gana la última por orden y el
tinte se pierde. La leyenda se salva de casualidad: vive en `.kbv-heatmap-foot`, fuera del alcance
de `.kbv-heatmap-scroll`.

**Síntoma que lo delata:** el pie dice «150 días activos de 182 · 82 % del periodo» mientras la
rejilla está vacía. El dato y el dibujo se contradicen.

**Arreglo en el proyecto:** que `.kbv-heatmap-scroll .hc` declare solo medida y radio, sin
`background`. En el DS se repara subiendo la especificidad (`.kbv-heatmap-scroll .hc.lN`), en el
único bloque autoral de `reference/kibo-charts.css` — que **reemite las declaraciones originales sin
teclearlas**, generándolas con una lectura de `styles-extras.css`.

### Lección para extraer CSS

Dos cosas que ya fallaron aquí:

1. **Filtrar solo por `.kbv-` deja piezas fuera.** El heatmap usa auxiliares sin prefijo —
   `.hc`, `.hc.l0`–`.l4`, `.hm-body`, `.hm-top`, `.hm-month`, `.hm-dows`. Con el filtro
   restringido el heatmap salía gris y las barras colapsaban.
2. **Comprobar que el nodo existe no prueba nada.** Hay que verificar el resultado visual: contar
   `backgroundColor` distintos entre las celdas y exigir 5, no confirmar que `.hc` está en el DOM.
3. **Al corregir un selector, no teclear el valor.** Al reparar esta cascada escribí `.hc.l3` en
   **72 %** cuando la fuente dice **74 %** — solo había leído `.l1` y los otros tres los puse de
   memoria. La leyenda dejó de coincidir con la rejilla por ~1 % de luminosidad. La regla ahora es
   leer la declaración con un `match` y reemitirla con el selector nuevo, sin retipearla; así una
   corrección de especificidad no puede meter valores fabricados. Se detecta comparando el nivel N de
   la rejilla contra el nivel N de la leyenda y exigiendo que sean idénticos.

## El heatmap ignora el filtro de periodo

`ConsistencyHeatmap` recibe `period` pero su rango es **fijo de 6 meses** (182 días) — su propio pie
lo dice. Ponerle un `PeriodFilter` encima hace ver que el control no sirve. En el DS se quitó ese
filtro de la tarjeta. **Decisión de producto pendiente:** o el heatmap respeta el periodo, o nunca
lleva filtro al lado.


## Dominio TAREAS · deriva encontrada

Leído de `reference/styles-extras.css` líneas 712, 7583, 7607, 11974.

### La píldora de prioridad existe en tres versiones

| Selector | Familia resuelta | `letter-spacing` | Relleno | Mezcla | Variable | Contraste |
|---|---|---|---|---|---|---|
| `.kbv-kanban-card .pri` | **Jakarta** (alias) | `.08em` | `2px 6px` | 12% | `--p` | **3.43:1** ✗ |
| `.kbv-backlog-card .bk-pri` | **Inter** (heredada) | `.05em` | `2px 7px` | 14% | `--pc` | **3.36:1** ✗ |
| `.kbv-deadlines .dl-type` | **Inter** (heredada) | `.04em` | `2px 7px` | 12% | `--tc` | **3.23:1** ✗ |

Tres espaciados, dos rellenos, dos mezclas, **dos familias** y **tres nombres de variable para el
mismo dato**. La de kanban resuelve a Jakarta porque `--kb-f-mono` quedó como alias de
`--kb-f-label`; las otras dos heredan Inter del cuerpo.

**Y las tres fallan el contraste.** A 10px/800 el mínimo es 4.5:1 y ninguna pasa: el texto usa el
color de prioridad **crudo** sobre un tinte del 12–14% de ese mismo color, y un tono medio no llega
a 4.5:1 contra su propio tinte — aclarar el fondo aclara la diferencia en la misma medida. Es la
única de las divergencias que **rompe una regla declarada**, y la razón de que el canónico use tinta.

Canónico: Jakarta 800, 10px, `2px 7px`, tinte 13%, **texto en tinta**
(`color-mix(in oklab, var(--p) 72%, var(--kb-text))` = **5.29:1**), **minúscula sin tracking**.

### El punto significa dos cosas a dos tamaños

| Selector | Tamaño | Significa |
|---|---|---|
| `.kbv-kanban-card .area-chip .dot` | 6px | **área** |
| `.kbv-backlog-list .bl-pri-dot` | 9px | **prioridad** |

Canónico: 7px y **solo para área**. La prioridad ya tiene píldora; darle también punto duplica el
signo y obliga a adivinar cuál color se está mirando.

### La casilla mide distinto que en hábitos

`.kbv-deadlines .dl-check` es de 16px con borde de 2px; la de hábitos, 22px con borde de 2.5px.
Gana la de 22px: 16px queda por debajo del objetivo táctil y se ve distinta al lado de un hábito en
la misma pantalla.

### Hex crudo del rojo de urgencia · ×2

`.kbv-deadlines .dl-row.urgent` y `.dl-row.urgent .dl-date` traen `#E64545` escrito a mano en vez
de `var(--pri-urgent)`.

### Seis franjas laterales solo en este dominio

`.kbv-kanban-card` · `.kbv-backlog-card` · `.kbv-bl-group` · `.kbv-schedule .sch-block` ·
`.kbv-deadlines .dl-row.urgent` · `.kbv-evals .ev-card` — las seis con `border-left: 3px`.

Dos merecen nota aparte porque llevan **doble signo**:

- **`.sch-block`** trae franja **y** fondo tintado al 10%. Va a **barra sólida** con tinta legible.
- **`.kbv-bl-group`** trae franja **y** un estado `.over` que ya tinta el fondo al 8% y colorea el
  borde completo — la franja es redundante con su propio estado.

Y una gana lectura al migrar: **`.dl-row.urgent`** solo tenía franja para *una* de las cinco
prioridades. La pastilla funciona para las cinco y dice **qué** pasa, no solo que algo pasa.

---

## La monoespaciada retirada dejó su tratamiento · PENDIENTE DE MIGRAR

Al bajar el sistema a dos familias, `--kb-f-mono` quedó como **alias de `--kb-f-label`** (Jakarta),
así que los **317 bloques** que lo invocan siguen funcionando. La familia está resuelta.

Lo que **no** se migró es el tratamiento que acompañaba a la monoespaciada:

| | Cuántos |
|---|---|
| Bloques que usan `var(--kb-f-mono)` | 317 |
| …que siguen en `text-transform: uppercase` | **116** |
| …que conservan `letter-spacing` en em | **152** |
| Valores distintos de `letter-spacing` | **20** |

Los 20 incluyen el mismo valor escrito de tres formas: `.1em`, `0.1em` y `0.10em`. Jakarta en
MAYÚSCULA con `.08em` de tracking es justo lo que se buscaba retirar — la decisión fue
**minúscula y pequeña, nunca mayúscula con tracking**.

### La fecha de vencimiento · dos defectos sobre la misma declaración

`.kbv-deadlines .dl-row.urgent .dl-date` carga **dos** problemas independientes, y arreglar el
primero no toca el segundo:

| Defecto | Estado | Detalle |
|---|---|---|
| Hex crudo | 2 lugares | `#E64545` escrito a mano en vez de `var(--pri-urgent)` |
| Contraste | **3.73:1** ✗ | A 11px/800 el mínimo es 4.5:1 |

**La trampa:** `var(--pri-urgent)` **es** `#E64545`. Tokenizar el valor es correcto y necesario, pero
resuelve al mismo color, así que el contraste sigue fallando exactamente igual. Se ve como un arreglo
y no lo es.

Es el mismo patrón de las tres píldoras de prioridad: un color medio no alcanza 4.5:1 en texto chico.
El destino es la **tinta**, no el token crudo:
`color-mix(in oklab, var(--pri-urgent) 72%, var(--kb-text))` = **5.79:1**.


## La familia amarilla falla el contraste en producción · ABIERTO

`.kbv-project .status` (`kbv-components.css:2481-2483`) usa **tinta ámbar fija** `#8A6313`, que es
la decisión correcta: **4.97:1** sobre su propio tinte. Pero el estado `todo` de la misma regla usa
`#6B7280` sobre `#F1F2F6` = **4.32:1**, y a 10px/700 el mínimo es 4.5:1.

**El sistema solo tiene dos neutros** — `#1A1A2E` y `#6B7280` — así que para una píldora neutra la
elección es binaria: 4.32 (falla) o 15.06 (pasa). El canónico usa `--kb-text`: el matiz de gris de
la píldora ya comunica «sin empezar», no hace falta aclarar el texto para eso.

Y la barra de avance del proyecto mide **4px** (`:2497-2504`), igual que la de tarea — no 6px.


## Proyectos · dos migraciones · 17 ago

| Selector | Línea | Hoy | Canónico |
|---|---|---|---|
| `.kbv-area-projcard` | `styles-extras.css:8912` | `border-left: 3px solid var(--c)` | Glifo relleno en la tinta del área + pastilla · sin orilla (R-1) |
| `.status-pip` | `:6837` | `--kb-text-2` sobre `--kb-surface-2` = **4.27:1** | `--kb-text` (R-14) |

Ambas ya están aplicadas en `proyectos-moleculas`. El resto del vocabulario de proyectos se recreó
fiel al código y está citado con su línea en la propia tarjeta:
`.kbv-detail-rows .row` (`:6808`), `.kbv-area-rollup` (`:8903`), `.pc-danger` (`:13059`),
`.kbv-project-detail-grid` con su `@container` a 900px (`:6807`).

**Un hallazgo de iconografía:** `coin` y `gem` **no existen** en `KIcon` — las divisas las dibuja
`CurrencyGlyph` aparte, porque son objetos de marca personalizables. Un hito que premia monedas usa
`wealth`, que sí es del set.
