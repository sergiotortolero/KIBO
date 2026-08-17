# 03 · Aterrizaje de la integración Obsidian en el monorepo

**Fecha:** 2026-08-08 · **Autor:** web-architect · **Insumo:** `docs/analysis/obsidian/00-brief.md`, `docs/product/PRD-kibo.md` (v1.0)
**Pregunta que responde:** *si mañana decidimos hacer esto, ¿qué se toca exactamente y en qué orden?*

**Fuera de alcance de este documento (por instrucción):** elección de la dirección de la verdad, algoritmo teórico de sync, IA, análisis de mercado y seguridad a fondo. Todo lo que propongo aquí está diseñado para **soportar tanto Kibo-first como bidireccional**; en cada sección marco con ⚖️ el punto exacto donde cambiaría según la decisión.

---

## 0 · Estado verificado del repo (2026-08-08)

Todo lo de esta sección lo abrí y lo leí. Es la línea base sobre la que estimo.

### 0.1 Lo que existe

| Ruta | Qué es realmente |
|---|---|
| `package.json` (raíz) | Workspace pnpm 10.25 + Turbo. Scripts: `build`, `dev`, `lint`, `format`. Sin `test`, sin `typecheck`, sin `db:*`. |
| `pnpm-workspace.yaml` | `apps/*` y `packages/*`. Cualquier paquete nuevo se recoge solo — no hay que tocarlo. |
| `turbo.json` | Tareas `build`, `lint`, `dev`. `globalEnv` solo con variables de Auth.js y `NEXT_PUBLIC_API_URL`. **No existe tarea de `prisma generate`.** |
| `docker-compose.yml` | Un único servicio: `postgres:16-alpine`. No hay Redis, ni API, ni web containerizados. |
| `packages/database` | `schema.prisma` + `seed.ts` + `index.ts` (singleton de PrismaClient). **No hay carpeta `migrations/`** → el flujo actual es `prisma db push`. |
| `packages/ui` | Solo `package.json` + `README.md`. El `package.json` declara `"main": "./index.tsx"` y **ese archivo no existe**. El paquete está roto: cualquier `import` desde `@kibo/ui` falla hoy. |
| `packages/config` | Solo un `package.json` de 79 bytes. Vacío. |
| `apps/api` | Scaffold de NestJS 11 sin tocar. `AppModule` = `PrismaModule` + `UsersModule`. `main.ts` hace `app.enableCors()` sin allowlist, no registra `ValidationPipe`, no tiene prefijo global ni versionado, no tiene `@nestjs/config`. |
| `apps/web` | Next 16 + React 19 + Auth.js v5 + Tailwind v4 + shadcn (`style: new-york`, `baseColor: neutral`). Rutas: `(marketing)`, `(auth)` login/register/forgot-password, `(onboarding)`, `(app)/dashboard`. |
| `apps/web/src/components/ui` | Seis primitivas shadcn: `button`, `card`, `input`, `label`, `select`, `textarea`. Nada más. |

### 0.2 Hallazgos que condicionan el diseño (no cosméticos)

1. **`apps/api` está huérfano — cero consumidores.** `apps/web` habla con Postgres **directo vía Prisma** (`apps/web/src/auth.ts` y `apps/web/src/app/api/auth/register/route.ts` importan `prisma` de `@kibo/database`). `NEXT_PUBLIC_API_URL` solo aparece declarada en `apps/web/next.config.ts:5`; **ningún `fetch` del código apunta al NestJS**. Es decir: hoy hay dos rutas de acceso a datos y solo una se usa.

2. **El único controlador de `apps/api` está roto.** En `apps/api/src/users/users.controller.ts`:
   ```ts
   findOne(@Param('id') id: string) {
     return this.usersService.findOne(+id);
   }
   ```
   `+id` convierte el parámetro a número, pero `User.id` es `String @default(uuid())` (`packages/database/prisma/schema.prisma:31`). Cualquier llamada real devuelve `NaN`. Es el stub del generador de Nest sin revisar — señal de que `apps/api` nunca se ejecutó contra datos.

3. **`prisma generate` no está en el grafo de Turbo.** `turbo.json` no tiene tarea `db:generate` ni `build` de `@kibo/database`. En un clon frío, `turbo build` puede construir `apps/web` antes de que exista el cliente de Prisma. Funciona hoy porque el cliente está en `node_modules` local.

4. **No hay migraciones ni CI.** No existe `packages/database/prisma/migrations/` ni `.github/`. Una feature de sincronización es exactamente el tipo de cosa que no tolera *schema drift*: los clientes guardan cursores que apuntan a estado del servidor.

5. **Basura en la raíz.** Los archivos `Clean`, `Launching`, `Old`, `Spawning`, `Waiting` son salidas de `echo` mal redirigidas por `start-kibo.bat` (contienen fragmentos como `separate window for Frontend...`). Inofensivos pero deben borrarse antes de abrir el repo a otro desarrollador.

6. **El modelo de Áreas ya existe con otro nombre.** `Attribute` / `UserAttribute` (con `level`, `currentXp`, `isActive`, PK compuesta) **es** el modelo de las 5 Áreas del PRD §3.6, y el seed ya crea Vigor/Wisdom/Wealth/… Eso significa que *"XP a Sabiduría por escribir"* tiene destino en la base. Lo que **no** existe es el libro mayor de XP ni el motor de rachas (ver §1.6).

> **Conclusión de la línea base:** el esquema tiene 6 modelos, todos de identidad y atributos. **Cero entidades de contenido.** Todo lo que sigue es greenfield.

---

## 1 · Modelo de datos

### 1.1 Principios que guían el esquema

1. **Separar la nota canónica de su materialización en disco.** `Note` es el registro de Kibo; `NoteFile` es "esta nota, en esta bóveda, en esta ruta, con este hash". Un usuario sin bóveda tiene `Note` sin `NoteFile`. Esto es lo que hace el esquema **agnóstico a la dirección**: si mañana es Kibo-first, `NoteFile` es un espejo de salida; si es bidireccional, es un estado de reconciliación. No cambia una sola columna.
2. **Reloj lógico, no reloj de pared.** El control de concurrencia usa un contador `rev` por nota y un `seq` global en un diario append-only. Nunca `updatedAt` — los relojes del cliente mienten y dos escrituras en el mismo milisegundo son indistinguibles.
3. **Nada se borra de verdad.** Tombstones (`deletedAt`) con ventana de retención. El contenido perdedor de un conflicto se persiste, no se descarta.
4. **Los contadores del "pulso" van desnormalizados.** Calcular huérfanas en tiempo de lectura es un self-join sobre enlaces por nota; el panel de Recursos se abre en cada visita. Se desnormaliza y se recalcula en segundo plano (§4).
5. **Idempotencia en todo lo que otorga economía.** Un reintento de sync no puede pagar XP dos veces.

### 1.2 Enums y delta sobre `User`

```prisma
// packages/database/prisma/schema.prisma  — append

enum NoteOrigin {
  KIBO          // created in the web app
  VAULT         // ingested from a linked vault
  IMPORT        // one-shot import (zip / folder upload)
  SYSTEM        // generated by Kibo (e.g. weekly review note)
}

enum NoteLinkKind {
  WIKILINK      // [[target]]
  EMBED         // ![[target]]
  MARKDOWN      // [text](target.md)
}

enum VaultClientKind {
  OBSIDIAN_PLUGIN
  LOCAL_AGENT
  BROWSER_FS_ACCESS
  IMPORT_ONLY
}

enum VaultSyncMode {
  KIBO_TO_VAULT     // Kibo is the source of truth, vault is a mirror
  VAULT_TO_KIBO     // vault is the source of truth, Kibo indexes it
  BIDIRECTIONAL
}

enum VaultLinkStatus {
  PENDING_PAIR
  ACTIVE
  PAUSED
  ERROR
  REVOKED
}

enum ConflictPolicy {
  MANUAL            // ask the user (default; safest)
  LAST_WRITE_WINS
  KIBO_WINS
  VAULT_WINS
}

enum NoteFileState {
  SYNCED
  PENDING_PUSH      // Kibo has a newer rev not yet materialized on disk
  PENDING_PULL      // the client reported a local change not yet ingested
  CONFLICT
  QUARANTINED       // unparseable / too large / illegal path
  DELETED_LOCAL
  DELETED_REMOTE
}

enum SyncOp {
  CREATE
  UPDATE
  DELETE
  RENAME
  RESTORE
  MERGE
}

enum SyncOrigin {
  KIBO_WEB
  VAULT_CLIENT
  IMPORT
  SYSTEM
}

enum ConflictResolution {
  KEEP_KIBO
  KEEP_VAULT
  KEEP_BOTH
  MERGED
}

enum SyncRunStatus {
  RUNNING
  SUCCEEDED
  PARTIAL
  FAILED
}
```

Delta sobre el modelo `User` existente (solo se **añaden** líneas; no se toca nada de lo que ya está):

```prisma
model User {
  // ... campos existentes sin cambios ...

  // Settings needed by the sync + streak machinery (PRD §3.14: idioma, inicio de semana, fin de día)
  timezone          String  @default("America/Mexico_City")
  dayEndsAtMinutes  Int     @default(0) @map("day_ends_at_minutes") // minutes past local midnight

  // New relations
  notes             Note[]
  noteLinks         NoteLink[]
  tags              Tag[]
  vaultLinks        VaultLink[]
  vaultDevices      VaultDevice[]
  syncJournal       SyncJournalEntry[]
  writingActivity   WritingActivity[]
  xpGrants          XpGrant[]

  @@map("users")
}
```

> `timezone` y `dayEndsAtMinutes` **no existen hoy** y son bloqueantes para el cierre de racha (§4.3). Es una de las cosas más fáciles de olvidar y de las más caras de retrofitear.

### 1.3 Núcleo de notas: `Note`, `NoteLink`, `Tag`

```prisma
model Note {
  id            String     @id @default(uuid())
  userId        String     @map("user_id")

  // Identity & addressing
  title         String
  titleKey      String     @map("title_key")   // NFC + casefold of the basename; wikilink resolution key
  folder        String     @default("") // logical folder path inside Kibo, POSIX, no leading slash

  // Content
  content       String     @db.Text
  contentHash   String     @map("content_hash")  // sha256 hex of the canonical serialization (see packages/sync-core)
  frontmatter   Json?      // parsed cache of the note's own YAML frontmatter — NEVER Kibo metadata
  wordCount     Int        @default(0) @map("word_count")

  // Concurrency & lifecycle
  rev           Int        @default(1)          // monotonic per note; the ETag payload
  origin        NoteOrigin @default(KIBO)
  isFavorite    Boolean    @default(false) @map("is_favorite")
  deletedAt     DateTime?  @map("deleted_at")   // tombstone

  // Denormalized graph counters (recomputed by note.reindex — see §4)
  outLinkCount   Int       @default(0) @map("out_link_count")
  backLinkCount  Int       @default(0) @map("back_link_count")
  isOrphan       Boolean   @default(true) @map("is_orphan")

  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")

  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  outLinks      NoteLink[] @relation("NoteOutLinks")
  inLinks       NoteLink[] @relation("NoteInLinks")
  tags          NoteTag[]
  files         NoteFile[]
  conflicts     SyncConflict[]
  journal       SyncJournalEntry[]

  @@index([userId, updatedAt(sort: Desc)])
  @@index([userId, titleKey])
  @@index([userId, folder])
  @@index([userId, deletedAt])
  @@index([userId, contentHash])
  @@map("notes")
}
```

