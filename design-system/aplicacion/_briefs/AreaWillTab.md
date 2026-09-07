# Pestaña Voluntad · Retos y hábitos (homologada 1:1)

- **Artboard:** `AreaWillTab.dc.html`
- **Módulo:** areas
- **Origen:** `areas-v2.jsx` líneas 646-714
- **Propósito:** Voluntad has no projects; its children are retos (finite) and hábitos (recurring). This tab deliberately renders the SAME cards and the SAME detail modals as the Retos and Hábitos screens so the user can register progress without leaving Áreas.

## Secciones, de arriba abajo

- kbv-area-feedback banner: 'Estas son las mismas tarjetas de Retos y Hábitos…' (688)
- Card 'Retos activos (n)' + 'Abrir Retos' link — kbv-retos-grid of <RetoCard> (690-697)
- Card 'Hábitos (n)' + 'Abrir Hábitos' link — kbv-habits-catalog of <HabitCatalogCard> (699-706)
- Modal mounts: RetoDetailModal, HabitDetailModal, CreateHabitModal (edit), confirm dialog (708-711)

## Estados que debe mostrar

- no active retos → 'No hay retos activos. Lanza uno en la sección de Retos.'
- reto today-mark: none | done | fail
- reto blown past failsAllowed → status 'completed', success false, critical true, lostDay 'Hoy'
- habit with streak > 0 → delete confirm warns the streak is lost

## Comportamientos que hay que representar

- Register a reto day → daysElapsed+1, todayMark 'done' (669)
- Register a fail → fails+1, daysElapsed+1; if fails > failsAllowed the reto is closed as failed/critical (670-677)
- Undo today → reverses the day and, for a fail, restores status 'active' (678-684)
- Open a reto → RetoDetailModal; onUpdate patches it; onAbandon removes it (708)
- Open/edit a habit → HabitDetailModal → CreateHabitModal in edit mode → HabitsStore.set patch (668, 709-710)
- Delete a habit → useConfirm 'Eliminar «X»' warning about lost history/streak → HabitsStore.set filter (658-667)
- Subscribes to HabitsStore and re-renders on change (647-648)
- 'Abrir Retos' / 'Abrir Hábitos' → nav('retos') / nav('habits') (691, 700)

## Lee de

- HabitsStore.get() / subscribe
- RETOS_DEMO

## Escribe

- HabitsStore (edit habit, delete habit)
- local retos list (register day, register fail, undo, update, abandon)
- kibo:navigate → retos, habits

## Conceptos del núcleo que toca

- habit
- reto
- progression engine
- fact record
- shell

## Modales que se dibujan sobre esta pantalla

### Confirmación · «Eliminar {hábito}»
- Se abre desde: AreaWillTab → HabitCatalogCard delete (areas-v2.jsx:703), AreaWillTab → HabitDetailModal onDelete (areas-v2.jsx:709)
- Propósito: useConfirm dialog before destroying a habit from inside the Voluntad tab; the message escalates when the habit has a live streak.
- Campos: Title 'Eliminar «{nombre}»' · Message with streak: 'Se pierde el historial y la racha de {n} días. Esto no se puede deshacer.' · Message without streak: 'Se pierde el historial completo. Esto no se puede deshacer.'
- Acciones: Sí, eliminar → HabitsStore.set(filter) and closes the open habit sheet · implicit cancel
- Estados: streak > 0 (streak warning) · streak 0
- Origen: `areas-v2.jsx` 658-667
