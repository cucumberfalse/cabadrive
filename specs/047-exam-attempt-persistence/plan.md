# Implementation Plan: Стартовый экран экзамена + персист попытки + guard ухода

## Delivery Shape

Один implementation-слайс на Analyst-created handoff: ветка
`claude/047-exam-attempt-persistence`, worktree
`/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/047-exam-attempt-persistence`,
база `origin/main` `ae5f9804676ff5ebd09244927732d160b9ba37b6` (merge PR #211,
слайс 1). FR-B1, FR-A4, FR-A5 неразделимы: guard (A5) требует признака активной
попытки, который существует только когда попытка начата по «Начать» (B1) и
персистится (A4); дробление на несколько PR не снижает риск, а разрывает
инвариант «попытка не гибнет». Прогресс-store
(`src/progressStoreCore.ts`, `src/progressStore.ts`) не изменяется — слайс
потребляет только публичный API (`useProgress`, `dispatchProgress`,
`type StorageLike`, `type ProgressAnswer`).

## Технический дизайн

### Новый модуль: `src/examAttemptStorage.ts`

Отдельный чистый модуль по образцу `src/progressResetSafety.ts` (Принципы
II/VIII): storage-логика и валидация тестируются в `node --test` без браузера;
модуль принимает `StorageLike` (тип уже экспортирует `progressStoreCore`) и не
трогает `window`; store менять запрещено scope-границей ТЗ-06; App/ExamView
остаются тонкой прослойкой. Экспортируемый контракт (точные сигнатуры —
Implementation Agent может уточнить, не меняя семантику):

```ts
import type { StorageLike } from "./progressStoreCore";
import type { ProgressAnswer } from "./data/content";

export const EXAM_ATTEMPT_KEY = "cabadrive.exam-attempt.v1";

export type ExamAttemptSnapshot = {
  version: 1;
  questionIds: string[];
  answers: ProgressAnswer[];
  startedAt: number; // ms epoch
  deadline: number;  // ms epoch = startedAt + timeLimitMinutes * 60_000
};

// Best effort — try/catch, false when storage unavailable/quota (no throw).
export function saveExamAttempt(storage: StorageLike, snapshot: ExamAttemptSnapshot): boolean;
// try/catch → null on read/parse/validation failure; validates via parseExamAttempt.
export function readExamAttempt(
  storage: StorageLike,
  opts: { now: number; validQuestionIds: ReadonlySet<string> },
): ExamAttemptSnapshot | null;
export function clearExamAttempt(storage: StorageLike): void; // best effort

// PURE — no storage, unit-tested directly. Rejects (→ null): null/non-JSON raw,
// version !== 1, questionIds not unique non-empty strings, any id ∉ validQuestionIds,
// answers not valid ProgressAnswer[], answers.length > questionIds.length,
// startedAt/deadline not finite numbers, deadline <= now (expired).
export function parseExamAttempt(
  raw: string | null,
  opts: { now: number; validQuestionIds: ReadonlySet<string> },
): ExamAttemptSnapshot | null;

// PURE — remaining whole seconds, floored at 0. Used by timer tick and resume prompt.
export function remainingSeconds(deadline: number, now: number): number; // max(0, ceil((deadline-now)/1000))
```

`ProgressAnswer`-валидация переиспользует форму из `progressStoreCore`
(поля `questionId`, `selectedAnswerId`, `isCorrect`, `answeredAt`, `mode`);
допускается локальный минимальный предикат в модуле (не импортируя приватный
`answer()` store) — строгость: `mode` ∈ {learning, exam, mistakes},
`isCorrect: boolean`, непустые `questionId`/`answeredAt`. Для экзамена
`selectedAnswerId` может быть `""` при пропуске (как в store: exam + isCorrect
false) — предикат это допускает.

### Фазовая модель `ExamView` (перепись `src/App.tsx` ~1095–1221)

Убрать `useMemo`-выбор набора на маунте и немедленный запуск таймера. Ввести
единственное состояние фазы `phase: "idle" | "resumePrompt" | "active" |
"finished"` плюс поля активной попытки:

