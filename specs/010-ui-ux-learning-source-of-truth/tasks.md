# Tasks: UI/UX And Learning Source Of Truth

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake`.
- [x] T002 Confirm active branch is `codex/010-ui-ux-learning-intake`.
- [x] T003 Read `AGENTS.md` and confirm Architect-only boundary.
- [x] T004 Read `.specify/memory/constitution.md`.
- [x] T005 Read `docs_project/README.md`.
- [x] T006 Read `docs_project/project-idea.md`.
- [x] T007 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T008 Read `docs_project/project/backend/backend-docs.md`.
- [x] T009 Read `docs_project/project/feature-inventory.md`.
- [x] T010 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T011 Read `docs/specify/README.md`.
- [x] T012 Read active `specs/010-ui-ux-learning-source-of-truth/feature-request.md`.
- [x] T013 Read feature `008` dependency context read-only from `/Users/chap/devel/cabadrive-008-learning-materials-intake`.
- [x] T014 Read feature `009` dependency context read-only from `/Users/chap/devel/cabadrive-009-ticket-image-metadata-intake`.

## Architect Artifacts

- [x] T015 Create `spec.md` with formal goal, scope, out of scope, assumptions, user stories, acceptance criteria, negative scenarios, functional requirements, verification requirements, and review requirements.
- [x] T016 Create `plan.md` with documentation approach, durable doc locations, implementation slices, dependency contract with `008`/`009`, overlay data ownership, validation/test approach, risks, rollback, and defer rules.
- [x] T017 Create this `tasks.md` with atomic implementation inventory, evidence hooks, review requirements, and process-memory sections.

## Required Slice A: Source-Of-Truth Docs

- [x] T018 Confirm implementation starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T019 Confirm Implementation Agent uses only the Orchestrator-assigned isolated worktree and branch.
- [x] T020 Re-read source docs and this feature memory before editing durable docs.
- [x] T021 Create `docs_project/project/frontend/ui-ux-source-of-truth.md` or recorded equivalent.
- [x] T022 Create `docs_project/project/learning/learning-experience-source-of-truth.md` or recorded equivalent.
- [x] T023 Create `docs_project/project/frontend/image-explanation-overlays.md` or recorded equivalent.
- [x] T024 Define Cabadrive-specific UI principles: status visibility, learner language, predictable controls, user control, consistency, recognition over recall, efficient repeated use, minimal exam-focused surfaces, recovery states, and contextual help.
- [x] T025 Define accessibility principles aligned with WCAG 2.2: focus visibility, keyboard operation, target sizing, contrast, language handling for Spanish/Russian, predictable navigation, non-pointer alternatives, and no text overflow.
- [x] T026 Define learning principles: active recall, immediate post-answer feedback, explanation after attempt, weak-topic review, distributed review, interleaving where useful, self-explanation prompts where useful, and avoidance of passive rereading as the main loop.
- [x] T027 Define bilingual support rules: Spanish primary, Russian unofficial, translation hidden before answer in support modes, shared question/answer translation reveal, and automatic reveal after attempt.
- [x] T028 Define mode boundaries for learning, mistake review, active exam attempt, exam review, vocabulary, CABA/RF guide, topic materials, search, progress/reset, and offline/status surfaces.
- [x] T029 Define multimedia/image rules: local images only, image facts over decoration, signaling, spatial contiguity, dim irrelevant details only during explanations, and no answer-revealing overlays before an attempt.
- [x] T030 Define review gates requiring UI PRs to cite source-of-truth rules and acceptance evidence.
- [x] T031 Summarize or cite the research basis from the Analyst intake without over-quoting source material.
- [x] T032 Add cross-links from existing durable docs where appropriate.
- [x] T033 Record doc creation evidence and any path deviations in Process Memory.

## Required Slice B: Final Documentation Consistency Check

- [x] T034 Create a documentation consistency matrix in `docs_project/project/frontend/ui-ux-product-audit.md` or recorded equivalent.
- [x] T035 Check new docs against `.specify/memory/constitution.md`.
- [x] T036 Check new docs against `docs_project/README.md`, `project-idea.md`, frontend docs, backend docs, feature inventory, and learning/exam flow docs.
- [x] T037 Check new docs against `docs/specify/README.md` and relevant source planning archive expectations.
- [x] T038 Check new docs against feature `008` topic materials behavior if present.
- [x] T039 Check new docs against feature `009` image metadata ownership and validation expectations.
- [x] T040 Check new docs against Analyst research takeaways for UI/UX, accessibility, learning science, multimedia learning, and Duolingo product/research lessons.
- [x] T041 Resolve contradictions before audit, or record a deferred decision with owner, reason, and follow-up task.
- [x] T042 Record final documentation consistency evidence in Process Memory.

## Required Slice C: Full Product Audit And Task Inventory

- [x] T043 Audit status/onboarding surfaces against every applicable source-of-truth rule.
- [x] T044 Audit primary navigation against every applicable source-of-truth rule.
- [x] T045 Audit learning question flow against every applicable source-of-truth rule.
- [x] T046 Audit answer feedback against every applicable source-of-truth rule.
- [x] T047 Audit translation/explanation support against every applicable source-of-truth rule.
- [x] T048 Audit image-backed questions against every applicable source-of-truth rule.
- [x] T049 Audit exam mode and exam review boundaries against every applicable source-of-truth rule.
- [x] T050 Audit mistake review against every applicable source-of-truth rule.
- [x] T051 Audit vocabulary against every applicable source-of-truth rule.
- [x] T052 Audit CABA/RF guide against every applicable source-of-truth rule.
- [x] T053 Audit topic materials from feature `008` if present; if absent, record anticipated-surface status and create a re-audit task.
- [x] T054 Audit search, filtering, and collection navigation.
- [x] T055 Audit progress, reset, and weak-topic status surfaces.
- [x] T056 Audit mobile layout, text overflow, tap targets, and responsive ordering.
- [x] T057 Audit keyboard/focus behavior and screen-reader-relevant control names/states.
- [x] T058 Audit offline/status/source labeling surfaces.
- [x] T059 For each gap, create an atomic task entry with source-of-truth rule ID, affected surface, observed gap, implementation action, acceptance hook, verification hook, dependency, suggested PR slice, and blocked/unblocked status.
- [x] T060 Ensure the task inventory explicitly includes mandatory UX fix 1: post-answer auto reveal in learning/support modes only.
- [x] T061 Ensure the task inventory explicitly includes mandatory UX fix 2: bottom next navigation and previous navigation.
- [x] T062 Ensure the task inventory explicitly includes mandatory UX fix 3: image explanation overlays based on feature `009` metadata.
- [x] T063 Mark image overlay implementation tasks blocked if feature `009` shared metadata or per-question usage/relevance mappings are unavailable, stale, or incomplete.
- [x] T064 Perform the final task consistency check against source-of-truth docs, `008`, `009`, exam-mode restrictions, local-first constraints, and internal task contradictions.
- [x] T065 Record audit and final task consistency evidence in Process Memory.

## Required Slice D: Mandatory UX Fix 1 - Post-Answer Auto Reveal

- [x] T066 Inspect current question-card support state and mode boundaries before editing.
- [x] T067 Preserve hidden translation/explanation support on initial render in learning/support modes.
- [x] T068 After answer selection in learning mode, automatically reveal question translation, answer translations, and learning explanation.
- [x] T069 After answer selection in mistake review, automatically reveal question translation, answer translations, and learning explanation.
- [x] T070 Apply the same rule to any support-mode practice surface created by feature `008` only if that surface uses answer attempts rather than passive reading.
- [x] T071 Keep active exam attempts from revealing translations, explanations, or answer-critical image overlays after answer selection.
- [x] T072 Define and implement exam review/completed-attempt support behavior separately from active exam attempts if the UI exposes review.
- [x] T073 Update existing tests that expected explanation to remain hidden after answer, replacing them with the new support-mode contract.
- [x] T074 Add tests for learning pre-answer hidden support and post-answer auto reveal.
- [x] T075 Add tests for mistake-review pre-answer hidden support and post-answer auto reveal.
- [x] T076 Add tests proving active exam attempts do not auto reveal support.
- [x] T077 Record verification evidence and any behavior decisions in Process Memory.

## Required Slice E: Mandatory UX Fix 2 - Bottom Previous/Next Navigation

- [x] T078 Define mode-specific question collections for previous/next behavior: learning search results, full learning bank, mistakes collection, or other scoped collection.
- [x] T079 Define first-item and last-item boundary behavior.
- [x] T080 Define whether revisiting a question preserves selected answer, feedback, translation reveal, explanation reveal, and overlay state; implement consistently.
- [x] T081 Move or add the primary next control to the bottom of the learning question flow where feedback/explanation reading ends.
- [x] T082 Add previous control near the bottom next control with accessible name/state.
- [x] T083 Avoid confusing duplicate primary navigation if an existing top `Следующий` remains; either demote, remove, or clearly separate it from bottom flow navigation.
- [x] T084 Apply bottom previous/next pattern to mistake review if it uses the same answer-attempt flow.
- [x] T085 Ensure mobile layout keeps controls reachable without text overlap.
- [x] T086 Ensure keyboard focus order reaches bottom previous/next controls predictably after feedback.
- [x] T087 Add Playwright coverage for bottom navigation on desktop.
- [x] T088 Add Playwright coverage for bottom navigation on mobile.
- [x] T089 Add tests for first/last boundary behavior.
- [x] T090 Add tests for selected-answer/support-state preservation or reset according to the documented rule.
- [x] T091 Record verification evidence and any state-rule decisions in Process Memory.

## Required Slice F: Mandatory UX Fix 3 - Image Explanation Overlays

- [x] T092 Check whether completed feature `009` metadata and question usage mappings are present in the implementation branch after syncing from `origin/main`.
- [x] T093 Do not enable overlay implementation because completed `009` shared metadata, per-question usage/relevance mappings, and validation are not present on this synced branch.
- [x] T094 If `009` metadata is missing, stale, or incomplete, mark overlay implementation blocked in Process Memory and do not implement invented highlights.
- [x] T094A Record that Slice F is a mandatory `010` implementation slice waiting only on merged `009`; after `009` is fully completed and merged into `main`, sync this branch and resume overlay implementation before claiming `010` complete.
- [x] T095 Decide exact durable overlay path, preferred `content/image-overlays/question-explanation-overlays.manifest.json` plus shards, and record any deviation.
- [x] T096 Define overlay records with question ID, image ID/path, image hash, question fingerprint, `009` metadata fingerprint, `009` usage fingerprint, referenced question-specific relevance IDs, referenced detail/region IDs, image-relative geometry, display behavior, provenance, and review status.
- [x] T097 Add overlay validation for missing `009` shared metadata, missing `009` per-question usage/relevance, missing detail/region/relevance IDs, non-answer-critical or wrong-role references for the current question, stale fingerprints, malformed/out-of-bounds regions, and non-local assets.
- [x] T098 Add at least one approved overlay definition for an image-backed question whose `009` metadata is available.
- [x] T099 Render overlays only when explanation support is visible and the current mode allows support.
- [x] T100 Keep overlays hidden before answer selection in learning/support modes.
- [x] T101 Keep overlays hidden during active exam attempts.
- [x] T102 Render dimming/de-emphasis for regions marked `background_irrelevant_dim` for the current question while keeping details marked `answer_critical_highlight` for that same question prominent.
- [x] T103 Provide a truthful fallback when overlay data is unavailable for an image-backed explanation.
- [x] T104 Add validator tests for stale/missing overlay dependencies.
- [x] T105 Add Playwright or DOM tests for overlay visible with explanation and hidden before answer/exam.
- [x] T106 Record image overlay evidence, dependency status, and any blocked questions in Process Memory.

## Non-Mandatory Audit-Derived Follow-Up Tasks

- [ ] T107 Implement additional audit-derived tasks only after they pass the final task consistency check and receive explicit disposition as in-scope for `010`.
- [ ] T108 Keep each audit-derived implementation PR atomic and traceable to one or a small cluster of source-of-truth rules.
- [ ] T109 Preserve `unofficial_b_fallback` clarity in every affected surface.
- [ ] T110 Preserve local-first/offline behavior and avoid runtime network calls.
- [ ] T111 Add tests and evidence required by each task's acceptance hook.
- [ ] T112 Record completed task IDs, evidence, and any follow-up dispositions in Process Memory.

## Required Slice G: Final Gate And PR Readiness

- [x] T113 Confirm durable docs exist and are cross-linked.
- [x] T114 Confirm final documentation consistency check is recorded.
- [x] T115 Confirm full product audit is recorded.
- [x] T116 Confirm task inventory and final task consistency check are recorded.
- [x] T117 Confirm mandatory UX fix 1 is implemented and verified.
- [x] T118 Confirm mandatory UX fix 2 is implemented and verified.
- [x] T119 Confirm mandatory UX fix 3 is no longer waiting after completed feature `009` merged into `origin/main`; Slice F is implemented and verified against merged `009` artifacts.
- [x] T120 Run `pnpm run validate:content`.
- [x] T121 Run `pnpm run test`.
- [x] T122 Run `pnpm run build`.
- [x] T123 Run `pnpm run test:e2e`.
- [x] T124 Run `pnpm run preflight`.
- [x] T125 Run `git diff --check`.
- [ ] T126 For runtime-affecting changes, run `make down`, `make build`, `make up`, smoke check `http://localhost:5173`, and `make down`.
- [ ] T127 Confirm required checks are green after PR push.
- [ ] T128 Confirm no unresolved merge conflicts.
- [ ] T129 Confirm no blocking review findings remain.
- [ ] T130 Confirm only final human approval or merge mechanics remain; do not check while mandatory Slice F is waiting for merged `009`.

