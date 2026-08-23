# Inventario del proyecto

Mapa completo de lo que existe y cómo navegarlo. Generado del proyecto, no escrito a mano.

**68 tarjetas** en **16 índices** · **5 componentes** compilados ·
**8 documentos** · **16 archivos** de fuente v1.

---

## 1 · Cómo está organizado

```
kibo-design-system/
├── colors_and_type.css     LA FUENTE DE VERDAD de los tokens. Se lee primero.
├── kbv-components.css      Clases de componente de la v1, con los tokens re-apuntados
├── styles.css              Entrada del compilador: importa las dos de arriba + fuentes
├── docs/                   Plan, auditorías, decisiones. Se lee ANTES de construir
├── preview/                Una tarjeta por concepto. Es la documentación visible
├── components/             Primitivas compiladas al bundle (window.KiboDesignSystem_07af9d)
├── reference/              La fuente REAL de Kibo v1. La verdad de campo
│   ├── app/*.jsx           Los módulos: cada tarjeta cita de aquí
│   ├── styles-extras.css   13 397 líneas. El CSS de producción
│   └── kibo-*.css          Extractos por dominio (blob, rueda, gráficas)
├── assets/                 Marcas de KIBO
├── fonts/                  Jakarta e Inter auto-hospedadas (woff2)
└── ui_kits/                Consumo del sistema: app/ y web/
```

### El orden de lectura que recomiendo

1. `README.md` — marca, voz, fundamentos visuales, iconografía, salvedades
2. `docs/PLAN.md` — **el documento de control**: estado por índice, retro del usuario, lecciones
3. `colors_and_type.css` — los tokens, con su comentario de por qué cada valor es el que es
4. `docs/decisiones-abiertas.md` — lo que aún no está decidido
5. La tarjeta del dominio que vayas a tocar, en `preview/`

---

## 2 · Las reglas que gobiernan todo

Están en `docs/PLAN.md` con su origen. En corto:

| # | Regla |
|---|---|
| **T-1** | Solo la decisión canónica. Nada de «antes vs. ahora», nada de historia |
| **T-3** | Documentar lo que **es**, no cómo se llegó |
| **T-4** | Ninguna tarjeta pasa de ~800px; el ideal es 300–500. Si cubre dos conceptos, son dos tarjetas |
| **T-6** | Piso duro de **10px** para todo texto, incluidas las etiquetas de espécimen |
| **T-7** | Cejillas en MAYÚSCULAS con tracking `.09em`. La mono se retiró: la familia es Jakarta |
| **T-8** | Los literales de código (`--kb-*`, `.kbv-*`) nunca en mayúsculas |
| **T-10** | Medir el alto **después** de editar y declararlo en la misma pasada |
| **T-11** | Los íconos vienen de `reference/app/icons.jsx` real, nunca de una librería externa |
| **R-1** | **Prohibida la franja de color en una orilla.** Cuatro patrones aprobados: banda de encabezado (tarjeta grande), pastilla de área (pieza compacta), barra sólida (cronograma), fondo tintado al 6 % (nota) |
| **R-13** | Texto pequeño sobre color va en **tinta** (`--kb-ink-on-tint` o `--kb-*-ink`), nunca color pleno. Blanco sobre color solo a 14px negrita o más |
| **R-14** | Sobre superficie tintada, `--kb-text-2` no alcanza AA (4.27:1): ahí va `--kb-text` |
| — | **El área pinta, la prioridad marca.** Cuando compiten, el área toma la superficie y la prioridad usa el medidor escalonado |

---

## 3 · Las tarjetas, por índice

### 01 · Tipografía — 1

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Tipografía** | `tipografia.html` | 682 | — |

### 02 · Color — 3

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Color base y marca** | `color-base.html` | 476 | — |
| **Color del sistema** | `color-sistema.html` | 475 | `icons.jsx` |
| **Familias de color especiales** | `token-familias.html` | 761 | — |

### 03 · Medidas y movimiento — 2

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Movimiento** | `animaciones.html` | 459 | — |
| **Radios, sombras y espaciado** | `medidas.html` | 409 | — |

