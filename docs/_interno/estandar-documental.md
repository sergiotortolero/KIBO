# Estándar del paquete de documentación — Kibo

Los seis documentos de `docs/` se construyen juntos. Comparten forma; se diferencian en contenido, nunca
en convención. Este archivo es la referencia contra la que se homologan y no se entrega.

## El paquete de documentación

Kibo lleva **seis documentos vivos**, que son los únicos que viajan a una entrega o a una lectura externa:

| # | Documento | Qué responde | Para quién |
|---|---|---|---|
| **0** | `0-resumen-ejecutivo.md` | Qué es Kibo, qué problema resuelve, cómo funciona — con capturas y no-technical | Cualquiera que lea el proyecto sin intención de construirlo |
| **1** | `1-analisis-funcional.md` | Cada requerimiento funcional y no-funcional, verificable uno por uno | QA y quien valide la solución |
| **2** | `2-documentacion-tecnica.md` | Dónde vive cada archivo, qué hace, qué se puede tocar sin romperlo | Quien mantiene el código después |
| **3** | `3-modelado-de-datos.md` | Todo sobre los datos: dónde viven, cómo se transforman, schemas y objetos | Ingeniería de datos |
| **4** | `4-manual-de-usuario.md` | Cómo entrar, navegar y hacer cada tarea — con capturas | Quién usa Kibo todos los días |
| **6** | `DESIGN-SYSTEM.md` | La receta para construir la interfaz en marca sin re-derivarla | Quien construye el UI |

El documento **0** abre con una ejecutiva de una página; los **1–4** responden preguntas específicas. El
**DESIGN-SYSTEM.md** es la única adición autorizada a los cinco numerados: existe porque Kibo construye
su propio sistema de diseño, y describe las reglas que no se negocian y los componentes canónicos que
quien construye necesita leer.

Nada más se entrega. `docs/_interno/` es material de trabajo y nunca va a una entrega.

## La cabecera, en este orden

```
# <Título>                                    ← un solo H1 por documento

<Subtítulo en una línea: qué es este documento>

**Para quién es:** <lector concreto y qué se supone que ya sabe>
**Versión:** <N.N>

## Registro de modificaciones
| Versión | Fecha | Editó | Qué cambió | Por qué |

## Contenido
<índice con anclas a cada sección de primer nivel>

## Glosario
<solo los términos que el documento usa y el lector podría no conocer; se omite si no hay ninguno>
```

Después empieza el contenido. Las referencias, si las hay, cierran el documento.

## Reglas de la cabecera

- **Un H1 y solo uno.** Las secciones son `##`, subsecciones `###`.
- **Versión visible en la cabecera**, no deducible de la tabla.
- **Registro de modificaciones**: orden **descendente**, lo más reciente arriba. Fecha en `AAAA-MM-DD`,
  sin excepciones ni celdas vacías. La columna **Editó** identifica al agente que escribió o al rol
  si no es una persona.
- **Para quién es**: cada documento lo declara. No se hereda de la carpeta.
- Una entrada del registro dice **qué cambió y por qué**, en una o dos frases. No es el lugar de un
  razonamiento de diseño ni de una medición.

## Voz

El documento **afirma el estado actual**. Nunca cómo llegó a serlo.

**Prohibido**, sin excepción:
- Comparar con un estado anterior: «antes», «ahora», «ya no», «pasó de X a Y», «se corrigió», «se retiró».
- Discutir con una versión previa del propio documento: «el documento anterior decía», «contra lo que se
  documentaba», «no es así». **El enunciado correcto se sostiene solo: se borra lo que viene después.**
- Narrar decisiones: «decidimos», «se acordó», «se propuso», «por instrucción de».
- Justificar la forma del documento: por qué se partió una figura, cuánto medía, cómo se recicla un número.
- Fechas que no sean parte de un hecho del sistema. Una ventana de datos y un horario de refresco lo son;
  el día en que alguien revisó algo, no.
- **Punteros internos**: identificadores de tickets, rutas a material interno (como `BACKLOG.md`),
  **nombres de personas**. La única excepción: referencias a documentos de `docs/` propios del proyecto
  (ej. «ver §2.3 en 2-documentacion-tecnica.md»).
- Referencias a pruebas: `pytest`, `tests/`, «suite», «paridad», «oracle».

Lo pendiente se dice en presente y se marca con `*`.

## La marca de pendiente

- Se escribe **pegada** al elemento que califica: `` `useAuth`* ``, `…de confirmar.*`
- La nota al pie es **una sola por documento**, al final: `` `*` Pendiente de confirmar. ``
- Nunca más de una nota, nunca a mitad de una sección.

## Tipografía y citas

- **Comillas angulares** «así» para el texto en español. Las rectas `"..."` quedan reservadas para citar
  literalmente una cadena de la interfaz o del código (un ID, un mensaje, una prop).
- **Identificadores en backticks**: nombres de componente, hook, archivo, función, variable, campo de
  dato, valores de UI. También paths: `` `src/components/` ``.
