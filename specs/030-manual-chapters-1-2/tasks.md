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
| `ch2-incident-obligations` | `Obligaciones en caso de incidentes viales` / `Обязанности в случае дорожных инцидентов` | `51-55`, ending before the `Scoring` block on source PDF page `55` | Emergency steps, `107`, `911`, data collection, follow-up duties, psychological/legal help, NGO contact list with volatility risk. Source page `55` is shared with Scoring and requires region-level ownership. | Ordered-step coverage, phone/detail checks, contact/volatility disposition, checklist/form responsiveness, page-55 region metadata that excludes Scoring text, source visual metadata if present. |
| `ch2-scoring` | `Scoring` / `Система баллов Scoring` | `55`, starting at the `Scoring` block on source PDF page `55` | Current-head AI Review P1 `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510`: Scoring text is on page `55`; page `56` is only closing slogan. | Update section registry/tests/checker expectations to use page `55` / `page-055.jpg` for Scoring; preserve scoring rules/points/footnotes; treat page `56` closing slogan as omitted book-only material or a separately evidenced closing artifact, not Scoring source content. |

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

## Current Section Slice: `ch1-cities-for-people`

- [x] Confirmed Implementation Agent assignment for worktree `/Users/chap/devel/cabadrive-worktrees/030-ch1-cities-for-people`, branch `codex/030-ch1-cities-for-people`, assigned source section `ch1-cities-for-people`, and base `origin/main` at `b0b3506cea0165f2ae267a7b186b0149091a6fe0`.
- [x] Recorded baseline status before edits: `git status --short --branch` returned `## codex/030-ch1-cities-for-people...origin/main`, and `git rev-parse HEAD` returned `b0b3506cea0165f2ae267a7b186b0149091a6fe0`.
- [x] Read the required project memory, active feature memory, manual conversion guidelines, feature `029` guidance, current manual guide source files, registry/checker/tests, source page `22` data, and local page render before editing.
- [x] Inspected source `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, and `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-022.jpg` for this section.
- [x] Implemented only `Ciudades para las personas` / `Города для людей`; left `ch1-sustainable-mobility` and every later Chapter 1/2 section pending.
- [x] Updated the section registry entry to `implemented`, with source-region metadata, local native-DOM visual evidence, screenshot paths, no-visible-Spanish status, selectable-text status, bounding-box evidence, and checker pass state.
- [x] Added `src/data/manual-sections/ch1-cities-for-people.ts` as the section-local content module and wired it through `implementedManualGuideSections`.
- [x] Recreated the source `FLUIDEZ / SEGURIDAD` relationship as selectable Russian DOM text: `ПЛАВНОСТЬ` / `БЕЗОПАСНОСТЬ`, with responsive CSS preserving the side-by-side relationship on mobile.
- [x] Preserved source page `22` facts: shared public space, fast/safe/no-harm travel goal, solidarity and law/other-person respect, stronger-road-user/driver care duty, more than nine million daily CABA trips, streets as shared healthy coexistence spaces, connectivity works, sustainable mobility, and the crash-likelihood closing idea.
- [x] Generated source crop evidence at `content/validation/manual-guide/ch1-cities-for-people/page-022-cities-for-people-source-crop.jpg` and committed rendered desktop/mobile evidence screenshots under the same directory.
- [x] Added focused content and e2e tests for route activation, implemented-vs-pending state, source coverage, no page-021/page-043/page-056 routes, no unrelated section implementation, selectable principle text, responsive/no-overflow checks, and no visible Spanish in the rendered section.
- [x] Finalized implementation commit/push and opened ready PR metadata for this slice; implementation content head before this PR-metadata evidence update is `9ec2a7e39d0316caf16a9793f090635d5d5cff9f`.

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
- Implementation Agent note for `ch1-cities-for-people`: this fresh worktree initially had no `node_modules`, so `pnpm install --frozen-lockfile` was run before local verification.
- Implementation Agent dead end for `ch1-cities-for-people`: first `pnpm run preflight` attempt stopped at `check-feature-memory` because product files were changed before this section-slice process-memory update was recorded. Resolution: update this `tasks.md` with section decisions/evidence, then rerun preflight.
- Implementation Agent Docker-smoke note for `ch1-cities-for-people`: two ad hoc Playwright smoke attempts against the Docker container failed because the smoke harness first queried a non-existent section test id, then matched duplicate `ПЛАВНОСТЬ` text in prose and the principle visual, then expected whitespace that DOM text did not expose. Resolution: reran the smoke against the dedicated `manual-principle-terms` element with whitespace-insensitive text normalization; the container route passed.

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
- Review fix decision for P2 `PRRT_kwDOSX65IM6F1OW7` / `discussion_r3327868928`: when a future implemented manual section is selected, `selectedManualSection` must determine `data-active-group-id` before falling back to the selected Introduction entry. This prevents stale Introduction state from keeping Introduction highlighted while manual section content is displayed.
- Implementation Agent decision for P1 `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510`: `ch2-scoring` now uses source PDF page `55` / `page-055.jpg`; source page `55` is intentionally shared with `ch2-incident-obligations` by layout-block boundary metadata, and source page `56` is skipped as book-only closing slogan material with no route/module/placeholder/PR slice.
- Implementation Agent decision for `ch1-cities-for-people`: source page `22` contains one substantive source-`Índice` website section; source PDF page `21` remains divider-only and is not included in this PR as content, route, module, placeholder, or screenshot target.
- Implementation Agent decision for `ch1-cities-for-people`: the page has no source pictogram/photo/table requiring runtime image artwork. The meaningful visual relationship is the centered `FLUIDEZ / SEGURIDAD` typographic pair, so the learner view recreates it as selectable Russian DOM text (`ПЛАВНОСТЬ` / `БЕЗОПАСНОСТЬ`) with source-teal emphasis and source-region evidence.
- Implementation Agent decision for `ch1-cities-for-people`: the source page crop is committed only as internal reference evidence under `content/validation/manual-guide/ch1-cities-for-people/`; the learner UI does not render the Spanish crop, full source page raster, broad masks, page chrome, or page marker.

### Known Issues

- Existing page-based PR/process memory may mention pages `021-056` as implementation units. Architect disposition: addressed; this correction supersedes page-based slicing, future agents must follow section-based slicing from this spec/plan/tasks, and older page-based wording is historical only.
- PR #175 / `page-021` conflicts with corrected requirements. Architect disposition: resolved; PR #175 is closed unmerged and superseded by the corrected section-based contract, so it must not merge as-is.
- PR #174 or earlier shared prerequisite state encoded a page-based pending registry. Architect disposition: resolved; PR #176 replaces the page-based registry with the section-based shared correction/prerequisite, so no additional Architect task is required for PR #174 in this slice.
- Legacy layout manifests may classify meaningful visual regions as page chrome or text. Architect disposition: addressed; every future section implementation must perform manual visual inspection across its full source range.
- Section `ch2-incident-obligations` includes source NGO contacts that may be volatile. Architect disposition: addressed; carry forward as required section-level contact/volatility disposition before learner-facing presentation.
- Section `ch2-scoring` source-boundary issue from current-head AI Review P1 `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510`: resolved by implementation follow-up in PR #176. Registry/tests/evidence now assign Scoring to source PDF page `55`, assign `ch2-incident-obligations` only the pre-Scoring page-55 layout blocks, and skip page `56` as non-section closing slogan material. Final Architect/Analyst validation still must rerun after this non-evidence fix.
- No unresolved known issues for local `ch1-cities-for-people` implementation at the time of this process-memory update.

### Verification Evidence

- Architect confirmed local HEAD/base for correction worktree: `7a07034d8a9380cbe83b9403a6a9aa7bc73dfa50` on branch `codex/030-section-requirement-correction`.
- Architect inspected corrected Analyst intake in `feature-request.md`, which states website pages must be source manual sections/topics and divider-only pages such as page `21` are skipped.
- Architect inspected `docs_project/project/frontend/manual-conversion-guidelines.md`, which states route boundaries come from source `Índice`, not raw PDF page numbers.
- Architect inspected `navigation.ru.json` Chapter 1/2 entries and confirmed ten substantive child topics with source ranges: `22`, `23`, `24-29`, `30-38`, `39-40`, `41-42`, `44-45`, `46-50`, `51-55`, and `56`.
- Architect inspected `manual.ru.json` lines around source PDF pages `55` and `56` for current-head AI Review P1 `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510`: page `55` / `page-055.jpg` contains the `El Sistema de Evaluación Permanente de Conductores o Scoring...` text and footnotes, while page `56` / `page-056.jpg` contains only the closing slogan `Respetar las normas de tránsito implica salvar vidas.`
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
- Shared correction PR opened ready: PR #176, `https://github.com/cucumberfalse/cabadrive/pull/176`; implementation content head before PR-metadata evidence-only follow-up commit: `93ab0b57166a56258df0a56021448354c01e6e2a`.
- Review fix P2 `PRRT_kwDOSX65IM6F1OW7` / `discussion_r3327868928` addressed: `src/App.tsx` now computes active manual-guide group through `manualGuideActiveGroupId`, which checks `selectedManualSection` section membership before falling back to `selectedEntry`; `tests/content-manual-guide-chapters.test.mjs` adds a guard that the section lookup precedes the Introduction fallback.
- Review fix verification passed: `node scripts/manual-guide-source-fidelity.mjs`; `node --test tests/content-manual-guide-chapters.test.mjs` (`14/14`); `pnpm run build`; `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide exposes Chapter 1 and 2 pending section entries"` (`2/2` desktop/mobile). Final hygiene commands after this note are recorded in the Implementation Agent handoff.
- Implementation Agent source inspection for P1 `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510`: `jq` inspection of `manual.ru.json` and `layout.ru.json` confirmed source PDF page `55` / `page-055.jpg` contains Scoring text and footnotes; `page-055-block-08` starts `El Sistema de Evaluación Permanente de Conductores o Scoring`; blocks `page-055-block-08` through `page-055-block-19` are Scoring/footnotes; source PDF page `56` / `page-056.jpg` contains only the closing slogan `Respetar las normas de tránsito implica salvar vidas.`
- Implementation Agent P1 fix: updated `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json` so `ch2-scoring` uses source page `55` and `page-055.jpg`; added explicit shared page-55 ownership metadata for `ch2-incident-obligations` pre-Scoring blocks and `ch2-scoring` Scoring/footnote blocks; added skipped source page `56` with `chapter-closing-slogan-only` reason.
- Implementation Agent P1 fix: updated `content/validation/manual-guide-source-fidelity.evidence.json`, `scripts/manual-guide-source-fidelity.mjs`, `tests/content-manual-guide-chapters.test.mjs`, `tests/e2e/app.spec.ts`, and `src/data/manualGuide.ts` so validation allows only the intentional page-55 overlap, rejects missing shared-page boundary evidence, expects Scoring source page `55`, and confirms no raw page-56 learner route.
- Implementation Agent focused verification after P1 fix passed before this process-memory update: `node scripts/manual-guide-source-fidelity.mjs` returned `status: pass`, `pendingSections: 10`, `skippedSourcePages: [21, 43, 56]`, and `sharedSourcePages: [55]`; `node --test tests/content-manual-guide-chapters.test.mjs` passed `16/16`; `node --test tests/content-pandemia-vial-section.test.mjs` passed `14/14`; `git diff --check` passed.
- Implementation Agent additional verification after process-memory update passed: `node scripts/manual-guide-source-fidelity.mjs`; `node --test tests/content-manual-guide-chapters.test.mjs` (`16/16`); `node --test tests/content-pandemia-vial-section.test.mjs` (`14/14`); `pnpm run build` including `validate:content`, Vite build, and service worker generation; `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide exposes Chapter 1 and 2 pending section entries"` (`2/2` desktop/mobile); `git diff --check`.
- Review-thread state after P1 implementation: Implementation Agent did not resolve GitHub review thread `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510`; Orchestrator/Review routing remains responsible for review-thread state and final validation rerun after this branch is pushed.
- Implementation Agent baseline for `ch1-cities-for-people`: worktree `/Users/chap/devel/cabadrive-worktrees/030-ch1-cities-for-people`, branch `codex/030-ch1-cities-for-people`, base `b0b3506cea0165f2ae267a7b186b0149091a6fe0`; `git status --short --branch` returned `## codex/030-ch1-cities-for-people...origin/main` before edits.
- Implementation Agent source inspection for `ch1-cities-for-people`: `jq` inspection of `manual.ru.json` source page `22`, `layout.ru.json` source page `22`, `navigation.ru.json` topic `ch1-cities-for-people`, registry entry `ch1-cities-for-people`, and visual inspection of `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-022.jpg` confirmed the section scope and source facts.
- Source crop evidence for `ch1-cities-for-people`: generated `content/validation/manual-guide/ch1-cities-for-people/page-022-cities-for-people-source-crop.jpg` from source page `22`; dimensions `620x650`; SHA-256 `bdf97ca487edf8e307946497e9059afc6bfd7b146c56414b057d28489c600a72`.
- Rendered screenshot evidence for `ch1-cities-for-people`: generated `content/validation/manual-guide/ch1-cities-for-people/ch1-cities-for-people-desktop.png` at `1280x900` viewport and `content/validation/manual-guide/ch1-cities-for-people/ch1-cities-for-people-mobile.png` at `390x900` viewport from local route `/#manual-section-ch1-cities-for-people`.
- In-app browser verification for `ch1-cities-for-people`: direct route `http://127.0.0.1:5194/#manual-section-ch1-cities-for-people` rendered `data-manual-section-id="ch1-cities-for-people"`, active group `chapter-1-sustainable-mobility`, active child `ch1-cities-for-people`, `ПЛАВНОСТЬ` / `БЕЗОПАСНОСТЬ` present, and no visible Spanish text detected in the section text.
- Focused local verification passed for `ch1-cities-for-people`: `node scripts/manual-guide-source-fidelity.mjs` returned `status: pass`, `pendingSections: 9`, `implementedSections: 1`, skipped source pages `[21, 43, 56]`, and `sourceCropEvidence`/`screenshotEvidence` recorded for this section.
- Focused local verification passed for `ch1-cities-for-people`: `node --test tests/content-manual-guide-chapters.test.mjs` passed `17/17`; `node --test tests/content-pandemia-vial-section.test.mjs` passed `14/14`; `pnpm run build` passed including content validation, manual guide checker, Vite build, and service-worker generation.
- Full local Node test verification passed after section implementation: `pnpm run test` passed `326/326`.
- Focused Playwright verification passed for `ch1-cities-for-people`: `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide exposes Chapter 1 cities"` passed `2/2` across desktop Chromium and mobile projects.
- First `pnpm run preflight` attempt for `ch1-cities-for-people` failed at `node scripts/check-feature-memory.mjs --worktree` because feature memory had not yet been updated in the worktree; this process-memory entry records the resolution path before rerunning preflight.
- Full local preflight passed for `ch1-cities-for-people`: `pnpm run preflight` completed `check-feature-memory`, `check:repo`, `validate:content`, `pnpm run test` with `326/326` passing node tests, `pnpm run build`, and full Playwright e2e with `74/74` passing tests across desktop/mobile projects.
- Docker runtime smoke passed for `ch1-cities-for-people` with isolated project/port: `COMPOSE_PROJECT_NAME=cabadrive030cities CABADRIVE_HOST_PORT=5195 make build` built the image and reran content validation/build inside Docker; `COMPOSE_PROJECT_NAME=cabadrive030cities CABADRIVE_HOST_PORT=5195 make up` started the container; `curl -fsS http://127.0.0.1:5195/` fetched the served shell; a Playwright smoke of `http://127.0.0.1:5195/#manual-section-ch1-cities-for-people` confirmed the route hash, `Города для людей`, selectable `ПЛАВНОСТЬБЕЗОПАСНОСТЬ`, and no visible Spanish; `COMPOSE_PROJECT_NAME=cabadrive030cities CABADRIVE_HOST_PORT=5195 make down` stopped the runtime; `COMPOSE_PROJECT_NAME=cabadrive030cities CABADRIVE_HOST_PORT=5195 docker compose ps --all` showed no remaining containers.
- Final local hygiene after evidence updates passed for `ch1-cities-for-people`: `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, and `node scripts/manual-guide-source-fidelity.mjs`.
- Ready PR opened for `ch1-cities-for-people`: PR #177, `https://github.com/cucumberfalse/cabadrive/pull/177`, branch `codex/030-ch1-cities-for-people`, implementation content head `9ec2a7e39d0316caf16a9793f090635d5d5cff9f`, draft status `false`. Final handoff head is the later process-memory evidence commit reported by the Implementation Agent after push.

