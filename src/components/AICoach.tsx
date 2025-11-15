import { memo } from 'react'
import { Brain, Lightbulb, Fire, TrendUp } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface AICoachProps {
  tip: string
  weakKeys: string[]
  accuracy: number
  wpm: number
}

export const AICoach = memo(({ tip, weakKeys, accuracy, wpm }: AICoachProps) => {
  const getPerformanceLevel = () => {
    if (wpm >= 50 && accuracy >= 95) return { label: 'Expert', color: 'text-success', icon: <Fire size={20} weight="fill" /> }
    if (wpm >= 40 && accuracy >= 90) return { label: 'Advanced', color: 'text-warning', icon: <TrendUp size={20} weight="bold" /> }
    if (wpm >= 25 && accuracy >= 85) return { label: 'Intermediate', color: 'text-primary', icon: <TrendUp size={20} weight="bold" /> }
    return { label: 'Beginner', color: 'text-muted-foreground', icon: <TrendUp size={20} weight="bold" /> }
  }

  const performance = getPerformanceLevel()

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={24} weight="duotone" className="text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          AI Smart Coach
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="gap-1">
              {performance.icon}
              <span className={performance.color}>{performance.label}</span>
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Current Level
          </p>
        </div>

        {tip && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <Lightbulb size={20} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  AI Insight
                </h4>
                <p className="text-sm text-foreground leading-relaxed">{tip}</p>
              </div>
            </div>
          </>
        )}

        {weakKeys.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Weak Keys
              </h4>
              <div className="flex flex-wrap gap-2">
                {weakKeys.map((key, index) => (
                  <Badge key={index} variant="destructive" className="text-lg font-mono px-3 py-1">
                    {key}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Focus on these characters in your next practice
              </p>
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-2 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span>Maintain 95%+ accuracy for best results</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning"></span>
            <span>Practice daily for 15-20 minutes</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>Use all fingers, avoid looking at keyboard</span>
          </p>
        </div>
      </div>
    </Card>
  )
})

AICoach.displayName = 'AICoach'
