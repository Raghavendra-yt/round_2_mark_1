import { memo } from 'react';
import { QuizOptionProps } from '../types';

/** Single answer option button in the quiz. */
export const QuizOption = memo(({
  letter,
  text,
  isSelected,
  isCorrect,
  isWrong,
  isAnswered,
  onSelect,
}: QuizOptionProps) => {
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
