# 04 · Mercado y prior art — Kibo × Obsidian

**Autor:** business-analyst (subagente) · **Fecha:** 2026-08-08
**Insumos leídos:** `00-brief.md`, `docs/product/PRD-kibo.md` (§1, §4, §5)
**Alcance de este documento:** evidencia de mercado, prior art, cultura de comunidad, veredicto
wedge/distracción, crítica de métricas, y plan de-riesgo de usuario cero. **No cubre** arquitectura
técnica, capa de IA, seguridad ni plan de fases (fuera de alcance por encargo).

**Nota de método:** cada cifra de mercado lleva fuente y fecha. Cuando dos fuentes se
contradicen (pasa varias veces con Obsidian, empresa que no publica métricas), muestro el rango
completo en vez de escoger la que más convenga al caso. Cuando no encontré una fuente primaria
verificable, lo digo explícitamente como **"no verificable"** en vez de estimar a ojo.

---

## 0 · Resumen ejecutivo

- Obsidian es una comunidad real, en crecimiento, con dinero probado dispuesto a pagar por
  *sync* y *publish* — pero **nadie sabe cuántos usuarios tiene, ni siquiera su propio CEO**
  (evidencia en §1). Cualquier TAM que alguien te dé tiene que traer ese disclaimer.
- **Nadie ha hecho "gamificación seria" dentro de Obsidian con éxito.** Los cinco plugins de
  gamificación nativa que existen tienen entre 0 y ~7,400 descargas — tres a cinco órdenes de
  magnitud por debajo de los plugins de utilidad (Dataview: 4.7M). El patrón es consistente:
  la comunidad *pide* gamificación en los foros con entusiasmo, pero no *adopta* lo que se
  construye (§2.1).
- **El PRD tiene un error factual que hay que corregir**: afirma que Todoist y Zotero "tienen
  plugin oficial" junto con Readwise. Es cierto solo para Readwise. Todoist nunca ha publicado
  un plugin propio (el más popular es de un tercero, Jamie Brynes) y Zotero tampoco (el
  estándar de facto es de otro tercero, mgmeyers) (§2.3).
- La cultura de la comunidad **no es solo "local-first" en el discurso — se organiza y construye
  software para evitarle a Obsidian su propia monetización** (el caso `obi-sync`, 1,000+
  estrellas, réplica gratuita de Obsidian Sync). Un plugin freemium con economía de gemas entra
  a un entorno que ya demostró que boicotea el cobro de su propio proveedor (§3).
- La política oficial de plugins **sí permite** cuentas y pagos si se declaran en el README —
  el riesgo no es de cumplimiento, es de percepción y adopción (§3).
- El objetivo del PRD (≥25% de usuarios de Recursos con bóveda vinculada a 90 días) no tiene
  base declarada y, comparado con benchmarks de adopción de funciones de integración/"power
  user" en SaaS (10–30% típico, casi nunca en el extremo alto), es optimista para una función de
  nicho dentro de un módulo que ya es de nicho (Recursos es premium) (§5).
- **Veredicto en una frase:** Obsidian es un canal de validación de nicho con señal real, no un
  wedge de adquisición masivo — la jugada correcta es más barata y más ancha de lo que propone
  el PRD (§4).

---

## 1 · Dimensionar la oportunidad

### 1.1 Usuarios — el número que nadie tiene

**Hecho verificado (fuente primaria, la más contundente de esta sección):** el propio CEO de
Obsidian, Steph Ango, escribió en LinkedIn (post con antigüedad "hace 1 año" al momento de la
consulta, es decir, aprox. 2025): *"No one knows how many users Obsidian has. I think it's
around 5-10 million people but I'm not sure?"*, y explica por qué: *"Anyone can download the app
and start using it without creating an account or talking to anyone, and there are no analytics
built-in."* (Steph Ango, LinkedIn, consultado 2026-08-08).

Esto no es una omisión de mi investigación — es una propiedad estructural de Obsidian (sin
cuenta obligatoria, sin telemetría) que hace que **ninguna cifra de usuarios sea verificable**,
ni siquiera para quien opera el producto. Todo lo que sigue son estimaciones con método y fecha
declarados, no un número de consenso:

| Estimación | Cifra | Método / fuente | Fecha |
|---|---|---|---|
| Obsidian (la empresa) | ~1 millón | Basado en conteo de descargas de GitHub (Fast Company, vía resumen de Wikipedia) | 2023 |
| Steph Ango (CEO), otra entrevista | "probablemente 3 o 4 millones" | Declaración verbal, sin metodología | fecha exacta no verificable, hallada en agregación de búsqueda |
| Steph Ango (CEO), LinkedIn | "5-10 millones, no estoy seguro" | Declaración propia, explícitamente incierta | ~2025 |
| Prensa/blogs secundarios (agregadores SEO) | "1.5M+ monthly active users" | **No verificable** — no encontré la fuente primaria de esta cifra; aparece repetida en sitios de reseñas sin cita | circula en contenido fechado 2026 |
| Prensa/blogs secundarios | "5 millones de descargas" | **No verificable** — mismo problema, sin fuente primaria localizable | circula en contenido fechado 2026 |

**Conclusión de esta subsección:** usa un rango, no un punto. Si necesitas un TAM para un
business case, el rango honesto es **"probablemente unos pocos millones de usuarios activos,
orden de magnitud, sin cifra oficial"** — y cualquier documento (interno o de pitch) que cite un
número puntual sin este disclaimer está mal sourceado.

### 1.2 Señales de comunidad (más confiables que "usuarios totales")

