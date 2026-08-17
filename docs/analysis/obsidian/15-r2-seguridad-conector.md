# 15 · Seguridad ronda 2 — el conector y el caso de salud

**Fecha:** 2026-08-08 · **Autor:** `security-auditor` · **Tipo:** delta sobre `05-seguridad-y-privacidad.md` (ronda 1) · **Estado:** revisión defensiva, read-only
**Insumos:** ronda 1 (§1–§8, KS-01…KS-26, D-1…D-15, T-01…T-20), `00-brief.md`, `07-sintesis.md`, `docs/adr/0001-obsidian-integration.md`, `constitution.md` (Art. 1, 3, 9)
**Alcance:** lo que cambia con el encuadre de conector delgado y con el caso de salud. **No repite la ronda 1.** Fuera de alcance: mercado, roadmap, UI.

**Convención de evidencia** (igual que ronda 1): `[V]` verificado con fuente y fecha · `[S]` supuesto de ingeniería · `[P]` pendiente de verificar antes de decidir.

---

## 0 · Qué cambia y qué no

El encuadre nuevo — *plugin sí, pero como conector delgado; Kibo no es una app dentro de Obsidian* — **reduce la superficie de la ronda 1 en dos ejes y la amplía en dos nuevos**:

| Eje | Ronda 1 | Ronda 2 |
|---|---|---|
| Transporte local | Cuatro opciones abiertas (FSA, Local REST API, plugin, agente) | Una sola: plugin saliente. Tres cuartas partes de §2.2, §2.3 y §2.4 quedan obsoletas |
| Lógica en el dispositivo | Plugin con UI, gamificación y reglas | Transporte, emparejamiento y eventos de archivo. Menos código = menos superficie |
| **Nuevo** — datos C4 en disco | Prohibido en bloque (KS-06, D-6) | Reabierto y reencuadrado (§1) |
| **Nuevo** — dirección de ingesta | Mencionada, no analizada | Superficie de primer orden (§5, §6) |

Y una corrección de precisión sobre la lectura provisional que me llegó del orquestador: **la ronda 1 nunca prohibió (b)**. La matriz de §1.2 ya marca `✅` para "Expediente de salud → Servidor de Kibo (cifrado en reposo, columna-nivel)". Lo que KS-06 y D-6 prohibieron fueron el **vault** y el **LLM**. Es un matiz relevante porque significa que el choque con el caso de uso central es **más estrecho** de lo que parecía: no está en el almacenamiento, está exclusivamente en el trayecto al disco.

---

## 1 · El caso de salud — las tres decisiones separadas

### 1.1 Por qué fundirlas fue un error de la ronda 1

Las tres tienen **destinatarios distintos**, y en protección de datos el destinatario es la variable que decide:

| | Acto | Destinatario | Naturaleza jurídica |
|---|---|---|---|
| **(a)** | Kibo escribe una nota `.md` en la bóveda local | **El propio titular**, en su propio equipo | Divulgación al interesado — la familia del Art. 15 (acceso) y Art. 20 (portabilidad) |
| **(b)** | Kibo almacena el expediente en su nube | **Kibo**, como responsable | Tratamiento propio con encargados |
| **(c)** | Los datos entran a un prompt | **Un tercero encargado** (proveedor LLM) y sus sub-encargados | Transferencia a encargado, categoría especial |

La ronda 1 aplicó a (a) el razonamiento de (c). Es un error de encuadre: **dar al usuario sus propios datos no es una transferencia a un tercero.** Un responsable no puede negarse a entregar a una persona su propio expediente alegando que podría manejarlo mal — eso es precisamente lo que el Art. 20 obliga a hacer, y en "formato estructurado, de uso común y lectura mecánica", que es la definición literal de Markdown con frontmatter YAML.

Hay además una **inconsistencia interna** de la ronda 1 que hay que reconocer: el PRD §3.14 ya ofrece *"exportar todo (Markdown/CSV)"*, y la ronda 1 lo dio por bueno (§4.5). Un export de salud a Markdown y una proyección de salud a la bóveda son **los mismos bytes, en el mismo disco, escritos por el mismo software**. La única diferencia real es *quién elige la carpeta y con qué cadencia*. Prohibir uno y permitir el otro no se sostiene.

### 1.2 (c) — al LLM: se ratifica la prohibición, sin cambios

**Veredicto: prohibido. KS-06 se mantiene en su totalidad para esta ruta, y D-6 conserva aquí toda su fuerza.** Razones, todas de la ronda 1 y ninguna debilitada por el conector delgado:

- `[V]` GDPR Art. 9 exige consentimiento **explícito**, no inferible de aceptar términos (ronda 1 §4.2). Un producto de consumo no debería intentar recolectarlo para esto.
- El derecho de supresión (Art. 17) no se puede honrar si el encargado retiene entradas — de ahí que KS-17 exigiera retención cero. Sin ZDR contractual firmado, (c) es indefendible.
- Constitución Art. 3 para la vertiente financiera.
- Y una razón que el conector delgado **agrava**: con ingesta activa (§6), el contexto del LLM contendría contenido de notas no confiable *junto a* datos clínicos. Eso convierte T-05 (inyección indirecta) en un canal de exfiltración de expediente médico, no de XP falso.

