/**
 * Global type definitions for the ElectED project.
 * Extends standard browser and environment interfaces to support
 * Vite, Google Translate, and custom global properties.
 */

import 'react';

declare global {
  /**
   * Environment variables available via Vite's import.meta.env.
   */
  interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_FIREBASE_MEASUREMENT_ID: string;
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    readonly VITE_WEATHER_API_BASE: string;
    readonly VITE_GEOCODE_API_BASE: string;
    [key: string]: string | boolean | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  /**
   * Window interface extensions for third-party libraries.
   */
  interface Window {
    /** Initialize Google Translate element */
    googleTranslateElementInit?: () => void;
    /** Google library (Maps, Translate) */
    google?: any;
    /** Set language for Google Translate programmatically */
    __setGoogleTranslateLang?: (lang: string) => void;
  }

  /** Global NodeJS variable in some test environments */
  var global: typeof globalThis;
}

export {};
