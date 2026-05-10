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

- [x] T036 Review and rewrite `parking-clearances-and-corners`.
- [x] T037 Review and rewrite `parking-prohibitions-and-signed-zones`.
- [x] T038 Review and rewrite `stopping-vs-parking-maneuvers`.
- [x] T039 Preserve stale or ticket-specific parking-rule formulas from feature 006 source-boundary decisions.
- [x] T040 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice D: Vehicle, Lights, And Occupant Topics

- [x] T041 Review and rewrite `driver-hand-signals`.
- [x] T042 Review and rewrite `vehicle-lights-and-signaling`.
- [x] T043 Review and rewrite `vehicle-condition-maintenance-loads`.
- [x] T044 Review and rewrite `mirrors-blind-spots-and-visibility`.
- [x] T045 Review and rewrite `occupant-protection`.
- [x] T046 Preserve ticket-specific image and illustrated-signal boundaries from feature 006.
- [x] T047 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice E: Pedestrian And School-Zone Topics

- [x] T048 Review and rewrite `pedestrian-and-school-road-markings`.
- [x] T049 Review and rewrite `pedestrian-school-zones-and-markings`.
- [x] T050 Review and rewrite `pedestrian-crossings-and-priority`.
- [x] T051 Split this slice before implementation if `pedestrian-school-zones-and-markings` makes the diff too large for reliable review. Reviewed and not split: all three assigned topics stayed within one coherent pedestrian/school-zone slice and final diff remained limited to the guide JSON plus this feature-memory file.
- [x] T052 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice F: Speed, Weather, Impairment, And Risk Topics

- [x] T053 Review and rewrite `speed-limits`.
- [x] T054 Review and rewrite `safe-distance-and-braking`.
- [x] T055 Review and rewrite `alcohol-drugs-and-impairment`.
- [x] T056 Review and rewrite `adverse-weather-and-visibility`.
- [x] T057 Review and rewrite `safety-principles-and-risk`.
- [x] T058 Preserve feature 006 source boundaries for medical, statistical, numeric, and ticket-specific claims.
- [x] T059 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice G: Warning Signs And Related Priority Signals

- [x] T060 Review and rewrite `warning-signs`.
- [x] T061 Review and rewrite `right-of-way-signals-and-rail-crossings`.
- [x] T062 Preserve mixed warning/priority/authority source boundaries and ticket placements from feature 006.
- [x] T063 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice H: Road Types, Regulatory Signs, Traffic Lights, And Public Transport

- [x] T064 Review and rewrite `road-types-highways-and-routes`.
- [x] T065 Review and rewrite `regulatory-signs`.
- [x] T066 Review and rewrite `traffic-lights-and-rail-crossings`.
- [x] T067 Review and rewrite `public-transport-and-exclusive-lanes`.
- [x] T068 Preserve taxonomy-mixed and ticket-specific decisions from feature 006.
- [x] T069 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

## Future Slice I: Right-Of-Way, Lanes, Turns, And Overtaking

- [x] T070 Review and rewrite `right-of-way-basic-intersections`.
- [x] T071 Review and rewrite `right-of-way-special-situations`.
- [x] T072 Review and rewrite `center-lines-and-crossing-rules`.
- [x] T073 Review and rewrite `lane-and-channelization-markings`.
- [x] T074 Review and rewrite `lane-choice-and-lane-changes`.
- [x] T075 Review and rewrite `turns-direction-and-reversing`.
- [x] T076 Review and rewrite `overtaking-and-passing`.
- [x] T077 Orchestrator split Slice I into two sequential PRs before this implementation: part 1 covered T070-T073, and part 2 covers T074-T076 in a separate stacked branch.
- [x] T078 Record counts, samples, source-sensitive unchanged text, duplicated-ticket handling, PR #63 guard, and validation evidence.

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
| `parking-clearances-and-corners` | C | Reviewed in Slice C |
| `parking-prohibitions-and-signed-zones` | C | Reviewed in Slice C |
| `driver-hand-signals` | D | Reviewed in Slice D |
| `vehicle-lights-and-signaling` | D | Reviewed in Slice D |
| `vehicle-condition-maintenance-loads` | D | Reviewed in Slice D |
| `pedestrian-and-school-road-markings` | E | Reviewed in Slice E |
| `pedestrian-school-zones-and-markings` | E | Reviewed in Slice E |
| `speed-limits` | F | Reviewed in Slice F |
| `safe-distance-and-braking` | F | Reviewed in Slice F |
| `alcohol-drugs-and-impairment` | F | Reviewed in Slice F |
| `adverse-weather-and-visibility` | F | Reviewed in Slice F |
| `fatigue-distraction-and-attention` | B | Reviewed in Slice B |
| `road-types-highways-and-routes` | H | Reviewed in Slice H |
| `regulatory-signs` | H | Reviewed in Slice H |
| `warning-signs` | G | Reviewed in Slice G |
| `information-signs` | B | Reviewed in Slice B |
| `traffic-lights-and-rail-crossings` | H | Reviewed in Slice H |
| `right-of-way-signals-and-rail-crossings` | G | Reviewed in Slice G |
| `right-of-way-basic-intersections` | I | Reviewed in Slice I part 1 |
| `right-of-way-special-situations` | I | Reviewed in Slice I part 1 |
| `documents-licenses-and-insurance` | B | Reviewed in Slice B |
| `authorities-controls-and-sanctions` | K | Pending |
| `safety-principles-and-risk` | F | Reviewed in Slice F |
| `stopping-vs-parking-maneuvers` | C | Reviewed in Slice C |
| `center-lines-and-crossing-rules` | I | Reviewed in Slice I part 1 |
| `lane-and-channelization-markings` | I | Reviewed in Slice I part 1 |
| `lane-choice-and-lane-changes` | I | Reviewed in Slice I part 2 |
| `public-transport-and-exclusive-lanes` | H | Reviewed in Slice H |
| `sustainable-mobility-and-vulnerable-users` | J | Pending |
| `vulnerable-users-and-shared-spaces` | J | Pending |
| `bicycles-and-micromobility` | J | Pending |
| `mirrors-blind-spots-and-visibility` | D | Reviewed in Slice D |
| `occupant-protection` | D | Reviewed in Slice D |
| `emergency-response-and-crash-scene` | K | Pending |
| `crash-liability-and-legal-duties` | K | Pending |
| `pedestrian-crossings-and-priority` | E | Reviewed in Slice E |
| `turns-direction-and-reversing` | I | Reviewed in Slice I part 2 |
| `overtaking-and-passing` | I | Reviewed in Slice I part 2 |

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
- Slice C worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-parking` on `codex/015-study-guide-language-review-parking`, stacked on PR #70 branch `codex/015-study-guide-language-review-intake`.
- Topics reviewed: `parking-clearances-and-corners`, `parking-prohibitions-and-signed-zones`, and `stopping-vs-parking-maneuvers`.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice C did not touch root fields.
  - titles: 3
  - summaries: 3
  - learning paragraphs: 23
  - practical reasoning paragraphs: 9
  - term translations: 44
  - source-conflict notes: 0 in Slice C topics
  - answer explanations: 128
  - trap notes: 15
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 2
  - summaries: 3
  - learning paragraphs: 19
  - practical reasoning paragraphs: 3
  - term translations: 1
  - source-conflict notes: 0
  - answer explanations: 35
  - trap notes: 9
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice C topics 45 / 45.
- Unique question IDs before/after: global 460 / 460; Slice C topics 45 / 45.
- Answer explanations before/after: global 1,831 / 1,831; Slice C topics 128 / 128.
- Source-conflict notes before/after: global 4 / 4; Slice C topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-031`, `b-fallback-043`, `b-fallback-341`, `b-fallback-396`, `b-fallback-460`, `b-fallback-320`, `b-fallback-356`, `b-fallback-416`, `b-fallback-011`, `b-fallback-015`, `b-fallback-039`, `b-fallback-045`, `b-fallback-051`, `b-fallback-077`, `b-fallback-097`, `b-fallback-127`, `b-fallback-156`, `b-fallback-188`, `b-fallback-211`, `b-fallback-232`, `b-fallback-260`, `b-fallback-347`, `b-fallback-378`, `b-fallback-413`, `b-fallback-442`, and `b-fallback-455`.
- Duplicate handling decision: reviewed duplicated placements only inside the three assigned Slice C topics. Matching placements in other topics were not edited or aligned in this PR; they remain intentionally topic-specific for their assigned slices. Changed duplicate explanations in Slice C were limited to learner wording cleanup for `b-fallback-460`, `b-fallback-320`, `b-fallback-356`, `b-fallback-416`, `b-fallback-039`, `b-fallback-051`, `b-fallback-077`, `b-fallback-097`, `b-fallback-413`, and `b-fallback-455`; answer IDs, verdicts, placements, and neighboring topic placements were preserved.
- Source-sensitive sentences left unchanged: all 11 `claims[].textRu` entries in Slice C topics were preserved. Numeric/source-sensitive rules and ticket formulas were preserved, including 10 m hospital/health-center entrance distance, 50 m railway crossing parking boundary, 20 cm cordón parking distance, marcha atrás `mínimo e indispensable`, `tránsito se encuentra interrumpido`, red cordón no stopping/parking, old `acera izquierda` / `ambas aceras` formulas for `b-fallback-010`, `b-fallback-074`, and `b-fallback-079`, detención up to two minutes, `doble fila` exception only before a parking maneuver, and `No estacionar` vs `No estacionar ni detenerse`.
- CABA/RF notes added or clarified: no broad РФ legal comparison was added. Slice C clarified CABA-specific exam anchors that are likely to trip an RF-trained driver answering from habit: CABA institutional entrance timing, 50 m railway crossing boundary, CABA `marcha atrás` as only a short necessary maneuver, CABA two-minute `detención`, `balizas` not being permission, and `doble fila` being allowed only as `detención previa a la maniobra de estacionamiento`.
- Before/after samples:
  - `parking-clearances-and-corners`: before "taxonomy-mixed ... ticket-specific prompts"; after "Два билета в этой теме смешанные ... Они не дают новое правило парковки."
  - `parking-clearances-and-corners`: before "доступ emergency/service vehicles"; after "доступ машин экстренных служб или служебного транспорта."
  - `parking-prohibitions-and-signed-zones`: before "fallback-формулу ... current-rule statement"; after "эти три старые формулы не надо учить как сегодняшнее универсальное правило."
  - `parking-prohibitions-and-signed-zones`: before "parking distractor" / "traffic-calming/channelization cue"; after "ловушка про парковку" / "помогает замедлить и направить движение."
  - `stopping-vs-parking-maneuvers`: before "double fila ... emergency vehicles ... parking-тему"; after "doble fila ... vehículos de emergencia ... знаки, которые легко принять за парковочные."
  - `stopping-vs-parking-maneuvers`: before "authorized work personnel"; after "personal de obra autorizado."
