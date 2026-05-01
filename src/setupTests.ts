import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { ReactNode } from 'react';

vi.mock('firebase/app', () => import('./__mocks__/firebase/app'));
vi.mock('firebase/auth', () => import('./__mocks__/firebase/auth'));
vi.mock('firebase/firestore', () => import('./__mocks__/firebase/firestore'));
vi.mock('firebase/storage', () => import('./__mocks__/firebase/storage'));

vi.mock('@react-google-maps/api', () => ({
  useLoadScript: () => ({ isLoaded: true, loadError: null }),
  GoogleMap: ({ children }: { children: ReactNode }) => `<div data-testid="google-map">${children}</div>`,
  Marker: () => '<div data-testid="marker"></div>',
  InfoWindow: ({ children }: { children: ReactNode }) => `<div data-testid="info-window">${children}</div>`,
}));

// Mock IntersectionObserver as a class-like function
window.IntersectionObserver = vi.fn().mockImplementation(function () {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => []),
    root: null,
    rootMargin: '',
    thresholds: [],
  };
});
