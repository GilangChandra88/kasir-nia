import { Plus } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import type { Dispatch } from 'react'

import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { SectionCard } from '@/components/ui/SectionCard'
import { MAX_VARIANTS } from '@/config/limits'
import { SPRING } from '@/config/motion'
import type { ProductErrors } from '@/domain/product'
import {
  type DraftAction,
  type ProductDraft,
  VARIANT_TEMPLATE_IDS,
  VARIANT_TEMPLATES,
  type VariantTemplateId,
} from '@/domain/productDraft'
import { createId } from '@/lib/id'

import { VariantRow } from './VariantRow'

type VariantEditorProps = {
  draft: ProductDraft
  dispatch: Dispatch<DraftAction>
  errors: ProductErrors | null
  /** Template hanya ditawarkan untuk barang baru agar jenis lama tidak tertimpa tanpa sengaja. */
  isNew: boolean
}

export function VariantEditor({ draft, dispatch, errors, isNew }: VariantEditorProps) {
  const baseUnit = draft.baseUnit.trim() || 'satuan'
  const canRemove = draft.variants.length > 1

  const applyTemplate = (template: VariantTemplateId) => {
    const ids = Array.from({ length: MAX_VARIANTS }, createId)
    dispatch({ type: 'applyTemplate', template, ids })
  }

  return (
    <SectionCard
      title="Jenis & harga"
      description={`Satu barang bisa dijual dalam beberapa jenis. Isi = berapa ${baseUnit} terpakai per 1 jenis.`}
    >
      {isNew && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Template cepat:</span>
          {VARIANT_TEMPLATE_IDS.map((template) => (
            <Chip
              key={template}
              onClick={() => {
                applyTemplate(template)
              }}
            >
              {VARIANT_TEMPLATES[template].title}
            </Chip>
          ))}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {draft.variants.map((variant, index) => (
            <m.li
              key={variant.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -24 }}
              transition={SPRING.gentle}
            >
              <VariantRow
                variant={variant}
                index={index}
                baseUnit={baseUnit}
                dispatch={dispatch}
                errors={errors?.variants[variant.id]}
                canRemove={canRemove}
              />
            </m.li>
          ))}
        </AnimatePresence>
      </ul>

      <Button
        variant="secondary"
        fullWidth
        disabled={draft.variants.length >= MAX_VARIANTS}
        onClick={() => {
          dispatch({ type: 'addVariant', id: createId() })
        }}
      >
        <Plus className="size-5" aria-hidden="true" />
        Tambah jenis
      </Button>
    </SectionCard>
  )
}
