# Brief — Análisis de integración Kibo ↔ Obsidian

**Fecha:** 2026-08-08 · **Solicitante:** Sergio Tortolero · **Coordinador:** Claude (hilo principal)
**Estado:** paquete de contexto para los especialistas. NO es el análisis; es el insumo.

---

## 0 · Qué se pide

Analizar cómo integrar **Kibo** (Personal OS gamificado, web) con **Obsidian** (gestor de
notas local-first en Markdown), buscando *compatibilizar y potenciar* el "cerebro" de notas
del usuario, aprovechando **IA y sincronización**.

El PRD de Kibo ya trae un primer análisis en su §4 (`docs/product/PRD-kibo.md`). El trabajo de
los especialistas es **validarlo, retarlo y profundizarlo** — no repetirlo. Si una conclusión
del §4 está mal o es incompleta, hay que decirlo con argumento.

---

## 1 · Respuestas de Sergio (decisiones de encuadre — vinculantes)

| Pregunta | Respuesta |
|---|---|
| ¿Para quién optimizamos? | **Producto multiusuario.** La integración es una feature vendible de Kibo. Sergio es usuario cero, pero no se diseña solo para su máquina. |
| ¿Cómo está su Obsidian hoy? | **No lo usa. No lo tiene instalado ni tiene vault creado.** Lo está evaluando. |
| ¿Fuente de la verdad? | Que el análisis lo determine con criterios, **pero su inclinación es bidireccional real**. |
| ¿Setup actual? | **Nada de Obsidian instalado.** Sin vault, sin plugins, sin sync configurado. |

### Implicaciones que cada especialista debe asumir

1. **No hay vault heredado que respetar.** Se puede diseñar la estructura desde cero. Ventaja
   (libertad de convención) y riesgo (Sergio no tiene intuición de usuario Obsidian).
2. **Sergio no pertenece a la comunidad a la que le vamos a vender.** Es un riesgo de producto
   real y debe evaluarse explícitamente, no ignorarse.
3. **Su inclinación (bidireccional) es la ruta más cara y frágil.** Si el análisis concluye
   otra cosa, hay que decirlo con evidencia y trade-offs, no complacer.
4. **Kibo es web.** Un producto web tocando una carpeta local del usuario es el problema
   técnico central. Toda propuesta debe declarar cómo lo resuelve.

---

## 2 · Estado real de Kibo (verificado, 2026-08-08)

### 2.1 Dónde vive el producto
- **Maqueta funcional (lo vivo, lo actual):** proyecto de Claude Design
  `61019dd9-20da-4d8a-b904-c60d3358abd2`. ~40 pantallas JSX, design system propio,
  PRD y specs. Es el artefacto donde Sergio está definiendo funcionalidad.
- **Repo local (`Proyectos/Personal/Kibo/`):** monorepo pnpm + Turbo **casi vacío**, scaffold
  inicial. `apps/web` (Next.js + Auth.js + shadcn), `apps/api` (NestJS), `packages/database`
  (Prisma + Postgres), `packages/ui`, `packages/config`.
- **Brecha:** la maqueta va MUY por delante del código. El esquema Prisma actual solo modela
  `User`, `Account`, `Session`, `VerificationToken`, `Attribute`, `UserAttribute`.
  **No existe ninguna entidad de notas, tareas, hábitos, áreas ni proyectos en la base.**
  Cualquier propuesta de modelo de datos es greenfield.

### 2.2 Esquema Prisma existente (íntegro)
```
User (id, name, email, emailVerified, image, username, passwordHash, bio, dateOfBirth,
      gender, firstName, lastName, tier[FREE|HERO|LEGEND], kiboCoins, maxCustomSlots,
      createdAt, updatedAt) → accounts[], sessions[], attributes[]
Account / Session / VerificationToken  → estándar Auth.js
Attribute (id, name, description, color, icon, type[BASE|CUSTOM]) → users[]
UserAttribute (userId, attributeId, level, currentXp, isActive)  → PK compuesta
```

---

## 3 · Modelo de dominio de Kibo (destilado del master context v1.0 + PRD v1.0)

### 3.1 Jerarquía de trabajo (5 niveles, bloqueada)
`Área → Proyecto → Tarea → Subtarea → Ítem de checklist`
- Un Proyecto puede vivir dentro de un Área **o** ser independiente (sin Área).
- Completar un Proyecto ligado a Área da XP **a esa Área**. Sin Área → solo XP general del héroe.
- Tarea: prioridad (5 niveles: Urgente→Muy baja), energía/esfuerzo (entero 1–5), tiempo estimado
  (escala Fibonacci/tallas), dependencias `blocked-by`.
