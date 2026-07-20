import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync("src/data/primarySources.ts", "utf8").replace(
  'const documentShardModules = import.meta.glob("../../content/primary-sources/documents/*.json");',
  "const documentShardModules = {};",
);
const javaScript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    isolatedModules: true,
  },
  fileName: "src/data/primarySources.ts",
}).outputText;
const primarySources = await import(
  `data:text/javascript;base64,${Buffer.from(javaScript).toString("base64")}`
);

const baseDocument = {
  officialDocumentId: "doc-a",
  title: "Documento A",
  shortTitleRu: "Документ A",
  category: "traffic-law",
  jurisdiction: "national",
  officialSourceType: "law",
  sourceUrl: "https://example.test/doc-a",
  archiveLocalPath: "content/official-documents/documents/doc-a.md",
  retrievalDate: "2026-05-20",
  currentnessStatus: "current",
  currentnessValidationStatus: "passed",
  exactTextValidationStatus: "passed",
  chunks: [
    {
      chunkId: "doc-a--002",
      officialDocumentId: "doc-a",
      order: 2,
      headingPath: ["Documento A"],
      originalSpanish: "Texto dos",
      fullTranslationRu: "Полный перевод два",
      simpleRu: "Просто два",
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("runtime primary-source loader accepts singular document shard payloads", () => {
  const shard = primarySources.normalizeSourceDocumentShard("singular.json", {
    default: { document: clone(baseDocument) },
  });

  assert.equal(shard.documents.length, 1);
  assert.equal(shard.documents[0].officialDocumentId, "doc-a");
});

test("runtime primary-source loader accepts plural documents shard payloads and merges their chunks", () => {
  const first = clone(baseDocument);
  const second = {
    ...clone(baseDocument),
    chunks: [
      {
        chunkId: "doc-a--001",
        officialDocumentId: "doc-a",
        order: 1,
        headingPath: ["Documento A"],
        originalSpanish: "Texto uno",
        fullTranslationRu: "Полный перевод один",
        simpleRu: "Просто один",
      },
    ],
  };
  const shard = primarySources.normalizeSourceDocumentShard("plural.json", {
    default: { documents: [first, second] },
  });
  const [document] = primarySources.mergeDocumentShards(
    [
      {
        id: "doc-a",
        title: "Manifest title",
        officialSourceType: "manifest-law",
        sourceUrl: "https://example.test/manifest-doc-a",
        localPath: "content/official-documents/documents/doc-a.md",
        retrievalDate: "2026-05-21",
        currentness: { status: "current", validationStatus: "passed" },
        exactTextValidation: { status: "passed" },
      },
    ],
    [shard],
  );

  assert.equal(shard.documents.length, 2);
  assert.deepEqual(
    document.chunks.map((chunk) => chunk.chunkId),
    ["doc-a--001", "doc-a--002"],
  );
  assert.equal(document.exactTextValidationStatus, "passed");
  assert.equal(document.sourceUrl, "https://example.test/manifest-doc-a");
});

test("runtime primary-source loader rejects malformed singular and plural payloads", () => {
  assert.throws(
    () =>
      primarySources.normalizeSourceDocumentShard("bad-singular.json", {
        default: { document: { officialDocumentId: "doc-a" } },
      }),
    /bad-singular\.json is malformed/,
  );
  assert.throws(
    () =>
      primarySources.normalizeSourceDocumentShard("bad-plural.json", {
        default: { documents: [{ chunks: [] }] },
      }),
    /bad-plural\.json is malformed/,
  );
  assert.throws(
    () =>
      primarySources.normalizeSourceDocumentShard("mixed-plural.json", {
        default: { documents: [clone(baseDocument), { chunks: [] }] },
      }),
    /mixed-plural\.json is malformed/,
  );
});
