import { ReceiptText, Users } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SettingRow } from '@/components/ui/SettingRow'
import { ROUTES } from '@/config/routes'

/** Pengaturan khusus pemilik toko. */
export function OwnerSettingsCard() {
  return (
    <Card>
      <h2 className="mb-1 text-sm font-semibold text-muted">Pengaturan toko</h2>
      <div className="divide-y divide-line">
        <SettingRow
          icon={ReceiptText}
          label="Toko & struk"
          description="Nama, alamat, telepon, isi struk, batas stok"
          to={ROUTES.storeSettings}
        />
        <SettingRow
          icon={Users}
          label="Kelola kasir"
          description="Tambah kasir lewat email Google"
          trailing={<Badge tone="muted">Segera</Badge>}
        />
      </div>
    </Card>
  )
}
