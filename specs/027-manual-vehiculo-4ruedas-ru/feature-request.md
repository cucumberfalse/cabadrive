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

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-26T22:57:08Z
- Effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f
- Analyst validated effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f
- Analyst return count: 0
- Analyst validation evidence: Original request asked for the complete official 4-wheel manual material on the site in Russian as a separate block, with a full exact translation, no simplification, no omissions, no MVP/test substitute, and all images preserved; the recorded implementation scope directly matches that requested outcome.
- Analyst validation evidence: Architect final validation already passed after implementation and review fixes, with `Final Architect validation completed at: 2026-05-26T22:54:19Z` and `Architect validated effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f`, which matches this Analyst validation head.
- Analyst validation evidence: Orchestrator evidence reports PR #170 at effective head `19f8bf803126ade66e639da47666d4ff47a8bf7f` is mergeable with required checks passed: `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan`; feature memory also records passing preflight, build, content validation, Node tests, and Playwright e2e coverage.
- Analyst validation evidence: Complete 200-page coverage is verified by the canonical official PDF page count and by `pnpm run validate:manual-4ruedas`, which passed with `200/200 pages`.
- Analyst validation evidence: Visual preservation is verified through 200 local page-faithful JPEG assets generated from the canonical PDF and referenced by the manual manifest; read-only spot check counted 200 `page-*.jpg` assets and the manual validator confirmed `200 local page assets`.
- Analyst validation evidence: RU translation coverage is verified by the manifest and validator evidence showing `198 approved reused translations` plus `2 visual-label translation pages`, with zero omitted pages and reuse limited to approved exact-coverage source chunks.
- Analyst validation evidence: The completed learner experience is a dedicated Russian `Руководство 4R` surface, separate from the existing `Источники` reader, with ordered page navigation, search, local page images, exact Russian page content, and representative first/middle/last page e2e coverage.
- Analyst validation evidence: Spanish official source traceability is preserved through the manifest source metadata, per-page `sourceTrace` records, canonical PDF SHA-256/path evidence, and UI source/provenance display recorded in e2e verification.
- Analyst validation evidence: No runtime PDF/network/backend dependency is supported by implementation evidence and tests blocking iframe/embed/object PDF viewers, PDF.js-style runtime rendering, `.pdf` manual links/requests, remote manual assets, external requests, and backend/live-AI requests for this manual surface.
- Customer intent check: passed because the delivered evidence supports a complete, separate, Russian-language manual study surface that preserves the full 200-page official manual visually and textually instead of substituting a summary, sample, MVP, or text-only source reader.
- Gaps, if any: none.
- Architect disposition routing: no Analyst gaps require Architect disposition.
- Analyst limit escalation: none.
- Analyst boundary reminder: Analyst final validation only; code, runtime files, durable docs, Architect-owned artifacts, tasks, staging, commits, pushes, PR review, and merge state were not changed.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-27T00:30:26Z
- Effective content head: 330898c36037a14508acdc91381deb3652c0a166
- Analyst validated effective content head: 330898c36037a14508acdc91381deb3652c0a166
- Analyst return count: 0
- Analyst validation evidence: Original request asked to integrate `/Users/chap/Downloads/MANUAL_Vehiculo_4Ruedas_2023 SA.pdf` into the site as a separate Russian-language block, with a full exact translation, no simplification, no deletion, no MVP/test substitute, complete implementation, and all images preserved; the recorded final scope matches that customer intent.
- Analyst validation evidence: Architect final validation passed first at `2026-05-27T00:28:04Z` for the same effective content head `330898c36037a14508acdc91381deb3652c0a166`.
- Analyst validation evidence: The final learner surface is a distinct `Руководство 4R` block, separate from the source reader, with ordered navigation, search, source/provenance display, local page imagery, and exact Russian manual content for study.
- Analyst validation evidence: Complete source coverage is represented by all 200 pages from the byte-identical canonical official PDF, with validator and feature-memory evidence recording `200/200 pages` and no omitted source page.
- Analyst validation evidence: Complete exact Russian content is represented by the manual manifest using 198 approved reused Russian translation chunks plus 2 visual-label translation pages, with acceptance evidence stating no simplification, summary replacement, removal, or placeholder/MVP substitution.
- Analyst validation evidence: Image preservation is represented by 200 local page-faithful JPEG assets generated from the canonical PDF and tied to the manual manifest, preserving visual layout, figures, icons, tables, and page relationships for every page.
- Analyst validation evidence: Local-only behavior is preserved by repository-managed manual data and assets, no runtime PDF iframe/embed/object viewer, no PDF.js-style runtime PDF rendering, no manual `.pdf` network request, no remote manual asset dependency, no backend dependency, and no live-AI dependency for the manual surface.
- Analyst validation evidence: PR #170 evidence reports required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` completed successfully on `330898c36037a14508acdc91381deb3652c0a166`, all review threads resolved, current-head AI Review passed, and the local feature-memory guard passed.
- Customer intent check: passed; the final result satisfies the user's Russian-language request in spirit and letter by delivering the complete official 4-wheel manual as a separate Russian site surface with all 200 pages, exact translated content, preserved images, and no truncated, simplified, test, or MVP substitute.
- Gaps, if any: none.
- Architect disposition routing: no Analyst gaps require Architect disposition.
- Analyst limit escalation: none.
- Analyst boundary reminder: Analyst final validation only; code/runtime/docs/tasks/staging/commits/pushes/PR review/merge state were not changed.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-27T01:44:50Z
- Effective content head: 323158d1a202a20b9c74dbdc1374cd3bd87cf587
- Analyst validated effective content head: 323158d1a202a20b9c74dbdc1374cd3bd87cf587
- Analyst return count: 0
- Analyst validation evidence: Original request asked to integrate `/Users/chap/Downloads/MANUAL_Vehiculo_4Ruedas_2023 SA.pdf` into the site as a separate Russian-language block with full exact translation, no simplification, no deletion, no MVP/test substitute, complete implementation, and all images preserved; the recorded final scope matches that request.
- Analyst validation evidence: Architect final validation passed first at `2026-05-27T01:43:05Z` for the same effective content head `323158d1a202a20b9c74dbdc1374cd3bd87cf587`.
- Analyst validation evidence: The implementation provides a dedicated Russian `Руководство 4R` surface, separate from the existing source reader, with ordered navigation, search, source/provenance display, local page imagery, and exact Russian manual content for learner study.
- Analyst validation evidence: Complete source coverage is represented by all 200 pages from the byte-identical canonical official PDF, with validator and feature-memory evidence recording `200/200 pages` and no omitted source page.
- Analyst validation evidence: Complete exact Russian content is represented by page-aligned manual data using 198 validated reused approved Russian translation pages plus 2 translated visual-label pages, with evidence recording no simplification, summary replacement, removal, placeholder, sample, test build, or MVP substitution.
- Analyst validation evidence: Image preservation is represented by 200 local page-faithful JPEG assets generated from the canonical PDF and tied to the manual manifest, preserving visual layout, figures, icons, tables, labels, and page relationships for every page.
- Analyst validation evidence: Local/static behavior is preserved by repository-managed manual data and assets, deferred service-worker install-time precache for the heavy manual chunk and page images, and on-demand runtime caching after the manual surface opens.
- Analyst validation evidence: The final manual surface has no runtime PDF iframe/embed/object viewer, no PDF.js-style runtime PDF rendering, no manual `.pdf` network request, no remote manual asset dependency, no backend dependency, and no live-AI dependency.
- Analyst validation evidence: Current review and check disposition evidence reports substantive review findings fixed or disposed, AI Review final-validation request addressed by Architect and Analyst validation, required checks/local evidence green on `323158d1a202a20b9c74dbdc1374cd3bd87cf587`, and feature-memory guard passing.
- Customer intent check: passed; the final result satisfies the user's Russian-language request in spirit and letter by delivering the complete official 4-wheel manual as a separate Russian site surface with all 200 pages, exact translated content, preserved images, and no truncated, simplified, test, or MVP substitute.
- Gaps, if any: none.
- Architect disposition routing: no Analyst gaps require Architect disposition.
- Analyst limit escalation: none.
- Analyst boundary reminder: Analyst final validation only; code/runtime/docs/tasks/staging/commits/pushes/PR review/merge state were not changed.
