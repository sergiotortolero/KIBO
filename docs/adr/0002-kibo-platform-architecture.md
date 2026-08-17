# ADR-0002: Kibo platform architecture — personal context store on an owned TypeScript stack

| Field    | Value |
|----------|-------|
| Status   | **Proposed** |
| Date     | 2026-08-08 |
| Revised  | 2026-08-08 (stack scope correction) |
| Deciders | Sergio Tortolero |
| Project  | Kibo |

## Revision note — 2026-08-08, stack scope correction

Sergio corrected two premises this ADR relied on. **Only components 1 and 4 change; the rest of the ADR stands.**

| Correction | Effect |
|---|---|
| **"Android first" meant "there will be no iOS"**, not "before the web". Web and Android are equal targets | The recommendation to narrow the web is **withdrawn** (component 1). The fact underneath it — screens are written twice — is unchanged, so it is replaced by *feature parity, not screen parity*, and by building a module complete on one client before porting it |
| **Learning is a stated requirement**, not a residue: *"sé que Supabase me puede ayudar a eliminar la capa del backend, pero justo por eso quiero aprender"* — plus absolute control of the code and a stack reusable across Android, web and backend | Buy-vs-build is re-evaluated **per piece** against a new criterion (component 4). Supabase Auth and PowerSync are both withdrawn as recommendations |

**The round-3 argument was not reversed by deference.** Writing an offline-first replication engine as a solo developer remains the fastest route to silent data corruption. What changed is the criterion — and, on closer analysis, the difficulty of Kibo's actual problem. Full reasoning: `docs/analysis/platform/06-stack-propio.md`.

## Context

### What changed

Three rulings by Sergio reframed the project from "a web app that integrates with Obsidian" into "a personal operating system with several access surfaces":

1. **Kibo is a Personal OS** — *"va a conocernos de pe a pa"*. Health and personal finance are core modules, not periphery.
2. **"Android first" means there will be no iOS** — Android and web are equal targets — and Windows only *"if it adds value and is prudent"*. This **widens** the master context v1.0 premise of desktop-web-first with a 1280px minimum viewport: the web is not demoted, the phone is added.
3. **Kibo emits a vault; Obsidian reads it.** In his words: *"que el mismo Kibo nos genere una estructura que pueda interpretar Obsidian"*. The vault stops being a partner and becomes an **output of the system**.

4. **Learning is a requirement, not a residue**, alongside absolute control of the code: *"sé que Supabase me puede ayudar a eliminar la capa del backend, pero justo por eso quiero aprender"* — with a stack reusable across Android, web and backend *"en la medida de lo posible"*. This makes buy-vs-build a per-piece judgement rather than a default (component 4).

Two further facts frame the decision:
- **The vault will live in a cloud-synced folder** on Sergio's Windows machine (iCloud, Google, OneDrive — unspecified).
- **The AI is the organising purpose, not a layer**: Kibo should let the user *"hablar con su misma información"* — notes, goals, tasks — with full personal context.

### The enabling amendment

The workspace constitution was amended to **v1.7** specifically to unblock this. **Article 3** was narrowed to agent-side data hygiene and now states explicitly that it may never be cited as a product limitation; the new **Article 12** governs what a product Sergio builds may store and process. Article 12 is a *floor*, and it is strict: a data-residency matrix in an ADR before code, no special-category data to third-party LLM providers without a signed DPA with zero-or-minimal retention and a no-training clause, granular and revocable consent, export and erasure as features, a DPIA before launch, and GDPR + Mexico's LFPDPPP as the minimum applicable law.

### Why decide now

**Nothing is built.** The repo has 5 commits, no migrations, no CI and no domain entities; the Claude Design mockup covers desktop web only. There is no code investment to protect, so this ADR can recommend without negotiating with the past — and must, because client strategy, the write path and the data-category model are all expensive to reverse once users exist.

### The thesis that orders everything