- PR #63 forbidden-path guard: Slice C write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. `content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, related validators/tests/docs, package files, and PR #71 difficulty/schema/UI/validator/docs/test paths were not edited.
- Slice C refresh base/head: rebased the Slice C WIP onto fresh PR #70 intake base `aab522d45865bde3eda3c31e40a88ef6b56b08af`; validation ran on refreshed Slice C head `b28530dcd2aa46afaacca195e7ad862d6f02753c` before this evidence-only amend.
- Slice C refresh merge decision: used `origin/codex/015-study-guide-language-review-intake` as the JSON structure and metadata base, preserved #71/#70 `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` for all three Slice C topics, overlaid only the Slice C learner-facing rewrites, and refreshed only the three stale topic `difficultyMeta.sourceFingerprint` values:
  - `parking-clearances-and-corners`: `445db97198ddeabd80f0c1da983f8f0787fcfb3ef18faeff933452d42a772a63` -> `f338477641e41853830d427ae886468a33e1d77563e4fb538a11e8e16f5a5506`
  - `parking-prohibitions-and-signed-zones`: `7b0a88b6b18865d0a85cdd12ddbd99582737c3ed643990d86216033c6dbdcf26` -> `041540efe392e31ed5ffda5b704ccbd48122e65ea2dd84ba85ab6d68e6199f5d`
  - `stopping-vs-parking-maneuvers`: `7c79052e79fb7223c8f2a8791085c2b5ab8af3246b9499a9783fdf9cde079207` -> `7272ffd967a11462a4dd24983fc18cc6284d61a54ab1b92bbbe41619479f3597`
- Dependency note: this isolated worktree initially had no `node_modules`. `pnpm install` completed with lockfile already up to date; no tracked package or lockfile changes were introduced.
- Validation evidence:
  - JSON parse, difficulty, and Slice C refresh guard: pass; Node parsed `content/guide/topic-study-guide.ru.json`, found 38 topics, 38 `difficulty` entries, and 38 `difficultyMeta` entries. The three Slice C topic IDs retained their #71/#70 difficulty levels and non-fingerprint metadata, their fingerprints matched `difficultyTopicFingerprint(topic)` after the text overlay, and targeted text markers confirmed the intended Slice C rewrites were present.
  - Structural count guard before validation: pass; global totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, and 170 claims; Slice C topics remained 45 placements and 128 answer explanations.
  - Learner-facing process-word scan for Slice C topics: pass; targeted scan found no remaining `fallback`, `ticket-specific`, `canonical`, `taxonomy`, `fixed-distance`, `double fila`, `emergency vehicles`, `parking nearby`, or similar learner-facing process English.
  - Final JSON parse sanity for `content/guide/topic-study-guide.ru.json`: pass, `JSON parse OK; topics=38; difficulty=38; difficultyMeta=38`.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass, no output.
  - Changed-path guard versus PR #63 forbidden paths and PR #71 non-content paths: pass; `git diff --name-only origin/codex/015-study-guide-language-review-intake...HEAD` showed only `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`, with no `content/translations`, `content/explanations`, `content/image-metadata`, `content/validation`, coverage/source-trace manifests, product code, tests, scripts, docs, package/lock files, or PR #71 difficulty UI/validator/docs/test paths.
  - `git status --short --branch`: pass; branch showed `## codex/015-study-guide-language-review-parking...origin/codex/015-study-guide-language-review-intake [ahead 1]`.
  - Package/lockfile guard after dependency setup: pass; `git diff --name-only -- package.json pnpm-lock.yaml pnpm-workspace.yaml` produced no output.
- Known issues: none introduced. The old `acera izquierda` / `ambas aceras` formulas remain explicitly old-ticket/image-recognition context and were not generalized as current CABA law. `b-fallback-342`, `b-fallback-460`, `b-fallback-320`, `b-fallback-356`, and `b-fallback-416` remain mixed/ticket-specific in meaning, with no placement change.
- Implementation Agent feedback: none requiring Architect disposition. Slice C found no reason to edit claims metadata, coverage/source-trace manifests, product code, tests, docs, translations/explanations, generated indexes, package files, or difficulty-labeling files.
- Slice D worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-vehicle` on `codex/015-study-guide-language-review-vehicle`, stacked on `origin/codex/015-study-guide-language-review-parking` / PR #75.
- Topics reviewed: `driver-hand-signals`, `vehicle-lights-and-signaling`, `vehicle-condition-maintenance-loads`, `mirrors-blind-spots-and-visibility`, and `occupant-protection`.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice D did not touch root fields.
  - titles: 5
  - summaries: 5
  - learning paragraphs: 33
  - practical reasoning paragraphs: 14
  - term translations: 101
  - source-conflict notes: 0 in Slice D topics
  - answer explanations: 191
  - trap notes: 27
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 1
  - summaries: 5
  - learning paragraphs: 28
  - practical reasoning paragraphs: 12
  - term translations: 23
  - source-conflict notes: 0
  - answer explanations: 50
  - trap notes: 14
  - `difficultyMeta.sourceFingerprint`: 5
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice D topics 68 / 68.
- Unique question IDs before/after: global 460 / 460; Slice D topics 66 / 66.
- Answer explanations before/after: global 1,831 / 1,831; Slice D topics 191 / 191.
- Source-conflict notes before/after: global 4 / 4; Slice D topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-002`, `b-fallback-015`, `b-fallback-035`, `b-fallback-039`, `b-fallback-097`, `b-fallback-108`, `b-fallback-175`, `b-fallback-183`, `b-fallback-217`, `b-fallback-231`, `b-fallback-232`, `b-fallback-263`, `b-fallback-269`, `b-fallback-276`, `b-fallback-283`, `b-fallback-292`, `b-fallback-293`, `b-fallback-317`, `b-fallback-360`, `b-fallback-375`, `b-fallback-378`, `b-fallback-388`, `b-fallback-390`, `b-fallback-405`, `b-fallback-413`, `b-fallback-428`, and `b-fallback-442`.
- Duplicate handling decision: reviewed duplicated placements only inside the five assigned Slice D topics. Matching placements outside Slice D were deliberately left for their future slices. Where duplicates appear inside Slice D, wording stays intentionally topic-specific: for example, `b-fallback-002` keeps a hand-signal framing in `driver-hand-signals` and a light/balizas framing in `vehicle-lights-and-signaling`; `b-fallback-263` keeps both gesture and emergency-light boundaries; parking duplicates such as `b-fallback-015`, `b-fallback-039`, `b-fallback-097`, `b-fallback-232`, `b-fallback-378`, `b-fallback-413`, and `b-fallback-442` were not generalized beyond light/vehicle-topic wording.
- Source-sensitive sentences left unchanged: all 18 `claims[].textRu` entries in Slice D topics were preserved as non-rendered source-trace metadata. Numeric, image-specific, and procedural anchors were preserved, including SRI age/height `menor de 12 años` / `1,50 m`, `3 puntos`, `mayores de 12 años`, `altura igual o superior a 1,50 m`, `2-5 minutos`, `28 lbs` / `30 lbs` as traps, `Fríos`, `grupos 0, 0+ y 1`, `huesos de la cadera`, `número de emergencia de la Autopista`, `permanecer dentro del vehículo`, `luces bajas`, `rompeniebla`, `balizas portátiles`, `manual del usuario`, and the picture-bound answers for hand signals, mirror setup, oil/lubrication, pregnancy belt placement, lower belt strap, SRI placement, and headrest height.
- CABA/RF notes added or clarified: Slice D added short practical CABA/RF framing where it helps an RF-trained driver avoid assumption errors: hand-signal logic is close to familiar basic driving practice but CABA tickets expect Spanish anchors; lights/balizas use the familiar visibility/warning idea but CABA exam does not treat balizas as permission to stop or drive in poor weather; vehicle condition clarified the familiar RF baseline for control/visibility while warning that a "tow with a rope" habit does not answer CABA `remolque/acarreo`; mirrors clarified that good mirrors still do not remove blind spots; occupant protection kept basics like all occupants belted and child restraint thresholds explicit.
- Before/after samples:
  - `driver-hand-signals`: before "Формы жестов на картинках в этом fallback-наборе..."; after "Рисунки жестов в этих старых билетах учите как ответы к конкретным картинкам."
  - `vehicle-lights-and-signaling`: before "показать emergency" and "ticket-specific: exact glare ... private-vehicle emergency combo"; after "показать emergencia" and "узкими ответами конкретных билетов: ослепление ... комбинация balizas + bocina + pañuelo".
  - `vehicle-condition-maintenance-loads`: before "vehicle-condition" / "loose objects" / "projectile"; after "состояние автомобиля" / "незакрепленные предметы" / "вещи не летят по салону".
  - `mirrors-blind-spots-and-visibility`: before "before moving" / "direct vision"; after "до начала движения" / "прямой обзор".
  - `occupant-protection`: before "correct answer" / "image-specific" / "emergency call"; after "правильный ответ" / "вывод только по этой иллюстрации" / "звонок в помощь".
- PR #63 / #75 guard: Slice D write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. It did not touch PR #63 / feature 009 forbidden paths (`content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, related validators/tests/docs/package files). It also did not touch product UI, tests, scripts, package files, coverage/source-trace manifests, or docs outside this feature memory.
- Difficulty metadata refresh evidence: all five Slice D topics kept their `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` unchanged. Only `difficultyMeta.sourceFingerprint` changed, and each new value matched `difficultyTopicFingerprint(topic)` after the learner-facing text rewrite:
  - `driver-hand-signals`: `97fde5f15d549bf2eabd3c090bba3c97ff89ada1dfc38dc0ac3a3a30e8dcd8c2` -> `3727f1c94bfa396c90d3be0b6b99f5a88ba0714f334664b8d17f7a8462501cb2`
  - `vehicle-lights-and-signaling`: `f058e16e434ad09516e54dd8b39941c4f841178e68200eb219e72c905e582084` -> `ab6d169a24d197b16721ef7fefda552b37cef13ad9214ef70aca09cb4a484568`
  - `vehicle-condition-maintenance-loads`: `dbcbcce6ca8f348e6a366aa179ce9117891f2c95bcb173da6f9b6500e3b62cce` -> `efac5f9a145c7601e58c26037069cf07eec2cb51ac8b42c2fbc319d36eb73142`
  - `mirrors-blind-spots-and-visibility`: `8d18c1d842f29107f894e09831f0d078389cc1d52b683257ab12006bc8476a5d` -> `b858e35ba04591cefe3c27123cd63af0823bd3a8cecdab1e65dc9824829e68f1`
  - `occupant-protection`: `bae3fa6e21ff8dce6d085ad36672b9fb196969c8411fd224852b162cd7f8d182` -> `0c96c0b4a7b3766c37d5ff945948d7083405cf327e0c282276c212083d4efd8e`
