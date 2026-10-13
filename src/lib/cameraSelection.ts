type CameraInfo = { deviceId: string; label: string }

const BACK_CAMERA = /back|rear|belakang|environment/i
const DIGITS = /\d+/g

/** Nomor kamera = angka TERAKHIR di nama ("camera2 0, facing back" → 0, bukan 2 dari "camera2"). */
function cameraNumber(label: string): number {
  const last = label.match(DIGITS)?.at(-1)
  return last === undefined ? Number.NaN : Number(last)
}

/**
 * Memilih kamera belakang UTAMA. HP Android sering punya beberapa kamera belakang (utama,
 * ultra-wide, makro) yang dinamai "camera2 0, facing back", "camera2 2, facing back", dst.
 * Kamera utama hampir selalu bernomor terkecil dan satu-satunya yang fokus otomatisnya bagus
 * untuk jarak dekat; ultra-wide sering buram saat membaca barcode.
 * Mengembalikan null bila tidak ada kamera belakang yang bisa dikenali dari namanya.
 */
export function pickMainBackCamera(cameras: CameraInfo[]): string | null {
  const back = cameras.filter((camera) => BACK_CAMERA.test(camera.label))
  if (back.length === 0) return null

  const numbered = back
    .map((camera) => ({ camera, number: cameraNumber(camera.label) }))
    .filter(({ number }) => Number.isFinite(number))
    .sort((a, b) => a.number - b.number)

  return (numbered[0]?.camera ?? back[0])?.deviceId ?? null
}
