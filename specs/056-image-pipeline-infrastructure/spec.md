# Spec: Image Pipeline Infrastructure

## Analyst Intake

- Source request: `feature-request.md`; user selected ТЗ-P3 stage 1 and authorized a ready PR and merge.
- Carried assumptions: no current PNG master corpus; existing images, source bytes, pins and UI remain unchanged; optimize all available learning SVGs into derived/audit outputs; proposal class (e) is absent; stages 2–5 remain separate work.
- Orchestrator routing context: explicitly assigned Architect after Analyst handoff; the Analyst-created environment is assigned as this cycle's single implementation PR slice.
- Active-model stop condition: Architect writes only this spec, `plan.md`, and `tasks.md`. Implementation starts only after an Orchestrator assignment and all four feature artifacts exist. Accidental unassigned edits require stop/report/preserve/disposition.
- Read-only transition: the earlier main/roadmap inspection became repository-changing at the user's explicit Orchestrator appointment and stage-1 instruction.
- Parallel-work constraints: preserve all sibling diffs, branches, commits, PRs, process memory and worktrees, including the four startup sibling worktrees recorded in intake. Do not clean `.claude/` or `.omc/`.
- Startup base evidence: Analyst/Orchestrator verified `main == origin/main == dc4e61c89d6f7b7e051b06812ef3082bf71f778c` after fetch and GitHub inspection. Assigned branch: `codex/056-image-pipeline-infrastructure`; assigned worktree: `.claude/worktrees/image-pipeline-infrastructure`.
- Cleanup applicability: no local-environment cleanup is assigned; this is an active handoff worktree. A later completed-worktree cleanup needs a separately assigned Cleanup Agent and positive proof.

## Cycle Definition

- Work cycle: this user request, represented by `specs/056-image-pipeline-infrastructure`, from latest-main intake through implementation, one ready PR, review/fixes, ordered final validation and Orchestrator merge.
- Cycle PR set expectations: `tasks.md` records purpose, branch, URL/number, current head, effective content head, state, and final-validation inclusion for the single slice. Publication/check/review/merge facts are verified against GitHub, not inferred from local branches.
- Latest-main startup rule: the explicit Analyst handoff exception applies to this slice only. Independent added slices require a new verified latest-main base and isolated environment; fetch failure is a documented blocker/fallback. Advancing main does not authorize discarding sibling work.

## Goal

Provide a reproducible, fail-closed image pipeline and typed responsive-asset boundary so later image-quality stages can generate and validate modern derivatives without changing today's product visuals or source truth.

## Scope

In scope:

- PNG master inventory/registry, real extension/decoded-format/byte-MIME guards and deterministic AVIF/WebP/JPEG generation.
- Canonical derivative manifest, content-hashed output paths, strict incremental reuse, real like-sized DSSIM and sampled SSIMULACRA2 gates.
- Source-preserving full class-(d) SVGO processing, deterministic 30-file real raster/DSSIM sample, small committed audit manifest, reproducible ignored optimized outputs and explicit absent-class-(e) evidence.
- `assetSrcSet(sourcePath)` with a pure typed manifest boundary, local source sets, usable JPEG fallback, dimensions, null handling and focused tests; re-export beside `assetUrl`.
- Required build/validation/native-tool setup, CI/Docker integration, output-copy boundary, meaningful fixtures and durable image-pipeline documentation.

Out of scope:

- AI photo upscale, PDF/Swift/page/crop regeneration, importing existing JPEGs as masters, canonical asset replacement, pin/evidence rewrites for governed images, or UI `<picture>`/srcset activation.
- New nginx/SW image delivery policy, `/content/img/` immutable promises, retina/traffic/product size targets, and stages 2–5 completion claims.
- A generic image framework, runtime backend, Vite image plugin, platform-wide host installation, source archiving/LFS changes, sibling cleanup or unrelated workflow repairs.

## User Stories

### User Story 1

As a content maintainer, I want one deterministic image command with independently recomputed quality validation, so that changing image codecs or sources cannot conceal degraded, stale or corrupted assets.

### User Story 2

As a later frontend implementer, I want typed local format-specific source sets with a safe fallback, so that responsive delivery can be introduced in its own reviewed stage.

## Acceptance Criteria

