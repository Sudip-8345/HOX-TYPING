export type HindiLayoutName = 'remington' | 'inscript'

export interface HindiKeyDefinition {
  key: string
  output: string
  shiftKey?: string
  shiftOutput?: string
}

export interface HindiKeyboardLayout {
  rows: HindiKeyDefinition[][]
}

const remingtonRows: HindiKeyDefinition[][] = [
  [
    { key: '1', output: '१', shiftKey: '!' },
    { key: '2', output: '२', shiftKey: '@' },
    { key: '3', output: '३', shiftKey: '#' },
    { key: '4', output: '४', shiftKey: '$' },
    { key: '5', output: '५', shiftKey: '%' },
    { key: '6', output: '६', shiftKey: '^' },
    { key: '7', output: '७', shiftKey: '&' },
    { key: '8', output: '८', shiftKey: '*' },
    { key: '9', output: '९', shiftKey: '(' },
    { key: '0', output: '०', shiftKey: ')' },
    { key: '-', output: '-', shiftKey: '_' },
    { key: '=', output: 'ृ', shiftKey: '+' },
  ],
  [
    { key: 'q', output: 'ौ', shiftKey: 'Q', shiftOutput: 'औ' },
    { key: 'w', output: 'ै', shiftKey: 'W', shiftOutput: 'ऐ' },
    { key: 'e', output: 'ा', shiftKey: 'E', shiftOutput: 'आ' },
    { key: 'r', output: 'ी', shiftKey: 'R', shiftOutput: 'ई' },
    { key: 't', output: 'ू', shiftKey: 'T', shiftOutput: 'ऊ' },
    { key: 'y', output: 'ब', shiftKey: 'Y', shiftOutput: 'भ' },
    { key: 'u', output: 'ह', shiftKey: 'U', shiftOutput: 'ङ' },
    { key: 'i', output: 'ग', shiftKey: 'I', shiftOutput: 'घ' },
    { key: 'o', output: 'द', shiftKey: 'O', shiftOutput: 'ध' },
    { key: 'p', output: 'ज', shiftKey: 'P', shiftOutput: 'झ' },
    { key: '[', output: 'ड', shiftKey: '{', shiftOutput: 'ढ' },
    { key: ']', output: 'ञ', shiftKey: '}', shiftOutput: 'ण' },
  ],
  [
    { key: 'a', output: 'ो', shiftKey: 'A', shiftOutput: 'ओ' },
    { key: 's', output: 'े', shiftKey: 'S', shiftOutput: 'ए' },
    { key: 'd', output: '्', shiftKey: 'D', shiftOutput: 'अ' },
    { key: 'f', output: 'ि', shiftKey: 'F', shiftOutput: 'इ' },
    { key: 'g', output: 'ु', shiftKey: 'G', shiftOutput: 'उ' },
    { key: 'h', output: 'प', shiftKey: 'H', shiftOutput: 'फ' },
    { key: 'j', output: 'र', shiftKey: 'J', shiftOutput: 'ऋ' },
    { key: 'k', output: 'क', shiftKey: 'K', shiftOutput: 'ख' },
    { key: 'l', output: 'त', shiftKey: 'L', shiftOutput: 'थ' },
    { key: ';', output: 'च', shiftKey: ':', shiftOutput: 'छ' },
    { key: "'", output: 'ट', shiftKey: '"', shiftOutput: 'ठ' },
  ],
  [
    { key: 'z', output: 'ॉ', shiftKey: 'Z', shiftOutput: 'ऑ' },
    { key: 'x', output: 'ं', shiftKey: 'X', shiftOutput: 'ँ' },
    { key: 'c', output: 'म', shiftKey: 'C', shiftOutput: 'ण' },
    { key: 'v', output: 'न', shiftKey: 'V' },
    { key: 'b', output: 'व', shiftKey: 'B' },
    { key: 'n', output: 'ल', shiftKey: 'N' },
    { key: 'm', output: 'स', shiftKey: 'M', shiftOutput: 'श' },
    { key: ',', output: ',', shiftKey: '<', shiftOutput: 'ष' },
    { key: '.', output: '।', shiftKey: '>', shiftOutput: '॥' },
    { key: '/', output: 'य', shiftKey: '?' },
  ],
]

