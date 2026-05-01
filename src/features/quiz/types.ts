import { QuizScore } from '@/types';

export interface QuizOptionProps {
  letter: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isAnswered: boolean;
  onSelect: () => void;
}

export interface QuizQuestionProps {
  questionIndex: number;
  onAnswer: (isCorrect: boolean | null) => void;
}

export interface QuizScoreProps {
  score: number;
  total: number;
  onRetry: () => void;
}

export interface SaveScoreModalProps {
  score: number;
  total: number;
  onClose: () => void;
}

export interface LeaderboardEntry extends QuizScore {
  name: string;
  score: number;
  total: number;
}
