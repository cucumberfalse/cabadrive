# Tasks: Study Guide Language Review

## Architect Planning Setup

- [x] T001 Confirm assigned worktree `/Users/chap/devel/cabadrive-015-study-guide-language-review-intake`.
- [x] T002 Confirm assigned branch `codex/015-study-guide-language-review-intake`.
- [x] T003 Read `AGENTS.md`.
- [x] T004 Read `.specify/memory/constitution.md`.
- [x] T005 Read `docs_project/README.md`.
- [x] T006 Read `docs_project/project-idea.md`.
- [x] T007 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T008 Read `docs_project/project/backend/backend-docs.md`.
- [x] T009 Read `docs_project/project/feature-inventory.md`.
- [x] T010 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T011 Read `docs/specify/README.md`.
- [x] T012 Read `specs/015-study-guide-language-review/feature-request.md`.
- [x] T013 Read `specs/006-topic-study-guide/spec.md`.
- [x] T014 Read `specs/006-topic-study-guide/plan.md`.
- [x] T015 Read relevant parts of `specs/006-topic-study-guide/tasks.md`, especially source-boundary decisions and topic-content process memory.
- [x] T016 Inspect `src/App.tsx` topic-guide rendering scope.
- [x] T017 Inspect `src/data/content.ts` topic-guide TypeScript shape.
- [x] T018 Inspect `content/guide/topic-study-guide.ru.json` counts and topic IDs read-only.

## Architect Artifacts

- [x] T019 Create `spec.md` with goal, scope, non-goals, field scope, preserve list, acceptance criteria, negative scenarios, functional requirements, and review requirements.
- [x] T020 Create `plan.md` with style/inventory pilot, representative pilot topics, sequential topic groups, verification design, and review-agent requirements.
- [x] T021 Create this `tasks.md` with future implementation tasks, process-memory requirements, decisions, known issues, and evidence templates.

## Future Slice A: Style Rubric And Inventory Pilot

- [x] T022 Create a baseline inventory entry in this file for all in-scope rendered fields.
- [x] T023 Record counts for topics, summaries, learning paragraphs, practical-reasoning paragraphs, Spanish term translations, ticket placements, unique question IDs, answer explanations, trap notes, source-conflict notes, duplicated question IDs, and non-rendered claims.
- [x] T024 Record examples of current readability problems, including process/meta words, mixed Spanish/English/Russian without Russian anchor, long legalistic paragraphs, partial English trap notes, and weak CABA/RF framing.
- [x] T025 Record the exact PR #63 / feature 009 forbidden-path guard for this feature.
- [x] T026 Do not rewrite the full guide in Slice A.

## Future Slice B: Representative Pilot Topics

- [x] T027 Review and rewrite root `titleRu` and `disclaimer` if needed.
- [x] T028 Review and rewrite in-scope rendered fields for `documents-licenses-and-insurance`.
- [x] T029 Review and rewrite in-scope rendered fields for `fatigue-distraction-and-attention`.
- [x] T030 Review and rewrite in-scope rendered fields for `information-signs`.
- [x] T031 Preserve the missing `slug` on `fatigue-distraction-and-attention` as an out-of-scope metadata oddity unless a later Architect task changes scope.
- [x] T032 Record pilot field counts reviewed and changed by field type.
- [x] T033 Record before/after samples for each pilot topic.
- [x] T034 Record source-sensitive unchanged text and duplicated-ticket handling for pilot topics.
- [x] T035 Run required validation and record evidence.

## Future Slice C: Parking And Maneuver Topics

- [ ] T036 Review and rewrite `parking-clearances-and-corners`.
- [ ] T037 Review and rewrite `parking-prohibitions-and-signed-zones`.
- [ ] T038 Review and rewrite `stopping-vs-parking-maneuvers`.
- [ ] T039 Preserve stale or ticket-specific parking-rule formulas from feature 006 source-boundary decisions.
- [ ] T040 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice D: Vehicle, Lights, And Occupant Topics

