# 04 · Seguridad del Sistema Operativo Personal

**Fecha:** 2026-08-08 · **Autor:** `security-auditor` · **Tipo:** delta ronda 3 sobre `../obsidian/05-seguridad-y-privacidad.md` (r1) y `../obsidian/15-r2-seguridad-conector.md` (r2) · **Estado:** revisión defensiva, read-only
**Insumos:** constitución **v1.7** (Art. 3 reencuadrado, Art. 12 nuevo), ADR-0001, r1 (KS-01…KS-26, D-1…D-15, T-01…T-20), r2 (KS-27…KS-36, D-16/D-17, T-21…T-27)
**Hechos nuevos:** Kibo es un Personal OS con salud y finanzas como núcleo · **Android primero**, luego web, quizá Windows · **la bóveda vive en una carpeta sincronizada a la nube desde el día uno** · Obsidian pasa a ser lector; la bóveda es **salida** del sistema · nada construido todavía.
**Fuera de alcance:** mercado, roadmap, UI.

Convención: `[V]` verificado con fuente y fecha · `[S]` supuesto de ingeniería · `[P]` pendiente bloqueante o no.

---

## 0 · Qué cambia con la v1.7

El Art. 3 v1.7 corrige el error de encuadre que yo mismo introduje en la ronda 1 y ratifiqué por inercia hasta la ronda 2. Consecuencia operativa inmediata: **retiro toda invocación del Art. 3 como límite de producto** en r1 §1.3, §4 y en la justificación de KS-06 y D-6. Lo que queda gobernando el producto es el **Art. 12**, que es más estricto y más útil, porque exige artefactos verificables en vez de una prohibición.

Una nota de método, porque importa para cómo se lee este documento: en tres rondas cambié de posición sobre el mismo asunto. No fue complacencia — fue que en cada ronda apareció un hecho que invalidaba la premisa anterior (primero el encuadre del conector, luego el destino conocido de la bóveda). Ahora aparece uno más: **la bóveda ya está en la nube**. Si eso hubiera implicado volver a cerrar (a), lo habría dicho. **No lo implica**, y explico por qué en §1.

---

## 1 · La bóveda ya está en la nube: KS-27 y KS-31 reevaluados

### 1.1 La detección deja de ser el control

KS-27 nació para responder *"¿es seguro este destino?"*. Esa pregunta ya está contestada —**no, y nunca lo estará**— así que un control que gasta esfuerzo en averiguarlo es teatro. Mi propia advertencia de la r2 (*Kibo jamás podrá afirmar que una bóveda no está sincronizada*) apuntaba a esto y no llevé la conclusión hasta el final.

**KS-27 se degrada de compuerta (P0) a señal informativa (P1) en escritorio**, con una sola función que conserva valor: detectar `.git` en la raíz, porque el repositorio público es el único desenlace verdaderamente irreversible y sigue siendo distinguible del resto. Todo lo demás —adivinar Dropbox, iCloud, OneDrive— sale.

En su lugar:

> **KS-37 — Postulado de la nube (P0, sustituye a KS-27 como control rector).** Todo byte que Kibo escriba en la carpeta emitida se diseña **como si se estuviera publicando en la infraestructura de un tercero, bajo llaves que el tercero controla, sin posibilidad de revocación ni de borrado**. No es una comprobación en tiempo de ejecución: es un criterio de diseño y una prueba de aceptación. La pregunta que se le hace a cada campo antes de emitirlo es una sola: *¿estaríamos bien si este archivo apareciera en una brecha del proveedor de nube?* Si la respuesta es no, no se emite en claro.

Esto es más fuerte y más barato que la detección: la postura de seguridad deja de depender de **saber el destino** y pasa a depender de **lo que escribimos**, que sí controlamos por completo.

### 1.2 Lo que NO cambia: (a) sigue permitido

Quiero ser explícito para que no se lea como un retroceso silencioso. El análisis jurídico de la r2 §1.4 **no se mueve**: la sincronización a Dropbox la ejecuta el usuario, no Kibo; su copia sigue bajo la exención doméstica (GDPR Art. 2(2)(c)) `[S]`; Kibo sigue sin ser responsable de esa copia. Lo único que cambia es que Kibo **ya no puede alegar desconocimiento**, y eso mueve dos cosas:

