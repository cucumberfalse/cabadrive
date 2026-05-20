# UI/UX Product Audit

This audit maps the current Cabadrive product to the source-of-truth rules in:

- `docs_project/project/frontend/ui-ux-source-of-truth.md`;
- `docs_project/project/learning/learning-experience-source-of-truth.md`;
- `docs_project/project/frontend/image-explanation-overlays.md`.

Audit date: 2026-05-09; updated 2026-05-10 after synchronizing merged feature 009 from `origin/main`. Branch: `codex/010-ui-ux-learning-intake`.

## Documentation Consistency Check

| Check | Result | Evidence |
| --- | --- | --- |
| Constitution | Pass | Docs preserve spec-first workflow, testable boundaries, process memory, local-first deployability, and PR-only expectations. |
| Durable project docs | Pass | Rules preserve Spanish-primary, unofficial Russian support, `unofficial_b_fallback`, no backend, Docker/static runtime, and hidden active-exam support. |
| Source planning archive | Pass | Rules align with local browser app, no PDF viewer, Docker-only runtime, exam focus, and no full Spanish course. |
| Feature 008 | Pass | `Материалы` is treated as a current audited surface and remains draft/incomplete unofficial learning support joined to canonical tickets. |
| Feature 009 | Pass | Overlay docs consume merged 009 shared metadata plus per-question usage/relevance; implementation does not use local 009 worktrees or unmerged branches. |
| Research basis | Pass | UI docs map NN/g and WCAG rules to product behavior; learning docs map active recall, feedback, distributed review, multimedia signaling, and Duolingo lessons to Cabadrive-specific rules. |
| Internal docs | Pass | UI, learning, and image-overlay docs share the same mode boundaries: support after attempt in learning/mistakes, no support during active exam attempts. |

No unresolved contradiction blocks slices A/B/C/D/E/F. Image overlay implementation is now unblocked by merged 009 and remains fenced by validator failures when a concrete question lacks approved 009 usage/relevance.

## Surface Audit