### 04 · Íconos — 5

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Íconos · acción y dato** | `iconos-accion-dato.html` | 501 | `icons.jsx` `kicon-faltantes.jsx` |
| **Íconos · ánimo, KIBO y marca** | `iconos-animo-marca.html` | 451 | `icons.jsx` `kicon-faltantes.jsx` |
| **Íconos · área y gamificación** | `iconos-area-gamif.html` | 371 | `icons.jsx` `kicon-faltantes.jsx` |
| **Íconos · navegación y contenido** | `iconos-nav-medio.html` | 476 | `icons.jsx` |
| **Íconos · reglas y tamaños** | `iconos-reglas.html` | 468 | `icons.jsx` |

### 05 · Átomos — 4

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Botones** | `buttons.html` | 169 | — |
| **Campos y controles** | `inputs.html` | 249 | — |
| **Chips, pastillas y badges** | `chips.html` | 395 | `icons.jsx` |
| **Escalas 1–5** | `escalas.html` | 449 | — |

### 06 · Moléculas — 2

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Componentes canónicos** | `componentes-canonicos.html` | 639 | — |
| **Tarjetas** | `tarjetas.html` | 564 | — |

### 07 · Modales y formularios — 3

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Campos de formulario** | `formulario-campos.html` | 651 | `icons.jsx` |
| **Estados de campo** | `formulario-estados.html` | 504 | `icons.jsx` |
| **Modal de alta** | `modal-alta.html` | 515 | `icons.jsx` |

### 08 · Datos — 14

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Barras de progreso** | `progress-bars.html` | 462 | — |
| **Datos · ciclo y tres variables** | `datos-ciclo.html` | 756 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · combinado** | `datos-combinado.html` | 377 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · composición** | `datos-composicion.html` | 701 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · constancia y lo que falta** | `datos-constancia.html` | 416 | `kibo-charts.css` `icons.jsx` `progress-charts.jsx` |
| **Datos · dispersión** | `datos-dispersion.html` | 532 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · distribución** | `datos-distribucion.html` | 679 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · flujo** | `datos-flujo.html` | 679 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · jerarquía y flujo** | `datos-jerarquia.html` | 444 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · medida y ranking** | `datos-medida.html` | 812 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · meta y cambio** | `datos-meta.html` | 640 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · radar de balance** | `datos-radar.html` | 427 | `kibo-charts.css` `charts-nuevas.jsx` `charts-catalogo.jsx` |
| **Datos · tendencia y comparativa** | `datos-tendencia.html` | 642 | `kibo-charts.css` `icons.jsx` `progress-charts.jsx` |
| **KPI e indicadores** | `kpi.html` | 436 | — |

### 09 · KIBO — 11

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **KIBO · anatomía e interacción** | `kibo-mascot.html` | 606 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-blob.jsx` |
| **KIBO · ánimos** | `kibo-moods.html` | 461 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-blob.jsx` |
| **KIBO · auras** | `auras.html` | 307 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-style.jsx` `kibo-blob.jsx` |
| **KIBO · capas de animación** | `kibo-capas.html` | 380 | `kibo-blob.css` `kibo-blob-extras.css` |
| **KIBO · los 4 relojes base** | `kibo-animacion.html` | 541 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-blob.jsx` |
| **KIBO · marcas** | `marcas.html` | 513 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-style.jsx` `kibo-blob.jsx` |
| **KIBO · pieles** | `piel.html` | 469 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-style.jsx` `kibo-blob.jsx` |
| **KIBO · travesuras** | `travesuras.html` | 661 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-blob.jsx` |
| **Marca** | `logo.html` | 198 | — |
| **Rueda · reglas de comportamiento** | `rueda-reglas.html` | 393 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-wheel.css` |
| **Rueda de acción rápida** | `rueda.html` | 526 | `kibo-blob.css` `kibo-blob-extras.css` `kibo-wheel.css` `icons.jsx` `kibo-style.jsx` `kibo-blob.jsx` `kibo-quick.jsx` |

### 10 · Gamificación — 9

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Divisas · skins** | `divisas.html` | 638 | `icons.jsx` `personalizacion.jsx` |
| **Logros y rarezas** | `logros.html` | 543 | `icons.jsx` |
| **Niveles · héroe y área** | `niveles.html` | 489 | `icons.jsx` `personalizacion.jsx` |
| **Niveles · las escalas y sus ciclos** | `niveles-escalas.html` | 515 | `icons.jsx` `personalizacion.jsx` |
| **Prestigio** | `prestige.html` | 337 | — |
| **Rachas** | `rachas.html` | 337 | — |
| **Rangos y emblemas** | `ranks.html` | 303 | — |
| **Trofeos y estandartes** | `trofeos.html` | 510 | — |
| **Vitrina** | `vitrina.html` | 365 | — |

