/**
 * Human3.0 系统版本管理上下文
 */
import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type {
  AppVersion,
  VersionState,
  VersionFeatures,
  VersionSwitchConfig
} from '@/types/version';
import { DEFAULT_VERSION_STATE } from '@/types/version';

type VersionAction =
  | { type: 'SET_VERSION'; payload: AppVersion }
  | { type: 'SET_PAID_STATUS'; payload: boolean }
  | { type: 'SET_PAYMENT_STATUS'; payload: 'none' | 'pending' | 'success' | 'failed' }
  | { type: 'SET_PAYMENT_ID'; payload: string }
  | { type: 'UPDATE_PAYMENT_TIMESTAMP' }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_STATE'; payload: VersionState }
  | { type: 'SYNC_STATE'; payload: VersionState };

function versionReducer(state: VersionState, action: VersionAction): VersionState {
  switch (action.type) {
    case 'SET_VERSION':
      return {
        ...state,
        selectedVersion: action.payload,
        lastUpdated: new Date()
      };

    case 'SET_PAID_STATUS':
      return {
        ...state,
        isPaid: action.payload,
        lastUpdated: new Date()
      };

    case 'SET_PAYMENT_STATUS':
      return {
        ...state,
        paymentStatus: action.payload,
        lastUpdated: new Date()
      };

    case 'SET_PAYMENT_ID':
      return {
        ...state,
        paymentId: action.payload,
        lastUpdated: new Date()
      };

    case 'UPDATE_PAYMENT_TIMESTAMP':
      return {
        ...state,
        paymentTimestamp: Date.now(),
        lastUpdated: new Date()
      };

    case 'RESET_STATE':
      return DEFAULT_VERSION_STATE;

    case 'LOAD_STATE':
    case 'SYNC_STATE':
      return {
        ...action.payload,
        lastUpdated: new Date()
      };

    default:
      return state;
  }
}

interface VersionContextType {
  state: VersionState;
  actions: {
    setSelectedVersion: (version: AppVersion) => void;
    setPaidStatus: (paid: boolean) => void;
    setPaymentStatus: (status: 'none' | 'pending' | 'success' | 'failed') => void;
    setPaymentId: (id: string) => void;
    updatePaymentTimestamp: () => void;
    resetState: () => void;
    getVersionFeatures: (version: AppVersion) => VersionFeatures;
    canSwitchTo: (targetVersion: AppVersion) => VersionSwitchConfig;
    switchVersion: (version: AppVersion) => void;
  };
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(versionReducer, DEFAULT_VERSION_STATE);

  const getVersionFeatures = useCallback((version: AppVersion): VersionFeatures => {
    const features = {
      simple: {
        id: 'simple' as AppVersion,
        title: '基础版',
        description: '提供基础的思维模型评估和标准报告',
        price: 0,
        features: [
          '基本评估流程',
          '标准报告格式',
          '基础改进建议',
          '免费使用'
        ],
        recommended: false
      },
      complete: {
        id: 'complete' as AppVersion,
        title: '完整版',
        description: '提供全方位的深度分析和个人化报告',
        price: 5,
        features: [
          '深度评估流程',
          '个性化分析',
          '详细改进建议',
          '完整报告',
          '优先支持'
        ],
        recommended: true
      }
    };

    return features[version];
  }, []);

  const canSwitchTo = useCallback((targetVersion: AppVersion): VersionSwitchConfig => {
    const isUpgrade = targetVersion === 'complete' && state.selectedVersion === 'simple';
    const isDowngrade = targetVersion === 'simple' && state.selectedVersion === 'complete';

    return {
      targetVersion,
      requiresPayment: isUpgrade && !state.isPaid,
      requiresConfirmation: isUpgrade || isDowngrade,
      confirmationMessage: isUpgrade
        ? '升级到完整版需要支付 $5。切换版本将丢失当前评估进度，确定要继续吗？'
        : '降级到基础版将丢失完整版功能。确定要继续吗？'
    };
  }, [state.selectedVersion, state.isPaid]);

  const switchVersion = useCallback((version: AppVersion) => {
    const config = canSwitchTo(version);

    if (config.requiresPayment) {
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'pending' });
    }

    dispatch({ type: 'SET_VERSION', payload: version });
  }, [canSwitchTo]);

  const contextValue: VersionContextType = {
    state,
    actions: {
      setSelectedVersion: useCallback((version: AppVersion) => {
        dispatch({ type: 'SET_VERSION', payload: version });
      }, []),

      setPaidStatus: useCallback((paid: boolean) => {
        dispatch({ type: 'SET_PAID_STATUS', payload: paid });
      }, []),

      setPaymentStatus: useCallback((status: 'none' | 'pending' | 'success' | 'failed') => {
        dispatch({ type: 'SET_PAYMENT_STATUS', payload: status });
      }, []),

      setPaymentId: useCallback((id: string) => {
        dispatch({ type: 'SET_PAYMENT_ID', payload: id });
      }, []),

      updatePaymentTimestamp: useCallback(() => {
        dispatch({ type: 'UPDATE_PAYMENT_TIMESTAMP' });
      }, []),

      resetState: useCallback(() => {
        dispatch({ type: 'RESET_STATE' });
      }, []),

      getVersionFeatures,
      canSwitchTo,
      switchVersion
    }
  };

  return (
    <VersionContext.Provider value={contextValue}>
      {children}
    </VersionContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within VersionProvider');
  }
  return context;
};

export const useVersionState = () => {
  const { state, actions } = useVersion();
  return {
    versionState: state,
    setVersionState: {
      setSelectedVersion: actions.setSelectedVersion,
      setPaidStatus: actions.setPaidStatus,
      setPaymentStatus: actions.setPaymentStatus,
      setPaymentId: actions.setPaymentId,
      updatePaymentTimestamp: actions.updatePaymentTimestamp,
      resetState: actions.resetState
    }
  };
};
