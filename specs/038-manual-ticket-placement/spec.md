# Specification: Evidence-Backed Ticket Placement In Руководство

## Status And Ownership

- Feature: `038-manual-ticket-placement`
- Role owner of this artifact: Architect
- Analyst intake: `specs/038-manual-ticket-placement/feature-request.md`
- Assigned base: `origin/main` at `4247b0e90ae5799a0875cc3751c96589fef96ef2`
- Intended delivery: one implementation branch and one PR slice unless Orchestrator records an objective blocker requiring a new latest-main slice
- Parallel-work rule: preserve all sibling worktrees, branches, commits, PRs, dirty diffs, and process memory
- Current PR/head: `#204` / `002f98814f92299edeb377c34ba40eb2341d589f`
- Process status: `review-blocked` by Review Agent review `4574141351` plus active runtime thread `PRRT_kwDOSX65IM6MBvab`; bounded `F038-RA-005` remediation is required
- Effective content head `2cd692fb6babdc1404f8210bd5ef5c9f2cd5b4ea` is followed only by tasks evidence commits `cdf8015...` and `002f988...`; `F038-RA-004` implementation is complete, this Architect update reconciles live status, and tickets `390`, `422`, `430` plus the lean runtime-projection requirement remain implementation blockers

## Goal

Append every canonical ticket in the current `460`-question fallback bank to the end of between one and three substantive `Руководство` routes. The preferred placement basis is existing learner-visible text that independently contains the information needed to select the canonical correct answer. When a documented good-faith corpus audit proves that no such anchor exists, the owner decision of `2026-06-23` authorizes a governed placement on the closest substantive eligible page by topic without changing manual or ticket content.

The learner must receive the canonical Spanish question and answers, governed Russian translations, canonical local image when present, and clearly identified correct answer in a read-only presentation consistent with `Материалы`. Existing manual text, structured values, images, image paths, ordering, and visual composition are immutable for this feature.

## Scope

### In scope

- A complete inventory of all learner-facing interactive `Руководство` routes and their eligibility.
- A reviewed, durable mapping for every current canonical question ID.
- One to three independently valid placements per question.
- Stable answer-bearing text anchors and concise semantic rationale for every ordinary placement.
- Explicitly marked, fingerprinted, audited thematic anchors for canonical tickets that have no answer-bearing anchor and qualify under the owner-approved fallback rule.
- Freshness fingerprints for canonical question data, governed translation data, destination page content, and exact anchor text.
- Runtime joins to canonical questions, translations, explanations, source metadata, difficulty, and local images.
- A shared read-only canonical ticket renderer or an equivalent extraction that leaves `Материалы` behavior unchanged.
- Ticket appendices rendered only after all existing content of the selected Introduction or manual-section route.
- Deterministic content validation, immutable-content guards, focused tests, browser evidence, and standard repository checks.
- Durable frontend/backend documentation updates for the new mapping and validator contract.

### Out of scope

- Any edit to existing manual prose, list/table values, captions, labels, source metadata, images, image assets, crop metadata, or block order.
- Adding manual prose to manufacture a match.
- Copying canonical Spanish/Russian ticket content into manual section files.
- Changing canonical questions, answers, correct answer IDs, translations, explanations, images, difficulty, or fallback status.
- Runtime semantic matching, runtime AI, network fetches, backend services, or PDF rendering.
- Interactive answering or exam-attempt behavior inside `Руководство`.
- Placements on non-substantive pages or navigation surfaces.

## Current Baseline

- Canonical bank: `content/questions/caba-b.unofficial-fallback.questions.json`
- Baseline bank size: `460` distinct IDs
- Governed translations: `content/translations/ru/*.json`
- Governed explanations: `content/explanations/ru/*.json`
- Existing reference renderer: `TopicGuideTicketBlock` in `src/App.tsx`
- Introduction route source: `src/data/pandemiaVialSection.ts`
- Manual section source: `src/data/manualGuide.ts` and `src/data/manual-sections/*.ts`
- Sign catalog source: `src/data/manual-signs/app4SignEntries.json`
- Implemented manual sections at the assigned base: `50`
- Explicitly ineligible implemented front sections: `front-presentation`, `front-categories`, `front-glossary`
- Substantive candidate routes at the assigned base: four Introduction routes plus the remaining `47` implemented manual sections, subject to explicit inventory review

## Page Identity And Eligibility

### Page identity

A page is a learner-facing interactive route, not a raw PDF page. Its stable `pageId` is:

- the `IntroductionRouteId` for Introduction routes, for example `intro-incident`; or
- the `ManualGuideSectionEntry.id` for manual sections, for example `ch3-speed`.

`routeHash` is stored and validated as route metadata but is not the primary identity.

### Inventory

Create `content/manual-ticket-placement/manual-pages.json` with one record for every route reachable from `manualGuideNavigation`, including implemented, pending, and explicitly excluded routes. Navigation groups are inventoried as non-page support records only when needed to prove they cannot receive placements.

Each page record has this durable shape:

```json
{
  "pageId": "ch3-speed",
  "routeHash": "#manual-section-ch3-speed",
  "surfaceKind": "manual-section",
  "implementationStatus": "implemented",
  "eligibility": "eligible",
  "eligibilityReasonRu": "Содержит правила, числовые лимиты и определения скорости.",
  "contentSourceIds": ["ch3-speed-content"],
  "contentFingerprint": "<64-hex sha256>",
  "review": {
    "status": "approved",
    "reviewedBy": "feature-038-semantic-review",
    "reviewedAt": "<ISO 8601>"
  }
}
```

Allowed values:

- `surfaceKind`: `introduction` | `manual-section` | `navigation-support`
- `implementationStatus`: `implemented` | `pending` | `navigation-only`
- `eligibility`: `eligible` | `ineligible`
- `review.status`: `approved`

### Eligibility rule

A route is eligible only when it is implemented, learner-facing, and contains substantive selectable instructional text such as rules, definitions, obligations, exceptions, numerical values, explanatory captions, table/list content, or sign names/meanings.

The inventory must explicitly mark these as ineligible:

- `front-presentation`
- `front-categories`
- `front-glossary`
- contents/index and navigation-only records
- all pending/disabled placeholders
- title/divider/chapter-cover-only routes
- logo, credits, closing-message, or decorative-only routes
- any implemented route whose existing text cannot independently answer any mapped ticket

The four current Introduction routes are inventoried individually and may be eligible because they contain substantive text:

- `intro-road-pandemic`
- `intro-ethical-civic-approach`
- `intro-incident`
- `intro-road-safety-plan`

Implementation status alone never implies eligibility.

## Durable Mapping And Evidence Schema

### Files

Store mapping records in deterministic range shards:

```text
content/manual-ticket-placement/
  manual-pages.json
  placements/
    001-092.json
    093-184.json
    185-276.json
    277-368.json
    369-460.json
  manual-content-baseline.json
content/validation/
  manual-ticket-placement.evidence.json
```

The shard boundaries mirror existing translation/explanation ownership and keep review diffs bounded. They are validation/review source and must not be imported into the browser bundle. Runtime imports a generated lean projection containing only the fields needed to build the page-to-question lookup, and validation checks exact deterministic equality between that projection and the reviewed shards.

### Per-ticket record

```json
{
  "questionId": "b-fallback-001",
  "canonicalEvidence": {
    "questionFingerprint": "<64-hex sha256>",
    "translationFingerprint": "<64-hex sha256>",
    "correctAnswerIdAtReview": "b-fallback-001-a2",
    "correctAnswerFingerprint": "<64-hex sha256>",
    "imageFingerprint": "<64-hex sha256 or null>"
  },
  "review": {
    "status": "approved",
    "reviewedBy": "feature-038-semantic-review",
    "reviewedAt": "<ISO 8601>"
  },
  "placements": [
    {
      "pageId": "app4-signs-regulatory",
      "routeHash": "#manual-section-app4-signs-regulatory",
      "placementBasis": "answer-bearing",
      "anchor": {
        "kind": "manual-sign-entry",
        "blockId": "regulatory-individual-sign-catalog",
        "entryId": "<stable sign entry id>",
        "textPath": "russianTranslation",
        "textFingerprint": "<64-hex sha256>"
      },
      "answerBasisRu": "Подпись знака прямо называет значение, совпадающее с правильным вариантом ответа.",
      "review": {
        "status": "approved",
        "reviewedBy": "feature-038-semantic-review",
        "reviewedAt": "<ISO 8601>"
      }
    }
  ]
}
```

