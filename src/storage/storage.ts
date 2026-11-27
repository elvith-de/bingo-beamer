export interface ArchivedRound {
  id: string
  startedAt: number
  endedAt: number
  drawn: number[]
  bingoCount: number
}

export interface PersistedState {
  drawn: number[]
  bingoCount: number
  roundStartedAt: number
  rounds: ArchivedRound[]
}

const STORAGE_KEY = 'bingo-beamer:v1'

export function loadPersisted(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    if (!Array.isArray(parsed.drawn)) {
      return null
    }
    return {
      drawn: parsed.drawn.filter((n): n is number => typeof n === 'number'),
      bingoCount: typeof parsed.bingoCount === 'number' ? parsed.bingoCount : 0,
      roundStartedAt: typeof parsed.roundStartedAt === 'number' ? parsed.roundStartedAt : Date.now(),
      rounds: Array.isArray(parsed.rounds)
        ? parsed.rounds.filter((r): r is ArchivedRound => typeof r === 'object' && r !== null && Array.isArray(r.drawn))
        : [],
    }
  } catch {
    return null
  }
}

export function savePersisted(state: PersistedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Persistenz nicht möglich – die Anzeige funktioniert trotzdem
  }
}
