export const MIN_NUMBER = 1
export const MAX_NUMBER = 75

export interface LetterRange {
  letter: string
  min: number
  max: number
}

export const LETTER_RANGES: LetterRange[] = [
  { letter: 'B', min: 1, max: 15 },
  { letter: 'I', min: 16, max: 30 },
  { letter: 'N', min: 31, max: 45 },
  { letter: 'G', min: 46, max: 60 },
  { letter: 'O', min: 61, max: 75 },
]

export function letterForNumber(n: number): string {
  const range = LETTER_RANGES.find((r) => n >= r.min && n <= r.max)
  if (!range) {
    throw new Error(`Zahl ${n} liegt außerhalb des Bereichs ${MIN_NUMBER}-${MAX_NUMBER}`)
  }
  return range.letter
}

export function formatDrawnNumber(n: number): string {
  return `${letterForNumber(n)}-${n}`
}

export function drawNumber(drawn: number[]): number | null {
  const remaining: number[] = []
  for (let n = MIN_NUMBER; n <= MAX_NUMBER; n++) {
    if (!drawn.includes(n)) {
      remaining.push(n)
    }
  }
  if (remaining.length === 0) {
    return null
  }
  return remaining[Math.floor(Math.random() * remaining.length)]
}

export function numbersInRange(range: LetterRange): number[] {
  const numbers: number[] = []
  for (let n = range.min; n <= range.max; n++) {
    numbers.push(n)
  }
  return numbers
}
