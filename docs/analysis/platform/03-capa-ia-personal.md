# 03 · La capa de IA del SO Personal — almacén de contexto, MCP, modelo comercial

**Fecha:** 2026-08-08 · **Autor:** `ai-engineer` · **Ronda 3**
**Construye sobre:** `docs/analysis/obsidian/02-capa-ia.md` (R1) y `docs/analysis/obsidian/12-r2-ia-y-ecosistema.md` (R2).
No los repite: los referencia como **R1 §X** y **R2 §X**.
**Marco legal aplicable:** constitución del workspace **v1.7**, **Artículo 12** (productos que tratan datos personales).

> **Convención de evidencia:** **[V]** hecho verificado con fuente primaria y fecha · **[V-2ª]** verificado solo
> en fuente secundaria (se dice cuál y qué falta confirmar) · **[S]** supuesto de diseño explícito y falsable.
> Todas las fuentes web fueron consultadas el **2026-08-08**.
>
> **Nota de proceso:** la skill `claude-api` no está instalada en este entorno. Los datos de modelos, precios,
> retención y elegibilidad provienen de `platform.claude.com/docs`, consultados el **2026-08-08**. Ningún dato
> contractual o de precio viene de memoria.

---

## 0 · Qué cambia respecto a las rondas 1 y 2

| Antes | Ahora | Motivo |
|---|---|---|
| **R1 §3.3:** "Ningún caso de uso de Kibo necesita un agente hoy" | **Revocado para el chat.** El SO Personal exige un bucle acotado con herramientas | La visión del producto lo pide explícitamente. Sigue vigente para todo lo demás |
| **R1 §4 / R2 §0:** MCP = distracción para v1 | **Se construye — pero como API interna primero, y el servidor MCP es su adaptador** | La premisa cambió: "que Kibo le sirva para conectar una IA" es la tesis del producto |
| **R2 §5.1:** "la IA vive en Kibo", cómputo local cancelado | **Parcialmente revertido.** Con Android nativo vuelve a haber dispositivo capaz — y el modelo **no ocupa espacio en la app** **[V]** | Hecho nuevo, no cambio de opinión: ver §5 |
| **R1 §UC-4:** hueco abierto de ASR (dictado sin proveedor) | **Cerrado en Android.** ML Kit GenAI incluye Speech Recognition en dispositivo **[V]** | Ver §5.3 |
| **R2 §7:** salud al LLM prohibida salvo "turno de estructuración" con contrato | **Se precisa: la ruta viable no es contractual, es on-device** | Ver §6 |
| **R1 §0 / R2 §7:** clase Roja como criterio propio | **Sustituida por el Art. 12**, que es ley y trae una salida contractual explícita | Constitución v1.7 |
| **R2 §8:** coste ≈ $0.13–$0.29 / usuario / mes | **≈ $0.75–$1.01** con la capa conversacional | El chat cuesta más que todo lo demás junto (§7) |

**Lo que no cambia y sigue gobernando:** R1 §2.0 — **el modelo es un sensor, no una autoridad**; y R2 §3.1 — *el
modelo nunca infiere lo que no está escrito*. La capa conversacional no relaja ninguno de los dos: los extiende.

---

## 1 · El cambio de premisa, leído desde la ingeniería

Sergio describió dos cosas que parecen la misma y no lo son:

1. *"que a través de Kibo pueda hablar con su misma información"* → **Kibo hospeda al agente.** Kibo controla el
   prompt, el modelo, las herramientas, los evals y el contrato con el proveedor.
2. *"que Kibo le sirva para que se conecte con una IA a hablar con sus notas"* → **Kibo es el sustrato.** El
   agente es de otro (Claude Desktop, Claude Code, lo que venga en 2028) y Kibo expone una superficie.

**No es una disyuntiva: es una jerarquía.** La segunda es la primera bien construida. Si Kibo expone su contexto
como un conjunto de herramientas con autorización por categoría, el chat interno de Kibo es **un consumidor más
de esa misma superficie**. Construir el chat primero y el MCP después produce dos caminos de acceso a los mismos
datos, con dos modelos de permisos y dos auditorías — que es exactamente cómo se filtran los datos de salud de
un producto.

> **La decisión estructural de esta ronda:**
> **Una sola superficie de contexto (`ContextAPI`), dos consumidores: el agente interno de Kibo y clientes MCP
> externos.** Mismos permisos, mismo registro de auditoría, mismas exclusiones de categoría.
> No es duplicación evitada: es la única forma de que la promesa del Art. 12 sea verificable.

**Y una consecuencia de producto que conviene ver pronto:** el valor de Kibo deja de estar en las features de IA
y pasa a estar en **la calidad y cobertura del contexto estructurado**. Un competidor puede copiar el chat en un
mes; no puede copiar dos años del diario, los hábitos y las áreas de un usuario. Eso refuerza la prioridad de
R2 §2.2 (UC-8, el traductor prosa→registro): **cada registro estructurado que Kibo captura es foso, y cada
conversación que el usuario tiene con él es solo la manifestación del foso.**

---

## 2 · Modelo comercial de la IA (pregunta 1)

### 2.1 Los hechos contractuales, verificados

**[V]** *(`platform.claude.com/docs/en/docs/manage-claude/api-and-data-retention`, consultado 2026-08-08)*

- **Por defecto, sin ningún acuerdo especial:** *"Conversation content (your prompts and Claude's outputs) is
  not retained by default"*, y *"Retained data is never used for model training without your express
  permission."* El punto de partida de la API comercial ya es no-entrenamiento y no-retención de contenido.
- **ZDR (zero data retention):** no se almacenan prompts ni respuestas en reposo tras devolver la respuesta.
  Se solicita a ventas y **se habilita por organización**.
- **HIPAA readiness con BAA:** disponible, y **auto-servicio desde la consola** con el BAA estándar; aplica
  cifrado, controles de acceso y registro de auditoría. *"If your organization handles PHI, HIPAA readiness is
  the arrangement to use; you do not also need ZDR."*
