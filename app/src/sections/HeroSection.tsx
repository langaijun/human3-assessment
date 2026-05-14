import { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import type { AppVersion } from '@/types/version';
import { VERSION_FEATURES } from '@/constants';

interface HeroSectionProps {
  onStartAssessment: (initialInput: string) => void;
  selectedVersion: AppVersion;
  onVersionSelect: (version: AppVersion) => void;
}

const BG = '#FDF6E3';
const BG_CARD = '#F8F0D8';
const BORDER = '#E8DCC8';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';

export default function HeroSection({
  onStartAssessment,
  selectedVersion,
  onVersionSelect,
}: HeroSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVersionSelector, setShowVersionSelector] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onStartAssessment(inputValue.trim());
    }, 500);
  }, [inputValue, isTransitioning, onStartAssessment]);

  return (
    <div className="relative w-full min-h-screen flex flex-col" style={{ background: BG }}>
      {/* Navigation */}
      <nav
        className="flex items-center justify-between px-6 py-4 transition-all duration-500"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: TEXT }}>
            <span className="text-xs font-bold" style={{ color: BG }}>H</span>
          </div>
          <span className="text-sm font-medium" style={{ color: TEXT }}>Human 3.0</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVersionSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all hover:bg-gray-100"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
          >
            {VERSION_FEATURES[selectedVersion].title}
            {selectedVersion === 'complete' && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: '#FF9800', color: '#FFFFFF' }}>
                已解锁
              </span>
            )}
          </button>

          <button
            onClick={() => setShowVersionSelector(true)}
            className="text-xs hover:underline"
            style={{ color: TEXT_MUTED }}
          >
            切换版本
          </button>
        </div>
      </nav>

      {/* Version Selector Modal */}
      {showVersionSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={{ color: TEXT }}>升级到完整版</h2>
              <button
                onClick={() => setShowVersionSelector(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18M6 6L18 6" />
                </svg>
              </button>
            </div>

            {/* Only show Complete version option */}
            <div
              className="p-8 rounded-2xl border-2 transition-all hover:shadow-lg cursor-pointer"
              style={{ background: '#FDF6E3', borderColor: '#8C7E6A', borderWidth: '2px' }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FF9800' }}>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2}>
                    <path d="M5 3v21a1 1 1h12a2-6l-7.07 1 4 82a2-6.3l.5 12a-2-5.12a-3.18l-5.64l-3.025-1.6.06l-6.34-3.06l-6.34" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>完整版</h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">$5</p>
                <p className="text-gray-600 mb-6">一次性付费 · 鸸久享有</p>
              </div>

              <div className="space-y-3 mb-6 text-sm" style={{ color: '#6B5F50' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#4CAF50" strokeWidth={2}>
                    <path d="M5 13l4 4-4h24l-4-4h24M24 16" />
                  </svg>
                  <span>完整评估流程（20轮深度对话）</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#4CAF50" strokeWidth={2}>
                    <path d="M9 12l4 4-4h24l-4-4h24M24 12" />
                  </svg>
                  <span>个性化深度分析</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#4CAF50" strokeWidth={2}>
                    <path d="M12 2l4 4-4h24l-4-4h24M24 4" />
                  </svg>
                  <span>详细改进建议</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#4CAF50" strokeWidth={2}>
                    <path d="M5 8v21a1 1 4h22a1 1 2h22a1 1" />
                  </svg>
                  <span>完整版报告</span>
                </div>
              </div>

              <button
                onClick={() => { onVersionSelect('complete'); setShowVersionSelector(false); }}
                className="w-full py-4 rounded-lg font-medium text-white transition-all hover:brightness-95"
                style={{ background: '#4CAF50' }}
              >
                <span>升级到完整版</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button
                onClick={() => setShowVersionSelector(false)}
                className="w-full py-4 rounded-lg font-medium transition-all border"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-700 ${
          isTransitioning ? 'opacity-0 scale-[0.98]' : ''
        }`}
      >
        <div className="w-full max-w-2xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center" style={{ color: TEXT }}>
            {VERSION_FEATURES[selectedVersion].title}
          </h1>
          <p className="text-base mb-10 text-center" style={{ color: TEXT_MUTED }}>
            {VERSION_FEATURES[selectedVersion].description}
          </p>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={selectedVersion === 'complete'
                  ? '描述你目前最大的困惑或目标，进行深度分析...'
                  : '描述你目前最大的困惑或目标...'
                }
                disabled={isTransitioning}
                className="w-full h-12 pl-4 pr-14 rounded-lg text-sm outline-none transition-all disabled:opacity-50"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTransitioning}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: '#8C7E6A', color: '#FFFFFF' }}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Example prompts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['我感觉被困住了', '我想找到职业方向', '我的人际关系很困扰', '我想提升身体状态'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInputValue(prompt)}
                disabled={isTransitioning}
                className="px-3 py-1.5 rounded-full text-xs transition-all disabled:opacity-50 hover:brightness-95"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                  color: TEXT_MUTED,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <p className="text-xs" style={{ color: TEXT_MUTED }}>
            HUMAN 3.0 Development Model · Multidimensional Potential Assessment
          </p>
          <p className="text-xs" style={{ color: '#8C7E6A' }}>
            致敬 Dan Koe —— Human 3.0 框架的提出者
          </p>
          <p className="text-xs" style={{ color: TEXT_MUTED }}>
            联系邮箱: <a href="mailto:langaijun@foxmail.com" className="hover:underline">langaijun@foxmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
