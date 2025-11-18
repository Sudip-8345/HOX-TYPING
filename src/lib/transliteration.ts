import { hindiLayoutCharMaps } from '@/lib/hindiLayouts'

export const transliterationMap: Record<string, string> = {
  'a': 'अ',
  'aa': 'आ',
  'i': 'इ',
  'ee': 'ई',
  'u': 'उ',
  'oo': 'ऊ',
  'e': 'ए',
  'ai': 'ऐ',
  'o': 'ओ',
  'au': 'औ',
  'am': 'अं',
  'aha': 'अः',
  
  'ka': 'क',
  'kha': 'ख',
  'ga': 'ग',
  'gha': 'घ',
  'nga': 'ङ',
  'cha': 'च',
  'chha': 'छ',
  'ja': 'ज',
  'jha': 'झ',
  'nja': 'ञ',
  'Ta': 'ट',
  'Tha': 'ठ',
  'Da': 'ड',
  'Dha': 'ढ',
  'Na': 'ण',
  'ta': 'त',
  'tha': 'थ',
  'da': 'द',
  'dha': 'ध',
  'na': 'न',
  'pa': 'प',
  'pha': 'फ',
  'ba': 'ब',
  'bha': 'भ',
  'ma': 'म',
  'ya': 'य',
  'ra': 'र',
  'la': 'ल',
  'va': 'व',
  'wa': 'व',
  'sha': 'श',
  'shha': 'ष',
  'sa': 'स',
  'ha': 'ह',
  'ksha': 'क्ष',
  'tra': 'त्र',
  'gya': 'ज्ञ',
  
  'k': 'क्',
  'kh': 'ख्',
  'g': 'ग्',
  'gh': 'घ्',
  'ng': 'ङ्',
  'ch': 'च्',
  'chh': 'छ्',
  'j': 'ज्',
  'jh': 'झ्',
  'nj': 'ञ्',
  'T': 'ट्',
  'Th': 'ठ्',
  'D': 'ड्',
  'Dh': 'ढ्',
  'N': 'ण्',
  't': 'त्',
  'th': 'थ्',
  'd': 'द्',
  'dh': 'ध्',
  'n': 'न्',
  'p': 'प्',
  'ph': 'फ्',
  'b': 'ब्',
  'bh': 'भ्',
  'm': 'म्',
  'y': 'य्',
  'r': 'र्',
  'l': 'ल्',
  'v': 'व्',
  'w': 'व्',
  'sh': 'श्',
  'shh': 'ष्',
  's': 'स्',
  'h': 'ह्',
  
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
  
  '.': '।',
  '..': '॥',
  ' ': ' ',
}

const matras: Record<string, string> = {
  'a': '',
  'aa': 'ा',
  'i': 'ि',
  'ee': 'ी',
  'u': 'ु',
  'oo': 'ू',
  'e': 'े',
  'ai': 'ै',
  'o': 'ो',
  'au': 'ौ',
  'am': 'ं',
  'aha': 'ः',
}

const consonants = [
  'k', 'kh', 'g', 'gh', 'ng',
  'ch', 'chh', 'j', 'jh', 'nj',
  'T', 'Th', 'D', 'Dh', 'N',
  't', 'th', 'd', 'dh', 'n',
  'p', 'ph', 'b', 'bh', 'm',
  'y', 'r', 'l', 'v', 'w',
  'sh', 'shh', 's', 'h',
]

const vowels = ['a', 'aa', 'i', 'ee', 'u', 'oo', 'e', 'ai', 'o', 'au']

export function transliterateToHindi(englishText: string): string {
  let result = ''
  let i = 0
  
  while (i < englishText.length) {
    let matched = false
    
    for (let len = Math.min(4, englishText.length - i); len > 0; len--) {
      const substring = englishText.substring(i, i + len)
      
      if (transliterationMap[substring]) {
        result += transliterationMap[substring]
        i += len
        matched = true
        break
      }
    }
    
    if (!matched) {
      result += englishText[i]
      i++
    }
  }
  
  return result
}