## Review Requirements

- [ ] T131 Review Agent verifies implementation stayed within the Orchestrator-assigned slice and worktree.
- [ ] T132 Review Agent verifies source-of-truth docs are durable, Cabadrive-specific, and consistent with existing project constraints.
- [ ] T133 Review Agent verifies the final documentation consistency check exists and has no unresolved blocker.
- [ ] T134 Review Agent verifies the full product audit covers every surface named in this tasks file.
- [ ] T135 Review Agent verifies atomic tasks trace from source-of-truth rule to implementation and evidence.
- [ ] T136 Review Agent verifies post-answer auto reveal applies only to learning/support modes and not active exam attempts.
- [ ] T137 Review Agent verifies bottom previous/next navigation has accessible labels, boundaries, mobile behavior, and state rules.
- [ ] T138 Review Agent verifies image overlays depend on completed `009` per-question usage/relevance and are blocked/fenced when usage/relevance is unavailable, stale, or incomplete.
- [ ] T139 Review Agent verifies no backend, runtime network, remote image, live AI, or live image-analysis dependency is introduced.
- [ ] T140 Review Agent verifies `tasks.md` process memory and verification evidence are current before merge readiness.

## Architect Update After Question-Scoped Relevance Clarification

- [x] T141 Architect reads the new clarification that shared image metadata describes visible facts only and that importance/relevance belongs only to per-question usage.
- [x] T142 Architect updates `spec.md` so overlay implementation explicitly depends on completed `009` question-specific usage/relevance, not global shared-image importance.
- [x] T143 Architect updates `plan.md` so overlay records, validation, risks, and implementation guidance require `009` usage fingerprints and relevance roles for the current question.
- [x] T144 Architect updates this `tasks.md` with follow-up overlay tasks while preserving existing task history and implementation completion state.
- [x] T145 Architect keeps this pass limited to `spec.md`, `plan.md`, and `tasks.md`; no product code, content, durable docs, tests, commits, pushes, or PR state changes.
- [x] T146 Implementation Agent ensures overlay definitions cannot be created from shared `009` metadata alone; each active overlay must reference the current question's completed `009` usage/relevance.
- [x] T147 Implementation Agent ensures overlay validators reject UI-authored important/unimportant/critical/relevance roles that are not present in the current question's `009` usage record.
- [x] T148 Implementation Agent ensures fallback behavior for missing/stale `009` usage/relevance keeps the normal local image and explanation text without invented highlight/dim overlays.
- [ ] T149 Review Agent verifies overlay examples and tests consume `answer_critical_highlight`, `supporting`, `distractor_trap`, and `background_irrelevant_dim` only from `009` per-question usage for the concrete ticket.

