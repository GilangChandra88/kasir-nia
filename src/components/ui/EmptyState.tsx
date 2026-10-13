import type { ReactNode } from 'react'

import { Mascot } from '@/components/brand/Mascot'

type EmptyStateProps = {
  title: string
  description: string
  children?: ReactNode
}

/** Status kosong yang ramah, dengan maskot melayang. */
export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="relative mb-6 grid place-items-center">
        <div className="absolute size-32 rounded-full bg-navy-100" />
        <Mascot className="relative w-20" />
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 max-w-72 text-sm text-muted">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
