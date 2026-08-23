# Kibo — Design System

**Kibo** es un *Personal OS gamificado* — una plataforma de "Quantified Self" y gestión de vida que
centraliza la productividad personal y construye disciplina con psicología conductual. Plantea la
vida diaria como un **RPG de productividad**: creas un personaje, subes de nivel cinco **áreas de
vida**, mantienes **rachas**, peleas contra **jefes** (tus metas más duras), ganas **monedas, gemas,
XP y emblemas**, y los gastas en una **Vitrina** de cosméticos. El producto es **español primero
(es-MX)** con soporte completo en inglés.

> Promesa y voz de marca: *cercano, motivador*. La frase firma es **«el fracaso reencauza»** — los
> tropiezos se replantean como correcciones de rumbo, nunca como castigos.
> Tagline: *Personal OS gamificado (RPG de productividad).*

Este proyecto es el design system de Kibo: tokens, tipografía, color, el lenguaje visual de la
gamificación, iconografía, componentes reutilizables y UI kits que recrean el producto. Existe para
que un agente de diseño produzca artefactos de Kibo en marca — pantallas, páginas, decks, prototipos
— sin volver a deducir el estilo cada vez.

---

## Índice de documentos

| Documento | Qué resuelve |
|---|---|
| [`docs/estado.md`](docs/estado.md) | Las 29 tarjetas por grupo, las reglas del sistema, cómo se usa en el proyecto y qué falta estandarizar |
| [`docs/auditoria-duplicacion.md`](docs/auditoria-duplicacion.md) | **Qué está definido varias veces** y cuál es la pieza única que lo reemplaza |
| [`docs/auditoria-contornos.md`](docs/auditoria-contornos.md) | Los 58 selectores con franja de acento en una orilla y su patrón de reemplazo |
| [`docs/iconografia.md`](docs/iconografia.md) | El set KIcon por dominio, tamaños y qué puede personalizar el usuario |
| `reference/docs/` | La fuente del proyecto: handoff, plan maestro, PRD, auditorías |

En la pestaña Design System, la tarjeta **Glosario visual** explica cada término técnico
(glifo, alto de control, banda, pastilla, tinta, cejilla, token) señalado sobre la pieza real.

---

## Fuentes

Este sistema se construyó del código real de Kibo más un spec canónico de diseño.

- **Plataforma Kibo (app web) — Next.js + shadcn/ui:**
  <https://github.com/kibo-developer/kibo-platform> (espejo: <https://github.com/sergiotortolero/KIBO>)
  Monorepo pnpm/Turbo. La superficie que se extrajo es `apps/web` (Next.js App Router — se lee en
  GitHub; las fuentes no se copian aquí porque sus imports de npm no corren en el navegador):
  landing de marketing, auth (`login` / `register` / `forgot-password`), el flujo de creación de
  personaje *«Configura tu Personaje»*, y el shell del dashboard. Las primitivas viven en
  `apps/web/src/components/ui/*` (shadcn `button`, `card`, `input`, `select`, `label`, `textarea`) y
  los tokens en `apps/web/src/app/globals.css`. Explora ese repo para extender el sistema con
  primitivas que aún no se han vestido: copia el componente de shadcn y cambia sus valores por los
  tokens de `colors_and_type.css`.
- **Base de componentes — shadcn/ui:** <https://github.com/shadcn-ui/ui>
  `apps/web` es un proyecto shadcn (`components.json`, variantes `cva`, Radix, la convención de foco
  `focus-visible:ring-[3px]`, el modelo mental de tokens semánticos
  `--background/--foreground/--primary/--muted/--border/--ring`). Se conservó esa **estructura** y se
  reemplazaron los **valores** por los de la marca Kibo.
- **Spec del DS de Kibo (estado de handoff, iteración 11).** Catálogo completo de tokens + 24
  decisiones de diseño + el catálogo de «sistema» de la gamificación (emblemas de rango, prestigio,
  progresión por área, tiers de llama, cosméticos de Vitrina, logros, economía, iconografía). Es la
  **fuente canónica de verdad** y está codificado en `colors_and_type.css`.
