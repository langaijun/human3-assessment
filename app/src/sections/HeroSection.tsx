import { useState, useCallback, useEffect } from 'react';
import { ArrowRight, Languages } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '@/i18n';
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
  const { selectedVersion, setSelectedVersion, language, setLanguage } = useAppStore();
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDanKoe, setShowDanKoe] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Sync i18n language with store
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      onStartAssessment(inputValue.trim());
    }, 500);
  }, [inputValue, isTransitioning, onStartAssessment]);

  const handleLanguageToggle = useCallback(() => {
    const currentIndex = SUPPORTED_LANGUAGES.indexOf(language);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    setLanguage(SUPPORTED_LANGUAGES[nextIndex]);
  }, [language, setLanguage]);

  // Get features array from translation
  const features = t(`version.${selectedVersion}.features`, { returnObjects: true }) as string[];

  const placeholder = selectedVersion === 'complete'
    ? t('hero.placeholderComplete')
    : t('hero.placeholder');

  return (
    <div className="relative w-full min-h-screen flex flex-col" style={{ background: BG }}>
      {/* Navigation */}
      <nav
        className="flex items-center justify-between px-6 py-4 transition-all duration-500"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: TEXT }}>
            <span className="text-xs font-bold" style={{ color: BG }}>H</span>
          </div>
          <span className="text-sm font-medium" style={{ color: TEXT }}>uman3.0</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              color: TEXT_MUTED,
            }}
            title={t('common.switchLanguage')}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{LANGUAGE_NAMES[language]}</span>
          </button>

          <button
            onClick={() => setShowDanKoe(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              color: TEXT_MUTED,
            }}
          >
            <span>{t('nav.human3')}</span>
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
        <div className="w-full max-w-3xl">
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
                {t(`version.${version}.title`)}
              </button>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: TEXT }}>
            {t('hero.title')}
          </h1>
          <p className="text-base my-8 text-center" style={{ color: TEXT_MUTED }}>
            {t(`version.${selectedVersion}.description`)}
          </p>

          {/* Version Features */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {Array.isArray(features) && features.map((feature: string, index: number) => (
                <span
                  key={index}
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
                placeholder={placeholder}
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
            {t('footer.subtitle')}
          </p>
          <p
            className="text-xs cursor-pointer hover:underline transition-all"
            style={{ color: '#8C7E6A' }}
            onClick={() => setShowDisclaimer(true)}
          >
            {t('footer.disclaimer')}
          </p>
          <p className="text-xs" style={{ color: TEXT_MUTED }}>
            {t('footer.contact')}: <a href="mailto:hello@astraea.blog" className="hover:underline">hello@astraea.blog</a>
          </p>
        </div>
      </footer>
      )}
    </div>
  );
}