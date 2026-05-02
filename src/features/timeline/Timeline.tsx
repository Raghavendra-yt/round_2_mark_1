import { useState, useRef, memo, useCallback, KeyboardEvent, RefObject } from 'react';
import PropTypes from 'prop-types';
import { phases } from '@/data/phases';

/**
 * Election Phase data structure.
 */
interface Phase {
  /** Emoji or icon representation. */
  icon: string;
  /** Primary title of the phase. */
  title: string;
  /** Short summary of the phase. */
  short: string;
  /** Detailed explanation of the phase. */
  detail: string;
  /** Array of related keywords or tags. */
  tags: string[];
}

/**
 * Props for the TimelineItem component.
 */
interface TimelineItemProps {
  /** The phase data to display. */
  phase: Phase;
  /** The index of this item in the timeline. */
  index: number;
  /** Whether this item is currently selected. */
  isActive: boolean;
  /** Callback triggered when the item is selected. */
  onSelect: (index: number) => void;
}

/**
 * Props for the PhasePanel component.
 */
interface PhasePanelProps {
  /** The currently active phase data. */
  phase: Phase;
  /** Ref to the panel element for focus management. */
  panelRef: RefObject<HTMLDivElement>;
}

/** 
 * A single election phase row in the timeline list.
 * Supports keyboard navigation (Enter, Space, Arrows).
 * 
 * @component
 */
const TimelineItem = memo(({ phase, index, isActive, onSelect }: TimelineItemProps) => {
  /**
   * Handles keyboard interaction for accessibility.
   * @param {KeyboardEvent<HTMLDivElement>} event - The keyboard event.
   */
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(index);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      onSelect(Math.min(index + 1, phases.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      onSelect(Math.max(index - 1, 0));
    }
  }, [index, onSelect]);

  /** Handles click events. */
  const handleClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <div
      className={`tl-item${isActive ? ' active' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Phase ${index + 1}: ${phase.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="tl-num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="tl-content">
        <h3>{phase.title}</h3>
        <p>{phase.short}</p>
      </div>
    </div>
  );
});

TimelineItem.displayName = 'TimelineItem';

TimelineItem.propTypes = {
  phase: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    short: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

/** 
 * Detail panel for the currently selected election phase.
 * Announces changes to screen readers via aria-live.
 * 
 * @component
 */
const PhasePanel = memo(({ phase, panelRef }: PhasePanelProps) => {
  return (
    <div
      className="tl-panel reveal"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Phase details"
      id="tl-panel"
      tabIndex={-1}
      ref={panelRef}
    >
      <div className="tl-panel-icon" aria-hidden="true">{phase.icon}</div>
      <h2>{phase.title}</h2>
      <p>{phase.detail}</p>
      <div className="tl-tags" aria-label="Related topics">
        {phase.tags.map((tag) => (
          <span key={tag} className="tl-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
});

PhasePanel.displayName = 'PhasePanel';

PhasePanel.propTypes = {
  phase: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    short: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  panelRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]).isRequired,
};

/** 
 * Interactive election timeline — select a phase to view details.
 * Coordinates state between the timeline list and the detail panel.
 * 
 * @component
 */
export const Timeline = memo(() => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * Updates the active phase and moves focus to the detail panel.
   * @param {number} index - The index of the selected phase.
   */
  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
    panelRef.current?.focus();
  }, []);

  const activePhase = phases[activeIndex] as Phase;

  return (
    <section id="timeline" aria-labelledby="tl-heading">
      <div className="section-inner">
        <p className="section-label reveal">The Election Timeline</p>
        <h2 className="section-title reveal" id="tl-heading">
          From Candidacy to <em>Certification</em>
        </h2>
        <p className="section-desc reveal">
          Every election follows a structured timeline. Click each phase to learn more about what
          happens and why it matters.
        </p>

        <div className="timeline-wrap reveal-stagger">
          <div
            className="timeline-list reveal"
            role="list"
            aria-label="Election phases — select a phase to view details"
            id="tl-list"
          >
            {phases.map((phase, index) => (
              <TimelineItem
                key={phase.title}
                phase={phase as Phase}
                index={index}
                isActive={index === activeIndex}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <PhasePanel phase={activePhase} panelRef={panelRef} />
        </div>
      </div>
    </section>
  );
});

Timeline.displayName = 'Timeline';
