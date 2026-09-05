# Kibo — Architecture · v1.7

| Version | Date | What changed | Why |
|---|---|---|---|
| v1.7 | 2026-09-05 | The Rive-vs-alternatives re-evaluation confirms Rive as KIBO's runtime and adds a fourth condition to AD-27 (AD-28) | Rive is the only option that passes both gates — the HP-derived reactive face and the composed sub-1MB gel — and the only one where mood≠colour is physical rather than a coding discipline. The decisive new fact: there is no mature AI→`.riv` path, so the interactive rig is authored by hand; KIBO's richness now depends on staffing that authoring seat |
| v1.6 | 2026-09-04 | The KIBO Rive feasibility spike resolves GO WITH CONDITIONS (AD-27, §9.2) | The mascot's one-asset-two-platforms bet is validated against the real runtimes: mood via state machine, skin via data binding, live skins inside the .riv. React Native parity is the highest-risk assumption and needs the RN specialist the roster lacks |
| v1.5 | 2026-08-24 | Sergio's theme decisions: Elemento is real-money buyable (AD-25) and the theme product model is fixed (AD-26) | The four product decisions the AD-24 research left open are now made; the economy gains a real-money path to Elemento, kept safe by the never-advantage invariant |
| v1.4 | 2026-08-24 | The visual layer becomes a sellable theme surface: the mechanism (AD-24, §9.1), with the product questions carried to §13 | Sergio ruled data-viz and gamification themeable and sellable via Elemento. Two research passes (monetization model, token mechanism) fixed the how; what and whether-real-money are his |
| v1.3 | 2026-08-24 | KIBO's mood is expression-only; body colour is a separate customisable dimension (AD-23) | Sergio ruled the mood must change only the face, because skin colours become user-customisable. Mood and colour, previously the same surface, are now orthogonal state-machine inputs |
| v1.2 | 2026-08-23 | KIBO is authored as a state machine in Rive, one asset for both clients (AD-22) | Sergio ruled the mascot must animate like Duolingo's characters and serve web and mobile from the same thing. It reframes the open spike: the question is no longer whether CSS survives React Native, but whether the state machine delivers KIBO's behaviour on both clients |
| v1.1 | 2026-08-23 | Closed Q2 (token authoring format, AD-21) and recorded that KIBO is present throughout the product on both platforms (AD-20) | Sergio ruled the mascot is brand identity, not decoration, and delegated the token format. Both change the critical path: the mascot spike moves into the foundations phase, and `packages/tokens` now has a shape to be built against |
| v1.0 | 2026-08-23 | First consolidated architecture of record. Absorbs every live decision from `docs/adr/0001-obsidian-integration.md`, `docs/adr/0002-kibo-platform-architecture.md` and `docs/product/PRD-kibo.md`; resolves the contradictions between them; records Sergio's 2026-08-23 rulings; states what was discarded and why | Art. 5: one living architecture document per solution, decisions dated inside it, no per-decision ADRs and no per-feature PRDs. The three source files become deletable without losing a live decision |

> **How to use this document.** This is the architecture of record and the input to every build
> delegation. Cite the section you are implementing.
>
> - **What is wrong today** — `docs/ANALYSIS.md` (design-system diagnosis, v1.1). Not repeated here.
> - **What is being worked on and its status** — the central backlog, [`BACKLOG.md`](../../../../BACKLOG.md),
>   section "Kibo — Personal OS" (`KIBO-001`..`KIBO-024`). Never tracked here (Art. 13).
> - **The remaining `docs/analysis/**` files are evidence, not authority.** Where they conflict with
>   this document, this document wins. `platform/01` and `platform/05` are superseded in the parts
>   listed in §14.
> - `docs/adr/**` and `docs/product/PRD-kibo.md` are **void** as of this version. Everything live in
>   them is here.
>
> Spanish identifiers (token names, class names, DS rule ids, currency names) stay in Spanish — they
> are identifiers, not prose.

---

## 0 · Thesis and scope

> **Kibo is not an app with AI. It is a personal context store with access surfaces.** The Android
> app is one surface. The web is another. The Markdown vault is a third. The AI is a fourth. None of
> them is the system.

The consequence that orders every decision below: the artifacts that must be right are not the
screens. They are the **uniform data envelope**, the **operation log**, and **per-category access
control**. Everything else is a consumer of those three.

**Product framing.** Kibo is a gamified Personal OS: a life-management platform (habits, tasks,
projects, finance, health, study, reading, journal, notes) wrapped in productivity-RPG mechanics.
The user creates a character, levels five life areas, keeps streaks, faces challenges that put HP at
stake, and earns currency and XP spent on self-defined real rewards, cosmetics and capabilities.

- **Brand principle: *"el fracaso reencauza"*** — failure redirects; it never punishes or shames.
- **Voice:** close, motivating, es-MX first.
- **Product thesis:** Notion, Obsidian and Todoist have the right *data model* and fragile retention
  because they do not create a habit. Kibo adds the gamified UI/UX layer that does: identity
  (character), potential loss (HP and streaks), variable reward (chests), gentle social pressure
  (friend circle), and expression (cosmetics, showcase).

**Repo state this document is written against:** `apps/api` (NestJS, scaffold — no auth, no
validation, open CORS, one broken controller), `apps/web` (Next.js, talks Prisma directly),
`packages/database` (Prisma, 6 identity models, no migrations), `packages/config` (empty),
`packages/ui` (broken: declares a non-existent `index.tsx`), no CI, five root junk files, and
`design-system/` (212 files, landed 2026-08-23). There is no domain entity and no migration. **There
is no code investment to protect**, which is why this document can decide without negotiating with
the past.

---

## 1 · Product surface

### 1.1 The economy (transversal)

Two currencies. **The name is the unit; the skin is only the look** — skins never compete with the
category name.

| Currency | Earned by | Spent on | Token family | Glyph |
|---|---|---|---|---|
| **Divisa** — the everyday one | Habits, tasks, completed challenges | Personal rewards, chests, base cosmetics | `--kb-coin` | Gold coin struck with Kibo's "K" |
| **Elemento** — the rare one | Chests, hard challenges, the Premium quota, **or bought with real money** (AD-25) | Features, premium cosmetics, protectors | `--kb-dark-*` | Faceted drop |
| **XP** | Every productive action | Not spent — raises global and per-area level | — | — |
| **HP** | Lost on failed challenges/habits | Recovered through consistency | `--kb-hp` | Heart |

"Materia oscura", "Magia", "Esencia" and "Núcleo" are **skins of an Elemento**, not balances.
"Gema", "materia oscura" and "fragmentos" are retired as balance names (AD-16).

**Economy design rules (binding):**
- Divisa → Elemento conversion happens **only through chests**, a variable-reward loop whose
  probabilities are **visible in a tooltip**.
- Elemento never buys unfair advantage — in social features or anywhere. **This invariant is what makes real-money Elemento safe** (AD-25): no amount of it, earned or bought, buys XP, streak, HP mitigation, a rank, or any game edge. It buys cosmetics and feature access, never power.
- Self-defined rewards cost **Divisa only** — the user pays themselves with their own effort.
- **Chests:** Bronce 250 · Plata 800 · Oro 2,000 · Mítico 5,000 Divisa. Guaranteed Elemento by tier
  plus extras at declared probability. Opening is a full-screen ceremony (drop → shake → burst →
  cascading rewards) that honours `prefers-reduced-motion`.

### 1.2 The 14 modules

The scope cut for v1 is **open** (§13, Q4). This is the full declared surface, not the v1 list.

| # | Module | Load-bearing mechanics a builder must preserve |
|---|---|---|
| 1 | **Hoy** (dashboard) | Editable widget grid; free + purchasable premium widgets; gallery to add/remove; purchasable extra rows; sidebar with reorderable sections, pinned global streak, KIBO as quick-action FAB |
| 2 | **KIBO** (mascot) | Living gel blob: breathes, blinks, plays (flip, squash, balloon, drip, wave), **expresses its mood through its face — eyes, pupils, mouth, brow — never through its colour** (AD-23), opens a radial quick-action wheel, morphs into a slab to "read" messages. Wardrobe in the store: **skins (the body colour, user-customisable)**, SVG accessories, auras, personalities (mischief frequency). Reflects **live** in the sidebar KIBO through a shared store |
| 3 | **Hábitos** | Effort 1–5 (canonical `RateRow`), priority with glyphs, periodicity, time. **Reward = priority × effort.** Per-habit streaks + global streak, protectors, flame tiers, manager with archiving |
| 4 | **Retos** (bosses) | Commitment with deadline, difficulty 1–5 setting damage **−8 / −14 / −22 / −34 / −50 HP** per failure, **20 % tolerated failures**, closing rewards. Solo or shared: one creation flow asks "alone or with someone?"; shared starts when invitees accept and **each player runs their own HP**. Board mini-card, detail with daily log, reflection, banner on completion (goes to Logros) |
| 5 | **Tareas y Proyectos** | Kanban with editable columns + detail (subtasks, dates, effort, priority); projects with complexity and progress; shared timeline (`KbTimeline`): scales 1 week → 12 months + custom range, horizontal scroll, fixed column |
| 6 | **Áreas** (5) | Vigor, Sabiduría, Riqueza, Comunidad, Voluntad. Per-area XP, military ranks (**20 tiers × 9 materials**), prestige 1–16 (Leyenda = Gargantúa), post-max paragon. Fed entirely by the other modules |
| 7 | **Progreso / Personaje** | Showcase, indicators, prestige, **Logros**: summary showcase + monthly trophies + challenge banners + catalogue (public / secret / hidden, 5 rarities) |
| 8 | **Vitrina** | What the community sees: cover (purchasable backgrounds, one animated), photo frame, honorific title, editable motto, pinned achievement slots (**3 base → 6, extendable to 9 with a feature**), KIBO companion peeking from the card |
| 9 | **Amigos** | **No money transfers.** Item gifts, capped contributions (**90 %**) to wishlists, Duolingo-style streak nudges, shared challenges with a **per-challenge scoreboard** (days met, failures, internal streak, who leads), circle pulse, day-grouped activity with applause, search/requests |
| 10 | **Finanzas** | Accounts and subscriptions (`MoneyRow`), credit cards as rich cards (utilisation, YTD interest, CAT), debts with payment commitment, savings goals, budget, statement import, portfolio |
| 11 | **Salud · Estudio · Lectura · Entretenimiento · Diario** | Health: vitals, workouts, record. Study: academic agenda, subjects with 1–5 rubrics, courses with backlog. Reading: books, sessions, notes with quote/photo/dictation. Entertainment: films/series with episodes. Journal: entries with mood, gratitude, learning, back-dated |
| 12 | **Recursos** (knowledge vault) | Pure Markdown notes with `[[double links]]`, `#` tags, folders, backlinks, favourites. Gamified layer: XP to Sabiduría for writing, writing streak, **orphan notes become link missions**. Pulse: total, written/week, links, orphans, streak |
| 13 | **Tienda** | Tabs: premium modules · my rewards (self-defined, Divisa only) · chests · widgets by section · **features** · KIBO cosmetics (live wardrobe) · Vitrina. Features grouped as *more space*, *more power*, *protection*, *intelligence* |
| 14 | **Cuenta y Configuración** | Account: profile, email/password, connected accounts, Premium plan with benefits and invoices, active sessions, **export everything**, delete account. Settings: language, week start, end of day; notifications; game and motion (celebrations, sounds, reduced motion, hardcore); privacy; integrations |

