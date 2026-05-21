# Plan: Source Material Refresh

## Strategy

Treat this as a phased content refresh, not a direct PDF import. The first implementation slice should produce the evidence base: PDF inventory, source classification, extraction feasibility, ticket candidate extraction/comparison, and candidate dispositions. Ticket additions, process-guide refresh, and official archive updates should be separate follow-up slices unless the first slice proves a change is tiny and low risk.

## Recommended Slice Order

### Slice 1: Inventory And Candidate Disposition

First slice. This is the recommended starting PR.

- Inventory all seven PDFs.
- Classify each as ticket source, official/manual candidate, Russian learning aid, process-guide candidate, roadmap/reference, rejected, or ambiguous.
- Verify usable PDF text/image extraction tooling within the environment constraints.
- Extract ticket candidates from ticket-source PDFs.
- Compare candidates against the existing 460-ticket fallback bank.
- Record dispositions and blockers.
- Add small helper tooling/tests only if needed for repeatability.
- Do not add large ticket batches in this slice.

### Slice 2+: Accepted Ticket Batches

- Add accepted-current tickets in small reviewable batches.
- Complete the full support blast radius for each batch: sources, question JSON, local images, translations, explanations, difficulty, image metadata/usage, generated indexes, evidence, tests, and validation.
- Keep batch size based on Slice 1 complexity.

### Separate Slice: Process Guide Refresh

- Update `content/guide/caba-exam-process.ru.json` from current official GCBA/ANSV verification.
- Use the supplied process PDF only as a model/reference, not as release authority.
- Preserve unofficial-support status, B1/private-car scope, official links, checked dates, and volatile warnings.

### Optional Slice: Official Archive / Primary Sources

- Only if current official source validation proves an archive or primary-source reader update is needed.
- Preserve exact Spanish official text in `content/official-documents/`.
- Keep Russian learner layers under governed learner-content paths outside the official archive.

## Implementation Constraints

- Preserve sibling work and existing dirty diffs.
- Keep `unofficial_b_fallback` unless Orchestrator/Architect separately scopes an official-bank transition.
- Do not commit user PDFs or derived assets without provenance/license/source-trace evidence.
- Do not hand-edit generated indexes.
- Do not introduce runtime network, backend, raw PDF viewer, remote images, or live AI/OCR.
- Implementation may refine extraction details, but must stay inside the evidence and validation gates in `spec.md`.

## Likely Files

Slice 1 likely touches:

- `specs/025-source-material-refresh/tasks.md`
- Optional scripts/tests for reusable extraction/comparison evidence
- Optional durable evidence artifact if needed for later validation

Ticket slices may touch:

- `content/questions/caba-b.unofficial-fallback.questions.json`
- `content/sources/sources.json`
- `content/assets/questions/...`
- `content/translations/ru/<range>.json`
- `content/explanations/ru/<range>.json`
- `content/image-metadata/question-images/<range>.json`
- generated indexes and validation evidence via tooling
- tests and docs only when affected

Process-guide slice may touch:

- `content/guide/caba-exam-process.ru.json`
- tests/docs only if behavior or validation contract changes

Official-source slice may touch:

- `content/official-documents/...`
- `content/primary-sources/...`
- official/primary-source validators and evidence

## Verification Plan

Slice 1:

```bash
git status --short --branch
pnpm run validate:content
node scripts/check-feature-memory.mjs --worktree
git diff --check
```

Ticket slices:

```bash
pnpm run generate:content-indexes
pnpm run refresh:content-evidence
pnpm run validate:content
pnpm run validate:content:quality
pnpm run test
pnpm run build
pnpm run test:e2e
node scripts/check-feature-memory.mjs --worktree
git diff --check
pnpm run preflight
```

Process-guide or official-source slices should run all relevant validators plus build/preflight when learner-visible content changes.

## Risks

- PDF extraction/cropping may be blocked by unavailable system tools.
- Supplied PDFs may be outdated, unofficial, duplicated, or jurisdiction-mixed.
- Ticket additions can stale many support layers at once.
- Process-guide facts are volatile.
- Official archive exact-text rules are strict.

Mitigation: keep Slice 1 evidence-first, batch later ticket updates, and require validation gates before review.

## Handoff

Implementation Agent should start with Slice 1 unless Orchestrator assigns a narrower slice. Record evidence and blockers in `tasks.md`, and return any official-bank discovery, source conflict, extraction blocker, or scope expansion to Orchestrator for Architect disposition.
