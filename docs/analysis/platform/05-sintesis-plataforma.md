# 05 · Síntesis — arquitectura de plataforma (ronda 3)

**Fecha:** 2026-08-08 · **Autor:** Claude (orquestador) · **Insumos:** `01`–`04` de esta carpeta + ADR-0002
**Para:** Sergio Tortolero · **Estado:** cierre de la ronda 3

> Orden de lectura: este documento → `docs/adr/0002-kibo-platform-architecture.md` → los cuatro
> análisis. Las rondas 1 y 2 (`../obsidian/`) siguen vigentes salvo donde esta ronda las corrige.

---

## 1 · Qué disparó esta ronda

Tres decisiones tuyas: **Kibo es un Sistema Operativo Personal** ("va a conocernos de pe a pa"),
**Android primero** con web y quizá Windows, y **la bóveda es una salida del sistema** — Kibo emite
una carpeta que Obsidian lee, no al revés. Más la enmienda constitucional (v1.7) que desbloqueó
salud y finanzas como núcleo de producto.

---

## 2 · La contradicción que hay que resolver antes de nada

**Es el hallazgo más importante de la ronda y ningún agente podía verlo solo**, porque corrieron en
paralelo.

El desbloqueo de salud descansa **entero** sobre un argumento jurídico del auditor: que Kibo escriba
tu expediente en tu disco **no es una transferencia a un tercero, es entrega al titular** — y por eso
no le aplican las obligaciones que sí matarían la función.

Pero el arquitecto, resolviendo un problema distinto, recomendó que **el conector de nube sea el
transporte primario**: el servidor de Kibo escribe a tu OneDrive o Drive, y tu cliente de sync lo
materializa en Windows.

El analista de stack detectó el choque y lo escaló: **si el servidor de Kibo escribe en tu Drive vía
OAuth, deja de ser entrega al titular y vuelve a ser transferencia a un encargado tercero.** Eso
destruye el argumento completo sobre el que se levantó la prohibición de salud.

### El estado real: tres escritores candidatos, cada uno con un problema descalificante

| Escritor | Funciona | Problema |
|---|---|---|
| **Servidor → tu nube (OAuth)** | Sí, sin que tu PC esté encendida | **Reabre el problema legal de salud.** Vuelve a ser transferencia a tercero |
| **Plugin de Obsidian** | Sí, en escritorio | Exige Obsidian abierto; el arquitecto lo degradó a complemento |
| **App de Windows** | Sí | El arquitecto recomienda **no construirla** |

