import { useState, useCallback, useEffect } from 'react';
import type { AssessmentResult, AppPhase } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import SEOHead from '@/components/SEOHead';
import i18n from '@/i18n';
import HeroSection from '@/sections/HeroSection';
import AssessmentInterface from '@/sections/AssessmentInterface';
import MetatypeCanvas from '@/sections/MetatypeCanvas';
import ReportPage from '@/sections/ReportPage';

const BG_COLOR = '#FDF6E3';

function App() {
  const [phase, setPhase] = useState<AppPhase>('hero');
  const [initialInput, setInitialInput] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const { language } = useAppStore();

  // Sync i18n language with store on mount
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const handleStartAssessment = useCallback((input?: string) => {
    if (input) {
      setInitialInput(input);
      setPhase('assessment');
    }
  }, []);

  const handleAssessmentComplete = useCallback((result: AssessmentResult) => {
    setAssessmentResult(result);
    // Show report directly, skip MetatypeCanvas
    setPhase('report');
  }, []);

  const handleMetatypeComplete = useCallback(() => {
    setPhase('report');
  }, []);

  return (
    <div className="relative w-full min-h-screen" style={{ background: BG_COLOR }}>
      <SEOHead phase={phase} />

      {phase === 'hero' && (
        <HeroSection
          onStartAssessment={handleStartAssessment}
        />
      )}

      {phase === 'assessment' && (
        <AssessmentInterface
          initialInput={initialInput}
          onComplete={handleAssessmentComplete}
        />
      )}

      {phase === 'metatype' && assessmentResult && (
        <MetatypeCanvas
          result={assessmentResult}
          onComplete={handleMetatypeComplete}
        />
      )}

      {phase === 'report' && assessmentResult && (
        <ReportPage
          result={assessmentResult}
        />
      )}
    </div>
  );
}

export default App;