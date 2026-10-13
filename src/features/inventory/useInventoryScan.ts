import { useNavigate } from 'react-router'

import { newProductPath, productEditPath } from '@/config/routes'
import { findProductByBarcode } from '@/domain/inventory'
import { normalizeBarcode } from '@/domain/product'
import type { Product } from '@/domain/types'
import { useHardwareScanner } from '@/lib/useHardwareScanner'
import { useToastStore } from '@/store/toastStore'

type UseInventoryScanOptions = {
  products: Product[]
  /** Pemilik: buka/daftarkan barang. Kasir: hanya mencari. */
  editable: boolean
  /** Dipakai kasir: tampilkan barang lewat kolom cari. */
  onSearch: (text: string) => void
}

/**
 * Hasil scan di halaman Stok (kamera atau scanner fisik):
 * barcode dikenal → buka barangnya; barcode baru → pemilik langsung ke form tambah barang.
 */
export function useInventoryScan({ products, editable, onSearch }: UseInventoryScanOptions) {
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)

  const handleScan = (raw: string) => {
    const code = normalizeBarcode(raw)
    const found = findProductByBarcode(products, code)

    if (found && editable) {
      void navigate(productEditPath(found.id))
    } else if (found) {
      onSearch(code)
    } else if (editable) {
      showToast('Barcode belum terdaftar. Yuk tambahkan barangnya!', 'info')
      void navigate(newProductPath(code))
    } else {
      showToast(`Barcode ${code} belum terdaftar di toko ini.`, 'info')
    }
  }

  useHardwareScanner(handleScan)
  return handleScan
}
