# 13 · Ronda 2 — El plugin como conector delgado y la proyección de entidades tipadas

**Fecha:** 2026-08-08 · **Autor:** web-architect · **Tipo:** delta sobre `03-aterrizaje-monorepo.md` (ronda 1)
**Lee primero la ronda 1.** Aquí solo escribo lo que cambia, lo que se cancela y lo que aparece nuevo. Cuando algo sigue vigente, lo referencio (`R1 §x.y`) en vez de repetirlo.

---

## 0 · Qué cambia y qué sobrevive de la ronda 1

| Sección de R1 | Estado tras el nuevo encuadre |
|---|---|
| §0 Estado del repo | **Vigente sin cambios.** Los hallazgos siguen siendo los mismos. |
| §1.3 `Note`, `NoteLink`, `Tag` | **Vigente, pero deja de ser el centro.** `Note` pasa a ser *un* tipo de registro entre varios (§1 de aquí). |
| §1.5 `NoteFile` | **Se generaliza y se renombra** a `RecordProjection`. Mismo diseño, sujeto distinto. |
| §1.5 `SyncJournalEntry`, `SyncCursor`, `SyncRun`, `SyncConflict` | **Vigentes.** Solo cambia el sujeto (`recordId` en vez de `noteId`) y `SyncConflict` gana granularidad de campo. |
| §1.4 `VaultLink`, `VaultDevice`, `VaultPairingCode` | **Vigentes sin cambios.** |
| §1.6 `XpGrant`, `WritingActivity` | **Salen del camino crítico.** Siguen siendo necesarios para Recursos, ya no bloquean la integración. |
| §2 Superficie de API | **Vigente**, con un cambio de vocabulario (`/notes` → `/records`) y dos endpoints nuevos (§2 de aquí). |
| §3.2 `packages/sync-core` | **Vigente y más importante que antes.** Es lo único que se comparte con el plugin. |
| §3.3 `packages/markdown` | **Vigente, con reordenamiento de prioridades**: el serializador determinista de frontmatter pasa a ser la pieza #1; el parser de wikilinks baja a #2. |
| §3.4 Dónde vive el plugin | **Se refina** (§4 de aquí). |
| §4 Trabajos en segundo plano | **Vigente**, más dos jobs nuevos: `record.project` y `vault.scan`. |
| §5 Frontend | **Se recorta mucho.** Recursos deja de ser prerrequisito; aparecen las pantallas de mapeo. |
| §6 Cadena de prerrequisitos | **Se reescribe** (§6 de aquí). Es el cambio más grande. |
| §7 Orden de construcción | **Se reescribe.** |

**Lo que se cancela formalmente:** la fase **F1** del PRD §4 ("Plugin Kibo para Obsidian" con racha, hábitos del día y XP por escritura dentro de Obsidian). Requiere una corrección explícita en `docs/product/PRD-kibo.md` §4, junto con la métrica del §5 ("≥25% de usuarios de Recursos con bóveda vinculada"), que ya no mide adquisición sino interoperabilidad entre usuarios que ya son de Kibo. La métrica hay que re-derivarla; no es mi lane, pero queda señalada.

---

## 1 · Modelo de datos revisado: entidad tipada ↔ nota-registro

### 1.1 El problema que hay que resolver, dicho con precisión

Sincronizar notas es mover texto. Lo que ahora se pide es distinto: **serializar filas de una base de datos relacional a archivos Markdown, y deserializarlas de vuelta, sin perder información y de forma determinista**. Una consulta médica no es una nota que resulta estar en la base; es una fila con columnas tipadas, con una relación uno-a-muchos hacia recetas, y su representación en Markdown es una **proyección**, no su forma nativa.

Eso impone tres requisitos que el modelo de notas de R1 no cubría:

1. **Un sujeto uniforme de sincronización.** El diario de sync, los cursores, los conflictos y las proyecciones tienen que operar sobre "un registro", sin que a la maquinaria le importe si es una consulta médica, una receta o una nota libre. Si cada tabla de dominio lleva su propio `path`/`hash`/`rev`, el motor de sync deja de ser genérico y hay que reescribirlo por cada tipo nuevo.
2. **Relaciones que sobreviven al viaje de ida y vuelta.** `Prescription.visitId` es una clave foránea en Postgres. En la bóveda es `[[Consulta 2026-08-08 — Dermatología]]`. Al volver, ese wikilink tiene que resolver otra vez a la misma fila. **El wikilink es la clave foránea serializada** — y como toda serialización de referencia, necesita un identificador que no dependa del nombre del archivo.
3. **Preservación de lo que Kibo no entiende.** Si el usuario añade `revisado: true` al frontmatter de un archivo proyectado, Kibo debe devolverlo intacto en la siguiente escritura. Perder claves ajenas es el fallo que hace que la gente desinstale.

### 1.2 Decisión estructural: supertipo `DomainRecord` (class-table inheritance)

Evalué dos formas de expresarlo en Prisma:

| Enfoque | Cómo | Ventaja | Coste |
|---|---|---|---|
| **A. Registro de proyección polimórfico** | `EntityProjection(entityType, entityId, path, hash…)` sin FK real | Cero cambios en las tablas de dominio | **Sin integridad referencial.** Prisma no tiene relaciones polimórficas: no hay FK, no hay cascada, un borrado deja proyecciones colgadas. La consistencia depende de que nadie olvide un hook. |
| **B. Supertipo `DomainRecord` con FK 1:1 desde cada entidad** | `MedicalVisit.recordId @id` referencia `DomainRecord.id` | FKs reales, cascada real, `rev`/tombstone/`userId` en un solo sitio, motor de sync genuinamente genérico | Dos INSERT por alta (en una transacción) y un JOIN al leer |

**Elijo B.** El coste es un JOIN y una transacción; lo que compra es que `SyncJournalEntry`, `SyncCursor`, `RecordProjection` y `SyncConflict` funcionen para cualquier tipo futuro sin tocar una línea del motor. Con el enfoque A, la primera vez que se borre una consulta médica y quede su proyección huérfana apuntando a un archivo que ya nadie posee, el bug es imposible de encontrar.

**Efecto retroactivo sobre la ronda 1:** `Note` se convierte en un subtipo más, y `NoteFile` (R1 §1.5) se generaliza a `RecordProjection`. `NoteLink` (R1 §1.3) se generaliza a `RecordLink`. Es una simplificación, no una complicación: pasamos de dos maquinarias (una para notas, otra para entidades) a una sola.

