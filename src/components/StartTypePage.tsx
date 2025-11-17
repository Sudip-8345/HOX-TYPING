import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Lightning,
  TextAa,
  Clock,
  TextAlignLeft,
  Play
} from '@phosphor-icons/react'

export function StartTypePage() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi')
  const [practiceMode, setPracticeMode] = useState<'time' | 'words'>('time')
  const [timeLimit, setTimeLimit] = useState('1')
  const [wordCount, setWordCount] = useState('25')
  const [hindiFont, setHindiFont] = useState('default')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  const handleStartPractice = () => {
    const params = new URLSearchParams({
      mode: practiceMode,
      difficulty: difficulty,
      ...(practiceMode === 'time' ? { time: timeLimit } : { words: wordCount }),
      ...(language === 'hindi' ? { font: hindiFont } : {})
    })

    if (language === 'hindi') {
      navigate(`/practice?${params.toString()}`)
    } else {
      navigate(`/english-practice?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} weight="bold" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Play size={24} weight="fill" className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Start Typing Practice</h1>
                <p className="text-xs text-muted-foreground">Choose your language and practice mode</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Configure Your Practice Session</CardTitle>
              <CardDescription>
                Select language, practice mode, and duration to start your typing practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Language Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Select Language</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose which language you want to practice
                  </p>
                </div>
                <Tabs value={language} onValueChange={(value) => setLanguage(value as 'hindi' | 'english')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hindi" className="gap-2">
                      <Lightning size={20} weight="bold" />
                      Hindi (हिंदी)
                    </TabsTrigger>
                    <TabsTrigger value="english" className="gap-2">
                      <TextAa size={20} weight="bold" />
                      English
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="hindi" className="mt-6">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Lightning size={32} weight="fill" className="text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">Hindi Typing Practice</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Practice Hindi typing with real-time feedback, multiple fonts (Mangal, KrutiDev, Remington), 
                              and comprehensive performance tracking.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                Multiple Fonts
                              </span>
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                Real-time Feedback
                              </span>
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                AI Coaching
                              </span>
                            </div>
                            
                            {/* Font Selection for Hindi */}
                            <div className="space-y-2 mt-4 p-4 rounded-lg bg-background/50 border border-primary/20">
                              <Label className="text-sm font-semibold">Select Font</Label>
                              <Select value={hindiFont} onValueChange={setHindiFont}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default (Noto Sans Devanagari)</SelectItem>
                                  <SelectItem value="krutidev">Kruti Dev</SelectItem>
                                  <SelectItem value="mangal">Mangal</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                Choose your preferred Hindi font for typing practice
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="english" className="mt-6">
                    <Card className="bg-secondary/5 border-secondary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <TextAa size={32} weight="fill" className="text-secondary flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-lg mb-2">English Typing Practice</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Improve your English typing speed and accuracy with real-time feedback, 
                              exam mode simulation, and detailed performance metrics.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                Speed Training
                              </span>
                              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                Accuracy Focus
                              </span>
                              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                Exam Mode
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="h-px bg-border" />

              {/* Difficulty Level Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Difficulty Level</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the challenge level that matches your skill
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Easy */}
                  <button
                    onClick={() => setDifficulty('easy')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      difficulty === 'easy'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-border hover:border-green-500/50 hover:bg-green-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${difficulty === 'easy' ? 'bg-green-500' : 'bg-muted'}`} />
                      <h4 className="font-semibold">Easy</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Simple words and short phrases
                    </p>
                    <div className="mt-2 flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="w-2 h-2 rounded-full bg-muted" />
                      <div className="w-2 h-2 rounded-full bg-muted" />
                    </div>
                  </button>

                  {/* Medium */}
                  <button
                    onClick={() => setDifficulty('medium')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      difficulty === 'medium'
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-border hover:border-orange-500/50 hover:bg-orange-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${difficulty === 'medium' ? 'bg-orange-500' : 'bg-muted'}`} />
                      <h4 className="font-semibold">Medium</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Regular sentences with balanced complexity
                    </p>
                    <div className="mt-2 flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <div className="w-2 h-2 rounded-full bg-muted" />
                    </div>
                  </button>

                  {/* Hard */}
                  <button
                    onClick={() => setDifficulty('hard')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      difficulty === 'hard'
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-border hover:border-red-500/50 hover:bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${difficulty === 'hard' ? 'bg-red-500' : 'bg-muted'}`} />
                      <h4 className="font-semibold">Hard</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complex grammar and long sentences
                    </p>
                    <div className="mt-2 flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Practice Mode Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Practice Mode</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose between time-based or word-length based practice
                  </p>
                </div>

                <RadioGroup value={practiceMode} onValueChange={(value) => setPracticeMode(value as 'time' | 'words')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Time-based Mode */}
                    <label htmlFor="time-mode" className="cursor-pointer">
                      <Card className={`p-4 transition-all ${practiceMode === 'time' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary/50'}`}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="time" id="time-mode" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock size={24} weight="bold" className="text-primary" />
                              <Label htmlFor="time-mode" className="text-base font-semibold cursor-pointer">
                                Time-based
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Practice for a specific duration. Type as much as you can within the time limit.
                            </p>
                            {practiceMode === 'time' && (
                              <div className="space-y-2">
                                <Label className="text-sm">Select Duration</Label>
                                <Select value={timeLimit} onValueChange={setTimeLimit}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 Minute</SelectItem>
                                    <SelectItem value="2">2 Minutes</SelectItem>
                                    <SelectItem value="3">3 Minutes</SelectItem>
                                    <SelectItem value="5">5 Minutes</SelectItem>
                                    <SelectItem value="10">10 Minutes</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </label>

                    {/* Word-length Mode */}
                    <label htmlFor="words-mode" className="cursor-pointer">
                      <Card className={`p-4 transition-all ${practiceMode === 'words' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary/50'}`}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="words" id="words-mode" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <TextAlignLeft size={24} weight="bold" className="text-primary" />
                              <Label htmlFor="words-mode" className="text-base font-semibold cursor-pointer">
                                Word-length based
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Practice a specific number of words. Complete the passage at your own pace.
                            </p>
                            {practiceMode === 'words' && (
                              <div className="space-y-2">
                                <Label className="text-sm">Select Word Count</Label>
                                <Select value={wordCount} onValueChange={setWordCount}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="25">25 Words</SelectItem>
                                    <SelectItem value="50">50 Words</SelectItem>
                                    <SelectItem value="100">100 Words</SelectItem>
                                    <SelectItem value="200">200 Words</SelectItem>
                                    <SelectItem value="500">500 Words</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="h-px bg-border" />

              {/* Summary and Start Button */}
              <div className="space-y-4">
                <Card className="bg-accent/10 border-accent/20">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">Practice Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Language</p>
                        <p className="font-semibold">{language === 'hindi' ? 'Hindi (हिंदी)' : 'English'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Difficulty</p>
                        <p className="font-semibold capitalize">{difficulty}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Mode</p>
                        <p className="font-semibold">
                          {practiceMode === 'time' 
                            ? `${timeLimit} ${parseInt(timeLimit) === 1 ? 'Minute' : 'Minutes'}` 
                            : `${wordCount} Words`}
                        </p>
                      </div>
                      {language === 'hindi' && (
                        <div>
                          <p className="text-muted-foreground">Font</p>
                          <p className="font-semibold">
                            {hindiFont === 'default' ? 'Default (Noto Sans)' : hindiFont === 'krutidev' ? 'Kruti Dev' : 'Mangal'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleStartPractice} 
                  size="lg" 
                  className="w-full gap-2 text-lg py-6"
                >
                  <Play size={24} weight="fill" />
                  Start Typing Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
