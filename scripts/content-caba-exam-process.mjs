const allowedStatuses = new Set(["draft", "published"]);
const allowedContentStatuses = new Set(["unofficial_learning_aid"]);
const allowedOwners = new Set(["GCBA", "ANSV", "Gobierno Argentino"]);
const allowedCurrentness = new Set(["checked_current", "checked_current_with_historico_url", "volatile_check_required"]);
const allowedCallouts = new Set(["required_step", "optional_preparation", "adjacent_path", "warning"]);
const allowedVolatility = new Set(["stable_procedure", "volatile_fee", "volatile_location", "volatile_screen", "volatile_document_list"]);

const requiredSourceIds = [
  "gcba-otorgamiento",
  "gcba-extranjeros",
  "gcba-curso",
  "gcba-material-teorico",
  "gcba-examen-practico",
  "gcba-pista-aprendizaje",
  "gcba-cenat",
  "ansv-cenat-payment",
  "gcba-principiantes"
];

const requiredSectionIds = [
  "scope-and-status",
  "requirements-documents",
  "cenat-and-start",
  "course",
  "turno-bui-sede",
  "exam-day-psychophysical",
  "theory-exam",
  "practical-car-exam",
  "where-and-practice",
  "adjacent-paths",
  "community-cautions"
];

const requiredGlossaryTerms = [
  "Otorgamiento de Licencia de Conducir",
  "Renovación",
  "Renovación por cambio de jurisdicción",
  "Ampliación",
  "CENAT",
  "BUI",
  "miBA",
  "Boti",
  "turno",
  "sede / subsede comunal",
  "Declaración Jurada / DDJJ",
  "aptitud psicofísica",
  "curso de educación vial",
  "examen teórico",
  "examen práctico",
  "principiante",
  "certificado de legalidad",
  "recorrido",
  "siniestro vial / incidente vial / accidente vial"
];

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isOfficialUrl(value) {
  return typeof value === "string" && /^https:\/\/(buenosaires\.gob\.ar|documentosboletinoficial\.buenosaires\.gob\.ar|cnatboleta\.com)\//.test(value);
}

function requireString(errors, value, label) {
  if (typeof value !== "string" || value.trim() === "") errors.push(`${label} must be a non-empty string.`);
}

function requireNonEmptyArray(errors, value, label) {
  if (!Array.isArray(value) || value.length === 0) errors.push(`${label} must be a non-empty array.`);
}

function validateSourceIds(errors, sourceIds, sourceById, label) {
  requireNonEmptyArray(errors, sourceIds, `${label}.sourceIds`);
  for (const sourceId of sourceIds || []) {
    if (!sourceById.has(sourceId)) errors.push(`${label}: missing source reference ${sourceId}.`);
  }
}

