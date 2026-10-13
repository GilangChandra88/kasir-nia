/**
 * Palet warna aplikasi — SATU-SATUNYA tempat nilai hex di `src/`.
 * Wajib sama dengan token `--color-*` di `src/styles/index.css` (dijaga palette.test.ts).
 * Nama token `navy950` menjadi kelas Tailwind `navy-950` (`bg-navy-950`, `text-navy-950`).
 */
export const PALETTE = {
  // Navy: identitas utama
  navy950: '#0B1B3A',
  navy800: '#14285A',
  navy600: '#2347A8',
  navy100: '#E3EAFB',
  navy50: '#F1F5FE',

  // Netral
  paper: '#F5F7FC',
  card: '#FFFFFF',
  white: '#FFFFFF',
  line: '#E2E8F3',
  muted: '#64748B',

  // Status
  success: '#16A37A',
  warning: '#E8A317',
  danger: '#D64545',
} as const

export type PaletteToken = keyof typeof PALETTE
