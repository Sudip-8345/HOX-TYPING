import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User } from '@phosphor-icons/react'
import { DrawingCanvas } from '@/components/DrawingCanvas'
import { AudioPlayer } from '@/components/AudioPlayer'
import { StenoKeyboard } from '@/components/StenoKeyboard'
import { TimerDisplay } from '@/components/TimerDisplay'
import { RealTimeMetrics } from '@/components/RealTimeMetrics'
import { AIFeedbackPanel } from '@/components/AIFeedbackPanel'
import { 
  SessionData, 
  calculateWPM, 
  calculateAccuracy,
  generateAITip,
  StenoMetrics
} from '@/lib/stenoUtils'

export function PracticePage() {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [strokesDrawn, setStrokesDrawn] = useState(0)
  const [errors, setErrors] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [aiFeedback, setAiFeedback] = useState<string[]>([])
  
  const [sessions, setSessions] = useKV<SessionData[]>('steno-sessions', [])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive) {
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
  }, [isActive])

  useEffect(() => {
    if (timeElapsed > 0 && strokesDrawn > 0) {
      const minutes = timeElapsed / 60
      const wordsTyped = Math.floor(strokesDrawn / 5)
      const calculatedWpm = calculateWPM(wordsTyped, minutes)
      setWpm(calculatedWpm)
      
      const totalStrokes = strokesDrawn + errors
      const calculatedAccuracy = calculateAccuracy(strokesDrawn, totalStrokes)
      setAccuracy(calculatedAccuracy)

      const metrics: StenoMetrics = {
        wpm: calculatedWpm,
        accuracy: calculatedAccuracy,
        errors,
        timeElapsed,
        strokesDrawn
      }

      const tip = generateAITip(metrics)
      if (tip && !aiFeedback.includes(tip)) {
        setAiFeedback(prev => [...prev.slice(-2), tip])
      }
    }
  }, [timeElapsed, strokesDrawn, errors])

  const handleActivate = () => {
    if (!isActive) {
      setIsActive(true)
    }
  }

  const handleStrokeComplete = () => {
    setStrokesDrawn(prev => prev + 1)
  }

  const handleEndSession = () => {
    if (timeElapsed > 0 && strokesDrawn > 0) {
      const newSession: SessionData = {
        id: `session-${Date.now()}`,
        timestamp: Date.now(),
        wpm,
        accuracy,
        errors,
        duration: timeElapsed,
        strokesDrawn
      }
      setSessions((currentSessions) => [...(currentSessions || []), newSession])
    }
    
    setIsActive(false)
    setTimeElapsed(0)
    setStrokesDrawn(0)
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    setAiFeedback([])
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} weight="bold" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Stenography Practice
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Master Pitman Shorthand with Real-Time AI Feedback
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleEndSession}
                variant="outline"
                disabled={!isActive && timeElapsed === 0}
              >
                {isActive ? 'End Session' : 'Reset'}
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <User size={24} weight="fill" className="text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            <AudioPlayer isActive={isActive} onPlay={handleActivate} />
            
            <DrawingCanvas 
              onStrokeComplete={handleStrokeComplete}
              isActive={isActive}
              onActivate={handleActivate}
            />

            <StenoKeyboard />
          </div>

          <div className="space-y-6">
            <TimerDisplay timeElapsed={timeElapsed} isActive={isActive} />
            
            <RealTimeMetrics 
              grossWpm={wpm}
              netWpm={wpm}
              accuracy={accuracy}
              errors={errors}
              correctChars={strokesDrawn - errors}
              incorrectChars={new Map()}
              sessions={[]}
              weakKeys={[]}
            />

            <AIFeedbackPanel tips={aiFeedback} wpm={wpm} accuracy={accuracy} />
          </div>
        </div>
      </main>
    </div>
  )
}
