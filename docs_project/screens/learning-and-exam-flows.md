# Learning And Exam Flows

## Primary Navigation

1. Home
2. Learn Questions
3. Exam Simulation
4. Mistake Review
5. Vocabulary
6. Topic Materials
7. CABA vs RF Guide
8. Official Sources / `Источники` (planned; not implemented yet)

## Home / Onboarding

- Clarifies: official Spanish text is unchanged.
- Clarifies: translations and explanations are unofficial learning aids without requiring repeated disclaimer paragraphs on every question card.
- Clarifies: current category B questions are an unofficial fallback practice set, not an official GCBA question bank.
- Shows quick entry actions for the primary modes.
- When the planned `Источники` section is implemented, home/navigation may expose it as a distinct official-source reference area without implying that the current practice questions are an official full bank.

## Learn Questions Flow

1. Load question card (Spanish official text + answer options).
2. Keep Russian question and answer translations hidden on initial render.
3. Reveal or hide the Russian question translation by activating the Spanish question text area; when revealed, it appears directly under the Spanish question text before the image and answer options.
4. Show answer-choice translations only while the same translation reveal state is active.
5. Show the local question image when the source question includes one.
6. Optional toggle for explanation.
7. Submit answer.
8. Show correctness, key terms, and related weak-topic links.
9. Optional mark as difficult.

## Exam Simulation Flow

1. Start exam with parameters from `content/config/caba-exam-format.json`.
2. Hide translation/explanation during active attempt.
3. Record timing and selected answers.
4. Complete exam and show score.
5. Generate weak-topic and mistake review recommendations.

## Mistake Review Flow

1. Filter previously incorrect items.
2. Re-attempt focused set with translation hidden by default.
3. Reveal or hide translation from the Spanish question text area, matching learning mode.
4. Track repeated-error reduction.

## Vocabulary Flow

1. Browse by topic.
2. Search Spanish/Russian terms.
3. Open linked example questions.
4. Prioritize critical-frequency terms.

## Topic Materials Flow

1. Open `Материалы` as a separate top-level section from `Учить`, `Экзамен`, `Ошибки`, `Словарь`, and `CABA/RF`.
2. Browse topic sections from `content/guide/topic-study-guide.ru.json`.
3. Select a topic and read Russian learning material, practical reasoning when present, Spanish terms, trap notes, and full guide ticket blocks.
4. Render ticket blocks by joining guide `questionId` and `answerId` references to canonical bundled questions and answers.
5. Show local question images through bundled offline assets only.
6. Keep draft/incomplete, unofficial learning aid, and current fallback question-set labels visible.

## Official Sources / `Источники` Flow (Planned)

The `Источники` reader is planned by feature `016-primary-sources-section` and is not implemented in the current product yet.

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

## Status Labels

If full official bank is unavailable, UI must clearly show `official_sample_set` labeling and avoid claims implying complete official coverage.

Current MVP uses the stricter `unofficial_b_fallback` label because the available category B practice questions come from a non-official community simulator while official GCBA category B question bank availability remains unresolved.