**Justificación de claves e índices:**

- `@@index([userId, updatedAt desc])` — la consulta por defecto de la pantalla Recursos ("mis notas, más recientes primero"). Índice compuesto porque el filtro por usuario es obligatorio en el 100% de las consultas.
- `@@index([userId, titleKey])` — **no unique, a propósito.** Obsidian permite dos archivos con el mismo basename en carpetas distintas y resuelve `[[X]]` con una regla de proximidad. Si ponemos `@@unique([userId, titleKey])` rompemos la fidelidad con la bóveda en la primera importación. La ambigüedad se resuelve en código con una regla documentada (misma carpeta → ruta más corta → creada primero) y se muestra un aviso en la UI, igual que hace Obsidian.
- `@@index([userId, contentHash])` — sirve para la **detección de renombrados por heurística** (§1.7) y para la deduplicación en importaciones.
- `titleKey` normalizado (NFC + casefold) porque macOS entrega nombres en NFD y Windows es case-insensitive: `Café.md` y `café.md` son el mismo archivo en disco pero dos strings distintos en Postgres. Esto ha roto sincronizadores serios; no es un detalle.
- `frontmatter Json?` guarda **el frontmatter del usuario**, nunca metadata de Kibo. Es un caché para poder filtrar por propiedades sin re-parsear.

Índices que Prisma no sabe expresar (van en SQL crudo dentro de la migración):

```sql
-- packages/database/prisma/migrations/<ts>_notes/migration.sql  (fragmento)

-- Listado de Recursos: el 100% de las lecturas excluyen tombstones.
CREATE INDEX notes_user_active_updated_idx
  ON notes (user_id, updated_at DESC)
  WHERE deleted_at IS NULL;

-- Misiones de enlace (PRD §3.12): huérfanas activas por usuario.
CREATE INDEX notes_user_orphan_idx
  ON notes (user_id)
  WHERE deleted_at IS NULL AND is_orphan = TRUE;

-- Búsqueda de texto completo. 'simple' y NO 'spanish': el usuario típico de Kibo
-- mezcla ES/EN en la misma bóveda y el stemmer español destroza los términos en inglés.
ALTER TABLE notes ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'B')
  ) STORED;
CREATE INDEX notes_search_vector_idx ON notes USING GIN (search_vector);

-- Búsqueda difusa por título (command palette estilo Obsidian: "quick switcher").
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX notes_title_trgm_idx ON notes USING GIN (title gin_trgm_ops);
```

En `schema.prisma` la columna generada se declara para que Prisma no intente borrarla:

```prisma
model Note {
  // ...
  searchVector  Unsupported("tsvector")? @map("search_vector")
}
```

```prisma
model NoteLink {
  id            String       @id @default(uuid())
  userId        String       @map("user_id")   // denormalized: enables the rebind query without a join

  sourceNoteId  String       @map("source_note_id")
  targetNoteId  String?      @map("target_note_id")  // NULL = unresolved link (a "phantom" note)

  targetKey     String       @map("target_key")      // normalized target basename
  targetRaw     String       @map("target_raw")      // literal text inside [[ ]] — keeps alias/anchor
  anchor        String?                              // #heading or ^block-ref
  alias         String?                              // [[target|alias]]
  kind          NoteLinkKind @default(WIKILINK)
  occurrences   Int          @default(1)

  createdAt     DateTime     @default(now()) @map("created_at")

  user          User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  source        Note  @relation("NoteOutLinks", fields: [sourceNoteId], references: [id], onDelete: Cascade)
  target        Note? @relation("NoteInLinks",  fields: [targetNoteId], references: [id], onDelete: SetNull)

  @@unique([sourceNoteId, targetKey, anchor, kind])
  @@index([targetNoteId])
  @@index([userId, targetKey])
  @@map("note_links")
}
```

**Por qué así:**

- `targetNoteId` **nullable** es obligatorio. En Obsidian escribir `[[Idea futura]]` antes de que exista el archivo es el flujo normal, y el grafo muestra ese nodo fantasma. Si la FK fuera obligatoria, la ingesta de una bóveda real fallaría en la primera nota.
- `@@unique([sourceNoteId, targetKey, anchor, kind])` + `occurrences` convierte el reindexado en un **upsert determinista**: parseo la nota, hago upsert de N enlaces, borro los de esa nota que no vinieron en el lote. Sin la unique, el reindexado duplica filas en cada pasada.
- `@@index([targetNoteId])` es *el* índice de backlinks. Es la consulta más caliente de la pantalla de nota.
- `@@index([userId, targetKey])` es el índice de **rebind**: cuando se crea la nota "Idea futura", hay que buscar todos los enlaces sin resolver de ese usuario cuyo `targetKey` coincide y apuntarlos. Sin este índice, crear una nota escanea toda la tabla de enlaces.
- `onDelete: SetNull` en `target`: borrar la nota destino no debe borrar el enlace — debe volverlo fantasma, que es el comportamiento correcto y el que alimenta las "misiones de enlace".

```prisma
model Tag {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  name      String                       // as typed by the user: "proyectos/kibo"
  nameKey   String    @map("name_key")   // NFC + casefold
  color     String?
  createdAt DateTime  @default(now()) @map("created_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes     NoteTag[]

  @@unique([userId, nameKey])
  @@map("tags")
}

model NoteTag {
  noteId String @map("note_id")
  tagId  String @map("tag_id")

  note   Note   @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId],  references: [id], onDelete: Cascade)

  @@id([noteId, tagId])
  @@index([tagId])
  @@map("note_tags")
}
```

> **Alternativa más barata considerada y descartada:** `tags String[]` en `Note` con índice GIN. Es menos código y consultas más simples. La descarto porque (a) el usuario va a querer renombrar un tag y propagarlo, (b) el PRD pide colores/afinidad visual en chips, y (c) a futuro los tags son el gancho natural para mapear escritura → Área (`#salud` → Vigor). Si se quiere ir rapidísimo en un MVP, el array es aceptable y la migración a tabla es mecánica.

### 1.4 Vinculación de bóveda: `VaultLink`, `VaultDevice`, `VaultPairingCode`

```prisma
model VaultLink {
  id             String          @id @default(uuid())
  userId         String          @map("user_id")

  name           String                                   // user-facing label: "Bóveda personal"
  vaultIdHint    String?         @map("vault_id_hint")    // opaque id reported by the client; display/diagnostics only
  clientKind     VaultClientKind @default(OBSIDIAN_PLUGIN) @map("client_kind")
  syncMode       VaultSyncMode   @default(KIBO_TO_VAULT)   @map("sync_mode")   // ⚖️ direction lives HERE
  conflictPolicy ConflictPolicy  @default(MANUAL)          @map("conflict_policy")

  status         VaultLinkStatus @default(PENDING_PAIR)
  statusReason   String?         @map("status_reason")     // machine code: "token_expired", "quota_exceeded", ...

  scopeFolders   String[]        @default([]) @map("scope_folders") // [] = whole vault
  ignoreGlobs    String[]        @default([]) @map("ignore_globs")  // e.g. [".obsidian/**", "**/*.excalidraw.md"]

  // Rename/identity strategy — the "clean files" trade-off (see §1.7)
  useFrontmatterId Boolean       @default(false) @map("use_frontmatter_id")
  frontmatterIdKey String        @default("kibo-id") @map("frontmatter_id_key")

  lastSyncAt     DateTime?       @map("last_sync_at")
  linkedAt       DateTime?       @map("linked_at")
  revokedAt      DateTime?       @map("revoked_at")
  createdAt      DateTime        @default(now()) @map("created_at")
  updatedAt      DateTime        @updatedAt @map("updated_at")

  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  devices        VaultDevice[]
  files          NoteFile[]
  cursors        SyncCursor[]
  conflicts      SyncConflict[]
  runs           SyncRun[]
  pairingCodes   VaultPairingCode[]

  @@unique([userId, name])
  @@index([userId, status])
  @@map("vault_links")
}
```

⚖️ **`syncMode` es la única columna que la decisión de dirección toca.** El resto del esquema es idéntico en los tres escenarios. Si se decide Kibo-first, `NoteFile.state` nunca toma el valor `PENDING_PULL` y `SyncConflict` queda casi vacía — pero las tablas existen y no hay migración pendiente el día que se cambie de opinión.

```prisma
model VaultDevice {
  id            String    @id @default(uuid())
  vaultLinkId   String    @map("vault_link_id")
  userId        String    @map("user_id")     // denormalized: auth lookup resolves in one hop

  name          String                        // "MacBook Pro — Obsidian 1.6.7"
  clientVersion String    @map("client_version")
  platform      String                        // "darwin-arm64", "win32-x64", ...

  // SECURITY: only the hash is stored. The raw token is returned exactly once, at pairing.
  tokenHash     String    @unique @map("token_hash")   // sha256(pepper || token)
  tokenPrefix   String    @map("token_prefix")         // "kbo_dev_a1b2" — for the UI device list
  scopes        String[]  @default([])                 // notes:read, notes:write, vault:status, gamification:read

  expiresAt     DateTime? @map("expires_at")
  lastUsedAt    DateTime? @map("last_used_at")
  revokedAt     DateTime? @map("revoked_at")
  revokedReason String?   @map("revoked_reason")

  rotatedFromId String?   @unique @map("rotated_from_id")
  rotatedFrom   VaultDevice?  @relation("TokenRotation", fields: [rotatedFromId], references: [id], onDelete: SetNull)
  rotatedTo     VaultDevice?  @relation("TokenRotation")

  createdAt     DateTime  @default(now()) @map("created_at")

  vaultLink     VaultLink @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  cursors       SyncCursor[]
  runs          SyncRun[]

  @@index([vaultLinkId, revokedAt])
  @@index([userId])
  @@map("vault_devices")
}

model VaultPairingCode {
  id           String    @id @default(uuid())
  vaultLinkId  String    @map("vault_link_id")
  codeHash     String    @unique @map("code_hash")   // sha256(pepper || code); the plaintext code never lands in the DB
  expiresAt    DateTime  @map("expires_at")
  consumedAt   DateTime? @map("consumed_at")
  consumedByDeviceId String? @map("consumed_by_device_id")
  attempts     Int       @default(0)
  createdAt    DateTime  @default(now()) @map("created_at")

  vaultLink    VaultLink @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)

  @@index([vaultLinkId, expiresAt])
  @@map("vault_pairing_codes")
}
```