- Proyecto: estados `to_do` / `in_progress` / `done`.

### 3.2 Las 5 Áreas base (inmutables)
Vigor · Sabiduría · Riqueza · Comunidad · Voluntad. Cada una con nivel independiente que mide
compromiso a largo plazo (NO son barras de progreso diario). Hay slots de Áreas personalizadas
comprables.

### 3.3 Hábitos y Retos (bosses)
- **Hábito:** nunca pertenece a un Área. Alimenta la racha global y mantiene HP.
  Recompensa = prioridad × esfuerzo. Rachas por hábito + racha global, protectores, tiers de flama.
- **Reto (boss):** compromiso con plazo, dificultad 1–5 → daño −8/−14/−22/−34/−50 HP por fallo,
  20% de fallos tolerados. Solo o compartido con amigos. Al cumplir: estandarte → Logros.

### 3.4 Economía
- **Monedas K** (cerrada): hábitos/tareas/retos → recompensas personales, cofres, cosméticos base.
- **Gemas** (semicerrada, vehículo de monetización futura): cofres, retos difíciles, Premium →
  funciones, cosméticos premium, protectores.
- **XP** no se gasta: sube nivel global y por área. **HP** se pierde al fallar, se recupera con constancia.
- Conversión monedas→gemas SOLO vía cofres (Bronce 250 · Plata 800 · Oro 2,000 · Mítico 5,000).
- Curva de XP exponencial `XP_Required = Base × Nivel²`. Prestigio 1–16.
- Fórmula compuesta: `XP_Total = (Tiempo × Factor_Base) × Mult_Energía × Mult_Prioridad`.

### 3.5 Racha (global, única)
Un contador global por usuario. Un día cuenta si se completa ≥1 tarea o ≥1 hábito.
Sin actividad y sin protector → racha a cero. Máximo 2 protectores en stock, sin límite mensual.

### 3.6 Recursos — el módulo bisagra (§3.12 del PRD)
**Este es el punto de contacto principal con Obsidian.** Según el PRD v1.0:
- Notas **Markdown puro** con `[[enlaces dobles]]`, tags `#`, carpetas, backlinks y favoritas.
- Capa gamificada: XP a **Sabiduría** por escribir, racha de escritura, y las **notas huérfanas**
  (sin enlaces) se convierten en "**misiones de enlace**".
- Pulso del módulo: total de notas, escritas/semana, enlaces, huérfanas, racha.
- Banner e instalación de la integración con Obsidian.
- Es **módulo premium** (histórico: 300 gemas de desbloqueo).

> **Advertencia de vigencia:** la spec vieja `docs/specs/recursos.md` (2026-05-30) describe
> Recursos como un *stub* (`ComingSoon` + candado premium, sin funcionalidad). El PRD del
> 8-ago-2026 lo describe ya como bóveda de conocimiento con wikilinks y backlinks. **El PRD
> manda**; la spec vieja quedó superada por la maqueta actual.

### 3.7 Otros módulos con superficie de contacto
- **Diario:** entradas con mood, gratitud, aprendizaje, fecha retroactiva → mapea a *daily notes*.
- **Lectura:** libros, sesiones, notas con cita/foto/dictado → mapea a *literature notes*.
- **Tareas/Proyectos:** kanban + cronograma → mapea al plugin Tasks (`- [ ]` con fechas).
- **Estudio:** agenda académica, materias con rúbricas, cursos.
- **Finanzas · Salud:** datos sensibles. No tienen equivalente en Obsidian.
- **Cuenta y Configuración → Integraciones:** ya contempla Obsidian, Google Calendar, Salud, Notion.
- **Tienda → Funciones → *Inteligencia*:** pack IA, coach semanal, estadísticas avanzadas.
  Es el envoltorio comercial donde caería la IA sobre el vault.

### 3.8 Requisitos funcionales colindantes (del master context v1.0)
| RF | Nombre | Estado |
|---|---|---|
| RF-07 | Notes Integration (Google Keep, OneNote) | Identificado, sin especificar |
| RF-08 | External Task Sync (Google Tasks, MS To Do) | Identificado — **bidireccional confirmado** |
| RF-09 | Google Calendar Integration | Identificado, sin especificar |
| RF-14 | Reading Log & Knowledge Synthesis | Identificado — dictado + síntesis IA a notas |

