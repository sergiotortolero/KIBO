# Kibo Design System — The Recipe · v1.3

| Version | Date | What changed | Why |
|---|---|---|---|
| v1.3 | 2026-08-24 | Data visualization (§6.9) and gamification (§6.10) close the vocabulary; the system is complete. Records the two recipe findings and the new token families | The last two families the old DS covered are re-expressed in the new standard, themeable by channel. What remains is content, not system |
| v1.2 | 2026-08-24 | KIBO's mood retired as a body colour (AD-23); the domain page, the fact envelope and the action wheel joined the canvas | Sergio ruled the mood must change only the face so skins can be user-customisable, and the domain cards rebuild the kernel in the component vocabulary |
| v1.1 | 2026-08-23 | Four open questions ruled and moved to §11; the card set is rebuilt around the kernel | Sergio ruled the button face, the recoloured-área behaviour, the rarity ladder and the fate of the 71 cards. Only the name of `--kb-medal` stays open |
| v1.0 | 2026-08-23 | Initial recipe: value layer, the two colour recipes, both theme tables, the seven canonical component families, the non-negotiable rules, the platform split, and the gap between this document and `colors_and_type.css` | The canvas renders the standard but cannot be read while building. This document is what a building agent reads to produce interface in brand without re-deriving it, and without the canvas open beside it |

> **What this is.** The recipe. It is READ, to build from.
> **What the canvas is.** The specimen (`design-system/canvas/`, 11 artboards on 2 pages). It is OPENED, to compare against.
> A decision lands in both, each in its own form: as an instruction here, as a rendered example there. **When they disagree, this document is wrong until proven otherwise** — the specimen is measured, the prose is written (Constitution Art. 5).
>
> Work items, status and assignment live in the central backlog ([`BACKLOG.md`](../../../../BACKLOG.md), section "Kibo — Personal OS"), never here (Art. 13). Evidence and measurements live in [`ANALYSIS.md`](./ANALYSIS.md). Stack and dated decisions live in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
>
> Token names, class names, card names and rule ids stay in their original Spanish. So do **Divisa** and **Elemento**: they are identifiers, not prose.

---

## 0 · How to use this document

1. **Never write a raw value.** Every number and every colour in this document is a token or a declared derivation of one. If you are about to type a hex, a px radius or a duration, it is already here under a name.
2. **Compose the canonical class; do not restyle it from outside.** Each family below names one canonical form. Variants are modifiers on that form.
3. **If a value you need is not in this document, that is a defect in this document.** Record it and ask, rather than inventing it in a component.
4. **Section 8 is mandatory reading before you open `colors_and_type.css`.** The file still declares retired vocabulary. This document describes the destination.

---

## 1 · The value layer

### 1.1 Authoring format

Tokens are authored as **plain TypeScript storing inputs, not outputs** (`ARCHITECTURE.md` AD-21). A token is either a literal or a **derivation declared as data**:

```ts
'--kb-coin-ink':  { mix: '--kb-coin', amount: 0.42, with: '#3D2A00', space: 'oklab' }
'--kb-sp-7':      { min: 14, max: 16, vw: 2 }
```

Two generators consume the same source: one emits CSS custom properties for web, one emits a React Native style object. **Values only — not one line of style implementation.** The generator needs one oklab-capable colour library and a snapshot test so the two platforms cannot drift by rounding.

Consequences you must build against:

- **Web** emits the live CSS function (`color-mix(in oklab, …)`, `clamp(…)`). The browser resolves it, so a theme switch re-resolves every derivation for free.
- **React Native** emits the **resolved value**. A theme switch is a re-render against a second resolved table.
- **A fluid token resolves to its minimum on mobile.** This is not an approximation: every fluid token in the system crosses its floor above 500 px, and phones are 360–430 dp, so the minimum *is* the correct phone value. **Caveat:** a tablet or unfolded-foldable layout needs the computed value, not the floor.

### 1.2 The theme dimension

The value layer is authored **with a theme dimension from the start**. Dark theme is a **second table of values for the same token names**. No component class changes between themes; only what each name resolves to.

The binding consequence: **zero colour literals outside the token layer.** A hand-written colour cannot be re-themed. A regression grep for brand hex outside `packages/tokens` must return zero.

### 1.3 What is shared and what is not

Shared: colour, typography, measure, motion — the values.
Not shared: components. **Components are never shared between web and mobile.** The same piece is implemented twice, from one set of values, under the same names. See §7.

---

## 2 · Colour

Source of record: `design-system/colors_and_type.css`. Line citations are to that file unless stated.

### 2.1 The two recipes

Every tinted surface and every piece of text on colour in Kibo comes from exactly two recipes. There is no third, and no per-piece exception.

| Recipe | Light theme | Dark theme |
|---|---|---|
| **Lavado** (wash — a tinted background) | `color-mix(in oklab, <hue> 12%, var(--kb-canvas))` | `color-mix(in oklab, <hue> 22%, var(--kb-void-1))` |
| **Tinta** (ink — text, or a solid fill that carries white text) | `color-mix(in oklab, <hue> 54%, var(--kb-void-2))` | `color-mix(in oklab, <hue> 42%, var(--kb-text-inverse))` |

`<hue>` is any token in the palette: an area, a priority, a gamification colour, the brand. The ink anchor is **`--kb-void-2`** (`:88`), a token — never a hand-written near-black.

Measured (M-1, computed colour rasterised into a 1×1 canvas, every translucent layer composed down to the page background): in light theme the tightest ink-on-its-own-wash pair is Riqueza at **5.35:1**, and the tightest white-on-ink is Riqueza at **5.75:1**. In dark theme the tightest ink-on-wash pair is Vigor at **6.71:1**. All clear AA for normal text.

Named tokens already carry this for the frequent hues (`:200-206`, `:215-220`). Use the named token when it exists; use the recipe when it does not.

### 2.2 Palette

