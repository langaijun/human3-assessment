import { useState, useCallback, useEffect } from 'react';
import type { AssessmentResult, AppPhase } from '@/types';
import type { AppVersion } from '@/types/version';
import HeroSection from '@/sections/HeroSection';
import AssessmentInterface from '@/sections/AssessmentInterface';
import MetatypeCanvas from '@/sections/MetatypeCanvas';
import ReportPage from '@/sections/ReportPage';
import { usePersistentVersionState } from '@/hooks/usePersistentVersionState';

const BG_COLOR = '#FDF6E3';

function App() {
  const [phase, setPhase] = useState<AppPhase>('hero');
  const [initialInput, setInitialInput] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<AppVersion>('simple');

  const { versionState, isLoaded } = usePersistentVersionState();

  useEffect(() => {
    if (isLoaded && versionState?.selectedVersion) {
      setSelectedVersion(versionState.selectedVersion);
    }
  }, [isLoaded, versionState?.selectedVersion]);

  const handleStartAssessment = useCallback((input: string) => {
    setInitialInput(input);
    setPhase('assessment');
  }, []);

  const handleAssessmentComplete = useCallback((result: AssessmentResult) => {
    setAssessmentResult(result);
    setPhase('metatype');
  }, []);

  const handleMetatypeComplete = useCallback(() => {
    setPhase('report');
  }, []);

  const handleVersionSelect = useCallback((version: AppVersion) => {
    setSelectedVersion(version);
  }, []);

  const handleRestart = useCallback(() => {
    setPhase('hero');
    setInitialInput('');
    setAssessmentResult(null);
    setSelectedVersion('simple');
  }, []);

  return (
    <div className="relative w-full min-h-screen" style={{ background: BG_COLOR }}>
      {phase === 'hero' && (
        <HeroSection
          onStartAssessment={handleStartAssessment}
          selectedVersion={selectedVersion}
          onVersionSelect={handleVersionSelect}
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
