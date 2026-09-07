# Personalizacion · Interfaz

- **Artboard:** `PersInterfaz.dc.html`
- **Módulo:** economia
- **Origen:** `personalizacion.jsx` líneas 271-324
- **Propósito:** Como se comporta la plataforma alrededor del contenido: modo del menu lateral, densidad visual y atajos a lo que se configura en su propio sitio. Es el unico pane de Personalizacion que no vende nada.

## Secciones, de arriba abajo

- Lead .pers-lead
- Bloque 'Menu lateral': dos opciones .pers-choice — Replegable / Fijo (283-291)
- Bloque 'Densidad': tres opciones — Compacta / Estandar / Amplia (296-305)
- Bloque 'Atajos': tres .pers-link — Widgets del tablero (a 'today'), Tu rueda de accion rapida (solo instruccion), Configuracion (a 'config') (310-320)

## Estados que debe mostrar

- sidebarMode = 'replegable' (por defecto) | 'fijo' — la opcion activa lleva clase 'on'
- density = 'compacta' | 'estandar' (por defecto) | 'amplia'
- Fallback: si useKbPrefs no existe, prefs = {} y se usan los valores por defecto

## Comportamientos que hay que representar

- Elegir modo de menu: kbSetPref('sidebarMode', id) + flash 'Listo'
- Elegir densidad: kbSetPref('density', id) + flash 'Listo'
- Atajo 'Widgets del tablero': onNavigate('today')
- Atajo 'Tu rueda de accion rapida': no navega — flash 'Toca a KIBO y usa el ⋯ bajo el'
- Atajo 'Configuracion': onNavigate('config')

## Lee de

- useKbPrefs() → sidebarMode, density

## Escribe

- kbSetPref('sidebarMode'|'density') → localStorage 'kibo:prefs' + evento 'kibo:prefs'

## Conceptos del núcleo que toca

- shell
- identity
