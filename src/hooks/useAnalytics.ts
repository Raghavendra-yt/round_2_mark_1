import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics, isFirebaseConfigured } from '@/firebase';

/**
 * Hook to handle Google Analytics tracking.
 * Provides a unified interface for logging events and handles route tracking.
 */
export const useAnalytics = (activeSection?: string) => {
  // Track "page views" when the active section changes (for our single-page app)
  useEffect(() => {
    if (isFirebaseConfigured && analytics && activeSection) {
      logEvent(analytics, 'page_view', {
        page_title: activeSection,
        page_path: `/#${activeSection}`,
      });
    }
  }, [activeSection]);

  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (isFirebaseConfigured && analytics) {
      logEvent(analytics, eventName, params);
    }
  };

  const trackError = (message: string, componentName: string) => {
    trackEvent('app_error', {
      error_message: message,
      component_name: componentName,
    });
  };

  return { trackEvent, trackError };
};