| | r2 (destino desconocido) | r3 (destino conocido) |
|---|---|---|
| Default para C4 | Nota-puntero **recomendada** | Nota-puntero **obligatoria**; la proyección completa es una escalada explícita |
| Texto de la divulgación | Condicional (*"si tu bóveda está sincronizada…"*) | **Declarativo**: *"esto quedará en tu Dropbox/Drive. Ni tú ni nosotros podremos borrarlo de ahí."* |
| Verificación de destino | KS-27 como compuerta | KS-37 como postulado |

**KS-31 se transforma en KS-31′.** Muere la reverificación de destino (no tiene sentido reverificar algo constante). Sobrevive y se endurece la parte que trataba la deriva del consentimiento: caducidad de 180 días para C4, re-consentimiento al añadir una categoría nueva, y un **resumen periódico de lo que está saliendo** ("en tu carpeta hay 47 registros de salud"), porque el riesgo ya no es que el destino cambie, es que el usuario **olvide** que el grifo está abierto.

**KS-38 (nuevo, P0) — el nombre del archivo es la carga.** Con la carpeta como salida sincronizada, un listado de directorio filtrado revela la taxonomía sin abrir un solo archivo (H-6 de la r1, ahora en su peor forma). Los nombres que Kibo genera para C4 son **opacos por defecto** (`kibo-h-<ulid>.md`), las carpetas no llevan nombres clínicos, y solo el usuario puede renombrarlos a algo elocuente. En modo de proyección completa el usuario ya eligió; ahí la regla no aplica.

**D-18 (nuevo)** — cifrar el payload C4 dentro del `.md` como sustituto de la nota-puntero. Se rechaza: un blob cifrado es ilegible para Obsidian, Dataview y Bases, o sea que cuesta exactamente la funcionalidad que motiva la integración, y a cambio induce en el usuario la creencia falsa de que la carpeta es segura. Como archivo cifrado local aparte es legítimo; como integración, no lo es.

### 1.3 Consecuencias del reencuadre "la bóveda es salida"

Dos, y ambas tocan al `solution-architect`:

1. **ADR-0001 §1 (transporte) queda en entredicho.** Si Kibo emite una carpeta a un directorio sincronizado, **el plugin deja de ser el transporte**: el transporte es el sistema de archivos más el cliente de nube del usuario. El plugin, si sigue existiendo, se reduce a comodidad de lectura. Eso retira de golpe buena parte de r1 §2.4, KS-11 (token en `data.json`, sustituido por KS-41) y r2 §2.
2. **`[P]`-13 — ¿"y de vuelta" sigue siendo requisito?** Si la bóveda es solo salida, KS-33 y KS-34 (parser hostil, frontmatter que reclama economía) aplican únicamente a la **importación puntual** de bóvedas preexistentes, con ventana acotada. Si Kibo debe leer las ediciones del usuario de forma continua, vuelven a ser P0 permanentes. **Es la ambigüedad más cara sin resolver del nuevo encuadre** y hay que fijarla antes del esquema de datos.

---

## 2 · Android: modelo de amenazas del cliente móvil

Superficie enteramente nueva. Marco de verificación externo recomendado: `[V]` **OWASP MASVS v2.1.0** (publicada el 18-ene-2024, vigente en 2026): 8 categorías, 24 controles, incluida **MASVS-PRIVACY**. Sirve como lista de comprobación citable para la DPIA.

**Premisa que ordena todo lo demás:** en Android, la carpeta emitida vive **fuera del sandbox de la app** por definición. El sandbox protege la base local; no protege nada de lo que Kibo emite. KS-37 no es una precaución en móvil: es una descripción del sistema.

| ID | STRIDE | Amenaza | Sev. | Control |
|---|---|---|---|---|
| T-28 | Info disclosure | **Auto Backup** sube la base local al Drive del usuario. `[V]` `android:allowBackup` es **true por defecto**; Auto Backup existe desde Android 6.0 (API 23), habilitado por defecto, hasta 25 MB por app | **Crítico** | KS-39 |
| T-29 | Info disclosure | Miniatura de apps recientes y capturas con el expediente en pantalla; persisten en disco y pueden entrar al respaldo | Alto | KS-40 |
| T-30 | Info disclosure | Base SQLite en claro dentro del sandbox: FBE protege con el equipo bloqueado, no contra root, respaldo ni equipo desbloqueado | Alto | KS-41 |
| T-31 | Elevation | Dispositivo rooteado, emulador o APK modificado: el sandbox no existe | Alto | KS-41, KS-44 |
| T-32 | Spoofing | Overlay malicioso sobre la pantalla de consentimiento; *task hijacking* | Medio | KS-40 |
| T-33 | Info disclosure | **SAF apuntando a la nube.** `[V]` El árbol concedido puede ser un `DocumentsProvider` de Google Drive o Dropbox: Kibo escribiría **directo al proveedor**, sin copia local intermedia | **Crítico** | KS-43 |
| T-34 | Info disclosure | Portapapeles y autocompletado con dosis, saldos o números de cuenta | Medio | KS-40 |
| T-35 | Info disclosure | Notificaciones en pantalla de bloqueo con contenido clínico | Medio-Alto | KS-40 |
| T-36 | Info disclosure | Componentes exportados, deep links con contenido en parámetros, `PendingIntent` mutables | Alto | KS-45 |

