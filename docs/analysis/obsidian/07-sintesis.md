# 07 · Síntesis — Kibo ↔ Obsidian

**Fecha:** 2026-08-08 · **Autor:** Claude (orquestador) · **Insumos:** los seis análisis especializados de esta carpeta
**Para:** Sergio Tortolero · **Estado:** cierre del análisis; entrada a decisión

> Este documento no repite los seis análisis: los **cruza**. Su valor está en lo que ningún
> especialista podía ver desde su ángulo — dónde coincidieron sin hablarse, dónde se
> contradicen, y qué decisiones quedan en tu cancha.

---

## 1 · Cómo se produjo esto

Seis especialistas del roster trabajaron **en aislamiento**, sin verse entre sí, cada uno con el
mismo paquete de contexto y un ángulo distinto:

| # | Agente | Ángulo | Entregable |
|---|---|---|---|
| 01 | `solution-architect` | Arquitectura, transporte, formato, algoritmo de sync | `01-arquitectura-integracion.md` (909 líneas) |
| 02 | `ai-engineer` | Capa de IA, RAG, extracción, costes, evals | `02-capa-ia.md` (1,154) |
| 03 | `web-architect` | Aterrizaje en el monorepo real (Prisma, NestJS, Next) | `03-aterrizaje-monorepo.md` (1,293) |
| 04 | `business-analyst` | Mercado, prior art, cultura de la comunidad | `04-mercado-y-prior-art.md` (596) |
| 05 | `security-auditor` | Amenazas, privacidad, cumplimiento | `05-seguridad-y-privacidad.md` (518) |
| 06 | `ux-researcher` | Personas, adopción, arquitectura de información | `06-ux-y-adopcion.md` (1,033) |

Que trabajaran aislados es lo que hace creíbles las coincidencias de la §3: **no son eco, son
convergencia independiente.**

---

## 2 · El veredicto en una página

**Hay una integración que vale la pena. No es la que describe el §4 de tu PRD, y hoy no se puede
empezar.**

1. **El §4 acierta en la tesis y falla en la ejecución.** "No competimos en el almacén de
   conocimiento, competimos en el loop de hábito" es correcto y los seis análisis se derivan de
   ahí. Pero el orden de las fases está invertido, el mecanismo de conflictos propuesto destruye
   datos, y la fase que el PRD da por hecha no existe.
2. **La integración no se puede empezar porque no existe la cosa a integrar.** No hay tabla de
   notas, ni pantalla de Recursos, ni editor, ni backlinks, ni motor de rachas, ni libro mayor de
   XP. El PRD dice que la fase F0 está *"ya cubierta por diseño"*: eso es cierto en la maqueta de
   Claude Design y **falso en el código**. Entre hoy y "la integración tiene sentido" hay 8–12
   semanas de construir Kibo, no de construir la integración.
3. **Tu inclinación bidireccional es satisfacible — pero no como la imaginas.** "Bidireccional"
   (por dónde viaja el dato) y "fuente de la verdad" (quién manda en el desacuerdo) son ejes
   independientes. Puedes tener doble sentido en todo lo que te importa **con un dueño por campo**.
   Lo que sale caro y frágil no es el doble sentido: es la doble autoridad sobre el mismo campo.
4. **El riesgo más grande del proyecto no es el sync: es la gamificación de la escritura.** Es el
   hallazgo más incómodo y viene del análisis de UX. Volver a él en la §5.
5. **Obsidian es un canal de validación de nicho, no un wedge de adquisición masiva.** Veredicto de
   negocio: **GO condicionado** a una apuesta mucho más pequeña, más barata y más ancha que la del
   PRD.

---

## 3 · Las convergencias — donde coincidieron sin hablarse

Ordenadas por cuántos especialistas llegaron ahí por su cuenta.

### 3.1 Cinco de seis: no hay evidencia de que alguien quiera esto (01, 02, 03, 04, 06)

Es la única preocupación que aparece en el top-3 de casi todos, y cada uno llegó por un camino
distinto:

