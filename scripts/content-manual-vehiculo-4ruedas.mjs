#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

export const MANUAL_DOCUMENT_ID = "gcba-manual-vehiculo-4-ruedas-2023";
export const MANUAL_MANIFEST_PATH = `content/manuals/${MANUAL_DOCUMENT_ID}/manual.ru.json`;
export const MANUAL_LAYOUT_PATH = `content/manuals/${MANUAL_DOCUMENT_ID}/layout.ru.json`;
export const MANUAL_NAVIGATION_PATH = `content/manuals/${MANUAL_DOCUMENT_ID}/navigation.ru.json`;
export const MANUAL_ASSET_DIRECTORY = `content/assets/manuals/${MANUAL_DOCUMENT_ID}/pages`;
export const EXPECTED_SOURCE = {
  rawOriginalPath: `content/official-documents/originals/${MANUAL_DOCUMENT_ID}.pdf`,
  archiveMarkdownPath: `content/official-documents/documents/${MANUAL_DOCUMENT_ID}.md`,
  rawOriginalSha256: "69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e",
  pageCount: 200,
  titleEs: "Manual de conducción vehicular - Categoría B / Automóviles",
  sourceUrl: "https://static.buenosaires.gob.ar/sites/default/files/2024-11/MANUAL_Vehiculo_4Ruedas_2023%20SA.pdf"
};

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const LAYOUT_SCHEMA = "cabadrive-manual-layout-ru.v1";
const NAVIGATION_SCHEMA = "cabadrive-manual-navigation-ru.v1";
const PLACEHOLDER_PATTERN =
  /(?:^|[^\p{L}\p{N}_])(?:todo|tbd|placeholder|draft|lorem\s+ipsum|чернов\p{L}*|заглушк\p{L}*)(?=$|[^\p{L}\p{N}_])/iu;