**Inversión interesante:** KS-27 muere en escritorio y **renace más fuerte en Android**. `[V]` En SAF, la *authority* del `DocumentsProvider` identifica al proveedor de forma fiable —no es heurística de rutas, es el identificador del componente—. La detección de destino, que en escritorio era adivinanza, en móvil es un hecho consultable. Ese es KS-43.

**Controles nuevos:**

- **KS-39 — Respaldos del SO excluidos para C1 y C4 (P0).** `android:allowBackup="false"`, o reglas de extracción que excluyan base local, llaves y tokens. `[V]` En API 31+ se configura con `android:dataExtractionRules`; en API ≤ 30 con `android:fullBackupContent`. `[S]` Ambas rutas —respaldo a la nube y transferencia dispositivo-a-dispositivo— se declaran por separado y hay que cubrir las dos. Verificación en QA con `bmgr`/`adb backup`, no por inspección del manifiesto. `[P]`-11: confirmar si el respaldo queda cifrado con el secreto de pantalla de bloqueo en las versiones objetivo; **no asumirlo** — de la respuesta depende si basta excluir o hay que desactivar.
- **KS-40 — Protección de pantalla y canales laterales (P0 para C4).** `FLAG_SECURE` en vistas C4 (bloquea captura y miniatura de recientes), ocultado del contenido al pasar a segundo plano, `setFilterTouchesWhenObscured` en pantallas de consentimiento, notificaciones C4 con visibilidad secreta y texto genérico, portapapeles marcado como sensible y sin acción "copiar" en campos clínicos o financieros.
- **KS-41 — Base local cifrada con llave en Keystore (P0).** SQLCipher o equivalente, llave generada en **Android Keystore**, con **StrongBox** cuando el dispositivo lo tenga. `[V]` Advertencia de arranque: **`EncryptedSharedPreferences` de `androidx.security-crypto` está deprecada desde Jetpack Security 1.1.0-alpha07 (9-abr-2025), sin reemplazo directo**; la vía recomendada hoy es **Tink** sobre DataStore con llaves en Keystore. No arrancar un producto nuevo sobre una API deprecada.
- **KS-42 — Desbloqueo por autenticación para C4 (P0).** `BiometricPrompt` con credencial de dispositivo como alternativa, re-autenticación por tiempo. **El control real no es ocultar la pantalla: es atar la llave del Keystore a esa autenticación** (`setUserAuthenticationRequired`), de modo que sin desbloqueo la llave no exista, no solo la vista. La biometría **nunca sale del TEE**; Kibo no almacena ni recibe datos biométricos, solo un resultado.
- **KS-43 — SAF con identificación de proveedor (P0).** Al conceder el árbol, inspeccionar la authority. Si es un proveedor de nube conocido → la proyección C4 **se rechaza** en ese árbol, o exige el consentimiento reforzado con el texto declarativo de §1.2. Permiso persistido con `takePersistableUriPermission` y **revalidado en cada arranque**, porque el usuario puede revocarlo desde el sistema.
- **KS-44 — Integridad del dispositivo como señal, no como compuerta (P1).** Play Integrity informa y ajusta la postura (p. ej., no ofrecer proyección C4 en equipo comprometido). **No bloquea el uso del producto**: es evadible y bloquear castiga al usuario legítimo.
- **KS-45 — Superficie expuesta mínima (P0).** `android:exported="false"` salvo lo estrictamente necesario; ningún proveedor de contenido que sirva C4; deep links validados y **sin contenido en parámetros**; `PendingIntent` inmutables.
- **KS-46 — Red (P1).** Network Security Config sin tráfico en claro, sin CAs de usuario para el dominio de la API, pinning con plan de rotación documentado.

