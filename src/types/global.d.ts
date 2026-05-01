declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    __setGoogleTranslateLang?: (lang: string) => void;
    google?: {
      translate: {
        TranslateElement: {
          new (options: unknown, container: string): any;
          InlineLayout: {
            SIMPLE: any;
          };
        };
      };
    };
  }
}

export {};
