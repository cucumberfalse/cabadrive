# Plan: Study Guide Language Review

## Summary

Run a sequential Russian readability pass over `content/guide/topic-study-guide.ru.json`. Start with a style/inventory pilot, then rewrite representative pilot topics, then proceed through topic groups in order. Each implementation slice updates this feature's `tasks.md` with evidence. The guide JSON is one large shared file, so implementation must not be parallelized across multiple workers editing that file.

This Architect PR writes planning artifacts only. It does not edit product code, guide JSON, content shards, tests, docs outside this feature folder, commits, or PRs.

## Technical Context

- Runtime: static React/Vite app; no backend.
- Current content mode: `unofficial_b_fallback`.
- Topic guide content: `content/guide/topic-study-guide.ru.json`.
- Topic guide renderer: `src/App.tsx` `TopicGuideView` and `TopicGuideTicketBlock`.
- Content typing import: `src/data/content.ts`.
- Existing topic-guide validator: `scripts/content-topic-guide.mjs`.
- Existing topic-guide tests: `tests/content-topic-guide.test.mjs`.
- Existing validation commands:
  - `node --test tests/content-topic-guide.test.mjs`
  - `pnpm run validate:content`
  - `pnpm run test`
  - `pnpm run build`
  - `pnpm run preflight`
  - `git diff --check`

## Constitution Check

- Spec-first: yes; Analyst intake exists and this Architect plan creates `spec.md`, `plan.md`, and `tasks.md`.
- Testable boundaries: yes; later slices must prove JSON validity, guide validator compatibility, preserved counts, and no forbidden file edits.
- Test-first bias: this is a content rewrite. The required verification is existing validator/test execution plus explicit inventory evidence. New tests are not expected unless a later Architect task broadens scope.
- Supervised verification: yes; every slice records topic IDs, counts, samples, and command evidence in `tasks.md`.
- PR-only workflow: yes; future work lands through PRs.
- One worktree per task: yes; each slice gets an isolated worktree/branch/PR.
- Deployability: yes; every slice must leave content validation and build-compatible JSON intact.
- Simplicity: yes; use the existing JSON and validation surface. Do not introduce a new content format for this pass.
- Process memory: yes; `tasks.md` is the per-slice evidence ledger.

## Architect Decisions

### One Shared JSON Means Sequential Work

`content/guide/topic-study-guide.ru.json` is large and shared. Orchestrator must assign one implementation slice at a time for this feature. Parallel workers must not edit the same JSON in separate branches because conflicts would be likely and accidental duplicate-explanation drift would be hard to review.

### Style Rubric Before Bulk Rewriting

The style rubric in `spec.md` is the governing rubric. The first implementation slice must record an inventory baseline and a small before/after sample review before any broad topic-band rewrite starts.

### Content-Only Default

Most implementation slices should edit only:

- `content/guide/topic-study-guide.ru.json`
- `specs/015-study-guide-language-review/tasks.md`

They must not edit translation shards, explanation shards, image metadata, validation evidence, coverage/source-trace manifests, validators, tests, product code, package files, or durable docs unless a later Architect update explicitly scopes that change.

### PR #70 E2E Fixture Scope Expansion

Codex AI Review raised a blocking P2 on PR #70 because the final diff included `tests/e2e/app.spec.ts` while the feature memory still described tests as out of scope. The later Architect disposition is:

- The `tests/e2e/app.spec.ts` change is allowed only as a narrow fixture update after CI proved the old assertion still expected English/process markers in a rendered Russian learner text check.
- The test must assert the current Russian learner-facing semantics from the guide data instead of forcing English words back into `content/guide/topic-study-guide.ru.json`.
- No other tests, validators, packages, product code, content manifests, translation/explanation/image metadata, durable docs outside this feature folder, or source files are added to scope by this exception.
- The final PR #70 changed-path guard must list `tests/e2e/app.spec.ts` explicitly alongside the guide JSON and `specs/015-study-guide-language-review/` files.

### Claims Metadata Is Preserved

`topics[].claims[].textRu` is Russian but not rendered in the current app. Treat it as source/validation metadata. A language slice must preserve it by default. If implementation finds claim wording that is dangerously unclear, it records feedback for Architect instead of silently editing metadata.

### Existing Source Boundaries Still Control Meaning

Feature 006 process memory contains source-boundary decisions for stale tickets, source conflicts, and ticket-specific explanations. This feature may simplify language but must not reopen those decisions. If a sentence depends on a source boundary and cannot be simplified safely, leave it unchanged and record the reason.

### Missing Slug Is Known But Out Of Scope

`fatigue-distraction-and-attention` currently has no `slug` in `content/guide/topic-study-guide.ru.json`. This is a metadata oddity. It is out of scope for the language review unless Architect later creates a narrow metadata cleanup task.

## Implementation Slices

### Slice A: Style Rubric And Inventory Pilot

Purpose: establish repeatable evidence before rewriting.

Scope:

- Read the style rubric and current guide shape.
- Generate a baseline inventory for all in-scope rendered fields.
- Record the baseline in `tasks.md`.
- Identify high-risk text patterns: English process words, long legalistic paragraphs, weak Spanish/Russian anchors, source-conflict notes, duplicated tickets, and CABA/RF places where the learner may assume RF practice.
- Do not rewrite the full guide in this slice.

Required evidence:

- Counts for all in-scope rendered fields.
- Current count of 38 topics, 460 unique question IDs, 639 ticket placements, 1,831 answer explanations, 225 trap notes, and 4 source-conflict notes.
- Confirmation that `topics[].claims[].textRu` has 170 entries and remains out of rendered scope.
- PR #63 conflict guard showing no forbidden paths touched.

### Slice B: Representative Pilot Topics

Purpose: prove the style on a reviewable set before the full pass.

Topics:

- `documents-licenses-and-insurance`
- `fatigue-distraction-and-attention`
- `information-signs`

Why these topics:

- `documents-licenses-and-insurance` has current-source/stale-ticket conflict notes and administrative vocabulary.
- `fatigue-distraction-and-attention` tests human-factor prose and records the missing-slug oddity as out of scope.
- `information-signs` is small enough to show sign/term handling without making the pilot too large.

Rules:

- Rewrite only rendered learner fields for these topics plus the root `titleRu` and `disclaimer` if needed.
- Preserve all metadata and source boundaries.
- Record before/after samples for each topic.
- Record duplicated question IDs touched by the pilot and whether duplicated explanations were aligned or intentionally topic-specific.

### Slice C: Parking And Maneuver Topics

Topics:

- `parking-clearances-and-corners`
- `parking-prohibitions-and-signed-zones`
- `stopping-vs-parking-maneuvers`

Notes:

- This group includes stale or ticket-specific parking formulas. Keep current-source and stale-ticket boundaries from feature 006.

### Slice D: Vehicle, Lights, And Occupant Topics

Topics:

- `driver-hand-signals`
- `vehicle-lights-and-signaling`
- `vehicle-condition-maintenance-loads`
- `mirrors-blind-spots-and-visibility`
- `occupant-protection`

Notes:

- Preserve image-specific and illustrated-signal ticket explanations where feature 006 kept them ticket-specific.

### Slice E: Pedestrian And School-Zone Topics

Topics:

- `pedestrian-and-school-road-markings`
- `pedestrian-school-zones-and-markings`
- `pedestrian-crossings-and-priority`

Notes:

- `pedestrian-school-zones-and-markings` is a large/risky topic. Keep this slice focused and split it further if the diff becomes hard to review.

### Slice F: Speed, Weather, Impairment, And Risk Topics

Topics:

- `speed-limits`
- `safe-distance-and-braking`
- `alcohol-drugs-and-impairment`
- `adverse-weather-and-visibility`
- `safety-principles-and-risk`

Notes:

- `safety-principles-and-risk` is large/risky. Preserve feature 006 boundaries for medical/statistical and ticket-specific claims.

### Slice G: Warning Signs And Related Priority Signals

Topics:

- `warning-signs`
- `right-of-way-signals-and-rail-crossings`

Notes:

- `warning-signs` is large/risky and has mixed behavior/sign content. Keep topic placement unchanged.

### Slice H: Road Types, Regulatory Signs, Traffic Lights, And Public Transport

Topics:

- `road-types-highways-and-routes`
- `regulatory-signs`
- `traffic-lights-and-rail-crossings`
- `public-transport-and-exclusive-lanes`

Notes:

- Preserve the feature 006 decisions that some tickets remain taxonomy-mixed or ticket-specific.

### Slice I: Right-Of-Way, Lanes, Turns, And Overtaking

Topics:

- `right-of-way-basic-intersections`
- `right-of-way-special-situations`
- `center-lines-and-crossing-rules`
- `lane-and-channelization-markings`
- `lane-choice-and-lane-changes`
- `turns-direction-and-reversing`
- `overtaking-and-passing`

Notes:

- This is the largest topic count slice. Orchestrator may split it into two sequential PRs if review size becomes too high.

### Slice J: Bicycles, Micromobility, And Shared Spaces

Topics:

- `bicycles-and-micromobility`
- `sustainable-mobility-and-vulnerable-users`
- `vulnerable-users-and-shared-spaces`

Notes:

- `bicycles-and-micromobility` is large/risky. Keep Spanish terms such as `bicisenda`, `ciclovía`, `ciclorrodado`, and `DMP` visible with clear Russian anchors.

### Slice K: Crash, Emergency, Legal Duties, And Authorities

Topics:

- `emergency-response-and-crash-scene`
- `crash-liability-and-legal-duties`
- `authorities-controls-and-sanctions`

Notes:

- Preserve stale-statistic, PAS, insurance, witness, civil/penal, and authority-source boundaries from feature 006.

### Slice L: Final Coverage And Review Pass

Purpose: prove the full language review is complete.