- [ ] T041 Review and rewrite `driver-hand-signals`.
- [ ] T042 Review and rewrite `vehicle-lights-and-signaling`.
- [ ] T043 Review and rewrite `vehicle-condition-maintenance-loads`.
- [ ] T044 Review and rewrite `mirrors-blind-spots-and-visibility`.
- [ ] T045 Review and rewrite `occupant-protection`.
- [ ] T046 Preserve ticket-specific image and illustrated-signal boundaries from feature 006.
- [ ] T047 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice E: Pedestrian And School-Zone Topics

- [ ] T048 Review and rewrite `pedestrian-and-school-road-markings`.
- [ ] T049 Review and rewrite `pedestrian-school-zones-and-markings`.
- [ ] T050 Review and rewrite `pedestrian-crossings-and-priority`.
- [ ] T051 Split this slice before implementation if `pedestrian-school-zones-and-markings` makes the diff too large for reliable review.
- [ ] T052 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice F: Speed, Weather, Impairment, And Risk Topics

- [ ] T053 Review and rewrite `speed-limits`.
- [ ] T054 Review and rewrite `safe-distance-and-braking`.
- [ ] T055 Review and rewrite `alcohol-drugs-and-impairment`.
- [ ] T056 Review and rewrite `adverse-weather-and-visibility`.
- [ ] T057 Review and rewrite `safety-principles-and-risk`.
- [ ] T058 Preserve feature 006 source boundaries for medical, statistical, numeric, and ticket-specific claims.
- [ ] T059 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice G: Warning Signs And Related Priority Signals

- [ ] T060 Review and rewrite `warning-signs`.
- [ ] T061 Review and rewrite `right-of-way-signals-and-rail-crossings`.
- [ ] T062 Preserve mixed warning/priority/authority source boundaries and ticket placements from feature 006.
- [ ] T063 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice H: Road Types, Regulatory Signs, Traffic Lights, And Public Transport

- [ ] T064 Review and rewrite `road-types-highways-and-routes`.
- [ ] T065 Review and rewrite `regulatory-signs`.
- [ ] T066 Review and rewrite `traffic-lights-and-rail-crossings`.
- [ ] T067 Review and rewrite `public-transport-and-exclusive-lanes`.
- [ ] T068 Preserve taxonomy-mixed and ticket-specific decisions from feature 006.
- [ ] T069 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice I: Right-Of-Way, Lanes, Turns, And Overtaking

- [ ] T070 Review and rewrite `right-of-way-basic-intersections`.
- [ ] T071 Review and rewrite `right-of-way-special-situations`.
- [ ] T072 Review and rewrite `center-lines-and-crossing-rules`.
- [ ] T073 Review and rewrite `lane-and-channelization-markings`.
- [ ] T074 Review and rewrite `lane-choice-and-lane-changes`.
- [ ] T075 Review and rewrite `turns-direction-and-reversing`.
- [ ] T076 Review and rewrite `overtaking-and-passing`.
- [ ] T077 Ask Orchestrator to split this slice into two sequential PRs if the diff becomes too large for reliable review.
- [ ] T078 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice J: Bicycles, Micromobility, And Shared Spaces

- [ ] T079 Review and rewrite `bicycles-and-micromobility`.
- [ ] T080 Review and rewrite `sustainable-mobility-and-vulnerable-users`.
- [ ] T081 Review and rewrite `vulnerable-users-and-shared-spaces`.
- [ ] T082 Keep Spanish terms such as `bicisenda`, `ciclovía`, `ciclorrodado`, and `DMP` visible with clear Russian anchors.
- [ ] T083 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice K: Crash, Emergency, Legal Duties, And Authorities

- [ ] T084 Review and rewrite `emergency-response-and-crash-scene`.
- [ ] T085 Review and rewrite `crash-liability-and-legal-duties`.
- [ ] T086 Review and rewrite `authorities-controls-and-sanctions`.
- [ ] T087 Preserve PAS, insurance, witness, civil/penal, stale-statistic, emergency, and authority-source boundaries from feature 006.
- [ ] T088 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice L: Final Coverage And Review Pass

