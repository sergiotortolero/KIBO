# PRD — Kibo · Personal OS gamificado

Versión 1.0 · 8 ago 2026 · Documento de análisis por módulo + estudio de compatibilidad con Obsidian.
Audiencia: producto/ingeniería y cualquier analista externo que evalúe integraciones.

---

## 1 · Visión

Kibo es un **Personal OS gamificado**: una plataforma de gestión de vida (hábitos, tareas, proyectos, finanzas, salud, estudio, lectura, diario, notas) envuelta en la mecánica de un **RPG de productividad**. El usuario crea un personaje, sube de nivel cinco **áreas de vida**, mantiene **rachas**, enfrenta **retos** (con HP en juego), y gana **monedas K, gemas y XP** que gasta en recompensas reales autodefinidas, cosméticos y capacidades.

Principio de marca: **"el fracaso reencauza"** — los tropiezos redirigen, nunca castigan ni avergüenzan. Voz: cercana, motivadora, es-MX primero.

La tesis del producto: las herramientas de organización personal (Notion, Obsidian, Todoist) tienen el *modelo de datos* correcto pero retención frágil porque no generan hábito. Kibo agrega la **capa de UI/UX gamificada que lo hace adictivo**: identidad (personaje), pérdida potencial (HP y rachas), recompensa variable (cofres), presión social amable (círculo de amigos) y expresión (cosméticos, vitrina).

---

## 2 · Economía (transversal)

| Divisa | Se gana con | Se gasta en | Glifo |
|---|---|---|---|
| **Monedas K** | Hábitos, tareas, retos cumplidos | Recompensas personales, cofres, cosméticos base | Moneda dorada acuñada con la "K" de Kibo |
| **Gemas (esencia)** | Cofres, retos difíciles, Premium | Funciones, cosméticos premium, protectores | Gota facetada — "esencia de KIBO" |
| **XP** | Toda acción productiva | No se gasta: sube nivel global y por área | — |
| **HP** | Se pierde al fallar retos/hábitos | Se recupera con constancia | Corazón |

Reglas de diseño: la conversión monedas→gemas SOLO vía cofres (loop de recompensa variable con probabilidades **visibles en tooltip**); las gemas nunca compran ventaja injusta en lo social; las recompensas personalizadas solo cuestan monedas (el usuario se premia a sí mismo con su propio esfuerzo).

**Cofres** (Bronce 250 · Plata 800 · Oro 2,000 · Mítico 5,000 monedas): gemas garantizadas por rango + extras con probabilidad declarada. La apertura es una **ceremonia a pantalla completa** (caída → sacudida → estallido → recompensas en cascada) que respeta `prefers-reduced-motion`.

---

## 3 · Módulos

### 3.1 Hoy (dashboard)
Grid editable de widgets (hábitos de hoy, tareas, racha, diario, lectura, combate del reto, clima, balance financiero…). Widgets gratis + premium comprables. Galería para agregar/quitar; filas extra comprables. Sidebar con navegación por secciones (drag para reordenar), racha global fijada y **KIBO** (mascota) como FAB de acción rápida.

### 3.1b Acción rápida y asistente (core anti-fricción)
KIBO abre un **anillo radial** (círculos, estilo GTA-V, contenido en la franja del menú): arco exterior con «Hablar con KIBO» + los rubros, arco interior con las utilerías. Al elegir un rubro los demás **se opacan y encogen**, el elegido crece y de él **emergen círculos pequeños solo-ícono** con sus acciones; cada acción registra **inline, sin navegar** (gasto/ingreso/abono, marcar hábito, vaso de agua, ánimo, nota, páginas, peso, pomodoro). Rubros configurables (Personalizar) y **comprables** en Tienda → Funciones → "Rueda de KIBO". «Hablar con KIBO» abre el **chat a pantalla opacada**: entrada por **voz** (Web Speech, es-MX) o texto → KIBO responde en corto qué entendió y propone los registros detectados ("Gasto de $250 · Comida", "30 páginas leídas", "Fallo registrado") → el usuario confirma uno por uno, y el registro mueve XP y **vida** de verdad. Proveedor del intérprete en Configuración: reglas locales (incluido), **API key propia** (OpenAI/Anthropic/compatible, guardada solo en el dispositivo) o **IA local** vía Ollama (modelo sugerido: llama3.2 3B, ~8 GB RAM). Sidebar **replegable** (botón + modo fijo/replegable en Configuración); el FAB de KIBO acompaña el ancho.