> **Kibo is not an app with AI. It is a personal context store with access surfaces.** The Android app is one surface. The web is another. The Markdown vault is a third. The AI is a fourth. None of them is the system.

If that is true, the artifacts that must be right are not the screens: they are the **uniform data envelope, the operation log, and per-category access control**. Everything else is a consumer.

Full reasoning, weighted criteria and cited evidence: `docs/analysis/platform/01-arquitectura-plataforma.md`.

## Decision

**We will build Kibo as a personal context store on a fully owned TypeScript stack: an Expo Android app and a Next.js web app as equal clients with no iOS, a single domain service as the sole writer, buy-vs-build decided per piece against what it teaches and what its failure costs, and the Markdown vault as one output among several.**

Seven inseparable components.

### 1 · Clients — Expo for Android and Next.js for web as equal targets, no iOS, no Windows app

**Expo (React Native)** for Android; **Next.js** for web; a pnpm + Turbo monorepo sharing `packages/domain`, `packages/sync-core`, `packages/markdown-vault-format` and `packages/api-client`.

Expo wins on the two heaviest criteria — speed for a solo developer with a React background, and cost of maintaining N clients — while still covering the vault requirement: `expo-file-system` exposes a `StorageAccessFramework` namespace for SAF URIs, supported inside the `File`/`Directory` classes since SDK 54. Kotlin/Compose wins on filesystem access and loses everything else (three codebases, full learning curve). Flutter charges the Dart tax twice, since it shares nothing with the Next.js web. A PWA alone cannot write a vault folder on Android at all.

**Code sharing between React Native and web is logic, not interface.** Screens are written twice. That fact is unchanged, but the conclusion drawn from it in the first draft — narrowing the web — was based on the mistaken reading of "Android first" and is withdrawn. Web and Android are **equal targets; iOS does not exist.** The replacement rules:

> **Feature parity, not screen parity.** Each platform expresses the same capabilities in its own idiom — a wide timeline on the web is a list on the phone; quick capture on the phone is a form on the web.
>
> **One module complete on one client before porting it.** Never two clients at 50%.

Nothing leaves the product scope; this governs build sequence, not feature set.

**Absent iOS, Expo loses one of its main arguments** (covering both stores), which makes Kotlin/Compose more defensible than before. It still loses, and on Sergio's own stated criterion — see component 4.

### 2 · Synchronisation — two engines, one log

The three consumers are not the same problem. **Mobile ↔ server is replication** (identical schema, automatic and mandatory convergence, the user must never be asked). **Server → vault and RF-08 are integration** (different schemas, lossy mapping, user intervention sometimes required).

**They will not share a convergence algorithm. They will share the data model and the operation log.**

> **Keep the two engines apart, whoever writes them.** Writing an offline-first replication engine — logical clocks, convergence, network partitions — is among the hardest problems in the field, and that risk is real regardless of who takes it on; see component 2 for the net that makes building it defensible here. The integration engine has no library at all, because it is domain-specific — and it is already designed in ADR-0001.

The seam is the **operation log**: every domain mutation is an `Operation` carrying a client-generated `opId` (ULID, hence idempotent retries), entity reference, kind, payload, `actor` and a per-device logical clock. Replication transports it; the vault projector consumes it as a cursored feed; the RF-08 connectors consume the same feed; the audit trail derives from it. This is event-sourcing at the edge only — state remains in ordinary tables.

**Replication engine: built, not bought — with an explicit safety net.** This revises the first draft, which recommended PowerSync.

The round-3 disjunction was framed badly ("PowerSync or write a replication engine"). Kibo has three properties that remove the hard part: **one user per record** (no concurrent collaboration, which is what makes replication hard), **one phone and one web client** rarely touching the same record in the same minute, and **mostly additive operations** ("completed a task", "wrote an entry") rather than concurrent edits of long text. A general engine solves a problem Kibo barely has.

What Kibo needs is what component 2 already specifies: the operation queue with idempotent `opId` plus an authoritative server. The safety net that makes building it responsible:

