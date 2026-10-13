import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { playBeep, unlockAudio, vibrate } from '@/lib/feedback'
import { useDevicePrefsStore } from '@/store/devicePrefsStore'

/** Umpan balik saat scan berhasil. Tersimpan di HP ini saja. */
export function ScanFeedbackCard() {
  const { scanBeep, scanVibrate, setScanBeep, setScanVibrate } = useDevicePrefsStore()

  return (
    <Card>
      <h2 className="text-sm font-semibold text-muted">Scan barcode di HP ini</h2>
      <div className="mt-3 flex flex-col gap-3">
        <Switch
          checked={scanBeep}
          label="Bunyi bip"
          description="Terdengar setiap barcode terbaca."
          onChange={(on) => {
            setScanBeep(on)
            // Contoh bunyi langsung agar pengguna tahu seperti apa.
            if (on) {
              unlockAudio()
              playBeep()
            }
          }}
        />
        <Switch
          checked={scanVibrate}
          label="Getar"
          description="HP bergetar singkat setiap barcode terbaca."
          onChange={(on) => {
            setScanVibrate(on)
            if (on) vibrate()
          }}
        />
      </div>
    </Card>
  )
}
