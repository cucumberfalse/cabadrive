# Tasks: Difficulty Labeling For Materials And Tickets

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-017-difficulty-labeling-orchestrator`.
- [x] T002 Confirm active branch is `codex/017-difficulty-labeling-orchestrator`.
- [x] T003 Confirm only Analyst-created `specs/017-difficulty-labeling/feature-request.md` existed before this Architect pass.
- [x] T004 Read `.specify/memory/constitution.md`.
- [x] T005 Read `docs_project/README.md`.
- [x] T006 Read `docs_project/project-idea.md`.
- [x] T007 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T008 Read `docs_project/project/backend/backend-docs.md`.
- [x] T009 Read `docs_project/project/feature-inventory.md`.
- [x] T010 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T011 Read `docs/specify/README.md`.
- [x] T012 Read `specs/017-difficulty-labeling/feature-request.md`.
- [x] T013 Read relevant feature `008` memory for materials UI compatibility.
- [x] T014 Read relevant feature `010` memory and durable UI/learning docs from `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake`.
- [x] T015 Inspect relevant source/data/validation files for planning context only: `src/data/content.ts`, `src/App.tsx`, `tests/e2e/app.spec.ts`, `scripts/validate-content.mjs`, `scripts/content-topic-guide.mjs`, `content/questions/caba-b.unofficial-fallback.questions.json`, and `content/guide/topic-study-guide.ru.json`.

## Architect Artifacts

- [x] T016 Create `spec.md` with goal, scope/out-of-scope, assumptions, user stories, acceptance criteria, negative scenarios, functional requirements, validation requirements, UI requirements, compatibility requirements, verification requirements, and review requirements.
- [x] T017 Create `plan.md` with data model recommendation, migration strategy for legacy `Question.difficulty`, validation architecture, UI guidance, dependency/conflict strategy, implementation slices, test matrix, risks, and handoff.
- [x] T018 Create this `tasks.md` with implementation checklist, process memory sections, feedback/disposition placeholders, and verification evidence placeholders.

## Implementation Prerequisites

- [x] T019 Confirm implementation starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T020 Confirm implementation uses an Orchestrator-assigned isolated worktree and branch for the slice.
- [x] T021 Confirm implementation has inspected current `git status` and will preserve existing dirty diffs, branches, commits, PRs, and process memory.
- [x] T022 Re-read `spec.md`, `plan.md`, and this `tasks.md` before editing product/content files.
- [x] T023 Re-check whether feature `010` has merged into `main`; record the selected sync/conflict strategy under Process Memory before UI edits.
- [x] T024 Coordinate with Orchestrator before the bulk content-labeling slice because it touches all current questions and all current topic guide topics.

## Slice A: Rubric, Schema, And Validation Scaffold

- [x] T025 Define canonical `DifficultyLevel` enum values: `green`, `blue`, `yellow`, `red`.
- [x] T026 Define allowed `DifficultyDimension` values: `simple_common_spanish`, `spanish_lexical_load`, `legal_admin_terms`, `caba_rf_divergence`, `rule_complexity`, `numbers_thresholds`, `trap_negation`, `visual_cue_load`, and `cross_topic_dependence`.
- [x] T027 Add or plan a pure validation helper module, preferred `scripts/content-difficulty.mjs`.
- [x] T028 Implement deterministic question difficulty fingerprinting.
- [x] T029 Implement deterministic topic difficulty fingerprinting.
- [x] T030 Implement validation for allowed difficulty values and rejection of legacy `low`, `medium`, and `high`.
- [x] T031 Implement validation for required metadata: rubric version, dimensions, rationale, provenance, and source fingerprint.
- [x] T032 Implement validation for stale question and topic difficulty fingerprints.
- [x] T033 Implement validation for topic ticket-id basis hash and question-level counts if topic basis fields are included.
- [x] T034 Add unit tests for valid difficulty metadata.
- [x] T035 Add unit tests for invalid enum and legacy enum values.
- [x] T036 Add unit tests for missing rationale, invalid dimensions, duplicate dimensions, missing provenance, and stale fingerprints.
- [x] T037 Record in Process Memory whether strict full-content validation is enabled in this slice or intentionally deferred to Slice B to keep `main` green.

## Slice B: Bulk Labeling And Strict Content Validation

- [x] T038 Migrate every current question's `difficulty` value from `low | medium | high` to `green | blue | yellow | red`.
- [x] T039 Add `difficultyMeta` to every current question.
- [x] T040 Label every current topic guide topic/material with `difficulty`.
- [x] T041 Add `difficultyMeta` to every current topic guide topic/material.
- [x] T042 Ensure material ticket blocks do not author their own difficulty field; they must use canonical question difficulty.
- [x] T043 Generate or update question source fingerprints.
- [x] T044 Generate or update topic source fingerprints and ticket-id basis hashes.
- [x] T045 Enable strict difficulty validation from `scripts/validate-content.mjs`.
- [x] T046 Update `src/data/content.ts` types so `Question.difficulty` uses the four-color enum and no longer exposes `low | medium | high`.
- [x] T047 Update topic guide TypeScript types for topic difficulty metadata.
- [x] T048 Run an `rg`/script check proving no legacy question difficulty values remain.
- [x] T049 Run `pnpm run validate:content` and record the summary including current question/topic counts.
- [x] T050 Record labeling method, major judgment calls, and any uncertain labels in Process Memory.
- [x] T051 Update durable docs if the content schema/source-of-truth changed.

## Slice C: UI Integration

- [x] T052 Confirm feature `010` merge/sync status before editing `src/App.tsx`, `src/styles.css`, or adjacent UI files.
- [x] T053 Add a centralized difficulty-to-UI mapping with Russian labels, compact labels, accessible labels, and visual token classes.
- [x] T054 Add a small non-interactive difficulty indicator component or equivalent render helper.
- [x] T055 Render question difficulty in learning question cards near existing metadata.
- [x] T056 Render question difficulty in mistake review selected question cards.
- [x] T057 Render compact difficulty in mistake list rows or other existing question list contexts where question IDs are shown.
- [x] T058 Render topic difficulty in the materials topic list.
- [x] T059 Render topic difficulty in the materials detail heading/status area.
- [x] T060 Render canonical question difficulty in materials ticket blocks.
- [x] T061 Render difficulty in existing search/list contexts where questions or topics are listed after sync with parallel UI work.
- [x] T062 Keep active exam attempts free of difficulty rationale, dimension details, filtering, and study hints.
- [x] T063 If any compact difficulty chip is added to active exam attempts, record the `010` compatibility rationale and add tests proving it does not reveal support or answer hints.
- [x] T064 Ensure difficulty UI is not color-only and has accessible text/labels.
- [x] T065 Ensure difficulty styling does not resemble correctness, source status, pass/fail, or the user `Сложный` flag.
- [x] T066 Ensure mobile layout wraps without text overflow.
- [x] T067 Update durable frontend/screen docs if learner-facing behavior changed.

## Slice C Tests

- [x] T068 Add e2e/component evidence that learning question cards show difficulty.
- [x] T069 Add e2e/component evidence that mistake review shows difficulty and keeps user `Сложный` distinct where applicable.
- [x] T070 Add e2e/component evidence that materials topic list shows topic difficulty.
- [x] T071 Add e2e/component evidence that materials detail heading shows topic difficulty.
- [x] T072 Add e2e/component evidence that materials ticket blocks show canonical ticket difficulty.
- [x] T073 Add e2e/component evidence for at least one existing search/list context.
- [x] T074 Add e2e evidence that active exam attempts preserve `010` support restrictions.
- [x] T075 Add accessibility evidence that labels are not color-only.

## Slice D: Final Verification And Release Readiness

- [x] T076 Run `pnpm run validate:content`.
- [x] T077 Run `pnpm run test`.
- [x] T078 Run `pnpm run build`.
- [x] T079 Run `pnpm run test:e2e`.
- [x] T080 Run `pnpm run preflight`.
- [x] T081 Run `git diff --check`.
- [ ] T082 For runtime-affecting PRs, run `make build`.
- [ ] T083 For runtime-affecting PRs, run `make up`.
- [ ] T084 For runtime-affecting PRs, smoke check `http://localhost:5173`.
- [ ] T085 For runtime-affecting PRs, run `make down`.
- [x] T086 Record command output summaries, screenshots if useful, and exact unrelated blockers in Verification Evidence.
- [x] T087 Spot-check at least one example of each difficulty level across question content.
- [x] T088 Spot-check at least one topic/material difficulty rationale for topic-specific reasoning beyond child ticket labels.
- [x] T089 Confirm durable docs are updated where needed, or record why no doc update was required.
- [x] T090 Confirm no active exam support-scaffolding regression.
- [x] T091 Confirm no runtime network, backend, remote image, PDF viewer, or live classification dependency was introduced.