| Surface | Applicable Rules | Current Result | Gap / Task |
| --- | --- | --- | --- |
| Status/onboarding | UI-001, UI-002, LEARN-014 | Pass | Status strip names unofficial category B practice and source limitation. |
| Primary navigation | UI-003, UI-007 | Pass | Tabs expose `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, `CABA/RF`; `Материалы` from feature 008 is present. |
| Learning question flow | UI-002, UI-004, UI-005, LEARN-001, LEARN-002 | Gap | Support starts hidden, but must auto-reveal after answer and bottom previous/next must preserve session state. Task UX-010-001, UX-010-002. |
| Answer feedback | LEARN-003, LEARN-004 | Partial | Correct/incorrect feedback exists; explanation must become visible automatically after learning/support attempt. Task UX-010-001. |
| Translation/explanation support | UI-003, LEARN-001, LEARN-002, LEARN-006 | Gap | Manual reveal exists; post-answer auto reveal is required for learning/mistakes and forbidden in active exam. Task UX-010-001. |
| Image-backed questions | UI-011, IMG-001..IMG-008 | Implemented seed, extensible | Local images render; approved overlays render only for concrete questions with validated 009 usage/relevance and truthful fallback appears when overlay data is absent. Task UX-010-003. |
| Exam mode and exam review | UI-003, LEARN-006 | Pass for active attempt | Active attempt hides support and moves through exam questions. Exam review support remains future work, not changed here. |
| Mistake review | UI-005, LEARN-005 | Gap | Current surface uses mistake collection; needs bottom previous/next and post-answer auto reveal while preserving repeated attempts. Task UX-010-001, UX-010-002. |
| Vocabulary | LEARN-011, UI-007 | Pass | Searchable focused term cards are present; future links to questions remain audit-derived improvement. |
| CABA/RF guide | LEARN-013 | Pass | Compact contrast guide remains separate from materials. |
| Topic materials | LEARN-012, UI-001, UI-011 | Pass | Feature 008 surface renders status labels, topic list/detail, canonical ticket blocks, answer explanations, and local images. |
| Search/filtering | UI-005, UI-012 | Partial | Learning search exists; navigation must remain inside filtered results and reset to first result on query change. Task UX-010-002. |
| Progress/reset/weak-topic status | UI-010, LEARN-007 | Partial | Status strip and reset exist; weak-topic/difficult guidance can be improved later. Task UX-010-004. |
| Mobile layout | UI-007, UI-009 | Partial | Existing responsive stacking works; bottom nav needs mobile coverage. Task UX-010-002. |
| Keyboard/focus behavior | UI-008 | Partial | Translation toggle has keyboard handling; bottom nav focus order and disabled states need tests. Task UX-010-002. |
| Offline/status/source labels | UI-001, UI-011, LEARN-015 | Pass | Offline e2e exists; source/status labels are visible in status, question, and materials surfaces. |

## Atomic Task Inventory

| Task ID | Rule IDs | Surface | Observed Gap | Atomic Action | Acceptance Hook | Verification Hook | Dependency | Slice | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UX-010-001 | LEARN-001, LEARN-002, LEARN-003, LEARN-005, LEARN-006, UI-003 | Learning, mistakes, exam | Support does not always auto-reveal after support-mode answer. | Reveal question translation, answer translations, and explanation after answer selection in learning and mistake review; keep active exam attempts hidden. | Before answer support hidden; after learning/mistake answer support visible; after active exam answer support hidden. | Playwright learning/mistake/exam tests. | None | D | Unblocked |
| UX-010-002 | UI-004, UI-005, UI-006, UI-008, UI-009 | Learning, mistakes, search, mobile, keyboard | Primary next is top-only and no previous control exists. | Add bottom previous/next controls, remove confusing top next, define disabled first/last boundaries, preserve active collection and per-question session state. | Bottom nav visible after card content; previous disabled on first; next disabled on last; search/mistake collections preserved; revisiting restores selected/support state. | Playwright desktop/mobile plus state checks. | None | E | Unblocked |
| UX-010-003 | IMG-001..IMG-008, UI-003, UI-011 | Image-backed questions | No validated overlay data/rendering existed. | Add durable overlay records, validation, and rendering only when explanation is visible in support modes. | Approved overlay for `b-fallback-001` validates against 009 fingerprints; overlays hide before answer and during active exam; fallback is truthful when absent. | `pnpm run validate:overlays`, validator tests, and Playwright overlay visibility tests. | Completed 009 merged into `origin/main` and synchronized into 010 | F | Implemented |
| UX-010-004 | LEARN-007, LEARN-008, UI-001 | Weak-topic status | Status strip counts mistakes but does not yet direct learner to targeted review/materials. | Future small PR can link weak topics/difficult marks to relevant materials and review targets. | Learner can move from weak status to a focused review/material surface. | Playwright navigation test and content-source label check. | None | Future audit-derived | Unblocked, deferred |
| UX-010-005 | LEARN-011, UI-005 | Vocabulary | Vocabulary terms do not link back to example questions yet. | Future PR can add local links from terms to filtered learning questions while preserving search context. | Opening a term can narrow learning to related questions without losing progress. | Unit/e2e search-context test. | None | Future audit-derived | Unblocked, deferred |
| UX-010-006 | LEARN-006, UI-003 | Exam review | Completed exam result has no dedicated support/review rule. | Architect should decide future exam-review support separately from active attempt behavior. | Active exam boundary remains untouched; review support has explicit acceptance criteria before implementation. | Spec/task evidence before code. | None | Future architecture | Blocked on Architect disposition |

## Final Task Consistency Check

| Check | Result |
| --- | --- |
| Mandatory fix 1 included | Pass: UX-010-001. |
| Mandatory fix 2 included | Pass: UX-010-002. |
| Mandatory fix 3 included | Pass: UX-010-003 implemented after completed 009 was merged into main and synchronized. |
| No task contradicts active exam boundary | Pass. UX-010-001 and UX-010-003 explicitly keep active exam attempts hidden. |
| No task contradicts local-first/no-backend boundary | Pass. All unblocked tasks use local React state/tests; overlay future task requires local content/validation. |
| No task depends on unmerged 009 implementation artifacts | Pass. UX-010-003 consumes only merged 009 manifest/evidence from `origin/main`. |
| Feature 008 covered | Pass. `Материалы` is audited as present and currently passing core source/status/local-image rules. |
| Atomicity | Pass. Mandatory fixes are separated from future weak-topic, vocabulary, and exam-review work. |

Mandatory implementation has proceeded for UX-010-001, UX-010-002, and UX-010-003. Additional overlay coverage can grow through future approved content records, but no UI-side relevance may be invented.
