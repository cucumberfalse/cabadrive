# Spec: Complete Manual Translation Audit

## Architect Scope

This Architect assignment plans feature `041-manual-translation-completion`
only.

- Assigned worktree:
  `/Users/chap/devel/cabadrive-worktrees/040-manual-translation-completion`.
- Assigned branch: `codex/040-manual-translation-completion`.
- Feature memory: `specs/041-manual-translation-completion/`.
- Verified latest-main base from Orchestrator: `origin/main` at
  `ddaa670022d240caa6861adbf30e2e6c8200223f`.
- Intake artifact:
  `specs/041-manual-translation-completion/feature-request.md`.
- Parallel work may exist. Preserve all sibling worktrees, branches, commits,
  PRs, dirty diffs, and process memory. Do not revert or delete sibling work.
- Architect writes only `spec.md`, `plan.md`, and `tasks.md` under this feature
  folder. Architect does not edit code, tests, runtime content, durable docs,
  commits, pushes, PRs, reviews, or merge state.

## Goal

Complete the translation quality pass for the native interactive Russian
`Руководство` so a Russian-speaking learner does not encounter unexplained
Spanish phrases in headings, prose, lists, captions, tables, cards, route
labels, image-adjacent translation support, or other learner-facing manual
text.

Spanish source/exam terms may remain visible when they help recognition or
source fidelity, but retained Spanish must have a Russian translation
immediately adjacent where practical, normally as `Spanish term (Russian
translation)`.

## User Outcome

When studying `Руководство`, the learner can understand every visible Spanish
term or phrase without guessing or leaving the app. If Spanish remains because
it is useful official wording, the nearby Russian text maps that wording to a
clear learner-facing translation.

## Scope

In scope:

- The native interactive `Руководство` manual guide surface only.
- All current implemented manual guide sections in `src/data/manual-sections/`
  and their rendered navigation/content text.
- Learner-facing strings, including `titleRu`, `textRu`, `itemsRu`,
  `captionRu`, `altRu`, table `columnsRu`/`cellsRu`, card labels, callouts,
  structured glossary rows, `termTranslations`, and equivalent block-specific
  Russian-facing fields.
- The screenshot-highlighted Chapter 3 highway residues:
  `Ingreso: carriles de aceleración`, `carriles de aceleración`, `calzada`,
  `tránsito de la vía principal`, `espejos retrovisores`, `incorporación`,
  `luz de giro izquierda`, `espacio / gap`,
  `velocidad adecuada del tramo`, `autopista`, and `vía rápida`.
- Analogous residues across the whole current manual guide.
- A deterministic text-surface audit, committed evidence, tests, and standard
  local verification.
- Durable documentation updates only if implementation changes the reusable
  manual text/term-retention contract.

Out of scope:

- Practice questions, `Материалы`, `Словарь`, `Процесс`, `CABA/RF`,
  `Источники`, exam behavior, storage, backend policy, Docker runtime policy,
  or official source archive content.
- `sourceTextEs`, `sourceTitleEs`, section registry source titles, evidence
  prose, source IDs, asset paths, URLs, hashes, test IDs, and other provenance
  fields that are not rendered as learner-facing Russian support.
- Translating, masking, editing, or relabeling protected source image pixels,
  signs, road markings, maps, document examples, or photos. Image Spanish
  remains governed by feature `035` rules: Russian support belongs outside the
  protected image.
- Removing useful Spanish anchors indiscriminately when recognition of official
  wording matters.

## Translation Completion Contract

Implementation must classify every Spanish or mixed Spanish/Russian residue in
learner-facing manual text into one of these outcomes:

1. **Translated**: replace the residue with natural Russian when the Spanish
   anchor is not useful to keep.
2. **Retained with inline translation**: keep the Spanish source/exam term and
   add a nearby Russian translation, preferably `termEs (translationRu)`.