## Process Memory

### Architect Decisions

- This feature is documentation-first: durable source-of-truth docs must precede audit, and audit must precede implementation task execution.
- Preferred durable docs are `docs_project/project/frontend/ui-ux-source-of-truth.md`, `docs_project/project/learning/learning-experience-source-of-truth.md`, `docs_project/project/frontend/image-explanation-overlays.md`, and `docs_project/project/frontend/ui-ux-product-audit.md`.
- Validated `010` implementation task inventory lives primarily in this `tasks.md`; the durable audit doc may reference task IDs to avoid duplicate inventory drift.
- Feature `008` is an audited dependency surface when present, not a file-edit target for this Architect pass.
- Feature `009` owns question-neutral shared image metadata plus per-question answer-critical/relevance roles; feature `010` owns overlay presentation and validation against `009` metadata/usage fingerprints.
- Architect update on 2026-05-10 after question-scoped relevance clarification: shared `009` image metadata is not a source of global important/unimportant areas. `010` overlay implementation must consume completed `009` per-question usage/relevance for the concrete ticket and must not invent UI-side relevance.
- Overlay rendering is fenced when `009` shared metadata or per-question usage/relevance mappings are missing, stale, or incomplete for a concrete question.
- After feature `009` fully completed and merged into `main`, Slice F resumed in `010` and added validated seed overlay support.
- Mandatory post-answer reveal applies to learning, mistake review, and support-mode answer attempts only; active exam attempts remain hidden.
- Mandatory navigation fix requires bottom previous and next controls, explicit boundaries, and tested state behavior.
- Architect did not edit product code, tests, runtime files, durable docs, `feature-request.md`, adjacent feature memories, commits, pushes, or PR state.