Añado un matiz operativo: la prohibición debe expresarse como **regla de arquitectura, no de política** — el servicio que compone prompts no debe tener credencial de lectura sobre las tablas C4. Si la única barrera es un `if`, algún día alguien lo quita.

### 1.3 (b) — en la nube de Kibo: hecho consumado, pero su tratamiento **sí** cambia

Coincido en que (b) es un hecho del producto y no lo reabro. Discrepo en una parte: **su tratamiento sí cambia con la integración, no por el almacenamiento sino por el caudal de entrada.** La capa de mapeo (§5) y la ingesta (§6) hacen que (b) pase de contener *lo que el usuario tecleó en Kibo* a contener *lo que había en su bóveda*, incluyendo categorías que Kibo no pidió y datos de terceros. Ese cambio de caudal es lo que hay que gobernar, no la existencia del almacén.

Condiciones que se mantienen y una que se añade:
- Cifrado en reposo a nivel de columna para C4 (ronda 1 §1.2), llaves separadas de las de contenido C3.
- KS-12 sin cambios: el índice y los nombres de archivo siguen siendo C3.
- **Nuevo:** el aumento de alcance obliga a **rehacer la DPIA** (KS-25). Una DPIA sobre "Kibo guarda salud" no cubre "Kibo ingiere bóvedas ajenas y proyecta salud a discos de usuarios".

**Y aprovecho para cerrar el follow-up que el ADR-0001 me asignó** (*"metadata-only mode"*): la respuesta correcta es **asimétrica según el origen del dato**, no una sola política.
- **Contenido originado en la bóveda** (notas del usuario, C3): **metadata-only por defecto** — Kibo guarda ids, rutas cifradas, hashes, enlaces y frontmatter mapeado; los cuerpos se abren por deep link. Almacenar el cuerpo es un opt-in explícito para quien quiera búsqueda multi-dispositivo.
- **Contenido originado en Kibo** (salud, finanzas, diario, tareas): Kibo **debe** guardarlo íntegro; es el registro autoritativo y sin él el módulo no existe. Metadata-only no aplica.

Esto reduce el peor escenario de brecha —"se filtró el cerebro completo del usuario"— sin romper ningún módulo.

### 1.4 (a) — escribir salud al disco del propio usuario: el análisis nuevo

Es la única de las tres que merecía reexamen. Lo hago por partes.

**Lo que sostiene la lectura provisional (a expone menos que b):** es literalmente cierto para el trayecto. La escritura local no crea una copia en un sistema que Kibo opera, no cruza fronteras, no involucra sub-encargados, no depende de la postura de seguridad de Kibo y no aumenta el radio de una brecha de Kibo. `[V]` Si además el usuario usa Obsidian Sync (E2EE, AES-256-GCM, ronda 1 §1.5), la copia local está mejor protegida que la de Kibo.

**Lo que sostiene D-13 (y sigue en pie):** la bóveda no es un destino, es un **punto de partida**. Puede estar bajo Dropbox, iCloud Drive, OneDrive, Google Drive, Syncthing, rclone o un repo git. El peor caso realista no es hipotético: **una bóveda versionada en git y empujada a un repo público.** Un expediente médico ahí es irreversible — no hay revocación, no hay borrado, hay forks y caché de terceros.

**Pero — y este es el punto que cambia el veredicto — esa propagación la ejecuta el usuario, no Kibo.** `[S]` Bajo GDPR, el tratamiento que una persona física hace de sus propios datos con fines exclusivamente personales queda fuera del Reglamento (Art. 2(2)(c), exención doméstica). Kibo no es responsable de la copia que el usuario sincroniza a su Dropbox, igual que un banco no es responsable de que el cliente deje su estado de cuenta impreso en la mesa. Lo que sí recae sobre Kibo es el **diseño de la entrega**: Art. 25 (protección desde el diseño) y Art. 5(1)(f). Es decir: la obligación de Kibo no es impedir la escritura, es **no hacerla por defecto, no hacerla en silencio y no hacerla sin decir lo que implica.**

**El error de mi ronda 1, dicho sin adornos:** convertí un deber de diseño en una prohibición. La prohibición se veía más segura, pero traslada al usuario un costo enorme (no puede tener sus propios datos donde quiere) a cambio de mitigar un riesgo del que **no es Kibo el responsable** y que **el usuario está en mejor posición de evaluar** — él sabe si su bóveda está en git; Kibo, en el mejor de los casos, lo adivina.

**Ahora la parte incómoda, que es donde el veredicto se acota.** Sometí a prueba la distinción obvia — "un export puntual sí, un espejo continuo no" — y **no aguanta**: un solo export explícito a una bóveda versionada en git es exactamente tan catastrófico como una proyección continua. La cadencia no es el eje de riesgo. **El eje es el conocimiento del destino.** La continuidad solo agrava dos cosas secundarias: que el consentimiento se otorgó sobre un destino que puede cambiar después (el usuario instala Dropbox el mes que viene), y que el volumen acumulado crece sin que nadie vuelva a mirar.

