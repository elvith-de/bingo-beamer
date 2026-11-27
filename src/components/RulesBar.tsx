import { useBingoStore } from '../store/bingoStore'
import { patternIcon, patternLabel } from '../utils/rules'

export default function RulesBar() {
  const rules = useBingoStore((s) => s.rules)
  const completedRuleIds = useBingoStore((s) => s.completedRuleIds)

  if (rules.length === 0) {
    return null
  }
  const currentId = rules.find((r) => !completedRuleIds.includes(r.id))?.id

  return (
    <div className="rules-bar" aria-label="Bingo-Regeln dieser Runde">
      {rules.map((step) => {
        const completed = completedRuleIds.includes(step.id)
        const current = step.id === currentId
        const classes = ['rule-chip', completed ? 'completed' : '', current ? 'current' : ''].filter(Boolean).join(' ')
        return (
          <span key={step.id} className={classes}>
            <span className="rule-icon" aria-hidden="true">
              {patternIcon(step.pattern)}
            </span>
            <span>{patternLabel(step.pattern)}</span>
            {completed && (
              <span className="rule-check" aria-label="erfüllt">
                ✓
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