- Validation evidence before final diff/path guards:
  - PR #76 Codex Review P2 fingerprint-evidence finding addressed: rechecked all five Slice D `difficultyMeta.sourceFingerprint` base -> HEAD transitions against `origin/codex/015-study-guide-language-review-parking` and corrected the three inaccurate evidence entries.
  - JSON parse and structural count guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 38 `difficulty`, and 38 `difficultyMeta`.
  - Targeted learner-facing process/English scan over Slice D rendered fields: pass; no matches for `fallback`, `ticket-specific`, `canonical`, `source-backed`, `fixed-distance`, `claim`, `prompt`, `taxonomy`, `image-specific`, `ticket image`, `correct answer`, `Emergency`, `emergency`, `loose objects`, `projectile`, `preventive driving`, `work zones`, `temporary risks`, `source slice`, `assigned tickets`, `exact`, `private-vehicle`, `combo`, `glare`, `while driving`, `immobilization`, `direct vision`, `mirrors`, `before moving`, `phone`, `police`, `evidence`, `vehicles`, `oil`, `fuel`, `tire check`, `rear-seat wording`, or `vehicle/maintenance`.
  - Duplicate-term guard for Slice D `spanishTerms[].translationRu`: pass; 0 values duplicate `termEs` verbatim.
  - Difficulty guard: pass; for all five Slice D topics, fingerprint changed, computed fingerprint matched, non-fingerprint metadata was preserved, difficulty was preserved, and claims were preserved.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass, no output.
  - Changed-path guard versus PR #63 forbidden paths and non-scope paths: pass; `git diff --name-only -- content/translations content/explanations content/image-metadata content/validation scripts tests src package.json pnpm-lock.yaml pnpm-workspace.yaml docs_project content/guide/topic-study-guide.coverage.json content/guide/topic-study-guide.source-trace.json content/official-documents` produced no output.
  - `git diff --name-only`: pass; only `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`.
  - `git status --short --branch`: pass; branch showed `## codex/015-study-guide-language-review-vehicle...origin/codex/015-study-guide-language-review-parking` with exactly the two expected modified files before commit.
- Known issues: none introduced. Slice D intentionally kept picture-bound and old-ticket wording narrow, especially for illustrated hand signals, mirror images, oil/lubrication images, pregnancy/SRI/belt/headrest images, `balizas` in old parking/light duplicates, and the old `mascotas` answer. Future slices still need to remove learner-facing process words in their own topics.
- Implementation Agent feedback: none requiring Architect disposition. Slice D found no need to edit claims metadata, source-trace or coverage manifests, product code, tests, scripts, docs, package files, translations/explanations, image metadata, or validation artifacts.
- Slice E worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-pedestrian` on `codex/015-study-guide-language-review-pedestrian`, stacked on `origin/codex/015-study-guide-language-review-vehicle` / PR #76.
- Parent refresh evidence: after PR #76 review fix, preserved local Slice E WIP with `git stash`, fast-forwarded this branch from `72b246e0e49b257ff420554254572657d12119a5` to updated parent `53a89f051b59471601c01b991a3189b5eb7d3873`, then restored Slice E changes. No conflict occurred; corrected Slice D fingerprint evidence from parent `53a89f0` and Slice E JSON/tasks evidence are both present.
- Topics reviewed: `pedestrian-and-school-road-markings`, `pedestrian-school-zones-and-markings`, and `pedestrian-crossings-and-priority`.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice E did not touch root fields.
  - titles: 3
  - summaries: 3
  - learning paragraphs: 22
  - practical reasoning paragraphs: 9
  - term translations: 65
  - source-conflict notes: 0 in Slice E topics
  - answer explanations: 146
  - trap notes: 21
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 0
  - summaries: 3
  - learning paragraphs: 17
  - practical reasoning paragraphs: 4
  - term translations: 3
  - source-conflict notes: 0
  - answer explanations: 110
  - trap notes: 20
  - `difficultyMeta.sourceFingerprint`: 3
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice E topics 51 / 51.
- Unique question IDs before/after: global 460 / 460; Slice E topics 42 / 42.
- Answer explanations before/after: global 1,831 / 1,831; Slice E topics 146 / 146.
- Source-conflict notes before/after: global 4 / 4; Slice E topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-008`, `b-fallback-037`, `b-fallback-052`, `b-fallback-082`, `b-fallback-089`, `b-fallback-106`, `b-fallback-136`, `b-fallback-153`, `b-fallback-159`, `b-fallback-167`, `b-fallback-172`, `b-fallback-174`, `b-fallback-221`, `b-fallback-274`, `b-fallback-294`, `b-fallback-318`, `b-fallback-337`, `b-fallback-362`, `b-fallback-369`, `b-fallback-373`, `b-fallback-381`, `b-fallback-399`, `b-fallback-408`, `b-fallback-458`, and `b-fallback-459`.
- Duplicate handling decision: reviewed duplicated placements only inside the three assigned Slice E topics. Matching placements outside Slice E remain for their future slices, while duplicates inside Slice E were kept intentionally topic-specific when the same question appears in both pedestrian-marking and broader school-zone contexts. Shared examples such as `b-fallback-052`, `b-fallback-082`, `b-fallback-089`, `b-fallback-172`, `b-fallback-221`, `b-fallback-318`, `b-fallback-369`, `b-fallback-408`, and `b-fallback-459` were simplified in both Slice E placements without changing answer IDs, verdicts, images, or placement shape.
- Source-sensitive sentences left unchanged: all 15 `claims[].textRu` entries in Slice E topics were preserved as non-rendered source-trace metadata. Numeric/procedural anchors were preserved, including the CABA no-marked-senda crossing reference at `esquina`, `prolongación longitudinal de la vereda`, `línea imaginaria de prolongación de ochava`, `reducir la velocidad y detener el vehículo antes de la senda peatonal`, Ley 2148 `ingreso/egreso` school-speed formula, the separate posted `20 km/h` school-zone sign in `b-fallback-381`, `30 km/h` on Av. Gral Roca in `b-fallback-252`, yellow cordón allowing `detención` but not `estacionamiento`, wheel/gear formulas in `b-fallback-248` and `b-fallback-402`, the under-12 bicycle combined answer in `b-fallback-458`, semáforo peatonal intermitente behavior, and the Observatorio Vial `Opción B` statistic caveat in `b-fallback-256`.
- CABA/RF notes added or clarified: Slice E kept CABA/RF framing practical rather than legal-comparative. It clarified likely RF-habit traps around unmarked crossings in CABA being tied to the `esquina`, school speed being different when a posted sign applies versus when Ley 2148 `ingreso/egreso` wording applies, `ochava` as a visibility boundary near corners, yellow cordón permitting stopping but not parking, and the familiar basic rule that pedestrian priority is not cancelled by speed, horn, a green light, or a driver feeling able to pass.
- Before/after samples:
  - `pedestrian-and-school-road-markings`: before "marking/sign: senda peatonal ... transitory working sign"; after "что именно показано: senda peatonal ... временный знак дорожных работ."
  - `pedestrian-and-school-road-markings`: before "`b-fallback-172` тоже ticket-specific ... visual trap ... taxonomy"; after "`b-fallback-172` решается по картинке ... похожие варианты про пешеходный переход здесь остаются ловушкой."
  - `pedestrian-school-zones-and-markings`: before "green bicycle crossings, school-speed traps ... ticket-specific картинках"; after "зеленые велопересечения, скорости у школ ... по конкретным картинкам."
  - `pedestrian-school-zones-and-markings`: before "The line/marking tells you where to stop"; after "Линия и разметка показывают, где остановиться."
  - `pedestrian-crossings-and-priority`: before "ticket-specific ответ на статистический вопрос Observatorio Vial"; after "ответ на конкретный статистический вопрос Observatorio Vial."
  - `pedestrian-crossings-and-priority`: before "Отвечайте по image and exact fallback wording"; after "Отвечайте по картинке и точной формулировке старого билета."
- PR #63 / #76 guard: Slice E write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. It did not touch PR #63 / feature 009 forbidden paths (`content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, coverage/source-trace manifests, related validators/tests/docs/package files). It also did not touch product UI, tests, scripts, package files, docs outside this feature memory, or other worktrees/branches/PRs.
- Difficulty metadata refresh evidence: all three Slice E topics kept their `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` unchanged. Only `difficultyMeta.sourceFingerprint` changed, and each new value matched `difficultyTopicFingerprint(topic)` after the learner-facing text rewrite:
  - `pedestrian-and-school-road-markings`: `55c22c176bc19f932254db1f1438fc134e1802431c45116c446ebf14b7189d7c` -> `872b567ebbc4617e530008c506c9558dc107ff09a7a0593b8ae883f115f054fa`
  - `pedestrian-school-zones-and-markings`: `d3240d5d018811c293ecd5a8a45155c38155109d5a72a41ccbec14622310671d` -> `e05e900532dfd1b83359694b1ad77e6cc1e05509e045de82b368e42e2451684d`
  - `pedestrian-crossings-and-priority`: `203eb4a0949e4b86e25427fb149040de1bd39caf32275b3b7ecf836c13ef81a1` -> `85b57ed59dd3265cf3af8eea9f3694c3a302582300d6efd4c3242a67ed8a4c7d`
- PR #78 local review feedback addressed: replaced the learner-facing English starts `Near esquina` and `Yellow cordon` in `pedestrian-school-zones-and-markings` trap notes with Russian starts, preserved trap IDs/source question IDs, and refreshed only that topic's `difficultyMeta.sourceFingerprint` from `e05e900532dfd1b83359694b1ad77e6cc1e05509e045de82b368e42e2451684d` to `812efcd6e383f17f43f4f51dbaab8527de6d7e6a75cd0c759bba35d0480b6340`.
- Validation evidence before final commit:
  - JSON parse and structural count guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 38 `difficulty`, and 38 `difficultyMeta`.
  - Targeted learner-facing process/English scan over current Slice E rendered fields: pass; no matches for `fallback` as prose, `ticket-specific`, `canonical`, `source-backed`, `claim`, `prompt`, `taxonomy`, `school-zone`, `school-zone image`, `road marking`, `image-specific`, `correct answer`, or the broader English/process terms used in the local scan. The scan inspected current rendered fields only, not removed diff lines or non-rendered claims metadata.
  - Duplicate-term guard for Slice E `spanishTerms[].translationRu`: pass; 0 values duplicate `termEs` verbatim.
  - Difficulty guard: pass; for all three Slice E topics, fingerprint changed, computed fingerprint matched, non-fingerprint metadata was preserved, difficulty was preserved, and claims were preserved.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass, no output.
  - Changed-path guard versus PR #63 forbidden paths and non-scope paths: pass; `git diff --name-only -- content/translations content/explanations content/image-metadata content/validation scripts tests src package.json pnpm-lock.yaml pnpm-workspace.yaml docs_project content/guide/topic-study-guide.coverage.json content/guide/topic-study-guide.source-trace.json content/official-documents` produced no output.
  - `git diff --name-only`: pass; only `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`.
  - `git status --short --branch`: pass; branch showed `## codex/015-study-guide-language-review-pedestrian...origin/codex/015-study-guide-language-review-vehicle` with exactly the two expected modified files before commit.