### Cycle PR Set

| Slice | Purpose | Branch | PR metadata | Head SHA | Status | Included in final validation |
| --- | --- | --- | --- | --- | --- | --- |
| section-requirement-correction | Architect memory correction from source-PDF-page slicing to website-section slicing, carried by this shared correction branch | `codex/030-section-requirement-correction` | PR #176, `https://github.com/cucumberfalse/cabadrive/pull/176` | post-P1 implementation head to be reported by Implementation Agent after commit/push; prior validated head `8a435c84166e4c001220ddc70624abaa8017c96b` is stale after current-head P1 `PRRT_kwDOSX65IM6F1edn` | P1 Scoring source-boundary fix implemented locally; final validation rerun pending after push | yes |
| shared-section-prereq | Shared correction/prerequisite for section registry/routes/checker/style, no section content | `codex/030-section-requirement-correction` | PR #176, `https://github.com/cucumberfalse/cabadrive/pull/176` | post-P1 implementation head to be reported by Implementation Agent after commit/push | Scoring source-boundary registry/test fix implemented locally; review-thread/final-validation state pending Orchestrator routing | yes |
| PR-175-page-021-disposition | Existing PR #175 / `page-021` divider-only implementation | `codex/030-page-021` | PR #175, `https://github.com/cucumberfalse/cabadrive/pull/175` | `1e8334676ba26d867194dcc9b884758465837959` | closed unmerged, superseded by corrected section-based contract | no |
| `ch1-cities-for-people` | Implement website section page `Ciudades para las personas` / `Города для людей` with source page `22` evidence and selectable `ПЛАВНОСТЬ / БЕЗОПАСНОСТЬ` visual | `codex/030-ch1-cities-for-people` | PR #177, `https://github.com/cucumberfalse/cabadrive/pull/177` | implementation content head `9ec2a7e39d0316caf16a9793f090635d5d5cff9f`; final handoff head reported after process-memory evidence push | ready PR opened; focused checker/content/build/Playwright, full preflight, Docker runtime smoke, and diff hygiene passed | yes |
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

