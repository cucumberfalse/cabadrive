# Feature Request: Feature 009 Process Memory Consistency Fix

## Original Request

The Orchestrator requested Analyst intake only for a tiny repository process-memory consistency fix.

Feature `009-image-metadata-learning-support` is implemented and merged. A fresh main audit found the product and content gates green, but `specs/009-image-metadata-learning-support/tasks.md` contains stale wording in T121:

> T098 is not part of the T121 blocking condition and remains open with explicit Docker-smoke disposition.

That statement now contradicts the surrounding feature memory because T098 is checked and closed by PR #93 and later Docker isolation/verification work. This request is a process-memory correction, not a product-code, content, runtime, or test change.

Requested Analyst constraints:

- Create or use isolated worktree `/Users/chap/devel/cabadrive-022-feature-009-memory-consistency`.
- Use branch `codex/022-feature-009-memory-consistency`.
- Base from `origin/main` expected head `6f34c64a9ee2020c59aa25298c6396575c0e22f5`.
- Create exactly one artifact: `specs/022-feature-009-memory-consistency/feature-request.md`.
- Do not create `spec.md`, `plan.md`, or `tasks.md`.
- Do not edit code, docs, tests, or other spec files.

## Project Context

Cabadrive is a local-first web trainer for Russian-speaking drivers preparing for the CABA theory exam. The repository uses a spec-first, PR-only workflow where every repository-changing request receives durable process memory under `specs/<feature-id>/`.

Feature `009-image-metadata-learning-support` owns completed image metadata, Russian translation, Russian explanation, and related validation/process-memory history for the current fallback question bank. Because feature 009 is already implemented and merged, stale unresolved-task wording in its `tasks.md` can mislead future Orchestrators, Review Agents, or implementation agents during audits and merge-readiness checks.

This feature exists only to intake a correction to that durable feature memory contradiction.

## Observed Contradiction

Current main state shows:

- `specs/009-image-metadata-learning-support/tasks.md` T098 is checked and records successful follow-up Docker smoke evidence from `codex/019-feature-009-docker-smoke-closure`.
- T121 is also checked and records PR #63 readiness evidence, but ends with stale wording that says T098 "remains open with explicit Docker-smoke disposition."
- The stale T121 wording conflicts with the current closed state of T098 and with the later feature 019/021 Docker smoke and isolation verification history.

## Assumptions

- The desired implementation change is limited to correcting stale wording in feature 009 process memory.
- No product behavior, content data, validation rules, build tooling, Docker contract, or user-facing documentation needs to change.
- The correction should preserve the historical evidence already recorded for T098 and T121 while removing or replacing only the contradictory "remains open" meaning.
- No external research is needed because the request is grounded in repository-local process memory and PR history supplied by the Orchestrator.

## Risks

- Editing too broadly could rewrite useful historical evidence in feature 009 instead of making the minimal consistency correction.
- Leaving ambiguous wording could continue to imply that feature 009 has an unresolved Docker-smoke gate.
- Treating this as a product/runtime change could trigger unnecessary validation or container work and increase collision risk with parallel agents.
- Because other agents are working in parallel, any implementation must stay in the assigned isolated worktree and avoid unrelated branches, worktrees, containers, or files.

## Open Questions

- Should the final wording in T121 explicitly name the later PR #93 and Docker isolation/verification PRs, or should it simply remove the stale final sentence and rely on T098's existing evidence?
- Should Architect require a lightweight verification step that checks only the final diff and the relevant T098/T121 lines, or also require `git diff --check` despite the markdown-only scope?

## Acceptance Expectations

Future Architect and Implementation work should be considered successful when:

- `specs/009-image-metadata-learning-support/tasks.md` no longer states or implies that T098 remains open.
- T098 remains checked and closed, preserving its Docker-smoke closure evidence.
- T121 remains checked and continues to describe the Orchestrator blocking condition accurately.
- The change is limited to process memory needed for this contradiction.
- No product code, content, runtime config, tests, durable docs outside the relevant process memory, or unrelated specs are changed.
- Verification evidence records that the contradiction was removed and that the diff is limited to the intended process-memory correction.
