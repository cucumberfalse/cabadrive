# Specification: Evidence-Backed Ticket Placement In Руководство

## Status And Ownership

- Feature: `038-manual-ticket-placement`
- Role owner of this artifact: Architect
- Analyst intake: `specs/038-manual-ticket-placement/feature-request.md`
- Assigned base: `origin/main` at `4247b0e90ae5799a0875cc3751c96589fef96ef2`
- Intended delivery: one implementation branch and one PR slice unless Orchestrator records an objective blocker requiring a new latest-main slice
- Parallel-work rule: preserve all sibling worktrees, branches, commits, PRs, dirty diffs, and process memory

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

The shard boundaries mirror existing translation/explanation ownership and keep review diffs bounded. The runtime may import a generated or assembled index, but that index must be deterministically checked against the shards.

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

1. loads reviewed placement shards;
2. validates or assumes build-time validation has established integrity;
3. creates `placementsByPageId`;
4. joins `questionId` to `questionById`, `translationByQuestion`, `explanationByQuestion`, source metadata, and canonical local image data.

No ticket prose is stored in manual-section modules.

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

## Required Verification Evidence

- Machine-readable route inventory with explicit eligible/ineligible reasons.
- Complete placement shards for all current IDs.
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

This feature is not complete while any ticket is unmatched, any answer-bearing placement lacks approved evidence, any thematic fallback lacks a complete no-answer/candidate-selection audit, any fallback is malformed or uses an ineligible/non-substantive destination, any protected manual content has changed, or any required gate is red. Orchestrator must later run final Architect validation and then final Analyst validation against the effective content head before finalization or merge.
