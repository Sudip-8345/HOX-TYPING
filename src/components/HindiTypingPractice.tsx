import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  ArrowCounterClockwise,
  Play,
  Pause,
  CheckCircle,
  Lightning,
  Target,
  Timer,
  ChartLine,
  Brain,
  Fire,
  X,
  Backspace,
  Keyboard
} from '@phosphor-icons/react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/Header'
import { TypingDisplay } from '@/components/TypingDisplay'
import { MetricCard } from '@/components/MetricCard'
import { AICoach } from '@/components/AICoach'
import { ProgressChart } from '@/components/ProgressChart'
import { toast } from 'sonner'
import { 
  SessionData,
  languageFonts,
  examModes,
  getRandomText,
  calculateWPM,
  calculateNetWPM,
  calculateAccuracy,
  calculateCPM,
  generateAITip,
  detectWeakKeys
} from '@/lib/typingUtils'
import { transliterate, TransliterationMode } from '@/lib/transliteration'

export function HindiTypingPractice() {
  const [language, setLanguage] = useState('hindi')
  const [font, setFont] = useState('noto')
  const [duration, setDuration] = useState(600)
  const [examMode, setExamMode] = useState('ssc')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [keyboardMode, setKeyboardMode] = useKV<TransliterationMode>('keyboard-mode', 'direct')

  const [promptText, setPromptText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [displayInput, setDisplayInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  const [correctChars, setCorrectChars] = useState(0)
  const [errors, setErrors] = useState(0)
  const [backspaceCount, setBackspaceCount] = useState(0)
  const [incorrectChars, setIncorrectChars] = useState<Map<number, string>>(new Map())
  
  const [sessions, setSessions] = useKV<SessionData[]>('typing-sessions', [])
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentExamMode = examModes.find(em => em.id === examMode)
  const currentFontConfig = languageFonts
    .find(lf => lf.language === language)
    ?.fonts.find(f => f.id === font)

  const grossWPM = calculateWPM(displayInput.length, timeElapsed)
  const netWPM = calculateNetWPM(grossWPM, errors, timeElapsed)
  const accuracy = calculateAccuracy(correctChars, displayInput.length)
  const cpm = calculateCPM(displayInput.length, timeElapsed)
  const weakKeys = detectWeakKeys(incorrectChars, promptText)
  const aiTip = generateAITip({ 
    wpm: netWPM, 
    grossWpm: grossWPM, 
    netWpm: netWPM, 
    accuracy, 
    errors, 
    timeElapsed,
    charactersTyped: displayInput.length,
    correctChars,
    cpm
  }, weakKeys)

  const progress = promptText ? (displayInput.length / promptText.length) * 100 : 0
  const timeRemaining = currentExamMode?.duration ? currentExamMode.duration - timeElapsed : duration - timeElapsed

  useEffect(() => {
    loadNewText()
  }, [language])

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1
          if (currentExamMode?.duration && newTime >= currentExamMode.duration) {
            handleComplete()
            return prev
          }
          if (duration > 0 && newTime >= duration) {
            handleComplete()
            return prev
          }
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, duration, currentExamMode])

  useEffect(() => {
    if (displayInput.length >= promptText.length && promptText.length > 0) {
      handleComplete()
    }
  }, [displayInput, promptText])

  const loadNewText = useCallback(() => {
    const newText = getRandomText(language)
    setPromptText(newText)
    setUserInput('')
    setDisplayInput('')
    setCurrentIndex(0)
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setTimeElapsed(0)
    setStartTime(null)
    setCorrectChars(0)
    setErrors(0)
    setBackspaceCount(0)
    setIncorrectChars(new Map())
  }, [language])

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true)
      setStartTime(Date.now())
      inputRef.current?.focus()
      toast.success('Practice session started!')
    }
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
    toast.info(isPaused ? 'Resumed' : 'Paused')
  }

  const handleRestart = () => {
    if (isActive || isComplete) {
      loadNewText()
      toast.info('Session restarted with new text')
    }
  }

  const handleComplete = () => {
    if (isComplete) return
    
    setIsComplete(true)
    setIsActive(false)
    setIsPaused(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (timeElapsed > 5 && displayInput.length > 10) {
      const newSession: SessionData = {
        id: `session-${Date.now()}`,
        timestamp: Date.now(),
        wpm: netWPM,
        grossWpm: grossWPM,
        netWpm: netWPM,
        accuracy,
        errors,
        duration: timeElapsed,
        language,
        font: currentFontConfig?.name || font,
        examMode: currentExamMode?.id || null,
        weakKeys
      }
      
      setSessions((current) => [...(current || []), newSession])

      if (netWPM >= 50 || accuracy >= 97) {
        toast.success('🎉 Excellent performance!', {
          description: `${netWPM} WPM with ${accuracy}% accuracy`
        })
      } else if (netWPM >= 30) {
        toast.success('Good job!', {
          description: `Keep practicing to improve further`
        })
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    
    if (isComplete || isPaused) return

    if (!isActive) {
      handleStart()
    }

    if (newValue.length < userInput.length) {
      if (currentExamMode && !currentExamMode.allowBackspace) {
        toast.error('Backspace disabled in exam mode!')
        return
      }
      setBackspaceCount(prev => prev + 1)
      
      setUserInput(newValue)
      const transliterated = keyboardMode !== 'direct' ? transliterate(newValue, keyboardMode) : newValue
      setDisplayInput(transliterated)
      setCurrentIndex(transliterated.length)
      return
    }

    const transliterated = keyboardMode !== 'direct' ? transliterate(newValue, keyboardMode) : newValue
    const lastChar = transliterated[transliterated.length - 1]
    const expectedChar = promptText[transliterated.length - 1]

    if (transliterated.length > displayInput.length) {
      if (lastChar === expectedChar) {
        setCorrectChars(prev => prev + 1)
      } else {
        setErrors(prev => prev + 1)
        setIncorrectChars(prev => {
          const updated = new Map(prev)
          updated.set(transliterated.length - 1, lastChar)
          return updated
        })
      }
    }

    setUserInput(newValue)
    setDisplayInput(transliterated)
    setCurrentIndex(transliterated.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'v') {
        e.preventDefault()
        toast.error('Pasting is not allowed!')
        return
      }
    }

    if (currentExamMode && !currentExamMode.allowBackspace && e.key === 'Backspace') {
      e.preventDefault()
      toast.error('Backspace is disabled in exam mode!')
      return
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        language={language}
        font={font}
        duration={duration}
        examMode={examMode}
        soundEnabled={soundEnabled}
        onLanguageChange={setLanguage}
        onFontChange={setFont}
        onDurationChange={setDuration}
        onExamModeChange={setExamMode}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
      />

      <main className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={20} weight="bold" />
              Home
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="gap-2"
              disabled={!isActive && !isComplete}
            >
              <ArrowCounterClockwise size={20} weight="bold" />
              <span className="hidden sm:inline">Restart</span>
            </Button>
            
            <Button
              onClick={handlePause}
              variant="outline"
              className="gap-2"
              disabled={!isActive || isComplete}
            >
              {isPaused ? (
                <>
                  <Play size={20} weight="fill" />
                  <span className="hidden sm:inline">Resume</span>
                </>
              ) : (
                <>
                  <Pause size={20} weight="fill" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </Button>

            {isActive && !isComplete && (
              <Button
                onClick={handleComplete}
                className="gap-2"
              >
                <CheckCircle size={20} weight="fill" />
                <span className="hidden sm:inline">Submit</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Timer size={24} weight="duotone" className="text-primary" />
                  <div>
                    <div className="text-3xl font-bold tabular-nums">
                      {formatTime(timeRemaining >= 0 ? timeRemaining : timeElapsed)}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {currentExamMode?.duration ? 'Time Remaining' : 'Time Elapsed'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Complete</div>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </Card>

            <div className="relative">
              {isPaused && (
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <Card className="p-6 text-center">
                    <Pause size={48} weight="duotone" className="mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Session Paused</h3>
                    <p className="text-sm text-muted-foreground">Click Resume to continue</p>
                  </Card>
                </div>
              )}
              
              {isComplete && (
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <Card className="p-8 text-center max-w-md">
                    <CheckCircle size={64} weight="duotone" className="mx-auto mb-4 text-success" />
                    <h3 className="text-2xl font-bold mb-2">Session Complete!</h3>
                    <div className="grid grid-cols-2 gap-4 my-6">
                      <div>
                        <div className="text-3xl font-bold text-primary">{netWPM}</div>
                        <div className="text-xs text-muted-foreground">Net WPM</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-success">{accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                    </div>
                    <Button onClick={handleRestart} className="w-full gap-2">
                      <ArrowCounterClockwise size={20} weight="bold" />
                      Start New Session
                    </Button>
                    <Link to="/leaderboard" className="block mt-3">
                      <Button variant="outline" className="w-full gap-2">
                        <ChartLine size={20} weight="bold" />
                        View Leaderboard
                      </Button>
                    </Link>
                  </Card>
                </div>
              )}

              <TypingDisplay
                promptText={promptText}
                userInput={displayInput}
                currentIndex={currentIndex}
                isComplete={isComplete}
                fontClass={currentFontConfig?.className || 'font-mono'}
              />
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target size={20} weight="duotone" className="text-accent" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide">Your Input</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Keyboard size={18} weight="duotone" className="text-muted-foreground" />
                  <Select
                    value={keyboardMode}
                    onValueChange={(value) => {
                      setKeyboardMode(value as TransliterationMode)
                      toast.success(`Switched to ${value === 'direct' ? 'Direct Hindi' : value === 'phonetic' ? 'Phonetic (Google)' : 'Mangal Kruti'} keyboard`)
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Select keyboard" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct Hindi</SelectItem>
                      <SelectItem value="phonetic">Phonetic (Google)</SelectItem>
                      <SelectItem value="mangal-kruti">Mangal Kruti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isComplete}
                placeholder={isActive ? "Start typing..." : "Click here or press any key to start..."}
                className={`w-full min-h-[120px] p-4 rounded-lg border-2 border-input bg-background 
                  text-lg md:text-xl leading-relaxed resize-none focus:outline-none focus:ring-2 
                  focus:ring-ring focus:border-transparent transition-all
                  ${currentFontConfig?.className || 'font-mono'}
                  ${isComplete ? 'opacity-60' : ''}
                `}
              />
              {keyboardMode !== 'direct' && displayInput && (
                <div className={`mt-3 p-3 rounded-lg bg-muted/50 text-lg ${currentFontConfig?.className || 'font-mono'}`}>
                  <div className="text-xs text-muted-foreground mb-1 font-sans uppercase tracking-wide">
                    Hindi Output:
                  </div>
                  {displayInput}
                </div>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Backspace size={14} />
                  Backspace: {backspaceCount}
                </span>
                {keyboardMode !== 'direct' && (
                  <Badge variant="secondary" className="text-xs">
                    <Keyboard size={12} className="mr-1" />
                    {keyboardMode === 'phonetic' ? 'Phonetic Mode' : 'Mangal Kruti Mode'}
                  </Badge>
                )}
                {currentExamMode && !currentExamMode.allowBackspace && (
                  <Badge variant="destructive" className="text-xs">
                    <X size={12} className="mr-1" />
                    Backspace Disabled
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Net WPM"
                value={netWPM}
                icon={<Lightning size={20} weight="fill" />}
                className="col-span-2"
              />
              <MetricCard
                label="Gross WPM"
                value={grossWPM}
                icon={<ChartLine size={20} weight="bold" />}
              />
              <MetricCard
                label="Accuracy"
                value={accuracy}
                suffix="%"
                icon={<Target size={20} weight="fill" />}
              />
            </div>

            <Card className="p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                Session Stats
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters Typed</span>
                  <span className="font-semibold">{displayInput.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Correct</span>
                  <span className="font-semibold text-success">{correctChars}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Errors</span>
                  <span className="font-semibold text-destructive">{errors}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPM</span>
                  <span className="font-semibold">{cpm}</span>
                </div>
              </div>
            </Card>

            <AICoach
              tip={aiTip}
              weakKeys={weakKeys}
              accuracy={accuracy}
              wpm={netWPM}
            />

            {weakKeys.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Fire size={20} weight="fill" className="text-destructive" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide">
                    Weak Keys
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {weakKeys.map((key, idx) => (
                    <Badge key={idx} variant="outline" className="text-lg px-3 py-1">
                      {key}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            <ProgressChart sessions={sessions || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
