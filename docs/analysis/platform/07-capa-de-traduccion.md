# 07 · La capa de traducción — de Kibo a una carpeta Markdown

**Fecha:** 2026-08-08 · **Autor:** `web-architect` · **Tipo:** especificación de implementación
**Alcance:** el formato que Kibo emite y cómo llega al disco del usuario. **Nada más.**
**Fuera de alcance por instrucción:** stack, esquema Prisma, seguridad a fondo, hoja de ruta, IA más allá de §5. Cuando algo ya está resuelto en otro documento lo referencio (`R1 §x`, `R2 §x`, `15-r2 §x`) y no lo repito.

**Premisa de dirección.** Este documento especifica **una sola dirección: Kibo → carpeta.** Kibo escribe; no lee de vuelta. Esa restricción no es una limitación pendiente de levantar: es la que hace que toda la sección §6 sea demostrablemente segura. Donde una futura ingesta cambiaría algo, lo marco con ⚖️.

---

## 1 · El árbol de carpetas

### 1.1 Reglas que lo gobiernan

1. **Una sola raíz.** Todo lo que Kibo escribe vive bajo `Kibo/` en la raíz de la bóveda. Kibo **nunca** escribe un byte fuera de ese árbol. Es la garantía que permite decirle al usuario, sin letra chica: *"si borras esta carpeta, tu bóveda queda exactamente como estaba."*
2. **Legible sin manual.** Los nombres de carpeta describen el contenido, no el modelo de datos. Nada de `entities/`, `records/` ni `type_3/`.
3. **Profundidad según volumen.** Partición por fecha **solo** en los tipos que crecen sin techo (diario, sesiones, registros médicos, movimientos). Los tipos estables y de baja cardinalidad (áreas, proyectos, hábitos, libros) van planos, porque se buscan por nombre.
4. **Lo sensible en una sub-raíz separable.** Todo C4 bajo `Kibo/Private/`, una sola carpeta que el usuario puede excluir de git, de la sincronización selectiva o del respaldo, en un solo gesto (`15-r2` KS-29).
5. **Los hubs reciben enlaces, no los emiten.** Un área no enlaza a sus proyectos; los proyectos enlazan al área. Así el área acumula backlinks sin que Kibo tenga que mantener listas.

### 1.2 El árbol

```
Kibo/
  README.md                                  ← qué es esto, quién lo escribe, cómo se regenera
  .kibo/
    manifest.json                            ← estado de emisión (§6). Oculto: Obsidian ignora los dotfiles

  Areas/
    Vigor.md
    Wisdom.md
    Wealth.md
    Community.md
    Willpower.md

  Projects/
    Kibo MVP.md
    Kitchen remodel.md

  Habits/
    Read 20 minutes.md
    Morning walk.md
    _Archive/
      Cold showers.md

  Challenges/
    30 days without sugar.md

  Journal/
    2026/
      2026-08-07.md
      2026-08-08.md                          ← la nota diaria: el hub temporal

  Reading/
    Books/
      Thinking in Systems — Donella Meadows.md
    Sessions/
      2026/
        2026-08-08 Thinking in Systems.md

  Study/
    Subjects/
      Statistics II.md
    Courses/
      Systems thinking — Coursera.md

  People/
    Abel Martínez.md

  Private/                                   ← C4. Una sola carpeta que el usuario excluye
    People/
      Dra. Laura Pérez.md                    ← proveedores de salud viven AQUÍ (§1.4)
    Health/
      Visits/
        2026/
          2026-08-08-01.md
      Prescriptions/
        2026/
          2026-08-08-01.md
      Vitals/
        2026-08.md                           ← un archivo por mes, tabla dentro
    Finance/
      Movements/
        2026-08.md                           ← un archivo por mes, tabla dentro
```

### 1.3 Decisiones que hay que ratificar antes del primer release

- **Idioma de las carpetas.** El árbol de arriba está en inglés. Kibo es es-MX primero, así que lo natural sería `Diario/`, `Hábitos/`, `Proyectos/`. **Hay que decidirlo ahora**, porque renombrar carpetas después es una migración **en discos ajenos**: solo corre cuando cada usuario ejecuta la regeneración, puede quedar a medias, y rompe las consultas de Dataview que el usuario haya escrito encima. Mi recomendación: **carpetas en español**, con el idioma fijado al vincular y no modificable después sin una migración explícita y anunciada. Las **claves de frontmatter se quedan en inglés siempre** — son vocabulario técnico y su estabilidad vale más que su legibilidad.
- **Raíz configurable.** `Kibo/` es el valor por omisión. Si ya existe una carpeta con ese nombre y **no** contiene `.kibo/manifest.json`, Kibo se detiene y pide otra raíz. Nunca se fusiona con una carpeta ajena (§6.7).

### 1.4 Por qué los proveedores de salud viven en `Private/People/`

Aquí colisionan dos cosas que valen mucho y hay que resolverlo explícitamente, porque cada una la defendió un análisis distinto:

- El **"ajá"** del producto (síntesis R2 §6) es *el primer backlink que no pediste*: abrir la nota `Dra. Laura Pérez` y ver cuatro consultas colgando sin haber configurado nada.
- **KS-30** (`15-r2` §3) prohíbe wikilinks salientes desde una nota C4, porque el backlink aparece en la nota destino, que puede vivir fuera de la carpeta privada y revelar la asociación aunque el contenido nunca salga.

**Solución: la nota de la persona vive dentro de la sub-raíz privada.** Así el enlace de la consulta apunta a un destino que también está en `Private/`, se cumple la condición literal de KS-30 ("solo enlazar a entidades que también viven dentro de la sub-raíz privada"), y el "ajá" sobrevive intacto.

Regla general: **una nota de persona vive en la sub-raíz más restrictiva desde la que se le enlaza.** Si a una persona la referencia cualquier registro C4, su nota es privada.

---

## 2 · El contrato de frontmatter

### 2.1 Claves de sistema, en todos los archivos que Kibo genera

