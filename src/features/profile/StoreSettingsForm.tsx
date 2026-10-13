import { Save } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { NumberField } from '@/components/ui/NumberField'
import { SectionCard } from '@/components/ui/SectionCard'
import { Switch } from '@/components/ui/Switch'
import { TextField } from '@/components/ui/TextField'
import type { StoreInfo } from '@/domain/types'
import { useIsOnline } from '@/lib/useConnectivity'

import { ReceiptPreviewCard } from './ReceiptPreviewCard'
import { useStoreSettingsForm } from './useStoreSettingsForm'

type StoreSettingsFormProps = {
  store: StoreInfo
}

export function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const { draft, errors, set, submit, pending, error } = useStoreSettingsForm(store)
  const online = useIsOnline()

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <SectionCard title="Info toko" description="Tampil di bagian atas struk.">
        <TextField
          label="Nama toko"
          value={draft.name}
          onChange={(event) => {
            set('name', event.target.value)
          }}
          error={errors.name}
        />
        <TextField
          label="Alamat (opsional)"
          placeholder="Contoh: Jl. Raya Mawar No. 12"
          value={draft.address}
          onChange={(event) => {
            set('address', event.target.value)
          }}
          error={errors.address}
        />
        <TextField
          label="Telepon (opsional)"
          type="tel"
          inputMode="tel"
          placeholder="Contoh: 0812-3456-7890"
          value={draft.phone}
          onChange={(event) => {
            set('phone', event.target.value)
          }}
          error={errors.phone}
        />
      </SectionCard>

      <SectionCard title="Isi struk">
        <TextField
          label="Catatan atas (opsional)"
          placeholder="Contoh: Buka 07.00–22.00"
          value={draft.headerNote}
          onChange={(event) => {
            set('headerNote', event.target.value)
          }}
          error={errors.headerNote}
        />
        <TextField
          label="Catatan penutup"
          placeholder="Contoh: Terima kasih, datang lagi!"
          value={draft.footerNote}
          onChange={(event) => {
            set('footerNote', event.target.value)
          }}
          error={errors.footerNote}
        />
        <Switch
          checked={draft.showCashier}
          onChange={(on) => {
            set('showCashier', on)
          }}
          label="Tampilkan nama kasir"
          description="Berguna bila ada beberapa kasir."
        />
      </SectionCard>

      <SectionCard title="Stok">
        <NumberField
          label="Batas stok menipis"
          value={draft.lowStockThreshold}
          onValueChange={(value) => {
            set('lowStockThreshold', value)
          }}
          error={errors.lowStockThreshold}
          hint="Barang dengan stok sama atau di bawah angka ini (satuan dasar) ditandai menipis."
        />
      </SectionCard>

      <ReceiptPreviewCard draft={draft} />

      <div className="sticky bottom-above-nav z-20 -mx-1 rounded-3xl bg-paper/90 p-1 backdrop-blur">
        {(error ?? !online) && (
          <p role="alert" className="px-2 pb-2 text-center text-sm text-danger">
            {online ? error : 'Butuh internet untuk menyimpan.'}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={pending} disabled={!online}>
          <Save className="size-5" aria-hidden="true" />
          Simpan
        </Button>
      </div>
    </form>
  )
}
