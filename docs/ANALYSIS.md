# Kibo Design System — Analysis · v1.0

| Version | Date | What changed | Why |
|---|---|---|---|
| v1.0 | 2026-08-23 | Initial consolidated audit | Three independent audits (tokens & accessibility, product coverage, CSS vocabulary) merged into one living document for builders. |

> Work items and status live in the central backlog ([`BACKLOG.md`](../../../../BACKLOG.md), section
> "Kibo — Personal OS", `KIBO-001`..`KIBO-024`), never here. This document carries the evidence;
> the backlog carries the tracking (Art. 13).
>
> Class names, card names, token names and DS rule ids stay in their original Spanish — they are
> identifiers in the corpus, not prose.

---

## Status summary

**71 cards, 17 indices** (68 in `preview/` + 2 UI kits + 1 in `components/`). Coverage: 14 modules declared in the PRD, 7 without even an atom documented. The system publishes a token family nobody uses in the published layer, a form control with a dead `size` prop, and three figures in the README contradicted by field measurement. Production readiness: fails all four criteria (Art. 15 — scalable · maintainable · human-readable · functional). Two complete screens load, compile, and are discarded on every boot.

**High-ROI wins:** delete 1,777 dead LOC before consolidating CSS. Fix three live defects visible today (toast, Sparkline, tab recrop). Consolidate 937 class prefixes onto the proven button pattern (base + 5 modifiers, 662 uses).

---

## Findings by severity

### Blocking (23)

**Tokens (3)**

1. `colors_and_type.css:31-44` — Typographic scale `--kb-fs-*` (9 steps) has **zero consumers** in `kbv-components.css`, `preview/` or `components/`. Every size change is hand-edited across 68 files. The T-6 floor is unenforced by token.
2. `colors_and_type.css` — **Zero state tokens** (`loading`, `error`, `disabled`, `selected`). `disabled` uses raw `opacity: 0.45`; `error` uses raw `rgba(230,69,69,0.10)`.
3. `colors_and_type.css:75`, `components/KbStatPill.jsx:4` — `--kb-gem` is deprecated in text but live in 3 derived tokens, 9 cards and the public API export. **The dark currency is unreachable.**

**Accessibility (4)**

4. `kbv-components.css:207-209`, `preview/buttons.html:12` — Primary button, white on `--kb-primary` (`#1CA4A0`) measures **3.06:1** at 14px/700. Fails AA.
5. `docs/PLAN.md:100`, `docs/INVENTARIO.md:54` — R-13 states "14px bold" where WCAG defines large text at 18.66px. All text between 14px and 18.66px bold is validated against the wrong floor.
6. `colors_and_type.css:28`, `kbv-components.css:274,809,2208,2306` — **Zero `:focus-visible`** in the published layer. `--kb-focus-halo` has zero consumers. One field is invisible when focused (`:809`).
7. `components/KbStatPill.jsx:9-11` — Variants `streak` (**2.43:1**) and `hp` (**3.73:1**) fail AA despite the correct inks being declared.

**Structural consistency (3)**

8. `colors_and_type.css:191`, `preview/formulario-campos.html:19` — Control-height contract: the token says 46px, the card says and does 42px. Neither uses the token.
9. `preview/buttons.html:3-19`, `components/KbButton.jsx:2` — `buttons.html` reinvents `.kbv-btn`, diverging in 8 properties. `.kbv-btn-sm` does not exist but is composed, so the `size` prop is dead.
10. `preview/tareas-atomos.html:24`, `preview/tareas-moleculas.html:18`, `preview/formulario-campos.html:37`, `preview/formulario-estados.html:37` — The retired ink recipe (M-7) is published in 4 cards, backed by a contrast figure M-1 already disproved.

**Documentary coherence (3)**

11. `README.md:369-373` — Lists 20 files in `reference/`; **13 do not exist** and it omits **16 that do**. The M-10 audit rule is inapplicable against that map.
12. `README.md:292` vs `preview/kibo-moods.html:1` — KIBO's mood "changes colour" vs "changes gesture, not colour". Mutually exclusive statements about base product behaviour.
13. `docs/PLAN.md:20-22`, `docs/PLAN.md:363` — The Áreas index is founded on `areas-screen.jsx`, which was **not in the project**. Resolved 2026-08-23 by completing `reference/` (16 → 49 modules).