### Context Evidence

- Active worktree check showed `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake`.
- Active branch check showed `codex/010-ui-ux-learning-intake`.
- Baseline feature folder contained `feature-request.md` before this Architect pass.
- Feature `008` context shows a topic materials UI may exist under label `Материалы`; this feature must audit it if present.
- Feature `009` context defines shared image metadata, question usage mappings, answer-critical details, and strict validation/evidence; this feature must not redefine that metadata source.
- Current durable frontend docs say learning and mistake review start with Russian translation hidden, active exam attempts hide support, and question images are local offline assets.

### Dead Ends

- Docker smoke could not complete `make up` because another Docker container already owns the fixed name `/cabadrive`. Per the user boundary, this Implementation Agent did not remove or rename another agent's container.

### Known Issues

- Feature `008` is now present from `origin/main` and `Материалы` was included in the product audit.
- Superseded 2026-05-10: image overlay implementation was previously blocked until completed feature `009` shared metadata and per-question usage/relevance mappings merged into `origin/main`; PR #63 is now merged and this branch was synchronized to `78e0176`.
- Overlay implementation also cannot safely proceed if completed `009` shared metadata exists but the current question's `009` usage/relevance record is missing, stale, incomplete, or lacks the roles needed for dim/highlight behavior.
- The request is broad enough to generate many follow-up tasks; Orchestrator should keep implementation PRs narrow and evidence-gated.
- Docker runtime smoke remains blocked by the shared `/cabadrive` container-name conflict; `make build` succeeded, but `make up` did not start this worktree's container.
- As of the Analyst clarification, D/E/F are mandatory implementation slices in `010`; docs, consistency checks, audit, and task inventory are gates rather than the final deliverable.

