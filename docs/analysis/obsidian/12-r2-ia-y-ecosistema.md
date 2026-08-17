# 12 · Ronda 2 — Capa de IA: el traductor entre prosa y esquema

**Fecha:** 2026-08-08 · **Autor:** `ai-engineer` · **Tipo:** delta sobre `02-capa-ia.md` (ronda 1)
**Lee primero:** `02-capa-ia.md`. Este documento **no lo repite**: lo enmienda, lo reordena y añade lo nuevo.
Cuando digo "R1 §X" me refiero a la sección X de `02-capa-ia.md`.

> **Convención de evidencia** (igual que R1): **[V]** hecho verificado con fuente y fecha · **[S]** supuesto de
> diseño explícito y falsable. Fuentes web consultadas el **2026-08-08**.
>
> **Nota de proceso:** la skill `claude-api` no está instalada en este entorno. Los datos de modelos y precios
> provienen de `platform.claude.com/docs`, consultados el **2026-08-08** — el mismo día que este documento, así
> que siguen vigentes. Ningún precio viene de memoria.

---

## 0 · Qué cambia (tabla de enmiendas a la ronda 1)

| R1 decía | R2 dice | Motivo |
|---|---|---|
| **§3.4** Modo B (embeddings locales en el plugin) es la arquitectura objetivo | **Anulado.** Gana Modo A: la inferencia y el índice viven en Kibo | El conector debe ser delgado. Ver §5 — pero la privacidad se resuelve por otra vía, mejor |
| **§7.3** Preocupación #3: "no hay evidencia de que la comunidad Obsidian quiera esto" | **Retirada.** Obsidian ya no es canal de adquisición | Corrección de encuadre de Sergio |
| **§2** UC-2 (misiones de enlace) en **P1** | **Baja a P3** | Es el único caso, junto a UC-3, que obliga a subir la bóveda entera. Y su defensa era competir con Smart Connections — competencia que ya no existe |
| **§2** UC-3 (RAG sobre bóveda) en P3 como infraestructura | **Baja a P4** | Sin índice completo no hay RAG, y el índice completo es ahora el mayor coste de privacidad del sistema |
| **§0** Salud = clase Roja indivisible | **Se parte en Roja-A y Roja-B.** Ver §7 | El ejemplo central de Sergio es salud; tratarlo como bloque único mata el caso de uso estrella |
| **§0** `.kiboignore` excluye carpetas de lectura | **Se añade la figura de "zona de solo escritura"** | Kibo debe poder escribir salud a la bóveda sin volver a leerla nunca |
| **§6.3** Coste ≈ $0.21 / usuario / mes | **Dos perfiles: Interop ≈ $0.13 · Completo ≈ $0.29** (precio introductorio) | Ver §8 |
| **§4** MCP: distracción para v1 | **Sin cambio, pero baja aún más su urgencia** | Con Obsidian como interoperabilidad y no como adquisición, el argumento de alcance desaparece del todo |

**Lo que NO cambia y sigue siendo el eje de todo:** R1 §2.0 — **el modelo es un sensor, no una autoridad.**
Con los casos nuevos ese principio no se relaja: se endurece, porque ahora el modelo no propone marcar un
hábito sino poblar un registro tipado, y un campo mal transcrito en salud es peor que XP falso.

---

## 1 · El reencuadre, leído desde la capa de IA

Tres consecuencias que importan para el diseño, más allá de lo obvio:

1. **Desaparece la presión de "ser mejor que un plugin gratuito".** R1 §1.5 dedicó media sección a demostrar
   dónde no competir. Ese razonamiento sigue siendo correcto (no hay que reconstruir búsqueda semántica ni
   chat), pero deja de ser un criterio de *priorización*: ya no hay que ganar a Smart Connections, hay que
   servir al usuario de Kibo que además usa Obsidian. **La pregunta cambia de "¿es defendible?" a "¿aprovecha
   lo que cada herramienta hace mejor?"**, y con esa pregunta el orden del catálogo se reordena solo.

2. **El encuadre "Obsidian tiene estructura sin esquema; Kibo tiene esquema" es correcto y es más operativo de
   lo que parece.** Verifiquémoslo: **[V]** Obsidian soporta propiedades tipadas —`text`, `list`, `number`,
   `checkbox`, `date`, `datetime`— almacenadas como YAML en un bloque de frontmatter que debe empezar en la
   línea 1 del archivo; Bases se apoya en esas propiedades y Dataview las lee directamente
   (`obsidian.md/help/properties`; guías de `obsidianmate.com`, `danholloran.me`, `got.md`, consultadas
   2026-08-08). Es decir: Obsidian **sí tiene tipos**, pero **no tiene esquema** — nadie garantiza que
   `fecha:` signifique lo mismo en dos notas, ni que exista. Kibo garantiza ambas cosas.
   **Consecuencia de diseño dura:** un campo de Kibo que no se pueda expresar en
   `{text, list, number, checkbox, date, datetime}` **no se proyecta al frontmatter** — va al cuerpo de la
   nota. Es fácil de olvidar y rompe Bases/Dataview del usuario si se ignora.

3. **La IA vive en Kibo: confirmado, con un matiz.** Lo confirmo para *inferencia* (llamadas a modelos) y para
   *índice*. Pero el conector conserva trabajo que la gente suele confundir con IA y no lo es: hashing, diffing,
   filtrado por `.kiboignore`, e inventario de claves de frontmatter. Todo determinista, todo barato, y es
   justamente lo que permite que a Kibo llegue **poco dato en vez de toda la bóveda**. Detalle en §5.

---

## 2 · Los tres casos nuevos y la priorización revisada

### 2.1 ¿UC-8 es lo mismo que UC-1? Respuesta precisa: **mismo motor, dos perfiles**

Esta era la pregunta 1 y merece una respuesta exacta porque decide si se construye una cosa o dos.

