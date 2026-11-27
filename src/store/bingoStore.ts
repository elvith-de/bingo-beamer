import { create } from 'zustand'
import { loadPersisted, savePersisted, type ArchivedRound } from '../storage/storage'
import { drawNumber } from '../utils/bingo'
import { defaultRules, type RuleStep } from '../utils/rules'

interface BingoStore {
  drawn: number[]
  bingoCount: number
  roundStartedAt: number
  rounds: ArchivedRound[]
  rules: RuleStep[]
  completedRuleIds: string[]
  draw: () => void
  bingo: () => void
  undoBingo: () => void
  newRound: () => void
  setRules: (rules: RuleStep[]) => void
}

const persisted = loadPersisted()

export const useBingoStore = create<BingoStore>((set, get) => ({
  drawn: persisted?.drawn ?? [],
  bingoCount: persisted?.bingoCount ?? 0,
  roundStartedAt: persisted?.roundStartedAt ?? Date.now(),
  rounds: persisted?.rounds ?? [],
  rules: persisted?.rules ?? defaultRules(),
  completedRuleIds: persisted?.completedRuleIds ?? [],
  draw: () => {
    const { drawn, bingoCount, roundStartedAt, rounds, rules, completedRuleIds } = get()
    const next = drawNumber(drawn)
    if (next === null) {
      return
    }
    const newDrawn = [...drawn, next]
    savePersisted({ drawn: newDrawn, bingoCount, roundStartedAt, rounds, rules, completedRuleIds })
    set({ drawn: newDrawn })
  },
  bingo: () => {
    const { drawn, bingoCount, roundStartedAt, rounds, rules, completedRuleIds } = get()
    const nextStep = rules.find((r) => !completedRuleIds.includes(r.id))
    const newCompletedRuleIds = nextStep ? [...completedRuleIds, nextStep.id] : completedRuleIds
    const newBingoCount = bingoCount + 1
    savePersisted({
      drawn,
      bingoCount: newBingoCount,
      roundStartedAt,
      rounds,
      rules,
      completedRuleIds: newCompletedRuleIds,
    })
    set({ bingoCount: newBingoCount, completedRuleIds: newCompletedRuleIds })
  },
  undoBingo: () => {
    const { drawn, bingoCount, roundStartedAt, rounds, rules, completedRuleIds } = get()
    if (bingoCount === 0) {
      return
    }
    const newBingoCount = bingoCount - 1
    const newCompletedRuleIds =
      completedRuleIds.length > newBingoCount ? completedRuleIds.slice(0, -1) : completedRuleIds
    savePersisted({
      drawn,
      bingoCount: newBingoCount,
      roundStartedAt,
      rounds,
      rules,
      completedRuleIds: newCompletedRuleIds,
    })
    set({ bingoCount: newBingoCount, completedRuleIds: newCompletedRuleIds })
  },
  newRound: () => {
    const { drawn, bingoCount, roundStartedAt, rounds, rules, completedRuleIds } = get()
    const newRounds: ArchivedRound[] =
      drawn.length > 0
        ? [
            ...rounds,
            {
              id: crypto.randomUUID(),
              startedAt: roundStartedAt,
              endedAt: Date.now(),
              drawn,
              bingoCount,
              rules,
              completedRuleIds,
            },
          ]
        : rounds
    const newStartedAt = Date.now()
    savePersisted({
      drawn: [],
      bingoCount: 0,
      roundStartedAt: newStartedAt,
      rounds: newRounds,
      rules,
      completedRuleIds: [],
    })
    set({ drawn: [], bingoCount: 0, roundStartedAt: newStartedAt, rounds: newRounds, completedRuleIds: [] })
  },
  setRules: (rules) => {
    const { drawn, bingoCount, roundStartedAt, rounds, completedRuleIds } = get()
    const validIds = new Set(rules.map((r) => r.id))
    const newCompletedRuleIds = completedRuleIds.filter((id) => validIds.has(id))
    savePersisted({ drawn, bingoCount, roundStartedAt, rounds, rules, completedRuleIds: newCompletedRuleIds })
    set({ rules, completedRuleIds: newCompletedRuleIds })
  },
}))
