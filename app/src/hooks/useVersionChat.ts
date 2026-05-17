/**
 * Human3.0 系统版本相关的 AI 对话 Hook
 */
import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useDeepSeekChat } from '@/hooks/useDeepSeekChat';
import { SIMPLE_PROMPT } from '@/prompts/simplePrompt';
import { COMPLETE_PROMPT } from '@/prompts/completePrompt';

interface VersionChatOptions {
  onComplete?: (result: unknown) => void;
  maxRounds?: number;
}

export function useVersionChat(options: VersionChatOptions = {}) {
  const { isPaid } = useAppStore();
  const [chatEnabled, setChatEnabled] = useState(false);

  const systemPrompt = isPaid ? COMPLETE_PROMPT : SIMPLE_PROMPT;
  const { sendMessage, messages, isLoading, isComplete, result } = useDeepSeekChat({ systemPrompt });

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
    isPaid,
    sendMessage,
    handleStartAssessment,
    handleChatComplete,
  };
}