| Group | Tokens | Line |
|---|---|---|
| Brand | `--kb-primary` · `--kb-primary-hover` · `--kb-primary-soft` · `--kb-primary-ink` | `:66-69` |
| Surfaces | `--kb-canvas` · `--kb-surface` · `--kb-surface-2` · `--kb-card` | `:51-54` |
| Borders | `--kb-border` · `--kb-border-strong` · `--kb-border-soft` | `:56-58` |
| Text | `--kb-text` · `--kb-text-2` · `--kb-text-inverse` | `:60-63` |
| Gamification | `--kb-hp` · `--kb-xp` · `--kb-coin` · `--kb-streak` · `--kb-boss` · `--kb-media` | `:72-78` |
| Elemento (the rare currency) | `--kb-dark-core` · `--kb-dark-edge` · `--kb-dark-halo` · `--kb-dark-facet` · `--kb-dark-glint` · `--kb-void-1` · `--kb-void-2` | `:82-88` |
| Rarity (4 grades — §11) | `--kb-rarity-comun` · `--kb-rarity-raro` · `--kb-rarity-epico` · `--kb-rarity-legendario` | `:101-107` |
| Chest & emblem materials | `--kb-mat-madera` · `--kb-mat-hierro` · `--kb-mat-oro` (+ their inks) | `:109-112` |
| Support semantics | `--kb-good` · `--kb-good-soft` · `--kb-medal` · `--kb-warn` · `--kb-coin-wash` | `:114-119` |
| Ceremony sparks | `--kb-spark-*` | `:121-125` |
| Áreas de vida (5, user-recolourable) | `--area-vigor` · `--area-wisdom` · `--area-wealth` · `--area-community` · `--area-will` | `:127-132` |
| Priorities (5, fixed order) | `--pri-urgent` · `--pri-high` · `--pri-medium` · `--pri-low` · `--pri-vlow` | `:134-139` |
| Derived inks | `--kb-streak-ink` · `--kb-coin-ink` · `--kb-hp-ink` · `--kb-boss-ink` · `--kb-community-ink` | `:200-206` |
| Área inks (calibrated 54 %) | `--area-*-ink` · `--kb-primary-fill` | `:215-220` |
| Derived washes and borders | `--kb-coin-soft` · `--kb-coin-border` · `--kb-primary-border` · `--kb-community-soft` · `--kb-community-border` | `:231-237` |

### 2.3 Text: two levels, and how the secondary is produced

There are **two** text levels. The secondary is a **derivation of the primary**, not a loose grey:

```
--kb-text    →  the datum and the action
--kb-text-2  →  color-mix(in oklab, var(--kb-text) 64%, var(--kb-canvas))
```

64 % is the calibrated percentage: measured **5.89:1 on `--kb-canvas`, 5.55:1 on `--kb-surface`, 5.20:1 on `--kb-surface-2`**. A fixed grey passes on white and fails on `--kb-surface-2`, which is where disabled controls, empty states and inset chips live.

**`--kb-text-3` does not exist in the standard.** It is still declared at `:62` — see §8.

### 2.4 The two currencies

| Name | What it is | Token |
|---|---|---|
| **Divisa** | The everyday currency. Earned by doing, spent daily | `--kb-coin` (`:74`) |
| **Elemento** | The rare currency. Earned by achieving, buys what lasts | `--kb-dark-*` (`:82-86`) |

**The name is the unit; the skin is the look.** *Materia oscura*, *Magia*, *Esencia* and *Núcleo* are skins of an **Elemento** — they are not separate currencies and never name a balance in the interface. The words *gema*, *materia oscura* and *fragmentos* are retired as balance names.

Rendering rule: **Elemento is never flat on a dark background.** What separates it is its halo (`--kb-dark-halo` at low alpha as an outer ring), not its fill.

### 2.5 Dark theme — the second table

The same token names, re-valued. Every dark value is a derivation of a token; none is hand-written.

| Token | Dark value |
|---|---|
| `--kb-canvas` | `var(--kb-void-2)` |
| `--kb-surface` | `color-mix(in oklab, var(--kb-void-2) 35%, var(--kb-void-1))` |
| `--kb-card` | `color-mix(in oklab, var(--kb-void-1) 94%, var(--kb-text-inverse))` |
| `--kb-surface-2` | `color-mix(in oklab, var(--kb-void-1) 78%, var(--kb-text-inverse))` |
| `--kb-border` | `color-mix(in oklab, var(--kb-void-1) 58%, var(--kb-text-inverse))` |
| `--kb-border-strong` | `color-mix(in oklab, var(--kb-void-1) 44%, var(--kb-text-inverse))` |
| `--kb-border-soft` | `color-mix(in oklab, var(--kb-void-1) 72%, var(--kb-text-inverse))` |
| `--kb-text` | `var(--kb-text-inverse)` |
| `--kb-text-2` | `color-mix(in oklab, var(--kb-text-inverse) 74%, var(--kb-void-1))` |
| `--kb-primary` | `color-mix(in oklab, var(--kb-primary) 66%, var(--kb-text-inverse))` |
| `--kb-primary-hover` | `color-mix(in oklab, var(--kb-primary) 80%, var(--kb-text-inverse))` |
| `--kb-primary-soft` | `color-mix(in oklab, var(--kb-primary) 22%, var(--kb-void-1))` |
| `--kb-primary-ink` | `color-mix(in oklab, var(--kb-primary) 42%, var(--kb-text-inverse))` |

**The hues do not change value between themes.** Brand, gamification, áreas and priorities are the same numbers in both tables. What changes is surfaces, text, and the two recipes (§2.1).

Measured in dark: white on `--kb-card` **12.62:1**, `--kb-primary-ink` on `--kb-card` **9.56:1**, `--kb-border` against `--kb-card` **2.98:1**.

**Authoring note (web).** A theme block cannot derive a token from itself — `--kb-primary: color-mix(…, var(--kb-primary), …)` is a self-reference and therefore a cycle, invalid at computed-value time even across inheritance. Derive on an ancestor under a different name, assign on the descendant. Under AD-21 the generator does this for you; hand-written CSS must not shortcut it.

### 2.6 Two ink tokens that do not work — what to use instead

These are live defects, recorded as evidence in `ANALYSIS.md` findings 24 and 25. Here they are an instruction.

**`--kb-ink-on-tint` (`:228`) — do not use.** The recipe is declared on `:root`, so its `var(--c)` is substituted *there*, where `--c` does not exist, and descendants inherit the already-resolved value. Measured with Riqueza's `--c`, with HP's, and with none: **always the teal fallback**. It paints teal over every tint.
→ **Use the per-token ink** (`--kb-coin-ink` `:201`, `--kb-hp-ink` `:202`, `--area-*-ink` `:215-219`), or write the 54 % mix **directly in the element's own property**, where `--c` does resolve.

**`--kb-good-ink` (`:205`) — do not use for text.** It is the only ink mixed at 88 %; the rest of the family sits between 42 % and 74 %. Measured **3.23:1 on white** — fails AA.
→ **A positive delta uses `--kb-primary-ink`; a negative delta uses `--kb-hp-ink`.** Teal is progress; there is no separate "good" ink in the standard.

---

## 3 · Typography

