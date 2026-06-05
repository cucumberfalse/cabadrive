# Tasks: Full-Width Manual Source Figures

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] T001 Confirm Architect assignment for `/Users/chap/devel/cabadrive-worktrees/032-manual-figures-full-width` on branch `codex/032-manual-figures-full-width`.
- [x] T002 Confirm verified base from Orchestrator: `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- [x] T003 Preserve role boundary: Architect edits only `spec.md`, `plan.md`, and `tasks.md` under `specs/032-manual-figures-full-width/`.
- [x] T004 Read constitution, project docs, manual conversion guidelines, active `feature-request.md`, and relevant prior feature `031` visual/source-fidelity memory.
- [x] T005 Inspect current renderer/data/CSS read-only for `source-image-cards`, `SourceImageCardsBlockView`, `.manual-source-image-card`, reported section data files, and existing tests.
- [x] T006 Record goal, scope, non-goals, acceptance criteria, negative scenarios, technical approach, inventory requirement, testing requirements, and implementation slice guidance.

## Implementation Assignment Checklist

- [x] T007 Orchestrator assigns Implementation Agent to this same worktree/branch or another fresh latest-main isolated slice, explicitly preserving sibling worktrees, dirty diffs, branches, commits, PRs, and process memory.
- [x] T008 Implementation Agent confirms branch, PR slice, scoped files, latest-main base, and current `git status --short --branch` before editing.
- [x] T009 Implementation Agent reads `feature-request.md`, `spec.md`, `plan.md`, and this `tasks.md` before editing.

## Whole-Document Inventory

- [x] T010 Enumerate every current `source-image-cards` card in `src/data/manual-sections/`.
- [x] T011 Enumerate every current `source-artwork` block and other manual guide image blocks that could share the same undersized/poor-quality behavior.
- [x] T012 Record an inventory disposition for every item: `full-width`, `compact`, or explicit exception, with source page, asset path, dimensions/sourceRegion, protected/source-as-is metadata, reason, and verification need.
- [x] T013 Confirm reported examples are in the inventory: pages `185`, `186`, `app3-body-posture-source-card`, and `app2-hospital-map-source-card`.
- [x] T014 Confirm Appendix IV pages `185-200` are inspected as one pattern group and no adjacent sign/marking/signal sheet is missed.
- [x] T015 Identify any non-Appendix large visuals that need full-width treatment, including large source-as-is photos/diagrams/maps or transferred infographics.
- [x] T016 Record compact dispositions for genuinely small document snippets/diagrams so they are not accidentally enlarged.

## Data / Renderer / CSS Implementation

- [x] T017 Add an explicit reusable display/layout classification for manual source image cards.
- [x] T018 Mark reported examples and Appendix IV full-page/source-sheet cards as full-width/large visuals.
- [x] T019 Mark all additional inventory-selected large visuals as full-width/large visuals.
- [x] T020 Mark compact candidates explicitly, or record why their current data shape does not require a new field.
- [x] T021 Update `SourceImageCardsBlockView` or successor renderer to emit stable data attributes for display classification.
- [x] T022 Update CSS so full-width cards span the full card grid and place image/text in vertical flow.
- [x] T023 Ensure full-width images use available content width while preserving aspect ratio.
- [x] T024 Ensure full-width images avoid inappropriate browser upscaling beyond natural dimensions.
- [x] T025 Migrate existing card-id-specific layout selectors to reusable metadata where feasible, especially for the hospital map and mirror orientation exceptions.
- [x] T026 Preserve compact behavior for cards with compact dispositions.
- [x] T027 Preserve all protected-source data attributes: `data-official-sign-exception`, `data-source-image-exception`, `data-visible-spanish-scope`, and `data-source-as-is`.
- [x] T028 Preserve `loading="lazy"` and local asset handling.

## Source Fidelity And Asset Quality

- [x] T029 Verify page `185` and page `186` sign-sheet assets remain source-as-is and are not modified.
- [x] T030 Verify Appendix IV sign/marking/signal sheet assets remain source-as-is.
- [x] T031 Verify `app3-body-posture-source-card` remains source-as-is with Russian explanation outside the image.
- [x] T032 Verify `app2-hospital-map-source-card` natural dimensions and runtime display size against the Orchestrator-provided `780x335` baseline; record no-upscale evidence.
- [x] T033 If the hospital map can be re-exported from the official source at higher faithful quality, replace it only with documented source-faithful extraction evidence.
- [x] T034 If the hospital map cannot be faithfully improved beyond the existing source crop, cap display at natural width and record the no-upscale limitation.
- [x] T035 Do not translate, relabel, redraw, recolor, clean, mask, retouch, inpaint, reconstruct, or otherwise alter protected signs, markings, photos, or source-as-is map pixels.
- [x] T036 Keep Russian explanation/selectable text outside protected images.

## Durable Docs

- [x] T037 Update `docs_project/project/frontend/manual-conversion-guidelines.md` if a reusable large-source-visual layout/no-upscale/inventory contract is introduced.
- [x] T038 Do not update unrelated docs or process files outside the implementation scope.

## Tests And Evidence

- [x] T039 Add content/unit tests requiring explicit display disposition for current `source-image-cards` cards or a complete equivalent inventory check.
- [x] T040 Add tests asserting pages `185` and `186` are full-width and retain official sign source-as-is metadata.
- [x] T041 Add tests asserting Appendix IV pages `187-200` are full-width or have explicit Architect-compatible dispositions.
- [x] T042 Add tests asserting `app3-body-posture-source-card` is full-width and source-as-is.
- [x] T043 Add tests asserting `app2-hospital-map-source-card` is full-width/no-upscale and source-as-is.
- [x] T044 Add tests asserting compact dispositions remain compact where intended.
- [x] T045 Add or update Playwright desktop/mobile checks for `#manual-section-app4-signs-regulatory`.
- [x] T046 Add or update Playwright desktop/mobile checks for `#manual-section-app3-driving-factors`.
- [x] T047 Add or update Playwright desktop/mobile checks for `#manual-section-app2-highways-hospitals`.
- [x] T048 Add representative Playwright checks for other corrected Appendix IV sections and at least one non-Appendix large visual when applicable.
- [x] T049 Playwright checks must assert image bounding-box width relative to manual content container, not only visibility.
- [x] T050 Playwright checks must assert hospital map runtime width does not exceed natural width when no larger faithful asset exists.
- [x] T051 Commit or record screenshot evidence for required desktop/mobile reported examples and representative inventory findings.
- [x] T052 Verify no document-level horizontal overflow on mobile for corrected sections.

