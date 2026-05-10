import contentMode from "../../content/meta/content-mode.json";
import examFormat from "../../content/config/caba-exam-format.json";
import sources from "../../content/sources/sources.json";
import questions from "../../content/questions/caba-b.unofficial-fallback.questions.json";
import vocabulary from "../../content/vocabulary/ru.vocabulary.json";
import guide from "../../content/guide/ru.condensed-guide.json";
import cabaExamProcessGuideJson from "../../content/guide/caba-exam-process.ru.json";
import topicStudyGuideJson from "../../content/guide/topic-study-guide.ru.json";
import imageOverlaysJson from "../../content/image-overlays/question-explanation-overlays.manifest.json";

export type Answer = {
  id: string;
  officialTextEs: string;
};

export type DifficultyLevel = "green" | "blue" | "yellow" | "red";

export type DifficultyDimension =
  | "simple_common_spanish"
  | "spanish_lexical_load"
  | "legal_admin_terms"
  | "caba_rf_divergence"
  | "rule_complexity"
  | "numbers_thresholds"
  | "trap_negation"
  | "visual_cue_load"
  | "cross_topic_dependence";

export type DifficultyMeta = {
  rubricVersion: "cabadrive-difficulty-v1";
  dimensions: DifficultyDimension[];
  rationaleRu: string;
  provenance: {
    method: "manual_rubric_review";
    reviewer: string;
    reviewedAt: string;
  };
  sourceFingerprint: string;
};

export type TopicDifficultyBasis = {
  questionLevelCounts: Record<DifficultyLevel, number>;
  ticketQuestionIdsSha256: string;
  dominantDimensions: DifficultyDimension[];
};

export type TopicDifficultyMeta = DifficultyMeta & {
  basis: TopicDifficultyBasis;
};

export type Question = {
  id: string;
  sourceId: string;
  jurisdiction: "CABA";
  category: "B";
  contentStatus: "unofficial_fallback";
  officialTextEs: string;
  answers: Answer[];
  correctAnswerId: string;
  image?: {
    altEs: string;
    originalUrl: string;
    localPath: string;
    sha256: string;
  };
  topics: string[];
  vocabularyTermIds: string[];
  difficulty: DifficultyLevel;
  difficultyMeta: DifficultyMeta;
  flags: {
    hasImage: boolean;
    hasNegationOrException: boolean;
  };
  status: "needs_review";
};

export type TopicGuideStatus = "draft" | "published";
export type TopicGuideContentStatus = "unofficial_learning_aid";

export type TopicGuideAnswerExplanation = {
  answerId: string;
  verdict: "correct" | "incorrect";
  explanationRu: string;
};

export type TopicGuideTicket = {
  questionId: string;
  answerExplanations: TopicGuideAnswerExplanation[];
  imageLocalPath?: string;
  sourceConflictNoteRu?: string;
};

export type TopicGuideTerm = {
  id: string;
  termEs: string;
  translationRu: string;
  sourceQuestionIds: string[];
};

export type TopicGuideTrapNote = {
  id?: string;
  textRu: string;
  sourceQuestionIds?: string[];
};

export type TopicGuideTopic = {
  id: string;
  slug: string;
  status: TopicGuideStatus;
  difficulty: DifficultyLevel;
  difficultyMeta: TopicDifficultyMeta;
  titleRu: string;
  summaryRu: string;
  learningMaterialRu: string[];
  practicalReasoningRu?: string[];
  spanishTerms: TopicGuideTerm[];
  tickets: TopicGuideTicket[];
  trapNotes?: TopicGuideTrapNote[];
};

export type TopicStudyGuide = {
  version: number;
  id: string;
  locale: "ru";
  status: TopicGuideStatus;
  contentStatus: TopicGuideContentStatus;
  titleRu: string;
  disclaimer: string;
  topics: TopicGuideTopic[];
};

export type ProcessGuideSource = {
  id: string;
  title: string;
  url: string;
  checkedAt: string;
  officialOwner: "GCBA" | "ANSV" | "Gobierno Argentino";
  currentnessStatus: "checked_current" | "checked_current_with_historico_url" | "volatile_check_required";
  resultRu: string;
};

export type ProcessGuideSection = {
  id: string;
  titleRu: string;
  summaryRu?: string;
  bodyRu: string[];
  spanishTerms?: string[];
  sourceIds: string[];
  calloutType: "required_step" | "optional_preparation" | "adjacent_path" | "warning";
  volatility?: "stable_procedure" | "volatile_fee" | "volatile_location" | "volatile_screen" | "volatile_document_list";
  volatilityWarningRu?: string;
};

export type ProcessGuideOfficialLink = {
  sourceId: string;
  labelRu: string;
  url: string;
};