1. **AC-001 — PNG master contract.** All files found beneath the configured master root are registered lossless `.png` files whose byte-detected MIME is `image/png`, decoded format is PNG, and complete pixel decode succeeds. `.jpg`/`.jpeg` in any case, JPEG bytes named `.png`, other formats, corrupt/truncated/multiframe inputs, duplicates, path escapes and symlinks fail before output publication. Current Swift JPEG output fails; no Swift change is made.
2. **AC-002 — actual codec generation.** Real deterministic PNG fixtures exercise photo and text profiles, all configured widths `[480, 800, 1200, 1600, 2400]` without enlargement, all three codecs, actual decoded dimensions, full output hashes and hash-suffixed paths. A smaller master has at least one usable natural-width variant. Explicit per-source target width is enforced when supplied. Production raster records remain empty and report `no-masters`, not a raster-quality pass.
3. **AC-003 — integrity and idempotency.** Repeating generation on unchanged inputs/policy/tool versions changes no derivative or manifest bytes. Reuse requires the current generation identity, complete expected format/width inventory, source and derivative hashes, byte sizes, decoded format/MIME/dimensions and current real quality gates. Missing/corrupt/stale/tampered data cannot count as a hit; changed policy invalidates reuse. Hash-name collisions and unknown owned-path collisions fail safely.
4. **AC-004 — real like-sized quality.** Each candidate stays at its actual dimensions. Reference is derived from the master at exactly those dimensions with `fit: fill`, `withoutEnlargement: true`, explicit `lanczos3`, and the same fixed sRGB/alpha normalization. Candidate larger than master, mismatched reference dimensions, nonfinite metric output or absent required native tooling fail. Every variant has recomputed real DSSIM `<= 0.01`; a deterministic 5% sample (at least one when nonempty) has real SSIMULACRA2 `>= 70`. One deterministic codec quality `+5` retry is allowed; a second failure aborts publication.
5. **AC-005 — source-preserving SVG execution.** All 1,382 available class-(d) learning SVGs are optimized into derived/audit output with a safe pinned configuration. Audit records original/optimized hashes and sizes and a deterministic representative sample of 30 files; original and optimized SVGs in each sample pair are rendered by the same pinned renderer at identical fixed dimensions and have recomputed real DSSIM `<= 0.001`. Original width/height/viewBox and referenced IDs survive. All canonical SVG/raster bytes, question/manual/learning pins and UI references remain byte-identical. The absent class-(e) corpus is explicitly `absent`; the four governed manual SVGs are protected and are not relabeled as class (e).
6. **AC-006 — responsive helper.** The helper returns deterministic separate AVIF/WebP/JPEG source sets, JPEG fallback and positive integer fallback dimensions for a represented valid local source. Missing, malformed, duplicate or unsafe records return `null`. No current UI image component invokes it. Focused tests execute the pure TypeScript boundary with real fixture manifests.
7. **AC-007 — runnable integration.** `validate:content` recomputes current image quality without trusting stored scores; `--write` can refresh derived evidence only after successful validation and cannot launder corrupt outputs or approvals. Generation has an explicit rebuild command, generated raster files survive normal asset sync into `/content/img/`, masters/SVG audit outputs never enter public/dist, and normal Linux CI and Node 22 Alpine Docker build have real pinned native tools. Full preflight, Docker runtime smoke/offline/retained-asset checks and required current-head GitHub checks pass.
8. **AC-008 — evidence and delivery.** Durable docs explain the registry, manifest, profiles, native setup/licenses, commands, regeneration and stage boundaries. Feature memory contains scoped-change/source-preservation proof, real fixtures/SVG/tool-platform evidence, all feedback dispositions and the complete cycle PR set. Final Architect validation precedes final Analyst validation for one effective content SHA; current-head guards, review, checks and merge proof are recorded. No cleanup occurs while this environment is active.

## Negative Scenarios

1. Renamed JPEG, corrupt PNG, unregistered master, duplicate logical source, traversal or symlink input fails without changing canonical assets or the previously valid manifest.
2. A candidate substituted under its old URL, forged passing QA score, stale profile hash, missing format, extra width or size/dimension mismatch fails validation; `--write` does not update its hashes to make it pass.
3. A deliberately poor same-sized real candidate fails the native metric gate; dimension mismatch or a larger candidate is rejected before metric comparison. Missing/incorrect/nonfinite tool output never becomes a pass.
4. SVGO output that drops intrinsic dimensions, viewBox, referenced IDs or changes a sampled visual beyond the threshold fails. Canonical sources are never overwritten to fix it.
5. Malformed manifest paths, remote URLs, duplicate widths, unbalanced format sets or invalid fallback dimensions produce `null` at the helper boundary.
6. Name patterns/timestamps/paths alone never authorize local-worktree deletion; active, dirty, unpushed, open-PR, ambiguous and user-owned sibling environments remain preserved.

## Requirements

