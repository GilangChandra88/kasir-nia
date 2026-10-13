import { BEEP_DURATION_MS, BEEP_FREQUENCY_HZ, BEEP_VOLUME, SCAN_VIBRATE_MS } from '@/config/scanner'

let audioContext: AudioContext | null = null

/**
 * Menyiapkan suara. Browser hanya mengizinkan audio setelah sentuhan pengguna, jadi panggil ini
 * di dalam penanganan klik (mis. saat tombol scan ditekan).
 */
export function unlockAudio(): void {
  try {
    audioContext ??= new AudioContext()
    if (audioContext.state === 'suspended') void audioContext.resume()
  } catch {
    // Perangkat tanpa Web Audio: scan tetap jalan tanpa bunyi.
    audioContext = null
  }
}

/** Bunyi "bip" pendek ala mesin kasir, dibuat langsung tanpa file suara. */
export function playBeep(): void {
  if (!audioContext) return
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const start = audioContext.currentTime
  const end = start + BEEP_DURATION_MS / 1000

  oscillator.type = 'square'
  oscillator.frequency.value = BEEP_FREQUENCY_HZ
  gain.gain.setValueAtTime(BEEP_VOLUME, start)
  // Ekor menurun agar tidak terdengar "klik" saat berhenti.
  gain.gain.exponentialRampToValueAtTime(0.001, end)
  oscillator.connect(gain).connect(audioContext.destination)
  oscillator.start(start)
  oscillator.stop(end)
}

/** Getar singkat bila HP mendukung (Android Chrome ya, iPhone tidak). */
export function vibrate(): void {
  if ('vibrate' in navigator) navigator.vibrate(SCAN_VIBRATE_MS)
}