### 3.1c Vida (HP) y reacciones — el motor emocional
HP es **estado real** (0–100, persistido) y la única fuente del ánimo de KIBO: 90+ celebra · 72+ feliz · 55+ tranquilo · 38+ enfocado · 20+ cansado · &lt;20 triste. Ese ánimo pinta cara, boca (tamaño, sitio, inclinación) y saturación del gel — KIBO **no sonríe siempre**. Fallar un reto cuesta vida según su dificultad (−8/−14/−22/−34/−50); cumplir un día cura +4; marcar un hábito cura +3; bajo 30% se enciende la alerta de trance.
Toda acción del sistema pasa por un bus (`kiboLog`) y KIBO **reacciona**: gesticula, saca un objeto de su cuerpo (moneda al mover dinero, flama en racha, corazón en salud, libro al leer, estrella al ganar, golpe al fallar) y lo dice en un bocadillo.

### 3.2 KIBO (mascota transversal)
Blob de gel teal vivo: respira, parpadea, hace travesuras (voltereta, aplastarse, globo, gota, saludo), expresa 8 ánimos con color+cara, abre una **rueda radial** de acciones rápidas y "lee" mensajes morfando en losa. **Guardarropa** (Tienda): pieles (sólidas y animadas), accesorios SVG (lentes, moño, gorra, gorro de mago, corona), auras (dorada, estelar, de racha) y personalidades (frecuencia de travesuras). Todo se refleja **en vivo** en el KIBO del sidebar vía store compartido (`localStorage` + evento `kibo:kibo-change`).

### 3.3 Hábitos
Alta con esfuerzo 1–5 (`RateRow` canónico), prioridad con glifos, periodicidad, hora; recompensa = prioridad × esfuerzo. Rachas por hábito + racha global, protectores, tiers de flama. Gestor con archivado.

### 3.4 Retos (bosses)
Compromisos con plazo, dificultad 1–5 (define daño −8/−14/−22/−34/−50 HP por fallo), fallos tolerados (20%), recompensas al cerrar. **Solo o compartido**: el alta única pregunta "¿solo o con alguien?"; en modo compartido se invita a varios amigos, arranca cuando aceptan, y cada quien juega su HP. Mini-tarjeta en tablero, detalle con registro diario, reflexión y estandarte al cumplir (va a Logros).

### 3.5 Tareas y Proyectos
Kanban con columnas editables + detalle (subtareas, fechas, esfuerzo, prioridad); proyectos con complejidad y avance. **Cronograma compartido** (`KbTimeline`): escalas 1 sem→12 meses + rango personalizado, scroll horizontal, columna fija.

### 3.6 Áreas (5)
Vigor, Sabiduría, Riqueza, Comunidad, Voluntad. XP por área, rangos militares (20 tiers × 9 materiales), prestigio (1–16, Leyenda=Gargantúa), paragón post-máximo. Todo alimentado por los demás módulos.

### 3.7 Progreso / Personaje
Vitrina (carta de presentación), indicadores, prestigio, **Logros**: vitrina-resumen + trofeos mensuales + estandartes de retos + catálogo (público/secreto/oculto, 5 rarezas).

### 3.8 Vitrina (carta de presentación)
Lo que ve la comunidad: portada (fondos comprables, uno animado), marco de foto, **título honorífico** (Madrugador, Inquebrantable, Cazador de jefes…), lema editable, casillas de logros fijados (3 base → 6, ampliable a 9 con función), **compañero KIBO** asomado en la carta (pose feliz/relajado). Slots y cosméticos comprables en Tienda.