> **The client is disposable.** Local state is a **cache**, never a source of truth: if it corrupts, discard it and rebuild from a full server refresh. And **an operation is never removed from the queue until the server confirms it.**

With those two rules the worst imaginable failure stops being "the user lost three months of journal" and becomes "the app took a while to start once" — which moves this piece out of the irreversible quadrant. Local store: SQLite via `expo-sqlite` + Drizzle, or WatermelonDB. **PowerSync remains a documented fallback**, and stays cheap to adopt later precisely because the authoritative state and the operation log are ours.

### 3 · Economy — optimistic where deterministic, server-authoritative where not

Offline-first collides with game rules. The split is explicit:

| Optimistic offline | Requires network |
|---|---|
| Completing tasks and habits; XP, level, streak, HP loss — the client runs the same pure functions from `packages/domain`, the server recalculates and silently reconciles | **Opening chests** (randomness — a client-side roll can be retried until it wins), **store purchases** (double-spend across offline devices), **shared challenges, scoreboards and gifts** (a second user is involved) |
| Writing notes, journal entries, tasks, consultations — content, not economy | |

**The client may compute what is deterministic; the server decides anything involving chance, scarcity, or another person.** Without this line Kibo's economy can be farmed in airplane mode.

### 4 · Topology — buy-vs-build decided per piece, with learning as a criterion

Learning is a stated requirement, so buy-vs-build is decided against two axes, not one: **what does building it teach that Sergio needs to know**, and **what happens when it goes wrong** — because some failures teach (it breaks, you fix it) and some are silent and irreversible (leaked credentials, corrupted data nobody sees until a user loses three months of journal). "Transferable" is concrete here: Sergio is a PM at a data consultancy, so data modelling, SQL, migrations, queues and idempotency serve him at work on Monday; logical clocks and CRDT convergence do not.

| Piece | Verdict | Rationale |
|---|---|---|
| **Schema and migrations** | **BUILD** | The most transferable learning in the stack; failure is recoverable from backups |
| **Background jobs** | **BUILD**, with `pg-boss` | Teaches queues, retries, idempotency and cron — transferable; failure is a retry. `pg-boss` runs on the Postgres already present via `LISTEN/NOTIFY` with **no Redis**, teaching the same lessons with one fewer moving part. BullMQ is for high-volume pipelines with dependency graphs — not this |
| **Offline replication** | **BUILD, with a net** | See component 2 |
| **Authentication** | **Self-hosted library** — neither external service nor hand-rolled | Failure is catastrophic and subtle, and the concepts are learned just as well by integrating |
| **Postgres operation** (backups, patches, HA) | **RENT** | Teaches nothing about the product |
| **File storage** | **RENT** an S3-compatible store; write the pre-signed-upload logic himself | Half a day of learning, then nothing |
| **Push notifications** | **FCM** | No decision to make: Google owns the channel on Android |
| **Observability** | **RENT** | Building it teaches little; *using* it teaches a great deal — reading a production stack trace |

**Three of eight are built, and they are exactly the three with the highest transferable learning.**

**Authentication: Better Auth, self-hosted.** The first draft recommended Supabase Auth — an external service with zero code control and users in someone else's database, which is the opposite of what Sergio asked for. But the alternative is not hand-written cryptography: a self-hosted library keeps users in **our own Postgres** with full control of code and data. Better Auth became the successor to Auth.js in early 2026 and is where active development continues (v1.6, May 2026); it ships `@better-auth/expo`, which handles the mobile-specific problems (no `document.cookie`, OAuth via the system browser, secure storage). Starting a new project on NextAuth in 2026 is not recommended, and the repo's existing Auth.js scaffold is cheap to migrate now. Separately: **Lucia was deprecated as a library in March 2025 and reframed as a learning resource for implementing sessions from scratch** — which resolves the tension exactly, since Sergio can learn authentication from Lucia and ship on Better Auth without betting his users' accounts on a first implementation.

