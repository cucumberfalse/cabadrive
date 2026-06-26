# Implementation Plan: Evidence-Backed Ticket Placement In Руководство

## Architectural Decision

Implement the feature as a governed cross-reference layer, not as edits to manual section content.

The mapping is stored in reviewed range shards keyed by canonical `questionId`; routes and exact anchors are separately inventoried and fingerprinted. The preferred path requires answer-bearing evidence. When a documented audit proves that none exists, the general owner decision of `2026-06-23` permits an explicitly marked `owner-approved-thematic-fallback` on the closest substantive eligible page. Runtime joins the mapping to canonical ticket, translation, explanation, answer, source, difficulty, and image data. One shared appendix component is appended after each route's existing content.

This design prevents content drift, makes all `460` coverage machine-verifiable, and preserves the user's prohibition on changing existing manual text and images.

## Delivery Shape

Use one implementation PR slice on the Orchestrator-assigned isolated worktree/branch.

One PR is preferred because validator, route inventory, reviewed mapping, runtime join, shared renderer, immutable-content baseline, and browser evidence form one inseparable acceptance gate. Splitting infrastructure from mappings would temporarily permit an incomplete or unvalidated surface and complicate effective-head validation.

For historical remediation of `F038-RA-005`, PR `#204` used one Implementation Agent in the existing isolated worktree/branch. The semantic corrections and lean runtime projection shared the reviewed shard, manifest, evidence, generator/validator, runtime index, tests, and process memory. That remediation is complete at effective content head `c32d6d93998feaa03ab371378a067acddf608cb4`; the later pushed heads through pre-validation PR head `47cded8f8909d9db044041b033b19bb1a15077d0` are process/evidence-only successors touching only `specs/038-manual-ticket-placement/spec.md`, `plan.md`, and `tasks.md`. Final Architect validation passed at `2026-06-26T14:18:19Z` for effective content head `c32d6d93998feaa03ab371378a067acddf608cb4`. The validation evidence commit to be published by the assigned workflow must be treated as Architect-validation evidence-only, not as a new effective content head.

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

The `F038-RA-001` audit is invalidated by fresh review `4561846977`. Rebuild all `460` records from reviewed ticket-topic assignments and curated topic routes; do not carry forward a strict classification, fallback destination, or approval solely because it exists in the current shards.

Use five sequential checkpoints:

1. tickets `001..092`;
2. tickets `093..184`;
3. tickets `185..276`;
4. tickets `277..368`;
5. tickets `369..460`.

For each ticket, the assigned IA must inspect the canonical Spanish/Russian question, canonical correct answer, image when present, candidate page context, and exact resolved learner-visible anchor text. The checkpoint record must state either:

- the exact proposition independently and unambiguously supplied by the anchor, how it selects the correct option and excludes distractors, and why no external knowledge is required; or
- why the strict gate fails and which reviewed topic route supplies the approved fallback page and curated anchor.

At each checkpoint, update the reviewed shard, ticket-topic assignment, and reviewed manifest together, run structural/freshness/routing validation, and record counts of audited, answer-bearing, fallback, corrected-topic, corrected-page, corrected-anchor, overrides, and unresolved tickets. Do not mark the checkpoint complete while any ticket in its range retains a scorer-selected semantic decision or a non-self-sufficient strict rationale.

### Curated topic routing

1. Inventory the actual stable ticket/topic-guide taxonomy, expected to contain approximately `38` topics.
2. Create `content/manual-ticket-placement/topic-routes.json`.
3. For each topic, curate one preferred substantive eligible manual page or a small ordered set and exact stable thematic anchors per page.
4. Create a reviewed ticket-topic assignment covering all `460` canonical IDs.
5. Seal both artifacts in `reviewed-manifest.json`.
6. Allow a ticket-specific route override only with exact anchor, rationale, reviewer metadata, fingerprints, and a regression fixture.
7. Prohibit global anchor ranking from writing routes, pages, anchors, placement bases, rationale, or approval.

Minimum route regressions:

- lights → `ch3-lights`;
- fatigue/reaction → `ch4-sleep-fatigue` or, only when controlling, `ch4-distractions`;
- hangover/alcohol/drugs → `ch4-alcohol-drugs`;
- headrest/neck injury/occupant protection → `app1-safety-elements`;
- incident duties → `ch2-incident-obligations`;
- signs → matching Appendix IV sign pages.

### No-answer audit and thematic fallback

If no eligible route contains the answer for a ticket:

1. do not mislabel a thematic placement as answer-bearing;
2. do not edit manual content;
3. assign the ticket to its reviewed topic route;
4. select the first applicable approved route page and one of its curated thematic anchors;
5. create one `owner-approved-thematic-fallback` with the common owner decision reference/date, route ID, exact anchor, selection rationale, approved review, and fresh fingerprints;
6. leave coverage failing and hand back to Orchestrator only when no substantive thematic page exists.

### F038-RA-003 bounded remediation

1. Upgrade every current fallback record to the mandatory ticket-specific ledger defined in `spec.md`: distinct searched concepts, one exact selected candidate, at least one exact rejected candidate, rejection reasons, no-answer conclusion, and comparative selection rationale.
2. Work sequentially through the five existing shards. After each shard, run the focused validator/tests and record audited count, complete-ledger count, corrected destination/anchor count, and unresolved count.
3. Restore `b-fallback-042` to the `information-signs` route and exact `app4-signs-informational` entry `app4informational-p191-019-terminal-de-omnibus-catalog-entry`; compare and reject the current generic public-transport anchor in its ledger.
4. Restore `b-fallback-126` to `app1-safety-elements` at `pre-driving-checks.itemsRu[0]`; retain explicit comparisons with the oil-filter and professional inspection-fluid candidates.
5. Update the reviewed manifest and deterministic evidence only after all ledgers and both ticket invariants pass.
6. Keep generator/scorer behavior candidate-only. It may not synthesize approval metadata, selected outcomes, rejection reasons, audit conclusions, or comparative rationales.

Exact Implementation Agent write scope:

- `content/manual-ticket-placement/topic-routes.json`;
- `content/manual-ticket-placement/ticket-topic-assignments.json`;
- `content/manual-ticket-placement/placements/001-092.json`;
- `content/manual-ticket-placement/placements/093-184.json`;
- `content/manual-ticket-placement/placements/185-276.json`;
- `content/manual-ticket-placement/placements/277-368.json`;
- `content/manual-ticket-placement/placements/369-460.json`;
- `content/manual-ticket-placement/reviewed-manifest.json`;
- `content/validation/manual-ticket-placement.evidence.json`;
- `scripts/manual-ticket-placement-lib.mjs`;
- `scripts/content-manual-ticket-placement.mjs` only if the command wrapper must expose the stricter validation summary;
- `tests/manual-ticket-placement.test.mjs`;
- `tests/e2e/manual-ticket-placement.spec.ts` only if the `042` route move changes an existing deterministic density/route assertion;
- `docs_project/project/backend/backend-docs.md` only to document the now-mandatory fallback ledger;
- `specs/038-manual-ticket-placement/tasks.md` for Implementation Agent evidence.

No other file is allowed without a new Architect disposition. In particular, do not edit protected manual source/images, canonical questions/translations/explanations/images, runtime UI/CSS, package metadata, lockfiles, route inventory/baseline files, frontend docs, or unrelated tests.

Acceptance:

- all `460` fallback records contain complete ticket-specific ledgers;
- all selected and rejected candidate anchors resolve and are fresh;
- every selected ledger candidate equals its committed placement;
- `042` and `126` satisfy their exact invariants;
- manifest/evidence are current and all validator counters are zero;
- focused negative tests cover missing concepts, missing rejected candidate, unresolved/stale candidate anchor, selected/placement mismatch, generic ledger reuse, and alternate `042`/`126` anchors;
- protected/canonical content remains unchanged;
- required local checks pass and a new effective content head is recorded.

Freshness:

- any mapping, route, assignment, manifest, validator, test, or durable-doc change in this remediation creates a new effective content head;
- Review Agent review `4565465801`, effective content head `2cc53914622a5e1015b3c0ca322931f64c32d7f8`, and evidence-only head `0dc37b6d3b3f426c24a979dd0590984acb1e0e4a` cannot authorize merge afterward;
- all three current threads require fresh Review Agent disposition on the new head;
- final Architect validation remains forbidden until fresh review passes, required checks are green, threads are resolved/outdated, and process memory is current;
- any later non-evidence change stales that fresh review and all subsequent final-validation evidence.

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
4. Generate a deterministic lean runtime projection with only `questionId` and sorted `pageIds`; importing reviewed shards into browser runtime is forbidden.
5. Expose a typed `placementsByPageId` lookup without duplicating ticket prose.
6. Update backend docs with the validator, files, commands, and failure contract.

