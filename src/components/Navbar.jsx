import { useState, useEffect, useRef } from 'react';

// Google Translate language codes mapped to our display options
const LANGUAGES = [
  { code: 'en', gtCode: 'en',    label: 'English',    flag: '🇺🇸' },
  { code: 'es', gtCode: 'es',    label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', gtCode: 'fr',    label: 'Français',   flag: '🇫🇷' },
  { code: 'de', gtCode: 'de',    label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'hi', gtCode: 'hi',    label: 'हिन्दी',       flag: '🇮🇳' },
  { code: 'ar', gtCode: 'ar',    label: 'العربية',    flag: '🇸🇦' },
  { code: 'zh', gtCode: 'zh-CN', label: '中文',        flag: '🇨🇳' },
  { code: 'pt', gtCode: 'pt',    label: 'Português',  flag: '🇧🇷' },
  { code: 'ja', gtCode: 'ja',    label: '日本語',      flag: '🇯🇵' },
  { code: 'ru', gtCode: 'ru',    label: 'Русский',    flag: '🇷🇺' },
];

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" aria-hidden="true">
      <path fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"/>
    </svg>
  );
}

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[0]);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (lang) => {
    setSelected(lang);
    setOpen(false);
    document.documentElement.lang = lang.code;

    // Trigger Google Translate (loaded by GoogleTranslateInit in App.jsx)
    if (lang.gtCode === 'en') {
      // Restore original — GT uses a cookie to reset
      const restore = document.querySelector('.goog-te-restore, a.goog-logo-link');
      if (restore) restore.click();
      const bar = document.getElementById('google_translate_element2');
      if (bar) bar.innerHTML = '';
      // Fallback: reload to original language
      const frame = document.querySelector('iframe.goog-te-banner-frame');
      if (!frame) return;
      const btn = frame.contentDocument?.querySelector('.goog-close-link');
      if (btn) btn.click();
    } else {
      window.__setGoogleTranslateLang?.(lang.gtCode);
    }
  };

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className={`lang-btn${open ? ' open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language — powered by Google Translate"
        onClick={() => setOpen((o) => !o)}
        title="Translate — Google Translate"
      >
        <GlobeIcon />
        <span className="lang-flag">{selected.flag}</span>
        <span className="lang-label-text">{selected.label}</span>
        <ChevronDown />
      </button>
      {open && (
        <div className="lang-dropdown" role="listbox" aria-label="Language options">
          <div className="lang-powered">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4" style={{flexShrink:0}}>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            Powered by Google Translate
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option${lang.code === selected.code ? ' active' : ''}`}
              role="option"
              aria-selected={lang.code === selected.code}
              onClick={() => select(lang)}
            >
              <span className="lang-flag">{lang.flag}</span>
              {lang.label}
              {lang.code === selected.code && (
                <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '0.8rem' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sectionIds = ['hero', 'timeline', 'how', 'pollmap', 'quiz', 'glossary'];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: '#hero',     label: 'Home',      aria: 'Home section' },
    { href: '#timeline', label: 'Timeline',   aria: 'Election Timeline section' },
    { href: '#how',      label: 'Steps',      aria: 'How it Works section' },
    { href: '#pollmap',  label: 'Find Polls', aria: 'Find Polling Station section' },
    { href: '#quiz',     label: 'Quiz',       aria: 'Knowledge Quiz section' },
    { href: '#glossary', label: 'Glossary',   aria: 'Election Glossary section' },
  ];

  return (
    <nav role="navigation" aria-label="Main navigation">
      <a href="#hero" className="nav-logo" aria-label="ElectED — Home">
        ElectED
      </a>

      <div className="nav-right">
        <button
          className="nav-mobile-btn"
          id="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-menu" role="list">
          {navLinks.map(({ href, label, aria }) => {
            const sectionId = href.slice(1);
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-label={aria}
                  className={activeSection === sectionId ? 'active' : ''}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <LanguageSwitcher />
      </div>
    </nav>
  );
}