---

## 3 · Art. 12 traducido a requisitos verificables

### 3.1 Matriz de residencia por categoría (insumo directo del ADR-0002)

Destinos: **D** dispositivo (sandbox de la app) · **B** carpeta emitida / bóveda (fuera del sandbox, sincronizada a un tercero) · **K** servidores de Kibo · **L** proveedor LLM tercero · **M** cliente/servidor MCP externo.
✅ permitido · ⚠️ permitido bajo las condiciones citadas · ⛔ prohibido por diseño.

| Categoría | D | B | K | L | M | Condiciones |
|---|---|---|---|---|---|---|
| **Salud** (expediente, signos, recetas) | ⚠️ | ⚠️ | ✅ | ⛔ | ⛔ | D: KS-39/41/42. B: nota-puntero por defecto (KS-38); proyección completa solo con consentimiento explícito y texto declarativo. K: cifrado a nivel de columna, llave distinta de C3 |
| **Finanzas** — datos patrimoniales | ⚠️ | ⚠️ | ✅ | ⛔ | ⛔ | Mismo régimen que salud |
| **Finanzas** — identificadores explotables (cuenta, PAN, CLABE, saldos, credenciales) | ⚠️ | ⛔ | ⚠️ | ⛔ | ⛔ | **D-17**: nunca a la bóveda, con o sin consentimiento. En K, solo si el producto realmente los necesita; preferible no almacenarlos |
| **Diario / estado de ánimo** | ⚠️ | ⚠️ | ✅ | ⛔ por defecto | ⛔ | Consentimiento propio y separado (KS-09) |
| **Tareas, proyectos, hábitos, rachas** | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | L y M: opt-in granular; es la categoría natural del MCP v1 |
| **Notas y recursos (contenido)** | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | K: **metadata-only por defecto** (r2 §1.3); cuerpo completo como opt-in |
| **Metadatos de archivo** (rutas, nombres, títulos) | ✅ | ✅ | ⚠️ | ⛔ | ⚠️ | **C3, no C2** (H-6). Cifrado en reposo, fuera de logs y telemetría (KS-12) |
| **Estado de juego** (XP, HP, monedas) | ✅ | ⛔ | ✅ | ⚠️ | ⚠️ | **D-13**: nunca en archivos del usuario. Solo lectura agregada hacia L/M |
| **Credenciales y tokens** | ⚠️ | ⛔ | ⚠️ | ⛔ | ⛔ | D: Keystore, excluidos del respaldo (KS-39). K: solo hash/referencia |
| **Datos de terceros presentes en la bóveda** | ✅ | ✅ | ⚠️ | ⛔ | ⛔ | K: minimizar; **sin entidades de personas en v1** (r2 §5); no hay forma de cumplir el Art. 14 |
| **Biométricos** | *permanecen en el TEE* | ⛔ | ⛔ | ⛔ | ⛔ | Kibo nunca recibe ni almacena el dato biométrico, solo el resultado |

### 3.2 Lista de verificación de lanzamiento

| # | Cláusula del Art. 12 | Qué se comprueba | Cómo (evidencia) | Quién |
|---|---|---|---|---|
| 1 | Matriz de residencia antes del código | §3.1 adoptada literalmente en ADR-0002 | ADR aprobado, con fecha anterior al primer commit de esquema | `solution-architect` |
| 2 | Residencia aplicada en código | No existe ruta ejecutable de C4 hacia B (fuera de puntero), L ni M | Test de regresión por categoría + gate estático en CI que prohíbe importar el módulo C4 desde los servicios de LLM y MCP | `cybersecurity-engineer` |
| 3 | Sin C4 al LLM sin DPA | El servicio que compone prompts **no tiene credencial de lectura** sobre las tablas C4 | Revisión de roles de base de datos; prueba negativa que falla si la credencial funciona | `cybersecurity-engineer` |
| 4 | Consentimiento granular | Ninguna casilla premarcada; ninguna celda `(categoría × destino × dirección)` agrupada; C4 en pantalla propia | Captura de cada pantalla + acuse de consentimiento versionado y descargable | `ui-designer` + legal |
| 5 | Revocación tan fácil como el alta | Un clic; retira lo retirable y **declara lo irrecuperable** | Guion de prueba de extremo a extremo | `qa-engineer` |
| 6 | Exportación completa | Incluye datos de la integración: índice, bitácora, credenciales MCP, derivaciones de IA (KS-18) | Export real revisado contra la matriz, categoría por categoría | `qa-engineer` |
| 7 | Supresión en cascada | Borra en K, propaga a encargados, **nunca toca la carpeta del usuario** — y así se declara | Registro de la solicitud al encargado + texto de UI | `cybersecurity-engineer` |
| 8 | DPIA archivada | Cubre: salud, finanzas, diario, Android, carpeta emitida a la nube y MCP | Documento firmado con fecha anterior al lanzamiento; **`[P]`-10** | Sergio + legal |
| 9 | GDPR + LFPDPPP como piso | Forma del consentimiento escrito digital y transferencia internacional resueltas | Opinión legal escrita; **`[P]`-8** | Legal externo |
| 10 | Móvil endurecido | KS-39 a KS-46 verificados en dispositivo, no en el manifiesto | Reporte MASVS v2.1.0 con las 8 categorías | `qa-engineer` |
| 11 | Superficie MCP acotada | No existen scopes de salud ni finanzas; auditoría visible; solo lectura | Inventario de scopes emitidos + revisión de la bitácora | `cybersecurity-engineer` |

