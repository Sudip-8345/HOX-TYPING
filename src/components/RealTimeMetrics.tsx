import { Card } from '@/components/ui/card'

interface RealTimeMetricsProps {
  wpm: number
  accuracy: number
  errors: number
}

export function RealTimeMetrics({ wpm, accuracy, errors }: RealTimeMetricsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Real-Time Meterics
      </h3>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">WPM:</span>
          <span className="text-3xl font-bold tabular-nums">{wpm}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Accuracy:</span>
          <span className="text-3xl font-bold tabular-nums">{accuracy}%</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Errors:</span>
          <span className="text-3xl font-bold tabular-nums">{errors}</span>
        </div>
      </div>
    </Card>
  )
}
