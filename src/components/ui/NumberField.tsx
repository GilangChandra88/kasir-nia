import { formatNumber, parseDigits } from '@/domain/money'

import { TextField, type TextFieldProps } from './TextField'

type NumberFieldProps = Omit<TextFieldProps, 'value' | 'onChange' | 'inputMode' | 'type'> & {
  value: number | null
  onValueChange: (value: number | null) => void
  /** Tampilkan pemisah ribuan (untuk harga & stok besar). */
  grouping?: boolean
}

/**
 * Isian angka bulat untuk HP: keyboard angka, hanya digit yang diterima, dan nilai disimpan
 * sebagai `number | null` (kosong) — bukan teks.
 */
export function NumberField({ value, onValueChange, grouping = true, ...props }: NumberFieldProps) {
  const display = value === null ? '' : grouping ? formatNumber(value) : String(value)

  return (
    <TextField
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={display}
      onChange={(event) => {
        onValueChange(parseDigits(event.target.value))
      }}
      className={props.className}
    />
  )
}
