import { z } from 'zod'

import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/config/limits'
import { DEFAULT_RECEIPT_SETTINGS } from '@/config/receipt'
import type { Product, StoreInfo, UserProfile } from '@/domain/types'

export const roleSchema = z.enum(['owner', 'cashier'])

/** Dokumen `users/{uid}`. Field lain (nama, email) hanya untuk dibaca manusia di Console. */
export const userDocSchema = z.object({
  storeId: z.string().min(1),
  role: roleSchema,
}) satisfies z.ZodType<UserProfile>

/** Dokumen `stores/{storeId}` (bagian yang dipakai aplikasi). */
export const storeDocSchema = z.object({
  name: z.string().min(1),
  ownerUid: z.string().min(1),
  address: z.string().nullish(),
  phone: z.string().nullish(),
  lowStockThreshold: z.number().int().min(0).catch(DEFAULT_LOW_STOCK_THRESHOLD),
  // Pengaturan struk rusak/tidak ada → pakai bawaan, jangan sampai toko gagal dibuka.
  receipt: z
    .object({
      headerNote: z.string().nullable().catch(null),
      footerNote: z.string().catch(DEFAULT_RECEIPT_SETTINGS.footerNote),
      showCashier: z.boolean().catch(DEFAULT_RECEIPT_SETTINGS.showCashier),
    })
    .catch({ ...DEFAULT_RECEIPT_SETTINGS }),
})

const nonNegativeInt = z.number().int().min(0)

const variantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  price: nonNegativeInt,
  baseQty: z.number().int().min(1),
})

/** Dokumen `stores/{storeId}/products/{productId}`. */
export const productDocSchema = z.object({
  name: z.string().min(1),
  category: z.string().nullish(),
  baseUnit: z.string().min(1),
  barcode: z.string().nullish(),
  stock: nonNegativeInt,
  trackStock: z.boolean(),
  isActive: z.boolean(),
  variants: z.array(variantSchema).min(1),
})

/** Validasi data toko dari Firestore lalu bentuk `StoreInfo`. Null bila data rusak. */
export function parseStore(id: string, data: unknown): StoreInfo | null {
  const result = storeDocSchema.safeParse(data)
  if (!result.success) return null
  const { address, phone, ...rest } = result.data
  return { id, ...rest, address: address ?? null, phone: phone ?? null }
}

/** Validasi dokumen `users/{uid}`. Null bila data rusak. */
export function parseUserProfile(data: unknown): UserProfile | null {
  const result = userDocSchema.safeParse(data)
  return result.success ? result.data : null
}

/** Validasi dokumen barang. Null bila data rusak (barang itu dilewati, bukan merusak daftar). */
export function parseProduct(id: string, data: unknown): Product | null {
  const result = productDocSchema.safeParse(data)
  if (!result.success) return null
  const { category, barcode, ...rest } = result.data
  return { id, ...rest, category: category ?? null, barcode: barcode ?? null }
}
