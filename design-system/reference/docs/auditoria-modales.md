# Auditoría de modales — Kibo · **CERRADA** (resultado al final)

Objetivo: un solo estándar de modal para toda la plataforma. Donde haya dos
modales para el mismo caso, homologar; donde deban seguir separados, dejar la
justificación escrita.

## El estándar (extraído de los modales que ya funcionan bien)

Anatomía fija, de arriba abajo:

1. **Cabecera** — título (Plus Jakarta 800) + subtítulo de una línea que dice
   qué se registra y para qué. Cerrar con ⓧ arriba a la derecha.
2. **Selector de tipo** — chips en fila, el activo en color pleno (tipo de nota,
   tipo de registro médico, tipo de reto). Solo si la entidad tiene variantes.
3. **Campo principal** — nombre/título, obligatorio, con `autoFocus` y un
   placeholder con tres ejemplos reales separados por coma.
4. **Campos secundarios** — en rejilla de 2 columnas; los opcionales van
   marcados «(opcional)» en gris, nunca con asterisco invertido.
5. **Escalas 1–5** — siempre `RateRow` (esfuerzo, energía, dificultad) y
   `PriorityRow` para prioridad. Mismo control en toda la app.
6. **Tira de recompensa** — cuando la entidad otorga XP/monedas, banda teal al
   final del cuerpo explicando cómo se calcula.
7. **Pie** — recompensa a la izquierda (si aplica), luego Cancelar (fantasma) y
   la acción primaria a la derecha con verbo + ⓧ/✓. Deshabilitada mientras
   falte el campo obligatorio.
8. **Confirmación destructiva** — franja en el pie (`ConfirmFooter`), nunca un
   modal anidado ni `confirm()` del navegador.

Anchos: `sm` confirmaciones · `md` altas rápidas · `lg` formularios y detalle ·
`full` galerías.

## Modales a auditar

### Altas (crear entidad)
- Nueva tarea · Nuevo proyecto · Nuevo hábito · Nuevo reto · **Nuevo reto
  compartido** · Nueva entrada de diario · Registrar libro · Registrar serie ·
  Nuevo movimiento · Nuevo proyecto financiero · Nueva nota de lectura ·
  Agregar al expediente · Nueva actividad de curso.
- **Sospecha de duplicado:** `CreateSharedRetoModal` (personal-screens) vs
  `CreateRetoModal`. Un reto compartido es un reto + con quién: debería ser el
  mismo modal con un paso «¿solo o con alguien?», no dos formularios.
- **Sospecha de duplicado:** nueva nota de lectura vs nueva entrada de diario vs
  reflexión de reto — tres editores de texto libre con tipo y fuente.

### Detalle (abrir entidad)
- Detalle de tarea · de proyecto · de hábito · de reto · de libro · de registro
  médico · de nota · de cuenta.
- El detalle de tarea (Tareas y Estudio) ya comparte anatomía — ese es el
  patrón a replicar: cabecera, tira de metadatos con Editar, fechas, cuerpo,
  checklist, sub-actividades, notas, pie con recompensa.
- **Sospecha de duplicado:** detalle de tarea de Tareas vs el de Estudio.
  Verificar si son el mismo componente o dos copias.

### Confirmaciones
- Eliminar hábito · quitar área · quitar columna · borrar recompensa · abandonar
  reto · desmarcar día · registrar recaída. Todas a `ConfirmFooter` /
  `ConfirmDialog`.

### Fuera del marco común (corregir)
- Galería de widgets (`kbv-gallery`) → `KBVModal size="full"`.
- Regalar a un amigo (`kbv-gift-modal`) → `KBVModal size="md"`.

## Entregable
Una tabla por modal: nombre, dónde vive, con cuál se homologa (o por qué se
queda aparte), y qué piezas del estándar le faltan.

---

## Resultado (1 ago 2026)

| Modal | Vive en | Veredicto |
|---|---|---|
| Nuevo reto / **Nuevo reto compartido** | `personal-screens.jsx` | **Fundidos.** `CreateRetoModal` abre con el paso «¿Lo haces solo o con alguien?»; en dúo agrega amigo + HP en juego y el CTA pasa a «Proponer reto». `CreateSharedRetoModal` eliminado. |
| Detalle de tarea (Tareas vs Estudio) | `screens-v2.jsx` | **Un solo componente.** La Agenda de Estudio ya montaba `TaskDetailModal`; el duplicado muerto `AcademicTaskDetail` (estudio-escuela) se eliminó. También se quitó el `alert()` residual de `onAddNote` en Lectura. |
| Galería de widgets | `dashboard-v2.jsx` | **Migrada** de velo propio (`kbv-gallery`) a `KBVModal size="full"`. |
| Regalar a un amigo | `social-screen.jsx` | Ya usaba `KBVModal` (la fila de la auditoría estaba obsoleta). |
| Nota de lectura vs entrada de diario vs reflexión | `screens-v2` / `modals-v2` / `personal-screens` | **Se quedan separados, con anatomía alineada.** No son la misma entidad: la nota de lectura lleva tipo + cita con foto/dictado; el diario lleva mood + gratitud/aprendizaje + fecha retroactiva; la reflexión es un comentario de un campo dentro del detalle. Se alineó el diario al estándar (autoFocus, placeholder con ejemplos, primaria deshabilitada sin texto). |
| Confirmaciones | toda la app | Ya en `ConfirmFooter`/`ConfirmDialog` (iteración previa). |