- Historical validation note: prior Architect validation for `1846b88496fed61d72c3328eefdc70d4ed404004` is superseded by later process-memory normalization and must not be used as the current effective-head validation.
- Current normalization note: this pass records finalizer-compatible process memory only; Orchestrator must invoke a new final Architect validation before final Analyst validation or merge/finalization.
- Analyst feedback Architect disposition: none.
- Limit escalation: none.
- Historical effective-content head before current-head P1: 8a435c84166e4c001220ddc70624abaa8017c96b.
- Historical final-validation evidence-only note: Architect validation evidence for 8a435c84166e4c001220ddc70624abaa8017c96b was process-memory-only for PR #176 before the Scoring source-boundary P1.
- Historical current-PR-head guard note: Orchestrator owned current-head guard, required-check confirmation, review-thread state, mergeability, and merge/finalization decision for the now-superseded validation.
- Analyst feedback Architect disposition: none.
- Limit escalation: none.
- Stale validation notice: prior final Architect validation for effective content head `8a435c84166e4c001220ddc70624abaa8017c96b` is stale after current-head AI Review P1 `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510`; Implementation Agent must fix Scoring source-boundary registry/test evidence and final Architect/Analyst validation must rerun.
- Effective content head: 5763ed702f059046c0ef3541188aa3678ed47304
- Final-validation evidence-only commit: effective content head 5763ed702f059046c0ef3541188aa3678ed47304; Architect validation evidence is process-memory-only for PR #176.
- Current-PR-head read-only guard: effective content head 5763ed702f059046c0ef3541188aa3678ed47304; Orchestrator owns current-head guard, required-check confirmation, review-thread state, mergeability, and merge/finalization decision.
- Analyst feedback Architect disposition: none.
- Limit escalation: none.