- **El prototipo real de Kibo.** Sus fuentes están extraídas en **`reference/`** (20 módulos JSX y
  CSS: dashboard, áreas, prestige-system, streak-system, achievements, vitrina, widgets, modales,
  onboarding, auth, íconos, mascota, páginas de decisiones del DS) más sus capas de CSS
  (`kibo-app.css` núcleo, `kibo-extras.css`, `kibo-chrome.css`, `kibo-fonts.css`). Las clases núcleo
  se adoptan en la raíz como **`kbv-components.css`** (con los tokens re-apuntados a la capa
  canónica). **Lee `reference/` antes de recrear cualquier pantalla** — es la verdad de campo sobre
  la estructura de los componentes.

> **Nota de reconciliación — importante.** El `:root` vivo de `apps/web/globals.css` **aún no está
> sincronizado** con el spec canónico. El código todavía trae valores de shadcn: un primario
> turquesa/verde (`174 72% 56%` / `#40E0D0` hard-coded), fuentes **Geist**, radio `0.5rem`, y una
> pantalla de onboarding con **degradado índigo→morado**. El sistema canónico sustituye todo eso:
> **teal `#1CA4A0`**, **Plus Jakarta Sans / Inter / Plus Jakarta Sans**, la escala de radios suaves, y
> **cero degradados azul-morado**. Construye contra `colors_and_type.css`, no contra el `:root` vivo.

---

## Fundamentos de contenido

Cómo escribe Kibo. La voz es de game-master o coach de apoyo: cálida, motivadora, directa — nunca
clínica, nunca sargento.

- **Español primero (es-MX), inglés soportado.** La copia principal es español mexicano; el inglés es
  un segundo locale de primera clase (`es-MX`, `en`). Etiquetas, errores y microcopy son bilingües.
  Ejemplos reales del código: *«Crear Cuenta»*, *«Únete a Kibo y comienza tu aventura»*, *«Inicia
  sesión para continuar tu aventura»*, *«Configura tu Personaje»*.
- **Persona:** se dirige al usuario de **«tú»**, informal (*«tu nombre»*, *«¿Cómo te dicen tus
  amigos?»*, *«¡Para celebrar tu vuelta al sol!»*), nunca de «usted». Kibo se refiere a sí mismo como
  **«nosotros»** (*«nos ayuda a conocerte mejor»*).
- **Tono: motivador, con marco de aventura, amable.** La vida es una *aventura*; las metas son
  *misiones*; las metas duras son *jefes*. Los tropiezos **reencauzan** — nunca avergüenzan. La copia
  se apoya en el estímulo (*«Toda gran aventura comienza con un nombre»*) y celebra el progreso.
- **Capitalización:** dos registros.
  1. **Display y títulos** — mayúscula inicial o título, en Plus Jakarta Sans (*«Crear Cuenta»*,
     *«Configura tu Personaje»*).
  2. **Etiquetas, metadatos e índices** — TODO EN MAYÚSCULAS en Plus Jakarta Sans con tracking amplio
     (`.kbv-eyebrow`): códigos de área, etiquetas de estadística, números de catálogo. La etiqueta
     mono en mayúsculas es la firma verbal del sistema.
- **Los números son contenido.** Niveles, XP, días de racha, monedas y gemas, tiers de rango y
  progreso por área van en **Plus Jakarta Sans** con cifras tabulares (`.kbv-num`) — geométricas y
  amables, deliberadamente **no** en monoespaciada, para que la gamificación no se lea cuadrada ni
  «gamer». Que sean significativos: nada de estadísticas decorativas.
- **Emoji:** **con moderación y solo en momentos lúdicos** del producto, no como convención del
  sistema. El CTA de onboarding vivo es *«¡Listo, vamos! 🚀»* — un solo emoji celebratorio en una
  acción de éxito está en marca; emoji como íconos o viñetas **no**.
