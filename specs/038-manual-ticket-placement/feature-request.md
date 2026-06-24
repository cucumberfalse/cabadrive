# Feature Request: Place Every Ticket On Relevant Manual Pages

## Intake Context

- Analyst role: explicitly assigned by Orchestrator for this repository-changing work-cycle intake only.
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`.
- Assigned branch: `codex/038-manual-ticket-placement`.
- Verified base provided by Orchestrator: `origin/main` at `4247b0e90ae5799a0875cc3751c96589fef96ef2`.
- Local HEAD verified during intake: `4247b0e90ae5799a0875cc3751c96589fef96ef2`.
- Existing maximum numeric prefix observed under `specs/`: `037`; the assigned next feature folder is `specs/038-manual-ticket-placement/`.
- Parallel-work warning: other Orchestrators, agents, branches, worktrees, commits, PRs, dirty diffs, and process-memory updates may exist. Preserve all sibling work and do not mutate anything outside this assigned intake artifact.
- Analyst artifact boundary: create exactly this `feature-request.md`; do not create `spec.md`, `plan.md`, `tasks.md`, code, content, tests, assets, durable documentation changes, commits, pushes, PRs, reviews, or merge actions.

## Original User Request

Russian original:

> нужно в руководство добавить билеты; для каждого билета выбрать релевантную страницу в руководстве (для одного билета не менее 1 и не более 3 страниц); релевантная страница — в её тексте содержится ответ на вопрос билета; в конце подходящей страницы добавить билет в оригинальном виде с переводом и ответом, по аналогии с блоком “Материалы”; по итогу каждый билет должен быть добавлен минимум на одну страницу; существующий текст и изображения не менять, только добавлять билеты; запрещено добавлять на страницы без значимого текста, например содержание, глоссарий и подобные.

Normalized reading:

- Add all current tickets to the user-facing interactive `Руководство`.
- Map each ticket to between one and three relevant manual content pages.
- A page is relevant only when its existing learner-visible text contains the information needed to answer that ticket correctly.
- Append the mapped ticket blocks after the existing content of each eligible page.
- Present each appended ticket in its canonical Spanish form with Russian translation and the correct answer, following the established `Материалы` ticket-block pattern.
- Do not rewrite, delete, reorder, or otherwise alter existing manual text or images.
- Do not place tickets on non-substantive pages such as contents/index, glossary, navigation-only, divider, title, or similar support pages.
- Complete coverage is mandatory: every ticket in the current bank must appear on at least one eligible manual page.

No normal-flow user clarification is required for intake. The request is specific enough for architecture when the assumptions and evidence expectations below are preserved.

## Request Classification

This is one repository-changing content-integration feature for the current interactive Russian `Руководство`.

It does not request new ticket wording or new manual teaching material. It requests a governed semantic cross-reference between two existing complete local corpora:

- the current `460`-ticket `unofficial_b_fallback` category-B bank; and
- the substantive pages/routes of the completed interactive Russian manual.

This remains one coherent feature because the single customer outcome is complete, evidence-backed placement of the existing bank inside the existing manual. Architect may decompose implementation into safe PR slices if needed, but the full feature is not complete until all `460` tickets satisfy the placement and relevance rules.

## Project And Repository Context

- Cabadrive is a static local-first React/TypeScript/Vite trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend. Ticket placement, translations, answers, images, and manual content must remain bundled local content available offline after build.
- The current question bank is explicitly an unofficial category-B fallback set, not an official GCBA question bank. The manual integration must not relabel it as official.
- The canonical bank is `content/questions/caba-b.unofficial-fallback.questions.json`; intake inspection confirmed `460` questions.
- The current bank has complete governed Russian translation and explanation layers in range shards under `content/translations/ru/` and `content/explanations/ru/`.
- The bank includes `276` image-backed questions. Canonical local question images are part of the ticket and remain bundled under `content/assets/questions/`.
- `Материалы` already renders canonical ticket blocks by joining ticket references to canonical questions, translations, answers, source metadata, difficulty, explanations, and local images. The relevant implementation is `TopicGuideTicketBlock` in `src/App.tsx`.
- The current `Руководство` is a native interactive document, not a PDF viewer. Manual route boundaries come from the source `Índice`, not raw PDF page numbers.
- Substantive manual content is represented through Introduction routes and implemented manual sections. Current implemented section data is assembled in `src/data/manualGuide.ts` from `src/data/manual-sections/`.
- The current implemented section list includes meaningful instructional pages as well as front-matter support pages such as presentation, categories, and glossary. Eligibility therefore cannot be inferred merely from a section being implemented.
- Existing manual conversion rules protect the source-derived manual text, images, ordering, navigation, and source-faithful visual treatment.

## Goal

Make the interactive `Руководство` an exam-oriented study surface where every current ticket appears at the end of at least one and at most three substantive manual pages whose existing text actually supplies the answer.

The learner should be able to read a manual page and then immediately see the exact related ticket in Spanish, its Russian translation, and its correct answer in a familiar `Материалы`-style block, without any change to the page's existing instructional text or imagery.

## Scope

In scope:

- Inventory all `460` canonical tickets from `content/questions/caba-b.unofficial-fallback.questions.json`.
- Inventory all currently learner-visible `Руководство` routes/pages and classify each as eligible substantive content or ineligible support/non-content.
- Review every ticket against the existing learner-visible text of candidate manual pages.
- Create an explicit mapping of each ticket to `1..3` eligible pages.
- Record evidence for every ticket-to-page mapping showing where the existing page text contains the answer.
- Append mapped ticket blocks after all existing content on each eligible page.
- Reuse canonical ticket data rather than copying or rewriting Spanish questions, answer options, Russian translations, correct-answer identity, explanations, difficulty, source status, or image paths.
- Preserve canonical local images for image-backed tickets.
- Keep the current unofficial-fallback status truthful at the appropriate product/section level.
- Add validation/tests/evidence for complete bank coverage, per-ticket placement count, page eligibility, referential integrity, canonical content reuse, ordering, and no mutation of existing manual text/images.
- Verify desktop and mobile rendering for pages with small, medium, and very large appended ticket sets.
- Update durable docs only if Architect determines that the new reusable manual-ticket cross-reference contract must be documented; such work remains outside Analyst ownership.

Out of scope:

- Editing, simplifying, correcting, expanding, deleting, or reordering existing manual text.
- Editing, replacing, recropping, regenerating, translating, relabeling, or removing existing manual images.
- Adding new explanatory manual prose merely to make a currently irrelevant page qualify for a ticket.
- Changing canonical Spanish ticket text, answer options, correct answers, translations, explanations, question images, difficulty, or source status.
- Treating a topic tag, filename, route title, source page number, image similarity, or keyword coincidence as sufficient relevance evidence when the page text does not contain the answer.
- Placing tickets on contents/index, glossary, presentation/title, category list, divider-only, navigation-only, pending, logo/closing-only, or similarly non-substantive pages.
- Introducing runtime AI, semantic search, remote content, network fetches, a backend, runtime PDF rendering, or another non-local dependency.
- Changing practice, exam, mistake-review, `Материалы`, `Источники`, `Процесс`, or `CABA/RF` behavior except for safe shared-component reuse required to render the same canonical ticket semantics in `Руководство`.
- Analyst choosing the exact schema, component extraction, file slicing, matching workflow, PR decomposition, or test implementation.

## Relevance Contract

A ticket-to-page placement is valid only when all of the following are true:

1. The destination is a substantive learner-facing manual page/route.
2. Existing rendered text on that page states the rule, definition, meaning, condition, exception, number, obligation, or visual-label meaning needed to identify the ticket's correct answer.
3. The evidence points to a specific existing text location, such as a stable manual block ID, structured row/item/card ID, sign catalog caption/label, or another auditable text anchor.
4. A reviewer can explain the answer using that text without importing a missing rule from another page.

The following are not sufficient by themselves:

- the ticket and page share a broad topic;
- the ticket's `topics` array matches the page title;
- the page contains a related image but no answer-bearing text;
- the page is in the same chapter or appendix;
- the Spanish or Russian text shares incidental words;
- the correct answer is known from general driving knowledge but is absent from the page text.

For image-backed tickets, the destination page must still contain answer-bearing text. An unlabelled or unexplained image alone does not satisfy the user's relevance rule. Textual sign names, meanings, captions, structured visual explanations, and other selectable learner-visible labels may satisfy the rule when they unambiguously supply the answer.

## Eligible And Ineligible Manual Pages

Default eligible set:

- implemented Introduction routes with substantive instructional text;
- implemented chapter and appendix routes with substantive instructional text, lists, tables, structured captions, sign labels, rules, definitions, or explanations that answer tickets.

Default ineligible set:

- contents/index and navigation-only surfaces;
- `front-glossary`;
- `front-presentation`;
- `front-categories`;
- pending/disabled placeholders;
- source divider pages or chapter covers with no substantive instructional text;
- logo, credits, closing-message, or decorative-only pages;
- any route whose meaningful learner-visible content is absent or insufficient to answer the mapped ticket.

Architect should formalize the eligibility rule and explicit exclusion inventory. A page does not become eligible merely because tickets could technically be rendered there.

## Ticket Block Expectations

The appended manual ticket presentation should follow the established `Материалы` semantics:

- canonical ticket ID and metadata where appropriate;
- unchanged canonical Spanish question text;
- unchanged canonical Spanish answer options;
- governed Russian question translation;
- governed Russian answer-option translations;
- canonical local question image when the ticket has one;
- clear identification of the correct answer;
- existing governed answer explanations/source status/difficulty where the reused `Материалы` pattern includes them and Architect retains that pattern.

The expected experience is a read-only study block, not an active exam attempt or a new answer-submission flow.

The implementation should prefer shared canonical rendering/data joins over duplicated ticket prose. If a shared component is extracted or generalized, the existing `Материалы` behavior must remain unchanged.

On each eligible manual page, all mapped ticket blocks must appear after the page's existing content. Existing content order must remain intact. The appended area may use a concise heading or wrapper needed for comprehension and accessibility, but it must not insert tickets between existing manual blocks.

## Assumptions

- “Страница в руководстве” means a learner-facing interactive manual route/section derived from the source `Índice`, not an arbitrary raw PDF page.
- “Для одного билета не менее 1 и не более 3 страниц” means every canonical ticket has an inclusive placement count of `1`, `2`, or `3`; zero and four-or-more placements are invalid.
- “Каждый билет” means all `460` tickets present in the canonical bank at the implementation baseline, with validation designed to detect later bank-count or ID drift.
- “В оригинальном виде” means canonical Spanish question text, canonical Spanish answer options, and the canonical local image when present; no manual-specific rewriting or abridgement is allowed.
- “С переводом и ответом, по аналогии с блоком Материалы” means the manual should reuse the governed Russian translation and visibly identify the canonical correct answer, with the existing `Материалы` ticket block as the visual/data behavior reference.
- Existing complete Russian translations and explanations should be reused, not re-authored for this feature.
- Relevance is semantic and answer-bearing. Topic metadata may help find candidates but cannot be the final approval basis.
- Multiple tickets may be appended to one manual page. There is no requested maximum per page, but usability and performance must be verified for dense pages.
- The same ticket may appear on two or three pages only when each page independently meets the answer-bearing relevance contract. Duplication must not be used merely to balance page counts.
- Existing manual text and images must remain semantically and visually unchanged. Additive ticket references, rendering infrastructure, styles, tests, and evidence are permitted when they do not alter existing page content.
- Introduction pages may receive tickets when they are substantive and independently answer the ticket; being outside the chapter-section data model is not a reason to exclude them.
- Sign appendix pages may receive sign-related tickets when their existing selectable captions/labels/text unambiguously contain the answer. A sign image without sufficient text is not enough.
- No user clarification is needed before architecture. If the semantic audit finds a ticket for which no eligible existing page contains the answer, the conflict must be surfaced with ticket-specific evidence rather than hidden through a false placement or unauthorized manual-text edit.

## Risks

- The strongest product risk is false relevance: placing a ticket on a broadly related page whose text does not actually answer it.
- The requirement to cover all `460` tickets may conflict with the prohibition on changing manual text if one or more fallback tickets test content absent from the manual.
- Image-backed and sign-recognition tickets can be incorrectly matched by visual similarity even when the page text does not state the answer.
- Automated keyword or embedding matching can produce plausible but invalid placements; final mapping needs auditable semantic review.
- The current bank is unofficial fallback content and may contain wording, source conflicts, or niche questions that do not align perfectly with the official manual.
- Rendering hundreds of repeated rich ticket blocks can increase bundle size, DOM size, page length, image loading, and mobile navigation cost.
- A page with many tickets may become unwieldy even though each placement is relevant; architecture needs progressive rendering, disclosure, or another approach that preserves the requirement that tickets are appended and accessible.
- Copying ticket text into manual section files would create drift from canonical questions/translations/answers. Referential reuse and freshness validation are important.
- Generalizing the existing `Материалы` block can accidentally regress `Материалы` styling, labels, missing-data behavior, accessibility, or source-status truth.
- Broad edits to manual section files can accidentally alter existing prose or image metadata despite the additive-only requirement.
- Future ticket-bank or manual-text changes could make mapping evidence stale unless fingerprints or equivalent freshness guards exist.
- Repeated local question images across multiple mapped pages can affect load performance if images are eagerly loaded.

## Open Questions For Architect Disposition

- What durable mapping schema best records `questionId`, destination route/section ID, exact answer-bearing text anchor, and review status without duplicating ticket content?
- What evidence is required for semantic approval: exact block IDs plus quoted/paraphrased basis, reviewer attestations, fingerprints, generated audit reports, or a combination?
- How should mappings to structured sign captions, table cells, glossary-like term rows inside otherwise substantive pages, and Introduction-specific content blocks be anchored consistently?
- Should the existing `TopicGuideTicketBlock` be generalized into a shared read-only canonical ticket component, or should `Руководство` use an equivalent renderer over the same canonical data?
- Should answer explanations be shown exactly as in `Материалы`, collapsed by default, or omitted while preserving the explicitly required translation and correct answer? The default assumption is to retain the established `Материалы` semantics unless page density requires an accessible presentation adjustment.
- How should very dense pages render appended tickets without changing their placement at the end of the page or hiding coverage from users?
- What immutable-content or snapshot guard will prove that existing manual text blocks and image references were not changed?
- How should a genuinely unmatched ticket be handled if the audit proves no eligible existing page contains its answer, given that adding manual prose is forbidden and complete ticket coverage is mandatory? This is a potential narrow owner-decision blocker, not permission to weaken relevance.
- Should implementation be split by ticket ranges, manual chapters, shared infrastructure plus mapping slices, or another atomic PR model while keeping one coherent feature-level completion gate?

## Acceptance Expectations

The feature is successful only when all of the following are true:

1. The implementation-baseline canonical bank is inventoried and contains `460` distinct ticket IDs.
2. Every one of those `460` tickets has exactly `1`, `2`, or `3` approved manual-page placements.
3. No canonical ticket has zero placements or more than three placements.
4. Every destination page is explicitly classified as substantive and eligible.
5. No ticket is placed on contents/index, glossary, presentation/title, category-list, divider-only, pending, navigation-only, logo/closing-only, decorative-only, or otherwise non-substantive pages.
6. Every placement has auditable evidence identifying existing answer-bearing page text.
7. Every placement independently satisfies the relevance contract; broad topic similarity or a related image alone is rejected.
8. Ticket blocks appear after all pre-existing content on the destination page, never between or before existing manual blocks.
9. Existing manual text, order, structured values, images, image paths, captions, crop metadata, and visual content remain unchanged.
10. Every rendered ticket uses canonical Spanish question text and answer options without rewriting or truncation.
11. Every rendered ticket uses the governed Russian translation and clearly shows the canonical correct answer.
12. Every image-backed ticket renders its canonical bundled local image when displayed, without changing that image.
13. The presentation is recognizably consistent with the established read-only `Материалы` ticket block and does not introduce an exam-attempt interaction.
14. Canonical source status remains truthful: these tickets are still identified through the product's `unofficial_b_fallback` context and are not presented as an official GCBA bank.
15. Duplicate placements of one ticket occur only when each destination independently contains the answer.
16. Referential-integrity validation fails on unknown ticket IDs, unknown/ineligible page IDs, duplicate mappings to the same page, missing translations/answers/images, and placement counts outside `1..3`.
17. Freshness validation fails when canonical ticket content or answer-bearing manual text changes without mapping review/evidence refresh.
18. Tests or equivalent guards prove that existing manual content was not mutated while ticket appendices were added.
19. Desktop and mobile QA covers representative Introduction, chapter, appendix/sign, image-backed-ticket, and high-ticket-density pages.
20. Existing manual navigation, route hashes, source hierarchy, local-first behavior, source-faithful images, and `Материалы` behavior remain stable.
21. Runtime uses only bundled local data/assets and introduces no network, backend, runtime AI, or PDF-viewer dependency.
22. Standard focused tests, content validation, build, browser verification, preflight, and whitespace checks required by Architect are recorded with objective evidence.

## Negative Scenarios

- Adding only some tickets and declaring the feature complete.
- Assigning a ticket to zero pages or more than three pages.
- Placing tickets on the glossary, contents, presentation, categories, chapter divider, pending route, navigation placeholder, closing logo, or another page without meaningful instructional text.
- Mapping by the ticket's broad `topics` tag without checking whether page text contains the answer.
- Using a related sign/photo/diagram as the sole relevance basis when the page text does not identify the answer.
- Putting a ticket on a page because the answer is common knowledge rather than present in that page's text.
- Adding new prose to the manual to manufacture relevance.
- Editing existing manual wording, tables, lists, labels, captions, source metadata, images, or image paths while adding tickets.
- Inserting ticket blocks between existing manual paragraphs or visual blocks.
- Copying and manually maintaining Spanish/Russian ticket text inside manual section files, allowing it to drift from canonical content.
- Rewriting, abbreviating, correcting, or translating canonical Spanish ticket content specifically for the manual.
- Omitting the canonical image from an image-dependent ticket.
- Showing a non-canonical answer or allowing manual placement data to override the question's `correctAnswerId`.
- Rendering a ticket on multiple pages merely to distribute volume.
- Regressing the existing `Материалы` ticket block while extracting shared rendering.
- Loading ticket content from the network or introducing runtime matching/AI.
- Silently forcing an unmatched ticket onto an irrelevant page to satisfy the numeric coverage gate.

## Acceptance Evidence Expected

- A complete machine-readable placement inventory with one row/record per ticket-to-page relation.
- A complete per-ticket coverage report proving all `460` IDs have placement counts within `1..3`.
- An explicit eligible/ineligible manual-page inventory with reasons.
- For every placement, a stable answer-bearing text anchor and concise semantic rationale tied to the canonical correct answer.
- Fingerprints or equivalent freshness evidence for the canonical question/answer tuple, governed translation, and referenced manual text anchor.
- A report with zero unknown tickets, zero unknown pages, zero ineligible destinations, zero zero-placement tickets, zero over-three-placement tickets, zero duplicate same-ticket/same-page mappings, and zero unreviewed mappings.
- Evidence that existing manual content and image references are unchanged, using focused snapshots, fingerprints, or another deterministic comparison.
- Evidence that rendered Spanish text, translations, correct answers, and local images come from canonical data rather than manual-specific copies.
- Desktop and mobile screenshots or Playwright evidence for representative low-, medium-, and high-density destination pages, including at least one image-backed ticket and one sign-related ticket.
- Regression evidence for the existing `Материалы` surface if shared rendering is changed.
- Performance/usability evidence for the pages with the largest appended ticket sets.
- Recorded command results for the focused validators/tests and the standard repository checks Architect assigns.
- If any ticket cannot be matched, a ticket-specific blocker report naming all reviewed candidate pages and why none contains the answer; this does not count as acceptance or completed coverage.

## Sources Read During Intake

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/frontend/manual-conversion-guidelines.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/031-manual-document-completion/feature-request.md`
- `specs/034-manual-visual-content-crop/feature-request.md`
- `specs/036-manual-sign-pages/feature-request.md`
- `specs/037-manual-sign-crop-resolution/feature-request.md`
- `content/questions/caba-b.unofficial-fallback.questions.json`
- `content/translations/ru/001-092.json`
- `content/explanations/ru/001-092.json`
- `content/guide/topic-study-guide.ru.json`
- `src/data/content.ts`
- `src/data/manualGuide.ts`
- representative files under `src/data/manual-sections/`
- `src/App.tsx`, including the current `Материалы` ticket renderer and interactive manual renderer

No external research was needed. The user request, canonical local content, and repository contracts provide the relevant intake context.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect.

The controlling customer intent is strict: all `460` canonical tickets must be appended to the ends of substantive `Руководство` pages, each ticket on one to three pages, and every individual placement must be justified by existing answer-bearing page text. Existing manual text and images are immutable for this feature. `Материалы` supplies the presentation/data precedent, while canonical question, translation, answer, explanation, and image sources remain authoritative. Non-content pages are forbidden destinations, and a numeric coverage target must never be satisfied through false semantic matches.
