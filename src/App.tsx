import { BookOpen, CheckCircle2, ClipboardList, Flag, Image as ImageIcon, RotateCcw, Search, Timer, XCircle } from "lucide-react";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { data, assetUrl, explanationByQuestion, sourceById, translationByQuestion, type ProgressAnswer, type Question } from "./data/content";
import { isPassing, mistakesFromHistory, scorePercent, selectExamSet } from "./domain";
import { clearProgress, loadProgress, saveProgress, type StoredProgress } from "./storage";
import { searchQuestions, searchVocabulary } from "./search";

type View = "learn" | "exam" | "mistakes" | "vocabulary" | "guide";

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

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(Math.max(totalSeconds, 0) / 60);
  const seconds = Math.max(totalSeconds, 0) % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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
  allowRepeatedAnswers = false
}: {
  question: Question;
  mode: "learning" | "exam" | "mistakes";
  onAnswered: (answer: ProgressAnswer) => void;
  difficult: boolean;
  onToggleDifficult: () => void;
  revealAfterAnswer?: boolean;
  allowRepeatedAnswers?: boolean;
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
        <span>Категория B</span>
        <span>{question.jurisdiction}</span>
        <span>{question.topics.map(topicLabel).join(", ")}</span>
        {question.flags.hasNegationOrException && <span className="warning">есть отрицание/ловушка</span>}
      </div>

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
  const results = useMemo(() => searchQuestions(query), [query]);
  const question = results[index % Math.max(results.length, 1)] || data.questions[0];
  const difficult = progress.difficultQuestionIds.includes(question.id);

  function record(answer: ProgressAnswer) {
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

  return (
    <section className="workspace">
      <div className="toolbar">
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по испанскому, русскому, теме" />
        </label>
        <button type="button" className="tool-button" onClick={() => setIndex((value) => value + 1)}>
          Следующий
        </button>
      </div>
      <QuestionCard key={question.id} question={question} mode="learning" onAnswered={record} difficult={difficult} onToggleDifficult={toggleDifficult} />
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
          <p key={mistake.questionId}><strong>{mistake.wrong}x</strong> {mistake.questionId}</p>
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
        <button className={view === "guide" ? "active" : ""} onClick={() => setView("guide")}><Flag size={18} /> CABA/RF</button>
      </nav>

      {view === "learn" && <LearnView progress={progress} setProgress={setProgress} />}
      {view === "exam" && <ExamView progress={progress} setProgress={setProgress} />}
      {view === "mistakes" && <MistakesView progress={progress} setProgress={setProgress} />}
      {view === "vocabulary" && <VocabularyView />}
      {view === "guide" && <GuideView />}
    </main>
  );
}
