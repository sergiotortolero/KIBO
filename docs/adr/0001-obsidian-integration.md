# ADR-0001: Obsidian integration — thin plugin connector, provenance-based ownership, frontmatter data contract

| Field    | Value |
|----------|-------|
| Status   | **Proposed** |
| Date     | 2026-08-08 |
| Revised  | 2026-08-08 (round 2) |
| Deciders | Sergio Tortolero |
| Project  | Kibo |

## Revision note — 2026-08-08, round 2

Sergio corrected the framing: *"I did not mean we shouldn't build a plugin to interconnect the systems — I mean I don't want the Kibo platform to be a plugin inside Obsidian."* Kibo's stated goal is to **make both tools work together**: structured records captured in Kibo (his central example: a **medical consultation and its prescriptions**) should travel to the vault and back, and an existing structured vault should be importable and exportable.

What changed in this ADR:

| Change | Reason |
|---|---|
| **Title and framing**: the plugin is a **thin connector**, not a product surface | Kibo does not live inside Obsidian |
| **Cancelled**: all Kibo product UI inside Obsidian — sidebar streak, HP, daily habits, writing XP (the PRD's F1) | Same |
| **Cancelled**: Obsidian as an acquisition channel. Compatibility is a feature for Kibo users | Sergio's framing. The round-1 risk "the Obsidian community may not adopt gamification" is no longer decisive |
| **Ownership axis changed**: from *per field* to **per provenance**, refined to **per region** | Kibo now originates record notes. Provenance answers "who owns this file"; regions answer "who owns which part of it" |
| **"Kibo writes zero bytes by default" is withdrawn** | Kibo does write — it generates record notes. What it still never does is rewrite what the user wrote |
| **`kibo-id` promoted** from opt-in to mandatory-by-provenance | Consent moved from the YAML key to the relationship with the note |
| **Frontmatter contract promoted** from sync annex to the central deliverable | It is the bridge: Obsidian has structure without schema; Kibo has schema |
| **KS-01 needs widening** for adopted notes; escalated to `security-auditor` rather than assumed | Adopted notes live outside the Kibo root by definition |
| **"Health never to the vault" withdrawn** | That was my rule, not the constitution's. Art. 3 protects *financial* data. Health becomes opt-in per module; finance stays prohibited |

Unchanged and reaffirmed: the plugin as primary transport; the exclusion of Local REST API, local agent and File System Access API as sync transports; no three-way merge in v1; no deletion propagation; conflicts preserve both versions.

Round-2 analysis: `docs/analysis/obsidian/11-r2-arquitectura-conector.md`.

## Context

### The decision being made

Kibo is a gamified Personal OS delivered as a **web application**. Obsidian is a **local-first** note manager whose vault is a folder of plain Markdown files on the user's disk. This ADR fixes the shape of the integration between them.

The framing, after round 2, is complementarity rather than competition, and it rests on one asymmetry:

> **Obsidian has structure without schema. Kibo has schema.**

A vault is structured — folders, links, frontmatter — but nothing enforces that two notes of the same kind carry the same fields. Kibo enforces exactly that. The bridge is **YAML frontmatter**: each note is a record, frontmatter keys are its columns, wikilinks are its foreign keys, and Bases and Dataview are the query engines that already exist. The play is therefore to have **Kibo emit in the convention the ecosystem already reads**, so that existing plugins operate on Kibo's data without Kibo building anything for them.

Six specialists analysed the problem independently. This ADR consolidates their conclusions into a single architectural decision. The full reasoning, with weighted criteria and cited evidence, is in `docs/analysis/obsidian/01-arquitectura-integracion.md` (round 1) and `docs/analysis/obsidian/11-r2-arquitectura-conector.md` (round 2).

### Why decide now, when there is nothing to integrate yet

`web-architect` established a hard fact that reframes the urgency: **the thing to be integrated does not exist in code.** The repo has 5 commits, no migrations, no CI. There is no notes table, no Resources screen, no editor, no backlinks, no streak engine, no XP ledger — and no Health module either, so the medical-consultation example that motivates round 2 has no schema behind it yet. The PRD's claim that phase F0 is "already covered by design" is **false at the code level** — it is covered in the Claude Design mockup, outside the repo. Roughly 8–12 weeks of building Kibo's core stand between today and the moment this integration becomes meaningful.

This ADR is therefore **not a build order**. It is decided now because four of its elements become **irreversible once live vaults exist**:

1. **Ownership model** — provenance and regions determine who may write what. Changing it later means rewriting files on other people's disks.
2. **File identity strategy** — retrofitting a stable anchor into thousands of already-adopted notes is a migration on the user's disk.
3. **Write scope** — narrowing a permission later is a breaking change; widening it is not.
4. **Path canonicalisation and the `.obsidian/**` denylist** — a security control that must exist before the first byte is written, not after.

The **domain vocabulary of the frontmatter contract is deliberately excluded from that list, and must stay unfrozen** until Kibo's data model is stable. The structural decisions above are safe to take today; naming `doctor` versus `physician` is not, because there is no Health entity to name it against.

Everything else in this ADR can be re-decided later at low cost.

### Forces in play

- **The core technical problem is transport.** A browser cannot mount and watch an arbitrary local folder. File System Access API is Chromium-desktop only — absent from Firefox and Safari, absent from mobile — and `FileSystemObserver` is desktop-only. On mobile, the vault lives inside the app sandbox where no browser reaches.
- **Writing into a vault is writing into a security boundary.** `security-auditor` documented an active campaign (PHANTOMPULSE, Elastic Security Labs, April 2026) abusing `.obsidian/**`: files written there are **code execution**, not data.
- **There is no prior art for the bidirectional mirror.** `business-analyst` found that the category's only sustained success (Readwise) solved the same problem with **one direction and no overwriting**, across six years of ecosystem history.
- **The hard problem is information architecture, not synchronisation.** `ux-researcher`'s finding: two places to write the same thing produces a failure that shows up as **silence**, not as an error — the user stops writing on both sides. Their rule: *"Your vault is where you write; Kibo is where that becomes progress."* Stated flatly: **never two editors.**
- **Obsidian's developer policies are a hard constraint on any plugin**: client-side telemetry is forbidden outright; server-side telemetry must be disclosed with a privacy policy link; and automated review now scans **every version**, not only the first submission.
- **The ecosystem's query layer is already built and free to reach.** Bases is a **core** plugin since Obsidian 1.9 and reads YAML frontmatter; Dataview reads the same frontmatter and still works, though its original author stepped back in 2023. Emitting clean YAML buys both without Kibo writing a query engine.
- **Sergio does not use Obsidian** and has no vault (brief §1). Round 2 lowers the weight of this risk — Obsidian is no longer an acquisition channel, so the question is no longer "will that community adopt us" but "does this serve Kibo's own users" — but it does not remove it: the frontmatter conventions still have to feel native to people who live in vaults.

### The gate that decides everything

The architecture analysis eliminated strict Obsidian-first (option A) on a single requirement, **G1**: *"Resources must remain writable from Kibo (web and mobile) after a vault is linked."* That elimination is uncomfortable, because under the weighted criteria **A scores higher than the alternative it lost to (4.15 vs 3.85)**. The analysis flagged G1 as "the single largest simplification lever in this design."

Two specialists then attacked G1 from independent angles — `ux-researcher` on information architecture, `business-analyst` on prior art. Re-examined, **G1 was over-specified**: it conflated *capturing new content* with *editing existing bodies*. Those are separable, and separating them dissolves the trade-off.

## Decision

**We will integrate Kibo with Obsidian through a thin first-party plugin acting purely as transport, with write authority assigned by provenance and enforced per region of the file, a versioned frontmatter data contract as the integration's primary artifact, and gamification state never leaving Kibo.**

The decision has seven inseparable components:

### 1 · Transport — thin first-party plugin, outbound only

The **Kibo connector for Obsidian** (TypeScript, official plugin API) is the primary and only first-class transport. It calls `https://api.kibo.app` outbound via `requestUrl`.

This is the only transport that satisfies all three of: works on desktop **and** mobile; receives native vault `rename` events carrying the previous path; and can rename files through `fileManager.renameFile`, which rewrites inbound wikilinks correctly. Because it is outbound from inside Obsidian, every browser restriction disappears — no File System Access API, no self-signed certificate, no Local Network Access prompt (Chrome 142), no mixed content, no tab that must stay open.

**It is a dumb pipe.** All format knowledge lives on the Kibo server; the plugin does not know what a medical consultation is. It ships bytes, paths, hashes and vault events, and executes a `WritePlan` the server has already resolved. It parses no Markdown, interprets no frontmatter, computes no game rules, calls no third party, and renders no product UI — its only pixels are one command ("Sync now") and one settings screen (account, scope, status, log).

The reason is operational, not aesthetic: **Obsidian's automated review scans every version, not only the first submission.** With a dumb pipe, the frontmatter contract evolves server-side and the plugin is not republished for months. The plugin is versioned by **protocol**, not by features. Working estimate: 1,000–1,500 lines of TypeScript; growth well beyond that is a signal that product logic has leaked into it and must be returned to the server.

The full closed list of what the connector does and does not do is in the round-2 analysis §2.

Supporting transports:
- **`obsidian://` deep links** — day-one floor, near-zero cost. Precedent: Obsidian's own Web Clipper writes to the vault this way.
- **File System Access API** — one-shot import/export only. Never continuous sync.

Explicitly excluded from the product (confirmed independently by `security-auditor` as **D-11** and **KS-16**):
- **Local REST API plugin** — 5–6 install steps before first value; desktop only; requires Obsidian running; depends on third-party code Kibo does not control.
- **Local desktop agent** — code signing, notarisation, auto-update and support constitute a second product.

The **user's own cloud folder** (Dropbox / Drive / OneDrive) is deferred to a later ADR as a second transport. Note that Obsidian Sync exposes **no public API**, so users of the official sync are reachable only through the plugin.

### 2 · Ownership — by provenance, enforced per region

Write authority is assigned first by **provenance** (who originated the file), then by **region** (which part of the file). Provenance is **declared by the user, never inferred by Kibo.**

| Provenance | What it is | Kibo writes | Kibo reads | `kibo-id` |
|---|---|---|---|---|
| **`kibo`** | Record note generated by Kibo — consultation, prescription, project, habit, book, journal entry | Region K only (see below) | yes | always |
| **`adopted`** | User's own note that **the user promoted** to a Kibo record | **Only** the frontmatter keys declared in the mapping profile. Never the body, never the path | yes | always |
| **`read`** | User's note indexed for Resources — search, backlinks, missions, XP | **nothing, zero bytes** | yes | never |
| **`foreign`** | Everything outside the granted scope | nothing | nothing | never |

**Regions.** Provenance alone is insufficient, because provenance is not stable over time: the user will eventually add their own notes to a file Kibo generated, and regenerating it would destroy them. Every Kibo-generated note therefore has three zones, and the unit of ownership is the zone, not the file:

| Region | Owner | On regeneration |
|---|---|---|
| Declared frontmatter keys (those of the `kibo-type`) | Kibo | rewritten via `processFrontMatter` |
| Undeclared frontmatter keys the user added | User | **preserved verbatim** — the round-trip golden rule: never delete the unknown |
| `<!-- kibo:generated -->` block | Kibo | replaced wholesale |
| Everything else in the body | User | **untouched** — not read to decide anything, not moved, not reformatted |
| Generated block absent (the user deleted it) | User won | **not recreated.** Recorded as `generated_block: removed`; frontmatter keeps syncing |

**Consequence: three-way merge is unnecessary even for Kibo-generated notes**, because Kibo and the user never write the same region. The round-1 conclusion holds and now extends to a case it did not previously cover.

**Bidirectionality still runs through intents, not shared authority.** Ticking `- [x]` in Obsidian does not write state; it emits `task.complete` to Kibo's rules, which validate and award XP, streak and HP. Users perceive two directions everywhere it matters — write in Obsidian and it becomes progress; create in Kibo and it lands in the vault; tick on either side and it counts — with no field ever having two owners.

**Gamification stays out of files entirely**: XP, HP, coins, gems, levels and missions never appear in the vault.

**Financial amounts are never projected to the vault** (workspace constitution, Art. 3). Monetary keys are emitted empty so notes still validate against their `.base`. **Health is opt-in per module**, never on by default, with an explicit warning — because whatever Kibo writes into a vault leaves Kibo's control and ends up in the user's Dropbox, iCloud or third-party git repository.

### 3 · Conflict handling — structurally avoided, not resolved

Because Kibo never rewrites a user body — and, under regions, never writes into a region the user owns even inside files Kibo generated — **body conflicts cannot arise at all**. Three-way merge, persisted merge bases and diff-match-patch are **not required for v1**. Where two versions ever do exist, both are preserved (`security-auditor` **KS-05**); last-write-wins over note bodies is prohibited (**D-8**) — Obsidian Sync itself does not use LWW for Markdown.

**Deletion is never propagated in v1** (**KS-04**, **D-9**). A note deleted in Obsidian marks the Kibo resource `archived`, never deleted. A resource deleted in Kibo moves the file to the vault trash, never `unlink`, and never without a prior backup. A mass-disappearance threshold pauses sync and asks the user.

CRDTs (Yjs, Automerge) and vector clocks are rejected with argument, not by omission: a CRDT requires storing causal history alongside the document, and a plain `.md` edited by a foreign program has nowhere to put it.

### 4 · The frontmatter data contract — the integration's primary artifact

This is no longer an annex to synchronisation. It **is** the product: the contract is what makes Kibo's schema legible to a vault, and what lets existing plugins operate on Kibo's data without Kibo building anything for them.

**Modelling rule:** Kibo's **facts** become record notes (consultation, prescription, reading session, journal entry); Kibo's **dimensions** become reference notes (doctor, medication, facility, book, author, area); and **wikilinks perform the join**. Obsidian has no joins but it has backlinks, which for a human are better: opening `[[Naproxeno]]` and reading its backlinks *is* the query "every time this was prescribed to me", with no query written and nothing built.

**Common keys on every record note** — only these five carry the `kibo-` prefix: `kibo-id` (ULID, immutable), `kibo-type` (namespaced, e.g. `health/consultation`), `kibo-rev`, `kibo-updated`, `tags`. **All domain keys are unprefixed** (`date`, `doctor`, `dose`, `mood`) precisely so Bases and Dataview treat them as ordinary user properties rather than app noise.

**Ecosystem conventions Kibo adopts** (evidence and dates in round-2 analysis §3 and §11):
- YAML frontmatter as the data layer, using only Obsidian's native Properties types: text, number, checkbox, date (`YYYY-MM-DD`), datetime (ISO 8601), list, link.
- **Plural list forms** for `tags`, `aliases`, `cssclasses` — the singular forms are deprecated as of Obsidian 1.9.
- **Tasks plugin emoji syntax** for task lines (`➕ 🛫 ⏳ 📅 ✅ ❌`, priorities `🔺⏫🔼🔽⏬`, `🔁`), anchored with a native block reference `^kibo-<id>`.
- Filename = title; daily-note format read from the user's Daily Notes setting, never imposed.
- **HTML comments** (`<!-- kibo:… -->`) as block delimiters, not Obsidian's `%%…%%`, which renders literally in every other Markdown tool.
- **Bases is the primary target** (core plugin since 1.9); Dataview compatibility comes free from clean YAML.

**Conventions Kibo deliberately ignores:** Dataview inline fields (`key:: value`) — read on ingest, never emitted, since Bases does not read them and emitting them would tie Kibo to a plugin whose original author stepped back in 2023; Tasks' `🆔`/`⛔` for identity (they collide with the user's own dependency usage); Datacore (beta, outside the official store); Templater syntax (`<% %>` is never emitted); and the user's own `.base` files, which Kibo never modifies.

