import { useState, useRef, useEffect } from 'react';
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

const LETTERS = ['A', 'B', 'C', 'D'];

// ── Leaderboard ─────────────────────────────────────────────────────────────
function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const q = query(collection(db, 'quizScores'), orderBy('score', 'desc'), limit(5));
    getDocs(q)
      .then((snap) => {
        setScores(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!isFirebaseConfigured) return null;

  return (
    <div className="leaderboard">
      <div className="lb-title">🏆 Top Scores</div>
      {loading ? (
        <div className="lb-loading">Loading…</div>
      ) : scores.length === 0 ? (
        <div className="lb-empty">No scores yet — be the first!</div>
      ) : (
        <div className="lb-list">
          {scores.map((s, i) => (
            <div key={s.id} className={`lb-row${i === 0 ? ' lb-first' : ''}`}>
              <span className="lb-rank">{['🥇','🥈','🥉','4th','5th'][i]}</span>
              <span className="lb-name">{s.name || 'Anonymous'}</span>
              <span className="lb-score">{s.score}/{s.total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Save Score Modal ─────────────────────────────────────────────────────────
function SaveScoreModal({ score, total, onClose }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!isFirebaseConfigured) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'quizScores'), {
        name: name.trim() || 'Anonymous',
        score,
        total,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
    } catch (e) {
      console.error('Firebase save error:', e);
    }
    setSaving(false);
  };

  if (!isFirebaseConfigured) return null;

  return (
    <div className="save-modal" role="dialog" aria-label="Save your score">
      {saved ? (
        <div className="save-success">
          <span style={{ fontSize: '2rem' }}>✅</span>
          <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Score saved to leaderboard!</p>
          <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="save-modal-title">📊 Save to Leaderboard</div>
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Your score: <strong style={{ color: 'var(--accent)' }}>{score}/{total}</strong>
          </p>
          <input
            className="save-name-input"
            type="text"
            placeholder="Your name (optional)"
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            aria-label="Enter your name for the leaderboard"
          />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : '🔥 Save Score'}
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

// ── Quiz Question ────────────────────────────────────────────────────────────
function QuizQuestion({ qIdx, onAnswer }) {
  const q = questions[qIdx];
  const [selected, setSelected] = useState(null);
  const nextBtnRef = useRef(null);

  const handleOpt = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.ans) onAnswer(true);
    else onAnswer(false);
    setTimeout(() => nextBtnRef.current?.focus(), 50);
  };

  const isAnswered = selected !== null;
  const isLast = qIdx === questions.length - 1;

  return (
    <>
      <p
        aria-label={`Question ${qIdx + 1} of ${questions.length}`}
        style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}
      >
        Question {qIdx + 1} of {questions.length}
      </p>
      <p className="quiz-q" id={`q-text-${qIdx}`}>{q.q}</p>
      <div className="quiz-opts" role="radiogroup" aria-labelledby={`q-text-${qIdx}`}>
        {q.opts.map((opt, i) => {
          let extra = '';
          if (isAnswered) {
            if (i === q.ans) extra = ' correct';
            else if (i === selected) extra = ' wrong';
          }
          return (
            <button
              key={i}
              className={`quiz-opt${extra}`}
              role="radio"
              aria-checked={selected === i}
              aria-label={`${LETTERS[i]}: ${opt}`}
              disabled={isAnswered}
              onClick={() => handleOpt(i)}
            >
              <span className="opt-letter" aria-hidden="true">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div
          className={`quiz-feedback show ${selected === q.ans ? 'correct' : 'wrong'}`}
          role="alert" aria-live="assertive" aria-atomic="true"
        >
          {selected === q.ans ? q.feedback : q.wrongFeedback}
        </div>
      )}
      <div className={`quiz-next${isAnswered ? ' show' : ''}`}>
        <button className="btn-primary" ref={nextBtnRef} onClick={() => onAnswer(null)}>
          {isLast ? 'See Results →' : 'Next Question →'}
        </button>
      </div>
    </>
  );
}

// ── Score Screen ─────────────────────────────────────────────────────────────
function QuizScore({ score, total, onRetry }) {
  const [showSave, setShowSave] = useState(true);
  const msg =
    score === total
      ? 'Outstanding! You have a strong understanding of the election process.'
      : score >= 3
      ? 'Great job! Review the timeline section to strengthen any gaps.'
      : 'No worries — revisit the guide above and try again.';
  const title = score === total ? 'Perfect Score!' : score >= 3 ? 'Well Done!' : 'Keep Learning!';

  return (
    <div className="quiz-score" role="status" aria-live="polite">
      <div className="score-circle">
        <span className="score-n">{score}/{total}</span>
        <span className="score-d">Your Score</span>
      </div>
      <h3 className="score-title">{title}</h3>
      <p className="score-msg">{msg}</p>

      {showSave && isFirebaseConfigured && (
        <SaveScoreModal score={score} total={total} onClose={() => setShowSave(false)} />
      )}

      <Leaderboard />

      <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={onRetry}>
        Try Again →
      </button>
    </div>
  );
}

// ── Main Quiz ────────────────────────────────────────────────────────────────
export default function Quiz() {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const done = qIdx >= questions.length;

  const handleAnswer = (result) => {
    if (result === null) {
      setQIdx((i) => i + 1);
      setAnswered(false);
      return;
    }
    setAnswered(true);
    if (result) setScore((s) => s + 1);
  };

  const handleRetry = () => {
    setQIdx(0);
    setScore(0);
    setAnswered(false);
  };

  const pipClass = (i) => {
    if (i < qIdx) return 'quiz-pip done';
    if (i === qIdx) return 'quiz-pip current';
    return 'quiz-pip';
  };

  return (
    <section id="quiz" aria-labelledby="quiz-heading">
      <div className="section-inner">
        <p className="section-label reveal">Knowledge Check</p>
        <h2 className="section-title reveal" id="quiz-heading">
          Test What You've <em>Learned</em>
        </h2>
        <p className="section-desc reveal">
          Five questions to check your understanding. Scores are saved to our global leaderboard
          {isFirebaseConfigured ? ' via Firebase' : ''}.
        </p>
        <div className="quiz-box reveal" role="region" aria-label="Election knowledge quiz">
          <div
            className="quiz-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={qIdx}
            aria-label="Quiz progress"
          >
            {questions.map((_, i) => (
              <div key={i} className={pipClass(i)} aria-hidden="true" />
            ))}
          </div>
          <div id="quiz-content">
            {done ? (
              <QuizScore score={score} total={questions.length} onRetry={handleRetry} />
            ) : (
              <QuizQuestion key={qIdx} qIdx={qIdx} onAnswer={handleAnswer} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
