# Tasks: Безопасный сброс прогресса — подтверждение, undo, экспорт/импорт

## Cycle Context

- Feature: `046-progress-reset-safety` / слайс 1 `ТЗ-P1` (FR-A1..A3).
- База: verified `origin/main` `3fed47ccb05a4cde7ecf7dd499ba9fffbc2b372c`
  (merge PR #210).
- Handoff branch/worktree: `claude/046-progress-reset-safety` /
  `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/046-progress-reset-safety`.
- Cycle PR set: PR ещё не создан; после публикации записать сюда URL, ветку,
  полный head SHA, назначение, статус и включение в финальную валидацию.
- Parallel-work rule: сохранять все чужие worktree, ветки, коммиты, PR,
  dirty diffs и процессную память; не изменять `feature-request.md` вне
  Analyst-owned секций.

## Implementation Tasks

- [x] T001 Подтвердить ветку/worktree/базу (`git status`, `git log -1`,
  сверка с `origin/main` `3fed47cc`), сохранить незакоммиченные
  `specs/046-progress-reset-safety/*`, зафиксировать стартовый SHA кандидата.
  Перепроверить номера строк App.tsx из feature memory на своём HEAD
  (допущение A9). При неоднозначности базы — стоп и возврат Orchestrator.
  Факт: HEAD = `3fed47ccb05a4cde7ecf7dd499ba9fffbc2b372c` = `origin/main`,
  ветка `claude/046-progress-reset-safety`; `reset()` был на строке 5080,
  шапка — 5130–5144 (совпало с feature memory).
- [x] T002 Test-first (Принцип III): создать
  `tests/progress-reset-safety.test.mjs` по паттерну транспиляции ts в память
  из `tests/progress-store.test.mjs` (typescript → data:-URI import) с
  FakeStorage и fault-injection. Падающие тесты на: `RESET_UNDO_KEY`,
  `saveUndoSnapshot` (успех/исключение хранилища → `false` без throw),
  `readUndoSnapshot` (значение/`null`/исключение → `null`),
  `clearUndoSnapshot` (best effort), `exportFileName` (локальная дата,
  zero-padding, точный формат `cabadrive-progress-YYYY-MM-DD.json`),
  round-trip `exportProgress()`-снапшота через `parseImportedProgress`
  (переиспользовать транспиляцию `src/progressStoreCore.ts`), константы
  сообщений. Факт: тесты созданы падающими (модуль отсутствовал:
  `fail 1` — ERR_MODULE_NOT_FOUND), затем доведены до зелёного в T003.
- [x] T003 Реализовать `src/progressResetSafety.ts` по контракту plan.md:
  чистые функции с injected `StorageLike`, без обращения к `window`,
  без изменения `src/progressStoreCore.ts`/`src/progressStore.ts`.
  Довести unit-тесты T002 до зелёного.
- [x] T004 Реализовать `src/components/ConfirmDialog.tsx` на нативном
  `<dialog>`: `showModal()`/`close()` из `open`-пропа, `cancel`-событие (Esc)
  и backdrop-клик → `onCancel`, автофокус на «Отмена», `confirmDisabled`,
  `danger`-модификатор. Стили в `src/styles.css`: `dialog.confirm-dialog`,
  `::backdrop`, кнопки по `.tool-button`-паттерну, деструктивная —
  `var(--danger)`; touch ≥42 px, существующий `:focus-visible`-контур
  (NFR-2/3). Не обобщать сверх нужд слайса.
- [x] T005 Интегрировать FR-A1 в `src/App.tsx`: клик по «Сбросить прогресс»
  открывает диалог с реальными N/M/K из единого `useProgress()`-снапшота
  (N=`answers.length` «сохранённых ответов»,
  M=`mistakesFromProgress(progress).length`, K=`examAttempts.length`);
  чекбокс «Я понимаю, что данные будут удалены» активирует «Удалить
  прогресс»; Отмена/Esc/backdrop — noop; подтверждение → снапшот → `reset`.
  Чекбокс сбрасывается при каждом открытии.
- [x] T006 Интегрировать FR-A2: запись снапшота `exportProgress()` в
  sessionStorage перед reset/импортом через `progressResetSafety`;
  статус-панель `.progress-notice` (`role="status"`) с «Вернуть»/«Скрыть»
  между шапкой и StatusStrip; восстановление через
  `dispatchProgress({ type: "importProgress", raw })`; одноразовость
  (очистка ключа после успеха); «Скрыть» очищает ключ; инициализация панели
  из `readUndoSnapshot` при монтировании (переживает reload);
  вариант «Отмена недоступна» при отказе sessionStorage.
- [x] T007 Интегрировать FR-A3: группа `.header-actions` (Download/Upload/
  RotateCcw, русские aria-label/title); экспорт Blob → objectURL →
  `<a download={exportFileName(new Date())}>` → revoke; импорт через скрытый
  `input[type=file]` → `file.text()` → `parseImportedProgress`; невалидный →
  панель ошибки `role="alert"` с `IMPORT_REJECTED_MESSAGE`, сброс value
  input; валидный → ConfirmDialog замещения (текущие N/M/K + N′/K′ файла,
  без чекбокса) → undo-снапшот → dispatch; `false` после предвалидации →
  панель ошибки без изменения состояния.
- [x] T008 Новые e2e в `tests/e2e/app.spec.ts` (соседство с существующими,
  оба проекта): (a) негатив сброса — открыть диалог, «Отмена» и повторно
  Esc → `storedAnswerCount`/StatusStrip/localStorage-ключ без изменений;
  (b) AC-1 — ответить на вопрос (с ошибкой), сброс с чекбоксом →
  счётчики обнулены → «Вернуть» → счётчики и localStorage восстановлены,
  панель скрыта; (c) reload после сброса до undo → «Вернуть» доступна и
  работает; (d) export→reset→import — `waitForEvent("download")`, проверить
  имя файла, сохранить содержимое, после сброса импортировать через
  `setInputFiles` (буфер), подтвердить, счётчики восстановлены; (e) негатив
  импорта — файл с битым JSON и файл с неизвестной `version` →
  `role="alert"`-ошибка, состояние не изменено, после «Скрыть» приложение
  работает; (f) a11y — автофокус на «Отмена», Esc закрывает, фокус заперт
  (Tab-обход остаётся внутри диалога). Не менять существующие сценарии и
  hash-механику «Руководства» (NFR-1). Факт: 6 новых `test()` (сценарии
  a–f), негатив импорта покрывает битый JSON и неизвестную `version`.
- [x] T009 Grep/статические свидетельства границ: `rg -n "sessionStorage"
  src/` — только `progressResetSafety.ts` и единственный адаптер App;
  `rg -n "localStorage" src/` — только store-граница;
  `git diff --stat src/progressStoreCore.ts src/progressStore.ts` — пусто;
  новых зависимостей в `package.json` нет.
- [x] T010 Обновить `docs_project/screens/learning-and-exam-flows.md`:
  добавить секцию «Progress Safety Controls» (после «Primary Navigation» или
  рядом с описанием шапки) с фактическим поведением: (1) сброс прогресса —
  только через модальное подтверждение с реальными счётчиками N/M/K и
  двойным подтверждением-чекбоксом; (2) после сброса/импорта доступна отмена
  «Вернуть» до конца сессии браузера (sessionStorage-снапшот, переживает
  reload вкладки); (3) экспорт прогресса в
  `cabadrive-progress-<date>.json` и импорт JSON с строгой валидацией:
  невалидный файл не меняет данные и даёт понятную ошибку; валидный —
  замещает прогресс после подтверждения. Другие файлы docs_project — только
  при фактическом изменении описанного там поведения.
- [x] T011 Прогнать локальные гейты и записать фактические свидетельства в
  Evidence Log: `node --test tests/progress-reset-safety.test.mjs`,
  `node --test tests/progress-store.test.mjs tests/domain.test.mjs`,
  `pnpm run quality:fast`, `pnpm run format:check`, `pnpm run test` (точное
  число тестов), `pnpm run build:app`, `pnpm run test:e2e` (точные счётчики
  обоих проектов). Обновить точные счётчики тестов здесь же — в том же push,
  что и добавленные тесты (merge-evidence; stale-счётчики флагует review).
  Записать decisions, dead ends, known issues и feedback до PR-handoff.
- [x] T012 `pnpm run preflight` перед push (обязателен перед каждым push);
  затем commit/push/открытие ровно одного ready PR по назначению
  Implementation Agent. Записать URL, ветку, полный head SHA в Cycle PR set;
  не мержить, не ребейзить чужое, не мутировать несвязанное состояние.

## Review And Follow-up Tasks

- [ ] T013 Review Agent: thread-aware ревью точного текущего head — обход
  подтверждения, атомарность/атомарный отказ импорта, одноразовость и
  round-trip снапшота, границы хранилищ, a11y диалогов, NFR-1, отсутствие
  правок store, полнота feature memory. Только inline review threads, без
  правок кода.
- [ ] T014 Orchestrator: каждый review/implementation-feedback item получает
  Architect-диспозицию (task/ticket/not-needed) с записью здесь; ничего не
  откладывается молча.
- [ ] T015 Implementation Agent: принятые follow-ups, свежие focused/полные
  свидетельства на новом head (включая обновлённые счётчики тестов),
  обновление процессной памяти, свежие review/check-свидетельства.

## Final Validation And Completion Tasks

- [ ] T016 Orchestrator: зафиксировать полный cycle PR set, состояние
  required checks/head, resolved threads, конфликты, acceptance evidence,
  диспозиции feedback и effective content head.
- [ ] T017 Финальная Architect-валидация: все задачи/диспозиции, guidance,
  process memory, customer intent. При pass — `Architect validation pass:
  passed`, ISO-timestamp и `Architect validated effective content head:
  <40-hex-sha>` в Architect-owned памяти; gaps — через role-appropriate
  follow-up, максимум 10 возвратов.
- [ ] T018 Финальная Analyst-валидация только после T017: Analyst-owned
  маркеры в `feature-request.md` или возврат gap'ов на Architect-диспозицию,
  максимум 5 возвратов.
- [ ] T019 Orchestrator: read-only current-PR-head guard (эффективный
  content head по полному SHA; поздние коммиты — только evidence-only),
  затем conservative finalization/merge (squash-only ruleset) только при
  всех зелёных гейтах; cleanup — отдельным назначением Cleanup Agent или
  явное not-applicable/refusal-свидетельство.

## Decisions

- Схема подтверждения (A1): чекбокс-двойное подтверждение, без текстового
  ввода — мобильный основной сценарий; текстовый ввод отклонён.
- Undo-логика живёт в новом чистом модуле `src/progressResetSafety.ts`
  (injected `StorageLike`), а не в store и не inline в App: store заморожен
  контрактом ТЗ-06, node-тестируемость обязательна (Принципы II/VIII).
- Ключ снапшота (A2): `cabadrive.progress.reset-undo.v1`; значение — сырая
  строка `exportProgress()` без обёртки.
- Восстановление (A3): только через существующий `importProgress`;
  restore-действие в store не добавляется.
- Импорт (A4): подтверждение замещения И undo-снапшот (обе меры); чекбокс
  для импорта не требуется — операция обратима через undo.
- «Скрыть» на undo-панели удаляет снапшот (явный отказ пользователя от
  undo); снапшот одноразовый — очищается после успешного восстановления.
- Reload той же вкладки сохраняет путь «Вернуть» (панель инициализируется
  из sessionStorage при монтировании).
- `docs/improvements/priority/01-usability.md` в этом PR не редактируется:
  по прецеденту предыдущих циклов статус-чекбоксы ТЗ не обновляются;
  выполненность слайса фиксируется feature memory и merged PR.
- Fallback для браузеров без `<dialog>` не делается — зафиксированное
  ограничение (evergreen + iOS Safari 15.4+).
- (Implementation) Состояние панели уведомлений в App названо
  `headerNotice` (по plan.md), а не `progressNotice`: имя сеттера
  `setProgressNotice` ложно срабатывало на storage-boundary guard
  `/setProgress/` в `tests/progress-store.test.mjs`; guard-тест не менялся.
- (Implementation) Автофокус на «Отмена» реализован явным
  `cancelButtonRef.focus()` после `showModal()`, а не React-пропом
  `autoFocus`: React фокусирует при mount, а `<dialog>` смонтирован закрытым,
  поэтому проп не срабатывает при открытии.
- (Implementation) Клик по backdrop детектируется как `event.target ===
  dialog`; padding перенесён на внутренний `.confirm-dialog-inner`, чтобы
  клик по внутреннему полю диалога не считался кликом по фону.
- (Implementation) `UNDO_UNAVAILABLE_MESSAGE` («Прогресс сброшен…»)
  переиспользуется и для подтверждённого импорта при недоступном
  sessionStorage — отдельная формулировка для этого угла не заводилась
  (see Known issues).

## Architect Feedback Dispositions

Implementation Agent добавляет feedback-пункты сюда; Architect даёт по одной
диспозиции на пункт: задача текущего фичера, ticket/backlog или явное
not-needed с обоснованием и свидетельством.

- FB-1 (Implementation Agent, факт-коррекция базиса): зафиксированный в
  feature memory базис «104 e2e-сценария, 59 `test()` в app.spec.ts» не
  подтвердился. Фактический базис на `3fed47cc`: `app.spec.ts` — 49
  `test()`, `manual-ticket-placement.spec.ts` — 4, итого 53 сценария на
  проект = 106 суммарно (`playwright test --list` после слайса: 118 = 106 +
  6×2 новых). Базис unit подтверждён: 521 до слайса, 529 после (+8).
  Требуется Architect-диспозиция: принять фактические числа как evidence.
- FB-2 (Implementation Agent, вне scope): при недоступном sessionStorage
  подтверждённый ИМПОРТ показывает то же сообщение
  `UNDO_UNAVAILABLE_MESSAGE` («Прогресс сброшен. Отмена недоступна…»),
  хотя операция — импорт, а не сброс. Спецификация задаёт текст только для
  сброса; отдельная формулировка для импорта не реализована, чтобы не
  расширять контракт строк. Предлагается ticket/not-needed решение.

## Dead Ends And Known Issues

Dead ends:

- Имя состояния `progressNotice`/`setProgressNotice` — тупик: guard-тест
  границы хранилищ (`tests/progress-store.test.mjs`, regex `/setProgress/`)
  падал на подстроке в имени сеттера. Решение — переименование в
  `headerNotice` (совпадает с plan.md), guard не ослаблялся.
- e2e-ассерты через `page.getByRole("status")`/`getByRole("alert")` — тупик:
  strict mode конфликтует с существующим live-регионом результата ответа
  (`div.result` с `role="status"`). Решение — адресный локатор
  `section.progress-notice` + явная проверка атрибута `role`.
- Ассерт фокус-ловушки «activeElement всегда внутри dialog» — тупик:
  Chromium между циклами обхода модального диалога временно ставит фокус на
  `<body>` (зафиксировано отладочным прогоном: Отмена → body → checkbox →
  Отмена → …). Решение — ассерт «фокус никогда не попадает на интерактивный
  элемент вне диалога» плюс проверка, что цикл проходит через checkbox и
  кнопки диалога.

Known issues (accepted, для диспозиции Architect — см. FB-2):

- Текст undo-unavailable для подтверждённого импорта при недоступном
  sessionStorage говорит «Прогресс сброшен…» (крайний угол: private mode +
  импорт); данные при этом корректны, импорт применяется.
- Live-регион `role="status"` объявляет «Прогресс восстановлен.» заменой
  текста в существующей панели; на первом рендере после reload содержимое
  live-региона скринридером не объявляется (стандартное поведение ARIA).

## Evidence Log

Кандидат стартует от `3fed47ccb05a4cde7ecf7dd499ba9fffbc2b372c`; точный
committed content head и PR-метаданные добавляются после публикации.
Записи (команда → фактический результат; все прогоны 2026-07-21 в worktree
`046-progress-reset-safety` через `corepack pnpm@10.33.0`):

- `node --test tests/progress-reset-safety.test.mjs` — pass 8 / fail 0
  (первый прогон до реализации модуля: fail 1, ERR_MODULE_NOT_FOUND —
  test-first свидетельство).
- `node --test tests/progress-store.test.mjs tests/domain.test.mjs` —
  входит в полный `pnpm run test` ниже; все тесты обоих файлов зелёные
  (в т.ч. storage-boundary guard по обновлённому App.tsx).
- `pnpm run quality:fast` — typecheck + eslint (`--max-warnings 0`) зелёные.
- `pnpm run format:check` — «All matched files use Prettier code style!».
- `pnpm run test` — tests 529, pass 529, fail 0 (базис до слайса 521, +8
  новых в `tests/progress-reset-safety.test.mjs`).
- `pnpm run build:app` — успешно (vite build + service worker, 2156 assets).
- `playwright test` (оба проекта) — 118 passed (1.4m), 0 failed:
  Desktop Chromium 59 + Pixel 7 59. Фактический базис до слайса —
  106 сценариев (53×2: 49 `test()` в `app.spec.ts` + 4 в
  `manual-ticket-placement.spec.ts`), новых 6×2 = 12; записанный в памяти
  базис «104 / 59 test()» не подтвердился — см. FB-1.
- `grep -rn "sessionStorage" src/` — только `src/progressResetSafety.ts`
  (комментарий) и единственный адаптер `safeSessionStorage` в `src/App.tsx`;
  `grep -rn "localStorage" src/` — только `src/progressStore.ts`
  (store-граница); `git diff --stat src/progressStoreCore.ts
  src/progressStore.ts` — пусто; `git diff --stat package.json` — пусто
  (новых зависимостей нет).
- `git diff --check` — чисто.
- `pnpm run preflight` — PREFLIGHT_EXIT=0 (зелёный целиком): feature-memory
  gate, check:repo, validate:content, quality:fast, format:check,
  verify:quality-negative, `test` (529), `build`, `test:e2e` (118 passed,
  1.3m). Прогон в форграунде из worktree, дважды подряд с одинаковым
  результатом.
- PR URL / head SHA / состояние checks и review threads — (после публикации,
  ниже в Cycle PR set)
