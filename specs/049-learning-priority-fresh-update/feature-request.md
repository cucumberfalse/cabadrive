# Feature Request: Свежая версия сайта и приоритет обучения по показам и ошибкам

## Intake Metadata

- Feature ID: `049-learning-priority-fresh-update`
- Роль intake: Analyst
- Назначенный worktree: `/Users/chap/devel/cabadrive-worktrees/049-learning-priority-fresh-update`
- Назначенная ветка: `codex/049-learning-priority-fresh-update`
- Verified base от Orchestrator: `origin/main` = `c5520b31922c0e45afd96b2e5877136c1848a541`
- Подтверждение базы при intake: локальные `HEAD` и `origin/main` оба равны `c5520b31922c0e45afd96b2e5877136c1848a541`; до записи этого артефакта worktree был чистым.
- Дата intake: 2026-09-16
- Numbering context: максимальный существующий числовой префикс под `specs/` на назначенной базе — `048`; Orchestrator назначил следующий folder `049-learning-priority-fresh-update`.
- Parallel-work warning: параллельные worktree, ветки, коммиты, PR, dirty diffs и process memory могут существовать. Их необходимо сохранять; нельзя перезаписывать, ребейзить, сливать, закрывать, удалять или иначе мутировать sibling work.
- Scope Analyst: создать ровно этот `feature-request.md`. Не создавать `spec.md`, `plan.md`, `tasks.md`; не менять продуктовый код, тесты или durable docs; не коммитить, не push, не открывать PR, не ревьюить и не мержить.

## Исходный запрос пользователя

Пользователь попросил:

1. При обновлении страницы, если код/сайт изменился, использовать обновлённую версию, а не кеш.
2. В разделе «Учить» запоминать, сколько раз показан каждый билет, и в первую очередь показывать билеты с меньшим числом показов. Состояние хранить в браузере и не терять при перезагрузке страницы, перезапуске браузера/сайта и обновлении/deploy проекта.
3. При равном числе показов отдавать приоритет билетам, где ранее была допущена ошибка. Этот дополнительный приоритет сбрасывать, если после последней ошибки пользователь ответил правильно более трёх раз.

Orchestrator передал следующие обязательные трактовки и ограничения:

- offline-возможность остаётся продуктовым контрактом: при отсутствии сети приложение должно перезагружаться из последней успешно установленной локальной версии;
- хранение статистики обучения — browser-local, без backend/cloud, с сохранением при deploy на том же origin;
- «более 3 правильных» трактуется буквально как **4 последовательных правильных ответа по тому же билету после последней ошибки**;
- новая ошибка по билету сбрасывает серию правильных ответов в 0 и снова активирует ошибочный приоритет;
- show count увеличивается при **фактическом появлении карточки билета в «Учить»**, а не при заранее выполненном поиске/сортировке и не на каждый React render;
- React StrictMode и повторные render/effect-циклы не должны дважды учитывать одно фактическое появление;
- при полном равенстве show count и ошибочного приоритета допустим стабильный случайный tie-break на текущую Learn-сессию;
- существующее ожидание случайного порядка при новом открытии «Учить»/refresh сохраняется, если не конфликтует с новыми приоритетами;
- текущая история ответов уже живёт в versioned localStorage progress store v2 с capped retained answers и pruned stats;
- feature `048-service-worker-fetch-correctness` исправил только fetch correctness. Update lifecycle из `docs/improvements/13-service-worker-reliability.md` FR-3 остаётся нереализованным.

## Группировка целей и решение о split

Запрос содержит две технически независимые поверхности:

- свежесть online-обновления и безопасный lifecycle service worker;
- долговечная статистика показов/ответов и порядок билетов в «Учить».

