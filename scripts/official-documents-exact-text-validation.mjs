import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

const DEFAULT_MANIFEST_PATH = "content/official-documents/manifest.json";
const DEFAULT_EVIDENCE_PATH = "content/official-documents/validation/exact-text-validation-2026-05-20.json";
const CHECKED_AT = "2026-05-20";
const FETCH_TIMEOUT_MS = 45000;
const USER_AGENT = "Cabadrive exact-text validation/1.0 (source archive verification)";
const MAX_WRAPPER_CHARS = 240;

function parseArgs(argv) {
  const args = {
    manifestPath: DEFAULT_MANIFEST_PATH,
    evidencePath: DEFAULT_EVIDENCE_PATH,
    ids: undefined,
    write: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--manifest") args.manifestPath = argv[++index];
    else if (arg === "--evidence") args.evidencePath = argv[++index];
    else if (arg === "--ids") args.ids = argv[++index].split(",").map((id) => id.trim()).filter(Boolean);
    else if (arg === "--write") args.write = true;
    else if (arg === "--help") {
      console.log(`Usage: node scripts/official-documents-exact-text-validation.mjs [--ids id1,id2] [--write]

Downloads official source inputs from manifest sourceUrl/currentness.evidenceUrls, extracts meaningful source text,
normalizes Markdown/HTML/PDF layout noise, and writes exact-text validation evidence.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function decodeHtmlEntities(text) {
  const named = new Map([
    ["amp", "&"],
    ["apos", "'"],
    ["gt", ">"],
    ["lt", "<"],
    ["aacute", "á"],
    ["Aacute", "Á"],
    ["eacute", "é"],
    ["Eacute", "É"],
    ["iacute", "í"],
    ["Iacute", "Í"],
    ["oacute", "ó"],
    ["Oacute", "Ó"],
    ["uacute", "ú"],
    ["Uacute", "Ú"],
    ["ntilde", "ñ"],
    ["Ntilde", "Ñ"],
    ["uuml", "ü"],
    ["Uuml", "Ü"],
    ["ordm", "º"],
    ["deg", "°"],
    ["quot", "\""],
    ["laquo", "«"],
    ["raquo", "»"],
    ["ldquo", "“"],
    ["rdquo", "”"],
    ["lsquo", "‘"],
    ["rsquo", "’"],
    ["nbsp", " "]
  ]);

  return String(text)
    .replace(/&#(\d+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) => String.fromCodePoint(parseInt(codePoint, 16)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]+);/g, (match, name) => named.get(name) ?? match)
    .replace(/&([a-zA-Z][a-zA-Z0-9]+);/g, (match, name) => named.get(name) ?? match);
}

function extractFirstTag(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[\\s\\S]*?<\\/${tagName}>`, "i");
  return html.match(pattern)?.[0];
}

function htmlToText(html, { removeSiteShell }) {
  let body = String(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");

  if (removeSiteShell) {
    body = body.replace(/<(header|nav|footer|form|aside)\b[\s\S]*?<\/\1>/gi, " ");
  }

  body = body
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|td|th|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeHtmlEntities(body);
}

function htmlMeaningfulTextCandidates(html) {
  const preparedHtml = String(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");

  const rootCandidates = [
    { name: "html-main", html: extractFirstTag(preparedHtml, "main") },
    { name: "html-article", html: extractFirstTag(preparedHtml, "article") },
    { name: "html-body", html: extractFirstTag(preparedHtml, "body") },
    { name: "html-document", html: preparedHtml }
  ].filter((candidate) => candidate.html);

  const candidates = [];
  for (const candidate of rootCandidates) {
    for (const removeSiteShell of [true, false]) {
      candidates.push({
        name: `${candidate.name}${removeSiteShell ? "-without-site-shell" : "-with-site-shell"}`,
        text: normalizeComparableText(htmlToText(candidate.html, { removeSiteShell }))
      });
    }
  }

  const seen = new Set();
  return candidates.filter((candidate) => {
    if (candidate.text.length === 0 || seen.has(candidate.text)) return false;
    seen.add(candidate.text);
    return true;
  });
}

function markdownToText(markdown, { removeFirstHeading }) {
  let text = String(markdown);
  if (removeFirstHeading) text = text.replace(/^# .*\n+/, "");
  return text
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]\n]+)]\((?:https?:\/\/|\/)[^)]*\)/g, "$1")
    .replace(/\s+\[[^\]\n]+@[^\]\n]+]/g, "")
    .replace(/\s+\[(?:https?:\/\/)?[^\]\s]+\.[^\]\s]+\/?]/g, "")
    .replace(/\[[^\]\n]*(?:https?:\/\/|\/)[^\]\n]*]/g, " ")
    .replace(/^#+\s*/gm, "");
}

