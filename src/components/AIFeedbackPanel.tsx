import { memo } from 'react'
import { Card } from '@/components/ui/card'
import { Brain, Lightbulb } from '@phosphor-icons/react'

interface AIFeedbackPanelProps {
  tips: string[]
  wpm: number
  accuracy: number
}

export const AIFeedbackPanel = memo(({ tips, wpm, accuracy }: AIFeedbackPanelProps) => {
  return (
    <Card className="p-4 bg-card/80 backdrop-blur">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={20} weight="duotone" className="text-primary" />
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Tips AI
        </h4>
      </div>
      <div className="space-y-2 text-xs text-foreground/90">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2">
            <Lightbulb size={12} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
            <p>{tip}</p>
          </div>
        ))}
      </div>
    </Card>
  )
})

AIFeedbackPanel.displayName = 'AIFeedbackPanel'
