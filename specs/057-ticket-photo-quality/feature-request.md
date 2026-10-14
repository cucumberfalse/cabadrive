# Feature Request: Ticket photo quality (ТЗ-P3 stage 2)

## Analyst Artifact Status

Created by Orchestrator-assigned Analyst intake. This artifact records requirements and evidence; no implementation or architecture work has begun.

## Orchestrator Routing Context

- Original request: «Подтяни свежий main https://github.com/cucumberfalse/cabadrive как оркестратор выполняй следующий этап»; follow-up: «выполняй до мержа».
- Orchestrator explicitly assigned Analyst intake on 2026-10-13, including an isolated latest-main worktree and the next bounded roadmap stage. No active-model bypass or accidental-start recovery occurred.
- Read-only transition: not applicable; this was a repository-changing request from the outset.
- Verified base: `main` and `origin/main` both equal `3beb624c0c7c615ab7159fdd3227f74f790df29f`. Orchestrator reports successful `git fetch --all --prune`, GitHub PR #218 merged at `2026-10-13T05:26:16Z`, no open PRs, and successful main CI/OSV checks. Analyst independently confirmed both local refs and the base worktree HEAD.
- Intake branch: `codex/057-ticket-photo-quality`; worktree: `/Users/kristina.kurashova/projects/caba-drive/cabadrive/.claude/worktrees/ticket-photo-quality`. Created explicitly with `git worktree add` at the verified full base SHA. Before creation, the maximum numeric feature prefix across all six registered worktrees was 056; branch/path 057 were unoccupied.
- Parallel Orchestrators/agents may exist. Preserve every sibling environment, dirty diff, branch, commit, PR, and process record. Main has pre-existing untracked `.claude/` and `.omc/`; they are not this feature's cleanup scope.
- Cleanup is not assigned. This is an active handoff worktree; do not remove it or prune shared Docker/image/native caches.

## Clarified Answers And Assumptions

- “Next stage” means stage 2 of `docs/improvements/priority/03-image-quality.md`, following the merged feature 056 infrastructure: improve the existing class-(c) ticket images and activate their responsive delivery. The explicit stage ordering and Orchestrator assignment make intake clear enough without a new user question.
- User authorizes continuation through merge. Authorization does not waive content fidelity, checks, review, ordered final role validation, or current-head guards. Publish one ready-for-review PR unless work is knowingly incomplete and its blocker is explained.
- Preserve the 460-question fallback bank, all 275 canonical JPG originals, their current paths/source attribution, and the meaning of all 276 image-backed question references. No source-bank substitution, image synthesis, question/answer edits, manual-page/crop regeneration, or generalized UI redesign is requested.
- The roadmap's “refresh question-image SHA-256 pins” must not mean falsely rebinding unchanged canonical JPG paths to enhanced PNG bytes. Architect must reconcile canonical-original pins and separately tracked master/derivative provenance; any actual reviewed path/byte change requires corresponding honest pin/evidence updates.
- PNG is a lossless processing output, not a claim that AI recovers factual detail missing from a JPEG. Only individually visually rejected AI results may use the specified bicubic original-image fallback, with explicit `rejected` status and retained evidence. Applying fallback to the entire corpus without the actual model comparison/batch does not complete stage 2.
- Broader stages 3–5 remain separate. Stage 2 includes delivery/offline/cache adjustments genuinely required for its new ticket paths; it does not migrate all other raster classes or claim overall manual/traffic goals.

## Project Context Reviewed

- `AGENTS.md`, `.specify/memory/constitution.md`, and `.specify/templates/feature-request-template.md`: role ownership, feature numbering, isolated startup, complete planning prerequisites, final-validation/merge boundaries.
- Mandatory onboarding: `docs_project/README.md`, `docs_project/project-idea.md`, frontend/backend docs, feature inventory, learning/exam flows, and `docs/specify/README.md`.
- `docs/improvements/priority/03-image-quality.md` §§6.3–6.7, stage 2, acceptance/testing/risk sections; feature 056 intake and `docs_project/project/image-pipeline.md`.
- `content/official-documents/AGENTS.md`, canonical question-image manifest, `scripts/content-image-metadata.mjs`, current `QuestionImageFigure`, raster source/manifest pipeline, CI, `.gitignore`, and `.dockerignore`.
- Independently counted 275 canonical JPG files, 275 manifest image records and 276 usage records. All current canonical JPG hashes match their metadata pins. Production PNG registry is currently empty.

