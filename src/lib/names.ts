/** Nama depan untuk sapaan ("Gilang Chandra" → "Gilang"). Kosong → "Kak" agar tetap ramah. */
export function firstName(displayName: string): string {
  const [first = ''] = displayName.trim().split(/\s+/)
  return first === '' ? 'Kak' : first
}

/** Inisial maksimal 2 huruf untuk avatar cadangan ("gilang chandra" → "GC"). */
export function initials(displayName: string): string {
  const letters = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
  return letters === '' ? '?' : letters
}
