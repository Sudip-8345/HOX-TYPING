import { Card } from '@/components/ui/card'
import { Brain } from '@phosphor-icons/react'

interface AIFeedbackPanelProps {
  feedback: string[]
}

export function AIFeedbackPanel({ feedback }: AIFeedbackPanelProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={24} weight="fill" className="text-accent" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          AI Feedback
        </h3>
      </div>
      <div className="space-y-2">
        {feedback.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Start practicing to get AI feedback
          </p>
        ) : (
          feedback.map((tip, idx) => (
            <p key={idx} className="text-sm text-foreground leading-relaxed">
              {tip}
            </p>
          ))
        )}
      </div>
    </Card>
  )
}
