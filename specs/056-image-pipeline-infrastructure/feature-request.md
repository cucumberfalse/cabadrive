# Feature Request: Image Pipeline Infrastructure

## Analyst Artifact Status

Created by Orchestrator-assigned Analyst intake on 2026-10-12. This work cycle implements only stage 1 of `docs/improvements/priority/03-image-quality.md` (ТЗ-P3). No implementation or architecture artifacts were created during intake.

## Orchestrator Routing Context

- Orchestrator entry: the user explicitly appointed the parent agent Orchestrator and requested stage 1 through PR and merge. Orchestrator assigned this Analyst intake on 2026-10-12.
- Active-model stop condition: not applicable; Analyst acted only after explicit Orchestrator routing.
- Read-only transition context: the preceding request inspected fresh `main` and the next roadmap item. The current user message authorizes repository changes, PR publication, and merge.
- Assigned intake worktree: `/Users/kristina.kurashova/projects/caba-drive/cabadrive/.claude/worktrees/image-pipeline-infrastructure`.
- Assigned branch: `codex/056-image-pipeline-infrastructure`.
- Latest-main base evidence: Orchestrator ran `git fetch --all --prune` and verified the GitHub branch API before intake. Verified base is `dc4e61c89d6f7b7e051b06812ef3082bf71f778c`. Analyst confirmed local `main` and `origin/main` equal that SHA, then created the fresh worktree with `git worktree add -b codex/056-image-pipeline-infrastructure .claude/worktrees/image-pipeline-infrastructure dc4e61c89d6f7b7e051b06812ef3082bf71f778c`.
- Startup GitHub context: Orchestrator reported no open PRs for this repository at startup. This is a startup snapshot, not merge-time evidence; GitHub must be refreshed before later status or merge decisions.
- Feature numbering evidence: Analyst scanned numeric feature directories in the main checkout and all four registered sibling worktrees; the highest prefix was `055`, so this feature uses `056`. Existing duplicate `049` prefixes are preserved.
- Parallel-work note: parallel Orchestrators/agents may be active. Preserve all existing dirty diffs, branches, commits, PRs, process memory, `.claude/`, `.omc/`, and sibling worktrees. Main has existing untracked `.claude/` and `.omc/`; they were not edited or cleaned. Existing worktrees `finalize-pr-214`, `finalize-pr-215`, `finalize-pr-217`, and `open-pr-finalization` are excluded from this assignment.
- Accidental-start recovery context: none.
- Cleanup context: no cleanup is assigned during intake. This worktree remains active handoff context. Any later removal requires a separately assigned Cleanup Agent with positive-proof completion checks; names and paths alone are not deletion authority.

## User Request

> Назначаю тебя Orchestrator. Начинай ТЗ-P3 с первого этапа — инфраструктуры пайплайна изображений, доведи до PR и мержа.

## Clarified Answers And Assumptions