### 3.1 Two families

| Role | Token | Family | Line |
|---|---|---|---|
| Display, numerals, labels | `--kb-f-display`, `--kb-f-label` | Plus Jakarta Sans | `:19`, `:23` |
| Body and metadata | `--kb-f-body` | Inter | `:20` |

There is no third family. `--kb-f-mono` (`:25`) is a back-compat alias of `--kb-f-label`; do not introduce it in new code.

### 3.2 Scale — nine steps

`:31-39`. **A size that is not on the scale does not exist.** 14 px and 16 px are **not** added.

| Token | px | Where it goes |
|---|---|---|
| `--kb-fs-2xs` | 10 | Cejilla and contador — **hard legibility floor** |
| `--kb-fs-xs` | 11 | Etiqueta and metadata |
| `--kb-fs-sm` | 12 | Secondary metadata, help text |
| `--kb-fs-md` | 13 | Base interface text |
| `--kb-fs-lg` | 15 | Highlighted row, field value |
| `--kb-fs-xl` | 18 | Card heading |
| `--kb-fs-2xl` | 22 | Section title |
| `--kb-fs-3xl` | 26 | Screen title, KPI figure |
| `--kb-fs-4xl` | 34 | Display, hero figure |

### 3.3 Fluid steps

`:41-44`. **A heading is never written at a fixed size**; the fluid step is what gets declared.

`--kb-fs-4xl-fluid` `clamp(26, 5vw, 34)` · `--kb-fs-3xl-fluid` `clamp(22, 4vw, 26)` · `--kb-fs-2xl-fluid` `clamp(20, 3vw, 22)` · `--kb-fs-xl-fluid` `clamp(16, 2.4vw, 18)`.

On mobile each resolves to its minimum (§1.1).

### 3.4 Line height

`:46-48`. `--kb-lh-tight` 1.15 (display, screen titles) · `--kb-lh-snug` 1.3 (card headings, metadata) · `--kb-lh-body` 1.55 (running text).

### 3.5 Roles

Each level is a class, never a loose size-and-weight pairing. `:247-314`.

| Class | Family | Weight | Size | Line height |
|---|---|---|---|---|
| `.kbv-h1` | display | 800 | `--kb-fs-4xl-fluid` | tight, `-.02em` |
| `.kbv-h2` | display | 700 | `--kb-fs-3xl-fluid` | tight, `-.015em` |
| `.kbv-h3` | display | 700 | `--kb-fs-2xl-fluid` | snug, `-.01em` |
| `.kbv-h4` | display | 600 | `--kb-fs-xl` | snug |
| `.kbv-body` | body | 400 | `--kb-fs-md` | body |
| `.kbv-meta` | body | 400 | `--kb-fs-sm` | snug, `--kb-text-2` |
| `.kbv-num` | display | 700 | inherited | tabular numerals, `-.01em` |
| `.kbv-eyebrow` | label | 800 | `--kb-fs-xs` | uppercase, tracking `.09em` |

**The cejilla is uppercase**, 11 px, weight 800, tracking `.09em`, in Plus Jakarta. A code literal is never uppercased.

---

## 4 · Measure and motion

### 4.1 Spacing — 2 px grid

`:157-166`. Nine steps. `--kb-sp-1` 2 · `-2` 4 · `-3` 6 · `-4` 8 · `-5` 10 · `-6` 12 · `-7` `clamp(14,2vw,16)` · `-8` `clamp(18,3vw,20)` · `-9` `clamp(20,4vw,24)`.

Conventions worth knowing without looking: `--kb-sp-4` is a glyph and its label · `--kb-sp-6` is the default density · `--kb-sp-9` is the gap between blocks.

### 4.2 Radius — the radius grows with the box

`:141-147`. Six values, and the assignment is fixed:

| Token | px | What takes it |
|---|---|---|
| `--kb-r-xs` | 8 | Casilla, swatch, glyph tile |
| `--kb-r-sm` | 10 | Interior piece, `sm` control |
| `--kb-r-md` | 14 | Botón and campo (`md`) |
| `--kb-r-lg` | 18 | Tarjeta, KPI, `lg` control |
| `--kb-r-xl` | 24 | Modal and hoja |
| `--kb-r-pill` | 999 | Chip, etiqueta, contador, barra |

**12 px and 16 px are retired.** A radius outside these six does not exist.

### 4.3 Elevation

`:149-153`. `--kb-sh-1` card at rest · `--kb-sh-2` card lifted · `--kb-sh-3` menu and popover · `--kb-sh-pop` modal and sheet.

Outside the scale: **`--kb-elev-hard`** (`:155`, `0 2px 0`) — the hard lip of a solid button. It is brand drawing, not elevation, and it never substitutes for a scale step.

### 4.4 Control height

`:187-192`. Three sizes and one floor:

| Size | Height | Radius | Label size | Where |
|---|---|---|---|---|
| `sm` | 36 px | `--kb-r-sm` | `--kb-fs-md` | Toolbar, dense row |
| `md` (default) | `--kb-ctl-h` = 46 px | `--kb-r-md` | `--kb-fs-lg` | Every capture and action control |
| `lg` | 54 px | `--kb-r-lg` | `--kb-fs-xl` | The single action of a screen |

`--kb-touch-min` = 44 px (`:192`) is a **floor, not a size**. A control drawn below it reaches it with a transparent, centred touch zone — never by changing its drawing.

### 4.5 Focus

One ring for every focusable piece: **`--kb-focus-halo`** (`:28`) — a diffuse brand ring at **10 %**, 3 px. Declared on `:focus-visible`. It **adds to** the lip and never replaces the border. A component whose border lives in `box-shadow` must move it to `border`, or focus will erase it.

### 4.6 Motion

`:178-185`. `--kb-dur-fast` 120 ms (colour, opacity, press) · `--kb-dur-base` 200 ms (a piece entering or leaving) · `--kb-dur-slow` 300 ms (panel, drawer, modal) · `--kb-dur-slower` 400 ms (celebration and reward).
Curves: `--kb-ease-standard` (in and out) · `--kb-ease-out` (appears) · `--kb-ease-in` (leaves).

Animation names follow `dominio/objeto/acción` — `kibo/idle/flotar`, `ui/card/entrar`.

**`prefers-reduced-motion` turns off interface motion and keeps KIBO.** The mascot is content, not a transition. (`:316-318` currently implements the inverse — see §8.)

### 4.7 Stacking

`:168-176`. Eight named levels: base 1 · raised 10 · sticky 30 · dropdown 50 · overlay 100 · modal 200 · popover 400 · toast 600. **No loose `z-index`.** A piece that needs to stack takes one of these eight.