const MANUAL_CHUNK_SHARDS = [
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--001-050.ru.json`,
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--051-100.ru.json`,
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--101-150.ru.json`,
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--151-198.ru.json`
];
const MANUAL_QA_SHARDS = [
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--001-050.qa.json`,
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--051-100.qa.json`,
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--101-150.qa.json`,
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--151-198.qa.json`
];
const SUPPLEMENTAL_VISUAL_TEXT = new Map([
  [
    199,
    {
      sourceTextEs:
        "Ilustración de cierre con textos repetidos: Tránsito; Señales; Peatones; Movilidad sustentable.",
      fullTranslationRu:
        "Завершающая иллюстрация с повторяющимися надписями: дорожное движение; знаки; пешеходы; устойчивая мобильность.",
      headingRu: "Завершающая иллюстрация"
    }
  ],
  [
    200,
    {
      sourceTextEs: "Buenos Aires Ciudad.",
      fullTranslationRu: "Город Буэнос-Айрес.",
      headingRu: "Логотип города Буэнос-Айрес"
    }
  ]
]);
const MANUAL_TOP_LEVEL_NAVIGATION = [
  {
    id: "front-matter",
    titleRu: "Начало и справочные страницы",
    titleEs: "Presentacion, glosario e indice",
    level: "frontMatter",
    startPage: 1,
    endPage: 13,
    sourceEvidence: "curated_manual_review",
    children: [
      { id: "front-title", titleRu: "Титульная страница", titleEs: "Portada", startPage: 1, sourceEvidence: "page_heading" },
      { id: "front-presentation", titleRu: "Презентация", titleEs: "Presentacion", startPage: 2, sourceEvidence: "page_heading" },
      { id: "front-categories", titleRu: "Материал по категориям", titleEs: "Material por categorias", startPage: 3, sourceEvidence: "page_heading" },
      { id: "front-glossary", titleRu: "Глоссарий", titleEs: "Glosario", startPage: 4, sourceEvidence: "page_heading" },
      { id: "front-index", titleRu: "Индекс", titleEs: "Indice", startPage: 12, sourceEvidence: "index_pages_11_12" }
    ]
  },
  {
    id: "introduction",
    titleRu: "Введение",
    titleEs: "Introduccion",
    level: "chapter",
    startPage: 14,
    endPage: 20,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 13,
    children: [
      { id: "intro-road-pandemic", titleRu: "Дорожная пандемия", titleEs: "Pandemia vial", startPage: 15, sourceEvidence: "index_pages_11_12" },
      {
        id: "intro-ethical-civic-approach",
        titleRu: "Этико-гражданский подход в дорожной культуре",
        titleEs: "Enfoque etico ciudadano en la cultura vial",
        startPage: 16,
        sourceEvidence: "index_pages_11_12"
      },
      { id: "intro-incident", titleRu: "Авария или дорожный инцидент?", titleEs: "Accidente o incidente vial?", startPage: 17, sourceEvidence: "index_pages_11_12" },
      {
        id: "intro-road-safety-plan",
        titleRu: "План дорожной безопасности города Буэнос-Айрес",
        titleEs: "Plan de seguridad vial de la Ciudad de Buenos Aires",
        startPage: 18,
        sourceEvidence: "index_pages_11_12"
      }
    ]
  },
  {
    id: "chapter-1-sustainable-mobility",
    titleRu: "Глава 1: К устойчивой мобильности",
    titleEs: "Capitulo 1: Hacia una movilidad sustentable",
    level: "chapter",
    startPage: 21,
    endPage: 42,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 20,
    children: [
      { id: "ch1-cities-for-people", titleRu: "Города для людей", titleEs: "Ciudades para las personas", startPage: 22, sourceEvidence: "index_pages_11_12" },
      {
        id: "ch1-sustainable-mobility",
        titleRu: "Что такое устойчивая мобильность?",
        titleEs: "Que es la movilidad sustentable?",
        startPage: 23,
        sourceEvidence: "index_pages_11_12"
      },
      { id: "ch1-pedestrian-priority", titleRu: "Пешеходный приоритет", titleEs: "Prioridad peatonal", startPage: 24, sourceEvidence: "index_pages_11_12" },
      { id: "ch1-bicycle", titleRu: "Велосипед", titleEs: "Bicicleta", startPage: 30, sourceEvidence: "index_pages_11_12" },
      {
        id: "ch1-public-transport-system",
        titleRu: "Система общественного транспорта",
        titleEs: "Sistema de transporte publico",
        startPage: 39,
        sourceEvidence: "index_pages_11_12"
      },
      { id: "ch1-shared-trip", titleRu: "Совместная поездка", titleEs: "Viaje compartido", startPage: 41, sourceEvidence: "index_pages_11_12" }
    ]
  },
  {
    id: "chapter-2-responsibility",
    titleRu: "Глава 2: Управление транспортным средством - акт ответственности",
    titleEs: "Capitulo 2: Conducir un vehiculo - un acto de responsabilidad",
    level: "chapter",
    startPage: 43,
    endPage: 56,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 42,
    children: [
      { id: "ch2-legal-responsibility", titleRu: "Юридическая ответственность", titleEs: "Responsabilidad juridica", startPage: 44, sourceEvidence: "index_pages_11_12" },
      { id: "ch2-required-documents", titleRu: "Обязательные документы", titleEs: "Documentacion obligatoria", startPage: 46, sourceEvidence: "index_pages_11_12" },
      {
        id: "ch2-incident-obligations",
        titleRu: "Обязанности в случае дорожных инцидентов",
        titleEs: "Obligaciones en caso de incidentes viales",
        startPage: 51,
        sourceEvidence: "index_pages_11_12"
      },
      { id: "ch2-scoring", titleRu: "Система баллов Scoring", titleEs: "Sistema de puntos Scoring", startPage: 56, sourceEvidence: "index_pages_11_12" }
    ]
  },
  {
    id: "chapter-3-driving-rules",
    titleRu: "Глава 3: Основные нормы вождения",
    titleEs: "Capitulo 3: Normas basicas de conduccion",
    level: "chapter",
    startPage: 57,
    endPage: 88,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 56,
    children: [
      { id: "ch3-priority-of-rules", titleRu: "Приоритет норм", titleEs: "Prioridad normativa", startPage: 58, sourceEvidence: "index_pages_11_12" },
      { id: "ch3-right-of-way", titleRu: "Преимущество проезда", titleEs: "Prioridad de paso", startPage: 64, sourceEvidence: "index_pages_11_12" },
      { id: "ch3-lights", titleRu: "Использование света", titleEs: "Uso de luces", startPage: 67, sourceEvidence: "index_pages_11_12" },
      { id: "ch3-speed", titleRu: "Скорость", titleEs: "Velocidad", startPage: 69, sourceEvidence: "index_pages_11_12" },
      { id: "ch3-turns", titleRu: "Повороты на перекрестках", titleEs: "Giros en intersecciones", startPage: 75, sourceEvidence: "index_pages_11_12" },
      { id: "ch3-overtaking", titleRu: "Обгон и опережение", titleEs: "Adelantamiento y sobrepaso", startPage: 76, sourceEvidence: "index_pages_11_12" },
      {
        id: "ch3-highways",
        titleRu: "Движение по автомагистралям и другим скоростным дорогам",
        titleEs: "Circulacion por autopistas y otras vias rapidas",
        startPage: 78,
        sourceEvidence: "index_pages_11_12"
      },
      {
        id: "ch3-adverse-conditions",
        titleRu: "Вождение в неблагоприятных условиях",
        titleEs: "Conduccion en condiciones adversas",
        startPage: 79,
        sourceEvidence: "index_pages_11_12"
      },
      { id: "ch3-stopping-parking", titleRu: "Остановка и стоянка", titleEs: "Detencion y estacionamiento", startPage: 83, sourceEvidence: "index_pages_11_12" }
    ]
  },
  {
    id: "chapter-4-natural-capacity",
    titleRu: "Глава 4: Естественная способность",
    titleEs: "Capitulo 4: Capacidad natural",
    level: "chapter",
    startPage: 89,
    endPage: 97,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 88,
    children: [
      { id: "ch4-alcohol-drugs", titleRu: "Употребление алкоголя и наркотиков", titleEs: "Consumo de alcohol y drogas", startPage: 90, sourceEvidence: "index_pages_11_12" },
      { id: "ch4-sleep-fatigue", titleRu: "Сон и усталость", titleEs: "Sueno y fatiga", startPage: 93, sourceEvidence: "index_pages_11_12" },
      { id: "ch4-stress", titleRu: "Стресс", titleEs: "Estres", startPage: 95, sourceEvidence: "index_pages_11_12" },
      { id: "ch4-distractions", titleRu: "Отвлечения", titleEs: "Distracciones", startPage: 95, sourceEvidence: "index_pages_11_12" }
    ]
  },
  {
    id: "chapter-5-driving-behavior",
    titleRu: "Глава 5: Поведение при управлении",
    titleEs: "Capitulo 5: Comportamiento al conducir",
    level: "chapter",
    startPage: 98,
    endPage: 103,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 97,
    children: [
      { id: "ch5-attitude-types", titleRu: "Типы установок", titleEs: "Tipos de actitudes", startPage: 99, sourceEvidence: "index_pages_11_12" },
      { id: "ch5-equal-society", titleRu: "К равноправному обществу", titleEs: "Hacia una sociedad igualitaria", startPage: 100, sourceEvidence: "index_pages_11_12" },
      {
        id: "ch5-gender-violence-prevention",
        titleRu: "Профилактика и помощь в ситуациях гендерного насилия",
        titleEs: "Prevencion y asistencia en situaciones de violencia de genero",
        startPage: 100,
        sourceEvidence: "index_pages_11_12"
      },
      {
        id: "ch5-anticipatory-efficient-driving",
        titleRu: "Предупредительное и эффективное вождение",
        titleEs: "Conduccion preventiva y eficiente",
        startPage: 101,
        sourceEvidence: "index_pages_11_12"
      }
    ]
  },
  {
    id: "appendix-1-private-cars",
    titleRu: "Приложение I. Частные автомобили",
    titleEs: "Anexo I. Automoviles particulares",
    level: "appendix",
    startPage: 104,
    endPage: 122,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 103,
    children: [
      { id: "app1-safety-elements", titleRu: "Элементы безопасности", titleEs: "Elementos de seguridad", startPage: 105, sourceEvidence: "index_pages_11_12" },
      {
        id: "app1-other-required-safety-elements",
        titleRu: "Другие обязательные элементы безопасности",
        titleEs: "Otros elementos de seguridad obligatorios",
        startPage: 119,
        sourceEvidence: "index_pages_11_12"
      },
      {
        id: "app1-recommended-safety-elements",
        titleRu: "Рекомендуемые элементы безопасности",
        titleEs: "Elementos de seguridad recomendados",
        startPage: 121,
        sourceEvidence: "index_pages_11_12"
      }
    ]
  },
  {
    id: "appendix-2-passenger-transport",
    titleRu: "Приложение II. Пассажирский транспорт",
    titleEs: "Anexo II. Transporte de pasajeros",
    level: "appendix",
    startPage: 123,
    endPage: 151,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 122,
    children: [
      { id: "app2-social-responsibility", titleRu: "Социальная ответственность", titleEs: "Responsabilidad social", startPage: 124, sourceEvidence: "index_pages_11_12" },
      { id: "app2-safety-elements", titleRu: "Элементы безопасности", titleEs: "Elementos de seguridad", startPage: 125, sourceEvidence: "index_pages_11_12" },
      {
        id: "app2-driving-factors",
        titleRu: "Факторы, участвующие в вождении",
        titleEs: "Factores que intervienen en la conduccion",
        startPage: 137,
        sourceEvidence: "index_pages_11_12"
      },
      { id: "app2-safe-driving", titleRu: "Безопасное вождение", titleEs: "Conduccion segura", startPage: 144, sourceEvidence: "index_pages_11_12" },
      { id: "app2-highways-hospitals", titleRu: "Автомагистрали и больницы", titleEs: "Autopistas y hospitales", startPage: 149, sourceEvidence: "index_pages_11_12" }
    ]
  },
  {
    id: "appendix-3-cargo",
    titleRu: "Приложение III. Перевозка грузов и товаров",
    titleEs: "Anexo III. Transporte de cargas y mercancias",
    level: "appendix",
    startPage: 152,
    endPage: 183,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 151,
    children: [
      { id: "app3-cargo-driver-profile", titleRu: "Профиль перевозчика грузов", titleEs: "Perfil del transportista de carga", startPage: 153, sourceEvidence: "index_pages_11_12" },
      { id: "app3-social-responsibility", titleRu: "Социальная ответственность", titleEs: "Responsabilidad social", startPage: 155, sourceEvidence: "index_pages_11_12" },
      {
        id: "app3-driving-factors",
        titleRu: "Факторы, участвующие в вождении",
        titleEs: "Factores que intervienen en la conduccion",
        startPage: 160,
        sourceEvidence: "index_pages_11_12"
      },
      { id: "app3-safe-driving", titleRu: "Безопасное вождение", titleEs: "Conduccion segura", startPage: 162, sourceEvidence: "index_pages_11_12" },
      { id: "app3-safety-elements", titleRu: "Элементы безопасности", titleEs: "Elementos de seguridad", startPage: 169, sourceEvidence: "index_pages_11_12" },
      { id: "app3-highways", titleRu: "Автомагистрали", titleEs: "Autopistas", startPage: 182, sourceEvidence: "index_pages_11_12" }
    ]
  },
  {
    id: "appendix-4-road-signs",
    titleRu: "Приложение IV. Дорожные знаки",
    titleEs: "Anexo IV. Senales viales",
    level: "appendix",
    startPage: 184,
    endPage: 200,
    sourceEvidence: "index_pages_11_12",
    requiredPrintedPage: 183,
    children: [
      { id: "app4-signs-regulatory", titleRu: "Предписывающие", titleEs: "Reglamentarias", startPage: 185, sourceEvidence: "index_pages_11_12" },
      { id: "app4-signs-warning", titleRu: "Предупреждающие", titleEs: "Preventivas", startPage: 187, sourceEvidence: "index_pages_11_12" },
      { id: "app4-signs-informational", titleRu: "Информационные", titleEs: "Informativas", startPage: 189, sourceEvidence: "index_pages_11_12" },
      { id: "app4-signs-temporary", titleRu: "Временные", titleEs: "Transitorias", startPage: 193, sourceEvidence: "index_pages_11_12" },
      { id: "app4-signs-horizontal", titleRu: "Горизонтальные", titleEs: "Horizontales", startPage: 195, sourceEvidence: "index_pages_11_12" },
      { id: "app4-signs-traffic-lights", titleRu: "Световая сигнализация", titleEs: "Senalizacion luminosa", startPage: 197, sourceEvidence: "index_pages_11_12" }
    ]
  }
];