- Known issues: none introduced. Slice E intentionally kept picture-bound and old-ticket wording narrow for green bicycle markings, `Personas trabajando`, `Calle Prioridad Peatón`, slope-parking images, the posted `20 km/h` school-zone sign, yellow cordón, under-12 bicycle rules, pedestrian-signal behavior, and Observatorio Vial image-statistic wording.
- Implementation Agent feedback: none requiring Architect disposition. Slice E found no need to edit claims metadata, source-trace or coverage manifests, product code, tests, scripts, docs, package files, translations/explanations, image metadata, validation artifacts, or PR #63 paths.
- Slice F worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-risk` on `codex/015-study-guide-language-review-risk`, stacked on `origin/codex/015-study-guide-language-review-pedestrian` / PR #78.
- Topics reviewed: `speed-limits`, `safe-distance-and-braking`, `alcohol-drugs-and-impairment`, `adverse-weather-and-visibility`, and `safety-principles-and-risk`. User assignment also named `weather-and-low-visibility`; the existing guide topic ID is `adverse-weather-and-visibility`, so the slice preserved the existing topic ID/slug.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice F did not touch root fields.
  - titles: 5
  - summaries: 5
  - learning paragraphs: 39 current rendered paragraphs across Slice F topics
  - practical reasoning paragraphs: 14
  - term translations: 103
  - source-conflict notes: 0 in Slice F topics
  - answer explanations: 283
  - trap notes: 34
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 2
  - summaries: 5
  - learning paragraphs: 39
  - practical reasoning paragraphs: 13
  - term translations: 2
  - source-conflict notes: 0
  - answer explanations: 51
  - trap notes: 17
  - `difficultyMeta.sourceFingerprint`: 5
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice F topics 101 / 101.
- Unique question IDs before/after: global 460 / 460; Slice F topics 87 / 87.
- Answer explanations before/after: global 1,831 / 1,831; Slice F topics 283 / 283.
- Source-conflict notes before/after: global 4 / 4; Slice F topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-026`, `b-fallback-029`, `b-fallback-032`, `b-fallback-035`, `b-fallback-044`, `b-fallback-049`, `b-fallback-117`, `b-fallback-144`, `b-fallback-176`, `b-fallback-203`, `b-fallback-236`, `b-fallback-250`, `b-fallback-254`, `b-fallback-267`, `b-fallback-269`, `b-fallback-270`, `b-fallback-283`, `b-fallback-289`, `b-fallback-292`, `b-fallback-296`, `b-fallback-314`, `b-fallback-315`, `b-fallback-317`, `b-fallback-330`, `b-fallback-343`, `b-fallback-360`, `b-fallback-375`, `b-fallback-377`, `b-fallback-390`, `b-fallback-398`, `b-fallback-420`, `b-fallback-428`, `b-fallback-439`, `b-fallback-446`, and `b-fallback-449`.
- Duplicate handling decision: reviewed duplicated placements only inside the five assigned Slice F topics. Matching placements outside Slice F remain for their future slices. Internal Slice F overlaps were kept intentionally topic-specific: for example, `b-fallback-035` keeps preventive-driving/weather framing in `adverse-weather-and-visibility`, `b-fallback-330` keeps distance/rain wording in both distance and weather contexts, and `b-fallback-203` / `b-fallback-446` keep CABA alcohol-threshold wording without generalizing it as current national law. Answer IDs, verdicts, images, placements, and topic assignment shape were preserved.
- Source-sensitive sentences left unchanged: all 21 `claims[].textRu` entries in Slice F topics were preserved as non-rendered source-trace metadata. Numeric, medical, statistical, and ticket-specific boundaries were preserved, including 40/60/20 km/h CABA speed grid, 110/120/60 km/h route/semiautopista/zona urbana formulas, 20 km/h paso a nivel precautionary speed, minimum-speed half-maximum rule, 2-second CABA distance rule, old-ticket `4 segundos`, `aproximadamente 1 segundo`, CABA alcohol thresholds 0,5 / 0,2 / 0,0, `2 años` principiante, refusal/removal consequences, old-ticket medical formulas such as `sube durante 1 hora`, `17 horas despierto`, resaca and vision effects, aquaplaning/wet-brake wording, manual/cold tyre-pressure answers, roof-load fuel-consumption image answer, `1,6 mm` tire-depth answer kept to the specific old ticket, and OMS/statistical wording kept as old-ticket wording.
- CABA/RF notes added or clarified: Slice F added practical CABA/RF framing without creating new comparative-law claims. It clarified that CABA speed numbers should be learned separately from RF habits, that distance/time-gap logic is familiar but CABA tests the two-second formula, that weather adaptation matches the familiar RF safety instinct while using CABA `velocidad precautoria` anchors, and that alcohol/drug text must stay CABA/fallback-ticket specific because current national zero-alcohol wording is stricter than the old ordinary-car 0,5 ticket premise.
- Before/after samples:
  - `speed-limits`: before "Лимиты скорости по типам дорог и зонам"; after "Скорость: город, трасса и особые зоны."
  - `speed-limits`: before "текущая таксономия связывает их"; after "они здесь из-за текущего размещения билетов."
  - `safe-distance-and-braking`: before "ticket-specific formula"; after "формула конкретного старого билета."
  - `safe-distance-and-braking`: before "сухой-road gap"; after "привычный сухой запас."
  - `alcohol-drugs-and-impairment`: before "ticket-specific эффекты"; after "узкие билетные эффекты."
  - `alcohol-drugs-and-impairment`: before "ordinary car ... passenger/cargo context"; after "обычный автомобиль ... профессиональный, пассажирский либо грузовой контекст."
  - `adverse-weather-and-visibility`: before "weather-вопросах" and "fog/low visibility"; after "вопросах про погоду" and "fog / плохой видимости."
  - `adverse-weather-and-visibility`: before "roof load ... eco-driving"; after "багаж на крыше ... курс экономичного вождения."
  - `safety-principles-and-risk`: before "official source" and "global health problem"; after "официального источника" and "проблема общественного здоровья."
- PR #63 / #78 guard: Slice F write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. It did not touch PR #63 / feature 009 forbidden paths (`content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, coverage/source-trace manifests, related validators/tests/docs/package files). It also did not touch product UI, tests, scripts, package files, docs outside this feature memory, other worktrees/branches/PRs, or PR #78 files beyond this branch's stacked guide/tasks changes.
- Difficulty metadata refresh evidence: all five Slice F topics kept their `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` unchanged. Only `difficultyMeta.sourceFingerprint` changed, and each new value matched `difficultyTopicFingerprint(topic)` after the learner-facing text rewrite:
  - `speed-limits`: `919b09130ef7996c36b3343f34d84fcf633caa0cfb4659ad4b84c3e321fec93f` -> `672cae49af40fba59b5202fc602d4857a8b55d13bacde7bee8f037654674f83c`
  - `safe-distance-and-braking`: `57caf3aa097c33e5649843532ce1c6a2304a50254a89e5570bfca9d7e1684aa0` -> `c04d37d1b9280caa4f8be26ca1a49a1db168eb375c519e2a5f7a571b1c710a42`
  - `alcohol-drugs-and-impairment`: `b3642bf7a06e7a68fcc284a52db2fd18997fc44b9e638fd5234f58f83a208c82` -> `70cc98fda873b8791c824b44e5906c052940a0e3e5260310f990ad7e81b97118`
  - `adverse-weather-and-visibility`: `94e68f7c4100ad5a2ff73b622e85b398cb272c64cdfb4c4f22d0db50034a9358` -> `a089fe49c1d6fbc4f484bac496efc387bb763b471ea5b12727d4f582ffcae5ca`
  - `safety-principles-and-risk`: `5c8f814dd6c66e71b2e0857b452d9463a4c1dec28dcadffb4c362aeeecc6cdc9` -> `51d6085caaf8bdd1765a2431ea8d1c0bbcc01686506c6bd1417263ca68a0bb83`
- PR #79 local review P3 addressed: replaced remaining learner-facing English fragments in changed Slice F strings. `alcohol-drugs-and-impairment` changed `legal substances` to Russian wording and refreshed `difficultyMeta.sourceFingerprint` from `db5102f0109fb6c77451fcc73dba97989822b4693602e7dcb80f0d0f7c5e667f` to `70cc98fda873b8791c824b44e5906c052940a0e3e5260310f990ad7e81b97118`. `adverse-weather-and-visibility` changed `emergency or unusual maneuver`, rendered `lights` fragments, `emergency or unusual situations`, and `pavement/climate` to Russian wording and refreshed `difficultyMeta.sourceFingerprint` from `4f3ed76a8c57bbaff85970ae859e118554376780abcc7e45650ccac1fe8d195d` to `a089fe49c1d6fbc4f484bac496efc387bb763b471ea5b12727d4f582ffcae5ca`.
- Validation evidence before final commit:
  - JSON parse and structural count guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 38 `difficulty`, and 38 `difficultyMeta`.
  - PR #79 targeted English-fragment scan over Slice F rendered fields: pass; 0 matches for `legal substances`, `emergency or unusual maneuver`, `lights`, `emergency or unusual situations`, or `pavement/climate`.
  - Targeted learner-facing process/English scan over Slice F rendered fields: pass; no matches for `fallback` as prose, `ticket-specific`, `canonical`, `source-backed`, `claim`, `prompt`, `taxonomy`, `weather question`, `weather condition`, `fuel-consumption`, `image-specific`, `official source`, `preventive-driving`, `road gap`, `chain of risk`, `safe adaptation`, `vehicle-specific`, `pressure check`, `roof load`, `strong side wind`, `strong lateral wind`, `low visibility`, `ordinary car`, `professional`, `passenger`, `cargo context`, `global health problem`, `official-source`, `at high speeds`, `hands-free`, `voice use`, `active/passive safety`, `Portable colorimetric test`, `colorimetric test`, `eco-driving`, `wording`, `wet road`, or `road users`.
  - Duplicate-term guard for Slice F `spanishTerms[].translationRu`: pass; 0 values duplicate `termEs` verbatim.
  - Difficulty guard: pass; for all five Slice F topics, fingerprint changed, computed fingerprint matched, non-fingerprint metadata was preserved, difficulty was preserved, and claims were preserved.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass, no output.
  - Changed-path guard versus PR #63 forbidden paths and non-scope paths: pass; forbidden/non-scope path diff produced no output, and `git diff --name-only` listed only `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`.
  - `git status --short --branch`: pass; branch showed `## codex/015-study-guide-language-review-risk...origin/codex/015-study-guide-language-review-pedestrian` with exactly the two expected modified files before commit.
