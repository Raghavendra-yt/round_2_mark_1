import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook to trap keyboard focus within a container element.
 * Useful for modals and dialogs to ensure accessibility.
 */
export const useFocusTrap = (ref: RefObject<HTMLElement>, isActive: boolean) => {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    previousFocus.current = document.activeElement as HTMLElement;
    const container = ref.current;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [isActive, ref]);
};