**Por qué `VaultDevice` está separado de `VaultLink`:** la revocación, la rotación y el "último visto" son propiedades **del cliente**, no de la bóveda. Un usuario con la misma bóveda en laptop y desktop (sincronizada por iCloud/Syncthing) tiene dos clientes que emparejan contra el mismo `VaultLink` y cada uno lleva su propio cursor. Meter el token en `VaultLink` obligaría a rehacer el modelo la primera vez que eso pase — y pasa siempre.

**Rotación:** el endpoint de rotación crea una **fila nueva** con `rotatedFromId` apuntando a la vieja y marca la vieja con `revokedAt = now + 60s` (ventana de gracia para peticiones en vuelo). Así queda linaje auditable y no hay un instante en que el cliente se quede sin credencial válida.

### 1.5 Estado de sincronización: `NoteFile`, `SyncJournalEntry`, `SyncCursor`, `SyncConflict`, `SyncRun`

```prisma
model NoteFile {
  id             String        @id @default(uuid())
  vaultLinkId    String        @map("vault_link_id")
  noteId         String        @map("note_id")

  path           String                                   // vault-relative POSIX path, with extension
  pathKey        String        @map("path_key")           // NFC + casefold of `path`
  externalId     String?       @map("external_id")        // id materialized in the file (frontmatter or sidecar)

  // Last known local state, as reported by the client
  localHash      String?       @map("local_hash")
  localSize      Int?          @map("local_size")
  localMtime     DateTime?     @map("local_mtime")

  // Base for 3-way reconciliation: what we know both sides agreed on
  baseRev        Int           @default(0) @map("base_rev")
  baseHash       String?       @map("base_hash")

  state          NoteFileState @default(PENDING_PUSH)
  deletedAt      DateTime?     @map("deleted_at")
  lastSyncedAt   DateTime?     @map("last_synced_at")
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")

  vaultLink      VaultLink     @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  note           Note          @relation(fields: [noteId],      references: [id], onDelete: Cascade)

  @@unique([vaultLinkId, noteId])
  @@unique([vaultLinkId, pathKey])
  @@index([vaultLinkId, state])
  @@index([vaultLinkId, externalId])
  @@map("note_files")
}
```

- La unique va sobre `pathKey`, **no** sobre `path`: en macOS y Windows el sistema de archivos no distingue mayúsculas, así que `Notas/Idea.md` y `notas/idea.md` no pueden coexistir. Si la unique fuera sobre `path`, el servidor aceptaría un estado imposible de materializar en disco.
- `baseRev` + `baseHash` son la **base común** de una reconciliación a tres bandas. Sin ellos solo se puede hacer "última escritura gana", que es exactamente lo que produce pérdida de párrafos silenciosa.
- `@@index([vaultLinkId, state])` alimenta la consulta "¿cuántos pendientes tengo?" de la pantalla de estado, y en SQL crudo conviene el índice parcial:
  ```sql
  CREATE INDEX note_files_pending_idx ON note_files (vault_link_id)
    WHERE state <> 'SYNCED' AND deleted_at IS NULL;
  ```

```prisma
model SyncJournalEntry {
  seq          BigInt     @id @default(autoincrement())   // THE cursor. Global sequence, filtered by user.
  userId       String     @map("user_id")
  noteId       String?    @map("note_id")
  vaultLinkId  String?    @map("vault_link_id")
  deviceId     String?    @map("device_id")

  op           SyncOp
  origin       SyncOrigin
  rev          Int?
  pathBefore   String?    @map("path_before")
  pathAfter    String?    @map("path_after")
  contentHash  String?    @map("content_hash")
  sizeBytes    Int?       @map("size_bytes")

  createdAt    DateTime   @default(now()) @map("created_at")

  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  note         Note?      @relation(fields: [noteId], references: [id], onDelete: SetNull)

  @@index([userId, seq])
  @@index([vaultLinkId, seq])
  @@index([noteId, seq])
  @@map("sync_journal")
}
```

Este modelo hace **dos trabajos a la vez**: es el mecanismo de *pull* incremental (`?since=<seq>`) y es el **registro de auditoría de sincronización** que pide el enunciado. Una sola tabla, una sola verdad de "qué pasó y quién lo causó".

> ⚠️ **Trampa conocida y obligatoria de resolver: el hueco de secuencia.** Con un `bigserial`, la transacción A puede tomar `seq=100` y la B `seq=101`, pero si B hace commit primero, un lector que llegue en ese instante ve 101, avanza su cursor y **nunca verá 100**. Es la forma clásica de perder notas en un CDC casero. Dos mitigaciones válidas:
> 1. **Serializar por usuario** (recomendado para Kibo): tomar `SELECT pg_advisory_xact_lock(hashtextextended(user_id, 0))` antes de insertar en el diario. El volumen de escritura por usuario en una app de notas personales es minúsculo; el coste es despreciable y el problema desaparece por construcción.
> 2. **Marca de agua**: solo servir entradas con `created_at < now() - 5s`, asumiendo que ninguna transacción dura más. Más frágil.
>
> Elegir una **antes** de escribir el primer endpoint, no después.

```prisma
model SyncCursor {
  id           String    @id @default(uuid())
  vaultLinkId  String    @map("vault_link_id")
  deviceId     String    @map("device_id")

  lastSeq      BigInt    @default(0) @map("last_seq")
  lastPullAt   DateTime? @map("last_pull_at")
  lastPushAt   DateTime? @map("last_push_at")
  fullResyncAt DateTime? @map("full_resync_at")

  vaultLink    VaultLink   @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  device       VaultDevice @relation(fields: [deviceId],    references: [id], onDelete: Cascade)

  @@unique([vaultLinkId, deviceId])
  @@map("sync_cursors")
}
```

```prisma
model SyncConflict {
  id            String              @id @default(uuid())
  vaultLinkId   String              @map("vault_link_id")
  noteId        String              @map("note_id")
  noteFileId    String?             @map("note_file_id")

  baseRev       Int                 @map("base_rev")
  baseHash      String?             @map("base_hash")

  kiboRev       Int                 @map("kibo_rev")
  kiboHash      String              @map("kibo_hash")
  kiboContent   String              @db.Text @map("kibo_content")   // snapshot: never rely on the live row

  vaultHash     String              @map("vault_hash")
  vaultContent  String              @db.Text @map("vault_content")  // the losing text MUST survive
  vaultPath     String              @map("vault_path")

  detectedAt    DateTime            @default(now()) @map("detected_at")
  resolvedAt    DateTime?           @map("resolved_at")
  resolution    ConflictResolution?
  resolvedBy    String?             @map("resolved_by")   // userId or "auto:last_write_wins"
  sidecarPath   String?             @map("sidecar_path")  // "Nota (conflicto 2026-08-08).md" when KEEP_BOTH

  vaultLink     VaultLink @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  note          Note      @relation(fields: [noteId],      references: [id], onDelete: Cascade)

  @@index([vaultLinkId, resolvedAt])
  @@index([noteId])
  @@map("sync_conflicts")
}

model SyncRun {
  id            String        @id @default(uuid())
  vaultLinkId   String        @map("vault_link_id")
  deviceId      String?       @map("device_id")

  direction     VaultSyncMode
  status        SyncRunStatus @default(RUNNING)
  startedAt     DateTime      @default(now()) @map("started_at")
  finishedAt    DateTime?     @map("finished_at")

  pushedCount   Int @default(0) @map("pushed_count")
  pulledCount   Int @default(0) @map("pulled_count")
  conflictCount Int @default(0) @map("conflict_count")
  skippedCount  Int @default(0) @map("skipped_count")
  bytesIn       Int @default(0) @map("bytes_in")
  bytesOut      Int @default(0) @map("bytes_out")

  errorCode     String? @map("error_code")
  errorMessage  String? @map("error_message")
  fromSeq       BigInt? @map("from_seq")
  toSeq         BigInt? @map("to_seq")

  vaultLink     VaultLink    @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  device        VaultDevice? @relation(fields: [deviceId],    references: [id], onDelete: SetNull)

  @@index([vaultLinkId, startedAt(sort: Desc)])
  @@map("sync_runs")
}
```

`SyncConflict` guarda **snapshots de las dos versiones**, no referencias. Si guardáramos solo `kiboRev` y luego el usuario sigue editando en Kibo, la pantalla de resolución mostraría un diff contra contenido que ya cambió. Un conflicto es una foto, no un puntero.

### 1.6 Enganche con la gamificación: `WritingActivity`, `XpGrant`

Sin estas dos tablas, "XP a Sabiduría por escribir" y "racha de escritura" (PRD §3.12) no son implementables.

```prisma
model XpGrant {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  attributeId    String?  @map("attribute_id")   // NULL = global hero XP only

  amount         Int
  sourceType     String   @map("source_type")    // "note.write", "habit.complete", "task.complete", ...
  sourceId       String?  @map("source_id")

  // Idempotency: a sync retry MUST NOT pay twice.
  idempotencyKey String   @unique @map("idempotency_key")  // e.g. "note.write:<userId>:2026-08-08"

  createdAt      DateTime @default(now()) @map("created_at")

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt(sort: Desc)])
  @@index([userId, sourceType])
  @@map("xp_grants")
}

model WritingActivity {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  localDate      DateTime @db.Date @map("local_date")   // the user's local day, NOT UTC

  notesCreated   Int      @default(0) @map("notes_created")
  notesEdited    Int      @default(0) @map("notes_edited")
  wordsAdded     Int      @default(0) @map("words_added")
  xpAwarded      Int      @default(0) @map("xp_awarded")
  countedForStreak Boolean @default(false) @map("counted_for_streak")

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, localDate])
  @@index([userId, localDate(sort: Desc)])
  @@map("writing_activity")
}
```

`XpGrant.idempotencyKey` es la pieza que evita el fallo más caro de todos: **inflar la economía**. Si el cliente reintenta un lote de push (cosa que va a pasar: red móvil, laptop que se suspende) y el otorgamiento de XP no es idempotente, el usuario cobra dos veces y la curva de nivel se corrompe sin forma de auditarlo.

`WritingActivity` está en **día local** (`@db.Date` + `User.timezone`), no en UTC. Un usuario en `America/Mexico_City` que escribe a las 23:00 debe verlo contado en ese día, no en el siguiente.