For an owner-approved thematic fallback, the placement shape is:

```json
{
  "pageId": "ch2-incident-obligations",
  "routeHash": "#manual-section-ch2-incident-obligations",
  "placementBasis": "owner-approved-thematic-fallback",
  "anchor": {
    "kind": "manual-block",
    "blockId": "incident-duty-core",
    "textPath": "textRu",
    "textFingerprint": "<64-hex sha256>"
  },
  "thematicBasisRu": "Якорь описывает обязательные действия после дорожного инцидента, включая выполнение необходимых сообщений; это наиболее близкий существующий содержательный контекст для вопроса об уведомлении страховщика после инцидента, хотя срок 72 часа в тексте страницы отсутствует.",
  "fallbackEvidence": {
    "auditId": "F038-IA-001",
    "questionId": "b-fallback-235",
    "ownerDecisionDate": "2026-06-23",
    "ownerDecisionRef": "feature-038-owner-decision-2026-06-23",
    "auditConclusionRu": "В существующем learner-visible тексте Руководства нет answer-bearing anchor для канонического ответа.",
    "searchedConcepts": ["72 horas", "72 часа", "tres días", "уведомление страховщика"],
    "candidatesReviewed": [
      {
        "pageId": "ch2-required-documents",
        "anchor": "<exact candidate anchor>",
        "rejectionRu": "Страница объясняет страховой документ, но хуже соответствует действию после инцидента."
      }
    ],
    "selectionRationaleRu": "Выбранный якорь является наиболее близким содержательным контекстом среди проверенных кандидатов."
  },
  "review": {
    "status": "approved",
    "reviewedBy": "feature-038-semantic-review",
    "reviewedAt": "<ISO 8601>"
  }
}
```

### Canonical fingerprints

Use SHA-256 over a versioned, stable JSON serialization:

- `questionFingerprint`: question ID, source/category/jurisdiction/status, Spanish question, ordered answer IDs and Spanish texts, canonical `correctAnswerId`, canonical image local path and SHA when present.
- `translationFingerprint`: question ID, Russian question translation, answer translations keyed by canonical answer ID.
- `correctAnswerFingerprint`: correct answer ID plus canonical Spanish and governed Russian text.
- `imageFingerprint`: canonical local path plus committed image SHA, or `null`.

Mapping data never supplies runtime question text, translation text, correct-answer identity, or image path. These values are evidence only; runtime always reads canonical content.

### Stable anchors

Every placement resolves to exactly one existing learner-visible text value. Preferred placements use that value as answer-bearing evidence. Governed thematic fallbacks use it as exact closest-topic evidence after a documented no-answer audit. `anchor.kind` is one of:

- `introduction-segment`
- `introduction-block`
- `manual-block`
- `manual-table-cell`
- `manual-list-item`
- `manual-card-text`
- `manual-term-translation`
- `manual-sign-entry`

Required locator fields by kind:

- Introduction segment: `segmentId`, `textPath`
- Introduction block: `blockId`, optional stable child ID, `textPath`
- Manual block: `blockId`, `textPath`
- Table cell: `blockId`, `rowId`, `cellIndex`, `textPath`
- List item: `blockId`, `itemIndex`, `textPath`; fingerprint makes index drift fail closed
- Card/structured child: `blockId`, stable `childId`, `textPath`
- Term translation: `blockId`, stable card/child ID where applicable, `termEs`, `textPath`
- Sign entry: `blockId`, `entryId`, `textPath`

The resolver must return the exact learner-visible string represented by the locator. It must reject:

- missing or ambiguous locators;
- source-only text that is not shown to the learner;
- image pixels without a qualifying visible text label;
- concatenating unrelated blocks to manufacture an answer;
- anchors outside the destination route;
- broad page-level fingerprints without an exact answer-bearing or closest-topic location.

`textFingerprint` is SHA-256 of normalized exact anchor text plus the anchor schema version and locator. `contentFingerprint` is a deterministic hash of all existing learner-visible text and existing image references on the page. Any drift requires semantic re-review, including fresh fallback audit and selection evidence where applicable.

### Semantic review

Automated candidate generation may assist review but cannot approve a mapping. Every ordinary placement requires:

- `placementBasis: "answer-bearing"`;
- `review.status: "approved"`;
- a concise `answerBasisRu` that explains how the anchored text yields the canonical correct answer;
- a fresh canonical question/answer fingerprint;
- a fresh anchor fingerprint;
- an eligible page.

Two or three placements are allowed only when each placement independently passes this contract. Topic similarity, filename similarity, image similarity, chapter proximity, or general driving knowledge are insufficient for an answer-bearing placement.

When the documented audit finds no answer-bearing anchor, `placementBasis: "owner-approved-thematic-fallback"` is permitted under the general owner decision recorded on `2026-06-23`. Every such placement must:

- target an implemented, substantive, explicitly eligible page;
- identify one exact learner-visible closest-topic anchor;
- record `auditId`, canonical `questionId`, `ownerDecisionDate: "2026-06-23"`, and `ownerDecisionRef: "feature-038-owner-decision-2026-06-23"`;
- record the no-answer audit conclusion, searched concepts/forms, candidate pages and exact anchors, and a rejection reason for each non-selected candidate;
- explain why the selected anchor is closer by subject and learning context than the rejected candidates, without claiming it contains the answer;
- carry approved ticket and placement review metadata plus fresh canonical question, translation, correct-answer, image, exact-anchor, and page-content fingerprints.

This fallback is not permission to choose an arbitrary related page, use an ineligible/support page, skip the audit, edit manual or ticket content, or label thematic evidence as answer-bearing. Implementation stops only when neither an answer-bearing placement nor any substantive thematically relevant eligible page exists.

### Durable reviewed-mapping workflow

The five committed placement shards are reviewed source data, not generator output. A machine may:

- inventory eligible pages and exact learner-visible anchors;
- rank or emit candidate pages/anchors into a separate candidate report;
- compute canonical, anchor, page, shard, and manifest fingerprints;
- validate structure, freshness, completeness, and immutable reviewed evidence.

A machine must not:

- create or overwrite a committed ticket or placement `review.status: "approved"`;
- set or change `placementBasis` to `answer-bearing` or `owner-approved-thematic-fallback`;
- create ticket-specific semantic rationale, no-answer conclusions, candidate rejection reasons, reviewer identity, or review timestamp;
- promote the highest lexical/keyword/topic score into a committed placement;
- rewrite reviewed shards when `--write` is used.

Each committed placement must be explicitly reviewed ticket by ticket against the canonical question, correct answer, image where applicable, exact resolved anchor text, and destination page context. The reviewed record must preserve:

- exact `anchorTextAtReview`, not only its fingerprint;
- a ticket-specific rationale explaining how that exact text yields the correct answer, or a complete no-answer and closest-topic fallback audit;
- non-generator reviewer metadata tied to the assigned audit pass;
- canonical and page fingerprints current at review time.

Add an immutable reviewed manifest, for example `content/manual-ticket-placement/reviewed-manifest.json`, containing the ordered question IDs, per-record canonical hash, exact reviewed placement hash, resolved-anchor-text hash, rationale/evidence hash, reviewer identity, review timestamp, and aggregate hashes for all five shards. Validation and regeneration must fail closed when the manifest is missing, stale, internally inconsistent, or references a reviewed source record that is absent. Regeneration may refresh derived inventory, fingerprints, runtime indexes, and aggregate evidence only by preserving reviewed records byte-for-byte or canonical-JSON-equivalent; it must never reconstruct approvals from a scorer.

Automated validation cannot prove semantic truth. It can prove that an explicit audit artifact exists, is ticket-specific, resolves to current text, has not been replaced by known boilerplate or generator metadata, and remains immutable relative to the reviewed manifest. Final semantic confidence still depends on the recorded per-ticket audit and Review Agent inspection.

### F038-RA-001 Architect disposition