**Module 14 is not optional.** Export-everything, delete-account and the privacy centre are Article
12 obligations, not backlog features (§4).

### 1.3 Success metrics

- D30 retention > 40 % (streak + circle is the driver).
- ≥ 1 active challenge per weekly active user.
- ≥ 3 custom widgets and ≥ 1 equipped cosmetic in the first month (expression = retention).
- *(The "≥ 25 % of Resources users with a linked vault at 90 days" metric is **retired** — it had no
  basis and an ambiguous denominator.)*

### 1.4 Out of scope

Multi-user on a single board; a cosmetics marketplace between users (the economy is personal by
design); iOS; a native Windows application (§2.5).

**Not out of scope, contrary to what the retired PRD said:** dark theme (AD-15) and native apps
(AD-01).

---

## 2 · System shape

### 2.1 Clients — Expo/Android and Next.js/web as equal targets

**Both ship in v1. Non-negotiable (AD-01, 2026-08-23).** No iOS. No native Windows app.

- **Android:** Expo (React Native). Chosen on React-fit for a solo developer with a React
  background, on the cost of maintaining N clients, and because `expo-file-system` exposes
  `StorageAccessFramework` for SAF URIs inside the `File`/`Directory` classes.
- **Web:** Next.js. It is a client of `apps/api`, exactly like the phone.

**Code sharing between React Native and web is logic, not interface. Screens are written twice.**
That is the binding effort constraint of the whole project. Two rules follow:

> **Feature parity, not screen parity.** Each platform expresses the same capabilities in its own
> idiom — a wide timeline on the web is a list on the phone; quick capture on the phone is a form on
> the web.
>
> **One module complete on one client before porting it.** Never two clients at 50 %.

Both govern build sequence, not feature set. Nothing leaves product scope.

**The 1280 px mockup is input, not specification.** No screen transports to 390 px or to
`StyleSheet`. The phone is designed, not adapted; what is kept of the visual identity and what is
rebuilt is agreed explicitly (`KIBO-020`).

### 2.2 Backend — one domain service, sole writer

- **`apps/api` (NestJS) is the only writer** of domain and game tables. Clients read via the
  replica/API and write via the API. Never the reverse.
- **`apps/web` holds no business logic.** It may server-render by calling the API from the server
  (BFF pattern); it does not touch Prisma. One bounded exception while it exists: the browser
  session adapter — session infrastructure, not domain.
- **NestJS is retained deliberately.** Its ceremony is scaffolding for someone learning: it imposes
  an organisation instead of leaving one to be invented, and it is already in the repo. Reconsider
  (Fastify + Zod, or Hono) **only** if the fight is with Nest's ceremony instead of with the domain.
- **TypeScript end to end**, backend included. Any non-TypeScript backend destroys `packages/core`,
  the only place where server, web and Android genuinely share code.
- **API style: REST + OpenAPI, versioned in the path (`/v1/`).** The decisive argument is specific to
  installed apps: **a mobile app lives for months on old versions in people's phones.** Types are
  generated from the OpenAPI schema, recovering most of tRPC's ergonomics without losing versioning.
  Most reads never touch the API — they hit the local replica — so the API surface is mostly
  mutations.

**Work `apps/api` needs and that "the folder already exists" hides:** complete `main.ts` (global
prefix, URI versioning, `ValidationPipe`, CORS allowlist, body limit, RFC 9457 error filter); three
credential schemes designed together (browser session, mobile token, vault-connector token); mobile
auth with OAuth 2.0 + PKCE, rotating refresh tokens and `expo-secure-store`; server-authoritative
economy with idempotency; column-level encryption and a credential boundary by Postgres role; and
the consent / export / erasure tables Article 12 requires. Delete
`apps/api/src/users/users.controller.ts`, whose `findOne(+id)` turns a UUID into `NaN`.

### 2.3 Buy vs build, decided per piece

Two axes, not one: **what building it teaches that Sergio needs to know**, and **what happens when
it goes wrong** — some failures teach, some are silent and irreversible. "Transferable" is concrete:
data modelling, SQL, migrations, queues and idempotency serve him at TIBS on Monday; logical clocks
and CRDT convergence do not.

| Piece | Verdict | Rationale |
|---|---|---|
| **Schema and migrations** | **BUILD** | Most transferable learning in the stack; failure recovers from backups |
| **Background jobs** | **BUILD**, with `pg-boss` | Teaches queues, retries, idempotency, cron. Runs on the Postgres already present via `LISTEN/NOTIFY`, **no Redis** — same lessons, one fewer moving part. BullMQ is for high-volume pipelines with dependency graphs; not this |
| **Offline replication** | **BUILD, with a net** | §5 |
| **Authentication** | **Self-hosted library — Better Auth** | Neither an external service holding our users nor hand-rolled cryptography. Users, sessions and credentials live in our own Postgres. `@better-auth/expo` handles the mobile-specific problems (no `document.cookie`, OAuth via the system browser, secure storage). Migrate the existing Auth.js scaffold while it is still three tables |
| **Postgres operation** (backups, patches, HA) | **RENT** | Teaches nothing about the product. Any managed Postgres (Neon, Railway, Fly, RDS) — **Supabase is not required** and coupling to one vendor buys nothing |
| **File storage** | **RENT** an S3-compatible store; write the pre-signed-upload logic | Half a day of learning, then nothing |
| **Push notifications** | **FCM** | No decision to make: Google owns the channel on Android |
| **Observability** | **RENT** | Building it teaches little; *using* it teaches a great deal |

**Three of eight are built, and they are exactly the three with the highest transferable learning.**

Rent less means operate more: managed Postgres, S3-compatible storage, FCM and error tracking are
four vendors to configure and monitor.

### 2.4 Monorepo and package naming (AD-05)

pnpm + Turbo. **One package-name list, and this is it:**

```
apps/
  api/               NestJS. The only writer. Sole backend
  web/               Next.js. A client
  mobile/            Expo / React Native. A client
  obsidian-plugin/   Optional complement transport (§7.4)
packages/
  database/          Prisma + Postgres. SERVER ONLY
  config/            tsconfig + eslint base. Four consumers
  api-contract/      Zod schemas + generated client. Consumed by api, web, mobile
  core/              Pure domain: XP curve, streak evaluation, reward = priority × effort,
                     timezone date arithmetic. No UI, no IO
  tokens/            Design values only. No style implementation. Theme dimension from the start
  markdown/          Vault format serializer. SERVER ONLY
  projection/        Vault projection engine. SERVER ONLY
  sync-core/         Operation/changeset types, queue, policy. Server + plugin. NOT mobile
```

**Enforced import rule** (dependency lint, and written into the repo `CLAUDE.md`):
`packages/database`, `markdown` and `projection` may never be imported by `apps/mobile` or
`apps/web`. This is the boundary that stops the domain leaking into a client.

**Naming discipline that comes with `core`:** `core` holds **pure domain rules only — no IO, no UI,
no framework**. Anything that does not fit that sentence goes elsewhere. The name is short enough to
attract everything, so the rule is the mitigation.

**`packages/ui` is deleted, and the name later returns with a different meaning.** The deleted one
declared a non-existent entry point and promised web↔mobile component sharing, which is a false
promise: React DOM and React Native share no primitives. What returns (`KIBO-011`) is `@kibo/ui`, a
**web-only** primitive library built on `packages/tokens`, with no shadcn. These are not the same
package and must not be confused.

**Also deleted:** the five root junk files (`Clean`, `Launching`, `Old`, `Spawning`, `Waiting` —
`echo` output from `start-kibo.bat`).

**Metro + pnpm.** Metro historically did not follow pnpm's symlink forest. Order of preference:
(1) `node-linker=hoisted` in the root `.npmrc` — fewest surprises, at the cost of pnpm's guarantee
that a package cannot import what it did not declare; (2) an explicit `metro.config.js` in
`apps/mobile` with `watchFolders` on the workspace root and `nodeModulesPaths` app-first. Verify
against the pinned Expo SDK version before fixing the configuration.

### 2.5 Windows — PWA, not a native app

No installable desktop app, now or foreseeably. **Yes to an installable PWA from the web.** A
desktop shell adds an installer, mandatory code signing, an auto-update channel and a support
surface while adding **no capability**.

**Explicit criteria to reopen**, so it is not reopened by enthusiasm: a genuine OS capability the
web cannot provide (global hotkeys, real filesystem watching, tray integration, launch at startup),
**or** measured demand for a local vault without cloud. If reopened, **Tauri, not Electron** — a
minimal Tauri v2 app is under 600 KB against Electron installers of 50–150 MB. The cost is Rust in a
React developer's toolchain, acceptable only once the decision is justified on other grounds.

