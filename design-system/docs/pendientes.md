# Pendientes del Design System

> Lista única de lo que falta. Sustituye a las notas repartidas en otros docs.
> Estado al día de hoy: **59 tarjetas en 12 grupos**, 151 tokens, 2 familias tipográficas.
> Cero tarjetas arriba de 800px; todas con su altura declarada = altura medida.

---

## Cerrado

| Rubro | Cómo quedó |
|---|---|
| **Tipografía** | 2 familias (Jakarta + Inter). Se retiró JetBrains Mono: las etiquetas van en Jakarta minúscula, sin tracking. Piso duro de 10px, incluidas las etiquetas de espécimen |
| **Íconos · cobertura** | 77 de 77 dibujados. Los 6 que faltaban (`play`, `scissors`, `mood-neutral`, `mood-bad`, `star`, `medal`) están en `kicon-faltantes.jsx`. El parche **le pregunta al set real primero**: si algún día `icons.jsx` los implementa, se apaga solo y la marca morada con él |
| **Las gráficas** | 23 tipos: 6 del código + 17 del DS. Catálogo de 38 cruzado, 15 descartados con razón. Ver `docs/visualizaciones.md` |
| **Tamaño de tarjeta** | Cero arriba de 800px. Las 5 pasadas se partieron; 16 alturas declaradas corregidas contra medición real |
| **Numeración de grupos** | `01`–`12` sin huecos |
| **Íconos · taxonomía** | 9 dominios con consumidor citado en el código: `area`, `gamif`, `nav`, `accion`, `dato`, `medio`, `animo`, `marca`, `kibo`. Cero huérfanos |
| **Divisas** | Son personalizables: 7 skins reales de `prestigio-nombres.jsx`. Monta el `CurrencyGlyph` del proyecto |
| **Regla de acento** | Prohibida la franja en una orilla. 4 patrones aprobados; hábitos ya migrado |
| **Duplicación de tipo** | `.kbv-eyebrow`, `.kbv-meta` y `.kbv-num` estaban definidos en dos hojas con valores distintos. Una sola definición |
| **Heatmap gris** | Defecto de cascada encontrado por el DS y reparado. Ver `auditoria-duplicacion.md` |
| **Método de anatomía** | Validado con Hábitos: átomos → moléculas → organismo, con las dos pruebas (¿existe en el CSS? ¿es de este dominio?) |
| **KIBO** | 9 tarjetas montando los componentes reales: mascota, ánimos, animación por capas, travesuras, rueda, y las 3 de guardarropa |

---

## Abierto · por orden de impacto

### 1 · Anatomía de los 9 dominios que faltan

El método está validado, pero solo **Hábitos** está desglosado. Cada dominio necesita sus átomos
leídos del CSS, sus moléculas y su organismo.

| Dominio | Estado | Ya localizado |
|---|---|---|
| **Retos y boss** | Tiene tarjeta suelta, sin desglose | — |
| **Tareas y proyectos** | Pendiente | `.pri` (píldora mono) y `.area-chip` (punto de 6px), líneas 742 y 754 |
| **Datos: KPI e indicadores** | Gráficas listas; KPI e indicadores sin desglose | — |
| **Lectura y acervo** | Pendiente | — |
| **Salud** | Pendiente | — |
| **Finanzas** | Pendiente | — |
| **Economía: tienda, cofres** | Pendiente | — |
| **Perfil y social** | Pendiente | — |
| **Áreas de vida** | Pendiente | — |
| **Diario y foco** | Pendiente | — |

### 2 · Las gráficas · CERRADO

**23 tipos disponibles**: 6 del código, 6 de la primera tanda y 11 de la segunda, tras cruzar el
catálogo de 38 tipos que pasaste (`uploads/catalogo-visualizaciones.html`).

El criterio no fue «¿se puede dibujar?» sino **«¿Kibo tiene este dato?»**. Un tipo sin dato que lo
alimente es peso muerto: alguien lo usaría con datos inventados. **15 quedaron descartados con razón
escrita** — los tres 3D porque no hay tercera dimensión espacial y la perspectiva falsea la
comparación; velas porque no hay OHLC; coroplético porque no hay geografía; red, cuerdas y
dendrograma porque la sección de amigos es una lista y no un grafo.

**Las dos que la tienda ya cobraba sin existir** tienen tarjeta propia:

| Gráfica | Se vendía como | Precio |
|---|---|---|
| Radar de balance | widget `wg-radar` | 80 gemas |
| Dispersión | upgrade `u-stats-pro` | 260 gemas |

**Diez tarjetas en el índice 05 · Datos**, cada una con su decisión escrita, no solo el dibujo:
radar · dispersión · composición · medida y ranking · jerarquía · flujo · meta y cambio · combinado ·
distribución · ciclo y tres variables.

El mapeo completo de los 38, con veredicto por tipo, está en **`docs/visualizaciones.md`**.

**Seis defectos de diseño que salieron al construirlas:**

1. **El README describía un lenguaje que no era.** Decía «blocky: cero rejilla, el dato dentro de la
   forma». El código real **sí** tiene rejilla, ejes y degradados. Corregido con valores medidos.
2. **El `viewBox` de 520 rompía el piso de 10px.** En media columna, las etiquetas escalaban a ~6px.
   Regla nueva: las gráficas de eje van a **ancho completo**; solo las de `viewBox` compacto van en
   pareja, y se acotan con `max-width`.