Disposition: `task` — blocking Review Agent finding accepted.

Independent Architect verification on `2026-06-24` confirmed:

- `createPlacements` ranks all eligible anchors, selects `ranked[0]`, and immediately emits ticket and placement `review.status: "approved"` with `placementBasis: "answer-bearing"`;
- the emitted `answerBasisRu` is generic boilerplate that interpolates the correct-answer translation without explaining the actual anchor;
- the validator accepts the record when that boilerplate merely contains `канонический правильный ответ`;
- `generate:manual-ticket-placement --write` regenerates and overwrites the committed placement shards from this scorer-created output;
- committed false mappings include:
  - `b-fallback-003`: first action after a crash mapped to `Огнетушитель должен оставаться на месте при столкновении или опрокидывании...`;
  - `b-fallback-011`: low-flying-aircraft/airport sign mapped to `= 4700 полных самолетов`;
  - `b-fallback-042`: bus-terminal sign mapped to a list of steering-system types.

These examples establish a systemic provenance failure affecting the ordinary mapping set. The current `458` ordinary placements cannot be presumed reviewed, and correcting only the three known fixtures or bulk-reclassifying lexical guesses as thematic fallbacks is forbidden.

Required remediation:

1. remove scorer authority over committed placement basis, approval metadata, and rationale;
2. perform and record a fresh ticket-specific audit of all `460` canonical tickets;
3. preserve only mappings that pass that audit, correcting pages/anchors as needed;
4. classify every genuine no-answer case through the general owner-approved thematic fallback rule; the final fallback count may exceed `2`;
5. create and validate immutable reviewed-manifest evidence;
6. add negative tests for generic rationale, reserved/synthetic generator reviewer metadata, scorer-created approval attempts, reviewed-source overwrite, stale/missing manifest evidence, and the three known false fixtures;
7. regenerate all derived summaries from the re-audited reviewed source;
8. treat every product, mapping, validator, test, durable-doc, or process change after the prior review as a new effective content head requiring fresh Review Agent review and later final Architect/Analyst validation.

Final Architect validation is not performed by this disposition.

### F038-IA-003 Architect disposition

Disposition: `task` — active Review Agent finding accepted as a blocking follow-up.

Independent Architect verification on `2026-06-24` confirmed:

- `ManualTicketAppendix` stores card-mount state in React as `expanded` and resets it in a `useEffect` keyed by `pageId`;
- the dense branch renders an uncontrolled native `<details>` without an `open` prop or a `pageId` key;
- React can therefore reuse the same native disclosure node across dense-page navigation while the browser retains its `open` state independently of the later React-state reset;
- the existing Playwright route-transition assertion opens `ch3-right-of-way`, navigates to `app1-safety-elements`, and checks only that zero cards remain mounted; it does not assert that the new disclosure is natively closed.

Required remediation:

1. in `src/App.tsx`, add `key={pageId}` to the dense appendix `<details>` so a dense destination page receives a fresh native disclosure node in the default closed state;
2. retain the existing `expanded` state, `pageId` reset effect, conditional card mounting, native `<summary>`, and `onToggle` behavior;
3. in `tests/e2e/manual-ticket-placement.spec.ts`, extend the existing dense-page transition regression to open the `44`-ticket `ch3-right-of-way` appendix, navigate to the `26`-ticket `app1-safety-elements` appendix, and assert both that the destination disclosure lacks the native `open` attribute and that it contains zero mounted `.materials-ticket` cards;
4. preserve the accessibility contract of a native keyboard-operable `<details>/<summary>` disclosure, the direct-render threshold, deterministic ordering, lazy images, responsive layout, and the closed-state density contract of zero mounted rich ticket cards;
5. rerun focused Playwright for the manual-ticket spec and the normal required checks.

Allowed implementation files are exactly:

- `src/App.tsx`;
- `tests/e2e/manual-ticket-placement.spec.ts`;
- `specs/038-manual-ticket-placement/tasks.md` for Implementation Agent evidence.

The remediation effective content head `c956422ee159fde4ed1825b5806b3336515b7372` and later evidence-only head `2688192e36815cf81741882ebda68f29f3ca1030` remain valid historical evidence only. Any UI or test fix creates a new effective content head and makes prior review/final-validation evidence stale. Fresh Review Agent review and later final Architect/Analyst validation are required on that new effective content head.

This disposition does not increment the Architect return count because it classifies newly routed Implementation Agent/review feedback before final Architect validation; it is not a returned final-validation gap. Final Architect validation is not performed by this disposition.

### F038-RA-002 Architect disposition

Disposition: `task` — all three findings in fresh Review Agent review `4561846977` are accepted as blocking.

Independent Architect verification on `2026-06-24` confirmed:

- thread `3466813754`: the cited `b-fallback-037` anchor discusses motorcycle parking, not the sidewalk/carriageway distinction between `bicisenda` and `ciclovía`; the same extra-anchor inference is present in sampled strict records `064`, `085`, `165`, `202`, `281`, and `350`;
- thread `3466813762`: `b-fallback-349` routes a vehicle-lights question to a seat-belt-exception paragraph despite recording `ch3-lights` as a candidate; `404` routes fatigue/reaction loss to pedestrian text `Примерное время`; `431` routes hangover risk to truck off-tracking although `ch4-alcohol-drugs` is the direct topic page;
- thread `3466813766`: durable status still describes a pending push and the old dense-disclosure blocker although PR `#204` is already at `00fc30328d92dd890fafc45792ad1501bc3e392e`.

The first remediation fixed approval provenance but did not establish reliable semantic classification or closest-topic routing. Fingerprints, immutable manifests, and reviewer metadata cannot convert an unrelated anchor into answer-bearing evidence or prove that a fallback destination is the nearest topic page.

#### Conservative answer-bearing gate

`placementBasis: "answer-bearing"` is allowed only when all of the following are true:

1. the exact `anchorTextAtReview`, read in its existing page context, independently and unambiguously supplies the fact, rule, definition, sign meaning, numerical value, exception, or causal relationship needed to select the canonical correct answer;
2. the selection does not depend on unstated general driving knowledge, the implementation reviewer's interpretation of an image, another manual block, the ticket explanation, or wording copied from the canonical answer;
3. the record contains a ticket-specific `directAnswerAssertionRu` stating the proposition supplied by the anchor and a `reviewerRationaleRu` explaining how that proposition selects the correct option and excludes the relevant distractors;
4. the stored exact quote and locator resolve to one current learner-visible anchor and the reviewer metadata belongs to the new audit pass;
5. a conservative reviewer would reach the same answer from the anchor. If this is uncertain, the placement is a fallback.

Under-classification as `owner-approved-thematic-fallback` is safer than a false strict claim. No score, keyword overlap, topic label, page title, image resemblance, or global anchor ranking may satisfy this gate. All current `71` strict records must be re-audited; the final strict count may shrink substantially.

#### Curated thematic routing