- **Es a nivel de organización, permanente e incompatible con uso general:** *"once enabled… permanent and
  cannot be disabled"* y *"If you need both HIPAA-ready and general-purpose API access, use separate
  organizations for each."*
- **Excepción que aplica siempre:** contenido marcado por los sistemas de trust & safety puede retenerse hasta
  **2 años**, con ZDR o sin él.
- **[V-2ª]** Anthropic ofrece un **DPA bajo el Art. 28 del RGPD con SCC**, incorporado a los Commercial Terms
  para API/Team/Enterprise; las cuentas **de consumidor de claude.ai no tienen DPA** (fuentes secundarias:
  `compound.law`, `stork.ai`, `privateclaude.ai`, consultadas 2026-08-08). **Falta confirmar** el texto exacto
  contra los Commercial Terms desde la consola — es una tarea de `security-auditor`/legal, no mía, pero la
  distinción comercial-vs-consumidor es el eje del análisis que sigue.

### 2.2 La pregunta que decide: ¿quién es el responsable del tratamiento?

Aquí está el error que se comete siempre con BYO key, y conviene desactivarlo antes de comparar nada.

> *Concepto — responsable (controller) vs encargado (processor):* el **responsable** decide *para qué* y *cómo*
> se tratan los datos; el **encargado** los trata siguiendo instrucciones del responsable. Las obligaciones
> pesadas —base legal, consentimiento, DPIA, derechos del titular— son del responsable.

| Escenario | Quién decide qué datos salen, cuándo y en qué forma | Responsable | ¿Se descarga Kibo del Art. 12? |
|---|---|---|---|
| **IA incluida** (Kibo paga) | Kibo | **Kibo** (Anthropic = encargado, bajo el DPA de Kibo) | No — pero **controla** toda la cadena |
| **BYO key** (el usuario paga) | **Kibo, igual** — Kibo compone el prompt, elige el modelo, decide qué categorías viajan | **Kibo sigue siendo responsable** de esa transferencia; el usuario se suma como segunda parte | **No.** Cambia quién factura, no quién decide |

**La conclusión incómoda: BYO key no transfiere la responsabilidad, la fragmenta y la empeora.** Kibo sigue
determinando el tratamiento, pero pierde lo único que hacía el tratamiento defendible:

1. **No puede verificar el régimen del destino.** Si la key del usuario es de una cuenta de consumidor,
   **[V]** los planes Free/Pro/Max no son elegibles ni para ZDR ni para HIPAA, y **[V-2ª]** no llevan DPA.
   Kibo estaría enrutando datos a un destino con **peores** garantías que las suyas, por decisión de diseño de
   Kibo. Bajo el Art. 12 eso no se salva con consentimiento.
2. **No puede garantizar calidad ni correr evals** contra un modelo que no controla (R1 §5.6 exige `model_id`
   pinneado; con BYO no lo hay).
3. **Custodiar la key del usuario es un pasivo de seguridad propio** (Art. 1), y no custodiarla obliga a
   pedirla en cada sesión, que es inusable.
4. **Todo fallo del proveedor parece un bug de Kibo.** Coste de soporte real.

### 2.3 Fricción y coste — la parte de producto

**[S]** El público declarado de Kibo es gamificación accesible, no estética gamer, es-MX primero. Pedirle a ese
usuario que abra una cuenta de API, entienda facturación por tokens y pegue una clave es una barrera que la
mayoría no cruza. Estimo adopción de BYO en el rango del **2–5 %**; es un supuesto a validar, no un dato.

Y del lado del coste, la aritmética de §7 desactiva el argumento clásico a favor de BYO: **$0.75–$1.01 por
usuario activo al mes**. Sobre una suscripción premium de $5, eso es 15–20 % — margen sano. **Kibo puede
permitirse pagar la IA de sus usuarios.** Lo que no puede permitirse es el usuario del percentil 95.

### 2.4 Veredicto

> **Las dos, pero asimétricas, y con una regla dura que impide que BYO se convierta en una puerta trasera.**

**1 · Por defecto: IA incluida en el plan.** Es la única configuración en la que el Art. 12 es verificable: un
solo DPA, un solo régimen de retención, un `model_id` pinneado con evals corriendo, y una cadena de
sub-encargados que Kibo puede enumerar. Va dentro del pack *Inteligencia* de la Tienda (PRD §3.13), con
**presupuesto mensual de tokens visible y degradación amable** (R1 §6.4) — ahora obligatorio, no opcional.

**2 · BYO key: sí, como función avanzada, y solo para categorías no especiales.**
Notas, tareas, hábitos, áreas, lectura → sí. Salud y finanzas → **nunca**, porque Kibo no puede verificar el
contrato del usuario. Diario → **tratado como categoría especial de facto**: una entrada de diario puede revelar
salud, orientación sexual, religión u opinión política, que son exactamente las categorías del Art. 12. Que el
contenedor se llame "diario" y no "salud" no cambia lo que hay dentro.

> **La regla dura, y hay que escribirla en el producto:**
> **El modo BYO nunca amplía el alcance de datos. Solo cambia quién paga la inferencia de un alcance que ya
> estaba permitido.**
> Esto mata de raíz la tentación comercial de *"con tu propia clave sí te dejo mandar tu expediente"* — que es
> precisamente lo que el Art. 12 prohíbe hacer con consentimiento como única cobertura.

**3 · El tercer modelo, que no es ninguno de los dos: on-device.** Gratis, sin tercero, sin contrato, sin
factura. Es el que resuelve salud (§6) y el que hace que Android primero sea la decisión de plataforma correcta
(§5). En la Tienda no se vende: se regala, y es el mejor argumento de confianza que Kibo va a tener.

**Cómo se posiciona BYO para que no canibalice:** no es un descuento, es una válvula. IA incluida trae
presupuesto mensual; BYO lo quita y permite elegir modelo. El usuario intensivo —que es justo el que rompe la
economía unitaria— se paga su propio exceso, y lo hace sintiéndose empoderado en vez de limitado.

---

## 3 · Kibo como servidor MCP, reevaluado (pregunta 2)

### 3.1 ¿Sigue en pie mi objeción de la ronda 1?