| Señal | Cifra | Fuente | Fecha |
|---|---|---|---|
| Discord oficial | 110,000+ miembros | Fast Company, vía Wikipedia | 2023 |
| r/ObsidianMD (entonces) | ~94,600 miembros, top 5% de Reddit | Fast Company, vía Wikipedia | 2023 |
| r/ObsidianMD (ahora) | 343,878 miembros, +12,307 en 30 días | redditli.st (agregador de terceros — no es Reddit ni Obsidian directamente; úsalo como señal direccional, no como cifra oficial) | consultado 2026-08-08 |

**Inferencia mía (no un hecho):** el subreddit creció ~3.6x en tres años. Aun con el
disclaimer de que es un agregador de terceros, la dirección (crecimiento sostenido, no
estancamiento) es consistente con lo que dicen las otras señales (descargas de plugins,
volumen de submissions). Trátalo como "la comunidad crece", no como "sabemos cuánto".

### 1.3 Disposición a pagar demostrada — este es el dato más sólido de toda la sección

Fuente primaria directa, `obsidian.md/pricing` y `obsidian.md/sync` (consultado 2026-08-08):

| Producto | Precio | Notas |
|---|---|---|
| App core | Gratis, uso ilimitado, incluso comercial | Sin límite de bóvedas |
| Sync Standard | US$5/mes (US$4/mes anual) | 1 bóveda, 1GB, 5MB máx./archivo, 1 mes de historial |
| Sync Plus | US$10/mes (US$8/mes anual) | 10 bóvedas, 10GB (ampliable a 100GB), 200MB máx./archivo, 12 meses de historial |
| Publish | US$10/mes (US$8/mes anual) | Publicar notas a la web |
| Catalyst | US$25 pago único | Acceso beta, insignia, canal VIP — sin recurrencia |
| Licencia comercial | US$50/usuario/año | Voluntaria; la app ya es gratis para uso comercial |

**Hecho verificado, contexto de la empresa** (BigGo Finance, artículo de prensa de negocios,
fecha de publicación no confirmable con certeza pero contenido fechado 2026; cifras financieras
de la *empresa* Obsidian, no de Sergio — no aplica la regla de retención financiera personal):
equipo de 7 personas + "gato de oficina", ~US$25M de ingreso recurrente anual reportado, sin
financiamiento externo (**"zero funding"**, anunciado públicamente por Ango en agosto de 2023 y
corroborado por múltiples fuentes independientes), valuación reportada de US$350M. **Trato estas
tres cifras financieras (revenue, valuación) como reportadas por prensa secundaria, no
confirmadas por una fuente primaria de Obsidian** — inclúyelas con esa salvedad si las repites.

**Contrapeso — evidencia de que una porción real de la comunidad activamente evita pagar por
Sync:** el proyecto `obi-sync` (GitHub, `acheong08/obi-sync`) es una reimplementación por
ingeniería inversa del protocolo de Obsidian Sync, gratuita y autohospedable. Alcanzó **1,000+
estrellas y 54 forks** antes de que Obsidian rompiera deliberadamente la compatibilidad (el
propio README documenta que Obsidian expresó descontento y el proyecto quedó archivado en enero
de 2024). Existen además alternativas activamente mantenidas y ampliamente usadas para evitar el
Sync de pago (`remotely-save`, sincronización vía Git, Dropbox/OneDrive/Syncthing como carpeta
compartida) — evidencia consistente de una subcultura de la comunidad que paga por *algunas*
cosas (Sync/Publish tienen ingresos reales) pero que **también construye activamente para no
pagar**, cuando puede.

### 1.4 Ecosistema de plugins — tamaño y crecimiento

Fuente primaria, blog oficial de Obsidian, `obsidian.md/blog/future-of-plugins/`, publicado
**2026-05-12** (consultado 2026-08-08):

