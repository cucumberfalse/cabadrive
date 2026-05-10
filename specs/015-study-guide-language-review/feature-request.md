# Feature Request: Study Guide Language Review

## Request Intake

Review and rewrite the Russian prose in the topic study guide because the current text reads as uninteresting and difficult.

The requested direction is simple, clear Russian that a teenager could comfortably read, while still speaking to the real Cabadrive user: an experienced driver from Russia preparing for the CABA theory exam. The guide should not sound childish, academic, bureaucratic, or like a literal legal translation. It should help the learner quickly understand what to do on the exam and why the answer pattern matters.

This is a repository-changing request and this artifact is the Analyst intake for feature `015-study-guide-language-review`.

## Original User Request

The user asked in Russian for the study-guide texts to be reviewed because they are boring and hard to read.

Requested rewrite direction:

- use simple, clear Russian, as if a teenager would read it;
- preserve the target context: an experienced driver from Russia preparing for the CABA exam;
- highlight differences from Russian Federation driving rules where important;
- still remind the learner of basic rules even when they match Russian Federation practice;
- cover all study-guide texts;
- coordinate with other agents and avoid conflicts with active translation fixes.

The user explicitly asked Orchestrator to coordinate around active parallel work and avoid touching the translation-fix work from PR #63 / feature 009.

## Clarifying Status

No additional user Q&A was needed for this intake. The Orchestrator assignment provided enough scope, current project context, and coordination constraints for Architect planning.

If later planning discovers that "all texts" could include product UI copy outside the topic-guide content artifact, Architect should split that into a separate coordinated slice instead of broadening this feature silently.

## Project Context

Cabadrive is a local-first web trainer for Russian-speaking drivers preparing for the CABA theory exam. Official Spanish material remains primary. Russian guide text, explanations, vocabulary support, trap notes, and similar learning aids are unofficial support layers.

Current content mode is `unofficial_b_fallback`, not a complete official GCBA category B question bank. The current local question bank contains 460 category B fallback questions.

The current topic study guide content lives at:

```text
content/guide/topic-study-guide.ru.json
```

The active guide source is the completed-enough output of feature `006-topic-study-guide`. It currently has 38 topics, 460 questions / 639 guide placements on main, and status `draft`. The guide is a content source for `Материалы`; UI and final release gate tasks remain open in feature 006.

This new request is a language-quality and readability pass over existing study-guide prose. It is not:

- a factual or legal source-trace expansion;
- a translation-shard fix;
- an explanation-shard fix;
- an image-metadata fix;
- a final UI gate for feature 006;
- a claim that the fallback question bank is official or complete.

## Coordination Constraints

Parallel orchestrators and agents may be active. Implementation must preserve existing dirty diffs, branches, commits, PRs, and process memory.

Use feature id `015-study-guide-language-review` because known in-flight work already occupies or may occupy 012, 013, and 014. The current main checkout did not show those folders, but this intake follows the Orchestrator coordination instruction to avoid namespace collisions.

While PR #63 / feature 009 translation work is active, implementation for this feature must not touch:

- `content/translations/*`
- `content/explanations/*`
- `content/image-metadata/*`
- `content/validation/*`
- validators, tests, or docs that belong to that translation/explanation/image-metadata validation slice

If later product wording needs translation-shard changes, those changes must be routed as a separate coordinated feature or task slice.

## Source Review

