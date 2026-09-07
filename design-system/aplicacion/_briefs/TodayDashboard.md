# Hoy — tablero de widgets

- **Artboard:** `TodayDashboard.dc.html`
- **Módulo:** dashboard
- **Origen:** `dashboard-v2.jsx` líneas 1128-1217
- **Propósito:** La pantalla de inicio: una rejilla reordenable de 4 columnas × N filas donde cada widget mide de 1×1 a 4×4. El usuario la edita (arrastrar, redimensionar, quitar), la reordena con presets por momento del día, agrega widgets desde la galería y compra filas extra con fragmentos.

## Secciones, de arriba abajo

- Page head: eyebrow con `crumb('today','Lun 25 May')` + H1 «Buenas tardes, {nombre}» + InfoDot explicativo (1154-1158)
- Grupo de presets de tablero: Mañana / Trabajo / Noche (1160-1172)
- Botón «Explorar widgets» (abre la galería) (1173-1179)
- Toggle «Editar dashboard» / «Listo» (1180-1186)
- `.kbv-canvas-wrap` → WidgetGrid con los 15 widgets del layout por defecto (1191-1203)
- Slots vacíos clicables (solo en edición) (927-932)
- CTA «Desbloquear fila adicional» al pie de la rejilla (933-942)
- WidgetGallery montada condicionalmente (1205-1214)

## Estados que debe mostrar

- Vista (editing=false): widgets sin controles
- Edición (editing=true): grips, botón de tamaño, botón quitar, slots vacíos y CTA de fila
- Preset activo (manana|trabajo|noche) vs sin preset — persistido en localStorage `kibo:board-preset` (1116, 1131-1133, 1166)
- Galería abierta
- Selector de tamaño abierto sobre un widget (pickerId)
- Arrastre en curso: `dragging` en el origen, outline punteado en el destino (886, 892)
- Capacidad: maxRows base 9 → totalCapacity 4×maxRows; se muestran hasta 12 slots vacíos (862-865, 1134)

## Comportamientos que hay que representar

- Arrastrar y soltar widgets para reordenar (splice del array de layout) (837-858)
- Redimensionar vía SizePicker, limitado a los tamaños declarados por el widget (`def.sizes`, fallback [[1,1]]) (875, 902-909, 1197)
- Quitar widget del dashboard (botón x) (920-922, 1196)
- Agregar widget desde la galería — entra como 1×1 y no se duplica (1209-1212)
- Clic en slot vacío abre la galería (928, 1198)
- «Desbloquear fila adicional» suma +1 a maxRows; precio mostrado: ◆ 8 fragmentos (933-942, 1200-1201)
- Aplicar preset: reordena el layout por `preset.first` y agranda el widget `preset.big` a ancho ≥2; volver a pulsarlo lo desactiva y restaura DEFAULT_WIDGET_LAYOUT (1118-1126, 1161-1171)
- Al montar, restaura el preset guardado y lo aplica (1139-1142)
- Pasa ctx a cada widget: bossActive, habitsDone 2/4, tasksDone 1/7, onNavigate (1144-1149)
- Cada widget recibe size derivado del ancho: w≥3→'L', w===2→'M', else 'S' (913)

## Lee de

- DEFAULT_WIDGET_LAYOUT — 15 widgets: habits 4×1, reto 2×1, crono 2×1, tasks 4×2, proyectos 2×1, backlog, streak, escuela, familia, prestigio, origen, diario, lectura, watch, personalizar (1088-1103)
- WIDGET_COMPONENTS / WIDGET_REGISTRY (definidos fuera de este archivo — widgets-v2/v3/catalog/v4) (870-871)
- user.name, stats.bossActive
- localStorage `kibo:board-preset`

## Escribe

- localStorage `kibo:board-preset` (1166)
- estado layout (orden y tamaños de widgets)
- estado maxRows (compra de filas — economía en fragmentos)

## Conceptos del núcleo que toca

- shell
- economy/ledger
- habit
- task
- project
- reto
- progression engine

## Modales que se dibujan sobre esta pantalla

### Personaliza tu dashboard — galería/marketplace de widgets
- Se abre desde: TodayDashboard — botón «Explorar widgets» (1173-1179), TodayDashboard / WidgetGrid — clic en un slot vacío en modo edición (927-932 → onAdd, 1198)
- Propósito: Modal a pantalla completa (KBVModal size="full") para agregar widgets al tablero de Hoy, organizados por categoría, con KPIs de cuántos hay por sección y cuáles son gratis, premium o ya activos.
- Campos: Tira de KPIs con 8 categorías (WIDGET_CATEGORIES, 949-957): Hoy, Personal, Trabajo, Diario, Lectura, Estudio, Entretenimiento, Finanzas — cada una con nombre, descripción y 4 contadores: widgets / gratis / premium / activos (966-1001) · Rejilla de tarjetas de widget de la categoría activa: icono, nombre, descripción, pista de tamaños, etiqueta de costo (1004-1032)
- Acciones: Seleccionar categoría (los KPI son botones que cambian la pestaña) (983-988) · Agregar widget (clic en tarjeta habilitada → onPick(id), entra como 1×1) (1009-1014, 1209-1212) · Cerrar (control propio de KBVModal → onClose)
- Estados: Pestaña activa (por defecto 'today') (961) · Tarjeta deshabilitada porque ya está en el dashboard → etiqueta «Ya en tu dashboard» (1006-1007, 1022-1023) · Tarjeta bloqueada (w.locked) → etiqueta «{cost} · Tienda», con clase `gem` si el costo se paga en fragmentos (1024-1025) · Tarjeta libre → etiqueta «Gratis» (1027) · Filtra widgets ocultos del registro (`!w.hidden`) (962) · La pista «Tamaños: 1×1 · 4×2» está escrita a mano y no refleja `def.sizes` del widget (1021)
- Origen: `dashboard-v2.jsx` 960-1035

### Tamaño del widget
- Se abre desde: WidgetGrid — pestaña `.size-current` con el «{w}×{h}» actual, visible solo en modo edición (894-901)
- Propósito: Popover que aparece sobre un widget en modo edición para cambiar sus dimensiones, mostrando SOLO los tamaños que ese widget declara soportar, como lista de opciones con vista previa y nombre humano.
- Campos: Encabezado «Tamaño del widget» (809) · Opciones: cuadro de vista previa proporcional, dimensión «cw×ch» y nombre de SIZE_LABELS — Pequeño 1×1, Alto 1×2, Ancho 2×1, Mediano 2×2, Banner 4×1, Grande 4×2, Extra grande 4×3 (800-803, 811-826)
- Acciones: Elegir un tamaño → onResize(id, cw, ch) y cierra el popover (817, 907)
- Estados: Opción activa marcada con `on` + palomita (812, 823) · Sin `allowedSizes` declarados → única opción [[1,1]] (806, 875) · Nombre vacío si la combinación no está en SIZE_LABELS (822)
- Origen: `dashboard-v2.jsx` 804-830