- **Negocio:** cinco plugins de gamificación nativa en Obsidian, entre 0 y ~7,400 descargas. Contra
  Dataview con 4.7M. Tres a cinco órdenes de magnitud, sostenido durante seis años. La comunidad
  **pide** gamificación en los foros con entusiasmo y **no adopta** lo que se construye.
- **IA:** la comunidad ya paga por IA sobre sus notas (Copilot, ~1.65M descargas, $14.99/mes), pero
  paga por herramientas que viven **dentro** de Obsidian. Y el estándar gratuito es alto (Smart
  Connections, ~1.06M descargas, embeddings locales, sin API key).
- **UX:** Obsidian arranca en Modo restringido, su foro debate en serio la seguridad de plugins, y
  su identidad de marca es "tus archivos, tu disco" — justo frente a lo que Kibo es.
- **Arquitectura y monorepo:** lo señalan como riesgo de asignación de esfuerzo.

**Traducción:** estás diseñando para una comunidad de la que no formas parte, que mira con
desconfianza por defecto, y cuyo historial dice que aplaude esta idea y luego no la instala.

### 3.2 Cuatro de seis: el orden de fases del PRD está invertido (01, 03, 04, 06)

El PRD propone F0 → F1 (plugin) → F2 (espejo bidireccional). Los problemas:

- **F0 no está hecha.** Está sin empezar en el código.
- **F1 y F2 dependen de prerrequisitos disjuntos.** F1 (racha + hábitos en el plugin) necesita el
  motor de hábitos y rachas. F2 (espejo) necesita Recursos completo. No existe ninguno de los dos,
  así que el orden real lo dicta **qué módulo del núcleo construyas primero** — es una decisión de
  roadmap de producto, no de arquitectura de integración.
- **F2 se apoya en la infraestructura más frágil** (Local REST API o agente local), que es
  precisamente lo que todos los análisis descartan.
- **Import/export debería adelantarse.** Da ~60% del valor percibido de "compatible con Obsidian" a
  <5% del coste: no requiere plugin, no requiere emparejamiento y **no puede corromper nada porque
  nunca escribe en el disco del usuario**.

### 3.3 Tres de seis: la métrica del 25% no se sostiene (01, 04, 06)

"≥25% de usuarios de Recursos con bóveda vinculada a los 90 días de F2" confunde denominadores
(usuarios de Recursos ≠ usuarios de Obsidian), no tiene base declarada, y contra benchmarks de
adopción de integraciones en SaaS (10–30%, casi nunca en el extremo alto) es optimista para una
función de nicho dentro de un módulo que ya es de nicho — Recursos es premium. UX la califica de
**aritméticamente inalcanzable**.

### 3.4 Dos de seis, por caminos opuestos: la IA no puede tener autoridad (02, 05)

`ai-engineer` llegó por diseño de producto; `security-auditor` por modelo de amenazas. Idéntica
conclusión: **ninguna salida de un LLM incrementa XP, monedas, gemas o racha directamente.** El
modelo propone hechos observados con evidencia y confianza; un motor determinista decide si eso se
convierte en evento de juego.

Y el mismo par convergió en el vector de ataque: **inyección de prompt desde el vault.** El vault
contiene texto que Kibo no escribió — recortes web, PDFs importados, notas compartidas. Toda ruta
que combine *leer el vault* con *escribir en Kibo* es explotable por una nota con instrucciones
dirigidas al modelo. Ninguna cantidad de prompting lo resuelve; solo arquitectura.

### 3.5 Dos de seis: "última escritura gana" queda descartado (01, 05)

El §4 del PRD propone LWW + respaldo. Se refuta con un argumento difícil de rebatir: **el propio
Obsidian Sync no hace LWW en Markdown — hace merge a tres bandas con diff-match-patch.** Si Obsidian
no considera LWW aceptable para sus propios archivos, Kibo tampoco puede. Seguridad lo lista como
diseño a descartar: pérdida silenciosa de contenido escrito a mano.