- **Puntuación:** los signos de exclamación se permiten y se agradecen en momentos de aliento
  (*«¡Cuenta creada!»*, *«¡Listo, vamos!»*) — este es el registro cálido y gamificado, lo opuesto a
  una herramienta corporativa acartonada.

---

## Fundamentos visuales

El estilo completo, respondido en concreto. Todo vive en `colors_and_type.css`.

### Ánimo general
Luminoso, limpio, amable — un dashboard de productividad **claro** con la calidez y los ciclos de
recompensa de un juego móvil (energía Duolingo / Habitica), sostenido por un acento **teal** sereno.
Lienzo tranquilo, tarjetas nítidas, y golpes de color saturado de gamificación (rojo de HP, oro de
moneda, azul de gema, naranja de racha) exactamente donde viven el progreso y las recompensas. Debe
sentirse *alentador y ordenado*, nunca ruidoso.

### Color
- **Claro por defecto.** El lienzo es blanco puro `--kb-canvas #FFFFFF`; la app se asienta sobre un
  `--kb-surface #F7F8FA` suave con `--kb-surface-2 #EEF1F5` para zonas hundidas. (El tema oscuro está
  decidido pero es un requerimiento aparte — ver Salvedades.)
- **Un solo acento de marca: teal — *progreso sereno*.** `--kb-primary #1CA4A0`, hover `#178F8B`,
  lavado suave `#E4F4F3`, tinta profunda `#0F6E6B`. El XP espeja el primario (`--kb-xp` = teal). Usa
  teal para la acción principal, el foco, el progreso y el «tú/ahora». Una sola acción teal por vista.
- **Paleta de gamificación**, la capa saturada del sistema, cada color con un significado:
  HP/jefe `#E64545`, moneda `#F4B740`, materia oscura `--kb-dark-core #171A2E`, llama de racha
  `#FF7A45`, XP teal `#1CA4A0`. **La palabra «gema» ya no existe en la interfaz**: la segunda divisa
  es **materia oscura**, contada en **fragmentos**, con su propia familia `--kb-dark-*`.
- **Cinco áreas de vida**, recoloreables por el usuario pero que salen así: Vigor `#EF4444`,
  Sabiduría `#3B82F6`, Riqueza `#EAB308`, Comunidad `#A855F7`, Voluntad `#06B6D4`.
- **Cinco prioridades** (orden fijo): urgente `#E64545`, alta `#F4811F`, media `#F4B740`,
  baja `#6E8CF2`, muy baja `#9CA3AF`.
- **Texto:** tinta `#1A1A2E` (tira a azul marino, no es negro puro), secundario y terciario `#6B7280`
  (AA 4.83:1 sobre blanco — el valor canónico; el `#9CA3AF` del código vivo no pasa AA y está
  deprecado).
- **Regla de texto sobre color.** El texto chico nunca se asienta sobre un relleno de marca o de
  gamificación. Los colores saturados se usan como acento, borde o ícono, con el texto sobre una
  superficie clara en el tono `-ink` de ese color. Solo unos pocos aceptan texto blanco y solo en
  tamaños grandes (HP, jefe, gema, comunidad); el oro y el teal llevan **siempre** texto oscuro.
  `--kb-primary-ink` es el teal seguro para texto normal sobre blanco.
- **Cero degradados azul-morado, cero lavados de caramelo.** El color de gamificación se aplica en
  **rellenos planos, aros y barras** — no en teatro de degradados. (Las portadas cosméticas de la
  Vitrina son el **único** lugar sancionado para degradados ricos, porque son decoración que el
  usuario compró.)

### Tipografía
**Dos familias, no tres.** La mono se retiró: su trazo cuadrado peleaba con los radios suaves.

- **Plus Jakarta Sans** (700/800) — display y encabezados. Una grotesca geométrica amable; carga la
  personalidad accesible-pero-cuidada. El tracking de display es **cerrado** (`-.02em`); los titulares
  quieren ser grandes y seguros.
