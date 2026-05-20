# Spec: Source Material Refresh

## Context

- Feature folder: `specs/025-source-material-refresh/`
- Architect worktree: `/Users/chap/devel/cabadrive-worktrees/025-source-material-refresh`
- Branch: `codex/025-source-material-refresh`
- Verified base: `origin/main = 04d2a3279cb3512dbc52625a687e7ba44a3d339b`
- Architect scope: this `spec.md`, `plan.md`, and `tasks.md` only.

Cabadrive currently uses `unofficial_b_fallback` practice content. The current 460-question fallback bank already has complete Russian translations, explanations, difficulty metadata, local image metadata/usage evidence, generated indexes, and validation gates. This refresh must not weaken those guarantees or imply a complete official CABA category B bank unless that is independently proven and separately scoped.

## Goal

Process the supplied local PDFs as source candidates, refresh project materials only where current verified evidence supports changes, compare all extracted ticket candidates to the existing bundled tickets, and update the license acquisition/renewal guide from current official sources while keeping official Spanish source material separate from unofficial Russian learner support.

## Scope

In scope:

- Inventory each supplied PDF with role, source status, use/reject disposition, and evidence.
- Extract ticket candidates from ticket-source PDFs during implementation.
- Compare extracted candidates against existing bundled tickets by Spanish question, answers, correct answer, category, and image identity/usage where applicable.
- For absent candidates, accept only current, CABA category B/B1 in-scope tickets with official/legal/source support.
- Add accepted tickets only with complete Spanish tuple, stable IDs, source trace, local image crop when needed, Russian translation, Russian explanation, difficulty metadata, image metadata/usage, generated indexes, and validation evidence.
- Refresh official archives, primary-source reader content, topic/vocabulary materials, or durable docs only when verified source changes require it.
- Update `content/guide/caba-exam-process.ru.json` only with current official GCBA/ANSV-backed process facts.

Out of scope:

- Claiming `official_full_bank` or official complete B-bank coverage without a separate Architect-scoped source-mode transition.
- Treating user PDFs as authoritative solely because they were supplied.
- Raw PDF viewer support, backend services, runtime network calls, remote images, live AI/OCR, or broad UI redesign.
- Storing Russian explanations/translations/notes under `content/official-documents/`.
- Hand-editing generated compatibility indexes.

## Source Candidates

Implementation must inventory these PDFs before using them:

- `/Users/chap/Downloads/categoriab.pdf`
- `/Users/chap/Downloads/MANUAL_Vehiculo_4Ruedas_2023 SA.pdf`
- `/Users/chap/Downloads/PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf`
- `/Users/chap/Downloads/agent_roadmap_ru.pdf`
- `/Users/chap/Downloads/трудные билеты.pdf`
- `/Users/chap/Downloads/ПДД Аргентины.pdf`
- `/Users/chap/Downloads/Первое_получение_прав_и_обновление.pdf`

For each PDF record at minimum: path, existence, SHA-256, apparent title/source/date when recoverable, role, source authority, currentness status, licensing/provenance concerns, and final disposition.

## Requirements

- FR-001: Preserve current `unofficial_b_fallback` truth unless an official full-bank transition is independently proven and rerouted.
- FR-002: Keep official Spanish archives exact and Spanish-only under `content/official-documents/`.
- FR-003: Keep Russian learner support outside official archives and clearly unofficial.
- FR-004: Do not add or change active tickets without full blast-radius updates: question data, source records, translations, explanations, difficulty, image metadata/usage, generated indexes, and evidence.
- FR-005: Candidate comparison must handle exact duplicates, variants, changed answer order, wording differences, image reuse, and conflicting correct answers.
- FR-006: Every candidate must receive a disposition: duplicate, accepted-current, out-of-scope, outdated, unsupported, ambiguous, or deferred.
- FR-007: Accepted tickets must cite current official/legal/source evidence; unsupported or stale candidates remain rejected/deferred.
- FR-008: Image-backed accepted tickets require traceable local crop, hash, dimensions, source page/region evidence, visual review, and question-specific image usage metadata.
- FR-009: Process-guide updates must pass `scripts/content-caba-exam-process.mjs` through `pnpm run validate:content` and preserve volatile-info warnings.
- FR-010: Use project/bundled tooling for PDF work. System `pdftotext`, `pdfinfo`, and `pdftoppm` are absent in this environment; implementation may refine extraction tooling within this constraint.

## Acceptance Criteria

1. Every supplied PDF has inventory and use/reject evidence.
2. Ticket-source PDFs have extracted candidates or a recorded extraction blocker.
3. Every candidate is compared to the existing bundled bank and dispositioned.
4. No accepted ticket relies only on an unverified PDF.
5. Accepted tickets, if any, include complete learning support and pass content plus quality validation.
6. New or changed image-backed tickets include crop, hash, metadata, usage, and explanation-alignment evidence.
7. Process-guide changes, if any, cite current official sources, update checked dates, and retain unofficial/volatile warnings.
8. Official archive changes, if any, preserve exact Spanish text and currentness/exact-text evidence.
9. The app never claims official full B-bank status unless separately scoped and proven.
10. Required validation and process-memory evidence are recorded before review.

## Negative Scenarios

- Adding near-duplicate tickets because comparison used raw text equality only.
- Updating ticket text without refreshing all dependent support/evidence.
- Copying process-guide facts from a supplied PDF without current official verification.
- Adding image crops without source trace, hash, crop evidence, or visual review.
- Mixing Russian learner support into `content/official-documents/`.
- Editing generated indexes by hand.
- Shipping changed content while `validate:content` or applicable quality gates fail.

## Verification Requirements

Minimum for every implementation slice:

```bash
git status --short --branch
pnpm run validate:content
node scripts/check-feature-memory.mjs --worktree
git diff --check
```

For ticket/support/image changes also run:

```bash
pnpm run generate:content-indexes
pnpm run refresh:content-evidence
pnpm run validate:content:quality
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run preflight
```

For official archive changes, run the relevant exact-text/currentness validation in addition to content validation.

## Review Requirements

Review must verify feature-memory completeness, role boundaries, PDF inventory, candidate comparison/dispositions, accepted-ticket support completeness, image evidence, process-guide source currentness, official archive separation, validation evidence, and absence of official-full-bank claims.