---

## 4 · La puerta contractual: KS-06c frente al Art. 12

**No hay conflicto.** El Art. 12 fija un **piso** y admite expresamente que un proyecto añada reglas más estrictas. KS-06c es una regla de producto más estricta que el piso, y por tanto es válida. La pregunta real no es si se reconcilian, sino si conviene mantenerla.

**Recomiendo mantenerla cerrada por política propia en v1**, y dejar escrito por qué el contrato es **necesario pero no suficiente**:

1. **Retención cero ≠ no procesamiento.** ZDR significa que no se conserva en reposo tras la respuesta. El contenido sigue atravesando la infraestructura del proveedor, y los canales de detección de abuso y de revisión humana suelen quedar **excluidos** de la garantía. Hay que preguntar por ellos explícitamente.
2. **La inyección de prompt no se contrata.** Con expediente clínico en el contexto, T-05 y T-12 (r1 §2.6) dejan de ser "XP falso" y pasan a ser **exfiltración de recetas**. Ningún DPA mitiga eso.
3. **Consentimiento dudosamente libre.** Si la función estrella de IA exige el permiso salud→LLM, negarse degrada el producto que el usuario paga. "Libremente otorgado" se tensa.
4. **Asimetría de pagos.** El beneficio es un coach algo mejor; el daño es una lista de fármacos que no se puede volver a asegurar. Irreversibilidad frente a mejora marginal.

**Lo que exigiría antes de siquiera considerar abrirla** (todo, no una selección):

- DPA firmado con: ZDR **contractual y verificable**, con postura declarada sobre monitoreo de abuso y revisión humana; cláusula de no-entrenamiento; lista de sub-encargados con notificación previa; SCCs si hay transferencia internacional; plazo de notificación de brecha; derecho de auditoría o certificación equivalente (ISO 27001 / SOC 2 Tipo II); compromiso de supresión propagable para el Art. 17.
- **DPIA específica de esa función**, con juicio de necesidad y proporcionalidad. `[V]` Si el riesgo residual sigue siendo alto pese a las medidas, el GDPR Art. 36 obliga a **consulta previa a la autoridad de control antes de tratar** — eso es tiempo de calendario que el equipo no controla.
- Consentimiento explícito y separado que **nombre al proveedor concreto**, no "un proveedor de IA", con el producto plenamente funcional si se rechaza.
- Arquitectura de minimización: jamás el expediente completo; el campo mínimo, seudonimizado, sin identificadores directos, con ventana temporal acotada.
- Contención de inyección probada (KS-08 + KS-20) con corpus que incluya intentos de exfiltración de C4.
- **Alternativa local evaluada y descartada por escrito.**

Ese último punto es mi recomendación de fondo: `[S]` **el camino correcto para IA sobre salud no es el DPA, es el procesamiento local**. Android de gama media y alta ya trae aceleración para modelos pequeños; si un modelo en el dispositivo resuelve el grueso del caso, la puerta no debería abrirse nunca y el producto gana un argumento de privacidad que ningún competidor con nube puede igualar. **Handoff a `ai-engineer`: evaluar viabilidad de inferencia local para las funciones que tocan C4, antes de diseñar cualquier ruta contractual.**

---

## 5 · Kibo consultable por IA (MCP): la mayor concentración de riesgo

