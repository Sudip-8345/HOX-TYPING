export interface TypingStats {
  wpm: number
  accuracy: number
  errors: number
  timeElapsed: number
  charactersTyped: number
}

export interface SessionData {
  id: string
  timestamp: number
  wpm: number
  accuracy: number
  errors: number
  duration: number
  language: string
}

export const calculateWPM = (charactersTyped: number, timeElapsedSeconds: number): number => {
  if (timeElapsedSeconds === 0) return 0
  const words = charactersTyped / 5
  const minutes = timeElapsedSeconds / 60
  return Math.round(words / minutes)
}

export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 0
  return Math.round((correctChars / totalChars) * 100)
}

export const practiceTexts = {
  english: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for practicing your typing skills.",
    "Practice makes perfect when it comes to typing. The more you type, the faster and more accurate you will become over time.",
    "Technology has transformed the way we communicate. Being able to type quickly and accurately is now an essential skill in the modern workplace.",
    "Focus on accuracy first, then speed will follow naturally. It's better to type slowly and correctly than quickly with many mistakes.",
  ],
  hindi: [
    "हिंदी टाइपिंग का अभ्यास करना बहुत महत्वपूर्ण है। यह आपकी कुशलता को बढ़ाता है।",
    "देवनागरी लिपि में टाइप करना सीखने के लिए नियमित अभ्यास आवश्यक है।",
    "कंप्यूटर पर हिंदी में तेज़ी से टाइप करना एक उपयोगी कौशल है।",
    "धैर्य और अभ्यास से आप किसी भी भाषा में टाइपिंग में माहिर बन सकते हैं।",
  ],
}

export const getRandomText = (language: 'english' | 'hindi'): string => {
  const texts = practiceTexts[language]
  return texts[Math.floor(Math.random() * texts.length)]
}

export const analyzeErrors = (incorrectChars: Map<number, string>): string => {
  if (incorrectChars.size === 0) {
    return "Perfect! No errors detected. Keep up the excellent work!"
  }
  
  if (incorrectChars.size <= 2) {
    return "Great job! Very few errors. Focus on maintaining this accuracy."
  }
  
  if (incorrectChars.size <= 5) {
    return "Good effort! Watch your finger placement for improved accuracy."
  }
  
  return "Focus on accuracy over speed. Try slowing down to reduce errors."
}