- `examQuestions: Question[]` (устанавливается на старте/продолжении, не в
  useMemo), `answers: ProgressAnswer[]`, `startedAt: number`, `deadline: number`,
  `now: number` (для тика), `resultScore: number | null`, `finishGuard` (ref).
- `position` не хранится отдельно — выводится как `answers.length`.
- `savedAttempt` (для фазы `"resumePrompt"`): результат `readExamAttempt` на
  маунте.

Инициализация (lazy `useState` / эффект на маунте): вычислить
`validQuestionIds = new Set(data.questions.map((q) => q.id))`; прочитать
`readExamAttempt(storage, { now: Date.now(), validQuestionIds })`. Валидный
непросроченный → `phase = "resumePrompt"`, сохранить снапшот. Иначе
`clearExamAttempt(storage)` (если ключ был битый/просроченный) и
`phase = "idle"`. `storage` — через модульный адаптер `safeLocalStorage()` в
App (см. ниже), передаётся в `ExamView` пропом или используется общий адаптер.

Переходы:

- **start** (кнопка «Начать», из `"idle"`): `examQuestions = selectExamSet(...)`,
  `startedAt = Date.now()`, `deadline = startedAt + timeLimitMinutes*60_000`,
  `answers = []`, `now = startedAt`; `saveExamAttempt(...)`;
  `onAttemptActiveChange(true)`; `phase = "active"`.
- **resume** («Продолжить», из `"resumePrompt"`): `examQuestions =
  savedAttempt.questionIds.map((id) => questionById.get(id)!)` (все разрешимы —
  валидатор гарантировал), `answers = savedAttempt.answers`, `startedAt`/`deadline`
  из снапшота, `now = Date.now()`; `onAttemptActiveChange(true)`;
  `phase = "active"`. Повторный персист не обязателен (снапшот уже актуален).
- **decline** («Отменить», из `"resumePrompt"`): `clearExamAttempt(...)`;
  `onAttemptActiveChange(false)`; `phase = "idle"`.
- **record** (ответ/пропуск, из `"active"`): `next = [...answers, answer]`;
  `saveExamAttempt({ version: 1, questionIds: examQuestions.map(q => q.id),
  answers: next, startedAt, deadline })`; если `next.length >=
  examQuestions.length` → `finish(next)`, иначе `setAnswers(next)`.
  `skipCurrent` без изменений семантики вызывает `record`.
- **timer tick** (эффект только в `"active"`): `setInterval(1000)` →
  `setNow(Date.now())`; в рендере `remaining = remainingSeconds(deadline, now)`;
  отдельный эффект/проверка: если `remaining <= 0 && !finishGuard.current` →
  `finish(answers)`. Финиш выполняется вне апдейтера `setState` (устранение
  ТЗ-11); интервал очищается в cleanup и на финише.
- **finish** (из `"active"`): `finishGuard`; `dispatchProgress({ type:
  "finishExam", answers, attempt })` (attempt-объект без изменений);
  `clearExamAttempt(...)`; `onAttemptActiveChange(false)`; `resultScore`;
  `phase = "finished"`.

`ExamView` получает пропы: `onAttemptActiveChange: (active: boolean) => void` и
`storage: StorageLike | undefined` (адаптер из App; при `undefined` персист/чтение
no-op → чистый in-memory экзамен). Держать `ExamView` владельцем попытки; App
знает лишь булев `examAttemptActive`.

### UI новых фаз

- **Стартовый экран** (`"idle"`): секция `.workspace` (класс `exam-start`,
  переиспользует визуал `result-panel`) — заголовок, список формата из
  `data.examFormat` (без литералов), кнопка «Начать» (`.tool-button`).
