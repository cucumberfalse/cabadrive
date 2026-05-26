# Feature Request: Complete Russian Manual Surface for 4-Wheel Vehicle Manual

## Intake Metadata

- Feature ID: `027-manual-vehiculo-4ruedas-ru`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/027-manual-vehiculo-4ruedas-ru`
- Assigned branch: `codex/027-manual-vehiculo-4ruedas-ru`
- Verified base provided by Orchestrator: `origin/main` at `4ad235f6e339c0f995098cc59d1eede04f60e739`
- Parallel-work warning: parallel work may exist; sibling worktrees, branches, commits, PRs, dirty diffs, and process memory must be preserved.
- Intake artifact scope: this Analyst intake creates only this `feature-request.md`; Architect-owned `spec.md`, `plan.md`, and `tasks.md` are intentionally not created by Analyst.

## Original User Request

> ты строго оркестратор; нужно интегрировать этот материал на сайт на русском языке отдельным блоком; полный точный перевод, не упрощать, не удалять ничего; не мвп, не тестовый вариант, полностью; сохранить все изображения

## Source Material

- Source PDF path provided by Orchestrator: `/Users/chap/Downloads/MANUAL_Vehiculo_4Ruedas_2023 SA.pdf`
- Orchestrator evidence already gathered:
  - File exists.
  - Size: `71667934` bytes.
  - SHA-256: `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`
  - Page count by `mdls`: `200`
  - Byte-identical to repository official archive file: `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
- Analyst did not inspect the full PDF during intake, per assignment.

## Current Repository Context

- The official document archive already contains `gcba-manual-vehiculo-4-ruedas-2023`.
- Existing primary-source learner shards already contain `198` approved Russian translation chunks.
- Current manifest conversion notes say Markdown does not preserve images, icons, tables, typography, or pagination.
- The current source reader displays text chunks only.
- Therefore, the existing learner shards may be useful as source-aligned translation material, but they are not sufficient by themselves to satisfy the requested complete visual/manual preservation.

## Requested Outcome

Integrate the complete `MANUAL_Vehiculo_4Ruedas_2023 SA.pdf` material into the Cabadrive site as a separate Russian-language block or surface for learners.

The integrated experience must use local/offline assets and preserve all source content and all images from the official Spanish manual. The Russian content must be a full, exact translation. It must not simplify, summarize, omit, condense, reorder beyond what the chosen presentation requires, or replace the requested complete result with MVP, placeholder, sample, or test content.

The official Spanish source must remain traceable to the original archived PDF and should remain clearly distinguishable from Russian-language learning support where applicable.

## Scope

- Add a separate Russian-language site surface/block for the complete 4-wheel vehicle manual material.
- Include the full Russian translation of the source manual content.
- Preserve all images from the source manual using local/offline assets.
- Preserve source fidelity materially enough that images, icons, tables, typography-sensitive structure, and pagination-sensitive references are not lost.
- Keep the Spanish official source traceable/original.
- Update durable project documentation if implementation changes user-visible content structure, source-document handling, asset strategy, local runtime behavior, or learner/source-reader behavior.

## Out of Scope for This Intake

- Analyst does not choose the technical architecture.
- Analyst does not create implementation tasks.
- Analyst does not edit product code, tests, runtime files, docs, source content, generated assets, branches, commits, PRs, or GitHub state.
- Analyst does not inspect or translate the full PDF during intake.

## Acceptance Expectations

- A Russian-language learner can access the complete 4-wheel vehicle manual material through a distinct block/surface on the site.
- The experience is complete, not an MVP, sample, smoke-test, truncated build, or placeholder.
- Every source page/content unit from the 200-page official PDF is represented in the Russian surface.
- All source images are preserved and served locally/offline.
- Tables, icons, figure relationships, and layout-sensitive content are preserved or represented with equivalent fidelity sufficient for study and traceability.
- The Russian translation is full and exact, without simplification, summarization, omitted sections, or editorial replacement.
- The Spanish official source remains traceable to the archived original PDF.
- Existing translation chunks are reused only when they match the exact complete-source requirement; any gaps are completed rather than ignored.
- Verification evidence should demonstrate source coverage, translation coverage, image coverage, offline/local asset behavior, and site access to the new Russian surface.

## Assumptions

- The repository-owned archived PDF is the canonical source of truth because it is byte-identical to the user-provided PDF.
- Existing approved Russian translation chunks can be used as a starting point, but the implementation must validate them against the full source and preserve non-textual content separately.
- A separate Russian-language block/surface may be implemented as a new reader, section, route, document view, or other site-native experience, as long as it is clearly separate and complete.
- The translation is learning support derived from the official Spanish source unless the project has explicit evidence that an official Russian translation exists.
- Implementation should prefer deterministic, local, repository-managed assets and manifests over runtime network dependencies.

## Risks

- The current Markdown/text-chunk path is known not to preserve images, icons, tables, typography, or pagination, so a text-only implementation would fail the request.
- Full exact translation of a 200-page source creates high QA risk for omissions, mistranslations, and alignment drift.
- Image extraction and preservation may require a robust asset inventory to avoid missing small icons, repeated figures, diagrams, or table-like visual content.
- Maintaining traceability between Spanish source, Russian translation, pages, images, and current learner UI may require changes beyond the existing source reader.
- Official-source and unofficial-translation labeling must remain clear to avoid confusing translated learning support with the Spanish official source.

## Open Questions

- No blocking user clarification is required for intake; the request is explicit that the result must be complete and exact.
- Architect should decide how to preserve page/layout fidelity and image coverage while fitting the existing local-first site architecture.
- Architect should decide whether the separate Russian surface is best represented as page-faithful rendered manual pages, structured source-aligned content, or a hybrid, provided completeness and fidelity are verifiably satisfied.