Dije en R1 §4.4 que "el público de MCP no es el público de Kibo". **Sigue siendo cierto como dato y deja de
serlo como argumento.** La distinción importa:

- **Como argumento de priorización, cae.** No se construye MCP para captar usuarios de Claude Desktop. Se
  construye porque el dueño del producto declaró que la razón de ser de Kibo es ser el motor de contexto de
  *cualquier* IA. Cuando la tesis es "ser el sustrato", exponer una interfaz estándar no es una distracción: es
  la tesis vuelta ejecutable.
- **Y hay un argumento nuevo que en R1 no tenía**, que es el que de verdad me convence: **la superficie MCP
  obliga a que la arquitectura interna esté bien.** Un catálogo de herramientas MCP *es* una API de
  comandos/consultas bien especificada, con autorización por herramienta y esquemas estrictos. Si Kibo la
  tiene, el chat interno se construye encima en días. Si Kibo construye primero el chat, tendrá acceso ad-hoc a
  la base de datos desde un prompt y después habrá que retroajustar los permisos — el orden que produce fugas.
- **Lo que sí sobrevive de mi objeción:** el MCP no se prioriza por adopción esperada, y no debe consumir
  presupuesto de producto compitiendo con UC-8. Es **un adaptador delgado sobre la `ContextAPI`**, no un
  proyecto.

**Veredicto: se construye la `ContextAPI` como P0 (la necesita el chat de todos modos) y el adaptador MCP
detrás de un flag, read-only primero.** Cambio mi verdicto de R1 §4.4 de "distracción" a "consecuencia
natural de hacerlo bien", pero no cambio el orden de construcción.

### 3.2 El hallazgo que gobierna el diseño y que debe ir en la recomendación

**[V] El conector MCP no es elegible ni para ZDR ni para HIPAA readiness.** En la tabla oficial de elegibilidad
aparece como `ZDR: No · HIPAA: No`, con la nota *"Data retained per standard policy"*
(`platform.claude.com/docs/en/docs/manage-claude/api-and-data-retention`, consultado 2026-08-08). Lo mismo
aplica a los **MCP tunnels** (research preview). Y **[V]** los productos de consumidor de Claude tampoco son
elegibles para ninguno de los dos regímenes.

**Consecuencia, y no admite matices:**

> **Ninguna herramienta de categoría especial existe en la superficie MCP. No "desactivada por defecto":
> ausente.** No hay `get_health_records`, no hay `get_finances`, no hay `search_journal` sin más.
> El Art. 12 exige DPA con retención cero o mínima para que un dato de categoría especial llegue a un proveedor
> LLM tercero; por la ruta MCP ese contrato **no existe como opción**, así que la feature no se lanza. Punto.

Hay un matiz jurídico que conviene nombrar sin escudarse en él: cuando el usuario conecta *su* cliente de IA a
*sus* datos, se parece más a un ejercicio de portabilidad que a un encargo de tratamiento. Pero **Kibo sigue
decidiendo qué expone la interfaz**, y esa decisión de diseño es enteramente suya. La responsabilidad de diseño
no se delega al usuario por el hecho de que él pulse el botón.

### 3.3 Superficie de herramientas propuesta

Organizada por categoría, con las exclusiones como parte del contrato, no como configuración.

**Lectura (el grueso del valor):**
`search_notes` · `get_note` · `list_tasks` · `get_task` · `list_projects` · `list_habits` ·
`get_habit_history` · `get_streak` · `get_areas` · `get_goals` · `get_today` · `list_reading` ·
`get_weekly_pulse` · `get_achievements`

**Escritura (estrecha, idempotente, reversible):**
`create_task` · `complete_task` · `complete_habit` · `create_note` · `append_journal_entry`
Cada una devuelve un `event_id` reversible y se marca `source: "mcp"` en el ledger (R1 §5.1).

**Que nunca deben existir** — herencia directa de R1 §4.2, ahora con fundamento legal además de económico:
`grant_xp` · `spend_coins` · `spend_gems` · `open_chest` · `modify_streak` · `set_hp` ·
**cualquier herramienta de salud** · **cualquier herramienta de finanzas**.
La economía no se manipula por instrucción; se mueve como consecuencia de eventos de dominio.

**Control de acceso que exige el Art. 12:**

1. **OAuth 2.1 con scopes = categorías.** Un scope por categoría (`notes:read`, `tasks:write`, `habits:read`…),
   nunca un scope global. El consentimiento es granular por construcción, no por pantalla.
2. **Las categorías especiales no tienen scope.** No se pueden pedir porque no existen en el servidor de
   autorización.
3. **`search_journal` fuera de la superficie en v1.** El diario es categoría especial de facto (§2.4).
4. **Revocación desde Kibo, no desde el cliente**, y tan fácil como conceder (Art. 12).
5. **Toda llamada MCP se registra en el mismo `ContextAccessLog`** que el agente interno (§4.4). El usuario ve
   "qué vio la IA" con las llamadas externas incluidas — si no, la auditoría tiene un agujero del tamaño de la
   integración entera.
6. **Límite de tasa y presupuesto diario de escrituras.** Las escrituras con impacto económico entran a la
   misma cola de confirmación que UC-8 (R2 §3.4).
7. **Denylist explícita además de la ausencia**, aprovechando que el conector soporta configuración por
   herramienta **[V — R1 §4.1]**: defensa en profundidad, no sustituto.

**Riesgo heredado que empeora aquí:** la inyección de prompt (R2 §9.3, preocupación 2). Un agente externo que
lee notas —contenido no confiable— y además puede escribir tareas es la forma canónica del problema. Mitigación:
escrituras con presupuesto diario, confirmación humana para lo económico, y el registro de auditoría como
detección posterior. No se elimina; se acota.

---

## 4 · Arquitectura del almacén de contexto (pregunta 3)

### 4.1 El principio: el aislamiento vive en el recuperador, no en el prompt

> Un prompt que dice *"no menciones datos de salud"* **no es un control**. Es una sugerencia a un sistema
> probabilístico sobre datos que ya están dentro de su ventana de contexto. El control es que el recuperador
> **no pueda** devolver esas filas.

