import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/cn'

type SpinnerProps = {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return <LoaderCircle className={cn('size-5 animate-spin', className)} aria-hidden="true" />
}
