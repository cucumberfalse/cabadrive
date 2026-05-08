# Data Model

## Principles

- Официальный текст хранится отдельно от переводов и комментариев.
- Каждый официальный фрагмент связан с источником.
- Каждый объект имеет jurisdiction.
- Все изменения контента должны быть проверяемыми через Git diff.
- Данные должны быть удобны для генерации статического web build.
- Требования, зависящие от research, должны иметь явный статус: `defined`, `assumed` или `to_verify`.

## Source

```ts
type Source = {
  id: string;
  title: string;
  officialUrl?: string;
  localPath?: string;
  sourceType: "pdf" | "html" | "scan" | "image" | "dataset" | "law" | "other";
  jurisdiction: "CABA" | "Provincia de Buenos Aires" | "Argentina national" | "unknown";
  publicationDate?: string;
  checkedAt: string;
  status: "current" | "outdated" | "unknown" | "superseded";
  licenseNote?: string;
  retrievalNote?: string;
  hashAlgorithm: "sha256";
  hash: string;
};
```

`hash` обязателен для всех источников, которые используются в production content. Источник без hash может существовать только как discovery note вне production source registry.

## RequirementStatus

```ts
type RequirementStatus = "defined" | "assumed" | "to_verify";
```

`defined` означает, что требование подтверждено официальным источником. `assumed` допустим только для UX или implementation planning и должен иметь заметку. `to_verify` блокирует production usage для official content и exact exam simulation.

## Question

```ts
type Question = {
  id: string;
  sourceId: string;
  jurisdiction: Source["jurisdiction"];
  officialTextEs: string;
  translationRu?: Translation;
  answers: Answer[];
  correctAnswerId: string;
  topics: string[];
  vocabularyTermIds: string[];
  difficulty?: "low" | "medium" | "high";
  status: "draft" | "validated" | "needs_review" | "deprecated";
  validation: ContentValidation;
};
```

## Answer

```ts
type Answer = {
  id: string;
  officialTextEs: string;
  translationRu?: Translation;
};
```

## Translation

```ts
type Translation = {
  textRu: string;
  method: "human" | "machine_draft" | "human_reviewed_machine";
  reviewer?: string;
  reviewedAt?: string;
  disclaimer: string;
  terminologyVersion?: string;
};
```

## Explanation

```ts
type Explanation = {
  questionId: string;
  textRu: string;
  explanationType: "rule" | "vocabulary" | "exam_trick" | "rf_difference" | "procedure";
  relatedSourceIds: string[];
  disclaimer: string;
  reviewedBy?: string;
  reviewedAt?: string;
};
```

## VocabularyTerm

```ts
type VocabularyTerm = {
  id: string;
  termEs: string;
  translationRu: string;
  category: string;
  explanationRu: string;
  examples: VocabularyExample[];
  criticality: "low" | "medium" | "high";
  sourceQuestionIds: string[];
};
```

## RuleDifference

```ts
type RuleDifference = {
  id: string;
  title: string;
  topic: string;
  cabaRuleSummaryRu: string;
  rfContrastRu: string;
  sourceIds: string[];
  relatedQuestionIds: string[];
  confidence: "verified" | "needs_review";
  disclaimer: string;
};
```

## Topic

```ts
type Topic = {
  id: string;
  titleRu: string;
  titleEs?: string;
  parentId?: string;
  priority: "low" | "medium" | "high";
  examRelevanceNote?: string;
};
```

## ExamFormatConfig

```ts
type ExamFormatConfig = {
  jurisdiction: "CABA";
  sourceId: string;
  officialUrl?: string;
  localPath?: string;
  sourceHash: string;
  checkedAt: string;
  questionCount: number;
  timeLimitMinutes: number;
  passingScore: number;
  scoringRule: string;
  canSkipQuestion: boolean;
  questionOrderRule: string;
  completionRule: string;
  status: RequirementStatus;
  notes?: string;
};
```

Production exam mode может использовать только config со статусом `defined`, валидным `sourceId` и совпадающим `sourceHash`. Config со статусом `assumed` или `to_verify` допускается только для approximate practice mode с явной пометкой в UI.

## ExamSession

```ts
type ExamSession = {
  id: string;
  startedAt: string;
  finishedAt?: string;
  mode: "learning" | "exam";
  questionIds: string[];
  answers: UserQuestionAnswer[];
  score?: number;
  passed?: boolean;
};
```

## UserQuestionAnswer

```ts
type UserQuestionAnswer = {
  questionId: string;
  selectedAnswerId?: string;
  isCorrect?: boolean;
  answeredAt?: string;
  timeSpentMs?: number;
  usedTranslation: boolean;
  usedExplanation: boolean;
};
```

## ContentValidation

```ts
type ContentValidation = {
  officialTextMatched: boolean;
  answersMatched: boolean;
  correctAnswerMatched: boolean;
  sourceChecked: boolean;
  jurisdictionChecked: boolean;
  approvalId?: string;
  validatedBy?: string;
  validatedAt?: string;
  notes?: string;
};
```

Для production question со статусом `validated` поле `approvalId` обязательно и должно ссылаться на `OfficialContentApproval`.

## OfficialContentApproval

```ts
type OfficialContentApproval = {
  id: string;
  approvedBy: string;
  approvedAt: string;
  scope: "source" | "question" | "question_set" | "translation" | "explanation";
  sourceIds: string[];
  questionIds?: string[];
  contentDiffHash: string;
  sourceHashes: Record<string, string>;
  evidenceBundlePath: string;
  reviewMode: "two_person_review" | "solo_self_audit" | "external_review";
  soloSelfAudit: boolean;
  releaseReadiness: "content_approved" | "needs_external_review";
  status: "approved" | "rejected" | "revoked";
  note?: string;
};
```

## SoloReleaseException

```ts
type SoloReleaseException = {
  id: string;
  createdAt: string;
  expiresAt: string;
  releaseType: "local_private_mvp" | "research_preview";
  scope: "source" | "question" | "question_set";
  sourceIds: string[];
  questionIds?: string[];
  approvalIds: string[];
  evidenceBundlePath: string;
  reason: string;
  followUpReviewTask: string;
  allowedClaims: string[];
  blockedClaims: string[];
  status: "active" | "expired" | "revoked" | "resolved";
};
```

Solo release exception не меняет `OfficialContentApproval.releaseReadiness` на `content_approved`. Оно только разрешает ограниченную сборку с явной маркировкой pending external review.

## ProductionContentEligibility

```ts
type ProductionContentEligibility = {
  allowedSourceStatuses: ["current"];
  allowedJurisdictions: ["CABA", "Argentina national"];
  requireSourceHash: true;
  requireQuestionApprovalId: true;
  requireTranslationDisclaimer: true;
  requireExplanationDisclaimer: true;
  requireExamFormatDefinedForExactSimulation: true;
};
```

Canonical policy path:

```text
content/validation/production-eligibility.policy.json
```

Validation scripts, CI gates and export scripts must consume the same policy file.

## Storage Layout Proposal

```text
content/
  config/
    caba-exam-format.json
  sources/
    sources.json
    originals/
  questions/
    caba.questions.json
  translations/
    ru.translations.json
  explanations/
    ru.explanations.json
  vocabulary/
    ru.vocabulary.json
  guide/
    ru.condensed-guide.md
  validation/
    validator-approvals.json
    release-exceptions.json
    production-eligibility.policy.json
    validation-report.json
```