## Review And PR Readiness

- [x] T092 Confirm each implementation PR is scoped to one assigned slice unless Orchestrator explicitly combines slices.
- [x] T093 Confirm `tasks.md` process memory is current before review.
- [x] T094 Confirm any Implementation Agent feedback items are recorded below.
- [x] T095 Confirm Architect has dispositioned each implementation feedback item as a task/ticket or explicit not-needed decision.
- [x] T096 Confirm no out-of-scope feature memory, product, docs, content, workflow, or runtime changes are included.
- [x] T097 Confirm Review Agent has enough evidence to check all four difficulty levels, validation failures, UI surfaces, and `010` compatibility.
- [ ] T098 Confirm no blocking review findings remain.
- [ ] T099 Confirm required checks are green after push/PR.
- [ ] T100 Confirm the PR has no unresolved merge conflicts.
- [ ] T101 Leave only final human approval or merge mechanics remaining.

## Process Memory

### Architect Decisions

- Canonical machine difficulty values are `green`, `blue`, `yellow`, and `red`.
- The existing `Question.difficulty: low | medium | high` must be migrated in place to the four-color enum. Leaving a second source of truth is not allowed.
- Supplemental metadata should be named `difficultyMeta` and must not contain another `level` field.
- Required difficulty dimensions cover Spanish lexical load, legal/admin terms, CABA/RF divergence, rule complexity, numbers/thresholds, traps/negations, visual cue load, cross-topic dependence, and simple/common baseline cases.
- Every current canonical question and every current topic guide topic must have exactly one difficulty level.
- Material ticket blocks display canonical question difficulty. No per-topic-ticket difficulty is authored.
- Topic difficulty is authored/reviewed, not purely derived from child ticket max/average.
- Active exam attempts should omit difficulty by default unless an implementation slice records explicit feature `010` compatibility and proves no scaffolding regression.
- Feature `008` materials UI must be preserved; difficulty layers onto its topic list/detail and canonical ticket blocks.
- Feature `010` must be synced or handled with a recorded compatible patch strategy before UI edits.

