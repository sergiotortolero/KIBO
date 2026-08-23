# Handoff — Kibo Web/PC

Documento para **continuar el trabajo en otro chat**. Contiene: qué es el
proyecto, dónde vive cada cosa, qué está hecho, las decisiones que ya se
tomaron (y no hay que re-litigar), y los 23 pendientes con su contexto.

Fecha: 8 ago 2026 · Proyecto: **Kibo Web/PC**

---

## 1 · Qué es Kibo

**Personal OS gamificado** — un RPG de productividad. El usuario crea un
personaje, sube cinco **áreas de vida** (Vigor, Sabiduría, Riqueza, Comunidad,
Voluntad), mantiene **rachas**, enfrenta **retos** con HP en juego, y gana
**monedas Kibo, materia oscura y XP** que gasta en recompensas reales
autodefinidas, cosméticos y capacidades.

Principio de marca: **«el fracaso reencauza»**. Voz cercana y motivadora, es-MX.

---

## 2 · Arquitectura del proyecto

| Archivo | Qué es |
|---|---|
| `Kibo Plataforma.dc.html` | **Entrada.** Carga `kibo-boot.js` |
| `kibo-boot.js` | Arranca React + Babel y monta los `.jsx` de `app/` en orden |
| `app/*.jsx` | ~30 módulos: pantallas, componentes, sistemas |
| `styles-extras.css` | La hoja grande (11k líneas): componentes y tokens locales |
| `styles-v2.css` | Base del prototipo |
| `kibo-blob.css` | **KIBO** (la mascota): cuerpo, cara, travesuras, cosméticos |
| `kibo-shell.css` | Layout del shell + **capa responsive** (carga al final, manda) |
| `_ds/kibo-design-system-.../` | Design System vinculado (tokens, componentes) |

### Documentos vivos
- **`docs/plan-kibo.md`** — plan con ID y estatus de TODO lo solicitado. Es el
  registro maestro; actualízalo en cada bloque.
- `docs/PRD-kibo.md` — PRD por módulo + análisis de compatibilidad con Obsidian.
- `docs/auditoria-ds.md`, `docs/auditoria-modales.md` — auditorías de origen.

### Componentes canónicos (`app/kbv-shared.jsx`)
`KbHabitCard · ItemCard · GoalBar · SectionHead · MoneyRow · EmptyState ·
PersonRow · PriorityRow · RateRow · ConfirmFooter/ConfirmDialog/useConfirm ·
TextPromptDialog/usePrompt · fmtNum`

---

## 3 · Decisiones tomadas — NO re-litigar

1. **Créditos de Finanzas** se quedan como tarjeta rica (barra de uso, interés
   YTD, CAT), **no** como `MoneyRow`.
2. **Divisas**: moneda Kibo con la «K» acuñada (plana, sin degradado) y
   **materia oscura** (esfera de obsidiana con contorno orbitando), contada en
   **fragmentos**. La palabra «gema» ya no existe en la interfaz.
3. **Sin diálogos del navegador** (`confirm`/`alert`/`prompt`): todo pasa por
   `useConfirm` / `usePrompt` / toasts.
4. **Contrato de altura de controles: 42px** — `.kbv-amount-input`,
   `input[type=date]`, `.kbv-stepper .st-ctl` y los campos genéricos de
   `.kbv-form-row`. Halo de foco `0 0 0 3px @18%`. El DS dice 46px pero el
   proyecto **no** migró: no alinear un control suelto al DS y romper la fila.
5. **KIBO vive en la esquina inferior derecha**, dentro de una canaleta que
   `.kbv-main` reserva (`--kbb-gutter`), para no tapar contenido.
6. **Rejilla de widgets: 4 pistas fijas** (`repeat(4, minmax(0,1fr))`).
   `auto-fill` **rompe** el sistema de spans `w-1…w-4`.
7. **Accesorios y juguetes de KIBO retirados** del guardarropa (se veían poco y
   estorbaban). Los reemplazan las **marcas/tatuajes** sobre el gel.
8. **Personalidad Sereno = quieto de fábrica**; los comportamientos se compran.
9. **Sin análisis de IA comprado con gemas** (decisión nueva, ver pendiente 66).

---

## 4 · Estado — qué YA está construido

**Homologación al DS**: Logros rediseñado · `SectionHead` en todas las
pantallas · botones secundarios · modales unificados · barrido de hex a tokens
(0 sueltos en `prestige-system.jsx`) · fuentes · sin diálogos nativos.

**Pantallas**: Hoy (dashboard editable) · Áreas · Hábitos · Retos · Tareas ·
Proyectos · Finanzas · Salud · Estudio · Lectura · Entretenimiento · Diario ·
Amigos (con Familia como pestaña) · Tienda · Bóveda · Progreso/Personaje ·
Cuenta · Configuración.

**KIBO**: cuerpo de gel con 8 ánimos derivados del HP · cara v2 (ojos grandes,
pupila con sangría garantizada, boca amalgamada) · 14 travesuras + dial para
elegirlas · manopies que orbitan y se ocultan en reposo · marcas/tatuajes ·
auras · pieles · personalidades · anillo radial de acción rápida de dos niveles
con registro inline · chat con voz.