**El hallazgo central, dicho sin rodeos:** un endpoint MCP sobre categorías especiales **es funcionalmente la ruta (c) que el Art. 12 condiciona a un DPA** — con dos agravantes que la hacen peor: el proveedor del modelo lo **elige el usuario**, y puede **cambiar sin avisar a Kibo**. Kibo no tendría contrato con el destinatario final de los datos, ni forma de saber quién es. Por eso la regla de alcance de KS-48 no es una preferencia: es la única forma de que un MCP sea compatible con el Art. 12.

| ID | Amenaza | Sev. |
|---|---|---|
| T-37 | *Confused deputy* / token passthrough: el servidor acepta un token no emitido para él y lo reenvía aguas abajo | **Crítico** |
| T-38 | *Tool poisoning* / *rug pull*: la descripción de una herramienta cambia tras la instalación e inyecta instrucciones | Alto |
| T-39 | Agregación: una credencial filtrada equivale al volcado de la vida del usuario | **Crítico** |
| T-40 | Herramientas de escritura disparadas por inyección en el contexto del cliente | Alto |
| T-41 | Consultas sin límite: agotamiento de cuota y facturación | Medio |

**Controles innegociables:**

- **KS-47 — Autorización correcta (P0).** OAuth 2.1 con PKCE obligatorio. `[V]` Conforme a las buenas prácticas de seguridad MCP (2026): el servidor **NO DEBE aceptar tokens que no le fueron emitidos** — validar el claim de audiencia contra el URI canónico del servidor y rechazar todo lo demás; **prohibido el passthrough** de tokens del cliente hacia APIs aguas abajo; exigir **Resource Indicators (RFC 8707)** al cliente. Esa única verificación de audiencia neutraliza de golpe las clases de reuso y passthrough.
- **KS-48 — Alcance por categoría, con C4 fuera (P0).** Scopes por categoría y operación: `kibo.tasks:read`, `kibo.habits:read`, `kibo.notes:read`. **En v1 no existen `kibo.health:*` ni `kibo.finance:*`** — no están desactivados, no están implementados. Crearlos exigiría el procedimiento completo de §4.
- **KS-49 — Solo lectura en v1 (P0).** Ninguna herramienta MCP muta estado, otorga economía ni escribe archivos (extensión de KS-07 y KS-34). Si algún día hay escritura, la confirmación humana ocurre **fuera de banda, en la app de Kibo**, nunca en el cliente MCP — porque el cliente es precisamente lo que puede estar comprometido.
- **KS-50 — Minimización en la respuesta (P0).** Agregados y referencias, no volcados. No existe `get_everything`. Límite de filas por respuesta y campos por allowlist. La redacción server-side **no es un control fiable** (una tarea titulada con una dosis es indetectable): el control real es el alcance por categoría, y hay que decirlo así para que nadie confíe en el filtro.
- **KS-51 — Límites de tasa y presupuesto (P0).** Por token, por herramienta y por ventana; presupuesto diario de registros devueltos; **circuit breaker** ante patrones de paginación exhaustiva, que es la firma de un volcado.
- **KS-52 — Auditoría visible para el usuario (P0).** Cada llamada registrada (token, cliente declarado, herramienta, parámetros sin valores, número de registros, marca de tiempo), **visible en la app** como extensión de KS-19, con alerta ante volumen inusual y revocación de un clic por cliente.
- **KS-53 — Cada credencial es un dispositivo nombrado y caduca (P0).** Emisión desde la app con nombre obligatorio, TTL corto, refresh rotativo con detección de reuso (extensión de KS-10) y caducidad automática por inactividad.
- **KS-54 — Declaración explícita antes de la primera credencial (P0).** Una pantalla que diga con precisión que *lo que este cliente lea entra al contexto de un modelo operado por un tercero con el que Kibo no tiene contrato*. Consentimiento propio, separado, revocable. No es redacción de producto: es lo único que hace informado ese tratamiento.
- **KS-55 — Higiene del servidor (P1).** `[V]` Allowlist y validación de toda entrada de herramienta; bloqueo de egreso hacia rangos privados (SSRF); descripciones de herramientas versionadas y fijadas, para que un cambio posterior sea detectable.

**Secuenciación, y es una recomendación fuerte:** el MCP no debe existir antes de que estén la matriz de residencia (§3.1), el modelo de scopes y la bitácora KS-19/KS-52. Construirlo antes garantiza que se construya sin ellos, y añadir control de acceso a un endpoint ya adoptado es el tipo de retroceso que nunca se hace.

