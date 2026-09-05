# Kibo — Documentación Técnica

Dónde vive cada archivo, qué hace, y qué se puede tocar sin romperlo.

**Para quién es:** Quien mantenga el código después del lanzamiento.
**Versión:** 1.0-alpha

## Registro de modificaciones

| Versión | Fecha | Editó | Qué cambió | Por qué |
|---|---|---|---|---|
| 1.0-alpha | 2026-09-05 | technical-writer | Primer documento de documentación técnica | Migración de ARCHITECTURE.md v1.7 a documentación de cinco piezas (Art. 5) |

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
         │    Cache, nunca source of truth           │
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
| **API** | REST + OpenAPI, versionado en ruta (`/v1/`) | Móviles viven meses en versiones viejas. Types generadas del schema sin perder versionado |
| **Background jobs** | `pg-boss` en Postgres | No Redis. Enseña queues, retries, idempotency. `LISTEN/NOTIFY` es el mecanismo |
| **Web** | Next.js + React | Client de `apps/api`, no toca Prisma. BFF pattern para server-render |
| **Mobile** | Expo (React Native) | SAF URIs para `StorageAccessFramework`. Costo: screens se escriben dos veces |
| **Local cache** (mobile) | `expo-sqlite` + Drizzle | Cache + intent outbox. WatermelonDB es alternativa |
| **Sync** | Construido (no comprado) | Disposable-client rule: si SQLite se corrompe, refrescar del servidor. Cero pérdida |
| **Tokens/design** | TypeScript inputs → CSS outputs | Tokens son datos: `{mix: '--kb-coin', amount: 0.42, space: 'oklab'}`. Dos generadores: CSS web, style object RN |
| **Mascota** | Rive (state machine) | Un asset `.riv` en web y Android. Inputs: `hp` (number), travesura/gesture (triggers), `toyEquipped`/`reducedMotion` (bool). Data binding: `skinTint`, `skinType`, `accessory` |

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

**Eliminado:** `packages/ui` (prometía sharing React DOM ↔ React Native; falsa promesa). Vuelve después como `@kibo/ui` (web-only, sin shadcn, sobre tokens).

**Eliminado:** Cinco archivos junk en root (`Clean`, `Launching`, `Old`, `Spawning`, `Waiting` — output de `start-kibo.bat`).

---

## 3. Backend: API y dominio

### 3.1 `apps/api` — estructura esperada