### Cleanup Evidence

- Not applicable. No cleanup was assigned or authorized for this shared correction task. Runtime smoke containers were stopped with `COMPOSE_PROJECT_NAME=cabadrive030section CABADRIVE_HOST_PORT=5187 make down`, and `docker compose -p cabadrive030section ps` showed no remaining containers.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback for this shared correction/prerequisite pass.
- No unresolved Implementation Agent feedback for the `ch1-cities-for-people` section slice at the time of local verification.

## Architect Dispositions

- Architect disposition: addressed; corrected user requirement supersedes all prior source-PDF-page implementation slicing.
- Architect disposition: addressed; divider-only source PDF pages `21` and `43` are skipped and receive no site page/PR.
- Architect disposition: addressed; PR #175 / `page-021` must not merge as-is and must be closed, superseded, or replaced by section-based implementation.
- Architect disposition: addressed; infographic/source-artwork quality remains a first-class gate for each section PR.
- Architect disposition: addressed; current-head AI Review P1 `PRRT_kwDOSX65IM6F1edn` / `discussion_r3327958510` requires Implementation Agent to move `ch2-scoring` registry/evidence from source PDF page `56` to the Scoring block on source PDF page `55`, keep `ch2-incident-obligations` page-55 ownership region before Scoring only, and treat page `56` as non-Scoring closing slogan material.

