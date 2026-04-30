// ── App Metadata ─────────────────────────────────────────────────────────────
export const APP_NAME = 'ElectED';
export const APP_TAGLINE = 'Election Process Education';
export const APP_DESCRIPTION =
  'A comprehensive, accessible, non-partisan guide to how elections work — from candidacy declaration to official certification.';
export const APP_VERSION = '2.0.0';

// ── Navigation ────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: '#hero',     label: 'Home',       aria: 'Home section',                  sectionId: 'hero' },
  { href: '#timeline', label: 'Timeline',   aria: 'Election Timeline section',     sectionId: 'timeline' },
  { href: '#how',      label: 'Steps',      aria: 'How it Works section',          sectionId: 'how' },
  { href: '#pollmap',  label: 'Find Polls', aria: 'Find Polling Station section',  sectionId: 'pollmap' },
  { href: '#quiz',     label: 'Quiz',       aria: 'Knowledge Quiz section',        sectionId: 'quiz' },
  { href: '#glossary', label: 'Glossary',   aria: 'Election Glossary section',     sectionId: 'glossary' },
];

export const SECTION_IDS = NAV_LINKS.map((l) => l.sectionId);

// ── Language Options ──────────────────────────────────────────────────────────
export const LANGUAGES = [
  { code: 'en', gtCode: 'en',    label: 'English',   flag: '🇺🇸' },
  { code: 'es', gtCode: 'es',    label: 'Español',   flag: '🇪🇸' },
  { code: 'fr', gtCode: 'fr',    label: 'Français',  flag: '🇫🇷' },
  { code: 'de', gtCode: 'de',    label: 'Deutsch',   flag: '🇩🇪' },
  { code: 'hi', gtCode: 'hi',    label: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'ar', gtCode: 'ar',    label: 'العربية',   flag: '🇸🇦' },
  { code: 'zh', gtCode: 'zh-CN', label: '中文',       flag: '🇨🇳' },
  { code: 'pt', gtCode: 'pt',    label: 'Português', flag: '🇧🇷' },
  { code: 'ja', gtCode: 'ja',    label: '日本語',     flag: '🇯🇵' },
  { code: 'ru', gtCode: 'ru',    label: 'Русский',   flag: '🇷🇺' },
];

// ── Map Config ────────────────────────────────────────────────────────────────
export const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
export const MAPS_CONFIGURED =
  Boolean(MAPS_API_KEY) && !MAPS_API_KEY.includes('YOUR_');

export const POLL_OFFSETS = [
  { name: 'City Hall',             delta: [0.006,  0.008],  type: 'Main Station',   id: 'p1' },
  { name: 'Community Center',      delta: [-0.009, 0.004],  type: 'Secondary',      id: 'p2' },
  { name: 'Public Library',        delta: [0.004, -0.010],  type: 'Early Voting',   id: 'p3' },
  { name: 'Riverside High School', delta: [-0.006, -0.007], type: 'Main Station',   id: 'p4' },
  { name: 'Greenway Rec Center',   delta: [0.010,  0.002],  type: 'Accessible Site',id: 'p5' },
];

export const MAP_STYLES = [
  { featureType: 'poi',           elementType: 'labels',   stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',                                stylers: [{ visibility: 'simplified' }] },
  { featureType: 'water',         elementType: 'geometry', stylers: [{ color: '#d4e8f5' }] },
  { featureType: 'road',          elementType: 'geometry', stylers: [{ color: '#f5f2ea' }] },
  { featureType: 'road.highway',  elementType: 'geometry', stylers: [{ color: '#e8d88c' }] },
  { featureType: 'landscape',     elementType: 'geometry', stylers: [{ color: '#f0ede6' }] },
];

// ── Weather Codes ─────────────────────────────────────────────────────────────
export const WEATHER_CODE_MAP = {
  0:  { label: 'Clear Sky',        icon: '☀️' },
  1:  { label: 'Mainly Clear',     icon: '🌤️' },
  2:  { label: 'Partly Cloudy',    icon: '⛅' },
  3:  { label: 'Overcast',         icon: '☁️' },
  45: { label: 'Foggy',            icon: '🌫️' },
  48: { label: 'Icy Fog',          icon: '🌫️' },
  51: { label: 'Light Drizzle',    icon: '🌦️' },
  53: { label: 'Drizzle',          icon: '🌦️' },
  55: { label: 'Heavy Drizzle',    icon: '🌧️' },
  61: { label: 'Light Rain',       icon: '🌧️' },
  63: { label: 'Rain',             icon: '🌧️' },
  65: { label: 'Heavy Rain',       icon: '🌧️' },
  71: { label: 'Light Snow',       icon: '🌨️' },
  73: { label: 'Snow',             icon: '❄️' },
  75: { label: 'Heavy Snow',       icon: '❄️' },
  80: { label: 'Rain Showers',     icon: '🌦️' },
  81: { label: 'Heavy Showers',    icon: '🌧️' },
  82: { label: 'Violent Showers',  icon: '⛈️' },
  95: { label: 'Thunderstorm',     icon: '⛈️' },
  96: { label: 'Hail Storm',       icon: '⛈️' },
  99: { label: 'Heavy Hail Storm', icon: '⛈️' },
};

// ── Quiz Config ───────────────────────────────────────────────────────────────
export const QUIZ_LETTERS = ['A', 'B', 'C', 'D'];
export const QUIZ_LEADERBOARD_LIMIT = 5;

export const QUIZ_MESSAGES = {
  perfect: 'Outstanding! You have a strong understanding of the election process.',
  great:   'Great job! Review the timeline section to strengthen any gaps.',
  keep:    'No worries — revisit the guide above and try again.',
};

export const QUIZ_TITLES = {
  perfect: 'Perfect Score!',
  great:   'Well Done!',
  keep:    'Keep Learning!',
};

// ── API Endpoints ─────────────────────────────────────────────────────────────
export const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
export const GEOCODE_API_BASE = 'https://nominatim.openstreetmap.org/reverse';

// ── Accessibility ─────────────────────────────────────────────────────────────
export const SKIP_LINK_TARGET = 'main-content';
export const INTERSECTION_THRESHOLD = 0.12;
export const SCROLL_DEBOUNCE_MS = 150;
export const SEARCH_DEBOUNCE_MS = 300;

// ── Local Storage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME:    'elected_theme',
  LANGUAGE: 'elected_language',
};

// ── ARIA Labels ───────────────────────────────────────────────────────────────
export const ARIA_LABELS = {
  MAIN_NAV:     'Main navigation',
  SKIP_LINK:    'Skip to main content',
  CLOSE_MODAL:  'Close modal',
  LANGUAGE:     'Select language — powered by Google Translate',
  QUIZ_REGION:  'Election knowledge quiz',
  QUIZ_PROGRESS:'Quiz progress',
  POLL_MAP:     'Google Map showing polling stations',
};
