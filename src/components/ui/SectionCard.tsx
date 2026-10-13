import type { ReactNode } from 'react'

import { Card } from './Card'

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

/** Kartu berjudul untuk mengelompokkan isian form. */
export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <Card>
      <h2 className="text-base font-bold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </Card>
  )
}