Todo §4 es el desarrollo de esa frase.

### 4.2 Sesiones de contexto con alcance declarado

Cada interacción de IA abre una `ContextSession`:

```
ContextSession
  session_id, user_id, opened_at, ttl
  purpose            : chat | extraction | coach | link_mission | mcp_external
  scope_granted[]    : categorías autorizadas — derivadas del consentimiento del usuario,
                       NUNCA inferidas de lo que la consulta parece necesitar
  provider_org       : general | hipaa | on_device   ← se elige por categoría, no por conveniencia
  retention_regime   : zdr | hipaa | standard | none(on-device)
  model_id, prompt_version
```

Tres reglas que hacen que esto no sea decorativo:

1. **El alcance viene del consentimiento, no de la intención de la consulta.** Si el usuario no ha autorizado
   `journal`, una pregunta sobre su diario no amplía el alcance: se responde "no tengo acceso a eso" y se
   ofrece el botón de autorizar. La IA nunca negocia su propio permiso.
2. **Particionamiento físico por categoría.** Tablas e índices separados por categoría, y **row-level security
   de Postgres** con política sobre `(user_id, category)`. La consulta lleva el alcance como parámetro que no
   puede sobrescribir. Un bug en el código de aplicación no filtra, porque quien se niega es la base de datos.
3. **Enrutamiento de proveedor por categoría**, derivado de la matriz de residencia que el Art. 12 exige en un
   ADR. Y aquí aparece un requisito de infraestructura concreto y no obvio: **[V]** como HIPAA readiness es a
   nivel de organización, permanente, e incompatible con uso general, **Kibo necesitaría dos organizaciones de
   Anthropic** si algún día procesa salud en la nube — una general y una HIPAA, con la capa de enrutamiento
   eligiendo por categoría. Eso es arquitectura, no papeleo.

### 4.3 Recuperación sobre un corpus heterogéneo

El error reflejo es embeber todo. En un SO Personal, la mitad del corpus es **estructurado** y responderlo con
recuperación semántica da respuestas seguras y equivocadas.

| Tipo de dato | Cómo se consulta | Por qué |
|---|---|---|
| **Estructurado** — hábitos, tareas, rachas, áreas, registros tipados, sesiones de lectura | **Herramientas de consulta parametrizadas** (el modelo elige herramienta + parámetros; **nunca escribe SQL**) | *"¿Cuántas veces completé el hábito de correr en julio?"* es un agregado exacto. Un LLM respondiéndolo desde fragmentos recuperados **se equivoca con confianza**, y en un producto cuya promesa es "orden y control" ese error es letal |
| **Prosa** — notas, entradas de diario, notas de lectura | **Recuperación híbrida** (R1 §3.2: léxico + denso + RRF), particionada por categoría | Paráfrasis y sinónimos |
| **Mixto** — un registro tipado con notas libres | Ambos: el registro por consulta, el texto por recuperación, unidos por `record_id` | |

**Por qué herramientas parametrizadas y no text-to-SQL en v1:** el esquema de Kibo es conocido, pequeño y
estable; un catálogo de ~20 consultas parametrizadas cubre casi todo, es auditable, es barato en tokens, y es
imposible que produzca una consulta que cruce categorías. Text-to-SQL contra un rol de solo lectura con RLS es
la opción de v2, cuando existan datos de qué preguntan los usuarios. **[S]**

**Composición de la respuesta con exigencia de fundamento:** toda afirmación factual lleva un `source_id`
(`record_id` o `chunk_id`). **Una afirmación sin fuente se elimina antes de mostrarse.** Es la generalización
del verificador numérico de R1 §UC-5, y ahora hay soporte de plataforma: **[V]** la función de *Citations* es
elegible para ZDR y HIPAA (misma tabla oficial), así que fundamentar no obliga a renunciar al régimen de
retención.

### 4.4 Cómo se cruzan módulos sin mezclar categorías prohibidas

Esta es la parte difícil de la pregunta 3, y merece una respuesta honesta antes que una elegante.

**Primero, lo que NO funciona, aunque suene bien:** proyectar salud a un "índice de bienestar 0-5" y decir que
ya no es dato de salud. **Un indicador derivado del estado de salud del titular sigue siendo dato de salud.**
Las proyecciones reducen volumen e identificabilidad —son minimización, que es valiosa— pero **no cambian la
categoría legal**. Cualquier diseño que dependa de que sí lo hagan es un diseño que falla en la primera
auditoría.

**Segundo, el patrón que sí funciona — compartimentación por pasadas:**

```
Pregunta que cruzaría una frontera de categoría:
  "¿mi energía baja cuando duermo mal?"

Pasada A — DENTRO de la frontera (on-device, o en la org con el contrato adecuado)
  entrada : registros de salud del rango de fechas
  salida  : respuesta acotada por schema — enum de 8 valores + un booleano.
            Sin texto libre. Sin nombres de medicamento. Sin diagnóstico.

Pasada B — contexto general
  entrada : hábitos, rachas, tareas + el token acotado de la pasada A
  salida  : la respuesta al usuario
```

El beneficio real es **volumen y radio de impacto**, no blanqueo de categoría: el token acotado sigue siendo
dato derivado de salud y necesita el mismo respaldo contractual que el dato crudo. Lo que se gana es que
crucen 12 bytes en vez de un expediente.

**Tercero, y es mi recomendación para v1: no cruzar la frontera de salud en absoluto.**
Las preguntas de salud se responden **dentro del alcance de salud**, en una superficie separada, con el usuario
explícitamente ahí, y en Android con el modelo en dispositivo (§6). Cero respuestas que mezclen salud con otros
módulos en la primera versión. Es una limitación visible y explicable —*"para hablar de tu salud, entra a
Salud"*— y compra toda la superficie de riesgo por el precio de una fricción menor.

**Y una regla de composición que aplica siempre:** dos categorías especiales **nunca** comparten ventana de
contexto, ni siquiera si ambas están autorizadas. Salud y finanzas juntas en un prompt es la peor combinación
posible y no hay caso de uso que la justifique.

