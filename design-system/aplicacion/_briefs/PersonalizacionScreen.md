# Personalizacion

- **Artboard:** `PersonalizacionScreen.dc.html`
- **Módulo:** economia
- **Origen:** `personalizacion.jsx` líneas 327-378
- **Propósito:** Todo lo que se puede cambiar de aspecto en un solo sitio: KIBO, carta, prestigios, divisas e interfaz. Como casi todo se compra, tambien vende: ver, comprar y equipar sin cambiar de pantalla. Ruta 'personalizar' del shell (dashboard-v2.jsx:1567-1571), que le pasa navDetail.tab como initialTab.

## Secciones, de arriba abajo

- Page head: eyebrow 'Tuyo · como se ve todo', h1 'Personalizacion.' y parrafo meta que cambia segun la pestana activa (336-342)
- Barra .kbv-store-tabs con las 5 PERS_TABS: KIBO, Carta, Prestigio, Divisas, Interfaz (344-350)
- Pane 'kibo': <KiboStyleTab stats flash> (352)
- Pane 'carta': lead + <CallingCard> en vivo (identidad, nivel, prestigio) + <VitrinaStoreTab> (353-369)
- Pane 'prestigio': <PersPrestigio> (370)
- Pane 'divisas': <PersDivisas> (371)
- Pane 'interfaz': <PersInterfaz> (372)
- Toast .kbv-toast y confirmDialog (374-375)

## Estados que debe mostrar

- tab = 'kibo' (por defecto) | 'carta' | 'prestigio' | 'divisas' | 'interfaz'; initialTab lo puede fijar el deep-link
- Deep-link entrante {screen:'personalizar', tab:'carta'} desde la Vitrina y desde la Tienda
- Toast efimero 2400 ms
- Fallbacks defensivos: si KiboStyleTab / CallingCard / VitrinaStoreTab no existen, el pane simplemente no se dibuja

## Comportamientos que hay que representar

- Cambiar de pestana; el subtitulo del head se recalcula desde PERS_TABS
- Provee flash() y ask() (useConfirm) a todos sus panes hijos
- Pasa onNavigate a PersInterfaz para saltar a 'today' y 'config'
- En 'carta' calcula level, prestigeCompleted/prestigeMaster y llama prestigeInfo(completed, level) para alimentar la CallingCard editable

## Lee de

- user, stats (level, xp, xpMax, prestigeCompleted, prestigeMaster, paragonLevel)
- PERS_TABS
- prestigeInfo()

## Escribe

- Ninguna escritura propia — delega toda la escritura en sus panes (guardarropa KIBO, cosmeticos de carta, nombres de prestigio, skins de divisa, kbSetPref)

## Conceptos del núcleo que toca

- economy/ledger
- identity
- KIBO
- progression engine
- shell

## Modales que se dibujan sobre esta pantalla

### Comprar cosmetico de KIBO
- Se abre desde: KiboStyleTab — click sobre un item bloqueado del catalogo (buy, 575-576)
- Propósito: Confirmar la compra de una piel, marca, aura o personalidad de KIBO; se equipa al instante en el blob del panel izquierdo.
- Campos: Titulo: 'Comprar <item>' · Mensaje: 'Cuesta <costo> de materia oscura|monedas. Se equipa al instante — lo veras en tu KIBO de la izquierda.'
- Acciones: Comprar y equipar → ownKiboItem(id) + setKiboStyle(part, id) + flash '<item> equipado' · Cancelar / cerrar
- Estados: danger: false · Solo aparece con saldo suficiente; sin saldo se muestra flash de la divisa faltante y no hay modal
- Origen: `tienda-screen.jsx` 524-534