export function validateCabaExamProcessGuide({ guide, fileExists = () => false } = {}) {
  const errors = [];
  if (!guide || typeof guide !== "object") return ["caba exam process guide must be an object."];

  if (guide.id !== "caba-exam-process") errors.push("caba exam process guide id must be caba-exam-process.");
  if (guide.locale !== "ru") errors.push("caba exam process guide locale must be ru.");
  if (!allowedStatuses.has(guide.status)) errors.push(`caba exam process guide status is unsupported: ${guide.status}`);
  if (!allowedContentStatuses.has(guide.contentStatus)) errors.push("caba exam process guide must be marked as unofficial_learning_aid.");
  if (!isIsoDate(guide.lastReviewedAt)) errors.push("caba exam process guide lastReviewedAt must be an ISO date.");
  requireString(errors, guide.titleRu, "cabaExamProcess.titleRu");
  requireString(errors, guide.disclaimerRu, "cabaExamProcess.disclaimerRu");
  requireString(errors, guide.officialActionWarningRu, "cabaExamProcess.officialActionWarningRu");
  requireString(errors, guide.volatilityWarningRu, "cabaExamProcess.volatilityWarningRu");
  if (!guide.disclaimerRu?.includes("неофициальная")) errors.push("caba exam process disclaimer must mark the guide as unofficial.");
  if (!guide.officialActionWarningRu?.includes("официальные")) errors.push("caba exam process official action warning must direct users to official pages.");

  const scope = guide.primaryScope || {};
  if (scope.jurisdiction !== "CABA") errors.push("caba exam process primaryScope.jurisdiction must be CABA.");
  if (scope.procedure !== "otorgamiento") errors.push("caba exam process primaryScope.procedure must be otorgamiento.");
  if (scope.category !== "B1") errors.push("caba exam process primaryScope.category must be B1.");
  requireString(errors, scope.audienceRu, "cabaExamProcess.primaryScope.audienceRu");

  requireNonEmptyArray(errors, guide.sources, "cabaExamProcess.sources");
  const sourceById = new Map();
  for (const source of guide.sources || []) {
    requireString(errors, source.id, "cabaExamProcess.source.id");
    if (sourceById.has(source.id)) errors.push(`Duplicate caba exam process source id: ${source.id}`);
    sourceById.set(source.id, source);
    requireString(errors, source.title, `${source.id}.title`);
    if (!isOfficialUrl(source.url)) errors.push(`${source.id}.url must be an approved official URL.`);
    if (!isIsoDate(source.checkedAt)) errors.push(`${source.id}.checkedAt must be an ISO date.`);
    if (!allowedOwners.has(source.officialOwner)) errors.push(`${source.id}.officialOwner is unsupported.`);
    if (!allowedCurrentness.has(source.currentnessStatus)) errors.push(`${source.id}.currentnessStatus is unsupported.`);
    requireString(errors, source.resultRu, `${source.id}.resultRu`);
  }
  for (const sourceId of requiredSourceIds) {
    if (!sourceById.has(sourceId)) errors.push(`caba exam process missing required source ${sourceId}.`);
  }

  requireNonEmptyArray(errors, guide.sections, "cabaExamProcess.sections");
  const sectionIds = new Set();
  for (const section of guide.sections || []) {
    requireString(errors, section.id, "cabaExamProcess.section.id");
    sectionIds.add(section.id);
    requireString(errors, section.titleRu, `${section.id}.titleRu`);
    requireNonEmptyArray(errors, section.bodyRu, `${section.id}.bodyRu`);
    validateSourceIds(errors, section.sourceIds, sourceById, section.id);
    if (!allowedCallouts.has(section.calloutType)) errors.push(`${section.id}.calloutType is unsupported.`);
    if (section.volatility && !allowedVolatility.has(section.volatility)) errors.push(`${section.id}.volatility is unsupported.`);
    if (section.volatility && !section.volatilityWarningRu) errors.push(`${section.id}: volatile sections must include volatilityWarningRu.`);
    if (section.id.includes("psychophysical") && /диагноз|вы годны|вам подходит|вы подходите/i.test(section.bodyRu.join(" "))) {
      errors.push(`${section.id}: psychophysical section must avoid medical eligibility advice wording.`);
    }
  }
  for (const sectionId of requiredSectionIds) {
    if (!sectionIds.has(sectionId)) errors.push(`caba exam process missing required section ${sectionId}.`);
  }

  requireNonEmptyArray(errors, guide.officialLinks, "cabaExamProcess.officialLinks");
  for (const group of guide.officialLinks || []) {
    requireString(errors, group.id, "cabaExamProcess.officialLinkGroup.id");
    requireString(errors, group.titleRu, `${group.id}.titleRu`);
    requireNonEmptyArray(errors, group.links, `${group.id}.links`);
    for (const link of group.links || []) {
      requireString(errors, link.labelRu, `${group.id}.link.labelRu`);
      if (!isOfficialUrl(link.url)) errors.push(`${group.id}.${link.labelRu}: link URL must be official.`);
      if (!sourceById.has(link.sourceId)) errors.push(`${group.id}.${link.labelRu}: missing source ${link.sourceId}.`);
    }
  }

  requireNonEmptyArray(errors, guide.glossary, "cabaExamProcess.glossary");
  const glossaryTerms = new Set();
  for (const term of guide.glossary || []) {
    requireString(errors, term.id, "cabaExamProcess.glossary.id");
    requireString(errors, term.termEs, `${term.id}.termEs`);
    requireString(errors, term.translationRu, `${term.id}.translationRu`);
    requireString(errors, term.explanationRu, `${term.id}.explanationRu`);
    glossaryTerms.add(term.termEs);
    validateSourceIds(errors, term.sourceIds, sourceById, term.id);
  }
  for (const term of requiredGlossaryTerms) {
    if (!glossaryTerms.has(term)) errors.push(`caba exam process glossary missing term: ${term}`);
  }

  if (!Array.isArray(guide.optionalImages)) errors.push("cabaExamProcess.optionalImages must be an array.");
  for (const image of guide.optionalImages || []) {
    requireString(errors, image.id, "cabaExamProcess.image.id");
    requireString(errors, image.localPath, `${image.id}.localPath`);
    if (/^https?:\/\//.test(image.localPath)) errors.push(`${image.id}: localPath must be local, not remote.`);
    if (!image.localPath.startsWith("content/assets/")) errors.push(`${image.id}: localPath must live under content/assets/.`);
    if (!fileExists(image.localPath)) errors.push(`${image.id}: local image is missing.`);
    if (!isOfficialUrl(image.sourceUrl)) errors.push(`${image.id}: sourceUrl must be official.`);
    requireString(errors, image.license, `${image.id}.license`);
    requireString(errors, image.attribution, `${image.id}.attribution`);
    if (!isIsoDate(image.checkedAt)) errors.push(`${image.id}.checkedAt must be an ISO date.`);
    if (image.privacyReview !== "passed") errors.push(`${image.id}: privacyReview must be passed.`);
  }

  return errors;
}