- Known issues: none introduced. Slice F intentionally kept old-ticket and source-sensitive wording narrow for route-sign placements `b-fallback-296` / `b-fallback-343`, old CABA alcohol threshold tickets, refusal/removal consequences, medical-style impairment formulas, aquaplaning/fog/balizas behavior, tyre pressure, roof-load fuel-consumption, `1,6 mm` tyre-depth wording, and OMS/statistical wording.
- Implementation Agent feedback: none requiring Architect disposition. Slice F found no need to edit claims metadata, source-trace or coverage manifests, product code, tests, scripts, docs, package files, translations/explanations, image metadata, validation artifacts, or PR #63 paths.
- Slice G worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-warning` on `codex/015-study-guide-language-review-warning`, stacked on `origin/codex/015-study-guide-language-review-risk` / PR #79.
- Topics reviewed: `warning-signs` and `right-of-way-signals-and-rail-crossings`.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice G did not touch root fields.
  - titles: 2
  - summaries: 2
  - learning paragraphs: 13
  - practical reasoning paragraphs: 5
  - term translations: 35
  - source-conflict notes: 0 in Slice G topics
  - answer explanations: 118
  - trap notes: 12
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 2
  - summaries: 2
  - learning paragraphs: 12
  - practical reasoning paragraphs: 5
  - term translations: 21
  - source-conflict notes: 0
  - answer explanations: 101
  - trap notes: 10
  - `difficultyMeta.sourceFingerprint`: 2
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice G topics 41 / 41.
- Unique question IDs before/after: global 460 / 460; Slice G topics 41 / 41.
- Answer explanations before/after: global 1,831 / 1,831; Slice G topics 118 / 118.
- Source-conflict notes before/after: global 4 / 4; Slice G topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-009`, `b-fallback-063`, `b-fallback-068`, `b-fallback-070`, `b-fallback-076`, `b-fallback-077`, `b-fallback-085`, `b-fallback-119`, `b-fallback-124`, `b-fallback-128`, `b-fallback-129`, `b-fallback-131`, `b-fallback-153`, `b-fallback-159`, `b-fallback-180`, `b-fallback-238`, `b-fallback-262`, `b-fallback-273`, `b-fallback-288`, `b-fallback-311`, `b-fallback-312`, `b-fallback-340`, `b-fallback-345`, `b-fallback-347`, `b-fallback-357`, `b-fallback-370`, `b-fallback-372`, `b-fallback-389`, `b-fallback-394`, `b-fallback-410`, `b-fallback-436`, `b-fallback-440`, and `b-fallback-444`.
- Duplicate handling decision: reviewed duplicated placements only inside the two assigned Slice G topics. Matching placements outside Slice G remain for their future slices, especially traffic-light/rail topics and broader right-of-way/turning topics. Wording stayed intentionally topic-specific: warning-sign duplicates keep picture/sign-recognition framing in `warning-signs`, while `right-of-way-signals-and-rail-crossings` keeps priority, signal hierarchy, railway, and cautious-speed framing. Answer IDs, verdicts, images, placements, and topic assignment shape were preserved.
- Source-sensitive sentences left unchanged: all 9 `claims[].textRu` entries in Slice G topics were preserved as non-rendered source-trace metadata. Source-sensitive boundaries were kept narrow for picture-bound sign answers, `máximo peligro`, `zona escolar`, `Cruce de Peatones`, `obstrucción de vía`, `prioridad de avance`, `personal de obra`, autoridad/señalización/general-norm hierarchy, the `tránsito detenido` incorporation case, `señalización transitoria` over semáforos, red/yellow `señalización intermitente`, `paso a nivel ferroviario` exceptions, 20/30/40 km/h speed traps, and the `puente levadizo` versus railway-crossing image distinction. No PARE, railway, priority, warning, school/person/animal meaning was broadened beyond existing content.
- CABA/RF notes added or clarified: Slice G kept comparison practical. It reminded the familiar РФ-style basics that warning signs buy reaction time and do not themselves give priority, while clarifying CABA exam anchors that can trip a Russian driver: signal/source hierarchy before ordinary rules, avenida/calle/pasaje before the right-side rule, railway-crossing exceptions, red versus yellow flashing signals, and CABA's exact 30/40 km/h unsignalized-intersection pair versus 20 km/h at paso a nivel.
- Before/after samples:
  - `warning-signs`: before "obey personal de obra"; after "выполнить указание personal de obra".
  - `warning-signs`: before "форма/цвет знаков"; after "форму и цвет знаков".
  - `warning-signs`: before "camino sin salida => дорога без выхода, тупик"; after "дорога без сквозного проезда, тупик".
  - `warning-signs`: before "warning does not give priority" style wording in the trap context; after "Предупреждающий знак сам по себе не дает приоритет."
  - `right-of-way-signals-and-rail-crossings`: before "Puente de menor ancho - другой warning sign"; after "puente de menor ancho - другой предупреждающий знак".
  - `right-of-way-signals-and-rail-crossings`: before "Практический блок про prioridad de paso, semáforos..."; after "Практический блок про prioridad de paso: светофоры, мигающие сигналы..."
  - `right-of-way-signals-and-rail-crossings`: before "не “у кого приоритет”, а требуемое действие"; after "проверяет действие, а не “у кого приоритет”."
  - `right-of-way-signals-and-rail-crossings`: before "right-of-way" remained only in machine IDs; rendered learner text now uses Russian priority wording with Spanish exam anchors.
- PR #63 / #79 guard: Slice G write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. It did not touch PR #63 / feature 009 forbidden paths (`content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, coverage/source-trace manifests, related validators/tests/docs/package files). It also did not touch product UI, tests, scripts, package files, docs outside this feature memory, other worktrees/branches/PRs, or PR #79 files beyond this branch's stacked guide/tasks changes.
- Difficulty metadata refresh evidence: both Slice G topics kept their `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` unchanged. Only `difficultyMeta.sourceFingerprint` changed, and each new value matched `difficultyTopicFingerprint(topic)` after the learner-facing text rewrite:
  - `warning-signs`: `11111aad055e8d0a2b66aae9114997509d04ae38279e6e23a9f43b2496a4f39c` -> `b92f584dc5a0db31426306d045a3e25e4341d486c8fb691faf77a1836c263b3e`
  - `right-of-way-signals-and-rail-crossings`: `d15d75472f88d93948dd13b308b36977a0278fb17c412e98a711d0a8dc9416a2` -> `8ef8891d74ccc2c92573a59446af91f41b16127c24858fbb7871ff28fef8c71d`
- Validation evidence before final commit:
  - JSON parse and structural count guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 38 `difficulty`, and 38 `difficultyMeta`.
  - Targeted learner-facing process/English scan over Slice G rendered fields: pass; no matches for `fallback` as prose, `ticket-specific`, `canonical`, `source-backed`, `claim`, `prompt`, `taxonomy`, `warning sign`, `right-of-way`, `source trace`, `image-specific`, `correct answer`, `old ticket`, `process`, `authority`, `obey`, `picture-bound`, or related learner-facing process English.
  - Duplicate-term guard for Slice G `spanishTerms[].translationRu`: pass; 0 values duplicate `termEs` verbatim.
  - Difficulty guard: pass; for both Slice G topics, fingerprint changed, computed fingerprint matched, non-fingerprint metadata was preserved, difficulty was preserved, and claims were preserved.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass, no output.
  - Changed-path guard versus PR #63 forbidden paths and non-scope paths: pass; forbidden/non-scope path diff produced no output, and `git diff --name-only` listed only `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`.
  - `git status --short --branch`: pass; branch showed `## codex/015-study-guide-language-review-warning...origin/codex/015-study-guide-language-review-risk` with exactly the two expected modified files before commit.
- Known issues: none introduced. Slice G intentionally kept picture-bound sign wording narrow for similar warning symbols, `figura A/B/C` choices, `zona escolar`, `Cruce de Peatones`, `puente levadizo`, `paso a nivel`, red/yellow flashing signals, and priority-hierarchy tickets. Duplicate placements outside Slice G remain for their assigned future slices.
- Implementation Agent feedback: none requiring Architect disposition. Slice G found no need to edit claims metadata, source-trace or coverage manifests, product code, tests, scripts, docs, package files, translations/explanations, image metadata, validation artifacts, or PR #63 paths.
- Slice H worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-road` on `codex/015-study-guide-language-review-road`, stacked on `origin/codex/015-study-guide-language-review-warning` / PR #81.
- Topics reviewed: `road-types-highways-and-routes`, `regulatory-signs`, `traffic-lights-and-rail-crossings`, and `public-transport-and-exclusive-lanes`.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice H did not touch root fields.
  - titles: 4
  - summaries: 4
  - learning paragraphs: 25
  - practical reasoning paragraphs: 10
  - term translations: 79
  - source-conflict notes: 0 in Slice H topics
  - answer explanations: 242
  - trap notes: 23
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 4
  - summaries: 4
  - learning paragraphs: 25
  - practical reasoning paragraphs: 9
  - term translations: 3
  - source-conflict notes: 0
  - answer explanations: 20
  - trap notes: 11
  - `difficultyMeta.sourceFingerprint`: 4
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice H topics 83 / 83.
- Unique question IDs before/after: global 460 / 460; Slice H topics 83 / 83.
- Answer explanations before/after: global 1,831 / 1,831; Slice H topics 242 / 242.
- Source-conflict notes before/after: global 4 / 4; Slice H topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-026`, `b-fallback-032`, `b-fallback-049`, `b-fallback-144`, `b-fallback-236`, `b-fallback-250`, `b-fallback-254`, `b-fallback-267`, `b-fallback-289`, `b-fallback-296`, `b-fallback-314`, `b-fallback-315`, `b-fallback-343`, `b-fallback-377`, `b-fallback-398`, `b-fallback-420`, `b-fallback-439`, `b-fallback-449`, `b-fallback-011`, `b-fallback-029`, `b-fallback-106`, `b-fallback-115`, `b-fallback-127`, `b-fallback-156`, `b-fallback-177`, `b-fallback-207`, `b-fallback-211`, `b-fallback-260`, `b-fallback-265`, `b-fallback-331`, `b-fallback-381`, `b-fallback-384`, `b-fallback-399`, `b-fallback-411`, `b-fallback-416`, `b-fallback-009`, `b-fallback-050`, `b-fallback-063`, `b-fallback-076`, `b-fallback-085`, `b-fallback-093`, `b-fallback-119`, `b-fallback-131`, `b-fallback-139`, `b-fallback-191`, `b-fallback-238`, `b-fallback-340`, `b-fallback-357`, `b-fallback-370`, `b-fallback-372`, `b-fallback-394`, `b-fallback-403`, `b-fallback-298`, and `b-fallback-438`.
- Duplicate handling decision: reviewed duplicated placements only inside the four assigned Slice H topics. Matching placements outside Slice H remain for their later slices. Wording stayed intentionally topic-specific: road-type duplicates keep speed/road-context framing; regulatory-sign duplicates keep sign-classification or normative-prohibition framing; traffic-light/rail duplicates keep signal hierarchy, railway, left-turn, and cautious-speed framing; public-transport duplicates keep Metrobus/colectivo lane framing. Answer IDs, verdicts, images, placements, and topic assignment shape were preserved.
- Source-sensitive sentences left unchanged: all 17 `claims[].textRu` entries in Slice H topics were preserved as non-rendered source-trace metadata. Numeric, procedural, picture-bound, and old-ticket boundaries were preserved for road speeds 20/30/40/60/70/80/100/110/120 km/h, minimum-speed half-maximum logic, `banquina` not being a lane, `carril de desaceleración`, Ruta Nacional/Provincial picture answers, `PARE`, `velocidad mínima` 35 km/h, normative no-overtake/no-stop places, school-zone 20 km/h sign wording, `contramano`, red/yellow flashing signals, 5 m from rails, `personal ferroviario`, semáforo/temporary-signal hierarchy, 30/40 km/h unsignalized-intersection limits, left-turn conditions, `b-fallback-107` emergency-service wording, `b-fallback-230` school detención wording, and `b-fallback-438` Metrobus-lane wording.
- CABA/RF notes added or clarified: Slice H kept comparison practical. It clarified that CABA road labels and exact arterial limits should not be answered from РФ habit; that `calle`/`avenida` and named CABA fast roads can change the speed answer; that reglamentaria is an exam category for mandatory signs, not just "a sign"; that CABA signal hierarchy and no-left-turn-without-arrow behavior can override familiar green-light intuition; and that Metrobus/carril exclusivo is not a short private-car passing lane.
- Before/after samples:
  - `road-types-highways-and-routes`: before "по дорожному контексту сначала назовите место"; after "сначала поймите, где вы едете".
  - `road-types-highways-and-routes`: before "ticket-specific recognition"; after "распознавание конкретной картинки".
  - `regulatory-signs`: before "слово reglamentaria означает не просто «дорожный знак»"; after "reglamentaria в билете - это не любой знак, а знак с обязательным правилом".
  - `regulatory-signs`: before "В билете b-fallback-029"; after "В вопросе про 35 km/h".
  - `traffic-lights-and-rail-crossings`: before "сначала спрашивайте: движение регулирует..."; after "сначала поймите, кто управляет ситуацией".
  - `traffic-lights-and-rail-crossings`: before "emergency service"; after "служба экстренной помощи".
  - `public-transport-and-exclusive-lanes`: before "fallback-ответ" and "authorized/exclusive lane"; after "правильный ответ" and "выделенная полоса для разрешенного транспорта".
  - `public-transport-and-exclusive-lanes`: before "generic public transport answer"; after "обычный ответ про пассажиров транспорта".