```yaml
kibo-id: 9f2c1d84-3b77-4a10-8e2f-0c5db1a77e01   # identidad estable; NUNCA la ruta
kibo-type: medical-visit                          # kebab-case, vocabulario cerrado
kibo-rev: 3                                       # revisión del registro en Kibo
kibo-updated: 2026-08-08T18:02:11-06:00           # ISO 8601 con desfase explícito
```

Y un tag de sello, siempre, en el espacio de nombres `kibo/`:

```yaml
tags:
  - kibo/medical-visit
```

El sello vale más de lo que parece: `#kibo/` selecciona **todo lo que Kibo escribió** en una consulta, en una búsqueda o en una exclusión. Es la forma más simple de que el usuario pueda decir "muéstrame solo lo mío" o "excluye lo de Kibo".

**Convenciones de nombrado de claves**, fijas para todo el contrato:

| Regla | Valor |
|---|---|
| Estilo | `kebab-case`, inglés, singular salvo colecciones |
| Prefijo `kibo-` | **Solo** las cuatro claves de sistema. Las de dominio van sin prefijo (`due`, `status`, `area`) porque es lo que Dataview, Bases y el plugin Tasks esperan |
| Fechas | `YYYY-MM-DD` para fechas; ISO 8601 con desfase para instantes |
| Booleanos | `true` / `false` literales. Nunca `yes`/`no`/`on`/`off` — YAML 1.1 los coacciona y produce el *Norway problem* (`15-r2` §6) |
| Nulos | La clave **se omite**, nunca se emite `null` ni cadena vacía |
| Enumeraciones | `snake_case` en inglés, vocabulario cerrado y documentado |
| Colecciones | Siempre lista YAML, aunque tenga un solo elemento |

### 2.2 Cómo se emiten las relaciones

Regla de R2, aquí concretada: **cada relación se emite dos veces.**

1. En **frontmatter**, para que Bases y Dataview la puedan consultar como columna.
2. En el **cuerpo**, para que el grafo de Obsidian dibuje la arista — el soporte nativo de backlinks desde frontmatter es limitado, y el grafo es donde ocurre el "ajá".

Y una regla de forma que resuelve un problema real:

> **Todo wikilink que Kibo emite usa la ruta absoluta de bóveda más un alias de presentación:** `[[Kibo/Areas/Wisdom|Sabiduría]]`.

Motivo: Obsidian resuelve `[[Wisdom]]` por proximidad, y si el usuario ya tiene un archivo con ese nombre, el enlace de Kibo apunta al suyo. Kibo **no puede saber** qué hay en la bóveda del usuario en la vía de entrega por `.zip` (§4), así que la forma corta no es segura en general. La forma larga es inequívoca en las tres vías de entrega, produce exactamente la misma arista en el grafo, y se renderiza como el alias — el usuario ve `Sabiduría`.

### 2.3 Qué es archivo y qué es línea

No todo registro merece un archivo. Emitir un archivo por tarea completada son ~3,600 archivos al año que convierten la bóveda en ruido.

| Forma | Cuándo | Tipos |
|---|---|---|
| **Nota-registro** (un archivo, con `kibo-id`) | Sustantivos con identidad y relaciones, de cardinalidad baja o media | area, project, habit, challenge, journal-entry, book, reading-session, subject, course, person, medical-visit, prescription |
| **Línea-registro** (una línea dentro de una nota contenedora) | Eventos de alto volumen | task |
| **Fila de tabla** (dentro de un archivo mensual) | Series y movimientos | vital-sign, financial-movement |
| **Agregado** (resumen dentro de la nota del sustantivo) | Cumplimientos de hábito | habit check-in |

### 2.4 Contrato por tipo

Notación: `†` = clave opcional · `[[ ]]` = relación emitida también en el cuerpo.

---

#### `area` — `Areas/<Name>.md`

```yaml
kibo-type: area
name: Wisdom
description: Intellect, learning, and mental clarity.
color: "#2563EB"
created: 2026-01-15
tags: [kibo/area]
```

Sin nivel, sin XP (§3). Es un **hub**: no emite enlaces; los recibe. Cuerpo: la descripción y una sección `## Notas` libre para el usuario.

---

#### `project` — `Projects/<Title>.md`

```yaml
kibo-type: project
title: Kibo MVP
status: in_progress          # to_do | in_progress | done
area: "[[Kibo/Areas/Wisdom|Sabiduría]]"      # opcional: un proyecto puede no tener área
started: 2026-07-01
due: 2026-09-30†
completed: †
complexity: 4                # 1–5
tags: [kibo/project]
```

Cuerpo: `## Descripción`, `## Tareas` (líneas-registro, §2.4 `task`), `## Notas`.

---

#### `task` — línea, no archivo

Vive en dos sitios generados: la nota del proyecto (`## Tareas`) y la nota diaria del día en que se completó (`## Tareas completadas`). Si la tarea no tiene proyecto, va a `Projects/Inbox.md`.

```markdown
- [x] Preparar minuta de arranque [id:: 4c1a] [priority:: high] [effort:: 3] [due:: 2026-08-08] [done:: 2026-08-08]
- [ ] Redactar ADR de stack [id:: 7b02] [priority:: urgent] [effort:: 5] [due:: 2026-08-12]
```

- Campos como **inline fields de Dataview** (`[clave:: valor]`), que son texto plano y además consultables.
- `id` es un prefijo corto del `kibo-id`, suficiente para que la regeneración sea determinista sin ensuciar la línea.
- `priority`: `urgent | high | medium | low | very_low`. `effort`: entero 1–5.
- **Ajuste opcional `tasks-plugin-compat`**: añade los emoji del plugin Tasks (`📅 2026-08-12 ✅ 2026-08-08`). Desactivado por omisión, porque es la convención de un plugin concreto y ensucia la línea para quien no lo usa.

---

#### `habit` — `Habits/<Name>.md`

```yaml
kibo-type: habit
name: Read 20 minutes
frequency: daily             # daily | weekly | custom
effort: 2                    # 1–5
priority: medium
started: 2026-03-01
archived: †
tags: [kibo/habit]
```

