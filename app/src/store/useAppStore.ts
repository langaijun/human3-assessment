/**
 * HUMAN 3.0 全局状态管理
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppVersion = 'simple' | 'complete';

interface AppState {
  selectedVersion: AppVersion;
  isPaid: boolean;
  hasUsedComplete: boolean; // 完整版是否已使用
  setSelectedVersion: (version: AppVersion) => void;
  setPaid: (paid: boolean) => void;
  setHasUsedComplete: (used: boolean) => void;
  toggleVersion: () => void;
}

interface AppStateState {
  selectedVersion: AppVersion;
  isPaid: boolean;
  hasUsedComplete: boolean; // 完整版是否已使用
}

const initialState: AppStateState = {
  selectedVersion: 'simple',
  isPaid: false,
  hasUsedComplete: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set): AppState => ({
      ...initialState,
      setSelectedVersion: (version: AppVersion) => set({ selectedVersion: version }),
      setPaid: (paid: boolean) => set({ isPaid: paid }),
      setHasUsedComplete: (used: boolean) => set({ hasUsedComplete: used }),
      toggleVersion: () => set((state) => ({
        selectedVersion: state.selectedVersion === 'simple' ? 'complete' : 'simple',
        isPaid: false, // 切换版本时重置付费状态
      })),
    }),
    {
      name: 'human3-app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