**Tienda**: cofres 2D con dos estados dibujados y ceremonia escalada por rareza
· 16 tipos de premio reales (no solo cosméticos) · funciones · widgets ·
guardarropa · vitrina.

**Sistemas**: HP real con daño y cura · economía · rachas · prestigio · logros.

---

## 5 · Estado de los 23 pendientes — cerrados

Los 23 (bloques A–E) están **LISTO** y verificados en vivo. El detalle por ID,
con la causa raíz de cada uno, vive en `docs/plan-kibo.md` — ese es el registro
maestro. Resumen por bloque:

- **A · Vitrina (9)** — ficha por ítem (`KiboSpecimen`), marcos y títulos con
  muestra propia, título y color personalizables, portadas nuevas (ámbar,
  jurásico, manada…), compañero con tu KIBO real, auras corregidas. La vitrina
  se ve igual en la carta, en el HUD y en cada perfil de Amigos.
- **B · Piel y tatuajes (3)** — lienzos animados que se ven *a través* del gel
  (KIBO sigue siendo traslúcido), tatuajes de rostro que se deforman con el gel.
- **C · KIBO (4)** — chat inmersivo, casuísticas de conversación, «Léeme»
  retirado, dial de disco.
- **D · Producto (5)** — sin análisis de IA, Familia como sección, detalle por
  materia, Tareas como backlog general, tesoro de monedas y materia oscura.
- **E · Layout (2)** — botón de replegar reubicado; responsive web (55a) y
  **teléfono real** (55b: barra inferior, cabecera de dos filas, hojas
  inferiores, piso táctil de 44px), con el tweak **Vista** para revisarlo.

### Lo que había abierto fuera de los 23 — también cerrado (9 ago 2026)

- **Finanzas (IT-3)**: ejes, altura, marcadores de evento y periodo
  parametrizable en las dos gráficas, más tendencias sobre el flujo.
- **Reto = una sola entidad**: `RetoWidgetLegacy` fuera y un store único
  (`kbActiveReto()`).
- **Barrido de hex**: los de UI son tokens; se conservan marcas externas y arte.
- **HUD**: el chip del héroe ya no se encima con el contador de XP.
- **Auditoría de modales**: cerrada desde el 1 ago (el encabezado mentía).
- **E-10** (manopies pateando la pelota): retirado por el usuario.

**Abierto de verdad, y no solicitado**: tema oscuro, backend real del
asistente, arte oficial de KIBO. Y una decisión consciente: las 10 muestras de
color de `opciones.jsx` se quedan como hex — son elección del usuario, no
tokens de sistema.

---

## 6 · Cómo trabajar aquí

- **Verificación**: `ready_for_verification({path: 'Kibo Plataforma.dc.html'})`.
  Un verificador revisa en segundo plano y solo avisa si hay defectos.
- **Estilo de fixes**: buscar la **causa raíz**, no el síntoma. Varias
  regresiones de este proyecto vinieron de parchear el pixel en vez de la
  restricción (p. ej. `auto-fill` rompiendo los spans, o `min-width: 0` aplicado
  a los controles y no solo al texto).
- **Ediciones**: `run_script` con `replaceText` para lotes; `str_replace_edit`
  para cambios puntuales. Nunca `write_file` sobre `.dc.html`.
- **Tokens**: nada de hex sueltos en el JSX. Familias disponibles:
  `--kb-rank-*`, `--kb-mat-*`, `--kb-dark-*`, `--kb-rarity-*`, `--kb-mood-*`,
  `--kb-parch-*`, `--kb-void-*`, `--kb-spark-*`, `--kb-ink-kibo`, `--kb-good*`,
  `--kb-medal`, `--kb-warn`, `--kb-coin-wash`.
- **Al terminar un bloque**: actualizar `docs/plan-kibo.md` con ID y estatus.

---

## 7 · Trampas conocidas

- **`KiboMark` ya existe** en `mascot.jsx` (insignia). El tatuaje se llama
  `KiboTattoo` — si lo renombras a `KiboMark`, el blob se renderiza a sí mismo
  en bucle y **cuelga la app**.
- **`window.KIcon`**: el bundle del DS lo deja en el global como propiedad **no
  configurable pero sí escribible**, y su set carece de `inbox`, `search`… (esos
  botones salían vacíos). Dos caminos que **no** funcionan: `defineProperty`
  falla, y un `const KIcon` global es **imposible** — la declaración léxica
  choca con la propiedad no configurable y **aborta el script entero en
  silencio** (parece funcionar en caliente y se cae en carga limpia). La única
  vía es **asignar**: el set de la app se publica como `window.__KIconApp` y
  `kibo-boot.js` lo reclama con `claimKIcon()` al terminar de cargar los módulos
  y otra vez **antes de cada render**, por si el bundle del DS llega tarde.
- **Animaciones y `transform`**: animar `transform` en keyframes borra la escala
  que oculta las manopies. La órbita usa la propiedad **`translate`** aparte.
- **El guardarropa persiste en `localStorage`** (`kibo:kb-*`). Al retirar una
  parte hay que migrar su clave, o los usuarios se quedan con ella para siempre.
- **`.kbv-side-nav`** es el contenedor real de las secciones del sidebar: si una
  lista blanca de colapso no lo incluye, desaparecen los 18 enlaces.
