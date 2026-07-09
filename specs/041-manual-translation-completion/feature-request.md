# Feature Request: Complete Manual Translation Audit

## Intake Metadata

- Feature ID: `041-manual-translation-completion`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/040-manual-translation-completion`
- Assigned branch: `codex/040-manual-translation-completion`
- Verified base provided by Orchestrator: `origin/main` at `ddaa670022d240caa6861adbf30e2e6c8200223f`, fetched `2026-07-07`
- Local branch observed during intake: `codex/040-manual-translation-completion`
- Parallel-work warning: parallel agents/worktrees may be active. Preserve all existing dirty diffs, branches, commits, PRs, and process memory. Do not revert or delete sibling work.
- Existing prefix check: `specs/040-scroll-top-navigation` already exists in this worktree. Per Analyst rule, the next feature folder uses the maximum existing numeric prefix plus one, so this intake uses `specs/041-manual-translation-completion/`.
- Intake artifact scope: this Analyst intake creates only `specs/041-manual-translation-completion/feature-request.md`. Analyst does not create `spec.md`, `plan.md`, `tasks.md`, code, tests, runtime assets, durable docs, commits, pushes, PRs, reviews, or merge actions.

## Original User Request

The original request was given in Russian:

> ты оркестратор; проверить все руководство на наличие неполных переводов, в примере помечено красным; в случае, если важно оставить испанский термин, в любом случае скобках нужно добавить перевод

Orchestrator also provided screenshot context. The screenshot highlights untranslated Spanish residues in the user-facing `Руководство` manual, including:

- heading `Ingreso: carriles de aceleración`
- inline terms `carriles de aceleración`
- `calzada`
- `tránsito de la vía principal`
- `espejos retrovisores`
- `incorporación`
- `luz de giro izquierda`
- `espacio / gap`
- `velocidad adecuada del tramo`
- `autopista`
- `vía rápida`

Normalized intake reading:

- Audit all user-facing `Руководство` content for incomplete Russian translation, not only the screenshot section.
- Spanish source/exam terms may remain visible when they are important for fidelity, recognition, official terminology, signs, documents, or source trace.
- If any Spanish term or phrase is intentionally retained in learner-facing text, it still needs a Russian translation in parentheses nearby.
- The screenshot examples are concrete defects and acceptance probes, not an exhaustive list.

## Request Classification

This is a repository-changing content-quality request for the interactive Russian `Руководство` manual surface. It should be represented by a new feature memory because it changes user-facing manual content and likely requires validation/test updates.

The request is related to, but distinct from, earlier manual translation and readability work:

- Feature `027` delivered the complete page-faithful Russian 4-wheel manual surface.
- Features `030` and `031` converted the manual into the native interactive `Руководство` by source hierarchy and completed the document.
- Feature `032` added parenthesized Russian translations next to Spanish glossary terms.
- Feature `035` added structured Russian support for Spanish text embedded in manual images.

This request targets remaining incomplete translations in visible manual text: headings, body copy, labels, captions, lists, glossary-like terms, translation tables, cards, callouts, navigation-visible section content, and any other learner-facing `Руководство` text where Spanish remains without Russian meaning.

## Project Context

Cabadrive is a local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.

The target learner has low Spanish proficiency and relies on Russian learning support. Official Spanish source text and terms stay important for exam/source fidelity, but Russian support must be clear and close enough to be useful.

There is no runtime backend. Manual content, validation evidence, and assets must remain local/static and offline-capable after build. The runtime must not introduce a PDF viewer, PDF.js rendering, iframe/object/embed PDF loading, remote images, runtime fetches, backend endpoints, analytics, live AI, or remote fonts.

The user-facing manual destination is `Руководство`, a native interactive Russian document surface organized by the official GCBA manual `Índice`. The PDF and older page-faithful manifests are source/reference and validation inputs, not the learner-facing fallback for this request.

Existing manual conversion and follow-up features establish durable rules:

- Russian learner text should be natural, clear, selectable/copyable DOM or SVG text where feasible.
- Spanish official terms may be retained as anchors, especially for source/exam recognition, but they need Russian support.
- Protected source images, photos, signs, road markings, maps, and document examples should not be translated inside pixels; Russian explanations/translations belong outside the image.
- Prior feature `032` already set a precedent for `Spanish term (Russian translation)` in glossary rows.
- Prior feature `035` already set a precedent that broad Russian prose is not enough when the learner needs to map visible Spanish text to meaning.

## Requested Outcome

All user-facing `Руководство` content should be audited and completed so a Russian-speaking learner does not encounter unexplained Spanish residues.

Where Spanish terms or source phrases are intentionally retained, the visible text should provide a Russian translation in parentheses immediately after the retained Spanish term or phrase when practical.

Example target shapes:

- `Ingreso: carriles de aceleración (въезд: полосы разгона)` or a fully Russian heading with Spanish source term retained only if useful.
- `carriles de aceleración (полосы разгона)`
- `calzada (проезжая часть)`
- `tránsito de la vía principal (движение по главной дороге)`
- `espejos retrovisores (зеркала заднего вида)`
- `luz de giro izquierda (левый указатель поворота)`
- `espacio / gap (свободный промежуток)`
- `autopista (автомагистраль)`
- `vía rápida (скоростная дорога)`

Architect/Implementation should decide exact Russian wording, but the final content should preserve meaning, source/exam recognition, and readability.

## Scope

In scope:

- Audit every current user-facing `Руководство` section implemented in the native manual guide surface.
- Identify headings, labels, body paragraphs, cards, lists, callouts, captions, table-like text, glossary-like rows, term translation blocks, route/navigation-visible section text, and image-adjacent support text that contain Spanish without a nearby Russian meaning.
- Fix screenshot-highlighted examples and any analogous residues found elsewhere.
- Retain Spanish terms only when they are useful for official/source fidelity, exam recognition, legal/document terminology, signs, source labels, or learner orientation.
- When retaining Spanish, add a Russian translation in parentheses immediately next to the retained term/phrase when feasible, or a clearly adjacent Russian translation when layout/semantics require a different structure.
- Prefer natural Russian learner-facing wording while preserving source meaning, numbers, legal terms, document terms, obligations, exceptions, order, and ticket-relevant details.
- Preserve Spanish official names/acronyms where necessary, with Russian translation/explanation as appropriate.
- Preserve source-as-is protected image pixels and provide Russian support outside the image if text is involved.
- Add or update validation/evidence so incomplete translation residues can be detected, reviewed, and prevented from returning.
- Update durable docs only if implementation changes the reusable manual translation/term-retention contract.

Out of scope for Analyst intake:

- Analyst does not choose the exact implementation architecture, data model, validator algorithm, test selectors, copy wording, or PR slicing.
- Analyst does not edit product code, tests, content, assets, durable docs, existing feature memories, commits, pushes, PRs, reviews, or merge state.
- This request does not change practice-question Spanish source text, exam mode behavior, `Материалы`, `Словарь`, `Источники`, backend policy, Docker runtime contract, or the official Spanish source archive.
- Do not remove useful Spanish source/exam anchors entirely if doing so would hurt recognition or source fidelity.
- Do not translate inside protected source image pixels, signs, road markings, maps, documents, or photos.

## Acceptance Expectations

- The final audit covers all current user-facing `Руководство` content, not only the screenshot section.
- Every Spanish residue in learner-facing manual text is either translated into Russian, retained with a parenthesized Russian translation, or explicitly dispositioned as not requiring translation with evidence.
- The screenshot-highlighted examples are fixed or explicitly covered by equivalent nearby Russian translation support: `Ingreso: carriles de aceleración`, `carriles de aceleración`, `calzada`, `tránsito de la vía principal`, `espejos retrovisores`, `incorporación`, `luz de giro izquierda`, `espacio / gap`, `velocidad adecuada del tramo`, `autopista`, and `vía rápida`.
- Retained Spanish terms use a consistent pattern compatible with the manual style, preferably `Spanish term (Russian translation)` for inline learner text.
- Headings and section labels do not remain Spanish-only unless there is a narrow source-fidelity reason and a Russian translation is shown next to them.
- Russian wording is natural and learner-facing, not a draft wrapper, transliteration, or awkward literal word salad.
- Official/source names, acronyms, document names, sign names, and legal terms remain accurate and recognizable.
- Numeric/legal/safety/document details are not removed, weakened, or changed while fixing translation completeness.
- Existing protected image rules remain intact: source-as-is pixels are not translated or edited; Russian support is adjacent DOM text.
- The UI remains selectable/copyable, responsive, and accessible; fixes do not create mobile clipping, horizontal overflow in prose, overlapping labels, or unselectable image-only Russian text.
- Local-first/offline behavior remains unchanged.
- Verification includes focused evidence for the screenshot examples, whole-manual residue audit evidence, relevant automated tests or validators, and standard local checks selected by Architect.

## Negative Scenarios

- Fixing only the screenshot-highlighted terms while leaving analogous Spanish-only text elsewhere in `Руководство`.
- Removing all Spanish terms indiscriminately, causing learners to lose exam/source recognition.
- Keeping Spanish terms because they are "official" but failing to add Russian translations in parentheses or nearby.
- Leaving Spanish headings, labels, captions, or body phrases unexplained in learner-facing manual text.
- Adding Russian translations far away from the Spanish term so the learner cannot map term to meaning.
- Translating protected source image pixels, signs, road markings, maps, document examples, or photos.
- Replacing source-faithful images with generic translated diagrams as a shortcut.
- Changing legal meaning, numeric values, document requirements, priority rules, traffic-safety obligations, or source-order details during the translation pass.
- Introducing runtime network, backend, live AI, PDF viewer, remote asset/font, analytics, or unrelated product behavior.
- Declaring completion with only an AI-written summary and no audit/test evidence.

## Assumptions

- `все руководство` means the native interactive `Руководство` manual guide surface currently exposed to learners, not the verbatim official Spanish archive under `content/official-documents/`.
- The screenshot examples are from an implemented manual-guide section and should be treated as specific acceptance probes.
- Spanish terms may remain visible when they help recognize official GCBA/source/exam wording, but the user's rule requires Russian translation in parentheses anyway.
- Parentheses are the default requested format for retained Spanish in prose. Architect may allow an equivalent adjacent structured translation for dense lists, tables, cards, or image-adjacent term sets if it is clearer and testable.
- Whole-manual automated detection may need an allowlist for Spanish official acronyms, source IDs, file names, hash/provenance metadata not shown to learners, and protected source image pixels. Such allowlists should be narrow and evidence-backed.
- No normal-flow clarification is required. The user intent is clear enough for architecture work.

## Risks

- A naive Latin-character scan may flag source IDs, file names, acronyms, URLs, test IDs, or protected image metadata that are not learner-facing text.
- A broad allowlist may hide real Spanish residues; acceptance needs enough manual/sample review to avoid a false sense of coverage.
- Some Spanish terms are context-sensitive (`incorporación`, `calzada`, `vía rápida`, `autopista`, `gap`), so translation wording should be reviewed in context rather than mass-replaced blindly.
- Heading fixes can affect route labels, tests, navigation expectations, or screenshots.
- Dense manual sections and prior image-readability work may contain intentionally retained Spanish support structures; implementation must preserve source-as-is image rules while improving adjacent Russian support.
- Translation cleanup can accidentally change legal/safety meaning if it rewrites more than the incomplete Spanish phrase.

## Open Questions For Architect

- What exact audit method should distinguish learner-facing Spanish residues from source IDs, code symbols, URLs, asset names, official acronyms, and protected image pixels?
- Should implementation use one PR for the whole audit or slice by manual chapter/section group if the residue count is large?
- What Russian terminology glossary should govern recurring terms such as `calzada`, `incorporación`, `autopista`, `vía rápida`, `carril`, and `luz de giro`?
- Should the validation gate be a strict automated scan, a structured evidence manifest, focused tests for known examples, or a combination?
- What exceptions are acceptable for Spanish official names/acronyms, and how should they be recorded?

## Sources And Research

No external research was used for intake. Local repository memory was sufficient because the request concerns existing user-facing manual content and established Cabadrive manual-conversion rules.

Local sources read for intake:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/015-study-guide-language-review/feature-request.md`
- `specs/015-study-guide-language-review/spec.md`
- `specs/015-study-guide-language-review/tasks.md`
- `specs/027-manual-vehiculo-4ruedas-ru/feature-request.md`
- `specs/027-manual-vehiculo-4ruedas-ru/spec.md`
- `specs/027-manual-vehiculo-4ruedas-ru/plan.md`
- `specs/027-manual-vehiculo-4ruedas-ru/tasks.md`
- `specs/030-manual-chapters-1-2/feature-request.md`
- `specs/030-manual-chapters-1-2/spec.md`
- `specs/030-manual-chapters-1-2/tasks.md`
- `specs/031-manual-document-completion/feature-request.md`
- `specs/031-manual-document-completion/spec.md`
- `specs/031-manual-document-completion/tasks.md`
- `specs/032-term-translations/feature-request.md`
- `specs/032-term-translations/spec.md`
- `specs/032-term-translations/tasks.md`
- `specs/035-manual-image-readability-translations/feature-request.md`
- `specs/035-manual-image-readability-translations/spec.md`
- `specs/035-manual-image-readability-translations/tasks.md`