### Architect Context Evidence

- Worktree check showed `/Users/chap/devel/cabadrive-017-difficulty-labeling-orchestrator` on `codex/017-difficulty-labeling-orchestrator`.
- Initial `git status --short --branch` showed only untracked `specs/017-difficulty-labeling/` from the Analyst-created intake.
- Current question count from JSON: 460.
- Current topic guide topic count from JSON: 38.
- Current legacy question difficulty values are 426 `medium`, 34 `high`, and 0 `low`.
- Current question image-backed count is 276.
- `src/data/content.ts` currently types `Question.difficulty` as `low | medium | high`.
- This worktree already contains feature `008` materials UI structures in `src/App.tsx` and `src/data/content.ts`.
- Feature `010` source-of-truth docs in `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake` require Spanish-primary content, Russian support boundaries, active exam no-scaffolding, non-color-only accessibility, and status visibility.

### Known Issues And Risks

- Bulk labeling all 460 questions and 38 topics is a large content edit and likely conflict point with parallel content branches.
- Difficulty is subjective; rationale/dimensions/provenance and review spot checks are required to keep it maintainable.
- Red/green colors can be mistaken for answer correctness or pass/fail unless UI styling is restrained.
- The user-controlled `Сложный` mark already exists and must remain distinct from static content difficulty.
- Feature `010` appears unmerged relative to this worktree; overlapping UI implementation should wait/sync or record a careful compatibility strategy.
- Topic guide remains draft/unofficial; difficulty labels must not make materials look final or official.
- Current question bank remains `unofficial_b_fallback`; difficulty labels must not imply officialness or coverage completeness.

### Implementation Agent Feedback

- None. No spec divergence or additional Architect disposition was needed during this implementation pass.

### Architect Disposition Of Feedback

- Not needed: Implementation Agent recorded no feedback items requiring Architect disposition.

### Implementation Decisions

