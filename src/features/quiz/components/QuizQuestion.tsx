import { useState, useRef, useCallback } from 'react';
import { questions } from '@/data/questions';
import { QUIZ_LETTERS } from '@/constants';
import { QuizOption } from './QuizOption';
import { QuizQuestionProps } from '../types';
import { useAnalytics } from '@/hooks/useAnalytics';

/** Renders a single quiz question with answer options and feedback. */
export const QuizQuestion = ({ questionIndex, onAnswer }: QuizQuestionProps) => {
  const question = questions[questionIndex];
  const [selected, setSelected] = useState<number | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const { trackEvent } = useAnalytics();

  const isAnswered = selected !== null;
  const isLastQuestion = questionIndex === questions.length - 1;

  const handleSelectOption = useCallback((optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === question.ans;
    onAnswer(isCorrect);
    
    trackEvent('quiz_answer', {
      question_index: questionIndex,
      is_correct: isCorrect,
    });

    setTimeout(() => nextButtonRef.current?.focus(), 50);
  }, [selected, question.ans, onAnswer, questionIndex, trackEvent]);

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
};
