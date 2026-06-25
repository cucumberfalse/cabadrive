# Tasks: Evidence-Backed Ticket Placement In Руководство

## Assignment Contract

- Role for file-changing implementation: Implementation Agent, only after explicit Orchestrator assignment
- Intended slice: one isolated worktree, one branch, one PR
- Assigned base for current feature context: `origin/main` at `4247b0e90ae5799a0875cc3751c96589fef96ef2`
- Parallel work may exist. Preserve all sibling worktrees, branches, commits, PRs, dirty diffs, and process memory.
- Do not edit existing manual text/image content files. If a protected-file edit appears necessary, stop that edit and record feedback for Architect.
- Do not mark the feature complete with an unmatched or falsely classified ticket. Answer-bearing placement is preferred; a non-answer-bearing placement is permitted only as a fully audited `owner-approved-thematic-fallback` under `spec.md`.
- Current follow-up assignment target: PR `#204`, branch `codex/038-manual-ticket-placement`, current evidence-only head `f6f9484d3869c7beea957cd3458c826cb008d467`, effective content head `0f777a89450e26608b3eeda7c9198959ce576179`.
- Current process status: replacement Implementation Agent completed, verified, committed, and pushed bounded `F038-RA-004` remediation at effective content head `2cd692fe6ce076389a9ebd916753c861d681c04b`; this tasks-only evidence update follows it before fresh review, current-head checks, thread disposition, and later final role validations.

## T001 — Confirm Prerequisites And Baseline

