# Pestaña Configuración del área

- **Artboard:** `AreaConfigV3.dc.html`
- **Módulo:** areas
- **Origen:** `areas-v2.jsx` líneas 886-1043
- **Propósito:** Inline (non-modal) area editor with an explicit dirty/save cycle, plus a diagram explaining what hangs off this area and, for custom areas, the rules of the custom-area economy.

## Secciones, de arriba abajo

- Card 'Personalizar área' with badge 'Área libre' | 'Área de vida fija' (917-918)
- kbv-cfg-grid: Nombre input; Descripción input (custom areas only) (920-931)
- Ícono picker (ICON_PALETTE) and Color picker (AREA_COLORS_V3) — or, for fixed areas, the note 'El ícono y color de esta área de vida son fijos. Puedes ajustar su nombre y fondo.' (933-954)
- 'Fondo del encabezado': Limpio / Suave / Intenso tint tiles; Maestro note 'El contorno arcoíris de Maestro se mantiene siempre.' (956-967)
- 'Dificultad para subir de nivel' + InfoDot — 4 tiles (×0.6 Suave, ×1.0 Estándar, ×1.6 Exigente, ×2.5 Brutal) plus a change-budget pill (969-1000)
- kbv-cfg-actions: 'Guardar cambios' (disabled unless dirty), 'Descartar', dirty/saved caption (1002-1006)
- Card 'Qué vive en {área}' — hierarchy diagram Área → Proyecto|Curso/Materia|Proyecto financiero|Reto/Hábito → Tarea (Tarea omitted for Voluntad) + explanatory paragraph (1010-1024)
- Young-area feedback: 'Esta área lleva poco tiempo: su proyección se ve acotada al inicio…' (1026-1028)
- Card 'Cómo funcionan las áreas personalizadas' — 4-point ordered list: 5 base areas, extras cost materia oscura; same 5×50 progression to Maestro; adjustable difficulty; analysis here, execution in its module (1030-1040)

## Estados que debe mostrar

- dirty (unsaved changes) vs saved
- custom / fully editable vs fixed life-area (icon+color locked)
- difficulty allowed vs measured by the system (rules.difficulty === false)
- difficulty changes left: 3 → 0; at 0 all non-current tiles are locked and the note reads 'Alcanzaste el límite. La dificultad queda fija en «{label}».'
- difficulty change pending → 'Guardar este cambio usará 1 — quedarán N'
- young area (prestige 0 and level < 8) → projection caveat
- master → rainbow-outline note

## Comportamientos que hay que representar

- Edit name / desc / glyph / color / bgTint / difficulty into a local draft; draft resets when area.id changes (893-897)
- Save: refuses an empty name; if difficulty changed and changesLeft <= 0 it silently refuses; otherwise decrements the change budget and calls onSave with the full patch including difficultyChangesLeft (900-907)
- Discard resets the draft (note: the discard handler at 1004 omits `difficulty`, so a pending difficulty pick survives a discard)
- Hierarchy diagram child node/icon derived from hier.kind (911-912)

## Lee de

- area {name, desc, glyph, color, bgTint, difficulty, difficultyChangesLeft}
- AREA_RULES
- AREA_HIER_V3
- ICON_PALETTE
- AREA_COLORS_V3
- AREA_FONDOS_V3
- DIFFICULTY_LEVELS
- AREA_PROG_V3

## Escribe

- area patch via onSave (name, desc, glyph, color, bgTint, difficulty, difficultyChangesLeft)

## Conceptos del núcleo que toca

- identity
- progression engine
- economy/ledger
- shell
