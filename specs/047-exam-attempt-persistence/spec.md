# Спецификация: Стартовый экран экзамена + персист активной попытки + guard ухода (ТЗ-P1, слайс 2)

## Goal

Реализовать слайс 2 `ТЗ-P1` (FR-B1 + FR-A4 + FR-A5) одним PR: экзаменационная
попытка перестаёт быть источником молчаливой потери данных. Пользователь
осознанно начинает попытку с экрана формата (до нажатия «Начать» ни таймер, ни
`startedAt`, ни выбор набора вопросов не происходят); начатая попытка переживает
перезагрузку страницы и переключение вкладок и продолжается с корректным
остатком времени и сохранёнными ответами; уход с вкладки экзамена или закрытие
браузера при активной попытке требует явного подтверждения. Ноль сценариев, где
случайный клик, обновление или переключение вкладки безвозвратно уничтожают ход
экзамена (метрика ТЗ-P1 §12: «Сценарии молчаливой потери данных: 3 → 0» —
слайс 1 закрыл `reset`, слайс 2 закрывает `exam-unmount` и `reload`).

Цикл стартует от verified `origin/main`
`ae5f9804676ff5ebd09244927732d160b9ba37b6` (merge PR #211 — слайс 1 ТЗ-P1) в
worktree
`/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/047-exam-attempt-persistence`
на ветке `claude/047-exam-attempt-persistence`. Возможна параллельная работа
других агентов: сохранять все чужие worktree, ветки, dirty diffs, коммиты, PR и
процессную память.

## Scope

### In scope (ровно три ФТ слайса 2)

- **FR-B1 — стартовый экран экзамена.** До старта попытки вкладка «Экзамен»
  показывает секцию-карточку с форматом из `data.examFormat` (число вопросов,
  лимит минут, проходной %, правила пропуска `canSkipQuestion`, пометка
  `status`) и кнопкой «Начать». Выбор набора вопросов (`selectExamSet`),
  фиксация `startedAt` и запуск таймера происходят ТОЛЬКО по нажатию «Начать»,
  а не на маунте `ExamView`. Никаких литералов 40/45/85.
- **FR-A4 — персист активной попытки.** При старте и при каждом ответе/пропуске
  попытка сериализуется в localStorage под ключом `cabadrive.exam-attempt.v1`
  в форме `{ version, questionIds, answers, startedAt, deadline }`, где
  `deadline = startedAt + data.examFormat.timeLimitMinutes*60_000` (абсолютный
  timestamp). При маунте `ExamView` с валидной непросроченной сохранённой
  попыткой показывается предложение «Продолжить попытку (осталось MM:SS)» /
  «Отменить»; остаток пересчитывается из `deadline - now`. Продолжение
  восстанавливает `questionIds`, `answers`, позицию и остаток времени из
  абсолютного `deadline`. «Отменить» и завершение (`finish`) очищают ключ.
  Просроченная (`deadline <= now`) / битая / с неизвестными `questionIds`
  сохранённая попытка отбрасывается с очисткой ключа. Пересчёт остатка из
  `deadline` заодно устраняет хрупкий паттерн «finish внутри апдейтера
  setState» (ТЗ-11).
- **FR-A5 — guard ухода и закрытия.** При активной (начатой, незавершённой)
  попытке уход с вкладки «Экзамен» на другую top-nav вкладку открывает
  `ConfirmDialog` (переиспользуя компонент слайса 1); подтверждение уводит
  (сохранённая попытка остаётся для «Продолжить»), отказ/Esc/backdrop оставляют
  на экзамене. Закрытие/перезагрузка вкладки браузера при активной попытке
  вешает нативное `beforeunload`-предупреждение; при отсутствии активной
  попытки обработчик не навешивается. `beforeunload` — дополнительная страховка
  (в мобильных браузерах ненадёжен, ТЗ-P1 §10); основная гарантия — персист
  FR-A4.
- Новый изолированный модуль персиста `src/examAttemptStorage.ts` с
  `StorageLike`-приёмником, `try/catch` вокруг каждой операции и **чистым
  валидатором/парсером** (`parseExamAttempt`) и **чистым калькулятором остатка**
  (`remainingSeconds`), node-тестируемыми без браузера по образцу
  `src/progressResetSafety.ts` + `tests/progress-reset-safety.test.mjs`.
- Стили новых элементов в `src/styles.css` (карточка старта, панель resume),
  guard-диалог переиспользует существующий `dialog.confirm-dialog`; touch
  ≥42 px, `:focus-visible` как у `.tool-button` (NFR-2).
- Unit-тесты `tests/exam-attempt.test.mjs` (node --test, транспиляция ts в
  память) и e2e-сценарии в `tests/e2e/app.spec.ts` (AC-2 resume, стартовый
  экран, guard, отмена продолжения, негативы) с обновлением затронутых
  существующих экзаменационных тестов под стартовый вход (NFR-1).
- Синхронизация `docs_project/screens/learning-and-exam-flows.md` (секция «Exam
  Simulation Flow»).

### Out of scope

- **FR-B2** (очередь скипов, статус `skipped`, `mistakesFromHistory`),
  **FR-B3** (цвет таймера `--amber`/`--danger`, aria-live, «время истекло»),
  **FR-B4** (переработка экрана результата) — слайс 3. Текущий «Пропустить»
  (`skipCurrent`) и экран результата не переделываются, только адаптируются к
  тому, что попытка теперь стартует по «Начать» и персистится.
- **FR-A6** (персист сессии обучения в sessionStorage) — слайс 5.
- Все требования групп В, Г, Д, Е ТЗ-P1.
- Изменение схемы/логики прогресс-store (`cabadrive.progress.v1`,
  `src/progressStore.ts` / `src/progressStoreCore.ts`), cap/quota/миграций —
  контракт ТЗ-06 не пересматривается; завершённые попытки по-прежнему пишутся
  через `dispatchProgress({ type: "finishExam", ... })`.
- Декомпозиция App.tsx (ТЗ-04), UI-библиотеки, новые runtime-зависимости,
  роутинг вкладок (ТЗ-05 / FR-G*), IndexedDB/бэкенд/синхронизация (ТЗ-15).
- Правки `docs/improvements/**` (статус-чекбоксы ТЗ не обновляются — прецедент
  слайса 1, см. Decisions в `tasks.md`).
- Перехват браузерной навигации назад/вперёд (`popstate`/`hashchange`) —
  сознательно не перехватывается (см. Decisions); гарантия сохранности при
  таком уходе остаётся за персистом FR-A4.

## Поведенческий контракт

### Фазовая модель `ExamView`

`ExamView` моделируется конечным набором фаз (единственное состояние `phase`):

- `"idle"` — стартовый экран (FR-B1). Нет набора вопросов, нет `startedAt`, нет
  интервала-таймера. Показывается карточка формата и кнопка «Начать».
- `"resumePrompt"` — при маунте найдена валидная непросроченная сохранённая
  попытка (FR-A4). Показывается предложение «Продолжить попытку (осталось
  MM:SS)» / «Отменить». Интервал не запущен.
- `"active"` — идёт попытка: рендерятся `exam-bar` (таймер + позиция + статус),
  тулбар «Пропустить» (если `canSkipQuestion`) и `QuestionCard`. Запущен
  интервал 1 c, пересчитывающий остаток из `deadline - now`.
- `"finished"` — экран результата (существующий, не переделывается).

Определение фазы при маунте: прочитать сохранённую попытку через
`readExamAttempt(storage, { now, validQuestionIds })`. Если возвращён валидный
непросроченный снапшот → `"resumePrompt"`. Если снапшот битый/просроченный/с
неизвестными `questionIds` → `clearExamAttempt(storage)` и `"idle"`. Если ключа
нет → `"idle"`.

### FR-B1 — стартовый экран

1. В фазе `"idle"` вкладка «Экзамен» рендерит секцию `.workspace` (в стиле
   `result-panel`) с форматом из `data.examFormat`: `questionCount` вопросов,
   `timeLimitMinutes` минут, проходной балл `passingScore`%, правило пропуска
   (`canSkipQuestion`), пометка `status` (как в существующем `exam-bar`:
   «Формат defined» / «approximate practice»). Никаких хардкодов 40/45/85.
2. До нажатия «Начать»: не вызывается `selectExamSet`, не фиксируется
   `startedAt`, не создаётся `window.setInterval`. Значение времени на экране не
   отображается и не убывает.
3. Кнопка «Начать» (`.tool-button`, ≥42 px, `:focus-visible`): фиксирует набор
   `selectExamSet(data.questions, data.examFormat.questionCount,
   data.examFormat.questionOrderRule)`, `startedAt = Date.now()`,
   `deadline = startedAt + data.examFormat.timeLimitMinutes*60_000`,
   `answers = []`, персистит попытку (`saveExamAttempt`), уведомляет App об
   активности (`onAttemptActiveChange(true)`) и переводит в `"active"`.

### FR-A4 — персист активной попытки

1. Схема снапшота (localStorage `cabadrive.exam-attempt.v1`):
   `{ version: 1, questionIds: string[], answers: ProgressAnswer[],
   startedAt: number, deadline: number }`. `deadline` — абсолютный ms-timestamp.
   `position` не хранится: он выводится как `answers.length` (каждый
   ответ/пропуск ровно один раз двигает позицию на 1 — инвариант текущего
   `record`).
2. Персист выполняется: при старте (после фиксации набора) и при каждом
   `record` (ответ и пропуск идут через `record`). Запись — best effort в
   `try/catch`: при недоступном/переполненном localStorage экзамен продолжается
   в памяти без падения, просто без гарантии восстановления.
3. При маунте `ExamView` с валидной непросроченной попыткой (фаза
   `"resumePrompt"`) показывается предложение «Продолжить попытку (осталось
   MM:SS)» / «Отменить». MM:SS = `formatDuration(remainingSeconds(deadline,
   Date.now()))`.
4. «Продолжить»: восстанавливает набор вопросов из сохранённых `questionIds`
   (маппинг id → `data.questions` через `questionById`, порядок сохранённый —
   валидатор уже гарантировал разрешимость всех id), `answers`, позицию
   (`= answers.length`), `startedAt`/`deadline`; переводит в `"active"`;
   `onAttemptActiveChange(true)`. Продолженная попытка ведёт себя как
   непрерванная: остаток времени считается из абсолютного `deadline`, финиш по
   таймеру и по последнему ответу работают штатно.
5. «Отменить» (отказ от продолжения): `clearExamAttempt`, фаза → `"idle"`,
   `onAttemptActiveChange(false)`; пользователь видит чистый стартовый экран.
6. Тик таймера (фаза `"active"`): `window.setInterval(1000)` обновляет `now` в
   состоянии; отображаемый остаток = `remainingSeconds(deadline, now)`; когда
   остаток `<= 0` → `finish(answers)` (через `finishGuard`, вне апдейтера
   setState — устранение ТЗ-11).
7. `finish`: `dispatchProgress({ type: "finishExam", answers, attempt })`
   (без изменений), `clearExamAttempt`, `onAttemptActiveChange(false)`, фаза →
   `"finished"`, `resultScore`. Завершённая попытка живёт только как запись
   `examAttempts` в прогресс-store; ключ `cabadrive.exam-attempt.v1` очищен.
8. Валидатор `parseExamAttempt(raw, { now, validQuestionIds })` (чистый)
   отбрасывает (→ `null`): `null`/не-JSON raw; `version !== 1`; `questionIds`
   не массив непустых строк или дубликаты; любой `questionId ∉ validQuestionIds`;
   `answers` не массив валидных `ProgressAnswer`; `answers.length >
   questionIds.length`; `startedAt`/`deadline` не конечные числа;
   `deadline <= now` (просрочка). Валидный снапшот возвращается как есть.

### FR-A5 — guard ухода и закрытия

1. App владеет булевым признаком `examAttemptActive` (единый источник истины
   для guard и `beforeunload`), инициализируемым лениво из
   `readExamAttempt(...)` при монтировании (обёртка `safeLocalStorage` с
   `try/catch`) и обновляемым `ExamView` через проп-колбэк
   `onAttemptActiveChange`: `true` при старте/продолжении, `false` при
   финише/отмене продолжения.
2. Top-nav вкладки вызывают `guardedSelectView(nextView)`: если
   `view === "exam" && examAttemptActive && nextView !== "exam"` — открывается
   guard-`ConfirmDialog` (сохранение `pendingLeaveView`), фактический переход не
   выполняется; иначе — обычный `selectView(nextView)`.
3. Подтверждение guard-диалога («Выйти»): `selectView(pendingLeaveView)`,
   `pendingLeaveView = undefined`. Сохранённая попытка НЕ очищается (остаётся
   для «Продолжить»); `examAttemptActive` остаётся `true`. `ExamView`
   размонтируется; возврат на вкладку «Экзамен» даёт фазу `"resumePrompt"`.
4. Отказ guard-диалога («Остаться»/Esc/backdrop): `pendingLeaveView = undefined`,
   пользователь остаётся на экзамене с сохранённым прогрессом.
5. `beforeunload`: эффект в App навешивает `window.addEventListener(
   "beforeunload", handler)` только при `examAttemptActive === true` и снимает
   его при переходе в `false`/размонтировании; `handler` вызывает
   `event.preventDefault()` и присваивает `event.returnValue = ""` по актуальной
   семантике. При `examAttemptActive === false` обработчик не навешан.
6. `selectIntroductionEntry` / `selectManualSection` не требуют guard: они
   вызываются только из `IntroductionSectionsView` (доступной лишь при
   `view === "pandemia"`), уйти в них из экзамена нельзя. Браузерная навигация
   назад/вперёд (`popstate`/`hashchange`) не перехватывается — гарантия
   сохранности при таком уходе за персистом FR-A4 (документированное
   ограничение, см. Decisions).

### Доступность и совместимость (NFR)

- NFR-1: ни один существующий e2e-сценарий не ломается по существу. Фактический
  базис на `ae5f9804` (`grep -cE "^\s*test\("`): `app.spec.ts` — 56 `test()`,
  `manual-ticket-placement.spec.ts` — 4, итого 60 `test()` на проект = 120
  сценариев в двух проектах Playwright (Desktop Chromium + Pixel 7).
  Существующие экзаменационные тесты, кликающие вкладку «Экзамен» и сразу
  ожидающие вопрос/таймер (`app.spec.ts:1273`, `:1300` и клик экзамена внутри
  теста на ~`:6194`), адаптируются добавлением шага нажатия «Начать» без
  ослабления проверок. Исполнитель фиксирует фактические счётчики на своём HEAD
  в Evidence Log (merge-evidence; stale-счётчики флагует Codex).
- NFR-2: кнопка «Начать», кнопки панели resume — touch ≥42 px и `:focus-visible`
  как у `.tool-button`.
- NFR-3: guard-`ConfirmDialog` — фокус-ловушка, Esc (событие `cancel`),
  автофокус на безопасной кнопке, возврат фокуса на opener (наследуется от
  `src/components/ConfirmDialog.tsx`, без изменения компонента).

## Acceptance Criteria

1. **AC-2 (ТЗ-P1, дословно):** перезагрузка страницы посреди экзамена →
   предложение «Продолжить попытку» с корректным остатком времени (вычислен из
   `deadline`) и сохранёнными ответами; «Продолжить» восстанавливает позицию и
   ответы, попытка корректно финиширует (e2e, детерминированные часы
   `page.clock`).
2. **Стартовый экран (FR-B1):** открытие вкладки «Экзамен» показывает карточку
   формата (значения из `data.examFormat`) и кнопку «Начать»; до нажатия таймер
   не отображается и не убывает, первого вопроса нет; после «Начать» появляется
   первый вопрос и идёт отсчёт (e2e).
3. **Персист и очистка ключа:** после старта в localStorage присутствует
   валидный `cabadrive.exam-attempt.v1` с `deadline = startedAt +
   timeLimitMinutes*60000` и растущим `answers` при ответах; после `finish`
   ключ удалён; после «Отменить» в resume-предложении ключ удалён (e2e/unit).
4. **Guard ухода (FR-A5):** при активной попытке клик по другой вкладке
   открывает `ConfirmDialog`; «Остаться»/Esc оставляют на экзамене с сохранённым
   прогрессом; «Выйти» уводит, а возврат на вкладку «Экзамен» показывает
   «Продолжить попытку» (e2e).
5. **beforeunload (FR-A5):** при активной попытке навешан обработчик
   `beforeunload`, при диспатче события `event.defaultPrevented === true`; при
   отсутствии активной попытки обработчик не навешан (`defaultPrevented ===
   false`) — проверка через `dispatchEvent` + assert в e2e; полноценный нативный
   prompt в Playwright не автоматизируется (зафиксировано).
6. **Отмена продолжения:** «Отменить» в resume-предложении очищает
   `cabadrive.exam-attempt.v1`; повторный вход на вкладку даёт свежий стартовый
   экран, а не восстановление (e2e).
7. **Негативный сценарий (обязателен):** (a) недоступный localStorage —
   персист молча деградирует, экзамен запускается и проходится в памяти без
   исключений; (b) битая/просроченная/с неизвестными `questionIds` сохранённая
   попытка отбрасывается с очисткой ключа, показывается чистый стартовый экран
   (unit на `parseExamAttempt` + e2e с засеянным через `addInitScript` ключом).
8. **Границы хранилищ и store:** активная попытка хранится только под
   `cabadrive.exam-attempt.v1`; схема `cabadrive.progress.v1` не расширяется;
   завершённые попытки по-прежнему идут через `dispatchProgress`;
   `git diff` по `src/progressStoreCore.ts`/`src/progressStore.ts` пуст;
   доступ к `localStorage` по строковому ключу экзамена — только внутри
   `src/examAttemptStorage.ts` и единственного адаптера App (grep-свидетельство).
9. **Гейты зелёные:** существующий e2e-набор зелёный в обоих проектах после
   адаптации; `pnpm run test` (unit, точное число), `pnpm run quality:fast`,
   `pnpm run format:check`, `pnpm run build:app`, `pnpm run test:e2e` (точные
   счётчики обоих проектов), `pnpm run preflight` зелёные; в PR записаны
   фактические свидетельства (AC-9 ТЗ-P1).

## Негативные сценарии (обязательные для feature memory)

- **localStorage недоступен / private mode / квота (главный негативный
  сценарий):** персист попытки деградирует молча (`try/catch` в модуле), экзамен
  полноценно запускается и проходится в памяти; приложение не крашится, ошибка
  не всплывает как сбой.
- **Битая / несовместимой версии сохранённая попытка:** нечитаемый JSON,
  отсутствующие/некорректные поля, неизвестные `questionIds`, дубликаты →
  отбрасывается, ключ очищается, показан чистый стартовый экран.
- **Просроченная попытка (`deadline <= now`):** не предлагается к продолжению,
  отбрасывается с очисткой ключа; никакого продолжения с нулевым/отрицательным
  остатком.
- **Случайный клик по вкладке «Экзамен»** не начинает попытку и не запускает
  таймер (следствие FR-B1) — попытка начинается только по «Начать».
- **Уход с вкладки при активной попытке** не теряет прогресс молча: пользователь
  либо подтверждает уход (попытка остаётся сохранённой), либо остаётся на
  экзамене (FR-A5 + FR-A4).

## Verification Evidence

Implementation Agent записывает в `tasks.md` (Evidence Log) команды, полные
фактические результаты и SHA кандидата для: unit-набора
`node --test tests/exam-attempt.test.mjs` (с test-first падением до реализации
модуля), полного `pnpm run test` (точное число тестов, базис до слайса и после),
`pnpm run quality:fast`, `pnpm run format:check`, `pnpm run build:app`,
`pnpm run test:e2e` (точные счётчики обоих проектов, базис 120 → после слайса),
`pnpm run preflight` перед push, grep-свидетельств границ хранилищ
(`rg -n "cabadrive.exam-attempt" src/`, `rg -n "localStorage" src/`),
`git diff --stat src/progressStoreCore.ts src/progressStore.ts` (пусто),
`git diff --stat package.json` (без новых зависимостей), обновления
`docs_project`, PR-метаданных и cycle PR set. Точные счётчики тестов —
merge-evidence: обновляются в том же push, что и добавленные тесты. Финальные
Architect- и Analyst-валидации применяются к одному effective content head.
