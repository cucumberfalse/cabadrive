# Implementation Plan: Безопасный сброс прогресса — подтверждение, undo, экспорт/импорт

## Delivery Shape

Один implementation-слайс на Analyst-created handoff:
ветка `claude/046-progress-reset-safety`, worktree
`/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/046-progress-reset-safety`,
база `origin/main` `3fed47ccb05a4cde7ecf7dd499ba9fffbc2b372c`. Диалог, undo и
экспорт/импорт неразделимы: подтверждение без undo нарушает FR-A2, импорт без
подтверждения/снапшота нарушает A4, поэтому дробление на несколько PR не
снижает риск. Store (`src/progressStoreCore.ts`, `src/progressStore.ts`) не
изменяется — слайс потребляет только его публичный API.

## Технический дизайн

### ConfirmDialog на нативном `<dialog>` (Принцип VIII Simplicity)

`src/components/ConfirmDialog.tsx` — единственная новая абстракция UI, с
текущей задокументированной необходимостью: два использования уже в этом
слайсе (сброс, импорт) плюс зафиксированный задел слайса 2 (FR-A5); нативный
`showModal()` даёт фокус-ловушку, Esc (событие `cancel`), `::backdrop` и
возврат фокуса на вызвавший элемент бесплатно — UI-библиотека или ручная
фокус-ловушка были бы более сложной альтернативой. Поддержка `<dialog>` во
всех evergreen-браузерах и iOS Safari 15.4+; fallback не делается и
фиксируется как ограничение.

Контракт компонента (обобщать сверх нужд слайса 1 запрещено):

- Пропсы: `open: boolean`, `title`, `children` (тело со счётчиками),
  `confirmLabel`, `cancelLabel` (default «Отмена»), `onConfirm`, `onCancel`,
  `confirmDisabled?: boolean`, `danger?: boolean` (деструктивная стилизация
  кнопки подтверждения).
- Управление: `useEffect` синхронизирует `open` с
  `dialog.showModal()`/`dialog.close()`; событие `cancel` (Esc) и клик по
  backdrop (клик, чей `event.target === dialog`) вызывают `onCancel`;
  видимая кнопка «Отмена» — тоже `onCancel` и получает автофокус при
  открытии (`autoFocus`).
- Чекбокс двойного подтверждения НЕ живёт в ConfirmDialog: он — часть тела
  диалога сброса в App, управляет `confirmDisabled`. Это удерживает компонент
  минимальным.

### Логика undo и файловых операций: `src/progressResetSafety.ts`

Решение: отдельный чистый модуль, а не обвязка внутри progressStore и не
inline-код в App.tsx. Обоснование (Принципы II и VIII): sessionStorage-логика
должна тестироваться в node --test без браузера — модуль принимает
`StorageLike` (тип уже экспортируется store) и не трогает `window`; store
менять запрещено scope-границей ТЗ-06; App.tsx остаётся тонкой прослойкой.
Экспортируемый контракт:

```ts
export const RESET_UNDO_KEY = "cabadrive.progress.reset-undo.v1";
export function saveUndoSnapshot(storage: StorageLike, snapshot: string): boolean; // try/catch → false
export function readUndoSnapshot(storage: StorageLike): string | null;             // try/catch → null
export function clearUndoSnapshot(storage: StorageLike): void;                     // best effort
export function exportFileName(date: Date): string; // cabadrive-progress-YYYY-MM-DD.json, локальная дата
export const IMPORT_REJECTED_MESSAGE: string; // человекочитаемая ошибка импорта
export const UNDO_UNAVAILABLE_MESSAGE: string; // сброс без undo (sessionStorage недоступен)
```

Восстановление undo идёт через существующий
`dispatchProgress({ type: "importProgress", raw })` — отдельное
restore-действие в store не добавляется (допущение A3, Simplicity): снапшот —
строго строка `exportProgress()`, round-trip гарантирован AC-6 ТЗ-06.

### Точки интеграции в App.tsx

Все правки локализованы в корневом `App` (шапка + новые панели), вью не
затрагиваются:

1. `reset()` (~строка 5080) перестаёт диспатчить напрямую; появляется
   состояние `resetDialogOpen`, `resetAcknowledged` (чекбокс),
   `importCandidate` (`{ raw, parsed } | undefined`), `headerNotice`
   (undo-панель / ошибка импорта / undo недоступен), с инициализацией
   undo-панели из `readUndoSnapshot(window.sessionStorage)` при монтировании
   (lazy `useState`-инициализатор; sessionStorage передаётся только через
   обёртку с try/catch на случай запрета доступа).
2. Шапка (~строки 5130–5144): существующая кнопка RotateCcw дополняется
   кнопками Download («Экспортировать прогресс») и Upload («Импортировать
   прогресс») из lucide-react + скрытый `<input type="file">` с `ref`.
   Группа оборачивается в `div.header-actions`.
3. Между `<header>` и `<StatusStrip>` рендерится условная панель
   `.progress-notice` (`role="status"` для undo/предупреждения,
   `role="alert"` для ошибки импорта) с кнопками «Вернуть»/«Скрыть».
4. Диалоги сброса и импорта — два вызова `ConfirmDialog` в корневом JSX;
   счётчики N/M/K берутся из уже существующего `progress = useProgress()`
   (единый снапшот — согласован со StatusStrip, риск расхождения цифр закрыт).
5. Прямых обращений к `window.sessionStorage` вне одного адаптера в App нет;
   к localStorage — по-прежнему ноль.

### Ключи и строки

- sessionStorage: `cabadrive.progress.reset-undo.v1` — единственный новый
  ключ; неймспейс совпадает с существующим `cabadrive.progress.v1`.
- Имя экспорта: `cabadrive-progress-<YYYY-MM-DD>.json` (локальная дата,
  zero-padded).
- Пользовательские строки — константы модуля/компонента, русские, в стиле
  существующей шапки; точные формулировки спецификации (spec.md) — default,
  Implementation Agent может уточнить типографику без изменения семантики,
  но строки, на которые завязаны e2e, фиксирует в тех же тестах.

### Стили (`src/styles.css`)

- `dialog.confirm-dialog`: панельный паттерн (`border: 1px solid
  var(--line-strong)`, `border-radius: 8px`, `background: var(--surface)`,
  `box-shadow: var(--shadow)`), `::backdrop` с полупрозрачным затемнением,
  `max-width` для мобильного.
- Кнопки диалога переиспользуют `.tool-button`-паттерн; деструктивная —
  модификатор с `var(--danger)`/`var(--danger-soft)`; всё ≥42 px и с
  существующим `:focus-visible`-контуром (NFR-2/NFR-3).
- `.header-actions` — flex-группа иконок; `.progress-notice` — узкая панель
  со статусной рамкой (варианты: нейтральный для undo, `--danger-soft` для
  ошибки).

### Совместимость с существующими e2e (NFR-1)

- Ни один существующий тест не кликает «Сбросить прогресс» (grep «Сбросить»
  по `tests/e2e/` — только «Сбросить поиск»); диалоги открываются
  исключительно по клику; undo-панель не рендерится в свежем контексте (нет
  снапшота) — DOM существующих сценариев не меняется.
- `storedAnswerCount`/`storedAttempts`-хелперы читают
  `localStorage["cabadrive.progress.v1"]` — путь записи не меняется.
- Hash-механика «Руководства», табы и StatusStrip не затрагиваются; в шапку
  только добавляются кнопки (селекторы существующих тестов — по ролям/имени,
  коллизий имён нет).
- Обязательный прогон всего e2e в обоих проектах (Desktop Chromium +
  Pixel 7) до push.

## Последовательность реализации

1. Подтвердить ветку/worktree/базу; сохранить незакоммиченный
   `feature-request.md` и артефакты Architect; не трогать чужие worktree.
2. Test-first: написать падающие unit-тесты
   `tests/progress-reset-safety.test.mjs` (транспиляция
   `src/progressResetSafety.ts` в память по образцу
   `tests/progress-store.test.mjs`; FakeStorage с fault-injection) и
   каркасные e2e-сценарии AC-1/негативов.
3. Реализовать `src/progressResetSafety.ts`, затем
   `src/components/ConfirmDialog.tsx`, затем интеграцию App.tsx и стили.
