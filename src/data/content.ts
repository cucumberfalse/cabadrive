import contentMode from "../../content/meta/content-mode.json";
import examFormat from "../../content/config/caba-exam-format.json";
import sources from "../../content/sources/sources.json";
import questions from "../../content/questions/caba-b.unofficial-fallback.questions.json";
import vocabulary from "../../content/vocabulary/ru.vocabulary.json";
import guide from "../../content/guide/ru.condensed-guide.json";
import cabaExamProcessGuideJson from "../../content/guide/caba-exam-process.ru.json";
import topicStudyGuideJson from "../../content/guide/topic-study-guide.ru.json";
import officialDocumentsManifestJson from "../../content/official-documents/manifest.json";
import primarySourcesCoverageJson from "../../content/primary-sources/primary-sources.coverage.json";
import primarySourcesRootJson from "../../content/primary-sources/primary-sources.ru.json";
import primarySourcesQaJson from "../../content/primary-sources/primary-sources.qa.json";
import primarySourcesSearchJson from "../../content/primary-sources/primary-sources.search.json";

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

export type OfficialDocumentManifestEntry = {
  id: string;
  title: string;
  officialSourceType: string;
  sourceUrl: string;
  retrievalDate: string;
  localPath: string;
  currentness: {
    status: string;
    validationStatus: "pending" | "passed" | "failed";
    checkedAt?: string;
  };
  exactTextValidation: {
    status: "pending" | "passed" | "failed";
    notes?: string;
  };
};

export type OfficialDocumentsManifest = {
  version: number;
  status: string;
  schema: string;
  entries: OfficialDocumentManifestEntry[];
};

export type PrimarySourceQaRecord = {
  status: "draft" | "reviewed" | "approved";
  checkedAt?: string;
  methodNotes: string;
  reviewerNotes?: string;
};

export type PrimarySourceSpan = {
  startLine: number;
  endLine: number;
};

export type PrimarySourceCoverageChunk = {
  chunkId: string;
  officialDocumentId: string;
  order: number;
  headingPath: string[];
  officialLabel?: string;
  chunkingStrategy: string;
  sourceSpan: PrimarySourceSpan;
  sourceTextSha256: string;
  sourceFingerprint: string;
};

export type PrimarySourceCoverageDocument = {
  officialDocumentId: string;
  archiveLocalPath: string;
  archiveSha256: string;
  coverageStatus: string;
  chunkingDecision: {
    strategy: string;
    note: string;
  };
  expectedChunkIds: string[];
  chunks: PrimarySourceCoverageChunk[];
};

export type PrimarySourcesCoverage = {
  version: number;
  schema: string;
  status: string;
  documents: PrimarySourceCoverageDocument[];
};

export type PrimarySourceLearnerChunk = PrimarySourceCoverageChunk & {
  originalSpanish: string;
  fullTranslationRu: string;
  simpleRu: string;
};

export type PrimarySourceLearnerDocument = {
  officialDocumentId: string;
  title: string;
  shortTitleRu: string;
  category: string;
  jurisdiction: "caba" | "national" | "other";
  officialSourceType: string;
  sourceUrl: string;
  archiveLocalPath: string;
  retrievalDate: string;
  currentnessStatus: string;
  currentnessValidationStatus: "pending" | "passed" | "failed";
  exactTextValidationStatus: "pending" | "passed" | "failed";
  chunks: PrimarySourceLearnerChunk[];
};

export type PrimarySourceQaChunk = {
  chunkId: string;
  translationQa: PrimarySourceQaRecord;
  simplificationQa: PrimarySourceQaRecord;
};

export type PrimarySourceQaDocument = {
  officialDocumentId: string;
  chunks: PrimarySourceQaChunk[];
};

export type PrimarySourceSearchEntry = {
  entryId: string;
  officialDocumentId: string;
  chunkId: string;
  textFields: string[];
};

export type PrimarySourceSearchShard = {
  version: number;
  schema: "primary-sources-search-shard.v1";
  status: string;
  officialDocumentId: string;
  entries: PrimarySourceSearchEntry[];
};

export type PrimarySourceTranslationStatus = "approved" | "draft" | "partial" | "not_translated";

export type PrimarySourceReaderChunk = PrimarySourceCoverageChunk & {
  originalSpanish: string;
  fullTranslationRu?: string;
  simpleRu?: string;
  translationQa?: PrimarySourceQaRecord;
  simplificationQa?: PrimarySourceQaRecord;
  hasLearnerText: boolean;
};