export function smartTransliterate(text: string): string {
  if (!text) return ''
  
  let result = ''
  let i = 0
  
  while (i < text.length) {
    let matched = false
    
    for (let lookAhead = 5; lookAhead > 0; lookAhead--) {
      if (i + lookAhead > text.length) continue
      
      const chunk = text.substring(i, i + lookAhead)
      const lowerChunk = chunk.toLowerCase()
      
      let consonantPart = ''
      let vowelPart = ''
      let parsedLength = 0
      
      for (const cons of consonants.sort((a, b) => b.length - a.length)) {
        if (lowerChunk.startsWith(cons)) {
          consonantPart = cons
          parsedLength = cons.length
          
          const remaining = lowerChunk.substring(parsedLength)
          for (const vow of vowels.sort((a, b) => b.length - a.length)) {
            if (remaining.startsWith(vow)) {
              vowelPart = vow
              parsedLength += vow.length
              break
            }
          }
          
          if (vowelPart) {
            const baseConsonant = transliterationMap[consonantPart + 'a']?.replace(/्$/, '') || transliterationMap[consonantPart] || consonantPart
            const matra = matras[vowelPart] || ''
            result += baseConsonant + matra
            i += parsedLength
            matched = true
            break
          }
        }
      }
      
      if (matched) break
    }
    
    if (!matched) {
      for (let len = 4; len > 0; len--) {
        if (i + len > text.length) continue
        
        const substring = text.substring(i, i + len)
        const lowerSubstring = substring.toLowerCase()
        
        if (transliterationMap[lowerSubstring]) {
          result += transliterationMap[lowerSubstring]
          i += len
          matched = true
          break
        }
      }
    }
    
    if (!matched) {
      result += text[i]
      i++
    }
  }
  
  return result
}

export const mangalKrutiMap: Record<string, string> = {
  'Q': 'ौ',
  'W': 'ै',
  'E': 'ा',
  'R': 'ी',
  'T': 'ू',
  'Y': 'ब',
  'U': 'ह',
  'I': 'ग',
  'O': 'द',
  'P': 'ज',
  '{': 'ड',
  '}': 'ढ',
  
  'A': 'ो',
  'S': 'े',
  'D': '्',
  'F': 'ि',
  'G': 'ु',
  'H': 'प',
  'J': 'र',
  'K': 'क',
  'L': 'त',
  ':': 'ट',
  '"': 'ठ',
  
  'Z': '',
  'X': 'ं',
  'C': 'म',
  'V': 'न',
  'B': 'व',
  'N': 'ल',
  'M': 'स',
  '<': ',',
  '>': '.',
  '?': 'य',
  
  'q': 'ौ',
  'w': 'ै',
  'e': 'ा',
  'r': 'ी',
  't': 'ू',
  'y': 'ब',
  'u': 'ह',
  'i': 'ग',
  'o': 'द',
  'p': 'ज',
  '[': 'ड',
  ']': 'ढ',
  
  'a': 'ो',
  's': 'े',
  'd': '्',
  'f': 'ि',
  'g': 'ु',
  'h': 'प',
  'j': 'र',
  'k': 'क',
  'l': 'त',
  ';': 'ट',
  "'": 'ठ',
  
  'z': '',
  'x': 'ं',
  'c': 'म',
  'v': 'न',
  'b': 'व',
  'n': 'ल',
  'm': 'स',
  ',': ',',
  '.': '.',
  '/': 'य',
  
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
  
  ' ': ' ',
}

export function mangalKrutiTransliterate(text: string): string {
  return text.split('').map(char => mangalKrutiMap[char] || char).join('')
}

export type TransliterationMode = 'phonetic' | 'mangal-kruti' | 'direct' | 'remington' | 'inscript'

const mapByLayout = (text: string, map: Record<string, string>): string =>
  text
    .split('')
    .map((char) => map[char] ?? char)
    .join('')

export function transliterate(text: string, mode: TransliterationMode = 'phonetic'): string {
  switch (mode) {
    case 'remington':
      return mapByLayout(text, hindiLayoutCharMaps.remington)
    case 'inscript':
      return mapByLayout(text, hindiLayoutCharMaps.inscript)
    case 'mangal-kruti':
      return mangalKrutiTransliterate(text)
    case 'phonetic':
      return smartTransliterate(text)
    case 'direct':
    default:
      return text
  }
}
