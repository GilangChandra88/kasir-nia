import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type SettingRowProps = {
  icon: LucideIcon
  label: string
  description?: string
  /** Isi di sisi kanan: lencana, saklar, atau panah. */
  trailing?: ReactNode
}

/**
 * Satu baris pengaturan di Profil. Pengaturan baru ke depan cukup menambah satu baris ini.
 */
export function SettingRow({ icon: Icon, label, description, trailing }: SettingRowProps) {
  return (
    <div className="flex min-h-14 items-center gap-3 py-2">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-navy-50 text-navy-600">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{label}</p>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {trailing}
    </div>
  )
}