Y aquí está el límite honesto de cualquier control técnico: **Kibo nunca podrá afirmar "tu bóveda no está sincronizada."** `[S]` Puede detectar `.git` en la raíz con alta fiabilidad, y patrones de ruta conocidos (`Dropbox`, `OneDrive`, `iCloud Drive`, `Google Drive`) con fiabilidad media. Falla en silencio ante montajes, enlaces simbólicos, Syncthing, rclone y cualquier sincronizador que no delate su ruta. `[P]` En móvil ni siquiera hay ruta absoluta que inspeccionar. Por lo tanto la detección **es una advertencia, no una compuerta**, y el riesgo residual se transfiere al usuario — lo que obliga a que esa transferencia sea informada para ser válida.

### 1.5 Veredicto sobre el caso de salud

> **(a) deja de estar prohibido.** Kibo **puede** escribir datos de salud como nota Markdown en la bóveda local del propio usuario, porque es una divulgación al titular y no una transferencia a un tercero — **siempre que sea un acto explícito, por categoría, nunca activado por defecto, nunca incluido en "conectar bóveda", con el destino inspeccionado y su incertidumbre declarada, y escrito en una sub-raíz privada separada.**

**Cambios formales a la ronda 1:**

| Antes | Ahora |
|---|---|
| **KS-06** (bloque único) | Se parte en tres. **KS-06a** (C4 → nube de Kibo): permitido, condiciones de §1.3. **KS-06b** (C4 → bóveda del usuario): **permitido bajo KS-27…KS-32**. **KS-06c** (C4 → LLM): **prohibido, sin excepción ni consentimiento que lo habilite** |
| **D-6** ("salud/finanzas al LLM o al vault por comodidad") | Se reduce a **D-6′**: enviar salud o finanzas al LLM. La cláusula "o escribirlas en el vault" se **retira** y se sustituye por **D-16** |
| — | **D-16 (nuevo)**: proyectar C4 al disco **por defecto, en segundo plano, sin inspección del destino, o bajo el mismo consentimiento que el resto de categorías**. Sigue prohibido |
| — | **D-17 (nuevo)**: proyectar identificadores explotables — números de cuenta, PAN, CLABE, saldos, credenciales, números de póliza — **a la bóveda, con o sin consentimiento**. Estos no habilitan divulgación sino **fraude**, y ningún consentimiento del titular protege al banco de enfrente |

**Nota sobre finanzas:** aplico el mismo marco que a salud (mismo consentimiento por categoría), con la excepción dura de D-17. La constitución Art. 3 gobierna a los agentes del workspace, no al producto; lo que gobierna al producto aquí es `[V]` el régimen reforzado de la LFPDPPP 2025 para datos sensibles y patrimoniales (ronda 1 §4.3).

### 1.6 Qué le queda al producto — y una tercera vía que recomiendo como default

Como se me pidió que lo diga directo: **con este veredicto el caso de uso central se puede construir.** Se registra la consulta y las recetas en Kibo, y viajan a la bóveda. No hay que renunciar a nada del ejemplo.

Pero recomiendo que **el default no sea la proyección completa, sino el patrón de nota-puntero**:

- Kibo escribe en la bóveda una nota **enlazable pero sin carga clínica**: identificador, fecha, tipo genérico y un deep link a Kibo. Los wikilinks funcionan (`[[Consulta 2026-08-08]]` sigue siendo una llave foránea), el grafo se conecta, Dataview y Bases pueden contar y cruzar, la línea de tiempo del usuario queda completa — y en el disco no hay diagnóstico, ni fármaco, ni dosis.
- La **proyección completa** (frontmatter con `prescriptions:`, `diagnosis:`) queda como escalada opt-in sobre el puntero, con su propio consentimiento.

Advertencia sobre el puntero, derivada de H-6 (ronda 1): **el título del archivo ya es dato de salud.** Un puntero llamado `Consulta oncología — Dr. Ramírez.md` filtra tanto como el contenido. El puntero debe titularse de forma neutra por defecto (`Kibo/Private/2026-08-08 registro.md`) y solo el usuario puede darle un título elocuente.

Y para dejarlo explícito porque se pidió: **si el veredicto hubiera sido prohibir (a)**, lo que le quedaba al producto era exactamente esto — el puntero sin carga — más el export puntual. No era "nada", pero sí era un producto donde el ejemplo que lo define tenía que contarse en pasado. No hace falta llegar ahí.

---

## 2 · Reevaluación de controles bajo el conector delgado

Solo el delta contra la ronda 1.

**Se retiran (dejan de aplicar):**
- **KS-16** — Local REST API. El ADR-0001 excluye el transporte; el control queda sin objeto. Las prohibiciones **D-2, D-3, D-4** se mantienen como vetos permanentes, no como controles a implementar.
- **T-01, T-13, T-18** — dejan de ser amenazas activas: sin listener local, sin `bindingHost`, sin certificado auto-firmado, no hay superficie.
- **`[P]`-2** (cabecera `Host` y CORS del Local REST API) y **`[P]`-5** (prompt LNA de Chrome) — **retirados**. Ninguna ruta de Kibo toca loopback.

