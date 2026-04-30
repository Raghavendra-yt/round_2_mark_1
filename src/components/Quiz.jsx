import { useState, useRef, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { questions } from '../data/questions';
import { db, isFirebaseConfigured } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { useEffect } from 'react';
import {
  QUIZ_LETTERS,
  QUIZ_LEADERBOARD_LIMIT,
  QUIZ_MESSAGES,
  QUIZ_TITLES,
} from '../constants';
import { sanitizeName } from '../utils/sanitize';

// ── Leaderboard ─────────────────────────────────────────────────────────────

const RANK_LABELS = ['🥇', '🥈', '🥉', '4th', '5th'];

/** Displays top quiz scores from Firebase Firestore. */
function Leaderboard() {
  const [scores, setScores]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }
    const leaderboardQuery = query(
      collection(db, 'quizScores'),
      orderBy('score', 'desc'),
      limit(QUIZ_LEADERBOARD_LIMIT)
    );
    getDocs(leaderboardQuery)
      .then((snapshot) => {
        setScores(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (!isFirebaseConfigured) return null;

  return (
    <div className="leaderboard" aria-label="Top quiz scores leaderboard">
      <div className="lb-title">🏆 Top Scores</div>
      {isLoading ? (
        <div className="lb-loading" aria-live="polite">Loading…</div>
      ) : scores.length === 0 ? (
        <div className="lb-empty">No scores yet — be the first!</div>
      ) : (
        <div className="lb-list" role="list">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className={`lb-row${index === 0 ? ' lb-first' : ''}`}
              role="listitem"
            >
              <span className="lb-rank" aria-label={`Rank ${index + 1}`}>
                {RANK_LABELS[index]}
              </span>
              <span className="lb-name">{score.name || 'Anonymous'}</span>
              <span className="lb-score" aria-label={`Score ${score.score} out of ${score.total}`}>
                {score.score}/{score.total}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SaveScoreModal ────────────────────────────────────────────────────────────

/** Modal for saving a quiz score to the Firebase leaderboard. */
function SaveScoreModal({ score, total, onClose }) {
  const [name, setName]       = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved]   = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleNameChange = useCallback((event) => {
    setName(sanitizeName(event.target.value));
  }, []);

  const handleSave = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    setIsSaving(true);
    setSaveError('');
    try {
      await addDoc(collection(db, 'quizScores'), {
        name:      sanitizeName(name) || 'Anonymous',
        score,
        total,
        createdAt: serverTimestamp(),
      });
      setIsSaved(true);
    } catch {
      setSaveError('Could not save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [name, score, total]);

  if (!isFirebaseConfigured) return null;

  return (
    <div className="save-modal" role="dialog" aria-modal="true" aria-label="Save your score">
      {isSaved ? (
        <div className="save-success">
          <span style={{ fontSize: '2rem' }} aria-hidden="true">✅</span>
          <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Score saved to leaderboard!</p>
          <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="save-modal-title">📊 Save to Leaderboard</div>
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Your score:{' '}
            <strong style={{ color: 'var(--accent)' }}>
              {score}/{total}
            </strong>
          </p>
          <input
            id="save-name-input"
            className="save-name-input"
            type="text"
            placeholder="Your name (optional)"
            value={name}
            maxLength={24}
            onChange={handleNameChange}
            aria-label="Enter your name for the leaderboard"
          />
          {saveError && (
            <p className="save-error" role="alert" aria-live="assertive">
              {saveError}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              id="save-score-btn"
              className="btn-primary"
              onClick={handleSave}
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? 'Saving…' : '🔥 Save Score'}
            </button>
            <button className="btn-outline" onClick={onClose}>
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
}

SaveScoreModal.propTypes = {
  score:   PropTypes.number.isRequired,
  total:   PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ── QuizOption ────────────────────────────────────────────────────────────────

/** Single answer option button in the quiz. */
const QuizOption = memo(function QuizOption({
  letter,
  text,
  isSelected,
  isCorrect,
  isWrong,
  isAnswered,
  onSelect,
}) {
  const extraClass = isAnswered
    ? isCorrect
      ? ' correct'
      : isWrong
      ? ' wrong'
      : ''
    : '';

  return (
    <button
      className={`quiz-opt${extraClass}`}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${letter}: ${text}`}
      disabled={isAnswered}
      onClick={onSelect}
    >
      <span className="opt-letter" aria-hidden="true">{letter}</span>
      <span>{text}</span>
    </button>
  );
});

QuizOption.displayName = 'QuizOption';
QuizOption.propTypes = {
  letter:     PropTypes.string.isRequired,
  text:       PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isCorrect:  PropTypes.bool.isRequired,
  isWrong:    PropTypes.bool.isRequired,
  isAnswered: PropTypes.bool.isRequired,
  onSelect:   PropTypes.func.isRequired,
};

// ── QuizQuestion ──────────────────────────────────────────────────────────────

/** Renders a single quiz question with answer options and feedback. */
function QuizQuestion({ questionIndex, onAnswer }) {
  const question         = questions[questionIndex];
  const [selected, setSelected] = useState(null);
  const nextButtonRef    = useRef(null);

  const isAnswered = selected !== null;
  const isLastQuestion = questionIndex === questions.length - 1;

  const handleSelectOption = useCallback((optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    onAnswer(optionIndex === question.ans);
    setTimeout(() => nextButtonRef.current?.focus(), 50);
  }, [selected, question.ans, onAnswer]);

  const handleNext = useCallback(() => onAnswer(null), [onAnswer]);

  return (
    <>
      <p
        aria-label={`Question ${questionIndex + 1} of ${questions.length}`}
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}
      >
        Question {questionIndex + 1} of {questions.length}
      </p>

      <p className="quiz-q" id={`q-text-${questionIndex}`}>
        {question.q}
      </p>

      <div className="quiz-opts" role="radiogroup" aria-labelledby={`q-text-${questionIndex}`}>
        {question.opts.map((optionText, optionIndex) => (
          <QuizOption
            key={optionIndex}
            letter={QUIZ_LETTERS[optionIndex]}
            text={optionText}
            isSelected={selected === optionIndex}
            isCorrect={isAnswered && optionIndex === question.ans}
            isWrong={isAnswered && optionIndex === selected && optionIndex !== question.ans}
            isAnswered={isAnswered}
            onSelect={() => handleSelectOption(optionIndex)}
          />
        ))}
      </div>

      {isAnswered && (
        <div
          className={`quiz-feedback show ${selected === question.ans ? 'correct' : 'wrong'}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {selected === question.ans ? question.feedback : question.wrongFeedback}
        </div>
      )}

      <div className={`quiz-next${isAnswered ? ' show' : ''}`}>
        <button
          id="quiz-next-btn"
          className="btn-primary"
          ref={nextButtonRef}
          onClick={handleNext}
        >
          {isLastQuestion ? 'See Results →' : 'Next Question →'}
        </button>
      </div>
    </>
  );
}

QuizQuestion.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  onAnswer:      PropTypes.func.isRequired,
};

// ── QuizScore ─────────────────────────────────────────────────────────────────

/** Score screen shown after all questions have been answered. */
function QuizScore({ score, total, onRetry }) {
  const [showSaveModal, setShowSaveModal] = useState(true);

  const isPerfect = score === total;
  const isGood    = score >= Math.ceil(total * 0.6);

  const message = isPerfect
    ? QUIZ_MESSAGES.perfect
    : isGood
    ? QUIZ_MESSAGES.great
    : QUIZ_MESSAGES.keep;

  const title = isPerfect
    ? QUIZ_TITLES.perfect
    : isGood
    ? QUIZ_TITLES.great
    : QUIZ_TITLES.keep;

  return (
    <div className="quiz-score" role="status" aria-live="polite">
      <div className="score-circle" aria-label={`Score: ${score} out of ${total}`}>
        <span className="score-n">{score}/{total}</span>
        <span className="score-d">Your Score</span>
      </div>
      <h3 className="score-title">{title}</h3>
      <p className="score-msg">{message}</p>

      {showSaveModal && isFirebaseConfigured && (
        <SaveScoreModal
          score={score}
          total={total}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      <Leaderboard />

      <button
        id="quiz-retry-btn"
        className="btn-primary"
        style={{ marginTop: '2rem' }}
        onClick={onRetry}
      >
        Try Again →
      </button>
    </div>
  );
}

QuizScore.propTypes = {
  score:   PropTypes.number.isRequired,
  total:   PropTypes.number.isRequired,
  onRetry: PropTypes.func.isRequired,
};

// ── Quiz (main) ───────────────────────────────────────────────────────────────

/** Interactive election knowledge quiz with progress indicators. */
function Quiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore]                 = useState(0);
  const [isAnswered, setIsAnswered]       = useState(false);

  const isDone = questionIndex >= questions.length;

  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect === null) {
      // Advance to next question
      setQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
      return;
    }
    setIsAnswered(true);
    if (isCorrect) setScore((prev) => prev + 1);
  }, []);

  const handleRetry = useCallback(() => {
    setQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
  }, []);

  const getPipClass = useCallback((pipIndex) => {
    if (pipIndex < questionIndex) return 'quiz-pip done';
    if (pipIndex === questionIndex) return 'quiz-pip current';
    return 'quiz-pip';
  }, [questionIndex]);

  return (
    <section id="quiz" aria-labelledby="quiz-heading">
      <div className="section-inner">
        <p className="section-label reveal">Knowledge Check</p>
        <h2 className="section-title reveal" id="quiz-heading">
          Test What You've <em>Learned</em>
        </h2>
        <p className="section-desc reveal">
          {questions.length} questions to check your understanding. Scores are saved to our global
          leaderboard{isFirebaseConfigured ? ' via Firebase' : ''}.
        </p>

        <div
          className="quiz-box reveal"
          role="region"
          aria-label={isAnswered ? 'Quiz — answer submitted' : 'Election knowledge quiz'}
        >
          <div
            className="quiz-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={questionIndex}
            aria-label="Quiz progress"
          >
            {questions.map((_, pipIndex) => (
              <div
                key={pipIndex}
                className={getPipClass(pipIndex)}
                aria-hidden="true"
              />
            ))}
          </div>

          <div id="quiz-content">
            {isDone ? (
              <QuizScore
                score={score}
                total={questions.length}
                onRetry={handleRetry}
              />
            ) : (
              <QuizQuestion
                key={questionIndex}
                questionIndex={questionIndex}
                onAnswer={handleAnswer}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Quiz };