**Relations are emitted twice — in frontmatter and in the body.** Obsidian accepts `[[wikilinks]]` in frontmatter and has a native `link` property type, but **native backlink support from frontmatter is limited**. Frontmatter carries the relation for Bases and Dataview to query; a "Related" section inside the generated block carries it for the graph and backlinks to work. Costs a few template lines; buys the feature people actually use Obsidian for.

**Kibo also emits its own `.base` files** under its root — one per entity type. Marginal cost ≈ zero (generated YAML); the user opens their vault and already has working dashboards of their Kibo data inside a **core** Obsidian plugin.

The serializer remains **`packages/markdown-vault-format`**, with no dependency on the Obsidian API: marginal cost of genericity ≈ 0, and it serves any Markdown vault. **No Logseq or Silver Bullet plugins will be built.**

**Stable identity is mandatory, determined by provenance.** This supersedes the round-1 "opt-in and deferred" recommendation. In round 1 the anchor was an *unrequested* write on a user's file, so consent had to be sought for the key itself. Under provenance, consent is no longer about a YAML key — it is about the **relationship with the note**, and the user grants it by generating or adopting. The result is *more* restrictive, not less: the set of files carrying `kibo-id` is exactly the set the user chose. "Zero-footprint mode" still exists — adopt nothing, leave everything `read`.