- PR #63 / #81 guard: Slice H write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. It did not touch PR #63 / feature 009 forbidden paths (`content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`, coverage/source-trace manifests, related validators/tests/docs/package files). It also did not touch product UI, tests, scripts, package files, docs outside this feature memory, other worktrees/branches/PRs, or PR #81 files beyond this branch's stacked guide/tasks changes.
- Difficulty metadata refresh evidence: all four Slice H topics kept their `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` unchanged. Only `difficultyMeta.sourceFingerprint` changed, and each new value matched `difficultyTopicFingerprint(topic)` after the learner-facing text rewrite:
  - `road-types-highways-and-routes`: `a374d956773052943f39c2e82d4f6b902c398e3cf7ad01aa6d0ca1d06bed5ccf` -> `fce671fd20cc8bdaba8fc8f54bd052ff301db82cb2c7f71faa8ec1b45375aa6b`
  - `regulatory-signs`: `a846d05f2993b4706dd41f12029690d27b949c4823d5933a084f59c44bd7e8c2` -> `e278ad346dc5ffd893eada0fe656af439b2b42581f66f3dc23e6373ab3ec0c86`
  - `traffic-lights-and-rail-crossings`: `dbffbffa9f6241baad9998787967ea1d03f522b92c7c5d3f5b21efa258392e8d` -> `2f5268e3c252bc01d5fc0f5a4fc5966a66213b573692c84a72c28c3336742c81`
  - `public-transport-and-exclusive-lanes`: `692a31bf6129951e4fe503e93860ce5c0ccb30108abb282f39b0be3145f26561` -> `a660b25d087b8c0339510bfed07bc0047887c7f836ba9e5e99f3febb916bb4b4`
- Validation evidence before final commit:
  - JSON parse and structural count guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 38 `difficulty`, and 38 `difficultyMeta`.
  - Targeted learner-facing process/English scan over Slice H rendered fields: pass; no matches for `fallback`, `ticket-specific`, `canonical`, `source-backed`, `claim`, `prompt`, `taxonomy`, `regulatory sign`, `traffic light`, `public transport`, `road marking`, `image-specific`, `correct answer`, `emergency service`, `generic`, `passenger transport`, `exclusive lane`, `Metrobus lane`, `authorized`, `wording`, `old ticket`, `process`, `parking`, or related learner-facing process English.
  - Duplicate-term guard for Slice H `spanishTerms[].translationRu`: pass; 0 values duplicate `termEs` verbatim.
  - Difficulty guard: pass; for all four Slice H topics, fingerprint changed, computed fingerprint matched, non-fingerprint metadata was preserved, difficulty was preserved, and claims were preserved.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass, no output after this process-memory update.
  - Changed-path guard versus PR #63 forbidden paths and non-scope paths: pass; `git diff --name-only` listed only `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`, and the forbidden-path scan produced no output.
  - `git status --short --branch`: pass; branch showed `## codex/015-study-guide-language-review-road...origin/codex/015-study-guide-language-review-warning` with exactly the two expected modified files before commit.
- Known issues: none introduced. Slice H intentionally kept picture-bound and old-ticket wording narrow for Ruta Nacional/Provincial signs, special CABA road segments, `banquina`, minimum/maximum-speed signs, reglamentaria/preventiva/informativa/transitoria classification traps, normative prohibitions without an extra sign, railway-crossing signals and exceptions, no-left-turn-without-arrow tickets, Metrobus/carril exclusivo tickets, and school detención markings.
- Implementation Agent feedback: none requiring Architect disposition. Slice H found no need to edit claims metadata, source-trace or coverage manifests, product code, tests, scripts, docs, package files, translations/explanations, image metadata, validation artifacts, or PR #63 paths.
- Slice H PR #82 review follow-up worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-road` on `codex/015-study-guide-language-review-road`.
- Slice H PR #82 review follow-up scope: fixed two read-only review findings only. In `regulatory-signs`, `b-fallback-416-a2` now explains `contramano` with Russian "въезд запрещен" wording instead of learner-facing English `no entry`. In `public-transport-and-exclusive-lanes`, `b-fallback-298-a2` now says "отдельного проезда для экстренных машин" instead of ambiguous "переезда для экстренных машин".
- Slice H PR #82 review follow-up field counts changed:
  - answer explanations: 2 (`regulatory-signs` `b-fallback-416-a2`; `public-transport-and-exclusive-lanes` `b-fallback-298-a2`)
  - `difficultyMeta.sourceFingerprint`: 2 (`regulatory-signs`; `public-transport-and-exclusive-lanes`)
  - all IDs, verdicts, placements, answer IDs, claims/source traces, slugs/status, `difficulty`, and non-fingerprint `difficultyMeta` were preserved.
- Slice H PR #82 review follow-up fingerprint evidence:
  - `regulatory-signs`: `e278ad346dc5ffd893eada0fe656af439b2b42581f66f3dc23e6373ab3ec0c86` -> `03ad5cb81b3ffd250f2b1a928c9e38dba8f9e86214e717e68e5fec18bf7e5bc0`, matching `difficultyTopicFingerprint(topic)`.
  - `public-transport-and-exclusive-lanes`: `a660b25d087b8c0339510bfed07bc0047887c7f836ba9e5e99f3febb916bb4b4` -> `b099d3658b50fc131acac0c81005a5f8bb615c672eb46d40489ffb213f25d03d`, matching `difficultyTopicFingerprint(topic)`.
- Slice H PR #82 review follow-up validation evidence:
  - JSON parse and structural count guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, and 4 source-conflict notes.
  - Targeted Slice H rendered-field English/process scan: pass; scanned 387 rendered fields with 0 matches, including 0 matches for `no entry`.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass after this process-memory update.
  - Changed-path guard after this process-memory update: pass; changed paths were limited to `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`, with no PR #63 forbidden paths, validators/tests/docs/package/product files, or other worktrees touched.
