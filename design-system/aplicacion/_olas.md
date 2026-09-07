# Plan de reconstrucción — oleadas

64 pantallas de producto y 87 modales, sobre el armazón `Shell.dc.html`. Se reconstruyen
en oleadas por valor: el lazo diario primero. Cada oleada cierra con auditoría y commit,
de modo que un corte cuesta una oleada y no el trabajo entero.

No se reconstruyen: las 8 pantallas probadas muertas (otro archivo las pisa al cargar) ni
los 7 artefactos que no son producto (elementos de arranque, hojas de comparación de
variantes y el catálogo vivo de animaciones).

| Ola | Qué cubre | Archivos de origen | Pantallas | Modales |
|---|---|---|---|---|
| 1 | **El lazo diario** — cuadro de mando, hábitos, retos, detalle de tarea y captura rápida | `dashboard-v2` · `personal-screens` · `tarea-detalle` · `kibo-quick` | 12 | 14 |
| 2 | **Progresión y economía** — áreas, tienda, personalización, logros, prestigio, personaje | `areas-v2` · `tienda-screen` · `personalizacion` · `achievements` · `prestige-system` · `character-screen` | 17 | 17 |
| 3 | **Bitácora** — finanzas, salud, estudio, escuela, cursos, recursos | `finanzas-screens` · `salud-screen` · `estudio-screen` · `estudio-escuela` · `estudio-cursos` · `recursos-screen` | 19 | 15 |
| 4 | **Acceso, social y cuenta** — entrada, alta, social, cuenta y las pantallas restantes | `auth-v2` · `onboarding-v2` · `social-screen` · `cuenta-config` · `screens-v2` | 16 | 16 |

## Reglas que toda pantalla respeta

- Compone el armazón: copia su marcado y estilos, y su contenido vive en la región de contenido.
- Un artboard por pantalla, corte de escritorio (1440 px). El teléfono es otra pista de diseño.
- Los modales de una pantalla se dibujan como estados sobre ella, no como archivos sueltos.
- Cada estado que la pantalla tiene en el prototipo se muestra: vacío, cargando, lleno, bloqueado, error.
- Sólo piezas y valores del sistema de diseño; ningún color escrito a mano.
- Datos de muestra, nunca datos personales: el repositorio es público.
