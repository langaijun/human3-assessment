/**
 * Human3.0 系统版本相关的 AI 对话 Hook
 */
import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useDeepSeekChat } from '@/hooks/useDeepSeekChat';

interface VersionChatOptions {
  onComplete?: (result: unknown) => void;
  maxRounds?: number;
  systemPromptOverride?: string;
}

export function useVersionChat(options: VersionChatOptions = {}) {
  const { selectedVersion, isPaid } = useAppStore();
  const [chatEnabled, setChatEnabled] = useState(false);

  const useCompletePrompt = isPaid && selectedVersion === 'complete';
  const { sendMessage, messages, isLoading, isComplete, result } = useDeepSeekChat({ useCompletePrompt });

  const handleStartAssessment = useCallback((input: string) => {
    setChatEnabled(true);
    sendMessage(input);
  }, [sendMessage]);

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
    isPaid: isPaid && selectedVersion === 'complete',
    sendMessage,
    handleStartAssessment,
    handleChatComplete,
  };
}
