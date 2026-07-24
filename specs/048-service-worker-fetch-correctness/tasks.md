# Tasks: Корректность fetch-обработчика service worker + unit-тесты текста SW (ТЗ-13, шаг 1)

## Cycle Context

- Feature: `048-service-worker-fetch-correctness` / ТЗ-13 шаг 1 (FR-4 + FR-7 ONLY).
- База: verified `origin/main` = `9de3d419772cb9b971cc01299fa4f251b86c08a9`
  (merge PR #212, слайс 2 ТЗ-P1). Worktree HEAD подтверждён равным base
  (`git rev-parse HEAD` = `9de3d419…`); дерево чистое до записи `specs/048-*`.
- Handoff branch/worktree: `claude/048-service-worker-fetch-correctness` /
  `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/048-service-worker-fetch-correctness`.
- Cycle PR set: см. `## Cycle PR Set` ниже (ведёт Orchestrator; на момент
  Architect-записи PR ещё не открыт).
- Базис счётчиков на `9de3d419` (перепроверить на HEAD, test-first):
  `pnpm run test` (`node --test tests/*.test.mjs`) = **553** top-level `test()`
  (замер Architect на base). Из них `tests/service-worker-generation.test.mjs` =
  **2** `test()` блока. После добавления одного focused FR-7 `test()` блока
  ожидается **554**; точное число фиксирует Implementation Agent на HEAD (сначала
  падающий тест, затем зелёный). E2e в этом слайсе не добавляется и не мигрируется
  (только unit текста SW) — e2e-счётчик не меняется; Implementation Agent при
  желании фиксирует базис для полноты, но e2e-прогон не является гейтом этого
  слайса (см. Decisions «e2e/AC-3 отложены»).
- Parallel-work rule: сохранять все чужие worktree, ветки, коммиты, PR, dirty
  diffs и процессную память; не изменять `feature-request.md` вне Analyst-owned
  секций; не трогать соседние слайсы/фичи.

## Implementation Tasks

- [x] **T001** Подтвердить ветку/worktree/базу: `git status --short` (чисто, кроме
  `specs/048-*`), `git rev-parse HEAD` = `9de3d419772cb9b971cc01299fa4f251b86c08a9`,
  сверка с `origin/main`. Перепроверить на HEAD номера строк из plan.md/spec.md:
  `createServiceWorkerBody` (~38–72), fetch-обработчик (~54–70), баговая catch
  `.catch(() => caches.match("/") || caches.match("/index.html"))` (~67); тест-файл
  `tests/service-worker-generation.test.mjs` второй `test()` блок (~113–149),
  ассерты `addAll/fetch/put` (~136–138). При неоднозначности базы — стоп и возврат
  Orchestrator. Зафиксировать стартовый SHA кандидата.

- [x] **T002** Замерить базис `pnpm run test` на HEAD и записать в Verification
  Evidence (ожидается 553 до правок). Test-first (Принцип III): добавить в
  `tests/service-worker-generation.test.mjs` ОДИН новый focused `test()` блок для
  fetch-обработчика (переиспользуя `withTempDist` +
  `generateServiceWorker({ dist, timestamp: 12345 })`) с ассертами по plan.md
  (Design — FR-7):
  - позитивные `assert.match`: `ignoreSearch` keyed на
    `event.request.mode === "navigate"`; полная navigate-цепочка
    `(await caches.match("/")) ?? (await caches.match("/index.html")) ?? Response.error()`;
    navigate-only ветвление `if (event.request.mode === "navigate")`;
    не-навигационный `return Response.error();`;
  - негативные `assert.doesNotMatch`: мёртвый `caches.match("/") || caches.match`;
    старый бесопционный `caches.match(event.request).then`.
  Прогнать `node --test tests/service-worker-generation.test.mjs` и ЗАФИКСИРОВАТЬ
  test-first ПАДЕНИЕ нового блока (позитивные не находят текст; `doesNotMatch(||)`
  падает на мёртвом `||`). Существующие два `test()` блока не ослаблять.

- [x] **T003** Реализовать FR-4: заменить ТОЛЬКО тело fetch-обработчика в
  `createServiceWorkerBody` (`scripts/generate-service-worker.mjs`) на эталонный
  emitted-текст из plan.md (Design — async-IIFE, `ignoreSearch` keyed на navigate,
  navigate-фолбэк `?? ... ?? Response.error()`, не-навигационный `Response.error()`,
  без мёртвого `||`). НЕ менять `install`/`activate`/`CACHE_NAME`/`ASSETS`/
  `collectInstallPrecacheAssets`/`shouldInstallPrecacheAsset`/`isManual*`/
  `generateServiceWorker`/импорты. Довести FR-7 тесты до зелёного; сверить литералы
  emitted-текста с регэкспами на HEAD.

- [x] **T004** Границы дифа (grep-свидетельства в Evidence):
  `git diff --stat` — только `scripts/generate-service-worker.mjs` +
  `tests/service-worker-generation.test.mjs` (+ опц. durable-док по A6);
  `git diff --stat public/sw.js src/main.tsx src/App.tsx package.json` — **пусто**;
  `git diff scripts/generate-service-worker.mjs` затрагивает только тело
  fetch-обработчика (install/activate/CACHE_NAME/ASSETS/прекеш-функции неизменны).

- [x] **T005** Durable-доки (A6): `rg -n -i "service worker|sw\.js|ignoreSearch|
  offline|оффлайн" docs_project/` — если найден durable-док, описывающий
  fetch/оффлайн-поведение SW, затрагиваемое этим изменением, синхронизировать его
  в рамках слайса; иначе — правок доков нет (зафиксировать фактический результат
  grep в Evidence). `docs/improvements/13-service-worker-reliability.md` §4 чекбокс
  шага 1 НЕ редактировать (прецедент слайсов 1–2).

- [x] **T006** Прогнать локальные гейты и записать фактические свидетельства в
  Verification Evidence: `node --test tests/service-worker-generation.test.mjs`
  (fail→pass), `pnpm run test` (точное число, базис 553 → после), `pnpm run
  quality:fast`, `pnpm run format:check`. Записать decisions/dead ends/known
  issues/feedback до PR-handoff.

- [x] **T007** `pnpm run preflight` перед push (обязателен перед каждым push);
  затем commit/push/открытие РОВНО одного ready PR по назначению Implementation
  Agent. Записать URL, ветку, полный head SHA в `## Cycle PR Set`. Не мержить, не
  ребейзить чужое, не мутировать несвязанное состояние.

## Review And Follow-up Tasks

- [ ] **T008** Review Agent: thread-aware ревью точного текущего head — FR-4
  корректность (navigate vs субресурс, `ignoreSearch` keyed на navigate,
  устранение мёртвого `||` и пути к `respondWith(undefined)`/`TypeError`,
  терминальный `Response.error()` без HTML/MIME-обходов); реальная сторожевая сила
  FR-7 (ассерты падали на баговом тексте); сохранность успешного пути
  (`method !== "GET"`, кеш-фёрст, `response.ok`→`cache.put`); отсутствие
  расползания scope в прекеш/`install`/`activate`/`public/sw.js`/`src`; полнота
  feature memory. Только inline review threads, без правок кода.

- [ ] **T009** Orchestrator: каждый review/implementation-feedback item получает
  Architect-диспозицию (task/ticket/not-needed) с записью здесь; ничего не
  откладывается молча.

- [ ] **T010** Implementation Agent: принятые follow-ups, свежие focused/полные
  свидетельства на новом head (включая обновлённые счётчики тестов), обновление
  процессной памяти, свежие review/check-свидетельства.

## Final Validation And Completion Tasks

- [ ] **T011** Orchestrator: зафиксировать полный cycle PR set, состояние required
  checks/head, resolved threads, конфликты, acceptance evidence, диспозиции
  feedback и effective content head.

- [ ] **T012** Финальная Architect-валидация: все задачи/диспозиции, guidance,
  process memory, customer intent в духе и букве. При pass — записать
  merge-gate-маркеры в `## Final Architect Validation (Architect-owned)`
  (`Architect validation pass: passed`, ISO-timestamp,
  `Architect validated effective content head: <40-hex-sha>`); gaps — через
  role-appropriate follow-up, максимум 10 возвратов.

- [ ] **T013** Финальная Analyst-валидация только после T012: Analyst-owned
  маркеры в `feature-request.md` (`Analyst validated effective content head:
  <40-hex-sha>`, тот же SHA, что у Architect) или возврат gap'ов на
  Architect-диспозицию, максимум 5 возвратов.

- [ ] **T014** Orchestrator: read-only current-PR-head guard (эффективный content
  head по полному SHA; поздние коммиты — только evidence-only), затем conservative
  finalization/merge (squash-only ruleset + AI Review (Codex) gate) только при всех
  зелёных гейтах; cleanup — отдельным назначением Cleanup Agent или явное
  not-applicable/refusal-свидетельство.

## Decisions

- **Форма emitted-обработчика (A1): async-IIFE внутри `respondWith`.** Выбрана
  вместо `.then`-цепочки и вместо именованной `async function` — `await` + `??`
  читаются прямо по §3 ТЗ-13, `respondWith` получает единственный Promise,
  одноразовая логика не выносится в отдельную функцию (Simplicity). `catch {`
  (optional catch binding) — без неиспользуемого биндинга. Эталонный текст
  зафиксирован в plan.md символ-в-символ для детерминизма FR-7 регэкспов.
- **`ignoreSearch` только для навигаций (A4).** Единый предикат
  `event.request.mode === "navigate"` и для `ignoreSearch`, и для выбора
  HTML-фолбэк-ветки. Для субресурсов `ignoreSearch` = `false` — разные query
  остаются разными ключами кеша (регресса матчинга субресурсов нет).
- **Терминальный фолбэк субресурса (A3): строго `Response.error()`.** Не
  `new Response(null, { status: 504 })`, не HTML — точное соответствие §3 ТЗ-13 и
  AC-3.
- **FR-7: один новый focused `test()` блок.** Корректность fetch-обработчика —
  отдельная забота от прекеша/runtime-кеша (второй существующий блок), поэтому
  добавляется отдельный `test()` (счётчик 553 → 554), а не расширяется
  существующий. Существующие два блока не ослабляются. Test-first: ассерты
  наблюдаются падающими на баговом тексте.
- **E2e / AC-3 e2e-часть отложены.** ТЗ-13 план откладывает e2e с реальной
  регистрацией/установкой SW на более широкие шаги 2–4. В этом слайсе — только
  unit текста генерируемого SW; e2e не добавляется и не мигрируется, e2e-прогон не
  является гейтом слайса. Явный non-goal.
- **`public/sw.js` не редактируется.** FR-6 (тонкий no-op SW + guard-тест) — шаг 4
  ТЗ-13, вне этого слайса.
- **install/activate/прекеш не трогаются (A5).** Баги прекеша и цикла обновления
  (проблемы №1/№2 ТЗ-13) — шаги 2–3; смешивание расширило бы площадь и нарушило
  «маленький безопасный PR».
- **Чекбоксы `docs/improvements/13-*.md` §4 НЕ редактируются.** По прецеденту
  слайсов 1–2 ТЗ-P1 (feature `047`) статус-чекбоксы ТЗ в `docs/improvements/` не
  обновляются; выполненность слайса фиксируется feature memory и merged PR.
- **Durable-доки (A6).** Синхронизируются только при фактическом наличии
  durable-описания fetch/оффлайн-поведения SW в `docs_project/`, затрагиваемого
  изменением (T005 фиксирует результат grep).
- **Номера строк (A7): проверены на base `9de3d419`.** Implementation Agent обязан
  перепроверить на своём HEAD (T001).

## Verification Evidence

Implementation Agent записывает команда → фактический результат → SHA кандидата.
Слоты (заполнить фактическими прогонами на HEAD):

Candidate SHA во время локального прогона (до commit): `9de3d419772cb9b971cc01299fa4f251b86c08a9` (HEAD == base до commit).

- `git rev-parse HEAD` (T001) = `9de3d419772cb9b971cc01299fa4f251b86c08a9`
  подтверждено / `git status --short` чисто кроме `specs/048-*`: **PASS** — до
  правок статус показывал только `?? specs/048-service-worker-fetch-correctness/`;
  HEAD совпал с base. Номера строк на HEAD подтверждены: `createServiceWorkerBody`
  строки 38–72, fetch-обработчик 54–70, баговый catch
  `.catch(() => caches.match("/") || caches.match("/index.html"))` строка 67;
  тест-файл второй `test()` блок строки 113–149, ассерты `addAll/fetch/put`
  строки 136–138.
- `pnpm run test` базис ДО правок (T002): ожидается **553**; фактически: **553**
  (`# tests 553 # pass 553 # fail 0`).
- `node --test tests/service-worker-generation.test.mjs` — test-first: **fail**
  нового FR-7 блока ДО правки FR-4: **PASS-as-expected FAIL** — `# tests 3 # pass 2
  # fail 1`; первый упавший ассерт — `ignoreSearch` match (operator `match`) на
  текущем баговом тексте `caches.match(event.request).then(...)` +
  `.catch(() => caches.match("/") || caches.match("/index.html"))`. После правки
  FR-4: **pass** — `# tests 3 # pass 3 # fail 0`.
- `pnpm run test` — `node --test tests/*.test.mjs`: **pass** — `# tests 554
  # pass 554 # fail 0` (базис 553 → 554 после добавления одного focused `test()`).
- `pnpm run quality:fast` — `tsc --noEmit` + eslint (`--max-warnings 0`): **pass**
  (QF_EXIT=0, 0 ошибок/0 предупреждений).
- `pnpm run format:check` — **pass** (FC_EXIT=0, "All matched files use Prettier
  code style!").
- `pnpm run build:app` — **pass** (BUILD_EXIT=0, "✓ built"; `generate:sw` →
  "Generated service worker with 2156 cached assets.").
- `pnpm run preflight` — PREFLIGHT_EXIT=**0** (154 e2e passed, включая "offline
  reload works after first load").
- **Границы дифа (T004):** `git diff --stat` = только
  `scripts/generate-service-worker.mjs` (29 lines) +
  `tests/service-worker-generation.test.mjs` (29 lines); durable-доков не менялось;
  `git diff --stat public/sw.js src/main.tsx src/App.tsx package.json` = **пусто**;
  `grep -n "caches.match" scripts/generate-service-worker.mjs` → только новая форма
  (строка 58 `await caches.match(event.request, { ignoreSearch: ... })`, строка 71
  `(await caches.match("/")) ?? (await caches.match("/index.html")) ??
  Response.error()`); мёртвого `||` нет; install/activate/CACHE_NAME/ASSETS/прекеш
  неизменны.
- **Durable-доки (T005):** `rg -n -i "service worker|sw\.js|ignoreSearch|offline|
  оффлайн" docs_project/` → найдены только высокоуровневые упоминания SW/offline
  (`backend-docs.md:34` — "writes a production service worker with the built asset
  list for offline reload"; devops/marketing/frontend упоминания offline). Ни один
  durable-док не описывает семантику fetch-обработчика (navigate-фолбэк /
  `ignoreSearch` / `Response.error()`), затрагиваемую этим изменением →
  правок доков нет.
- **Негативный сценарий (обязателен):** инварианты текста SW закрывают NS-1
  (субресурс → `return Response.error();`, не HTML), NS-2 (navigate-цепочка
  `?? ... ?? Response.error()`, без мёртвого `||`/`respondWith(undefined)`), NS-3
  (`ignoreSearch` keyed на navigate), NS-4 (FR-7 ассерты падали на баговом тексте)
  — результат: **все зелёные** (подтверждено test-first FAIL→PASS выше).
- `git diff --check` — clean (нет whitespace/conflict-маркеров): **PASS**.
- PR URL / head SHA / состояние checks и review threads — ведёт Orchestrator (см.
  `## Cycle PR Set`).

## Dead Ends

- _(Заполняется Implementation Agent при обнаружении.)_ На момент Architect-записи
  тупиков нет: форма emitted-обработчика и набор FR-7 регэкспов зафиксированы в
  plan.md; известный риск расхождения пробелов/переносов между emitted-текстом и
  регэкспами снимается сверкой литералов на HEAD (T003) и гибкими `\s*` в
  объектной опции `ignoreSearch`.

## Known Issues

- No unresolved known issues; the accepted limitations of this slice — AC-3's in-browser e2e part is deferred to ТЗ-13 steps 2–4; precache/update-cycle/public/sw.js (ТЗ-13 problems #1/#2/#4) are out of scope; the docs/improvements/13-*.md checkboxes are not edited (slice 1–2 precedent) — are all documented and Architect-ACCEPTED under Decisions, with no open owner decision required.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback.

---

<!-- Секции ниже — skeleton-плейсхолдеры; заполняются на финальной валидации,
     инициируемой Orchestrator. НЕ заполнять marker-значения (timestamp/SHA)
     на этапе Architect-дизайна. -->

## Final Architect Validation (Architect-owned)

Merge-gate markers (exact keys, verbatim — do not reword; parsed by
`scripts/finalize-pr.mjs`):

Architect validation pass: passed
Final Architect validation completed at: 2026-07-24T11:54:30Z
Effective content head: 55a813666ca68989f7d9cb010c8e42979fb5865b
Architect validated effective content head: 55a813666ca68989f7d9cb010c8e42979fb5865b

Current effective content head: `55a813666ca68989f7d9cb010c8e42979fb5865b` (PR
#213, sole PR of this work cycle). Incremental review basis `git diff
9de3d419..55a81366`: exactly `scripts/generate-service-worker.mjs` (fetch-handler
body ONLY) + `tests/service-worker-generation.test.mjs` (one new focused `test()`
block) + `specs/048-service-worker-fetch-correctness/*` feature memory —
confirmed via `git diff --name-only` (no `public/sw.js`, `src/main.tsx`,
`src/App.tsx`, `package.json`, or precache-logic changes; no new dependencies).

Re-verification against tasks/dispositions, architectural guidance, process
memory, and customer intent (in spirit and letter):

- **FR-4 emitted handler matches plan.md Design exactly** — `caches.match(event.request,
  { ignoreSearch: event.request.mode === "navigate" })`; navigate catch returns
  `(await caches.match("/")) ?? (await caches.match("/index.html")) ?? Response.error()`;
  non-navigate catch returns `Response.error()`; async-IIFE inside `respondWith`
  with `catch {`; dead `||` operand and the `respondWith(undefined)`/`TypeError`
  path removed. Verified by reading `scripts/generate-service-worker.mjs:54–77`.
- **install/activate/precache unchanged** — `git diff 9de3d419..55a81366 --
  scripts/generate-service-worker.mjs` touches only the `fetch` listener body;
  `CACHE_NAME`, `ASSETS`, `cache.addAll(ASSETS)`, `install`/`activate`,
  `collectInstallPrecacheAssets`/`shouldInstallPrecacheAsset`/`isManual*`,
  `generateServiceWorker` untouched. `method !== "GET"` early-return, cache-first,
  and `response.ok`→`cache.put` preserved verbatim.
- **FR-7 tests present and green** — new `test()` block "generated service worker
  fetch handler has correct offline fallbacks" carries all six planned assertions
  (ignoreSearch-keyed-on-navigate; full `?? … ?? Response.error()` chain;
  navigate-only branching; non-navigate `return Response.error();`; and two
  `doesNotMatch` guards for the dead `||` and the old optionless
  `caches.match(event.request).then`) — genuine regression guards that fail on the
  old buggy text. Impl recorded test-first FAIL→PASS (Implementation Agent
  Feedback / Verification Evidence).
- **Gates re-run on effective head `55a81366`** (Architect re-verification):
  `node --test tests/service-worker-generation.test.mjs` → tests 3 / pass 3;
  `pnpm run test` → tests 554 / pass 554 (baseline 553 → +1 focused `test()`,
  matching the plan); `pnpm run quality:fast` → pass (0 errors/0 warnings);
  `pnpm run format:check` → pass. AI Review (Codex) passed first round with zero
  findings/threads; all CI green; `mergeStateStatus: CLEAN` (Orchestrator report).
- **Diff limited to the two code files + specs/048 memory; no new deps** —
  confirmed. Negative scenarios NS-1..NS-4 closed by the text invariants; e2e/AC-3
  e2e-part correctly deferred per Decisions (non-goal for this slice).

Architect return count: **0** (within limit 10). No gaps; no follow-up required.

## Cycle PR Set

- Slice 1 (this cycle, SOLE PR): **PR #213** —
  https://github.com/cucumberfalse/cabadrive/pull/213 ; branch
  `claude/048-service-worker-fetch-correctness` → base `main`; status OPEN, ready
  (not draft), MERGEABLE, `mergeStateStatus: CLEAN`; effective content head:
  `55a813666ca68989f7d9cb010c8e42979fb5865b`; purpose: ТЗ-13 шаг 1 — SW
  fetch-handler correctness (FR-4) + расширение unit-тестов текста SW (FR-7). AI
  Review (Codex) passed first round with zero findings and zero review threads;
  all CI checks green (AI Review, baseline-checks, docker-validation, guard,
  osv-scan). The PR is a single behavioral commit (base `9de3d419` →
  `55a81366`); a later evidence-only validation commit (this Final Architect
  Validation + Cycle PR Set + Final Validation Evidence, then Analyst notes) is
  permitted — it records role-owned validation evidence and changes no behavior.
  Included in final validation as the sole PR of this work cycle. Required checks
  / AI Review (Codex) / final Architect+Analyst validation / current-head guard /
  merge — Orchestrator. Do NOT merge manually (squash-only ruleset + Codex gate).

## Final Validation Evidence

- **Architect final validation: PASS** on effective content head
  `55a813666ca68989f7d9cb010c8e42979fb5865b` — see the verbatim merge-gate marker
  lines in `## Final Architect Validation (Architect-owned)` above
  (`Architect validation pass: passed`, `Final Architect validation completed at:
  2026-07-24T11:54:30Z`, `Architect validated effective content head: 55a81366…`).
  Architect return count 0 (limit 10); no gaps, no limit escalation.
- **Analyst final validation: PASSED (Analyst-owned).** Recorded in
  `feature-request.md` with a LATER `Final Analyst validation completed at:
  2026-07-24T11:57:30Z` timestamp (after the Architect's 11:54:30Z, per the
  Architect-then-Analyst order) and
  `Analyst validated effective content head: 55a813666ca68989f7d9cb010c8e42979fb5865b`
  (same SHA as Architect).
- Architect return count: 0 (within limit 10). Analyst return count: 0 (within limit 5).
- Limit escalation: none (no return-count limit breach; no new feature request required).
- **Current-head guard / required checks / resolved threads / conflicts / merge:**
  Orchestrator-owned. At Architect validation time: PR #213 OPEN/ready,
  `mergeStateStatus: CLEAN`, MERGEABLE, all CI green, AI Review (Codex) passed
  round 1 with zero threads. Any post-validation NON-evidence change to PR #213
  makes this Architect pass stale and must be routed back through role-appropriate
  final validation before merge.
- Current-PR-head guard against effective content head 55a813666ca68989f7d9cb010c8e42979fb5865b: git diff 55a813666ca68989f7d9cb010c8e42979fb5865b..<current PR head> --name-only lists only the two evidence files (tasks.md / feature-request.md) and is empty when the current PR head IS that SHA.
- **Permitted later commit:** a single evidence-only validation commit recording
  this Architect validation evidence (and the subsequent Analyst notes in
  `feature-request.md`) is allowed without recursive role re-validation, as it
  changes no behavior. Orchestrator performs the read-only current-PR-head guard
  (effective content head `55a81366` by full SHA) before conservative
  finalization/merge.
