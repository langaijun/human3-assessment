/**
 * Human3.0 System Version-related AI Chat Hook
 */
import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useDeepSeekChat } from '@/hooks/useDeepSeekChat';
import { SIMPLE_PROMPT } from '@/prompts/simplePrompt';
import { COMPLETE_PROMPT } from '@/prompts/completePrompt';
import { SIMPLE_PROMPT_EN } from '@/prompts/simplePrompt.en';
import { COMPLETE_PROMPT_EN } from '@/prompts/completePrompt.en';

interface VersionChatOptions {
  onComplete?: (result: unknown) => void;
  maxRounds?: number;
}

export function useVersionChat(options: VersionChatOptions = {}) {
  const { selectedVersion, language } = useAppStore();
  const [chatEnabled, setChatEnabled] = useState(false);

  const version = selectedVersion as 'simple' | 'complete';

  // Select prompt based on version and language
  const getSystemPrompt = (): string => {
    if (version === 'complete') {
      return language === 'en' ? COMPLETE_PROMPT_EN : COMPLETE_PROMPT;
    }
    return language === 'en' ? SIMPLE_PROMPT_EN : SIMPLE_PROMPT;
  };

  const { sendMessage, messages, isLoading, isComplete, result } = useDeepSeekChat({
    systemPrompt: getSystemPrompt(),
    version,
    language,
  });

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
    language,
    sendMessage,
    handleStartAssessment,
    handleChatComplete,
  };
}