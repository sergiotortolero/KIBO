# Kibo — Personal OS (gamified/RPG)

**Personal project — Sergio's personal priority.** A gamified "Personal OS" (RPG-style) web
platform. Part of the `llm-workspace` portfolio; the workspace constitution applies in full
(sessions run from the workspace root — ADR-0003 there).

## Stack & layout
- React monorepo (pnpm + Turbo): `apps/web`, `apps/api`, `packages/config`,
  `packages/database`, `packages/ui`.
- Own git repo: `github.com/sergiotortolero/KIBO` (gitignored by the parent workspace on purpose).

## Hard constraints
- `decisions.json` is a LOCKED design artifact (workspace constitution Art. 9) — never edit it;
  propose changes to Sergio instead.
- PRD before any feature; ADR before any architectural decision (Art. 5). Docs live in `docs/`
  (create `docs/prd|adr|audits` on first use).

## Working agents
Build/design work routes to the workspace roster (`web-architect`, `ui-designer`,
`product-planner`, etc.) from the workspace root. This repo intentionally has no `.claude/agents/`
copies; if a session must ever open here directly, run the workspace's
`scripts/Sync-Agents.ps1 -Project "Kibo"` first.

## Status
Minimal context file created 2026-08-01 (workspace structure audit); expand with product context,
current milestone, and a status pointer as work resumes.