### 11 · Proyectos — 5

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Cronograma · día y los 4 niveles** | `cronograma-dia.html` | 655 | `icons.jsx` |
| **Cronograma · el Gantt real** | `cronograma.html` | 775 | `icons.jsx` |
| **Proyectos · átomos y tablero** | `proyectos-atomos.html` | 575 | `icons.jsx` |
| **Proyectos · moléculas** | `proyectos-moleculas.html` | 498 | `icons.jsx` |
| **Proyectos · moléculas y organismos** | `proyectos-organismos.html` | 607 | `icons.jsx` |

### 12 · Tareas — 2

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Tareas · átomos** | `tareas-atomos.html` | 389 | `icons.jsx` |
| **Tareas · moléculas y organismos** | `tareas-moleculas.html` | 471 | — |

### 13 · Áreas de vida — 1

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Áreas · átomos** | `areas-atomos.html` | 790 | `icons.jsx` |

### 14 · Hábitos — 3

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Hábitos · átomos** | `habitos-atomos.html` | 549 | `icons.jsx` `personalizacion.jsx` |
| **Hábitos · moléculas y tarjeta** | `habitos-moleculas.html` | 739 | `icons.jsx` `personalizacion.jsx` |
| **Hábitos · registro rápido** | `habitos-registro.html` | 755 | `icons.jsx` |

### 15 · Retos — 1

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Tarjeta de reto** | `reto-cards.html` | 649 | `icons.jsx` `personalizacion.jsx` |

### 16 · Glosario — 2

| Tarjeta | Archivo | Alto | Fuente que cita |
|---|---|---|---|
| **Glosario · color e interacción** | `glosario-color.html` | 526 | — |
| **Glosario · forma y texto** | `glosario.html` | 1127 | — |

### 17 · UI Kit — 2

Estas dos **no** viven en `preview/`, sino en el propio kit, porque son consumo del sistema:

| Tarjeta | Archivo |
|---|---|
| **App gamificada** | `ui_kits/app/index.html` |
| **Marketing y auth** | `ui_kits/web/index.html` |

---

## 4 · Componentes compilados

Viven en `components/` como pares `.jsx` + `.d.ts` y salen al bundle. Se consumen así:

```js
const { KbButton, KbCard, KbChip, KbEmblem, KbStatPill } = window.KiboDesignSystem_07af9d;
```

| Componente | Qué es |
|---|---|
| **KbButton** | primario / secundario / ghost / danger / link. El primario lleva labio duro de 2px |
| **KbCard** | tarjeta base, variante `boss` tintada, estado `hover` elevado |
| **KbChip** | chip de filtro con punto opcional de área o prioridad |
| **KbStatPill** | pastilla de moneda / materia / racha / HP / XP con los glifos reales |
| **KbEmblem** | escudo por material de rango (bronce → damasco), con estado `locked` |

**El resto del sistema no es componente, es tarjeta.** Es deliberado: una tarjeta documenta y se lee;
un componente hay que mantenerlo. Solo se compila lo que se reusa en varias tarjetas.

---

## 5 · Los documentos

| Archivo | Para qué se lee |
|---|---|
| `docs/PLAN.md` | **El documento de control.** Estado por índice, la retro del usuario donde la dio, 13 lecciones de método y los siguientes pasos |
| `docs/anatomia.md` | El método de desglose: átomo → molécula → organismo → pantalla, con el criterio de qué es cada uno |
| `docs/auditoria-contornos.md` | Los 58 selectores con franja de acento en la v1 y a qué patrón migra cada uno |
| `docs/auditoria-duplicacion.md` | Lo que está duplicado en la v1: 14 clases de barra, 18 de chip, 5 de KPI, y los hallazgos de contraste |
| `docs/decisiones-abiertas.md` | Lo que depende del usuario, cada una con opciones, consecuencia y recomendación |
| `docs/iconografia.md` | Taxonomía `dominio/nombre/variante` de los 77 íconos, tamaños y qué personaliza el usuario |
| `docs/pendientes.md` | Cola de trabajo con su bloqueo |
| `docs/visualizaciones.md` | Las 12 gráficas del catálogo con su uso y su estado vacío |

---

## 6 · La fuente v1 en `reference/`

**Es la verdad de campo.** Cada medida de cada tarjeta sale de aquí y se cita con archivo y línea.

### Módulos (`reference/app/`)

