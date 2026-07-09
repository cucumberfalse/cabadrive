# Plan: Complete Manual Translation Audit

## Summary

Implement this as one content-quality and validation PR slice. The request is a
single whole-guide defect class: learner-facing Spanish residues in the native
interactive `Руководство`. A split by chapter is not recommended unless the
implementation audit reveals a large independent model change or an unusually
high-risk residue class that cannot be safely reviewed in one PR.

The implementation should preserve the existing manual architecture:
TypeScript section data, React rendering, local assets, static/offline build,
existing manual guide validation, and protected image rules. The new durable
contract is a text-surface translation-completeness audit that distinguishes
learner-facing manual strings from Spanish source/provenance fields and
protected source pixels.

## Existing Rails To Reuse

- `src/data/manualGuide.ts` already centralizes manual guide section imports,
  block types, implemented sections, navigation, and style-token metadata.
- `src/data/manual-sections/*.ts` is the primary content source for the native
  manual guide.
- `src/App.tsx` renders manual guide sections through block-kind branches and
  reusable helpers such as `ManualImageTermTranslations`.
- Existing validators are wired through:
  - `pnpm run validate:manual-guide`
  - `pnpm run validate:content`
- Existing manual guide validators use deterministic JSON evidence under
  `content/validation/` and fail check mode when evidence is stale.
- Feature `032` established structured glossary rows with
  `Spanish term (Russian translation): Russian definition`.
- Feature `035` established structured Spanish/Russian DOM support outside
  protected images.

## Data And Audit Model

Add a new audit script:

```text
scripts/manual-guide-translation-completeness-audit.mjs
```

Recommended evidence file:

```text
content/validation/manual-guide-translation-completeness.evidence.json
```

The audit should use TypeScript compiler AST evaluation or a shared structured
loader similar to the image readability audit. It should inspect section data
objects rather than raw source lines where practical.

Inspect learner-facing fields, including:

- Section-level `titleRu`.
- Block `titleRu`, `textRu`, `itemsRu`, `captionRu`, `altRu`, `columnsRu`,
  `cellsRu`, `bodyRu`, `noticeItemsRu`, `closingRu`, and similarly named
  Russian-facing fields.
- Nested card/group/example/benefit/signal/label fields that render to the
  manual DOM.
- `termTranslations` as already structured Spanish/Russian pairs.
- Navigation-visible Russian labels if implementation finds any rendered label
  outside the section content objects.

Ignore or classify as non-learner-facing by default:

- `sourceTextEs`, `sourceTitleEs`, registry source titles, source boundary
  evidence, source page pointers, section module paths, source screenshots,
  Russian screenshot paths, source regions, selectors, route hashes, test IDs,
  asset paths, URLs, hashes, and validation-only notes.
- Spanish inside protected image pixels. The audit may check the adjacent DOM
  translation fields for those images, but must not require pixel edits.

Evidence should include:

- `schemaVersion`, `featureId`, `generatedBy`.
- Deterministic counts: implemented sections, inspected fields, inspected
  strings, candidate residues, translated/retained/exception dispositions,
  validation findings.
- Per-candidate records with section id, module path, block id/kind, field
  path, text excerpt, detected Spanish phrase, accepted disposition, and
  reviewer note if allowlisted.
- Required screenshot-probe records for the user-highlighted Chapter 3 terms.
  Each record must be sourced from `ch3-highways`; the candidate lookup and any
  fallback evidence lookup must both be constrained to that section, so an
  identical supported phrase elsewhere in `Руководство` cannot pass a missing
  Chapter 3 probe.
- A terminology map for recurring Spanish terms and chosen Russian wording.
- A narrow allowlist/exception list for acronyms, road names, document names,
  legal references, URLs, hashes, file names, and other non-translated items.

Check mode must fail if committed evidence is missing, malformed, stale, has
unresolved findings, has missing screenshot probes, or contains an over-broad
exception for generic Spanish traffic terms.

## Residue Detection Strategy

Use a layered detector:

1. Latin-script scan over learner-facing fields, excluding numbers, units, and
   short all-caps acronyms before Spanish-term analysis.
2. Spanish traffic/source term dictionary seeded from the screenshot examples
   and current likely residue families: `autopista`, `vía rápida`, `calzada`,
   `carril`, `banquina`, `velocidad`, `señal`, `tránsito`, `ingreso`,
   `salida`, `incorporación`, `sobrepaso`, `adelantamiento`, `balizas`,
   `auxilio`, `remolque`, `acarreo`, `vehículo`, `avería`, `emergency`, and
   analogous accented/unaccented variants found during audit.
3. Mixed-language pattern checks for Spanish phrases embedded in Russian
   strings without parentheses or adjacent structured translation.
4. Explicit required-probe matching for the screenshot terms so they cannot be
   missed by generic heuristics.
