import { BookMarked, BookOpen, CheckCircle2, ClipboardList, ExternalLink, FileText, Flag, Image as ImageIcon, MapPinned, RotateCcw, Search, Timer, XCircle } from "lucide-react";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  data,
  assetUrl,
  explanationByQuestion,
  questionById,
  sourceById,
  translationByQuestion,
  type ProgressAnswer,
  type ProcessGuideSection,
  type Question,
  type TopicGuideTicket
} from "./data/content";
import { DifficultyIndicator } from "./difficulty";
import { formatDuration, isPassing, learningTicketTargetSeconds, mistakesFromHistory, scorePercent, selectExamSet } from "./domain";
import { clearProgress, loadProgress, saveProgress, type StoredProgress } from "./storage";
import { searchQuestions, searchVocabulary } from "./search";

type View = "learn" | "exam" | "mistakes" | "vocabulary" | "guide" | "materials" | "process";
type LearningTicketTimerStatus = "running" | "paused" | "expired" | "answered";
type LearningTicketTimerState = {
  remainingSeconds: number;
  status: LearningTicketTimerStatus;
  answeredAfterExpiry: boolean;
};

type LearningTicketTimerView = LearningTicketTimerState & {
  onTogglePause: () => void;
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
  revealAfterAnswer = true,
  allowRepeatedAnswers = false,
  learningTimer
}: {
  question: Question;
  mode: "learning" | "exam" | "mistakes";
  onAnswered: (answer: ProgressAnswer) => void;
  difficult: boolean;
  onToggleDifficult: () => void;
  revealAfterAnswer?: boolean;
  allowRepeatedAnswers?: boolean;
  learningTimer?: LearningTicketTimerView;
}) {
  const [selected, setSelected] = useState<string | undefined>();
  const [showTranslation, setShowTranslation] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const translation = translationByQuestion.get(question.id);
  const explanation = explanationByQuestion.get(question.id);
  const source = sourceById.get(question.sourceId);
  const answered = Boolean(selected);
  const correct = selected === question.correctAnswerId;
  const canToggleSupport = mode !== "exam";
  const translationId = `translation-${question.id}`;

  useEffect(() => {
    setSelected(undefined);
    setShowTranslation(false);
    setShowExplanation(false);
  }, [mode, question.id]);

  function selectAnswer(answerId: string) {
    if (answered && !allowRepeatedAnswers) return;
    setSelected(answerId);
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
    setShowTranslation((value) => !value);
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
      <h2>{question.officialTextEs}</h2>
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
        {question.flags.hasNegationOrException && <span className="warning">есть отрицание/ловушка</span>}
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
          <p>{translation?.questionTextRu || "Русский перевод для этого вопроса еще не подготовлен. Ориентируйтесь на испанский текст."}</p>
        </aside>
      )}

      {question.image && (
        <figure className="question-image">
          <img src={assetUrl(question.image.localPath)} alt={question.image.altEs} />
          <figcaption>
            <ImageIcon size={16} aria-hidden="true" /> Локальное изображение вопроса
          </figcaption>
        </figure>
      )}

      {canToggleSupport && (
        <div className="actions-row">
          <button type="button" className="tool-button" onClick={() => setShowExplanation((value) => !value)}>
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
              <span>{answer.officialTextEs}</span>
              {showTranslation && translated && <small>{translated}</small>}
            </button>
          );
        })}
      </div>

      {answered && revealAfterAnswer && (
        <div className={correct ? "result correct-text" : "result incorrect-text"} role="status">
          {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          {correct ? "Верно" : "Ошибка"} · правильный ответ: {question.answers.find((answer) => answer.id === question.correctAnswerId)?.officialTextEs}
        </div>
      )}

      {showExplanation && (
        <aside className="support-block explanation">
          <span className="block-label">Учебное пояснение</span>
          <p>{explanation?.textRu || "Пояснение пока не подготовлено для этого вопроса."}</p>
        </aside>
      )}

      <footer className="source-line">
        Источник: {source?.title || question.sourceId}. Статус вопроса: неофициальная B-практика, нужна внешняя проверка.
      </footer>
    </article>
  );
}