## Local Verification

- [x] T053 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T054 Run focused content/manual-guide tests.
- [x] T055 Run `pnpm run validate:manual-guide`.
- [x] T056 Run `pnpm run validate:content`.
- [x] T057 Run `pnpm run test`.
- [x] T058 Run `pnpm run build`.
- [x] T059 Run focused Playwright checks.
- [x] T060 Run `git diff --check`.
- [x] T061 Run full `pnpm run preflight` if feasible; otherwise record why not.
- [x] T062 Record exact command results and relevant screenshot/bounding-box/natural-dimension evidence in this `tasks.md`.

## Review / PR / Final Validation Prep

- [x] T063 Implementation Agent stages, commits, pushes, and opens/updates one ready PR only if assigned by Orchestrator.
- [ ] T064 Review Agent checks inventory completeness, layout criteria, source-as-is preservation, no-upscale evidence, mobile layout, and feature-memory compliance.
- [ ] T065 Implementation Agent records and resolves review findings only through Orchestrator assignment.
- [ ] T066 Orchestrator invokes final Architect validation before final Analyst validation after implementation, checks, review, and feedback disposition are complete.

## Merge-Gate Blocker Follow-Up

- [x] T067 Architect records disposition for PR `#198` `AI Review` merge-gate blocker on current head `9df31d213419b107ca49797c0357ce8151c8effe`.
- [ ] T068 Orchestrator preserves PR `#198` product implementation and does not rely on PR-local helper/config/test edits to unblock the current `AI Review` run, because `.github/workflows/ai-review.yml` checks out trusted gate scripts from the default branch.
- [ ] T069 Orchestrator routes a separate latest-main gate-fix implementation slice, or records a protected-branch/human blocker if the prerequisite default-branch gate fix cannot land under current branch protection.
- [ ] T070 Gate-fix Implementation Agent updates trusted Codex review login handling or config so Codex evidence trusts both `chatgpt-codex-connector[bot]` and `chatgpt-codex-connector`.
- [ ] T071 Gate-fix Implementation Agent preserves strict evidence trust: arbitrary `OWNER` no-findings summary comments remain untrusted unless the author login is explicitly trusted, stale-head review evidence remains rejected, and case normalization remains intact.
- [ ] T072 Gate-fix Implementation Agent adds focused tests proving `trustedReviewLoginsForAgent("codex")` and `isTrustedReviewLogin(..., "codex")` accept both connector login forms, and proving current-head native Codex review evidence from `chatgpt-codex-connector` is accepted while unknown-login or stale-head evidence is rejected.
- [ ] T073 Gate-fix Implementation Agent updates finalization/blocking-review tests if trusted Codex login defaults affect those paths.
- [ ] T074 Gate-fix Implementation Agent runs affected helper/workflow/finalization tests, `node scripts/check-feature-memory.mjs --worktree`, `git diff --check`, and `pnpm run preflight` if feasible; any omitted check requires recorded evidence and reason.
- [ ] T075 After the default branch contains the gate fix, Orchestrator reruns or observes `AI Review` for PR `#198` and records that the required check accepts current-head Codex review evidence.

