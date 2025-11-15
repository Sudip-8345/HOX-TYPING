import { Card } from '@/components/ui/card'
import { Microphone } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface TimerDisplayProps {
  timeElapsed: number
  isActive: boolean
}

export function TimerDisplay({ timeElapsed, isActive }: TimerDisplayProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground">
          <Microphone size={24} weight="fill" className="text-background" />
        </div>
        <div className={cn(
          'text-6xl font-bold tabular-nums tracking-tight',
          isActive && 'text-foreground',
          !isActive && 'text-muted-foreground'
        )}>
          {formatTime(timeElapsed)}
        </div>
      </div>
    </Card>
  )
}
