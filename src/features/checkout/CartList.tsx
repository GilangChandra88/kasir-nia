import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

import { Card } from '@/components/ui/Card'
import { SPRING } from '@/config/motion'
import type { ResolvedCart } from '@/domain/cart'
import { formatNumber } from '@/domain/money'

import { CartLineRow } from './CartLineRow'

type CartListProps = {
  cart: ResolvedCart
  onQtyChange: (productId: string, variantId: string, qty: number) => void
}

/** Isi keranjang: baris baru "meletup" masuk, baris dihapus meluncur keluar. */
export function CartList({ cart, onQtyChange }: CartListProps) {
  return (
    <Card className="py-2">
      <h2 className="pt-2 text-sm font-semibold text-muted">
        Keranjang · {formatNumber(cart.itemCount)} barang
      </h2>
      <ul className="divide-y divide-line">
        <AnimatePresence initial={false}>
          {cart.lines.map((line) => (
            <m.li
              key={line.key}
              layout
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={SPRING.bouncy}
            >
              <CartLineRow
                line={line}
                shortageStock={cart.shortages[line.product.id]}
                onQtyChange={(qty) => {
                  onQtyChange(line.product.id, line.variant.id, qty)
                }}
              />
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  )
}
