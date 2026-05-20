import type manifestJson from "../../content/official-documents/manifest.json";

type OfficialManifest = typeof manifestJson;
type ManifestEntry = OfficialManifest["entries"][number];

type SourceDocumentShard = {
  document: SourceDocumentPayload;
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

function assertSourceDocumentShard(modulePath: string, value: unknown): SourceDocumentShard {
  const shard = (value as { default?: unknown }).default as SourceDocumentShard | undefined;
  if (!shard?.document?.officialDocumentId || !Array.isArray(shard.document.chunks)) {
    throw new Error(`Primary source shard ${modulePath} is malformed.`);
  }
  return shard;
}

function manifestEntryStatus(entry: ManifestEntry) {
  return {
    currentnessStatus: entry.currentness?.status ?? "unknown",
    currentnessValidationStatus: entry.currentness?.validationStatus ?? "pending",
    exactTextValidationStatus: entry.exactTextValidation?.status ?? "pending"
  };
}

function mergeDocumentShards(entries: ManifestEntry[], shards: SourceDocumentShard[]): PrimarySourceDocument[] {
  const shardsByDocument = new Map<string, SourceDocumentPayload[]>();

  for (const shard of shards) {
    const documentId = shard.document.officialDocumentId;
    const current = shardsByDocument.get(documentId) ?? [];
    current.push(shard.document);
    shardsByDocument.set(documentId, current);
  }

  return entries.map((entry) => {
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
  const shards = shardModules
    .map(({ path, module }) => assertSourceDocumentShard(path, module))
    .sort((a, b) => {
      const documentCompare = a.document.officialDocumentId.localeCompare(b.document.officialDocumentId);
      if (documentCompare) return documentCompare;
      return (a.document.chunks[0]?.order ?? 0) - (b.document.chunks[0]?.order ?? 0);
    });
  const documents = mergeDocumentShards(manifest.entries, shards);
  const chunkCount = documents.reduce((sum, document) => sum + document.chunks.length, 0);

  return {
    documents,
    manifestEntryCount: manifest.entries.length,
    chunkCount
  };
}

export function loadPrimarySources() {
  primarySourcesPromise ??= readPrimarySources();
  return primarySourcesPromise;
}
