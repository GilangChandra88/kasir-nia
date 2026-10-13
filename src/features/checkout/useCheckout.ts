import { useState } from 'react'

import { remainingStock, resolveCart } from '@/domain/cart'
import { findProductByBarcode } from '@/domain/inventory'
import { normalizeBarcode } from '@/domain/product'
import type { Product, Variant } from '@/domain/types'
import { useReadySession } from '@/features/auth/useReadySession'
import { useProducts } from '@/features/inventory/useProducts'
import type { ScanFeedback, ScanHandler } from '@/features/scanner/scanFeedback'
import { useCartEntries, useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'

const NO_PRODUCTS: Product[] = []

/**
 * Semua status halaman Kasir: barang, keranjang (dari data terbaru), dan aksi memilih barang lewat
 * ketuk, kamera, atau scanner fisik. Barang berjenis banyak membuka sheet pilih jenis.
 */
export function useCheckout() {
  const { user, store, member } = useReadySession()
  const products = useProducts(store.id)
  const entries = useCartEntries(store.id)
  const showToast = useToastStore((state) => state.show)
  const [variantProduct, setVariantProduct] = useState<Product | null>(null)

  const catalog = products.status === 'ready' ? products.products : NO_PRODUCTS
  const cart = resolveCart(entries, catalog)

  /** Menambah 1 jenis bila stok cukup. */
  const addVariant = (product: Product, variant: Variant): ScanFeedback => {
    if (remainingStock(product, entries) < variant.baseQty) {
      const message = `Stok ${product.name} tidak cukup`
      showToast(message, 'error')
      return { tone: 'error', text: message }
    }
    useCartStore.getState().add(store.id, product.id, variant.id)
    return { tone: 'success', text: `${product.name} · ${variant.label} +1` }
  }

  const pickProduct = (product: Product): ScanFeedback => {
    const [only] = product.variants
    if (product.variants.length === 1 && only) return addVariant(product, only)
    setVariantProduct(product)
    return { tone: 'success', text: `Pilih jenis ${product.name}`, close: true }
  }

  const handleScan: ScanHandler = (raw) => {
    const code = normalizeBarcode(raw)
    const product = findProductByBarcode(catalog, code)
    if (product) return pickProduct(product)
    showToast(`Barcode ${code} belum terdaftar. Daftarkan di menu Stok.`, 'error')
    return { tone: 'error', text: `Barcode ${code} belum terdaftar` }
  }

  return {
    user,
    store,
    member,
    products,
    catalog,
    entries,
    cart,
    variantProduct,
    closeVariant: () => {
      setVariantProduct(null)
    },
    pickVariant: (product: Product, variant: Variant) => {
      addVariant(product, variant)
      setVariantProduct(null)
    },
    pickProduct,
    handleScan,
    setQty: (productId: string, variantId: string, qty: number) => {
      useCartStore.getState().setQty(store.id, productId, variantId, qty)
    },
    clearCart: () => {
      useCartStore.getState().clear(store.id)
    },
  }
}