- **Inter** (400–700) — todo el texto de UI y cuerpo. Neutra, legible, se lleva bien con Jakarta.
- **Plus Jakarta Sans · rol etiqueta** (`--kb-f-label`, peso 700) — cejillas, etiquetas de barra e
  índices. **Minúscula, 11px**, tracking casi nulo (`.01em`): nunca MAYÚSCULAS con tracking amplio.
  Los **números y estadísticas** también van en Jakarta con `font-variant-numeric: tabular-nums`,
  para que los contadores queden alineados pero se sientan suaves y amables, no mecánicos.
- **Escala nombrada de 9 pasos**, px: `2xs 10 · xs 11 · sm 12 · md 13 (base) · lg 15 · xl 18 ·
  2xl 22 · 3xl 26 · 4xl 34`. **El piso duro de legibilidad es 10px** — nunca micro-texto de 9px. Los
  pasos `xl`–`4xl` tienen variantes fluidas con `clamp()`.

### Espaciado, radios, bordes
- **Rejilla de 2px.** Rampa `2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24` (`--kb-sp-1`…`9`). `sp-1`–`6`
  son fijos; `sp-7`–`9` son fluidos con `clamp()`. El gap y densidad por defecto es **12px**.
- **Radios suaves.** `--kb-r-xs 8 · sm 10 · md 14 · lg 18 · xl 24 · pill 999`. Las esquinas son
  generosas y amables — es un sistema redondeado y accesible, lo opuesto al brutalismo. Los radios
  crudos están **prohibidos** en componentes; siempre los tokens.
- **Bordes de un pelo.** `--kb-border #E8ECF0` es el divisor de trabajo; `--kb-border-strong
  #D6DCE3` para énfasis, `--kb-border-soft #F0F2F6` para susurros. Las tarjetas llevan borde **y**
  sombra (suave, no plana).

### Elevación y efectos
- **Escala de sombra suave.** `--kb-sh-1` (tarjeta en reposo) → `--kb-sh-2` (elevada) → `--kb-sh-3`
  (levantada) → `--kb-sh-pop` (popovers, menús, diálogos). Todas son sombras azul-marino de baja
  opacidad — gentiles, nunca duras.
- **Elevación dura tipo Duolingo** solo en el botón primario: un borde inferior sólido de 2px
  (`0 2px 0` en la tinta oscura del primario) contra el que el botón se **hunde** en `:active` — el
  pulsado táctil y juguetón. Esto vive **fuera** de la escala de sombra suave.
- **Cero neumorfismo, cero cristal o escarcha** más allá del backdrop ocasional de un header
  pegajoso. La transparencia es para bordes, rellenos de hover y lavados de color — no para paneles
  translúcidos.

### Movimiento y estados
- **Cálido pero rápido.** Duraciones nombradas `fast 120 · base 200 · slow 300 · slower 400` ms;
  eases `standard cubic-bezier(.4,0,.2,1)`, `out`, `in`. Los momentos de recompensa pueden usar un
  pop celebratorio breve; la UI diaria es tranquila. **`prefers-reduced-motion` es obligatorio** y
  con él sobreviven **solo las animaciones de `kibo/*`**; todo lo demás se corta.
  El catálogo completo, con nombre `dominio/objeto/acción`, está en `preview/animaciones.html`.
- **Hover:** los botones oscurecen a su tono `-hover`; las tarjetas ganan un borde
  `--kb-border-strong` (el tratamiento decidido) o suben un paso de sombra; los enlaces van a
  `--kb-primary-ink`.
- **Pulsado:** el botón primario se desplaza **2px hacia abajo** contra su borde inferior duro
  (pulsado marcado, táctil). Los demás controles oscurecen. Nada de encogerse por escala.
- **Foco:** un **halo** suave de marca — aro de `--kb-primary` a baja opacidad alrededor de un borde
  sólido, con `:focus-visible` (espeja el `ring-[3px]` de shadcn).

