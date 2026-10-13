import { Archive } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/Button'
import { ConfirmSheet } from '@/components/ui/ConfirmSheet'
import { ROUTES } from '@/config/routes'
import { deactivateProduct } from '@/data/productRepo'
import type { Product } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { useIsOnline } from '@/lib/useConnectivity'
import { useToastStore } from '@/store/toastStore'

type DeactivateProductButtonProps = {
  storeId: string
  product: Product
}

export function DeactivateProductButton({ storeId, product }: DeactivateProductButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const navigate = useNavigate()
  const online = useIsOnline()
  const showToast = useToastStore((state) => state.show)

  const deactivate = useCallback(async () => {
    await deactivateProduct(storeId, product.id)
    showToast(`${product.name} dinonaktifkan`, 'info')
    void navigate(ROUTES.inventory)
  }, [storeId, product.id, product.name, showToast, navigate])
  const { run, pending, error } = useAsyncAction(deactivate)

  return (
    <>
      <Button
        variant="dangerOutline"
        fullWidth
        disabled={!online}
        onClick={() => {
          setConfirming(true)
        }}
      >
        <Archive className="size-5" aria-hidden="true" />
        Nonaktifkan barang
      </Button>
      <ConfirmSheet
        open={confirming}
        title={`Nonaktifkan ${product.name}?`}
        description={
          error ??
          'Barang tidak muncul lagi di Kasir & Stok. Riwayat transaksi tetap aman, dan barcode-nya bisa dipakai barang lain.'
        }
        confirmLabel="Ya, nonaktifkan"
        tone="danger"
        loading={pending}
        onConfirm={() => void run()}
        onClose={() => {
          setConfirming(false)
        }}
      />
    </>
  )
}
