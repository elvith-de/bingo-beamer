import { create } from 'zustand'
import { loadPersisted, savePersisted, type ArchivedRound } from '../storage/storage'
import { drawNumber } from '../utils/bingo'

interface BingoStore {
  drawn: number[]
  bingoCount: number
  roundStartedAt: number
  rounds: ArchivedRound[]
  draw: () => void
  bingo: () => void
  newRound: () => void
}

const persisted = loadPersisted()

export const useBingoStore = create<BingoStore>((set, get) => ({
  drawn: persisted?.drawn ?? [],
  bingoCount: persisted?.bingoCount ?? 0,
  roundStartedAt: persisted?.roundStartedAt ?? Date.now(),
  rounds: persisted?.rounds ?? [],
  draw: () => {
    const { drawn, bingoCount, roundStartedAt, rounds } = get()
    const next = drawNumber(drawn)
    if (next === null) {
      return
    }
    const newDrawn = [...drawn, next]
    savePersisted({ drawn: newDrawn, bingoCount, roundStartedAt, rounds })
    set({ drawn: newDrawn })
  },
  bingo: () => {
    const { drawn, bingoCount, roundStartedAt, rounds } = get()
    const newBingoCount = bingoCount + 1
    savePersisted({ drawn, bingoCount: newBingoCount, roundStartedAt, rounds })
    set({ bingoCount: newBingoCount })
  },
  newRound: () => {
    const { drawn, bingoCount, roundStartedAt, rounds } = get()
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
            },
          ]
        : rounds
    const newStartedAt = Date.now()
    savePersisted({ drawn: [], bingoCount: 0, roundStartedAt: newStartedAt, rounds: newRounds })
    set({ drawn: [], bingoCount: 0, roundStartedAt: newStartedAt, rounds: newRounds })
  },
}))
