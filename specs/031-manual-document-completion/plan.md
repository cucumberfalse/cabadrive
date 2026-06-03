# Plan: Complete The Interactive Russian Manual

## Summary

Finish the interactive Russian `Руководство` from the current merged state by implementing each remaining source manual chapter as its own content PR, treating appendices as chapter-equivalent PR units, and adding explicit front-matter, visual-rule prerequisite, audit, correction, review, and final-validation tracking.

Chapter 1 is already merged through PR #184 at base `b07d5c72bf1689e7dac480e937c366a528d20299`. Chapter 2 is the next likely chapter-level content PR from a fresh latest-main base.

## Technical Context

- App shape: local-first static React + TypeScript + Vite app; no runtime backend.
- Runtime contract: Docker-only end-user flow with `make build`, `make up`, `make down`.
- Manual destination: `Руководство`, native web document, not a PDF viewer or side-by-side source reader.
- Current source/reference inputs:
  - `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json`
  - `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg` through `page-200.jpg`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`
- Existing implemented surface includes Introduction and all Chapter 1 sections.
- Required checks from `.unicorn-hub/config.json`: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`.

## Constitution Check

- Spec-first: implementation must not start until `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- Testable boundaries: chapter data, source-section coverage, visual metadata, checker output, DOM selection, responsive layout, and forbidden patterns must be tested.
- PR-only workflow: no direct push to `main`; every content unit lands through a PR.
- Latest-main isolation: every new slice starts from fetched/verified `origin/main` in a fresh worktree/branch unless Orchestrator records an explicit fallback.
- One worktree per task: each implementation/audit/correction slice gets its own isolated worktree.
- Process memory: decisions, evidence, known issues, feedback, dispositions, PR heads, and validation notes are recorded in this feature memory.
- Final validation: Orchestrator invokes final Architect validation before final Analyst validation and completion.
- Cleanup governance: no cleanup is planned unless Orchestrator explicitly assigns Cleanup Agent work.

## Scope Boundaries

In scope:

- Visual-rule prerequisite/guideline/checker updates when needed.
- Audit and corrections for already merged Introduction and Chapter 1 under stricter visual rules.
- Chapter 2, Chapter 3, Chapter 4, Chapter 5, Appendix I, Appendix II, Appendix III, Appendix IV.
- Front-matter support disposition for pages `1-13`.
- Source-derived navigation/registry expansion for the whole manual.
- Local high-resolution source images/crops and source-fidelity evidence.
- Tests, Playwright evidence, Docker validation, process memory, review, final validation, and merge-readiness gates.

Out of scope:

- Practice question bank changes.
- Exam mode, mistake review, vocabulary, topic materials, `Источники`, or process-guide behavior except where navigation labels need no content behavior change.
- Runtime backend, remote assets/fonts, analytics, live AI, runtime PDF rendering.
- Merging by Implementation Agent or Architect.
- Cleanup without explicit Cleanup Agent assignment.

## Recommended PR Sequence

1. Visual-rule prerequisite PR, no new chapter content:
   - Update durable `manual-conversion-guidelines.md` with the x5/high-resolution, source-as-is photo/sign/marking, and source-image/glyph-cleanup infographic rules.
   - Update checker/evidence schema and tests to require extraction method, dimensions/hash, source-as-is exception types, and rejection of approximate infographic redraws and broad cleanup patches.
   - Add whole-manual registry/scaffold support if needed so chapter PRs can record all remaining units without duplicating setup.
2. Introduction and Chapter 1 visual-rule audit PR, no unrelated chapter content:
   - Inspect pages `14-42` against the stricter rules.
   - Record no-fix evidence or create explicit follow-up correction tasks.
   - Do not mix fixes into Chapter 2 unless Architect/Orchestrator explicitly route a dependency correction.
3. Correction PRs for Introduction or Chapter 1, if the audit finds gaps:
   - Scope each correction by affected section/chapter or shared visual fixture.
   - Keep Russian explanation outside photos/signs/markings.
   - Replace approximate redraws or insufficient assets with high-resolution source transfers.
4. Chapter 2 PR:
   - Fresh latest-main worktree/branch.
   - Implement only Chapter 2 sections: `ch2-legal-responsibility`, `ch2-required-documents`, `ch2-incident-obligations`, `ch2-scoring`.
   - Preserve feature `030` page-55 Scoring boundary and page-56 closing-slogan disposition.
5. Chapter 3 PR:
   - Implement all Chapter 3 sections over pages `57-88`.
   - High visual/legal risk around priority, speed, lights, parking, signs, and adverse-condition diagrams.
6. Chapter 4 PR:
   - Implement all Chapter 4 sections over pages `89-97`.
   - Preserve page `94` shared boundary between sleep/fatigue and stress, and direct navigation to `Стресс` and `Отвлечения`.
7. Chapter 5 PR:
   - Implement all Chapter 5 sections over pages `98-103`.
   - Preserve page `100` shared boundary between equality and gender-violence support.
8. Appendix I PR:
   - Implement private-car safety elements over pages `104-122`.
   - Likely visual-heavy; use source-as-is photos/diagrams where applicable.
9. Appendix II PR:
   - Implement passenger-transport appendix over pages `123-151`.
   - Preserve professional-driver detail and any vehicle/equipment diagrams.
10. Appendix III PR:
   - Implement cargo appendix over pages `152-183`.
   - Preserve cargo/legal/equipment details and source diagrams.
11. Appendix IV PR:
   - Implement road signs, road markings, and signals over pages `184-200`.
   - All traffic signs and road markings are source-as-is images. Russian explanations live outside images.
12. Front-matter support PR:
   - Implement learner-useful front matter and record omission evidence for book-only pages.
   - This may be moved earlier if Orchestrator wants all navigation/support scaffolding complete before appendices.
13. Final validation/evidence PR or commit only if needed:
   - Record final role-owned validation evidence and cycle PR-set closure.
   - Only evidence-only changes are allowed after final Architect/Analyst validation without rerouting.

## Chapter PR Contract

Each chapter-equivalent content PR must:

- Start from latest verified `origin/main` in an isolated worktree/branch.
- Name its source unit, source pages, child sections, and no-cross-chapter scope in PR/process memory.
- Implement all source `Índice` child topics for that chapter as native website section pages.
- Keep source order and ticket-critical details.
- Use selectable Russian DOM/SVG text where feasible.
- Use high-resolution source assets with x5/equivalent export evidence.
- Preserve photos, traffic signs, and road markings as unmodified source images.
- Transfer infographics as source images, clean Spanish only at glyph/letter level, and overlay selectable Russian labels when feasible.
- Update navigation/registry/checker evidence, tests, screenshots, and process memory.
- Run focused checks, preflight, and Docker validation before merge readiness.

## Visual Evidence Model

Implementation Agents should record visual evidence per section and per asset:

- `unitId`, `sectionId`, source page(s), source region coordinates, reference asset.
- Extraction/export method: x5 zoom/source export target or equivalent/better method.
- Runtime asset path, dimensions, hash where practical, and runtime display size or max CSS width proving no degradation/upscaling.
- Asset kind:
  - `source-as-is-photo`
  - `source-as-is-traffic-sign`
  - `source-as-is-road-marking`
  - `source-transferred-infographic`
  - `source-transferred-diagram`
  - `native-dom-text-only`
- Cleanup scope:
  - `none-source-as-is`
  - `glyph-level-spanish-cleanup`
  - `reference-only-not-runtime`
- Visible-Spanish status and explicit exception when source-as-is signs/markings/photos retain Spanish inside the image.
- Russian overlay strategy: DOM/SVG/selectable, or documented narrow exception.
- Screenshots for desktop, mobile, and narrow/high-risk viewport where fixed visual blocks exist.
- Bounding-box/no-overlap/no-clipping evidence.
- Checker pass/fail output.

## Audit Plan For Existing Introduction And Chapter 1

Audit scope:

- Introduction pages `14-20`, including existing named fixtures in `manual-conversion-guidelines.md`.
- Chapter 1 pages `21-42`, including all merged section registry entries and assets.

Audit questions:

- Were photos, road signs, sign-like markings, and road markings modified, translated, reconstructed, recolored, cleaned, or masked?
- Were infographics transferred as source images, or were they approximated with DOM/CSS/SVG redraws?
- If Spanish was removed from infographics, was cleanup glyph/letter-level rather than broad patches?
- Do asset records prove high-resolution extraction/export and no runtime upscaling?
- Are Russian labels selectable DOM/SVG where feasible?
- Do screenshots show no clipping, overlap, broad masks, visible Spanish residue outside exceptions, or source-shape damage?

Audit outcomes:

- Pass/no-fix: record evidence in `tasks.md` and, if applicable, durable validation evidence.
- Fix needed: create explicit correction task and correction PR scope; do not hide it inside unrelated future chapter content.
- Ambiguous: Implementation Agent records feedback; Orchestrator routes Architect disposition before changes.

## Front Matter Plan

Front matter support PR should:

- Inspect `front-title`, `front-presentation`, `front-categories`, `front-glossary`, and `front-index`.
- Implement `front-presentation` and `front-glossary` if source inspection confirms learner value.
- Omit title and index pages as book/source/navigation artifacts unless source inspection finds learner value.
- Decide page `3` with evidence: omit if it is only category/source-catalog context; implement if it contains useful license-category learning context.
- Keep front-matter routes separate from chapter content.
- Preserve no-runtime-PDF and source-visual rules.

## Verification Matrix

| Gate | Evidence |
| --- | --- |
| Chapter-level PR slicing | PR diff scope, branch name/body, `tasks.md` cycle PR-set row, Review Agent scope check |
| Full source hierarchy | Navigation/registry tests comparing source `navigation.ru.json` unit/section inventory |
| Chapter 1 already merged | Base evidence `b07d5c72bf1689e7dac480e937c366a528d20299`, PR #184 row in cycle PR set |
| Chapter 2 next likely PR | Orchestrator assignment from fresh latest main; Chapter 2-only diff |
| Front matter disposition | Include/omit evidence per pages `1-13` |
| High-resolution export | Asset metadata with x5/equivalent method, dimensions, hash, runtime display-size check |
| Photo/sign/marking source-as-is | Source-as-is asset kind, no cleanup/translation/reconstruction evidence, Russian explanation outside image |
| Infographic transfer | Source image asset, glyph-level cleanup evidence, no broad mask/plate/patch, selectable Russian overlay where feasible |
| Selectable Russian text | DOM/SVG tests and Playwright selection/computed-style checks |
| Responsive layout | Desktop/mobile/narrow screenshots; no overflow, overlap, or clipping checks |
| Forbidden runtime patterns | Static scans/tests for PDF viewer, PDF.js, iframe/object/embed PDF, full-page raster, side-by-side source reader, remote URLs |
| Detail retention | Content tests or review evidence for legal/numeric/safety/document/sign/scoring/contact details |
| Local-first build | `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run preflight` |
| Docker runtime | `make build`, isolated `make up`, browser/curl smoke, `make down` |
| Review | AI Review and Review Agent findings resolved or disposed |
| Final validation | Architect pass before Analyst pass; matching effective content head markers |
| Current-head guard | Orchestrator read-only guard if evidence-only commits follow validation |
| Required checks | `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan` green |

Recommended local command set for each content PR:

```bash
node scripts/manual-guide-source-fidelity.mjs
node --test tests/content-manual-guide-chapters.test.mjs
node --test tests/content-pandemia-vial-section.test.mjs
pnpm run validate:content
pnpm run test
pnpm exec tsc --noEmit
pnpm run build
pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual|Руководство|<unit-or-section-id>"
pnpm run preflight
make build
COMPOSE_PROJECT_NAME=<unique-project> CABADRIVE_HOST_PORT=<free-port> make up
make down
git diff --check
```

Agents may substitute newer focused tests/checkers created by the prerequisite PR, but must record exact commands and results.

## Cycle PR-Set Tracking

`tasks.md` owns the working cycle PR set. Each row should record:

- purpose
- source unit and source pages
- branch/worktree
- PR number/URL when opened
- base SHA
- head SHA/current head
- status
- merge status
- required checks result
- visual evidence summary
- review status
- included in final validation

Required rows from the start:

- PR #184 / Chapter 1 merged baseline.
- Visual-rule prerequisite PR, pending.
- Introduction/Chapter 1 audit PR, pending.
- Correction PRs, pending only if audit creates them.
- Chapter 2 PR, pending/next likely.
- Chapter 3 PR, pending.
- Chapter 4 PR, pending.
- Chapter 5 PR, pending.
- Appendix I PR, pending.
- Appendix II PR, pending.
- Appendix III PR, pending.
- Appendix IV PR, pending.
- Front-matter support PR, pending.

## Review Requirements

Review Agent must check:

- Orchestrator-first routing and complete feature memory.
- Assigned isolated worktree, branch, PR slice, and latest-main base evidence.
- No sibling worktree/branch/dirty diff/process memory mutation.
- One chapter-equivalent content unit per PR.
- No cross-chapter content bundling.
- Visual-rule evidence quality, including x5/equivalent extraction, source-as-is photo/sign/marking handling, and infographic transfer/glyph cleanup.
- No forbidden runtime/manual rendering patterns.
- Responsive/selectable text evidence.
- Detail retention for legal, numeric, sign, marking, document, scoring, safety, and contact content.
- Final-validation compliance when applicable.

## Cleanup Planning

Cleanup is not assigned for this Architect planning task.

- Approved cleanup roots: none.
- Cleanup Agent assignment: none.
- Orchestrator must assign Cleanup Agent separately if completed agent-created environments should be removed.
- Ambiguous, active, dirty, untracked, open-PR, unpushed, user-owned, or process-memory-referenced paths must be preserved.

## Risks And Mitigations

- Large chapter PRs may be harder to review: require per-section evidence bundles and focused reviewer checklist.
- Appendix IV may be too dense for one PR: keep one appendix PR unless implementation feedback proves a split is necessary, then route back to Architect.
- Stricter visual rules may invalidate earlier accepted work: run explicit audit and correction slices before final completion.
- x5 export may require tooling changes: route prerequisite PR before content work if current scripts cannot record/validate the evidence.
- Russian text may not fit source layouts: use source image plus selectable overlay, wrapping, font tuning, or contained visual scrolling without altering source images.
- Legal and safety detail can be oversimplified: require detail-retention tests/review evidence per chapter.
- Post-validation content changes can stale final validation: use evidence-only commits only after current-head guard, otherwise reroute.
