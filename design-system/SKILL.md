---
name: kibo-design
description: Usa este skill para generar interfaces y activos bien marcados de Kibo, el Personal OS gamificado (RPG de productividad), tanto para producción como para prototipos y mocks desechables. Contiene las guías de diseño esenciales, colores, tipografía, fuentes, activos y componentes de UI kit para prototipar.
user-invocable: true
---

Lee el `README.md` de este skill y explora los demás archivos. La documentación está en **español**.

`colors_and_type.css` es la fuente de verdad de todos los tokens (color, paleta de gamificación,
áreas de vida, prioridades, familias tipográficas y la escala de 9 pasos, radios, sombras, espaciado
de 2px, z-index, movimiento) más las clases de tipo `.kbv-*`. Impórtalo y construye con los tokens —
nunca escribas valores de marca a mano.

Antes de reconstruir cualquier sección, lee **`docs/reconstruccion.md`**: trae el plan v2 sección por
sección, las reglas transversales ya decididas y la deuda técnica heredada. `reference/` tiene la
fuente real de Kibo v1 (20 archivos) y es la verdad de campo sobre la estructura de los componentes.

Datos clave que debes interiorizar:

- **Marca:** teal `#1CA4A0` («progreso sereno»); **DOS familias**: Plus Jakarta Sans (display,
  números *y* etiquetas) e Inter (cuerpo y metadatos). La mono se retiró. Las etiquetas van en
  **minúscula, 11px, peso 700** — nunca MAYÚSCULAS con tracking amplio. Claro, amable, gamificado. Voz cercana y motivadora, español primero (es-MX) más
  inglés, de «tú», con la frase *«el fracaso reencauza»*.
- **La gamificación es la marca:** colores de HP/XP/moneda/gema/racha, 5 áreas de vida, 5
  prioridades, 9 materiales de rango, 16 grados de prestigio, 9 tiers de llama, la economía de la
  Vitrina. Ver *Fundamentos visuales* en el README y las tarjetas de `preview/`.
- **Regla de acento — la más importante.** Está **prohibida** la franja de color en una sola orilla
  (`border-left: 3px solid var(--c)`). Tarjeta grande → banda de encabezado tintada al 11%. Pieza
  compacta → pastilla de área. Barra de cronograma → barra sólida. Nota o cita → fondo tintado al 6%
  + glifo. Cuando compiten área y prioridad: **el área pinta, la prioridad marca** (medidor
  escalonado de 3 barras). Ver `preview/regla-acento.html`.
- **Íconos:** **Lucide** desde CDN, con la convención `dominio/nombre/variante`
  (`area/vigor/solid`, `gamif/flame/line`). Trazo 2px a 22px+, 2.4px a 16px o menos. El glifo mide
  1.15× su texto y nunca excede su contenedor. Ver `docs/iconografia.md`.
- **Animación:** nombres `dominio/objeto/acción` (`kibo/idle/flotar`, `ui/card/entrar`). Duraciones
  `fast 120 · base 200 · slow 300 · slower 400`. Con `prefers-reduced-motion` sobreviven **solo** las
  de `kibo/*`. Ver `preview/animaciones.html`.
- **Gráficas:** lenguaje *blocky* — cero rejilla, formas gruesas redondeadas, el dato dentro de la
  forma; en gráficas delgadas, al lado. El KPI base lleva etiqueta con glifo, valor dominante y pie
  con comparativa y chip de estado.
- **KIBO:** el logo no es una «K», es la mascota — un blob teal **plano en 2D** (sin sombreado 3D, sin
  degradado, sin halo), flotante fijo abajo a la derecha. El ánimo le cambia el color (7 ánimos), la
  actividad le cambia la forma. Ver `preview/kibo-mascot.html`.
- **Cuidado:** el código vivo de `apps/web` **no** está migrado a estos tokens (sigue con turquesa,
  Geist y degradado índigo de shadcn). Construye contra este sistema, no contra el `:root` vivo.
- Cero degradados azul-morado, salvo las portadas compradas de la Vitrina.

Si generas artefactos visuales (slides, mocks, prototipos desechables), copia los activos de
`assets/` y produce archivos HTML estáticos que el usuario pueda ver. Los componentes de
`ui_kits/app/` y `ui_kits/web/` son puntos de partida reutilizables: levanta su JSX y CSS. Si
trabajas en código de producción, copia los activos y lee las reglas de aquí para volverte experto en
diseñar con esta marca.

Si el usuario invoca este skill sin más contexto, pregúntale qué quiere construir o diseñar, haz
algunas preguntas, y actúa como diseñador experto de Kibo que entrega artefactos HTML _o_ código de
producción, según la necesidad.
