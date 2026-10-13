import wasmUrl from 'zxing-wasm/reader/zxing_reader.wasm?url'

import { SCAN_FORMATS } from '@/config/scanner'

export type Detector = { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> }

/**
 * Pendeteksi barcode: bawaan browser bila ada (Chrome Android — cepat, tanpa unduhan), atau
 * polyfill zxing-wasm (± 1 MB) yang dimuat malas hanya di browser yang belum punya.
 * File wasm disajikan dari situs sendiri, bukan CDN, agar tetap jalan di jaringan terbatas.
 */
export async function createBarcodeDetector(): Promise<Detector> {
  // Polyfill hanya memasang `globalThis.BarcodeDetector` bila browser belum punya.
  const { prepareZXingModule } = await import('barcode-detector/polyfill')
  prepareZXingModule({
    overrides: {
      locateFile: (path: string, prefix: string) =>
        path.endsWith('.wasm') ? wasmUrl : prefix + path,
    },
  })

  const supported: readonly string[] = await BarcodeDetector.getSupportedFormats()
  const formats = SCAN_FORMATS.filter((format) => supported.includes(format))
  if (formats.length > 0) return new BarcodeDetector({ formats })

  // Ada bawaan browser tapi tanpa format yang kita butuhkan (mis. sebagian desktop) → pakai zxing.
  const { BarcodeDetector: ZXingDetector } = await import('barcode-detector/ponyfill')
  return new ZXingDetector({ formats: [...SCAN_FORMATS] })
}