---

## 3 · Data and the context envelope

Every domain entity must be viewable through **one shape**, or the AI needs N integrations and the
product is ten apps behind one login.

**`ContextItem`** carries: `id`, `userId`, `type`, **`category`**, **`sensitivity`**, `occurredAt`,
`recordedAt`, `title`, optional `body`, typed `attributes`, `links[]`, **`provenance`**.

Three non-negotiable properties:

- **`category` and `sensitivity` are first-class**, not labels added later. They are what makes
  Article 12 enforceable at runtime instead of in a document.
- **`links[]` is the same graph the vault emits as wikilinks** — facts become record notes,
  dimensions become reference notes, wikilinks perform the join. One graph, two representations.
- **`provenance` separates what the user said from what the AI inferred.** Without it, within months
  nobody can tell which part of the "personal context" is real. It is the hardest contamination in
  the system to reverse.

**Query surface:** takes `categories`, `timeRange`, `types`, `entities`, `text`, `limit` and a
`purpose`; returns items plus an explicit `RedactionReport`. Two rules live in the signature itself:

1. **Category filtering happens before retrieval, not at formatting time.** Data the user did not
   authorise never enters the process.
2. **Redaction is explicit**, so the AI can say "I cannot see your finances" instead of inventing.

**Every context access is audited:** who, when, categories, item ids, purpose, model, retention
policy, consent version.

**Identity:** `kibo-id` is a **ULID**, immutable, and is never the path. The same client-generated
ULID convention is `opId` in the operation log (§5).

---

## 4 · Article 12 — residency, consent, export, DPIA

Kibo is by design a Personal OS holding health, finance, journal and habits. That is legitimate.
This section is the floor that makes it defensible. **It is a hard gate before any code touching
health, finance or journal** (`KIBO-021`).

### 4.1 Data-residency matrix

**This matrix is the Article 12 pre-condition that must exist before code. It is normative.**

| Category | Device | Kibo servers | User's vault | Third-party LLM |
|---|---|---|---|---|
| **Health** (`special`) | yes | yes | **opt-in per module** | **only under a signed DPA** |
| **Finance — amounts** (`special`) | yes | yes | **never** | **only under a signed DPA** |
| Finance — structure (accounts, categories, no figures) | yes | yes | opt-in | with consent |
| **Journal** (`special`) | yes | yes | yes | separate consent |
| Productivity (tasks, habits, projects) | yes | yes | yes | with consent |
| Resources (notes) | yes | yes | yes | with consent |
| Social (friends, shared challenges) | yes | yes | **never** — third-party data | **never** |
| Credentials / tokens | OS secure store | encrypted, never in logs | **never** | **never** |

Two notes that carry the reasoning:

- **"Finance amounts never reach the vault" is a residency rule, not a statutory one.** The vault
  leaves Kibo's control into the user's Dropbox, iCloud or git, and a figure written into a `.md`
  cannot be recalled.
- **Journal is classified `special`** although it is not in Article 12's literal list, because it
  reveals beliefs, mental health and private life. Classifying it lower would satisfy the letter and
  fail the purpose.

A further prohibition that is stronger than residency and admits no consent: **account numbers,
CLABE, PAN or last-four digits, balances, credit limits, policy numbers and credentials are never
projected to any file.** They enable fraud, not disclosure; no consent by the data subject protects
the counterparty bank.

### 4.2 The other three pre-conditions

2. **Consent is granular, explicit and revocable** — per (category × destination), never bundled
   with terms of service, never bundled across categories or destinations, nothing pre-checked, and
   withdrawal as easy as granting.
3. **Export and erasure are features, not favours** — export everything in an open format; erasure
   cascades to processors. The export is redefined as emitting a **working Obsidian vault**
   (folders, record notes, dimension notes, resolved wikilinks, `.base` files and a README of the
   convention) that opens and functions without Kibo. That is the strongest available proof of no
   lock-in, and it is verifiable in CI.
4. **A DPIA is completed and archived before launch**, redone when the processing scope materially
   changes.

**Minimum applicable law:** GDPR and Mexico's LFPDPPP; where they differ, the stricter wins.

**Blocking consequence to accept knowingly:** the DPA requirement may block AI over health and
finance **regardless of user consent** (§13, Q6).

---

## 5 · Synchronisation and offline

**Two engines, one log.** The consumers are not the same problem:

- **Mobile ↔ server is replication** — identical schema, automatic and mandatory convergence, the
  user must never be asked.
- **Server → vault and external connectors are integration** — different schemas, lossy mapping,
  occasional user intervention.

> **They do not share a convergence algorithm. They share the data model and the operation log.**

One engine satisfying both satisfies neither: it would either interrupt users because a phone lost
signal, or silently mangle a note that lost its frontmatter.

**The seam is the operation log.** Every domain mutation is an `Operation` carrying a
client-generated `opId` (ULID, hence idempotent retries), entity reference, kind, payload, `actor`
and a per-device logical clock. Replication transports it; the vault projector consumes it as a
cursored feed; external connectors consume the same feed; the audit trail derives from it. This is
event-sourcing **at the edge only** — state remains in ordinary tables.

**Replication is built, not bought — with an explicit safety net.** Kibo has three properties that
remove the hard part: **one user per record** (no concurrent collaboration, which is what makes
replication hard), **one phone and one web client** rarely touching the same record in the same
minute, and **mostly additive operations** ("completed a task", "wrote an entry") rather than
concurrent edits of long text. A general engine solves a problem Kibo barely has.

> **The client is disposable.** Local state is a **cache**, never a source of truth: if it corrupts,
> discard it and rebuild from a full server refresh. And **an operation is never removed from the
> queue until the server confirms it.**

With those two rules the worst imaginable failure stops being "the user lost three months of
journal" and becomes "the app took a while to start once". **The whole argument rests on that rule
actually holding.** The day anything lives only in the phone's SQLite and not on the server, the net
is gone — so it is an **automated test, not an intention**: wipe the local database and assert
nothing was lost. Write that test before the offline queue exists.

**Local store:** `expo-sqlite` + Drizzle as cache plus an intent outbox (or WatermelonDB).
**PowerSync remains the documented fallback**, and stays cheap to adopt later precisely because the
authoritative state and the operation log are ours.

**`sync-core` never exposes `write(path, bytes)`.** It exposes `write(entity)`, and each adapter
resolves paths inside its own confined root. The `SyncConnector` port carries
`mode: 'pull' | 'push'` from day one — provider connectors pull, the Obsidian plugin pushes. An
engine designed by looking only at a polling connector produces a poller, and push will not fit it.
`sync-core` is defined as a port now and extracted as a package only when the second connector
exists.

**Offline is built last, deliberately.** It demands the most judgement and fails worst without it.
The practical consequence: **the first Android release can be online-only.** Offline-first is the
destination, not the starting point.

---

## 6 · Economy integrity

Offline-first collides with game rules. The split is explicit:

| Optimistic offline | Requires network |
|---|---|
| Completing tasks and habits; XP, level, streak, HP loss — the client runs the same pure functions from `packages/core`, the server recalculates and silently reconciles | **Opening chests** (randomness — a client-side roll can be retried until it wins) |
| Writing notes, journal entries, tasks, consultations — content, not economy | **Store purchases** (double-spend across offline devices) |
| | **Shared challenges, scoreboards and gifts** (a second user is involved) |

> **The client may compute what is deterministic; the server decides anything involving chance,
> scarcity, or another person.**

Without this line Kibo's economy can be farmed in airplane mode. Two costs to design rather than
discover: reconciliation produces "you actually got 18 XP, not 20" moments that must be handled
without ceremony, and **chests, purchases and social features do not work offline** in an otherwise
offline-first app.

**Gamification never leaves Kibo.** XP, HP, Divisa, Elemento, levels, missions, achievements,
trophies, banners, cosmetics and chest probabilities never appear in any file (§7.3).

---

## 7 · The Markdown vault as an output

### 7.1 The reframing that governs everything here

**Kibo emits a vault; Obsidian reads it.** The vault is an **output of the system**, not a partner
and not an authoritative editor.

> **The vault has exactly one logical writer: the server's projector.**

If a client also wrote files we would reintroduce the two-writer problem through the back door. Any
local Android mirror is **download-only**: the server generates, the device materialises.

Consequences that are settled by this reframing, not open:
- Resources is edited in Kibo; the vault is its projection. There were never two editors.
- **Kibo does not rebuild a graph or an advanced editor** — that is where Obsidian is unbeatable.

**The asymmetry the integration exploits:** *Obsidian has structure without schema. Kibo has
schema.* The bridge is YAML frontmatter — each note is a record, frontmatter keys are its columns,
wikilinks are its foreign keys, and Bases (core plugin) and Dataview are query engines that already
exist. Kibo emits in the convention the ecosystem already reads, so existing plugins operate on
Kibo's data without Kibo building anything for them.

### 7.2 Ownership — by provenance, enforced per region

Write authority is assigned first by **provenance** (who originated the file), then by **region**
(which part of it). **Provenance is declared by the user, never inferred by Kibo.**

| Provenance | What it is | Kibo writes | Kibo reads | `kibo-id` |
|---|---|---|---|---|
| **`kibo`** | Record note generated by Kibo | Region K only | yes | always |
| **`adopted`** | User's own note the user promoted to a Kibo record | **Only** the frontmatter keys declared in the mapping profile. Never the body, never the path | yes | always |
| **`read`** | User's note indexed for Resources — search, backlinks, missions, XP | **nothing, zero bytes** | yes | never |
| **`foreign`** | Everything outside the granted scope | nothing | nothing | never |

`kibo` is the central case; `adopted` and `read` belong to the *import an existing vault* flow.

**Regions.** Provenance is not stable over time — the user will eventually add their own notes to a
file Kibo generated, and regenerating it would destroy them. The unit of ownership is therefore the
zone, not the file:

