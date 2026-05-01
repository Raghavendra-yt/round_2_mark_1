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

  const observe = useCallback((): void => {
    const items = document.querySelectorAll('.reveal');
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
    items.forEach((element) => observer.observe(element));
  }, [threshold]);

  useEffect(() => {
    observe();
    return () => {
      observerRef.current?.disconnect();
    };
  }, [observe]);
};
