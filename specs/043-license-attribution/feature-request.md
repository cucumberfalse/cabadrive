# Feature Request: LICENSE, атрибуция и базовая документация

## Analyst Artifact Status

Создано Analyst intake для первого самостоятельного PR-среза пользовательского запроса реализовать все доработки из `docs/improvements/` в порядке приоритета. Этот artifact относится только к ТЗ-22; остальные независимые доработки должны проходить через отдельные feature folders и назначенные Orchestrator task slices.

## Orchestrator Routing Context

- Orchestrator entry: пользователь явно назначил активную модель Orchestrator для запроса «реализуй в порядке приоритета все доработки из improvements»; Orchestrator назначил Analyst intake для ТЗ-22 2026-07-16.
- Active-model stop condition: до явного назначения Orchestrator активная модель остановилась и сообщила пользователю, что изменения репозитория требуют Orchestrator routing; прямые изменения не начинались.
- Read-only transition context: не применимо; запрос изначально предполагал изменения репозитория.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-worktrees/043-license-attribution`, ветка `codex/043-license-attribution`.
- Latest-main base evidence: Orchestrator назначил verified `origin/main` base `ca5b5277195cd25d23b25f611dd5a3ac24d54586`; Analyst подтвердил, что рабочая ветка и `HEAD` указывают на этот SHA и worktree был чист до создания intake artifact.
- Parallel-work note: параллельные Orchestrators, агенты и worktrees считаются возможными. Существующие dirty diffs, ветки, коммиты, PR и process memory должны сохраняться; запрещены некоординированные revert, rebase, merge, delete и overwrite sibling work.
- Accidental-start recovery context: отсутствует; до routing и до Analyst assignment изменений не выполнялось.
- Cleanup context: intake worktree активен и исключён из cleanup. Возможный будущий cleanup требует отдельного назначения Cleanup Agent, positive-proof проверки и evidence/refusal record.

## User Request

Исходный запрос: «реализуй в порядке приоритета все доработки из improvements».

После процессного stop condition пользователь уточнил полномочия: «Назначаю тебя Orchestrator для реализации всех доработок из improvements в порядке приоритета».

Согласно `docs/improvements/README.md`, первым элементом рекомендованной последовательности является P0 ТЗ-22 — юридический минимум, атрибуция и актуализация базовой документации. Данный intake ограничен этим первым самостоятельным срезом.

## Clarified Answers And Assumptions

- Owner decision, переданное через Orchestrator 2026-07-16: собственный код Cabadrive лицензируется под `Apache-2.0`. Architect и Implementation Agent должны применить точный текст Apache License 2.0 и согласованные copyright/NOTICE формулировки, не распространяя это решение автоматически на third-party или официальные материалы с отдельными условиями.
- Предполагается, что «все доработки» означает последовательную реализацию по рекомендованному порядку и зависимостям из `docs/improvements/README.md`, а не объединение всего backlog в один PR или feature folder.
- ТЗ-22 рассматривается как один небольшой PR-срез, но Architect должен проверить, остаётся ли объединение файлов лицензирования, README/политик и UI-страницы достаточно атомарным и безопасным. Если размер или юридическая неопределённость требуют разделения, Orchestrator создаёт отдельные task slices/worktrees/PR, сохраняя единый customer outcome этого feature cycle.
- Скриншоты для README должны быть актуальными пользовательскими экранами приложения и размещаться по стабильным repository-relative путям; существующие evidence screenshots можно переиспользовать только после проверки актуальности и пригодности для публичной документации.
- Контакт/канал в `SECURITY.md` должен быть подтверждён владельцем или выведен из уже утверждённой repository configuration; нельзя публиковать выдуманный адрес.
- URL репозитория для UI/README может быть взят из `origin` (`https://github.com/cucumberfalse/cabadrive`), но Implementation Agent должен использовать HTTPS-ссылку и проверить, что она является публичной канонической точкой проекта.
- Любые пути или имена worktrees являются только discovery hints, а не доказательством права на удаление.

## Project Context Reviewed

