# Feature Request: Scroll To Top On Page Navigation

## Analyst Intake

- Role: Analyst
- Assigned by: Orchestrator
- Worktree: `/Users/chap/devel/cabadrive-worktrees/040-scroll-top-navigation`
- Branch: `codex/040-scroll-top-navigation`
- Verified base: `origin/main` at `a714064dc205395ff734d86358e5010cd256e574`
- Intake created: 2026-07-06

## Original Request

Russian user report:

> "при переключении между страницами нужно попадать в начало станицы, а не то же место относительно начала, как на исходной странице"

English interpretation:

When the user switches between pages or routes in the app, the viewport should move to the beginning of the newly selected page. It should not keep the scroll offset from the page the user just left.

Screenshot context from Orchestrator:

- The screenshot shows the manual/navigation page scrolled into the middle of a list.
- A selected item in Chapter 3 is visible.
- The observed problem is that selecting another app page/route preserves roughly the same vertical scroll position instead of showing the top of the newly selected page.

## Project Context

Cabadrive is a local-first React/TypeScript/Vite SPA with no runtime backend. It contains multiple top-level learning and reference surfaces, including `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, `Процесс`, `CABA/RF`, `Источники`, and the interactive Russian `Руководство` manual surface.

The manual surface is organized through semantic navigation and can contain long pages, nested navigation lists, and deep content sections. Because the app is an SPA, browser scroll position can persist across route changes unless the frontend intentionally resets it. For a study app with long manual/reference pages, preserving an unrelated prior scroll offset can make navigation feel broken: the learner lands mid-page and may miss the heading, status context, or beginning of the selected content.

This request concerns navigation behavior only. It does not request content changes, new routes, copy changes, backend work, source-material changes, or changes to the Docker/runtime contract.

## Goal

Ensure that app page/route switches start the newly selected page at the top of the viewport so users consistently arrive at the beginning of the selected content.

## Scope

In scope:

- Route/page changes within the Cabadrive SPA where the user selects a different app page or route.
- Top-level navigation between primary app sections.
- Manual/navigation route changes, including selecting another manual topic/page from a scrolled position.
- Behavior on desktop and mobile viewports.
- Preservation of local-first/offline behavior.
- Verification that the previous route's scroll offset does not carry into the newly selected route.

Out of scope:

- Rewriting manual content or navigation structure.
- Changing question, material, vocabulary, source, or process-guide content.
- Changing active exam behavior except for ordinary page entry position if the exam route is entered from elsewhere.
- Adding backend APIs, remote services, analytics, or non-local state.
- Implementing custom per-route scroll restoration history unless Architect determines it is necessary and compatible with the user request.

## Acceptance Expectations

The implementation should satisfy these user-visible expectations:

1. If a user is scrolled down on one app page and then navigates to another page/route, the newly selected page appears at the top.
2. The behavior applies to the reported manual/navigation scenario: from a scrolled manual list or content area, selecting a different route does not retain the old vertical offset.
3. The behavior works for both top-level app navigation and relevant nested manual route navigation.
4. The behavior is not limited to one viewport size; it should be verified on at least a representative desktop and mobile viewport.
5. Existing deep-link semantics should remain understandable. If a route explicitly targets an in-page anchor/hash, Architect should decide whether anchor navigation should still land on that anchor rather than forcibly scroll to absolute top.
6. Existing learning/exam/content functionality should remain unchanged aside from the intended scroll-position reset.

## Assumptions

- The phrase "between pages" means SPA route/page transitions, not scrolling within the same long page without a route change.
- The intended default is top-of-page on route changes, not preserving per-route historical scroll positions.
- Hash/deep-link behavior may be a special case because existing docs mention manual hashes such as `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial`. Preserving explicit anchor targeting may better match existing deep-link expectations than always overriding to top.
- No user clarification is required for intake because the reported behavior, screenshot context, and desired outcome are sufficient for architecture work.
- No external research was needed; this is an app behavior intake grounded in repository documentation and the supplied user report.

## Risks And Open Questions

- Anchor/hash routes need deliberate handling so fixing normal page switches does not break existing deep links into manual children or source sections.
- If the app has multiple scroll containers, the implementation may need to identify whether the window, an app shell container, or a manual-specific pane owns the visible scroll offset.
- If some routes intentionally preserve scroll position for back/forward navigation, Architect should decide whether that existing behavior is still desired or should be superseded by this request.
- Verification should include the reported manual scenario because generic route-level tests may miss nested manual scroll containers.

## Acceptance Evidence To Capture Later

Recommended evidence for later roles:

- Automated or manual browser verification starting on a scrolled page, navigating to a different route, and confirming the new route begins at scroll position `0` or visually at the top.
- Coverage for the manual/navigation scenario shown in the report.
- Coverage for at least one top-level route transition outside the manual surface.
- Mobile and desktop viewport evidence.
- Regression evidence for explicit hash/deep-link behavior if Architect keeps anchor targeting as an exception.

## Handoff Notes

This is a single-goal bug fix request and should remain one feature memory item. The next role is Architect, which should create `spec.md`, `plan.md`, and `tasks.md` before any implementation work begins.
