# UI/UX Source Of Truth

This document is the durable UI/UX rule set for Cabadrive. It translates stable usability, accessibility, and product-design practice into Cabadrive-specific rules for a local-first CABA exam trainer.

## Research Basis

- Nielsen Norman Group usability heuristics: status visibility, user-language wording, user control, consistency, error prevention, recognition over recall, efficiency, focused design, recovery, and contextual help.
- WCAG 2.2: perceivable, operable, understandable, robust interaction with visible focus, keyboard access, predictable controls, sufficient contrast, language handling, and target sizing.
- Cabadrive project memory: official Spanish source text remains primary, Russian support is unofficial, current practice content is `unofficial_b_fallback`, active exam attempts hide scaffolding, and runtime remains static/local-first.

## Rule IDs

Use these IDs in future specs, PR descriptions, audit rows, and review comments.

### UI-001 Status Is Always Visible

Every main surface must keep content status visible enough for trust decisions:

- current question set is `unofficial_b_fallback`;
- category is B/CABA;
- Russian translation, explanation, topic guide, and visual overlays are unofficial learning support;
- official Spanish source text stays primary.

Do not imply complete official GCBA category B question-bank coverage until durable source validation proves it.

### UI-002 Spanish Primary, Russian Support

Question cards, ticket blocks, and exam-like surfaces present Spanish text first. Russian appears as learning support, not as a replacement source of truth. When both languages appear together, the Spanish object remains visually and structurally primary.

### UI-003 Predictable Mode Boundaries

Controls must behave consistently by mode:

- learning and mistake review may expose support after the learner attempts an answer;
- active exam attempts hide translations, explanations, and answer-revealing visual support;
- topic materials, vocabulary, and guide surfaces can show Russian learning content because they are not active exam attempts;
- exam review behavior must be designed separately from active attempts before support is added there.

### UI-004 Controls Follow The Reading Path

Primary progression controls belong where the learner naturally finishes the task. For question attempts, bottom previous/next navigation appears after feedback and explanations. Top toolbars are reserved for search, filters, and mode tools, not duplicate primary progression.

### UI-005 User Control And Context Preservation

Navigation must preserve the learner's current context:

- learning next/previous operates inside current search results or the full bank when search is empty;
- mistake review next/previous operates inside the current mistake collection;
- moving backward restores the selected answer and revealed support for questions already attempted in the current session;
- global answer history in localStorage is append-only for attempts and must not be cleared by navigation.

### UI-006 Boundaries Are Explicit

At the first item, previous is disabled with an accessible state. At the last item, next is disabled with an accessible state. Avoid silent looping because it hides progress and can surprise learners during review.

### UI-007 Mobile First, Dense Enough For Study

Layouts should fit repeated study sessions:

- no decorative hero or marketing screen in the primary app;
- controls must be reachable on mobile without overlapping text;
- cards and panels use 8px radius or less unless the existing system changes;
- status and navigation should remain scannable without making every surface feel like a landing page.

### UI-008 Keyboard And Focus Are Required

Every interactive control must be keyboard reachable, have a visible focus state, and expose a stable accessible name. Pointer-only reveal patterns need keyboard alternatives. Focus order should follow reading order: prompt, support toggle if present, answer choices, feedback, explanation, bottom navigation.

### UI-009 Text Must Not Depend On Viewport Tricks

Do not scale font size with viewport width. Avoid negative letter spacing. Text inside buttons, cards, panels, and status labels must wrap or constrain cleanly on mobile and desktop.

### UI-010 Recovery Is Plain And Local

Missing optional support should produce truthful local fallback text, not claims of completed support. Missing canonical ticket data in materials should keep the page usable while marking the data issue.

### UI-011 Local Assets Only

Study and exam surfaces use committed local assets. No runtime network images, PDF viewers, live AI, analytics calls, or backend APIs are introduced without a new feature spec.

### UI-012 Review Gate

Every UI-changing PR must cite the relevant source-of-truth IDs and provide evidence for the changed behavior. Evidence can be Playwright tests, unit tests, validator output, screenshots, or an explicit blocker recorded in feature memory.

## Surface Rules

### Onboarding And Status

The header/status strip must communicate what the learner is practicing and the current source limitations. It should not repeat long disclaimers inside every card when a concise product-level status already covers the trust boundary.

### Primary Navigation

Navigation labels use learner language and stable concepts: `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, `CABA/RF`. New surfaces must not bury existing exam-focused loops.

### Question Cards

The question card order is:

1. metadata/status;
2. Spanish question;
3. optional Russian question translation when revealed;
4. local image if present;
5. support tools allowed in the current mode;
6. answer options;
7. result feedback;
8. explanation;
9. bottom previous/next navigation;
10. source line.

### Search And Filtering

Search narrows the active learning collection. Previous/next respect the filtered collection, and changing the query returns the learner to the first result to avoid hidden modulo jumps.

### Reset

Reset remains an explicit icon button with an accessible label. It clears local progress only; it must not change bundled content or remote state.

## Consistency Notes

- This document complements `learning-experience-source-of-truth.md`; learning rules decide when support appears, UI rules decide how it is controlled and navigated.
- Image explanation overlays are governed by `image-explanation-overlays.md` and remain blocked until the completed feature 009 dependency is merged into `origin/main` and this branch is synchronized with it.
