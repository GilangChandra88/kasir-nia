import { type ComponentProps, useId } from 'react'

import { cn } from '@/lib/cn'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  hint?: string
  error?: string | null
}

export function TextField({ label, hint, error, className, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-pesan`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy-950">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          'h-12 w-full rounded-2xl border bg-white px-4 text-base text-navy-950 transition-colors outline-none placeholder:text-muted/70 focus:border-navy-600 focus:ring-4 focus:ring-navy-100',
          error ? 'border-danger' : 'border-line',
        )}
        {...props}
      />
      {message && (
        <p id={messageId} className={cn('mt-1.5 text-sm', error ? 'text-danger' : 'text-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}
