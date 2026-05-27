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
      { id: "ch4-sleep-fatigue", titleRu: "Сон и усталость", titleEs: "Sueno y fatiga", startPage: 93, endPage: 94, sourceEvidence: "index_pages_11_12" },
      { id: "ch4-stress", titleRu: "Стресс", titleEs: "Estres", startPage: 94, endPage: 94, sourceEvidence: "page_heading" },
      { id: "ch4-distractions", titleRu: "Отвлечения", titleEs: "Distracciones", startPage: 95, sourceEvidence: "page_heading" }
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

const MANUAL_TOPIC_START_TEXT_EVIDENCE = new Map([
  ["ch4-stress", { startPage: 94, requiredText: ["Стресс", "ВОЗ определяет"] }],
  ["ch4-distractions", { startPage: 95, requiredText: ["Отвлечения", "Под отвлечением понимается"] }]
]);

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

function clampLayoutUnit(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function roundLayoutUnit(value) {
  return Number(value.toFixed(4));
}

function layoutBounds(x, y, width, height) {
  const safeX = clampLayoutUnit(x);
  const safeY = clampLayoutUnit(y);
  const safeWidth = clampLayoutUnit(width, 0.002, 1 - safeX);
  const safeHeight = clampLayoutUnit(height, 0.002, 1 - safeY);
  return {
    x: roundLayoutUnit(safeX),
    y: roundLayoutUnit(safeY),
    width: roundLayoutUnit(safeWidth),
    height: roundLayoutUnit(safeHeight)
  };
}

function expandLayoutBounds(bounds, padX = 0.004, padY = 0.003) {
  const x = clampLayoutUnit(bounds.x - padX);
  const y = clampLayoutUnit(bounds.y - padY);
  const right = clampLayoutUnit(bounds.x + bounds.width + padX);
  const bottom = clampLayoutUnit(bounds.y + bounds.height + padY);
  return layoutBounds(x, y, right - x, bottom - y);
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
  if (index > 0 && trimmed.length <= 82 && !/[.!?]$/u.test(trimmed) && /^[\p{Lu}\d]/u.test(trimmed)) return "heading";
  if (lines.length <= 4 && index > 0) return "callout";
  return "body";
}

function manualBlockDisplayText(block) {
  return block.type === "heading" ? block.textRu.replace(/^#+\s*/u, "") : block.textRu;
}

function blockLayoutWeight(block) {
  const text = manualBlockDisplayText(block);
  const length = text.length;
  const charsPerLineByType = {
    pageNumber: 18,
    heading: 44,
    body: 78,
    list: 72,
    tableCell: 62,
    caption: 70,
    callout: 60,
    footnote: 84,
    label: 42
  };
  const baseByType = {
    pageNumber: 0.55,
    heading: 1.15,
    body: 1,
    list: 1.05,
    tableCell: 0.85,
    caption: 0.9,
    callout: 1.05,
    footnote: 0.7,
    label: 0.82
  };
  const estimatedLines = Math.max(1, Math.ceil(length / (charsPerLineByType[block.type] ?? 72)));
  return (baseByType[block.type] ?? 1) + estimatedLines * (block.type === "heading" ? 0.95 : 0.74);
}

function blockMinHeight(block) {
  if (block.type === "pageNumber") return 0.018;
  if (block.type === "footnote") return 0.021;
  if (block.type === "tableCell" || block.type === "caption" || block.type === "label") return 0.026;
  if (block.type === "heading" || block.type === "callout") return 0.034;
  return 0.031;
}

function allocateWeightedHeights(blocks, frameHeight, gap) {
  if (blocks.length === 0) return [];
  const available = Math.max(0.018, frameHeight - gap * Math.max(0, blocks.length - 1));
  const minimums = blocks.map(blockMinHeight);
  const minimumTotal = minimums.reduce((sum, value) => sum + value, 0);
  if (minimumTotal >= available) {
    return minimums.map((value) => roundLayoutUnit((value / minimumTotal) * available));
  }
  const weights = blocks.map(blockLayoutWeight);
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  return blocks.map((block, index) => roundLayoutUnit(minimums[index] + ((available - minimumTotal) * weights[index]) / weightTotal));
}

function blockFrameAdjustments(block, frame) {
  if (block.type === "list") return { x: frame.x + 0.014, width: frame.width - 0.014 };
  if (block.type === "footnote") return { x: frame.x + 0.01, width: frame.width - 0.01 };
  if (block.type === "tableCell") return { x: frame.x + 0.006, width: frame.width - 0.006 };
  if (block.type === "heading" && frame.width > 0.34) return { x: frame.x, width: frame.width * 0.94 };
  return { x: frame.x, width: frame.width };
}

function positionBlockStack(blocks, frame, gap = 0.007) {
  const heights = allocateWeightedHeights(blocks, frame.height, gap);
  const positioned = [];
  let y = frame.y;
  blocks.forEach((block, index) => {
    const adjusted = blockFrameAdjustments(block, frame);
    positioned.push({ ...block, bounds: layoutBounds(adjusted.x, y, adjusted.width, heights[index]) });
    y += heights[index] + gap;
  });
  return positioned;
}

function splitBlocksIntoColumns(blocks, columnCount) {
  if (columnCount <= 1 || blocks.length <= 3) return [blocks];
  const totalWeight = blocks.reduce((sum, block) => sum + blockLayoutWeight(block), 0);
  const target = totalWeight / columnCount;
  const columns = [];
  let current = [];
  let currentWeight = 0;
  for (const block of blocks) {
    const blockWeight = blockLayoutWeight(block);
    if (columns.length < columnCount - 1 && current.length > 0 && currentWeight + blockWeight > target * (columns.length + 1)) {
      columns.push(current);
      current = [];
    }
    current.push(block);
    currentWeight += blockWeight;
  }
  columns.push(current);
  while (columns.length < columnCount) columns.push([]);
  return columns;
}

function shouldUseTwoColumns(kind, page, bodyBlocks) {
  if (kind === "index") return true;
  if (kind !== "text") return false;
  const textLength = page.translation.fullTranslationRu.length;
  return bodyBlocks.length >= 12 || textLength >= 1300;
}

function blockFontScale(block, bounds) {
  const base = {
    pageNumber: 0.68,
    heading: 1.12,
    body: 0.82,
    list: 0.78,
    tableCell: 0.72,
    caption: 0.75,
    callout: 0.9,
    footnote: 0.58,
    label: 0.92
  }[block.type] ?? 0.78;
  const density = manualBlockDisplayText(block).length / Math.max(bounds.width * bounds.height * 10000, 1);
  const densityScale = density > 28 ? 0.68 : density > 20 ? 0.76 : density > 14 ? 0.84 : 1;
  return Number((base * densityScale).toFixed(3));
}

function blockLineHeight(block) {
  if (block.type === "heading" || block.type === "label") return 1.12;
  if (block.type === "footnote" || block.type === "tableCell") return 1.18;
  return 1.22;
}

function finalizeLayoutBlocks(blocks, page) {
  return blocks.map((block) => ({
    ...block,
    typography: {
      role: block.type === "heading" || block.type === "callout" || block.type === "label" ? "prominent" : "flow",
      fit: "absolute-fit",
      fontScale: blockFontScale(block, block.bounds),
      lineHeight: blockLineHeight(block),
      maxLines: Math.max(1, Math.ceil(blockLayoutWeight(block)))
    },
    provenance: {
      translationManifestPath: MANUAL_MANIFEST_PATH,
      translationJsonPointer: `/pages/${page.pageNumber - 1}/translation/fullTranslationRu`,
      ...(page.translation.chunkProvenance?.chunkId ? { sourceChunkId: page.translation.chunkProvenance.chunkId } : {}),
      sourceEvidence: page.translation.status === "manual_visual_text" ? "manual_visual_label_translation" : "approved_primary_source_chunk"
    }
  }));
}

function buildLayoutBlockDrafts(page) {
  const lines = String(page.translation.fullTranslationRu || "")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.map((line, index) => ({
    id: `page-${padPageNumber(page.pageNumber)}-block-${String(index + 1).padStart(2, "0")}`,
    type: textBlockType(line, page.pageNumber, index, lines),
    order: index + 1,
    textRu: line
  }));
}

function buildSourceTextBlockDrafts(page) {
  const lines = String(page.translation.sourceTextEs || "")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.map((line, index) => ({
    id: `page-${padPageNumber(page.pageNumber)}-source-line-${String(index + 1).padStart(2, "0")}`,
    type: textBlockType(line, page.pageNumber, index, lines),
    order: index + 1,
    textRu: line,
    sourceLineNumber: index + 1
  }));
}

function pageNumberBounds() {
  return layoutBounds(0.135, 0.073, 0.052, 0.023);
}

function leadingBlockCount(kind, blocks) {
  if (kind === "section-divider") return blocks.length <= 4 ? blocks.length : Math.min(3, blocks.length);
  if (kind === "visual-heavy") return Math.min(blocks.length, 2);
  if (kind === "index") return Math.min(blocks.length, blocks[0]?.type === "heading" ? 1 : 0);
  let count = 0;
  while (count < blocks.length && count < 2 && ["heading", "callout", "label"].includes(blocks[count].type)) count += 1;
  return count;
}

function pageTextFrames(kind, page, positionedBlocks) {
  const textBlocks = positionedBlocks.filter((block) => block.type !== "pageNumber");
  if (textBlocks.length === 0) return [];
  const clusters = [];
  for (const block of textBlocks) {
    let cluster = clusters.find((candidate) => Math.abs(candidate.x - block.bounds.x) < 0.08);
    if (!cluster) {
      cluster = { x: block.bounds.x, y: block.bounds.y, right: block.bounds.x + block.bounds.width, bottom: block.bounds.y + block.bounds.height, blocks: [] };
      clusters.push(cluster);
    }
    cluster.x = Math.min(cluster.x, block.bounds.x);
    cluster.y = Math.min(cluster.y, block.bounds.y);
    cluster.right = Math.max(cluster.right, block.bounds.x + block.bounds.width);
    cluster.bottom = Math.max(cluster.bottom, block.bounds.y + block.bounds.height);
    cluster.blocks.push(block);
  }
  return clusters
    .sort((a, b) => a.x - b.x || a.y - b.y)
    .map((cluster, index) => ({
      id: `page-${padPageNumber(page.pageNumber)}-${kind}-text-zone-${index + 1}`,
      bounds: expandLayoutBounds(layoutBounds(cluster.x, cluster.y, cluster.right - cluster.x, cluster.bottom - cluster.y), 0.006, 0.006),
      fit: "absolute-positioned-blocks",
      fontScale: Number(
        (
          cluster.blocks.reduce((sum, block) => sum + block.typography.fontScale, 0) /
          Math.max(cluster.blocks.length, 1)
        ).toFixed(3)
      )
    }));
}

function visualRegionsForPage(kind, page, positionedBlocks, usesTwoColumns) {
  const pageId = `page-${padPageNumber(page.pageNumber)}`;
  const preservedFrom = page.visualAsset.localPath;
  if (kind === "visual-heavy") {
    const visualRegionBoundsByPage = new Map([
      [185, [layoutBounds(0.327, 0.335, 0.375, 0.39)]],
      [186, [layoutBounds(0.327, 0.315, 0.375, 0.19), layoutBounds(0.327, 0.565, 0.375, 0.09), layoutBounds(0.327, 0.735, 0.2, 0.07)]],
      [187, [layoutBounds(0.327, 0.335, 0.375, 0.4)]],
      [188, [layoutBounds(0.327, 0.335, 0.375, 0.11), layoutBounds(0.327, 0.51, 0.375, 0.08), layoutBounds(0.327, 0.64, 0.375, 0.08), layoutBounds(0.327, 0.765, 0.375, 0.07)]],
      [193, [layoutBounds(0.327, 0.335, 0.375, 0.31), layoutBounds(0.327, 0.71, 0.12, 0.07)]],
      [197, [layoutBounds(0.31, 0.335, 0.43, 0.18), layoutBounds(0.31, 0.575, 0.43, 0.31)]]
    ]);
    const regionBounds = visualRegionBoundsByPage.get(page.pageNumber) ?? [layoutBounds(0.327, 0.335, 0.375, 0.4)];
    return [
      ...regionBounds.map((bounds, index) => ({
        id: `${pageId}-sign-grid-${index + 1}`,
        type: "signs-diagrams-icons",
        bounds,
        preservedFrom
      })),
      { id: `${pageId}-footer-composition`, type: "page-footer-branding", bounds: layoutBounds(0.17, 0.92, 0.66, 0.035), preservedFrom }
    ];
  }
  if (kind === "section-divider") {
    return [
      { id: `${pageId}-section-art-band`, type: "section-divider-visual-band", bounds: layoutBounds(0.14, 0.13, 0.72, 0.14), preservedFrom },
      { id: `${pageId}-section-footer`, type: "page-footer-branding", bounds: layoutBounds(0.18, 0.86, 0.64, 0.06), preservedFrom }
    ];
  }
  if (kind === "index" || usesTwoColumns) {
    const firstColumnBlockY =
      positionedBlocks
        .filter((block) => block.type !== "pageNumber" && block.bounds.width <= 0.34)
        .map((block) => block.bounds.y)
        .sort((a, b) => a - b)[0] ?? 0.215;
    const gutterY = Math.max(0.19, firstColumnBlockY - 0.006);
    return [
      { id: `${pageId}-column-gutter`, type: "column-gutter-and-source-rules", bounds: layoutBounds(0.486, gutterY, 0.028, 0.87 - gutterY), preservedFrom },
      { id: `${pageId}-footer-composition`, type: "page-footer-branding", bounds: layoutBounds(0.17, 0.925, 0.66, 0.032), preservedFrom }
    ];
  }
  return [
    { id: `${pageId}-left-margin-context`, type: "margin-icons-or-page-chrome", bounds: layoutBounds(0.075, 0.18, 0.07, 0.64), preservedFrom },
    { id: `${pageId}-right-margin-context`, type: "margin-icons-or-page-chrome", bounds: layoutBounds(0.855, 0.18, 0.07, 0.64), preservedFrom },
    { id: `${pageId}-footer-composition`, type: "page-footer-branding", bounds: layoutBounds(0.18, 0.925, 0.64, 0.032), preservedFrom }
  ];
}

function sourceMask(page, slug, role, bounds, sourceTextEs, opacity = 0.995) {
  return {
    id: `page-${padPageNumber(page.pageNumber)}-source-${slug}`,
    purpose: "replace_visible_source_text_with_russian_layout",
    role,
    sourceGeometry: role === "sign-caption" ? "source_page_caption_region" : "source_page_text_region",
    bounds,
    fill: "#fffdf8",
    opacity,
    sourceTextEs,
    provenance: {
      method: "curated_source_page_geometry",
      sourcePageNumber: page.sourcePageNumber,
      visualAssetPath: page.visualAsset.localPath
    }
  };
}

function sourceMaskRoleForBlock(block) {
  if (block.type === "heading") return "source-heading";
  if (block.type === "list") return "source-list";
  if (block.type === "tableCell") return "source-table-cell";
  if (block.type === "caption") return "source-caption";
  if (block.type === "callout") return "source-callout";
  if (block.type === "footnote") return "source-footnote";
  if (block.type === "pageNumber") return "page-number";
  if (block.type === "label") return "source-label";
  return "source-body";
}

function sourceGeometryForBlock(block) {
  if (block.type === "caption") return "source_page_caption_region";
  if (block.type === "label") return "source_page_label_region";
  return "source_page_text_region";
}

function structuredSourceMaskFromBlock(page, block) {
  return {
    id: `page-${padPageNumber(page.pageNumber)}-source-line-mask-${String(block.sourceLineNumber ?? block.order).padStart(2, "0")}`,
    purpose: "replace_visible_source_text_with_russian_layout",
    role: sourceMaskRoleForBlock(block),
    sourceGeometry: sourceGeometryForBlock(block),
    bounds: expandLayoutBounds(block.bounds, block.type === "pageNumber" ? 0.002 : 0.004, block.type === "pageNumber" ? 0.0015 : 0.003),
    fill: "#fffdf8",
    opacity: block.type === "pageNumber" ? 0.985 : 0.99,
    sourceTextEs: block.textRu,
    provenance: {
      method: "structured_source_text_region",
      sourcePageNumber: page.sourcePageNumber,
      visualAssetPath: page.visualAsset.localPath,
      sourceTextPointer: `${MANUAL_MANIFEST_PATH}#/pages/${page.pageNumber - 1}/translation/sourceTextEs`,
      sourceLineStart: block.sourceLineNumber ?? block.order,
      sourceLineEnd: block.sourceLineNumber ?? block.order,
      sourceTextSha256: sha256Text(normalizeManualLayoutText(block.textRu)),
      ...(page.translation.chunkProvenance?.chunkId ? { sourceChunkId: page.translation.chunkProvenance.chunkId } : {})
    }
  };
}

function appendixIVCaptionStripMasks(page, yValues, options = {}) {
  const x = options.x ?? 0.327;
  const width = options.width ?? 0.37;
  const height = options.height ?? 0.027;
  return yValues.map((y, index) =>
    sourceMask(
      page,
      `sign-caption-strip-${index + 1}`,
      "sign-caption",
      layoutBounds(x, y, width, height),
      "Spanish sign captions visible in the source page image",
      1
    )
  );
}

function appendixIVSourceHeadingMasks(page, sourceLines, yValues, options = {}) {
  const x = options.x ?? 0.29;
  const width = options.width ?? 0.44;
  return yValues.map((y, index) =>
    sourceMask(
      page,
      `heading-${index + 1}`,
      "source-heading",
      layoutBounds(x, y, width, options.height ?? (index === 0 ? 0.033 : 0.028)),
      sourceLines[index] ?? "Spanish heading visible in the source page image",
      0.995
    )
  );
}

function appendixIVSourceTextMasksForPage(page) {
  const sourceLines = String(page.translation.sourceTextEs || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^\d+$/u.test(line));

  const pageNumberMask = sourceMask(
    page,
    "printed-page-number",
    "page-number",
    layoutBounds(0.263, 0.872, 0.035, 0.017),
    "Printed page number",
    0.995
  );

  const headingMasksByPage = new Map([
    [185, appendixIVSourceHeadingMasks(page, ["Reglamentarias", "De prohibición"], [0.279, 0.306])],
    [186, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.524, 0.694], { x: 0.292, width: 0.43 })],
    [187, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.306], { x: 0.292, width: 0.49 })],
    [188, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.476, 0.606, 0.734], { x: 0.292, width: 0.49 })],
    [189, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.306], { x: 0.292, width: 0.45 })],
    [190, appendixIVSourceHeadingMasks(page, sourceLines, [0.279], { x: 0.292, width: 0.5, height: 0.036 })],
    [191, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.54], { x: 0.292, width: 0.5 })],
    [193, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.306, 0.675], { x: 0.292, width: 0.5 })],
    [194, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.445, 0.64], { x: 0.292, width: 0.5 })],
    [195, appendixIVSourceHeadingMasks(page, sourceLines, [0.279, 0.306, 0.614], { x: 0.292, width: 0.5 })],
    [196, appendixIVSourceHeadingMasks(page, sourceLines, [0.279], { x: 0.292, width: 0.45, height: 0.036 })],
    [
      197,
      appendixIVSourceHeadingMasks(
        page,
        ["Señalamiento luminoso", "Significado de las luces", "Disposición de unidades ópticas", "Semáforos especiales"],
        [0.279, 0.306, 0.536, 0.615],
        { x: 0.292, width: 0.5 }
      )
    ]
  ]);

  const captionMasksByPage = new Map([
    [185, appendixIVCaptionStripMasks(page, [0.363, 0.418, 0.475, 0.532, 0.604, 0.682], { x: 0.327, width: 0.375, height: 0.03 })],
    [186, appendixIVCaptionStripMasks(page, [0.343, 0.402, 0.474, 0.53, 0.6, 0.77], { x: 0.327, width: 0.375, height: 0.034 })],
    [187, appendixIVCaptionStripMasks(page, [0.365, 0.428, 0.493, 0.558, 0.625, 0.706], { x: 0.327, width: 0.375, height: 0.032 })],
    [188, appendixIVCaptionStripMasks(page, [0.368, 0.43, 0.54, 0.668, 0.795], { x: 0.327, width: 0.375, height: 0.032 })],
    [189, appendixIVCaptionStripMasks(page, [0.365, 0.43, 0.495, 0.56, 0.625], { x: 0.327, width: 0.375, height: 0.032 })],
    [190, appendixIVCaptionStripMasks(page, [0.365, 0.43, 0.495, 0.56, 0.625, 0.69], { x: 0.327, width: 0.375, height: 0.032 })],
    [191, appendixIVCaptionStripMasks(page, [0.365, 0.43, 0.495, 0.62, 0.685], { x: 0.327, width: 0.375, height: 0.032 })],
    [193, appendixIVCaptionStripMasks(page, [0.365, 0.425, 0.486, 0.548, 0.608, 0.735], { x: 0.327, width: 0.375, height: 0.032 })],
    [194, appendixIVCaptionStripMasks(page, [0.365, 0.49, 0.558, 0.692, 0.755], { x: 0.327, width: 0.375, height: 0.032 })],
    [195, appendixIVCaptionStripMasks(page, [0.365, 0.43, 0.49, 0.675, 0.735], { x: 0.327, width: 0.375, height: 0.032 })],
    [196, appendixIVCaptionStripMasks(page, [0.365, 0.43, 0.495, 0.56, 0.625, 0.69], { x: 0.327, width: 0.375, height: 0.032 })],
    [197, appendixIVCaptionStripMasks(page, [0.347, 0.705, 0.842], { x: 0.35, width: 0.37, height: 0.058 })]
  ]);

  const paragraphMasksByPage = new Map([
    [
      192,
      [
        ...appendixIVSourceHeadingMasks(page, sourceLines, [0.268], { x: 0.29, width: 0.46, height: 0.035 }),
        sourceMask(page, "paragraph-body", "instructional-text", layoutBounds(0.285, 0.315, 0.46, 0.45), page.translation.sourceTextEs, 1)
      ]
    ],
    [
      198,
      [
        sourceMask(page, "closing-instructional-text", "instructional-text", layoutBounds(0.265, 0.285, 0.47, 0.17), page.translation.sourceTextEs, 1),
        sourceMask(page, "closing-source-number-198", "source-heading", layoutBounds(0.34, 0.53, 0.075, 0.055), "198", 1),
        sourceMask(page, "closing-source-number-199", "source-heading", layoutBounds(0.58, 0.53, 0.075, 0.055), "199", 1)
      ]
    ]
  ]);
  const extraMasksByPage = new Map([
    [
      197,
      [
        sourceMask(
          page,
          "traffic-light-explanatory-text",
          "instructional-text",
          layoutBounds(0.35, 0.333, 0.24, 0.095),
          "Spanish traffic-light explanatory text visible in the source page image",
          1
        ),
        sourceMask(
          page,
          "special-traffic-light-captions",
          "instructional-text",
          layoutBounds(0.38, 0.665, 0.32, 0.21),
          "Spanish special traffic-light captions visible in the source page image",
          1
        )
      ]
    ]
  ]);

  return [
    pageNumberMask,
    ...(paragraphMasksByPage.get(page.pageNumber) ?? headingMasksByPage.get(page.pageNumber) ?? appendixIVSourceHeadingMasks(page, sourceLines, [0.279])),
    ...(extraMasksByPage.get(page.pageNumber) ?? []),
    ...(captionMasksByPage.get(page.pageNumber) ?? [])
  ];
}