function removeArchivedPageChrome(markdown) {
  const lines = String(markdown).split("\n");
  const filtered = [];
  let skippingRelatedContent = false;
  let skippingFeedbackAndFooter = false;

  const socialShareLines = new Set([
    "Compartir en",
    "redes sociales",
    "- Compartir en Facebook",
    "- Compartir en X",
    "- Compartir en Linkedin",
    "- Compartir en Whatsapp",
    "- Compartir en Telegram"
  ]);

  const gcbaFooterStarts = [
    "Complete",
    "Ayudanos a mejorar",
    "¿Te fue útil esta página?",
    "Teléfonos útiles",
    "BUENOS AIRES CIUDAD",
    "Los contenidos de buenosaires.gob.ar"
  ];

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^#{1,6}\s+Noticias relacionadas$/i.test(trimmed)) {
      skippingRelatedContent = true;
      continue;
    }
    if (skippingRelatedContent) continue;

    if (
      gcbaFooterStarts.some((start) => trimmed.startsWith(start)) ||
      /^[*-]\s+Complete$/i.test(trimmed)
    ) {
      skippingFeedbackAndFooter = true;
      continue;
    }
    if (skippingFeedbackAndFooter) continue;

    if (!trimmed) {
      filtered.push(line);
      continue;
    }
    if (trimmed === "Inicio" || trimmed === "- Inicio" || trimmed === "* Inicio") continue;
    if (trimmed === "Pasar al contenido principal" || trimmed === "/" || trimmed === "*") continue;
    if (/^-{3,}$/.test(trimmed)) continue;
    if (/^\d+\.\s+.*\[\/[^\]]*]$/.test(trimmed)) continue;
    if (/^\*\s+Actual Paso/.test(trimmed) || /^\*\s+Paso/.test(trimmed)) continue;
    if (/^[*-]\s+Inicio\s+\[\/?]/.test(trimmed)) continue;
    if (/^[*-]\s+Compartir en /.test(trimmed) || socialShareLines.has(trimmed)) continue;

    filtered.push(line);
  }

  return filtered.join("\n");
}

function removeArchivedDateMetadata(markdown) {
  return String(markdown)
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (/^\d{1,2} de [a-záéíóúñ]+ de \d{4}$/iu.test(trimmed)) return false;
      return true;
    })
    .join("\n");
}

