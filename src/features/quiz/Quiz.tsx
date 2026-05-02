import React, { memo } from 'react';
import { questions } from '@/data/questions';
import { isFirebaseConfigured } from '@/firebase';
import { useQuiz } from './hooks/useQuiz';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizScore } from './components/QuizScore';

/** 
 * Interactive election knowledge quiz with progress indicators.
 * Manages the transition between questions and the final score screen.
 * 
 * @component
 */
export const Quiz: React.FC = memo(() => {
  const {
    questionIndex,
    score,
    isAnswered,
    isDone,
    handleAnswer,
    handleRetry,
    getPipClass,
  } = useQuiz();

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
});

Quiz.displayName = 'Quiz';
