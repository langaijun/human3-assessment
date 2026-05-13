import { useState, useCallback, useEffect } from 'react';
import type { AssessmentResult, AppPhase } from '@/types';
import type { AppVersion } from '@/types/version';
import HeroSection from '@/sections/HeroSection';
import AssessmentInterface from '@/sections/AssessmentInterface';
import MetatypeCanvas from '@/sections/MetatypeCanvas';
import ReportPage from '@/sections/ReportPage';
import { useVersionState } from '@/hooks/usePersistentVersionState';
import { VERSION_FEATURES } from '@/constants';

const BG_COLOR = '#FDF6E3';

function App() {
  const [phase, setPhase] = useState<AppPhase>('hero');
  const [initialInput, setInitialInput] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<AppVersion>('simple');
  const [showVersionSelector, setShowVersionSelector] = useState(false);

  const { versionState, setVersionState, isLoaded } = useVersionState();

  useEffect(() => {
    if (isLoaded && versionState.selectedVersion) {
      setSelectedVersion(versionState.selectedVersion);
    }
  }, [isLoaded, versionState]);

  const handleStartAssessment = useCallback((input: string) => {
    if (selectedVersion === 'complete' && !versionState.isPaid) {
      setShowVersionSelector(true);
    } else {
      setInitialInput(input);
      setPhase('assessment');
    }
  }, [selectedVersion, versionState.isPaid]);

  const handleAssessmentComplete = useCallback((result: AssessmentResult) => {
    setAssessmentResult(result);
    setPhase('metatype');
  }, []);

  const handleMetatypeComplete = useCallback(() => {
    setPhase('report');
  }, []);

  const handleVersionSelect = useCallback((version: AppVersion) => {
    setSelectedVersion(version);
    setShowVersionSelector(false);
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
          showVersionSelector={showVersionSelector}
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
          selectedVersion={selectedVersion}
        />
      )}
    </div>
  );
}

export default App;
