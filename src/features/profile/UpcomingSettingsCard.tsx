import { ReceiptText, SlidersHorizontal, Users } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SettingRow } from '@/components/ui/SettingRow'
import type { Role } from '@/domain/types'

type UpcomingSettingsCardProps = {
  role: Role
}

/** Menu pengaturan yang akan aktif di tahap berikutnya (lihat docs/RANCANGAN.md §15). */
export function UpcomingSettingsCard({ role }: UpcomingSettingsCardProps) {
  const soon = <Badge tone="muted">Segera</Badge>

  return (
    <Card>
      <h2 className="mb-1 text-sm font-semibold text-muted">Pengaturan</h2>
      <div className="divide-y divide-line">
        {role === 'owner' && (
          <SettingRow
            icon={Users}
            label="Kelola kasir"
            description="Tambah kasir lewat email Google"
            trailing={soon}
          />
        )}
        <SettingRow
          icon={ReceiptText}
          label="Pengaturan struk"
          description="Alamat, telepon, catatan penutup"
          trailing={soon}
        />
        <SettingRow
          icon={SlidersHorizontal}
          label="Bunyi & getar scan"
          description="Atur umpan balik saat scan barcode"
          trailing={soon}
        />
      </div>
    </Card>
  )
}