```
DomainRecord ────────────────── el sujeto de la sincronización
   ├── Note              (NOTE)              ← nota libre; R1 §1.3 sigue aplicando
   ├── MedicalVisit      (MEDICAL_VISIT)
   ├── Prescription      (PRESCRIPTION)
   ├── JournalEntry      (JOURNAL_ENTRY)
   └── … (Task, Habit, ReadingSession…)

RecordProjection   DomainRecord × VaultLink → ruta, hash, rev, estado, extras
RecordLink         DomainRecord → DomainRecord  (la FK, y su forma serializada como wikilink)
```

### 1.3 El supertipo y su maquinaria

```prisma
enum RecordType {
  NOTE
  MEDICAL_VISIT
  PRESCRIPTION
  JOURNAL_ENTRY
  READING_SESSION
  TASK
  HABIT
}

/// Supertype for everything that can be projected to / ingested from a vault.
/// Every domain entity owns exactly one DomainRecord row (1:1, shared primary key).
model DomainRecord {
  id          String     @id @default(uuid())
  userId      String     @map("user_id")
  type        RecordType

  /// Human-facing label. Drives the default file name and the wikilink text.
  displayName String     @map("display_name")
  displayKey  String     @map("display_key")   // NFC + casefold; wikilink resolution fallback

  /// Optimistic concurrency token (R1 §2.6). Bumped on every domain mutation.
  rev         Int        @default(1)
  /// Hash of the canonical projected bytes for the DEFAULT profile.
  /// Used to skip no-op projections. NULL until first projection.
  projectedHash String?  @map("projected_hash")

  deletedAt   DateTime?  @map("deleted_at")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  note            Note?
  medicalVisit    MedicalVisit?
  prescription    Prescription?

  projections     RecordProjection[]
  outLinks        RecordLink[]  @relation("RecordOutLinks")
  inLinks         RecordLink[]  @relation("RecordInLinks")
  conflicts       SyncConflict[]
  journal         SyncJournalEntry[]

  @@index([userId, type, updatedAt(sort: Desc)])
  @@index([userId, displayKey])
  @@index([userId, deletedAt])
  @@map("domain_records")
}
```

```prisma
/// Replaces R1 §1.5 `NoteFile`. Same design, generalized subject.
model RecordProjection {
  id            String        @id @default(uuid())
  vaultLinkId   String        @map("vault_link_id")
  recordId      String        @map("record_id")
  profileId     String        @map("profile_id")

  path          String
  pathKey       String        @map("path_key")     // NFC + casefold (R1 §1.5: FS insensible a mayúsculas)

  /// Bytes as last written by Kibo / last read from the vault.
  localHash     String?       @map("local_hash")
  localMtime    DateTime?     @map("local_mtime")
  localSize     Int?          @map("local_size")

  /// Three-way reconciliation base (R1 §1.5).
  baseRev       Int           @default(0) @map("base_rev")
  baseHash      String?       @map("base_hash")

  /// Frontmatter keys Kibo does NOT own, preserved verbatim across round-trips.
  /// Losing these is the #1 way to break trust with an existing vault.
  extraFrontmatter   Json?    @map("extra_frontmatter")
  /// Emitted key order, so re-projection is byte-stable (see §1.6 determinism).
  frontmatterKeyOrder String[] @default([]) @map("frontmatter_key_order")
  /// Body sections Kibo does not map, preserved and re-emitted at the end.
  extraSections      Json?    @map("extra_sections")

  /// Mapping version used to produce the current bytes. A profile change
  /// makes this stale and schedules a re-projection.
  mappingVersion Int          @default(1) @map("mapping_version")

  state         NoteFileState @default(PENDING_PUSH)  // enum de R1 §1.2, reutilizado
  deletedAt     DateTime?     @map("deleted_at")
  lastSyncedAt  DateTime?     @map("last_synced_at")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  vaultLink     VaultLink         @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  record        DomainRecord      @relation(fields: [recordId],    references: [id], onDelete: Cascade)
  profile       ProjectionProfile @relation(fields: [profileId],   references: [id], onDelete: Cascade)

  @@unique([vaultLinkId, recordId])
  @@unique([vaultLinkId, pathKey])
  @@index([vaultLinkId, state])
  @@index([vaultLinkId, mappingVersion])
  @@map("record_projections")
}
```

```prisma
enum RecordLinkOrigin {
  FOREIGN_KEY   // derived from a real DB relation (Prescription -> MedicalVisit)
  WIKILINK      // authored by the user in note body / frontmatter
}

/// Generalizes R1 §1.3 `NoteLink`. A FK and a wikilink are the same edge
/// seen from two sides; both must round-trip.
model RecordLink {
  id            String           @id @default(uuid())
  userId        String           @map("user_id")

  sourceId      String           @map("source_id")
  targetId      String?          @map("target_id")     // NULL = unresolved (R1 §1.3: notas fantasma)

  targetKey     String           @map("target_key")
  targetRaw     String           @map("target_raw")
  /// Frontmatter key this edge is serialized into, when it came from a FK.
  /// e.g. "recetas" for MedicalVisit -> Prescription[]
  fieldKey      String?          @map("field_key")
  origin        RecordLinkOrigin @default(WIKILINK)
  kind          NoteLinkKind     @default(WIKILINK)    // enum de R1 §1.2
  occurrences   Int              @default(1)

  user          User          @relation(fields: [userId],   references: [id], onDelete: Cascade)
  source        DomainRecord  @relation("RecordOutLinks", fields: [sourceId], references: [id], onDelete: Cascade)
  target        DomainRecord? @relation("RecordInLinks",  fields: [targetId], references: [id], onDelete: SetNull)

  @@unique([sourceId, targetKey, fieldKey, kind])
  @@index([targetId])
  @@index([userId, targetKey])
  @@map("record_links")
}
```

`origin` es importante: los enlaces `FOREIGN_KEY` **se regeneran** en cada proyección desde la relación real y no se ingieren como texto libre; los `WIKILINK` se extraen del cuerpo y son autoridad del usuario. Mezclarlos haría que borrar una receta en la base no quitara el wikilink del archivo, o al revés.

### 1.4 El caso médico completo

