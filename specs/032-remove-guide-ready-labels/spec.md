# Spec: Remove Ready Labels From Guide Navigation

## Role And Context

- Feature ID: `032-remove-guide-ready-labels`
- Architect assignment worktree: `/Users/chap/devel/cabadrive-worktrees/032-remove-guide-ready-labels`
- Branch: `codex/032-remove-guide-ready-labels`
- Verified base: `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`
- Intake source: `specs/032-remove-guide-ready-labels/feature-request.md`
- Parallel work may exist. Preserve existing dirty diffs, branches, commits, PRs, sibling worktrees, and process memory. Do not touch `/Users/chap/devel/cabadrive/specs/032-manual-figures-full-width/` or sibling worktrees.

## Goal

Remove the learner-facing `готово` labels from the `Руководство` manual navigation shown next to implemented manual section rows, including the Appendix III cargo section shown in the user's screenshot, while preserving the same navigation hierarchy, active state, availability logic, route hashes, deep links, and unrelated status/source disclosures.

## Project Constraints

- Cabadrive remains a static local-first React/TypeScript/Vite app with no runtime backend.
- The Docker-only local runtime contract remains unchanged.
- `Руководство` is the interactive Russian manual destination backed by local bundled content.
- The manual surface must remain native HTML/CSS/SVG/image assets only: no runtime PDF viewer, PDF.js, iframe/embed/object PDF loading, remote images, network fetch, backend endpoint, or live AI.
- Official/source-status labels elsewhere in the app remain part of trust and source-boundary UX and must not be removed by this feature.
- This feature does not change manual content, section conversion state, source evidence, official archive content, generated assets, validators, or durable project docs unless implementation reveals an unavoidable contract change and records Architect disposition first.

## Scope

In scope:

- `Руководство` navigation UI inside `IntroductionSectionsView`, especially manual section buttons rendered from `ManualGuideSectionEntry`.
- Visible implemented-section status text currently rendered as `готово`.
- Accessible names for implemented manual section buttons if they currently expose the removed ready status.
- Focused tests that currently assert or allow the visible `готово` label.
- Focused visual/browser verification of the Appendix III case and general manual-navigation behavior.

Out of scope:

- Removing pending/unavailable navigation affordances such as `позже`, `ожидает`, or `ожидает PR` unless they are part of the same implemented-section `готово` rendering branch and need a tiny refactor to keep pending behavior correct.
- Removing `data-status`, `data-source-region-metadata-status`, `data-visual-evidence-status`, source labels, content-mode labels, official/unofficial disclaimers, or primary-source currentness/exact-text labels.
- Changing manual section availability, disabled state, route hashes, hash handling, deep links, section data, conversion status, source-page metadata, source-fidelity evidence, or content modules.
- Redesigning the manual navigation, top-level navigation, manual content pages, `Источники`, `Материалы`, exam, learning, or process-guide surfaces.
- Touching sibling feature memory or sibling worktrees.

## Current Code Observations

- `src/App.tsx` renders the manual navigation in `IntroductionSectionsView`.
- `renderManualSectionButton(section)` computes `isAvailable` through `manualGuideSectionIsAvailable(section)`.
- The current implemented-section text comes from `const sectionStatusLabel = isAvailable ? "готово" : "ожидает PR";`.
- The same label is rendered visibly as `<small>{sectionStatusLabel}</small>` inside `.manual-guide-section-button`.
- The same label is included in the button `aria-label` as `${section.labelRu}: ${sectionStatusLabel}`.
- Important behavior is carried separately by `disabled={!isAvailable}`, `aria-disabled`, `aria-current`, `onClick`, `data-route-hash`, `data-status`, `data-source-pages`, `data-source-region-metadata-status`, and `data-visual-evidence-status`.
- `src/styles.css` styles `.manual-guide-group summary small` and `.manual-guide-children button small`; those styles may remain useful for pending labels.
- `tests/content-manual-guide-chapters.test.mjs` currently asserts the exact `готово` implementation string and the rendered `<small>{sectionStatusLabel}</small>`.
- `tests/e2e/app.spec.ts` already covers `Руководство` hierarchy, active section state, manual section route hashes/deep links, enabled implemented sections, source/evidence data attributes, and content rendering.

## UX Requirements

- Implemented manual navigation rows should show their section title only, without a right-aligned `готово` tag.
- The active manual row must remain visually identifiable.
- Implemented manual rows must remain clickable and deep-linkable.
- Pending/unavailable manual rows, if present now or added later, must remain distinguishable from implemented rows through existing disabled behavior and any scoped pending labels the implementation intentionally preserves.
- Removing the label must reduce visual clutter and must not introduce text overlap, clipping, horizontal overflow, or awkward alignment on mobile.
- Keyboard and screen-reader users should not hear the obsolete `готово` status for implemented manual rows. Available implemented rows can use the section title as the accessible name; disabled pending rows may keep a pending reason in the accessible name.

## Implementation Requirements