- **4,000+ plugins y temas** creados desde el lanzamiento de la API de plugins en 2020.
- **120 millones de descargas totales** acumuladas de plugins.
- El equipo tuvo que automatizar la revisión porque la cola de submissions llegó a **2,300+**
  proyectos pendientes — en parte por adopción de agentes de código (LLMs) que aceleran la
  creación de plugins. Con el nuevo sistema, la revisión inicial es automatizada ("resultados en
  minutos") y un plugin aprobado queda disponible **en 24 horas**.
- Política existente: plugins sin actualizar que dejan de funcionar con versiones nuevas de
  Obsidian **son eventualmente removidos** del directorio.

**Corrección al PRD:** el §4 del PRD dice *"~2,000 plugins comunitarios"*. La cifra oficial
actual (mayo 2026) es más del doble: **4,000+**. No cambia la conclusión cualitativa del PRD
(ecosistema grande y activo), pero si el número se va a citar en otro documento, debe
actualizarse.

**Lectura favorable para Kibo, no mencionada en el brief:** la cola de revisión ya no es un
cuello de botella de meses — un plugin nuevo puede aprobarse en cuestión de horas si pasa la
revisión automatizada. El costo de *entrada* al directorio bajó considerablemente desde que se
escribió el PRD original de gamificación de nicho (los plugins de gamificación más viejos de
la lista de abajo llevan 2-5 años sin actualizarse, de una época con revisión manual más lenta).

---

## 2 · Prior art exhaustivo

### 2.1 Plugins de gamificación dentro de Obsidian — el dato más importante de este documento

Verificado directamente en `obsidianstats.com` (consultado 2026-08-08), plugin por plugin (no
uso las páginas de listado por tag de ese sitio — al probarlas encontré inconsistencias: la
página de tag `#gamification` mostró para un plugin "0 descargas / 5,017 estrellas" mientras que
su repositorio real en GitHub muestra 66 estrellas; documento el hallazgo y trabajo solo con
páginas individuales de plugin, que sí coincidieron con GitHub cuando las crucé).

| Plugin | Descargas | Estrellas GitHub | Última actualización | Estado |
|---|---|---|---|---|
| **Grind Manager** (`dromse/obsidian-gamified-tasks`) — monedas por tarea, tienda de recompensas | 7,377 | 93 | ~5 meses | El más activo del grupo, pero sigue siendo nicho |
| **Habitica Sync** (`obsidian-habitica-integration`) — panel de Habitica dentro de Obsidian | 9,197 | 110 | ~5 años (v1.0.2) | Abandonado, 11 issues abiertos sin resolver |
| **Habits** (oficial reciente, streaks/heatmaps) | 792 | — | 7 días | Muy nuevo, aún sin tracción medible |
| **Obsidian Gamified PKM** (`saertna/obsidian-gamified-pkm`) | No listado en el directorio con descargas medibles | 66 (verificado en GitHub directo) | activo (713 commits) | Proyecto GitHub con desarrollo real, pero sin adopción medible dentro de Obsidian |
| Rewarder, Performium, RPG Stat Tracker, Achievements | Cifras de una fuente secundaria con inconsistencias detectadas — orden de magnitud "decenas a bajos cientos" cada uno, no verificado con precisión | — | 1-4 años sin actualizar (varios) | Nicho profundo, mantenimiento mínimo o nulo |

**Comparación de escala** (misma fuente, mismo día, para calibrar qué es "grande" en este
ecosistema): **Dataview** (consultas sobre notas) — 4,717,623 descargas. **Tasks** (gestión de
tareas `- [ ]`) — 3,700,210 descargas. **Local REST API con MCP** (expone la bóveda vía HTTP,
relevante para el punto técnico 3 del PRD) — 591,379 descargas.

**Lectura de esto (inferencia mía, con la evidencia de arriba como base):** existe una brecha de
3 a 5 órdenes de magnitud entre "plugin de utilidad que resuelve un dolor real de PKM" y "plugin
de gamificación". Esto no es ruido — se repite en los cinco plugins de gamificación nativa que
existen, con distintos autores, distintos años de lanzamiento, y distintos enfoques (RPG con
monstruos, monedas y tienda, integración directa con Habitica). Ningún enfoque de gamificación
nativa ha roto ese techo en seis años de ecosistema de plugins.

**Contraste importante — la demanda *declarada* sí existe:** encontré dos hilos del foro oficial
de Obsidian pidiendo exactamente esto:
- *"A plugin that Gamifies Obsidian"* (forum.obsidian.md, 2026-01-31) — logros por metas de
  palabras/notas, sistema de niveles. Respuesta: un desarrollador anunció *"Working on this"*, sin
  objeciones de la comunidad.
- *"Gamification plugin"* (forum.obsidian.md, 2021-09-02) — un usuario pide fórmulas de XP
  flexibles tipo RPG; otro responde *"I'd love to see something like this, with flexible formulas
  to increase xp in the various rpg stats of your life every time you complete a task"*.

**La tensión que hay que resolver, no ignorar:** hay entusiasmo genuino cuando se *pide* la idea
en abstracto, y adopción casi nula cuando alguien la *construye*. Mi lectura: la gente que
frecuenta el foro de Obsidian pidiendo gamificación es, en su mayoría, la misma que ya usa
Habitica, Duolingo, o apps de hábitos por separado — quiere el *concepto* dentro de su vault,
pero cuando llega el momento de instalar y mantener el hábito, un plugin de nicho mono-mantenido
no compite con una app dedicada. Esto es exactamente la tesis del PRD de Kibo sobre por qué
Notion/Obsidian no generan hábito por sí solos — y aquí se confirma también *dentro* de Obsidian.

### 2.2 Habitica y su ecosistema — el competidor conceptual

**Hecho verificado, con salvedad de vigencia importante:** la cifra de "900,000 usuarios" de
Habitica que circula en reseñas de 2026 proviene de publicaciones del blog oficial de Habitica
(`blog.habitrpg.com`) con fecha rastreable hasta **abril de 2017**. No encontré una cifra de
usuarios de Habitica más reciente en una fuente primaria — **no verificable para 2026**.
Wikipedia (`Habitica`, consultado 2026-08-08) tampoco reporta estadísticas de usuarios,
ingresos ni empleados vigentes; solo hitos: fundada el 30 de enero de 2013, campaña de Kickstarter
de enero de 2013 (recaudó más de US$40,000 sobre una meta de US$25,000), renombrada de HabitRPG a
Habitica el 31 de julio de 2015, y una salida de moderadores en desacuerdo con el equipo en
diciembre de 2022.

**Ingresos reportados (secundario, no confirmado por Habitica directamente):** ~US$5.3M anuales,
~11 empleados (growjo/konaequity, agregadores de datos de empresas privadas que suelen estimar
por proxies, no por declaración directa de la empresa) — trátalo como estimación de baja
confianza.

**Precio verificado (fuente: wiki oficial de la comunidad, Habitica Wiki/Fandom):**
suscripción US$4.99/mes, US$14.99/trimestre, US$29.99/semestre, US$47.99/año.

**Ecosistema de integraciones — hallazgo relevante para Kibo:** Habitica **no tiene integración
oficial de primera parte** con Google Calendar, Apple Health, Fitbit, Strava, ni con ninguna
herramienta de productividad mayor. Su API pública permite webhooks y extensiones de terceros
(navegador, userscripts), y existe conectividad no oficial vía plataformas de automatización
(Make, MindCloud) hacia Todoist/Notion/Discord/Google Sheets. **El propio "competidor conceptual
más directo" de Kibo tiene un ecosistema de integraciones más pequeño que el de Obsidian**, lo
cual es evidencia indirecta de que integrar profundamente con un PKM no es lo que hizo crecer a
Habitica — su tracción vino del loop social/RPG en sí mismo, no de conectarse a otras
herramientas.

Sobre Obsidian específicamente, existen dos plugins de puente Habitica↔Obsidian
(`habitica-sync` de SuperChamp234 y `Habsiad` de dotMavriQ). El primero está marcado como
*"under-development"* en su propio README y no tiene descargas medibles reportadas de forma
confiable; el de mayor tracción (`obsidian-habitica-integration`, 9,197 descargas) lleva 5 años
sin actualizarse (ver tabla en §2.1).

### 2.3 SaaS con plugin en Obsidian — el patrón, y una corrección al PRD

El PRD (§4, punto 4) afirma: *"Readwise, Todoist, Zotero tienen plugin oficial"*. Verificado uno
por uno:

| Producto | ¿Plugin oficial (hecho por la empresa dueña del producto)? | Evidencia | Descargas / adopción |
|---|---|---|---|
| **Readwise** | **Sí, verdaderamente oficial.** El repositorio vive en la organización de GitHub `readwiseio` (la propia empresa). Anunciado en el foro oficial de Obsidian en 2021. | `github.com/readwiseio/obsidian-readwise`, `docs.readwise.io` | 233,682 descargas, 355★, actualizado hace ~3 meses (obsidianstats, 2026-08-08) |
| **Todoist** | **No.** Doist (la empresa) nunca ha publicado un plugin propio. El más popular ("Sync with Todoist") es de un desarrollador independiente, Jamie Brynes, sin afiliación con Doist — su propia documentación lo aclara. | `github.com/jamiebrynes7/obsidian-todoist-plugin` | 174,522 descargas, 1,188★, actualizado hace ~6 meses. Existen 3+ plugins de terceros compitiendo por el mismo caso de uso (Ultimate Todoist Sync, Syncist, Another Simple Todoist Sync) |
| **Zotero** | **No.** El estándar de facto ("Zotero Integration", antes "Obsidian Zotero Desktop Connector") es de un desarrollador independiente, mgmeyers, sin relación corporativa con Zotero. No encontré declaración oficial de Zotero respaldándolo. | `github.com/mgmeyers/obsidian-zotero-integration` | 504,347 descargas, 1,742★, actualizado hace ~2 años |

**Esto corrige una premisa del PRD:** de los tres ejemplos citados como "vía que usan los
productos serios", **solo uno (Readwise) es realmente oficial.** Los otros dos son evidencia de
que la demanda de integración es real y sostenida (cientos de miles de descargas, años de
mantenimiento comunitario) **incluso sin que la empresa dueña del producto mueva un dedo.** Dicho
de otro modo: la comunidad de Obsidian construye sus propios puentes cuando el valor es
suficiente, con o sin bendición oficial. Esto es una señal a favor de la demanda subyacente, pero
en contra del argumento de que "hay que ser oficial para ganar" — de hecho el patrón dominante
observado es *comunitario, no oficial*.

**El caso de advertencia — Omnivore:** app de lectura diferida de código abierto, con plugin
propio para Obsidian y Logseq, con una base de usuarios leal especialmente entre desarrolladores
y usuarios de Obsidian (Creativerly, MacPowerUser Talk, consultado 2026-08-08). **ElevenLabs
adquirió Omnivore el 1 de noviembre de 2024 y la apagó el 15 de noviembre de 2024** — dos semanas
de aviso, sin modo de solo lectura, sin archivo, y los datos de usuarios fueron borrados
(5typos.net, Gleamr, consultado 2026-08-08). El equipo se fue a trabajar en text-to-speech para
ElevenLabs, no en herramientas de lectura. **Lección directa para Kibo:** un plugin de Obsidian
que depende de un backend SaaS vivo muere quince días después de que su empresa decide apagarlo,
sin importar cuánta lealtad tenía la comunidad. Si Kibo (producto que hoy no existe en producción)
promete un puente vivo hacia Obsidian, la comunidad de Obsidian — que ya vivió este patrón con
Omnivore — tiene motivos concretos y recientes para ser escéptica de invertir tiempo en adoptarlo
temprano.

### 2.4 Competidores del "second brain gamificado"

| Producto | Modelo | Gamificación real | Financiamiento / precio | Fuente / fecha |
|---|---|---|---|---|
| **Amplenote** | Notas + tareas con "Task Score" (matriz de Eisenhower automatizada) | Marginal — es priorización algorítmica, no RPG (sin XP, niveles ni recompensas) | — | Reseñas de producto, consultado 2026-08-08 |
| **Tana** | Base de conocimiento tipo outliner + IA | Ninguna | ~US$8-10/usuario/mes según tier (fuente secundaria/agregador, confianza moderada) | Agregadores de reseñas, contenido fechado 2026 |
| **Capacities** | PKM con "objetos" tipados | Ninguna | US$10/mes plano tras tier gratuito (fuente secundaria) | ídem |
| **Reflect** | Notas con IA nativa | Ninguna | Desde US$10/mes (fuente secundaria) | ídem |
| **Anytype** | "Everything app" local-first, código abierto | Ninguna | Gratis / open-source | ídem |
| **Logseq** | Outliner local-first, código abierto | Ninguna | Gratis (financiado por ronda de capital) | Blog oficial de Logseq: **US$4.1M** recaudados, inversionistas incluyen a Patrick Collison, Nat Friedman, Tobias Lütke, Sriram Krishnan, Craft Ventures (`blog.logseq.com`, fuente primaria) — anuncio de re-arquitectura "Logseq DB" el 2026-05-16 (`discuss.logseq.com`, fuente primaria) |

**Hallazgo clave:** **ninguno** de los competidores directos de "second brain" — financiados o
no, con o sin IA — ha adoptado mecánicas de juego (XP, niveles, HP, rachas con penalización) como
propuesta de valor central. Esto se puede leer de dos formas opuestas, y ambas son defendibles:

1. **Lectura optimista:** es un espacio en blanco genuino; nadie ha combinado bien PKM serio con
   gamificación real, y la tesis del PRD (herramientas de organización con modelo de datos
   correcto pero retención frágil) tiene sentido como oportunidad.
2. **Lectura escéptica:** los productos de PKM más financiados y con más usuarios *evitaron
   deliberadamente* la gamificación — posiblemente porque su público (gente que hace conocimiento
   profesional/académico serio) percibe XP y niveles como infantilizante o incompatible con el
   uso que le da a la herramienta, y por eso los intentos de plugin de gamificación (§2.1) se
   quedan en decenas de descargas.

No hay evidencia que resuelva esta ambigüedad de forma concluyente — la trato como incertidumbre
real, no la fuerzo hacia una conclusión. Mi peso relativo hacia una u otra lectura aparece en §4.

---

## 3 · La cultura de la comunidad Obsidian

### 3.1 Lo que la política oficial permite (esto sorprende — es más permisivo de lo que el brief
asume)

