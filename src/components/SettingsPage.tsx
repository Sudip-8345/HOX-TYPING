import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import {
  ArrowLeft,
  Gear,
  Keyboard,
  Eye,
  EyeSlash,
  Timer,
  TextT,
  Hash,
  CursorText,
  HighlighterCircle,
  ArrowsVertical,
  Moon,
  Sun,
  Desktop,
  Palette,
  CursorClick,
  Sparkle,
  TextAa,
  ArrowsOutLineHorizontal
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TypingSettings {
  backspaceEnabled: boolean
  punctuationEnabled: boolean
  numbersEnabled: boolean
  capitalizationEnabled: boolean
  mistakeHighlightEnabled: boolean
  autoScrollEnabled: boolean
  showTimer: boolean
}

interface ThemeSettings {
  themeMode: 'light' | 'dark' | 'system'
  customTheme: 'blue' | 'neon' | 'solarized' | 'high-contrast' | 'default'
  backgroundBlur: boolean
  animations: boolean
  wordHighlightColor: string
  caretStyle: 'block' | 'underline' | 'bar'
  caretSmoothAnimation: boolean
}

interface FontDisplaySettings {
  englishFont: 'inter' | 'roboto' | 'menlo' | 'courier' | 'source-code-pro'
  hindiFont: 'kruti-dev' | 'mangal' | 'noto-sans-devanagari'
  fontSize: number
  lineHeight: number
  wordSpacing: number
  layoutWidth: 'compact' | 'medium' | 'wide'
}

const defaultSettings: TypingSettings = {
  backspaceEnabled: true,
  punctuationEnabled: false,
  numbersEnabled: false,
  capitalizationEnabled: false,
  mistakeHighlightEnabled: true,
  autoScrollEnabled: true,
  showTimer: true
}

const defaultThemeSettings: ThemeSettings = {
  themeMode: 'system',
  customTheme: 'default',
  backgroundBlur: true,
  animations: true,
  wordHighlightColor: '#6366f1',
  caretStyle: 'bar',
  caretSmoothAnimation: true
}

const defaultFontDisplaySettings: FontDisplaySettings = {
  englishFont: 'inter',
  hindiFont: 'noto-sans-devanagari',
  fontSize: 18,
  lineHeight: 1.6,
  wordSpacing: 0.5,
  layoutWidth: 'medium'
}

export function SettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useKV<TypingSettings>('typing-settings', defaultSettings)
  const [themeSettings, setThemeSettings] = useKV<ThemeSettings>('theme-settings', defaultThemeSettings)
  const [fontDisplaySettings, setFontDisplaySettings] = useKV<FontDisplaySettings>('font-display-settings', defaultFontDisplaySettings)

  const updateSetting = (key: keyof TypingSettings, value: boolean) => {
    const newSettings = { ...(settings || defaultSettings), [key]: value }
    setSettings(newSettings)
    toast.success('Setting updated successfully')
  }

  const updateThemeSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    const newThemeSettings = { ...(themeSettings || defaultThemeSettings), [key]: value }
    setThemeSettings(newThemeSettings)
    toast.success('Theme setting updated')
  }

  const updateFontDisplaySetting = <K extends keyof FontDisplaySettings>(key: K, value: FontDisplaySettings[K]) => {
    const newFontDisplaySettings = { ...(fontDisplaySettings || defaultFontDisplaySettings), [key]: value }
    setFontDisplaySettings(newFontDisplaySettings)
    toast.success('Font setting updated')
  }

  const resetAllSettings = () => {
    setSettings(defaultSettings)
    setThemeSettings(defaultThemeSettings)
    setFontDisplaySettings(defaultFontDisplaySettings)
    toast.success('All settings reset to defaults')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} weight="bold" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Gear size={24} weight="bold" className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                  <p className="text-xs text-muted-foreground">Customize your typing experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard size={24} weight="bold" />
                Typing Mode Settings
              </CardTitle>
              <CardDescription>
                Configure typing behavior and visual preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Backspace Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CursorText size={20} weight="duotone" className="text-muted-foreground" />
                    <Label htmlFor="backspace" className="text-base font-medium">
                      Backspace
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow backspace to correct mistakes (MonkeyType style)
                  </p>
                </div>
                <Switch
                  id="backspace"
                  checked={settings?.backspaceEnabled ?? defaultSettings.backspaceEnabled}
                  onCheckedChange={(checked) => updateSetting('backspaceEnabled', checked)}
                />
              </div>

              <Separator />

              {/* Enable Punctuation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <TextT size={20} weight="duotone" className="text-muted-foreground" />
                    <Label htmlFor="punctuation" className="text-base font-medium">
                      Enable Punctuation
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Include punctuation marks in typing practice
                  </p>
                </div>
                <Switch
                  id="punctuation"
                  checked={settings?.punctuationEnabled ?? defaultSettings.punctuationEnabled}
                  onCheckedChange={(checked) => updateSetting('punctuationEnabled', checked)}
                />
              </div>

              <Separator />

              {/* Enable Numbers */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Hash size={20} weight="duotone" className="text-muted-foreground" />
                    <Label htmlFor="numbers" className="text-base font-medium">
                      Enable Numbers
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Include numbers in typing practice text
                  </p>
                </div>
                <Switch
                  id="numbers"
                  checked={settings?.numbersEnabled ?? defaultSettings.numbersEnabled}
                  onCheckedChange={(checked) => updateSetting('numbersEnabled', checked)}
                />
              </div>

              <Separator />

              {/* Enable Capitalization */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <TextT size={20} weight="bold" className="text-muted-foreground" />
                    <Label htmlFor="capitalization" className="text-base font-medium">
                      Enable Capitalization
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Include uppercase letters in practice text
                  </p>
                </div>
                <Switch
                  id="capitalization"
                  checked={settings?.capitalizationEnabled ?? defaultSettings.capitalizationEnabled}
                  onCheckedChange={(checked) => updateSetting('capitalizationEnabled', checked)}
                />
              </div>

              <Separator />

              {/* Mistake Highlight */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <HighlighterCircle size={20} weight="duotone" className="text-muted-foreground" />
                    <Label htmlFor="mistakeHighlight" className="text-base font-medium">
                      Mistake Highlight
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Highlight typing errors in real-time
                  </p>
                </div>
                <Switch
                  id="mistakeHighlight"
                  checked={settings?.mistakeHighlightEnabled ?? defaultSettings.mistakeHighlightEnabled}
                  onCheckedChange={(checked) => updateSetting('mistakeHighlightEnabled', checked)}
                />
              </div>

              <Separator />

              {/* Auto-scroll */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ArrowsVertical size={20} weight="duotone" className="text-muted-foreground" />
                    <Label htmlFor="autoScroll" className="text-base font-medium">
                      Auto-scroll
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically scroll text as you type
                  </p>
                </div>
                <Switch
                  id="autoScroll"
                  checked={settings?.autoScrollEnabled ?? defaultSettings.autoScrollEnabled}
                  onCheckedChange={(checked) => updateSetting('autoScrollEnabled', checked)}
                />
              </div>

              <Separator />

              {/* Show Timer */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Timer size={20} weight="duotone" className="text-muted-foreground" />
                    <Label htmlFor="showTimer" className="text-base font-medium">
                      Show Timer
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Display countdown timer during practice
                  </p>
                </div>
                <Switch
                  id="showTimer"
                  checked={settings?.showTimer ?? defaultSettings.showTimer}
                  onCheckedChange={(checked) => updateSetting('showTimer', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme & UI Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={24} weight="bold" />
                Theme & UI Customization
              </CardTitle>
              <CardDescription>
                Personalize the visual appearance and interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Theme Mode</Label>
                <RadioGroup
                  value={themeSettings?.themeMode ?? defaultThemeSettings.themeMode}
                  onValueChange={(value) => updateThemeSetting('themeMode', value as ThemeSettings['themeMode'])}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                      <Sun size={18} weight="duotone" />
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                      <Moon size={18} weight="duotone" />
                      Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                      <Desktop size={18} weight="duotone" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Custom Theme */}
              <div className="space-y-3">
                <Label htmlFor="customTheme" className="text-base font-medium">
                  Custom Theme
                </Label>
                <Select
                  value={themeSettings?.customTheme ?? defaultThemeSettings.customTheme}
                  onValueChange={(value) => updateThemeSetting('customTheme', value as ThemeSettings['customTheme'])}
                >
                  <SelectTrigger id="customTheme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                    <SelectItem value="solarized">Solarized</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Background Blur */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkle size={20} weight="duotone" className="text-muted-foreground" />
                    <Label htmlFor="backgroundBlur" className="text-base font-medium">
                      Background Blur
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable blur effects on backgrounds
                  </p>
                </div>
                <Switch
                  id="backgroundBlur"
                  checked={themeSettings?.backgroundBlur ?? defaultThemeSettings.backgroundBlur}
                  onCheckedChange={(checked) => updateThemeSetting('backgroundBlur', checked)}
                />
              </div>

              <Separator />

              {/* Animations */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkle size={20} weight="fill" className="text-muted-foreground" />
                    <Label htmlFor="animations" className="text-base font-medium">
                      Animations
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable UI animations and transitions
                  </p>
                </div>
                <Switch
                  id="animations"
                  checked={themeSettings?.animations ?? defaultThemeSettings.animations}
                  onCheckedChange={(checked) => updateThemeSetting('animations', checked)}
                />
              </div>

              <Separator />

              {/* Word Highlight Color */}
              <div className="space-y-3">
                <Label htmlFor="wordHighlightColor" className="text-base font-medium">
                  Word Highlight Color
                </Label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    id="wordHighlightColor"
                    value={themeSettings?.wordHighlightColor ?? defaultThemeSettings.wordHighlightColor}
                    onChange={(e) => updateThemeSetting('wordHighlightColor', e.target.value)}
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">
                    {themeSettings?.wordHighlightColor ?? defaultThemeSettings.wordHighlightColor}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Caret Style */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <CursorClick size={20} weight="duotone" />
                  Caret Style
                </Label>
                <RadioGroup
                  value={themeSettings?.caretStyle ?? defaultThemeSettings.caretStyle}
                  onValueChange={(value) => updateThemeSetting('caretStyle', value as ThemeSettings['caretStyle'])}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="block" id="block" />
                    <Label htmlFor="block" className="cursor-pointer">
                      Block
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="underline" id="underline" />
                    <Label htmlFor="underline" className="cursor-pointer">
                      Underline
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bar" id="bar" />
                    <Label htmlFor="bar" className="cursor-pointer">
                      Bar
                    </Label>
                  </div>
                </RadioGroup>
                <div className="mt-3 p-4 rounded-lg border border-border bg-card/50">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Block:</span>
                      <div className="w-3 h-5 bg-primary"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Underline:</span>
                      <div className="w-3 h-5 border-b-2 border-primary"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Bar:</span>
                      <div className="w-0.5 h-5 bg-primary"></div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Caret Smooth Animation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CursorClick size={20} weight="fill" className="text-muted-foreground" />
                    <Label htmlFor="caretSmoothAnimation" className="text-base font-medium">
                      Caret Smooth Animation
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth caret movement transitions
                  </p>
                </div>
                <Switch
                  id="caretSmoothAnimation"
                  checked={themeSettings?.caretSmoothAnimation ?? defaultThemeSettings.caretSmoothAnimation}
                  onCheckedChange={(checked) => updateThemeSetting('caretSmoothAnimation', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fonts & Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TextAa size={24} weight="bold" />
                Fonts & Display
              </CardTitle>
              <CardDescription>
                Configure font preferences and display layout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* English Font */}
              <div className="space-y-3">
                <Label htmlFor="englishFont" className="text-base font-medium">
                  English Font
                </Label>
                <Select
                  value={fontDisplaySettings?.englishFont ?? defaultFontDisplaySettings.englishFont}
                  onValueChange={(value) => updateFontDisplaySetting('englishFont', value as FontDisplaySettings['englishFont'])}
                >
                  <SelectTrigger id="englishFont">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="menlo">Menlo</SelectItem>
                    <SelectItem value="courier">Courier New</SelectItem>
                    <SelectItem value="source-code-pro">Source Code Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Hindi Font */}
              <div className="space-y-3">
                <Label htmlFor="hindiFont" className="text-base font-medium">
                  Hindi Font
                </Label>
                <Select
                  value={fontDisplaySettings?.hindiFont ?? defaultFontDisplaySettings.hindiFont}
                  onValueChange={(value) => updateFontDisplaySetting('hindiFont', value as FontDisplaySettings['hindiFont'])}
                >
                  <SelectTrigger id="hindiFont">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kruti-dev">KrutiDev</SelectItem>
                    <SelectItem value="mangal">Mangal</SelectItem>
                    <SelectItem value="noto-sans-devanagari">Noto Sans Devanagari</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontSize" className="text-base font-medium">
                    Font Size
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {fontDisplaySettings?.fontSize ?? defaultFontDisplaySettings.fontSize}px
                  </span>
                </div>
                <Slider
                  id="fontSize"
                  min={12}
                  max={32}
                  step={1}
                  value={[fontDisplaySettings?.fontSize ?? defaultFontDisplaySettings.fontSize]}
                  onValueChange={(value) => updateFontDisplaySetting('fontSize', value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust the text size for better readability
                </p>
              </div>

              <Separator />

              {/* Line Height */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lineHeight" className="text-base font-medium">
                    Line Height
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {fontDisplaySettings?.lineHeight ?? defaultFontDisplaySettings.lineHeight}
                  </span>
                </div>
                <Slider
                  id="lineHeight"
                  min={1.0}
                  max={2.5}
                  step={0.1}
                  value={[fontDisplaySettings?.lineHeight ?? defaultFontDisplaySettings.lineHeight]}
                  onValueChange={(value) => updateFontDisplaySetting('lineHeight', value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Control spacing between lines of text
                </p>
              </div>

              <Separator />

              {/* Word Spacing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wordSpacing" className="text-base font-medium">
                    Word Spacing
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {fontDisplaySettings?.wordSpacing ?? defaultFontDisplaySettings.wordSpacing}em
                  </span>
                </div>
                <Slider
                  id="wordSpacing"
                  min={0}
                  max={1.5}
                  step={0.1}
                  value={[fontDisplaySettings?.wordSpacing ?? defaultFontDisplaySettings.wordSpacing]}
                  onValueChange={(value) => updateFontDisplaySetting('wordSpacing', value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust spacing between words
                </p>
              </div>

              <Separator />

              {/* Layout Width */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <ArrowsOutLineHorizontal size={20} weight="duotone" />
                  Layout Width
                </Label>
                <RadioGroup
                  value={fontDisplaySettings?.layoutWidth ?? defaultFontDisplaySettings.layoutWidth}
                  onValueChange={(value) => updateFontDisplaySetting('layoutWidth', value as FontDisplaySettings['layoutWidth'])}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="compact" />
                    <Label htmlFor="compact" className="cursor-pointer">
                      Compact
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="cursor-pointer">
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wide" id="wide" />
                    <Label htmlFor="wide" className="cursor-pointer">
                      Wide
                    </Label>
                  </div>
                </RadioGroup>
                <div className="mt-3 p-4 rounded-lg border border-border bg-card/50 space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-20">Compact:</span>
                      <div className="h-4 bg-primary/20 rounded" style={{width: '300px'}}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-20">Medium:</span>
                      <div className="h-4 bg-primary/40 rounded" style={{width: '450px'}}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-20">Wide:</span>
                      <div className="h-4 bg-primary/60 rounded" style={{width: '600px'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Settings Button */}
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base">Reset All Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Restore all settings to their default values
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={resetAllSettings}
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 TypistPro India. Settings saved automatically.</p>
        </div>
      </footer>
    </div>
  )
}
