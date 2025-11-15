import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TransliterationMode } from '@/lib/transliteration'

interface HindiKeyboardProps {
  mode: TransliterationMode
  pressedKey?: string
  className?: string
}

const remingtonLayout = {
  row1: [
    { eng: '1', hindi: '१', shift: '!' },
    { eng: '2', hindi: '२', shift: '@' },
    { eng: '3', hindi: '३', shift: '#' },
    { eng: '4', hindi: '४', shift: '$' },
    { eng: '5', hindi: '५', shift: '%' },
    { eng: '6', hindi: '६', shift: '^' },
    { eng: '7', hindi: '७', shift: '&' },
    { eng: '8', hindi: '८', shift: '*' },
    { eng: '9', hindi: '९', shift: '(' },
    { eng: '0', hindi: '०', shift: ')' },
    { eng: '-', hindi: '-', shift: '_' },
    { eng: '=', hindi: 'ृ', shift: '+' },
  ],
  row2: [
    { eng: 'q', hindi: 'ौ', shift: 'औ' },
    { eng: 'w', hindi: 'ै', shift: 'ऐ' },
    { eng: 'e', hindi: 'ा', shift: 'आ' },
    { eng: 'r', hindi: 'ी', shift: 'ई' },
    { eng: 't', hindi: 'ू', shift: 'ऊ' },
    { eng: 'y', hindi: 'ब', shift: 'भ' },
    { eng: 'u', hindi: 'ह', shift: 'ङ' },
    { eng: 'i', hindi: 'ग', shift: 'घ' },
    { eng: 'o', hindi: 'द', shift: 'ध' },
    { eng: 'p', hindi: 'ज', shift: 'झ' },
    { eng: '[', hindi: 'ड', shift: 'ढ' },
    { eng: ']', hindi: 'ञ', shift: 'ण' },
  ],
  row3: [
    { eng: 'a', hindi: 'ो', shift: 'ओ' },
    { eng: 's', hindi: 'े', shift: 'ए' },
    { eng: 'd', hindi: '्', shift: 'अ' },
    { eng: 'f', hindi: 'ि', shift: 'इ' },
    { eng: 'g', hindi: 'ु', shift: 'उ' },
    { eng: 'h', hindi: 'प', shift: 'फ' },
    { eng: 'j', hindi: 'र', shift: 'ऋ' },
    { eng: 'k', hindi: 'क', shift: 'ख' },
    { eng: 'l', hindi: 'त', shift: 'थ' },
    { eng: ';', hindi: 'च', shift: 'छ' },
    { eng: "'", hindi: 'ट', shift: 'ठ' },
  ],
  row4: [
    { eng: 'z', hindi: 'ॉ', shift: 'ऑ' },
    { eng: 'x', hindi: 'ं', shift: 'ँ' },
    { eng: 'c', hindi: 'म', shift: 'ण' },
    { eng: 'v', hindi: 'न', shift: '' },
    { eng: 'b', hindi: 'व', shift: '' },
    { eng: 'n', hindi: 'ल', shift: '' },
    { eng: 'm', hindi: 'स', shift: 'श' },
    { eng: ',', hindi: ',', shift: 'ष' },
    { eng: '.', hindi: '।', shift: '॥' },
    { eng: '/', hindi: 'य', shift: '' },
  ],
}

const mangalKrutiLayout = {
  row1: [
    { eng: '1', hindi: '१' },
    { eng: '2', hindi: '२' },
    { eng: '3', hindi: '३' },
    { eng: '4', hindi: '४' },
    { eng: '5', hindi: '५' },
    { eng: '6', hindi: '६' },
    { eng: '7', hindi: '७' },
    { eng: '8', hindi: '८' },
    { eng: '9', hindi: '९' },
    { eng: '0', hindi: '०' },
  ],
  row2: [
    { eng: 'Q', hindi: 'ौ' },
    { eng: 'W', hindi: 'ै' },
    { eng: 'E', hindi: 'ा' },
    { eng: 'R', hindi: 'ी' },
    { eng: 'T', hindi: 'ू' },
    { eng: 'Y', hindi: 'ब' },
    { eng: 'U', hindi: 'ह' },
    { eng: 'I', hindi: 'ग' },
    { eng: 'O', hindi: 'द' },
    { eng: 'P', hindi: 'ज' },
    { eng: '{', hindi: 'ड' },
    { eng: '}', hindi: 'ढ' },
  ],
  row3: [
    { eng: 'A', hindi: 'ो' },
    { eng: 'S', hindi: 'े' },
    { eng: 'D', hindi: '्' },
    { eng: 'F', hindi: 'ि' },
    { eng: 'G', hindi: 'ु' },
    { eng: 'H', hindi: 'प' },
    { eng: 'J', hindi: 'र' },
    { eng: 'K', hindi: 'क' },
    { eng: 'L', hindi: 'त' },
    { eng: ':', hindi: 'ट' },
    { eng: '"', hindi: 'ठ' },
  ],
  row4: [
    { eng: 'X', hindi: 'ं' },
    { eng: 'C', hindi: 'म' },
    { eng: 'V', hindi: 'न' },
    { eng: 'B', hindi: 'व' },
    { eng: 'N', hindi: 'ल' },
    { eng: 'M', hindi: 'स' },
    { eng: '<', hindi: ',' },
    { eng: '>', hindi: '.' },
    { eng: '?', hindi: 'य' },
  ],
}