| | **UC-1** (R1) · extracción de eventos de juego | **UC-8** (nuevo) · extracción de registro tipado |
|---|---|---|
| **Espacio de salida** | **Cerrado.** Una referencia a una entidad que ya existe (`habit_id` del catálogo del usuario) + un booleano | **Abierto.** Un objeto nuevo con N campos de tipos distintos (fechas, cantidades, nombres, enums, texto) |
| **Pregunta que responde** | *"¿A cuál de tus 12 hábitos se refiere esta frase, y lo hizo?"* | *"¿Qué campos de un registro de consulta médica están escritos en esta frase?"* |
| **Modo de fallo dominante** | Marcar el hábito equivocado, o marcar uno negado | **Rellenar un campo con un valor plausible que no está escrito** |
| **Coste del fallo** | XP falso → daño a la economía (R1 §5.2) | Dato falso en un registro de dominio → en salud, daño real |
| **Modelo** | `claude-haiku-4-5` | `claude-sonnet-5` (ver §8) |
| **UX de confirmación** | Chips de un toque | Tarjeta de registro con semáforo por campo (§3.3) |

**Lo que comparten** es el 80 % de la ingeniería: la cascada L0→L1→L2→puerta, los `evidence_span` literales,
structured outputs con `strict`, el ledger reversible, la telemetría sin contenido.

**Decisión:** un solo `ExtractionService` con **perfiles de registro enchufables** (`RecordProfile`). UC-1 es el
perfil `catalog_reference`; UC-8 es el perfil `typed_record`, instanciado por tipo de dominio
(`medical_consultation`, `workout`, `reading_session`, `study_session`…). **No son dos features: es una feature
con dos formas de salida.** Construir dos pipelines paralelos sería el error caro de esta ronda.

### 2.2 Priorización revisada

| # | Caso | R1 | **R2** | Por qué se mueve |
|---|---|---|---|---|
| — | **Ledger reversible + parser L0/L1** | P0 | **P0** | Sin cambio. Sigue siendo el prerequisito de todo y sigue siendo 0 % IA |
| **UC-8** | **Prosa → registro tipado** | — | **P0** | **Es el caso estrella.** Es la única feature del catálogo que sólo existe porque hay dos herramientas: Obsidian captura prosa mejor que ningún formulario, Kibo estructura mejor que ningún `.md` |
| **UC-1** | Prosa → eventos de juego | P0 | **P0** | Mismo motor que UC-8; se construyen juntos |
| **UC-9** | **Registro → nota con frontmatter** | — | **P0** | Es la otra mitad de "aprovechar ambas". Y es barato: **casi no es IA** (§4) |
| **UC-10** | **Mapeo asistido de campos** | — | **P1** | ROI altísimo, acotado, verificable, **se ejecuta una sola vez**. Es el desbloqueador de toda bóveda preexistente |
| UC-5 | Coach semanal | P2 | **P2** | Sin cambio. Ya vendido en Tienda, barato, clase Verde |
| UC-4 | Síntesis de lectura | P2 | **P2** | Sin cambio. Sigue con el hueco de ASR abierto (R1 §UC-4) |
| UC-2 | Misiones de enlace | **P1** | **P3** | **Baja.** Exige la bóveda entera indexada en Kibo (§5.3) y su defensa era competir con Smart Connections |
| UC-3 | RAG / consulta sobre bóveda | P3 infra | **P4** | **Baja.** Sin índice completo no hay RAG; y el índice completo es el mayor coste de privacidad del sistema |
| UC-6 | Diario → insight | P4 | **P4** | Sin cambio |
| UC-7 | Auto-tagging | descartado | **descartado** | Sin cambio, y ahora con más razón: UC-10 hace lo contrario (Kibo se adapta al usuario, no al revés) |

**El movimiento de fondo:** la ronda 1 priorizó por *defendibilidad competitiva*. La ronda 2 prioriza por
**cuánto dato hay que mover para que funcione**. Los tres casos nuevos funcionan con una nota o con un
inventario de claves; UC-2 y UC-3 exigen la bóveda completa. Ese criterio ordena el catálogo mejor que el
anterior, y no es casualidad: es el mismo criterio que hace que el conector pueda ser delgado.

---

## 3 · UC-8 · Prosa → registro tipado (el caso estrella)

**Ejemplo canónico (de Sergio):** *"fui con la cardióloga, me subió el losartán a 50 y me quiere ver en
noviembre"* → un registro de consulta médica con especialidad, fecha, medicamento, dosis, cambio de dosis y
próxima cita.

### 3.1 El salto de dificultad, nombrado

R1 §UC-1 resolvía una **clasificación contra un enum pequeño**. Esto es **slot filling tipado**: hay que decidir
(a) si hay un registro, (b) de qué tipo, (c) qué campos están escritos, (d) cómo se normalizan, (e) qué campos
faltan. Cada paso multiplica las formas de equivocarse, y el resultado se guarda en la base de datos del
usuario, no en un contador de XP.

**La regla que gobierna el diseño entero, y que resuelve el 80 % del riesgo:**

> **El modelo nunca infiere lo que no está escrito.**
> Cada campo o está anclado en un `evidence` literal de la nota, o es `null`. Prohibido rellenar con valores
> típicos, prohibido "completar" con conocimiento general, prohibido asumir unidades.
> **Un `null` es mejor resultado que un valor plausible inventado:** un `null` se ve en la tarjeta y el usuario
> lo llena en dos segundos; un valor plausible inventado se guarda, se olvida, y aparece meses después como si
> fuera un hecho.

### 3.2 La cascada, adaptada

```
GATE  Léxico de disparo         determinista · 0 tokens
      · términos por tipo de registro: "cardiólog|doctor|receta|me recetó|mg|consulta|cita con"
      · alta cobertura, baja precisión — es exactamente lo que se quiere de una compuerta
      · si no dispara y L2 de UC-1 tampoco corrió → no se gasta nada ese día

L0    Parser determinista       0 tokens
      · frontmatter que el usuario ya escribió (compatible con Bases/Dataview)
      · plantilla de Kibo si la usa ("## Consulta médica" con campos)
      · fechas absolutas, cantidades con unidad ("50 mg"), listas

L1    Resolución local          0 tokens
      · fechas relativas ("en noviembre", "el martes") → resueltas EN CÓDIGO con la fecha de la
        nota como ancla, nunca por el modelo
      · nombres propios contra los contactos/entidades que el usuario ya tiene en Kibo

L2    Extractor tipado (LLM)    1 llamada · structured outputs · claude-sonnet-5
      · recibe: el fragmento + el schema del tipo + la fecha de la nota
      · NO recibe: el historial clínico del usuario, otros registros, el resto de la bóveda (§7)

L3    Validación determinista   0 tokens · tabla §3.3
L4    Puerta humana             tarjeta de confirmación · §3.4
```

