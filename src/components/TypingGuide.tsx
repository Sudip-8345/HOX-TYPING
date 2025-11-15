import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, Keyboard } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function TypingGuide() {
  const phoneticExamples = [
    { eng: 'namaste', hindi: 'नमस्ते', meaning: 'Hello' },
    { eng: 'bharat', hindi: 'भारत', meaning: 'India' },
    { eng: 'dhanyavaad', hindi: 'धन्यवाद', meaning: 'Thank you' },
    { eng: 'vidyalaya', hindi: 'विद्यालय', meaning: 'School' },
    { eng: 'gyan', hindi: 'ज्ञान', meaning: 'Knowledge' },
    { eng: 'kshatra', hindi: 'क्षत्र', meaning: 'Warrior' },
    { eng: 'shiksha', hindi: 'शिक्षा', meaning: 'Education' },
  ]

  const mangalKrutiExamples = [
    { keys: 'Kk', result: 'कक', desc: 'Ka consonant' },
    { keys: 'lks', result: 'तेल', desc: 'Oil' },
    { keys: 'ikuh', result: 'किप', desc: 'Example word' },
    { keys: 'ckal', result: 'मकत', desc: 'Example word' },
  ]

  const consonants = [
    { roman: 'ka', hindi: 'क' },
    { roman: 'kha', hindi: 'ख' },
    { roman: 'ga', hindi: 'ग' },
    { roman: 'gha', hindi: 'घ' },
    { roman: 'cha', hindi: 'च' },
    { roman: 'chha', hindi: 'छ' },
    { roman: 'ja', hindi: 'ज' },
    { roman: 'jha', hindi: 'झ' },
    { roman: 'ta', hindi: 'त' },
    { roman: 'tha', hindi: 'थ' },
    { roman: 'da', hindi: 'द' },
    { roman: 'dha', hindi: 'ध' },
    { roman: 'na', hindi: 'न' },
    { roman: 'pa', hindi: 'प' },
    { roman: 'pha', hindi: 'फ' },
    { roman: 'ba', hindi: 'ब' },
    { roman: 'bha', hindi: 'भ' },
    { roman: 'ma', hindi: 'म' },
    { roman: 'ya', hindi: 'य' },
    { roman: 'ra', hindi: 'र' },
    { roman: 'la', hindi: 'ल' },
    { roman: 'va', hindi: 'व' },
    { roman: 'sha', hindi: 'श' },
    { roman: 'sa', hindi: 'स' },
    { roman: 'ha', hindi: 'ह' },
  ]

  const vowels = [
    { roman: 'a', hindi: 'अ' },
    { roman: 'aa', hindi: 'आ' },
    { roman: 'i', hindi: 'इ' },
    { roman: 'ee', hindi: 'ई' },
    { roman: 'u', hindi: 'उ' },
    { roman: 'oo', hindi: 'ऊ' },
    { roman: 'e', hindi: 'ए' },
    { roman: 'ai', hindi: 'ऐ' },
    { roman: 'o', hindi: 'ओ' },
    { roman: 'au', hindi: 'औ' },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info size={18} weight="duotone" />
          <span className="hidden sm:inline">Typing Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard size={24} weight="duotone" />
            Hindi Typing Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to type in Hindi using English keyboard with different input methods
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="phonetic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="phonetic">Phonetic (Google)</TabsTrigger>
            <TabsTrigger value="mangal">Mangal Kruti</TabsTrigger>
            <TabsTrigger value="reference">Quick Reference</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="phonetic" className="space-y-4 pr-4">
              <Card className="p-4 bg-accent/10">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span>🎯</span> How Phonetic Typing Works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Type English letters that sound like Hindi words, and they automatically convert to Hindi script.
                  This is the easiest method for beginners who know how Hindi words sound.
                </p>
              </Card>

              <div>
                <h4 className="font-semibold mb-3">Try These Examples:</h4>
                <div className="grid gap-2">
                  {phoneticExamples.map((ex, idx) => (
                    <Card key={idx} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono">
                            {ex.eng}
                          </Badge>
                          <span className="text-xl font-hindi">{ex.hindi}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{ex.meaning}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-primary/5">
                <h4 className="font-semibold mb-2">💡 Tips for Phonetic Typing</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use "aa" for आ sound (like in "father")</li>
                  <li>• Use "ee" for ई sound (like in "feet")</li>
                  <li>• Use "oo" for ऊ sound (like in "food")</li>
                  <li>• For conjuncts like क्ष, type "ksha"</li>
                  <li>• For त्र, type "tra"</li>
                  <li>• For ज्ञ, type "gya"</li>
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="mangal" className="space-y-4 pr-4">
              <Card className="p-4 bg-accent/10">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span>⌨️</span> Mangal Kruti Keyboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is a traditional keyboard layout used in government offices and typing tests.
                  Each English key maps to a specific Hindi character. Commonly used in SSC and other exams.
                </p>
              </Card>

              <div>
                <h4 className="font-semibold mb-3">Key Mappings:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <div className="text-xs text-muted-foreground uppercase mb-2">Vowels (Matras)</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="font-mono">e → </span>
                        <span className="font-hindi text-lg">ा</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">r → </span>
                        <span className="font-hindi text-lg">ी</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">f → </span>
                        <span className="font-hindi text-lg">ि</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">g → </span>
                        <span className="font-hindi text-lg">ु</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">s → </span>
                        <span className="font-hindi text-lg">े</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">a → </span>
                        <span className="font-hindi text-lg">ो</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="text-xs text-muted-foreground uppercase mb-2">Common Consonants</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="font-mono">k → </span>
                        <span className="font-hindi text-lg">क</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">l → </span>
                        <span className="font-hindi text-lg">त</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">h → </span>
                        <span className="font-hindi text-lg">प</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">j → </span>
                        <span className="font-hindi text-lg">र</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">c → </span>
                        <span className="font-hindi text-lg">म</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">v → </span>
                        <span className="font-hindi text-lg">न</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Example Words:</h4>
                <div className="grid gap-2">
                  {mangalKrutiExamples.map((ex, idx) => (
                    <Card key={idx} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono">
                            Type: {ex.keys}
                          </Badge>
                          <span className="text-xl font-hindi">{ex.result}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{ex.desc}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reference" className="space-y-4 pr-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Vowels (स्वर)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {vowels.map((v, idx) => (
                    <div key={idx} className="flex flex-col items-center p-2 border rounded">
                      <span className="text-2xl font-hindi mb-1">{v.hindi}</span>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {v.roman}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3">Consonants (व्यंजन)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {consonants.map((c, idx) => (
                    <div key={idx} className="flex flex-col items-center p-2 border rounded">
                      <span className="text-2xl font-hindi mb-1">{c.hindi}</span>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {c.roman}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-warning/10">
                <h4 className="font-semibold mb-2">🔥 Pro Tips</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Practice one layout at a time to build muscle memory</li>
                  <li>• Start with phonetic if you're a beginner</li>
                  <li>• Use the virtual keyboard below to see key mappings</li>
                  <li>• For government exams, learn Mangal Kruti layout</li>
                  <li>• Watch the keyboard highlight as you type to learn faster</li>
                </ul>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