- [ ] T089 Prove all 38 topic IDs were reviewed.
- [ ] T090 Prove root `titleRu` and `disclaimer` were reviewed.
- [ ] T091 Prove all in-scope rendered fields were reviewed or explicitly left unchanged for source-sensitive reasons.
- [ ] T092 Prove 460 unique question IDs remain represented.
- [ ] T093 Prove 639 rendered ticket placements remain represented.
- [ ] T094 Prove 1,831 answer explanations remain present and every `answerId` / `verdict` is preserved.
- [ ] T095 Prove 225 trap notes remain present unless a later Architect task explicitly scopes otherwise.
- [ ] T096 Prove 4 source-conflict notes remain present unless a later Architect task explicitly scopes otherwise.
- [ ] T097 Prove no translation shard, explanation shard, image metadata, validation evidence, validator, test, product-code, package, durable-doc, coverage-manifest, source-trace-manifest, or official-document files were touched without later Architect scope.
- [ ] T098 Prove no new source claims were introduced without source trace or Architect disposition.
- [ ] T099 Run final validation commands and record evidence.
- [ ] T100 Record final known issues and Implementation Agent feedback for Architect disposition.

## Per-Slice Process Memory Template

Implementation Agents must add one entry per slice under "Process Memory" with this shape:

```text
- Slice <id> worktree/branch:
- Topics reviewed:
- Field counts reviewed:
  - root title/disclaimer:
  - titles:
  - summaries:
  - learning paragraphs:
  - practical reasoning paragraphs:
  - term translations:
  - source-conflict notes:
  - answer explanations:
  - trap notes:
- Field counts changed:
- Ticket placements before/after:
- Unique question IDs before/after:
- Answer explanations before/after:
- Source-conflict notes before/after:
- Duplicated question IDs touched:
- Duplicate handling decision:
- Source-sensitive sentences left unchanged:
- CABA/RF notes added or clarified:
- Before/after samples:
- PR #63 forbidden-path guard:
- Validation evidence:
- Known issues:
- Implementation Agent feedback:
```

## Topic Coverage Ledger

| Topic ID | Planned Slice | Review Status |
| --- | --- | --- |
| `parking-clearances-and-corners` | C | Pending |
| `parking-prohibitions-and-signed-zones` | C | Pending |
| `driver-hand-signals` | D | Pending |
| `vehicle-lights-and-signaling` | D | Pending |
| `vehicle-condition-maintenance-loads` | D | Pending |
| `pedestrian-and-school-road-markings` | E | Pending |
| `pedestrian-school-zones-and-markings` | E | Pending |
| `speed-limits` | F | Pending |
| `safe-distance-and-braking` | F | Pending |
| `alcohol-drugs-and-impairment` | F | Pending |
| `adverse-weather-and-visibility` | F | Pending |
| `fatigue-distraction-and-attention` | B | Reviewed in Slice B |
| `road-types-highways-and-routes` | H | Pending |
| `regulatory-signs` | H | Pending |
| `warning-signs` | G | Pending |
| `information-signs` | B | Reviewed in Slice B |
| `traffic-lights-and-rail-crossings` | H | Pending |
| `right-of-way-signals-and-rail-crossings` | G | Pending |
| `right-of-way-basic-intersections` | I | Pending |
| `right-of-way-special-situations` | I | Pending |
| `documents-licenses-and-insurance` | B | Reviewed in Slice B |
| `authorities-controls-and-sanctions` | K | Pending |
| `safety-principles-and-risk` | F | Pending |
| `stopping-vs-parking-maneuvers` | C | Pending |
| `center-lines-and-crossing-rules` | I | Pending |
| `lane-and-channelization-markings` | I | Pending |
| `lane-choice-and-lane-changes` | I | Pending |
| `public-transport-and-exclusive-lanes` | H | Pending |
| `sustainable-mobility-and-vulnerable-users` | J | Pending |
| `vulnerable-users-and-shared-spaces` | J | Pending |
| `bicycles-and-micromobility` | J | Pending |
| `mirrors-blind-spots-and-visibility` | D | Pending |
| `occupant-protection` | D | Pending |
| `emergency-response-and-crash-scene` | K | Pending |
| `crash-liability-and-legal-duties` | K | Pending |
| `pedestrian-crossings-and-priority` | E | Pending |
| `turns-direction-and-reversing` | I | Pending |
| `overtaking-and-passing` | I | Pending |

