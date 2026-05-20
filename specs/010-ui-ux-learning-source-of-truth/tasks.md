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

Historical note: T092-T106 record the earlier seed overlay implementation and validation. They are superseded for final completion by T159-T178, which require full current image-backed question overlay coverage.

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

- [x] T107 Implement additional audit-derived tasks only after they pass the final task consistency check and receive explicit disposition as in-scope for `010`.
- [x] T108 Keep each audit-derived implementation PR atomic and traceable to one or a small cluster of source-of-truth rules.
- [x] T109 Preserve `unofficial_b_fallback` clarity in every affected surface.
- [x] T110 Preserve local-first/offline behavior and avoid runtime network calls.
- [x] T111 Add tests and evidence required by each task's acceptance hook.
- [x] T112 Record completed task IDs, evidence, and any follow-up dispositions in Process Memory.

## Required Slice G: Final Gate And PR Readiness

- [x] T113 Confirm durable docs exist and are cross-linked.
- [x] T114 Confirm final documentation consistency check is recorded.
- [x] T115 Confirm full product audit is recorded.
- [x] T116 Confirm task inventory and final task consistency check are recorded.
- [x] T117 Confirm mandatory UX fix 1 is implemented and verified.
- [x] T118 Confirm mandatory UX fix 2 is implemented and verified.
- [x] T119 Historical gate closure before current-main overlay coverage audit: confirmed mandatory UX fix 3 was no longer waiting after completed feature `009` merged into `origin/main` and that seed Slice F implementation was verified against merged `009` artifacts. Superseded for final completion by T159-T178 because current `main` has only 1 approved overlay for 276 image-backed usages.
- [x] T120 Run `pnpm run validate:content`.
- [x] T121 Run `pnpm run test`.
- [x] T122 Run `pnpm run build`.
- [x] T123 Run `pnpm run test:e2e`.
- [x] T124 Run `pnpm run preflight`.
- [x] T125 Run `git diff --check`.
- [x] T126 For runtime-affecting changes, attempt Docker smoke with `make down`, `make build`, `make up`, smoke check `http://localhost:5173`, and `make down`; local `make up` was blocked by a shared `/cabadrive` container from another worktree, fallback `vite preview` smoke passed, and GitHub `docker-validation` passed.
- [x] T127 Confirm required checks are green on the current PR head after PR #88 follow-up push.
- [x] T128 Confirm no unresolved merge conflicts remain on the current PR head.
- [x] T129 Confirm no blocking review findings remain on PR #88 after GitHub review completes.
- [x] T130 Confirm final approval/merge mechanics are satisfied by GitHub/Orchestrator before merge.

## Review Requirements

- [x] T131 Review Agent verifies implementation stayed within the Orchestrator-assigned slice and worktree.
- [x] T132 Review Agent verifies source-of-truth docs are durable, Cabadrive-specific, and consistent with existing project constraints.
- [x] T133 Review Agent verifies the final documentation consistency check exists and has no unresolved blocker.
- [x] T134 Review Agent verifies the full product audit covers every surface named in this tasks file.
- [x] T135 Review Agent verifies atomic tasks trace from source-of-truth rule to implementation and evidence.
- [x] T136 Review Agent verifies post-answer auto reveal applies only to learning/support modes and not active exam attempts.
- [x] T137 Review Agent verifies bottom previous/next navigation has accessible labels, boundaries, mobile behavior, and state rules.
- [x] T138 Review Agent verifies image overlays depend on completed `009` per-question usage/relevance and are blocked/fenced when usage/relevance is unavailable, stale, or incomplete.
- [x] T139 Review Agent verifies no backend, runtime network, remote image, live AI, or live image-analysis dependency is introduced.
- [x] T140 Review Agent verifies `tasks.md` process memory and verification evidence are current before merge readiness.

## Architect Update After Question-Scoped Relevance Clarification