export type ProcessGuideOfficialLinkGroup = {
  id: string;
  titleRu: string;
  links: ProcessGuideOfficialLink[];
};

export type ProcessGuideGlossaryTerm = {
  id: string;
  termEs: string;
  translationRu: string;
  explanationRu: string;
  sourceIds: string[];
};

export type CabaExamProcessGuide = {
  version: number;
  id: "caba-exam-process";
  locale: "ru";
  status: "draft" | "published";
  contentStatus: "unofficial_learning_aid";
  titleRu: string;
  primaryScope: {
    jurisdiction: "CABA";
    procedure: "otorgamiento";
    category: "B1";
    audienceRu: string;
  };
  lastReviewedAt: string;
  disclaimerRu: string;
  officialActionWarningRu: string;
  volatilityWarningRu: string;
  communityContextRu: string;
  sources: ProcessGuideSource[];
  sections: ProcessGuideSection[];
  officialLinks: ProcessGuideOfficialLinkGroup[];
  glossary: ProcessGuideGlossaryTerm[];
  optionalImages: never[];
};

export type Translation = {
  questionId: string;
  questionTextRu: string;
  answerTranslations: Record<string, string>;
  disclaimer: string;
};

export type Explanation = {
  questionId: string;
  textRu: string;
  correctAnswerId: string;
  correctAnswerExplanationRu: string;
  wrongAnswerExplanations: Record<string, string>;
  explanationType: string;
  claimScope?: "direct_ticket" | "direct_image" | "ticket_specific_fallback" | "current_official_source";
  relatedSourceIds: string[];
  imageDetailReferences?: string[];
  disclaimer: string;
};

export type OverlaySourceRole = "answer_critical_highlight" | "supporting" | "distractor_trap" | "background_irrelevant_dim";

export type ImageExplanationOverlayRegion = {
  overlayRegionId: string;
  sourceRole: OverlaySourceRole;
  relevanceId: string;
  detailIds: string[];
  regionIds: string[];
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  labelRu?: string;
};

export type ImageExplanationOverlay = {
  overlayId: string;
  status: "approved";
  questionId: string;
  imageId: string;
  localPath: string;
  imageSha256: string;
  questionFingerprint: string;
  metadataFingerprint: string;
  usageFingerprint: string;
  relevanceIds: string[];
  referencedDetailIds: string[];
  referencedRegionIds: string[];
  regions: ImageExplanationOverlayRegion[];
};

export type ImageOverlayManifest = {
  version: number;
  contentKind: "question-image-explanation-overlays";
  overlays: ImageExplanationOverlay[];
};

export type ProgressAnswer = {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  answeredAt: string;
  mode: "learning" | "exam" | "mistakes";
};

type ContentShard<T> = {
  range: {
    id: string;
    start: number;
    end: number;
  };
  entries: T[];
};

function collectShardEntries<T>(modules: Record<string, unknown>, label: string): T[] {
  return Object.entries(modules)
    .map(([path, module]) => {
      const shard = (module as { default: ContentShard<T> }).default;
      if (!shard?.range || !Array.isArray(shard.entries)) {
        throw new Error(`${label} shard ${path} is malformed.`);
      }
      return { path, shard };
    })
    .sort((a, b) => a.shard.range.start - b.shard.range.start || a.path.localeCompare(b.path))
    .flatMap(({ shard }) => shard.entries);
}

const translations = collectShardEntries<Translation>(
  import.meta.glob("../../content/translations/ru/*.json", { eager: true }),
  "Russian translation"
);
const explanations = collectShardEntries<Explanation>(
  import.meta.glob("../../content/explanations/ru/*.json", { eager: true }),
  "Russian explanation"
);

export const data = {
  contentMode,
  examFormat,
  sources,
  questions: questions as Question[],
  translations: translations as Translation[],
  explanations: explanations as Explanation[],
  imageOverlays: (imageOverlaysJson as ImageOverlayManifest).overlays,
  vocabulary,
  guide,
  cabaExamProcessGuide: cabaExamProcessGuideJson as CabaExamProcessGuide,
  topicStudyGuide: topicStudyGuideJson as TopicStudyGuide
};

export const translationByQuestion = new Map(data.translations.map((item) => [item.questionId, item]));
export const explanationByQuestion = new Map(data.explanations.map((item) => [item.questionId, item]));
export const imageOverlayByQuestion = new Map(data.imageOverlays.filter((item) => item.status === "approved").map((item) => [item.questionId, item]));
export const sourceById = new Map(data.sources.map((source) => [source.id, source]));
export const questionById = new Map(data.questions.map((question) => [question.id, question]));

export function assetUrl(localPath: string) {
  return `/${localPath}`;
}
