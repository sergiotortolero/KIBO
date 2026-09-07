# Tienda de la carta (Vitrina)

- **Artboard:** `VitrinaStoreTab.dc.html`
- **Módulo:** economia
- **Origen:** `tienda-screen.jsx` líneas 622-825
- **Propósito:** Catalogo comprable de la 'carta de presentacion': portadas, marcos de foto, titulos honorificos, companero KIBO y casillas extra de vitrina. Lo equipado se refleja en la Vitrina y en el HUD del header. Se renderiza dentro de la pestana 'Carta' de PersonalizacionScreen.

## Secciones, de arriba abajo

- Aviso de error de imagen .vts-warn (condicional, role=alert)
- Tarjeta explicativa 'Tu carta de presentacion' (658-670)
- PORTADAS: head + grid .kbv-vts-grid sobre window.CARD_BACKGROUNDS, cada item con preview real via CardBackdrop (673-723)
- Herramientas del solido: input color + input HEX de texto + swatches CARD_SOLIDS (685-701)
- Herramientas de imagen propia: subir/cambiar archivo, quitar, hint '1200x360 px' (702-712)
- MARCOS: head + grid sobre window.CARD_FRAMES con preview del aro (726-748)
- TITULOS: head + grid sobre window.CARD_TITLES con preview del honorifico; para el titulo a la medida, boton 'Texto' y swatches TITLE_COLORS (751-781)
- COMPANERO: head + grid sobre window.CARD_PETS con KiboPet haciendo el gesto comprado (784-802)
- CASILLAS: head con 'Tienes N de M' + grid sobre window.SLOT_PACKS (805-822)

## Estados que debe mostrar

- Item equipado (clase 'equipped'): boton deshabilitado 'Activa'/'Activo'/'Portando'/'Equipado'
- Item en propiedad no equipado: boton 'Equipar'/'Portar'
- Item no comprado: boton con <Price> (Gem o Coin + costo)
- Portada solida en propiedad: herramientas de color HEX visibles
- Portada de imagen en propiedad: subir imagen o, si ya hay, 'Cambiar imagen' + 'Quitar'
- Error de imagen: archivo >1.8 MB → 'La imagen pesa mas de 1.8 MB…'; fallo de lectura → 'No se pudo leer el archivo.'
- Vitrina llena (cos.slots >= VITRINA_MAX_SLOTS): pack de casillas deshabilitado con 'Vitrina llena'

## Comportamientos que hay que representar

- Equipar portada/marco/titulo/companero (setCardBg, setCardFrame, setCardTitle, setCardPet)
- Comprar: buyCard(id) e inmediatamente equipar el item comprado
- Elegir color solido con selector nativo o escribiendo HEX (normalizeHex valida); tambien atajos de swatch
- Subir imagen propia: valida tamano, la lee como data URL y la guarda en localStorage via setCardBgImage; 'Quitar' la borra
- Editar el texto del titulo a la medida (usePrompt, max 22 letras) y su color (setCardTitleColor)
- Comprar pack de casillas: addCardSlots(p.slots)

## Lee de

- useCardCosmetics() → { bg, frame, slots, title, pet }
- getCardOwned() — set de cosmeticos de carta en propiedad
- window.CARD_BACKGROUNDS, CARD_FRAMES, CARD_TITLES, CARD_PETS, SLOT_PACKS, CARD_SOLIDS, TITLE_COLORS, VITRINA_MAX_SLOTS
- getCardBgColor(), getCardBgImage(), getCardTitleText(), getCardTitleColor()

## Escribe

- localStorage kibo:cardBg / cardFrame / cardSlots / cardTitle / cardPet / cardBgColor / cardBgImage / cardTitleText / cardTitleColor / cardOwned
- Evento 'kibo:card-change' en cada escritura (lo consumen la Vitrina, el HUD y la Tienda)

## Conceptos del núcleo que toca

- economy/ledger
- identity
- KIBO
- shell

## Modales que se dibujan sobre esta pantalla

### Tu titulo
- Se abre desde: VitrinaStoreTab — boton 'Texto' del titulo custom cuando ya se posee (768), VitrinaStoreTab — al comprar el titulo custom, se abre automaticamente tras equiparlo (777)
- Propósito: Escribir el texto del titulo honorifico a la medida que se porta bajo el nombre en la carta de presentacion.
- Campos: Campo de texto con label '¿Como quieres que te lean?', valor inicial getCardTitleText(), placeholder 'Hasta 22 letras'
- Acciones: Guardar → setCardTitleText(valor recortado) si no queda vacio · Cancelar / cerrar (TextPromptDialog)
- Estados: Valor vacio: no escribe nada (se descarta) · Texto truncado a 22 caracteres al persistir
- Origen: `tienda-screen.jsx` 633-640