### Reviewed source and candidate separation

1. Refactor the scorer into candidate-only output. Candidate generation must write to a separate ignored/ephemeral report or stdout and must not write placement shards.
2. Treat committed placement shards plus `reviewed-manifest.json` as the only approved source.
3. Make `generate:manual-ticket-placement` preserve reviewed records and fail when reviewed source/manifest is absent or stale; it may regenerate only derived route inventory, fingerprints, runtime index, and summary evidence.
4. Reserve generator identities and reject them in approved review metadata.
5. Reject generic rationale patterns, identical answer-substitution templates, and missing exact `anchorTextAtReview`.
6. Remove the hard-coded `fallbackCount === 2` gate. Derive fallback count and IDs from the completed audit.
7. Add immutable manifest checks for every record and every shard.
8. Add known-false regression fixtures for `b-fallback-003`, `b-fallback-011`, and `b-fallback-042`.
9. Validate the curated topic-routing table and ticket-topic assignment.
10. Reject strict records without the direct-answer assertion and distractor-aware rationale.
11. Reject fallback pages/anchors outside the assigned route and reject unreviewed overrides.
12. Add fresh-review regressions for `037`, `064`, `085`, `165`, `202`, `281`, `349`, `350`, `404`, and `431`.

These checks demonstrate provenance and catch known bad patterns; they do not mechanically prove semantic correctness. The per-ticket audit remains mandatory.

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
- Candidate/scorer output cannot create or overwrite reviewed approvals, placement basis, rationale, or reviewer metadata.
- Generic boilerplate rationale and reserved/synthetic reviewer metadata are rejected.
- Missing, stale, or inconsistent reviewed-manifest evidence is rejected.
- Regeneration preserves reviewed mapping source and fails closed when reviewed source is absent/stale.
- Known false mappings for `b-fallback-003`, `b-fallback-011`, and `b-fallback-042` are rejected.
- Fallback count is audit-derived and may exceed two.

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
- all five audit checkpoints cover `460/460` tickets and have no carried-forward scorer approvals;
- reviewed source/manifest provenance and regeneration preservation;
- candidate-only scorer behavior;
- known false fixtures are corrected and protected by negative tests;
- final answer-bearing/fallback counts are audit-derived;
- automated semantic validation limits are documented and not misrepresented.

## Risks And Mitigations

### False semantic relevance

Mitigation: exact visible-text anchors, explicit ticket-by-ticket review, exact anchor text stored at review time, ticket-specific rationale, non-generator approval metadata, immutable reviewed manifest, fingerprint freshness, and Review Agent inspection. Lexical/topic scoring is candidate discovery only.

### Unmatched fallback-bank question

Mitigation: preserve answer-bearing placement as the preferred path. When unavailable, apply the schema-bound general owner rule with a documented no-answer audit and closest substantive thematic page. Fail closed and escalate only if no substantive thematic eligible page exists. Never alter manual/ticket content or conceal fallback evidence.

### Canonical drift

Mitigation: question, translation, correct-answer, image, anchor, and page fingerprints.

### Manual-content mutation

Mitigation: protected file hashes, referenced image byte hashes, page content fingerprints, and a rule that implementation does not edit protected content files.

### Dense pages

Mitigation: route-end disclosure, zero hidden rich cards while closed, lazy local images, deterministic order, responsive browser checks.

For `F038-IA-003`, preserve the native `<details>/<summary>` accessibility behavior and make the smallest lifecycle correction: add `key={pageId}` to the dense appendix `<details>` in `src/App.tsx`. This forces a fresh closed native disclosure node when navigation changes from one dense `pageId` to another, while the existing `pageId` effect resets React `expanded` state and keeps closed appendices at zero mounted rich cards.

Extend the first test in `tests/e2e/manual-ticket-placement.spec.ts` rather than creating a parallel fixture:

1. open `ch3-right-of-way` and its `44`-ticket disclosure;
2. prove the source disclosure mounted `44` cards;
3. navigate to dense `app1-safety-elements` with `26` tickets;
4. assert the destination `details[data-testid="manual-ticket-disclosure"]` has no `open` attribute;
5. assert the destination appendix has zero mounted `.materials-ticket` cards.

Do not replace the native disclosure, change the direct-render threshold, eagerly render hidden cards, alter ticket/manual content, or broaden the fix beyond `src/App.tsx`, the focused Playwright spec, and Implementation Agent evidence in `tasks.md`.

### `Материалы` regression