## Historical Final Architect Validation Notes

- Historical Architect validation pass for superseded head: passed.
- Historical Architect validation completion timestamp: 2026-05-30T02:41:44Z.
- Historical Architect return count: 0.
- Historical Architect validated head: 1846b88496fed61d72c3328eefdc70d4ed404004.
- Historical Architect validation evidence: PR #176 shared correction/prerequisite only; the shared runtime/process contract used website-section slicing, skipped divider-only source PDF pages `21` and `43`, recorded PR #175 as closed/unmerged and not merge-ready as-is, preserved infographic/source-fidelity gates, and left the ten section implementations pending.
- Historical Architect validation evidence: `git rev-parse HEAD` confirmed 1846b88496fed61d72c3328eefdc70d4ed404004; `git status --short --branch` was clean before evidence edit; `node scripts/manual-guide-source-fidelity.mjs` passed with 10 pending sections, 0 implemented sections, and skipped divider pages 21 and 43; `node --test tests/content-manual-guide-chapters.test.mjs` passed 14/14; `git diff --check` passed before evidence edit.
- Historical open Architect dispositions: none for PR #176 shared correction/prerequisite; future section PRs retain their recorded source-boundary, contact/volatility, scoring, and infographic evidence obligations.
- Historical Architect gaps: none for PR #176 shared correction/prerequisite; full Chapter 1/2 section implementation remained outside this slice.

