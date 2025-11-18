import { cn } from '@/lib/utils'
import { TransliterationMode } from '@/lib/transliteration'
import { HindiLayoutName, hindiKeyboardLayouts, HindiKeyDefinition } from '@/lib/hindiLayouts'

interface HindiKeyboardProps {
  mode: TransliterationMode
  pressedKey?: string
  className?: string
}

export function HindiKeyboard({ mode, pressedKey, className }: HindiKeyboardProps) {
  if (mode !== 'remington' && mode !== 'inscript') {
    return (
      <div className={cn('rounded-md border border-border/40 p-4 text-sm text-muted-foreground', className)}>
        ऑन-स्क्रीन कीबोर्ड केवल Remington और Inscript लेआउट के लिए उपलब्ध है। अन्य मोड में टाइपिंग सुझाव सक्रिय रहते हैं।
      </div>
    )
  }

  const layoutName: HindiLayoutName = mode
  const layout = hindiKeyboardLayouts[layoutName]

  const isKeyPressed = (key: HindiKeyDefinition) => {
    if (!pressedKey) return false
    if (key.key.toLowerCase() === pressedKey.toLowerCase()) return true
    if (key.shiftKey && key.shiftKey.toLowerCase() === pressedKey.toLowerCase()) return true
    return false
  }

  return (
    <div className={cn('', className)}>
      <div className="space-y-1">
        {layout.rows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex gap-[3px] justify-center">
            {row.map((keyDef, idx) => (
              <div
                key={`${rowIdx}-${idx}-${keyDef.key}`}
                className={cn(
                  'flex flex-col items-center justify-center px-1.5 py-1 rounded-sm bg-[#3a3a3a] min-w-[32px] h-[36px] transition-all text-xs',
                  isKeyPressed(keyDef) && 'bg-success scale-105'
                )}
              >
                <span className="text-[10px] text-muted-foreground font-mono">
                  {keyDef.shiftOutput ?? keyDef.shiftKey ?? keyDef.key.toUpperCase()}
                </span>
                <span className="text-sm font-hindi">{keyDef.output || ' '}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