Sin área: en el modelo de Kibo un hábito nunca pertenece a un área (PRD §3.3). Sin racha, sin recompensa, sin XP (§3).

Cuerpo — el **registro de constancia**, agregado por mes:

```markdown
## Registro

| Mes | Cumplidos | Posibles |
|---|---|---|
| 2026-08 | 24 | 31 |
| 2026-07 | 28 | 31 |
```

El detalle día a día no se duplica aquí: vive en la nota diaria, que es donde tiene contexto.

---

#### `challenge` — `Challenges/<Name>.md`

```yaml
kibo-type: challenge
name: 30 days without sugar
status: active               # active | completed | failed | abandoned
difficulty: 3                # 1–5
starts: 2026-08-01
ends: 2026-08-30
shared: true
participants: ["Abel", "Luis"]     # texto plano, no wikilinks (§3)
tags: [kibo/challenge]
```

Cuerpo: `## Registro` (bitácora diaria de cumplimiento) y `## Reflexión` (texto del usuario). **Sin daño de HP, sin fallos tolerados restantes, sin recompensa** (§3).

---

#### `journal-entry` — `Journal/<YYYY>/<YYYY-MM-DD>.md`

Es **el archivo más valioso del árbol**: el hub temporal donde converge todo lo del día, y el que hace que el grafo se encienda.

```yaml
kibo-type: journal-entry
date: 2026-08-08
mood: 4                      # 1–5
gratitude: Que la casa estuviera en silencio toda la mañana.†
learning: Los bucles de refuerzo no se sienten hasta que ya llevan meses corriendo.†
tags: [kibo/journal-entry]
```

Cuerpo generado, en este orden fijo:

```markdown
## Diario
(texto del usuario)

## Hábitos
- [x] [[Kibo/Habits/Read 20 minutes|Leer 20 minutos]]
- [ ] [[Kibo/Habits/Morning walk|Caminata matutina]]

## Tareas completadas
- [x] Preparar minuta de arranque [id:: 4c1a] [effort:: 3]

## Registros del día
- [[Kibo/Reading/Sessions/2026/2026-08-08 Thinking in Systems|Sesión de lectura]]
- [[Kibo/Private/Health/Visits/2026/2026-08-08-01|Registro de salud]]
```

---

#### `book` — `Reading/Books/<Title> — <Author>.md`

```yaml
kibo-type: book
title: Thinking in Systems
author: Donella Meadows
status: reading              # to_read | reading | finished | abandoned
started: 2026-07-20
finished: †
pages: 240
rating: †                    # 1–5
isbn: 9781603580557†
tags: [kibo/book]
```

Hub: recibe backlinks de sus sesiones.

---

#### `reading-session` — `Reading/Sessions/<YYYY>/<YYYY-MM-DD> <Book>.md`

```yaml
kibo-type: reading-session
date: 2026-08-08
book: "[[Kibo/Reading/Books/Thinking in Systems — Donella Meadows|Thinking in Systems]]"
minutes: 25
pages-read: 14
tags: [kibo/reading-session]
```

Cuerpo: `## Notas` y `## Citas` (texto y citas del usuario). Es de los pocos tipos donde el cuerpo pesa más que el frontmatter.

---

#### `subject` — `Study/Subjects/<Name>.md` · `course` — `Study/Courses/<Name>.md`

```yaml
kibo-type: subject
name: Statistics II
institution: UANL†
term: 2026-2
status: in_progress          # planned | in_progress | finished | dropped
area: "[[Kibo/Areas/Wisdom|Sabiduría]]"
tags: [kibo/subject]
```

```yaml
kibo-type: course
name: Systems thinking
provider: Coursera
status: in_progress
started: 2026-06-10
progress: 40                 # porcentaje, derivado de módulos completados
area: "[[Kibo/Areas/Wisdom|Sabiduría]]"
tags: [kibo/course]
```

Las rúbricas 1–5 por materia van en el cuerpo, como tabla, no en frontmatter: son varias por materia y no se consultan transversalmente.

---

#### `person` — `People/<Name>.md` o `Private/People/<Name>.md`

```yaml
kibo-type: person
name: Dra. Laura Pérez
role: healthcare-provider    # healthcare-provider | friend | colleague | other
specialty: Dermatología†
tags: [kibo/person]
```

**Sin teléfono, sin correo, sin dirección** (§3). Es un hub para que los backlinks tengan dónde aterrizar.

---

#### `medical-visit` — `Private/Health/Visits/<YYYY>/<YYYY-MM-DD>-<NN>.md`

Nombre de archivo **neutro por omisión**: fecha y secuencia. `Consulta oncología — Dr. Ramírez.md` filtraría tanto como el contenido (`15-r2` §1.6). El título elocuente es un ajuste que el usuario activa.

**Forma por omisión — `POINTER`** (`15-r2` KS-28): sin carga clínica en disco.

```yaml
kibo-type: medical-visit
date: 2026-08-08
provider: "[[Kibo/Private/People/Dra. Laura Pérez|Dra. Laura Pérez]]"
follow-up: 2026-09-05†
kibo-link: https://app.kibo.mx/health/visits/9f2c1d84
tags: [kibo/medical-visit]
```

```markdown
## Registro
Este registro vive en Kibo. Ábrelo para ver el detalle.
[Abrir en Kibo](https://app.kibo.mx/health/visits/9f2c1d84)
```

**Forma `FULL`** — escalada con consentimiento propio y explícito:

```yaml
kibo-type: medical-visit
date: 2026-08-08
specialty: Dermatología
provider: "[[Kibo/Private/People/Dra. Laura Pérez|Dra. Laura Pérez]]"
facility: Clínica Del Valle
follow-up: 2026-09-05
prescriptions:
  - "[[Kibo/Private/Health/Prescriptions/2026/2026-08-08-01|Receta 1]]"
tags: [kibo/medical-visit]
```

Cuerpo (solo en `FULL`): `## Motivo`, `## Diagnóstico`, `## Indicaciones`, `## Notas`.

---

