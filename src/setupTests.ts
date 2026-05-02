import '@testing-library/jest-dom';

// Mock Vite's import.meta.env
(global as any).import = {
  meta: {
    env: {
      VITE_GOOGLE_MAPS_API_KEY: 'test-key',
      VITE_FIREBASE_API_KEY: 'test-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test-domain',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test-bucket',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
      VITE_FIREBASE_APP_ID: '1:123:web:123',
      VITE_FIREBASE_MEASUREMENT_ID: 'G-123',
    }
  }
};

// Alternative for some environments
if (!(global as any).importMeta) {
  Object.defineProperty(global, 'importMeta', {
    value: (global as any).import.meta
  });
}

// Mock IntersectionObserver
window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Firebase mocks
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  onSnapshot: jest.fn(() => jest.fn()), // Returns unobserve function
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(true),
  logEvent: jest.fn(),
}));

// Google Maps mock
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue({}),
  })),
}));