### 3.8b Familia (modo padres)
Pestaña dentro de Amigos: miembros con **cuentas protegidas** para menores (sin social público), **misiones** asignables con recompensa en monedas/XP, flujo **hecho → aprobación del padre → pago**, **mesada semanal** ligada a misiones (no al chantaje), co-administración entre adultos y liga privada de rachas entre padres.

### 3.9 Amigos (social)
Sin transferencias de dinero: regalos de items, aportes topados (90%) a listas de deseos, empujones de racha estilo Duolingo, **retos compartidos con marcador por reto** (días cumplidos, fallos, racha interna, quién va arriba), pulso del círculo, actividad agrupada por día con aplausos, búsqueda/solicitudes.

### 3.10 Finanzas
Cuentas y suscripciones (MoneyRow), créditos como tarjeta rica (uso, interés YTD, CAT), deudas con compromiso de pago, metas de ahorro, presupuesto, importación de estados de cuenta, portafolio.

### 3.11 Salud · Estudio · Lectura · Entretenimiento · Diario
Salud: signos, entrenos, expediente. Estudio: agenda académica, materias con rúbricas 1–5, cursos con backlog. Lectura: libros, sesiones, notas con cita/foto/dictado. Entretenimiento: pelis/series con episodios. Diario: entradas con mood, gratitud, aprendizaje, fecha retroactiva.

### 3.12 Recursos (bóveda de conocimiento) — NUEVO
Notas **Markdown puro** con `[[enlaces dobles]]`, tags `#`, carpetas, backlinks y favoritas. Capa gamificada: XP a Sabiduría por escribir, racha de escritura, y las **notas huérfanas** (sin enlaces) se vuelven "misiones de enlace". Pulso: total, escritas/semana, enlaces, huérfanas, racha. Banner e instalación de la integración con Obsidian (ver §5).

### 3.13 Tienda
Pestañas: Módulos premium · Mis recompensas (autodefinidas, solo monedas) · Cofres · Widgets (por sección) · **Funciones** · KIBO cosmético (guardarropa en vivo) · Vitrina. **Funciones** agrupadas: *Más espacio* (área extra, filas, slots, vitrina ampliada), *Más potencia* (prioridades extendidas, importaciones ilimitadas, plantillas pro, modo enfoque, exportar data), *Protección* (protector automático, días sabáticos, rescate de reto), *Inteligencia* (pack IA, coach semanal, estadísticas avanzadas).

### 3.14 Cuenta y Configuración — NUEVO
Cuenta: perfil, correo/contraseña, cuentas conectadas, plan Premium con beneficios y facturas, sesiones activas, exportar todo (Markdown/CSV), eliminar cuenta. Configuración: idioma, inicio de semana, fin de día; notificaciones (racha, hábitos, círculo, resumen); juego y motion (celebraciones, sonidos, menos movimiento, hardcore); privacidad; **integraciones** (Obsidian, Google Calendar, Salud, Notion).

---

## 4 · Obsidian: qué es y cómo se toca con Kibo

**Obsidian** es un gestor de notas local-first: una **bóveda** (carpeta del usuario) de archivos **Markdown planos**, enlazados con `[[wikilinks]]`, con grafo de relaciones, tags, carpetas y un ecosistema de ~2,000 plugins comunitarios. No tiene servidor propio obligatorio (Sync es opcional de pago). Su filosofía: *tus archivos, tu disco, formatos abiertos, para siempre*.

**El solape con Kibo es real pero parcial:**

| Concepto | Obsidian | Kibo |
|---|---|---|
| Notas enlazadas | Núcleo (vault .md) | **Recursos** (mismo modelo) |
| Diario | Plugin Daily Notes | Módulo Diario |
| Tareas | Plugin Tasks (`- [ ]` con fechas) | Módulo Tareas (kanban, esfuerzo, XP) |
| Hábitos/rachas | Plugins sueltos (Habit Tracker) | Núcleo gamificado (HP, retos, economía) |
| Finanzas/Salud/Social/Economía | No existe | Núcleo de Kibo |
| Gamificación | Marginal (plugin Gamification, nicho) | **Toda la propuesta de valor** |

