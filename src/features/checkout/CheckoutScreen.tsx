import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import { PageHeader } from '@/components/layout/PageHeader'
import { Sheet } from '@/components/ui/Sheet'
import type { RecordedSale } from '@/data/saleRepo'
import { can } from '@/domain/permissions'
import { useReadySession } from '@/features/auth/useReadySession'
import { ScanSearchBar } from '@/features/scanner/ScanSearchBar'
import { useIsOnline } from '@/lib/useConnectivity'
import { useHardwareScanner } from '@/lib/useHardwareScanner'

import { CartList } from './CartList'
import { CheckoutBar } from './CheckoutBar'
import { CheckoutContent } from './CheckoutContent'
import { ClearCartButton } from './ClearCartButton'
import { PaymentForm } from './PaymentForm'
import { SaleSuccess } from './SaleSuccess'
import { useCheckout } from './useCheckout'
import { VariantSheet } from './VariantSheet'

export function CheckoutScreen() {
  const { profile } = useReadySession()
  const checkout = useCheckout()
  const { store, user, cart } = checkout
  const online = useIsOnline()
  const [text, setText] = useState('')
  const [paying, setPaying] = useState(false)
  const [sale, setSale] = useState<RecordedSale | null>(null)
  const hasItems = cart.lines.length > 0

  // Scanner fisik hanya aktif saat tidak ada jendela lain yang terbuka.
  useHardwareScanner(checkout.handleScan, !checkout.variantProduct && !paying && !sale)

  const blockedReason = !online
    ? 'Tidak ada internet. Transaksi belum bisa disimpan.'
    : Object.keys(cart.shortages).length > 0
      ? 'Ada barang yang stoknya kurang. Kurangi jumlahnya dulu.'
      : null

  return (
    <>
      <PageHeader
        title="Kasir"
        subtitle={store.name}
        action={hasItems ? <ClearCartButton onClear={checkout.clearCart} /> : undefined}
      />
      <div className="flex flex-col gap-4">
        <ScanSearchBar
          placeholder="Cari barang atau scan barcode"
          value={text}
          onValueChange={setText}
          onScan={checkout.handleScan}
          scannerTitle="Scan barang"
          continuous
        />
        {hasItems && <CartList cart={cart} onQtyChange={checkout.setQty} />}
        <CheckoutContent
          products={checkout.products}
          entries={checkout.entries}
          searchText={text}
          lowStockThreshold={store.lowStockThreshold}
          canManageInventory={can(profile.role, 'manageInventory')}
          onPick={checkout.pickProduct}
        />
        {hasItems && (
          <CheckoutBar
            total={cart.total}
            itemCount={cart.itemCount}
            blockedReason={blockedReason}
            onPay={() => {
              setPaying(true)
            }}
          />
        )}
      </div>

      <VariantSheet
        product={checkout.variantProduct}
        entries={checkout.entries}
        onPick={checkout.pickVariant}
        onClose={checkout.closeVariant}
      />
      <Sheet
        open={paying}
        onClose={() => {
          setPaying(false)
        }}
        title="Bayar tunai"
      >
        <PaymentForm
          storeId={store.id}
          cashier={{ uid: user.uid, name: user.displayName }}
          entries={checkout.entries}
          total={cart.total}
          itemCount={cart.itemCount}
          onPaid={(recorded) => {
            checkout.clearCart()
            setText('')
            setPaying(false)
            setSale(recorded)
          }}
        />
      </Sheet>
      {createPortal(
        <AnimatePresence>
          {sale && (
            <SaleSuccess
              key={sale.saleId}
              sale={sale}
              store={store}
              onDone={() => {
                setSale(null)
              }}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