```prisma
model MedicalVisit {
  /// Shared primary key with DomainRecord (class-table inheritance).
  recordId      String    @id @map("record_id")
  userId        String    @map("user_id")

  visitedAt     DateTime  @map("visited_at")
  specialty     String?
  providerName  String?   @map("provider_name")
  facility      String?
  followUpAt    DateTime? @map("follow_up_at")

  /// Long-form fields — projected as H2 sections, not frontmatter (§1.6).
  reason        String?   @db.Text
  diagnosis     String?   @db.Text
  indications   String?   @db.Text
  notes         String?   @db.Text

  /// Financial figure: EXCLUDED from projection by default (§1.8).
  cost          Decimal?  @db.Decimal(12, 2)
  currency      String?   @db.VarChar(3)

  record        DomainRecord   @relation(fields: [recordId], references: [id], onDelete: Cascade)
  prescriptions Prescription[]

  @@index([userId, visitedAt(sort: Desc)])
  @@index([userId, followUpAt])
  @@map("medical_visits")
}

model Prescription {
  recordId      String    @id @map("record_id")
  userId        String    @map("user_id")

  /// The FK that becomes a wikilink on projection, and resolves back on ingest.
  visitId       String?   @map("visit_id")

  drugName      String    @map("drug_name")
  dose          String?
  frequency     String?
  route         String?
  startsOn      DateTime? @db.Date @map("starts_on")
  endsOn        DateTime? @db.Date @map("ends_on")
  instructions  String?   @db.Text
  isActive      Boolean   @default(true) @map("is_active")

  record        DomainRecord  @relation(fields: [recordId], references: [id], onDelete: Cascade)
  visit         MedicalVisit? @relation(fields: [visitId],  references: [recordId], onDelete: SetNull)

  @@index([userId, isActive, endsOn])
  @@index([visitId])
  @@map("prescriptions")
}
```

### 1.5 El perfil de proyección (la "capa de mapeo")

Esto es lo que convierte una fila en bytes, y es **datos, no código**. Tiene que ser una tabla porque (a) el usuario lo edita en una pantalla, (b) hay que versionarlo para saber qué archivos hay que reescribir cuando cambia, (c) el mismo motor sirve para exportar e importar.

```prisma
enum ProjectionDirection {
  EXPORT_ONLY     // Kibo writes the file; ingest ignored
  IMPORT_ONLY     // Kibo reads the file; never writes
  BIDIRECTIONAL
}

enum FieldTarget {
  FRONTMATTER     // scalar / list -> YAML key
  SECTION         // long text -> "## Heading" block
  BODY            // long text -> whole body (only one field may claim this)
  LINK            // relation -> wikilink (single or list)
  IGNORED
}

model ProjectionProfile {
  id              String              @id @default(uuid())
  vaultLinkId     String              @map("vault_link_id")
  recordType      RecordType          @map("record_type")

  enabled         Boolean             @default(false)
  direction       ProjectionDirection @default(EXPORT_ONLY)

  /// Handlebars-ish templates evaluated against the record. Deterministic,
  /// no free expressions — a fixed allowlist of tokens.
  folderTemplate    String @map("folder_template")     // "Salud/Consultas/{{visitedAt:yyyy}}"
  fileNameTemplate  String @map("file_name_template")  // "{{visitedAt:yyyy-MM-dd}} — {{specialty}}"

  /// Tags Kibo always stamps, so Dataview/Bases can select the record set.
  stampTags       String[] @default([]) @map("stamp_tags")   // ["salud/consulta"]

  /// Bumped on every edit. Stale RecordProjection rows get re-projected.
  version         Int      @default(1)

  /// Whether Kibo may rewrite the file when the record changes.
  /// false => the file is written once and then left alone.
  rewriteOnChange Boolean  @default(true) @map("rewrite_on_change")

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  vaultLink       VaultLink          @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  fieldMaps       ProjectionFieldMap[]
  projections     RecordProjection[]

  @@unique([vaultLinkId, recordType])
  @@map("projection_profiles")
}

model ProjectionFieldMap {
  id            String      @id @default(uuid())
  profileId     String      @map("profile_id")

  /// Dotted path into the entity: "visitedAt", "prescriptions[].displayName".
  entityField   String      @map("entity_field")
  /// Key in the vault: frontmatter key or section heading.
  vaultKey      String      @map("vault_key")
  target        FieldTarget @default(FRONTMATTER)

  /// Declarative, closed set: "iso_date" | "date:<fmt>" | "list" | "string"
  /// | "number" | "bool" | "wikilink" | "wikilink_list". NO arbitrary code.
  transform     String      @default("string")

  required      Boolean     @default(false)
  /// Ordering of emitted frontmatter keys — determinism (§1.6).
  sortIndex     Int         @default(0) @map("sort_index")

  profile       ProjectionProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@unique([profileId, vaultKey])
  @@unique([profileId, entityField])
  @@map("projection_field_maps")
}
```

`transform` es un **conjunto cerrado de transformaciones declarativas**, deliberadamente no un lenguaje. En cuanto se admite una expresión arbitraria, el motor de proyección deja de ser auditable, deja de ser determinista y se convierte en superficie de ejecución de código del usuario. Un enum de 8 valores cubre el 95% de los casos reales; el 5% restante se resuelve añadiendo un valor al enum, con revisión.

### 1.6 Cómo se ve la proyección (el caso médico, end-to-end)

**Kibo → bóveda.** `Salud/Consultas/2026/2026-08-08 — Dermatología.md`:

```markdown
---
kibo-id: 9f2c1d84-3b77-4a10-8e2f-0c5db1a77e01
kibo-type: medical_visit
kibo-rev: 3
fecha: 2026-08-08
especialidad: Dermatología
medico: Dra. Ana Ruiz
lugar: Clínica Del Valle
seguimiento: 2026-09-05
recetas:
  - "[[Receta — Isotretinoína 20 mg]]"
tags:
  - salud/consulta
revisado: true
---

## Motivo
Revisión de brote persistente en zona mandibular.

## Diagnóstico
Acné nodular moderado.

## Indicaciones
Suspender exfoliantes. Fotoprotección diaria.

## Notas
Llevar biometría hemática a la cita de seguimiento.
```

`revisado: true` es una clave que el usuario añadió a mano: **no está en el perfil de mapeo**, vive en `RecordProjection.extraFrontmatter` y se re-emite en su posición original en cada reescritura.

**El pago**, que es la razón entera de hacer esto — en la bóveda, sin que Kibo construya nada:

```dataview
TABLE especialidad AS "Especialidad", medico AS "Médico", seguimiento AS "Seguimiento"
FROM #salud/consulta
WHERE seguimiento >= date(today)
SORT fecha DESC
```

> **Nivel de evidencia:** que Dataview consulta frontmatter de esta forma es un hecho de alta confianza. Obsidian tiene además una vista de base de datos nativa más reciente (*Bases*); **no verifico aquí su sintaxis ni su disponibilidad** — hay que confirmarlo contra la documentación oficial antes de prometerlo en materiales de producto. Mantengo la política de la ronda 1: no invento citas.

**Bóveda → Kibo (ingesta).** El orden de resolución de identidad, de más fuerte a más débil:

1. `kibo-id` en el frontmatter → resuelve exacto a `DomainRecord.id`. **En archivos proyectados esta clave siempre está**, así que el caso normal es exacto.
2. `RecordProjection.pathKey` → resuelve por ruta conocida (cubre archivos que el usuario editó sin tocar el frontmatter).
3. `DomainRecord.displayKey` → resuelve por nombre (cubre archivos preexistentes en la primera importación).
4. Nada resuelve → **registro nuevo**, sujeto a validación del perfil.