Relevant local context from those sources:

- `Руководство` is the native interactive manual destination, distinct from `Источники` and older page-layout/manual-reader paths.
- Manual output must remain local-first and native, not PDF-rendered at runtime.
- Russian learning support must be clear, selectable, and learner-facing.
- Spanish terms are allowed as source/exam anchors only with Russian support.
- Prior glossary work already implemented the requested parenthesized translation pattern for Spanish terms.
- Prior image-readability work already requires nearby structured Russian support when Spanish text remains inside protected/source-as-is images.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect.

Architect should plan a whole-`Руководство` translation-completeness audit and implementation path that fixes screenshot-highlighted Spanish residues plus any analogous learner-facing manual text. The key acceptance rule is: if Spanish remains visible for source/exam fidelity, the learner still gets a Russian translation in parentheses or an equivalent adjacent structured translation.

## Final Analyst Validation

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-07-09T15:46:27Z
- Analyst validated effective content head: 950985e84b24081067ef1221e3a09b17b047ae33
- Analyst return count: 0
- Analyst gaps: none
- Validation basis: final Architect validation passed first and recorded the same effective content head; committed evidence reports 54 rendered `Руководство` routes, including 50 manual section routes and 4 Introduction routes, 3000 inspected learner-facing strings, 1184 candidate residues, 995 retained/translated-with-support records, 189 narrow accepted exceptions, and 0 unresolved findings.
- Customer-outcome conclusion: the final result satisfies the original request to check the whole manual for incomplete translations. Screenshot probes are represented with passing support evidence, retained Spanish learner-facing terms are paired with Russian translations in parentheses or structured adjacent translation, Introduction route coverage includes the `Vision Zero` fix, protected source-image rules remain intact, and no Analyst-blocking gaps remain.