3. **`fmtN()` no aplica a números protagonistas.** El anillo mostraba «1k» en lugar de 1 040.
4. **El embudo violaba la regla de texto-sobre-color** — dos veces. Primero con tinta oscura sobre
   teal saturado; después con `color-mix(teal 78%, negro)`, que **nunca** alcanza 4.5:1 contra un
   tinte del mismo teal: aclarar el fondo aclara el texto en la misma proporción.
5. **La unidad de la bala era por gráfica.** «7/9 XP» es falso cuando el renglón cuenta hábitos.
6. **Las burbujas se cortaban contra el borde.** El área de trazo no descontaba el radio mayor.

### 3 · Tamaño de tarjeta · CERRADO

Regla: **300–500px**, tope 800. **Cero tarjetas arriba de 800px.** Las cinco pasadas se partieron por
su corte natural, y las 45 se remidieron con arnés real:

| Antes | Se partió en |
|---|---|
| `logros` 970 | Logros y rarezas · Trofeos y estandartes |
| `glosario` 877 | Glosario · forma y texto · Glosario · color e interacción |
| `rueda` 876 | Rueda de acción rápida · Rueda · reglas de comportamiento |
| `kibo-animacion` 805 | KIBO · los 4 relojes base · KIBO · capas de animación |
| `niveles` 740 | Niveles · héroe y área · Niveles · las tres escalas y sus ciclos |

De paso se corrigieron **16 alturas declaradas** que no correspondían a la real — 10 recortaban
contenido (`niveles` escondía 260px, `divisas` 139px) y 6 dejaban blanco muerto.

### 4 · Matriz de estados

Decidida como obligatoria en 9 estados —`default`, `hover`, `focus`, `active`, `disabled`,
`loading`, `error`, vacío, sin permiso— pero **no hay ninguna tarjeta que la muestre**. El código
trae 170 `:hover` y **cero** `loading` y `error`.

### 5 · Deuda heredada del proyecto

Documentada, sin migrar:

| Punto | Hoy | Canónico |
|---|---|---|
| `--kb-primary` | verde `#4CAF82` en `:root` | teal `#1CA4A0` |
| `--kb-text-3` | `#9CA3AF` (2.6:1, no pasa AA) | `#6B7280` (4.83:1) |
| Radios | 841 crudos, 0 usos de `var(--kb-r-*)` | `xs8 sm10 md14 lg18 xl24 pill999` |
| `!important` | 43 usos | solo `prefers-reduced-motion` y overrides de container |
| Anidación | 617 selectores de 4+ niveles | máximo 3 |
| Clases de barra | 14 distintas para el mismo dibujo | una |
| Clases de chip | 18 distintas | una |
| Clases de KPI | 5 distintas | una |
| `.kbv-heatmap-scroll .hc` | repone `background` y borra el tinte | que declare solo medida y radio |

### 6 · Pantallas completas

Se pararon a propósito para hacer primero el catálogo atómico. Pendientes: **Hoy**, **Tareas**,
**Perfil**. Sin ellas el DS documenta piezas pero no cómo se arma una vista.

### 7 · UI kits desactualizados

`ui_kits/app` y `ui_kits/web` son de la primera pasada: traen tokens viejos, mono en las etiquetas y
la franja de acento prohibida. O se migran, o se retiran para que nadie los copie.

---

## Decisiones de producto que el DS no puede tomar

1. **El heatmap ignora `period`.** Su rango es fijo de 6 meses. ¿Lo respeta, o nunca lleva filtro?
2. **Casilla parcial ½** en hábitos: ¿aplica a todo hábito o solo a los de meta numérica?
3. **Protector de racha**: ¿átomo propio o estado de la llama?
4. **Las 8 gráficas que faltan**: ¿se proponen o solo se documenta el hueco?

## Regla de proceso · el alto se mide DESPUÉS de editar

Esta falla ya se repitió tres veces, y siempre por lo mismo: el alto declarado se mide, luego se
edita el contenido, y el número queda viejo. En la última vuelta agregar dos frases a una nota
empujó la sección siguiente 71px fuera del recorte — se perdió completa la decisión canónica del
átomo 2, que es justo lo que la tarjeta existe para publicar.

**El orden correcto es medir y escribir en la misma pasada.** Medir en un turno y declarar en otro
garantiza deriva.

Y hay que revisar en las dos direcciones. En la última medición de las 4 tarjetas de tareas:

| Tarjeta | Declarado | Real | Problema |
|---|---|---|---|
| `tareas-atomos` | 560 | 631 | recortaba **71px** |
| `tareas-atomos-estado` | 600 | 742 | recortaba **142px** |
| `tareas-moleculas` | 620 | 531 | sobraban 89px |
| `tareas-organismos` | 600 | 565 | sobraban 35px |

Las dos que sobraban venían de partir una tarjeta grande: heredaron una estimación en vez de una
medición. Un alto de más no corta nada, pero deja la tarjeta flotando en blanco y se ve descuidada.

**Cómo medir bien:** iframe de 700px de ancho y alto chico (200px), esperar a que React monte, y
tomar el `bottom` del último hijo visible del `body` más su relleno inferior. Forzar el iframe a un
alto grande hace que `scrollHeight` devuelva ese alto forzado y la medición no dice nada.