### 3.6 Dos de seis: fuera el agente local y el Local REST API (01, 05)

Arquitectura los descarta por fricción (5–6 pasos antes del primer valor, solo escritorio, Obsidian
tiene que estar abierto). Seguridad los descarta por superficie de ataque (un agente propio añade
firma de código, canal de auto-update —RCE por diseño— y custodia de llaves, sin beneficio que el
plugin no dé). **Coinciden en el transporte: plugin propio, saliente por HTTPS.**

---

## 4 · Lo que hay que corregir del PRD §4

| Afirmación del PRD | Veredicto | Qué hacer |
|---|---|---|
| "No competimos en el almacén de conocimiento, competimos en el loop de hábito" | ✅ Confirmado | Mantener. Es la tesis que ordena todo. |
| "No reconstruir grafo/editor dentro de Kibo" | ✅ Confirmado sin reservas | Mantener. |
| "F0 ya cubierta por diseño" | ❌ **Falso en el código** | Reescribir: F0 está sin empezar. |
| "Conflictos: última escritura gana + respaldo" | ❌ **Destruye datos** | Sustituir por merge a tres bandas con base común, o evitar el problema con una sola dirección de escritura. |
| "La bóveda es una carpeta .md → cualquier app puede leer/escribir" | ⚠️ Cierto en disco, **falso desde un navegador** | File System Access API no existe en Firefox, Safari ni móvil. En móvil el vault vive en el sandbox de la app. |
| "Local REST API: Kibo web podría hablarle directo" | ⚠️ Posible, **comercialmente inviable** | Descartar como ruta de producto. |
| "F2 = espejo bidireccional vía Local REST API o agente local" | ❌ Refutado | Ambas son de escritorio y alta fricción. Si hay bidireccionalidad, llega por el plugin. |
| "Readwise, Todoist y Zotero tienen plugin oficial" | ❌ **Error factual** | Solo Readwise es oficial (org `readwiseio`). Todoist y Zotero dependen de plugins de terceros sin afiliación. Corregir la frase. |
| "No meter metadata gamificada en el frontmatter" | 🟡 Correcto en espíritu, **sobre-amplio en la letra** | Prohibir metadata *de gamificación* es correcto y suficiente. Prohibir *toda* metadata impide reconciliar renombrados. Se necesita exactamente una clave: `kibo-id`. |
| "≥25% de bóvedas vinculadas a 90 días de F2" | ⚠️ Sin base | Sustituir por escalera de métricas con umbrales por fase. |

Sobre el frontmatter hay un matiz que vale la pena que conozcas: **"frontmatter = archivo sucio" es
una creencia de 2021.** Desde Obsidian 1.9 el propio Obsidian construye una base de datos sobre
YAML frontmatter. Seguridad añade una razón independiente para seguir prohibiendo la metadata de
juego: lo que Kibo escriba en el vault puede terminar sincronizado a Dropbox, iCloud o un git de un
tercero.

---

## 5 · El hallazgo que no esperabas: la gamificación puede ser el problema

Viene del análisis de UX y es el más incómodo de los seis.

El §3.12 del PRD propone: **XP a Sabiduría por escribir · racha de escritura · notas huérfanas
convertidas en "misiones de enlace"**. El análisis sostiene que esa configuración concreta es
contraproducente **para el segmento exacto al que se le quiere vender**, por dos vías:

- **Efecto de sobrejustificación.** Para el usuario de Obsidian consolidado, escribir ya es placer,
  no tarea. Ponerle un contador es el caso de manual de recompensa extrínseca degradando motivación
  intrínseca. Su reacción prevista no es "qué divertido" sino **"esto me está midiendo"**.
- **Paga por el anti-patrón que la comunidad desprecia.** Premiar volumen de notas y enlaces
  recompensa *coleccionar y decorar* en vez de *pensar* — la "falacia del coleccionista", que esa
  comunidad tiene identificada y nombrada.