**Se relajan en alcance (no en fuerza):**
- **KS-15** — FSA queda confinada a import/export puntual (ADR-0001). Del control sobreviven dos exigencias: **origen dedicado sin scripts de terceros** mientras exista un handle vivo, y **prohibición de permiso persistente de escritura**. El resto era para el motor de sync que ya no existe.
- **KS-05** — el conflicto de cuerpos es estructuralmente imposible para notas de usuario (ADR-0001 §3). KS-05 sigue vigente pero su dominio se reduce a **archivos generados por Kibo** y a la **reconciliación de ingesta** (§6). Baja de "control central" a "control acotado".
- **KS-13** — se mantiene P0, con radio de explosión menor. El *kill switch* sigue siendo obligatorio: el conector delgado escribe menos, pero sigue escribiendo.

**Se endurecen:**
- **KS-02** — la ronda 1 solo reguló **escritura** a `.obsidian/**`. El conector delgado corre dentro de Obsidian y tendrá tentación de **leer** ahí (inventario de plugins, detección de sync). Regla nueva: **escritura prohibida en absoluto, sin cambio; lectura permitida únicamente para la señal de riesgo local de KS-32, procesada en el dispositivo y jamás transmitida** — transmitirla sería telemetría de cliente, `[V]` prohibida por las Developer policies de Obsidian (ronda 1 §3.3).
- **KS-01** — deja de ser una raíz y pasa a ser **raíz con sub-raíces por clase de sensibilidad** (KS-29). `Kibo/` para C2–C3, `Kibo/Private/` para C4.
- **KS-03** — su dominio se **duplica**: la ronda 1 lo escribió para nube→disco. Ahora aplica también a **rutas y nombres que llegan desde la bóveda** en la ingesta (§6). Un `kibo-id` o una ruta leída de un archivo del usuario es entrada controlada por quien escribió ese archivo.
- **KS-09 / KS-11** — ver §4 y abajo. KS-11 sube de prioridad: con transporte único, el token en `data.json` es **la única credencial de toda la integración**; H-5 no se diluye, se concentra.
- **KS-07** — se extiende: además de "la IA no acuña moneda", ahora **"el frontmatter tampoco"** (KS-34, §6).

**Nuevos (detallados en las secciones que siguen):** KS-27 a KS-36.

**Amenazas nuevas** (continúan la numeración de la ronda 1):

| ID | STRIDE | Amenaza | Sev. | Control |
|---|---|---|---|---|
| T-21 | Info disclosure | Otro plugin comunitario lee el frontmatter C4 vía el metadata cache de Obsidian, sin tocar disco | **Alto** | KS-28, KS-29, KS-32 |
| T-22 | Info disclosure | La bóveda con notas C4 empieza a sincronizarse a Dropbox/iCloud/git **después** del consentimiento | **Crítico** | KS-27, KS-31 |
| T-23 | Tampering/DoS | YAML hostil o malformado en la ingesta: alias bomb, `<<` con prototype pollution, coerción implícita | **Alto** | KS-33 |
| T-24 | Tampering | Frontmatter que reclama economía (`xp: 99999`) o completado de tareas inexistentes | **Medio-Alto** | KS-34 |
| T-25 | Info disclosure | La capa de mapeo lee y sube notas arbitrarias para clasificarlas | **Alto** | KS-35, KS-36 |
| T-26 | Info disclosure | Un wikilink desde una nota C4 crea un **backlink** en una nota no sensible, revelando la asociación fuera de la sub-raíz privada | **Medio-Alto** | KS-30 |

---

## 3 · El riesgo específico del frontmatter con datos sensibles

El planteamiento es correcto y quiero precisarlo, porque la razón técnica es más fuerte de lo que parece.

**No es solo que el frontmatter sea "más legible". Es que Obsidian se lo entrega ya parseado a todos los plugins.** `[S]` Obsidian mantiene un **metadata cache** en memoria con el frontmatter de todas las notas, expuesto a la API de plugins. Un plugin que quiera leer prosa clínica tiene que abrir archivos y hacer NLP; uno que quiera leer `prescriptions:` solo consulta una estructura ya construida. `[V]` No hay sandbox ni permisos para plugins comunitarios (ronda 1 §3.1, campaña PHANTOMPULSE, Elastic Security Labs, abr-2026). `[P]`-9: confirmar el alcance exacto de esa API antes de decidir el esquema.

Y `[V]` desde Obsidian **1.9** el propio core convierte el frontmatter YAML en base de datos consultable con el plugin **Bases** (fuentes al final). Es decir: la propiedad que hace valioso el puente que se quiere construir —frontmatter como columnas— es **exactamente** la que convierte una carpeta filtrada en un expediente clínico consultable. No son dos riesgos, es el mismo mecanismo visto desde los dos lados. Esto hay que decírselo al usuario en esos términos, no suavizado.

**Mitigaciones concretas:**

