# Feature Request: Design, UX, Typography, And Learning Visual Modernization

## Analyst Intake

- Role: Analyst only.
- Assigned by: Orchestrator.
- Worktree: `/Users/chap/devel/cabadrive-worktrees/026-design-ux-modernization`
- Branch: `codex/026-design-ux-modernization`
- Verified base: `origin/main` at `c083b248564a67d7599fa63d4181759fe30cd6a7`, fetched by Orchestrator on 2026-05-21.
- Feature folder decision: existing maximum numeric prefix under `specs/` is `025`; no `specs/026-design-ux-modernization/` collision was present, so this intake uses `specs/026-design-ux-modernization/`.
- Artifact scope: this file is the only Analyst intake artifact for this pass. No `spec.md`, `plan.md`, `tasks.md`, code, tests, content, generated assets, commits, pushes, or PR actions are part of Analyst scope.
- Parallel-work warning honored: other Cabadrive worktrees, branches, PRs, dirty diffs, and process memory may exist and must be preserved by later roles.

## Original User Request

```text
ты оркертратор, работай строго как оркестратор, начинай работатать в отлельном форкфлоу от свежего main, по итогу вся работа должна быть доведена до конца и смержена в main

задача
сделать дизайн, шрифты, ux и вообще все удобным и современным
нужно составить доку по дизайну, проработать все - навигацию, окна, шрифты
текст часто представляет собой мешанину из испнского и русского текста, нужно это удобно обыграть
если испанский текст в маетриалах необходим, то должен быть подготовлен перевод и он инлайн долден быть виден (по тыку мыши или еще как-то, изучи и сделай хорошо и удобно)
слова и термины в словаре общем и в материалах тоже снабдить картинками, полное покрытие картинами обеспечить, картинки сгенерировать, использовать единые подходы, они должны быть документированы
снабдить учебные маетриалы картинками
- вырабатать и описать стиль и подходы (цвтеовая гамма, детализации, геори)
- для каджого абзаца сгенериировать агентами одну или несколько картинок, иллюстрирующих то, что написано
- доавбить их в материалы
навигаци, шрифты, билеты, таймер - все это сделать красиво удобно современно, при этом в едином стиле

ни в коем случае не менять картинки и формулировки в билетах
пр этом дизайн можно и нужно менять
картинки и формулировки в учебных метериалах можно и нужно менять и добавлять (это не качается билетов)
```

## User Goals

The user wants Cabadrive to feel modern, polished, readable, and convenient across the whole learner experience, not only one card or one screen. The desired outcome includes:

- a durable design document that defines the visual system, typography, navigation, modal/window/dialog patterns, bilingual Spanish/Russian presentation, generated-image style, geometry/detail rules, and asset governance;
- a unified modern app interface for navigation, tickets, learning materials, vocabulary, timers, dialogs, and other visible controls;
- a comfortable way to handle mixed Spanish and Russian text, especially for low-Spanish Russian-speaking learners;
- inline Russian translation support whenever Spanish text remains necessary in learning materials, available through an intentional interaction such as click/tap/keyboard reveal and visible close to the Spanish text;
- image coverage for vocabulary terms and terms used inside materials;
- generated illustrative images for learning materials, including one or more images for each learning-material paragraph where the paragraph is authored learning content rather than immutable ticket wording;
- a documented, consistent generated-image style and production approach;
- preservation of the current ticket content contract: ticket question wording and ticket images must not be changed, while the design around tickets may change.

## Repository Context

Required memory and relevant UI/learning docs were read before writing this intake:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `docs_project/project/frontend/ui-ux-source-of-truth.md`
- `docs_project/project/learning/learning-experience-source-of-truth.md`
- `docs_project/project/frontend/image-explanation-overlays.md`
- `docs_project/project/frontend/ui-ux-product-audit.md`
- `docs_project/project/content-sources.md`
- shard README files for ticket translations, explanations, and question-image metadata
- relevant existing feature memory for learning materials, image metadata, UI/UX rules, learning content polish, difficulty, timer, and all-question learning behavior
- current app/source shape in `src/App.tsx`, `src/styles.css`, and content inventory counts

Current baseline facts observed during intake:

- Cabadrive is a static local-first React + TypeScript + Vite app with Docker-only end-user runtime.
- There is no runtime backend and no runtime network dependency.
- Current content mode is `unofficial_b_fallback`; the UI must not imply a complete official GCBA category B bank.
- Official Spanish text stays primary; Russian translations, explanations, topic guide, visual overlays, and generated learning images are unofficial learning support.
- Active exam attempts hide translation/explanation scaffolding and answer-revealing visual support.
- Current bundled fallback bank contains 460 questions, 276 image-backed question references, and 275 unique local question images.
- Current topic guide contains 38 topics; current vocabulary file contains 10 terms.
- Question translations, explanations, and question-image metadata are maintained in reviewed range shards, with generated compatibility indexes.
- `content/official-documents/` is a verbatim official Spanish archive; Russian translations, simplified text, summaries, generated images, and learning prose must live outside that archive.

## Scope For Future Architect Planning

This is intentionally broad and should be treated as a design-system plus content-enrichment modernization request. It is acceptable for Architect and Orchestrator to split implementation into multiple PR slices, but this Analyst pass keeps one feature folder because the user described one coherent modernization outcome: unified style, bilingual UX, generated learning visuals, and app-wide ergonomic polish.

In scope for later roles:

- Create or update durable design documentation in `docs_project/` covering visual identity, typography, spacing, color, interaction patterns, navigation, dialogs/windows, bilingual text treatment, image style, and asset governance.
- Modernize the app visual system while preserving local-first/static runtime constraints.
- Improve app-wide navigation and layout consistency across `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, `Процесс`, `CABA/RF`, and `Источники`.
- Improve question/ticket card design, timer presentation, feedback, answer controls, difficulty/status metadata, source/status labels, and mobile layout.
- Improve typography for mixed Cyrillic and Spanish/Latin content, including language-specific structure where feasible.
- Design and implement inline translation affordances for Spanish text in learning materials, with pointer and keyboard/touch equivalents.
- Add generated illustrative images to learning materials and vocabulary/term surfaces.
- Define and implement complete local image asset metadata for generated learning images, including alt text, source/provenance, style version, associated paragraph/term IDs, and validation where appropriate.
- Update content validation or add new validation if needed to prove image coverage, translation coverage, local-asset usage, and stale-content safety.
- Update tests and verification evidence for accessibility, mobile layout, non-overlap, no runtime network, and unchanged ticket wording/images.

Out of scope unless Architect records a separate approved expansion:

- Replacing the current question bank or claiming official full-bank coverage.
- Changing active exam behavior to expose translations, explanations, overlays, or other learning scaffolding during active attempts.
- Adding a runtime backend, runtime AI, analytics, remote image fetches, or live content generation.
- Editing official archive text in `content/official-documents/`.
- Creating a full Spanish course, full driving school curriculum, or broad encyclopedia beyond exam-focused CABA preparation.

## Hard Constraints

- Ticket question wording must not change.
- Ticket answer wording must not change.
- Ticket images must not change.
- Design around tickets may and should change.
- Learning-material wording and learning-material images may be changed and added.
- Generated images must not replace or alter canonical ticket images.
- Generated images used by learning materials must be committed local assets, not runtime network assets.
- Any Spanish ticket text rendered in materials must continue to come from canonical ticket data rather than duplicated UI-only copies.
- Official Spanish source archives remain verbatim Spanish-only source material.
- Russian support must remain clearly labeled as unofficial learning support.
- Current `unofficial_b_fallback` status must remain visible enough for trust decisions.
- All interactive reveal controls must be keyboard reachable, touch usable, visibly focusable, and accessible by name/state.
- All visual changes must preserve mobile-first behavior and avoid text overlap/overflow.

## Acceptance Expectations

Later implementation is expected to be complete only when evidence shows:

1. Durable design documentation exists and describes the unified style: palette, typography, spacing, geometry, component states, icon usage, navigation, dialogs/windows, ticket cards, timer, bilingual text rules, generated-image style, asset metadata, and validation expectations.
2. The primary app UI applies the documented style consistently across major surfaces.
3. Navigation remains predictable and exam-focused, with all existing top-level flows still reachable.
4. Mixed Spanish/Russian text is handled intentionally: Spanish source text remains primary where required, Russian support is close to it, and language boundaries are programmatically identifiable where feasible.
5. Spanish text in learning materials that learners need to understand has an inline Russian translation affordance that works with mouse, touch, and keyboard.
6. Active exam attempts still hide translations, explanations, and answer-revealing visual support.
7. Ticket question text, answer text, and ticket image files are unchanged from the assigned implementation baseline, with explicit diff or test evidence.
8. Design-only changes around tickets preserve canonical Spanish question/answer rendering, local ticket image rendering, answer selection, feedback, progress, difficulty metadata, and timer behavior.
9. Vocabulary terms have generated or otherwise approved local illustrative images with documented style, alt text, and provenance.
10. Terms inside learning materials have image coverage or an explicit validated exception where an image would mislead.
11. Learning-material authored paragraphs have one or more local generated images when useful, with complete coverage evidence or Architect-approved exceptions for paragraphs where imagery would be redundant, misleading, legal-sensitive, or purely navigational/status text.
12. Generated images are visually coherent as a set and follow documented rules for road-safety accuracy, level of detail, color, geometry, aspect ratios, icon/sign depiction, and avoidance of decorative clutter.
13. Generated images and illustrations have accessible text alternatives and do not rely on images of text unless the text is also represented as real text.
14. The app remains static/local-first with no runtime backend, runtime AI generation, remote image service, analytics call, or PDF viewer dependency.
15. Verification includes content validation, unit/component tests where relevant, Playwright or equivalent e2e coverage for key flows, mobile/desktop visual evidence, accessibility/focus evidence, and no-overlap evidence.
16. Process memory records decisions, dead ends, risks, coverage evidence, and any implementation feedback for Architect disposition.

## Assumptions

- "Tickets" means canonical practice question records, answer options, correct answer data, and their local question images. These are immutable for this request except for design/presentation around them.
- "Learning materials" means authored support content such as `Материалы`, vocabulary, process/source learner surfaces, and related Russian support prose. It does not include verbatim official archive text or canonical ticket wording.
- "For each paragraph" means each paragraph of authored learning support prose where an illustration can improve comprehension. Architect may define a precise paragraph/content-unit model and exceptions so the implementation remains testable.
- "Generated by agents" means one-time content-production work that creates committed local image assets and metadata; it does not imply runtime image generation in the product.
- Generated learning images should be original educational illustrations or diagrams, not copies of protected third-party source images and not replacements for existing ticket images.
- Existing UI source-of-truth rules remain valid unless Architect explicitly updates them: Spanish primary, Russian support secondary, active exam scaffolding hidden, local assets only, no decorative landing-page treatment.
- A single umbrella feature folder is adequate for intake. Implementation will likely need separate task slices for design docs, UI system, bilingual reveal behavior, generated image pipeline/metadata, vocabulary coverage, materials paragraph coverage, validation, and review fixes.

## Open Questions

No user clarification is required before architecture work. The request is broad but directionally clear enough for Architect to plan with the assumptions above.

Questions for Architect/Orchestrator disposition during planning:

- Should generated image coverage first target `Материалы` and `Словарь`, or also the `Процесс`, `CABA/RF`, and `Источники` learner layers in the same cycle?
- What exact content unit counts as a paragraph for coverage validation: JSON string fields, rendered paragraphs after markdown/line splitting, or a new authored block model?
- Should generated learning images be stored in a new content area such as `content/assets/learning/` with a manifest and validator, or colocated by feature/content family?
- Which visual generation process, prompt template, review evidence, and licensing/provenance record should be required before images are considered production-ready?
- Should inline translation reveal in materials default hidden, default visible, or follow a per-surface rule based on whether the surface is active recall or passive support?

## Risks

- The request is broad enough to become several large PRs. Orchestrator and Architect should slice implementation to keep review, validation, and merge gates manageable.
- Full paragraph-level image coverage may be large and expensive in time, content review, and repository asset size.
- Generated road-safety illustrations can accidentally introduce inaccurate road signs, traffic rules, or visual cues. They require content review and should not be treated as official source evidence.
- Generated images can create accessibility debt if alt text, captions, and local metadata are not planned with the image assets.
- Inline translation reveal can become pointer-only or confusing on mobile unless designed with keyboard/touch alternatives and clear focus/state.
- Mixed-language typography can harm readability if Spanish and Russian are not visually balanced, if line lengths grow too long, or if font choices lack good Cyrillic and Latin support.
- Modern visual polish can weaken trust if status labels become too decorative or hidden; `unofficial_b_fallback` and unofficial Russian-support clarity must remain visible.
- Ticket preservation needs explicit evidence because this request allows broad learning-content edits but forbids ticket wording/image edits.
- Large generated asset sets can slow build size or offline caching if not compressed, dimensioned, and validated.

## Research Basis And Sources

External public-safe research used during intake:

- W3C WCAG 2.2, official Recommendation: supports contrast, keyboard/focus, target sizing, language handling, text alternatives, consistent navigation/identification, and accessible labels/states. Source: https://www.w3.org/TR/WCAG22/
- W3C WAI WCAG overview: confirms WCAG is organized around perceivable, operable, understandable, and robust principles, with WCAG 2.2 as the recommended current target. Source: https://www.w3.org/WAI/standards-guidelines/wcag/
- W3C WAI H58 language-technique guidance: supports marking changes in human language with valid `lang` attributes, relevant for Spanish/Russian mixed text. Source: https://www.w3.org/WAI/WCAG22/Techniques/html/H58
- W3C WAI cognitive accessibility guidance: supports clear purpose, familiar controls, consistent patterns, visible relationships between controls and affected content, and reduced memory burden. Source: https://www.w3.org/TR/coga-usable/
- W3C WAI Images Tutorial and alt decision tree: supports meaningful text alternatives, avoiding images of text where real text can be used, and context-dependent alt text for informative/decorative/functional images. Sources: https://www.w3.org/WAI/tutorials/images/ and https://www.w3.org/WAI/tutorials/images/decision-tree/
- Nielsen Norman Group's usability heuristics: supports visible system status, user-language wording, user control, consistency, recognition over recall, focused/minimal design, and contextual help. Source: https://www.nngroup.com/articles/ten-usability-heuristics/
- Mayer and Fiorella, Cambridge Handbook of Multimedia Learning chapter summary: supports using images with coherence, signaling, and spatial contiguity, and avoiding irrelevant visual overload. Source: https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E

Repository research basis:

- Cabadrive durable UI source of truth already maps WCAG and NN/g principles into product-specific rules.
- Cabadrive learning source of truth already prioritizes active recall, immediate feedback, image signaling, and exam-focused support.
- Existing image-overlay docs already require local, validated image support and forbid invented answer-critical highlights.
- Existing content-source docs already define the boundary between immutable official archives, canonical ticket data, and unofficial learning support.

## Analyst Recommendation

Proceed to Architect without asking the user for clarification. The Architect should turn this into a scoped design-and-content modernization plan, likely with explicit implementation slices and coverage gates. The first Architect decision should be how to separate durable design documentation, UI modernization, bilingual translation interaction, generated-image asset pipeline, vocabulary coverage, and learning-material paragraph coverage while preserving the hard ticket immutability constraint.

## Final Analyst Validation

- Role: Analyst final validation only, invoked by Orchestrator after final Architect validation passed.
- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-21T02:19:25Z
- Analyst validated effective content head: c378db72664b08f75bc27943b0de1206eb1b49bb
- Analyst return count: 0
- Validation basis: reviewed the original intake request, `spec.md`, `plan.md`, final evidence in `tasks.md`, durable design documentation, implementation snippets for language-pair/image/ticket/exam behavior, learning-image manifest/evidence summaries, PR/check state, and local validation output.
- Customer-intent assessment: the final result satisfies the requested unified modernization in spirit and letter by documenting the visual system, modernizing primary UI flows, keeping navigation/tickets/timer in a consistent style, handling Spanish/Russian text with close accessible support, adding governed local images for vocabulary and materials, and preserving ticket wording and ticket images.
- Evidence checked directly during Analyst validation: `pnpm run validate:learning-images` passed with `1382 units, 1382 local images, 1382 direct, 0 shared, 0 exceptions`; `pnpm run validate:content` passed and included learning-image validation; ticket immutability diff against `c083b248564a67d7599fa63d4181759fe30cd6a7` had no output for canonical question JSON and ticket image assets; `git diff --check` passed; `gh pr view 169` showed head `c378db72664b08f75bc27943b0de1206eb1b49bb`, mergeable PR state, and green required checks.
- Gaps or returns: none. No new feature request or Analyst return is needed.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-21T02:55:33Z
- Effective content head: 8e7a283b8409d182645144dd8087e9f87fc7394a
- Analyst validated effective content head: 8e7a283b8409d182645144dd8087e9f87fc7394a
- Analyst return count: 0
- Analyst validation evidence: reviewed the original request, intake expectations, spec scope, plan, tasks evidence, final Architect validation from 2026-05-21T02:50:29Z, helper process evidence, PR #169 state, and check evidence for the current process-evidence head; the implemented result satisfies the requested modern design, typography, UX, bilingual learning support, governed local learning images, vocabulary/material image coverage, active exam support hiding, local-first constraints, and ticket immutability.
- Customer intent check: satisfied in spirit and letter; the feature delivers a unified modern trainer experience with documented visual rules, accessible Spanish/Russian material support, complete governed local learning-image coverage for scoped vocabulary and material units, preserved ticket wording and ticket images, and visible unofficial support/source boundaries.
- Gaps, if any: none.
- Architect disposition routing: no Analyst gap requires Architect disposition.
- Analyst limit escalation: none.
- Analyst boundary reminder: Analyst final validation only; code, runtime files, durable docs, Architect-owned artifacts, tasks, staging, commits, pushes, PR review, and merge state were not changed.
