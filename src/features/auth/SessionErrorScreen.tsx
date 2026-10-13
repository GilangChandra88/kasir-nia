import { TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { signOutUser } from '@/data/authRepo'
import { useAsyncAction } from '@/features/shared/useAsyncAction'

type SessionErrorScreenProps = {
  message: string
  canSignOut: boolean
}

export function SessionErrorScreen({ message, canSignOut }: SessionErrorScreenProps) {
  const signOut = useAsyncAction(signOutUser)

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="mb-5 grid size-16 place-items-center rounded-3xl bg-danger/10 text-danger">
        <TriangleAlert className="size-8" aria-hidden="true" />
      </span>
      <h1 className="text-xl font-bold">Tidak bisa membuka toko</h1>
      <p className="mt-2 text-muted">{message}</p>
      <div className="mt-8 flex w-full flex-col gap-2">
        <Button
          size="lg"
          fullWidth
          onClick={() => {
            window.location.reload()
          }}
        >
          Coba lagi
        </Button>
        {canSignOut && (
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            loading={signOut.pending}
            onClick={() => void signOut.run()}
          >
            Keluar
          </Button>
        )}
      </div>
    </main>
  )
}