- **Nombres de proyecto en mayúsculas sin backticks**: Kibo, pero `` `useKiboStore` `` si es código.
- **Referencias a sección**: `§N.M`.
- **Numeración de sección homogénea** dentro del documento: `## N.` y `### N.M`. Sin raya después del
  número.
- **Sin emojis.**
- **Idioma**: la prosa documental es **es-MX** (es-AR donde hace falta clarificar un concepto);
  los identificadores técnicos (names, keys, componentes, funciones, archivos) quedan en English.

## Figuras

- Toda imagen lleva **pie**, en cursiva, en la línea siguiente. Sin prefijo: el pie describe, no se anuncia.
- La ruta es siempre relativa a la carpeta del documento: `capturas/<archivo>.png`.
- Un pie sin imagen arriba es un defecto.
- Una imagen sin pie es un defecto.

## Diagramas

Van en bloques `` ```mermaid `` — nunca en arte ASCII.

- **Dirección:** `flowchart` en `LR` cuando el grafo es una cadena de etapas, `TB` cuando es una jerarquía.
  Un mismo grafo dibujado en dos documentos usa la misma dirección.
- **Identificadores de nodo:** cortos, en mayúsculas, y **el mismo objeto lleva el mismo identificador en
  todo el paquete**.
- **Etiquetas de nodo:** el nombre del objeto tal como aparece en Kibo (en UI o en código). Calificadas
  con su módulo cuando el diagrama abarca más de uno. Sin `<br/>` salvo que la caja no quepa de otro modo.
- **Cardinalidad:** se expresa en la sintaxis del `erDiagram` (`}o--||`). En un `flowchart` no se expresa;
  si hace falta decirla, va en el texto que acompaña a la figura.
- **Color:** una sola paleta para todo el paquete, definida igual en cada diagrama que la use. Un mismo
  tipo de objeto lleva siempre el mismo color. Un diagrama sin color y otro con color no conviven.
- **Toda relación lleva etiqueta.** Una etiqueta vacía es un defecto; una entidad sin ninguna relación,
  también.
- **`PK` se marca en todas las entidades o en ninguna.**
- **Cada figura abre con una línea** que dice qué pregunta responde, y cierra con su pie.
- **Piso de legibilidad — no se negocia:** ancho natural ≤ **858 px** para un `flowchart` y ≤ **644 px**
  para un `erDiagram` (≤ 1,229 y ≤ 922 si la figura se gira 90°). Por encima de eso, la figura se parte.

  Los dos números salen de cosas distintas, y conviene saber por qué. Un `flowchart` rotula a **16 px**,
  así que puede encogerse hasta tres cuartos y seguir por encima de los 12 px que exige un texto legible:
  644 ÷ 0.75 da los 858. Un `erDiagram` rotula las filas de atributo a **10.2 px** y Mermaid no permite
  subirlo — está probado: ni `config.er.fontSize` ni `themeVariables.fontSize` lo mueven—, así que **su
  propio tamaño ya es su piso: no puede encogerse nada**. De ahí que su techo sea exactamente el ancho
  disponible.

  La medición se hace renderizando el diagrama, nunca estimando. Se toma **el texto más chico** de la
  figura: es el que decide si se lee.

## Tablas

- Máximo **seis columnas** cuando alguna lleva identificadores; siete solo con valores cortos.
- Una columna de prosa necesita ancho: **no más de dos** por tabla.
- **Ninguna celda pasa de cinco renglones.** Lo que no quepa baja como nota bajo la tabla.
- Separador compacto `|---|`.
- Una tabla que no cumpla lo anterior se parte en dos que compartan su primera columna.

## Lo que hace especial a Kibo

- **Es un proyecto público** (`github.com/sergiotortolero/KIBO`), así que los cinco documentos entregables
  no contienen datos sensibles de Sergio. El `docs/_interno/` nunca sale del repo y allí sí es válido
  poner contexto que deba quedar privado.
- **Lleva un sistema de diseño.** El `DESIGN-SYSTEM.md` es la sexta entrega — la receta para construir
  sin re-derivar. La regla es: **la receta es READ, las tarjetas son OPENED**. Una regla escrita solo en
  la tarjeta no puede seguirse sin mirarla; una specimen descrita solo en prosa no puede compararse a nada.
  Si la tarjeta y la receta difieren, la receta es la que está mal — la specimen se mide, la prosa se
  corrige.
- **Versionado con calificadores** (`1.0-alpha`, `1.0-beta`, `1.0`) en lugar de solo números. El registro
  de cambios lo documenta en la columna **Versión**.

## Cambios que revelan la construcción

Cuando una iteración constructiva revela un límite técnico o una mejor forma de hacer algo, el hallazgo se
registra en el documento que lo toca, en la misma sesión. Eso es el punto del modelo — no es una corrección
después. El registro de modificaciones captura el cambio; si el cambio afecta el entendimiento de alguien que
lee la doc, se anotan ambos en una fila: «Qué cambió» + «Por qué»
