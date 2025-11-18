import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft,
  ArrowCounterClockwise,
  Play,
  Pause,
  CheckCircle,
  X,
  Backspace,
  Keyboard,
  Bell,
  User
} from '@phosphor-icons/react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TypingDisplay } from '@/components/TypingDisplay'
import { HindiKeyboard } from '@/components/HindiKeyboard'
import { RealTimeMetrics } from '@/components/RealTimeMetrics'
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
  detectWeakKeys,
  evaluatePromptAgainstInput
} from '@/lib/typingUtils'
import { transliterate, TransliterationMode } from '@/lib/transliteration'
import { createTypingSession, TypingSessionPayload } from '@/lib/apiClient'

interface UserProfile {
  photoUrl: string
  fullName: string
  username: string
}

export function HindiTypingPractice() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [language, setLanguage] = useState('hindi')
  const [font, setFont] = useState('noto')
  const [duration, setDuration] = useState(600)
  const [examMode, setExamMode] = useState('ssc')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [keyboardMode, setKeyboardMode] = useKV<TransliterationMode>('keyboard-mode', 'remington')
  const [imeBypass, setImeBypass] = useState(false)

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
  const [profile] = useKV<UserProfile>('user-profile', {
    photoUrl: '',
    fullName: user?.name || '',
    username: user?.name || ''
  })
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentExamMode = examModes.find(em => em.id === examMode)
  const currentFontConfig = languageFonts
    .find(lf => lf.language === language)
    ?.fonts.find(f => f.id === font)
  const renderedFontClass = currentFontConfig?.className || 'font-hindi'
  const hindiFontOptions = useMemo(
    () => languageFonts.find(lf => lf.language === 'hindi')?.fonts || [],
    []
  )
  const effectiveKeyboardMode = useMemo<TransliterationMode>(() => {
    if (keyboardMode === 'direct') return 'direct'
    return imeBypass ? 'direct' : keyboardMode
  }, [imeBypass, keyboardMode])

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
  const transliterationPreview = useMemo(() => {
    if (!displayInput) return ''
    const startIndex = Math.max(0, displayInput.length - 80)
    return displayInput.slice(startIndex)
  }, [displayInput])

  const syncSessionWithBackend = useCallback((payload: TypingSessionPayload) => {
    if (!isAuthenticated) return

    void createTypingSession(payload).catch((error) => {
      console.error('Failed to sync typing session', error)
      const message = error instanceof Error ? error.message : 'Unable to sync session'
      toast.error('Failed to sync session', { description: message })
    })
  }, [isAuthenticated])

  useEffect(() => {
    loadNewText()
  }, [language])

  useEffect(() => {
    if (keyboardMode === 'direct' && imeBypass) {
      setImeBypass(false)
    }
  }, [keyboardMode, imeBypass])

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

  const handleImeToggle = useCallback(() => {
    if (keyboardMode === 'direct') {
      toast.info('System IME already active')
      return
    }

    setImeBypass(prev => {
      const next = !prev
      toast.info(next ? 'System IME enabled' : `${keyboardMode} layout active`)
      return next
    })
  }, [keyboardMode])

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

      syncSessionWithBackend({
        wpm: Math.max(0, Math.round(netWPM)),
        accuracy: Number(accuracy.toFixed(2)),
        language,
        font: currentFontConfig?.name || font,
        durationSec: Math.max(1, timeElapsed),
        mode: currentExamMode?.id || 'custom'
      })

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
      const transliterated = effectiveKeyboardMode !== 'direct' ? transliterate(newValue, effectiveKeyboardMode) : newValue
      const evaluation = evaluatePromptAgainstInput(promptText, transliterated)
      setDisplayInput(transliterated)
      setCorrectChars(evaluation.correct)
      setErrors(evaluation.errors)
      setIncorrectChars(evaluation.incorrectMap)
      setCurrentIndex(transliterated.length)
      return
    }

    const transliterated = effectiveKeyboardMode !== 'direct' ? transliterate(newValue, effectiveKeyboardMode) : newValue
    const evaluation = evaluatePromptAgainstInput(promptText, transliterated)

    setUserInput(newValue)
    setDisplayInput(transliterated)
    setCorrectChars(evaluation.correct)
    setErrors(evaluation.errors)
    setIncorrectChars(evaluation.incorrectMap)
    setCurrentIndex(transliterated.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setLastPressedKey(e.key)
    
    setTimeout(() => setLastPressedKey(''), 200)

    if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
      e.preventDefault()
      handleImeToggle()
      return
    }
    
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-foreground">
      <div className="border-b border-border/40 bg-[#1f1f1f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft size={20} weight="bold" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Hindi Typing Practice</h1>
                <p className="text-sm text-muted-foreground">
                  Improve your Hindi typing speed and accuracy with real-time feedback
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} weight="duotone" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              <Link to="/profile">
                <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  {profile?.photoUrl ? (
                    <AvatarImage src={profile.photoUrl} alt={profile.fullName} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(profile?.fullName || user?.name || 'User')}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
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
            <Card className="bg-[#242424]/80 backdrop-blur border-border/40 overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-border/30">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Font</p>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose font" />
                    </SelectTrigger>
                    <SelectContent>
                      {hindiFontOptions.map(option => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{currentExamMode?.duration ? 'Time Remaining' : 'Time Elapsed'}</p>
                  <div className="text-2xl font-bold tabular-nums">{formatTime(timeRemaining >= 0 ? timeRemaining : timeElapsed)}</div>
                  <p className="text-[11px] text-muted-foreground">Progress {Math.round(progress)}%</p>
                </div>
              </div>

              <div className="relative bg-[#1a1a1a] border-b border-border/20">
                {isPaused && (
                  <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Card className="p-6 text-center">
                      <Pause size={36} weight="duotone" className="mx-auto mb-2 text-primary" />
                      <p className="font-semibold">Session Paused</p>
                      <p className="text-xs text-muted-foreground">Resume to continue typing</p>
                    </Card>
                  </div>
                )}

                {isComplete && (
                  <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Card className="p-6 text-center">
                      <CheckCircle size={40} weight="duotone" className="mx-auto mb-2 text-success" />
                      <p className="font-semibold">Session Complete</p>
                      <p className="text-xs text-muted-foreground">Restart for a fresh passage</p>
                    </Card>
                  </div>
                )}

                <TypingDisplay
                  promptText={promptText || 'Loading text...'}
                  userInput={displayInput}
                  currentIndex={currentIndex}
                  isComplete={isComplete}
                  fontClass={renderedFontClass}
                />
              </div>

              <div className="px-6 py-5 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Active layout</p>
                    <p className="text-lg font-semibold">
                      {effectiveKeyboardMode === 'direct' ? 'System IME' : effectiveKeyboardMode}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button variant="secondary" size="sm" onClick={handlePause}>
                      {isPaused ? (
                        <>
                          <Play size={16} weight="fill" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause size={16} weight="fill" />
                          <span>Pause</span>
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRestart}>
                      <ArrowCounterClockwise size={16} weight="bold" />
                      Restart
                    </Button>
                  </div>
                </div>

                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={isComplete}
                  placeholder={isActive ? 'Type here. Shift + Space toggles IME.' : 'Click here to start typing...'}
                  className={`w-full min-h-[120px] p-4 rounded-lg border-2 border-input/40 bg-[#111111] 
                    text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 
                    focus:ring-ring focus:border-transparent transition-all ${renderedFontClass}
                    ${isComplete ? 'opacity-60' : ''}
                  `}
                />
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Backspace size={14} />
                    Backspace: {backspaceCount}
                  </span>
                  {currentExamMode && !currentExamMode.allowBackspace && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <X size={12} />
                      Backspace Locked
                    </Badge>
                  )}
                  {imeBypass && keyboardMode !== 'direct' && (
                    <Badge variant="outline" className="text-xs border-dashed border-primary/50 text-primary">
                      System IME override
                    </Badge>
                  )}
                </div>

                {effectiveKeyboardMode !== 'direct' && transliterationPreview && (
                  <div className={`mt-2 rounded-lg border border-border/50 bg-black/30 p-3 ${renderedFontClass}`}>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Rendered Hindi preview</p>
                    <p className="text-xl mt-1">{transliterationPreview}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-[#242424]/80 backdrop-blur border-border/40">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold">Keyboard / IME mode</p>
                  <p className="text-xs text-muted-foreground">Remington, Inscript, phonetic and system IME options</p>
                </div>
                <Select value={keyboardMode} onValueChange={(value) => setKeyboardMode(value as TransliterationMode)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remington">Remington (Govt)</SelectItem>
                    <SelectItem value="inscript">Inscript</SelectItem>
                    <SelectItem value="phonetic">Phonetic (Smart Roman)</SelectItem>
                    <SelectItem value="mangal-kruti">Mangal/Kruti</SelectItem>
                    <SelectItem value="direct">System IME (No mapping)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <HindiKeyboard 
                mode={keyboardMode}
                pressedKey={lastPressedKey}
              />
              <div className="flex flex-wrap items-center justify-between mt-3 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[11px] capitalize">{keyboardMode}</Badge>
                  {imeBypass && keyboardMode !== 'direct' && (
                    <Badge variant="outline" className="text-[11px] border-dashed border-primary/60 text-primary">
                      System IME
                    </Badge>
                  )}
                  <span className="text-[11px]">
                    Active: {effectiveKeyboardMode === 'direct' ? 'System IME' : keyboardMode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={handleImeToggle}
                    disabled={keyboardMode === 'direct'}
                  >
                    <Keyboard size={14} />
                    Toggle IME
                  </Button>
                  <span className="text-[11px]">Shift + Space</span>
                </div>
              </div>
            </Card>

            <HindiHelperPanel mode={effectiveKeyboardMode} fontClass={renderedFontClass} />
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

interface HelperTip {
  trigger: string
  output: string
  note?: string
}

interface HelperConfig {
  title: string
  description: string
  combos: HelperTip[]
  notes?: string[]
}

const helperConfigs: Record<TransliterationMode, HelperConfig> = {
  remington: {
    title: 'Remington quick keys',
    description: 'Government/typing test layout',
    combos: [
      { trigger: 'Shift + Q', output: 'औ' },
      { trigger: 'Shift + W', output: 'ऐ' },
      { trigger: 'D', output: '्', note: 'Halant / Virama' },
      { trigger: 'Shift + ;', output: 'छ' },
    ],
    notes: ['Matras live on ASDF keys', 'Use Z row for nasal marks (ं,ँ)'],
  },
  inscript: {
    title: 'Inscript essentials',
    description: 'Bureau of Indian Standards layout',
    combos: [
      { trigger: 'F', output: 'ि', note: 'Pre-matra, renders before consonant' },
      { trigger: 'J + D', output: 'र्द्', note: 'Consonant cluster with halant' },
      { trigger: 'Shift + S', output: 'ए' },
      { trigger: 'Shift + O', output: 'ध' },
    ],
    notes: ['Use D for halant, type following consonant immediately', 'Shift row outputs independent vowels'],
  },
  phonetic: {
    title: 'Smart phonetic combos',
    description: 'Type in Roman, get Devanagari',
    combos: [
      { trigger: 'k + i', output: 'कि', note: 'i matra auto-prepended' },
      { trigger: 'k + aa', output: 'का' },
      { trigger: 'sh + u', output: 'शु' },
      { trigger: 'tra + i', output: 'त्रै' },
    ],
    notes: ['Double vowels (aa, ee, oo) create long matras', 'Add “h” for aspirated sounds (dh, th)'],
  },
  'mangal-kruti': {
    title: 'Mangal/Kruti keys',
    description: 'Legacy Krutidev-style typing',
    combos: [
      { trigger: 'Shift + 4', output: 'ृ' },
      { trigger: 'Shift + F', output: 'ि', note: 'Place before consonant' },
      { trigger: 'Shift + 6', output: 'ू' },
      { trigger: 'Shift + X', output: 'ँ' },
    ],
    notes: ['Virama is on D key', 'Use Alt codes for rare characters if needed'],
  },
  direct: {
    title: 'System IME tips',
    description: 'Using Windows/macOS language bar',
    combos: [
      { trigger: 'Win + Space', output: 'Language picker' },
      { trigger: 'Alt + Shift', output: 'Switch layout' },
      { trigger: 'Ctrl + Space', output: 'Toggle IME' },
    ],
    notes: ['Keep OS IME on Hindi to bypass in-app mappings', 'Shift + Space inside editor flips back to app layout'],
  },
}

function HindiHelperPanel({ mode, fontClass }: { mode: TransliterationMode; fontClass: string }) {
  const config = helperConfigs[mode] || helperConfigs.phonetic

  return (
    <Card className="p-5 bg-[#242424]/80 backdrop-blur border-border/40">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Input helpers</p>
          <h3 className="text-sm font-semibold">{config.title}</h3>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
        <Badge variant="outline" className="text-[11px] capitalize">{mode}</Badge>
      </div>

      {config.combos.length > 0 && (
        <div className="space-y-2">
          {config.combos.map((combo, idx) => (
            <div
              key={`${combo.trigger}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-black/30 px-3 py-2"
            >
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{combo.trigger}</div>
                {combo.note && (
                  <p className="text-[11px] text-muted-foreground">{combo.note}</p>
                )}
              </div>
              <div className={`text-xl font-semibold ${fontClass}`}>{combo.output}</div>
            </div>
          ))}
        </div>
      )}

      {config.notes && config.notes.length > 0 && (
        <ul className="mt-3 list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
          {config.notes.map((note, idx) => (
            <li key={`${note}-${idx}`}>{note}</li>
          ))}
        </ul>
      )}
    </Card>
  )
}