Y el enlace `recetas: ["[[Receta — Isotretinoína 20 mg]]"]` se resuelve por el mismo orden hasta obtener un `DomainRecord.id`, que es lo que se escribe en `Prescription.visitId`. **Ese es el wikilink funcionando como clave foránea, de ida y de vuelta.**

**Reglas de determinismo — no negociables** (misma familia de argumentos que R1 §5.3 y §3.2: si el hash cambia sin que el usuario escriba, se produce un bucle de reescritura):

- Emisor YAML con versión y opciones fijadas: sin ajuste de línea, comillas por regla explícita, fechas ISO 8601, `null` omitido en vez de emitido.
- Orden de claves: primero las `kibo-*`, luego las del perfil por `sortIndex`, luego las extras en el orden que traía el archivo (`frontmatterKeyOrder`).
- Secciones: las mapeadas en el orden del perfil; las no reconocidas al final, textualmente.
- Salto de línea final, LF, sin BOM. Normalización NFC.
- **Cualquier cambio en el emisor es cambio de versión mayor con reproyección completa programada.** No se "arregla el formato" en caliente.

### 1.7 Propiedad del archivo: la regla que resuelve la tensión con el PRD

El PRD §4 prohíbe "meter metadata gamificada en el frontmatter del usuario" (promesa de archivos limpios). En la ronda 1 (§1.7) señalé que eso choca con la necesidad de un identificador estable. Con el nuevo encuadre, la tensión se disuelve porque hay **dos clases de archivo con dos políticas distintas**:

| Clase | Qué es | Frontmatter | Cuerpo | Identidad |
|---|---|---|---|---|
| **A · Nota libre** | La escribió el usuario. `DomainRecord.type = NOTE` | **Del usuario.** Kibo no escribe nada | Del usuario | Sidecar `.kibo/index.json`, o `kibo-id` opcional (R1 §1.7) |
| **B · Nota-registro** | La generó Kibo desde una entidad tipada | **De Kibo.** `kibo-id`/`kibo-type`/`kibo-rev` + campos del perfil + extras preservadas | **Del usuario** (mapeado a campos de texto largo) | `kibo-id` siempre presente |

La promesa de "archivos limpios" sigue en pie **para las notas del usuario**, que es donde importa. Un archivo generado por Kibo lleva frontmatter porque el frontmatter *es su contenido útil* — sin él, Dataview no puede consultarlo y la integración no sirve para nada. **El PRD debe recoger esta distinción explícitamente**; hoy la regla está escrita como si aplicara a todo.

Consecuencia directa para conflictos: el `SyncConflict` de R1 §1.5 gana granularidad.

```prisma
enum ConflictScope {
  FRONTMATTER_FIELD   // un campo propiedad de Kibo fue editado a mano en la bóveda
  BODY_SECTION        // texto libre divergente
  WHOLE_FILE          // no se pudo alinear
}

model SyncConflict {
  // ... campos de R1 §1.5 ...
  scope       ConflictScope @default(WHOLE_FILE)
  fieldKey    String?       @map("field_key")     // "seguimiento", "## Diagnóstico"
  recordId    String        @map("record_id")     // era noteId en R1
}
```

Por qué importa: si el usuario cambia `seguimiento: 2026-09-05` a `2026-09-12` en la bóveda, eso **no es un conflicto** en modo bidireccional — es una intención de actualizar el registro, y se aplica como tal (validando el tipo). Solo hay conflicto si Kibo también lo cambió desde la última base común. Con conflictos a nivel de archivo, cada edición manual del frontmatter sería un conflicto de texto completo y la función sería inusable.

### 1.8 Dominios sensibles: no proyectar por defecto

`MedicalVisit.cost` y todo el módulo de Finanzas quedan **excluidos de la proyección por defecto**. La regla que propongo, expresada en el modelo: un `ProjectionProfile` nace con `enabled = false`, y los campos financieros nacen con `target = IGNORED`. Proyectar salud o dinero a archivos planos en el disco del usuario es una decisión que el usuario debe tomar activamente, viendo qué campos salen. Es coherente con la constitución (Art. 3, Art. 9) y con el hecho de que los `.md` de una bóveda acaban con frecuencia en Dropbox, iCloud o un repo de git.

---

## 2 · Dónde corre la proyección y la ingesta

**Veredicto: en el servidor. Sin matices en la parte que importa.** El plugin transporta bytes y eventos de archivo, y no sabe qué es una consulta médica.

Argumentos, en orden de peso:

1. **No puedes arreglar el plugin rápido.** Es la restricción de R1 §3.4: publicar una versión del plugin tiene latencia de días o semanas, y convivirás con versiones viejas durante meses. Si el motor de proyección vive en el cliente, un fallo de mapeo que corrompe archivos es **irreparable a corto plazo**, y peor: distintas versiones del plugin producirían bytes distintos para el mismo registro, con hashes distintos, y los usuarios con dos máquinas verían sus archivos oscilando. En el servidor, un fallo se arregla y se reproyecta esa tarde.
2. **Determinismo con un solo emisor.** Es el argumento de R1 §3.2 elevado: el hash tiene que coincidir siempre. La forma barata de garantizarlo es que **solo exista un emisor de bytes en todo el sistema**. Con proyección en servidor, el plugin nunca genera contenido — solo lo escribe tal cual llega y calcula su hash. Cero superficie de divergencia.
3. **La proyección necesita la base de datos.** `recetas: ["[[Receta — …]]"]` exige resolver una relación uno-a-muchos, obtener el `displayName` de cada receta y comprobar que están proyectadas. El plugin no tiene esos datos y dárselos significaría replicar el modelo relacional en el cliente.
4. **La ingesta es más difícil que la proyección** y es toda lógica de dominio: validación de tipos, coerción, resolución de identidad en cuatro niveles (§1.6), detección de conflicto contra el estado actual, y reporte de errores comprensibles. Nada de eso quiere estar en un plugin.
5. **Mínimo privilegio** (Art. 9): el plugin nunca necesita entender la semántica de datos médicos. Mueve bytes opacos. Reduce la superficie de un componente que corre en la máquina del usuario.

**Lo que sí corre en el plugin, y es todo:** `packages/sync-core` (R1 §3.2) — normalización de rutas, `canonicalize()` + hash, filtros de alcance, codificación de cursores. Es exactamente para lo que existe ese paquete. `packages/markdown` y el motor de proyección **no se envían al plugin**; son server-only.