The PRD's "no hacer" is **rewritten, not deleted**:

> Kibo writes only into files the user asked it to write: the notes it generates, and the notes the user explicitly adopted — and in adopted notes, only the frontmatter keys declared by the mapping profile, never the body and never the path. No gamification data — XP, HP, coins, gems, levels, missions — ever touches any file. Notes the user never adopted receive zero bytes.

### 5 · Security constraints — part of the decision, not an annex

These are **blocking** controls from `security-auditor`. They are decision content because they constrain the write model itself:

| ID | Constraint |
|---|---|
| **KS-01** | **Declared write scope.** Whole-vault write access is rejected (**D-1**). See the widening request below. |
| **KS-02** | **Absolute denylist on `.obsidian/**`** plus an extension allowlist. Writing there is code execution, not data. |
| **KS-03** | **Path canonicalisation and validation** before every write: symlinks, UNC paths, alternate data streams, reserved device names, RTL override characters, NFC normalisation. Windows is a primary environment. |
| **KS-04** | **No deletion from the cloud side.** Trash plus prior backup only. |
| **KS-05** | **Conflicts preserve both versions.** Never discard bytes. |
| **KS-07** | **The AI layer has no authority.** It cannot award XP and cannot write files. Reached independently by `ai-engineer`. |
| **KS-08** | **Prompt-injection containment**: vault content is untrusted input to any LLM path. |
| **D-13** | No gamification metadata in user files. |

