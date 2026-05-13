/**
 * Human3.0 系统版本状态持久化 Hook
 */
import { useState, useEffect } from 'react';
import { useVersion } from '@/context/VersionContext';
import { VERSION_STATE_KEY, DEFAULT_VERSION_STATE } from '@/types/version';
import type { VersionState } from '@/types';

export function usePersistentVersionState() {
  const { state, actions } = useVersion();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSavedState = () => {
      try {
        const saved = localStorage.getItem('app-version-state');
        if (saved) {
          const parsedState = JSON.parse(saved) as VersionState;

          actions.setSelectedVersion(parsedState.selectedVersion);
          actions.setPaidStatus(parsedState.isPaid);
          if (parsedState.paymentStatus && parsedState.paymentStatus !== 'none') {
            actions.setPaymentStatus(parsedState.paymentStatus);
          }
          if (parsedState.paymentId) {
            actions.setPaymentId(parsedState.paymentId);
          }
        }
      } catch (error) {
        console.error('Failed to load saved version state:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    const timer = setTimeout(loadSavedState, 0);
    return () => clearTimeout(timer);
  }, [actions]);

  useEffect(() => {
    if (isLoaded && state) {
      try {
        localStorage.setItem('app-version-state', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save version state:', error);
      }
    }
  }, [state, isLoaded]);

  return {
    versionState: state,
    actions,
    isLoaded,
  };
}

export function useCurrentVersion() {
  const { state } = useVersion();

  return {
    currentVersion: state.selectedVersion,
    isPaid: state.isPaid,
    paymentStatus: state.paymentStatus,
    paymentId: state.paymentId,
    isCompleteVersion: state.selectedVersion === 'complete',
    isSimpleVersion: state.selectedVersion === 'simple',
  };
}

export function useVersionSwitch() {
  const { state, actions } = useVersion();

  const switchToVersion = (newVersion: 'simple' | 'complete') => {
    actions.switchVersion(newVersion);
  };

  const markAsPaid = (paymentId: string) => {
    actions.setPaidStatus(true);
    actions.setPaymentStatus('success');
    actions.setPaymentId(paymentId);
    actions.updatePaymentTimestamp();
  };

  const resetVersionState = () => {
    actions.resetState();
  };

  return {
    switchToVersion,
    markAsPaid,
    resetVersionState,
  };
}
