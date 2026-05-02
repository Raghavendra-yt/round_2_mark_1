import { useState, useEffect } from 'react';
import { isFirebaseConfigured } from '@/firebase';
import { leaderboardService } from '@/services/leaderboardService';
import { LeaderboardEntry } from '../types';

const RANK_LABELS = ['🥇', '🥈', '🥉', '4th', '5th'];

/** Displays top quiz scores from Firebase Firestore with real-time updates. */
export const Leaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Use service for real-time syncing
    const unsubscribe = leaderboardService.subscribeToLeaderboard((newScores) => {
      setScores(newScores);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isFirebaseConfigured) return null;

  return (
    <div className="leaderboard" aria-label="Top quiz scores leaderboard">
      <div className="lb-title">🏆 Top Scores</div>
      {isLoading ? (
        <div className="lb-loading" aria-live="polite">Loading…</div>
      ) : scores.length === 0 ? (
        <div className="lb-empty">No scores yet — be the first!</div>
      ) : (
        <div className="lb-list" role="list">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className={`lb-row${index === 0 ? ' lb-first' : ''}`}
              role="listitem"
            >
              <span className="lb-rank" aria-label={`Rank ${index + 1}`}>
                {RANK_LABELS[index]}
              </span>
              <span className="lb-name">{score.name || 'Anonymous'}</span>
              <span className="lb-score" aria-label={`Score ${score.score} out of ${score.total}`}>
                {score.score}/{score.total}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