Internal repository memory read for intake:

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/006-topic-study-guide/feature-request.md`
- `specs/006-topic-study-guide/spec.md`
- `specs/006-topic-study-guide/plan.md`
- `specs/006-topic-study-guide/tasks.md`
- read-only spot checks of `content/guide/topic-study-guide.ru.json`, `content/guide/topic-study-guide.coverage.json`, and `content/questions/caba-b.unofficial-fallback.questions.json`

No external research was needed for intake because this is a style, readability, and content-quality request over existing study-guide material.

Implementation must not change factual, legal, numeric, procedural, or source-sensitive claims unless the change is verified by existing source trace and archived source evidence, or routed back to Architect for explicit disposition.

## Scope Expectations

In scope:

- Define a shared Russian style rubric for the topic study guide before large-scale rewriting starts.
- Review all Russian study-guide learning text across every topic.
- Rewrite text to be simpler, clearer, more direct, and more useful for quick exam preparation.
- Preserve the experienced-driver-from-Russia perspective.
- Highlight CABA/RF differences where they matter for the exam or likely learner intuition.
- Keep reminders of basic rules even when the rule matches common РФ practice.
- Preserve concise exam focus: help answer the tickets, not create a general driving school or Spanish course.
- Preserve official/unofficial status, fallback-bank status, source-trace relationships, IDs, schema shape, and validator expectations.
- Keep Spanish exam terms where useful, with clear Russian support.
- Keep source-conflict and stale-ticket warnings visible where they already exist.

Out of scope for this intake:

- Rewriting `content/translations/*` or `content/explanations/*`.
- Adding new official sources or expanding the official-documents archive.
- Reclassifying topic taxonomy or ticket placement except where Architect explicitly scopes a later cleanup.
- Changing product UI navigation or completing feature 006 final UI gates.
- Changing canonical Spanish question text, answer IDs, source IDs, image references, coverage manifests, or source-trace semantics unless Architect plans a narrowly justified validation-safe change.

## Text Coverage Expectations

The implementation plan should define exactly which fields count as study-guide prose, but acceptance should cover at least:

- guide-level user-facing labels and disclaimer text that are part of the guide content;
- topic titles and summaries;
- `learningMaterialRu`;
- `practicalReasoningRu`;
- Russian translations or explanations inside `spanishTerms`;
- trap notes and misleading-pattern notes;
- ticket-level explanations;
- wrong-answer rationales;
- correct-answer rationales;
- source-conflict notes;
- stale-ticket notes;
- any other Russian learner-facing guide content stored inside `content/guide/topic-study-guide.ru.json`.

The rewrite must preserve machine-readable IDs, `questionId` references, answer references, source-trace references, topic IDs, status fields, and validation shape.

## Style Direction

The desired style should be simple but not sloppy:

- prefer short sentences and clear verbs;
- explain the point before the edge case;
- avoid legalistic or bureaucratic Russian unless the term itself is important for the exam;
- avoid inflated "textbook" phrasing;
- keep Spanish terms when they help recognize ticket wording;
- explain CABA/RF differences plainly, without turning the guide into a comparative law manual;
- remind basic rules directly, even if an experienced driver may already know them;
- keep warnings and traps easy to scan;
- keep factual uncertainty explicit where current guide content already marks stale or conflicting ticket wording.

## Likely Implementation Shape

The work should probably be sliced by topic groups or topic ranges to avoid one giant PR. A first implementation slice should establish the shared style rubric and an inventory method, then later slices should rewrite bounded groups of topics.

Architect should consider requiring each rewrite slice to record:

- topic IDs covered;
- fields reviewed;
- fields changed;
- validation commands run;
- any source-sensitive sentence that was left unchanged because a style rewrite would risk changing meaning;
- any unclear or fact-sensitive text routed for Architect disposition.

## Acceptance Expectations

The eventual implementation should be accepted only when evidence shows:

- a shared style rubric exists before bulk rewriting begins;
- every Russian learner-facing text field in `content/guide/topic-study-guide.ru.json` has been reviewed or explicitly marked out of scope by Architect;
- all 38 guide topics are covered by rewrite/review evidence;
- all 460 current questions and 639 guide placements remain represented as before, unless Architect explicitly scopes and validates a separate placement change;
- IDs, topic IDs, question IDs, answer IDs, source-trace links, status fields, official/unofficial labels, and validator shape are preserved;
- guide status and fallback-bank clarity remain accurate;
- rewritten prose is simpler, clearer, and more direct while keeping the experienced Russian driver / CABA exam context;
- CABA/RF differences are highlighted where important;
- basic rules are still explained where useful even when they match РФ practice;
- trap notes, ticket explanations, wrong-answer rationales, stale-ticket notes, and source-conflict notes remain present and easier to understand;
- no new factual/legal/numeric/procedural claim is introduced without existing source-trace support or Architect disposition;
- no active PR #63 / feature 009 translation, explanation, image-metadata, validation, validator, test, or docs work is touched by this feature while that work is active;
- local content validation and any relevant guide tests pass for each implementation slice;
- process memory records decisions, known issues, source-sensitive sentences, dead ends, and verification evidence.

## Risks

- A readability rewrite can accidentally change legal meaning, numeric limits, priority rules, stale-ticket caveats, or source-conflict boundaries.
- Making the text "for a teenager" could drift into childish language; the intended tone is clear and direct, still respectful of an experienced adult driver.
- Rewriting all 38 topics in one PR would be hard to review and likely to collide with parallel content work.
- The guide is still draft; a language-quality pass must not imply the guide is final or fully released in the UI.
- Existing feature 006 process memory contains many source-boundary decisions. A stylistic rewrite must not erase or weaken those decisions.
- Active feature 009 translation work may touch adjacent content concepts; this feature must avoid those files to prevent merge conflicts and responsibility confusion.

## Open Questions For Architect

- What exact style rubric should govern sentence length, tone, Spanish term retention, and CABA/RF comparison notes?
- Should the rewrite be sliced by topic order, topic category, content readiness phase, or source-risk level?
- What automated or checklist evidence should prove every relevant Russian guide field was reviewed?
- Should topic titles and summaries be rewritten in the same slices as body prose, or handled in a first consistency pass?
- How should implementation flag sentences that are hard to simplify without rechecking source trace?
- Should any UI copy outside `content/guide/topic-study-guide.ru.json` be included later, or remain a separate coordinated product-wording feature?
- What review standard should decide that rewritten prose is "simple enough" without making the guide too casual?
