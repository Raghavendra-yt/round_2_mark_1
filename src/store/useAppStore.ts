import { create } from 'zustand';

interface AppState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

/**
 * Global application state management using Zustand.
 * Keeps global state minimal, focusing on UI toggles and overarching settings.
 */
export const useAppStore = create<AppState>((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  language: 'en',
  setLanguage: (lang: string) => set({ language: lang }),
}));
