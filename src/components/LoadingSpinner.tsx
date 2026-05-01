interface LoadingSpinnerProps {
  label?: string;
}

/**
 * Generic loading spinner used during Suspense fallbacks.
 * Announces the loading state to screen readers via aria-label.
 */
export const LoadingSpinner = ({ label = 'Loading…' }: LoadingSpinnerProps) => {
  return (
    <div
      className="loading-spinner-container"
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <div className="loading-spinner" aria-hidden="true" />
      <span className="loading-spinner-text">{label}</span>
    </div>
  );
};