- Use the smallest practical product change, expected to be localized to `src/App.tsx`.
- Replace the always-rendered `sectionStatusLabel` pattern so implemented sections no longer render a visible `готово` `<small>`.
- Remove `готово` from implemented manual section accessible names. Prefer `aria-label={section.labelRu}` for available sections and a pending-specific label only for disabled/unavailable sections if needed.
- Preserve pending/unavailable labels and disabled semantics if a section is not available.
- Preserve `manualGuideSectionIsAvailable` and all route/deep-link behavior unless tests reveal a narrow existing bug directly blocking this feature.
- Preserve all existing manual section data attributes used by tests, tooling, or diagnostics.
- Update tests that explicitly assert the old `готово` implementation so the test suite protects the new behavior instead.
- Add or update focused e2e coverage to assert that `manual-guide-nav` does not contain visible `готово` after implemented manual groups are open, including Appendix III (`appendix-3-cargo`) and its child sections such as `app3-driving-factors` and `app3-highways`.
- Add or update static/source tests to reject reintroducing visible `готово` labels in `renderManualSectionButton` while preserving disabled-state and data-attribute expectations.
- Keep `tasks.md` current with implementation decisions, verification evidence, dead ends, known issues, and Implementation Agent feedback.

## Acceptance Criteria

1. The `Руководство` navigation does not show visible `готово` text next to implemented manual section rows.
2. The Appendix III cargo navigation shown in the screenshot, including `Профиль перевозчика грузов`, `Социальная ответственность`, `Факторы, участвующие в вождении`, `Безопасное вождение`, `Элементы безопасности`, and `Автомагистрали`, has no visible `готово` labels.
3. Implemented manual section buttons no longer expose `готово` in their accessible name.
4. Manual section titles remain visible and readable.
5. The selected manual row remains visually identifiable and keeps `aria-current="page"` where it did before.
6. Existing `Руководство` route hashes and deep links continue to work, including `#pandemia-vial`, Introduction hashes, Chapter 4 `#manual-section-ch4-stress`, Chapter 4 `#manual-section-ch4-distractions`, and at least one Appendix III route such as `#manual-section-app3-driving-factors`.
7. Implemented manual sections remain enabled/clickable and retain existing `data-status="implemented"`, route-hash, source-page, source-region metadata, and visual-evidence data attributes.
8. Pending/unavailable entries, if present, do not become misleadingly active.
9. Unrelated source/status labels elsewhere remain intact, including content-mode/status strip labels, `Материалы` status labels, `Процесс` status/source warnings, and `Источники` currentness/exact-text/source labels.
10. The change introduces no runtime network, PDF viewer, backend, live-AI, remote-asset, manual-content, source-archive, or validator behavior change.

## Negative Scenarios

- Implementation removes every `small` or every status label globally and accidentally hides source/currentness/status disclosures outside `Руководство`.
- The visible `готово` label is removed, but the button accessible name still says `готово`.
- `data-status` is removed or changed, breaking diagnostics and existing tests.
- Implemented section rows lose click behavior, active styling, or `aria-current` behavior.
- Deep links still update the URL but no longer select the intended manual section.
- Pending/unavailable entries become visually indistinguishable from available entries or become clickable.
- Layout spacing depends on the removed right-side label and creates awkward wrapping or overlap on mobile.
- Implementation touches manual content, conversion metadata, official source archive files, generated assets, validators, or sibling process memory without scope approval.

## Verification Evidence Required

- Focused static/unit test evidence that the old implemented-section `готово` render path is gone and manual navigation data attributes/disabled logic remain protected.
- Focused Playwright evidence that `manual-guide-nav` contains no visible `готово` after opening the `Руководство` navigation, including Appendix III cargo rows.
- Playwright evidence that at least one Appendix III section can be selected and deep-linked, with active row state and content rendering preserved.
- Regression evidence that existing Introduction route deep links still work.
- Regression evidence that Chapter 4 `Стресс` and `Отвлечения` deep links still open their manual sections.
- Evidence that unrelated status/source labels remain visible in at least representative existing tests or unchanged e2e coverage.
- Evidence that no PDF viewer/runtime network/backend/live-AI dependency is introduced; existing manual/source local-only assertions may satisfy this if still passing.
- Local command evidence appropriate for the narrow UI/test change:
  - `pnpm run test`
  - focused Playwright for `Руководство` manual-guide coverage, for example `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide|Руководство"`
  - `pnpm run build`
  - `node scripts/check-feature-memory.mjs --worktree`
  - `git diff --check`
  - `pnpm run preflight` before PR readiness unless Orchestrator explicitly narrows verification.

## Review Requirements

- Review Agent verifies complete feature memory exists and role boundaries were preserved.
- Review Agent verifies the diff is narrow and limited to `Руководство` ready-label removal plus focused tests/process memory.
- Review Agent verifies no unrelated status/source labels, official/unofficial disclosures, manual content, source archive, validators, runtime/backend/PDF behavior, or sibling work changed unexpectedly.
- Review Agent verifies implemented manual section `data-status` and route/deep-link behavior remain intact.
- Review Agent verifies focused evidence covers Appendix III, active state, deep links, and absence of visible/accessibility-exposed `готово`.