**Coverage & architecture (4)**

14. Dashboard, header, widget board and the 3 responsive modes are **undocumented**. Blocks 21 screens.
15. `docs/PLAN.md:327` — Reencauce, the brand promise, is fully built (`reencauce.jsx`, present in `reference/`) and has **zero cards**. High-ROI fix.
16. `dashboard-v2.jsx:320,1397`, `datos-radar.html:30` — The premium currency carries **three names for one balance**: gemas, materia oscura, fragmentos. The same file uses two of them.
17. `docs/PLAN.md:306` — Áreas: only the **atom** is documented. Molecule, organism and screen are missing, and the create/edit surfaces offer two contradictory colour palettes.

**Vocabulary & live defects (3)**

18. `personalizacion.jsx:374`, `social-screen.jsx:431`, `tarea-detalle.jsx:319`, `tienda-screen.jsx:1062` — `.kbv-toast` is mounted 4 times with **zero CSS rules** (only `.kbv-social-toast` exists). It renders as bare text.
19. `finanzas-screens.jsx:100`, `character-screen.jsx:46`, `finanzas-screens.jsx:1030/1245/1430` — `Sparkline` is overwritten by load order. **Finance charts draw a generated series, not account data.** Active defect.
20. `kbv-components.css:1116`, `:1599` — The retired green (`#6FCC9C`) is live in both XP bars, in a file declared migrated.
21. `kbv-components.css:11-15` — The file header states "if a brand hex appears again, it is a regression". **75 hex literals** and **111 off-scale radii** are present.

**Dead code (2)**

22. `finanzas-screens.jsx:349`, `screens-v2.jsx:4263`, `tienda-screen.jsx:1071`, `personal-screens.jsx:987` — **1,777 unreachable LOC** (6%). Two full screens: old Finanzas (329) and old Store (238).
23. `finanzas-screens.jsx:100`, `character-screen.jsx:46`, `widgets-v2.jsx`, `widgets-v3.jsx` — **Seven name collisions** resolved silently by load order. Sparkline (finding 19) is the one that is an active defect; the rest are dead weight.

---

### Important (31)

- `colors_and_type.css:61-62` — `--kb-text-2` equals `--kb-text-3` (`#6B7280`). Two levels, three names.
- Real collisions, not deliberate aliases: `--kb-coin` = `--pri-medium` (`#F4B740`); `--kb-gem` = `--pri-low` (`#6E8CF2`); `--kb-hp` = `--pri-urgent` (`#E64545`).
- `preview/glosario.html:1`, `preview/areas-atomos.html:1` — T-4: 3 cards exceed 800px; 33 of 68 sit above the 300–500 ideal.
- `kbv-components.css:1160`, `:2189` — R-1 survivors: 2 edge colour stripes (`.kbv-boss`, `.kbv-prompt`).
- 570 orphan CSS classes (20%); 57 phantom.
- `preview/buttons.html:3`, `preview/inputs.html:3`, `preview/logo.html:3` — Three cards skip `kbv-components.css` and self-host fonts.
- `README.md:25,354,206,324-326` — False citations: documents that do not exist, cards that do not exist, and instructions to do work already done.
- Card count divergence: `_ds_manifest.json` 71 · `docs/INVENTARIO.md:5` 68 · `docs/PLAN.md:339` 70 · `README.md:25` 29 · `docs/pendientes.md:4` 59. Reconciled: **the manifest is correct at 71**.
- `docs/pendientes.md:4,5,16,88,66,50,139-140` — Fossilized (59/12 against 71/17; marks closed items as pending) while declaring itself authoritative.
- **68% of spacing** (3,662 values) already lands on the scale but is written as raw px; **76% of type** likewise; **152 radii** speak the retired scale (12/16px).
- `colors_and_type.css:316-318` — `prefers-reduced-motion` is inverted: it cuts KIBO and spares everything else.
- 9 gaps against the 44px touch floor are unregistered; the closed decision covers only 3 habit buttons.
- Coverage: 1 module fully · 6 partial · 7 with nothing. 30 of 46 prototype modules were absent from `reference/app/` until 2026-08-23.
- 6 form controls and 3 modal types exist in code and are undocumented.
- **Four critical journeys** undocumented: onboarding → area, register → reward, fail → reencauce, earn → equip.
- Two unreachable screen bodies: `EstudioScreen` (249 LOC), `AreasScreen` (109 LOC).
- 9 orphan components; overlapping index tables in `anatomia.md` with no transition.

