import { useEffect, useRef, useCallback } from 'react';
import { INTERSECTION_THRESHOLD } from '../constants';

/**
 * Observes all elements with class `.reveal` and adds `.visible`
 * when they intersect the viewport. Cleans up on unmount.
 *
 * @param {number} [threshold] - Intersection threshold (0–1).
 */
export function useScrollReveal(threshold = INTERSECTION_THRESHOLD) {
  const observerRef = useRef(null);

  const observe = useCallback(() => {
    const items = document.querySelectorAll('.reveal');
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    items.forEach((element) => observerRef.current?.observe(element));
  }, [threshold]);

  useEffect(() => {
    observe();
    return () => {
      observerRef.current?.disconnect();
    };
  }, [observe]);
}
