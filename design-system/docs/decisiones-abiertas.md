# Decisiones abiertas · con su contexto

Cada una tiene: **qué se decide**, **por qué está abierta**, **las opciones con su consecuencia** y
**mi recomendación**. Si respondes solo «la B» en cada una, es suficiente.

---

## 1 · El piso táctil de los botones de ícono

**Qué se decide.** Tres botones de la v1 miden menos que el mínimo para tocarlos con el pulgar.

`--kb-touch-min` es **44px**. En el código:

| Botón | Línea | Mide |
|---|---|---|
| Registrar un hábito (`.kp-ok`) | `styles-extras.css:11095` | 32px |
| Corregir el número (`.kp-fix`) | `:11056` | 28px |
| Editar y borrar (`.ic-btn`) | `:3796` | 28px |

**Por qué está abierta.** Subirlos a 44px cambia el dibujo: un círculo de 44px junto a un nombre de
hábito de 13px se vuelve el elemento más pesado de la fila, y hoy la jerarquía es la correcta.

| Opción | Consecuencia |
|---|---|
| **A · Ampliar solo la zona de toque** | El dibujo no cambia; un `::after` transparente extiende el área a 44px. Ya está demostrado en «caí hoy» de `habitos-registro` |
| **B · Subirlos a 44px** | Cumple sin trucos, pero hay que rebalancear la fila: el nombre sube a 15px y el premio se mueve |
| **C · Dejarlo así** | Queda la deuda. En escritorio con ratón no molesta; en teléfono sí |

**Recomiendo A.** Es la única que cumple sin rediseñar, y aplica igual a los tres.

---

## 2 · La casilla parcial ½

**Qué se decide.** Si un hábito puede quedar «a medias».

**Por qué está abierta.** Hoy la casilla tiene 4 estados: vacía, marcada, parcial y fallada. La
parcial tiene sentido obvia en «Tomar 2 L de agua» —bebí 1 L—, pero en «Meditar» no: o meditaste o no.

| Opción | Consecuencia |
|---|---|
| **A · Solo hábitos con meta numérica** | La casilla parcial aparece únicamente donde hay una fracción real. Los de sí-o-no tienen 3 estados, no 4 |
| **B · Todo hábito** | Un hábito de sí-o-no también puede quedar a medias, y el usuario decide qué significa. Más flexible, más ambiguo |
| **C · Nunca** | Se simplifica a 3 estados. Pierdes el registro parcial, que es justo lo que evita romper una racha por un día flojo |

**Recomiendo A.** La fracción sale del dato, no del gusto: si el hábito tiene meta, tiene parcial.

---

## 3 · El protector de racha

**Qué se decide.** Si el protector es una pieza propia o un estado de la llama.

**Por qué está abierta.** Cuando un protector se consume, la racha **no se rompe** pero tampoco
avanza igual. Eso es información nueva que hay que mostrar en algún lado.

| Opción | Consecuencia |
|---|---|
| **A · Estado de la llama** | La llama cambia de aspecto —escudo encima, o color apagado— y no hay pieza nueva. El HUD no crece |
| **B · Átomo propio** | Un contador aparte de «protectores disponibles», visible siempre. Más claro, pero suma una pieza al HUD que ya carga racha, monedas, materia y HP |

**Recomiendo A** para el HUD y **B** dentro de la pantalla de hábitos. El HUD dice *que* estás
protegido; la pantalla dice *cuántos* te quedan.

---

## 4 · El nombre del conjunto de divisas

**Qué se decide.** Cómo se llama la categoría que agrupa moneda y materia oscura.

**Por qué está abierta.** Ya cambió una vez —eran «gemas», ahora «materia oscura»— y el nombre de la
categoría se está usando como si fuera el nombre de una de sus piezas. Necesita un nombre que no
dependa de la temática, porque las temáticas son personalizables (tarot, gamer, ciencia).

| Opción | Consecuencia |
|---|---|
| **A · Divisas** | Neutro y estándar. No compite con ninguna temática |
| **B · Recursos** | Más de juego. Cabe también para consumibles y protectores, si algún día entran |
| **C · Insumos** | Lo que dijiste: «un insumo de transacción». Preciso, pero seco |
| **D · Tesoro** | Con carácter, pero se pelea con las temáticas de ciencia y militar |

**Recomiendo A**, con **B** como segunda: si el conjunto va a crecer más allá de las dos monedas,
«Recursos» aguanta mejor.

---

## 5 · Hasta dónde llega el cronograma *(nueva)*

**Qué se decide.** Cuáles de los cuatro niveles se construyen.

**Por qué está abierta.** El componente es uno solo (`.kbv-timeline-grid`); lo que cuesta es cada
punto de entrada. Ya están documentados **área**, **proyecto** y **día**; falta **tarea**.

| Opción | Consecuencia |
|---|---|
| **A · Los cuatro** | Recorrido completo: del área al bloque de hoy sin salir del cronograma |
| **B · Solo área y proyecto** | Cubre la planeación. El día ya lo cubre la agenda, y la tarea rara vez tiene subtareas con fecha |
| **C · Módulo propio en el nav** | Como decidiste antes, con las 8 vistas. Es el alcance más grande |

**Recomiendo B para empezar** y subir a A cuando el detalle de tarea exista: el nivel tarea necesita
que las subtareas tengan fecha, y hoy `tarea-detalle.jsx` no las tiene.