---

### Minor (6)

- `areas-atomos` mismeasured: 790px in `INVENTARIO` against 942px in the file and manifest.
- `trofeos` is listed as T-4 debt but measures 510 — no violation.
- `docs/anatomia.md:13-38` — Two index tables overlap with contradictory numbering.
- Áreas and Tareas marked "Pending" in `anatomia.md` and ✅ in `PLAN.md`.
- The GTA V reference survives in the README and `preview/rueda.html` after `PLAN.md` marked it retired.
- Nine orphan components with zero references.

---

## Context: decisions already taken (2026-08-23)

These are **not open**. They frame the findings above and constrain Phase 2.

1. **Dark theme: in, via token redefinition.** Consequence: the 75 hex literals in `kbv-components.css` move from *important* to *blocking*. Rule: **zero colour literals outside `colors_and_type.css`**, non-negotiable.
2. **shadcn retired.** `@kibo/ui` is built on the design system alone.
3. **Expo/Android ratified** as an equal client. Tokens are authored format-neutral; interfaces are written twice.
4. **Audit before code.** This pass completes before source is touched.

---

## § 1 · Tokens

The scale is sound; adoption is broken. `--kb-fs-*` is unused. `--kb-gem` muddles two domains. State tokens are absent. R-13 has the wrong unit. The focus token is unused and `:focus-visible` is missing.

**Phase 2 fixes:** adopt where the scale already exists. Add 3 steps (spacing 14px; type 14px and 16px). Finish the radius migration. Declare the 3 phantom tokens. Design the state matrix.

---

## § 2 · Accessibility

WCAG 2.4.7 and 2.4.11 fail on primary controls. White on brand colour fails AA. The motion rule is inverted. Nine touch-target gaps.

**Phase 2 fixes:** one global `:focus-visible` rule. Primary button to `--kb-primary-fill` or dark text. Touch zones via `::after`. Correct R-13 to 18.66px. Invert `prefers-reduced-motion`.

---

## § 3 · Structural consistency

The rules exist but diverge from what ships. Four card bases are redundant. Retired code is published.

**Phase 2 fixes:** enforce T-4 (split the 3 over budget). Apply R-1 to 72 selectors (band, tint, bar, pill). Unify the card bases. Migrate the M-7 ink.

---

## § 4 · Documentary coherence

The documents disagree on counts, cite files that do not exist, and mark closed work as pending. The in-flight index cited a source that was absent.

**Phase 2 fixes:** declare `_ds_manifest.json` the count of record. Rewrite the README. Retire or regenerate `pendientes.md`. Fix `anatomia.md`.

---

## § 5 · Product coverage & information architecture

14 PRD modules against 21 navigation destinations. 7 modules have no atom. M-8 forbids writing what cannot be cited. Journeys are documented only at their edges. The currency has three names. The shell is unwritten.

**Phase 2 fixes:** `reference/app/` is now complete (49 modules), which unblocks the 7 domains. Index the 18 shell entries. Collapse the currency to one name. Define the transitions between journey steps.

---

## § 6 · CSS vocabulary consolidation

Kibo does not need new vocabulary. The button family already proves the pattern works here: base plus 5 modifiers, 662 uses, 89% concentrated in 6 classes. The work is applying that pattern to 14 other families and deleting the overflow.