**Supabase is no longer required.** With Better Auth handling identity, its main argument disappears; any managed Postgres (Neon, Railway, Fly, RDS) serves equally and avoids coupling to one vendor. The distinction that the first draft blurred: **renting Postgres *operation* costs no learning; writing the *schema* is where all the learning is.**

Unchanged from the first draft:
- **A single domain service** (`apps/api`, NestJS) as the **only writer** of domain and game tables. NestJS is retained deliberately: its ceremony is *scaffolding* for someone learning — it imposes an organisation rather than leaving one to be invented — and it is already in the repo. Switching frameworks teaches nothing. Reconsider (Fastify + Zod, or Hono) only if he is fighting Nest's ceremony instead of his domain.
- Clients **read via replication** and **write via the Write API**. Never the reverse.
- **`apps/web` holds no business logic.** With a first-class mobile client it is a client, exactly like the phone. Putting the API in Next.js route handlers would couple a contract that installed apps depend on to a frontend framework's lifecycle.

**Language: TypeScript end to end**, backend included. This is the decision Sergio's own criterion settles — *"una tecnología que podamos reutilizar en la medida de lo posible"*: any non-TypeScript backend destroys `packages/domain`, the only place where server, web and Android genuinely share code. Kotlin end-to-end would be more defensible now that iOS is out, but it is a whole new language; Python would serve him at work yet shares nothing with the clients. What is actually shared: domain entities and pure rules, `sync-core` types, the vault format package, contract types generated from OpenAPI, and the same Zod schemas validating on both sides. What is not: screens, navigation, styling, gestures.

**Build order matters as much as the choices.** Schema → API and auth → one client, online-only → pure domain rules → background jobs → the second client → **offline last** → vault projector. Offline is deliberately last: it demands the most judgement and fails worst without it. The practical consequence: **the first Android release can be online-only.** Offline-first remains the destination, not the starting point.

**API style: REST + OpenAPI, versioned in the path (`/v1/`).** The decisive argument is specific to installed apps: **a mobile app lives for months on old versions in people's phones.** tRPC has no versioning — its contract is the type you compiled against — which is harmless on web, where you always serve the latest, and unacceptable with a four-month-old build in the wild. tRPC additionally requires TypeScript clients and would not extend to a future Swift or Kotlin client. GraphQL is rejected as overhead: it solves many clients with divergent data needs, and we have two first-party clients over one model. Types are generated from the OpenAPI schema into `packages/api-client`, recovering most of tRPC's ergonomics without losing versioning. Note that **most reads never touch the API** — they hit the local SQLite replica — so the API surface is mostly mutations, and REST is more than sufficient.

**Auth: Supabase Auth.** One JWT for web and mobile; the domain service validates it; RLS uses the same subject as a second line of defence. Refresh tokens in OS secure storage (`expo-secure-store`), never `AsyncStorage`. **We will not build authentication.**

### 5 · The vault as an output, with exactly one writer

> **The vault has exactly one logical writer: the server's projector.**

If the mobile client also wrote files we would reintroduce ADR-0001's two-writer problem through the back door. Any local Android mirror is **download-only**: the server generates, the device materialises.

**Transport ranking is revised.** The plugin won round 1 on three grounds, and all three have lapsed: mobile reach (Kibo now has its own Android app), native rename events (they matter only while the vault is a source of truth — it is now an output, so a rename is cosmetic and Kibo regenerates from its own store), and `fileManager.renameFile` rewriting wikilinks (that matters when Kibo renames the *user's* files; in a projected vault the files and links are Kibo's).