Fuente primaria, política de desarrolladores de Obsidian (contenido verbatim, consultado
2026-08-08 vía réplica espejo confirmada del documento oficial):

- **Prohibido:** telemetría del lado del cliente sin excepción.
- **Permitido con revelación:** telemetría del lado del servidor, con enlace a política de
  privacidad.
- **Permitido con revelación:** *"Payment is required for full access"* y *"An account is
  required for full access"* — ambos deben declararse claramente en el README.
- **Prohibido:** anuncios dinámicos cargados de internet, o anuncios estáticos fuera de la
  interfaz propia del plugin.
- **Permitido:** anuncios estáticos dentro de la interfaz del propio plugin.

**Conclusión de cumplimiento:** un plugin "Kibo para Obsidian" que requiera cuenta y que gatee
funciones premium detrás de un pago (o de gemas), **sí es compatible con la política oficial**,
siempre que esté declarado en el README y no incluya telemetría oculta del cliente. El riesgo no
es de aprobación en el directorio — es de percepción de la comunidad, que es más estricta que la
política escrita (ver 3.2).

### 3.2 Lo que la cultura real castiga (evidencia, no solo discurso)

- **Auto-organización contra el cobro del propio proveedor:** el caso `obi-sync` (§1.3) — mil
  estrellas en GitHub para replicar gratis algo que la propia Obsidian cobra US$4-10/mes. No es
  un plugin marginal ignorado; es un proyecto que la empresa Obsidian consideró necesario romper
  activamente.