- **KS-28 — minimización de esquema por clase de dato (P0).** Para C4, el default es **cuerpo en prosa + frontmatter mínimo no clínico** (`type`, `date`, `kibo-id`). Nada de `diagnosis:`, `prescriptions:`, `icd10:`, `dose:` como claves. El usuario puede escalar a frontmatter estructurado con un consentimiento adicional cuyo texto diga la verdad en una línea: *"salud estructurada = salud consultable = salud filtrable"*. **Costo honesto: esto quita el valor Dataview/Bases justo en el caso de salud.** No lo escondo; es el precio real y la decisión de tomarlo es de producto, no mía.
- **KS-29 — sub-raíz privada (P0).** Todo C4 vive bajo `Kibo/Private/`, una sola carpeta que el usuario puede excluir de git, de la sincronización selectiva de Obsidian Sync y de la mayoría de clientes de nube. Kibo **muestra** la línea de `.gitignore` a añadir; **no la escribe** — escribir `.gitignore` violaría el allowlist de extensiones de KS-02, y ese control no se relaja por comodidad.
- **KS-30 — sin wikilinks salientes desde C4 (P0).** Un `[[Dr. Ramírez]]` dentro de una nota médica crea un **backlink en la nota del médico**, que puede vivir fuera de la sub-raíz privada, aparecer en el grafo y viajar en cualquier subconjunto compartido. `[S]` El enlace filtra la asociación aunque el contenido nunca salga. Las notas C4 referencian entidades como texto plano, o solo enlazan a entidades que también viven dentro de `Kibo/Private/`.
- **KS-31 — reverificación del destino y caducidad (P0).** Antes de **cada** corrida de proyección C4: reinspeccionar la superficie de sincronización; si cambió respecto al consentimiento, **pausar y re-preguntar**. Caducidad propuesta: 180 días para C4.
- **KS-32 — señal de riesgo local (P1).** El plugin muestra, **solo en el dispositivo**, cuántos plugins comunitarios hay activos y si la sub-raíz privada queda dentro de su alcance. Es información para que el usuario decida, no telemetría: no se transmite, no se registra en servidor.
- **KS-27 — detección de superficie de sincronización (P0), con su límite declarado.** Detectar `.git` en la raíz de la bóveda y patrones de ruta de nube conocidos. **La UI nunca dice "no está sincronizada"**: dice qué se detectó y dice que no puede saberlo con certeza. `[P]`-6: en móvil no hay ruta absoluta inspeccionable → **recomendación: proyección C4 deshabilitada en móvil en v1.**

---

## 4 · Consentimiento por categoría

**Requisitos que lo hacen válido:**

- `[V]` GDPR Art. 4(11) y Art. 7: libre, específico, informado, inequívoco. Las directrices del EDPB sobre consentimiento exigen **granularidad**: consentimientos separados para finalidades separadas; **agrupar los invalida** (consultado 2026-08-08).
- `[V]` Art. 9(2)(a): para salud el consentimiento debe ser **explícito** — un escalón por encima del ordinario.
- `[V]` TJUE C-673/17 (*Planet49*, sentencia de 1-oct-2019): **las casillas premarcadas no son consentimiento válido.**
- `[V]` LFPDPPP 2025: para datos sensibles y patrimoniales, consentimiento **expreso y por escrito** (ronda 1 §4.3). `[P]`-8 (hereda `[P]`-3): si un clic con acuse verificable satisface el "por escrito" digital en México. **Bloqueante antes de lanzar proyección C4.**
- `[V]` Art. 7(3): retirarlo debe ser **tan fácil como darlo**.

**Modelo. La unidad de consentimiento es la tripleta `(categoría × destino × dirección)`, no "conectar bóveda".**

| Ejemplo de celda | Default | Nivel |
|---|---|---|
| `tasks → bóveda (escritura)` | OFF | ordinario |
| `journal → bóveda (escritura)` | OFF | reforzado |
| `health → bóveda (escritura)` | OFF | **explícito, pantalla propia** |
| `health → frontmatter estructurado` | OFF | **explícito, escalada sobre el anterior** |
| `notes (carpeta X) → nube de Kibo (ingesta)` | OFF | ordinario, **por carpeta** (§5) |
| `notes → LLM` | OFF | reforzado |
| `health → LLM` | **inexistente** | no se ofrece: D-6′ |

Reglas de diseño derivadas, no de estética:

1. **Nada premarcado, nunca**, y jamás una casilla padre que marque hijas.
2. **Las categorías C4 no comparten pantalla** con las demás. Consentimiento explícito significa un acto afirmativo separado y referido a la categoría concreta.
3. **Acuse de consentimiento (consent receipt)** almacenado y descargable: versión exacta del texto mostrado, fecha y hora, categorías, destino, y **la superficie de sincronización detectada en ese momento** (KS-27). Es la evidencia del Art. 25 y el ancla del "por escrito" mexicano.
4. **Simetría**: aceptar y rechazar con el mismo peso visual. Ningún distintivo de "recomendado" sobre una categoría C4 — nudging degrada el "libremente otorgado".
5. **La revocación retira lo proyectable y confiesa lo irrecuperable**: al revocar, Kibo mueve a papelera las notas C4 que él creó bajo su raíz (KS-04: papelera, nunca `unlink`) y **declara en pantalla que no puede recuperar copias ya propagadas** a nube de terceros o a git. Esa frase no es un descargo legal: es el requisito de transparencia que hace válido el consentimiento inicial.
6. **D-12 se mantiene y se refuerza**: un consentimiento único que agrupe acceso a la bóveda, proyección C4 e IA es inválido bajo GDPR y bajo LFPDPPP.

