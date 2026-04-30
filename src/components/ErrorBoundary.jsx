import React from 'react';

/**
 * ErrorBoundary catches rendering errors in child components and renders
 * a user-friendly fallback instead of a blank page.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message ?? 'Unknown error' };
  }

  componentDidCatch(error, info) {
    // In production, forward to an error-reporting service here
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <div className="error-boundary-icon" aria-hidden="true">⚠️</div>
          <h2 className="error-boundary-title">Something went wrong</h2>
          <p className="error-boundary-message">
            This section encountered an error and could not load.
          </p>
          <button
            className="btn-outline"
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
