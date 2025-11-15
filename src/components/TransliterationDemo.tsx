import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { transliterate, TransliterationMode } from '@/lib/transliteration'
import { Keyboard, ArrowRight } from '@phosphor-icons/react'

export function TransliterationDemo() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<TransliterationMode>('phonetic')
  const [output, setOutput] = useState('')

  const examples = {
    phonetic: [
      { input: 'namaste', output: 'नमस्ते' },
      { input: 'bharat', output: 'भारत' },
      { input: 'shiksha', output: 'शिक्षा' },
    ],
    'mangal-kruti': [
      { input: 'Kk', output: 'कक' },
      { input: 'veLa', output: 'नेता' },
      { input: 'iklk', output: 'किकक' },
    ],
  }

  useEffect(() => {
    if (input) {
      const result = transliterate(input, mode)
      setOutput(result)
    } else {
      setOutput('')
    }
  }, [input, mode])

  const handleExampleClick = (exampleInput: string) => {
    setInput(exampleInput)
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center gap-2 mb-4">
        <Keyboard size={24} weight="duotone" className="text-primary" />
        <h3 className="text-xl font-semibold">Try Live Transliteration</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Type in English and see it convert to Hindi in real-time
      </p>

      <Tabs value={mode} onValueChange={(v) => setMode(v as TransliterationMode)} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phonetic">Phonetic (Google)</TabsTrigger>
          <TabsTrigger value="mangal-kruti">Mangal Kruti</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
            Type in English:
          </label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'phonetic' ? 'Try: namaste, bharat, shiksha...' : 'Try: Kk, lks, ckal...'}
            className="font-mono text-lg"
          />
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight size={24} weight="bold" className="text-muted-foreground" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
            Hindi Output:
          </label>
          <div className="min-h-[48px] p-3 rounded-lg border-2 border-accent/30 bg-accent/5 text-2xl font-hindi flex items-center">
            {output || <span className="text-muted-foreground text-base">Type something to see the magic...</span>}
          </div>
        </div>

        {mode !== 'direct' && (
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
              Quick Examples:
            </label>
            <div className="flex flex-wrap gap-2">
              {examples[mode]?.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(ex.input)}
                  className="group"
                >
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors px-3 py-2"
                  >
                    <span className="font-mono text-xs">{ex.input}</span>
                    <span className="mx-2">→</span>
                    <span className="font-hindi text-sm">{ex.output}</span>
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