| Family | Canonical form | Classes absorbed | Current uses | What breaks | Effort | Why in this position |
|---|---|---|---|---|---|---|
| **Progress bars** | `.kbv-progress` (`kbv-components.css:2281`) + 4 height mods (`xs` 4px · `sm` 6px · `md` 8px · `lg` 10px) + colour mods (HP · XP · goal · streak · progress) | Generic track+fill: `fill` (35) · `track` · `bar-track` · `bar-fill` · `bar-label` · `bar-count`. HP: `hp-bars` · `hp-bar` · `hp-bar-track` · `hp-bar-fill` · `hp-bar-l` · `hb-track` · `hb-fill`. XP: `xp-track` · `xp-fill` · `kbv-bar` · `ch-level-bar`. Goal: `og-bar` · `sg-bar` · `fw-bar` · `wi-bar` · `weight-bar` · `sbd-bar` · `sbd-track`. Streak: `sh-bar` · `smx-bar` · `wr-bar` · `wc-bar`. Study: `ht-bar` · `ht-track` · `ht-fill` · `ea-track` · `ev-bar` · `rk-bar` · `sem-bar` · `subj-progress` · `sd-progress` · `kbv-detail-progress`. Áreas: `apc-bar` · `arp-track` · `all-track` · `cmp-track` · `cmp-track-h` · `ab-bar`. Reading: `rt-bars` · `rt-bar` · `rt-bar-l` · `rt-bar-track` · `rt-bar-fill` · `rt-bar-n` · `evr-track` · `evr-fill` · `rm-bar` · `rm-track` · `kbv-bl-bar` · `progress-mini`. Achievements: `ach-bar` · `ah-bar` · `pp-progress` · `pp-track` · `ptl-track`. Loose: 17 per-screen variants | 181 total · 89 active · 20 orphan | Height changes by ≤1px and is invisible except HP (12 → 10px). 27 inline `style={{height}}` become a modifier. No colour changes | HIGH — mechanical: 89 substitutions plus 27 style-to-modifier | Largest family (109 classes) and the simplest technique. Establishes the pattern for everything after it |
| **Chip / pill / tag** | **Three pieces, not variants:** (1) `.kbv-chip` — touchable (2) `.kbv-tag` — static wash (3) `.kbv-badge` *(declared proposal)* — closed scale. Criterion: touchable → chip; closed scale → badge; otherwise → tag | Interactive: `qa-chip` (11) · `am-chip` (4) · `bl-chip` (3) · `format-chip` (2) · `ssb-chip` (2) + 10 more. Static: `am-pill` (6) · `subj-tag` (6) · `area-chip` (5) · `pc-tag` (5) + 39 more. Badges: `done-badge` (2) · `reg-marked-badge` (2) + 11 more. Stay separate: `kbv-stat-pill` (counter), `kbv-tag-input` and `vt-tag-input` (fields) | 140 total, averaging 1.9 uses per class | 32 carry their own tint under three different variable names (`--c` / `--p` / `--tc`); the migration must preserve each. Also collapses 12 type sizes and 32 paddings into 3 coherent pieces | HIGH — judgment-intensive; every use needs eyes on it | Highest visual impact and the only family that cannot be automated. If split by piece, do the static wash first (58 of 74, 78%) |
| **Card** | `.kbv-card` (`kbv-components.css:1252`) + 3 densities: `flush` (0 padding) · `md` (18px, default) · `tight` (14px). All share background, border, radius and shadow; only padding and gap differ | Four redundant bases: `.kbv-card` (81) · `.kbv-char-card` (74 — adds only `padding:18px 22px`) · `.kbv-fin-card` (35, gap 12) · `.kbv-side-card` (14, gap 14 — a 2px difference). Plus 53 carrying R-1 accent stripes | 281 total, 129 on the base | Padding moves inward by 4px on 74 cards: visible side by side, imperceptible in use. **Must be executed together with the R-1 migration** — they touch the same 53 classes; done separately it is double work | MEDIUM alone · HIGH with R-1. Never separate them | Core identity, and two bases differ by 1px of gap. Combined with R-1 it unifies the vocabulary and the rule in one pass |
| **Modal** | `KBVModal` (`modals-v2.jsx:9`) — **36 of 36 already use it.** The defect is the default width: `md` (580px) while 25 call sites override to `lg` (720px) by hand. Changing the default removes all 25 | All 37 mount or hand-write `KBVModal`. To integrate: `KibPopup` (`mascot.jsx:46`, 63 LOC); custom veils `kbb-chat-veil` (`kibo-quick.jsx:503`), `cc-veil` (`tienda-screen.jsx:400`), `vt-scrim` (`vitrina.jsx:182`); 2 screens writing markup (`personalizacion.jsx:154`, `:249`) | 27 shell mounts + 3 veils + 1 popup + 2 hand-written = 33 | Only the default width. The two hand-written modals gain Escape, click-outside and focus management | LOW — a one-line default change plus integration. 97% already done | The most mature family. Best value-per-effort in the whole table |
| **KPI / stat** | `.kbv-kpi` (`styles-extras.css:783`, 84 uses, works) + 3 column mods (`cols-4` · `cols-5` · `cols-6`). **Plus a state matrix** *(declared proposal)*: 4 states — loading, error, empty, no-permission — with anatomy per state | `.kbv-kpi-grid` (declares 4 columns; 14 of 17 override by hand and 8 rewrite the same value). Variants: `kbv-gallery-kpi` · `kbv-reto-kpis` · `note-kpi-strip` · `bc-kpi` · `bc-kpis` · `kpi` · `kpi-wrap` · `stat-block` · `stat` · `fc-stat` · `fp-stat` · `sbd-stat` · `ab-stat` · `hs-metric` · `am-stat` · `ap-metric` · `atr-stat` · `meta-stat` · `opc-metric` · `pr-metric` · `kbv-heatmap-stat` · `sem-stats` · `fc-stats` · `ab-stats` · `kbv-fp-stats` · `stats` · `entry-stats` (0) · `wc-stats` (0). Stay separate: `kbv-stat-pill` (counter) · `kbv-kpi-icon` (anatomy) · `kbv-kpi-anim-stack` (variant) | 190 total, 84 canonical | Nothing breaks. The grid modifiers restore trust in the default. The states are new design work | MEDIUM for the grid; the state design is the real cost | This is where server data will surface. The missing states become urgent the moment a backend exists — designing them now avoids reopening the family after launch |
| **Section head** | The `SectionHead` component (`kbv-shared.jsx:138`, 49 mounts) emitting `.kbv-section-head` (`styles-extras.css:9606`). `.kbv-page-head` (30) is a different hierarchy level and stays separate | 80 `*-head` classes. Top 9: `head` (45) · `kbv-study-section-head` (38) · `kbv-page-head` (30) · `kbv-vts-head` (5) · `kbv-ach-head` (4) · `kbv-area-detail-head` (4) · `kbv-char-section-head` (4) · `pers-block-head` (4) · `kbv-reto-section-head` (2). Long tail: 71 more, mostly single-use | 222 total — 49 component + 80 scattered | The component forces an `h3`/`h4` and a phantom button. Screens with arbitrary controls (tabs, filters) use the supported `children` prop | HIGH for all 80 · **MEDIUM for the top 9, which carry 80% of the value** | Scales across every domain. Take the top 9 for critical mass; the single-use tail is optional |
| **Toolbar** | `.kbv-filter-bar` (`styles-extras.css:589`, 4 uses) as the flex wrapper baseline | 11 filter classes: `filter-block` (5) · `notes-toolbar` · `salud-toolbar` · `salud-rec-filters` · `kbv-ach-filters` · `kbv-feed-filter` · `kbv-period-filter` · `kg-filters` · `th-filters` · `tl-progress-filter` · `kbv-kanban-toolbar` (0) · `kbv-wip-toolbar` (0) | 13 total | Nothing — these are thin flex wrappers | LOW — trivial | Tight scope, high ROI, clears noise from every count |
| **Stage / level** | `.kbv-stage` *(declared proposal)* + height modifiers. A minimal wrapper | 6 height variants: `kbw-stage` · `kc-stage` · `cc-stage` · `cg-stage` · `kw-stage` · `opc-anim-stage` · `kbv-avatar-stage` (0) | 6 total | Nothing | LOW — create and alias | Loose singles, cheap to fold in |
| **Empty state** | The `EmptyState` component (`kbv-shared.jsx`, 25 mounts), which already owns the anatomy: icon · title · description · CTA | 8 local classes: `kbv-project-empty` (5) · `w4-empty` (4) · `empty` (3) · `blg-empty` · `dp-empty` · `empty-note` · `hm-empty` · `kbfind-empty` + orphans | 23 total | Nothing — the anatomy is the component's | LOW — redirect call sites | Turns 8 scattered variants plus 25 component mounts into one standard |
| **Tabs / segmented** | `.kbv-seg` (`styles-extras.css:9811`, 4 uses), unifying the 8 tab-strip names in `kibo-shell.css:465-492`, with modifiers for column layout. **Also fixes a live defect:** 6 real tab strips are missing from the responsive selector and do not scroll on phone | 8 declared: `.kbv-store-tabs-v2` (6) · `.kbv-store-tabs` (5) · `.seg-n` (5) · `.range-tabs` (4) · `.kbv-fin-tab` (2) · `.kbv-seg-row` (2) · `.kbv-ach-tabs` · `.kbv-ach-tabs-row` · `.kbv-fin-tabs` · `.kbv-icon-mode-tabs` · `.kbv-reto-switch` · `.kbv-widget-size-tabs` · `.pp-tabs` · `.sd-seg` · `.kbv-tabs` (0) · `.kbv-study-tabs` (0) · `.kbv-period-tabs` (0) · `.kbv-sub-tabs` (0) · `.tab-badge` (0), plus the 6 missing | 40 total | Fixes the live defect: one class name plus the 6 additions to the responsive rule makes tabs scroll and wrap correctly on phone | LOW — unify names, extend the responsive rule | Fixes the mobile recrop defect, and demonstrates why naming matters: a responsive rule cannot catch a class nobody named |