Mitigation: thin adapters over a shared component, focused regression assertions, and browser comparison.

## F038-RA-004 Follow-up Plan

One Implementation Agent must remediate blocking review `4565608440` on PR `#204`. Starting state is current evidence-only head `f6f9484d3869c7beea957cd3458c826cb008d467` over effective content head `0f777a89450e26608b3eeda7c9198959ce576179`. Parallel work may exist; preserve every sibling worktree, branch, commit, PR, dirty diff, and process-memory record.

Execution sequence:

1. Add an advisory contradiction detector over all rejected fallback candidates. Compare exact learner-visible anchor text with canonical Spanish and Russian correct answers using normalized equality, containment in both directions, numeric/unit equivalence, and a reviewed semantic-equivalence hook. Do not let the detector approve or classify records.
2. Run the detector across all five shards and record the complete candidate ID set. The Architect baseline scan found `39` lexical candidates; implementation must explain any count difference and must also add manually discovered semantic equivalents.
3. Re-audit every reported candidate against the full canonical question, correct answer, distractors, exact anchor, destination page, and any necessary local visual context.
4. When the exact anchor independently supplies the complete answer, select that anchor and convert the placement to `answer-bearing`; remove fallback-only fields and add direct-answer, distractor-aware review evidence.
5. Retain fallback only when the overlap is demonstrably negated, partial, differently scoped, conditional, ambiguous, or otherwise not self-sufficient. Record a structured ticket-specific `not-self-sufficient` disposition; generic denial is forbidden.
6. Re-run the contradiction detector and validator until there are zero undisposed contradictions and zero answer-bearing candidates rejected in favor of generic prose.
7. Seal changed placements, candidate dispositions, any necessary route/assignment/override updates, and final audit-derived totals in the reviewed manifest and deterministic evidence.
8. Update `tasks.md` with per-shard screened/reclassified/retained/unresolved counts, exact changed files, command results, the new effective content head, and accurate live blockers.

Required fixtures:

- rejection: `001`, `065`, and `086` cannot remain fallback while rejecting their exact answer-bearing anchors;
- acceptance: an exact selected anchor with valid `answer-bearing` evidence passes;
- justified fallback: `026` passes only with a negated/warning limitation, and `202` passes only with the missing more-than-two-tracks limitation;
- rejection: undisposed contradiction, generic limitation, contradiction between limitation and exact text, fallback fields on an answer-bearing record, or stale manifest/evidence totals.

Exact allowed implementation files:

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
- `tests/e2e/manual-ticket-placement.spec.ts` only if corrected destinations change existing deterministic density fixtures;
- `docs_project/project/backend/backend-docs.md` only to document the durable contradiction-disposition validator contract;
- `specs/038-manual-ticket-placement/tasks.md` only for Implementation Agent evidence and current process status.

Forbidden:

- protected manual prose/images, route inventory, protected baseline, or canonical ticket/translation/explanation/answer/difficulty/image changes;
- runtime UI/CSS, package/lockfile, frontend docs, or unrelated tests;
- automatic semantic approval from containment/equivalence detection;
- edits to `spec.md` or `plan.md` by Implementation Agent;
- commit/push/review/thread resolution/merge/final validation by Architect.

Verification must include focused contradiction-detector and mutation fixtures, `pnpm run validate:manual-ticket-placement`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, focused Playwright when density fixtures change, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check`. Protected/canonical diff guards must remain empty.

Any implementation change creates a new effective content head and makes review `4565608440`, head `f6f9484d3869c7beea957cd3458c826cb008d467`, and effective content head `0f777a89450e26608b3eeda7c9198959ce576179` stale for merge authorization. Fresh Review Agent review is mandatory. Final Architect validation is not part of this follow-up and may begin only after fresh review passes, required checks are green, blocking threads are resolved/outdated, and process memory is current.

## F038-RA-005 Follow-up Plan

Historical status: one Implementation Agent remediated review `4574141351` and active runtime thread `PRRT_kwDOSX65IM6MBvab` on PR `#204`. The original starting state was current evidence-only head `002f98814f92299edeb377c34ba40eb2341d589f` over effective content head `2cd692fb6babdc1404f8210bd5ef5c9f2cd5b4ea`. The completed remediation effective content head is `c32d6d93998feaa03ab371378a067acddf608cb4`; Review Agent review `4579222926` confirmed the content/runtime fixes passed and found only stale Architect-owned process memory. The plan below is retained as historical implementation guidance and is not a remaining product/runtime task.