> RF-08 ya comprometió sync bidireccional con Google Tasks / MS To Do. **Cualquier arquitectura
> de sync con Obsidian debería ser el mismo motor, no uno paralelo.** Evaluarlo explícitamente.

### 3.9 Nota P.A.R.A.
Kibo está *inspirado* en P.A.R.A. de Tiago Forte pero no lo replica: usa Proyectos, Áreas y
Recursos; el concepto de **Archivo está fuera de alcance**. Relevante porque P.A.R.A. es una de
las estructuras de vault más difundidas en la comunidad Obsidian.

---

## 4 · Marca, voz y principios (restricciones de diseño)
- **"El fracaso reencauza"** — los tropiezos redirigen, nunca castigan ni avergüenzan.
- Voz cercana, motivadora, **es-MX primero**.
- Gamificación **invisible / accesible a público general**, no estética "gamer".
- Visual claro tipo Duolingo. Mascota **KIBO** (blob de gel teal) transversal.
- Respeta `prefers-reduced-motion`.
- Fuera de alcance por ahora: tema oscuro, apps nativas, multiusuario en un mismo tablero.

---

## 5 · Lo que el PRD §4 ya concluyó (a validar o refutar)

El PRD identifica 5 puntos técnicos de integración: (1) carpeta de `.md` accesible por
File System Access API o app/agente local; (2) esquema `obsidian://`; (3) plugin comunitario
*Local REST API*; (4) plugin propio "Kibo para Obsidian"; (5) import/export Markdown.

Y propone 3 fases: **F0** formato compatible por diseño + import/export · **F1** plugin propio
con racha/hábitos/enviar-nota · **F2** espejo bidireccional vía Local REST API o agente local.

Con un **"no hacer"**: no reconstruir grafo/editor dentro de Kibo, y **no meter metadata
gamificada en el frontmatter del usuario** (promesa de "archivos limpios").

Métrica declarada: ≥25% de usuarios de Recursos con bóveda vinculada a los 90 días de F2.

> **Puntos que el análisis DEBE cuestionar, no dar por buenos:**
> - ¿"Archivos limpios sin frontmatter" es compatible con sync bidireccional real? Sin un
>   identificador estable en el archivo, ¿cómo se reconcilia un renombrado o un movimiento?
> - ¿El plugin propio es viable como estrategia de distribución para un producto que aún no
>   existe, y qué implica el review de la comunidad Obsidian?
> - ¿La métrica de 25% es alcanzable o es un número puesto sin base?
> - ¿Obsidian es el socio correcto, o el objetivo real es "compatible con Markdown/local-first"
>   (Obsidian + Logseq + cualquier carpeta), que es más ancho y más barato?

---

## 6 · Restricciones de gobierno (constitución del workspace — aplican en pleno)
- **Art. 1 — Secretos:** ninguna credencial, token ni connection string en código, docs o logs.
- **Art. 3 — Información financiera:** no retener ni reproducir información financiera personal.
  Kibo tiene módulo de Finanzas: cualquier ruta que envíe datos financieros a un LLM o a la nube
  es un punto de análisis obligatorio, no un detalle.
- **Art. 5 — Documentar antes de construir:** PRD antes de feature, ADR antes de decisión
  arquitectónica. Este análisis debe desembocar en un ADR.
- **Art. 9 — Mínimo privilegio.**
- **Art. 11 — Higiene de comentarios:** jamás narrar instrucciones/aprobaciones de Sergio en código.

---

## 7 · Convenciones de entrega
- **Idioma:** español (continúa el PRD, que está en español). Identificadores, claves de
  frontmatter, nombres de tabla/campo y código: en inglés.
- **Ruta de entrega:** `docs/analysis/obsidian/<NN>-<slug>.md` dentro del repo de Kibo
  (`Proyectos/Personal/Kibo/`). Cada especialista escribe UN archivo.
- **Formato:** Markdown con encabezados, tablas para comparativas, y una sección final
  **"Recomendación"** con postura explícita — no un menú de opciones sin veredicto.
- **Evidencia:** si se afirma algo sobre Obsidian, su API, sus plugins o su comunidad, se cita
  la fuente y la fecha. Distinguir siempre **hecho verificado** de **supuesto**.
- **Prohibido:** inventar cifras de mercado, precios o límites de API sin fuente.
