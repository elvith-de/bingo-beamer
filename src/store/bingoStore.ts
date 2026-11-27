import { create } from 'zustand'
import { loadPersisted, savePersisted } from '../storage/storage'
import { drawNumber } from '../utils/bingo'

interface BingoStore {
  drawn: number[]
  bingoCount: number
  draw: () => void
  bingo: () => void
  newRound: () => void
}

const persisted = loadPersisted()

export const useBingoStore = create<BingoStore>((set, get) => ({
  drawn: persisted?.drawn ?? [],
  bingoCount: persisted?.bingoCount ?? 0,
  draw: () => {
    const { drawn, bingoCount } = get()
    const next = drawNumber(drawn)
    if (next === null) {
      return
    }
    const newDrawn = [...drawn, next]
    savePersisted({ drawn: newDrawn, bingoCount })
    set({ drawn: newDrawn })
  },
  bingo: () => {
    const { drawn, bingoCount } = get()
    const newBingoCount = bingoCount + 1
    savePersisted({ drawn, bingoCount: newBingoCount })
    set({ bingoCount: newBingoCount })
  },
  newRound: () => {
    savePersisted({ drawn: [], bingoCount: 0 })
    set({ drawn: [], bingoCount: 0 })
  },
}))
