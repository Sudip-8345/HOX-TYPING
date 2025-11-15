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
  const getLayout = (layoutType: string) => {
    switch (layoutType) {
      case 'mangal-kruti':
        return mangalKrutiLayout
      case 'inscript':
        return inscriptLayout
      default:
        return remingtonLayout
    }
  }

  const isKeyPressed = (key: string) => {
    return pressedKey?.toLowerCase() === key.toLowerCase()
  }

  const renderKeyboardLayout = (layoutType: string) => {
    const layout = getLayout(layoutType)

    return (
      <div className="space-y-2">
        <div className="flex gap-1 justify-center">
          {layout.row1.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-2 py-2 rounded border border-border bg-card min-w-[48px] h-[56px] transition-all',
                isKeyPressed(key.eng) && 'bg-accent text-accent-foreground scale-105 shadow-lg',
                'hover:bg-muted'
              )}
            >
              <span className="text-xs text-muted-foreground font-mono">{key.eng}</span>
              <span className="text-lg font-hindi font-semibold">{key.hindi}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-1 justify-center pl-8">
          {layout.row2.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-2 py-2 rounded border border-border bg-card min-w-[48px] h-[56px] transition-all',
                isKeyPressed(key.eng) && 'bg-accent text-accent-foreground scale-105 shadow-lg',
                'hover:bg-muted'
              )}
            >
              <span className="text-xs text-muted-foreground font-mono">{key.eng}</span>
              <span className="text-lg font-hindi font-semibold">{key.hindi}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-1 justify-center pl-12">
          {layout.row3.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-2 py-2 rounded border border-border bg-card min-w-[48px] h-[56px] transition-all',
                isKeyPressed(key.eng) && 'bg-accent text-accent-foreground scale-105 shadow-lg',
                'hover:bg-muted'
              )}
            >
              <span className="text-xs text-muted-foreground font-mono">{key.eng}</span>
              <span className="text-lg font-hindi font-semibold">{key.hindi}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-1 justify-center pl-16">
          {layout.row4.map((key, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center px-2 py-2 rounded border border-border bg-card min-w-[48px] h-[56px] transition-all',
                isKeyPressed(key.eng) && 'bg-accent text-accent-foreground scale-105 shadow-lg',
                'hover:bg-muted'
              )}
            >
              <span className="text-xs text-muted-foreground font-mono">{key.eng}</span>
              <span className="text-lg font-hindi font-semibold">{key.hindi}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-1 justify-center pt-2">
          <div className="flex items-center justify-center px-8 py-2 rounded border border-border bg-card h-[56px] flex-1 max-w-[400px]">
            <span className="text-sm text-muted-foreground">Space</span>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'direct') {
    return (
      <Card className={cn('p-4', className)}>
        <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">Direct Hindi input mode</p>
          <p className="text-xs mt-2">Type directly in Hindi using your system keyboard</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Virtual Keyboard</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === 'phonetic' && 'Phonetic (Remington) - Type in English, get Hindi'}
            {mode === 'mangal-kruti' && 'Mangal Kruti - Standard Hindi keyboard layout'}
          </p>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {mode === 'phonetic' ? 'Remington' : mode === 'mangal-kruti' ? 'Kruti Dev' : 'Direct'}
        </Badge>
      </div>

      <Tabs defaultValue="remington" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="remington">Remington</TabsTrigger>
          <TabsTrigger value="mangal-kruti">Mangal Kruti</TabsTrigger>
          <TabsTrigger value="inscript">Inscript</TabsTrigger>
        </TabsList>
        
        <TabsContent value="remington" className="mt-0">
          {renderKeyboardLayout('remington')}
        </TabsContent>
        
        <TabsContent value="mangal-kruti" className="mt-0">
          {renderKeyboardLayout('mangal-kruti')}
        </TabsContent>
        
        <TabsContent value="inscript" className="mt-0">
          {renderKeyboardLayout('inscript')}
        </TabsContent>
      </Tabs>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-card border border-border"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent"></div>
            <span>Pressed</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