#### `prescription` — `Private/Health/Prescriptions/<YYYY>/<YYYY-MM-DD>-<NN>.md`

Solo existe como archivo en forma `FULL`. En forma `POINTER` la receta no se emite.

```yaml
kibo-type: prescription
drug: Isotretinoína
dose: "20 mg"                # SIEMPRE entrecomillado: sin comillas, "010" se lee como octal
frequency: "1 vez al día"
route: oral
starts: 2026-08-08
ends: 2026-11-08
visit: "[[Kibo/Private/Health/Visits/2026/2026-08-08-01|Consulta 2026-08-08]]"
tags: [kibo/prescription]
```

> **Regla dura:** toda dosis, cantidad y unidad se emite **entrecomillada como cadena**. YAML 1.1 convierte `010` en 8 y `no` en `false`. En una dosis eso deja de ser un error de formato y pasa a ser un error clínico (`15-r2` §6).

---

#### `vital-log` — `Private/Health/Vitals/<YYYY-MM>.md`

Un archivo por mes. Las lecturas crudas no se emiten (§3); se emiten los **agregados diarios**.

```yaml
kibo-type: vital-log
month: 2026-08
kinds: [weight, bp_sys, bp_dia]
tags: [kibo/vital-log]
```

```markdown
| date | kind | min | max | avg | unit | samples |
|---|---|---|---|---|---|---|
| 2026-08-07 | weight | 78.4 | 78.4 | 78.4 | kg | 1 |
| 2026-08-08 | bp_sys | 118 | 124 | 121 | mmHg | 2 |
```

---

#### `finance-log` — `Private/Finance/Movements/<YYYY-MM>.md`

```yaml
kibo-type: finance-log
month: 2026-08
currency: MXN
tags: [kibo/finance-log]
```

```markdown
| date | direction | amount | category | account | description |
|---|---|---|---|---|---|
| 2026-08-03 | out | 480.00 | food | Tarjeta principal | Despensa |
| 2026-08-05 | in | 24500.00 | salary | Cuenta de nómina | Quincena |
```

`account` es **la etiqueta que el usuario le puso**, nunca un identificador. Sin número de cuenta, sin CLABE, sin últimos cuatro dígitos, sin saldo, sin límite de crédito (§3).

---

## 3 · Qué NO se traduce, y por qué

Esta sección existe para que dentro de seis meses nadie agregue una clave "porque se puede". Está redactada como lista de exclusión, y §3.2 dice cómo se hace cumplir.

### 3.1 La lista

| No se emite | Por qué |
|---|---|
| **XP, nivel, prestigio, paragón** | Es un número derivado del que un archivo no puede ser autoridad. Publicarlo enseña al usuario que es editable, y ⚖️ el día que exista ingesta, `xp: 99999` es una **afirmación**, no un hecho (`15-r2` KS-34). El coste de sacarlo después es mucho mayor que el de no meterlo |
| **HP, monedas K, gemas** | Igual que arriba, y además convierte la carpeta en un volcado de estado de juego en vez de un registro de vida. Es exactamente lo que hace que un usuario de Obsidian desinstale |
| **Contador de racha, protectores, tiers de flama** | Es estado de juego. **Sí se emite el registro de constancia** (qué días cumpliste), que es un hecho; no el número que Kibo calcula a partir de él. Esa es la línea, y es nítida: *hechos sí, puntuación no* |
| **Logros, trofeos, estandartes, cosméticos, guardarropa de KIBO** | No aporta nada leído como archivo, y menos a un modelo |
| **Cofres y sus probabilidades** | Mecánica de juego pura |
| **Números de cuenta, CLABE, PAN o últimos cuatro dígitos, saldos, límites de crédito, números de póliza, credenciales** | Habilitan **fraude**, no divulgación. Ningún consentimiento del titular protege al banco de enfrente (`15-r2` D-17). Prohibido con o sin consentimiento |
| **Teléfonos, correos y direcciones de terceros** | Datos personales de otras personas que Kibo no necesita en disco para nada |
| **Feed social: actividad de amigos, aplausos, empujones, marcadores de retos compartidos** | Datos de terceros, efímeros y sin valor como archivo |
| **Lecturas crudas de sensores** (cada muestra de frecuencia cardiaca) | 100,000 filas al año que nadie lee. Se emiten los agregados diarios |
| **Identificadores internos distintos de `kibo-id`** | Claves foráneas crudas, enums sin traducir, ids de fila. Ruido que no significa nada fuera de Kibo |
| **Configuración, notificaciones, sesiones, registros de auditoría** | Estado del sistema, no del usuario |

### 3.2 Cómo se hace cumplir

Escribirlo en un documento no basta. Tres mecanismos, en orden de fuerza:

1. **Bandera `neverProject` a nivel de campo** en el mapa de proyección. Es dato, no política: el motor no puede emitir un campo marcado así, ni con consentimiento.
2. **Vocabulario prohibido en pruebas.** Una prueba del motor recorre la salida completa de un usuario sintético y **falla** si aparece cualquiera de las claves proscritas (`xp`, `hp`, `coins`, `gems`, `streak`, `balance`, `account-number`, `clabe`, `pan`…). Añadir una de ellas obliga a borrar una línea de una lista de prohibiciones dentro de un *pull request*, que es exactamente la fricción que se busca.
3. **Revisión obligatoria del contrato.** Cualquier clave nueva sube la versión del vocabulario, y subir la versión reescribe archivos en discos ajenos (§6.8). Ese coste, hecho visible, es el mejor filtro que existe.

---

## 4 · Las tres vías de entrega

### 4.1 Comparación