| Transport | Round-3 verdict |
|---|---|
| **Cloud connector** — server writes to the user's Dropbox / Drive / OneDrive | **PRIMARY.** The only route that serves Sergio's stated scenario without his phone and PC being on simultaneously: the server writes to the cloud, the user's sync client materialises it on Windows, Obsidian reads it. It also serves Logseq, Zettlr, VS Code or plain Explorer |
| **On-demand vault download** (ZIP) | Day-one floor, zero cost |
| **Android SAF local mirror** | Secondary. Cloud providers expose content as `DocumentsProvider` rather than real files, making SAF writes there fragile; SAF grants also auto-reset after months of inactivity |
| **Obsidian plugin** | **Downgraded to optional complement.** Retained because Obsidian Sync exposes no public API, so users of the official sync are unreachable by the cloud connector |
| `obsidian://` deep links | Retained |
| File System Access API · Local REST API · local agent | Unchanged from ADR-0001: import/export only, and excluded, respectively |

**A verified platform hazard reinforces an existing control.** OneDrive's Files On-Demand removes files locally to save space; Obsidian's own documentation warns that its Sync reads this as deletion and removes the notes. Any filesystem reader therefore sees phantom files. **ADR-0001's KS-04 / D-9 — never propagate deletions — turns out to be the defence against a real platform failure, not only against human error.** Derived control: if the projector finds that files *it wrote* have vanished, it does not react — it rewrites them on the next cycle. Absence is never read as intent.

### 6 · The context store — uniform envelope, filtered retrieval, audited access

Every domain entity must be viewable through one shape, or the AI needs N integrations and the product is ten apps behind one login. The `ContextItem` envelope carries `id`, `userId`, `type`, **`category`**, **`sensitivity`**, `occurredAt`, `recordedAt`, `title`, optional `body`, typed `attributes`, `links[]` and **`provenance`**.

Three non-negotiable properties:
- **`category` and `sensitivity` are first-class**, not labels added later — they are what makes Article 12 enforceable at runtime rather than in a document.
- **`links[]` is the same graph the vault emits as wikilinks** (ADR-0001: facts become record notes, dimensions become reference notes, wikilinks perform the join). One graph, two representations.
- **`provenance` separates what the user said from what the AI inferred.** Without it, within months nobody can tell which part of the "personal context" is real. It is the hardest contamination in the system to reverse.

The query surface takes `categories`, `timeRange`, `types`, `entities`, `text`, `limit` and a `purpose`, and returns items plus an explicit `RedactionReport`. Two rules live in the signature itself: **category filtering happens before retrieval, not at formatting time** — data the user did not authorise never enters the process; and **redaction is explicit**, so the AI can say "I cannot see your finances" instead of inventing.

**Every context access is audited**: who, when, categories, item ids, purpose, model, retention policy, consent version. **The AI holds no authority** (ADR-0001 KS-07): it proposes operations that the domain engine applies only after user confirmation, recorded as `actor: 'ai-suggested-user-confirmed'`. It never grants XP, never writes the vault, never mutates domain state on its own.

**Data-residency matrix (Article 12 requirement):**

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

Two notes. **"Finance amounts never reach the vault" survives the constitutional amendment** but its justification changes: it is no longer Article 3 (now scoped to agents) but **residency** — the vault leaves Kibo's control into the user's Dropbox, iCloud or git, and a figure written into a `.md` cannot be recalled. **Journal is classified `special`** although it is not in Article 12's literal list, because it reveals beliefs, mental health and private life; classifying it lower would satisfy the letter and fail the purpose.

**AI commercial model — hybrid, with one sharp line.** BYOK (bring your own key) from day one: zero marginal cost, and the user contracts the provider directly. A monthly quota included in Premium, on Kibo's key, sized for normal use. And critically: **gems buy access to the *feature*, never *tokens*.** Gems are earned by playing; if gems paid for inference, users could farm habits to pay Kibo's provider bill — turning an infrastructure cost into a game reward.

### 7 · Windows — PWA, not a native app

**No installable desktop app, now or foreseeably. Yes to an installable PWA from the web.**

The web already covers Windows; a desktop shell around the same web adds an installer, mandatory code signing, an auto-update channel and a support surface while adding **no capability**. The one capability it would add — writing the vault to a local folder — is already delivered by the cloud connector, since the user's own sync client materialises the folder on disk. An installable PWA delivers most of what people mean by "Windows app" (icon, own window, direct launch, offline cache) at zero additional maintenance.

