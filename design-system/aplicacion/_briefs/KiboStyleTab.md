# Guardarropa de KIBO

- **Artboard:** `KiboStyleTab.dc.html`
- **Módulo:** economia
- **Origen:** `tienda-screen.jsx` líneas 502-617
- **Propósito:** El guardarropa cosmetico de la mascota KIBO: vista previa en vivo a la izquierda y catalogo por categoria a la derecha; comprar equipa al instante y escribe el guardarropa compartido que el blob del sidebar lee en vivo. Se renderiza como pestana 'KIBO' de PersonalizacionScreen (no desde la Tienda).

## Secciones, de arriba abajo

- Aside .kw-preview: eyebrow 'Vista previa', escenario con <KiboBlob size=150 idle styleOverride> y nota contextual
- Resumen .kw-fit: una fila por seccion (Pieles, Marcas, Auras, Personalidad) con los nombres equipados o '—' (548-555)
- Catalogo .kw-catalog: una <section> por cada KIBO_STYLE_SECTIONS con SectionHead (nombre + hint) y grid .kw-grid de items
- Item .kw-item: miniatura KiboSpecimen, nombre y precio/estado ('Puesto'/'Equipado'/'Lo tienes'/precio con Gem o Coin)
- Selector de ranura .kw-slots para las marcas multi (frente/nariz/cachetes via window.MARK_SLOTS) (591-607)

## Estados que debe mostrar

- Item equipado (on) — en secciones multi muestra 'Puesto', en simples 'Equipado'
- Item en propiedad pero no puesto: 'Lo tienes'
- Item bloqueado (clase 'locked'): muestra precio en monedas o materia oscura
- Preview activo por hover/focus (styleOverride temporal) vs look actual al soltar
- Saldo insuficiente: flash de la divisa faltante y no se compra
- Seccion multi (Marcas) permite varias piezas simultaneas con ranura elegible

## Comportamientos que hay que representar

- Hover/focus sobre un item lo previsualiza en el KiboBlob; mouseleave/blur vuelve al look real
- Click en item no comprado: valida saldo, pide confirmacion 'Comprar y equipar', luego ownKiboItem(id) + setKiboStyle(part,id) y flash '<item> equipado'
- Click en item en propiedad simple: setKiboStyle(part,id)
- Click en item multi (marcas): alterna ponerlo/retirarlo conservando la posicion elegida; si queda vacio escribe 'mk-none'
- Click en una ranura de marca: reescribe el id como '<id>@<slot>' (o el id pelado para 'cder')
- Escucha 'kibo:kibo-change' para refrescar la lista de items en propiedad

## Lee de

- useKiboStyle() — estilo equipado actual
- getKiboOwned() — set de cosmeticos en propiedad
- KIBO_STYLE_CATALOG (guardarropa compartido, vive en kibo-style.jsx)
- window.MARK_SLOTS
- stats.gems / stats.coins para la validacion de saldo

## Escribe

- ownKiboItem(id) y setKiboStyle(part, value) — guardarropa compartido; disparan 'kibo:kibo-change'

## Conceptos del núcleo que toca

- economy/ledger
- KIBO
- identity

## Modales que se dibujan sobre esta pantalla

### Comprar cosmetico de KIBO
- Se abre desde: KiboStyleTab — click sobre un item bloqueado del catalogo (buy, 575-576)
- Propósito: Confirmar la compra de una piel, marca, aura o personalidad de KIBO; se equipa al instante en el blob del panel izquierdo.
- Campos: Titulo: 'Comprar <item>' · Mensaje: 'Cuesta <costo> de materia oscura|monedas. Se equipa al instante — lo veras en tu KIBO de la izquierda.'
- Acciones: Comprar y equipar → ownKiboItem(id) + setKiboStyle(part, id) + flash '<item> equipado' · Cancelar / cerrar
- Estados: danger: false · Solo aparece con saldo suficiente; sin saldo se muestra flash de la divisa faltante y no hay modal
- Origen: `tienda-screen.jsx` 524-534