- **Resume-предложение** (`"resumePrompt"`): секция `.workspace` (класс
  `exam-resume`, визуал в духе `.progress-notice`) — текст «Продолжить попытку
  (осталось MM:SS)» где MM:SS = `formatDuration(remainingSeconds(deadline,
  Date.now()))`, кнопки «Продолжить» / «Отменить». Решение: resume-UI живёт
  ВНУТРИ `ExamView`, а не в App header-notice слоте — тот слот принадлежит
  прогресс-flow слайса 1 (`ProgressNotice` union), и связывать экзамен с ним
  создало бы лишнюю связанность (Simplicity). Guard-диалог FR-A5 — единственный
  экзаменационный UI, живущий в App (нужен на уровне навигации).
- **Active** (`"active"`) и **Finished** (`"finished"`): существующая разметка
  `exam-bar` + `QuestionCard` и `result-panel`, с таймером из `remaining`.

### Точки интеграции в `App` (`src/App.tsx` ~5043–5453)

Все правки локализованы в корневом `App` (навигация + один эффект + один
диалог) и в `ExamView`; другие вью не затрагиваются.

1. Адаптер `safeLocalStorage(): StorageLike | undefined` рядом с существующим
   `safeSessionStorage()` (~5025): `try { window.localStorage } catch {
   undefined }`. Единственная точка доступа к `localStorage` в App для
   экзамен-ключа; строковый ключ — только внутри `examAttemptStorage.ts`.
2. Состояние: `examAttemptActive` (`useState<boolean>`, lazy-init из
   `readExamAttempt(safeLocalStorage(), { now: Date.now(), validQuestionIds })
   !== null`), `pendingLeaveView` (`useState<View | undefined>`).
3. `guardedSelectView(nextView: View)`: если `view === "exam" &&
   examAttemptActive && nextView !== "exam"` → `setPendingLeaveView(nextView)`;
   иначе `selectView(nextView)`. Все top-nav кнопки (~5378–5430) вызывают
   `guardedSelectView` вместо `selectView` (guard срабатывает только при уходе с
   активного экзамена — для остальных вкладок поведение неизменно).
4. Guard-`ConfirmDialog` (третий вызов `ConfirmDialog` в корневом JSX, рядом с
   reset/import диалогами ~5329–5373): `open={pendingLeaveView !== undefined}`,
   `title="Прервать экзамен?"`, тело «Попытка сохранена — вы сможете продолжить
   её позже.», `confirmLabel="Выйти"`, `cancelLabel="Остаться"`; `onConfirm` →
   `selectView(pendingLeaveView!); setPendingLeaveView(undefined);` `onCancel` →
   `setPendingLeaveView(undefined)`. Без `danger` (выход не деструктивен —
   попытка сохранена).
5. `beforeunload`-эффект: `useEffect(() => { if (!examAttemptActive) return;
   const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
   window.addEventListener("beforeunload", handler); return () =>
   window.removeEventListener("beforeunload", handler); }, [examAttemptActive])`.
6. `<ExamView onAttemptActiveChange={setExamAttemptActive}
   storage={safeLocalStorage()} />` (~5434). `selectExamSet`, `formatDuration`,
   `questionById`, `data.examFormat`, `ProgressAnswer` уже импортированы/в
   области видимости.

### Ключи и строки

- localStorage: `cabadrive.exam-attempt.v1` — единственный новый ключ;
  неймспейс совпадает с существующими `cabadrive.*`.
- Пользовательские строки — русские, в стиле приложения; точные формулировки
  spec.md — default, Implementation Agent может уточнить типографику без
  изменения семантики, но строки, на которые завязаны e2e (напр. «Начать»,
  «Продолжить попытку», «осталось», «Выйти»/«Остаться»), фиксирует в тех же
  тестах.

### Стили (`src/styles.css`)

- `.exam-start` — карточка старта на паттерне `.result-panel`/`.workspace`;
  кнопка «Начать» по `.tool-button` (≥42 px, `:focus-visible`).
- `.exam-resume` — панель предложения продолжить в духе `.progress-notice`
  (рамка, действия в ряд), кнопки `.tool-button`.
