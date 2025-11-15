export interface StenoMetrics {
  wpm: number
  accuracy: number
  errors: number
  timeElapsed: number
  strokesDrawn: number
}

export interface SessionData {
  id: string
  timestamp: number
  wpm: number
  accuracy: number
  errors: number
  duration: number
  strokesDrawn: number
}

export const vowels = [
  { symbol: 'a', label: 'a', position: 1 },
  { symbol: 'e', label: 'e', position: 2 },
  { symbol: 't', label: 't', position: 3 },
  { symbol: 'st', label: 'st', position: 4 },
  { symbol: 'ठ', label: 'ठ', diacritic: 1 },
  { symbol: 'ं', label: 'ं', diacritic: 2 },
  { symbol: '◌', label: '◌', diacritic: 3 },
  { symbol: '॰', label: '॰', diacritic: 4 },
]

export const consonants = [
  { symbol: 'a', label: 'a', color: 'green' },
  { symbol: 't', label: 't', color: 'green' },
  { symbol: 'p', label: 'p', color: 'green' },
  { symbol: 'p', label: 'p', color: 'green' },
  { symbol: 'm', label: 'm', color: 'green' },
  { symbol: 'st', label: 'st', color: 'green' },
  { symbol: 'म', label: 'म', color: 'beige' },
  { symbol: 'क', label: 'क', color: 'yellow' },
  { symbol: 'a', label: 'a', color: 'green' },
  { symbol: 'e', label: 'e', color: 'gray' },
  { symbol: 'p', label: 'p', color: 'gray' },
  { symbol: 'd', label: 'd', color: 'red' },
  { symbol: 'O', label: 'O', color: 'red' },
  { symbol: 'p', label: 'p', color: 'red' },
  { symbol: 'दो', label: 'दो', color: 'beige' },
  { symbol: 'र', label: 'र', color: 'yellow' },
  { symbol: 'घर', label: 'घर', color: 'red' },
  { symbol: 'ही', label: 'ही', color: 'green' },
  { symbol: 'है', label: 'है', color: 'green' },
  { symbol: 'मी', label: 'मी', color: 'red' },
  { symbol: 'हर', label: 'हर', color: 'red' },
  { symbol: 'है', label: 'है', color: 'beige' },
  { symbol: 'से', label: 'से', color: 'yellow' },
]

export const briefs = [
  { symbol: 'a', label: 'a', color: 'green' },
  { symbol: 'e', label: 'e', color: 'gray' },
  { symbol: 't', label: 't', color: 'green' },
  { symbol: 'p', label: 'p', color: 'yellow' },
  { symbol: 'p', label: 'p', color: 'gray' },
  { symbol: 'O', label: 'O', color: 'gray' },
  { symbol: 'ā', label: 'ā', color: 'gray' },
  { symbol: 'st', label: 'st', color: 'green' },
  { symbol: 'þ', label: 'þ', color: 'gray' },
  { symbol: 'o', label: 'o', color: 'gray' },
  { symbol: 'ṁ', label: 'ṁ', color: 'gray' },
  { symbol: 'm', label: 'm', color: 'gray' },
]

export const ntoonsSymbols = [
  { symbol: 'मौ', label: 'मौ', color: 'beige' },
  { symbol: 'जे', label: 'जे', color: 'yellow' },
  { symbol: 'वो', label: 'वो', color: 'beige' },
  { symbol: ':', label: ':', color: 'red' },
  { symbol: ':', label: ':', color: 'red' },
  { symbol: 'i', label: 'i', color: 'gray' },
  { symbol: 'ī', label: 'ī', color: 'gray' },
  { symbol: 'o', label: 'o', color: 'gray' },
  { symbol: 'O', label: 'O', color: 'gray' },
  { symbol: 'ə', label: 'ə', color: 'gray' },
  { symbol: 'nī', label: 'nī', color: 'gray' },
  { symbol: 'च', label: 'च', color: 'gray' },
  { symbol: 'ष', label: 'ष', color: 'gray' },
]

export const briefsRight = [
  { symbol: 'घर', label: 'घर', color: 'beige' },
  { symbol: 'फर', label: 'फर', color: 'beige' },
  { symbol: 'ही', label: 'ही', color: 'green' },
  { symbol: 'हौं', label: 'हौं', color: 'green' },
  { symbol: '..', label: '..', color: 'gray' },
  { symbol: 'फ', label: 'फ', color: 'green' },
  { symbol: 'ṗ', label: 'ṗ', color: 'gray' },
  { symbol: '..', label: '..', color: 'gray' },
]

export function calculateWPM(wordsTyped: number, minutes: number): number {
  if (minutes === 0) return 0
  return Math.round(wordsTyped / minutes)
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

export function generateAITip(metrics: StenoMetrics): string {
  const tips: string[] = []
  
  if (metrics.wpm < 60) {
    tips.push('Try to increase writing speed')
  }
  
  if (metrics.accuracy < 90) {
    tips.push('Focus on common briefs')
  }
  
  if (metrics.errors > 5) {
    tips.push('Practice vowel positioning')
  }
  
  tips.push('Focus on common briefs')
  
  return tips.join(' • ')
}

export const dictationTexts = [
  'The quick brown fox jumps over the lazy dog.',
  'Practice makes perfect in stenography.',
  'Pitman shorthand is a phonetic writing system.',
  'Speed and accuracy are essential for professional stenographers.',
  'Master the vowels and consonants systematically.',
]

export function getRandomDictation(): string {
  return dictationTexts[Math.floor(Math.random() * dictationTexts.length)]
}
