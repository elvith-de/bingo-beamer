import { useBingoStore } from '../store/bingoStore'
import { formatDrawnNumber } from '../utils/bingo'

export default function CurrentNumber() {
  const drawn = useBingoStore((s) => s.drawn)
  const last = drawn[drawn.length - 1]

  return (
    <section className="current-number" aria-live="polite">
      {last === undefined ? (
        <div className="current-number-empty">Noch keine Zahl gezogen – Leertaste drücken</div>
      ) : (
        <div key={last} className="current-number-value">
          {formatDrawnNumber(last)}
        </div>
      )}
    </section>
  )
}
