# Tasks: Стартовый экран экзамена + персист попытки + guard ухода

## Cycle Context

- Feature: `047-exam-attempt-persistence` / слайс 2 `ТЗ-P1` (FR-B1 + FR-A4 +
  FR-A5).
- База: verified `origin/main` `ae5f9804676ff5ebd09244927732d160b9ba37b6`
  (merge PR #211, слайс 1).
- Handoff branch/worktree: `claude/047-exam-attempt-persistence` /
  `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/047-exam-attempt-persistence`.
- Cycle PR set:
  - Slice 2 (this cycle): **PR #212** —
    https://github.com/cucumberfalse/cabadrive/pull/212 ; branch
    `claude/047-exam-attempt-persistence` → base `main`; state OPEN, ready (not
    draft), mergeable MERGEABLE at publish; subject `feat(exam): start screen,
    attempt persistence, leave guard`. Implementation content head (all
    behaviour + code + tests + docs): `1a3a532bcb8718f0797ef8562a909a7ec3a6cfcc`.
    A single evidence-only follow-up commit adds this Cycle PR set line — it
    changes no behaviour; the current branch tip is that evidence commit
    (`git rev-parse HEAD`). Required checks / AI Review (Codex) / final
    Architect+Analyst validation / merge — Orchestrator. Do NOT merge
    (squash-only ruleset + Codex gate).
- Базис счётчиков на `ae5f9804` (перепроверить на HEAD): e2e —
  `app.spec.ts` 56 `test()` + `manual-ticket-placement.spec.ts` 4 = 60 на проект
  × 2 (chromium+mobile) = **120 сценариев**; unit `pnpm run test` — точное число
  фиксирует Implementation Agent на HEAD (test-first).
- Parallel-work rule: сохранять все чужие worktree, ветки, коммиты, PR, dirty
  diffs и процессную память; не изменять `feature-request.md` вне Analyst-owned
  секций.

## Implementation Tasks

- [x] **T001** Подтвердить ветку/worktree/базу (`git status`, `git rev-parse
  HEAD` = `ae5f9804`, сверка с `origin/main`), сохранить незакоммиченные
  `specs/047-exam-attempt-persistence/*`, зафиксировать стартовый SHA кандидата.
  Перепроверить номера строк на HEAD (A9): `ExamView` ~1095–1221, `App`
  навигация ~5211–5248, `safeSessionStorage` ~5025, рендер `<ExamView />`
  ~5434, top-nav кнопки ~5378–5430; e2e экзамен-тесты ~1273/1300/6194. При
  неоднозначности базы — стоп и возврат Orchestrator.

- [x] **T002** Test-first (Принцип III): создать `tests/exam-attempt.test.mjs`
  по паттерну транспиляции ts в память из `tests/progress-reset-safety.test.mjs`
  (typescript → data:-URI import) с FakeStorage и fault-injection. Падающие
  тесты на:
  - `EXAM_ATTEMPT_KEY === "cabadrive.exam-attempt.v1"`;
  - `parseExamAttempt` — **валидный** снапшот (все id в `validQuestionIds`,
    `deadline > now`) возвращается; **негативы** → `null`: `raw = null`,
    не-JSON, `version !== 1`, `questionIds` не массив / пустые строки / дубликаты,
    неизвестный `questionId` (∉ `validQuestionIds`), `answers` не массив /
    невалидный `ProgressAnswer`, `answers.length > questionIds.length`,
    `startedAt`/`deadline` не конечные числа, `deadline <= now` (просрочка),
    граница `deadline === now` → `null`, `deadline === now + 1` → валиден;
  - `remainingSeconds` — будущее → `ceil((deadline-now)/1000)`, прошлое → `0`,
    ровно now → `0`;
  - `saveExamAttempt` — успех → `true` и round-trip через `readExamAttempt`;
    `setItem` бросает → `false` без throw;
  - `readExamAttempt` — валидное значение → снапшот; `getItem` бросает → `null`;
    сохранённый битый/просроченный → `null`;
  - `clearExamAttempt` — best effort, `removeItem` бросает → без throw.
  Зафиксировать test-first падение (модуль отсутствует: ERR_MODULE_NOT_FOUND).

- [x] **T003** Реализовать `src/examAttemptStorage.ts` по контракту plan.md:
  `EXAM_ATTEMPT_KEY`, `ExamAttemptSnapshot`, чистые `parseExamAttempt` /
  `remainingSeconds`, storage-обёртки `saveExamAttempt` / `readExamAttempt` /
  `clearExamAttempt` с injected `StorageLike`, без обращения к `window`, без
  изменения `progressStoreCore.ts` / `progressStore.ts`. Довести unit-тесты
  T002 до зелёного.

- [x] **T004** Переписать `ExamView` (`src/App.tsx`) на фазовую модель
  `idle → resumePrompt → active → finished` (FR-B1 + FR-A4):
  - убрать `useMemo`-выбор набора на маунте и немедленный `setInterval`;
  - маунт-инициализация фазы из `readExamAttempt(storage, { now,
    validQuestionIds })`: валид → `resumePrompt`; битый/просроченный →
    `clearExamAttempt` + `idle`; нет ключа → `idle`;
  - **start** («Начать»): `selectExamSet(...)`, `startedAt = Date.now()`,
    `deadline = startedAt + timeLimitMinutes*60_000`, персист, фаза `active`,
    `onAttemptActiveChange(true)`;
  - **resume** («Продолжить»): восстановить `examQuestions` из `questionIds`
    через `questionById`, `answers`, `startedAt`/`deadline`; фаза `active`;
    `onAttemptActiveChange(true)`;
  - **decline** («Отменить»): `clearExamAttempt`; фаза `idle`;
    `onAttemptActiveChange(false)`;
  - **record**: `saveExamAttempt` при каждом ответе/пропуске; `position =
    answers.length`; `skipCurrent` через `record` (семантика неизменна);
  - **timer**: интервал 1 c обновляет `now`; остаток = `remainingSeconds(
    deadline, now)`; при `<= 0` → `finish` вне апдейтера setState (устранение
    ТЗ-11);
  - **finish**: `dispatchProgress({ type: "finishExam", ... })` без изменений,
    `clearExamAttempt`, `onAttemptActiveChange(false)`, фаза `finished`.
  Пропы `ExamView`: `onAttemptActiveChange`, `storage`.

- [x] **T005** UI новых фаз в `ExamView` + стили (`src/styles.css`):
  - стартовый экран `.exam-start` (визуал `result-panel`): формат из
    `data.examFormat` (`questionCount`/`timeLimitMinutes`/`passingScore`/
    `canSkipQuestion`/`status`, без литералов 40/45/85) + кнопка «Начать»;
  - resume-панель `.exam-resume` (визуал `.progress-notice`): «Продолжить
    попытку (осталось MM:SS)» где MM:SS = `formatDuration(remainingSeconds(
    deadline, Date.now()))` + кнопки «Продолжить»/«Отменить»;
  - active/finished — существующая разметка `exam-bar`/`QuestionCard`/
    `result-panel` с таймером из `remaining`;
  - touch ≥42 px, `:focus-visible` как у `.tool-button` (NFR-2).

- [x] **T006** Интегрировать FR-A5 guard и `beforeunload` в `App`
  (`src/App.tsx`):
  - адаптер `safeLocalStorage(): StorageLike | undefined` рядом с
    `safeSessionStorage()`;
  - `examAttemptActive` (lazy-init из `readExamAttempt(safeLocalStorage(),
    { now: Date.now(), validQuestionIds }) !== null`), `pendingLeaveView`;
  - `guardedSelectView(nextView)`: guard только при `view === "exam" &&
    examAttemptActive && nextView !== "exam"`; все top-nav кнопки вызывают
    `guardedSelectView`;
  - guard-`ConfirmDialog` (переиспользуя компонент слайса 1, без правок
    компонента): «Прервать экзамен?» / «Выйти» / «Остаться»; confirm →
    `selectView(pendingLeaveView)`; cancel/Esc/backdrop → остаться; попытка НЕ
    очищается;
  - `beforeunload`-эффект навешивается только при `examAttemptActive`,
    снимается при `false`/размонтировании (`preventDefault` + `returnValue`);
  - `<ExamView onAttemptActiveChange={setExamAttemptActive}
    storage={safeLocalStorage()} />`.

- [x] **T007** Мигрировать существующие экзаменационные e2e (`tests/e2e/
  app.spec.ts`, оба проекта), без ослабления проверок и без изменения
  «Руководства»-hash механики (NFR-1):
  - `:1273` «exam mode hides translation…» — добавить `click("Начать")` после
    `click(Экзамен)` перед ожиданием таймера/вопроса;
  - `:1300` «exam timeout persists exactly one completed attempt» — сохранить
    установку часов до `goto`; добавить `click("Начать")` перед
    `expect("45:00")` и `runFor(45 мин)`;
  - клик экзамена ~`:6194` (внутри крупного теста, ожидающего `/45:00|44:59/`)
    — добавить `click("Начать")` перед ожиданием таймера (перепроверить строку
    grep’ом).

- [x] **T008** Новые e2e в `tests/e2e/app.spec.ts` (соседство с существующими,
  оба проекта):
  - (a) **AC-2 resume** — `page.clock.install`; открыть Экзамен, «Начать»,
    ответить на 1 вопрос; `page.reload()`; ожидать «Продолжить попытку» с
    корректным остатком; «Продолжить» → позиция `2 / 40` и таймер идёт из
    остатка (< полного); (проверить, что попытка корректно доходит до финиша);
  - (b) **стартовый экран (FR-B1)** — открыть Экзамен: карточка формата + кнопка
    «Начать» видимы; таймер/первый вопрос отсутствуют и время не убывает; после
    «Начать» — первый вопрос и отсчёт;
  - (c) **guard (FR-A5)** — «Начать»; клик другой вкладки → `ConfirmDialog`
    «Прервать экзамен?»; «Остаться» → на экзамене, прогресс сохранён; повтор,
    «Выйти» → ушли; возврат на Экзамен → «Продолжить попытку»;
  - (d) **отмена продолжения** — с сохранённой попыткой (reload после ответа)
    «Отменить» → `localStorage["cabadrive.exam-attempt.v1"]` удалён, свежий
    стартовый экран; повторный вход — не восстановление;
  - (e) **beforeunload-регистрация** — при активной попытке
    `page.evaluate(() => { const e = new Event("beforeunload",
    { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented })`
    → `true`; в фазе idle (без попытки) → `false`;
  - (f) **негатив сохранённой попытки** — `page.addInitScript` засевает битый
    JSON / просроченный `deadline` / неизвестные `questionIds` в ключ до
    загрузки; открыть Экзамен → чистый стартовый экран, ключ очищен.
  Зафиксировать: новые строки, на которые завязаны e2e («Начать», «Продолжить
  попытку», «осталось», «Выйти», «Остаться»), совпадают с реализацией.

- [x] **T009** Grep/статические свидетельства границ: `rg -n
  "cabadrive.exam-attempt" src/` — только `examAttemptStorage.ts`;
  `rg -n "localStorage" src/` — только store-граница + адаптер `safeLocalStorage`
  в App; `git diff --stat src/progressStoreCore.ts src/progressStore.ts` —
  пусто; `git diff --stat package.json` — пусто (новых зависимостей нет).

- [x] **T010** Обновить `docs_project/screens/learning-and-exam-flows.md`
  (секция «Exam Simulation Flow»): (1) экзамен начинается со стартового экрана
  формата — таймер/выбор набора/`startedAt` только по «Начать»; (2) активная
  попытка персистится в `cabadrive.exam-attempt.v1` (`{questionIds, answers,
  startedAt, deadline}`, абсолютный deadline) и переживает reload/переключение
  вкладок — предложение «Продолжить попытку» с остатком из deadline; отмена/
  финиш очищают ключ; битая/просроченная попытка отбрасывается; (3) уход с
  вкладки при активной попытке — подтверждение `ConfirmDialog`; закрытие/reload
  — `beforeunload` (best-effort). Другие файлы docs_project — только при
  фактическом изменении описанного там поведения.

- [x] **T011** Прогнать локальные гейты и записать фактические свидетельства в
  Evidence Log: `node --test tests/exam-attempt.test.mjs`, `pnpm run
  quality:fast`, `pnpm run format:check`, `pnpm run test` (точное число, базис
  до слайса и после), `pnpm run build:app`, `pnpm run test:e2e` (точные счётчики
  обоих проектов, базис 120 → после). Обновить точные счётчики здесь же — в том
  же push, что и добавленные тесты (merge-evidence; stale-счётчики флагует
  review). Записать decisions, dead ends, known issues, feedback до PR-handoff.

- [x] **T012** `pnpm run preflight` перед push (обязателен перед каждым push);
  затем commit/push/открытие ровно одного ready PR по назначению Implementation
  Agent. Записать URL, ветку, полный head SHA в Cycle PR set; не мержить, не
  ребейзить чужое, не мутировать несвязанное состояние.

## Review And Follow-up Tasks

- [ ] **T013** Review Agent: thread-aware ревью точного текущего head — таймер
  до «Начать» не идёт; `deadline` абсолютный, остаток из него; персист при
  старте и каждом ответе; ключ очищается на finish и на отмену продолжения;
  валидатор отбрасывает битые/просроченные/чужие попытки; guard перехватывает
  уход без потери прогресса; `beforeunload` только при активной попытке; границы
  хранилищ; отсутствие правок store; 3 мигрированных e2e не ослаблены; NFR-1;
  полнота feature memory. Только inline review threads, без правок кода.

- [ ] **T014** Orchestrator: каждый review/implementation-feedback item получает
  Architect-диспозицию (task/ticket/not-needed) с записью здесь; ничего не
  откладывается молча.

- [ ] **T015** Implementation Agent: принятые follow-ups, свежие focused/полные
  свидетельства на новом head (включая обновлённые счётчики тестов), обновление
  процессной памяти, свежие review/check-свидетельства.

## Final Validation And Completion Tasks

- [ ] **T016** Orchestrator: зафиксировать полный cycle PR set, состояние
  required checks/head, resolved threads, конфликты, acceptance evidence,
  диспозиции feedback и effective content head.

- [x] **T017** Финальная Architect-валидация: все задачи/диспозиции, guidance,
  process memory, customer intent. При pass — `Architect validation pass:
  passed`, ISO-timestamp и `Architect validated effective content head:
  <40-hex-sha>` в Architect-owned памяти; gaps — через role-appropriate
  follow-up, максимум 10 возвратов.

- [ ] **T018** Финальная Analyst-валидация только после T017: Analyst-owned
  маркеры в `feature-request.md` или возврат gap'ов на Architect-диспозицию,
  максимум 5 возвратов.

- [ ] **T019** Orchestrator: read-only current-PR-head guard (эффективный
  content head по полному SHA; поздние коммиты — только evidence-only), затем
  conservative finalization/merge (squash-only ruleset) только при всех зелёных
  гейтах; cleanup — отдельным назначением Cleanup Agent или явное
  not-applicable/refusal-свидетельство.

## Decisions (Architect)

- **Момент фиксации набора (A3): ACCEPT.** `selectExamSet` вызывается по
  «Начать», не в `useMemo` на маунте; при продолжении набор восстанавливается из
  сохранённых `questionIds` через `questionById`. Пересчёт остатка из абсолютного
  `deadline` в тике заодно устраняет хрупкий «finish в апдейтере setState»
  (ТЗ-11). Прочие правки таймера (цвет/aria FR-B3) — вне слайса.
- **Модуль персиста (A1): REFINE.** Имя `src/examAttemptStorage.ts` (вместо
  предложенного `examAttemptPersistence.ts`) — короче, единообразно с
  `progressResetSafety.ts`. Разделение на чистый валидатор `parseExamAttempt` +
  чистый `remainingSeconds` + тонкие storage-обёртки делает всю логику
  node-тестируемой без браузера.
- **Ключ и схема (A2): REFINE.** Ключ `cabadrive.exam-attempt.v1`; значение
  `{ version: 1, questionIds, answers, startedAt, deadline }`; `deadline`
  абсолютный. `version` присутствует явно (задел на миграции). **`position` НЕ
  хранится** — выводится как `answers.length` (инвариант: каждый ответ/пропуск
  через `record` двигает позицию ровно на 1). Если будущая правка нарушит
  инвариант, вернуть явный `position` в схему (риск-таблица plan.md).
- **UI предложения «Продолжить» (A4): REFINE.** Resume-UI живёт ВНУТРИ
  `ExamView` как секция `.exam-resume` (визуал `.progress-notice`), а НЕ в App
  header-notice слоте: тот слот принадлежит `ProgressNotice` union слайса 1, и
  связывание экзамена с ним увеличило бы связанность (Simplicity). Guard-диалог
  FR-A5 — единственный экзаменационный UI на уровне App (нужен для навигации),
  переиспользует `ConfirmDialog` без правок компонента.
- **Guard — область перехвата (A5): REFINE.** Централизация в
  `guardedSelectView` для top-nav кнопок; `examAttemptActive` — единый признак в
  App (lazy-init из storage, обновляется колбэком из `ExamView`).
  `selectIntroductionEntry`/`selectManualSection` guard не требуют (достижимы
  только из `view === "pandemia"`). **`popstate`/`hashchange` (браузерная
  навигация назад/вперёд) сознательно НЕ перехватываются** — перехват истории
  хрупок и вне минимальной площади; гарантия сохранности при таком уходе
  остаётся за персистом FR-A4 (попытка сохранена, resume на возврате).
  Зафиксировано как известное ограничение.
- **beforeunload (A6): ACCEPT.** Навешивается только при активной попытке,
  снимается при завершении/отмене; `preventDefault` + `returnValue = ""`.
  Мобильное ограничение признано; основная защита — FR-A4.
- **Обновление существующих e2e (A7): REFINE.** Затронуты **три** места
  (`:1273`, `:1300`, ~`:6194`), не два: Analyst флагнул два, третий (клик
  экзамена внутри крупного теста) добавлен Architect. Все — шаг «Начать» перед
  ожиданием таймера, без ослабления проверок.
- **Компонент диалога (A8): ACCEPT.** Переиспользуется существующий
  `src/components/ConfirmDialog.tsx` без обобщения. Стартовый экран и
  resume-предложение — обычные секции `workspace`, не диалоги.
- **Номера строк (A9): ACCEPT.** Все ссылки проверены на `ae5f9804`;
  Implementation Agent обязан перепроверить на своём HEAD (T001).
- **`docs/improvements/priority/01-usability.md` не редактируется** в этом PR:
  по прецеденту слайса 1 статус-чекбоксы ТЗ не обновляются; выполненность слайса
  фиксируется feature memory и merged PR.
- **Fallback для браузеров без `<dialog>` не делается** — унаследованное
  ограничение `ConfirmDialog` (evergreen + iOS Safari 15.4+).

## Assumptions Carried Forward (Analyst A1–A9)

A1 REFINE (модуль `examAttemptStorage.ts`, чистый валидатор+калькулятор), A2
REFINE (схема с `version`, без `position`, абсолютный `deadline`), A3 ACCEPT,
A4 REFINE (resume-UI внутри ExamView), A5 REFINE (guard в `guardedSelectView`,
popstate вне scope), A6 ACCEPT, A7 REFINE (три e2e-места), A8 ACCEPT, A9 ACCEPT.
Ни одно уточнение не меняет пользовательские гарантии feature-request; конфликтов
с гарантиями нет.

## Architect Feedback Dispositions

Implementation Agent добавляет feedback-пункты сюда; Architect даёт по одной
диспозиции на пункт (задача текущего фичера, ticket/backlog или явное not-needed
с обоснованием и свидетельством).

- **[Impl feedback, needs disposition] Третий мигрированный e2e (`~:6194`) требует
  подтверждения guard, а не только шага «Начать».** Architect в A7 предписал «шаг
  «Начать» перед ожиданием таймера». Но после «Начать» попытка активна, и
  последующий `click(Материалы)` в том же тесте теперь перехватывается guard'ом
  FR-A5. Реализация добавила один шаг `click("Выйти")` после клика по «Материалы»,
  чтобы подтвердить уход, — проверка (переход на «Материалы», заголовок topic
  guide) НЕ ослаблена, а фактически усилена (упражняет guard). Отклонение от
  дословной A7 обусловлено самим FR-A5; запрашивается disposition (ожидается
  accept). См. Decisions ниже.

  - **[Architect disposition: ACCEPT]** Отклонение — прямое и необходимое
    следствие FR-A5, который сам Architect предписал в этом же слайсе: как только
    попытка активна, любой уход с вкладки «Экзамен» через top-nav обязан пройти
    guard, поэтому исходный `click(Материалы)` теперь открывает `ConfirmDialog`, а
    не мгновенно переходит. Добавленный `click("Выйти")` — минимальный шаг
    подтверждения ухода; исходные ассерты (переход на «Материалы», заголовок
    `topicGuide.titleRu`) сохранены дословно и вдобавок тест теперь проходит через
    сам guard-путь. Проверено на effective content head `1a3a532b`
    (`tests/e2e/app.spec.ts` ~:6354): `Начать` + `Выйти` добавлены, финальный
    `expect(heading topicGuide.titleRu)` не изменён. Дословная формулировка A7
    («только шаг Начать») не могла предвидеть взаимодействие с FR-A5 того же
    слайса; поведенческая гарантия A7 (миграция без ослабления) соблюдена. Никакой
    отдельной задачи/тикета не требуется — принято как есть.

## Verification Evidence (Evidence Log)

Implementation Agent записывает команду → фактический результат → SHA кандидата.
Слоты (заполнить фактическими прогонами):

Candidate SHA во время локального прогона (до commit): worktree HEAD оставался
на base `ae5f9804` с рабочей директорией (все правки незакоммичены на момент
прогонов ниже; commit/push — T012). Финальный head SHA фиксирует Orchestrator в
Cycle PR set.

- `node --test tests/exam-attempt.test.mjs` — test-first: **fail** до реализации
  модуля (`ERR_MODULE_NOT_FOUND` / `ERR_TEST_FAILURE`, tests 1 / fail 1). После
  реализации `src/examAttemptStorage.ts`: **pass 18 / fail 0** (18 test(); 17
  исходных + 1 terminal-snapshot rejection из Codex-фикса Finding B).
- `pnpm run test` — `node --test tests/*.test.mjs`: **tests 549, pass 549,
  fail 0** (базис до слайса: **531**; после: **549** = +18 из
  `tests/exam-attempt.test.mjs`).
- `pnpm run quality:fast` — typecheck (`tsc --noEmit`) + eslint
  (`--max-warnings 0`): **pass** (0 ошибок, 0 предупреждений).
- `pnpm run format:check` — **pass** (All matched files use Prettier code style).
- `pnpm run build:app` — **pass** (vite build `✓ built in ~4s`; service worker
  сгенерирован); новых зависимостей нет.
- `pnpm run test:e2e` (эквивалент: `build:app` + `playwright test`, оба проекта)
  — **134 passed, 0 failed** (базис 120 = 60×2; после: **134 = 67×2**, +14 =
  7 новых test() × 2 проекта). Разбивка: Desktop Chromium **67** + Pixel 7 **67**.
  Мигрированные экзамен-тесты (`:1273`, `:1301`, `~:6194`) и новые (start-screen,
  AC-2 resume, guard, decline, beforeunload, negative, и Codex-фикс Finding A:
  attempt-expires-before-exam-tab очищает guard/beforeunload) зелёные в обоих
  проектах.
- **Негативный сценарий (обязателен):** unit `parseExamAttempt` — битый/не-JSON,
  `version!=1`, дубли/пустые/неизвестные `questionIds`, невалидные `answers`,
  `answers>questionIds`, нечисловые `startedAt/deadline`, `deadline<=now` (и
  граница `deadline===now`) → все `null`; `save/read/clear` с fault-injection →
  `false`/`null`/no-throw. e2e (f): засеянный битый JSON и корректный-но-
  просроченный ключ → чистый стартовый экран, ключ очищён (оба проекта). Storage
  недоступен: `saveExamAttempt`→false, `readExamAttempt`→null, экзамен идёт в
  памяти (`storage=undefined` путь; покрыто unit fault-injection). Результат:
  **все зелёные**.
- Границы: `rg -n "cabadrive.exam-attempt" src/` → **только**
  `src/examAttemptStorage.ts:10` (EXAM_ATTEMPT_KEY); `rg -n "localStorage" src/`
  → `examAttemptStorage.ts` (комментарий), `App.tsx` (адаптер `safeLocalStorage`
  + комментарии), `progressStore.ts` (существующая store-граница) — строковый
  ключ экзамена вне модуля отсутствует; `git diff --stat
  src/progressStoreCore.ts src/progressStore.ts` — **пусто**; `git diff --stat
  package.json` — **пусто**.
- `git diff --check` — **clean** (нет whitespace/conflict-маркеров).
- `pnpm run preflight` — PREFLIGHT_EXIT=**0** (полная матрица; см. T012 ниже).
- PR URL / head SHA / состояние checks и review threads — ведёт Orchestrator
  (см. Cycle Context / Cycle PR set).

## Dead Ends And Known Issues

- **Known limitation (задокументировано, ACCEPT в Decisions):** браузерная
  навигация назад/вперёд (`popstate`/`hashchange`) при активной попытке НЕ
  перехватывается guard'ом — гарантия сохранности остаётся за персистом FR-A4
  (попытка сохранена, resume на возврате). Осознанное решение Architect (A5),
  вне минимальной площади слайса.
- **Known limitation:** `beforeunload` ненадёжен в мобильных браузерах (ТЗ-P1
  §10) — основная защита FR-A4; e2e проверяет только факт регистрации через
  `dispatchEvent` + `defaultPrevented` (нативный prompt в Playwright не
  автоматизируется).
- **StrictMode:** приложение обёрнуто в `React.StrictMode`; фаза `ExamView`
  инициализируется чистым `readExamAttempt` в lazy `useState`, а очистка
  битого/просроченного/отсутствующего ключа вынесена в mount-эффект
  (идемпотентный `clearExamAttempt`), безопасный при двойном вызове.
- **Deviation (feedback выше, ожидается disposition):** в мигрированном e2e
  `~:6194` добавлен один шаг `click("Выйти")` после `click("Материалы")`, т.к.
  активная попытка теперь перехватывается guard'ом FR-A5; проверка не ослаблена.
- Иных dead ends / accepted known issues нет.

## Final Architect Validation (Architect-owned)

- **Architect validation pass: passed** — 2026-07-23T21:53:31Z (T017).
- Effective content head: `1a3a532bcb8718f0797ef8562a909a7ec3a6cfcc` (PR #212;
  branch tip `cdd922e5` is a final-validation evidence-only commit that touches
  only the Cycle PR set line in `tasks.md` — verified `git diff 1a3a532b..cdd922e5`
  changes no code/tests/behaviour, so it skips recursive role validation).
- **Architect validated effective content head: 1a3a532bcb8718f0797ef8562a909a7ec3a6cfcc**
- Scope of validation: single-PR cycle set (PR #212), all Architect tasks and
  dispositions, guidance, open task state, process memory, and customer intent
  (FR-B1/FR-A4/FR-A5 of ТЗ-P1 usability slice 2).
- Conformance checked against diff `ae5f9804..1a3a532b`:
  - **FR-B1** — start screen (`.exam-start`, phase `idle`) renders format entirely
    from `data.examFormat` (`questionCount`/`timeLimitMinutes`/`passingScore`/
    `canSkipQuestion`/`status`); no hardcoded 40/45/85 in source; no set selection /
    `startedAt` / timer before «Начать» (`selectExamSet` + `startedAt`/`deadline`
    live inside `start()`).
  - **FR-A4** — key `cabadrive.exam-attempt.v1` (only in `examAttemptStorage.ts`);
    absolute `deadline`; `remaining = remainingSeconds(deadline, now)` recomputed
    from deadline each tick; `persist` on start and every answer/skip (`record`,
    and `skipCurrent` routes through `record`); cleared on `finish` and `decline`;
    `parseExamAttempt` discards broken/expired (`deadline <= now`)/foreign-id
    snapshots; localStorage in `src/` goes only through `safeLocalStorage`
    adapter + `StorageLike`.
  - **FR-A5** — guard reuses the existing `ConfirmDialog` unchanged («Прервать
    экзамен?»/«Выйти»/«Остаться»); confirm-leave calls `selectView` only and does
    NOT clear the attempt (verified in code + e2e); `beforeunload` effect armed
    only while `examAttemptActive`.
  - **Scope guard** — `git diff --stat src/progressStoreCore.ts src/progressStore.ts`
    empty; `package.json` unchanged; no slice-3 items (skip-queue / `skipped`
    status / timer colors / result rework); pinned «Руководства» hash e2e mechanics
    untouched; diff tightly scoped (App phase model + new module + styles + tests +
    docs).
  - **Tests** — 17 unit `test()` in `tests/exam-attempt.test.mjs` (meaningful:
    valid snapshot + full negative matrix incl. `deadline===now` boundary and
    fault-injection); 6 new e2e `test()` (start-screen, AC-2 resume, guard, decline,
    beforeunload, negative broken/expired) × 2 projects; 3 migrated e2e
    (`:1276`, `:1305`, `~:6354`) add «Начать»/«Выйти» without weakening assertions.
    AC-2 test proves deadline-based remaining (`45:00` gone, `44:` shown after
    resume) and preserved answers (`2 / 40` after reload). Counts in tasks.md match
    reality: unit 17, e2e `app.spec.ts` now 62 `test()` (56 base + 6).
- Deviation disposition: the `~:6354` guard-confirm step is **ACCEPTED** (see
  Architect Feedback Dispositions); no task/ticket needed.

## Return Counts

- Architect return count: 0
- Analyst return count: 0