function substantiveArchiveSlices(markdown) {
  const slices = [];
  const sliceStarts = [
    "Principios Básicos",
    "Indice Temático",
    "Índice Temático",
    "TITULO I",
    "TÍTULO I",
    "ARTICULO 1",
    "Artículo 1",
    "Artículo 1°",
    "Art. 1"
  ];

  for (const marker of sliceStarts) {
    const index = markdown.indexOf(marker);
    if (index > 0) slices.push({ name: `markdown-from-${marker.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, text: markdown.slice(index) });
  }

  return slices;
}

function normalizeComparableText(text) {
  return String(text)
    .normalize("NFKC")
    .replace(/\r/g, "\n")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\u00a0/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/^\s*[-*•]+\s+/gm, "")
    .replace(/^\s*-{3,}\s*$/gm, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/([.;:)])\s*[-*•]\s+/g, "$1 - ")
    .replace(/\s+\(/g, "(")
    .replace(/(?<=\d)\s+(?=b\.o\.)/g, "")
    .replace(/(?<=\d)\s+(?=\d)/g, "")
    .trim();
}

function markdownCandidates(markdown) {
  const pageChromeRemoved = removeArchivedPageChrome(markdown);
  const pageChromeAndDateMetadataRemoved = removeArchivedDateMetadata(pageChromeRemoved);
  const candidates = [
    { name: "markdown-full", text: normalizeComparableText(markdownToText(markdown, { removeFirstHeading: false })) },
    { name: "markdown-without-title-heading", text: normalizeComparableText(markdownToText(markdown, { removeFirstHeading: true })) },
    { name: "markdown-without-page-chrome", text: normalizeComparableText(markdownToText(pageChromeRemoved, { removeFirstHeading: false })) },
    { name: "markdown-without-title-heading-and-page-chrome", text: normalizeComparableText(markdownToText(pageChromeRemoved, { removeFirstHeading: true })) },
    { name: "markdown-without-title-heading-page-chrome-and-date-metadata", text: normalizeComparableText(markdownToText(pageChromeAndDateMetadataRemoved, { removeFirstHeading: true })) },
    ...substantiveArchiveSlices(markdown).map((slice) => ({
      name: slice.name,
      text: normalizeComparableText(markdownToText(slice.text, { removeFirstHeading: false }))
    }))
  ];
  const seen = new Set();
  return candidates.filter((candidate) => {
    if (candidate.text.length === 0 || seen.has(candidate.text)) return false;
    seen.add(candidate.text);
    return true;
  });
}

function findTextMatch({ sourceText, archiveCandidates }) {
  for (const candidate of archiveCandidates) {
    if (sourceText === candidate.text) {
      return {
        passed: true,
        matchKind: "normalized_equality",
        archiveCandidate: candidate.name,
        sourcePrefixExtraChars: 0,
        sourceSuffixExtraChars: 0
      };
    }
  }

  for (const candidate of archiveCandidates) {
    const start = sourceText.indexOf(candidate.text);
    if (start < 0) continue;
    const suffixChars = sourceText.length - start - candidate.text.length;
    if (start <= MAX_WRAPPER_CHARS && suffixChars <= MAX_WRAPPER_CHARS) {
      return {
        passed: true,
        matchKind: "normalized_contiguous_match_with_small_official_wrapper",
        archiveCandidate: candidate.name,
        sourcePrefixExtraChars: start,
        sourceSuffixExtraChars: suffixChars
      };
    }
  }

  const rejectedSubset = archiveCandidates
    .map((candidate) => {
      const start = candidate.text.indexOf(sourceText);
      if (start < 0) return undefined;
      return {
        archiveCandidate: candidate.name,
        archivePrefixExtraChars: start,
        archiveSuffixExtraChars: candidate.text.length - start - sourceText.length
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftExtra = left.archivePrefixExtraChars + left.archiveSuffixExtraChars;
      const rightExtra = right.archivePrefixExtraChars + right.archiveSuffixExtraChars;
      return leftExtra - rightExtra;
    })[0];

  const best = archiveCandidates
    .map((candidate) => {
      let commonPrefixChars = 0;
      while (
        commonPrefixChars < candidate.text.length &&
        commonPrefixChars < sourceText.length &&
        candidate.text[commonPrefixChars] === sourceText[commonPrefixChars]
      ) {
        commonPrefixChars += 1;
      }
      return { candidate, commonPrefixChars };
    })
    .sort((left, right) => right.commonPrefixChars - left.commonPrefixChars)[0];

  return {
    passed: false,
    matchKind: "normalized_text_mismatch",
    archiveCandidate: best?.candidate.name,
    rejectedSubsetMatch: rejectedSubset
      ? {
          ...rejectedSubset,
          reason: "Live official source text is only a subset of archived Markdown; exact-text validation requires the full archive candidate to match the official source or fit inside bounded official wrapper text."
        }
      : undefined,
    commonPrefixChars: best?.commonPrefixChars ?? 0,
    archivePreviewAtMismatch: best?.candidate.text.slice(best.commonPrefixChars, best.commonPrefixChars + 240) ?? "",
    sourcePreviewAtMismatch: sourceText.slice(best?.commonPrefixChars ?? 0, (best?.commonPrefixChars ?? 0) + 240)
  };
}

function officialCandidateUrls(entry) {
  const urls = [entry.sourceUrl, ...(entry.currentness?.evidenceUrls ?? [])].filter(Boolean);
  return [...new Set(urls)];
}

function isPdfCandidateUrl(url) {
  return /\.pdf(?:$|[?#])/i.test(url) || /\/archivo(?:$|[?#])/i.test(url);
}

function isHtmlCandidateUrl(url) {
  return !isPdfCandidateUrl(url);
}

function decoderForResponse(url, headers) {
  const contentType = headers.get("content-type") ?? "";
  if (/charset\s*=\s*utf-?8/i.test(contentType)) return new TextDecoder("utf-8");
  if (/servicios\.infoleg\.gob\.ar/i.test(url)) return new TextDecoder("windows-1252");
  if (/charset\s*=\s*(iso-8859-1|windows-1252)/i.test(contentType)) return new TextDecoder("windows-1252");
  return new TextDecoder("utf-8");
}

async function fetchBytes(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/pdf;q=0.9,*/*;q=0.8"
      }
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get("content-type"),
      bytes,
      text: decoderForResponse(url, response.headers).decode(bytes)
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function validateHtmlEntry(entry, archiveMarkdown) {
  const archiveCandidates = markdownCandidates(archiveMarkdown);
  const attempts = [];

  for (const url of officialCandidateUrls(entry).filter(isHtmlCandidateUrl)) {
    try {
      const response = await fetchBytes(url);
      if (!response.ok) {
        attempts.push({
          url,
          finalUrl: response.finalUrl,
          httpStatus: response.status,
          contentType: response.contentType,
          sourceBytesSha256: sha256(response.bytes),
          passed: false,
          matchKind: "http_not_ok"
        });
        continue;
      }

      for (const sourceCandidate of htmlMeaningfulTextCandidates(response.text)) {
        const match = findTextMatch({ sourceText: sourceCandidate.text, archiveCandidates });
        const attempt = {
          url,
          finalUrl: response.finalUrl,
          httpStatus: response.status,
          contentType: response.contentType,
          sourceBytesSha256: sha256(response.bytes),
          sourceCandidate: sourceCandidate.name,
          normalizedSourceTextSha256: sha256(sourceCandidate.text),
          normalizedSourceLength: sourceCandidate.text.length,
          ...match
        };
        attempts.push(attempt);
        if (attempt.passed) {
          const archiveCandidate = archiveCandidates.find((candidate) => candidate.name === attempt.archiveCandidate);
          return {
            outcome: "passed",
            officialInputKind: "live_html",
            officialInputUrl: url,
            sourceCandidate: sourceCandidate.name,
            normalizedArchiveTextSha256: sha256(archiveCandidate.text),
            normalizedArchiveLength: archiveCandidate.text.length,
            attempts
          };
        }
      }
    } catch (error) {
      attempts.push({ url, error: error.message, matchKind: "fetch_or_extract_error", passed: false });
    }
  }

  return {
    outcome: "blocked",
    officialInputKind: "live_html",
    blocker: "No official HTML candidate from sourceUrl/currentness.evidenceUrls produced a normalized exact archive match.",
    attempts
  };
}

async function validatePdfEntry(entry, archiveMarkdown) {
  const localPdfBytes = readFileSync(entry.rawOriginalPath);
  const localPdfSha256 = sha256(localPdfBytes);
  const pdfData = await pdfParse(localPdfBytes);
  const extractedPdfText = normalizeComparableText(pdfData.text);
  const archiveCandidates = markdownCandidates(archiveMarkdown);
  const pdfTextMatch = findTextMatch({ sourceText: extractedPdfText, archiveCandidates });
  const attempts = [];
  let liveByteMatch;

  for (const url of officialCandidateUrls(entry).filter(isPdfCandidateUrl)) {
    try {
      const response = await fetchBytes(url);
      const sourceBytesSha256 = sha256(response.bytes);
      const attempt = {
        url,
        finalUrl: response.finalUrl,
        httpStatus: response.status,
        contentType: response.contentType,
        sourceBytesSha256,
        localRawOriginalSha256: localPdfSha256,
        liveBytesMatchLocalRawOriginal: response.ok && sourceBytesSha256 === localPdfSha256
      };
      attempts.push(attempt);
      if (attempt.liveBytesMatchLocalRawOriginal) {
        liveByteMatch = attempt;
        break;
      }
    } catch (error) {
      attempts.push({ url, error: error.message, liveBytesMatchLocalRawOriginal: false });
    }
  }

  if (!liveByteMatch) {
    return {
      outcome: "blocked",
      officialInputKind: "live_pdf",
      localRawOriginalSha256: localPdfSha256,
      pdfParseVersion: "1.1.1",
      pdfPages: pdfData.numpages,
      blocker: "No live official PDF candidate byte-for-byte matched the local raw original.",
      attempts
    };
  }

  if (!pdfTextMatch.passed) {
    return {
      outcome: "blocked",
      officialInputKind: "live_pdf_plus_local_pdf_parse",
      localRawOriginalSha256: localPdfSha256,
      pdfParseVersion: "1.1.1",
      pdfPages: pdfData.numpages,
      normalizedPdfTextSha256: sha256(extractedPdfText),
      normalizedPdfTextLength: extractedPdfText.length,
      blocker: "The local raw official PDF is authentic, but deterministic pdf-parse extraction does not match archived Markdown exactly.",
      pdfTextMatch,
      attempts
    };
  }

  const archiveCandidate = archiveCandidates.find((candidate) => candidate.name === pdfTextMatch.archiveCandidate);
  return {
    outcome: "passed",
    officialInputKind: "live_pdf_plus_local_pdf_parse",
    officialInputUrl: liveByteMatch.url,
    localRawOriginalSha256: localPdfSha256,
    pdfParseVersion: "1.1.1",
    pdfPages: pdfData.numpages,
    normalizedPdfTextSha256: sha256(extractedPdfText),
    normalizedPdfTextLength: extractedPdfText.length,
    normalizedArchiveTextSha256: sha256(archiveCandidate.text),
    normalizedArchiveLength: archiveCandidate.text.length,
    pdfTextMatch,
    attempts
  };
}

async function validateEntry(entry) {
  if (!existsSync(entry.localPath)) {
    return { id: entry.id, title: entry.title, outcome: "blocked", blocker: "Archived Markdown file is missing." };
  }

  const archiveMarkdown = readFileSync(entry.localPath, "utf8");
  const base = {
    id: entry.id,
    title: entry.title,
    sourceFormat: entry.sourceFormat,
    sourceUrl: entry.sourceUrl,
    localPath: entry.localPath,
    rawOriginalPath: entry.rawOriginalPath,
    archiveMarkdownSha256: sha256(archiveMarkdown)
  };

  if (entry.sourceFormat === "pdf") {
    if (!entry.rawOriginalPath || !existsSync(entry.rawOriginalPath)) {
      return { ...base, outcome: "blocked", blocker: "PDF rawOriginalPath is missing." };
    }
    return { ...base, ...(await validatePdfEntry(entry, archiveMarkdown)) };
  }

  return { ...base, ...(await validateHtmlEntry(entry, archiveMarkdown)) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = readJson(args.manifestPath);
  const selectedIds = new Set(args.ids ?? manifest.entries.map((entry) => entry.id));
  const entries = manifest.entries.filter((entry) => selectedIds.has(entry.id));
  const missingIds = [...selectedIds].filter((id) => !manifest.entries.some((entry) => entry.id === id));
  if (missingIds.length > 0) throw new Error(`Unknown manifest IDs: ${missingIds.join(", ")}`);

  const results = [];
  for (const entry of entries) {
    console.log(`Validating ${entry.id}...`);
    results.push(await validateEntry(entry));
  }

  const summary = {
    total: results.length,
    passed: results.filter((result) => result.outcome === "passed").length,
    blocked: results.filter((result) => result.outcome === "blocked").length,
    failed: results.filter((result) => result.outcome === "failed").length
  };

  const evidence = {
    schema: "official-documents-exact-text-validation-evidence.v1",
    featureId: "019-primary-sources-section",
    checkedAt: CHECKED_AT,
    manifestPath: args.manifestPath,
    command: `node scripts/official-documents-exact-text-validation.mjs${args.ids ? ` --ids ${args.ids.join(",")}` : ""} --write`,
    summary,
    method: {
      officialInputs: "For each manifest entry, the validator tries sourceUrl followed by currentness.evidenceUrls. HTML entries must match a live official HTML input. PDF entries must first prove live official PDF bytes match rawOriginalPath, then prove pdf-parse 1.1.1 text extraction matches archived Markdown.",
      htmlExtraction: "Remove script/style/noscript/svg noise, build audited live-source candidates from main/article/body/full document with and without removable site shell, flatten tags to visible text, and decode HTML entities.",
      markdownNormalization: "Remove Markdown heading markers, local image references, and visible link target annotations; keep official wording order.",
      comparableNormalization: "NFKC, lowercase, collapse whitespace, trim whitespace before punctuation, normalize curly quotes. This accepts HTML/PDF layout noise but keeps omissions, additions inside the body, and order changes detectable.",
      archiveCandidates: "Archived Markdown is compared as full text, without the local title heading, without reproducible page-navigation/related-content/feedback/footer chrome, without date-only page metadata, and from stable substantive legal/body markers when an official live mirror omits publication-page metadata but preserves the normative body.",
      layoutNormalization: "The normalizer also removes Markdown/HTML separator-only lines, duplicate link-target annotations, spaces before parentheticals, and digit-internal layout whitespace observed in official InfoLeg HTML, without changing letters, punctuation, or text order.",
      wrapperTolerance: `A live source may contain the archived body as one contiguous block with at most ${MAX_WRAPPER_CHARS} normalized characters of official wrapper text before/after it. Larger additions remain blocked; live-source-as-subset-of-archive matches are recorded as rejected diagnostics, never as pass evidence.`
    },
    results
  };

  console.log(JSON.stringify(summary, null, 2));
  for (const result of results.filter((entry) => entry.outcome !== "passed")) {
    console.log(`${result.id}: ${result.outcome} - ${result.blocker ?? result.matchKind ?? "see evidence"}`);
  }

  if (args.write) {
    mkdirSync(dirname(args.evidencePath), { recursive: true });
    writeFileSync(args.evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(`Wrote ${args.evidencePath}`);
  }

  if (summary.blocked > 0 || summary.failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
