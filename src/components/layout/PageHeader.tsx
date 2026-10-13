import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  /** Tombol aksi di kanan judul (opsional). */
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {subtitle && <p className="truncate text-sm font-medium text-muted">{subtitle}</p>}
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      </div>
      {action}
    </header>
  )
}
