# Retos

- **Artboard:** `RetosScreen.dc.html`
- **Módulo:** personal-screens.jsx
- **Origen:** `personal-screens.jsx` líneas 637-887
- **Propósito:** Las batallas grandes: cortar un mal hábito o construir uno, con dificultad, periodicidad, tope de fallos, daño al HP y recompensas. Incluye la pestaña de retos compartidos (dúo/multi-amigo) con el HP de ambos en juego.

## Secciones, de arriba abajo

- Page head: eyebrow crumb('retos','Voluntad') + H1 «Retos.» con InfoDot + botón rojo «Nuevo reto» (731-741)
- Banda de aviso (notice) ok / warn / lost, cerrable (743-749)
- Cabecera «Indicadores» + nota de periodo «año en curso · 2026» (752-755)
- KPIs: Constancia (activos), Tasa de éxito, Dificultad media, Días limpios + mini-distribución «Retos por dificultad» 1–5 (756-804)
- Tabs: Todos / Activos / Planeados / Pasados / Compartidos con conteos (807-823)
- Secciones apiladas por estado con cabecera de sección, grid de <RetoCard> y tarjeta «Lanzar reto nuevo» al final de Activos (826-854)
- Sección Compartidos: grid de <SharedRetoCard> + tarjeta «Nuevo reto compartido» (857-878)
- Montaje de modales: RetoDetailModal y CreateRetoModal (solo y dúo) (880-884)

## Estados que debe mostrar

- Tab activo: todos | active | planned | completed | compartidos (639, 727)
- Vacío por sección con <EmptyState> (icono sword/flag) — solo se dibuja en «Activos» dentro de «Todos» (836-841)
- Reto activo: barra de progreso (roja si fails >= failsAllowed), registro diario disponible
- Reto ya registrado hoy (todayMark 'done' | 'fail'): badge + botón «Desmarcar» (489-498)
- Reto planeado: franja «Inicia <fecha>» con días, periodicidad y XP (540-546)
- Reto completado: franja de resultado logrado / falló / perdido en zona crítica (548-554)
- Reto perdido (fails > failsAllowed): status completed + success false + critical, aviso kind 'lost' (682-686)
- Reto compartido pendiente: «Propuesta enviada — esperando a que {amigo} acepte» (598-599)
- Compartido con ambos registrados hoy vs. alguno pendiente (+HP / −HP) (617-623)
- Deep-link: navDetail.tab==='compartidos' o action 'create-shared' / 'create' (659-664)

## Comportamientos que hay que representar

- Registrar día en un reto de construcción → confirmación «¿Cumpliste el hito de hoy?» → daysElapsed +1, todayMark 'done', aviso ok (500-502, 673-676)
- Registrar recaída en un reto de corte → fails +1, daysElapsed +1, todayMark 'fail'; si supera el tope, el reto se pierde: mitad de recompensas y HP a 10 (504-506, 677-690)
- Desmarcar el registro de hoy con confirmación; revierte también la pérdida (495-497, 692-701)
- Abrir un reto → RetoDetailModal (onUpdate reemplaza el reto, onAbandon lo elimina) (843, 880)
- Crear reto solo → CreateRetoModal; se agrega con status 'planned' (882-884)
- Crear reto compartido → CreateRetoModal en modo dúo; genera una propuesta por amigo invitado, salta a la pestaña Compartidos y avisa a quién se invitó (646-656, 871-875, 881)
- Registrar mi día en un reto compartido → meDone true, daysElapsed +1 y aviso con el estado del amigo (866-869)
- Cambiar de pestaña / filtrar por estado (808-822)

## Lee de

- RETOS_DEMO (nombre, desc, difficulty, kind, status, daysTotal, daysElapsed, fails, failsAllowed, xpReward, gemReward, area, startsAt, completedAt, success)
- SHARED_CHALLENGES (amigo, color, myDays/myFails/myStreak, friendDays/friendFails/friendStreak, hp en juego)
- RETO_DIFFICULTY (daño por nivel), RETO_KIND_LABELS, RETO_PERIODICITY / retoPeriod
- navDetail (deep-link desde Amigos / Salud)

## Escribe

- Estado local de retos (registrar día, registrar fallo, deshacer, alta, abandono)
- Estado local de retos compartidos (meDone, daysElapsed, alta de propuestas)
- Avisos (notice) ok / warn / lost — incluye la mecánica de pérdida: mitad de recompensas y HP a 10 (zona crítica)

