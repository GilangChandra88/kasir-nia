import { Mascot } from '@/components/brand/Mascot'
import { useConnectivity } from '@/lib/useConnectivity'

/** Layar saat sesi dimuat. Saat offline tanpa data tersimpan, jelaskan bahwa sedang menunggu sinyal. */
export function SplashScreen() {
  const offline = useConnectivity() === 'offline'

  return (
    <div className="grid min-h-dvh place-items-center px-6" role="status">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6 grid place-items-center">
          <div className="absolute size-36 rounded-full bg-navy-100" />
          <Mascot className="relative w-24" />
        </div>
        <p className="font-semibold">{offline ? 'Menunggu internet…' : 'Menyiapkan kasir…'}</p>
        {offline && (
          <p className="mt-1 max-w-64 text-sm text-muted">
            Sambungkan HP ke internet untuk masuk pertama kali.
          </p>
        )}
      </div>
    </div>
  )
}
