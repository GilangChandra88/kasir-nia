import { UserPlus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { inviteCashier } from '@/data/teamRepo'
import { type InviteDraft, validateInvite } from '@/domain/team'
import type { StoreInfo } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { useIsOnline } from '@/lib/useConnectivity'
import { useToastStore } from '@/store/toastStore'

type InviteFormProps = {
  store: StoreInfo
  ownerUid: string
  /** Email yang sudah anggota/diundang di toko ini (huruf kecil). */
  takenEmails: string[]
  onDone: () => void
}

/** Isi sheet "Tambah kasir". Dipasang ulang setiap sheet dibuka. */
export function InviteForm({ store, ownerUid, takenEmails, onDone }: InviteFormProps) {
  const online = useIsOnline()
  const showToast = useToastStore((state) => state.show)
  const [draft, setDraft] = useState<InviteDraft>({ email: '', displayName: '' })
  const [submitted, setSubmitted] = useState(false)

  const validation = validateInvite(draft, { takenEmails })
  const errors = submitted && !validation.ok ? validation.errors : {}

  const { run, pending, error } = useAsyncAction(async (invite: InviteDraft) => {
    await inviteCashier({ storeId: store.id, storeName: store.name, ownerUid, invite })
    showToast(`${invite.displayName} ditambahkan. Minta login dengan ${invite.email}.`)
    onDone()
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
        if (validation.ok) void run(validation.value)
      }}
    >
      <TextField
        label="Email Google kasir"
        type="email"
        inputMode="email"
        autoCapitalize="none"
        autoComplete="off"
        placeholder="Contoh: sari@gmail.com"
        value={draft.email}
        onChange={(event) => {
          setDraft((current) => ({ ...current, email: event.target.value }))
        }}
        error={errors.email}
        hint="Kasir cukup login dengan email ini — tanpa kata sandi."
      />
      <TextField
        label="Nama panggilan"
        placeholder="Contoh: Sari"
        autoCapitalize="words"
        value={draft.displayName}
        onChange={(event) => {
          setDraft((current) => ({ ...current, displayName: event.target.value }))
        }}
        error={errors.displayName}
        hint="Tampil di struk dan riwayat transaksi."
      />
      <p role="alert" className="min-h-5 text-center text-sm text-danger">
        {online ? error : 'Butuh internet untuk menambah kasir.'}
      </p>
      <Button type="submit" size="lg" fullWidth loading={pending} disabled={!online}>
        <UserPlus className="size-5" aria-hidden="true" />
        Tambah kasir
      </Button>
    </form>
  )
}