## Conceptos del núcleo que toca

- reto
- habit
- progression engine
- economy/ledger
- identity
- shell

## Modales que se dibujan sobre esta pantalla

### Nuevo reto / Nuevo reto compartido
- Se abre desde: RetosScreen — botón «Nuevo reto» del head (737) y tarjeta «Lanzar reto nuevo» de la sección Activos (846), RetosScreen — tarjeta «Nuevo reto compartido» (871) y deep-link navDetail.action==='create-shared', ambos con initialMode='duo' (881)
- Propósito: Definir un reto: solo o con amigos, tipo (cortar mal hábito / construir hábito), dificultad que fija el daño al HP, periodicidad que escala las recompensas, duración y fallos tolerados; muestra el resumen de daño y premio antes de lanzarlo.
- Campos: Modo: Solo / Con un amigo (pick row) · A quién invitas — selección múltiple sobre DEMO_FRIENDS (solo en modo dúo) · Tipo de reto: Cortar mal hábito / Construir hábito (2 tiles desde RETO_KIND_LABELS) · «Al terminar, convertirlo en hábito permanente» (toggle, solo si el tipo es construir-hábito) · Nombre del reto (obligatorio) · Empieza (date, por defecto hoy + 7 días) · Descripción · qué cuenta como fallo (textarea) · Dificultad 1–5 con RateRow, etiquetada con el daño «−N HP» por nivel · Periodicidad: Todos los días / Entre semana / 3× por semana / 1× por semana, con su factor · Duración en días (KbStepper, 3–365) · Fallos tolerados (KbStepper, 0–maxFails = 20% de los días) · HP en juego (KbStepper 1–20, tono danger, solo en modo dúo)
- Acciones: Cancelar · «Lanzar reto» / «Proponer reto» — deshabilitado sin nombre o, en dúo, sin amigos elegidos. En dúo emite una propuesta por amigo (pending:true) vía onSaveShared; en solo emite el reto con daño y recompensas calculadas vía onSave
- Estados: Tamaño lg; título y subtítulo cambian entre solo y dúo · Sin amigos elegidos: hint «Elige al menos a una persona.»; con amigos: lista a quién se enviará la invitación · Aviso de límite: si superas {failCap} fallos el reto se pierde — mitad de recompensas y HP en zona crítica (1728-1731) · Resumen en 3 celdas: daño por fallo, recompensa al cumplir (XP + monedas + gemas) y consecuencia de superar los fallos (1733-1750) · Los fallos tolerados se recortan automáticamente al tope del 20% cuando cambia la duración (1591) · Bloque «convertirlo en hábito» solo visible para construir-habito (1671-1681)
- Origen: `personal-screens.jsx` 1563-1753

### ¿Cumpliste el hito de hoy?
- Se abre desde: RetoCard — botón «Registrar día» de un reto activo de tipo construir-habito (500-502), usado por RetosScreen
- Propósito: Confirmar el registro del día en un reto de construir-hábito antes de sumar avance y otorgar la recompensa (solo un registro por día).
- Campos: Sin campos — subtítulo con el nombre del reto y cuerpo explicativo: confirmar suma el día y otorga la recompensa; un registro falso rompe el sentido del reto
- Acciones: Aún no (cierra sin registrar) · Sí, lo cumplí → onRegister(r.id)
- Estados: Confirmación (confirm === 'hito'); se detiene la propagación para no abrir el detalle del reto
- Origen: `personal-screens.jsx` 511-523

### ¿Deshacer el registro de hoy?
- Se abre desde: RetoCard — botón «Desmarcar» que aparece cuando el reto ya tiene todayMark (495-497), usado por RetosScreen
- Propósito: Revertir la marca del día (día cumplido o recaída) por si el registro fue un error.
- Campos: Sin campos — el cuerpo cambia según la marca: «Se revertirá la recaída / el día registrado hoy. Podrás volver a registrar más tarde.»
- Acciones: Conservar registro · Sí, desmarcar (botón danger) → onUndo(r.id)
- Estados: Confirmación (confirm === 'undo'); se detiene la propagación para no abrir el detalle del reto
- Origen: `personal-screens.jsx` 524-536
