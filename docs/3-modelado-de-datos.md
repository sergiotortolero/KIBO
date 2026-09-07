# Kibo — Modelado de Datos

Todo sobre los datos: dónde viven, cómo se transforman, schemas y objetos.

**Para quién es:** Ingeniería de datos y quien diseñe migraciones.
**Versión:** 1.0-alpha

## Registro de modificaciones

| Versión | Fecha | Editó | Qué cambió | Por qué |
|---|---|---|---|---|
| 1.0-alpha | 2026-09-06 | technical-writer | Primera versión del modelado de datos | El portafolio documenta cada solución en cinco documentos numerados |

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
| **`category` y `sensitivity` son de primera clase**, no etiquetas agregadas después | Son lo que hace que el Artículo 12 sea ejecutable en tiempo de ejecución, no solo en la documentación |
| **`links[]` es el mismo graph que la bóveda emite como wikilinks** | Los hechos se convierten en notas de registro. Las dimensiones se convierten en notas de referencia. Los wikilinks realizan la unión. Un graph, dos representaciones |
| **`provenance` separa lo que el usuario dijo de lo que la IA inferió** | Sin ella, en meses nadie sabe cuál parte de "contexto personal" es real. La contaminación más difícil de revertir en el sistema |

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
1. **Category filtering antes de retrieval, no en formatting.** Datos que el usuario no autorizó nunca entran al proceso.
2. **Redaction es explícita,** así la IA puede decir "no veo finanzas" en lugar de inventar.

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
| **Vault projector** | Consume Operation como flujo de operaciones rastreado. Convierte a notas Markdown. Emite archivos `.base` |
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
| **Health** (`especial`) | Sí | Sí | **opción por módulo** | **solo con DPA** |
| **Finance — amounts** (`especial`) | Sí | Sí | **nunca** | **solo con DPA** |
| Finance — structure | Sí | Sí | opción | consentimiento |
| **Journal** (`especial`) | Sí | Sí | Sí | consentimiento separado |
| Productivity | Sí | Sí | Sí | consentimiento |
| Resources | Sí | Sí | Sí | consentimiento |
| Social | Sí | Sí | **nunca** — datos de terceros | **nunca** |
| Credentials | Secure store | encriptado | **nunca** | **nunca** |

**Prohibition más fuerte (sin excepciones de consentimiento):**

Números de cuenta, CLABE, PAN, últimos cuatro, saldos, límites de crédito, números de póliza y credenciales **nunca se proyectan a ningún archivo, con o sin consentimiento.** Habilitan fraude, no disclosure.

### 3.1 Reglas de implementación

| Regla | Quién la enforza |
|---|---|
| Category filtering antes de query | Backend: la query surface (§1.3) filtra antes de retrieval |
| Encriptación a nivel de columna para datos especiales | Postgres: límite de credencial por rol |
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

**Todos los keys de dominio están sin prefijo** (`date`, `doctor`, `dose`, `mood`) para que Bases y Dataview los traten como propiedades ordinarias.

### 4.3 Reglas de convención (fijas para el contrato)

| Aspecto | Regla | Ejemplo |
|---|---|---|
| **Naming** | `kebab-case`, en inglés, singular excepto colecciones | `doctor`, `doses`, `attended-date` |
| **Dates** | `YYYY-MM-DD` | `2026-09-05` |
| **Instants** | ISO 8601 con offset explícito | `2026-09-05T14:30:00-06:00` |
| **Booleans** | Literal `true`/`false`, nunca `yes`/`no` | YAML 1.1 transforma tipos; problema de Noruega |
| **Nulls** | Omitir clave, nunca `null` o cadena vacía | Omitir es el default |
| **Enums** | `snake_case`, cerrado, documentado | `status: completed`, `priority: high` |
| **Collections** | Siempre YAML list, incluso con un elemento | `tags: [a]` no `tags: a` |

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
- Cuerpo abajo: el usuario puede editar, sin tocar en sincronización.
- If user deletes generated block: Recorded as `generated_block: removed`. Frontmatter keeps syncing.

### 4.5 Folder tree

