type ClassValue = string | false | null | undefined

/** Menggabungkan nama kelas; nilai kosong/salah dilewati agar kelas bersyarat ringkas ditulis. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