Scope:

- Confirm all 38 topics and root fields were reviewed.
- Confirm all in-scope rendered fields have evidence in `tasks.md`.
- Confirm all 460 unique question IDs and 639 rendered placements remain represented.
- Confirm 179 duplicated question IDs were handled deliberately across reviewed topics.
- Confirm no forbidden PR #63 / feature 009 paths were touched.
- Confirm no new source claims were introduced without source trace or Architect disposition.
- Run final validation and record evidence.

## Per-Slice Process Memory Requirements

Every implementation slice must add a process-memory entry to `tasks.md` with:

- branch/worktree and PR slice name;
- topic IDs reviewed;
- field counts reviewed by field type;
- field counts changed by field type;
- before/after samples, at least one from each changed topic;
- source-sensitive sentences left unchanged, with reason;
- any new or clarified CABA/RF note, with a source-safety explanation;
- duplicated question IDs touched and whether explanations were kept aligned or intentionally topic-specific;
- answer explanation count before/after;
- ticket placement count before/after;
- source-conflict note count before/after when the slice touches any source-conflict topic;
- PR #63 conflict guard showing no forbidden paths touched;
- validation commands and exact result;
- known issues and Implementation Agent feedback for Architect disposition.

## Verification Design

### Inventory Checks

Each slice should use a read-only JSON inventory to record:

- topic count;
- in-scope field counts;
- ticket placements and unique question IDs;
- answer explanation count;
- trap note count;
- source-conflict note count;
- duplicated question IDs touched by that slice.

The final pass must aggregate the slice ledger and prove every topic ID appears exactly once in a reviewed slice, except pilot topics that may appear in both pilot and final coverage review.

### Required Local Commands Per Content Slice

Minimum commands:

```bash
node --test tests/content-topic-guide.test.mjs
pnpm run validate:content
git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md
git status --short --branch
```

Run broader commands when the slice is large or source-sensitive:

```bash
pnpm run test
pnpm run build
pnpm run preflight
```

If dependencies are missing in a fresh worktree, the agent may install according to repository practice and must record that no dependency lock/package files changed unless explicitly in scope.

### Forbidden-Path Guard

Each implementation PR must prove its diff does not include:

```text
content/translations/
content/explanations/
content/image-metadata/
content/validation/
scripts/
tests/
src/
package.json
pnpm-lock.yaml
docs_project/
content/guide/topic-study-guide.coverage.json
content/guide/topic-study-guide.source-trace.json
content/official-documents/
```

Exceptions require a later Architect update before implementation.

### Meaning-Preservation Review

Automated validation is not enough. Each slice must include human-reviewable before/after samples and must flag:

- numbers and distances;
- legal duties;
- document requirements;
- priority rules;
- stale-ticket/source-conflict wording;
- answer verdict language;
- Spanish terms whose meaning could be narrowed or broadened by translation.

### Duplicate Placement Review

For any touched question ID that appears in two topic blocks:

- compare both topic-specific explanations before editing;
- decide whether the wording should remain aligned or differ by topic context;
- record that decision;
- avoid changing one duplicate placement accidentally while leaving an inconsistent duplicate elsewhere.

### Source-Claim Guard

Final review must inspect whether any changed rendered text introduces a new factual/legal/procedural/numeric claim. If yes, the implementation must point to existing source-trace support or an Architect-disposed process-memory note. Otherwise the claim must be removed, narrowed back to existing meaning, or left unchanged.

## Review-Agent Requirements

Review Agent must:

- read this feature memory before reviewing;
- verify the implementation stayed inside the assigned slice;
- prioritize meaning preservation, stale-ticket/source-conflict safety, and readability;
- check representative before/after samples for every changed topic;
- inspect source-sensitive unchanged entries;
- inspect duplicated-ticket decisions for touched duplicates;
- confirm forbidden paths were not touched;
- confirm validation evidence is real command evidence, not only prose;
- reject broad rewrites that change legal meaning, source status, ticket placement, or answer verdicts;
- reject text that remains dominated by process words such as `fallback`, `ticket-specific`, `source-backed`, or `canonical answer` in learner-facing fields unless there is a clear Spanish/technical reason and Russian support.

## Risks And Mitigations

- Risk: readability edits change legal meaning.
  - Mitigation: source-sensitive unchanged ledger, before/after samples, and review focused on meaning preservation.

- Risk: one large JSON creates merge conflicts.
  - Mitigation: sequential slices only, one worker at a time for this file.

- Risk: duplicated ticket explanations drift accidentally.
  - Mitigation: per-slice duplicate-placement ledger.

- Risk: the rewrite touches active PR #63 work.
  - Mitigation: forbidden-path guard in every slice.

- Risk: "teenage-readable" becomes childish.
  - Mitigation: style rubric keeps adult experienced-driver voice.

- Risk: CABA/RF notes become broad comparative law.
  - Mitigation: only short exam-relevant notes, no new claims without trace/disposition.