**Control asociado: KS-31** (arriba) cubre la caducidad y la reverificación.

---

## 5 · La capa de mapeo de campos — superficie nueva

Para clasificar hay que leer. Ahí está el problema entero.

**T-25.** Un mapeador que lee la bóveda para proponer correspondencias procesa notas que pueden contener cualquier cosa: salud de terceros, minutas laborales bajo NDA, datos de menores, credenciales. Y **D-7** de la ronda 1 ya prohíbe indexar la bóveda completa por defecto.

- **KS-35 — clasificar en el dispositivo; enviar el esquema, no los datos (P0).** La inferencia corre **local, dentro del plugin**, sobre carpetas que el usuario seleccionó. A la nube viaja únicamente el **esquema propuesto**: nombres de clave, tipo inferido, conteo de ocurrencias y hasta *k* valores de ejemplo **solo para claves de cardinalidad baja que el usuario apruebe uno por uno** (`status`, `rating`). Nunca valores de campos de texto libre ni de campos clasificados como potencialmente C4.
- **La clasificación no usa LLM sobre valores.** Heurística determinista sobre nombres de clave y tipos. Si en algún momento se usa un modelo, ve sobre **nombres de clave**, jamás sobre contenido — de lo contrario KS-06c queda burlado por la puerta de atrás.
- **Detección de C4 que excluye, no que incluye.** Si el mapeador reconoce indicadores clínicos o financieros en una carpeta, el default es **excluirla del alcance** y avisar, no ofrecerse a mapearla.
- **KS-36 — el consentimiento de ingesta es por carpeta, no por categoría (P0).** Asimetría importante y no obvia: en la **proyección** Kibo conoce la categoría antes de escribir, así que puede pedir consentimiento por categoría. En la **ingesta** la categoría solo se conoce **después de leer**, así que un consentimiento "por categoría" sería ficticio — ya leíste. Por eso el consentimiento de entrada tiene que ser **por carpeta y previo**, con una vista previa de qué se leerá.
- **Datos de terceros.** La bóveda contiene datos personales de otras personas. Mientras están en el disco del usuario, la exención doméstica lo cubre a él. **En el instante en que Kibo los ingiere a su nube, Kibo se vuelve responsable de datos de terceros sin base legal y sin forma de cumplir el Art. 14** (información al interesado). `[S]` Mitigación: no construir entidades de personas/CRM a partir de la bóveda en v1, y aplicar el modo metadata-only de §1.3 a todo lo no mapeado explícitamente.

---

## 6 · Ingesta de vuelta — entrada no confiable convertida en registros

Un `.md` del usuario es **entrada controlada por el atacante** en el sentido estricto: pudo escribirlo un tercero, llegar en una bóveda compartida, o venir de un recorte web.

**KS-33 — endurecimiento del parser y de los límites (P0).** Todo lo siguiente es bloqueante antes de la primera ingesta:

- **Parser seguro y actualizado.** `[V]` En js-yaml v4 `load` es seguro por defecto (sin construcción de tipos arbitrarios) y existe la opción **`maxAliases`** para acotar la expansión de alias (*billion laughs*). `[V]` **CVE-2025-64718**: prototype pollution vía el operador de mezcla `<<` en js-yaml ≤ 4.1.0, **corregida en 4.1.1**, que además añade `maxTotalMergeKeys`. `[P]`-7: confirmar la versión que usará la API de Kibo y fijarla ≥ 4.1.1 con escaneo de CVE como gate (KS-14 ya lo exige).
- **Prohibir anclas, alias y `<<` en el frontmatter ingerido.** Ningún frontmatter legítimo de una nota los necesita. Rechazar el documento es más seguro que acotarlo, y elimina de un golpe la bomba de expansión y la clase de la CVE.
- **Nada de tipado implícito en valores clínicos o numéricos.** `[V]` YAML 1.1 convierte `no`, `off`, `n` en booleanos (el *Norway problem*) y `010` en octal (=8); YAML 1.2 lo corrige, pero no se controla qué escribió el usuario ni con qué editor. **Para el caso de salud esto deja de ser un problema de seguridad y pasa a ser de daño**: una dosis mal coercionada es un error clínico. Regla: **leer todo valor C4 como cadena y coercionar explícitamente con validación de unidad y rango**; nunca dejar que el parser decida el tipo.
- **Defensa de prototipo en la capa de aplicación**, no solo en el parser: rechazar `__proto__`, `constructor` y `prototype` como claves; construir objetos con prototipo nulo; nunca `Object.assign` de un objeto del usuario sobre uno interno.
- **Esquema con allowlist de claves.** Las claves desconocidas se descartan o se guardan en un blob opaco. **Ninguna clave del usuario crea columnas ni índices** — un `type` controlado por el usuario no debe poder crear tipos de entidad.
- **Límites duros, con rechazo y no truncado** (truncar corrompe registros en silencio): `[S]` tamaño de archivo ≤ 1 MB para ingesta, frontmatter ≤ 16 KB, ≤ 100 claves por nota, profundidad de anidamiento ≤ 4, longitud de array ≤ 200, notas por lote y bytes por ventana acotados, y **timeout de parseo por archivo**.
- **Recorrido de directorios con detección de ciclos** (conjunto de inodes/fileId visitados y profundidad máxima) — enlaces simbólicos circulares son la bomba de expansión del sistema de archivos. Y **KS-03 aplica a las rutas ingeridas**, no solo a las escritas.
- **Salida segura aguas abajo**: consultas parametrizadas; escape al renderizar en Kibo web; normalización NFC y rechazo de anulaciones de dirección de texto (U+202E) en títulos, igual que en KS-03.
- **Idempotencia**: la ingesta se llavea por `(ruta, hash de contenido)`; reprocesar el mismo archivo no puede duplicar registros ni volver a otorgar valor.