- **Narrativa de comunidad influyente contra "features forzadas":** Nick Milo (figura reconocida
  de la comunidad, creador del método "Linking Your Thinking") escribió en su Substack
  (`nickmilo.substack.com/p/obsidian-just-won`, publicado 2026-02-06) que la ventaja decisiva de
  Obsidian frente a competidores es que el usuario puede *"point AI at a folder and you're done"*
  o desactivarlo del todo — contrastándolo con competidores que "obligan" suscripciones de IA. La
  autonomía del usuario, no la potencia de la función, es el argumento que gana en esta comunidad.
- **La IA sí se acepta — pero con la opción de mantenerla local y transparente:** en la discusión
  del plugin "Smart Connections" (uno de los plugins de IA más usados dentro de Obsidian,
  `github.com/brianpetro/obsidian-smart-connections/discussions/157`), la recepción fue positiva
  precisamente porque **ofrece la opción de correr el modelo localmente**, sin mandar notas a la
  nube; algunos usuarios expresan incomodidad explícita con la idea de que un servicio en la nube
  vea "pensamientos no publicados". La aceptación de IA en esta comunidad es condicional a que el
  usuario controle el destino de sus datos, no un rechazo total.
- **Pérdida de datos es la falta capital:** una guía de revisión de plugins ampliamente
  referenciada en la comunidad (Liam Cain, revisor histórico de la cola oficial de plugins)
  resume el estándar así: *"data loss is the fastest way to lose a user's trust"* — y advierte
  que un solo plugin problemático puede hacer que el usuario desconfíe de instalar cualquier otro
  plugin en el futuro. Esto es relevante directamente para el punto técnico 1 del PRD (conflictos
  de escritura simultánea, resueltos con "última escritura gana") — en esta comunidad, ese
  approach no es un detalle de implementación menor, es el tipo de decisión que determina si el
  plugin sobrevive a su primera reseña negativa.

### 3.3 Qué le pasaría a un plugin de Kibo con freemium + gemas en este entorno

**Esto es mi análisis, con la evidencia de arriba como base — no es un hecho verificado, es una
inferencia razonada:**

1. **Cumpliría la política, no chocaría con moderación.** No hay riesgo de rechazo automático del
   directorio por tener cuenta o pago, si se declara.
2. **El filtro real es la primera impresión en el foro/Reddit el día del lanzamiento.** Esta
   comunidad reacciona rápido y públicamente a "otra app de suscripción que quiere meterse en mi
   vault". La combinación específica que más fricción generaría, en orden de severidad:
   - Requerir cuenta en la nube de Kibo para funciones básicas del plugin (no solo premium).
   - Cualquier sospecha de que el plugin manda contenido del vault a un servidor sin control claro
     del usuario sobre cuándo y qué (paralelo directo a la preocupación documentada sobre Smart
     Connections en 3.2).
   - Economía de gemas/monedas visible *dentro* de Obsidian misma — la mecánica de conversión
     (monedas → gemas solo vía cofres, según el modelo de Kibo) es exactamente el tipo de "loop de
     casino" que esta audiencia (mayoritariamente gente de productividad/conocimiento serio, no
     gente que busca estética "gamer") tiende a etiquetar como ruido o cinismo comercial en un
     entorno que se percibe a sí mismo como una herramienta profesional.