- Slice H PR #82 review follow-up known issues: none introduced.
- Slice H PR #82 review follow-up Implementation Agent feedback: none requiring Architect disposition.
- Slice H PR #82 P3 style follow-up addressed: in `public-transport-and-exclusive-lanes`, `b-fallback-298-a2` now says `автобуса/colectivo` instead of `bus/colectivo`; only that rendered wording and the topic `difficultyMeta.sourceFingerprint` changed, from `b099d3658b50fc131acac0c81005a5f8bb615c672eb46d40489ffb213f25d03d` to `799cf02750cd05627ba48dd96cdab3ee48011da061be89c74aa2a7e83e50a451`.
- Slice I part 1 worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-rightofway` on `codex/015-study-guide-language-review-rightofway`, stacked on latest `origin/codex/015-study-guide-language-review-road` / PR #82 follow-up head `baa0f2edc74a405d260e64010d0cf916d691c212`.
- Slice I split decision: Orchestrator split the original large Slice I into two sequential PRs. This PR implements only part 1 (`right-of-way-basic-intersections`, `right-of-way-special-situations`, `center-lines-and-crossing-rules`, `lane-and-channelization-markings`). Part 2 remains pending for `lane-choice-and-lane-changes`, `turns-direction-and-reversing`, and `overtaking-and-passing`.
- Topics reviewed: `right-of-way-basic-intersections`, `right-of-way-special-situations`, `center-lines-and-crossing-rules`, and `lane-and-channelization-markings`.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice I part 1 did not touch root fields.
  - titles: 4
  - summaries: 4
  - learning paragraphs: 30
  - practical reasoning paragraphs: 14
  - term translations: 76
  - source-conflict notes: 0 in Slice I part 1 topics
  - answer explanations: 205
  - trap notes: 23
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 3
  - summaries: 4
  - learning paragraphs: 30
  - practical reasoning paragraphs: 14
  - term translations: 12
  - source-conflict notes: 0
  - answer explanations: 75
  - trap notes: 17
  - `difficultyMeta.sourceFingerprint`: 4
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice I part 1 topics 71 / 71.
- Unique question IDs before/after: global 460 / 460; Slice I part 1 topics 71 / 71.
- Answer explanations before/after: global 1,831 / 1,831; Slice I part 1 topics 205 / 205.
- Source-conflict notes before/after: global 4 / 4; Slice I part 1 topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-043`, `b-fallback-045`, `b-fallback-066`, `b-fallback-068`, `b-fallback-118`, `b-fallback-148`, `b-fallback-150`, `b-fallback-164`, `b-fallback-165`, `b-fallback-171`, `b-fallback-180`, `b-fallback-244`, `b-fallback-262`, `b-fallback-311`, `b-fallback-312`, `b-fallback-396`, `b-fallback-410`, `b-fallback-436`, `b-fallback-460`, `b-fallback-031`, `b-fallback-051`, `b-fallback-070`, `b-fallback-084`, `b-fallback-093`, `b-fallback-129`, `b-fallback-139`, `b-fallback-187`, `b-fallback-191`, `b-fallback-341`, `b-fallback-345`, `b-fallback-389`, `b-fallback-403`, `b-fallback-440`, `b-fallback-444`, `b-fallback-170`, `b-fallback-174`, `b-fallback-188`, `b-fallback-320`, `b-fallback-012`, `b-fallback-176`, `b-fallback-179`, `b-fallback-219`, `b-fallback-223`, `b-fallback-227`, `b-fallback-291`, `b-fallback-298`, `b-fallback-302`, `b-fallback-325`, `b-fallback-336`, `b-fallback-356`, `b-fallback-358`, `b-fallback-359`, `b-fallback-362`, `b-fallback-400`, and `b-fallback-438`.
- Duplicate handling decision: reviewed duplicated placements only inside the four assigned Slice I part 1 topics. Matching placements outside this PR remain for their already-reviewed slices or for Slice I part 2. Wording stayed intentionally topic-specific: basic-intersection duplicates keep signal hierarchy, avenida/calle/derecha, no-blocking, sign, lane-change, and mixed maneuver framing; special-situation duplicates keep rotonda, obstruction, pendiente, emergency, incorporation, turn, and authority hierarchy framing; center-line duplicates keep pedestrian-priority and yellow channelization exceptions narrow; lane/channelization duplicates keep lane, exclusive-lane, isleta, temporary-channelization, and Metrobus framing. Answer IDs, verdicts, images, placements, and topic assignment shape were preserved.
- Source-sensitive sentences left unchanged: all 22 `claims[].textRu` entries in Slice I part 1 topics were preserved as non-rendered source-trace metadata. Numeric, procedural, picture-bound, and old-ticket boundaries were preserved for authority/signal/general-rule hierarchy, avenida/calle/pasaje before derecha, no-blocking intersections, PARE/CEDA/PREFERENCIA meanings, warning signs that do not grant priority, exact image/letter vehicle-order answers, marcha atrás and giro boundaries, rotonda priority and egreso caveat, obstruction-side yielding, pendiente ascendente priority, repeated-bocina emergency reading in `b-fallback-093`, emergency-corridor image choreography in `b-fallback-268` and `b-fallback-319`, incorporation only when `tránsito se encuentra interrumpido`, giro signal at least 30 m before, left turn with/without signal permission, red/yellow cordón distinctions, continuous/discontinuous line rules, `b-fallback-174` pedestrian-priority scope, `b-fallback-320` yellow traffic-calming/channelization scope, `b-fallback-291` `línea imaginaria`, `b-fallback-223` `horario de restricción`, and `b-fallback-358` non-towed serious-failure advice.
- CABA/RF notes added or clarified: Slice I part 1 kept comparison practical. It clarified that an RF-trained driver should not jump straight to "помеха справа" when CABA tickets show avenida/calle/pasaje or signal hierarchy; that familiar basics like not blocking intersections and checking both directions still matter for the exam; that rotonda, pendiente, incorporation, and emergency vehicles have special CABA answer patterns; that demarcación horizontal is a real signal, not decoration; and that carriles exclusivos/Metrobús are not a short private-car bypass.
- Before/after samples:
  - `right-of-way-basic-intersections`: before "vertical signs и demarcación horizontal"; after "señales verticales и demarcación horizontal".
  - `right-of-way-basic-intersections`: before "ticket-specific mapping картинки"; after "Букву A не переносите на другие схемы."
  - `right-of-way-special-situations`: before "приоритет не решается одной привычкой"; after "не решайте все правилом 'кто справа'."
  - `right-of-way-special-situations`: before "ticket-specific emergency signal"; after "señal de emergencia именно для этого билета."
  - `center-lines-and-crossing-rules`: before "taxonomy-mixed ... pedestrian-priority logic"; after "`b-fallback-174` luz verde не отменяет приоритет пешехода."
  - `center-lines-and-crossing-rules`: before "traffic-calming/channelization effect"; after "эффект снижения скорости и направления потока."
  - `lane-and-channelization-markings`: before "demarcated band ... left/overtaking lane ... cruising"; after "продольная полоса на calzada ... Левая полоса для sobrepaso не становится постоянной полосой движения."
  - `lane-and-channelization-markings`: before "Reserved parking for passenger-transport vehicles" and "Discontinuous line on the outer side"; after "Estacionamiento reservado para transporte de pasajeros" and "Línea discontinua del lado externo."
- PR #63 / #82 guard: Slice I part 1 write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. It did not touch PR #63 / feature 009 forbidden paths (`content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`), coverage/source-trace manifests, validators/tests/docs/package files, product UI, scripts, package files, docs outside this feature memory, or other worktrees/branches/PRs. The branch was fast-forwarded to PR #82 follow-up head `baa0f2e` before final validation and commit, preserving Slice H review fixes.
- Difficulty metadata refresh evidence: all four Slice I part 1 topics kept their `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` unchanged. Only `difficultyMeta.sourceFingerprint` changed, and each new value matched `difficultyTopicFingerprint(topic)` after the learner-facing text rewrite:
  - `right-of-way-basic-intersections`: `efe538a7124015ca270bef740d7e92e3525478d098f76ee19714b84d2dc79614` -> `b33c99e1bbfc855d16eb7714f687c079be38c0fd8c377a9e1002b4922762cbff`
  - `right-of-way-special-situations`: `bf58c21edead46e541607c6bcb9c5ee37951db1d38813007567ff532d13ecbeb` -> `7d568512996adb0e90e179716d34bc45fee5fad285ed48b95ebf6a910acd5ec7`
  - `center-lines-and-crossing-rules`: `5111ceabe4ffa81b4bdcff779b628a489f8bdd373b449844907a7411003e5211` -> `2bbe6af6b6e183a88699ac5b28a4dbe56a148aca152cb1d328c3761f8e1fed29`
  - `lane-and-channelization-markings`: `7f689529cae9e5d0cbd0b501838cc3d31051915bce07b45944df6bf05d744bbb` -> `5b4bd3dfd0ddba4bd3c69e89d109da701dec61ae2e5851f83bf394fca64c5a4c`
- Validation evidence before final commit, after rebasing onto `baa0f2e`:
  - JSON parse, structural count, and preservation guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 170 claims, 38 `difficulty`, and 38 `difficultyMeta`. Only the four Slice I part 1 topics changed in `content/guide/topic-study-guide.ru.json`; IDs, slugs/status, placements, `questionId`, `imageLocalPath`, `answerId`, `verdict`, Spanish `termEs`, term/ticket/trap source references, claims/source traces, `difficulty`, and non-fingerprint `difficultyMeta` were preserved.
  - Fingerprint guard: pass; all four changed topic `difficultyMeta.sourceFingerprint` values matched `difficultyTopicFingerprint(topic)`, and unchanged topic fingerprints remained untouched.
  - Targeted rendered-field process/English scan over Slice I part 1 topics: pass after the `baa0f2e` rebase; scanned 356 rendered fields with 0 matches after ignoring `b-fallback-*` ticket IDs. Duplicate-term guard found 0 `spanishTerms[].translationRu` values duplicating their `termEs`.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check` and `git diff --cached --check -- content/guide/topic-study-guide.ru.json specs/015-study-guide-language-review/tasks.md`: pass before this evidence wording update.
  - Changed-path guard before this evidence wording update: pass; staged changed paths were limited to `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`, with no PR #63 forbidden paths, coverage/source-trace manifests, validators/tests/docs/package/product files, scripts, or other non-scope paths.
- PR #84 expanded review follow-up addressed: in `lane-and-channelization-markings`, replaced learner-facing English fragments `peligro ahead`, `horizontal signaling`, `line/carril`, `cordón/no stopping`, and `Yellow marking/cordón` with Russian or Spanish terms anchored in Russian. IDs, answer IDs, verdicts, placements, claims/source traces, `difficulty`, and non-fingerprint `difficultyMeta` stayed unchanged. Refreshed only this topic's `difficultyMeta.sourceFingerprint`, from `5b4bd3dfd0ddba4bd3c69e89d109da701dec61ae2e5851f83bf394fca64c5a4c` to `8d5614d9dc5b4c4461a8d920e5580168051b9a42185a55b310f30f2a2bf0c1da`.
- PR #84 expanded follow-up validation evidence:
  - JSON parse and affected topic fingerprint guard: pass; parsed 38 topics, and `lane-and-channelization-markings` `difficultyMeta.sourceFingerprint` matched `difficultyTopicFingerprint(topic)` at `8d5614d9dc5b4c4461a8d920e5580168051b9a42185a55b310f30f2a2bf0c1da`.
  - Targeted Slice I part 1 rendered-field English/process scan: pass; scanned 356 rendered fields across the four part 1 topics after ignoring `b-fallback-*` IDs, with 0 matches for `ahead`, `horizontal signaling`, `line/carril`, `cordón/no stopping`, `Yellow marking`, `no stopping`, and the curated process-English leftovers.
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check`: pass.
  - Changed-path guard: pass; changed paths stayed limited to `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`.
- Known issues: none introduced. Slice I part 2 remained pending after PR #84 and is implemented in the next stacked branch.
- Implementation Agent feedback: none requiring Architect disposition. Slice I part 1 found no need to edit claims metadata, source-trace or coverage manifests, product code, tests, scripts, docs outside this feature memory, package files, translations/explanations, image metadata, validation artifacts, or PR #63 paths.
- Slice I part 2 worktree/branch: `/Users/chap/devel/cabadrive-015-study-guide-language-review-lanes-turns` on `codex/015-study-guide-language-review-lanes-turns`, stacked on fixed PR #84 / `origin/codex/015-study-guide-language-review-rightofway` head `b7141f4818d12f22affa1cf19b39c81287c3ae24`.
- Slice I part 2 scope: implemented only the second half of Slice I (`lane-choice-and-lane-changes`, `turns-direction-and-reversing`, and `overtaking-and-passing`). The branch was first fast-forwarded from `a68a6a1` to fixed PR #84 head `b7141f4`, preserving the Slice I part 1 follow-up evidence above, then local part 2 content edits were reapplied cleanly.
- Topics reviewed: `lane-choice-and-lane-changes`, `turns-direction-and-reversing`, and `overtaking-and-passing`.
- Field counts reviewed:
  - root title/disclaimer: 0; Slice I part 2 did not touch root fields.
  - titles: 3
  - summaries: 3
  - learning paragraphs: 19
  - practical reasoning paragraphs: 10
  - term translations: 50
  - source-conflict notes: 0 in Slice I part 2 topics
  - answer explanations: 125
  - trap notes: 15
- Field counts changed:
  - root title/disclaimer: 0
  - titles: 0
  - summaries: 3
  - learning paragraphs: 19
  - practical reasoning paragraphs: 8
  - term translations: 4
  - source-conflict notes: 0
  - answer explanations: 66
  - trap notes: 10
  - `difficultyMeta.sourceFingerprint`: 3
  - claims: 0