3. **Retained with structured adjacent translation**: for dense lists, tables,
   cards, glossary rows, or image-adjacent support, keep a clear Spanish/Russian
   pair in the same row/card/definition list.
4. **Allowed non-translation exception**: retain without translation only for a
   narrow, evidence-backed class such as an acronym, official organization
   name, road/street name, legal code identifier, product/system name, URL,
   asset filename, source id, hash, route hash, or protected image pixel
   reference.

Allowed exceptions must be narrow and auditable. A broad "official Spanish" or
"known CABA term" exception is not enough when the term is learner-facing prose.

### PR #206 P2 detector follow-up contract

The follow-up for review threads `PRRT_kwDOSX65IM6P7eKS` and
`PRRT_kwDOSX65IM6P7eKW` is limited to the translation-completeness detector,
its evidence, the affected Chapter 5 learner text, and regression coverage.

- Reverse parenthetical support (`Russian label (Spanish term)`) is valid only
  when the Russian label is structurally and immediately paired with that
  parenthetical term. It must not be inferred from arbitrary Cyrillic context
  earlier in the same string, particularly across a number, another Latin
  token, a sentence boundary, or unrelated punctuation/content.
- The generic two-to-eight-character uppercase exception is forbidden. An
  uppercase learner-facing token may be an exception only when it matches a
  finite, reviewed identifier policy (for example, a documented official
  acronym/system identifier or a standard technical/message abbreviation).
  Unknown uppercase tokens, including ordinary Spanish words rendered in
  uppercase, remain candidates and require Russian support.
- `ACOSO` is not an exception in learner-facing Chapter 5 prose. If it remains
  for recognition of the official reporting line, each visible occurrence must
  supply a direct Russian explanation of the line/term in the same logical
  learner-facing text; a preceding Russian sentence or merely the number
  `22676` is not that explanation.
- The regenerated evidence must classify the affected records using the new
  structural rule and contain no broad uppercase exception.

### PR #206 R.1 rendered-row coverage contract

The follow-up for review discussion `discussion_r3560828500` is limited to the
R.1 semantic invariant and its evidence. The prior semantic correction is
right, but the invariant must be fail-closed over every *currently rendered*
learner-facing R.1 representation, not only the focused source card.

- The invariant's expected rendered R.1 ID set must be exactly:
  - `app4regulatory-p185-003-no-avanzar-catalog-entry` (the individual sign
    catalog entry);
  - `app4-regulatory-no-avanzar-source-card` (the focused R.1 source card);
  - `app4-regulatory-anexo-panel-01-source-card` (the Anexo-panel structured
    term row); and
  - `app4-regulatory-page-185-source-card` (the page-185 structured term row).
- It must derive/collect the current rendered R.1 records from both the
  individual sign catalog and the regulatory source-card term rows, normalize
  the Spanish display spelling/case as needed, and assert exact set equality
  with that expected ID set. A missing row or an unexpected new R.1 row must
  fail the invariant until it is explicitly reviewed and added to the contract.
- For every enumerated ID, the learner-facing Russian value for R.1 must be
  `Проезд запрещен` and must not contain `обгон запрещен`. This coverage is in
  addition to, not a replacement for, the separate `PROHIBIDO ADELANTAR` / `NO
  ADELANTAR` assertion requiring `Обгон запрещен`.
- The invariant must operate on records actually consumed by the current
  renderer; it must not count protected source-image pixels, source-only
  metadata, or an unrendered duplicate as coverage.

## Terminology Requirements

Recurring terms should use consistent Russian wording unless context requires a
specific variant:

| Spanish | Preferred Russian handling |
| --- | --- |
| `carriles de aceleración` | `полосы разгона` |
| `carril de desaceleración` / `carriles de desaceleración` | `полоса/полосы замедления` |
| `calzada` | `проезжая часть` |
| `tránsito de la vía principal` | `движение по основной дороге/магистрали` by context |
| `espejos retrovisores` | `зеркала заднего вида` |
| `incorporación` | `включение в поток` |
| `luz de giro izquierda` | `левый указатель поворота` |
| `espacio / gap` | `свободный промежуток` or `окно в потоке` |
| `velocidad adecuada del tramo` | `подходящая скорость для этого участка` |
| `autopista` | `автомагистраль` |
| `vía rápida` / `vías rápidas` | `скоростная дорога` / `скоростные дороги` |
| `banquina` | `обочина` |
| `carril izquierdo` / `carril derecho` | `левая полоса` / `правая полоса` |
| `sobrepaso` / `adelantamiento` | preserve the existing distinction where the manual already uses it; translate as `опережение` / `обгон` when context supports it |
| `NO AVANZAR` (R.1) | `Проезд запрещен`; this is not the no-overtaking sign |
| `PROHIBIDO ADELANTAR` / `NO ADELANTAR` | `Обгон запрещен`; do not use this meaning for `NO AVANZAR` |
| `balizas` / `intermitentes` | `аварийная сигнализация` / `мигающие аварийные огни` by context |
| `auxilio` / `asistencia` | `помощь` / `техническая помощь` by context |

Implementation may refine wording in context, but should keep a single
terminology decision per recurring exam/source term in process memory when the
same Spanish term appears multiple times.

## Audit Method

Add a deterministic manual text translation-completeness audit, preferably
`scripts/manual-guide-translation-completeness-audit.mjs`, and wire it into
`pnpm run validate:manual-guide` and the existing `validate:content` path.

The audit should:

- Enumerate current manual guide sections from `src/data/manual-sections/`.
- Prefer TypeScript compiler AST evaluation or a shared structured data loader
  over line-oriented grep.
- Inspect only learner-facing fields and record field path, section id, block
  id, block kind, text value, residue span, and disposition.
- Ignore provenance/source fields by default: `sourceTextEs`, `sourceTitleEs`,
  source registry titles, source/evidence notes, screenshot paths, asset paths,
  selectors, route hashes, hashes, and validation-only metadata.
- Treat protected image pixels as out of scope for this text audit; their
  adjacent DOM support may still be inspected if it is learner-facing text.
- Detect likely Spanish residue using Latin-script and Spanish-word heuristics
  that include accented Spanish, common traffic terms, and the screenshot
  probes.
- Reject known bad mixed-language patterns such as Spanish phrases embedded in
  Russian strings without parenthesized/adjacent translation.
- Support a committed, narrow exception/allowlist model in the evidence file,
  not hidden in script code alone.
- Fail check mode when evidence is missing, stale, over-broad, or when any
  learner-facing residue lacks one of the accepted dispositions.

Recommended evidence path:

`content/validation/manual-guide-translation-completeness.evidence.json`

Evidence should include schema version, feature id, generatedBy, deterministic
counts, inspected section count, inspected string count, residue count,
accepted exception count, screenshot-probe coverage, terminology decisions,
per-residue dispositions, and representative route/screenshot evidence paths.

## Acceptance Criteria

1. Given the learner opens any implemented `Руководство` section, no heading,
   label, body paragraph, list item, table cell, caption, card text, route label,
   or image-adjacent DOM support contains unexplained Spanish learner-facing
   text.
2. Given a Spanish term or phrase is intentionally retained in learner-facing
   manual text, it has an immediate parenthesized Russian translation or an
   equivalent adjacent Spanish/Russian structured pair in the same logical row,
   card, list item, table cell, or caption.
3. Given the Chapter 3 highways section is inspected, every screenshot probe is
   fixed or covered by adjacent Russian translation support in that same
   `ch3-highways` section; a matching residue, text excerpt, or disposition on
   any other manual or Introduction route cannot satisfy this criterion:
   `Ingreso: carriles de aceleración`, `carriles de aceleración`, `calzada`,
   `tránsito de la vía principal`, `espejos retrovisores`, `incorporación`,
   `luz de giro izquierda`, `espacio / gap`,
   `velocidad adecuada del tramo`, `autopista`, and `vía rápida`.