### Tarjetas y regla de acento
Con borde (`1px var(--kb-border)`), rellenas de `--kb-card #FFFFFF`, **radio suave** (`--kb-r-lg`
18px), **sombra suave** (`--kb-sh-1`, que sube a `sh-2` o a borde fuerte en hover).

**Prohibida la franja de color en una sola orilla.** Un `border-left: 3px solid var(--c)` es el
recurso más repetido de la v1 y el que la hace ver genérica. El acento se comunica por superficie,
glifo o pastilla — nunca por una orilla. Los cuatro patrones aprobados están en
`preview/regla-acento.html`:

| Pieza | Patrón |
|---|---|
| Tarjeta grande (≥120px de alto) | **Banda de encabezado** tintada al 11% + regla inferior al 18% |
| Pieza compacta (tarea, fila, mini-card) | **Pastilla de área** tintada dentro · borde neutro 1px |
| Barra de cronograma o bloque de horario | **Barra sólida** en color de área, tinta legible dentro |
| Nota, cita, callout | **Fondo tintado al 6%** + glifo |

**Cuando compiten área y prioridad:** el **área pinta** (superficie, pastilla, glifo) y la
**prioridad marca** — medidor escalonado de tres barras, nunca un segundo color de fondo.

### Datos y gráficas
El lenguaje se midió del código real (`progress-charts.jsx`), no se eligió a ojo:

- **viewBox de 520 de ancho**, con `padL 40 · padR 16 · padT 16 · padB 26`
- **rejilla horizontal** en 0 / 50 / 100%: `var(--kb-border)` de 1px, punteada `3 4` al 60%, sólida
  en la base
- **etiquetas de eje** con `.kbv-chart-axis` — 10px, `--kb-text-3`
- **trazo principal de 2.4px**, remates redondos
- **relleno de área**: degradado vertical del color, de `.26` a `0`
- **números abreviados** con `fmtN()`: 1 240 → `1.2k`. Pero un **número protagonista** —el centro de
  un anillo, el valor de un medidor, el valor de un KPI— va **completo y con cifras tabulares**
- en gráficas delgadas (sparkline, celda de heatmap, barra de cronograma) el dato va **al lado**,
  porque dentro no cabe
- el SVG **manda su propia proporción**: `width="100%"` y alto automático, nunca alto fijo con
  `viewBox` de otra proporción — eso deja franjas muertas arriba y abajo

Las 12 gráficas del sistema: **6 vienen del código** (línea con proyección, barras, perfil semanal,
heatmap de constancia, gantt, filtro de periodo) y **6 las aporta el DS** en
`reference/app/charts-nuevas.jsx`, hablando ese mismo idioma. Dos de esas seis **ya se vendían en la
tienda sin existir**: el radar (`wg-radar`, 80 gemas) y la dispersión (`u-stats-pro`, 260 gemas).

Un **KPI** lleva siempre: etiqueta con glifo inline arriba, valor dominante, y un pie separado por
una regla con la comparativa contra el periodo anterior y el chip de estado. Sin sparkline ni barra
de meta en el KPI base.

---

## Iconografía

La taxonomía completa está en **[`docs/iconografia.md`](docs/iconografia.md)**.

- **Convención `dominio/nombre/variante`** — `area/vigor/solid`, `gamif/flame/line`,
  `accion/check/line`, `nav/home/line`, `dato/calendar/line`, `animo/mood-great/line`. La variante es
  `line` (trazo, predeterminada) o `solid` (relleno, solo dentro de un contenedor de color).
- **KIcon es el sistema de íconos de Kibo.** Un `switch` por nombre (`reference/app/icons.jsx`) que
  devuelve SVG de trazo lineal con `currentColor`. La auditoría del proyecto lo ratificó como set
  oficial: es más específico del producto que un set genérico. **Lucide se usa solo en las tarjetas de
  este design system**, como sustituto visual para no reimplementar KIcon aquí
  (`<script src="https://unpkg.com/lucide@latest"></script>` + `lucide.createIcons()`).
