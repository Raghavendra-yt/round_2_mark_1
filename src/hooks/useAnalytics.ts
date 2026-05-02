import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics, isFirebaseConfigured } from '@/firebase';

/**
 * Interface representing the return value of the useAnalytics hook.
 */
interface UseAnalyticsReturn {
  trackEvent: (eventName: string, params?: Record<string, any>) => void;
  trackError: (message: string, componentName: string) => void;
}

/**
 * Hook to handle Google Analytics tracking.
 * Provides a unified interface for logging events and handles section-based route tracking.
 * 
 * @param {string} [activeSection] - The currently visible section ID to track as a page view.
 * @returns {UseAnalyticsReturn} Unified analytics tracking functions.
 */
export const useAnalytics = (activeSection?: string): UseAnalyticsReturn => {
  // Track "page views" when the active section changes (for our single-page app)
  useEffect(() => {
    if (isFirebaseConfigured && analytics && activeSection) {
      logEvent(analytics, 'page_view', {
        page_title: activeSection,
        page_path: `/#${activeSection}`,
      });
    }
  }, [activeSection]);

  /**
   * Logs a custom event to Firebase Analytics.
   */
  const trackEvent = (eventName: string, params?: Record<string, any>): void => {
    if (isFirebaseConfigured && analytics) {
      logEvent(analytics, eventName, params);
    }
  };

  /**
   * Logs an application error as an analytics event.
   */
  const trackError = (message: string, componentName: string): void => {
    trackEvent('app_error', {
      error_message: message,
      component_name: componentName,
    });
  };

  return { trackEvent, trackError };
};
