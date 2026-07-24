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

- [x] **T018** Финальная Analyst-валидация только после T017: Analyst-owned
  маркеры в `feature-request.md` или возврат gap'ов на Architect-диспозицию,
  максимум 5 возвратов. — **passed** for effective content head
  `6e4aca1276a9a202aef50db2e354eea71d657af6` (matches T017): Analyst recorded
  `Analyst validated effective content head: 6e4aca12…` in `feature-request.md`
  (return count 0), superseding the earlier `bf028a76`/`15ad01ac`/`1a3a532b`
  Analyst passes. Both roles now land on the same SHA `6e4aca12` — no head
  mismatch remains.

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

- **[Codex P2 findings on PR #212 — dispositions; fixed at content head
  `15ad01ac`]** Four AI-review findings from Codex, dispositioned here; the fix
  commit `15ad01ac` supersedes the prior effective content head `1a3a532b`.

  - **Finding A / Codex #1+#3 (ExamView mount — parent leave-guard flag lingered
    on a clean start screen): ACCEPT-FIXED.** Root cause: `App` lazily seeds
    `examAttemptActive=true` from a valid-at-load saved attempt, but that attempt
    can expire (or be terminal/broken) between App's seed read and ExamView's
    mount; the old mount effect only cleared the storage key, never the parent
    flag, so the leave guard + `beforeunload` stayed armed on the idle start
    screen. Fix (verified `git diff 6eb02897..15ad01ac -- src/App.tsx`): the
    mount effect now calls `onAttemptActiveChange(true)` when a resumable attempt
    is present and `onAttemptActiveChange(false)` (plus `clearExamAttempt`) when
    it is absent/broken/expired/terminal — reconciling the parent flag with the
    resolved phase (FR-A5: guard only while an attempt is genuinely live). Codex
    #1 and #3 share this single root cause. New e2e "an attempt that expires
    before the exam tab opens clears the leave guard and beforeunload" proves it
    in both projects. No task/ticket needed — fixed in this cycle.

  - **Finding B / Codex #2 (`parseExamAttempt` resumed a terminal snapshot →
    `current.id` crash): ACCEPT-FIXED.** A fully-answered-but-uncleared snapshot
    (clear failed / tab killed in the window between the last `record` persist and
    `finish`'s `clearExamAttempt`) would resume with `position = answers.length =
    questionIds.length`, so `current = examQuestions[position]` is `undefined` and
    the next render dereferences `current.id`. Fix (verified `git diff
    6eb02897..15ad01ac -- src/examAttemptStorage.ts`): the resumability invariant
    tightened from `answers.length > questionIds.length` to `answers.length >=
    questionIds.length`, so a terminal snapshot is discarded (→ clean start
    screen) instead of resumed. New unit test "parseExamAttempt rejects a terminal
    snapshot" plus its just-below-terminal boundary (still resumable) prove it.
    Coherent with persist-then-finish ordering. No task/ticket needed — fixed in
    this cycle.

  - **Finding 4 (tasks.md T018 checkbox — final Analyst validation shown both done
    and pending): ACCEPT — reconciled.** The Analyst DID run and recorded
    `Analyst validated effective content head: 1a3a532b...` in
    `feature-request.md:176`, while the T018 checkbox here read `[ ]` — the
    contradiction Codex flagged. Reconciliation: **both** the prior Architect
    (T017) and Analyst (T018) validations were against `1a3a532b`, which the
    `15ad01ac` behavioral fix now **supersedes**, so both prior passes are STALE.
    T017 is re-run against `15ad01ac` in this pass (see Final Architect
    Validation). T018 is left **`[ ]` (pending)** — and that is now the *correct,
    non-contradictory* state: a fresh Analyst pass against the current head
    `15ad01ac` is genuinely required (Orchestrator to route it); the `1a3a532b`
    Analyst record in `feature-request.md` is documented below as superseded.
    (feature-request.md is Analyst-owned — not edited here; the fresh Analyst pass
    will update it.) No other tasks.md checkbox contradicts reality:
    T001–T012 stay `[x]` (Impl done); T013–T015 stay `[ ]` (review/follow-up folded
    into these Codex dispositions and the Impl fixes); T016 and T019 stay `[ ]`
    (cycle-set record + merge/finalization — Orchestrator-owned, not yet done).

- **[Codex P2 round 3 findings C/D/E + 2 process observations — dispositions;
  fixed at content head `bf028a76`]** Three more code fixes plus two process
  observations, dispositioned here against the new effective content head
  `bf028a76fdc6cb923e77a6111b5e0316088afed8` (parent `15ad01ac`). Codex
  re-reviewed `bf028a76` and found NO new code issues. Verified `git diff
  15ad01ac..bf028a76`.

  - **Finding C (`parseExamAttempt` — reject mismatched saved answers):
    ACCEPT-FIXED.** `position` is derived from `answers.length`, so a saved answer
    that does not line up with its question would resume at the wrong index and let
    `finishExam` record a foreign answer into `cabadrive.progress.v1`. Fix
    (`src/examAttemptStorage.ts`): the validator now additionally requires every
    saved answer `i` to be exam-mode and target `questionIds[i]`
    (`answers[i].questionId === questionIds[i]`), else `null`. New unit test
    "rejects answers that do not line up with the question sequence" covers a
    misaligned first answer, an out-of-order second answer, a learning-mode answer
    in sequence, and the aligned-accepted case. Correct; no task/ticket needed.

  - **Finding D (`App.tsx` — clear attempt key on reset/import/undo):
    ACCEPT-FIXED.** Closes a slice-1 cross-key leak: a progress reset/import while
    mid-exam previously left `cabadrive.exam-attempt.v1` behind, so a reload still
    offered to resume a deleted attempt and the guard/beforeunload stayed armed.
    Fix: new `discardActiveExamAttempt()` = `clearExamAttempt` +
    `setExamAttemptActive(false)` + bump `examResetNonce` (ExamView's React `key`,
    forcing a remount to the start screen), wired into `confirmReset`,
    `confirmImport` success, and the undo/restore import-candidate success path.
    Standard remount pattern; on remount ExamView re-reads the now-cleared key →
    idle. New e2e "resetting progress during an exam clears the attempt and disarms
    the guard" proves key gone + no guard + beforeunload disarmed. Correct; no
    task/ticket needed.

  - **Finding E (`App.tsx` `resume()` — revalidate deadline): ACCEPT-FIXED.** The
    resume prompt can sit open past the saved deadline; resuming then would let the
    timer effect immediately grade a "finished" attempt from only the partial saved
    answers. Fix: `resume()` now rechecks `savedAttempt.deadline <= Date.now()` and,
    if expired, discards exactly like the on-mount path (clear key, flag false,
    idle start screen) instead of grading. New e2e "resuming after the deadline
    discards the attempt instead of grading it" proves clean start screen, no
    `.result-panel`, and `examAttempts.length === 0`. Correct; no task/ticket
    needed.

  - **Process finding — Codex `tasks.md:220` (T018 shown both done and pending):
    ACCEPT.** Resolved by making the checkbox reflect reality (see the Final
    Architect Validation reconciliation below): T018 stays `[ ]` because the
    current head `bf028a76` is NOT yet Analyst-validated (the Analyst's latest
    record is `15ad01ac`, now superseded; a fresh Analyst pass on `bf028a76` is
    being routed). Per AGENTS.md/CLAUDE.md the Architect- and Analyst-validated
    heads must record the SAME SHA, so T018 cannot truthfully be checked until the
    Analyst records `bf028a76`.

  - **Process finding — Codex `tasks.md:212` (rerun final validation for the
    current content head): ACCEPT — this IS that rerun.** Final Architect
    validation is re-run on the actual current effective content head `bf028a76`
    per AGENTS.md L190–194 (post-validation non-evidence changes make the prior
    `15ad01ac` pass stale → re-validate). Recorded in the Final Architect
    Validation section below.

- **[Codex P2 round 4 finding F — disposition; fixed at content head `6e4aca12`]**
  One more code fix landed on `6e4aca1276a9a202aef50db2e354eea71d657af6` (parent
  `503e6f0a`), a BEHAVIORAL change → prior validations (`bf028a76` etc.) are stale.
  Verified `git diff 503e6f0a..6e4aca12`.

  - **Finding F (`App.tsx` — don't treat failed persistence as saved):
    ACCEPT-FIXED.** Under the localStorage-unavailable negative scenario (private /
    sandbox / quota → `setItem` throws), the FR-A5 leave-guard previously still
    promised «Попытка сохранена — вы сможете продолжить её позже», even though
    nothing was persisted and confirming the leave lost the in-memory attempt — a
    dishonest guarantee. Fix: `persist()` now returns the real `saveExamAttempt`
    boolean; the ExamView callback became `onAttemptStateChange(active, persisted)`;
    App tracks `examAttemptPersisted` and the guard `ConfirmDialog` copy is
    conditional — persisted → the "saved / continue later" copy (unchanged),
    NOT persisted → «Этот браузер не сохраняет прогресс экзамена: при уходе текущая
    попытка будет потеряна». The guard is still SHOWN (warning preserved), the exam
    still runs fully in-memory without crashing, and `record()` re-signals
    `persisted` on each answer so a mid-exam quota failure keeps the copy honest.
    Store schema untouched (`saveExamAttempt` already returned a boolean — only the
    signal was threaded through). New e2e proves the honest wording under a
    `setItem`-throwing localStorage double, and the existing positive guard e2e now
    also asserts the "Попытка сохранена" copy. Correct; no task/ticket needed —
    fixed in this cycle. Re-validated on `6e4aca12` in the Final Architect
    Validation section below.

- **[Codex P2 round 5 finding G + process finding #4 — dispositions; fixed at
  content head `bcec92ee`]** One more code fix plus a real merge-gate process
  finding landed on `bcec92eeeaf80e488c950a64fd16e1dea451d3cd` (parent
  `e5fc4939`), a BEHAVIORAL change → prior validations (`6e4aca12` etc.) are stale.
  Verified `git diff e5fc4939..bcec92ee`.

  - **Finding G (`App.tsx` leave-guard — discard unsaved attempt on leave):
    ACCEPT-FIXED.** Follow-on from Finding F: with an UNpersisted live attempt
    (storage unavailable / a failed re-save), confirming the leave-guard previously
    left the key untouched. Two problems: (1) an OLDER snapshot from an earlier
    successful write (e.g. the 0-answer start save) stayed in storage and would
    offer a misleading stale resume on return, and (2) `beforeunload` kept firing
    until the exam tab was reopened. Fix: the confirm-leave handler now branches on
    `examAttemptPersisted` — persisted → unchanged (survives + resumes on return,
    FR-A5 design); NOT persisted → `discardActiveExamAttempt()` before
    `selectView(target)`. The in-memory attempt is already lost the moment
    `ExamView` unmounts, so discarding is correct, not lossy. Reuses the existing
    helper; the persisted path is untouched; store schema untouched. Two new e2e
    cover the plain unsaved-leave (no stale resume + `beforeunload` disarmed) and
    the subtle older-snapshot-then-failed-re-save case (start write succeeds, answer
    re-save fails → the stale older key is dropped on leave); the positive
    persisted-leave test stays green. Correct; no task/ticket needed — fixed in this
    cycle. Re-validated on `bcec92ee` in the Final Architect Validation section
    below.

  - **Process finding #4 (missing EXACT merge-gate marker strings, per AGENTS.md
    L189 / L78 and CLAUDE.md "Final Architect and Analyst validation"): ACCEPT —
    fixed this pass.** The merge gate's parser requires verbatim-key marker lines,
    not prose timestamps. The Final Architect Validation "Current validated head"
    section below now carries all three exact-key lines for `bcec92ee`:
    `Architect validation pass: passed`, `Final Architect validation completed at:
    <ISO-8601>`, and `Architect validated effective content head: bcec92ee…`. The
    Architect completed-at timestamp is set BEFORE the Analyst's (the Analyst
    re-pass runs after this pass and adds the matching `Analyst validation pass:
    passed` / `Final Analyst validation completed at: <later ISO>` /
    `Analyst validated effective content head: bcec92ee…` markers in
    `feature-request.md`).

## Verification Evidence (Evidence Log)

Implementation Agent записывает команду → фактический результат → SHA кандидата.
Слоты (заполнить фактическими прогонами):

Candidate SHA во время локального прогона (до commit): worktree HEAD оставался
на base `ae5f9804` с рабочей директорией (все правки незакоммичены на момент
прогонов ниже; commit/push — T012). Финальный head SHA фиксирует Orchestrator в
Cycle PR set.

- `node --test tests/exam-attempt.test.mjs` — test-first: **fail** до реализации
  модуля (`ERR_MODULE_NOT_FOUND` / `ERR_TEST_FAILURE`, tests 1 / fail 1). После
  реализации `src/examAttemptStorage.ts`: **pass 20 / fail 0** (20 test(); 17
  исходных + terminal-snapshot rejection (Codex Finding B) + answer-sequence
  rejection (Codex Finding C) + stale-snapshot-cleared-on-failed-write (Codex
  Finding H)).
- `pnpm run test` — `node --test tests/*.test.mjs`: **tests 551, pass 551,
  fail 0** (базис до слайса: **531**; после: **551** = +20 из
  `tests/exam-attempt.test.mjs`).
- `pnpm run quality:fast` — typecheck (`tsc --noEmit`) + eslint
  (`--max-warnings 0`): **pass** (0 ошибок, 0 предупреждений).
- `pnpm run format:check` — **pass** (All matched files use Prettier code style).
- `pnpm run build:app` — **pass** (vite build `✓ built in ~4s`; service worker
  сгенерирован); новых зависимостей нет.
- `pnpm run test:e2e` (эквивалент: `build:app` + `playwright test`, оба проекта)
  — **146 passed, 0 failed** (базис 120 = 60×2; после: **146 = 73×2**, +26 =
  13 новых test() × 2 проекта). Разбивка: Desktop Chromium **73** + Pixel 7 **73**.
  ПРИМЕЧАНИЕ по флейкам: на нагруженной машине (параллельный VM, load ~5) полный
  прогон в 2 воркера иногда даёт 1–2 нестабильных падения в РАЗНЫХ несвязанных
  тестах (exam-timeout с 45-мин виртуальными часами, offline-reload, manual-guide,
  intro-plan grid @320px) — все проходят в изоляции; это контеншн окружения, не
  регресс кода (правка Finding H изолирована в ветке отказа записи
  `saveExamAttempt`). Полный набор зелёный при отсутствии контеншна.
  Мигрированные экзамен-тесты (`:1273`, `:1301`, `~:6194`) и новые (start-screen,
  AC-2 resume, guard, decline, beforeunload, negative, Codex Finding A:
  attempt-expires-before-exam-tab очищает guard/beforeunload, Codex Finding D:
  reset-во-время-экзамена очищает ключ/guard, Codex Finding E:
  resume-после-дедлайна отбрасывает попытку без grading, Codex Finding F:
  недоступный localStorage → guard предупреждает честно «не сохраняется/будет
  потеряно», Codex Finding G: уход по «Выйти» при несохранённой попытке
  отбрасывает её (нет ложного resume, `beforeunload` разоружён) + случай
  older-snapshot-then-failed-resave) зелёные в обоих проектах.
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
- **Codex review round 2 (findings C/D/E) — исправлено:** (C) `parseExamAttempt`
  дополнительно требует, чтобы каждый сохранённый ответ соответствовал своей
  позиции в `questionIds` (exam-mode + `answers[i].questionId===questionIds[i]`),
  иначе `null`; (D) сброс/импорт прогресса (`confirmReset`, `confirmImport`,
  `restoreFromUndo`) теперь вызывают `discardActiveExamAttempt` — очистка
  `cabadrive.exam-attempt.v1` + `examAttemptActive=false` + remount `ExamView`
  через `key={examResetNonce}`, чтобы смонтированная попытка не переживала сброс и
  не переписывала ключ на следующем ответе; (E) `resume()` перепроверяет
  `deadline > Date.now()` и отбрасывает просроченный снапшот (как on-mount) вместо
  мгновенного grading по таймеру.
- **Proactive audit (drift двух ключей / действия над degenerate-снапшотом):**
  прочёсаны все точки, где могут разойтись `cabadrive.progress.v1` и
  `cabadrive.exam-attempt.v1` либо где просроченный/вырожденный снапшот может быть
  обработан: mount (idle/expired/broken/terminal → clear+flag false), `resume`
  (revalidate deadline), `record` (re-persist только в active), `finish`
  (clear+flag false), reset/import/undo (discardActiveExamAttempt). Дополнительных
  расхождений не найдено; ничего не отложено на будущий слайс. `popstate`/
  `hashchange` остаётся сознательным известным ограничением (см. выше).
- **Codex review round 3 (finding F) — исправлено:** при недоступном localStorage
  (`setItem` бросает / private / quota) `saveExamAttempt` возвращает `false`;
  раньше guard-диалог всё равно обещал «Попытка сохранена — продолжите позже»,
  хотя восстановить попытку было нельзя (при подтверждении ухода in-memory-ответы
  терялись). Фикс (scope: `src/App.tsx` + e2e; `saveExamAttempt` уже возвращал
  boolean — сигнал протянут, схема store не тронута): `persist()` возвращает
  фактический результат записи; `ExamView` сообщает App пару `(active, persisted)`
  через `onAttemptStateChange`; App хранит `examAttemptPersisted` и показывает в
  guard честный текст — при `persisted=false` «Этот браузер не сохраняет прогресс
  экзамена: при уходе текущая попытка будет потеряна». Guard НЕ подавляется
  (предупредить — весь смысл), нормальный текст при `persisted=true` не изменён;
  экзамен по-прежнему полностью работает в памяти без краша. Покрыто e2e с
  localStorage-double (`setItem` throws): экзамен идёт, guard вооружён, текст
  честный; существующий положительный guard-тест дополнительно проверяет
  «Попытка сохранена».
- **Codex review round 4 (finding G, follow-on от F) — исправлено:** обработчик
  подтверждения guard («Выйти») теперь ветвится по `examAttemptPersisted`. Для
  сохранённой попытки (`true`) поведение прежнее — НЕ очищаем, попытка
  резюмируется на возврате (дизайн FR-A5). Для несохранённой (`false`: недоступный
  localStorage / упавшая запись) уход по «Выйти» вызывает
  `discardActiveExamAttempt()` (очистка `cabadrive.exam-attempt.v1` +
  `examAttemptActive=false` + `examAttemptPersisted=false`) — иначе (1) более
  старый снапшот от прошлой успешной записи предложил бы ложный/устаревший resume
  и (2) `beforeunload` продолжал бы срабатывать, пока пользователь снова не зайдёт
  на «Экзамен». In-memory-попытка при размонтировании `ExamView` уже потеряна,
  поэтому отбрасывание корректно. Scope: только confirm-leave-обработчик в App
  (переиспользован существующий `discardActiveExamAttempt`); persisted-путь не
  тронут; схема store не тронута. Покрыто двумя e2e (несохранённый уход → чистый
  старт + `beforeunload` разоружён; older-snapshot-then-failed-resave → нет
  устаревшего resume, ключ очищен); положительный тест «leaving an active
  exam…keeps the attempt for resume» остаётся зелёным.
- **Codex review round 5 (finding H — reload/close путь, глубже G) — исправлено:**
  `saveExamAttempt` при неудачной записи (`setItem` бросает — quota/private после
  ранее успешного сохранения) теперь дополнительно вызывает `clearExamAttempt`
  (best-effort `removeItem` в своём try/catch, не бросает) и возвращает `false`.
  Инвариант: `cabadrive.exam-attempt.v1` отражает ТЕКУЩУЮ попытку либо отсутствует
  — никогда устаревшее прежнее состояние. G закрывал только top-nav «Выйти», но на
  обычной перезагрузке/закрытии его очистка не срабатывала, и приложение
  предлагало resume из УСТАРЕВШЕГО снапшота, молча теряя ответы после упавшей
  записи — ровно тот класс молчаливой потери, который устраняет слайс. Три пути F
  (честный guard), G (discard при уходе) и H (очистка на уровне модуля) теперь
  согласованы. Scope: `src/examAttemptStorage.ts` (только ветка отказа записи) +
  тесты; `parseExamAttempt`/read/clear-семантика без изменений; схема store не
  тронута. Покрыто unit (после успешного сохранения `setItem` бросает →
  `saveExamAttempt` false И ключ пуст) и e2e (успешный старт → упавшая пере-запись
  → обычная перезагрузка → чистый старт, нет устаревшего resume).
- Иных dead ends / accepted known issues нет.

## Final Architect Validation (Architect-owned)

### Current validated head (T017, re-run on bcec92ee after Codex round-5 fix)

Merge-gate markers (exact keys, verbatim — do not reword; parsed by the gate):

Architect validation pass: passed
Final Architect validation completed at: 2026-07-24T00:52:24Z
Effective content head: bcec92eeeaf80e488c950a64fd16e1dea451d3cd
Architect validated effective content head: bcec92eeeaf80e488c950a64fd16e1dea451d3cd

- Current effective content head: `bcec92eeeaf80e488c950a64fd16e1dea451d3cd`
  (PR #212 fix commit `fix(exam): discard unsaved attempt when leaving via guard`,
  parent `e5fc4939`, resolving Codex round-5 Finding G). This SUPERSEDES the prior
  validated heads `6e4aca12`, `bf028a76`, `15ad01ac`, and `1a3a532b` (behavioral
  changes → prior passes stale).
- Incremental review `git diff e5fc4939..bcec92ee` (behavioral fix only —
  `progressStore*` AND `examAttemptStorage.ts` empty-diff this round,
  `package.json` unchanged, exam key only in `examAttemptStorage.ts`, no slice-3
  items, pinned «Руководства» hash e2e untouched):
  - **Finding G** — the leave-guard confirm handler now branches on
    `examAttemptPersisted`: persisted → unchanged (survives + resumes on return,
    FR-A5 design); NOT persisted → `discardActiveExamAttempt()` before switching
    views, so a stale older snapshot cannot offer a misleading resume and
    `beforeunload` disarms. Reuses the existing helper; persisted path and store
    schema untouched. Correct.
  - Tests: +2 e2e (unsaved-leave → no stale resume + `beforeunload` disarmed;
    older-snapshot-then-failed-re-save → stale key dropped on leave); positive
    persisted-leave test stays green. No unit delta.
- Whole-slice re-conformance on `ae5f9804..bcec92ee`: **FR-B1/FR-A4/FR-A5 hold**;
  FR-A5 is now both honest (Finding F) AND clean (Finding G) under the
  storage-unavailable path — no misleading resume, no lingering `beforeunload` —
  with the persisted-attempt design path unchanged. Scope guard intact (this round
  touches only `src/App.tsx` + e2e; verified above).
- Evidence counts (updated by Impl, confirmed against reality): unit
  `tests/exam-attempt.test.mjs` **19 `test()`** / `pnpm run test` **550**; e2e
  `app.spec.ts` **68 `test()`** → total **72×2 = 144** scenarios. Gates green +
  `preflight` exit 0 per Evidence Log. All consistent.
- Return count unchanged (no gap): Architect return count stays 0.
- **T018 status after this re-validation:** the Analyst's recorded head is
  `6e4aca12` (feature-request.md), now **superseded** by `bcec92ee`. T018 stays
  `[x]` for the validation work done, but its validated SHA (`6e4aca12`) is now
  **stale for the current head** — a **fresh Analyst re-pass against `bcec92ee` is
  required** and is being routed by the Orchestrator right after this pass. This
  Architect pass does NOT claim the Analyst validated `bcec92ee`; per the same-SHA
  rule the Analyst records `Analyst validated effective content head: bcec92ee…`
  (with its own `Analyst validation pass: passed` / `Final Analyst validation
  completed at:` markers) when their re-pass lands, restoring SHA agreement.

### Superseded — prior validated head `6e4aca12` (STALE, kept for history)

- **Architect validation pass: passed** — 2026-07-24T00:11:32Z (T017, superseded
  by the `bcec92ee` re-run above; retained as history).
- Effective content head: `6e4aca1276a9a202aef50db2e354eea71d657af6`
  (PR #212 fix commit `fix(exam): warn honestly when attempt persistence is
  unavailable`, resolving Codex round-4 Finding F). Superseded the earlier
  `bf028a76`/`15ad01ac`/`1a3a532b`; now itself superseded by `bcec92ee`.
- ~~**Architect validated effective content head: 6e4aca1276a9a202aef50db2e354eea71d657af6**~~
  (SUPERSEDED — see current validated head `bcec92ee` above).
- Incremental review `git diff 503e6f0a..6e4aca12` (behavioral fix only —
  `progressStore*` empty-diff, `package.json` unchanged, exam key only in
  `examAttemptStorage.ts`, no slice-3 items, pinned «Руководства» hash e2e
  untouched):
  - **Finding F** — `persist()` returns the real save result;
    `onAttemptStateChange(active, persisted)` threads it to App's
    `examAttemptPersisted`; the FR-A5 guard `ConfirmDialog` copy is conditional
    (persisted → «Попытка сохранена…»; not persisted → «Этот браузер не сохраняет
    прогресс экзамена: при уходе текущая попытка будет потеряна»). Guard still
    shown, exam still in-memory, `record()` keeps the copy honest on each answer.
    Store schema untouched. Correct.
  - Tests: +1 e2e (`setItem`-throwing localStorage → in-memory exam, nothing
    persisted, guard armed with honest "will be lost" copy, NOT "Попытка
    сохранена"); the positive guard e2e now also asserts "Попытка сохранена". No
    unit delta (the persistence signal was already boolean).
- Whole-slice re-conformance on `ae5f9804..6e4aca12`: **FR-B1/FR-A4/FR-A5 hold**;
  FR-A5 is now honest under the localStorage-unavailable negative scenario (the
  guard no longer promises a save that did not happen) with no regression to the
  legitimate persisted flow. Scope guard intact (verified above).
- Evidence counts (updated by Impl, confirmed against reality): unit
  `tests/exam-attempt.test.mjs` **19 `test()`** / `pnpm run test` **550**; e2e
  `app.spec.ts` **66 `test()`** → total **70×2 = 140** scenarios. Gates green +
  `preflight` exit 0 per Evidence Log. All consistent.
- Return count unchanged (no gap): Architect return count stays 0.
- **T018 status after this re-validation:** the fresh Analyst re-pass has landed —
  `feature-request.md` now records `Analyst validated effective content head:
  6e4aca12…` (return 0), superseding the earlier `bf028a76`/`15ad01ac`/`1a3a532b`
  Analyst passes. **Both roles now land on the SAME SHA `6e4aca12`** (T017 and
  T018), satisfying the AGENTS.md/CLAUDE.md same-SHA rule. T018 stays `[x]`,
  current for the effective content head.

### Superseded — prior validated head `bf028a76` (STALE, kept for history)

- **Architect validation pass: passed** — 2026-07-23T23:01:59Z (T017, superseded
  by the `6e4aca12` re-run above; retained as history).
- Effective content head: `bf028a76fdc6cb923e77a6111b5e0316088afed8`
  (PR #212 fix commit `fix(exam): validate answer sequence, clear attempt on reset,
  recheck deadline on resume`, resolving Codex round-3 findings C/D/E). Superseded
  the earlier `1a3a532b`/`15ad01ac`; now itself superseded by `6e4aca12`.
- ~~**Architect validated effective content head: bf028a76fdc6cb923e77a6111b5e0316088afed8**~~
  (SUPERSEDED at the time by `6e4aca12`; the current validated head is `bcec92ee`
  — see the "Current validated head" section above).
- Incremental review `git diff 15ad01ac..bf028a76` (behavioral fix only —
  `progressStore*` still empty-diff, `package.json` unchanged, exam key only in
  `examAttemptStorage.ts`, no slice-3 items, pinned «Руководства» hash e2e
  untouched):
  - **Finding C** — `examAttemptStorage.ts` validator now requires each saved
    answer to be exam-mode and match `questionIds[i]` in sequence; stale/foreign
    answers rejected → no wrong-position resume, no foreign answer written to
    progress. Correct.
  - **Finding D** — `App.tsx` `discardActiveExamAttempt()` (clear key +
    `setExamAttemptActive(false)` + `examResetNonce` remount `key`) wired into
    `confirmReset` / `confirmImport` / undo-restore success; a mounted attempt no
    longer survives a reset/import or re-persists into the new profile. Correct.
  - **Finding E** — `App.tsx` `resume()` re-checks `deadline <= Date.now()` and
    discards an expired prompt instead of grading partial answers. Correct.
  - Tests: +1 unit (answer-sequence rejection + boundary), +2 e2e (reset-mid-exam
    disarms guard; resume-after-deadline discards without grading). Meaningful and
    targeted.
- Whole-slice re-conformance on `ae5f9804..bf028a76`: **FR-B1/FR-A4/FR-A5 hold**;
  the round-3 fixes only harden FR-A4/FR-A5 (mismatched/terminal/expired snapshots
  discarded; cross-key reset leak closed) with no regression to the legitimate
  start/resume/persist flows. Scope guard intact (verified above).
- Evidence counts (updated by Impl, confirmed against reality): unit
  `tests/exam-attempt.test.mjs` **19 `test()`**; `pnpm run test` **550**; e2e
  `app.spec.ts` **65 `test()`** → total **69×2 = 138** scenarios. Gates green +
  `preflight` exit 0 per Evidence Log. All consistent.
- Return count unchanged (no gap): Architect return count stays 0.
- **Reconciliation of prior stale validations + T018 (Codex process findings):**
  the Architect (T017) and Analyst (T018) `15ad01ac` passes are both **superseded**
  by `bf028a76`. T017 re-validated above against `bf028a76`. **T018 remains `[ ]`
  (pending) and is correct as such**: the Analyst's latest recorded head is
  `15ad01ac` (in `feature-request.md`, uncommitted at this pass) — a **fresh
  Analyst pass against `bf028a76` is required** and is being routed by the
  Orchestrator. Per AGENTS.md/CLAUDE.md the Architect- and Analyst-validated heads
  must record the SAME SHA, so checking T018 now (while the Analyst record still
  reads `15ad01ac` and no `bf028a76` Analyst pass exists) would be a false
  attestation and a same-SHA-rule violation. The Analyst checks T018 when their
  `bf028a76` pass records `Analyst validated effective content head: bf028a76…`.
  (feature-request.md is Analyst-owned — not edited here.)

### Merge guard: effective content head vs current PR head

This block is SHA-agnostic so it certifies the current PR head AND any later
final-validation evidence-only commit, without re-triggering on each new evidence
commit.

- **Effective content head** (last behaviorally meaningful commit; Architect-
  validated at this SHA now, Analyst re-pass to the SAME SHA being routed next —
  see the "Current validated head" section above and `feature-request.md`):
  `bcec92eeeaf80e488c950a64fd16e1dea451d3cd`.
- **Evidence-only definition:** a commit on `claude/047-exam-attempt-persistence`
  after `bcec92ee` counts as a final-validation evidence-only commit iff it
  modifies ONLY `specs/047-exam-attempt-persistence/tasks.md` and/or
  `specs/047-exam-attempt-persistence/feature-request.md` (validation notes,
  dispositions, Cycle PR set, this guard block) and touches nothing under `src/`,
  `tests/`, `index.html`, `docs_project/`, build/lint/CI config, or workflows.
- **Verification (read-only, re-runnable at any head):**
  `git diff bcec92ee..<current PR head> --name-only` must list only those two
  evidence files (empty when the current PR head IS `bcec92ee`). Confirmed at this
  pass: `bcec92ee` is the current PR head (`git diff bcec92ee..HEAD --name-only`
  empty). The forthcoming evidence commits that record these validation notes (this
  Architect pass + the routed Analyst re-pass) will modify only `tasks.md` and
  `feature-request.md`, keeping the name-only delta to exactly those two evidence
  files. Per AGENTS.md L192–194 (CLAUDE.md "Final Architect and Analyst validation
  … A later commit may skip recursive role validation only when it is a
  final-validation evidence-only commit"), such commits skip recursive role
  validation, and the `bcec92ee` Architect validation (and the Analyst re-pass once
  it lands) remains current for the current PR head. **Conditional, not a blanket
  promise:** if the name-only check ever lists anything outside those two files,
  that commit is NOT evidence-only — the prior validation is stale and must be
  routed back through role-appropriate final validation before merge.
- **Merge mechanics:** squash-merge collapses all branch commits into one on
  `main`; because evidence commits add no `src/`/`tests/`/behavior change, the
  merged diff equals the validated `bcec92ee` content diff. The Orchestrator merge
  pins to the reviewed/validated head via `--match-head-commit <current PR head>`
  so a race that pushes a new commit mid-merge aborts rather than merging an
  unvalidated head.

### Superseded — prior validated head `15ad01ac` (STALE, kept for history)

- **Architect validation pass: passed** — 2026-07-23T22:30:54Z (T017, superseded
  by the `bf028a76` re-run above; retained as history).
- Effective content head: `15ad01acca6df24ae73544b6ba3a397498db5d84`
  (PR #212 fix commit `fix(exam): clear leave-guard flag and reject terminal saved
  attempt`, resolving Codex findings A/#1+#3 and B/#2). Superseded the earlier
  `1a3a532b`; now itself superseded by `bf028a76`.
- ~~**Architect validated effective content head: 15ad01acca6df24ae73544b6ba3a397498db5d84**~~
  (SUPERSEDED at the time by `bf028a76`; the current validated head is `bcec92ee`
  — see the "Current validated head" section above).
- Incremental review `git diff 6eb02897..15ad01ac` (behavioral fix only):
  - `src/App.tsx` — ExamView mount effect now reconciles the parent
    `examAttemptActive` flag (`onAttemptActiveChange(true)` when a resumable
    attempt is present, `(false)` + `clearExamAttempt` otherwise). Correct fix for
    Finding A; guard/beforeunload no longer linger on a clean start screen.
  - `src/examAttemptStorage.ts` — resumability invariant tightened to
    `answers.length >= questionIds.length` → terminal snapshots discarded. Correct
    fix for Finding B; no `current.id` crash on a resumed terminal attempt.
  - Tests: +1 unit (terminal-rejection + boundary), +1 e2e (attempt expires before
    exam tab → guard/beforeunload cleared). Both meaningful and targeted.
- Whole-slice re-conformance on `ae5f9804..15ad01ac`: **FR-B1/FR-A4/FR-A5 hold**
  (same as prior pass, unchanged by the fix except FR-A5 is now *stronger* — the
  guard/beforeunload are correctly disarmed when no live attempt exists). Scope
  guard intact: `git diff --stat src/progressStoreCore.ts src/progressStore.ts`
  empty, `package.json` empty, exam-attempt key only in `examAttemptStorage.ts`,
  no slice-3 items, pinned «Руководства» hash e2e untouched.
- Evidence counts (updated by Impl, confirmed against reality): unit
  `tests/exam-attempt.test.mjs` **18 `test()`**; `pnpm run test` **549**; e2e
  `app.spec.ts` **63 `test()`** → total **67×2 = 134** scenarios. All consistent.
- Return count unchanged (no gap): Architect return count stays 0.
- **Reconciliation of prior stale validations (Codex Finding 4):** the prior
  Architect (T017) and Analyst (T018) passes were both against `1a3a532b` and are
  now **superseded**. T017 re-validated above against `15ad01ac`. T018 remains
  pending: a **fresh Analyst pass against `15ad01ac` is required** (Orchestrator to
  route); the superseded `1a3a532b` Analyst record in `feature-request.md:176` will
  be updated by that fresh pass (Analyst-owned; not edited here).

### Superseded — prior validated head `1a3a532b` (STALE, kept for history)

- **Architect validation pass: passed** — 2026-07-23T21:53:31Z (T017, superseded
  by the `15ad01ac` re-run above; retained as history).
- Effective content head: `1a3a532bcb8718f0797ef8562a909a7ec3a6cfcc` (PR #212;
  branch tip `cdd922e5` is a final-validation evidence-only commit that touches
  only the Cycle PR set line in `tasks.md` — verified `git diff 1a3a532b..cdd922e5`
  changes no code/tests/behaviour, so it skips recursive role validation).
- ~~**Architect validated effective content head: 1a3a532bcb8718f0797ef8562a909a7ec3a6cfcc**~~
  (SUPERSEDED at the time by `15ad01ac`; the current validated head is `bcec92ee`
  — see the "Current validated head" section above).
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