- Ticket placements before/after: global 639 / 639; Slice I part 2 topics 43 / 43.
- Unique question IDs before/after: global 460 / 460; Slice I part 2 topics 43 / 43.
- Answer explanations before/after: global 1,831 / 1,831; Slice I part 2 topics 125 / 125.
- Source-conflict notes before/after: global 4 / 4; Slice I part 2 topics 0 / 0.
- Duplicated question IDs touched: `b-fallback-148`, `b-fallback-165`, `b-fallback-223`, `b-fallback-302`, `b-fallback-325`, `b-fallback-336`, `b-fallback-358`, `b-fallback-084`, `b-fallback-115`, `b-fallback-124`, `b-fallback-128`, `b-fallback-164`, `b-fallback-177`, `b-fallback-187`, `b-fallback-244`, `b-fallback-265`, `b-fallback-273`, `b-fallback-288`, `b-fallback-012`, `b-fallback-118`, `b-fallback-150`, `b-fallback-170`, `b-fallback-171`, `b-fallback-179`, `b-fallback-207`, `b-fallback-219`, `b-fallback-227`, `b-fallback-291`, `b-fallback-331`, `b-fallback-359`, `b-fallback-384`, `b-fallback-400`, and `b-fallback-411`.
- Duplicate handling decision: reviewed duplicated placements only inside the three assigned Slice I part 2 topics. Matching placements from already-reviewed slices were not edited again; wording remains intentionally topic-specific. Lane-choice duplicates keep change-lane priority, `horario de restricción`, acceleration/deceleration, and safe-return framing; turns duplicates keep 30 m signaling, `giro obligatorio` versus `dirección permitida`, sign-image, `marcha atrás`, and curve/load framing; overtaking duplicates keep left-side overtake, prohibited-place, horn, cyclist-distance, image/order, and return-right framing. Answer IDs, verdicts, images, placements, and topic assignment shape were preserved.
- Source-sensitive sentences left unchanged: all 12 `claims[].textRu` entries in Slice I part 2 topics were preserved as non-rendered source-trace metadata. No rendered source-conflict notes exist in these topics. Numeric, procedural, image-bound, and ticket-bound meanings were preserved for `cambio de carril` priority, `horario de restricción`, `carril de aceleración/deceleración`, `b-fallback-358` `falla grave` exit answer, `luz de giro` at least 30 m before a turn, `giro obligatorio` versus `dirección permitida`, `marcha atrás` as a narrow exception, `luces traseras` and `luz de retroceso` image readings, `fondo del baúl`, `desacelerar` before `curva`, overtake-left baseline and narrow right-side exceptions, `trazo continuo` / dangerous-place prohibitions, `b-fallback-130` `un metro y medio` as an exact ticket answer only, and image/order letters that apply only to their shown schemes.
- CABA/RF notes added or clarified: Slice I part 2 kept comparisons practical. It reinforced that a familiar RF-style habit to signal before changing lanes does not create priority; that CABA `carriles exclusivos` depend on `horario de restricción`; that 30 m turn signaling, direction signs, and restricted `marcha atrás` should be read as exam formulas; that `bocina` is not a normal overtake signal in CABA; and that the left/overtaking lane is not a cruising lane when a right lane is available.
- Before/after samples:
  - `lane-choice-and-lane-changes`: before "demarcated bands ... restricted hours answer ... invadir"; after "выделенные полосы ... Вне указанного времени ответ может быть другим ... нельзя просто занимать эту полосу."
  - `lane-choice-and-lane-changes`: before "fallback-ответ ... ticket-specific"; after "ответ именно этого билета: уйти вправо и abandonar la autopista en la próxima salida."
  - `turns-direction-and-reversing`: before "vuelta en U / разворот U-turn"; after "`vuelta en U` = `разворот`."
  - `turns-direction-and-reversing`: before "ticket-specific формула безопасного входа"; after "формула именно этого билета про безопасный вход."
  - `overtaking-and-passing`: before "source-backed ... maneuver ... vehicle to rebasar"; after "Основная логика из источников ... sobrepaso делают слева от автомобиля впереди."
  - `overtaking-and-passing`: before "continuous line, tunnel, bridge, curve ... escape space ... pressure"; after "línea continua/trazo continuo, túnel, puente, curva ... обзор и запас места ... снижает давление сзади."
- PR #63 / #84 guard: Slice I part 2 write scope stayed limited to `content/guide/topic-study-guide.ru.json` and this `tasks.md`. It did not touch PR #63 / feature 009 forbidden paths (`content/translations/*`, `content/explanations/*`, `content/image-metadata/*`, `content/validation/*`), coverage/source-trace manifests, validators/tests/docs/package files, product UI, scripts, package files, docs outside this feature memory, or other worktrees/branches/PRs. The final branch includes fixed PR #84 head `b7141f4` before the part 2 commit.
- Difficulty metadata refresh evidence: all three Slice I part 2 topics kept their `difficulty`, `difficultyMeta.dimensions`, `difficultyMeta.rationaleRu`, `difficultyMeta.provenance`, and `difficultyMeta.basis` unchanged. Only `difficultyMeta.sourceFingerprint` changed, and each new value matched `difficultyTopicFingerprint(topic)` after the learner-facing text rewrite:
  - `lane-choice-and-lane-changes`: `51dd58225d2403bbb9920fbbf267b25539bf376c948aea0781c118706a0b170c` -> `e4f62472c0ed0f2abee5cbe772a380cce211e8e437547026ec62661e2904d8c2`
  - `turns-direction-and-reversing`: `e353717de3f90f0e9a6ccc4c9030d5ba3e159c751bda20cbcd8f748fa56014e5` -> `9ed3344449062bfa71e0355a37b18f67cf1219cf6ad1511f637b18bad276d663`
  - `overtaking-and-passing`: `005fafc9030670132b82af9043cdb92df9c5c887dcff552bed68fb13d743d1d9` -> `83064ac891334810ab5ea3f9cd2e74683cf95935d662c2d0cee275a995053e91`
- Validation evidence before final commit, after stacking on fixed `b7141f4`:
  - JSON parse, structural count, and preservation guard: pass; totals remained 38 topics, 639 rendered placements, 460 unique question IDs, 1,831 answer explanations, 225 trap notes, 4 source-conflict notes, 170 claims, 38 `difficulty`, and 38 `difficultyMeta`. Only the three Slice I part 2 topics changed in `content/guide/topic-study-guide.ru.json`; IDs, slugs/status, placements, `questionId`, `imageLocalPath`, `answerId`, `verdict`, Spanish `termEs`, term/ticket/trap source references, claims/source traces, `difficulty`, and non-fingerprint `difficultyMeta` were preserved.
  - Fingerprint guard: pass; all three changed topic `difficultyMeta.sourceFingerprint` values matched `difficultyTopicFingerprint(topic)`, and unchanged topic fingerprints remained untouched.
  - Targeted rendered-field process/English scan over Slice I part 2 topics: pass; scanned 225 rendered fields with 0 matches after ignoring `b-fallback-*` ticket IDs. Duplicate-term guard found 0 `spanishTerms[].translationRu` values duplicating their `termEs`.
  - `node --test tests/content-topic-guide.test.mjs`: pass after the `b7141f4` stack update and this evidence update, 21/21 tests.
  - `pnpm run validate:content`: pass after stacking on `b7141f4`, `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check`: pass after this evidence update.
  - Changed-path guard: pass after this evidence update; changed paths were limited to `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`, with no PR #63 forbidden paths, coverage/source-trace manifests, validators/tests/docs/package/product files, scripts, or other non-scope paths.
- Known issues: none introduced. Slice J/K/L remain pending by design; Slice I is now fully reviewed across part 1 and part 2.
- Implementation Agent feedback: none requiring Architect disposition. Slice I part 2 found no need to edit claims metadata, source-trace or coverage manifests, product code, tests, scripts, docs outside this feature memory, package files, translations/explanations, image metadata, validation artifacts, or PR #63 paths.
- PR #89 Slice I part 2 advisory follow-up addressed: removed the rendered English leftover `route` from `turns-direction-and-reversing` ticket `b-fallback-414-a3` by changing it to Russian `дороге`; added Russian anchors for all Slice I part 2 rendered `gradual` occurrences in `overtaking-and-passing` (`learningMaterialRu[3]`, `practicalReasoningRu[2]`, and `b-fallback-179-a2`) as `постепенно (gradual)`.
- PR #89 follow-up preservation guard: exact guide diff versus the prior branch head contained only six expected JSON leaves: the three advisory learner strings, the related overtaking learning paragraph, and `difficultyMeta.sourceFingerprint` for `turns-direction-and-reversing` and `overtaking-and-passing`. IDs, slugs/status, placements, `questionId`, `imageLocalPath`, `answerId`, `verdict`, Spanish `termEs`, term/ticket/trap source references, claims/source traces, `difficulty`, and non-fingerprint `difficultyMeta` stayed unchanged.
- PR #89 follow-up fingerprint refresh evidence: refreshed only the affected topic fingerprints after the cleanup:
  - `turns-direction-and-reversing`: `9ed3344449062bfa71e0355a37b18f67cf1219cf6ad1511f637b18bad276d663` -> `9740216f0ded7a7dea31ad12a47cc60864c44f3566e300c3f42c1a1a130d6f48`
  - `overtaking-and-passing`: `83064ac891334810ab5ea3f9cd2e74683cf95935d662c2d0cee275a995053e91` -> `be6a6d2342383ffabc8fa2c5d353ab92b1496c7f4a5eee8d4ef174eab0217de2`
- PR #89 follow-up validation evidence:
  - JSON parse and affected topic fingerprint guard: pass; parsed 38 topics and verified `difficultyTopicFingerprint(topic)` for `turns-direction-and-reversing` and `overtaking-and-passing`.
  - Targeted Slice I part 2 rendered-field scan: pass; scanned 225 rendered fields after ignoring `b-fallback-*` IDs, with 0 matches for `route`, unanchored `gradual`, and the curated obvious English/process leftovers (`fallback`, `ticket-specific`, `source-backed`, `canonical answer`, `taxonomy-mixed`, `ahead`, `horizontal signaling`, `no stopping`, `Yellow marking`, `U-turn`, and `road/visibility/vehicle`).
  - `node --test tests/content-topic-guide.test.mjs`: pass, 21/21 tests.
  - `pnpm run validate:content`: pass; `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check`: pass after this evidence update.
  - Changed-path guard: pass after this evidence update; changed paths stayed limited to `content/guide/topic-study-guide.ru.json` and `specs/015-study-guide-language-review/tasks.md`, with no PR #63 forbidden paths, coverage/source-trace manifests, validators/tests/docs/package/product files, scripts, or other non-scope paths.
- PR #89 follow-up known issues: none introduced. The global `rg` scan still sees `gradual` in already-reviewed Slice I part 1 rendered strings outside this part 2 follow-up scope, and sees `route` / mixed English inside non-rendered machine IDs and `claims[].textRu` metadata; those were not edited because the assignment limited this cleanup to Slice I part 2 rendered fields and affected topic fingerprints.

## Known Issues

- `fatigue-distraction-and-attention` has no `slug`; known metadata oddity, out of scope unless separately planned.
- The current guide contains learner-facing process/meta words such as `fallback`, `ticket-specific`, `source-backed`, and `canonical answer`. Rewrites should replace these with plain Russian learner-facing wording where they appear in rendered fields.
- Several feature 006 source-boundary decisions intentionally keep details ticket-specific or stale-ticket-specific. Language changes must preserve those boundaries.

## Implementation Agent Feedback

- Slice B feedback is recorded in Process Memory; no scope expansion or Architect disposition is requested from this slice.
