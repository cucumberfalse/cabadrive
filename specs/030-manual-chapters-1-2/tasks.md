# Tasks: Interactive Russian Manual Chapters 1 And 2

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Correction Tasks

- [x] T001 Confirm active Architect assignment, worktree `/Users/chap/devel/cabadrive-worktrees/030-section-requirement-correction`, branch `codex/030-section-requirement-correction`, and base `origin/main` at `7a07034d8a9380cbe83b9403a6a9aa7bc73dfa50`.
- [x] T002 Read corrected Analyst intake in `feature-request.md`, current Architect artifacts, manual conversion guidelines, source navigation, and relevant feature `029` principles.
- [x] T003 Preserve role boundary: Architect edits only `spec.md`, `plan.md`, and `tasks.md`.
- [x] T004 Replace the source-PDF-page PR contract with the corrected website-section-page PR contract.
- [x] T005 Record that source PDF pages `21` and `43` are divider-only pages and must be skipped as standalone site pages/PRs.
- [x] T006 Replace the old source-PDF-page inventory with ten expected website section page PR slices.
- [x] T007 Preserve infographic/artwork quality as a first-class merge gate.
- [x] T008 Add Architect disposition that PR #175 / `page-021` must not merge as-is and must be closed, superseded, or replaced by section-based implementation.

## Shared Correction / Prerequisite Recommendation

- [x] T009 Orchestrator assigned a new shared correction/prerequisite PR slice in worktree `/Users/chap/devel/cabadrive-worktrees/030-section-requirement-correction` on branch `codex/030-section-requirement-correction`.
- [x] T010 Shared correction/prerequisite replaces page-based pending registry terminology with section-based registry terminology.
- [x] T011 Shared correction/prerequisite records source PDF page spans only as section metadata.
- [x] T012 Shared correction/prerequisite ensures source PDF pages `21` and `43` are not implemented/pending learner pages.
- [x] T013 Shared correction/prerequisite keeps or strengthens guards against runtime PDF viewer, full-page raster base, duplicate `Руководство 4R`, side-by-side translation, remote assets, broad masks/plates, generic icons, visible Spanish, and fake pending content.
- [x] T014 Shared correction/prerequisite ensures checker/evidence schema supports multiple source regions/pages per website section.

## Section Slice Inventory

Each row is one required implementation PR slice. `Source range metadata` is used for source inspection, crop metadata, screenshots, and content coverage, not as a PR boundary.

