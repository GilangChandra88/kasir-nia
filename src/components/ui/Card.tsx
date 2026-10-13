import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

type CardProps = ComponentProps<'section'>

export function Card({ className, ...props }: CardProps) {
  return <section className={cn('rounded-3xl bg-card p-5 shadow-soft', className)} {...props} />
}
