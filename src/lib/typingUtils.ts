export interface TypingStats {
  wpm: number
  grossWpm: number
  netWpm: number
  accuracy: number
  errors: number
  timeElapsed: number
  charactersTyped: number
  correctChars: number
  cpm: number
}

export interface SessionData {
  id: string
  timestamp: number
  wpm: number
  grossWpm: number
  netWpm: number
  accuracy: number
  errors: number
  duration: number
  language: string
  font: string
  examMode: string | null
  weakKeys: string[]
}

export interface ExamMode {
  id: string
  name: string
  duration: number
  allowBackspace: boolean
  errorPenalty: number
}

export interface LanguageFont {
  language: string
  label: string
  fonts: { id: string; name: string; className: string }[]
}

export const examModes: ExamMode[] = [
  { id: 'practice', name: 'Practice Mode', duration: 0, allowBackspace: true, errorPenalty: 0 },
  { id: 'ssc', name: 'SSC (10 min)', duration: 600, allowBackspace: false, errorPenalty: 5 },
  { id: 'rrb', name: 'RRB (8 min)', duration: 480, allowBackspace: false, errorPenalty: 5 },
  { id: 'highcourt', name: 'High Court (15 min)', duration: 900, allowBackspace: false, errorPenalty: 3 },
  { id: 'crpf', name: 'CRPF (10 min)', duration: 600, allowBackspace: false, errorPenalty: 5 },
  { id: 'delhipolice', name: 'Delhi Police (10 min)', duration: 600, allowBackspace: false, errorPenalty: 5 },
]

export const languageFonts: LanguageFont[] = [
  {
    language: 'english',
    label: 'English',
    fonts: [
      { id: 'jetbrains', name: 'JetBrains Mono', className: 'font-mono' },
      { id: 'courier', name: 'Courier New', className: 'font-[Courier_New]' },
    ],
  },
  {
    language: 'hindi',
    label: 'हिंदी',
    fonts: [
      { id: 'noto', name: 'Noto Sans Devanagari', className: 'font-hindi' },
      { id: 'mangal', name: 'Mangal', className: 'font-[Mangal]' },
    ],
  },
]

export const durations = [
  { value: 60, label: '1 Min' },
  { value: 120, label: '2 Min' },
  { value: 300, label: '5 Min' },
  { value: 480, label: '8 Min (RRB)' },
  { value: 600, label: '10 Min (SSC)' },
  { value: 900, label: '15 Min' },
  { value: 1800, label: '30 Min' },
]

export const calculateWPM = (charactersTyped: number, timeElapsedSeconds: number): number => {
  if (timeElapsedSeconds === 0) return 0
  const words = charactersTyped / 5
  const minutes = timeElapsedSeconds / 60
  return Math.round(words / minutes)
}

export const calculateNetWPM = (
  grossWPM: number,
  errors: number,
  timeElapsedSeconds: number
): number => {
  if (timeElapsedSeconds === 0) return 0
  const minutes = timeElapsedSeconds / 60
  const errorPenalty = errors / minutes
  return Math.max(0, Math.round(grossWPM - errorPenalty))
}

export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100
  return Math.round((correctChars / totalChars) * 100)
}

export const calculateCPM = (charactersTyped: number, timeElapsedSeconds: number): number => {
  if (timeElapsedSeconds === 0) return 0
  const minutes = timeElapsedSeconds / 60
  return Math.round(charactersTyped / minutes)
}

