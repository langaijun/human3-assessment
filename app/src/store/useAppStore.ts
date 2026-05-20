/**
 * HUMAN 3.0 全局状态管理
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppVersion = 'simple' | 'complete';

interface AppState {
  selectedVersion: AppVersion;
  setSelectedVersion: (version: AppVersion) => void;
  toggleVersion: () => void;
}

interface AppStateState {
  selectedVersion: AppVersion;
}

const initialState: AppStateState = {
  selectedVersion: 'simple',
};

export const useAppStore = create<AppState>()(
  persist(
    (set): AppState => ({
      ...initialState,
      setSelectedVersion: (version: AppVersion) => set({ selectedVersion: version }),
      toggleVersion: () => set((state) => ({
        selectedVersion: state.selectedVersion === 'simple' ? 'complete' : 'simple',
      })),
    }),
    {
      name: 'human3-app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