- FR-001: Generation and validation share one explicit policy and existing `canonicalJson` from `scripts/content-shards.mjs`; do not duplicate canonical serialization or image preparation semantics.
- FR-002: Raster registry distinguishes logical original `sourcePath` from `masterPath`, class, profile and optional per-source target. Master/registry/manifest inventories are exact and sorted; no directory-based profile guess or lossy-master promotion.
- FR-003: Content hashes include every codec's actual bytes; generation identity binds policy/configuration and installed encoder/renderer/native-tool versions, not only mtime or source SHA.
- FR-004: Every validation run recomputes required metrics from current real bytes. Stored scores are audit data, not an authority or a cache bypass.
- FR-005: The stage-1 empty production raster bootstrap is truthful; real fixtures and class-(d) processing supply nonvacuous evidence.
- FR-006: Source-preserving SVG interpretation and exact quality/SSIM sample policy are explicitly disposed in `plan.md`; no silent removal of requirements.
- FR-007: Tool installation is explicit, pinned and project-local for maintainers; no implicit network access in `validate:content` or runtime. Native binaries exist only in build/CI tooling and are excluded from the nginx/stager runtime payload.
- FR-008: Output mutation is limited to pipeline-owned derived files/manifest/evidence. Avoid broad deletes; publish the manifest last, preserve prior valid output on failure and refuse unknown/symlink/collision targets.
- FR-009: Preserve Orchestrator routing, complete feature memory, role boundaries, sibling work, ready PR publication and commit/PR co-author trailers.
- FR-010: Cycle PR-set tracking and final Architect-before-Analyst validation are mandatory; feedback receives Architect task/ticket/not-needed disposition before completion.
- FR-011: Effective-head evidence records `Effective content head: <40-hex-sha>`, `Architect validated effective content head: <40-hex-sha>`, and `Analyst validated effective content head: <40-hex-sha>` for the same SHA. Non-evidence changes invalidate earlier validation.
- FR-012: Architect return limit is 10; Analyst return limit is 5. Exceeding a limit requires a new feature request through Orchestrator/Analyst, never a fake pass.
- FR-013: Both native metric sources use reviewed exact dependency locks and source/lock/features/binary identity receipts, verified before any execution. An explicit build-only network security audit in CI checks the full locked graphs and the five expiring D-008 maintenance notices; unknown findings, advisory classification/alias drift, incomplete results and network failures fail. This separate audit does not add network access to image/content validation or change the required OSV workflow.

## Success Criteria

- SC-001: One documented image-build command plus one offline validation command produces/verifies the complete supported inventory with real codecs/metrics.
- SC-002: All stage-1 acceptance evidence is recorded without claiming later-stage resolution, traffic savings or UI migration.
- SC-003: One ready PR reaches verified merge after current-head gates and ordered role validation; startup/cleanup evidence remains explicit.

## Assumptions

- Stage 1 commits an empty raster source registry/manifest; real PNG test fixtures are generated under an isolated temporary fixture root and do not become production masters.
- Exact tool/dependency pins in `plan.md` are the implementation baseline. If installation/platform/OSV evidence contradicts them, Implementation Agent records feedback and stops the affected choice for Architect disposition, while independent scoped work continues.
- Per-platform real rendering may differ numerically; audit policy/generation identity includes actual renderer/tool versions, and validation always tests the threshold instead of comparing self-reported decimal scores.

## Review And Verification Requirements

- Implementation requirements: assigned single branch/worktree only; complete feature memory before edits; baseline status/preservation evidence; tests first for new image integrity/metric/helper boundaries.
- Review requirements: verify native metrics are actually invoked, candidate is never rescaled for QA, policies and expected inventories are current, tamper/write/cache paths fail closed, safe SVGO preserves governed bytes, outputs are reproducible across copy boundaries, and no later-stage UI claims or feature-memory bypasses exist.
- Test/verification requirements: use real positive and deliberately degraded fixtures, cache/policy/tamper/missing-tool negatives, full class-(d) run and 30-file sample, source-byte diff guards, Node 20 Linux CI and Node 22 Alpine Docker evidence, full preflight and repository required checks.
- Handoff/blocker requirements: use recorded assumptions; normal-flow requirement clarification is complete. Route infeasible native tooling, dependency risks or scope divergence through Orchestrator to Architect; do not replace DSSIM with classic JS SSIM or silently waive gates.
- Final validation requirements: Architect validates the complete cycle PR set, architecture, assigned tasks/dispositions, open state, evidence and customer intent in spirit, then records an ISO timestamp and full effective SHA. Analyst validates intent in spirit/letter afterward. Orchestrator rechecks GitHub/current-head merge readiness; later evidence-only commits must pass the existing read-only guard.
