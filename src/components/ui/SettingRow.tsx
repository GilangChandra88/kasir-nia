import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

type SettingRowProps = {
  icon: LucideIcon
  label: string
  description?: string
  /** Isi di sisi kanan: lencana, saklar, atau panah. */
  trailing?: ReactNode
  /** Bila diisi, seluruh baris menjadi tautan ke halaman ini (dengan panah di kanan). */
  to?: string
}

/**
 * Satu baris pengaturan di Profil. Pengaturan baru ke depan cukup menambah satu baris ini.
 */
export function SettingRow({ icon: Icon, label, description, trailing, to }: SettingRowProps) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-navy-50 text-navy-600">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        {description && <span className="block text-sm text-muted">{description}</span>}
      </span>
      {trailing}
      {to && <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden="true" />}
    </>
  )

  const className = 'flex min-h-14 items-center gap-3 py-2'
  return to ? (
    <Link
      to={to}
      className={`${className} -mx-2 rounded-2xl px-2 transition-colors hover:bg-navy-50`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}