**KS-01 widening request — escalated to `security-auditor`, not assumed.** Adopted notes live outside the Kibo root by definition, so round 2 requires widening the write scope. The narrowest form I can construct:

| Zone | Write scope | Consent |
|---|---|---|
| Kibo root (`Kibo/`) | create, replace, rename, trash | once, at link time |
| **Adopted** notes | **only** `processFrontMatter` with the keys declared by the profile. Never the body, never rename, never delete | per note or per folder, at adoption |
| Everything else | **zero writes** | — |

Two derived controls come with it: the **key allowlist is per profile and validated server-side**, so the `WritePlan` reaching the plugin is already bounded and the plugin rejects any `kibo-`-prefixed key outside the permitted triad; and **no write to an adopted note may change its path or filename** — renaming is a Kibo-root-only operation.

This widening moves the perimeter from "one folder" to "one list", which is the security cost of round 2 and must be decided **before** building, since it changes both the permission model and the onboarding design.

One consequence of KS-01 that is **resolved rather than deferred**: Kibo still cannot write a block into the user's real daily note. Round 1 deferred this to v2; round 2 solves it without any widening — the Kibo journal entry carries `daily-note: "[[2026-08-08]]"`, and Obsidian's automatic backlink surfaces the Kibo entry from the user's daily note. **Link instead of merge**: the graph performs the join and Kibo writes nothing outside its root. The same applies to reading sessions.