**La concesión honesta:** con proyección en servidor, editar un registro en Kibo y verlo aparecer en la bóveda tarda un ciclo de sync (30–60 s con polling). Es aceptable: el plugin es un conector, no una superficie de producto; Obsidian sigue funcionando sobre archivos planos mientras tanto; y nadie espera latencia de milisegundos de una sincronización de carpetas. Si algún día molesta, se resuelve con un canal de notificación servidor→cliente (SSE/WebSocket, R1 §2.7), no moviendo el motor al cliente.

---

## 3 · Alcance real del plugin conector

### 3.1 Lista cerrada de responsabilidades

| # | Responsabilidad | Detalle |
|---|---|---|
| 1 | **Emparejar** | Pegar el código de 12 caracteres, llamar a `POST /pairing/claim` (R1 §2.3), guardar el token en los datos del plugin. Ante `401`, mostrar "vuelve a conectar". |
| 2 | **Observar la bóveda** | Eventos `create` / `modify` / `delete` / `rename` filtrados por `scopeFolders` e `ignoreGlobs`, con *debounce* de ~2 s. |
| 3 | **Hashear y decidir** | `sync-core`: normalizar ruta, calcular hash canónico, comparar con el estado local, descartar lo que no cambió. |
| 4 | **Empujar** | Lotes a `POST /vaults/:id/changes` con `Idempotency-Key`, reintento con backoff exponencial, respeto de `429`/`Retry-After`. |
| 5 | **Traer y escribir** | `GET /changes?since=`, `POST /records/batch-get`, escritura **atómica** (archivo temporal + rename), creación de carpetas, aplicación de borrados y renombrados. |
| 6 | **Estado local** | `path → recordId → hash` en el almacén de datos del plugin. Es lo que permite reanudar sin resincronizar todo. |
| 7 | **Supresión de eco** | Tras escribir un archivo, ignorar el evento `modify` que dispara esa misma escritura. **Sin esto no hay producto** (§3.3). |
| 8 | **Pestaña de ajustes** | Estado de la bóveda, carpetas en alcance, intervalo, "Sincronizar ahora", "Desconectar", registro de las últimas operaciones. |
| 9 | **Indicador en la barra de estado** | Un icono y un tooltip: inactivo / sincronizando / error / N conflictos. **Es la única superficie visible, y es deliberadamente mínima.** |
| 10 | **Obedecer al servidor** | `status: PAUSED` → dejar de escribir. `minClientVersion` → avisar y detenerse. Es el interruptor de emergencia de R1 §3.4. |
| 11 | **Escribir el archivo perdedor de un conflicto** | `Nombre (conflicto 2026-08-08).md` y reportarlo. **No resuelve nada**: la resolución ocurre en la web de Kibo. |
| 12 | **Comando "Abrir en Kibo"** | Abre la URL del registro en el navegador. Tres líneas. No es UI de producto; es un enlace. |

### 3.2 Lista explícita de lo que el plugin NO hace

Racha · HP · hábitos del día · XP por escritura · monedas o gemas · KIBO · logros · cualquier tablero · editor propio · resolución de conflictos · renderizado de contenido de Kibo · creación de entidades tipadas desde Obsidian (una consulta médica se crea escribiendo el archivo con el frontmatter correcto, no con un formulario dentro de Obsidian).

### 3.3 Cuánto código es, honestamente

| Componente | LOC estimadas (TS) |
|---|---|
| Emparejamiento + almacenamiento del token | ~150 |
| Observación de eventos, debounce, filtro de alcance | ~200 |
| Estado local (persistencia, migración de formato) | ~200 |
| Bucle de push (lotes, reintentos, idempotencia) | ~350 |
| Bucle de pull (aplicar cambios, escritura atómica, renombrados, borrados) | ~400 |
| Supresión de eco y anti-bucle | ~120 |
| Escritura de archivo de conflicto | ~80 |
| Pestaña de ajustes | ~300 |
| Barra de estado, avisos, traducción de códigos de error | ~150 |
| `manifest.json`, esbuild, script de release | ~100 |
| **Total** | **≈ 2,050 LOC** |

Más pruebas: **≈ 2,500–3,000 LOC**. Como referencia de escala, es del orden de un módulo mediano de `apps/web`.

**Pero el tiempo no es proporcional a las líneas.** Estimo **3–4 semanas** de una persona, y el reparto no es el que sugiere la tabla: el 60% del esfuerzo se va en cuatro trampas conocidas.

1. **Supresión de eco.** Cuando el plugin escribe un archivo, Obsidian dispara `modify` sobre ese archivo. Si el plugin lo trata como cambio del usuario, lo reenvía al servidor, el servidor responde, el plugin reescribe, y el bucle no se detiene nunca. La solución (una lista de "escrituras propias en vuelo" indexada por ruta + hash esperado, con ventana temporal) es corta pero hay que acertarla y probarla explícitamente.
2. **Escritura atómica multiplataforma.** Escribir a temporal y renombrar es lo correcto, pero en Windows el rename sobre un archivo abierto falla, y Obsidian puede tenerlo abierto. Hay que manejar reintento y el caso "el usuario lo tiene abierto y editando".
3. **Sistemas de archivos insensibles a mayúsculas y normalización Unicode.** Ya está en R1 §1.5 como decisión de esquema; en el plugin es código real: macOS entrega NFD, la ruta que mandó el servidor viene en NFC, y `Café.md` no se puede crear si ya existe `café.md`.
4. **Primer arranque con una bóveda grande.** Indexar 5,000 archivos y hashearlos sin congelar la interfaz de Obsidian exige trocear el trabajo y ceder el hilo. Es donde se rompen los plugins mal hechos.

Nada de esto es incierto: es trabajo conocido y acotado. Solo hay que presupuestarlo.

---

## 4 · Dónde vive el plugin (revisión de R1 §3.4)

La recomendación de R1 se mantiene en la forma, y **el nuevo encuadre la refuerza y adelanta el momento de extraerlo**:

**Mantengo:** desarrollo inicial en `apps/obsidian-plugin` dentro del monorepo, extracción a repo propio después. Los argumentos de R1 §3.4 sobre el ciclo de release (repo público, GitHub Release con tag = `version`, revisión manual de alta, convivencia con versiones viejas) siguen intactos — no dependían de qué hiciera el plugin.

**Cambia el disparador de la extracción.** En R1 dije "al primer release público". Ahora: **al congelar la v1 del protocolo de cable** (`packages/sync-core/src/contracts`). Razón: siendo un conector delgado, su superficie de cambio es el protocolo, no el producto. En cuanto el protocolo se estabiliza, la co-evolución con el monorepo deja de aportar y la separación deja de doler. Ese momento llega ahora **antes** que la publicación, porque el plugin ya no persigue funcionalidad de producto.