- [x] T141 Architect reads the new clarification that shared image metadata describes visible facts only and that importance/relevance belongs only to per-question usage.
- [x] T142 Architect updates `spec.md` so overlay implementation explicitly depends on completed `009` question-specific usage/relevance, not global shared-image importance.
- [x] T143 Architect updates `plan.md` so overlay records, validation, risks, and implementation guidance require `009` usage fingerprints and relevance roles for the current question.
- [x] T144 Architect updates this `tasks.md` with follow-up overlay tasks while preserving existing task history and implementation completion state.
- [x] T145 Architect keeps this pass limited to `spec.md`, `plan.md`, and `tasks.md`; no product code, content, durable docs, tests, commits, pushes, or PR state changes.
- [x] T146 Implementation Agent ensures overlay definitions cannot be created from shared `009` metadata alone; each active overlay must reference the current question's completed `009` usage/relevance.
- [x] T147 Implementation Agent ensures overlay validators reject UI-authored important/unimportant/critical/relevance roles that are not present in the current question's `009` usage record.
- [x] T148 Implementation Agent ensures fallback behavior for missing/stale `009` usage/relevance keeps the normal local image and explanation text without invented highlight/dim overlays.
- [x] T149 Review Agent verifies overlay examples and tests consume `answer_critical_highlight`, `supporting`, `distractor_trap`, and `background_irrelevant_dim` only from `009` per-question usage for the concrete ticket.

## PR #88 Follow-Up For PR #83 Overlay Bounds Finding

