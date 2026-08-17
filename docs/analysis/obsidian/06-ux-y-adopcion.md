# 06 · UX y adopción — Integración Kibo ↔ Obsidian

**Fecha:** 2026-08-08 · **Autor:** ux-researcher (investigación UX) · **Encargo:** Claudio
**Insumos:** `docs/analysis/obsidian/00-brief.md`, `docs/product/PRD-kibo.md` v1.0 (§3.12, §4)
**Alcance:** personas, journey, arquitectura de información, motivación/gamificación, onboarding,
criterio de usuario cero, plan de validación.
**Fuera de alcance (otros especialistas):** arquitectura técnica de sync, seguridad, tamaño de
mercado, plan de fases y roadmap.

---

## Cómo leer este documento

Cada afirmación sobre comportamiento de usuarios de Obsidian está etiquetada:

| Etiqueta | Significa |
|---|---|
| **[H]** | **Hecho verificado.** Documentación oficial, foro oficial, repositorio público o paper. Lleva fuente y fecha de consulta. |
| **[H-2]** | **Hecho de fuente secundaria.** Análisis de terceros o blog de producto; creíble pero no primario. Úsese con reserva. |
| **[I]** | **Inferencia mía.** Razonamiento a partir de [H] + teoría de diseño. **No es dato.** Es lo que hay que validar. |
| **[S]** | **Supuesto de trabajo.** No tengo evidencia; lo declaro para que se pueda refutar. |

> **Conceptos que uso y explico al vuelo** (para Sergio): *bóveda* (vault), *sobrejustificación*
> (overjustification), *arquitectura de información* (IA), *momento ajá*, *fake door*, *concierge
> test*, *criterio de muerte* (kill criteria). Cada uno se define donde aparece.

---

## 0 · Tesis en una página

Hay una integración que vale la pena, **pero no es la que describe el PRD §4**.

1. **El valor no está en sincronizar.** Está en devolverle **contexto de vida** a las notas: que
   Kibo sepa que esas 6 notas que escribiste son sobre el proyecto que llevas 3 semanas sin
   tocar. Sincronizar es el costo, no el beneficio. El PRD pone el énfasis al revés.
2. **La gamificación de la escritura, tal como está en §3.12, es el mayor riesgo del proyecto** —
   más que el sync. XP por nota + racha de escritura + "misiones de enlace" premian exactamente el
   anti-patrón que la comunidad PKM ya identificó y desprecia (coleccionar y decorar en vez de
   pensar), y chocan de frente con la evidencia experimental sobre recompensas extrínsecas.
   Si esto se construye tal cual, la integración se vuelve contraproducente para el segmento al
   que se le quiere vender.
3. **El problema conceptual duro no es técnico, es de arquitectura de información:** dos lugares
   para escribir lo mismo. La solución no es sincronizarlos mejor; es **que solo haya un lugar
   donde se escribe**.
4. **Sergio necesita adoptar Obsidian**, pero eso solo le da criterio de novato. Para el segmento
   consolidado —el que decide si esto vive o muere— necesita entrevistas, no introspección.

---

## 1 · Base de evidencia

Todo lo que sigue en el documento se apoya en estos hallazgos. Los numero para poder citarlos.

### 1.1 Cómo es la comunidad y cómo se comporta

