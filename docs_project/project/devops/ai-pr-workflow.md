# AI PR Workflow

Changes to `main` must land through pull requests, never direct pushes.

The active required-check list is `.unicorn-hub/config.json` (`requiredChecks`); installed defaults reflect the active profile. Stack-specific profiles that preserve existing target CI ship only `guard` and `AI Review` and expect the team to add the repository's real CI job names before applying branch protection.

PRs are merge-ready only when every required check is green, blocking findings are resolved, docs/specs are updated, and no conflicts remain.

Before merge, the author should also confirm the SENAR done gate:

- every acceptance criterion has evidence in the PR, plan, or linked checks
- the negative scenario is covered or explicitly waived
- process memory records dead ends, decisions, and known issues
- any remaining known issue is accepted by the human merge owner