- **Reglas de trazo.** Solo íconos de trazo, `currentColor`, dimensionados al texto: **2px** a 22px y
  más, **2.4px** a 16px o menos para que no se adelgacen. El glifo mide **1.15× el texto** que
  acompaña y **nunca excede su contenedor**. Los íconos heredan el color del texto y solo toman un
  color de gamificación cuando viven dentro de un elemento de ese color.
- **Tamaños:** 12 (dentro de pastillas) · 16 (filas, metadatos) · 18 (nav) · 22 (glifo de área, KPI)
  · 32 (héroe de módulo, estado vacío).
- **Nunca se rellenan** los íconos, ni se hacen bicolor, con dos excepciones: los glifos de **moneda
  Kibo** y **materia oscura** son objetos de marca rellenos a propósito, no íconos de UI.
- **Contenedores permitidos:** círculo, cuadrado de radio 4 y squircle. El usuario puede cambiar el
  glifo, el color del glifo, el color de fondo y la forma del contenedor — nada más. Toda combinación
  se valida contra la regla de texto sobre color.
- **Emoji:** solo como florituras lúdicas ocasionales del producto (el `🚀` del onboarding), nunca
  como iconografía del sistema ni como viñetas.
- **Marcas de marca** (en `assets/`): `kibo-mascot.svg` / `kibo-mark.svg` (la cara del blob KIBO) y
  `kibo-wordmark.svg` (blob + «Kibo»). Son respaldos estáticos; el KIBO **vivo y animado** está en
  `preview/kibo-mascot.html`.

> **Sustitución declarada:** las tarjetas de este design system dibujan con **Lucide** porque KIcon
> es un componente React y estas tarjetas son HTML plano. El set real vive en
> `reference/app/icons.jsx` — úsalo en cualquier código de producto. Faltan por implementar en KIcon:
> `play`, `mood-neutral`, `mood-bad`.

---

## KIBO — la mascota

El logo de Kibo **no es una «K»**: es **KIBO**, un blob teal translúcido y vivo (RF-19) que
parpadea, flota y **se transforma según la actividad**.

- **Cuerpo plano en 2D** — sin sombreado 3D, sin degradado, sin halo — para que se lea como parte de
  la UI. Ojos grandes ovalados con un solo reflejo redondo; cejas de arco suave del ancho de los
  ojos, presentes solo cuando aportan; boca de arco con extremos redondeados, sin puntas. La cara se
  recorta con la silueta del cuerpo, así que nada se desborda cuando se aplasta.
- **El ánimo cambia el color; la actividad cambia la forma.** **Ocho ánimos** derivados del **HP** —
  no se eligen a mano (`preview/kibo-moods.html`): *Tranquilo* teal `--kb-primary` · *Feliz* verde
  `#10B981` · *Celebra* cyan `--area-will` · *Travieso* morado `#8B5CF6` · *Enfocado* azul
  `--area-wisdom` · *Sorpresa* ámbar `#F59E0B` · *Cansado* gris `#94A3B8` · *Triste* azul-gris
  `#7C8DB5` (*reencauza*, nunca avergüenza). Familia de tokens `--kb-mood-*`; tinta de la cara
  `--kb-ink-kibo #08302E`. Los cambios de color son gradientes de ~240ms, no saltos.
- **Vive solo.** **14 travesuras** en su repertorio (voltearse, aplastarse, globo, gota, saludo,
  señalar, chocar, aplaudir, beso, mueca, bostezo, guiño, mareo, zumbido), más las que exigen un
  juguete equipado (patada, cantar, mirar). Solo ocurren con `idle`; la personalidad *Sereno* es
  quieta de fábrica y los comportamientos se compran.
- **Dos manitas-burbuja** («manopies») orbitan separadas del cuerpo, se ocultan en reposo y salen
  solo con el gesto que las usa: saludar, señalar, chocar los cinco, aplaudir.