export const practiceTexts = {
  english: [
    "The Government of India conducts typing tests for various positions across its departments. Proficiency in typing is essential for administrative roles. Practice regularly to improve your speed and accuracy.",
    "Computer skills are now mandatory for most government jobs. The ability to type quickly and accurately demonstrates professional competence and efficiency in modern office environments.",
    "Success in typing exams requires consistent practice and proper technique. Focus on accuracy first, then gradually increase your speed. Use all fingers and maintain proper posture throughout your practice sessions.",
    "Government typing exams assess both speed and accuracy. Candidates must achieve minimum benchmarks to qualify. Regular practice with exam-pattern paragraphs helps build confidence and familiarity.",
    "Professional typing skills enhance workplace productivity. Administrative staff rely on fast, accurate typing for documentation, correspondence, and data entry tasks. Developing this skill opens career opportunities.",
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet and serves as an excellent practice sentence for improving typing coverage and speed.",
    "Keyboard mastery requires dedication and systematic practice. Understanding proper finger placement and developing muscle memory are crucial steps toward achieving professional typing speeds above sixty words per minute.",
    "Modern offices demand digital literacy. Email communication, report writing, and database management all require efficient typing skills. Employers value candidates who can type without looking at the keyboard.",
    "Time management during typing tests is critical. Balance speed with accuracy to maximize your net score. Remember that errors reduce your effective words per minute significantly.",
    "Regular practice sessions of fifteen to thirty minutes yield better results than occasional long sessions. Consistency builds muscle memory and improves typing reflexes over time.",
  ],
  hindi: [
    "भारत सरकार के विभिन्न विभागों में टाइपिंग परीक्षा अनिवार्य है। प्रशासनिक पदों के लिए टाइपिंग में दक्षता आवश्यक है। नियमित अभ्यास से अपनी गति और सटीकता बढ़ाएं।",
    "सरकारी नौकरियों के लिए कंप्यूटर कौशल अब अनिवार्य हो गया है। तेजी से और सटीक टाइप करने की क्षमता आधुनिक कार्यालय वातावरण में पेशेवर क्षमता और दक्षता को दर्शाती है।",
    "टाइपिंग परीक्षा में सफलता के लिए निरंतर अभ्यास और उचित तकनीक की आवश्यकता होती है। पहले सटीकता पर ध्यान दें, फिर धीरे-धीरे अपनी गति बढ़ाएं। सभी उंगलियों का उपयोग करें।",
    "सरकारी टाइपिंग परीक्षा में गति और सटीकता दोनों का मूल्यांकन होता है। उम्मीदवारों को योग्यता के लिए न्यूनतम मानक प्राप्त करना होगा। परीक्षा पैटर्न के अनुच्छेदों के साथ नियमित अभ्यास विश्वास बनाने में मदद करता है।",
    "व्यावसायिक टाइपिंग कौशल कार्यस्थल की उत्पादकता बढ़ाते हैं। प्रशासनिक कर्मचारी दस्तावेज़ीकरण, पत्राचार और डेटा प्रविष्टि कार्यों के लिए तेज, सटीक टाइपिंग पर निर्भर करते हैं। यह कौशल करियर के अवसर खोलता है।",
    "देवनागरी लिपि में टाइप करना सीखने के लिए नियमित अभ्यास आवश्यक है। उचित उंगली स्थिति और मांसपेशी स्मृति विकसित करना महत्वपूर्ण है।",
    "कंप्यूटर पर हिंदी में तेज़ी से टाइप करना एक उपयोगी कौशल है जो सरकारी और निजी क्षेत्र में रोजगार के अवसर प्रदान करता है।",
    "धैर्य और अभ्यास से आप किसी भी भाषा में टाइपिंग में माहिर बन सकते हैं। प्रतिदिन कम से कम पंद्रह मिनट का अभ्यास करें।",
    "कीबोर्ड की देखे बिना टाइप करना पेशेवर कौशल है। यह दक्षता कार्यालय में आपकी उत्पादकता को दोगुना कर सकती है।",
    "एसएससी और आरआरबी परीक्षाओं में टाइपिंग टेस्ट महत्वपूर्ण चरण है। इन परीक्षाओं में बैकस्पेस का उपयोग निषिद्ध है और त्रुटियों के लिए अंक काटे जाते हैं।",
  ],
}

export const getRandomText = (language: string): string => {
  const texts = practiceTexts[language as keyof typeof practiceTexts] || practiceTexts.english
  return texts[Math.floor(Math.random() * texts.length)]
}

export const analyzeErrors = (incorrectChars: Map<number, string>, promptText: string): string => {
  if (incorrectChars.size === 0) {
    return "Perfect! No errors detected. Keep up the excellent work!"
  }

  const errorRate = (incorrectChars.size / promptText.length) * 100

  if (errorRate < 2) {
    return "Outstanding accuracy! Very few errors. You're typing with excellent precision."
  }

  if (errorRate < 5) {
    return "Good effort! Focus on the keys where you made mistakes to improve further."
  }

  if (errorRate < 10) {
    return "Moderate accuracy. Slow down slightly and focus on correct key placement."
  }

  return "Focus on accuracy over speed. Practice individual difficult keys separately."
}

export const detectWeakKeys = (
  incorrectChars: Map<number, string>,
  promptText: string
): string[] => {
  const keyErrors = new Map<string, number>()

  incorrectChars.forEach((typedChar, index) => {
    const expectedChar = promptText[index]
    if (expectedChar) {
      keyErrors.set(expectedChar, (keyErrors.get(expectedChar) || 0) + 1)
    }
  })

  const weakKeys = Array.from(keyErrors.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => key)

  return weakKeys
}

export const generateAITip = (stats: TypingStats, weakKeys: string[]): string => {
  if (stats.accuracy >= 98 && stats.wpm >= 50) {
    return "Excellent performance! You're typing at professional level. Keep maintaining this consistency."
  }

  if (stats.accuracy < 80) {
    return "Accuracy needs improvement. Slow down and focus on pressing the correct keys. Speed will naturally increase with accuracy."
  }

  if (weakKeys.length > 0) {
    return `You're struggling with these keys: ${weakKeys.join(', ')}. Practice these specific characters separately.`
  }

  if (stats.wpm < 25) {
    return "Build your speed gradually. Use all fingers and try to avoid looking at the keyboard."
  }

  if (stats.wpm >= 25 && stats.wpm < 40) {
    return "Good progress! Focus on maintaining rhythm and reducing pauses between words."
  }

  return "Keep practicing consistently. Aim for small improvements in each session."
}

export interface PromptEvaluation {
  correct: number
  errors: number
  comparedLength: number
  incorrectMap: Map<number, string>
}

export const evaluatePromptAgainstInput = (promptText: string, typedText: string): PromptEvaluation => {
  const incorrectMap = new Map<number, string>()
  let correct = 0
  let errors = 0
  const maxLength = Math.min(promptText.length, typedText.length)

  for (let i = 0; i < maxLength; i++) {
    if (typedText[i] === promptText[i]) {
      correct++
    } else {
      errors++
      incorrectMap.set(i, typedText[i])
    }
  }

  // Extra characters typed beyond prompt count as errors to penalize overruns
  if (typedText.length > promptText.length) {
    for (let i = promptText.length; i < typedText.length; i++) {
      errors++
      incorrectMap.set(i, typedText[i])
    }
  }

  return {
    correct,
    errors,
    comparedLength: typedText.length,
    incorrectMap,
  }
}