## External Research

No external research was needed to determine the stage boundary: the repository contains the concrete accepted roadmap and delivered infrastructure contract. Current binary/model release identity, model licensing, platform compatibility, and version-sensitive API usage remain evidence requirements for Architect/Implementation Agent; use primary documentation and Context7 where applicable before provisioning or code generation. Historical roadmap installation examples are not current verified setup instructions.

## Problem Statement And Desired Outcome

Ticket images are typically about 574 pixels wide while the question container reaches 620 CSS pixels. Their detail degrades on high-DPR displays, and current `QuestionImageFigure` delivers the original path without responsive codecs or intrinsic dimensions. The desired stage delivers visibly better, source-faithful ticket images using the merged reproducible image pipeline, with explicit reviewed processing provenance and dependable local/offline rendering.

## Available Tools And Intake Constraints

- `realesrgan-ncnn-vulkan`, `upscayl-bin`, and `upscayl` are absent on PATH. Conventional `~/tools/realesrgan` and `/Applications/Upscayl.app` were not found. No AI model bundle was identified in the repository's `.tools`; this is a bounded location check, not a claim that no model exists anywhere on the machine.
- Node, pnpm, Python and Docker executables exist. Neither metric CLI is on PATH, but the preserved feature-056 worktree contains `dssim` and `ssimulacra2_rs` under its `.cache/image-qa/bin`. Their existence does not establish valid ownership/receipts for this new worktree; source-local verified provisioning or an explicitly validated reuse boundary is required.
- Existing stage-1 CI installs pinned native QA tooling before validation. A nonempty production registry makes real PNG masters mandatory for every local, Linux CI and Docker build. Masters are Git-ignored, allowed in Docker's build context, and excluded from static runtime payloads. Current CI checkout alone does not supply uncommitted masters.
- The existing derivative manifest's `sourceSha256` means the PNG master hash. It does not independently authenticate the canonical input JPG or certify AI/manual review. The stage must retain original hash, master hash, model/binary identity, processing parameters, per-image review/status and derivative lineage distinctly.
- Orchestrator reports approximately 11 GiB free disk space at 99% capacity. Large AI batches, master retention, three-codec output, clean CI reproduction and Docker validation require an explicit feasible storage/provisioning assessment. No shared-cache cleanup is authorized.
- No download, install, AI transform, metric invocation, product edit, test execution, commit or GitHub mutation was performed during intake. Tool absence is a provisioning risk, not an acceptance waiver; an unresolved inability to run the mandatory work blocks full-stage delivery.

## Acceptance Expectations

