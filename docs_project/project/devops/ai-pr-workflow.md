# AI PR Workflow

Changes to `main` must land through pull requests, never direct pushes.

Repository-changing work starts with Analyst intake. The Analyst creates the
next numbered `specs/<feature-id>/` folder, writes `feature-request.md`, hands
off to the Orchestrator, and shuts down. The Architect then writes `spec.md`,
`plan.md`, and `tasks.md` from that intake artifact before implementation
begins.

The Orchestrator controls development through production readiness by invoking
Analyst, Architect, Implementation Agent, and Review Agent as needed. The
Orchestrator coordinates and gates the work, but must not directly edit
repository files. If an Implementation Agent records divergence or improvement
feedback, the Orchestrator tracks it and invokes Architect so each item becomes
either a task/ticket or an explicit not-needed decision.

The active required-check list is `.unicorn-hub/config.json` (`requiredChecks`); installed defaults reflect the active profile. Stack-specific profiles that preserve existing target CI ship only `guard` and `AI Review` and expect the team to add the repository's real CI job names before applying branch protection.

PRs are merge-ready only when every required check is green, blocking findings are resolved, docs/specs are updated, feature-memory feedback has disposition, and no conflicts remain.

Current executable feature-memory checks, including local preflight and the CI
guard script, still validate the existing `spec.md`, `plan.md`, and `tasks.md`
contract. The `feature-request.md` requirement is currently enforced by
author/review process checks until a separate guard-script feature adds
executable coverage.

The `AI Review` workflow validates the configured native review backend from the `AI_REVIEW_AGENT` repository variable. On same-repository pull request events with `AI_REVIEW_GITHUB_TOKEN` configured, it posts the selected backend trigger comment first, then polls for acceptable review evidence on the current PR head. Fork, read-only-token, or missing-review-token runs skip the automatic trigger and wait for existing or human-triggered review evidence. Manual `workflow_dispatch` runs keep the `trigger_mode` input so maintainers can choose `skip` when they only want to validate existing review evidence.

If `AI_REVIEW_GITHUB_TOKEN` is configured as a repository Actions secret, the workflow uses it for review-gate API calls; otherwise it falls back to the built-in `github.token`.

The required gate executes scripts from the default branch so review validation is not controlled by pull request code.

Before merge, the author should also confirm the SENAR done gate:

- manual author/review check: Analyst intake is present as `feature-request.md`, or a legacy/no-intake reason is recorded; this is not currently a preflight/CI guarantee
- every acceptance criterion has evidence in the PR, plan, or linked checks
- the negative scenario is covered or explicitly waived
- process memory records dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback
- Implementation Agent feedback is either absent or has Architect disposition
- any remaining known issue is accepted by the human merge owner