```
Kibo/
  ├─ Diary/          # todas las entradas
  ├─ Health/         # visitas médicas, signos vitales
  │  └─ Private/     # medicinas, dosis (usuario puede excluir de git/sync)
  ├─ Finance/
  │  └─ Private/     # estructura de cuentas (no montos)
  ├─ Resources/      # notas del usuario indexadas
  ├─ Areas/          # notas de dimensión: Vigor, Sabiduría, ...
  ├─ People/         # notas de dimensión: doctores, amigos
  │  └─ Private/     # proveedores de salud vinculados a visitas
  ├─ .base/          # Bases generadas
  └─ README.md       # guía de convención
```

**Reglas:**
- Una raíz: `Kibo/`. Kibo nunca escribe afuera.
- Los nombres de carpeta describen el contenido, no el modelo de datos.
- Partición por fecha solo para tipos que crecen sin límite.
- **Todo lo especial-categoría bajo `Kibo/Private/`** — el usuario puede excluir de git, sincronización selectiva, copia de seguridad en un gesto.
- Los concentradores reciben enlaces, nunca emiten (el proyecto enlaza a un área, nunca al revés).
- La persona vive en la sub-raíz más restrictiva (el proveedor vive en `Private/People/`).

### 4.6 Nunca se proyectan (obligatorio)

```
-- Gamificación (nunca) --
`xp`, `hp`, `coins`, `gems`, contadores de racha, protectores, niveles de llama,
logros, trofeos, banners, cosméticos, guardarropa, cofres, probabilidades

-- Finanzas (nunca) --
números de cuenta, CLABE, PAN, últimos cuatro, saldos, límites de crédito,
números de póliza, credenciales

-- Social (nunca) --
teléfonos, emails, direcciones de terceros, feed social

-- Otro (nunca) --
muestras de sensor sin procesar (se emiten agregados diarios en su lugar),
identificadores internos que no sean `kibo-id`,
configuración, notificaciones, sesiones, logs de auditoría

-- PERO (hechos sí, puntuación no) --
registro de cumplimiento (qué días cumpliste) — SÍ
racha calculada — NO
```

**Obligatorio:** Flag `neverProject` a nivel de campo + prueba de vocabulario prohibido (falla si `xp`, `hp`, etc. aparece en export) + actualización de versión de contrato en nueva clave.

### 4.7 Serializer

La serialización vive en `packages/markdown`. **Cero dependencia en Obsidian API.** Marginal cost de genéricos ≈ 0. Sirve cualquier vault Markdown.

---

## 5. Notas de implementación

### 5.1 Identity

- **`kibo-id` es ULID**, inmutable, nunca la ruta.
- `opId` en operation log es la misma convención ULID, por lo tanto retries idempotentes.
- UUIDs para user_id, session_id, etc.

### 5.2 Queries importantes

| Query | Propósito |
|---|---|
| `SELECT * FROM contexts WHERE userId = $1 AND category = $2 AND occurredAt BETWEEN $3 AND $4 ORDER BY occurredAt DESC` | Obtener ítems en categoría, rango de fecha |
| `SELECT * FROM operations WHERE userId = $1 ORDER BY deviceClock ASC OFFSET $2 LIMIT $3` | Vault projector: consume flujo de operaciones rastreado |
| `INSERT INTO audit_log (userId, purpose, categories, itemIds, timestamp)` | Toda query registrada en log |
| `SELECT * FROM consent WHERE userId = $1 AND category = $2 AND destination = $3` | Verificar consentimiento antes de devolver datos |

### 5.3 Migraciones

**El schema vive en `packages/database` (Prisma).** Las migraciones están bajo control de versiones.

Dos patrones:
- **Tiempo de despliegue:** Ejecutar al iniciar la aplicación (sin sobrecarga de administrador).
- **Migración manual:** Para conjuntos grandes de datos, ejecutar separadamente antes del despliegue.

**Nunca despliegues código esperando un schema que aún no ha sido migrado.**

### 5.4 Encriptación a nivel de columna

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

**Límite de credencial:** Solo la app con la clave puede desencriptar.

---

`*` Pendiente: esquema Prisma completo. Migraciones de prueba. Trigger de Postgres para manejo de `updated_at` y validación de constraints.