1. Actual A/B comparison of `realesrgan-x4plus`, `realesrnet-x4plus`, and `remacri` on a reproducible, representative 15-image sample, with real outputs, comparative visual evidence and justified selection recorded in `docs/improvements/priority/03-image-quality-decisions.md`. Binary/model versions, hashes, licenses and reproducible commands are recorded. No invented comparison scores or results.
2. Actual selected-model processing of every one of the 275 unique canonical JPGs into registered PNG masters. A complete per-image journal has no missing statuses, links original/master identities and processing parameters, and records accepted/rejected decisions. AI uses the proposed ×4 intermediate and a source-faithful final scale around ×2–2.3 where compatible with the required output target; Architect must resolve edge cases explicitly.
3. Visually inspect every unique image containing text/signs and preserve all answer-critical objects, arrows, colors, numbers, labels and geometry. Retain source/output comparison evidence tied to each reviewed image. Reject hallucinated changes; only those individually rejected cases use bicubic source fallback and retain `rejected` status/list for the PR. Automated codec metrics cannot certify semantic fidelity.
4. Each upscale result passes the separate sanity comparison: reduce it via `lanczos3` back to the original's exact dimensions and measure actual like-sized DSSIM `<=0.02`. This is distinct from derivative `<=0.01` and does not replace visual review.
5. All 275 sources have three-codec manifest variants reaching at least 1200 pixels, and all 276 references resolve correctly. Architect must explicitly reconcile the stated stage target with the broader 2×620 CSS pixel requirement and available fixed width inventory; no silent claim that 1200 equals 1240. Required PNG extension/format/MIME checks, original/master provenance, inventory completeness, independent derivative DSSIM `<=0.01` and sampled SSIMULACRA2 `>=70` remain enforced.
6. `QuestionImageFigure` renders manifest-backed `<picture>` with AVIF/WebP sources, JPEG fallback/source set, accurate container `sizes`, and positive intrinsic `width`/`height`. Preserve current layout/height cap, alt text, image explanation overlays and local fallback behavior. Cover shared usage in learning, exam and mistakes; Architect must explicitly assess other ticket-image surfaces without expanding this into all-class stage 5.
7. Browser evidence verifies mobile resource selection (at most 800 pixels where the tested viewport/DPR calls for it), high-DPR desktop selection at least 1200 pixels, absence of image-induced layout shift, retained overlay alignment and complete offline ticket-image behavior. Required new paths work through actual Docker/static staging; masters/model binaries/QA caches do not enter runtime payloads. Cache/precache growth is measured and any necessary stage-2 policy changes are validated.
8. A fresh checkout/CI has a deterministic, integrity-checked way to provision every reviewed master without trusting mutable downloads or fabricating approvals. Missing/tampered masters and originals, stale reviews, model identity drift, incomplete references, rejected-but-unrecorded outputs and corrupt derivatives fail. Repeated image builds preserve output/manifest bytes; regeneration does not silently replace reviewed content.
9. Scoped meaningful tests, `validate:content`, relevant strict image/support validation, full preflight, real Docker-only runtime validation, required GitHub checks and exact-current-head review pass. Record actual generation time, incremental time, master/derivative/public payload and git growth; report limits honestly without claiming completed stages 3–5 or overall traffic goals.
10. Protected originals/manuals/official archives and unrelated content remain intact. Complete feature memory records acceptance evidence, dead ends, implementation feedback and Architect dispositions. Final Architect validation precedes final Analyst validation on the same full effective content head; evidence-only follow-up commits need the documented guard. Orchestrator verifies final GitHub merge and fresh main.

## Role Boundaries And Handoff

- Analyst writes only this intake artifact and later append-only final Analyst validation when Orchestrator invokes it after Architect passes. Analyst shuts down after this handoff.
- Architect creates `spec.md`, `plan.md` and `tasks.md`, explicitly disposes model/tool provisioning, real visual QA, PNG persistence/CI transport, source-pin semantics, target-width tensions and storage feasibility before implementation.
- Implementation Agent works only after complete feature memory and explicit assignment of this isolated branch as the single PR slice; records feedback for Architect rather than silently dropping mandatory scope.
- Review Agent checks current diff/content/provenance/negative cases and reports findings without implementation. Orchestrator owns coordination and merge; no role may bypass current-head gates.
- Handoff feature: `specs/057-ticket-photo-quality`, branch `codex/057-ticket-photo-quality`, worktree as recorded above. Additional independent PR slices require their own fresh isolated environments and cycle-set tracking.
- End PR description with `Co-authored-by: Codex <codex@openai.com>`; Codex-assisted commit messages end after a blank line with `Co-authored-by: OpenAI Codex <codex@openai.com>`.
- Cleanup remains unassigned; preserve this active context and all sibling work. Names, timestamps, cache size and apparent inactivity never establish deletion authority.

## Open Questions And Risks

No blocking user requirement clarification is needed during intake. Tool/model execution, review evidence, protected-source pin reconciliation, master transport, exact width policy and disk feasibility are Architect dispositions backed by implementation evidence. If resources, credentials or permissions prevent actual full-stage delivery, report the concrete blocker through Orchestrator; do not publish or merge a partial alternative as completed stage 2.

## Final Analyst Validation Notes

Append-only Analyst-owned section, used only on Orchestrator's later invocation after final Architect PASS.

- Analyst validation pass: not yet invoked.
- Analyst return count for this work cycle: 0.
- Customer intent check: pending delivered effective content head.
- Gaps: none asserted at intake; provisioning/acceptance risks above require disposition and evidence.
- Architect disposition routing: any Analyst validation gap must go through Architect before follow-up implementation.
- Analyst limit escalation: any gap beyond five returns requires a new request in a separate latest-main context.
- Analyst boundary: intake only; no code, planning artifacts, test runs, commits, pushes, PR or merge actions.