- Guard-диалог переиспользует существующий `dialog.confirm-dialog` /
  `.confirm-dialog-inner` / `.confirm-dialog-actions` без изменений компонента.

### Совместимость с существующими e2e (NFR-1) — обязательная миграция

Существующие тесты кликают вкладку «Экзамен» и сразу ждут таймер/вопрос; под
FR-B1 вход изменился. Затронуты **три** места (перепроверить номера строк на
HEAD):

- `tests/e2e/app.spec.ts:1273` «exam mode hides translation and explanation
  during active attempt and stores score» — после `click(Экзамен)` добавить
  `click("Начать")` перед `expect(45:00)`; проверки скрытия перевода/пояснения,
  «Пропустить», «2 / 40», финального экрана сохранить.
- `tests/e2e/app.spec.ts:1300` «exam timeout persists exactly one completed
  attempt» — часы устанавливаются до `goto` (сохранить порядок), после
  `click(Экзамен)` добавить `click("Начать")` перед `expect("45:00")` и
  `runFor(45 мин)`; проверка ровно одной завершённой попытки сохранена.
- `tests/e2e/app.spec.ts` ~`:6194` (клик экзамена внутри более крупного теста,
  ожидающего `/45:00|44:59/`) — добавить `click("Начать")` перед ожиданием
  таймера. Перепроверить точную строку grep’ом `getByRole("button", { name:
  /Экзамен/ })`.

Пинненный «Руководства»-hash e2e и селекторы шапки/StatusStrip не затрагиваются;
новые кнопки/секции имеют уникальные имена. Обязательный прогон обоих проектов
(Desktop Chromium + Pixel 7) до push.

## Последовательность реализации

1. Подтвердить ветку/worktree/базу; сохранить незакоммиченные
   `specs/047-…` и артефакты Architect; не трогать чужие worktree. Перепроверить
   номера строк App.tsx/e2e на HEAD (A9).
2. Test-first (Принцип III): написать падающие unit-тесты
   `tests/exam-attempt.test.mjs` (транспиляция `src/examAttemptStorage.ts` в
   память по образцу `tests/progress-reset-safety.test.mjs`; FakeStorage с
   fault-injection) на `parseExamAttempt` (валид/все негативы),
   `remainingSeconds`, `save/read/clear`, `EXAM_ATTEMPT_KEY`.
3. Реализовать `src/examAttemptStorage.ts`; довести unit-тесты до зелёного.
4. Переписать `ExamView` (фазовая модель, персист, resume, старт, таймер из
   deadline) и интегрировать App (`safeLocalStorage`, `examAttemptActive`,
   `guardedSelectView`, guard-`ConfirmDialog`, `beforeunload`), стили.
5. Мигрировать 3 существующих экзаменационных e2e; добавить новые e2e (AC-2
   resume, стартовый экран, guard, отмена продолжения, beforeunload-регистрация,
   негатив с засеянным битым/просроченным ключом).
6. Обновить `docs_project/screens/learning-and-exam-flows.md` (Exam Simulation
   Flow) и feature memory; обновить точные счётчики тестов в Evidence Log.
7. Полный локальный гейт и `preflight`; commit/push/PR — только по назначению
   Implementation Agent; без merge.

## Verification Matrix