| | **(a) Exportar `.zip`** | **(b) Escribir a la nube del usuario por API** | **(c) Componente local** |
|---|---|---|---|
| **Qué se implementa** | Motor de traducción + empaquetado + endpoint de descarga + manifiesto | Motor + OAuth de Google Drive y de Microsoft Graph + custodia de tokens + resolución de rutas + detección de cambios + mantenimiento de dos APIs ajenas | Motor + emparejamiento + bucle de descarga + escritura atómica en disco (el conector delgado de R2 §3) |
| **Esfuerzo** | 1–2 semanas (el motor aparte) | 4–6 semanas por dos proveedores, más mantenimiento permanente | 3–4 semanas |
| **Fricción para el usuario** | Alta y **recurrente**: descargar, descomprimir sobre la carpeta, cada vez | **La más baja**: autoriza una vez y ya | Media, **una sola vez**: instalar y emparejar con un código |
| **Plataformas** | Escritorio: trivial. Android: descargar sí, descomprimir dentro de la bóveda es doloroso | Todas por igual, incluido Android | **Solo escritorio** |
| **Continuidad** | Manual | Continua | Continua |
| **Qué la descalifica** | Nada la descalifica; simplemente no deleita | **Cambia la naturaleza jurídica del acto** (§4.2) | Que no funciona en móvil, y que exige instalar algo |

### 4.2 Por qué (b) queda descalificada, aunque sea la más cómoda

Es la vía que un product manager elegiría primero: cero instalación, funciona en Android, funciona igual en todas partes. Y es la que hay que rechazar, por una razón que no es técnica.

Todo el permiso para escribir datos de salud en la carpeta del usuario descansa en una distinción: **escribir en el disco del propio usuario es una divulgación al titular, no una transferencia a un tercero** (`15-r2` §1.4–§1.5). Si el servidor de Kibo toma un token OAuth del Drive del usuario y sube ahí el expediente, ese acto vuelve a ser **una transferencia a un encargado tercero (Google o Microsoft), ejecutada por Kibo, desde infraestructura de Kibo**. Se pierde exactamente la propiedad que permitió levantar la prohibición.

Y además Kibo pasaría a custodiar una credencial de acceso al Drive **completo** del usuario —no solo a una carpeta—, que es un secreto de altísimo valor y multiplica el radio de una brecha.

> Si alguna vez se reconsidera, **no es un detalle de implementación: reabre el análisis de salud entero** y hay que tratarlo como transferencia.

### 4.3 Recomendación para la v1: (a) primero, (c) después, (b) nunca

**Empezar por el `.zip`.** El argumento es de secuencia y es fuerte:

1. **El formato es el producto; el transporte es un detalle actualizable.** Los bytes de §2 son idénticos en las tres vías. Construir primero la vía sin maquinaria de distribución permite validar y corregir el contrato de frontmatter —que es la parte difícil y la que genera deuda en discos ajenos— **antes** de que exista un solo usuario con una carpeta vinculada.
2. **Ya es trabajo obligatorio.** El PRD §3.14 ya promete *"exportar todo (Markdown/CSV)"*, y el Art. 12 de la constitución exige exportación en formato abierto como función, no como favor. La vía (a) no es trabajo extra: es trabajo que hay que hacer igual, hecho bien.
3. **Es demostrable el día uno.** Sergio genera su `.zip`, lo descomprime, lo abre en Obsidian y ve el resultado. Sin plugin, sin emparejamiento, sin instalar nada. Y la validación más barata que se propuso en la ronda 2 —mandar a cinco personas el `.md` de un registro real suyo y ver qué hacen— sale gratis.
4. **No puede romper nada.** El árbol es autocontenido bajo `Kibo/`. En el peor caso el usuario descomprime mal y tiene una carpeta de más.

**Después el componente local**, que entrega exactamente los mismos bytes de forma continua. Y para Android, la respuesta honesta ya está establecida: **el teléfono no escribe la bóveda**; lo que se captura en el móvil llega a la carpeta por la vía del servidor y del componente de escritorio, la próxima vez que el usuario abra su PC. Eso es explicable en una frase y es lo que ya espera cualquiera con un vault sincronizado — **siempre que se diga desde el principio y no se insinúe lo contrario en el material de producto.**

---

## 5 · Por qué esto es legible por una IA

### 5.1 Las razones, ordenadas por peso

1. **Es texto plano.** No hay contenedor propietario, ni binario, ni base de datos que abrir. Un modelo lo ingiere directamente: se arrastra la carpeta a un chat, se apunta un agente con acceso a disco, se sube a un cuaderno. **Cero integración.** Ése es literalmente el argumento comercial, y es cierto.
2. **El frontmatter YAML son hechos tipados y nombrados por documento.** Es el formato de cabecera que más ha visto un modelo durante su entrenamiento —está en millones de repositorios y sitios estáticos—, así que no hay que enseñarle a leerlo. `date: 2026-08-08` no requiere interpretación.
3. **Los encabezados Markdown dan estructura sin ruido de marcado.** Un modelo puede trocear por `##` y saber de qué trata cada trozo. Trocear un PDF o un HTML es adivinar; trocear Markdown es determinista.
4. **Los wikilinks son relaciones explícitas y resolubles, en línea.** Al leer `provider: "[[…Dra. Laura Pérez]]"` el modelo no tiene que hacer resolución de entidades: la relación ya está afirmada y el destino existe como archivo. Es lo más cerca de un grafo de conocimiento que puede expresar una carpeta.
5. **Es autodescriptivo por la ruta.** `Kibo/Reading/Sessions/2026/2026-08-08 Thinking in Systems.md` dice qué es, de cuándo y de qué, antes de abrirlo.
6. **El vocabulario es estable.** `due` significa lo mismo en los 3,000 archivos. Un modelo generaliza desde tres ejemplos al corpus entero.
7. **Un registro = un archivo = una unidad de recuperación.** No hay que partir a la mitad de un hecho para que quepa en un fragmento.

### 5.2 Las salvedades, para que se pueda defender sin exagerar

- Un modelo leyendo archivos **no es una base de datos**: sobre 10,000 archivos no garantiza exhaustividad sin un buen mecanismo de recuperación. Agregaciones del tipo *"cuánto gasté en el segundo trimestre"* las contesta mejor Kibo, que tiene SQL.
- **Lo que pongas en la carpeta lo lee cualquier IA a la que apuntes la carpeta.** Es la misma propiedad, vista desde el otro lado. Por eso los registros de salud son nota-puntero por omisión (§2.4).

