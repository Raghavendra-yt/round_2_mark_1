export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  dateCompleted: string;
}

export interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  address: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
