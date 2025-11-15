import { useEffect, useRef, memo } from 'react'
import { cn } from '@/lib/utils'

interface TypingDisplayProps {
  promptText: string
  userInput: string
  currentIndex: number
  isComplete: boolean
  fontClass: string
}

export const TypingDisplay = memo(({ 
  promptText, 
  userInput, 
  currentIndex, 
  isComplete,
  fontClass 
}: TypingDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentCharRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      const container = containerRef.current
      const currentChar = currentCharRef.current
      const containerRect = container.getBoundingClientRect()
      const charRect = currentChar.getBoundingClientRect()
      
      if (charRect.bottom > containerRect.bottom - 60 || charRect.top < containerRect.top + 60) {
        currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentIndex])

  return (
    <div 
      ref={containerRef}
      className={cn(
        "text-xl md:text-2xl leading-relaxed tracking-wide p-6 md:p-8",
        "bg-card rounded-xl border-2 border-border",
        "min-h-[200px] max-h-[400px] overflow-y-auto",
        "shadow-sm",
        fontClass
      )}
    >
      {promptText.split('').map((char, index) => {
        const isCurrent = index === currentIndex && !isComplete
        const isPast = index < userInput.length
        const isCorrect = isPast && userInput[index] === char
        const isIncorrect = isPast && userInput[index] !== char
        
        return (
          <span
            key={index}
            ref={isCurrent ? currentCharRef : null}
            className={cn(
              'relative transition-all duration-100',
              isCurrent && 'bg-accent/30 border-b-4 border-accent animate-pulse',
              isCorrect && 'text-success bg-success/10 rounded-sm px-0.5',
              isIncorrect && 'text-error bg-error/20 rounded-sm px-0.5 line-through',
              !isPast && !isCurrent && 'text-muted-foreground/70',
              char === ' ' && 'inline-block min-w-[0.6ch]',
              char === '\n' && 'block'
            )}
          >
            {char === ' ' ? '\u00A0' : char === '\n' ? '' : char}
          </span>
        )
      })}
    </div>
  )
})

TypingDisplay.displayName = 'TypingDisplay'
