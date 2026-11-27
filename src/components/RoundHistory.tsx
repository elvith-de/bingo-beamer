import { useState } from 'react'
import { useBingoStore } from '../store/bingoStore'
import { formatDrawnNumber } from '../utils/bingo'
import { buildExport, downloadFile, exportTimestamp, toCsv, toJson } from '../utils/export'
import { patternIcon, patternLabel } from '../utils/rules'

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
}

function formatDuration(startedAt: number, endedAt: number): string {
  const minutes = Math.round((endedAt - startedAt) / 60000)
  if (minutes < 1) {
    return '< 1 Min'
  }
  if (minutes < 60) {
    return `${minutes} Min`
  }
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`
}

interface RoundHistoryProps {
  onClose: () => void
}

export default function RoundHistory({ onClose }: RoundHistoryProps) {
  const drawn = useBingoStore((s) => s.drawn)
  const bingoCount = useBingoStore((s) => s.bingoCount)
  const roundStartedAt = useBingoStore((s) => s.roundStartedAt)
  const rounds = useBingoStore((s) => s.rounds)
  const rules = useBingoStore((s) => s.rules)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const numberedRounds = rounds.map((r, i) => ({ ...r, number: i + 1 })).reverse()

  const handleExportJson = () => {
    const data = buildExport(drawn, bingoCount, roundStartedAt, rounds, rules)
    downloadFile(`bingo-export-${exportTimestamp()}.json`, toJson(data), 'application/json')
  }

  const handleExportCsv = () => {
    const data = buildExport(drawn, bingoCount, roundStartedAt, rounds, rules)
    downloadFile(`bingo-export-${exportTimestamp()}.csv`, toCsv(data), 'text/csv')
  }

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Runden-Verlauf">
        <div className="history-header">
          <h2>Runden-Verlauf</h2>
          <button className="btn" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="history-export">
          <button className="btn" onClick={handleExportJson}>
            JSON exportieren
          </button>
          <button className="btn" onClick={handleExportCsv}>
            CSV exportieren
          </button>
        </div>
        <p className="history-current">
          <strong>Aktuelle Runde</strong> – gestartet {formatDateTime(roundStartedAt)} · {drawn.length} Zahlen gezogen ·{' '}
          {bingoCount} Bingo(s)
        </p>
        {numberedRounds.length === 0 ? (
          <p className="history-empty">Noch keine abgeschlossenen Runden.</p>
        ) : (
          <ul className="history-list">
            {numberedRounds.map((r) => (
              <li key={r.id} className="history-item">
                <button
                  className="history-item-header"
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  aria-expanded={expandedId === r.id}
                >
                  <span className="history-round-name">Runde #{r.number}</span>
                  <span>
                    {formatDateTime(r.startedAt)} – {formatDateTime(r.endedAt)}
                  </span>
                  <span>{formatDuration(r.startedAt, r.endedAt)}</span>
                  <span>{r.drawn.length} Zahlen</span>
                  <span>{r.bingoCount} Bingo(s)</span>
                </button>
                {r.rules && r.rules.length > 0 && (
                  <div className="history-rules">
                    {r.rules.map((step) => (
                      <span
                        key={step.id}
                        className={r.completedRuleIds?.includes(step.id) ? 'chip' : 'chip chip-pending'}
                      >
                        {patternIcon(step.pattern)} {patternLabel(step.pattern)}
                      </span>
                    ))}
                  </div>
                )}
                {expandedId === r.id && (
                  <div className="history-chips">
                    {r.drawn.map((n) => (
                      <span key={n} className="chip">
                        {formatDrawnNumber(n)}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
