interface BingoOverlayProps {
  count: number
  onClose: () => void
}

export default function BingoOverlay({ count, onClose }: BingoOverlayProps) {
  return (
    <div className="bingo-overlay" onClick={onClose} role="alert">
      <div className="bingo-text">BINGO!</div>
      <div className="bingo-count">Bingo Nr. {count} in dieser Runde</div>
    </div>
  )
}
