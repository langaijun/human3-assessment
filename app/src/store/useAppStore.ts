/**
 * HUMAN 3.0 全局状态管理
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppVersion = 'simple' | 'complete';

interface AppState {
  selectedVersion: AppVersion;
  isPaid: boolean;
}

const initialState: AppState = {
  selectedVersion: 'simple',
  isPaid: false, // 临时改为 true 测试完整版
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedVersion: (version: AppVersion) => set({ selectedVersion: version }),
      setPaid: (paid: boolean) => set({ isPaid: paid }),
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
