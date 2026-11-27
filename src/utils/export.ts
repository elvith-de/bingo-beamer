import type { ArchivedRound } from '../storage/storage'
import { formatDrawnNumber } from './bingo'

export interface RoundExport {
  round: string
  startedAt: string
  endedAt: string | null
  durationMinutes: number | null
  drawnCount: number
  bingoCount: number
  drawnNumbers: string
}

export interface ExportData {
  exportedAt: string
  currentRound: RoundExport
  rounds: RoundExport[]
}

function roundToExport(
  label: string,
  startedAt: number,
  endedAt: number | null,
  drawn: number[],
  bingoCount: number,
): RoundExport {
  return {
    round: label,
    startedAt: new Date(startedAt).toISOString(),
    endedAt: endedAt === null ? null : new Date(endedAt).toISOString(),
    durationMinutes: endedAt === null ? null : Math.round(((endedAt - startedAt) / 60000) * 10) / 10,
    drawnCount: drawn.length,
    bingoCount,
    drawnNumbers: drawn.map(formatDrawnNumber).join('; '),
  }
}

export function buildExport(
  drawn: number[],
  bingoCount: number,
  roundStartedAt: number,
  rounds: ArchivedRound[],
): ExportData {
  return {
    exportedAt: new Date().toISOString(),
    currentRound: roundToExport('aktuell', roundStartedAt, null, drawn, bingoCount),
    rounds: rounds.map((r, i) => roundToExport(`Runde ${i + 1}`, r.startedAt, r.endedAt, r.drawn, r.bingoCount)),
  }
}

export function toJson(data: ExportData): string {
  return JSON.stringify(data, null, 2)
}

export function toCsv(data: ExportData): string {
  const header = 'round;started_at;ended_at;duration_min;drawn_count;bingo_count;drawn_numbers'
  const rows = [data.currentRound, ...data.rounds].map((r) =>
    [r.round, r.startedAt, r.endedAt ?? '', r.durationMinutes ?? '', r.drawnCount, r.bingoCount, `"${r.drawnNumbers}"`].join(';'),
  )
  return [header, ...rows].join('\n')
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-')
}
