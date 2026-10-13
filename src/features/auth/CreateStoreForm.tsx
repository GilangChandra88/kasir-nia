import { type SubmitEvent, useCallback, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { STORE_NAME_MAX_LENGTH } from '@/config/limits'
import { createStore } from '@/data/storeRepo'
import { validateStoreName } from '@/domain/store'
import type { AuthUser } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { useIsOnline } from '@/lib/useConnectivity'

type CreateStoreFormProps = {
  user: AuthUser
}

export function CreateStoreForm({ user }: CreateStoreFormProps) {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const online = useIsOnline()

  const create = useCallback((value: string) => createStore(user, value), [user])
  const { run, pending, error } = useAsyncAction(create)

  const validation = validateStoreName(name)
  // Galat isian baru ditampilkan setelah mencoba kirim, agar tidak "memarahi" saat baru mengetik.
  const fieldError = submitted && !validation.ok ? validation.message : null

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (validation.ok) void run(validation.value)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField
        label="Nama toko"
        placeholder="Contoh: Toko Nia Jaya"
        autoComplete="organization"
        maxLength={STORE_NAME_MAX_LENGTH + 10}
        value={name}
        onChange={(event) => {
          setName(event.target.value)
        }}
        error={fieldError}
        hint="Nama ini tampil di struk. Bisa diubah nanti di Profil."
      />
      <Button type="submit" size="lg" fullWidth loading={pending} disabled={!online}>
        Buat toko
      </Button>
      <p role="alert" className="min-h-5 text-center text-sm text-danger">
        {online ? error : 'Butuh internet untuk membuat toko.'}
      </p>
    </form>
  )
}
