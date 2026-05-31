# Plan: Interactive Russian Manual Chapters 1 And 2

## Summary

Continue the accepted native `Руководство` conversion model from the Introduction into Chapter 1 and Chapter 2 using section-based website pages. The corrected unit is one source-`Índice` topic per website page and one PR per website section page. Source PDF pages are QA/source metadata only. Divider-only source PDF pages `21` and `43` are skipped as standalone site pages.

## Technical Context

- runtime: static local-first React + TypeScript + Vite app, Docker-served for local runtime.
- dependencies: existing local toolchain; no runtime backend, remote assets, remote fonts, live AI, analytics, or PDF renderer.
- likely implementation paths: `src/App.tsx`, `src/styles.css`, manual-guide data modules, `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/`, `tests/`, `tests/e2e/`, visual/source-fidelity checker scripts, and this feature memory.
- source/reference paths: `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json`, `layout.ru.json`, `navigation.ru.json`, local source page renders, and official PDF SHA `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`.
- corrected planning base evidence: Orchestrator provided `origin/main` at `7a07034d8a9380cbe83b9403a6a9aa7bc73dfa50`.
- assigned correction worktree/branch: `/Users/chap/devel/cabadrive-worktrees/030-section-requirement-correction`, `codex/030-section-requirement-correction`.
- cleanup applicability: not applicable to Architect planning; no cleanup is authorized.

## Scope Boundaries

- in scope: ten Chapter 1/2 website section pages, source-`Índice` navigation integration, section-level routes/placeholders, local source artwork/crops, Russian native text, tests, visual checker evidence, process memory, and any required section-registry/shared-checker correction.
- out of scope: standalone divider-only pages `21` and `43`, source-PDF-page route/content PRs, Chapters 3-5, annexes, practice-question changes, old manual-reader expansion, cleanup, merge actions by Architect.
- role-routing constraints: every file-changing implementation starts with Orchestrator assignment. Non-Orchestrator agents stop on new repository-changing requests and do not self-promote.
- sibling-process coordination: preserve feature `029-pandemia-vial-section` decisions, `docs_project/project/frontend/manual-conversion-guidelines.md`, existing Introduction hashes/routes, sibling worktrees, and the root untracked `tmp_repair_page18_center.swift`.

## Constitution Check

- Spec-first: complete `feature-request.md`, corrected `spec.md`, corrected `plan.md`, and corrected `tasks.md` are required before implementation continues.
- Testable boundaries: section data, route coverage, forbidden patterns, source-artwork metadata, visual checker output, and Playwright assertions must be testable per section.
- PR-only: no direct push to `main`; one website section page per implementation PR.
- Latest-main isolation: every shared/section slice starts from latest verified `main`; unverified/fetch-failed base is a blocker or documented fallback.
- Final validation loop: Orchestrator invokes final Architect validation, then final Analyst validation after Architect passes.
- Simplicity: one shared correction/prerequisite PR is allowed only to prevent duplicating section registry/route/checker infrastructure across section PRs.
- Deployability: required checks and local preflight/Docker verification remain gates before merge readiness.
- Active-model stop condition: Architect writes only Architect-owned artifacts in this assignment.
- Sibling-work preservation: every slice records parallel-work warning and avoids dirty/untracked/sibling mutation.

## Cycle And PR-Set Tracking

- Work cycle boundary: feature `030-manual-chapters-1-2` from this corrected planning branch through all accepted PR slices, final validation, completion, or escalation.
- Cycle PR set recording location: `tasks.md` section `Cycle PR Set`, with matching PR body notes recommended for each PR.
- PR slice fields: `purpose`, `website section key`, `source range metadata`, `branch`, `PR metadata`, `head SHA`, `status`, `evidence`, `merged?`, `included in final validation`.
- Source PDF pages are recorded as source range metadata inside each section row, not as PR rows.
- Analyst/Architect planning branches remain planning-only unless Orchestrator explicitly assigns a later role-appropriate implementation slice.
- Additional task-slice startup: Orchestrator fetches/verifies `origin/main`, records base SHA, creates one fresh isolated worktree/branch per shared/section slice, warns about parallel work, and requires no sibling mutation.

## PR Slicing Plan

Recommended implementation sequence: one shared correction/prerequisite PR if current runtime/checkers still encode page-based pending registry, then ten section PRs.

