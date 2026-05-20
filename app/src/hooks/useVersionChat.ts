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
  const { selectedVersion } = useAppStore();
  const [chatEnabled, setChatEnabled] = useState(false);

  const version = selectedVersion as 'simple' | 'complete';
  const systemPrompt = version === 'complete' ? COMPLETE_PROMPT : SIMPLE_PROMPT;
  const { sendMessage, messages, isLoading, isComplete, result } = useDeepSeekChat({ systemPrompt, version });

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
    version,
    sendMessage,
    handleStartAssessment,
    handleChatComplete,
  };
}