### 1.7 Borrado (tombstones) y reconciliación de renombrados

**Tombstones.**

- `Note.deletedAt` y `NoteFile.deletedAt` marcan el borrado; la fila permanece.
- El diario emite `op = DELETE` con la `rev` incrementada — un borrado **es** una revisión, no la ausencia de una.
- **Ventana de retención: 90 días** para `Note` borradas (permite "papelera" en la UI, que además el usuario espera) y **30 días** para `SyncJournalEntry`.
- **Regla dura:** la ventana de retención del diario define la antigüedad máxima de un cursor. Si un cliente vuelve con `since=<seq>` más viejo que la entrada más antigua conservada, el servidor **no** puede fingir que le entrega el delta: responde `410 Gone` con `{ "error": "cursor_expired" }` y el cliente hace *full resync*. Omitir esto es cómo se pierden borrados silenciosamente.
- Al purgar una `Note` con tombstone vencido, se purgan en cascada sus `NoteLink` salientes; los enlaces entrantes quedan huérfanos (`targetNoteId = NULL`), que es semánticamente correcto.

**Renombrados — tres niveles, en este orden:**

| Nivel | Mecanismo | Fiabilidad | Requisito |
|---|---|---|---|
| 1 | El cliente reporta `op: "rename"` con `previousPath` + `path` | Exacta | El cliente observa el evento de renombrado de la bóveda |
| 2 | `externalId` presente en el archivo (frontmatter o sidecar) | Exacta, sobrevive a mover con Finder/Explorador | El archivo lleva un id |
| 3 | Heurística: `DELETE(pathA)` + `CREATE(pathB)` en el mismo lote con **el mismo `contentHash`** | Buena, pero falible | Nada |

Detalles del nivel 3: se aplica **solo dentro de un mismo lote de push**, y **solo si el emparejamiento es 1:1**. Si dos archivos borrados y dos creados comparten hash (típico: plantillas vacías), es ambiguo → se tratan como borrado + creación, nunca como renombrado. Regla: *ante la duda, duplicar es reparable; fusionar es pérdida de datos*.

⚖️ **El punto de fricción con la promesa "archivos limpios" del PRD §4.** El PRD dice explícitamente: no meter metadata gamificada en el frontmatter del usuario. Estoy de acuerdo con **la metadata gamificada** (XP, monedas, rachas: eso no tiene nada que hacer en un `.md`). Pero un **identificador estable** no es metadata gamificada, es la condición de posibilidad del nivel 2. Sin él, mover una nota con el Finder mientras Obsidian está cerrado produce un duplicado en Kibo.

Mi propuesta, que el esquema ya soporta con `VaultLink.useFrontmatterId`:

- **Por defecto (`false`): sidecar.** Un archivo `.kibo/index.json` en la raíz de la bóveda con el mapa `path → noteId → hash`. Los `.md` del usuario quedan **byte a byte limpios**. Coste: si el usuario reorganiza carpetas fuera de Obsidian, el sidecar queda obsoleto y se cae al nivel 3.
- **Opcional (`true`): una sola clave `kibo-id` en el frontmatter.** Robusto al 100%, cuesta una línea por archivo, y el usuario lo activa a sabiendas.

Es una **preferencia del usuario expuesta en la UI**, no una decisión de arquitectura escondida. La elección final es del ADR de dirección; el modelo de datos no cambia en ninguno de los dos casos.

---

## 2 · Superficie de API

### 2.1 Decisión previa: ¿dónde vive esta API?

Hoy `apps/web` habla con Prisma directo y `apps/api` no lo consume nadie (§0.2). Hay que decidirlo **antes** de escribir el primer endpoint.

**Recomendación: `apps/api` (NestJS) es la superficie para máquinas; `apps/web` sigue leyendo por Server Components / Server Actions para el navegador.** Frontera explícita: *todo cliente que no sea el navegador del usuario habla con `apps/api`*.

Razones:
1. **Es otro esquema de autenticación.** El navegador usa cookie de sesión Auth.js; el plugin usa un bearer de dispositivo. Meter el segundo dentro del middleware de Next (`apps/web/src/middleware.ts`, que hoy hace `matcher: ['/((?!api|_next/static|...).*)']`) implica un guard paralelo dentro del mismo runtime — se enreda rápido y se rompe en el primer refactor de auth.
2. **Los workers necesitan un proceso Node persistente de todas formas** (§4). Ese proceso vive naturalmente junto al NestJS y comparte servicios de dominio.
3. **Los lotes de push pueden ser grandes y lentos** (importar una bóveda de 3,000 notas). Los route handlers de Next bajo runtimes serverless tienen límites de ejecución; un servicio Nest de larga vida no.
4. Cuesta poco: `apps/api` ya existe, ya tiene `PrismaService`, y hoy no hace nada. Ponerlo a trabajar es más barato que mantenerlo muerto.

Lo que hay que arreglar en `apps/api` antes de nada (todo verificado como ausente):

```ts
// apps/api/src/main.ts  — estado objetivo
const app = await NestFactory.create(AppModule, { bodyParser: true });
app.setGlobalPrefix('api');
app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
app.enableCors({ origin: allowlistFromEnv(), credentials: true }); // hoy: enableCors() sin argumentos
app.use(json({ limit: '8mb' }));
app.useGlobalFilters(new ProblemDetailsFilter());  // RFC 9457
```

Y borrar o reescribir `apps/api/src/users/users.controller.ts`, que es el stub roto de §0.2.

### 2.2 Modelo de errores (transversal)

Todas las respuestas de error en formato **RFC 9457 (Problem Details)** con un `code` legible por máquina, porque el plugin tiene que decidir sin parsear prosa:

```json
{
  "type": "https://kibo.app/errors/cursor-expired",
  "title": "Sync cursor is older than the retention window",
  "status": 410,
  "code": "cursor_expired",
  "detail": "Cursor 84211 predates the oldest retained journal entry (91002).",
  "instance": "/api/v1/vaults/9f1.../changes"
}
```

Códigos que el cliente debe manejar explícitamente: `cursor_expired` (410), `rev_mismatch` (409), `token_expired` (401), `token_revoked` (401), `scope_missing` (403), `payload_too_large` (413), `rate_limited` (429, con `Retry-After`), `vault_paused` (423).

### 2.3 Emparejamiento (pairing)

Dos flujos posibles. **Empieza por el A**, que es más simple porque el usuario ya está autenticado en la web.

**Flujo A — iniciado en el navegador (recomendado para v1):**

```
POST /api/v1/vaults                        [session]
POST /api/v1/vaults/:vaultId/pairing-codes [session]   -> muestra "KIBO-7QX4-9M2A"
POST /api/v1/pairing/claim                 [sin auth]   <- el plugin envía el código
GET  /api/v1/vaults/:vaultId/pairing-codes/:codeId [session]  -> polling para pintar "conectado"
```

```http
POST /api/v1/vaults
Content-Type: application/json

{
  "name": "Bóveda personal",
  "clientKind": "OBSIDIAN_PLUGIN",
  "syncMode": "KIBO_TO_VAULT",
  "scopeFolders": ["Recursos"],
  "ignoreGlobs": [".obsidian/**", "**/*.excalidraw.md"]
}

201 Created
{
  "id": "9f1c…", "name": "Bóveda personal", "status": "PENDING_PAIR",
  "syncMode": "KIBO_TO_VAULT", "createdAt": "2026-08-08T18:02:11Z"
}
```

```http
POST /api/v1/vaults/9f1c…/pairing-codes

201 Created
{
  "codeId": "b3d…",
  "code": "KIBO-7QX4-9M2A",           // devuelto UNA sola vez; en BD solo el hash
  "expiresAt": "2026-08-08T18:12:11Z", // TTL 10 min
  "maxAttempts": 5
}
```

```http
POST /api/v1/pairing/claim
Content-Type: application/json

{
  "code": "KIBO-7QX4-9M2A",
  "client": {
    "kind": "OBSIDIAN_PLUGIN",
    "name": "MacBook Pro",
    "version": "0.1.0",
    "platform": "darwin-arm64",
    "vaultIdHint": "8a1f…"
  }
}

200 OK
{
  "deviceId": "d7a…",
  "deviceToken": "kbo_dev_9F3xQ…",     // ÚNICA vez que se ve en claro; guardar en el vault-local data del plugin
  "tokenPrefix": "kbo_dev_9F3x",
  "vaultLinkId": "9f1c…",
  "syncMode": "KIBO_TO_VAULT",
  "scopes": ["notes:read", "notes:write", "vault:status", "gamification:read"],
  "expiresAt": "2026-11-06T18:04:00Z",
  "limits": { "maxBatchOps": 200, "maxNoteBytes": 2097152, "minPollSeconds": 30 }
}
```

Reglas del claim: sin autenticación (el código *es* la credencial), **rate limit agresivo por IP** (`@nestjs/throttler`), un solo uso (`consumedAt`), `attempts` incrementa en cada fallo y a los 5 el código se invalida. El código se compara por hash con comparación en tiempo constante.

**Flujo B — iniciado en el plugin** (`POST /api/v1/pairing/request` devuelve el código, el usuario lo teclea en Kibo). Mejor UX cuando el plugin es la puerta de entrada, pero requiere que el plugin pueda hablar con Kibo antes de tener credencial. Se puede añadir después sin tocar el esquema — `VaultPairingCode` ya permite `vaultLinkId` asignado a posteriori si se hace nullable.

### 2.4 Autenticación del cliente

- Header: `Authorization: Bearer kbo_dev_<43 chars base64url>` (32 bytes de aleatoriedad de `crypto.randomBytes`).
- Prefijo `kbo_dev_` deliberado: permite que los escáneres de secretos (GitHub secret scanning y equivalentes) reconozcan el patrón, y permite mostrarlo truncado en la UI.
- En BD, **solo** `sha256(pepper || token)`, con el *pepper* en variable de entorno (`SYNC_TOKEN_PEPPER`). Nunca el token. Constitución Art. 1.
- Guard de Nest `DeviceTokenGuard` en `apps/api/src/auth/device-token.guard.ts`: hash → lookup por `tokenHash` (unique, O(1)) → verifica `revokedAt`, `expiresAt`, `VaultLink.status` → inyecta `{ userId, vaultLinkId, deviceId, scopes }` en la request. Actualiza `lastUsedAt` de forma diferida (encolar, no escribir en la ruta caliente).
- Scopes por endpoint con un decorador `@Scopes('notes:write')`. Un cliente "solo lectura" (por ejemplo, una futura extensión de escritorio que solo muestra la racha) pide únicamente `gamification:read` — mínimo privilegio, constitución Art. 9.

