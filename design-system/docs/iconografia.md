# Taxonomía de íconos

> Extraída de `reference/app/icons.jsx` — el set real del producto.
>
> **KIcon es el set de íconos de Kibo**, no Lucide. Es un `switch` por nombre que devuelve SVG de
> trazo lineal con `currentColor`. La auditoría del proyecto lo confirma como sustitución oficial:
> es más específico del producto que un set genérico. **Lucide se usa solo en las tarjetas de este
> design system**, como sustituto visual para no reimplementar KIcon aquí.
>
> Dos glifos viven aparte de KIcon porque son **objetos de marca rellenos**, no íconos de UI:
> la **moneda Kibo** (plana, con la «K» acuñada) y la **materia oscura** (fragmento facetado).

## Convención

```
dominio / nombre / variante
```

**Dominio** dice de qué habla el ícono. **Nombre** es el glifo. **Variante** es `line` (trazo, el
predeterminado) o `solid` (relleno, solo dentro de un contenedor de color).

```
area/vigor/solid        gamif/flame/line       accion/check/line
nav/home/line           dato/calendar/line     animo/mood-great/line
```

**Regla de trazo.** Trazo lineal de 2px a 22px y más; **2.4px** a 16px o menos, para que no se
adelgace. El glifo mide **1.15× el tamaño del texto** que acompaña y nunca excede su contenedor.

**Contenedores permitidos.** Círculo, cuadrado de radio 4 y squircle. El usuario puede cambiar el
glifo, el color del glifo, el color de fondo y la forma del contenedor — nada más.

## Dominios

### `area/` — 5 íconos

Identidad de las 5 áreas de vida. Relleno sólido en glifo de contenedor; el usuario puede recolorear.

`area/vigor` · `area/wisdom` · `area/wealth` · `area/community` · `area/will`

### `gamif/` — 8 íconos

Progresión y recompensa: rangos, prestigio, rachas, retos, boss. Nunca para acciones de UI.

`gamif/flame` · `gamif/sparkle` · `gamif/sword` · `gamif/crown` · `gamif/trophy` · `gamif/shield` · `gamif/target` · `gamif/gauge`

> **Falta implementar:** `swords`, `medal`, `star`

### `nav/` — 11 íconos

Navegación y estructura: nav lateral, pestañas, encabezados de módulo.

`nav/home` · `nav/list` · `nav/layers` · `nav/folder` · `nav/shop` · `nav/user` · `nav/settings` · `nav/grip` · `nav/pin` · `nav/chart` · `nav/bar-chart`

### `accion/` — 11 íconos

Verbos que el usuario ejecuta. Siempre acompañan un objetivo táctil de 44px o más.

`accion/plus` · `accion/check` · `accion/x` · `accion/edit` · `accion/trash` · `accion/upload` · `accion/repeat` · `accion/arrow-left` · `accion/arrow-right` · `accion/camera` · `accion/mic`

> **Falta implementar:** `play`, `scissors`

### `dato/` — 9 íconos

Metadatos de una entidad: fecha, hora, tendencia, prioridad, visibilidad.

`dato/trending-up` · `dato/clock` · `dato/calendar` · `dato/flag` · `dato/alert` · `dato/eye` · `dato/eye-off` · `dato/chart` · `dato/bar-chart`

### `medio/` — 11 íconos

Tipo de contenido en acervo, lectura y widgets. Nunca como acción.

`medio/image` · `medio/tablet` · `medio/phone` · `medio/laptop` · `medio/tv` · `medio/film` · `medio/cloud` · `medio/headphones` · `medio/book` · `medio/book-open` · `medio/graduation`

### `animo/` — 5 íconos

Registro de ánimo en el diario y ánimo de Kibo. Escala de 7, no se mezcla con gamif.

`animo/mood-great` · `animo/mood-good` · `animo/mood-meh` · `animo/mood-low` · `animo/mood-sad`

> **Falta implementar:** `mood-neutral`, `mood-bad`

### `economia/` — 2 íconos

Monedas, gemas, ahorro. `coin` y `gem` viven aparte de KIcon (tienen su propio SVG con gradiente).

`economia/piggy` · `economia/square`

> **Falta implementar:** `coin`, `gem`

### `marca/` — 2 íconos

Logos de terceros para inicio de sesión social. Nunca se recolorean.

`marca/google` · `marca/microsoft`

## Cobertura

**77 de 77 nombres del código están catalogados.** Auditado comparando los `case` de
`reference/app/icons.jsx` contra los nombres listados en las tarjetas del grupo `04 · Íconos`.

Los 9 que estaban sin dominio se ubicaron **siguiendo a su consumidor real en el código**, no por
parecido de forma:

