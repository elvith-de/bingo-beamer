import { useEffect, useRef, useState } from 'react'
import { useBingoStore } from './store/bingoStore'
import CurrentNumber from './components/CurrentNumber'
import NumberBoard from './components/NumberBoard'
import Controls from './components/Controls'
import BingoOverlay from './components/BingoOverlay'

type Theme = 'dark' | 'light'

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [showBingo, setShowBingo] = useState(false)
  const bingoCount = useBingoStore((s) => s.bingoCount)
  const lastSeenBingoCount = useRef(bingoCount)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (bingoCount === lastSeenBingoCount.current) {
      return
    }
    lastSeenBingoCount.current = bingoCount
    if (bingoCount === 0) {
      return
    }
    setShowBingo(true)
    const timer = window.setTimeout(() => setShowBingo(false), 2500)
    return () => window.clearTimeout(timer)
  }, [bingoCount])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bingo Beamer</h1>
        <div className="header-actions">
          <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Helles Theme' : 'Dunkles Theme'}
          </button>
          <Controls />
        </div>
      </header>
      <main className="app-main">
        <CurrentNumber />
        <NumberBoard />
      </main>
      {showBingo && <BingoOverlay count={bingoCount} onClose={() => setShowBingo(false)} />}
    </div>
  )
}