4. Given the whole manual guide text audit runs, it covers every current
   implemented manual section and records every retained Spanish learner-facing
   residue with an accepted disposition.
5. Given source/provenance fields are inspected, official Spanish source text,
   IDs, URLs, hashes, file names, route hashes, and validation-only metadata are
   not treated as learner-facing translation failures.
6. Given protected images are inspected, their pixels remain unchanged; any
   Spanish in protected pixels remains governed by source-as-is image rules and
   nearby Russian DOM support.
7. Given official acronyms, road names, legal references, organization names,
   or document names remain in Spanish, the exception is narrow and recorded;
   surrounding generic Spanish traffic terms still receive Russian support.
8. Given Russian wording changes are made, legal, numeric, document, safety,
   route, lane, priority, emergency, and obligation meanings are preserved.
9. Given mobile and desktop layouts are checked, new parenthesized translations
   wrap cleanly without document-level horizontal overflow, clipping,
   overlapping, or unselectable image-only Russian text.
10. Given local-first validation runs, no runtime PDF viewer, PDF.js, iframe or
    object/embed PDF, remote assets/fonts, runtime fetch, backend endpoint,
    analytics, live AI, or unrelated product behavior is introduced.
11. Given implementation is complete, verification evidence includes the
    screenshot probes, whole-guide audit evidence, focused automated tests, and
    standard local checks recorded in `tasks.md`.
12. Given the Appendix IV regulatory-sign R.1 source card is rendered or
    audited, `NO AVANZAR` has the direct Russian support `Проезд запрещен` in
    every learner-facing caption, alternative text, and structured term record.
    `Обгон запрещен` is reserved for the distinct `PROHIBIDO ADELANTAR` / `NO
    ADELANTAR` sign; a parenthesized translation must not override or contradict
    the card's canonical structured translation.
13. Given the R.1 semantic invariant runs, it proves complete coverage of the
    four currently rendered learner-facing IDs
    `app4regulatory-p185-003-no-avanzar-catalog-entry`,
    `app4-regulatory-no-avanzar-source-card`,
    `app4-regulatory-anexo-panel-01-source-card`, and
    `app4-regulatory-page-185-source-card`. The invariant fails if an expected
    row is absent or an unreviewed rendered R.1 row appears.

## Negative Scenarios

- Fixing only `ch3-highways.ts` while leaving analogous residues elsewhere.
- Replacing all Spanish with Russian-only text where official/exam recognition
  would be harmed.
- Keeping Spanish because it is official but omitting Russian translation
  nearby.
- Adding one broad paragraph that translates many scattered Spanish terms far
  away from the terms themselves.
- Allowlisting generic Spanish traffic words such as `calzada`, `carril`,
  `velocidad`, `señales`, `autopista`, or `vía rápida` without nearby Russian
  support.
- Counting `sourceTextEs` or image pixels as failures while missing real
  learner-facing `itemsRu`/`cellsRu` residues.
- Translating protected image pixels, sign bodies, road markings, maps, photos,
  or document examples.
- Changing speed limits, legal obligations, road names, document requirements,
  lane rules, emergency actions, or source order during cleanup.
- Adding unrelated UI redesign, remote services, new runtime dependencies, or
  non-manual product changes.
- Declaring completion from an AI-written summary without committed audit/test
  evidence.
- Treating the Spanish surface form `NO AVANZAR` as if it were the distinct
  no-overtaking sign, or updating only one of the card caption, alt text,
  structured translation, catalog data, or evidence while another
  learner-facing representation still says `обгон запрещен`.
- Passing the R.1 invariant by checking only the focused source card while the
  rendered Anexo-panel row, page-185 row, or individual catalog entry is
  omitted; or silently allowing a newly rendered R.1 representation without
  explicit review and invariant coverage.

## Implementation Requirements