function sourceTextMasksForBlocks(page, blocks, kind) {
  if (kind === "visual-heavy") return appendixIVSourceTextMasksForPage(page);
  const sourceDrafts = buildSourceTextBlockDrafts(page);
  if (sourceDrafts.length === 0) return [];
  const sourcePage = {
    ...page,
    translation: {
      ...page.translation,
      fullTranslationRu: sourceDrafts.map((draft) => draft.textRu).join("\n")
    }
  };
  return positionManualLayoutBlocks(sourcePage, kind).map((block) => structuredSourceMaskFromBlock(page, block));
}

function positionManualLayoutBlocks(page, kind) {
  const drafts = buildLayoutBlockDrafts(page);
  const pageNumber = drafts[0]?.type === "pageNumber" ? drafts[0] : undefined;
  const contentDrafts = pageNumber ? drafts.slice(1) : drafts;
  const leadingCount = leadingBlockCount(kind, contentDrafts);
  const leadingDrafts = contentDrafts.slice(0, leadingCount);
  const bodyDrafts = contentDrafts.slice(leadingCount);
  const positioned = [];

  if (pageNumber) positioned.push({ ...pageNumber, bounds: pageNumberBounds() });

  if (kind === "section-divider") {
    const frame = layoutBounds(0.19, pageNumber ? 0.34 : 0.32, 0.62, pageNumber ? 0.24 : 0.27);
    positioned.push(...positionBlockStack(contentDrafts, frame, 0.011));
    return finalizeLayoutBlocks(positioned.sort((a, b) => a.order - b.order), page);
  }

  if (kind === "visual-heavy") {
    const framesByPage = new Map([
      [185, [layoutBounds(0.292, 0.31, 0.42, 0.024), layoutBounds(0.292, 0.279, 0.42, 0.026)]],
      [186, [layoutBounds(0.292, 0.279, 0.42, 0.033), layoutBounds(0.292, 0.524, 0.42, 0.033), layoutBounds(0.292, 0.694, 0.42, 0.033)]],
      [187, [layoutBounds(0.292, 0.279, 0.42, 0.026), layoutBounds(0.292, 0.31, 0.5, 0.024)]],
      [188, [layoutBounds(0.292, 0.279, 0.48, 0.033), layoutBounds(0.292, 0.476, 0.48, 0.03), layoutBounds(0.292, 0.606, 0.48, 0.03), layoutBounds(0.292, 0.734, 0.48, 0.03)]],
      [189, [layoutBounds(0.292, 0.279, 0.42, 0.026), layoutBounds(0.292, 0.31, 0.42, 0.024)]],
      [190, [layoutBounds(0.292, 0.279, 0.5, 0.036)]],
      [191, [layoutBounds(0.292, 0.279, 0.5, 0.033), layoutBounds(0.292, 0.54, 0.5, 0.033)]],
      [192, [layoutBounds(0.285, 0.315, 0.46, 0.45)]],
      [193, [layoutBounds(0.292, 0.279, 0.42, 0.026), layoutBounds(0.292, 0.31, 0.42, 0.024), layoutBounds(0.292, 0.675, 0.5, 0.033)]],
      [194, [layoutBounds(0.292, 0.279, 0.42, 0.033), layoutBounds(0.292, 0.445, 0.42, 0.033), layoutBounds(0.292, 0.64, 0.42, 0.033)]],
      [195, [layoutBounds(0.292, 0.31, 0.48, 0.024), layoutBounds(0.292, 0.279, 0.48, 0.026), layoutBounds(0.292, 0.614, 0.48, 0.03)]],
      [196, [layoutBounds(0.292, 0.279, 0.42, 0.033)]],
      [197, [layoutBounds(0.292, 0.31, 0.48, 0.024), layoutBounds(0.292, 0.279, 0.48, 0.026), layoutBounds(0.292, 0.536, 0.48, 0.033), layoutBounds(0.372, 0.615, 0.42, 0.033)]],
      [198, [layoutBounds(0.265, 0.285, 0.47, 0.17), layoutBounds(0.34, 0.53, 0.075, 0.055), layoutBounds(0.58, 0.53, 0.075, 0.055)]]
    ]);
    const frames = framesByPage.get(page.pageNumber);
    if (frames) {
      const visualDrafts = [...leadingDrafts, ...bodyDrafts];
      if (frames.length === 1 && visualDrafts.length > 1) {
        positioned.push(...positionBlockStack(visualDrafts, frames[0], 0.006));
      } else {
        visualDrafts.forEach((draft, index) => {
          const frame = frames[index] ?? frames.at(-1);
          positioned.push(...positionBlockStack([draft], frame, 0));
        });
      }
    } else {
      const leadFrame = layoutBounds(0.292, 0.279, 0.5, 0.09);
      positioned.push(...positionBlockStack(leadingDrafts, leadFrame, 0.007));
      const bodyFrame = page.translation.fullTranslationRu.length > 500 ? layoutBounds(0.19, 0.665, 0.62, 0.2) : layoutBounds(0.24, 0.69, 0.52, 0.13);
      positioned.push(...positionBlockStack(bodyDrafts, bodyFrame, 0.006));
    }
    return finalizeLayoutBlocks(positioned.sort((a, b) => a.order - b.order), page);
  }

  if (kind === "index") {
    if (leadingDrafts.length > 0) positioned.push(...positionBlockStack(leadingDrafts, layoutBounds(0.2, 0.14, 0.6, 0.055), 0.006));
    const columns = splitBlocksIntoColumns(bodyDrafts, 2);
    const frames = [layoutBounds(0.18, 0.215, 0.3, 0.66), layoutBounds(0.525, 0.215, 0.3, 0.66)];
    columns.forEach((column, index) => positioned.push(...positionBlockStack(column, frames[index], 0.0048)));
    return finalizeLayoutBlocks(positioned.sort((a, b) => a.order - b.order), page);
  }

  const leadFrameHeight = leadingDrafts.length > 0 ? (kind === "front-matter" ? 0.12 : 0.09) : 0;
  if (leadingDrafts.length > 0) positioned.push(...positionBlockStack(leadingDrafts, layoutBounds(0.19, 0.13, 0.62, leadFrameHeight), 0.008));
  const bodyStart = leadingDrafts.length > 0 ? 0.13 + leadFrameHeight + 0.018 : kind === "front-matter" ? 0.19 : 0.13;
  const bodyFrameHeight = kind === "front-matter" ? 0.68 - (bodyStart - 0.19) : 0.79 - (bodyStart - 0.13);
  const usesTwoColumns = shouldUseTwoColumns(kind, page, bodyDrafts);
  if (usesTwoColumns) {
    const columns = splitBlocksIntoColumns(bodyDrafts, 2);
    const frames = [layoutBounds(0.18, bodyStart, 0.3, bodyFrameHeight), layoutBounds(0.525, bodyStart, 0.3, bodyFrameHeight)];
    columns.forEach((column, index) => positioned.push(...positionBlockStack(column, frames[index], 0.006)));
  } else {
    positioned.push(...positionBlockStack(bodyDrafts, layoutBounds(0.205, bodyStart, 0.59, bodyFrameHeight), 0.007));
  }

  return finalizeLayoutBlocks(positioned.sort((a, b) => a.order - b.order), page);
}