## Inventory Notes

Initial Architect read-only scan found `38` `source-image-cards` cards. The implementation inventory must not treat this note as complete final evidence; it is a starting point.

Orchestrator provided additional natural-dimension evidence for the reported examples: page `185` sign sheet `2976x4209`, page `186` sign sheet `2976x4209`, body-posture visual `1350x430`, and hospital map `780x335`.

Implementation inventory `2026-06-05T03:09Z`: a read-only section-data and `sips` natural-dimension scan found `38` current `source-image-cards` cards in `src/data/manual-sections/`, plus `2` `source-artwork` blocks and `36` bespoke/manual visual asset references. The affected renderer is `source-image-cards`; `source-artwork` and bespoke visual blocks do not use the `.manual-source-image-card` thumbnail grid and are dispositioned `not-affected` for this defect while preserving their existing source-faithful renderers.

Full-width source-image-card dispositions (`31` cards): all Appendix IV page/sheet cards `app4-regulatory-page-185-source-card` through `app4-traffic-lights-page-200-source-card`; reported `app3-body-posture-source-card` (`1350x430`) and `app2-hospital-map-source-card` (`780x335`, no-upscale bounded); existing wide/overlay source visuals `app2-mirror-orientation-source-card`, `headrest-position-source-card`, `sri-types-source-card`, `alcohol-limits-source-card`, `distraction-panels-source-card`, and `mobility-context-transferred-card`; additional large/manual-source cards found by whole-document inventory: `app2-seatbelt-use-source-card` (`1060x285`), `app3-seatbelt-source-card` (`1175x1125`), `cedulas-source-card` (`1110x260`), `vtv-source-card` (`1150x335`), `drug-test-device-source-card` (`820x300`), `attention-photo-source-card` (`720x900`), and `driving-culture-photo-source-card` (`1500x2200`). Reason: these are full-page sheets, major source-as-is photos/maps/diagrams/document examples, or transferred source infographics where the old `180px` image cap hides meaningful official/source details.