---

## 5 · Non-negotiable rules

**R-1 · An edge colour stripe is forbidden.** `border-left: 3px solid var(--c)` does not exist in Kibo. An área's colour enters through exactly one of four approved patterns, chosen by the size of the piece:

| Pattern | When | How |
|---|---|---|
| **Banda de encabezado** | Large card, 120 px tall and up | A full-width strip: wash background, 2 px bottom border at 32 % of the hue, glyph + label in the ink |
| **Pastilla de área** | Compact piece | A 22 px pill: wash background, ink text, self-aligned to the start |
| **Barra sólida** | Timeline block | The **ink** as the fill, with white text on it — never the plain hue |
| **Fondo tintado con glifo** | Note, quote or notice | Wash background, `--kb-text` for the body, ink for the glyph. **Never without a glyph:** colour alone is not a message |

When área and prioridad compete: **el área pinta, la prioridad marca.**

**R-13 · Small text on colour goes in the ink, never the plain hue.** White on a colour fill is permitted only at the WCAG large-text threshold, **18.66 px bold or 24 px**. Anything below that threshold takes the ink. A counter is a figure, therefore text: the 4.5:1 floor applies to it, which is why its fill is the ink and not the hue.

**R-14 · On a tinted surface, all text takes `--kb-text`.** The secondary neutral falls below AA over a wash. Hierarchy on tinted ground is carried by size and weight, not by colour.

**The 10 px floor.** `--kb-fs-2xs` is the smallest text in the system. Nothing renders below it.

**The 44 px touch floor.** §4.4. Reached with a transparent touch zone, not by growing the drawing.

**Focus at 10 %.** §4.5. One ring, on every focusable piece, in both platforms.

**`prefers-reduced-motion` keeps KIBO and drops the rest.** §4.6.

**Zero colour literals outside the token layer.** Non-negotiable (`ARCHITECTURE.md` AD-15). A hand-written colour cannot be re-themed.

---

## 6 · Component families

Each family names **one canonical form**, its modifiers, and **what it absorbs**. The absorbed lists come from `ANALYSIS.md` §6, which holds the full enumeration and the per-family effort.

**Retirement criterion** (`ARCHITECTURE.md` AD-17): *if it is not used in the version of the app, it does not serve or add anything.* Usage in the v1 scope is the only test a class has to pass. Retirements are presented **grouped by family**, never piece by piece — every retirement is a product decision.

### 6.1 Botón — `.kbv-btn`

Base `kbv-components.css:185-205`.

The button family is already the proven pattern in this codebase: base plus modifiers, 662 uses, 89 % concentrated in six classes. It is the shape every other family is being consolidated toward.

**Base.** `--kb-f-display` 700, `line-height: 1`, `border: 1.5px solid transparent`, `display: inline-flex`, gap `--kb-sp-4`, height `--kb-ctl-h`, padding `0 --kb-sp-8`, size `--kb-fs-lg`, radius `--kb-r-md`.

**Sizes.** `sm` 36 / `--kb-sp-6` / `--kb-fs-md` / `--kb-r-sm` · default 46 / `--kb-sp-8` / `--kb-fs-lg` / `--kb-r-md` · `lg` 54 / `--kb-sp-9` / `--kb-fs-xl` / `--kb-r-lg`.

**Five variants.**

| Variant | Class | Face | Text | Lip / border | Line |
|---|---|---|---|---|---|
| Primario | `.kbv-btn-primary` | ink of `--kb-primary` (54 %) | `--kb-text-inverse` | `--kb-elev-hard` at 30 % of the hue + `--kb-sh-1` | `:207-213` |
| Secundario | `.kbv-btn-secondary` | `--kb-card` | `--kb-text` | `border-color: --kb-border-strong` + `--kb-sh-1` | `:226-231` |
| Fantasma | `.kbv-btn-ghost` | transparent | `--kb-primary-ink` | none | `:215-224` |
| Peligro | `.kbv-btn-danger` | ink of `--kb-hp` (54 %) | `--kb-text-inverse` | as primario, with `--kb-hp` | `:245-249` |
| Enlace | `.kbv-btn-link` | transparent | `--kb-primary-ink` | none; `height: auto`, `--kb-fs-md`, underline offset 3 | `:233-243` |

**The solid face is the ink of its role.** `color-mix(in oklab, <hue> 54%, var(--kb-void-2))` — the same 54 % that produces every ink in the system, and the percentage the token layer already declares as the one that accepts white text on top. The lip is the same hue at 30 %. Hover lifts the face toward the plain hue at 78 %. Measured: white on the teal face **7.7:1**, on the HP face **8.96:1**.

**Six states, in every variant.** reposo · hover · foco (`--kb-focus-halo`) · **presionado** (`translateY(2px)`, the lip collapses — the gesture is the height it loses) · **deshabilitado** (`--kb-surface-2` background, `--kb-text-2` text, no lip, no shadow — **not opacity**) · **cargando** (label goes transparent, a 16 px spinner in the variant's own colour, **the button keeps the label's width**).

**Grouping.** Ghost on the left, secondary then primary on the right, gap `--kb-sp-4`. **A destructive action is never adjacent to the primary.** Only one primario per view. An icon-only button is square at its size's height and always carries an accessible label.

**Absorbs.** The divergent hand-written button in `preview/buttons.html:3-19` (8 properties out of line) and the dead `size` prop in `components/KbButton.jsx:2` that composed a non-existent `.kbv-btn-sm`.

### 6.2 Campo — `.kbv-field`

`kbv-components.css:254-258` (field) · `:259-264` (label) · `:265-287` (input) · `:289-300` (row with glyph) · `:302-310` (error).

**Anatomy.** Label on top → control → help below. Column, gap `--kb-sp-3`.

- **`.kbv-label`** — `--kb-f-body` 600, `--kb-fs-md`, `--kb-text`. **The label is always present.** Placeholder text is an example, never the label.
- **`.kbv-input`** — height `--kb-ctl-h`, `--kb-card` background, `1.5px solid --kb-border`, radius `--kb-r-md`, padding `0 --kb-sp-7`, `500 --kb-fs-lg` body.
- **`.kbv-help`** — `--kb-fs-sm`, `--kb-text-2`.
- **`.kbv-error`** — `--kb-fs-sm` 600 in **`--kb-hp-ink`**, with a glyph, gap `--kb-sp-3`. It **replaces** the help line, never adds to it, and says how to fix the value.