4. Довести e2e: сброс-отмена, сброс-подтверждение-«Вернуть», reload-undo,
   export→reset→import, битый импорт, a11y-проверки фокуса.
5. Обновить `docs_project/screens/learning-and-exam-flows.md` и feature
   memory; обновить точные счётчики тестов в Evidence Log.
6. Полный локальный гейт и preflight; commit/push/PR — только по назначению
   Implementation Agent; без merge.

## Verification Matrix

| Граница | Команда/свидетельство | Условие прохождения |
|---|---|---|
| Undo/файловая логика | `node --test tests/progress-reset-safety.test.mjs` | save/read/clear снапшота, отказ хранилища → false без исключений, формат имени файла, round-trip `exportProgress()`→`parseImportedProgress` |
| Store не задет | `git diff --stat src/progressStoreCore.ts src/progressStore.ts` пуст; `node --test tests/progress-store.test.mjs tests/domain.test.mjs` | Контракт ТЗ-06 не изменён, наборы зелёные |
| Границы хранилищ | `rg -n "sessionStorage" src/`; `rg -n "localStorage" src/` | sessionStorage — только `progressResetSafety.ts` + единственный адаптер App; localStorage — только внутри store-границы |
| Полный Node-набор | `pnpm run test` | Все файлы зелёные; точное число тестов записано в Evidence Log |
| Типы/линт | `pnpm run quality:fast` | typecheck + ESLint (`--max-warnings 0`) зелёные |
| Форматирование | `pnpm run format:check` | Prettier по allowlist зелёный |
| Сборка | `pnpm run build:app` | Продакшен-бандл собирается; новых зависимостей нет |
| E2E | `pnpm run test:e2e` | Существующие + новые сценарии зелёные в обоих проектах; точные счётчики записаны |
| Репозиторный гейт | `pnpm run preflight` перед каждым push | Полная матрица зелёная на кандидат-head |
| Diff/процесс | `git diff --check`, scoped diff, tasks-evidence | Нет whitespace/scope-проблем; decisions/dead ends/feedback актуальны |

## Review And Finalization Gates

- Review Agent (AI Review/Codex — gate по exact head SHA) проверяет диф:
  отсутствие обхода подтверждения, атомарность импорта, одноразовость
  снапшота, границы хранилищ, a11y диалога, отсутствие правок store,
  соответствие feature memory — inline-threads без правок кода.
- Feedback Implementation Agent получает Architect-диспозицию до merge;
  cycle PR set ведёт Orchestrator (squash-only ruleset).
- Финальная Architect-валидация → финальная Analyst-валидация на одном
  effective content head; post-validation non-evidence изменения делают
  валидации stale.

## Риски и меры

| Риск | Мера |
|---|---|
| Снапшот ~5000 ответов не помещается в sessionStorage | try/catch (`saveUndoSnapshot` → false); сброс не блокируется; явное предупреждение; unit-тест отказа записи |
| `importProgress` отклонит собственный снапшот | Снапшот — строго `exportProgress()` (канонический v2, round-trip AC-6 ТЗ-06); unit round-trip + e2e reset→«Вернуть» |
| Новый DOM в шапке ломает селекторы существующих e2e | Только добавление кнопок с уникальными именами; полный двухпроектный прогон до push |
| `<dialog>` в старых webview | Ограничение зафиксировано; e2e в обоих Playwright-проектах; fallback не делаем |
| Пользователь импортирует чужой валидный файл и теряет состояние | A4: подтверждение замещения + undo-снапшот перед импортом |
| Расхождение цифр диалога и StatusStrip | Один снапшот `useProgress()` и общий `mistakesFromProgress`; метрика N явно названа «сохранённых ответов» |
| Устаревшие счётчики тестов в feature memory (Codex-флаг) | Обновление точных счётчиков в Evidence Log в том же push, что и тесты |
| Конфликт с параллельными циклами (ТЗ-04 и др.) | Площадь в App.tsx минимальна (шапка+диалоги); порядок «слайсы 1–4 до декомпозиции» из ТЗ-P1 §10 |
