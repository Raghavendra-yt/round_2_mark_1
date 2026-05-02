import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/firebase';
import { QUIZ_LEADERBOARD_LIMIT } from '@/constants';
import { LeaderboardEntry } from '@/features/quiz/types';

/**
 * Service to manage leaderboard operations.
 * Centralizes Firestore interactions for cleaner component logic.
 */
export const leaderboardService = {
  /**
   * Subscribes to real-time leaderboard updates.
   * @param callback Function to handle new score data.
   * @returns Unsubscribe function.
   */
  subscribeToLeaderboard: (callback: (scores: LeaderboardEntry[]) => void) => {
    if (!isFirebaseConfigured || !db) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'quizScores'),
      orderBy('score', 'desc'),
      limit(QUIZ_LEADERBOARD_LIMIT)
    );

    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const scores = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[];
      callback(scores);
    }, (error) => {
      console.error('Leaderboard subscription error:', error);
      callback([]);
    });
  },

  /**
   * Saves a new score to the leaderboard.
   */
  saveScore: async (name: string, score: number, total: number) => {
    if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');

    return addDoc(collection(db, 'quizScores'), {
      name: name.trim() || 'Anonymous',
      score,
      total,
      createdAt: serverTimestamp(),
    });
  }
};
