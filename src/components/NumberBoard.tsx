import { useMemo } from 'react'
import { useBingoStore } from '../store/bingoStore'
import { LETTER_RANGES, numbersInRange } from '../utils/bingo'

export default function NumberBoard() {
  const drawn = useBingoStore((s) => s.drawn)
  const drawnSet = useMemo(() => new Set(drawn), [drawn])

  return (
    <section className="board" aria-label="Historie der gezogenen Zahlen dieser Runde">
      {LETTER_RANGES.map((range) => (
        <div className="board-column" key={range.letter}>
          <div className="board-letter">{range.letter}</div>
          {numbersInRange(range).map((n) => (
            <div key={n} className={drawnSet.has(n) ? 'cell drawn' : 'cell'}>
              {n}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
