/**
 * Human3.0 系统版本相关的 AI 对话 Hook
 */
import { useState, useCallback } from 'react';
import { useVersion } from '@/context/VersionContext';
import { useDeepSeekChat } from '@/hooks/useDeepSeekChat';
import type { Message } from '@/types';

interface VersionChatOptions {
  onComplete?: (result: any) => void;
  maxRounds?: number;
  systemPromptOverride?: string;
}

export function useVersionChat(options: VersionChatOptions = {}) {
  const { state, actions } = useVersion();
  const [chatEnabled, setChatEnabled] = useState(false);

  const { sendMessage, messages, isLoading, isComplete, result } = useDeepSeekChat({
    systemPromptOverride: options.systemPromptOverride,
    maxRounds: options.maxRounds,
  });

  const handleStartAssessment = useCallback((input: string) => {
    setChatEnabled(true);
    sendMessage(input);
  }, []);

  const isPaid = state.isPaid && state.selectedVersion === 'complete';

  const handleChatComplete = useCallback((finalResult: any) => {
    if (options.onComplete) {
      options.onComplete(finalResult);
    }
  }, [options.onComplete]);

  return {
    messages,
    isLoading,
    isComplete,
    result,
    chatEnabled,
    isPaid,
    sendMessage,
    handleStartAssessment,
    handleChatComplete,
  };
}