1. Shared correction/prerequisite PR, no converted Chapter 1/2 section content:
   - replace any source-PDF-page registry assumptions with section registry entries;
   - ensure source ranges are metadata arrays/ranges inside section records;
   - ensure divider-only pages `21` and `43` are not implemented/pending learner pages;
   - update route/schema/checker terminology from page-based to section-based;
   - retain guards against runtime PDF viewer, full-page raster, duplicate `Руководство 4R`, side-by-side translation, remote assets, broad masks/plates, fake content, forbidden full-page image shortcuts, visible Spanish outside explicit official-traffic-sign exceptions, and translated/reconstructed traffic signs;
   - keep visual-evidence schema capable of multiple source regions/pages per section.
2. Section PRs, one source-`Índice` topic per PR:
   - branch from latest verified `main`, normally after the shared correction/prerequisite and any previous conflicting section PRs have merged;
   - implement only that section's content, section-local source crops/assets, section-local tests/checker fixtures, screenshot evidence, and process-memory entry;
   - update navigation from pending to implemented only for that section;
   - record merge-readiness evidence before Orchestrator finalization.

Default merge order follows source `Índice` order:

1. `ch1-cities-for-people`
2. `ch1-sustainable-mobility`
3. `ch1-pedestrian-priority`
4. `ch1-bicycle`
5. `ch1-public-transport-system`
6. `ch1-shared-trip`
7. `ch2-legal-responsibility`
8. `ch2-required-documents`
9. `ch2-incident-obligations`
10. `ch2-scoring`

Orchestrator may parallelize non-overlapping section PRs only after verifying latest-main base and conflict safety.

## Route And Navigation Approach

- Keep `Руководство` as the visible destination.
- Keep existing Introduction hashes working.
- Represent Chapter 1 and Chapter 2 as active source-`Índice` groups.
- Represent each substantive source topic as one website section page under its chapter.
- Recommended route ids are source topic ids, or stable existing aliases that map one-to-one to those ids.
- Source PDF page numbers remain metadata for source references, screenshots, crops, and tests.
- Divider-only source PDF pages `21` and `43` are not routes. Their chapter titles appear through chapter group headings and section context.
- PR #175 / `page-021` must not merge in its current divider-page form. Orchestrator should close/supersede it or route a replacement that implements a real section page and updates PR title/body/process memory accordingly.

## Content And Visual Strategy

- Start from source inspection for each section: `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, local source renders across the full section range, and official PDF when region/crop confirmation is needed.
- Use existing approved Russian translation as source material, then simplify only locally for learner clarity.
- Preserve source section order and ticket-critical detail. If a detail appears legal, numeric, safety-critical, document-related, or exam relevant, keep it unless Architect explicitly disposes it.
- Convert prose to native responsive DOM flow. Do not preserve PDF column widths when they make text cramped or force ordinary prose to scroll horizontally.
- Preserve meaningful source visuals with local crops or visually indistinguishable reconstruction. Full-page source renders are reference/extraction inputs only.
- Official traffic signs and traffic sign sheets are a controlling exception to the translation/cleanup approach: insert them source-as-is as high-quality local crops/images, with no Russian relabeling, CSS/SVG reconstruction, simplification, recoloring, cleanup, or other modification to the sign itself. Russian explanatory text may be placed outside the sign image.
- For text-bearing artwork other than official traffic signs, clean only the source text area at glyph/local-pixel level where feasible, preserve surrounding shapes/connectors/edges, and overlay selectable Russian DOM/SVG labels.
- Omit page numbers, footnote mechanics, source clutter, and book-only decoration when they do not help exam learning. Convert exam-relevant footnote substance into learner-facing notes or citations without preserving the marker as decoration.
- Record style tokens for recurring Chapter 1/2 block types: section header, two-column prose converted to responsive flow, blue/legal callout, warning/recommendation, sign/table row, pictogram figure, infographic label, legal document list, emergency checklist, contact/resource list, closing slogan.

## Infographic And Artwork Quality Gate

Every section PR has a visual gate. Sections with diagrams, signs, pictograms, tables, photos, contact/resource layouts, or infographic-like callouts require strict evidence:

- source-region/crop metadata with section id, source page number(s), region coordinates, asset path, dimensions/hash when practical, cleanup status, and visible-Spanish status or explicit official-traffic-sign source-as-is exception;
- source screenshot/reference and Russian screenshot at desktop and mobile, plus narrow/high-risk viewport when fixed visuals are present;
- bounding-box checks for label fit, no overlap, no clipping, no layout overflow, and source-like relationships;
- no generic icon replacement, redesigned diagram, broad mask, DOM plate, color-matched rectangle, clipped crop box, distorted source-piece assembly, or visible Spanish outside explicit official traffic sign source-as-is crops;
- traffic-sign evidence must prove the learner image is an unmodified high-quality source crop/image, not a translated, reconstructed, or relabeled DOM/CSS/SVG sign sheet;
- visual checker pass/fail report that names manual visual review notes, not just an AI-written summary.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| One website section page per PR | PR diff scope, `tasks.md` cycle PR set row, Review Agent scope check |
| No source-PDF-page splitting | section registry/tests, PR title/body, source range metadata |
| Divider pages skipped | content/navigation tests prove no standalone pages for source PDF pages `21` and `43` |
| Source-`Índice` hierarchy | content tests for Chapter 1/2 groups, topic placement, pending/implemented section state |
| Native Russian text | DOM tests, Playwright selection/computed-style checks, no rasterized text-only section |
| Responsive prose | Playwright desktop/narrow/mobile bounding-box checks and screenshots |
| Source-faithful visuals | visual checker metadata, source/Russian screenshots, crop hashes/regions, bounding-box checks |
| Official traffic signs source-as-is | source crop path, region/dimensions/hash, explicit exception marker for visible Spanish inside the sign image only, screenshot evidence, and tests/checker guards rejecting translated/reconstructed sign DOM |
| No forbidden runtime patterns | content tests scanning for PDF viewer, full-page raster base, side-by-side translation, remote URLs, masks/plates |
| Legal/document/detail retention | content tests or review evidence comparing source facts/numbers/obligations to Russian section content |
| Local-first runtime | `pnpm run build`, `pnpm run preflight`, Docker `make build`, isolated `make up`, browser screenshot/check, `make down` |
| Latest-main startup | Orchestrator slice assignment and Implementation Agent baseline `git status`/base evidence |
| Cycle PR set | `tasks.md` rows for shared prerequisite/correction and ten section PRs |
| Final Architect validation | Architect-owned validation notes after all PR slices appear complete |
| Final Analyst validation | Analyst-owned validation notes after Architect pass |
| Effective content head and current-head guard | matching SHA markers and Orchestrator read-only current-PR-head guard if evidence-only commits follow validation |
| Cleanup applicability and evidence/refusal | not applicable unless Orchestrator assigns Cleanup Agent |
| Return limits | Architect return count `0-10`, Analyst return count `0-5`, or escalation evidence |
| Merge gates | required checks from `.unicorn-hub/config.json`: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`, plus review/conflict/process-memory gates |

