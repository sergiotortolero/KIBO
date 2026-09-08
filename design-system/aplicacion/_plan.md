# Plan — de lo general a lo particular

Norte: la maqueta original, que corre en `reference/_correr.html` (servidor estático sobre
`design-system/`). Lo que sigue se comparó contra ella en vivo, no contra su código.

## 1. La jerarquía, confirmada — con un matiz que cambia el orden

La premisa es correcta y el prototipo la declara explícitamente en `AREA_HIER_V3`
(`areas-v2.jsx:123`): **cada área declara qué cuelga de ella**, y el hueco es polimórfico.

| Área | Lo que cuelga | Casa |
|---|---|---|
| Vigor | proyectos y metas físicas | Salud |
| Sabiduría | cursos, materias y lectura | Estudio |
| Riqueza | proyectos financieros | Finanzas |
| Comunidad | proyectos | — |
| **Voluntad** | **retos y hábitos** — «no hay proyectos» | Hábitos |

De ahí, cuatro cosas que ordenan todo lo demás:

- **La cadena es área → agrupador → tarea → subtarea.** El agrupador no siempre es un
  proyecto: en Sabiduría es un curso o una materia, en Riqueza un proyecto financiero. El
  inventario ya lo dice de otro modo: el detalle de curso está «homologado con Proyectos».
  Son la misma forma jugando el mismo papel.
- **Es jerarquía de agrupación y derivación, nunca de propiedad.** Ni el área ni el
  agrupador guardan nada suyo: el avance del proyecto se deriva de sus tareas — en la
  maqueta se ve como `8/14 · 56%`. Quien produce el hecho es la tarea.
- **El área es una propiedad de TODO hecho**, no solo de las tareas: los proyectos, los
  hábitos y los retos la llevan igual. Por eso el chip de área es un componente general de
  verdad, y no una pieza del módulo de Áreas.
- **Áreas es un centro de análisis, no un módulo con datos propios.** Esto reconcilia la
  premisa con la decisión ya tomada de que «Áreas no es un módulo»: es un destino en el
  menú y una vista transversal sobre hechos agrupados por área. Vista, no dueño.

**El matiz que corrige el orden propuesto:** hábitos y retos **son** la jerarquía de
Voluntad. Si se construyen después de Áreas, el detalle de Voluntad queda con un hueco.
La salida no es reordenar todo, sino separar el armazón de área de su contenido: se define
primero el contenedor con su hueco polimórfico, y cada tipo de hijo se llena en su segmento.

## 2. Correcciones a los componentes generales

Comparado en vivo contra la maqueta original. Van antes que cualquier pantalla nueva.

| # | Qué está mal en lo que publiqué | Qué dice el norte |
|---|---|---|
| G-1 | La taxonomía del menú es invención mía | Son cuatro grupos con nombre: **General** (Inicio, Mi progreso) · **Tu plan** (Tareas, Áreas, Proyectos, Finanzas) · **Tu constancia** (Hábitos, Retos) · **Tu bitácora** (Salud, Diario, Lectura, …). Áreas y Proyectos son hermanos, no hijos de Tareas |
| G-2 | Puse «Hoy» como destino | El destino se llama **Inicio**, y su contenido es un tablero de widgets |
| G-3 | Cabecera de página genérica | Saludo contextual por hora — «Buenas tardes, Mateo» — con la fecha en la migaja |
| G-4 | El tablero es estático | Tiene **pestañas por momento del día** (Mañana · Trabajo · Noche), «Explorar widgets» y «Editar dashboard» |
| G-5 | La barra de búsqueda solo busca | Es **«Buscar o registrar»**: superficie de captura, no solo de búsqueda |
| G-6 | KIBO es un botón flotante | Es **la mascota viva** abajo a la derecha, y de ahí sale su menú de acciones rápidas |
| G-7 | Faltan piezas generales que todo módulo repite | **Barra de filtros** (por área y por otro eje, con «Limpiar»), **fila de KPIs** con su comparativo, **columna de kanban** con conteo y límite de WIP, y **tarjeta con chip de área + avance derivado** |
| G-8 | El chip de área no existe como pieza | Es el componente más repetido del producto: lo llevan tareas, proyectos, hábitos y retos |

## 3. Orden de construcción

Cada segmento cierra con validación, commit y republicación del lienzo, para dar retro.

| # | Segmento | Por qué va aquí |
|---|---|---|
| 0 | **Componentes generales** — G-1 a G-8 | Todo lo demás los compone. Corregirlos después es corregirlos 53 veces |
| 1 | **Áreas** — armazón con su hueco polimórfico, y el centro de análisis | Es la vista más general; su hueco define el contrato de los agrupadores |
| 2 | **Proyectos y tareas** | El agrupador más común y el productor. Aquí se fija la tarjeta de proyecto y la fila de tarea |
| 3 | **Hábitos y retos** | Completan la jerarquía de Voluntad |
| 4 | **La plataforma** — amigos, familia, configuración, KIBO y su menú de acciones | El andamiaje ya está; esto lo envuelve |
| 5 | **El resto** — diario, estudio, lectura, salud, finanzas, tienda, bóveda | Cada uno es un tipo de hecho más, sobre vocabulario ya resuelto |
