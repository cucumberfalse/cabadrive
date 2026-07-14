# ТЗ-04: Декомпозиция монолитного App.tsx на feature-модули

| Поле | Значение |
|---|---|
| Приоритет | P1 |
| Категория | Архитектура |
| Оценка трудоёмкости | XL |
| Статус | Предложено |
| Дата | 2026-07-11 |

## 1. Контекст и проблема

Весь UI живёт в одном файле [src/App.tsx](../../src/App.tsx): 4108 строк, ~100 top-level функций (grep `^function |^export function `), из них ~40 view/компонентов — от QuestionCard (App.tsx:448) до PrimarySourcesView (App.tsx:3596) и корневого App (App.tsx:3959-4108). В том же файле лежат **данные, а не код**: словари русских ярлыков topicLabel/primarySourceCategoryLabel и др. (App.tsx:110-255), захардкоженные геометрии инфографики pandemiaInfographicFrame/pandemiaNativeShapes (App.tsx:1596-1616), константы вроде manualTicketDirectRenderLimit=6 (App.tsx:1186). Стили — один глобальный [styles.css](../../src/styles.css) на 4744 строки, изоляция только соглашением имён классов.

Последствия: любой PR трогает один файл → merge-конфликты; добавление нового вида контент-блока требует правок в 3 местах одного файла; компонентных тестов нет (см. [ТЗ-17](./17-component-testing.md)) — часть тестов вместо этого матчит regexp'ами исходник App.tsx (tests/manual-ticket-placement.test.mjs:441-494), что делает каждый рефакторинг красным.

## 2. Цели

1. Ни один модуль src/ не превышает ~500 строк; каждый view — свой файл.
2. Данные (ярлыки, геометрии, константы) отделены от компонентов.
3. Regexp-тесты по исходнику App.tsx заменены проверками против новых модулей или компонентными тестами.

## 3. Не-цели

- Изменение поведения (строго механический рефакторинг).
- Введение state-библиотеки (store — [ТЗ-06](./06-progress-store.md)).
- CSS-модули «большим взрывом» — растаскивание CSS допускается позже, по-view.

## 4. Требования

- FR-1: Структура: `src/views/{LearnView,ExamView,MistakesView,VocabularyView,TopicGuideView,IntroductionSectionsView,Manual4RuedasView,PrimarySourcesView,ProcessGuideView,GuideView}.tsx`; `src/components/` (QuestionCard, QuestionImageFigure, StatusStrip, таймер и общие мелкие); `src/labels.ts` (все label-функции); `src/views/pandemia/geometry.ts` (геометрии инфографики — либо перенос в контент-JSON рядом с pandemiaVialSection).
- FR-2: Каждый перенос — отдельный PR («один слайс = один PR», как принято процессом репозитория), с зелёным preflight.
- FR-3: Публичные пропсы каждого view фиксируются интерфейсом в его файле; App.tsx после декомпозиции — только роутинг + компоновка (< 300 строк).
- NFR-1: Никаких изменений DOM-структуры/классов (e2e должны пройти без правок, кроме внутренних regexp-тестов).

## 5. Предлагаемое решение и план

Порядок переноса — от листовых к связанным (минимум зависимостей):
- [ ] 1. `src/labels.ts` + `src/views/pandemia/geometry.ts` (чистые данные)
- [ ] 2. VocabularyView, ProcessGuideView, GuideView (маленькие, без progress)
- [ ] 3. QuestionCard + QuestionImageFigure + StatusStrip в components/ (синхронно обновить regexp-тесты, которые матчат appSource)
- [ ] 4. LearnView, MistakesView (используют progress)
- [ ] 5. ExamView (координация с [ТЗ-11](./11-timers-session-state.md) — не делать конфликтующих правок таймера)
- [ ] 6. TopicGuideView, PrimarySourcesView
- [ ] 7. IntroductionSectionsView + manual-guide блоки (крупнейший кусок; координация с [ТЗ-07](./07-block-registry.md) — реестр блоков логично делать этим же слайсом)
- [ ] 8. Manual4RuedasView (либо удаление — по решению из [ТЗ-08](./08-ticket-card-dedup.md))
- [ ] 9. Финал: App.tsx < 300 строк, обновление CLAUDE.md/AGENTS.md с новой структурой

## 6. Критерии приёмки

- AC-1: `wc -l src/App.tsx` < 300; ни один файл src/ > 800 строк (целево ~500).
- AC-2: Полный e2e-набор зелёный без правок сценариев (правки допустимы только в тестах, читающих исходники).
- AC-3: grep «label» — все label-функции в src/labels.ts, ноль в компонентах.
- AC-4: В tests/ не осталось regexp-матчей по «App.tsx» как файлу (перенаправлены на новые модули или заменены).

## 7. Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| Конфликты с параллельными фичами (ТЗ-P1 слайсы) | Высокая | Merge-ад | Согласованный порядок: каждый view переносится ДО или ПОСЛЕ его фичевого слайса, не одновременно |
| Regexp-тесты падают на каждом шаге | Гарантированно | Красный CI | Обновление тестов в том же PR; в перспективе — замена на компонентные (ТЗ-17) |
| Скрытые связи через замыкания App | Средняя | Регрессии | Переносить строго по одному view; preflight на каждый PR |

## 8. Затрагиваемые файлы

`src/App.tsx` (уменьшение), новые `src/views/*`, `src/components/*`, `src/labels.ts`; правки tests/manual-ticket-placement.test.mjs и других source-matching тестов.

## 9. Связанные ТЗ

[ТЗ-05](./05-url-routing.md), [ТЗ-06](./06-progress-store.md), [ТЗ-07](./07-block-registry.md), [ТЗ-08](./08-ticket-card-dedup.md), [ТЗ-11](./11-timers-session-state.md), [ТЗ-17](./17-component-testing.md), [ТЗ-P1](./priority/01-usability.md)