**KS-34 — el frontmatter no acuña moneda (P0).** Extensión directa de KS-07. Ninguna clave leída de un archivo del usuario puede fijar XP, monedas, gemas, HP o racha. Un `xp: 99999` es una **afirmación**, no un hecho. Solo los *intents* validados contra un registro que Kibo posee (ADR-0001 §2) generan valor, con límite de tasa por nota y por día, y con la detección de anomalías de KS-23 como segunda línea.

---

## 7 · Delta a la matriz de residencia (§1.2 de la ronda 1)

Solo las filas que cambian.

| Categoría | Dispositivo / vault | Servidor de Kibo | LLM |
|---|---|---|---|
| **Salud** | ⛔ → **⚠️** (KS-06b: consentimiento explícito por categoría, `Kibo/Private/`, KS-27…KS-32; default = nota-puntero) | ✅ sin cambio | ⛔ **sin cambio** (KS-06c) |
| **Finanzas** | ⛔ → **⚠️** mismo marco, **menos** identificadores explotables (**D-17**) | ✅ sin cambio | ⛔ **sin cambio** |
| **Contenido de notas de Recursos** | ✅ | ⚠️ → **metadata-only por defecto** (§1.3), cuerpo completo como opt-in | ⚠️ sin cambio |
| **Frontmatter estructurado de categorías C4** | *(fila nueva)* **⚠️ escalada con consentimiento propio** — riesgo de agregación (§3) | n/a | ⛔ |
| **Datos personales de terceros presentes en la bóveda** | *(fila nueva)* ✅ (del usuario) | **⚠️ minimizar; sin entidades de personas en v1** (§5) | ⛔ |

---

## 8 · Pendientes nuevos y retirados

| ID | Pendiente | Quién |
|---|---|---|
| `[P]`-6 | ¿Ruta absoluta de la bóveda accesible desde el plugin en escritorio? ¿Y en móvil? De ahí depende KS-27 y la recomendación de deshabilitar C4 en móvil | `web-architect` |
| `[P]`-7 | Versión de js-yaml (o parser equivalente) en la API; fijar ≥ 4.1.1, `maxAliases` configurado, `<<` rechazado | `cybersecurity-engineer` |
| `[P]`-8 | LFPDPPP 2025: ¿clic + acuse verificable satisface "expreso y por escrito" para datos sensibles y patrimoniales? **Bloqueante para KS-06b** | Asesoría legal externa |
| `[P]`-9 | Alcance exacto del metadata cache de Obsidian expuesto a plugins de terceros | `web-architect` |
| `[P]`-10 | **Rehacer la DPIA** (KS-25): la proyección de C4 a dispositivos de usuarios y la ingesta de bóvedas son operaciones nuevas no cubiertas | Sergio / legal |
| ~~`[P]`-2~~ | Retirado — el Local REST API queda fuera del producto | — |
| ~~`[P]`-5~~ | Retirado — ninguna ruta toca loopback | — |

---

## Recomendación

**Veredicto sobre el caso de salud, en una frase:** que Kibo escriba salud en la bóveda **local del propio usuario** deja de estar prohibido —es una divulgación al titular, no una transferencia a un tercero, y prohibirla era confundir un deber de diseño con un veto—, **siempre que sea un acto explícito por categoría, nunca por defecto, con el destino inspeccionado y su incertidumbre declarada, en una sub-raíz privada y con la nota-puntero como comportamiento base**; lo que sigue absolutamente prohibido es que esos datos entren a un prompt de un LLM.

