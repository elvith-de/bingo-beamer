import { useCallback, useEffect } from 'react'
import { useBingoStore } from '../store/bingoStore'
import { MAX_NUMBER } from '../utils/bingo'

export default function Controls() {
  const draw = useBingoStore((s) => s.draw)
  const bingo = useBingoStore((s) => s.bingo)
  const undoBingo = useBingoStore((s) => s.undoBingo)
  const newRound = useBingoStore((s) => s.newRound)
  const drawnCount = useBingoStore((s) => s.drawn.length)
  const bingoCount = useBingoStore((s) => s.bingoCount)
  const allDrawn = drawnCount >= MAX_NUMBER

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) {
        return
      }
      if (e.code === 'Space') {
        e.preventDefault()
        draw()
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      } else if (e.key === 'b' || e.key === 'B') {
        bingo()
      } else if (e.key === 'u' || e.key === 'U') {
        undoBingo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [draw, bingo, undoBingo, toggleFullscreen])

  const handleNewRound = () => {
    if (window.confirm('Aktuelle Runde zurücksetzen? Alle gezogenen Zahlen dieser Runde gehen verloren.')) {
      newRound()
    }
  }

  return (
    <div className="controls">
      <button className="btn btn-primary" onClick={draw} disabled={allDrawn}>
        {allDrawn ? 'Alle Zahlen gezogen' : 'Nächste Zahl (Leertaste)'}
      </button>
      <button className="btn btn-bingo" onClick={bingo}>
        Bingo! (B)
      </button>
      <button className="btn" onClick={undoBingo} disabled={bingoCount === 0} title="Letztes Bingo zurücknehmen">
        Bingo rückgängig (U)
      </button>
      <button className="btn" onClick={toggleFullscreen}>
        Vollbild (F)
      </button>
      <button className="btn btn-danger" onClick={handleNewRound}>
        Neue Runde
      </button>
    </div>
  )
}
