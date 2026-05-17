import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, User, Bot, FileText, ArrowRight } from 'lucide-react';
import { useVersionChat } from '@/hooks/useVersionChat';
import { useAppStore } from '@/store/useAppStore';
import { UpgradeButton } from '@/components/UpgradeButton';
import type { AssessmentResult } from '@/types';

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
        <span className="text-xs" style={{ color: TEXT }}>HUMAN 3.0</span>
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
          <span className="text-xs" style={{ color: TEXT }}>你</span>
          <User className="w-4 h-4" style={{ color: TEXT }} />
        </div>
        <p className="text-sm leading-[1.8] text-right" style={{ color: TEXT }}>
          {content}
        </p>
      </div>
    </div>
  );
}

interface AssessmentInterfaceProps {
  initialInput: string;
  onComplete: (result: AssessmentResult) => void;
}

export default function AssessmentInterface({ initialInput, onComplete }: AssessmentInterfaceProps) {
  const {
    messages,
    isLoading,
    isComplete,
    result,
    sendMessage,
    isPaid
  } = useVersionChat();

  const [inputValue, setInputValue] = useState('');
  const hasStartedRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!hasStartedRef.current && initialInput) {
      hasStartedRef.current = true;
      setTimeout(() => sendMessage(initialInput), 300);
    }
  }, [initialInput, sendMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messages, isLoading]);

  const handleViewResult = useCallback(() => {
    if (result) {
      onComplete(result);
    }
  }, [result, onComplete]);

  const assistantCount = messages.filter(m => m.role === 'assistant').length;
  const progress = Math.min((assistantCount / (isPaid ? 20 : 12)) * 100, 100);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const content = inputValue.trim();
    setInputValue('');
    sendMessage(content);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const maxRounds = isPaid ? 20 : 12;

  // 监听 localStorage 支付状态变化
  const { selectedVersion, isPaid: storeIsPaid } = useAppStore();
  useEffect(() => {
    if (storeIsPaid && selectedVersion === 'complete' && !isPaid) {
      // 重新加载页面以应用新状态
      window.location.reload();
    }
  }, [storeIsPaid, selectedVersion]);

  return (
    <div className="relative w-full h-screen flex flex-col" style={{ background: BG }}>
      {/* Progress bar */}
      <div className="h-[2px]" style={{ background: '#A89878' }}>
        <div className="h-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, background: '#4CAF50' }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: TEXT }}>
            <span className="text-xs font-bold" style={{ color: BG }}>H</span>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: TEXT }}>Human 3.0 测评</span>
            {isPaid && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: '#FF9800', color: '#FFFFFF' }}>
                完整版
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isPaid && (
            <UpgradeButton />
          )}
          <div className="text-xs" style={{ color: TEXT_MUTED }}>
            {assistantCount}/{maxRounds} 轮对话
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4">
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return <UserMessage key={msg.id} content={msg.content} />;
            }
            return <AIMessage key={msg.id} content={msg.content} />;
          })}
        </div>

        {isLoading && <TypingIndicator />}

        {!isLoading && !isComplete && messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              开始你的测评之旅...
            </p>
          </div>
        )}
      </div>

      {/* Complete state */}
      {isComplete && result && (
        <div className="px-6 py-6" style={{ background: '#FAF3E5' }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleViewResult}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm transition-all hover:brightness-95"
                style={{ background: '#8C7E6A', color: '#FFFFFF' }}
              >
                <span>查看四维评估结果</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}`, background: BG }}>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div
              className="flex items-end gap-3 rounded-xl p-3"
              style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}
            >
              <textarea
                ref={textareaRef}
                id="message-input"
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
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
