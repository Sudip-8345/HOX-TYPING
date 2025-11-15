import { memo, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { SessionData } from '@/lib/typingUtils'

interface ProgressChartProps {
  sessions: SessionData[]
}

export const ProgressChart = memo(({ sessions }: ProgressChartProps) => {
  const chartData = useMemo(() => {
    return sessions
      .slice(-10)
      .map((session, index) => ({
        session: index + 1,
        wpm: session.wpm,
        accuracy: session.accuracy,
      }))
  }, [sessions])

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Progress Chart
        </h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Complete a session to see your progress
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Progress Chart (Last 10 Sessions)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0 0)" />
          <XAxis 
            dataKey="session" 
            stroke="oklch(0.50 0 0)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="oklch(0.50 0 0)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'oklch(0.96 0 0)',
              border: '1px solid oklch(0.88 0 0)',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="wpm" 
            stroke="oklch(0.45 0.15 250)" 
            strokeWidth={3}
            dot={{ fill: 'oklch(0.45 0.15 250)', r: 4 }}
            name="WPM"
          />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="oklch(0.55 0.20 280)" 
            strokeWidth={3}
            dot={{ fill: 'oklch(0.55 0.20 280)', r: 4 }}
            name="Accuracy %"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
})

ProgressChart.displayName = 'ProgressChart'
