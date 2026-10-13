import * as m from 'motion/react-m'

/** Jumlah kepingan confetti. Sedikit saja agar tetap ringan di HP. */
const PIECES = 16
/** Jarak lempar kepingan dari pusat (piksel). */
const NEAR_PX = 90
const FAR_PX = 150
/** Lama terbang kepingan (detik). */
const FLIGHT_SECONDS = 1

const COLORS = ['bg-navy-600', 'bg-success', 'bg-warning', 'bg-navy-100', 'bg-danger'] as const

/**
 * Posisi akhir dihitung sekali saat modul dimuat (bukan acak saat render) agar render tetap murni
 * dan animasinya selalu rapi melingkar.
 */
const BURST = Array.from({ length: PIECES }, (_, index) => {
  const angle = (index / PIECES) * Math.PI * 2
  const distance = index % 2 === 0 ? FAR_PX : NEAR_PX
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: (index % 4) * 90 + 45,
    color: COLORS[index % COLORS.length],
    round: index % 3 === 0,
  }
})

/** Ledakan confetti kecil dari tengah wadah induk (induk harus `relative`). */
export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {BURST.map((piece, index) => (
        <m.span
          key={index}
          className={`absolute top-1/2 left-1/2 size-2.5 ${piece.round ? 'rounded-full' : 'rounded-sm'} ${piece.color}`}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: piece.x, y: piece.y, scale: 1, opacity: 0, rotate: piece.rotate }}
          transition={{ duration: FLIGHT_SECONDS, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
