import type manifestJson from "../../content/official-documents/manifest.json";

type OfficialManifest = typeof manifestJson;
type ManifestEntry = OfficialManifest["entries"][number];

type SourceDocumentShard = {
  documents: SourceDocumentPayload[];
};

type SourceDocumentPayload = {
  officialDocumentId: string;
  title: string;
  shortTitleRu: string;
  category: string;
  jurisdiction: string;
  officialSourceType: string;
  sourceUrl: string;
  archiveLocalPath: string;
  retrievalDate: string;
  currentnessStatus: string;
  currentnessValidationStatus: string;
  exactTextValidationStatus: string;
  chunks: PrimarySourceChunk[];
};

export type PrimarySourceChunk = {
  chunkId: string;
  officialDocumentId: string;
  order: number;
  headingPath: string[];
  officialLabel?: string;
  originalSpanish: string;
  fullTranslationRu: string;
  simpleRu: string;
};

export type PrimarySourceDocument = {
  officialDocumentId: string;
  title: string;
  shortTitleRu: string;
  category: string;
  jurisdiction: string;
  officialSourceType: string;
  sourceUrl: string;
  archiveLocalPath: string;
  retrievalDate: string;
  currentnessStatus: string;
  currentnessValidationStatus: string;
  exactTextValidationStatus: string;
  chunks: PrimarySourceChunk[];
};

export type PrimarySourceCorpus = {
  documents: PrimarySourceDocument[];
  manifestEntryCount: number;
  chunkCount: number;
};

const manifestModule = () => import("../../content/official-documents/manifest.json");
const documentShardModules = import.meta.glob("../../content/primary-sources/documents/*.json");

let primarySourcesPromise: Promise<PrimarySourceCorpus> | undefined;

function isSourceDocumentPayload(value: unknown): value is SourceDocumentPayload {
  const document = value as SourceDocumentPayload | undefined;
  return Boolean(document?.officialDocumentId && Array.isArray(document.chunks));
}

export function normalizeSourceDocumentShard(modulePath: string, value: unknown): SourceDocumentShard {
  const shard = (value as { default?: unknown }).default as
    | { document?: unknown; documents?: unknown }
    | undefined;
  const pluralDocuments = Array.isArray(shard?.documents) ? shard.documents : [];
  const hasMalformedPluralDocument = pluralDocuments.some((document) => !isSourceDocumentPayload(document));
  const documents = [
    ...(isSourceDocumentPayload(shard?.document) ? [shard.document] : []),
    ...pluralDocuments.filter(isSourceDocumentPayload)
  ];

  if (documents.length === 0 || hasMalformedPluralDocument) {
    throw new Error(`Primary source shard ${modulePath} is malformed.`);
  }
  return { documents };
}

function manifestEntryStatus(entry: ManifestEntry) {
  return {
    currentnessStatus: entry.currentness?.status ?? "unknown",
    currentnessValidationStatus: entry.currentness?.validationStatus ?? "pending",
    exactTextValidationStatus: entry.exactTextValidation?.status ?? "pending"
  };
}

function isPrimarySourceReaderEntry(entry: ManifestEntry) {
  return (entry as { primarySourceReader?: boolean }).primarySourceReader !== false;
}

export function mergeDocumentShards(entries: ManifestEntry[], shards: SourceDocumentShard[]): PrimarySourceDocument[] {
  const shardsByDocument = new Map<string, SourceDocumentPayload[]>();

  for (const shard of shards) {
    for (const document of shard.documents) {
      const documentId = document.officialDocumentId;
      const current = shardsByDocument.get(documentId) ?? [];
      current.push(document);
      shardsByDocument.set(documentId, current);
    }
  }

  return entries.filter(isPrimarySourceReaderEntry).map((entry) => {
    const documentShards = shardsByDocument.get(entry.id) ?? [];
    const firstShard = documentShards[0];
    const chunks = documentShards
      .flatMap((document) => document.chunks)
      .sort((a, b) => a.order - b.order || a.chunkId.localeCompare(b.chunkId));
    const status = manifestEntryStatus(entry);

    return {
      officialDocumentId: entry.id,
      title: firstShard?.title ?? entry.title,
      shortTitleRu: firstShard?.shortTitleRu ?? entry.title,
      category: firstShard?.category ?? "uncategorized",
      jurisdiction: firstShard?.jurisdiction ?? "unknown",
      officialSourceType: entry.officialSourceType ?? firstShard?.officialSourceType ?? "unknown",
      sourceUrl: entry.sourceUrl ?? firstShard?.sourceUrl ?? "",
      archiveLocalPath: entry.localPath ?? firstShard?.archiveLocalPath ?? "",
      retrievalDate: entry.retrievalDate ?? firstShard?.retrievalDate ?? "",
      currentnessStatus: status.currentnessStatus,
      currentnessValidationStatus: status.currentnessValidationStatus,
      exactTextValidationStatus: status.exactTextValidationStatus,
      chunks
    };
  });
}

async function readPrimarySources(): Promise<PrimarySourceCorpus> {
  const [manifestModuleResult, shardModules] = await Promise.all([
    manifestModule(),
    Promise.all(
      Object.entries(documentShardModules).map(async ([path, loadModule]) => ({
        path,
        module: await loadModule()
      }))
    )
  ]);
  const manifest = manifestModuleResult.default as OfficialManifest;
  const primarySourceEntries = manifest.entries.filter(isPrimarySourceReaderEntry);
  const shards = shardModules
    .map(({ path, module }) => normalizeSourceDocumentShard(path, module))
    .sort((a, b) => {
      const documentA = a.documents[0];
      const documentB = b.documents[0];
      const documentCompare = documentA.officialDocumentId.localeCompare(documentB.officialDocumentId);
      if (documentCompare) return documentCompare;
      return (documentA.chunks[0]?.order ?? 0) - (documentB.chunks[0]?.order ?? 0);
    });
  const documents = mergeDocumentShards(primarySourceEntries, shards);
  const chunkCount = documents.reduce((sum, document) => sum + document.chunks.length, 0);

  return {
    documents,
    manifestEntryCount: primarySourceEntries.length,
    chunkCount
  };
}

export function loadPrimarySources() {
  primarySourcesPromise ??= readPrimarySources();
  return primarySourcesPromise;
}