## Process Memory

- Architect orientation confirmed the current rendered guide fields by reading `src/App.tsx`: root `titleRu` and `disclaimer`; topic `titleRu`, `summaryRu`, `learningMaterialRu`, optional `practicalReasoningRu`, `spanishTerms[].translationRu`, `tickets[].sourceConflictNoteRu`, `tickets[].answerExplanations[].explanationRu`, and `trapNotes[].textRu` are rendered in `Материалы`.
- Architect orientation confirmed `topics[].claims[].textRu` is validated by `scripts/content-topic-guide.mjs` but is not rendered by the current `TopicGuideView`; preserve it as metadata by default.
- Architect orientation inventory matched the assignment: 38 topics, 38 summaries, 267 learning paragraphs, 109 practical reasoning paragraphs, 731 term translations, 639 ticket placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, and 170 claims.
- Architect orientation confirmed 179 question IDs appear in two topic blocks. Duplicated explanations must be reviewed intentionally and not allowed to drift by accident.
- Architect orientation confirmed `fatigue-distraction-and-attention` is missing `slug`. This is a known metadata oddity and out of scope for the language review.
- Architect decision: future implementation is sequential because the guide is one large JSON. Orchestrator must not assign parallel workers to edit `content/guide/topic-study-guide.ru.json` for this feature.
- Architect decision: default implementation file scope is `content/guide/topic-study-guide.ru.json` plus this `tasks.md`. Other files require later Architect scope.
- Architect decision: PR #63 / feature 009 conflict guard is mandatory for every slice. This feature must not touch `content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, related validators/tests/docs, or package files.
- Slice A worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-intake` on `codex/015-study-guide-language-review-intake`.
- Topics reviewed: read-only inventory across all 38 topic IDs; no rendered guide text was rewritten in Slice A.
- Field counts reviewed:
  - root title/disclaimer: 2 rendered root fields (`titleRu`, `disclaimer`)
  - titles: 38
  - summaries: 38
  - learning paragraphs: 267
  - practical reasoning paragraphs: 109
  - term translations: 731
  - source-conflict notes: 4
  - answer explanations: 1,831
  - trap notes: 225
- Field counts changed: 0; Slice A performed no product/content JSON rewrite and did not edit `content/guide/topic-study-guide.ru.json`.
- Ticket placements before/after: 639 / 639 by read-only baseline; no guide JSON edit was performed.
- Unique question IDs before/after: 460 / 460 by read-only baseline; no guide JSON edit was performed.
- Answer explanations before/after: 1,831 / 1,831 by read-only baseline; no guide JSON edit was performed.
- Source-conflict notes before/after: 4 / 4 by read-only baseline; no guide JSON edit was performed.
- Duplicated question IDs touched: 0 changed; read-only inventory found 179 question IDs with two placements. Examples for later duplicate review include `b-fallback-002`, `b-fallback-008`, `b-fallback-009`, `b-fallback-011`, `b-fallback-012`, and `b-fallback-015`.
- Duplicate handling decision: no duplicate placement text changed in Slice A. Later rewrite slices must compare duplicated placements deliberately and record whether explanations stay aligned or remain topic-specific.
- Source-sensitive sentences left unchanged: all source-conflict and stale-ticket notes were preserved. Current source-conflict examples are `documents-licenses-and-insurance` tickets `b-fallback-024`, `b-fallback-135`, `b-fallback-309`, and `b-fallback-456`.
- CABA/RF notes added or clarified: none; Slice A was inventory-only. Readability inventory flagged likely CABA/RF framing review points in `vehicle-lights-and-signaling` `learningMaterialRu[2]`, `speed-limits` `summaryRu`, `safe-distance-and-braking` `learningMaterialRu[1]`, and `alcohol-drugs-and-impairment` `learningMaterialRu[2]` and `[3]`.
- Before/after samples: not applicable because Slice A has no rewrite. Baseline readability examples without long quotes:
  - Process/meta words: `parking-clearances-and-corners` `learningMaterialRu[7]` uses taxonomy/process wording; `parking-prohibitions-and-signed-zones` ticket `b-fallback-010` explanations use fallback/canonical-answer wording.
  - Mixed Spanish/English/Russian without enough Russian learner anchor: `pedestrian-school-zones-and-markings` tickets `b-fallback-318`, `b-fallback-337`, `b-fallback-369`, and `b-fallback-373` include English explanation fragments.
  - Long legalistic paragraphs: `parking-prohibitions-and-signed-zones` `learningMaterialRu[3]`, `driver-hand-signals` `learningMaterialRu[1]`, and `alcohol-drugs-and-impairment` `learningMaterialRu[1]` and `[4]`.
  - Partial English trap notes: `parking-clearances-and-corners` `trap-mixed-distance-questions`, `parking-prohibitions-and-signed-zones` `trap-avenida-calle-acera-side`, and `vehicle-condition-maintenance-loads` `trap-ticket-specific-mixed-items`.
  - Source-conflict notes needing clearer Russian learner prose: `documents-licenses-and-insurance` tickets `b-fallback-024`, `b-fallback-135`, `b-fallback-309`, and `b-fallback-456`.
- PR #63 forbidden-path guard: active forbidden paths for this feature are `content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, related validators/tests/docs, and package files. Slice A write scope was restricted to this `tasks.md`; no forbidden PR #63 path was edited.
- Validation evidence: read-only Node inventory parsed `content/guide/topic-study-guide.ru.json` and produced the baseline above: 38 topics, 38 summaries, 267 learning paragraphs, 109 practical reasoning paragraphs, 731 term translations, 639 ticket placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 179 duplicated question IDs, and 170 non-rendered claims.
- Known issues: `topics[].claims[].textRu` has 170 entries and remains non-rendered source/validation metadata; preserve claims text by default unless Architect later scopes a metadata cleanup. Current rendered prose still contains process/meta words, English fragments, long paragraphs, partial English trap notes, and weak CABA/RF framing that later rewrite slices must address.
- Implementation Agent feedback: none; Slice A found no reason to expand scope beyond inventory evidence.
- Slice B worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-intake` on `codex/015-study-guide-language-review-intake`.
- Topics reviewed: `documents-licenses-and-insurance`, `fatigue-distraction-and-attention`, `information-signs`; root `titleRu` and `disclaimer` were also reviewed and clarified.
- Field counts reviewed:
  - root title/disclaimer: 2
  - titles: 3
  - summaries: 3
  - learning paragraphs: 23
  - practical reasoning paragraphs: 5
  - term translations: 68
  - source-conflict notes: 4
  - answer explanations: 170
  - trap notes: 17
- Field counts changed:
  - root title/disclaimer: 2
  - titles: 1
  - summaries: 3
  - learning paragraphs: 23
  - practical reasoning paragraphs: 5
  - term translations: 33
  - source-conflict notes: 4
  - answer explanations: 147
  - trap notes: 14
- Ticket placements before/after: global 639 / 639; Slice B topics 58 / 58.
- Unique question IDs before/after: global 460 / 460; Slice B topics 58 / 58.
- Answer explanations before/after: global 1,831 / 1,831; Slice B topics 170 / 170.
- Source-conflict notes before/after: global 4 / 4; Slice B source-conflict notes 4 / 4, all in `documents-licenses-and-insurance`.
- Duplicated question IDs touched: `b-fallback-023`, `b-fallback-092`, `b-fallback-157`, `b-fallback-243`, `b-fallback-322`, `b-fallback-367`, `b-fallback-432`, `b-fallback-069`, `b-fallback-175`, `b-fallback-217`, `b-fallback-231`, `b-fallback-276`, `b-fallback-293`, `b-fallback-354`, `b-fallback-405`, `b-fallback-066`, `b-fallback-274`, `b-fallback-455`.
- Duplicate handling decision: Slice B rewrote only the assigned topic placements. Matching placements in out-of-scope topics were deliberately left unchanged for their later slices, so duplicated explanations remain intentionally topic-specific for now rather than forcibly aligned across topics.
- Source-sensitive sentences left unchanged: all `claims[].textRu` metadata was preserved, including the 14 claims inside Slice B topics and the 170 global claims. Rendered examples left unchanged because they were already clear and source/numeric sensitive include `b-fallback-072-a3` on `60 días hábiles`, `b-fallback-114-a3` on final digit `3` / `marzo`, `b-fallback-214-a2` on final digit `7` / `julio`, `b-fallback-243-a2` on initial `20 puntos`, `b-fallback-432-a1` on `ÚNICAMENTE ... vías interurbanas`, `b-fallback-204-a2` on `visión borrosa` / `parpadeos`, `b-fallback-287-a2` on `neumático` / `Gomería`, and `b-fallback-455-a2` on `ESTACIONAMIENTO` / `inmediaciones`.
- CABA/RF notes added or clarified: no new RF legal rule was added. The Slice B prose clarified CABA-specific points that are easy for an RF-trained driver to mis-assume: current `cédula azul no es exigible` vs old-ticket answers, CABA VTV timing/schedule by `dominio`, no broad grace driving after `vencimiento`, CABA `retención de licencia` cases, and CABA `estado psicofísico` / driver-vs-passenger phone boundaries. `information-signs` received sign-category clarification only; no CABA/RF difference was introduced there.
- Before/after samples:
  - Root disclaimer: before "Он помогает разбирать билеты и не является официальным текстом GCBA."; after "Он помогает учиться, но не заменяет официальные тексты GCBA и не делает эту базу полной официальной подборкой."
  - `documents-licenses-and-insurance`: before "учите ответ билета как legacy/stale-question trap"; after "учите это именно как старый ответ, а не как новое общее правило."
  - `documents-licenses-and-insurance`: before source-conflict note "Legacy/stale cédula azul wording..."; after "Старая формулировка про cédula azul: текущие источники говорят, что cédula azul no es exigible."
  - `fatigue-distraction-and-attention`: before "pedestrians, cyclists и movement around you"; after "peatones, ciclistas и движением вокруг."
  - `fatigue-distraction-and-attention`: before "ticket-specific recommendation; broader official claim"; after "рекомендация именно для этого вопроса; общий источник здесь только про сохранение aptitud и atención."
  - `information-signs`: before "parking nearby не означает"; after "знак о парковке поблизости не означает."
  - `information-signs`: before "warning sign или road marking"; after "предупреждающим знаком или разметкой."
- PR #63 forbidden-path guard: Slice B write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. `content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, related validators/tests/docs, and package files were not edited.
- Validation evidence:
  - JSON parse sanity for `content/guide/topic-study-guide.ru.json`: pass; Node JSON parse completed successfully.
  - Structural count guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, and 4 source-conflict notes; `fatigue-distraction-and-attention` still has no `slug`.
  - Allowed-field guard: pass; comparison against `HEAD` found only root `titleRu`/`disclaimer` and rendered learner-facing Slice B fields changed, with no metadata or `claims[].textRu` changes.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass.
  - `git status --short --branch`: pass for expected dirty state only, showing the branch plus modified guide JSON and the untracked feature memory folder.
  - Forbidden-path guard commands over `content/translations`, `content/explanations`, `content/image-metadata`, `content/validation`, validators/tests/docs, and package files: pass, no output.
  - Post-slice Orchestrator preflight: first `pnpm run preflight` failed at build with `sh: vite: command not found` because the fresh worktree had no `node_modules`; repo/content/unit portions had already passed before that failure. `pnpm install` then completed with lockfile up to date and no tracked dependency-file changes. Rerun `pnpm run preflight` passed: feature-memory gate, repo baseline, content validation, 72 Node tests, production build, nested e2e build, and 14 Playwright tests.
