# Plan: Source Scope Guard

## Summary

Introduce a structured practice-source scope contract and move non-B source rejection from fuzzy metadata text matching into an explicit validation helper. Annotate the current fallback source as category B practice data, add policy allowlists for source-scope kinds and categories, and cover the boundary with direct Node tests.

## Technical Context

- runtime: static React/Vite app; no runtime UI change expected.
- dependencies: none.
- product paths:
  - `scripts/validate-content.mjs`
  - `scripts/content-source-scope.mjs`
  - `content/sources/sources.json`
  - `content/validation/production-eligibility.policy.json`
  - `tests/content-source-scope.test.mjs`
  - existing content validation tests as needed
- data changes: add structured source-scope metadata and policy fields.
- docs:
  - `docs_project/project/backend/backend-docs.md`
  - `docs_project/project/feature-inventory.md`
  - this feature memory.

## Scope Boundaries

- in scope: source-scope metadata, validation helper, validation integration, tests, durable docs, process memory.
- out of scope: question-bank replacement, official B-bank research completion, UI redesign, Docker/nginx changes, CI/branch-protection changes.

## Constitution Check

- Spec-first: yes; Analyst intake, spec, plan, and tasks are created before product-code edits.
- Testable boundaries: yes; source-scope validation is extracted into a direct unit-testable helper.
- PR-only: yes; work happens on `codex/004-source-scope-guard`.
- Simplicity: yes; one small helper module avoids broad schema framework changes.
- Deployability: yes; validation/build/preflight remain required.

## Complexity Tracking

Add one helper module, `scripts/content-source-scope.mjs`, because the old logic is embedded inside a full repository validation script and cannot be cleanly tested against synthetic edge cases. The helper should stay small and data-oriented:

- input: `question`, `source`, and policy allowlists.
- output: an array of validation error strings.
- no file I/O.
- no regex over source titles or question text for category eligibility.

## Implementation Approach

1. Confirm branch and baseline status.
2. Add policy fields for allowed practice-source scope kinds and allowed practice categories.
3. Add `practiceQuestionScope` to the current fallback source:
   - `scopeKind`: `category_b_practice_source`
   - `eligibleCategories`: `["B"]`
   - `excludedCategorySpecificSources`: `["A", "A4", "motorcycle"]`
   - `topicMentionsPolicy`: `cross_category_road_user_mentions_allowed`
4. Add a validation helper that requires structured scope for every practice-question source and rejects missing/unknown/non-B scope.
5. Update `scripts/validate-content.mjs` to use the helper and remove metadata regex rejection as the primary guard.
6. Add direct Node tests for:
   - valid category B source with motorcycle mentions in metadata/question text is accepted;
   - missing scope fails;
   - category A/A4/motorcycle scope fails;
   - unknown scope kind fails;
   - question category not included in source eligible categories fails.
7. Update durable docs to describe source-level guard behavior.
8. Run validation, tests, build, preflight, and diff checks.
9. Record verification evidence and process memory.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | Source-scope unit test with category B source whose metadata and question text mention motorcycles. |
| AC-002 | Source-scope unit test for missing `practiceQuestionScope`. |
| AC-003 | Source-scope unit tests for category A/A4/motorcycle and unknown scope kinds. |
| AC-004 | `pnpm run validate:content`. |
| AC-005 | `pnpm run test`. |
| AC-006 | `rg -n "source-level|practice source|motorcycle mentions|cross-category" docs_project specs/004-source-scope-guard`. |

Negative scenario evidence:

- `pnpm run build`.
- `pnpm run preflight`.
- `git diff --check`.
- Review diff to confirm no unrelated runtime, Docker, CI, or dataset replacement changes.

## Risks

- Risk: explicit source scope can be falsified by a bad source entry.
  - Mitigation: this feature makes the contract reviewable and testable; future ingestion still needs human/source evidence review and existing fallback release exceptions.

- Risk: adding policy fields without docs could confuse future agents.
  - Mitigation: update backend docs and feature inventory with the new boundary.

- Risk: replacing regex with structured scope could miss a source that lies in metadata.
  - Mitigation: missing/unknown scope fails; valid scope requires explicit reviewer-visible metadata, and official/full-bank claims remain blocked by existing content mode and release exception rules.
