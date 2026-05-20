# Learning Experience Source Of Truth

This document defines how Cabadrive teaches fast CABA theory exam readiness for experienced Russian-speaking drivers. It is not a generic driving-school curriculum and not a Spanish course.

## Research Basis

- Dunlosky et al. identify practice testing and distributed practice as high-utility learning techniques. Cabadrive should make exam-like recall the main loop.
- Multimedia learning research supports coherence, signaling, and spatial/temporal contiguity. Visual explanations should reduce irrelevant load and keep cues near the image details they explain.
- Duolingo product and research writing supports guided next steps, review of harder material sooner, mixing old and new concepts, plain-language feedback after errors, and long-term learner benefit over short-term engagement.

## Rule IDs

### LEARN-001 Active Recall Comes First

In learning and mistake review, translations and explanations start hidden. The learner attempts the Spanish prompt first so practice remains exam-like.

### LEARN-002 Support Reveals After Attempt

After answer selection in learning/support modes, Cabadrive automatically reveals:

- Russian question translation;
- Russian answer translations;
- learning explanation.

This happens after the learner has completed active recall, so it supports correction without weakening the attempt.

### LEARN-003 Immediate Feedback Is Required

After an answer, the learner sees whether the selected answer was correct and the correct Spanish answer. Feedback should be concise and appear before longer explanation content.

### LEARN-004 Explain The Reason, Not Only The Answer

Explanations should name the local rule, the exam wording trap, or the visual cue that makes the answer correct. If a full explanation is missing, the UI must say so plainly.

### LEARN-005 Mistake Review Is A Support Mode

Mistake review follows the same hidden-before-answer and auto-reveal-after-answer rule as learning mode. It operates over the learner's current mistake collection and should preserve repeated attempts for progress evidence.

### LEARN-006 Active Exam Attempts Hide Scaffolding

During an active exam attempt, translations, explanations, answer highlights, and image overlays that reveal answer-critical cues stay hidden. Exam review may become a support surface only after a separate rule and tests define it.

### LEARN-007 Weak Topics Should Be Actionable

Repeated wrong answers, difficult marks, topic labels, and topic-material links should guide the learner toward focused review. The product should not present mistakes as punishment; it should turn them into the next study target.

### LEARN-008 Distributed Review Beats Passive Rereading

Future scheduling should bring difficult or recently missed material back sooner and mix it with older concepts. Passive rereading of materials is supportive, not the main preparation loop.

### LEARN-009 Interleaving Is Useful When It Protects Exam Readiness

Mix topics when it helps the learner distinguish similar signs, priority rules, parking rules, documents, or local CABA/RF differences. Do not randomize so aggressively that status and progress become unclear.

### LEARN-010 Self-Explanation Is Optional But Valuable

Future UI may ask the learner to predict why an answer is correct before revealing explanation. This must remain lightweight and must not block fast exam practice.

### LEARN-011 Vocabulary Supports Questions

Vocabulary is useful when it links Spanish exam terms to real tickets and topics. It should stay focused on exam comprehension, not become a broad language course.

### LEARN-012 Materials Are Unofficial Support

`Материалы` renders the local topic study guide as published unofficial learning support. Ticket blocks in materials join back to canonical questions for Spanish text, answers, correct answer, explanations, local images, and source status.

### LEARN-013 CABA/RF Is A Compact Contrast Guide

`CABA/RF` explains high-risk differences from Russian driving expectations. It should stay compact and exam-focused.

### LEARN-014 Source Trust Is Part Of Learning

Learners must be able to tell whether they are practicing official Spanish source text, unofficial fallback questions, or unofficial support. Trust labels are part of the learning interface, not legal fine print.

### LEARN-015 Local First Preserves Study Continuity

All learning loops must work from bundled content after build. Offline reload is part of the learning experience because the target use case is local preparation.

## Mode State Rules

### Learning

- Initial render: no Russian translation or explanation.
- Manual pre-answer reveal: allowed through the Spanish question area and support button.
- After answer: translation and explanation reveal automatically.
- Previous/next: uses the active search result collection; selected answer and revealed support are restored when returning to a question in the same session.

### Mistake Review

- Initial render: no Russian translation or explanation.
- After answer: translation and explanation reveal automatically.
- Previous/next: uses the current mistake collection; repeated attempts are recorded rather than replacing history.

### Active Exam Attempt

- No manual translation/explanation controls.
- No automatic support reveal after answer.
- No answer-revealing image overlays.
- Answering advances the attempt according to the exam flow.

### Topic Materials

- Russian explanation is visible because the surface is passive support, not active recall.
- Canonical Spanish ticket data remains visible inside ticket blocks.
- Published and unofficial-support labels remain visible.

## Acceptance Hooks

Use these hooks when implementing learning behavior:

- learning and mistake review hide support before answer;
- learning and mistake review reveal question translation, answer translations, and explanation after answer;
- active exam attempts keep support hidden after answer;
- bottom navigation preserves collection context and per-question session state;
- source/status labels remain visible in status, question, materials, and guide surfaces.
