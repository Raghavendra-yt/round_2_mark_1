import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/**
 * Data structure for an emergency help option.
 */
interface HelpOptionData {
  /** Unique identifier for the option. */
  id: string;
  /** CSS class for styling. */
  className: string;
  /** Emoji or icon. */
  icon: string;
  /** Primary label. */
  label: string;
  /** Sub-label or description. */
  sub: string;
  /** Phone number to dial. */
  number: string;
}

/**
 * Props for the HelpOption component.
 */
interface HelpOptionProps {
  /** The option data to display. */
  option: HelpOptionData;
  /** Callback when the option is selected. */
  onSelect: (option: HelpOptionData) => void;
}

/**
 * Static list of emergency help options.
 */
const HELP_OPTIONS: HelpOptionData[] = [
  { id: 'police', className: 'hi-police', icon: '🚔', label: 'Call Police', sub: 'Emergency: 911', number: '911' },
  { id: 'emergency', className: 'hi-emergency', icon: '🚨', label: 'Emergency', sub: 'General emergency line', number: '911' },
  { id: 'medical', className: 'hi-medical', icon: '🏥', label: 'Medical Support', sub: 'Ambulance: 911', number: '911' },
  { id: 'ambulance', className: 'hi-ambulance', icon: '🚑', label: 'Ambulance', sub: 'EMS dispatch', number: '911' },
  { id: 'fire', className: 'hi-fire', icon: '🔥', label: 'Fire Department', sub: 'Fire emergency: 911', number: '911' },
  { id: 'sos', className: 'hi-sos', icon: '🆘', label: 'SOS', sub: 'International distress', number: '112' },
];

/** 
 * Single emergency option in the help menu.
 * 
 * @component
 */
const HelpOption: React.FC<HelpOptionProps> = memo(({ option, onSelect }) => {
  /** Handles the selection of the emergency option. */
  const handleClick = useCallback((): void => {
    onSelect(option);
  }, [option, onSelect]);

  return (
    <button
      className={`help-item ${option.className}`}
      aria-label={`${option.label} — ${option.sub}`}
      onClick={handleClick}
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

/** 
 * Floating emergency help button (SOS) with expandable quick-dial menu.
 * Features focus trapping and keyboard navigation for critical accessibility.
 * 
 * @component
 */
export const HelpButton: React.FC = memo(() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Trap focus when open
  useFocusTrap(containerRef, isOpen);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  /** Handles the call action for a selected option. */
  const handleCall = useCallback((option: HelpOptionData): void => {
    window.location.href = `tel:${option.number}`;
    setIsOpen(false);
  }, []);

  /** Toggles the visibility of the help menu. */
  const handleToggle = useCallback((): void => {
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
});

HelpButton.displayName = 'HelpButton';