## Final Analyst Validation Notes

- Analyst validation evidence: one prior validation return was routed to Architect; the deterministic audit rerun passed and required no implementation follow-up.
- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-07-09T21:34:27Z
- Analyst validated effective content head: 31084fcfe3870dfe242527254f37c6d926d2c6ef
- Analyst return count: 1
- Customer intent check: passed; all 54 rendered Руководство routes have no unresolved learner-facing Spanish residue without Russian support.
- Analyst validation evidence: current PR head 2ff9f41f0e5b6afee73d3491126bbbafe1d81d03 differs from the effective content head only by Architect-owned final-validation evidence.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-07-09T22:15:54Z
- Analyst validated effective content head: 674220be8f7c820363dc585f690ea5ebecca30a0
- Analyst return count: 1
- Analyst limit escalation: none; return count is within the maximum of 5.
- Gaps, if any: none.
- Analyst validation evidence: final Architect validation for the same effective content head completed first at `2026-07-09T22:14:00Z`; translation-completeness evidence covers 54 rendered `Руководство` routes (50 manual sections and 4 Introduction routes), 3000 inspected learner-facing strings, 1184 candidate residues, 995 retained/translated-with-support records, 189 narrow accepted exceptions, 0 unresolved findings, and 11 passing original screenshot probes in `ch3-highways`, including the focused cross-route negative fixture.
- Customer intent check: passed; the complete rendered native `Руководство` surface is covered, retained Spanish has immediate Russian support, Introduction coverage and the `Vision Zero` correction remain included, and protected-image and local-first boundaries are preserved.
- Architect disposition routing: none required; no Analyst-blocking gap remains.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-07-09T22:29:10Z
- Analyst validated effective content head: 6f82b3eba3e5bce686b6b0fa05c35fb5b16d7049
- Analyst return count: 1
- Analyst limit escalation: none; return count is within the maximum of 5.
- Gaps, if any: none.
- Customer intent check: passed; the complete rendered native `Руководство` surface remains covered, retained Spanish has immediate Russian support, the Introduction coverage and `Vision Zero` correction remain included, and protected-image and local-first boundaries remain preserved.
- Architect disposition routing: none required; the fresh Architect validation for the same effective content head completed first at `2026-07-09T22:26:15Z`, with no unresolved Implementation Agent feedback, task, ticket, or product follow-up.
- Analyst validation evidence/boundary reminder: the focused audit suite passed 11/11, including the cross-route negative fixture; fresh audit check passed with 54 rendered routes (50 manual sections and 4 Introduction routes), 3000 inspected learner-facing strings, 1184 residue records, 189 narrow exceptions, 0 unresolved findings, and all 11 screenshot probes in `ch3-highways`; `6f82b3eba3e5bce686b6b0fa05c35fb5b16d7049` changes only feature-memory finalization evidence/dispositions and preserves the completed P2 implementation, tests, content evidence, runtime, and durable documentation.
