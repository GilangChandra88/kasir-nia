import { ChartColumn, Layers, ScanBarcode } from 'lucide-react'
import * as m from 'motion/react-m'

import { Mascot } from '@/components/brand/Mascot'
import { fadeUpItem, popInItem, staggerContainer } from '@/components/motion/variants'
import { signInWithGoogle } from '@/data/authRepo'
import { isCancelledSignIn } from '@/data/errors'
import { useAsyncAction } from '@/features/shared/useAsyncAction'

import { GoogleSignInButton } from './GoogleSignInButton'

const HIGHLIGHTS = [
  { icon: ScanBarcode, label: 'Scan barcode' },
  { icon: Layers, label: 'Stok berjenis' },
  { icon: ChartColumn, label: 'Rekap harian' },
] as const

export function LoginScreen() {
  const { run, pending, error } = useAsyncAction(signInWithGoogle, {
    ignoreError: isCancelledSignIn,
  })

  return (
    <m.main
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pt-[max(env(safe-area-inset-top),3rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]"
    >
      <section className="flex flex-1 flex-col items-center justify-center text-center">
        <m.div variants={popInItem} className="relative mb-8 grid place-items-center">
          <div className="absolute size-52 rounded-full bg-navy-100" />
          <Mascot className="relative w-36" />
        </m.div>

        <m.h1 variants={fadeUpItem} className="text-4xl font-extrabold tracking-tight">
          Nia Kasir
        </m.h1>
        <m.p variants={fadeUpItem} className="mt-2 text-base text-muted">
          Kasir toko di genggaman.
          <br />
          Scan, hitung, beres.
        </m.p>

        <m.ul variants={fadeUpItem} className="mt-8 flex flex-wrap justify-center gap-2">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-navy-800 shadow-soft"
            >
              <Icon className="size-4 text-navy-600" aria-hidden="true" />
              {label}
            </li>
          ))}
        </m.ul>
      </section>

      <m.footer variants={fadeUpItem} className="pt-8">
        <GoogleSignInButton loading={pending} onClick={() => void run()} />
        <p role="alert" className="mt-3 min-h-5 text-center text-sm text-danger">
          {error}
        </p>
        <p className="mt-1 text-center text-xs text-muted">
          Kasir? Minta pemilik toko mendaftarkan email Google Anda dulu.
        </p>
      </m.footer>
    </m.main>
  )
}
