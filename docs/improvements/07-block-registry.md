# ТЗ-07: Реестр контент-блоков kind→component вместо if-цепочек

| Поле | Значение |
|---|---|
| Приоритет | P2 |
| Категория | Архитектура / расширяемость |
| Оценка трудоёмкости | M |
| Статус | Предложено |
| Дата | 2026-07-11 |

## 1. Контекст и проблема

ManualGuideSectionContentView диспетчеризует `block.kind` цепочкой из ~24 последовательных if (App.tsx:2810-2972), вторая цепочка — в IntroductionArticleBlockView (App.tsx:1823-1918); всего 33 сравнения `block.kind ===` в файле. Рядом — 21 функция `*BlockView` (App.tsx:1822-2726), каждая с типом `Extract<ManualGuideSectionContent["blocks"][number], { kind: … }>` и повторяющимися data-source-page/data-source-region атрибутами. Добавление нового вида блока — главная точка расширения контентного гида (33 вида блоков уже, см. распределение в [ТЗ-P2](./priority/02-document-quality.md)) — требует правок в 3 местах 4-тысячестрочного файла.

## 2. Цели

Добавление нового kind = один новый файл + одна строка в таблице; exhaustiveness проверяется компилятором.

## 3. Требования

- FR-1: `src/views/manual-guide/blocks/` — по файлу на блок (или группами по смыслу); общий wrapper `BlockFrame` с data-source-page/data-source-region.
- FR-2: Типизированная таблица: `const blockRenderers: { [K in Block["kind"]]: FC<{ block: Extract<Block, {kind: K}> }> }` — mapped type гарантирует полноту (пропущенный kind = ошибка компиляции).
- FR-3: Обе if-цепочки заменены одним lookup.
- NFR-1: DOM-структура и классы не меняются (e2e и visual-completeness evidence нетронуты).

## 4. План

- [ ] 1. BlockFrame + таблица + перенос 5 простых блоков (paragraph, lead, callout, list, quote); проверка exhaustiveness-паттерна
- [ ] 2. Перенос остальных ~16 *BlockView
- [ ] 3. Замена цепочки IntroductionArticleBlockView
- [ ] 4. Удаление мёртвых веток; grep `block.kind ===` ≤ 2 (только внутри данных/утилит)

## 5. Критерии приёмки

- AC-1: Новый тестовый kind без регистрации в таблице не компилируется (негативная проверка при ревью).
- AC-2: e2e и `pnpm run validate:manual-guide` зелёные без правок evidence.
- AC-3: grep `block.kind ===` по src — ≤ 2 вхождений.

## 6. Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| Расхождение DOM при переносе | Низкая | Красный visual-audit | Перенос механический, сверка снапшотами e2e |
| Пересечение с ТЗ-04 (этап 7) | Высокая | Дубль работы | Выполнять как часть этапа 7 декомпозиции |

## 7. Затрагиваемые файлы

`src/App.tsx:1822-2972` → `src/views/manual-guide/blocks/*` (новые).

## 8. Связанные ТЗ

[ТЗ-04](./04-app-tsx-decomposition.md) (этап 7), [ТЗ-P2](./priority/02-document-quality.md) (FR-8 добавляет конверсии блоков — удобнее после реестра)
