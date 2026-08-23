# Catálogo de visualizaciones · los 38 tipos contra Kibo

> Referencia: `uploads/catalogo-visualizaciones.html` — 38 tipos en 5 secciones.
> Aquí cada uno tiene veredicto: **existe**, **se agregó**, o **no aplica y por qué**.

## Resumen

| | Cuántos |
|---|---|
| Ya existían en el código | 6 |
| Aportados por el DS · primera tanda | 6 |
| Aportados por el DS · esta tanda | 11 |
| **Total disponible** | **23** |
| Descartados con razón | 15 |

El criterio no es «¿se puede dibujar?» sino **«¿Kibo tiene este dato?»**. Un tipo sin dato que lo
alimente es peso muerto en el sistema: alguien lo va a usar con datos inventados.

---

## Existían · 6

| Tipo del catálogo | En Kibo | Fuente |
|---|---|---|
| Gráfico de barras | `BarsChart` | `progress-charts.jsx` |
| Gráfico de líneas | `LineChart` — con proyección punteada | ídem |
| Gráfico de área | `LineChart area` | ídem |
| Mapa de calor · calendario de actividad | `ConsistencyHeatmap` — 5 niveles, con leyenda | ídem |
| Diagrama de Gantt | `kb-gantt.jsx` | módulo propio |
| — (no está en el catálogo) | `WeekdayBars` · perfil por día de la semana | `progress-charts.jsx` |

## Aportados · primera tanda · 6

`reference/app/charts-nuevas.jsx`

| Tipo | Componente | Nota |
|---|---|---|
| Gráfico de radar | `RadarChart` | **Se vendía sin existir**: `wg-radar`, 80 gemas |
| Diagrama de dispersión | `Scatter` | **Se vendía sin existir**: `u-stats-pro`, 260 gemas |
| Gráfico circular · dona | `Donut` | Máximo 4 partes |
| Gráfico de embudo | `Funnel` | Trapecio |
| — | `Gauge` · medidor de 180° | El pariente del *bullet chart* |
| — | `HBars` · barras horizontales | Ranking con nombres largos |
| — | `Sparkline` | Dentro de un KPI |
| — | `StackedBars` · barra apilada | Reparto por periodo |

## Aportados · esta tanda · 11

`reference/app/charts-catalogo.jsx`

| Tipo del catálogo | Componente | Qué dato de Kibo lo alimenta |
|---|---|---|
| Cascada · *waterfall* | `Waterfall` | Saldo de monedas y gemas: de dónde salió, en qué se fue |
| Treemap | `Treemap` | Reparto de XP o tiempo entre 5+ áreas |
| Sunburst | `Sunburst` | La jerarquía propia: **área → proyecto** |
| Sankey · alluvial | `Sankey` | ¿A dónde se va el tiempo? Franja del día → actividad |
| Gráfico de bala | `Bullet` | Varias metas seguidas, cada una con su objetivo |
| Gráfico de pendiente | `Slope` | Nivel por área: mes pasado contra este |
| Gráfico combinado | `Combo` | XP en barras + racha en línea |
| Histograma | `Histogram` | Duración de sesiones de foco |
| Diagrama de caja | `BoxPlot` | «¿Qué tan parejo soy?» — va con `u-stats-pro` |
| Rosa polar | `PolarRose` | Hora del día en 24 sectores |
| Gráfico de burbujas | `Bubbles` | Esfuerzo × impacto × frecuencia de un hábito |

## Descartados · 15

No es pereza: **ninguno tiene dato en Kibo**, o su lectura exige un contexto que la app no da.

| Tipo | Por qué no |
|---|---|
| Dispersión 3D · Superficie 3D · Trayectoria 3D | Kibo no tiene una tercera dimensión espacial. Un 3D sobre datos planos **estorba la lectura**: oclusión y perspectiva falsean la comparación |
| Diagrama isométrico | Decoración arquitectónica; no hay plano ni edificio que representar |
| Gráfico de velas · OHLC | Requiere apertura, cierre, máximo y mínimo por periodo. El saldo de Kibo no se registra así |
| Mapa coroplético | No hay dato geográfico por región |
| Gráfico ternario | Tres proporciones que suman 100%. Las áreas son **cinco**, no tres |
| Hexbin | Densidad para decenas de miles de puntos. Un usuario no genera ese volumen |
| Diagrama de red · Cuerdas · Dendrograma | Relaciones entre nodos. La sección de amigos es una **lista**, no un grafo |
| Coordenadas paralelas | Potente y **ilegible sin interacción de filtro**; el radar ya cubre el perfil multivariable |
| Gráfico de violín | La caja ya responde lo mismo con menos carga |
| Stream graph | Variante estética de la apilada; no agrega lectura |
| Marimekko · mosaico | Dos categóricas con participación. Poco frecuente y difícil de leer bien |
| Nube de palabras | El tamaño del texto **no es medida confiable**; el diario tiene mejores lecturas |

---

## Reglas que salieron de construirlas

**El `viewBox` decide dónde puede vivir la gráfica.** Las de eje llevan `viewBox` de 520 de ancho: en
media columna (~300px) sus etiquetas de 10px escalan a ~6px y **rompen el piso de legibilidad**. Por
eso van a **ancho completo**. Solo las de `viewBox` propio y compacto —radar 200, anillo 180, medidor
200, treemap 340, sunburst 224, rosa polar 200— pueden ir en pareja, y se **acotan con
`max-width`** para que no crezcan hasta ocupar toda la altura del panel.

**El SVG manda su proporción.** `width="100%"` y alto automático. Un alto fijo con un `viewBox` de
otra proporción deja franjas muertas arriba y abajo.

**`fmtN()` es para ejes, no para titulares.** El centro de un anillo, el valor de un medidor y el de
un KPI van **completos y con cifras tabulares**. «1k» en lugar de 1 040 pierde el dato justo donde
más se mira.

**Sobre un tinte de color, la tinta oscura de verdad.** `color-mix(teal 78%, negro)` nunca alcanza
4.5:1 contra un tinte del mismo teal al 25–58% — aclarar el fondo aclara el texto en la misma
proporción y el contraste no mejora. Se usa `var(--kb-text)`.

**La unidad va por renglón, no por gráfica.** En la bala, «7/9 XP» es falso cuando ese renglón cuenta
hábitos. Cada fila declara la suya.

**Lo que se calcula, se calcula.** La línea de tendencia de la dispersión sale por mínimos cuadrados.
Una tendencia trazada a ojo es una afirmación sin respaldo.

**El área es el dato, así que el radio va por raíz.** En las burbujas, escalar el radio linealmente
exagera la diferencia al cuadrado.

**Reservar el radio por dentro.** Las burbujas se cortaban contra el borde superior: el área de trazo
descuenta el radio mayor en los cuatro lados.