- Start from the assigned Orchestrator worktree/branch or another explicit
  latest-main isolated slice.
- Read `feature-request.md`, this `spec.md`, `plan.md`, and `tasks.md` before
  editing product files.
- Audit likely files:
  - `src/data/manual-sections/*.ts`
  - `src/data/manualGuide.ts`
  - manual guide renderer paths in `src/App.tsx`
  - manual guide tests/validators under `tests/` and `scripts/`
  - validation evidence under `content/validation/`
- Add the new text audit script and tests.
- Update manual section content so retained Spanish terms have nearby Russian
  translations or accepted structured pairs.
- Update existing tests that currently assert Spanish-only residues, replacing
  them with assertions for the corrected Spanish/Russian form or Russian-only
  text.
- Update durable docs only if the reusable manual conversion contract changes.
- Keep `specs/041-manual-translation-completion/tasks.md` current with
  decisions, dead ends, evidence, and Implementation Agent feedback.

## Review Requirements

Review Agent must check:

- Role-boundary compliance and complete feature memory.
- Whole native `Руководство` coverage, not only the screenshot section.
- Audit strength: no broad allowlist, no grep-only blind spots, no source-field
  false positives masking runtime strings.
- Translation quality and terminology consistency for recurring Spanish terms.
- Preservation of legal, numeric, safety, document, source-order, and road-name
  meaning.
- Protected image pixels and feature `035` adjacent-DOM translation rules remain
  intact.
- Renderer/CSS changes, if any, keep text selectable, accessible, and
  responsive.
- Evidence freshness and validation wiring through `validate:manual-guide` and
  `validate:content`.
- No unrelated product, backend, source-reader, PDF-viewer, remote-runtime, or
  asset churn is bundled.

## Test And Verification Requirements

Minimum verification before PR handoff:

```bash
node scripts/check-feature-memory.mjs --worktree
node scripts/manual-guide-translation-completeness-audit.mjs --write
pnpm run validate:manual-guide
pnpm run validate:content
pnpm exec tsc --noEmit
pnpm run test
pnpm run build
pnpm run test:e2e
git diff --check
pnpm run preflight
```

If `pnpm run test:e2e` or `pnpm run preflight` is not feasible, record the
blocker and substitute focused evidence approved by Orchestrator.

Focused tests should prove:

- The new audit fails missing/stale/malformed evidence.
- The audit enumerates all implemented manual sections and learner-facing text
  fields.
- The audit ignores source/provenance fields and protected image pixels.
- The audit rejects Spanish residues in `titleRu`, `textRu`, `itemsRu`,
  `captionRu`, table cells, card text, and equivalent rendered fields when no
  Russian translation is adjacent.
- The audit rejects over-broad exceptions for generic Spanish traffic terms.
- The audit rejects a reverse parenthetical false positive where unrelated
  Russian context precedes `(... ACOSO ...)`, while accepting a genuinely
  adjacent `Russian explanation (Spanish term)` pair.
- The audit rejects a generic uppercase learner-facing Spanish word and allows
  only the reviewed finite identifier set; it requires direct Russian support
  for retained `ACOSO` in the Chapter 5 reporting-line text.
- The screenshot probes are present in the audit evidence and pass.
- The Chapter 3 highways route renders corrected Spanish/Russian support on
  desktop and mobile with no horizontal overflow.

## Process Memory

### Decisions

- Decision: scope is the native interactive `Руководство` only, not the older
  page-faithful manual reader, official archive, practice-question text, or
  other product surfaces.
- Decision: implement as one content/validation PR slice unless Orchestrator
  finds an implementation-time blocker or unexpectedly large independent
  residue class.
- Decision: add a text-surface translation-completeness audit instead of
  relying on manual grep or screenshot review alone.
- Decision: Spanish retained for source/exam recognition must still get nearby
  Russian support; only narrow non-learner-facing/proper-name/source-id
  exceptions may remain untranslated.