### 4.5 Auditar qué vio el modelo

```
ContextAccessLog (append-only)
  session_id, user_id, occurred_at
  purpose, consumer        : kibo_agent | mcp_client:<client_id>
  scope_granted[]          : lo que se autorizó
  categories_read[]        : lo que efectivamente se leyó   ← la diferencia importa
  record_ids[] / chunk_ids[]  : IDs y hashes, NUNCA contenido
  provider_org, retention_regime, model_id, prompt_version
  token_counts, latency_ms
  answer_hash
```

Tres cosas que este registro habilita y que no son opcionales:

1. **La pantalla "Qué vio la IA".** Por cada interacción, la lista exacta de registros leídos, con enlace a
   cada uno. No es teatro de cumplimiento: en un producto que aspira a saber todo de ti, **es el mecanismo de
   confianza**, y es barato. Un usuario que puede auditar a su IA la deja entrar más.
2. **La evidencia de la DPIA** que el Art. 12 exige antes del lanzamiento. Una DPIA sin este registro es una
   declaración de intenciones; con él, es verificable.
3. **La cascada de borrado.** Al eliminar un registro se invalidan sus embeddings y sus chunks; la entrada del
   log conserva el ID huérfano como prueba de acceso, sin contenido. El Art. 12 exige que el borrado llegue a
   los encargados: con ZDR no hay nada que borrar en el proveedor, que es otra razón para preferirlo.

**Diferencia entre `scope_granted` y `categories_read`:** si el alcance concedido es sistemáticamente mayor que
lo leído, el producto está pidiendo más permisos de los que usa — minimización de datos medida con un `GROUP BY`
en vez de con una promesa.

---

## 5 · Android primero y el reparto de cómputo (pregunta 4)

### 5.1 El hecho nuevo que reabre la discusión

En R2 §5.1 cancelé el cómputo local con dos argumentos: el conector debía ser delgado, y un modelo de 100–200 MB
dentro de Obsidian era meter producto donde no iba. Con app nativa, **el segundo argumento se cae por un hecho
que no tenía**:

**[V]** *(`developer.android.com/ai/gemini-nano` y `developer.android.com/ai/overview`, consultados 2026-08-08)*

- **Gemini Nano corre en AICore, el servicio de sistema de Android — no en el APK de tu app.** La documentación
  lo dice como beneficio explícito: *"No app bloat: You don't need to download or include large models in your
  APK."* El SDK es esencialmente un cliente de binder.
- **AICore sigue los principios de Private Compute Core:** *Restricted Package Binding* (aislado de la mayoría
  de paquetes), *Indirect Internet Access* (todo tráfico de red, incluidas descargas de modelo, pasa por el APK
  de código abierto Private Compute Services) y **"No data retention: isolates each request and doesn't store
  input data or outputs after processing"**.
- **ML Kit GenAI ofrece:** Prompt, Summarization, Proofreading, Rewriting, Image Description y
  **Speech Recognition**.
- **[V-2ª]** Tamaño del modelo 1.5–2 GB en RAM, 1.8B–3.25B parámetros a 4 bits, latencia sub-100 ms en
  gama alta con NPU (Android Developers Blog y guías secundarias, consultadas 2026-08-08).
- **Cautela honesta:** la documentación enfatiza que el procesamiento es local, pero **no publica una garantía
  absoluta de "los datos nunca salen del dispositivo"**. La verificación de esa afirmación para las APIs
  concretas que Kibo use es tarea de `security-auditor`, no una afirmación que yo deba dar por buena.
- La disponibilidad depende del dispositivo. **Habrá fragmentación y hay que diseñar para ella.**

**Digo explícitamente que esto es información nueva, no un cambio de opinión.** El argumento de R2 era correcto
con los hechos que tenía; el hecho de que el modelo viva en el sistema y no en el APK lo invalida.

### 5.2 Qué se mueve al teléfono y qué no

Criterio: la tarea debe ser **corta, estructurada, frecuente o sensible**. Nada largo, nada que exija juicio de
calidad, nada que requiera contexto grande — por batería y por capacidad.

| Tarea | ¿Al dispositivo? | Razón |
|---|---|---|
| **Extracción tipada de salud (UC-8)** | **Sí — y es la razón de todo esto** | Si corre en AICore, **no hay transferencia a un tercero** y el Art. 12 deja de ser un obstáculo porque no hay a quién exigirle un DPA. Ver §6 |
| **ASR del dictado (RF-14)** | **Sí** | ML Kit Speech Recognition en dispositivo **[V]**. **Cierra el hueco abierto de R1 §UC-4** |
| **Compuerta de detección de UC-8** (¿hay un registro aquí?) | **Sí** | Binaria, cortísima, diaria. Caso ideal para Nano; y ahorra la llamada de nube de R2 §8.1 |
| **Embeddings del diario y de notas sensibles** | **Sí** | EmbeddingGemma <200 MB cuantizado (R1 §3.4). El índice del diario puede vivir cifrado en el teléfono y no subir nunca |
| Extracción tipada de categorías no especiales | Híbrido | Nano propone, la nube verifica si la confianza es baja. Ahorra coste sin arriesgar calidad |
| **Chat sobre el corpus** | **No** | Contexto largo, juicio, multi-turno. Batería y calidad lo descartan |
| **Coach semanal** (R1 §UC-5) | **No** | Batch, barato, clase Verde. No hay nada que ganar |
| **Misiones de enlace** (R2 P3) | **No** | Índice completo y juicio semántico |

### 5.3 Las tres advertencias

1. **Batería.** La inferencia en dispositivo es cara por token. El patrón que funciona es **poco, corto y
   espaciado**: una compuerta diaria, una extracción ocasional, un dictado. Un chat en dispositivo drena la
   batería y el usuario culpa a Kibo. Regla: **nada on-device que genere más de ~200 tokens de salida.**
