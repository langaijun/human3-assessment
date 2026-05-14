/**
 * Human3.0 系统版本相关的 AI 对话 Hook
 */
import { useState, useCallback } from 'react';
import { useVersion } from '@/context/VersionContext';
import { useDeepSeekChat } from '@/hooks/useDeepSeekChat';

interface VersionChatOptions {
  onComplete?: (result: unknown) => void;
  maxRounds?: number;
  systemPromptOverride?: string;
}

export function useVersionChat(options: VersionChatOptions = {}) {
  const { state } = useVersion();
  const [chatEnabled, setChatEnabled] = useState(false);

  const { sendMessage, messages, isLoading, isComplete, result } = useDeepSeekChat();

  const handleStartAssessment = useCallback((input: string) => {
    setChatEnabled(true);
    sendMessage(input);
  }, [sendMessage]);

  const isPaid = state.isPaid && state.selectedVersion === 'complete';

  const handleChatComplete = useCallback((finalResult: unknown) => {
    if (options.onComplete) {
      options.onComplete(finalResult);
    }
  }, [options]);

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