export type PrimarySourceReaderDocument = {
  officialDocumentId: string;
  title: string;
  shortTitleRu: string;
  category: string;
  jurisdiction: "caba" | "national" | "other";
  officialSourceType: string;
  sourceUrl: string;
  archiveLocalPath: string;
  retrievalDate: string;
  currentnessStatus: string;
  currentnessValidationStatus: "pending" | "passed" | "failed";
  exactTextValidationStatus: "pending" | "passed" | "failed";
  coverageStatus: string;
  chunkingStrategy: string;
  chunkingNote: string;
  translationStatus: PrimarySourceTranslationStatus;
  translatedChunkCount: number;
  totalChunkCount: number;
  chunks: PrimarySourceReaderChunk[];
  searchText: string;
};

export type PrimarySourceReaderCorpus = {
  disclaimerRu: string;
  documents: PrimarySourceReaderDocument[];
  manifestDocumentCount: number;
  coverageDocumentCount: number;
  translatedDocumentCount: number;
  approvedDocumentCount: number;
  totalChunkCount: number;
  translatedChunkCount: number;
  searchProjectionCount: number;
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

function collectShardDocuments<T extends { officialDocumentId: string }>(
  modules: Record<string, unknown>,
  label: string
): { status: string; document: T }[] {
  return Object.entries(modules)
    .map(([path, module]) => {
      const shard = (module as { default: { status?: string; document?: T } }).default;
      if (!shard?.document?.officialDocumentId) {
        throw new Error(`${label} shard ${path} is malformed.`);
      }
      return {
        path,
        status: shard.status || "draft",
        document: shard.document
      };
    })
    .sort((a, b) => a.document.officialDocumentId.localeCompare(b.document.officialDocumentId));
}

function collectSearchShardEntries(modules: Record<string, unknown>, label: string): PrimarySourceSearchEntry[] {
  return Object.entries(modules)
    .map(([path, module]) => {
      const shard = (module as { default: PrimarySourceSearchShard }).default;
      if (!shard?.officialDocumentId || !Array.isArray(shard.entries)) {
        throw new Error(`${label} shard ${path} is malformed.`);
      }
      return shard;
    })
    .sort((a, b) => a.officialDocumentId.localeCompare(b.officialDocumentId))
    .flatMap((shard) => shard.entries);
}

const translations = collectShardEntries<Translation>(
  import.meta.glob("../../content/translations/ru/*.json", { eager: true }),
  "Russian translation"
);
const explanations = collectShardEntries<Explanation>(
  import.meta.glob("../../content/explanations/ru/*.json", { eager: true }),
  "Russian explanation"
);
const primarySourceDocumentShards = collectShardDocuments<PrimarySourceLearnerDocument>(
  import.meta.glob("../../content/primary-sources/documents/*.json", { eager: true }),
  "Primary source document"
);
const primarySourceQaShards = collectShardDocuments<PrimarySourceQaDocument>(
  import.meta.glob("../../content/primary-sources/qa/*.json", { eager: true }),
  "Primary source QA"
);
const primarySourceSearchShardEntries = collectSearchShardEntries(
  import.meta.glob("../../content/primary-sources/search/*.json", { eager: true }),
  "Primary source search"
);
const officialDocumentMarkdownModules = import.meta.glob("../../content/official-documents/documents/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
}) as Record<string, string>;

function primarySourceRootDocuments() {
  return (primarySourcesRootJson as { documents?: PrimarySourceLearnerDocument[] }).documents || [];
}

function primarySourceRootQaDocuments() {
  return (primarySourcesQaJson as { documents?: PrimarySourceQaDocument[] }).documents || [];
}

function primarySourceRootSearchEntries() {
  return (primarySourcesSearchJson as { entries?: PrimarySourceSearchEntry[] }).entries || [];
}

function archiveMarkdownFor(localPath: string) {
  return officialDocumentMarkdownModules[`../../${localPath}`] || "";
}

function archiveSpanText(localPath: string, span: PrimarySourceSpan) {
  const markdown = archiveMarkdownFor(localPath);
  if (!markdown) return "";
  return markdown
    .split(/\r?\n/)
    .slice(Math.max(span.startLine - 1, 0), Math.max(span.endLine, span.startLine))
    .join("\n")
    .trim();
}

function normalizePrimarySourceSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("ru-RU");
}

