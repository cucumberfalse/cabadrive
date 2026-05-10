# Plan: Institution Entrance Timing Contrast

## Summary

Implement feature 020 as a narrow learner-facing content completion. The preferred fix is to add a concise source-backed contrast to the existing `parking-clearances-and-corners` material rendered in `Материалы`, then prove via content and e2e tests that learners can see school, temple, and bank timing qualifiers.

This Architect pass creates only `spec.md`, `plan.md`, and `tasks.md`.

## Technical Context

- Frontend: React + TypeScript + Vite static SPA.
- Runtime: local-first, offline-capable static build; no backend in MVP.
- Current content mode: `unofficial_b_fallback`.
- Primary learner surface: `Материалы`, powered by `content/guide/topic-study-guide.ru.json`.
- Relevant topic: `parking-clearances-and-corners`.
- Current visible behavior:
  - `learningMaterialRu` visibly teaches `hospital/centro de salud`, `entrada`, `10 metros de cada lado de la entrada`, and `5 metros` trap/falso framing.
  - `TopicGuideView` renders topic prose, practical reasoning, Spanish terms, tickets, and trap notes.
  - `TopicGuideView` does not render `claims`.
- Current hidden source-backed evidence:
  - `claims[0].textRu` already includes school/temple/bank timing contrast.
  - `content/guide/topic-study-guide.source-trace.json` entry `parking-clearances-distances-corners-and-cordon` records Ley 2148 7.1.9(l) support and says school, temple, and bank examples are time-qualified.
- Existing validation:
  - `scripts/content-topic-guide.mjs`;
  - `scripts/content-difficulty.mjs` through `pnpm run validate:content`;
  - Playwright e2e smoke in `tests/e2e/app.spec.ts`.

## Constitution Check

- Spec-first: satisfied by Analyst intake plus this Architect plan before implementation.
- Testable boundaries: satisfied by content tests, content validation, e2e DOM visibility, and preflight.
- Test-first bias: implementation should add/update focused tests before or with content edits, and record any deferred test reason.
- Supervised verification: each acceptance criterion needs evidence in `tasks.md`, not only a summary.
- PR-only workflow: implementation lands through branch/PR; no direct default-branch edits.
- One worktree per task: future implementation must use the Orchestrator-assigned isolated worktree/branch.
- Deployability: no backend, remote API, runtime network, or external asset dependency should be introduced.
- Simplicity: use existing rendered content fields before introducing new UI rendering behavior.
- Process memory: `tasks.md` is the durable place for decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.

## Architecture Decisions

### Primary Surface

Use `Материалы` as the primary surface because the parking topic already teaches the related hospital/health entrance rule there. The target learner context is already present, so the smallest useful addition is a bounded contrast in `content/guide/topic-study-guide.ru.json`.

Recommended content shape:

- Add one short paragraph immediately after the existing hospital/health entrance paragraph in `learningMaterialRu`.
- Keep the paragraph contrastive:
  - `hospital/centro de salud` is the current ticket anchor and remains `10 metros de cada lado de la entrada`;
  - schools use `en horas de clase`;
  - temples use `oficios/ceremonias` or `oficios o ceremonias`;
  - banks use `horario de atención al público`.
- Pair Spanish phrases with concise Russian explanations.
- Do not turn the paragraph into a general legal guide.

Optional content shape:

- Add or adjust one trap note if implementation finds the paragraph alone is easy to miss.
- Avoid changing ticket-specific answer explanations unless needed to preserve clarity.

### Claims Rendering

Do not render all topic `claims` globally. The current `claims` field is source-backed metadata, and rendering it would affect every topic rather than this single learner gap.

If implementation believes a new rendered claim/callout is necessary, stop and record feedback for Architect/Orchestrator disposition instead of adding a global renderer in this feature.

### CABA/RF

CABA/RF is not required for the primary acceptance path. It may remain unchanged if `Материалы` visibly teaches the contrast and e2e proves it.

Touch `content/guide/ru.condensed-guide.json` only when all of the following are true:

- the added entry is compact and source-supported;
- it does not replace or obscure the richer materials explanation;
- it has matching e2e/content assertions;
- process memory records why the extra surface was necessary.

### Source And Evidence

Implementation should first inspect:

- `content/guide/topic-study-guide.ru.json` parking topic;
- `content/guide/topic-study-guide.source-trace.json` entry `parking-clearances-distances-corners-and-cordon`;
- feature `006` process memory note about Ley 2148 7.1.9(l);
- feature `013` process memory for the prior hospital/health fix.

Use the existing source-trace wording as the source basis. No live legal research is required unless implementation chooses wording not already supported by the local source trace.

If rendered wording changes the meaning of the existing source-backed claim, update the claim/source-trace text together. If the implementation simply exposes the existing contrast in polished learner prose, source trace may remain unchanged, but record that decision in `tasks.md`.

### Fingerprints And Validation

Editing `learningMaterialRu`, `trapNotes`, or other topic fields can stale deterministic topic difficulty fingerprints. Implementation must run validation and refresh only affected deterministic evidence if needed.

Expected affected evidence:

- `parking-clearances-and-corners` `difficultyMeta.sourceFingerprint` may need refresh.
- `difficultyMeta.rationaleRu` count text changes only if the number of `spanishTerms`, `trapNotes`, or `claims` changes.
- Source trace changes are only needed if the source-backed claim/source summary changes.

### Tests

Content test requirements:

- Update `tests/content-topic-guide.test.mjs` or add a focused content test.
- Build the asserted text from rendered fields only.
- Explicitly exclude `claims` from the visibility proof.
- Assert the existing hospital/health `10 metros` and `5 metros` trap behavior remains present.
- Assert the school, temple, and bank timing phrases are present.

E2E requirements:

- Update `tests/e2e/app.spec.ts`.
- Open `Материалы`.
- Ensure the parking topic is selected or select it explicitly.
- Assert visible timing phrases:
  - `en horas de clase`;
  - `oficios` and `ceremonias`;
  - `horario de atención al público`.
- Keep existing active exam support-hiding e2e green.

## Implementation Slices

### Slice A: Setup And Source Orientation

Goal: prove implementation starts from complete feature memory and the existing source-backed claim.

Tasks:

- Confirm worktree and branch.
- Confirm `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- Inspect current parking topic rendered fields and hidden `claims`.
- Inspect source-trace entry `parking-clearances-distances-corners-and-cordon`.
- Record the source basis and whether source trace needs edits.

Exit criteria:

- `tasks.md` records source basis, no product edit has happened before orientation, and the implementation path is content-first.

### Slice B: Visible Parking Material Contrast

Goal: make the timing contrast visible in `Материалы` without weakening hospital/health behavior.

Tasks:

- Add concise contrast prose to `parking-clearances-and-corners` rendered material.
- Preserve exact `10 metros de cada lado de la entrada`.
- Preserve `5 metros` as trap/falso/wrong for hospital/health entrance context.
- Include `en horas de clase`, `oficios/ceremonias` or `oficios o ceremonias`, and `horario de atención al público`.
- Avoid unrelated parking-topic rewrites.
- Avoid changing ticket answer explanations unless needed for clarity.

Exit criteria:

- A rendered-field text check shows the contrast is visible outside `claims`.

### Slice C: Fingerprints And Content Validation

Goal: keep deterministic content metadata current.

Tasks:

- Run `pnpm run validate:content`.
- If validation reports stale parking topic fingerprint, refresh only the affected `difficultyMeta.sourceFingerprint`.
- If term/trap/claim counts change, update `difficultyMeta.rationaleRu` count text truthfully.
- If source-trace wording changes, validate source-trace consistency.
- Run targeted content tests.

Exit criteria:

- `pnpm run validate:content` and `node --test tests/content-topic-guide.test.mjs` pass.

### Slice D: Learner Visibility Tests

Goal: prove the timing contrast is visible to the learner.

Tasks:

- Add/update a content test that excludes `claims` and checks rendered fields.
- Add/update e2e materials smoke for DOM visibility.
- If CABA/RF is touched, add/update matching CABA/RF tests.
- Confirm existing active exam support-hiding behavior remains covered and green.

Exit criteria:

- E2E proves the timing phrases are visible in `Материалы`.

### Slice E: Optional CABA/RF Contrast

Goal: add CABA/RF only if justified.

Tasks:

- Decide whether the materials-only fix satisfies acceptance.
- If yes, record "CABA/RF unchanged" in process memory.
- If no, add one compact source-supported CABA/RF contrast and matching tests.
- Preserve `CABA/RF` as a compact guide separate from `Материалы`.

Exit criteria:

- Either no CABA/RF diff exists with a recorded reason, or a tested compact CABA/RF update exists.

### Slice F: Final Verification And Process Memory

Goal: leave the PR merge-ready for review.

Tasks:

- Run full local verification:
  - `pnpm run validate:content`;
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.
- Run Docker smoke where feasible:
  - `make build`;
  - `make up`;
  - smoke check `http://localhost:5173`;
  - `make down`.