| Section PR key | Website section page | Source range metadata | Visual-risk notes | Required per-slice evidence |
| --- | --- | --- | --- | --- |
| `ch1-cities-for-people` | `Ciudades para las personas` / `Города для людей` | `22` | Responsive prose; traffic-system principles; `FLUIDEZ / SEGURIDAD` typographic relationship. | Full text coverage, source order, responsive prose checks, style-token reuse, desktop/mobile screenshots. |
| `ch1-sustainable-mobility` | `¿Qué es la movilidad sustentable?` / `Что такое устойчивая мобильность?` | `23` | Context/city framing and possible source margin visuals; inspect before omitting any visual. | Source inspection notes, section heading coverage, no visible Spanish/page chrome, screenshots. |
| `ch1-pedestrian-priority` | `Prioridad peatonal` / `Пешеходный приоритет` | `24-29` | Multi-page high visual risk: before/after labels, crash impact graphic, signs, school routes, interventions, zones, speed/numeric details. | Source-region metadata for every visual, cleaned crop evidence, no Spanish, bounding-box checks, numeric/detail retention, responsive prose. |
| `ch1-bicycle` | `Bicicleta` / `Велосипед` | `30-38` | Large multi-page section: helmet/protection, passenger/cargo rules, body position, age thresholds, overtaking distance, hand signals, bike lanes, parking, Ecobici, scooter rules. | Visual metadata for gestures/signs/lanes/scooter, legal/numeric detail checks, no generic icons, screenshot comparison across representative high-risk blocks. |
| `ch1-public-transport-system` | `Sistema de transporte público` / `Система общественного транспорта` | `39-40` | Bus/yellow-box/platform/Metrobus/exclusive-lane infrastructure visuals and CO2/occupancy comparisons. | Source crop metadata, CO2 and occupancy detail retention, lane/sign visual checks, responsive list/table checks. |
| `ch1-shared-trip` | `Viaje compartido` / `Совместная поездка` | `41-42` | Shared-trip benefits and closing rhythm may include icon/benefit visuals or slogan-like layout. | Benefit/detail coverage, source visual metadata if present, DOM text selection, responsive screenshots. |
| `ch2-legal-responsibility` | `Responsabilidades legales` / `Юридическая ответственность` | `44-45` | High legal precision: Law 2148, administrative/contravention/civil/insurance/criminal responsibility, sanctions, alcohol threshold, fleeing scene, footnote substance. | Legal term/detail coverage, law/article/numeric checks, source order, responsive prose, review focus on no over-simplification. |
| `ch2-required-documents` | `Documentación obligatoria` / `Обязательные документы` | `46-50` | High document precision: DNI, license, novice restrictions, `0.0 g/L`, GNC, insurance, VTV/RTO validity, RVA, certificate/sticker visuals. | Document-name coverage, table/list detail retention, sticker/certificate visual metadata, numeric checks, responsive card/list evidence. |
| `ch2-incident-obligations` | `Obligaciones en caso de incidentes viales` / `Обязанности в случае дорожных инцидентов` | `51-55` | Emergency steps, `107`, `911`, data collection, follow-up duties, psychological/legal help, NGO contact list with volatility risk. | Ordered-step coverage, phone/detail checks, contact/volatility disposition, checklist/form responsiveness, source visual metadata if present. |
| `ch2-scoring` | `Scoring` / `Система баллов Scoring` | `56` | Source-boundary risk: prior page-based memory flagged scoring/slogan mismatch; confirm source text and any spillover from adjacent manifest extraction before implementation. | Source-boundary confirmation, scoring rules/points/detail coverage, source screenshots, DOM text selection, Architect disposition if navigation/source range needs correction. |

## Skipped Source PDF Pages

| Source PDF page | Reason | Required disposition |
| --- | --- | --- |
| `21` | Chapter 1 divider/title only. | Skip as standalone site page and PR. Represent chapter title through chapter group/navigation. |
| `43` | Chapter 2 divider/title only. | Skip as standalone site page and PR. Represent chapter title through chapter group/navigation. |

## Per-Section Implementation Checklist

For each section key:

- [ ] T015 Confirm Orchestrator section assignment, isolated worktree, branch, PR slice, latest-main base SHA, and parallel-work warning.
- [ ] T016 Read `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` before editing.
- [ ] T017 Record baseline `git status --short --branch` and verify no sibling dirty work is touched.
- [ ] T018 Inspect source `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, all local source renders in the section range, and official PDF if crop/source-region fidelity requires it.
- [ ] T019 Record section title/topic, source text order, meaningful visuals, omitted page/book artifacts, crop/source regions, cleanup scope, and visible-Spanish status.
- [ ] T020 Implement only the assigned website section page's user-facing content and section-local assets/tests/process-memory updates.
- [ ] T021 Keep ordinary Russian text selectable/copyable DOM/SVG text and responsive outside visual scrollers.
- [ ] T022 Preserve source artwork/crops and reject generic icons, broad masks, visible Spanish, distorted reassembly, clipped pictograms, and backing plates.
- [ ] T023 Preserve legal/document/numeric/order details or record Architect disposition before dropping anything.
- [ ] T024 Update recurring style tokens only when the source requires a documented variant.
- [ ] T025 Add/update section route tests, content coverage tests, forbidden-pattern tests, visual checker fixtures, Playwright screenshot/bounding-box checks, and selection/responsive checks.
- [ ] T026 Run focused checks, local preflight, Docker runtime validation, and `git diff --check`; record exact commands/results.
- [ ] T027 Update this `tasks.md` with decisions, dead ends, known issues, evidence, Implementation Agent feedback, and cycle PR set row.

## Review Requirements

- [ ] T028 Review Agent verifies one-section PR scope and no unrelated sections.
- [ ] T029 Review Agent verifies no role-boundary violation, Orchestrator-first bypass, missing feature memory, stale/latest-main ambiguity, or sibling-work mutation.
- [ ] T030 Review Agent verifies source-`Índice` hierarchy, pending/implemented section state, and direct route behavior.
- [ ] T031 Review Agent verifies divider-only source PDF pages `21` and `43` are not standalone learner pages.
- [ ] T032 Review Agent verifies infographic/artwork quality evidence, not just asset existence.
- [ ] T033 Review Agent verifies legal/document/numeric details on Chapter 2 sections.
- [ ] T034 Review Agent verifies process-memory updates and Implementation Agent feedback disposition state.

## Final Validation Tasks

- [ ] T035 Orchestrator confirms all ten section PRs and any shared correction/prerequisite PRs are merged or explicitly disposed.
- [ ] T036 Orchestrator confirms PR #175 / `page-021` was closed, superseded, or replaced by section-based implementation before merge.
- [ ] T037 Orchestrator records the full cycle PR set with purpose, branch, PR metadata, head SHA, status, merge state, and final-validation inclusion.
- [ ] T038 Orchestrator invokes final Architect validation before final Analyst validation.
- [ ] T039 Architect final validation checks all PR slices, open task state, style/visual guidance, process memory, feedback dispositions, acceptance evidence, corrected section-slicing contract, and customer intent in spirit.
- [ ] T040 If Architect validation passes, Architect records `Architect validation pass: passed`, timestamp, return count, and `Architect validated effective content head: <40-hex-sha>`.
- [ ] T041 Orchestrator invokes final Analyst validation only after final Architect validation passes.
- [ ] T042 Analyst final validation checks customer intent in spirit and letter.
- [ ] T043 Any Analyst gap is routed to Architect for accept/task/ticket/dispose disposition before follow-up development.
- [ ] T044 Orchestrator runs current-PR-head guard and merge-readiness checks before completion/finalization.

## Process Memory

### Dead Ends

- Superseded: prior feature `030` planning treated raw source PDF pages as PR delivery units. The corrected Analyst intake and this Architect update replace that assumption. Source PDF pages are now source metadata only.
- Rejected patterns inherited from feature `029`: runtime PDF/full-page raster, side-by-side Spanish/Russian translation, generic icons, broad masks/plates, distorted infographic reassembly, unselectable Russian text, and duplicate `Руководство 4R` destination.
- Implementation Agent dead end: first `pnpm run build` attempt failed before code compilation because this isolated worktree had no `node_modules` and `pdf-parse` could not be resolved by content validation. Resolution: ran `pnpm install --frozen-lockfile` locally in the worktree, then reran build successfully.

### Decisions

- One website page equals one source manual section/topic from source `Índice`, regardless of PDF page span.
- One PR equals one website section page.
- Source PDF pages `21` and `43` are skipped entirely as divider-only source pages; they receive no standalone route, content module, placeholder, implementation PR, or merge target.
- Current expected section PR count is ten, based on current `navigation.ru.json` Chapter 1/2 child topics.
- Source PDF page ranges remain required metadata for crop extraction, source screenshots, text coverage, and visual QA.
- Source `Índice` hierarchy remains primary; page numbers are secondary source metadata.
- Infographic/artwork quality is a merge gate, not polish.
- Shared correction/prerequisite work is allowed only to align registry/routes/checkers/style with section-based delivery and must not include converted section content.
- PR #175 / `page-021` must not merge as-is because it implements only a divider-only source PDF page. Orchestrator must close/supersede it or route a full replacement as a section-based PR.
- Implementation Agent decision: this shared correction removes `page-registry.chapters-1-2.json` and replaces it with `section-registry.chapters-1-2.json`; source PDF pages remain only evidence metadata inside section entries.
- Implementation Agent decision: Chapter 1/2 runtime navigation now exposes ten disabled pending website sections in `Руководство`; there is no standalone/pending/implemented learner route, hash, module path, placeholder, or button for raw source PDF pages `21` or `43`.
- Implementation Agent decision: no converted learner content, section prose, or section-local assets are included in this prerequisite PR.

### Known Issues

- Existing page-based PR/process memory may mention pages `021-056` as implementation units. Architect disposition: addressed by this correction; future agents must follow section-based slicing from this spec/plan/tasks and treat older page-based wording as superseded.
- PR #175 / `page-021` conflicts with corrected requirements. Architect disposition: not merge-ready as-is; must be closed, superseded, or fully replaced with a section-based implementation before merge.
- If PR #174 or any shared prerequisite still encodes a page-based pending registry, it may need a shared correction PR before section implementation continues. Architect disposition: route to Implementation Agent only through Orchestrator; no Architect code change authorized here.
- Legacy layout manifests may classify meaningful visual regions as page chrome or text. Architect disposition: addressed by requiring manual visual inspection for every section source range.
- Section `ch2-incident-obligations` includes source NGO contacts that may be volatile. Architect disposition: carry forward as required section-level contact/volatility disposition before learner-facing presentation.
- Section `ch2-scoring` has prior source-boundary concerns from page-based work. Architect disposition: carry forward as required source-boundary confirmation before scoring implementation.

### Verification Evidence

- Architect confirmed local HEAD/base for correction worktree: `7a07034d8a9380cbe83b9403a6a9aa7bc73dfa50` on branch `codex/030-section-requirement-correction`.
- Architect inspected corrected Analyst intake in `feature-request.md`, which states website pages must be source manual sections/topics and divider-only pages such as page `21` are skipped.
- Architect inspected `docs_project/project/frontend/manual-conversion-guidelines.md`, which states route boundaries come from source `Índice`, not raw PDF page numbers.
- Architect inspected `navigation.ru.json` Chapter 1/2 entries and confirmed ten substantive child topics with source ranges: `22`, `23`, `24-29`, `30-38`, `39-40`, `41-42`, `44-45`, `46-50`, `51-55`, and `56`.
- Architect updated `spec.md`, `plan.md`, and `tasks.md` only.
- Implementation Agent baseline before code edits: `git status --short --branch` returned `## codex/030-section-requirement-correction...origin/main` plus only Analyst/Architect-owned feature-memory edits in `feature-request.md`, `plan.md`, `spec.md`, and `tasks.md`; local `HEAD` was `7a07034d8a9380cbe83b9403a6a9aa7bc73dfa50`.
- Implementation Agent verified PR #175 disposition with `gh pr view 175 --json number,url,state,mergedAt,headRefName,headRefOid,title`: state `CLOSED`, `mergedAt: null`, URL `https://github.com/cucumberfalse/cabadrive/pull/175`, branch `codex/030-page-021`, head `1e8334676ba26d867194dcc9b884758465837959`.
- Implementation Agent replaced the Chapter 1/2 shared registry with `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`, containing exactly ten source-`Índice` sections and skipped divider metadata for source PDF pages `21` and `43`.
- Implementation Agent updated `src/data/manualGuide.ts`, `src/App.tsx`, and `src/styles.css` so Chapter 1/2 guide navigation uses section entries and disabled pending section buttons, not raw page buttons or page-local module paths.
- Implementation Agent updated `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, `tests/content-manual-guide-chapters.test.mjs`, `tests/content-pandemia-vial-section.test.mjs`, and `tests/e2e/app.spec.ts` for section inventory, skipped divider guards, no raw Chapter 1/2 page routes, no fake content, and fixture implemented sections with multiple source pages/regions.
- Evidence commands already passed before final preflight: `node scripts/manual-guide-source-fidelity.mjs`; `node --test tests/content-manual-guide-chapters.test.mjs`; `node --test tests/content-pandemia-vial-section.test.mjs`; `pnpm run build`; focused `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide exposes Chapter 1 and 2 pending section entries"`; `pnpm run test`.
- Full local preflight passed after implementation: `pnpm run preflight` completed `check-feature-memory`, `check:repo`, `validate:content`, `pnpm run test` with 323 passing node tests, `pnpm run build`, and full Playwright e2e with 74 passing tests across desktop/mobile projects.
- Docker runtime smoke passed with isolated project/port: `docker version --format '{{.Server.Version}}'` reported `27.5.1`; `lsof -nP -iTCP:5187 -sTCP:LISTEN` returned no listener; `COMPOSE_PROJECT_NAME=cabadrive030section CABADRIVE_HOST_PORT=5187 make build` built the image and reran content validation/build inside Docker; `COMPOSE_PROJECT_NAME=cabadrive030section CABADRIVE_HOST_PORT=5187 make up` started `cabadrive030section-cabadrive-1`; `curl -fsS http://127.0.0.1:5187/ | head -n 5` returned the Russian HTML shell; `COMPOSE_PROJECT_NAME=cabadrive030section CABADRIVE_HOST_PORT=5187 make down` removed the container/network; `docker compose -p cabadrive030section ps` showed no remaining containers.
- Final local hygiene after process-memory evidence update: `git diff --check` passed; `node scripts/check-feature-memory.mjs --worktree` passed; `node scripts/manual-guide-source-fidelity.mjs` passed.

