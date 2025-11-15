import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Keyboard,
  Bell,
  Gear,
  User
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
import { HindiKeyboard } from '@/components/HindiKeyboard'
import { TypingGuide } from '@/components/TypingGuide'
import { RealTimeMetrics } from '@/components/RealTimeMetrics'
import { AIFeedbackPanel } from '@/components/AIFeedbackPanel'
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
  const [lastPressedKey, setLastPressedKey] = useState<string>('')
  
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
    setLastPressedKey(e.key)
    
    setTimeout(() => setLastPressedKey(''), 200)
    
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
    <div className="min-h-screen bg-[#1a1a1a] text-foreground">
      <div className="border-b border-border/40 bg-[#1f1f1f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hindi Typing Practice</h1>
              <p className="text-sm text-muted-foreground">
                Improve your Hindi typing speed and accuracy with real-time feedback
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} weight="duotone" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback><User size={20} /></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-6 py-6">
        <div className="grid lg:grid-cols-[280px_1fr_320px] gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-[#242424]/80 backdrop-blur border-border/40">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Session Progress: <span className="text-success font-semibold">{Math.round(progress)}%</span></div>
                  <Progress value={progress} className="h-2 mt-2" />
                </div>
              </div>
              <Button className="w-full gap-2 bg-success hover:bg-success/90 text-white">
                <CheckCircle size={18} weight="fill" />
                Exam Mode
              </Button>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-[#242424]/80 backdrop-blur border-border/40">
              <div className={`text-lg leading-relaxed mb-4 ${currentFontConfig?.className || 'font-hindi'}`}>
                {promptText || 'Loading text...'}
              </div>
              
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={isComplete}
                  placeholder={isActive ? "Start typing..." : "Click here to start..."}
                  className={`w-full min-h-[80px] p-4 rounded-lg border-2 border-input/40 bg-[#1a1a1a] 
                    text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 
                    focus:ring-ring focus:border-transparent transition-all
                    ${currentFontConfig?.className || 'font-hindi'}
                    ${isComplete ? 'opacity-60' : ''}
                  `}
                />
                <div className="absolute top-3 right-3">
                  <Gear size={20} weight="duotone" className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </div>
              </div>

              {keyboardMode !== 'direct' && displayInput && (
                <div className={`mt-3 p-3 rounded-lg bg-muted/20 text-lg ${currentFontConfig?.className || 'font-hindi'}`}>
                  <div className="text-xs text-muted-foreground mb-1 font-sans">
                    Hindi D<span className="text-destructive">:</span>yion <span className="text-muted-foreground">(de typgres)</span>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 bg-[#242424]/80 backdrop-blur border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Remington</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Inscript</span>
                  <Switch checked={keyboardMode === 'phonetic'} onCheckedChange={(checked) => setKeyboardMode(checked ? 'phonetic' : 'direct')} />
                </div>
              </div>
              <HindiKeyboard 
                mode={keyboardMode || 'direct'} 
                pressedKey={lastPressedKey}
              />
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>1/23</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Keyboard size={16} />
                  </Button>
                  <div className="flex-1 h-8 bg-[#1a1a1a] rounded"></div>
                  <span>,</span>
                  <span>.</span>
                  <span className="px-3 py-1 bg-[#1a1a1a] rounded">sctuh</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <RealTimeMetrics
              grossWpm={grossWPM}
              netWpm={netWPM}
              accuracy={accuracy}
              errors={errors}
              correctChars={correctChars}
              incorrectChars={incorrectChars}
              sessions={sessions || []}
              weakKeys={weakKeys}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