5. Allowlist evaluation only after candidate detection, so exceptions are
   visible in evidence.

The implementation may keep official names such as road names, organizations,
and document/system names in their official form, but generic Spanish words
around those names still need Russian translation. Example: an official road
name may stay as `Autopista 25 de Mayo`, while generic `autopistas` in prose
should become `autopistas (автомагистрали)` or simply `автомагистрали`.

## Content Fix Strategy

For each residue:

1. Prefer natural Russian-only wording when Spanish recognition is not useful.
2. Retain Spanish plus parenthesized Russian when the learner benefits from
   recognizing the official/source term.
3. Use structured Spanish/Russian pairs for dense term lists, image-adjacent
   translation lists, glossary rows, and table cells where parentheses would
   be visually noisy.
4. Preserve legal, numeric, source-order, document, safety, speed, lane,
   priority, emergency, and exception details.
5. Avoid mass replacements without context review, especially for
   `incorporación`, `vía rápida`, `autopista`, `calzada`, `carril`,
   `sobrepaso`, and road/street names.

High-priority implementation target:

- `src/data/manual-sections/ch3-highways.ts` must fix the screenshot examples
  and current tests that assert those Spanish-only strings.

Other likely target files from read-only inspection:

- `src/data/manual-sections/ch3-speed.ts`
- `src/data/manual-sections/ch3-stopping-parking.ts`
- `src/data/manual-sections/app1-other-required-safety-elements.ts`
- `src/data/manual-sections/app3-safe-driving.ts`
- `src/data/manual-sections/app3-safety-elements.ts`
- Any additional `src/data/manual-sections/*.ts` surfaced by the audit.

## Renderer And CSS

Most fixes should be content/data changes. Renderer or CSS changes are needed
only if a block type cannot express adjacent Spanish/Russian support cleanly.

If renderer changes are needed:

- Reuse `ManualImageTermTranslations` or a similarly small reusable structured
  pair renderer for Spanish/Russian term rows.
- Use `lang="es"` on retained Spanish terms and `lang="ru"` on Russian
  translations where feasible.
- Keep all learner text selectable/copyable DOM text.
- Avoid badge-like fixed-width labels that clip longer Spanish or Russian text.
- Ensure parenthesized translations wrap naturally on mobile and do not create
  document-level overflow.

## Tests

Add/update tests for:

- Audit write/check behavior and stale evidence rejection.
- Complete enumeration of current implemented manual guide sections.
- Detection of Spanish residues in representative learner-facing fields:
  headings, list items, table cells, captions, card body text, alt text, and
  term translation support.
- Ignoring `sourceTextEs`, `sourceTitleEs`, asset paths, URLs, hashes, and
  protected-image pixel references.
- Rejection of broad allowlist entries for generic Spanish terms.
- Required screenshot-probe coverage for `ch3-highways`, including a negative
  regression fixture where an identical supported phrase exists only in another
  route and the audit still reports the Chapter 3 probe as missing.
- Existing tests that currently assert Spanish-only residue are updated to
  assert corrected translated forms.

Focused Playwright or E2E checks should open the Chapter 3 highways route on
desktop and mobile and verify:

- The screenshot terms render with Russian translation support.
- Spanish terms retained for recognition have nearby Russian support.
- Text is selectable DOM text and no document-level horizontal overflow occurs.

## Durable Docs

Update `docs_project/project/frontend/manual-conversion-guidelines.md` only if
implementation creates a reusable rule beyond this feature memory. A likely
small update is appropriate if the text audit becomes a durable validator:

- learner-facing Spanish terms must be translated, or retained with immediate
  Russian support;
- source/provenance Spanish and protected image pixels are distinct from
  learner-facing manual strings;
- broad allowlists for generic traffic terms are forbidden.

Do not update unrelated durable docs.

## Verification Commands

Implementation Agent should run and record exact results in
`specs/041-manual-translation-completion/tasks.md`:

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

If full e2e or preflight cannot run, record why, preserve the failing/blocking
output, and provide focused substitute evidence only with Orchestrator
coordination.

## PR Slicing

Recommended: one Implementation Agent, one branch, one ready PR.

Reasons:

- The request is one product-quality invariant across one user-facing surface.
- Current likely changes are content cleanup plus one validator/evidence file.
- Splitting by chapter would make it easier for residues to remain between PRs
  and would complicate final acceptance for "all Руководство".

Possible split triggers:

- The audit reveals a separate renderer/model gap that should land before
  content cleanup.
- The residue count is large enough that review would be unsafe in one PR.
- A validator rewrite touches shared infrastructure beyond manual guide scope.

If a split is needed, Implementation Agent must stop and record feedback for
Orchestrator/Architect disposition before creating unrelated changes.
