# Áreas · Centro de análisis (orquestador)

- **Artboard:** `AreasScreenV3.dc.html`
- **Módulo:** areas
- **Origen:** `areas-v2.jsx` líneas 1048-1116
- **Propósito:** The live Áreas route. A two-mode shell: panorama of all life areas ('general') or the detail of one area. Explicitly an ANALYSIS surface — it never executes work, it hyperlinks to the module where the work lives.

## Secciones, de arriba abajo

- Page head: eyebrow 'Áreas · Centro de análisis', h1 'Áreas.' + InfoDot explaining the hierarchy Área → Proyecto → Tarea (Voluntad: Reto/Hábito) (1084-1092)
- Body: <AreasGeneralV3> when view==='general', else <AreaDetailV3 key={id+':'+subTab}> (1094-1097)
- BuyAreaSlotCard (only in 'general'), price 200, balance from stats.gems, owned = areas.length (1099-1105)
- EditAreaModal mount (1107-1109) · confirm dialog mount (1110) · CreateAreaModal mount (1111-1113)

## Estados que debe mostrar

- general (panorama)
- detail of one area (view = area id)
- detail forced to a sub-tab via navDetail.tab
- area list mutated locally by create / save / delete

## Comportamientos que hay que representar

- Open an area from any card/row → setView(id) (1095)
- Back from detail → setSubTab(null); setView('general') (1097)
- navDetail.area enters that area; navDetail without area returns to the panorama and clears the sub-tab; navDetail.tab pre-selects a sub-tab (1056-1063)
- Save area edits (AreaConfigV3 → onSaveArea) patches the local area list (1066)
- onDeleteArea opens a useConfirm 'Quitar «X»' — 'Los proyectos asociados quedarán sin área, pero no se borran' — then removes the area and returns to general (1067-1074) — never wired to a caller
- onCreateArea mints id 'custom-' + random base36 slice and appends the area (1075-1078)
- Buy a 6th area slot → opens CreateAreaModal (1103)

## Lee de

- hero.areas
- KIBO_AREAS_V2
- stats.gems (materia oscura balance)
- navDetail {area, tab}

## Escribe

- local area list (create / save / delete)

## Conceptos del núcleo que toca

- identity
- habit
- reto
- task
- project
- progression engine
- economy/ledger
- shell

## Modales que se dibujan sobre esta pantalla

### Confirmación · «Quitar {área}»
- Se abre desde: AreasScreenV3.onDeleteArea — declared but never passed to any child, so currently unreachable
- Propósito: useConfirm dialog for removing an area, promising that associated projects survive un-assigned.
- Campos: Title 'Quitar «{area.name}»' · Message 'Los proyectos asociados quedarán sin área, pero no se borran.'
- Acciones: Sí, quitar área → removes the area and returns to the panorama · implicit cancel
- Estados: unreachable in the current wiring
- Origen: `areas-v2.jsx` 1067-1074