3. **Lo que sí toleraría bien, con evidencia de que el precedente funciona:** un plugin que (a)
   es gratis en su capa mínima dentro de Obsidian (ver racha/HP, marcar hábito, enviar nota — el
   F1 del PRD), (b) dice explícitamente qué datos salen del vault y por qué, (c) no escribe nada
   invasivo en los archivos del usuario, y (d) deja clarísimo que lo premium vive en Kibo (la app
   web), no dentro del plugin. Esto es, de hecho, el patrón de Readwise: el plugin en sí es
   gratuito para instalar; lo que cuesta es la suscripción a Readwise, y esa distinción se declara
   sin ambigüedad.

---

## 4 · La pregunta de fondo: ¿wedge o distracción?

### El caso a favor de "wedge" (adquisición real)

- Hay demanda declarada y repetida en los foros de Obsidian por gamificación (§2.1) — la gente
  *pide* esto, no hay que inventarle el deseo.
- Los plugins de integración de terceros (Todoist, Zotero) demuestran que un puente bien hecho
  puede acumular cientos de miles de descargas incluso sin respaldo oficial — el canal en sí
  funciona cuando el valor es real.
- El perfil de usuario de Obsidian (gente que ya se organiza en Markdown, con disciplina de
  escritura) es, en teoría, exactamente el tipo de usuario "de alto valor ya organizado" que un
  producto de hábito querría — si logras engancharlo, es un usuario con retención estructural
  alta por definición (ya tiene el hábito de escribir).
- El costo de entrada al directorio de plugins bajó (revisión en 24h, §1.4) — el riesgo de
  distribución es menor que hace un año.

### El caso a favor de "distracción"

- El propio mercado ya corrió este experimento seis años y el resultado es consistente: ningún
  plugin de gamificación nativa superó las ~9,200 descargas, y el más "vivo" del grupo
  (Grind Manager) sigue en un solo mantenedor part-time con 93 estrellas. Si la gamificación
  dentro de Obsidian tuviera un mercado grande esperando ser servido bien, alguien en seis años y
  cuatro mil plugins lo habría demostrado con más que un puñado de descargas.
- El propio Habitica — el competidor conceptual más directo, con más de una década de operación —
  **no invirtió** en integraciones profundas con PKM como estrategia de crecimiento (§2.2). Si el
  jugador que mejor conoce este espacio no apostó ahí, es una señal, no una casualidad.
- Los competidores de PKM mejor financiados (Logseq con US$4.1M, Tana, Capacities) evitaron la
  gamificación por completo — ninguno la considera diferenciador que valga la inversión.
- Sergio no es usuario de Obsidian (constatado en el brief). Construir para una comunidad con
  normas culturales tan específicas y tan poco toleradas al error (§3.2 — "data loss is the
  fastest way to lose a user's trust") sin intuición de usuario propia es exactamente el tipo de
  apuesta que se paga cara en tiempo de diseño y en reputación temprana si se lanza mal.
- Kibo hoy es una maqueta sin backend de notas construido (confirmado en el brief, §2.1-2.2) —
  cualquier inversión en Obsidian compite por tiempo de Sergio contra construir el propio producto
  central, que todavía no existe.

### La alternativa que el PRD no exploró a fondo: "compatible con Markdown/local-first" en vez de "Obsidian"

El PRD ya diseñó el F0 correcto por accidente: Recursos usa `.md`, wikilinks, tags y carpetas —
el mismo modelo que usan Obsidian, Logseq, **y cualquier editor de texto plano**. Eso significa
que la promesa de compatibilidad no depende de una integración especial con Obsidian — depende
del *formato*. Posicionarse como "compatible con Markdown local-first" en vez de "integrado con
Obsidian" tiene estas ventajas concretas:

- Cubre a la vez a usuarios de Obsidian, Logseq (competidor con financiamiento propio, §2.4),
  y a cualquiera que simplemente use una carpeta de `.md` sin ninguna app — sin trabajo adicional
  de ingeniería específico de una API de plugin.
- Evita la superficie de riesgo de reputación con la comunidad de Obsidian específicamente,
  mientras sigue siendo honesto y verificable (el formato SÍ es compatible, sin necesidad de
  jurar lealtad a una sola app de terceros).

### Mi veredicto

**Obsidian no es un wedge de adquisición masivo para Kibo. Es un canal de validación de nicho con
señal real, del tamaño correcto para una apuesta pequeña y barata (F0 + un F1 mínimo), no para el
proyecto insignia que el PRD sugiere con "F2 espejo bidireccional".** La evidencia de prior art
(§2.1) es demasiado consistente en seis años y cuatro mil plugins como para apostar lo contrario
sin una razón nueva que nadie más tuvo. La posición correcta, más barata y más ancha, es la
markdown/local-first compatible por diseño (que el PRD ya logró con Recursos sin saberlo) — y
tratar el plugin de Obsidian específico como un experimento de bajo costo dentro de esa
estrategia más amplia, no como la estrategia misma.

---

## 5 · Reto a la métrica del PRD

**La métrica del PRD:** *"Integración Obsidian: ≥25% de usuarios de Recursos con bóveda vinculada
a los 90 días de F2."*

### Problemas con la métrica tal como está escrita

1. **No tiene base declarada.** No hay cita, benchmark ni supuesto explícito detrás del 25% — es
   un número puesto, como el propio brief sospecha (§5 del brief, pregunta explícita a resolver).
2. **El denominador ya es un subconjunto de nicho de un subconjunto de nicho.** "Usuarios de
   Recursos" es en sí mismo un módulo premium (histórico: 300 gemas de desbloqueo, según el
   brief §3.6). Pedir que 1 de cada 4 usuarios de un módulo premium, dentro de un producto que
   aún no tiene usuarios, vincule además una herramienta externa específica (Obsidian, que ni
   siquiera todo mundo tiene instalado) es una cadena de condicionales optimista.