| Region | Owner | On regeneration |
|---|---|---|
| Declared frontmatter keys (those of the `kibo-type`) | Kibo | rewritten via `processFrontMatter` |
| Undeclared frontmatter keys the user added | User | **preserved verbatim** — never delete the unknown |
| `<!-- kibo:generated -->` block | Kibo | replaced wholesale |
| Everything else in the body | User | **untouched** — not read to decide anything, not moved, not reformatted |
| Generated block absent (the user deleted it) | User won | **not recreated.** Recorded as `generated_block: removed`; frontmatter keeps syncing |

**Consequence: three-way merge is unnecessary, even for Kibo-generated notes**, because Kibo and the
user never write the same region. No persisted merge bases, no conflict state machine, no
diff-match-patch in v1. CRDTs (Yjs, Automerge) and vector clocks are rejected with argument: a CRDT
requires storing causal history alongside the document, and a plain `.md` edited by a foreign
program has nowhere to put it.

**Bidirectionality runs through intents, not shared authority.** Ticking `- [x]` in Obsidian does not
write state; it emits `task.complete` to Kibo's rules, which validate and award XP, streak and HP.
Users perceive two directions everywhere it matters, with no field ever having two owners.

**Conflicts and deletion.** Where two versions ever exist, **both are preserved**; last-write-wins
over note bodies is prohibited. **Deletion is never propagated in v1**: a note deleted in Obsidian
marks the Kibo resource `archived`, never deleted; a resource deleted in Kibo moves the file to the
vault trash, never `unlink`, and never without a prior backup; a mass-disappearance threshold pauses
sync and asks the user.

> **Absence is never read as intent.** This is not only a defence against human error: OneDrive's
> Files On-Demand removes files locally to save space, and any filesystem reader sees phantom files.
> If the projector finds that files *it wrote* have vanished, it does not react — it rewrites them on
> the next cycle.

### 7.3 The format contract

**The contract is the product**, and it is what makes Kibo's schema legible to a vault.

**Modelling rule.** Kibo's **facts** become record notes; Kibo's **dimensions** become reference
notes; **wikilinks perform the join**. Obsidian has no joins but it has backlinks, which for a human
are better: opening `[[Naproxeno]]` and reading its backlinks *is* the query "every time this was
prescribed to me", with nothing built.

**System keys, on every file Kibo generates** — these four are the only `kibo-`-prefixed keys:
`kibo-id` (ULID, immutable, never the path), `kibo-type` (kebab-case, closed vocabulary),
`kibo-rev`, `kibo-updated` (ISO 8601 with explicit offset). Plus a stamp tag in the `kibo/`
namespace (`tags: [kibo/medical-visit]`), which lets the user select or exclude *everything Kibo
wrote* in one query. **All domain keys are unprefixed** (`date`, `doctor`, `dose`, `mood`) precisely
so Bases and Dataview treat them as ordinary user properties.

**Key conventions, fixed for the whole contract:** kebab-case, English, singular except collections ·
`YYYY-MM-DD` for dates, ISO 8601 with offset for instants · booleans are literal `true`/`false`,
never `yes`/`no`/`on`/`off` (YAML 1.1 coerces them — the *Norway problem*) · nulls omit the key,
never `null` or empty string · enums are `snake_case`, closed and documented · collections are
always a YAML list, even with one element.

**Relations are emitted twice** — in frontmatter (so Bases and Dataview can query them as a column)
and in the body (so the graph draws the edge; native backlink support from frontmatter is limited).
**Every wikilink Kibo emits uses the absolute vault path plus a presentation alias:**
`[[Kibo/Areas/Wisdom|Sabiduría]]`. Obsidian resolves `[[Wisdom]]` by proximity, and Kibo cannot know
what is in the user's vault; the long form is unambiguous in every delivery route.

**Not every record deserves a file:** record note (a file with `kibo-id`) for nouns with identity and
relations at low/medium cardinality; **record line** inside a container note for high-volume events
(tasks); **table row** in a monthly file for series and movements (vitals, financial movements);
**aggregate** inside the noun's own note for habit check-ins.

**Ecosystem conventions Kibo adopts:** YAML frontmatter using only Obsidian's native Properties
types · plural list forms for `tags`/`aliases`/`cssclasses` · Tasks-plugin emoji syntax for task
lines, anchored with a native block reference `^kibo-<id>` · filename = title · daily-note format
read from the user's setting, never imposed · HTML comments (`<!-- kibo:… -->`) as block delimiters,
not `%%…%%`, which renders literally in every other Markdown tool · **Bases is the primary target**;
Dataview compatibility comes free from clean YAML. Kibo also emits its own `.base` files under its
root, one per entity type, at ≈ zero marginal cost.

**Conventions Kibo deliberately ignores:** Dataview inline fields (`key:: value`) — read on ingest,
never emitted · Tasks' `🆔`/`⛔` for identity (they collide with the user's own dependency usage) ·
Datacore · Templater syntax · the user's own `.base` files, which Kibo never modifies.

**Folder tree rules:** one root, `Kibo/`, and Kibo never writes a byte outside it — the guarantee
that lets us say without small print *"delete this folder and your vault is exactly as it was"* ·
folder names describe content, not the data model · date partitioning only for types that grow
without a ceiling · **everything special-category under `Kibo/Private/`**, one folder the user can
exclude from git, selective sync or backup in a single gesture · hubs receive links, they do not
emit them (a project links to its area, never the reverse). **A person's note lives in the most
restrictive sub-root that links to it** — health providers therefore live in `Private/People/`, which
satisfies the rule against outbound links from special-category notes while preserving the product's
"aha": opening a doctor's note and seeing four consultations hanging off it with nothing configured.

**Never projected** — enforced by a field-level `neverProject` flag in the projection map (data, not
policy: the engine cannot emit it, not even with consent), by a forbidden-vocabulary test that fails
if any of `xp`, `hp`, `coins`, `gems`, `streak`, `balance`, `account-number`, `clabe`, `pan`… appears
in a synthetic user's full output, and by a contract-version bump on every new key:

XP / level / prestige / paragon · HP / Divisa / Elemento · streak counters, protectors, flame tiers
(**the consistency record — which days you met — is a fact and is emitted; the number Kibo computes
from it is not. Facts yes, score no**) · achievements, trophies, banners, cosmetics, wardrobe ·
chests and their probabilities · account numbers, CLABE, PAN or last four, balances, credit limits,
policy numbers, credentials · third parties' phones, emails and addresses · the social feed · raw
sensor samples (daily aggregates are emitted instead) · internal identifiers other than `kibo-id` ·
settings, notifications, sessions, audit logs.

**Contract evolution rules:** version the contract, **add only, never rename**, freeze the domain
vocabulary late, and validate in CI by opening the exported vault and checking frontmatter, types and
`.base` files. Renaming a key once users have notes on their own disks is a migration on **other
people's disks** — it runs only when each user opens Obsidian, can fail halfway, and breaks the
`.base` files and Dataview queries the user wrote on top. **This is debt whose holder does not
control it.**

**The serializer (`packages/markdown`) has no dependency on the Obsidian API.** Marginal cost of
genericity ≈ 0, and it serves any Markdown vault. **No Logseq or Silver Bullet plugins will be
built.**

### 7.4 Transport

| Transport | Status |
|---|---|
| **On-demand vault export (`.zip`)** | **Day-one floor and the v1 route.** The format is the product; the transport is an updatable detail. The bytes are identical in every route, so building this one first validates the frontmatter contract — the part that generates debt on other people's disks — **before a single user has a linked folder**. It is also already obligatory work (export-everything is an Article 12 feature), demonstrable on day one, and cannot break anything |
| **Local desktop component / Obsidian plugin** | The continuous route, delivering exactly the same bytes. **Desktop only.** The plugin is an optional complement, retained because Obsidian Sync exposes no public API, so users of the official sync are unreachable any other way |
| **Server writes to the user's cloud (Drive / OneDrive) via OAuth** | **OPEN — see §13, Q5. Do not build it on the assumption that it is approved.** ADR-0002 promoted it to primary transport; `docs/analysis/platform/07-capa-de-traduccion.md` §4.2 disqualifies it because it converts a disclosure to the data subject into a transfer to a third-party processor executed by Kibo from Kibo's infrastructure, which is the exact property that permits health to reach the vault at all |
| **Android SAF local mirror** | Secondary and download-only. Cloud providers expose content as `DocumentsProvider` rather than real files, making SAF writes there fragile; SAF grants also auto-reset after months of inactivity, so re-permission must be graceful |
| **`obsidian://` deep links** | Retained. Near-zero cost |
| **File System Access API** | One-shot import/export only. Never continuous sync — no Safari, no Firefox, no mobile; `FileSystemObserver` is desktop-only; it dies when the tab closes |
| **Local REST API plugin** | **Excluded.** 5–6 install steps before first value; desktop only; requires Obsidian running; depends on third-party code Kibo does not control |
| **Standalone local agent as a product** | **Excluded.** Code signing, notarisation, auto-update and support constitute a second product |

**The phone does not write the vault.** What is captured on mobile reaches the folder via the server
and the desktop component, next time the user opens their PC. **This must be said from the
beginning** — if product material implies direct writing from mobile, the product fails exactly where
it most needs trust.

**If the plugin is built, it is a dumb pipe.** All format knowledge lives on the server; the plugin
ships bytes, paths, hashes and vault events and executes a `WritePlan` the server already resolved.
It parses no Markdown, interprets no frontmatter, computes no game rules, calls no third party and
renders no product UI — its only pixels are one command and one settings screen. Working estimate
1,000–1,500 lines; growth well beyond that means product logic leaked in and must be returned to the
server. It is versioned by **protocol**, not by features, because Obsidian's automated review scans
**every version**. Obsidian's developer policies also forbid client-side telemetry outright:
**all product instrumentation lives in the Kibo API, none in the plugin** — write that rule into the
connector repo before its first line of code.

