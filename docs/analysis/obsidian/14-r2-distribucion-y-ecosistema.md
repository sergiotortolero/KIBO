# 14 · Ronda 2 — Distribución del conector y ecosistema de convenciones

**Autor:** business-analyst (subagente) · **Fecha:** 2026-08-08
**Depende de:** `04-mercado-y-prior-art.md` (ronda 1) — este documento es el **delta**, no repite
market sizing, prior art de gamificación, ni el análisis de cultura de comunidad ya cubiertos ahí.
Cítalo como "R1 §X" cuando haga falta el argumento completo.

**Corrección de encuadre que dispara esta ronda (textual de Sergio, vía Claudio):** *"No me
refería a que no generemos un plugin para intercomunicar los sistemas, me refiero a que no quiero
que la plataforma de Kibo sea un plugin dentro de Obsidian."* Operativamente: sí conector delgado,
no UI de producto (racha, HP, hábitos, XP, gemas, cofres) dentro del vault, y Obsidian deja de
pensarse como canal de adquisición.

---

## 1 · Veredicto recalculado

El veredicto de R1 (§4, "GO condicionado") se apoyaba en tres preocupaciones (R1, sección
"Recomendación"): (1) la comunidad no adopta gamificación nativa, (2) la economía de gemas/cofres
dentro del vault genera rechazo cultural, (3) F2 se construye por inercia sin validación previa.

**El nuevo encuadre desactiva la preocupación #2 por diseño — no por mitigación, por eliminación
del riesgo mismo.** Si no hay UI de producto ni economía de gemas dentro de Obsidian, no hay
superficie para el rechazo que documenté en R1 §3 (el caso `obi-sync`, la reacción a Smart
Connections, la guía "data loss is the fastest way to lose a user's trust"). Esa evidencia sigue
siendo válida, pero deja de aplicar al conector delgado — aplicaría solo si alguien reintrodujera
UI de juego dentro del vault más adelante.

**La preocupación #1 (la comunidad no adopta gamificación nativa) queda parcialmente
desactivada, no eliminada.** El motivo original de esa preocupación importa: la gente pide
gamificación en los foros pero no instala lo que se construye (R1 §2.1). Con el conector delgado,
Kibo ya no le pide a la comunidad de Obsidian que adopte gamificación *dentro* de Obsidian — le
pide algo mucho más barato: que instale un puente de datos. Eso cambia la comparación correcta:
ya no compito contra los ~7,400 downloads de Grind Manager (un plugin que SÍ mete juego dentro del
vault), compito contra plugins de sincronización de datos estructurados, que en el ecosistema
tienen una adopción de un orden de magnitud mayor (Local REST API con MCP: 591,379 descargas;
Todoist Sync no oficial: 174,522–233,682 según el plugin; ver R1 §2.1 y §2.3 para las cifras
completas). Esto sube la probabilidad de que el conector, bien ejecutado, sí encuentre audiencia.

**La preocupación #3 (F2 por inercia) sigue intacta y ahora es la más importante de las tres.**
El encuadre nuevo no cambia el argumento de R1 §5: sigue sin existir evidencia de mercado de que
un espejo bidireccional completo sea necesario o vaya a usarse, y sigue siendo la apuesta más
cara. Ver §4 de este documento — la búsqueda específica de "prior art de mirror de datos
estructurados" refuerza esto con un hallazgo nuevo, no lo contradice.