**Por qué la compuerta léxica y no un clasificador LLM:** un clasificador diario cuesta dinero todos los días
para decir "no" el 85 % de las veces. Una lista de términos cuesta cero, tiene recall altísimo (la gente usa
las palabras del dominio cuando habla del dominio) y su baja precisión es irrelevante porque el paso siguiente
la corrige. **[S]** Estimo que la compuerta dispara ~15 % de los días; a validar.

### 3.3 Qué se puede validar deterministamente y qué no

Esta es la pregunta 2 y es donde se gana o se pierde la confiabilidad.

**Validable en código — si falla, el campo no se guarda:**

| Comprobación | Cómo | Si falla |
|---|---|---|
| `evidence` de cada campo es **subcadena literal** de la nota | comparación de cadenas | campo → `null` |
| Tipo del campo (string, number, boolean, array) | `strict: true` en el schema — **garantizado por la API** **[V]** | imposible que falle |
| Valores de enum (especialidad, unidad, tipo de registro) | `enum` en el schema — **soportado** **[V]** | imposible que falle |
| Fecha bien formada | `format: "date"` — **soportado** **[V]** | imposible que falle |
| Fecha relativa correctamente resuelta | se resuelve **en código** con la fecha de la nota; se compara con lo que devolvió el modelo | discrepancia → **ámbar** |
| La cantidad aparece **literalmente** como dígito en el `evidence` | regex sobre el span | campo → `null`. **Nunca se guarda una dosis que no está escrita** |
| Duplicado del mismo registro | clave natural (`tipo + fecha + entidad`) | se ofrece fusionar, no duplicar |
| Nombre propio contra entidades existentes | match contra contactos del usuario | sin match → se propone crear la entidad |

**Hallazgo relevante y contraintuitivo [V]:** el schema de structured outputs **no soporta restricciones
numéricas** (`minimum`, `maximum`, `multipleOf`) ni de longitud de cadena (`minLength`, `maxLength`)
(`platform.claude.com/docs/en/docs/build-with-claude/structured-outputs`, consultado 2026-08-08). Es decir:
**la plausibilidad de una dosis no se puede delegar al schema.** Tiene que vivir en un validador de código
propio. Y ese validador **avisa, no bloquea** — marca ámbar; un rango "implausible" puede ser perfectamente
correcto para un paciente concreto, y Kibo no está en posición de decidirlo.

**No validable — y por eso es exactamente lo que se le pide al humano:**

1. **Si la interpretación es correcta.** *"me subió el losartán a 50"* — ¿50 mg por toma o dosis diaria total?
   ¿Es un cambio de dosis o un alta nueva? El texto es genuinamente ambiguo; ninguna cantidad de modelo lo
   resuelve, porque la información no está.
2. **Si un campo ausente estaba ausente.** Un `null` puede significar "no lo escribió" o "se me pasó". No hay
   forma de distinguirlo sin releer.