Conclusión del solape: **no competimos en el almacén de conocimiento; competimos en el loop de hábito.** La jugada correcta es tratar a Obsidian como *backend de notas* opcional y a Kibo como *capa de juego y vida*, no reconstruir un editor de grafos completo dentro de Kibo.

### Puntos técnicos de integración disponibles

1. **La bóveda es una carpeta de .md** → cualquier app puede leer/escribir con permisos de archivo. En web: File System Access API (Chromium) o app de escritorio/agente local. Riesgo: conflictos de edición simultánea (se resuelve con "última escritura gana" + respaldo, como hacen los plugins de sync).
2. **URI scheme `obsidian://`** → abrir/crear notas en la app de Obsidian desde Kibo (`obsidian://open?vault=X&file=Y`, `obsidian://new?...`). Costo casi cero; solo profundiza, no sincroniza.
3. **Plugin comunitario "Local REST API"** → expone la bóveda como API HTTP local (CRUD de notas, búsqueda). Kibo (web) podría hablarle directo con permiso del usuario. Requiere que el usuario instale el plugin.
4. **Plugin propio "Kibo para Obsidian"** (TypeScript, API pública de plugins) → dentro de Obsidian: marcar hábitos, ver racha/HP en la barra lateral, mandar notas a Recursos, recibir XP por escribir. Es la vía con mejor experiencia y la que usan los productos serios (Readwise, Todoist, Zotero tienen plugin oficial).
5. **Import/export Markdown** → piso mínimo: Kibo ya exporta todo a Markdown/CSV; importar una bóveda como semilla de Recursos es trivial y sin riesgo.

### Recomendación (fases)

- **F0 — ya cubierto por diseño:** Recursos usa el MISMO modelo mental y formato (.md, wikilinks, tags, carpetas). Nada que convertir después; cero lock-in. Import/export de bóveda como semilla.
- **F1 — Plugin "Kibo para Obsidian"** (esfuerzo medio, valor alto): racha + hábitos del día + "enviar nota a Kibo" dentro de Obsidian; XP por escritura diaria. Kibo se vuelve el loop de hábito de los usuarios de Obsidian sin pedirles migrar.
- **F2 — Espejo bidireccional de Recursos** (esfuerzo alto): sync de carpeta vía Local REST API o agente local. La capa Kibo (XP, misiones, huérfanas) vive FUERA de los .md — los archivos quedan limpios.
- **No hacer:** reconstruir grafo/editor avanzado dentro de Kibo, o guardar metadata gamificada dentro de los archivos del usuario (frontmatter invasivo) — rompe la promesa de archivos limpios y duplica a Obsidian donde es imbatible.

**Veredicto:** compatibilizar, no crear de cero. El modelo de datos de notas ya es idéntico por diseño; la diferenciación de Kibo (economía, HP, rachas, social, KIBO) permanece en Kibo y se *asoma* a Obsidian vía plugin.

---

## 5 · Métricas de éxito (norte)

- D30 de retención > 40% (el loop de racha + círculo es el driver).
- ≥ 1 reto activo por usuario activo semanal.
- ≥ 3 widgets personalizados y ≥ 1 cosmético equipado en el primer mes (expresión = retención).
- Integración Obsidian: ≥ 25% de usuarios de Recursos con bóveda vinculada a los 90 días de F2.
- Asistente: ≥ 50% de los registros diarios entrando por acción rápida o voz (la fricción es el enemigo #1).

## 6 · Fuera de alcance (por ahora)

Tema oscuro (decidido, no construido), apps nativas, multi-usuario en un mismo tablero, marketplace de cosméticos entre usuarios (la economía es personal por diseño).
