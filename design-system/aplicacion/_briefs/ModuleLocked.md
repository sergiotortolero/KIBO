# Módulo premium bloqueado (compuerta freemium)

- **Artboard:** `ModuleLocked.dc.html`
- **Módulo:** dashboard
- **Origen:** `dashboard-v2.jsx` líneas 1388-1407
- **Propósito:** Superficie de desbloqueo que sustituye a cualquier pantalla de un módulo premium no comprado. Explica el modelo modular (núcleo gratis para siempre, módulos con fragmentos ganables jugando) y ofrece las dos salidas: desbloquear aquí o ir a la Tienda.

## Secciones, de arriba abajo

- Icono grande del módulo (1393)
- Badge «Módulo premium» (1394)
- Título = nombre del módulo (1395)
- Descripción del módulo (1396)
- Nota sobre el modelo modular / fragmentos ganables (1397)
- Acciones (1398-1403)

## Estados que debe mostrar

- Módulo conocido (uno de los 6 de PREMIUM_MODULES)
- Fallback cuando el id no existe: { name:'Módulo', icon:'shield', cost:0, desc:'' } (1389)

## Comportamientos que hay que representar

- Botón primario «Desbloquear · {cost} fragmentos» → unlockModule(active) en el shell (1399-1401, 1629)
- Botón fantasma «Ver módulos en la Tienda» → navega a store con tab='modules' (1402, 1629)
- Se muestra automáticamente cuando isLockedModule(active) es cierto, sea cual sea la ruta (1519, 1628-1630)

## Lee de

- PREMIUM_MODULES[id] — nombre, icono, costo, descripción (1389)
- unlockedModules (del shell)

## Escribe

- unlockedModules (desbloqueo) — gasto de fragmentos implícito
- navDetail.tab='modules' + active='store'

## Conceptos del núcleo que toca

- economy/ledger
- freemium/modules
- shell
