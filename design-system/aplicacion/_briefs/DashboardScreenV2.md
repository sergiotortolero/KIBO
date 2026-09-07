# Shell principal / router de la app

- **Artboard:** `DashboardScreenV2.dc.html`
- **Módulo:** dashboard
- **Origen:** `dashboard-v2.jsx` líneas 1462-1654
- **Propósito:** Es el caparazón (shell) de todo el producto una vez autenticado: monta el menú lateral, el HUD superior, el cuerpo enrutado según `active`, el FAB de KIBO y la barra inferior de teléfono. Contiene la tabla de rutas completa (switch de 21 casos) y la compuerta freemium que sustituye cualquier pantalla premium bloqueada por ModuleLocked.

## Secciones, de arriba abajo

- `.kbv-shell` raíz con clases de layout calculadas: side-collapsed / side-pinned / side-narrow / side-flyout (1633)
- Scrim del menú en modo estrecho — `.kbv-side-scrim`, cierra el flyout al hacer clic (1634)
- ReencauceCard (montada condicionalmente si el componente existe; definida en reencauce.jsx) (1635)
- Sidebar — menú lateral editable, con racha fijada arriba (1636)
- `.kbv-content` — columna de contenido (1637)
- Header — HUD (identidad+XP, buscador, HP, racha, monedas, materia oscura) (1638)
- Cuerpo enrutado: `React.cloneElement(body, { key: ... })` (1644)
- QuickFab — mascota KIBO abajo a la izquierda (1645)
- MobileTabBar — barra inferior de 5 destinos (1647-1651)

## Estados que debe mostrar

- Escritorio ancho: menú desplegado (por defecto)
- Menú replegado a riel — persistido en localStorage `kibo:side-collapsed` (1461, 1465-1467, 1504)
- Menú fijo — `prefs.sidebarMode === 'fijo'`, manda sobre el estado guardado y sobre el riel automático (1510-1515)
- Estrecho: shellW <= 1080 → riel automático; el botón ABRE el menú encima en vez de replegarlo (1485, 1502-1505)
- Teléfono: shellW <= 640 → menú como cajón + MobileTabBar; `railed` cuando el cajón está cerrado (1512-1515)
- Flyout abierto con scrim (narrow && sideOpen) (1634)
- Módulo premium bloqueado → el cuerpo se reemplaza por ModuleLocked (1628-1630)
- Fallback: componente de pantalla inexistente → ComingSoon (progreso, social, personalizar, familia, tarea, salud, resources, settings, account)
- Ruta desconocida → TodayDashboard por defecto (1623-1625)

## Comportamientos que hay que representar

- Enruta 21 destinos: today→TodayDashboard, habits→HabitsScreen, retos→RetosScreen, estudio→EstudioScreenV2|EstudioScreen, watch→EntretenimientoScreen, areas→AreasScreen, progreso→CharacterScreen, social→SocialScreen, personalizar→PersonalizacionScreen(initialTab), familia→FamiliaScreen, tareas→TareasScreen, tarea→TaskDetailScreen(taskId), projects→ProjectsScreen, finanzas→FinanzasScreen, diario→DiarioScreen, lectura→LecturaScreen, salud→SaludScreen, store→StoreScreen(initialTab), resources→BovedaScreen, settings→ConfigScreen, account→CuentaScreen (1538-1625)
- Escucha el evento global `kibo:navigate` y enruta con deep-link (detail.screen + taskId/project/area/retoId/create/tab/action) — es el canal que usan widgets, buscador, KIBO y la ficha de héroe (1523-1532)
- Distingue navegación «limpia» (clic en menú, sin destino) de navegación con sujeto: `navFresh` solo cambia si NO hay target, y entra en la `key` para remontar la pantalla desde cero (1493-1498, 1644)
- toggleSide(): en estrecho abre/cierra el flyout; en escritorio repliega/despliega y persiste en localStorage (1502-1505)
- Mide el ancho REAL del shell con ResizeObserver (no el viewport) para que JS y media queries coincidan (1475-1484)
- Desbloquea módulos premium en memoria: unlockModule(id) añade a unlockedModules (1518)
- «Módulos» del pie del menú y «Ver módulos en la Tienda» navegan a store con navDetail.tab='modules' (1629, 1636)
- Reinicia unlockedModules cuando cambia stats.profile (perfil de prueba novato/intermedio/maestro) (1516-1517)
- MobileTabBar navega limpiando navDetail y cerrando el cajón; «Más» abre el mismo menú completo del riel (1443-1459, 1647-1651)

## Lee de

- stats (level, prestige, hp, xp, streak, coins, gems, bossActive, profile)
- user (name, avatar)
- PROFILE_UNLOCKED[stats.profile] — módulos desbloqueados por perfil (1516)
- PREMIUM_MODULES — catálogo y costo en fragmentos (1519)
- prefs vía useKbPrefs() — sidebarMode (1510)
- localStorage `kibo:side-collapsed` (1466)

## Escribe

- localStorage `kibo:side-collapsed` (1504)
- estado unlockedModules (economía: gasto implícito de fragmentos) (1518)
- navDetail / active (estado de navegación del shell)
- kbSetPref('sidebarMode', …) vía el Sidebar (1185)

## Conceptos del núcleo que toca

- shell
- identity
- economy/ledger
- progression engine
- KIBO
- freemium/modules
- habit
- task
- project

