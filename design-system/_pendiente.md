# Barrido de recetas — lo que falta

Trabajo del enjambre, truncado a mitad. Sigue por lotes, de arriba hacia abajo.
La cuenta es de usos de receta vieja (`color-mix` sobre un matiz) que quedan en cada
lamina. El contrato completo esta en el script del barrido y en `docs/DESIGN-SYSTEM.md`.

## Lote pesado — laminas que el enjambre no alcanzo a tocar

| Restos | Lamina |
|---|---|
| 42 | `aplicacion/TareasScreen.dc.html` |
| 42 | `aplicacion/EntretenimientoScreen.dc.html` |
| 40 | `aplicacion/RetosScreen.dc.html` |
| 40 | `aplicacion/ComingSoon.dc.html` |
| 39 | `aplicacion/Shell.dc.html` |
| 39 | `aplicacion/Componentes.dc.html` |
| 39 | `aplicacion/DashboardScreenV2.dc.html` |
| 39 | `aplicacion/ShowDetail.dc.html` |
| 39 | `aplicacion/Verdes.dc.html` |
| 28 | `canvas/Emblema.dc.html` |
| 23 | `canvas/Rueda.dc.html` |
| 22 | `canvas/Plataformas.dc.html` · `canvas/Modal.dc.html` · `canvas/Chips.dc.html` · `canvas/Campo.dc.html` |

**El armazon va primero.** `Shell.dc.html` es de donde se andamian las pantallas nuevas:
mientras lleve receta vieja, cada lamina que se genere la hereda.

## Cola — laminas ya convertidas, con un resto que hay que juzgar

De 12 a 3 usos cada una. Buena parte son excepciones legitimas —degradados, sombras con
alfa, escalones graduados que leen `--kb-wash-amt`— y no se convierten. Hay que mirarlas
una por una, no reemplazarlas a ciegas.

## Estado verificado al truncar

- **49/49 laminas validas.**
- **Cero neutros metidos en una receta.** Era el defecto grave y no ocurrio.
- **Tokens base de area intactos**: `--area-vigor` sigue en `#EF4444`.
- **Tres rotulos blancos sobre cara**, corregidos a mano.
- **Contraste medido** sobre una pantalla convertida: 456 nodos de texto, ninguno bajo 4.5.