2. **Fragmentación.** Hay que detectar capacidad en tiempo de ejecución y tener camino alternativo. Y aquí va
   la regla que mantiene todo limpio: **para categorías especiales, el camino alternativo es la captura
   manual, jamás la nube.** Un dispositivo sin AICore ofrece un formulario, no una degradación silenciosa a un
   tercero. Sin excepción.
3. **La calidad va en dirección contraria a la privacidad.** Un modelo de 1.8–3.25B transcribiendo una dosis es
   más propenso a equivocarse que Sonnet 5 — justo en la tarea donde el error es peor. **Por eso el diseño de
   R2 §3.3 se vuelve más crítico, no menos**: evidencia literal obligatoria por campo, la cantidad debe
   aparecer como dígito en el texto, semáforo ámbar, confirmación humana. Y aquí se cobra el dividendo de
   haberlo diseñado así: **los validadores deterministas corren igual sea cual sea el modelo que produjo la
   propuesta.** La arquitectura absorbe el cambio de modelo sin tocarse.

---

## 6 · La frontera de salud: qué haría falta exactamente (pregunta 5)

`security-auditor` ya resolvió lo que había que resolver: escribir salud a la bóveda local del usuario es
divulgación al titular y está permitido (coincide con R2 §7.1); hacia el LLM, prohibido. El Art. 12 deja una
puerta contractual. La pregunta es qué cuesta abrirla y si conviene.

### 6.1 La lista completa de requisitos, verificada

Para que un dato de salud pudiera procesarse con un LLM de nube bajo el Art. 12 haría falta **todo** esto:

| # | Requisito | Estado verificado |
|---|---|---|
| 1 | **DPA firmado** con el proveedor | **[V-2ª]** Existe bajo Art. 28 RGPD con SCC, incorporado a los Commercial Terms de API. Falta confirmar el texto desde la consola |
| 2 | **Retención cero o mínima** | **[V]** ZDR disponible a petición, por organización. O HIPAA readiness, que aplica salvaguardas en lugar de borrado inmediato |
| 3 | **Cláusula de no-entrenamiento** | **[V]** *"Retained data is never used for model training without your express permission"* |
| 4 | **Lista de sub-encargados** | Disponible vía Trust Center; hay que mantenerla y notificar cambios. Tarea continua, no de una vez |
| 5 | **Organización separada** | **[V]** HIPAA es a nivel de organización, **permanente e irreversible**, y no se mezcla con uso general → **dos organizaciones de Anthropic** |
| 6 | **Sin Batch, sin MCP, sin Files API** en esa ruta | **[V]** Batch: ZDR No / HIPAA No · MCP connector: No / No · Files API: No / No · code execution: No / No. Queda: Messages API, structured outputs, prompt caching, citations, contexto de 1M, memory tool, data residency |
| 7 | **PHI fuera de los esquemas JSON** | **[V]** *"Do not include PHI in JSON schema definitions"* — nombres de propiedad, valores de `enum`, `const` y `pattern` se cachean aparte hasta 24 h sin las protecciones de PHI |
| 8 | **DPIA completada y archivada** antes del lanzamiento | Art. 12. No existe |
| 9 | **Base legal para categoría especial** | RGPD Art. 9(2)(a): consentimiento explícito. Más LFPDPPP, y donde difieran gana la más estricta |
| 10 | **Consentimiento granular y revocable**, no agrupado | Art. 12 |
| 11 | **Exportación y borrado en cascada a encargados** | Art. 12 |

**Enmienda obligatoria a R2 §3.2 que sale del punto 7:** mi diseño contemplaba pasar el catálogo del usuario
como `enum` dentro del schema. Con datos de salud eso está **explícitamente prohibido** — una lista de
medicamentos del paciente como `enum` sería PHI dentro de un artefacto cacheado sin protección. **El schema de
`medical_consultation` debe ser genérico; toda información específica del titular va en el contenido del
mensaje.** Es un hallazgo verificado que invalida una parte concreta de mi diseño anterior.

**Y una nota de precisión que hay que hacer para no vender humo:** HIPAA es legislación estadounidense sobre
entidades cubiertas. **Kibo no es una entidad cubierta y "HIPAA readiness" no lo vuelve "compatible con
HIPAA".** Lo que aporta es un **marco de controles** —cifrado, control de accesos, registro de auditoría, BAA—
que sirve como evidencia frente al Art. 12 y frente a LFPDPPP/RGPD. Usarlo como marco técnico: correcto.
Anunciarlo como cumplimiento legal: falso y peligroso.

### 6.2 ¿Recomiendo intentarlo?

> **No en v1. La ruta correcta es on-device, y Android primero la hace natural.**

**El argumento:**

1. **La ruta contractual resultó más accesible de lo que supuse en R2** —el BAA es auto-servicio desde la
   consola **[V]**, lo cual es una sorpresa genuina y honestamente cambia el cálculo. Pero lo que se abre no es
   una casilla: son **once requisitos**, dos organizaciones, una configuración permanente e irreversible, la
   pérdida de Batch y MCP en esa ruta, una DPIA, una revisión legal bajo dos jurisdicciones y una lista de
   sub-encargados que hay que mantener. **Eso es un programa de cumplimiento, no una feature.**
2. **Para un producto sin usuarios, gastar eso en una funcionalidad de demanda no demostrada es el orden
   equivocado.** No hay evidencia todavía de que la gente quiera dictarle sus consultas médicas a una app.
3. **La ruta on-device entrega la mayor parte del valor a una fracción del coste de cumplimiento**, porque
   **no hay transferencia a un tercero** y el requisito del Art. 12 no se activa. Sus dos debilidades —calidad
   menor y disponibilidad limitada— están cubiertas: la calidad por los validadores deterministas de R2 §3.3
   (que no dependen del modelo), y la disponibilidad por la regla de §5.3 (dispositivo incapaz ⇒ formulario
   manual, nunca nube).
4. **La opción contractual no se descarta: se documenta y se cotiza.** Cuando exista evidencia de demanda —por
   ejemplo, N usuarios usando la estructuración on-device de salud de forma sostenida— se reabre con los once
   puntos ya inventariados. Que es exactamente para lo que sirve haberlos inventariado ahora.

