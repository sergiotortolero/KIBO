# Hábitos

- **Artboard:** `HabitsScreen.dc.html`
- **Módulo:** personal-screens.jsx
- **Origen:** `personal-screens.jsx` líneas 151-309
- **Propósito:** Pantalla central de hábitos: define, ordena, pausa y borra hábitos; muestra el check de hoy, KPIs de racha/cumplimiento y el patrón semanal. Los hábitos solo afectan Voluntad; los malos hábitos no viven aquí (van a Retos).

## Secciones, de arriba abajo

- Page head: eyebrow crumb('habits','Voluntad') + H1 «Hábitos.» con InfoDot + botón «Nuevo hábito» (221-231)
- KPI grid de 4: Hechos hoy (+XP · monedas hoy), Racha más larga, Racha promedio, Cumplimiento semanal (234-261)
- «Lo de hoy» — <HabitsBig> con los hábitos NO pausados, showAdd=false, streakDays=23, protectors 1/2 (264)
- Patrones: barras de cumplimiento por día de la semana (L–D, mejor día resaltado) + panel lateral con 3 indicadores, incluido «vienen de un reto» (267-287)
- <HabitsManager>: buscador, orden (Mi orden/Nombre/Racha/Cadencia), botón Nuevo hábito y tabla Hábito|Cadencia|Racha|Paga|Estado|acciones (290-302)
- Montaje de modales + diálogo de confirmación (304-306)

## Estados que debe mostrar

- Filled — 6 hábitos demo desde HabitsStore
- Búsqueda sin resultados en el manager: «Nada con «{q}». Prueba otro nombre o crea el hábito.» (102-104)
- Hábito pausado: fila con clase .paused, switch off, etiqueta «Pausado»; queda fuera de «Lo de hoy» (110, 137, 165)
- Hábito sin racha: «sin racha» en lugar del contador de fuego (128)
- Hábito heredado de un reto: badge «nació de un reto» (123)
- Reordenar deshabilitado cuando el orden no es «Mi orden» o hay búsqueda activa (66, 116)
- Deep-link de creación: navDetail.action==='create' abre CreateHabitModal al entrar (159-161)
- Confirmación de borrado (texto distinto si hay racha > 0) (177-187)
- Fila en arrastre (.dragging) (110)

## Comportamientos que hay que representar

- Marcar/desmarcar un hábito del día desde HabitsBig → toggle(id); al marcar llama healHP(3, `Hábito: nombre`) o, si no existe, kiboLog({kind:'habit',label}) (167-176)
- Crear hábito (botón del head, botón del manager, o deep-link) → CreateHabitModal; guarda vía HabitsStore.add con streak 0 y weeklyHistory vacío (202-217)
- Editar hábito (clic en el nombre o en el lápiz) → abre CreateHabitModal en modo edit (292)
- Eliminar hábito con confirmación que advierte la pérdida de historial y racha (177-187)
- Pausar / reactivar con switch (no rompe la racha, deja de pedir check) (132-137, 294)
- Reordenar por arrastre (drag & drop) sobre HabitsStore, solo en «Mi orden» sin búsqueda (113-115, 295-301)
- Buscar por nombre o cadencia; ordenar por Mi orden / Nombre / Racha / Cadencia (53-65)
- Se suscribe a HabitsStore para reflejar hábitos nacidos de un reto (evento kibo:habit-from-reto) (34-41, 152-153)

## Lee de

- HabitsStore (lista de hábitos: name, icon, color, streak, schedule, energy, effort, done, goal, weeklyHistory, paused, fromReto)
- habitReward(energy, effort) → XP y monedas por check
- navDetail (deep-link desde el widget de hábitos del tablero y desde Áreas → Voluntad)
- HabitsBig (widget compartido del dashboard) para el check del día

## Escribe

- HabitsStore.set / HabitsStore.add / filtrado (alta, edición, borrado, pausa, reorden, toggle done)
- healHP(3, 'Hábito: <nombre>') — cura de vitals al cumplir
- kiboLog({ kind: 'habit', label }) — fallback de bitácora KIBO

## Conceptos del núcleo que toca

- habit
- progression engine
- economy/ledger
- identity
- reto
- KIBO
- shell

## Modales que se dibujan sobre esta pantalla

### Crear hábito (desde el widget de hábitos)
- Se abre desde: HabitsBigWidget — botón «+» de HabitsBig (637-646 → onAddHabit) — CÓDIGO MUERTO: HabitsBigWidget no se registra ni se usa en ninguna parte (ver deadRegistrations)
- Propósito: Alta de un hábito nuevo desde el bloque «Hábitos de hoy».
- Campos: El onSave del prototipo consume: name, when, xp, icon, color (680-691)
- Acciones: Guardar → añade el hábito a la lista local con streak 0 y done false (680-691) · Cerrar (695)
- Estados: Inalcanzable en la app tal como está cableada, porque su único origen es un widget muerto
- Origen: `dashboard-v2.jsx` 695 (punto de montaje; el componente se define fuera de este archivo)

### Detalle de hábito
- Se abre desde: HabitsScreen (montado en la línea 305, pero setOpenHabit nunca recibe un hábito dentro de esta pantalla — solo se llama con null; en la práctica es inalcanzable desde Hábitos), areas-v2.jsx:709 — catálogo de hábitos del área Voluntad (HabitCatalogCard onOpen/onEdit)
- Propósito: Ficha de lectura de un hábito: racha actual y récord, pago por check (XP y monedas), esfuerzo, prioridad derivada y la rejilla de los últimos 30 días.
- Campos: Solo lectura: título = nombre del hábito; subtítulo «Voluntad · {schedule} · diario|semanal» · Hero: icono con el color del hábito, racha grande «🔥 N días» + «récord 31 días» · Stats: +XP/check, +monedas/check, Esfuerzo n/5, Prioridad (PRIORITY_DEFS vía HABIT_PRI_MAP) · Rejilla «Últimos 30 días» con leyenda Completado / Fallido / Hoy
- Acciones: Eliminar (kbv-btn-ghost danger) → onDelete(habit.id) · Cerrar · Editar hábito → onEdit(habit) (en Hábitos abriría CreateHabitModal en modo edición)
- Estados: Tamaño lg · Historial mensual sintético (i % 4 !== 2) — no hay estado vacío ni de carga · Día 30 marcado como «today»
- Origen: `personal-screens.jsx` 311-362