Create a reviewed topic-routing source, `content/manual-ticket-placement/topic-routes.json`, covering the current ticket/topic-guide taxonomy (approximately `38` topics, using the repository's actual stable topic IDs). Each route record owns:

- stable `topicRouteId` and canonical topic ID/label;
- one preferred substantive eligible `pageId` or a small ordered list of approved pages;
- one or more exact stable thematic anchors for each approved page;
- Russian rationale explaining the page order and scope;
- reviewer identity, review timestamp, and fingerprints.

Every canonical ticket must receive one explicitly reviewed `topicRouteId` in a sealed ticket-topic assignment. For a thematic fallback:

- the destination page must belong to that topic route's approved ordered pages;
- the exact anchor must be one of that route's curated thematic anchors;
- selection normally uses the first applicable route page;
- a ticket-specific override is allowed only when it names another substantive eligible page, records why the route default is less suitable for this ticket, supplies an exact curated/override anchor, and is independently reviewed and regression-tested;
- global anchor ranking and arbitrary per-ticket lexical candidate selection are forbidden.

Required route expectations include:

- vehicle lights and lighting use → `ch3-lights`;
- fatigue, sleepiness, reaction loss, and rest → `ch4-sleep-fatigue`, or `ch4-distractions` only when distraction rather than fatigue is the controlling topic;
- alcohol, drugs, hangover, and impairment → `ch4-alcohol-drugs`;
- head restraints, neck injury, seat belts, airbags, and occupant protection → `app1-safety-elements`;
- incident duties → `ch2-incident-obligations`;
- signs → the matching substantive Appendix IV sign page when available.

These expectations are minimum regression fixtures, not an exhaustive routing table.

#### Required remediation

1. Rebuild all `460` reviewed records from the sealed ticket-topic assignment and curated topic-routing table; do not preserve a placement merely because it survived `F038-RA-001`.
2. Sequentially audit shards `001..092`, `093..184`, `185..276`, `277..368`, and `369..460` with one Implementation Agent on the current PR.
3. Apply the conservative answer-bearing gate to all `71` currently strict records; otherwise reclassify them as topic-routed fallback.
4. Re-audit all `389` current fallbacks against their reviewed topic route and replace arbitrary destinations/anchors.
5. Make candidate/scoring code advisory only; it may suggest a ticket topic but may not select a route, page, anchor, placement basis, review status, or rationale.
6. Extend the reviewed manifest to seal the topic-routing table, ticket-topic assignment, strict-gate assertions, placements, and all override evidence.
7. Update validator/tests so a fallback fails unless its page and anchor are approved by its ticket's route, and so every override is explicit, reviewed, fingerprinted, and fixture-backed.
8. Add regression fixtures for `003`, `011`, `037`, `042`, `064`, `085`, `096`, `165`, `202`, `281`, `349`, `350`, `404`, and `431`, plus representative headrest/neck-injury routing.
9. Reconcile all current-head, push, blocker, review, and merge-readiness statements. Product/mapping/validator/test/doc changes create a new effective content head and stale all prior effective-head evidence.

Architect return count becomes `2 / 10`. Final Architect validation is not performed by this disposition.

### F038-RA-003 Architect disposition

Disposition: `task` — all three findings in Review Agent review `4565465801` are accepted as blocking.

Independent Architect verification on `2026-06-24` confirmed:

- `PRRT_kwDOSX65IM6MBYWW`: all current `460` fallback records omit `searchedConcepts` and `candidatesReviewed`; the validator accepts generic audit conclusions and selection rationales, so the sealed manifest proves immutability but not the required ticket-specific no-answer/closest-page audit;
- `PRRT_kwDOSX65IM6MBYWc`: `b-fallback-042` is routed to generic public-transport prose although the learner-visible exact Appendix IV entry `app4informational-p191-019-terminal-de-omnibus-catalog-entry` labels the sign `автовокзал`;
- `PRRT_kwDOSX65IM6MBYWh`: `b-fallback-126` uses generic vehicle-condition prose instead of the already approved `manual-list-item` anchor `pre-driving-checks.itemsRu[0]` with text `Масло, охлаждающую жидкость и жидкость стеклоомывателя.`.

Formal dispositions:

1. `PRRT_kwDOSX65IM6MBYWW` → `task`: restore mandatory ticket-specific fallback audit evidence for every fallback record and enforce it structurally and negatively.
2. `PRRT_kwDOSX65IM6MBYWc` → `task`: assign `b-fallback-042` to topic route `information-signs`, page `app4-signs-informational`, and exact `manual-sign-entry` anchor `app4informational-p191-019-terminal-de-omnibus-catalog-entry`. The placement may remain conservatively classified as `owner-approved-thematic-fallback`, but the exact sign label must be the selected closest-topic anchor.
3. `PRRT_kwDOSX65IM6MBYWh` → `task`: restore the exact `F038-IA-002` destination and list-item anchor for `b-fallback-126`; generic page-level vehicle-condition prose is forbidden for this ticket.

#### Mandatory fallback audit ledger

Every `owner-approved-thematic-fallback` must contain a ticket-specific `fallbackEvidence` ledger with:

- `searchedConcepts`: at least two non-empty, distinct search concepts/forms derived from that ticket's canonical question, correct answer, governed translation, or image meaning; a single shared boilerplate array across tickets is invalid;
- `candidatesReviewed`: at least two distinct exact candidate anchors, including exactly one selected candidate and at least one rejected candidate;
- for every candidate: `pageId`, complete resolvable `anchor`, `anchorTextAtReview`, and outcome `selected-closest-topic` or `rejected`;
- for every rejected candidate: a ticket-specific `rejectionRu` explaining both why it does not supply the answer and why it is less suitable than the selected context;
- `auditConclusionRu`: a ticket-specific no-answer conclusion;
- `selectionRationaleRu`: a comparative rationale naming the selected page/anchor and at least one rejected candidate, without claiming the fallback anchor contains the answer.

The selected candidate must exactly equal the committed placement page and anchor. Every candidate anchor must resolve to current learner-visible text and carry fresh anchor/page fingerprints. The reviewed manifest must seal the complete ledger. Candidate generation may suggest evidence for human review but may not author, approve, or overwrite this ledger.

#### Ticket-specific invariants

- `b-fallback-042`:
  - `topicRouteId`: `information-signs`;
  - page: `app4-signs-informational`;
  - anchor kind: `manual-sign-entry`;
  - entry: `app4informational-p191-019-terminal-de-omnibus-catalog-entry`;
  - learner-visible Russian label must resolve to `автовокзал`;
  - the fallback audit must compare this exact sign entry against the rejected generic public-transport destination.
- `b-fallback-126`:
  - `topicRouteId`: `vehicle-condition-maintenance-loads`;
  - page: `app1-safety-elements`;
  - anchor kind: `manual-list-item`;
  - block: `pre-driving-checks`;
  - `itemIndex: 0`;
  - `textPath: itemsRu`;
  - learner-visible text must resolve to `Масло, охлаждающую жидкость и жидкость стеклоомывателя.`;
  - the fallback audit must retain the earlier comparisons with the oil-filter context and the professional inspection-fluid context.

Architect return count becomes `3 / 10`. This disposition is not final Architect validation.

### F038-RA-004 Architect disposition

Disposition: `task` — both findings in blocking Review Agent review `4565608440` are accepted.

Reviewed state:

- PR: `#204`;
- reviewed/current head: `f6f9484d3869c7beea957cd3458c826cb008d467`;
- effective content head: `0f777a89450e26608b3eeda7c9198959ce576179`;
- `f6f9484d3869c7beea957cd3458c826cb008d467` is an evidence-only successor to that effective content head;
- active threads: `PRRT_kwDOSX65IM6MBsV4` and `PRRT_kwDOSX65IM6MBsV8`.

Independent Architect verification on `2026-06-24` confirmed:

- `PRRT_kwDOSX65IM6MBsV4`: the validator verifies ledger shape, fingerprints, and selected-placement identity but does not reject a fallback whose rejected candidate independently supplies the canonical answer. `b-fallback-001` rejects exact learner-visible text `Поворот направо` while the canonical Russian correct answer is `Поворот направо.` and selects generic bicycle-introduction prose. The same defect is directly reproducible for `b-fallback-065` (`Извилистая дорога`) and `b-fallback-086` (the exact approximately-eight-hours sleep instruction).
- A normalization-based independent scan of all five current shards found `39` rejected-candidate/canonical-answer containment candidates, including every reviewer-named ID `001`, `065`, `086`, `120`, `144`, `203`, `350`, `380`, `401`, and `456`. This is a screening set, not an automatic answer-bearing verdict: examples such as `026` (`не отвечать автоматически 60 км/ч...`) and `202` (generic `железнодорожный переезд` without the required more-than-two-tracks distinction) contain answer text but are not necessarily self-sufficient.
- `PRRT_kwDOSX65IM6MBsV8`: `tasks.md` still names `F038-RA-003` as unimplemented at old head `0dc37b6...`, although its implementation record identifies effective content head `0f777a89450e26608b3eeda7c9198959ce576179`, current evidence-only head `f6f9484d3869c7beea957cd3458c826cb008d467`, complete ledgers, and restored `042`/`126` invariants.

Formal dispositions:

1. `PRRT_kwDOSX65IM6MBsV4` → `task`: detect and independently re-audit every rejected-candidate/canonical-answer containment or semantic-equivalence contradiction across all `460` records. Reclassify to `answer-bearing` whenever an exact eligible learner-visible anchor independently supplies the canonical answer under the conservative gate. Retain a fallback only when the apparent match is negated, scoped to a different condition, incomplete, ambiguous without missing context, or otherwise not self-sufficient, and record the exact ticket-specific limitation.
2. `PRRT_kwDOSX65IM6MBsV8` → `task`: reconcile live process status, current/effective heads, completed `F038-RA-003` evidence, the new `F038-RA-004` blocker, remaining review/check/thread/final-validation work, and audit-derived answer-bearing/fallback totals.

#### Contradiction audit contract

The implementation must add a deterministic advisory screen over every rejected exact candidate using canonical Spanish and Russian correct-answer forms. The screen must report, at minimum:

- normalized exact equality after case, punctuation, whitespace, and diacritic normalization;
- rejected anchor contains the complete canonical answer;
- canonical answer contains the rejected anchor;
- numeric/unit equivalence;
- manually reviewed semantic equivalence such as an exact sign label or synonymous learner-visible formulation.

The screen must not choose a placement basis, approve a record, or rewrite review evidence. Every reported candidate requires an explicit reviewed disposition:

- `supplies-canonical-answer`: the anchor is self-sufficient for the complete question and relevant distractors; the committed placement must use that exact anchor and `placementBasis: "answer-bearing"`, with fresh `directAnswerAssertionRu`, distractor-aware `reviewerRationaleRu`, review metadata, and fingerprints; or
- `not-self-sufficient`: the fallback may remain only with ticket-specific evidence naming the overlap and why it cannot determine the complete answer. Allowed reason classes are limited to negated/warning text, incomplete or broader/narrower proposition, wrong scope/condition, ambiguity without required visual or textual context, or another equally explicit semantic limitation.

A generic statement that an exact matching text “does not report the answer” is invalid. If an answer-bearing rejected candidate exists, generic topic prose cannot remain selected merely because it is the route default. The answer-bearing anchor becomes the placement even when it changes the page/anchor previously selected for fallback. Topic-route and override evidence must be updated coherently rather than used to block the correct answer-bearing placement.

#### Required fixtures

- Negative rejection fixtures must fail validation when `001`, `065`, or `086` remains a fallback while rejecting the exact answer-bearing anchor.
- A positive answer-bearing fixture must pass only when the exact anchor is selected, the fallback ledger is removed for that placement, and direct-answer/distractor-aware evidence is present.
- Positive retained-fallback fixtures must cover at least `026` (negated/warning overlap) and `202` (partial answer missing the more-than-two-tracks condition), with explicit `not-self-sufficient` dispositions.
- Mutation fixtures must fail when a contradiction is undisposed, a disposition is generic, a purported `not-self-sufficient` reason conflicts with exact self-sufficient text, an answer-bearing reclassification retains fallback approval fields, or manifest/evidence totals are stale.

All `39` currently detected lexical candidates and any additional semantic-equivalence candidates found during review must be audited. The final answer-bearing/fallback counts are audit results, not preset targets.

Architect return count becomes `4 / 10`. This disposition is not final Architect validation.

### F038-RA-005 Architect disposition

Disposition: `task` — all five current-head findings are accepted as one blocking Architect return with two sequential atomic Implementation Agent work packages.

Reviewed state:

- PR: `#204`;
- Review Agent review: `4574141351`;
- reviewed/current head: `002f98814f92299edeb377c34ba40eb2341d589f`;
- effective content head: `2cd692fb6babdc1404f8210bd5ef5c9f2cd5b4ea`;
- commits after the effective content head change only `specs/038-manual-ticket-placement/tasks.md`;
- active threads: `PRRT_kwDOSX65IM6MU7dX`, `PRRT_kwDOSX65IM6MU7da`, `PRRT_kwDOSX65IM6MU7dd`, `PRRT_kwDOSX65IM6MU7df`, and `PRRT_kwDOSX65IM6MBvab`.

Independent Architect verification on `2026-06-25` confirmed:

1. `PRRT_kwDOSX65IM6MU7dX` — `b-fallback-390` asks whether low beams must be used in the pictured reduced-visibility rain condition, but the selected `ch3-lights/front-lights.itemsRu[4]` anchor governs fog lamps. The types of lamp are not interchangeable. The unchanged manual already has an exact answer-bearing anchor on `ch3-adverse-conditions`, `rain.itemsRu[1]`: `Включать ближний свет и использовать стеклоочистители и обдув, чтобы сохранять обзор.` The canonical image shows rain on a city street, so this anchor supplies the required low-beam rule for the depicted condition and excludes the night-only and routes-only distractors.
2. `PRRT_kwDOSX65IM6MU7da` — `b-fallback-422` currently selects only the consequence of placing a belt over the abdomen. That text rejects the affirmative distractor but cannot choose `костям таза` over `бедрам`. The same eligible page has exact self-sufficient alternatives, preferably `app3-safety-elements/seatbelt-source-visual`, term `Debe colocarse sobre los huesos de la cadera`, `cards.0.termTranslations.2.translationRu`: `Нижняя лямка должна лежать на костях таза, ниже живота.` The card body and `seatbelt-and-headrest.itemsRu[7]` are also answer-bearing, but one exact strongest anchor must be selected and sealed.
3. `PRRT_kwDOSX65IM6MU7dd` — `b-fallback-430` asks priority on a narrow incline and its image shows B ascending. The selected railway-crossing exception has no slope or ascending-vehicle condition. The same page has an exact answer-bearing anchor at `ch3-right-of-way/other-priority-situations.itemsRu[1]`: `На уклоне, где ширина дороги не позволяет двум транспортным средствам двигаться одновременно, приоритет у поднимающегося...`. This rule plus the canonical image identifies vehicle B.
4. `PRRT_kwDOSX65IM6MU7df` — the live `Status And Ownership` block and matching plan handoff still report pre-`F038-RA-004` heads and blockers. `tasks.md` correctly records `2cd692f...` / `002f988...`; Architect-owned memory must agree before later validation.
5. `PRRT_kwDOSX65IM6MBvab` — `src/data/manualTicketPlacement.ts` imports all five full reviewed shards. Those files total `3,135,773` raw bytes at the reviewed head, and the production entry bundle contains review-only markers `auditConclusionRu`, `searchedConcepts`, and `selectionRationaleRu` for all `375` fallbacks. Runtime consumes only `questionId` and `pageId`, so bundling audit ledgers, fingerprints, rationales, review metadata, and candidate evidence is unnecessary and violates the intended generated-runtime-index boundary.

#### Atomic work package A — exact semantic corrections

One Implementation Agent must:

1. Replace the three false `answer-bearing` relations with the exact self-sufficient anchors above.
2. Recompute route/anchor/canonical fingerprints, direct-answer assertions, distractor-aware rationale, contradiction review, reviewed-manifest hashes, evidence totals, destinations, and density.
3. Preserve `placementBasis: "answer-bearing"` for all three only after the exact anchor independently passes the full question/distractor/image gate.
4. Update `topic-routes.json` and `ticket-topic-assignments.json` only where the `390` route change requires coherent reviewed routing; do not weaken routing merely to retain the old placement.
5. Add exact regressions that reject the fog-lamp anchor for `390`, the abdomen-only anchor for `422`, and the railway-crossing anchor for `430`, and require the approved exact propositions.

#### Atomic work package B — lean runtime projection

After package A is internally consistent, the same Implementation Agent must:

1. Generate `content/manual-ticket-placement/manual-ticket-placement.runtime.json` from the reviewed shards. It is derived runtime data, never reviewed semantic source.
2. Use an exact allowlisted schema containing only:
   - top-level `schemaVersion`, `contentKind: "manual-ticket-placement-runtime"`, and deterministic `records`;
   - each record: `questionId` and `pageIds`, with IDs sorted and duplicate-free.
3. Make `src/data/manualTicketPlacement.ts` import only that runtime projection; it must not import any file under `content/manual-ticket-placement/placements/`.
4. Add one pure deterministic builder used by generation and validation. Validation must fail when the runtime projection is missing, stale, reordered, has an extra/missing question or page, has duplicates, or differs in any value from the projection of the current reviewed shards.
5. Reject all non-allowlisted fields recursively, including placement basis, route hashes, topic routes, anchors, fingerprints, review metadata, rationales, audit conclusions, searched concepts, candidates, and contradiction evidence.
6. Preserve exact runtime behavior and ordering: the derived `pageId -> sorted questionId[]` lookup must equal the lookup produced from the full reviewed shards.
7. After a clean production build, prove that the browser entry chunk contains none of `auditConclusionRu`, `selectionRationaleRu`, `searchedConcepts`, `candidatesReviewed`, or `contradictionReview` due to manual-ticket placement data. No fixed bundle-size SLA is required; schema allowlisting and bundle-marker absence are the durable gates.

#### Exact allowed Implementation Agent files

- `content/manual-ticket-placement/placements/369-460.json`;
- `content/manual-ticket-placement/topic-routes.json` only if required for the corrected `390` route;
- `content/manual-ticket-placement/ticket-topic-assignments.json` only if required for the corrected `390` assignment;
- `content/manual-ticket-placement/reviewed-manifest.json`;
- `content/manual-ticket-placement/manual-ticket-placement.runtime.json`;
- `content/validation/manual-ticket-placement.evidence.json`;
- `scripts/manual-ticket-placement-lib.mjs`;
- `scripts/content-manual-ticket-placement.mjs`;
- `src/data/manualTicketPlacement.ts`;
- `tests/manual-ticket-placement.test.mjs`;
- `tests/e2e/manual-ticket-placement.spec.ts` only if destination-density fixtures change;
- `docs_project/project/backend/backend-docs.md`;
- `specs/038-manual-ticket-placement/tasks.md` for Implementation Agent evidence and live status.

No other file is allowed without a new Architect disposition. In particular, do not edit protected manual prose/images, canonical questions/translations/explanations/answers/difficulty/images, route inventory, protected baseline, `src/App.tsx`, CSS, package/lockfiles, frontend docs, unrelated tests, or Architect-owned `spec.md`/`plan.md`.

#### Acceptance and negative tests

- `390`, `422`, and `430` resolve to the exact propositions above with fresh evidence; their three reported wrong anchors fail focused mutation tests.
- Mapping totals, reviewed manifest, contradiction audit, deterministic evidence, route assignments, and density are fresh and internally consistent.
- The runtime projection is exact, deterministic, minimal, duplicate-free, and behaviorally equal to the reviewed-shard projection.
- Missing/stale/extra/reordered runtime records or page IDs fail validation.
- Any governance/review field in the runtime projection fails validation.
- Runtime source imports the lean projection only, and production bundle-marker checks pass.
- Protected/canonical diff guards remain empty.
- Focused tests, full validation, build, browser suites, preflight, and `git diff --check` pass.

Architect return count becomes `5 / 10`. This disposition is not final Architect validation.

Any implementation change creates a new effective content head and makes review `4574141351`, current head `002f98814f92299edeb377c34ba40eb2341d589f`, and effective content head `2cd692fb6babdc1404f8210bd5ef5c9f2cd5b4ea` stale for merge authorization. A fresh Review Agent review is mandatory after both packages. Final Architect validation remains forbidden until fresh review passes, required checks are green, blocking threads are resolved or outdated, and process memory is current.

### F038-IA-001 Architect disposition

Disposition: `task` — accepted owner-approved thematic fallback, implementable.

Independent Architect verification on `2026-06-23` confirmed the canonical tuple for `b-fallback-235`:

- question: `En caso de participar de un siniestro vial, ¿de cuánto tiempo se dispone para dar aviso sobre el hecho a la compañía aseguradora del vehículo?`
- correct answer: `72 horas.` (`b-fallback-235-a3`)

The verification covered all four Introduction routes and all `50` implemented manual-section content objects assembled by `manualGuide.ts`, including the incident, required-documents, legal-responsibility, appendix, and sign-catalog content. Searches included exact and equivalent forms such as `72 horas`, `72 часа`, written-out seventy-two, `tres días`, `3 días`, and Russian three-day forms, plus insurer-notification/deadline combinations. No existing learner-visible Руководство text states a `72`-hour or equivalent three-day insurer-notification deadline.

The nearest existing anchors remain invalid as ordinary answer-bearing evidence:

- `ch2-incident-obligations` / `incident-duty-core` says that necessary reports must be made, but gives no insurer-notification deadline.
- `ch2-incident-obligations` / `data-to-collect` and `follow-up-duties` cover insurance data and post-incident duties, but give no deadline.
- `ch2-required-documents` / `insurance-vtv-rva` explains mandatory insurance and proof, but gives no post-incident notification deadline.
- `ch2-legal-responsibility` discusses liability and insurers, but gives no notification procedure or deadline.

The same answer exists elsewhere in repository learning/source material, including the canonical ticket, governed translation/explanation, and `Материалы` data, but those surfaces are not existing learner-visible text of a Руководство page and therefore cannot serve as a placement anchor under this specification.

These three requirements were jointly unsatisfiable for `b-fallback-235` at the current content baseline:

1. every canonical ticket has at least one placement;
2. every placement is backed by an answer-bearing existing Руководство text anchor;
3. existing manual text is not edited or supplemented.

Owner decision recorded on `2026-06-23`:

> «Добавь билет на наиболее близкую по теме страницу, несмотря на то, что нет явного текста про 72 часа. Не меняй при этом текст руководства или текст билета».

The accepted placement is:

- question: `b-fallback-235`;
- destination: `ch2-incident-obligations`;
- exact thematic anchor: `manual-block` / `incident-duty-core` / `textRu`;
- anchored text: `При дорожном инциденте водитель обязан остановиться сразу, безопасно обозначить место, предоставить данные и выполнить необходимые сообщения. Эти обязанности существуют независимо от того, насколько небольшим кажется ущерб.`;
- rationale: this is the closest substantive page and exact existing text about post-incident duties and required notifications. It is more directly relevant to the act and timing context in the ticket than the insurance-document page, which describes proof and purpose of insurance but not post-incident conduct.

This placement must use `placementBasis: "owner-approved-thematic-fallback"`. It must include `auditId: "F038-IA-001"`, `questionId: "b-fallback-235"`, `ownerDecisionDate: "2026-06-23"`, `ownerDecisionRef: "feature-038-owner-decision-2026-06-23"`, the candidate/rejection audit, selection rationale, approved review metadata, and fresh canonical question/translation/correct-answer/image, anchor-text, and page-content fingerprints.

This fallback does not claim that the anchor contains the answer `72 horas.` It preserves all canonical ticket text and the protected manual corpus unchanged. The owner wording is a general rule for future genuinely unmatched canonical tickets, provided each record independently satisfies the fallback audit and evidence contract above.

### F038-IA-002 Architect disposition

Disposition: `task` — apply the general owner-approved thematic fallback rule; hard stop removed.

The documented audit confirms that no existing learner-visible Руководство anchor states that a motor is lubricated by motor oil or independently identifies canonical image option C. The closest substantive eligible destination is `app1-safety-elements`, because its `pre-driving-checks` block is specifically a vehicle pre-use maintenance checklist and its first learner-visible item explicitly names oil alongside other operating fluids.

Accepted placement:

- question: `b-fallback-126`;
- destination: `app1-safety-elements`;
- route hash: `#manual-section-app1-safety-elements`;
- exact thematic anchor: `manual-list-item` / `pre-driving-checks` / `itemIndex: 0` / `itemsRu`;
- anchored text: `Масло, охлаждающую жидкость и жидкость стеклоомывателя.`;
- rationale: this is closer than `ch5-anticipatory-efficient-driving`, which mentions only oil-filter cleanliness in an efficient-driving list, and `app3-social-responsibility`, which is a professional/social-responsibility inspection context containing several unrelated fluid systems. The selected page directly groups engine-compartment operating fluids under a pre-driving vehicle check, while still not claiming the missing lubrication relationship.

Implementation must use `placementBasis: "owner-approved-thematic-fallback"`, `auditId: "F038-IA-002"`, the common owner decision date/reference, complete candidate/rejection audit, approved review metadata, and fresh canonical/anchor/page fingerprints. Manual text, ticket text, answer identity, and images remain unchanged.

## Protected Existing Manual Content

Create `manual-content-baseline.json` before product implementation changes. It records:

- sorted protected source-file paths and SHA-256 hashes for:
  - `src/data/pandemiaVialSection.ts`
  - `src/data/manual-sections/*.ts`
  - `src/data/manual-signs/app4SignEntries.json`
  - the interactive-guide section registry used by `manualGuide.ts`
- a sorted inventory and aggregate SHA-256 for all existing manual image assets referenced by those sources;
- page-level `contentFingerprint` values from `manual-pages.json`;
- baseline generation schema/version and effective base SHA.

The validator fails if any protected source file, existing learner-visible text value, image path, or referenced image byte hash changes. Ticket mapping, ticket renderer, CSS, tests, scripts, and additive appendix wrappers are outside the protected corpus.

Implementation must not edit protected manual content files. If a technical need appears to edit one, the Implementation Agent records feedback and stops that change for Architect disposition.

## Runtime And UI Architecture

### Data join

Add a typed loader/index that:

1. imports only `content/manual-ticket-placement/manual-ticket-placement.runtime.json`;
2. relies on deterministic validation that proves this lean file is the exact allowlisted projection of the reviewed placement shards;
3. creates the page-to-sorted-question-ID lookup;
4. joins `questionId` to `questionById`, `translationByQuestion`, `explanationByQuestion`, source metadata, and canonical local image data.

No ticket prose is stored in manual-section modules. Review-only shards and fields are validation/build inputs and must not enter the browser dependency graph.

### Shared ticket renderer

Extract the canonical read-only ticket semantics from `TopicGuideTicketBlock` into a shared component, for example `CanonicalStudyTicketBlock`, with thin adapters:

- `Материалы` adapter supplies topic-specific answer explanations and existing conflict notes.
- `Руководство` adapter supplies the canonical question ID and governed canonical explanation data.

The shared component preserves:

- canonical Spanish question and ordered answers;
- Russian question/answer translations;
- local canonical image;
- correct-answer badge and footer;
- difficulty and truthful fallback/source status;
- current accessibility and language boundaries.

`Материалы` output and behavior must remain unchanged. `Руководство` is read-only and has no selectable/submittable answer state.

### End-of-page placement

All route render paths must append the ticket appendix after the complete existing content:

- `PandemiaVialPrototypeView`: after its existing `intro-document-flow`
- `IntroductionArticleView`: after its existing block flow
- `ManualGuideSectionContentView`: after its existing `intro-document-flow`

Use one shared `ManualTicketAppendix` after those nodes. The appendix must never be inserted into a manual `blocks` array and never render before or between existing blocks.

### Density and performance

- The appendix heading and ticket count are always present when mappings exist.
- Low-density pages may render ticket cards immediately.
- Medium/high-density pages use an accessible native `<details>` disclosure, collapsed by default, whose summary states the exact ticket count.
- Once opened, render tickets in deterministic canonical question-ID order.
- Images use `loading="lazy"` and canonical local URLs.
- Do not mount hidden rich ticket cards while the disclosure is closed.
- Do not virtualize in a way that makes opened content unreachable to keyboard users or browser find.
- Do not paginate tickets onto a separate route; they remain appended to the destination page.
- Record the current maximum tickets-per-page and verify that opening that appendix remains usable on desktop and mobile.

## Deterministic Validator And Gates

Add `scripts/content-manual-ticket-placement.mjs`, focused tests, a package command such as `validate:manual-ticket-placement`, and wire it into `validate:content`.

The validator must fail unless all of the following are true:

1. The current canonical bank has distinct IDs and every current ID has a mapping record.
2. No mapping record references a non-current question ID.
3. Every question has exactly `1..3` placements.
4. No question repeats the same `pageId`.
5. Every `pageId` and `routeHash` are known and agree with the route inventory.
6. Every destination is implemented and `eligible`.
7. No destination is front matter, pending, navigation-only, contents, glossary, presentation, categories, divider-only, closing/decorative, or otherwise marked ineligible.
8. Every ticket and placement review status is `approved`.
9. Every exact anchor exists, resolves uniquely, belongs to the mapped page, and resolves to learner-visible text.
10. Every preferred placement has `placementBasis: "answer-bearing"` and answer-bearing rationale.
11. Every `owner-approved-thematic-fallback` has a documented no-answer audit, substantive eligible destination, exact closest-topic anchor, candidate/rejection evidence, selection rationale, common owner decision reference/date, approved review, and fresh fingerprints.
12. Validation rejects a fallback when an answer-bearing placement is documented as available, the no-answer audit is absent or incomplete, the destination is ineligible/non-substantive, the anchor is not exact or not closest-topic, candidate rejections are absent, review is unapproved, fingerprints are stale, or manual/ticket content was changed.
13. Every anchor fingerprint and page content fingerprint is fresh.
14. Every question, translation, correct-answer, and image fingerprint is fresh.
15. Every canonical question has a governed Russian question translation and all canonical answer translations.
16. Every canonical `correctAnswerId` references an existing answer and the renderer cannot override it from mapping data.
17. Every image-backed question references an existing bundled local asset whose committed SHA matches canonical metadata.
18. The protected manual-content baseline is fresh; existing manual text/image source files and referenced manual image bytes are unchanged.
19. Shard boundaries, ordering, schema versions, generated index, and evidence report are deterministic and current.
20. The evidence summary reports zero unknown tickets, unknown pages, ineligible placements, missing/ambiguous anchors, stale fingerprints, duplicate page placements, unreviewed records, zero-placement questions, over-three-placement questions, and unauthorized/malformed thematic fallbacks.
21. The reviewed manifest is present, current, internally consistent, and binds every committed record, exact anchor text, rationale/fallback evidence, reviewer identity, and all five shard hashes.
22. Generator/scorer code cannot create, mutate, or overwrite approval metadata, placement basis, ticket-specific rationale, or committed reviewed records.
23. Reviewer metadata does not use reserved generator identities or generated timestamps, and ordinary rationales are not generic boilerplate or identical templates with only the answer substituted.
24. Known false fixtures `b-fallback-003`, `b-fallback-011`, and `b-fallback-042` cannot validate with their currently committed false pages/anchors.
25. Fallback count is derived from the completed audit and is not hard-coded to exactly two.
26. The lean runtime projection is present and exactly equals the deterministic `questionId`/sorted-`pageIds` projection of the reviewed shards.
27. The runtime projection contains only its allowlisted schema and no governance, review, audit, rationale, anchor, fingerprint, route, or placement-basis fields.
28. Runtime source imports no reviewed placement shard, and the clean production entry bundle contains no manual-placement review markers.

The validator must emit a concise deterministic summary including:

- canonical question count;
- placement relation count;
- questions by placement count (`1`, `2`, `3`);
- eligible/ineligible route counts;
- min/median/max tickets per destination page;
- dense-page IDs;
- owner-approved thematic fallback count and question/audit IDs, reported separately from answer-bearing placements;
- all zero/error counters.

## Acceptance Criteria

1. All `460` current canonical question IDs are covered.
2. Every question has exactly one, two, or three approved placements.
3. Every placement targets an explicitly eligible substantive page.
4. Every ordinary placement points to existing answer-bearing learner-visible text through a stable exact anchor.
5. Every ordinary placement independently explains the canonical correct answer.
6. `b-fallback-235` and `b-fallback-126` have the exact audited thematic placements selected in their Architect dispositions, with the `2026-06-23` decision reference, candidate/rejection evidence, rationale, approval metadata, and fresh fingerprints.
7. Any further ticket lacking an answer-bearing anchor uses the same governed fallback only after a documented audit and closest-topic selection satisfying the schema; such fallbacks are separately enumerated in validation evidence.
8. No prohibited or non-substantive route receives a ticket.
9. Every ticket appendix appears after all pre-existing content of its destination page.
10. Existing manual text, structured values, ordering, image references, and image bytes are unchanged.
11. Spanish question/answer text, Russian translations, correct answer, difficulty, source status, and image come from canonical data.
12. Every image-backed ticket shows its canonical local image when its card is rendered.
13. The presentation remains read-only and recognizably consistent with `Материалы`.
14. Existing `Материалы`, manual routing, hashes, navigation, and local-first behavior do not regress.
15. Dense pages remain usable and do not eagerly mount all hidden rich cards.
16. All deterministic validators, focused tests, build, browser evidence, preflight, and whitespace checks pass on the current PR head.
17. All `460` tickets have fresh explicit audit evidence; none inherits approval from lexical/topic scoring or from the invalidated pre-review output.
18. The final answer-bearing/fallback counts are audit results, not preset targets; every fallback independently satisfies the general owner rule.
19. The reviewed manifest proves the committed approved mapping source is immutable and regeneration preserves it.
20. Tickets `390`, `422`, and `430` use the exact low-beam, pelvic-bones, and narrow-incline propositions recorded in `F038-RA-005`.
21. Browser runtime consumes only the exact lean placement projection; review-only placement shards remain outside the production dependency graph.

## Negative Scenario

If ticket `Q` has no eligible page whose existing text contains its answer, the Implementation Agent performs and records the no-answer audit, then selects the closest substantive eligible page under the general owner rule. It is forbidden to:

- use thematic fallback before exhausting and documenting answer-bearing candidates;
- place `Q` on a random, weakly related, support, contents, glossary, presentation, categories, navigation-only, pending, or otherwise ineligible page;
- rely only on an image;
- add or rewrite manual prose;
- mark an unreviewed match as approved;
- omit `Q` and claim completion.

Every fallback record must include:

- `questionId`, Spanish question, canonical correct answer;
- candidate pages reviewed;
- exact candidate anchors considered;
- why each candidate fails the answer-bearing contract and why rejected thematic candidates are less suitable;
- confirmation that no manual text/image was changed.

The hard stop remains only when no substantive thematically relevant eligible page exists. In that case the ticket stays unmatched, the numeric coverage gate remains red, and feedback returns to Orchestrator.

Negative exception tests must prove that validation fails when:

- a thematic fallback lacks a documented no-answer audit;
- a fallback targets an ineligible/non-substantive page or lacks an exact learner-visible closest-topic anchor;
- candidate/rejection audit, audit ID, decision date/reference, selection rationale, approved review, or any required fingerprint is missing/stale;
- `b-fallback-235` or `b-fallback-126` targets a page/anchor other than its Architect-approved selection;
- a fallback is silently classified as answer-bearing or the evidence report does not separately enumerate fallback count and IDs;
- mapping data changes canonical Spanish/Russian ticket content or canonical correct answer;
- protected manual text or images are changed to support the exception.
- generator/scorer output attempts to set `approved`, `answer-bearing`, fallback approval, reviewer identity, review time, or semantic rationale;
- a rationale is generic boilerplate, repeats a banned template, or does not cite and explain the exact anchor text for that ticket;
- reviewer metadata uses a reserved generator identity or synthetic fixed metadata;
- reviewed shards or records are missing from, differ from, or are overwritten despite the immutable reviewed manifest;
- any of the known false fixture mappings for `b-fallback-003`, `b-fallback-011`, or `b-fallback-042` is restored;
- false ordinary mappings are bulk relabeled as fallback without a ticket-specific no-answer audit.
- a fallback omits `searchedConcepts`, has fewer than two distinct exact candidates, lacks a rejected candidate, or uses a generic/shared audit ledger;
- a candidate omits exact anchor text, does not resolve to learner-visible text, or is stale;
- the selected candidate differs from the committed placement, or comparative rationale does not identify why rejected candidates are less suitable;
- `b-fallback-042` does not use the exact `автовокзал` Appendix IV sign entry;
- `b-fallback-126` does not use `pre-driving-checks.itemsRu[0]`;
- an `answer-bearing` record lacks a self-sufficient exact anchor, `directAnswerAssertionRu`, or ticket-specific distractor-aware rationale;
- a ticket or fallback lacks a reviewed topic-route assignment;
- a fallback page is outside the assigned curated route, its anchor is not one of the route's curated anchors, or a non-default destination lacks a reviewed ticket-specific override;
- global lexical/semantic ranking selects or approves a committed topic route, page, anchor, placement basis, or rationale;
- any fresh-review regression fixture (`037`, `064`, `085`, `165`, `202`, `281`, `349`, `350`, `404`, `431`) restores the reported false classification or destination.
- a fallback rejects a candidate that independently supplies the canonical answer;
- a rejected candidate has canonical-answer containment/equivalence without an explicit reviewed `supplies-canonical-answer` or ticket-specific `not-self-sufficient` disposition;
- a `not-self-sufficient` disposition uses generic denial, contradicts the exact anchor text, or omits the limiting scope/condition/context;
- an answer-bearing reclassification retains fallback-only evidence or does not update manifest, evidence totals, and process status.
- `390` uses a fog-lamp rule, `422` uses abdomen-only text that cannot distinguish pelvis from thighs, or `430` uses a railway-crossing rule;
- the runtime projection is missing, stale, differently ordered, incomplete, has extra IDs/page IDs, or does not reproduce the reviewed-shard page-to-question lookup exactly;
- the runtime projection contains any non-allowlisted field, including review, audit, rationale, anchor, fingerprint, route, placement-basis, topic, or candidate data;
- `src/data/manualTicketPlacement.ts` imports reviewed placement shards or a clean production bundle contains manual-placement audit markers.

## Required Verification Evidence

- Machine-readable route inventory with explicit eligible/ineligible reasons.
- Complete placement shards for all current IDs.
- Immutable reviewed manifest covering every ticket and placement.
- Per-ticket audit evidence containing exact anchor text and ticket-specific rationale or complete fallback audit.
- Fresh deterministic evidence report with all error counters at zero.
- Manual-content baseline report proving protected source files and referenced manual images unchanged.
- Focused unit/content tests for schema, anchors, fingerprints, counts, duplicate rejection, unknown/ineligible route rejection, canonical integrity, answer-bearing preference, audited thematic fallbacks, and rejection of every unauthorized or malformed fallback variant.
- Component tests or deterministic source assertions proving the appendix follows existing content and the renderer cannot override canonical answer data.
- `Материалы` regression tests if shared rendering is extracted.
- Playwright evidence at desktop and mobile widths for:
  - one substantive Introduction route;
  - one ordinary chapter route;
  - one Appendix IV sign route;
  - one image-backed ticket;
  - low-, medium-, and highest-density pages;
  - collapsed and expanded dense appendix states;
  - navigation from an already-open dense appendix to another dense page, proving the destination native disclosure is closed and has zero mounted ticket cards;
  - direct route-hash navigation after the feature.
- Performance/usability evidence for the highest-density page: ticket count, closed-state mounted card count, expanded-state completion, local image loading behavior, and no document-level horizontal overflow.
- Recorded successful commands:
  - focused placement validator and tests;
  - `pnpm run validate:content`;
  - `pnpm run test`;
  - `pnpm run build`;
  - focused Playwright;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.

## Completion Boundary

This feature is not complete while any ticket is unmatched, any of the `460` tickets lacks a fresh reviewed topic assignment, any answer-bearing placement fails the conservative self-sufficient-anchor gate, any thematic fallback lacks the mandatory ticket-specific search/candidate/rejection/comparison ledger, any rejected candidate/canonical-answer containment or equivalence contradiction lacks a valid reviewed disposition, any answer-bearing candidate is discarded in favor of generic fallback prose, any thematic fallback is outside its curated topic route or lacks an approved route anchor/override, any exact invariant for `042`, `126`, `390`, `422`, or `430` fails, reviewed-manifest evidence is missing/stale, generator/scorer code can manufacture semantic decisions, the lean runtime projection is missing/stale/non-minimal or reviewed shards enter the browser bundle, any protected manual content has changed, any blocking review thread remains unresolved, process memory is stale, or any required gate is red. Review `4574141351`, current head `002f98814f92299edeb377c34ba40eb2341d589f`, and effective content head `2cd692fb6babdc1404f8210bd5ef5c9f2cd5b4ea` become stale for merge authorization once `F038-RA-005` implementation changes content. Orchestrator must obtain a fresh Review Agent result on the new remediation effective content head, then later run final Architect validation and final Analyst validation against that same effective content head before finalization or merge.