```http
POST /api/v1/device/token/rotate    [device]
200 OK
{ "deviceToken": "kbo_dev_…", "deviceId": "e02…", "expiresAt": "...", "previousValidUntil": "2026-08-08T18:05:00Z" }

DELETE /api/v1/device/token         [device]     # auto-revocación al desinstalar el plugin
204 No Content

DELETE /api/v1/vaults/:vaultId/devices/:deviceId  [session]   # revocar desde la web
204 No Content
```

### 2.5 Pull (servidor → cliente)

```http
GET /api/v1/vaults/:vaultId/changes?since=91002&limit=200    [device: notes:read]

200 OK
{
  "changes": [
    { "seq": 91003, "op": "UPDATE", "noteId": "a1…", "rev": 7,
      "path": "Recursos/Sistemas.md", "titleKey": "sistemas",
      "contentHash": "sha256:6f2a…", "sizeBytes": 4211,
      "updatedAt": "2026-08-08T17:59:02Z" },
    { "seq": 91004, "op": "RENAME", "noteId": "b2…", "rev": 3,
      "pathBefore": "Inbox/Nota.md", "pathAfter": "Recursos/Nota.md",
      "contentHash": "sha256:11cd…" },
    { "seq": 91005, "op": "DELETE", "noteId": "c3…", "rev": 4, "path": "Inbox/Vieja.md" }
  ],
  "nextCursor": 91005,
  "hasMore": false,
  "serverTime": "2026-08-08T18:00:00Z"
}
```

**El delta no lleva cuerpos.** Solo metadata + hash. Así el cliente puede saltarse todo archivo cuyo hash ya coincide con el local (caso mayoritario tras un rearranque) y solo pide el contenido de lo que realmente cambió. Reduce el tráfico en un orden de magnitud en el escenario típico.

```http
GET /api/v1/notes/:noteId            [device|session]
If-None-Match: W/"a1…-7"

304 Not Modified          # o 200 con el cuerpo y ETag: W/"a1…-8"
```

```http
POST /api/v1/notes/batch-get         [device: notes:read]
{ "ids": ["a1…", "b2…", "c3…"] }

200 OK
{ "notes": [ { "id":"a1…", "rev":7, "path":"…", "content":"# …", "contentHash":"sha256:6f2a…" } ],
  "missing": ["c3…"] }
```

`batch-get` existe porque 300 notas × 1 round-trip sobre una conexión doméstica es la diferencia entre un sync de 4 segundos y uno de 3 minutos.

### 2.6 Push (cliente → servidor)

Un solo endpoint, por lotes, idempotente, con control de concurrencia por operación:

```http
POST /api/v1/vaults/:vaultId/changes     [device: notes:write]
Idempotency-Key: 018f2c3a-…             # = batchId
Content-Type: application/json
Content-Encoding: gzip

{
  "batchId": "018f2c3a-…",
  "clientTime": "2026-08-08T18:00:03Z",
  "ops": [
    { "opId": 1, "op": "upsert", "noteId": "a1…", "baseRev": 7,
      "path": "Recursos/Sistemas.md", "content": "# Sistemas\n…",
      "contentHash": "sha256:9c11…", "localMtime": "2026-08-08T17:58:00Z" },

    { "opId": 2, "op": "upsert", "externalId": null, "baseRev": null,
      "path": "Inbox/Nueva.md", "content": "…", "contentHash": "sha256:aa02…" },

    { "opId": 3, "op": "rename", "noteId": "b2…", "baseRev": 3,
      "previousPath": "Inbox/Nota.md", "path": "Recursos/Nota.md" },

    { "opId": 4, "op": "delete", "noteId": "c3…", "baseRev": 4, "path": "Inbox/Vieja.md" }
  ]
}
```

```http
200 OK
{
  "batchId": "018f2c3a-…",
  "runId": "r91…",
  "results": [
    { "opId": 1, "status": "applied",  "noteId": "a1…", "rev": 8 },
    { "opId": 2, "status": "applied",  "noteId": "d4…", "rev": 1 },
    { "opId": 3, "status": "applied",  "noteId": "b2…", "rev": 4 },
    { "opId": 4, "status": "conflict", "noteId": "c3…", "rev": 6,
      "conflictId": "k77…", "reason": "rev_mismatch",
      "server": { "rev": 6, "contentHash": "sha256:be31…" } }
  ],
  "nextCursor": 91011
}
```

**Decisiones y su justificación:**

- **Idempotencia:** el servidor guarda el resultado del lote indexado por `(deviceId, batchId)` durante 24 h. Un reintento devuelve el resultado almacenado **sin volver a aplicar nada**. Esto es lo que hace seguro el reintento automático del cliente ante un timeout de red — que es la situación normal, no la excepcional.
- **Concurrencia por `baseRev`, no por `If-Match`.** `If-Match` es la forma correcta en HTTP para **un** recurso, pero no puede expresar precondiciones distintas para 200 operaciones dentro de un lote. Por eso: `baseRev` en el cuerpo para el endpoint de lote, y `If-Match: W/"<rev>"` con `412 Precondition Failed` en `PUT /api/v1/notes/:id`, que es el que usa el editor del navegador. Ambos codifican la misma semántica.
- **Un `200` con estados por operación, no un `207 Multi-Status`.** El 207 obliga al cliente a parsear un formato poco habitual y confunde a los proxies. Un 200 con `results[]` es trivial de consumir desde TypeScript y desde el plugin.
- `status` posibles por operación: `applied` · `noop` (el hash ya coincidía) · `conflict` · `rejected` (con `reason`: `path_illegal`, `too_large`, `out_of_scope`, `quarantined`).
- **`noop` es importante:** es la señal de que el cliente y el servidor ya estaban de acuerdo, y es lo que corta el bucle de re-escritura (el enemigo número uno de estos sistemas).

### 2.7 Estado, conflictos y control

```http
GET /api/v1/vaults/:vaultId/status          [device|session]
{
  "status": "ACTIVE", "syncMode": "KIBO_TO_VAULT",
  "lastSyncAt": "2026-08-08T18:00:04Z",
  "pendingPush": 0, "pendingPull": 3, "openConflicts": 1,
  "noteCount": 412, "deviceCount": 2,
  "cursor": { "server": 91011, "device": 91008 }
}

GET  /api/v1/vaults/:vaultId/conflicts?status=open      [session]
GET  /api/v1/conflicts/:id                              [session]   # incluye ambos cuerpos para el diff
POST /api/v1/conflicts/:id/resolve                      [session]
     { "resolution": "keep_both" }        # | keep_kibo | keep_vault | merged (+ "content")
GET  /api/v1/vaults/:vaultId/runs?limit=20              [session]   # historial de auditoría
POST /api/v1/vaults/:vaultId/pause                      [session]
POST /api/v1/vaults/:vaultId/resync                     [session]   # invalida cursores -> full resync
DELETE /api/v1/vaults/:vaultId                          [session]   # desconectar: revoca dispositivos, conserva notas
GET  /api/v1/device/hello                               [device]    # capacidades y límites del servidor
```

`GET /device/hello` merece una nota: devuelve `{ serverVersion, minClientVersion, limits, features }`. Permite subir el tamaño máximo de lote o desactivar una feature **sin publicar una versión del plugin** — y publicar una versión del plugin tiene latencia de días (§3.4). Es barato ahora y salva un incidente después.

⚖️ **Dónde cambia esto según la dirección:**

| Decisión | Efecto en la API |
|---|---|
| **Kibo-first** | `POST /changes` se reduce a `POST /ack` (el cliente solo confirma qué materializó). Desaparecen `baseRev`, `SyncConflict` y toda la pantalla de conflictos. **Ahorro estimado: ~40% del trabajo de API y ~70% del de UI de sync.** |
| **Vault-first** | `POST /changes` se mantiene íntegro, pero Kibo nunca escribe en la bóveda: `NoteFile.state` nunca es `PENDING_PUSH`. Los conflictos solo ocurren si el usuario edita en la web. |
| **Bidireccional** | Todo lo descrito. Es el superconjunto. |

Por eso el contrato está diseñado como superconjunto: si se elige Kibo-first, se implementa un subconjunto del mismo contrato, no un contrato distinto.

---

## 3 · Estructura de paquetes del monorepo

### 3.1 Lo que se agrega

```
packages/
  sync-core/          ← NUEVO. Contratos + lógica pura de sincronización.
  markdown/           ← NUEVO. Parser/serializador Markdown "sabor Obsidian".
  database/           ← existente; se le añaden modelos y migraciones
  ui/                 ← existente pero ROTO; hay que arreglarlo o borrarlo
  config/             ← existente pero vacío; debe alojar tsconfig/eslint base
apps/
  api/                ← existente, huérfano; pasa a ser la superficie de máquinas
  web/                ← existente
  obsidian-plugin/    ← temporal; se extrae a repo propio en el primer release (§3.4)
```

### 3.2 `packages/sync-core` — sí, y es el paquete más importante

```
packages/sync-core/
  src/
    contracts/        # zod schemas: PushBatch, PullPage, PairingClaim, Problem…
    hashing.ts        # canonicalize() + sha256() — LA función crítica
    paths.ts          # normalizePath, pathKey, isIllegalPath, scopeMatches
    rev.ts            # compareRev, decideOutcome(base, local, remote) -> apply|conflict|noop
    rename.ts         # detectRenames(batch): heurística 1:1 por contentHash
    cursor.ts         # encode/decode y validación de cursores
  package.json        # sin dependencias de Prisma, Nest ni React
```

**El argumento decisivo para que esto sea un paquete compartido y no código duplicado:** el plugin y el servidor tienen que calcular **exactamente el mismo hash** para el mismo archivo. Si difieren en un byte — CRLF vs LF, BOM al inicio, salto de línea final, normalización Unicode NFC vs NFD — el servidor cree que el archivo cambió, lo reescribe, el cliente cree que el archivo cambió, lo reenvía, y se produce un **bucle infinito de escrituras en la bóveda del usuario**. Eso no es un bug menor: es un producto que corrompe archivos y del que la gente habla mal en público.

Por eso `canonicalize()` vive en un solo sitio, tiene un corpus de pruebas dorado (`fixtures/` con archivos con BOM, CRLF, emoji, acentos en NFD, frontmatter con tabs) y **cualquier cambio en ella es un cambio de versión mayor con full resync forzado**.

Los contratos en **Zod** sirven al mismo tiempo como validación en Nest (vía `nestjs-zod` o un pipe propio), como tipos en el cliente, y como fuente para generar el OpenAPI. Un solo origen, tres consumidores.

**No creo un `packages/contracts` aparte.** Sería un paquete de 200 líneas más en el grafo de Turbo con el mismo ciclo de vida que `sync-core`. Se fusionan.

### 3.3 `packages/markdown` — sí, con alcance acotado

