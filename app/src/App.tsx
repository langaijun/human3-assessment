import { useState, useCallback } from 'react';
import type { AssessmentResult, AppPhase } from '@/types';
import HeroSection from '@/sections/HeroSection';
import AssessmentInterface from '@/sections/AssessmentInterface';
import MetatypeCanvas from '@/sections/MetatypeCanvas';
import ReportPage from '@/sections/ReportPage';

const BG_COLOR = '#FDF6E3';

function App() {
  const [phase, setPhase] = useState<AppPhase>('hero');
  const [initialInput, setInitialInput] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleStartAssessment = useCallback((input?: string) => {
    if (input) {
      setInitialInput(input);
      setPhase('assessment');
    }
  }, []);

  const handleAssessmentComplete = useCallback((result: AssessmentResult) => {
    setAssessmentResult(result);
    // 直接显示报告，跳过 MetatypeCanvas
    setPhase('report');
  }, []);

  const handleMetatypeComplete = useCallback(() => {
    setPhase('report');
  }, []);

  const handleRestart = useCallback(() => {
    setPhase('hero');
    setInitialInput('');
    setAssessmentResult(null);
  }, []);

  return (
    <div className="relative w-full min-h-screen" style={{ background: BG_COLOR }}>
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
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
