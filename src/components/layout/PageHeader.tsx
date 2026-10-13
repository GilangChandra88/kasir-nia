import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

type PageHeaderProps = {
  title: string
  subtitle?: string
  /** Tombol aksi di kanan judul (opsional). */
  action?: ReactNode
  /** Bila diisi, tampil tombol kembali ke alamat ini. */
  backTo?: string
}

export function PageHeader({ title, subtitle, action, backTo }: PageHeaderProps) {
  return (
    <header className="mb-5 flex items-end justify-between gap-4">
      <div className="flex min-w-0 items-center gap-1">
        {backTo && (
          <Link
            to={backTo}
            aria-label="Kembali"
            className="-ml-2 grid size-10 shrink-0 place-items-center rounded-full text-navy-800 hover:bg-navy-50"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </Link>
        )}
        <div className="min-w-0">
          {subtitle && <p className="truncate text-sm font-medium text-muted">{subtitle}</p>}
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{title}</h1>
        </div>
      </div>
      {action}
    </header>
  )
}