**Aparece una preocupación nueva que R1 no pudo ver porque el encuadre todavía era "Obsidian como
producto vendible":** con Obsidian fuera de la ecuación de adquisición, **el caso de negocio para
construir el conector ya no se sostiene en "cuántos usuarios de Obsidian podemos convertir"**
(la pregunta que dominó R1), sino en **"qué fracción de los usuarios que Kibo ya tiene, adquiridos
por otras razones, resulta que también usa Obsidian"** — un dato que hoy nadie tiene, ni yo puedo
verificarlo de fuentes públicas, porque depende de la base de usuarios de un producto que aún no
existe en producción (constatado en `00-brief.md` §2.1: "el esquema Prisma actual solo modela
`User`... no existe ninguna entidad de notas, tareas, hábitos"). Desarrollo en §5.

### Veredicto

**Sube de "GO condicionado" a GO — para el conector delgado específicamente, con una condición
dura nueva que reemplaza a la de la economía de gemas.** La condición que más importaba en R1
(no exponer gemas/cofres en el vault) ya está resuelta por el encuadre de Sergio, no por una
decisión pendiente de validar. La condición que queda — y que se vuelve la más importante de las
dos rondas — es la de F2: no construir sync bidireccional completo sin que el conector mínimo
(lectura/escritura puntual, sin UI de juego) demuestre uso real primero. Ver la escalera de
métricas revisada en §5.

---

## 2 · Distribución de un conector: catálogo oficial vs BRAT vs instalación manual

Pregunta de fondo: si el plugin no es el producto sino el puente para usuarios de Kibo, **no
tiene que pasar por el catálogo oficial para funcionar** — y de hecho, dado que ronda 1 encontró
que la comunidad reacciona con más recelo a productos SaaS visibles en el directorio oficial que
a herramientas de nicho instaladas manualmente por quien ya sabe lo que está haciendo (R1 §3), la
distribución fuera del catálogo puede ser preferible, no solo posible.

| | **Catálogo oficial** | **BRAT** | **Instalación manual** |
|---|---|---|---|
| **Qué es** | Directorio community-plugins.json, buscable/instalable desde dentro de Obsidian | Plugin de terceros (`obsidian42-brat`, por TfTHacker) que apunta a un repo de GitHub y auto-actualiza plugins no listados | Copiar `main.js` + `manifest.json` (+ `styles.css` opcional) a mano en `.obsidian/plugins/<id>/` |
| **Requisitos técnicos** | `manifest.json`, `README.md`, `LICENSE`, versión `x.y.z` exacta entre tag de GitHub release y manifest, assets binarios (`main.js`, `manifest.json`, `styles.css`) adjuntos al release, ID sin la palabra "obsidian" | Solo necesita un repo de GitHub público con `manifest.json` en la raíz y un release con tag = versión del manifest — **mismos requisitos técnicos que un release normal, sin submission al directorio** | Ninguno — el usuario copia archivos directo; ni siquiera necesita un release de GitHub formal |
| **Revisión / aprobación** | Validación automatizada (minutos) + revisor humano que verifica cumplimiento de guías (incluida la política de cuentas/pago, ver abajo). Fuente primaria: `obsidian.md/blog/future-of-plugins/`, publicado 2026-05-12 — el propio post documenta que el sistema anterior (manual) tenía una cola de 2,300+ submissions atoradas, ya despejada con el nuevo sistema | **Ninguna revisión de Obsidian.** BRAT es una herramienta de la comunidad, no un canal oficial — el README de `TfTHacker/obsidian42-brat` no dice nada sobre requisitos de revisión porque no aplica ninguna (verificado 2026-08-08, no encontré mención de proceso de aprobación) | Ninguna — no hay canal, no hay revisor |
| **Tiempo hasta disponible** | Horas (post-mayo 2026, automatizado) — antes de ese cambio, fuentes secundarias hablaban de 1-2 semanas para primera retroalimentación bajo el proceso manual anterior; **uso la cifra oficial más reciente como la vigente** | Inmediato — en cuanto el desarrollador publica un release en GitHub, cualquier usuario con BRAT instalado puede añadirlo | Inmediato |
| **Fricción para el usuario final** | Mínima: buscar por nombre dentro de Obsidian, un clic para instalar | Media: instalar BRAT primero (935,092 descargas, 1,593★, actualizado hace ~1 mes — obsidianstats.com, consultado 2026-08-08 — es en sí mismo un plugin grande y confiable), luego pegar la URL del repo de Kibo | Alta: manejar archivos ocultos del sistema operativo, sin auto-actualización |
| **Visibilidad / descubribilidad** | Alta — aparece en búsquedas dentro de Obsidian, en `obsidian.md/plugins` | Baja — solo lo encuentra quien ya sabe que existe (vía web de Kibo, comunidad, boca a boca) | Nula — cero descubribilidad orgánica |
| **¿Pasa la revisión un plugin que exige cuenta de un servicio de pago?** | **Sí, con una condición explícita.** La política de desarrolladores de Obsidian permite *"Payment is required for full access"* y *"An account is required for full access"* siempre que estén **"clearly indicated in your README"** (Developer Policies, réplica verificada del documento oficial, ya citada en R1 §3.1, sin cambios detectados en esta ronda) | **No aplica revisión, por lo tanto no hay filtro que pasar** — pero la misma obligación de transparencia en el README es una buena práctica igual, aunque no sea exigible por nadie | No aplica ninguna política — responsabilidad entera del usuario que decide instalarlo |
| **Percepción de la comunidad (inferencia, con base en R1 §3)** | Mayor escrutinio inicial — es lo que la comunidad ve primero al buscar, y es donde se concentra el recelo a "otra app SaaS en el directorio" | Percibido como herramienta de power-user, ya normalizado en la comunidad (935K descargas no es un canal marginal) — instalar algo vía BRAT ya señala que el usuario sabe lo que hace, lo cual baja la vara de sospecha | Reservado a quien ya tiene alta confianza/control técnico — audiencia mínima pero de máxima intención |

### Lectura de esta tabla

**Para un conector delgado dirigido a usuarios que YA están en Kibo (no a capturar usuarios nuevos
de Obsidian), la descubribilidad del catálogo oficial deja de ser la ventaja decisiva que sería
si Obsidian fuera canal de adquisición.** Un usuario de Kibo que quiere conectar su vault no
necesita *encontrar* el plugin buscando en Obsidian — llega ahí siguiendo instrucciones desde
Kibo mismo (la app web le dice "instala esto"). Eso hace que **BRAT sea una opción seria y no solo
un atajo de desarrollo**: 935,092 descargas ya instaladas en la comunidad (obsidianstats.com,
consultado 2026-08-08) significa que una fracción sustancial de usuarios de Obsidian que
probablemente se solapan con el perfil "power user, ya usa varios plugins" — el mismo perfil que
más probablemente también usa un producto como Kibo — **ya tiene la herramienta instalada.**

**Recomendación de esta sección:** lanzar el conector vía BRAT primero (fricción de distribución
casi cero para Kibo, cero espera de revisión, iteración rápida mientras el conector es nuevo y
probablemente cambia rápido), y solo someterlo al catálogo oficial una vez que el conector esté
estable y Kibo quiera la descubribilidad — que, dado que Obsidian no es canal de adquisición
(encuadre de Sergio), es una ventaja secundaria, no la razón de ser del plugin.

---

## 3 · Encuesta de convenciones del ecosistema

Pregunta operativa: si Kibo emite datos en las convenciones que estos plugins ya esperan, ¿qué
obtiene un usuario de Kibo **gratis**, sin que Kibo construya nada para ese plugin específico?
Todas las cifras de descargas de esta tabla son de `obsidianstats.com`, consultadas el
2026-08-08, cruzadas contra la página individual de cada plugin (no las páginas de listado por
tag, que en R1 §2.1 documenté como poco confiables).

| Plugin/feature | Adopción (descargas) | Convención que exige | Qué obtiene un usuario de Kibo sin trabajo extra de Kibo |
|---|---|---|---|
| **Propiedades YAML (frontmatter) — la convención base, no un plugin** | N/A — es una capacidad nativa de Obsidian, no de un plugin | Cualquier bloque `---` al inicio del archivo con pares `clave: valor` bien formados | Es la base de la que dependen **todas** las filas de abajo. No es opcional ni negociable: si Kibo emite frontmatter limpio y consistente (nombres de campo estables: `kibo_area`, `kibo_habit_id`, `energia`, `prioridad`, etc.), automáticamente alimenta Dataview y Bases sin que Kibo escriba una sola línea de integración para esos dos plugins |
| **Bases** | No aplica descarga — **es plugin core desde Obsidian 1.9.0** (beta, `obsidian.md/changelog/2025-05-21-desktop-v1.9.0`, fuente primaria) y **disponible para todos sin beta desde 1.9.10** (`obsidian.md/changelog/2025-08-18-desktop-v1.9.10`, fuente primaria, 2025-08-18). Viene instalado en **el 100% de las instalaciones de Obsidian actuales** | Vistas tipo base de datos (tabla, tarjetas) sobre las mismas propiedades YAML — "toda la data en una Base está respaldada por tus archivos Markdown locales y propiedades en YAML" (documentación oficial) | Vistas de "todas mis Áreas", "hábitos por racha", "tareas por prioridad" dentro de Obsidian, sin instalar ningún plugin adicional — porque Bases ya viene con la app. **Es la fila de mayor relación valor/costo de toda la tabla**: cero fricción de instalación para el usuario (ya lo tiene) y cero desarrollo de integración específica para Kibo (reutiliza el mismo frontmatter que Dataview) |
| **Dataview** | 4,717,623 descargas (R1 §2.1, verificado de nuevo hoy) | Frontmatter YAML **o** "inline fields" (`Clave:: Valor` en cualquier parte del texto) — "todos los campos de YAML Frontmatter están automáticamente disponibles como campos de Dataview" (documentación oficial de Dataview, vía DeepWiki, consultado 2026-08-08) | Consultas (`DQL`) y dashboards custom sobre cualquier dato que Kibo escriba en frontmatter — sin que Kibo construya ninguna query, el usuario las escribe él mismo. Es el plugin más instalado del ecosistema completo; escribir para esta convención es el movimiento de mayor alcance |
| **Tasks** | 3,700,210 descargas, actualizado hace 16 días (activo) | Checkbox estándar `- [ ]` / `- [x]` + emojis de metadata: `📅` vencimiento, `⏳` programada, `🛫` inicio, `➕` creación, prioridad `🔺⏫🔼🔽⏬`, recurrencia `🔁` (formato verificado en `publish.obsidian.md/tasks`, documentación oficial del plugin, consultado 2026-08-08) | Si Kibo exporta tareas/subtareas en ese formato exacto de checkbox+emoji, el usuario obtiene consultas de tareas pendientes, vencidas, por prioridad, vistas de calendario de tareas — funcionalidad completa de gestión de tareas dentro de Obsidian sin que Kibo construya un solo query engine propio |
| **Calendar** | 2,975,280 descargas — pero **última versión hace ~5 años** (`2.0.0-beta.2`), sin actividad de mantenimiento reciente (obsidianstats, consultado 2026-08-08) | Notas diarias con nombre de archivo por fecha (formato configurable, por defecto vinculado a la config de Daily Notes core) en una carpeta determinada | Heatmap de actividad tipo GitHub sobre las notas diarias — si el Diario de Kibo emite una nota diaria con el nombre correcto, aparece automáticamente en este calendario. **Advertencia:** es el plugin de mayor descarga de esta tabla después de Dataview/Tasks, pero su falta de mantenimiento activo (5 años) es una señal de que Obsidian probablemente lo está absorbiendo hacia el core (ver Periodic Notes, misma situación) — apostar el diseño de Kibo a esta convención específica es razonable porque el *formato* de nombre de archivo por fecha es un estándar ampliamente compartido, no porque el plugin en sí vaya a seguir activo |
| **Periodic Notes** | 700,478 descargas — **última versión hace ~4 años**, mismo patrón de estancamiento que Calendar (obsidianstats, consultado 2026-08-08) | Configura carpeta y formato de fecha para notas diarias/semanales/mensuales/anuales; controla dónde y cómo se crean | Estructura de navegación diaria/semanal/mensual — mismo razonamiento que Calendar: la convención de nombre de archivo importa más que el plugin específico, porque **Obsidian ya tiene "Daily Notes" como plugin core** (no listado aparte porque no es comunitario) que cubre el caso más simple sin instalar nada |
| **Templater** | 4,708,142 descargas, actualizado hace 3 días (muy activo — el más mantenido de esta lista) | Sintaxis `<% %>` para plantillas dinámicas al crear una nota nueva | Relevancia distinta a las anteriores: no es sobre cómo Kibo *emite* datos, sino sobre cómo el usuario *crea* notas nuevas de forma consistente con lo que Kibo espera leer de vuelta (si algún día hay lectura). Kibo podría publicar una plantilla de ejemplo (no un plugin) para que quien use Templater cree notas ya compatibles — valor opcional, no crítico para el conector mínimo |

### Orden por relación valor/costo (de mayor a menor)

1. **Propiedades YAML bien formadas (la disciplina base)** — costo de Kibo: definir un esquema de
   nombres de campo estable y documentarlo. Costo cero de "integración" porque no es integración
   con un plugin específico, es higiene de formato. Beneficio: desbloquea Dataview y Bases a la
   vez, los dos ítems de mayor adopción/mayor vigencia de la lista.
2. **Bases** — costo de Kibo: cero (ya viene en el 100% de las instalaciones desde agosto de
   2025). Beneficio: máximo, porque no depende de que el usuario instale nada.
3. **Dataview** — costo de Kibo: cero más allá del punto 1. Beneficio: altísimo por ser, con
   amplio margen, el plugin más instalado del ecosistema completo (4.7M descargas).
4. **Tasks** — costo de Kibo: definir el formato de exportación de tareas con la sintaxis exacta
   de emojis (más trabajo que 1-3, porque el formato es más rígido que YAML libre). Beneficio:
   alto (3.7M descargas, plugin activamente mantenido).
5. **Calendar / Periodic Notes (tratados juntos, misma convención de fondo)** — costo de Kibo:
   nombrar archivos de diario con el patrón de fecha esperado. Beneficio: medio-alto en volumen
   de descargas instaladas, pero con la salvedad de que ambos plugins muestran señales de
   abandono de mantenimiento (4-5 años sin actualizar) — el valor real está en que Obsidian ya
   absorbió "Daily Notes" al core, así que el beneficio persiste aunque estos plugins específicos
   eventualmente se retiren.
6. **Templater** — costo de Kibo: bajo (publicar una plantilla, no codificar nada). Beneficio:
   secundario para el conector (no es sobre emitir datos), útil como detalle de cortesía.

**Conclusión de esta sección, la más accionable de todo el documento:** el conector delgado no
necesita "integrarse" con cinco plugins distintos. Necesita **una sola disciplina** (frontmatter
YAML con nombres de campo estables y documentados, más un formato de checkbox compatible con
Tasks si Kibo exporta tareas) y **hereda gratis** la funcionalidad de Dataview, Bases, Calendar y
Periodic Notes sin construir nada específico para cada uno. Esto es, además, la implementación
más barata de mantener a largo plazo: no depende de la API de ningún plugin de terceros que pueda
discontinuarse (evidencia de que sí pasa: Calendar y Periodic Notes llevan años sin actualizar),
solo depende del formato de archivo `.md` y YAML, que es el estándar más estable de todo el
ecosistema por definición.

---

## 4 · Prior art del patrón nuevo: apps de datos estructurados que se espejean a una bóveda Markdown

Búsqueda específica y distinta a la de R1 (que cubrió plugins *dentro* de Obsidian hechos por
SaaS existentes). Aquí busco lo inverso: **aplicaciones externas cuyo producto es mandar datos
estructurados propios hacia archivos Markdown en una bóveda**, en las tres categorías que pidió
Claudio (tareas, salud/hábitos, finanzas personales).

### Lo que sí encontré

| Producto | Categoría | Patrón | Dirección | Modelo de negocio | Adopción | Fuente / fecha |
|---|---|---|---|---|---|---|
| **Health.md** | Salud (Apple Health, Oura, Strava, Garmin → Obsidian) | App móvil (iOS/Android) dedicada que exporta datos de salud a la bóveda del usuario en Markdown, JSON, CSV, o directamente en formato Bases, con exportaciones programadas | **Unidireccional** (salud → vault; no hay escritura de vuelta hacia la app de salud) | Freemium: 10 exportaciones gratis, luego **compra única** ("Full Access is a one-time purchase. No subscription.") | **No verificable** — no encontré cifras de descargas, reseñas o usuarios activos; el sitio oficial (`healthmd.app`, consultado 2026-08-08) no las publica | `healthmd.app`, consultado 2026-08-08 |
| **apple-health-to-obsidian** (script open source, predecesor/alternativa DIY a Health.md) | Salud | Script Python que toma el export de la app "Health Auto Export" y lo convierte a notas diarias de Obsidian | Unidireccional | Gratis, código abierto | 20 estrellas en GitHub, última actualización 2025-11-29 — adopción modesta y verificable | `github.com/friebetill/apple-health-to-obsidian`, consultado 2026-08-08 |
| **Budget Vault, PennyWallet, Expensica** | Finanzas personales | Estos **no son apps externas que se espejean** — son plugins nativos de Obsidian que generan y leen sus propios archivos Markdown como base de datos de finanzas desde el origen (más parecido a los plugins de gamificación nativa de R1 §2.1 que al patrón pedido) | N/A (no hay app externa) | Gratis (plugins comunitarios) | No medido individualmente — no es el patrón exacto solicitado, lo incluyo para dejar constancia de que existe la categoría adyacente | `community.obsidian.md/plugins/budget-app`, `.../penny-wallet`, `.../obsidian-expensica`, consultado 2026-08-08 |
| **Todoist ↔ Tasks/plugins de terceros** (ya cubierto en R1 §2.3) | Tareas | Esto es lo más cercano a "mirror bidireccional de datos estructurados de una app externa" que existe con adopción medible — Todoist es una app SaaS con modelo de datos propio (proyectos, prioridades, fechas) que se materializa como notas/checkboxes en el vault, y en algunos de esos plugins (p. ej. "Ultimate Todoist Sync") la sincronización **sí es bidireccional** (marcar como hecho en Obsidian actualiza Todoist y viceversa) | **Bidireccional en al menos un plugin** (Ultimate Todoist Sync) — ver R1 §2.3 para las cifras de descarga de las variantes | Todoist mismo es freemium/suscripción; los plugins que lo conectan son gratuitos y de terceros | 174,522–233,682 descargas según la variante (R1 §2.3) | Ya citado en R1, no repito |
| **Zotero ↔ Zotero Integration** (ya cubierto en R1 §2.3) | Investigación/citas (no está en las 3 categorías pedidas, pero es el mismo patrón de mirror de datos estructurados hacia notas) | Unidireccional (Zotero → notas de Obsidian, insertando citas/anotaciones) | Unidireccional | Gratis, de terceros | 504,347 descargas (R1 §2.3) | Ya citado en R1 |

### Lo que NO encontré (el vacío es información, como pidió Claudio)

- **Ninguna app de hábitos/rachas** (categoría más cercana al núcleo de Kibo) tiene un patrón de
  mirror hacia Obsidian equivalente a Health.md. Los puentes que existen (R1 §2.1 y §2.2:
  Habitica Sync, Habsiad, plugins de gamificación nativa) están construidos *dentro* de Obsidian
  como plugins que hablan con la API de la app externa en vivo, no como un servicio que
  "exporta/mira" datos periódicamente hacia archivos. Es una arquitectura distinta a la de
  Health.md.
- **Ninguna app de finanzas personales establecida (YNAB, Actual Budget, Monarch, Lunch Money,
  Tiller) tiene un mirror oficial ni no oficial hacia Obsidian con adopción medible.** Lo que
  existe es la ruta manual: exportar CSV de la app de finanzas y procesarlo con herramientas de
  texto plano genéricas como `hledger` (`mandalivia.com`, consultado 2026-08-08) — es decir, el
  usuario hace el trabajo de puente él mismo, no hay producto que lo automatice.
- **No encontré ningún caso, en ninguna de las tres categorías, de una app externa con más de
  unos pocos miles de usuarios/descargas cuyo modelo de negocio dependa explícitamente de
  "sincronizar tus datos con tu bóveda de Obsidian".** El caso más grande y más cercano al patrón
  puro (Health.md) no publica ninguna cifra de adopción verificable.

### Lectura de este hallazgo (inferencia mía, con la tabla de arriba como base)

El patrón "app de datos estructurados se espejea a una bóveda Markdown" **sí existe, es real, y
tiene al menos un ejemplo comercial activo (Health.md)** — no es una idea sin precedente. Pero
los tres ejemplos verificables con más tracción (Health.md, Todoist-vía-terceros, Zotero
Integration) comparten dos rasgos que vale la pena que Kibo copie:

1. **Ninguno depende de que la app externa construya o mantenga el puente.** Health.md es un
   producto de terceros, no de Apple/Oura/Strava/Garmin. Los conectores de Todoist y Zotero son
   de terceros, no de Doist/Zotero (R1 §2.3). El patrón que sí funciona en este ecosistema es
   "alguien construye el puente para tu producto", no "tu producto construye el puente hacia
   Obsidian" — lo cual, para Kibo, es una razón más a favor de mantener el conector delgado y
   barato, en vez de una pieza central de ingeniería propia.
2. **El más comparable en modelo de negocio (Health.md) evita la suscripción dentro del puente
   mismo** — compra única, no cobro recurrente ligado al flujo de datos hacia el vault. Esto es
   consistente con la lectura cultural de R1 §3 (la comunidad tolera mal la sensación de "pagar
   cada mes por algo que toca mis archivos locales").
3. **La dirección dominante en los ejemplos con mejor definición de producto es unidireccional**
   (Health.md, Zotero). El único caso bidireccional verificado (un plugin específico de Todoist)
   vive dentro de una categoría — sincronización de tareas con estado binario hecho/no-hecho —
   estructuralmente más simple que lo que Kibo maneja (jerarquía de 5 niveles, XP, energía,
   prioridad, dependencias — ver `00-brief.md` §3.1). No encontré ningún precedente de mirror
   bidireccional para un modelo de datos tan rico como el de Kibo. Esto no invalida la idea, pero
   sí significa que Kibo estaría construyendo sin precedente directo que reduzca el riesgo —
   argumento adicional, más allá del de R1 §5, para no aprobar F2 sin que F1 (conector mínimo,
   probablemente unidireccional o de "un solo campo a la vez") demuestre uso real primero.

---

## 5 · La métrica, recalculada

La métrica original del PRD (*"≥25% de usuarios de Recursos con bóveda vinculada a los 90 días de
F2"*) ya usaba como denominador a usuarios de Kibo (Recursos), no a usuarios de Obsidian — en eso
no había un error de encuadre en R1. **Lo que cambia con el encuadre nuevo es qué significa el
numerador (conectar un conector delgado sin UI de juego, no instalar un plugin-producto
completo) y, más importante, que ya no hay ninguna lectura legítima de esta métrica como
indicador de adquisición** — es puramente un indicador de satisfacción/retención de una función
para gente que Kibo ya tiene.

### El problema estructural que R1 no pudo ver

25% de **todos** los usuarios de Recursos es una meta que, sin querer, incluye en el denominador
a gente que **no puede estructuralmente cumplir la condición** — quien no usa ni usará Obsidian.
Nadie tiene el dato de qué fracción de la base de usuarios de Kibo (un producto que hoy no existe
en producción, ver R1 y `00-brief.md` §2.1) ya usa o usaría Obsidian. **Esto es no verificable
hoy, por definición — no hay usuarios de Kibo de los cuales medirlo.** Sin ese dato, 25% del total
podría representar desde una meta modesta (si el solape real es, digamos, 40-50% del perfil de
usuario de Kibo) hasta una meta matemáticamente inalcanzable (si el solape real es, por ejemplo,
15%, un target de 25% del total exigiría que más del 100% de los usuarios elegibles se
conviertan — imposible).

### Qué medir en su lugar (y en qué orden)

| Paso | Qué mide | Método | Por qué va primero |
|---|---|---|---|
| **0 — Elegibilidad (nuevo, no estaba en el PRD ni en R1)** | % de usuarios activos de Kibo que declaran usar Obsidian (o cualquier vault Markdown local-first) hoy | Una pregunta de onboarding o encuesta in-app, una sola vez — no requiere que el conector exista todavía | Sin este número, cualquier meta sobre el conector es una meta sobre un denominador desconocido. Es la pieza de evidencia más barata de conseguir y la que más cambia el resto del cálculo |
| **1 — Activación** | % de usuarios elegibles (paso 0) que conectan el conector alguna vez, dentro de sus primeros 90 días de saber que existe | Evento de producto en el conector (server-side, declarado en README conforme a política de Obsidian, no telemetría de cliente — R1 §3.1) | Es la versión corregida del numerador original del PRD, pero sobre el denominador correcto (elegibles, no todos) |
| **2 — Retención de la conexión** | % de los que activaron en el paso 1 que siguen con el conector activo a 90 días (no solo "lo conectaron una vez") | Mismo mecanismo, medido como estado, no como evento puntual — ya propuesto en R1 §5 y sigue aplicando sin cambios | Evita contar como éxito una conexión que el usuario abandonó, el mismo patrón de abandono que documenté en varios plugins de terceros (R1 §2.1, §2.3, y aquí mismo en §3: Calendar y Periodic Notes con años sin actualizar pese a millones de descargas históricas) |

**No propongo un número de umbral nuevo para los pasos 1 y 2** — con el paso 0 sin medir, calcular
"25%" o cualquier otro porcentaje frente a un denominador desconocido sigue siendo el mismo error
que señalé en R1 §5, solo que ahora sé exactamente qué dato falta para corregirlo. La
recomendación concreta es: **medir el paso 0 antes de fijar cualquier meta numérica**, incluso
antes de construir el conector — se puede preguntar por onboarding survey desde el primer usuario
de Kibo que exista, sin ninguna dependencia de Obsidian construida.

---

## Recomendación (delta de ronda 2)

**El veredicto sube de GO condicionado a GO para el conector delgado**, sujeto a la única
condición que sigue en pie de las tres originales: **F2 (cualquier forma de sync bidireccional
rico) no se aprueba sin que el conector mínimo demuestre retención real de la conexión (métrica
del paso 2, §5)** — reforzado ahora por un hallazgo nuevo de esta ronda: no existe, en ninguna de
las categorías buscadas (tareas, salud, finanzas), un precedente de mirror bidireccional para un
modelo de datos tan rico como el de Kibo (§4) — el único bidireccional verificado es de
tareas binarias hecho/no-hecho, mucho más simple.

Las dos preocupaciones nuevas que esta ronda destapa, en orden de importancia:

1. **El dato de elegibilidad (§5, paso 0) no existe y es una dependencia dura antes de fijar
   cualquier meta de esta iniciativa** — no es un detalle de medición, es la pieza de información
   que determina si "25%" (o cualquier número) es una meta razonable o matemáticamente imposible.
   Es, además, la más barata de resolver de todo este análisis: una pregunta de encuesta, no una
   línea de código.
2. **La convención técnica de emisión (§3) debe fijarse antes de que Kibo construya el conector**,
   no como una decisión de arquitectura tardía. Si Kibo diseña su esquema de frontmatter interno
   sin pensar desde el día uno en nombres de campo estables compatibles con Dataview/Bases/Tasks,
   pierde gratis la mayor parte del valor que este documento identificó — y corregirlo después
   significa migrar datos ya escritos en las bóvedas de usuarios reales, el escenario exacto que
   la guía de revisión de plugins de Obsidian marca como el que más rápido destruye la confianza
   (R1 §3.2).

Referencia cruzada: la arquitectura técnica del conector (uni vs. bidireccional, qué mecanismo —
Local REST API, agente local, File System Access API) sigue fuera del alcance de este análisis,
como en R1 — le toca a `solution-architect`.
