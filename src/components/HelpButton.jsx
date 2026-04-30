import { useState, useEffect, useRef, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

const HELP_OPTIONS = [
  { id: 'police',    className: 'hi-police',    icon: '🚔', label: 'Call Police',      sub: 'Emergency: 911',          number: '911' },
  { id: 'emergency', className: 'hi-emergency', icon: '🚨', label: 'Emergency',        sub: 'General emergency line',  number: '911' },
  { id: 'medical',   className: 'hi-medical',   icon: '🏥', label: 'Medical Support',  sub: 'Ambulance: 911',          number: '911' },
  { id: 'ambulance', className: 'hi-ambulance', icon: '🚑', label: 'Ambulance',        sub: 'EMS dispatch',            number: '911' },
  { id: 'fire',      className: 'hi-fire',       icon: '🔥', label: 'Fire Department', sub: 'Fire emergency: 911',     number: '911' },
  { id: 'sos',       className: 'hi-sos',        icon: '🆘', label: 'SOS',             sub: 'International distress',  number: '112' },
];

/** Single emergency option in the help menu. */
const HelpOption = memo(function HelpOption({ option, onSelect }) {
  return (
    <button
      className={`help-item ${option.className}`}
      aria-label={`${option.label} — ${option.sub}`}
      onClick={() => onSelect(option)}
    >
      <div className="help-item-icon" aria-hidden="true">{option.icon}</div>
      <div className="help-item-text">
        <span className="help-item-label">{option.label}</span>
        <span className="help-item-sub">{option.sub}</span>
      </div>
    </button>
  );
});

HelpOption.displayName = 'HelpOption';
HelpOption.propTypes = {
  option: PropTypes.shape({
    id:        PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    icon:      PropTypes.string.isRequired,
    label:     PropTypes.string.isRequired,
    sub:       PropTypes.string.isRequired,
    number:    PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

/** Floating emergency help button (SOS) with expandable quick-dial menu. */
function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleCall = useCallback((option) => {
    window.location.href = `tel:${option.number}`;
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div
      className="help-fab"
      ref={containerRef}
      role="complementary"
      aria-label="Emergency help"
    >
      {isOpen && (
        <div
          id="help-menu"
          className="help-menu"
          role="dialog"
          aria-label="Emergency options"
          aria-modal="false"
        >
          <div className="help-menu-title">🆘 Emergency Help</div>
          {HELP_OPTIONS.map((option) => (
            <HelpOption key={option.id} option={option} onSelect={handleCall} />
          ))}
        </div>
      )}

      <button
        id="help-trigger-btn"
        className={`help-trigger${isOpen ? ' open' : ''}`}
        aria-label={isOpen ? 'Close emergency menu' : 'Open emergency help menu'}
        aria-expanded={isOpen}
        aria-controls="help-menu"
        onClick={handleToggle}
      >
        {!isOpen && <span className="help-pulse" aria-hidden="true" />}
        <span aria-hidden="true">{isOpen ? '✕' : '🆘'}</span>
      </button>
    </div>
  );
}

export { HelpButton };