const inscriptLayout = {
  row1: [
    { eng: '1', hindi: '१' },
    { eng: '2', hindi: '२' },
    { eng: '3', hindi: '३' },
    { eng: '4', hindi: '४' },
    { eng: '5', hindi: '५' },
    { eng: '6', hindi: '६' },
    { eng: '7', hindi: '७' },
    { eng: '8', hindi: '८' },
    { eng: '9', hindi: '९' },
    { eng: '0', hindi: '०' },
  ],
  row2: [
    { eng: 'q', hindi: 'ौ' },
    { eng: 'w', hindi: 'ै' },
    { eng: 'e', hindi: 'ा' },
    { eng: 'r', hindi: 'ी' },
    { eng: 't', hindi: 'ू' },
    { eng: 'y', hindi: 'भ' },
    { eng: 'u', hindi: 'ङ' },
    { eng: 'i', hindi: 'घ' },
    { eng: 'o', hindi: 'ध' },
    { eng: 'p', hindi: 'झ' },
    { eng: '[', hindi: 'ढ' },
    { eng: ']', hindi: 'ञ' },
  ],
  row3: [
    { eng: 'a', hindi: 'ो' },
    { eng: 's', hindi: 'े' },
    { eng: 'd', hindi: '्' },
    { eng: 'f', hindi: 'ि' },
    { eng: 'g', hindi: 'ु' },
    { eng: 'h', hindi: 'प' },
    { eng: 'j', hindi: 'र' },
    { eng: 'k', hindi: 'क' },
    { eng: 'l', hindi: 'त' },
    { eng: ';', hindi: 'च' },
    { eng: "'", hindi: 'ट' },
  ],
  row4: [
    { eng: 'z', hindi: '' },
    { eng: 'x', hindi: 'ं' },
    { eng: 'c', hindi: 'म' },
    { eng: 'v', hindi: 'न' },
    { eng: 'b', hindi: 'व' },
    { eng: 'n', hindi: 'ल' },
    { eng: 'm', hindi: 'स' },
    { eng: ',', hindi: ',' },
    { eng: '.', hindi: '।' },
    { eng: '/', hindi: 'य' },
  ],
}

export function HindiKeyboard({ mode, pressedKey, className }: HindiKeyboardProps) {
  const isKeyPressed = (key: string) => {
    return pressedKey?.toLowerCase() === key.toLowerCase()
  }

  return (
    <div className={cn('', className)}>
      <div className="space-y-1">
        <div className="flex gap-[3px] justify-center">
          {remingtonLayout.row1.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-1.5 py-1 rounded-sm bg-[#3a3a3a] min-w-[32px] h-[36px] transition-all text-xs',
                isKeyPressed(key.eng) && 'bg-success scale-105',
              )}
            >
              <span className="text-[10px] text-muted-foreground font-mono">{key.shift || key.eng}</span>
              <span className="text-sm font-hindi">{key.hindi}</span>
            </div>
          ))}
          <div className={cn('flex items-center justify-center px-2 py-1 rounded-sm bg-[#3a3a3a] min-w-[42px] h-[36px]')}>
            <span className="text-[10px] text-muted-foreground">⌫</span>
          </div>
        </div>

        <div className="flex gap-[3px] justify-center">
          <div className={cn('flex items-center justify-center px-2 py-1 rounded-sm bg-[#3a3a3a] min-w-[36px] h-[36px]')}>
            <span className="text-[10px] text-muted-foreground">Q</span>
          </div>
          {remingtonLayout.row2.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-1.5 py-1 rounded-sm bg-[#3a3a3a] min-w-[32px] h-[36px] transition-all',
                isKeyPressed(key.eng) && 'bg-success scale-105'
              )}
            >
              <span className="text-[10px] text-muted-foreground font-mono">{key.eng.toUpperCase()}</span>
              <span className="text-sm font-hindi">{key.hindi}</span>
            </div>
          ))}
          <div className={cn('flex items-center justify-center px-2 py-1 rounded-sm bg-[#3a3a3a] min-w-[36px] h-[36px]')}>
            <span className="text-[10px] text-muted-foreground">[</span>
          </div>
        </div>

        <div className="flex gap-[3px] justify-center">
          <div className={cn('flex items-center justify-center px-2 py-1 rounded-sm bg-[#3a3a3a] min-w-[42px] h-[36px]')}>
            <span className="text-[10px] text-muted-foreground">A</span>
          </div>
          {remingtonLayout.row3.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-1.5 py-1 rounded-sm bg-[#3a3a3a] min-w-[32px] h-[36px] transition-all',
                isKeyPressed(key.eng) && 'bg-success scale-105'
              )}
            >
              <span className="text-[10px] text-muted-foreground font-mono">{key.eng.toUpperCase()}</span>
              <span className="text-sm font-hindi">{key.hindi}</span>
            </div>
          ))}
          <div className={cn('flex items-center justify-center px-2 py-1 rounded-sm bg-[#3a3a3a] min-w-[48px] h-[36px]')}>
            <span className="text-[10px] text-muted-foreground">A1</span>
          </div>
        </div>

        <div className="flex gap-[3px] justify-center">
          <div className={cn('flex items-center justify-center px-3 py-1 rounded-sm bg-[#3a3a3a] min-w-[52px] h-[36px]')}>
            <span className="text-[10px] text-muted-foreground">⇧</span>
          </div>
          {remingtonLayout.row4.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-1.5 py-1 rounded-sm bg-[#3a3a3a] min-w-[32px] h-[36px] transition-all',
                isKeyPressed(key.eng) && 'bg-success scale-105'
              )}
            >
              <span className="text-[10px] text-muted-foreground font-mono">{key.eng.toUpperCase()}</span>
              <span className="text-sm font-hindi">{key.hindi}</span>
            </div>
          ))}
          <div className={cn('flex items-center justify-center px-2 py-1 rounded-sm bg-[#3a3a3a] min-w-[42px] h-[36px]')}>
            <span className="text-[10px] text-muted-foreground">⌫</span>
          </div>
        </div>
      </div>
    </div>
  )
}