### 5.3 La demostración

Ocho archivos, tal como quedarían en disco. Nótese que se enlazan entre sí sin que nadie configure nada.

---

**`Kibo/README.md`**

```markdown
# Kibo

Esta carpeta la genera Kibo automáticamente. Todo lo que hay aquí sale de tus
registros en la aplicación.

- Kibo **solo** escribe dentro de esta carpeta. Si la borras, tu bóveda queda igual que antes.
- Puedes editar el cuerpo de cualquier nota: Kibo respeta tu texto y solo regenera sus propias
  secciones y el frontmatter.
- Si borras un archivo de aquí, **no se borra nada en Kibo**. Volverá a aparecer en la próxima
  generación.
- La carpeta `Private/` contiene tus registros sensibles. Puedes excluirla de tu sincronización
  o de tu repositorio sin afectar al resto.

Generado: 2026-08-08T18:02:11-06:00 · Vocabulario v1
```

---

**`Kibo/Areas/Wisdom.md`**

```markdown
---
kibo-id: 1a5f0c22-9e31-4d7a-b8c4-2f77a90b1e05
kibo-type: area
kibo-rev: 1
kibo-updated: 2026-08-08T18:02:11-06:00
name: Wisdom
description: Intelecto, aprendizaje y claridad mental.
color: "#2563EB"
created: 2026-01-15
tags:
  - kibo/area
---

## Descripción
Intelecto, aprendizaje y claridad mental.

## Notas
```

---

**`Kibo/Habits/Read 20 minutes.md`**

```markdown
---
kibo-id: 3d80b7e1-40cc-4a09-9f11-6b2ca7d05e88
kibo-type: habit
kibo-rev: 12
kibo-updated: 2026-08-08T18:02:11-06:00
name: Read 20 minutes
frequency: daily
effort: 2
priority: medium
started: 2026-03-01
tags:
  - kibo/habit
---

## Registro

| Mes | Cumplidos | Posibles |
|---|---|---|
| 2026-08 | 6 | 8 |
| 2026-07 | 28 | 31 |
```

---

**`Kibo/Projects/Kibo MVP.md`**

```markdown
---
kibo-id: 6e2b91a4-77d3-42fb-8c05-1aa4e0c93b17
kibo-type: project
kibo-rev: 8
kibo-updated: 2026-08-08T18:02:11-06:00
title: Kibo MVP
status: in_progress
area: "[[Kibo/Areas/Wisdom|Sabiduría]]"
started: 2026-07-01
due: 2026-09-30
complexity: 4
tags:
  - kibo/project
---

## Descripción
Primera versión utilizable del sistema operativo personal.
Área: [[Kibo/Areas/Wisdom|Sabiduría]]

## Tareas
- [x] Preparar minuta de arranque [id:: 4c1a] [priority:: high] [effort:: 3] [due:: 2026-08-08] [done:: 2026-08-08]
- [ ] Redactar ADR de stack [id:: 7b02] [priority:: urgent] [effort:: 5] [due:: 2026-08-12]

## Notas
```

---

**`Kibo/Reading/Books/Thinking in Systems — Donella Meadows.md`**

```markdown
---
kibo-id: b4f7c209-15ae-4c88-9d3e-88b0f2a51c40
kibo-type: book
kibo-rev: 4
kibo-updated: 2026-08-08T18:02:11-06:00
title: Thinking in Systems
author: Donella Meadows
status: reading
started: 2026-07-20
pages: 240
tags:
  - kibo/book
---

## Notas
```

---

**`Kibo/Reading/Sessions/2026/2026-08-08 Thinking in Systems.md`**

```markdown
---
kibo-id: cc019d3a-6b2f-4e51-a0f7-3d92e1b4c778
kibo-type: reading-session
kibo-rev: 1
kibo-updated: 2026-08-08T18:02:11-06:00
date: 2026-08-08
book: "[[Kibo/Reading/Books/Thinking in Systems — Donella Meadows|Thinking in Systems]]"
minutes: 25
pages-read: 14
tags:
  - kibo/reading-session
---

Sesión sobre [[Kibo/Reading/Books/Thinking in Systems — Donella Meadows|Thinking in Systems]].

## Notas
Los bucles de refuerzo no se sienten hasta que ya llevan meses corriendo. Aplica igual
a la racha de un hábito que a la deuda técnica.

## Citas
> "The behavior of a system cannot be known just by knowing the elements of which the system is made."
```

---

**`Kibo/Journal/2026/2026-08-08.md`**

```markdown
---
kibo-id: 0f3ac581-2d94-4bb7-89e6-51ca7f20d3b9
kibo-type: journal-entry
kibo-rev: 3
kibo-updated: 2026-08-08T18:02:11-06:00
date: 2026-08-08
mood: 4
gratitude: Que la casa estuviera en silencio toda la mañana.
learning: Los bucles de refuerzo no se sienten hasta que ya llevan meses corriendo.
tags:
  - kibo/journal-entry
---

## Diario
Día tranquilo. Avancé en el proyecto y por fin fui a la cita que llevaba meses posponiendo.

## Hábitos
- [x] [[Kibo/Habits/Read 20 minutes|Leer 20 minutos]]
- [ ] [[Kibo/Habits/Morning walk|Caminata matutina]]

## Tareas completadas
- [x] Preparar minuta de arranque [id:: 4c1a] [effort:: 3]

## Registros del día
- [[Kibo/Reading/Sessions/2026/2026-08-08 Thinking in Systems|Sesión de lectura]]
- [[Kibo/Private/Health/Visits/2026/2026-08-08-01|Registro de salud]]
```

---

**`Kibo/Private/Health/Visits/2026/2026-08-08-01.md`** *(forma `POINTER`, la de omisión)*