- [x] Confirm Orchestrator assignment, worktree, branch, PR slice, and current base evidence.
- [x] Confirm `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- [x] Confirm the canonical bank has `460` distinct current IDs and record its aggregate fingerprint.
- [x] Record the initial dirty state without overwriting unrelated work.
- [x] Record the implementation start timestamp and effective base SHA below.

Evidence:

- Implementation start: `2026-06-23T22:06:01Z`
- Base SHA: `4247b0e90ae5799a0875cc3751c96589fef96ef2`
- Branch/worktree: `codex/038-manual-ticket-placement` / `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`
- Initial dirty state: only the untracked Analyst/Architect handoff directory `specs/038-manual-ticket-placement/`; no unrelated tracked or untracked work was present.
- Canonical question count: `460` records / `460` distinct IDs.
- Canonical bank fingerprint: `92ac7e7fd9fa0f2637a4b8aba0176a4e3b6b759bbc663efba2f00baeb4006709`

## T002 — Create Protected Manual-Content Baseline

- [x] Implement deterministic hashing for protected manual source files.
- [x] Inventory all existing referenced manual image paths and byte hashes.
- [x] Create `content/manual-ticket-placement/manual-content-baseline.json`.
- [x] Include schema version and assigned base SHA.
- [x] Add failure tests for source-file, text, image-path, and image-byte drift.
- [x] Confirm no protected manual content file is edited by this feature.

Protected scope includes:

- `src/data/pandemiaVialSection.ts`
- `src/data/manual-sections/*.ts`
- `src/data/manual-signs/app4SignEntries.json`
- interactive-guide section registry consumed by `manualGuide.ts`
- all existing manual image assets referenced by those sources

Evidence:

- Protected source-file count: `54`
- Referenced image count: `387`
- Aggregate source fingerprint: `10ae22d5b7759d0909adaa1436ad1a4bd5cb2caa5c2233303d1cc3d25e82d9bd`
- Aggregate image fingerprint: `dec6dbd54887b1aeb3d0d7bccd88449176fba01178ff3b616669b7f2b82c39a7`

## T003 — Implement Complete Route Eligibility Inventory

- [x] Create `content/manual-ticket-placement/manual-pages.json`.
- [x] Inventory all Introduction routes.
- [x] Inventory all implemented manual section routes.
- [x] Inventory pending and navigation-only records needed to prove exclusions.
- [x] Explicitly mark `front-presentation`, `front-categories`, and `front-glossary` ineligible.
- [x] Mark contents/index, pending, divider/title-only, closing/decorative, and navigation-only surfaces ineligible.
- [x] Record an eligibility reason, route hash, source kind, implementation status, content fingerprint, and approved review metadata for every route record.
- [x] Add inventory completeness and route-hash agreement tests.

Evidence:

- Eligible route count: `51`
- Ineligible route count: `14`
- Introduction route count: `4`
- Implemented manual section count: `50`

## T004 — Implement Exact Anchor Resolver

- [x] Resolve `introduction-segment`.
- [x] Resolve `introduction-block` and stable child text.
- [x] Resolve `manual-block`.
- [x] Resolve `manual-table-cell`.
- [x] Resolve `manual-list-item`.
- [x] Resolve `manual-card-text`.
- [x] Resolve `manual-term-translation`.
- [x] Resolve `manual-sign-entry`.
- [x] Reject missing, ambiguous, source-only, image-only, cross-page, and unsupported anchors.
- [x] Compute versioned SHA-256 anchor and page content fingerprints.
- [x] Add focused tests for every anchor kind and rejection path.

Evidence:

- Supported anchor kinds: `introduction-segment`, `introduction-block`, `manual-block`, `manual-table-cell`, `manual-list-item`, `manual-card-text`, `manual-term-translation`, `manual-sign-entry`.
- Resolver test result: current placement validation resolves and fingerprints all `460` approved relations; focused negative tests reject missing/stale anchors and cross-contract fallback drift.

## T005 — Create Reviewed Placement Shards

- [x] Create `placements/001-092.json`.
- [x] Create `placements/093-184.json`.
- [x] Create `placements/185-276.json`.
- [x] Create `placements/277-368.json`.
- [x] Create `placements/369-460.json`.
- [x] Review every canonical correct answer against existing eligible learner-visible text.
- [x] Give every ticket exactly `1..3` approved placements.
- [x] Record exact anchors and concise answer-bearing rationale for every ordinary placement.
- [x] Record every no-answer ticket as an audited `owner-approved-thematic-fallback` on the closest substantive eligible page, with full candidate/rejection evidence, owner-decision metadata, rationale, review metadata, and fresh fingerprints.
- [x] For `b-fallback-235`, use `ch2-incident-obligations` at `incident-duty-core.textRu`.
- [x] For `b-fallback-126`, use `app1-safety-elements` at `pre-driving-checks.itemsRu[0]`.
- [x] Record fresh canonical question, translation, correct-answer, image, page, and anchor fingerprints.
- [x] Use second/third placements only when each independently contains the answer.
- [x] Keep records and placements deterministically ordered.

Fallback/stop rule:

- [x] The original unmatched-ticket stops for `b-fallback-235` and `b-fallback-126` were correctly triggered under the earlier narrow contract; both are now disposed as implementable audited thematic fallbacks.
- [x] For any later no-answer ticket, complete the documented audit and select the closest substantive eligible page under the general owner rule; do not stop merely because answer-bearing text is absent.
- [x] Stop and return to Orchestrator only if no substantive thematically relevant eligible page exists. Never use support/non-content pages or edit manual/ticket content.

Evidence:

- Tickets with one placement: `460`
- Tickets with two placements: `0`
- Tickets with three placements: `0`
- Total placement relations: `460`
- Unmatched tickets: `0`
- Owner-approved thematic fallbacks: `389`; complete IDs and per-ticket audits are sealed in the reviewed shards and `content/validation/manual-ticket-placement.evidence.json`. This total includes the original explicit dispositions `b-fallback-126/F038-IA-002` and `b-fallback-235/F038-IA-001`.
- Duplicate same-ticket/same-page relations: `0`

Review disposition status:

- [x] Re-opened by `F038-RA-001`: re-audit all `460` tickets explicitly.
- [x] Audit checkpoint `001..092`: `92` audited, `20` answer-bearing, `72` fallback, `0` unresolved.
- [x] Audit checkpoint `093..184`: `92` audited, `14` answer-bearing, `78` fallback, `0` unresolved.
- [x] Audit checkpoint `185..276`: `92` audited, `11` answer-bearing, `81` fallback, `0` unresolved.
- [x] Audit checkpoint `277..368`: `92` audited, `13` answer-bearing, `79` fallback, `0` unresolved.
- [x] Audit checkpoint `369..460`: `92` audited, `13` answer-bearing, `79` fallback, `0` unresolved.
- [x] Correct known false mappings `b-fallback-003`, `b-fallback-011`, and `b-fallback-042`.
- [x] Confirm no ordinary mapping retains scorer-created approval metadata or boilerplate rationale.
- [x] Recompute audit-derived totals: `71` answer-bearing and `389` owner-approved thematic fallbacks.
- [x] Re-opened by `F038-RA-002`: re-audit all `71` current strict records under the self-sufficient-anchor gate.
- [x] Re-opened by `F038-RA-002`: re-audit all `389` fallbacks through the curated topic-routing table.
- [x] Create and review a stable ticket-topic assignment for all `460` tickets.
- [x] Create and review `content/manual-ticket-placement/topic-routes.json` for the current topic-guide taxonomy.
- [x] Record per-shard corrected-topic/page/anchor, strict-to-fallback, override, and unresolved counts.

## T006 — Add Deterministic Validator And Evidence Report

- [x] Add `scripts/content-manual-ticket-placement.mjs`.
- [x] Add `validate:manual-ticket-placement` package command.
- [x] Wire the validator into `validate:content`.
- [x] Validate current-bank coverage and reject missing/extra IDs.
- [x] Validate placement counts `1..3` and duplicate page relations.
- [x] Validate known route hashes and explicit eligibility.
- [x] Validate exact anchor existence, uniqueness, page ownership, and learner visibility.
- [x] Validate `placementBasis: "answer-bearing"` and answer-bearing rationale for every preferred placement.
- [x] Validate every `owner-approved-thematic-fallback` has a documented no-answer audit, exact closest-topic anchor, candidate/rejection evidence, owner decision `2026-06-23`, approved review, and fresh canonical/anchor/page fingerprints.
- [x] Validate exact approved destinations/anchors for `F038-IA-001` and `F038-IA-002`.
- [x] Reject fallback without documented audit, on support/ineligible/non-substantive pages, with arbitrary selection, alternate approved anchor, missing/stale evidence, or manual/ticket mutation.
- [x] Validate all review statuses.
- [x] Validate canonical question, translation, correct-answer, and image integrity.
- [x] Validate anchor/page fingerprint freshness.
- [x] Validate protected manual-content immutability.
- [x] Validate deterministic shards/index/evidence freshness.
- [x] Create `content/validation/manual-ticket-placement.evidence.json`.
- [x] Add focused validator tests for every required failure mode.

Required zero counters:

- unknown tickets
- unknown pages
- route mismatches
- ineligible placements
- missing/ambiguous anchors
- stale question/translation/answer/image fingerprints
- stale anchor/page fingerprints
- duplicate same-page placements
- unreviewed tickets/placements
- zero-placement tickets
- over-three-placement tickets
- protected manual-content changes
- unauthorized or malformed thematic fallbacks

Evidence:

- Validator summary after `F038-RA-001`: `460 questions / 460 placements / 34 destinations / density 1/11/44 / 71 answer-bearing / 389 fallback`; all required error counters `0`.
- Focused test result: `4/4` Node tests passed; malformed fallback, support destination, stale anchor/canonical evidence, and alternate approved fallback destination are rejected.

Review disposition status:

- [x] Re-opened by `F038-RA-001`: remove generator/scorer authority to create or overwrite approvals, placement basis, rationale, or reviewer metadata.
- [x] Add candidate-only stdout output separate from committed reviewed shards.
- [x] Add immutable `reviewed-manifest.json` binding all `460` reviewed records and five shard hashes.
- [x] Make regeneration preserve reviewed mappings and fail on absent/stale reviewed source or manifest.
- [x] Reject generic boilerplate rationale and reserved/synthetic generator reviewer metadata.
- [x] Reject the three known false fixture mappings.
- [x] Remove the hard-coded exact-two fallback gate and validate audit-derived fallback IDs/count.
- [x] Document and test the limits of automated semantic validation.
- [x] Validate and manifest-seal the curated topic-routing table and all ticket-topic assignments.
- [x] Reject strict records without an exact self-sufficient anchor, direct-answer assertion, and distractor-aware rationale.
- [x] Reject fallback destinations/anchors outside the assigned topic route and reject unreviewed overrides.
- [x] Add regressions for `003`, `011`, `037`, `042`, `064`, `085`, `096`, `165`, `202`, `281`, `349`, `350`, `404`, and `431`, plus representative headrest/neck-injury routing.

## T007 — Add Typed Runtime Placement Index

- [x] Add typed placement data definitions.
- [x] Assemble reviewed shards deterministically.
- [x] Create `placementsByPageId`.
- [x] Join only by canonical `questionId`.
- [x] Ensure mapping data cannot override canonical text, answer order, correct answer, translations, image, difficulty, or source status.
- [x] Add runtime-index equality tests against reviewed shards.

Evidence:

- Runtime index path: `src/data/manualTicketPlacement.ts`
- Runtime index test result: deterministic ordering/source assertion passed; mapping projection contains IDs/routes only and no canonical prose or answer fields.

## T008 — Extract Shared Read-Only Canonical Ticket Renderer

- [x] Extract shared canonical display behavior from `TopicGuideTicketBlock`.
- [x] Keep a thin `Материалы` adapter with existing topic-specific explanations/conflict notes.
- [x] Add a thin `Руководство` adapter using canonical governed stores.
- [x] Preserve Spanish question/answer order and language boundaries.
- [x] Preserve Russian question/answer translations.
- [x] Preserve canonical local image rendering and add/retain lazy loading.
- [x] Preserve difficulty, correct-answer badge, explanation, source status, and footer truth.
- [x] Keep `Руководство` read-only.
- [x] Add `Материалы` regression tests.

Evidence:

- Shared component path: `CanonicalStudyTicketBlock` in `src/App.tsx`
- `Материалы` regression result: focused and full Playwright suites passed; existing adapter and topic-specific explanations remain intact.

## T009 — Append Ticket Areas After Existing Route Content

- [x] Add `ManualTicketAppendix`.
- [x] Append it after the existing flow in `PandemiaVialPrototypeView`.
- [x] Append it after the existing flow in `IntroductionArticleView`.
- [x] Append it after the existing flow in `ManualGuideSectionContentView`.
- [x] Do not insert ticket data into existing manual block arrays.
- [x] Do not render appendices on ineligible routes.
- [x] Sort ticket cards by canonical question ID.
- [x] Add deterministic ordering/DOM-position tests proving the appendix follows the last existing block.

Evidence:

- Route renderers changed: three additive route-end sibling appendices in `src/App.tsx`; protected content arrays/modules unchanged.
- Appendix-order test result: Playwright confirms appendix follows the protected manual article; moving it outside the protected article also preserves legacy source-image audits.

## T010 — Implement Density And Performance Behavior

- [x] Always show appendix heading and exact ticket count.
- [x] Define and document deterministic low/medium/high density thresholds.
- [x] Use native accessible disclosure for medium/high density.
- [x] Do not mount hidden rich ticket cards while disclosure is closed.
- [x] Render all mapped tickets after opening.
- [x] Keep keyboard access and browser find usable after opening.
- [x] Keep images local and lazy.
- [x] Prevent document-level horizontal overflow.
- [x] Record min/median/max destination density and highest-density route.

Evidence:

- Density thresholds: direct render `1..6`; native collapsed disclosure `7+`.
- Minimum/median/maximum: `1 / 11 / 44`.
- Highest-density page: `ch3-right-of-way` (`44` tickets).
- Closed mounted-card count: `0`.
- Expanded mounted-card count: `44`; `F038-IA-003` adds direct regression evidence that navigation from this open disclosure to dense `app1-safety-elements` creates a closed destination disclosure with `0` mounted cards.

## T011 — Update Durable Documentation

- [x] Update frontend docs with the `Руководство` ticket appendix, canonical data join, route-end rule, and density behavior.
- [x] Update backend docs with mapping files, validator command, fingerprints, evidence report, and failure contract.
- [x] Do not change unrelated documentation.

Evidence:

- Docs changed: `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`.

## T012 — Focused Browser Verification

- [x] Start an isolated Docker compose project on a free port.
- [x] Verify one substantive Introduction route on desktop and mobile.
- [x] Verify one ordinary chapter route on desktop and mobile.
- [x] Verify one Appendix IV sign route on desktop and mobile.
- [x] Verify an image-backed ticket uses its canonical local image.
- [x] Verify low-, medium-, and highest-density routes.
- [x] Verify dense appendix closed and opened states.
- [x] Verify a direct route-hash deep link.
- [x] Verify `Материалы` remains unchanged in behavior.
- [x] Assert appendix DOM position follows the last pre-existing block.
- [x] Assert no document-level horizontal overflow.
- [x] Capture screenshots and machine-readable Playwright evidence.
- [x] Stop only the assigned isolated compose project.

Evidence:

- Remediation compose project/port: `cabadrive-038-ra001` / `5186`.
- Introduction fixture: `intro-incident`.
- Chapter fixtures: maximum-density `ch3-right-of-way` and fallback route `app1-safety-elements`.
- Sign fixture: `app4-signs-regulatory`, desktop/mobile.
- Image-backed ticket: `b-fallback-126`, canonical local `/content/assets/questions/...` image with `loading="lazy"`.
- Density fixtures: minimum/median/maximum `1/11/44`; maximum route opens `44` canonical ticket cards without horizontal overflow.
- Browser evidence: focused Playwright `6/6`; full Playwright `88/88`; in-app Docker UI verified `44` opened cards, `b-fallback-126` Spanish/correct-answer/local-lazy-image rendering, no horizontal overflow, and zero browser console errors.
- Docker evidence: isolated `make build` passed, `make up` exposed `http://127.0.0.1:5186`, browser QA passed, and `make down` removed only `cabadrive-038-ra001`.

## T013 — Run Full Verification

- [x] `pnpm run validate:manual-ticket-placement`
- [x] `pnpm run validate:content`
- [x] `pnpm run test`
- [x] `pnpm run build`
- [x] focused Playwright manual-ticket spec
- [x] `pnpm run test:e2e`
- [x] `pnpm run preflight`
- [x] `git diff --check`
- [x] Confirm protected manual content remains unchanged.
- [x] Confirm all acceptance counters are zero/current on the final implementation head.

Evidence:

- Remediation verification completed at `2026-06-24T04:09:42Z`.
- Commands and results: reviewed-shard preservation across `generate:manual-ticket-placement --write`; validator pass (`460/460`, `71` answer-bearing, `389` audited fallbacks); content validation pass; `458/458` unit/content tests; build pass; focused Playwright `6/6`; full Playwright `88/88`; CI-mode `pnpm run preflight` pass; isolated Docker build/up/browser/down pass; OSV `No issues found`; `git diff --check` pass.
- Protected baseline: `54` source files and `387` referenced images unchanged; canonical questions/translations/explanations unchanged; all validator counters remain `0`.
- Prior effective implementation/content head `7dc2e9c56c83fc3ce431fd10cbd2961bcf815c22` is stale.
- Remediation effective content head: `c956422ee159fde4ed1825b5806b3336515b7372`.

Review disposition status:

- [x] Re-opened by `F038-RA-001`; all prior semantic validator and completion evidence is stale.
- [x] Re-run full verification after the `460/460` re-audit and validator changes.
- [x] Record a new effective content head.

## T014 — Process Memory And Handoff

- [x] Record changed files and why.
- [x] Record semantic review counts and dense-page metrics.
- [x] Record dead ends and known issues.
- [x] Record all Implementation Agent feedback for Architect disposition.
- [x] Confirm every recorded feedback item has Architect disposition. `F038-IA-003` is disposed as a blocking implementation task.
- [x] Complete and verify the `F038-IA-003` dense-disclosure reset task before readiness.
- [x] Commit, push, and open the ready PR only if Orchestrator assigned those actions.
- [x] Do not merge.

Publication evidence:

- Branch: `codex/038-manual-ticket-placement`.
- Prior implementation/content commit `7dc2e9c56c83fc3ce431fd10cbd2961bcf815c22` is stale.
- Remediation effective content commit: `c956422ee159fde4ed1825b5806b3336515b7372`.
- Ready PR: `#204` — `https://github.com/cucumberfalse/cabadrive/pull/204`.
- Merge performed by Implementation Agent: `no`.

Final changed-file groups:

- `content/manual-ticket-placement/**`, `content/validation/manual-ticket-placement.evidence.json`: governed route inventory, protected baseline, five reviewed mapping shards, deterministic evidence.
- `scripts/manual-ticket-placement-lib.mjs`, `scripts/content-manual-ticket-placement.mjs`, `package.json`: generator/validator, fallback contract, commands, content-gate integration.
- `src/data/manualTicketPlacement.ts`, `src/App.tsx`, `src/styles.css`: deterministic runtime index, shared canonical renderer, route-end appendices, density behavior.
- `tests/manual-ticket-placement.test.mjs`, `tests/e2e/manual-ticket-placement.spec.ts`: negative validator coverage and desktop/mobile runtime evidence.
- `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`: durable runtime and validation contract.
- `specs/038-manual-ticket-placement/**`: intake, architecture, dispositions, and current implementation evidence.

Review disposition status:

- [x] `F038-RA-001` implemented with `71/389` re-audit evidence.
- [x] Replace stale current `458/2` and merge-readiness claims with re-audit results; retained occurrences are labeled historical where needed.
- [x] Complete and locally verify `F038-IA-003`; commit/push evidence is recorded in its resolution section.
- [ ] Obtain fresh Review Agent review on the remediation head.
- [ ] Do not perform final Architect validation until the fresh review and all checks pass.

Changed files at blocker handoff:

- `specs/038-manual-ticket-placement/tasks.md`: recorded prerequisite/baseline evidence, both unmatched-ticket audits, and their Architect dispositions.
- `scripts/manual-ticket-placement-lib.mjs`: partial deterministic corpus loader, anchor inventory, fingerprint/baseline utilities, candidate-generation support, and validation helpers. Candidate ranking is not completion evidence.
- `scripts/content-manual-ticket-placement.mjs`: partial generator/validator entrypoint; currently exits non-zero because `b-fallback-126` has zero placements.
- `content/manual-ticket-placement/manual-content-baseline.json`: protected-source/image baseline from the assigned base.
- `content/manual-ticket-placement/manual-pages.json`: route eligibility inventory.
- `content/manual-ticket-placement/placements/*.json`: provisional candidate records for `459` tickets only; `b-fallback-126` is intentionally absent. These records have not completed the required end-to-end semantic review and must not be treated as merge-ready evidence.
- `content/validation/manual-ticket-placement.evidence.json`: intentionally red evidence with `zeroPlacementTickets: 1`.

No product UI/runtime code, canonical ticket content, protected manual source, protected manual image, test, commit, push, or PR was created after the blocker was confirmed.

Architect owner-decision disposition update on `2026-06-23`:

- `spec.md`: defines the general audited thematic-fallback schema, validator contract, acceptance criteria, negative tests, and exact dispositions for `b-fallback-235` and `b-fallback-126`.
- `plan.md`: replaces repeated owner-decision stops with the general fallback workflow and exact implementation instructions for both known no-answer tickets.
- `tasks.md`: converts `F038-IA-001` and `F038-IA-002` into implementable tasks with selected pages/anchors and required verification.
- Product code/content/tests/docs changed by Architect: `no`.

## Historical Acceptance Evidence Summary — Superseded By F038-RA-001

- Canonical questions: `460`
- Total placements: `460`
- Questions with 1 / 2 / 3 placements: `460 / 0 / 0`
- Eligible / ineligible routes: `51 / 14`
- Historical claimed answer-bearing / owner-approved thematic fallback placements: `458 / 2`
- Unknown/ineligible/duplicate/unreviewed/stale/zero/over-three/malformed-fallback counters: all `0`.
- Protected content status: unchanged; `git diff` over the protected source corpus is empty.
- Highest-density route: `ch1-bicycle`, `30`; closed/open mounted cards `0/30`; no horizontal overflow.
- Browser fixtures: `intro-road-pandemic`, `ch1-bicycle`, `app1-safety-elements`, `app4-signs-regulatory`, `b-fallback-126`, and `Материалы`.
- Full verification result: all repository validators/tests/build/browser suites pass. Docker-only build remains unavailable because Docker Hub failed to provide uncached base images; this is recorded as external infrastructure evidence rather than hidden.
- PR/head: pending publication; implementation base `4247b0e90ae5799a0875cc3751c96589fef96ef2`.

Review correction:

- The summary above is historical implementation evidence and is not accepted semantic completion evidence.
- Blocking Review Agent finding `discussion_r3464034934` proved the ordinary mappings were scorer-generated and auto-approved.
- Historical `F038-RA-001` semantic counts, now rejected by review `4561846977`: `71` answer-bearing / `389` owner-approved thematic fallbacks.
- Historical pre-`F038-RA-002` runtime density: `34` destination routes, minimum/median/maximum `1/11/44`; these values must be recomputed after rerouting.
- Current merge readiness: `blocked by review 4561846977 pending F038-RA-002 implementation, fresh review, required checks, resolved blocking threads, and final role validations`.

## Dead Ends

Record attempted approaches that were rejected, including why they violated relevance, canonical reuse, protected-content, or density requirements.

- The first replacement-IA regeneration exposed stale generator logic added after the prior evidence run: it reclassified `424` relations as generic auto-generated thematic fallbacks (`36/424`) and reduced destinations to `37`. That output was rejected because it still manufactured review outcomes from lexical ranking. `F038-RA-001` replaced this path with immutable reviewed shards and a candidate-only scorer.
- Automated lexical candidate ranking is useful only for surfacing candidate pages. It cannot authorize answer-bearing or fallback status; every one of the current `71/389` relations has committed ticket-specific review evidence.
- `b-fallback-235` has no answer-bearing anchor. The owner approved the closest-topic fallback; this dead end remains recorded so it is never misrepresented as answer-bearing evidence.
- `b-fallback-126` has no answer-bearing anchor in the protected Руководство corpus. The nearest maintenance text names oil among fluids to check, but never states that a combustion engine is lubricated by motor oil and cannot identify canonical image option C. The provisional automated candidate was rejected and the ticket was deliberately left unmatched.

## Known Issues

- Current accepted fallbacks total `389`; none may be represented as answer-bearing.
- The owner decision is general for audited no-answer tickets, while every selected page/anchor remains ticket-specific and evidence-bound. `b-fallback-235` and `b-fallback-126` retain their original explicit dispositions.
- A future no-answer ticket is not automatically a blocker when a substantive thematic eligible page exists.
- The remaining hard-stop case is absence of any substantive thematically relevant eligible page.

## Implementation Agent Feedback

Every item must be routed by Orchestrator to Architect for `task`, `ticket`, or explicit `not-needed` disposition.

### Feedback template

- ID:
- Type: `unmatched-ticket` | `architecture-divergence` | `improvement` | `blocker`
- Question ID, if applicable:
- Canonical Spanish question:
- Canonical correct answer:
- Candidate pages and anchors reviewed:
- Why each candidate failed:
- Proposed disposition:
- Manual content changed: `no`
- Status: `open`

### F038-IA-001

- ID: `F038-IA-001`
- Type: `unmatched-ticket`
- Question ID, if applicable: `b-fallback-235`
- Canonical Spanish question: `En caso de participar de un siniestro vial, ¿de cuánto tiempo se dispone para dar aviso sobre el hecho a la compañía aseguradora del vehículo?`
- Canonical correct answer: `72 horas.`
- Candidate pages and anchors reviewed:
  - `ch2-incident-obligations`, block `data-to-collect`, item `0`: `По транспортным средствам: номер, марка, модель, цвет, страховая компания, номер полиса и имя владельца.`
  - `ch2-incident-obligations`, block `data-to-collect`, item `2`: `По застрахованному лицу, если это не водитель на момент инцидента: имя, DNI, адрес и телефон.`
  - `ch2-incident-obligations`, block `follow-up-duties`, item `1`: `Если произошло столкновение с припаркованным транспортным средством и владелец неизвестен, нужно оставить личные данные, данные транспортного средства, лицензии и обязательной страховки в безопасном и хорошо закрепленном месте.`
  - `ch2-required-documents`, block `insurance-vtv-rva`, item `1`: `Обязательная страховка защищает пострадавших в дорожных инцидентах и гарантирует возмещение за вред, причиненный третьим лицам, перевозимым или не перевозимым.`
  - `ch2-required-documents`, block `insurance-vtv-rva`, item `2`: `Для подтверждения страховки обязательно иметь certificado del seguro de responsabilidad civil независимо от дороги, по которой движется транспорт.`
  - `ch2-legal-responsibility`, block `civil-criminal-responsibility`, items `0` and `1`: civil compensation and insurer liability are described, but no insurer-notification procedure or deadline is stated.
- Why each candidate failed:
  - The incident page identifies data to collect and duties at/after the scene, but does not state that the insurer must be notified within `72` hours or any other deadline.
  - The required-documents page explains the purpose and mandatory proof of insurance, but does not state a post-incident notification deadline.
  - The legal-responsibility page explains compensation and insurer liability, but does not state where, when, or within how many hours the insurer must be notified.
  - A repository-wide search of the protected learner-visible manual corpus found no textual occurrence of `72 horas`, `72 часа`, or an equivalent three-day insurer-notification rule. Numeric `72` occurrences are source geometry, hashes, page numbers, or unrelated asset metadata and cannot answer the ticket.
- Proposed disposition: Architect must record the conflict between mandatory all-ticket coverage and the prohibition on adding manual prose. Route to the owner-decision blocker described by the spec unless a currently overlooked existing learner-visible answer-bearing anchor can be identified without changing protected content.
- Manual content changed: `no`
- Status: `disposed — task; owner-approved exception, implementation may resume`

### F038-IA-002

- ID: `F038-IA-002`
- Type: `unmatched-ticket`
- Question ID, if applicable: `b-fallback-126`
- Canonical Spanish question: `¿Con qué se lubrica un motor?`
- Canonical correct answer: `Opción C.`; the governed image/explanation identifies option C as a canister of motor oil.
- Candidate pages and anchors reviewed:
  - `app1-safety-elements`, block `pre-driving-checks`, item `0` (`itemsRu`): `Масло, охлаждающую жидкость и жидкость стеклоомывателя.`; a pre-driving operating-fluid checklist, not a statement that motor oil lubricates the engine and not enough to identify image option C.
  - `app1-safety-elements`, block `luggage-and-load` and adjacent vehicle-maintenance blocks: no engine-lubrication rule.
  - `ch5-anticipatory-efficient-driving`, block `efficient-driving-measures`, item `Проверять состояние тормозов и чистоту воздушного, масляного и топливного фильтров.`: mentions an oil filter, but not what lubricates the engine and not image option C.
  - `app3-social-responsibility`, maintenance item `Проверить тормоза и уровни жидкостей: воду, масла, жидкость или давление воздуха в тормозной системе.`: names oil as a level to check, but does not state the answer-bearing lubrication relationship.
  - all other eligible Introduction/manual routes and Appendix IV sign labels were searched for Russian/Spanish forms of engine, lubrication, oil, `motor`, `lubricar`, and `aceite`; no learner-visible text states that the engine is lubricated by motor oil.
- Why each candidate failed:
  - The canonical answer is image-dependent and opaque (`Opción C.`). A valid anchor must state the fact needed to identify the pictured oil can as the correct lubricant.
  - Existing pages mention oil only as a checked fluid or filter category. They do not say that motor oil lubricates engine components.
  - A thematic placement requires the general owner-approved fallback evidence and cannot be presented as answer-bearing.
- Proposed disposition: apply the general owner rule to the closest substantive maintenance page, preserving the complete candidate/rejection audit.
- Manual content changed: `no`
- Status: `disposed — task; audited thematic fallback approved, implementation may resume`

### F038-IA-003

- ID: `F038-IA-003`
- Type: `improvement`
- Source: active Review Agent inline finding `https://github.com/cucumberfalse/cabadrive/pull/204#discussion_r3464076641`, thread `PRRT_kwDOSX65IM6LxRUf`
- Description: the dense-page native `<details>` element in `src/App.tsx` is uncontrolled. If a learner opens it and then navigates to another dense manual page, React may preserve the disclosure's `open` state because the element is reused across `pageId` changes.
- Current evidence: the existing route-transition E2E assertion covers the initial closed state but does not dispose the active review finding about an already-open disclosure surviving navigation.
- Proposed disposition: Architect must classify this as a task, ticket, or explicit not-needed decision. If accepted as a task, key or control the disclosure by `pageId` and add a regression that opens one dense appendix before navigating to another.
- Scope decision: not implemented in `F038-RA-001` because the finding is outside the assigned semantic-audit/generator/validator repair and has no Architect disposition. `src/App.tsx` remains unchanged by this remediation.
- Manual content changed: `no`
- Status: `implemented and locally verified; review thread intentionally left unresolved for Orchestrator/fresh Review Agent`

## Architect Dispositions

### F038-IA-001 — `task`

- Disposition date: `2026-06-23`
- Disposition type: `task`
- Owner decision date: `2026-06-23`
- Owner decision reference: `feature-038-owner-decision-2026-06-23`
- Owner decision: `«Добавь билет на наиболее близкую по теме страницу, несмотря на то, что нет явного текста про 72 часа. Не меняй при этом текст руководства или текст билета»`.
- Independent verification scope:
  - canonical `b-fallback-235` question, all three answer options, and `correctAnswerId`;
  - all four Introduction routes from `introductionNavigation`;
  - all `50` implemented manual-section content objects assembled by `implementedManualGuideSections`;
  - learner-visible rendering paths in `IntroductionArticleBlockView` and `ManualGuideSectionContentView`, confirming `sourceTextEs` metadata is not rendered as page prose;
  - exact/equivalent deadline searches for `72 horas`, `72 часа`, written-out seventy-two, `tres días`, `3 días`, Russian three-day forms, and insurer-notification/deadline combinations.
- Verification result:
  - no existing learner-visible Руководство text states that the vehicle insurer must be notified within `72` hours or an exact equivalent;
  - `ch2-incident-obligations` mentions necessary reports, insurance-company/policy data, and post-incident duties without a deadline;
  - `ch2-required-documents` explains insurance purpose/proof without a post-incident deadline;
  - `ch2-legal-responsibility` explains liability without a notification deadline;
  - repository occurrences in canonical ticket data, governed translations/explanations, topic-study `Материалы`, source trace, specs, and learning-image metadata are outside the existing learner-visible Руководство corpus and are not valid anchors.
- Accepted page: `ch2-incident-obligations`.
- Accepted exact thematic anchor:
  - kind: `manual-block`
  - block ID: `incident-duty-core`
  - text path: `textRu`
  - text: `При дорожном инциденте водитель обязан остановиться сразу, безопасно обозначить место, предоставить данные и выполнить необходимые сообщения. Эти обязанности существуют независимо от того, насколько небольшим кажется ущерб.`
- Selection rationale: this anchor is the closest substantive existing context because it directly concerns mandatory conduct after a road incident and explicitly mentions necessary notifications/messages. It is closer to the ticket's post-incident notification action than `ch2-required-documents`, which concerns insurance proof/purpose, or `ch2-legal-responsibility`, which concerns liability. It does not contain or imply the `72`-hour answer and must not be labeled answer-bearing.
- Implementation instruction:
  1. add exactly one placement for `b-fallback-235` on the accepted page/anchor;
  2. mark it `placementBasis: "owner-approved-thematic-fallback"`;
  3. record `auditId: "F038-IA-001"`, the owner decision date/reference above, no-answer/candidate-rejection audit, thematic rationale, and approved review metadata;
  4. generate fresh canonical question, translation, correct-answer, image, exact-anchor, and page-content fingerprints;
  5. keep canonical Spanish/Russian ticket content, correct answer `72 horas.`, existing manual text/images, and protected files unchanged;
  6. make the validator fail for missing audit evidence, alternate Architect-approved page/anchor, ineligible/support destination, arbitrary selection, missing/stale evidence, or protected/canonical content mutation;
  7. resume the remaining implementation tasks and maintain `460/460` coverage.
- Formal result: prior blocker is resolved as an implementable task under the general owner-approved thematic fallback rule.
- Manual/product code/content/tests/docs changed by Architect: `no`.
- Final Architect validation performed: `no`.

### F038-IA-002 — `task`

- Disposition date: `2026-06-23`
- Disposition type: `task`
- Owner decision date: `2026-06-23`
- Owner decision reference: `feature-038-owner-decision-2026-06-23`
- General owner rule: when a good-faith audit finds no answer-bearing anchor, place the canonical ticket on the closest substantive eligible page by topic without changing manual or ticket content.
- Verification result: no learner-visible manual text states that motor oil lubricates a motor or independently identifies image option C.
- Accepted page: `app1-safety-elements`.
- Accepted route hash: `#manual-section-app1-safety-elements`.
- Accepted exact thematic anchor:
  - kind: `manual-list-item`
  - block ID: `pre-driving-checks`
  - item index: `0`
  - text path: `itemsRu`
  - text: `Масло, охлаждающую жидкость и жидкость стеклоомывателя.`
- Selection rationale: this is the closest substantive page because it is a direct pre-driving vehicle-maintenance checklist and explicitly identifies oil among operating fluids. `ch5-anticipatory-efficient-driving` mentions only oil-filter cleanliness in an efficiency context; `app3-social-responsibility` lists mixed professional inspection fluids, including braking-system media, and is less specific to ordinary engine-compartment maintenance.
- Implementation instruction:
  1. add exactly one placement for `b-fallback-126` on the accepted page/anchor;
  2. set `placementBasis: "owner-approved-thematic-fallback"` and `auditId: "F038-IA-002"`;
  3. record the common owner decision date/reference, complete no-answer search, all candidate anchors and rejection reasons, and the selection rationale above;
  4. add approved ticket/placement review metadata and fresh canonical question, translation, correct-answer, image, exact-anchor, and page-content fingerprints;
  5. preserve canonical Spanish/Russian ticket text, image option C and correct-answer identity, existing manual text/images, and all protected files;
  6. update validator/tests so this record and future fully audited thematic fallbacks are valid and separately reported, while fallback without documented no-answer evidence fails;
  7. resume semantic review without stopping on later no-answer tickets when a substantive thematic eligible page exists.
- Formal result: `F038-IA-002` hard stop is removed. Stop only if no substantive thematically relevant eligible page exists.
- Manual/product code/content/tests/docs changed by Architect: `no`.
- Final Architect validation performed: `no`.

### F038-IA-003 — `task`

- Disposition date: `2026-06-24`
- Disposition type: `task`
- Source: active Review Agent inline finding `https://github.com/cucumberfalse/cabadrive/pull/204#discussion_r3464076641`, thread `PRRT_kwDOSX65IM6LxRUf`
- Current verified worktree/PR head at disposition: `2688192e36815cf81741882ebda68f29f3ca1030`
- Remediation effective content head before this follow-up: `c956422ee159fde4ed1825b5806b3336515b7372`
- Evidence-only head before this follow-up: `2688192e36815cf81741882ebda68f29f3ca1030`
- Independent confirmation:
  - `src/App.tsx` resets React `expanded` state in a `pageId` effect;
  - dense appendices use an uncontrolled native `<details>` without `open` control or a `pageId` key;
  - React may reuse that native node across dense `pageId` changes and preserve browser-owned `open` state;
  - the existing E2E opens the `44`-ticket source appendix and checks zero cards after navigating to the `26`-ticket destination, but does not assert that the destination disclosure is natively closed.
- Formal disposition: accepted as a blocking implementation task because stale native disclosure state violates the intended closed-by-default density behavior and creates an avoidable extra-click state.
- Exact implementation:
  1. edit `src/App.tsx` only within the dense `ManualTicketAppendix` branch to add `key={pageId}` to `<details className="manual-ticket-disclosure">`;
  2. retain native `<details>/<summary>` semantics, `onToggle`, the `pageId` reset effect, conditional `{expanded && ...}` card mounting, the direct-render limit, ticket ordering, and lazy-image behavior;
  3. extend the first test in `tests/e2e/manual-ticket-placement.spec.ts`: after opening `ch3-right-of-way` and observing `44` mounted cards, navigate to `app1-safety-elements`, assert its disclosure has no `open` attribute, and assert zero mounted `.materials-ticket` cards;
  4. run focused Playwright for `tests/e2e/manual-ticket-placement.spec.ts`, then the repository-required validation/preflight checks assigned by Orchestrator;
  5. record exact command results and the new effective content head in this file.
- Allowed implementation files:
  - `src/App.tsx`
  - `tests/e2e/manual-ticket-placement.spec.ts`
  - `specs/038-manual-ticket-placement/tasks.md` for Implementation Agent evidence
- Acceptance evidence:
  - source dense appendix opens and mounts all `44` cards;
  - destination dense appendix reports `26` tickets;
  - destination native `<details>` lacks the `open` attribute;
  - destination appendix contains zero mounted ticket cards;
  - native disclosure accessibility and density behavior are preserved;
  - focused and required checks pass.
- Staleness rule: any UI/test implementation commit creates a new effective content head. Prior review/final-validation evidence for both `c956422ee159fde4ed1825b5806b3336515b7372` and evidence-only `2688192e36815cf81741882ebda68f29f3ca1030` cannot authorize merge after that change.
- Architect return count at the historical `F038-IA-003` disposition: unchanged at `1 / 10`; the later `F038-RA-002` return raises the current count to `2 / 10`.
- Manual/product code/content/tests changed by Architect: `no`; only Architect-owned feature memory changed.
- Final Architect validation performed: `no`.

### F038-RA-001 — `task`

- Disposition date: `2026-06-24`
- Disposition timestamp: `2026-06-24T01:51:11Z`
- Disposition type: `task`
- Source: blocking Review Agent inline finding `https://github.com/cucumberfalse/cabadrive/pull/204#discussion_r3464034934`, review `4558439368`
- Reviewed head named by finding: `77669a15fafa4c9d9b47dfecabdb33dcbd6cb442`
- Current verified PR/worktree head at disposition: `917c43618a25be13ff9b51f9319af84cdd24cb64`
- Independent confirmation:
  - generator ranks anchors and commits `ranked[0]`;
  - generator creates ticket/placement `approved` metadata and `answer-bearing` basis;
  - validator accepts generic `канонический правильный ответ` boilerplate;
  - `--write` overwrites committed shards from scorer output;
  - false committed mappings for `b-fallback-003`, `b-fallback-011`, and `b-fallback-042` resolve exactly as reported by Review Agent.
- Formal disposition: accepted as a blocking implementation task. The defect is systemic across the claimed `458` ordinary placements.
- Required implementation task:
  1. refactor scoring to candidate-only output with no approval/write authority;
  2. establish committed reviewed shards plus immutable reviewed manifest as the sole approved source;
  3. sequentially re-audit all `460` tickets across the five existing range shards;
  4. store exact anchor text and ticket-specific rationale for answer-bearing mappings;
  5. use the general owner-approved thematic fallback only after a real no-answer audit; allow the final fallback count to exceed `2`;
  6. correct known false fixtures without treating them as the complete defect set;
  7. add validator/tests for boilerplate rationale, synthetic/reserved reviewer metadata, scorer-generated approvals, stale/missing manifest evidence, overwrite attempts, known false fixtures, and dynamic fallback count;
  8. regenerate derived evidence and rerun all required checks/browser verification;
  9. obtain fresh Review Agent review before any final validation.
- Allowed implementation files:
  - `content/manual-ticket-placement/manual-pages.json`
  - `content/manual-ticket-placement/manual-content-baseline.json` only if deterministic schema/provenance requires it; protected content hashes must remain unchanged
  - `content/manual-ticket-placement/placements/*.json`
  - new `content/manual-ticket-placement/reviewed-manifest.json`
  - candidate-only generated evidence under `content/manual-ticket-placement/` only if it cannot be mistaken for approved source
  - `content/validation/manual-ticket-placement.evidence.json`
  - `scripts/content-manual-ticket-placement.mjs`
  - `scripts/manual-ticket-placement-lib.mjs`
  - `tests/manual-ticket-placement.test.mjs`
  - `package.json` only for command wiring required by this remediation
  - `docs_project/project/backend/backend-docs.md` and `docs_project/project/frontend/frontend-docs.md` only to correct the durable reviewed-mapping/generator contract
  - `specs/038-manual-ticket-placement/tasks.md` for IA evidence/feedback
  - runtime files only if schema changes require a minimal compatible projection; no protected manual or canonical ticket content files
- Forbidden files/actions:
  - existing manual prose/image content and canonical question/translation/explanation/image files;
  - unrelated product behavior;
  - commit/push/PR/merge by Architect;
  - final Architect or Analyst validation during remediation disposition.
- Review acceptance evidence:
  - `460/460` ticket audit ledger with five completed range checkpoints;
  - exact anchor text plus ticket-specific rationale or complete fallback audit for every committed placement;
  - immutable manifest covering every record and shard;
  - proof generator/scorer cannot create/overwrite approvals or reviewed mappings;
  - known false fixtures corrected and negative-tested;
  - no generic rationale or synthetic/reserved reviewer metadata;
  - dynamic answer-bearing/fallback counts from the audit;
  - protected manual/canonical content unchanged;
  - full validator/test/build/browser/preflight evidence on the new head;
  - fresh Review Agent result with the blocking thread resolved or outdated.
- Recommended implementation assignment: one Implementation Agent in the existing feature worktree/branch/PR, working sequentially through the five shards. Do not assign multiple writing agents to this branch. If Orchestrator chooses separate parallel slices, each must start from latest verified `main` in its own worktree/branch/PR and include an explicit integration plan; this is not recommended because shared generator/manifest/evidence files make the slices non-independent.
- Post-review staleness: all product/mapping/validator/test/doc changes required here make prior review and effective-content evidence stale. A new effective content head and fresh review are mandatory.
- Manual/product code/content/tests/docs changed by Architect: `no`; only Architect-owned feature memory changed.
- Final Architect validation performed: `no`.

### F038-RA-001 Implementation Agent resolution

- Implementation date: `2026-06-24`.
- Role/worktree/PR: Implementation Agent; `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`; branch `codex/038-manual-ticket-placement`; PR `#204`.
- Parallel-work preservation: the three local Architect-owned artifact changes present at assignment were preserved and included; no sibling work or protected content was reset.
- Audit method: inspected canonical question, Russian translation, correct answer, explanation/image context, destination, and exact visible anchor for all `460` tickets. Candidate ranking was used only to surface options. A second conservative pass moved every uncertain relationship to the owner-approved thematic fallback class.
- Shard results:
  - `001..092`: `92 / 20 answer-bearing / 72 fallback`;
  - `093..184`: `92 / 14 / 78`;
  - `185..276`: `92 / 11 / 81`;
  - `277..368`: `92 / 13 / 79`;
  - `369..460`: `92 / 13 / 79`.
- Final totals: `460` questions, `460` relations, placement-count distribution `1/2/3 = 460/0/0`, `71` answer-bearing, `389` owner-approved thematic fallbacks.
- Full fallback IDs and per-ticket audit evidence are stored in `content/validation/manual-ticket-placement.evidence.json` and the reviewed placement shards.
- Reviewer metadata: `codex-implementation-agent-f038-ra001`; every placement stores exact `anchorTextAtReview`.
- Immutable source: `content/manual-ticket-placement/reviewed-manifest.json` seals all `460` records and five shard fingerprints. Normal regeneration refreshes only derived inventory, protected baseline, and summary evidence.
- Known-false fixes:
  - `003` now anchors to the incident-duty rule;
  - `011` is a thematic airport-sign fallback, not the unrelated airplane statistic;
  - `042` anchors to the `автовокзал` informational sign.
- Density: `34` destination routes, minimum/median/maximum `1/11/44`; existing dense-page disclosure behavior remains unchanged.
- Dead ends: renaming scorer output as reviewed was rejected; a permissive semantic threshold was also rejected after sampling found VTV-month tickets mapped to `Школьники` and fatigue mapped to `Примерное время`.
- Protected manual source, images, canonical ticket text, translations, answers, explanations, and images changed: `no`.
- Known issue: deterministic checks prove provenance and freshness, not semantic truth; a fresh Review Agent pass remains mandatory.
- Status: local implementation resolved; blocking thread intentionally left unresolved for Orchestrator/fresh Review Agent.
- Final Architect validation performed: `no`.
- Final Analyst validation performed: `no`.

### F038-RA-002 — `task`

- Disposition date: `2026-06-24`
- Disposition type: `task`
- Source: blocking Review Agent review `https://github.com/cucumberfalse/cabadrive/pull/204#pullrequestreview-4561846977`
- Reviewed/current head: `00fc30328d92dd890fafc45792ad1501bc3e392e`
- Prior effective content head: `f9645722bd823b400b122774365e05fead59daec`
- Active threads:
  - `3466813754` / `PRRT_kwDOSX65IM6L4225`: false answer-bearing classifications;
  - `3466813762` / `PRRT_kwDOSX65IM6L4229`: fallback destinations are not the closest substantive topic pages;
  - `3466813766` / `PRRT_kwDOSX65IM6L423A`: stale current-head and blocker status.
- Independent confirmation:
  - `037` cites motorcycle parking while its rationale supplies missing bicycle-infrastructure definitions;
  - `064`, `085`, `165`, `202`, `281`, and `350` likewise require facts or image interpretation absent from their exact anchors;
  - `349` places a vehicle-lights question on a seat-belt-exception paragraph despite identifying `ch3-lights`;
  - `404` places fatigue/reaction loss on pedestrian text `Примерное время`;
  - `431` places hangover risk on truck off-tracking although `ch4-alcohol-drugs` is directly applicable;
  - process memory still describes an old pending push and dense-disclosure blocker.
- Formal disposition: accepted as the second blocking Architect return. Architect return count is `2 / 10`.

Implementation contract:

1. Use one Implementation Agent in the current worktree/branch/PR; do not split writers across this branch.
2. Create `content/manual-ticket-placement/topic-routes.json` for the actual stable ticket/topic-guide taxonomy, approximately `38` topics. Each route owns one preferred substantive eligible page or a small ordered page set, exact curated thematic anchors, rationale, review metadata, and fingerprints.
3. Create a reviewed ticket-topic assignment covering all `460` canonical tickets and seal it with the route table in `reviewed-manifest.json`.
4. Rebuild every placement from that assignment. Scoring/search may suggest topics only and must not write a committed route, destination, anchor, placement basis, rationale, or approval.
5. Re-audit all current `71` strict records. Keep `answer-bearing` only when the exact learner-visible anchor independently and unambiguously supplies the answer; store `directAnswerAssertionRu`, exact quote, and `reviewerRationaleRu` explaining correct-option selection and distractor rejection. Otherwise use fallback.
6. Re-audit all current `389` fallbacks. The page and anchor must belong to the assigned topic route. Use the first applicable ordered page; permit a ticket-specific override only with exact anchor, comparative rationale, review metadata, fingerprints, and a dedicated regression.
7. Preserve the owner's general fallback permission, protected manual text/images, and canonical ticket text/answers. Final strict/fallback counts are audit-derived and may change substantially.
8. Work sequentially through shards `001..092`, `093..184`, `185..276`, `277..368`, and `369..460`. At each checkpoint record audited, strict, fallback, strict-to-fallback, corrected-topic/page/anchor, override, and unresolved counts.
9. Enforce route membership and curated-anchor membership in validator/tests. Add fixtures for `003`, `011`, `037`, `042`, `064`, `085`, `096`, `165`, `202`, `281`, `349`, `350`, `404`, `431`, and representative headrest/neck-injury routing.
10. Reconcile current PR/head, active blockers, check state, semantic counts, and effective-head evidence throughout feature memory and durable mapping docs.

Curated routing minimums:

- lights → `ch3-lights`;
- fatigue/sleep/reaction loss → `ch4-sleep-fatigue`, or `ch4-distractions` only for a distraction-controlled ticket;
- alcohol/drugs/hangover → `ch4-alcohol-drugs`;
- headrest/neck injury/seat belt/airbag → `app1-safety-elements`;
- incident duties → `ch2-incident-obligations`;
- signs → matching substantive Appendix IV sign page where available.

Allowed implementation scope:

- `content/manual-ticket-placement/topic-routes.json`;
- a reviewed ticket-topic assignment artifact under `content/manual-ticket-placement/`;
- `content/manual-ticket-placement/placements/*.json`;
- `content/manual-ticket-placement/reviewed-manifest.json`;
- `content/validation/manual-ticket-placement.evidence.json`;
- `scripts/manual-ticket-placement-lib.mjs`;
- `scripts/content-manual-ticket-placement.mjs`;
- `tests/manual-ticket-placement.test.mjs`;
- runtime index/projection only if the reviewed schema requires a compatible change;
- frontend/backend durable docs only to document the new semantic/routing contract;
- `specs/038-manual-ticket-placement/tasks.md` for Implementation Agent evidence.

Forbidden:

- protected manual prose, manual images, canonical ticket/translation/explanation/image data;
- arbitrary global anchor ranking as a semantic decision;
- unrelated UI/runtime behavior;
- commit/push/thread resolution/merge by Architect;
- final Architect or Analyst validation during this remediation.

Acceptance evidence:

- `460/460` tickets have reviewed topic assignments and `1..3` placements;
- all five shard checkpoints complete with `0` unresolved;
- every strict record passes the self-sufficient-anchor gate;
- every fallback page/anchor is admitted by its curated route or a valid reviewed override;
- all listed regression fixtures pass with expected routes/classifications;
- manifest seals route table, assignments, strict assertions, overrides, and placements;
- validator error counters are `0`;
- protected manual/canonical content is unchanged;
- process memory names the new effective content head and current blockers accurately;
- full content/unit/build/Playwright/preflight/Docker evidence passes;
- a fresh Review Agent review passes before final Architect validation.

- Recommended assignment: one IA, current PR `#204`, five sequential shard audits.
- Product/code/test/docs changed by Architect: `no`; only `spec.md`, `plan.md`, and `tasks.md`.
- Commit/push/thread resolution/final validation performed by Architect: `no`.

### F038-RA-002 Implementation Agent resolution

- Implementation date: `2026-06-24`.
- Role/worktree/PR: Implementation Agent; `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`; branch `codex/038-manual-ticket-placement`; PR `#204`.
- Starting pushed head: `00fc30328d92dd890fafc45792ad1501bc3e392e`.
- Parallel-work preservation: the three uncommitted Architect updates in `spec.md`, `plan.md`, and `tasks.md` were preserved and included; no sibling work was reset or overwritten.
- Audit method: one IA reviewed all `460` canonical questions and correct answers sequentially through the five range shards. Existing strict labels were not trusted. A record remains strict only if one exact learner-visible anchor independently yields the whole answer and rejects distractors; uncertainty is classified as the owner-approved thematic fallback.
- Conservative semantic result: `0` answer-bearing / `460` owner-approved thematic fallbacks. This intentionally under-classifies rather than preserving any unsupported strict claim.
- Curated routing source:
  - `38` reviewed topic routes in `content/manual-ticket-placement/topic-routes.json`;
  - `460` reviewed ticket-topic assignments in `content/manual-ticket-placement/ticket-topic-assignments.json`;
  - five reviewed placement shards;
  - one schema-v2 manifest sealing routes, assignments, records, and shards.
- Candidate scorer authority: unchanged as candidate-only. It cannot write or approve topic routes, ticket assignments, destinations, anchors, placement bases, rationale, or reviewer metadata. Normal `--write` refreshes derived inventory, protected baseline, and summary evidence only.
- Shard checkpoints:
  - `001..092`: audited `92`; strict `0`; fallback `92`; strict-to-fallback `20`; corrected topic/page/anchor `35/38/87`; secondary route page `0`; overrides `0`; unresolved `0`.
  - `093..184`: audited `92`; strict `0`; fallback `92`; strict-to-fallback `14`; corrected topic/page/anchor `42/50/87`; secondary route page `0`; overrides `0`; unresolved `0`.
  - `185..276`: audited `92`; strict `0`; fallback `92`; strict-to-fallback `11`; corrected topic/page/anchor `35/48/86`; secondary route page `1`; overrides `0`; unresolved `0`.
  - `277..368`: audited `92`; strict `0`; fallback `92`; strict-to-fallback `13`; corrected topic/page/anchor `36/57/86`; secondary route page `1`; overrides `0`; unresolved `0`.
  - `369..460`: audited `92`; strict `0`; fallback `92`; strict-to-fallback `13`; corrected topic/page/anchor `33/48/88`; secondary route page `0`; overrides `0`; unresolved `0`.
- Required route regressions:
  - lights `349` → `ch3-lights`;
  - fatigue/reaction `404` → `ch4-sleep-fatigue`;
  - hangover `431` → `ch4-alcohol-drugs`;
  - headrest/neck injury `323` and `454` → `app1-safety-elements`;
  - incident duty `003` → `ch2-incident-obligations`;
  - reviewed false-strict examples `037`, `064`, `085`, `165`, `202`, `281`, `350` are fallbacks on their curated topic routes;
  - prior fixtures `011`, `042`, and `096` use warning-sign, public-transport, and incident routes respectively.
- Final mapping summary: `460/460` tickets; placement distribution `1/2/3 = 460/0/0`; `26` destination routes; density minimum/median/maximum `2/16/47`; all validator counters `0`.
- Product/runtime behavior: canonical joins and append-only rendering remain unchanged. Focused E2E expectations were updated only for the new reviewed density and the now-unused Introduction route.
- Protected scope: manual prose, manual images, canonical questions, translations, explanations, correct answers, difficulty, and question images changed: `no`.
- Verification:
  - `pnpm run generate:manual-ticket-placement`: passed and refreshed derived files only;
  - `pnpm run validate:manual-ticket-placement`: passed;
  - `pnpm run test`: passed `460/460`;
  - `pnpm run build`: passed;
  - focused Playwright: passed `6/6` after a fresh build;
  - full Playwright through `pnpm run preflight`: passed `88/88`;
  - Docker isolated build/up/browser/down: passed at `COMPOSE_PROJECT_NAME=cabadrive-038-ra002`, port `5187`;
  - browser smoke: dense `app1-safety-elements` disclosure closed initially and mounted exactly `47` cards after opening; `ch3-lights` mounted its current cards including `b-fallback-349`; console errors `0`;
  - local OSV Scanner v2.3.5: `No issues found`;
  - `pnpm run preflight`: passed;
  - `git diff --check`: passed.
- Verification dead end: focused Playwright was initially run against a stale pre-refinement `dist` and reported old density. A fresh `pnpm run build` removed that execution artifact; the rerun passed `6/6`.
- Effective content head: `2cc53914622a5e1015b3c0ca322931f64c32d7f8`.
- Current blockers after push: fresh Review Agent review and GitHub required checks. Existing review threads remain intentionally unresolved for Orchestrator/fresh Review Agent disposition.
- Merge performed by Implementation Agent: `no`.
- Final Architect validation performed: `no`.
- Final Analyst validation performed: `no`.

### F038-RA-003 — `task`

- Disposition date: `2026-06-24`
- Disposition type: `task`
- Source review: `https://github.com/cucumberfalse/cabadrive/pull/204#pullrequestreview-4565465801`
- Reviewed/current head: `0dc37b6d3b3f426c24a979dd0590984acb1e0e4a`
- Effective content head now stale: `2cc53914622a5e1015b3c0ca322931f64c32d7f8`
- Active threads:
  - `PRRT_kwDOSX65IM6MBYWW`: ticket-specific fallback audit evidence is mandatory;
  - `PRRT_kwDOSX65IM6MBYWc`: ticket `042` must use its exact bus-terminal sign page/entry;
  - `PRRT_kwDOSX65IM6MBYWh`: ticket `126` must preserve the Architect-approved pre-driving-checks list-item anchor.
- Formal disposition: all three findings are accepted as blocking implementation tasks. Architect return count is `3 / 10`.

Bounded Implementation Agent contract:

1. Use one Implementation Agent in the existing feature worktree/branch/PR. Preserve all sibling work and current process memory.
2. Add a complete ticket-specific fallback ledger to every current fallback record:
   - at least two distinct `searchedConcepts`;
   - at least two distinct exact `candidatesReviewed`;
   - exactly one `selected-closest-topic` candidate matching the committed placement;
   - at least one `rejected` candidate with ticket-specific `rejectionRu`;
   - exact anchor text, fresh fingerprints, ticket-specific no-answer conclusion, and comparative selection rationale.
3. Process shards sequentially: `001..092`, `093..184`, `185..276`, `277..368`, `369..460`. Record per-shard audited/complete/corrected/unresolved counts.
4. Restore `b-fallback-042` to `information-signs` / `app4-signs-informational` / `app4informational-p191-019-terminal-de-omnibus-catalog-entry` (`автовокзал`). Its ledger must reject the current generic public-transport anchor.
5. Restore `b-fallback-126` to `vehicle-condition-maintenance-loads` / `app1-safety-elements` / `manual-list-item` / `pre-driving-checks` / `itemIndex: 0` / `itemsRu`. Its ledger must retain the oil-filter and professional inspection-fluid comparisons.
6. Seal all ledger, route, assignment, and placement changes in `reviewed-manifest.json`; refresh deterministic evidence only after validation passes.
7. Strengthen validator/tests to fail for missing/generic concepts, fewer than two candidates, no rejected candidate, unresolved/stale candidate anchors, selected/placement mismatch, generic shared rationale, and alternate `042`/`126` destinations or anchors.
8. Keep candidate generation advisory-only and preserve protected/canonical content.
9. Run focused validation after each shard, then full content/unit/build/Playwright/preflight/whitespace checks. Record a new effective content head.

Exact allowed files:

- `content/manual-ticket-placement/topic-routes.json`
- `content/manual-ticket-placement/ticket-topic-assignments.json`
- `content/manual-ticket-placement/placements/001-092.json`
- `content/manual-ticket-placement/placements/093-184.json`
- `content/manual-ticket-placement/placements/185-276.json`
- `content/manual-ticket-placement/placements/277-368.json`
- `content/manual-ticket-placement/placements/369-460.json`
- `content/manual-ticket-placement/reviewed-manifest.json`
- `content/validation/manual-ticket-placement.evidence.json`
- `scripts/manual-ticket-placement-lib.mjs`
- `scripts/content-manual-ticket-placement.mjs` only if needed for the stricter summary
- `tests/manual-ticket-placement.test.mjs`
- `tests/e2e/manual-ticket-placement.spec.ts` only if the `042` move changes an existing deterministic assertion
- `docs_project/project/backend/backend-docs.md` only for the mandatory-ledger contract
- `specs/038-manual-ticket-placement/tasks.md` only for Implementation Agent evidence

Forbidden files/actions:

- no protected manual prose/images or route inventory/baseline changes;
- no canonical ticket, translation, explanation, answer, difficulty, or image changes;
- no runtime UI/CSS, package, lockfile, frontend-doc, or unrelated-test changes;
- no Architect commit, push, review, thread resolution, merge, or final validation.

Acceptance and negative evidence:

- `460/460` fallback ledgers are complete, ticket-specific, manifest-sealed, and validator-clean;
- selected candidates exactly match placements and all selected/rejected anchors resolve to current learner-visible text;
- `042` and `126` exact invariants pass dedicated positive and alternate-anchor negative tests;
- tests reject missing concepts, duplicated/generic concepts, missing rejected candidates, stale/unresolved candidate anchors, selected/placement mismatch, boilerplate audit conclusions/rationales, and generator-authored audit decisions;
- all five shard checkpoints end with `0` unresolved;
- protected/canonical content remains unchanged;
- full required checks pass on the new effective content head.

Staleness and handoff:

- Review `4565465801`, effective content head `2cc53914622a5e1015b3c0ca322931f64c32d7f8`, and evidence-only head `0dc37b6d3b3f426c24a979dd0590984acb1e0e4a` are stale for merge authorization once implementation begins.
- A fresh Review Agent pass on the new effective content head is mandatory.
- Final Architect validation must not begin until fresh review passes, required checks are green, all blocking threads are resolved/outdated, and process memory is current.
- Any non-evidence change after fresh review or final validation makes that evidence stale and returns the work through role-appropriate review/validation.
- Final Architect validation performed: `no`.
- Final Analyst validation performed: `no`.

### F038-RA-003 Implementation Agent resolution

- Implementation date: `2026-06-24`.
- Role/worktree/PR: Implementation Agent; `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`; branch `codex/038-manual-ticket-placement`; PR `#204`.
- Starting pushed head: `0dc37b6d3b3f426c24a979dd0590984acb1e0e4a`.
- Parallel-work preservation: the three uncommitted Architect-owned updates in `spec.md`, `plan.md`, and `tasks.md` were preserved without rewriting Architect text and are included in the implementation commit; no sibling worktree, branch, commit, PR state, or process memory was reset.
- Implementation:
  - added a mandatory ticket-specific fallback ledger to all `460` reviewed records, with canonical searched concepts, exact selected and rejected candidates, fresh anchor/page fingerprints, ticket-specific rejection reasons, a no-answer conclusion, and comparative selection rationale;
  - strengthened validation against missing/duplicated concepts, fewer than two exact candidates, missing rejected candidates, stale/unresolved candidate anchors, selected/placement mismatch, shared generic audit text, and malformed comparison evidence;
  - restored `b-fallback-042` to topic route `information-signs`, page `app4-signs-informational`, and exact sign entry `app4informational-p191-019-terminal-de-omnibus-catalog-entry` with learner-visible text `автовокзал`; its ledger rejects the prior generic public-transport candidate;
  - restored `b-fallback-126` to `app1-safety-elements` / `pre-driving-checks.itemsRu[0]`; its ledger retains rejected oil-filter and professional inspection-fluid candidates;
  - sealed the complete ledgers, curated-route changes, ticket-topic assignment, and placement shards in `reviewed-manifest.json`, and refreshed deterministic evidence with zero ledger/invariant counters;
  - kept candidate generation advisory-only and documented the mandatory ledger in backend durable docs.
- Sequential shard checkpoints:
  - `001-092`: audited `92`, complete ledgers `92`, corrected destination/anchor `1` (`042`), unresolved `0`;
  - `093-184`: audited `92`, complete ledgers `92`, corrected destination/anchor `1` (`126`), unresolved `0`;
  - `185-276`: audited `92`, complete ledgers `92`, corrected destination/anchor `0`, unresolved `0`;
  - `277-368`: audited `92`, complete ledgers `92`, corrected destination/anchor `0`, unresolved `0`;
  - `369-460`: audited `92`, complete ledgers `92`, corrected destination/anchor `0`, unresolved `0`.
- Aggregate ledger evidence: records `460`, complete ledgers `460`, selected exact candidates `460`, rejected exact candidates `461`, stale/unresolved candidates `0`.
- Scope guard:
  - protected manual prose/images, route inventory, protected baseline, canonical questions/translations/explanations/answers/difficulty/images, runtime UI/CSS, package/lockfiles, frontend docs, and unrelated files changed: `no`;
  - allowed implementation files changed: five placement shards, reviewed manifest, topic routes, ticket-topic assignments, deterministic evidence, validator/wrapper, focused unit tests, backend docs, and this feature memory.
- Verification:
  - focused per-shard ledger/anchor checks: passed for all five checkpoints with `0` unresolved;
  - `pnpm run validate:manual-ticket-placement`: passed (`460` questions, `460` placements, `26` destination routes, density `2/16/47`, `0` answer-bearing, `460` audited fallbacks);
  - `node --test tests/manual-ticket-placement.test.mjs`: passed `11/11`;
  - `pnpm run preflight`: passed, including repository/feature-memory gates, full content validation, `462/462` unit/content tests, production builds, and `88/88` Playwright tests;
  - `git diff --check`: passed;
  - protected/canonical diff guard from starting head: empty.
- Verification dead end: the first full ledger validation rejected reused ES/RU search pairs for tickets with identical short sign questions. The ledger was corrected by adding canonical ES/RU correct-answer forms and omitting unusably short search tokens; the rerun passed without using ticket IDs as artificial search concepts.
- Implementation Agent feedback requiring Architect disposition: `none`.
- Effective content head: `0f777a89450e26608b3eeda7c9198959ce576179`.
- The following commit is evidence-only and changes only this Implementation Agent process record.
- Review threads, review submission, and final role validations performed by Implementation Agent: `no`.
- Merge performed by Implementation Agent: `no`.

### F038-RA-004 — `task`

- Disposition date: `2026-06-24`
- Disposition type: `task`
- Source review: `https://github.com/cucumberfalse/cabadrive/pull/204#pullrequestreview-4565608440`
- Reviewed/current head: `f6f9484d3869c7beea957cd3458c826cb008d467`
- Effective content head that review covered: `0f777a89450e26608b3eeda7c9198959ce576179`
- Head relation: `f6f9484d3869c7beea957cd3458c826cb008d467` is evidence-only after the effective content head.
- Active threads:
  - `PRRT_kwDOSX65IM6MBsV4`: fallback ledgers reject answer-bearing anchors in at least `25` records;
  - `PRRT_kwDOSX65IM6MBsV8`: live process status is stale after `F038-RA-003`.
- Formal disposition: both findings are accepted as blocking implementation tasks. Architect return count is `4 / 10`.

Independent Architect evidence:

- `b-fallback-001` rejects `Поворот направо` while the canonical Russian answer is `Поворот направо.`, then selects generic bicycle-introduction prose.
- The same exact defect is reproduced for `065` (`Извилистая дорога`) and `086` (the exact approximately-eight-hours sleep instruction).
- A normalization-based scan across all five shards found `39` rejected-candidate/canonical-answer containment candidates. This screening set includes all reviewer-named IDs but also contains legitimate false positives such as negated/warning text (`026`) and incomplete propositions (`202`); no detector may auto-classify them.
- The existing validator checks ledger shape, identity, fingerprints, and selected-placement equality but has no containment/equivalence contradiction guard.
- The live status still describes completed `F038-RA-003` work as pending and names old head `0dc37b6...`.

Bounded Implementation Agent contract:

1. Use one Implementation Agent in the existing feature worktree/branch/PR. Preserve all sibling work and current process memory.
2. Add a deterministic advisory detector for rejected-candidate/canonical-answer normalized equality, bidirectional containment, numeric/unit equivalence, and manually reviewed semantic equivalence. It must not approve or classify records.
3. Run it over all five shards. Record every detected ID and explain any difference from the Architect baseline of `39` lexical candidates.
4. Independently re-audit every detected candidate against the canonical question, correct answer, distractors, exact anchor, page, and required visual/text context.
5. If the exact anchor independently supplies the complete answer, select it and convert the placement to `answer-bearing`; remove fallback-only evidence and add fresh direct-answer, distractor-aware rationale, review metadata, and fingerprints.
6. Retain fallback only with a structured ticket-specific `not-self-sufficient` disposition that names the actual overlap and its negation, missing condition, scope mismatch, ambiguity, partial proposition, or other explicit limitation. Generic denial is forbidden.
7. Re-run detection and validation until undisposed contradictions and rejected self-sufficient answer-bearing candidates are both `0`.
8. Seal all changed placements, contradiction dispositions, any necessary route/assignment/override updates, and final audit-derived totals in `reviewed-manifest.json` and deterministic evidence.
9. Update this file with per-shard screened/reclassified/retained/unresolved counts, exact changed files, dead ends, command results, the new effective content head, and accurate remaining blockers.

Required fixtures:

- [x] Reject `001`, `065`, and `086` as fallback when their exact answer-bearing candidates remain rejected.
- [x] Accept an exact selected `answer-bearing` anchor only with direct-answer and distractor-aware evidence and no fallback-only fields.
- [x] Accept `026` as fallback only with an explicit negated/warning limitation.
- [x] Accept `202` as fallback only with an explicit partial-answer limitation naming the missing more-than-two-tracks condition.
- [x] Reject an undisposed contradiction, generic limitation, limitation contradicted by exact text, answer-bearing record retaining fallback fields, or stale manifest/evidence totals.

Exact allowed files:

- `content/manual-ticket-placement/topic-routes.json` only if a corrected answer-bearing anchor requires route admission;
- `content/manual-ticket-placement/ticket-topic-assignments.json` only if independent re-audit proves the current assignment wrong;
- `content/manual-ticket-placement/placements/001-092.json`;
- `content/manual-ticket-placement/placements/093-184.json`;
- `content/manual-ticket-placement/placements/185-276.json`;
- `content/manual-ticket-placement/placements/277-368.json`;
- `content/manual-ticket-placement/placements/369-460.json`;
- `content/manual-ticket-placement/reviewed-manifest.json`;
- `content/validation/manual-ticket-placement.evidence.json`;
- `scripts/manual-ticket-placement-lib.mjs`;
- `scripts/content-manual-ticket-placement.mjs` only for deterministic contradiction/evidence reporting;
- `tests/manual-ticket-placement.test.mjs`;
- `tests/e2e/manual-ticket-placement.spec.ts` only if corrected destinations alter deterministic density assertions;
- `docs_project/project/backend/backend-docs.md` only for the durable contradiction-disposition validator contract;
- `specs/038-manual-ticket-placement/tasks.md` only for Implementation Agent evidence.

Forbidden files/actions:

- no protected manual prose/images, route inventory, protected baseline, or canonical ticket/translation/explanation/answer/difficulty/image changes;
- no runtime UI/CSS, package/lockfile, frontend-doc, or unrelated-test changes;
- no automatic semantic approval from detection;
- no Implementation Agent edits to `spec.md` or `plan.md`;
- no Architect commit, push, review, thread resolution, merge, or final validation.

Acceptance evidence:

- all five shards are screened and every containment/equivalence candidate has an explicit reviewed disposition;
- every exact self-sufficient answer-bearing candidate is selected rather than rejected for generic fallback prose;
- every retained fallback has a non-generic limitation consistent with the exact text and full question;
- undisposed contradictions and rejected self-sufficient answer-bearing candidates are `0`;
- `001`, `065`, `086`, `026`, and `202` fixtures pass with the required classifications/evidence;
- reviewed manifest, deterministic evidence, answer-bearing/fallback totals, and current process status are fresh;
- protected/canonical diff guards are empty;
- focused tests and all required repository checks pass on a new effective content head.

Staleness and handoff:

- Any implementation change makes review `4565608440`, current head `f6f9484d3869c7beea957cd3458c826cb008d467`, and effective content head `0f777a89450e26608b3eeda7c9198959ce576179` stale for merge authorization.
- A fresh Review Agent pass on the new effective content head is mandatory.
- Final Architect validation must not begin until fresh review passes, required checks are green, all blocking threads are resolved/outdated, and process memory is current.
- Any non-evidence change after fresh review or final validation makes that evidence stale and returns the work through role-appropriate review/validation.
- Final Architect validation performed: `no`.
- Final Analyst validation performed: `no`.

### F038-RA-004 replacement Implementation Agent resolution

- Implementation date: `2026-06-25`.
- Assignment: explicit Orchestrator replacement assignment after the prior Implementation Agent hit a service usage limit before product edits.
- Starting branch/head: `codex/038-manual-ticket-placement` / `f6f9484d3869c7beea957cd3458c826cb008d467`.
- Preserved Architect handoff: the pre-existing uncommitted `spec.md`, `plan.md`, and `tasks.md` changes were retained; Implementation Agent changed only the allowed product/evidence files plus this Implementation Agent evidence section.
- Detector result:
  - strict normalized phrase boundaries reproduce the Architect baseline of `39` lexical containment/equality/numeric candidates;
  - a naive substring-only probe produced `40` because the two-letter answer `Да` appeared inside the unrelated word `выдачей` for `b-fallback-257`; the production detector requires normalized phrase boundaries and correctly excludes that false positive;
  - independent semantic review added `65` reviewed equivalence candidates;
  - total screened tickets: `104`;
  - answer-bearing reclassifications: `85`;
  - retained fallbacks with structured `not-self-sufficient` limitations: `19`;
  - unresolved contradictions: `0`;
  - rejected self-sufficient answer-bearing candidates: `0`.
- Per-shard checkpoints:
  - `001-092`: screened `19`, answer-bearing `15`, retained fallback `4`, unresolved `0`;
  - `093-184`: screened `18`, answer-bearing `16`, retained fallback `2`, unresolved `0`;
  - `185-276`: screened `21`, answer-bearing `17`, retained fallback `4`, unresolved `0`;
  - `277-368`: screened `18`, answer-bearing `14`, retained fallback `4`, unresolved `0`;
  - `369-460`: screened `28`, answer-bearing `23`, retained fallback `5`, unresolved `0`.
- Reclassified answer-bearing IDs:
  - `001, 003, 007, 009, 023, 028, 031, 041, 042, 051, 063, 065, 072, 081, 086`;
  - `097, 110, 115, 120, 123, 124, 128, 133, 152, 154, 159, 173, 174, 177, 178, 180`;
  - `203, 204, 205, 211, 215, 218, 224, 228, 230, 241, 243, 248, 251, 254, 260, 271, 273`;
  - `287, 288, 295, 301, 309, 316, 318, 327, 345, 350, 355, 360, 366, 367`;
  - `371, 379, 380, 382, 390, 401, 402, 404, 405, 410, 421, 422, 423, 425, 430, 431, 435, 437, 447, 451, 456, 457, 459`.
- Retained fallback IDs and limitation classes:
  - negated/warning: `026, 125, 236, 391`;
  - incomplete proposition: `046, 202, 262`;
  - wrong scope or condition: `032, 300, 324, 420`;
  - ambiguous without required context: `049, 144, 267, 289, 314, 377, 398, 449`.
- Exact invariants:
  - `b-fallback-042` remains on `app4-signs-informational` at `app4informational-p191-019-terminal-de-omnibus-catalog-entry` / `автовокзал` and is now correctly classified `answer-bearing`;
  - `b-fallback-126` remains the approved fallback on `app1-safety-elements` at `pre-driving-checks.itemsRu[0]`, retaining the oil-filter and professional inspection-fluid comparisons.
- Final mapping/evidence totals: `460` questions, `460` placements, `85` answer-bearing, `375` audited fallbacks, `31` destination routes, density `1/12/45`.
- Changed implementation files:
  - all five placement shards, `reviewed-manifest.json`, and deterministic evidence;
  - `scripts/manual-ticket-placement-lib.mjs` and `scripts/content-manual-ticket-placement.mjs`;
  - focused unit/mutation tests and density-adjusted Playwright assertions;
  - backend durable validator documentation.
- Topic routes and ticket-topic assignments changed: `no`.
- Protected/canonical diff guard from starting head: empty for manual prose/images, route inventory, protected baseline, canonical questions/translations/explanations/answers/difficulty/images, runtime UI/CSS, package/lockfile, and frontend docs.
- Verification:
  - `pnpm run validate:manual-ticket-placement`: passed;
  - `node --test tests/manual-ticket-placement.test.mjs`: `12/12` passed;
  - `pnpm run validate:content`: passed;
  - `pnpm run test`: `463/463` passed;
  - `pnpm run build`: passed;
  - focused Playwright: `6/6` passed;
  - `pnpm run test:e2e`: `88/88` passed;
  - `pnpm run preflight`: passed, including the same `463/463` unit/content and `88/88` Playwright results;
  - `git diff --check`: passed.
- Dead end: substring-only containment treated the short answer `Да` as part of `выдачей`; phrase-boundary normalization removed the false candidate without weakening exact sign labels, numeric/unit equivalence, or manually reviewed semantic hooks.
- Implementation Agent feedback requiring Architect disposition: `none`.
- Effective content head: `2cd692fe6ce076389a9ebd916753c861d681c04b`.
- Current implementation head at evidence capture: `2cd692fe6ce076389a9ebd916753c861d681c04b`.
- The following commit is evidence-only and changes only this Implementation Agent process record; its exact pushed head is returned in the Implementation Agent handoff.
- Review/thread resolution/final role validation/merge performed by Implementation Agent: `no`.

### F038-IA-003 Implementation Agent resolution

- Implementation date: `2026-06-24`.
- Role/worktree/PR: Implementation Agent; `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`; branch `codex/038-manual-ticket-placement`; PR `#204`.
- Starting pushed head: `2688192e36815cf81741882ebda68f29f3ca1030`.
- Parallel-work preservation: the three uncommitted Architect updates in `spec.md`, `plan.md`, and `tasks.md` were preserved and included; no sibling work was reset.
- Implementation:
  - added `key={pageId}` to the dense native `<details>` in `ManualTicketAppendix`;
  - extended the existing desktop/mobile regression to open `ch3-right-of-way` (`44` cards), navigate to dense `app1-safety-elements` (`26` tickets), assert no destination `open` attribute and `0` mounted cards, then open it and assert all `26` cards mount;
  - retained native `<details>/<summary>`, `onToggle`, the `pageId` state reset, conditional card mounting, direct-render threshold, ordering, lazy images, and canonical joins.
- Changed files in this follow-up:
  - `src/App.tsx`;
  - `tests/e2e/manual-ticket-placement.spec.ts`;
  - `specs/038-manual-ticket-placement/spec.md`;
  - `specs/038-manual-ticket-placement/plan.md`;
  - `specs/038-manual-ticket-placement/tasks.md`.
- Scope guard: protected manual corpus, manual images, canonical tickets/translations/explanations/images, placement shards, reviewed manifest, evidence mapping semantics, styles, and unrelated product behavior changed: `no`.
- Verification:
  - initial direct focused Playwright invocation used the existing `dist` preview and reproduced the stale open-state failure; this was a test-execution dead end, not a product failure on the new source;
  - fresh `pnpm run build` followed by `pnpm exec playwright test tests/e2e/manual-ticket-placement.spec.ts`: passed `6/6`;
  - `pnpm run validate:manual-ticket-placement`: passed (`460` questions, `460` placements, `34` destination routes, density `1/11/44`, `71` answer-bearing, `389` fallbacks);
  - `pnpm run preflight`: passed, including feature-memory/repository gates, content validation, `458/458` unit/content tests, production build, and `88/88` Playwright tests;
  - `git diff --check`: passed.
- Effective content head: `f9645722bd823b400b122774365e05fead59daec`.
- Effective-head scope: the commit contains the `src/App.tsx` lifecycle fix, focused E2E regression, preserved Architect dispositions, and reconciled implementation evidence. The following commit is evidence-only and records this SHA.
- Review thread `PRRT_kwDOSX65IM6LxRUf`: intentionally not resolved by Implementation Agent.
- Merge performed by Implementation Agent: `no`.
- Final Architect validation performed: `no`.
- Final Analyst validation performed: `no`.

## Historical Follow-up CI Fix — OSV Scan

- Implementation Agent assignment date: `2026-06-24`.
- Starting PR/head: `#204` / `77669a15fafa4c9d9b47dfecabdb33dcbd6cb442`.
- Failed required check: `osv-scan`, run `28069189843`, job `83099973709`.
- Root cause:
  - `vite@6.4.2` was affected by `GHSA-fx2h-pf6j-xcff` and `GHSA-v6wh-96g9-6wx3`; fixed in `6.4.3`.
  - transitive `@babel/core@7.29.0` was affected by `GHSA-4x5r-pxfx-6jf8`; fixed in `7.29.6`.
- Minimal dependency change:
  - raised the existing Vite range from `^6.4.1` to the safe floor `^6.4.3`;
  - added a root pnpm override for transitive `@babel/core` at exactly `7.29.6`, because a normal targeted transitive update retained `7.29.0`;
  - regenerated `pnpm-lock.yaml`; resolved versions are `vite@6.4.3` and one deduplicated `@babel/core@7.29.6`.
- Changed files: `package.json`, `pnpm-lock.yaml`, and this Implementation Agent process-evidence section in `specs/038-manual-ticket-placement/tasks.md`.
- Scope guard: no feature behavior, protected manual corpus, canonical ticket data, placement records, mapping semantics, or final-validation records changed.
- Historical verification at pre-`F038-RA-001` head:
  - `pnpm install --frozen-lockfile`: passed.
  - `pnpm list vite @babel/core --depth 10`: passed; only safe resolved versions present.
  - local CI-equivalent `ghcr.io/google/osv-scanner-action:v2.3.5 --recursive .`: passed, `No issues found`.
  - `pnpm run validate:manual-ticket-placement`: passed at that historical head (`460` questions, `460` placements, claimed `458` answer-bearing, `2` approved fallbacks); these semantic counts were later superseded by `F038-RA-001`.
  - `pnpm run preflight`: passed, including `455/455` unit/content tests, Vite `6.4.3` production builds, and `88/88` Playwright tests.
  - `git diff --check`: passed.
- Final Architect validation performed: `no`.
- Final Analyst validation performed: `no`.

## Final Validation Records

Architect return count: `4 / 10`

Analyst return count: `0 / 5`

Process status: `F038-RA-004 replacement Implementation Agent remediation is complete and pushed at effective content head 2cd692fe6ce076389a9ebd916753c861d681c04b: 104 screened, 85 answer-bearing, 19 justified retained fallbacks, 0 unresolved. This tasks-only evidence update follows that content head; fresh review, current-head checks, thread disposition, and final role validations remain`.

Final Architect validation and Final Analyst validation are not performed. Orchestrator may invoke them only after `F038-RA-004` remediation, fresh passing Review Agent review, checks, and follow-up development are complete.