В нормальном потоке их разумно реализовывать и проверять отдельными атомарными PR-слайсами внутри одного work cycle: сбой PWA-update не должен затруднять ревью алгоритма обучения, и наоборот. Analyst не создаёт второй feature folder, потому что Orchestrator явно назначил единый cycle и folder `049-learning-priority-fresh-update` для исходного пользовательского запроса. Architect должен зафиксировать PR-slicing/cycle PR set; объединение в один PR допустимо только при явном обосновании меньшего риска и сохранении отдельных acceptance evidence для обеих поверхностей.

## Контекст продукта и прочитанная память

Analyst прочитал обязательную память в заданном порядке:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`

Релевантный durable-контекст:

- Cabadrive — статический local-first React/Vite SPA/PWA без runtime backend.
- Offline study после сборки — текущий продуктовый контракт, а не необязательная оптимизация.
- Пользовательский прогресс хранится в versioned localStorage payload. Текущая v2-модель ограничивает retained history 5 000 ответами, сохраняет pruned mistake aggregates, имеет строгие import/export и recovery semantics.
- Компоненты не должны писать browser storage напрямую: именованные progress actions проходят через store boundary.
- Default «Учить» уже содержит все 460 билетов текущего `unofficial_b_fallback`, перемешивает их при новом открытии/refresh и сохраняет порядок внутри активной Learn-сессии.
- Поиск в «Учить» сужает активную коллекцию; таймер, выбор ответа, navigation и rerender не должны самопроизвольно перемешивать коллекцию.
- Current bank остаётся неофициальным fallback-набором; новая приоритизация не меняет источник/статус контента.

## Проверенные локальные факты

Факты проверены read-only на base `c5520b31922c0e45afd96b2e5877136c1848a541` (номера строк могут измениться; Implementation Agent обязан перепроверить на своём HEAD):

### «Учить» и порядок вопросов

- `src/App.tsx` `LearnView` создаёт `sessionQuestions` один раз на mount через `useState(() => shuffleQuestions(data.questions))`.
- Без активного поиска Learn использует этот session-stable shuffled list; с поиском — `searchQuestions(normalizedQuery)`.
- Индекс сбрасывается на 0 при изменении query. Previous/Next работают по текущему `results`.
- `QuestionCard` keyed by `question.id`; ответ записывается именованным action `dispatchProgress({ type: "recordAnswer", answer })`.
- В текущем коде нет отдельного durable show count и нет алгоритма Learn-order по числу показов/активной прошлой ошибке.
- `src/domain.ts` содержит чистый `shuffleQuestions`; `tests/domain.test.mjs` проверяет полноту, отсутствие mutation и deterministic random streams.
- `tests/e2e/app.spec.ts` проверяет `1 / 460`, session-stable order, новый random order на новом page/opening, сохранение порядка после search clear и текущие Learn timer/answer/navigation flows.
- `LearnView` условно монтируется только при `view === "learn"`; уход в другой раздел и возврат создают новое открытие Learn.

### Progress store

- `src/progressStoreCore.ts` хранит canonical key `cabadrive.progress.v1`, но payload имеет явный `version: 2` и поля `answers`, `difficultQuestionIds`, `examAttempts`, `prunedAnswerStats`.
- `ProgressAnswer` сохраняет `questionId`, выбранный ответ, correctness, timestamp и mode (`learning`, `exam`, `mistakes`). Exam skip валидируется как неправильный ответ с пустым `selectedAnswerId`.
- `ANSWER_LIMIT = 5000`; удаляемый chronological prefix сворачивается в `prunedAnswerStats`, которые сохраняют cumulative `wrong`, `lastPrunedAnswer` и stable `firstSeenOrder`, но **не сохраняют show count или точное число последовательных правильных ответов после последней ошибки**.
- Store имеет единый reducer/dispatch path, automatic persistence, strict v2 import/export, v1 migration, quota recovery и reset; `useProgress()` построен на `useSyncExternalStore`.
- Текущий reset очищает весь progress payload и backup/recovery keys. Export/import round-trip canonical v2 уже доступен в UI.
- Из-за cap нельзя полагаться только на retained `answers` для пожизненной ошибочной серии: нужное состояние должно переживать pruning независимо от полного журнала ответов.

### Service worker и update lifecycle

- Production build запускает `vite build`, затем `scripts/generate-service-worker.mjs`; итоговый `dist/sw.js` получает build-specific cache name `cabadrive-static-<timestamp>` и precache asset list.
- `src/main.tsx` регистрирует `/sw.js` после `load`, но только с молча проглоченным registration failure. Нет `onupdatefound`, `controllerchange`, update UI или периодического `registration.update()`.
- Генерируемый SW сейчас cache-first для GET; install безусловно вызывает `self.skipWaiting()`, activate удаляет остальные caches и вызывает `clients.claim()`.
- Feature `048-service-worker-fetch-correctness` уже добавил правильное различие navigation/subresource при network failure и `ignoreSearch` для navigation. Он явно оставил FR-3 update lifecycle вне scope.
- `docs/improvements/13-service-worker-reliability.md` фиксирует известный риск: безусловный activation/cache cleanup может сломать старую открытую вкладку, которая запрашивает прежний lazy chunk; update UI отсутствует.
- Nginx уже отдаёт `/sw.js` с `Cache-Control: no-cache`, поэтому сам SW-скрипт может проверяться на свежесть; это ещё не гарантирует, что обычный online reload покажет новый app shell вместо старого Cache Storage response.
- `public/sw.js` остаётся отдельным legacy/fallback SW, а `dist/sw.js` генерируется после build. Guard против deploy без генерации остаётся отдельным пунктом ТЗ-13 FR-6 и не был закрыт feature 048.

## Проблема

### 1. Online reload может оставаться на старом приложении

Service worker обслуживает навигацию cache-first. Регистрация не координирует обнаружение, ожидание и активацию новой версии. В результате обычное обновление страницы после deploy может показать закешированный старый app shell/код либо смешать lifecycle старой вкладки и нового cache. Пользователь не должен вручную делать hard refresh, очищать Cache Storage или пользоваться DevTools, чтобы получить уже опубликованный код. Одновременно решение не должно уничтожать последнюю рабочую offline-копию и не должно ломать открытую вкладку удалением нужного ей lazy chunk.

### 2. Random Learn-order не выравнивает фактические показы

Каждое открытие «Учить» перемешивает полный набор, но не знает, какие билеты пользователь фактически видел. При больших наборах одни билеты могут неоднократно попадать в начало, а другие — долго не появляться. Случайность остаётся полезной только как tie-break после обучающих приоритетов.

### 3. Ошибочный приоритет нельзя надёжно вывести из текущего capped журнала

История уже знает неправильные ответы, но pruned aggregate хранит cumulative wrong и только последний pruned answer. После pruning точное состояние «после последней ошибки было 0..4 последовательных правильных ответов» может быть потеряно. Без отдельного durable derived state ошибочный приоритет либо пропадёт, либо останется навсегда, либо будет зависеть от того, попал ли ответ под cap.

## Желаемый результат

На том же origin online reload использует последнюю опубликованную совместимую версию Cabadrive без hard refresh/ручной очистки кеша; offline reload продолжает использовать последнюю полностью готовую локальную версию.

Новое открытие «Учить» строит полный session-stable порядок по трём уровням:

1. меньшее число фактических показов — выше;
2. при равном числе показов билет с активным ошибочным приоритетом — выше;
3. при равенстве первых двух критериев — новый случайный tie-break, стабильный до конца текущей Learn-сессии.

Show counts и минимально необходимое derived-состояние ошибочного приоритета долговечно хранятся в browser storage, переживают reload, закрытие/открытие браузера, перезапуск локального сайта и same-origin deploy. Они не зависят от backend/cloud и не исчезают при cap/pruning answer history.

## Scope

### В scope

- Поведенческая гарантия fresh-online / offline-fallback для обычного reload после same-origin deploy.
- Безопасное обнаружение, установка и активация новой service-worker/app версии без смешивания несовместимых старых/новых чанков.
- Update lifecycle, достаточный для долгоживущей SPA: проверка при загрузке/регистрации и повторная проверка без необходимости закрывать вкладку; точный UI/interval финализирует Architect.
- Долговечный per-question show count для `Учить`, keyed by stable canonical `questionId`.
- Долговечное per-question состояние активного ошибочного приоритета и consecutive-correct streak после последней ошибки, не зависящее от capped retained answer history.
- Интеграция статистики в единую browser progress/storage boundary с миграцией существующих v2 данных, strict validation/recovery, reset и canonical export/import.
- Session-stable Learn ordering `showCount asc` → `activeMistakePriority first` → `sessionRandom`.
- Поиск как сужение уже созданного session order, без скрытого учёта непоказанных результатов.
- Unit/e2e и two-build/update verification, включая React StrictMode/double-render guard.
- Синхронизация durable docs, если итоговое поведение/хранилище/update flow изменяет описанные контракты.

### Вне scope

- Backend, аккаунты, cloud sync, cross-device sync, удалённая аналитика или обязательный runtime API.
- Гарантия сохранности browser data после очистки данных сайта пользователем/браузером, private/incognito eviction, смены browser profile, origin/протокола/порта или физического устройства.
- Замена localStorage на IndexedDB и полный iOS persistent-storage проект (отдельный TZ-15), если Architect не докажет, что это обязательно для данного запроса.
- Spaced repetition, интервалы по времени, сложность вопроса как новый критерий, ML/адаптивная модель или изменение exam selection.
- Изменение накопительного mistake-review счётчика: снятие Learn-приоритета после 4 правильных **не удаляет** историческую ошибку и не обнуляет `wrong` в «Ошибки».
- Изменение source/content mode, состава 460 билетов, переводов, объяснений, difficulty или unofficial fallback labeling.
- Полная переработка SW precache/reuse/install-status (ТЗ-13 FR-1/FR-2/FR-5), guard для `public/sw.js` (FR-6) и общая nginx cache-policy для нехешированных content assets (ТЗ-14), кроме минимально необходимого изменения для выполнения fresh-code reload и безопасной активации.
- Ручной reshuffle control и новый пользовательский экран статистики показов, если Architect не обоснует их необходимостью для приёмки.

## Функциональные требования

### A. Свежая версия при reload с сохранением offline

1. После публикации версии B поверх версии A на том же origin обычный reload при доступной сети открывает B, а не бесконечно возвращает cached A. Не требуются hard reload, DevTools, очистка Cache Storage или переустановка сайта.
2. Если обновление найдено в уже открытой вкладке, lifecycle явно и безопасно доводит его до применения: допустим компактный баннер/действие «Доступна новая версия — обновить» по FR-3, но UI не может быть единственным способом выполнить требование пункта A1 для обычного online reload.
3. Активация и reload координируются так, чтобы страница не смешивала старый HTML/JS с новым cache. `controllerchange`/эквивалент не вызывает reload-loop.
4. Новая версия не удаляет кеши, необходимые ещё работающей старой вкладке, до безопасной точки; lazy chunk старой вкладки не должен ломаться только потому, что новая версия установилась.
5. При отсутствии сети reload использует последнюю **успешно установленную и готовую** offline-версию. Неуспешная/частичная установка новой версии не уничтожает last-known-good app shell.
6. Update/cache lifecycle не очищает и не перезаписывает localStorage progress/learning statistics.
7. Поведение feature 048 сохраняется: navigation offline fallback и network error для отсутствующего subresource не регрессируют.

### B. Что считается показом

1. Show count конкретного `questionId` увеличивается на 1, когда его карточка реально становится видимой как активная карточка в разделе «Учить».
2. Начальная карточка при открытии/refresh «Учить» считается одним показом.
3. Переход Next/Previous на другую карточку учитывает показ новой карточки. Возврат к ранее виденной карточке после фактического показа другой карточки учитывает новый показ.
4. Уход из «Учить» и последующий возврат, а также reload/reopen, создают новое фактическое появление начальной карточки и учитывают его один раз.
5. Повторный render той же активной карточки, StrictMode mount/effect replay, timer tick, выбор/раскрытие перевода, запись ответа, toggle «Сложный» и другие state updates не увеличивают show count повторно, пока карточка не перестала быть активной и затем не появилась снова.
6. Search/index calculation, sorting, preload/prefetch, существование вопроса в результатах и соседний hidden question не являются показом. При search change счётчик меняется только если фактически видимый active `questionId` изменился (или после empty state карточка снова появилась).
7. Не найденный search result и empty state ничего не учитывают.

### C. Порядок «Учить»

1. На старте каждой новой Learn-сессии все доступные validated questions сортируются прежде всего по persisted show count по возрастанию. Отсутствующая запись эквивалентна `0`.
2. Только при равном show count билет с `activeMistakePriority = true` идёт раньше билета без активного приоритета.
3. При равенстве обоих критериев используется случайный tie-break, создаваемый заново для новой Learn-сессии и стабильный внутри неё.
4. Меньший show count всегда сильнее ошибочного приоритета. Например, билет без ошибки с count 0 идёт раньше билета с активной ошибкой и count 1.
5. Session order не перестраивается на каждом persisted show/answer update и не меняет текущую карточку под пользователем. Новые counters/answer-derived priorities влияют на следующее открытие/refresh Learn. Architect может выбрать эквивалентную очередь, только если она сохраняет текущую карточку, Previous/Next coherence и session stability.
6. Search сужает текущий session order и сохраняет его relative order; очистка поиска возвращает тот же session order, а не создаёт новый random tie-break.
7. Full current bank остаётся достижимым (`1 / 460` на текущем контенте); локальные картинки, timer, answer state, translation/explanation, difficult toggle и navigation остаются keyed by question identity.

### D. Ошибочный приоритет

1. Любой сохранённый неправильный ответ по билету активирует его Learn mistake priority и устанавливает consecutive-correct-after-last-error в `0`.
2. Каждый последующий сохранённый правильный ответ по **тому же** билету увеличивает эту серию на 1, если после него не было новой ошибки.
3. После 1, 2 или 3 последовательных правильных ответов приоритет остаётся активным. Четвёртый последовательный правильный ответ после последней ошибки деактивирует приоритет.
4. Следующая ошибка по тому же билету в любой момент снова активирует приоритет и сбрасывает серию в `0`; затем снова нужны четыре последовательных правильных ответа.
5. Ответы на другие билеты не сбрасывают и не увеличивают серию этого билета. Фактический показ без ответа и истечение Learn timer без ответа также её не меняют.
6. По default-допущению A3 ниже учитываются все canonical recorded answers по вопросу из `learning`, `exam` и `mistakes`; exam skip, уже трактуемый store как неправильный answer, активирует приоритет.
7. Деактивация — только Learn-order signal. Cumulative wrong/mistake-review history сохраняется без изменения.

### E. Persistence, migration, reset, import/export

1. Show count и error-priority state хранятся в durable browser storage на том же origin, keyed by stable `questionId`, через единую store boundary; `LearnView` не пишет localStorage напрямую.
2. Текущее корректное v2 состояние обязано загрузиться после обновления без потери `answers`, `difficultQuestionIds`, `examAttempts` и `prunedAnswerStats`. Architect выбирает schema evolution/version bump, но существующий v2 не может стать «corrupt/unknown» только из-за появления новых полей.
3. На migration show count нельзя выдумывать из числа ответов: для билетов без новой статистики он начинается с `0`, потому что исторические фактические показы неизвестны.
4. Mistake priority при migration выводится из доступной chronological history и pruned stats настолько точно, насколько данные позволяют. При неоднозначном pruned-only хвосте применяется консервативное правило A4: приоритет остаётся активным до четырёх достоверно наблюдаемых последовательных правильных ответов после migration/последней известной ошибки.
5. После migration derived state обновляется на каждом новом canonical answer и переживает дальнейший answer pruning/quota trimming; cap не должен повторно учитывать или забывать переходы streak.
6. Canonical export/import round-trip включает новую статистику. Import старого поддержанного v2 без новых полей безопасно и детерминированно мигрирует её; invalid new stats не фабрикуют counters/priority и обрабатываются через существующую recovery/atomic rejection semantics.
7. Подтверждённый «Сбросить прогресс» очищает show counts и mistake-priority state вместе с остальным прогрессом; undo восстанавливает их из canonical snapshot. Это ожидаемая семантика, потому что данные определяют личный учебный прогресс.
8. Неизвестные question IDs в сохранённой статистике не ломают сортировку текущего банка. Они не отображаются, но сохраняются согласно выбранной canonical import/export/migration policy, чтобы same-origin content update не вызвал случайную потерю данных; точную retention policy документирует Architect.

## Acceptance Expectations

Architect должен превратить intake в точные тестируемые AC и validation matrix. Минимально ожидаются следующие evidence:

### Fresh update / offline

- Two-build browser/e2e: открыть build A, затем на том же origin опубликовать build B с видимым version marker; обычный online reload показывает B без hard refresh/очистки кеша.
- Offline regression: после успешной установки build A (или B) сеть отключена; reload открывает последнюю готовую версию и базовый Learn flow остаётся доступным.
- Failed-update negative: оборванная/неполная установка B не уничтожает offline A; после возврата сети обновление можно завершить.
- Open-tab negative: новая версия не превращает lazy import старой открытой вкладки в постоянную ошибку из-за преждевременного удаления старого cache; после согласованного update/reload новая вкладка работает на B.
- Нет reload-loop на `controllerchange`/эквиваленте; feature-048 service-worker-generation tests и offline fallback invariants остаются зелёными.

### Show count

- Unit/store: начальный show нового билета даёт count 1; следующее независимое фактическое появление даёт 2; reload store сохраняет значение.
- Browser/e2e в React StrictMode: первая карточка учитывается ровно один раз; timer ticks, answer render, translation toggle и обычные rerenders не увеличивают count.
- Navigation/search: `q1 → q2 → q1` даёт q1 +2 и q2 +1; расчёт/поиск непоказанных вопросов даёт +0; empty results дают +0.
- Persistence: count сохраняется после page reload, browser context restart с тем же persistent profile/storage, restart сайта и same-origin build A→B update.

### Ordering and error priority

- Deterministic unit fixture доказывает lexicographic order: `showCount asc`, затем active error first, затем injected random tie-break.
- Negative priority fixture: count 0/no error идёт раньше count 1/active error — error status не перескакивает основной критерий.
- Tie fixture: при одинаковом count active-error вопрос идёт раньше inactive; при полном равенстве controlled random streams дают разные новые session orders, но rerender/search/timer сохраняют order текущей сессии.
- Streak table покрыта полностью:
  - `wrong` → active, streak 0;
  - `wrong, correct × 1/2/3` → active;
  - `wrong, correct × 4` → inactive;
  - `wrong, correct × 3, wrong` → active, streak 0;
  - `wrong, correct × 4, wrong` → active, streak 0;
  - interleaved answers других question IDs не меняют streak целевого question.
- Равные критерии и current 460-bank сохраняют full coverage, отсутствие duplicate/missing IDs и `1 / 460`.

### Storage compatibility

- Production-shaped current v2 fixture без новых полей мигрирует без потери существующего прогресса, не попадает в corruption recovery и после reload становится idempotent.
- Legacy fixture с retained + pruned answers доказывает консервативную миграцию streak там, где точное число старых consecutive correct неизвестно; четыре новых достоверных correct снимают приоритет.
- Answer history больше cap сохраняет правильное derived priority state после pruning; повторный prune/quota retry не double-counts streak/error transition.
- Canonical export→reset→import восстанавливает show counts и priority state; invalid/foreign stats не меняют текущее состояние атомарно.
- Reset/undo browser flow очищает и восстанавливает новую статистику согласованно с существующими safety controls.

## Негативные сценарии

- **Главный SW-сценарий:** после deploy пользователь нажимает обычный reload online, но cache-first app shell оставляет его на старом коде. Это считается дефектом даже если hard refresh помогает.
- **Главный Learn-сценарий:** StrictMode/effect replay или timer rerender увеличивает show count несколько раз, хотя пользователь видел одну непрерывно активную карточку. Это считается потерей корректности статистики.
- Current card не должна прыгать на другой question сразу после записи собственного show count или ответа.
- Search не должен «показывать» все найденные билеты и увеличивать их counters заранее.
- После трёх correct приоритет не снимается; после четвёртого снимается. Любая новая wrong после этого немедленно восстанавливает приоритет.
- Capped/pruned history не должна навсегда потерять active error или преждевременно снять его из-за отсутствия старых raw answers.
- Existing v2 payload без новых полей не должен быть отброшен как corrupt и не должен обнулить прогресс.
- Offline reload во время недоступной сети не должен пытаться принудительно взять сеть и оставлять пользователя без last-known-good приложения.
- Cache update/cleanup не должен затрагивать localStorage statistics.

## Допущения и зафиксированные default-решения

Уточнения через Orchestrator не требуются: пользовательские гарантии достаточно конкретны, а нижеследующие default-допущения закрывают пограничные случаи без изменения намерения.

- **A1 — same-origin boundary.** Persistence гарантируется для одного browser profile и того же origin (scheme + host + port). Очистка site data, private-mode eviction, смена origin/profile/device не покрываются.
- **A2 — Learn-сессия.** Новая сессия начинается при mount/opening раздела «Учить», включая первоначальную загрузку, refresh и возврат после ухода в другой top-level view. Порядок внутри mount стабилен.
- **A3 — какие ответы влияют на error priority.** Все ответы, уже канонически сохраняемые в progress store (`learning`, `exam`, `mistakes`), выражают знание того же билета и влияют на streak. Exam skip считается incorrect, как в текущем store. Если Architect обнаружит продуктовый конфликт, он обязан вернуть его Orchestrator как blocker/feedback, а не молча сузить до learning-only.
- **A4 — неоднозначная migration из pruned history.** Нельзя безопасно считать неизвестные старые correct. Если aggregate доказывает прошлую ошибку, а доступные данные не доказывают четыре последовательных correct после неё, priority остаётся active. Четыре последующих достоверных correct снимают его. Это может временно пере-приоритизировать билет, но не пропускает потенциально слабый билет.
- **A5 — show count начальной миграции.** Existing answers не являются доказательством количества показов; все отсутствующие counters начинаются с 0.
- **A6 — момент применения новых приоритетов.** Обновлённые counters и answer state влияют на следующий Learn mount/refresh; текущая session order не перестраивается, чтобы не ломать navigation и не менять карточку под пользователем.
- **A7 — user-visible update UI.** Баннер FR-3 допустим и полезен для долгоживущей вкладки. Он должен быть компактным, показываться не чаще необходимого и координировать activation; но online ordinary reload всё равно обязан получить новую версию по A1.
- **A8 — timestamps.** Для описанного приоритета wall-clock timestamps не нужны: важен порядок canonical answer events по вопросу. Не вводить time-decay/spaced repetition без нового запроса.

## Риски и меры

| Риск | Вероятность | Влияние | Ожидаемая мера |
|---|---:|---:|---|
| StrictMode повторно запускает effect и завышает show count | Высокая без guard | Высокое | Отдельная idempotency/exposure boundary; unit + browser evidence на один mount |
| Persisted update перерисует Learn и пересортирует текущий list | Средняя | Высокое | Session order snapshot/stable queue; тест current card + search clear |
| Добавление полей ломает strict current-v2 import/load | Средняя | Критическое | Explicit migration/backward fixtures; atomic recovery; schema decision в Architect memory |
| Cap удаляет ответы, нужные для four-correct streak | Высокая при долгом использовании | Высокое | Durable derived state, обновляемое до pruning и проверяемое на quota retries |
| Старая вкладка теряет lazy chunk при раннем cache cleanup | Уже известный риск | Высокое | Coordinated waiting/activation; two-build open-tab e2e |
| Network-first freshness ломает offline | Средняя | Критическое | Last-known-good fallback, timeout/error branch, real offline reload evidence |
| Параллельные SW и Learn изменения дают большой конфликтный PR | Средняя | Среднее | Два атомарных PR-слайса в одном cycle, единая final validation |
| LocalStorage недоступен/очищен | Средняя на private/mobile edge | Высокое | Существующие typed recovery/UX; честно не обещать persistence вне A1 |
| Same-path immutable content asset остаётся старым | Известный отдельный TZ-14 риск | Среднее | Не расширять молча scope; fresh-code AC проверяет app shell/bundles, а общий asset cache-policy остаётся отдельной диспозицией Architect |

## Источники и исследование

Внешнее исследование не использовалось и не требуется: запрос определяется локальным продуктовым контрактом, существующим кодом и репозиторной памятью.

Основные локальные источники:

- `.specify/memory/constitution.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/improvements/13-service-worker-reliability.md` (особенно FR-3 и известный update/lazy-chunk риск)
- `specs/023-learn-all-questions/feature-request.md` и `spec.md` (full bank, session-stable randomization)
- `specs/045-progress-store/feature-request.md` (v2/cap/migration/store boundary)
- `specs/048-service-worker-fetch-correctness/feature-request.md` и `spec.md` (что уже исправлено и явная граница FR-3)
- `src/App.tsx`, `src/domain.ts`, `src/main.tsx`
- `src/progressStore.ts`, `src/progressStoreCore.ts`
- `scripts/generate-service-worker.mjs`, `public/sw.js`, `nginx.conf`, `package.json`
- `tests/domain.test.mjs`, `tests/progress-store.test.mjs`, `tests/service-worker-generation.test.mjs`, `tests/e2e/app.spec.ts`

## Границы ролей и handoff

- Analyst создал только этот intake-артефакт и передаёт управление Orchestrator.
- Architect создаёт `spec.md`, `plan.md`, `tasks.md`; фиксирует schema evolution/migration, exposure idempotency boundary, pure ordering/streak helpers, SW update protocol, PR-slicing, negative tests, two-build/offline validation и cycle PR set.
- Implementation Agent начинает только после полной feature memory и явного назначения worktree/branch/PR slice. Он сохраняет sibling work, обновляет `tasks.md`, пишет test-first evidence и передаёт feedback для Architect disposition.
- Review Agent проверяет код/диф и feature-memory compliance без изменения файлов; отдельно проверяет no-double-show, lexicographic priority, migration/cap correctness и fresh-online/offline-safe update.
- Orchestrator координирует PR slice(s), required checks, Architect→Analyst final validation, effective/current-head guard, merge и Cleanup Agent при необходимости.

## Initial Cycle Context

На момент intake PR для feature 049 не существует. Handoff-контекст Analyst: ветка `codex/049-learning-priority-fresh-update` в `/Users/chap/devel/cabadrive-worktrees/049-learning-priority-fresh-update` от verified `origin/main` `c5520b31922c0e45afd96b2e5877136c1848a541`. Orchestrator может явно продолжить этот latest-main Analyst-created context через Architect как общий planning context и назначить его единственным implementation PR slice либо создать отдельные latest-main isolated implementation worktrees для SW и Learn-слайсов. Любой новый slice обязан перепроверить latest `origin/main`, сохранить параллельную работу и быть записан в cycle PR set.

## Final Analyst Validation Notes

Append-only секция Analyst; заполняется только по явному запросу Orchestrator после прохождения финальной валидации Architect.