### Package A — exact semantic corrections

1. Correct only the three reviewed records in `placements/369-460.json`:
   - `390` → `ch3-adverse-conditions`, `rain.itemsRu[1]`, exact low-beam text;
   - `422` → `app3-safety-elements`, `seatbelt-source-visual`, term `Debe colocarse sobre los huesos de la cadera`, `cards.0.termTranslations.2.translationRu`;
   - `430` → `ch3-right-of-way`, `other-priority-situations.itemsRu[1]`, exact narrow-incline/ascending-vehicle rule.
2. Re-review each against the full canonical question, image, correct answer, and distractors. Preserve `answer-bearing` only with fresh direct-answer and distractor-aware evidence.
3. Update route/assignment evidence only as needed for `390`; do not alter unrelated routes or tickets.
4. Rebuild reviewed manifest, contradiction evidence, totals, destinations, and density.
5. Add mutation fixtures that reject the exact three reported wrong anchors and require the approved propositions.

Package A acceptance:

- all three exact anchors resolve and are fresh;
- the canonical images plus anchors identify the correct options without importing another rule;
- wrong lamp type, abdomen-only distinction, and railway-crossing scope cannot validate;
- all other `457` ticket records remain canonical-JSON-equivalent except derived manifest/evidence effects.

### Package B — lean runtime projection

1. Add a pure `buildManualTicketRuntimeProjection(records)`-equivalent helper.
2. Generate `content/manual-ticket-placement/manual-ticket-placement.runtime.json` with:
   - `schemaVersion`;
   - `contentKind: "manual-ticket-placement-runtime"`;
   - sorted `records`, each containing only `questionId` and sorted unique `pageIds`.
3. Make generation write this derived file together with other derived evidence.
4. Make validation compare the committed runtime file to a freshly built projection by exact canonical JSON and reject missing, stale, reordered, duplicate, extra, or incomplete data.
5. Validate an exact recursive field allowlist; governance/review/audit/rationale/anchor/fingerprint/route/basis/topic/candidate fields are forbidden.
6. Change `src/data/manualTicketPlacement.ts` to import only the lean runtime file and construct the same sorted page-to-question lookup.
7. Add tests for exact projection equality, malformed/stale projection rejection, forbidden fields, runtime-source import boundaries, and lookup equality.
8. Run a clean production build and verify the entry chunk does not contain `auditConclusionRu`, `selectionRationaleRu`, `searchedConcepts`, `candidatesReviewed`, or `contradictionReview` from manual-placement data.

Package B acceptance:

- runtime behavior, ticket ordering, route appendices, and canonical ticket joins are unchanged;
- reviewed shards remain the only semantic source and are not browser imports;
- the runtime projection is deterministic, minimal, and exactly fresh;
- no fixed bundle-size threshold is introduced.

Exact allowed implementation files:

- `content/manual-ticket-placement/placements/369-460.json`;
- `content/manual-ticket-placement/topic-routes.json` only if required for `390`;
- `content/manual-ticket-placement/ticket-topic-assignments.json` only if required for `390`;
- `content/manual-ticket-placement/reviewed-manifest.json`;
- `content/manual-ticket-placement/manual-ticket-placement.runtime.json`;
- `content/validation/manual-ticket-placement.evidence.json`;
- `scripts/manual-ticket-placement-lib.mjs`;
- `scripts/content-manual-ticket-placement.mjs`;
- `src/data/manualTicketPlacement.ts`;
- `tests/manual-ticket-placement.test.mjs`;
- `tests/e2e/manual-ticket-placement.spec.ts` only if destination-density fixtures change;
- `docs_project/project/backend/backend-docs.md`;
- `specs/038-manual-ticket-placement/tasks.md`.

Forbidden:

- protected manual prose/images, canonical ticket content, route inventory, protected baseline, `src/App.tsx`, CSS, package/lockfiles, frontend docs, unrelated tests, and Architect-owned artifacts;
- commit/push/review/thread resolution/merge/final validation by Architect;
- semantic auto-approval or runtime projection becoming reviewed source.

Verification must include focused semantic/runtime-projection mutation tests, `pnpm run validate:manual-ticket-placement`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, bundle-marker inspection, focused Playwright if density fixtures change, `pnpm run test:e2e`, `pnpm run preflight`, protected/canonical diff guards, and `git diff --check`.

