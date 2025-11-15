import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Microphone,
  Repeat
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  isActive: boolean
  onPlay: () => void
}

export function AudioPlayer({ isActive, onPlay }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
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
  }, [isPlaying, duration])

  const handlePlayPause = () => {
    if (!isActive) {
      onPlay()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      <div className="relative h-16 flex items-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(50)].map((_, i) => {
            const height = Math.random() * 60 + 20
            const isActive = (progress / 100) * 50 > i
            return (
              <div
                key={i}
                className={cn(
                  'w-1 mx-px rounded-full transition-colors',
                  isActive ? 'bg-success' : 'bg-muted'
                )}
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipBack}
            className="h-10 w-10"
          >
            <SkipBack size={20} weight="fill" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
          >
            <Pause size={20} weight="fill" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={handlePlayPause}
            className="h-12 w-12 rounded-2xl bg-success hover:bg-success/90"
          >
            {isPlaying ? (
              <Pause size={24} weight="fill" />
            ) : (
              <Play size={24} weight="fill" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipForward}
            className="h-10 w-10"
          >
            <SkipForward size={20} weight="fill" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
          >
            <Repeat size={20} weight="bold" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 bg-success/10"
        >
          <Microphone size={20} weight="fill" className="text-success" />
        </Button>
      </div>
    </div>
  )
}
