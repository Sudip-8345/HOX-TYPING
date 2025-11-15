import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Lightning, 
  Target, 
  Warning, 
  Timer, 
  ArrowCounterClockwise, 
  Play,
  Pause,
  CheckCircle
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/Header'
import { TypingDisplay } from '@/components/TypingDisplay'
import { MetricCard } from '@/components/MetricCard'
import { ProgressChart } from '@/components/ProgressChart'
import { AICoach } from '@/components/AICoach'
import { 
  calculateWPM, 
  calculateNetWPM,
  calculateAccuracy, 
  calculateCPM,
  getRandomText, 
  detectWeakKeys,
  generateAITip,
  SessionData,
  languageFonts,
  examModes
} from '@/lib/typingUtils'
import { cn } from '@/lib/utils'

function App() {
  const [language, setLanguage] = useState('english')
  const [font, setFont] = useState('jetbrains')
  const [duration, setDuration] = useState(60)
  const [examMode, setExamMode] = useState('practice')
  const [soundEnabled, setSoundEnabled] = useState(false)
  
  const [promptText, setPromptText] = useState(() => getRandomText('english'))
  const [userInput, setUserInput] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [incorrectChars, setIncorrectChars] = useState<Map<number, string>>(new Map())
  const [aiTip, setAiTip] = useState<string>('')
  const [weakKeys, setWeakKeys] = useState<string[]>([])
  
  const [sessions, setSessions] = useKV<SessionData[]>('typing-sessions', [])
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentExamMode = useMemo(() => 
    examModes.find(em => em.id === examMode) || examModes[0], 
    [examMode]
  )

  const currentFont = useMemo(() => {
    const langConfig = languageFonts.find(lf => lf.language === language)
    const fontConfig = langConfig?.fonts.find(f => f.id === font)
    return fontConfig?.className || 'font-mono'
  }, [language, font])

  const correctChars = useMemo(() => {
    return userInput.split('').filter((char, index) => char === promptText[index]).length
  }, [userInput, promptText])

  const grossWpm = useMemo(() => {
    return calculateWPM(userInput.length, timeElapsed)
  }, [userInput.length, timeElapsed])

  const netWpm = useMemo(() => {
    return calculateNetWPM(grossWpm, errorCount, timeElapsed)
  }, [grossWpm, errorCount, timeElapsed])

  const accuracy = useMemo(() => {
    return calculateAccuracy(correctChars, userInput.length)
  }, [correctChars, userInput.length])

  const cpm = useMemo(() => {
    return calculateCPM(userInput.length, timeElapsed)
  }, [userInput.length, timeElapsed])

  const progress = useMemo(() => {
    return (userInput.length / promptText.length) * 100
  }, [userInput.length, promptText.length])

  useEffect(() => {
    if (isActive && !isPaused && !isComplete) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1
          if (currentExamMode.duration > 0 && newTime >= currentExamMode.duration) {
            completeSession()
            return newTime
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
  }, [isActive, isPaused, isComplete])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault()
        handleRestart()
      }
      if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault()
        handlePauseToggle()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    
    if (!isActive && value.length > 0) {
      setIsActive(true)
      setStartTime(Date.now())
    }

    if (value.length > promptText.length) {
      return
    }

    const lastIndex = value.length - 1
    if (lastIndex >= 0 && value[lastIndex] !== promptText[lastIndex]) {
      setErrorCount(prev => prev + 1)
      setIncorrectChars(prev => new Map(prev).set(lastIndex, value[lastIndex]))
      
      if (soundEnabled) {
        playErrorSound()
      }
    } else if (lastIndex >= 0 && soundEnabled) {
      playSuccessSound()
    }

    setUserInput(value)

    if (value === promptText) {
      completeSession()
    }
  }, [isActive, promptText, soundEnabled])

  const handleBackspace = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace' && !currentExamMode.allowBackspace && userInput.length > 0) {
      e.preventDefault()
      toast.error('Backspace disabled in exam mode', {
        description: 'You cannot delete characters in exam simulation'
      })
    }
  }, [currentExamMode, userInput])

  const completeSession = useCallback(() => {
    setIsComplete(true)
    setIsActive(false)

    const finalWpm = calculateWPM(userInput.length, timeElapsed)
    const finalGrossWpm = grossWpm
    const finalNetWpm = calculateNetWPM(grossWpm, errorCount, timeElapsed)
    const finalAccuracy = calculateAccuracy(correctChars, userInput.length)
    const finalWeakKeys = detectWeakKeys(incorrectChars, promptText)

    const stats = {
      wpm: finalWpm,
      grossWpm: finalGrossWpm,
      netWpm: finalNetWpm,
      accuracy: finalAccuracy,
      errors: errorCount,
      timeElapsed,
      charactersTyped: userInput.length,
      correctChars,
      cpm: calculateCPM(userInput.length, timeElapsed)
    }

    const tip = generateAITip(stats, finalWeakKeys)
    setAiTip(tip)
    setWeakKeys(finalWeakKeys)

    const newSession: SessionData = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      wpm: finalWpm,
      grossWpm: finalGrossWpm,
      netWpm: finalNetWpm,
      accuracy: finalAccuracy,
      errors: errorCount,
      duration: timeElapsed,
      language,
      font,
      examMode: examMode === 'practice' ? null : examMode,
      weakKeys: finalWeakKeys,
    }

    setSessions(prev => [...(prev || []), newSession])
    
    if (finalAccuracy >= 97 || finalWpm >= 50) {
      toast.success('Outstanding Performance! 🎉', {
        description: `${finalWpm} WPM with ${finalAccuracy}% accuracy`
      })
    } else {
      toast.success('Session Complete!', {
        description: `${finalWpm} WPM with ${finalAccuracy}% accuracy`
      })
    }
  }, [userInput, timeElapsed, promptText, errorCount, language, font, examMode, incorrectChars, correctChars, grossWpm, setSessions])

  const handleRestart = useCallback(() => {
    setUserInput('')
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setStartTime(null)
    setTimeElapsed(0)
    setErrorCount(0)
    setIncorrectChars(new Map())
    setAiTip('')
    setWeakKeys([])
    setPromptText(getRandomText(language))
    inputRef.current?.focus()
    toast.info('Session restarted')
  }, [language])

  const handlePauseToggle = useCallback(() => {
    if (!isActive || isComplete) return
    setIsPaused(prev => !prev)
    toast.info(isPaused ? 'Resumed' : 'Paused')
  }, [isActive, isComplete, isPaused])

  const handleLanguageChange = useCallback((newLang: string) => {
    setLanguage(newLang)
    const langConfig = languageFonts.find(lf => lf.language === newLang)
    if (langConfig) {
      setFont(langConfig.fonts[0].id)
    }
    setPromptText(getRandomText(newLang))
    handleRestart()
  }, [handleRestart])

  const handleFontChange = useCallback((newFont: string) => {
    setFont(newFont)
  }, [])

  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration)
  }, [])

  const handleExamModeChange = useCallback((newMode: string) => {
    setExamMode(newMode)
    const mode = examModes.find(em => em.id === newMode)
    if (mode && mode.duration > 0) {
      setDuration(mode.duration)
    }
    toast.info(`Switched to ${mode?.name}`)
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    toast.error('Pasting is disabled', {
      description: 'Type the text manually to practice properly'
    })
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const playSuccessSound = () => {
  }

  const playErrorSound = () => {
  }

  const timeRemaining = currentExamMode.duration > 0 
    ? Math.max(0, currentExamMode.duration - timeElapsed) 
    : 0

  const isTimeWarning = timeRemaining > 0 && timeRemaining <= 30

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        language={language}
        font={font}
        duration={duration}
        examMode={examMode}
        soundEnabled={soundEnabled}
        onLanguageChange={handleLanguageChange}
        onFontChange={handleFontChange}
        onDurationChange={handleDurationChange}
        onExamModeChange={handleExamModeChange}
        onSoundToggle={() => setSoundEnabled(prev => !prev)}
      />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <TypingDisplay
              promptText={promptText}
              userInput={userInput}
              currentIndex={userInput.length}
              isComplete={isComplete}
              fontClass={currentFont}
            />

            <div className="relative">
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleBackspace}
                onPaste={handlePaste}
                disabled={isComplete || isPaused}
                placeholder={isPaused ? 'Paused - Press Ctrl+Space to resume...' : 'Start typing here...'}
                className={cn(
                  'w-full min-h-[120px] p-6 rounded-xl border-2 text-lg',
                  'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
                  'resize-none transition-all duration-200',
                  currentFont,
                  isComplete ? 'bg-muted cursor-not-allowed' : 'bg-card',
                  isPaused ? 'bg-muted/50 cursor-not-allowed' : '',
                  isActive && !isPaused ? 'border-accent shadow-lg' : 'border-input'
                )}
              />
              {progress > 0 && (
                <Progress 
                  value={progress} 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl" 
                />
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleRestart}
                variant="default"
                size="lg"
                className="gap-2"
              >
                <ArrowCounterClockwise size={20} weight="bold" />
                Restart (Ctrl+R)
              </Button>
              
              {isActive && !isComplete && (
                <Button 
                  onClick={handlePauseToggle}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  {isPaused ? (
                    <>
                      <Play size={20} weight="fill" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause size={20} weight="fill" />
                      Pause
                    </>
                  )}
                </Button>
              )}
              
              {isComplete && (
                <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20">
                  <CheckCircle size={20} weight="fill" />
                  <span className="font-semibold">Complete!</span>
                </div>
              )}

              {currentExamMode.duration > 0 && isActive && (
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold",
                  isTimeWarning 
                    ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" 
                    : "bg-card border-border"
                )}>
                  <Timer size={20} weight="fill" />
                  <span>Time Left: {formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:hidden">
              <MetricCard
                label="Gross WPM"
                value={grossWpm}
                icon={<Lightning size={24} weight="fill" className="text-primary" />}
              />
              <MetricCard
                label="Net WPM"
                value={netWpm}
                icon={<Lightning size={24} weight="fill" className="text-accent" />}
              />
              <MetricCard
                label="Accuracy"
                value={accuracy}
                suffix="%"
                icon={<Target size={24} weight="fill" className="text-success" />}
              />
              <MetricCard
                label="Errors"
                value={errorCount}
                icon={<Warning size={24} weight="fill" className="text-error" />}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="hidden lg:grid gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    Timer
                  </span>
                  <Timer size={20} weight="fill" className="text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {formatTime(timeElapsed)}
                </div>
              </Card>

              <MetricCard
                label="Gross WPM"
                value={grossWpm}
                icon={<Lightning size={24} weight="fill" className="text-primary" />}
              />
              <MetricCard
                label="Net WPM"
                value={netWpm}
                icon={<Lightning size={24} weight="fill" className="text-accent" />}
              />
              <MetricCard
                label="Accuracy"
                value={accuracy}
                suffix="%"
                icon={<Target size={24} weight="fill" className="text-success" />}
              />
              <MetricCard
                label="Errors"
                value={errorCount}
                icon={<Warning size={24} weight="fill" className="text-error" />}
              />
              <MetricCard
                label="CPM"
                value={cpm}
                icon={<Target size={24} weight="fill" className="text-secondary" />}
              />
            </div>

            <AICoach 
              tip={aiTip}
              weakKeys={weakKeys}
              accuracy={accuracy}
              wpm={grossWpm}
            />

            <ProgressChart sessions={sessions || []} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-6 bg-card/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            TypistPro India - Professional Typing Practice Platform
          </p>
          <p className="text-xs text-muted-foreground">
            Practice daily • Focus on accuracy • Master government typing exams (SSC, RRB, High Court)
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