**Y la línea que no se cruza en ningún escenario, ni con contrato ni sin él** (heredada de R2 §7.2, ahora con
base legal): Kibo **transcribe estructura; no interpreta, no aconseja, no valida dosis contra ninguna base
farmacológica.** Eso es funcionalidad de dispositivo médico y está fuera de alcance de forma categórica.

**Finanzas: no se abre y no hereda nada de esto.** El ejemplo del dueño del producto es salud. Si algún día se
quiere estructurar gastos desde prosa, empieza de cero con su propio ADR.

---

## 7 · Coste del perfil SO Personal completo (pregunta 6)

**[V] Precios** *(`platform.claude.com/docs/en/docs/about-claude/pricing`, consultado 2026-08-08)*:
`claude-sonnet-5` **$2/$10 por MTok hasta el 31-ago-2026**, luego **$3/$15** · `claude-haiku-4-5` $1/$5 ·
`claude-opus-5` $5/$25 · lectura de caché **0.1×** · escritura de caché a 5 min **1.25×** · Batch **−50 %**.
**[V]** `claude-fable-5` queda descartado para Kibo por doble motivo: $10/$50 y es **Covered Model con
retención obligatoria de 30 días, no disponible bajo ZDR**.

### 7.1 El elefante nuevo: la capa conversacional

**Supuestos [S]:** 12 conversaciones/mes por usuario activo · 4 turnos por conversación (48 turnos/mes) · por
turno ~1,800 tok de sistema y definiciones de herramientas (cacheable, compartido entre usuarios) + ~1,200 de
historial (cacheable dentro de la conversación; el TTL de 5 min cubre una conversación real) + ~2,500 de
resultados de herramientas (no cacheable) = **5,500 de entrada**, ~500 de salida. Estimo **~3,000 de los 5,500
como lectura de caché**, más un **20 % de sobrecarga** por escrituras de caché.

| Configuración | Intro (≤31-ago-2026) | Estándar (≥1-sep-2026) |
|---|---|---|
| Todo `claude-sonnet-5` | $0.61 / mes | $0.92 / mes |
| **Con enrutamiento por complejidad** (≈50 % de los turnos a `claude-haiku-4-5`) | **$0.46 / mes** | **$0.61 / mes** |

**El enrutador se paga solo el primer día.** Diseño: un clasificador determinista por forma de la consulta
(¿es una búsqueda simple? ¿un agregado? ¿una pregunta de juicio?) elige Haiku, Sonnet 5 u Opus 5. Opus 5 solo
cuando el usuario pide explícitamente análisis profundo, nunca por defecto.

### 7.2 Total

| Concepto | Intro | Estándar |
|---|---|---|
| Perfil Interop (R2 §8.3) — UC-1, UC-8, UC-9, coach | $0.129 | $0.172 |
| UC-2 misiones de enlace | $0.073 | $0.109 |
| UC-4 síntesis de lectura | $0.072 | $0.108 |
| UC-6 temas del diario | $0.010 | $0.010 |
| Embeddings incrementales del corpus personal | $0.002 | $0.002 |
| **Capa conversacional (con enrutador)** | **$0.460** | **$0.610** |
| **Total / usuario activo / mes** | **≈ $0.75** | **≈ $1.01** |

**Una sola vez:** índice inicial del corpus personal ~$0.016 · índice de una bóveda Obsidian $0.008–$0.75
(R1 §3.2) · mapeo de campos UC-10 $0.023 (R2 §8.2).
**A cero:** ASR (pasa a on-device, §5.2) · compuerta de detección de UC-8 (on-device) · **inferencia vía MCP,
porque la paga el cliente del usuario**.

### 7.3 Las tres lecturas

1. **El chat cuesta más que todas las demás features juntas** —el 61 % del total— y es la única partida sin
   techo natural, porque la usa quien quiere y cuanto quiere. **El presupuesto mensual de tokens con
   degradación amable y visible (R1 §6.4) pasa de recomendación a requisito de lanzamiento.** Sin él, el
   percentil 95 de usuarios define la economía unitaria del producto.
2. **A $0.75–$1.01, la IA incluida sigue siendo viable** (15–20 % de una suscripción de $5) y la recomendación
   de §2.4 se sostiene. Pero ya no es ruido contable como en R1: **es una línea del P&L que hay que vigilar**,
   y es el argumento más fuerte a favor de BYO key como válvula para el usuario intensivo.
3. **Contraintuitivo y útil: exponer MCP es la forma más barata de entregar "habla con tu información".** El
   coste de inferencia lo asume el cliente del usuario; Kibo solo paga servidor. Si el chat interno resulta
   caro de sostener, el MCP es el mismo valor con coste marginal cercano a cero — otra razón para construir la
   `ContextAPI` primero y decidir después qué consumidor se prioriza.

---

## 8 · Recomendación

### 8.1 Qué se construye, en este orden

1. **`GameEventLedger` + parser L0/L1** — sin cambio desde R1 §7.1 y R2 §9.1. Sigue siendo 0 % IA y sigue
   siendo el prerequisito de todo.
2. **`ContextAPI`: la superficie única de contexto.** Consultas parametrizadas + recuperación híbrida
   particionada por categoría, con `ContextSession`, alcance declarado, **row-level security** y
   `ContextAccessLog`. **Es la pieza que decide si el Art. 12 es verificable o es una promesa**, y es
   prerequisito tanto del chat como del MCP. Si solo se hiciera una cosa de esta ronda, sería esta.
3. **`ExtractionService` con los dos perfiles** (UC-1 y UC-8) — R2 §9.1, sin cambio. Empezando por un tipo de
   registro **no sensible**.
4. **La capa conversacional sobre la `ContextAPI`**, con enrutador de modelo, exigencia de fundamento
   (`source_id` obligatorio), presupuesto de tokens visible y la pantalla **"Qué vio la IA"**.
5. **Adaptador MCP** detrás de flag, read-only primero, sin ninguna herramienta de categoría especial.
6. **Salud on-device en Android** (extracción tipada + ASR + compuerta), con formulario manual como único
   camino alternativo.