function path(root, relativePath) {
  return join(root, relativePath);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function normalizePath(value) {
  return String(value || "").replaceAll("\\", "/");
}

function readJson(root, relativePath) {
  return JSON.parse(readFileSync(path(root, relativePath), "utf8"));
}

function sha256Buffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function sha256Text(value) {
  return sha256Buffer(Buffer.from(value, "utf8"));
}

function sha256File(root, relativePath) {
  return sha256Buffer(readFileSync(path(root, relativePath)));
}

function padPageNumber(pageNumber) {
  return String(pageNumber).padStart(3, "0");
}

function assetPathForPage(pageNumber) {
  return `${MANUAL_ASSET_DIRECTORY}/page-${padPageNumber(pageNumber)}.jpg`;
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return undefined;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) return undefined;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return undefined;
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += length;
  }
  return undefined;
}

function pageAssetMetadata(root, pageNumber) {
  const localPath = assetPathForPage(pageNumber);
  const absolutePath = path(root, localPath);
  if (!existsSync(absolutePath)) {
    return {
      localPath,
      format: "jpeg",
      width: 0,
      height: 0,
      sha256: ""
    };
  }
  const buffer = readFileSync(absolutePath);
  const dimensions = jpegDimensions(buffer) ?? { width: 0, height: 0 };
  return {
    localPath,
    format: "jpeg",
    width: dimensions.width,
    height: dimensions.height,
    sha256: sha256Buffer(buffer)
  };
}

function extractShardDocument(shard, relativePath, errors) {
  const document = shard.document ?? (Array.isArray(shard.documents) ? shard.documents[0] : undefined);
  if (!isPlainObject(document)) {
    errors.push(`${relativePath}: shard must contain document or documents[0].`);
    return undefined;
  }
  if (document.officialDocumentId !== MANUAL_DOCUMENT_ID) {
    errors.push(`${relativePath}: officialDocumentId must be ${MANUAL_DOCUMENT_ID}.`);
  }
  return document;
}

export function loadManualChunkCorpus(root = defaultRoot) {
  const errors = [];
  const chunks = [];
  const qaRecords = [];
  const chunkShardById = new Map();
  const qaShardById = new Map();

  for (const relativePath of MANUAL_CHUNK_SHARDS) {
    if (!existsSync(path(root, relativePath))) {
      errors.push(`${relativePath}: manual translation shard is missing.`);
      continue;
    }
    const shard = readJson(root, relativePath);
    const document = extractShardDocument(shard, relativePath, errors);
    for (const chunk of document?.chunks ?? []) {
      chunks.push(chunk);
      if (isNonEmptyString(chunk?.chunkId)) chunkShardById.set(chunk.chunkId, relativePath);
    }
  }

  for (const relativePath of MANUAL_QA_SHARDS) {
    if (!existsSync(path(root, relativePath))) {
      errors.push(`${relativePath}: manual QA shard is missing.`);
      continue;
    }
    const shard = readJson(root, relativePath);
    const document = extractShardDocument(shard, relativePath, errors);
    for (const record of document?.chunks ?? []) {
      qaRecords.push(record);
      if (isNonEmptyString(record?.chunkId)) qaShardById.set(record.chunkId, relativePath);
    }
  }

  chunks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.chunkId).localeCompare(String(b.chunkId)));
  return { errors, chunks, qaRecords, chunkShardById, qaShardById };
}