- `.specify/memory/constitution.md`: spec-first, PR-only, isolated latest-main worktree, role boundaries, final validation and cleanup governance.
- `docs_project/README.md`, `docs_project/project-idea.md`: durable project context, аудитория и local-first назначение.
- `docs_project/project/frontend/frontend-docs.md`: реализованный React/Vite SPA/PWA, Docker-only runtime, текущий `unofficial_b_fallback` режим и UI disclaimer constraints.
- `docs_project/project/backend/backend-docs.md`: отсутствие runtime backend, content validation и archive/source governance.
- `docs_project/project/feature-inventory.md`: текущие возможности, источник 460 fallback-вопросов и граница между unofficial bank и официальными материалами.
- `docs_project/screens/learning-and-exam-flows.md`: актуальная навигация, пользовательские режимы и обязательная маркировка официальных/неофициальных слоёв.
- `docs/specify/README.md`: исходные product constraints, Docker-only contract и source-of-truth terminology.
- `docs/improvements/README.md`: приоритеты, рекомендованная последовательность и место ТЗ-22 как первого P0 quick win.
- `docs/improvements/22-license-attribution-docs.md`: полный контекст, FR/NFR, предложенный план, acceptance criteria, риски и затрагиваемые файлы.
- `.specify/templates/feature-request-template.md`: обязательная структура Analyst intake и handoff.
- `README.md`: подтверждено устаревшее утверждение `No product runtime scaffold is committed yet` и отсутствие актуального пользовательского quick start.
- `content/meta/content-mode.json`: канонические disclaimer notes и blocked claims для текущего `unofficial_b_fallback` режима.
- `content/sources/sources.json` и `content/sources/originals/bandinopla-simulador-test-de-conducir/LICENSE`: локальная provenance запись upstream, commit pin и Apache-2.0 license text уже внутри source archive, но не как distribution-level root attribution.
- `package.json`, Git remote и существующие screenshot evidence paths: текущие команды, зависимости, repository URL и доступные кандидаты для README visuals.

## External Research