- **Presencia:** flotante fijo **abajo a la derecha**, dentro de una **canaleta** que `.kbv-main`
  reserva (`--kbb-gutter`, 150px) para que nunca tape contenido. Mínimo renderizado **132px** — por
  debajo la cara deja de leerse; las marcas de logotipo se declaran `asMark` y quedan fuera del piso.
- **Al tocarlo** hace una travesura. La rueda de acción rápida se abre aparte: un **disco completo de
  sectores** estilo GTA V — se apunta con la dirección del cursor, zona muerta en el cubo, hasta 13
  destinos, segundo nivel con las acciones del rubro, y paginación de 8 en 8 solo por legibilidad.
  **Arrastrar sobre KIBO** le hace un chipote de gel que rebota al soltar.
- **Celebración discreta:** KIBO reacciona **más** un toast con la recompensa (con «Deshacer» 5.6s).
  Nada de confeti a pantalla completa.

---

## Salvedades — leer antes de producir

- **Canónico contra código vivo.** Los tokens de aquí siguen el **spec canónico** (teal, Jakarta,
  radios suaves), al que el `:root` de `apps/web` **todavía no migra** (sigue con los valores de
  shadcn: turquesa, Geist, degradado índigo). Si editas producción, cuenta con hacer la migración
  SAN-14 / SAN-29; si diseñas artefactos, usa estos tokens directamente.
- **Deuda técnica heredada.** 841 radios crudos y 0 usos de `var(--kb-r-*)`; 43 `!important`; 617
  selectores de 4+ niveles de anidación; 170 `:hover` pero 0 estados de `loading` y 0 de `error`; tres
  íconos declarados pero sin implementar (`play`, `mood-neutral`, `mood-bad`). El detalle y el orden
  de ataque están en `docs/reconstruccion.md`.
- **Las fuentes son de Google Fonts** (Plus Jakarta Sans, Inter, Plus Jakarta Sans), cargadas por
  `@import` — ninguna está copiada. Para un build offline, baja los WOFF2 a `fonts/` y cambia a
  `@font-face`.
- **Íconos.** Lucide sustituye al set propio KIcon (declarado arriba).
- **KIBO es una propuesta autoral.** No había arte oficial de KIBO en los repos (el layout de
  marketing solo escribe el texto «Kibo»). El blob animado, sus ojos, las transformaciones por
  actividad, la rueda de acciones y el modo lectura son una interpretación de la dirección de
  producto más tus bocetos. Trátalo como v1 y refínalo con el arte oficial cuando exista.
- **Las imágenes son placeholders** — no se incluye fotografía de producto; los UI kits usan bloques
  planos o slots donde van portadas, pósters y avatares.
- **El tema oscuro está decidido pero pendiente.** Es un requerimiento aparte, bloqueado por el cero
  literal de marca.

---

## Índice — qué hay en este proyecto

### Raíz
| Archivo | Qué es |
|---|---|
| `README.md` | Este archivo — contexto, voz, fundamentos visuales, iconografía, salvedades |
| `colors_and_type.css` | **La fuente de verdad.** Todos los tokens (color, gamificación, áreas, prioridades, familias tipográficas y escala de 9, radios, sombras, espaciado de 2px, z-index, movimiento) + las clases de tipo `.kbv-*` |
| `styles.css` | Hoja global que el compilador del design system lee |
| `kbv-components.css` | Las clases de componente del prototipo real (`kbv-btn`, `kbv-card`, `kbv-chip`, `kbv-modal`, `kbv-kpi`, HUD, formularios…) con los tokens re-apuntados a la capa canónica |
| `SKILL.md` | Manifiesto de Agent Skill para usar este sistema como skill descargable de Claude |
| `thumbnail.html` | Mosaico del sistema en la portada |

### `docs/` — decisiones y auditorías
| Archivo | Qué es |
|---|---|
| `reconstruccion.md` | Plan v2: 15 secciones, método, reglas transversales, deuda técnica |
| `auditoria-contornos.md` | Los 58 selectores con franja de acento y su patrón de reemplazo |
| `iconografia.md` | Taxonomía `dominio/nombre/variante`, tamaños, personalización |

