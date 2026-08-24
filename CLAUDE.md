# Kibo — Personal OS (gamified/RPG)

**Personal project — Sergio's personal priority.** A gamified "Personal OS": a life-management
platform wrapped in productivity-RPG mechanics, es-MX first. Part of the `llm-workspace`
portfolio; the workspace constitution applies in full (sessions run from the workspace root —
ADR-0003 there). Own git repo: `github.com/sergiotortolero/KIBO`, **public** — verify visibility
before committing anything sensitive (Art. 3).

## Read these first, in this order
The four living documents (Art. 5) are the whole context. Nothing else is authority.

| Document | What it answers |
|---|---|
| `docs/ARCHITECTURE.md` | How it is built and why — stack, kernel, the dated decision log, the open questions |
| `docs/DESIGN-SYSTEM.md` | **The recipe** — how to produce interface in brand without re-deriving it |
| `docs/ANALYSIS.md` | What is wrong today, with evidence |
| `docs/EXECUTIVE.md` | What it is worth, for stakeholders — not yet written |

Work items and status live **only** in `../../../BACKLOG.md`, section "Kibo — Personal OS"
(Art. 13). Never track work here.

**There are no PRDs and no ADRs.** They were retired 2026-08-23 and their live content is in
`ARCHITECTURE.md`; the folders are gone. Do not recreate them (Art. 5).

## The design system
`design-system/` is a 1:1 mirror of the Claude Design project, versioned here.

- `colors_and_type.css` — the token source. **It still declares retired vocabulary**; the
  destination is `docs/DESIGN-SYSTEM.md` §8, which lists every divergence. Read that section
  before building against the file.
- `canvas/` — the specimen: `.dc.html` artboards seeded with the `/design` skill's helper and
  published as one artifact. The canvas is **opened to compare against**; the recipe is **read to
  build from**. When they disagree, the document is wrong until proven otherwise.
- `reference/` — the v1 prototype, 49 modules. **Evidence about the domain, never a spec.**

## Stack
React monorepo (pnpm + Turbo). Today: `apps/web` (Next.js), `apps/api` (NestJS scaffold),
`packages/database` (Prisma), `packages/config` (empty), `packages/ui` (broken — slated for
deletion). The target tree and the enforced import rule are in `ARCHITECTURE.md` §2.4; the
re-engineering is deferred until the design system closes.

**Web and Android both ship in v1.** Components are never shared between them — tokens are.

## Hard constraints
- **Zero colour literals outside the token layer.** A hand-written colour cannot be re-themed,
  and dark theme is in.
- `decisions.json` is a LOCKED design artifact (Art. 9) — never edit it; propose changes instead.
- Before any code touching health, finance or journal: the four Article 12 preconditions
  (`ARCHITECTURE.md` §4). The data-residency matrix is the only one that exists.

## Working agents
Build and design work routes to the workspace roster from the workspace root — `ui-designer`
owns the visual layer, `web-architect` the platform, `solution-architect` the decisions. This
repo intentionally has no `.claude/agents/` copies; if a session must ever open here directly,
run the workspace's `scripts/Sync-Agents.ps1 -Project "Kibo"` first.