- No user clarification was requested. The user selected a concrete, bounded stage of an existing proposal and authorized PR/merge; repository evidence resolves the material ambiguity without adding product scope.
- Only the four stage-1 items are included: raster derivative generation/incrementality, master and derivative validation in `validate:content`, safe SVG optimization with sampled perceptual QA, and `assetSrcSet()` with unit verification.
- Stages 2–5 are outside scope: no photo AI upscale, PDF page rerender, crop regeneration, canonical image replacement, application image-component migration, layout redesign, or broad nginx/service-worker delivery migration.
- “Без визуальных изменений” means existing product image paths, canonical bytes, pins, and UI rendering remain unchanged. Orchestrator agreed that SVG optimization must execute against real existing SVG classes into source-preserving derived/audit outputs. It must not rewrite pinned originals or silently switch the UI to them.
- Actual checked-in SVG inventory is 1,386 files: 1,382 in `content/assets/learning/generated/v1/` and four manual SVGs under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/`. The proposal's class (e) SVG corpus under primary sources is absent. Report that absence explicitly; do not fabricate class coverage or substitute the four governed manual SVGs for class (e).
- No `content/assets-masters/` directory exists at startup. A truthful empty raster manifest is acceptable for this infrastructure stage; runnable real PNG fixtures must demonstrate complete generation, codecs, metrics, incremental behavior, and tamper rejection. An empty production corpus is not evidence that raster QA passed.
- The master contract applies to every future real input: only lossless `.png` with decoded PNG format and byte-detected MIME `image/png`. Existing JPEG assets remain source/archive assets, not masters. Renaming or transcoding existing JPEGs to claim lossless source quality is outside scope.
- Real DSSIM is required. Native tools are unavailable on the host at startup; Architect must specify reproducible native QA setup for local macOS, CI Node 20 on Ubuntu, and the Node 22 Alpine Docker build. Missing required tools for non-empty generation/validation must fail explicitly, not approximate DSSIM with classic JS SSIM or bypass QA.
- The `assetSrcSet(sourcePath)` helper is introduced beside the current asset boundary or re-exported there, reads a bundled manifest, returns the documented typed shape or `null`, and is not wired into current product image markup. Architect decides the format-specific representation without claiming completion of later `<picture>` delivery.
- Full-production targets such as all ticket photos reaching 1,200 px, manual pages reaching 300 DPI, all UI images using responsive markup, and first-view traffic savings belong to later stages. Stage 1 must make their future enforcement possible without asserting those targets are already met.

## Project Context Reviewed

- `AGENTS.md` and `.specify/memory/constitution.md`: role boundaries, isolated latest-main startup, one slice/PR, preserved sibling work, ordered final validation, conservative merge and cleanup.
- Mandatory read-order context: `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, and `docs/specify/README.md`.
- `.specify/templates/feature-request-template.md`: Analyst intake template.
- `docs/improvements/priority/03-image-quality.md`: stage 1, §§6.4–6.7, lossless guard, like-sized metric contract, stage separation, and acceptance/testing expectations.
- `docs_project/project/devops/ai-pr-workflow.md`: current-head review/check gates, single-PR handoff, ordered Architect/Analyst final validation, evidence-only commit guard, and squash finalization.
- `docs_project/project/content-sources.md` and `content/official-documents/AGENTS.md`: source truth, local images, reviewed pins, provenance, and protected official archive.
- `scripts/content-shards.mjs`: existing exported `canonicalJson` helper; avoid another duplicate serializer.
- `scripts/content-learning-images.mjs`: generated SVG SHA-256 pins and explicit width/height validation; blind in-place SVGO or `removeDimensions` would violate current governance.
- `scripts/manual-guide-source-fidelity.mjs`, `scripts/manual-sign-inventory.mjs`, and `scripts/content-manual-ticket-placement.mjs`: governed source hashes and reviewed/protected manual boundaries.
- `src/data/content.ts`, `scripts/sync-public-assets.mjs`, `package.json`, `Dockerfile`, `.github/workflows/ci.yml`, and `.gitignore`: current asset helper, source-copy build, validation chain, Docker-only runtime and current verification environments.

## External Research

Context7 was used for public-safe current primary documentation, without sending repository content or secrets:

- [Sharp resize API](https://github.com/lovell/sharp/blob/main/docs/src/content/docs/api-resize.md): `lanczos3`, `withoutEnlargement`, width/height and fit behavior for like-sized reference creation.
- [Sharp output API](https://github.com/lovell/sharp/blob/main/docs/src/content/docs/api-output.md): JPEG/mozjpeg, progressive rendering and chroma subsampling options; output encoders must be pinned and verified.
- [SVGO configuration](https://github.com/svg/svgo/blob/main/README.md): `optimize`, multipass and preset overrides for safe source-preserving optimization.
- [SVGO v3-to-v4 migration](https://github.com/svg/svgo/blob/main/docs/06-migrations/01-migration-from-v3-to-v4.mdx): `removeViewBox` and `removeTitle` are no longer in the default preset; preserve intent without assuming stale preset membership.

Architect/Implementation Agent must continue Context7 verification for version-sensitive APIs and native-tool setup as needed.

## Problem Statement

Current assets are copied directly into the build. The repository lacks an executable raster master contract, deterministic modern-format derivative inventory, incremental image generation, perceptual regression gate, safe SVG optimization boundary, and a reusable manifest-backed responsive asset helper. Later quality stages would otherwise introduce large image changes without a trustworthy repeatable pipeline or protections against lossy masters, stale hashes, and concealed quality degradation.

## Proposed Outcome Or Workflow

1. A single executable image-build entry point accepts verified PNG masters, writes deterministic AVIF/WebP/JPEG variants with content-hashed names and canonical manifest records, and safely reuses unchanged verified outputs.
2. An offline validator verifies real master bytes, manifest inventory, output hashes/formats/sizes/dimensions, complete variants, and actual like-sized perceptual quality. It participates in `validate:content` and can refresh derived evidence without changing approvals or canonical source records.
3. Safe SVGO tooling executes over the available class-(d) corpus into derived/audit outputs; same-renderer before/after rasterization and a 30-file DSSIM sample demonstrate no visual degradation. Absent class-(e) coverage is reported accurately.
4. The responsive helper assembles deterministic local source sets and JPEG fallback/dimensions from the manifest; focused tests cover represented, missing, and invalid cases while current application markup remains unchanged.
5. Implementation and durable documentation land through one ready-for-review PR, followed by current-head checks/review, final Architect validation, final Analyst validation, and Orchestrator merge after every required gate passes.

## Role Boundaries Or Affected Actors

- Analyst: this intake artifact and later Analyst-owned final validation only when explicitly invoked by Orchestrator after Architect passes.
- Architect: technical contracts, staged acceptance scope, native dependency strategy, test evidence, task decomposition, and any implementation feedback disposition in Architect-owned memory.
- Implementation Agent: assigned isolated branch, code/tooling/tests/docs, process evidence and ready PR; no merge authority.
- Review Agent: current PR review and contract findings without implementation changes.
- Orchestrator: coordination, GitHub freshness, gate enforcement, cycle PR inventory, ordered role validation, and authorized squash merge; no repository-file edits.
- Cleanup Agent: only separately assigned inactive completed local-environment cleanup, with ownership/cleanliness/upstream/PR/process-memory proof and conservative refusals; no product/process edits or GitHub mutations.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` during intake and hands off, then stops until explicitly invoked for final Analyst validation or new intake.
- Requirement clarification, if it becomes necessary during intake, is relayed through Orchestrator; later roles use these assumptions or route feedback to Architect.
- Architect creates `spec.md`, `plan.md`, and `tasks.md` before implementation.
- Handoff feature: `specs/056-image-pipeline-infrastructure`, branch `codex/056-image-pipeline-infrastructure`, worktree `/Users/kristina.kurashova/projects/caba-drive/cabadrive/.claude/worktrees/image-pipeline-infrastructure`.
- The Analyst-created latest-main context is intended as this single implementation PR slice only after Orchestrator explicitly assigns it. Additional independent slices require fresh latest-main environments and separate PRs; stages 2–5 are not included here.
- PR publication is ready for review by default. End its description with `Co-authored-by: Codex <codex@openai.com>`. End Codex-assisted commit messages with a blank line then `Co-authored-by: OpenAI Codex <codex@openai.com>`.
- Track cycle PR purpose, branch, URL/number, current/effective content head and status in role-owned process memory. Final Architect validation must precede final Analyst validation, using parseable ISO timestamps and the same full effective content SHA. Later non-evidence changes invalidate validation.
- User has authorized merge. Orchestrator must still verify current GitHub head, required checks, review resolution, conflicts, acceptance evidence, feedback dispositions and read-only final guards. No direct `main` push or branch-protection bypass.
- Cleanup is not currently assigned; preserve this active handoff context and all sibling environments.

## Open Questions And Risks

- No blocking user requirement questions remain. Architect must explicitly dispose the source-preserving SVG interpretation and the absent class-(e) corpus before implementation; these are evidence-backed scope assumptions, not a request to rewrite governed assets.
- The proposal's SVG `removeDimensions` setting conflicts with learning-image validation and may alter intrinsic sizing if current runtime SVGs were replaced. Derived outputs can be tested independently, and governed originals/pins must remain byte-identical.
- Native QA setup is an implementation concern with evidence required on macOS/Linux/Alpine. DSSIM and SSIMULACRA2 are not installed on the host at startup; Docker is available through escalated execution. Orchestrator reports Node 25.2.1/pnpm 10.33.0 locally, CI Node 20, Docker Node 22 Alpine, and an existing seven-day pnpm release-age policy. Dependency selection must respect these contexts.
- SHA equality alone does not establish safe incremental reuse after encoder/profile/configuration changes or derivative tampering. Reuse must remain bound to actual required output inventory and current pipeline policy.
- Metric records must not become self-attested pass evidence. Actual recomputation/fixture execution must prove like-sized pairs, threshold behavior and rejected tampering.
- Full-corpus performance and size targets cannot be claimed for nonexistent PNG masters. Record fixture/runtime evidence and any present-stage limits honestly.
- Changes must preserve offline build/runtime behavior, masters excluded from public output, atomic retained static release guarantees, existing manual/question provenance, and source archive bytes.

## Acceptance Expectations

- Real PNG fixtures exercise configured widths `[480, 800, 1200, 1600, 2400]` subject to no enlargement, all three codecs, separate text/photo profiles, content hashes, deterministic manifest serialization, and verified incremental reuse. A repeated identical run changes no derivative or manifest bytes; missing/corrupt/stale outputs cannot silently pass as cached results.
- Master negative cases include case-insensitive `.jpg`/`.jpeg`, JPEG bytes named `.png`, non-PNG decoded formats/MIME, corrupt inputs and mismatches. Current JPEG-only Swift output is rejected; no Swift/PDF regeneration is introduced.
- Derivative QA derives a reference from the master at the candidate's actual width/height using the same explicit `lanczos3`; candidate is not resized for comparison. Candidate larger than master, dimension mismatch, bad hash/path/format, missing variants, stale records and poor quality fail. Real DSSIM must be `<= 0.01`; the proposed single quality `+5` retry and sampled SSIMULACRA2 `>= 70` policy require explicit Architect disposition and runnable evidence.
- All available class-(d) SVGs are actually processed into source-preserving derived/audit outputs with safe configuration. A deterministic representative 30-file sample is rendered before/after by the same renderer at identical fixed dimensions and meets DSSIM `<= 0.001`. Canonical source bytes, manifest pins, UI references and product visuals remain unchanged; absent class-(e) is explicit.
- `assetSrcSet()` has a typed deterministic manifest boundary, only local paths, usable fallback and dimensions, and focused positive/negative tests. No current `<img>`/`<picture>` product migration occurs in this stage.
- `validate:content`, meaningful tests, full repository preflight, required GitHub checks and Docker-only runtime verification pass on the delivered slice. Real generation/QA evidence includes Linux viability and does not substitute mocks for all metric checks.
- Durable documentation describes commands, manifest/master contracts, native tooling, profile/metric policy, ignored/derived output placement, how to reproduce evidence and later-stage boundaries.
- Startup base/worktree evidence, unchanged protected-source evidence, ready PR attribution, current-head review/check evidence, ordered final validation, merge proof and cleanup not-applicable/refusal record are retained through handoff.

## Final Analyst Validation Notes

Append-only Analyst-owned section, used only when Orchestrator invokes final Analyst validation after final Architect validation passes.

- Analyst validation pass: not yet invoked.
- Analyst return count for this work cycle: 0.
- Customer intent check: pending final invocation against the delivered effective content head.
- Gaps, if any: none recorded during intake.
- Architect disposition routing: Orchestrator must route any later Analyst feedback to Architect for accept/task/ticket/dispose before follow-up development.
- Analyst limit escalation: after five returns, any additional gap requires a new feature request in a separate latest-main worktree through Orchestrator.
- Analyst boundary reminder: no Architect artifacts, code, tests, reviews, commits, pushes, PRs or merge actions were created during intake.
