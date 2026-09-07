# Kibo — Documentación Técnica

Dónde vive cada archivo, qué hace, y qué se puede tocar sin romperlo.

**Para quién es:** Quien mantenga el código después del lanzamiento.
**Versión:** 1.0-alpha

## Registro de modificaciones

| Versión | Fecha | Editó | Qué cambió | Por qué |
|---|---|---|---|---|
| 1.0-alpha | 2026-09-06 | technical-writer | Primera versión de la documentación técnica | El portafolio documenta cada solución en cinco documentos numerados |

## Contenido

- [1. Arquitectura del sistema](#1-arquitectura-del-sistema)
- [2. Estructura de monorepo](#2-estructura-de-monorepo)
- [3. Backend: API y dominio](#3-backend-api-y-dominio)
- [4. Clientes: web y mobile](#4-clientes-web-y-mobile)
- [5. Sincronización y offline](#5-sincronización-y-offline)
- [6. Bóveda Markdown: output del sistema](#6-bóveda-markdown-output-del-sistema)
- [7. Decisiones arquitectónicas](#7-decisiones-arquitectónicas)

---

## 1. Arquitectura del sistema

### 1.1 Principio central

**Kibo no es una app con IA. Es un almacén de contexto personal con superficies de acceso.**

Las superficies son:
- App Android (Expo/React Native)
- Web (Next.js)
- Bóveda Markdown (Obsidian)
- Capa de IA (no es un cliente, es un consumidor de la query surface)

Lo que debe estar bien son:
- El **envelope uniforme de datos** (`ContextItem`)
- El **log de operaciones** (la fuente de verdad transaccional)
- **Control de acceso por categoría** (qué datos ve cada consumer)

Todo lo demás es consumidor de esos tres.

### 1.2 Topología: un escritor, N lectores

```
┌─────────────────────────────────────────────────────────┐
│                    apps/api (NestJS)                     │
│         Único escritor de dominio y tablas de juego      │
└────────────┬──────────────────────────────────────────┬──┘
             │                                          │
    ┌────────▼──────┐                          ┌───────▼─────┐
    │  apps/web     │                          │ apps/mobile │
    │  (Next.js)    │                          │ (Expo/RN)   │
    │  Cliente      │                          │  Cliente    │
    └─────────────┬─────────────────────────┬──┘
                  │                          │
         ┌────────▼──────────────────────────▼────────┐
         │    Replica local cache (expo-sqlite, web) │
         │    Cache, nunca la fuente de verdad      │
         └──────────────────────────────────────────┘

         ┌─────────────────────────────────────────┐
         │  Projector (server) → Obsidian          │
         │  Convierte Operation log a notas MD     │
         └─────────────────────────────────────────┘

         ┌─────────────────────────────────────────┐
         │  IA: lee ContextItem query surface      │
         │  Propone, nunca ejecuta                 │
         └─────────────────────────────────────────┘
```

**Regla: solo `apps/api` escribe tablas de dominio y juego. Los clientes leen vía API y escriben vía API. Nunca hay acceso directo a Prisma desde clientes.**

### 1.3 Tecnología por capa

| Capa | Tecnología | Por qué |
|---|---|---|
| **Backend** | NestJS + TypeScript | Ceremonia = organización para quien aprende. Impulsa decisiones. Ya estaba en repo |
| **Schema & migrations** | Prisma + Postgres | Transferable: SQL y migrations se usan en TIBS lunes |
| **Autenticación** | Better Auth (self-hosted) | Usuarios viven en nuestro Postgres. Tipos generados de Lucia. Auth.js scaffold migra mientras sea viable |
| **API** | REST + OpenAPI, versionado en ruta (`/v1/`) | Móviles viven meses en versiones viejas. Los tipos se generan del esquema sin perder versionado |
| **Background jobs** | `pg-boss` en Postgres | No Redis. Enseña queues, retries, idempotency. `LISTEN/NOTIFY` es el mecanismo |
| **Web** | Next.js + React | Cliente de `apps/api`, no toca Prisma. Patrón BFF para renderización en servidor |
| **Mobile** | Expo (React Native) | SAF URIs para `StorageAccessFramework`. Costo: las pantallas se escriben dos veces |
| **Local cache** (mobile) | `expo-sqlite` + Drizzle | Cache + cola de intenciones. WatermelonDB es alternativa |
| **Sync** | Construido (no comprado) | Regla del cliente descartable: si SQLite se corrompe, refrescar del servidor. Cero pérdida |
| **Tokens/design** | TypeScript inputs → CSS outputs | Tokens son datos: `{mix: '--kb-coin', amount: 0.42, space: 'oklab'}`. Dos generadores: CSS web, style object RN |
| **Mascota** | Rive (máquina de estados) | Un asset `.riv` en web y Android. Inputs: `hp` (number), travesura/gesture (triggers), `toyEquipped`/`reducedMotion` (bool). Vinculación de datos: `skinTint`, `skinType`, `accessory` |

---

## 2. Estructura de monorepo

**pnpm + Turbo.** Una lista de packages, y es esta:

```
apps/
  api/               NestJS. Único escritor. Solo backend
  web/               Next.js. Un cliente
  mobile/            Expo / React Native. Un cliente
  obsidian-plugin/   Opcional. Transporte continuo a bóveda (§6.4)

packages/
  database/          Prisma + Postgres. SOLO SERVIDOR
  config/            tsconfig + eslint base. Cuatro consumidores
  api-contract/      Zod schemas + generated client. Consumido por api, web, mobile
  core/              Dominio puro: curva XP, streaks, reward = prioridad × esfuerzo, aritmética de fecha con timezone. Sin UI, sin IO
  tokens/            Valores de diseño. Sin implementación de estilo. Dimensión theme desde el día 1
  markdown/          Serializador vault. SOLO SERVIDOR
  projection/        Motor de proyección (Operation → notas MD). SOLO SERVIDOR
  sync-core/         Tipos Operation/changeset, queue, policy. Server + plugin. NO mobile
```

**Regla de importación ejecutada:** `packages/database`, `markdown` y `projection` **nunca** se importan desde `apps/mobile` o `apps/web`. Es el boundary que detiene el dominio en la API.

**Convención `core`:** `packages/core` contiene **reglas de dominio puro solamente** — sin IO, sin UI, sin framework. Si no cabe en esa oración, va a otro lugar. El nombre es corto y atrae todo, así que la regla es la defensa.

**Eliminado:** `packages/ui` (prometía compartir React DOM ↔ React Native; falsa promesa). Vuelve después como `@kibo/ui` (solo web, sin shadcn, sobre tokens).

**Eliminado:** Cinco archivos junk en root (`Clean`, `Launching`, `Old`, `Spawning`, `Waiting` — output de `start-kibo.bat`).

---

## 3. Backend: API y dominio

### 3.1 `apps/api` — estructura esperada

```
src/
  main.ts                    Prefijo global, Versionado de URI, ValidationPipe, Lista permitida de CORS, Límite de cuerpo, RFC 9457 errors
  auth/                      Better Auth config + session adapter
  users/                     Schemas, controllers, services
  habits/                    Ídem
  contexts/                  La query surface: ContextItem retrieval con category filtering
  [... un módulo por dominio]
  game/                       Reglas puras: XP, streaks, rewards. Importa de packages/core
  operations/                Log de operaciones: cada mutación de dominio es una Operation
  projector/                 Convierte Operation log → markdown
  jobs/                      pg-boss: streaks que expiran, syncs programados
```

**Trabajo bloqueante antes de código:**
- Completar `main.ts` (prefijo global, versionado de URI, ValidationPipe, lista permitida de CORS, límite de cuerpo, filtro RFC 9457).
- Tres esquemas de credencial diseñados juntos: browser session, mobile token (OAuth 2.0 + PKCE, rotating refresh, `expo-secure-store`), vault-connector token.
- Idempotency en economía del servidor: una misma operación nunca dobla el reward.
- Encriptación a nivel de columna y límite de credencial por rol de Postgres para datos especiales (salud, finanzas).
- Tablas de consentimiento y auditoria que Art. 12 requiere.
- Eliminar `apps/api/src/users/users.controller.ts` (su `findOne(+id)` convierte UUID en `NaN`).

### 3.2 `packages/core` — dominio puro

Reglas que viven aquí y se reutilizan en web y mobile:

| Regla | Quién la ejecuta |
|---|---|
| **Curva XP** | Todas las plataformas calculan XP antes de subir a servidor. Servidor recalcula y reconcilia |
| **Racha (streak)** | Cliente calcula si el usuario metió hoy. Servidor es autoridad en expiración a medianoche |
| **Recompensa = prioridad × esfuerzo** | Cliente propone. Servidor valida |
| **Aritmética de fecha con timezone** | `packages/core` — "¿es hoy en la zona del usuario?" |

**Restricción:** `core` no importa nada que tenga IO o UI. Ni Prisma, ni React, ni componentes.

### 3.3 La query surface (§3 de ARCHITECTURE.md)

```typescript
query(
  categories: Category[],      // antes: retrieval
  timeRange: [Date, Date],
  types: EntityType[],
  entities: string[],
  text: string,
  limit: number,
  purpose: string             // "ai-reflection" | "export" | ...
): Promise<{
  items: ContextItem[],
  redactionReport: {
    categoriesRequested: Category[],
    categoriesRetrieved: Category[],
    itemsFiltered: number,
    reason?: string            // "user has not consented to health"
  }
}>;
```

**Dos reglas en la firma misma:**
1. **Category filtering antes de retrieval, no en formatting.** Datos no autorizados nunca entran al proceso.
2. **Redaction es explícita,** así la IA puede decir "no veo finanzas" en lugar de inventar.

**Auditoría:** Toda query se registra: quién, cuándo, categorías, item ids, propósito, modelo, policy de retención, versión de consentimiento.

---

## 4. Clientes: web y mobile

### 4.1 Paridad de funcionalidad, no de pantallas

**Ambos entregan en v1. La paridad es de funcionalidad, no de pantallas.**

- Una funcionalidad existe en web y mobile, expresada en idioma nativo: timeline ancha en web es list en phone; quick capture en phone es form en web.
- **Un módulo completo en un cliente antes de portarlo.** Nunca dos clientes a 50%.

### 4.2 Web: `apps/web` (Next.js)

**Cliente de `apps/api`, exactamente como el teléfono. Nunca toca Prisma.**

- Server-side rendering es permitido: llamar a `/api/v1/*` desde el servidor. No tocar Prisma.
- Una excepción mientras existe: session adapter (infraestructura de sesión, no dominio).
- Patrón BFF: el servidor Next.js puede enriquecer antes de devolver al cliente.

**No hardcodea ambiente:** Database, schema, warehouse, hostname, endpoint — todo viene de config. Ver Art. 16.

### 4.3 Mobile: `apps/mobile` (Expo/React Native)

**Cliente de `apps/api`. Expo por SAF URIs (StorageAccessFramework) para escribir bóveda.**

**Metro + pnpm:** Metro históricamente no seguía symlinks. Opciones:
1. `node-linker=hoisted` en `.npmrc` — menos sorpresas, pierde garantía pnpm.
2. `metro.config.js` explícito con `watchFolders` y `nodeModulesPaths`.

Verificar contra versión Expo pinned antes de fijar config.

### 4.4 Cache local (ambos)

**El cliente es descartable.** El estado local es cache, nunca la fuente de verdad.

- Si SQLite se corrompe, descartar y refrescar del servidor. Cero pérdida.
- Una operación nunca se saca de queue hasta que el servidor confirma.

**Prueba automatizada (no intención):** Limpiar la DB local y afirmar que cero se perdió. Escribir esa prueba antes de que offline queue exista.

---

## 5. Sincronización y offline

### 5.1 Dos motores, un log

```
Mobile ↔ Server:  REPLICATION
  - Mismo schema
  - Convergencia automática y obligatoria
  - Usuario nunca es preguntado

Server → Vault → Connectors:  INTEGRATION
  - Schemas diferentes
  - Mapeo con pérdida
  - Intervención usuario ocasional

NO COMPARTEN ALGORITMO DE CONVERGENCIA.
COMPARTEN: data model + operation log.
```

### 5.2 La costura: operation log

Cada mutación de dominio es una `Operation`:

```typescript
Operation {
  opId: ULID,              // client-generated, hence idempotent retries
  entityRef: string,       // ej. "habits:abc123"
  kind: 'create' | 'update' | 'delete' | ...,
  payload: {...},
  actor: UserId | 'ai-suggested-user-confirmed',
  deviceClock: number,     // per-device logical clock
}
```

- **Replication** transporta Operation.
- **Vault projector** consume Operation como flujo de operaciones rastreado.
- **Connectors externos** consumen el mismo feed.
- **Audit trail** se deriva de ella.

**Event-sourcing en el borde solamente.** State se mantiene en tablas ordinarias.

### 5.3 Replicación: construida, no comprada

Kibo tiene tres propiedades que sacan lo difícil:
- **Un usuario por record** (no colaboración concurrente).
- **Un phone y una web** raramente tocan el mismo record en el mismo minuto.
- **Mayoría de operaciones aditivas** ("completé tarea", "escribí entrada"), no edición concurrente de texto largo.

Un motor general resuelve problema que Kibo casi no tiene.

**Net: cliente disposable.**
```
if (localDB corrupts) {
  discard();
  fullRefresh();
  // cero pérdida
}
```

**Esta regla es una prueba automatizada, no una intención.**

### 5.4 Offline se construye último, deliberadamente

Demanda el máximo juicio y falla peor sin él.

**Consecuencia práctica:** Primer Android release puede ser solo en línea. Sin conexión primero es el destino, no el punto de partida.

**Operaciones offline optimistas vs requieren red:**

| Optimista (offline OK) | Requieren red |
|---|---|
| Completar tareas/hábitos | Abrir cofres (randomness) |
| XP, level, streak, HP — el cliente corre funciones puras de `packages/core`, servidor recalcula y reconcilia | Store purchases (double-spend cross-device) |
| Escribir notas, entries, tareas, consultas — contenido, no economía | Retos compartidos, scoreboards, regalos |

**Regla:** Cliente calcula lo determinístico. Servidor decide cualquier cosa que implique azar, escasez u otra persona.

---

## 6. Bóveda Markdown: output del sistema

### 6.1 Reframing: Kibo emite, Obsidian lee

**La bóveda es OUTPUT del sistema, no un partner.** Un solo escritor lógico: el projector del servidor.

Consecuencias:
- Resources se edita en Kibo; la bóveda es su proyección.
- No hay dos editores.
- Kibo no reconstruye un graph ni un editor avanzado (Obsidian wins ahí).

**Asimetría explotada:** *Obsidian tiene estructura sin schema. Kibo tiene schema.*

Bridge: YAML frontmatter.
- Cada nota es un record.
- Keys de frontmatter son sus columnas.
- Wikilinks son sus foreign keys.
- Bases (core plugin) y Dataview son query engines.

### 6.2 Propiedad por procedencia, obligatoria por región

Write authority se asigna primero por **provenance** (origen), luego por **region** (qué parte). **Provenance es declarada por el usuario, nunca inferida.**

| Provenance | Qué es | Kibo escribe | Kibo lee | kibo-id |
|---|---|---|---|---|
| **`kibo`** | Record generado por Kibo | Región K solamente | sí | siempre |
| **`adopted`** | Nota propia del usuario, elevada a record Kibo | **Solo** keys de frontmatter declaradas en perfil. Nunca cuerpo, nunca ruta | sí | siempre |
| **`read`** | Nota del usuario indexada para Resources — búsqueda, backlinks, misiones, XP | nada, cero bytes | sí | nunca |
| **`foreign`** | Todo fuera del scope concedido | nada | nada | nunca |

**Regiones:**

| Región | Dueño | En regeneración |
|---|---|---|
| Keys de frontmatter declaradas (del `kibo-type`) | Kibo | reescritas via `processFrontMatter` |
| Keys de frontmatter no declaradas (el usuario agregó) | Usuario | **preservadas literalmente** — nunca borrar lo desconocido |
| Bloque `<!-- kibo:generated -->` | Kibo | replaced wholesale |
| Todo lo demás en el cuerpo | Usuario | **intacto** — no leído, no movido, no formateado |
| Bloque generado ausente (usuario lo borró) | Usuario ganó | no recreado. Registrado como `generated_block: removed` |

**Merge de tres vías es innecesario:** Kibo y usuario nunca escriben la misma región. Sin bases de merge persistidas, sin máquina de estados de conflicto, sin diff-match-patch en v1.

### 6.3 Contract Markdown

**Todas las notas Kibo usan:**
- `kibo-id` (ULID, inmutable, nunca la ruta)
- `kibo-type` (kebab-case, vocabulario cerrado)
- `kibo-rev`, `kibo-updated` (ISO 8601 con offset explícito)
- Stamp tag en namespace `kibo/` (ej. `tags: [kibo/medical-visit]`) — el usuario puede seleccionar todo lo que Kibo escribió en una query

**Reglas de convención, fijas para el contrato:**
- `kebab-case`, en inglés, singular excepto colecciones.
- `YYYY-MM-DD` para fechas, ISO 8601 con offset para instants.
- Booleans: literal `true`/`false`, nunca `yes`/`no` (YAML 1.1 coerce).
- Nulls: omit key, nunca `null` o empty string.
- Enums: `snake_case`, cerrado y documentado.
- Collections: siempre YAML list, incluso con un elemento.

**Relaciones emitidas dos veces:** Frontmatter (para que Bases/Dataview pueda hacer queries) + cuerpo (para que el graph dibuje la arista). El soporte de backlinks nativo desde frontmatter es limitado.

### 6.4 Transport

| Transport | Status |
|---|---|
| **Export de bóveda bajo demanda (`.zip`)** | **Piso v1 y ruta v1.** El formato es el producto; el transporte es un detalle actualizable. Bytes idénticos en toda ruta. **Valida el frontmatter del contrato antes de cualquier carpeta vinculada de usuario** |
| **Obsidian plugin** | Ruta continua. Solo escritorio. Tubo pasivo: sin parsear Markdown, sin interpretar frontmatter, sin computar reglas de juego, cero llamadas LLM, cero UI de producto. ~1000–1500 líneas. Versionado por **protocolo**, no por funcionalidades |
| **El servidor escribe a la nube del usuario (Drive/OneDrive) vía OAuth** | **ABIERTO — no construido en v1.** Convierte disclosure en transferencia a procesador de terceros desde infraestructura Kibo — la propiedad exacta que permite que la salud llegue a la bóveda. Reabrir requiere decisión de Sergio |
| **Espejo local SAF en Android** | Solo descarga, secundario. Las escrituras de SAF a proveedores cloud es frágil |
| **API de Acceso al Sistema de Archivos** | Solo import/export de una sola vez. Nunca sync continuo |

**El teléfono no escribe la bóveda.** Lo capturado en mobile llega a la carpeta via servidor y componente desktop, la próxima vez que el usuario abre su PC.

---

## 7. Decisiones arquitectónicas

Cada decisión es un trade-off. Las alternativas rechazadas y la consecuencia aceptada viven en el decision log. Aquí, el resumen:

| ID | Fecha | Decisión | Alternativas rechazadas | Consecuencia aceptada |
|---|---|---|---|---|
| **AD-01** | 2026-08-23 | Web y Android **ambos** en v1. Sin iOS | Web-only v1 · Android-only v1 | Las pantallas se escriben dos veces. Restricción de esfuerzo de binding del proyecto |
| **AD-02** | 2026-08-08 | Expo (RN) para Android; Next.js para web | Kotlin/Compose · Flutter · PWA-only | Mascota y ceremonia de cofre: validadas por spike, no por confianza a priori |
| **AD-03** | 2026-08-08 | `apps/api` es el único backend. Web y mobile = clientes iguales | web con Prisma directo + mobile API | Toda regla de dominio existe una vez. La web pierde acceso directo a datos del servidor |
| **AD-04** | 2026-08-08 | **TypeScript de principio a fin** | Kotlin · Python/Go backends | Backend elegido por reutilización de cliente, no por mérito |
| **AD-05** | 2026-08-23 | **Lista de packages descompuesta** (`api-contract`, `core`, `tokens`, `markdown`, `projection`, `sync-core`, `database`, `config`) | Lista más corta (pierde tokens y separa formato del motor) | Tokens es ahora crítico (tema oscuro, Expo). Contrato separado del cliente generado |
| **AD-06** | 2026-08-08 | Construir replicación con red de cliente descartable. PowerSync es fallback documentado | Comprar PowerSync ahora · construir sin red | Apuesta más riesgosa. Defensible solo mientras la regla de cliente descartable se cumple = prueba automatizada |
| **AD-07** | 2026-08-08 | **Better Auth, autoalojado** | Identidad externa · implementación manual | Los usuarios viven en nuestro Postgres. Aprendemos de Lucia, no entregamos la primera implementación |
| **AD-08** | 2026-08-08 | **Cualquier Postgres gestionado. Supabase no requerido** | Supabase como plataforma de datos | Sin bloqueo de proveedor. Cuatro proveedores para operar en lugar de uno |
| **AD-09** | 2026-08-08 | **REST + OpenAPI, versionado en path (`/v1/`)** | tRPC · GraphQL | Los móviles viven meses en versiones antiguas. No hay versionado en tRPC |
| **AD-10** | 2026-08-08 | **`pg-boss` para tareas en segundo plano** | BullMQ · sin cola | Sin Redis. Techo de rendimiento más bajo, irrelevante en esta escala |
| **AD-11** | 2026-08-08 | **Bóveda es output con un único escritor, proyector del servidor. Propiedad por procedencia, aplicada por región** | Obsidian-first estricto · Kibo-first estricto · bidireccional completo · fusión de tres vías | Recursos no es editor de cuerpo para notas del usuario una vez vinculada la bóveda. Debe ser un cambio de modo declarado |
| **AD-12** | 2026-08-08 | **`.zip` export es ruta de entrega v1. Componente desktop después** | Construir transporte continuo primero | Frontmatter del contrato —la parte que genera deuda en discos que no son nuestros— validado antes de cualquier carpeta vinculada |
| **AD-13** | 2026-08-23 | **shadcn completamente retirado** | Mantener shadcn para web · mantener Radix | Radix se va también, llevándose primitivas a11y. Cómo se resuelve a11y está abierto |
| **AD-14** | 2026-08-23 | **Sistema de diseño vive en `design-system/` en repo** | Mantener solo en herramienta de diseño · repo separado | Versionado con código, comparable con diff. Sincronización con herramienta de diseño es un paso explícito |
| **AD-15** | 2026-08-23 | **Tema oscuro INCLUIDO, como segunda tabla de valores para los mismos tokens** | Fuera de alcance · capa de componente oscuro separada | `packages/tokens` lleva dimensión de tema desde el día 1. 75 colores escritos a mano se vuelven bloqueadores |
| **AD-16** | 2026-08-23 | **Las dos monedas son Divisa (cotidiana) y Elemento (rara)** | Mantener «gemas» · «materia oscura» · «fragmentos» | El nombre es la unidad y la piel es solo la apariencia. Materia oscura, Magia, Esencia y Núcleo se vuelven pieles de un Elemento. El nombre de la categoría nunca compite con la piel |
| **AD-17** | 2026-08-23 | **Criterio de retiro: si no se usa en la versión v1, no sirve y no agrega nada** | Juicio estético caso a caso · no retirar nada hasta que exista biblioteca de componentes | El uso en alcance v1 es la única prueba. Los retiros se presentan agrupados por familia, nunca pieza por pieza |
| **AD-18** | 2026-08-23 | **La auditoría de tokens completa antes de tocar código** | Construcción y auditoría en paralelo | Carga al inicio semanas sin producto visible. Evita estandarizar vocabulario que está a punto de retirarse |
| **AD-19** | 2026-08-23 | **`docs/ARCHITECTURE.md` es la única superficie de decisiones** | ADRs por decisión · PRD como especificación de producto | El detalle se concentra donde los constructores miran |
| **AD-20** | 2026-08-23 | **KIBO presente en todo el producto, ambas plataformas. Identidad de marca, no decoración** | Adorno web-only · KIBO estático mobile · «KIBO light» v1 | Mascota animada pasa a la ruta crítica. El spike `KIBO-019` corre en la fase de fundaciones |
| **AD-21** | 2026-08-23 | **Tokens creados como TypeScript plano, almacenando INPUTS no outputs. Dos generadores: CSS web, objeto de estilo RN** | W3C DTCG JSON · valores literales por tema · dos conjuntos de plataforma paralelos | Los tokens fluidos resuelven un mínimo en mobile (que ES el valor correcto del teléfono). Prueba de snapshot para que las plataformas no se desvíen |
| **AD-22** | 2026-08-23 | **KIBO creado como máquina de estados en Rive, un asset para web y Android** | Mantener CSS/DOM + reescribir nativamente · Lottie · Skia/Reanimated manual | El problema combinatorio lo decide. 8 ánimos × 14 travesuras × pieles × accesorios × auras: la máquina de estados compone. Asset creado + dependencia de runtime (costo), no comparable con diff (costo) |
| **AD-23** | 2026-08-24 | **El ánimo de KIBO cambia solo la expresión. Color del cuerpo personalizable por el usuario, dimensión independiente** | Mantener ánimo acoplado al color | El ánimo cambia ojos/pupilas/boca/cejas, nada más. Una piel azul comprada permanece azul en cada ánimo |
| **AD-24** | 2026-08-24 | **Temas comprables: override escaso validado de tokens INPUT, resueltos a través de las mismas recetas** | Tabla de valores completa por tema · agrupamiento de temas en binario · envío de artwork a través del resolvedor de tokens | El paquete de tokens gana una tercera dimensión de resolución (nombre × modo × tema). Resolvedor oklab en tiempo de ejecución en el dispositivo. El contrato de tema es una superficie pública de solo-adición, versionada para siempre |
| **AD-25** | 2026-08-24 | **Elemento comprable con dinero real, seguro porque compra acceso a cosméticos/funcionalidades, nunca ventaja** | Elemento solo ganado · dinero real compra ventaja | «Raro» cambia a *escaso/premium*. Invariante de equidad sin cambios. Línea de ingresos de cosméticos independiente |
| **AD-26** | 2026-08-24 | **Modelo de producto de tema: vendido por superficie con conjuntos entre superficies, componiéndose, sin expiración** | Reskin de UI completa · solo piezas no agrupadas · FOMO/expiración · anulación de tema por recoloreado del usuario | Alcance de superficie del conjunto de claves de token. Los temas se componen. AA nunca está a la venta |
| **AD-27** | 2026-09-04 | **Spike Rive de KIBO GO CON CONDICIONES: un `.riv` entrega comportamiento completo web y Android. Ánimo vía máquina de estados; piel vía vinculación de datos — dos canales de runtime** | Entrada de máquina de estados de color · intercambio de imagen de piel en tiempo de ejecución · Lottie · Skia/Reanimated | Pieles activas dentro del asset. Deformación de arrastrado interactivo validado en editor + dispositivo físico. Tiempo de ejecución RN fijado, errores de sincronización presupuestados. Se necesita especialista RN/Expo (brecha del roster) |
| **AD-28** | 2026-09-05 | **Rive confirmado después de re-evaluación. Condición 4: rol de creación ocupado.** Sin ruta de IA→`.riv` madura. El rig interactivo (máquina de estados, malla/huesos, vinculación de datos) se hace rigging en el editor Rive a mano | Reanimated + SVG · Rive-web + híbrido nativo RN · Lottie | La tubería de animación no es IA de principio a fin. La riqueza de KIBO depende de ocupar la plaza del editor Rive. Fallback si se abandona el rol: Reanimated + SVG con límite ánimo≠color tipado |

---

`*` Pendiente: implementación de principio a fin. Código, pruebas, y verificación en máquina de que la topología de figura 1.2 opera como se describe.
