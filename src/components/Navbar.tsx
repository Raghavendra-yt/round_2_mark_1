import { useState, useCallback, memo, KeyboardEvent, MouseEvent } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GoogleTranslateInit } from './GoogleTranslate';
import { LANGUAGES, NAV_LINKS, APP_NAME, ARIA_LABELS, STORAGE_KEYS } from '../constants';

interface Language {
  code: string;
  gtCode: string;
  label: string;
  flag: string;
}

interface NavLinkProps {
  href: string;
  label: string;
  aria: string;
  sectionId: string;
  activeSection: string;
  onClick: () => void;
}

// ── Icon Components ───────────────────────────────────────────────────────────

/** Globe SVG icon for the language switcher. */
const GlobeIcon = memo(() => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
});

GlobeIcon.displayName = 'GlobeIcon';

/** Chevron-down icon for the language dropdown toggle. */
const ChevronDownIcon = memo(() => {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
});

ChevronDownIcon.displayName = 'ChevronDownIcon';

// ── Language Switcher ─────────────────────────────────────────────────────────

/**
 * Dropdown that lets users choose a display language via Google Translate.
 * Selected language is persisted to localStorage.
 */
const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useLocalStorage<string>(STORAGE_KEYS.LANGUAGE, 'en');

  const selectedLanguage = LANGUAGES.find((l) => l.code === selectedCode) ?? LANGUAGES[0];

  const handleSelectLanguage = useCallback((language: Language) => {
    setSelectedCode(language.code);
    setIsOpen(false);
    document.documentElement.lang = language.code;

    if (language.gtCode === 'en') {
      // Attempt to restore original — Google Translate uses a cookie
      const restoreBtn = document.querySelector('.goog-te-restore, a.goog-logo-link') as HTMLElement;
      if (restoreBtn) restoreBtn.click();
    } else {
      window.__setGoogleTranslateLang?.(language.gtCode);
    }
  }, [setSelectedCode]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') setIsOpen(false);
  }, []);

  return (
    <div className="lang-switcher" onKeyDown={handleKeyDown} role="presentation">
      <button
        id="lang-switcher-btn"
        className={`lang-btn${isOpen ? ' open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ARIA_LABELS.LANGUAGE}
        onClick={handleToggle}
        title="Translate — Google Translate"
      >
        <GlobeIcon />
        <span className="lang-flag">{selectedLanguage.flag}</span>
        <span className="lang-label-text">{selectedLanguage.label}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div
          id="lang-dropdown"
          className="lang-dropdown"
          role="listbox"
          tabIndex={-1}
          aria-label="Language options"
          aria-activedescendant={`lang-option-${selectedLanguage.code}`}
        >
          <div className="lang-powered">
            Powered by Google Translate
          </div>
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              id={`lang-option-${language.code}`}
              className={`lang-option${language.code === selectedLanguage.code ? ' active' : ''}`}
              role="option"
              aria-selected={language.code === selectedLanguage.code}
              onClick={() => handleSelectLanguage(language as Language)}
            >
              <span className="lang-flag">{language.flag}</span>
              {language.label}
              {language.code === selectedLanguage.code && (
                <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '0.8rem' }}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Navigation Link ───────────────────────────────────────────────────────────

/** A single navigation anchor that highlights when its section is active. */
const NavLink = memo(({ href, label, aria, sectionId, activeSection, onClick }: NavLinkProps) => {
  return (
    <li>
      <a
        href={href}
        aria-label={aria}
        aria-current={activeSection === sectionId ? 'true' : undefined}
        className={activeSection === sectionId ? 'active' : ''}
        onClick={onClick}
      >
        {label}
      </a>
    </li>
  );
});

NavLink.displayName = 'NavLink';

// ── Navbar ────────────────────────────────────────────────────────────────────

/** Primary navigation bar with language switcher, mobile menu, and active-section highlighting. */
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const activeSection = useActiveSection();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav role="navigation" aria-label={ARIA_LABELS.MAIN_NAV}>
      {/* Hidden Google Translate initialiser */}
      <GoogleTranslateInit />

      <a href="#hero" className="nav-logo" aria-label={`${APP_NAME} — Home`}>
        {APP_NAME}
      </a>

      <div className="nav-right">
        <button
          className="nav-mobile-btn"
          id="nav-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <ul
          className={`nav-links${isMenuOpen ? ' open' : ''}`}
          id="nav-menu"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              aria={link.aria}
              sectionId={link.sectionId}
              activeSection={activeSection}
              onClick={closeMenu}
            />
          ))}
        </ul>

        <LanguageSwitcher />
      </div>
    </nav>
  );
};