### `assets/` — marcas
| Archivo | Qué es |
|---|---|
| `kibo-mascot.svg` | Cara del blob KIBO (marca estática) |
| `kibo-mark.svg` | Marca del blob KIBO (la que va en app y nav) |
| `kibo-wordmark.svg` | Blob KIBO + «Kibo» en lockup |
| `kibo-axolotl.png`, `kibo-mascot-art.png` | Arte del ajolote del prototipo anterior |

> Los íconos son **Lucide**, desde CDN (no copiados). Ver *Iconografía*.

### `reference/` — el prototipo v1
20 archivos con la fuente real de Kibo v1: `dashboard-v2.jsx`, `areas-v2.jsx`, `areas-screen.jsx`,
`personal-screens.jsx`, `widgets-v2.jsx`, `modals-v2.jsx`, `onboarding-v2.jsx`, `auth-v2.jsx`,
`prestige-system.jsx`, `streak-system.jsx`, `achievements.jsx`, `vitrina.jsx`, `icons.jsx`,
`mascot.jsx`, `ds-live.jsx`, `ds-decisions.jsx`, más `kibo-app.css`, `kibo-extras.css`,
`kibo-chrome.css`, `kibo-fonts.css`. **Es la verdad de campo** — léelo antes de recrear una pantalla.

### `components/` — primitivas del bundle
- **KbButton** — primario / secundario / ghost / danger / link (pulsado duro en el primario)
- **KbCard** — tarjeta base; variante `boss` tintada; estado `hover` elevado
- **KbChip** — chip de filtro con punto opcional de área o prioridad
- **KbStatPill** — pastilla de moneda / gema / racha / HP / XP con glifos de marca
- **KbEmblem** — escudo por material de rango (bronce → damasco), con estado `locked`

### `preview/` — tarjetas del design system
Especímenes registrados en la pestaña Design System. Los de gamificación usan **los valores reales
del prototipo**: `ranks.html` (20 rangos en 9 materiales), `emblems.html` y `prestige.html`
(prestigios 1–16 y transiciones), `achievements.html` (ganado / progreso / secreto / oculto y
rarezas), `trophies.html` (trofeos mensuales y estandartes), `reto-cards.html`, `habits.html`,
`progress-bars.html`, `streak.html` y `streak-hud.html`, `vitrina.html`, `kibo-mascot.html` y
`kibo-moods.html`, `regla-acento.html` (los 4 patrones aprobados) y `animaciones.html` (el catálogo).

### `ui_kits/` — el producto
| Kit | Qué es |
|---|---|
| `ui_kits/app/` | La **experiencia gamificada** — header HUD, progreso por área, hábitos y retos del día, KPIs, llama de racha, emblemas de rango y prestigio, logros, la Vitrina. El corazón de la marca. |
| `ui_kits/web/` | **Marketing, auth y onboarding** — hero de landing, tarjetas de registro e inicio, y el flujo *«Configura tu Personaje»*, reconciliados a los tokens canónicos. |

Cada kit tiene su `README.md` con el mapa de componentes.

No se proporcionó plantilla de presentación, así que no hay `slides/` — pídelo si quieres un sistema
de deck para Kibo.

---

## Mapa del proyecto
```
kibo-design-system/
├── README.md                  ← estás aquí
├── SKILL.md                   ← manifiesto de Agent Skill
├── colors_and_type.css        ← todos los tokens + clases de tipo .kbv-*
├── styles.css                 ← hoja global del compilador
├── kbv-components.css         ← clases de componente del prototipo
├── docs/                      ← plan de reconstrucción y auditorías
├── assets/                    ← marcas y arte
├── reference/                 ← fuente real de Kibo v1 (verdad de campo)
├── components/                ← primitivas del bundle
├── preview/                   ← tarjetas espécimen del design system
└── ui_kits/
    ├── app/                   ← recreación del dashboard gamificado
    └── web/                   ← marketing, auth y onboarding
```
