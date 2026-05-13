import { useState, useCallback } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import type { AppVersion } from '@/types/version';
import { VERSION_FEATURES } from '@/constants';
import VersionSelector from '@/components/VersionSelector';

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

  const handleVersionSwitchClick = () => {
    setShowVersionSelector(true);
  };

  const handleVersionSelect = useCallback((version: AppVersion) => {
    if (version === 'complete' && selectedVersion === 'simple') {
      setShowVersionSelector(true);
    } else {
      onVersionSelect(version);
    }
  }, [selectedVersion, onVersionSelect]);

  const handleStartFromSelector = useCallback(() => {
    setShowVersionSelector(false);
    setIsTransitioning(true);
    setTimeout(() => {
      onStartAssessment(inputValue.trim());
    }, 300);
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
            onClick={handleVersionSwitchClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all hover:bg-gray-100"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
          >
            {VERSION_FEATURES[selectedVersion].title}
            {selectedVersion === 'complete' && (
              <Lock className="w-3 h-3" style={{ color: TEXT }} />
            )}
          </button>

          <button
            onClick={handleVersionSwitchClick}
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
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: TEXT }}>选择版本</h2>
              <button
                onClick={() => setShowVersionSelector(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18M6 6L18 6" />
                </svg>
              </button>
            </div>

            <VersionSelector
              selectedVersion={selectedVersion}
              onVersionSelect={handleVersionSelect}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleStartFromSelector}
                className="flex-1 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!inputValue.trim()}
                style={{ background: '#4CAF50' }}
              >
                <span>开始评估</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowVersionSelector(false)}
                className="flex-1 py-3 rounded-lg text-white transition-all"
                style={{ border: `1px solid ${BORDER}`, color: TEXT }}
              >
                取消
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
                disabled={!inputValue.trim() || isTransitioning}
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
        <p className="text-xs text-center" style={{ color: TEXT_MUTED }}>
          HUMAN 3.0 Development Model · Multidimensional Potential Assessment
        </p>
        <p className="text-[10px]" style={{ color: '#8C7E6A' }}>
          致敬 Dan Koe —— Human 3.0 框架的提出者
        </p>
      </footer>
    </div>
  );
}
