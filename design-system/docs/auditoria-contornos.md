# Auditoría de contornos de acento

> Generado del código real: `reference/kibo-extras.css`, `kibo-app.css`, `kibo-chrome.css`, `kbv-components.css`.
> **58 franjas de acento** (≥2px, color de marca o de área) en **4 patrones** de reemplazo.

## El problema

La franja de color en una sola orilla (`border-left: 3px solid var(--c)`) es el recurso más repetido
del sistema y el que lo hace ver genérico. Además es **inconsistente**: convive en 3px y 4px, en eje
lateral y superior, sin ninguna regla de cuándo va cada uno.

## La regla nueva

**Prohibido** `border-left` / `border-top` de 2px o más con color de marca o de área.
El acento se comunica por **superficie, glifo o pastilla** — nunca por una orilla.

| Pieza | Reemplazo |
|---|---|
| Tarjeta grande (≥120px de alto) | **Banda de encabezado** tintada al 11% + regla inferior al 18% |
| Pieza compacta (tarea, fila, mini-card) | **Pastilla de área** tintada dentro · borde neutro 1px |
| Barra de cronograma / bloque de horario | **Barra sólida** en color de área, tinta legible dentro |
| Nota, cita, callout | **Fondo tintado al 6%** + glifo · sin franja |


### → BANDA (24)

Banda de encabezado tintada 11% + regla inferior

| Selector | Hoy |
|---|---|
| `.kbv-account-card` | `border-top: 4px var(--c)` |
| `.kbv-credit-card` | `border-top: 4px var(--c)` |
| `.kbv-habit-mgr-card` | `border-left: 4px var(--c)` |
| `.kbv-reto-card` | `border-top: 4px var(--c)` |
| `.kbv-course-card` | `border-left: 4px var(--c)` |
| `.kbv-fin-mini-row` | `border-left: 3px var(--c)` |
| `.kbv-saving-card` | `border-top: 3px var(--c)` |
| `.kbv-account-hero` | `border-top: 4px var(--c)` |
| `.kbv-chest-card` | `border-top: 4px var(--c)` |
| `.kbv-custom-reward` | `border-top: 4px var(--c)` |
| `.kbv-fin-project-card` | `border-top: 3px var(--c)` |
| `.kbv-bench` | `border-top: 3px var(--c)` |
| `.kbv-area-bench` | `border-left: 3px var(--c)` |
| `.kbv-acervo-loc` | `border-left: 3px var(--lc, var(--kb-primary))` |
| `.kbv-shared` | `border-left: 3px var(--c)` |
| `.kbv-subject-card` | `border-left: 3px var(--c)` |
| `.kbv-area-mini` | `border-top: 3px var(--c)` |
| `.kbv-area-detail-head` | `border-left: 4px var(--c)` |
| `.kbv-area-projcard` | `border-left: 3px var(--c)` |
| `.kbv-boss` | `border-left: 4px var(--kb-boss)` |
| `.kbv-prompt` | `border-left: 3px var(--kb-primary)` |
| `.kds-demo-card.lateral` | `border-left: 4px var(--kb-primary)` |
| `.kds-demo-card.kdsb-top` | `border-top: 4px var(--kb-primary)` |
| `.kds-demo-card.kdsb-lateral` | `border-left: 4px var(--kb-primary)` |

### → PASTILLA (21)

Pastilla de área tintada dentro · borde neutro 1px

| Selector | Hoy |
|---|---|
| `.kbv-kanban-card` | `border-left: 3px var(--c)` |
| `.kbv-quest-mini` | `border-left: 3px var(--kb-boss)` |
| `.kbv-tasks-split-body .mini-card` | `border-left: 3px var(--c)` |
| `.kbv-fin-ai .ai-rec.save` | `border-left: 3px #4CAF82` |
| `.kbv-fin-ai .ai-rec.invest` | `border-left: 3px #6E8CF2` |
| `.kbv-fin-ai .ai-rec.warn` | `border-left: 3px #E64545` |
| `.kbv-fin-ai .ai-rec.budget` | `border-left: 3px #F4811F` |
| `.kbv-widget-store-item` | `border-left: 4px var(--c)` |
| `.kbv-unlock-item` | `border-top: 4px var(--c)` |
| `.kbv-related-tasks .related-task` | `border-left: 3px var(--c)` |
| `.kbv-sub-row` | `border-left: 3px var(--c)` |
| `.kbv-backlog-card` | `border-left: 3px var(--pc)` |
| `.kbv-deadlines .dl-row.urgent` | `border-left: 3px #E64545` |
| `.kbv-evals .ev-card` | `border-left: 3px var(--ec)` |
| `.kbv-recent-ach` | `border-left: 3px var(--c)` |
| `.kbv-ach` | `border-left: 3px var(--c)` |
| `.kbv-gift-modal .gm-item` | `border-left: 3px var(--c)` |
| `.kbv-salud-vitals .salud-vital` | `border-left: 3px var(--c)` |
| `.kbv-salud-records .salud-record` | `border-left: 3px var(--c)` |
| `.kbv-habit-patterns .hp-ind.reto` | `border-left: 3px var(--kb-boss, #E64545)` |
| `.kbv-area-insights .ai-card` | `border-left: 3px var(--c)` |

### → CITA (9)

Fondo tintado 6% + glifo · sin franja

| Selector | Hoy |
|---|---|
| `.kbv-note` | `border-left: 3px var(--kb-primary)` |
| `.kbv-reto-rules li` | `border-left: 3px var(--kb-boss)` |
| `.kbv-entry-detail .entry-transcripts .line` | `border-left: 3px #A855F7` |
| `.nc-saved .nc-saved-prev` | `border-left: 3px var(--c, var(--kb-primary))` |
| `.nc-detail .ncd-body.quote` | `border-left: 3px var(--c)` |
| `.kbv-note-composer .nc-staged-item` | `border-left: 3px var(--c, var(--kb-primary))` |
| `.kibo-tip .kt-card` | `border-left: 3px var(--area-wisdom, #A855F7)` |
| `.kds-callout` | `border-left: 3px var(--kb-primary)` |
| `.kds-rule` | `border-left: 3px var(--kb-primary)` |

### → BARRA (4)

Barra sólida en color de área, tinta legible dentro

| Selector | Hoy |
|---|---|
| `.kbv-timeline-grid .tl-bar` | `border-left: 3px var(--c, #9CA3AF)` |
| `.kbv-agenda-grid .ag-class` | `border-left: 3px var(--c)` |
| `.kbv-week-tl .wt-class` | `border-left: 3px var(--c)` |
| `.kbv-schedule .sch-block` | `border-left: 3px var(--bc)` |
