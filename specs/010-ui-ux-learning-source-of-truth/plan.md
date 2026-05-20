# Plan: UI/UX And Learning Source Of Truth

## Summary

Implement this feature as a documentation-first and evidence-gated program, not a broad visual redesign. First create durable source-of-truth documents, then record consistency checks, then audit the product, then generate a validated atomic task inventory. Those documents, checks, audit, and inventory are gates inside `010`; they are not the final deliverable. After the gates pass, Implementation Agents must complete the mandatory UX fixes D/E/F in this feature, while non-mandatory audit gaps may move to follow-up only after explicit disposition.

This Architect pass creates only `spec.md`, `plan.md`, and `tasks.md`.

## Technical And Product Context

- Frontend: static React/TypeScript/Vite SPA.
- Runtime: local-first, offline-capable static build; no backend in MVP.
- End-user runtime contract: `make build`, `make up`, `make down`.
- Verification commands: `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, `git diff --check`.
- Current content mode: `unofficial_b_fallback`; UI must not claim official or complete GCBA category B question-bank coverage.
- Official Spanish question text remains primary.
- Russian translation, explanation, topic guide material, and visual overlays are unofficial learning support.
- Learning and mistake review hide Russian support on initial render.
- Active exam attempts hide translation and explanation support.
- Feature `008` context: topic materials UI may add a `Материалы` surface from the `006` topic guide. Audit it if present.
- Feature `009` context: question-neutral shared image metadata and per-question usage/relevance roles are owned by `specs/009-image-metadata-learning-support/`. This feature consumes completed question-specific usage/relevance for UI overlays.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this plan creates Architect-owned artifacts before implementation.
- Testable boundaries: yes; docs, audit matrices, validators, UI state, and overlay gating can be verified without external services.
- Test-first bias: yes; product-code slices must add failing or targeted tests for changed behavior.
- Supervised verification: yes; acceptance criteria require recorded evidence, not AI summaries.
- PR-only workflow: yes; implementation lands through isolated branches and PRs.
- One worktree per task: yes; parallel work must use separate worktrees and avoid 008/009 worktrees.
- Deployability: yes; no backend or runtime network dependency is introduced.
- Simplicity: yes; prefer durable Markdown, existing React state patterns, JSON overlay definitions, and local validators before new systems.
- Process memory: yes; `tasks.md` must record decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.

## Durable Documentation Locations

Preferred durable docs:

```text
docs_project/project/frontend/ui-ux-source-of-truth.md
docs_project/project/learning/learning-experience-source-of-truth.md
docs_project/project/frontend/image-explanation-overlays.md
docs_project/project/frontend/ui-ux-product-audit.md
```

Implementation may adjust filenames if it records the reason in `tasks.md` and preserves these responsibilities:

- `ui-ux-source-of-truth.md`: app-wide interaction, accessibility, layout, navigation, status, responsive, local/offline, and review rules.
- `learning-experience-source-of-truth.md`: exam-focused learning science, bilingual support, mode behavior, feedback timing, weak-topic review, topic materials, vocabulary, guide, and mistake-review rules.
- `image-explanation-overlays.md`: UI behavior and data/validation contract for explanation-time image dimming/highlighting, explicitly consuming `009` metadata.
- `ui-ux-product-audit.md`: traceable audit from source-of-truth rule to product surface to task.

Existing docs to cross-link or update when behavior changes:

```text
docs_project/README.md
docs_project/project/frontend/frontend-docs.md
docs_project/project/feature-inventory.md
docs_project/screens/learning-and-exam-flows.md
docs/specify/06_ux_flows.md
docs/specify/07_technical_architecture.md
```

Do not duplicate the validated implementation inventory in multiple places. The atomic task inventory should live primarily in `specs/010-ui-ux-learning-source-of-truth/tasks.md`; the durable audit doc may include references to task IDs.

## Source-Of-Truth Content Requirements

The source-of-truth docs must include these rule families:

- Cabadrive product boundaries: Spanish primary, Russian unofficial, `unofficial_b_fallback` clarity, offline/local-first, no backend, no active-exam scaffolding.
- General UX: visibility of status, learner language, predictable controls, user control, consistency, recognition over recall, efficient repeated use, minimal exam-focused screens, plain recovery states, contextual help.
- Accessibility: WCAG 2.2-aligned focus visibility, keyboard operation, target sizing, contrast, language attributes/handling for Spanish/Russian, predictable navigation, non-pointer alternatives, no text overflow.
- Learning science: active recall before support, immediate post-answer feedback, explanations after attempt, weak-topic review, distributed practice, interleaving where useful, self-explanation prompts where useful, avoid passive rereading as the main loop.
- Bilingual learning: translation hidden before answer in learning/support flows, shared reveal state for question and answer translations before answer, automatic reveal after attempt, concise explanation with correct/wrong-answer rationale.
- Mode boundaries: learning, mistake review, exam simulation, vocabulary, CABA/RF guide, topic materials, search, progress/reset, offline/status.
- Multimedia: image support is instructional only when tied to question/image facts; use signaling and spatial contiguity; dim details irrelevant to the current question only during explanations; avoid decorative imagery in study surfaces.
- Review gates: every UI PR must cite relevant source-of-truth rules and record acceptance evidence.

## Dependency Contract With 008

Feature `008` exposes topic study guide materials if present. This feature must:

- audit `Материалы`/topic materials as a current user-facing surface when it exists in the implementation branch;
- apply the same source-of-truth rules for unofficial learning support, topic structure, mobile scanning, and status labels;
- avoid editing `specs/008-learning-materials-ui/*`;
- avoid replacing or undoing 008 navigation decisions unless the audit creates a separate task and Orchestrator scopes it.

If feature `008` is not present in the implementation branch, the audit must record it as an anticipated surface and include a re-audit task after 008 lands.

## Dependency Contract With 009

Feature `009` owns:

- image metadata schema;
- question-neutral shared image metadata entries that describe visible facts, objects, details, regions, relationships, annotations, and uncertainty;
- per-question image usage mappings;
- question-specific relevance roles such as `answer_critical_highlight`, `supporting`, `distractor_trap`, and `background_irrelevant_dim`;
- answer-critical detail references inside per-question usage only;
- image hash, question fingerprint, metadata fingerprint, and review evidence;
- image-aware explanation alignment.

Feature `010` owns:

- source-of-truth rule that image explanations should visually signal answer-critical details;
- UI behavior for dimming/highlighting when explanation support is visible;
- overlay definition storage and rendering contract;
- overlay validation against `009` shared metadata, per-question usage/relevance, and fingerprints.

Implementation must not define a competing semantic metadata or relevance schema. Overlay definitions may contain geometry, display styles, labels, and references to `009` detail/region IDs and relevance IDs for the current question, but not independent claims about which details matter. Shared `009` image metadata may tell `010` what is visible and where it is; it must not be treated as a global source of important or unimportant regions.

`010` may use `009` feature memory/spec as a contract while `009` is in progress. It must not consume local `009` worktree files, feature branches, draft PR artifacts, or copied unmerged content. The `009` implementation becomes usable input only after `009` is fully completed and merged into `main`; at that point `010` must sync with `main` and implement the overlay slice before claiming the feature complete.

As of the 2026-05-10 current-main audit, feature `009` is already merged and the merged baseline contains 276 current image-backed question usages, 275 unique image metadata entries, and approved per-question usage/relevance for all 276 usages. The current `010` overlay manifest contains only one approved overlay. Architect decision: Slice F must now be treated as full current overlay coverage for all 276 image-backed question usages, not as a seed/sample overlay implementation. A fallback for missing overlay data remains a truthful runtime safety behavior for future, stale, or out-of-scope data, but it cannot satisfy current `010` completion while approved `009` usage/relevance exists for every current image-backed question.

## Data Ownership For Overlay Definitions

Preferred overlay layout after `009` has merged:

```text
content/image-overlays/question-explanation-overlays.manifest.json
content/image-overlays/question-explanation-overlays/
content/validation/question-image-overlays.evidence.json
```

The exact layout may change if implementation records a better repository fit, but ownership must stay clear:

- `009` shared metadata owns visual facts and stable object/detail/region IDs.
- `009` per-question usage owns answer-critical, supporting, distractor, and background/irrelevant relevance roles for the current question.
- `010` overlay definitions own presentational geometry and dim/highlight behavior for explanation mode.
- Question data owns Spanish text, answer IDs, correct answer ID, image path, and image hash.
- Explanation data owns learner-facing explanation text.

Overlay definition requirements:

- `questionId`;
- `imageId` or `localPath`;
- `imageSha256`;
- `questionFingerprint`;
- `metadataFingerprint` and `usageFingerprint` from `009`;
- referenced `009` `relevanceId`s and the associated `detailId`/`regionId` values for the current question;
- overlay regions in stable image-relative coordinates, such as percentages normalized to natural image dimensions;
- behavior such as dim region, spotlight region, outline, label, or callout;
- provenance/reviewer/status;
- stale-data evidence fingerprint.

Overlay validation must fail when:

- the current question bank has an approved `009` image usage/relevance record for an image-backed question but lacks exactly one approved current overlay definition and evidence entry for that question;
- referenced `009` metadata or usage mapping is missing;
- referenced detail IDs, region IDs, or relevance IDs are missing or not assigned the required role for the current question;
- image hash, question fingerprint, metadata fingerprint, or usage fingerprint is stale;
- overlay regions are outside image bounds or malformed;
- overlay references remote assets;
- overlay claims a visible/important/irrelevant fact not represented by the current question's `009` usage/relevance;
- overlay assigns UI-side importance, irrelevance, criticality, distractor, highlight, or dim semantics that are not present in the current question's `009` usage/relevance.

For the audited current baseline, strict validation must prove 276 approved overlays for 276 current image-backed question usages. Each approved overlay must include at least one region sourced from the current question's `answer_critical_highlight` usage/relevance and enough `background_irrelevant_dim`, `supporting`, or `distractor_trap` geometry to reduce irrelevant visual load in that exact question context. The validator must reject "mark everything highlighted", shared-metadata-only geometry, and overlay records for images that are not used by the concrete question.

If feature `009` has not landed, overlay implementation must be fenced:

- source-of-truth docs may describe the requirement;
- audit may create blocked overlay tasks;
- UI must not render invented highlights;
- implementation may add a disabled/fallback state only if it is truthful and tested.
- final `010` completion must remain in a waiting state for the overlay slice; once `009` lands, the overlay slice is required implementation work, not optional backlog.

## Implementation Slices

### Slice A: Source-Of-Truth Docs

Goal: create durable source-of-truth docs and cross-links.

Tasks:

- Create preferred durable docs.
- Summarize research basis from Analyst intake.
- Define Cabadrive-specific UI, accessibility, learning, bilingual, mode, multimedia, and review rules.
- Cross-link from existing durable docs.
- Record documentation evidence in `tasks.md`.

Exit criteria:

- Docs exist under durable locations.
- Docs preserve existing constraints and include the three mandatory UX fixes as source-of-truth requirements.
- No product code changes are included unless Orchestrator explicitly combines slices.

### Slice B: Final Documentation Consistency Check

Goal: prove the source-of-truth docs do not contradict each other or existing project memory.

Tasks:

- Create a consistency matrix, likely inside `ui-ux-product-audit.md` or a section of the source-of-truth docs.
- Check against `.specify/memory/constitution.md`, `docs_project/`, `docs/specify/`, feature `008`, feature `009`, and research basis.
- Resolve contradictions by editing docs before audit.
- Record unresolved questions or deferrals.

Exit criteria:

- No unresolved contradiction blocks product audit.
- Any defer decision has owner, reason, and follow-up task.

### Slice C: Full Product Audit And Task Inventory

Goal: audit all current surfaces and create atomic implementation tasks.

Surfaces:

- status/onboarding;
- primary navigation;
- learning question flow;
- answer feedback;
- translation/explanation support;
- image-backed questions;
- exam mode;
- mistake review;
- vocabulary;
- CABA/RF guide;
- topic materials from `008` if present;
- search;
- progress/reset;
- mobile layout;
- keyboard/focus behavior;
- offline/status surfaces;
- content-source/status surfaces.

Task fields:

- task ID;
- source-of-truth rule ID;
- affected surface;
- observed gap;
- atomic implementation action;
- out-of-scope boundary;
- acceptance hook;
- verification hook;
- dependency (`008`, `009`, none);
- suggested PR slice;
- blocked/unblocked status.

Exit criteria:

- Every source-of-truth rule is audited or marked not applicable.
- Mandatory UX fixes appear as implementation tasks.
- Final task consistency check is recorded.

### Slice D: Post-Answer Auto Reveal

Goal: implement mandatory UX fix 1.

Expected approach:

- Reuse existing support state where possible.
- In learning and mistake-review/support modes, after answer selection, set translation and explanation support visible.
- Preserve hidden initial state before answer.
- Keep active exam attempts free of support reveal.
- Clarify whether exam result/review mode can show support separately from active attempt.

Verification:

- tests for learning before/after answer;
- tests for mistake review before/after answer;
- tests for active exam attempt no reveal;
- tests or DOM evidence for question and answer translations plus explanation visibility.

### Slice E: Bottom Previous/Next Navigation

Goal: implement mandatory UX fix 2.

Expected approach:

- Move/add the primary next control to the bottom of the learning flow where feedback/explanation reading ends.
- Add previous control.
- Keep top controls for search/filter only if useful; avoid duplicate confusing primary actions.
- Define boundary behavior:
  - first item disables or hides previous with accessible state;
  - last item disables, loops, or offers completion according to documented mode rule;
  - previous restores prior selected answer and support reveal state when that preserves review value, or resets only if the source-of-truth explicitly chooses fresh attempts.
- Apply equivalent rule to mistake review if its flow uses the same question-card pattern.

Verification:

- Playwright coverage for bottom nav on desktop/mobile;
- keyboard focus order;
- first/last boundary;
- state preservation/reset behavior;
- no accidental answer loss.

### Slice F: Image Explanation Overlays

Goal: implement mandatory UX fix 3 after feature `009` is fully completed, merged into `main`, and synchronized into the `010` implementation branch. Until then, keep this slice explicitly waiting and do not consume unmerged `009` artifacts.

Expected approach:

- Confirm feature `009` metadata and usage mappings are present in `main` after sync and validated.
- Confirm the current coverage baseline from merged `009`: 276 image-backed question usages and 275 unique image paths.
- Add overlay definition schema/manifest or reuse an existing suitable content validation boundary.
- Store overlays near image-support content, not inside React-only code.
- Populate approved overlay definitions and evidence for every current image-backed question usage covered by merged `009`; the current acceptance target is 276 approved overlays, not one seed overlay.
- Render dimming/highlighting only when explanation support is visible and mode allows support.
- Drive dimming/highlighting from completed `009` per-question usage/relevance for the current question, not from shared metadata alone or UI-authored importance flags.
- Keep images fully visible or provide non-misleading fallback only for future/stale/out-of-scope cases where validated `009` usage/relevance or overlay records are not available; current merged-009 image-backed questions must not rely on fallback for completion.
- Use CSS/SVG/canvas only as needed; choose the simplest approach that supports responsive image-relative regions and local/offline rendering.

Verification:

- strict coverage validation proving every current image-backed question usage has exactly one approved overlay and evidence entry;
- content validator tests for missing/stale metadata, missing detail IDs, malformed regions, and stale fingerprints;
- content validator tests for missing/stale `009` usage relevance, UI-authored relevance roles, and overlays built from shared metadata without question usage;
- content validator tests proving an approved `009` image-backed usage without overlay fails strict coverage;
- content validator tests proving images not used by the current question are not assigned overlay importance/relevance;
- component/e2e tests for overlay visible with explanation and hidden before answer/exam attempt;
- visual or DOM evidence that irrelevant regions are dimmed and answer-critical regions remain prominent;
- regression evidence for representative image-backed questions across the overlay corpus, including `b-fallback-001` and at least one reused-image case.

### Slice G: Final Gate

Goal: prove the complete feature is ready for review/merge.

Tasks:

- Ensure source-of-truth docs, consistency check, audit, task inventory, implementation decisions, and evidence are current.
- Confirm mandatory D and E are implemented and verified.
- Confirm mandatory F is implemented and verified after merged `009`: 276 approved current overlays for 276 current image-backed question usages, with strict coverage/evidence validation.
- Run full command matrix.
- Run Docker smoke flow for runtime-affecting changes.
- Confirm required checks, review findings, conflicts, and process memory.

## Validation And Test Approach

- Use Markdown/link checks or targeted scripts only if repository already has a suitable docs validation pattern; do not add a heavy docs framework.
- Use content validators for overlay definitions and stale-data checks.
- Use strict overlay coverage validation as a merge gate after merged `009` exists; the validator must fail on missing current overlays, duplicate current overlays, stale overlay evidence, or overlays that define their own importance/relevance instead of referencing current-question `009` usage roles.
- Use unit tests for pure helpers: mode support rules, navigation collection/boundary logic, overlay validation.
- Use Playwright for user-visible flows: auto reveal, bottom nav, exam no-support boundary, overlay visibility, keyboard/mobile.
- Use `git diff --check` for whitespace and Markdown hygiene.
- Use local preflight as final evidence.

## Risks And Mitigations

- Risk: broad request becomes an uncontrolled redesign.
  - Mitigation: source-of-truth first, audit second, atomic tasks third, implementation slices last.
- Risk: generic UX guidance conflicts with exam-prep active recall.
  - Mitigation: Cabadrive-specific mode rules decide behavior.
- Risk: Duolingo-style ideas become engagement gimmicks.
  - Mitigation: docs prioritize exam readiness, correctness, and durable learning over retention mechanics.
- Risk: 008 is merged after the audit.
  - Mitigation: record anticipated-surface status and add a re-audit task.
- Risk: 009 metadata is unavailable or low confidence.
  - Mitigation: block/fence overlay implementation and avoid invented highlights or dimming.
- Risk: seed overlay support is mistaken for completion.
  - Mitigation: record the audited current baseline and require strict 276-of-276 current overlay coverage after merged `009`.
- Risk: UI overlay work accidentally treats shared image metadata as global importance.
  - Mitigation: require completed `009` usage/relevance for the current question, reject UI-authored relevance roles, and fall back to the normal image when usage/relevance is missing.
- Risk: overlay records evaluate images outside the question context.
  - Mitigation: validation and review require every overlay to be keyed to a concrete current question usage; images not used by the current question receive no importance/relevance evaluation.
- Risk: overlay geometry becomes stale.
  - Mitigation: fingerprint image, question, metadata, and usage mappings; fail validation when stale.
- Risk: automatic reveal weakens recall.
  - Mitigation: reveal only after answer selection in support modes.
- Risk: previous/next navigation loses state.
  - Mitigation: define mode-specific state rules before implementation and test them.
- Risk: source-of-truth docs duplicate durable docs inconsistently.
  - Mitigation: cross-link from existing docs and keep the validated implementation inventory in this feature memory rather than multiple backlogs.

## Rollback And Defer Rules

- Documentation slices can merge independently if they do not alter runtime behavior and consistency checks pass.
- Product-code slices must be reverted or fixed before merge if they reveal support during active exam attempts.
- Overlay slice must wait if completed `009` shared metadata and per-question usage/relevance mappings are not yet merged into `main`, or if merged data is stale or too incomplete for safe highlighting.
- Overlay tasks may remain blocked in `tasks.md` while docs/audit and the first two UX fixes proceed, but after `009` merges they must be implemented for full current image-backed coverage in `010` before full completion.
- If audit uncovers large unrelated improvements, record them as follow-up tasks with source-of-truth references and explicit disposition rather than bundling them into mandatory UX-fix PRs.

## Handoff To Implementation

Implementation Agents must start only after this feature memory is complete. They must use an Orchestrator-assigned isolated worktree/branch, keep `tasks.md` current, and stop for Architect disposition if they need to alter source-of-truth scope, redefine `009` metadata ownership, introduce new runtime dependencies, or relax exam-mode restrictions.
