import { useEffect, useRef, useState } from 'react';
import { Brain, Activity, Heart, Briefcase, RotateCcw, ChevronDown, TrendingUp, AlertCircle, Target, Lock, Star, CheckCircle } from 'lucide-react';
import type { AssessmentResult, AppVersion } from '@/types';
import { useVersionState } from '@/hooks/usePersistentVersionState';
import { VERSION_FEATURES } from '@/constants';

interface ReportPageProps {
  result: AssessmentResult;
  onRestart: () => void;
}

const BG = '#FDF6E3';
const BORDER = '#E8DCC8';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';
const CARD_BG = '#F8F0D8';

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(score * 100), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm" style={{ color: '#5C5245' }}>{label}</span>
        <span className="text-sm font-mono-code" style={{ color: TEXT_MUTED }}>{Math.round(score * 100)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EDE5D0' }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}

function QuadrantCard({
  title, icon: Icon, level, phase, traits, analysis, color, image,
}: {
  title: string; icon: typeof Brain; level: number; phase: number;
  traits: string; analysis: string; color: string; image: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const levelNames = ['1.0 遵从者', '2.0 独立者', '3.0 综合者'];
  const phaseNames = ['.1 失调期', '.2 不确定期', '.3 发现期'];

  return (
    <div
      ref={cardRef}
      className={`rounded-xl overflow-hidden transition-all duration-700 hover:shadow-md ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}
    >
      <div className="relative h-40 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" style={{ filter: `hue-rotate(${level * 30}deg)` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #FDF6E3 0%, #FDF6E300 60%)' }} />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <h3 className="font-medium text-sm" style={{ color: TEXT }}>{title}</h3>
            <p className="text-xs" style={{ color: TEXT_MUTED }}>
              Level {levelNames[level - 1]}{phaseNames[phase - 1]}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}>
            {traits}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>{analysis}</p>
      </div>
    </div>
  );
}

export default function ReportPage({ result, onRestart }: ReportPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);
  const { versionState } = useVersionState();
  const isCompleteVersion = versionState.selectedVersion === 'complete';

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
  }, []);

  const scrollToDetails = () => {
    containerRef.current?.scrollTo({ top: containerRef.current.clientHeight * 0.6, behavior: 'smooth' });
  };

  const dimensionColors = { mind: '#8B7EC8', body: '#5A8F5A', spirit: '#8B7EC8', vocation: '#C4956A' };
  const dimensionImages = {
    mind: '/images/mind-dimension.jpg',
    body: '/images/body-dimension.jpg',
    spirit: '/images/spirit-dimension.jpg',
    vocation: '/images/vocation-dimension.jpg',
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen" style={{ background: BG }}>
      {/* Hero section */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center" style={{ color: TEXT }}>
            你的评估结果
          </h1>

          <p className="text-center text-base mb-8" style={{ color: TEXT_MUTED }}>
            {result.metatypeName}
          </p>

          {isCompleteVersion && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="w-5 h-5 fill="#FF9800" />
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ background: '#FFF9F0', color: '#FF9800' }}>
                完整版深度分析
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dimensions section */}
      <div className="px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: TEXT }}>
            四维评估结果
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <QuadrantCard
              title="心智维度"
              icon={Brain}
              level={result.quadrantAnalysis.mind.level}
              phase={result.quadrantAnalysis.mind.phase}
              traits={result.quadrantAnalysis.mind.traits}
              analysis={result.quadrantAnalysis.mind.analysis}
              color={dimensionColors.mind}
              image={dimensionImages.mind}
            />
            <QuadrantCard
              title="身体维度"
              icon={Activity}
              level={result.quadrantAnalysis.body.level}
              phase={result.quadrantAnalysis.body.phase}
              traits={result.quadrantAnalysis.body.traits}
              analysis={result.quadrantAnalysis.body.analysis}
              color={dimensionColors.body}
              image={dimensionImages.body}
            />
            <QuadrantCard
              title="灵性维度"
              icon={Heart}
              level={result.quadrantAnalysis.spirit.level}
              phase={result.quadrantAnalysis.spirit.phase}
              traits={result.quadrantAnalysis.spirit.traits}
              analysis={result.quadrantAnalysis.spirit.analysis}
              color={dimensionColors.spirit}
              image={dimensionImages.spirit}
            />
            <QuadrantCard
              title="职业维度"
              icon={Briefcase}
              level={result.quadrantAnalysis.vocation.level}
              phase={result.quadrantAnalysis.vocation.phase}
              traits={result.quadrantAnalysis.vocation.traits}
              analysis={result.quadrantAnalysis.vocation.analysis}
              color={dimensionColors.vocation}
              image={dimensionImages.vocation}
            />
          </div>

          {/* Score bars */}
          <div className="max-w-md mx-auto mb-10">
            <ScoreBar label="心智 Mind" score={result.dimensionScores.mind} color={dimensionColors.mind} />
            <ScoreBar label="身体 Body" score={result.dimensionScores.body} color={dimensionColors.body} />
            <ScoreBar label="灵性 Spirit" score={result.dimensionScores.spirit} color={dimensionColors.spirit} />
            <ScoreBar label="职业 Vocation" score={result.dimensionScores.vocation} color={dimensionColors.vocation} />
          </div>

          {/* Scroll hint */}
          <button
            onClick={scrollToDetails}
            className="flex flex-col items-center gap-1.5 mx-auto transition-colors"
            style={{ color: TEXT_MUTED }}
          >
            <span className="text-xs">查看详细分析</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Transformation strategy section */}
      <div className="px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-6 md:p-8 mb-10" style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5" style={{ color: TEXT }} />
              <h2 className="text-xl font-semibold" style={{ color: TEXT }}>转型策略</h2>
            </div>

            {!isCompleteVersion && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ background: '#FFF9F0', color: '#FF9800' }}>
                <Star className="w-3 h-3 fill="#FF9800" />
                完整版深度分析
              </span>
            )}

            <p className="leading-relaxed mb-8" style={{ color: '#4A4035' }}>{result.transformationStrategy}</p>

            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: TEXT_MUTED }}>核心策略</p>
            <p className="leading-relaxed mb-8" style={{ color: TEXT }}>
              {result.nextSteps.slice(0, 1).map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#8C7E6A' }}>
                    <span className="text-white text-xs">{i + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </p>

            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: TEXT_MUTED }}>下一步行动</p>
            <div className="space-y-3">
              {result.nextSteps.slice(1).map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#8C7E6A' }}>
                    <span className="text-white text-xs">{i + 2}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {!isCompleteVersion && (
              <div className="mt-6 p-4 rounded-lg" style={{ background: '#FDF6E8' }}>
                <p className="text-sm text-center" style={{ color: TEXT }}>
                  完整版提供深度分析和详细建议
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Lock className="w-5 h-5" style={{ color: TEXT_MUTED }} />
                  <span className="text-sm">升级到完整版解锁所有功能</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs text-center" style={{ color: TEXT_MUTED }}>
            HUMAN 3.0 Development Model · Multidimensional Potential Assessment
          </p>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all hover:brightness-95"
            style={{ background: '#8C7E6A', color: '#FFFFFF', border: `1px solid ${BORDER}` }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新测评</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