**Aparece una opción nueva que antes no tenía sentido y ahora es la más atractiva para el piloto.** Como Obsidian **ya no es canal de adquisición** (punto 3 del encuadre), el catálogo de la comunidad deja de ser el objetivo. Eso permite:

| Vía de distribución | Repo público obligatorio | Latencia de publicación | Alcance | Cuándo |
|---|---|---|---|---|
| **Instalación manual** (zip con `main.js` + `manifest.json`) | No | Cero | Usuarios que Kibo guía paso a paso | **Piloto** |
| **BRAT** (instalador comunitario de plugins beta desde GitHub) | Sí | Cero | Early adopters | Beta |
| **Catálogo de la comunidad** | Sí | Días o semanas + revisión | Todos | Solo si alguna vez interesa la visibilidad |

**Recomendación concreta:** empezar con **instalación manual guiada desde la pantalla de Integraciones de Kibo**, que además es coherente con "esto es interoperabilidad para usuarios de Kibo, no un anzuelo". Eso elimina de golpe el requisito de repo público, la revisión manual y su latencia — es decir, **elimina el principal argumento de la ronda 1 para separar el repo**. Con eso, el plugin puede vivir cómodamente en el monorepo **más tiempo del que dije en R1**, y la extracción pasa a ser opcional, disparada por la decisión de publicar en el catálogo, no por el calendario de ingeniería.

> **A verificar antes de comprometerse:** que la instalación manual de plugins sin catálogo es un flujo soportado y documentado por Obsidian, y las condiciones exactas de BRAT. Alta confianza, sin verificación en esta sesión (misma política que R1 §3.4).

---

## 5 · La capa de mapeo para bóvedas existentes

Es, coincido, el momento más difícil del onboarding. Y la primera recomendación es de producto, no de arquitectura: **separar radicalmente los dos casos**, porque hoy están mezclados bajo la palabra "importar".

| Caso | Dificultad | Cuándo |
|---|---|---|
| **Bóveda nueva o carpeta nueva.** Kibo proyecta a `Salud/Consultas/…` con su propio formato. Cero mapeo. | Trivial | **Es el camino por defecto.** Debe poder completarse en 3 clics |
| **Bóveda existente con estructura propia.** Hay que descubrir el esquema implícito del usuario y alinearlo con el de Kibo | Alta | Opcional, avanzado, se puede saltar |

Si el segundo caso bloquea el primero en el onboarding, la feature no la usa nadie. **El mapeo tiene que ser opcional y saltable.**

### 5.1 Modelo de datos del descubrimiento

```prisma
model VaultScan {
  id            String    @id @default(uuid())
  vaultLinkId   String    @map("vault_link_id")

  startedAt     DateTime  @default(now()) @map("started_at")
  finishedAt    DateTime? @map("finished_at")
  fileCount     Int       @default(0) @map("file_count")
  withFrontmatter Int     @default(0) @map("with_frontmatter")
  status        SyncRunStatus @default(RUNNING)   // enum de R1 §1.2

  vaultLink     VaultLink @relation(fields: [vaultLinkId], references: [id], onDelete: Cascade)
  keys          VaultKeyStat[]
  clusters      VaultCluster[]

  @@index([vaultLinkId, startedAt(sort: Desc)])
  @@map("vault_scans")
}

/// One row per distinct frontmatter key found in the vault.
model VaultKeyStat {
  id            String   @id @default(uuid())
  scanId        String   @map("scan_id")

  key           String
  occurrences   Int
  /// Inferred from the sample: "date" | "string" | "number" | "bool" | "list" | "wikilink" | "mixed"
  inferredType  String   @map("inferred_type")
  sampleValues  Json     @map("sample_values")   // up to 5, for the mapping UI
  folderHints   String[] @default([]) @map("folder_hints")
  nullRatio     Float    @default(0) @map("null_ratio")

  scan          VaultScan @relation(fields: [scanId], references: [id], onDelete: Cascade)

  @@unique([scanId, key])
  @@index([scanId, occurrences(sort: Desc)])
  @@map("vault_key_stats")
}

/// A candidate group of files that look like the same "type" of record.
model VaultCluster {
  id            String      @id @default(uuid())
  scanId        String      @map("scan_id")

  label         String                          // "43 archivos en Salud/ con clave 'medico'"
  fileCount     Int         @map("file_count")
  /// Why they were grouped: folder / tag / key-signature
  signal        String
  keySignature  String[]    @default([]) @map("key_signature")
  samplePaths   String[]    @default([]) @map("sample_paths")

  suggestedType RecordType? @map("suggested_type")
  confidence    Float       @default(0)

  scan          VaultScan   @relation(fields: [scanId], references: [id], onDelete: Cascade)

  @@index([scanId, fileCount(sort: Desc)])
  @@map("vault_clusters")
}
```

El escaneo es **estrictamente de solo lectura**: el plugin envía rutas, hashes y frontmatter (no cuerpos completos, para no subir la bóveda entera antes de que el usuario haya decidido nada), y el servidor infiere. Es una promesa que hay que hacer explícita en la UI: *"Kibo va a leer los encabezados de tus notas para proponerte un mapeo. No escribe nada todavía."*

La agrupación (`VaultCluster`) usa tres señales, en este orden: **carpeta** (`Salud/Consultas/*`), **tag o valor de `type:`**, y **firma de claves** (conjunto de claves de frontmatter que coaparecen). No hace falta nada más sofisticado; las bóvedas reales son consistentes consigo mismas.

### 5.2 Pantallas en `apps/web`

```
apps/web/src/app/(app)/settings/integrations/obsidian/
  connect/
    page.tsx                    # 1. emparejar (R1 §5.4)
    scope/page.tsx              # 2. elegir carpetas en alcance
  mapping/
    page.tsx                    # 3. resultado del escaneo: grupos detectados
    [clusterId]/page.tsx        # 4. tabla de mapeo de campos
    preview/page.tsx            # 5. simulacro: 5 registros y 1 archivo de ejemplo
  projections/page.tsx          # perfiles activos por tipo (qué exporta Kibo y a dónde)
  conflicts/…                   # R1 §5.4, sin cambios
```

**Paso 3 — grupos detectados.** Tarjetas: *"43 archivos en `Salud/` comparten las claves `fecha`, `medico`, `especialidad`. ¿Son consultas médicas?"* con botones **Sí / No / Otro tipo / Ignorar**. El usuario confirma o descarta; no rellena nada todavía.

**Paso 4 — tabla de mapeo.** Es la pantalla clave, y es una tabla de tres columnas:

