# Kibo · App UI kit

A high-fidelity, interactive recreation of the **gamified Kibo experience** — the RPG-of-
productivity dashboard where the brand truly lives. Built on the canonical design tokens
(`../../colors_and_type.css`): teal primary, Plus Jakarta Sans / Inter / JetBrains Mono, soft
radii, the full gamification color layer.

> **Source note.** The real `kbv-*` gamified mockup wasn't in an accessible repo; these components
> are faithful reconstructions from the DS spec's exact values (rank gradients, prestige groups,
> flame tiers, economy, areas). The auth/onboarding/marketing screens that *were* in the codebase
> live in the sibling `../web/` kit.

## Run
Open `index.html`. It's a React + Babel (in-browser) app. Icons are **Lucide** via CDN.

## Interactions
- **Sidebar nav** switches pages: Inicio · Hábitos · Retos · Proyectos · Personaje · Tienda.
- **Inicio (Dashboard):** check off today's habits (the circle fills teal, XP shows), open the
  **Nueva misión** modal (name + area chips + priority chips), see the active **boss** card, the
  **Coach Kibo** widget ("el fracaso reencauza"), area progress and a reading widget.
- **Personaje:** prestige panel (grade 7 · Comodoro Galáctico), the 9-material rank emblem grid
  (locked/unlocked), achievements grid (rarity-colored), and per-area rank rows.
- **Tienda (Vitrina):** tabbed store — Portadas (gradient backdrops), Marcos (avatar frames),
  Cofres (chests) — each with coin/gem prices and the locked "Pronto" state.
- **Proyectos:** the premium **ModuleLocked** state.

## Component map
| File | Exports | What |
|---|---|---|
| `app.css` | — | All kit component styles on top of the tokens |
| `icons.jsx` | `Icon`, `CoinIcon`, `GemIcon`, `FlameSVG` | Lucide wrapper + filled currency glyphs |
| `data.jsx` | `KB` | Mock data (user, areas, habits, boss, ranks, prestige, achievements, store) |
| `ui.jsx` | `Button`, `Bar`, `StatPill`, `Chip`, `Modal`, `Emblem` | Reusable primitives |
| `Sidebar.jsx` | `Sidebar` | Left nav + user footer |
| `Header.jsx` | `Header` | HUD: avatar + rank emblem, level, XP bar, HP, streak, coins, gems |
| `Dashboard.jsx` | `Dashboard`, `Kpi`, `HabitRow`, `AreaMini` | Inicio page |
| `Character.jsx` | `Character`, `PrestigePanel`, `AreaRankRow` | Personaje page |
| `Store.jsx` | `Store`, `Price` | Tienda / Vitrina |
| `Misc.jsx` | `Habits`, `Retos`, `ModuleLocked` | Secondary pages |
| `App.jsx` | — | Shell + router, re-hydrates Lucide each render |

## Conventions
- Components share scope via `Object.assign(window, …)` (Babel gives each script its own scope).
- Every styles object is uniquely named or inline — no global `styles` collisions.
- Stat figures use JetBrains Mono tabular numerals; labels are mono uppercase eyebrows.
- The primary button carries the Duolingo-style hard bottom border and presses down on `:active`.
