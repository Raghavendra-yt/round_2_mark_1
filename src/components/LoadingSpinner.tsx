import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Props for the LoadingSpinner component.
 */
interface LoadingSpinnerProps {
  /** ARIA label to describe what is being loaded. */
  label?: string;
}

/**
 * Generic loading spinner used during Suspense fallbacks and async operations.
 * Announces the loading state to screen readers via aria-live.
 * 
 * @component
 */
export const LoadingSpinner = memo(({ label = 'Loading…' }: LoadingSpinnerProps) => {
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
});

LoadingSpinner.displayName = 'LoadingSpinner';

LoadingSpinner.propTypes = {
  label: PropTypes.string,
};
