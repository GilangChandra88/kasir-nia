import { cn } from '@/lib/cn'

import { SELF_ORIGIN, Sparkle } from './Sparkle'

type MascotProps = {
  className?: string
}

/**
 * Maskot "Struk": kertas struk tersenyum yang melayang & berkedip.
 * Murni CSS (transform/opacity) agar ringan dan tetap jalan tanpa JavaScript animasi.
 */
export function Mascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 200 240" className={cn('overflow-visible', className)} aria-hidden="true">
      <ellipse
        cx="100"
        cy="228"
        rx="54"
        ry="7"
        className={cn('animate-shadow fill-navy-950/10', SELF_ORIGIN)}
      />

      <g className="animate-float">
        <path
          d="M20 36q0-16 16-16h128q16 0 16 16v164l-20-14-20 14-20-14-20 14-20-14-20 14-20-14-20 14z"
          className="fill-white stroke-navy-950"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        <g className={cn('animate-blink fill-navy-950', SELF_ORIGIN)}>
          <circle cx="72" cy="86" r="9" />
          <circle cx="128" cy="86" r="9" />
        </g>
        <circle cx="56" cy="108" r="8" className="fill-navy-100" />
        <circle cx="144" cy="108" r="8" className="fill-navy-100" />
        <path
          d="M86 104q14 14 28 0"
          className="fill-none stroke-navy-950"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <g className="fill-navy-600">
          <rect x="62" y="134" width="5" height="28" rx="1.5" />
          <rect x="73" y="134" width="9" height="28" rx="1.5" />
          <rect x="88" y="134" width="4" height="28" rx="1.5" />
          <rect x="98" y="134" width="8" height="28" rx="1.5" />
          <rect x="112" y="134" width="4" height="28" rx="1.5" />
          <rect x="122" y="134" width="8" height="28" rx="1.5" />
          <rect x="135" y="134" width="4" height="28" rx="1.5" />
        </g>
      </g>

      <Sparkle x={178} y={30} className="animate-twinkle" />
      <Sparkle x={8} y={150} className="animate-twinkle [animation-delay:1.2s]" />
    </svg>
  )
}
