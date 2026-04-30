import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to each element matching the selector
 * and adds the 'visible' class when they enter the viewport.
 */
export function useScrollReveal(selector = '.reveal', threshold = 0.12) {
  useEffect(() => {
    const items = document.querySelectorAll(selector);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/**
 * Attaches an IntersectionObserver to animate width of elements with
 * a data-target attribute (used for category bar fills).
 */
export function useCatBarAnimation() {
  useEffect(() => {
    const fills = document.querySelectorAll('.cat-fill');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const target = e.target.getAttribute('data-target');
            e.target.style.width = target + '%';
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    fills.forEach((f) => io.observe(f));
    return () => io.disconnect();
  });
}
