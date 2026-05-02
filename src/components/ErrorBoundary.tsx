import React, { ErrorInfo } from 'react';
import PropTypes from 'prop-types';

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /** The content to be wrapped by the error boundary. */
  children: React.ReactNode;
  /** Optional custom fallback UI to display when an error occurs. */
  fallback?: React.ReactNode;
  /** Optional name of the component being wrapped for better error reporting. */
  componentName?: string;
}

/**
 * State for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught. */
  hasError: boolean;
  /** The message of the caught error. */
  errorMessage: string;
}

/**
 * Generic Error Boundary to catch UI errors and prevent app crashes.
 * Implements standard React Error Boundary lifecycle methods.
 * 
 * @component
 * @example
 * <ErrorBoundary componentName="MyComponent">
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  /**
   * Updates state so the next render will show the fallback UI.
   * @param {Error} error - The error that was thrown.
   * @returns {ErrorBoundaryState} - The updated state.
   */
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  /**
   * Lifecycle method to catch errors in child components.
   * Logs error details for analysis (production implementation would send to a service).
   * @param {Error} _error - The error that was thrown.
   * @param {ErrorInfo} _errorInfo - Information about the component stack.
   */
  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // Production: Send to error reporting service like Sentry or LogRocket
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback" role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong{this.props.componentName ? ` in ${this.props.componentName}` : ''}.</h2>
          <p>{this.state.errorMessage}</p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  componentName: PropTypes.string,
};

export default ErrorBoundary;