A further constraint, from Obsidian's developer policies: **all product instrumentation lives in the Kibo API; none in the plugin.** Client-side telemetry is prohibited and would cost Kibo the community directory, which is the entire distribution channel.

### 6 · Ingesting existing vaults — mapping profiles, and import/export as a first-class capability

Sergio's "and the other way round": a user who already has a structured vault must be able to bring it into Kibo. This did not exist in round 1.

A **mapping profile** declares how to recognise a record type in the user's vault and how to translate it. It lives on the server, is versioned, and maps **values as well as keys** — translating `médico → doctor` is worthless if `estado: completada` then fails the enum. Profiles specify `unmapped: keep` (unmapped keys are preserved in the file and stored opaquely in Kibo, returned verbatim on write — never deleted) and `write_back: declared_only`.

Adoption runs in four steps with a brake at each: **profile** (read-only sampling, nothing written) → **propose** (Kibo proposes a mapping with per-field confidence; the user corrects) → **dry run** (the profile is applied without writing; the user sees exactly what would change and resolves exceptions) → **adopt** (affirmative user action; only now does a `WritePlan` reach the plugin, and only frontmatter is touched). An LLM may **propose** correspondences and may never **apply** them (KS-07); vault content is untrusted input (KS-08), which is contained by the fact that model output is a proposal a human confirms, not an action.

Notes that are not records are never adopted — they remain `read`, indexed with zero writes. Notes matching two profiles are always escalated to the user. Missing required fields, ambiguous dates and out-of-enum values are exceptions, never guesses. Un-adopting stops writing and **leaves the file exactly as it is**, `kibo-id` included; stripping keys would be another unrequested write.

**Import and export are first-class, not a minimum floor.** Deterministic and safe to run unattended: Kibo → vault export, re-import of `kibo` notes, round-trip of adopted notes under a validated profile, and import of free notes into Resources. Requiring a human: first-time mapping of an existing vault, out-of-enum values, ambiguous dates, multi-profile matches. **Nothing ambiguous is ever applied without an approved preview.** The PRD's "export everything" is redefined as emitting a **working Obsidian vault** — folders, record notes, dimension notes, resolved wikilinks, `.base` files and a README of the convention — that opens and functions without Kibo. That is the strongest available proof of no lock-in, and it is verifiable in CI.

### 7 · RF-08 reuse — shared core, deferred extraction

This answers the open question assigned by `security-auditor` (**`[S]`-1**).

**Yes, the RF-08 sync engine (Google Tasks / MS To Do) can share a core with Obsidian** — but only if the core is designed around a **changeset**, not around a polling cycle. The `SyncConnector` port must carry `mode: 'pull' | 'push'` from day one: provider connectors are pull (the server asks), the Obsidian plugin is push (the client tells). An engine designed by looking only at Google Tasks produces a poller, and Obsidian will not fit it. That single field costs nothing today and prevents a full rewrite later.

Shared: changeset model, operation log, external-id crosswalk, tombstones, idempotency by client-generated `opId`, field-ownership policy engine, cursors, backoff, audit, destructive-change preview. Not shared: format mapping, change detection, authentication.

**The filesystem adapter demands controls no HTTP adapter needs**, which is why it must not share write primitives: KS-01 root confinement, KS-02 denylist plus extension allowlist, KS-03 canonicalisation, KS-04 trash-instead-of-unlink, plus size and file-count limits. The architectural rule that enforces this: **`sync-core` never exposes `write(path, bytes)`.** It exposes `write(entity)`, and each adapter resolves paths inside its own confined root.

