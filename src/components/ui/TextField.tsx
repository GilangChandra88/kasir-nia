import { type ComponentProps, useId } from 'react'

import { cn } from '@/lib/cn'

export type TextFieldProps = ComponentProps<'input'> & {
  label: string
  hint?: string
  error?: string | null
  /** Teks tetap di kiri isian, mis. "Rp". */
  prefix?: string
  /** Teks tetap di kanan isian, mis. satuan "batang". */
  suffix?: string
}

export function TextField({
  label,
  hint,
  error,
  prefix,
  suffix,
  className,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-pesan`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy-950">
        {label}
      </label>
      <div
        className={cn(
          'flex h-12 items-center gap-2 rounded-2xl border bg-white px-4 transition-colors focus-within:border-navy-600 focus-within:ring-4 focus-within:ring-navy-100',
          error ? 'border-danger' : 'border-line',
        )}
      >
        {prefix && <span className="shrink-0 text-sm font-semibold text-muted">{prefix}</span>}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="h-full w-full min-w-0 bg-transparent text-base text-navy-950 outline-none placeholder:text-muted/70"
          {...props}
        />
        {suffix && <span className="shrink-0 text-sm text-muted">{suffix}</span>}
      </div>
      {message && (
        <p id={messageId} className={cn('mt-1.5 text-sm', error ? 'text-danger' : 'text-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}
