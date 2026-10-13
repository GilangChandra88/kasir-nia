import {
  ADDRESS_MAX_LENGTH,
  MAX_STOCK,
  PHONE_MAX_LENGTH,
  RECEIPT_NOTE_MAX_LENGTH,
} from '@/config/limits'

import { formatNumber } from './money'
import { normalizeText } from './product'
import { validateStoreName } from './store'
import type { ReceiptSettings, StoreInfo } from './types'
import { definedOnly } from './validation'

/** Isian form "Toko & Struk" apa adanya. */
export type StoreProfileDraft = {
  name: string
  address: string
  phone: string
  headerNote: string
  footerNote: string
  showCashier: boolean
  lowStockThreshold: number | null
}

/** Data toko yang sudah divalidasi dan siap disimpan. */
export type StoreProfileInput = Pick<
  StoreInfo,
  'name' | 'address' | 'phone' | 'lowStockThreshold'
> & {
  receipt: ReceiptSettings
}

export type StoreProfileErrors = Partial<Record<keyof StoreProfileDraft, string>>

export type StoreProfileValidation =
  { ok: true; value: StoreProfileInput } | { ok: false; errors: StoreProfileErrors }

/** Nomor telepon: angka, spasi, +, -, dan tanda kurung. */
const PHONE_PATTERN = /^[0-9+\-() ]*$/

export function draftFromStore(store: StoreInfo): StoreProfileDraft {
  return {
    name: store.name,
    address: store.address ?? '',
    phone: store.phone ?? '',
    headerNote: store.receipt.headerNote ?? '',
    footerNote: store.receipt.footerNote,
    showCashier: store.receipt.showCashier,
    lowStockThreshold: store.lowStockThreshold,
  }
}

const tooLong = (value: string, max: number, label: string) =>
  value.length > max ? `${label} maksimal ${max} huruf.` : undefined

function phoneError(phone: string) {
  if (!PHONE_PATTERN.test(phone)) return 'Telepon hanya boleh angka, spasi, +, -, dan ( ).'
  return tooLong(phone, PHONE_MAX_LENGTH, 'Telepon')
}

function thresholdError(value: number | null) {
  if (value === null) return 'Batas stok menipis wajib diisi.'
  if (value > MAX_STOCK) return `Batas stok maksimal ${formatNumber(MAX_STOCK)}.`
  return undefined
}

/** Memeriksa form "Toko & Struk". Teks dirapikan; isian opsional yang kosong menjadi null. */
export function validateStoreProfile(draft: StoreProfileDraft): StoreProfileValidation {
  const name = validateStoreName(draft.name)
  const address = normalizeText(draft.address)
  const phone = normalizeText(draft.phone)
  const headerNote = normalizeText(draft.headerNote)
  const footerNote = normalizeText(draft.footerNote)

  const errors = definedOnly({
    name: name.ok ? undefined : name.message,
    address: tooLong(address, ADDRESS_MAX_LENGTH, 'Alamat'),
    phone: phoneError(phone),
    headerNote: tooLong(headerNote, RECEIPT_NOTE_MAX_LENGTH, 'Catatan atas'),
    footerNote: tooLong(footerNote, RECEIPT_NOTE_MAX_LENGTH, 'Catatan penutup'),
    lowStockThreshold: thresholdError(draft.lowStockThreshold),
  })
  if (!name.ok || Object.keys(errors).length > 0) return { ok: false, errors }

  return {
    ok: true,
    value: {
      name: name.value,
      address: address === '' ? null : address,
      phone: phone === '' ? null : phone,
      lowStockThreshold: draft.lowStockThreshold ?? 0,
      receipt: {
        headerNote: headerNote === '' ? null : headerNote,
        footerNote,
        showCashier: draft.showCashier,
      },
    },
  }
}