- Decision: protected source image pixels remain governed by feature `035` and
  are not edited by this feature.
- Review-fix decision: required screenshot-probe coverage is section-scoped.
  For every user-highlighted probe, the audit must find its non-unresolved
  candidate and report its evidence from `ch3-highways`; matching wording on a
  different manual or Introduction route is not substitute coverage.

### Dead Ends

- None during Architect planning.

### Known Issues

- Current read-only inspection confirmed the screenshot examples exist in
  `src/data/manual-sections/ch3-highways.ts`.
- Current read-only inspection also found analogous Spanish residues in other
  manual section strings, including speed/highway/safety list and table text.
  Exact fix counts must be refreshed by the implementation audit.

### Implementation Agent Feedback

- Manual ticket-placement fingerprint sensitivity was routed to Architect and
  dispositioned in `tasks.md` as known future-maintenance guidance, with no
  additional feature task or future ticket required now.

### Final Architect Validation

> **Stale as of PR #206 review discussions `PRRT_kwDOSX65IM6P8IoE` (comment
> `3560691165`) and `discussion_r3560828500`.** The first review identified a
> non-evidence learner-facing R.1 translation defect; the later P2 confirms the
> semantic fix but finds that T100 omits two currently rendered R.1 term rows.
> The invariant must enumerate all four rendered R.1 learner-facing IDs before
> it can prove the correction will not regress. The prior Architect and Analyst
> passes therefore cannot authorize completion or merge until the narrow
> coverage follow-up is implemented, independently reviewed, and revalidated in
> Architect-then-Analyst order on the resulting effective content head.

- Architect validation pass: passed
- Final Architect validation completed at: 2026-07-09T15:43:28Z
- Architect validated effective content head: 950985e84b24081067ef1221e3a09b17b047ae33
- Current PR head validated for final Architect context:
  `ad299c42f8dacae323a8f7f1394009dac31c88d3`.
- Current PR head note: commit `ad299c42` is after effective content head
  `950985e84b24081067ef1221e3a09b17b047ae33` and changes only
  `specs/041-manual-translation-completion/tasks.md`, so it is final
  evidence/process-memory only and does not change product behavior, content,
  tests, runtime files, durable docs, or validation scripts.
- Cycle PR set reviewed: PR #206 on branch
  `codex/040-manual-translation-completion`, including implementation commit
  `bf0ddfb`, Architect feedback disposition commit `36bede2`, review-fix
  commit `daf876a`, Introduction audit coverage commit `950985e`, and later
  evidence-only commit `ad299c42`.
- Validation basis: feature request, spec, plan, task log, verification
  evidence, review-fix evidence, Introduction route follow-up evidence, and the
  Orchestrator-provided PR state showing green required checks, clean merge
  state, resolved review threads, and current-head no-findings review.
- Architect conclusion: the implemented audit and evidence cover the native
  `Руководство` surface, including 50 manual section routes and 4 Introduction
  routes; screenshot probes and analogous learner-facing residues are covered;
  retained Spanish is supported by immediate or structured Russian translation
  or narrow recorded exceptions; protected image and local-first/runtime
  boundaries remain intact; Implementation Agent feedback is dispositioned as
  known future maintenance with no new task required for this feature.
- Superseded by PR #206 P2 follow-up: the later review finding shows that
  required-probe resolution was not constrained to `ch3-highways`. The prior
  Architect pass is stale for the current PR head until the assigned follow-up
  task is implemented, verified, reviewed, and revalidated.
- Superseded again by PR #206 detector follow-up: review threads
  `PRRT_kwDOSX65IM6P7eKS` and `PRRT_kwDOSX65IM6P7eKW` demonstrate that the
  current reverse-parenthetical and generic-uppercase paths can accept
  unsupported learner-facing Spanish. Every earlier Architect final-validation
  pass and corresponding Analyst validation is stale until this follow-up is
  implemented, verified, reviewed, and revalidated on its new effective
  content head.
