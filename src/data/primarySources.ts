import officialDocumentsManifestJson from "../../content/official-documents/manifest.json";
import primarySourcesCoverageJson from "../../content/primary-sources/primary-sources.coverage.json";
import primarySourcesRootJson from "../../content/primary-sources/primary-sources.ru.json";
import primarySourcesQaJson from "../../content/primary-sources/primary-sources.qa.json";
import primarySourcesSearchJson from "../../content/primary-sources/primary-sources.search.json";
import type {
  OfficialDocumentManifestEntry,
  OfficialDocumentsManifest,
  PrimarySourceLearnerDocument,
  PrimarySourceLearnerChunk,
  PrimarySourceQaChunk,
  PrimarySourceQaDocument,
  PrimarySourceReaderCorpus,
  PrimarySourceSearchEntry,
  PrimarySourceSearchShard,
  PrimarySourcesCoverage,
  PrimarySourceTranslationStatus
} from "./content";

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

function primarySourceRootDocuments() {
  return (primarySourcesRootJson as { documents?: PrimarySourceLearnerDocument[] }).documents || [];
}

function primarySourceRootQaDocuments() {
  return (primarySourcesQaJson as { documents?: PrimarySourceQaDocument[] }).documents || [];
}

function primarySourceRootSearchEntries() {
  return (primarySourcesSearchJson as { entries?: PrimarySourceSearchEntry[] }).entries || [];
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

function isApprovedReadablePrimarySourceChunk(
  learnerChunk: PrimarySourceLearnerChunk | undefined,
  qaChunk: PrimarySourceQaChunk | undefined,
  shardStatus: string | undefined
) {
  if (!learnerChunk) return false;
  if (shardStatus === "draft") return false;
  if (!learnerChunk.originalSpanish.trim() || !learnerChunk.fullTranslationRu.trim() || !learnerChunk.simpleRu.trim()) return false;
  if (isDraftLearnerText(learnerChunk.fullTranslationRu) || isDraftLearnerText(learnerChunk.simpleRu)) return false;
  return qaChunk?.translationQa.status === "approved" && qaChunk.simplificationQa.status === "approved";
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

  const allDocuments = manifest.entries.map((entry) => {
    const learnerDocument = learnerById.get(entry.id);
    const coverageDocument = coverageById.get(entry.id);
    const qaDocument = qaByDocumentId.get(entry.id);
    const learnerChunks = new Map((learnerDocument?.chunks || []).map((chunk) => [chunk.chunkId, chunk]));
    const qaChunks = new Map((qaDocument?.chunks || []).map((chunk) => [chunk.chunkId, chunk]));
    const coverageChunks = coverageDocument?.chunks || [];
    const category = inferPrimarySourceCategory(entry, learnerDocument);
    const jurisdiction = inferPrimarySourceJurisdiction(entry, learnerDocument);
    const shardStatus = learnerShardStatusById.get(entry.id);

    const chunks = coverageChunks.flatMap((coverageChunk) => {
      const learnerChunk = learnerChunks.get(coverageChunk.chunkId);
      const qaChunk = qaChunks.get(coverageChunk.chunkId);
      if (!isApprovedReadablePrimarySourceChunk(learnerChunk, qaChunk, shardStatus)) return [];

      return [{
        ...coverageChunk,
        originalSpanish: learnerChunk.originalSpanish,
        fullTranslationRu: learnerChunk.fullTranslationRu,
        simpleRu: learnerChunk.simpleRu,
        translationQa: qaChunk.translationQa,
        simplificationQa: qaChunk.simplificationQa,
        hasLearnerText: true
      }];
    });

    const translatedChunkCount = chunks.length;
    const totalChunkCount = coverageChunks.length;
    const translationStatus: PrimarySourceTranslationStatus =
      translatedChunkCount === 0
        ? "not_translated"
        : translatedChunkCount < totalChunkCount
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
      totalChunkCount,
      chunks,
      searchText
    };
  });
  const documents = allDocuments.filter((document) => document.translatedChunkCount > 0);

  return {
    disclaimerRu: (primarySourcesRootJson as { disclaimerRu?: string }).disclaimerRu || "Русский слой источников является неофициальной учебной поддержкой.",
    documents,
    manifestDocumentCount: manifest.entries.length,
    coverageDocumentCount: coverage.documents.length,
    translatedDocumentCount: documents.filter((document) => document.translatedChunkCount > 0).length,
    unavailableDocumentCount: allDocuments.filter((document) => document.translatedChunkCount === 0).length,
    approvedDocumentCount: documents.filter((document) => document.translationStatus === "approved").length,
    totalChunkCount: allDocuments.reduce((sum, document) => sum + document.totalChunkCount, 0),
    translatedChunkCount: documents.reduce((sum, document) => sum + document.translatedChunkCount, 0),
    searchProjectionCount: searchEntries.length
  };
}

export const primarySourceReaderCorpus = buildPrimarySourceReaderCorpus();
