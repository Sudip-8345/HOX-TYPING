import { memo } from 'react'
import { 
  Keyboard, 
  Translate, 
  TextAa, 
  Clock, 
  Certificate, 
  SpeakerHigh, 
  SpeakerSlash,
  User
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { languageFonts, examModes, durations } from '@/lib/typingUtils'

interface HeaderProps {
  language: string
  font: string
  duration: number
  examMode: string
  soundEnabled: boolean
  onLanguageChange: (lang: string) => void
  onFontChange: (font: string) => void
  onDurationChange: (duration: number) => void
  onExamModeChange: (mode: string) => void
  onSoundToggle: () => void
}

export const Header = memo(({
  language,
  font,
  duration,
  examMode,
  soundEnabled,
  onLanguageChange,
  onFontChange,
  onDurationChange,
  onExamModeChange,
  onSoundToggle,
}: HeaderProps) => {
  const currentLangConfig = languageFonts.find(lf => lf.language === language)
  const currentExamMode = examModes.find(em => em.id === examMode)

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Keyboard size={32} weight="duotone" className="text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                TypistPro India
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">टाइपिस्ट प्रो</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[120px] md:w-[140px] h-9">
                <Translate size={16} weight="bold" className="mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageFonts.map(lf => (
                  <SelectItem key={lf.language} value={lf.language}>
                    {lf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={font} onValueChange={onFontChange}>
              <SelectTrigger className="w-[130px] md:w-[160px] h-9">
                <TextAa size={16} weight="bold" className="mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentLangConfig?.fonts.map(f => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={duration.toString()} onValueChange={(v) => onDurationChange(Number(v))}>
              <SelectTrigger className="w-[100px] md:w-[120px] h-9">
                <Clock size={16} weight="bold" className="mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map(d => (
                  <SelectItem key={d.value} value={d.value.toString()}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={examMode} onValueChange={onExamModeChange}>
              <SelectTrigger className="w-[120px] md:w-[160px] h-9">
                <Certificate size={16} weight="bold" className="mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {examModes.map(em => (
                  <SelectItem key={em.id} value={em.id}>
                    {em.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={onSoundToggle}
              className="h-9 w-9"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? (
                <SpeakerHigh size={20} weight="bold" />
              ) : (
                <SpeakerSlash size={20} weight="bold" />
              )}
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User size={20} weight="bold" />
            </Button>
          </div>
        </div>

        {currentExamMode && currentExamMode.id !== 'practice' && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary" className="gap-1">
              <Certificate size={14} weight="fill" />
              Exam Mode: {currentExamMode.name}
            </Badge>
            {!currentExamMode.allowBackspace && (
              <Badge variant="destructive" className="text-xs">
                Backspace Disabled
              </Badge>
            )}
            {currentExamMode.errorPenalty > 0 && (
              <Badge variant="outline" className="text-xs">
                {currentExamMode.errorPenalty}% Error Penalty
              </Badge>
            )}
          </div>
        )}
      </div>
    </header>
  )
})

Header.displayName = 'Header'