### Tu titulo
- Se abre desde: VitrinaStoreTab — boton 'Texto' del titulo custom cuando ya se posee (768), VitrinaStoreTab — al comprar el titulo custom, se abre automaticamente tras equiparlo (777)
- Propósito: Escribir el texto del titulo honorifico a la medida que se porta bajo el nombre en la carta de presentacion.
- Campos: Campo de texto con label '¿Como quieres que te lean?', valor inicial getCardTitleText(), placeholder 'Hasta 22 letras'
- Acciones: Guardar → setCardTitleText(valor recortado) si no queda vacio · Cancelar / cerrar (TextPromptDialog)
- Estados: Valor vacio: no escribe nada (se descarta) · Texto truncado a 22 caracteres al persistir
- Origen: `tienda-screen.jsx` 633-640

### Tus 16 prestigios
- Se abre desde: PersPrestigio — tarjeta 'Escribe los tuyos' (startCustom, 115-120 / 142)
- Propósito: Editar a mano los nombres de los 16 prestigios. Modal propio (.kbv-modal-veil / .kbv-modal-card), no el ConfirmDialog compartido.
- Campos: 16 filas .pers-custom-row, cada una con su numero (1..16) y un input de maxLength 28
- Acciones: Quitar los mios (solo si live.custom): pfSetCustom(null) + flash 'Volviste a la familia elegida' · Cancelar (cierra el draft) · Guardar los 16 → valida que ninguno este vacio (si no, flash 'Ninguno puede quedar vacio'), recorta y llama pfSetCustom · Click en el velo cierra el modal
- Estados: Cerrado (draft == null) · Abierto con los nombres vivos precargados · Ya tiene nombres propios (live.custom): aparece el boton 'Quitar los mios' · Validacion fallida: algun campo vacio → flash y no guarda · Puerta de pago: no abre si no posee los nombres propios y le falta PF_CUSTOM_COST de materia oscura
- Origen: `personalizacion.jsx` 153-187

### Comprar familia de prestigios
- Se abre desde: PersPrestigio — click en un PersCard de familia no poseida (pick, 100-113)
- Propósito: Confirmar la compra de una familia entera de nombres de prestigio, aclarando que el numero y lo que valen no se tocan.
- Campos: Titulo: 'Comprar «<familia>»' · Mensaje: 'Cuesta <costo> de materia oscura. Cambia el nombre de tus 16 prestigios; el numero y lo que valen no se tocan.'
- Acciones: Comprar y poner → pfOwn(id) + pfSetCustom(null) + pfSetActive(id) + flash · Cancelar / cerrar
- Estados: Solo se abre con saldo suficiente; sin saldo, flash 'No tienes suficiente materia oscura — ganala en retos o abrela en cofres'
- Origen: `personalizacion.jsx` 104-109

### ¿Como se llama?
- Se abre desde: PersDivisas — boton 'Renombrar' del head de cada bloque de divisa (231-233)
- Propósito: Renombrar una divisa (materia oscura o monedas) en toda la plataforma. Modal propio pequeno (.kbv-modal-card.sm).
- Campos: Un input autoFocus con el nombre actual (csLabel del kind), maxLength 22
- Acciones: Guardar → csSetName(kind, valor recortado) + flash 'Listo — se llama asi en toda la plataforma' · Cancelar · Click en el velo cierra
- Estados: Cerrado (naming == null) · Abierto para kind 'dark' o kind 'coin'
- Origen: `personalizacion.jsx` 248-265

### Comprar skin de divisa
- Se abre desde: PersDivisas — click en un PersCard de skin no poseido (pick, 198-211)
- Propósito: Confirmar la compra de un glifo/color alternativo para una divisa, aclarando que lo que vale no cambia.
- Campos: Titulo: 'Comprar «<skin>»' · Mensaje: 'Cuesta <costo> de materia oscura. Cambia como se ve y como se llama; lo que vale, no.'
- Acciones: Comprar y poner → csOwn(id) + csSet(kind, id) + flash · Cancelar / cerrar
- Estados: Solo se abre con saldo suficiente; sin saldo, flash 'No tienes suficiente materia oscura'
- Origen: `personalizacion.jsx` 202-207