Y un dato que cierra una puerta: **la bóveda no se puede escribir de forma fiable desde Android.**
No es que SAF no deje escribir — es que las nubes mayoristas en Android **no espejan carpetas
locales** (la propia documentación de Obsidian marca OneDrive como *"limited functionality on
Android"* y Google Drive como *"not officially supported"*), el permiso persistente muere cuando un
sincronizador mueve la carpeta, y no hay ruta absoluta.

> **Conclusión de la síntesis, que ningún agente formuló:** el plugin de Obsidian —degradado por
> razones de experiencia y de arquitectura— podría ser **el único escritor legalmente viable para
> categorías sensibles**, precisamente porque la escritura ocurre en tu propia máquina, por software
> que actúa localmente, sin que un servidor tercero toque el dato. Es la ironía de la ronda: lo que
> se descartó por incómodo es lo que sostiene el argumento jurídico.

**Decisión que esto te obliga a tomar:** o el conector de nube se limita a categorías no sensibles y
las sensibles viajan por otro camino, o se acepta el régimen legal más duro para todo. No es una
decisión que un agente pueda tomar por ti.

---

## 3 · Un motor no: dos motores y un solo log

Le planteé al arquitecto que Android-first, la bóveda y el RF-08 son el mismo problema de
sincronización y debían compartir motor. **Se apartó de mi premisa con argumento, y tiene razón:**

- **Móvil ↔ servidor es replicación**: mismo esquema en ambos lados, convergencia automática y
  obligatoria, al usuario **nunca** se le pregunta.
- **Servidor → bóveda y RF-08 son integración**: esquemas distintos, mapeo con pérdida, y a veces
  *hay* que preguntarle al usuario.

Un motor que satisface a los dos no satisface a ninguno: o te interrumpe porque el teléfono perdió
señal, o destroza en silencio una nota que perdió su frontmatter.

Su regla: **compra la replicación, construye la integración.** Escribir tu propio motor
offline-first —relojes lógicos, convergencia, particiones— siendo un desarrollador solo es la vía
más rápida a corrupción silenciosa de datos.

**La costura es el `operation_log`:** toda mutación es una operación con identificador de cliente. La
replicación lo transporta, el proyector de bóveda lo consume por cursor, RF-08 igual, y la auditoría
que exige el Art. 12 se deriva de él. Eso hace **reversible** la elección de proveedor de
replicación: el estado autoritativo y el log son tuyos.

---

## 4 · Dos hallazgos que nadie encargó

### 4.1 La economía se puede farmear en modo avión

Offline-first y reglas de juego chocan. Lo determinista —completar una tarea, XP, racha, pérdida de
HP— se puede calcular en el cliente. Pero **abrir cofres tiene azar**: si el cliente resuelve la
aleatoriedad, se reintenta hasta ganar. Compras y retos compartidos igual: doble gasto, y una
tercera persona involucrada.

La línea: *el cliente calcula lo determinista; el servidor decide todo lo que tenga azar, escasez o
a otra persona.* Consecuencia incómoda que hay que **diseñar, no descubrir**: en una app
offline-first, **los cofres y la tienda no funcionan sin red**.

### 4.2 Un control de seguridad resultó ser defensa contra un fallo de plataforma

OneDrive Files On-Demand borra archivos del disco local para liberar espacio. La documentación de
Obsidian advierte que su Sync lo interpreta como borrado y **elimina las notas**. El control
KS-04/D-9 del auditor —*nunca propagar borrados*— es exactamente la mitigación, y se diseñó por otra
razón. El arquitecto añadió el derivado: si el proyector ve desaparecer archivos que él escribió, no
reacciona; los reescribe. **La ausencia nunca se lee como intención.**

---

## 5 · La API de Obsidian es peor de lo que suponíamos

El analista de stack cerró un pendiente contra la fuente primaria (`obsidian.d.ts` del repositorio
oficial), y el resultado corrige un control de seguridad:

- `getCache(path)` devuelve el **frontmatter íntegro** desde memoria, sin tocar disco.
- El evento `changed` entrega `data: string` — **el cuerpo completo del archivo** — a cualquier
  plugin suscrito.
- `resolvedLinks` expone el grafo entero.
- La cadena `permission` aparece **cero veces en las 8,498 líneas de la API pública**.

> **Consecuencia:** el control que proponía sacar el diagnóstico del frontmatter y meterlo en la
> prosa **no oculta el dato** — solo encarece extraerlo. Hay que decírselo al usuario en esos
> términos, no venderlo como protección.

Colateral útil: ese mismo cache hace casi gratis la clasificación local para el mapeo de campos.

---

## 6 · Decisiones de plataforma recomendadas

| Tema | Recomendación | Argumento decisivo |
|---|---|---|
| **Cliente** | **Expo** (4.50 ponderado) sobre RN bare, Flutter, PWA y Kotlin nativo | Velocidad para alguien que viene de React |
| **Alcance de la web** | **Acotarla**: landing, onboarding, dato ancho, privacidad y conversación con IA | El código compartido RN↔web es **de lógica, no de pantallas**. Las pantallas se escriben dos veces |
| **Backend** | Supabase (datos + Auth) + **un** servicio de dominio NestJS como único escritor + PowerSync | `apps/api` deja de ser opcional: **Android no puede hablar Prisma** |
| **API** | **REST + OpenAPI versionado**, no tRPC | Una app instalada **vive meses en versiones viejas**; tRPC no tiene versionado |
| **Windows** | **No** como app nativa. PWA instalable da el 80% a coste cero | Su única capacidad extra sería escribir la bóveda — y eso choca con §2 |
| **Bóveda** | **Un solo escritor lógico**, y corre en escritorio | Android no puede escribirla de forma fiable |
| **IA comercial** | IA incluida por defecto + **BYOK** para categorías no sensibles | **BYO no transfiere la responsabilidad del tratamiento**: Kibo sigue decidiendo qué sale |
| **Economía × IA** | **Las gemas compran acceso a la función, nunca tokens** | Si las gemas pagan inferencia, el usuario farmea hábitos para pagar tu factura |

---

## 7 · La IA: lo que cambió

- **MCP: el ingeniero cambió su veredicto.** Su objeción estratégica cae —cuando la tesis del
  producto es *ser el sustrato*, exponer una interfaz estándar **es** la tesis—. Y aparece un
  argumento mejor: la superficie MCP **obliga a que la arquitectura interna esté bien**, porque son
  las mismas herramientas con dos consumidores, los mismos permisos y la misma auditoría.
  Pero el orden de construcción no cambia: el MCP no debe existir antes que la matriz de residencia,
  el modelo de alcances y la bitácora.
- **Ninguna herramienta de salud o finanzas existe en la superficie MCP.** No desactivada:
  **ausente**. El conector MCP no es elegible para retención cero.
- **El aislamiento vive en el recuperador, no en el prompt.** Particionamiento físico por categoría,
  seguridad a nivel de fila, y el alcance como parámetro no sobrescribible. Los datos estructurados
  se consultan con herramientas parametrizadas, **no con embeddings** — un modelo respondiendo
  "cuántas veces corrí en julio" desde fragmentos se equivoca con confianza.
- **Una proyección derivada de salud sigue siendo dato de salud.** Las proyecciones son
  minimización, no blanqueo de categoría. Para v1: no cruzar la frontera de salud en absoluto.
- **Android reabre el cómputo local por un hecho nuevo:** Gemini Nano vive en AICore, el servicio de
  sistema — **no en el APK** —, así que el argumento de tamaño de binario que descartó los modelos
  locales en la ronda 2 se cae. Se mueven al teléfono: extracción de salud, dictado, compuerta de
  detección y embeddings del diario. No se mueven: chat, coach y misiones.
- **La ruta contractual para salud no vale la pena en v1.** El acuerdo sanitario resultó ser
  autoservicio desde la consola, pero detrás hay once requisitos, **dos organizaciones separadas**,
  una configuración permanente e irreversible, pérdida de procesamiento por lotes y de MCP en esa
  ruta, y revisión bajo dos jurisdicciones. Es un programa de cumplimiento, no una función.
  **La ruta en el dispositivo entrega la mayor parte del valor sin activar el Art. 12**, porque no
  hay transferencia a un tercero.
- **Se cierra un hueco abierto desde la ronda 1:** el dictado del RF-14 ya tiene proveedor —
  reconocimiento de voz en el dispositivo, gratis, sin que el audio salga del teléfono.
- **Coste: $0.75 → $1.01** por usuario activo al mes. **El chat es el 61%** y es la única partida sin
  techo natural.

---

## 8 · El orden de construcción cambió otra vez, y por una razón incómoda

**La proyección a la bóveda baja de fase 1 a fase 3.** El motivo lo dice el analista de stack sin
rodeos: **tú no usas Obsidian.** Empezar por ahí construye una función que tu usuario cero —tú— no
puede usar a diario.

El camino más corto a que Kibo te sirva es **el bucle diario en Android**: hábitos, tareas y racha.

Esto converge con lo que dijo UX en la ronda 2 por otro camino: la consulta médica es un ejemplo
conceptual correcto pero mal primer caso de uso, porque dos eventos al año no producen un momento
de conversión.

**Y la maqueta pasa de especificación a insumo.** ~40 pantallas a 1280px, con design system web y la
mascota en CSS: **no se transporta ninguna**. No bloquea la fase 0, pero **sí bloquea la fase 1**.

---

## 9 · El riesgo número uno ya no es técnico

Palabras del arquitecto: **"la arquitectura no es el riesgo del proyecto: el alcance lo es."**

App móvil offline-first + web + servicio de dominio + proyector de bóveda + conectores + capa de
contexto personal, construido por **una persona que está aprendiendo**, sobre un repositorio de
cinco commits sin una sola entidad de dominio. Cada decisión es defendible por separado; juntas son
varios años-persona.

Sus tres palancas para reducirlo: **acotar la web, no hacer Windows, y comprar autenticación y
replicación en vez de construirlas.**

---

## 10 · Decisiones abiertas para ti

1. **¿Quién escribe la bóveda?** (§2). Es la decisión que desbloquea o bloquea el resto, porque
   determina si tu caso de salud sobrevive con el argumento jurídico intacto.
2. **¿Se acota la web?** Implica que el bucle diario vive solo en Android durante un buen tiempo.
3. **¿Se acepta que cofres y tienda no funcionen sin red?** (§4.1).
4. **¿"Y de vuelta" sigue siendo requisito?** Si la bóveda es solo salida, todo el aparato de
   ingesta —parser endurecido, límites, frontmatter que no acuña moneda— aplica solo a la
   importación puntual. Si Kibo debe leer tus ediciones de forma continua, vuelve permanente. **Es
   la ambigüedad más cara sin resolver.**
5. **¿Arrancas ya la asesoría legal?** Dos pendientes bloquean el lanzamiento de Salud y Finanzas —
   que son el núcleo declarado— y su plazo no lo controlas. Hoy no hay código escrito: es el único
   momento en que arrancarlos no cuesta nada.

---

## 11 · Pendientes cerrados esta ronda

- **Ruta absoluta de la bóveda:** escritorio sí, móvil no. Confirma deshabilitar categorías
  sensibles en móvil.
- **Alcance del metadata cache de Obsidian:** cerrado contra fuente primaria (§5).
- **Proveedor de dictado para RF-14:** reconocimiento de voz en el dispositivo.
- **Decisión abierta #1 del ADR-0001** ("¿Recursos deja de ser editor?"): **se resolvió sola**. Si la
  bóveda es salida del sistema, no es un editor autoritativo — nunca hubo dos editores.

---

## 12 · Nota de evidencia

El dato verificado de Expo corresponde a su SDK 54 (septiembre 2025); no fue posible verificar la
versión vigente a agosto de 2026. Queda marcado como riesgo y como verificación previa a fijar
dependencias.
