import { useState } from 'react'
import { useBingoStore } from '../store/bingoStore'
import { defaultRules, keyToPattern, PATTERN_PRESETS, patternToKey, type RuleStep } from '../utils/rules'

interface RuleEditorProps {
  onClose: () => void
}

export default function RuleEditor({ onClose }: RuleEditorProps) {
  const rules = useBingoStore((s) => s.rules)
  const setRules = useBingoStore((s) => s.setRules)
  const [steps, setSteps] = useState<RuleStep[]>(rules)

  const update = (next: RuleStep[]) => {
    setSteps(next)
    setRules(next)
  }

  const changePattern = (id: string, key: string) => {
    update(steps.map((s) => (s.id === id ? { ...s, pattern: keyToPattern(key) } : s)))
  }

  const remove = (id: string) => {
    update(steps.filter((s) => s.id !== id))
  }

  const move = (id: string, dir: -1 | 1) => {
    const i = steps.findIndex((s) => s.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= steps.length) {
      return
    }
    const next = [...steps]
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
    update(next)
  }

  const add = () => {
    update([...steps, { id: crypto.randomUUID(), pattern: { type: 'any' } }])
  }

  const reset = () => {
    update(defaultRules())
  }

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Bingo-Regeln bearbeiten">
        <div className="history-header">
          <h2>Bingo-Regeln dieser Runde</h2>
          <button className="btn" onClick={onClose}>
            Schließen
          </button>
        </div>
        <p className="history-current">
          Die Regeln werden in dieser Reihenfolge abgearbeitet – pro erfüllter Regel gibt es ein Bingo. Reihenfolge per
          ↑/↓ änderbar; der Fortschritt bleibt pro Regel erhalten.
        </p>
        <ul className="rule-editor-list">
          {steps.map((s, i) => (
            <li key={s.id} className="rule-editor-row">
              <span className="rule-editor-pos">{i + 1}.</span>
              <select value={patternToKey(s.pattern)} onChange={(e) => changePattern(s.id, e.target.value)}>
                {PATTERN_PRESETS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="rule-editor-actions">
                <button className="btn btn-small" onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Nach oben">
                  ↑
                </button>
                <button
                  className="btn btn-small"
                  onClick={() => move(s.id, 1)}
                  disabled={i === steps.length - 1}
                  aria-label="Nach unten"
                >
                  ↓
                </button>
                <button className="btn btn-small btn-danger" onClick={() => remove(s.id)} aria-label="Regel entfernen">
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="history-export">
          <button className="btn btn-primary" onClick={add}>
            + Regel hinzufügen
          </button>
          <button className="btn" onClick={reset}>
            Standard zurücksetzen
          </button>
        </div>
      </div>
    </div>
  )
}