**`packages/sync-core` is defined as a port now and extracted as a package only when the second connector exists.** Generalising from a single implementation produces an abstraction that describes that one case and obstructs the next.

## Options Considered

Weighted criteria (from `01-arquitectura-integracion.md` §3.5): data-loss risk 25%, brand fit 20%, time-to-market 20%, maintenance 15%, complexity 10%, portability 10%. Scores 1–5, higher is better.

| # | Option | Score | Verdict |
|---|---|---|---|
| **A** | **Strict Obsidian-first.** Vault rules; Kibo reads, indexes, gamifies; Kibo writes nothing at all. | **4.15** | Rejected. Leaves no answer for notes that already exist in Kibo before linking, and no capture path from Kibo web/mobile. |
| **B** | **Strict Kibo-first.** Vault is a rendered export Kibo regenerates. | **3.45** | Rejected. Kibo overwrites files the user edited — the one sin this audience does not forgive. Fails the no-data-loss gate. |
| **C** | **Full bidirectional.** Both sides write any field; converge afterwards. | **2.35** | Rejected. Makes XP and coins writable from a text file, destroying economic integrity. Worst on cost, complexity and maintenance. No prior art of success in the ecosystem. |
| **D** | **Partitioned truth with three-way body merge.** Bidirectional per entity, single-writer per field, note bodies merged with a persisted common base. | **3.85** | Rejected **for v1**, retained as the v2 upgrade path. Sound, but pays for a merge engine, persisted merge bases and a conflict-state machine in order to enable a second editor that `ux-researcher` argues should not exist. |
| **A′** | **Obsidian-first bodies + intents + create/append.** Kibo never rewrites a user body; it may create files and append inside its root; task and habit completion flows both ways as intents; gamification stays in Kibo. | **4.55** | **Adopted in round 1; superseded by A″.** |
| **A″** | **A′ generalised to provenance + regions.** Kibo owns the files it generates and the regions it declares; the user owns their notes and every region Kibo did not declare; adopted notes are a consented middle ground limited to frontmatter. | **—** | **Adopted (round 2).** |

**Why A″ rather than A′.** Round 2 required Kibo to *originate* record notes, which A′ did not contemplate: A′ was framed around not rewriting the user's bodies, and answered "who wins a dispute over an existing note". Provenance answers a question A′ could not: **"who owns a note that did not exist before Kibo created it?"** Regions then close the gap A′ would have opened, since a Kibo-generated note will eventually contain user-written content. A″ is not a reversal of A′ — it is A′ with its ownership axis generalised, and every A′ property survives: no rewriting of user bodies, no three-way merge, intents rather than shared authority, gamification confined to Kibo. A″ is not re-scored, because the criteria that separated the round-1 options no longer discriminate between A′ and A″: they differ in expressive power, not in cost or risk profile.

### Why A′ and not A

A was eliminated by gate **G1** — *"Resources must remain writable from Kibo after a vault is linked."* On re-examination, G1 conflated two different capabilities. Separating them dissolves the trade-off:

- **Capture new content** from Kibo web/mobile → satisfied by create-and-append, which cannot conflict.
- **Edit existing bodies** from Kibo → *this* is what forces three-way merge, persisted bases and a conflict state machine.

G1 is therefore replaced by **G1′**: *"The user can capture new content from Kibo web/mobile without opening Obsidian."* A′ satisfies G1′ at a fraction of the cost, and the pre-existing-notes objection resolves as a **one-shot, confirmed export** at link time rather than as continuous two-way sync.

### Why A′ and not D

Three independent lines converge on the same answer:

1. **Cost.** Removing body rewriting removes three-way merge, persisted `baseBody`, the conflict state machine and the largest storage cost in the design.
2. **Information architecture** (`ux-researcher`). Two editors for the same content fails as silence, not as error. A′ makes the split legible: *your vault is where you write; Kibo is where that becomes progress.*
3. **Prior art** (`business-analyst`). The category's only sustained success chose one direction and no overwriting. Six years produced no counter-example.

D remains the documented upgrade path if evidence later shows users genuinely want to edit bodies from Kibo. Going A′ → D is additive. Going D → A′ means removing a capability users already have, which is far harder.

### Transports rejected

| Rejected | Reason |
|---|---|
| File System Access API as sync transport | No Safari, no Firefox, no mobile; `FileSystemObserver` desktop-only; dies when the tab closes. |
| Local REST API plugin | 5–6 install steps to first value; desktop only; requires Obsidian running; third-party dependency. Confirmed by `security-auditor` (**KS-16**). |
| Local desktop agent | Signing, notarisation, auto-update, support: a second product. Confirmed as **D-11**. |
| Rebuilding a graph/editor inside Kibo | Confirmed from PRD §4 without reservation. |

