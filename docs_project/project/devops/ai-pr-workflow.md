# AI PR Workflow

Changes to `main` must land through pull requests, never direct pushes.

The active required-check list is `.unicorn-hub/config.json` (`requiredChecks`); installed defaults reflect the active profile. Stack-specific profiles that preserve existing target CI ship only `guard` and `AI Review` and expect the team to add the repository's real CI job names before applying branch protection.

PRs are merge-ready only when every required check is green, blocking findings are resolved, docs/specs are updated, and no conflicts remain.

The `AI Review` workflow validates the configured native review backend from the `AI_REVIEW_AGENT` repository variable. On same-repository pull request events, it posts the selected backend trigger comment first, then polls for acceptable review evidence on the current PR head. Fork or otherwise read-only-token runs skip the automatic trigger and wait for existing or human-triggered review evidence. Manual `workflow_dispatch` runs keep the `trigger_mode` input so maintainers can choose `skip` when they only want to validate existing review evidence.

If `AI_REVIEW_GITHUB_TOKEN` is configured as a repository Actions secret, the workflow uses it for review-gate API calls; otherwise it falls back to the built-in `github.token`.

Same-repository pull request runs use gate scripts from the pull request head SHA, so changes to the review gate can be validated before merge. Fork and manual validation runs use the default branch gate scripts.

Before merge, the author should also confirm the SENAR done gate:

- every acceptance criterion has evidence in the PR, plan, or linked checks
- the negative scenario is covered or explicitly waived
- process memory records dead ends, decisions, and known issues
- any remaining known issue is accepted by the human merge owner