### Cycle PR Set

| Slice | Purpose | Branch | PR metadata | Head SHA | Status | Included in final validation |
| --- | --- | --- | --- | --- | --- | --- |
| section-requirement-correction | Architect memory correction from source-PDF-page slicing to website-section slicing, carried by this shared correction branch | `codex/030-section-requirement-correction` | pending shared correction PR | pending commit | included in shared correction/prerequisite slice | yes |
| shared-section-prereq | Shared correction/prerequisite for section registry/routes/checker/style, no section content | `codex/030-section-requirement-correction` | ready PR to be opened after final local verification | pending commit | Implementation Agent verification in progress | yes |
| PR-175-page-021-disposition | Existing PR #175 / `page-021` divider-only implementation | `codex/030-page-021` | PR #175, `https://github.com/cucumberfalse/cabadrive/pull/175` | `1e8334676ba26d867194dcc9b884758465837959` | closed unmerged, superseded by corrected section-based contract | no |
| `ch1-cities-for-people` | Implement website section page `Ciudades para las personas` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch1-sustainable-mobility` | Implement website section page `¿Qué es la movilidad sustentable?` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch1-pedestrian-priority` | Implement website section page `Prioridad peatonal` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch1-bicycle` | Implement website section page `Bicicleta` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch1-public-transport-system` | Implement website section page `Sistema de transporte público` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch1-shared-trip` | Implement website section page `Viaje compartido` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch2-legal-responsibility` | Implement website section page `Responsabilidades legales` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch2-required-documents` | Implement website section page `Documentación obligatoria` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch2-incident-obligations` | Implement website section page `Obligaciones en caso de incidentes viales` | pending Orchestrator assignment | pending | pending | pending | yes |
| `ch2-scoring` | Implement website section page `Scoring` | pending Orchestrator assignment | pending | pending | pending | yes |

### Final Validation Evidence

- Final validation is not requested in this correction pass.
- Architect validation remains future until Orchestrator invokes final Architect validation after corrected section PR set completion.
- Analyst validation remains future until after final Architect validation passes.
- Architect return count: `0`.
- Limit escalation: none.

### Cleanup Evidence

- Not applicable. No cleanup was assigned or authorized for this shared correction task. Runtime smoke containers were stopped with `COMPOSE_PROJECT_NAME=cabadrive030section CABADRIVE_HOST_PORT=5187 make down`, and `docker compose -p cabadrive030section ps` showed no remaining containers.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback for this shared correction/prerequisite pass.

## Architect Dispositions

- Architect disposition: addressed; corrected user requirement supersedes all prior source-PDF-page implementation slicing.
- Architect disposition: addressed; divider-only source PDF pages `21` and `43` are skipped and receive no site page/PR.
- Architect disposition: addressed; PR #175 / `page-021` must not merge as-is and must be closed, superseded, or replaced by section-based implementation.
- Architect disposition: addressed; infographic/source-artwork quality remains a first-class gate for each section PR.
