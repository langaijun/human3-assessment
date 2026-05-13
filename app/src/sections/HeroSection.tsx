import { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartAssessment: (initialInput: string) => void;
}

const BG = '#FDF6E3';
const BG_CARD = '#F8F0D8';
const BORDER = '#E8DCC8';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';

export default function HeroSection({ onStartAssessment }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        <div className="text-xs" style={{ color: TEXT_MUTED }}>基于 HUMAN 3.0 发展模型</div>
      </nav>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-700 ${
          isTransitioning ? 'opacity-0 scale-[0.98]' : ''
        }`}
      >
        <div className="w-full max-w-2xl">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-semibold mb-3 leading-tight tracking-tight" style={{ color: TEXT }}>
            你正处于哪一个进化阶段？
          </h1>
          <p className="text-base mb-3" style={{ color: TEXT_MUTED }}>
            通过 HUMAN 3.0 模型，探索你在心智、身体、灵性、职业四个维度的发展现状，找到你的最大瓶颈。
          </p>
          <p className="text-sm mb-10" style={{ color: TEXT_MUTED }}>
            Based on Dan Koe's Human 3.0 framework — discover whether you're a Conformist, Individualist, or Synthesist. Take the assessment to unlock your evolution stage.
          </p>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="描述你目前最大的困惑或目标..."
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
          <div className="flex flex-wrap gap-2 mb-16">
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

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '四维评估', desc: '心智、身体、灵性、职业四个维度的深度测评' },
              { title: 'AI 对话式测评', desc: '像与导师对话一样自然，自适应追问至 12-20 轮' },
              { title: '个性化报告', desc: '生成你的人格元类型 (Metatype) 与转型策略' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-4 rounded-lg"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              >
                <h3 className="text-sm font-medium mb-1" style={{ color: TEXT }}>{feature.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <p className="text-xs text-center" style={{ color: TEXT_MUTED }}>
          HUMAN 3.0 Development Model · Multidimensional Potential Assessment
        </p>
      </footer>
    </div>
  );
}
