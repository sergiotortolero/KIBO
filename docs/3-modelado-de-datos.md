# Kibo — Modelado de Datos

Todo sobre los datos: dónde viven, cómo se transforman, schemas y objetos.

**Para quién es:** Ingeniería de datos y quien diseñe migraciones.
**Versión:** 1.0-alpha

## Registro de modificaciones

| Versión | Fecha | Editó | Qué cambió | Por qué |
|---|---|---|---|---|
| 1.0-alpha | 2026-09-05 | technical-writer | Primer documento de modelado de datos | Migración de ARCHITECTURE.md v1.7 a documentación de cinco piezas (Art. 5) |

## Contenido

- [1. El envelope `ContextItem`](#1-el-envelope-contextitem)
- [2. El log de operaciones](#2-el-log-de-operaciones)
- [3. Matriz de residencia de datos (Art. 12)](#3-matriz-de-residencia-de-datos-art-12)
- [4. Formato de bóveda Markdown](#4-formato-de-bóveda-markdown)
- [5. Notas de implementación](#5-notas-de-implementación)

---

## 1. El envelope `ContextItem`

Toda entidad de dominio es viewable a través de **una forma.** Si no, la IA necesita N integraciones y el producto lleva diez apps de retraso.

### 1.1 Estructura

```typescript
ContextItem {
  id: ULID,                      // immutable, never the path
  userId: UUID,
  type: string,                  // 'habit' | 'entry' | 'account' | ... (closed vocab)
  category: string,              // 'productivity' | 'health' | 'finance' | 'social' | 'resources' | 'entertainment'
  sensitivity: string,           // 'public' | 'private' | 'special'
  occurredAt: ISO8601 + offset,  // when the fact happened in user's timezone
  recordedAt: ISO8601 + offset,  // when Kibo was told about it
  title: string,
  body?: string,                 // optional narrative
  attributes: Record<string, unknown>, // typed per type
  links: Array<{target: string, label?: string}>,  // wikilinks as foreign keys
  provenance: 'kibo' | 'adopted' | 'read' | 'foreign',  // who created it
  tags: string[],
}
```

### 1.2 Las tres propiedades no negociables

| Propiedad | Por qué |
|---|---|
| **`category` y `sensitivity` son first-class**, no etiquetas agregadas después | Son lo que hace Article 12 ejecutable at runtime instead de in a document |
| **`links[]` es el mismo graph que la bóveda emite como wikilinks** | Hechos become record notes. Dimensiones become reference notes. Wikilinks perform the join. Un graph, dos representaciones |
| **`provenance` separa lo que el usuario dijo de lo que la IA inferió** | Sin ella, en meses nadie sabe cuál parte de "contexto personal" es real. Contamination más dura del sistema to reverse |

### 1.3 Query surface

```typescript
query(
  categories: Category[],
  timeRange: [Date, Date],
  types: EntityType[],
  entities: string[],
  text: string,
  limit: number,
  purpose: string
): Promise<{
  items: ContextItem[],
  redactionReport: {
    categoriesRequested: string[],
    categoriesRetrieved: string[],
    itemsFiltered: number,
    reason?: string
  }
}>
```

**Dos reglas en la firma:**
1. **Category filtering antes de retrieval, no en formatting.** Data el usuario no autorizó nunca entra al proceso.
2. **Redaction es explícita,** así la IA puede decir "no veo finanzas" instead de inventar.

### 1.4 Auditoría

Toda query se registra:
- Quién (user id)
- Cuándo (timestamp)
- Categorías solicitadas
- Item ids retrieved
- Propósito (ai-reflection, export, etc.)
- Modelo usado
- Policy de retención
- Versión de consentimiento

---

## 2. El log de operaciones

### 2.1 Estructura `Operation`

Toda mutación de dominio es un `Operation`:

```typescript
Operation {
  opId: ULID,                    // client-generated → idempotent retries
  userId: UUID,
  entityRef: string,             // 'habits:abc123' | 'entries:def456'
  kind: string,                  // 'create' | 'update' | 'delete' | 'complete' | ...
  payload: Record<string, unknown>,  // what changed: {effort: 4, periodicity: 'weekly'}
  actor: UserId | 'ai-suggested-user-confirmed',
  deviceClock: number,           // per-device logical clock
  createdAt: ISO8601 + offset,
}
```

### 2.2 Usos del log

| Consumer | Qué hace |
|---|---|
| **Replication** | Transporta Operation del móvil/web al servidor. Servidor aplica y confirma |
| **Vault projector** | Consume Operation como feed cursado. Convierte a notas Markdown. Emite `.base` files |
| **Connectors externos** | Consume el mismo feed. Ej: Slack integration, calendar sync |
| **Audit trail** | Histórico completo de quién hizo qué, cuándo, desde dónde |
| **Análisis** | "¿cuándo empezó este hábito?" = buscar Operation `kind: create` para ese hábito |

### 2.3 Propiedades cruciales

**Idempotencia:** `opId` generado por cliente es ULID. Retry del mismo `opId` → operación aplicada una vez.

**Logical clock:** Per-device. Cuando dos clientes aplican operaciones fuera de orden, el clock resuelve la causalidad.

**Nunca se saca de queue hasta confirmar:** Una operación vive en `sync_queue` del cliente hasta que el servidor confirma receipt. Si la app crashes, al reiniciar retransmite el batch.

---

## 3. Matriz de residencia de datos (Art. 12)

**Normativa.** Es precondicional a cualquier código que toque salud, finanzas o diario.

| Categoría | Dispositivo | Kibo servers | Bóveda usuario | LLM tercero |
|---|---|---|---|---|
| **Health** (`especial`) | ✅ | ✅ | **opción por módulo** | **solo con DPA** |
| **Finance — amounts** (`especial`) | ✅ | ✅ | **nunca** | **solo con DPA** |
| Finance — structure | ✅ | ✅ | opción | consent |
| **Journal** (`especial`) | ✅ | ✅ | ✅ | separate consent |
| Productivity | ✅ | ✅ | ✅ | consent |
| Resources | ✅ | ✅ | ✅ | consent |
| Social | ✅ | ✅ | **nunca** — third-party data | **nunca** |
| Credentials | Secure store | encrypted | **nunca** | **nunca** |

**Prohibition más fuerte (sin excepciones de consentimiento):**

Números de cuenta, CLABE, PAN, últimos cuatro, saldos, límites de crédito, números de póliza y credenciales **nunca se proyectan a ningún archivo, con o sin consentimiento.** Habilitan fraude, no disclosure.

### 3.1 Reglas de implementación

| Regla | Quién la enforza |
|---|---|
| Category filtering antes de query | Backend: la query surface (§1.3) filtra antes de retrieval |
| Encriptación column-level para datos especiales | Postgres: credential boundary by role |
| Redaction report explícita | Backend: query surface devuelve qué data fue redactada |
| Auditoría de todas las queries | Backend: audit table con user, timestamp, categories, item ids, purpose |
| Export cascada a consent | Backend: exportar solo items con consent activo para ese destino |
| Consent per (category × destination) | Backend: tabla de consent granular |

---

## 4. Formato de bóveda Markdown

### 4.1 El contract

**Kibo emite notas que Obsidian y Bases pueden leer.** El contract es la base del producto.

### 4.2 System keys (en toda nota Kibo genera)

Estos cuatro son los **únicos** prefijados con `kibo-`:

```yaml
kibo-id: ulid-here          # ULID, immutable, never the path
kibo-type: habit            # kebab-case, closed vocabulary
kibo-rev: 3                 # revision counter for drift detection
kibo-updated: 2026-09-05T14:30:00-06:00   # ISO 8601 with explicit offset
tags: [kibo/habit]          # stamp tag: user can select "all Kibo-written"
```

**Todos los domain keys son unprefixed** (`date`, `doctor`, `dose`, `mood`) así Bases y Dataview los tratan como propiedades ordinarias.

### 4.3 Convention rules (fijas para el contract)

| Aspecto | Regla | Ejemplo |
|---|---|---|
| **Naming** | kebab-case, English, singular excepto collections | `doctor`, `doses`, `attended-date` |
| **Dates** | `YYYY-MM-DD` | `2026-09-05` |
| **Instants** | ISO 8601 con offset explícito | `2026-09-05T14:30:00-06:00` |
| **Booleans** | Literal `true`/`false`, nunca `yes`/`no` | YAML 1.1 coerces; Norway problem |
| **Nulls** | Omit key, nunca `null` o empty string | Omit es el default |
| **Enums** | `snake_case`, cerrado, documentado | `status: completed`, `priority: high` |
| **Collections** | Siempre YAML list, incluso con un elemento | `tags: [a]` not `tags: a` |

### 4.4 Estructura de nota `kibo`

```markdown
---
kibo-id: abc123xyz
kibo-type: medical-visit
kibo-rev: 1
kibo-updated: 2026-09-05T10:00:00-06:00
date: 2026-09-05
doctor: Dr. García
reason: Routine checkup
observations: BP 120/80, heart rate 72
tags: [kibo/health]
---

<!-- kibo:generated -->
Visited Dr. García on 2026-09-05 for routine checkup.

**Observations:**
- BP 120/80
- Heart rate 72
<!-- end kibo:generated -->

## My notes
User can edit here.
```

**Regions:**
- Frontmatter declared keys: Kibo rewrites on regeneration.
- Undeclared frontmatter keys: User added, preserved verbatim.
- `<!-- kibo:generated -->` block: Kibo replaces wholesale.
- Body below: User can edit, untouched on sync.
- If user deletes generated block: Recorded as `generated_block: removed`. Frontmatter keeps syncing.

### 4.5 Folder tree

```
Kibo/
  ├─ Diary/          # todos los entries
  ├─ Health/         # medical visits, vitals
  │  └─ Private/     # medicines, dosages (user can exclude from git/sync)
  ├─ Finance/
  │  └─ Private/     # account structure (not amounts)
  ├─ Resources/      # user's notes indexed
  ├─ Areas/          # dimension notes: Vigor, Sabiduría, ...
  ├─ People/         # dimension notes: doctors, friends
  │  └─ Private/     # health providers linked to visits
  ├─ .base/          # generated Bases
  └─ README.md       # convention guide
```

**Rules:**
- One root, `Kibo/`. Kibo never writes outside.
- Folder names describe content, not data model.
- Date partition only for types that grow without ceiling.
- **Everything special-category under `Kibo/Private/`** — user can exclude from git, selective sync, backup en una gesture.
- Hubs receive links, never emit (project links to area, never reverse).
- Person lives in most restrictive sub-root (provider lives in `Private/People/`).

### 4.6 Never projected (enforced)

```
-- Gamification (never) --
xp, hp, coins, gems, streak counters, protectors, flame tiers,
achievements, trophies, banners, cosmetics, wardrobe, chests, probabilities

-- Finance (never) --
account numbers, CLABE, PAN, last four, balances, credit limits,
policy numbers, credentials

-- Social (never) --
third parties' phones, emails, addresses, the social feed

-- Other (never) --
raw sensor samples (daily aggregates emitted instead),
internal identifiers other than kibo-id,
settings, notifications, sessions, audit logs

-- BUT (facts yes, score no) --
consistency record (which days you met) — YES
computed streak — NO
```

**Enforced:** Field-level `neverProject` flag + forbidden-vocabulary test (fails if `xp`, `hp`, etc. appears in export) + contract-version bump on new key.

### 4.7 Serializer

La serialización vive en `packages/markdown`. **Cero dependencia en Obsidian API.** Marginal cost de genéricos ≈ 0. Sirve cualquier vault Markdown.

---

## 5. Notas de implementación

### 5.1 Identity

- **`kibo-id` es ULID**, immutable, nunca la ruta.
- `opId` en operation log es la misma convención ULID, hence idempotent retries.
- UUIDs para user_id, session_id, etc.

### 5.2 Queries importantes

| Query | Propósito |
|---|---|
| `SELECT * FROM contexts WHERE userId = $1 AND category = $2 AND occurredAt BETWEEN $3 AND $4 ORDER BY occurredAt DESC` | Get items in category, date range |
| `SELECT * FROM operations WHERE userId = $1 ORDER BY deviceClock ASC OFFSET $2 LIMIT $3` | Vault projector: consume operation feed cursado |
| `INSERT INTO audit_log (userId, purpose, categories, itemIds, timestamp)` | Toda query logged |
| `SELECT * FROM consent WHERE userId = $1 AND category = $2 AND destination = $3` | Check consent before returning data |

### 5.3 Migraciones

**Schema lives in `packages/database` (Prisma).** Migrations are source-controlled and versioned.

Two patterns:
- **Deploy time:** Run on application startup (zero admin overhead).
- **Manual migration:** For large datasets, run separately before deploy.

**Never deploy code expecting a schema that is not yet migrated.**

### 5.4 Encriptación column-level

Datos especiales (health, finance amounts) viven en columnas encriptadas a nivel Postgres:

```sql
ALTER TABLE contexts
  ADD COLUMN body_encrypted bytea,
  ADD COLUMN sensitivity_encrypted text;

CREATE ROLE kibo_app LOGIN;
GRANT SELECT (id, userId, type, category, occurredAt, recordedAt, title, links, provenance, tags)
  ON contexts TO kibo_app;
-- No direct access to body, sensitivity

-- Decryption happens at application layer
```

**Credential boundary:** Solo la app con la clave puede desencriptar.

---

`*` Pendiente: esquema Prisma completo. Migraciones de prueba. Trigger de Postgres para manejo de `updated_at` y validación de constraints.