| Glifo | Dominio | Consumidor citado |
|---|---|---|
| `picture`, `image-up` | `medio/` | Ver y subir imagen |
| `arrow-left`, `arrow-right` | `accion/` | Verbos de navegación |
| `bar-chart` | `dato/` | Va con `chart` y `trending-*` |
| `square` | `accion/` | **Detener.** `running ? 'square' : 'play'` en pomodoro (`estudio-screen`, `personal-screens`, `widgets-catalog`), `transcribing ? 'square' : 'mic'` en dictado (`widgets-v2`, `widgets-v3`), y «Terminar sesión» en `screens-v2` |
| `moon` | `nav/` | Preset de tablero **«Noche»** en `dashboard-v2.jsx:1113`, junto a `sparkle` (Mañana) y `list` (Trabajo) |
| `droplet` | `kibo/` | Travesura **«Gota»** de la mascota en `kibo-blob.jsx:46` — «se escurre como gel» |
| `heart` | `kibo/` | Objeto que KIBO sostiene en las reacciones `health` y `heal` de `kibo-vitals.jsx:56,61` |

### `kibo/` — 2 glifos

Glifos que consume **la mascota**, no la UI: formas de travesura y objetos que sostiene. Nunca se
usan como ícono de interfaz.

`kibo/droplet` · `kibo/heart`

## Los tres glifos rellenos

La regla es trazo. Hay **tres excepciones**, todas justificadas:

| Glifo | Por qué se rellena |
|---|---|
| `coin` | Objeto de marca — la moneda es una cosa, no un símbolo |
| `gem` (materia oscura) | Objeto de marca, misma razón |
| `square` | Es el control de **detener**. Un cuadro de trazo no se lee como botón de alto — el relleno es la convención de los controles de reproducción |

## Los 6 que el DS agregó · CERRADO

`icons.jsx` declaraba seis nombres que no dibujaba. Ya están, en
`reference/app/kicon-faltantes.jsx`.

**El set real gana siempre.** El parche le pregunta a `KIcon` **primero**; solo si devuelve `null`
—o sea, el nombre está declarado pero sin dibujo— entra el glifo del DS. El día que `icons.jsx` los
implemente, el parche se apaga solo para ellos, sin que nadie edite nada. Un nombre que no existe en
ninguno de los dos sigue devolviendo `null`: el parche no inventa glifos.

La marca morada de las tarjetas **se deriva de eso**, con `kiconIsFromDS(nombre)` — no de una lista
teclada. Cuando el set los implemente, la marca se apaga con el parche.

Están dibujados con el mismo patrón que sus vecinos: `viewBox="0 0 24 24"`, `fill:none`,
`stroke:currentColor`, remates redondos, pupilas como `<circle r="0.8" fill="currentColor">`.

| Glifo | Dominio | Referencia de estilo | Por qué así |
|---|---|---|---|
| `play` | acción | `square` | **Relleno**, igual que `square`: un triángulo de trazo no se lee como botón de iniciar. Son pareja — arrancan y detienen |
| `scissors` | acción | `x` + `grip` | Dos aros y dos hojas cruzadas |
| `mood-neutral` | ánimo | `mood-meh` | Boca recta más corta que `meh`: cae entre `meh` y `low` |
| `mood-bad` | ánimo | `mood-sad` | Boca de **mueca en zigzag**. No repite el ceño de `sad` porque a 22px salían idénticos |
| `star` | gamificación | `sparkle` | Cinco puntas, trazo |
| `medal` | gamificación | `trophy` | Disco con cintas y aro interior. **Sin estrella dentro**: a 22px se emplastaba y duplicaba `star` |

En las tarjetas salen con **punto morado**, para que se vea qué aporta el DS y qué viene del set.

> `play` era el más urgente: su ausencia dejaba **vacío el botón de iniciar** del pomodoro y del
> detalle de Reto (A94 de tu auditoría).

**Cobertura: 77 de 77 nombres dibujados, cero huérfanos, cero declarados sin dibujo.**

## Tamaños

| Token | px | Dónde |
|---|---|---|
| `icon-xs` | 12 | Dentro de pastillas y chips mono |
| `icon-sm` | 16 | Filas de lista, metadatos, botones de ícono |
| `icon-md` | 18 | Nav lateral, encabezados |
| `icon-lg` | 22 | Glifo de área en tarjeta, KPI |
| `icon-xl` | 32 | Héroe de módulo, estado vacío |

## Personalización

| Propiedad | Opciones |
|---|---|
| Glifo | Cualquiera del dominio `area/` o `medio/` |
| Color del glifo | Blanco, tinta del área (`-ink`), o el color del área |
| Color de fondo | Los 5 colores de área + los 5 de prioridad + neutro (`--kb-surface-2`) |
| Forma del contenedor | Círculo · cuadrado radio 4 · squircle |

El color de fondo y el del glifo se validan contra la **regla de texto-sobre-color**: ámbar, amarillo,
teal y naranja llevan tinta oscura siempre; rojo, azul-gema y morado admiten blanco.