### Scales

- **Spacing** — 68% of 3,662 values already land on the scale. One gap: 14px (250 uses). Adding the step and rounding 583 odd values reaches 94%.
- **Radius** — 59% on scale, and **152 uses still speak the retired scale (12/16px)**. This is a migration, not a gap. 274 bare `999px` writes become the pill token.
- **Type** — 76% of 1,139 values on scale. Gaps at 14px (71 uses) and 16px (22). Adding both and rounding 117 half-steps reaches 93%.
- **z-index** — 27 app-layer declarations to map onto tokens; the other 76 are local stacking and are correct as they are.

### Declare, do not retire

- `--kb-sh-4` — the drawer shadow is a real elevation level.
- `--kb-warn-soft` / `--kb-warn-border` — they close the `--kb-warn` family.

### Do not retire — this is adoption, not surplus

- `--kb-sp-1` and `--kb-sp-4` — the most-used value is 8px, written raw 505 times.
- `--kb-z-*` — the scale is right; the adoption is not.

---

## Phase 2 attack order, by value over effort

| # | Task | Effort | Why here |
|---|---|---|---|
| 1 | Delete dead code (1,777 LOC) and drop `opciones*.jsx` from the build | LOW | Avoids migrating code that is about to be deleted |
| 2 | Fix the three live defects: toast, Sparkline, tab recrop | LOW | Visibly broken today; ships immediately |
| 3 | Modal: change the default width, integrate the outliers | LOW | 97% done — a one-line change with a large UX win |
| 4 | Toolbar, stage, empty state and tab modifiers — four in parallel | LOW | Clears noise; the tab work fixes mobile |
| 5 | Progress bars — 109 classes onto 4 heights | HIGH (mechanical) | Largest family, simplest technique; establishes the pattern |
| 6 | Card unification and the R-1 migration — **one move** | HIGH | Same 53 classes; done separately it is double work |
| 7 | KPI grid modifiers and the state matrix | MEDIUM + design | Must precede the backend; it is a data-layer prerequisite |
| 8 | Scales and token cleanup | MEDIUM | Parallelizable; sets the contract for everything after |
| 9 | Chips — the three-piece split | HIGH (judgment) | **Last.** The only family needing a per-use decision |

---

End of ANALYSIS.md · v1.0
