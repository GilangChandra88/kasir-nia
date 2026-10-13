/** Kode terakhir yang diterima kamera beserta waktunya (milidetik). */
export type ScanGate = { code: string; at: number } | null

export type ScanDecision = { accepted: boolean; gate: ScanGate }

/**
 * Menyaring pembacaan ulang kamera: kode yang sama dalam `windowMs` (milidetik) ditolak, dan
 * waktunya diperbarui — jadi barcode yang terus terlihat di kamera tidak masuk berkali-kali.
 * Kode berbeda selalu diterima. (Scanner fisik tidak memakai ini: setiap tembakan disengaja.)
 */
export function acceptScan(
  gate: ScanGate,
  code: string,
  now: number,
  windowMs: number,
): ScanDecision {
  const isRepeat = gate !== null && gate.code === code && now - gate.at < windowMs
  return { accepted: !isRepeat, gate: { code, at: now } }
}