- `charts-catalogo.jsx`
- `charts-nuevas.jsx`
- `icons.jsx`
- `kb-gantt.jsx`
- `kbv-shared.jsx`
- `kibo-blob.jsx`
- `kibo-quick.jsx`
- `kibo-style.jsx`
- `kibo-vitals.jsx`
- `kicon-faltantes.jsx`
- `personalizacion.jsx`
- `prestige-system.jsx`
- `prestigio-nombres.jsx`
- `progress-charts.jsx`
- `reencauce.jsx`
- `tarea-detalle.jsx`

### Hojas de estilo

- `kibo-blob-extras.css` — KIBO: pieles, marcas, auras (extraído de styles-extras)
- `kibo-blob.css` — KIBO: cuerpo, cara, travesuras
- `kibo-charts.css` — Gráficas: heatmap, barras, líneas
- `kibo-ds-align.css` — Puente entre la v1 y los tokens canónicos
- `kibo-fonts.css` — 48 declaraciones `@font-face` de Jakarta e Inter
- `kibo-shell.css` — —
- `kibo-wheel.css` — Rueda de acción: 133 reglas `.kbw-*` + 3 keyframes
- `styles-extras.css` — **13 397 líneas.** El CSS de producción completo. Aquí se busca todo

### Cómo buscar aquí

```
1. grep del término en ESPAÑOL y sin guion   («hito», no «hito-» ni «milestone»)
2. grep de la clase en styles-extras.css     → da los VALORES
3. abrir el .jsx del módulo                  → da la ESTRUCTURA y los nombres de clase
```

**Los dos, nunca uno solo.** El CSS dice cuánto mide; el JSX dice qué existe y cómo se compone.
De no hacerlo salieron las lecciones M-9, M-10 y M-12.

---

## 7 · Cómo se hace una tarjeta

```html
<!-- @dsCard group="13 · Áreas de vida" viewport="700x700" name="..." subtitle="..." -->
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../kbv-components.css">
```

1. **Leer la fuente** — grep del CSS y abrir el JSX. Cada medida se cita con su línea
2. **Componer, no re-estilar** — si la clase existe en `kbv-components.css`, se usa (M-12)
3. **Íconos reales** — `<script type="text/babel" src="../reference/app/icons.jsx">` y `<KIcon name=... size=.../>`
4. **Medir el alto** con un iframe de 200px y el `bottom` del último hijo visible, y declararlo (T-10)
5. **Verificar contraste** rasterizando el color computado en un canvas de 1×1 (M-1, M-6)
6. `check_design_system` para confirmar que compila

### El arnés de verificación

No hay archivo permanente: se escribe temporal, se corre y se borra. Hace tres cosas —
mide el alto real, mide el contraste de cada nodo con texto componiendo las capas translúcidas, y
lista lo que baje de 10px. Los falsos positivos conocidos: nodos sin texto, esqueletos de carga
(texto transparente) y marcadores de estado vacío.

---

## 8 · Lo que falta

De `docs/PLAN.md`, en orden:

| Prioridad | Qué | Bloqueo |
|---|---|---|
| 1 | **13 · Áreas** — molécula y organismo (el átomo ya está) | — |
| 2 | **Detalle de tarea** (`tarea-detalle.jsx`) | cierra 12 y desbloquea el nivel tarea del cronograma |
| 3 | **KIBO: grupos de animación** — ojos, boca, cuerpo, manopies por separado | arquitectura; va antes de las 14 correcciones |
| 4 | **KIBO: 14 correcciones** de travesuras + 2 de la rueda | depende de 3 |
| 5 | **Divisas**: 5 opciones por categoría, glifos, nombre del conjunto | falta el nombre de la moneda especial |
| 6 | **Controles de formulario**: 6 que existen en el código y no están documentados | — |
| 7 | **Dominios sin desglose**: economía y tienda, perfil y social, lectura, salud, finanzas, diario | — |
| 8 | **Deuda T-4**: partir `glosario` (1127px) | — |

### Decisiones ya tomadas que faltan aplicar

- **Piso táctil** → subir los botones de ícono a 44px; el nombre del hábito sube a 15px y el premio se recorta
- **Casilla parcial** → solo en hábitos con meta numérica
- **Protector de racha** → átomo propio
- **Cronograma** → los cuatro niveles
- **Prestigio** → el de área (5 estrellas) y el del héroe (16 grados) son sistemas distintos, se documentan aparte
