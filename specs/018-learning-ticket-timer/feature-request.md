# Feature Request: Learning Ticket Timer

## Analyst Artifact Status

This is the Analyst intake artifact for a repository-changing request. Per the Cabadrive role boundary, this artifact records the request, project context, research, assumptions, risks, open questions, and acceptance expectations only.

It intentionally does not include a technical solution, implementation plan, task breakdown, product-code changes, durable docs changes, tests, reviews, commits, pushes, PR state, or files outside this assigned intake artifact.

## Original User Request

The user asked in Russian, through Orchestrator, to act strictly as Analyst for a new repository-changing task:

```text
добавить таймер в билеты в режиме `Учить`, рассчитать лимит исходя из официального времени экзамена и числа билетов, сделать UI аккуратно, согласовать с feature 010 и современными learning/UI practices, по истечении времени считать текущий билет нерешенным, но в режиме обучения дать пользователю возможность сознательно остановить таймер для конкретного билета.
```

Additional Orchestrator constraints:

- Work in isolated worktree `/Users/chap/devel/cabadrive-018-learning-ticket-timer-intake`.
- Use branch `codex/018-learning-ticket-timer-intake`.
- Use feature prefix `018` because local parallel worktrees/branches already exist up to `017`.
- Create exactly one intake artifact: `specs/018-learning-ticket-timer/feature-request.md`.
- Do not change code, docs, spec plan/tasks, tests, runtime files, commits, pushes, or PRs.
- Read repository memory in AGENTS order.
- Coordinate with feature `010` only as read-only dependency/context from `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/specs/010-ui-ux-learning-source-of-truth/*` and its durable UI/learning docs; do not copy or change unmerged files.
- Use `content/config/caba-exam-format.json`: 40 questions, 45 minutes.
- Record intake-level expectation that official average is 67.5 seconds per question and a rounded training target around 75 seconds (`1:15`) is likely appropriate as a soft learning limit.

## Working Environment

The Analyst work was performed in an isolated worktree:

```text
/Users/chap/devel/cabadrive-018-learning-ticket-timer-intake
```

Branch:

```text
codex/018-learning-ticket-timer-intake
```

Feature folder:

```text
specs/018-learning-ticket-timer/
```

## Prefix Decision

The checkout from `origin/main` contains committed feature folders through `011`, including duplicate numeric prefixes from earlier process work. Local parallel worktrees and branches exist through `017`, including `codex/017-difficulty-labeling-orchestrator`. Per Orchestrator instruction and to avoid colliding with active agents, this intake uses prefix `018`.

No existing `specs/018-learning-ticket-timer/` artifact was present in the assigned worktree before this intake was created.

## Scope Split Decision

This request is one coherent feature: a soft per-ticket timer for the learning question flow, calculated from official exam format metadata, with UI/control/accessibility expectations and progress behavior. No split into multiple feature folders is recommended at intake time.

Architect may later slice implementation into documentation, UI state, persistence/progress, tests, and review tasks, but those slices should remain under this one feature memory unless implementation discovers a genuinely independent goal.

## Project Context Reviewed

Repository memory and durable docs reviewed in AGENTS order:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `content/config/caba-exam-format.json`
- Relevant current source evidence in `src/App.tsx`, `src/data/content.ts`, and `tests/e2e/app.spec.ts`

Key project constraints:

- Cabadrive is a local-first React/Vite trainer for Russian-speaking drivers preparing for the CABA category B theory exam.
- MVP has no backend; runtime must remain Docker-served/static/offline-capable.
- Official Spanish question text remains primary.
- Russian translations, explanations, topic guide material, and visual overlays are unofficial learning support.
- Current question content mode is `unofficial_b_fallback`, not a complete official GCBA question bank.
- Active exam attempts hide translation and explanation support.
- Learning and mistake review start with Russian support hidden.
- Exam mode is already driven by `content/config/caba-exam-format.json`.

## Feature 010 Coordination Context

Feature `010-ui-ux-learning-source-of-truth` was read only as dependency/context from:

- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/specs/010-ui-ux-learning-source-of-truth/feature-request.md`
- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/specs/010-ui-ux-learning-source-of-truth/spec.md`
- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/specs/010-ui-ux-learning-source-of-truth/plan.md`
- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/specs/010-ui-ux-learning-source-of-truth/tasks.md`
- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/docs_project/project/frontend/ui-ux-source-of-truth.md`
- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/docs_project/project/learning/learning-experience-source-of-truth.md`
- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/docs_project/project/frontend/frontend-docs.md`
- `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/docs_project/screens/learning-and-exam-flows.md`

Feature `010` is not treated as merged mainline implementation input. The local `010` worktree contains unmerged modified/untracked feature-memory, durable-doc, product-code, style, and e2e files. This intake therefore uses `010` only as a coordination contract and source-of-truth direction, not as code or document content to copy.

Relevant `010` coordination rules for this feature:

- `UI-001`: status should remain visible enough for learner trust decisions.
- `UI-003`: learning/support modes may expose support after an attempt; active exam attempts hide scaffolding.
- `UI-004`: primary controls should follow the learner's reading path.
- `UI-005`: user control and context preservation matter in learning navigation.
- `UI-008`: keyboard reachability, visible focus, stable accessible names, and non-pointer alternatives are required.
- `UI-009`: text must not overflow or rely on viewport font tricks.
- `UI-012`: UI-changing PRs need source-of-truth references and behavior evidence.
- `LEARN-001`: active recall comes first.
- `LEARN-002`: support reveals after attempt in learning/support modes.
- `LEARN-006`: active exam attempts hide scaffolding.
- `LEARN-014`: source trust is part of learning.
- `LEARN-015`: local-first behavior preserves study continuity.

Interpretation for this timer request:

- The learning timer should be a visible status and pacing aid, not an exam-mode enforcement mechanism.
- Because this is `Учить`, the timer must preserve learner control: the user can consciously stop/pause it for the current ticket.
- The timer should not reveal answer-critical support or change exam simulation behavior.
- The UI should be compact, mobile-friendly, keyboard-accessible, and placed where it supports the question attempt without overwhelming the card.

## Current Product Evidence

Observed on the `origin/main`-based worktree:

- `ExamView` already has an exam-wide countdown using `data.examFormat.timeLimitMinutes * 60`.
- `ExamView` uses `data.examFormat.questionCount`, `timeLimitMinutes`, `passingScore`, `canSkipQuestion`, and `questionOrderRule`.
- `LearnView` currently has search and a top `Следующий` control, but no per-ticket learning timer.
- `QuestionCard` tracks selected answer plus support visibility locally and resets on question change.
- In current `origin/main`, learning mode records answers when a user selects an answer; there is no timeout/unresolved state for a learning ticket.
- Active exam attempts pass `revealAfterAnswer={false}` to keep support hidden.

Feature `010` may already be changing some of this behavior in its unmerged worktree, especially bottom navigation and post-answer support reveal. Architect/Implementation should coordinate with the merged state at implementation time and avoid copying unmerged `010` files.

## Exam-Time Calculation

Official exam format metadata in `content/config/caba-exam-format.json`:

- `questionCount`: 40
- `timeLimitMinutes`: 45
- `status`: `defined`
- `completionRule`: `complete_all_questions_or_time_limit`

Baseline calculation:

```text
45 minutes * 60 seconds = 2700 seconds
2700 seconds / 40 questions = 67.5 seconds per question
```

Intake-level expectation:

- The formal average is `67.5s` per question.
- A learning-mode target around `75s` (`1:15`) is likely appropriate as a soft per-ticket limit.
- Rationale: learning practice can be slightly more generous than the strict average because some real tickets are solved faster and others need more reading, especially with Spanish wording. The target should still train the habit of not overthinking a ticket longer than exam pacing permits.
- This is not a technical design decision. Architect should turn it into formal requirements and decide whether the limit is fixed, derived, configurable, or represented as a named training target.

## External Research Performed

Research date: 2026-05-10.

Sources used and relevant takeaways:

- W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/). Relevant points: current web accessibility guidance includes "Enough Time", timing-adjustable expectations, pause/stop/hide expectations, keyboard access, focus appearance, reflow, and target-size considerations. Interpretation: a learning timer that is not essential must offer user control; a constantly changing timer should not create accessibility noise.
- Nielsen Norman Group, [Jakob's Ten Usability Heuristics summary](https://media.nngroup.com/media/articles/attachments/Heuristic_Summary1-compressed.pdf), linked from NN/g's ten heuristics page. Relevant points: visibility of system status, user control/freedom, recognition over recall, consistency, and focused/minimal interfaces. Interpretation: the timer should clearly show current status and outcome, but must have an obvious stop/pause affordance and should not dominate the learning card.
- Dunlosky et al., [Improving Students' Learning With Effective Learning Techniques](https://pubmed.ncbi.nlm.nih.gov/26173288/), 2013. Relevant points: practice testing and distributed practice are high-utility techniques; self-explanation and interleaving can be useful in appropriate situations. Interpretation: the timer should support exam-like active recall, then allow feedback/explanation, rather than replacing the learning loop with pressure alone.
- Agarwal et al., [Classroom-based programs of retrieval practice reduce middle school and high school students' test anxiety](https://www.sciencedirect.com/science/article/abs/pii/S221136811400059X), 2014. Relevant points: frequent low/no-stakes retrieval practice with feedback was associated with students reporting less exam nervousness. Interpretation: the learning timer should remain low-stakes and informative, not punitive or anxiety-amplifying.
- Van Gog, [The Signaling (or Cueing) Principle in Multimedia Learning](https://dspace.library.uu.nl/bitstream/handle/1874/424007/the_signaling_or_cueing_principle_in_multimedia_learning.pdf?sequence=1), 2022 chapter. Relevant points: cueing/signaling can help learners select and integrate relevant information while reducing visual search burden. Interpretation: for timer UI, the same cognitive-load principle argues for clear, compact cues and avoiding decorative or alarming motion.
- Feature `010` research/context, read from its intake and durable docs, including WCAG 2.2, NN/g heuristics, Dunlosky, multimedia learning, Duolingo product/research notes, and Cabadrive-specific UI/learning source-of-truth rules. Interpretation: this feature should reuse the direction of `010` as coordination guidance while avoiding reliance on unmerged implementation.

Research interpretation for Cabadrive:

- Timed practice is useful because the real exam is timed and the learner needs pacing habits.
- In learning mode, the timer should be a soft pacing coach, not a forced exam simulator.
- A per-ticket timer should preserve active recall, immediate feedback, source trust, and learner control.
- Timeout should create a clear "not solved in target time" state for the current ticket, but should not force navigation, block study, hide explanations permanently, or leak into active exam behavior.
- Accessibility matters especially because timers are dynamic UI: avoid screen-reader announcements every second; announce meaningful state changes such as paused/stopped/expired if Architect chooses live regions.

## Problem Statement

Cabadrive has an exam-wide countdown in exam simulation, but learning mode does not currently train per-ticket pacing. A learner can spend much longer than the real exam average on a single ticket and still feel productive, which can weaken exam readiness.

At the same time, `Учить` is a support mode, not an active exam attempt. If a timer behaves like a hard exam lock, it can conflict with the learning purpose, accessibility expectations, and feature `010`'s user-control/active-recall rules.

The product needs a learning-mode per-ticket timer that teaches realistic pacing while staying explicitly soft, controllable, accessible, local-first, and separate from active exam simulation.

## Desired Product Outcome

In `Учить`, each ticket should show a per-ticket timer based on official CABA exam pacing. The learner should see how much time remains for the current ticket and receive a clear state when the target time expires before an answer is selected.

If time expires, the current ticket is shown as not solved/unresolved in the learning context. The timer should not automatically advance to the next ticket and should not turn learning mode into a forced exam attempt.

Because this is a learning mode, the learner must be able to consciously stop or pause the timer for the current ticket when they decide they want more time to think. That action should be explicit, scoped to the current ticket, and visually understandable.

The UI should feel integrated with Cabadrive's question card/status patterns: compact, readable, calm, mobile-friendly, keyboard-accessible, and consistent with feature `010` source-of-truth direction.

## Acceptance Expectations For Architect

Architect should convert these into formal acceptance criteria and verification requirements:

- The feature memory remains complete before implementation: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- The timer is scoped to `Учить`/learning question attempts only unless Architect explicitly scopes a support-mode extension.
- Active exam simulation remains governed by the existing exam-wide timer and must not consume this learning timer as scaffolding.
- The timer limit is derived from `content/config/caba-exam-format.json`, not hard-coded independently of official exam metadata.
- The intake expectation is recorded: official baseline is `67.5s` per question and the likely soft learning target is around `75s` (`1:15`), with rationale.
- Architect decides and documents the exact training target formula, rounding rule, and display copy.
- The UI clearly communicates that the learning timer is a soft pacing aid, not a forced exam rule.
- The current ticket starts timing when the learner sees or begins the ticket, according to a rule Architect specifies.
- The timer resets or reinitializes on ticket change according to documented learning/navigation state rules.
- When time expires before an answer is selected, the current ticket enters a visible unresolved/not-solved state.
- Timeout does not automatically select an answer, reveal exam-only scaffolding, submit an active exam answer, or advance to the next ticket.
- Timeout behavior defines whether and how local progress records an unresolved learning attempt.
- If the learner answers after timeout, the UI and progress behavior are specified: Architect should decide whether this remains "answered after target", replaces unresolved state, or records both.
- The learner can consciously stop/pause the timer for the current ticket.
- The stop/pause action is explicit, keyboard-accessible, and clearly scoped to the current ticket.
- Stopping/pausing the timer for one ticket does not globally disable learning timers unless Architect intentionally defines a separate setting.
- The timer state should be preserved or reset across previous/next navigation according to explicit mode rules, especially if feature `010` bottom navigation has landed.
- The timer UI has accessible names/states and does not rely on color alone.
- Dynamic timer updates should not spam screen readers every second; only meaningful state changes should be announced if live regions are used.
- Mobile layout keeps timer, stop/pause control, answer choices, feedback, and bottom navigation readable without overlap.
- The feature must preserve local-first behavior: no backend, runtime network call, analytics, remote timer service, or server session.
- The implementation must update durable docs only if behavior, architecture, workflows, or deploy rules change, and those doc changes must be done by later roles, not by Analyst.
- Verification evidence should include focused tests for normal timing, timeout/unresolved state, stop/pause behavior, ticket navigation/reset behavior, active exam non-regression, keyboard access, and mobile layout.

## Assumptions

- No further Q&A is needed before architecture; the user gave a clear desired behavior and the main ambiguity can be captured as Architect open questions.
- "Билет" in this request means the current question card in `Учить`, not a multi-question exam attempt.
- The timer is a learning aid and should remain visually calm rather than using alarming motion, sound, or punitive language.
- The per-ticket target should be tied to official exam format metadata even while current practice questions remain `unofficial_b_fallback`.
- A rounded target near `75s` is acceptable at intake level because the goal is habit formation, not exact simulation per question.
- The timer should initially be per-ticket/session state. Whether unresolved timeout persists to localStorage as a progress event is an Architect decision.
- The user's "остановить таймер" likely means pause/stop the countdown for this ticket so the learner can think without pressure; Architect should decide exact label and whether resume is available.
- Feature `010` may alter learning navigation and support reveal before this feature implementation starts; implementation should coordinate against the merged `main` state at that time.

## Risks

- A hard timer in learning mode could create anxiety and reduce learning value if it feels punitive.
- A hidden or overly subtle timer could fail the core goal of building pacing habits.
- Persisting timeout as an incorrect answer could pollute mistake review if the user intentionally paused late or was studying slowly.
- Not persisting timeout at all could make "not solved" state too ephemeral to support progress insight.
- Timer UI can become noisy for screen-reader users if every second is announced.
- Timer state can conflict with feature `010` navigation/state-preservation rules if not planned with current collection and previous/next behavior.
- If the timer uses a hard-coded `75s` without tying it to exam config, it can drift when official format metadata changes.
- If the timer appears in active exam mode, it could confuse the existing exam-wide timer and violate no-scaffolding boundaries.
- Parallel feature work may change `LearnView`, `QuestionCard`, bottom navigation, or support reveal before implementation begins.

## Open Questions For Architect

- Should the exact learning target be fixed at `75s`, derived as `ceil(67.5 to nearest 15 seconds)`, or configurable through local settings later?
- When exactly should the timer start: on card render, after first focus/interaction, after translation remains hidden, or after the learner explicitly begins?
- Does "stop timer" mean pause with resume, stop/dismiss for this ticket, or both?
- If the user stops/pauses the timer, should the UI still show elapsed time for self-awareness?
- When timeout happens before answer selection, should an unresolved event be persisted in `progress.answers`, a separate local progress field, or session-only card state?
- If the learner answers after timeout, should the ticket remain marked "solved after target", become a normal answered ticket, or keep both states?
- Should timed-out unresolved tickets appear in mistake review, a future weak-topic queue, or only as learning-session feedback?
- How should timer state behave when the learner navigates away and back to the same ticket using previous/next?
- Should manual pre-answer support reveal affect the timer, or does the timer continue because the learner chose to use support?
- What exact Russian UI labels should be used for the timer, expired state, and stop/pause action so they feel calm and clear?

## Handoff Expectation

Orchestrator should hand this feature folder to Architect next. Architect should create `spec.md`, `plan.md`, and `tasks.md` before any Implementation Agent changes product code, tests, runtime files, durable docs, content, or validation scripts.

Implementation should proceed only from the completed feature memory in an isolated worktree and branch. It should coordinate with whichever `010` behavior has actually merged into `main` at implementation time, while preserving the rule that unmerged `010` worktree files are not implementation input.