### 7.5 Ingesting an existing vault

A **mapping profile** declares how to recognise a record type in the user's vault and how to
translate it. It lives on the server, is versioned, and maps **values as well as keys** — translating
`médico → doctor` is worthless if `estado: completada` then fails the enum. Profiles specify
`unmapped: keep` (unmapped keys preserved in the file, stored opaquely, returned verbatim on write)
and `write_back: declared_only`.

**Adoption runs in four steps with a brake at each:** profile (read-only sampling, nothing written)
→ propose (per-field confidence; the user corrects) → dry run (applied without writing; the user
sees exactly what would change) → adopt (affirmative action; only now does a `WritePlan` exist, and
only frontmatter is touched).

Notes that are not records are never adopted — they stay `read`, indexed with zero writes. Notes
matching two profiles are always escalated. Missing required fields, ambiguous dates and out-of-enum
values are exceptions, never guesses. **Nothing ambiguous is ever applied without an approved
preview.** Un-adopting stops writing and **leaves the file exactly as it is**, `kibo-id` included —
stripping keys would be another unrequested write.

---

## 8 · The AI layer

**The AI is the organising purpose, not a feature layer**: Kibo lets the user *"hablar con su misma
información"*. It consumes the context surface defined in §3 and does not redefine it.

**The AI holds no authority.** It proposes operations that the domain engine applies only after user
confirmation, recorded as `actor: 'ai-suggested-user-confirmed'`. It never grants XP, never writes
the vault, never mutates domain state on its own, and may **propose** mapping correspondences but
never **apply** them.

**Vault and note content is untrusted input** to any LLM path (prompt-injection containment). The
containment that makes ingestion safe is structural: model output is a proposal a human confirms, not
an action.

**Commercial model — hybrid, with one sharp line.** BYOK from day one (zero marginal cost; the user
contracts the provider directly), plus a monthly quota included in Premium on Kibo's key, sized for
normal use. And critically: **Elemento buys access to the *feature*, never *tokens*.** Currency is
earned by playing; if it paid for inference, users could farm habits to pay Kibo's provider bill —
turning an infrastructure cost into a game reward.

**Special-category data never reaches a third-party LLM provider without a signed DPA** with
zero-or-minimal retention, a no-training clause and a sub-processor list. Absent that contract, the
feature does not ship — regardless of user consent.

---

## 9 · Design system and tokens

### 9.1 · Purchasable themes (AD-24)

The visual language — data-viz colour and the gamification layer — is a **customisable, sellable surface**, bought with Elemento. The mechanism is decided; what is sold and how is open (§13).

**The machine is dark mode's, on the axis dark mode leaves fixed.** AD-15 made dark mode *a second value table for the same token names*. A theme uses the same resolver, but where **mode owns the neutrals and the recipe constants, a theme owns the hues and materials** (`DESIGN-SYSTEM.md` §2.5: "the hues do not change value between themes"). Mode and theme are therefore **orthogonal dimensions of one machine** and compose — a user can hold dark mode and a bought theme at once.

**A theme is a sparse patch of INPUT tokens, never a full table.** It declares only the input tokens it changes (`Partial<TokenInputs>`, the same AD-21 authoring format); everything else falls through to the base, and every derived ink / wash / border / ramp **recomputes from the patched input through the same recipes**. So legibility on the new hue comes out by construction, and the file's fourteen derived inks are never re-authored — a full per-theme table would be exactly `ANALYSIS.md` finding 24, which AD-21 rejected. The area-recolour ruling is already this pattern: change one input, the recipes re-derive.

**Resolution cascade** (low → high precedence): base → mode (light/dark) → theme:full → theme:surface → user recolour → **derivation pass** (recipes recompute) → **functional floor**. Per token, the highest layer that declares it wins. **A theme's scope is its key-set, not a list of screens** — a theme that only patches `--kb-cat-*` only touches charts, automatically.

**Two channels, composed at the SKU, never merged.** The *palette* (colour/material/rarity as value) flows through the token resolver above. The *artwork* (currency glyphs, KIBO skins, Vitrina frames, trophy models) is SVG/Rive and flows through the existing cosmetic channel (AD-16, AD-22/23). A sold "theme" may bundle both; the resolver never carries artwork.

**Functional floor — auto-validated, the analog of the brand-hex regression grep.** Gate A: a patch whose keys are not a subset of `THEMABLE_TOKENS` fails. Gate B, on the resolved output (measured with M-1; hue in oklch): **F-1** every text ink×surface pair clears AA — auto-correct a *derived* ink by raising its mix, *reject* a theme-declared surface that fails; **F-2** the categorical chart ramp stays distinguishable, including under the three CVD simulations; **F-3** semantic hue windows hold (HP in the danger band, good in the positive band, warn amber) and **F-3b** danger and success stay separable under red-green CVD; **F-4** Divisa and Elemento hues stay apart; **F-6** a themed surface's lightness stays within the active mode's band. Validated at server packaging and re-validated on client apply, because the user's mode and recolour compose with the theme.

**Delivery: downloaded as validated data against a versioned, add-only token contract** (the §7.3 frontmatter discipline), never bundled in the binary — bundling freezes the catalogue at each mobile release, and a months-old app could not buy a new theme. This requires the token resolver (oklab mix + fluid-min) to be **extracted from the build-time generator into a runtime module shared by both clients**, so a downloaded theme resolves identically on web and Android. New requirement beyond AD-21.

**New token families this needs** (documented in `DESIGN-SYSTEM.md` as the design system documents data-viz and gamification; land in `colors_and_type.css` at standardisation): a categorical ramp `--kb-cat-1..8` (charts must stop borrowing area/priority hues ad hoc — that is what breaks when those are recoloured), a sequential ramp `--kb-seq-*`, a divergent ramp `--kb-div-*`, a flame ramp `--kb-flame-*`, the full nine `--kb-mat-*` materials (three exist), and the rarity cleanup to four independent seeds (the file still declares six and aliases the retired gem blue).

---



The diagnosis of the current design system is `docs/ANALYSIS.md` v1.1 and is not repeated here. What
is architectural:

- **The design system lives in `design-system/` in this repo** (AD-14). It is the canonical source
  for card specs and token values until `packages/tokens` generates them.
- **shadcn is retired entirely** (AD-13). `@kibo/ui` is built on the design system alone. Radix goes
  with it, which retires what today provides keyboard navigation, screen-reader semantics and modal
  focus-trapping — see §13, Q3.
- **Dark theme is IN, as a second value table for the same tokens** (AD-15). Nothing in component
  code changes; only what each token resolves to. Two binding consequences: `packages/tokens` is
  authored **with a theme dimension from the start**, and **clearing the 75 hand-written colours in
  `kbv-components.css` is promoted from *important* to *blocking*** — a hand-written colour cannot be
  re-themed.
- **Zero colour literals outside the token layer.** Non-negotiable. A regression grep for brand hex
  outside `packages/tokens` must return zero.
- **Retirement criterion** (AD-17): *if it is not used in the version of the app, it does not serve
  or add anything.* Usage in the v1 scope is the only test a class has to pass. Retirements are
  presented grouped by family, never piece by piece, because every retirement is a product decision.
- **Audit before code** (AD-18). The audit pass completes before source is touched.
- **Tokens are authored as plain TypeScript storing inputs, not outputs** (AD-21), and generate two
  outputs: CSS custom properties for web and a style object for React Native. **Values only — not
  one line of style implementation.** Fluid tokens resolve to their minimum on mobile, which is the
  correct phone value rather than an approximation.
- **KIBO is present throughout the product, on both platforms** (AD-20). It is the brand identity,
  so the mascot's survival on Reanimated/Skia is a foundations-phase question, not a later one.
- **Components are never shared between web and mobile.** Tokens are. This is the same boundary as
  §2.4 and the reason the old `packages/ui` was deleted.

---

### 9.2 · KIBO Rive asset structure (AD-27)

The go/no-go spike's result, as the spec a designer takes to the Rive editor. **The authoring invariant governs everything: no skin or colour change may alter the face; if it does, the asset is mis-authored.** That invariant is not a guideline — it is AD-23 made physical, because mood and skin reach the asset through two different runtime mechanisms.

- **Root artboard** `KIBO`, 140×150 native. Nested artboards: `Cuerpo` (translucent gel, α .55; its fill colour is a data-binding property `skinTint`), `Cara` (clipped to the body silhouette; eyes with a white pupil, the "w" mouth, cheeks — the whole mood signal, brows retired), `ManopieL`/`ManopieR` (hidden at rest), `Adorno`, and one nested artboard per live skin.
- **State machine, concurrent layers:** Idle (float + blink) · Mood (8 states; six derived from the `hp` number by threshold transitions at 90/72/55/38/20, `travieso` and `sorpresa` entered by trigger) · Travesura (squash/globo/gota/flip and the face/hand tricks, deforms body and face) · Gesto (wave/point/five/clap, brings out the manopies) · A11y (`reducedMotion` freezes idle and travesura while the artboard stays rendered — KIBO is content, not transition).
- **Inputs** (state machine): `hp` (Number), the travesura/gesture triggers, `toyEquipped` / `reducedMotion` (Boolean).
- **View model** (data binding, orthogonal, never touches `Cara`): `skinTint` (Colour, via `setRgb`), `skinType` (Enum), `accessory` (Enum — **not Image**, because runtime Image on view models is unsupported on `rive-react-native`).
- **Gel deformation:** scale + vector-path morph for keyframed travesuras; bones / mesh vertex-deform for the interactive drag ("chipote"). Both are runtime-supported on web and React Native.

**Proven vs assumed.** Proven from the runtimes' own docs: colour as data binding, the three input types, mesh/bones on both runtimes, nested artboards and concurrent layers, the Duolingo one-asset-multiplatform precedent, and the RN dynamic-image gap. Assumed until the first `.riv` exists (validate in editor + physical Android): the chipote's feel and performance, the canonical face's fidelity in Rive vectors, the asset weight (Duolingo's reference is <1 MB), and a stable workaround for the RN trigger-timing bugs.

