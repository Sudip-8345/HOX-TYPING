import { useParams, Navigate } from 'react-router-dom';
import { DictationTest } from './DictationTest';
import { sampleTests } from './DictationHub';

export function DictationTestPage() {
  const { testId } = useParams<{ testId: string }>();
  
  const test = sampleTests.find(t => t.id === testId);
  
  if (!test) {
    return <Navigate to="/dictation" replace />;
  }

  return (
    <DictationTest
      audioUrl={test.audioUrl}
      masterTranscript={test.masterTranscript}
      title={test.title}
      language={test.language}
      font={test.font}
      duration={test.duration}
      isFree={test.isFree}
    />
  );
}