## Modales que se dibujan sobre esta pantalla

### Historial de divisa (monedas / materia oscura)
- Se abre desde: Header — píldora de monedas `.kbv-stat-pill.coin` (544-548), Header — píldora de materia oscura `.kbv-stat-pill.gem` (549-553)
- Propósito: Panel desplegable anclado a las píldoras de divisa del HUD: muestra el saldo, cuánto se ganó y se gastó, de qué orígenes vino el dinero y el detalle de los últimos movimientos del ledger. Responde «¿de dónde salió todo esto?».
- Campos: Cabecera: glifo grande + total + etiqueta («monedas · ganadas por actividad» / «materia oscura · Premium · recompensas de retos») (416-423) · Resumen: +ganadas / −gastadas calculadas sobre el filtro activo (424-429, 407-408) · Chips de origen ordenados de mayor a menor aporte, construidos desde LEDGER_SRC: Hábitos, Tareas, Proyectos, Retos, Lectura, Racha, Recompensas, Cofres, Plataforma, Compra (358-369, 409-413, 431-442) · Lista de movimientos: monto con signo + glifo, razón, origen con su color, momento (443-462)
- Acciones: Filtrar por origen (chip; volver a pulsarlo devuelve a «Todo») (436-437) · «Todo» — quitar filtro (432) · Cerrar (botón «Cerrar» del pie, 464-466) · Cierre por clic fuera (listener mousedown sobre el ref) (399-403)
- Estados: kind='coin' → COIN_LEDGER_DEMO (10 movimientos) + pie «Convierte 10× monedas en cofres premium.» (371-381, 468) · kind='gem' → GEM_LEDGER_DEMO (10 movimientos) + pie «La materia oscura se compra o se gana en retos premium.» (384-394, 467) · Filtro src='all' vs un origen concreto (405-406) · Filas con clase `earn` o `spend` según el signo (447)
- Origen: `dashboard-v2.jsx` 397-472

### Confirmación · Eliminar sección del menú
- Se abre desde: Sidebar — botón papelera `.section-del` de la cabecera de una sección no bloqueada, en modo Personalizar (271-273 → deleteSection)
- Propósito: Diálogo de confirmación (helper useConfirm) que aparece al borrar una sección del menú que todavía tiene accesos, aclarando que los accesos se mudan a otra sección y no se pierden.
- Campos: Título: «Eliminar sección» · Mensaje: «¿Eliminar la sección «{nombre}»? Sus {n} accesos se moverán a otra sección — no se pierden.» (103)
- Acciones: «Sí, eliminar» → reallyDeleteSection(id): mueve los items a la primera sección no bloqueada y elimina la sección (103, 108-119) · Cancelar / cerrar (control del helper useConfirm)
- Estados: Solo se muestra si la sección tiene accesos; con 0 accesos se borra sin preguntar (102-106) · Nunca aparece para secciones bloqueadas (`General`), que no se pueden borrar (101)
- Origen: `dashboard-v2.jsx` 86, 99-107, 172

### Menú lateral como cajón (flyout) + scrim
- Se abre desde: Sidebar — botón «Desplegar menú» de la cabecera cuando el shell es estrecho (189-196 → onToggleCollapse → toggleSide), MobileTabBar — botón «Más» (1453-1457 → onMore)
- Propósito: En anchos ≤1080 px (y siempre en teléfono) el menú deja de ser una columna y se abre ENCIMA del contenido, con un velo que lo cierra al tocarlo. Es el mismo Sidebar completo, no una lista aparte.
- Campos: Contiene el Sidebar íntegro: racha, Personalizar, secciones editables, bandeja de ocultas, Módulos, Configuración, Cuenta
- Acciones: Abrir/cerrar con el mismo botón (1502-1505) · Cerrar tocando el scrim (1634) · Cerrar automáticamente al navegar a cualquier destino (1636, 1650)
- Estados: Cerrado (menú en riel) / abierto (clases `side-narrow` + `side-flyout`) (1633) · Se fuerza cerrado al volver a ancho amplio (1501) · No aplica cuando el menú está fijado (`sidebarMode='fijo'`) salvo en teléfono (1513-1515)
- Origen: `dashboard-v2.jsx` 1500-1505, 1633-1636

### Router de acción rápida de KIBO (modal)
- Se abre desde: QuickFab — rueda radial de KIBO, ítem con mode:'modal' (hoy solo «Diario») (1054, 1060-1066), Cualquier parte de la app vía el evento global `kibo:open-modal` con detail.kind (1047-1051)
- Propósito: Monta el formulario REAL de la plataforma correspondiente a la acción elegida en la rueda de KIBO, sin sacar al usuario de la pantalla donde está: el FAB vive fuera de `.kbv-main`, así que el modal se superpone a cualquier pantalla sin que ninguna tenga que conocer a KIBO.
- Campos: Depende de la acción (`action` recibido); los ítems de la rueda son: entry/Diario (modal), session/Leer (navega a lectura), pomodoro/Foco (navega a estudio), tx/Dinero (navega a finanzas) (1053-1057)
- Acciones: Cerrar → setModalAction(null) (1078) · onCreated → no-op en este prototipo (1079)
- Estados: Cerrado (modalAction === null) / abierto con una acción concreta
- Origen: `dashboard-v2.jsx` 1075-1080 (punto de montaje; el componente se define fuera de este archivo)
