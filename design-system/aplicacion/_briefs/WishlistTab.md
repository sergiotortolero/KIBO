# Lista de deseos

- **Artboard:** `WishlistTab.dc.html`
- **Módulo:** economia
- **Origen:** `tienda-screen.jsx` líneas 1003-1066
- **Propósito:** Pane de la pestana 'Lista de deseos' de la Tienda: apartar monedas y materia oscura para funciones de la plataforma; al llenarse la barra la funcion se compra sola. Explicitamente NO tiene que ver con las finanzas reales del usuario.

## Secciones, de arriba abajo

- SectionHead 'Lista de deseos' con meta explicativo usando curLabel('dark') y curLabel('coin')
- Bloque .kbv-wish-reserved en el head: 'Apartado en tu lista' con pill de gemas (incluye '· N de amigos') y pill de monedas (1032-1038)
- Grid .kbv-wish-grid con un WishlistItem por objetivo (1041)
- Tile final: nota 'Anade una funcion' con espacios restantes, o boton 'Comprar espacio extra' cuando la lista esta llena (1042-1060)
- Toast + confirmDialog (1062-1063)

## Estados que debe mostrar

- Con espacios libres (goals.length < slots): tile informativo .as-note con 'Te queda(n) N de M espacios'
- Lista llena (goals.length >= slots): boton de compra de espacio extra por 150 de materia oscura
- Objetivo en progreso / completado (done) — lo pinta WishlistItem
- Objetivo con aportes de amigos (fromFriends > 0) — barra en dos capas y aviso 'no retirables'
- Toast efimero 2200 ms; confirm dialog abierto

## Comportamientos que hay que representar

- Apartar (contribute): suma perWeek/4 al ahorro, tope en target
- Retirar (withdraw): resta un paso pero solo de lo propio — lo aportado por amigos nunca se retira
- Comprar un espacio mas de lista: confirmacion 'Cuesta 150 de <materia oscura>' → slots+1 y toast 'Espacio anadido'
- Recalcula en vivo los totales apartados por divisa y el subtotal de amigos
- useCurrencyRepaint() para repintar cuando cambia el skin/nombre de divisa

## Lee de

- window.WISHLIST (semilla de objetivos, definida en character-screen.jsx)
- stats (prop, para el contexto de saldo)
- curLabel/curGlyph del skin de divisas activo

## Escribe

- Estado local: goals (saved por objetivo), slots, toast

## Conceptos del núcleo que toca

- economy/ledger
- progression engine

## Modales que se dibujan sobre esta pantalla

### Comprar espacio extra de lista de deseos
- Se abre desde: WishlistTab — boton 'Comprar espacio extra', visible solo cuando la lista esta llena (1048-1060)
- Propósito: Confirmar la compra de un espacio mas para apartar hacia otra funcion en paralelo.
- Campos: Mensaje: 'Cuesta 150 de <materia oscura>. Podras apartar para una funcion mas a la vez.'
- Acciones: Comprar el espacio → slots + 1 y toast 'Espacio anadido' · Cancelar / cerrar
- Estados: Unico estado; el boton que lo abre solo existe cuando goals.length >= slots
- Origen: `tienda-screen.jsx` 1049-1059
