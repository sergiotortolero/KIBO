# Configuración del proyecto (tab)

- **Artboard:** `ProjectConfig.dc.html`
- **Módulo:** Proyectos
- **Origen:** `screens-v2.jsx` líneas 1139-1272
- **Propósito:** Cuerpo de la pestaña «Configuración» de ProjectDetail: edita identidad, área/color, peso y urgencia, fechas, visibilidad y zona de archivar/borrar. Es un formulario de página completa, no un modal.

## Secciones, de arriba abajo

- Tarjeta 'Identidad' — «cómo se llama y para qué es»: Nombre, Meta, Descripción, Etiquetas
- Tarjeta 'Área y color' — «el color lo hereda del área»: rejilla de iconos de áreas (excluye 'will') + nota «Este proyecto suma a X» / «Sin área: no suma XP a ningún frente» + enlace 'Ver el área'
- Tarjeta 'Peso y urgencia' — «deciden la recompensa»: Complejidad (4 tiles con +XP) y Prioridad (5 tiles PRIORITY_ORDER)
- Tarjeta 'Fechas' — «también se mueven arrastrando en el cronograma»: Inicio y Fin objetivo (date)
- Tarjeta 'Quién lo ve' — visibilidad: Solo yo / Mi familia (PROJECT_VIS)
- Tarjeta de peligro 'Archivar o borrar' — «archivar se puede deshacer»: botón Archivar y botón Borrar (rojo)
- Barra de guardado: estado 'Guardado ✓' / 'Cambios sin guardar' + botón «Guardar cambios»

## Estados que debe mostrar

- saved true/false (etiqueta 'Guardado ✓' vs 'Cambios sin guardar'; cualquier cambio la vuelve a marcar sucia)
- Con área seleccionada vs sin área
- Diálogo de confirmación de borrado abierto

## Comportamientos que hay que representar

- Editar nombre, meta, descripción y etiquetas
- Elegir área (hereda color) e ir al área con goToArea
- Elegir complejidad (define XP) y prioridad
- Fijar fechas de inicio y fin objetivo (se convierten a timestamp tlStart/tlEnd)
- Elegir visibilidad (privado / familia)
- Archivar: guarda con archived:true y vuelve atrás
- Borrar: confirmación «Sus tareas quedan sin proyecto, pero no se borran. Esto no se puede deshacer.» → guarda deleted:true y vuelve atrás
- Guardar cambios sin salir

## Lee de

- project (name, desc, goal, area, complexity, priority, tags, visibility, tlStart, tlEnd)
- KIBO_AREAS_V2, COMPLEXITY_DEFS, PRIORITY_DEFS/PRIORITY_ORDER, PROJECT_VIS

## Escribe

- onSave({...project, ...draft}) — identidad, área, complejidad, prioridad, etiquetas, fechas, visibilidad
- onSave con archived:true / deleted:true

## Conceptos del núcleo que toca

- project
- identity (áreas y visibilidad)
- progression engine (XP por complejidad)
