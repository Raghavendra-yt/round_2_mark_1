import { useEffect, useRef, useCallback } from 'react';
import { INTERSECTION_THRESHOLD } from '@/constants';

/**
 * Observes all elements with class `.reveal` and adds `.visible`
 * when they intersect the viewport. Cleans up on unmount.
 * 
 * Supports dynamic content by utilizing both IntersectionObserver and MutationObserver.
 * 
 * @param {number} [threshold] - Intersection threshold (0–1).
 */
export const useScrollReveal = (threshold: number = INTERSECTION_THRESHOLD): void => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Configures the intersection observer for .reveal elements.
   */
  const setupObserver = useCallback((): IntersectionObserver => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    observerRef.current = observer;
    return observer;
  }, [threshold]);

  useEffect(() => {
    const observer: IntersectionObserver = setupObserver();
    
    /**
     * Finds and observes all reveal elements not yet visible.
     */
    const observeExisting = (): void => {
      const items: NodeListOf<Element> = document.querySelectorAll('.reveal:not(.visible)');
      items.forEach((el: Element) => observer.observe(el));
    };

    observeExisting();

    /**
     * Detects lazily loaded components adding .reveal elements to the DOM.
     */
    const mutationObserver: MutationObserver = new MutationObserver((): void => {
      observeExisting();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [setupObserver]);
};
