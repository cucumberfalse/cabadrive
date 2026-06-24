# Implementation Plan: Evidence-Backed Ticket Placement In Руководство

## Architectural Decision

Implement the feature as a governed cross-reference layer, not as edits to manual section content.

The mapping is stored in reviewed range shards keyed by canonical `questionId`; routes and exact anchors are separately inventoried and fingerprinted. The preferred path requires answer-bearing evidence. When a documented audit proves that none exists, the general owner decision of `2026-06-23` permits an explicitly marked `owner-approved-thematic-fallback` on the closest substantive eligible page. Runtime joins the mapping to canonical ticket, translation, explanation, answer, source, difficulty, and image data. One shared appendix component is appended after each route's existing content.

This design prevents content drift, makes all `460` coverage machine-verifiable, and preserves the user's prohibition on changing existing manual text and images.

## Delivery Shape

Use one implementation PR slice on the Orchestrator-assigned isolated worktree/branch.

One PR is preferred because validator, route inventory, reviewed mapping, runtime join, shared renderer, immutable-content baseline, and browser evidence form one inseparable acceptance gate. Splitting infrastructure from mappings would temporarily permit an incomplete or unvalidated surface and complicate effective-head validation.

If the semantic audit finds another ticket without an answer-bearing anchor, record the audit and choose the closest substantive eligible page under the general owner rule. Stop only when no substantive thematically relevant eligible page exists.

## Phase 1: Baseline And Protected Corpus

1. Confirm the assigned branch/worktree and latest-main base evidence supplied by Orchestrator.
2. Confirm all four feature-memory artifacts exist before product edits.
3. Inventory current canonical question IDs and assert `460` distinct IDs at the implementation baseline.
4. Generate the protected manual-content baseline before changing renderer/runtime files:
   - protected source-file hashes;
   - referenced manual image path and byte hashes;
   - base SHA;
   - schema version.
5. Add tests that make any protected corpus change fail.

No file under the protected manual corpus may be edited during this feature.

## Phase 2: Route Inventory And Anchor Resolver

1. Enumerate every learner-facing route from `manualGuideNavigation`.
2. Include Introduction routes, implemented manual sections, pending children, and support/navigation records needed for exclusion proof.
3. Classify each route as eligible or ineligible with a concise reason.
4. Explicitly classify `front-presentation`, `front-categories`, and `front-glossary` as ineligible.
5. Build a deterministic read-only anchor resolver over existing content structures:
   - Introduction segments and blocks;
   - manual blocks;
   - table rows/cells;
   - list items;
   - structured card children and term translations;
   - Appendix IV sign entries.
6. Generate page content fingerprints from learner-visible text plus existing image references.
7. Test missing, ambiguous, cross-page, source-only, and image-only anchors as failures.

The resolver is validation tooling. Runtime does not need to perform semantic matching.

## Phase 3: Semantic Mapping Audit

1. Create five placement shards matching the current `92`-ticket ranges.
2. Use ticket topics/search only to produce candidate pages; never treat automated candidates as approval.
3. Review each canonical question and correct answer against existing eligible page text.
4. For every approved placement record:
   - exact page ID and route hash;
   - exact stable anchor;
   - exact anchor-text fingerprint;
   - concise Russian answer-bearing rationale, or complete audited thematic-fallback evidence when no answer-bearing anchor exists;
   - canonical question, translation, answer, and image fingerprints;
   - approval metadata.
5. Prefer one strong placement. Add a second or third only when each independently contains the answer.
6. Keep placements deterministically ordered by canonical question ID and page ID.
7. Generate the aggregate evidence report and inspect:
   - all `460` current IDs covered;
   - every count in `1..3`;
   - no duplicate same-question/same-page relation;
   - zero unknown/ineligible/unreviewed/stale records.

### No-answer audit and thematic fallback

If no eligible route contains the answer for a ticket:

1. do not mislabel a thematic placement as answer-bearing;
2. do not edit manual content;
3. record searched answer forms/concepts, all credible candidate pages, exact anchors, and answer-bearing rejection reasons;
4. compare substantive thematic candidates and choose the closest by subject and learning context;
5. create one `owner-approved-thematic-fallback` with the common owner decision reference/date, exact anchor, selection/rejection rationale, approved review, and fresh fingerprints;
6. leave coverage failing and hand back to Orchestrator only when no substantive thematic page exists.

### F038-IA-001 owner decision and implementation

Architect independently confirmed that `b-fallback-235` has no existing answer-bearing Руководство anchor for its canonical correct answer `72 horas.` On `2026-06-23`, the owner authorized placement on the closest substantive page by topic without changing manual or ticket text.

