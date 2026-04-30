import { useEffect, useRef, useState } from 'react';

/**
 * Google Translate widget integrated into a React component.
 * Loads the official translate.google.com script and creates the widget
 * inside a hidden <div> so we can trigger translation programmatically
 * from our own language switcher.
 *
 * Usage: Render <GoogleTranslateInit /> once, then call
 *        window.__setGoogleTranslateLang('es') from anywhere.
 */
export function GoogleTranslateInit() {
  useEffect(() => {
    // Expose callback before script loads
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,hi,ar,zh-CN,pt,ja,ko,ru,sw',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        'gt-hidden-container'
      );
    };

    // Expose programmatic trigger for our custom dropdown
    window.__setGoogleTranslateLang = (langCode) => {
      // The Google Translate combo box is added to the DOM after init
      const trySet = (attempts = 0) => {
        const select = document.querySelector('#gt-hidden-container select.goog-te-combo');
        if (select) {
          select.value = langCode;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (attempts < 20) {
          setTimeout(() => trySet(attempts + 1), 250);
        }
      };
      trySet();
    };

    // Inject the Google Translate script
    if (!document.getElementById('gt-script')) {
      const script = document.createElement('script');
      script.id = 'gt-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      delete window.googleTranslateElementInit;
      delete window.__setGoogleTranslateLang;
    };
  }, []);

  // Hidden container for the real GT widget (we proxy it via our custom UI)
  return (
    <div
      id="gt-hidden-container"
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', top: 0, width: 0, height: 0, overflow: 'hidden' }}
    />
  );
}

export default GoogleTranslateInit;
