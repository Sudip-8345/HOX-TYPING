import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  ArrowCounterClockwise, 
  ArrowLeft, 
  Clock, 
  FileText, 
  Warning,
  CheckCircle,
  XCircle,
  TrendUp
} from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DictationTestProps {
  audioUrl: string;
  masterTranscript: string;
  title: string;
  language: 'english' | 'hindi';
  font?: 'default' | 'krutidev' | 'mangal';
  duration: number;
  isFree?: boolean;
}

interface TestResults {
  wpm: number;
  netWPM: number;
  accuracy: number;
  correct: number;
  substitutions: number;
  missing: number;
  extra: number;
  totalWords: number;
  typedWords: number;
  timeTaken: string;
  passed: boolean;
}

export function DictationTest({ 
  audioUrl, 
  masterTranscript, 
  title, 
  language,
  font = 'default',
  duration,
  isFree = false 
}: DictationTestProps) {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [roughNotes, setRoughNotes] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [results, setResults] = useState<TestResults | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (testStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - testStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStartTime]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (!testStartTime) {
      setTestStartTime(Date.now());
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleStartDecoding = () => {
    if (roughNotes.trim().length === 0) {
      alert("Please take some notes before decoding.");
      return;
    }
    setIsDecoding(true);
  };

  const calculateResults = (): TestResults => {
    const timeTaken = testStartTime ? (Date.now() - testStartTime) / 1000 / 60 : 0;
    
    const normalizeText = (text: string) => 
      text.toLowerCase()
        .replace(/[^\w\s\u0900-\u097F]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const masterWords = normalizeText(masterTranscript).split(' ').filter(w => w);
    const userWords = normalizeText(finalTranscript).split(' ').filter(w => w);

    let correct = 0;
    let substitutions = 0;
    let missing = 0;
    let extra = 0;

    const maxLength = Math.max(masterWords.length, userWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i >= masterWords.length) {
        extra++;
      } else if (i >= userWords.length) {
        missing++;
      } else if (masterWords[i] === userWords[i]) {
        correct++;
      } else {
        substitutions++;
      }
    }

    const totalWords = masterWords.length;
    const typedWords = userWords.length;
    const accuracy = totalWords > 0 ? ((correct / totalWords) * 100) : 0;
    const wpm = timeTaken > 0 ? Math.round(typedWords / timeTaken) : 0;
    const netWPM = timeTaken > 0 ? Math.round((typedWords - (substitutions + extra)) / timeTaken) : 0;
    
    const passed = accuracy >= 90 && netWPM >= 30;

    return {
      wpm,
      netWPM,
      accuracy: parseFloat(accuracy.toFixed(2)),
      correct,
      substitutions,
      missing,
      extra,
      totalWords,
      typedWords,
      timeTaken: timeTaken.toFixed(2),
      passed
    };
  };

  const handleSubmit = () => {
    if (finalTranscript.trim().length === 0) {
      alert("Please complete the transcription before submitting.");
      return;
    }

    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setIsCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFontClass = () => {
    if (language === 'hindi') {
      switch (font) {
        case 'krutidev': return 'font-krutidev';
        case 'mangal': return 'font-mangal';
        default: return 'font-noto-devanagari';
      }
    }
    return '';
  };

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Test Results</CardTitle>
                  <CardDescription>{title}</CardDescription>
                </div>
                {results.passed ? (
                  <CheckCircle className="h-12 w-12 text-green-500" weight="fill" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" weight="fill" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-4xl font-bold mb-2">
                  {results.accuracy}%
                </div>
                <div className="text-muted-foreground">Accuracy</div>
                <Badge 
                  variant={results.passed ? "default" : "destructive"}
                  className="mt-2"
                >
                  {results.passed ? "PASSED" : "NEEDS IMPROVEMENT"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {results.wpm}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Gross WPM
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {results.netWPM}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Net WPM
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {results.correct}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Correct Words
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {results.timeTaken}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Minutes
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Error Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Substitutions</span>
                    <Badge variant="destructive">{results.substitutions}</Badge>
                  </div>
                  <Progress 
                    value={(results.substitutions / results.totalWords) * 100} 
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Missing Words</span>
                    <Badge variant="secondary">{results.missing}</Badge>
                  </div>
                  <Progress 
                    value={(results.missing / results.totalWords) * 100} 
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Extra Words</span>
                    <Badge variant="outline">{results.extra}</Badge>
                  </div>
                  <Progress 
                    value={(results.extra / results.totalWords) * 100} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setIsCompleted(false);
                    setResults(null);
                    setRoughNotes('');
                    setFinalTranscript('');
                    setIsDecoding(false);
                    setTestStartTime(null);
                    setElapsedTime(0);
                    handleReset();
                  }}
                >
                  <ArrowCounterClockwise className="mr-2 h-4 w-4" />
                  Retake Test
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Back to Tests
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                      {language === 'hindi' ? 'Hindi' : 'English'} Dictation Test
                      {isFree && <Badge className="ml-2" variant="secondary">Free Trial</Badge>}
                    </CardDescription>
                  </div>
                  {language === 'hindi' && (
                    <Badge variant="outline">
                      {font === 'krutidev' ? 'KrutiDev' : font === 'mangal' ? 'Mangal' : 'Default'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play weight="fill" />
                  Audio Dictation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <audio ref={audioRef} src={audioUrl} />
                
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    onClick={togglePlayPause}
                    className="w-20"
                  >
                    {isPlaying ? (
                      <Pause weight="fill" className="h-6 w-6" />
                    ) : (
                      <Play weight="fill" className="h-6 w-6" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    <ArrowCounterClockwise className="h-4 w-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-muted-foreground min-w-[60px]">
                      Speed: {playbackSpeed}x
                    </span>
                    <Slider
                      value={[playbackSpeed]}
                      min={0.75}
                      max={1.5}
                      step={0.25}
                      onValueChange={(value) => setPlaybackSpeed(value[0])}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Alert>
                  <Warning className="h-4 w-4" />
                  <AlertDescription>
                    Listen carefully to the audio and take rough notes below. You'll decode them later.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Tabs value={isDecoding ? "transcription" : "notes"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes" disabled={isDecoding}>
                  Rough Notes
                </TabsTrigger>
                <TabsTrigger value="transcription" disabled={!isDecoding}>
                  Final Transcription
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Take Rough Notes</CardTitle>
                    <CardDescription>
                      Listen to the audio and jot down what you hear. Use shorthand or abbreviations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Start typing your rough notes here..."
                      value={roughNotes}
                      onChange={(e) => setRoughNotes(e.target.value)}
                      className={`min-h-[300px] text-lg ${getFontClass()}`}
                      disabled={isDecoding}
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {roughNotes.split(/\s+/).filter(w => w).length} words
                      </span>
                      <Button onClick={handleStartDecoding}>
                        Start Decoding
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcription" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Final Transcription</CardTitle>
                    <CardDescription>
                      Decode your rough notes into a clean, accurate transcription.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">Your Rough Notes:</div>
                      <div className={`text-sm ${getFontClass()}`}>
                        {roughNotes}
                      </div>
                    </div>

                    <Textarea
                      placeholder="Type the final clean transcription here..."
                      value={finalTranscript}
                      onChange={(e) => setFinalTranscript(e.target.value)}
                      className={`min-h-[300px] text-lg ${getFontClass()}`}
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {finalTranscript.split(/\s+/).filter(w => w).length} words
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsDecoding(false)}
                        >
                          Back to Notes
                        </Button>
                        <Button onClick={handleSubmit}>
                          Submit Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock weight="fill" />
                  Test Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Time Elapsed
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText weight="fill" />
                  Word Count
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rough Notes</span>
                    <span className="font-medium">
                      {roughNotes.split(/\s+/).filter(w => w).length}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((roughNotes.split(/\s+/).filter(w => w).length / 100) * 100, 100)} 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Final Transcript</span>
                    <span className="font-medium">
                      {finalTranscript.split(/\s+/).filter(w => w).length}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((finalTranscript.split(/\s+/).filter(w => w).length / 100) * 100, 100)} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                    1
                  </div>
                  <span>Listen to the audio carefully and take rough notes</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                    2
                  </div>
                  <span>Use the speed control to adjust playback</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                    3
                  </div>
                  <span>Click "Start Decoding" when ready</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                    4
                  </div>
                  <span>Rewrite your notes into clean transcription</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                    5
                  </div>
                  <span>Submit to see your results</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendUp weight="fill" />
                  Passing Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Minimum Accuracy:</span>
                  <span className="font-medium">90%</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Net WPM:</span>
                  <span className="font-medium">30</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