### Review Finding Follow-Up

- Review finding P2: answered learning tickets restored from `attemptState` could receive a fresh running timer after a search query change cleared `timerStates`, so the same completed ticket could later expire as unresolved while still showing the restored selected answer.
- Fix decision: learning search changes now preserve per-question timer state instead of clearing it. If a completed attempt is restored without a saved timer entry, the learning timer is derived as `answered`, preventing a fresh running timer for an already completed ticket.
- Active exam timer scope remains unchanged because this fix is confined to `LearnView` learning-ticket timers; `ExamView` keeps its separate attempt timer and active exam support remains hidden.
- Test coverage added in `tests/e2e/app.spec.ts` for answering a learning question, filtering away and back to the same question, and proving the restored answered card stays `В темпе`, does not expose timer pause/resume controls, does not show unresolved expiry after simulated time passes, and does not record another answer.
- Focused verification evidence for P2 fix: `pnpm run build && pnpm exec playwright test -g "answered learning ticket restored"` passed 2 tests across `chromium` and `mobile`.
- Review finding P3: empty scoped collections still fell back to `data.questions[0]`, allowing a zero-match learning search or empty mistake collection to render and answer a question outside the active collection.
- Fix decision: learning now renders an explicit no-results state when a non-empty query produces zero results, without `QuestionCard`, answer buttons, or footer navigation. Empty query behavior remains unchanged because `searchQuestions("")` returns the default learning collection.
- Fix decision: mistake review now renders the side empty message plus a main empty state when there are no mistakes, without `QuestionCard`, answer buttons, or footer navigation. It no longer allows recording a mistake-mode answer outside the current mistake collection.
- Test coverage added in `tests/e2e/app.spec.ts` for no-match learning search and empty mistake review. Both tests assert no fallback card/nav/answers and no local progress answer is recorded.
- Verification evidence for P3 fix: `pnpm run build && pnpm exec playwright test -g "no matches|no mistakes"` passed 4 tests across `chromium` and `mobile`; `pnpm run test:e2e` passed 20 tests across `chromium` and `mobile`; `git diff --check` passed.