| Tu bóveda | Transformación | Campo de Kibo |
|---|---|---|
| `medico` · texto · *"Dra. Ana Ruiz", "Dr. Peña"* (43/43) | texto | **Médico** ▾ |
| `fecha` · fecha · *"2026-08-08"* (43/43) | fecha ISO | **Fecha de consulta** ▾ |
| `dx` · texto · *"Acné nodular"* (39/43) | texto | **Diagnóstico** ▾ |
| `costo` · número · *850* (12/43) | — | **Ignorar** ▾ *(campo financiero, §1.8)* |
| `revisado` · booleano (43/43) | — | **Conservar sin mapear** ▾ |

Requisitos de esta pantalla, todos derivados de errores conocidos en herramientas de importación:
- **Muestras reales visibles siempre.** Nadie puede mapear `dx` sin ver que contiene "Acné nodular".
- **Cobertura visible** (`39/43`): avisa de que 4 archivos van a quedar con el campo vacío, antes de importar.
- **Tres destinos, no dos:** mapear · ignorar · **conservar sin mapear** (va a `extraFrontmatter`, §1.3). La tercera opción es la que evita que el usuario sienta que Kibo le va a comer datos.
- **Campos obligatorios de Kibo sin origen** → bloqueo con explicación, no error genérico.
- **Nada es irreversible sin previsualización.**

**Paso 5 — simulacro.** Dos paneles: a la izquierda, cinco registros tal como quedarían en Kibo; a la derecha, el diff de un archivo real *antes* y *después* de que Kibo lo reescriba. Más un contador de filas que fallan validación, con el detalle. **Esta pantalla es la que convierte una importación aterradora en una decisión informada**, y es la que yo priorizaría si hubiera que recortar alcance en otro sitio.

**Confirmación con ventana de deshacer.** La importación se registra como un `SyncRun` (R1 §1.5) reversible durante 24 h: revertir borra los registros creados y restaura los archivos a su hash previo, que está guardado en `RecordProjection.baseHash`. Es caro de implementar (hay que guardar los bytes anteriores, no solo el hash) pero es lo que permite decir "puedes deshacerlo" en el momento en que el usuario más miedo tiene.

**Editor de perfiles permanente** (`projections/page.tsx`): qué tipos exporta Kibo, a qué carpeta, con qué plantilla de nombre. Con una advertencia dura: **cambiar un mapeo sube `ProjectionProfile.version` y reescribe archivos ya existentes en la bóveda.** Debe mostrar cuántos archivos se van a reescribir antes de guardar.

### 5.3 Postura honesta sobre esta capa

Esto es **inferencia de esquema**, y la inferencia de esquema no se resuelve con ingenio: se resuelve con buena UX de confirmación. No prometas mapeo automático. Propón, muestra evidencia, deja confirmar. Y ofrece **presets** para dos o tres convenciones difundidas (P.A.R.A., Daily Notes) que cubren una parte de los casos sin tabla de mapeo.

Estimación honesta de esta capa completa (escaneo + agrupación + 3 pantallas + simulacro + deshacer): **3–4 semanas**. Es tanto como el plugin entero. Por eso va en una fase posterior y detrás de una bandera de función.

---

## 6 · Cadena de prerrequisitos y orden de construcción, revisados

### 6.1 La respuesta a la pregunta clave: no, la proyección no depende de Recursos

Lo evalué explícitamente y el resultado cambia el plan.

Para proyectar una consulta médica a la bóveda hace falta: `DomainRecord`, `RecordProjection`, `ProjectionProfile`, el motor de proyección, `VaultLink`/`VaultDevice`/emparejamiento, `SyncJournalEntry`/`SyncCursor`, el plugin, y **al menos una entidad tipada**.

**No hace falta nada de esto:** `Note`, el editor CodeMirror, los backlinks, la búsqueda de texto completo, el panel de pulso, las notas huérfanas, las misiones de enlace, el motor de rachas, `XpGrant`, `WritingActivity`, ni la pantalla de Recursos.

Con la F1 cancelada, **el motor de rachas y XP sale del camino crítico de la integración por completo** — confirmado. Y con la proyección desacoplada de las notas libres, **Recursos también sale del camino crítico de la integración**. Recursos sigue siendo importante para el producto; ya no es un prerrequisito de esto.

**Pero hay un prerrequisito nuevo que antes no existía: tiene que existir al menos un módulo de dominio tipado, y hoy no existe ninguno.** No hay `MedicalVisit`, ni `Task`, ni `Habit`, ni `JournalEntry`. El esquema tiene seis modelos de identidad y atributos (R1 §0). El camino más corto a valor demostrable no es "construir la proyección": es **construir un módulo tipado y proyectarlo en la misma tanda**.

### 6.2 Dos pistas independientes

El nuevo encuadre parte el trabajo en dos caminos que ya no se bloquean entre sí:

| | **Pista A — Registros** | **Pista B — Notas** |
|---|---|---|
| Sujeto | Entidades tipadas → notas-registro | Notas libres |
| Necesita | `DomainRecord`, proyección, perfiles, plugin | `Note`, editor, backlinks, FTS, Recursos |
| Frontend | Solo Integraciones + mapeo | Módulo Recursos completo (R1 §5.2, §5.3) |
| Riesgo de destruir datos | **Bajo** en modo exportación: escribe archivos que Kibo posee, en una carpeta que Kibo eligió | Alto: toca notas que escribió el usuario |
| Encaja con el modelo mental de Sergio | **Sí, directamente** | Parcialmente |
| Camino a valor demostrable | **Corto** | Largo |

La Pista A es más corta, más segura y es la que responde literalmente a lo que Sergio describió. **Es la que hay que hacer primero.** Y tiene una propiedad que conviene subrayar: **en modo exportación pura, es imposible que destruya datos del usuario**, porque Kibo solo escribe en archivos que él mismo creó, en una carpeta que él mismo eligió, y nunca lee ni modifica nada más. Eso permite ponerla en manos de usuarios reales mucho antes que cualquier cosa bidireccional.

### 6.3 Orden de construcción revisado

**Fase −1 · Higiene (2–3 días).** Sin cambios respecto a R1 §7.1: migraciones Prisma en vez de `db push`, `db:generate` en el grafo de Turbo, CI mínima, limpiar la basura de la raíz, arreglar o borrar `packages/ui`, poblar `packages/config`, y el ADR de la frontera `apps/web` ↔ `apps/api`.

**Fase 0 · `sync-core` + `markdown` (1–2 semanas, arrancable hoy).** Sin cambios de contenido respecto a R1 §3.2/§3.3, **con reordenamiento de prioridades**: primero el serializador determinista de frontmatter + el mapa de secciones + `canonicalize()`; después el parser de wikilinks. La razón es que la Pista A necesita el serializador y no necesita el parser todavía.

