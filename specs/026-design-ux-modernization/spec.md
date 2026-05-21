# Spec: Design, UX, Typography, And Learning Visual Modernization

## Context

- Feature folder: `specs/026-design-ux-modernization/`
- Architect worktree: `/Users/chap/devel/cabadrive-worktrees/026-design-ux-modernization`
- Branch: `codex/026-design-ux-modernization`
- Verified base: `origin/main = c083b248564a67d7599fa63d4181759fe30cd6a7`
- Architect scope: this `spec.md`, `plan.md`, and `tasks.md` only.

Cabadrive is a local-first React/Vite trainer for Russian-speaking drivers preparing for the CABA theory exam. Current durable memory requires Spanish ticket text to remain primary, Russian support to remain clearly unofficial, current question content to stay labeled `unofficial_b_fallback`, and active exam attempts to hide translations, explanations, hints, overlays, and other learning scaffolding.

## Goal

Make the existing Cabadrive learner experience feel modern, cohesive, readable, and convenient across all current top-level flows while adding governed local generated illustrations for vocabulary and topic-study materials. The implementation must improve design quality without weakening exam boundaries, ticket immutability, source-status clarity, offline behavior, or validation evidence.

## Concrete Cycle Scope

This cycle is a design-system plus learner-content visual modernization. It should be implemented as one or more Orchestrator-assigned PR slices under this feature folder, but the complete cycle is not done until all acceptance criteria below are met.

In scope:

- Create durable design documentation for Cabadrive visual identity, typography, spacing, color, geometry, icons, navigation, dialogs/windows, question cards, timer, bilingual text treatment, generated learning-image style, asset metadata, and validation expectations.
- Modernize the visible UI across `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, `Источники`, `Процесс`, and `CABA/RF`.
- Improve typography and layout for mixed Russian/Spanish reading without changing canonical ticket wording.
- Add explicit bilingual UX patterns in `Материалы` and `Словарь`: Spanish terms/text must remain identifiable with `lang="es"` where feasible, and Russian support must appear close to the Spanish text through visible labels, inline pair layout, or keyboard/touch-accessible reveal controls.
- Add a governed local learning-image system for generated/approved illustrations used in vocabulary and topic-study materials.
- Add generated or approved local image coverage for all current general vocabulary terms and all current topic-study material coverage units defined below.
- Add validation/tests proving local-only assets, complete coverage records, accessible image alternatives, no stale coverage after content changes, and no ticket content/image mutation.
- Update durable docs and feature memory with decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback for Architect disposition.

Out of scope for this cycle:

- Replacing, importing, or rewording the current practice question bank.
- Changing canonical ticket question text, answer text, correct-answer data, or ticket image files.
- Replacing ticket images with generated images.
- Claiming official full GCBA category B bank coverage.
- Adding runtime backend services, runtime AI/image generation, analytics, remote image fetches, remote fonts, or raw PDF viewer support.
- Adding generated image coverage to the `Процесс`, `Источники`, and `CABA/RF` content corpora beyond normal UI modernization. Those surfaces may receive design polish, but their content image expansion needs a later feature unless Orchestrator/Architect explicitly scopes it.
- Editing `content/official-documents/` except if a separate official-source feature routes that work. This feature must not add Russian support, summaries, generated images, or learning prose there.

## Hard Constraints

- Do not change canonical ticket question wording.
- Do not change canonical ticket answer wording.
- Do not change canonical ticket image files, hashes, paths, or displayed image identity.
- Do not alter correct-answer IDs or exam scoring semantics.
- Generated learning images must not replace, modify, recolor, crop, or visually stand in for canonical ticket images.
- Ticket blocks in materials must continue to join Spanish ticket text and answers from canonical question data, not duplicated UI-only copies.
- Active exam attempts must hide translations, explanations, image overlays, hints, generated learning images, difficulty rationale, and other support that could reduce exam-like recall.
- Russian support remains unofficial learning support and must be labeled clearly enough for trust decisions.
- Current content mode remains `unofficial_b_fallback` unless a separate source-mode transition is scoped and proven.
- Runtime remains static/local-first: no runtime backend, no runtime AI, no remote image service, no live network image fetch, no remote font fetch, no PDF viewer.
- Generated learning images must be committed local assets with manifest metadata, alt text, provenance, and review status.
- Images containing text are disallowed unless the text is also present as real selectable text and the image text is reviewed as necessary.
- All reveal controls must be keyboard reachable, touch usable, visibly focusable, and accessible by name/state.
- Text must not overlap or overflow incoherently on mobile or desktop.

## Learning-Image Coverage Model

The user's "one or more images for each paragraph" requirement is implemented through a testable content-unit coverage model, not ad hoc rendered screenshots.

### Required Coverage Units

For the current `content/guide/topic-study-guide.ru.json`, each of these rendered authored material units must have a coverage record:

- topic summary: `topics[*].summaryRu`
- short material paragraphs: `topics[*].learningMaterialRu[*]`
- practical reasoning paragraphs: `topics[*].practicalReasoningRu[*]`
- trap notes: `topics[*].trapNotes[*].textRu`
- material term rows: `topics[*].spanishTerms[*]`

For the current `content/vocabulary/ru.vocabulary.json`, each vocabulary term must have a coverage record.

Implementation-time baseline observed by Architect at planning time:

- 38 topic-study topics
- 269 `learningMaterialRu` paragraphs
- 109 `practicalReasoningRu` paragraphs
- 225 trap notes
- 731 topic-study Spanish term entries
- 10 general vocabulary terms

The validator must compute current counts from content at runtime; these numbers are planning evidence, not hard-coded acceptance values.

### Coverage Records

Each coverage unit must be represented in a local manifest, recommended path:

```text
content/learning-images/learning-images.manifest.json
content/validation/learning-images.evidence.json
```

Recommended local asset root:

```text
content/assets/learning/generated/v1/
```

Every coverage record must include:

- stable unit ID derived from content path, topic ID, term ID, and index;
- source fingerprint over the authored text/term fields that the image claims to cover;
- one or more local `imageId` references, or an explicit reviewed exception;
- coverage status such as `direct`, `shared`, or `exception`;
- exception reason when applicable;
- reviewer, reviewed date, and evidence status.

Every image record must include:

- `imageId`;
- local path under `content/assets/learning/`;
- SHA-256;
- width and height;
- aspect-ratio family;
- style version;
- alt text in Russian;
- caption or learner-facing label when rendered;
- provenance method, prompt summary, generated/reviewed dates, reviewer, and license/provenance note;
- safety flags proving no runtime generation, no remote source, no ticket-image replacement, no misleading road-rule cue, and no unreviewed text in image.

Images may be shared across multiple units when one illustration genuinely explains the same concept. Shared images still need explicit per-unit coverage records. Exceptions are allowed only when a direct image would be misleading, redundant with a stronger adjacent/shared image, purely grammatical, purely status/navigation text, or legally/administratively volatile. Missing coverage is never acceptable.

### Exclusions From Paragraph Coverage

This cycle does not require generated learning images for:

- canonical ticket question/answer wording;
- canonical ticket images;
- Russian ticket translation and explanation shards;
- source/status labels and disclaimers;
- `content/official-documents/` archive text;
- primary-source reader chunks;
- process-guide sections;
- CABA/RF guide prose.

Those surfaces still receive UI modernization where scoped, but broad image expansion outside `Материалы` and `Словарь` is deferred.

## Requirements

- FR-001: Create durable design documentation under `docs_project/` before or alongside UI/content implementation.
- FR-002: Document and implement a cohesive visual system: palette, typography, spacing, 8px-or-less radius rule unless locally justified, elevation/borders, icons, focus states, form controls, cards, panels, status chips, timers, and responsive breakpoints.
- FR-003: Avoid a decorative landing-page treatment. The app must open into the usable trainer, preserving existing top-level flows.
- FR-004: Use local/system typography or committed locally licensed font assets only. Runtime font network fetches are forbidden.
- FR-005: Keep navigation predictable, exam-focused, and reachable for all existing top-level flows.
- FR-006: Modernize question cards, answer controls, timer, feedback, difficulty/status metadata, source line, and bottom navigation without changing ticket content.
- FR-007: Preserve hidden-before-answer support and automatic after-answer support reveal in learning and mistake review.
- FR-008: Preserve active exam support hiding and active exam timer behavior.
- FR-009: Materials must present Spanish/Russian pairs intentionally. Spanish terms and canonical Spanish ticket text stay identifiable; Russian support must be close, clear, and not confused with official source text.
- FR-010: Inline translation or language-pair affordances in materials must work with mouse, touch, keyboard, visible focus, accessible names, and accessible state.
- FR-011: Use valid `lang` attributes for Russian and Spanish text boundaries where feasible without over-fragmenting content.
- FR-012: General vocabulary terms must render local approved learning images with alt text and no remote requests.
- FR-013: Topic-study content units and term rows defined in the coverage model must render local approved learning images or valid reviewed exceptions.
- FR-014: Generated learning images must use a documented style version and be visually coherent as a set.
- FR-015: Generated images must be educational, low-clutter, road-safety reviewed, and must not invent official source evidence or answer-critical ticket cues.
- FR-016: Content validation must fail on missing learning-image files, hash mismatches, remote paths, stale source fingerprints, missing alt text, missing review status, invalid exception reasons, and unapproved coverage.
- FR-017: `pnpm run validate:content` must include learning-image validation once the manifest exists; a direct script such as `pnpm run validate:learning-images` should also be added.
- FR-018: UI/e2e tests must prove learning images render in `Словарь` and `Материалы`, remain local, and do not appear during active exam attempts.
- FR-019: Verification must prove ticket question text, answer text, and ticket image assets are unchanged from the assigned base.
- FR-020: Durable docs and feature memory must record implementation decisions, coverage totals, exceptions, evidence paths, and any Implementation Agent feedback.

## Acceptance Criteria

1. Design documentation exists and covers visual identity, typography, layout, navigation, dialogs/windows, bilingual UX, generated-image style, asset governance, and validation rules.
2. Durable docs are updated where behavior or governance changed.
3. The modernized UI is applied consistently across every current top-level flow.
4. Navigation remains predictable, all current flows remain reachable, and source/status trust labels remain visible.
5. Learning and mistake review still start with Russian support hidden and reveal allowed support after an answer.
6. Active exam attempts still hide translations, explanations, generated learning images, image overlays, hints, and difficulty rationale.
7. Ticket question text, answer text, correct answer IDs, and ticket image files are unchanged from the assigned implementation baseline, with command or test evidence.
8. Materials Spanish/Russian handling is explicit and accessible, including keyboard/touch behavior and `lang` boundaries where feasible.
9. Vocabulary terms render approved local learning images with useful alt text.
10. Topic-study coverage units have complete direct/shared/exception coverage records and approved local learning images where not excepted.
11. Generated images follow the documented style version and are not decorative clutter, remote assets, or source evidence.
12. Content validation fails when learning-image coverage is missing or stale.
13. E2E tests cover desktop and mobile layouts for learning, exam, vocabulary, and materials modernization, including no text overlap/overflow checks where practical.
14. E2E tests or request interception prove no remote images, backend calls, live AI calls, analytics calls, or PDF viewer dependencies were introduced.
15. Build/preflight pass with service-worker asset inclusion for new local learning images.
16. Process memory records coverage totals, exception totals, image style version, validation output, screenshots or visual QA evidence, known issues, and unresolved feedback dispositions.

## Negative Scenarios

- A generated image replaces or visually contradicts a canonical ticket image.
- A ticket question or answer is "polished" as part of UI modernization.
- Active exam mode shows a generated illustration, translation, explanation, overlay, or support affordance.
- Materials duplicate canonical Spanish ticket text instead of joining through `questionId`.
- Inline translation reveal is pointer-only or lacks accessible state.
- Generated images load from remote URLs or depend on runtime generation.
- Learning-image manifest coverage stays green after a paragraph or term changes.
- Images contain Spanish/Russian text that is not also available as real text.
- New visual styling hides `unofficial_b_fallback` or unofficial Russian-support status.
- The UI looks modern on desktop but overflows or overlaps on mobile.

## Verification Requirements

Minimum implementation verification:

```bash
git status --short --branch
node scripts/check-feature-memory.mjs --worktree
git diff --check
pnpm run validate:content
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run preflight
```

Learning-image verification:

```bash
pnpm run validate:learning-images
pnpm run validate:content
```

If the script name differs, implementation must record the chosen command and wire it into `validate:content`.

Ticket immutability evidence must include a read-only diff against the assigned base or merge-base for at least:

```bash
git diff --exit-code c083b248564a67d7599fa63d4181759fe30cd6a7 -- content/questions/caba-b.unofficial-fallback.questions.json content/assets/questions/source-bandinopla-testdeconducir-b
```

UI evidence must include:

- Playwright desktop and mobile screenshots or comparable visual QA artifacts for `Учить`, `Экзамен`, `Словарь`, and `Материалы`;
- evidence that text does not overlap/overflow in primary changed surfaces;
- request-interception evidence for no remote image/backend/AI/PDF calls;
- keyboard/focus evidence for bilingual reveal controls and primary navigation.

## Review Requirements

Review Agent must verify:

- complete feature memory exists before implementation changes;
- role boundaries were preserved;
- design docs match implemented UI patterns;
- UI modernization preserves source/status labels, local-first behavior, and active exam boundaries;
- canonical ticket wording, answers, correct-answer IDs, and images are unchanged;
- generated learning images are local, approved, accessible, and not ticket replacements;
- coverage manifest and validator enforce every required topic/vocabulary unit or reviewed exception;
- bilingual controls are accessible and not pointer-only;
- no runtime backend/network/image/font/AI/PDF dependency was introduced;
- verification evidence covers acceptance criteria and failures/blockers are recorded;
- all Implementation Agent feedback is dispositioned by Architect before final validation.

## Final Validation Hooks

Before Orchestrator invokes final Analyst validation or finalization, Architect final validation must confirm:

- cycle PR set covers the full implementation scope or records explicit deferred slices;
- every Architect-assigned task is complete, deferred with disposition, or not applicable with reason;
- learning-image coverage totals and exception totals are current;
- ticket immutability evidence is current for the effective content head;
- validation and visual QA evidence are current for the effective content head;
- no unresolved Implementation Agent feedback lacks Architect disposition;
- no non-evidence changes occurred after final Architect/Analyst validation without rerouting.