```markdown
---
kibo-id: 9f2c1d84-3b77-4a10-8e2f-0c5db1a77e01
kibo-type: medical-visit
kibo-rev: 2
kibo-updated: 2026-08-08T18:02:11-06:00
date: 2026-08-08
provider: "[[Kibo/Private/People/Dra. Laura Pérez|Dra. Laura Pérez]]"
follow-up: 2026-09-05
kibo-link: https://app.kibo.mx/health/visits/9f2c1d84
tags:
  - kibo/medical-visit
---

## Registro
Consulta con [[Kibo/Private/People/Dra. Laura Pérez|Dra. Laura Pérez]].
El detalle vive en Kibo: [Abrir en Kibo](https://app.kibo.mx/health/visits/9f2c1d84)
```

---

**`Kibo/Private/People/Dra. Laura Pérez.md`**

```markdown
---
kibo-id: 7a4e33f0-c1b8-4d29-92aa-0e6b5c81d704
kibo-type: person
kibo-rev: 1
kibo-updated: 2026-08-08T18:02:11-06:00
name: Dra. Laura Pérez
role: healthcare-provider
tags:
  - kibo/person
---

## Notas
```

---

### 5.4 Dos preguntas que un modelo contesta leyendo esta carpeta, sin ninguna integración

**Pregunta 1 — *"¿Qué he estado leyendo este mes y cómo se conecta con lo que estoy tratando de desarrollar?"***

Cadena de lectura, verificable archivo por archivo:
- `Habits/Read 20 minutes.md` → la tabla dice **6 de 8 días** en agosto. Frecuencia, no anécdota.
- `Reading/Sessions/2026/2026-08-08 …` → la sesión del día: 25 minutos, 14 páginas, con notas y una cita textual.
- El campo `book:` la enlaza a `Reading/Books/Thinking in Systems — Donella Meadows.md`, donde `status: reading` y `started: 2026-07-20` dan el arco temporal.
- `Journal/2026/2026-08-08.md` → `learning:` repite la misma idea que la nota de la sesión, lo que le dice al modelo que **eso fue lo que quedó del día**, no un apunte más.
- Y el cierre: `Projects/Kibo MVP.md` tiene `area: [[…/Wisdom]]`, la misma área que `Study/`… el modelo puede afirmar que la lectura de sistemas y el proyecto en curso comparten área, y citar la frase del diario que lo conecta explícitamente ("aplica igual a la racha de un hábito que a la deuda técnica").

Nada de eso requirió una consulta, un esquema ni una API. Requirió leer siete archivos de texto y seguir cuatro enlaces.

**Pregunta 2 — *"¿Tengo algún seguimiento médico pendiente y con quién?"***

- `Private/Health/Visits/2026/2026-08-08-01.md` → `follow-up: 2026-09-05`, y `provider:` enlaza a la nota de la persona.
- Al abrir `Private/People/Dra. Laura Pérez.md`, Obsidian muestra el backlink de la consulta — **el "ajá" del producto, sin que nadie configurara nada**.

Y aquí la demostración enseña además el diseño de privacidad funcionando: el modelo puede decir **que hay un seguimiento el 5 de septiembre y con quién**, y **no puede decir de qué**, porque el diagnóstico no está en disco. Ése es el dial exacto que se prometió. Si el usuario activa la forma `FULL`, el mismo modelo contesta también el diagnóstico y las recetas — y eso es una decisión suya, tomada a sabiendas, no un efecto colateral.

---

## 6 · Idempotencia y reescritura

### 6.1 Generación determinista

Los mismos registros, con la misma versión de vocabulario, producen **archivos idénticos byte a byte**. Es la propiedad de la que dependen todas las demás. Exige: emisor YAML con versión y opciones fijadas, orden de claves fijo, fechas ISO 8601, `LF`, sin BOM, salto de línea final, normalización NFC. (Detalle en R2 §1.6; no lo repito.)

Sin esto, cada generación reescribe todo, ensucia el historial de git del usuario y hace imposible saber qué cambió de verdad.

### 6.2 La identidad es `kibo-id`, nunca la ruta

Un archivo movido, renombrado o copiado sigue siendo el mismo registro. La ruta es una consecuencia, no un identificador.

### 6.3 El manifiesto

`Kibo/.kibo/manifest.json` — invisible en Obsidian, que ignora los archivos y carpetas que empiezan con punto.

```json
{
  "manifestVersion": 1,
  "vocabularyVersion": 1,
  "generation": 42,
  "generatedAt": "2026-08-08T18:02:11-06:00",
  "root": "Kibo",
  "files": {
    "9f2c1d84-3b77-4a10-8e2f-0c5db1a77e01": {
      "path": "Private/Health/Visits/2026/2026-08-08-01.md",
      "hash": "sha256:6f2a…",
      "rev": 2,
      "shape": "POINTER"
    }
  }
}
```

Es lo que convierte "regenerar" en una operación diferencial en vez de un borrado y reescritura.

### 6.4 Solo se escribe lo que cambió

Por cada registro: se calculan los bytes nuevos; si el hash coincide con el del manifiesto **y** el archivo en disco sigue teniendo ese mismo hash, **no se toca**. Un usuario que no cambió nada y regenera no ve una sola marca de tiempo modificada.

### 6.5 El usuario editó un archivo

Kibo es dueño del **frontmatter y de sus secciones declaradas**; el resto del cuerpo es del usuario. Al regenerar: se lee el archivo existente, se **conservan** las claves de frontmatter que Kibo no conoce (en su posición original) y las secciones del cuerpo que no están en el mapa, y se reescriben solo las regiones de Kibo.

Consecuencia práctica: el usuario puede escribir *"si sigue el dolor, pedir resonancia"* al final de una nota generada y **no lo pierde nunca**.

### 6.6 El usuario movió un archivo

Depende de la vía de entrega, y hay que ser honesto sobre la diferencia:

- **Componente local (c):** puede recorrer el árbol, leer `kibo-id` de los frontmatter, encontrar el archivo en su nueva ubicación, actualizar el manifiesto y **regenerar ahí mismo**. Nunca recrea en la ruta canónica. Si encuentra el mismo `kibo-id` en dos sitios (el usuario copió), regenera el que coincide con el hash del manifiesto y **deja el otro intacto**, avisando en Kibo. Ante la duda, duplicar es reparable; fusionar es pérdida de datos.
- **Exportación `.zip` (a):** no hay forma de saber que el usuario movió algo. Al descomprimir encima, el archivo reaparece en la ruta canónica y el usuario acaba con dos. **Esto tiene que estar escrito en el `README.md` de la carpeta y en la pantalla de descarga**, no en una nota al pie: *"si mueves los archivos que genera Kibo, la próxima exportación los volverá a crear en su lugar original."*