Compact source-image-card dispositions (`7` cards): `mirror-orientation-source-card` (`495x163`), `dni-source-card` (`320x118`), `license-source-card` (`300x105`), `beginner-sign-source-card` (`315x215`), `rva-source-card` (`360x300`), `app2-headrest-height-source-card` (`185x105`), and `app2-headrest-distance-source-card` (`260x95`). Reason: these are genuinely small supporting snippets/document examples/diagrams whose source role remains compact; tests must keep them explicit so broad CSS does not enlarge everything blindly.

Source-artwork disposition: `ch1-bicycle/offtracking-risk` (`270x260`) and `ch1-bicycle/electric-scooter-photo` (`255x145`) remain `not-affected` because they render through `.manual-guide-source-artwork`, not the thumbnail card grid. Bespoke visual blocks such as Chapter 1 pedestrian, bicycle, public-transport, shared-trip, and sustainable-mobility assets likewise remain `not-affected` for this card-grid defect; they already use dedicated layout components and are outside the current source-image-card display contract.

Must-correct reported examples:

| Section/card | Source page | Initial size evidence | Required disposition |
| --- | ---: | --- | --- |
| `app4-regulatory-page-185-source-card` | `185` | `2976x4209` | full-width |
| `app4-regulatory-page-186-source-card` | `186` | `2976x4209` | full-width |
| `app3-body-posture-source-card` | `161` | sourceRegion `1275x725`, runtime asset observed `1350x430` | full-width |
| `app2-hospital-map-source-card` | `150` | `780x335` | full-width bounded by no-upscale/quality evidence |

Appendix IV group expected full-width unless implementation records a narrow exception:

| Section | Source pages |
| --- | --- |
| `app4-signs-regulatory` | `185-186` |
| `app4-signs-warning` | `187-188` |
| `app4-signs-informational` | `189-192` |
| `app4-signs-temporary` | `193-194` |
| `app4-signs-horizontal` | `195-196` |
| `app4-signs-traffic-lights` | `197-200` |

## Decisions

- Architect decision: one implementation PR slice is appropriate unless asset re-export or repository state creates a documented blocker.
- Architect decision: full-width behavior must be metadata/classification-driven, not a new pile of hard-coded `data-card-id` CSS selectors.
- Architect decision: hospital-map "full width" is bounded by source quality. Do not upscale it past natural/source-faithful dimensions merely to fill a wider container.
- Architect merge-gate disposition `2026-06-05T03:54:59Z`: a same-cycle gate follow-up is required, but not as a PR `#198` local implementation change intended to unblock itself. The manual-figure implementation has no known feature-code issue. The blocker is repository AI Review gate compatibility with the observed current-head Codex native review login `chatgpt-codex-connector`; default trusted Codex login handling currently recognizes `chatgpt-codex-connector[bot]` only. Because the workflow checks out trusted scripts from the default branch, Orchestrator should route a separate latest-main gate-fix slice or record a protected-branch/human blocker if that prerequisite cannot land.
- Implementation startup decision `2026-06-05T03:09:14Z`: Implementation Agent assignment confirmed for worktree `/Users/chap/devel/cabadrive-worktrees/032-manual-figures-full-width`, branch `codex/032-manual-figures-full-width`, one implementation PR slice for feature `032-manual-figures-full-width`, verified base `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`, and scoped files limited to manual source-visual data/renderer/CSS/tests/evidence/durable manual guidance when needed plus `specs/032-manual-figures-full-width/tasks.md`. Parallel work may exist; sibling worktrees, unrelated branches, commits, PRs, dirty diffs, and unrelated process memory must be preserved. Startup status before product edits: `## codex/032-manual-figures-full-width...origin/main` with untracked `specs/032-manual-figures-full-width/` feature memory only.
- Implementation continuation decision `2026-06-05T03:39:56Z`: a direct typecheck found the new source-image-card display fields had been declared on a neighboring card-union member instead of the actual `kind: "source-image-cards"` card type. The continuation fixed that type contract forward in `src/data/manualGuide.ts`; `pnpm exec tsc --noEmit` now passes.
- Implementation decision: no hospital-map asset re-export was performed. The existing source-as-is crop remains byte-preserved at `780x335`, the reusable full-width metadata caps it at `maxDisplayWidthPx: 780`, and Playwright asserts runtime display width never exceeds natural width.

