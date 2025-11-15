import { memo, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { SessionData } from '@/lib/typingUtils'

interface RealTimeMetricsProps {
  grossWpm: number
  netWpm: number
  accuracy: number
  errors: number
  correctChars: number
  incorrectChars: Map<number, string>
  sessions: SessionData[]
  weakKeys: string[]
}

export const RealTimeMetrics = memo(({ 
  grossWpm, 
  netWpm, 
  accuracy, 
  errors, 
  correctChars, 
  incorrectChars, 
  sessions,
  weakKeys 
}: RealTimeMetricsProps) => {
  const wpmChartData = useMemo(() => {
    return sessions.slice(-10).map((session, index) => ({
      x: index * 50 + 10,
      wpm: session.grossWpm || session.wpm || 0
    }))
  }, [sessions])

  const accuracyData = useMemo(() => [
    { name: 'Accuracy', value: accuracy, color: '#4ade80' },
    { name: 'bh1', value: Math.max(0, 33 - accuracy / 3), color: '#fbbf24' },
    { name: 'Round10', value: Math.max(0, 33 - accuracy / 3), color: '#22c55e' }
  ], [accuracy])

  const sessionIncorrectData = useMemo(() => {
    const total = correctChars + errors
    const correct = correctChars
    const incorrect = errors
    const retries = Math.floor(errors * 0.3)
    
    return [
      { name: 'Correct', value: correct, color: '#4ade80' },
      { name: 'Incor', value: incorrect, color: '#ef4444' },
      { name: 'Retr', value: retries, color: '#fbbf24' }
    ]
  }, [correctChars, errors])

  const heatmapGrid = useMemo(() => {
    const rows = 4
    const cols = 14
    const grid: string[][] = []
    
    for (let i = 0; i < rows; i++) {
      const row: string[] = []
      for (let j = 0; j < cols; j++) {
        const intensity = Math.random()
        let color = '#374151'
        if (intensity > 0.7) color = '#ef4444'
        else if (intensity > 0.5) color = '#fb923c'
        else if (intensity > 0.3) color = '#fbbf24'
        else if (intensity > 0.15) color = '#a3e635'
        
        row.push(color)
      }
      grid.push(row)
    }
    return grid
  }, [weakKeys])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card/80 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Mordss WPM
            </h4>
            <span className="text-sm font-medium">{Math.round(grossWpm * 0.1)}%</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={wpmChartData}>
              <XAxis dataKey="x" hide />
              <YAxis hide domain={[0, 20000]} />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                stroke="#4ade80" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 bg-card/80 backdrop-blur">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Words Per WPM
          </h4>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={wpmChartData}>
              <XAxis dataKey="x" hide />
              <YAxis hide domain={[0, 100]} />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                stroke="#4ade80" 
                strokeWidth={2}
                dot={{ fill: '#4ade80', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card/80 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Accuracy %
            </h4>
            <span className="text-lg font-bold">{accuracy}%</span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={accuracyData}>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {accuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Accuracy</span>
            <span>bh1</span>
            <span>Round10</span>
          </div>
        </Card>

        <Card className="p-4 bg-card/80 backdrop-blur">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Weatmaps
          </h4>
          <div className="grid grid-cols-14 gap-[2px]">
            {heatmapGrid.map((row, i) => 
              row.map((color, j) => (
                <div 
                  key={`${i}-${j}`} 
                  className="w-2 h-2 rounded-[1px]"
                  style={{ backgroundColor: color }}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card/80 backdrop-blur">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Session Inetct
          </h4>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={100}>
              <PieChart>
                <Pie
                  data={sessionIncorrectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sessionIncorrectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#4ade80]"></div>
                <span className="text-muted-foreground">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#fbbf24]"></div>
                <span className="text-muted-foreground">Keyt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#ef4444]"></div>
                <span className="text-muted-foreground">Incor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#fbbf24]"></div>
                <span className="text-muted-foreground">Retr</span>
              </div>
              <div className="mt-2 pt-2 border-t border-border">
                <span className="font-semibold">Total</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/80 backdrop-blur">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Tips AI
          </h4>
          <div className="space-y-2 text-xs text-foreground/90">
            <div className="flex items-start gap-2">
              <span className="text-foreground/70">•</span>
              <p>Focus on "^" key for better accuracy</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-foreground/70">•</span>
              <p>Try to maintain rhythm or faster typing</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-foreground/70">•</span>
              <p>Try to mchduthm or faster typing</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-foreground/70">•</span>
              <p>Dios eesech tiorig fri feertlee</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
})

RealTimeMetrics.displayName = 'RealTimeMetrics'