## Consequences

**Positive**

- Works on desktop **and** mobile, which no other transport achieves.
- **Body conflicts are structurally impossible** for user notes in v1 — the hardest class of bug is designed out rather than handled.
- v1 requires **no** three-way merge, no persisted merge bases and no conflict state machine — and regions extend that property to Kibo-generated notes.
- Brand promise strengthens rather than strains: Kibo genuinely does not touch what the user wrote, and writes only where the user asked it to.
- Aligns with the ecosystem's only proven pattern and with a legible information architecture.
- The generic format package serves any Markdown vault at ≈ 0 marginal cost, decoupling Kibo's fate from Obsidian's.
- `security-auditor`'s blocking controls are satisfied by construction rather than bolted on, and the connector's minimal surface keeps the reviewable attack surface small.
- **The ecosystem does work Kibo does not have to build.** Clean YAML makes Bases and Dataview query Kibo's data for free; emitted `.base` files hand the user working dashboards inside a core Obsidian plugin at near-zero marginal cost.
- **Obsidian's graph becomes Kibo's join engine**: dimensions as reference notes mean backlinks answer relational questions no one had to implement.
- The connector's dumb-pipe design decouples contract evolution from Obsidian's per-version review, which is the largest maintenance saving available here.

**Negative / trade-offs**

- **Resources stops being a body editor for the user's own free notes once a vault is linked.** For a **premium** module this must be framed as a declared mode change in onboarding, not discovered. Round 2 narrows this: it applies only to `read` notes; record notes are Kibo's by provenance and are edited in Kibo without ambiguity.
- **The frontmatter contract becomes a public compatibility surface that is harder to change than a database schema.** A Postgres migration runs in a deploy; renaming a key once 500 users have notes on their own disks is a migration on **other people's disks** — it can only run when each user opens Obsidian, can fail halfway, and breaks the `.base` files and Dataview queries the user wrote on top. This is debt whose holder does not control it.
- **The security perimeter moves from "one folder" to "one list"** once adopted notes exist. The write is minimal (declared keys, via `processFrontMatter`, never body or path), but the model is no longer a single confined root.
- Sync only happens while Obsidian is open. Mitigation is the deferred cloud connector.
- For `read` notes, which carry no anchor, renames performed outside the plugin degrade to hash heuristics; worst case is a duplicate index entry requiring a merge action.
- The connector is still a separate deliverable with its own lifecycle: automated review scans **every version**, so release latency must be budgeted — though the dumb-pipe design should make releases rare.
- Zero product instrumentation inside the plugin. Everything must be inferred server-side.
- Kibo still stores vault content it has read. **This is the largest unresolved exposure** and is escalated below.
- **Health data can now leave Kibo for the vault** (opt-in). Once written, it propagates into whatever the user syncs the vault with, beyond Kibo's control.

**What this closes off (deliberately)**

- Whole-vault write access. Any widening requires an explicit, re-consented permission step.
- Last-write-wins over note bodies, in any form.
- Deletion propagation in v1.
- Any gamification data inside any file.
- **Any Kibo product UI inside Obsidian** — the PRD's F1 is cancelled, not deferred.
- Dataview inline fields (`key:: value`) as an **output** format; they are read on ingest only.
- Financial amounts in the vault, in any form.
- Logseq and Silver Bullet plugins.

**Follow-ups**

- [ ] `security-auditor` — **decide the KS-01 widening** for adopted notes (component 5). Blocks onboarding design and the permission model.
- [ ] `security-auditor` — resolve the **"metadata-only mode"** question: can Kibo hold ids, links and hashes while bodies are opened via deep link, instead of storing bodies in Postgres? Decide **before** the data model is written; it changes the schema.
- [ ] `security-auditor` — approve the wording and reversibility of the **health-to-vault opt-in**, and decide whether it requires periodic reconfirmation.
- [ ] Write the frontmatter contract as a **versioned specification with CI tests** that open the exported vault and validate frontmatter, types and `.base` files. Rules: version the contract, **add only, never rename**, and freeze the domain vocabulary late.
- [ ] `product-planner` — sequencing. F1 is cancelled; F2's prerequisites are the Resources module. Also revisit the "≥25% linked vault" metric, which has no basis and an ambiguous denominator.
- [ ] `ux-researcher` / `ui-designer` — design the linking onboarding, the adoption flow (four steps with a brake at each) and the mode change of Resources.
- [ ] Write the "no client-side telemetry" rule into the connector repo before the first line of code.
- [ ] ADR for the cloud-folder connector (transport 2).
- [ ] ADR for extracting `packages/sync-core`, when the second connector exists.

