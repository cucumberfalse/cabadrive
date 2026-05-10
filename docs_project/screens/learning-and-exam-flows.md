# Learning And Exam Flows

## Primary Navigation

1. Home
2. Learn Questions
3. Exam Simulation
4. Mistake Review
5. Vocabulary
6. Topic Materials
7. CABA License Process Guide
8. CABA vs RF Guide
9. Official Sources / `Источники` (planned; not implemented yet)

## Home / Onboarding

- Clarifies: official Spanish text is unchanged.
- Clarifies: translations and explanations are unofficial learning aids without requiring repeated disclaimer paragraphs on every question card.
- Clarifies: current category B questions are an unofficial fallback practice set, not an official GCBA question bank.
- Shows quick entry actions for the primary modes.
- When the planned `Источники` section is implemented, home/navigation may expose it as a distinct official-source reference area without implying that the current practice questions are an official full bank.

## Learn Questions Flow

1. Load question card (Spanish official text + answer options).
2. Show the ticket ID in the metadata row for reporting and cross-reference.
3. Show compact static difficulty metadata near the question metadata as `Уровень`/`Сложность билета`; it is a study-planning signal, not correctness or the user `Сложный` flag.
4. Start a soft per-ticket pacing timer derived from the exam format average rounded up to a readable training target.
5. Allow the learner to pause and resume that timer for the current ticket without disabling timers globally.
6. Keep Russian question and answer translations hidden on initial render.
7. Reveal or hide the Russian question translation by activating the Spanish question text area; when revealed, it appears directly under the Spanish question text before the image and answer options.
8. Show answer-choice translations only while the same translation reveal state is active.
9. Show the local question image when the source question includes one.
10. Optional toggle for explanation.
11. If the timer expires before answer selection, show the current ticket as unresolved in-session without recording an answer or moving to mistake review.
12. Submit answer; answering after the timer expires remains possible and records a normal learning answer with visible after-limit status.
13. Automatically reveal Russian question translation, answer translations, and learning explanation.
14. When a validated question-specific image overlay exists, explanation mode dims only feature-009 `background_irrelevant_dim` regions and keeps feature-009 `answer_critical_highlight` regions prominent for the current ticket.
15. Show correctness, key terms, and related weak-topic links.
16. Use bottom previous/next navigation inside the active search collection; previous restores the selected answer and revealed support for questions already attempted in the current session.
17. Optional mark as difficult.

## Exam Simulation Flow

1. Start exam with parameters from `content/config/caba-exam-format.json`.
2. Use the exam-wide timer only; do not show learning per-ticket timer controls during an active attempt.
3. Hide translation/explanation during active attempt.
4. Do not show difficulty rationale, dimensions, or study hints during active attempt; current active exam UI also omits compact difficulty chips.
5. Keep translation/explanation and image overlays hidden after answer selection during the active attempt.
6. Record timing and selected answers.
7. Complete exam and show score.
8. Generate weak-topic and mistake review recommendations.

## Mistake Review Flow

1. Filter previously incorrect items.
2. Show compact static ticket difficulty in the mistake list context and selected question card, separate from wrong-counts.
3. Re-attempt focused set with translation hidden by default.
4. Reveal or hide translation from the Spanish question text area, matching learning mode.
5. After answer selection, automatically reveal Russian question translation, answer translations, and learning explanation.
6. Use validated question-specific image overlays only when explanation support is visible; otherwise show the normal local image and truthful fallback.
7. Use bottom previous/next navigation inside the current mistake collection.
8. Track repeated-error reduction.

## Vocabulary Flow

1. Browse by topic.
2. Search Spanish/Russian terms.
3. Open linked example questions.
4. Prioritize critical-frequency terms.

## Topic Materials Flow

1. Open `Материалы` as a separate top-level section from `Учить`, `Экзамен`, `Ошибки`, `Словарь`, and `CABA/RF`.
2. Browse topic sections from `content/guide/topic-study-guide.ru.json`.
3. See compact topic difficulty in the topic list and selected topic heading.
4. Select a topic and read Russian learning material, practical reasoning when present, Spanish terms, trap notes, and full guide ticket blocks.
5. Render ticket blocks by joining guide `questionId` and `answerId` references to canonical bundled questions and answers.
6. Render ticket difficulty in material ticket blocks from the canonical question record, never from per-topic duplicate labels.
7. Show governed Russian question and answer translations in ticket blocks when available; otherwise show a concise missing-translation fallback while keeping canonical Spanish primary.
8. Show local question images through bundled offline assets only.
9. Keep draft/incomplete, unofficial learning aid, and current fallback question-set labels visible at section/product level without repeating the full status chip inside every ticket block.

## Official Sources / `Источники` Flow (Planned)

The `Источники` reader is planned by feature `019-primary-sources-section` and is not implemented in the current product yet.

1. Open `Источники` as a distinct source-reference section, separate from topic-study `Материалы`.
2. Browse or search official source documents from `content/official-documents/manifest.json`.
3. Open a source detail that defaults to simple Russian learner text.
4. Switch the selected document or chunk to full Russian translation or original Spanish official text.
5. Show compact metadata and status: source title, jurisdiction/type, retrieval date, currentness status, exact-text validation status, and archive reference.
6. Keep Russian translation and simple rewrite clearly labeled as unofficial learning support.
7. Do not provide simplified Spanish.
8. Use local bundled content only; no runtime network fetch, live AI, backend endpoint, or raw PDF viewer.

Russian full translations and simple rewrites for this planned reader must live outside `content/official-documents/`, preferably under a future governed `content/primary-sources/` area. The official archive remains verbatim Spanish-only source material.

## CABA Vs RF Guide Flow

1. Open `CABA/RF` as the existing compact contrast guide.
2. Keep this guide separate from the topic materials section.

## CABA License Process Flow

1. Open `Процесс` as a separate top-level section from `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, and `CABA/RF`.
2. Read the Russian unofficial-support status, B1/private-car `Otorgamiento` scope, last checked date, and official-action warning before using the guide.
3. Review the source-backed step flow for CENAT, online start, course, turno/sede/BUI, psychophysical evaluation, theory, practical B1 exam, and same-day/pass-fail expectations.
4. Use grouped official GCBA/ANSV links for real applications, payments, booking, document checks, and current requirements.
5. Treat fees, sedes, turn availability, Boti/miBA screens, and document lists as volatile and verify them on official pages.
6. Use adjacent-path callouts only as routing hints for renewal, change of jurisdiction, beginner status, prior licenses, and foreigner documentation.
7. Browse the Spanish administrative glossary for low-Spanish support while keeping official Spanish terms visible.

## Status Labels

If full official bank is unavailable, UI must clearly show `official_sample_set` labeling and avoid claims implying complete official coverage.

Current MVP uses the stricter `unofficial_b_fallback` label because the available category B practice questions come from a non-official community simulator while official GCBA category B question bank availability remains unresolved.
