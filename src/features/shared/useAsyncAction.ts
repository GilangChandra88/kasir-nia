import { useCallback, useState } from 'react'

import { describeError } from '@/data/errors'

type AsyncActionOptions = {
  /** Galat yang tidak perlu ditampilkan (mis. pengguna menutup jendela login). */
  ignoreError?: (error: unknown) => boolean
}

/** Menjalankan aksi async dengan status `pending` & pesan galat berbahasa Indonesia. */
export function useAsyncAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<void>,
  { ignoreError }: AsyncActionOptions = {},
) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (...args: Args) => {
      setPending(true)
      setError(null)
      try {
        await action(...args)
      } catch (caught) {
        if (!ignoreError?.(caught)) setError(describeError(caught))
      } finally {
        setPending(false)
      }
    },
    [action, ignoreError],
  )

  return { run, pending, error }
}
