import { useEffect } from 'react';

/**
 * Initialises the Google Translate widget in a hidden container.
 * Exposes `window.__setGoogleTranslateLang(code)` for programmatic language switching.
 *
 * Renders no visible UI — the widget lives in a hidden container that our
 * custom LanguageSwitcher in Navbar.jsx proxies into.
 */
function GoogleTranslateInit() {
  useEffect(() => {
    // Expose the init callback before the script loads
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage:      'en',
          includedLanguages: 'en,es,fr,de,hi,ar,zh-CN,pt,ja,ko,ru,sw',
          layout:            window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay:       false,
          multilanguagePage: true,
        },
        'gt-hidden-container'
      );
    };

    // Programmatic language trigger used by LanguageSwitcher
    window.__setGoogleTranslateLang = (languageCode) => {
      const attemptSet = (attempts = 0) => {
        const select = document.querySelector('#gt-hidden-container select.goog-te-combo');
        if (select) {
          select.value = languageCode;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (attempts < 20) {
          setTimeout(() => attemptSet(attempts + 1), 250);
        }
      };
      attemptSet();
    };

    // Inject the Google Translate script only once
    if (!document.getElementById('gt-script')) {
      const script = document.createElement('script');
      script.id    = 'gt-script';
      script.src   = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      delete window.googleTranslateElementInit;
      delete window.__setGoogleTranslateLang;
    };
  }, []);

  return (
    <div
      id="gt-hidden-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left:     '-9999px',
        top:      0,
        width:    0,
        height:   0,
        overflow: 'hidden',
      }}
    />
  );
}

export { GoogleTranslateInit };