| Граница | Команда/свидетельство | Условие прохождения |
|---|---|---|
| Персист/валидатор попытки | `node --test tests/exam-attempt.test.mjs` | `parseExamAttempt` принимает валидный, отбрасывает null/не-JSON/version/unknown-id/дубли/битые answers/нечисловые/просроченные; `remainingSeconds` floor-at-0/ceil; `save/read/clear` с fault-injection → false/null без throw; test-first падение до модуля зафиксировано |
| Store не задет | `git diff --stat src/progressStoreCore.ts src/progressStore.ts` пуст | Контракт ТЗ-06 не изменён |
| Границы хранилищ | `rg -n "cabadrive.exam-attempt" src/`; `rg -n "localStorage" src/` | Строковый ключ — только в `examAttemptStorage.ts`; `localStorage` в App — только адаптер `safeLocalStorage` + store-граница |
| Полный Node-набор | `pnpm run test` | Все файлы зелёные; точное число (базис/после) в Evidence Log |
| Типы/линт | `pnpm run quality:fast` | typecheck + ESLint (`--max-warnings 0`) зелёные |
| Форматирование | `pnpm run format:check` | Prettier по allowlist (`src/**` вкл. `.css`, `tests/**`, e2e) зелёный |
| Сборка | `pnpm run build:app` | Бандл собирается; новых зависимостей нет (`git diff --stat package.json` пуст) |
| E2E | `pnpm run test:e2e` | 3 мигрированных + новые сценарии зелёные в обоих проектах; точные счётчики (базис 120 → после) в Evidence Log |
| Репозиторный гейт | `pnpm run preflight` перед каждым push | Полная матрица зелёная на кандидат-head |
| Diff/процесс | `git diff --check`, scoped diff, tasks-evidence | Нет whitespace/scope-проблем; decisions/dead ends/feedback актуальны |

## Review And Finalization Gates

- Review Agent (AI Review/Codex — gate по exact head SHA) проверяет диф:
  таймер до «Начать» не идёт; `deadline` абсолютный и остаток считается из
  него; персист при старте и каждом ответе; ключ очищается на finish и на
  отмену продолжения; валидатор отбрасывает битые/просроченные/чужие попытки;
  guard перехватывает уход и не теряет прогресс; `beforeunload` навешан только
  при активной попытке; границы хранилищ; отсутствие правок store; 3
  мигрированных e2e не ослаблены; соответствие feature memory — inline-threads
  без правок кода.
- Feedback Implementation Agent получает Architect-диспозицию до merge; cycle PR
  set ведёт Orchestrator (squash-only ruleset).
- Финальная Architect-валидация → финальная Analyst-валидация на одном effective
  content head; post-validation non-evidence изменения делают валидации stale.

## Риски и меры

| Риск | Мера |
|---|---|
| Стартовый экран ломает существующие экзаменационные e2e (`:1273`, `:1300`, ~`:6194`), кликающие вкладку и сразу ждущие таймер | Миграция: шаг «Начать» перед ожиданием таймера/вопроса, проверки сохранены; обязательный двухпроектный прогон до push |
| Восстановление остатка из «замороженного» remaining вместо `deadline` даёт неверный отсчёт после reload | `deadline` абсолютный в схеме; тик считает `remainingSeconds(deadline, now)`; unit на `remainingSeconds` + e2e reload-round-trip с `page.clock` |
| localStorage недоступен (private mode/квота) — падение при персисте | `try/catch` в модуле (`saveExamAttempt` → false); `ExamView` получает `storage` = undefined → in-memory; unit fault-injection; e2e-негатив |
| Битая/просроченная/чужая сохранённая попытка восстанавливается в сломанное состояние | Строгий чистый `parseExamAttempt` с отбрасыванием и очисткой ключа; unit по каждому негативу + e2e с засеянным ключом |
| `beforeunload` ненадёжен в мобильных браузерах | Основная гарантия — персист FR-A4; `beforeunload` заявлен дополнением (ТЗ-P1 §10); e2e проверяет только факт регистрации/`defaultPrevented` |
| Guard не покрывает все точки ухода (back/forward) | Централизация в `guardedSelectView` для top-nav; `popstate`/`hashchange` осознанно не перехвачены — персист FR-A4 сохраняет попытку, resume на возврате; ограничение задокументировано |
| Инвариант `position = answers.length` нарушится при будущих правках skip/record | Зафиксировано в Decisions; skip идёт через `record`; при изменении логики — вернуть явный `position` в схему |
| Конфликт с параллельной декомпозицией App.tsx (ТЗ-04) и другими P1-циклами | Площадь в App минимальна (ExamView + один эффект + guard в навигации + один диалог); порядок «слайсы 1–4 до декомпозиции» из ТЗ-P1 §10 |