**The roster gap this makes urgent (`KIBO-024`).** Building the React Native runtime integration — pinning `@rive-app/react-native`, wiring inputs and data binding, chasing the `#348`/`#333` timing bugs on a physical device — needs a React Native / Expo specialist the roster does not have. Creating it is Sergio's call (Art. 17.6). Until it exists, this is the project's highest-risk assumption.

---

## 10 · Security controls

Blocking controls. They are decision content because they constrain the write model itself.

| ID | Control |
|---|---|
| **KS-01** | **Declared write scope.** Whole-vault write access is rejected. Kibo root: create, replace, rename, trash, consented once at link time. Adopted notes: **only** declared frontmatter keys, never the body, never rename, never delete, consented per note or folder at adoption. Everything else: **zero writes**. The key allowlist is per profile and validated server-side, so the `WritePlan` reaching any client is already bounded |
| **KS-02** | **Absolute denylist on `.obsidian/**`** plus an extension allowlist. Writing there is code execution, not data |
| **KS-03** | **Path canonicalisation and validation before every write**: symlinks, UNC paths, alternate data streams, reserved device names, RTL override characters, NFC normalisation. Windows is a primary environment |
| **KS-04** | **No deletion from the cloud side.** Trash plus prior backup only. Absence is never read as intent |
| **KS-05** | **Conflicts preserve both versions.** Never discard bytes |
| **KS-07** | **The AI layer has no authority.** It cannot award XP and cannot write files |
| **KS-08** | **Prompt-injection containment**: vault content is untrusted input to any LLM path |
| **KS-30** | **No outbound wikilink from a special-category note to a target outside the private sub-root** — the backlink appears in the destination and reveals the association even if content never leaves |
| **D-13** | No gamification metadata in any user file |
| **D-17** | Fraud-enabling financial identifiers are never emitted, with or without consent |
| — | **No write to an adopted note may change its path or filename.** Renaming is a Kibo-root-only operation |
| — | **Three credential schemes designed together**, never one by one: browser session, mobile token (OAuth 2.0 + PKCE, rotating refresh, `expo-secure-store` backed by Android Keystore), vault-connector token |
| — | **Refresh tokens in OS secure storage**, never `AsyncStorage` |
| — | **Column-level encryption and a credential boundary by Postgres role** for special-category data |

---

## 11 · Build order and sequencing rules

**Order, not schedule.** Status and assignment live in `BACKLOG.md`.

**Infrastructure order, and why it is this order:**

1. **Schema, migrations and CRUD without gamification** — the most transferable learning, and
   everything else rests on it.
2. **REST API + validation + Better Auth** — needs step 1.
3. **One client, online-only** — either one, but *one*. Finishing one platform teaches more than
   leaving two half-done.
4. **Pure domain rules in `packages/core`** — XP enters here. Needs the pain of step 3 to understand
   why it is separated.
5. **Background jobs (`pg-boss`)** — streaks that expire at midnight. Needs step 4.
6. **The second client** — where the return on separating the domain becomes visible. Before this it
   is an act of faith.
7. **Offline: operation queue + SQLite** — **last, on purpose.** The piece that demands the most
   judgement and fails worst without it.
8. **Vault projector and connectors** — on the operation log that already exists.

**Two known frictions, stated so they are decided rather than discovered:**
- Steps 1 and 2 produce nothing demonstrable, and that is where personal projects are abandoned.
  Interleaving something visible is legitimate; **reordering has a technical cost** — doing offline
  before the domain rules exist is precisely how data gets corrupted.
- The mobile design track must start in parallel with the foundations, or it blocks the first module
  (`KIBO-020`). The highest-technical-risk piece of the platform change is the animated KIBO mascot
  and the chest ceremony on Reanimated/Skia — **prototype it in the foundations phase, do not
  discover it later** (`KIBO-019`).

**When the "which module first" question is answered** (§13, Q1), the module sequence that the
platform analysis proposes is: daily loop (habits + tasks + streak) → journal → vault projection →
web privacy centre and wide boards → health → finance → resources. Journal before health is
deliberate: daily frequency versus two events a year, and it is the right ground to debut
per-column encryption, per-category consent and receipts **before** touching a medical record.

---

## 12 · Decision log

Dated entries. The operative detail lives in the section named in each row; this log carries the
date, the alternatives, and the consequence accepted.