### 6.7 La ausencia de un archivo NUNCA se lee como intención de borrar

Es la regla más importante de esta sección.

> **Kibo no infiere intención de lo que no encuentra.**

Un archivo que no está en disco es indistinguible de: un archivo que el usuario movió fuera de la raíz de Kibo · un archivo que un cliente de nube todavía no ha descargado (marcador de contenido bajo demanda) · un volumen sin montar · una carpeta que el proceso no pudo leer por permisos · una descompresión a medias · una bóveda abierta en una segunda máquina mientras sincroniza · un antivirus en cuarentena.

**Todas esas causas son más probables que "el usuario lo borró y quiere que desaparezca de Kibo."** Y el coste de equivocarse es asimétrico hasta lo absurdo: interpretar mal una ausencia significa borrar registros médicos o financieros del sistema autoritativo por un error de montaje.

Por lo tanto:

1. **El borrado solo se inicia en Kibo.** La carpeta es una señal sobre qué existe, jamás una orden.
2. **Si falta un archivo, se regenera** en la siguiente pasada. Borrar es cómo el usuario pide "vuelve a escribirlo limpio", y eso es un comportamiento entendible y benigno.
3. **Cuando un registro sí se borra en Kibo**, su archivo se manda **a la papelera del sistema**, nunca se elimina de forma irreversible.
4. ⚖️ El día que exista ingesta, esta regla no se debilita: se necesitará una señal **positiva** de borrado (un evento observado de eliminación por un componente que estaba corriendo en ese momento), nunca una comparación entre lo que hay y lo que debería haber.

Nótese que esta regla es gratis precisamente porque la dirección es única. Es una de las razones por las que empezar exportando, y no sincronizando, es tan defendible.

### 6.8 Cambios en el contrato

Subir `vocabularyVersion` **reescribe archivos en el disco de todos los usuarios vinculados**. No es un despliegue: es una migración que solo corre cuando cada usuario ejecuta la generación, que puede quedar a medias, y que rompe las consultas de Dataview que el usuario haya escrito encima.

Requisitos, no recomendaciones:
- La regeneración por cambio de vocabulario es **una acción explícita del usuario**, nunca silenciosa ni en segundo plano.
- La pantalla muestra **cuántos archivos se van a reescribir** antes de confirmar.
- Las claves se **añaden**; renombrar o quitar una exige una versión mayor y un aviso.
- Corolario práctico: **congelar pronto lo irreversible** (las cuatro claves `kibo-*`, la raíz, la propiedad por regiones, la forma de los wikilinks) y dejar el vocabulario de dominio abierto lo más posible mientras el modelo de datos todavía se mueve.

### 6.9 Escritura segura y colisiones

- **Escritura atómica** por archivo: temporal más renombrado, para que una caída nunca deje media nota.
- **Nombres de archivo neutros a la plataforma**, porque el mismo árbol tiene que existir en Windows, macOS y Linux: se sustituyen `\ / : * ? " < > |`, se rechazan los nombres reservados de Windows (`CON`, `PRN`, `AUX`, `NUL`, `COM1`…), se recortan puntos y espacios finales, se acota la longitud, se normaliza a NFC y **se comprueba colisión sin distinguir mayúsculas** — en Windows y macOS `Nota.md` y `nota.md` no pueden coexistir.
- **Colisión al adoptar la raíz:** si existe `Kibo/` y no contiene `.kibo/manifest.json`, Kibo **se detiene y pregunta**. Nunca se fusiona con una carpeta ajena.
- **Entrega parcial degrada bien:** los wikilinks a archivos que aún no existen simplemente quedan sin resolver y se resuelven solos cuando el archivo llega. No hay orden obligatorio de escritura.

---

## Recomendación

**Construir el motor de traducción de §2 y entregarlo primero como `.zip`.** El formato es el producto; el transporte es un detalle que se puede mejorar después sin tocar un solo byte de la salida. La exportación además ya es trabajo obligatorio por el PRD §3.14 y por el Art. 12, así que no es una vía desechable: es la forma correcta de hacer algo que hay que hacer igual. El componente local viene después y entrega exactamente los mismos archivos de forma continua. La escritura a la nube del usuario por API queda descartada, y no por coste: porque convierte una entrega al titular en una transferencia a un tercero y desmonta el permiso sobre el que se apoya todo el caso de salud.

**Las tres cosas que más me preocupan de esta capa**

1. **El vocabulario de claves es deuda en discos ajenos.** Renombrar `due` o `provider` con usuarios vivos no es una migración de base de datos: corre solo cuando cada persona regenera, puede quedar a medias y rompe las consultas que el usuario escribió encima. Congelar ya lo irreversible (las cuatro claves `kibo-*`, la raíz única, la propiedad por regiones, los wikilinks con ruta absoluta) y dejar el vocabulario de dominio abierto hasta que el modelo de datos deje de moverse.

2. **El idioma de las carpetas hay que decidirlo antes del primer archivo emitido.** Parece cosmético y es exactamente el mismo problema del punto anterior, con la agravante de que se nota más: un usuario con `Diario/` y `Journal/` mezclados en su bóveda perdió la confianza. Mi voto es español para carpetas, inglés para claves.

3. **La expectativa de que "todo aparece en mi carpeta desde el teléfono".** Es la promesa que el producto va a estar tentado de hacer y la única que esta arquitectura no puede cumplir: el móvil no escribe la bóveda. Se puede explicar en una frase —lo que capturas en el teléfono llega a tu carpeta la próxima vez que abras tu PC— pero hay que decirlo desde el principio, en la pantalla de conexión y en el `README.md` de la carpeta, no descubrirlo cuando alguien reclame.
