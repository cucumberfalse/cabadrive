# Feature Request: Typecheck, ESLint и Prettier как обязательные quality gates

## Analyst Artifact Status

Создано Analyst intake для второго самостоятельного PR-среза общего пользовательского запроса реализовать все доработки из `docs/improvements/` в порядке приоритета. Этот artifact относится только к P0 ТЗ-16 `docs/improvements/16-quality-tooling.md`; ранее приоритетный ТЗ-22 уже реализован и влит в `main` отдельным feature cycle `043-license-attribution`.

## Orchestrator Routing Context

- Orchestrator entry: пользователь явно назначил активную модель Orchestrator для запроса «реализуй в порядке приоритета все доработки из improvements»; после завершения ТЗ-22 Orchestrator назначил Analyst intake для следующего пункта, ТЗ-16.
- Active-model stop condition: общий repository-changing запрос уже прошёл Orchestrator-first routing; Analyst не самоназначался и не начинал implementation.
- Read-only transition context: не применимо; исходный запрос предполагает последовательные изменения репозитория.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-worktrees/044-quality-tooling`, ветка `codex/044-quality-tooling`.
- Latest-main base evidence: Orchestrator назначил verified `origin/main` base `830a4336e9d5adc1d1c65517e71084b928e0e914`; Analyst подтвердил, что `HEAD` и ветка указывают на этот SHA, upstream ветки — `origin/main`, а worktree был чист до создания intake artifact.
- Base content context: `830a4336e9d5adc1d1c65517e71084b928e0e914` является коммитом, которым feature 043 `feat: add license attribution and About view (#208)` попала в `main`, поэтому результаты ТЗ-22 являются обязательной частью сохраняемого baseline.
- Parallel-work note: параллельные Orchestrators, агенты и worktrees считаются возможными. Существующие dirty diffs, ветки, коммиты, PR и process memory должны сохраняться; запрещены некоординированные revert, rebase, merge, delete, overwrite или cleanup sibling work.
- Accidental-start recovery context: отсутствует; до Analyst assignment изменений для ТЗ-16 не выполнялось.
- Cleanup context: этот intake worktree активен и исключён из cleanup. Возможный cleanup после завершения cycle требует отдельного назначения Cleanup Agent, positive-proof проверки и evidence/refusal record; имя или путь worktree сами по себе не являются доказательством права на удаление.

## User Request

Исходный запрос:

> «реализуй в порядке приоритета все доработки из improvements»

Явное назначение роли:

> «Назначаю тебя Orchestrator для реализации всех доработок из improvements в порядке приоритета»

Согласно `docs/improvements/README.md`, после уже завершённого ТЗ-22 следующий элемент рекомендованной последовательности — P0 ТЗ-16: добавить typecheck, ESLint и Prettier как основу качества для последующих циклов. Этот intake ограничен ТЗ-16 и не объединяет с ним ТЗ-06, приоритетные UX/document/image направления или другие пункты backlog.

## Clarified Answers And Assumptions

- Дополнительное owner clarification не требуется: желаемый результат, порядок и ключевые ограничения явно записаны в общем запросе, backlog index и ТЗ-16. Технические детали конфигурации и безопасной миграции принадлежат Architect.
- «Все доработки» означает последовательные independently routed feature cycles/PR slices в рекомендованном порядке и с учётом зависимостей, а не один огромный PR.
- Для этого cycle допустим один PR с несколькими намеренно разделёнными коммитами, если Architect подтвердит атомарность. В частности, массовое механическое форматирование должно быть отделимо от setup/semantic fixes в истории и иметь точный ignore-revs SHA после создания format-only commit. Если безопасное разделение требует нескольких PR slices, Orchestrator обязан вести полный cycle PR set и отдельные latest-main worktrees.
- Требование ESLint 9 из ТЗ-16 сохраняется как owner backlog direction. Architect должен выбрать взаимно совместимые pinned версии ESLint 9, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` и Prettier в существующем pnpm toolchain, не делая неоговорённый major-upgrade на основании текущей даты.
- Runtime остаётся Docker-only для конечного пользователя. Host `pnpm`-команды являются development/CI verification tools и не меняют контракт `make build`, `make up`, `make down`.
- Нельзя форматировать или линт-автофиксить `content/`, `public/content/`, архивы официальных документов, image/source manifests, canonical/generated JSON indexes/evidence либо иные byte-pinned assets. Исключение должно быть явным и fail-closed; отсутствие случайного diff проверяется отдельно, а не только заявляется в конфиге.
- Уже влитые root `LICENSE`, `NOTICE`, third-party inventory, RU/EN README, `CONTRIBUTING.md`, `SECURITY.md`, `О приложении`, version `0.1.0`, attribution validator, README screenshots и screenshot capture/verification pipeline из feature 043 должны сохраниться. Форматирование затронутых `src/`/`scripts/` файлов допустимо лишь как механическое изменение с полной регрессионной проверкой поведения и attribution contracts.
- Точечные `eslint-disable` и `@ts-expect-error` допустимы только как крайняя локальная мера с объяснением причины и проверяемой привязкой к follow-up/TODO disposition. Blanket-disable для файла/каталога, понижение `strict`, отключение core requested rules или превращение ошибок в warnings не считается выполнением цели.
- Typecheck negative evidence должно демонстрировать ненулевой exit для намеренной ошибки без сохранения сломанного исходника в final tree. Architect определит воспроизводимый fixture/temporary-mutation test или эквивалентную безопасную проверку.

## Project Context Reviewed

- `AGENTS.md` и `.specify/memory/constitution.md`: Orchestrator-first routing, role ownership, spec-first/PR-only flow, latest-main isolated worktree, evidence-based acceptance, final Architect-before-Analyst validation и cleanup governance.
- `docs_project/README.md` и `docs_project/project-idea.md`: durable documentation layout, local-first продукт и русскоязычная целевая аудитория.
- `docs_project/project/frontend/frontend-docs.md`: React 19 + TypeScript + Vite SPA/PWA, текущие verification commands, Docker-only runtime, offline/content boundaries и новые license/About contracts feature 043.
- `docs_project/project/backend/backend-docs.md`: runtime backend отсутствует; 52 текущих `scripts/` файла являются repository tooling с большим набором content/source/manual validators и генераторов.
- `docs_project/project/feature-inventory.md`: актуальный product baseline, включая 460-ticket fallback bank, governed content, Docker-only flow и публичную Apache-2.0 documentation/About surface.
- `docs_project/screens/learning-and-exam-flows.md`: актуальные пользовательские режимы и About flow, которые не должны регрессировать от механического форматирования или lint/type fixes.
- `docs/specify/README.md`: Docker-only и offline constraints, канонические термины и content/source-of-truth rules.
- `docs/improvements/README.md`: ТЗ-16 следует вторым в рекомендованном P0 порядке после ТЗ-22 и является фундаментом последующих циклов.
- `docs/improvements/16-quality-tooling.md`: исходные FR/NFR, предложенный порядок гейтов, форматный migration commit, запрет форматирования `content/`, acceptance и риски.
- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`: TypeScript `5.9.3`, `strict: true`, `noEmit: true`, include только `src`; отдельного `typecheck`, lint или format script и соответствующих dependencies пока нет.
- `.github/workflows/ci.yml`: `baseline-checks` сейчас выполняет repository baseline, unit, build и e2e; отдельных typecheck/lint/format steps нет. `docker-validation` остаётся отдельным required job.
- `.unicorn-hub/config.json`: required checks — `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`; feature не должна переименовывать эти required check identities без отдельной process необходимости.
- `scripts/check-repo-baseline.mjs`, `scripts/publish-branch.mjs`, `CLAUDE.md`, `AGENTS.md`: preflight является обязательным перед push, но пока не включает новые статические/форматные gates.
- `.gitignore` и отсутствие `.prettierignore`, Prettier config, `eslint.config.mjs`, `.git-blame-ignore-revs`: исходное наблюдение ТЗ-16 по отсутствующим tools остаётся актуальным на latest `main`.
- Текущее измерение на base: `src/App.tsx` — 4172 строки; в `src/` 67 файлов, в `scripts/` 52 файла, в `tests/` 34 файла. Поэтому bulk format имеет высокий conflict/review risk и требует изолированного механического evidence.
- Read-only попытка `pnpm exec tsc --noEmit` в чистом worktree не дала baseline результата, потому что в этом новом worktree отсутствует `node_modules` и команда `tsc` недоступна. Это не typecheck failure продукта; первый воспроизводимый baseline после frozen dependency install должен быть записан Architect/Implementation как discovery evidence.
- `specs/043-license-attribution/` и merge diff #208: новые attribution/screenshot validators и тесты расширили `src/`, `scripts/` и CI/preflight baseline после аудита 2026-07-11, поэтому исходные оценки ТЗ-16 нельзя считать исчерпывающим file inventory.

## External Research

Внешнее исследование не использовалось. Intake касается локально закреплённого owner backlog и текущего repository/toolchain state; выбор совместимых pinned package versions и синтаксиса конфигурации должен проверяться Architect/Implementation по primary official documentation в момент технического проектирования, если локальных package constraints недостаточно. Intake не фиксирует плавающие `latest` версии.

## Problem Statement

Cabadrive компилируется через Vite/esbuild и имеет строгий `tsconfig`, но текущий PR/CI flow не запускает `tsc --noEmit`. Репозиторий также не имеет ESLint и Prettier gates. В результате типовые дефекты, ошибки React hooks/refresh boundaries, часть неиспользуемого или подозрительного кода и форматный drift могут попасть в review/main, а последующие крупные multi-agent изменения будут создавать шумные диффы.

Решение осложняется размером текущего монолитного `App.tsx`, десятками Node `.mjs` tooling scripts, tests по source patterns и большим governed content corpus с SHA-256 pins и generated indexes. Наивный запуск formatter по всему репозиторию может изменить канонические байты, сломать hashes/evidence, затруднить blame, вызвать конфликты с параллельными ветками или скрыть semantic fixes внутри массового diff.

## Proposed Outcome Or Workflow

1. В package/toolchain появляются воспроизводимые scripts `typecheck`, `lint`, `format` и `format:check` с pinned lockfile dependencies. `typecheck` запускает strict `tsc --noEmit` для `src` без ослабления существующего compiler contract.
2. ESLint 9 flat config типобезопасно проверяет `src/**/*.{ts,tsx}` через `typescript-eslint` type-aware recommended rules и React hooks/refresh plugins; Node `.mjs` tooling получает отдельный корректный Node profile без TS-only rules. Architect явно определяет покрытие tests/config files и документирует любое сознательное исключение, чтобы gate не создавал ложное ощущение полного lint coverage.
3. Prettier использует `printWidth: 100`; write/check scopes и ignore rules явно исключают `content/`, generated/public artifacts, vendored/license text и byte-pinned source materials. Начальное форматирование `src/` и `scripts/` является обозримым mechanical change и отделяется в истории от semantic/type/lint fixes настолько, насколько это нужно для review и `.git-blame-ignore-revs`.
4. `preflight` и `baseline-checks` запускают дешёвые gates до дорогих: typecheck → lint → format check → unit → build → e2e, сохраняя repository baseline/content/attribution checks и отдельный Docker validation. Повторные nested проверки можно оптимизировать только если equivalence доказана и это не превращается в преждевременную реализацию отдельного ТЗ-18.
5. Все обнаруженные type/lint defects исправляются минимально и проверяемо. Autofix не применяется к excluded content; broad suppressions, silent rule downgrades и смешивание функционального рефакторинга ТЗ-04/11/17 запрещены.
6. Durable agent/developer documentation перечисляет новые обязательные local gates и безопасный formatting workflow. Docker-only end-user startup и existing license/attribution/About/docs contracts не меняются.
7. Evidence включает чистый positive run, воспроизводимую negative typecheck проверку, format-idempotence/content immutability guard, lint scope/config tests, unit/build/e2e/preflight, Docker contract в соответствии с change matrix, CI timing для combined lint+typecheck ≤60 секунд, diff review разделяющий mechanical/semantic changes, и актуальный cycle PR set.

## Scope

В scope:

- package scripts, compatible pinned development dependencies и lockfile update;
- strict typecheck gate и минимальные исправления реально найденных type errors;
- ESLint 9 flat config для TypeScript/React source и Node tooling, requested React hooks/refresh checks, а также явно спроектированная политика для tests/config files;
- Prettier config/ignore, safe write/check commands и одноразовое механическое форматирование разрешённых `src/` и `scripts/` paths;
- `.git-blame-ignore-revs` с точным format-only commit SHA и короткая инструкция использования;
- CI/preflight ordering и durable contributor/agent documentation;
- automated tests/guards, которые доказывают inclusion/exclusion scopes, content immutability и failure behavior;
- минимальные test fixture/source-regex корректировки, если исключительно механическое форматирование выявит их зависимость от whitespace;
- process memory, review fixes, final validation и Orchestrator current-head/finalization evidence.

Не в scope:

- декомпозиция `App.tsx`, component-test framework, timer/session refactor или иная реализация ТЗ-04/11/17;
- общая оптимизация/дедупликация CI из ТЗ-18 сверх минимально необходимого включения и порядка новых gates;
- форматирование/автофикс content corpus, generated indexes, archived official sources, screenshots/images, license texts или других byte-pinned/vendored artifacts;
- функциональный редизайн UI, изменение About/version/disclaimer/source attribution, Docker/nginx/PWA behavior;
- снижение TypeScript strictness, замена ошибок warnings, blanket suppressions или массовый semantic refactor под видом formatting;
- переписывание истории, rebase/force-push или координационно опасное изменение sibling/open branches ради красивого blame.

## Role Boundaries Or Affected Actors

- Orchestrator: ведёт один work cycle и полный cycle PR set, решает безопасный момент bulk-format относительно параллельных работ, назначает роли/worktrees/PR slices, не редактирует файлы, маршрутизирует Implementation feedback Architect и финализирует только после всех gates/validations.
- Analyst: владеет только этим intake artifact и поздними append-only final validation notes по явному назначению; не выбирает lint architecture и не пишет implementation.
- Architect: создаёт `spec.md`, `plan.md`, `tasks.md`; определяет exact file globs/ignores, ESLint type-aware parser/project strategy, config/test coverage, migration commit sequence, negative fixtures, content immutability proof, CI/preflight order, timing evidence, Docker validation matrix и safe ignore-revs procedure.
- Implementation Agent: после полной feature memory меняет только assigned slice, сначала получает реальный baseline после frozen install, разделяет mechanical и semantic changes, не форматирует excluded paths, обновляет tasks/evidence и записывает каждое divergence/improvement feedback.
- Review Agent: отдельно проверяет config correctness, dangerous ignores/suppressions, hidden semantic changes в bulk-format diff, content/license/source byte stability, hook rule coverage, negative tests, CI ordering/timing, regression evidence и role/process compliance.
- Cleanup Agent: только по отдельному назначению Orchestrator инвентаризирует и удаляет завершённые agent-created environments внутри явно approved roots при полном positive proof; отказывает для active/dirty/untracked/unpushed/open-PR/ambiguous/user-owned/process-referenced targets.
- Contributors и будущие agents: запускают новые gates через preflight до push и используют documented format command вместо произвольного formatter по всему repository.

## Artifact And Handoff Expectations

- Analyst пишет только `specs/044-quality-tooling/feature-request.md` во время intake.
- Non-Orchestrator active models не создают implementation changes до Orchestrator routing.
- Requirement clarification инициируется только Analyst и передаётся пользователю через Orchestrator; для этого intake clarification не понадобилось.
- После handoff Analyst завершает работу до явного вызова final Analyst validation после успешной final Architect validation или нового intake assignment.
- Architect начинает с этого artifact и пишет `spec.md`, `plan.md`, `tasks.md`.
- Implementation начинается только после полной feature memory и явного Orchestrator assignment worktree/branch/PR slice.
- Handoff context: `/Users/chap/devel/cabadrive-worktrees/044-quality-tooling`, `codex/044-quality-tooling`, `specs/044-quality-tooling/`, verified base `830a4336e9d5adc1d1c65517e71084b928e0e914`; parallel work возможно и всё sibling state/process memory сохраняется.
- Этот Analyst-created latest-main context может продолжить Architect planning и стать единственным implementation PR slice только по явному решению Orchestrator. Дополнительные slices требуют отдельных latest-main isolated worktrees/branches/PRs и должны войти в cycle PR set.
- Intake worktree активен и исключён из cleanup; его завершение не разрешает автоматическое удаление.

## Open Questions And Risks

- Реальный объём TypeScript и lint defects пока неизвестен: чистый isolated worktree не содержит installed dependencies. Первый frozen install + baseline runs должны классифицировать fixes на механические, реальные correctness issues и out-of-scope architectural debt; последнее передаётся Architect для disposition, а не маскируется.
- Type-aware ESLint для `src` может требовать настройку parser project/service, совместимую с `moduleResolution: Bundler`, JSON imports и React 19. Неверная конфигурация может пропустить файлы или существенно замедлить CI.
- Исходное ТЗ прямо задаёт profile для `scripts/*.mjs`, но текущие Node sources включают 52 scripts и 34 tests, а также root config files. Architect должен явно решить coverage каждого класса; omission должен быть видимым non-goal/known issue, а не случайным glob gap.
- `react-hooks/exhaustive-deps` может обнаружить поведенчески значимые проблемы. Их нельзя автоматически исправлять изменением dependency arrays без тестов; сложный случай становится отдельной Architect disposition/task или documented narrow suppression с причиной.
- Bulk-format конфликтует с открытыми ветками и может затруднить review. Нужны Orchestrator coordination, отдельный mechanical commit/PR slice при необходимости, отсутствие force-push/rebase sibling work и точный ignore-revs SHA только после неизменяемого commit.
- `.git-blame-ignore-revs` не должен ссылаться на placeholder или commit, содержащий semantic/config changes. Если exact SHA невозможно записать в том же commit без self-reference, требуется безопасная последовательность последующих metadata commit(s), описанная Architect.
- Форматирование может сломать tests, которые сопоставляют source text/regex, либо изменить генерируемый output. Любая fixture update должна сохранять смысл проверки и быть reviewable отдельно от production fix.
- Prettier по умолчанию поддерживает JSON/Markdown; один ошибочный broad glob способен изменить governed content, feature memory, LICENSE/NOTICE или generated evidence. Нужны allowlisted write scope, explicit ignores и post-run hash/name-status guard.
- `preflight` уже повторно запускает `validate:content` через `build`/`test:e2e`. Это влияет на время, но полномасштабная оптимизация принадлежит ТЗ-18; нельзя удалять validation coverage без equivalence evidence.
- NFR ≤60 секунд относится к combined lint+typecheck на CI runner, а не к полному preflight. Evidence должно указывать observed runner/job/head и метод измерения; локальный быстрый run сам по себе недостаточен.
- Dependency additions расширяют supply-chain surface и должны пройти frozen lockfile install, `osv-scan` и обычный dependency review; плавающие versions или обход lockfile запрещены.
- Feature 043 добавила files, которые исходный аудит не учитывал. Formatting/lint scope и regression tests должны включать их там, где они попадают под разрешённые globs, сохраняя license/attribution/About/screenshot behavior.

## Acceptance Expectations

- `package.json` содержит рабочие `typecheck`, `lint`, `format`, `format:check` scripts, а lockfile детерминированно фиксирует совместимые ESLint 9/type-aware React/Prettier dependencies.
- `pnpm run typecheck`, `pnpm run lint` и `pnpm run format:check` завершаются успешно на clean final tree; typecheck сохраняет `strict`/`noEmit` и покрывает весь intended `src` scope.
- Повторяемая negative check с намеренной TypeScript ошибкой завершается ненулевым status и показывает, что именно typecheck gate блокирует defect; final committed source остаётся исправным.
- ESLint flat config действительно применяет type-aware TS rules и React hooks/refresh rules к intended source, Node profile к intended `.mjs` tooling, а automated/config inspection обнаруживает случайное выпадение ключевых paths/rules.
- В final tree нет blanket disables, необъяснённых suppressions и silent downgrade requested errors до warnings. Каждый вынужденный narrow suppression имеет причину и Architect disposition/follow-up.
- Prettier configured с `printWidth: 100`; `format` идемпотентен, `format:check` падает на намеренно плохо отформатированном разрешённом fixture/file и проходит после formatter.
- `content/**`, `public/content/**`, root `LICENSE`/`NOTICE`, `licenses/**`, screenshots/images, official archives, canonical/generated indexes/evidence и иные declared byte-pinned paths не меняются от formatter workflow. Evidence включает pre/post hashes или эквивалентный deterministic guard и `git diff --name-status`, а `pnpm run validate:attribution`, `validate:content` и quality gates остаются зелёными.
- Одноразовый bulk-format diff ограничен разрешёнными code paths и reviewable как mechanical; точный чисто-format commit записан в `.git-blame-ignore-revs` без history rewriting. Semantic/type/lint fixes не скрыты в ignored revision.
- `baseline-checks` показывает порядок typecheck → lint → format check → unit → build → e2e с быстрым fail до дорогих steps. `preflight` включает эквивалентные новые gates до unit/build/e2e и сохраняет repository/content/attribution validation.
- Combined typecheck+lint занимает не более 60 секунд на GitHub CI runner для final current head; timing evidence записано в process memory. Если объективный runner result превышает limit, это gap, а не повод убрать coverage.
- Полный `pnpm run preflight`, required CI jobs, `osv-scan`, build/offline/service-worker checks, Playwright e2e и применимые Docker-only checks проходят на current head. Existing About/license/README screenshot tests подтверждают отсутствие регрессии feature 043.
- Durable docs для contributors/agents перечисляют новые команды, безопасный scope formatter и pre-push expectation; Docker end-user quick start остаётся без host Node/pnpm requirement.
- Final diff не реализует соседние improvements и не изменяет governed product/content claims. Все dead ends, decisions, known issues, verification evidence и Implementation feedback/dispositions отражены в feature memory.
- Review Agent не оставляет blocking findings; required conversations resolved/outdated, checks green, conflicts отсутствуют. Final Architect validation проходит раньше final Analyst validation для одного effective content head; любой последующий commit является только разрешённым evidence и доказан current-head guard до Orchestrator finalization/merge.
- Cleanup evidence или явный not-applicable/refusal record добавляется для любого отдельно assigned cleanup scope; никакой активный или неоднозначный worktree не удаляется.

## Negative Scenarios

- Vite build зелёный, но `tsc --noEmit` отсутствует в CI/preflight или намеренная type error не блокирует gate.
- ESLint установлен, но glob/config фактически не проверяет `src/App.tsx`, TSX hooks или Node scripts; либо важные правила выключены глобально.
- CI вызывает новые scripts после unit/build/e2e, поэтому «fast fail» не достигается, либо required job name случайно меняется и branch protection теряет ожидаемый check.
- `pnpm format` запускается по `.` и изменяет `content/**/*.json`, pinned source hashes, generated indexes/evidence, licenses, docs или screenshots; последующее обновление hashes маскирует нарушение вместо отката formatter scope.
- Bulk-format и semantic fixes смешаны в revision, добавленный в `.git-blame-ignore-revs`, из-за чего blame скрывает реальные поведенческие изменения.
- `.git-blame-ignore-revs` содержит placeholder/nonexistent SHA или требует переписать опубликованную историю.
- Hook warning «чинится» изменением dependency arrays без behavioral tests, либо `@ts-ignore`, blanket `eslint-disable`, `strict: false`, `skip` glob или warnings используются для искусственного зелёного результата.
- Regex/source-shape tests просто удаляются или ослабляются после format вместо сохранения проверяемого contract.
- Для ускорения этого feature удаляются content/attribution/build/e2e проверки, хотя equivalence и scope отдельного ТЗ-18 не реализованы.
- Host Node/pnpm становится обязательным для пользовательского runtime, или ломаются `make build`, `make up`, `make down`.
- License/NOTICE/About/version/repository attribution или screenshot capture из feature 043 пропадают/меняют смысл в «механическом» diff.
- ТЗ-16 объединяется с декомпозицией App, component framework, timers или другими backlog items, создавая неревьюимый PR и нарушая priority slicing.

## Cycle PR Set Context

На intake PR ещё не открыт. Известный planned slice:

| Purpose | Branch | PR | Base | Current head | Status | Included in final validation |
|---|---|---|---|---|---|---|
| ТЗ-16 quality tooling, migration и complete feature memory | `codex/044-quality-tooling` | Not opened | verified `origin/main` `830a4336e9d5adc1d1c65517e71084b928e0e914` | intake HEAD starts at base; Analyst artifact uncommitted | Analyst intake active | Yes; final PR/head to be recorded by Orchestrator/Architect memory |

Если Architect/Orchestrator разделят migration на дополнительные PR slices, каждый slice должен стартовать из отдельного latest-main isolated context, быть добавлен в cycle PR set и войти в final validation. Этот intake не разрешает Analyst commit/push/PR mutation.

## Analyst Handoff

Intake готов к передаче Orchestrator → Architect без дополнительных вопросов пользователю.

Architect должен создать `spec.md`, `plan.md`, `tasks.md` и превратить expectations в точные проверяемые contracts: compatibility-pinned dependencies, lint/format globs и exclusions, baseline discovery, migration commit topology, content/license hash guard, config/negative tests, CI/preflight ordering, ≤60-second runner evidence, Docker/regression matrix, review requirements и cycle/final-validation memory. Implementation не должно начинаться до полной feature memory и явного назначения Orchestrator.

## Final Analyst Validation Notes

Append-only Analyst-owned section; заполняется только по явному вызову Orchestrator после passing final Architect validation.

- Analyst validation pass: not yet invoked
- Final Analyst validation completed at: not yet invoked
- Analyst validated effective content head: not yet invoked
- Analyst return count for this work cycle: 0
- Customer intent check: pending final Analyst invocation
- Gaps, if any: none recorded at intake
- Architect disposition routing: Orchestrator обязан передать любой будущий Analyst feedback Architect для accept/task/ticket/dispose до follow-up development.
- Analyst limit escalation: если следующий gap превысит 5 возвратов, Analyst создаёт новый feature request в отдельном latest-main branch/worktree и фиксирует handoff.
- Analyst boundary reminder: не редактировать Architect artifacts, code, tests, docs, reviews, commits, pushes, PR/merge state или файлы вне Analyst-owned intake/final-validation notes, кроме нового feature request при limit-exceeded escalation.
