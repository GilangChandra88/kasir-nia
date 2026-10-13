import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useState } from 'react'

import { Chip } from '@/components/ui/Chip'
import { SearchField } from '@/components/ui/SearchField'
import { SPRING } from '@/config/motion'
import { countByFilter, filterProducts, type StockFilter } from '@/domain/inventory'
import type { Product } from '@/domain/types'

import { ProductListItem } from './ProductListItem'

const FILTERS: readonly { value: StockFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'low', label: 'Menipis' },
  { value: 'out', label: 'Habis' },
]

type InventoryListProps = {
  products: Product[]
  lowStockThreshold: number
  editable: boolean
}

export function InventoryList({ products, lowStockThreshold, editable }: InventoryListProps) {
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<StockFilter>('all')

  const counts = countByFilter(products, lowStockThreshold)
  const visible = filterProducts(products, { text, filter, threshold: lowStockThreshold })

  return (
    <div className="flex flex-col gap-3">
      <SearchField
        label="Cari barang"
        placeholder="Cari nama, kategori, atau barcode"
        value={text}
        onValueChange={setText}
      />
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map(({ value, label }) => (
          <Chip
            key={value}
            selected={filter === value}
            count={counts[value]}
            onClick={() => {
              setFilter(value)
            }}
          >
            {label}
          </Chip>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((product) => (
            <m.li
              key={product.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={SPRING.gentle}
            >
              <ProductListItem
                product={product}
                lowStockThreshold={lowStockThreshold}
                editable={editable}
              />
            </m.li>
          ))}
        </AnimatePresence>
      </ul>

      {visible.length === 0 && (
        <p className="py-10 text-center text-sm text-muted">
          Tidak ada barang yang cocok. Coba kata lain atau filter “Semua”.
        </p>
      )}
    </div>
  )
}