- [Apache Software Foundation — Applying the Apache License, Version 2.0](https://www.apache.org/legal/apply-license): первичная справка подтверждает distribution-level `LICENSE` и корректный `NOTICE` для применения Apache-2.0, а также роль NOTICE в сохранении атрибуции; не заменяет текст самой лицензии или юридическую консультацию.
- [Apache Software Foundation — Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0): первичный текст лицензии, который должен быть использован без пересказа при выборе/копировании Apache-2.0.
- [GCBA — Términos y Condiciones](https://buenosaires.gob.ar/terminos-y-condiciones): опубликованные условия сайта на момент intake указывают CC BY 2.5 Argentina для контента GCBA и требуют атрибуции; Architect/Implementation должны отдельно подтвердить применимость к каждому архивированному HTML/PDF/Boletín Oficial материалу и зафиксировать checked date, потому что отдельные документы или third-party элементы могут иметь иные условия.
- [Creative Commons — CC BY 2.5 Argentina legal code](https://creativecommons.org/licenses/by/2.5/ar/legalcode): первичный legal code лицензии, на которую ссылаются условия GCBA; нужен для точной attribution формулировки и ограничений, а не для обещания полной юридической очистки.

Исследование ограничено первичными публичными источниками. Intake не является юридической консультацией; спорные права на отдельные материалы должны приводить к консервативной пометке/исключению и owner/legal review, а не к категоричному утверждению о разрешении.

## Problem Statement

Публичная точка входа Cabadrive не отражает фактическое состояние продукта и не даёт пользователю достаточной инструкции, а distribution-level лицензионная и attribution документация отсутствует. Репозиторий использует Apache-2.0 upstream банк вопросов и хранит/перерабатывает материалы официальных источников, но корневые `LICENSE`/`NOTICE`, ясная атрибуция, базовые contribution/security правила и пользовательская UI-страница «О приложении» отсутствуют. Это создаёт юридическую неопределённость, риск потери обязательной атрибуции и вводит людей/агентов в заблуждение устаревшим README.

## Proposed Outcome Or Workflow

1. Репозиторий получает выбранную владельцем root license `Apache-2.0` для собственного кода и distribution-level NOTICE/third-party license inventory, сохраняющие атрибуцию `bandinopla/simulador-test-de-conducir` и точно описывающие статус официальных материалов GCBA/BORA.
2. README становится актуальной двуязычной точкой входа: кратко описывает продукт и аудиторию, показывает проверенные скриншоты, даёт пользовательский Docker quick start и developer commands, объясняет структуру репозитория и содержит видимую attribution секцию без ослабления unofficial disclaimers.
3. `CONTRIBUTING.md` направляет в `AGENTS.md`, фиксирует PR-only workflow и актуальный preflight; `SECURITY.md` публикует подтверждённый канал приватного сообщения об уязвимости и безопасные ожидания disclosure.
4. Из UI доступна локальная страница/секция «О приложении» с версией или воспроизводимым version source, источниками, дисклеймерами, repository link и атрибуцией; она работает offline и не добавляет runtime network dependency.
5. Verification evidence включает ручную вычитку ссылок и лицензий, проверку GitHub-rendered README images, автоматические content/build/test gates и e2e для пользовательской навигации/атрибуции. Cleanup выполняется только при отдельном назначении Cleanup Agent и не затрагивает активные или неоднозначные environments.

## Role Boundaries Or Affected Actors

- Владелец: уже выбрал `Apache-2.0` для собственного кода; подтверждает security contact, только если в repository settings/approved project metadata нет пригодного приватного reporting path; при неочевидной применимости лицензий официальных материалов принимает решение после legal review.
- Orchestrator: координирует отдельные роли/PR slices, фиксирует cycle PR set, не редактирует repository files, маршрутизирует feedback и проводит финальные guards/finalization.
- Analyst: владеет только этим intake artifact и поздними append-only final validation notes по явному назначению Orchestrator.
- Architect: превращает outcome в `spec.md`, `plan.md`, `tasks.md`; явно определяет license/NOTICE inventory, route/section решение, version source, screenshot evidence, validation matrix и handling юридически неопределённых материалов; не пишет implementation files.
- Implementation Agent: меняет только назначенные файлы в изолированном task slice после полной feature memory, сохраняет disclaimers и записывает evidence/feedback; не принимает лицензионные owner decisions.
- Review Agent: проверяет полноту атрибуции, вводящие в заблуждение claims, ссылки, UI accessibility/offline boundary, тесты и process compliance без изменения файлов.
- Cleanup Agent: только по отдельному Orchestrator assignment выполняет dry-run inventory и positive-proof cleanup в одобренных roots; сохраняет active/dirty/untracked/unpushed/open-PR/ambiguous/user-owned targets и передаёт evidence/refusal record.

## Artifact And Handoff Expectations

- Analyst пишет только этот `feature-request.md` во время intake.
- Non-Orchestrator active models не создают implementation changes до Orchestrator routing.
- Requirement clarification инициируется только Analyst и передаётся пользователю через Orchestrator.
- После handoff Analyst завершает работу до явного вызова final Analyst validation после успешной final Architect validation или нового intake assignment.
- Architect начинает с этого artifact и пишет `spec.md`, `plan.md`, `tasks.md`.
- Implementation начинается только после полной feature memory и назначения Orchestrator изолированного worktree, branch и PR slice.
- Handoff context: `/Users/chap/devel/cabadrive-worktrees/043-license-attribution`, `codex/043-license-attribution`, `specs/043-license-attribution/`; parallel work возможно, все sibling diffs/branches/commits/PR/process memory сохраняются.
- Этот latest-main Analyst handoff context может продолжить Architect planning и стать единственным implementation PR slice только по явному решению Orchestrator. Дополнительные task slices требуют отдельных latest-main worktrees/branches/PRs.
- Intake worktree активен и исключён из cleanup; возможный cleanup не подразумевается автоматически завершением feature.

## Open Questions And Risks

- Owner decision по FR-1 закрыт: собственный код Cabadrive — `Apache-2.0`. Риск остаётся только в точном определении copyright holder/year и разграничении root project license с отдельными third-party/content условиями; эти сведения нельзя выдумывать.
- Open verification для `SECURITY.md`: сначала проверить repository security advisory/private reporting workflow и утверждённую project metadata. Если пригодного приватного канала нет, Orchestrator запрашивает owner contact; выдуманный email или публичный issue как основной канал недопустимы.
- Требуется доказуемая проверка области действия GCBA CC BY 2.5 Argentina и исключений для каждого распространяемого source type, особенно PDF, Boletín Oficial, logos/marks и возможного third-party artwork. Опубликованные общие site terms — сильный исходный сигнал, но не достаточны для безусловного blanket claim.
- Неизвестно, содержит ли upstream собственный `NOTICE`; Implementation должен проверить pinned upstream tree. Отсутствие upstream NOTICE не отменяет сохранение license/copyright/provenance, а наличие требует переноса релевантных notices.
- Формулировка ТЗ «юридическая чистота» не должна превращаться в гарантию или legal certification. Acceptance должна требовать проверяемую attribution/licensing documentation и явную фиксацию unresolved legal review.
- UI «О приложении» связан с будущим ТЗ-05 routing и ТЗ-P1 Home improvements. Текущий slice должен выбрать минимальную доступную навигацию без преждевременной реализации всей будущей routing архитектуры и без создания конфликтующего временного route contract.
- README screenshots могут быстро устаревать и увеличивают repo weight. Нужны стабильные 2–3 изображения, проверка relative links на GitHub и решение, какие existing evidence assets допустимо переиспользовать.
- Статическая SPA не имеет очевидного release version source. Architect должен определить детерминированный механизм, который не требует backend/network и не показывает ложную версию.
- Большой общий запрос намеренно разделён: ТЗ-22 не должен затянуть в этот PR ТЗ-16 или другие independent improvements.
- Любой cleanup остаётся отдельным scope; текущие и sibling worktrees нельзя удалять на основании имени или возраста.

## Acceptance Expectations

- В корне находятся выбранный владельцем точный `Apache-2.0` `LICENSE` и согласованный `NOTICE`; third-party license inventory содержит точный неизменённый Apache-2.0 текст для pinned upstream и проверяемую provenance/атрибуцию, при этом scope лицензии собственного кода не смешан с лицензиями/условиями контента.
- NOTICE/README не утверждают blanket permission для материалов GCBA/BORA: для каждого класса материала зафиксированы source URL, применимые опубликованные условия/лицензия, checked date, attribution и исключение/owner review при неопределённости.
- README больше не содержит `No product runtime scaffold is committed yet` или других утверждений, противоречащих реализованному React/Vite приложению; RU+EN description, user/developer quick starts, актуальные команды/структура, attribution и 2–3 GitHub-renderable screenshots проверены evidence.
- Пользовательский quick start следует Docker-only contract (`make build`, `make up`, URL `http://localhost:5173`, `make down`) и не требует host Node/pnpm; developer section не смешивает end-user runtime с host-only инструкциями.
- `CONTRIBUTING.md` ссылается на `AGENTS.md`, PR-only workflow и фактическую preflight command; `SECURITY.md` содержит подтверждённый приватный reporting path, supported expectations и не раскрывает секреты.
- Доступная из UI страница/секция «О приложении» показывает детерминированную версию/идентификатор сборки, canonical content-mode disclaimers, upstream/official source attribution и HTTPS repository link; работает offline, доступна с клавиатуры и не ослабляет `validate-content.mjs` gates.
- Автоматические проверки покрывают route/section accessibility и обязательный attribution text; минимум e2e подтверждает доступ к «О приложении». Текущие `pnpm run validate:content`, test/build/e2e и repository preflight проходят на current head согласно Architect validation matrix.
- Negative scenario: ни README, ни UI, ни NOTICE не называют fallback bank официальной/полной GCBA базой и не представляют русские переводы/объяснения официальным текстом.
- Process memory содержит решения, evidence, dead ends, known issues и все Implementation Agent feedback с Architect disposition; final Architect validation предшествует final Analyst validation для одного effective content head.
- Orchestrator фиксирует latest-main startup evidence для каждого дополнительного slice и финальный read-only guard. Cleanup evidence требуется только для явно назначенного cleanup scope; иначе фиксируется `not applicable`, а active/sibling environments сохраняются.

## Final Analyst Validation Notes

Append-only Analyst-owned section используется только после явного вызова Orchestrator и успешной final Architect validation.

- Analyst validation pass: passed
- Analyst return count for this work cycle: 0
- Final Analyst validation completed at: 2026-07-17T14:34:44Z
- Analyst validated effective content head: 190cbb8f9de6e2f1341b774b478e546f350aacee
- Customer intent check: passed. Первый приоритетный срез запроса реализует ТЗ-22 в духе и букве intake: выбранная владельцем Apache-2.0 лицензия, NOTICE и точная upstream-атрибуция отделены от осторожно квалифицированных условий официальных/third-party материалов; актуальный RU+EN README содержит Docker-only quick start, структуру, attribution и три проверенных экрана; CONTRIBUTING и подтверждённый GitHub Private Vulnerability Reporting channel закрывают базовые process/security ожидания; доступная с клавиатуры offline-страница «О приложении» показывает версию, канонический content mode, источник, repository link и неофициальные границы.
- Outcome evidence: root и pinned upstream Apache texts совпадают побайтно; `pnpm run validate:attribution` прошёл; focused license/screenshot tests прошли 10/10; три committed PNG имеют заявленные 1440×900 identities и GitHub-path evidence, а независимый JPEG decode подтверждает, что наблюдавшиеся только в Codex PNG preview чёрные прямоугольники не являются содержимым `materials.png`; private vulnerability reporting API возвращает `enabled: true`; effective-head-to-current delta содержит только `specs/043-license-attribution/tasks.md`; все семь review threads разрешены. Записанные full preflight, 495/495 Node, 104/104 E2E, Docker smoke и exact-head review evidence покрывают acceptance и review fixes.
- Gaps, if any: none. README/UI/NOTICE не называют fallback bank официальной или полной базой GCBA, не представляют русскую поддержку официальной и не распространяют root Apache-2.0 на bundled content. Текущие CI checks, перезапущенные evidence-only Architect commit, остаются downstream Orchestrator final-guard gate, а не Analyst content gap.
- Architect disposition routing: Orchestrator обязан передать любой Analyst feedback Architect для accept/task/ticket/dispose до follow-up development.
- Analyst limit escalation: если следующий gap превысит 5 возвратов, Analyst создаёт новый feature request в отдельном latest-main branch/worktree и фиксирует handoff.
- Analyst boundary reminder: не редактировать Architect artifacts, code, reviews, commits, pushes, PR/merge state или файлы вне Analyst-owned intake/final-validation notes, кроме нового feature request при limit-exceeded escalation.
