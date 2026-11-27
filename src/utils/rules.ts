export type Pattern =
  | { type: 'any' }
  | { type: 'full-card' }
  | { type: 'any-row' }
  | { type: 'any-column' }
  | { type: 'any-diagonal' }
  | { type: 'row'; index: number }
  | { type: 'rows'; indexes: number[] }
  | { type: 'column'; index: number }
  | { type: 'columns'; indexes: number[] }
  | { type: 'diagonal'; index: 0 | 1 }

export interface RuleStep {
  id: string
  pattern: Pattern
}

export function defaultRules(): RuleStep[] {
  return [{ id: crypto.randomUUID(), pattern: { type: 'any' } }]
}

export function patternIcon(p: Pattern): string {
  switch (p.type) {
    case 'any':
      return '🎯'
    case 'full-card':
      return '🟩'
    case 'any-row':
      return '🔀'
    case 'any-column':
      return '🌊'
    case 'any-diagonal':
      return '🌀'
    case 'row':
      return '➖'
    case 'rows':
      return '☰'
    case 'column':
      return '⬇️'
    case 'columns':
      return '🧱'
    case 'diagonal':
      return p.index === 0 ? '↘️' : '↙️'
  }
}

export function patternLabel(p: Pattern): string {
  switch (p.type) {
    case 'any':
      return 'Freies Bingo'
    case 'full-card':
      return 'Volles Blatt'
    case 'any-row':
      return 'Beliebige Zeile'
    case 'any-column':
      return 'Beliebige Spalte'
    case 'any-diagonal':
      return 'Beliebige Diagonale'
    case 'row':
      return `Zeile ${p.index}`
    case 'rows':
      return `Zeilen ${p.indexes.join(' + ')}`
    case 'column':
      return `Spalte ${p.index}`
    case 'columns':
      return `Spalten ${p.indexes.join(' + ')}`
    case 'diagonal':
      return p.index === 0 ? 'Diagonale ↘' : 'Diagonale ↙'
  }
}

export function patternToKey(p: Pattern): string {
  switch (p.type) {
    case 'row':
      return `row:${p.index}`
    case 'rows':
      return `rows:${p.indexes.join(',')}`
    case 'column':
      return `column:${p.index}`
    case 'columns':
      return `columns:${p.indexes.join(',')}`
    case 'diagonal':
      return `diagonal:${p.index}`
    default:
      return p.type
  }
}

function clampIndex(arg: string | undefined): number {
  const n = Number(arg)
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 1
}

function parseIndexes(arg: string | undefined): number[] {
  const nums = (arg ?? '')
    .split(',')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 5)
  return nums.length > 0 ? nums : [1]
}

export function keyToPattern(key: string): Pattern {
  const [type, arg] = key.split(':')
  switch (type) {
    case 'row':
      return { type: 'row', index: clampIndex(arg) }
    case 'rows':
      return { type: 'rows', indexes: parseIndexes(arg) }
    case 'column':
      return { type: 'column', index: clampIndex(arg) }
    case 'columns':
      return { type: 'columns', indexes: parseIndexes(arg) }
    case 'diagonal':
      return { type: 'diagonal', index: arg === '1' ? 1 : 0 }
    case 'full-card':
      return { type: 'full-card' }
    case 'any-row':
      return { type: 'any-row' }
    case 'any-column':
      return { type: 'any-column' }
    case 'any-diagonal':
      return { type: 'any-diagonal' }
    default:
      return { type: 'any' }
  }
}

export const PATTERN_PRESETS: { key: string; label: string }[] = [
  { key: 'any', label: '🎯 Freies Bingo' },
  { key: 'full-card', label: '🟩 Volles Blatt' },
  { key: 'any-row', label: '🔀 Beliebige Zeile' },
  { key: 'any-column', label: '🌊 Beliebige Spalte' },
  { key: 'any-diagonal', label: '🌀 Beliebige Diagonale' },
  ...[1, 2, 3, 4, 5].map((i) => ({ key: `row:${i}`, label: `➖ Zeile ${i}` })),
  { key: 'rows:1,5', label: '☰ Zeilen 1 + 5' },
  { key: 'rows:1,3,5', label: '☰ Zeilen 1 + 3 + 5' },
  ...[1, 2, 3, 4, 5].map((i) => ({ key: `column:${i}`, label: `⬇️ Spalte ${i}` })),
  { key: 'columns:1,5', label: '🧱 Spalten 1 + 5' },
  { key: 'diagonal:0', label: '↘️ Diagonale (links oben nach rechts unten)' },
  { key: 'diagonal:1', label: '↙️ Diagonale (rechts oben nach links unten)' },
]