Implementation must:

1. map `b-fallback-235` exactly once to `ch2-incident-obligations`;
2. use `manual-block` / `incident-duty-core` / `textRu` as the thematic anchor;
3. mark the placement `placementBasis: "owner-approved-thematic-fallback"`;
4. record `auditId: "F038-IA-001"`, `ownerDecisionDate: "2026-06-23"`, and `ownerDecisionRef: "feature-038-owner-decision-2026-06-23"`;
5. explain that the anchor covers post-incident duties and required messages but does not state the `72`-hour answer;
6. include fresh canonical question, translation, correct-answer, image, exact-anchor, and page-content fingerprints plus approved review metadata;
7. leave the protected manual corpus and all canonical ticket text/answers unchanged.

### F038-IA-002 implementation

Map `b-fallback-126` exactly once to `app1-safety-elements` (`#manual-section-app1-safety-elements`), using `manual-list-item` / `pre-driving-checks` / `itemIndex: 0` / `itemsRu` (`Масло, охлаждающую жидкость и жидкость стеклоомывателя.`). Mark it `placementBasis: "owner-approved-thematic-fallback"` with `auditId: "F038-IA-002"`. Record why no answer-bearing text exists and why this pre-driving operating-fluid checklist is closer than the oil-filter item in `ch5-anticipatory-efficient-driving` and the professional inspection-fluid item in `app3-social-responsibility`.

The validator must accept thematic fallbacks for any canonical ticket only when the complete no-answer and closest-topic evidence contract passes. It must reject missing audits, ineligible/support destinations, random or unreasoned selections, stale fingerprints, unapproved review, canonical/manual mutation, and known Architect-approved tickets mapped to alternate pages or anchors.

## Phase 4: Validator And Runtime Index

1. Add `scripts/content-manual-ticket-placement.mjs`.
2. Add a focused package command and wire it into `validate:content`.
3. Validate schemas, coverage, counts, eligibility, anchors, placement bases, answer-bearing preference, audited thematic fallbacks including the exact `b-fallback-235` and `b-fallback-126` dispositions, reviews, fingerprints, canonical translations/answers/images, protected corpus, shard/index freshness, and evidence summary.
4. Add a deterministic generated runtime index only if it materially simplifies imports; otherwise import shards directly and validate deterministic assembly.
5. Expose a typed `placementsByPageId` lookup without duplicating ticket prose.
6. Update backend docs with the validator, files, commands, and failure contract.

## Phase 5: Shared Read-Only Ticket Rendering

1. Extract canonical display behavior from `TopicGuideTicketBlock` into a shared component.
2. Preserve `Материалы` adapter semantics, data, labels, missing-data behavior, source truth, and styling.
3. Add a `Руководство` adapter that consumes only `questionId` and canonical stores.
4. Show:
   - ticket metadata and difficulty;
   - canonical Spanish question and ordered answers;
   - governed Russian question and answer translations;
   - canonical local image;
   - canonical correct-answer badge;
   - governed explanations;
   - truthful source/fallback footer.
5. Keep the component read-only.
6. Lazy-load images.

No mapping field may override canonical Spanish text, answer order, correct answer, translation, image, or source status.

## Phase 6: Appendices At Route Ends

1. Create `ManualTicketAppendix({ pageId })`.
2. Append it after all existing content in:
   - `PandemiaVialPrototypeView`;
   - `IntroductionArticleView`;
   - `ManualGuideSectionContentView`.
3. Do not insert mapping references into `content.blocks`.
4. Do not render appendices for ineligible or unmapped routes.
5. Sort tickets by canonical question ID.
6. Apply density behavior:
   - exact count in summary;
   - direct render for low density;
   - unmounted, collapsed native disclosure for medium/high density;
   - deterministic expanded content;
   - no document-level horizontal overflow.
7. Update frontend docs with the route-end appendix, canonical join, and density behavior.

The existing route content must render byte-for-byte from the same source data in the same order before the new sibling appendix.

## Phase 7: Tests And Evidence

### Content/unit tests