function sourceHeadingRuForChunk(chunk) {
  const label = chunk.officialLabel || String(chunk.order);
  if (label === EXPECTED_SOURCE.titleEs) return "Титульная страница";
  const pageLabel = `Страница ${label}`;
  const translationLines = String(chunk.fullTranslationRu || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^#+\s*/, "").trim())
    .filter(Boolean);
  const firstContentLine = translationLines.find((line) => !/^\d+$/.test(line));
  if (!firstContentLine) return pageLabel;
  const shortHeading = firstContentLine.length > 92 ? `${firstContentLine.slice(0, 89)}...` : firstContentLine;
  return `${pageLabel}: ${shortHeading}`;
}

function translationEntryForPage(pageNumber, corpus) {
  const chunk = corpus.chunks.find((candidate) => candidate.order === pageNumber);
  const supplemental = SUPPLEMENTAL_VISUAL_TEXT.get(pageNumber);
  if (chunk) {
    const qaRecord = corpus.qaRecords.find((candidate) => candidate.chunkId === chunk.chunkId);
    return {
      status: "reused_primary_source_chunk",
      sourceTextCoverage: "pdf_extracted_visible_text",
      exactCoverage: true,
      sourceTextEs: chunk.originalSpanish,
      fullTranslationRu: chunk.fullTranslationRu,
      headingRu: sourceHeadingRuForChunk(chunk),
      headingPathEs: chunk.headingPath ?? [],
      officialLabel: chunk.officialLabel ?? String(pageNumber),
      chunkProvenance: {
        chunkId: chunk.chunkId,
        order: chunk.order,
        sourceSpan: chunk.sourceSpan,
        sourceTextSha256: chunk.sourceTextSha256,
        sourceFingerprint: chunk.sourceFingerprint,
        shardPath: corpus.chunkShardById.get(chunk.chunkId),
        qaShardPath: corpus.qaShardById.get(chunk.chunkId),
        translationQaStatus: qaRecord?.translationQa?.status,
        translationQaCheckedAt: qaRecord?.translationQa?.checkedAt,
        simplificationQaStatus: qaRecord?.simplificationQa?.status
      }
    };
  }
  if (supplemental) {
    return {
      status: "manual_visual_text",
      sourceTextCoverage: "visual_label_text",
      exactCoverage: true,
      sourceTextEs: supplemental.sourceTextEs,
      fullTranslationRu: supplemental.fullTranslationRu,
      headingRu: supplemental.headingRu,
      headingPathEs: [EXPECTED_SOURCE.titleEs, `PDF page ${pageNumber}`],
      officialLabel: String(pageNumber),
      visualTextTranslationProvenance: {
        featureId: "027-manual-vehiculo-4ruedas-ru",
        method: "manual visual-label transcription from page-faithful render",
        reviewedAt: "2026-05-26"
      }
    };
  }
  return {
    status: "missing",
    sourceTextCoverage: "missing",
    exactCoverage: false,
    sourceTextEs: "",
    fullTranslationRu: "",
    headingRu: `Страница ${pageNumber}`,
    headingPathEs: [EXPECTED_SOURCE.titleEs, `PDF page ${pageNumber}`],
    officialLabel: String(pageNumber)
  };
}

export function buildManualManifest(root = defaultRoot) {
  const corpus = loadManualChunkCorpus(root);
  const pages = Array.from({ length: EXPECTED_SOURCE.pageCount }, (_, index) => {
    const pageNumber = index + 1;
    return {
      pageNumber,
      sourcePageNumber: pageNumber,
      sourceTrace: {
        officialDocumentId: MANUAL_DOCUMENT_ID,
        rawOriginalPath: EXPECTED_SOURCE.rawOriginalPath,
        rawOriginalSha256: EXPECTED_SOURCE.rawOriginalSha256
      },
      visualAsset: pageAssetMetadata(root, pageNumber),
      translation: translationEntryForPage(pageNumber, corpus)
    };
  });

  const reusedApprovedChunkPages = pages.filter((page) => page.translation.status === "reused_primary_source_chunk").length;
  const manualVisualTextPages = pages.filter((page) => page.translation.status === "manual_visual_text").length;

  return {
    schema: "cabadrive-manual-ru.v1",
    version: 1,
    id: `${MANUAL_DOCUMENT_ID}-ru-complete`,
    locale: "ru",
    contentStatus: "unofficial_exact_translation",
    titleRu: "Полное руководство GCBA для транспортных средств категории B",
    titleEs: EXPECTED_SOURCE.titleEs,
    source: {
      officialDocumentId: MANUAL_DOCUMENT_ID,
      rawOriginalPath: EXPECTED_SOURCE.rawOriginalPath,
      rawOriginalSha256: EXPECTED_SOURCE.rawOriginalSha256,
      archiveMarkdownPath: EXPECTED_SOURCE.archiveMarkdownPath,
      sourceUrl: EXPECTED_SOURCE.sourceUrl,
      pageCount: EXPECTED_SOURCE.pageCount
    },
    visualAssetSet: {
      strategy: "page_faithful_pdf_render",
      generator: "scripts/render-manual-pdf-pages.swift",
      generatedFromPdfSha256: EXPECTED_SOURCE.rawOriginalSha256,
      renderScale: 2,
      format: "jpeg",
      compressionQuality: 0.9,
      assetDirectory: MANUAL_ASSET_DIRECTORY
    },
    translationCoverage: {
      strategy: "approved_primary_source_chunks_plus_manual_visual_label_pages",
      requiredPages: EXPECTED_SOURCE.pageCount,
      reusedApprovedChunkPages,
      manualVisualTextPages,
      omittedPages: pages.filter((page) => page.translation.status === "missing").length,
      chunkShardPaths: MANUAL_CHUNK_SHARDS,
      qaShardPaths: MANUAL_QA_SHARDS
    },
    pages
  };
}

function normalizeManualLayoutText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function manualTranslationFingerprint(manifest) {
  return sha256Text(
    (manifest.pages ?? [])
      .map((page) => `${page.pageNumber}:${normalizeManualLayoutText(page.translation?.fullTranslationRu)}`)
      .join("\n---cabadrive-manual-page---\n")
  );
}

function manualSourceIndexFingerprint(manifest) {
  return sha256Text([12, 13].map((pageNumber) => normalizeManualLayoutText(manifest.pages?.[pageNumber - 1]?.translation?.fullTranslationRu)).join("\n"));
}

function pageLayoutKind(pageNumber) {
  if ([1, 14, 21, 43, 57, 89, 98, 104, 123, 152, 184, 199, 200].includes(pageNumber)) return "section-divider";
  if (pageNumber >= 185 && pageNumber <= 198) return "visual-heavy";
  if ([12, 13].includes(pageNumber)) return "index";
  if (pageNumber <= 11) return "front-matter";
  return "text";
}

function flowRegionForLayoutKind(kind, textLength) {
  if (kind === "section-divider") return { x: 0.24, y: 0.33, width: 0.54, height: 0.24 };
  if (kind === "visual-heavy") {
    return textLength > 500
      ? { x: 0.22, y: 0.62, width: 0.58, height: 0.24 }
      : { x: 0.23, y: 0.70, width: 0.56, height: 0.12 };
  }
  if (kind === "index") return { x: 0.24, y: 0.22, width: 0.56, height: 0.62 };
  if (kind === "front-matter") return { x: 0.23, y: 0.24, width: 0.58, height: 0.56 };
  return { x: 0.25, y: 0.27, width: 0.56, height: 0.54 };
}

function fontScaleForText(kind, textLength, lineCount) {
  if (kind === "section-divider") return 1.18;
  if (kind === "visual-heavy" && textLength < 220) return 0.9;
  if (kind === "index") return 0.68;
  const density = Math.max(textLength / 900, lineCount / 18);
  if (density > 3.2) return 0.48;
  if (density > 2.2) return 0.56;
  if (density > 1.45) return 0.66;
  if (density > 0.9) return 0.76;
  return 0.88;
}

function boundsWithinRegion(region, index, count) {
  const slot = region.height / Math.max(count, 1);
  return {
    x: Number(region.x.toFixed(4)),
    y: Number(Math.min(region.y + slot * index, region.y + region.height - Math.min(slot, 0.02)).toFixed(4)),
    width: Number(region.width.toFixed(4)),
    height: Number(Math.max(0.006, Math.min(slot * 0.92, region.height)).toFixed(4))
  };
}

function textBlockType(line, pageNumber, index, lines) {
  const trimmed = line.trim();
  if (/^\d+$/.test(trimmed) && index === 0) return "pageNumber";
  if (/^\d+\//u.test(trimmed) || /^Источник\b/iu.test(trimmed)) return "footnote";
  if (/^#+\s/u.test(trimmed)) return "heading";
  if (/^[•*-]\s/u.test(trimmed)) return "list";
  if (/[.]{4,}\s*стр\./iu.test(trimmed)) return "tableCell";
  if (pageNumber >= 185 && pageNumber <= 198) return trimmed.length <= 90 ? "label" : "caption";
  if (pageNumber >= 199) return "caption";
  if (index <= 2 && (trimmed === trimmed.toLocaleUpperCase("ru-RU") || trimmed.length <= 72)) return "heading";
  if (lines.length <= 4 && index > 0) return "callout";
  return "body";
}

function splitLayoutBlocks(page, region) {
  const lines = String(page.translation.fullTranslationRu || "")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.map((line, index) => ({
    id: `page-${padPageNumber(page.pageNumber)}-block-${String(index + 1).padStart(2, "0")}`,
    type: textBlockType(line, page.pageNumber, index, lines),
    order: index + 1,
    textRu: line,
    bounds: boundsWithinRegion(region, index, lines.length),
    typography: {
      role: index <= 2 ? "prominent" : "flow",
      fit: "flow-scale",
      maxLines: line.length > 180 ? 6 : 3
    },
    provenance: {
      translationManifestPath: MANUAL_MANIFEST_PATH,
      translationJsonPointer: `/pages/${page.pageNumber - 1}/translation/fullTranslationRu`,
      ...(page.translation.chunkProvenance?.chunkId ? { sourceChunkId: page.translation.chunkProvenance.chunkId } : {}),
      sourceEvidence: page.translation.status === "manual_visual_text" ? "manual_visual_label_translation" : "approved_primary_source_chunk"
    }
  }));
}

export function buildManualLayoutManifest(manifest = buildManualManifest(defaultRoot)) {
  const pages = manifest.pages.map((page) => {
    const kind = pageLayoutKind(page.pageNumber);
    const textLength = page.translation.fullTranslationRu.length;
    const lineCount = page.translation.fullTranslationRu.split(/\r?\n/u).filter((line) => line.trim()).length;
    const flowRegion = flowRegionForLayoutKind(kind, textLength);
    const blocks = splitLayoutBlocks(page, flowRegion);
    const normalizedTranslation = normalizeManualLayoutText(page.translation.fullTranslationRu);
    const normalizedBlocks = normalizeManualLayoutText(blocks.map((block) => block.textRu).join("\n"));

    return {
      pageNumber: page.pageNumber,
      sourcePageNumber: page.sourcePageNumber,
      layoutKind: kind,
      canvas: {
        width: page.visualAsset.width,
        height: page.visualAsset.height,
        unit: "px",
        aspectRatio: Number((page.visualAsset.width / page.visualAsset.height).toFixed(8))
      },
      visualBase: {
        localPath: page.visualAsset.localPath,
        width: page.visualAsset.width,
        height: page.visualAsset.height,
        sha256: page.visualAsset.sha256,
        strategy: "page_faithful_pdf_render_under_russian_text_layer"
      },
      masks: [
        {
          id: `page-${padPageNumber(page.pageNumber)}-source-text-mask`,
          purpose: "replace_visible_source_text_with_russian_layout",
          bounds: flowRegion,
          fill: "#fffdf8",
          opacity: kind === "visual-heavy" ? 0.94 : 0.985
        }
      ],
      textRegions: [
        {
          id: `page-${padPageNumber(page.pageNumber)}-russian-flow`,
          bounds: flowRegion,
          fit: "scale-and-scroll-if-needed",
          fontScale: fontScaleForText(kind, textLength, lineCount)
        }
      ],
      visualRegions: [
        {
          id: `page-${padPageNumber(page.pageNumber)}-visual-context`,
          type: kind === "visual-heavy" ? "signs-diagrams-icons" : "page-composition",
          bounds: { x: 0, y: 0, width: 1, height: 1 },
          preservedFrom: page.visualAsset.localPath
        }
      ],
      blocks,
      coverage: {
        translationSource: `${MANUAL_MANIFEST_PATH}#/pages/${page.pageNumber - 1}/translation/fullTranslationRu`,
        blockCount: blocks.length,
        normalizedTranslationSha256: sha256Text(normalizedTranslation),
        normalizedBlocksSha256: sha256Text(normalizedBlocks),
        reconstruction: "normalize_crlf_spaces_and_blank_lines_then_join_ordered_text_blocks"
      }
    };
  });

  const blockTypeCounts = new Map();
  for (const page of pages) {
    for (const block of page.blocks) blockTypeCounts.set(block.type, (blockTypeCounts.get(block.type) ?? 0) + 1);
  }

  return {
    schema: LAYOUT_SCHEMA,
    version: 1,
    manualId: manifest.id,
    locale: "ru",
    strategy: "html_css_russian_text_layer_over_local_page_visual",
    source: {
      manualManifestPath: MANUAL_MANIFEST_PATH,
      manualManifestVersion: manifest.version,
      translationFingerprint: manualTranslationFingerprint(manifest),
      visualAssetDirectory: MANUAL_ASSET_DIRECTORY,
      canvasWidth: 1191,
      canvasHeight: 1684
    },
    coverage: {
      requiredPages: EXPECTED_SOURCE.pageCount,
      pages: pages.length,
      blockTypes: Object.fromEntries([...blockTypeCounts.entries()].sort(([a], [b]) => a.localeCompare(b)))
    },
    pages
  };
}

function withChildRanges(entry) {
  const children = (entry.children ?? []).map((child, index, all) => ({
    ...child,
    level: "topic",
    endPage: (all.slice(index + 1).find((nextChild) => nextChild.startPage > child.startPage)?.startPage ?? entry.endPage + 1) - 1
  }));
  return { ...entry, children };
}

export function buildManualNavigationManifest(manifest = buildManualManifest(defaultRoot)) {
  const entries = MANUAL_TOP_LEVEL_NAVIGATION.map(withChildRanges);
  return {
    schema: NAVIGATION_SCHEMA,
    version: 1,
    manualId: manifest.id,
    locale: "ru",
    source: {
      manualManifestPath: MANUAL_MANIFEST_PATH,
      indexPdfPages: [12, 13],
      indexPrintedPages: [11, 12],
      indexTextSha256: manualSourceIndexFingerprint(manifest),
      printedToPdfPageMapping: "printed page n maps to PDF page n + 1 for indexed body sections"
    },
    pageCount: EXPECTED_SOURCE.pageCount,
    entries
  };
}

async function readPdfPageCount(root, relativePath) {
  const pdfParse = require("pdf-parse/lib/pdf-parse.js");
  const result = await pdfParse(readFileSync(path(root, relativePath)), { max: 1 });
  return result.numpages;
}

function validateRuntimeManualSurface(errors, root) {
  const scannedFiles = ["src/App.tsx", "src/data/manual4Ruedas.ts"];
  const forbiddenPatterns = [
    { pattern: /<\s*iframe\b/iu, label: "iframe PDF/browser viewer" },
    { pattern: /<\s*object\b/iu, label: "object PDF/browser viewer" },
    { pattern: /<\s*embed\b/iu, label: "embed PDF/browser viewer" },
    { pattern: /\bpdfjs\b|\bPDFViewer\b|\bgetDocument\s*\(/u, label: "runtime PDF rendering library" },
    { pattern: /\bfetch\s*\(/u, label: "runtime fetch" },
    { pattern: /https?:\/\/static\.buenosaires\.gob\.ar|https?:\/\/buenosaires\.gob\.ar/iu, label: "remote manual URL in runtime code" }
  ];

  for (const relativePath of scannedFiles) {
    if (!existsSync(path(root, relativePath))) {
      errors.push(`${relativePath}: runtime source file is missing.`);
      continue;
    }
    const text = readFileSync(path(root, relativePath), "utf8");
    for (const { pattern, label } of forbiddenPatterns) {
      if (pattern.test(text)) errors.push(`${relativePath}: manual surface must not use ${label}.`);
    }
  }

  const appSourcePath = "src/App.tsx";
  const appSource = existsSync(path(root, appSourcePath)) ? readFileSync(path(root, appSourcePath), "utf8") : "";
  const topLevelRuntimeManualImport = /^import\s+(?!type\b)[^;]+from\s+["']\.\/data\/manual4Ruedas["'];/mu;
  if (topLevelRuntimeManualImport.test(appSource)) {
    errors.push(`${appSourcePath}: manual corpus must be loaded through the manual view lazy boundary, not a top-level runtime import.`);
  }
  if (!/import\(["']\.\/data\/manual4Ruedas["']\)/u.test(appSource)) {
    errors.push(`${appSourcePath}: manual surface must dynamically import the local manual corpus when the view opens.`);
  }
  if (/manual-page-grid|manual-visual|manual-translation/u.test(appSource)) {
    errors.push(`${appSourcePath}: manual primary UI must not reintroduce the side-by-side visual plus translation card selectors.`);
  }
}

function validateManifestShape(errors, manifest) {
  if (!isPlainObject(manifest)) {
    errors.push("Manual manifest must be an object.");
    return;
  }
  if (manifest.schema !== "cabadrive-manual-ru.v1") errors.push("Manual manifest schema must be cabadrive-manual-ru.v1.");
  if (manifest.id !== `${MANUAL_DOCUMENT_ID}-ru-complete`) errors.push("Manual manifest id is unexpected.");
  if (manifest.locale !== "ru") errors.push("Manual manifest locale must be ru.");
  if (manifest.contentStatus !== "unofficial_exact_translation") {
    errors.push("Manual manifest contentStatus must be unofficial_exact_translation.");
  }
  if (manifest.source?.officialDocumentId !== MANUAL_DOCUMENT_ID) {
    errors.push("Manual manifest source.officialDocumentId is unexpected.");
  }
  if (manifest.source?.rawOriginalPath !== EXPECTED_SOURCE.rawOriginalPath) {
    errors.push("Manual manifest source.rawOriginalPath is unexpected.");
  }
  if (manifest.source?.rawOriginalSha256 !== EXPECTED_SOURCE.rawOriginalSha256) {
    errors.push("Manual manifest source.rawOriginalSha256 is unexpected.");
  }
  if (manifest.source?.pageCount !== EXPECTED_SOURCE.pageCount) {
    errors.push(`Manual manifest source.pageCount must be ${EXPECTED_SOURCE.pageCount}.`);
  }
  if (manifest.visualAssetSet?.strategy !== "page_faithful_pdf_render") {
    errors.push("Manual visualAssetSet.strategy must be page_faithful_pdf_render.");
  }
  if (manifest.visualAssetSet?.generatedFromPdfSha256 !== EXPECTED_SOURCE.rawOriginalSha256) {
    errors.push("Manual visual asset generation source hash does not match canonical PDF.");
  }
  if (!Array.isArray(manifest.pages)) errors.push("Manual manifest pages must be an array.");
}

function validateBounds(errors, label, bounds) {
  if (!isPlainObject(bounds)) {
    errors.push(`${label}: bounds must be an object.`);
    return;
  }
  for (const key of ["x", "y", "width", "height"]) {
    if (typeof bounds[key] !== "number" || !Number.isFinite(bounds[key])) errors.push(`${label}: bounds.${key} must be a finite number.`);
  }
  if (bounds.x < 0 || bounds.y < 0 || bounds.width <= 0 || bounds.height <= 0) errors.push(`${label}: bounds must use positive page-relative coordinates.`);
  if (bounds.x + bounds.width > 1.001 || bounds.y + bounds.height > 1.001) errors.push(`${label}: bounds must stay inside the page canvas.`);
}

function validateManualLayoutManifest(errors, manifest, layout) {
  if (!isPlainObject(layout)) {
    errors.push(`${MANUAL_LAYOUT_PATH}: layout manifest must be an object.`);
    return;
  }
  if (layout.schema !== LAYOUT_SCHEMA) errors.push(`${MANUAL_LAYOUT_PATH}: schema must be ${LAYOUT_SCHEMA}.`);
  if (layout.manualId !== manifest?.id) errors.push(`${MANUAL_LAYOUT_PATH}: manualId must match manual.ru.json id.`);
  if (layout.locale !== "ru") errors.push(`${MANUAL_LAYOUT_PATH}: locale must be ru.`);
  if (layout.source?.manualManifestPath !== MANUAL_MANIFEST_PATH) errors.push(`${MANUAL_LAYOUT_PATH}: source.manualManifestPath is unexpected.`);
  if (layout.source?.translationFingerprint !== manualTranslationFingerprint(manifest ?? { pages: [] })) {
    errors.push(`${MANUAL_LAYOUT_PATH}: translation fingerprint is stale.`);
  }
  if (!Array.isArray(layout.pages)) {
    errors.push(`${MANUAL_LAYOUT_PATH}: pages must be an array.`);
    return;
  }
  if (layout.pages.length !== EXPECTED_SOURCE.pageCount) {
    errors.push(`${MANUAL_LAYOUT_PATH}: expected ${EXPECTED_SOURCE.pageCount} page layout records, found ${layout.pages.length}.`);
  }

  const allowedBlockTypes = new Set(["heading", "body", "list", "tableCell", "caption", "callout", "footnote", "pageNumber", "label"]);
  const seenTypes = new Set();
  for (let index = 0; index < EXPECTED_SOURCE.pageCount; index += 1) {
    const expectedPageNumber = index + 1;
    const page = manifest?.pages?.[index];
    const layoutPage = layout.pages[index];
    if (!isPlainObject(layoutPage)) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} layout entry must be an object.`);
      continue;
    }
    if (layoutPage.pageNumber !== expectedPageNumber) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} pageNumber is out of order.`);
    if (layoutPage.sourcePageNumber !== expectedPageNumber) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} sourcePageNumber must match source page.`);
    if (layoutPage.canvas?.width !== page?.visualAsset?.width || layoutPage.canvas?.height !== page?.visualAsset?.height) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} canvas must match local visual asset dimensions.`);
    }
    if (layoutPage.visualBase?.localPath !== page?.visualAsset?.localPath) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} visualBase.localPath must match manual visual asset.`);
    }
    if (layoutPage.visualBase?.sha256 !== page?.visualAsset?.sha256) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} visualBase.sha256 must match manual visual asset.`);
    }
    if (!Array.isArray(layoutPage.masks) || layoutPage.masks.length < 1) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} must include at least one source-text replacement mask.`);
    } else {
      layoutPage.masks.forEach((mask, maskIndex) => validateBounds(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} mask ${maskIndex + 1}`, mask?.bounds));
    }
    if (!Array.isArray(layoutPage.visualRegions) || layoutPage.visualRegions.length < 1) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} must include at least one visual preservation region.`);
    } else {
      layoutPage.visualRegions.forEach((region, regionIndex) => validateBounds(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} visual region ${regionIndex + 1}`, region?.bounds));
    }
    if (!Array.isArray(layoutPage.textRegions) || layoutPage.textRegions.length < 1) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} must include at least one Russian text region.`);
    } else {
      layoutPage.textRegions.forEach((region, regionIndex) => validateBounds(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} text region ${regionIndex + 1}`, region?.bounds));
    }
    if (!Array.isArray(layoutPage.blocks) || layoutPage.blocks.length < 1) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} must include ordered Russian layout blocks.`);
      continue;
    }

    const blockIds = new Set();
    const orderedText = [];
    layoutPage.blocks.forEach((block, blockIndex) => {
      if (!isPlainObject(block)) {
        errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} must be an object.`);
        return;
      }
      if (!isNonEmptyString(block.id)) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} id is missing.`);
      if (blockIds.has(block.id)) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block id ${block.id} is duplicated.`);
      blockIds.add(block.id);
      if (block.order !== blockIndex + 1) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} order is out of sequence.`);
      if (!allowedBlockTypes.has(block.type)) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} has unsupported type ${block.type}.`);
      seenTypes.add(block.type);
      if (!isNonEmptyString(block.textRu)) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} textRu is missing.`);
      if (PLACEHOLDER_PATTERN.test(block.textRu || "")) errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} textRu must not contain placeholder text.`);
      validateBounds(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1}`, block.bounds);
      orderedText.push(block.textRu);
    });

    const normalizedTranslation = normalizeManualLayoutText(page?.translation?.fullTranslationRu);
    const normalizedBlocks = normalizeManualLayoutText(orderedText.join("\n"));
    const normalizedTranslationSha256 = sha256Text(normalizedTranslation);
    const normalizedBlocksSha256 = sha256Text(normalizedBlocks);
    if (normalizedTranslation !== normalizedBlocks) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} ordered Russian blocks do not reconstruct fullTranslationRu.`);
    }
    if (layoutPage.coverage?.normalizedTranslationSha256 !== normalizedTranslationSha256) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} normalizedTranslationSha256 is stale.`);
    }
    if (layoutPage.coverage?.normalizedBlocksSha256 !== normalizedBlocksSha256) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} normalizedBlocksSha256 is stale.`);
    }
    if (layoutPage.coverage?.blockCount !== layoutPage.blocks.length) {
      errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} coverage.blockCount is stale.`);
    }
  }

  for (const requiredType of allowedBlockTypes) {
    if (!seenTypes.has(requiredType)) errors.push(`${MANUAL_LAYOUT_PATH}: layout blocks must include type ${requiredType} where present in the manual corpus.`);
  }
  if (layout.coverage?.pages !== layout.pages.length) errors.push(`${MANUAL_LAYOUT_PATH}: coverage.pages is stale.`);
  if (layout.coverage?.requiredPages !== EXPECTED_SOURCE.pageCount) errors.push(`${MANUAL_LAYOUT_PATH}: coverage.requiredPages must be ${EXPECTED_SOURCE.pageCount}.`);
}

function flattenNavigationEntries(entries) {
  return entries.flatMap((entry) => [entry, ...flattenNavigationEntries(entry.children ?? [])]);
}

function validateManualNavigationManifest(errors, manifest, navigation) {
  if (!isPlainObject(navigation)) {
    errors.push(`${MANUAL_NAVIGATION_PATH}: navigation manifest must be an object.`);
    return;
  }
  if (navigation.schema !== NAVIGATION_SCHEMA) errors.push(`${MANUAL_NAVIGATION_PATH}: schema must be ${NAVIGATION_SCHEMA}.`);
  if (navigation.manualId !== manifest?.id) errors.push(`${MANUAL_NAVIGATION_PATH}: manualId must match manual.ru.json id.`);
  if (navigation.locale !== "ru") errors.push(`${MANUAL_NAVIGATION_PATH}: locale must be ru.`);
  if (navigation.pageCount !== EXPECTED_SOURCE.pageCount) errors.push(`${MANUAL_NAVIGATION_PATH}: pageCount must be ${EXPECTED_SOURCE.pageCount}.`);
  if (navigation.source?.manualManifestPath !== MANUAL_MANIFEST_PATH) errors.push(`${MANUAL_NAVIGATION_PATH}: source.manualManifestPath is unexpected.`);
  if (navigation.source?.indexTextSha256 !== manualSourceIndexFingerprint(manifest ?? { pages: [] })) {
    errors.push(`${MANUAL_NAVIGATION_PATH}: source index fingerprint is stale.`);
  }
  if (!Array.isArray(navigation.entries)) {
    errors.push(`${MANUAL_NAVIGATION_PATH}: entries must be an array.`);
    return;
  }

  const requiredTopLevel = new Map(
    MANUAL_TOP_LEVEL_NAVIGATION.map((entry) => [
      entry.id,
      { titleRu: entry.titleRu, startPage: entry.startPage, endPage: entry.endPage, requiredPrintedPage: entry.requiredPrintedPage }
    ])
  );
  if (navigation.entries.length !== MANUAL_TOP_LEVEL_NAVIGATION.length) {
    errors.push(`${MANUAL_NAVIGATION_PATH}: top-level navigation entry count is stale.`);
  }
  let expectedStartPage = 1;
  for (const entry of navigation.entries) {
    if (!isPlainObject(entry)) {
      errors.push(`${MANUAL_NAVIGATION_PATH}: top-level entry must be an object.`);
      continue;
    }
    const required = requiredTopLevel.get(entry.id);
    if (!required) errors.push(`${MANUAL_NAVIGATION_PATH}: unexpected top-level entry ${entry.id}.`);
    if (required && entry.titleRu !== required.titleRu) errors.push(`${MANUAL_NAVIGATION_PATH}: ${entry.id} titleRu is stale.`);
    if (required && entry.startPage !== required.startPage) errors.push(`${MANUAL_NAVIGATION_PATH}: ${entry.id} startPage must be ${required.startPage}.`);
    if (required && entry.endPage !== required.endPage) errors.push(`${MANUAL_NAVIGATION_PATH}: ${entry.id} endPage must be ${required.endPage}.`);
    if (entry.startPage !== expectedStartPage) errors.push(`${MANUAL_NAVIGATION_PATH}: ${entry.id} leaves a page coverage gap before page ${entry.startPage}.`);
    expectedStartPage = entry.endPage + 1;
    if (entry.requiredPrintedPage && entry.startPage !== entry.requiredPrintedPage + 1) {
      errors.push(`${MANUAL_NAVIGATION_PATH}: ${entry.id} printed-to-PDF page mapping is stale.`);
    }
    if (!["frontMatter", "chapter", "appendix"].includes(entry.level)) {
      errors.push(`${MANUAL_NAVIGATION_PATH}: ${entry.id} has unsupported top-level level ${entry.level}.`);
    }
    if (entry.sourceEvidence !== "index_pages_11_12" && entry.sourceEvidence !== "curated_manual_review") {
      errors.push(`${MANUAL_NAVIGATION_PATH}: ${entry.id} sourceEvidence is not source-derived.`);
    }
    let previousChildStart = entry.startPage;
    for (const child of entry.children ?? []) {
      if (child.level !== "topic") errors.push(`${MANUAL_NAVIGATION_PATH}: child ${child.id} level must be topic.`);
      if (child.startPage < entry.startPage || child.endPage > entry.endPage || child.startPage > child.endPage) {
        errors.push(`${MANUAL_NAVIGATION_PATH}: child ${child.id} range must stay inside parent ${entry.id}.`);
      }
      if (child.startPage < previousChildStart) errors.push(`${MANUAL_NAVIGATION_PATH}: child ${child.id} is out of order.`);
      previousChildStart = child.startPage;
      if (!isNonEmptyString(child.titleRu)) errors.push(`${MANUAL_NAVIGATION_PATH}: child ${child.id} titleRu is missing.`);
      if (child.sourceEvidence !== "index_pages_11_12" && child.sourceEvidence !== "page_heading" && child.sourceEvidence !== "curated_manual_review") {
        errors.push(`${MANUAL_NAVIGATION_PATH}: child ${child.id} sourceEvidence is not valid.`);
      }
    }
  }
  if (expectedStartPage !== EXPECTED_SOURCE.pageCount + 1) {
    errors.push(`${MANUAL_NAVIGATION_PATH}: top-level entries must cover through page ${EXPECTED_SOURCE.pageCount}.`);
  }

  const flattenedIds = new Set(flattenNavigationEntries(navigation.entries).map((entry) => entry.id));
  for (const requiredId of [
    "intro-road-pandemic",
    "ch1-pedestrian-priority",
    "ch2-required-documents",
    "ch3-speed",
    "ch4-sleep-fatigue",
    "ch5-anticipatory-efficient-driving",
    "app1-safety-elements",
    "app2-safe-driving",
    "app4-signs-regulatory"
  ]) {
    if (!flattenedIds.has(requiredId)) errors.push(`${MANUAL_NAVIGATION_PATH}: required source-index topic ${requiredId} is missing.`);
  }
}

export async function validateManualVehiculo4RuedasRu({ root = defaultRoot, manifest, layout, navigation } = {}) {
  const errors = [];
  const loadedManifest = manifest ?? (existsSync(path(root, MANUAL_MANIFEST_PATH)) ? readJson(root, MANUAL_MANIFEST_PATH) : undefined);
  const loadedLayout = layout ?? (existsSync(path(root, MANUAL_LAYOUT_PATH)) ? readJson(root, MANUAL_LAYOUT_PATH) : undefined);
  const loadedNavigation = navigation ?? (existsSync(path(root, MANUAL_NAVIGATION_PATH)) ? readJson(root, MANUAL_NAVIGATION_PATH) : undefined);
  const corpus = loadManualChunkCorpus(root);
  errors.push(...corpus.errors);
  validateManifestShape(errors, loadedManifest);
  validateManualLayoutManifest(errors, loadedManifest, loadedLayout);
  validateManualNavigationManifest(errors, loadedManifest, loadedNavigation);

  const rawPdfExists = existsSync(path(root, EXPECTED_SOURCE.rawOriginalPath));
  if (!rawPdfExists) {
    errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: canonical PDF is missing.`);
  } else {
    const rawPdfSha256 = sha256File(root, EXPECTED_SOURCE.rawOriginalPath);
    if (rawPdfSha256 !== EXPECTED_SOURCE.rawOriginalSha256) {
      errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: canonical PDF hash mismatch.`);
    }
    try {
      const pageCount = await readPdfPageCount(root, EXPECTED_SOURCE.rawOriginalPath);
      if (pageCount !== EXPECTED_SOURCE.pageCount) {
        errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: expected ${EXPECTED_SOURCE.pageCount} pages, found ${pageCount}.`);
      }
    } catch (error) {
      errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: could not read PDF page count: ${error.message}`);
    }
  }

  const pages = Array.isArray(loadedManifest?.pages) ? loadedManifest.pages : [];
  if (pages.length !== EXPECTED_SOURCE.pageCount) {
    errors.push(`Manual manifest must contain ${EXPECTED_SOURCE.pageCount} page entries, found ${pages.length}.`);
  }

  const chunksByOrder = new Map(corpus.chunks.map((chunk) => [chunk.order, chunk]));
  const qaByChunkId = new Map(corpus.qaRecords.map((record) => [record.chunkId, record]));
  let reusedApprovedChunkPages = 0;
  let manualVisualTextPages = 0;
  let localVisualAssets = 0;

  for (let index = 0; index < EXPECTED_SOURCE.pageCount; index += 1) {
    const expectedPageNumber = index + 1;
    const page = pages[index];
    if (!isPlainObject(page)) {
      errors.push(`Manual page ${expectedPageNumber}: entry must be an object.`);
      continue;
    }
    if (page.pageNumber !== expectedPageNumber) errors.push(`Manual page ${expectedPageNumber}: pageNumber is out of order.`);
    if (page.sourcePageNumber !== expectedPageNumber) errors.push(`Manual page ${expectedPageNumber}: sourcePageNumber must match source page.`);
    if (page.sourceTrace?.officialDocumentId !== MANUAL_DOCUMENT_ID) {
      errors.push(`Manual page ${expectedPageNumber}: sourceTrace.officialDocumentId is unexpected.`);
    }

    const asset = page.visualAsset;
    const expectedAssetPath = assetPathForPage(expectedPageNumber);
    if (!isPlainObject(asset)) {
      errors.push(`Manual page ${expectedPageNumber}: visualAsset must be an object.`);
    } else {
      const normalizedPath = normalizePath(asset.localPath);
      if (normalizedPath !== expectedAssetPath) errors.push(`Manual page ${expectedPageNumber}: visualAsset.localPath must be ${expectedAssetPath}.`);
      if (/^https?:\/\//iu.test(normalizedPath)) errors.push(`Manual page ${expectedPageNumber}: visualAsset.localPath must be local.`);
      if (/\.pdf(?:$|[?#])/iu.test(normalizedPath)) errors.push(`Manual page ${expectedPageNumber}: visualAsset.localPath must not be a PDF.`);
      if (asset.format !== "jpeg") errors.push(`Manual page ${expectedPageNumber}: visualAsset.format must be jpeg.`);
      if (!existsSync(path(root, expectedAssetPath))) {
        errors.push(`${expectedAssetPath}: visual asset missing.`);
      } else {
        localVisualAssets += 1;
        const buffer = readFileSync(path(root, expectedAssetPath));
        const dimensions = jpegDimensions(buffer);
        const actualSha256 = sha256Buffer(buffer);
        if (!dimensions) {
          errors.push(`${expectedAssetPath}: could not read JPEG dimensions.`);
        } else {
          if (asset.width !== dimensions.width) errors.push(`${expectedAssetPath}: width mismatch.`);
          if (asset.height !== dimensions.height) errors.push(`${expectedAssetPath}: height mismatch.`);
          if (asset.width < 1000 || asset.height < 1400) {
            errors.push(`${expectedAssetPath}: rendered dimensions are too small for page-faithful study.`);
          }
        }
        if (asset.sha256 !== actualSha256) errors.push(`${expectedAssetPath}: sha256 mismatch.`);
        if (!SHA256_PATTERN.test(asset.sha256 || "")) errors.push(`${expectedAssetPath}: sha256 must be a lowercase SHA-256 hash.`);
      }
    }

    const translation = page.translation;
    if (!isPlainObject(translation)) {
      errors.push(`Manual page ${expectedPageNumber}: translation must be an object.`);
      continue;
    }
    if (!translation.exactCoverage) errors.push(`Manual page ${expectedPageNumber}: translation.exactCoverage must be true.`);
    if (!isNonEmptyString(translation.fullTranslationRu)) errors.push(`Manual page ${expectedPageNumber}: fullTranslationRu is missing.`);
    if (!isNonEmptyString(translation.sourceTextEs)) errors.push(`Manual page ${expectedPageNumber}: sourceTextEs is missing.`);
    if (PLACEHOLDER_PATTERN.test(translation.fullTranslationRu || "")) {
      errors.push(`Manual page ${expectedPageNumber}: fullTranslationRu must not contain placeholder text.`);
    }

    if (translation.status === "reused_primary_source_chunk") {
      reusedApprovedChunkPages += 1;
      const chunk = chunksByOrder.get(expectedPageNumber);
      const provenance = translation.chunkProvenance;
      const qaRecord = provenance?.chunkId ? qaByChunkId.get(provenance.chunkId) : undefined;
      if (!chunk) errors.push(`Manual page ${expectedPageNumber}: reused chunk with order ${expectedPageNumber} is missing.`);
      if (expectedPageNumber > 198) errors.push(`Manual page ${expectedPageNumber}: only pages 1-198 may reuse approved primary-source chunks.`);
      if (chunk && provenance?.chunkId !== chunk.chunkId) errors.push(`Manual page ${expectedPageNumber}: chunk provenance id mismatch.`);
      if (chunk && translation.fullTranslationRu !== chunk.fullTranslationRu) {
        errors.push(`Manual page ${expectedPageNumber}: reused fullTranslationRu must match the approved chunk exactly.`);
      }
      if (chunk && translation.sourceTextEs !== chunk.originalSpanish) {
        errors.push(`Manual page ${expectedPageNumber}: reused sourceTextEs must match the approved chunk exactly.`);
      }
      if (qaRecord?.translationQa?.status !== "approved") {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk translation QA must be approved.`);
      }
      if (qaRecord?.simplificationQa?.status !== "approved") {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk simplification QA must be approved.`);
      }
      if (!isNonEmptyString(provenance?.shardPath) || !MANUAL_CHUNK_SHARDS.includes(provenance.shardPath)) {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk shard provenance is missing or unexpected.`);
      }
      if (!isNonEmptyString(provenance?.qaShardPath) || !MANUAL_QA_SHARDS.includes(provenance.qaShardPath)) {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk QA shard provenance is missing or unexpected.`);
      }
    } else if (translation.status === "manual_visual_text") {
      manualVisualTextPages += 1;
      if (!SUPPLEMENTAL_VISUAL_TEXT.has(expectedPageNumber)) {
        errors.push(`Manual page ${expectedPageNumber}: manual visual-text translation is only allowed for final visual-only pages.`);
      }
      if (translation.sourceTextCoverage !== "visual_label_text") {
        errors.push(`Manual page ${expectedPageNumber}: manual visual-text pages must use sourceTextCoverage visual_label_text.`);
      }
      if (translation.visualTextTranslationProvenance?.featureId !== "027-manual-vehiculo-4ruedas-ru") {
        errors.push(`Manual page ${expectedPageNumber}: manual visual-text provenance must reference feature 027.`);
      }
    } else {
      errors.push(`Manual page ${expectedPageNumber}: unsupported translation status ${translation.status}.`);
    }
  }

  if (reusedApprovedChunkPages !== 198) errors.push(`Manual translation reuse must cover 198 approved chunk pages, found ${reusedApprovedChunkPages}.`);
  if (manualVisualTextPages !== 2) errors.push(`Manual visual-label translations must cover 2 final pages, found ${manualVisualTextPages}.`);
  if (loadedManifest?.translationCoverage?.omittedPages !== 0) errors.push("Manual translationCoverage.omittedPages must be 0.");
  if (loadedManifest?.translationCoverage?.requiredPages !== EXPECTED_SOURCE.pageCount) {
    errors.push(`Manual translationCoverage.requiredPages must be ${EXPECTED_SOURCE.pageCount}.`);
  }
  if (loadedManifest?.translationCoverage?.reusedApprovedChunkPages !== reusedApprovedChunkPages) {
    errors.push("Manual translationCoverage.reusedApprovedChunkPages is stale.");
  }
  if (loadedManifest?.translationCoverage?.manualVisualTextPages !== manualVisualTextPages) {
    errors.push("Manual translationCoverage.manualVisualTextPages is stale.");
  }

  validateRuntimeManualSurface(errors, root);

  return {
    errors,
    summary: {
      pages: pages.length,
      sourcePdfPages: EXPECTED_SOURCE.pageCount,
      layoutPages: Array.isArray(loadedLayout?.pages) ? loadedLayout.pages.length : 0,
      navigationEntries: Array.isArray(loadedNavigation?.entries) ? loadedNavigation.entries.length : 0,
      navigationTopics: Array.isArray(loadedNavigation?.entries) ? flattenNavigationEntries(loadedNavigation.entries).length - loadedNavigation.entries.length : 0,
      reusedApprovedChunkPages,
      manualVisualTextPages,
      localVisualAssets,
      assetDirectory: MANUAL_ASSET_DIRECTORY
    }
  };
}

export function formatManualValidationSummary(summary) {
  return `Manual 4 ruedas RU validated: ${summary.pages}/${summary.sourcePdfPages} pages, ${summary.layoutPages} layout pages, ${summary.navigationEntries} semantic sections, ${summary.navigationTopics} topics, ${summary.localVisualAssets} local page assets, ${summary.reusedApprovedChunkPages} approved reused translations, ${summary.manualVisualTextPages} visual-label translation pages.`;
}

async function main() {
  const writeManifest = process.argv.includes("--write-manifest");
  const writeDerivedManifests = process.argv.includes("--write-derived-manifests");
  const writeLayout = writeDerivedManifests || process.argv.includes("--write-layout");
  const writeNavigation = writeDerivedManifests || process.argv.includes("--write-navigation");
  const generatedManifest = buildManualManifest(defaultRoot);
  if (writeManifest) {
    const targetPath = path(defaultRoot, MANUAL_MANIFEST_PATH);
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, `${JSON.stringify(generatedManifest, null, 2)}\n`);
    console.log(`Wrote ${MANUAL_MANIFEST_PATH}`);
  }
  if (writeLayout) {
    const layout = buildManualLayoutManifest(generatedManifest);
    const targetPath = path(defaultRoot, MANUAL_LAYOUT_PATH);
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, `${JSON.stringify(layout, null, 2)}\n`);
    console.log(`Wrote ${MANUAL_LAYOUT_PATH}`);
  }
  if (writeNavigation) {
    const navigation = buildManualNavigationManifest(generatedManifest);
    const targetPath = path(defaultRoot, MANUAL_NAVIGATION_PATH);
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, `${JSON.stringify(navigation, null, 2)}\n`);
    console.log(`Wrote ${MANUAL_NAVIGATION_PATH}`);
  }

  const validation = await validateManualVehiculo4RuedasRu({ root: defaultRoot });
  if (validation.errors.length) {
    console.error("Manual 4 ruedas RU validation failed:");
    for (const error of validation.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(formatManualValidationSummary(validation.summary));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