### Verification Evidence

- Fast-forward evidence: `git fetch origin && git merge --ff-only origin/main` updated the branch from `98fa568` to `f6882e5` and brought in feature `008` files without conflict; `specs/010-ui-ux-learning-source-of-truth/` remained present as worktree changes.
- Dependency evidence update: `git fetch origin && git merge --ff-only origin/main` synchronized this branch to `78e0176 [codex] Implement image metadata learning support (#63)`, bringing merged feature 009 metadata, usage mappings, evidence, and validators into the implementation branch. No local 009 worktree or unmerged 009 branch was used.
- Durable docs evidence: created `docs_project/project/frontend/ui-ux-source-of-truth.md`, `docs_project/project/learning/learning-experience-source-of-truth.md`, `docs_project/project/frontend/image-explanation-overlays.md`, and `docs_project/project/frontend/ui-ux-product-audit.md`; cross-linked from `docs_project/README.md`, frontend docs, feature inventory, and learning/exam flows.
- Documentation consistency evidence: `docs_project/project/frontend/ui-ux-product-audit.md` records checks against constitution, durable docs, source planning archive, feature 008, merged feature 009 contract, research basis, and internal docs; no unresolved contradiction blocks A/B/C/D/E/F work.
- Product audit evidence: `docs_project/project/frontend/ui-ux-product-audit.md` covers status/onboarding, primary navigation, learning flow, answer feedback, translation/explanation support, image-backed questions, exam mode/review boundary, mistake review, vocabulary, CABA/RF, `Материалы`, search/filtering, progress/reset/weak-topic status, mobile layout, keyboard/focus, and offline/source labels.
- Task consistency evidence: `docs_project/project/frontend/ui-ux-product-audit.md` records atomic tasks UX-010-001 through UX-010-006 with rule IDs, affected surfaces, gaps, actions, acceptance hooks, verification hooks, dependencies, suggested slices, and status. Mandatory UX fixes UX-010-001, UX-010-002, and UX-010-003 are implemented in this branch.
- Product behavior evidence: `QuestionCard` now preserves hidden support before answer in support modes, reveals translation/explanation after answer in learning and mistake review, keeps active exam attempts free of support controls/reveal, and restores per-question session answer/support state when navigating back.
- Navigation evidence: learning bottom previous/next uses the active search-result collection; query changes reset to the first result; first/last controls are disabled. Mistake review bottom previous/next uses the current mistake collection. The top learning `Следующий` action was removed to avoid duplicate primary progression.
- `pnpm install` was run because the isolated worktree had no `node_modules`; the lockfile was unchanged and dependencies installed from the existing pnpm lock/cache.
- `pnpm run validate:content` passed: 460 category B fallback questions, 276 local image references.
- `pnpm run test` passed: 72 tests.
- `pnpm run build` passed and generated a service worker with 280 cached assets; Vite emitted the existing large-chunk warning.
- `pnpm run test:e2e` passed: 16 tests across `chromium` and `mobile`.
- `pnpm run preflight` passed, including feature-memory gate, repository baseline, validate, unit tests, build, and desktop/mobile e2e.
- `git diff --check` passed.
- Review follow-up focused e2e passed: `pnpm run build && pnpm exec playwright test -g "no matches|no mistakes"` ran the no-result learning search and empty mistake review tests across `chromium` and `mobile`; 4 passed.
- Review follow-up full e2e passed: `pnpm run test:e2e` rebuilt the app and ran 20 tests across `chromium` and `mobile`; 20 passed.
- Review follow-up whitespace check passed: `git diff --check`.
- Slice F overlay evidence: chose `content/image-overlays/question-explanation-overlays.manifest.json` plus `content/validation/question-image-overlays.evidence.json` as the durable overlay path. Shards are deferred until volume requires them.
- Slice F overlay evidence: added approved overlay `overlay-b-fallback-001-b13-explanation` for `b-fallback-001` / `question-image-b13`, referencing question fingerprint `a378cdcb51a67298a29274456c649c45b3424f02de2e32c2cd452c9395d8b59a`, metadata fingerprint `6b37a26f75ff0b8b68c6a2a51d03645ac95386849dfcb9fc86baf1130de6149b`, usage fingerprint `767a43d6cfbb28dcc8b55c4f0df6d28d5acbadb53b40df9a44da27a90cb9c82a`, relevance IDs `b001-highlight-gesture`, `b001-support-annotation`, and `b001-background-city`, and referenced 009 detail/region IDs only.
- Slice F validation evidence: added `scripts/content-image-overlays.mjs`, wired it into `pnpm run validate:content`, and added `pnpm run validate:overlays`. Validator rejects missing/stale 009 metadata/usage, missing relevance/detail/region IDs, wrong source roles, out-of-bounds geometry, non-local assets, and UI-authored relevance keys.
- Slice F UI evidence: `QuestionCard` renders overlays only when support is allowed, the question has been answered, and explanation is visible. Active exam attempts and pre-answer learning cards hide overlays. Image-backed questions without approved overlay data show the normal local image plus truthful fallback text after explanation reveal.
- Slice F test evidence pending final command matrix: added unit validator tests in `tests/content-image-overlays.test.mjs` and Playwright overlay assertions in `tests/e2e/app.spec.ts` for visible explanation overlays, pre-answer hidden state, and active exam hidden state.
- Final verification update after merged 009 sync: `pnpm run validate:overlays` passed with "Image explanation overlays validated."
- Final verification update after merged 009 sync: `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references.
- Final verification update after merged 009 sync: `pnpm run test` passed 116 tests, including new overlay validator tests.
- Final verification update after merged 009 sync: `pnpm run build` passed and generated a service worker with 280 cached assets; Vite emitted the existing large-chunk warning.
- Final verification update after merged 009 sync: first `pnpm run test:e2e` failed because the pre-existing timer test assumed wrap-around `Следующий`; this contradicted the implemented 010 first/last disabled boundary. The test was corrected to verify hidden-ticket timer preservation by navigating next then previous. Re-run `pnpm run test:e2e` passed 28 tests across `chromium` and `mobile`.
- Final verification update after merged 009 sync: `pnpm run preflight` passed, including feature-memory gate, repository baseline, validate, unit tests, build, and desktop/mobile e2e.
- Final verification update after merged 009 sync: Docker smoke partially passed. `make down` and `make build` passed, but `make up` failed because container name `/cabadrive` is already in use by container `7ed5bedd6e9292856ba08590fddbed9afc5c8f910a9e4f7dd48253af77d661f3`. Per parallel-agent safety, this Implementation Agent did not remove or rename that container. Cleanup `make down` removed only this worktree's compose network. Fallback runtime smoke passed with `pnpm exec vite preview --host 127.0.0.1 --port 5173 --strictPort` and `curl -fsS http://127.0.0.1:5173`, returning the HTML document; preview process was stopped.
- Docker smoke evidence: `make down` passed, `make build` passed, `make up` failed with Docker daemon conflict because container name `/cabadrive` is already in use by another container. Cleanup `make down` then removed only this worktree's compose network. As fallback runtime evidence, `pnpm exec vite preview --host 127.0.0.1 --port 5173 --strictPort` served the built app and `curl -fsS http://127.0.0.1:5173` returned the HTML document; the preview process was stopped.
- Review P2 final verification update: `pnpm run validate:overlays && pnpm run validate:content && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run preflight && git diff --check` passed. The run included 116 unit/content tests, 30 Playwright tests across `chromium` and `mobile`, and the new focused restored-answered-ticket search/timer scenario.

