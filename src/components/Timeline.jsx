import { useState, useRef } from 'react';
import { phases } from '../data/phases';

export default function Timeline() {
  const [activeIdx, setActiveIdx] = useState(0);
  const panelRef = useRef(null);

  const phase = phases[activeIdx];

  const handleSelect = (idx) => {
    setActiveIdx(idx);
    panelRef.current?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(idx);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleSelect(Math.min(idx + 1, phases.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleSelect(Math.max(idx - 1, 0));
    }
  };

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
          {/* List */}
          <div
            className="timeline-list reveal"
            role="list"
            aria-label="Election phases — select a phase to view details"
            id="tl-list"
          >
            {phases.map((ph, i) => (
              <div
                key={ph.title}
                className={`tl-item${i === activeIdx ? ' active' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={i === activeIdx}
                aria-label={`Phase ${i + 1}: ${ph.title}`}
                onClick={() => handleSelect(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              >
                <div className="tl-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="tl-content">
                  <h3>{ph.title}</h3>
                  <p>{ph.short}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Panel */}
          <div
            className="tl-panel reveal"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Phase details"
            id="tl-panel"
            tabIndex={-1}
            ref={panelRef}
          >
            <div className="tl-panel-icon" aria-hidden="true">
              {phase.icon}
            </div>
            <h2>{phase.title}</h2>
            <p>{phase.detail}</p>
            <div className="tl-tags" aria-label="Related topics">
              {phase.tags.map((tag) => (
                <span key={tag} className="tl-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
