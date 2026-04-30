import { useState, useRef, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { phases } from '../data/phases';

/** A single election phase row in the timeline list. */
const TimelineItem = memo(function TimelineItem({ phase, index, isActive, onSelect }) {
  const handleKeyDown = useCallback((event) => {
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

  return (
    <div
      className={`tl-item${isActive ? ' active' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Phase ${index + 1}: ${phase.title}`}
      onClick={() => onSelect(index)}
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
    title: PropTypes.string.isRequired,
    short: PropTypes.string.isRequired,
  }).isRequired,
  index:    PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

/** Detail panel for the currently selected election phase. */
const PhasePanel = memo(function PhasePanel({ phase, panelRef }) {
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
    icon:   PropTypes.string.isRequired,
    title:  PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    tags:   PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  panelRef: PropTypes.object.isRequired,
};

/** Interactive election timeline — select a phase to view details. */
function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef(null);

  const handleSelect = useCallback((index) => {
    setActiveIndex(index);
    panelRef.current?.focus();
  }, []);

  const activePhase = phases[activeIndex];

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
                phase={phase}
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
}

export { Timeline };