```
src/
  main.ts                    Global prefix, URI versioning, ValidationPipe, CORS allowlist, body limit, RFC 9457 errors
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
- Completar `main.ts` (global prefix, URI versioning, ValidationPipe, CORS allowlist, body limit, RFC 9457 error filter).
- Tres esquemas de credencial diseñados juntos: browser session, mobile token (OAuth 2.0 + PKCE, rotating refresh, `expo-secure-store`), vault-connector token.
- Idempotency en economía del servidor: una misma operación nunca dobla el reward.
- Encriptación column-level y boundary de credencial por Postgres role para datos especiales (salud, finanzas).
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

### 4.1 Feature parity, screen diversity

**Ambos entregan en v1. Parity es la funcionalidad, no el screen.**

- Una funcionalidad existe en web y mobile, expresada en idioma nativo: timeline ancha en web es list en phone; quick capture en phone es form en web.
- **Un módulo completo en un cliente antes de portarlo.** Nunca dos clientes a 50%.

### 4.2 Web: `apps/web` (Next.js)

**Cliente de `apps/api`, exactamente como el teléfono. Nunca toca Prisma.**

- Server-side rendering es permitido: llamar a `/api/v1/*` desde el servidor. No tocar Prisma.
- Una excepción mientras existe: session adapter (infraestructura de sesión, no dominio).
- BFF pattern: el servidor Next.js puede enrichir antes de devolver al cliente.

**No hardcodea ambiente:** Database, schema, warehouse, hostname, endpoint — todo viene de config. Ver Art. 16.

### 4.3 Mobile: `apps/mobile` (Expo/React Native)

**Cliente de `apps/api`. Expo por SAF URIs (StorageAccessFramework) para escribir bóveda.**

**Metro + pnpm:** Metro históricamente no seguía symlinks. Opciones:
1. `node-linker=hoisted` en `.npmrc` — menos sorpresas, pierde garantía pnpm.
2. `metro.config.js` explícito con `watchFolders` y `nodeModulesPaths`.

Verificar contra versión Expo pinned antes de fijar config.

### 4.4 Cache local (ambos)

**El cliente es descartable.** Local state es cache, nunca source of truth.

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
- **Vault projector** consume Operation como feed cursado.
- **Connectors externos** consumen el mismo feed.
- **Audit trail** se deriva de ella.

**Event-sourcing en el borde solamente.** State se mantiene en tablas ordinarias.

### 5.3 Replication: built, not bought

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

**Consecuencia práctica:** Primer Android release puede ser online-only. Offline-first es el destino, no el starting point.

**Operaciones offline optimistas vs requieren red:**

| Optimista (offline OK) | Requieren red |
|---|---|
| Completar tareas/hábitos | Abrir cofres (randomness) |
| XP, level, streak, HP — el cliente corre funciones puras de `packages/core`, servidor recalcula y reconcilia | Store purchases (double-spend cross-device) |
| Escribir notas, entries, tareas, consultas — contenido, no economía | Retos compartidos, scoreboards, regalos |

**Regla:** Client calcula lo determinístico. Servidor decide anything involving chance, scarcity, o otra persona.

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

### 6.2 Ownership por provenance, enforced per region

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

**Merge de tres vías es innecesario:** Kibo y usuario nunca escriben la misma región. Sin bases de merge persistidas, sin state machine de conflicto, sin diff-match-patch en v1.

### 6.3 Contract Markdown

**Todas las notas Kibo usan:**
- `kibo-id` (ULID, inmutable, nunca la ruta)
- `kibo-type` (kebab-case, vocabulario cerrado)
- `kibo-rev`, `kibo-updated` (ISO 8601 con offset explícito)
- Stamp tag en namespace `kibo/` (ej. `tags: [kibo/medical-visit]`) — el usuario puede seleccionar todo lo que Kibo escribió en una query

**Convention rules, fijas para el contract:**
- kebab-case, English, singular excepto colecciones.
- `YYYY-MM-DD` para fechas, ISO 8601 con offset para instants.
- Booleans: literal `true`/`false`, nunca `yes`/`no` (YAML 1.1 coerce).
- Nulls: omit key, nunca `null` o empty string.
- Enums: `snake_case`, cerrado y documentado.
- Collections: siempre YAML list, incluso con un elemento.

**Relations emitidas dos veces:** Frontmatter (so Bases/Dataview query) + body (so graph dibuja la edge). Native backlink support from frontmatter es limitado.

### 6.4 Transport

| Transport | Status |
|---|---|
| **On-demand vault export (`.zip`)** | **v1 floor y ruta v1.** Format es el producto; transport es detail actualizabley. Bytes idénticos en toda ruta. **Valida contract frontmatter antes de cualquier usuario linked folder** |
| **Obsidian plugin** | Continuous route. Desktop-only. Dumb pipe: no parse Markdown, no interprete frontmatter, no compute game rules, cero LLM calls, cero product UI. ~1000–1500 LOC. Versionado por **protocol**, no features |
| **Server writes to user's cloud (Drive/OneDrive) via OAuth** | **OPEN — no built en v1.** Convierte disclosure en transfer a third-party processor desde infraestructura Kibo — la propiedad exacta que permite health a vault. Reabrir requiere decisión de Sergio |
| **Android SAF local mirror** | Download-only, secundario. SAF writes a cloud providers es frágil |
| **File System Access API** | One-shot import/export solamente. Nunca sync continuo |

**El teléfono no escribe la bóveda.** Lo capturado en mobile llega a la carpeta via servidor y componente desktop, la próxima vez que el usuario abre su PC.

---

## 7. Decisiones arquitectónicas

Cada decisión es un trade-off. Las alternativas rechazadas y la consecuencia aceptada viven en el decision log. Aquí, el resumen:

| ID | Fecha | Decisión | Alternativas rechazadas | Consecuencia aceptada |
|---|---|---|---|---|
| **AD-01** | 2026-08-23 | Web y Android **ambos** en v1. Sin iOS | Web-only v1 · Android-only v1 | Screens se escriben dos veces. Binding effort constraint del proyecto |
| **AD-02** | 2026-08-08 | Expo (RN) para Android; Next.js para web | Kotlin/Compose · Flutter · PWA-only | Mascota y ceremonia de cofre: spike, no fe |
| **AD-03** | 2026-08-08 | `apps/api` es el único backend. Web y mobile = clientes iguales | web con Prisma directo + mobile API | Toda regla de dominio existe una vez. web pierde acceso server-side data |
| **AD-04** | 2026-08-08 | **TypeScript end-to-end** | Kotlin · Python/Go backends | Backend decidido por client reuse, no by merit |
| **AD-05** | 2026-08-23 | **Package list decomposed** (`api-contract`, `core`, `tokens`, `markdown`, `projection`, `sync-core`, `database`, `config`) | Shorter list (perde tokens y separa format de engine) | Tokens es now load-bearing (dark theme, Expo). Contract separado de generated client |
| **AD-06** | 2026-08-08 | Build replication con disposable-client net. PowerSync es fallback documentado | Buy PowerSync now · build sin net | Riskiest bet. Defensible solo mientras disposable-client rule holds = automated test |
| **AD-07** | 2026-08-08 | **Better Auth, self-hosted** | External identity · hand-rolled | Users viven en nuestro Postgres. Learning from Lucia, no shipping first impl |
| **AD-08** | 2026-08-08 | **Cualquier Postgres managed. No Supabase requerido** | Supabase as data platform | Sin vendor lock-in. Cuatro vendors a operar instead de uno |
| **AD-09** | 2026-08-08 | **REST + OpenAPI, versionado en path (`/v1/`)** | tRPC · GraphQL | Móviles viven meses en versiones viejas. No hay versioning en tRPC |
| **AD-10** | 2026-08-08 | **`pg-boss` para background jobs** | BullMQ · no queue | Sin Redis. Throughput ceiling más baja, irrelevante en esta escala |
| **AD-11** | 2026-08-08 | **Vault es output con un escritor, projector del servidor. Ownership by provenance, enforced per region** | Strict Obsidian-first · strict Kibo-first · full bidirectional · merge de tres vías | Resources no es editor body para notas libres del usuario una vez linked vault. Must be declared mode change |
| **AD-12** | 2026-08-08 | **`.zip` export es v1 delivery route. Desktop component después** | Build continuous transport primero | Contract frontmatter — la parte que genera debt en disks no nuestros — validada before any linked folder |
| **AD-13** | 2026-08-23 | **shadcn completamente retired** | Keep shadcn for web · keep Radix | Radix va también, taking a11y primitives. How a11y solved es open |
| **AD-14** | 2026-08-23 | **Design system vive en `design-system/` en repo** | Keep only en design tool · separate repo | Versionado con código, diffable. Sync con design tool es explicit step |
| **AD-15** | 2026-08-23 | **Dark theme IN, como segunda tabla de values para los mismos tokens** | Out of scope · separate dark component layer | `packages/tokens` carries theme dimension from day 1. 75 colores hand-written become blocking |
| **AD-20** | 2026-08-23 | **KIBO present throughout product, both platforms. Brand identity, not decoration** | Web-only flourish · static KIBO mobile · "light KIBO" v1 | Mascota animado moves to critical path. `KIBO-019` spike runs in foundations phase |
| **AD-21** | 2026-08-23 | **Tokens authored as plain TypeScript, storing INPUTS not outputs. Two generators: CSS web, style object RN** | W3C DTCG JSON · literal values per theme · two parallel platform sets | Fluid tokens resolve a minimum on mobile (which IS correct phone value). Snapshot test so platforms don't drift |
| **AD-22** | 2026-08-23 | **KIBO authored as state machine en Rive, one asset web & Android** | Keep CSS/DOM + rewrite natively · Lottie · Skia/Reanimated by hand | Combinatorial problem decides it. 8 moods × 14 travesuras × skins × accessories × auras: state machine composes. Authored asset + runtime dependency (cost), not diffable (cost) |
| **AD-23** | 2026-08-24 | **KIBO mood cambia solo expression. Body colour user-customizable, independent dimension** | Keep mood coupled to colour | Mood faces eyes/pupils/mouth/brow, nothing else. Purchased blue skin stays blue through every mood |
| **AD-24** | 2026-08-24 | **Purchasable themes: validated sparse override of INPUT tokens, resolved through same recipes** | Full value table per theme · bundling themes in binary · pushing artwork through token resolver | Token package gains third resolution dimension (name × mode × theme). Runtime oklab resolver on-device. Theme contract is add-only public surface, forever-versioned |
| **AD-25** | 2026-08-24 | **Elemento purchasable con real money, safe because buys cosmetic/feature access, never advantage** | Elemento earned-only · real-money buys advantage | "Rare" shifts to *scarce/premium*. Fairness invariant unchanged. Cosmetic revenue independent line |
| **AD-26** | 2026-08-24 | **Theme product model: sold per surface con cross-surface sets, composing, no expiry** | Whole-UI reskin · unbundled pieces only · FOMO/expiry · theme overrides user recolour | Surface-scoping del token key-set. Themes compose. AA never for sale |
| **AD-27** | 2026-09-04 | **KIBO Rive spike GO WITH CONDITIONS: one `.riv` delivers full behaviour web & Android. Mood via state machine; skin via data binding — two runtime channels** | Colour state-machine input · runtime image-swap skins · Lottie · Skia/Reanimated | Live skins dentro del asset. Interactive drag-deform validated en editor + physical device. RN runtime pinned, timing bugs budgeted. RN/Expo specialist needed (roster gap) |
| **AD-28** | 2026-09-05 | **Rive confirmed después re-evaluation. Condition 4: authoring role staffed.** No AI→`.riv` path maduro. Interactive rig (state machine, mesh/bones, data binding) se rigging en Rive editor by hand | Reanimated + SVG · Rive-web + code-native RN hybrid · Lottie | Animation pipeline no AI-end-to-end. KIBO richness depende en occupying Rive-editor seat. Fallback si role drops: Reanimated + SVG con mood≠colour boundary typed |

---

`*` Pendiente: implementación end-to-end. Código, tests, y verificación en máquina que la topología de figura 1.2 opera como descrito.
