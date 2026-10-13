import {
  BARCODE_MAX_LENGTH,
  BARCODE_MIN_LENGTH,
  BASE_UNIT_MAX_LENGTH,
  CATEGORY_MAX_LENGTH,
  MAX_BASE_QTY,
  MAX_PRICE,
  MAX_STOCK,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_NAME_MIN_LENGTH,
  VARIANT_LABEL_MAX_LENGTH,
} from '@/config/limits'

import { formatNumber } from './money'
import type { ProductDraft, VariantDraft } from './productDraft'
import type { ProductInput, Variant } from './types'

export type VariantErrors = Partial<Record<'label' | 'price' | 'baseQty', string>>

export type ProductErrors = Partial<
  Record<'name' | 'category' | 'baseUnit' | 'barcode' | 'initialStock', string>
> & {
  /** Galat per jenis, dikunci dengan id jenis. */
  variants: Record<string, VariantErrors>
}

export type ProductValidation =
  { ok: true; value: ProductInput; initialStock: number } | { ok: false; errors: ProductErrors }

/** Huruf, angka, dan tanda hubung saja — aman dipakai sebagai ID dokumen Firestore. */
const BARCODE_PATTERN = /^[A-Za-z0-9-]+$/

/** Spasi di tepi dibuang & spasi ganda dirapatkan. */
export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

/** Barcode dari scanner/ketikan: semua spasi dibuang. */
export function normalizeBarcode(value: string): string {
  return value.replace(/\s+/g, '')
}

function lengthError(value: string, label: string, min: number, max: number) {
  if (value.length < min)
    return min === 1 ? `${label} wajib diisi.` : `${label} minimal ${min} huruf.`
  if (value.length > max) return `${label} maksimal ${max} huruf.`
  return undefined
}

function barcodeError(barcode: string) {
  if (barcode === '') return undefined
  if (!BARCODE_PATTERN.test(barcode)) return 'Barcode hanya boleh huruf, angka, dan tanda hubung.'
  return lengthError(barcode, 'Barcode', BARCODE_MIN_LENGTH, BARCODE_MAX_LENGTH)
}

function integerError(value: number | null, label: string, min: number, max: number) {
  if (value === null) return `${label} wajib diisi.`
  if (!Number.isInteger(value) || value < min) return `${label} minimal ${formatNumber(min)}.`
  if (value > max) return `${label} maksimal ${formatNumber(max)}.`
  return undefined
}

/** Hanya menyisakan isian yang benar-benar bergalat. */
function definedOnly<K extends string>(
  checks: Record<K, string | undefined>,
): Partial<Record<K, string>> {
  const result: Partial<Record<K, string>> = {}
  for (const key of Object.keys(checks) as K[]) {
    const message = checks[key]
    if (message !== undefined) result[key] = message
  }
  return result
}

function variantErrors(variant: VariantDraft, duplicateLabels: Set<string>): VariantErrors {
  const label = normalizeText(variant.label)
  return definedOnly({
    label: duplicateLabels.has(label.toLowerCase())
      ? 'Nama jenis tidak boleh sama.'
      : lengthError(label, 'Nama jenis', 1, VARIANT_LABEL_MAX_LENGTH),
    price: integerError(variant.price, 'Harga', 1, MAX_PRICE),
    baseQty: integerError(variant.baseQty, 'Isi', 1, MAX_BASE_QTY),
  })
}

function findDuplicateLabels(variants: VariantDraft[]): Set<string> {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const variant of variants) {
    const key = normalizeText(variant.label).toLowerCase()
    if (key !== '' && seen.has(key)) duplicates.add(key)
    seen.add(key)
  }
  return duplicates
}

function toVariant(variant: VariantDraft): Variant {
  return {
    id: variant.id,
    label: normalizeText(variant.label),
    price: variant.price ?? 0,
    baseQty: variant.baseQty ?? 1,
  }
}

/**
 * Memeriksa isian form barang. Lolos → data siap simpan (teks dirapikan, harga rupiah integer,
 * stok awal dalam satuan dasar). Gagal → pesan galat per isian & per jenis.
 */
export function validateProductDraft(draft: ProductDraft): ProductValidation {
  const name = normalizeText(draft.name)
  const category = normalizeText(draft.category)
  const baseUnit = normalizeText(draft.baseUnit)
  const barcode = normalizeBarcode(draft.barcode)
  const initialStock = draft.trackStock ? (draft.initialStock ?? 0) : 0
  const duplicates = findDuplicateLabels(draft.variants)

  const fieldErrors = definedOnly({
    name: lengthError(name, 'Nama barang', PRODUCT_NAME_MIN_LENGTH, PRODUCT_NAME_MAX_LENGTH),
    category: lengthError(category, 'Kategori', 0, CATEGORY_MAX_LENGTH),
    baseUnit: lengthError(baseUnit, 'Satuan dasar', 1, BASE_UNIT_MAX_LENGTH),
    barcode: barcodeError(barcode),
    initialStock: integerError(initialStock, 'Stok awal', 0, MAX_STOCK),
  })
  const variantErrorMap: Record<string, VariantErrors> = {}
  for (const variant of draft.variants) {
    const found = variantErrors(variant, duplicates)
    if (Object.keys(found).length > 0) variantErrorMap[variant.id] = found
  }

  if (Object.keys(fieldErrors).length > 0 || Object.keys(variantErrorMap).length > 0) {
    return { ok: false, errors: { ...fieldErrors, variants: variantErrorMap } }
  }

  return {
    ok: true,
    initialStock,
    value: {
      name,
      category: category === '' ? null : category,
      baseUnit,
      barcode: barcode === '' ? null : barcode,
      trackStock: draft.trackStock,
      variants: draft.variants.map(toVariant),
    },
  }
}