### Implementation Agent Feedback

- Superseded 2026-05-10: overlay implementation was ready to route only after 009 merged. PR #63 is now merged into `origin/main`, this branch was synchronized, and Slice F implementation used only merged 009 artifacts.
- Consider a future infrastructure task to avoid fixed Docker container-name collisions across parallel worktrees; current `container_name: cabadrive` blocks simultaneous `make up` smoke tests.
- Non-mandatory audit-derived tasks UX-010-004 through UX-010-006 should be routed separately after explicit disposition; they are documented but intentionally not implemented in this D/E pass.

### Architect Disposition Of Feedback

- Analyst clarification received: architectural memory now states that source-of-truth docs, consistency check, product audit, and validated task inventory are required gates inside `010`, not the final deliverable by themselves.
- Mandatory UX fixes D and E have existing Implementation Agent evidence and remain checked as implemented/verified in this process memory.
- Mandatory UX fix F is now implemented after feature `009` fully completed and merged into `origin/main`; final completion depends on the full verification matrix, review, and PR gates.
- Disposition: The 2026-05-10 question-scoped relevance clarification is accepted. Slice F must treat `009` shared metadata as visible-fact/ID input only and must use `009` per-question usage/relevance as the sole source for what gets highlighted, dimmed, treated as support, or treated as a distractor.
- Non-mandatory audit-derived tasks UX-010-004 through UX-010-006 may remain separate follow-ups only with explicit Orchestrator/Architect disposition; they do not replace mandatory D/E/F completion.