const inscriptRows: HindiKeyDefinition[][] = [
  [
    { key: '1', output: '१', shiftKey: '!' },
    { key: '2', output: '२', shiftKey: '@' },
    { key: '3', output: '३', shiftKey: '#' },
    { key: '4', output: '४', shiftKey: '$' },
    { key: '5', output: '५', shiftKey: '%' },
    { key: '6', output: '६', shiftKey: '^' },
    { key: '7', output: '७', shiftKey: '&' },
    { key: '8', output: '८', shiftKey: '*' },
    { key: '9', output: '९', shiftKey: '(' },
    { key: '0', output: '०', shiftKey: ')' },
  ],
  [
    { key: 'q', output: 'ौ', shiftKey: 'Q' },
    { key: 'w', output: 'ै', shiftKey: 'W' },
    { key: 'e', output: 'ा', shiftKey: 'E' },
    { key: 'r', output: 'ी', shiftKey: 'R' },
    { key: 't', output: 'ू', shiftKey: 'T' },
    { key: 'y', output: 'भ', shiftKey: 'Y' },
    { key: 'u', output: 'ङ', shiftKey: 'U' },
    { key: 'i', output: 'घ', shiftKey: 'I' },
    { key: 'o', output: 'ध', shiftKey: 'O' },
    { key: 'p', output: 'झ', shiftKey: 'P' },
    { key: '[', output: 'ढ', shiftKey: '{' },
    { key: ']', output: 'ञ', shiftKey: '}' },
  ],
  [
    { key: 'a', output: 'ो', shiftKey: 'A' },
    { key: 's', output: 'े', shiftKey: 'S' },
    { key: 'd', output: '्', shiftKey: 'D' },
    { key: 'f', output: 'ि', shiftKey: 'F' },
    { key: 'g', output: 'ु', shiftKey: 'G' },
    { key: 'h', output: 'प', shiftKey: 'H' },
    { key: 'j', output: 'र', shiftKey: 'J' },
    { key: 'k', output: 'क', shiftKey: 'K' },
    { key: 'l', output: 'त', shiftKey: 'L' },
    { key: ';', output: 'च', shiftKey: ':' },
    { key: "'", output: 'ट', shiftKey: '"' },
  ],
  [
    { key: 'z', output: '', shiftKey: 'Z' },
    { key: 'x', output: 'ं', shiftKey: 'X' },
    { key: 'c', output: 'म', shiftKey: 'C' },
    { key: 'v', output: 'न', shiftKey: 'V' },
    { key: 'b', output: 'व', shiftKey: 'B' },
    { key: 'n', output: 'ल', shiftKey: 'N' },
    { key: 'm', output: 'स', shiftKey: 'M' },
    { key: ',', output: ',', shiftKey: '<' },
    { key: '.', output: '।', shiftKey: '>' },
    { key: '/', output: 'य', shiftKey: '?' },
  ],
]

export const hindiKeyboardLayouts: Record<HindiLayoutName, HindiKeyboardLayout> = {
  remington: { rows: remingtonRows },
  inscript: { rows: inscriptRows },
}

const buildCharMap = (layout: HindiKeyboardLayout): Record<string, string> => {
  const map: Record<string, string> = {}

  layout.rows.forEach((row) => {
    row.forEach((keyDef) => {
      if (keyDef.output) {
        map[keyDef.key] = keyDef.output
      }

      if (keyDef.shiftKey) {
        map[keyDef.shiftKey] = keyDef.shiftOutput ?? keyDef.output
      }
    })
  })

  return map
}

export const hindiLayoutCharMaps: Record<HindiLayoutName, Record<string, string>> = {
  remington: buildCharMap(hindiKeyboardLayouts.remington),
  inscript: buildCharMap(hindiKeyboardLayouts.inscript),
}
