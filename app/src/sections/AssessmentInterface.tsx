import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { useDeepSeekChat } from '@/hooks/useDeepSeekChat';
import type { AssessmentResult } from '@/types';

interface AssessmentInterfaceProps {
  initialInput: string;
  onComplete: (result: AssessmentResult) => void;
}

const BG = '#FDF6E3';
const BORDER = '#E8DCC8';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 py-2">
      <Bot className="w-4 h-4" style={{ color: TEXT_MUTED }} />
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full typing-dot" style={{ background: '#C4B898' }} />
        <span className="w-2 h-2 rounded-full typing-dot" style={{ background: '#C4B898' }} />
        <span className="w-2 h-2 rounded-full typing-dot" style={{ background: '#C4B898' }} />
      </div>
    </div>
  );
}

function formatMessage(content: string): string {
  let formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#3D3229;font-weight:600;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#5C5245;">$1</em>');
  formatted = formatted.replace(/\n/g, '<br />');
  return formatted;
}

// AI message: plain text on page, no bubble
function AIMessage({ content }: { content: string }) {
  return (
    <div className="py-4 animate-fade-in" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-4 h-4" style={{ color: TEXT_MUTED }} />
        <span className="text-xs" style={{ color: TEXT_MUTED }}>HUMAN 3.0</span>
      </div>
      <div
        className="text-sm leading-[1.8]"
        style={{ color: '#4A4035' }}
        dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
      />
    </div>
  );
}

// User message: subtle card, no bubble
function UserMessage({ content }: { content: string }) {
  return (
    <div className="py-4 flex justify-end animate-fade-in" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-[85%]">
        <div className="flex items-center gap-2 mb-2 justify-end">
          <span className="text-xs" style={{ color: TEXT_MUTED }}>你</span>
          <User className="w-4 h-4" style={{ color: TEXT_MUTED }} />
        </div>
        <p className="text-sm leading-[1.8] text-right" style={{ color: TEXT }}>
          {content}
        </p>
      </div>
    </div>
  );
}

export default function AssessmentInterface({ initialInput, onComplete }: AssessmentInterfaceProps) {
  const { messages, isLoading, isComplete, result, sendMessage } = useDeepSeekChat();
  const [inputValue, setInputValue] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasStarted && initialInput) {
      setHasStarted(true);
      setTimeout(() => sendMessage(initialInput), 300);
    }
  }, [hasStarted, initialInput, sendMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const assistantCount = messages.filter(m => m.role === 'assistant').length;
  const progress = Math.min((assistantCount / 12) * 100, 100);

  useEffect(() => {
    if (isComplete && result) {
      const timer = setTimeout(() => onComplete(result), 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, result, onComplete]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const content = inputValue.trim();
    setInputValue('');
    sendMessage(content);
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col" style={{ background: BG }}>
      {/* Progress bar */}
      <div className="h-[2px]" style={{ background: '#E8DCC8' }}>
        <div className="h-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, background: '#A89878' }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: TEXT }}>
            <span className="text-xs font-bold" style={{ color: BG }}>H</span>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: TEXT }}>HUMAN 3.0 测评</span>
            <span className="text-xs ml-2" style={{ color: TEXT_MUTED }}>{assistantCount}/12 轮</span>
          </div>
        </div>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: TEXT_MUTED }} />}
      </div>

      {/* Chat messages - A4 paper style */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-4">
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return <UserMessage key={msg.id} content={msg.content} />;
            }
            return <AIMessage key={msg.id} content={msg.content} />;
          })}

          {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}

          {isComplete && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm" style={{ color: TEXT_MUTED }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>正在生成你的评估报告...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area - 2+ lines textarea */}
      <div className="px-4 py-4" style={{ borderTop: `1px solid ${BORDER}`, background: BG }}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-xl p-3"
            style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的回答...（按 Enter 发送，Shift+Enter 换行）"
              rows={2}
              disabled={isLoading || isComplete}
              className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed disabled:opacity-50"
              style={{ color: TEXT }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || isComplete}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: '#8C7E6A', color: '#FFFFFF' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