| id | Date | Decision | Alternatives rejected | Consequence accepted |
|---|---|---|---|---|
| **AD-01** | 2026-08-23 | **Web and Android both ship in v1.** No iOS. "Android first" only ever meant "there will be no iOS" | Web-only v1 · Android-only v1 · narrowing the web to landing/onboarding/wide-data | Screens are written twice, and that is the binding effort constraint of the project. Mitigated by feature parity (not screen parity) and one-module-complete-per-client (§2.1) |
| **AD-02** | 2026-08-08 | **Expo (React Native) for Android; Next.js for web** | Kotlin/Compose (wins SAF and maturity, loses on learning curve and three codebases) · Flutter (Dart tax paid twice, shares nothing with the web) · PWA alone (cannot write a vault folder on Android) | The mascot and chest ceremony are the risk piece; they need a spike, not faith |
| **AD-03** | 2026-08-08 | **`apps/api` is the single backend; web and mobile are equal clients** | `apps/web` keeping direct Prisma access alongside a mobile API | Every domain rule exists once. `apps/web` loses server-side data access and gains a BFF hop |
| **AD-04** | 2026-08-08 | **TypeScript end to end** | Kotlin end-to-end (a whole new language, breaks domain sharing) · Python or Go backends (zero reuse with the clients) | The backend language is decided by client reuse, not by backend merit |
| **AD-05** | 2026-08-23 | **One package list, the decomposed one** (`api-contract`, `core`, `tokens`, `markdown`, `projection`, `sync-core`, `database`, `config`) | The shorter list (`domain`, `api-client`, `markdown-vault-format`, `sync-core`) | It is the only list that contains `tokens`, which the dark-theme and Expo rulings made load-bearing; it separates the contract source from the generated client, and the format (`markdown`) from the engine (`projection`), which the other list conflates. Cost: `core` is a vaguer name than `domain`, mitigated by the written rule in §2.4. `packages/ui` is deleted; `@kibo/ui` later returns web-only |
| **AD-06** | 2026-08-08 | **Build replication with the disposable-client net; PowerSync is the documented fallback** | Buying PowerSync now · building without a net · one universal engine for replication and integration | The riskiest bet in this document. It is only defensible while the disposable-client rule holds, so that rule is an automated test |
| **AD-07** | 2026-08-08 | **Better Auth, self-hosted** | Supabase Auth or any external identity service (zero code control, users in someone else's database) · hand-rolled authentication (lowest return, highest risk) | Users, sessions and credentials live in our own Postgres. Auth concepts are learned by reading Lucia's from-scratch material, not by shipping a first implementation |
| **AD-08** | 2026-08-08 | **Supabase is not required. Any managed Postgres.** Rent Postgres *operation*, build the *schema* | Supabase as data platform · Supabase alone with Edge Functions (Kibo's rules are logic, not row policies) | No vendor coupling; four vendors to operate instead of one |
| **AD-09** | 2026-08-08 | **REST + OpenAPI, versioned in the path** | tRPC (no versioning; its contract is the type you compiled against — unacceptable with a four-month-old build in the wild; TypeScript-only clients) · GraphQL (unpaid-for overhead for two first-party clients over one model) | Slightly more ceremony than tRPC, recovered by generating types from the schema |
| **AD-10** | 2026-08-08 | **`pg-boss` for background jobs** | BullMQ (high-volume pipelines with dependency graphs; not this) · no queue | One fewer infrastructure piece: no Redis. Lower throughput ceiling than a Redis queue, irrelevant at this scale |
| **AD-11** | 2026-08-08 | **The vault is an output with exactly one writer, the server projector**; ownership by provenance, enforced per region | Strict Obsidian-first (no answer for notes that exist in Kibo before linking) · strict Kibo-first (overwrites what the user edited) · full bidirectional (makes XP writable from a text file) · partitioned truth with three-way body merge (pays for a merge engine to enable a second editor that should not exist) | Resources stops being a body editor for the user's own free notes once a vault is linked. This must be a declared mode change in onboarding, not discovered |
| **AD-12** | 2026-08-08 | **`.zip` export is the v1 delivery route**; the desktop component follows | Building the continuous transport first | The frontmatter contract — the part that generates debt on disks we do not control — is validated before any user has a linked folder |
| **AD-13** | 2026-08-23 | **shadcn is retired entirely** | Keeping shadcn for `apps/web` · retiring the styles but keeping Radix | Radix goes too, taking accessibility primitives with it. How a11y is solved is open (§13, Q3) |
| **AD-14** | 2026-08-23 | **The design system lives in `design-system/` in this repo** | Keeping it only in the design tool · a separate repo | It is versioned with the code and diffable; sync with the design tool becomes an explicit step |
| **AD-15** | 2026-08-23 | **Dark theme is IN, as a second value table for the same tokens** | Out of scope (as the retired PRD said) · a separate dark component layer | `packages/tokens` carries a theme dimension from day one, and the 75 hand-written colours become blocking. Decided at zero cost the day it was raised; deciding it later would have meant re-authoring the token layer |
| **AD-16** | 2026-08-23 | **The two currencies are Divisa (everyday) and Elemento (rare)** | Keeping "gemas" · "materia oscura" · "fragmentos" | The name is the unit and the skin is only the look, so Materia oscura, Magia, Esencia and Núcleo become skins of an Elemento instead of competing with the category — which is exactly what broke the previous name |
| **AD-17** | 2026-08-23 | **Retirement criterion: if it is not used in the app version, it does not serve or add anything** | Case-by-case aesthetic judgement · retiring nothing until a component library exists | Usage in the v1 scope is the only test. Retirements are presented grouped by family |
| **AD-18** | 2026-08-23 | **The audit completes before source is touched** | Building and auditing in parallel | Front-loads weeks with no visible product, and avoids standardising a vocabulary that is about to be retired |
| **AD-25** | 2026-08-24 | **Elemento is purchasable with real money, and that is safe because Elemento buys cosmetic and feature access, never advantage — the Habitica gem model.** The rare currency now has two provenances to one balance: earned (chests, hard challenges, the Premium quota) and bought | Elemento earned-only (caps cosmetic revenue at Premium) · making real-money buy advantage (pay-to-win, rejected by §1.1) | "Rare" shifts from *only earned* to *scarce/premium*; the fairness invariant is unchanged and is the safeguard. Cosmetic revenue becomes an independent line, not capped by Premium. `provenance` still records earned-vs-bought on every Elemento movement, so the ledger never loses which is which. Divisa→Elemento in-game conversion stays chest-only; real money is a separate acquisition path |
| **AD-27** | 2026-09-04 | **The KIBO Rive spike (`KIBO-019`) resolves GO WITH CONDITIONS: one `.riv` delivers KIBO's full behaviour on web and Android. Mood travels through the state machine; skin travels through data binding — two runtime channels, which is what makes AD-23 provable (colour is not a valid state-machine input, so it cannot touch the face). Conditions: (1) live skins are authored as nested artboards INSIDE the asset, never runtime-swapped images; (2) the interactive drag-deform ("chipote") is validated in the editor and on a physical Android device; (3) the React Native runtime is pinned and its known data-binding timing bugs are budgeted.** | A colour state-machine input (impossible — inputs are only number/boolean/trigger) · runtime image-swap for skins (unsupported on rive-react-native, breaks one-asset parity) · Lottie (no HP-derived face, no interactive inputs, forces the combinatorial pre-bake AD-22 rejected) · Skia/Reanimated or CSS-web+RN-native by hand (two implementations, kills one origin) | The mascot needs TWO binding mechanisms in each client — state-machine inputs (`hp` number, travesura/gesture triggers, `toyEquipped`/`reducedMotion` booleans) and a data-binding view model (`skinTint` colour, `skinType` enum, `accessory` enum). Live skins live inside the `.riv`, bounding its growth. The React Native integration and the `#348`/`#333` timing bugs need the RN/Expo specialist the roster still lacks (`KIBO-024`); until it exists, **RN parity is the project's highest-risk assumption**. Full asset structure in §9.2 |
| **AD-28** | 2026-09-05 | **After an honest re-evaluation of Rive against alternatives, Rive is confirmed as KIBO's runtime — the full-fidelity gel mascot — and AD-27 gains a fourth condition: the Rive-editor authoring role is staffed.** The re-check surfaced the fact AD-27 had not measured: there is no mature "AI → `.riv`" path. AI generates the static art (SVG); the interactive rig — the state machine, the HP thresholds, the mesh/bones of the gel, the colour data binding — is authored by hand in Rive's proprietary editor. The "AI generates the animations" premise therefore holds for the art, not for the interactive behaviour, and the decision accepts that trade in exchange for the full gel identity | Reanimated + SVG (the strongest code-native fit — lowest library risk, and the one where AI does generate the animation code — but the gel/*chipote* degrades to a "light KIBO") · a Rive-web + code-native-RN hybrid (two implementations that diverge, killing one origin) · Lottie (timeline playback only, no HP-derived face) | **Condition (4): the authoring role exists — a person and a flow (AI produces the SVG art → it is imported and the state machine / data binding are rigged by hand in Rive).** The animation pipeline is not AI-end-to-end; KIBO's richness depends on someone occupying the Rive-editor seat. If that role is ever dropped, the sanctioned fallback is Reanimated + SVG, with the mood≠colour boundary enforced by TypeScript types and a less gelatinous body. The AD-27 runtime risk (`rive-react-native` `#348`/`#333`, physical-Android chipote validation) is unchanged and is now owned by `mobile-engineer` |
| **AD-26** | 2026-08-24 | **Theme product model: sold per surface with cross-surface sets, composing, on a rotating-spotlight catalogue that never removes or expires stock.** In the §9.1 cascade, user recolour outranks a paid theme; the five área hues are themeable (already user-recolourable), HP and good are hard semantic anchors; silent AA correction applies to paid themes too | Whole-UI reskin (unmaintainable — every new screen re-skinned N times; unprecedented) · unbundled pieces only (reads as extractive, the Discord failure) · FOMO/expiry timers (contra *el fracaso reencauza*, the Duolingo failure) · a paid theme overriding a manual recolour (a specific user choice beats a broad theme) | Surface-scoping falls out of the token key-set (§9.1). Themes compose, so three partial themes sell where a whole-UI one would not. AA is never for sale: a bought theme that fails contrast is desaturated until it passes (F-1). HP stays danger and good stays success under CVD (F-3b) no matter the theme |
| **AD-24** | 2026-08-24 | **Purchasable themes are the dark-mode machine on the hue/material axis: a validated sparse override of INPUT tokens, resolved through the same recipes, split into a token channel and an asset channel (§9.1).** Delivered as downloaded data against a versioned add-only token contract, never bundled | A full value table per theme (re-authors the fourteen derived inks as fixed values — `ANALYSIS.md` finding 24, rejected by AD-21) · bundling themes in the binary (freezes the catalogue at each release) · pushing glyph/frame artwork through the token resolver (tokens are values, not assets) | The token package gains a third resolution dimension (name × mode × theme); the oklab resolver must ship on-device at runtime; the theme contract is an add-only public surface, versioned forever; **silent AA correction applies to paid cosmetics too** — a bought theme may render less saturated than purchased. What is sold, how it is priced, and whether Elemento is real-money-buyable stay open (§13) |
| **AD-23** | 2026-08-24 | **KIBO's mood changes only its expression; the body colour is an independent, user-customisable dimension.** Mood (derived from HP) drives the face — eye shape, pupils, mouth, brow — and nothing else. The body colour is a wardrobe choice the user owns | Keeping mood coupled to colour (the original *"el ánimo cambia el color"*, eight `--kb-mood-*` colours) — which makes the mood colours and the customisable skins fight for the same surface: a purchased blue skin could not stay blue while sad | The `--kb-mood-*` colour tokens stop being the body colour. Mood needs a **richer expression per state** than the prototype's pupil-plus-mouth, because expression now carries the whole signal that colour used to share. It makes the state machine's inputs **orthogonal** — the skin input and the mood parameter no longer touch the same layer — which is exactly what lets a bought skin keep its colour through every mood |
| **AD-22** | 2026-08-23 | **KIBO is authored as a state machine in Rive, one asset for web and Android.** The mascot stops being CSS keyframes and becomes an interactive asset the application drives through declared inputs | Keeping the CSS/DOM implementation and rewriting it natively for React Native (two implementations of the same behaviour, guaranteed to drift) · Lottie (plays a timeline; its interactivity cannot express "the face derives from HP") · Skia/Reanimated by hand (most control, and the largest amount of animation code a solo builder would own) | **The combinatorial problem is what decides it.** KIBO is 8 moods × 14 travesuras × skins × accessories × auras; animating each combination does not scale. A state machine composes them instead — Duolingo generates 64+ character variations from 8 head and 8 body animations, in a file under a megabyte, running the same asset on Android, iOS and web. The application drives declared inputs: HP is a number the mood derives from, a travesura is a trigger, a skin is a nested-artboard swap. **Accepted costs:** the mascot becomes an authored asset rather than code, so it needs a tool and someone in it, and it is versioned as a binary rather than diffed as CSS; a runtime dependency enters both clients; and `kibo-blob.css` becomes the source to translate from, not the thing that ships. `prefers-reduced-motion` still keeps KIBO and drops interface motion — the mascot is content |
| **AD-20** | 2026-08-23 | **KIBO the mascot is present throughout the product on both platforms. It is the brand identity, not a decoration** | Treating the mascot as a web-only flourish · a static mascot on mobile · a "light KIBO" v1 | The animated mascot moves from a nice-to-have to the **critical path of the platform change**: if it does not survive Reanimated/Skia, the brand does not survive the port. `KIBO-019` (the spike) is promoted accordingly and runs in the foundations phase, before any module commits to it |
| **AD-21** | 2026-08-23 | **Tokens are authored as plain TypeScript, storing INPUTS rather than outputs; two generators emit CSS custom properties and a React Native style object.** Closes Q2 | W3C DTCG JSON (buys a schema and interoperability with design tools Kibo does not use, and costs a toolchain) · literal values per theme (loses the fluid steps and turns fourteen derived inks into fourteen hand-kept values — exactly `ANALYSIS.md` finding 24) · two parallel platform sets (reintroduces by design the divergence the package exists to prevent) | A token is a literal or a **declared derivation as data** — `{mix: '--kb-coin', amount: 0.42, with: '#3D2A00', space: 'oklab'}`, `{min: 14, max: 16, vw: 2}`. Web emits the live CSS function; React Native emits the resolved value. **Fluid tokens resolve to their minimum on mobile**, which is not a shortcut: every fluid token in the system crosses its floor above 500 px, and phones are 360–430 dp, so the minimum *is* the correct phone value. The caveat is written down — a tablet or unfolded-foldable layout needs the computed value, not the floor. The generator needs one colour library (oklab mixing) and a snapshot test so the two platforms cannot drift by rounding |
| **AD-19** | 2026-08-23 | **`docs/ARCHITECTURE.md` is the single decision surface.** ADR-0001, ADR-0002 and the PRD are void and deletable | Keeping per-decision ADRs · keeping the PRD as the product spec | Detail concentrates where builders look. §14 is the record of what must not come back |

---

## 13 · Open questions

Each is a real question. None has been decided; do not build past one by assuming an answer.

**Q1 · Which core module is built first?** (`KIBO-022`)
It determines what the first vault projection and the first AI answer can even contain, and it picks
the first screen to be rebuilt on the standardized DS.
- *(a) Habits + tasks + global streak* — the platform analysis's proposal and the shortest path to
  Sergio using Kibo himself every day. Consequence: the vault projection has trivial content for
  months, and the "aha" the format promises is deferred.
- *(b) Journal* — daily frequency, and the right ground to debut per-column encryption and
  per-category consent before health. Consequence: it is a special-category module, so the Article 12
  apparatus (§4) becomes a prerequisite immediately.
- *(c) Resources* — makes the vault story real first. Consequence: it builds a capability whose
  author does not currently use Obsidian, which inverts self-use as validation.

Constrained by Q4 (a cut module cannot be first).

*(Q2, the token authoring format, is closed — see AD-21.)*

**Q3 · How is accessibility solved once Radix goes?** (`KIBO-017`)
- *(a) Headless a11y primitives under 100 %-Kibo components* — the behaviour, not one line of foreign
  style, and explicitly different from re-adopting shadcn. Consequence: a dependency returns, with a
  narrower surface.
- *(b) Implement the ARIA patterns by hand* — most control. Consequence: this is the single place a
  solo builder most reliably ships an inaccessible modal.
- *(c) Accept a reduced a11y floor for v1 and record it.* Consequence: it must be recorded as a
  dated entry here, not left implicit, and it is debt on a product that will hold health data.

**Q4 · Which of the 14 modules ship in v1?** (`KIBO-014` — module half; the platform half is settled
by AD-01)
The proposal on the table keeps Habits, Tasks and Projects, Areas, a fixed-layout Hoy, a light KIBO
and the Article 12 minimum of Cuenta, and cuts Retos, Vitrina, Amigos, Finanzas,
Salud/Estudio/Lectura/Entretenimiento and Recursos.
**Consequence to weigh knowingly: cutting Finanzas and Salud removes the whole Article 12 apparatus
from v1 — and turns Kibo v1 from a Personal OS into a gamified habit tracker. That is a
repositioning, not a trim.**

**Q5 · Does Kibo's server ever write to the user's cloud storage (Drive / OneDrive) via OAuth?**
This is the one genuine conflict between the two source ADRs and the platform analyses, and it is
**not** an implementation detail.
- *(a) Yes, as the primary transport* — the lowest-friction route, the only one that works without
  the phone and PC being on at once, and it also serves Logseq, Zettlr, VS Code and plain Explorer.
  Consequence: the act stops being a disclosure to the data subject and becomes **a transfer to a
  third-party processor executed by Kibo from Kibo's infrastructure**, which is the exact property
  the permission to write health data to the vault rests on. It reopens the health analysis entirely,
  and Kibo would custody an OAuth credential to the user's **whole** Drive, multiplying the blast
  radius of a breach.
- *(b) Never* — `.zip` first, desktop component after. Consequence: no continuous sync for users
  without a desktop, and the "your vault, everywhere" promise must be worded carefully from day one.
- *(c) Yes, but only for non-special categories*, with health and finance excluded from the cloud
  route by residency. Consequence: two projection targets with different category filters, and the
  user-facing explanation of why some notes appear and others do not.

**Until this is answered, §7.4 stands: `.zip` is the v1 route and the cloud connector is not built.**

**Q6 · Does the AI see health and finance in v1?**
Depends entirely on obtaining a DPA with zero-or-minimal retention, a no-training clause and a
sub-processor list. If the answer is no, the product promise narrows exactly where it promised most —
better known before designing the experience than after.

**Q7 · Does Kibo store note bodies on its servers, or run in metadata-only mode?**
Metadata-only means holding ids, links and hashes while bodies are opened via deep link. **This
changes the schema and must be decided before schema work**, which is step 1 of §11. Storing vault
content Kibo has read is the largest unresolved exposure in the design.

**Q8 · Is the write scope widened for adopted notes, or is adoption restricted to notes the user
first moves into the Kibo root?**
Widening moves the perimeter from "one folder" to "one list". Restricting keeps a single perimeter at
the cost of asking users to reorganise their vault — exactly the kind of demand that gets
integrations uninstalled. **De-escalated but not closed**: adoption is no longer the central case, so
this only becomes urgent when the import-an-existing-vault flow is built.

**Q9 · In adopted notes: all three anchor keys (`kibo-id`, `kibo-type`, `kibo-rev`) or only
`kibo-id`?** Three buy Bases filtering and cheap drift detection; one is more discreet. Cheap either
way, but it is a public compatibility surface, so it is add-only afterwards.

**Q10 · Vault folder language: English or Spanish?**
The tree is currently written in English while Kibo is es-MX first. **This must be decided before the
first release**, because renaming folders afterwards is a migration on other people's disks that runs
only when each user regenerates, can stop halfway, and breaks the Dataview queries the user wrote on
top. The frontmatter **keys stay in English regardless** — they are technical vocabulary and their
stability is worth more than their readability.

---

## 14 · Retired — do not revive

Recorded so nothing on this list comes back through a stale document.

**From the PRD:**
- **"Native apps are out of scope"** — void. Android is a first-class client (AD-01).
- **"Dark theme: decided, not built, out of scope"** — void. Dark theme is in (AD-15).
- **Phase F1, "Kibo product UI inside Obsidian"** (sidebar streak, HP, daily habits, writing XP) —
  **cancelled, not deferred.** Kibo does not live inside Obsidian. No Kibo product UI will ever be
  rendered inside a vault application.
- **Phase F2, "bidirectional mirror of Resources via Local REST API or a local agent"** — void on two
  counts: the transport is excluded (§7.4) and the direction is wrong. The vault is an output.
- **Phase F0, "already covered by design"** — it was covered in a mockup outside the repo, never in
  code. The claim is retired; §11 is the order of record.
- **"Obsidian as an acquisition channel"** — retired. Compatibility is a feature for Kibo users, so
  the risk "the Obsidian community may not adopt gamification" is no longer decisive.
- **"Last-write-wins plus a backup" for vault conflicts** — retired and prohibited (KS-05).
- **"≥ 25 % of Resources users with a linked vault at 90 days"** — retired: no basis, ambiguous
  denominator.
- **The names "gemas", "materia oscura" and "fragmentos" as balances** — retired (AD-16).

**From ADR-0001:**
- **The Obsidian plugin as primary transport** — downgraded to an optional complement. `.zip` is the
  v1 route (AD-12).
- **"Kibo writes zero bytes by default"** — withdrawn. Kibo does write: it generates record notes.
  What it never does is rewrite what the user wrote.
- **Ownership per field** — replaced by provenance, refined by region (AD-11).
- **`kibo-id` as opt-in** — replaced by mandatory-by-provenance. Consent moved from the YAML key to
  the relationship with the note, which is *more* restrictive, not less. "Zero-footprint mode" still
  exists: adopt nothing, leave everything `read`.
- **"Health never to the vault"** — replaced by opt-in per module, with finance amounts prohibited
  unconditionally (§4.1).
- **Open decision "does Resources stop being a body editor?"** — resolved by the reframing: if the
  vault is an output, it is not an authoritative editor, so there were never two editors.
- **Open decision "streak counters in habit frontmatter?"** — resolved by the projection exclusion
  list: **facts yes, score no.** The consistency record is emitted; the computed streak is not.

**From ADR-0002:**
- **"Auth: Supabase Auth. We will not build authentication."** — a residual line contradicted within
  the same document. **Better Auth, self-hosted, is the decision** (AD-07). No external identity
  service holds Kibo's users, and RLS-as-second-line-of-defence built on a Supabase JWT goes with it.
- **Supabase as the data platform** — withdrawn (AD-08).
- **PowerSync as the recommendation** — demoted to documented fallback (AD-06).
- **"Narrow the web to landing, onboarding and wide data"** — withdrawn (AD-01). What survives is the
  fact underneath it: screens are written twice.
- **`packages/domain` / `api-client` / `markdown-vault-format` as package names** — superseded by
  AD-05.

**From the analyses** (the files stay as evidence; these positions do not):
- `platform/01` §1.4, §2.4, §3.2 and `platform/05` — they still recommend Supabase, PowerSync and
  narrowing the web. All three are withdrawn. A reader who opens them gets the wrong stack
  (`KIBO-012` marks them).
- `platform/07` §2.1's example shows `kibo-id` as a UUID. **`kibo-id` is a ULID.** The example is
  wrong, the decision is not.

---

## 15 · References

**Living documents (Art. 5)**
- `docs/ANALYSIS.md` — the design-system diagnosis. What is wrong today, with evidence.
- `docs/ARCHITECTURE.md` — this document. How it is built and why.
- `docs/DESIGN-SYSTEM.md` — the recipe for building the interface in brand. Not yet written.
- `docs/EXECUTIVE.md` — not yet written.
- [`BACKLOG.md`](../../../../BACKLOG.md) §"Kibo — Personal OS" — all work items and status (Art. 13).

**Evidence, retained (not authority)**
- `docs/analysis/platform/06-stack-propio.md` — buy-vs-build against the learning criterion; the
  corrective delta over `01` and `05`.
- `docs/analysis/platform/02-stack-y-monorepo.md` — the monorepo decomposition, Metro/pnpm, mobile
  local database, and the Android vault-writing finding.
- `docs/analysis/platform/07-capa-de-traduccion.md` — the full folder tree, the per-type frontmatter
  contract, the projection exclusion list and its enforcement, idempotency and rewrite rules.
- `docs/analysis/platform/01`, `03`, `04`, `05` and `docs/analysis/obsidian/**` — background;
  `01` and `05` carry retired positions (§14).

**Void as of v1.0 (deleted)**
- `docs/adr/0001-obsidian-integration.md` · `docs/adr/0002-kibo-platform-architecture.md` ·
  `docs/product/PRD-kibo.md`.

**Governing**
- `constitution.md` — Art. 3 (agent-side hygiene, explicitly not a product limit), Art. 5 (living
  documents), Art. 7 (language), Art. 9 (least privilege), **Art. 12** (products processing personal
  data), Art. 13 (central backlog), Art. 15 (release gate), Art. 16 (no hardcoded environment
  configuration).

---

End of ARCHITECTURE.md · v1.6
