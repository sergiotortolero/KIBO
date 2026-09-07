# Tienda

- **Artboard:** `StoreScreen.dc.html`
- **Módulo:** economia
- **Origen:** `tienda-screen.jsx` líneas 1071-1417
- **Propósito:** La tienda de la economia interna: gasta monedas y materia oscura en modulos premium, cofres, widgets del tablero, funciones desbloqueables y recompensas personalizadas que el usuario mismo define. Ruta 'store' del shell (dashboard-v2.jsx:1608-1610).

## Secciones, de arriba abajo

- Page head: eyebrow crumb('store','Cofres, funciones y lo que tu defines'), h1 'Tienda.' con InfoDot explicativo, y a la derecha dos pills de saldo (CoinIcon + stats.coins, GemIcon + fmtNum(stats.gems,5340)) (1145-1160)
- Barra de pestanas .kbv-store-tabs-v2 con 6 botones y contadores: Modulos (n de PREMIUM_MODULES), Lista de deseos, Mis recompensas (custom.length), Cofres, Widgets (storeWidgets().length), Funciones (STORE_UNLOCKS.length) (1162-1182)
- TAB Modulos: banner freemium 'Kibo es modular y freemium' + grid .kbv-modules-grid de PREMIUM_MODULES con icono, nombre, desc y boton de compra en gemas o sello 'Desbloqueado' (1185-1222)
- TAB Lista de deseos: delega en <WishlistTab stats> (1228)
- TAB Mis recompensas: banner 'Tus recompensas, tus reglas' + boton 'Nueva recompensa'; grid .kbv-store-grid de CustomRewardItemV2 + tile 'Crear recompensa' (1231-1260)
- TAB Cofres: banner 'Compra cofres con monedas, gana materia oscura' + grid .kbv-chests-grid con un ChestCard por cada STORE_CHESTS (1263-1282)
- TAB Widgets: banner con conteo de gratis vs de pago y pills de saldo; luego una seccion por cada TIENDA_WIDGET_SECTIONS (Hoy, Habitos y Retos, Tareas y Proyectos, Diario, Lectura, Estudio-Pomodoro, Entretenimiento, Finanzas) con head, contador 'N widgets · M de pago' y grid de RegistryWidgetCard ordenados gratis→monedas→gemas y por precio (1285-1344)
- TAB Funciones: banner 'Capacidades extra' + una seccion por STORE_UNLOCK_GROUPS (Mas espacio, Mas potencia, Proteccion, Inteligencia, Rueda de KIBO) con contador 'N tuyas · M funciones' y grid de UnlockItem (1347-1382)
- Tarjeta puente .st-elsewhere (solo en tab Modulos): '¿Buscas cosmeticos?' con boton 'Abrir Personalizacion' (1386-1398)
- Capa de overlays: CustomRewardModalV2, ChestOpeningOverlay, confirmDialog y toast .kbv-social-toast (1400-1414)

## Estados que debe mostrar

- tab = 'modules' (por defecto) | 'wishlist' | 'rewards' | 'chests' | 'widgets' | 'unlocks'
- initialTab cosmetico redirigido: si initialTab es 'kibo' o 'vitrina' (COSMETIC_TABS) aterriza en 'modules' en vez de en pantalla en blanco (1072-1076)
- Modulo comprado (owned via unlockedModules) vs bloqueado: sello 'Desbloqueado'/'Activo' vs boton con precio en gemas
- Widget owned (ownedWidgets Set local) vs comprable vs gratis
- Funcion: owned solo para rubros de rueda (u.qa && qaHas.has(id)); las demas se muestran con clase 'soon'
- Saldo insuficiente: toast 'No tienes suficiente materia oscura…' / 'No tienes suficientes monedas…' y la compra no ocurre
- Funcion no-qa: toast '<nombre> llega en una proxima version — todavia no se puede comprar' (falso-positivo evitado a proposito)
- Ceremonia de cofre abierta (chestResult != null) — bloquea la pantalla con overlay a pantalla completa
- Modal de recompensa abierto en modo crear (editing=null) o editar (editing=reward)
- Toast efimero 2600 ms; confirm dialog abierto

## Comportamientos que hay que representar

- Cambiar de pestana con los botones del tab bar
- Comprar modulo premium: delega en onUnlock(id) del shell (no cobra aqui)
- Comprar widget (buyWidget): compara saldo de la divisa del widget contra stats; si alcanza lo agrega a ownedWidgets, si no lanza toast de saldo
- Comprar funcion (buyUnlock): si no es rubro de rueda avisa que aun no se puede comprar; si lo es valida gemas, pide confirmacion y llama qaOwn(id) — queda en la rueda de accion rapida al instante
- Abrir cofre (openChest): registra kiboLog({kind:'money-out'}), tira gemRange y coinRange y luego cada odd (guaranteed o Math.random()<p) para armar el array de recompensas, y abre la ceremonia
- Reclamar recompensas del cofre: toast 'Reclamaste <cofre>' y cierra el overlay
- Crear/editar recompensa personalizada (saveCustom) y borrarla con confirmacion (removeCustom)
- Canjear recompensa personalizada: el boton existe pero onBuy es no-op ({}) en esta pantalla (1249)
- Ir a Personalizacion: despacha window CustomEvent 'kibo:navigate' con {screen:'personalizar'}
- Escucha 'kibo:qa-change' para refrescar que rubros de rueda son tuyos (1089-1093)

## Lee de

