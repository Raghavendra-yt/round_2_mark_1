import { useState, useEffect, useCallback } from 'react';
import { SECTION_IDS } from '@/constants';

/**
 * Tracks which section is currently visible in the viewport.
 * Uses IntersectionObserver with a 30% threshold.
 *
 * @returns {string} ID of the currently active section.
 */
export const useActiveSection = (): string => {
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0]);

  const observe = useCallback((): IntersectionObserver => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return observer;
  }, []);

  useEffect(() => {
    const observer = observe();
    return () => observer.disconnect();
  }, [observe]);

  return activeSection;
};