## Historical Final Architect Validation Notes - Superseded After Scoring Boundary P1

- Historical Architect validation pass for superseded head: passed.
- Historical Architect validation completion timestamp: 2026-05-30T03:02:24Z.
- Historical Architect return count: 0.
- Historical Architect validated head: 8a435c84166e4c001220ddc70624abaa8017c96b.
- Historical Architect validation evidence: PR #176 shared correction/prerequisite only; the shared runtime/process contract used website-section slicing, skipped divider-only source PDF pages `21` and `43`, recorded PR #175 as closed unmerged and not merge-ready as-is, preserved infographic/source-fidelity gates, and left the ten section content PRs as future work.
- Historical Architect validation evidence: `git rev-parse HEAD` confirmed 8a435c84166e4c001220ddc70624abaa8017c96b; `git status --short --branch` was clean before evidence edit; `node scripts/manual-guide-source-fidelity.mjs` passed with 10 section registry entries, 0 implemented sections, and skipped divider pages 21 and 43; `node --test tests/content-manual-guide-chapters.test.mjs` passed 14/14; `git diff --check` passed before evidence edit.
- Historical Architect validation evidence: Orchestrator evidence reported required checks green on 8a435c84166e4c001220ddc70624abaa8017c96b, Review Agent no findings on current head, prior AI Review P2 fixed and resolved, and PR #175 closed unmerged.
- Historical open Architect dispositions: none for PR #176 shared correction/prerequisite at that time; later current-head AI Review P1 `PRRT_kwDOSX65IM6F1edn` supersedes this validation and requires Scoring source-boundary implementation.
- Historical Architect gaps: none recorded for that validation; current-head P1 now makes final validation stale until implementation and role validation rerun.

## Final Architect Validation Notes

- Architect validation pass: passed
- Final Architect validation completed at: 2026-05-30T04:11:12Z
- Architect return count: 0
- Architect validated effective content head: 5763ed702f059046c0ef3541188aa3678ed47304
- Architect validation evidence: PR #176 shared correction/prerequisite only; the shared runtime/process contract uses website-section slicing, one future PR per website section, skipped divider-only pages `21` and `43`, skipped closing-slogan-only page `56`, no route/module/placeholder/PR slice for skipped pages, PR #175 closed unmerged, and preserved infographic/source-fidelity gates for future section PRs.
- Architect validation evidence: Scoring source boundary is fixed in this effective head: `ch2-scoring` uses source PDF page `55` / `page-055.jpg`, page-55 overlap with `ch2-incident-obligations` is explicit and layout-block bounded, and page `56` is not treated as Scoring content.
- Architect validation evidence: reviewed current head `5763ed702f059046c0ef3541188aa3678ed47304`, PR diff scope, `spec.md`, `tasks.md`, section registry, and source-fidelity evidence; Orchestrator evidence reports required checks green, Review Agent no findings, old P1 and P2 review threads resolved/outdated, and Implementation verification passed for source-fidelity checker, content tests, build, focused Playwright, and diff hygiene.
- Open Architect dispositions: none for PR #176 shared correction/prerequisite; future section PRs retain source-boundary, contact/volatility, scoring, and infographic evidence obligations.
- Architect gaps: none for PR #176 shared correction/prerequisite; full Chapter 1/2 section content implementation remains outside this slice.