Per section recommended commands:

```bash
node scripts/manual-guide-source-fidelity.mjs
node --test tests/content-manual-guide-chapters.test.mjs
node --test tests/content-pandemia-vial-section.test.mjs
pnpm run validate:content
pnpm run test
pnpm run build
pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual|Руководство|<section-key>"
pnpm run preflight
make build
COMPOSE_PROJECT_NAME=cabadrive-030-<section-key> CABADRIVE_HOST_PORT=<free-port> make up
make down
git diff --check
```

Implementation Agent may substitute a newer focused checker/test name created by the shared correction/prerequisite PR, but must record the exact command and result.

## Cleanup Planning

- Cleanup applicability: not applicable for this planning and implementation cycle unless Orchestrator later assigns cleanup.
- Cleanup Agent assignment: not applicable.
- Approved cleanup roots: none.
- Excluded/current work: all current Orchestrator/Analyst/Architect/Implementation/Review worktrees, sibling work, root main worktree, untracked root files, active PR branches, user-owned paths, and ambiguous targets.
- Required validation: if cleanup is later assigned, Cleanup Agent must perform positive-proof validation before removal.
- Refusal conditions: current, active, dirty, untracked, unpushed, open-PR, locked, running-process, ambiguous, user-owned, out-of-root, missing-check, or PR-lookup-failure targets are preserved.
- Evidence handoff: not applicable unless Cleanup Agent is assigned.

## Risks

- Existing page-based process memory and PRs can mislead future agents. Mitigation: corrected spec/plan/tasks supersede source-PDF-page slicing and record explicit PR #175 disposition.
- Shared infrastructure may still use page-based registry concepts. Mitigation: route a shared correction/prerequisite PR before section content PRs if needed.
- Section PRs spanning many source pages are larger than page PRs. Mitigation: strict one-section scope, section-level evidence bundles, and source-range metadata.
- Visual assets may require careful crop cleanup across multiple pages. Mitigation: strict source-region metadata, screenshots, bounding-box checks, visible-Spanish gates outside official traffic sign exceptions, and source-as-is sign guards.
- Legal/document sections may be over-simplified. Mitigation: detail-retention checks and Review Agent legal/content focus.
- Shared infrastructure changes after section PRs merge can invalidate earlier visual validation. Mitigation: prerequisite-first architecture and final current-head guard.