- Current bank ID coverage and `1..3` count.
- Duplicate, unknown, missing, and ineligible placement rejection.
- Route-hash agreement.
- Anchor resolution for every supported anchor kind.
- Missing/ambiguous/stale anchor rejection.
- Exact acceptance of the approved `b-fallback-235` and `b-fallback-126` thematic fallbacks.
- Acceptance of future thematic fallbacks only with complete no-answer, candidate/rejection, closest-topic, owner-decision, review, and fingerprint evidence.
- Rejection of fallback without audit, fallback to ineligible/support pages, arbitrary selection, alternate approved page/anchor use, and missing/stale metadata or fingerprints.
- Canonical question/translation/answer/image fingerprint freshness.
- Missing translation/answer/image rejection.
- Manual protected-file and image-byte immutability.
- Deterministic shard ordering and generated evidence freshness.
- Runtime index equality with reviewed shards.
- `Материалы` renderer regression.
- Read-only manual ticket semantics.
- Appendix ordering after existing content.

### Browser evidence

Use Docker-isolated runtime when parallel agents may have active compose projects. Choose a free project name and port; never stop sibling projects.

Capture desktop and mobile evidence for:

- an Introduction route;
- a chapter route;
- an Appendix IV sign route;
- a ticket with canonical image;
- lowest, representative medium, and highest ticket-density routes;
- dense appendix closed and opened;
- route-hash deep link;
- `Материалы` regression.

Assert:

- appendix follows the last existing manual block;
- closed dense appendix mounts zero ticket cards;
- opened appendix exposes all mapped ticket IDs;
- correct answer and translations are visible;
- image source is local;
- no horizontal document overflow;
- existing manual content remains present and ordered;
- navigation and hashes remain stable.

### Performance evidence

For the highest-density route record:

- route/page ID;
- mapped ticket count;
- closed-state DOM ticket-card count;
- opened-state DOM ticket-card count;
- time to expand in the test environment;
- image `loading` behavior;
- viewport widths tested;
- overflow result.

Do not define a fragile universal millisecond product SLA. Fail on eager hidden-card mounting, incomplete expansion, browser timeout, or layout overflow.

## Verification Commands

The implementation PR must record results for:

```bash
pnpm run validate:manual-ticket-placement
pnpm run validate:content
pnpm run test
pnpm run build
pnpm exec playwright test <focused manual-ticket spec>
pnpm run test:e2e
pnpm run preflight
git diff --check
```

For runtime-affecting validation, also use the Docker-only contract in an isolated compose project:

```bash
COMPOSE_PROJECT_NAME=<isolated-name> CABADRIVE_HOST_PORT=<free-port> make build
COMPOSE_PROJECT_NAME=<isolated-name> CABADRIVE_HOST_PORT=<free-port> make up
COMPOSE_PROJECT_NAME=<isolated-name> CABADRIVE_HOST_PORT=<free-port> make down
```

## Review Requirements

Review Agent must verify:

- complete feature memory and preserved role boundaries;
- all `460` IDs and `1..3` placement counts;
- answer-bearing semantic evidence for preferred placements and complete audited thematic evidence for every fallback;
- exact anchors and fresh fingerprints;
- explicit page eligibility and prohibited-page exclusions;
- no protected manual-content changes;
- canonical runtime data reuse;
- appendix placement after existing content;
- `Материалы` regression safety;
- dense-page accessibility/performance;
- objective command/browser evidence;
- unmatched-ticket blockers are not hidden.

## Risks And Mitigations

### False semantic relevance

Mitigation: exact visible-text anchors, human approval metadata, rationale, fingerprint freshness, and review sampling across all shards.

### Unmatched fallback-bank question

Mitigation: preserve answer-bearing placement as the preferred path. When unavailable, apply the schema-bound general owner rule with a documented no-answer audit and closest substantive thematic page. Fail closed and escalate only if no substantive thematic eligible page exists. Never alter manual/ticket content or conceal fallback evidence.

### Canonical drift

Mitigation: question, translation, correct-answer, image, anchor, and page fingerprints.

### Manual-content mutation

Mitigation: protected file hashes, referenced image byte hashes, page content fingerprints, and a rule that implementation does not edit protected content files.

### Dense pages

Mitigation: route-end disclosure, zero hidden rich cards while closed, lazy local images, deterministic order, responsive browser checks.

### `Материалы` regression

Mitigation: thin adapters over a shared component, focused regression assertions, and browser comparison.

## Process Memory Requirements

Implementation Agent must keep `tasks.md` current with:

- completed task checkboxes;
- exact changed files;
- mapping/review counts;
- generated evidence summary;
- dead ends;
- unmatched-ticket blocker evidence;
- known issues;
- verification commands and results;
- Implementation Agent feedback for Architect disposition.

Orchestrator must route every feedback item to Architect. Final Architect validation occurs only after implementation, review, checks, and follow-up development are complete; final Analyst validation follows only after Architect passes.
