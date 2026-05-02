import { useEffect, useRef, useCallback } from 'react';
import { INTERSECTION_THRESHOLD } from '../constants';

/**
 * Observes all elements with class `.reveal` and adds `.visible`
 * when they intersect the viewport. Cleans up on unmount.
 *
 * @param {number} [threshold] - Intersection threshold (0–1).
 */
export const useScrollReveal = (threshold: number = INTERSECTION_THRESHOLD): void => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback((): IntersectionObserver => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
    const observer = setupObserver();
    
    // 1. Observe existing items
    const observeExisting = () => {
      const items = document.querySelectorAll('.reveal:not(.visible)');
      items.forEach((el) => observer.observe(el));
    };

    observeExisting();

    // 2. Use MutationObserver to detect lazily loaded components adding .reveal elements
    const mutationObserver = new MutationObserver(() => {
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
