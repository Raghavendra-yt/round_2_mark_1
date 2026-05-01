import { useState } from 'react';
import { isFirebaseConfigured } from '@/firebase';
import { QUIZ_MESSAGES, QUIZ_TITLES } from '@/constants';
import { SaveScoreModal } from './SaveScoreModal';
import { Leaderboard } from './Leaderboard';
import { QuizScoreProps } from '../types';

/** Score screen shown after all questions have been answered. */
export const QuizScore = ({ score, total, onRetry }: QuizScoreProps) => {
  const [showSaveModal, setShowSaveModal] = useState<boolean>(true);

  const isPerfect = score === total;
  const isGood = score >= Math.ceil(total * 0.6);

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
};