---

## 6 · Pendientes legales: bloqueantes, y por qué no pueden esperar

- **`[P]`-8 — LFPDPPP.** `[V]` La nueva ley se publicó en el DOF el 20-mar-2025 y entró en vigor el 21-mar-2025, con las funciones transferidas a la Secretaría Anticorrupción y Buen Gobierno; para datos sensibles y patrimoniales el consentimiento debe ser **expreso y por escrito**. Falta confirmar con asesoría externa: (i) forma admisible del "por escrito" en entorno digital —de eso depende si el acuse de consentimiento basta—, (ii) contenido mínimo del aviso de privacidad, (iii) requisitos de transferencia internacional aplicables a los servidores de Kibo y a cualquier encargado, (iv) si existe figura equivalente a la DPIA. **Bloquea el lanzamiento de los módulos Salud y Finanzas, no solo su proyección.**
- **`[P]`-10 — DPIA.** El Art. 12 la exige antes de lanzar y rehecha cuando el alcance cambia materialmente. **Ya cambió tres veces en tres rondas** (conector, proyección a disco, Android + MCP). No es un documento que se redacta al final para archivar: es el que **decide si la función se lanza**. Y `[V]` si el riesgo residual sigue alto tras las medidas, el GDPR Art. 36 obliga a consulta previa a la autoridad **antes** de tratar, con plazos que no controla el equipo.
- **`[P]`-11** — ¿el respaldo de Android queda cifrado con el secreto de pantalla de bloqueo en las versiones objetivo? Determina si KS-39 excluye o desactiva. `web-architect` / `cybersecurity-engineer`.
- **`[P]`-12** — ubicación de la infraestructura de Kibo: si está fuera de México y de la UE hay transferencia internacional con base jurídica propia. Decide antes de contratar hosting.
- **`[P]`-13** — ¿"y de vuelta" sigue siendo requisito? (§1.3). `solution-architect`.

**Vigentes de rondas anteriores:** `[P]`-1 (almacenamiento cifrado del plugin — decae si el plugin deja de ser transporte), `[P]`-4 (términos y DPA del proveedor LLM), `[P]`-7 (versión de js-yaml ≥ 4.1.1), `[P]`-9 (alcance del metadata cache de Obsidian). **Retirados:** `[P]`-2, `[P]`-5 (r2), `[P]`-6 (absorbido por KS-43, que en Android es fiable).

---

## Recomendación

**Veredicto en una frase:** el reencuadre a Personal OS con Android primero y bóveda en la nube **no reabre ninguna prohibición y no cierra ninguna puerta que la ronda 2 abriera** — lo que hace es sustituir el control rector, que deja de ser *averiguar el destino* (KS-27, ahora imposible y por tanto degradado) y pasa a ser **asumir la nube y decidir qué se emite** (KS-37), con el cliente Android como superficie nueva de primer orden y el endpoint MCP como el punto donde el producto puede perderlo todo de una sola vez.

**Controles bloqueantes nuevos o modificados:**
- **Rectores:** **KS-37** postulado de la nube (P0, sustituye a KS-27 como control rector) · **KS-27** degradado a señal P1, conservando solo la detección de `.git` · **KS-31′** caducidad y resumen periódico, sin reverificación de destino · **KS-38** nombres de archivo opacos para C4 · **D-18** rechazo del cifrado dentro del `.md` como sustituto del puntero.
- **Android (todos nuevos):** **KS-39** respaldos excluidos · **KS-40** protección de pantalla y canales laterales · **KS-41** base cifrada con llave en Keystore (y **no** sobre `EncryptedSharedPreferences`, deprecada) · **KS-42** llave atada a autenticación de usuario · **KS-43** SAF con identificación de proveedor · **KS-44** integridad como señal, no compuerta · **KS-45** superficie expuesta mínima · **KS-46** red endurecida.
- **MCP (todos nuevos, todos P0 salvo KS-55):** **KS-47** validación de audiencia y prohibición de passthrough · **KS-48** alcance por categoría sin scopes C4 · **KS-49** solo lectura · **KS-50** minimización en la respuesta · **KS-51** límites y circuit breaker · **KS-52** auditoría visible · **KS-53** credenciales nombradas y caducas · **KS-54** declaración explícita · **KS-55** higiene del servidor.
- **Se mantiene: KS-06c cerrada por política propia**, más estricta que el Art. 12, con el procedimiento de §4 como única vía de reapertura y el procesamiento local como alternativa preferida.
- **Se retira:** toda invocación del Art. 3 como límite de producto (r1 §1.3, §4, KS-06, D-6).