function inferPrimarySourceJurisdiction(
  entry: OfficialDocumentManifestEntry,
  learnerDocument?: PrimarySourceLearnerDocument
): "caba" | "national" | "other" {
  if (learnerDocument?.jurisdiction) return learnerDocument.jurisdiction;
  if (/caba|gcba|buenosaires\.gob\.ar/i.test(`${entry.id} ${entry.sourceUrl} ${entry.title}`)) return "caba";
  if (/argentina|infoleg|nacional|ley|decreto|disposicion|codigo/i.test(`${entry.sourceUrl} ${entry.officialSourceType} ${entry.title}`)) {
    return "national";
  }
  return "other";
}

function inferPrimarySourceCategory(entry: OfficialDocumentManifestEntry, learnerDocument?: PrimarySourceLearnerDocument) {
  if (learnerDocument?.category) return learnerDocument.category;
  const value = `${entry.id} ${entry.title} ${entry.officialSourceType}`.toLocaleLowerCase("es-AR");
  if (value.includes("anexo-l") || value.includes("senal")) return "signage";
  if (value.includes("manual") || value.includes("material-estudio")) return "study-materials";
  if (value.includes("vtv")) return "vehicle-inspection";
  if (value.includes("cedula") || value.includes("automotor") || value.includes("dnrpa") || value.includes("patente")) return "vehicle-documents";
  if (value.includes("siniestro") || value.includes("estrellas")) return "incidents";
  if (value.includes("penal") || value.includes("civil") || value.includes("seguro")) return "legal-duties";
  if (value.includes("ley") || value.includes("decreto") || value.includes("codigo")) return "traffic-law";
  return "administrative";
}

function isDraftLearnerText(text: string | undefined) {
  return Boolean(text && /\bDRAFT\b|чернов/i.test(text));
}