3. **Si el `record_type` es el correcto.** Mencionar a un médico no implica que hubo consulta ("mi hermana es
   cardióloga").

**Esas tres son las únicas que la tarjeta debe pedir.** Todo lo demás se muestra pero no se pregunta.

### 3.4 La confirmación sin volverla tediosa

El riesgo de producto aquí no es la exactitud: es que confirmar 12 campos sea más lento que teclearlos, momento
en el cual la feature está muerta aunque funcione perfecto.

**Diseño en tres semáforos, con una regla de carga cognitiva:**

> **La atención que se le pide al usuario es proporcional a la incertidumbre, no al número de campos.**

| Estado | Qué es | Cómo se ve | ¿Pide atención? |
|---|---|---|---|
| 🟢 **Verde** | Evidencia literal + todas las validaciones OK | Valor en texto plano | **No.** Se muestra, no se toca |
| 🟡 **Ámbar** | Normalizado, resuelto desde expresión relativa, fuera de rango, o sin match de entidad | Subrayado, editable en línea, con la evidencia al pasar por encima | **Sí — y es lo único que el usuario toca** |
| ⚪ **Hueco** | El modelo no encontró el campo | Chip discreto "falta: dosis" | Opcional, ignorable sin fricción |

**Layout:** el texto original a la izquierda con los spans resaltados; la tarjeta del registro a la derecha.
Un botón: **Guardar**. El usuario ve de un vistazo de dónde salió cada cosa.

**Cinco reglas de producto que evitan el tedio:**

1. **Un registro por tarjeta.** Si la nota contiene tres, son tres tarjetas en cola — nunca un formulario de 30
   campos.
2. **Si la confianza del `record_type` es baja, la primera pregunta es de un toque:** *"¿esto fue una consulta
   médica?"* Antes de mostrar doce campos hay que acertar el tipo.
3. **Descartar es definitivo por nota.** Se marca la nota como procesada; no se vuelve a preguntar por el mismo
   texto. Una IA que repregunta es una IA que se desinstala.
4. **Auto-apagado por rechazo** (heredado de R1 §5.3): tres descartes seguidos y la feature se desactiva sola y
   pregunta.
5. **Regla de tedio — la más importante:** si un tipo de registro exige tocar **más de 2 campos ámbar de media**
   durante 5 registros consecutivos, ese tipo **se degrada** de "propuesta automática" a "formulario
   prellenado bajo demanda". **La IA que genera más trabajo del que ahorra se retira sola, por tipo de
   registro.** Es medible sin encuestas y es el mejor interruptor de calidad que tiene esta feature.

### 3.5 Reversibilidad

Un registro creado desde IA es un registro normal con `source: ai` y `proposal_id`: editable y borrable como
cualquier otro. **No otorga XP en el momento de proponerse** — el XP se emite al ledger sólo tras la
confirmación, con la misma puerta de R1 §5.3. Un registro descartado no deja rastro salvo la marca de "nota ya
procesada".

---

## 4 · UC-9 · Registro → nota con frontmatter (y por qué casi no es IA)

**Postura, dicha sin rodeos: esto es un serializador, no una feature de IA — y está bien que lo sea.**

Proyectar un registro tipado a YAML es una plantilla determinista. Meter un LLM en el camino añadiría coste,
latencia y la posibilidad de producir un frontmatter inválido, a cambio de nada. **[V]** Además el objetivo
está fijado por Obsidian: los tipos disponibles son `text`, `list`, `number`, `checkbox`, `date`, `datetime`,
en un bloque YAML que empieza en la línea 1 (`obsidian.md/help/properties`, consultado 2026-08-08). Un
serializador acierta el 100 % de las veces; un modelo, no.

**Dónde sí entra la IA — y sólo ahí:**
- **La elección de las claves**, cuando el usuario ya tiene convención propia. Eso es UC-10, se ejecuta una vez,
  y su resultado (`MappingProfile`) se **invierte** para escribir.
- **Opcional y apagado por defecto:** redactar el cuerpo legible de la nota bajo el frontmatter (un párrafo
  humano en vez de una tabla). Con `claude-haiku-4-5`, coste marginal (§8). Es una mejora estética, no una
  capacidad.

**Tres decisiones de diseño que hay que fijar ahora:**

1. **Campos que no caben en los tipos de Obsidian van al cuerpo, no al frontmatter.** Un objeto anidado o una
   lista de objetos (p. ej. varias recetas con dosis y duración) no es expresable como propiedad tipada. Se
   escribe como sección Markdown legible. Forzarlo al YAML rompe Bases y Dataview del usuario.
2. **`kibo-id` sí, pero sólo en las notas que Kibo crea.** El PRD §4 prohíbe meter metadata de Kibo en el
   frontmatter *del usuario*. Una nota que Kibo genera no es una nota del usuario en ese sentido: necesita un
   ancla de identidad estable para poder actualizarse sin duplicar. **La distinción es limpia: notas creadas
   por Kibo llevan `kibo-id`; notas escritas por el usuario no llevan ni una clave de Kibo, nunca.**
3. **Idempotencia por `kibo-id`.** Reproyectar un registro actualiza la nota existente; no crea una segunda.

**Coste:** $0 en su forma determinista.

---

## 5 · Reparto de cómputo: la tensión del conector delgado

Esta era la pregunta 4, y la tensión es real: *un conector delgado que además corre embeddings ya no es delgado.*

### 5.1 Veredicto directo

**Gana "la IA vive en Kibo".** El Modo B de R1 §3.4 —embeddings locales corriendo dentro del plugin— **queda
anulado como arquitectura objetivo**. Inferencia e índice viven en Kibo. Un modelo de embeddings de 100–200 MB
descargándose dentro de Obsidian es, literalmente, meter producto dentro de Obsidian.

### 5.2 Pero el argumento que motivaba el Modo B no muere: se resuelve mejor

R1 quería embeddings locales para no subir la bóveda entera. La solución correcta no es *mover el cómputo*,
es **no necesitar la bóveda entera**:

| Caso | Qué dato necesita en Kibo | ¿Bóveda completa? |
|---|---|---|
| **UC-1** eventos de juego | La nota del día + el catálogo del usuario | **No** |
| **UC-8** registro tipado | El fragmento (o la nota del día) | **No** |
| **UC-9** proyección | Nada de la bóveda — escribe | **No** |
| **UC-10** mapeo de campos | El **inventario de claves de frontmatter** (~4 k tokens para 5,000 notas). Ni una nota | **No** |
| **UC-5** coach | Agregados clase Verde de Kibo. Nada de la bóveda | **No** |
| UC-2 misiones de enlace | **Todas las notas, embebidas e indexadas** | **Sí** |
| UC-3 RAG / consulta | **Todas las notas, embebidas e indexadas** | **Sí** |

**Esto es lo que reordena el catálogo (§2.2), y no por gusto:** los cinco casos que sirven al reencuadre
funcionan sin que la bóveda salga del equipo; los dos que bajan de prioridad son exactamente los que obligan a
subirla. El conflicto entre "conector delgado" y "privacidad del vault" **se disuelve eligiendo bien los casos
de uso**, no eligiendo dónde corre el modelo.

**Consecuencia de coste que conviene ver:** el perfil Interop **no necesita índice vectorial en absoluto**.
Desaparecen del presupuesto la indexación inicial de R1 §3.2 ($0.008–$0.75), los embeddings incrementales y la
tabla `pgvector`. Ver §8.

### 5.3 Qué hace el conector delgado (todo determinista)

Aproximadamente unos cientos de líneas de TypeScript. Nada de modelos, nada de inferencia:

- **Watcher** de cambios en el vault y cola con reintentos offline.
- **Hash y diff** por archivo (`content_hash`) para no reenviar lo que no cambió — heredado de R1 §3.2, que
  sigue vigente en su parte determinista.
- **Filtro `.kiboignore`** aplicado **en el origen**: lo excluido nunca se lee ni se transmite. Es la diferencia
  entre filtrar en el cliente y filtrar en el servidor, y es la única versión que vale.
- **Lectura y escritura de `.md`** con serialización de frontmatter (UC-9).
- **Inventario de claves de frontmatter** para UC-10: recorre el vault y produce un resumen de claves, tipos,
  frecuencias y ejemplos. **Nunca envía cuerpos de nota.**
- **Envío del fragmento del día** cuando dispara la compuerta léxica de UC-8.

### 5.4 La línea de la UI, escrita para que no se cruce

> **UI de configuración y estado: sí. UI de producto: no.**

| Permitido en el plugin | Prohibido en el plugin |
|---|---|
| Pestaña de ajustes (autenticación, carpetas de destino, `.kiboignore`) — inevitable, hay que meter credenciales en algún sitio | Racha, HP, XP, nivel, áreas |
| Indicador de estado en la barra inferior (sincronizado / pendiente / error) | Lista de hábitos del día y sus casillas |
| Comandos en la paleta: *Enviar selección a Kibo*, *Sincronizar ahora*, *Estructurar esto* | Misiones, cofres, KIBO, cosméticos |
| Un aviso puntual y descartable cuando hay registros pendientes de confirmar **en Kibo** | Panel lateral de Kibo, dashboards, gráficas |

La confirmación de UC-8 ocurre **en Kibo**, no en Obsidian. El plugin como mucho avisa que hay algo que
confirmar. Esa es la frontera y conviene que esté escrita antes de que alguien proponga "un panelito chiquito".

**Nota, y la cedo:** si el conector debe funcionar **sin Obsidian abierto**, un plugin no basta y hay que hablar
de agente local. Dato que le sirve al especialista de sincronización: **[V]** Obsidian lanzó un **cliente
headless de Sync** y una **CLI** en febrero de 2026 (`obsidian.md/roadmap/`, consultado 2026-08-08). No es mi
ámbito; lo dejo señalado.

---

## 6 · UC-10 · Mapeo asistido de campos

Esta era la pregunta 3. Es el caso con mejor relación valor/riesgo del catálogo entero, **si y sólo si** se
respeta una distinción que casi nadie hace.

### 6.1 Diseño

**Entrada — y aquí está la mejor propiedad de este caso de uso:** el modelo no ve ni una nota. Ve un
**inventario**:

```json
{
  "vault_note_count": 5012,
  "keys": [
    { "key": "fecha",   "count": 4812, "inferred_type": "date",   "examples": ["2026-03-04", "2025-11-20", "2024-08-01"] },
    { "key": "médico",  "count": 318,  "inferred_type": "text",   "examples": ["Dra. Ramírez", "Dr. Solís"] },
    { "key": "estado",  "count": 2201, "inferred_type": "text",   "examples": ["activo", "pendiente", "Jalisco"] }
  ]
}
```

Para una bóveda de 5,000 notas eso son **~4,000 tokens**. **[S]** El número de claves distintas en una bóveda
madura suele estar entre 60 y 120; a validar. Los valores de ejemplo de claves de texto libre se truncan, y
cualquier clave que caiga bajo `.kiboignore` se omite.

**Salida — un artefacto declarativo, legible y versionado:**

```yaml
version: 1
generated_at: 2026-08-08
model_id: claude-sonnet-5
prompt_version: 3
mappings:
  - from: fecha
    to: date
    transform: iso_date
    confidence: 0.97
    affects_notes: 4812
    examples: ["2026-03-04", "2025-11-20"]
  - from: médico
    to: doctor
    transform: identity
    confidence: 0.93
    affects_notes: 318
unmapped:
  - key: estado
    reason: "ambiguo — los ejemplos mezclan estatus de tarea ('activo', 'pendiente') con entidad geográfica ('Jalisco')"
```

**La abstención es una salida de primera clase, no un fallo.** El schema obliga a que toda clave del inventario
aparezca o en `mappings` o en `unmapped` con una razón. Un mapeo inventado es el daño; una clave sin mapear es
una molestia de treinta segundos.

**Revisión humana:** el usuario ve **una tabla**, no un JSON — *de → a*, cuántas notas afecta, tres ejemplos.
Si hay más de ~25 filas, se agrupan por confianza y se ofrece "aceptar todas las de alta confianza" con las
ambiguas separadas. **[S]**

### 6.2 "¿Qué pasa cuando se equivoca sobre una bóveda de 5,000 notas?" — la distinción que lo decide todo

| | **Mapeo de lectura** (bóveda → Kibo) | **Mapeo de escritura** (renombrar `fecha:` → `date:` en 5,000 archivos) |
|---|---|---|
| Qué es | Una **transformación** al importar | Una **mutación masiva** del vault |
| Daño si se equivoca | Datos mal tipados **dentro de Kibo** | 5,000 archivos alterados; Dataview y Bases del usuario rotos |
| Reversibilidad | **Total y trivial**: se corrige el perfil y se re-importa | En la práctica, ninguna sin respaldo externo |
| Recomendación | **Construir** | **NO ofrecer en v1** |

**Postura:** el mapeo es de lectura. **Kibo se adapta a la convención del usuario; no le reescribe la bóveda.**
Y no es sólo prudencia: es la lectura coherente del encuadre. *Si Kibo normaliza el vault del usuario, no está
aprovechando Obsidian — lo está colonizando.* El objetivo declarado es aprovechar ambas herramientas, y una
herramienta que exige que la otra hable su idioma no está interoperando.

**Consecuencia directa:** el riesgo de "equivocarse sobre 5,000 notas" **no existe**, porque no se tocan 5,000
notas. Lo peor que pasa es que Kibo tenga 318 registros con el campo `doctor` vacío hasta que se corrija el
perfil y se reimporte.

Si algún día se ofreciera escritura masiva (y mi recomendación es que no): dry-run con diff por archivo,
manifiesto inverso completo, lotes de ≤200 archivos con checkpoint, y respaldo o repositorio git verificado
como precondición bloqueante.

### 6.3 Evals y criterios de aceptación

**Dataset:** ~15 perfiles de bóveda sintéticos —español, inglés, mixto; P.A.R.A., Zettelkasten, Johnny Decimal;
con y sin Dataview— cada uno con su mapeo correcto anotado a mano, e **incluyendo deliberadamente claves
ambiguas cuya respuesta correcta es "no mapea"**. Ese subconjunto es el que mide lo que importa.

| Métrica | Umbral | Por qué |
|---|---|---|
| **Precisión de los mapeos propuestos** | **≥ 0.95** | Un mapeo malo aceptado es el daño real |
| **Tasa de mapeo falso** (propone mapeo donde la verdad es "no mapea") | **≤ 0.02** | Es el fallo silencioso: el usuario acepta sin pensar |
| **Abstención correcta** sobre el subconjunto ambiguo | **≥ 0.90** | Mide si el modelo sabe decir "no sé" |
| Cobertura (recall sobre claves que sí mapean) | ≥ 0.80 | Secundaria: una clave sin mapear se resuelve a mano |
| Propuestas con ≥1 ejemplo y conteo de notas afectadas | **100 %** | Sin eso, el usuario no puede revisar |
| Perfil producido es YAML válido contra el schema | **100 %** | Garantizado por structured outputs **[V]** |

**Criterio de aceptación de producto:** un usuario con una bóveda real debe poder revisar el perfil completo en
**menos de tres minutos**. Si no, la tabla está mal diseñada, aunque el modelo acierte.

---

## 7 · Enmienda a la frontera de datos: salud

Esta era la pregunta 5, y tiene razón el planteamiento: R1 §0 metió dos cosas distintas en la misma casilla.
Las separo y doy postura sobre cada una. **La decisión final es de `security-auditor` y de un ADR; esto es la
postura desde el diseño de la IA.**

### 7.1 (a) Que Kibo escriba salud a la bóveda local del usuario → **permitido, y es lo correcto**

R1 §0 dijo "nunca sale del equipo del usuario". Escribir a una carpeta del disco del propio usuario **no es
salir del equipo: es exactamente lo contrario.** Es repatriación de datos, va en la dirección que el producto
promete (archivos abiertos, del usuario, para siempre) y es la mitad "Kibo → Obsidian" de la interoperabilidad.
Bloquearlo sería aplicar la regla al revés.

**Condiciones, no negociables:**

1. **Destino explícito y por tipo de registro.** El usuario elige si Salud se proyecta y a qué carpeta. Por
   defecto: **no se proyecta**.
2. **Zona de solo escritura — figura nueva que resuelve el bucle.** La carpeta a la que Kibo proyecta Salud está
   **`.kiboignore`-ada por defecto**. Kibo escribe ahí; **la IA de Kibo nunca la lee de vuelta**. Obsidian, el
   usuario, Dataview y Bases sí. Esto cierra la puerta a que un dato de salud entre a un prompt por la puerta
   de atrás —a través del índice de la bóveda— que es exactamente cómo se rompen estas garantías en la práctica.
3. **Sin telemetría de contenido.** Ni tamaño por tipo de registro, ni conteos por especialidad. Sólo "escritura
   OK / falló".
4. **Visible y desactivable en un clic**, con la lista de qué tipos de registro se proyectan.

### 7.2 (b) Que la salud entre a un prompt → **prohibida por defecto, con una excepción estrecha y nombrada**

Aquí no hay salida elegante: el ejemplo central de Sergio *requiere* que el texto "me subió el losartán a 50"
pase por un modelo. Las tres opciones son prohibir (mata el caso estrella), permitir sin más (viola el Art. 3 de
la constitución en espíritu) o **permitir bajo un régimen específico, escrito y estrecho**. Elijo la tercera.

**Se parte la clase Roja de R1 §0:**

| | **Roja-A — nunca, bajo ninguna circunstancia** | **Roja-B — sólo en el "turno de estructuración"** |
|---|---|---|
| Qué | Expediente de salud completo, historial de signos, entrenos agregados · **toda** la información financiera | El **fragmento concreto** que el usuario decide estructurar |
| A un prompt | **Jamás** | Sólo bajo las siete reglas de abajo |

**Las siete reglas del turno de estructuración:**

1. **Invocado, no barrido.** Lo dispara el usuario sobre un texto concreto, o la compuerta léxica sobre la nota
   del día con la feature activada explícitamente. **Nunca un recorrido automático del vault.**
2. **Viaja el fragmento, no la nota, y jamás el expediente.** El prompt contiene la frase relevante y su
   contexto inmediato. Nada más.
3. **Asimetría de contexto — la regla más importante.** El prompt de estructuración de salud **no recibe** el
   historial clínico del usuario, ni sus medicaciones activas, ni sus signos, ni registros previos. Es
   **transcripción estructural sin contexto clínico**. Esto es a la vez más privado *y más seguro*: sin
   historial, el modelo no puede razonar clínicamente aunque quisiera, y no puede producir una correlación que
   parezca un consejo médico.
4. **Sin viaje de vuelta.** Un registro de salud ya estructurado en Kibo **no vuelve a enviarse a un LLM
   jamás** — ni para el coach, ni para insights, ni para estadísticas, ni para "resumir tu año".
5. **Cero salud en features agregadas.** El coach semanal (R1 §UC-5) opera sobre clase Verde y **no incluye
   ningún dato de salud**, ni siquiera conteos. Sin excepción.
6. **Consentimiento propio, separado y revocable**, por tipo de registro. No hereda del consentimiento de la
   bóveda. Y con modo "estructurar sólo en local" para quien lo quiera — **aquí el BYO-endpoint de R1 §3.4 sí
   tiene un uso real y justificado**, a diferencia de las demás features.
7. **Retención mínima disponible.** Verificar con `security-auditor` la elegibilidad ZDR de esta ruta concreta.
   Dato ya verificado y relevante: **[V]** el MCP connector **no es elegible para ZDR**
   (`platform.claude.com/docs/en/docs/agents-and-tools/mcp-connector`, consultado 2026-08-08) — lo cual es
   otra razón para que ninguna ruta de salud pase por MCP.

**Y una salvaguarda de producto, categórica:** Kibo **transcribe estructura; no interpreta, no aconseja, no
valida dosis contra ninguna base de datos farmacológica**. Cualquier deriva hacia *"esta dosis parece alta"* o
*"este medicamento interactúa con..."* es funcionalidad de dispositivo médico y está fuera de alcance de forma
categórica, no negociable por prioridad ni por demanda de usuarios. El validador de plausibilidad de §3.3 marca
ámbar por **discrepancia con lo escrito**, nunca por criterio clínico.

### 7.3 Finanzas: **no se abre**

El ejemplo de Sergio es salud. Finanzas se queda **íntegra en Roja-A**: el Art. 3 de la constitución es
explícito y no admite la lectura que hicimos para salud. Si algún día se quiere "estructurar un gasto desde
prosa", requiere su propio ADR, su propia revisión y su propia decisión — **no hereda este precedente**. Lo
digo aquí precisamente porque los regímenes de excepción se ensanchan solos si no se les pone el límite por
escrito.

---

## 8 · Coste recalculado

**Fuente de precios [V]:** `platform.claude.com/docs/en/docs/about-claude/pricing`, consultada **2026-08-08**.
Recordatorio vigente: `claude-sonnet-5` está a **$2/$10 por MTok hasta el 31 de agosto de 2026**; desde el
**1 de septiembre de 2026** pasa a **$3/$15**. `claude-haiku-4-5` a $1/$5. Batch API: **−50 %**. Lectura de
caché: **0.1×** de la entrada base.

### 8.1 Supuestos nuevos [S]

| Supuesto | Valor |
|---|---|
| Registros estructurados al mes por usuario activo | 6 |
| Días al mes en que dispara la compuerta léxica sin que L2 de UC-1 haya corrido | ~3.3 (15 %) |
| Prompt de UC-8 | 1,200 tok de schema (compartido entre usuarios ⇒ cacheable) + 1,000 tok variables · salida 600 tok |
| Detector de compuerta (cuando hace falta) | Haiku, 900 tok entrada + 80 salida |
| UC-9 con cuerpo redactado (opcional, apagado por defecto) | Haiku, 800 tok entrada + 300 salida |
| UC-10 | Una sola vez: Sonnet 5, 4,000 tok entrada + 1,500 salida |

### 8.2 Los casos nuevos

| Concepto | Modelo | Intro (≤31-ago-2026) | Estándar (≥1-sep-2026) |
|---|---|---|---|
| UC-8 · extracción tipada (6/mes) | `claude-sonnet-5` | $0.062 | $0.094 |
| UC-8 · detector de compuerta | `claude-haiku-4-5` | $0.004 | $0.004 |
| UC-9 · serializador | — | **$0.000** | **$0.000** |
| UC-9 · cuerpo redactado *(opcional, off)* | `claude-haiku-4-5` | $0.014 | $0.014 |
| UC-10 · mapeo de campos | `claude-sonnet-5` | **$0.023 una sola vez** | **$0.035 una sola vez** |

Con prompt caching sobre el bloque de schema de UC-8 (1,200 de 2,200 tokens, idéntico entre usuarios) el coste
recurrente de UC-8 baja ~20 %, a ~$0.049 intro. No lo incorporo a los totales: sólo aplica con tráfico continuo
y prefiero que la cifra sea conservadora.

### 8.3 Dos perfiles de coste

**Perfil Interop** — lo que el reencuadre hace posible: UC-1 + UC-8 + UC-9 + UC-5. **Sin índice de bóveda.**

| Concepto | Intro | Estándar |
|---|---|---|
| UC-1 · eventos de juego | $0.025 | $0.025 |
| UC-8 · registros tipados (+ detector) | $0.066 | $0.098 |
| UC-9 · cuerpo redactado (opcional) | $0.014 | $0.014 |
| UC-5 · coach semanal (Batch) | $0.024 | $0.035 |
| **Embeddings e índice de bóveda** | **$0.000** | **$0.000** |
| **Total recurrente / usuario activo / mes** | **≈ $0.13** | **≈ $0.17** |
| UC-10, una sola vez | $0.023 | $0.035 |

**Perfil Completo** — añade UC-2, UC-4 y UC-6, y con ellos el índice de bóveda:

| Concepto | Intro | Estándar |
|---|---|---|
| Perfil Interop | $0.129 | $0.172 |
| UC-2 · misiones de enlace | $0.073 | $0.109 |
| UC-4 · síntesis de lectura | $0.072 | $0.108 |
| UC-6 · temas del diario | $0.010 | $0.010 |
| Embeddings incrementales | $0.002 | $0.002 |
| **Total recurrente / usuario activo / mes** | **≈ $0.29** | **≈ $0.40** |
| Índice inicial de la bóveda, una sola vez | $0.008 – $0.75 | $0.008 – $0.75 |

*(R1 §6.3 estimaba $0.21 / $0.29 sin los casos nuevos. El perfil Completo sube porque añade UC-8 y UC-9.)*

### 8.4 Las tres lecturas que importan

1. **El perfil Interop cuesta la mitad que el Completo y entrega el reencuadre entero.** $0.13 al mes por
   usuario activo, sin índice, sin subir la bóveda, sin `pgvector`, sin coste de arranque. Es una señal fuerte:
   **la versión más privada de este producto es también la más barata y la más rápida de construir.** Cuando la
   privacidad, el coste y el tiempo de entrega apuntan al mismo diseño, ese es el diseño.
2. **UC-2 y UC-3 son la mitad del coste recurrente y todo el coste de privacidad.** Juntas añaden $0.075/mes y
   obligan a subir y embeber la bóveda completa. Esa relación —poco valor incremental, todo el riesgo— es la
   justificación numérica de bajarlas a P3/P4.
3. **UC-10 es gratis en la práctica.** $0.023 una vez para desbloquear una bóveda preexistente de 5,000 notas.
   Es el mejor retorno del catálogo con diferencia.

**Sin cambios respecto a R1:** el modelo por caso de uso (R1 §6.2) sigue vigente. `claude-sonnet-5` para UC-8
por la razón obvia: es la llamada que pobla registros de dominio, y ahí Haiku no da la exactitud que se
necesita. Si un eval demuestra que Haiku alcanza los umbrales de §3.3 en un tipo de registro no sensible
(lectura, entreno), se baja **ese tipo**, no la política. Salud se queda en Sonnet 5 pase lo que pase.

---

## 9 · Recomendación revisada

### 9.1 Qué se construye primero (orden actualizado)

1. **`GameEventLedger` reversible + parser L0/L1** — sin cambio respecto a R1 §7.1. Sigue siendo 0 % IA y sigue
   siendo el prerequisito de todo.
2. **`ExtractionService` con dos perfiles: UC-1 (`catalog_reference`) y UC-8 (`typed_record`)** — un solo motor,
   dos salidas (§2.1). Empezar con **un solo tipo de registro no sensible** (sesión de lectura o entreno) para
   validar la cascada, los semáforos y la regla de tedio **antes** de tocar salud.
3. **UC-9, el serializador** — determinista, barato, y es la mitad "Kibo → Obsidian" de la interoperabilidad.
4. **UC-10, el mapeo asistido, sólo de lectura** — desbloquea toda bóveda preexistente por $0.023.
5. **Salud como tipo de registro**, sólo después de que 2, 3 y 4 estén medidos, y sólo con el régimen de §7
   escrito, aprobado y con dueño.
6. UC-5 coach y UC-4 lectura, sin cambio respecto a R1.

**En paralelo desde el día uno:** los datasets de evals. A los de R1 §5.4 se añaden dos:
- `evals/typed-records/v1.jsonl` — 60–80 fragmentos en es-MX por tipo de registro, con **≥30 % adversariales**:
  ambigüedad de unidad ("me subió a 50"), fechas relativas encadenadas ("me quiere ver en tres meses, o sea
  para noviembre"), sujeto ajeno ("acompañé a mi mamá al cardiólogo"), negación ("cancelé la consulta"),
  registros parciales, y **dos registros en la misma frase**.
- `evals/field-mapping/v1/` — los 15 perfiles de bóveda de §6.3, con el subconjunto de claves ambiguas.

### 9.2 Qué se descarta o se aplaza (delta sobre R1 §7.2)

| | Estado |
|---|---|
| **UC-2 misiones de enlace** | **Se aplaza a P3.** No se descarta —es una feature del PRD §3.12— pero no entra hasta que exista una razón para subir la bóveda completa |
| **UC-3 RAG / consulta sobre bóveda** | **Se aplaza a P4.** Con él, `pgvector`, el índice y todo el coste de arranque |
| **Modo B (embeddings en el plugin)** | **Descartado como arquitectura.** Sobrevive como opción avanzada opt-in, no construida en v1 |
| **Mapeo de escritura (normalizar el vault del usuario)** | **Descartado, y recomiendo que se quede descartado** |
| **Cualquier salud en features agregadas** | **Descartado categóricamente** — coach, insights, estadísticas |
| **Finanzas en cualquier feature de IA** | **Descartado.** No hereda el precedente de salud |
| Todo lo demás de R1 §7.2 (chat genérico, inferencia de mood, auto-tagging, MCP en v1, frameworks) | Sin cambio |

### 9.3 Las tres cosas que más me preocupan (actualizadas)

**1 · Un campo mal transcrito en un registro de salud.**
Sustituye y agrava a la preocupación #1 de R1. Es el mismo mecanismo —el modelo produciendo un dato que el
usuario acepta sin mirar— con una consecuencia peor: XP falso corrompe un juego; una dosis mal transcrita
corrompe un registro que alguien puede consultar en una sala de espera. Las defensas están diseñadas
(evidencia literal obligatoria por campo, cantidades que deben aparecer como dígito en el texto, `null` antes
que inventar, semáforo ámbar, regla de tedio, asimetría de contexto), pero **todas dependen de que el usuario
mire la tarjeta**, y la regla de tedio existe precisamente porque sé que a partir del registro número veinte
va a dejar de mirarla. Por eso el orden de §9.1 empieza por un tipo de registro no sensible: hay que medir la
tasa real de corrección humana antes de que el dominio sea salud.

**2 · La bóveda del usuario como superficie mutable.**
UC-9 y UC-10 son las primeras features que **escriben** en archivos del usuario. La deriva de "proyectar un
registro" a "normalizar tu bóveda" es corta, tentadora, y sobre miles de archivos es irreversible en la
práctica. Ahí está mi línea más firme del documento: **mapeo de lectura sí, de escritura no.** Y bajo esta
misma preocupación cae la inyección de prompt: la nota diaria ahora alimenta un extractor de *registros*, no
sólo de eventos, y el vault contiene texto que Kibo no escribió (recortes web, notas compartidas). El riesgo
baja respecto a R1 —porque UC-2 y el MCP se aplazan— pero no desaparece: sube donde antes no estaba.

**3 · Que el régimen de excepción para salud se ensanche solo.**
Hoy es "el turno de estructuración": un fragmento, invocado, sin contexto clínico, sin viaje de vuelta.
Dentro de seis meses la petición razonable será *"el coach ya tiene mis consultas registradas, ¿por qué no las
menciona?"*, y será fácil decir que sí porque el dato "ya está en Kibo". **Los regímenes de excepción se
ensanchan por gravedad del producto salvo que tengan un límite escrito y un dueño.** Por eso las siete reglas
de §7.2 están numeradas, por eso la regla 4 ("sin viaje de vuelta") y la 5 ("cero salud en agregados") están
redactadas como prohibiciones absolutas y no como preferencias, y por eso esto debe terminar en un ADR con
nombre y firma —no en un párrafo de un análisis.

---

## Anexo · Fuentes nuevas de esta ronda (consultadas 2026-08-08)

- `obsidian.md/help/properties` — tipos de propiedad de Obsidian (`text`, `list`, `number`, `checkbox`, `date`,
  `datetime`), frontmatter YAML en la línea 1
- `obsidianmate.com/article/obsidian-properties-complete-guide`, `danholloran.me/posts/obsidian-properties-and-frontmatter-a-practical-guide`,
  `got.md/obsidian-bases/` — convenciones de propiedades, relación con Bases y Dataview
- `platform.claude.com/docs/en/docs/build-with-claude/structured-outputs` — confirmación de que `enum`,
  `format: "date"` y `strict: true` están soportados, y de que **no** hay restricciones numéricas
  (`minimum`/`maximum`) ni de longitud de cadena
- `platform.claude.com/docs/en/docs/about-claude/pricing` — precios vigentes, fin del precio introductorio de
  Sonnet 5 el 31-ago-2026, descuento del 50 % de Batch, multiplicadores de caché
- `platform.claude.com/docs/en/docs/agents-and-tools/mcp-connector` — no elegibilidad para ZDR
- `obsidian.md/roadmap/` — cliente headless de Sync y CLI (feb-2026)

*(El resto de fuentes está en el anexo de `02-capa-ia.md` y sigue vigente.)*
