import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Lightning, 
  Target, 
  Warning, 
  Timer, 
  ArrowCounterClockwise, 
  Keyboard,
  Lightbulb,
  Translate
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TypingDisplay } from '@/components/TypingDisplay'
import { MetricCard } from '@/components/MetricCard'
import { ProgressChart } from '@/components/ProgressChart'
import { 
  calculateWPM, 
  calculateAccuracy, 
  getRandomText, 
  analyzeErrors,
  SessionData 
} from '@/lib/typingUtils'
import { cn } from '@/lib/utils'

function App() {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english')
  const [promptText, setPromptText] = useState(() => getRandomText('english'))
  const [userInput, setUserInput] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [incorrectChars, setIncorrectChars] = useState<Map<number, string>>(new Map())
  const [aiTip, setAiTip] = useState<string>('')
  const [sessions, setSessions] = useKV<SessionData[]>('typing-sessions', [])
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const wpm = useMemo(() => {
    return calculateWPM(userInput.length, timeElapsed)
  }, [userInput.length, timeElapsed])

  const accuracy = useMemo(() => {
    const correctChars = userInput.split('').filter((char, index) => char === promptText[index]).length
    return calculateAccuracy(correctChars, userInput.length)
  }, [userInput, promptText])

  useEffect(() => {
    if (isActive && !isComplete) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
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
  }, [isActive, isComplete])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault()
        handleRestart()
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
    }

    setUserInput(value)

    if (value === promptText) {
      setIsComplete(true)
      setIsActive(false)
      completeSession()
    }
  }, [isActive, promptText])

  const completeSession = useCallback(() => {
    const finalWpm = calculateWPM(userInput.length, timeElapsed)
    const finalAccuracy = calculateAccuracy(
      userInput.split('').filter((char, index) => char === promptText[index]).length,
      userInput.length
    )

    const newSession: SessionData = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors: errorCount,
      duration: timeElapsed,
      language,
    }

    setSessions(prev => [...(prev || []), newSession])
    
    const tip = analyzeErrors(incorrectChars)
    setAiTip(tip)
    
    toast.success('Session Complete!', {
      description: `${finalWpm} WPM with ${finalAccuracy}% accuracy`,
    })
  }, [userInput, timeElapsed, promptText, errorCount, language, incorrectChars, setSessions])

  const handleRestart = useCallback(() => {
    setUserInput('')
    setIsActive(false)
    setIsComplete(false)
    setStartTime(null)
    setTimeElapsed(0)
    setErrorCount(0)
    setIncorrectChars(new Map())
    setAiTip('')
    setPromptText(getRandomText(language))
    inputRef.current?.focus()
    toast.info('Session restarted')
  }, [language])

  const handleLanguageToggle = useCallback(() => {
    const newLang = language === 'english' ? 'hindi' : 'english'
    setLanguage(newLang)
    setPromptText(getRandomText(newLang))
    setUserInput('')
    setIsActive(false)
    setIsComplete(false)
    setStartTime(null)
    setTimeElapsed(0)
    setErrorCount(0)
    setIncorrectChars(new Map())
    setAiTip('')
    inputRef.current?.focus()
    toast.info(`Switched to ${newLang === 'english' ? 'English' : 'Hindi'}`)
  }, [language])

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

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard size={28} weight="duotone" className="text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">TypeMaster</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {language === 'english' ? 'English' : 'हिंदी'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLanguageToggle}
            >
              <Translate size={18} weight="bold" />
              Switch Language
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <TypingDisplay
              promptText={promptText}
              userInput={userInput}
              currentIndex={userInput.length}
              isComplete={isComplete}
            />

            <div className="relative">
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onPaste={handlePaste}
                disabled={isComplete}
                placeholder="Start typing here..."
                className={cn(
                  "w-full min-h-[120px] p-6 rounded-lg border-2 font-mono text-lg",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "resize-none transition-all duration-200",
                  isComplete ? 'bg-muted cursor-not-allowed' : 'bg-background',
                  isActive ? 'border-accent' : 'border-input'
                )}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleRestart}
                variant="default"
                size="lg"
              >
                <ArrowCounterClockwise size={20} weight="bold" />
                Restart (Ctrl+R)
              </Button>
              
              {isComplete && (
                <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20">
                  <Target size={20} weight="bold" />
                  <span className="font-medium">Session Complete!</span>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 lg:hidden">
              <MetricCard
                label="WPM"
                value={wpm}
                icon={<Lightning size={24} weight="fill" />}
              />
              <MetricCard
                label="Accuracy"
                value={accuracy}
                suffix="%"
                icon={<Target size={24} weight="fill" />}
              />
              <MetricCard
                label="Errors"
                value={errorCount}
                icon={<Warning size={24} weight="fill" />}
              />
              <MetricCard
                label="Time"
                value={formatTime(timeElapsed)}
                icon={<Timer size={24} weight="fill" />}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="hidden lg:grid gap-4">
              <MetricCard
                label="WPM"
                value={wpm}
                icon={<Lightning size={24} weight="fill" />}
              />
              <MetricCard
                label="Accuracy"
                value={accuracy}
                suffix="%"
                icon={<Target size={24} weight="fill" />}
              />
              <MetricCard
                label="Errors"
                value={errorCount}
                icon={<Warning size={24} weight="fill" />}
              />
              <MetricCard
                label="Time"
                value={formatTime(timeElapsed)}
                icon={<Timer size={24} weight="fill" />}
              />
            </div>

            {aiTip && (
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb size={24} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      AI Insight
                    </h3>
                    <p className="text-sm text-foreground italic">{aiTip}</p>
                  </div>
                </div>
              </Card>
            )}

            <Separator />

            <ProgressChart sessions={sessions || []} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-6 bg-card/50">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Practice daily to improve your typing skills • Focus on accuracy first, speed will follow</p>
        </div>
      </footer>
    </div>
  )
}

export default App