7. UC-9, UC-10, coach y lectura según R2 §9.1.

**En paralelo desde el día uno, y esto es del Art. 12, no mío:** la **matriz de residencia de datos en un ADR**
(qué categoría puede vivir dónde y adónde nunca va) y la **DPIA**. El Art. 12 dice "antes del código". Los
evals de R1 §5.4 y R2 §9.1 siguen igual de obligatorios, más uno nuevo: **evals de aislamiento de categoría** —
un conjunto de consultas diseñadas para provocar fugas ("¿cómo influye mi salud en mis rachas?") donde el
criterio de aceptación es **0 filas de categoría no autorizada en el contexto**, medido en el
`ContextAccessLog`, no en la respuesta.

### 8.2 Qué se descarta

| | Estado |
|---|---|
| **Herramientas de salud o finanzas en la superficie MCP** | **Descartado permanentemente.** No existe el contrato **[V]** |
| **`search_journal` en MCP en v1** | Descartado — categoría especial de facto |
| **Salud en la nube en v1** | Descartado. Ruta on-device; la contractual queda inventariada y cotizada (§6.1) |
| **BYO key para categorías especiales** | Descartado. La regla dura de §2.4 |
| **Respuestas que cruzan la frontera de salud** en v1 | Descartado (§4.4) |
| **Text-to-SQL** en v1 | Aplazado a v2; herramientas parametrizadas primero |
| **`claude-fable-5`** | Descartado: $10/$50 y Covered Model con retención obligatoria de 30 días **[V]** |
| **Batch API para cualquier ruta con categoría especial** | Descartado: ZDR No / HIPAA No **[V]**. Sigue bien para el coach, que es clase Verde |
| Todo lo descartado en R1 §7.2 y R2 §9.2 | Sin cambio |

### 8.3 Las tres cosas que más me preocupan

**1 · Que el aislamiento por categoría se implemente en el prompt y no en la base de datos.**
Es el fallo más probable y el más caro, porque no se manifiesta como un error: se manifiesta como una respuesta
útil que no debió existir. La presión para que ocurra va a ser constante y va a sonar razonable —*"solo
necesito el dato de sueño para responder esto"*—, y cada excepción va a parecer pequeña. La defensa está
diseñada (particionamiento físico, row-level security, alcance como parámetro no sobrescribible, evals de
aislamiento con criterio de cero) pero **solo funciona si se construye antes que el chat**. Después de que
exista un chat que funciona, retroajustar permisos es un proyecto que nadie prioriza.

**2 · Que el chat sea el producto y el contexto sea la excusa.**
El chat es lo que se demuestra, lo que impresiona y lo que cuesta el 61 % del presupuesto de IA. El contexto
estructurado es lo aburrido, lo lento de construir y **lo único que no se puede copiar**. Un chat sobre un
almacén de contexto pobre es un chatbot genérico con pasos extra —y hay veinte gratis. La secuencia de §8.1
pone la `ContextAPI` y `ExtractionService` antes que el chat deliberadamente; si esa secuencia se invierte por
presión de demo, Kibo termina con una demo bonita sobre una base vacía, que es el modo de fallo más común de
esta categoría de producto.

**3 · Que el régimen de excepción de salud se ensanche solo — ahora con más presión que en R2.**
Repito la preocupación de R2 §9.3 porque el Art. 12 cambió su forma sin eliminarla. Antes el argumento sería
*"ya está en Kibo, ¿por qué no lo usa el coach?"*. Ahora será mejor: *"ya tenemos el BAA firmado, el DPA cubre
salud, ¿por qué no?"*. **Un contrato que permite algo no lo convierte en buena idea**, y la existencia de la
salida contractual va a hacer que cada ampliación parezca ya autorizada. Las defensas son procedimentales, no
técnicas, y por eso son frágiles: la matriz de residencia en un ADR con dueño, la DPIA rehecha cuando el
alcance cambie materialmente (lo exige el Art. 12), y las prohibiciones de §8.2 escritas como absolutas y no
como preferencias. Recomiendo además una salvaguarda barata: **que la pantalla "Qué vio la IA" muestre las
categorías por separado y de forma permanente**, para que cualquier ensanchamiento sea visible para el usuario
el mismo día en que ocurra. Es el único control que no depende de que alguien recuerde la regla.

---

## Anexo · Fuentes nuevas de esta ronda (consultadas 2026-08-08)

**Contractual y de retención (fuente primaria)**
- `platform.claude.com/docs/en/docs/manage-claude/api-and-data-retention` — ZDR, HIPAA readiness con BAA
  auto-servicio, tabla completa de elegibilidad por feature, retención por defecto, no-entrenamiento,
  Covered Models, restricción de PHI en esquemas JSON, retención de 2 años por contenido marcado
- `platform.claude.com/docs/en/docs/about-claude/pricing` — precios vigentes y fin del precio introductorio
  de Sonnet 5 el 31-ago-2026

**Contractual (fuente secundaria — pendiente de confirmar contra los Commercial Terms)**
- `compound.law`, `stork.ai`, `privateclaude.ai` — DPA bajo Art. 28 RGPD con SCC incorporado a los Commercial
  Terms de API; ausencia de DPA en cuentas de consumidor de claude.ai

**Android en dispositivo (fuente primaria)**
- `developer.android.com/ai/gemini-nano` — Gemini Nano en AICore y no en el APK; principios de Private Compute
  Core (aislamiento de paquetes, acceso indirecto a internet, no retención de entradas ni salidas); catálogo de
  APIs de ML Kit GenAI incluyendo Speech Recognition
- `developer.android.com/ai/overview` — criterio oficial on-device vs nube; matiz de que no se publica una
  garantía absoluta de "los datos nunca salen del dispositivo"

**Android (fuente secundaria)**
- Android Developers Blog y guías de 2026 — tamaño del modelo (1.5–2 GB), parámetros (1.8B–3.25B a 4 bits),
  latencia sub-100 ms con NPU

*(El resto de fuentes está en los anexos de `02-capa-ia.md` y `12-r2-ia-y-ecosistema.md` y sigue vigente.)*