3. **Está atada a F2 (espejo bidireccional)**, la fase más cara y más frágil técnicamente según el
   propio brief (§1, punto 3) — mide el resultado de la apuesta más arriesgada sin medir nada
   antes en F0/F1 para saber si vale la pena llegar a F2.

### Benchmarks de referencia (con salvedad de fuente)

No encontré un benchmark público específico para "adopción de integración con una app de PKM de
terceros" — no existe ese dato de industria. Lo más cercano y honesto es un benchmark general de
adopción de funciones secundarias/de integración en SaaS, ampliamente citado en fuentes
secundarias de producto que a su vez citan el reporte de Pendo (no pude acceder directamente al
reporte primario de Pendo para confirmar el número exacto — trátalo como **benchmark de la
industria, de confianza moderada, no verificado en fuente primaria**):

- Funciones núcleo del flujo de trabajo: 60-90% de adopción a 30-60 días.
- Funciones secundarias: 30-60%.
- **Funciones de power-user / integraciones (la categoría donde cae "vincular Obsidian"):
  típicamente 10-30%, con 15-20% como punto medio citado para funciones de reporting/integración
  avanzada.**

Con ese punto de referencia, **25% no es descabellado como techo de la categoría "power
user/integración" en general** — pero está en el extremo alto de ese rango, para una integración
más nueva/nicho (Obsidian, no un CRM establecido) y aplicada sobre un módulo ya premium. Mi
lectura: **25% es optimista pero no absurdo si se mide bien; el problema real no es el número, es
que mide la fase equivocada (F2) sin puntos de control antes.**

### Métricas alternativas que propongo (con método de medición)

En vez de una sola métrica al final de la fase más cara, una escalera de métricas líder por fase,
cada una con su propio umbral defendible y su propio "no lo hagas":

| Fase | Métrica | Método de medición | Umbral sugerido (etiquetado como estimación razonada, no dato de mercado) |
|---|---|---|---|
| **F0** (import/export, ya construido por diseño) | % de nuevos usuarios de Recursos que usan "importar bóveda" en su primera semana | Evento de producto: `vault_import_started` / `vault_import_completed` sobre usuarios que activan Recursos | 5-10% — si ni siquiera el import gratuito y de un solo clic se usa, F1/F2 no tienen piso |
| **F1** (plugin, racha/hábitos visibles en Obsidian) | % de usuarios de Recursos que instalan el plugin, medido por activaciones únicas reportadas por el propio plugin | Telemetría server-side del plugin (declarada en README, conforme a política de Obsidian §3.1), no telemetría de cliente | 3-8% de usuarios de Recursos a 90 días — coherente con el extremo bajo-medio del benchmark de power-user features, ajustado a la baja porque es la primera versión de un plugin nuevo sin marca reconocida |
| **F2** (espejo bidireccional) | % de usuarios del plugin F1 que activan sync bidireccional Y lo mantienen activo a 90 días (no solo "lo prendieron una vez") | Retención del feature, no adopción puntual — evita la trampa de contar "vinculó alguna vez" como éxito | Solo fijar meta si F1 alcanza su umbral — de lo contrario, no construir F2 |

**Por qué "retención de la conexión" y no "vinculada alguna vez":** el PRD actual mide un evento
puntual (¿se vinculó?), no si el usuario siguió usando la integración. Dado el patrón de
abandono observado en los plugins de terceros analizados (Habitica Sync sin actualizar en 5 años,
Zotero Integration en 2 años, ambos con miles de usuarios que instalaron pero cuya app no innova
más) — "instalado" y "activo" son cosas muy distintas en este ecosistema específicamente.

---

## 6 · Mitigar el riesgo de usuario cero

Sergio no usa Obsidian. Antes de construir nada de F1 (plugin) o F2 (sync), esto es lo más barato
para conseguir señal real:

### A quién entrevistar (5-8 personas, no una encuesta masiva)

- **3-4 usuarios activos de Obsidian que también usan una app de hábitos o gamificación por
  separado** (Habitica, Duolingo, apps de hábitos) — son el arquetipo exacto que el PRD apuesta a
  convertir. Reclutar en r/ObsidianMD (343K miembros, §1.2) y en el Discord de Obsidian con un
  post directo, no con un intermediario.
- **2-3 usuarios de Obsidian que YA probaron o abandonaron un plugin de gamificación/hábitos**
  (buscar autores de reseñas o issues en los repos de §2.1: Grind Manager, Habitica Sync, Habits)
  — son la fuente más barata de saber por qué algo similar no pegó, de primera mano.
- **1-2 usuarios de Logseq o Anytype** (no solo Obsidian) — para probar si la sed es por
  "gamificación de mi PKM" en general o específicamente por Obsidian, dato clave para decidir
  entre el veredicto de §4 (Obsidian específico) y la alternativa (Markdown local-first general).

### Qué preguntar (guion corto, no un cuestionario largo)

1. "Camíname por tu sistema de hábitos/tareas hoy — ¿qué vive en Obsidian y qué vive en otra
   app?" (mapea el dolor real, no el hipotético).