## Known Issues

- No unresolved implementation known issues.
- Hospital map quality disposition: the current `780x335` source-as-is asset is intentionally capped at natural width. The user-visible fix is layout/full-width treatment bounded by no-upscale, not browser upscaling or source-pixel editing.
- Merge-gate blocker: required GitHub `AI Review` is pending/stuck for PR `#198` despite current-head native Codex review evidence. This is not a manual-figure feature defect; it requires default-branch trusted Codex review login compatibility follow-up before the PR can satisfy branch protection.

## Implementation Agent Feedback

- None for Architect disposition.

## Verification Evidence

- Architect merge-gate read-only evidence `2026-06-05T03:54:59Z`: PR `#198` head is `9df31d213419b107ca49797c0357ce8151c8effe`; required checks `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` pass while `AI Review` is stuck in `.github/workflows/ai-review.yml` job `Route and validate selected native review`; GitHub has a current-head native Codex review from `chatgpt-codex-connector`; Orchestrator read-only helper evidence shows `isTrustedReviewLogin("chatgpt-codex-connector[bot]", "codex")` is true and `isTrustedReviewLogin("chatgpt-codex-connector", "codex")` is false; `.unicorn-hub/config.json` has empty `trustedReviewLoginsByAgent`; `scripts/ai-review-helpers.mjs` default Codex trusted logins include only `chatgpt-codex-connector[bot]`.
- `pnpm exec tsc --noEmit` initially failed with `TS2339`/`TS2353` errors because `displayMode` and `maxDisplayWidthPx` were not declared on the actual `source-image-cards` card type; after the forward fix it passed with exit code `0`.
- `node --test tests/content-manual-guide-chapters.test.mjs` passed: `92` tests, `92` pass, `0` fail, duration `12030.860833ms`. This includes the full source-image-card inventory test: `38` cards, `31` full-width, `7` compact, Appendix IV pages `185-200` full-width, reported examples full-width, compact examples preserved, and full-width metadata matched `runtimeDisplaySize.maxWidthCssPx`/no-upscale evidence.
- `pnpm run test:e2e` passed: `80` tests, `80` pass, `0` fail, duration `41.6s`. The new full-width Playwright test passed on Chromium and mobile projects and asserts display mode, card/grid width, image/container ratio, no browser upscaling, and no document-level horizontal overflow.
- `pnpm run preflight` passed: feature-memory gate passed; repository baseline check passed; `validate:content` passed with `460` category B fallback questions and `276` local image references; manual-guide source-fidelity checker passed with `50` implemented sections and `0` pending sections; `pnpm run test` passed with `402` tests; `pnpm run build` completed and generated a service worker with `1844` cached assets; nested full `pnpm run test:e2e` passed with `80` tests in `41.1s`.
- `pnpm run validate:manual-guide`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, focused Playwright checks, and `node scripts/check-feature-memory.mjs --worktree` are covered by the successful full preflight run. The focused content/manual-guide command was also run independently as listed above.
- Screenshot evidence from the full-width Playwright test was generated under `test-results/`. Key Chromium-project paths:
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-regulatory-desktop-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-regulatory-mobile-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app3-driving-factors-desktop-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app3-driving-factors-mobile-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app2-highways-hospitals-desktop-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app2-highways-hospitals-mobile-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-horizontal-desktop-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-horizontal-mobile-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app3-safety-elements-desktop-chromium.png`
  - `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app3-safety-elements-mobile-chromium.png`
- `git diff --check` passed after this evidence update.