```
packages/markdown/
  src/
    frontmatter.ts    # parse/serialize YAML preservando orden y formato original
    wikilinks.ts      # [[target|alias]], [[target#heading]], [[target^block]], ![[embed]]
    tags.ts           # #tag/anidado, excluyendo los que están dentro de code fences
    title.ts          # derivación de título: frontmatter.title > primer H1 > basename
    render.ts         # AST -> React (para la vista de lectura del editor)
  fixtures/           # corpus de conformidad "sabor Obsidian"
```

Base técnica recomendada: **unified / remark** (`remark-parse`, `remark-frontmatter`, `remark-gfm`) más una extensión de micromark para wikilinks (`mdast-util-wiki-link` o propia). Motivos: es el estándar de facto, funciona igual en Node, navegador y Electron, y produce un AST que sirve tanto para extraer enlaces en el servidor como para renderizar en el cliente.

**Advertencia de fidelidad (hecho, no supuesto):** el Markdown de Obsidian **no es CommonMark puro**. Incluye al menos: `[[wikilinks]]`, embeds `![[ ]]`, referencias de bloque `^abc123`, callouts `> [!note]`, comentarios `%%…%%` y propiedades de frontmatter tipadas. Ningún parser estándar los cubre todos. Por eso el entregable real de este paquete no es "un parser", es **un subconjunto documentado + un corpus de conformidad**. Ese corpus es lo que evita que la ingesta de una bóveda real destroce las notas del usuario.

**La coherencia que compra:** el mismo parser extrae los enlaces en el servidor (para `NoteLink`), resalta en el editor y renderiza la vista previa. Si son tres parsers distintos, los backlinks que ve el usuario no coinciden con los que calcula el servidor, y ese bug es imposible de explicar.

### 3.4 El plugin de Obsidian: **repo aparte**, con desarrollo inicial dentro del monorepo

Recomendación en dos tiempos:

1. **Mientras no exista un release público:** desarrollarlo como `apps/obsidian-plugin` dentro del monorepo. Iterar con `packages/sync-core` cambiando cada hora es insoportable con dos repos.
2. **Al primer release público:** extraerlo a un repo propio y público, `sergiotortolero/kibo-obsidian`, y consumir `@kibo/sync-core` y `@kibo/markdown` como dependencias publicadas en npm.

**Por qué el build de Turbo NO es el argumento.** El plugin se compila con esbuild a un `main.js` CommonJS con `obsidian` marcado como external, todo lo demás inlineado. Es un target distinto de Next y de Nest, pero Turbo orquesta targets heterogéneos sin problema — ese solo no justifica separar.

**El argumento real es el ciclo de release de la comunidad Obsidian, que es incompatible con el de una app web:**

| Dimensión | App web (Kibo) | Plugin de Obsidian |
|---|---|---|
| Cadencia | Continua; se despliega varias veces al día | Discreta; cada versión requiere un GitHub Release etiquetado |
| Visibilidad del repo | Privado | **Debe ser público** para figurar en el catálogo de la comunidad |
| Versionado | Interno, irrelevante para el usuario | El tag del release debe coincidir con `version` de `manifest.json` |
| Distribución | Tú controlas cuándo llega al usuario | El usuario decide cuándo actualiza; convivirás con versiones viejas meses |
| Primera publicación | — | Requiere revisión manual por el equipo de Obsidian, con latencia de días o semanas |

> **Nivel de evidencia:** los mecanismos de la tabla (repo público, GitHub Release con assets `main.js` / `manifest.json` / `styles.css`, tag = `version` sin prefijo `v`, revisión manual para el primer alta) son **de alta confianza** pero **debo marcarlos como pendientes de verificación** contra `docs.obsidian.md` y el repo `obsidianmd/obsidian-releases` antes de planificar fechas. No tengo acceso de navegación en esta sesión y el brief prohíbe inventar citas. **Verificar antes de comprometer un calendario.**

Consecuencias operativas que se derivan de esa tabla y que hay que asumir desde el diseño:

- **El repo del plugin tiene que ser público** → el monorepo de Kibo, que no lo es, no puede alojarlo en el release. Mantener un espejo público de una subcarpeta es una fuente permanente de fricción.
- **Convivirás con versiones antiguas del plugin durante meses.** Por eso `GET /device/hello` con `minClientVersion` y por eso la API va versionada por URI desde el día uno. Un cambio incompatible en el contrato no se puede "desplegar": hay que soportar ambos durante un trimestre.
- **La latencia de publicación te quita la capacidad de hotfix.** Si el plugin tiene un bug que corrompe archivos, no puedes arreglarlo esa tarde. Eso obliga a un **kill switch del lado del servidor**: `VaultLink.status = PAUSED` con `statusReason`, que el plugin respeta y deja de escribir. Es una feature de la API, no un extra.

**Sobre publicar `@kibo/sync-core` en npm:** no contiene lógica de negocio valiosa ni secretos — son contratos y funciones puras. Publicarlo elimina todo el acoplamiento entre repos y de paso documenta el protocolo. Si Sergio prefiere no publicar, la alternativa que funciona es que el plugin haga `pnpm link` a un checkout hermano en desarrollo y vendorice el paquete en el build (esbuild lo inlinea de todos modos, así que no hay dependencia en tiempo de ejecución).

**Regla de extracción, explícita:** *el plugin sale del monorepo el día que se publique la primera versión al catálogo de la comunidad.* Ni antes (fricción innecesaria) ni después (bloqueo de la publicación).

### 3.5 Cambios concretos en la configuración del monorepo

`turbo.json` — estado objetivo (hoy no existe ninguna de estas tareas):

```jsonc
{
  "tasks": {
    "db:generate": { "cache": false, "outputs": ["../../node_modules/.prisma/**"] },
    "build":     { "dependsOn": ["^build", "^db:generate"], "outputs": [".next/**", "!.next/cache/**", "dist/**"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test":      { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "lint":      { "dependsOn": ["^lint"] },
    "dev":       { "cache": false, "persistent": true }
  },
  "globalEnv": [
    "DATABASE_URL", "AUTH_SECRET", "NEXT_PUBLIC_API_URL",
    "SYNC_TOKEN_PEPPER", "SYNC_JOURNAL_RETENTION_DAYS"
    /* + las de Auth.js que ya están */
  ]
}
```

`pnpm-workspace.yaml` — **sin cambios**: `packages/*` y `apps/*` ya recogen todo lo nuevo (verificado).

`docker-compose.yml` — **sin servicios nuevos** si se elige pg-boss (§4). Ese es precisamente el argumento de §4.

`packages/config` — hoy vacío; debe alojar `tsconfig.base.json` y la config compartida de ESLint, porque `sync-core` y `markdown` tienen que compilar con las mismas reglas que consumen `api`, `web` y el plugin. Sin esto, `sync-core` compila distinto según quién lo importe.

`packages/ui` — **decisión requerida**: hoy declara `"main": "./index.tsx"` sin que ese archivo exista. O se le da contenido real (extrayendo las primitivas de `apps/web/src/components/ui`) o se borra. Mi recomendación: **borrarlo por ahora** y mantener los componentes en `apps/web` hasta que haya un segundo consumidor de UI. Un paquete roto en el workspace es una trampa para el siguiente desarrollador.

---

## 4 · Trabajos en segundo plano

### 4.1 Elección de tecnología

| Opción | Infra nueva | Cron persistente | Reintentos | Seguro con >1 réplica | Veredicto |
|---|---|---|---|---|---|
| `@nestjs/schedule` (cron en proceso) | Ninguna | No (se pierde al reiniciar) | No | **No** — dos réplicas ejecutan el mismo cron | ❌ Inaceptable para cualquier cosa que otorgue XP |
| BullMQ + Redis (`@nestjs/bullmq`) | **Redis** | Sí | Sí | Sí | Potente, pero añade un segundo datastore |
| **pg-boss** | Ninguna (usa el Postgres existente) | Sí | Sí, con backoff | Sí | ✅ **Recomendado** |
| Graphile Worker | Ninguna | Sí | Sí | Sí | Alternativa equivalente y muy sólida |

**Recomendación: pg-boss sobre el Postgres que ya está en `docker-compose.yml`.**

Justificación frente al criterio "sin inflar el stack": Redis sería el **segundo** almacén de datos del proyecto — segunda estrategia de respaldo, segundo modo de fallo, segundo contenedor en cada entorno, segunda cosa que aprender para alguien que está aprendiendo vibe coding. La carga de Kibo no lo justifica: un usuario intenso escribe decenas de notas al día, no decenas de miles por segundo. pg-boss da colas, reintentos con backoff exponencial, jobs programados, *singleton keys* (deduplicación) y cola de fallidos, todo en tablas de Postgres. El día que la escala lo pida, migrar a BullMQ es cambiar el adaptador, no la lógica.

`@nestjs/schedule` queda descartado por una razón concreta y no negociable: **el cierre de racha otorga economía**. Con dos réplicas del proceso, dos crons en memoria cierran la racha del mismo usuario y pagan XP dos veces. Aunque hoy haya una sola réplica, eso es una bomba de relojería para el primer despliegue con redundancia.

Dónde corre: `apps/api/src/worker.ts` — un bootstrap de Nest separado (`NestFactory.createApplicationContext`) que carga los mismos módulos de dominio pero no expone HTTP. En desarrollo se levanta con la API; en producción es un contenedor aparte con el mismo build. Sin reescritura cuando toque separar.

### 4.2 Catálogo de trabajos

| Job | Disparador | Tipo | Clave de idempotencia / singleton | Notas |
|---|---|---|---|---|
| `note.reindex` | tras cada escritura de nota (push, editor web, import) | cola, *debounce* 2 s por nota | `note:<noteId>:<rev>` | Parsea con `packages/markdown`, hace upsert de `NoteLink` + `NoteTag`, borra los obsoletos, actualiza `outLinkCount`/`wordCount` |
| `links.rebind` | tras crear o renombrar una nota | cola | `rebind:<noteId>:<rev>` | Busca enlaces sin resolver con ese `targetKey` y los apunta; actualiza `backLinkCount` de ambos lados |
| `notes.recompute-orphans` | tras lote de reindex + cron nocturno | cron diario + cola | `orphans:<userId>:<date>` | Actualiza `isOrphan`; alimenta las "misiones de enlace" del PRD §3.12 |
| `vault.reindex-all` | al vincular bóveda, tras import, o `POST /resync` | cola, troceado en lotes de 200 | `vault:<vaultLinkId>:<runId>` | Escribe progreso en `SyncRun`; debe ser reanudable |
| `writing.grant-xp` | tras escritura, agregado por usuario/día | cola con `singletonKey` + `singletonSeconds: 300` | `XpGrant.idempotencyKey = "note.write:<userId>:<localDate>"` | **Debe coalescer**: 40 notas en un sync de 2 min = 1 job, no 40 |
| `streak.close-day` | cron **cada 15 min** | cron | `streak:<userId>:<localDate>` | Selecciona usuarios cuyo fin-de-día local acaba de cruzar |
| `sync.prune-journal` | cron diario | cron | — | Borra `SyncJournalEntry` con más de `SYNC_JOURNAL_RETENTION_DAYS`; **nunca** por debajo del cursor más viejo vivo |
| `sync.purge-tombstones` | cron diario | cron | — | Purga `Note` con `deletedAt` > 90 días |
| `sync.expire-credentials` | cron horario | cron | — | Caduca `VaultPairingCode` y `VaultDevice` vencidos |
| `sync.stale-vault-alert` | cron diario | cron | — | `VaultLink` sin `lastSyncAt` en 7 días → `status = ERROR`, notificación "revisa tu bóveda" |

