import { z } from 'zod'

import type { StoreInfo, UserProfile } from '@/domain/types'

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
})

/** Validasi data toko dari Firestore lalu bentuk `StoreInfo`. Null bila data rusak. */
export function parseStore(id: string, data: unknown): StoreInfo | null {
  const result = storeDocSchema.safeParse(data)
  if (!result.success) return null
  const { name, ownerUid, address, phone } = result.data
  return { id, name, ownerUid, address: address ?? null, phone: phone ?? null }
}

/** Validasi dokumen `users/{uid}`. Null bila data rusak. */
export function parseUserProfile(data: unknown): UserProfile | null {
  const result = userDocSchema.safeParse(data)
  return result.success ? result.data : null
}
