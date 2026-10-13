import { MAX_VARIANTS } from '@/config/limits'

import type { Product } from './types'

/** Isian jenis di form; angka masih boleh kosong (null) selama diketik. */
export type VariantDraft = {
  id: string
  label: string
  price: number | null
  baseQty: number | null
}

/** Isian form barang apa adanya, sebelum divalidasi (`domain/product.ts`). */
export type ProductDraft = {
  name: string
  category: string
  baseUnit: string
  barcode: string
  trackStock: boolean
  /** Hanya dipakai saat membuat barang baru; stok barang lama diubah lewat "Atur stok". */
  initialStock: number | null
  variants: VariantDraft[]
}

export type DraftTextField = 'name' | 'category' | 'baseUnit' | 'barcode'

export type VariantTemplateId = 'single' | 'packAndLoose'

/** Urutan tampil template di editor jenis. */
export const VARIANT_TEMPLATE_IDS: readonly VariantTemplateId[] = ['single', 'packAndLoose']

export type DraftAction =
  | { type: 'setText'; field: DraftTextField; value: string }
  | { type: 'setTrackStock'; value: boolean }
  | { type: 'setInitialStock'; value: number | null }
  | { type: 'addVariant'; id: string }
  | { type: 'updateVariant'; id: string; patch: Partial<Omit<VariantDraft, 'id'>> }
  | { type: 'removeVariant'; id: string }
  | { type: 'applyTemplate'; template: VariantTemplateId; ids: readonly string[] }

type TemplateRow = { label: string; baseQty: number }

/** Template cepat editor jenis. "Bungkus + eceran" untuk kasus seperti rokok. */
export const VARIANT_TEMPLATES: Record<
  VariantTemplateId,
  { title: string; baseUnit: string | null; rows: (unit: string) => TemplateRow[] }
> = {
  single: {
    title: 'Satuan saja',
    baseUnit: null,
    rows: (unit) => [{ label: `1 ${unit}`, baseQty: 1 }],
  },
  packAndLoose: {
    title: 'Bungkus + eceran',
    baseUnit: 'batang',
    rows: () => [
      { label: '1 bungkus', baseQty: 20 },
      { label: '1 batang', baseQty: 1 },
      { label: '3 batang', baseQty: 3 },
    ],
  },
}

const DEFAULT_BASE_UNIT = 'pcs'

export function emptyDraft(firstVariantId: string): ProductDraft {
  return {
    name: '',
    category: '',
    baseUnit: DEFAULT_BASE_UNIT,
    barcode: '',
    trackStock: true,
    initialStock: null,
    variants: [{ id: firstVariantId, label: `1 ${DEFAULT_BASE_UNIT}`, price: null, baseQty: 1 }],
  }
}

export function draftFromProduct(product: Product): ProductDraft {
  return {
    name: product.name,
    category: product.category ?? '',
    baseUnit: product.baseUnit,
    barcode: product.barcode ?? '',
    trackStock: product.trackStock,
    initialStock: null,
    variants: product.variants.map((variant) => ({ ...variant })),
  }
}

function applyTemplate(
  draft: ProductDraft,
  template: VariantTemplateId,
  ids: readonly string[],
): ProductDraft {
  const { baseUnit, rows } = VARIANT_TEMPLATES[template]
  const unit = baseUnit ?? (draft.baseUnit.trim() || DEFAULT_BASE_UNIT)
  const variants = rows(unit).flatMap((row, index) => {
    const id = ids[index]
    return id ? [{ id, label: row.label, price: null, baseQty: row.baseQty }] : []
  })
  return variants.length > 0 ? { ...draft, baseUnit: unit, variants } : draft
}

/** Reducer murni untuk form barang (dipakai `useReducer`). */
export function productDraftReducer(draft: ProductDraft, action: DraftAction): ProductDraft {
  switch (action.type) {
    case 'setText':
      return { ...draft, [action.field]: action.value }
    case 'setTrackStock':
      return { ...draft, trackStock: action.value }
    case 'setInitialStock':
      return { ...draft, initialStock: action.value }
    case 'addVariant':
      if (draft.variants.length >= MAX_VARIANTS) return draft
      return {
        ...draft,
        variants: [...draft.variants, { id: action.id, label: '', price: null, baseQty: null }],
      }
    case 'updateVariant':
      return {
        ...draft,
        variants: draft.variants.map((variant) =>
          variant.id === action.id ? { ...variant, ...action.patch } : variant,
        ),
      }
    case 'removeVariant':
      // Minimal satu jenis harus ada agar barang bisa dijual.
      if (draft.variants.length <= 1) return draft
      return { ...draft, variants: draft.variants.filter((variant) => variant.id !== action.id) }
    case 'applyTemplate':
      return applyTemplate(draft, action.template, action.ids)
  }
}