export function buildManualLayoutManifest(manifest = buildManualManifest(defaultRoot)) {
  const pages = manifest.pages.map((page) => {
    const kind = pageLayoutKind(page.pageNumber);
    const blocks = positionManualLayoutBlocks(page, kind);
    const usesTwoColumns = kind === "index" || blocks.some((block) => block.type !== "pageNumber" && block.bounds.x >= 0.5);
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
      masks: sourceTextMasksForBlocks(page, blocks, kind),
      textRegions: pageTextFrames(kind, page, blocks),
      visualRegions: visualRegionsForPage(kind, page, blocks, usesTwoColumns),
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
    endPage: child.endPage ?? (all.slice(index + 1).find((nextChild) => nextChild.startPage > child.startPage)?.startPage ?? entry.endPage + 1) - 1
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
  if (/manual-russian-page-flow/u.test(appSource)) {
    errors.push(`${appSourcePath}: manual primary UI must not collapse Russian blocks into a single flow transcript.`);
  }
  if (!/manualBoundsStyle\(block\.bounds\)/u.test(appSource)) {
    errors.push(`${appSourcePath}: manual renderer must position each Russian block using block.bounds.`);
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

function boundsArea(bounds) {
  return Number(bounds?.width || 0) * Number(bounds?.height || 0);
}

function isFullPageBounds(bounds) {
  return bounds && bounds.x <= 0.01 && bounds.y <= 0.01 && bounds.x + bounds.width >= 0.99 && bounds.y + bounds.height >= 0.99;
}

function closeEnough(a, b, epsilon = 0.0025) {
  return Math.abs(Number(a) - Number(b)) <= epsilon;
}

function insideBounds(inner, outer, epsilon = 0.0025) {
  return (
    inner.x >= outer.x - epsilon &&
    inner.y >= outer.y - epsilon &&
    inner.x + inner.width <= outer.x + outer.width + epsilon &&
    inner.y + inner.height <= outer.y + outer.height + epsilon
  );
}

function boundsSignature(bounds) {
  return ["x", "y", "width", "height"].map((key) => Number(bounds?.[key] ?? 0).toFixed(3)).join(":");
}

function hasUniformSyntheticBlockGeometry(blocks) {
  const textBlocks = blocks.filter((block) => block.type !== "pageNumber" && isPlainObject(block.bounds));
  if (textBlocks.length < 5) return false;
  const sameHorizontalRail = textBlocks.every(
    (block) => closeEnough(block.bounds.x, textBlocks[0].bounds.x) && closeEnough(block.bounds.width, textBlocks[0].bounds.width)
  );
  const sameHeights = textBlocks.every((block) => closeEnough(block.bounds.height, textBlocks[0].bounds.height));
  const ySteps = textBlocks.slice(1).map((block, index) => Number((block.bounds.y - textBlocks[index].bounds.y).toFixed(4)));
  const uniformYSteps = ySteps.length > 0 && ySteps.every((step) => closeEnough(step, ySteps[0], 0.0035));
  const uniqueBounds = new Set(textBlocks.map((block) => boundsSignature(block.bounds))).size;
  return (sameHorizontalRail && sameHeights && uniformYSteps) || uniqueBounds < Math.ceil(textBlocks.length * 0.65);
}

function validateNonGenericLayoutGeometry(errors, label, layoutPage) {
  const blocks = Array.isArray(layoutPage.blocks) ? layoutPage.blocks : [];
  const textBlocks = blocks.filter((block) => block?.type !== "pageNumber" && isPlainObject(block?.bounds));
  if (hasUniformSyntheticBlockGeometry(blocks)) {
    errors.push(`${label}: block bounds look like uniform synthetic flow geometry instead of page-specific layout boxes.`);
  }

  if (Array.isArray(layoutPage.textRegions)) {
    const genericFlowRegion = layoutPage.textRegions.find((region) => /flow|scroll/i.test(`${region?.id ?? ""} ${region?.fit ?? ""}`));
    if (genericFlowRegion && textBlocks.length >= 4 && textBlocks.every((block) => insideBounds(block.bounds, genericFlowRegion.bounds))) {
      errors.push(`${label}: textRegions must not declare a single generic scrolling flow region that contains all text blocks.`);
    }
  }

  if (Array.isArray(layoutPage.masks)) {
    if (layoutPage.masks.length === 1 && textBlocks.length >= 3 && boundsArea(layoutPage.masks[0]?.bounds) > 0.16) {
      errors.push(`${label}: masks must be page/block-specific instead of one broad source-text mask.`);
    }
    if (textBlocks.length >= 3 && layoutPage.masks.length < Math.min(textBlocks.length, 3)) {
      errors.push(`${label}: masks must provide enough block-specific source-text replacement regions.`);
    }
  }

  if (Array.isArray(layoutPage.visualRegions)) {
    if (layoutPage.visualRegions.length === 1 && isFullPageBounds(layoutPage.visualRegions[0]?.bounds)) {
      errors.push(`${label}: visualRegions must not be one full-page catch-all region.`);
    }
    if (layoutPage.visualRegions.length > 0 && layoutPage.visualRegions.every((region) => boundsArea(region?.bounds) > 0.9)) {
      errors.push(`${label}: visualRegions must identify meaningful preserved page regions, not full-page catch-all geometry.`);
    }
  }
}

function maskCoversPoint(mask, point) {
  const bounds = mask?.bounds;
  return Boolean(
    bounds &&
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
  );
}

const ALLOWED_SOURCE_MASK_GEOMETRIES = new Set(["source_page_text_region", "source_page_caption_region", "source_page_label_region"]);
const ALLOWED_SOURCE_MASK_METHODS = new Set(["structured_source_text_region", "curated_source_page_geometry", "structured_precomposed_russian_replacement"]);
const REPRESENTATIVE_NON_APPENDIX_SOURCE_MASK_PAGES = new Map([
  [14, { label: "section-divider introduction page", requiredRoles: ["page-number", "source-heading"] }],
  [24, { label: "ordinary chapter body page", requiredRoles: ["page-number", "source-heading", "source-body"] }],
  [75, { label: "ordinary chapter list page", requiredRoles: ["page-number", "source-heading", "source-list"] }],
  [82, { label: "ordinary chapter callout/body page", requiredRoles: ["page-number", "source-body", "source-heading"] }],
  [114, { label: "Appendix I mixed list/table-like page", requiredRoles: ["page-number", "source-heading", "source-list", "source-footnote"] }],
  [125, { label: "Appendix II body/caption page", requiredRoles: ["page-number", "source-body", "source-heading"] }],
  [144, { label: "Appendix II safe-driving body page", requiredRoles: ["page-number", "source-body", "source-heading"] }]
]);

function validateMaskSourceProvenance(errors, label, layoutPage, manifestPage) {
  const masks = Array.isArray(layoutPage.masks) ? layoutPage.masks : [];
  const blockBounds = new Set((Array.isArray(layoutPage.blocks) ? layoutPage.blocks : []).map((block) => boundsSignature(block?.bounds)));
  for (const mask of masks) {
    const maskLabel = `${label}: mask ${mask?.id ?? "(missing id)"}`;
    if (!isNonEmptyString(mask?.role)) errors.push(`${maskLabel} must record the source text/caption/label role being replaced.`);
    if (!ALLOWED_SOURCE_MASK_GEOMETRIES.has(mask?.sourceGeometry)) {
      errors.push(`${maskLabel} must use source text/caption/label geometry, not destination Russian block geometry.`);
    }
    if (!isNonEmptyString(mask?.sourceTextEs)) errors.push(`${maskLabel} must record hidden Spanish source text/caption/label evidence.`);
    if (!ALLOWED_SOURCE_MASK_METHODS.has(mask?.provenance?.method)) {
      errors.push(`${maskLabel} must record structured or curated source-region provenance.`);
    }
    if (mask?.provenance?.sourcePageNumber !== manifestPage?.sourcePageNumber) {
      errors.push(`${maskLabel} provenance.sourcePageNumber must match the source page.`);
    }
    if (mask?.provenance?.visualAssetPath !== manifestPage?.visualAsset?.localPath) {
      errors.push(`${maskLabel} provenance.visualAssetPath must match the local source page visual.`);
    }
    if (mask?.sourceGeometry === "russian_block_replacement_region" || mask?.provenance?.method === "destination_russian_block_geometry") {
      errors.push(`${maskLabel} must not be derived from destination Russian block placement.`);
    }
    if (mask?.provenance?.method === "structured_source_text_region") {
      if (!isNonEmptyString(mask?.provenance?.sourceTextPointer)) errors.push(`${maskLabel} must point to translation.sourceTextEs.`);
      if (typeof mask?.provenance?.sourceLineStart !== "number" || typeof mask?.provenance?.sourceLineEnd !== "number") {
        errors.push(`${maskLabel} must record source line span provenance.`);
      }
      if (!isNonEmptyString(mask?.provenance?.sourceTextSha256)) errors.push(`${maskLabel} must record source text hash provenance.`);
    }
    if (
      layoutPage.pageNumber < 185 &&
      blockBounds.has(boundsSignature(mask?.bounds)) &&
      mask?.provenance?.method !== "structured_precomposed_russian_replacement"
    ) {
      errors.push(`${maskLabel} bounds match a destination Russian block; non-Appendix masks must come from source regions.`);
    }
  }
}

function validateRepresentativeNonAppendixSourceMasks(errors, label, layoutPage) {
  const expectation = REPRESENTATIVE_NON_APPENDIX_SOURCE_MASK_PAGES.get(layoutPage.pageNumber);
  if (!expectation) return;
  const masks = Array.isArray(layoutPage.masks) ? layoutPage.masks : [];
  for (const role of expectation.requiredRoles) {
    if (!masks.some((mask) => mask?.role === role)) {
      errors.push(`${label}: representative ${expectation.label} must include a ${role} source-region mask.`);
    }
  }
  if (!masks.every((mask) => ALLOWED_SOURCE_MASK_GEOMETRIES.has(mask?.sourceGeometry))) {
    errors.push(`${label}: representative ${expectation.label} must use source text/caption/label mask geometry only.`);
  }
  if (!masks.every((mask) => ALLOWED_SOURCE_MASK_METHODS.has(mask?.provenance?.method))) {
    errors.push(`${label}: representative ${expectation.label} must record source-region provenance on every mask.`);
  }
}

function validateAppendixIVSourceTextMasks(errors, label, layoutPage) {
  const requiredPointsByPage = new Map([
    [
      185,
      [
        { role: "source-heading", x: 0.36, y: 0.288, label: "Reglamentarias heading" },
        { role: "source-heading", x: 0.36, y: 0.315, label: "De prohibicion heading" },
        { role: "sign-caption", x: 0.36, y: 0.369, label: "first-row sign caption" },
        { role: "sign-caption", x: 0.58, y: 0.536, label: "middle sign caption" },
        { role: "sign-caption", x: 0.37, y: 0.688, label: "lower sign caption" }
      ]
    ],
    [
      186,
      [
        { role: "source-heading", x: 0.36, y: 0.288, label: "De restriccion heading" },
        { role: "source-heading", x: 0.36, y: 0.533, label: "De prioridad heading" },
        { role: "sign-caption", x: 0.46, y: 0.409, label: "restriction caption" }
      ]
    ],
    [
      187,
      [
        { role: "source-heading", x: 0.36, y: 0.288, label: "Preventivas heading" },
        { role: "sign-caption", x: 0.46, y: 0.435, label: "warning caption" }
      ]
    ],
    [
      193,
      [
        { role: "source-heading", x: 0.36, y: 0.288, label: "Transitorias heading" },
        { role: "sign-caption", x: 0.46, y: 0.493, label: "temporary sign caption" }
      ]
    ],
    [
      197,
      [
        { role: "source-heading", x: 0.36, y: 0.288, label: "Senalamiento luminoso heading" },
        { role: "instructional-text", x: 0.47, y: 0.365, label: "traffic-light explanatory text" }
      ]
    ]
  ]);
  const requiredPoints = requiredPointsByPage.get(layoutPage.pageNumber);
  if (!requiredPoints) return;

  const masks = Array.isArray(layoutPage.masks) ? layoutPage.masks : [];
  for (const mask of masks) {
    if (mask?.sourceGeometry !== "source_page_text_region" && mask?.sourceGeometry !== "source_page_caption_region") {
      errors.push(`${label}: Appendix IV masks must be based on source text/caption geometry, not destination Russian block geometry.`);
    }
    if (!isNonEmptyString(mask?.role)) errors.push(`${label}: Appendix IV mask ${mask?.id ?? "(missing id)"} must record a source-text role.`);
    if (!isNonEmptyString(mask?.sourceTextEs)) errors.push(`${label}: Appendix IV mask ${mask?.id ?? "(missing id)"} must record hidden source text/caption evidence.`);
    if (mask?.provenance?.method !== "curated_source_page_geometry") {
      errors.push(`${label}: Appendix IV mask ${mask?.id ?? "(missing id)"} must record curated source-page provenance.`);
    }
  }

  for (const point of requiredPoints) {
    const coveringMask = masks.find((mask) => mask?.role === point.role && maskCoversPoint(mask, point));
    if (!coveringMask) {
      errors.push(`${label}: missing ${point.role} mask over source ${point.label} at ${point.x.toFixed(3)},${point.y.toFixed(3)}.`);
    }
  }
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
      layoutPage.textRegions.forEach((region, regionIndex) => {
        validateBounds(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} text region ${regionIndex + 1}`, region?.bounds);
        if (region?.fit !== "absolute-positioned-blocks") {
          errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} text region ${regionIndex + 1} must be absolute-positioned-blocks.`);
        }
      });
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
      if (block.typography?.fit !== "absolute-fit") {
        errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} typography.fit must be absolute-fit.`);
      }
      if (typeof block.typography?.fontScale !== "number" || !Number.isFinite(block.typography.fontScale)) {
        errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} typography.fontScale must be numeric.`);
      }
      if (typeof block.typography?.lineHeight !== "number" || !Number.isFinite(block.typography.lineHeight)) {
        errors.push(`${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber} block ${blockIndex + 1} typography.lineHeight must be numeric.`);
      }
      orderedText.push(block.textRu);
    });
    validateNonGenericLayoutGeometry(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber}`, layoutPage);
    validateMaskSourceProvenance(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber}`, layoutPage, page);
    validateRepresentativeNonAppendixSourceMasks(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber}`, layoutPage);
    validateAppendixIVSourceTextMasks(errors, `${MANUAL_LAYOUT_PATH}: page ${expectedPageNumber}`, layoutPage);

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

  const manualPageByNumber = new Map((manifest?.pages ?? []).map((page) => [page.pageNumber, page]));
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
      const startEvidence = MANUAL_TOPIC_START_TEXT_EVIDENCE.get(child.id);
      if (startEvidence) {
        if (child.startPage !== startEvidence.startPage) {
          errors.push(`${MANUAL_NAVIGATION_PATH}: child ${child.id} must start on page ${startEvidence.startPage} based on page-heading/content evidence.`);
        }
        const pageText = normalizeManualLayoutText(manualPageByNumber.get(child.startPage)?.translation?.fullTranslationRu ?? "");
        for (const requiredText of startEvidence.requiredText) {
          if (!pageText.includes(requiredText)) {
            errors.push(`${MANUAL_NAVIGATION_PATH}: child ${child.id} start page ${child.startPage} does not contain required evidence text "${requiredText}".`);
          }
        }
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