**Controles bloqueantes nuevos o modificados:**
- **Modificados:** **KS-06** se parte en **KS-06a** (nube: permitida), **KS-06b** (bóveda: permitida bajo condiciones) y **KS-06c** (LLM: prohibida) · **D-6 → D-6′** (solo LLM) · **KS-02** ahora regula lectura además de escritura de `.obsidian/**` · **KS-01** con sub-raíces por clase · **KS-03** extendido a la ingesta · **KS-07** extendido en KS-34 · **KS-25** DPIA rehecha.
- **Nuevos P0:** **KS-27** detección de superficie de sincronización con límite declarado · **KS-28** minimización de esquema para C4 · **KS-29** sub-raíz `Kibo/Private/` · **KS-30** sin wikilinks salientes desde C4 · **KS-31** reverificación de destino y caducidad de consentimiento · **KS-33** endurecimiento del parser YAML y límites de ingesta · **KS-34** el frontmatter no acuña moneda · **KS-35** clasificar en el dispositivo, enviar el esquema y no los datos · **KS-36** consentimiento de ingesta por carpeta.
- **Nuevos P1:** **KS-32** señal de riesgo local de plugins.
- **Nuevas prohibiciones:** **D-16** (proyección C4 por defecto, en segundo plano o bajo consentimiento agrupado) · **D-17** (identificadores financieros explotables al disco, con o sin consentimiento).
- **Retirados:** **KS-16**, `[P]`-2, `[P]`-5.

**Las tres cosas que más me preocupan ahora** (las de la ronda 1 siguen vigentes; estas las desplazan en prioridad):

1. **Que el consentimiento envejezca mal.** Es el riesgo nuevo dominante y no tiene solución técnica completa: el usuario autoriza proyectar su salud a una bóveda que hoy no está sincronizada, y en noviembre instala Dropbox o corre `git init`. KS-27 y KS-31 lo atenúan, no lo eliminan — Kibo **jamás** podrá afirmar que una bóveda no está sincronizada. Todo el diseño de consentimiento tiene que estar construido sobre esa confesión, no sobre una falsa garantía.
2. **Que el frontmatter estructurado convierta una carpeta en un expediente clínico consultable.** El mecanismo que hace valioso el puente —`[V]` Bases y Dataview leyendo YAML como columnas— es idéntico al que hace catastrófica una filtración, y `[V]` los plugins comunitarios no tienen sandbox. La nota-puntero y KS-28 son la respuesta, y su costo es real: quitan el valor de consulta justo en el caso de salud. Esa es la decisión de producto que no puedo tomar yo.
3. **Que la ingesta se vuelva la vía de entrada que la nube nunca fue.** La ronda 1 blindó la dirección nube→disco y dejó casi sin analizar la contraria. Un `.md` que nadie escribió pensando en Kibo se convierte ahora en fila de base de datos, en tarea, en evento de racha y potencialmente en dosis clínica. `[V]` La CVE-2025-64718 de js-yaml y el *Norway problem* son la demostración de que el eslabón no es el diseño sino el parser, y que un error ahí no produce texto raro: produce un registro médico incorrecto.

---

## Fuentes nuevas (todas consultadas 2026-08-08)

- [Obsidian 1.9.0 introduces Bases plugin for database-style note management — AlternativeTo](https://alternativeto.net/news/2025/5/obsidian-1-9-0-introduces-bases-plugin-for-database-style-note-management) · [Introduction to Bases — obsidianmd/obsidian-help (DeepWiki)](https://deepwiki.com/obsidianmd/obsidian-help/5.1-introduction-to-bases) · [An Overview of the Bases Core Plugin — Practical PKM](https://practicalpkm.com/bases-plugin-overview/) — Bases como plugin core desde 1.9.0; los datos viven en Markdown local y frontmatter YAML
- [js-yaml — docs/safety.md](https://github.com/nodeca/js-yaml/blob/HEAD/docs/safety.md) · [js-yaml CHANGELOG](https://github.com/nodeca/js-yaml/blob/master/CHANGELOG.md) · [CVE-2025-64718 — OpenCVE](https://app.opencve.io/cve/CVE-2025-64718) — `load` seguro por defecto en v4; `maxAliases`; prototype pollution vía `<<` corregida en 4.1.1 con `maxTotalMergeKeys`
- [7 YAML gotchas to avoid — InfoWorld](https://www.infoworld.com/article/2336307/7-yaml-gotchas-to-avoidand-how-to-avoid-them.html) · [YAML Gotchas: The Norway Problem & Type-Coercion Traps](https://yamlvalidator.dev/yaml-gotchas) — coerción implícita YAML 1.1 (`no`→false, `010`→octal) y corrección en 1.2
- [EDPB Guidelines on Consent — resumen Securiti](https://securiti.ai/blog/edpb-updated-guidelines-on-consent/) · [GDPR Consent Requirements for Health Data — Momentum](https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data) — granularidad por finalidad; el consentimiento agrupado es inválido; consentimiento explícito para Art. 9
- TJUE, asunto **C-673/17** (*Planet49*), sentencia de **1-oct-2019** — las casillas premarcadas no constituyen consentimiento válido
- Las fuentes de la ronda 1 (§Fuentes de `05-seguridad-y-privacidad.md`) siguen vigentes salvo las relativas al Local REST API y a Local Network Access, que quedan sin objeto

---

**Handoffs recomendados** (sin cambios respecto a la ronda 1, más): `cybersecurity-engineer` para KS-33/KS-34 (parser, límites, defensa de prototipo) y KS-27 (detección de destino) · `solution-architect` para KS-29/KS-35/KS-36, que cambian el contrato de escritura y el de ingesta del ADR-0001 · asesoría legal externa para `[P]`-8 y `[P]`-10, ambos bloqueantes de KS-06b.
