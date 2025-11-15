import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { vowels, consonants, briefs, ntoonsSymbols, briefsRight } from '@/lib/stenoUtils'

export function StenoKeyboard() {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-success/20 hover:bg-success/30 text-foreground'
      case 'gray':
        return 'bg-muted hover:bg-muted/70 text-foreground'
      case 'red':
        return 'bg-destructive/20 hover:bg-destructive/30 text-foreground'
      case 'yellow':
        return 'bg-warning/20 hover:bg-warning/30 text-foreground'
      case 'beige':
        return 'bg-amber-100 hover:bg-amber-200 text-foreground'
      default:
        return 'bg-card hover:bg-muted'
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-10 bg-card"
        />
      </div>

      <Card className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3">Vowels</h3>
          <div className="grid grid-cols-4 gap-2">
            {vowels.map((v, idx) => (
              <Button
                key={idx}
                variant="secondary"
                className={cn(
                  'h-12 text-base font-medium',
                  getColorClass('green')
                )}
              >
                {v.symbol}
                {v.position && (
                  <span className="absolute bottom-0.5 right-1 text-[10px] opacity-60">
                    {v.position}
                  </span>
                )}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {vowels.filter(v => v.diacritic).map((v, idx) => (
              <Button
                key={idx}
                variant="secondary"
                className="h-8 text-sm"
              >
                {v.symbol}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Consonants</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {consonants.map((c, idx) => (
              <Button
                key={idx}
                variant="secondary"
                className={cn(
                  'h-11 text-base font-medium',
                  getColorClass(c.color)
                )}
              >
                {c.symbol}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3">Briefs</h3>
          <div className="grid grid-cols-6 gap-2">
            {briefs.map((b, idx) => (
              <Button
                key={idx}
                variant="secondary"
                className={cn(
                  'h-12 text-base font-medium',
                  getColorClass(b.color)
                )}
              >
                {b.symbol}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Ntoons</h3>
          <div className="grid grid-cols-6 gap-2">
            {ntoonsSymbols.map((n, idx) => (
              <Button
                key={idx}
                variant="secondary"
                className={cn(
                  'h-12 text-base font-medium',
                  getColorClass(n.color)
                )}
              >
                {n.symbol}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Briefs</h3>
          <div className="grid grid-cols-4 gap-2">
            {briefsRight.map((br, idx) => (
              <Button
                key={idx}
                variant="secondary"
                className={cn(
                  'h-12 text-base font-medium',
                  getColorClass(br.color)
                )}
              >
                {br.symbol}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
