import { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { VERSION_FEATURES } from '@/constants';
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
  const { selectedVersion, setSelectedVersion } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
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
          <span className="text-sm font-medium" style={{ color: TEXT }}>uman3.0</span>
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

      {/* Main content */}
      {!showDanKoe && (
      <div
        className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-700 ${
          isTransitioning ? 'opacity-0 scale-[0.98]' : ''
        }`}
      >
        <div className="w-full max-w-2xl">
          {/* Version Selector */}
          <div className="flex justify-center gap-3 mb-6">
            {(['simple', 'complete'] as const).map((version) => (
              <button
                key={version}
                onClick={() => setSelectedVersion(version)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedVersion === version
                    ? 'shadow-md'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: selectedVersion === version ? '#8C7E6A' : BG_CARD,
                  color: selectedVersion === version ? '#FFFFFF' : TEXT,
                  border: `1px solid ${BORDER}`,
                }}
              >
                {VERSION_FEATURES[version].title}
              </button>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: TEXT }}>
            Human3.0
          </h1>
          <p className="text-base my-8 text-center" style={{ color: TEXT_MUTED }}>
            {VERSION_FEATURES[selectedVersion].description}
          </p>

          {/* Version Features */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {VERSION_FEATURES[selectedVersion].features.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: BG_CARD,
                    border: `1px solid ${BORDER}`,
                    color: TEXT_MUTED,
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

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
            联系邮箱: <a href="mailto:hello@astraea.blog" className="hover:underline">hello@astraea.blog</a>
          </p>
        </div>
      </footer>
      )}
    </div>
  );
}