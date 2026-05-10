#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const root = resolve(dirname(currentFilePath), "..");
const coveragePath = "content/primary-sources/primary-sources.coverage.json";
const manifestPath = "content/official-documents/manifest.json";
const today = "2026-05-10";

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), "utf8"));
}

function readText(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function stripMarkdownHeading(value) {
  return normalizeLine(value.replace(/^#{1,6}\s+/, ""));
}

function stripLinks(value) {
  return value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function slugify(value) {
  const ascii = normalizeLine(stripLinks(value))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/º/g, "o")
    .replace(/°/g, "o")
    .replace(/ª/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii.split("-").filter(Boolean).slice(0, 8).join("-") || "section";
}

function labelFromLine(line) {
  const normalized = normalizeLine(stripMarkdownHeading(line));
  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
}

function isMarkdownHeading(line) {
  return /^#{1,6}\s+\S/.test(line);
}

function markdownHeadingLevel(line) {
  return line.match(/^(#{1,6})\s+/)?.[1].length ?? 0;
}

export function isArticleLine(line) {
  const normalized = normalizeLine(line);
  return /^(?:ART[ÍI]CULO|ART\.|Art[íi]culo|Art\.)\s*\d+(?:\s*(?:[º°]|\(\d+\)|bis|ter|qu[aá]ter|quater|quinque|quinquies|quinto))?(?:\s*(?:[.):]|,?\s*\.?[—-])|\s+[A-ZÁÉÍÓÚÑÜ])/u.test(
    normalized
  );
}

function isHierarchyLine(line) {
  const normalized = normalizeLine(line);
  return /^(?:ANEXO(?:\s+[A-Z0-9IVXLCDM.-]+)?(?:\s+.*)?|LIBRO\s+.+|T[ÍI]TULO\s+.+|CAP[ÍI]TULO\s+.+|SECCI[ÓO]N\s+.+)$/iu.test(normalized);
}

function isDottedSectionLine(line) {
  return /^\d+(?:\.\d+){1,}\.?\s+\S/u.test(normalizeLine(line));
}

function isNumberedAnnexSectionLine(line) {
  const normalized = normalizeLine(line);
  return /^\d{1,3}\.\s+[A-ZÁÉÍÓÚÑÜ0-9][\p{L}\p{N}"'()ÁÉÍÓÚÑÜ.,;: -]{0,140}/u.test(normalized);
}

function isPageNumberLine(line, index, lines) {
  if (!/^\d{1,3}$/.test(normalizeLine(line))) return false;
  const previous = normalizeLine(lines[index - 1] || "");
  const next = normalizeLine(lines[index + 1] || "");
  return previous === "" && next !== "";
}

function countMatching(lines, predicate) {
  return lines.reduce((count, line, index) => count + (predicate(line, index, lines) ? 1 : 0), 0);
}

function classifyDocument(documentId, lines) {
  const markdownHeadingCount = countMatching(lines, isMarkdownHeading);
  const articleCount = countMatching(lines, isArticleLine);
  const dottedSectionCount = countMatching(lines, isDottedSectionLine);
  const pageNumberCount = countMatching(lines, isPageNumberLine);
  const numberedAnnexCount = countMatching(lines, isNumberedAnnexSectionLine);

  if (pageNumberCount >= 20 || documentId === "gcba-manual-vehiculo-4-ruedas-2023") {
    return {
      strategy: "pdf-page-groups",
      note:
        "PDF-converted manual text is chunked by detected page-number groups because page structure is the most stable preserved source boundary."
    };
  }
  if (dottedSectionCount >= 20) {
    return {
      strategy: "dotted-code-sections",
      note:
        "CABA code text is chunked by numbered code sections, with titles/chapters retained in heading paths where detectable."
    };
  }
  if (articleCount >= 3) {
    return {
      strategy: "legal-articles",
      note:
        "Law/code text is chunked by article boundaries, with books/titles/chapters/sections retained in heading paths where detectable."
    };
  }
  if (documentId.includes("anexo-l") || numberedAnnexCount >= 20) {
    return {
      strategy: "annex-numbered-sections",
      note:
        "Signage annex text is chunked by chapter and numbered signal/section boundaries preserved by the HTML-to-Markdown conversion."
    };
  }
  if (markdownHeadingCount >= 3) {
    return {
      strategy: "markdown-heading-sections",
      note:
        "Service/news page text is chunked by Markdown headings generated from the official page structure."
    };
  }
  return {
    strategy: "bounded-paragraph-groups",
    note:
      "Weakly structured converted text is chunked into bounded paragraph groups with stable line spans and source hashes."
  };
}

function paragraphGroupStarts(lines, maxLines = 36) {
  const starts = [1];
  let lastStart = 1;
  for (let index = 1; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    if (lineNumber - lastStart < maxLines) continue;
    let chosen = lineNumber;
    for (let probe = index; probe < Math.min(lines.length, index + 10); probe += 1) {
      if (normalizeLine(lines[probe]) === "" && normalizeLine(lines[probe + 1] || "") !== "") {
        chosen = probe + 2;
        break;
      }
    }
    if (chosen <= lines.length) {
      starts.push(chosen);
      lastStart = chosen;
      index = chosen - 1;
    }
  }
  return starts;
}

function boundaryKind(line, strategy, index, lines) {
  if (isMarkdownHeading(line)) return "markdown-heading";
  if (strategy === "pdf-page-groups") return isPageNumberLine(line, index, lines) ? "page" : undefined;
  if (isHierarchyLine(line)) return "hierarchy";
  if (isArticleLine(line)) return "article";
  if (strategy === "dotted-code-sections" && isDottedSectionLine(line)) return "numbered-section";
  if (strategy === "annex-numbered-sections" && isNumberedAnnexSectionLine(line)) return "numbered-section";
  return undefined;
}

function collectBoundaries(lines, decision) {
  const boundariesByLine = new Map([[1, { line: 1, kind: "document-title", label: labelFromLine(lines[0] || "Document") }]]);
  for (let index = 0; index < lines.length; index += 1) {
    const kind = boundaryKind(lines[index], decision.strategy, index, lines);
    if (!kind) continue;
    boundariesByLine.set(index + 1, { line: index + 1, kind, label: labelFromLine(lines[index]) });
  }

  if (decision.strategy === "bounded-paragraph-groups") {
    for (const start of paragraphGroupStarts(lines)) {
      if (!boundariesByLine.has(start)) {
        boundariesByLine.set(start, { line: start, kind: "paragraph-group", label: `Grupo de párrafos línea ${start}` });
      }
    }
  }

  return [...boundariesByLine.values()].sort((a, b) => a.line - b.line);
}

function updatePathState(state, boundary, lines) {
  const label = boundary.label;
  if (boundary.kind === "markdown-heading" || boundary.kind === "document-title") {
    const level = boundary.kind === "document-title" ? 1 : markdownHeadingLevel(lines[boundary.line - 1]);
    state.markdown = state.markdown.slice(0, Math.max(0, level - 1));
    state.markdown[level - 1] = label;
    return;
  }

  if (boundary.kind === "page") {
    const nextLabel = labelFromLine(lines[boundary.line] || "");
    state.page = nextLabel ? `Página ${label}: ${nextLabel}` : `Página ${label}`;
    return;
  }

  if (boundary.kind === "hierarchy") {
    const normalized = normalizeLine(label).toUpperCase();
    const level = normalized.startsWith("ANEXO")
      ? 1
      : normalized.startsWith("LIBRO")
        ? 2
        : normalized.startsWith("TITULO") || normalized.startsWith("TÍTULO")
          ? 3
          : normalized.startsWith("CAPITULO") || normalized.startsWith("CAPÍTULO")
            ? 4
            : 5;
    state.hierarchy = state.hierarchy.slice(0, Math.max(0, level - 1));
    state.hierarchy[level - 1] = label;
  }
}

function headingPathFor(state, boundary, title) {
  if (boundary.kind === "page") return [title, state.page || boundary.label].filter(Boolean);
  const base = state.markdown.length > 0 ? state.markdown : [title];
  const path = [...base, ...state.hierarchy.filter(Boolean)];
  if (["article", "numbered-section", "paragraph-group"].includes(boundary.kind)) path.push(boundary.label);
  return [...new Set(path)].filter(Boolean);
}

export function generateDocumentCoverageFromText(entry, text) {
  const lines = text.split(/\r?\n/);
  const title = labelFromLine(lines.find(isMarkdownHeading) || entry.title);
  const decision = classifyDocument(entry.id, lines);
  const boundaries = collectBoundaries(lines, decision);
  const state = { markdown: [title], hierarchy: [], page: undefined };
  const chunks = [];

  boundaries.forEach((boundary, index) => {
    updatePathState(state, boundary, lines);
    const nextBoundary = boundaries[index + 1];
    const startLine = boundary.line;
    const endLine = nextBoundary ? nextBoundary.line - 1 : lines.length;
    if (endLine < startLine) return;
    const sourceText = lines.slice(startLine - 1, endLine).join("\n");
    if (sourceText.trim() === "" && startLine !== 1) return;
    const order = chunks.length + 1;
    const labelSlug = slugify(boundary.label);
    const sourceTextSha256 = sha256(sourceText);
    chunks.push({
      chunkId: `${entry.id}--${labelSlug}-${String(order).padStart(3, "0")}`,
      officialDocumentId: entry.id,
      order,
      headingPath: headingPathFor(state, boundary, title),
      officialLabel: boundary.label,
      chunkingStrategy: decision.strategy,
      sourceSpan: {
        startLine,
        endLine
      },
      sourceTextSha256,
      sourceFingerprint: `sha256:${sourceTextSha256}`
    });
  });

  return {
    officialDocumentId: entry.id,
    archiveLocalPath: entry.localPath,
    archiveSha256: sha256(text),
    coverageStatus: "generated_inventory",
    chunkingDecision: decision,
    expectedChunkIds: chunks.map((chunk) => chunk.chunkId),
    chunks
  };
}

function generateDocumentCoverage(entry) {
  return generateDocumentCoverageFromText(entry, readText(entry.localPath));
}

function generateCoverage() {
  const manifest = readJson(manifestPath);
  return {
    version: 1,
    schema: "primary-sources-coverage.v1",
    status: "draft",
    manifestSnapshot: {
      capturedAt: today,
      manifestPath,
      officialDocumentCount: manifest.entries.length,
      officialDocumentIds: manifest.entries.map((entry) => entry.id)
    },
    generation: {
      generatedAt: today,
      generator: "scripts/primary-sources-generate-coverage.mjs",
      source: "content/official-documents/manifest.json",
      note:
        "Generated inventory only. Russian translation, simplification, and QA approval are intentionally reserved for later slices."
    },
    documents: manifest.entries.map(generateDocumentCoverage)
  };
}

function printSummary(coverage) {
  const totalChunks = coverage.documents.reduce((sum, document) => sum + document.chunks.length, 0);
  console.log(`Primary-source coverage: ${coverage.documents.length} documents, ${totalChunks} chunks.`);
  for (const document of coverage.documents) {
    console.log(`${document.officialDocumentId}: ${document.chunks.length} chunks (${document.chunkingDecision.strategy})`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === currentFilePath) {
  const args = new Set(process.argv.slice(2));
  const coverage = generateCoverage();
  const json = `${JSON.stringify(coverage, null, 2)}\n`;

  if (args.has("--check")) {
    const current = readText(coveragePath);
    if (current !== json) {
      console.error(`${coveragePath} is not up to date. Run scripts/primary-sources-generate-coverage.mjs --write.`);
      process.exit(1);
    }
  }

  if (args.has("--summary")) printSummary(coverage);

  if (args.has("--write")) {
    writeFileSync(join(root, coveragePath), json);
    if (!args.has("--summary")) printSummary(coverage);
  }
}
