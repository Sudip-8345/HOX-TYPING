import { useEffect, useRef, memo } from 'react'
import { cn } from '@/lib/utils'

interface TypingDisplayProps {
  promptText: string
  userInput: string
  currentIndex: number
  isComplete: boolean
}

export const TypingDisplay = memo(({ promptText, userInput, currentIndex, isComplete }: TypingDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentCharRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      const container = containerRef.current
      const currentChar = currentCharRef.current
      const containerRect = container.getBoundingClientRect()
      const charRect = currentChar.getBoundingClientRect()
      
      if (charRect.bottom > containerRect.bottom - 40 || charRect.top < containerRect.top + 40) {
        currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentIndex])

  return (
    <div 
      ref={containerRef}
      className="font-mono text-xl leading-relaxed tracking-wide p-8 bg-card rounded-lg border border-border min-h-[200px] max-h-[400px] overflow-y-auto"
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
              'relative transition-colors duration-100',
              isCurrent && 'bg-accent/20 border-b-2 border-accent',
              isCorrect && 'text-success',
              isIncorrect && 'text-error bg-error/10 rounded-sm px-0.5',
              !isPast && !isCurrent && 'text-muted-foreground',
              char === ' ' && 'inline-block min-w-[0.5ch]'
            )}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </div>
  )
})

TypingDisplay.displayName = 'TypingDisplay'
