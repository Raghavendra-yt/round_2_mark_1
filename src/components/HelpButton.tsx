import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface HelpOptionData {
  id: string;
  className: string;
  icon: string;
  label: string;
  sub: string;
  number: string;
}

interface HelpOptionProps {
  option: HelpOptionData;
  onSelect: (option: HelpOptionData) => void;
}

const HELP_OPTIONS: HelpOptionData[] = [
  { id: 'police', className: 'hi-police', icon: '🚔', label: 'Call Police', sub: 'Emergency: 911', number: '911' },
  { id: 'emergency', className: 'hi-emergency', icon: '🚨', label: 'Emergency', sub: 'General emergency line', number: '911' },
  { id: 'medical', className: 'hi-medical', icon: '🏥', label: 'Medical Support', sub: 'Ambulance: 911', number: '911' },
  { id: 'ambulance', className: 'hi-ambulance', icon: '🚑', label: 'Ambulance', sub: 'EMS dispatch', number: '911' },
  { id: 'fire', className: 'hi-fire', icon: '🔥', label: 'Fire Department', sub: 'Fire emergency: 911', number: '911' },
  { id: 'sos', className: 'hi-sos', icon: '🆘', label: 'SOS', sub: 'International distress', number: '112' },
];

/** Single emergency option in the help menu. */
const HelpOption = memo(({ option, onSelect }: HelpOptionProps) => {
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

/** Floating emergency help button (SOS) with expandable quick-dial menu. */
export const HelpButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Trap focus when open
  useFocusTrap(containerRef, isOpen);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleCall = useCallback((option: HelpOptionData) => {
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
          aria-modal="true"
        >
          <div className="help-menu-title" aria-live="polite">🆘 Emergency Help Options</div>
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
};
