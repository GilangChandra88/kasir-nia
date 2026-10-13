import { MapPin, Phone, Store } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { SettingRow } from '@/components/ui/SettingRow'
import type { StoreInfo } from '@/domain/types'

type StoreCardProps = {
  store: StoreInfo
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Card>
      <h2 className="mb-1 text-sm font-semibold text-muted">Toko</h2>
      <div className="divide-y divide-line">
        <SettingRow icon={Store} label={store.name} description="Nama toko" />
        <SettingRow icon={MapPin} label={store.address ?? 'Belum diisi'} description="Alamat" />
        <SettingRow icon={Phone} label={store.phone ?? 'Belum diisi'} description="Telepon" />
      </div>
    </Card>
  )
}
