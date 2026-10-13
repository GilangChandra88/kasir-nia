import { Store } from 'lucide-react'
import * as m from 'motion/react-m'

import { Mascot } from '@/components/brand/Mascot'
import { fadeUpItem, popInItem, staggerContainer } from '@/components/motion/variants'
import { Button } from '@/components/ui/Button'
import { signOutUser } from '@/data/authRepo'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { firstName } from '@/lib/names'
import { useSessionStore } from '@/store/sessionStore'

import { CreateStoreForm } from './CreateStoreForm'

export function CreateStoreScreen() {
  const session = useSessionStore((state) => state.session)
  const signOut = useAsyncAction(signOutUser)

  if (session.status !== 'needsStore') return null
  const { user } = session

  return (
    <m.main
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pt-[max(env(safe-area-inset-top),2.5rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]"
    >
      <m.div variants={popInItem} className="relative mx-auto mb-6 grid place-items-center">
        <div className="absolute size-36 rounded-full bg-navy-100" />
        <Mascot className="relative w-24" />
      </m.div>

      <m.h1 variants={fadeUpItem} className="text-center text-3xl font-extrabold tracking-tight">
        Halo, {firstName(user.displayName)}! 👋
      </m.h1>
      <m.p variants={fadeUpItem} className="mt-2 text-center text-muted">
        Satu langkah lagi: beri nama tokomu.
      </m.p>

      <m.div variants={fadeUpItem} className="mt-8 rounded-3xl bg-card p-5 shadow-soft">
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-navy-50 p-3 text-sm text-navy-800">
          <Store className="size-5 shrink-0 text-navy-600" aria-hidden="true" />
          <p>
            Anda akan menjadi <strong>Pemilik</strong> toko ini dan bisa menambahkan kasir.
          </p>
        </div>
        <CreateStoreForm user={user} />
      </m.div>

      <m.footer variants={fadeUpItem} className="mt-auto pt-8 text-center text-sm text-muted">
        <p>
          <strong className="text-navy-950">Kasir?</strong> Jangan buat toko. Minta pemilik
          mendaftarkan <span className="font-semibold break-all text-navy-950">{user.email}</span>,
          lalu masuk lagi.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          loading={signOut.pending}
          onClick={() => void signOut.run()}
        >
          Ganti akun
        </Button>
      </m.footer>
    </m.main>
  )
}
