import { Search, X } from 'lucide-react'
import type { ComponentProps } from 'react'

type SearchFieldProps = Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'type'> & {
  value: string
  onValueChange: (value: string) => void
  /** Nama untuk pembaca layar, karena kolom cari tidak punya label terlihat. */
  label: string
}

export function SearchField({ value, onValueChange, label, ...props }: SearchFieldProps) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-2xl border border-line bg-white px-4 shadow-soft transition-colors focus-within:border-navy-600 focus-within:ring-4 focus-within:ring-navy-100">
      <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value)
        }}
        className="h-full w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value !== '' && (
        <button
          type="button"
          aria-label="Hapus pencarian"
          onClick={() => {
            onValueChange('')
          }}
          className="-mr-2 grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-navy-50"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