Y un detalle de voz de marca: **"38 notas huérfanas" no es una misión, es un reproche** — lo
contrario exacto de *"el fracaso reencauza"*.

> La frase que resume el riesgo: *"la capa que hace único a Kibo es también la que puede volverlo
> inaceptable para el público de esta integración. Si hay que sacrificar algo, sacrifiquen las
> mecánicas de escritura, no la integración."*

Esto **no dice** que la gamificación de Kibo esté mal. Dice que gamificar *la escritura* frente a
este público específico requiere rediseño antes de construirse.

---

## 6 · La decisión que solo tú puedes tomar

Aquí está el cruce que ningún especialista podía ver solo, y es el punto central de todo el
análisis.

**El arquitecto evaluó cuatro direcciones de la verdad y filtró por tres requisitos eliminatorios:**

- **G1** — Recursos sigue siendo escribible desde Kibo (web y móvil) tras vincular una bóveda.
- **G2** — Kibo nunca destruye contenido sin ruta de recuperación.
- **G3** — El estado de juego (XP, HP, monedas, rachas) es autoritativo en Kibo.

Resultado: solo sobrevive la opción **D (verdad particionada con propiedad de campo)**. Pero dejó
registrado un resultado incómodo: **la opción A (Obsidian-first estricto) puntúa más alto — 4.15 vs
3.85 — y queda fuera únicamente por G1.** La llamó *"la palanca de simplificación número uno de
todo este diseño"*.

**G1 es un requisito de producto. Y dos especialistas lo atacaron por su cuenta:**

- **UX:** *"Nunca dos editores."* Su riesgo #1 es tener dos superficies de escritura — un problema
  de arquitectura de información que ninguna cantidad de sync arregla, y que no se manifiesta como
  error sino como silencio: el usuario deja de escribir en ambos lados. Su regla de oro propuesta:
  **"Tu bóveda es donde escribes; Kibo es donde eso se vuelve progreso."**
- **Negocio:** el único precedente de éxito sostenido de la categoría (Readwise) resolvió el mismo
  problema con **una sola dirección y sin sobrescribir nunca**.

> **Tres especialistas, desde arquitectura, experiencia de usuario y precedente de mercado, apuntan
> al mismo sitio: relajar G1.** El arquitecto no podía hacerlo porque G1 venía dado como requisito
> de producto. Los otros dos dicen que ese requisito está mal.

### La pregunta, en tus términos

**Si vinculas una bóveda de Obsidian, ¿Recursos deja de ser un editor dentro de Kibo y se vuelve la
capa que lee, cruza y gamifica — o sigues pudiendo escribir notas desde el navegador del teléfono?**

- **Si aceptas que deja de ser editor:** desaparecen el merge de cuerpos de nota, la mitad de los
  estados de conflicto y buena parte del riesgo de pérdida de datos. La integración se abarata
  drásticamente y se alinea con el único patrón con evidencia de éxito.
- **Si G1 se mantiene:** la arquitectura correcta es la partición por campo, con merge a tres bandas
  en el cuerpo de las notas. Es viable — el arquitecto la diseñó completa — pero es la ruta cara, y
  cargas con el riesgo de "dos superficies de escritura" que UX considera el más grave del proyecto.

### Cómo se resolvió (ADR-0001)

Le pasé al arquitecto una vía intermedia —**A′**: Obsidian manda sobre el *cuerpo* de las notas
(Kibo nunca los escribe), pero palomear una tarea o un hábito en cualquiera de los dos lados emite
un *intent* que Kibo valida y convierte en XP y racha— con el encargo explícito de atacarla, no de
darme la razón.

La puntuó con sus mismos criterios: **A′ = 4.55**, por encima de A (4.15) y de D (3.85). Y encontró
por qué gana: **su gate G1 estaba mal formulado.** Confundía dos cosas separables —*capturar
contenido nuevo* y *editar cuerpos existentes*. Al separarlas, el dilema se disuelve:

- Capturar desde Kibo web o móvil se resuelve con **create + append**, que no puede entrar en
  conflicto.
- Editar cuerpos desde Kibo es lo único que obliga a merge a tres bandas, base común persistida y
  máquina de estados de conflicto.

Sustituyó G1 por **G1′** — *"el usuario puede capturar contenido nuevo desde Kibo sin abrir
Obsidian"* — que A′ cumple a una fracción del costo. Y resolvió su propia objeción pendiente (las
notas que ya existían en Kibo antes de vincular) con un **export puntual y confirmado** al vincular,
no con sync continuo.

**La consecuencia es fuerte: los conflictos de cuerpo no se resuelven — se vuelven estructuralmente
imposibles.** La v1 no necesita merge a tres bandas, ni bases persistidas, ni máquina de conflictos,
y **por defecto no escribe un solo byte en los archivos del usuario**. D queda como ruta de v2:
A′ → D es aditivo; D → A′ sería quitar una capacidad ya entregada.

**Pero el filo de la decisión sigue en tu cancha:** con bóveda vinculada, **Recursos deja de ser
editor de cuerpos** — y Recursos es un módulo *premium*. Eso tiene que presentarse como un cambio de
modo declarado en el onboarding, nunca descubierto por el usuario. Si respondes que no, vuelve G1 y
con él todo el aparato de merge: es el mayor incremento de costo disponible en este diseño.

Esta decisión **no bloquea nada hoy** — no hay código que construir todavía. Pero conviene tomarla
antes de escribir la primera línea, porque el contrato de formato, la canonicalización y la
identidad estable son irreversibles una vez que existan bóvedas vivas de usuarios reales.

---

## 7 · Lo innegociable si esto se construye

Seguridad marcó controles bloqueantes. Los que cambian el diseño, no la implementación:

1. **Escritura confinada a una sola carpeta** declarada por el usuario. Nunca el vault completo.
2. **`.obsidian/**` prohibido en absoluto**, con allowlist de extensiones. No es un bug de sync:
   escribir ahí es **ejecución de código en la máquina del usuario**, y existe una campaña real de
   abril de 2026 explotando esa superficie.
3. **Sin borrado desde la nube.** Papelera y respaldo previo, nunca borrado directo.
4. **Ante conflicto, conservar ambas versiones.** Jamás borrar ante ambigüedad.
5. **Salud y Finanzas nunca al vault ni al LLM.** Sin excepción y sin consentimiento que lo habilite
   (constitución Art. 3, y datos sensibles bajo GDPR/LFPDPPP).
6. **La IA sin autoridad** sobre economía ni escritura, y contención de inyección de prompt.
7. **Consentimiento granular y separado** para el procesamiento por IA. Nunca empaquetado con
   "conectar bóveda" ni con los términos de servicio.
8. **Plugin de código abierto.** Además, la telemetría de cliente está **prohibida** por las
   políticas de desarrollador de Obsidian — y Kibo es un producto cuya mecánica entera vive de
   instrumentar comportamiento. Toda la instrumentación tiene que vivir en la API, ninguna en el
   plugin. Esto no se arregla con código: se arregla con una regla escrita antes de empezar.

Sobre la capa de IA hay una buena noticia: **el coste no es el problema.** ~$0.21 por usuario activo
al mes con el paquete completo; el índice inicial de una bóveda de 10,000 notas ~$0.15. El problema
es la privacidad y la confianza, no la factura.

---

## 8 · Qué haría yo, en orden

1. **Decidir G1** (§6). Es la decisión con más apalancamiento y no cuesta nada tomarla hoy.
2. **Corregir el §4 del PRD** con la tabla de la §4 de este documento — incluido el error factual
   sobre Todoist y Zotero, que es el tipo de dato que un analista externo verificaría.
3. **Rediseñar la gamificación de la escritura** (§5) antes de que se convierta en spec.
4. **Seguir construyendo Kibo, no la integración.** Recursos nativo primero. Si Recursos no es bueno
   por sí solo, sincronizarlo con una bóveda no lo arregla.