**Las tres cosas que más me preocupan ahora:**

1. **El endpoint MCP.** Es lo que Sergio pidió por visión y es la mayor concentración de riesgo del producto: un canal que entrega contexto personal a un modelo operado por un tercero **que Kibo no elige, no conoce y no puede auditar**. Bajo el Art. 12 eso solo es defendible si las categorías especiales sencillamente no tienen scope — no desactivado, **inexistente**. Y el riesgo real no es técnico sino de secuencia: si se construye antes que la matriz de residencia y la bitácora, se construirá sin ellas y ya no se le podrán añadir.
2. **Que en Android todo lo que Kibo emite nace fuera del sandbox.** En escritorio la bóveda al menos tocaba disco local antes de sincronizarse; `[V]` con SAF el árbol concedido puede ser el propio `DocumentsProvider` de Google Drive, y el archivo nace en la nube del tercero. Sumado a que `[V]` `allowBackup` es **true por defecto** —la base local se va al Drive del usuario si nadie lo impide—, el móvil tiene dos fugas activas por omisión, no por error. Ambas se cierran con una línea de configuración; ninguna se cierra sola.
3. **Que `[P]`-8 y `[P]`-10 se traten como trámite final.** Son los dos únicos elementos que pueden impedir el lanzamiento de Salud y Finanzas —el núcleo declarado del producto— y su plazo **no lo controla el equipo**: dependen de un despacho externo y, en el peor caso, de una consulta previa a la autoridad con sus propios tiempos. Hoy no hay código escrito: es exactamente el momento de arrancarlos, y el único en que arrancarlos no cuesta nada.

---

## Fuentes nuevas (consultadas 2026-08-08)

- [Back up user data with Auto Backup — Android Developers](https://developer.android.com/identity/data/autobackup) · [Security recommendations for backups — Android Developers](https://developer.android.com/privacy-and-security/risks/backup-best-practices) — `allowBackup` true por defecto; Auto Backup desde API 23; `dataExtractionRules` (API 31+) y `fullBackupContent` (≤ API 30); excluir o cifrar datos sensibles
- [Open files using the Storage Access Framework — Android Developers](https://developer.android.com/guide/topics/providers/document-provider) · [Access documents and other files from shared storage](https://developer.android.com/training/data-storage/shared/documents-files) — SAF y `DocumentsProvider`; los proveedores de nube (Drive, Dropbox) participan como proveedores de documentos
- [EncryptedSharedPreferences is Deprecated — What Should Android Developers Use Now?](https://medium.com/@n20/encryptedsharedpreferences-is-deprecated-what-should-android-developers-use-now-7476140e8347) — deprecada en Jetpack Security 1.1.0-alpha07 (9-abr-2025), sin reemplazo directo; recomendación de migrar a Tink + DataStore + Keystore
- [OWASP MASVS](https://mas.owasp.org/MASVS/) · [OWASP MASVS en 2026: v2.1.0 y sus 8 categorías](https://www.vervali.com/blog/owasp-masvs-in-2026-current-version-the-8-categories-and-what-changed/) — v2.1.0 (18-ene-2024), 8 categorías, 24 controles, MASVS-PRIVACY añadida
- [Security Best Practices — Model Context Protocol](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) · [How to secure your MCP server with OAuth resource indicators — WorkOS](https://workos.com/blog/mcp-resource-indicators) · [MCP Security Best Practices 2026 — Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-best-practices/) — validación de audiencia, prohibición de passthrough, Resource Indicators (RFC 8707), tool poisoning, allowlist de entradas, bloqueo de SSRF
- Rondas 1 y 2: sus fuentes siguen vigentes salvo las relativas al Local REST API y a Local Network Access, sin objeto desde la r2

---

**Handoffs:** `solution-architect` — §3.1 como contenido del ADR-0002 y resolución de `[P]`-13 y del transporte (§1.3) · `cybersecurity-engineer` — KS-39 a KS-46 y KS-47 a KS-55 · `ai-engineer` — viabilidad de inferencia local para funciones que tocan C4 (§4), y coordinación del alcance MCP con KS-48 · `qa-engineer` — reporte MASVS v2.1.0 y los tests de la lista §3.2 · Sergio + legal externo — `[P]`-8 y `[P]`-10, hoy.