**Explicit criteria to reopen**, so it is not reopened by enthusiasm: a genuine OS capability the web cannot provide (global hotkeys, real filesystem watching, tray integration, launch at startup), **or** measured demand for a local vault without cloud. If reopened, **Tauri, not Electron**: a minimal Tauri v2 app is under 600 KB and a typical one 3–15 MB against Electron installers of 50–150 MB, with differential updates and signature verification built in. The cost is Rust in a React developer's toolchain — acceptable only once the decision is justified on other grounds.

## Options Considered

**Clients** (weights: React-fit 30%, N-clients cost 20%, offline 20%, Android SAF 15%, maturity 15%):

1. **Expo — 4.50 — chosen.** Best React-fit, one language with the web, SAF available, strongest offline ecosystem.
2. **React Native bare — 4.00.** Same model, less resolved; Expo dominates it without giving anything up.
3. **Flutter — 3.55.** Strong runtime and maturity, but Dart is a new language *and* shares nothing with the Next.js web.
4. **PWA alone — 3.50.** Cannot write a vault folder on Android. Remains valid *as the web*, which is a different role.
5. **Kotlin/Compose native — 2.55.** Wins SAF and maturity, loses the two heaviest criteria: full learning curve and three codebases.

**Synchronisation:**

1. **One universal engine for all three consumers** — rejected. Replication demands silent automatic convergence; integration demands lossy mapping, ownership policy and occasional user intervention. One engine satisfying both satisfies neither: it would either interrupt users because a phone lost signal, or silently mangle a note that lost its frontmatter.
2. **Buy replication (PowerSync)** — chosen in the first draft, now the **documented fallback**. Removes the hardest correctness problem from our code, but conflicts with the stated learning requirement, and on closer analysis solves a general problem Kibo barely has (one user per record, two clients, additive operations). Stays cheap to adopt later because the authoritative state and log are ours.
3. **Build replication with the client-is-disposable net — chosen.** Local state is a cache; operations stay queued until the server confirms. This is what moves the piece out of the irreversible-failure quadrant and makes building it defensible rather than reckless.
4. **Two engines sharing model and log — chosen** (unchanged).

**Backend and buy-vs-build:**

1. **Supabase alone with Edge Functions** — rejected. Kibo's rules (compound XP, chests with randomness, streaks, HP, anti-cheat, shared challenges) are logic, not row policies, and Edge Functions are an awkward home for them.
2. **Supabase as data platform + domain service** — chosen in the first draft, now **withdrawn**. With Better Auth self-hosted, Supabase's main argument (Auth) disappears, and it coupled the project to one vendor for no remaining benefit.
3. **Hand-rolled authentication** — rejected. The lowest-return, highest-risk thing a solo developer can build, and the concepts are learned just as well by integrating a library and reading Lucia's from-scratch guide.
4. **Managed Postgres (vendor-agnostic) + self-hosted Better Auth + single domain service — chosen.**

**Language:** TypeScript end-to-end **chosen**; Kotlin end-to-end rejected (whole new language, and it breaks `packages/domain` sharing with the web); Python or Go backends rejected (zero reuse with the clients, which contradicts the stated reusability requirement).

**API style:** REST + OpenAPI **chosen**; tRPC rejected on client versioning and TypeScript-only clients; GraphQL rejected as unpaid-for overhead.

**Windows:** PWA **chosen**; Tauri deferred behind explicit criteria; Electron rejected on bundle size and maintenance.

## Impact on ADR-0001

ADR-0001 is **not superseded**. It remains the authority on the vault format contract, provenance and regions, conflict policy and security controls. Three amendments follow from this ADR and should be applied when ADR-0001 next moves state — **this ADR does not edit it**:

| ADR-0001 decision | Effect |
|---|---|
| **Obsidian plugin as primary transport** | **Downgraded to an optional complement.** Retained only because Obsidian Sync has no public API |
| **Cloud connector as "transport 2, future ADR"** | **Promoted to primary transport** |
| **Open decision #1 — "does Resources stop being a body editor?"** | **Resolved by the reframing.** If the vault is an output, it is not an authoritative editor, so there were never two editors. Resources is edited in Kibo; the vault is its projection |
| Provenance (`kibo` / `adopted` / `read` / `foreign`) | **Retained but reordered.** `kibo` becomes the central case; `adopted` and `read` are now the *import an existing vault* flow rather than the main scenario |
| Regions (declared frontmatter, generated block, user zone) | **Unchanged** |
| KS-01 widening for adopted notes | **De-escalated.** With adoption no longer central, the widening escalated in round 2 stops being urgent |
| "Finance never to the vault" | **Retained, with a new justification**: residency rather than statute |
| "Health opt-in per module" | **Ratified formally** by constitution v1.7 |
| Frontmatter contract | **Retained and more important**: it is the external representation of the context envelope |
| KS-04 / D-9 — never propagate deletions | **Retained and reinforced** by OneDrive Files On-Demand |

## Consequences

**Positive**

- One authoritative writer for domain state, one for the vault; anti-cheat and offline solved by the same mechanism.
- Building replication teaches sync, conflicts and idempotency while the disposable-client rule keeps the worst failure recoverable — and PowerSync remains a cheap fallback because the authoritative state and log are ours.
- Users, sessions and credentials live in our own Postgres, under our own code, with no per-user vendor billing.
- Three of eight infrastructure pieces are built, and they are the three that transfer directly to Sergio's work at TIBS.
- Article 12 becomes enforceable at runtime through `category` and `sensitivity` rather than existing only in a document.
- The cloud connector serves Sergio's stated scenario and, incidentally, every non-Obsidian Markdown reader.
- Buying auth, managed Postgres and replication concentrates solo-developer effort on the only thing nobody can supply: the domain.
- REST + OpenAPI keeps months-old installed builds working while the server evolves.
- No Windows app means no installer, no signing, no update channel, no support surface.

**Negative / trade-offs**

- **Screens are written twice.** Logic is shared; UI is not. With web and Android as equal targets, this is now the binding effort constraint.
- **Building replication is the riskiest bet in this ADR**, and the whole argument rests on the disposable-client rule actually holding. The day anything lives only in the phone's SQLite and not on the server, the net is gone. This must be an automated test — wipe the local database and assert nothing was lost — not an intention.
- Buying less means operating more: managed Postgres, S3-compatible storage, FCM and error tracking are still four vendors to configure and monitor.
- The learning-ordered build sequence puts schema and API first — weeks that produce nothing demonstrable, which is where personal projects are most often abandoned.
- The optimistic/authoritative economy split adds reconciliation logic and a class of "you actually got 18 XP, not 20" moments that must be handled without ceremony.
- Chests, purchases and social features **do not work offline**, in an otherwise offline-first app. This must be designed, not discovered.
- SAF grants can be auto-revoked after months of inactivity, so the Android local mirror needs graceful re-permission.
- Feature parity across two clients means the ~40-screen mockup must be expressed twice in different idioms — a design and sequencing load this ADR creates but does not own.
- Article 12's DPA requirement may block AI over health and finance regardless of user consent.

**What this closes off**

- Business logic in Next.js route handlers.
- tRPC and GraphQL as the client-facing contract.
- Any second writer to the vault.
- Hand-rolled authentication, and equally, authentication as an external service holding our users.
- Any non-TypeScript backend, which would destroy the only real code reuse in the project.
- Special-category data reaching a third-party LLM without a signed DPA — closed by the constitution, not by this ADR.
- A native Windows application, absent the reopening criteria in component 7.

**Follow-ups**