**Five states.** reposo · foco (`border-color: --kb-primary` + `--kb-focus-halo`) · con valor · error (`border-color: --kb-hp` + the same 10 % ring recipe with `--kb-hp`) · deshabilitado (`--kb-surface-2`, `--kb-text-2`).

**Optional is marked; required is not.** In a Kibo form nearly everything is required, so the exception is what gets labelled. No asterisks.

**Types.** Leading glyph (`padding-left: 42px`) · trailing glyph (`padding-right: 42px`) · select (trailing chevron) · textarea (`min-height: 108px`, padding `--kb-sp-6 --kb-sp-7`, `--kb-lh-body`, weight 400).

**Choice controls.** Casilla and opción are **22 px**, radius `--kb-r-xs` / `--kb-r-pill`, `1.5px --kb-border-strong`, and fill with the **ink of `--kb-primary`**. Conmutador is 46 × 26, `--kb-r-pill`, 20 px knob with `--kb-sh-1`. The touch zone reaches 44 px through the label, which also activates.

**In a row.** Two columns maximum on desktop, one on mobile, gap `--kb-sp-6`. Fields in a row share height and baseline.

**Absorbs.** The 42 px control height published in `preview/formulario-campos.html:19`, and the four cards publishing the retired ink recipe (`preview/tareas-atomos.html:24`, `preview/tareas-moleculas.html:18`, `preview/formulario-campos.html:37`, `preview/formulario-estados.html:37`). Six form controls exist in code and are undocumented; they inherit this anatomy.

### 6.3 Chip, etiqueta y contador — three pieces, not variants

**The criterion, in order.** Touchable and stateful → **chip**. A closed scale, a figure or a state → **contador**. Otherwise it only classifies → **etiqueta**.

**`.kbv-chip`** (`kbv-components.css:639-655`) — height **36 px**, radius `--kb-r-pill`, `1.5px --kb-border`, padding `0 --kb-sp-6`, `--kb-fs-md` weight 600, `--kb-text-2`. **Draws 36, touches 44** via a transparent centred `::after`. Active (`:651-655`): `border-color --kb-primary`, `--kb-primary-soft` background, `--kb-primary-ink` text. Optional 8 px leading dot.

**`.kbv-tag`** (`:1569-1577`) — height **22 px**, radius `--kb-r-pill`, padding `0 --kb-sp-4`, `--kb-fs-xs` weight 700, tracking `.02em`. Three forms: neutral (`--kb-surface-2` / `--kb-text`), **tintada** (wash background + ink text), **sólida** (ink background + `--kb-text-inverse`).

**`.kbv-badge`** — min-width 20, height 20, radius `--kb-r-pill`, padding `0 --kb-sp-3`, `--kb-f-display` 700 `--kb-fs-2xs`, tabular. Fill is **always the ink** of its role (R-13), text `--kb-text-inverse`. `quiet` = `--kb-surface-2` / `--kb-text`. `dot` = 10 × 10, no content. **Cap at three characters: past that it is `99+`.**