- 2026-05-10: Implementation starts in assigned worktree `/Users/chap/devel/cabadrive-017-difficulty-labeling-orchestrator` on branch `codex/017-difficulty-labeling-orchestrator`; initial `git status --short --branch` showed only untracked `specs/017-difficulty-labeling/` feature memory.
- 2026-05-10: Feature memory is complete and was read before product/content edits: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- 2026-05-10: Orchestrator explicitly assigned a combined end-to-end slice in this branch/PR: rubric/schema/validation, bulk labeling, UI, and verification together, because all question/topic labels and learner-facing surfaces need one synchronized source of truth.
- 2026-05-10: Bulk labeling is authorized by the Orchestrator prompt for this Implementation Agent assignment; no unmerged artifacts from other worktrees will be used as implementation input.
- 2026-05-10: Feature `010` is absent from this worktree (`specs/010-ui-ux-learning-source-of-truth/` not present) and remains unmerged/dirty in `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake`. Conflict strategy: read `010` feature memory and durable docs read-only as UX compatibility guidance, do not copy its product code, do not depend on its unmerged `src/App.tsx`/CSS/tests, keep active exam free of difficulty rationale/dimensions/study hints, and make UI edits as small additive patches against the current `origin/main` shape so later reconciliation is mechanical.
- 2026-05-10: Strict difficulty validation is enabled in this combined slice rather than deferred. `pnpm run validate:content` now calls `scripts/content-difficulty.mjs` after the full question/topic content has been labeled.
- 2026-05-10: Difficulty metadata is inline in the canonical question JSON and topic guide JSON. No separate manifest was introduced, and material ticket blocks render canonical question difficulty only.
- 2026-05-10: The UI uses `src/difficulty.tsx` as the centralized mapping/component for Russian labels, accessible labels, and visual token classes. Active exam attempt cards omit difficulty chips by default to preserve feature `010` no-scaffolding guidance.
- 2026-05-10: Existing search/list context evidence is the mistake side list plus the materials topic list; there is no separate learning search-result list in this branch, only a filtered current question card.

### Dead Ends

- Initial `pnpm run build` failed because this isolated worktree had no `node_modules` and `vite` was not installed. Ran `pnpm install` from the committed lockfile; lockfile was unchanged, then build passed.
- Docker smoke could not start because `make build` failed before image build with `Cannot connect to the Docker daemon at unix:///Users/chap/.docker/run/docker.sock. Is the docker daemon running?`. No `make up` or `make down` cleanup was attempted because Docker was unavailable and no container/network was created by this worktree.

### Verification Evidence

- `pnpm run validate:content` passed and printed `Difficulty labels validated: 460 questions, 38 topics.` plus `Content validation passed: 460 category B fallback questions, 276 local image references.`
- `pnpm run test` passed in final preflight: 79 tests, including new difficulty validator coverage for valid metadata, legacy/invalid enums, missing rationale/provenance/dimensions, duplicate dimensions, stale question fingerprint, stale topic basis hash/counts, and stale topic dominant dimensions.
- `pnpm run build` passed after `pnpm install`; Vite emitted the existing large-chunk warning and generated a service worker with 280 cached assets.
- `pnpm run test:e2e` passed: 14 tests across `chromium` and `mobile`, including difficulty visible in learning, mistake review, materials topic list/detail/ticket blocks, dual-topic ticket canonical difficulty, no active-exam difficulty chip/support, local-first/no PDF, and offline reload.
- `pnpm run preflight` passed, including feature-memory gate, repository baseline, validate, 79 unit tests, build, and 14 e2e tests across `chromium` and `mobile`.
- `git diff --check` passed.
- Docker smoke blocker: `make build` failed with `Cannot connect to the Docker daemon at unix:///Users/chap/.docker/run/docker.sock. Is the docker daemon running?`; Docker daemon was unavailable, so `make up`, curl smoke at `http://localhost:5173`, and `make down` were not feasible in this environment.
- `rg -n '"difficulty": "(low|medium|high)"|difficulty: "low"|difficulty: "medium"|difficulty: "high"' content src tests scripts docs_project specs/017-difficulty-labeling` found no legacy product/content/type values; remaining matches are the negative validator test and feature-memory references to the old schema.
- Label distribution after migration: questions `green=25`, `blue=141`, `yellow=209`, `red=85`; topic materials `blue=2`, `yellow=22`, `red=14`.
- Orchestrator independently re-verified publish-prep evidence: `validate:content`, `test` 79 tests, `preflight`, `git diff --check`, product/content counts, and Docker client/server blocker (`docker info` cannot reach daemon at `unix:///Users/chap/.docker/run/docker.sock`).
- Spot-checked question examples: `b-fallback-041` green, `b-fallback-001` blue, `b-fallback-002` yellow, and `b-fallback-005` red, each with Russian rationale and dimensions.
- Spot-checked topic examples: `sustainable-mobility-and-vulnerable-users` blue, `driver-hand-signals` yellow, and `parking-clearances-and-corners` red, each with topic-specific rationale plus child question counts and ticket ID basis hash.

### Final Conflict Strategy

- Feature `010` was read from `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake` as read-only memory/docs only. It is absent from this worktree and still unmerged relative to `origin/main`. This implementation avoided consuming its unmerged product code, kept active exam free of difficulty rationale/dimensions/study hints and compact chips, and applied additive UI changes against the current branch so future 010 reconciliation can keep its support/navigation changes.

### Known Issues After Implementation

- Docker smoke remains unverified because the Docker daemon is not reachable in this environment. Required local app checks otherwise passed.
