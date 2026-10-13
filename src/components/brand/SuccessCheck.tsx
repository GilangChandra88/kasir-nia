import * as m from 'motion/react-m'

/** Durasi menggambar lingkaran & centang (detik). */
const CIRCLE_SECONDS = 0.45
const CHECK_SECONDS = 0.3

/** Lingkaran hijau yang "tergambar" lalu centang muncul — tanda transaksi berhasil. */
export function SuccessCheck() {
  return (
    <svg viewBox="0 0 96 96" className="size-28" aria-hidden="true">
      <circle cx="48" cy="48" r="44" className="fill-success/10" />
      <m.circle
        cx="48"
        cy="48"
        r="40"
        className="fill-none stroke-success"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: CIRCLE_SECONDS, ease: 'easeOut' }}
      />
      <m.path
        d="M30 50l12 12 24-26"
        className="fill-none stroke-success"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: CHECK_SECONDS, delay: CIRCLE_SECONDS, ease: 'easeOut' }}
      />
    </svg>
  )
}
