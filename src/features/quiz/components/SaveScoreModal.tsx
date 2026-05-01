import { useState, useCallback, ChangeEvent, useRef } from 'react';
import { db, isFirebaseConfigured } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sanitizeName } from '@/utils/sanitize';
import { SaveScoreModalProps } from '../types';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useAnalytics } from '@/hooks/useAnalytics';

/** Modal for saving a quiz score to the Firebase leaderboard. */
export const SaveScoreModal = ({ score, total, onClose }: SaveScoreModalProps) => {
  const [name, setName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  // Trap focus within the modal for accessibility
  useFocusTrap(modalRef, true);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(sanitizeName(event.target.value));
  }, []);

  const handleSave = useCallback(async () => {
    if (!isFirebaseConfigured || !db) return;
    
    const finalName = sanitizeName(name).trim() || 'Anonymous';
    if (finalName.length > 32) {
      setSaveError('Name is too long (max 32 characters).');
      return;
    }
    
    if (typeof score !== 'number' || typeof total !== 'number') {
      setSaveError('Invalid score data.');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      await addDoc(collection(db, 'quizScores'), {
        name: finalName,
        score,
        total,
        createdAt: serverTimestamp(),
      });
      setIsSaved(true);
      trackEvent('quiz_score_save', { score, total });
    } catch (err: unknown) {
      console.error('Save score error:', err);
      setSaveError('Could not save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [name, score, total]);

  if (!isFirebaseConfigured) return null;

  return (
    <div 
      className="save-modal" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="save-score-title"
      ref={modalRef}
    >
      {isSaved ? (
        <div className="save-success" aria-live="polite">
          <span style={{ fontSize: '2rem' }} aria-hidden="true">✅</span>
          <p id="save-score-title" style={{ marginTop: '0.5rem', fontWeight: 600 }}>Score saved to leaderboard!</p>
          <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={onClose} autoFocus>
            Close
          </button>
        </div>
      ) : (
        <>
          <div id="save-score-title" className="save-modal-title">📊 Save to Leaderboard</div>
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Your score:{' '}
            <strong style={{ color: 'var(--accent)' }}>
              {score}/{total}
            </strong>
          </p>
          
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <label htmlFor="save-name-input" className="sr-only">Enter your name for the leaderboard</label>
            <input
              id="save-name-input"
              className="save-name-input"
              type="text"
              placeholder="Your name (optional)"
              value={name}
              maxLength={24}
              onChange={handleNameChange}
            />
          </div>

          {saveError && (
            <p className="save-error" role="alert" aria-live="assertive">
              {saveError}
            </p>
          )}
          
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              id="save-score-btn"
              className="btn-primary"
              onClick={handleSave}
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? 'Saving…' : '🔥 Save Score'}
            </button>
            <button className="btn-outline" onClick={onClose}>
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
};