### 4.3 Los dos trabajos que hay que diseñar con cuidado

**Cierre de racha diaria.** No es "un cron a medianoche". El PRD §3.14 permite configurar **fin de día** y los usuarios están en zonas horarias distintas. El diseño correcto:

1. Cron cada 15 minutos.
2. Consulta: usuarios cuyo instante `(hoy local a las 00:00 + dayEndsAtMinutes)` cayó dentro de la ventana desde la última ejecución.
3. Por cada usuario, en una transacción con `singletonKey = streak:<userId>:<localDate>`: ¿hubo ≥1 tarea o ≥1 hábito completado en el día local? (PRD §3.5). Si no, y hay protector en stock → consumirlo; si no → racha a cero.
4. La actividad de escritura alimenta la **racha de escritura de Recursos** (`WritingActivity.countedForStreak`), que según el PRD §3.12 es una racha propia del módulo, distinta de la racha global.

Aquí hace falta subrayar la dependencia dura: **este job no se puede escribir hasta que existan las entidades `Habit`, `Task` y el modelo de racha global**, que hoy no existen. La racha de escritura es un caso particular de un motor que aún no está construido.

**Otorgamiento de XP por escritura.** Reglas que hay que fijar en el PRD antes de codificar, porque son decisiones de producto disfrazadas de detalles técnicos:

- ¿Se paga por **nota creada**, por **palabras añadidas**, o por **día con actividad**? Recomiendo *día con actividad*, con un pequeño bonus escalonado por volumen y **tope diario**. Pagar por palabra es una invitación abierta a que un import de 3,000 notas otorgue XP para diez niveles de golpe.
- **Una importación de bóveda no debe pagar XP retroactivo.** `Note.origin = IMPORT` y `SyncOrigin = IMPORT` existen precisamente para poder excluirlas del cálculo. Sin ese campo, la primera vinculación de una bóveda real rompe la economía.
- El otorgamiento va siempre por `XpGrant` con `idempotencyKey`, en la misma transacción que la actualización de `UserAttribute.currentXp`.

---

## 5 · Frontend (`apps/web`)

### 5.1 Rutas nuevas

Todas cuelgan del grupo `(app)`, que hoy solo contiene `dashboard`:

```
apps/web/src/app/(app)/
  resources/
    page.tsx                    # explorador: árbol + lista + panel de pulso
    [noteId]/page.tsx           # editor + backlinks + metadatos
    orphans/page.tsx            # "misiones de enlace" (PRD §3.12)
    layout.tsx                  # shell de 3 columnas, colapsable en móvil
  settings/
    page.tsx
    integrations/
      page.tsx                  # lista de integraciones (Obsidian, Calendar, Salud, Notion)
      obsidian/
        page.tsx                # estado de la bóveda, dispositivos, historial
        connect/page.tsx        # asistente de emparejamiento
        conflicts/page.tsx      # bandeja de conflictos
        conflicts/[id]/page.tsx # resolución con diff lado a lado
```

### 5.2 Pantalla Recursos

**Estructura de tres columnas** (colapsa a una en móvil):

- **Izquierda — navegador:** árbol de carpetas, lista de tags con conteo, Favoritas, Huérfanas (con contador que actúa como llamada a la acción), Recientes.
- **Centro — lista o editor:** buscador con `⌘K` (*quick switcher* estilo Obsidian), ordenamiento, filtros; al abrir una nota, el editor ocupa la columna.
- **Derecha — contexto:** backlinks (agrupados por nota, con el párrafo de contexto), enlaces salientes, enlaces sin resolver, propiedades del frontmatter, estado de sync de *esta* nota (`SYNCED` / `PENDING` / `CONFLICT`).

**Panel de pulso** (PRD §3.12: total, escritas/semana, enlaces, huérfanas, racha). Construirlo como componente `<ResourcesPulse />` desde el principio, **no como una sección de la página**, porque el PRD §3.1 quiere widgets del dashboard "Hoy" y este es candidato obvio. Un componente, dos ubicaciones.

**Grafo: no en v1.** Coincido con el "no hacer" del PRD §4 y añado el argumento técnico: un grafo de fuerzas por encima de ~2,000 nodos exige canvas/WebGL (`react-force-graph`, `cosmograph`) porque el SVG en DOM colapsa; es una obra de varias semanas de pulido cuyo impacto en retención es prácticamente nulo — la gente mira el grafo una vez y no vuelve. **Lo que sí aporta valor y cuesta un día:** un "**mapa local**" — la nota actual, sus backlinks y sus enlaces salientes en una lista agrupada, con navegación de un salto. Es el 90% del valor de uso real del grafo al 5% del coste.

### 5.3 Editor Markdown: **CodeMirror 6**

Recomendación concreta: **`@uiw/react-codemirror` sobre CodeMirror 6**, con `@codemirror/lang-markdown` y `@codemirror/language-data`, más extensiones propias para autocompletado de `[[wikilinks]]`, chips de tags y navegación por clic.

Comparativa y — sobre todo — **por qué se descarta la familia WYSIWYG**:

| Opción | Modelo de documento | Riesgo para el sync | Veredicto |
|---|---|---|---|
| **CodeMirror 6** | **El texto Markdown es el documento** | Ninguno: lo que se guarda es exactamente lo que el usuario ve | ✅ **Elegido** |
| TipTap / Milkdown / Lexical (WYSIWYG) | AST de texto enriquecido (ProseMirror/Lexical) | **Alto** — ver abajo | ❌ Descartado |
| `@uiw/react-md-editor` | Texto + panel de vista previa | Bajo, pero poco extensible y pelea con Tailwind v4 | 🟡 Solo como MVP desechable |
| `<textarea>` + `react-markdown` | Texto | Ninguno | 🟡 Honesto para una demo, insuficiente para un módulo premium |

**El argumento decisivo contra WYSIWYG** — y es el que más peso tiene en un producto de sincronización: en TipTap/Milkdown/Lexical el documento vivo es un **árbol de texto enriquecido**, no la cadena Markdown. Al abrir un archivo se parsea a árbol y al guardar se **re-serializa**. Esa re-serialización normaliza: cambia `*` por `-` en listas, reajusta la indentación, reescribe enlaces de referencia como enlaces en línea, reordena o reformatea el frontmatter, ajusta saltos de línea. Resultado: **el `contentHash` cambia por el simple hecho de abrir y cerrar una nota, sin que el usuario haya escrito nada.**

En un producto que promete "tus archivos quedan limpios" y que sincroniza contra una bóveda, eso significa: conflictos fantasma, diffs de git contaminados en las bóvedas que la gente versiona (muchísimas lo están), y desconfianza inmediata. Es exactamente el tipo de fallo que hunde una integración. **CodeMirror mantiene el texto como fuente de verdad; el hash solo cambia si el usuario cambió algo.**

Beneficios secundarios de CM6: es el mismo linaje de editor que usa Obsidian (alta confianza; verificar), así que el usuario reconoce el comportamiento; funciona bien en móvil; y la extensibilidad es exactamente lo que necesitamos para wikilinks.

**Vista de lectura:** `react-markdown` + `remark-gfm` + los plugins de `packages/markdown`, con `rehype-sanitize` obligatorio (renderizar Markdown ajeno a HTML es un vector XSS; una línea de defensa aquí no es opcional aunque la seguridad a fondo esté fuera de alcance de este documento).

### 5.4 Pantalla Cuenta → Integraciones

Lo difícil aquí **no es el feliz camino, son los estados**. Hay que diseñar los ocho:

| Estado | Qué muestra | Acción principal |
|---|---|---|
| `NOT_CONNECTED` | Qué es, qué hace, qué NO hace (no lee Finanzas ni Salud) | "Conectar bóveda" |
| `PAIRING` | Código grande, cuenta atrás, pasos de instalación del plugin | "Copiar código" / "Cancelar" |
| `ACTIVE` | Última sync, nº de notas, dispositivos, carpeta en alcance | "Sincronizar ahora" |
| `SYNCING` | Progreso con `SyncRun` (n/N), cancelable | "Cancelar" |
| `PAUSED` | Motivo, desde cuándo | "Reanudar" |
| `ERROR` | `statusReason` traducido a lenguaje humano + qué hacer | "Reintentar" / "Reconectar" |
| `CONFLICTS` | Contador, previsualización de las 3 primeras | "Resolver" |
| `REVOKED` | Se desconectó; **las notas siguen en Kibo** | "Volver a conectar" |

Ese estado `REVOKED` merece énfasis de producto: desconectar la bóveda **no** debe borrar notas. Hay que decirlo en la UI, con esas palabras, antes de que el usuario pulse. Es la diferencia entre confianza y una reseña de una estrella.

**Resolución de conflictos:** diff a dos columnas con `diff` (jsdiff) y un renderizador propio con los tokens del design system. Descarto `react-diff-viewer-continued` porque impone su propia estética (aspecto GitHub) y Kibo tiene una voz visual muy definida (Duolingo-like, mascota KIBO, teal). Tres acciones: **Conservar la de Kibo · Conservar la de la bóveda · Conservar ambas** (esta última crea `Nota (conflicto 2026-08-08).md`, que es lo que hacen los sincronizadores serios y lo que la gente entiende sin explicación).

**Lista de dispositivos:** nombre, plataforma, versión, último uso, prefijo del token, botones Rotar/Revocar. Nota de reutilización: el PRD §3.14 ya pide "sesiones activas" en Cuenta. Es el mismo componente `<DeviceList />` con dos fuentes de datos — construirlo una vez.

### 5.5 Lo que el design system tiene que aportar (y hoy no tiene)

Estado verificado: `apps/web/src/components/ui` tiene **seis** primitivas (`button`, `card`, `input`, `label`, `select`, `textarea`) y `packages/ui` está vacío/roto.

