import { useState, useEffect, useRef } from 'react';

const HELP_OPTIONS = [
  {
    id: 'police',
    className: 'hi-police',
    icon: '🚔',
    label: 'Call Police',
    sub: 'Emergency: 911',
    number: '911',
  },
  {
    id: 'emergency',
    className: 'hi-emergency',
    icon: '🚨',
    label: 'Emergency',
    sub: 'General emergency line',
    number: '911',
  },
  {
    id: 'medical',
    className: 'hi-medical',
    icon: '🏥',
    label: 'Medical Support',
    sub: 'Ambulance: 911',
    number: '911',
  },
  {
    id: 'ambulance',
    className: 'hi-ambulance',
    icon: '🚑',
    label: 'Ambulance',
    sub: 'EMS dispatch',
    number: '911',
  },
  {
    id: 'fire',
    className: 'hi-fire',
    icon: '🔥',
    label: 'Fire Department',
    sub: 'Fire emergency: 911',
    number: '911',
  },
  {
    id: 'sos',
    className: 'hi-sos',
    icon: '🆘',
    label: 'SOS',
    sub: 'International distress',
    number: '112',
  },
];

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click / Escape key
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleCall = (option) => {
    // Attempt to open tel: link; on desktop it may open the dialer app
    window.location.href = `tel:${option.number}`;
    setOpen(false);
  };

  return (
    <div className="help-fab" ref={ref} role="complementary" aria-label="Emergency help">
      {open && (
        <div className="help-menu" role="dialog" aria-label="Emergency options" aria-modal="false">
          <div className="help-menu-title">🆘 Emergency Help</div>
          {HELP_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`help-item ${opt.className}`}
              aria-label={`${opt.label} — ${opt.sub}`}
              onClick={() => handleCall(opt)}
            >
              <div className="help-item-icon" aria-hidden="true">
                {opt.icon}
              </div>
              <div className="help-item-text">
                <span className="help-item-label">{opt.label}</span>
                <span className="help-item-sub">{opt.sub}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        className={`help-trigger${open ? ' open' : ''}`}
        aria-label={open ? 'Close emergency menu' : 'Open emergency help menu'}
        aria-expanded={open}
        aria-controls="help-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {!open && <span className="help-pulse" aria-hidden="true" />}
        <span aria-hidden="true">{open ? '✕' : '🆘'}</span>
      </button>
    </div>
  );
}