## Open decisions for Sergio

These are **not** architectural gaps. They are product calls the architecture is waiting on, in priority order.

1. **Does Resources stop being a body editor for the user's own free notes when a vault is linked? (the "never two editors" rule.)**
   Still the decision the whole ADR rests on, but **round 2 makes it smaller and easier**: it now applies only to `read` notes. Record notes are Kibo's by provenance and are edited in Kibo with no ambiguity. `ux-researcher` and `business-analyst` both say yes, from independent evidence. Saying yes buys the simplest, safest and cheapest architecture. Saying no reinstates gate G1 for free notes and brings back three-way merge, persisted merge bases and a conflict state machine. **The decision must be conscious, not made by omission.**
2. **Does Kibo store note bodies on its servers, or run in metadata-only mode?** Changes the data model; must precede schema work.
3. **Health data to the vault: yes or no?** Opt-in per module is the recommendation; finance stays prohibited unconditionally. Requires `security-auditor` sign-off on the wording.
4. **Adopted notes: widen KS-01 as proposed, or restrict adoption to notes the user first moves into the Kibo root?** The second option keeps a single perimeter at the cost of asking users to reorganise their vault — which is exactly the kind of demand that gets integrations uninstalled.
5. **In adopted notes: all three anchor keys (`kibo-id`, `kibo-type`, `kibo-rev`) or only `kibo-id`?** Three buy Bases filtering and cheap drift detection; one is more discreet.
6. **`current-streak` / `longest-streak` in habit frontmatter?** They are informational derivatives, not currency, but a strict reading of D-13 removes them. Nothing structural is lost either way.
7. **Which core module gets built first** — this, not this ADR, determines whether the first useful integration is habits/streaks or Resources.

## References

- `docs/analysis/obsidian/11-r2-arquitectura-conector.md` — **round-2 delta**: provenance and regions, the connector's closed capability list, ecosystem conventions, the per-entity frontmatter contract (including the medical consultation and prescription example), mapping profiles, and §11 source table.
- `docs/analysis/obsidian/01-arquitectura-integracion.md` — round-1 analysis: weighted criteria, transport comparison, sync algorithm, and §12 source table (all sources consulted 2026-08-08).
- `docs/analysis/obsidian/00-brief.md` — framing decisions and repo state.
- `docs/product/PRD-kibo.md` §4 — the prior analysis this ADR validates and partially revises.
- `docs/analysis/obsidian/03-*` (`web-architect`) — code reality check: no domain entities exist; F0 is not covered at code level.
- `docs/analysis/obsidian/04-*` (`business-analyst`) — prior art: Readwise's one-direction, never-overwrite model.
- `docs/analysis/obsidian/06-*` (`ux-researcher`) — "never two editors"; two writing surfaces fail as silence.
- `security-auditor` deliverable — blocking controls KS-01…KS-08, KS-16 and rejections D-1, D-8, D-9, D-11, D-13; PHANTOMPULSE campaign (Elastic Security Labs, April 2026).
- `ai-engineer` deliverable — independently reached KS-07 (the AI layer holds no authority).
- Key external evidence, round 1 (full citations in the analysis §12): [Obsidian developer policies](https://docs.obsidian.md/Developer+policies) · [Mobile development](https://docs.obsidian.md/Plugins/Getting%20started/Mobile%20development) · [Obsidian Sync conflict resolution](https://deepwiki.com/obsidianmd/obsidian-help/2.3-synchronization-and-conflict-resolution) · [The future of Obsidian plugins](https://obsidian.md/blog/future-of-plugins/) · [Chrome Local Network Access](https://developer.chrome.com/blog/local-network-access) · [File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access).
- Key external evidence, round 2 (full citations in the round-2 analysis §11, all consulted 2026-08-08): [Bases syntax](https://github.com/obsidianmd/obsidian-help/blob/master/en/Bases/Bases%20syntax.md) · [Properties and metadata](https://deepwiki.com/obsidianmd/obsidian-help/4.3-properties-and-metadata) · [Tasks emoji format](https://publish.obsidian.md/tasks/Reference/Task+Formats/Tasks+Emoji+Format) · [Dataview metadata](https://blacksmithgu.github.io/obsidian-dataview/annotation/add-metadata/) · [Dataview vs Datacore vs Bases, 2026](https://obsidian.rocks/dataview-vs-datacore-vs-obsidian-bases/) · [Wikilinks in YAML frontmatter](https://forum.obsidian.md/t/wikilinks-in-yaml-front-matter/10052).
- Workspace constitution Art. 3 (financial data), Art. 5 (ADR before architecture), Art. 9 (least privilege).