Faltan, todas disponibles en shadcn (`new-york`, `baseColor: neutral`, ya configurado en `apps/web/components.json`): `tabs`, `dialog`, `alert-dialog`, `dropdown-menu`, `command` (para `⌘K`), `tooltip`, `popover`, `scroll-area`, `separator`, `badge`, `skeleton`, `sonner`, `resizable`, `collapsible`, `breadcrumb`. Es aproximadamente un día de trabajo, pero es un prerrequisito real, no un detalle.

Además, específico de esta feature:

- **Tokens de estado de sync**: `synced` / `pending` / `conflict` / `error` / `paused`, con color **y** forma/icono (no solo color: accesibilidad para daltonismo).
- **Escala tipográfica de lectura**: el Markdown renderizado necesita su propia escala (interlínea ~1.7, medida de línea ~68ch). Hoy no existe.
- **`prefers-reduced-motion`**: ya es regla de marca; las barras de progreso de sync y el spinner de "sincronizando" deben respetarla.
- **Estados vacíos con voz de marca**: "aún no tienes notas", "no hay huérfanas" — el principio "el fracaso reencauza" aplica también aquí; un conflicto de sync no debe redactarse como un error del usuario.
- **Componentes nuevos reutilizables**: `<KbConnectionCard />`, `<KbSyncBadge />`, `<KbDiffView />`, `<KbNoteCard />`, `<KbBacklinkList />`, `<KbStatTile />` (pulso), `<KbEmptyState />`.

---

## 6 · Brecha maqueta ↔ código

### 6.1 Lectura honesta

**La integración con Obsidian no se puede empezar. No por complejidad de la integración, sino porque no existe la cosa a integrar.**

Sincronizar una bóveda contra Kibo hoy es sincronizar contra `/dev/null`: no hay tabla de notas, no hay pantalla de Recursos, no hay editor, no hay backlinks, no hay motor de rachas ni libro mayor de XP. El PRD §4 dice que la fase F0 está *"ya cubierta por diseño"* porque Recursos usa el mismo modelo y formato. **Eso es falso a nivel de código.** F0 no está cubierta: está sin empezar. Está cubierta *en la maqueta*, que es un artefacto de diseño fuera de este repositorio.

### 6.2 Cadena de prerrequisitos, en orden de dependencia

| # | Prerrequisito | Estado hoy | Bloquea |
|---|---|---|---|
| 0 | Migraciones Prisma (`prisma migrate`, no `db push`) | ❌ No existe `migrations/` | Todo. Un sistema con cursores de cliente no tolera *schema drift* |
| 1 | CI mínima (typecheck + lint + build + test) | ❌ No existe `.github/` | Todo lo demás |
| 2 | Decisión web ↔ api + auth en `apps/api` | ❌ `apps/api` huérfano y sin auth | Toda la superficie de API (§2) |
| 3 | **Módulo Recursos nativo** (`Note`, `NoteLink`, editor, backlinks, búsqueda) | ❌ Cero entidades de contenido | F2 (espejo de bóveda) |
| 4 | Motor de rachas y XP (`Habit`, `Task`, racha global, `XpGrant`) | ❌ Solo existe `Attribute`/`UserAttribute` | F1 (plugin con racha/hábitos) y la gamificación de escritura |
| 5 | `packages/markdown` + `packages/sync-core` | ❌ No existen | F0 real (import/export) y todo lo demás |
| 6 | Especificación de Recursos exportada de la maqueta a `docs/specs/` | ❌ La maqueta vive en Claude Design | Implementar Recursos sin divergir del diseño |
| 7 | Design system con las ~15 primitivas faltantes | 🟡 6 de ~21 | Las pantallas de §5 |

**Hallazgo de secuenciación que contradice el orden del PRD:** el PRD propone F0 → F1 → F2. Pero **F1 y F2 dependen de prerrequisitos distintos y disjuntos**. F1 (el plugin que muestra racha, hábitos del día y "enviar nota a Kibo") necesita el **módulo de Hábitos y el motor de rachas** — no necesita Recursos. F2 (espejo bidireccional) necesita **Recursos completo** — no necesita hábitos. Hoy no existe ninguno de los dos, así que el orden real no lo dicta la integración: lo dicta **cuál módulo del núcleo se construya primero**. Esa es una decisión de roadmap de producto, no de arquitectura de integración.

### 6.3 Lo que SÍ se puede empezar hoy, y aporta valor real

No es "no hacer nada". Hay dos frentes con retorno inmediato y riesgo cero:

1. **`packages/markdown` + `packages/sync-core`.** Son TypeScript puro, sin base de datos, sin UI, sin API. Se pueden construir y probar en aislamiento **hoy**, con un corpus de conformidad. Y son precisamente la parte donde equivocarse tarde cuesta pérdida de datos: la función de canonicalización y hash es irreversible una vez que hay bóvedas vivas. Empezar por aquí es empezar por lo más barato de hacer bien y lo más caro de arreglar después.
2. **Congelar el modelo de datos de notas** (§1) en el esquema y en una migración, aunque la UI tarde meses. Es agnóstico a la dirección, no bloquea nada y da un objetivo estable a quien construya Recursos.

Y dos de higiene que cuestan horas: migraciones, CI, borrar los archivos basura de la raíz, y arreglar o eliminar `packages/ui`.

### 6.4 Una advertencia de producto que sale del código

El repositorio tiene 5 commits, el último es `docs: add minimal CLAUDE.md project context file`. El producto real —~40 pantallas— vive en Claude Design, fuera de control de versiones de este repo. Mientras esa asimetría exista, cualquier estimación de "cuánto falta para la integración" es especulativa, porque la especificación de Recursos que habría que implementar **no está en un formato que se pueda implementar**. Exportar las pantallas de Recursos e Integraciones a `docs/specs/` no es burocracia: es lo que convierte la maqueta en un encargo ejecutable.

---

## 7 · Recomendación

### 7.1 Orden de construcción

**Fase −1 · Higiene (2–3 días).** Migraciones Prisma en lugar de `db push`. `db:generate` en el grafo de Turbo. CI mínima en `.github/workflows/ci.yml`. Borrar `Clean`/`Launching`/`Old`/`Spawning`/`Waiting`. Arreglar o eliminar `packages/ui`. Poblar `packages/config`. Decidir formalmente la frontera `apps/web` ↔ `apps/api` **y escribirla en un ADR**.

**Fase 0 · Fundamentos de Markdown (1–2 semanas, arrancable HOY, en paralelo con todo).** `packages/markdown` y `packages/sync-core` con corpus de conformidad. Sin base de datos, sin UI. Es el trabajo con mejor relación valor/riesgo del plan entero.

**Fase 1 · Recursos nativo (4–6 semanas).** `Note`, `NoteLink`, `Tag` + migraciones. Editor CodeMirror 6. Lista, carpetas, tags, favoritas, backlinks, búsqueda FTS. Sin ninguna mención a Obsidian. **Aquí es donde Kibo gana o pierde**: si Recursos no es bueno por sí solo, sincronizarlo con una bóveda no lo arregla.

**Fase 2 · Import/export de bóveda (1 semana).** Subir un `.zip` de bóveda, ingerirlo, y exportar todo a Markdown. Es el 60% del valor percibido de "compatible con Obsidian" a menos del 5% del coste, no requiere plugin, no requiere emparejamiento y no puede corromper nada del usuario porque nunca escribe en su disco. **Recomiendo adelantarla explícitamente por delante del plugin.** El PRD la trata como piso mínimo; yo la trataría como el entregable de integración de la v1.

**Fase 3 · Gamificación de escritura (1–2 semanas, depende del motor de rachas).** `XpGrant`, `WritingActivity`, huérfanas → misiones de enlace, panel de pulso, cierre de racha. Bloqueada por el motor de rachas del núcleo, que no existe.

**Fase 4 · Emparejamiento + sync unidireccional (3–4 semanas).** Todo el aparato de `VaultLink`/`VaultDevice`/`SyncJournal`/`NoteFile`, endpoints de push/pull, pantalla de Integraciones. **Una sola dirección**, la que decida el ADR. Aquí nace `apps/obsidian-plugin` dentro del monorepo.

**Fase 5 · Bidireccional + conflictos (3–4 semanas más).** Reconciliación a tres bandas, `SyncConflict`, bandeja de resolución, detección de renombrados. **Solo si la Fase 4 lleva un trimestre estable con usuarios reales.**

**Publicación del plugin:** al final de la Fase 4, con extracción a repo público propio. Verificar antes los requisitos reales del catálogo de Obsidian (§3.4).

### 7.2 Las tres cosas que más me preocupan

**1 · La brecha maqueta ↔ código es más grande que la propia integración.** El producto vive en Claude Design; el repo tiene 6 modelos de identidad, un NestJS huérfano con un controlador roto, ni migraciones ni CI. Entre "hoy" y "la integración con Obsidian tiene sentido" hay 8–12 semanas de construir Kibo, no de construir la integración. El riesgo concreto no es técnico sino de asignación: que el esfuerzo de análisis y diseño se invierta en la integración mientras el módulo que la hace posible —Recursos— sigue sin empezar. **Mi postura: Recursos nativo primero, import/export después, sync mucho después.**

**2 · La canonicalización y el identificador estable son la clase de error que destruye datos y reputación.** Si `canonicalize()` difiere en un byte entre plugin y servidor —un BOM, un CRLF, un NFD— se produce un bucle de reescritura en la bóveda del usuario, y eso se cuenta en foros. Si no hay identificador estable, mover una nota con el explorador de archivos genera un duplicado. Y si `XpGrant` no es idempotente, el primer reintento de red infla la economía sin auditoría posible. Estos tres fallos comparten propiedad: **son silenciosos, se descubren tarde y no tienen arreglo retroactivo limpio.** Por eso `packages/sync-core` con su corpus dorado es lo primero que hay que construir, aunque nadie lo consuma en meses.

**3 · El alcance del sync bidireccional excede a esta integración, y hay que decidirlo como plataforma, no como feature.** El RF-08 del contexto maestro ya comprometió sync bidireccional con Google Tasks y MS To Do. O el motor de `SyncJournal`/cursores/conflictos es **uno solo** para todos los conectores, o Kibo mantendrá dos motores de sincronización con dos conjuntos de bugs. Ese es un ADR de plataforma que debería preceder al de Obsidian. Y encima del riesgo técnico hay uno de producto que el brief ya señala y que suscribo: **Sergio no usa Obsidian**, así que no tiene intuición para juzgar si el resultado es fiel a las expectativas de esa comunidad — que es exigente, local-first por convicción y especialmente sensible a que un tercero escriba en sus archivos. Antes de la Fase 5 hace falta un puñado de usuarios reales de Obsidian probando; sin eso, el bidireccional es una apuesta a ciegas sobre la parte más cara y más frágil del plan.