**Fase 1 · Vertical de proyección (4–6 semanas). ⭐ El nuevo camino más corto a valor.**
Un módulo tipado + `DomainRecord` + `RecordProjection` + `ProjectionProfile` + motor de proyección + emparejamiento + plugin conector, **en una sola dirección: Kibo → bóveda**.
Qué módulo elegir: **el que ya toque por hoja de ruta de producto**, no uno construido solo para demostrar la proyección. Si Salud está en la hoja de ruta, el caso médico es un excelente candidato porque exhibe los tres elementos difíciles a la vez (campos tipados, texto largo en secciones, y una relación uno-a-muchos que viaja como wikilink). Si Salud no está en la hoja de ruta, **Diario es la vertical más barata** (fecha, ánimo, gratitud, texto libre) y encaja de forma natural con las daily notes.
Entregable observable: el usuario registra una consulta en Kibo y a los 30 segundos hay un `.md` en su bóveda que Dataview puede consultar. **Eso es toda la tesis del proyecto, demostrada.**

**Fase 2 · Ingesta de notas-registro (2–3 semanas).** El mismo tipo de entidad, ahora de vuelta: parseo, validación, resolución de identidad en cuatro niveles (§1.6), conflictos a nivel de campo (§1.7). Ya es bidireccional, pero **acotado a los archivos que Kibo generó** — un dominio pequeño, conocido y con frontmatter garantizado. Es el escalón intermedio correcto antes de tocar notas ajenas.

**Fase 3 · Segundo y tercer tipo proyectable (1 semana cada uno).** Si la Fase 1 se hizo bien, añadir un tipo es rellenar un `ProjectionProfile` y escribir el mapeo. **Es la prueba de que la generalización de §1.2 valió la pena**; si añadir el segundo tipo cuesta más de una semana, algo se diseñó de más o de menos.

**Fase 4 · Capa de mapeo para bóvedas existentes (3–4 semanas).** §5. Detrás de bandera de función, saltable en el onboarding.

**Fase 5 · Recursos nativo (4–6 semanas).** R1 §7.1 Fase 1 y §5.2/§5.3 sin cambios. **Ahora se prioriza por valor de producto, no por dependencia de la integración.** Puede ir antes de la Fase 4 si el producto lo pide.

**Fase 6 · Sync de notas libres, bidireccional (3–4 semanas).** Lo que R1 llamaba Fase 5. Es lo último y lo más arriesgado, y sigue siéndolo.

**Cambios respecto al orden de la ronda 1, resumidos:**
- Recursos nativo baja de **Fase 1 a Fase 5**.
- Aparece la vertical de proyección como **nueva Fase 1**.
- El motor de rachas/XP **desaparece del camino crítico** (era Fase 3 en R1).
- El import/export de bóveda de R1 §7.1 Fase 2 se **desdobla**: la parte fácil (exportar a Markdown) queda subsumida en la Fase 1; la parte difícil (importar una bóveda ajena estructurada) se convierte en la Fase 4 con toda la capa de mapeo, que en la ronda 1 subestimé al llamarla "1 semana".

---

## 7 · Recomendación

**El cambio de encuadre mejora el proyecto, y no marginalmente.** Cancelar la F1 elimina la parte del plan que peor relación valor/riesgo tenía: mantener una superficie de producto dentro de una aplicación de terceros, con ciclo de release ajeno, sin poder arreglar nada rápido, y persiguiendo una comunidad que no es la audiencia de Kibo. Lo que queda —proyectar registros estructurados a Markdown consultable— es más pequeño, más defendible y encaja mejor con la tesis del producto.

**Y hay un beneficio de secuenciación que no era visible en la ronda 1:** al desacoplar la integración del módulo de Recursos, el camino a un resultado demostrable pasa de ~12 semanas a ~7, y ese resultado se puede poner en manos de usuarios reales sin riesgo de destruir sus archivos, porque en modo exportación Kibo solo escribe lo que Kibo creó.

**Las tres cosas que más me preocupan ahora** (dos son nuevas; la primera de la ronda 1 se disuelve y la segunda muta):

**1 · El determinismo del emisor de bytes, que ahora es un problema mayor que en la ronda 1.** Antes el riesgo era que dos implementaciones de `canonicalize()` divergieran. Ahora, además, **Kibo genera contenido**: cada cambio en el emisor de YAML, en el orden de claves, en el formato de fechas o en la plantilla de secciones **reescribe archivos en el disco de todos los usuarios vinculados**. Un ajuste cosmético del formato se convierte en un commit gigante en las bóvedas que la gente versiona con git. Mitigaciones que considero obligatorias desde el día uno: emisor con versión explícita, corpus dorado de bytes esperados en CI, `ProjectionProfile.version` con reproyección programada y visible, y un contador de "archivos que se van a reescribir" antes de confirmar cualquier cambio de mapeo. La proyección en servidor (§2) es lo que hace esto gobernable; si estuviera en el plugin, sería ingobernable.

**2 · No existe todavía ninguna entidad tipada que proyectar, y esa es ahora la dependencia real.** Con Recursos fuera del camino crítico, el cuello de botella se movió: la integración ya no espera al módulo de notas, espera a que exista **un** módulo de dominio. Hoy el esquema tiene seis modelos de identidad y nada más (R1 §0). El riesgo concreto es construir el motor de proyección genérico —que es la parte intelectualmente interesante— antes de tener un solo caso real que proyectar, y descubrir en el segundo tipo que la generalización estaba mal orientada. **Mi postura: la Fase 1 se hace con un módulo de dominio real y completo, no con una entidad de juguete, y el motor se declara "listo" solo cuando el segundo tipo cuesta una semana.**

**3 · La capa de mapeo de bóvedas existentes es un proyecto en sí mismo, y en la ronda 1 la subestimé.** La llamé "import/export, 1 semana". Con el modelo conceptual nuevo queda claro que no es importar texto: es **inferir el esquema implícito de la bóveda de un desconocido y alinearlo con el esquema explícito de Kibo**, con previsualización, cobertura por campo, preservación de lo no mapeado y deshacer. Son 3–4 semanas y es donde el usuario está más asustado. Recomendación firme: **que sea opcional y saltable**, que el camino por defecto sea "carpeta nueva, cero mapeo", y que la pantalla de simulacro (§5.2, paso 5) sea la última que se recorte, porque es la que convierte el miedo en confianza.

**Menciones honorables**, que vigilaría sin considerarlas de primer orden: (a) la métrica del PRD §5 sobre bóvedas vinculadas ya no mide lo que decía medir y hay que re-derivarla; (b) proyectar salud y finanzas a archivos planos es una decisión del usuario, no del producto, y el esquema ya lo refleja con perfiles deshabilitados por defecto (§1.8); (c) el PRD §4 necesita dos correcciones textuales — cancelar la F1 y acotar la regla de "archivos limpios" a las notas libres (§1.7).
