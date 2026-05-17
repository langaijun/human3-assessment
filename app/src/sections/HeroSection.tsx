import { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { VERSION_FEATURES, PAYMENT } from '@/constants';
import { useAppStore } from '@/store/useAppStore';
import DanKoeIntro from './DanKoeIntro';
import DanKoeDisclaimer from '@/components/DanKoeDisclaimer';

interface HeroSectionProps {
  onStartAssessment: (initialInput?: string) => void;
}

const BG = '#FDF6E3';
const BG_CARD = '#F8F0D8';
const BORDER = '#E8DCC8';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';

export default function HeroSection({
  onStartAssessment,
}: HeroSectionProps) {
  const { selectedVersion } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVersionSelector, setShowVersionSelector] = useState(false);
  const [showDanKoe, setShowDanKoe] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onStartAssessment(inputValue.trim());
    }, 500);
  }, [inputValue, isTransitioning, onStartAssessment]);

  const handlePayWithPayPal = useCallback(() => {
    window.open(PAYMENT.PAYPAL_LINK, '_blank');
    setShowVersionSelector(false);
  }, []);

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
            onClick={() => setShowDanKoe(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              color: TEXT_MUTED,
            }}
          >
            <span>human3.0</span>
          </button>

          <button
            onClick={() => setShowVersionSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all hover:bg-gray-100"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              color: TEXT_MUTED,
            }}
          >
            <span>升级</span>
          </button>
        </div>
      </nav>

      {/* Dan Koe Intro Page */}
      {showDanKoe && (
        <DanKoeIntro
          onClose={() => setShowDanKoe(false)}
        />
      )}

      {/* Dan Koe Disclaimer */}
      {showDisclaimer && (
        <DanKoeDisclaimer
          onClose={() => setShowDisclaimer(false)}
        />
      )}

      {/* Version Selector Modal - simplified with payment only */}
      {showVersionSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-auto">
            <div className="flex justify-end items-center mb-6">
              <button
                onClick={() => setShowVersionSelector(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Complete Version Card - simplified */}
            <div
              className="p-6 rounded-2xl border-2 transition-all hover:shadow-lg"
              style={{ background: '#FDF6E3', borderColor: '#8C7E6A', borderWidth: '2px' }}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v21a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H6a1 1 0 00-1 1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>解锁完整功能</h3>
              </div>

              <div className="text-center mb-6 text-sm" style={{ color: '#6B5F50' }}>
                <div className="text-left space-y-2">
                  <p>• 最多达20轮深度对话评估</p>
                  <p>• 个性化深度分析报告</p>
                  <p>• 详细改进建议和行动方案</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handlePayWithPayPal}
                  className="px-4 py-2 rounded font-bold text-white transition-all hover:brightness-95"
                  style={{ background: '#FF6B00' }}
                >
                  支付
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowVersionSelector(false)}
              className="w-full py-4 rounded-lg font-medium transition-all border"
              style={{ borderColor: BORDER, color: TEXT }}
            >
              稍后再说
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      {!showDanKoe && (
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
      )}

      {/* Footer */}
      {!showDanKoe && (
      <footer className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <p className="text-xs" style={{ color: TEXT_MUTED }}>
            HUMAN 3.0 Development Model · Multidimensional Potential Assessment
          </p>
          <p
            className="text-xs cursor-pointer hover:underline transition-all"
            style={{ color: '#8C7E6A' }}
            onClick={() => setShowDisclaimer(true)}
          >
            灵感来源于 Dan Koe 的 Human 3.0 框架
          </p>
          <p className="text-xs" style={{ color: TEXT_MUTED }}>
            联系邮箱: <a href="mailto:langaijun@foxmail.com" className="hover:underline">langaijun@foxmail.com</a>
          </p>
        </div>
      </footer>
      )}
    </div>
  );
}