- stats.coins y stats.gems (saldo de las dos divisas)
- unlockedModules (prop del shell) y catalogo global PREMIUM_MODULES
- WIDGET_REGISTRY via storeWidgets() — el mismo catalogo y precios que el dashboard
- KIBO_QA_MODULES (rubros de la rueda con costo) y qaOwned()
- STORE_CHESTS, STORE_UNLOCKS, STORE_UNLOCK_GROUPS, DEFAULT_CUSTOM_REWARDS_V2, CHEST_PRIZES
- window.WISHLIST (a traves de WishlistTab)

## Escribe

- kiboLog({ kind: 'money-out', label: '<cofre> · <costo> monedas' }) al abrir un cofre (1129)
- qaOwn(id) — posesion de rubro de rueda, dispara 'kibo:qa-change'
- CustomEvent 'kibo:navigate' {screen:'personalizar'}
- Estado local: ownedWidgets Set, custom rewards array, chestResult, toast

## Conceptos del núcleo que toca

- economy/ledger
- progression engine
- shell
- KIBO
- habit
- reto
- task
- identity

## Modales que se dibujan sobre esta pantalla

### Ceremonia de apertura de cofre
- Se abre desde: StoreScreen — tab Cofres, boton 'Abrir · <costo>' de un ChestCard (openChest, 1128-1141 / render 1407-1412)
- Propósito: Overlay a pantalla completa (role=dialog) que dramatiza la apertura de un cofre y luego revela las recompensas obtenidas. La intensidad (chispas, anillos, sacudida, espera) escala por rareza segun CHEST_FANFARE.
- Campos: Ninguno de entrada. Muestra: titulo '¡<cofre> abierto!', una .cc-card por recompensa (monedas con CoinIcon, materia oscura con GemIcon, premios con su KIcon, label/sub y color), y la nota 'La materia oscura ya esta en tu cartera.'
- Acciones: Reclamar todo (autoFocus) → onClaim: toast 'Reclamaste <cofre>' y cierra el overlay
- Estados: drop (cae, 700 ms) · shake (se sacude, fan.hold: 900/1200/1500/1900 ms segun tier) · unlock (se abre la tapa, 550 ms) · burst (estalla el destello y se expanden fan.rings anillos, 750 ms) · rewards (cascada de tarjetas de recompensa con delay escalonado) · prefers-reduced-motion: arranca directo en 'rewards' y no programa timers
- Origen: `tienda-screen.jsx` 367-463

### Nueva / Editar recompensa
- Se abre desde: StoreScreen — tab Mis recompensas: boton 'Nueva recompensa' del banner (1241), StoreScreen — tab Mis recompensas: tile 'Crear recompensa' del grid (1253), StoreScreen — accion Editar de una CustomRewardItemV2 (1250)
- Propósito: Crear o editar una recompensa personalizada del usuario. Solo cuesta monedas por diseno: la materia oscura es exclusiva de Premium.
- Campos: Nombre (texto, autoFocus, requerido) · Costo en monedas (numerico, min 1, con prefijo CoinIcon y sufijo 'monedas') · Descripcion (textarea) · Icono — conmutador de modo: Preset (grid de los 8 REWARD_ICON_PRESETS) o Custom (campo de emoji maxLength 4 + boton 'O sube imagen (PNG, JPG, SVG)') · Color de acento (8 swatches de token)
- Acciones: Cancelar (cierra sin guardar) · Crear / Guardar (deshabilitado mientras el nombre este vacio) → onSave con id generado o el existente, currency siempre 'coin' · Cerrar via KBVModal onClose
- Estados: Modo crear (edit == null): titulo 'Nueva recompensa', costo por defecto 100, icono 'shop' · Modo editar (edit != null): titulo 'Editar recompensa', campos precargados, modo de icono deducido de customImage · iconMode 'preset' vs 'custom' (previews distintos) · Boton primario deshabilitado sin nombre · Aviso permanente al pie: las recompensas custom solo cuestan monedas
- Origen: `tienda-screen.jsx` 842-956

### Confirmar compra de funcion (rubro de rueda)
- Se abre desde: StoreScreen — tab Funciones, boton de precio de un UnlockItem con u.qa true (buyUnlock, 1095-1107)
- Propósito: Confirmar el cobro en materia oscura de un rubro de la Rueda de KIBO antes de ponerlo en la accion rapida.
- Campos: Mensaje: 'Cuesta <costo> de materia oscura. Queda en tu accion rapida al instante; puedes ordenarla o quitarla desde el «⋯» de KIBO.'
- Acciones: Comprar y poner en la rueda → qaOwn(id) + toast '<nombre> ya esta en tu rueda' · Cancelar / cerrar (ConfirmDialog)
- Estados: Solo se abre si el item es rubro de rueda y hay saldo suficiente; si no, no hay modal — solo toast
- Origen: `tienda-screen.jsx` 1102-1106

### Borrar recompensa
- Se abre desde: StoreScreen — tab Mis recompensas, accion Eliminar de una CustomRewardItemV2 (onDelete, 1251)
- Propósito: Confirmar el borrado de una recompensa personalizada, aclarando que no afecta lo ya canjeado.
- Campos: Mensaje: '¿Borrar «<nombre>»? No afecta lo que ya canjeaste.'
- Acciones: Si, borrar → quita la recompensa del arreglo custom · Cancelar / cerrar
- Estados: Unico estado (confirmacion simple)
- Origen: `tienda-screen.jsx` 1125-1127
