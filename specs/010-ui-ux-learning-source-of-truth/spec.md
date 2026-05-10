# Spec: UI/UX And Learning Source Of Truth

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/010-ui-ux-learning-source-of-truth/`.
- Assigned Architect worktree: `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake`.
- Assigned branch: `codex/010-ui-ux-learning-intake`.
- Architect scope: create and maintain only `spec.md`, `plan.md`, and `tasks.md`. Product code, tests, runtime files, durable docs, commits, pushes, PRs, and reviews are out of scope for this Architect pass.

## Goal

Create a durable Cabadrive UI/UX and learning-experience source of truth, prove it is internally consistent with current project constraints and adjacent features, audit every current learner-facing product surface against it, produce a validated atomic task inventory, and implement the three mandatory learner experience fixes in this same feature: post-answer automatic reveal in support modes, bottom previous/next navigation, and image explanation overlays based on completed feature `009` question-specific image usage/relevance. The docs, consistency check, product audit, and validated task inventory are gates inside `010`, not the final deliverable by themselves.

## Scope

In scope for this feature:

- Create durable UI/UX source-of-truth documentation under `docs_project/`.
- Create durable learning-experience source-of-truth documentation for exam-focused learning flows, bilingual support, feedback timing, and learning-material design.
- Create durable image explanation overlay guidance that depends on feature `009` shared image metadata plus per-question image usage/relevance and does not define a competing metadata or relevance schema.
- Capture the research basis from the Analyst intake: stable usability heuristics, WCAG 2.2 accessibility expectations, learning-science findings on active recall/distributed practice/feedback, multimedia signaling, and Duolingo product/research lessons that fit Cabadrive.
- Translate generic UI/UX and learning guidance into Cabadrive-specific rules.
- Preserve existing product constraints:
  - official Spanish source text remains primary;
  - Russian translations, explanations, guide content, and image overlays are unofficial learning support;
  - current practice content remains labeled `unofficial_b_fallback`;
  - MVP remains static, local-first, offline-capable, and backend-free;
  - active exam attempts hide translation and explanation support.
- Perform and record a final documentation consistency check before product audit begins.
- Audit all current user-facing surfaces against every source-of-truth point.
- Decompose audit findings into atomic implementation tasks for `010`, with non-mandatory findings separated only after explicit disposition.
- Perform and record a final task consistency check before implementation begins.
- Implement the three mandatory UX fixes in `010` after the relevant gates pass:
  - after answer selection, automatically reveal translation and explanation only in learning/support modes;
  - move primary next navigation to the bottom of the learning flow and add previous navigation;
  - add explanation-time image overlays/dimming from completed `009` question-specific usage/relevance after `009` is fully completed and merged into `main`; until then this slice remains in an explicit waiting state and may not consume unmerged `009` artifacts.
- Update process memory and verification evidence in this feature folder as implementation proceeds.

Out of scope:

- Creating a backend, runtime API, cloud sync, analytics, remote content service, or live AI dependency.
- Replacing the current unofficial fallback question bank or claiming complete official GCBA category B coverage.
- Replacing official Spanish question text with Russian text as the primary learning object.
- Adding Duolingo-style streaks, rewards, or retention mechanics as part of this feature unless a later source-of-truth/audit task explicitly justifies them for exam readiness.
- Redesigning visual branding for its own sake without a documented source-of-truth gap.
- Redefining the feature `009` image metadata schema.
- Implementing image overlays from subjective UI-only judgments, global shared-image importance flags, or shared metadata alone when completed `009` per-question usage/relevance is missing, stale, or incomplete.
- Editing `specs/008-learning-materials-ui/*` or `specs/009-image-metadata-learning-support/*`; use them as dependency context only.
- Merging directly to `main`.

## Assumptions

- The user wants stable current UX, accessibility, and learning-practice guidance, not short-lived visual trends.
- The requested source-of-truth docs should live in durable project documentation, not only inside this feature folder.
- The product audit and task inventory can be created by an Implementation Agent after durable docs exist, because Architect may define the required format and gates but does not edit durable docs in this pass.
- The documentation, consistency, audit, and inventory gates must pass before mandatory product-code slices are treated as ready, but those gates do not complete `010` by themselves.
- Feature `009` implementation artifacts can be consumed only after `009` is completed and merged into `main`; until then `010` may use only `009` feature memory/spec as the overlay contract.
- Feature `008` may already expose topic materials; this feature must audit that surface if it is present in the implementation branch.
- Feature `009` owns question-neutral shared image metadata, per-question image usage/relevance roles, answer-critical visual detail references, and image/explanation alignment evidence; this feature owns how completed question-specific usage/relevance is presented in UI overlays.
- Shared `009` image metadata describes visible objects/details/regions and never decides global importance or irrelevance. `010` overlay presentation must consume roles such as `answer_critical_highlight`, `supporting`, `distractor_trap`, and `background_irrelevant_dim` only from the concrete question's `009` usage/relevance record.
- Automatic post-answer reveal applies to learning mode, mistake review, and any future support/materials practice surface where scaffolding is allowed. It must not apply to active exam attempts.
- After answer selection, both question/answer translations and the relevant learning explanation should become visible, because the learner has already completed active recall.
- Previous/next navigation should be mode-specific and preserve learner context rather than forcing global question-bank movement.

## User Stories

### User Story 1

As a product maintainer, I want one durable UI/UX source of truth, so that future interface changes do not contradict accessibility, learning, or Cabadrive-specific exam-prep rules.

### User Story 2

As a Russian-speaking learner, I want translations and explanations to appear after I answer in learning/support modes, so that I can learn from the attempt without hunting for another toggle.

### User Story 3

As a learner finishing feedback on a question, I want previous and next navigation at the bottom of the flow, so that moving through questions is natural on mobile and keyboard.

### User Story 4

As a learner viewing an image-backed explanation, I want details that are irrelevant for this specific question dimmed and answer-critical details for this specific question kept prominent, so that I understand the visual cue that matters for the answer.

### User Story 5

As a reviewer, I want a traceable audit from source-of-truth principle to product gap to task, so that implementation PRs can be checked against evidence instead of preference.

## Acceptance Criteria

1. Given implementation begins, `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist in `specs/010-ui-ux-learning-source-of-truth/`.
2. Given source-of-truth docs are created, they live under durable `docs_project/` locations and are referenced from existing project documentation where appropriate.
3. Given source-of-truth docs are created, they summarize or cite the research basis from the Analyst intake and distinguish research-backed rules from product-specific decisions.
4. Given the docs define UI/UX principles, they include Cabadrive-specific guidance for status visibility, bilingual content, mobile-first interaction, keyboard operation, focus visibility, predictable controls, target sizing, text hierarchy, local/offline assets, and minimal exam-focused surfaces.
5. Given the docs define learning-experience principles, they include active recall, immediate post-answer feedback, explanation after attempt, weak-topic review, distributed review, useful interleaving, self-explanation prompts where appropriate, and avoidance of passive rereading as the main loop.
6. Given the docs define bilingual support rules, official Spanish text remains primary and Russian translations/explanations remain clearly unofficial learning support.
7. Given the docs define mode rules, active exam attempts continue to hide translations, explanations, and image overlays that reveal answer-critical hints.
8. Given the docs define content-status rules, `unofficial_b_fallback` remains clear and no UI implies a complete official GCBA category B question bank.
9. Given the docs define multimedia rules, image-backed explanations require signaling question-relevant visual details, reducing visual load irrelevant to the current question, keeping labels near referenced regions, avoiding decorative study imagery, and using only local offline assets.
10. Given image overlay rules are documented, they depend on completed feature `009` per-question image usage/relevance mappings and do not create a competing source for answer-critical, supporting, distractor, or background/irrelevant roles.
11. Given completed feature `009` question usage/relevance is unavailable, stale, or incomplete for a question image, overlay implementation for that question is blocked or shows a non-misleading fallback; it must not invent highlight or dim regions from shared metadata alone.
12. Given documentation drafting is complete, a final documentation consistency check is recorded before product audit starts.
13. Given the final documentation consistency check is recorded, it confirms no unresolved contradiction among the new docs, `.specify/memory/constitution.md`, `docs_project/`, `docs/specify/`, feature `008`, feature `009`, and the research basis.
14. Given product audit begins, every source-of-truth point is checked against current product behavior or marked not applicable with a reason.
15. Given product audit is complete, it covers status/onboarding, primary navigation, learning question flow, answer feedback, translation/explanation support, image-backed questions, exam mode, mistake review, vocabulary, CABA/RF guide, topic materials from `008` if present, search, progress/reset, mobile layout, keyboard/focus behavior, offline/status surfaces, and content-source/status surfaces.
16. Given audit findings exist, each gap is decomposed into an atomic proposed task with source-of-truth reference, affected surface, acceptance hook, verification hook, and suggested PR slice.
17. Given the proposed task inventory is complete, a final task consistency check is recorded before implementation tasks are started.
18. Given the final task consistency check is recorded, it confirms tasks do not contradict each other, the source-of-truth docs, feature `008`, feature `009`, exam-mode restrictions, or local-first constraints.
19. Given documentation, consistency, audit, and task-inventory gates pass, they unlock implementation slices inside `010`; they do not by themselves satisfy feature completion.
20. Given mandatory UX fixes D/E/F are in scope, `010` is not complete until D and E are implemented and F is either implemented after merged `009` input or explicitly waiting because `009` is not yet merged into `main`.
21. Given learning or mistake review mode and the learner selects an answer, question translation, answer translations, and the learning explanation are revealed automatically after the attempt.
22. Given active exam simulation is in progress and the user selects an answer, translation, explanation, and answer-revealing image overlay support remain hidden until exam review/completion behavior explicitly allows support.
23. Given learning navigation is implemented, `Следующий` or equivalent next control appears at the bottom of the question flow where feedback/explanation reading ends.
24. Given learning navigation is implemented, `Предыдущий` or equivalent previous control exists with clear boundary behavior at the first item.
25. Given previous/next navigation is implemented, selected answers, revealed feedback, search/mode context, and current collection position are preserved or reset according to explicit mode rules documented in the source of truth and tested.
26. Given feature `009` has not been fully completed and merged into `main`, overlay implementation remains waiting and must not consume local `009` worktree files, feature branches, draft PR artifacts, or invented metadata.
27. Given feature `009` is fully completed and merged into `main`, `010` syncs with `main` and implements image explanation overlays rather than leaving the mandatory overlay fix as backlog.
28. Given an image-backed explanation is shown and approved `009` shared metadata, per-question usage/relevance, and overlay definitions exist, the UI dims or de-emphasizes regions marked irrelevant/background for that concrete question while keeping details marked answer-critical for that same question prominent.
29. Given overlay definitions are introduced, they are stored durably with clear ownership, provenance, image/question/answer linkage, and stale-data validation tied to image hash, question fingerprint, and `009` metadata/usage fingerprints.
30. Given verification runs for implementation PRs, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check` pass or exact unrelated blockers are recorded.
31. Given runtime-affecting changes are included, Docker contract evidence is recorded with `make build`, `make up`, a smoke check at `http://localhost:5173`, and `make down`, unless Orchestrator scopes the slice as documentation-only.
32. Given review starts, Review Agent can trace changed behavior to this feature memory, source-of-truth docs, audit evidence, and task evidence.
33. Given an overlay definition references shared image metadata but lacks the current question's completed `009` usage/relevance record, validation fails or the overlay remains disabled.
34. Given an overlay definition or UI component assigns its own important/unimportant/relevance role not present in `009` per-question usage, review fails.
35. Given an image is not used by the current question, `010` does not define importance/relevance or overlay dimming for that image.

## Negative Scenarios

- A generic UX advice document that does not translate guidance into Cabadrive rules does not satisfy this feature.
- Source-of-truth docs that contradict existing Spanish-primary, unofficial-Russian-support, local-first, or exam-mode restrictions are not acceptable.
- A product audit that samples only the question card and omits navigation, status surfaces, materials, vocabulary, guide, mobile, accessibility, or offline surfaces is incomplete.
- A task inventory that contains broad redesign epics without atomic acceptance and verification hooks is incomplete.
- Automatically revealing translation/explanation before the learner answers weakens active recall and is not acceptable for this request.
- Automatically revealing translation/explanation during an active exam attempt violates the exam simulation boundary.
- Moving only a top toolbar `Следующий` button without bottom navigation where feedback ends does not satisfy the navigation fix.
- Adding a next button without previous navigation does not satisfy the navigation fix.
- Image dimming or highlights based on designer guesses, hard-coded arbitrary decoration, or visual inspection unlinked to `009` metadata is not acceptable.
- Image dimming or highlights based on global shared-image important/unimportant flags are not acceptable; importance and irrelevance must come from `009` per-question usage/relevance for the current question.
- Overlay data that is not tied to image/question/metadata fingerprints can become stale and is not acceptable for merge readiness.
- A fallback that silently hides missing overlay metadata while claiming the explanation is image-highlighted is misleading.
- Introducing runtime network calls, a backend, remote image fetches, or live AI/image analysis violates the product contract.

## Functional Requirements

- FR-001: Create durable UI/UX source-of-truth docs under `docs_project/`.
- FR-002: Create durable learning-experience source-of-truth docs under `docs_project/`.
- FR-003: Create durable image explanation overlay guidance under `docs_project/`, explicitly depending on feature `009`.
- FR-004: Add source-of-truth cross-links from existing durable docs where needed.
- FR-005: Record a final documentation consistency check after source-of-truth docs are drafted and before audit.
- FR-006: Create a full product audit matrix that maps every source-of-truth point to current product surfaces.
- FR-007: Create an atomic task inventory from audit gaps and record a final task consistency check.
- FR-008: Implement post-answer automatic translation/explanation reveal in learning/support modes only.
- FR-009: Preserve hidden support during active exam attempts.
- FR-010: Add bottom previous/next navigation for the learning flow and apply the same source-of-truth rule to mistake/support practice flows where appropriate.
- FR-011: Define and test mode-specific previous/next boundary and state-preservation behavior.
- FR-012: Add image explanation overlay definitions only after `009` shared metadata and per-question usage/relevance mappings are available and validated.
- FR-013: Store overlay definitions durably near learning-support/image-support content with provenance and stale-data validation.
- FR-014: Render overlays only when explanation support is visible and the current mode allows support.
- FR-015: Add tests for source docs/audit artifacts where practical, UI behavior, overlay gating, accessibility-critical keyboard/focus paths, and local-first constraints.
- FR-016: Keep `tasks.md` current with process memory, verification evidence, known issues, dead ends, and Implementation Agent feedback.
- FR-017: Treat mandatory UX fixes D/E/F as required `010` implementation slices; non-mandatory audit findings may become follow-ups only with explicit disposition.
- FR-018: If `009` is not merged into `main`, keep overlay implementation in an explicit waiting state; after `009` merges, sync `010` and implement overlays before claiming `010` complete.
- FR-019: Require overlay definitions to reference `009` question-specific usage/relevance roles for the current question; overlay definitions must not assign independent importance/relevance roles from shared metadata or UI judgment.
- FR-020: Require fallback behavior when a question lacks completed `009` usage/relevance: show the normal local image and truthful explanation text without invented highlight/dim overlays.

## Verification Requirements

- Documentation evidence:
  - `rg`/diff evidence showing new durable docs and required cross-links;
  - recorded consistency matrix for new docs versus existing durable docs, `008`, `009`, and research basis;
  - recorded full product audit matrix;
  - recorded task inventory and final task consistency check.
- UI behavior evidence:
  - tests prove support is hidden before answering in learning/mistake review;
  - tests prove support auto-reveals after answer selection in learning/mistake review;
  - tests prove active exam attempts do not reveal support after answer selection;
  - tests prove bottom previous/next navigation appears and respects boundary/state rules;
  - tests prove image overlay rendering only happens when explanation is visible and approved `009` per-question usage/relevance plus overlay definitions exist.
- Data/validation evidence:
  - validators fail for overlay definitions whose image hash, question fingerprint, `009` metadata fingerprint, `009` usage fingerprint, relevance role references, or answer-critical detail references are stale or missing;
  - validators fail if overlay definitions reference missing images, questions, answer IDs, metadata detail IDs, usage relevance IDs, or non-local assets;
  - validators fail if overlay definitions invent important/unimportant/relevance roles instead of consuming roles from the concrete question's `009` usage/relevance record;
  - validators block strict overlay implementation if completed `009` per-question usage/relevance is unavailable.
- Command evidence:
  - `pnpm run validate:content`;
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`;
  - Docker smoke flow for runtime-affecting PRs when scoped by Orchestrator.

## Review Requirements

- Review Agent must check that implementation follows the role boundary and that this feature memory is complete.
- Review Agent must check that source-of-truth docs are durable, Cabadrive-specific, and consistent with existing official-Spanish/unofficial-Russian/local-first/exam-mode constraints.
- Review Agent must check that the product audit covers every current user-facing surface named in this spec.
- Review Agent must check that every implementation task traces back to a source-of-truth rule and has acceptance/verification evidence.
- Review Agent must specifically inspect the three mandatory UX fixes.
- Review Agent must check that image overlays depend on completed `009` question-specific usage/relevance and do not create a competing answer-critical, supporting, distractor, or background/irrelevant source.
- Review Agent must check that missing/stale `009` usage/relevance blocks or fences overlay work rather than allowing invented highlights or dimming from shared metadata alone.
- Review Agent must check that tests cover learning/support behavior separately from active exam simulation.
- Review Agent must check that `tasks.md` contains current process memory and verification evidence before merge readiness.
