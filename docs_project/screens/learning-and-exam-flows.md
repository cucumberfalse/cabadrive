# Learning And Exam Flows

## Primary Navigation

1. Home
2. Learn Questions
3. Exam Simulation
4. Mistake Review
5. Vocabulary
6. Topic Materials
7. CABA vs RF Guide

## Home / Onboarding

- Clarifies: official Spanish text is unchanged.
- Clarifies: translations and explanations are unofficial learning aids without requiring repeated disclaimer paragraphs on every question card.
- Clarifies: current category B questions are an unofficial fallback practice set, not an official GCBA question bank.
- Shows quick entry actions for the primary modes.

## Learn Questions Flow

1. Load question card (Spanish official text + answer options).
2. Show the ticket ID in the metadata row for reporting and cross-reference.
3. Show compact static difficulty metadata near the question metadata as `Уровень`/`Сложность билета`; it is a study-planning signal, not correctness or the user `Сложный` flag.
4. Keep Russian question and answer translations hidden on initial render.
5. Reveal or hide the Russian question translation by activating the Spanish question text area; when revealed, it appears directly under the Spanish question text before the image and answer options.
6. Show answer-choice translations only while the same translation reveal state is active.
7. Show the local question image when the source question includes one.
8. Optional toggle for explanation.
9. Submit answer.
10. Show correctness, key terms, and related weak-topic links.
11. Optional mark as difficult.

## Exam Simulation Flow

1. Start exam with parameters from `content/config/caba-exam-format.json`.
2. Hide translation/explanation during active attempt.
3. Do not show difficulty rationale, dimensions, or study hints during active attempt; current active exam UI also omits compact difficulty chips.
4. Record timing and selected answers.
5. Complete exam and show score.
6. Generate weak-topic and mistake review recommendations.

## Mistake Review Flow

1. Filter previously incorrect items.
2. Show compact static ticket difficulty in the mistake list context and selected question card, separate from wrong-counts.
3. Re-attempt focused set with translation hidden by default.
4. Reveal or hide translation from the Spanish question text area, matching learning mode.
5. Track repeated-error reduction.

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

## CABA Vs RF Guide Flow

1. Open `CABA/RF` as the existing compact contrast guide.
2. Keep this guide separate from the topic materials section.

## Status Labels

If full official bank is unavailable, UI must clearly show `official_sample_set` labeling and avoid claims implying complete official coverage.

Current MVP uses the stricter `unofficial_b_fallback` label because the available category B practice questions come from a non-official community simulator while official GCBA category B question bank availability remains unresolved.