function buildPrimarySourceReaderCorpus(): PrimarySourceReaderCorpus {
  const manifest = officialDocumentsManifestJson as OfficialDocumentsManifest;
  const coverage = primarySourcesCoverageJson as PrimarySourcesCoverage;
  const learnerDocuments = [...primarySourceRootDocuments(), ...primarySourceDocumentShards.map((shard) => shard.document)];
  const qaDocuments = [...primarySourceRootQaDocuments(), ...primarySourceQaShards.map((shard) => shard.document)];
  const searchEntries = [...primarySourceRootSearchEntries(), ...primarySourceSearchShardEntries];
  const learnerById = new Map(learnerDocuments.map((document) => [document.officialDocumentId, document]));
  const learnerShardStatusById = new Map(primarySourceDocumentShards.map((shard) => [shard.document.officialDocumentId, shard.status]));
  const qaByDocumentId = new Map(qaDocuments.map((document) => [document.officialDocumentId, document]));
  const coverageById = new Map(coverage.documents.map((document) => [document.officialDocumentId, document]));

  const documents = manifest.entries.map((entry) => {
    const learnerDocument = learnerById.get(entry.id);
    const coverageDocument = coverageById.get(entry.id);
    const qaDocument = qaByDocumentId.get(entry.id);
    const learnerChunks = new Map((learnerDocument?.chunks || []).map((chunk) => [chunk.chunkId, chunk]));
    const qaChunks = new Map((qaDocument?.chunks || []).map((chunk) => [chunk.chunkId, chunk]));
    const coverageChunks = coverageDocument?.chunks || learnerDocument?.chunks || [];
    const category = inferPrimarySourceCategory(entry, learnerDocument);
    const jurisdiction = inferPrimarySourceJurisdiction(entry, learnerDocument);

    const chunks = coverageChunks.map((coverageChunk) => {
      const learnerChunk = learnerChunks.get(coverageChunk.chunkId);
      const qaChunk = qaChunks.get(coverageChunk.chunkId);
      const originalSpanish =
        learnerChunk?.originalSpanish ||
        archiveSpanText(coverageDocument?.archiveLocalPath || learnerDocument?.archiveLocalPath || entry.localPath, coverageChunk.sourceSpan);

      return {
        ...coverageChunk,
        originalSpanish,
        fullTranslationRu: learnerChunk?.fullTranslationRu,
        simpleRu: learnerChunk?.simpleRu,
        translationQa: qaChunk?.translationQa,
        simplificationQa: qaChunk?.simplificationQa,
        hasLearnerText: Boolean(learnerChunk?.fullTranslationRu && learnerChunk.simpleRu)
      };
    });

    const translatedChunkCount = chunks.filter((chunk) => chunk.hasLearnerText).length;
    const hasDraftText = chunks.some((chunk) => isDraftLearnerText(chunk.fullTranslationRu) || isDraftLearnerText(chunk.simpleRu));
    const hasUnapprovedQa = chunks.some((chunk) => {
      if (!chunk.hasLearnerText) return false;
      return chunk.translationQa?.status !== "approved" || chunk.simplificationQa?.status !== "approved";
    });
    const shardStatus = learnerShardStatusById.get(entry.id);
    const translationStatus: PrimarySourceTranslationStatus =
      translatedChunkCount === 0
        ? "not_translated"
        : hasDraftText || hasUnapprovedQa || shardStatus === "draft"
          ? "draft"
          : translatedChunkCount < coverageChunks.length
            ? "partial"
            : "approved";

    const title = learnerDocument?.title || entry.title;
    const shortTitleRu = learnerDocument?.shortTitleRu || title;
    const archiveLocalPath = coverageDocument?.archiveLocalPath || learnerDocument?.archiveLocalPath || entry.localPath;
    const searchText = normalizePrimarySourceSearchText([
      title,
      entry.id,
      shortTitleRu,
      category,
      jurisdiction,
      entry.officialSourceType,
      entry.currentness.status,
      entry.exactTextValidation.status,
      ...chunks.flatMap((chunk) => [
        chunk.officialLabel || "",
        chunk.chunkId,
        ...chunk.headingPath,
        chunk.simpleRu || "",
        chunk.fullTranslationRu || "",
        chunk.originalSpanish || ""
      ])
    ]
      .join(" "));

    return {
      officialDocumentId: entry.id,
      title,
      shortTitleRu,
      category,
      jurisdiction,
      officialSourceType: learnerDocument?.officialSourceType || entry.officialSourceType,
      sourceUrl: learnerDocument?.sourceUrl || entry.sourceUrl,
      archiveLocalPath,
      retrievalDate: learnerDocument?.retrievalDate || entry.retrievalDate,
      currentnessStatus: learnerDocument?.currentnessStatus || entry.currentness.status,
      currentnessValidationStatus: learnerDocument?.currentnessValidationStatus || entry.currentness.validationStatus,
      exactTextValidationStatus: learnerDocument?.exactTextValidationStatus || entry.exactTextValidation.status,
      coverageStatus: coverageDocument?.coverageStatus || "missing_coverage",
      chunkingStrategy: coverageDocument?.chunkingDecision.strategy || chunks[0]?.chunkingStrategy || "unknown",
      chunkingNote: coverageDocument?.chunkingDecision.note || "Chunk inventory is not available for this source yet.",
      translationStatus,
      translatedChunkCount,
      totalChunkCount: chunks.length,
      chunks,
      searchText
    };
  });

  return {
    disclaimerRu: (primarySourcesRootJson as { disclaimerRu?: string }).disclaimerRu || "Русский слой источников является неофициальной учебной поддержкой.",
    documents,
    manifestDocumentCount: manifest.entries.length,
    coverageDocumentCount: coverage.documents.length,
    translatedDocumentCount: documents.filter((document) => document.translatedChunkCount > 0).length,
    approvedDocumentCount: documents.filter((document) => document.translationStatus === "approved").length,
    totalChunkCount: documents.reduce((sum, document) => sum + document.totalChunkCount, 0),
    translatedChunkCount: documents.reduce((sum, document) => sum + document.translatedChunkCount, 0),
    searchProjectionCount: searchEntries.length
  };
}

const primarySourceReaderCorpus = buildPrimarySourceReaderCorpus();

export const data = {
  contentMode,
  examFormat,
  sources,
  questions: questions as Question[],
  translations: translations as Translation[],
  explanations: explanations as Explanation[],
  vocabulary,
  guide,
  cabaExamProcessGuide: cabaExamProcessGuideJson as CabaExamProcessGuide,
  topicStudyGuide: topicStudyGuideJson as TopicStudyGuide,
  primarySources: primarySourceReaderCorpus
};

export const translationByQuestion = new Map(data.translations.map((item) => [item.questionId, item]));
export const explanationByQuestion = new Map(data.explanations.map((item) => [item.questionId, item]));
export const sourceById = new Map(data.sources.map((source) => [source.id, source]));
export const questionById = new Map(data.questions.map((question) => [question.id, question]));

export function assetUrl(localPath: string) {
  return `/${localPath}`;
}
