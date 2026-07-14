# ТЗ-09: Единый поисковый слой и мемоизация тяжёлых вычислений

| Поле | Значение |
|---|---|
| Приоритет | P1 |
| Категория | Производительность / консистентность |
| Оценка трудоёмкости | S |
| Статус | Предложено |
| Дата | 2026-07-11 |

## 1. Контекст и проблема

1. PrimarySourcesView пересчитывает documentMatches **в теле рендера без useMemo** (App.tsx:3639-3682): на каждый рендер (каждый keystroke, любое из 8 useState компонента) выполняется normalizeSearchText по всем чанкам всех 50 документов корпуса, строки метаданных пересобираются join'ом заново.
2. Поиск по вопросам (src/search.ts:3-18) пересобирает haystack каждого вопроса при каждом вызове searchQuestions, без кеша.
3. Поиск непоследователен: normalizeSearchText (NFD + удаление диакритики, App.tsx:257-262) применяется только к manual/sources; search.ts использует голый toLowerCase — «señal» и «senal» дают разные результаты в разных вью (пользовательская сторона — [ТЗ-P1](./priority/01-usability.md) FR-D1..D3).
4. MistakesView ищет вопрос линейно `data.questions.find` (App.tsx:962), хотя `questionById` Map уже существует (src/data/content.ts:347).

## 2. Цели

Поиск везде ведёт себя одинаково (диакритика, русские темы) и не пересчитывает статичные данные; ввод в поиск не вызывает O(корпус) работы в рендере.

## 3. Требования

- FR-1: normalizeSearchText переносится в src/search.ts и экспортируется; App.tsx импортирует оттуда (дубликат App.tsx:257-262 удаляется).
- FR-2: Haystack вопросов предвычисляется один раз (module-level `Map<questionId, haystack>` — контент статичен), включает русские метки тем (topicLabel).
- FR-3: documentMatches — useMemo с deps [documents, query, фильтры]; normalized-текст чанков предвычисляется однократно при загрузке корпуса (поле на объекте чанка или WeakMap).
- FR-4: `data.questions.find` → `questionById.get` в MistakesView.
- NFR-1: Ввод символа в поиск «Источников» не вызывает полный проход корпуса, если query не изменился (проверка через профилировщик React DevTools при ревью).

## 4. План

- [ ] 1. search.ts: normalize + предвычисленный haystack + unit-тесты (диакритика, русские темы)
- [ ] 2. PrimarySourcesView: useMemo + предвычисление чанков
- [ ] 3. MistakesView: questionById
- [ ] 4. e2e: «senal» находит «señal» в билетах, словаре, materials

## 5. Критерии приёмки

- AC-1: grep normalizeSearchText — определение только в search.ts.
- AC-2: Unit: searchQuestions("senal") находит вопрос с «señal»; searchQuestions("стоянка") находит тему parking.
- AC-3: e2e зелёные; поиск в «Источниках» без визуальных лагов на Pixel-профиле.

## 6. Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| Изменение результатов поиска (нормализация) удивит e2e | Средняя | Красные тесты | Прогон и адресная правка ожиданий в том же PR |

## 7. Затрагиваемые файлы

`src/search.ts`, `src/App.tsx` (257-262, 962, 3639-3682), `tests/search.test.mjs` (новый).

## 8. Связанные ТЗ

[ТЗ-P1](./priority/01-usability.md) (FR-D1..D3 — UX-часть), [ТЗ-17](./17-component-testing.md)