Any implementation change creates a new effective content head and makes review `4574141351`, current head `002f98814f92299edeb377c34ba40eb2341d589f`, and effective content head `2cd692fb6babdc1404f8210bd5ef5c9f2cd5b4ea` stale for merge authorization. Fresh Review Agent review is mandatory after both packages. Final Architect validation is not part of this follow-up and may begin only after fresh review passes, required checks are green, blocking threads are resolved/outdated, and process memory is current.

## F038-RA-006 Follow-up Plan

Review Agent review `4579222926` on PR `#204` accepted the `F038-RA-005` content/runtime remediation and raised one blocking process-memory finding: `spec.md` and `plan.md` still described old heads and outstanding `F038-RA-005` work. The reviewed/current head is `cdb13166af2f6abea868c887990d763afe2c0ea9`; the effective content head is `c32d6d93998feaa03ab371378a067acddf608cb4`; the post-effective-head diff reported by Review Agent is tasks-evidence-only.

Architect scope for this return is limited to:

1. update `specs/038-manual-ticket-placement/spec.md` and this `plan.md` so current/effective heads, completed `F038-RA-005` state, remaining gates, and final-validation status are accurate;
2. update `specs/038-manual-ticket-placement/tasks.md` only to record the Architect disposition/current process status;
3. leave clear evidence that this correction is process-memory-only and changes no implementation requirements, product/runtime code, placement data, validators, tests, or durable product docs;
4. do not perform final Architect validation.

Architect return count becomes `6 / 10`. Required Implementation Agent follow-up is to commit and push the Architect-owned artifact updates through the assigned workflow. No additional product implementation is required by this disposition unless fresh review, checks, or Orchestrator current-head guards find a new issue. After the artifact update is published, Orchestrator must obtain fresh Review Agent/current-head disposition, verify required checks and thread state, and only then request final Architect validation.

## F038-FAV-001 Final Architect Validation Gap

Final Architect validation was attempted at `2026-06-26T12:04:43Z` against the actual GitHub PR head `c12da38f28781c3c4ec168c5dbef0e3e940eeb2f`, with effective content head `c32d6d93998feaa03ab371378a067acddf608cb4`.

Read-only validation confirmed:

1. the post-effective-head diff remains process-memory-only (`tasks.md` at `cdb13166af2f6abea868c887990d763afe2c0ea9`, then `spec.md`/`plan.md`/`tasks.md` at `c12da38f28781c3c4ec168c5dbef0e3e940eeb2f`);
2. `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` were green on `c12da38f28781c3c4ec168c5dbef0e3e940eeb2f`;
3. `AI Review` was still `IN_PROGRESS`;
4. one current-head review thread on `spec.md` line `11` remained unresolved because the live status blocks still named `cdb13166af2f6abea868c887990d763afe2c0ea9` as the current head.

Final Architect validation therefore does not pass in this attempt. The remaining work is still process-memory/final-gate only:

1. reconcile the live current-head references in `spec.md`, `plan.md`, and `tasks.md` to `c12da38f28781c3c4ec168c5dbef0e3e940eeb2f`;
2. publish those Architect-owned artifact updates;
3. obtain fresh current-head Review Agent disposition or have the unresolved thread become addressed/outdated;
4. wait for `AI Review` to finish green on the actual current PR head;
5. rerun final Architect validation before any final Analyst validation.

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
- per-range re-audit checkpoints and correction counts;
- reviewed-manifest hashes and provenance;
- evidence that generator/scorer paths cannot create approvals;
- final audit-derived answer-bearing/fallback counts.

Orchestrator must route every feedback item to Architect. `F038-RA-005` implementation is complete at effective content head `c32d6d93998feaa03ab371378a067acddf608cb4`, followed only by process/evidence-only successors through pre-validation PR head `47cded8f8909d9db044041b033b19bb1a15077d0`. `F038-FAV-001` remains a historical failed final-validation attempt from `2026-06-26T12:04:43Z`; its live-current-head, unresolved-thread, and pending-`AI Review` blockers were corrected before the passing validation below. Final Analyst validation follows only after Architect passes.

Final Architect validation has since passed at `2026-06-26T14:18:19Z` for effective content head `c32d6d93998feaa03ab371378a067acddf608cb4`. Pre-validation PR head `47cded8f8909d9db044041b033b19bb1a15077d0` was process/evidence-only over that effective content head; fresh Review Agent review `4580025675` reported no blocking findings, all review threads were resolved after disposition of `PRRT_kwDOSX65IM6MigTD`, and required checks were green.
