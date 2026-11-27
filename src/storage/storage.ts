export interface PersistedState {
  drawn: number[]
  bingoCount: number
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