- [ ] `security-auditor` — ratify the data-residency matrix, and answer the blocking question: **without a DPA, can the AI see health and finance at all?** First in the queue; it shapes the product promise.
- [ ] **DPIA** before launch (Article 12), redone when processing scope materially changes.
- [ ] **Write the disposable-client test before the offline queue exists**: wipe the local SQLite in an automated test and assert full recovery from the server. It is the safety net the build-replication decision depends on.
- [ ] Migrate the repo's Auth.js scaffold to Better Auth while it is still only three tables.
- [ ] `product-planner` — own sequencing: no Windows (component 7), one module complete per client before porting, and the order of core modules. The web is **not** narrowed.
- [ ] Design the consent model: granular per (category × destination), revocable, nothing pre-checked, withdrawal as easy as granting.
- [ ] Verify the current Expo SDK version before pinning `package.json` — the verified data point is SDK 54 (Sept 2025), not the August 2026 release.
- [ ] ADR for the vault projector and the cloud connector (OAuth scopes, cursors, backoff).
- [ ] `ai-engineer` — consume the context surface defined here; do not redefine it.

## Open decisions for Sergio

1. **Does the AI get to see health and finance in v1?** Depends on the DPA. If the answer is no, the promise narrows exactly where it promised most — better known before designing the experience.
2. **When learning and shipping conflict, which wins?** They will collide, most likely at the offline step. This ADR resolves it piece by piece with an explicit criterion, but the criterion must be reapplied each time. If Kibo ever needs to exist before Sergio needs to understand it, PowerSync is still there and adopting it later is cheap.
3. **Does the build order hold, or does something visible get interleaved early?** Schema and API first is technically correct and motivationally hard. Reordering has a real cost: doing offline before the domain rules exist is precisely how data gets corrupted.
4. **BYOK, included quota, or both?** Recommendation is both, with gems buying feature access and never tokens.
5. **Which core module is built first?** It determines what the first vault projection and the first AI answer can even contain.

## References

- `docs/analysis/platform/06-stack-propio.md` — **stack correction delta**: buy-vs-build per piece against the learning criterion, the reusable-stack evaluation, and the learning-ordered build sequence.
- `docs/analysis/platform/01-arquitectura-plataforma.md` — full platform analysis, weighted criteria, sync engine design, residency matrix, and §9 source table (all sources consulted 2026-08-08). Its §1.4, §2.4 and §3.2 are superseded by the delta above.
- `docs/adr/0001-obsidian-integration.md` — vault format contract, provenance and regions, security controls. Amended by this ADR as listed above; not edited here.
- `docs/analysis/obsidian/01-arquitectura-integracion.md` · `docs/analysis/obsidian/11-r2-arquitectura-conector.md` — rounds 1 and 2.
- `constitution.md` v1.7 — Article 3 (agent-side hygiene, explicitly not a product limit), **Article 12** (products processing personal data), Article 7 (language), Article 9 (least privilege).
- Key external evidence (full citations in the analyses, all consulted 2026-08-08): [Expo File System SDK 54](https://expo.dev/blog/expo-file-system) · [Android Storage Access Framework](https://developer.android.com/guide/topics/providers/document-provider) · [PowerSync pricing](https://powersync.com/pricing) and [open source](https://powersync.com/open-source) · [tRPC vs GraphQL vs REST 2026](https://apiscout.dev/guides/trpc-vs-graphql-vs-rest-2026) · [Obsidian sync across devices](https://retypeapp.github.io/obsidian/sync-notes/) · [Tauri vs Electron 2026](https://www.pkgpulse.com/guides/electron-vs-tauri-2026) · [Better Auth vs NextAuth v5 vs Clerk 2026](https://www.pkgpulse.com/guides/better-auth-vs-nextauth-v5-vs-clerk-2026) · [Better Auth Expo integration](https://better-auth.com/docs/integrations/expo) · [Lucia](https://lucia-auth.com/) · [BullMQ vs Bee-Queue vs pg-boss 2026](https://www.pkgpulse.com/guides/bullmq-vs-bee-queue-vs-pg-boss-job-queues-nodejs-2026).