- Known issues: `fatigue-distraction-and-attention` remains missing `slug` by explicit scope requirement. Duplicate placements outside Slice B still need deliberate review in their assigned later slices. Existing non-blocking post-slice preflight warnings: Vite large chunk warning and Playwright `NO_COLOR`/`FORCE_COLOR` warning.
- Implementation Agent feedback: Slice B found no need to change coverage/source-trace manifests, claims metadata, tests, package files, product code, or PR #63 paths. Future slices should continue replacing learner-facing English/process words while preserving stale-ticket boundaries.
- Slice B review-fix note: addressed Review Agent P2 by removing duplicated Spanish labels from Slice B `spanishTerms[].translationRu` values because `termEs` already renders separately. The fix touched 43 term-translation values: 9 in `documents-licenses-and-insurance`, 24 in `fatigue-distraction-and-attention`, and 10 in `information-signs`. It also corrected malformed Spanish support `descansar más frecuencia, отдыхать чаще` to Russian-only `отдыхать чаще`; `termEs` remains `descansar con más frecuencia`.
- Slice B review-fix guard: no `termEs`, IDs, `sourceQuestionIds`, claims, coverage/source-trace manifests, forbidden PR #63 paths, product code, tests, docs, or package files were edited. The adjusted Slice B term-translation changed count is now 33 versus the original baseline.
- PR #70 post-#71 update evidence: merged `origin/main` `a26a12493123fcc0774a513e44fbf23663658ec0` into Slice A+B head `8ae93b53f2f8caace452b7c4a2083da689ce5229`; the pushed PR head is the merge/evidence commit that contains this entry. Conflict scope was limited to `content/guide/topic-study-guide.ru.json`, which is inside the assigned write scope.
- PR #70 post-#71 merge decision: preserved Slice A+B learner-facing Russian text from the PR side and carried forward #71 topic `difficulty` / `difficultyMeta` from `origin/main` for all 38 topics. After preserving the Slice B text changes, refreshed only the stale `difficultyMeta.sourceFingerprint` values for `fatigue-distraction-and-attention`, `information-signs`, and `documents-licenses-and-insurance`; difficulty levels, dimensions, rationale, provenance, basis, IDs, claims, topic assignments, and rendered ticket structure were otherwise preserved.
- PR #70 post-#71 files changed by this update: `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md` only. Merge-preserved #71 files remain part of `origin/main`; the PR diff guard against `origin/main` is expected to stay within the feature guide/spec files.
- PR #70 post-#71 validation evidence:
  - JSON parse and difficulty guard: pass; 38 topics, 38 `difficulty`, and 38 `difficultyMeta` entries.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/*`: pass.
  - changed-path guard against PR #63 forbidden paths: pass; `git diff --name-only origin/main...HEAD` listed only `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/{feature-request.md,plan.md,spec.md,tasks.md}`, with no `content/translations`, `content/explanations`, `content/image-metadata`, `content/validation`, validators, tests, docs, scripts, or package files.
  - `git status --short --branch`: pass; clean working tree on `codex/015-study-guide-language-review-intake` after the merge/evidence commit, ahead of `origin/codex/015-study-guide-language-review-intake` pending push.

## Known Issues

- `fatigue-distraction-and-attention` has no `slug`; known metadata oddity, out of scope unless separately planned.
- The current guide contains learner-facing process/meta words such as `fallback`, `ticket-specific`, `source-backed`, and `canonical answer`. Rewrites should replace these with plain Russian learner-facing wording where they appear in rendered fields.
- Several feature 006 source-boundary decisions intentionally keep details ticket-specific or stale-ticket-specific. Language changes must preserve those boundaries.

## Implementation Agent Feedback

- Slice B feedback is recorded in Process Memory; no scope expansion or Architect disposition is requested from this slice.
