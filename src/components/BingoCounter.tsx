import { useBingoStore } from '../store/bingoStore'

export default function BingoCounter() {
  const bingoCount = useBingoStore((s) => s.bingoCount)

  return (
    <div className="bingo-counter" title="Bingos in der aktuellen Runde">
      Bingo(s): <strong>{bingoCount}</strong>
    </div>
  )
}
