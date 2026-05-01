import { useState, useCallback } from 'react';
import { questions } from '@/data/questions';

/**
 * Custom hook to manage the quiz state.
 */
export const useQuiz = () => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const isDone = questionIndex >= questions.length;

  const handleAnswer = useCallback((isCorrect: boolean | null) => {
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

  const getPipClass = useCallback((pipIndex: number) => {
    if (pipIndex < questionIndex) return 'quiz-pip done';
    if (pipIndex === questionIndex) return 'quiz-pip current';
    return 'quiz-pip';
  }, [questionIndex]);

  return {
    questionIndex,
    score,
    isAnswered,
    isDone,
    handleAnswer,
    handleRetry,
    getPipClass,
  };
};
