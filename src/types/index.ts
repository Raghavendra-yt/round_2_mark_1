/** Base interface for any document retrieved from Firebase. */
export interface FirebaseDoc {
  id: string;
  createdAt?: any; // Will replace 'any' with Timestamp once firebase is imported or used correctly
}

/** Represents a user in the system. */
export interface User extends FirebaseDoc {
  name: string;
  email?: string;
  photoURL?: string;
}

/** Represents a polling station or map marker. */
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  address?: string;
  type?: 'polling-station' | 'official-office' | 'drop-box';
}

/** Represents a phase in the election timeline. */
export interface ElectionPhase {
  title: string;
  short: string;
  detail: string;
  icon: string;
  tags: string[];
}

/** Represents a question in the quiz. */
export interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
  feedback: string;
  wrongFeedback: string;
}

/** Represents a score entry in the leaderboard. */
export interface QuizScore extends FirebaseDoc {
  name: string;
  score: number;
  total: number;
}