**Stay separate — do not fold in.** `kbv-stat-pill` (a counter of a live resource, belongs to the header) · `kbv-tag-input` and `vt-tag-input` (they are fields and inherit §6.2) · pastilla de área (it is R-1's compact pattern; it looks like a tinted etiqueta but its job is to paint the área).

**Absorbs.** ~74 classes across 140 uses, averaging 1.9 uses each — interactive (`qa-chip`, `am-chip`, `bl-chip`, `format-chip`, `ssb-chip` + 10 more), static (`am-pill`, `subj-tag`, `area-chip`, `pc-tag` + 39 more) and badges (`done-badge`, `reg-marked-badge` + 11 more). Full enumeration in `ANALYSIS.md` §6. **32 of them carry their own tint under three different variable names (`--c` / `--p` / `--tc`); each must be preserved through the migration.** This is the one family that cannot be automated — every use needs eyes on it.

### 6.4 Barra de progreso — `.kbv-progress`

`kbv-components.css:2272-2283` (+ `.kbv-progress-meta` `:2284`).

**Anatomy.** A track and a fill. Both `--kb-r-pill`, including at 100 %.
**Track** = the **wash of its role**, with an inner outline at 24 % of the hue.
**Fill** = the plain hue.
Fill transition: `width --kb-dur-slow --kb-ease-out`.

**Four heights.** `xs` 4 (inside a dense row) · `sm` 6 (compact card) · `md` 8 (default) · `lg` 12 (protagonist of the view).

**Five roles**, declared with a `tone-*` class that sets `--c`: `tone-hp` · `tone-xp` · `tone-goal` · `tone-streak` · `tone-progress` (neutral, `--kb-text-2`).

**The bar never stands alone.** It always carries its figure, in the **ink of its role**, `--kb-f-display` 700 tabular at `--kb-fs-sm`. The figure carries the datum; the bar is the gesture. Inside a dense row the bar drops to `xs` and loses the figure — there the row carries it.

**Por tramos.** When progress is countable, the same piece becomes segments: `flex: 1` each, gap `--kb-sp-2`, done segments filled with the hue. **Up to seven segments; from eight on it goes back to a continuous bar.**

**Absorbs.** 109 classes, 181 uses, 89 active and 20 orphan — every `*-track` / `*-fill` / `*-bar` variant across HP, XP, goal, streak, study, áreas, reading and achievements. Full list in `ANALYSIS.md` §6. **What changes on screen:** height moves by ≤1 px and is invisible except HP. **27 inline `style={{height}}` call sites become a modifier** — that is what stops the family growing back. Also absorbs the header bar `:1006-1044`, the hero XP track `:1104-1118`, the boss mini-HP `:1209-1231` and the step indicator `:549-573`.

Two retired-green literals are live in the XP bars at `kbv-components.css:1116` and `:1599`; they go with this migration.

### 6.5 Tarjeta — `.kbv-card`

`kbv-components.css:1243-1249` · head `:1250-1255` · body `:1256-1259`.

**Base.** `--kb-card` background, `1px solid --kb-border`, radius **`--kb-r-lg`**, `--kb-sh-1`, column, gap `--kb-sp-5`, `overflow: hidden`.

**Three densities.** `compact` `--kb-sp-6` · default `--kb-sp-7` · `roomy` `--kb-sp-8`.
Plus **`flush`** (padding 0, gap 0) — a **utility, not a density**. It exists so content can reach the edge: a band, an image, a list. It is not for tightening text.

**Anatomy.** `.kbv-card-head` (space-between, gap `--kb-sp-5`) → body → `.kbv-card-foot` (space-between, `padding-top --kb-sp-5`, `border-top 1px --kb-border-soft`). **The foot exists only when there is an action.**
Title: `--kb-f-display` 600 `--kb-fs-xl`, `--kb-lh-snug`. Sub: `--kb-fs-sm` `--kb-text-2`.

**Interactive.** Hover: `translateY(-1px)` and one elevation step up (`--kb-sh-2`). Focus: `--kb-sh-1` + `--kb-focus-halo`, `border-color --kb-primary`. **If the whole card is the target, there is no second destination inside it.**
**Empty.** `--kb-surface-2` background, dashed border, no shadow, `--kb-text-2` title.

**Accent.** R-1 (§5) is applied on this family. The two survivors of the edge stripe are `kbv-components.css:1160` (`.kbv-boss`) and `:2189` (`.kbv-prompt`).

**Absorbs.** Four redundant bases across 281 uses: `.kbv-card` (81) · `.kbv-char-card` (74, which adds only `padding: 18px 22px`) · `.kbv-fin-card` (35, gap 12) · `.kbv-side-card` (14, gap 14 — a 2 px difference). Plus **53 classes carrying R-1 stripes**. **The card unification and the R-1 migration are one move**: they touch the same 53 selectors, and done separately it is double work. On screen, padding moves inward by 4 px on 74 cards — visible side by side, imperceptible in use.

### 6.6 KPI — `.kbv-kpi`

`reference/styles-extras.css:783-793` · grid `:778-782` · label `:801-808` · value `:809-821` · delta `:822-827` · glyph `:2811-2820`.

**The paper enters through a banda de encabezado, not an edge stripe.** The 3 px `::before` rule at `:794-800` is retired: a KPI obeys R-1 like every other card.

**Anatomy — four parts, only the figure is mandatory.**
1. **Banda** — padding `--kb-sp-4 --kb-sp-6`, wash background, 2 px bottom border at 32 % of the hue, text in the ink, `--kb-f-label` 800 `--kb-fs-2xs` uppercase tracking `.09em`, with a 12 px glyph.
2. **Cifra** — `--kb-f-display` 800 **`--kb-fs-3xl`**, `line-height: 1`, `-.02em`, **tabular**. Its unit is `--kb-fs-lg` weight 600 in `--kb-text-2`: **the unit does not compete with the number.**
3. **Comparativa** — `--kb-fs-sm`. Up: `--kb-primary-ink` 700. Down: `--kb-hp-ink` 700. Flat: `--kb-text-2`. **Always with a direction glyph** — colour alone does not state the sense.
4. **Acompañante** — a bar, a reference, or nothing. **Never two at once.**

**Card shell.** `--kb-card`, `1px --kb-border`, radius `--kb-r-lg`, `--kb-sh-1`, `overflow: hidden`. Body padding `--kb-sp-6`, gap `--kb-sp-3`.
**Grid.** `.kbv-kpi-grid` — four columns, gap `--kb-sp-6`; two on tablet, one on phone. Column modifiers `cols-4` · `cols-5` · `cols-6`.
**Empty.** An em dash occupies the figure's place, in `--kb-text-2`.

**Absorbs.** 190 uses across ~28 variant names — `kbv-gallery-kpi`, `kbv-reto-kpis`, `note-kpi-strip`, `bc-kpi`, `stat-block`, `fc-stat`, `sbd-stat`, `hs-metric`, `ap-metric`, `sem-stats` and the rest (`ANALYSIS.md` §6). 84 already use the canonical form. **14 of 17 grid mounts override the column count by hand and 8 rewrite the same value** — the modifiers exist to restore trust in the default. Stay separate: `kbv-stat-pill` (counter), `kbv-kpi-icon` (anatomy), `kbv-kpi-anim-stack` (variant).

**Open design work:** the four data states — loading, error, empty, no-permission — need an anatomy each. They become urgent the moment a backend exists.

### 6.7 Modal — `KBVModal` / `.kbv-modal-*`

`reference/styles-extras.css:366-449` · widths `:395` and `:9722-9723` · mobile sheet `reference/kibo-shell.css:442-455`.

**Shell.** Veil → card → head → body → foot. **Only the body scrolls.**

- **`.kbv-modal-veil`** — `color-mix(in srgb, var(--kb-text) 55%, transparent)`, `backdrop-filter: blur(2px)`, `--kb-z-modal`, centred, padding `--kb-sp-9`.
- **`.kbv-modal-card`** — `--kb-card`, radius **`--kb-r-xl`**, `--kb-sh-pop`, column, `overflow: hidden`.
- **`.kbv-modal-head`** — padding `--kb-sp-8 --kb-sp-9 --kb-sp-7`, `border-bottom 1px --kb-border-soft`. Title `--kb-f-display` 800 **`--kb-fs-2xl`**; sub `--kb-fs-md` `--kb-text-2`, max 46ch.
- **`.kbv-modal-close`** — **44 × 44** (`--kb-touch-min`), `--kb-r-pill`, `1.5px --kb-border`.
- **`.kbv-modal-body`** — padding `--kb-sp-8 --kb-sp-9`, gap `--kb-sp-7`, `overflow-y: auto`.
- **`.kbv-modal-foot`** — padding `--kb-sp-7 --kb-sp-9`, `--kb-surface` background, `border-top 1px --kb-border-soft`, ghost left, actions right with gap `--kb-sp-4`.

**Four widths — the width is decided by the content, not by importance.**

| Modifier | Max width | For |
|---|---|---|
| `sm` | 420 | Confirmation and notice: one paragraph, two buttons |
| default | 580 | A form of up to six fields |
| `lg` | 720 | Two-column form, or list with detail |
| `full` | 1040 | Table, import, gallery — a screen inside the screen |

**If the content does not fit, the body scrolls — never the width.**

**Behaviour.** Closes on Escape, on the veil, and on the button. Focus is trapped inside while open. **A confirmation has no close button** — it forces a choice; its title states what is lost and the button's verb repeats the action.

**Mobile.** All four widths become the same bottom sheet: veil aligned to the end, full width, radius only on top, a 36 × 4 grab handle, and the primary in the foot at full width.

**Absorbs.** 36 of 36 mounts already use the canonical component. To integrate: `KibPopup` (`mascot.jsx:46`), the custom veils `kbb-chat-veil` (`kibo-quick.jsx:503`), `cc-veil` (`tienda-screen.jsx:400`) and `vt-scrim` (`vitrina.jsx:182`), and two screens writing markup by hand (`personalizacion.jsx:154`, `:249`) which gain Escape, click-outside and focus management. **25 call sites override the default width to `lg` by hand**; the width table above is what removes them.

### 6.8 Families consolidated elsewhere

These are settled in `ANALYSIS.md` §6 and are not re-specified here; build against the canonical form named there: **section head** (`SectionHead`, `kbv-shared.jsx:138` → `.kbv-section-head`, `styles-extras.css:9606`; `.kbv-page-head` is a different hierarchy level and stays separate) · **toolbar** (`.kbv-filter-bar`, `styles-extras.css:589`) · **stage** (`.kbv-stage` + height modifiers) · **empty state** (`EmptyState`, `kbv-shared.jsx` — icon · title · description · CTA) · **tabs / segmented** (`.kbv-seg`, `styles-extras.css:9811`, unifying the eight tab-strip names in `kibo-shell.css:465-492`; **six real tab strips are missing from the responsive selector and do not scroll on phone**).

### 6.9 · Data visualization

The chart language is measured from the prototype, not chosen: **viewBox 520 wide**, `padL 40 · padR 16 · padT 16 · padB 26`, horizontal grid at 0 / 0.5 / 1 dotted `3 4` at 60 %, **2.4 px** stroke with round caps, area fill a vertical gradient of the hue `.26 → 0` (`charts-catalogo.jsx:5-24`, `charts-nuevas.jsx:7-30`, `progress-charts.jsx:83-125`; axis `kibo-charts.css:36`).

**Ten canonical types**, consolidated from the prototype's 25, with one shared empty state: tendencia (`progress-charts.jsx:81-142`) · comparación (`:258-276`) · ranking (`charts-nuevas.jsx:199-226`) · distribución (`charts-catalogo.jsx:279-335`) · composición (`charts-nuevas.jsx:107-171`) · relación (`charts-nuevas.jsx:75-105`) · constancia / heatmap (`progress-charts.jsx:153-226` + `kibo-charts.css:20-56`) · meta (`charts-nuevas.jsx:173-197`) · radar (`charts-nuevas.jsx:32-73`). The progress bar (§6.4) and KPI (§6.6) are the eleventh and twelfth; not repeated here.

**New token ramps — charts stop borrowing area/priority hues** (that borrowing is what breaks when the user recolours an área):
- `--kb-cat-1..8` — the **categorical** ramp, a CVD-safe qualitative palette. The first pair is blue/orange so a two-series comparison is the most robust case. **Eight is a hard cap**: the set holds a minimum ΔE of 8.6 under normal vision plus the three colour-blindness simulations; beyond eight series the standard requires direct labelling, not a ninth colour.
- `--kb-seq-1..5` — the **sequential** ramp, one hue light→dark, for heatmaps and intensity.
- `--kb-div-neg-2 · -neg-1 · -mid · -pos-1 · -pos-2` — the **divergent** ramp, two hues around a neutral midpoint, for over/under budget and mood valence.

**Hard semantic anchor:** `--kb-gain` = `--kb-good`, `--kb-loss` = `--kb-hp`; they never cross, and the sign travels **also by position and a direction glyph**, never by colour alone.

**Channel:** all colour, so **token** — the whole family is themeable, subject to F-2 (categorical distinguishability under CVD) and the gain/loss anchor (F-3, `ARCHITECTURE.md` §9.1).

### 6.10 · Gamification

The recurring **visual pieces**, never the catalogue (which ranks, which achievements, the prices = content).

- **Emblema** — the rank shield by material. `--kb-mat-1..9` is an **ordinal ladder** (the token is the *tier*; the material name is content); madera/hierro/oro map to tiers 1–3. Its ink is **anchored by luminance** (mixed 20 % toward black or white), **not** the single 54 % ink recipe — a ladder that runs from light gold to dark obsidian has no single ink direction. `KbEmblem.jsx:2-16`, `prestige-system.jsx:52-60,311`.
- **Rareza** — **four grades**: común · raro · épico · legendario. `--kb-rarity-*` re-declared clean, no gem-blue alias. **Visibility is a separate, orthogonal axis** (visible · secreto · oculto) — *secreto* and *oculto* were never rarities. `achievements.jsx:8-15,49-52`.
- **Llama** — its own ramp `--kb-flame-1..9` (it stops borrowing streak/hp/coin), with a dark outline to edge the warm tones. Warmth is expressive, so **themeable**. `streak-system.jsx:5-15,30-64`.
- **Divisa** — the pill and glyph of **Divisa** (`--kb-coin`) and **Elemento** (`--kb-dark-*`). Elemento is never a flat fill; its **halo** separates it. `streak-system.jsx:189-222`, `KbStatPill.jsx`.
- **Tarjeta de logro** — states (ganado · en progreso · bloqueado) with the four rarities; and the **milestone line** for levels and prestige (a form, not a catalogue). `achievements.jsx:68-131`, `prestige-system.jsx:16-51`.

**Channel per piece:** the *colour / material / rarity* as value is **token** (themeable); the *artwork* — the shield die, the faceted Elemento glyph, the frame ornament — is **asset** (the wardrobe channel, AD-16/22). Each piece states which.

---

## 7 · The platform split

Values are shared. Implementations are not. **Components are never shared between web and mobile.**

| | Web | Android (Expo / React Native) |
|---|---|---|
| Consumption | CSS custom properties on `:root`; the theme is a second table on the theme attribute | A generated style object; the theme is a second resolved table |
| Components | `.kbv-*` classes, **composed, never restyled from outside** | The same piece names and the same modifier names, implemented natively |
| Fluid steps | The live `clamp()` | **Resolved to the minimum** (§1.1). A tablet or unfolded foldable needs the computed value, not the floor |
| Breakpoints | 640 · 768 · 1024 · 1280 | Resolved by width class, not by `vw` |
| Elevation | `box-shadow`, four levels | Platform elevation, mapped **level to level**: 1, 2, 3, pop. They are not the same unit |
| Focus | `:focus-visible` with the 10 % ring | Focus state and touch indication with the same 10 % ring |
| Touch floor | 44 px reached with a transparent `::after` | 44 dp reached by the container itself |
| Third-party UI | **None.** shadcn and Radix are retired; the system is implemented by hand | **None.** No unwrapped platform component — the skin is always Kibo's |

**Naming.** The same token is called the same thing on both platforms; only the syntax differs.

| System value | Web | Android |
|---|---|---|
| `primary` | `--kb-primary` | `KbColor.primary` |
| `sp-6` | `--kb-sp-6` | `KbSpace.sp6` |
| `r-lg` | `--kb-r-lg` | `KbRadius.lg` |

Renaming a token is a change to the system, not to one implementation.

**A value that exists on only one platform is not a token of the system.**

Retiring Radix removes what today provides keyboard navigation, screen-reader semantics and modal focus-trapping. How that is replaced is open — `ARCHITECTURE.md` §13, Q3.

---

## 8 · What does not match yet

This document describes the destination. `colors_and_type.css` and `kbv-components.css` still declare part of the old vocabulary. **Do not read the file and assume it is the standard.** These are the known divergences; they are closed during the standardisation of the 71 cards, not here.

| Where | The file still says | The standard says |
|---|---|---|
| `colors_and_type.css:62` | `--kb-text-3` is declared and equals `--kb-text-2` | Two text levels. `--kb-text-3` does not exist |
| `colors_and_type.css:61` | `--kb-text-2` is a fixed grey (fails on `--kb-surface-2`) | A 64 % derivation of `--kb-text` (§2.3) |
| Radius usage | **152 uses** speak the retired 12/16 px scale; **274 bare `999px` writes** | Six radii, `--kb-r-pill` for the pill (§4.2) |
| `colors_and_type.css:228` | `--kb-ink-on-tint` is declared as the generic ink recipe | It always returns the teal fallback — do not use (§2.6) |
| `colors_and_type.css:205` | `--kb-good-ink` is declared and used | 3.23:1 — do not use for text (§2.6) |
| `colors_and_type.css:316-318` | `prefers-reduced-motion` cuts KIBO and spares the rest | It cuts interface motion and keeps KIBO (§4.6) |
| `colors_and_type.css:28` | `--kb-focus-halo` has **zero consumers**; there is no `:focus-visible` in the published layer | One ring on every focusable piece (§4.5) |
| `colors_and_type.css:31-44` | The type scale has **zero consumers** in the published layer | Nine steps, declared by token (§3.2) |
| `kbv-components.css` header | "if a brand hex appears again, it is a regression" | **75 hex literals** and **111 off-scale radii** are present. Zero literals is the rule (§5) |
| `kbv-components.css:1116`, `:1599` | The retired green `#6FCC9C` is live in both XP bars | The XP role is `--kb-xp` (§6.4) |
| `kbv-components.css:1160`, `:2189` | Two edge colour stripes survive | R-1: four patterns, no stripe (§5) |
| `colors_and_type.css:75` | `--kb-gem` is deprecated in text but live in 3 derived tokens, 9 cards and the public API | The rare currency is **Elemento**, `--kb-dark-*` (§2.4) |
| Control height | `preview/formulario-campos.html:19` says and does 42 px | `--kb-ctl-h` = 46 px (§4.4) |
| `--kb-mood-*` (`:91-98`) | Eight mood **colours** — mood mapped to a body hue | Retired as body colour (AD-23). Mood is carried by the **face** (eyes, pupils, mouth, brow); the body colour is `--skin`, a user-customisable dimension independent of mood. A per-mood accent, if ever wanted, is the **aura** — a wardrobe layer, never the skin |
| State tokens | None exist; `disabled` is `opacity: 0.45`, `error` is a raw `rgba` | Real states per family (§6.1, §6.2) |
| Data & gamification token families | The chart ramps, the flame ramp, and the material ladder **do not exist**; charts borrow area/priority hues ad hoc, `--kb-mat-*` has three entries, `--kb-rarity-*` still declares six and aliases the retired `--kb-gem` | Standard (rendered on the canvas, §6.9–6.10): `--kb-cat-1..8` · `--kb-seq-1..5` · `--kb-div-*` · `--kb-gain`/`--kb-loss` · `--kb-mat-1..9` (+ink, luminance-anchored) · `--kb-flame-1..9` · `--kb-rarity-*` cleaned to four with visibility as a separate axis |
| New tokens | `--kb-sh-4`, `--kb-warn-soft`, `--kb-warn-border`, `--kb-warn-ink`, `--kb-w-page`, `--kb-w-prose` are **not declared** | Declared and rendered on the canvas. `--kb-sh-4` is the step between popover and modal; the alert inks (HP, reto, warning) mix at **74 %**, not the 54 % every other ink uses; page width is 1200 px and prose width 72 ch |

---

## 9 · What remains is content, not system

The design-system **vocabulary is complete** — foundations, components, data visualization, gamification, the shell, KIBO and the action wheel are all rendered on the canvas and specified here. What is left is **content**, decided by Sergio and filled in during the platform rebuild, never invented in the system:

- The **names of the nine emblem materials** and the nine flame tiers (the tokens are ordinal; the names are content).
- **Which** ranks, achievements, prestige grades, chest odds and prices exist.
- The **theme catalogue** (which themes are sold, at what price) — the mechanism is `ARCHITECTURE.md` §9.1 / AD-24–26; the catalogue is content.
- The **18 real menu destinations**, the **five phone tab-bar destinations**, the **wheel's actual actions**, and **KIBO's wardrobe catalogue and travesura lines**.

## 10 · Open questions

Only one is left. The rest were ruled on 2026-08-23 and are recorded in §11.

1. **What is `--kb-medal` called to the user?** The token is a role; the user-facing name of the sixth gamification slot is not set.

---

## 11 · Decisions taken (2026-08-23)

**The solid button face is the ink, not the plain hue.** `color-mix(in oklab, <hue> 54%, var(--kb-void-2))` — white on it measures 7.7:1. `--kb-primary` at full strength measures 3.06:1 with white and fails AA at every viable label size, so it does not fill a control. It keeps painting progress, XP, focus rings, links and active states: the brand colour is unchanged, only the solid fill is.

**A user-recoloured área is corrected silently.** The person picks any hue; the system derives its wash and its ink through the two recipes in §2.1, exactly as it does for every other hue. What renders is always legible, and no one is ever told their colour was wrong. The accepted cost: the rendered tone can differ from the swatch that was tapped.

**Rarity is four grades, and visibility is a separate axis.** común · raro · épico · legendario. The retired "secreto" and "oculto" were never rarities — they describe whether an achievement can be seen before it is earned, which is a different property from how rare it is. Collapsing both into one ladder is what made six grades necessary. Each grade takes its own hue from the system; none uses the retired gem blue.

**The card set is rebuilt around the kernel, not restandardised as it stands.** Foundations and components are kept and corrected; the domain cards are redone against the kernel — one card for the fact record and its types, rather than six card families for six "modules" that turned out to be the same envelope. This is the retirement criterion (AD-17) applied to the design system itself.

---

*End of DESIGN-SYSTEM.md · v1.3*
