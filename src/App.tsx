import { BookMarked, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, ExternalLink, FileText, Flag, Image as ImageIcon, ListTree, MapPinned, RotateCcw, Search, Timer, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import {
  data,
  assetUrl,
  explanationByQuestion,
  imageOverlayByQuestion,
  learningImageById,
  learningImageCoverageByUnit,
  questionById,
  sourceById,
  translationByQuestion,
  type ImageExplanationOverlay,
  type LearningImageCoverageRecord,
  type LearningImageRecord,
  type ProgressAnswer,
  type ProcessGuideSection,
  type Question,
  type TopicGuideTicket
} from "./data/content";
import type { ManualLayoutBlock, ManualNavigationEntry, ManualLayoutManifest, ManualPage, ManualPageBounds, ManualPageLayout, ManualRuManifest, ManualNavigationManifest } from "./data/manual4Ruedas";
import {
  introductionArticleSections,
  introductionNavigation,
  pandemiaVialSection,
  type IntroductionArticleBlock,
  type IntroductionArticleSection,
  type IntroductionNavigationEntry,
  type IntroductionRouteId,
  type IntroductionSourceArtworkAsset,
  type PandemiaVialGeometry
} from "./data/pandemiaVialSection";
import {
  manualGuideNavigation,
  manualGuidePageByHash,
  manualGuidePageById,
  manualGuidePageContentById,
  type ManualGuidePageContent,
  type ManualGuidePageEntry
} from "./data/manualGuide";
import { loadPrimarySources, type PrimarySourceChunk, type PrimarySourceCorpus, type PrimarySourceDocument } from "./data/primarySources";
import { DifficultyIndicator } from "./difficulty";
import { formatDuration, isPassing, learningTicketTargetSeconds, mistakesFromHistory, scorePercent, selectExamSet, shuffleQuestions } from "./domain";
import { exactTextStatusKind, exactTextStatusNote } from "./primarySourceStatus";
import { clearProgress, loadProgress, saveProgress, type StoredProgress } from "./storage";
import { searchQuestions, searchVocabulary } from "./search";

type View = "learn" | "exam" | "mistakes" | "vocabulary" | "guide" | "materials" | "process" | "sources" | "manual" | "pandemia";
type SourceViewMode = "simple" | "full" | "spanish";
type SourceFilterOption = {
  value: string;
  label: string;
};
type PrimarySourceDocumentMatch = {
  document: PrimarySourceDocument;
  matchingChunks: PrimarySourceChunk[];
  matchCount: number;
  isVisible: boolean;
};
type ManualManifestSummary = {
  pages: number;
  expectedPages: number;
  layoutPages: number;
  navigationSections: number;
  navigationTopics: number;
  localAssets: number;
  reusedTranslations: number;
  visualTextTranslations: number;
};
type ManualManifestState = {
  manifest?: ManualRuManifest;
  layout?: ManualLayoutManifest;
  navigation?: ManualNavigationManifest;
  summary?: ManualManifestSummary;
  error?: string;
  isLoading: boolean;
};
type ManualSearchIndexEntry = {
  page: ManualPage;
  section?: ManualNavigationEntry;
  resultId: string;
  searchText: string;
};
type LearningTicketTimerStatus = "running" | "paused" | "expired" | "answered";
type LearningTicketTimerState = {
  remainingSeconds: number;
  status: LearningTicketTimerStatus;
  answeredAfterExpiry: boolean;
};

type LearningTicketTimerView = LearningTicketTimerState & {
  onTogglePause: () => void;
};

type QuestionAttemptState = {
  selectedAnswerId?: string;
  showTranslation: boolean;
  showExplanation: boolean;
};

const emptyAttemptState: QuestionAttemptState = {
  selectedAnswerId: undefined,
  showTranslation: false,
  showExplanation: false
};

function topicLabel(topic: string) {
  const labels: Record<string, string> = {
    accident: "ДТП",
    documents: "Документы",
    parking: "Стоянка",
    priority: "Приоритет",
    speed: "Скорость",
    safety: "Безопасность",
    signs: "Знаки",
    "vehicle-condition": "Техсостояние",
    "urban-mobility": "Город",
    general: "Общее"
  };
  return labels[topic] || topic;
}

function guideStatusLabel(status: string) {
  if (status === "draft") return "Черновик: материал неполный";
  if (status === "published") return "Опубликованный учебный материал";
  return "Статус материала требует проверки";
}

function guideContentStatusLabel(contentStatus: string) {
  if (contentStatus === "unofficial_learning_aid") return "Неофициальная учебная поддержка";
  return "Учебный статус требует проверки";
}

function practiceContentStatusLabel() {
  return "Текущие билеты: неофициальная B-практика, не полная официальная база GCBA";
}

function sourceStatusLabel(status: string | undefined) {
  if (status === "current") return "источник проверен как текущий";
  if (status === "stale") return "источник требует обновления";
  return "статус источника требует проверки";
}

function processSourceStatusLabel(status: string) {
  if (status === "checked_current") return "проверен как текущий";
  if (status === "checked_current_with_historico_url") return "проверен как текущий; URL может вести через gcaba_historico";
  if (status === "volatile_check_required") return "волатильные данные: проверить перед действием";
  return "статус требует проверки";
}

function processCalloutLabel(section: ProcessGuideSection) {
  if (section.calloutType === "required_step") return "Шаг процесса";
  if (section.calloutType === "optional_preparation") return "Опциональная подготовка";
  if (section.calloutType === "adjacent_path") return "Соседний путь";
  return "Предупреждение";
}

function topicSummaryUnitId(topicId: string) {
  return `topic-summary:${topicId}`;
}

function topicLearningUnitId(topicId: string, index: number) {
  return `topic-learning:${topicId}:${index + 1}`;
}

function topicPracticalUnitId(topicId: string, index: number) {
  return `topic-practical:${topicId}:${index + 1}`;
}

function topicTrapUnitId(topicId: string, noteId: string | undefined, index: number) {
  return `topic-trap:${topicId}:${noteId || index + 1}`;
}

function topicTermUnitId(topicId: string, termId: string) {
  return `topic-term:${topicId}:${termId}`;
}

function vocabularyTermUnitId(termId: string) {
  return `vocabulary-term:${termId}`;
}

function primarySourceCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    "civil-commercial-law": "Гражданское право",
    "criminal-law": "Уголовное право",
    "traffic-law": "ПДД и закон",
    "traffic-code": "Кодекс CABA",
    "traffic-signage": "Знаки",
    "signage-and-road-marking": "Знаки и разметка",
    "exam-study-material": "Подготовка",
    "study-material": "Учебные материалы",
    "vehicle-documents": "Документы ТС",
    "vehicle-inspection": "VTV",
    "road-safety": "Безопасность",
    insurance: "Страхование",
    "insurance-legal-duties": "Страхование и обязанности",
    "legal-duties": "Правовые обязанности"
  };
  return labels[category] || category;
}

function primarySourceTypeLabel(sourceType: string) {
  const labels: Record<string, string> = {
    caba_law_original_text: "Закон CABA, исходный текст",
    caba_law_updated_text: "Закон CABA, актуализированный текст",
    caba_service_current_material: "Текущий материал сервиса CABA",
    dnrpa_current_material: "Текущий материал DNRPA",
    dnrpa_disposition_original_text: "Распоряжение DNRPA, исходный текст",
    gcba_road_safety_guide_pdf: "Руководство GCBA по безопасности",
    gcba_road_safety_page: "Страница GCBA по безопасности",
    gcba_study_material_page: "Учебная страница GCBA",
    gcba_theoretical_exam_manual_pdf: "Учебный manual GCBA",
    national_decree_annex_updated_text: "Национальный декрет, приложение",
    national_decree_updated_text: "Национальный декрет",
    national_law_updated_text: "Национальный закон",
    national_road_safety_official_note: "Официальная заметка ANSV",
    national_service_current_material: "Текущий национальный сервис",
    national_service_topic_current_material: "Текущий национальный справочный материал"
  };
  if (labels[sourceType]) return labels[sourceType];
  if (sourceType.includes("gcba")) return "GCBA";
  if (sourceType.includes("national")) return "Национальный источник";
  if (sourceType.includes("law")) return "Закон";
  if (sourceType.includes("decree")) return "Декрет";
  return sourceType.replaceAll("_", " ");
}

function primarySourceJurisdictionLabel(jurisdiction: string) {
  if (jurisdiction === "caba") return "CABA";
  if (jurisdiction === "national") return "Аргентина";
  return jurisdiction.replaceAll("_", " ");
}

function exactTextLabel(status: string) {
  if (status === "passed") return "точный текст проверен";
  if (status === "failed") return "точный текст требует исправления";
  return "точный текст: проверка ожидается";
}

function primarySourceCurrentnessLabel(status: string) {
  if (status === "current") return "актуальный источник";
  if (status === "in_force") return "действует";
  if (status === "valid_current_material") return "действующий справочный материал";
  if (status === "stale") return "нужна актуализация";
  return "статус актуальности требует проверки";
}

function primarySourceValidationLabel(status: string) {
  if (status === "passed") return "проверка пройдена";
  if (status === "failed") return "проверка не пройдена";
  return "проверка ожидается";
}

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("ru")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function learningTimerStatusText(timer: LearningTicketTimerState) {
  if (timer.answeredAfterExpiry) return "Ответ после лимита";
  if (timer.status === "expired") return "Время вышло - билет пока не решен";
  if (timer.status === "paused") return "Пауза";
  if (timer.status === "answered") return "В темпе";
  return "Мягкий лимит";
}

function initialLearningTimerState(targetSeconds: number): LearningTicketTimerState {
  return {
    remainingSeconds: targetSeconds,
    status: "running",
    answeredAfterExpiry: false
  };
}

function completedLearningTimerState(targetSeconds: number): LearningTicketTimerState {
  return {
    remainingSeconds: targetSeconds,
    status: "answered",
    answeredAfterExpiry: false
  };
}

function QuestionImageFigure({
  question,
  overlay,
  showOverlay,
  showFallback
}: {
  question: Question;
  overlay?: ImageExplanationOverlay;
  showOverlay: boolean;
  showFallback: boolean;
}) {
  const imagePath = question.image!.localPath;
  const imageSrc = assetUrl(imagePath);
  const [naturalSize, setNaturalSize] = useState<{ src: string; width: number; height: number }>();
  const currentNaturalSize = naturalSize?.src === imageSrc ? naturalSize : undefined;
  const imageFrameStyle = currentNaturalSize
    ? ({
        "--question-image-max-width-by-height": `${(360 * currentNaturalSize.width) / currentNaturalSize.height}px`
      } as CSSProperties)
    : undefined;

  return (
    <figure className={showOverlay ? "question-image has-explanation-overlay" : "question-image"}>
      <div className="question-image-frame" style={imageFrameStyle}>
        <img
          src={imageSrc}
          alt={question.image!.altEs}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalWidth <= 0 || naturalHeight <= 0) return;
            if (event.currentTarget.getAttribute("src") !== imageSrc) return;
            setNaturalSize((current) => {
              if (current?.src === imageSrc && current.width === naturalWidth && current.height === naturalHeight) return current;
              return { src: imageSrc, width: naturalWidth, height: naturalHeight };
            });
          }}
        />
        {showOverlay && overlay && (
          <div className="image-explanation-overlay" data-testid="image-explanation-overlay" aria-hidden="true">
            {overlay.regions.map((region) => (
              <span
                key={region.overlayRegionId}
                className={`image-overlay-region ${region.sourceRole === "answer_critical_highlight" ? "critical" : ""} ${region.sourceRole === "background_irrelevant_dim" || region.sourceRole === "distractor_trap" ? "dim" : ""} ${region.sourceRole === "supporting" ? "supporting" : ""}`}
                style={{
                  left: `${region.rect.x}%`,
                  top: `${region.rect.y}%`,
                  width: `${region.rect.width}%`,
                  height: `${region.rect.height}%`
                }}
                data-overlay-role={region.sourceRole}
                data-relevance-id={region.relevanceId}
              />
            ))}
          </div>
        )}
      </div>
      <figcaption>
        <ImageIcon size={16} aria-hidden="true" /> Локальное изображение вопроса
        {showOverlay && overlay ? <span> · включено проверенное визуальное пояснение</span> : null}
      </figcaption>
      {showFallback && (
        <p className="image-overlay-fallback" data-testid="image-overlay-fallback">
          Для этого изображения пока нет проверенного overlay-пояснения; показана обычная локальная картинка без угаданных подсветок.
        </p>
      )}
    </figure>
  );
}

function LearningImageFigure({
  unitId,
  compact = false
}: {
  unitId: string;
  compact?: boolean;
}) {
  const coverage = learningImageCoverageByUnit.get(unitId) as LearningImageCoverageRecord | undefined;
  const image = coverage?.imageIds?.[0] ? learningImageById.get(coverage.imageIds[0]) as LearningImageRecord | undefined : undefined;
  if (!coverage || coverage.status === "exception" || !image) return null;

  return (
    <figure
      className={compact ? "learning-image compact" : "learning-image"}
      data-testid="learning-image"
      data-learning-unit-id={unitId}
      data-coverage-status={coverage.status}
    >
      <img src={assetUrl(image.localPath)} alt={image.altRu} width={image.width} height={image.height} loading="lazy" />
      <figcaption>
        <ImageIcon size={15} aria-hidden="true" />
        <span>{image.captionRu}</span>
        <small>{coverage.status === "shared" ? "общая схема темы" : "прямая иллюстрация"}</small>
      </figcaption>
    </figure>
  );
}

function MaterialUnit({
  unitId,
  children
}: {
  unitId: string;
  children: ReactNode;
}) {
  return (
    <div className="material-unit">
      <LearningImageFigure unitId={unitId} compact />
      <div className="material-unit-copy" lang="ru">{children}</div>
    </div>
  );
}

function LanguagePair({
  termEs,
  translationRu,
  meta,
  defaultOpen = true
}: {
  termEs: string;
  translationRu: string;
  meta?: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="language-pair" open={defaultOpen}>
      <summary aria-label={`Показать или скрыть русский перевод для ${termEs}`}>
        <span className="language-pair-es" lang="es">{termEs}</span>
        <span className="language-pair-toggle">ES/RU</span>
      </summary>
      <p lang="ru">{translationRu}</p>
      {meta ? <small>{meta}</small> : null}
    </details>
  );
}