2. "¿Alguna vez instalaste un plugin de hábitos/gamificación en Obsidian? ¿Qué pasó — lo sigues
   usando?" (valida o refuta el patrón de abandono de §2.1 con testimonio directo).
3. "Si una app externa (web, con cuenta) te ofreciera ver tu racha y ganar puntos por escribir en
   Obsidian, ¿qué necesitarías saber para instalarla?" (expone objeciones de cultura de §3 antes
   de construir).
4. "¿Pagarías por eso? ¿Cómo — suscripción, compra única, nunca?" (sondeo de disposición a pagar
   específico para esta oferta, no genérico).
5. Mostrar 2-3 mockups estáticos (no funcionales) del plugin propuesto y pedir que señalen, sin
   guiarlos, qué les genera desconfianza o rechazo inmediato.

### Prototipo de humo — el más barato antes de construir

- **Landing de una página** (no un producto), en español/inglés según dónde se publique,
  explicando "Kibo para Obsidian: lleva tu racha y tus hábitos a tu vault" con un botón de
  "notifícame cuando esté listo" (captura de correo). Publicar el enlace en r/ObsidianMD (si las
  reglas del subreddit lo permiten — verificar antes, muchos subs de herramientas prohíben
  autopromoción directa) y en el foro oficial de Obsidian, sección "Plugins ideas" (donde ya
  existen los dos hilos citados en §2.1 — responder ahí primero, con la idea, antes de una landing
  separada, es más barato y más nativo a la cultura de la comunidad que un anuncio externo).
- **Alternativa aún más barata:** responder directamente en el hilo *"A plugin that Gamifies
  Obsidian"* (forum.obsidian.md, enero 2025, todavía reciente y activo) presentando el concepto de
  Kibo y midiendo la reacción real de esa comunidad específica — costo cero, audiencia ya
  autoseleccionada, y evita el riesgo de "app externa desconocida invade el foro" al participar
  en una conversación que la comunidad ya empezó.

### Qué resultado significa "no lo hagas"

- Menos de ~20-30 registros de interés en la landing/hilo tras dos semanas de exposición
  orgánica en foro + subreddit (referencia: el hilo de enero 2025 sobre gamificación generó
  interés cualitativo pero de un puñado de personas, no una ola — replicar ese orden de magnitud
  o menos es la señal de "no hay demanda latente suficiente").
- En las entrevistas, si la objeción #3 (desconfianza de cuenta externa/cloud) aparece en la
  mayoría sin que el entrevistado la resuelva solo cuando se le explica el modelo de datos —
  es la misma objeción documentada en §3.2 (Smart Connections, obi-sync) confirmándose con
  usuarios reales, no solo en foros.
- Si los 2-3 usuarios que abandonaron un plugin de gamificación dan la misma razón que la
  evidencia de §2.1 sugiere (ya tienen Habitica/Duolingo aparte y no quieren duplicar el sistema)
  — es la confirmación directa de que Kibo competiría por el mismo hábito, no lo complementaría,
  dentro de Obsidian.

---

## Recomendación

**Veredicto: GO condicionado — pero a una versión mucho más pequeña, más barata y más ancha que
la que describe el PRD hoy.**

### Condiciones para el "go"

1. **Reencuadrar la estrategia de compatibilidad de "Obsidian" a "Markdown/local-first" antes de
   escribir una sola línea de plugin.** F0 (import/export, formato compatible por diseño) ya
   cumple esto sin trabajo adicional — es la apuesta de costo casi cero y beneficio real, y debe
   quedar como la única pieza obligatoria de esta iniciativa en el corto plazo.
2. **F1 (plugin) solo se construye si la validación barata de §6 da señal positiva real** —
   registros de interés de al menos el doble del piso citado arriba, y ausencia de rechazo
   dominante a la objeción de cuenta/cloud en las entrevistas. Sin esa señal, F1 se queda en
   backlog indefinidamente, no se construye "porque ya está diseñado".
3. **F2 (espejo bidireccional) no se aprueba hasta que F1 demuestre retención de la conexión**
   (no solo activación) en el umbral propuesto en §5 — es la fase más cara y la que menos
   evidencia de prior art tiene a su favor en todo este análisis.
4. **El plugin, si se construye, debe ser gratis en su capa mínima dentro de Obsidian**, con la
   monetización viviendo explícitamente en Kibo (la app web) — replicando el único patrón de la
   categoría con evidencia de éxito sostenido (Readwise, §2.3), no el patrón de "freemium con
   gemas visible dentro del vault" que la evidencia cultural de §3 sugiere que generaría rechazo.

### Las 3 cosas que más me preocupan

1. **Que "F2 espejo bidireccional" se construya por inercia de diseño (porque ya está en el PRD
   con detalle) sin que nunca haya pasado el filtro de F0/F1.** Es la apuesta más cara del
   documento y la que menos precedente de éxito tiene en seis años de historia del ecosistema.
2. **Que el modelo de gemas/cofres de Kibo se exponga dentro de Obsidian mismo.** La evidencia
   cultural (§3) es consistente y viene de múltiples ángulos independientes (obi-sync, Smart
   Connections, la guía de revisión de plugins) apuntando a que esta comunidad específica
   distingue con dureza entre "herramienta que respeta mis archivos" y "producto que quiere
   monetizarme dentro de mi vault" — y no hay ningún caso en la evidencia recolectada de una
   economía de juego (monedas/gemas) expuesta dentro de un plugin de Obsidian con adopción
   relevante.
3. **Que se mida el éxito con la métrica del PRD tal cual está (25% a 90 días de F2) en vez de la
   escalera de métricas de §5**, lo cual haría que el equipo descubra que la apuesta no funcionó
   solo después de haber construido la parte más cara, en vez de descubrirlo barato en F0/F1.
