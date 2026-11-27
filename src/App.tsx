import { useEffect, useRef, useState } from 'react'
import { useBingoStore } from './store/bingoStore'
import CurrentNumber from './components/CurrentNumber'
import NumberBoard from './components/NumberBoard'
import Controls from './components/Controls'
import BingoOverlay from './components/BingoOverlay'
import BingoCounter from './components/BingoCounter'
import RoundHistory from './components/RoundHistory'
import RulesBar from './components/RulesBar'
import RuleEditor from './components/RuleEditor'

type Theme = 'dark' | 'light'

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [showBingo, setShowBingo] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const bingoCount = useBingoStore((s) => s.bingoCount)
  const lastSeenBingoCount = useRef(bingoCount)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (bingoCount === lastSeenBingoCount.current) {
      return
    }
    const decreased = bingoCount < lastSeenBingoCount.current
    lastSeenBingoCount.current = bingoCount
    if (decreased) {
      setShowBingo(false)
      return
    }
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
          <BingoCounter />
          <button className="btn" onClick={() => setShowRules(true)}>
            Regeln
          </button>
          <button className="btn" onClick={() => setShowHistory(true)}>
            Verlauf
          </button>
          <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Helles Theme' : 'Dunkles Theme'}
          </button>
          <Controls />
        </div>
      </header>
      <RulesBar />
      <main className="app-main">
        <CurrentNumber />
        <NumberBoard />
      </main>
      {showBingo && <BingoOverlay count={bingoCount} onClose={() => setShowBingo(false)} />}
      {showHistory && <RoundHistory onClose={() => setShowHistory(false)} />}
      {showRules && <RuleEditor onClose={() => setShowRules(false)} />}
    </div>
  )
}