- Record exact unrelated blockers if Docker is unavailable.
- Update `tasks.md` with decisions, evidence, known issues, dead ends, and Implementation Agent feedback.

Exit criteria:

- Every acceptance criterion has evidence or a clearly recorded unrelated blocker.

## Test Strategy

Recommended content assertion:

- Locate `parking-clearances-and-corners`.
- Build `visibleTopicText` from `summaryRu`, `learningMaterialRu`, `practicalReasoningRu`, `spanishTerms`, `trapNotes`, and relevant ticket explanations.
- Do not include `claims`.
- Assert:
  - `/hospital\/centro de salud/`;
  - `/10 metros de cada lado de la entrada/`;
  - `/5 metros .*trap|5 metros .*falso|5 metros .*wrong/s`;
  - `/en horas de clase/`;
  - `/oficios.*ceremonias|ceremonias.*oficios/s`;
  - `/horario de atención al público/`.

Recommended e2e assertion:

- Open `/`.
- Click `Материалы`.
- Ensure the parking topic heading is visible.
- Assert visible text for the same timing phrases.
- Keep assertions resilient to paragraph wrapping by checking phrases separately.

Regression coverage:

- Existing active exam e2e remains green and continues to prove support is hidden during active attempts.
- Existing materials local-first/no external/PDF smoke remains green.

## Risks And Mitigations

- Risk: tests pass by reading hidden `claims`.
  - Mitigation: content test explicitly excludes `claims`; e2e checks DOM visibility.
- Risk: new wording blurs hospital/health unconditional logic.
  - Mitigation: keep the contrast paragraph separate and assert hospital/health plus `5 metros` trap remains visible.
- Risk: source-backed legal nuance is reworded beyond current evidence.
  - Mitigation: use existing source trace; update source trace only if meaning changes; avoid live-law expansion.
- Risk: content edit stales difficulty fingerprint.
  - Mitigation: run validation and refresh only affected fingerprint/evidence.
- Risk: CABA/RF scope expands into broad legal guide.
  - Mitigation: leave CABA/RF unchanged unless a compact, tested, source-supported addition is necessary.
- Risk: Docker unavailable locally.
  - Mitigation: record exact daemon/blocker output and cleanup attempts; do not hide skipped runtime evidence.

## Rollback Plan

- Content rollback: remove the added parking-topic paragraph/trap note and revert any matching fingerprint/source-trace/test changes as one unit.
- Test rollback: remove only tests that assert the rolled-back text.
- CABA/RF rollback: if touched and found too broad, revert that entry and its tests while keeping the materials fix.
- UI rollback: not expected. If a UI renderer change was introduced, remove it and return to content-only rendered fields.

## Handoff To Implementation

Implementation Agent should start with Slice A and record the source basis before editing. The expected implementation is small: content prose, focused tests, and any required deterministic fingerprint/evidence refresh. Do not render all `claims` globally, and do not claim completion until `tasks.md` contains evidence that the timing contrast is visible in rendered learner material.