| # | Hallazgo | Tipo | Fuente (consultada 2026-08-08) |
|---|---|---|---|
| **E1** | Obsidian es *local-first*: la bóveda es una carpeta de `.md` en el disco del usuario; la promesa de marca es "tus archivos, tu disco, formatos abiertos". El servidor es opcional y de pago. | [H] | [obsidian.md](https://obsidian.md/) · Ayuda oficial |
| **E2** | Obsidian arranca en **Modo restringido**: los plugins comunitarios están **desactivados por defecto** y activarlos exige una advertencia explícita de que "los plugins comunitarios ejecutan código de terceros que podría hacer daño". | [H] | [Plugin security](https://obsidian.md/help/plugin-security) · [Community plugins](https://obsidian.md/help/community-plugins) |
| **E3** | La desconfianza hacia terceros que tocan la bóveda es un tema **recurrente y estructurado** en el foro oficial: auditabilidad del cifrado, riesgo de cadena de suministro en plugins, deseo de servidor autohospedado. | [H] | Foro oficial: [Sync encryption: is there any way to audit it?](https://forum.obsidian.md/t/sync-encryption-is-there-any-way-to-audit-it-privacy-and-security-concerns/37313) · [Security of the plugins](https://forum.obsidian.md/t/security-of-the-plugins/7544) · [How concerned should one be about security when using community plugins?](https://forum.obsidian.md/t/how-concerned-should-one-be-about-security-when-using-community-plugins/89829) · [Self-hosted server](https://forum.obsidian.md/t/obsidian-sync-self-hosted-server-on-premise/20975) |
| **E4** | Los **conflictos de sincronización** son un dolor vivo y documentado: copias en conflicto que se generan cada pocos minutos, notas que quedan truncadas, decenas de `workspace.json` en conflicto, y petición formal de resolución manual. | [H] | Foro oficial: [Conflicted copies with remotely-save](https://forum.obsidian.md/t/conflicted-copies-when-using-remotely-save-with-dropbox/55984) · [Conflicted Copy spamming](https://forum.obsidian.md/t/conflicted-copy-spamming/19358) · [Robust Sync Conflict Resolution](https://forum.obsidian.md/t/robust-sync-conflict-resolution/93544) · [Option to let user manually resolve sync conflicts](https://forum.obsidian.md/t/option-to-let-user-manually-resolve-sync-conflicts/94468) · [.json conflict files](https://forum.obsidian.md/t/i-have-a-lot-of-json-conflict-files-on-my-obsidian-folder/66795) |
| **E5** | La **integración SaaS↔Obsidian más exitosa que existe (Readwise, oficial)** es deliberadamente **de una sola vía y solo-agrega (append-only): nunca sobrescribe nada en la bóveda.** | [H] | [Readwise docs](https://docs.readwise.io/readwise/docs/exporting-highlights/obsidian) · [repo oficial](https://github.com/readwiseio/obsidian-readwise) · [anuncio en el foro](https://forum.obsidian.md/t/the-official-readwise-obsidian-integration-has-launched/22311) |
| **E6** | El ecosistema es enorme pero la **gamificación es marginal dentro de él**: los plugins líderes acumulan millones de descargas (Excalidraw ~3.24 M, Dataview ~2.41 M acumuladas), mientras el plugin de gamificación de PKM más visible tiene **54 estrellas** en GitHub. Existen al menos 5 intentos distintos (Gamificate your PKM, LifeQuest, RPG Levelling, VaultQuest, QuestLog): hay demanda, pero pequeña y fragmentada. | [H] | [obsidianstats.com — most downloaded](https://www.obsidianstats.com/most-downloaded) · [Wrapped 2025](https://www.obsidianstats.com/posts/2025-12-04-wrapped-2025) · [saertna/obsidian-gamified-pkm](https://github.com/saertna/obsidian-gamified-pkm) · [LifeQuest](https://community.obsidian.md/plugins/lifequest) · [RPG Levelling](https://community.obsidian.md/plugins/rpg-levelling) · [hilo "Gamification plugin"](https://forum.obsidian.md/t/gamification-plugin/23568) |
| **E7** | No hay consenso comunitario sobre **carpetas vs. enlaces vs. tags**; el debate lleva años abierto. P.A.R.A. se implementa con carpetas y la gente **reporta haberlo aplicado mal** (clasificar como "proyecto" lo que no lo era). | [H] | Foro oficial: [The PARA method and the hard facts of life](https://forum.obsidian.md/t/the-para-method-and-the-hard-facts-of-life/22279) · [Folders vs. linking vs. tags](https://forum.obsidian.md/t/folders-vs-linking-vs-tags-the-definitive-guide-extremely-short-read-this/78468) · [A folder-heavy workflow](https://forum.obsidian.md/t/a-folder-heavy-workflow-folders-vs-links-vs-tags-vs-dataview-etc-again/56356) |
| **E8** | En **iOS la bóveda solo puede vivir en la carpeta de Obsidian en iCloud**, por el sandbox del sistema. Otras apps no pueden alcanzarla libremente; es una limitación conocida con peticiones abiertas desde hace años. | [H] | Foro oficial: [Full File System Access For The iOS App](https://forum.obsidian.md/t/full-file-system-access-for-the-ios-app-open-existing-vault-folder/28266) · [Open an existing vault not in iCloud](https://forum.obsidian.md/t/feature-open-an-existing-vault-that-is-not-in-icloud-obsidian-folder-but-rather-inside-documents/53585) |
| **E9** | La **File System Access API** (`showDirectoryPicker`) —la única vía para que una web toque una carpeta local— existe **solo en navegadores Chromium de escritorio**. Safari y Firefox no la soportan; ningún navegador móvil la expone. | [H] | [Chrome for Developers](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access) · [MDN — File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) · [Cloud Four — The many, confusing file system APIs](https://cloudfour.com/thinks/the-many-confusing-file-system-apis/) |
| **E10** | El anti-patrón dominante del PKM tiene nombre propio en la comunidad: **"falacia del coleccionista"** (Christian Tietze) — confundir *acumular* con *entender* — y **"procrastinación sofisticada"**: construir jerarquías, taxonomías y plantillas *en lugar de* escribir y pensar. | [H] | [PKM Anti-Patterns (dsebastien.net)](https://www.dsebastien.net/ai-wiki-pkm-pkm-anti-patterns/) · [collectors fallacy (Obsidian Publish)](https://publish.obsidian.md/eriktuck/base/PKM/collectors+fallacy) · [Escape the PKM Trap of Sophisticated Procrastination](https://miscellaneplans.medium.com/escape-the-pkm-trap-of-sophisticated-procrastination-8eed3acd4b04) |
| **E11** | Obsidian ronda **~1.5 M de usuarios activos mensuales**, con ~110 k en Discord y >2,000 plugins comunitarios. **Reserva:** no encontré una cifra oficial publicada por Obsidian; esta viene de un agregador. | [H-2] | [fueler.io — Obsidian statistics](https://fueler.io/blog/obsidian-usage-revenue-valuation-growth-statistics) |

### 1.2 Motivación, recompensas y rachas

| # | Hallazgo | Tipo | Fuente |
|---|---|---|---|
| **E12** | Meta-análisis de **128 estudios** (Deci, Koestner & Ryan, 1999): las recompensas tangibles **contingentes al compromiso, a la finalización y al desempeño socavan la motivación intrínseca** de libre elección (d = −0.40, −0.36 y −0.28 respectivamente). | [H] | [Deci, Koestner & Ryan (1999), *Psychological Bulletin*](https://leeds-faculty.colorado.edu/dahe7472/deci%201999.pdf) · [Deci, Koestner & Ryan (2001), *Review of Educational Research*](https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf) |
| **E13** | **Matiz honesto y central:** el efecto no es universal. Las **recompensas verbales / retroalimentación informativa** producen efectos *positivos* sobre la motivación de libre elección en tareas de alto interés; el daño lo hacen las recompensas **tangibles y percibidas como controladoras**. Además, hay disputa metodológica (Cameron & Pierce, 1994; Eisenberger et al., 1999) y el efecto se observa sobre todo en medidas de "conducta en tiempo libre", no en desempeño de tarea. | [H] | Mismas fuentes + [Eisenberger, Pierce & Cameron (1999), comment](https://pubmed.ncbi.nlm.nih.gov/10589299/) · [Wikipedia — Overjustification effect](https://en.wikipedia.org/wiki/Overjustification_effect) |
| **E14** | Gamificación mal calibrada **retrocede**: hay casos documentados en que agregar insignias + tablas de posiciones + monedas **redujo** motivación y satisfacción; y literatura sobre el "efecto fantasma" (participación superficial sin aprendizaje). | [H] | [Frontiers in Education (2024) — "The ghost effect: how gamification can hinder genuine learning"](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1474733/full) |
| **E15** | **Bajar la ansiedad de racha aumenta la retención.** Duolingo probó el *Weekend Amulet* (permitir saltarse un día sin perder la racha): los usuarios a los que se les ofreció fueron **4% más propensos a volver una semana después y 5% menos propensos a perder la racha**. Además, quienes hacen "atracones" abandonan más que quienes se dosifican. | [H] | [Blog de ingeniería/producto de Duolingo — How Streaks keep learners committed](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/) |
| **E16** | La racha de Duolingo también está documentada como fuente de **ansiedad, "aprendizaje performativo"** (importa el número, no el idioma) y motivo explícito de abandono. | [H-2] | [UX Magazine — The Psychology of Hot Streak Game Design](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame) · [Why People Quit Duolingo: analysis of user venting](https://my-senpai.com/insights/why-people-quit-duolingo.html) |

### 1.3 Las tres implicaciones que más pesan

1. **[I] La bidireccionalidad no es un requisito del usuario; es un deseo del PRD.** El precedente
   más fuerte del ecosistema (E5) resolvió el mismo problema eligiendo *una vía y append-only*, y
   ese producto es querido. Lo bidireccional garantiza conflictos (E4), y los conflictos son el
   dolor que la comunidad ya tiene identificado y odia.
2. **[I] El costo de entrada real de la integración no es "instalar un plugin": es pedirle al
   usuario que baje su propia guardia de seguridad** (E2) o que le dé a una web acceso a una
   carpeta de su disco (E9), en una comunidad cuya identidad es la desconfianza al servidor (E1,
   E3). Ninguna cantidad de buen copy elimina eso; solo lo hace tolerable.
3. **[I] Pagar XP por escribir notas es pagar por la falacia del coleccionista** (E10). Es el único
   punto donde el diseño actual no es "riesgoso": es *activamente contrario* al valor declarado
   por la comunidad objetivo.

---

## 2 · Personas

> **Qué es una persona (concepto):** no es un personaje inventado con nombre bonito; es un
> **arquetipo de comportamiento** destilado de evidencia, cuya función es hacer discutibles y
> falsables las decisiones de diseño ("¿esto le sirve a Marina o solo a Ximena?"). Una persona sin
> evidencia detrás es una opinión disfrazada.

**Advertencia de método (importante):** estas tres personas son **arquetipos derivados de la
evidencia de la §1**, no de entrevistas propias. Están construidas para ser **falsadas** en el
estudio de la §8. Cada una lleva su columna "de dónde sale" y "cómo se refuta". No las trates como
hallazgo; trátalas como hipótesis con forma humana.

---

### Persona A — **Marina, la bóveda viva** (usuario Obsidian consolidado)

*Segmento: 3+ años de uso, bóveda de cientos o miles de notas, 8–20 plugins, sync configurado.*

| Campo | Contenido |
|---|---|
| **Contexto** | Trabaja con información como oficio (investigación, consultoría, docencia, ingeniería). Su bóveda es infraestructura personal, no un pasatiempo. La abre varias veces al día. Ya vivió al menos un conflicto de sync y aprendió a temerle. |
| **Objetivos** | (1) Recuperar lo que ya pensó, meses después. (2) Conectar ideas que no sabía que estaban conectadas. (3) **No perder nada, nunca.** (4) Que su sistema le sobreviva a cualquier empresa. |
| **Herramientas hoy** | Obsidian + un plugin de sync (oficial, Syncthing o Git) + Dataview/Templater/Tasks + una app de pendientes **separada** (Todoist, Things, Apple Reminders) porque las tareas en Obsidian nunca le terminaron de funcionar. |
| **Motivo real para adoptar Kibo** | **No es organizar mejor: es cerrar el ciclo.** Su bóveda le dice qué sabe, pero no qué hizo con eso. [I] El gancho plausible es: *"escribiste 6 notas sobre este tema y no lo tocas hace 3 semanas"*. Ese es el hueco que su stack actual no cubre. |
| **Motivo real para rechazar** | (a) Que una app web le pida acceso a su carpeta (E1, E3, E9). (b) Que le pida salir de Modo restringido (E2). (c) Que le escriba **cualquier cosa** que ella no pidió dentro de sus archivos — frontmatter, IDs, carpetas. (d) Suscripción para tocar archivos que ya son suyos. (e) Estética de juego: no se ve a sí misma como jugadora. |
| **Qué la haría abandonar a los 30 días** | **Un solo archivo tocado sin permiso, o una sola copia en conflicto atribuible a Kibo** (E4). Es un abandono binario y con daño reputacional: lo cuenta en el foro. En segundo lugar: que la capa de juego le empiece a *contar las notas* — el momento en que sienta que la vigilan escribiendo, apaga. |
| **De dónde sale** | E1–E5, E7, E9, E11 |
| **Cómo se refuta** | Si en las entrevistas los consolidados **sí** quieren escribir dentro de una app web, o toleran metadata inyectada, esta persona está mal y hay que rehacerla. |

---

### Persona B — **Diego, la bóveda dormida** (Obsidian instalado, abandonado o intermitente)

*Segmento: instaló Obsidian con entusiasmo, construyó estructura, escribió 30–80 notas, dejó de
abrirlo. Vuelve cada tanto con culpa. Es —argumento— **el segmento más grande y el mejor
objetivo real de Kibo**.*

| Campo | Contenido |
|---|---|
| **Contexto** | Llegó por un video de "segundo cerebro". Pasó los primeros días **eligiendo estructura y plugins** en lugar de escribir (E10). Tiene una carpeta `00-Inbox` con 40 recortes sin procesar. Su relación con la bóveda es de deuda, no de placer. |
| **Objetivos** | (1) Sentir que lo que lee/aprende no se evapora. (2) Dejar de empezar sistemas. (3) Que algo le devuelva una razón para volver. |
| **Herramientas hoy** | Obsidian dormido + notas del celular + capturas de pantalla + WhatsApp a sí mismo + una app de tareas que también abandonó. |
| **Motivo real para adoptar** | **Aquí sí aplica la tesis de Kibo del PRD §1** (el modelo de datos está bien, falta el loop de hábito). Diego no necesita una bóveda mejor; necesita que algo le dé un motivo recurrente y amable de abrirla. Kibo puede ser eso. |
| **Motivo real para rechazar** | (a) Que Kibo le pida **otra vez** decidir estructura — eso lo devuelve al bucle que lo quemó. (b) Que le muestre su bóveda como un cementerio ("38 notas huérfanas") — vergüenza, no motivación. (c) Que sea premium: no va a pagar por reactivar algo en lo que ya fracasó. |
| **Qué lo haría abandonar a los 30 días** | El diseño actual del §3.12 lo mata **por confrontación**: "notas huérfanas → misiones de enlace" convierte su fracaso en una lista de tareas pendientes. A los 30 días tiene una racha de escritura rota, un pulso en rojo y una bóveda que ahora también le reclama. **Esto viola directamente "el fracaso reencauza"** y es el hallazgo más accionable de esta sección. |
| **De dónde sale** | E10, E16, PRD §1 y §3.12 |
| **Cómo se refuta** | Si los "dormidos" atribuyen su abandono a fricción técnica, a cambio de app o a que simplemente no lo necesitaban —y **no** a falta de hábito/motivación— entonces la tesis de Kibo no aplica a ellos y este segmento no es el objetivo. Es el criterio de muerte **K5** de la §8. |

---

### Persona C — **Ximena, sin bóveda** (usuario Kibo, nunca usó Obsidian)

*Segmento: usa Kibo por los hábitos, los retos y el personaje. Recursos le gusta pero es su
módulo menos usado.*

| Campo | Contenido |
|---|---|
| **Contexto** | Escribe poco y a mano alzada: apuntes sueltos, ideas, lo que aprendió de un libro. No tiene ni quiere "sistema". No sabe qué es un wikilink hasta que Kibo se lo enseña. |
| **Objetivos** | (1) Un solo lugar. (2) Que se vea bonito y no la regañe. (3) Que su esfuerzo cuente para algo visible. |
| **Herramientas hoy** | Kibo + Notas del celular + Google Keep. |
| **Motivo real para adoptar la integración** | **Casi ninguno, y hay que decirlo.** Instalar un gestor de notas nuevo para que Kibo lea lo mismo que ya tiene dentro de Kibo es trabajo neto sin beneficio. [I] El único motivo defendible es **soberanía de datos**: "tus notas también viven como archivos tuyos, aunque un día dejes Kibo". Es un argumento de confianza, no de función. |
| **Motivo real para rechazar** | Es una app más que instalar, mantener, sincronizar y entender. Y en su celular no funciona bien (E8). |
| **Qué la haría abandonar a los 30 días** | Que le quede **la duda de dónde escribir**. En cuanto haya dos lugares posibles para la misma nota, ella deja de escribir en ambos. Ese es el modo de falla de la §4. |
| **De dónde sale** | E8, E9, E11, PRD §3.12 |
| **Recomendación derivada** | **No empujar Obsidian a este segmento.** Como mucho, ofrecer "exportar mis notas como archivos" y dejar que la curiosidad haga el resto. Cualquier banner promocional de Obsidian dentro de Recursos para usuarios sin bóveda es ruido que degrada el módulo. |

---

### 2.4 La conclusión incómoda de las personas

| | Marina (consolidada) | Diego (dormida) | Ximena (sin bóveda) |
|---|---|---|---|
| ¿Le sirve la integración? | **Sí, pero solo de lectura** | **Sí, si no la avergüenza** | **No** |
| ¿Paga por ella? | Difícil (paga por confianza, no por función) | No | No |
| ¿Es alcanzable para Sergio hoy? | **No sin credibilidad en la comunidad** | Sí (está en todos lados) | Sí (ya es usuaria) |
| Riesgo dominante | Confianza | Vergüenza | Duplicidad |

**[I] El PRD apunta a Marina (§4 habla de plugin y espejo bidireccional) pero el producto que Kibo
sabe hacer es para Diego.** Esa desalineación es la raíz de casi todos los problemas de este
análisis.

---

## 3 · Journey map de la integración

> **Qué es un journey map (concepto):** el recorrido del usuario en el tiempo, fase por fase, con
> lo que **hace**, lo que **piensa**, lo que **siente** y —lo importante— **dónde se cae**. Su valor
> no es el dibujo bonito: es localizar con precisión el punto de fuga.

Perspectiva principal: **Marina** (consolidada), con notas donde Diego difiere.

### 3.1 Recorrido

| # | Fase | Qué hace | Qué piensa | Emoción | Fricción | Riesgo de abandono |
|---|---|---|---|---|---|---|
| 1 | **Descubrimiento** | Ve el banner de Obsidian en Recursos (o llega desde afuera) | "¿Otra app quiere entrar a mi bóveda?" | Escepticismo | El banner aparece **antes** de que Kibo haya ganado nada de confianza | **Bajo** (ignorar es gratis) |
| 2 | **Decisión** | Busca "Kibo Obsidian" para ver si alguien confía | "¿Quién es esta gente? ¿Suben mis notas?" | Desconfianza activa (E1, E3) | **No existe evidencia social**: sin repo público, sin plugin en el catálogo, sin hilo en el foro, la respuesta por defecto es no | **ALTO — fuga #1** |
| 3 | **Instalación** | Ruta A: apagar Modo restringido e instalar plugin (E2). Ruta B: dar acceso a la carpeta desde el navegador (E9) | "Esto me está pidiendo mucho" | Alerta | Ruta A: advertencia de seguridad del propio Obsidian. Ruta B: **solo funciona en Chromium de escritorio**; Safari/Firefox y todo móvil quedan fuera (E9) | **MUY ALTO — fuga #2, la mayor** |
| 4 | **Primera sync** | Kibo escanea la bóveda y muestra las notas | "A ver qué me hizo" | Tensión → alivio o pánico | Si el escaneo tarda, si reordena, si crea carpetas, si aparece un archivo nuevo → pánico | **ALTO — fuga #3** |
| 5 | **Momento ajá** | Kibo le muestra algo que la bóveda sola no podía | "Ah, caray. No lo había visto así." | Sorpresa útil | **Si esta fase no está diseñada, no ocurre.** Ver 3.3 | Determina todo lo demás |
| 6 | **Uso semanal** | Escribe en Obsidian como siempre; entra a Kibo por hábitos/tareas y de paso ve sus notas | "Kibo no me estorba" | Neutro-positivo | Que Kibo empiece a pedir cosas: enlaza esto, escribe hoy, te falta racha | **Medio, acumulativo** |
| 7 | **Primer conflicto** | Editó en dos lados; aparece una copia en conflicto | "¿Perdí algo?" | **Miedo** (E4) | Es el momento de máxima carga emocional de todo el journey | **CRÍTICO — fuga #4** |
| 8 | **Un mes después** | Decide si sigue conectada | "¿Esto me dio algo o solo me pidió?" | Indiferencia o lealtad | Balance percibido dio/pidió | **Medio** |

### 3.2 Dónde exactamente se pierde la gente

Ordenado por magnitud. Los porcentajes son **[I] un modelo con supuestos explícitos**, no datos —
sirven para discutir órdenes de magnitud, no para planear.

| Fuga | Dónde exactamente | Por qué | Pérdida estimada del remanente |
|---|---|---|---|
| **#0 — Precondición** | El usuario de Recursos **no tiene Obsidian** | Es la mayoría de la base de Kibo | [S] queda 10–25 % |
| **#1 — Confianza** | Entre ver el banner y hacer clic | Nada acredita a Kibo ante esta comunidad (E1–E3) | [I] −50 a −70 % |
| **#2 — Plataforma y permiso** | La pantalla donde hay que apagar Modo restringido **o** darle a una web acceso al disco | Ruta técnica excluyente: Chromium desktop o nada (E9); móvil imposible (E8) | [I] −50 a −70 % |
| **#3 — Primer escaneo** | Los primeros 60 segundos después de dar permiso | Cualquier cambio no anunciado en la bóveda = desinstalación inmediata | [I] −10 a −20 % |
| **#4 — Primer conflicto** | La primera copia en conflicto atribuible a Kibo | El dolor más documentado del ecosistema (E4) | [I] −40 a −60 % de los que llegan |
| **#5 — Fatiga de demanda** | Semanas 3–5, si la capa de juego pide más de lo que da | Ver §5 | [I] −20 a −30 % |

**[I] Consecuencia directa: la métrica del PRD §5 —"≥25 % de usuarios de Recursos con bóveda
vinculada a los 90 días"— es inalcanzable como está escrita.** Multiplicando el escenario
*optimista* de la tabla (25 % × 50 % × 50 % × 90 % × 60 % × 80 %) da del orden de **2.7 %**. Para
llegar a 25 % habría que asumir que casi todos los usuarios de Recursos ya usan Obsidian y que casi
ninguno se cae en permisos — ambas cosas contradicen E8, E9 y E11.

**Métrica alternativa propuesta:** *"≥25 % de los usuarios de Recursos **que declaran tener una
bóveda de Obsidian y usan Chromium de escritorio** completan la conexión, y ≥60 % de ellos siguen
conectados a los 30 días."* Mide lo mismo que importa (¿sirve?) sin premiar ni castigar por el
tamaño de un segmento que no controlamos.

### 3.3 El momento "ajá" — hay que diseñarlo, no esperarlo

**[I] El "ajá" NO es "ya veo mis notas en Kibo".** Eso es una copia peor de algo que ya tenía; es
el momento anti-ajá. Tampoco es "gané 40 XP" — es el momento en que Marina decide que esto es un
juguete.

El "ajá" es la **primera vez que Kibo le dice algo sobre su vida que su bóveda no podía decirle,
porque Kibo sabe de compromisos y la bóveda no.** Tres candidatos, en orden de fuerza:

1. **El puente conocimiento↔compromiso.** *"Escribiste 6 notas sobre 'migración a Postgres'. Ese
   proyecto lleva 3 semanas sin movimiento. ¿Lo retomamos o lo cerramos?"* — Solo Kibo puede
   producir esto: requiere el grafo de notas **y** el estado de los proyectos. Es defendible,
   único y no gamificado.
2. **El rescate de lo enterrado.** *"Esta nota de hace 8 meses habla justo de lo que estás
   haciendo esta semana."* — Valioso, pero un plugin de Obsidian con IA lo puede hacer también.
3. **La cosecha del mes.** *"En julio escribiste sobre 4 temas; 3 se volvieron proyectos, 1 sigue
   siendo curiosidad."* — Bueno como reporte, débil como primer impacto (llega tarde).

**Recomendación:** el candidato 1 es el "ajá", y debe ocurrir **en la primera sesión conectada, no
al día siguiente**. Si el primer escaneo no puede producirlo, el onboarding debe pedir un dato más
(qué proyecto le importa hoy) con tal de poder producirlo. **Un onboarding sin "ajá" en la primera
sesión no debe lanzarse.**

### 3.4 Nota sobre Diego (bóveda dormida)

Su journey es más corto y se rompe antes: **su fuga principal es la fase 5**, no la 3. Diego sí da
permisos (tiene menos ideología que Marina), pero cuando Kibo escanea encuentra un cementerio. Si
el primer mensaje es un diagnóstico ("38 notas huérfanas, 0 escritas esta semana"), Diego cierra y
no vuelve. Su "ajá" tiene que ser **absolutorio, no diagnóstico**:

> *"Encontré 47 notas que escribiste. Ninguna se perdió. Empecemos por una."*

---

## 4 · Arquitectura de información del sistema combinado

> **Qué es arquitectura de información (concepto):** decidir **dónde vive cada cosa y cómo se
> nombra**, para que la persona sepa sin pensar dónde poner algo y dónde buscarlo. Cuando falla, el
> síntoma no es "no encuentro": es **"ya no sé dónde escribir"** — y la gente deja de escribir.

### 4.1 El problema, con precisión

El PRD crea dos superficies de escritura equivalentes:

- **Recursos (Kibo, §3.12):** Markdown, `[[wikilinks]]`, tags, carpetas, backlinks, favoritas.
- **La bóveda (Obsidian):** Markdown, `[[wikilinks]]`, tags, carpetas, backlinks, favoritas.

Son el mismo objeto. Sincronizarlos no resuelve nada: **crea la duda**. Cada vez que el usuario
tenga una idea, va a gastar medio segundo decidiendo dónde escribirla, y ese medio segundo se
paga con notas no escritas. [I] Este es el riesgo de diseño número uno de todo el proyecto, por
encima del sync.

Y hay un segundo problema, más sutil: **Kibo tiene tres taxonomías y ninguna es la del usuario.**
Áreas (5 fijas), Proyectos (estados), Recursos (carpetas). Una bóveda tiene la taxonomía que el
usuario construyó con sus manos y por la que siente propiedad (E7). Imponerle las 5 Áreas de Kibo
como carpetas es la vía más rápida al rechazo de Marina.

### 4.2 La regla de oro

> ## **"Tu bóveda es donde escribes; Kibo es donde eso se vuelve progreso."**

Una sola frase, sin jerga, y decide todos los casos:

- ¿Dónde escribo esta idea? → En tu bóveda. Siempre. **Kibo nunca es un segundo cuaderno.**
- ¿Y si no tengo bóveda? → Entonces Recursos *es* tu bóveda, hasta que tengas una. Y el día que
  conectes una, **Recursos deja de ser editor y se convierte en ventana** (con una migración
  explícita y una sola vez).
- ¿Qué hace Kibo con mis notas? → Las lee, las relaciona con lo que te comprometiste a hacer, y te
  lo devuelve. No las guarda como suyas.

**Consecuencia dura y no negociable: nunca deben coexistir dos editores.** O escribes en la bóveda
o escribes en Kibo, nunca ambas. Si el equipo no acepta esta consecuencia, la regla de oro no
existe y el problema de IA queda sin resolver.

### 4.3 El modelo mental: tres zonas y un puente angosto

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   ZONA DE COMPROMISO    │        │   ZONA DE CONOCIMIENTO   │
│   Dueño: KIBO           │        │   Dueño: TU BÓVEDA       │
│                         │        │                          │
│ Hábitos · Retos · HP    │        │ Notas · Enlaces · Tags   │
│ Racha · Monedas · Gemas │        │ Carpetas · Diario        │
│ Áreas · Niveles · XP    │        │ Notas de lectura         │
│ Tareas con fecha        │        │ Tu estructura, tus reglas│
│                         │        │                          │
│ NO existe como archivo  │        │ Kibo NO manda aquí       │
└───────────┬─────────────┘        └────────────┬─────────────┘
            │                                   │
            └────────────► PUENTE ◄─────────────┘
                    Solo 3 tipos de objeto,
                  con dirección fija y declarada
```

**El puente debe ser deliberadamente angosto.** Un puente ancho ("todo se sincroniza con todo") es
lo que produce la sensación de duplicado. Propuesta de contrato, con dirección **fija** por tipo:

| Objeto puente | Dirección | Quién manda | Cómo se lo explicamos al usuario |
|---|---|---|---|
| **Nota diaria / entrada de Diario** | Bóveda → Kibo (lectura) | La bóveda | "Si escribes tu día en tu bóveda, Kibo lo cuenta como escrito. No lo copia dos veces." |
| **Nota de proyecto** | Kibo → bóveda (crea **una sola vez**, luego no toca) | Kibo la crea, el usuario la posee | "Cuando abres un proyecto en Kibo, te dejo una nota en tu bóveda para que escribas ahí. A partir de ahí es tuya." |
| **Nota de lectura / libro** | Bóveda → Kibo (lectura) | La bóveda | "Tus notas de lectura viven contigo; Kibo solo sabe que existen." |

**Todo lo demás no cruza.** Tareas, hábitos, HP, monedas, retos, salud y finanzas **no tocan
archivos** — ni por conveniencia. [I] Meter tareas al puente parece barato (el plugin Tasks ya usa
`- [ ]`) y es la trampa más tentadora del proyecto: duplica el modelo de tareas, obliga a
bidireccionalidad real, y es donde nacen los conflictos de E4.

### 4.4 Áreas / Proyectos / Recursos frente a las carpetas de una bóveda

Esta es la traducción conceptual, y el error a evitar en cada fila:

| Concepto Kibo | ¿Qué es realmente? | ¿Mapea a carpeta? | Mapeo correcto | Error a evitar |
|---|---|---|---|---|
| **Área** (Vigor, Sabiduría…) | Una **dimensión de progresión**, no un contenedor. Es una barra de nivel, no un lugar. | **No** | Etiqueta opcional en la vista de Kibo, derivada de a qué proyecto pertenece la nota | Crear `Vigor/`, `Sabiduría/`… en la bóveda del usuario. Imposición máxima, valor cero. |
| **Proyecto** | Compromiso con estado (`to_do`/`in_progress`/`done`) | **Sí, y es el único que sí** | Una carpeta `Proyectos/<nombre>/` o **mejor: una sola nota índice** por proyecto | Crear una carpeta por cada proyecto, incluidos los que nunca tendrán notas → basura en la bóveda |
| **Recurso / nota** | El contenido | Ya es un archivo | Es **el mismo objeto**; no hay que mapear nada | Duplicarlo dentro de la base de datos de Kibo como "nota Kibo" |
| **Tarea / Subtarea** | Unidad de ejecución con energía, prioridad, XP | **No** | No cruza | Escribir `- [ ]` en las notas del usuario |
| **Hábito · Reto · HP · Racha** | Mecánica de juego | **No** | No cruza | Frontmatter gamificado (el propio PRD §4 ya lo prohíbe — correcto) |

**Regla operativa derivada:** *Kibo puede crear como máximo **una** carpeta en la bóveda del
usuario, y el usuario elige su nombre y ubicación en el onboarding.* Fuera de esa carpeta, Kibo
solo lee. Esto es lo que hace defendible la promesa "no toco tus archivos" sin volverla mentira.

### 4.5 P.A.R.A. y el hueco del Archivo

El brief (§3.9) y el PRD reconocen inspiración parcial en P.A.R.A. **sin el Archivo**. Analizado
contra la evidencia, ese recorte es un error de diseño, y la integración con Obsidian lo va a
exhibir:

1. **[H] En P.A.R.A., el Archivo es la válvula de presión.** Es lo que permite que Proyectos y
   Áreas se mantengan chicos y vigentes. Sin él, el sistema solo crece. Los propios usuarios del
   foro reportan que el fallo típico de P.A.R.A. es clasificar mal y acumular (E7).
2. **[I] Sin Archivo, Kibo acumula proyectos muertos** que además van a materializarse como
   carpetas o notas índice muertas en la bóveda del usuario. Marina lo va a leer como "esta app
   me ensucia la bóveda".
3. **[I] El hueco es además una oportunidad de marca desperdiciada.** "El fracaso reencauza" es
   *exactamente* la doctrina de un Archivo bien hecho: un proyecto que abandonas no es una
   derrota, es algo que se guarda con lo que aprendiste.

**Recomendación explícita (aunque exceda el encargo, es donde la integración toca el modelo):**
introducir en Kibo un equivalente de Archivo con nombre de marca —**"Reencauzados"**— con un
ritual de cierre de 20 segundos: *¿qué te llevas?* → se guarda una nota de cierre en la bóveda →
el proyecto sale del tablero **sin penalización de HP ni XP negativo**. Esto (a) tapa el hueco de
P.A.R.A., (b) es coherente con la voz de marca, (c) es un caso de escritura **con motivo
intrínseco** —cerrar un ciclo— que la §5 puede recompensar sin corromper nada, y (d) mantiene la
bóveda limpia, que es lo que Marina exige.

### 4.6 Nomenclatura (importa más de lo que parece)

| Hoy | Problema | Propuesta |
|---|---|---|
| "Recursos" | En P.A.R.A. "Recursos" es una de cuatro cajas; el usuario de Obsidian espera otra cosa. Además suena a "material de apoyo", no a pensamiento. | Renombrar a **"Bóveda"** cuando hay una conectada (y mostrar el nombre real de su bóveda). Sin bóveda conectada, puede seguir siendo "Notas". |
| "Sincronizar" | Palabra técnica que activa el miedo al conflicto (E4) | **"Conectar"** y **"leer"**. "Kibo está leyendo tu bóveda." |
| "Notas huérfanas" | Culpabiliza. Es un término del grafo, no del usuario. | **"Notas sueltas"** — y ver §5: no convertirlas en misión. |
| "Misiones de enlace" | Premia decorar el grafo (E10) | Eliminar. Sustituir por sugerencias sin recompensa. |

---

## 5 · La tensión de gamificación (sección central)

### 5.1 Qué propone el PRD hoy

De §3.12, textual: *"XP a Sabiduría por escribir, racha de escritura, y las notas huérfanas (sin
enlaces) se vuelven 'misiones de enlace'. Pulso: total, escritas/semana, enlaces, huérfanas,
racha."*

Traducido a lenguaje de motivación, eso son **tres recompensas tangibles, esperadas y contingentes
al compromiso** (XP por escribir), **una amenaza de pérdida** (la racha) y **un tablero de
vigilancia** (el pulso). Es, casi literalmente, la configuración que la literatura señala como la
más dañina.

### 5.2 El riesgo, con la evidencia y con sus matices

**El argumento a favor del riesgo:**

- [H, E12] En 128 estudios experimentales, las recompensas tangibles contingentes al compromiso
  socavan la motivación intrínseca de libre elección con **d = −0.40** (efecto moderado y
  consistente). "Contingente al compromiso" = *te doy algo por hacer la actividad* = exactamente
  "XP por escribir una nota".
- [H, E14] Hay casos documentados donde apilar insignias + monedas + tablas de posiciones
  **redujo** motivación y satisfacción.
- [H, E10] En la comunidad PKM, el fracaso arquetípico ya tiene nombre: acumular en vez de
  entender, y decorar el sistema en vez de usarlo. **XP por nota mide volumen; "misiones de
  enlace" miden decoración.** Kibo estaría pagando por el anti-patrón, con dinero de juego.
- [H, E16] La racha, aplicada a una actividad creativa, está documentada como generadora de
  ansiedad y de conducta performativa (importa el número, no el contenido).

**El argumento en contra (y hay que reconocerlo honestamente):**

- [H, E13] El efecto de sobrejustificación no es universal. Se observa sobre todo en medidas de
  conducta en tiempo libre, hay disputa metodológica (Cameron & Pierce; Eisenberger et al.), y en
  medidas de desempeño los efectos pueden ser aditivos.
- [H, E13] **Las recompensas verbales e informativas no dañan: mejoran** la motivación de libre
  elección en tareas de alto interés. El problema no es "recompensar"; es **recompensar con algo
  tangible, esperado y percibido como control**.
- [I] Para **Diego** (bóveda dormida) no hay motivación intrínseca que socavar: escribir no le da
  placer hoy, le da culpa. Ahí la recompensa extrínseca no destruye nada — puede ser el andamio
  que lo devuelve a la actividad.

### 5.3 El veredicto, segmentado

**[I] El riesgo de sobrejustificación es real, es grave, y es asimétrico:**

| Persona | ¿Escribir le da placer hoy? | Efecto probable de XP por nota |
|---|---|---|
| **Marina** (consolidada) | **Sí** — es su oficio y su gusto | **Daño.** Es el caso canónico de E12: recompensa esperada sobre una actividad de alto interés. Su reacción no será "qué divertido", será **"esto me está midiendo"**. |
| **Diego** (dormida) | No — le da culpa | **Neutro o positivo**, si el andamio se retira. Riesgo distinto: que escriba notas basura para farmear XP (y refuerce E10). |
| **Ximena** (sin bóveda) | Indiferente | Positivo a corto plazo, y es la que ya está en Kibo por esto. |

**Conclusión operativa: el diseño de §3.12 optimiza para Ximena y le hace daño a Marina — que es
justamente la persona a la que la integración con Obsidian intenta llegar.** Ese es el corazón de
la contradicción. Y como la integración solo tiene sentido si Marina la acepta, **la gamificación
de la escritura debe rediseñarse antes de construirse, no después de medirla.**

### 5.4 Cómo gamificar sin corromper: siete reglas derivadas de la evidencia

| # | Regla | Evidencia que la sostiene |
|---|---|---|
| **G1** | **No recompensar el acto de escribir. Recompensar el *retorno*.** El XP a Sabiduría no se gana por crear notas: se gana cuando una nota **se usa** — cerrar un proyecto citándola, retomar una vieja, terminar un libro, escribir un cierre en "Reencauzados". | E12 (lo dañino es la contingencia al compromiso) + E10 (matar el incentivo al volumen) |
| **G2** | **Sin contador visible mientras se escribe.** Nada de "+15 XP" flotando en el editor. La recompensa **esperada** es la que hace daño; la **no anticipada** no. La entrega se hace después, agrupada, en un momento aparte. | E12/E13 |
| **G3** | **Retroalimentación informativa, no controladora.** Decir *"esta semana conectaste tres ideas que estaban sueltas"* (informa competencia). No decir *"te faltan 2 notas para tu meta"* (controla). El cambio es de lenguaje y cuesta cero. | E13 (las recompensas verbales/informativas **mejoran** la motivación intrínseca) |
| **G4** | **Cero racha de escritura.** Kibo ya tiene **una** racha global (PRD §3.5) y escribir ya cuenta para ella. Una segunda racha específica de escritura convierte un placer en obligación diaria. Y aunque exista, debe ser perdonadora por diseño: Duolingo midió que **bajar la ansiedad de racha sube la retención** (+4 % de retorno, −5 % de rachas perdidas). | E15, E16 |
| **G5** | **Eliminar "misiones de enlace" y despenalizar las notas sueltas.** Una nota sin enlaces no es un defecto: es una idea que todavía no encontró familia. Sustituir por una sugerencia sin recompensa, apagable, máximo una por semana: *"Esta nota se parece a esta otra. ¿Las juntamos?"* | E10, E14 |
| **G6** | **Rendimientos decrecientes y tope diario.** El XP por escritura debe saturarse rápido (p. ej. tope al equivalente de 2–3 notas/día). Sin tope, el sistema enseña a farmear y a Marina le confirma que es un juguete. | E10, E14 |
| **G7** | **La escritura nunca es social.** Nada de notas, conteos ni rachas de escritura en el feed de Amigos, ni en la Vitrina, ni comparadas. Escribir es el acto más privado del producto. | E14 (tablas de posiciones como caso documentado de retroceso) |

### 5.5 "El fracaso reencauza" aplicado a la escritura

La marca da la salida correcta si se toma en serio. Una semana sin escribir **no** debe verse como
una llama apagada ni como un pulso en rojo. Debe verse como una bifurcación con permiso explícito
de no escribir:

> **KIBO:** *"Tu bóveda estuvo tranquila esta semana. No pasa nada — no todo se piensa escribiendo.
> ¿Retomamos una nota o la dejamos descansar?"*
> `[ Retomar una ]` `[ Dejarla descansar ]`

El botón **"Dejarla descansar" tiene que existir, ser igual de grande, y no costar nada.** Esa es
la diferencia entre un producto que dice "el fracaso reencauza" y uno que lo cumple. [I] Además, es
lo que salva a Diego en la fase 5 del journey.

### 5.6 La prueba de fuego (predicción falsable)

Si en las entrevistas de la §8 se le muestra a 10 usuarios consolidados una pantalla con
*"+15 XP · nota escrita · racha de escritura: 4 días"* y **5 o más reaccionan con algún matiz de
"me sentiría medido / vigilado / me quitaría las ganas"**, la mecánica está confirmada como
dañina y hay que aplicar G1–G7 antes de escribir una línea de código. Ese es el criterio **K4**.

---

## 6 · Onboarding de la integración

### 6.1 Principios

1. **Ganarse el permiso antes de pedirlo.** Nunca mostrar el banner de Obsidian a alguien que
   todavía no escribió nada en Kibo ni tiene proyectos activos: no hay nada que conectar.
2. **Preparar el terreno antes del diálogo del sistema** (*pre-permission priming*). El cuadro del
   navegador o de Obsidian es frío, técnico y sin marca; si aparece sin contexto, se rechaza. Kibo
   explica primero, en su voz, qué va a pasar; después aparece el diálogo del sistema.
3. **Escalera de confianza: leer antes que escribir.** Primero solo lectura. La escritura se pide
   después, por separado, y acotada a una sola carpeta.
4. **Mostrar el "no" tan grande como el "sí"** en cada punto de decisión.
5. **Cero jerga.** Prohibidas en la interfaz: *sincronización*, *conflicto de merge*, *token*,
   *API*, *endpoint*, *hash*, *repositorio*, *bidireccional*, *reconciliación*, *error 409*.
6. **El "ajá" (§3.3) ocurre en la primera sesión.** El onboarding no termina en "conectado";
   termina cuando el usuario vio algo que no sabía.

### 6.2 Flujo, pantalla por pantalla, con copys en es-MX

---

**P0 · Calificación (evita venderle a quien no le sirve)**
Aparece dentro de Recursos, una sola vez, después de que el usuario tenga ≥5 notas o ≥1 proyecto.

> **KIBO:** *"Antes de nada: ¿tú ya escribes en algún otro lado?"*
> `[ Sí, uso Obsidian ]` `[ Uso otra app ]` `[ No, aquí está bien ]`

- *"No, aquí está bien"* → **cierra el tema y no vuelve a preguntar en 90 días.** (Ximena no debe
  ser empujada; ver §2.3.)
- *"Uso otra app"* → ofrecer importar Markdown y nada más.
- *"Sí, uso Obsidian"* → P1.

---

**P1 · La promesa (antes de cualquier permiso)**

> ### Tus notas se quedan donde están
> *"Obsidian ya es tu lugar para escribir. No quiero mudarte.*
> *Lo que quiero es leerlas para poder decirte cosas como: 'oye, escribiste harto sobre este
> proyecto y llevas tres semanas sin tocarlo'.*
> *Kibo no sube tus notas a ningún lado, no las mueve, no las renombra y no les cambia nada.
> Al principio solo miro."*
>
> `[ Enséñame cómo ]`  ·  `[ Ahorita no ]`

*(Nota de investigación: la frase "no las subo a ningún lado" es una promesa de producto, no de
copy. Si el diseño técnico no la puede cumplir, hay que cambiar el diseño técnico o cambiar la
frase — mentir aquí es el fin de la integración con Marina; ver E1, E3.)*

---

**P2 · Elegir el camino (según su equipo, sin explicarle por qué)**
[H, E9] Solo Chromium de escritorio puede abrir una carpeta local desde la web; [H, E8] en móvil no
hay ruta. El usuario **no debe leer una explicación técnica**: debe ver la opción que le sirve.

> *"Dime dónde escribes normalmente:"*
> `[ En mi compu ]` `[ En mi celular o tablet ]`

- **Compu + navegador compatible** → P3 (ruta carpeta).
- **Compu + Safari/Firefox** → *"Tu navegador todavía no me deja abrir carpetas. Te dejo dos
  opciones: ábrelo en Chrome o Edge, o instala mi complemento en Obsidian."*
- **Celular** → *"En el celular, Obsidian guarda tus notas en un lugar cerrado al que no puedo
  entrar — así lo diseñó tu teléfono, y está bien. Conéctalo desde tu compu y aquí lo vas a ver."*
  **Nunca dejar al usuario móvil en un callejón sin salida silencioso.**

---

**P3 · El permiso (preparado, luego el diálogo del sistema)**

> ### Señálame la carpeta
> *"Necesito que me apuntes a la carpeta donde vive tu bóveda. Tú eliges cuál —y solo esa.*
> *Voy a ver una lista de los archivos y a leer el texto. No voy a mover nada, ni borrar, ni
> escribir. Puedes quitarme el acceso cuando quieras."*
>
> `[ Elegir mi carpeta ]`  ·  `[ Mejor no ]`

→ *(aquí, y solo aquí, aparece el diálogo del navegador)*

---

**P4 · Vista previa antes de tocar nada** — *esta pantalla es la que salva la fuga #3*

> ### Ya vi tu bóveda. No toqué nada.
> **412 notas · 38 carpetas · la más reciente es de ayer**
>
> *"Todo sigue exactamente igual que como lo dejaste. ¿Quieres que te las muestre aquí en Kibo?"*
>
> `[ Sí, muéstramelas ]` `[ Déjame revisar primero ]` `[ Desconectar ]`

---

**P5 · El "ajá" (obligatorio, primera sesión)**

> **KIBO asomándose:**
> *"Encontré algo. Escribiste **6 notas** sobre **'Migración a Postgres'**… y ese proyecto lleva
> **23 días** sin moverse en tu tablero.*
> *¿Lo retomamos, o lo reencauzamos y te quedas con lo que aprendiste?"*
>
> `[ Retomarlo ]` `[ Reencauzarlo ]` `[ Déjalo así ]`

Si el escaneo **no** produce ningún cruce como este, no inventar uno flojo. Mejor decir la verdad:

> *"Por ahora solo estoy mirando. En cuanto tengas un proyecto andando, te voy a poder conectar
> los puntos."*

---

**P6 · Pedir escritura (después, y por separado)**
Nunca en la misma sesión que P3. Se pide cuando el usuario intenta hacer algo que la requiere.

> ### ¿Te dejo notas en tu bóveda?
> *"Cuando abras un proyecto, puedo dejarte una nota lista para que escribas ahí.*
> *Si me dejas, **voy a escribir en una sola carpeta y en ninguna otra.** Tú le pones el nombre."*
>
> `Nombre de la carpeta:` **[ Kibo ]**
> `[ Sí, solo ahí ]` `[ No, prefiero que solo leas ]`

### 6.3 Cómo se comunica un conflicto de sincronización

Este es **el copy más importante de toda la integración** (fuga #4, E4). Reglas:

1. **Nunca usar la palabra "conflicto", "error" ni "falló".**
2. **Primero la tranquilidad, después el hecho, al final la decisión.** El usuario tiene una sola
   pregunta: *¿perdí algo?* Se responde en la primera línea.
3. **Nunca culpar** ("editaste en dos lados a la vez" es un reproche).
4. **No hacer nada tiene que ser seguro** y tiene que ser una opción visible.
5. **Ofrecer ver, no adivinar.** Mostrar las dos versiones con lenguaje humano ("la de tu compu" /
   "la que estaba aquí"), nunca un *diff* en crudo.
6. **Nunca de madrugada ni en notificación push.** Estas cosas se cuentan cuando la persona abre
   Kibo.

**Copy propuesto:**

> ### Esta nota creció por dos lados
> **No se perdió nada.** Guardé las dos versiones de **"Arquitectura del sync"**.
>
> *"Escribiste aquí y también en tu bóveda, y las dos versiones son distintas. No quise decidir
> por ti."*
>
> `[ Ver las dos ]` `[ Quedarme con la de mi compu ]` `[ Después ]`
>
> <sub>Tus dos versiones están completas y guardadas. Puedes dejar esto para luego.</sub>

**Variante bajo "el fracaso reencauza"** (si el equipo quiere voz de mascota):

> **KIBO:** *"Ups. Escribiste en dos lugares a la vez y ninguno estaba mal. Me quedé con las dos
> —no soy quién para elegir. ¿Le echas un ojo?"*

**Otros mensajes difíciles, resueltos:**

| Situación | Copy | Qué NO decir |
|---|---|---|
| Bóveda no encontrada | *"No encontré tu carpeta. A veces pasa cuando cambia de lugar o el disco no está conectado. **Tus notas están bien** — el que se perdió fui yo. ¿Me la vuelves a señalar?"* | "Error de sincronización: ruta no encontrada" |
| Permiso revocado por el navegador | *"El navegador me cerró la puerta —lo hace por seguridad cada tanto. ¿Me abres otra vez?"* | "Permiso denegado (NotAllowedError)" |
| Nota borrada en la bóveda | *"Borraste 'Zettelkasten' en tu bóveda, así que aquí también desapareció. Si fue sin querer, tu bóveda tiene el respaldo — yo no guardo copias de lo tuyo."* | Restaurarla en silencio |
| Bóveda gigante / escaneo lento | *"Tienes 4,200 notas. Bien ahí. Voy a tardar tantito en leerlas todas; puedes seguir usando Kibo mientras."* | Barra de progreso sin explicación |
| Desconectar | *"Listo, ya no veo tu bóveda. **Tus notas se quedan donde siempre estuvieron** — lo único que se fue es mi vista."* | "¿Seguro? Perderás tus datos" (falso y manipulador) |

### 6.4 Anti-patrones de onboarding, explícitos

- ❌ Pedir acceso a la carpeta en el registro o antes del primer valor.
- ❌ Diálogo del sistema sin preparación previa.
- ❌ Recompensar el conectar la bóveda con XP o gemas — [I] convierte un acto de confianza en una
  transacción y activa E12 en el peor momento posible.
- ❌ Mostrar "38 notas huérfanas" en la primera pantalla (mata a Diego, §3.4).
- ❌ Poner la integración detrás del muro premium **antes** de que el usuario compruebe que sirve.
  Cobrar por leer archivos que ya son del usuario es la lectura más hostil posible para Marina.
- ❌ Notificaciones push sobre estado de sincronización.

---

## 7 · Sergio como usuario cero

### 7.1 Veredicto: **sí, adóptalo — pero sabiendo qué te da y qué no**

**Sí, porque:** hay conocimiento que no se transfiere leyendo. Sergio puede aprender *qué es* un
wikilink en diez minutos; lo que no puede aprender de otra forma es **el gusto y la fricción**: qué
se siente abrir la bóveda un martes cansado, por qué se termina tocando la estructura en vez de
escribir (E10), qué tan violento es que una app te pida apagar el Modo restringido (E2), y sobre
todo **qué se siente un conflicto de sincronización** (E4) — que es el momento que este análisis
señala como crítico y que ningún documento transmite.

**Pero con una advertencia que no debe perderse:** treinta días de Obsidian convierten a Sergio en
**un Diego bien informado, no en una Marina**. El criterio del consolidado —cinco años de bóveda,
apego a la estructura propia, ideología local-first— **no se puede simular**. Adoptar Obsidian es
**necesario pero no suficiente**: hay que hacerlo *y además* entrevistar (§8). Quien crea que su
propio uso reemplaza la investigación va a diseñar para sí mismo y llamarlo evidencia.

### 7.2 Bóveda de arranque (concreta)

**Una sola bóveda.** Nombres de carpeta **sin acentos, sin ñ, sin emojis** — evita problemas al
sincronizar entre sistemas operativos, y es exactamente el tipo de detalle que solo se aprende
sufriéndolo.

```
vault-sergio/
├── 00-Inbox/          ← todo cae aquí primero, sin pensar
├── 01-Diario/         ← notas diarias: 2026-08-08.md
├── 02-Proyectos/      ← una nota por proyecto (NO una carpeta)
├── 03-Areas/          ← Kibo, TIBS, Chubb, Salud... (lo que sea tuyo, no las 5 de Kibo)
├── 04-Recursos/       ← lo que lees, referencias, ideas sueltas
└── 05-Archivo/        ← DELIBERADO: ver 7.4
```

**Nota diaria:** archivo `YYYY-MM-DD.md` en `01-Diario`. El formato ISO importa: ordena solo
alfabéticamente y no tiene ambigüedad día/mes. Plantilla de **tres campos y nada más** (si es más
larga, se abandona en la semana 2):

```markdown
# 2026-08-08

## Qué pasó

## Qué aprendí

## Con qué me quedo
```

**Plugins — con calendario deliberado.** La disciplina aquí *es* el experimento:

| Cuándo | Qué instalar | Por qué |
|---|---|---|
| **Semanas 1–2** | **Ninguno.** Solo funciones nativas: Notas diarias, Backlinks, Plantillas, Búsqueda. | Sentir el producto base. Instalar plugins la primera semana es caer en E10 y perder el experimento. |
| **Semana 3** | Máximo 3: **Calendar**, **Tasks**, **Templater** | Tasks es obligatorio: es el modelo de checkbox que Kibo tendría que hablar si algún día cruza tareas. Hay que sentir por qué es incómodo. |
| **Semana 4** | Uno de gamificación (**Gamificate your PKM** o **RPG Levelling**, E6) | **El experimento más valioso.** Instalarlo *tarde*, cuando ya escribe por gusto, y observar la propia reacción. Si a Sergio le estorba, ya tiene su respuesta sobre §3.12 en carne propia. |

**Sync: obligatorio, y con dos dispositivos.** Sin sync no hay experimento. Cualquier ruta sirve
(Obsidian Sync de pago, iCloud, Syncthing).

> **La hora más valiosa de todo el ejercicio:** *provocar un conflicto a propósito.* Editar la
> misma nota en compu y celular con ambos sin red, reconectar, y observar qué pasa, qué mensaje
> sale, qué archivo aparece, y **qué se siente** (E4). Hacerlo en la semana 2, con la bóveda ya
> con contenido propio. Sin esto, la §6.3 se diseña a ciegas.

### 7.3 Cuánto tiempo, para qué criterio

| Tiempo de uso **diario real** | Qué criterio le da | Qué decisión habilita |
|---|---|---|
| **7 días** | Sabe operarlo | Ninguna. Es entusiasmo de novedad. |
| **14 días** | Tiene opiniones | Nomenclatura y copys (§6). |
| **30 días** | **Piso mínimo.** Ya pasó el bajón; sabe si se sostiene solo | **Congelar la arquitectura de información (§4) y la regla de oro.** |
| **60 días** | Sabe qué se abandona y por qué | Diseñar el mes 1 de otros; decidir sobre §3.12. |
| **90 días** | Tiene una bóveda con historia y ya la necesita | Único momento honesto para decidir sobre sync bidireccional. |

**Recomendación:** **30 días antes de cerrar decisiones de arquitectura de información; 60 antes de
construir cualquier escritura hacia la bóveda del usuario.** Y en paralelo desde el día 1, las
entrevistas de la §8 — no en serie, porque el tiempo de reclutamiento corre solo.

### 7.4 Por qué `05-Archivo/` está a propósito

La bóveda incluye Archivo **aunque Kibo no lo tenga** (brief §3.9). Es un experimento con
hipótesis: [I] a las 3–4 semanas Sergio va a *necesitar* mover algo ahí, y en ese momento va a
sentir en el cuerpo el hueco que la §4.5 argumenta por escrito. Si no lo necesita, la §4.5 está
equivocada y hay que decirlo.

### 7.5 Qué observar de sí mismo (protocolo de auto-etnografía)

**Regla de método: la bitácora va FUERA de la bóveda** (un archivo aparte, o el repo de Kibo). Si
vive dentro, se contamina el experimento — escribir la bitácora se sentiría como "usar Obsidian".

Dos minutos al final del día, seis preguntas fijas:

1. ¿Abrí la bóveda hoy? ¿**Por gusto o por deber**?
2. ¿Escribí algo? Si no, ¿qué me lo impidió — flojera, no saber dónde ponerlo, o no tener nada?
3. ¿Cuántos minutos pasé **tocando la estructura** (carpetas, plugins, plantillas) vs. escribiendo?
   *(Este es el indicador de E10 y probablemente el número más revelador de todo el mes.)*
4. ¿Volví a abrir alguna nota vieja? ¿Cuál y por qué? *(Es la señal de valor real: el retorno, no
   la escritura — base de la regla G1.)*
5. ¿Hubo algún momento de fricción? ¿Cuál exactamente?
6. ¿Hubo algo que quise hacer y Obsidian no me dejó? *(Ahí está el hueco donde Kibo cabe.)*

**Métricas propias a mirar al día 30:**

| Indicador | Qué significa |
|---|---|
| Días con al menos una nota escrita / 30 | Si es < 12, **la escritura no se sostiene sola** — y eso valida la premisa de Kibo. Si es > 25, escribir ya es intrínseco y la §5 se vuelve más urgente. |
| Notas reabiertas / notas escritas | El **índice de retorno**. Es la métrica que G1 propone recompensar. Si es < 0.2, la bóveda es un basurero elegante. |
| Minutos de estructura / minutos de escritura | Índice de procrastinación sofisticada (E10). |
| Día exacto en que dejó de abrirla (si pasa) | El día del abandono es más informativo que todo lo demás junto. Anotar qué pasó ese día. |

### 7.6 Si decidiera no adoptarlo

No es la recomendación, pero para que quede la alternativa: sustituir el uso propio por
**5 sesiones de observación** (no entrevistas) de 60 minutos, con usuarios compartiendo pantalla y
haciendo su rutina real de escritura mientras narran en voz alta. Cuesta ~10 horas más
reclutamiento y **no** da la sensación de fricción diaria ni la experiencia del conflicto de sync.
Sirve para las decisiones de §6, es débil para las de §4 e insuficiente para §5.

---

## 8 · Plan de validación

> **Criterio de diseño del estudio:** el estudio más barato que **puede decir que no**. Un estudio
> que solo puede confirmar la idea no es investigación, es teatro.

### 8.1 Restricción de partida

Kibo hoy **no tiene base de usuarios** (brief §2.1: repo casi vacío, maqueta en Claude Design). Eso
descarta las pruebas dentro del producto (*fake door* — poner un botón que no hace nada para medir
cuánta gente lo aprieta — y test A/B). Hay que salir a buscar a la gente donde está.

### 8.2 El estudio, en tres piezas y tres semanas

| Pieza | Método | N | Duración | Qué contesta |
|---|---|---|---|---|
| **1** | **Entrevistas de descubrimiento** (comportamiento pasado, no opiniones) | **10**: 5 Marina, 3 Diego, 2 Ximena | 45–50 min c/u | ¿Existe el problema? ¿Quién lo tiene? ¿Qué hacen hoy? |
| **2** | **Prueba de reacción a la mecánica** (últimos 10 min de las mismas entrevistas) | Los mismos 10 | incluido | ¿La gamificación de la escritura ayuda o repele? (**K4**) |
| **3** | **Prueba concierge / Mago de Oz** — *simular el producto a mano, sin construirlo* | **5** (de los de la pieza 1) | 3 semanas, ~2 h/semana de Sergio | ¿El valor existe? ¿Vuelven por él? (**K3**) |

**La pieza 3 es la más importante y la más barata en relación a lo que revela.** Funciona así: cinco
personas le comparten a Sergio (por captura de pantalla, exportación o simplemente contándoselo)
qué escribieron esa semana y qué proyectos traen. Sergio, **a mano, sin nada de código**, les manda
cada lunes un solo mensaje: *el artefacto del "ajá"* (§3.3) — "escribiste 6 notas sobre X y ese
proyecto no se mueve hace 3 semanas; ¿lo retomas o lo reencauzas?".

Lo que se mide no es si les gusta. Se mide **si abren el mensaje sin recordatorio, si contestan, y
si a la semana 3 lo piden ellos.** Esto prueba la hipótesis central del producto sin construir sync,
sin plugin, sin permisos y sin arriesgar la bóveda de nadie.

### 8.3 A quién reclutar y dónde

| Perfil | Criterio de tamizaje (*screener*) | Dónde buscarlo |
|---|---|---|
| **Marina** ×5 | Obsidian ≥2 años · ≥300 notas · sync configurado · ≥5 plugins comunitarios | Discord oficial de Obsidian (~110 k miembros, E11), foro oficial (respetando sus reglas de promoción), comunidades PKM en LinkedIn, r/ObsidianMD y r/PKMS |
| **Diego** ×3 | Instaló Obsidian hace ≥6 meses · **no lo ha abierto en ≥30 días** | Es el más fácil y el más ignorado: red personal, LinkedIn, colegas de TIBS. Casi todos conocen a uno. |
| **Ximena** ×2 | Nunca usó Obsidian/Logseq/Roam · toma notas en el celular | Red personal |

**Incentivo:** tarjeta de regalo modesta y equivalente para todos. **Regla dura de sesgo: cero
amigos cercanos en el grupo de Marina.** Un amigo no te dice que tu idea no sirve. Diego y Ximena
sí pueden salir de la red personal (su sesgo es menor y es más difícil reclutarlos de otro modo),
pero hay que anotarlo como limitación.

### 8.4 Guion de entrevista (50 min)

**Reglas del moderador, no negociables:**
- **No mencionar Kibo, ni la integración, ni que Sergio la está construyendo, hasta el bloque F.**
- **Nunca preguntar "¿usarías…?" ni "¿te gustaría…?".** La gente dice que sí y luego no lo usa. Solo
  se pregunta por lo que **ya hizo**.
- **Pedir que muestren, no que cuenten.** "Ábrelo" vale diez veces más que "descríbemelo".
- **Aguantar el silencio** tres segundos después de que parezca que terminaron. Ahí sale lo bueno.
- Grabar (con permiso) y, si se puede, ser dos: uno modera, otro anota.

---

**A · Calentamiento y contexto** *(5 min)*
1. Cuéntame la última vez que abriste tu bóveda. ¿Qué estabas haciendo y qué buscabas?
2. ¿Cuántas veces la abriste ayer? ¿Y el fin de semana?
3. Compárteme pantalla y enséñame tu carpeta raíz. ¿Qué es cada cosa? ¿Cómo llegó a ser así?

**B · Trabajo real con las notas** *(10 min)*
4. Abre la última nota que escribiste. ¿Qué te llevó a escribirla?
5. Cuéntame la última vez que **volviste** a una nota vieja y te sirvió de algo. ¿Cómo la
   encontraste? *(Mide retorno — la base de G1.)*
6. Enséñame una nota que escribiste y nunca volviste a ver. ¿Qué pasó con ella?
7. ¿Hay algo que dejaste de hacer en tu bóveda porque te daba flojera? ¿Qué era?

**C · El resto de su vida operativa** *(10 min)*
8. ¿Dónde viven tus pendientes hoy? Enséñamelo.
9. ¿Alguna vez intentaste meter tus tareas a Obsidian? Cuéntame qué pasó. *(Casi siempre la
   respuesta es "lo intenté y no funcionó" — E7; ahí está el hueco de Kibo.)*
10. ¿Qué plugin instalaste y después desinstalaste? ¿Por qué?
11. ¿Cuándo fue la última vez que cambiaste la estructura de tu bóveda? ¿Cuánto tiempo le
    dedicaste? *(Mide E10 sin nombrarlo.)*

**D · Confianza, permisos y accidentes** *(10 min)*
12. ¿Le has dado acceso a tu bóveda a alguna otra app o servicio? ¿Cuál? ¿Qué te hizo confiar?
13. ¿Hubo alguna que **no** quisiste instalar? ¿Qué te frenó exactamente?
14. Cuéntame la última vez que tuviste un problema de sincronización. ¿Cómo te enteraste, qué
    hiciste, cómo te sentiste? *(Bloque crítico: alimenta §6.3.)*
15. ¿Qué tendría que hacer una app para que la desinstalaras el mismo día?
16. ¿Has apagado el Modo restringido? ¿Te acuerdas qué sentiste cuando salió la advertencia?

**E · La motivación de escribir** *(8 min)*
17. Escribir en tu bóveda, ¿te cuesta o te da gusto? Cuéntame de un día de cada tipo.
18. ¿Hay semanas en que no escribes nada? ¿Qué sientes en esas semanas?
19. ¿Has usado alguna app que te dé puntos, niveles o rachas (Duolingo, Habitica, lo que sea)?
    ¿Cómo te fue? ¿Sigues usándola?
20. *(Si aplica)* ¿Qué pasó el día que perdiste una racha?

**F · Reacción al concepto** *(7 min — hasta aquí no se mencionó Kibo)*
Mostrar **un solo artefacto**, no el producto: una tarjeta con el mensaje del "ajá" (§3.3, P5).
21. ¿Qué crees que es esto? *(Antes de explicar nada.)*
22. ¿De dónde crees que salió esa información?
23. Si esto te llegara cada lunes, ¿qué harías con él? ¿Y a la tercera semana?
24. ¿Qué te molesta de esto?
25. ¿Qué tendría que pasar para que lo apagaras?

Después mostrar **la segunda tarjeta**: la pantalla de *"+15 XP · nota escrita · racha de
escritura: 4 días"*.
26. ¿Y esto? ¿Qué te provoca? *(Callarse. Registrar la reacción literal, palabra por palabra.
    Esta pregunta decide K4.)*

**G · Cierre** *(3 min)*
27. Si pudieras borrar una cosa de tu sistema actual, ¿cuál sería?
28. ¿Qué le pediste alguna vez a Obsidian que no supo hacer?
29. ¿A quién más debería preguntarle esto?

### 8.5 Criterios de muerte (pre-registrados)

> **Concepto:** los *kill criteria* se escriben **antes** de recolectar datos. Si se escriben
> después, siempre se encuentra la manera de que los datos digan que sí. Estos se firman antes de
> la primera entrevista.

| # | Si ocurre esto… | Entonces… |
|---|---|---|
| **K1** | ≥6 de 10 no pueden nombrar un problema que Kibo resolvería mejor que su bóveda + su app de tareas actual | **No hay hueco.** No construir la integración; Recursos queda como módulo autónomo. |
| **K2** | ≥5 de 10 rechazan que una app web toque su carpeta, **y no cambian de postura** tras explicarles el alcance de solo lectura | **La ruta local está muerta.** Solo quedan plugin propio o import/export manual. |
| **K3** | En el concierge (5 personas), **menos de 2** piden el segundo o tercer envío sin que Sergio se los recuerde | **El valor no existe.** El problema no es la implementación ni el copy: es la propuesta. **Este es el criterio de muerte principal.** |
| **K4** | ≥5 de 10 consolidados reaccionan negativo a la pregunta 26 (XP/racha por escribir) | **Muere la mecánica, no la integración.** Aplicar G1–G7 antes de construir §3.12. |
| **K5** | Ninguno de los "bóveda dormida" atribuye su abandono a falta de hábito o motivación | **La tesis central de Kibo (PRD §1) no aplica a este segmento.** Replantear a quién le habla la integración. |
| **K6** | Reclutar 5 "Marinas" toma más de 3 semanas | **Señal de alcance, no de producto.** Si no se les puede ni hablar, tampoco se les va a poder distribuir. Reconsiderar. |

**Y el criterio inverso —qué sería un sí claro—:** ≥3 de 5 del concierge piden el siguiente envío
por su cuenta, **y** ≥7 de 10 en el bloque C cuentan un intento fallido de meter tareas en Obsidian.
Eso es hueco real más valor demostrado, y justifica invertir.

### 8.6 Costo estimado

~20–24 h de Sergio (10 entrevistas + síntesis) + ~6 h del concierge + incentivos para 10 personas.
Tres semanas de calendario, en paralelo con sus primeros 30 días de Obsidian (§7). **Cero líneas de
código.**

---

## 9 · Recomendación

### 9.1 Postura

**Sí construir una integración con Obsidian — pero no la que describe el PRD §4, y no todavía.**

1. **Reformular qué es la integración.** No es "sincronizar Recursos con la bóveda". Es **darle
   contexto de vida a las notas**: cruzar lo que el usuario escribe con lo que se comprometió a
   hacer, y devolvérselo. El sync es el costo; el cruce es el producto. Todo el diseño debe girar
   alrededor del artefacto del §3.3, no alrededor del motor de sync.

2. **Una vía, de lectura, y sobre pocos objetos.** El precedente más exitoso del ecosistema
   (Readwise, E5) resolvió el mismo problema eligiendo una sola dirección y no sobrescribir nunca.
   La inclinación bidireccional del brief (§1) es la ruta que garantiza el dolor que la comunidad
   ya odia (E4) a cambio de un beneficio que nadie pidió. **Si Kibo escribe, que escriba en una
   sola carpeta que el usuario nombró, y en ninguna otra.**

3. **Rediseñar la gamificación de la escritura ANTES de construirla.** El §3.12 tal como está —XP
   por nota, racha de escritura, misiones de enlace— es la configuración que la evidencia señala
   como más dañina (E12) aplicada al segmento con más motivación intrínseca que perder (Marina), y
   además paga por el anti-patrón que la comunidad desprecia (E10). Aplicar G1–G7 de la §5.4.

4. **Resolver la duplicidad con la regla de oro, y aceptar su consecuencia:** *"Tu bóveda es donde
   escribes; Kibo es donde eso se vuelve progreso."* Nunca dos editores. Si el equipo no está
   dispuesto a que Recursos deje de ser editor cuando hay bóveda conectada, esta integración va a
   generar la sensación de duplicado sin importar qué tan bueno sea el sync.

5. **Sergio: adoptar Obsidian 30 días con el protocolo de la §7, y en paralelo correr el estudio
   de la §8.** No en serie. Y con la conciencia de que su uso propio le da criterio de Diego, no
   de Marina.

6. **Cambiar la métrica del PRD §5.** El 25 % a 90 días es aritméticamente inalcanzable (§3.2).
   Sustituir por la métrica condicionada propuesta, que mide si sirve en vez de medir cuánta gente
   usa Obsidian.

**Lo que NO haría:** el plugin propio en el catálogo comunitario como apuesta de distribución
temprana. Es una comunidad que audita, discute y desconfía por diseño (E2, E3); llegar ahí con un
producto que aún no existe y una capa de juego sin validar es exponerse a un rechazo público que
después cuesta años revertir. Primero el concierge (§8.2, pieza 3); el plugin cuando haya algo que
defender. *(La secuencia detallada le toca a `product-planner`.)*

### 9.2 Las tres cosas que más me preocupan

**1 · Dos superficies de escritura.** Es el riesgo más grande y el menos visible, porque no se
manifiesta como error sino como silencio: el usuario simplemente deja de escribir en ambos lados. Es
un problema de arquitectura de información, no de ingeniería, y ninguna cantidad de sync lo arregla.
Se resuelve antes de codificar o no se resuelve. **Señal de alarma:** si en el diseño alguien
propone "que el usuario elija dónde prefiere escribir", el problema no se resolvió — se delegó al
usuario.

**2 · La gamificación puede matar justo lo que quiere fomentar.** Para Marina, escribir ya es
placer; ponerle un contador es la definición de manual del efecto de sobrejustificación (E12), y su
reacción no será "qué divertido" sino **"esto me está midiendo"**. Y para Diego, "38 notas
huérfanas" no es una misión: es un reproche —lo contrario exacto de *"el fracaso reencauza"*. La
ironía del proyecto es que la capa que hace único a Kibo es también la que puede volverlo
inaceptable para el público de esta integración. **Si hay que sacrificar algo, sacrifiquen las
mecánicas de escritura, no la integración.**

**3 · Sergio le está diseñando a una comunidad que lo mira con desconfianza por defecto, y no tiene
ningún activo de credibilidad en ella.** Obsidian arranca en Modo restringido (E2), su foro debate
en serio la seguridad de los plugins (E3), y su identidad de marca es "tus archivos, tu disco"
frente a servicios como el que Kibo es. Contra eso, Kibo llega siendo una **app web con cuenta,
suscripción y economía de gemas** que pide acceso a una carpeta. Esta es la única de las tres
preocupaciones que el diseño **no puede resolver sola**: se resuelve con transparencia radical
(código del puente abierto, promesa de "no sube nada" cumplible y auditable), con presencia real en
la comunidad antes de pedir nada, y con paciencia. Si no hay disposición a invertir en eso, la
integración solo va a funcionar con Diego y con Ximena — que es un producto legítimo, pero **no es
el que el PRD §4 está describiendo.**

---

### Fuentes

Todas consultadas el 2026-08-08.

**Obsidian — documentación y foro oficiales**
[obsidian.md](https://obsidian.md/) ·
[Plugin security](https://obsidian.md/help/plugin-security) ·
[Community plugins](https://obsidian.md/help/community-plugins) ·
[Sync encryption: is there any way to audit it?](https://forum.obsidian.md/t/sync-encryption-is-there-any-way-to-audit-it-privacy-and-security-concerns/37313) ·
[Security of the plugins](https://forum.obsidian.md/t/security-of-the-plugins/7544) ·
[How concerned should one be about security when using community plugins?](https://forum.obsidian.md/t/how-concerned-should-one-be-about-security-when-using-community-plugins/89829) ·
[Obsidian Sync: Self-Hosted Server](https://forum.obsidian.md/t/obsidian-sync-self-hosted-server-on-premise/20975) ·
[Conflicted copies when using remotely-save with Dropbox](https://forum.obsidian.md/t/conflicted-copies-when-using-remotely-save-with-dropbox/55984) ·
[Conflicted Copy spamming](https://forum.obsidian.md/t/conflicted-copy-spamming/19358) ·
[Robust Sync Conflict Resolution](https://forum.obsidian.md/t/robust-sync-conflict-resolution/93544) ·
[Option to let user manually resolve sync conflicts](https://forum.obsidian.md/t/option-to-let-user-manually-resolve-sync-conflicts/94468) ·
[I have a lot of .json conflict files](https://forum.obsidian.md/t/i-have-a-lot-of-json-conflict-files-on-my-obsidian-folder/66795) ·
[Full File System Access For The iOS App](https://forum.obsidian.md/t/full-file-system-access-for-the-ios-app-open-existing-vault-folder/28266) ·
[Open an existing vault not in iCloud](https://forum.obsidian.md/t/feature-open-an-existing-vault-that-is-not-in-icloud-obsidian-folder-but-rather-inside-documents/53585) ·
[The PARA method and the hard facts of life](https://forum.obsidian.md/t/the-para-method-and-the-hard-facts-of-life/22279) ·
[Folders vs. linking vs. tags](https://forum.obsidian.md/t/folders-vs-linking-vs-tags-the-definitive-guide-extremely-short-read-this/78468) ·
[A folder-heavy workflow](https://forum.obsidian.md/t/a-folder-heavy-workflow-folders-vs-links-vs-tags-vs-dataview-etc-again/56356) ·
[Gamification plugin](https://forum.obsidian.md/t/gamification-plugin/23568) ·
[The Official Readwise Obsidian Integration Has Launched](https://forum.obsidian.md/t/the-official-readwise-obsidian-integration-has-launched/22311)

**Ecosistema de plugins**
[Obsidian Stats — Most downloaded](https://www.obsidianstats.com/most-downloaded) ·
[Obsidian Plugins Wrapped 2025](https://www.obsidianstats.com/posts/2025-12-04-wrapped-2025) ·
[saertna/obsidian-gamified-pkm](https://github.com/saertna/obsidian-gamified-pkm) ·
[LifeQuest](https://community.obsidian.md/plugins/lifequest) ·
[RPG Levelling](https://community.obsidian.md/plugins/rpg-levelling) ·
[readwiseio/obsidian-readwise](https://github.com/readwiseio/obsidian-readwise) ·
[Readwise docs — Obsidian export](https://docs.readwise.io/readwise/docs/exporting-highlights/obsidian)

**Plataforma web**
[Chrome for Developers — File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access) ·
[MDN — File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) ·
[Cloud Four — The many, confusing file system APIs](https://cloudfour.com/thinks/the-many-confusing-file-system-apis/)

**Motivación, recompensas y rachas**
[Deci, Koestner & Ryan (1999), *Psychological Bulletin* 125(6)](https://leeds-faculty.colorado.edu/dahe7472/deci%201999.pdf) ·
[Deci, Koestner & Ryan (2001), *Review of Educational Research* 71(1)](https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf) ·
[Eisenberger, Pierce & Cameron (1999) — comment (PubMed)](https://pubmed.ncbi.nlm.nih.gov/10589299/) ·
[Wikipedia — Overjustification effect](https://en.wikipedia.org/wiki/Overjustification_effect) ·
[Frontiers in Education (2024) — The ghost effect](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1474733/full) ·
[Duolingo Blog — How Streaks keep learners committed](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/) ·
[UX Magazine — The Psychology of Hot Streak Game Design](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame) ·
[Why People Quit Duolingo](https://my-senpai.com/insights/why-people-quit-duolingo.html)

**Anti-patrones de PKM**
[dsebastien.net — PKM Anti-Patterns](https://www.dsebastien.net/ai-wiki-pkm-pkm-anti-patterns/) ·
[Collector's fallacy (Obsidian Publish)](https://publish.obsidian.md/eriktuck/base/PKM/collectors+fallacy) ·
[Escape the PKM Trap of Sophisticated Procrastination](https://miscellaneplans.medium.com/escape-the-pkm-trap-of-sophisticated-procrastination-8eed3acd4b04)

**Escala del ecosistema (fuente secundaria, con reserva)**
[fueler.io — Obsidian usage & growth statistics](https://fueler.io/blog/obsidian-usage-revenue-valuation-growth-statistics)

---

**Siguientes manos sugeridas** *(recomendación, no ejecución)*
- Convertir la regla de oro y el modelo de tres zonas (§4) en pantallas → `ui-designer`.
- Priorizar qué se construye y en qué orden, con los criterios de muerte de la §8 como compuerta →
  `product-planner`.
- Redactar el PRD de la integración y el ADR correspondiente (constitución Art. 5) → `pm-docs`.
