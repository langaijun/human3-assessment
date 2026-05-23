import { useEffect, useRef, useState } from 'react';
import { Brain, Activity, Heart, Briefcase, Target, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AssessmentResult } from '@/types';
import { PAYMENT } from '@/constants';
import DanKoeDisclaimer from '@/components/DanKoeDisclaimer';

const BG = '#FDF6E3';
const BORDER = '#E8DCC8';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';

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
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const levelNames = [
    t('levels.conformist'),
    t('levels.individualist'),
    t('levels.synthesist'),
  ];
  const phaseNames = [
    t('phases.dissonance'),
    t('phases.uncertainty'),
    t('phases.discovery'),
  ];

  return (
    <div
      ref={cardRef}
      className={`rounded-xl overflow-hidden transition-all duration-700 hover:shadow-md ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          style={{ filter: `hue-rotate(${level * 30}deg)` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #FDF6E3 0%, #FDF6E300 60%)' }}
        />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <h3 className="font-medium text-sm" style={{ color: TEXT }}>
              {title}
            </h3>
            <p className="text-xs" style={{ color: TEXT_MUTED }}>
              Level {levelNames[level - 1]}
              {phaseNames[phase - 1]}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}
          >
            {traits}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: '#6B5F50' }}
        >
          {analysis}
        </p>
      </div>
    </div>
  );
}

interface ReportPageProps {
  result: AssessmentResult;
}

export default function ReportPage({ result }: ReportPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const { t } = useTranslation();

  const dimensionColors = {
    mind: '#8B7EC8',
    body: '#5A8F5A',
    spirit: '#8B7EC8',
    vocation: '#C4956A'
  };

  const dimensionImages = {
    mind: '/images/mind-dimension.jpg',
    body: '/images/body-dimension.jpg',
    spirit: '/images/spirit-dimension.jpg',
    vocation: '/images/vocation-dimension.jpg',
  };

  const dimensionLabels = {
    mind: `${t('dimensions.mind')} / ${t('dimensions.mindEn')}`,
    body: `${t('dimensions.body')} / ${t('dimensions.bodyEn')}`,
    spirit: `${t('dimensions.spirit')} / ${t('dimensions.spiritEn')}`,
    vocation: `${t('dimensions.vocation')} / ${t('dimensions.vocationEn')}`,
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen" style={{ background: BG }}>
      {/* Hero section */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 text-center"
            style={{ color: TEXT }}
          >
            {t('report.title')}
          </h1>

          <p className="text-center text-base mb-8" style={{ color: TEXT_MUTED }}>
            {result.metatypeName}
          </p>
        </div>
      </div>

      {/* Dimensions section */}
      <div className="px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: TEXT }}>
            {t('report.dimensionsTitle')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <QuadrantCard
              title={t('dimensions.mind')}
              icon={Brain}
              level={result.quadrantAnalysis.mind.level}
              phase={result.quadrantAnalysis.mind.phase}
              traits={result.quadrantAnalysis.mind.traits}
              analysis={result.quadrantAnalysis.mind.analysis}
              color={dimensionColors.mind}
              image={dimensionImages.mind}
            />
            <QuadrantCard
              title={t('dimensions.body')}
              icon={Activity}
              level={result.quadrantAnalysis.body.level}
              phase={result.quadrantAnalysis.body.phase}
              traits={result.quadrantAnalysis.body.traits}
              analysis={result.quadrantAnalysis.body.analysis}
              color={dimensionColors.body}
              image={dimensionImages.body}
            />
            <QuadrantCard
              title={t('dimensions.spirit')}
              icon={Heart}
              level={result.quadrantAnalysis.spirit.level}
              phase={result.quadrantAnalysis.spirit.phase}
              traits={result.quadrantAnalysis.spirit.traits}
              analysis={result.quadrantAnalysis.spirit.analysis}
              color={dimensionColors.spirit}
              image={dimensionImages.spirit}
            />
            <QuadrantCard
              title={t('dimensions.vocation')}
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
            <ScoreBar label={dimensionLabels.mind} score={result.dimensionScores.mind} color={dimensionColors.mind} />
            <ScoreBar label={dimensionLabels.body} score={result.dimensionScores.body} color={dimensionColors.body} />
            <ScoreBar label={dimensionLabels.spirit} score={result.dimensionScores.spirit} color={dimensionColors.spirit} />
            <ScoreBar label={dimensionLabels.vocation} score={result.dimensionScores.vocation} color={dimensionColors.vocation} />
          </div>
        </div>
      </div>

      {/* Transformation strategy section */}
      <div className="px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Target className="w-5 h-5" style={{ color: TEXT }} />
            <h2 className="text-2xl font-semibold" style={{ color: TEXT }}>
              {t('report.transformationStrategy')}
            </h2>
          </div>

          <div className="rounded-xl p-6 mb-10" style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#8C7E6A' }}>
                <Target className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm" style={{ color: TEXT }}>
                {t('report.coreStrategy')}
              </p>
            </div>

            <p className="leading-relaxed mb-2" style={{ color: '#4A4035' }}>
              {result.transformationStrategy}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#8C7E6A' }}>
                  <span className="text-white text-xs">1</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {t('report.actionPlan')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#8C7E6A' }}>
                  <span className="text-white text-xs">2</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {t('report.habitReshaping')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#8C7E6A' }}>
                  <span className="text-white text-xs">3</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {t('report.systemIntegration')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#8C7E6A' }}>
                  <span className="text-white text-xs">4</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {t('report.continuousEvaluation')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-10 mb-3">
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#8C7E6A' }}>
                <Target className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm" style={{ color: TEXT }}>
                {t('report.nextSteps')}
              </p>
            </div>

            <div className="space-y-3">
              {result.nextSteps.slice(0, 3).map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#8C7E6A' }}
                  >
                    <span className="text-white text-xs">{i + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sponsorship Card */}
      <div className="px-6 py-2">
        <div className="max-w-md mx-auto">
          <div
            className="rounded-xl p-6 text-center"
            style={{ background: '#FAF3E5', border: `1px solid ${BORDER}` }}
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6" style={{ color: '#FF9800' }} />
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: TEXT_MUTED }}>
              {t('report.sponsorship')}
            </p>
            <button
              onClick={() => window.open(PAYMENT.PAYPAL_LINK, '_blank')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-95"
              style={{ background: '#FF9800', color: '#FFFFFF' }}
            >
              <span>{t('report.sponsor')}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-xs" style={{ color: TEXT_MUTED }}>
            {t('footer.subtitle')}
          </p>
          <p className="text-xs cursor-pointer hover:underline transition-all" style={{ color: '#8C7E6A' }} onClick={() => setShowDisclaimer(true)}>
            {t('footer.disclaimer')}
          </p>
        </div>
      </footer>

      {/* Dan Koe Disclaimer */}
      {showDisclaimer && (
        <DanKoeDisclaimer
          onClose={() => setShowDisclaimer(false)}
        />
      )}
    </div>
  );
}