- [x] T150 Implementation Agent confirmed assigned follow-up worktree `/Users/chap/devel/cabadrive-010-main-verification-memory`, branch `codex/010-main-verification-memory`, PR #88, clean starting status, and no divergence from `origin/codex/010-main-verification-memory` after `git fetch origin`.
- [x] T151 Implementation Agent treated unresolved PR #83 thread `PRRT_kwDOSX65IM6A6Evh` / comment `3215029349` as a real product P2: overlay geometry was tied to the letterboxed image element frame instead of the rendered source bitmap when `b13.jpg` hit the 360px height constraint.
- [x] T152 Implementation Agent fixed overlay bounds so the question image frame is constrained by the loaded local image natural aspect ratio and the 360px height cap; the overlay still uses `inset: 0`, but the containing frame now matches the rendered bitmap rather than a letterboxed `object-fit: contain` box.
- [x] T153 Implementation Agent preserved overlay semantics: overlays remain hidden before answer, hidden in active exam attempts, visible only when support/explanation is visible in learning or mistake-review modes, and still consume only `009` per-question usage roles.
- [x] T154 Implementation Agent added Playwright geometry coverage for desktop-sized `b13.jpg` after answer/explanation reveal, asserting image natural dimensions, rendered image aspect, overlay bounds, and highlight/dim regions stay inside the rendered bitmap bounds.
- [x] T155 Implementation Agent reruns the full required verification matrix after feature memory is updated: `pnpm run validate:overlays`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check`.
- [x] T156 Implementation Agent treated PR #88 thread `PRRT_kwDOSX65IM6A6JjI` / comment `3215053435` as a real product P2: the previous passive `naturalSize` reset could clear dimensions for a just-loaded cached current image after navigation, causing the image frame to fall back to 620px and reintroducing overlay/source-bitmap drift.
- [x] T157 Implementation Agent keyed loaded natural image dimensions to the current asset source and removed the later reset effect; stale dimensions are ignored by source mismatch, while a cached current image load is not cleared after it has populated dimensions.
- [x] T158 Implementation Agent added Playwright coverage for cached image-path navigation from `b13.jpg` to preloaded `b173.jpg`, asserting the current image frame remains constrained by the new source natural dimensions after navigation/effect flushing rather than falling back to the generic 620px frame.

## Architect Update After Current-Main Overlay Coverage Audit

- [x] T159 Architect created an isolated worktree `/Users/chap/devel/cabadrive-010-overlay-architecture` from fresh `origin/main` on branch `codex/010-overlay-full-coverage-architecture`.
- [x] T160 Architect read `AGENTS.md`, repository constitution, relevant project docs, feature `009` memory, feature `010` memory, and current overlay/source files before editing.
- [x] T161 Architect audited current `origin/main` overlay coverage: 460 questions, 276 current image-backed question usages, 275 unique local image paths, 275 merged feature-009 image metadata entries, 276 merged feature-009 question usage/relevance records, and 1 approved feature-010 overlay.
- [x] T162 Architect decided that Slice F scope is full current image-backed question overlay coverage because merged feature `009` already covers all current image-backed usages. A seed overlay plus fallback is not enough for `010` completion.
- [x] T163 Architect updated `spec.md` acceptance criteria, functional requirements, negative scenarios, and validation requirements so current completion requires approved overlay coverage for all 276 current image-backed question usages.
- [x] T164 Architect updated `plan.md` so Slice F requires strict 276-of-276 current overlay coverage, question-scoped usage/relevance, no shared-metadata global importance, and coverage/evidence/tests.
- [x] T165 Architect updated this `tasks.md` with explicit Implementation Agent and Review Agent follow-up tasks while preserving historical implementation evidence.
- [x] T166 Architect kept this pass limited to `specs/010-ui-ux-learning-source-of-truth/spec.md`, `plan.md`, and `tasks.md`; no product code, content, durable docs, tests, scripts, adjacent feature memory, merges, or direct `main` changes.
- [x] T167 Implementation Agent updates overlay manifest structure or sharding as needed to hold approved overlays for every current image-backed question usage without hand-editing generated compatibility data.
- [x] T168 Implementation Agent creates approved overlay definitions for all 276 current image-backed question usages covered by merged feature `009`; each current image-backed question has exactly one approved current overlay unless Architect records a controlled exception with a replacement acceptance criterion.
- [x] T169 Implementation Agent ensures every approved current overlay references the concrete question's `009` usage fingerprint, relevance IDs, detail IDs, and region IDs; overlays must not derive importance, irrelevance, highlight, dim, support, or distractor semantics from shared image metadata alone.
- [x] T170 Implementation Agent ensures every approved current overlay has at least one `answer_critical_highlight` region and enough `background_irrelevant_dim`, `supporting`, or `distractor_trap` geometry to reduce irrelevant visual load for that exact question context.
- [x] T171 Implementation Agent ensures reused-image cases, including the existing reused image covered by feature `009`, receive separate overlays keyed to each concrete question usage rather than copied global image importance.
- [x] T172 Implementation Agent updates overlay validation so strict mode fails when any current image-backed question usage with approved `009` usage/relevance lacks exactly one approved overlay and approved overlay evidence.
- [x] T173 Implementation Agent updates overlay validation/tests so images not used by the current question cannot receive `010` importance/relevance or overlay dim/highlight evaluation.
- [x] T174 Implementation Agent updates overlay evidence so every approved current overlay records reviewer, provenance, image hash, question fingerprint, `009` metadata fingerprint, `009` usage fingerprint, overlay fingerprint, role-source checks, and stale-data checks.
- [x] T175 Implementation Agent adds tests proving missing current overlay coverage fails, duplicate current overlay coverage fails, stale overlay evidence fails, UI-authored relevance roles fail, shared-metadata-only overlays fail, and a valid current-question overlay passes.
- [x] T176 Implementation Agent adds or extends representative user-facing tests for overlays after explanation reveal, hidden pre-answer state, active exam hidden state, full-coverage data loading, `b-fallback-001`, and at least one reused-image/question-specific relevance case.
- [x] T177 Implementation Agent runs and records `pnpm run validate:overlays`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, `git diff --check`, and Docker smoke evidence or an exact unrelated blocker.
- [x] T178 Review Agent verifies the full-coverage overlay slice against this updated architecture: 276 current image-backed usages, 276 approved overlays, no global shared metadata importance, question-specific `009` role consumption only, no fallback-as-completion, and validation/evidence/tests proving the coverage gate.

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
- Architect update on 2026-05-10 after current-main overlay coverage audit: seed overlay support is not sufficient now that merged `009` covers all current image-backed usages. Slice F completion requires full current overlay coverage: 276 approved overlays for 276 current image-backed question usages, with strict validation/evidence/tests.
- Architect update on 2026-05-10 after current-main overlay coverage audit: fallback remains allowed only for future/stale/out-of-scope cases where approved `009` usage/relevance or overlay validation is unavailable. The fallback is not a completion path for the current merged-009 bank.
- Architect update on 2026-05-10 after current-main overlay coverage audit: images not used by the concrete current question must not receive overlay importance/relevance evaluation; `010` consumes question-specific `009` usage roles only.
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
- Current-main overlay audit from `/Users/chap/devel/cabadrive-010-overlay-architecture` found `content/image-overlays/question-explanation-overlays.manifest.json` has 1 approved overlay while `content/image-metadata/question-images.manifest.json` has 276 question usage records for 276 current image-backed question usages.

### Dead Ends

- Docker smoke could not complete `make up` because another Docker container already owns the fixed name `/cabadrive`. Per the user boundary, this Implementation Agent did not remove or rename another agent's container.

### Known Issues

- Feature `008` is now present from `origin/main` and `Материалы` was included in the product audit.
- Superseded 2026-05-10: image overlay implementation was previously blocked until completed feature `009` shared metadata and per-question usage/relevance mappings merged into `origin/main`; PR #63 is now merged and this branch was synchronized to `78e0176`.
- Overlay implementation also cannot safely proceed if completed `009` shared metadata exists but the current question's `009` usage/relevance record is missing, stale, incomplete, or lacks the roles needed for dim/highlight behavior.
- The request is broad enough to generate many follow-up tasks; Orchestrator should keep implementation PRs narrow and evidence-gated.
- Docker runtime smoke remains blocked by the shared `/cabadrive` container-name conflict; `make build` succeeded, but `make up` did not start this worktree's container.
- As of the Analyst clarification, D/E/F are mandatory implementation slices in `010`; docs, consistency checks, audit, and task inventory are gates rather than the final deliverable.
- As of the current-main overlay coverage audit, the existing `010` overlay implementation remains incomplete for the mandatory overlay fix because it covers only `b-fallback-001`; the current architecture now requires full current coverage across all 276 image-backed question usages.

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
- PR #88 is a follow-up branch correcting overlay bounds and process memory after PR #83. It must not pre-claim its own current review, required-check, merge-conflict, approval, merge, or post-merge main-verification gates inside the commit; GitHub and the Orchestrator complete those gates after the pushed head is reviewed.
- PR #88 follow-up P2 from old PR #83 review: unresolved thread `PRRT_kwDOSX65IM6A6Evh`, comment `3215029349`, found that desktop-sized image overlays drifted when `b13.jpg` hit the `max-height: 360px` constraint. The image element used a wider `object-fit: contain` frame while manifest rects were source-image percentages, so overlay regions were positioned against the letterboxed frame rather than the visible bitmap.
- Fix decision: `QuestionImageFigure` now records the loaded local image natural dimensions and constrains `.question-image-frame` by `min(100%, 620px, 360px * naturalWidth / naturalHeight)`. The actual image renders at natural aspect ratio inside that frame, and `.image-explanation-overlay { inset: 0 }` remains correct because the containing frame now matches the rendered bitmap/source aspect instead of a letterboxed box.
- Overlay support semantics were intentionally unchanged for this P2 fix: support remains hidden before answer, hidden during active exam attempts, visible only after answer/explanation in support modes, and role semantics still come only from approved `009` per-question usage/relevance.
- Test coverage added in `tests/e2e/app.spec.ts`: `image explanation overlay bounds follow the rendered bitmap when image height is constrained` loads `b13.jpg` at desktop dimensions, answers the first learning ticket, verifies the overlay is visible after explanation reveal, asserts natural dimensions `537x344`, verifies rendered image aspect matches source aspect at the 360px height constraint, and checks overlay/highlight/dim region bounds stay within the rendered bitmap.
- Focused verification evidence for overlay-bounds P2 fix before final process-memory preflight: `pnpm run build && pnpm exec playwright test -g "image explanation overlay bounds"` passed 2 tests across `chromium` and `mobile`; `pnpm run validate:overlays`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, and `pnpm run test:e2e` passed. First `pnpm run preflight` correctly failed only because product paths changed before this `tasks.md` process-memory update.
- PR #88 review finding P2: thread `PRRT_kwDOSX65IM6A6JjI`, comment `3215053435`, found that `QuestionImageFigure` cleared `naturalSize` in a passive effect after `imagePath` changed. If the next local image came from cache and fired `load` before that effect flushed, the handler could store current dimensions and the effect could immediately clear them, leaving the frame at the 620px fallback with no second load event.
- Fix decision: `QuestionImageFigure` now stores `{ src, width, height }`, derives the frame width only when the stored `src` matches the current asset URL, ignores stale load events whose DOM `src` no longer matches the current source, and no longer clears natural size in a later effect. A new image without dimensions temporarily falls back, but a cached current image load cannot be wiped out after it succeeds.
- Test coverage added in `tests/e2e/app.spec.ts`: `cached image path navigation keeps the frame keyed to the current source dimensions` preloads `b173.jpg`, navigates from the first image-backed learning ticket to the second, waits for cached navigation/effect flushing, and asserts the rendered frame/image use `573x367` source dimensions with the 360px height cap instead of the 620px fallback.
- Focused verification evidence for the cached-image P2 fix before final process-memory preflight: `pnpm run build` passed, the first focused Playwright run surfaced that the new image-width assertion needed a 2px frame-border tolerance, and after that adjustment `pnpm exec playwright test -g "image explanation overlay bounds|cached image path"` passed 4 tests across `chromium` and `mobile`.

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
- PR #83 merge evidence: `origin/main` contains `870c7f9 [codex] Implement UI UX learning overlays (#83)` after feature `009` commit `78e0176`; PR #83 was merged from head `97babbb`.
- PR #83 required-check evidence on `97babbb`: `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` all passed.
- PR #83 final gate evidence: no unresolved merge conflicts remained before merge, the old P2 review thread was resolved, read-only review passed, GitHub AI Review passed, and final approval/merge mechanics were satisfied before PR #83 merged.
- Review Agent Pascal verified review requirements T131-T140 on `97babbb`, including scope/worktree, durable docs, consistency audit, task traceability, support-mode-only reveal, bottom navigation accessibility/state behavior, 009-dependent overlays, no backend/runtime-network/live-AI dependency, and current process memory.
- Review Agent Pascal verified T149 on `97babbb`: overlay examples and tests consume `answer_critical_highlight`, `supporting`, `distractor_trap`, and `background_irrelevant_dim` only from `009` per-question usage for the concrete ticket.
- Post-PR #83 main verification evidence: worktree `/Users/chap/devel/cabadrive-main-010-verification` verified `origin/main` at `870c7f9514404b36cf75954c3c39814770495342`; `pnpm install --frozen-lockfile`, `pnpm run validate:overlays`, `pnpm run validate:content`, `pnpm run test` (116/116), `pnpm run build`, `pnpm run test:e2e` (30/30), `pnpm run preflight` (including 30/30 e2e), and `git diff --check` all passed. Vite emitted only the existing large-chunk warning.
- Post-PR #83 main verification E2E evidence included post-answer support/overlay visibility, bottom navigation/search state, no empty fallback, active exam support hidden, answered timer restore, and local-first/offline scenarios.
- Final main verification for the PR #88 follow-up is intentionally not encoded as complete before merge; the Orchestrator will perform and record it after PR #88 merges.
- Follow-up process-memory branch evidence: `/Users/chap/devel/cabadrive-010-main-verification-memory` on `codex/010-main-verification-memory` updated only this `tasks.md`; `pnpm run validate:content`, `pnpm run validate:overlays`, `pnpm run test` (116/116 after `pnpm install --frozen-lockfile` restored missing `node_modules`), and `git diff --check` passed.
- PR #88 overlay-bounds verification evidence, not a current-PR final gate claim: after process-memory update, `pnpm run preflight` passed, including feature-memory gate, repository baseline, validate, 116 unit/content tests, build, and 32 Playwright tests across `chromium` and `mobile`; `git diff --check` passed. With that PR #88 head, old PR #83 P2 thread `PRRT_kwDOSX65IM6A6Evh` / comment `3215029349` could be resolved after review confirmed the pushed head.
- PR #88 runtime smoke evidence: `make build` passed and built Docker image `cabadrive:local`; `make up` failed because fixed container name `/cabadrive` is already in use by container `938bee2b6df6e436f75470c15ff1aa3d5034a8c3b8c1fef4f37fdeac9a449960`. Per parallel-agent safety, this Implementation Agent did not remove or rename that container. Cleanup `make down` removed only this worktree's compose network. Fallback preview smoke passed with `pnpm exec vite preview --host 127.0.0.1 --port 5173 --strictPort` and `curl -fsS http://127.0.0.1:5173`, returning the HTML document; preview process was stopped. In-app Browser smoke was attempted, but the Browser plugin reported no available browser instances.
- PR #88 cached-image natural-size P2 verification update, not a current-PR final gate claim: after code, test, and process-memory changes for thread `PRRT_kwDOSX65IM6A6JjI`, `pnpm run validate:overlays` passed; `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references; `pnpm run test` passed 116 tests; `pnpm run build` passed and generated a service worker with 280 cached assets, with only the existing large-chunk warning; `pnpm run test:e2e` passed 34 Playwright tests across `chromium` and `mobile`; `pnpm run preflight` passed, including feature-memory gate, repository baseline, validate, 116 unit/content tests, build, and 34 Playwright tests; `git diff --check` passed. With that PR #88 head, thread `PRRT_kwDOSX65IM6A6JjI` / comment `3215053435` could be resolved after review confirmed the pushed head.
- PR #88 process-memory P2 verification update for thread `PRRT_kwDOSX65IM6A627V` / comment `3215286636`: current-PR gate tasks T127-T130 are intentionally unchecked until GitHub/Orchestrator verify checks, conflicts, review findings, approval, and merge mechanics on the pushed head; `pnpm run validate:overlays`, `pnpm run validate:content`, and `pnpm run test` passed for this process-memory-only correction. This thread can be resolved after review confirms this pushed head.
- Final disposition for non-mandatory audit-derived follow-ups T107-T112: UX-010-004 through UX-010-006 were documented as separate follow-ups in `docs_project/project/frontend/ui-ux-product-audit.md` and explicitly not required for mandatory D/E/F completion. No additional audit-derived implementation was bundled into `010`; mandatory customer tasks were implemented; `unofficial_b_fallback` clarity, local-first/offline behavior, tests, and evidence remained preserved by PR #83, PR #88, and PR #93 validation.
- PR #88 post-merge gate closure for T127-T130: PR #88 merged at `2026-05-10T18:18:40Z` with head `c3e8b87582d7178eb0bab2b2162b1c0830ca18de`; required checks were green, review blockers were resolved, merge conflicts were clean/merged, and final merge mechanics completed outside the PR before this process-memory-only closure.
- Final main state after PR #93: `origin/main` head `c6076e580f2c59169957800fd2c80eacac3ca328`. Final validation on main passed `pnpm run validate:overlays`, `pnpm run validate:content`, `pnpm run test` with 116/116 tests passing, `git diff --check`, and targeted Playwright with 8/8 tests passing.
- Final closure worktree evidence: `/Users/chap/devel/cabadrive-010-019-final-task-closure` on branch `codex/010-019-final-task-closure` was created from `origin/main` at `c6076e580f2c59169957800fd2c80eacac3ca328`; edited only this file and `specs/019-feature-009-memory-closure/tasks.md`; `pnpm run validate:content`, `pnpm run validate:overlays`, `pnpm run test`, and `git diff --check` passed. The first `pnpm run test` attempt failed only because the fresh worktree had no `node_modules` and `tests/domain.test.mjs` could not import `typescript`; `pnpm install --frozen-lockfile` installed dependencies without tracked-file changes, then `pnpm run test` passed 116/116.
- Full overlay coverage implementation worktree evidence: `/Users/chap/devel/cabadrive-010-overlay-full-coverage-slice` on branch `codex/010-overlay-full-coverage-slice` was rebased onto current `origin/main` after PR #113 merged; Git skipped the already-applied architecture commit and the work proceeded from the merged main baseline.
- Full overlay coverage data evidence: `scripts/content-image-overlays.mjs --write-current-overlays` generated `content/image-overlays/question-explanation-overlays.manifest.json` and `content/validation/question-image-overlays.evidence.json` from approved feature `009` per-question usage/relevance records. Result: 276 approved overlays, 276 approved overlay evidence entries, 276 unique current image-backed question usages, 275 unique local image paths, and zero duplicate question overlays.
- Full overlay role evidence: every approved current overlay contains at least one `answer_critical_highlight` region and at least one non-critical `background_irrelevant_dim`, `distractor_trap`, or `supporting` region sourced from the same concrete question's `009` usage/relevance. The generated corpus contains 290 answer-critical regions, 238 background dim regions, 188 distractor regions, and 256 supporting regions.
- Reused-image evidence: the reused `content/assets/questions/source-bandinopla-testdeconducir-b/b2.jpg` image now has two separate overlays, `overlay-b-fallback-256-question-image-b2-explanation` and `overlay-b-fallback-303-question-image-b2-explanation`, with different question IDs, usage fingerprints, and relevance IDs.
- Strict overlay validator evidence: validation now fails for missing current overlay coverage, duplicate current overlays, duplicate/stale overlay evidence, stale 009 usage/metadata fingerprints, UI-authored relevance keys, shared-metadata-only role assignment, wrong-role sourceRole claims, malformed/out-of-bounds geometry, overlays for non-image questions, missing local assets, and overlays not tied to approved current 009 question usage.
- Test evidence for full overlay coverage: `tests/content-image-overlays.test.mjs` covers valid current overlays, missing/duplicate strict coverage, stale evidence, stale/missing 009 usage, UI-authored relevance keys, shared-metadata-only overlays, non-current/non-image overlays, and deterministic bundle generation. `tests/e2e/app.spec.ts` covers visible explanation overlays after answer, hidden pre-answer and active-exam states, full-coverage data loading, `b-fallback-001`, and reused-image question-specific entries.
- Full overlay coverage verification evidence: `pnpm run validate:overlays` passed with `276 approved overlays for 276 current image-backed question usages`; `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references; `pnpm run test` passed 151/151 tests; `pnpm run build` passed and generated a service worker with 280 cached assets, with only the existing large-chunk warning; `pnpm run test:e2e` passed 36 Playwright tests across `chromium` and `mobile`; `pnpm run preflight` passed with feature-memory gate, repo baseline, content validation, unit/content tests, build, and e2e; `git diff --check` passed after the process-memory update.
- Docker smoke evidence: default `make up` after successful `make build` was blocked by an unrelated host port conflict on `0.0.0.0:5173`; this worktree's compose container/network were cleaned up with `make down`. Isolated Docker smoke then passed with `CABADRIVE_HOST_PORT=5174 make up`, `curl -fsS http://127.0.0.1:5174`, and `CABADRIVE_HOST_PORT=5174 make down`.
- PR #115 Review Agent P1/P2 correction evidence: Review Agent found that generated non-critical overlay geometry could fully cover answer-critical highlights, including full-frame `background_irrelevant_dim` rectangles. The generator now reroutes `background_irrelevant_dim`, `supporting`, and `distractor_trap` rectangles that would fully mask critical regions; the validator now rejects full-frame background dim rectangles and any non-critical region that fully covers an `answer_critical_highlight` region.
- PR #115 geometry correction data evidence: overlays/evidence were regenerated with `scripts/content-image-overlays.mjs --write-current-overlays`; the corpus still has 276 approved overlays and 276 approved evidence entries for 276 current image-backed question usages. A post-regeneration geometry audit found 0 non-critical regions fully covering answer-critical regions and 0 full-frame background dim regions.
- PR #115 geometry correction test evidence: `tests/content-image-overlays.test.mjs` now includes a blocking validator regression test for full-frame background dim rectangles plus `supporting` and `distractor_trap` regions that fully mask a critical region. After the correction, `pnpm exec node --test tests/content-image-overlays.test.mjs` passed 9/9 subtests; `pnpm run validate:overlays` passed with `276 approved overlays for 276 current image-backed question usages`; `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references; `pnpm run test` passed 152/152 tests; `pnpm run build` passed and generated a service worker with 280 cached assets, with only the existing large-chunk warning; `pnpm run test:e2e` passed 36 Playwright tests. The first `pnpm run preflight` attempt for this correction failed only because this process-memory entry had not yet been added, which is the expected feature-memory gate behavior; after this process-memory update, `pnpm run preflight` passed with feature-memory gate, repo baseline, content validation, unit/content tests, build, and e2e.
- PR #115 explicit-region P2 correction evidence: AI Review found the overlay inference widened explicit 009 `regionIds` through detail/object mappings, including `b-fallback-001` where `region-highlighted-arm` expanded to `region-foreground-cyclist`. `inferredRegionIdsForRelevance` now treats explicit relevance `regionIds` as authoritative and only infers regions from detail/object mappings when a relevance omitted `regionIds`.
- PR #115 explicit-region data evidence: overlays/evidence were regenerated with `scripts/content-image-overlays.mjs --write-current-overlays`; `b-fallback-001` now keeps the answer-critical region scoped to `region-highlighted-arm` with rect `{ x: 5, y: 5, width: 38, height: 35 }`, and does not include `region-foreground-cyclist` in that critical region.
- PR #115 explicit-region test evidence: `tests/content-image-overlays.test.mjs` now covers that generated overlays preserve explicit 009 `regionIds` over detail/object inference and that validation rejects an overlay that widens an explicit relevance region through an inferred region. Targeted `pnpm exec node --test tests/content-image-overlays.test.mjs` passed 10/10 subtests after regeneration; `pnpm run validate:overlays` passed with `276 approved overlays for 276 current image-backed question usages`; `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references; `pnpm run test` passed 153/153 tests; `pnpm run build` passed and generated a service worker with 280 cached assets, with only the existing large-chunk warning; `pnpm run test:e2e` passed 36 Playwright tests; `pnpm run preflight` passed with feature-memory gate, repo baseline, content validation, unit/content tests, build, and e2e.
- PR #115 post-merge T178 closure evidence: Review Agent verified 276 current image-backed usages, 276 approved overlays, no global shared metadata importance, question-specific feature `009` role consumption, no fallback-as-completion, and no blocking findings. PR #115 merged to `origin/main` at `451d479` with green checks. Local/orchestrator final audit on `origin/main` found overlays=276, evidence=276, duplicates=0, fullDims=0, coveringCount=0, and `b-fallback-001` critical region only `region-highlighted-arm`.

### Implementation Agent Feedback

- Superseded 2026-05-10: overlay implementation was ready to route only after 009 merged. PR #63 is now merged into `origin/main`, this branch was synchronized, and Slice F implementation used only merged 009 artifacts.
- Consider a future infrastructure task to avoid fixed Docker container-name collisions across parallel worktrees; current `container_name: cabadrive` blocks simultaneous `make up` smoke tests.
- Non-mandatory audit-derived tasks UX-010-004 through UX-010-006 should be routed separately after explicit disposition; they are documented but intentionally not implemented in this D/E pass.

### Architect Disposition Of Feedback

- Analyst clarification received: architectural memory now states that source-of-truth docs, consistency check, product audit, and validated task inventory are required gates inside `010`, not the final deliverable by themselves.
- Mandatory UX fixes D and E have existing Implementation Agent evidence and remain checked as implemented/verified in this process memory.
- Superseded disposition: earlier process memory treated mandatory UX fix F as implemented after feature `009` merged into `origin/main`; the current-main coverage audit narrows that to seed overlay support only. Final mandatory UX fix F completion now depends on T167-T178 full current overlay coverage and verification.
- Disposition: The 2026-05-10 question-scoped relevance clarification is accepted. Slice F must treat `009` shared metadata as visible-fact/ID input only and must use `009` per-question usage/relevance as the sole source for what gets highlighted, dimmed, treated as support, or treated as a distractor.
- Disposition: The 2026-05-10 current-main overlay coverage audit is accepted. Implementation must not claim `010` complete with the one approved overlay currently present on `main`; it must add full current image-backed overlay coverage or return to Architect with a concrete alternative scope decision and replacement acceptance criterion before product changes proceed.
- Non-mandatory audit-derived tasks UX-010-004 through UX-010-006 may remain separate follow-ups only with explicit Orchestrator/Architect disposition; they do not replace mandatory D/E/F completion.
