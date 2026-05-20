/**
 * HUMAN 3.0 Global State Management
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SupportedLanguage } from '@/i18n';

export type AppVersion = 'simple' | 'complete';

interface AppState {
  selectedVersion: AppVersion;
  language: SupportedLanguage;
  setSelectedVersion: (version: AppVersion) => void;
  toggleVersion: () => void;
  setLanguage: (language: SupportedLanguage) => void;
}

interface AppStateState {
  selectedVersion: AppVersion;
  language: SupportedLanguage;
}

const initialState: AppStateState = {
  selectedVersion: 'simple',
  language: 'zh',
};

export const useAppStore = create<AppState>()(
  persist(
    (set): AppState => ({
      ...initialState,
      setSelectedVersion: (version: AppVersion) => set({ selectedVersion: version }),
      toggleVersion: () => set((state) => ({
        selectedVersion: state.selectedVersion === 'simple' ? 'complete' : 'simple',
      })),
      setLanguage: (language: SupportedLanguage) => set({ language }),
    }),
    {
      name: 'human3-app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);