function LearnView({ progress, setProgress }: { progress: StoredProgress; setProgress: (progress: StoredProgress) => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [timerStates, setTimerStates] = useState<Record<string, LearningTicketTimerState>>({});
  const results = useMemo(() => searchQuestions(query), [query]);
  const question = results[index % Math.max(results.length, 1)] || data.questions[0];
  const difficult = progress.difficultQuestionIds.includes(question.id);
  const timerTargetSeconds = learningTicketTargetSeconds(data.examFormat);
  const currentTimerState = timerTargetSeconds ? timerStates[question.id] ?? initialLearningTimerState(timerTargetSeconds) : undefined;

  function record(answer: ProgressAnswer) {
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
    setTimerStates({});
  }

  function toggleCurrentTimer() {
    if (!timerTargetSeconds) return;
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
    if (!timerTargetSeconds) return;
    setTimerStates((current) => {
      if (current[question.id]) return current;
      return {
        ...current,
        [question.id]: initialLearningTimerState(timerTargetSeconds)
      };
    });
  }, [question.id, timerTargetSeconds]);

  useEffect(() => {
    if (!timerTargetSeconds || currentTimerState?.status !== "running") return undefined;
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
  }, [question.id, timerTargetSeconds, currentTimerState?.status]);

  return (
    <section className="workspace">
      <div className="toolbar">
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Поиск по испанскому, русскому, теме" />
        </label>
        <button type="button" className="tool-button" onClick={() => setIndex((value) => value + 1)}>
          Следующий
        </button>
      </div>
      <QuestionCard
        key={question.id}
        question={question}
        mode="learning"
        onAnswered={record}
        difficult={difficult}
        onToggleDifficult={toggleDifficult}
        learningTimer={currentTimerState ? { ...currentTimerState, onTogglePause: toggleCurrentTimer } : undefined}
      />
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
  const mistakes = mistakesFromHistory(progress.answers);
  const question = data.questions.find((item) => item.id === mistakes[0]?.questionId) || data.questions[0];

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
          <p className="mistake-list-row" key={mistake.questionId}>
            <strong>{mistake.wrong}x</strong>
            <span>{mistake.questionId}</span>
            {questionById.get(mistake.questionId) && <DifficultyIndicator level={questionById.get(mistake.questionId)!.difficulty} compact />}
          </p>
        )) : <p>Ошибок пока нет. Ответьте на пару вопросов в обучении.</p>}
      </aside>
      <QuestionCard
        question={question}
        mode="mistakes"
        onAnswered={record}
        difficult={progress.difficultQuestionIds.includes(question.id)}
        onToggleDifficult={() => undefined}
        allowRepeatedAnswers
      />
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
            <span>{term.category}</span>
            <h3>{term.termEs}</h3>
            <p>{term.translationRu}</p>
            <small>{term.explanationRu}</small>
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
        <h3>{question.officialTextEs}</h3>
      </div>
      {translation ? (
        <aside className="support-block translation materials-translation">
          <span className="block-label">Неофициальный русский перевод</span>
          <p>{translation.questionTextRu}</p>
        </aside>
      ) : (
        <aside className="support-block translation materials-translation missing-translation">
          <span className="block-label">Русский перевод</span>
          <p>Русский перевод для этого билета еще не подготовлен; сверяйтесь с испанским текстом.</p>
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
                <strong>{answer.officialTextEs}</strong>
                {translation?.answerTranslations[answer.id] && <small className="answer-translation">{translation.answerTranslations[answer.id]}</small>}
                {isCorrectAnswer && <span className="answer-badge">Правильный ответ</span>}
              </div>
              <p>{answerExplanation?.explanationRu || "Пояснение для этого варианта пока не связано с материалом."}</p>
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
              <p>{selectedTopic.summaryRu}</p>
            </div>
            <div className="materials-topic-badges">
              <span>{guideStatusLabel(selectedTopic.status)}</span>
              <DifficultyIndicator level={selectedTopic.difficulty} label="Сложность темы" />
            </div>
          </div>

          <section className="materials-section" aria-labelledby="learning-material-title">
            <h3 id="learning-material-title">Короткий материал</h3>
            {selectedTopic.learningMaterialRu.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          {selectedTopic.practicalReasoningRu?.length ? (
            <section className="materials-section" aria-labelledby="practical-reasoning-title">
              <h3 id="practical-reasoning-title">Практическая логика</h3>
              {selectedTopic.practicalReasoningRu.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ) : null}

          <section className="materials-section" aria-labelledby="terms-title">
            <h3 id="terms-title">Испанские термины</h3>
            <div className="materials-term-grid">
              {selectedTopic.spanishTerms.map((term) => (
                <div className="materials-term" key={term.id}>
                  <strong>{term.termEs}</strong>
                  <p>{term.translationRu}</p>
                  <small>Связанные билеты: {term.sourceQuestionIds.join(", ")}</small>
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
                    <p>{note.textRu}</p>
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

export function App() {
  const [view, setView] = useState<View>("learn");
  const [progress, setProgress] = useState(loadProgress);

  function reset() {
    clearProgress();
    setProgress(loadProgress());
  }

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
        <button className={view === "learn" ? "active" : ""} onClick={() => setView("learn")}><BookOpen size={18} /> Учить</button>
        <button className={view === "exam" ? "active" : ""} onClick={() => setView("exam")}><ClipboardList size={18} /> Экзамен</button>
        <button className={view === "mistakes" ? "active" : ""} onClick={() => setView("mistakes")}><XCircle size={18} /> Ошибки</button>
        <button className={view === "vocabulary" ? "active" : ""} onClick={() => setView("vocabulary")}><Search size={18} /> Словарь</button>
        <button className={view === "materials" ? "active" : ""} onClick={() => setView("materials")}><BookMarked size={18} /> Материалы</button>
        <button className={view === "process" ? "active" : ""} onClick={() => setView("process")}><MapPinned size={18} /> Процесс</button>
        <button className={view === "guide" ? "active" : ""} onClick={() => setView("guide")}><Flag size={18} /> CABA/RF</button>
      </nav>

      {view === "learn" && <LearnView progress={progress} setProgress={setProgress} />}
      {view === "exam" && <ExamView progress={progress} setProgress={setProgress} />}
      {view === "mistakes" && <MistakesView progress={progress} setProgress={setProgress} />}
      {view === "vocabulary" && <VocabularyView />}
      {view === "materials" && <TopicGuideView />}
      {view === "process" && <ProcessGuideView />}
      {view === "guide" && <GuideView />}
    </main>
  );
}