5. **Adoptar Obsidian tú mismo, 30 días**, con la conciencia de que eso te da criterio de novato —
   útil, pero no el del usuario consolidado que decide si esto vive o muere. En paralelo, no en
   serie, el estudio de validación con usuarios reales.
6. **Import/export de bóveda como el entregable de integración de la v1.** Máximo valor percibido,
   mínimo coste, riesgo cero de tocar el disco del usuario.

Lo que **no** haría todavía: el plugin en el catálogo comunitario. Es una comunidad que audita,
discute y desconfía por diseño; llegar ahí con un producto que aún no existe y una capa de juego sin
validar expone a un rechazo público que después cuesta años revertir.

---

## 9 · Fronteras de este análisis

- **No hay roadmap con fechas ni esfuerzos.** Tres de los seis lo derivaron explícitamente a
  `product-planner`; no lo lancé porque primero hace falta tu decisión sobre G1.
- **El ADR está escrito y espera tu aprobación:** `docs/adr/0001-obsidian-integration.md`, estado
  *Proposed*. Está **en inglés** por el Art. 7 de la constitución, que nombra los ADR
  explícitamente; el análisis largo y esta síntesis quedan en español. Ver la nota de la §10.
- **La exposición mayor sin resolver:** aun sin escribir en el disco del usuario, Kibo **almacena el
  contenido de bóveda que ha leído**. La pregunta de "modo solo-metadata" (Kibo guarda ids, enlaces
  y hashes, y los cuerpos se abren por deep link) debe resolverse **antes** de escribir el esquema
  de datos, porque lo cambia. Está asignada a `security-auditor` como seguimiento del ADR.
- **Verificaciones legales pendientes:** texto vigente de la LFPDPPP 2025 sobre consentimiento
  escrito para datos sensibles y financieros, y los términos de retención del proveedor de LLM.
  Requieren asesoría externa; ningún agente puede resolverlas.
- **Los seis análisis marcan qué es hecho verificado y qué es supuesto.** Cuando cites cifras de
  este documento hacia afuera, ve a la fuente en el análisis correspondiente.
- **Sobre el tamaño de Obsidian:** nadie sabe cuántos usuarios tiene, ni su propio CEO — declaró
  públicamente un rango de 5–10 millones con la salvedad de que no está seguro. Cualquier TAM que te
  den sobre Obsidian debe traer ese disclaimer.

---

## 10 · Nota de gobierno — idioma de los artefactos

Instruí a los especialistas a escribir en español (prosa) e inglés (identificadores), para dar
continuidad a tu PRD, que está en español. El `solution-architect` **desobedeció esa instrucción
para el ADR** y lo escribió en inglés, señalándolo en lugar de hacerlo en silencio. Tenía razón: el
Art. 7 de la constitución dice literalmente *"All code, docs, PRDs, ADRs, commit messages, and
config remain in English"*, y un mensaje de coordinación mío no puede debilitar la constitución.

Queda una inconsistencia real que te toca resolver, porque es tu ley:

- El Art. 7 nombra **docs y PRDs** además de los ADR. Con la letra estricta, tu `PRD-kibo.md`, los
  specs de Kibo y estos siete análisis también deberían estar en inglés.
- En la práctica, todo el corpus de Kibo es español y el master context declara lo contrario para sí
  mismo (*"written in English for compatibility with AI coding agents; working conversations remain
  in Spanish"*).

Tres salidas, y la decisión es tuya: **(a)** enmendar el Art. 7 para acotar el inglés a código,
config y mensajes de commit, dejando la documentación de producto en español; **(b)** mantener el
Art. 7 y normalizar Kibo a inglés con el tiempo; o **(c)** registrar una excepción explícita para
Kibo. Hoy la práctica es (a) sin estar escrita — que es la peor de las tres, porque cada agente
tiene que adivinar.