function StatusStrip({ progress }: { progress: StoredProgress }) {
  const wrong = mistakesFromHistory(progress.answers).length;
  const lastAttempt = progress.examAttempts.at(-1);
  return (
    <section className="status-strip" aria-label="Статус набора">
      <div>
        <strong>{data.contentMode.label}</strong>
        <span>Только категория B/CABA. Вопросы не являются официальной базой GCBA.</span>
      </div>
      <div>
        <strong>{data.questions.length}</strong>
        <span>вопросов B, {data.questions.filter((q) => q.image).length} с картинками</span>
      </div>
      <div>
        <strong>{wrong}</strong>
        <span>тем для повторения</span>
      </div>
      <div>
        <strong>{lastAttempt ? `${lastAttempt.score}%` : "нет"}</strong>
        <span>последний пробный экзамен</span>
      </div>
    </section>
  );
}

function QuestionCard({
  question,
  mode,
  onAnswered,
  difficult,
  onToggleDifficult,
  attemptState,
  onAttemptStateChange,
  footerNavigation,
  revealAfterAnswer = true,
  allowRepeatedAnswers = false,
  learningTimer
}: {
  question: Question;
  mode: "learning" | "exam" | "mistakes";
  onAnswered: (answer: ProgressAnswer) => void;
  difficult: boolean;
  onToggleDifficult: () => void;
  attemptState?: QuestionAttemptState;
  onAttemptStateChange?: (state: QuestionAttemptState) => void;
  footerNavigation?: ReactNode;
  revealAfterAnswer?: boolean;
  allowRepeatedAnswers?: boolean;
  learningTimer?: LearningTicketTimerView;
}) {
  const [selected, setSelected] = useState<string | undefined>(attemptState?.selectedAnswerId);
  const [showTranslation, setShowTranslation] = useState(attemptState?.showTranslation ?? false);
  const [showExplanation, setShowExplanation] = useState(attemptState?.showExplanation ?? false);
  const translation = translationByQuestion.get(question.id);
  const explanation = explanationByQuestion.get(question.id);
  const source = sourceById.get(question.sourceId);
  const imageOverlay = question.image ? imageOverlayByQuestion.get(question.id) : undefined;
  const answered = Boolean(selected);
  const correct = selected === question.correctAnswerId;
  const canToggleSupport = mode !== "exam";
  const translationId = `translation-${question.id}`;
  const showImageOverlay = Boolean(canToggleSupport && answered && showExplanation && imageOverlay);
  const showImageOverlayFallback = Boolean(canToggleSupport && answered && showExplanation && question.image && !imageOverlay);

  useEffect(() => {
    setSelected(attemptState?.selectedAnswerId);
    setShowTranslation(attemptState?.showTranslation ?? false);
    setShowExplanation(attemptState?.showExplanation ?? false);
  }, [mode, question.id, attemptState?.selectedAnswerId, attemptState?.showTranslation, attemptState?.showExplanation]);

  function updateAttemptState(nextState: QuestionAttemptState) {
    onAttemptStateChange?.(nextState);
  }

  function selectAnswer(answerId: string) {
    if (answered && !allowRepeatedAnswers) return;
    const nextShowTranslation = canToggleSupport ? true : showTranslation;
    const nextShowExplanation = canToggleSupport ? true : showExplanation;
    setSelected(answerId);
    setShowTranslation(nextShowTranslation);
    setShowExplanation(nextShowExplanation);
    updateAttemptState({
      selectedAnswerId: answerId,
      showTranslation: nextShowTranslation,
      showExplanation: nextShowExplanation
    });
    onAnswered({
      questionId: question.id,
      selectedAnswerId: answerId,
      isCorrect: answerId === question.correctAnswerId,
      answeredAt: new Date().toISOString(),
      mode
    });
  }

  function toggleTranslation() {
    if (!canToggleSupport) return;
    setShowTranslation((value) => {
      const nextValue = !value;
      updateAttemptState({
        selectedAnswerId: selected,
        showTranslation: nextValue,
        showExplanation
      });
      return nextValue;
    });
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleTranslation();
  }

  const officialBlock = (
    <div
      className={canToggleSupport ? "official-block question-toggle" : "official-block"}
      role={canToggleSupport ? "button" : undefined}
      tabIndex={canToggleSupport ? 0 : undefined}
      aria-expanded={canToggleSupport ? showTranslation : undefined}
      aria-controls={canToggleSupport ? translationId : undefined}
      onClick={canToggleSupport ? toggleTranslation : undefined}
      onKeyDown={canToggleSupport ? handleQuestionKeyDown : undefined}
    >
      <span className="block-label">Испанский текст из practice source</span>
      <h2 lang="es">{question.officialTextEs}</h2>
    </div>
  );

  return (
    <article className="question-card" data-testid="question-card">
      <div className="question-meta">
        {mode === "learning" && <span>Билет {question.id}</span>}
        <span>Категория B</span>
        <span>{question.jurisdiction}</span>
        <span>{question.topics.map(topicLabel).join(", ")}</span>
        {mode !== "exam" && <DifficultyIndicator level={question.difficulty} label="Сложность билета" />}
        {mode !== "exam" && question.flags.hasNegationOrException && <span className="warning">есть отрицание/ловушка</span>}
      </div>

      {learningTimer && (
        <div
          className={`learning-timer ${learningTimer.status} ${learningTimer.answeredAfterExpiry ? "after-limit" : ""}`}
          data-testid="learning-ticket-timer"
          aria-label={`Темп билета: осталось ${formatDuration(learningTimer.remainingSeconds)}; ${learningTimerStatusText(learningTimer)}`}
        >
          <div className="learning-timer-main">
            <Timer size={18} aria-hidden="true" />
            <span className="learning-timer-label">Темп билета</span>
            <strong data-testid="learning-ticket-timer-time">{formatDuration(learningTimer.remainingSeconds)}</strong>
            <span className="learning-timer-state">{learningTimerStatusText(learningTimer)}</span>
          </div>
          {(learningTimer.status === "running" || learningTimer.status === "paused") && (
            <button
              type="button"
              className="tool-button timer-toggle"
              onClick={learningTimer.onTogglePause}
              aria-label={learningTimer.status === "running" ? "Поставить таймер билета на паузу" : "Продолжить таймер билета"}
            >
              {learningTimer.status === "running" ? "Пауза" : "Продолжить"}
            </button>
          )}
        </div>
      )}

      {officialBlock}

      {showTranslation && (
        <aside className="support-block translation" id={translationId}>
          <p lang="ru">{translation?.questionTextRu || "Русский перевод для этого вопроса еще не подготовлен. Ориентируйтесь на испанский текст."}</p>
        </aside>
      )}

      {question.image && (
        <QuestionImageFigure
          question={question}
          overlay={imageOverlay}
          showOverlay={showImageOverlay}
          showFallback={showImageOverlayFallback}
        />
      )}

      {canToggleSupport && (
        <div className="actions-row">
          <button
            type="button"
            className="tool-button"
            aria-expanded={showExplanation}
            onClick={() => setShowExplanation((value) => {
              const nextValue = !value;
              updateAttemptState({
                selectedAnswerId: selected,
                showTranslation,
                showExplanation: nextValue
              });
              return nextValue;
            })}
          >
            <BookOpen size={18} aria-hidden="true" /> Пояснение
          </button>
          <button type="button" className={difficult ? "tool-button active" : "tool-button"} onClick={onToggleDifficult}>
            <Flag size={18} aria-hidden="true" /> Сложный
          </button>
        </div>
      )}

      <div className="answers" role="list">
        {question.answers.map((answer) => {
          const isSelected = selected === answer.id;
          const isCorrectAnswer = answer.id === question.correctAnswerId;
          const showState = answered && revealAfterAnswer;
          const translated = translation?.answerTranslations[answer.id];
          return (
            <button
              type="button"
              key={answer.id}
              className={`answer ${showState && isCorrectAnswer ? "correct" : ""} ${showState && isSelected && !isCorrectAnswer ? "incorrect" : ""}`}
              onClick={() => selectAnswer(answer.id)}
            >
              <span lang="es">{answer.officialTextEs}</span>
              {showTranslation && translated && <small lang="ru">{translated}</small>}
            </button>
          );
        })}
      </div>

      {answered && revealAfterAnswer && (
        <div className={correct ? "result correct-text" : "result incorrect-text"} role="status">
          {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          {correct ? "Верно" : "Ошибка"} · правильный ответ: <span lang="es">{question.answers.find((answer) => answer.id === question.correctAnswerId)?.officialTextEs}</span>
        </div>
      )}

      {showExplanation && (
        <aside className="support-block explanation">
          <span className="block-label">Учебное пояснение</span>
          <p lang="ru">{explanation?.textRu || "Пояснение пока не подготовлено для этого вопроса."}</p>
        </aside>
      )}

      {footerNavigation}

      <footer className="source-line">
        Источник: {source?.title || question.sourceId}. Статус вопроса: неофициальная B-практика, нужна внешняя проверка.
      </footer>
    </article>
  );
}

function QuestionFlowNavigation({
  position,
  total,
  onPrevious,
  onNext,
  collectionLabel
}: {
  position: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  collectionLabel: string;
}) {
  const isFirst = position <= 0;
  const isLast = total === 0 || position >= total - 1;

  return (
    <nav className="question-flow-nav" aria-label={`Навигация по ${collectionLabel}`}>
      <button type="button" className="tool-button" onClick={onPrevious} disabled={isFirst} aria-disabled={isFirst}>
        Предыдущий
      </button>
      <span aria-live="polite">
        {total > 0 ? `${position + 1} / ${total}` : "0 / 0"}
      </span>
      <button type="button" className="tool-button" onClick={onNext} disabled={isLast} aria-disabled={isLast}>
        Следующий
      </button>
    </nav>
  );
}

function LearnView({ progress, setProgress }: { progress: StoredProgress; setProgress: (progress: StoredProgress) => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [timerStates, setTimerStates] = useState<Record<string, LearningTicketTimerState>>({});
  const [attemptsByQuestion, setAttemptsByQuestion] = useState<Record<string, QuestionAttemptState>>({});
  const [sessionQuestions] = useState(() => shuffleQuestions(data.questions));
  const normalizedQuery = query.trim();
  const hasActiveSearch = normalizedQuery.length > 0;
  const results = useMemo(() => hasActiveSearch ? searchQuestions(normalizedQuery) : sessionQuestions, [hasActiveSearch, normalizedQuery, sessionQuestions]);
  const hasResults = results.length > 0;
  const currentIndex = results.length ? Math.min(index, results.length - 1) : 0;
  const question = results[currentIndex];
  const difficult = question ? progress.difficultQuestionIds.includes(question.id) : false;
  const timerTargetSeconds = learningTicketTargetSeconds(data.examFormat);
  const currentAttemptState = question ? attemptsByQuestion[question.id] : undefined;
  const restoredTimerState = timerTargetSeconds && currentAttemptState?.selectedAnswerId
    ? completedLearningTimerState(timerTargetSeconds)
    : undefined;
  const currentTimerState = question && timerTargetSeconds
    ? timerStates[question.id] ?? restoredTimerState ?? initialLearningTimerState(timerTargetSeconds)
    : undefined;

  useEffect(() => {
    setIndex(0);
  }, [query]);

  function record(answer: ProgressAnswer) {
    if (!question) return;
    if (timerTargetSeconds) {
      setTimerStates((current) => {
        const state = current[question.id] ?? initialLearningTimerState(timerTargetSeconds);
        return {
          ...current,
          [question.id]: {
            ...state,
            status: "answered",
            answeredAfterExpiry: state.answeredAfterExpiry || state.status === "expired" || state.remainingSeconds <= 0
          }
        };
      });
    }
    const next = { ...progress, answers: [...progress.answers, answer] };
    setProgress(next);
    saveProgress(next);
  }

  function toggleDifficult() {
    if (!question) return;
    const exists = progress.difficultQuestionIds.includes(question.id);
    const next = {
      ...progress,
      difficultQuestionIds: exists ? progress.difficultQuestionIds.filter((id) => id !== question.id) : [...progress.difficultQuestionIds, question.id]
    };
    setProgress(next);
    saveProgress(next);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setIndex(0);
  }

  function toggleCurrentTimer() {
    if (!question || !timerTargetSeconds) return;
    setTimerStates((current) => {
      const state = current[question.id] ?? initialLearningTimerState(timerTargetSeconds);
      if (state.status !== "running" && state.status !== "paused") return current;
      return {
        ...current,
        [question.id]: {
          ...state,
          status: state.status === "running" ? "paused" : "running"
        }
      };
    });
  }

  useEffect(() => {
    if (!question || !timerTargetSeconds) return;
    setTimerStates((current) => {
      if (current[question.id]) return current;
      return {
        ...current,
        [question.id]: currentAttemptState?.selectedAnswerId
          ? completedLearningTimerState(timerTargetSeconds)
          : initialLearningTimerState(timerTargetSeconds)
      };
    });
  }, [question?.id, timerTargetSeconds, currentAttemptState?.selectedAnswerId]);

  useEffect(() => {
    if (!question || !timerTargetSeconds || currentTimerState?.status !== "running") return undefined;
    const timer = window.setInterval(() => {
      setTimerStates((current) => {
        const state = current[question.id];
        if (!state || state.status !== "running") return current;
        if (state.remainingSeconds <= 1) {
          return {
            ...current,
            [question.id]: {
              ...state,
              remainingSeconds: 0,
              status: "expired"
            }
          };
        }
        return {
          ...current,
          [question.id]: {
            ...state,
            remainingSeconds: state.remainingSeconds - 1
          }
        };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [question?.id, timerTargetSeconds, currentTimerState?.status]);

  return (
    <section className="workspace">
      <div className="toolbar">
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Поиск по испанскому, русскому, теме" />
        </label>
      </div>
      {hasResults && question ? (
        <QuestionCard
          key={question.id}
          question={question}
          mode="learning"
          onAnswered={record}
          difficult={difficult}
          onToggleDifficult={toggleDifficult}
          attemptState={attemptsByQuestion[question.id] || emptyAttemptState}
          onAttemptStateChange={(nextState) => setAttemptsByQuestion((current) => ({ ...current, [question.id]: nextState }))}
          learningTimer={currentTimerState ? { ...currentTimerState, onTogglePause: toggleCurrentTimer } : undefined}
          footerNavigation={(
            <QuestionFlowNavigation
              position={currentIndex}
              total={results.length}
              collectionLabel="результатам обучения"
              onPrevious={() => setIndex((value) => Math.max(value - 1, 0))}
              onNext={() => setIndex((value) => Math.min(value + 1, Math.max(results.length - 1, 0)))}
            />
          )}
        />
      ) : (
        <div className="empty-state" role="status">
          <h2>Ничего не найдено</h2>
          <p>
            {hasActiveSearch
              ? "В текущей локальной базе нет вопросов по этому запросу. Измените поиск, чтобы продолжить обучение внутри найденной коллекции."
              : "В локальной базе пока нет доступных вопросов для обучения."}
          </p>
        </div>
      )}
    </section>
  );
}

function ExamView({ progress, setProgress }: { progress: StoredProgress; setProgress: (progress: StoredProgress) => void }) {
  const examQuestions = useMemo(
    () => selectExamSet(data.questions, data.examFormat.questionCount, data.examFormat.questionOrderRule),
    []
  );
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<ProgressAnswer[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(data.examFormat.timeLimitMinutes * 60);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const current = examQuestions[position];

  useEffect(() => {
    if (finished) return undefined;
    const timer = window.setInterval(() => {
      setTimeRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          finish(answers);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [answers, finished]);

  function record(answer: ProgressAnswer) {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    if (position + 1 >= examQuestions.length) finish(nextAnswers);
    else setPosition((value) => value + 1);
  }

  function skipCurrent() {
    if (!current || !data.examFormat.canSkipQuestion) return;
    record({
      questionId: current.id,
      selectedAnswerId: "",
      isCorrect: false,
      answeredAt: new Date().toISOString(),
      mode: "exam"
    });
  }

  function finish(finalAnswers = answers) {
    if (finished) return;
    const finalScore = scorePercent(finalAnswers.filter((answer) => answer.isCorrect).length, examQuestions.length);
    const attempt = {
      id: `exam-${Date.now()}`,
      finishedAt: new Date().toISOString(),
      score: finalScore,
      passed: isPassing(finalScore, data.examFormat.passingScore),
      total: examQuestions.length
    };
    const next = { ...progress, answers: [...progress.answers, ...finalAnswers], examAttempts: [...progress.examAttempts, attempt] };
    setProgress(next);
    saveProgress(next);
    setResultScore(finalScore);
    setFinished(true);
  }

  if (finished) {
    const finalScore = resultScore ?? scorePercent(answers.filter((answer) => answer.isCorrect).length, examQuestions.length);
    return (
      <section className="workspace result-panel">
        <h2>{finalScore >= data.examFormat.passingScore ? "Пробный экзамен сдан" : "Нужно повторить"}</h2>
        <p className="score">{finalScore}%</p>
        <p>Формат: {data.examFormat.questionCount} вопросов, {data.examFormat.timeLimitMinutes} минут, проходной балл {data.examFormat.passingScore}%.</p>
        <p className="muted">Источник формата экзамена GCBA подтвержден, но сами вопросы сейчас помечены как неофициальная B-практика.</p>
      </section>
    );
  }

  return (
    <section className="workspace">
      <div className="exam-bar">
        <span><Timer size={18} /> {formatDuration(timeRemaining)}</span>
        <span>{position + 1} / {examQuestions.length}</span>
        <span>{data.examFormat.status === "defined" ? "Формат defined" : "approximate practice"}</span>
      </div>
      {data.examFormat.canSkipQuestion && (
        <div className="toolbar">
          <button type="button" className="tool-button" onClick={skipCurrent}>
            Пропустить
          </button>
        </div>
      )}
      <QuestionCard key={current.id} question={current} mode="exam" revealAfterAnswer={false} onAnswered={record} difficult={false} onToggleDifficult={() => undefined} />
    </section>
  );
}

function MistakesView({ progress, setProgress }: { progress: StoredProgress; setProgress: (progress: StoredProgress) => void }) {
  const [index, setIndex] = useState(0);
  const [attemptsByQuestion, setAttemptsByQuestion] = useState<Record<string, QuestionAttemptState>>({});
  const mistakes = mistakesFromHistory(progress.answers);
  const currentIndex = mistakes.length ? Math.min(index, mistakes.length - 1) : 0;
  const question = mistakes.length ? data.questions.find((item) => item.id === mistakes[currentIndex]?.questionId) : undefined;

  useEffect(() => {
    setIndex((value) => Math.min(value, Math.max(mistakes.length - 1, 0)));
  }, [mistakes.length]);

  function record(answer: ProgressAnswer) {
    const next = { ...progress, answers: [...progress.answers, answer] };
    setProgress(next);
    saveProgress(next);
  }

  return (
    <section className="workspace split">
      <aside className="side-list">
        <h2>Ошибки</h2>
        {mistakes.length ? mistakes.slice(0, 12).map((mistake) => (
          <button
            type="button"
            className={mistake.questionId === question?.id ? "mistake-link active" : "mistake-link"}
            key={mistake.questionId}
            onClick={() => setIndex(mistakes.findIndex((item) => item.questionId === mistake.questionId))}
          >
            <strong>{mistake.wrong}x</strong>
            <span>{mistake.questionId}</span>
            {questionById.get(mistake.questionId) && <DifficultyIndicator level={questionById.get(mistake.questionId)!.difficulty} compact />}
          </button>
        )) : <p>Ошибок пока нет. Ответьте на пару вопросов в обучении.</p>}
      </aside>
      {question ? (
        <QuestionCard
          key={question.id}
          question={question}
          mode="mistakes"
          onAnswered={record}
          difficult={progress.difficultQuestionIds.includes(question.id)}
          onToggleDifficult={() => undefined}
          attemptState={attemptsByQuestion[question.id] || emptyAttemptState}
          onAttemptStateChange={(nextState) => setAttemptsByQuestion((current) => ({ ...current, [question.id]: nextState }))}
          footerNavigation={(
            <QuestionFlowNavigation
              position={currentIndex}
              total={mistakes.length}
              collectionLabel="ошибкам"
              onPrevious={() => setIndex((value) => Math.max(value - 1, 0))}
              onNext={() => setIndex((value) => Math.min(value + 1, Math.max(mistakes.length - 1, 0)))}
            />
          )}
          allowRepeatedAnswers
        />
      ) : (
        <div className="empty-state" role="status">
          <h2>Ошибок пока нет</h2>
          <p>Здесь появятся только вопросы, на которые вы уже ответили неверно. Сейчас коллекция ошибок пуста.</p>
        </div>
      )}
    </section>
  );
}

function VocabularyView() {
  const [query, setQuery] = useState("");
  const terms = searchVocabulary(query);
  return (
    <section className="workspace">
      <label className="search-box">
        <Search size={18} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar / искать термин" />
      </label>
      <div className="term-grid">
        {terms.map((term) => (
          <article className="term-card" key={term.id}>
            <LearningImageFigure unitId={vocabularyTermUnitId(term.id)} compact />
            <span>{term.category}</span>
            <h3 lang="es">{term.termEs}</h3>
            <p lang="ru">{term.translationRu}</p>
            <small lang="ru">{term.explanationRu}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function GuideView() {
  return (
    <section className="workspace guide-list">
      {data.guide.map((item) => (
        <article className="guide-item" key={item.id}>
          <span>{item.topic} · {item.confidence}</span>
          <h2>{item.title}</h2>
          <p>{item.cabaRuleSummaryRu}</p>
          <p>{item.rfContrastRu}</p>
          <small>{item.disclaimer}</small>
        </article>
      ))}
    </section>
  );
}

function explanationByAnswer(ticket: TopicGuideTicket) {
  return new Map(ticket.answerExplanations.map((item) => [item.answerId, item]));
}

function safeLocalImagePath(question: Question | undefined, ticket: TopicGuideTicket) {
  if (question?.image?.localPath) return question.image.localPath;
  if (ticket.imageLocalPath?.startsWith("content/assets/")) return ticket.imageLocalPath;
  return undefined;
}

function TopicGuideTicketBlock({ ticket }: { ticket: TopicGuideTicket }) {
  const question = questionById.get(ticket.questionId);
  const explanations = explanationByAnswer(ticket);
  const localImagePath = safeLocalImagePath(question, ticket);
  const translation = translationByQuestion.get(ticket.questionId);
  const source = question ? sourceById.get(question.sourceId) : undefined;
  const correctAnswer = question?.answers.find((answer) => answer.id === question.correctAnswerId);

  if (!question) {
    return (
      <article className="materials-ticket missing" data-testid={`materials-ticket-${ticket.questionId}`}>
        <h3>Билет {ticket.questionId}</h3>
        <p>Канонический вопрос не найден. Материал не упал, но этот блок требует проверки данных.</p>
      </article>
    );
  }

  return (
    <article className="materials-ticket" data-testid={`materials-ticket-${ticket.questionId}`}>
      <div className="question-meta">
        <span>Билет {question.id}</span>
        <span>Категория {question.category}</span>
        <span>{question.jurisdiction}</span>
        <DifficultyIndicator level={question.difficulty} label="Сложность билета" />
      </div>
      <div className="official-block">
        <span className="block-label">Испанский текст из canonical question</span>
        <h3 lang="es">{question.officialTextEs}</h3>
      </div>
      {translation ? (
        <aside className="support-block translation materials-translation">
          <span className="block-label">Неофициальный русский перевод</span>
          <p lang="ru">{translation.questionTextRu}</p>
        </aside>
      ) : (
        <aside className="support-block translation materials-translation missing-translation">
          <span className="block-label">Русский перевод</span>
          <p lang="ru">Русский перевод для этого билета еще не подготовлен; сверяйтесь с испанским текстом.</p>
        </aside>
      )}
      {localImagePath && (
        <figure className="question-image materials-image">
          <img src={assetUrl(localImagePath)} alt={question.image?.altEs || `Изображение билета ${question.id}`} />
          <figcaption>
            <ImageIcon size={16} aria-hidden="true" /> Локальное изображение вопроса
          </figcaption>
        </figure>
      )}
      {ticket.sourceConflictNoteRu && (
        <aside className="support-block explanation">
          <span className="block-label">Заметка о старой формулировке</span>
          <p>{ticket.sourceConflictNoteRu}</p>
        </aside>
      )}
      <div className="materials-answers" role="list" aria-label={`Ответы к билету ${question.id}`}>
        {question.answers.map((answer) => {
          const answerExplanation = explanations.get(answer.id);
          const isCorrectAnswer = answer.id === question.correctAnswerId;
          return (
            <div className={isCorrectAnswer ? "material-answer correct" : "material-answer"} role="listitem" key={answer.id}>
              <div>
                <strong lang="es">{answer.officialTextEs}</strong>
                {translation?.answerTranslations[answer.id] && <small className="answer-translation" lang="ru">{translation.answerTranslations[answer.id]}</small>}
                {isCorrectAnswer && <span className="answer-badge">Правильный ответ</span>}
              </div>
              <p lang="ru">{answerExplanation?.explanationRu || "Пояснение для этого варианта пока не связано с материалом."}</p>
            </div>
          );
        })}
      </div>
      <footer className="source-line">
        Источник: {source?.title || question.sourceId}; {sourceStatusLabel(source?.status)}. Правильный ответ: {correctAnswer?.officialTextEs || question.correctAnswerId}.
      </footer>
    </article>
  );
}

function TopicGuideView() {
  const topics = data.topicStudyGuide.topics;
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id);
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) || topics[0];

  if (!selectedTopic) {
    return (
      <section className="workspace">
        <h2>Материалы</h2>
        <p>Учебные темы пока не найдены в локальном topic guide.</p>
      </section>
    );
  }

  return (
    <section className="materials-view" aria-labelledby="materials-title">
      <div className="materials-header">
        <div>
          <p className="eyebrow">Материалы</p>
          <h2 id="materials-title">{data.topicStudyGuide.titleRu}</h2>
          <p>{data.topicStudyGuide.disclaimer}</p>
        </div>
        <div className="materials-status" aria-label="Статус учебных материалов">
          <span>{guideStatusLabel(data.topicStudyGuide.status)}</span>
          <span>{guideContentStatusLabel(data.topicStudyGuide.contentStatus)}</span>
          <span>{practiceContentStatusLabel()}</span>
        </div>
      </div>

      <div className="materials-layout">
        <aside className="materials-topic-list" aria-label="Темы материалов">
          <h3>Темы</h3>
          {topics.map((topic, index) => (
            <button
              type="button"
              key={topic.id}
              className={topic.id === selectedTopic.id ? "active" : ""}
              onClick={() => setSelectedTopicId(topic.id)}
            >
              <span className="topic-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="topic-button-content">
                <span>{topic.titleRu}</span>
                <DifficultyIndicator level={topic.difficulty} compact label="Сложность темы" />
              </span>
            </button>
          ))}
        </aside>

        <article className="materials-detail">
          <div className="materials-topic-heading">
            <div>
              <span className="block-label">Выбранная тема</span>
              <h2>{selectedTopic.titleRu}</h2>
              <MaterialUnit unitId={topicSummaryUnitId(selectedTopic.id)}>
                <p>{selectedTopic.summaryRu}</p>
              </MaterialUnit>
            </div>
            <div className="materials-topic-badges">
              <span>{guideStatusLabel(selectedTopic.status)}</span>
              <DifficultyIndicator level={selectedTopic.difficulty} label="Сложность темы" />
            </div>
          </div>

          <section className="materials-section" aria-labelledby="learning-material-title">
            <h3 id="learning-material-title">Короткий материал</h3>
            {selectedTopic.learningMaterialRu.map((paragraph, index) => (
              <MaterialUnit unitId={topicLearningUnitId(selectedTopic.id, index)} key={paragraph}>
                <p>{paragraph}</p>
              </MaterialUnit>
            ))}
          </section>

          {selectedTopic.practicalReasoningRu?.length ? (
            <section className="materials-section" aria-labelledby="practical-reasoning-title">
              <h3 id="practical-reasoning-title">Практическая логика</h3>
              {selectedTopic.practicalReasoningRu.map((paragraph, index) => (
                <MaterialUnit unitId={topicPracticalUnitId(selectedTopic.id, index)} key={paragraph}>
                  <p>{paragraph}</p>
                </MaterialUnit>
              ))}
            </section>
          ) : null}

          <section className="materials-section" aria-labelledby="terms-title">
            <h3 id="terms-title">Испанские термины</h3>
            <div className="materials-term-grid">
              {selectedTopic.spanishTerms.map((term) => (
                <div className="materials-term" key={term.id}>
                  <LearningImageFigure unitId={topicTermUnitId(selectedTopic.id, term.id)} compact />
                  <LanguagePair
                    termEs={term.termEs}
                    translationRu={term.translationRu}
                    meta={<>Связанные билеты: {term.sourceQuestionIds.join(", ")}</>}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="materials-section" aria-labelledby="tickets-title">
            <h3 id="tickets-title">Билеты темы</h3>
            <div className="materials-ticket-list">
              {selectedTopic.tickets.map((ticket) => (
                <TopicGuideTicketBlock ticket={ticket} key={ticket.questionId} />
              ))}
            </div>
          </section>

          {selectedTopic.trapNotes?.length ? (
            <section className="materials-section" aria-labelledby="trap-notes-title">
              <h3 id="trap-notes-title">Ловушки темы</h3>
              <div className="trap-list">
                {selectedTopic.trapNotes.map((note, index) => (
                  <div className="trap-note" key={note.id || `${selectedTopic.id}-trap-${index}`}>
                    <LearningImageFigure unitId={topicTrapUnitId(selectedTopic.id, note.id, index)} compact />
                    <p lang="ru">{note.textRu}</p>
                    {note.sourceQuestionIds?.length ? <small>Связанные билеты: {note.sourceQuestionIds.join(", ")}</small> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </div>
    </section>
  );
}

function ProcessGuideView() {
  const guide = data.cabaExamProcessGuide;
  const sourceByProcessId = new Map(guide.sources.map((source) => [source.id, source]));
  const stepSections = guide.sections.filter((section) => section.calloutType === "required_step");
  const supportingSections = guide.sections.filter((section) => section.calloutType !== "required_step");

  function renderSources(section: ProcessGuideSection) {
    return (
      <div className="process-source-list" aria-label={`Источники для ${section.titleRu}`}>
        {section.sourceIds.map((sourceId) => {
          const source = sourceByProcessId.get(sourceId);
          if (!source) return null;
          return (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
              <span>{source.title}</span>
              <small>Проверено {source.checkedAt} · {processSourceStatusLabel(source.currentnessStatus)}</small>
            </a>
          );
        })}
      </div>
    );
  }

  function renderSection(section: ProcessGuideSection, index?: number) {
    return (
      <article className="process-section" key={section.id} data-testid={`process-section-${section.id}`}>
        <div className="process-section-heading">
          <div>
            <span className="block-label">{index === undefined ? processCalloutLabel(section) : `Шаг ${index + 1}`}</span>
            <h3>{section.titleRu}</h3>
          </div>
          <span>{processCalloutLabel(section)}</span>
        </div>
        {section.summaryRu && <p className="muted">{section.summaryRu}</p>}
        {section.bodyRu.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.spanishTerms?.length ? (
          <div className="process-term-row" aria-label={`Испанские термины для ${section.titleRu}`}>
            {section.spanishTerms.map((term) => (
              <span key={term}>{term}</span>
            ))}
          </div>
        ) : null}
        {section.volatilityWarningRu && (
          <aside className="support-block process-warning">
            <span className="block-label">Волатильная информация</span>
            <p>{section.volatilityWarningRu}</p>
          </aside>
        )}
        {renderSources(section)}
      </article>
    );
  }

  return (
    <section className="process-view" aria-labelledby="process-title">
      <header className="materials-header process-header">
        <div>
          <p className="eyebrow">Процесс</p>
          <h2 id="process-title">{guide.titleRu}</h2>
          <p>{guide.primaryScope.audienceRu}</p>
        </div>
        <div className="materials-status" aria-label="Статус процессного гайда">
          <span>{guideContentStatusLabel(guide.contentStatus)}</span>
          <span>Проверено {guide.lastReviewedAt}</span>
          <span>{guide.primaryScope.jurisdiction} · {guide.primaryScope.category} · {guide.primaryScope.procedure}</span>
        </div>
      </header>

      <div className="process-alerts">
        <aside className="support-block">
          <span className="block-label">Неофициальная русская поддержка</span>
          <p>{guide.disclaimerRu}</p>
          <p>{guide.officialActionWarningRu}</p>
        </aside>
        <aside className="support-block process-warning">
          <span className="block-label">Проверяйте перед действием</span>
          <p>{guide.volatilityWarningRu}</p>
        </aside>
      </div>

      <section className="process-grid" aria-labelledby="process-steps-title">
        <div className="process-main">
          <div className="materials-topic-heading">
            <div>
              <span className="block-label">B1/private car Otorgamiento</span>
              <h2 id="process-steps-title">Официальная последовательность</h2>
              <p>Сжатая русская карта того, что обычно происходит до и во время exam day.</p>
            </div>
          </div>
          <div className="process-section-list">
            {stepSections.map((section, index) => renderSection(section, index))}
          </div>
        </div>

        <aside className="process-aside">
          <section className="process-links" aria-labelledby="official-links-title">
            <h3 id="official-links-title"><ExternalLink size={18} aria-hidden="true" /> Официальные ссылки</h3>
            {guide.officialLinks.map((group) => (
              <div className="process-link-group" key={group.id}>
                <h4>{group.titleRu}</h4>
                {group.links.map((link) => {
                  const source = sourceByProcessId.get(link.sourceId);
                  return (
                    <a href={link.url} target="_blank" rel="noreferrer" key={`${group.id}-${link.sourceId}`}>
                      <span>{link.labelRu}</span>
                      {source && <small>{source.officialOwner} · проверено {source.checkedAt}</small>}
                    </a>
                  );
                })}
              </div>
            ))}
          </section>
        </aside>
      </section>

      <section className="materials-section" aria-labelledby="supporting-process-title">
        <h2 id="supporting-process-title">Соседние пути и предупреждения</h2>
        <div className="process-support-grid">
          {supportingSections.map((section) => renderSection(section))}
        </div>
      </section>

      <section className="materials-section" aria-labelledby="process-glossary-title">
        <h2 id="process-glossary-title">Испанские термины процесса</h2>
        <div className="process-glossary-grid">
          {guide.glossary.map((term) => (
            <article className="materials-term process-glossary-term" key={term.id}>
              <strong>{term.termEs}</strong>
              <p>{term.translationRu}</p>
              <small>{term.explanationRu}</small>
            </article>
          ))}
        </div>
      </section>

      <footer className="source-line process-footnote">
        <FileText size={16} aria-hidden="true" /> Изображения не включены: для первого slice не было необходимости добавлять официальные изображения; так сохраняется offline/local-first режим без риска устаревших или персональных данных.
      </footer>
    </section>
  );
}

function manualPageSearchText(page: ManualPage) {
  return normalizeSearchText(
    [
      page.pageNumber,
      page.translation.headingRu,
      page.translation.officialLabel,
      page.translation.fullTranslationRu,
      page.translation.sourceTextEs,
      page.translation.headingPathEs.join(" "),
      page.translation.chunkProvenance?.chunkId ?? "",
      page.sourceTrace.officialDocumentId
    ].join(" ")
  );
}

const DEFAULT_MANUAL_PAGE = 14;

function flattenManualNavigation(entries: ManualNavigationEntry[]): ManualNavigationEntry[] {
  return entries.flatMap((entry) => [entry, ...flattenManualNavigation(entry.children ?? [])]);
}

function manualExactStartNavigationEntryForPage(entries: ManualNavigationEntry[], pageNumber: number): ManualNavigationEntry | undefined {
  for (const entry of entries) {
    if (pageNumber < entry.startPage || pageNumber > entry.endPage) continue;
    const childExactStart = manualExactStartNavigationEntryForPage(entry.children ?? [], pageNumber);
    if (childExactStart) return childExactStart;
    if (entry.startPage === pageNumber) return entry;
  }
  return undefined;
}

function manualNavigationEntryForPage(entries: ManualNavigationEntry[], pageNumber: number, deepest = false): ManualNavigationEntry | undefined {
  if (deepest) {
    const exactStartEntry = manualExactStartNavigationEntryForPage(entries, pageNumber);
    if (exactStartEntry) return exactStartEntry;
  }
  for (const entry of entries) {
    if (pageNumber < entry.startPage || pageNumber > entry.endPage) continue;
    if (deepest) return manualNavigationEntryForPage(entry.children ?? [], pageNumber, true) ?? entry;
    return entry;
  }
  return undefined;
}

function manualNavigationEntryCoversPage(entry: ManualNavigationEntry | undefined, pageNumber: number) {
  return Boolean(entry && pageNumber >= entry.startPage && pageNumber <= entry.endPage);
}

function manualNavigationEntryForDestinationPage(
  entries: ManualNavigationEntry[],
  pageNumber: number,
  options: { requestedEntry?: ManualNavigationEntry; currentEntry?: ManualNavigationEntry } = {}
) {
  if (manualNavigationEntryCoversPage(options.requestedEntry, pageNumber)) return options.requestedEntry;

  const exactStartEntry = manualExactStartNavigationEntryForPage(entries, pageNumber);
  if (manualNavigationEntryCoversPage(options.currentEntry, pageNumber)) {
    return options.currentEntry?.startPage === pageNumber ? options.currentEntry : exactStartEntry ?? options.currentEntry;
  }

  return exactStartEntry ?? manualNavigationEntryForPage(entries, pageNumber, true);
}

function uniqueManualMatchingPages(entries: ManualSearchIndexEntry[]) {
  const seenPageNumbers = new Set<number>();
  return entries.flatMap((entry) => {
    if (seenPageNumbers.has(entry.page.pageNumber)) return [];
    seenPageNumbers.add(entry.page.pageNumber);
    return [entry.page];
  });
}

function manualQueryPageNumber(query: string) {
  return /^\d+$/u.test(query) ? Number(query) : undefined;
}

function manualBoundsStyle(bounds: ManualPageBounds): CSSProperties {
  return {
    left: `${bounds.x * 100}%`,
    top: `${bounds.y * 100}%`,
    width: `${bounds.width * 100}%`,
    height: `${bounds.height * 100}%`
  };
}

function pandemiaGeometryStyle(geometry: PandemiaVialGeometry, frame: PandemiaVialGeometry = pandemiaVialSection.contentFrame): CSSProperties {
  return {
    left: `${((geometry.x - frame.x) / frame.width) * 100}%`,
    top: `${((geometry.y - frame.y) / frame.height) * 100}%`,
    width: `${(geometry.width / frame.width) * 100}%`,
    height: `${(geometry.height / frame.height) * 100}%`
  };
}

const pandemiaPagePreviewWidth = 960;
const pandemiaInfographicFrame: PandemiaVialGeometry = { x: 336, y: 602, width: 520, height: 612 };
const defaultIntroductionEntry = introductionNavigation[0];

const pandemiaNativeShapes: Array<{
  id: string;
  kind: "blue-strip" | "blue-cap" | "gray-panel" | "circle-stat";
  geometry: PandemiaVialGeometry;
}> = [
  { id: "airplane-strip-panel", kind: "blue-strip", geometry: { x: 386, y: 678, width: 214, height: 31 } },
  { id: "airplane-strip-cap", kind: "blue-cap", geometry: { x: 438, y: 660, width: 94, height: 49 } },
  { id: "airplane-card-panel", kind: "gray-panel", geometry: { x: 386, y: 708, width: 214, height: 58 } },
  { id: "stadium-strip-panel", kind: "blue-strip", geometry: { x: 620, y: 678, width: 214, height: 31 } },
  { id: "stadium-strip-cap", kind: "blue-cap", geometry: { x: 674, y: 660, width: 94, height: 49 } },
  { id: "stadium-card-panel", kind: "gray-panel", geometry: { x: 620, y: 708, width: 214, height: 58 } },
  { id: "fatalities-panel", kind: "gray-panel", geometry: { x: 520, y: 833, width: 266, height: 55 } },
  { id: "motorcyclists-circle", kind: "circle-stat", geometry: { x: 414, y: 890, width: 118, height: 118 } },
  { id: "pedestrians-circle", kind: "circle-stat", geometry: { x: 536, y: 890, width: 118, height: 118 } },
  { id: "car-occupants-circle", kind: "circle-stat", geometry: { x: 658, y: 890, width: 118, height: 118 } },
  { id: "male-victims-panel", kind: "gray-panel", geometry: { x: 552, y: 1020, width: 234, height: 58 } },
  { id: "age-range-panel", kind: "gray-panel", geometry: { x: 552, y: 1110, width: 234, height: 56 } }
];

function introductionEntryForHash(hash: string) {
  return introductionNavigation.find((entry) => entry.routeHash === hash);
}

function introductionEntryById(id: string) {
  return introductionNavigation.find((entry) => entry.id === id) ?? defaultIntroductionEntry;
}

function introductionRouteUrl(routeHash: string) {
  const url = new URL(window.location.href);
  url.searchParams.delete("legacyManual");
  url.hash = routeHash;
  return `${url.pathname}${url.search}${url.hash}`;
}

function nonIntroductionRouteUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("legacyManual");
  url.hash = "";
  return `${url.pathname}${url.search}`;
}

function introductionArticleById(id: string) {
  return introductionArticleSections.find((section) => section.id === id);
}

function artworkAssetById(assets: IntroductionSourceArtworkAsset[], id: string) {
  return assets.find((asset) => asset.id === id);
}

function SourceArtworkImage({
  asset,
  className
}: {
  asset?: IntroductionSourceArtworkAsset;
  className: string;
}) {
  if (!asset) return null;
  return (
    <img
      className={className}
      src={assetUrl(asset.localPath)}
      alt=""
      data-testid="intro-source-artwork"
      data-artwork-id={asset.id}
      data-source-page={asset.sourcePage}
      data-source-region-unit={asset.sourceRegionUnit}
      data-source-render-scale={asset.sourceRenderScale}
      data-visible-spanish={asset.visibleSpanish}
      data-cleanup-status={asset.cleanupStatus}
      data-fidelity-role={asset.fidelityRole}
      aria-hidden="true"
      draggable={false}
    />
  );
}

function PandemiaVialPrototypeView() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const currentStage = stage;

    function alignReadableMobilePreview() {
      currentStage.scrollLeft = 0;
    }

    alignReadableMobilePreview();
    const observer = new ResizeObserver(alignReadableMobilePreview);
    observer.observe(currentStage);
    return () => observer.disconnect();
  }, []);

  function renderSegment(segment: (typeof pandemiaVialSection.segments)[number]) {
    const isResponsiveProse = segment.role === "heading" || segment.role === "intro" || segment.role === "body";
    const className = [
      "pandemia-segment",
      `pandemia-segment-${segment.role}`,
      isResponsiveProse && segment.role !== "heading" ? "intro-doc-block" : undefined
    ].filter(Boolean).join(" ");
    const style = isResponsiveProse ? undefined : pandemiaGeometryStyle(segment.geometry, pandemiaInfographicFrame);
    const commonProps = {
      key: segment.id,
      className,
      style,
      "data-testid": "pandemia-segment",
      "data-segment-id": segment.id,
      "data-segment-role": segment.role,
      "data-prose-role": isResponsiveProse ? "responsive" : undefined,
      title: segment.fitNote
    };

    if (segment.role === "heading") {
      return <h2 id="pandemia-vial-title" {...commonProps}>{segment.textRu}</h2>;
    }
    if (segment.role === "context-label") {
      return <h3 {...commonProps}>{segment.textRu}</h3>;
    }
    return <p {...commonProps}>{segment.textRu}</p>;
  }

  const responsiveProseSegments = pandemiaVialSection.segments.filter((segment) =>
    segment.role === "heading" || segment.role === "intro" || segment.role === "body"
  );
  const headingSegment = responsiveProseSegments.find((segment) => segment.role === "heading");
  const introSegments = responsiveProseSegments.filter((segment) => segment.role === "intro");
  const bodySegments = responsiveProseSegments.filter((segment) => segment.role === "body");
  const infographicSegments = pandemiaVialSection.segments.filter((segment) =>
    segment.role !== "heading" && segment.role !== "intro" && segment.role !== "body"
  );

  return (
    <article className="intro-document pandemia-prototype" aria-labelledby="pandemia-vial-title" data-testid="pandemia-prototype" data-intro-section-id="intro-road-pandemic">
      <header className="intro-document-header">
        <h2 id="pandemia-vial-title">
          <span
            className="pandemia-segment"
            data-testid="pandemia-segment"
            data-segment-id={headingSegment?.id ?? "heading"}
            data-segment-role="heading"
            data-prose-role="responsive"
            title={headingSegment?.fitNote}
          >
            {headingSegment?.textRu ?? "Дорожная пандемия"}
          </span>
        </h2>
      </header>
      <div className="intro-document-flow">
        <div className="pandemia-prose pandemia-prose-intro" data-testid="pandemia-responsive-prose">
          {introSegments.map(renderSegment)}
        </div>
        <div className="pandemia-stage-scroll" data-testid="pandemia-stage-scroll" ref={stageRef}>
          <article
            className="pandemia-page pandemia-native-page"
            style={{
              aspectRatio: `${pandemiaInfographicFrame.width} / ${pandemiaInfographicFrame.height}`,
              width: pandemiaPagePreviewWidth
            }}
            aria-label="Инфографика раздела Дорожная пандемия - нативная русская реконструкция фрагмента GCBA manual page 15"
            data-rendering="native-html-css-svg"
            data-testid="pandemia-page"
          >
            <div className="pandemia-native-layer" data-testid="pandemia-native-layer">
              {pandemiaNativeShapes.map((shape) => (
                <span
                  key={shape.id}
                  className={`pandemia-native-shape pandemia-native-shape-${shape.kind}`}
                  style={pandemiaGeometryStyle(shape.geometry, pandemiaInfographicFrame)}
                  data-testid="pandemia-native-shape"
                  data-shape-id={shape.id}
                  aria-hidden="true"
                />
              ))}
              {pandemiaVialSection.assets.map((asset) => (
                <img
                  key={asset.id}
                  className={`pandemia-crop-asset pandemia-crop-asset-${asset.id}`}
                  src={assetUrl(asset.localPath)}
                  alt=""
                  style={pandemiaGeometryStyle(asset.geometry, pandemiaInfographicFrame)}
                  data-testid="pandemia-crop-asset"
                  data-asset-id={asset.id}
                  data-asset-kind={asset.kind}
                  data-cleanup-status={asset.cleanupStatus}
                  data-male-count={asset.pictogramSemantics?.maleCount}
                  data-female-count={asset.pictogramSemantics?.femaleCount}
                  data-total-count={asset.pictogramSemantics?.totalCount}
                  data-male-signature={asset.pictogramSemantics?.maleSignature}
                  data-female-signature={asset.pictogramSemantics?.femaleSignature}
                  data-male-pictograms-identical={asset.pictogramSemantics?.malePictogramsIdentical}
                  aria-hidden="true"
                  draggable={false}
                />
              ))}
            </div>
            <div className="pandemia-text-layer" data-testid="pandemia-text-layer">
              {infographicSegments.map(renderSegment)}
            </div>
          </article>
        </div>
        <div className="pandemia-prose pandemia-prose-conclusion" data-testid="pandemia-responsive-prose">
          {bodySegments.map(renderSegment)}
        </div>
      </div>
    </article>
  );
}

function IntroductionArticleBlockView({ block }: { block: IntroductionArticleBlock }) {
  if (block.kind === "list") {
    return (
      <section className="intro-doc-block intro-doc-list" data-testid="intro-article-block" data-block-kind={block.kind} data-block-id={block.id}>
        {block.titleRu && <h3>{block.titleRu}</h3>}
        <ul>
          {block.itemsRu.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.kind === "risk-factors") {
    return (
      <section className="intro-doc-block intro-risk-panel" data-testid="intro-article-block" data-block-kind={block.kind} data-block-id={block.id}>
        <div className="intro-risk-heading-row">
          <h3>{block.headingRu}</h3>
          <p>Риск возникает из взаимодействия этих трех факторов.</p>
        </div>
        <div className="intro-risk-list">
          {block.factors.map((factor) => (
            <article key={factor.id} className={factor.emphasis === "warning" ? "intro-risk-card warning" : "intro-risk-card"} data-risk-id={factor.id}>
              <span className="intro-risk-lobe" aria-hidden="true">
                <SourceArtworkImage asset={artworkAssetById(block.artworkAssets, factor.iconAssetId)} className="intro-risk-symbol" />
              </span>
              <div>
                <h4>{factor.titleRu}</h4>
                <p>{factor.textRu}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="intro-recommendation">
          <strong>Рекомендации</strong>
          <p>{block.recommendationRu}</p>
        </div>
      </section>
    );
  }

  if (block.kind === "consequence-diagram") {
    return (
      <section className="intro-doc-block intro-consequence" data-testid="intro-article-block" data-block-kind={block.kind} data-block-id={block.id}>
        <h3>{block.headingRu}</h3>
        <div className="intro-consequence-diagram" data-testid="intro-consequence-diagram">
          <SourceArtworkImage asset={block.backgroundAsset} className="intro-consequence-background" />
          {block.groups.map((group) => (
            <article key={group.id} className={group.tone === "dark" ? "intro-consequence-card dark" : "intro-consequence-card"} data-consequence-id={group.id}>
              <h4>{group.titleRu}</h4>
              <ul>
                {group.itemsRu.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
          <div className="intro-consequence-center">
            {block.centerRu.split(" ").map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (block.kind === "work-axes") {
    return (
      <section className="intro-doc-block intro-work-axes" data-testid="intro-article-block" data-block-kind={block.kind} data-block-id={block.id}>
        <h3>{block.headingRu}</h3>
        <div className="intro-axis-grid">
          {block.axes.map((axis) => (
            <article key={axis.id} className="intro-axis-card" data-axis-id={axis.id}>
              <h4>{axis.titleRu}</h4>
              <span className="intro-axis-circle" aria-hidden="true">
                <SourceArtworkImage asset={artworkAssetById(block.artworkAssets, axis.iconAssetId)} className="intro-axis-symbol" />
              </span>
              <p>{axis.textRu}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.kind === "photo-quote") {
    return (
      <figure className="intro-photo-quote" data-testid="intro-article-block" data-block-kind={block.kind} data-block-id={block.id}>
        <img src={assetUrl(block.image.localPath)} alt={block.image.altRu} data-testid="intro-photo-crop" data-cleanup-status={block.image.cleanupStatus} />
        <blockquote>{block.quoteRu}</blockquote>
      </figure>
    );
  }

  const Tag = block.kind === "quote" ? "blockquote" : "p";
  return (
    <Tag
      className={`intro-doc-block intro-doc-${block.kind}`}
      data-testid="intro-article-block"
      data-block-kind={block.kind}
      data-block-id={block.id}
    >
      {block.textRu}
    </Tag>
  );
}

function IntroductionArticleView({ section }: { section: IntroductionArticleSection }) {
  return (
    <article className="intro-document" aria-labelledby={`${section.id}-title`} data-testid="intro-article" data-intro-section-id={section.id}>
      <header className="intro-document-header">
        <h2 id={`${section.id}-title`}>{section.titleRu}</h2>
      </header>
      <div className="intro-document-flow">
        {section.blocks.map((block) => (
          <IntroductionArticleBlockView key={block.id} block={block} />
        ))}
      </div>
    </article>
  );
}

function ManualGuidePageContentView({ content }: { content: ManualGuidePageContent }) {
  return (
    <article className="intro-document manual-guide-page" aria-labelledby={`${content.pageId}-title`} data-testid="manual-guide-page" data-manual-page-id={content.pageId}>
      <header className="intro-document-header">
        <p className="eyebrow">Страница {content.sourcePage}</p>
        <h2 id={`${content.pageId}-title`}>{content.titleRu}</h2>
      </header>
      <div className="intro-document-flow">
        {content.blocks.map((block) => {
          if (block.kind === "list") {
            return (
              <section key={block.id} className="intro-doc-block intro-doc-list" data-testid="manual-guide-page-block" data-block-kind={block.kind} data-block-id={block.id}>
                {block.titleRu && <h3>{block.titleRu}</h3>}
                <ul>
                  {block.itemsRu.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            );
          }
          if (block.kind === "source-artwork") {
            return (
              <figure key={block.id} className="manual-guide-source-artwork" data-testid="manual-guide-page-block" data-block-kind={block.kind} data-block-id={block.id}>
                {block.titleRu && <h3>{block.titleRu}</h3>}
                <img src={assetUrl(block.assetPath)} alt={block.altRu} data-visible-spanish={block.visibleSpanish} data-cleanup-status={block.cleanupStatus} />
                {block.captionRu && <figcaption>{block.captionRu}</figcaption>}
              </figure>
            );
          }

          const Tag = block.kind === "quote" ? "blockquote" : "p";
          return (
            <Tag
              key={block.id}
              className={`intro-doc-block intro-doc-${block.kind}`}
              data-testid="manual-guide-page-block"
              data-block-kind={block.kind}
              data-block-id={block.id}
            >
              {block.textRu}
            </Tag>
          );
        })}
      </div>
    </article>
  );
}

function manualGuidePageIsAvailable(page: ManualGuidePageEntry) {
  return page.status === "implemented" && manualGuidePageContentById.has(page.id);
}

function IntroductionSectionsView({
  selectedEntry,
  onSelectEntry,
  selectedManualPage,
  onSelectManualPage
}: {
  selectedEntry: IntroductionNavigationEntry;
  onSelectEntry: (entry: IntroductionNavigationEntry) => void;
  selectedManualPage?: ManualGuidePageEntry;
  onSelectManualPage: (page: ManualGuidePageEntry) => void;
}) {
  const selectedArticle = selectedEntry.renderer === "article" ? introductionArticleById(selectedEntry.id) : undefined;
  const selectedManualPageContent = selectedManualPage ? manualGuidePageContentById.get(selectedManualPage.id) : undefined;
  const activeGroupId = manualGuideNavigation.find((entry) =>
    entry.children?.some((child) => child.introductionRouteId === selectedEntry.id || child.pages?.some((page) => page.id === selectedManualPage?.id)) ||
    entry.pages?.some((page) => page.id === selectedManualPage?.id)
  )?.id;
  const activeChildId = selectedManualPage?.id ?? selectedEntry.id;

  function renderManualPageButton(page: ManualGuidePageEntry) {
    const isAvailable = manualGuidePageIsAvailable(page);
    const isActivePage = selectedManualPage?.id === page.id;
    const pageStatusLabel = isAvailable ? "готово" : "ожидает PR";
    return (
      <button
        key={page.id}
        type="button"
        className={isActivePage ? "manual-guide-page-button active" : "manual-guide-page-button"}
        disabled={!isAvailable}
        aria-disabled={!isAvailable}
        aria-current={isActivePage ? "page" : undefined}
        aria-label={`${page.labelRu}: ${pageStatusLabel}`}
        onClick={() => isAvailable && onSelectManualPage(page)}
        data-testid={`manual-guide-pending-${page.id}`}
        data-manual-page-id={page.id}
        data-route-hash={page.routeHash}
        data-source-page={page.sourcePage}
        data-reference-asset={page.source.referenceAsset}
        data-content-module-path={page.pageContentModulePath}
        data-source-region-metadata-status={page.sourceRegionMetadataStatus}
        data-visual-evidence-status={page.visualEvidenceStatus}
        data-status={page.status}
      >
        <span>{page.labelRu}</span>
        <small>{pageStatusLabel}</small>
      </button>
    );
  }

  return (
    <section className="introduction-reader" aria-labelledby="introduction-reader-title" data-testid="introduction-reader">
      <header className="materials-header introduction-header">
        <div>
          <p className="eyebrow">Интерактивное руководство</p>
          <h2 id="introduction-reader-title">Руководство</h2>
        </div>
      </header>

      <div className="manual-guide-shell" data-testid="manual-guide-shell">
        <nav
          className="manual-guide-nav"
          aria-label="Оглавление руководства"
          data-testid="manual-guide-nav"
          data-active-group-id={activeGroupId}
          data-active-child-id={activeChildId}
        >
          {manualGuideNavigation.map((entry) => {
            const isActiveGroup = entry.id === activeGroupId;
            return (
              <details
                key={entry.id}
                className={isActiveGroup ? "manual-guide-group active" : "manual-guide-group"}
                open={isActiveGroup || entry.status === "active"}
                data-guide-entry-id={entry.id}
                data-source-title-es={entry.sourceTitleEs}
                data-source-page={entry.sourcePage}
                data-status={entry.status}
              >
                <summary aria-current={isActiveGroup ? "true" : undefined}>
                  <span>{entry.labelRu}</span>
                  {entry.status === "pending" && <small>позже</small>}
                </summary>
                {entry.pages && (
                  <div className="manual-guide-pages" role="list" aria-label={`${entry.labelRu}: страницы`}>
                    {entry.pages.map((page) => (
                      <div key={page.id} role="listitem" data-testid={`manual-guide-page-item-${page.id}`}>
                        {renderManualPageButton(page)}
                      </div>
                    ))}
                  </div>
                )}
                {entry.children && (
                  <div className="manual-guide-children" role="list">
                    {entry.children.map((child) => {
                      const introEntry = child.introductionRouteId ? introductionEntryById(child.introductionRouteId) : undefined;
                      const isActiveChild = child.introductionRouteId === selectedEntry.id;
                      return (
                        <div
                          key={child.id}
                          role="listitem"
                          data-testid={child.introductionRouteId ? `manual-guide-route-item-${child.introductionRouteId}` : `manual-guide-pending-item-${child.id}`}
                        >
                          <button
                            type="button"
                            className={isActiveChild ? "active" : ""}
                            disabled={child.status === "pending" || !introEntry}
                            aria-disabled={child.status === "pending" || !introEntry}
                            aria-current={isActiveChild ? "page" : undefined}
                            aria-label={child.labelRu}
                            onClick={() => introEntry && onSelectEntry(introEntry)}
                            data-testid={child.introductionRouteId ? `intro-route-${child.introductionRouteId}` : `manual-guide-pending-${child.id}`}
                            data-route-hash={child.routeHash}
                            data-source-title-es={child.sourceTitleEs}
                            data-source-page={child.sourcePage}
                            data-status={child.status}
                          >
                            <span>{child.labelRu}</span>
                            {child.status === "pending" && <small>ожидает</small>}
                          </button>
                          {child.pages && (
                            <div className="manual-guide-pages" role="list" aria-label={`${child.labelRu}: страницы`}>
                              {child.pages.map((page) => (
                                <div key={page.id} role="listitem" data-testid={`manual-guide-page-item-${page.id}`}>
                                  {renderManualPageButton(page)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </details>
            );
          })}
        </nav>

        <div className="manual-guide-content" data-testid="manual-guide-content">
          {selectedManualPageContent && <ManualGuidePageContentView content={selectedManualPageContent} />}
          {!selectedManualPageContent && selectedEntry.renderer === "pandemia" && <PandemiaVialPrototypeView />}
          {!selectedManualPageContent && selectedEntry.renderer === "article" && selectedArticle && <IntroductionArticleView section={selectedArticle} />}
        </div>
      </div>
    </section>
  );
}

function manualDisplayText(block: ManualLayoutBlock) {
  return block.type === "heading" ? block.textRu.replace(/^#+\s*/u, "") : block.textRu;
}

function ManualRussianPageCanvas({
  page,
  layout,
  imageLoadFailed,
  onImageError
}: {
  page: ManualPage;
  layout: ManualPageLayout;
  imageLoadFailed: boolean;
  onImageError: () => void;
}) {
  return (
    <div
      className={`manual-document-page manual-layout-${layout.layoutKind}`}
      style={{ aspectRatio: `${layout.canvas.width} / ${layout.canvas.height}` }}
      data-testid="manual-page-canvas"
      aria-label={`Русская веб-страница ${page.pageNumber} из ${layout.canvas.width} на ${layout.canvas.height}`}
    >
      {imageLoadFailed ? (
        <div className="manual-image-error" role="alert">
          Локальная визуальная основа страницы не загрузилась: {layout.visualBase.localPath}
        </div>
      ) : (
        <img
          className="manual-page-base"
          data-testid="manual-page-local-visual"
          src={assetUrl(layout.visualBase.localPath)}
          width={layout.visualBase.width}
          height={layout.visualBase.height}
          alt=""
          aria-hidden="true"
          onError={onImageError}
        />
      )}
      {layout.visualRegions.map((region) => (
        <div
          key={region.id}
          className="manual-preserved-visual-region"
          data-testid="manual-preserved-visual-region"
          data-region-type={region.type}
          style={manualBoundsStyle(region.bounds)}
          aria-hidden="true"
        />
      ))}
      {layout.masks.map((mask) => (
        <div
          key={mask.id}
          className="manual-source-mask"
          data-testid="manual-source-mask"
          data-mask-id={mask.id}
          data-mask-role={mask.role}
          data-source-geometry={mask.sourceGeometry}
          style={{ ...manualBoundsStyle(mask.bounds), backgroundColor: mask.fill, opacity: mask.opacity }}
          aria-hidden="true"
        />
      ))}
      <div className="manual-russian-page-layer" data-testid="manual-page-russian-layout">
        {layout.blocks.map((block) => (
          <p
            key={block.id}
            className={`manual-russian-block manual-russian-block-${block.type}`}
            data-testid="manual-layout-block"
            data-block-id={block.id}
            data-block-type={block.type}
            data-block-bounds={`${block.bounds.x},${block.bounds.y},${block.bounds.width},${block.bounds.height}`}
            style={
              {
                ...manualBoundsStyle(block.bounds),
                "--manual-block-font-scale": block.typography.fontScale,
                "--manual-block-line-height": block.typography.lineHeight
              } as CSSProperties
            }
          >
            {manualDisplayText(block)}
          </p>
        ))}
      </div>
    </div>
  );
}

function Manual4RuedasView() {
  const [manifestState, setManifestState] = useState<ManualManifestState>({ isLoading: true });
  const [selectedPageNumber, setSelectedPageNumber] = useState(DEFAULT_MANUAL_PAGE);
  const [selectedNavigationEntryId, setSelectedNavigationEntryId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isManualListOpen, setIsManualListOpen] = useState(true);
  const [imageLoadFailedPage, setImageLoadFailedPage] = useState<number | undefined>();

  useEffect(() => {
    let isMounted = true;
    import("./data/manual4Ruedas")
      .then(({ assertManualLayoutRuntimeShape, manual4RuedasLayoutRu, manual4RuedasNavigationRu, manual4RuedasRu, manualManifestSummary }) => {
        const { manifest, layout, navigation } = assertManualLayoutRuntimeShape(manual4RuedasRu, manual4RuedasLayoutRu, manual4RuedasNavigationRu);
        const baseSummary = manualManifestSummary(manifest);
        const navigationTopics = flattenManualNavigation(navigation.entries).length - navigation.entries.length;
        const summary: ManualManifestSummary = {
          ...baseSummary,
          layoutPages: layout.pages.length,
          navigationSections: navigation.entries.length,
          navigationTopics
        };
        if (isMounted) setManifestState({ manifest, layout, navigation, summary, isLoading: false });
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setManifestState({
          error: error instanceof Error ? error.message : "Не удалось загрузить локальный manifest manual.",
          isLoading: false
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const manifest = manifestState.manifest;
  const layout = manifestState.layout;
  const navigation = manifestState.navigation;
  const summary = manifestState.summary;
  const layoutByPageNumber = useMemo(() => new Map(layout?.pages.map((pageLayout) => [pageLayout.pageNumber, pageLayout]) ?? []), [layout]);
  const navigationEntries = useMemo(() => (navigation ? flattenManualNavigation(navigation.entries) : []), [navigation]);
  const navigationEntryById = useMemo(() => new Map(navigationEntries.map((entry) => [entry.id, entry])), [navigationEntries]);
  const manualPageIndex = useMemo<ManualSearchIndexEntry[]>(
    () =>
      manifest?.pages.map((page) => {
        const section = navigation ? manualNavigationEntryForPage(navigation.entries, page.pageNumber, true) : undefined;
        return {
          page,
          section,
          resultId: `page-${page.pageNumber}`,
          searchText: normalizeSearchText([manualPageSearchText(page), section?.id ?? "", section?.titleRu ?? "", section?.titleEs ?? ""].join(" "))
        };
      }) ?? [],
    [manifest, navigation]
  );
  const manualSearchIndex = useMemo<ManualSearchIndexEntry[]>(
    () => {
      if (!manifest) return [];
      const semanticEntriesByStartPage = new Map<number, ManualNavigationEntry[]>();
      for (const entry of navigationEntries) {
        if (entry.level !== "topic") continue;
        semanticEntriesByStartPage.set(entry.startPage, [...(semanticEntriesByStartPage.get(entry.startPage) ?? []), entry]);
      }

      return manifest.pages.flatMap((page) => {
        const pageEntry = manualPageIndex.find((entry) => entry.page.pageNumber === page.pageNumber);
        const exactStartEntries = semanticEntriesByStartPage.get(page.pageNumber) ?? [];
        const semanticResults = exactStartEntries.map((section) => ({
          page,
          section,
          resultId: `section-${section.id}`,
          searchText: normalizeSearchText([manualPageSearchText(page), section.id, section.titleRu, section.titleEs ?? ""].join(" "))
        }));
        if (semanticResults.length) return semanticResults;
        if (pageEntry) return [pageEntry];
        return {
          page,
          resultId: `page-${page.pageNumber}`,
          searchText: manualPageSearchText(page)
        };
      });
    },
    [manifest, manualPageIndex, navigationEntries]
  );
  const query = normalizeSearchText(searchQuery.trim());
  const queryPageNumber = query ? manualQueryPageNumber(query) : undefined;
  const matchingEntries = query
    ? manualSearchIndex.filter((entry) => (queryPageNumber === undefined ? entry.searchText.includes(query) : entry.page.pageNumber === queryPageNumber))
    : manualSearchIndex;
  const matchingPages = manifest ? (query ? uniqueManualMatchingPages(matchingEntries) : manifest.pages) : [];
  const selectedPage =
    manifest && query
      ? matchingPages.find((page) => page.pageNumber === selectedPageNumber) ?? matchingPages[0]
      : manifest?.pages.find((page) => page.pageNumber === selectedPageNumber) ?? manifest?.pages.find((page) => page.pageNumber === DEFAULT_MANUAL_PAGE) ?? manifest?.pages[0];
  const selectedLayout = selectedPage ? layoutByPageNumber.get(selectedPage.pageNumber) : undefined;
  const selectedTopLevelSection = navigation && selectedPage ? manualNavigationEntryForPage(navigation.entries, selectedPage.pageNumber) : undefined;
  const selectedSemanticEntryById = selectedNavigationEntryId ? navigationEntryById.get(selectedNavigationEntryId) : undefined;
  const selectedSemanticEntry =
    selectedPage && manualNavigationEntryCoversPage(selectedSemanticEntryById, selectedPage.pageNumber)
      ? selectedSemanticEntryById
      : navigation && selectedPage
        ? manualNavigationEntryForPage(navigation.entries, selectedPage.pageNumber, true)
        : undefined;
  const selectedPageIndex = matchingPages.findIndex((page) => page.pageNumber === selectedPage?.pageNumber);
  const imageLoadFailed = imageLoadFailedPage === selectedPage?.pageNumber;
  const sourceSha = selectedPage?.sourceTrace.rawOriginalSha256 ?? manifest?.source.rawOriginalSha256 ?? "";

  if (manifestState.isLoading) {
    return (
      <section className="workspace manual-reader" aria-busy="true" data-testid="manual-loading">
        <h2>Manual 4 ruedas</h2>
        <p>Загружаем полный локальный manifest manual.</p>
      </section>
    );
  }

  if (manifestState.error || !manifest || !layout || !navigation || !summary) {
    return (
      <section className="workspace manual-reader">
        <h2>Manual 4 ruedas</h2>
        <p>Локальный manifest полного manual не прошел проверку.</p>
        <p className="muted">{manifestState.error}</p>
      </section>
    );
  }
  const manualNavigation = navigation;

  function selectManualPage(pageNumber: number, options: { entryId?: string; preserveCurrentEntry?: boolean } = {}) {
    const requestedEntry = options.entryId ? navigationEntryById.get(options.entryId) : undefined;
    const currentEntry = options.preserveCurrentEntry && selectedNavigationEntryId ? navigationEntryById.get(selectedNavigationEntryId) : undefined;
    const destinationEntry = manualNavigationEntryForDestinationPage(manualNavigation.entries, pageNumber, { requestedEntry, currentEntry });
    setSelectedPageNumber(pageNumber);
    setSelectedNavigationEntryId(destinationEntry?.id);
    setImageLoadFailedPage(undefined);
    setIsManualListOpen(false);
  }

  function selectManualEntry(entry: ManualNavigationEntry) {
    setSearchQuery("");
    selectManualPage(entry.startPage, { entryId: entry.id });
  }

  function goToRelativeManualPage(offset: number) {
    if (selectedPageIndex < 0) return;
    const nextPage = matchingPages[selectedPageIndex + offset];
    if (nextPage) selectManualPage(nextPage.pageNumber, { preserveCurrentEntry: true });
  }

  function resetManualControls() {
    setSearchQuery("");
    setSelectedPageNumber(DEFAULT_MANUAL_PAGE);
    setSelectedNavigationEntryId(undefined);
    setImageLoadFailedPage(undefined);
    setIsManualListOpen(true);
  }

  return (
    <section className="manual-reader" aria-labelledby="manual-title">
      <header className="materials-header manual-header">
        <div>
          <p className="eyebrow">Manual GCBA</p>
          <h2 id="manual-title">{manifest.titleRu}</h2>
          <p>Русская веб-страница собирается из локальной визуальной основы, масок и проверенных текстовых блоков, сохраняя порядок, изображения и структуру официального manual.</p>
        </div>
        <div className="materials-status manual-status" aria-label="Покрытие полного manual">
          <span>{summary.pages} / {summary.expectedPages} страниц</span>
          <span>{summary.layoutPages} страниц верстки</span>
          <span>{summary.navigationSections} разделов / {summary.navigationTopics} тем</span>
          <span>{summary.localAssets} локальных изображений</span>
        </div>
      </header>

      <div className={`manual-layout ${isManualListOpen ? "compact-list-open" : "compact-detail-open"}`}>
        <aside className="manual-page-list" aria-label="Навигация полного manual" data-testid="manual-navigation-panel">
          <label className="search-box manual-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Поиск по manual</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsManualListOpen(true);
              }}
              placeholder="Страница, русский или испанский текст"
              aria-label="Поиск по полному manual"
              data-testid="manual-search-input"
            />
          </label>
          <div className="source-results-summary" aria-live="polite">
            {query ? `Найдено: ${matchingPages.length} страниц` : `${manualNavigation.entries.length} разделов из индекса manual`}
          </div>

          {query && matchingPages.length ? (
            <div className="manual-page-buttons manual-search-results" aria-label="Результаты поиска по страницам manual">
              {matchingEntries.map(({ page, section, resultId }) => (
                <button
                  type="button"
                  key={resultId}
                  className={page.pageNumber === selectedPage?.pageNumber && (!section || selectedSemanticEntry?.id === section.id) ? "active" : ""}
                  onClick={() => selectManualPage(page.pageNumber, { entryId: section?.id })}
                  aria-label={`Страница ${page.pageNumber}. ${page.translation.headingRu}`}
                  data-testid={`manual-page-button-${page.pageNumber}`}
                  data-result-entry-id={section?.id ?? ""}
                  data-search-result-id={resultId}
                >
                  <span>{page.pageNumber}</span>
                  <strong>{page.translation.headingRu}</strong>
                  <small>{section?.titleRu ?? "Раздел manual"}</small>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="source-empty-state" role="status">
              <strong>Ничего не найдено</strong>
              <p>В полном локальном manual нет страницы под такой поиск.</p>
              <button type="button" className="tool-button" onClick={resetManualControls}>Сбросить поиск</button>
            </div>
          ) : (
            <>
              <nav className="manual-toc" aria-label="Структура документа manual">
                {manualNavigation.entries.map((entry) => (
                  <section key={entry.id} className="manual-toc-section">
                    <button
                      type="button"
                      className={selectedTopLevelSection?.id === entry.id ? "manual-toc-button active" : "manual-toc-button"}
                      onClick={() => selectManualEntry(entry)}
                      aria-label={`${entry.titleRu}. Страницы ${entry.startPage}-${entry.endPage}`}
                      data-testid={`manual-nav-${entry.id}`}
                    >
                      <span>{entry.startPage}-{entry.endPage}</span>
                      <strong>{entry.titleRu}</strong>
                      <small>{entry.children?.length ?? 0} тем · {entry.sourceEvidence === "index_pages_11_12" ? "индекс" : "заголовки"}</small>
                    </button>
                    {entry.children?.length ? (
                      <div className="manual-toc-children">
                        {entry.children.map((child) => (
                          <button
                            type="button"
                            key={child.id}
                            className={selectedSemanticEntry?.id === child.id ? "manual-topic-button active" : "manual-topic-button"}
                            onClick={() => selectManualEntry(child)}
                            aria-label={`${child.titleRu}. Страницы ${child.startPage}-${child.endPage}`}
                            data-testid={`manual-nav-${child.id}`}
                          >
                            <span>{child.startPage}</span>
                            <strong>{child.titleRu}</strong>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </section>
                ))}
              </nav>

              <details className="manual-page-access" data-testid="manual-page-access">
                <summary>Страницы 1-200</summary>
                <div className="manual-page-buttons" aria-label="Вторичный список страниц manual">
                  {manualPageIndex.map(({ page, section }) => (
                    <button
                      type="button"
                      key={page.pageNumber}
                      className={page.pageNumber === selectedPage?.pageNumber ? "active" : ""}
                      onClick={() => selectManualPage(page.pageNumber)}
                      aria-label={`Страница ${page.pageNumber}. ${page.translation.headingRu}`}
                      data-testid={`manual-page-button-${page.pageNumber}`}
                    >
                      <span>{page.pageNumber}</span>
                      <strong>{page.translation.headingRu}</strong>
                      <small>{section?.titleRu ?? "Раздел manual"}</small>
                    </button>
                  ))}
                </div>
              </details>
            </>
          )}
        </aside>

        {selectedPage && selectedLayout ? (
          <article className="manual-page-detail" data-testid="manual-page-detail">
            <button type="button" className="tool-button source-mobile-back" onClick={() => setIsManualListOpen(true)}>
              <ChevronLeft size={18} aria-hidden="true" /> К навигации
            </button>
            <div className="manual-page-heading">
              <div>
                <span className="block-label">PDF page {selectedPage.sourcePageNumber}</span>
                <h2>{selectedPage.translation.headingRu}</h2>
                <p data-testid="manual-selected-semantic-label">
                  {selectedTopLevelSection?.titleRu}
                  {selectedSemanticEntry && selectedSemanticEntry.id !== selectedTopLevelSection?.id ? ` · ${selectedSemanticEntry.titleRu}` : ""}
                </p>
              </div>
              <div className="manual-page-counter" aria-label="Позиция страницы">
                {selectedPage.pageNumber} / {manifest.source.pageCount}
              </div>
            </div>

            <div className="source-meta-row manual-meta-row" aria-label="Трассировка официального источника">
              <span>{selectedPage.sourceTrace.officialDocumentId}</span>
              <span>PDF page {selectedPage.sourcePageNumber}</span>
              <span>PDF SHA {sourceSha.slice(0, 12)}</span>
              <span>asset SHA {selectedPage.visualAsset.sha256.slice(0, 12)}</span>
            </div>

            <ManualRussianPageCanvas
              page={selectedPage}
              layout={selectedLayout}
              imageLoadFailed={imageLoadFailed}
              onImageError={() => setImageLoadFailedPage(selectedPage.pageNumber)}
            />

            <div className="manual-actions">
              <button type="button" className="tool-button" onClick={() => goToRelativeManualPage(-1)} disabled={selectedPageIndex <= 0}>
                <ChevronLeft size={18} aria-hidden="true" /> Предыдущая
              </button>
              <span>{selectedPageIndex + 1} / {matchingPages.length}</span>
              <button type="button" className="tool-button" onClick={() => goToRelativeManualPage(1)} disabled={selectedPageIndex < 0 || selectedPageIndex >= matchingPages.length - 1}>
                Следующая <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>

            <details className="manual-provenance" data-testid="manual-page-provenance">
              <summary>Источник и покрытие страницы</summary>
              <div>
                {selectedPage.translation.chunkProvenance ? (
                  <>
                    <strong>{selectedPage.translation.chunkProvenance.chunkId}</strong>
                    <span>QA: {selectedPage.translation.chunkProvenance.translationQaStatus}</span>
                    <span>Shard: {selectedPage.translation.chunkProvenance.shardPath}</span>
                    {selectedPage.translation.chunkProvenance.sourceSpan && (
                      <span>
                        Archive lines {selectedPage.translation.chunkProvenance.sourceSpan.startLine}-{selectedPage.translation.chunkProvenance.sourceSpan.endLine}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <strong>{selectedPage.translation.visualTextTranslationProvenance?.featureId}</strong>
                    <span>{selectedPage.translation.visualTextTranslationProvenance?.method}</span>
                    <span>Reviewed {selectedPage.translation.visualTextTranslationProvenance?.reviewedAt}</span>
                  </>
                )}
                <span>{selectedLayout.blocks.length} layout blocks</span>
                <span>{selectedLayout.visualRegions.length} visual region</span>
              </div>
            </details>

            <footer className="source-line manual-source-line">
              Архив: {manifest.source.rawOriginalPath}. Верстка: layout.ru.json. Навигация: navigation.ru.json. Source URL записан только для трассировки.
            </footer>
          </article>
        ) : (
          <article className="manual-page-detail source-empty-state" data-testid="manual-empty-detail" role="status">
            <h2>Страница не выбрана</h2>
            <p>
              {query
                ? "В полном локальном manual нет страницы под текущий поиск. Измените запрос или сбросьте поиск в списке."
                : "Manifest загружен, но страница не выбрана."}
            </p>
          </article>
        )}
      </div>
    </section>
  );
}

function PrimarySourcesView() {
  const [corpus, setCorpus] = useState<PrimarySourceCorpus | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const [selectedChunkId, setSelectedChunkId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<SourceViewMode>("simple");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const previousEffectiveDocumentId = useRef<string | undefined>(undefined);
  const [isSourceListOpen, setIsSourceListOpen] = useState(true);

  useEffect(() => {
    let isMounted = true;
    loadPrimarySources()
      .then((nextCorpus) => {
        if (!isMounted) return;
        setCorpus(nextCorpus);
        setSelectedDocumentId((current) => current ?? nextCorpus.documents[0]?.officialDocumentId);
        setSelectedChunkId((current) => current ?? nextCorpus.documents[0]?.chunks[0]?.chunkId);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setLoadError(error instanceof Error ? error.message : "Не удалось загрузить локальный корпус источников.");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const documents = corpus?.documents ?? [];
  const categoryOptions: SourceFilterOption[] = Array.from(new Set(documents.map((document) => document.category)))
    .sort((a, b) => primarySourceCategoryLabel(a).localeCompare(primarySourceCategoryLabel(b), "ru"))
    .map((category) => ({ value: category, label: primarySourceCategoryLabel(category) }));
  const sourceOptions: SourceFilterOption[] = [
    ...Array.from(new Set(documents.map((document) => document.jurisdiction)))
      .sort((a, b) => primarySourceJurisdictionLabel(a).localeCompare(primarySourceJurisdictionLabel(b), "ru"))
      .map((jurisdiction) => ({ value: `jurisdiction:${jurisdiction}`, label: `Юрисдикция: ${primarySourceJurisdictionLabel(jurisdiction)}` })),
    ...Array.from(new Set(documents.map((document) => document.officialSourceType)))
      .sort((a, b) => primarySourceTypeLabel(a).localeCompare(primarySourceTypeLabel(b), "ru"))
      .map((sourceType) => ({ value: `type:${sourceType}`, label: `Тип: ${primarySourceTypeLabel(sourceType)}` }))
  ];
  const query = normalizeSearchText(searchQuery.trim());
  const documentMatches: PrimarySourceDocumentMatch[] = documents
    .map((document) => {
      const metadataText = normalizeSearchText(
        [
          document.title,
          document.shortTitleRu,
          primarySourceCategoryLabel(document.category),
          primarySourceJurisdictionLabel(document.jurisdiction),
          primarySourceTypeLabel(document.officialSourceType),
          document.officialSourceType,
          document.officialDocumentId,
          document.currentnessStatus,
          document.currentnessValidationStatus,
          document.exactTextValidationStatus,
          document.retrievalDate
        ].join(" ")
      );
      const matchingChunks = query
        ? document.chunks.filter((chunk) =>
            normalizeSearchText(
              [
                chunk.officialLabel ?? "",
                chunk.headingPath.join(" "),
                chunk.simpleRu,
                chunk.fullTranslationRu,
                chunk.originalSpanish
              ].join(" ")
            ).includes(query)
          )
        : document.chunks;
      const metadataMatches = !query || metadataText.includes(query);
      const categoryMatches = categoryFilter === "all" || document.category === categoryFilter;
      const sourceMatches =
        sourceFilter === "all" ||
        sourceFilter === `jurisdiction:${document.jurisdiction}` ||
        sourceFilter === `type:${document.officialSourceType}`;
      return {
        document,
        matchingChunks,
        matchCount: query ? (metadataMatches ? 1 : 0) + matchingChunks.length : document.chunks.length,
        isVisible: categoryMatches && sourceMatches && (!query || metadataMatches || matchingChunks.length > 0)
      };
    })
    .filter((entry) => entry.isVisible);
  const selectedDocument =
    documentMatches.find((entry) => entry.document.officialDocumentId === selectedDocumentId)?.document ??
    documentMatches[0]?.document;
  const selectedMatch = documentMatches.find((entry) => entry.document.officialDocumentId === selectedDocument?.officialDocumentId);
  const tocChunks = query && selectedMatch?.matchingChunks.length ? selectedMatch.matchingChunks : selectedDocument?.chunks ?? [];
  const navigationChunks = tocChunks;
  const selectedChunk =
    navigationChunks.find((chunk) => chunk.chunkId === selectedChunkId) ??
    navigationChunks[0] ??
    selectedDocument?.chunks[0];
  const selectedChunkIndex = navigationChunks.findIndex((chunk) => chunk.chunkId === selectedChunk?.chunkId);
  const effectiveSelectedDocumentId = selectedDocument?.officialDocumentId;
  const firstNavigationChunkId = navigationChunks[0]?.chunkId ?? selectedDocument?.chunks[0]?.chunkId;
  const selectedExactTextStatusKind = selectedDocument ? exactTextStatusKind(selectedDocument.exactTextValidationStatus) : "pending";
  const selectedExactTextStatusNote = selectedDocument ? exactTextStatusNote(selectedDocument.exactTextValidationStatus) : undefined;

  useEffect(() => {
    if (!effectiveSelectedDocumentId) {
      previousEffectiveDocumentId.current = undefined;
      return;
    }
    if (previousEffectiveDocumentId.current === effectiveSelectedDocumentId) return;

    previousEffectiveDocumentId.current = effectiveSelectedDocumentId;
    setViewMode("simple");
    setSelectedChunkId(firstNavigationChunkId);
  }, [effectiveSelectedDocumentId, firstNavigationChunkId]);

  if (loadError) {
    return (
      <section className="workspace source-reader">
        <h2>Источники</h2>
        <p>Локальный корпус источников не загрузился.</p>
        <p className="muted">{loadError}</p>
      </section>
    );
  }

  if (!corpus) {
    return (
      <section className="workspace source-reader">
        <h2>Источники</h2>
        <p>Загружаю локальный корпус официальных источников...</p>
      </section>
    );
  }

  function selectDocument(document: PrimarySourceDocument) {
    const match = documentMatches.find((entry) => entry.document.officialDocumentId === document.officialDocumentId);
    setSelectedDocumentId(document.officialDocumentId);
    setSelectedChunkId((match?.matchingChunks[0] ?? document.chunks[0])?.chunkId);
    setIsSourceListOpen(false);
  }

  function selectChunk(chunkId: string) {
    setSelectedChunkId(chunkId);
  }

  function updateSearchQuery(nextQuery: string) {
    setSearchQuery(nextQuery);
    setIsSourceListOpen(true);
  }

  function goToRelativeChunk(offset: number) {
    if (selectedChunkIndex < 0) return;
    const nextChunk = navigationChunks[selectedChunkIndex + offset];
    if (nextChunk) setSelectedChunkId(nextChunk.chunkId);
  }

  function chunkText(chunk: PrimarySourceDocument["chunks"][number]) {
    if (viewMode === "full") return chunk.fullTranslationRu;
    if (viewMode === "spanish") return chunk.originalSpanish;
    return chunk.simpleRu;
  }

  function resetSourceControls() {
    setSearchQuery("");
    setCategoryFilter("all");
    setSourceFilter("all");
    setSelectedDocumentId(corpus?.documents[0]?.officialDocumentId);
    setSelectedChunkId(corpus?.documents[0]?.chunks[0]?.chunkId);
    setViewMode("simple");
    setIsSourceListOpen(true);
  }

  return (
    <section className="source-reader" aria-labelledby="sources-title">
      <header className="sources-header">
        <div>
          <p className="eyebrow">Источники</p>
          <h2 id="sources-title">Официальные первоисточники</h2>
          <p>Испанский архив - официальный слой. Русский текст здесь - неофициальная учебная поддержка Cabadrive.</p>
        </div>
        <div className="sources-status" aria-label="Покрытие корпуса источников">
          <span>{corpus.manifestEntryCount} документов</span>
          <span>{corpus.chunkCount} фрагментов</span>
          <span>без сетевых запросов во время работы</span>
        </div>
      </header>

      <div className={`sources-layout ${isSourceListOpen ? "compact-list-open" : "compact-detail-open"}`} data-testid="source-reader-layout">
        <aside className="source-list-pane" aria-label="Поиск и список источников" data-testid="source-list-pane">
          <div className="source-controls" aria-label="Поиск и фильтры источников">
            <label className="search-box source-search">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Поиск по источникам</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => updateSearchQuery(event.target.value)}
                placeholder="Искать правило, статью, документ или испанский термин"
                aria-label="Поиск по источникам, русскому и испанскому тексту"
                data-testid="source-search-input"
              />
            </label>
            <div className="source-filter-row">
              <label>
                <span>Категория</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                    setIsSourceListOpen(true);
                  }}
                  aria-label="Фильтр источников по практической категории"
                >
                  <option value="all">Все категории</option>
                  {categoryOptions.map((option) => (
                    <option value={option.value} key={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Юрисдикция / тип</span>
                <select
                  value={sourceFilter}
                  onChange={(event) => {
                    setSourceFilter(event.target.value);
                    setIsSourceListOpen(true);
                  }}
                  aria-label="Фильтр источников по юрисдикции или типу"
                >
                  <option value="all">Все юрисдикции и типы</option>
                  {sourceOptions.map((option) => (
                    <option value={option.value} key={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="source-results-summary" aria-live="polite">
              Найдено: {documentMatches.length} документов
              {query ? `, ${documentMatches.reduce((sum, entry) => sum + entry.matchCount, 0)} совпадений` : ""}
            </div>
          </div>

          {documentMatches.length ? (
            <div className="source-list" aria-label="Список источников">
              {documentMatches.map(({ document, matchCount }) => (
                <button
                  type="button"
                  key={document.officialDocumentId}
                  className={document.officialDocumentId === selectedDocument?.officialDocumentId ? "active" : ""}
                  onClick={() => selectDocument(document)}
                  aria-label={`${document.shortTitleRu}. ${primarySourceCategoryLabel(document.category)}. ${primarySourceJurisdictionLabel(document.jurisdiction)}. Открыть источник`}
                >
                  <strong>{document.shortTitleRu}</strong>
                  <span>{document.title}</span>
                  <small>
                    {primarySourceCategoryLabel(document.category)} · {primarySourceJurisdictionLabel(document.jurisdiction)} · {primarySourceTypeLabel(document.officialSourceType)}
                  </small>
                  <small>{query ? `${matchCount} совпадений` : `${document.chunks.length} фрагментов`}</small>
                  <small>{exactTextLabel(document.exactTextValidationStatus)}</small>
                </button>
              ))}
            </div>
          ) : (
            <div className="source-empty-state" role="status">
              <strong>Ничего не найдено</strong>
              <p>В локальном корпусе нет источников под такой поиск и фильтры. Интернет здесь не нужен: попробуйте убрать фильтр или ввести другое слово.</p>
              <button type="button" className="tool-button" onClick={resetSourceControls}>Сбросить поиск и фильтры</button>
            </div>
          )}
        </aside>

        {selectedDocument ? (
          <article className="source-detail" data-testid="source-detail-pane">
            <button type="button" className="tool-button source-mobile-back" onClick={() => setIsSourceListOpen(true)}>
              <ChevronLeft size={18} aria-hidden="true" /> К списку источников
            </button>
            <div className="source-detail-heading">
              <div>
                <span className="block-label">{selectedDocument.officialDocumentId}</span>
                <h2>{selectedDocument.shortTitleRu}</h2>
                <p>{selectedDocument.title}</p>
              </div>
              <div className="source-mode-controls" role="group" aria-label="Режим текста источника">
                <button type="button" className={viewMode === "simple" ? "active" : ""} onClick={() => setViewMode("simple")} aria-pressed={viewMode === "simple"} data-testid="source-mode-simple">
                  Просто
                </button>
                <button type="button" className={viewMode === "full" ? "active" : ""} onClick={() => setViewMode("full")} aria-pressed={viewMode === "full"} data-testid="source-mode-full">
                  Полный перевод
                </button>
                <button type="button" className={viewMode === "spanish" ? "active" : ""} onClick={() => setViewMode("spanish")} aria-pressed={viewMode === "spanish"} data-testid="source-mode-spanish">
                  Оригинал ES
                </button>
              </div>
            </div>

            <div className="source-meta-row" aria-label="Метаданные источника">
              <span>{primarySourceCategoryLabel(selectedDocument.category)}</span>
              <span>{primarySourceJurisdictionLabel(selectedDocument.jurisdiction)}</span>
              <span>{primarySourceTypeLabel(selectedDocument.officialSourceType)}</span>
              <span>{primarySourceCurrentnessLabel(selectedDocument.currentnessStatus)}: {primarySourceValidationLabel(selectedDocument.currentnessValidationStatus)}</span>
              <span className={selectedExactTextStatusKind === "passed" ? "" : selectedExactTextStatusKind}>{exactTextLabel(selectedDocument.exactTextValidationStatus)}</span>
            </div>

            <div className={`source-status-note ${selectedExactTextStatusKind}`} role="status">
              <strong>{selectedExactTextStatusNote?.title}</strong>
              <span>{selectedExactTextStatusNote?.description}</span>
            </div>

            <div className="source-reader-grid">
              <nav className="source-toc" aria-label="Оглавление фрагментов источника">
                <div className="source-toc-title">
                  <ListTree size={18} aria-hidden="true" />
                  <strong>Фрагменты</strong>
                </div>
                <div className="source-toc-list">
                  {tocChunks.map((chunk) => (
                    <button
                      type="button"
                      key={chunk.chunkId}
                      className={chunk.chunkId === selectedChunk?.chunkId ? "active" : ""}
                      onClick={() => selectChunk(chunk.chunkId)}
                      aria-label={`${chunk.officialLabel || `Фрагмент ${chunk.order}`}. Открыть фрагмент`}
                    >
                      <span>{chunk.officialLabel || `Фрагмент ${chunk.order}`}</span>
                      <small>{chunk.headingPath.at(-1) || selectedDocument.shortTitleRu}</small>
                    </button>
                  ))}
                </div>
              </nav>

              {selectedChunk ? (
                <section className="source-chunk" key={selectedChunk.chunkId} data-testid="source-chunk-reader">
                  <div className="source-chunk-heading">
                    <span>{selectedChunk.officialLabel || `Фрагмент ${selectedChunk.order}`}</span>
                    <small>{selectedChunk.headingPath.join(" / ")}</small>
                  </div>
                  <p>{chunkText(selectedChunk)}</p>
                  <div className="source-chunk-actions">
                    <button type="button" className="tool-button" onClick={() => goToRelativeChunk(-1)} disabled={selectedChunkIndex <= 0}>
                      <ChevronLeft size={18} aria-hidden="true" /> Предыдущий
                    </button>
                    <span>{selectedChunkIndex + 1} / {navigationChunks.length}</span>
                    <button type="button" className="tool-button" onClick={() => goToRelativeChunk(1)} disabled={selectedChunkIndex < 0 || selectedChunkIndex >= navigationChunks.length - 1}>
                      Следующий <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </section>
              ) : (
                <p>Фрагменты для этого источника не найдены. Корпус требует проверки.</p>
              )}
            </div>
          </article>
        ) : (
          <article className="source-detail">
            <h2>Источник не выбран</h2>
            <p>Локальный корпус загружен, но список документов пуст.</p>
          </article>
        )}
      </div>
    </section>
  );
}

export function App() {
  const [view, setView] = useState<View>(() => {
    if (introductionEntryForHash(window.location.hash)) return "pandemia";
    const manualPageForHash = manualGuidePageByHash.get(window.location.hash);
    if (manualPageForHash && manualGuidePageIsAvailable(manualPageForHash)) return "pandemia";
    if (new URLSearchParams(window.location.search).get("legacyManual") === "1") return "manual";
    return "learn";
  });
  const [selectedIntroductionId, setSelectedIntroductionId] = useState<IntroductionRouteId>(() =>
    (introductionEntryForHash(window.location.hash) ?? defaultIntroductionEntry).id
  );
  const [selectedManualPageId, setSelectedManualPageId] = useState<string | undefined>(() => {
    const manualPageForHash = manualGuidePageByHash.get(window.location.hash);
    return manualPageForHash && manualGuidePageIsAvailable(manualPageForHash) ? manualPageForHash.id : undefined;
  });
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    function syncHashView() {
      const introEntry = introductionEntryForHash(window.location.hash);
      if (introEntry) {
        setSelectedIntroductionId(introEntry.id);
        setSelectedManualPageId(undefined);
        setView("pandemia");
        return;
      }
      const manualPageForHash = manualGuidePageByHash.get(window.location.hash);
      if (manualPageForHash && manualGuidePageIsAvailable(manualPageForHash)) {
        setSelectedManualPageId(manualPageForHash.id);
        setView("pandemia");
        return;
      }
      setView((currentView) => (currentView === "pandemia" ? "learn" : currentView));
    }
    window.addEventListener("hashchange", syncHashView);
    window.addEventListener("popstate", syncHashView);
    return () => {
      window.removeEventListener("hashchange", syncHashView);
      window.removeEventListener("popstate", syncHashView);
    };
  }, []);

  function reset() {
    clearProgress();
    setProgress(loadProgress());
  }

  function selectView(nextView: View) {
    setView(nextView);
    if (nextView === "pandemia") {
      const selectedManualPage = selectedManualPageId ? manualGuidePageById.get(selectedManualPageId) : undefined;
      const entry = introductionEntryById(selectedIntroductionId);
      const nextUrl = introductionRouteUrl(selectedManualPage?.routeHash ?? entry.routeHash);
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) window.history.pushState(null, "", nextUrl);
    } else if (introductionEntryForHash(window.location.hash) || manualGuidePageByHash.has(window.location.hash) || new URLSearchParams(window.location.search).has("legacyManual")) {
      const nextUrl = nonIntroductionRouteUrl();
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) window.history.pushState(null, "", nextUrl);
    }
  }

  function selectIntroductionEntry(entry: IntroductionNavigationEntry) {
    setSelectedIntroductionId(entry.id);
    setSelectedManualPageId(undefined);
    setView("pandemia");
    const nextUrl = introductionRouteUrl(entry.routeHash);
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) window.history.pushState(null, "", nextUrl);
  }

  function selectManualPage(page: ManualGuidePageEntry) {
    if (!manualGuidePageIsAvailable(page)) return;
    setSelectedManualPageId(page.id);
    setView("pandemia");
    const nextUrl = introductionRouteUrl(page.routeHash);
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) window.history.pushState(null, "", nextUrl);
  }

  const selectedIntroductionEntry = introductionEntryById(selectedIntroductionId);
  const selectedManualPage = selectedManualPageId ? manualGuidePageById.get(selectedManualPageId) : undefined;

  return (
    <main>
      <header className="app-header">
        <div>
          <p className="eyebrow">Cabadrive · CABA categoria B</p>
          <h1>Тренажер теории для категории B</h1>
        </div>
        <button type="button" className="icon-button" onClick={reset} aria-label="Сбросить прогресс" title="Сбросить прогресс">
          <RotateCcw size={20} />
        </button>
      </header>

      <StatusStrip progress={progress} />

      <nav className="tabs" aria-label="Режимы">
        <button className={view === "learn" ? "active" : ""} onClick={() => selectView("learn")}><BookOpen size={18} /> Учить</button>
        <button className={view === "exam" ? "active" : ""} onClick={() => selectView("exam")}><ClipboardList size={18} /> Экзамен</button>
        <button className={view === "mistakes" ? "active" : ""} onClick={() => selectView("mistakes")}><XCircle size={18} /> Ошибки</button>
        <button className={view === "vocabulary" ? "active" : ""} onClick={() => selectView("vocabulary")}><Search size={18} /> Словарь</button>
        <button className={view === "materials" ? "active" : ""} onClick={() => selectView("materials")}><BookMarked size={18} /> Материалы</button>
        <button className={view === "pandemia" ? "active" : ""} onClick={() => selectView("pandemia")} data-testid="pandemia-nav-entry"><ListTree size={18} /> Руководство</button>
        <button className={view === "sources" ? "active" : ""} onClick={() => selectView("sources")}><FileText size={18} /> Источники</button>
        <button className={view === "process" ? "active" : ""} onClick={() => selectView("process")}><MapPinned size={18} /> Процесс</button>
        <button className={view === "guide" ? "active" : ""} onClick={() => selectView("guide")}><Flag size={18} /> CABA/RF</button>
      </nav>

      {view === "learn" && <LearnView progress={progress} setProgress={setProgress} />}
      {view === "exam" && <ExamView progress={progress} setProgress={setProgress} />}
      {view === "mistakes" && <MistakesView progress={progress} setProgress={setProgress} />}
      {view === "vocabulary" && <VocabularyView />}
      {view === "materials" && <TopicGuideView />}
      {view === "pandemia" && (
        <IntroductionSectionsView
          selectedEntry={selectedIntroductionEntry}
          selectedManualPage={selectedManualPage}
          onSelectEntry={selectIntroductionEntry}
          onSelectManualPage={selectManualPage}
        />
      )}
      {view === "manual" && <Manual4RuedasView />}
      {view === "sources" && <PrimarySourcesView />}
      {view === "process" && <ProcessGuideView />}
      {view === "guide" && <GuideView />}
    </main>
  );
}
